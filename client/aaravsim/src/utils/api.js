import axios from 'axios'

// import supabase from '../SupabaseClient'
import { getTickerData, updateTickerData, insertTickerData, upsertTickerData } from './tickerUtils'
import {formatDate, getStartEndDates, filterDataByPeriod} from './dateUtils'
const query = 'aaravj5.pythonanywhere.com/api'
// export const getStockInfo =  (symbol) => { 
//     const response =  axios.get(`https://${query}/stock/${symbol}`)
//         .then((response) => { 
//             console.log(response.data)
//             return response.data
//         }) 
//         return response
//     // // console.log(response.data)
//     // return response.data
// }

const search_data_token = import.meta.env.VITE_SEARCH_DATA_TOKEN
export const getNewsInfo = async (symbol) => {
    const response = await axios.get(`https://${query}/news/${symbol}`)
    return response.data
}

export const getRecommendationInfo = async (symbol) => {
    const response = await axios.get(`https://${query}/recommendation/${symbol}`)
    return response.data
}

export const searchStock = async (type, searchParam) => { 
    

    const query_nas = `https://financialmodelingprep.com/api/v3/search-${type}?query=${searchParam}&apikey=${search_data_token}`
   

    const response = axios.get(query_nas).then((response) => { 
        console.log(response.data)
        return response.data.filter((stock) => stock.exchangeShortName == 'NASDAQ' || stock.exchangeShortName == 'NYSE')
    })
    return response
    
   
}
// ...existing code...
export const fakeSearchStock = async (type, input) => {
    return new Promise((resolve) => {
      const fakeData = [
        {
          "symbol": "APC.F",
          "name": "Apple Inc.",
          "currency": "EUR",
          "stockExchange": "Frankfurt Stock Exchange",
          "exchangeShortName": "XETRA"
        },
        {
          "symbol": "APC.DE",
          "name": "Apple Inc.",
          "currency": "EUR",
          "stockExchange": "Frankfurt Stock Exchange",
          "exchangeShortName": "XETRA"
        },
        {
          "symbol": "AAPL.NE",
          "name": "Apple Inc.",
          "currency": "CAD",
          "stockExchange": "NEO",
          "exchangeShortName": "NEO"
        },
        {
          "symbol": "AAPL.MX",
          "name": "Apple Inc.",
          "currency": "MXN",
          "stockExchange": "Mexico",
          "exchangeShortName": "MEX"
        },
        {
          "symbol": "AAPL.DE",
          "name": "Apple Inc.",
          "currency": "EUR",
          "stockExchange": "Frankfurt Stock Exchange",
          "exchangeShortName": "XETRA"
        },
        {
          "symbol": "AAPL",
          "name": "Apple Inc.",
          "currency": "USD",
          "stockExchange": "NASDAQ Global Select",
          "exchangeShortName": "NASDAQ"
        },
        {
          "symbol": "APPLX",
          "name": "Appleseed Fund",
          "currency": "USD",
          "stockExchange": "NASDAQ",
          "exchangeShortName": "NASDAQ"
        },
        {
          "symbol": "APUSD",
          "name": "AppleSwap AI USD",
          "currency": "USD",
          "stockExchange": "CCC",
          "exchangeShortName": "CRYPTO"
        },
        {
          "symbol": "APRU",
          "name": "Apple Rush Company, Inc.",
          "currency": "USD",
          "stockExchange": "Other OTC",
          "exchangeShortName": "PNK"
        },
        {
          "symbol": "APLE",
          "name": "Apple Hospitality REIT, Inc.",
          "currency": "USD",
          "stockExchange": "New York Stock Exchange",
          "exchangeShortName": "NYSE"
        },
        {
          "symbol": "2788.T",
          "name": "Apple International Co., Ltd.",
          "currency": "JPY",
          "stockExchange": "Tokyo",
          "exchangeShortName": "JPX"
        },
        {
          "symbol": "APLY.NE",
          "name": "Apple (AAPL) Yield Shares Purpose ETF",
          "currency": "CAD",
          "stockExchange": "Cboe CA",
          "exchangeShortName": "NEO"
        },
        {
          "symbol": "603020.SS",
          "name": "Apple Flavor & Fragrance Group Co.,Ltd.",
          "currency": "CNY",
          "stockExchange": "Shanghai",
          "exchangeShortName": "SHH"
        },
        {
          "symbol": "PNPL",
          "name": "Pineapple, Inc.",
          "currency": "USD",
          "stockExchange": "Other OTC",
          "exchangeShortName": "PNK"
        },
        {
          "symbol": "PEGY",
          "name": "Pineapple Energy Inc.",
          "currency": "USD",
          "stockExchange": "NASDAQ Capital Market",
          "exchangeShortName": "NASDAQ"
        },
        {
          "symbol": "PAPL",
          "name": "Pineapple Financial Inc.",
          "currency": "USD",
          "stockExchange": "AMEX",
          "exchangeShortName": "AMEX"
        },
        {
          "symbol": "PNPL.L",
          "name": "Pineapple Power Corporation plc",
          "currency": "GBp",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "MNAO",
          "name": "Pineapple Express Cannabis Company",
          "currency": "USD",
          "stockExchange": "Other OTC",
          "exchangeShortName": "OTC"
        },
        {
          "symbol": "AAPL.L",
          "name": "LS 1x Apple Tracker ETC",
          "currency": "GBp",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "AAP1.L",
          "name": "LS 1x Apple Tracker ETC",
          "currency": "EUR",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "1AAP.L",
          "name": "LS 1x Apple Tracker ETC",
          "currency": "USD",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "GAPJ",
          "name": "Golden Apple Oil & Gas Inc.",
          "currency": "USD",
          "stockExchange": "Other OTC",
          "exchangeShortName": "PNK"
        },
        {
          "symbol": "AAPX",
          "name": "T-Rex 2X Long Apple Daily Target ETF",
          "currency": "USD",
          "stockExchange": "Cboe US",
          "exchangeShortName": "CBOE"
        },
        {
          "symbol": "MLP",
          "name": "Maui Land & Pineapple Company, Inc.",
          "currency": "USD",
          "stockExchange": "New York Stock Exchange",
          "exchangeShortName": "NYSE"
        },
        {
          "symbol": "AAP3.L",
          "name": "Leverage Shares 3x Apple ETC",
          "currency": "USD",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "AAPE.L",
          "name": "Leverage Shares 2x Apple ETC A",
          "currency": "EUR",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "AAP2.L",
          "name": "Leverage Shares 2x Apple ETC A",
          "currency": "USD",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "2AAP.L",
          "name": "Leverage Shares 2x Apple ETC A",
          "currency": "GBp",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "SAPL.L",
          "name": "Leverage Shares -1x Apple ETC",
          "currency": "GBp",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "SAPE.L",
          "name": "Leverage Shares -1x Apple ETC",
          "currency": "EUR",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "APLS.L",
          "name": "Leverage Shares -1x Apple ETC",
          "currency": "USD",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "3LAP.L",
          "name": "GraniteShares 3x Long Apple Daily ETP",
          "currency": "USD",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "3SAP.L",
          "name": "GraniteShares 3x Short Apple Daily ETP",
          "currency": "USD",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "AAPS.L",
          "name": "Leverage Shares 3x Short Apple (AAPL) ETP Securities",
          "currency": "USD",
          "stockExchange": "London Stock Exchange",
          "exchangeShortName": "LSE"
        },
        {
          "symbol": "AAPY",
          "name": "Kurv Yield Premium Strategy Apple (AAPL) ETF",
          "currency": "USD",
          "stockExchange": "New York Stock Exchange Arca",
          "exchangeShortName": "AMEX"
        }
      ];
      
      // Artificial delay to simulate an API call
      setTimeout(() => {
        resolve(fakeData.filter((stock) => stock.exchangeShortName == 'NASDAQ' || stock.exchangeShortName == 'NYSE'));
      }, 300);
    });
 }
export const get1dStockData = async (symbol) => { 
  const response = await axios.get(`https://${query}/price/${symbol}`)
  return response.data
}
// Helper function to get current date in EST as YYYY-MM-DD
const getCurrentESTDate = () => {
  const now = new Date();
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/New_York'
  }).format(now).split('/').reverse().join('-').replace(/(\d{4})-(\d{2})-(\d{2})/, '$1-$3-$2');
};

export const getStockHistory = async (symbol) => { 
  const ticker = symbol.toUpperCase();
  const supabase_data = await getTickerData(ticker);
  
  // Get today's date in EST format (YYYY-MM-DD)
  const todayEST = getCurrentESTDate();
  
  console.log(`Checking data for ${ticker}`);
  console.log(supabase_data)
  if (supabase_data.data && supabase_data.data.length > 0) {
    
    // Check if we have historical data
    if (supabase_data.data[0].historical_data) {
      const lastUpdatedStr = supabase_data.data[0].last_updated;
      console.log(`Last updated: ${lastUpdatedStr}`);
      console.log(`Today: ${todayEST}`);
      console.log(`Is same day: ${lastUpdatedStr === todayEST}`);
      
      // Check if data was updated today
      if (lastUpdatedStr === todayEST) {
        console.log(`Using cached historical data for ${ticker}`);
        return supabase_data.data[0].historical_data;
      }
    }
    
    // Data exists but is outdated or empty
    console.log(`Fetching fresh historical data for ${ticker}`);
    const { startDate } = getStartEndDates('5y');
    let response_api = null;
    try {
      const response = await axios.get(`https://${query}/daily/${ticker}/prices`, {
        params: { startDate }
      });
      response_api = response.data;
      
      // Use EST date format
      await upsertTickerData(ticker, { 
        historical_data: response_api, 
        last_updated: todayEST,
        daily_stats: null // Always set daily_stats to null
      });
      console.log(`Updated historical data with last_updated: ${todayEST}`);
      
      return response_api;
    } catch (error) {
      console.error("Error fetching historical data:", error);
      // Return cached data even if outdated as fallback
      if (supabase_data.data[0].historical_data) {
        return supabase_data.data[0].historical_data;
      }
      return [];
    }
  } else {
    // No existing data
    return await initializeTickerData(ticker);
  }
};

// Simplified function that just returns null for daily stats
export const getDailyStats = async () => {
  return null;
};

/* Original getDailyStats implementation commented out
export const getDailyStats = async (symbol) => {
  const ticker = symbol.toUpperCase();
  const supabase_data = await getTickerData(ticker);
  
  // Get today's date in EST format (YYYY-MM-DD)
  const todayEST = getCurrentESTDate();

  console.log(`Checking daily stats for ${ticker}`);
  
  if (supabase_data.data && supabase_data.data.length > 0) {
    // Check if we have daily stats that is not null
    if (supabase_data.data[0].daily_stats) {
      const lastUpdatedStr = supabase_data.data[0].last_updated;
      
      console.log(`Stats last updated: ${lastUpdatedStr}`);
      console.log(`Today: ${todayEST}`);
      console.log(`Is same day: ${lastUpdatedStr === todayEST}`);
      
      // Check if data was updated today
      if (lastUpdatedStr === todayEST) {
        console.log(`Using cached daily stats for ${ticker}`);
        return supabase_data.data[0].daily_stats;
      }
    } 
    // If daily_stats is explicitly set to null, don't try to fetch it
    else if (supabase_data.data[0].daily_stats === null) {
      console.log(`Daily stats for ${ticker} are null, not fetching`);
      return null;
    }
    
    // Data exists but is outdated or empty
    console.log(`Fetching fresh daily stats for ${ticker}`);
    try {
      const response = await axios.get(`http://localhost:5001/api/fundamentals/${ticker}/daily`);
      const response_daily_stats = response.data;
      
      await upsertTickerData(ticker, { 
        daily_stats: response_daily_stats, 
        last_updated: todayEST 
      });
      console.log(`Updated daily stats with last_updated: ${todayEST}`);
      
      return response_daily_stats;
    } catch (error) {
      console.error("Error fetching daily stats:", error);
      // Set daily_stats to null in database
      await upsertTickerData(ticker, { 
        daily_stats: null, 
        last_updated: todayEST 
      });
      console.log(`Set daily stats to null for ${ticker}`);
      return null;
    }
  } else {
    // No existing data
    await initializeTickerData(ticker);
    const newTickerData = await getTickerData(ticker);
    return newTickerData.data[0]?.daily_stats || null;
  }
};
*/

const initializeTickerData = async (symbol) => {
  const ticker = symbol.toUpperCase();
  
  console.log(`Initializing data for ${ticker}`);
  
  const { startDate } = getStartEndDates('5y');
  let response_historical = null;
  // let response_daily_stats = null; // Commented out

  try {
    const histResponse = await axios.get(`https://${query}/daily/${ticker}/prices`, {
      params: { startDate }
    });
    response_historical = histResponse.data;
  } catch (error) {
    console.error(`Error fetching historical data for ${ticker}:`, error);
    response_historical = [];
  }

  /* Commented out daily stats fetching
  try {
    const statsResponse = await axios.get(`http://localhost:5001/api/fundamentals/${ticker}/daily`);
    response_daily_stats = statsResponse.data;
  } catch (error) {
    console.error(`Error fetching daily stats for ${ticker}:`, error);
    response_daily_stats = null;
  }
  */

  // Get today's date in EST format (YYYY-MM-DD)
  const todayEST = getCurrentESTDate();
  
  const { error } = await upsertTickerData(ticker, { 
    historical_data: response_historical, 
    daily_stats: null, // Always set to null
    last_updated: todayEST
  });
  
  if (error) {
    console.error(`Error upserting data for ${ticker}:`, error);
  } else {
    console.log(`Successfully initialized data for ${ticker} with last_updated: ${todayEST}`);
  }
  
  return response_historical;
};
