import React, { useState, useEffect } from 'react';
import useStore from '../store';
import toast from 'react-hot-toast';
import '../styles/Modal.scss';
import { getTickerHistory, boughtTicker} from '../utils/tickerUtils';
import { isMarketOpen } from '../utils/marketUtils';
import { notifyMarketClosed } from '../utils/ToastUtils';
const BuyModal = ({ isOpen, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [transactionHistory, setTransactionHistory] = useState([]); 
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const stock_info = useStore((state) => state.stock_info);
  const [marketOpen, setIsMarketOpen] = useState(isMarketOpen())
  // Reset quantity when modal opens with new stock
  useEffect(() => {
    if (isOpen) {
      setIsMarketOpen(isMarketOpen())
      setQuantity(1);
    }
  }, [isOpen, stock_info?.symbol]);


  useEffect(() => { 
    const fetchTransactionHistory = async () => { 
        if(isOpen && stock_info && user) { 
            try {
                const returnedTransactionHistory = await getTickerHistory(stock_info.symbol, user.id);
                setTransactionHistory(returnedTransactionHistory.data);
                // console.log(transactionHistory)
            } catch (err) { 
                // console.log("Error fetching transaction history:", err);
            }
            
        }
    }
    fetchTransactionHistory()
  }, [isOpen, stock_info?.symbol, user?.id]);
  
  if (!isOpen || !stock_info) return null;
  
  const currentPrice = stock_info?.oneDayHistory?.currentPrice || 0;
  const totalCost = currentPrice * quantity;
  const projectedAccountValue = user?.accountValue - totalCost;
  const canBuy = projectedAccountValue >= 0;
  const formatDate = (date) => { 
    return new Date(date).toISOString().split('T')[0];
  }
  
  const handleBuy = async (quantity) => { 
    if(!user?.id || !stock_info) return; 
    if(!marketOpen) { 
      notifyMarketClosed(); 
      onClose()
      return 
    }
    const price = stock_info.oneDayHistory.currentPrice; 
    const result = await boughtTicker(user?.id, stock_info.symbol, stock_info.name, quantity, price); 
    if(result.error) { 
        // console.error("Failed to buy stock: ", result.error); 
    } else { 
        // console.log("Successfully bought stock: ", result.data);
        let tempUserData = user; 
        tempUserData.accountValue = projectedAccountValue;
        setUser(tempUserData);
    }
    onClose()
  }
//   const mockTransactionHistory = [
//     { date: '2025-01-15', type: 'buy', quantity: 5, price: 150.25 },
//     { date: '2025-01-20', type: 'sell', quantity: 2, price: 155.80 },
//     { date: '2025-02-01', type: 'buy', quantity: 3, price: 148.50 },
//     { date: '2025-02-10', type: 'buy', quantity: 1, price: 152.75 },
//     { date: '2025-02-15', type: 'sell', quantity: 4, price: 160.25 }
//   ];
  
  return (
    <div className="modal-overlay">
      <div className="buy-modal">
        <div className="modal-header">
          <h3>Buy {stock_info.symbol}</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="stock-info">
            <p className="stock-name">{stock_info.name}</p>
            
            <p className="current-price">${currentPrice.toFixed(2)}</p>
            
          </div>
          
          <div className="account-info">
            <p>Available funds: <span className="account-value">${user?.accountValue.toFixed(2)}</span></p>
          </div>
          
          <div className="quantity-selector">
            <label htmlFor="quantity">Quantity:</label>
            <div className="quantity-controls">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >-</button>
              <input 
                type="number" 
                id="quantity" 
                value={quantity} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} 
              />
              <button onClick={() => setQuantity(quantity + 1)}>+</button>
            </div>
          </div>
          
          <div className="transaction-summary">
            <div className="summary-row">
              <span>Total cost:</span>
              <span className="total-cost">${totalCost.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Remaining balance:</span>
              <span className={`projected-value ${!canBuy ? 'error' : ''}`}>
                ${projectedAccountValue.toFixed(2)}
              </span>
            </div>
          </div>
          
          <button 
            className="buy-button" 
            disabled={!canBuy}
            onClick={() => handleBuy(quantity)}
          >
            Buy {stock_info.symbol}
          </button>
          
          <div className="transaction-history">
            <h4>Transaction History</h4>
            <div className="history-list">
              {transactionHistory.map((transaction, index) => {
                console.log(transaction)
                return (

                <div 
                  key={index} 
                  className={`history-item ${transaction.type}`}
                >
                  <span className="transaction-date">{formatDate(transaction.transaction_date)}</span>
                  <span className={`transaction-type ${transaction.transaction_type === 'buy' ? 'err' : 'pos'}`}>
                    {transaction.transaction_type.charAt(0).toUpperCase() + transaction.transaction_type.slice(1)}
                  </span>
                  <span className="transaction-quantity">{transaction.quantity} shares</span>
                  <span className={`transaction-price ${transaction.transaction_type === 'buy' ? 'err' : 'pos'}`}>${transaction.total_amount.toFixed(2)}</span>
                </div>
              )})}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyModal;