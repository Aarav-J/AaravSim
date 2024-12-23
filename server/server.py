
# A very simple Flask Hello World app for you to get started with...

from flask import Flask, jsonify, request, abort
import yfinance as yf
from datetime import datetime
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello from Flask!'


# API key for secure access (this should be stored in an environment variable in production)
# API_KEY = "Hello"

# # Helper function to validate the API key
# def validate_api_key(api_key):
#     if api_key != API_KEY:
#         abort(401, description="Unauthorized: Invalid API Key")
# Format numbers for readability
def format_number(num):
    if num >= 1_000_000_000_000:  # Trillion
        return f"{num / 1_000_000_000_000:.2f}T"
    elif num >= 1_000_000_000:  # Billion
        return f"{num / 1_000_000_000:.2f}B"
    elif num >= 1_000_000:  # Million
        return f"{num / 1_000_000:.2f}M"
    elif num >= 1_000:  # Thousand
        return f"{num / 1_000:.2f}K"
    else:  # Smaller numbers
        return str(num)

# Fetch stock history
def get_history(ticker, period):
    stock = yf.Ticker(ticker)
    history = stock.history(period=period)

    # Ensure index (datetime) and columns are JSON-serializable
    history.index = history.index.astype(str)  # Convert DatetimeIndex to string
    return history.to_dict()
# Fetch stock recommendations
def get_recommendation(ticker):
    stock = yf.Ticker(ticker)
    recommendations = stock.recommendations  # Fetch recommendations DataFrame

    # Check if recommendations is a valid DataFrame
    if recommendations is not None and not recommendations.empty:
        try:
            # Summing up all recommendation values across periods
            total_recommendations = recommendations[['strongBuy', 'buy', 'hold', 'sell', 'strongSell']].sum()
            
            return {
                "strongBuy": int(total_recommendations.get('strongBuy', 0)),
                "buy": int(total_recommendations.get('buy', 0)),
                "hold": int(total_recommendations.get('hold', 0)),
                "sell": int(total_recommendations.get('sell', 0)),
                "strongSell": int(total_recommendations.get('strongSell', 0))
            }
        except KeyError as e:
            # Handle missing columns gracefully
            return {"error": f"KeyError: {str(e)}"}
    else:
        # Return empty structure if recommendations are missing or invalid
        return {
            "strongBuy": 0,
            "buy": 0,
            "hold": 0,
            "sell": 0,
            "strongSell": 0
        }

# Fetch stock info
def get_stock_info(ticker):
    stock = yf.Ticker(ticker)
    info = stock.info

    # Helper function for safely getting values
    def safe_get(key, default=None):
        return info.get(key, default)

    try:
        return {
            'name': safe_get("shortName", "Unknown"),
            "symbol": safe_get("symbol", ticker),
            "shortDescription": safe_get("longBusinessSummary", "No description available."),
            "currentPrice": safe_get("currentPrice"),
            "history": {
                "1d": get_history(ticker, "1d"),
                "5d": get_history(ticker, "5d"),
                "1m": get_history(ticker, "1mo"),
                "6m": get_history(ticker, "6mo"),
                "1y": get_history(ticker, "1y"),
                "5y": get_history(ticker, "5y")
            },
            "priceStats": {
                "dayLow": safe_get("dayLow"),
                "dayHigh": safe_get("dayHigh"),
                "fiftyTwoWeekLow": safe_get("fiftyTwoWeekLow"),
                "fiftyTwoWeekHigh": safe_get("fiftyTwoWeekHigh"),
                "open": safe_get("regularMarketOpen")
            },
            "marketCap": format_number(safe_get("marketCap", 0)),
            "volume": format_number(safe_get("regularMarketVolume", 0)),
            "P/E": (safe_get("currentPrice") / safe_get("trailingEps")) if safe_get("trailingEps") else None,
            "EPS": safe_get("trailingEps"),
            "beta": safe_get("beta"),
            "P/S": safe_get("priceToSalesTrailing12Months"),
            "P/B": safe_get("priceToBook"),
            "dividendRate": safe_get("dividendRate"),
            "dividendYield": safe_get("dividendYield"),
            "revenue": format_number(safe_get("totalRevenue", 0)),
            "netIncome": format_number(safe_get("netIncomeToCommon", 0)),
            "PEG": safe_get("trailingPegRatio"),
            "recommendation": get_recommendation(ticker)
        }
    except Exception as e:
        # Log the error for debugging and return minimal data with the error message
        return {
            "error": f"Failed to retrieve stock info for {ticker}: {str(e)}"
        }
# Fetch news for the ticker
def get_news(ticker):
    stock = yf.Ticker(ticker)
    news = stock.news
    return news if news else []

@app.route('/api/stock/<ticker>', methods=['GET'])
def stock_info(ticker):
    # api_key = request.args.get('api_key')
    # validate_api_key(api_key)  # Validate API key
    try:
        data = get_stock_info(ticker)
        return jsonify(data)
    except Exception as e:
        abort(400, description=str(e))

@app.route('/api/news/<ticker>', methods=['GET'])
def stock_news(ticker):
    # api_key = request.args.get('api_key')
    # validate_api_key(api_key)  # Validate API key
    try:
        data = get_news(ticker)
        return jsonify(data)
    except Exception as e:
        abort(400, description=str(e))

@app.route('/api/recommendation/<ticker>', methods=['GET'])
def stock_recommendation(ticker):
    # api_key = request.args.get('api_key')
    # validate_api_key(api_key)  # Validate API key
    try:
        data = get_recommendation(ticker)
        return jsonify(data)
    except Exception as e:
        abort(400, description=str(e))

if __name__ == '__main__':
    app.run(debug=True)