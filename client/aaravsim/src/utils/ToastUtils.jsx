import toast from "react-hot-toast";
export const notifyMarketClosed = () => {
    toast.error(
      <div className="market-closed-toast">
        {/* <span className="toast-icon">🔒</span> */}
        <div className="toast-content">
          <strong>Market Closed</strong>
          <p>Trading is unavailable outside market hours (9:30 AM - 4:00 PM ET, Mon-Fri)</p>
        </div>
      </div>,
      {
        duration: 4000,
        style: {
          background: '#311F3D',
          fontFamily: 'Montserrat, sans-serif',
          color: '#dde5ed',
          border: '1px solid #FD77D7',
          // borderLeft: '6px solid #FD77D7',
          padding: '8px 10px',
          // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }
    );
  };

export const watchListToast = (ticker, action) => {
    toast.success(
      <div className="watchlist-toast">
        <span className="toast-icon">{action === "add" ? "⭐" : "🗑️"}</span>
        <div className="toast-content">
          <strong>{action === 'add' ? `Added ${ticker} to Watchlist` : `Removed ${ticker} from Watchlist`}</strong>
        </div>
      </div>,
      {
        duration: 3000,
        style: {
          background: '#311F3D',
          fontFamily: 'Montserrat, sans-serif',
          color: '#dde5ed',
          border: '1px solid #FD77D7',
          // borderLeft: '6px solid #FD77D7',
          padding: '8px 10px',
          // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      }
    );
  }