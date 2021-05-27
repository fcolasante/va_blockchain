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
 
hr_df = pd.read_csv("hash-rate_all_raw.csv", delimiter=',', parse_dates=True, date_parser=dateparse, index_col='Timestamp')
hr_pap = pd.read_csv("hr_paper.csv", delimiter=';', parse_dates=True,date_parser=dateparseday, index_col='Timestamp')
print(hr_pap)
df = pd.merge(left=hr_df, right=hr_pap, how='inner', on='Timestamp')
df.plot()
hr_pap.plot()
hr_df.plot()

plt.show()