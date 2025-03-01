from flask import Flask, jsonify, request, abort
from flask_cors import CORS
from datetime import datetime, timedelta
import pandas as pd


import yfinance as yf
# def parse_period(period):
#     today = datetime.today()
#     periods = {
#         '5d': 5,
#         '1mo': 30,
#         '6mo': 180,
#         '1y': 365,
#         '5y': 5 * 365
#     }
    
#     def subtract_weekdays(start_date, days):
#         current_date = start_date
#         while days > 0:
#             current_date -= timedelta(days=1)
#             if current_date.weekday() < 5:  # Monday to Friday are 0-4
#                 days -= 1
#         return current_date

#     if period == '5d':
#         start_date = subtract_weekdays(today, periods[period])
#     else:
#         delta = timedelta(days=periods.get(period, 1))
#         start_date = today - delta

#     return start_date.strftime('%Y-%m-%d'), today.strftime('%Y-%m-%d')
def get_history(tickers):
    ticker = yf.Ticker(tickers)
    print(ticker.info)

get_history("QQQ")
