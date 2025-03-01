import { useEffect, useState } from "react";
import { fakeSearchStock, searchStock, getStockHistory, get1dStockData, getDailyStats } from "../utils/api";
import useStore from "../store";
import { TextAa, Hash } from "@phosphor-icons/react";

const Search = () => { 
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [type, setType] = useState('name');
  const [isFocused, setIsFocused] = useState(false);
  const setTicker = useStore((state) => state.setTicker);
  const setStockInfo = useStore((state) => state.setStockInfo);
  const setIsLoading = useStore((state) => state.setIsLoading);

  useEffect(() => { 
    if (query === '') {
      setResults([]);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      searchStock(type, query)
        .then((data) => { 
          setResults(data);
        })
        .catch((err) => { 
          console.error("Error fetching search results:", err);
        });
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [query, type]);

  const handleSuggestionClick = async (result) => {
    // Here result contains both symbol and name
    setQuery('');
    setStockInfo(null);
    setTicker(result.symbol); 
    setIsLoading(true); 

    try {
      const symbol = result.symbol;
      // Fetch the necessary data concurrently.
      const [history, oneDayHistory, dailyStats] = await Promise.all([
         getStockHistory(symbol),    // full 5y history
         get1dStockData(symbol),      // 1d history data
         getDailyStats(symbol)        // daily stats (Market Cap, Enterprise Value, P/E, P/B, Trailing PEG 1Y, etc.)
      ]);

      // Combine the fetched data into one object.
      const combinedInfo = {
         name: result.name,         // use the name from the search result
         symbol: symbol,
         history: history,          // full 5y history
         oneDayHistory: oneDayHistory,  // 1d history
         dailyStats: dailyStats     // daily stats with Market Cap, Enterprise Value, etc.
      };

      setStockInfo(combinedInfo);
      console.log("Combined Stock Info:", combinedInfo);
    } catch (err) {
      console.error("Error fetching stock data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="searchWrapper" style={{ position: "relative" }}>
      <div className="inputcontainer">
        <input 
          type="text" 
          placeholder={`Search by ${String(type).charAt(0).toUpperCase() + String(type).slice(1)}`}
          className="stockSearchInput" 
          value={query} 
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 100)}
          style={isFocused && results.length > 0 ? {"borderBottomLeftRadius": 0, "borderBottomRightRadius": 0}: {}}
        />
        <div className="typeButton nameButton" onClick={() => setType('name')}>
          <TextAa 
            className="icon" 
            color={type === 'name' ? '#CF6BDD' : '#D9D9D9'} 
            size={20} 
            weight="bold"
          />
        </div>
        <div className="typeButton tickerButton" onClick={() => setType('ticker')} style={isFocused && results.length > 0 ? {"borderBottomRightRadius": 0}: {}}>
          <Hash 
            className="icon" 
            color={type === 'ticker' ? '#CF6BDD' : '#D9D9D9'} 
            size={18} 
            weight="bold"
          />
        </div>
      </div>
      {isFocused && results.length > 0 && (
        <div className="suggestions">
          {results.map((result) => (
            <div
              className="suggestionItem"
              key={result.symbol}
              onMouseDown={() => handleSuggestionClick(result)}
            >
              <div className="rightSide">
                <span className="ticker">{result.symbol}</span>
                <span className="name">{result.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;