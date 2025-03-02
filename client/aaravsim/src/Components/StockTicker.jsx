import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { filterDataByPeriod } from '../utils/dateUtils';
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
        <div
          style={{
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            padding: '10px',
            borderRadius: '4px',
            color: '#333',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ marginBottom: '5px', fontWeight: 'bold' }}>
            {moment(label).format('MMM DD, YYYY')}
          </div>
          <div>{`Close: $${Number(payload[0].value).toFixed(2)}`}</div>
        </div>
      );
    }
    return null;
  };

const StockTicker = () => {
    // Default chart period.
    // const [selectedPeriod, setSelectedPeriod] = useState('1m');
    const period = useStore((state) => state.period);
    const setPeriod = useStore((state) => state.setPeriod);
    const [chartData, setChartData] = useState(null);
    const darkMode = useStore((state) => state.darkMode);
    const isLoading = useStore((state) => state.isLoading);
    // Pull the stock info from the store.
    const stock_info = useStore((state) => state.stock_info);
    const ticker = useStore((state) => state.ticker);
    // Whenever the stored stock_info or the selected period changes, format the chart data.
    useEffect(() => {
        if (!stock_info) return;
        // For the 1d period, use the oneDayHistory data.
        if (period === '1d') {
            if (stock_info.oneDayHistory) {
                const key = `('Close', '${ticker}')`;
                // console.log(key)
                // console.log(stock_info.oneDayHistory['1d'])
                const formatted = Object.entries(stock_info.oneDayHistory['1d']).map(
                    ([date, value]) => ({
                        date: moment(date).format('MMM DD, YYYY h:mm A'),
                        close: Number(value[key]),
                    })
                );
                setChartData(formatted);
            }
        } else {
            // Otherwise, use the full 5y history.
            if (stock_info.history) {
                // Filter the full history based on the selected period.
                const filtered = filterDataByPeriod(stock_info.history, period);
                const formatted = filtered.map((item) => ({
                    date: moment(item.date).format('MMM DD, YYYY'),
                    close: Number(item.adjClose),
                }));
                setChartData(formatted);
            }
        }
    }, [stock_info, period]);

    return (
        <div className="stock-ticker">
           
            {chartData && !isLoading ? (
                <ResponsiveContainer width="100%" height={300}>
                    <AreaChart
                        data={chartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={darkMode ? "#FD77D7" : "#FD77D7"} stopOpacity={0.9} />
                                <stop offset="95%" stopColor={darkMode ? "#FD77D7" : "#FD77D7"} stopOpacity={0.7} />
                            </linearGradient>
                        </defs>
                        <XAxis
                            dataKey="date"
                            tick={{ fontSize: 9 }}
                            axisLine={false}
                        />
                        <YAxis
                            domain={([dataMin, dataMax]) => {
                                const min = dataMin - (dataMax - dataMin) * 0.2;
                                const max = dataMax + (dataMax - dataMin) * 0.2;
                                return [min, max];
                            }}
                            tick={{ fontSize: 10 }}
                            tickFormatter={(number) => number.toFixed(2)}
                            axisLine={false}
                        />
                        <Tooltip
                            content={<CustomToolTip />}
                            contentStyle={darkMode ? { backgroundColor: "#111827" } : null}
                            itemStyle={darkMode ? { color: "#818cf8" } : null}
                        />
                        {/* <CartesianGrid strokeDasharray="3 3" /> */}
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
            ) : null}
        </div>
    );
};

export default StockTicker;