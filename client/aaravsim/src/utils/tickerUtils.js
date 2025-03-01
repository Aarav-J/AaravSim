import supabase from "../SupabaseClient";
import toast from 'react-hot-toast'
import { watchListToast } from "./ToastUtils";
import useStore from "../store";


// Use upsert instead of separate insert/update calls
export async function upsertTickerData(ticker, data) {
    const { error } = await supabase
      .from('ticker_information')
      .upsert([{ ticker, ...data }], { onConflict: 'ticker' });
    if (error) console.error("Error in upsertTickerData:", error);
    return { error };
  }
export async function getTickerData(ticker) { 
  let { data, error } = await supabase
    .from('ticker_information')
    .select('*')
    .eq('ticker', ticker);
  return { data, error };
}

export async function insertTickerData(ticker, data) { 
    let { error } = await supabase
        .from('ticker_information')
        .insert([{ ticker: ticker, ...data }])
    return { error }
}   

export async function updateTickerData(ticker, data) {
    let { error } = await supabase
        .from('ticker_information')
        .update(data)
        .eq('ticker', ticker)
    return { error }
}


export async function getTickerHistory(ticker, userId) { 
  const capTicker = ticker.toUpperCase();
  let { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('ticker', capTicker)
    .order('transaction_date', { ascending: false });
  return { data, error };
}

  // Helper function to get user holdings for a specific stock
export async function getUserHoldings(userId, ticker) {
    try {
      const { data, error } = await supabase
        .from('user_holdings')
        .select('*')
        .eq('user_id', userId)
        .eq('ticker', ticker.toUpperCase())
        .single();
        
      if (error) throw error;
      return data;
    } catch (err) {
      console.error("Error fetching user holdings:", err);
      return null;
    }
  };



export async function boughtTicker(userId, ticker, name, quantity, price) {
  // Uppercase the ticker for consistency
  ticker = ticker.toUpperCase();
  const totalAmount = quantity * price;
  
  // Start a Supabase transaction
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('accountValue')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    return { error: profileError };
  }
  
  // Check if user has enough funds
  if (profileData.accountValue < totalAmount) {
    return { error: { message: 'Insufficient funds' } };
  }
  
  // 1. Record the transaction
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      ticker: ticker, 
      quantity: quantity,
      price: price,
      total_amount: totalAmount,
      transaction_type: 'buy'
    }]);
    
  if (transactionError) {
    return { error: transactionError };
  }
  
  // 2. Check if user already has this stock
  const { data: holdings, error: holdingsError } = await supabase
    .from('user_holdings')
    .select('*')
    .eq('user_id', userId)
    .eq('ticker', ticker)
    .single();
    
  if (holdingsError && holdingsError.code !== 'PGRST116') { // PGRST116 is "not found"
    return { error: holdingsError };
  }
  
  // 3. Update or create holding
  let holdingError;
  if (holdings) {
    // Update existing holding
    const newQuantity = holdings.quantity + quantity;
    const newCostBasis = holdings.cost_basis + totalAmount;
    const newAvgPrice = newCostBasis / newQuantity;
    
    const { error } = await supabase
      .from('user_holdings')
      .update({
        quantity: newQuantity,
        average_price: newAvgPrice,
        cost_basis: newCostBasis
      })
      .eq('id', holdings.id);
      
    holdingError = error;
  } else {
    // Create new holding
    const { error } = await supabase
      .from('user_holdings')
      .insert([{
        user_id: userId,
        ticker: ticker,
        name: name,
        quantity: quantity,
        average_price: price,
        cost_basis: totalAmount
      }]);
      
    holdingError = error;
  }
  
  if (holdingError) {
    return { error: holdingError };
  }
  
  // 4. Update user's account value
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      accountValue: profileData.accountValue - totalAmount
    })
    .eq('id', userId);
    
  if (updateError) {
    return { error: updateError };
  }
  
  return { success: true };
}




export async function sellTicker(userId, ticker, quantity, price) {
  // Uppercase the ticker for consistency
  ticker = ticker.toUpperCase();
  const totalAmount = quantity * price;
  
  // 1. Check if user owns enough shares
  const { data: holdings, error: holdingsError } = await supabase
    .from('user_holdings')
    .select('*')
    .eq('user_id', userId)
    .eq('ticker', ticker)
    .single();
    
  if (holdingsError) {
    return { error: holdingsError };
  }
  
  if (!holdings || holdings.quantity < quantity) {
    return { error: { message: 'Insufficient shares to sell' } };
  }
  
  // 2. Record the transaction
  const { error: transactionError } = await supabase
    .from('transactions')
    .insert([{
      user_id: userId,
      ticker: ticker,
      quantity: quantity,
      price: price,
      total_amount: totalAmount,
      transaction_type: 'sell'
    }]);
    
  if (transactionError) {
    return { error: transactionError };
  }
  
  // 3. Update or delete holding
  const newQuantity = holdings.quantity - quantity;
  let holdingError;
  
  if (newQuantity <= 0) {
    // Delete the holding if all shares are sold
    const { error } = await supabase
      .from('user_holdings')
      .delete()
      .eq('id', holdings.id);
      
    holdingError = error;
  } else {
    // Update the holding with new quantity
    // Note: We don't change average_price when selling
    const newCostBasis = holdings.average_price * newQuantity;
    
    const { error } = await supabase
      .from('user_holdings')
      .update({
        quantity: newQuantity,
        cost_basis: newCostBasis
      })
      .eq('id', holdings.id);
      
    holdingError = error;
  }
  
  if (holdingError) {
    return { error: holdingError };
  }
  
  // 4. Update user's account value
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('accountValue')
    .eq('id', userId)
    .single();
    
  if (profileError) {
    return { error: profileError };
  }
  
  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      accountValue: profileData.accountValue + totalAmount
    })
    .eq('id', userId);
    
  if (updateError) {
    return { error: updateError };
  }
  
  return { success: true };
}

export function formatNumber(num) {
  if (num >= 1_000_000_000_000) { // Trillion
      return (num / 1_000_000_000_000).toFixed(2) + 'T';
  } else if (num >= 1_000_000_000) { // Billion
      return (num / 1_000_000_000).toFixed(2) + 'B';
  } else if (num >= 1_000_000) { // Million
      return (num / 1_000_000).toFixed(2) + 'M';
  } else if (num >= 1_000) { // Thousand
      return (num / 1_000).toFixed(2) + 'K';
  } else { // Smaller numbers
      return num.toFixed(2).toString();
  }
}



export const isInWatchlist = (watchlist, ticker) => { 
  if(!watchlist || !Array.isArray(watchlist)) return false;
  return watchlist.some(item => item.ticker == ticker)
}

export const addToWatchlist = async (userId, ticker, stock_info) => { 
  
  try { 
    const {data: userData, error: err} = await supabase
      .from('profiles')
      .select('watchlist')
      .eq('id', userId)
      .single(); 
      if (err) throw err
      const watchlistItem = { 
        date_watchlisted: new Date().toISOString(), 
        name: stock_info.name, 
        ticker: stock_info.symbol, 
        price_at_watchlist: stock_info.oneDayHistory?.currentPrice || 0 
      }

      const updatedWatchList = Array.isArray(userData.watchlist)
        ? [...userData.watchlist, watchlistItem]
        : [watchlistItem]
      const {error} = await supabase
        .from('profiles')
        .update({watchlist: updatedWatchList})
        .eq('id', userId)
      if (error) throw error
      watchListToast(ticker, 'add')
      return { success: true , watchlist: updatedWatchList}
  } catch(err) { 
    console.error("error adding to watchlist:", err)
    toast.error("Failed to add to watchlist")
    return {success: false}
  }
 
}
// Fix the removeFromWatchList function to handle ticker properly

export const removeFromWatchList = async (userId, ticker, stock_info) => {
  try { 
    const {data: userData, error: err} = await supabase
      .from('profiles')
      .select('watchlist')
      .eq('id', userId)
      .single();
    if(err) throw err

    // Make comparison case-insensitive or ensure consistent casing
    const updatedWatchList = Array.isArray(userData.watchlist) ? 
      userData.watchlist.filter(item => item.ticker !== ticker) : []
    
    const {error} = await supabase
      .from('profiles')
      .update({watchlist: updatedWatchList})
      .eq('id', userId)
    if (error) throw error
    watchListToast(ticker, 'remove')
    return {success: true, watchlist: updatedWatchList}  // Note: fixed the success property name

  } catch (err) { 
    console.error("error removing from watchlist:", err)
    toast.error("Failed to remove from watchlist")
    return {success: false}
  }
}

export const toggleWatchlist = async (userId, ticker, stock_info) => {
  try { 
    const {data: userData, error: err} = await supabase
      .from('profiles')
      .select('watchlist')
      .eq('id', userId)
      .single();
    if(err) throw err
    
    const watchlist = userData.watchlist || []
    const isInList = watchlist.some(item => item.ticker === ticker)
    
    if(isInList) { 
      return removeFromWatchList(userId, ticker)
    } else { 
      return addToWatchlist(userId, ticker, stock_info)
    }
  } catch(err) { 
    console.error("error toggling",err)
    toast.error("Failed to toggle watchlist")
    return {success: false, error: err}  // Consistent naming
  }
}