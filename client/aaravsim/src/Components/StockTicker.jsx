import React, { useState, useEffect } from 'react';
import { getStockInfo } from '../utils/api';
import moment from 'moment';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import useStore from '../store';

const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
        <p className="desc">{moment(label).format('MMM DD, YYYY h:mm A')}</p>
          <p className="label">{`$${payload[0].value}`}</p>
          
        </div>
      );
    }
    return null;
  }
const StockTicker = ({ ticker, period }) => {
  // const [isLoading, setIsLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false)
  const stockInfo = useStore((state) => state.stock_info)
  const setStockInfo = useStore((state) => state.setStockInfo)
  const isLoading = useStore((state) => state.isLoading)
//   const ticker = store((state) => state.ticker)
//   const setTicker = store((state) => state.setTicker)
  const [history, setHistory] = useState(null);
  const [finalChartData, setFinalChartData] = useState(null)
  // Fetch stock info when the component mounts or when ticker/period changes.
  // useEffect(() => {
  //   setIsLoading(true);
  //   getStockInfo(ticker)
  //     .then((data) => {
  //       setStockInfo(data);
  //       console.log(data)
  //       console.log(stockInfo)
  //       setIsLoading(false)
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching stock info:", err);
  //     });
  // }, [ticker]);
  const formatData = (history) => {  
    if (!history) {
      return null;
    }
    const tempData =  Object.keys(history)
    .sort((a, b) => new Date(a) - new Date(b))
    .map(date => ({
      date,
      close: history[date][`('Close', '${ticker}')`].toFixed(2),
    }))
    return tempData.map((data) => {  
      return { 
          date: moment(data.date).format('MMM DD, YYYY h:mm A'),
          close: data.close
      }
    })
  }
  useEffect(() => { 
    if (stockInfo) { 
      console.log(stockInfo)
      setHistory(stockInfo["history"])
      console.log(stockInfo["history"])
    //   const tempChartData = Object.keys(history)
    //   .sort((a, b) => new Date(a) - new Date(b))
    //   .map(date => ({
    //     date,
    //     close: Number(history[date][`('Close', '${ticker}')`].toPrecision(5)),
    //   }))
    //   setFinalChartData(tempChartData.map((data) => {  
    //     return { 
    //         date: moment(data.date).format('MMM DD, YYYY h:mm A'),
    //         close: data.close
    //     }
    //   }))
    } else { 
        setHistory(null)
    }
    
  }, [stockInfo])
  useEffect(() => { 
    if(history) { 
        console.log(history)
        if(history[period]) { 
            setFinalChartData(formatData(history[period]))
            console.log(finalChartData)
        }
    }
  }, [history, period])
  
  return (
    <div className='stock-ticker'>
      {finalChartData && !isLoading? 
        <div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={finalChartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            {/* Define a linear gradient for the area fill */}
            <defs>
              <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                {/* <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} /> */}
                {/* <stop offset="100%" stopColor="#9418DE" stopOpacity={1} /> */}
                <stop
                offset="5%" 
                stopColor={darkMode ? "#FD77D7" : "#FD77D7"}
                stopOpacity={0.9}
              />
              <stop
                offset="95%"
                stopColor={darkMode ? "#FD77D7" : "#FD77D7"}
                stopOpacity={0.7}
              />
              </linearGradient>
            </defs>
            {/* <CartesianGrid strokeDasharray="3 3" /> */}
            <XAxis dataKey="date" tick={{ fontSize: 9}} tickFormatter={(date) => moment(date).format('MMM DD, YYYY h:mm A')} axisLine={false}/>
            {/* ([dataMin, dataMax]) => { const absMax = Math.max(Math.abs(dataMin), Math.abs(dataMax)); return [-absMax, absMax]; }} */}
            <YAxis  domain={([dataMin, dataMax]) =>{ 
                const min = dataMin - (dataMax - dataMin) * 0.2
                const max = dataMax + (dataMax - dataMin) * 0.2
                return [min, max]
            }} tick={{ fontSize: 10 }} tickFormatter={(number) => number.toFixed(2)} axisLine="false"/>
            {/* <Tooltip content={<CustomToolTip />} /> */}
            <Tooltip contentStyle={darkMode ? { backgroundColor: "#111827" } : null}
            itemStyle={darkMode ? { color: "#818cf8" } : null}/>
            <Area
              type="monotone"
              dataKey="close"
              stroke="#CF6BDD"
              fill="url(#areaFill)"
              fillOpacity={1}
              strokeWidth={1}
            />
          </AreaChart>
        </ResponsiveContainer>
         {/* {JSON.stringify(finalChartData)} */}
        </div>
       : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};
export default StockTicker;

