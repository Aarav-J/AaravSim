import { rest } from 'msw';

// Simulation state
let simulationActive = false;
let simulatedPrices = {};

export const marketHandlers = [
  // Check if simulation is active
  rest.get('/api/simulator/status', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({ active: simulationActive })
    );
  }),
  
  // Get simulated price for a specific ticker
  rest.get('/api/simulator/price/:ticker', (req, res, ctx) => {
    const { ticker } = req.params;
    
    if (simulationActive && simulatedPrices[ticker]) {
      return res(
        ctx.status(200),
        ctx.json(simulatedPrices[ticker].current)
      );
    }
    
    return res(
      ctx.status(404),
      ctx.json({ error: 'No simulation data available for this ticker' })
    );
  }),
  
  // Update simulation status
  rest.post('/api/simulator/status', (req, res, ctx) => {
    const { active } = req.body;
    simulationActive = active;
    
    if (!active) {
      // Reset prices when simulation stops
      simulatedPrices = {};
    }
    
    return res(
      ctx.status(200),
      ctx.json({ active: simulationActive })
    );
  }),
  
  // Update simulated prices
  rest.post('/api/simulator/update', (req, res, ctx) => {
    const updates = req.body;
    simulatedPrices = { ...simulatedPrices, ...updates };
    
    return res(
      ctx.status(200),
      ctx.json({ success: true, updatedTickers: Object.keys(updates) })
    );
  }),
  
  // Get historical data for a ticker
  rest.get('/api/daily/:ticker/prices', (req, res, ctx) => {
    const { ticker } = req.params;
    
    if (simulationActive && simulatedPrices[ticker] && simulatedPrices[ticker].historical) {
      console.log(`[MSW] Returning simulated historical data for ${ticker}`);
      return res(
        ctx.status(200),
        ctx.json({
          symbol: ticker,
          historical: simulatedPrices[ticker].historical,
          lastUpdated: new Date().toISOString()
        })
      );
    }
    
    // Pass through to real API
    return req.passthrough();
  }),
  
  // Get current price data
  rest.get('*/price/:ticker', (req, res, ctx) => {
    const { ticker } = req.params;
    
    if (simulationActive && simulatedPrices[ticker] && simulatedPrices[ticker].current) {
      console.log(`[MSW] Returning simulated price for ${ticker}`);
      return res(
        ctx.status(200),
        ctx.json(simulatedPrices[ticker].current)
      );
    }
    
    return req.passthrough();
  })
];