import pandas as pd
#pd.set_option('display.max_rows', None)

#df = pd.read_csv("efficiency_sha256.csv")
#df['hashRate'] = df['hashRate'].apply(lambda x: x[:-4]).astype(float)
#df['profitability'] = df['profitability'].apply(lambda x: x[1:-4])
#df['power'] = df['power'].apply(lambda x: x[:-1]).astype(int)
#df['efficiency'] = df['efficiency'].apply(lambda x: x[:-4]).astype(float)
#df['release'] = pd.to_datetime(df['release'],format= '%b %Y' )

# using clean file 
df = pd.read_csv("data/asic/asic_clean.csv")
df['hashRate (Th/s)']       = df['hashRate (Th/s)'].astype(float)
df['profitability ($/day)'] = df['profitability ($/day)'].astype(float)
df['power (W)']             = df['power (W)'].astype(int)
df['efficiency (j/Gh)']     = df['efficiency (j/Gh)'].astype(float)

df['release'] = pd.to_datetime(df['release'],format= '%b %Y' )

print(df)
print()
print(df.dtypes)
print()
print(df.head())
print()

release  = df['release'].to_numpy()
hashRate = df['hashRate (Th/s)'].to_numpy()

df['efficiency (j/Gh)'] = df['efficiency (j/Gh)'].apply(lambda x: x*500)
efficiency = df['efficiency (j/Gh)'].to_numpy()
power      = df['power (W)'].to_numpy()
df.to_csv('data/asic/asic.csv',index=False)


import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cbook as cbook

fig, ax = plt.subplots()

ax.scatter(release, hashRate, s=efficiency, c=power, alpha=0.5)
#ax.scatter(release, hashRate, alpha=0.5)

ax.set_xlabel("Release Date", fontsize=15)
ax.set_ylabel("Hash Rate", fontsize=15)
ax.set_title('ASIC comparison')

ax.grid(True)
fig.tight_layout()

plt.show()