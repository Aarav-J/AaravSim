import { useEffect, useState } from "react";
import { fakeSearchStock, getStockInfo, searchStock, getNewsInfo, getRecommendationInfo } from "../utils/api";
import useStore from "../store";
import { TextAa, Hash } from "@phosphor-icons/react";

const Search = () => { 
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [type, setType] = useState('name');
  const [isFocused, setIsFocused] = useState(false);
  const setTicker = useStore((state) => state.setTicker);
  const setStockInfo = useStore((state) => state.setStockInfo);
  const setStockNews = useStore((state) => state.setStockNews);
  const setIsLoading = useStore((state) => state.setIsLoading);
  const setStockRecommendations = useStore((state) => state.setStockRecommendations);
//  useEffect(() => {
//     setIsLoading(true);
//     getStockInfo(ticker)
//       .then((data) => {
//         setStockInfo(data);
//         console.log(data)
//         console.log(stockInfo)
//         setIsLoading(false)
//       })
//       .catch((err) => {
//         console.error("Error fetching stock info:", err);
//       });
//   }, [ticker]);
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
    }, 1000); // delay in ms

    return () => clearTimeout(delayDebounceFn);
  }, [query, type]);

  const handleSuggestionClick = (symbol) => {
    setQuery('');
    setStockInfo(null);
    setStockNews(null)
    setStockRecommendations(null);
    setTicker(symbol); 
    setIsLoading(true); 
    getStockInfo(symbol)
        .then((data) => { 
            setStockInfo(data)
            console.log(data)
        })
        .catch((err) => {console.log("Error fetching stock info:", err)})
    getNewsInfo(symbol)
        .then((data) => { 
            setStockNews(data)
            console.log(data)
        })
        .catch((err) => {console.log("Error fetching stock news:", err)})
    // getRecommendationInfo(symbol)
    //     .then((data) => { 
    //         setStockRecommendations(data)
    //         console.log(data)
    //     })
    //     .catch((err) => {console.log("Error fetching stock recs:", err)})
    setIsLoading(false)
    


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
          onBlur={() => setTimeout(() => setIsFocused(false), 100)} // Delay allows clicks on suggestions to register
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
          {results.map((result) => {
        //   const truncatedName =
        //   result.name.length > 20
        //     ? result.name.substring(0, 20) + "..."
        //     : result.name;
          return(
            <div
              className="suggestionItem"
              key={result.symbol}
              onMouseDown={() => handleSuggestionClick(result.symbol)}
            >
              <div className="rightSide">
                <span className="ticker">{result.symbol}</span>
                <span className="name">{result.name}</span>
              </div>
            
            </div>
          )})}
        </div>
      )}
    </div>
  );
};

export default Search;