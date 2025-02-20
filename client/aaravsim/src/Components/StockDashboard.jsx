import React, { useState, useEffect } from 'react';
import useStore from '../store';
import StockTicker from './StockTicker';
import ShowNews from './ShowNews';
const StockDashboard = () => { 
    const stockInfo = useStore((state) => state.stock_info)
    const isLoading = useStore((state) => state.isLoading)
    const period = useStore((state) => state.period)
    const [data, setData] = useState(null)
    const calculateData = () => { 
        if (stockInfo && stockInfo.history) {
            const firstPrice = stockInfo['history'][period][Object.keys(stockInfo['history'][period])[0]][`('Close', '${stockInfo.symbol}')`]
            const currentPrice = stockInfo.currentPrice
            const calculatePercentage = (currentPrice - firstPrice) / firstPrice * 100
            const calculateDeltaPrice = currentPrice - firstPrice

            const recData = stockInfo['recommendation']
            let max = 0 
            let finalRecName = ''
            Object.keys(recData).forEach((key) => {
                if (recData[key] > max) {
                    finalRecName = key
                    max = recData[key]
                }
            })

            if(finalRecName == 'strongBuy') { 
                finalRecName = 'Strong Buy'
            } else if(finalRecName == 'strongSell') {
                finalRecName = 'Strong Sell'
            } else if(finalRecName == 'buy') {
                finalRecName = 'Buy'
            } else if(finalRecName == 'sell') {
                finalRecName = 'Sell'
            } else if(finalRecName == 'hold') {
                finalRecName = 'Hold'
            }
            setData({ 
                deltaPrice: { 
                    value: calculateDeltaPrice.toFixed(2),
                    percentage: calculatePercentage, 
                    finalRec: finalRecName, 
                }, 
                
            })
        }

    }
    useEffect(() => { 
        calculateData()
    }, [stockInfo, period])
    return (
        <>
       {!isLoading && stockInfo && data ? (
        <div className='stock-dashboard'>
        <div className='definingarea '>
            <div className='titlearea side'>
                <span className='symbol'>{stockInfo.symbol}</span>
                <span className='name'>{stockInfo.name}</span>
            </div>
            <div className='pricearea side'>
                <span className='currentPrice'>{stockInfo.currentPrice.toFixed(2)}</span>
                <div className='priceInfo'>
                    <span className={`${data['deltaPrice']['value'] > 0 ? `pos` : 'err'} neutral`}>{data['deltaPrice']['value'] > 0 ? `+${data['deltaPrice']['value']}` : data['deltaPrice']['value']}{`(${data['deltaPrice']['percentage'].toFixed(2)}%)`}</span>
                    <div className='recommendationSticker' style={{'backgroundColor': (data['deltaPrice']['finalRec'] == 'Strong Buy' || data['deltaPrice']['finalRec'] == 'Buy') ? "#17C842" : (data['deltaPrice']['finalRec'] == 'Strong Sell' || data['deltaPrice']['finalRec'] == 'Sell' ? "#ff5869" : "#676e8a")}}>
                        <span className={`recommendation`}>{data['deltaPrice']['finalRec']}</span>    
                    </div> 
                </div>
            </div>
        </div> 
        <div className="graphArea">
            <div className="graph">
                <StockTicker ticker={stockInfo.symbol} period={period}/>
            </div>
            <div className='priceStats'>
                <div className='priceStat'>
                    <span className='title'>Open</span>
                    <span className='value'>{stockInfo.priceStats.open.toFixed(2)}</span>
                </div>
                <div className='priceStat'>
                    <span className='title'>Day High</span>
                    <span className='value'>{stockInfo.priceStats.dayHigh.toFixed(2)}</span>
                </div>
                <div className='priceStat'>
                    <span className='title'>Day Low</span>
                    <span className='value'>{stockInfo.priceStats.dayLow.toFixed(2)}</span>
                </div>
                <div className='priceStat'>
                    <span className='title'>52w High</span>
                    <span className='value'>{stockInfo.priceStats.fiftyTwoWeekHigh.toFixed(2)}</span>
                </div>
                <div className='priceStat'>
                    <span className='title'>52w Low</span>
                    <span className='value'>{stockInfo.priceStats.fiftyTwoWeekLow.toFixed(2)}</span>
                </div>
            </div>
        </div>
        <div className='stockStats'>
            <div className="stockStat">
                <span className="title">Mkt. Cap</span>
                <span className="value">{stockInfo.marketCap}</span>
            </div>
            <div className="stockStat">
                <span className="title">Volume</span>
                <span className="value">{stockInfo.volume}</span>
            </div>
            <div className="stockStat">
                <span className="title">P/E Ratio</span>
                <span className="value">{stockInfo['P/E'].toFixed(2)}</span>
            </div>
            <div className="stockStat">
                <span className="title">EPS Ratio</span>
                <span className="value">{stockInfo['EPS'].toFixed(2)}</span>
            </div>
            <div className="stockStat">
                <span className="title">Beta(5Y)</span>
                <span className="value">{stockInfo.beta.toFixed(2)}</span>
            </div>
            <div className="stockStat">
                <span className="title">P/S Ratio</span>
                <span className="value">{stockInfo["P/S"].toFixed(2)}</span>
            </div>
            <div className="stockStat">
                <span className="title">P/B Ratio</span>
                <span className="value">{stockInfo["P/B"].toFixed(2)}</span>
            </div>
            <div className="stockStat">
                <span className="title">Div Yld</span>
                <span className="value">{Number(stockInfo.dividendRate).toPrecision(2)}({(stockInfo.dividendYield*100).toFixed(1)}%)</span>
            </div>
            <div className="stockStat">
                <span className="title">Revenue</span>
                <span className="value">{stockInfo.revenue}</span>
            </div>
            <div className="stockStat">
                <span className="title">Net Inc.</span>
                <span className="value">{stockInfo.netIncome}</span>
            </div>
            <div className="stockStat">
                <span className="title">PE Ratio</span>
                <span className="value">{stockInfo["PEG"].toFixed(2)}</span>
            </div>
        </div>

        <ShowNews/>
        </div>

       ) : 
       <h1>Loading...</h1>}
        </>
    )
}
export default StockDashboard