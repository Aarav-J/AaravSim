
# AaravSim

Live: [aaravsim.aaravj.xyz](https://aaravsim.aaravj.xyz)

Aaravsim is a full-stack stock market simulator and dashboard application. It allows users to simulate trading, view stock data, manage portfolios, and access market news, all in a modern web interface.

## Features

- **User Authentication**: Secure login and registration.
- **Stock Market Simulation**: Buy and sell stocks with virtual currency.
- **Real-Time Data**: View live stock prices and charts.
- **Portfolio Management**: Track your holdings and account value.
- **Market News**: Stay updated with the latest financial news.
- **Responsive UI**: Built with React and Vite for fast, modern user experience.
- **Backend API**: Python server for data and simulation logic.

## Project Structure

```
root/
├── client/              # Frontend React app (Vite)
│   └── aaravsim/        # Main client code
│       ├── public/      # Static assets
│       ├── src/         # Source code (components, utils, styles)
│       └── ...
├── server/              # Backend Python server
│   └── server.py        # Main server file
└── server_test/         # Server test scripts
```

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Python 3.8+

### Setup

#### 1. Install Client Dependencies
```bash
cd client/aaravsim
npm install
```

#### 2. Start the Client
```bash
npm run dev
```

#### 3. Start the Server
```bash
cd ../../server
python3 server.py
```

#### 4. (Optional) Run Server Tests
```bash
cd ../server_test
npm install
node server_test.js
```

## Configuration
- Edit `client/aaravsim/src/SupabaseClient.js` for Supabase or backend API settings.
- Environment variables can be set in `.env` files as needed.

## Technologies Used
- **Frontend**: React, Vite, SCSS
- **Backend**: Python (Flask or FastAPI recommended)
- **Database**: Supabase (PostgreSQL)
- **Testing**: Jest (for JS), pytest (for Python)

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License
[MIT](LICENSE)

---

*Created by Aarav Jain*