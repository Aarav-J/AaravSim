import React, { useState, useEffect } from 'react';
import useStore from '../store';
import '../styles/Modal.scss';
import { getTickerHistory, sellTicker, getUserHoldings } from '../utils/tickerUtils';
import { isMarketOpen } from '../utils/marketUtils';
import { notifyMarketClosed } from '../utils/ToastUtils';
const SellModal = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [transactionHistory, setTransactionHistory] = useState([]); 
  const [userHoldings, setUserHoldings] = useState(null);
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const stock_info = useStore((state) => state.stock_info);
  const [marketOpen, setIsMarketOpen] = useState(isMarketOpen());
  // Reset quantity when modal opens with new stock
  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
    }
  }, [isOpen, stock_info?.symbol]);

  // Fetch transaction history and user holdings
  useEffect(() => { 
    const fetchData = async () => { 
      if(isOpen && stock_info && user) { 
        try {
          // Get transaction history
          const returnedTransactionHistory = await getTickerHistory(stock_info.symbol, user.id);
          setTransactionHistory(returnedTransactionHistory.data || []);
          
          // Get user holdings for this stock
          const holdings = await getUserHoldings(user.id, stock_info.symbol);
          setUserHoldings(holdings);
        } catch (err) { 
          console.log("Error fetching data:", err);
        }
      }
    }
    fetchData();
  }, [isOpen, stock_info?.symbol, user?.id]);
  
  if (!isOpen || !stock_info) return null;
  
  const currentPrice = stock_info?.oneDayHistory?.currentPrice || 0;
  const totalProceeds = currentPrice * quantity;
  const projectedAccountValue = user?.accountValue + totalProceeds;
  
  // Check if user has enough shares to sell
  const availableShares = userHoldings?.quantity || 0;
  const canSell = availableShares >= quantity;
  
  const formatDate = (date) => { 
    return new Date(date).toISOString().split('T')[0];
  }
  
  const handleSell = async () => { 
    if(!user?.id || !stock_info) return; 
    if(!marketOpen) { 
      notifyMarketClosed(); 
      onClose()
      return 
    }
    const price = stock_info.oneDayHistory.currentPrice; 
    const result = await sellTicker(user.id, stock_info.symbol, quantity, price); 
    if(result.error) { 
      console.error("Failed to sell stock: ", result.error); 
    } else { 
      console.log("Successfully sold stock: ", result.data);
      let tempUserData = {...user};
      tempUserData.accountValue = projectedAccountValue;
      setUser(tempUserData);
      // Update local state to reflect the sale
      if (userHoldings) {
        setUserHoldings({
          ...userHoldings,
          quantity: userHoldings.quantity - quantity
        });
      }
      // Refresh transaction history
      const updatedHistory = await getTickerHistory(stock_info.symbol, user.id);
      setTransactionHistory(updatedHistory.data || []);
    }
    onClose();
  }


  
  return (
    <div className="modal-overlay">
      <div className="buy-modal sell-modal">
        <div className="modal-header">
          <h3>Sell {stock_info.symbol}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="stock-info">
            <p className="stock-name">{stock_info.name}</p>
            <p className="current-price">${currentPrice.toFixed(2)}</p>
          </div>
          
          <div className="account-info">
            <p>Available shares: <span className="account-value">{availableShares}</span></p>
            <p>Current balance: <span className="account-value">${user?.accountValue.toFixed(2)}</span></p>
          </div>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity to sell:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >-</button>
              <input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={(e) => {
                  const value = Math.max(1, parseInt(e.target.value) || 1);
                  setQuantity(Math.min(value, availableShares));
                }} 
                max={availableShares}
              />
              <button 
                onClick={() => setQuantity(Math.min(quantity + 1, availableShares))}
                disabled={quantity >= availableShares}
              >+</button>
            </div>
          </div>
          
          <div className="transaction-summary">
            <div className="summary-row">
              <span>Total proceeds:</span>
              <span className="total-proceeds">${totalProceeds.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>New balance:</span>
              <span className="projected-value">
                ${projectedAccountValue.toFixed(2)}
              </span>
            </div>
          </div>
          
          <button 
            className="buy-button sell-button" 
            disabled={!canSell}
            onClick={handleSell}
          >
            Sell {stock_info.symbol}
          </button>
          
          <div className="transaction-history">
            <h4>Transaction History</h4>
            <div className="history-list">
              {transactionHistory.map((transaction, index) => (
                <div 
                  key={index} 
                  className={`history-item ${transaction.type}`}
                >
                  <span className="transaction-date">{formatDate(transaction.transaction_date)}</span>
                  <span className={`transaction-type ${transaction.transaction_type === 'buy' ? 'err' : 'pos'}`}>
                    {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                  </span>
                  <span className="transaction-quantity">{transaction.quantity} shares</span>
                  <span className={`transaction-price ${transaction.transaction_type === 'buy' ? 'err' : 'pos'}`}>
                    ${transaction.total_amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellModal;