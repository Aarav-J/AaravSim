import {create} from 'zustand'

const useStore = create((set) => ({ 
    darkMode: false, 
    setDarkMode: (darkMode) => set({darkMode}),
    ticker: null, 
    stock_info: null, 
    stock_news: null, 
    stock_recommendations: null,
    isLoading: false, 
    period: '1m',
    setPeriod: (new_period) => set(() => ({period: new_period})),
    setIsLoading: (isLoading) => set({isLoading}),
    setStockNews: (new_stock_news) => set(() => ({stock_news: new_stock_news})),
    setStockRecommendations: (new_stock_recommendations) => set(() => ({stock_recommendations: new_stock_recommendations})),
    setStockInfo: (new_stock_info) => set(() => ({stock_info: new_stock_info})),
    setTicker: (new_ticker) => set(() => ({ticker: new_ticker})), 

    
}))

export default useStore