import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';
import useStore from '../store';
import { filterDataByPeriod } from '../utils/dateUtils';
import { getTickerHistory } from '../utils/tickerUtils';
import { LoadingInline } from './LoadingComponent';
import { supabase } from '@supabase/auth-ui-shared';
// import supabase from '../SupabaseClient';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    // Different tooltip format for 1d view (time-based) vs other periods (date-based)
    const isOneDay = payload[0].minuteData;
    
    return (
      <div className="account-tooltip">
        {isOneDay ? (
          <div className="date">{moment(label).format('h:mm A')}</div>
        ) : (
          <div className="date">{moment(label).format('MMM DD, YYYY')}</div>
        )}
        <div className="portfolio-value">
          Portfolio: ${Number(payload[0].value).toFixed(2)}
        </div>
        <div className="cash-value">
          Cash: ${Number(payload[0].cash || 0).toFixed(2)}
        </div>
        <div className="holdings-value">
          Holdings: ${Number(payload[0].holdings || 0).toFixed(2)}
        </div>
        {payload[0].change !== undefined && (
          <div className={`change ${payload[0].change >= 0 ? 'pos' : 'err'}`}>
            {payload[0].change >= 0 ? '+' : ''}{Number(payload[0].change).toFixed(2)}%
          </div>
        )}
      </div>
    );
  }
  return null;
};

const AccountValTicker = () => {
  const user = useStore((state) => state.user);
  const [chartData, setChartData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [initialValue] = useState(10000); // Starting account value
  const [period, setPeriod] = useState('1d');
  const stockInfo = useStore((state) => state.stock_info);
  
  // Fetch all transactions for the user
  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) return;
      
      setIsLoading(true)
      try { 
        const {data, error} = await supabase
            .from('transactions')
            .select("*")
            .eq("user_id", user.id)
            .order("transaction_date", {ascending: true});
        if (error) throw error;
        console.log("fetched transactions:", data?.length || 0)

        if (data && data.length > 0) { 
            setTransactions(data)
        } else { 
            console.log("Nothing found")
            generateSampleData()
        }
      } catch (error) { 
        console.log("error fetching transaction: ", error)
      } finally { 
        setIsLoading(false); 
      }
    };
    
    fetchTransactions();
  }, [user]);

  const generateSampleData = () => {
    const today = moment();
    const sampleData = [];
    
    // Generate a month's worth of daily data
    for (let i = 30; i >= 0; i--) {
      const date = today.clone().subtract(i, 'days');
      // Slight random variations for a realistic chart
      const randomFactor = 0.98 + (Math.random() * 0.04); // ±2% variation
      
      sampleData.push({
        date: date.format('YYYY-MM-DD'),
        value: initialValue * randomFactor,
        cash: user?.accountValue || initialValue,
        holdings: (initialValue * randomFactor) - (user?.accountValue || initialValue),
        change: ((randomFactor - 1) * 100)
      });
    }
    
    setChartData(sampleData);
  };
  // Generate chart data
  useEffect(() => {
    const generateAccountValueData = async () => {
      if (!transactions.length) return;
      
      setIsLoading(true);
      try {
        // Special handling for 1d period - minute-by-minute data
        if (period === '1d') {
          return generateOneDayData();
        }
        
        // Get all unique tickers from transactions
        const tickers = [...new Set(transactions.map(t => t.ticker))];
        
        // Fetch historical data for each ticker
        const tickerHistories = {};
        for (const ticker of tickers) {
          const history = await getTickerHistory(ticker);
          tickerHistories[ticker] = history;
        }
        
        // Determine date range based on period
        const endDate = moment();
        let startDate;
        
        switch(period) {
          case '1m': startDate = moment().subtract(1, 'month'); break;
          case '3m': startDate = moment().subtract(3, 'months'); break;
          case '6m': startDate = moment().subtract(6, 'months'); break;
          case '1y': startDate = moment().subtract(1, 'year'); break;
          case 'all': startDate = moment(transactions[0].transaction_date); break;
          default: startDate = moment().subtract(1, 'month');
        }
        
        // Generate daily data points
        const dataPoints = [];
        let currentDate = startDate.clone();
        let currentHoldings = {}; // {ticker: quantity}
        let cashBalance = initialValue;
        
        // Find the first transaction date
        const firstTransactionDate = moment(transactions[0].transaction_date);
        if (firstTransactionDate.isAfter(startDate)) {
          currentDate = firstTransactionDate.clone();
        }
        
        // Iterate through each day in the period
        while (currentDate.isSameOrBefore(endDate, 'day')) {
          const dateString = currentDate.format('YYYY-MM-DD');
          
          // Process any transactions that occurred on or before this date
          for (const tx of transactions) {
            const txDate = moment(tx.transaction_date);
            if (txDate.isSameOrBefore(currentDate, 'day') && 
                txDate.isAfter(moment(dataPoints[dataPoints.length-1]?.date || 0))) {
              
              if (tx.transaction_type === 'buy') {
                // Subtract cash, add holdings
                cashBalance -= tx.quantity * tx.price;
                currentHoldings[tx.ticker] = (currentHoldings[tx.ticker] || 0) + tx.quantity;
              } else if (tx.transaction_type === 'sell') {
                // Add cash, subtract holdings
                cashBalance += tx.quantity * tx.price;
                currentHoldings[tx.ticker] = (currentHoldings[tx.ticker] || 0) - tx.quantity;
                // Remove ticker if quantity is zero
                if (currentHoldings[tx.ticker] <= 0) {
                  delete currentHoldings[tx.ticker];
                }
              }
            }
          }
          
          // Calculate portfolio value for this day
          let holdingsValue = 0;
          for (const [ticker, quantity] of Object.entries(currentHoldings)) {
            const history = tickerHistories[ticker];
            if (!history) continue;
            
            // Find closest price data for this date
            const priceData = history.find(h => moment(h.date).isSame(currentDate, 'day'));
            if (priceData) {
              holdingsValue += quantity * priceData.adjClose;
            }
          }
          
          const totalValue = cashBalance + holdingsValue;
          const percentChange = ((totalValue - initialValue) / initialValue) * 100;
          
          dataPoints.push({
            date: dateString,
            value: totalValue,
            cash: cashBalance,
            holdings: holdingsValue,
            change: percentChange
          });
          
          currentDate.add(1, 'day');
        }
        
        setChartData(dataPoints);
      } catch (error) {
        console.error("Error generating account value data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    function generateSimulatedIntradayData(ticker) {
        const marketOpen = moment().set({ hour: 9, minute: 30 });
        const marketClose = moment().set({ hour: 16, minute: 0 });
        let currentTime = marketOpen.clone();
        const data = [];
        
        // Get a baseline price to use
        const basePrice = 100; // You could look this up from your holdings if available
        
        // Generate minute-by-minute data
        while (currentTime.isSameOrBefore(marketClose)) {
            // Add some random variation to simulate price movements
            const timeProgress = (currentTime.hour() * 60 + currentTime.minute() - 570) / 390; // 0 to 1 from open to close
            const randomWalk = Math.sin(timeProgress * Math.PI) * (Math.random() * 0.05);
            
            data.push({
                minute: currentTime.format('HH:mm'),
                price: basePrice * (1 + randomWalk)
            });
            currentTime.add(1, 'minute');
        }
        
        return data;
    }
    // Function to generate minute-by-minute data for a single day
    const generateOneDayData = async () => {
        if (!user || !transactions.length) return;
        
        try {
            // Get all unique tickers from user holdings
            const userHoldings = {}; // Will store current holdings
            let cashBalance = user.accountValue || initialValue;
            
            // Check if today is a weekend and adjust to the most recent Friday if needed
            const today = moment();
            let targetDate = today.clone();
            
            // If it's Saturday (6) or Sunday (0), adjust to the most recent Friday
            if (today.day() === 6) { // Saturday
                targetDate = today.subtract(1, 'days');
            } else if (today.day() === 0) { // Sunday
                targetDate = today.subtract(2, 'days');
            }
            
            const targetDateStr = targetDate.format('YYYY-MM-DD');
            
            // Get today's transactions and all previous ones
            const todayTransactions = transactions.filter(tx => 
                moment(tx.transaction_date).format('YYYY-MM-DD') === targetDateStr
            );
            
            // Calculate initial holdings from previous transactions
            const previousTransactions = transactions.filter(tx => 
                moment(tx.transaction_date).format('YYYY-MM-DD') !== targetDateStr && 
                moment(tx.transaction_date).isBefore(targetDate)
            );
            
            // Process all previous transactions to get starting point for today
            previousTransactions.forEach(tx => {
                if (tx.transaction_type === 'buy') {
                    userHoldings[tx.ticker] = (userHoldings[tx.ticker] || 0) + tx.quantity;
                    // Note: We don't subtract from cashBalance since that's already reflected in user.accountValue
                } else if (tx.transaction_type === 'sell') {
                    userHoldings[tx.ticker] = (userHoldings[tx.ticker] || 0) - tx.quantity;
                    if (userHoldings[tx.ticker] <= 0) delete userHoldings[tx.ticker];
                }
            });
            
            // Get tickers that the user currently holds
            const tickers = Object.keys(userHoldings);
            
            // Fetch today's minute-by-minute data for held tickers
            const minuteData = {};
            for (const ticker of tickers) {
                try { 
                    if (stockInfo && stockInfo.symbol === ticker && stockInfo.oneDayHistory && stockInfo.oneDayHistory['1d']) {
                        minuteData[ticker] = stockInfo.oneDayHistory['1d'];
                    } else {
                    
                        minuteData[ticker] = generateSimulatedIntradayData(ticker); 
                    }
                }catch (error) {
                    console.error("Error fetching minute data for", ticker, error);
                    minuteData[ticker] = generateSimulatedIntradayData(ticker)
                }
                
            } 
            // Market hours are 9:30 AM to 4:00 PM ET - based on target date
            const marketOpenTime = targetDate.clone().set({ hour: 9, minute: 30, second: 0, millisecond: 0 });
            const marketCloseTime = targetDate.clone().set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
            
            // Create a minute-by-minute timeline
            const timeline = [];
            let currentTime = marketOpenTime.clone();
            
            while (currentTime.isSameOrBefore(marketCloseTime)) {
                timeline.push(currentTime.clone());
                currentTime.add(1, 'minute');
            }
            
            // Generate data points for each minute
            const dataPoints = [];
            let currentHoldings = {...userHoldings}; // Start with previous holdings
            let currentCashBalance = cashBalance;
            
            timeline.forEach(time => {
                const timeString = time.format('HH:mm');
                
                // Process any transactions that happened before or at this minute on the target date
                todayTransactions.forEach(tx => {
                    const txTime = moment(tx.transaction_date);
                    if (txTime.isSameOrBefore(time) && 
                            !dataPoints.some(dp => moment(dp.minute, 'HH:mm').isSame(txTime.format('HH:mm'), 'minute'))) {
                        
                        if (tx.transaction_type === 'buy') {
                            currentCashBalance -= tx.quantity * tx.price;
                            currentHoldings[tx.ticker] = (currentHoldings[tx.ticker] || 0) + tx.quantity;
                        } else if (tx.transaction_type === 'sell') {
                            currentCashBalance += tx.quantity * tx.price;
                            currentHoldings[tx.ticker] = (currentHoldings[tx.ticker] || 0) - tx.quantity;
                            if (currentHoldings[tx.ticker] <= 0) delete currentHoldings[tx.ticker];
                        }
                    }
                });
                
                // Calculate holdings value at this minute
                let holdingsValue = 0;
                for (const [ticker, quantity] of Object.entries(currentHoldings)) {
                    const tickerMinuteData = minuteData[ticker];
                    if (!tickerMinuteData || !tickerMinuteData.length) continue;
                    
                    // Find the price closest to current minute
                    const pricePoint = tickerMinuteData.find(p => p.minute === timeString);
                    if (pricePoint) {
                        holdingsValue += quantity * pricePoint.price;
                    }
                }
                
                const totalValue = currentCashBalance + holdingsValue;
                const percentChange = ((totalValue - initialValue) / initialValue) * 100;
                
                dataPoints.push({
                    minute: time.format('HH:mm'),
                    value: totalValue, 
                    cash: currentCashBalance,
                    holdings: holdingsValue,
                    change: percentChange,
                    minuteData: true // Flag for tooltip formatting
                });
            });
            
            setChartData(dataPoints);
        } catch (error) {
            console.error("Error generating 1-day account value data:", error);
        } finally {
            setIsLoading(false);
        }
    };
    generateAccountValueData();
  }, [transactions, period, initialValue, user, stockInfo]);

  const areaColor = useMemo(() => {
    if (!chartData || chartData.length === 0) return "#FD77D7";
    
    // Check if overall trend is positive
    const isPositive = chartData[chartData.length-1].value >= initialValue;
    return isPositive ? "#17C842" : "#ff5869";
  }, [chartData, initialValue]);

  return (
    <div className="account-value-ticker">
      <h2>Portfolio Performance</h2>
      
      <div className="period-buttons">
        {['1d', '1m', '3m', '6m', '1y', 'all'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={p === period ? 'active' : ''}
          >
            {p}
          </button>
        ))}
      </div>
      
      {isLoading ? (
        <div className="chart-loading">
          <LoadingInline message="Generating portfolio history..." />
        </div>
      ) : chartData && chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="accountAreaFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={areaColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={areaColor} stopOpacity={0.2} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey={period === '1d' ? 'minute' : 'date'}
              tick={{ fontSize: 9 }}
              axisLine={false}
              tickFormatter={(value) => 
                period === '1d' 
                  ? moment(value, 'HH:mm').format('h:mm A') 
                  : moment(value).format('MMM DD')
              }
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fontSize: 10 }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={initialValue} stroke="#5d637a" strokeDasharray="5 5" />
            <Area
              type="monotone"
              dataKey="value"
              stroke={areaColor}
              fill="url(#accountAreaFill)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="no-data">
          <p>Not enough data to display portfolio performance.</p>
          <p>Start trading to see your progress!</p>
        </div>
      )}
    </div>
  );
};

export default AccountValTicker;