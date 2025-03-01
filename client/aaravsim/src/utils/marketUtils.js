/**
 * Checks if the US stock market is currently open
 * Market hours: 9:30 AM - 4:00 PM ET, Monday-Friday
 * @returns {boolean} true if market is open, false if closed
 */
export function isMarketOpen() {
    const now = new Date();
    
    // Convert to Eastern Time (ET)
    const etNow = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
    
    const hours = etNow.getHours();
    const minutes = etNow.getMinutes();
    const day = etNow.getDay(); // 0 = Sunday, 6 = Saturday
    
    // Check if weekend
    if (day === 0 || day === 6) {
      return false;
    }
    
    // Check if outside trading hours
    // Market opens at 9:30 AM ET and closes at 4:00 PM ET
    if (hours < 9 || hours > 16 || (hours === 9 && minutes < 30) || (hours === 16 && minutes > 0)) {
      return false;
    }
    
    return true;
  }
  
  /**
   * Gets a user-friendly message about market status
   * @returns {string} Status message about market hours
   */
  export function getMarketStatusMessage() {
    if (isMarketOpen()) {
      return "Market is open";
    } else {
      const now = new Date();
      const day = now.getDay();
      
      if (day === 0 || day === 6) {
        return "Market is closed for the weekend";
      } else {
        return "Market is closed (Hours: 9:30 AM - 4:00 PM ET, Mon-Fri)";
      }
    }
  }