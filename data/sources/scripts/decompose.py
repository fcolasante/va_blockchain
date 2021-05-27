import matplotlib

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import datetime
import ast

def dateparse (timestr):    
    return datetime.datetime.strptime(timestr, '%Y-%m-%d %H:%M:%S')


hashRate = pd.read_csv("csv/hash-rate.csv", delimiter=',', parse_dates=True,date_parser=dateparse)
df = pd.read_csv('csv/avg-confirmation-time.csv', delimiter=",", parse_dates=True, date_parser=dateparse)
mp = pd.read_csv('csv/market-price.csv', delimiter=",", parse_dates=True, date_parser=dateparse)

from statsmodels.tsa.seasonal import seasonal_decompose
from dateutil.parser import parse


# Import Data
df_diff = pd.read_csv('csv/difficulty.csv', delimiter=",", parse_dates=True, date_parser=dateparse, index_col='Timestamp')
df_conf = pd.read_csv('csv/avg-confirmation-time.csv', delimiter=",", parse_dates=True, date_parser=dateparse, index_col='Timestamp')
df = pd.merge(left=df_diff, right=df_conf, left_on='Timestamp', right_on='Timestamp')

print(df)
df['difficulty'] /= df['difficulty'].max()
df['difficulty'] *= 100


df.plot()

mean = df['avg-confirmation-time'].mean()
std = df['avg-confirmation-time'].std()
plt.axhline(mean, color='b', linestyle='dashed')

plt.axhline(mean+std, color='g', linestyle='dashed')
plt.axhline(mean-std, color='g', linestyle='dashed')

plt.axhline(10, color='r', linestyle='dotted')
plt.show()

#https://towardsdatascience.com/linear-regression-in-6-lines-of-python-5e1d0cd05b8d 
"""
from sklearn.linear_model import LinearRegression

df = pd.read_csv('csv/avg-confirmation-time.csv', delimiter=",", parse_dates=True, date_parser=dateparse)
df_unix_sec = pd.to_datetime(df['Timestamp']).astype(int)/ 10**9

X = df_unix_sec.values.reshape(-1, 1)
print("X = ")
print(X)
Y = df['avg-confirmation-time'].to_numpy().reshape(-1, 1)  # -1 means that calculate the dimension of rows, but have 1 column
print(Y)
linear_regressor = LinearRegression()  # create object for the class
linear_regressor.fit(X, Y)  # perform linear regression
Y_pred = linear_regressor.predict(X)  # make predictions


plt.plot(X, Y)
print(X)
plt.plot(X, Y_pred, color='red')
plt.show()

print(df.describe())
print(df.std())
df.mean()
"""