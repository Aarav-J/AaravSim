import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import StockTicker from './Components/StockTicker'
import { getStockInfo, getNewsInfo, getRecommendationInfo, searchStock } from './utils/api'
import Search from "./Components/Search"
import useStore from "./store"
import "./styles/Navbar.scss"
import "./styles/Main.scss"
import StockDashboard from './Components/StockDashboard'
// import './App.css'
const App =  () => {
  // const [count, setCount] = useState(0)
  const [period, setPeriod] = useState('1d')
  const [searchResults, setSearchResults] = useState([])
  // const {ticker} = useStore()
  const ticker = useStore((state) => state.ticker)
  const stockInfo = useStore((state) => state.stock_info)
  const isLoading = useStore((state) => state.isLoading)
  // const [period, setPeriod] = useState('1d')
  // const history = null
  // useEffect(() => { 
  //   const response = getStockInfo('AAPL')
  //   const history = response["history"][period]
  //   console.log(history)
  // }, [])
  // const response = getStockInfo('AAPL')
  // const history = response["history"][period]
  // console.log(history)

  return (
    <div className='App'>
      <div className="navbar">
        <div className="searchArea">
          <Search />
        </div>
      </div>
      <div className='main'>
        <StockDashboard/>
      </div>
    
      {/* <p>Title: {ticker}</p> */}
      {/* {!isLoading && stockInfo ? <img src={`https://logo.clearbit.com/${stockInfo.website}`} alt="" /> : <h1 style={{'color': "red"}}>whoops</h1>} */}
      {/* <StockTicker ticker={ticker} period={period}/> */}

    </div>
  )
}

export default App
