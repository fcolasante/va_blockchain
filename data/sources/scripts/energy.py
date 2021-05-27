import matplotlib

import matplotlib.pyplot as plt
import pandas as pd
import numpy as np
import datetime
import ast
def dateparse (timestr):    
    return datetime.datetime.strptime(timestr, '%Y-%m-%d %H:%M:%S')

def dateparseday (timestr):    
    return datetime.datetime.strptime(timestr, "%d/%m/%Y")
 
df = pd.read_csv("hash_rate_all_raw.csv", delimiter=',', parse_dates=True, index_col='Timestamp')
print(df)
df['P'] = df.apply(lambda row: row.hash_rate * 1000 * 0.10 / 10**6, axis = 1)
df['EnergyXDay'] = df.apply(lambda row: row.P * 24, axis = 1) 
df.plot(y=['P', 'EnergyXDay'])

timeBlock = pd.read_csv('csv/avg-confirmation-time.csv', delimiter=",");
print(timeBlock)
merged_inner = pd.merge(left=df, right=timeBlock, left_on='Timestamp', right_on='Timestamp')
print(merged_inner)