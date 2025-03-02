
import React, { useMemo, useState, useEffect } from 'react';
import useStore from '../store';
import StockTicker from './StockTicker';
import Search from './Search';
import { formatNumber, toggleWatchlist, getUserHoldings, getTickerHistory } from '../utils/tickerUtils';
import { filterDataByPeriod } from '../utils/dateUtils';
import { Eye, Star, CaretDown, CaretUp } from '@phosphor-icons/react';
import BuyModal from './BuyModal';
import SellModal from './SellModal';
import { calculateStockStats } from '../utils/dataUtils';
import { LoadingOverlay } from './LoadingComponent';
// import { formatDate } from '../utils/dateUtils';

const StockDashboard = () => { 
  const stock_info = useStore((state) => state.stock_info);
  const period = useStore((state) => state.period);
  const setPeriod = useStore((state) => state.setPeriod);
  const [isBuyModalOpen, setBuyModal] = useState(false); 
  const [isSellModalOpen, setSellModal] = useState(false);
  const isLoading = useStore((state) => state.isLoading);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const [isInUserWatchlist, setIsInUserWatchlist] = useState(false); 
  const [userHoldings, setUserHoldings] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  // const [showTransactions, setShowTransactions] = useState(false);


  // Compute delta by comparing the current price to the first data point in the filtered history (for the current period)
  const { deltaPrice, deltaPercentage, sentiment } = useMemo(() => {
    if (!stock_info || !stock_info.history || stock_info.history.length === 0) {
      return { deltaPrice: 0, deltaPercentage: 0, sentiment: "neutral" };
    }
    
    // Get the filtered history for the current period;
    const filteredHistory = filterDataByPeriod(stock_info.history, period);
    if (!filteredHistory || filteredHistory.length === 0) {
      return { deltaPrice: 0, deltaPercentage: 0, sentiment: "neutral" };
    }
    
    // The first price in the period:
    const firstPrice = filteredHistory[0].adjClose;
    
    // Determine currentPrice:
    // - If the market is open and oneDayHistory.currentPrice is available, use that;
    // - Otherwise, use the last entry in the filtered history.
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const isOutsideMarketHours = (hour >= 16 || hour < 9 || (hour === 9 && minute < 30));
    const isWeekend = (day === 0 || day === 6);
    
    let currentPrice = 0;
    if (!isOutsideMarketHours && !isWeekend && stock_info.oneDayHistory && stock_info.oneDayHistory.currentPrice) {
      currentPrice = stock_info.oneDayHistory.currentPrice;
    } else {
      currentPrice = filteredHistory[filteredHistory.length - 1].adjClose;
    }
    
    const dPrice = currentPrice - firstPrice;
    const dPercentage = (firstPrice === 0 ? 0 : (dPrice / firstPrice)) * 100;
    const sentimentCalc = dPrice > 0 ? "pos" : (dPrice < 0 ? "err" : "neutral");
    
    return { deltaPrice: dPrice, deltaPercentage: dPercentage, sentiment: sentimentCalc };
  }, [stock_info, period]);

  useEffect(() => { 
    const fetchHoldings = async () => { 
      if(user?.id && stock_info?.symbol) { 
        try { 
          const holdings = await getUserHoldings(user.id, stock_info.symbol);
          setUserHoldings(holdings);

          const history = await getTickerHistory(stock_info.symbol, user.id)
          setTransactionHistory(history.data || []);
        } catch (err) { 
          console.log("Error fetching user holdings: ", err)
          setUserHoldings(null)
          setTransactionHistory([])
        } 
      } else { 
        setUserHoldings(null)
        setTransactionHistory([])
      }
    }
    fetchHoldings()
  }, [user?.id, stock_info?.symbol]); 

  

  useEffect(() => { 
    setIsInUserWatchlist(false); 
    if(user?.watchlist && stock_info?.symbol) { 
      const isIsInList = user.watchlist.some((data) => { 
        console.log(data)
        console.log(data.ticker, stock_info.symbol)
        return data.ticker === stock_info.symbol
      })
      setIsInUserWatchlist(isIsInList);
      console.log(isIsInList)
    }
  }, [user?.watchlist, stock_info?.symbol]);
  

  const handleWatchlistToggle = async () => { 
    if(!user || !stock_info) return; 
    const result = await toggleWatchlist(user.id, stock_info.symbol, stock_info);
    if(result.success) { 
      setUser({ 
        ...user, 
        watchlist: result.watchlist
      })
    }
  }

  const formatDate = (dateString) => { 
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: "numeric", 
      month: 'short', 
      day: 'numeric'
    })
  }

  const stockStats = useMemo(() => { 
    // Only calculate if stock_info exists
    if (!stock_info) return null;
    
    try {
      return calculateStockStats(stock_info);
    } catch (error) {
      console.error("Error calculating stock stats:", error);
      return null;
    }
  }, [stock_info]);
  
  return (
    <div className='stock-dashboard'>
      {isLoading && <LoadingOverlay message='Loading stock data...' />}
      <Search />
      <div className='definingarea'>
        {stock_info && (
          <div className='titlearea side'>
            <span className='symbol'>{stock_info.symbol}</span>
            <span className='name'>{stock_info.name}</span>
          </div>
        )}
        {stock_info && stock_info.oneDayHistory && (
          <div className='pricearea side'>
            <span className='currentPrice'>
              {stock_info.oneDayHistory.currentPrice ? stock_info.oneDayHistory.currentPrice.toFixed(2) : 'N/A'}
            </span>
            <div className='priceInfo'>
              <span className={`${sentiment}`}>
                {deltaPrice > 0 ? '+' : ''}{deltaPrice.toFixed(2)} ({deltaPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
        )}
      </div>

      {stock_info &&(<div className="buttonArea">
         <div className="period-buttons">
                        {['1d', '5d', '1m', '6m', '1y', '5y'].map((periodS) => (
                            <button
                                key={periodS}
                                onClick={() => setPeriod(periodS)}
                                className={periodS === period ? 'active' : ''}
                            >
                                {periodS}
                            </button>
                        ))}
                    </div>
        <div className="action-buttons">
            <div className="action-button" onClick={() => { 
                setBuyModal(true); 
            }}>Buy</div>
            <div className="action-button" onClick={() => { 
                setSellModal(true);
            }}>Sell</div>
            <div className={`action-button ${isInUserWatchlist ? 'active': ''}`} onClick={() => { 
              handleWatchlistToggle();
            }}>
              <Star weight={isInUserWatchlist ? "fill" : 'regular'}/>
            </div>
        </div>
      </div>)}
      <div className="graphArea">
        <div className="graph">
          <StockTicker ticker={stock_info ? stock_info.symbol : "AAPL"} period={period} />
        </div>
        {/* {stock_info && stock_info.dailyStats && (
          <div className='priceStats'>
            <div className="priceStat">
              <span className="title">Market Cap</span>
              <span className="value">{formatNumber(stock_info.dailyStats.marketCap)}</span>
            </div>
            <div className="priceStat">
              <span className="title">Enterprise Value</span>
              <span className="value">{formatNumber(stock_info.dailyStats.enterpriseVal)}</span>
            </div>
            <div className="priceStat">
              <span className="title">P/E Ratio</span>
              <span className="value">{Number(stock_info.dailyStats.peRatio).toFixed(2)}</span>
            </div>
            <div className="priceStat">
              <span className="title">P/B Ratio</span>
              <span className="value">{Number(stock_info.dailyStats.pbRatio).toFixed(2)}</span>
            </div>
            <div className="priceStat">
              <span className="title">Trailing PEG (1Y)</span>
              <span className="value">{Number(stock_info.dailyStats.trailingPEG1Y).toFixed(2)}</span>
            </div>
          </div>
        )} */}

        {stock_info && stockStats && ( 
          <div className="statsArea">
            <div className="statsHeader">
              <h3>Ticker Stats</h3>
            </div>
            <div className="statsDetails">
              <div className="statRow">
                <div className="statItem">
                  <div className="title">Open</div>
                  <div className="value">{stockStats.open.toFixed(2)}</div>
                </div>
                <div className="statItem">
                  <div className="title">Day High</div>
                  <div className="value">{stockStats.dayHigh.toFixed(2)}</div>
                </div>
                <div className="statItem">
                  <div className="title">Day Low</div>
                  <div className="value">{stockStats.dayLow.toFixed(2)}</div>
                </div>
                <div className="statItem">
                  <div className="title">52w High</div>
                  <div className="value">{stockStats.weekHigh52.toFixed(2)}</div>
                </div>
                <div className="statItem">
                  <div className="title">52w Low</div>
                  <div className="value">{stockStats.weekLow52.toFixed(2)}</div>
                </div>
              
              </div>
            </div>
          </div>
        )}
      </div>

      {userHoldings && userHoldings.quantity > 0 && (
        <div className="holdingsArea">
          <div className="holdingsHeader">
            <h3>Your Position</h3>
          </div>
          <div className="holdingsDetails">
            <div className="holdingsStat">
              <span className="title">Shares Owned</span>
              <span className="value">{userHoldings.quantity}</span>
            </div>
            <div className="holdingsStat">
              <span className="title">Average Price</span>
              <span className="value">${Number(userHoldings.average_price).toFixed(2)}</span>
            </div>
            <div className="holdingsStat">
              <span className="title">Total Value</span>
              <span className="value">${(userHoldings.quantity * (stock_info?.oneDayHistory?.currentPrice || 0)).toFixed(2)}</span>
            </div>
            <div className="holdingsStat">
              <span className="title">Total Return</span>
              <span className={`value ${((stock_info?.oneDayHistory?.currentPrice || 0) > userHoldings.average_price) ? 'pos' : 'err'}`}>
                ${((stock_info?.oneDayHistory?.currentPrice || 0) * userHoldings.quantity - userHoldings.average_price * userHoldings.quantity).toFixed(2)}
                {' '}
                ({(((stock_info?.oneDayHistory?.currentPrice || 0) / userHoldings.average_price - 1) * 100).toFixed(2)}%)
              </span>
            </div>
          </div>

          <div className="transactionHistory">
            <div className="transactionToggle" >
              {/* <div className="transactionTitle" onClick={() => { 
              setShowTransactions(!showTransactions);
            }}> */}
            <div className="transactionTitle">
                <span>Transaction History</span>
                {/* {showTransactions ? <CaretUp /> : <CaretDown />}   */}
              </div>
              
              
                <div className="transactionList">
                  <table>
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactionHistory.map((transaction, idx) => (
                        <tr key={idx}>
                          <td>{formatDate(transaction.transaction_date)}</td>
                          <td className={transaction.transaction_type === 'buy' ? 'buy' : 'sell'}>
                            {transaction.transaction_type === 'buy' ? 'Buy' : 'Sell'}
                          </td>
                          <td>{transaction.quantity}</td>
                          <td>${Number(transaction.price).toFixed(2)}</td>
                          <td>${Number(transaction.total_amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              
            </div>
          </div>
        </div>
      )}
      <BuyModal isOpen={isBuyModalOpen} onClose={() => setBuyModal(false)} />
      <SellModal isOpen={isSellModalOpen} onClose={() => setSellModal(false)} />
    </div>
  );
};

export default StockDashboard;