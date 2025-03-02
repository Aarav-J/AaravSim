import {create} from 'zustand'

const useStore = create((set, get) => ({ 
    darkMode: true, 
    setDarkMode: (darkMode) => set({darkMode}),
    ticker: null, 
    stock_info: null, 
    stock_news: null, 
    stock_recommendations: null,
    isLoading: false, 
    period: '1m',
    user: null, 
    session: null, 
    selectedDashboard: 'auth',
    pendingUsername: false, 
    pendingUserId: null, 
    pendingUserName: '',
    setPendingUsername: (isPending, userId = null, userName = '') => {
        // console.log("Setting pending username:", isPending, userId, userName);
        set({ 
          pendingUsername: isPending,
          pendingUserId: isPending ? userId : null,
          pendingUserName: isPending ? userName : '',
        });
      },
      setSelectedDashboard: (dashboard) => {
        // console.log('set selected dashboard: ', dashboard);
        // If we have a pending username setup, keep showing auth dashboard
        if (get().pendingUsername && dashboard !== 'auth') {
          // console.log("Keeping auth dashboard open for username setup");
          return;
        }
        set({ selectedDashboard: dashboard });
      },
    setSession: (session) => {
        // console.log("Setting session:", session ? "exists" : "null");
        const currentDashboard = get().selectedDashboard;
        
        // Don't change dashboard to landing if we're going to auth
        if (!session && currentDashboard !== 'auth') {
          // console.log("No session, setting dashboard to landing");
          set({ session, selectedDashboard: 'landing' });
        } else {
          set({ session });
        }
      },
      setUser: (user) => {
        // console.log("Setting user:", user ? "exists" : "null");
        
        if (user) {
          // Clear pending username state when setting a complete user
          set({ 
            user, 
            pendingUsername: false,
            pendingUserId: null,
            pendingUserName: '',
            selectedDashboard: 'home' 
          });
        } else {
          // Only navigate to landing if we're not in a pending username state
          const currentDashboard = get().selectedDashboard;
          const isPending = get().pendingUsername;
          
          if (!isPending && currentDashboard !== 'auth') {
            set({ user, selectedDashboard: 'landing' });
          } else {
            set({ user });
          }
        }
      },
      resetAppState: () => {
        const goingToAuth = get().selectedDashboard === 'auth';
        // console.log("Resetting app state, going to auth:", goingToAuth);
        
        set({
          user: null,
          session: null,
          selectedDashboard: goingToAuth ? 'auth' : 'landing',
          // Reset other state as needed
        });
      },
      resetAuthState: () => { 
        // console.log("resetting auth state")
        set({ 
            needsUsername: false, 
        })
      },
    setPeriod: (new_period) => set(() => ({period: new_period})),
    setIsLoading: (isLoading) => set({isLoading}),
    setStockNews: (new_stock_news) => set(() => ({stock_news: new_stock_news})),
    setStockRecommendations: (new_stock_recommendations) => set(() => ({stock_recommendations: new_stock_recommendations})),
    setStockInfo: (new_stock_info) => set(() => ({stock_info: new_stock_info})),
    setTicker: (new_ticker) => set(() => ({ticker: new_ticker})), 

    
}))

export default useStore