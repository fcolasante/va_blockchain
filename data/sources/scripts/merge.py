import matplotlib

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import datetime
import ast

def dateparse (timestr):    
    return datetime.datetime.strptime(timestr, '%Y-%m-%d %H:%M:%S')


hashRate = pd.read_csv("csv/hash-rate.csv", delimiter=',', parse_dates=True,date_parser=dateparse)
timeBlock = pd.read_csv('csv/avg-confirmation-time.csv', delimiter=",", parse_dates=True, date_parser=dateparse)
mp = pd.read_csv('csv/market-price.csv', delimiter=",", parse_dates=True, date_parser=dateparse)

#print(hashRate.head())


print(hashRate.dtypes)

# np.select: https://www.dataquest.io/blog/tutorial-add-column-pandas-dataframe-based-on-if-else-condition/
# extract year from Timestamp: https://stackoverflow.com/questions/30405413/python-pandas-extract-year-from-datetime-dfyear-dfdate-year-is-not-wo
conditions = [
    (pd.to_datetime(hashRate['Timestamp']).dt.year >= 2020),
    (pd.to_datetime(hashRate['Timestamp']).dt.year == 2019),
    (pd.to_datetime(hashRate['Timestamp']).dt.year >= 2018)
]
PE_Year = [0.10, 0.11, 0.15]

hashRate['PE'] = np.select(conditions, PE_Year)

hashRate['PowerRequired'] = hashRate['hash-rate'] * 1000 * hashRate['PE'] / 10**6
hashRate['Energy'] = hashRate['PowerRequired'] * 24

hashRate.head()
#hashRate.plot(x='Timestamp', y=['Energy'])
#plt.show()

print(timeBlock)
df = pd.merge(left=hashRate, right=timeBlock, left_on='Timestamp', right_on='Timestamp')
df = pd.merge(left=df, right=mp, left_on='Timestamp', right_on='Timestamp')

# REWARDS
conditions = [
    (pd.to_datetime(hashRate['Timestamp']) <= datetime.datetime(2012, 11, 28, 00, 00)),
    (pd.to_datetime(hashRate['Timestamp']) <= datetime.datetime(2016, 7,   9, 00, 00)),
    (pd.to_datetime(hashRate['Timestamp']) <= datetime.datetime(2020, 5,   5, 00, 00)),
    True
]
# https://www.cmcmarkets.com/en/learn-cryptocurrencies/bitcoin-halving

Rewards = [50, 25, 12.5, 6.25]
df["Reward"] = np.select(conditions, Rewards)
# coins/block
print(df)

df["EnergyXCoin"] = df['avg-confirmation-time'] * df['PowerRequired'] / 60 / df['Reward'] * 1000
# KWh/coin
df["CoinsXDay"] = 24 * 60 / df['avg-confirmation-time'] * df['Reward']
#df.plot(x='Timestamp', y=['CoinsXDay'])
#plt.show()

#df['CoinsXDay'].cumsum(axis = 0, skipna = True).plot()
#plt.show()


timeBlock.plot.box()
plt.show()

from statsmodels.tsa.seasonal import seasonal_decompose
from dateutil.parser import parse
