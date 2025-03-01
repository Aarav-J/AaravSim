export const calculateStockStats = (stock_info) => { 
    if(!stock_info) return null;
    let open = 0
    let dayHigh = 0; 
    let dayLow = 0; 

    if(stock_info.oneDayHistory && stock_info.oneDayHistory['1d']) { 
        const todayData = stock_info.oneDayHistory['1d']
        const entries = Object.entries(todayData)
        const key = `('Close', '${stock_info.symbol}')`

        if(entries.length > 0 ) { 
            open = todayData[entries[0][0]][key]

            dayHigh = -Infinity
            dayLow = Infinity

            for (const [_, values] of entries) { 
                const price = values[key]
                if(price > dayHigh) dayHigh = price
                if(price < dayLow) dayLow = price
            }
        }
    }

    let weekHigh52 = 0; 
    let weekLow52 = Infinity; 

    if(stock_info.history && stock_info.history.length > 0) { 
        const oneYearAgo = new Date(); 
        oneYearAgo.setFullYear(oneYearAgo.getFullYear()-1)  
        const yearData = stock_info.history.filter((item) => { 
            new Date(item.date) >= oneYearAgo
        }); 

        if(yearData.length > 0) { 
            yearData.forEach((item) => { 
                if(item.adjClose > weekHigh52) weekHigh52 = item.adjClose
                if(item.adjClose < weekLow52) weekLow52 = item.adjClose
            })
        } else { 
            weekLow52 = Math.min(...stock_info.history.map(item => item.adjClose))
            weekHigh52 = Math.max(...stock_info.history.map(item => item.adjClose))
        }
    }
    return { 
        open: open || 0, 
        dayHigh: dayHigh !== -Infinity ? dayHigh : 0,
        dayLow: dayLow !== Infinity ? dayLow : 0,
        weekHigh52,
        weekLow52: weekLow52 !== Infinity ? weekLow52 : 0
    }
}