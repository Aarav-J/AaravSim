import axios from 'axios'
const query = 'aaravj5.pythonanywhere.com/api'

export const getStockInfo =  (symbol) => { 
    const response =  axios.get(`https://${query}/stock/${symbol}`)
        .then((response) => { 
            console.log(response.data)
            return response.data
        }) 
        return response
    // // console.log(response.data)
    // return response.data
}

export const getNewsInfo = async (symbol) => {
    const response = await axios.get(`https://${query}/news/${symbol}`)
    return response.data
}

export const getRecommendationInfo = async (symbol) => {
    const response = await axios.get(`https://${query}/recommendation/${symbol}`)
    return response.data
}

export const searchStock = async (type, searchParam) => { 
    

    const query_nas = `https://financialmodelingprep.com/api/v3/search-${type}?query=${searchParam}&apikey=OIkEs0K0C6G6PS4bg82uGdCmLdA4vWWo`
   

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
