import React, { useState, useEffect } from 'react';
import useStore from '../store';
import supabase from '../SupabaseClient';
import { formatNumber } from '../utils/tickerUtils';
import { getStockHistory, get1dStockData, getDailyStats } from '../utils/api';
import { LoadingOverlay } from './LoadingComponent';
import "../styles/UserDashboard.scss";
const UserDashboard = () => {
  const user = useStore((state) => state.user);
  const [totalPortfolioValue, setTotalPortfolioValue] = useState(0);
  const [holdings, setHoldings] = useState([]);
  const [pageIsLoading, setPageIsLoading] = useState(true);
  const setStockInfo = useStore((state) => state.setStockInfo);
  const setTicker = useStore((state) => state.setTicker);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const setSelectedDashboard = useStore((state) => state.setSelectedDashboard);
  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!user) return;
      
      setPageIsLoading(true);
      
      try {
        // 1. Fetch all user holdings
        const { data: userHoldings, error } = await supabase
          .from('user_holdings')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (!userHoldings || userHoldings.length === 0) {
          // No stocks - portfolio value is just cash
          setTotalPortfolioValue(user.accountValue);
          setHoldings([]);
          setPageIsLoading(false);
          return;
        }
        
        // 2. Get current prices for all holdings
        const enhancedHoldings = await Promise.all(
          userHoldings.map(async (holding) => {
            try {
              // Get current price data for this stock
              const priceData = await get1dStockData(holding.ticker);
              const currentPrice = priceData.currentPrice;
              
              // Calculate values
              const currentValue = currentPrice * holding.quantity;
              const gainLoss = currentValue - holding.cost_basis;
              const gainLossPercent = (gainLoss / holding.cost_basis) * 100;
              
              return {
                ...holding,
                currentPrice,
                currentValue,
                gainLoss,
                gainLossPercent
              };
            } catch (err) {
              // console.error(`Failed to get current price for ${holding.ticker}:`, err);
              return {
                ...holding,
                currentPrice: null,
                currentValue: 0,
                gainLoss: 0,
                gainLossPercent: 0
              };
            }
          })
        );
        
        // 3. Calculate total portfolio value
        const stocksValue = enhancedHoldings.reduce(
          (sum, stock) => sum + (stock.currentValue || 0), 
          0
        );
        
        setHoldings(enhancedHoldings);
        setTotalPortfolioValue(user.accountValue + stocksValue);
      } catch (err) {
        // console.error("Error calculating portfolio value:", err);
      } finally {
        setPageIsLoading(false);
      }
    };
    
    fetchPortfolioData();
  }, [user]);
  
  // if (pageIsLoading) {
  //   return <div className="loading">Loading portfolio data...</div>;
  // }
  


  const handleTickerClick = async (ticker, name) => { 
      
      // Here result contains both symbol and name
      // setQuery('');
      setSelectedDashboard('stock')
      setStockInfo(null);
      setTicker(ticker); 
      setIsLoading(true); 
  
      try {
        const symbol = ticker;
        // Fetch the necessary data concurrently.
        const [history, oneDayHistory, dailyStats] = await Promise.all([
            getStockHistory(symbol),    // full 5y history
            get1dStockData(symbol),      // 1d history data
            getDailyStats(symbol)        // daily stats (Market Cap, Enterprise Value, P/E, P/B, Trailing PEG 1Y, etc.)
        ]);
  
        // Combine the fetched data into one object.
        const combinedInfo = {
            name: name,         // use the name from the search result
            symbol: symbol,
            history: history,          // full 5y history
            oneDayHistory: oneDayHistory,  // 1d history
            dailyStats: dailyStats     // daily stats with Market Cap, Enterprise Value, etc.
        };
  
        setStockInfo(combinedInfo);
        // console.log("Combined Stock Info:", combinedInfo);
        // setSelectedDashboard('stock')
      } catch (err) {
        // console.error("Error fetching stock data:", err);
      } finally {
        setIsLoading(false);
      }
      
  }
  
  return (
    <div className="user-dashboard">
      {pageIsLoading && <LoadingOverlay message='Loading your portfolio...'/>}
      <div className="user-profile-card">
      <div className="profile-content">
        <div className="profile-info">
          <h2 className="profile-name">{user?.name}</h2>
          <span className="profile-username">@{user?.username}</span>
        </div>
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-label">Member Since</span>
            <span className="stat-value">2023</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Trading Performance</span>
            <span className="stat-value performance-positive">+12.4%</span>
          </div>
        </div>
      </div>
    </div>
      <h1>Portfolio Overview</h1>
      
      <div className="portfolio-summary">
        <div className="summary-card">
          <h3>Total Portfolio Value</h3>
          <span className="value">${totalPortfolioValue?.toFixed(2)}</span>
        </div>
        
        <div className="summary-card">
          <h3>Cash Balance</h3>
          <span className="value">${user?.accountValue.toFixed(2) || 0 }</span>
        </div>
        
        <div className="summary-card">
          <h3>Stock Holdings</h3>
          <span className="value">
            ${(totalPortfolioValue - (user?.accountValue || 0)).toFixed(2)}
          </span>
        </div>
      </div>
      
      {holdings.length > 0 ? (
        <div className="holdings-table">
          <h2>Your Investments</h2>
          <table>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Shares</th>
                <th>Avg Price</th>
                <th>Current Price</th>
                <th>Current Value</th>
                <th>Gain/Loss</th>
              </tr>
            </thead>
            <tbody className='holding-items'>
              {holdings.map((holding) => (
                <tr key={holding.id} className='holding-item' onClick={() => { 
                  handleTickerClick(holding?.ticker, holding?.name)
                }}>
                  <td>{holding.ticker}</td>
                  <td>{holding.quantity}</td>
                  <td>${holding.average_price.toFixed(2)}</td>
                  <td>
                    {holding.currentPrice ? 
                      `$${holding.currentPrice.toFixed(2)}` : 
                      'N/A'}
                  </td>
                  <td>
                    {holding.currentValue ? 
                      `$${formatNumber(holding.currentValue)}` : 
                      'N/A'}
                  </td>
                  <td className={holding.gainLoss >= 0 ? 'pos' : 'err'}>
                    {holding.gainLoss ? 
                      `${holding.gainLoss > 0 ? '+' : ''}$${formatNumber(holding.gainLoss)} (${holding.gainLossPercent.toFixed(2)}%)` : 
                      'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-holdings">
          <p>You don't have any stock holdings yet.</p>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;