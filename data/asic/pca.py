import pandas as pd
pd.set_option('display.max_rows', None)

df = pd.read_csv("efficiency_sha256.csv")
df['hashRate'] = df['hashRate'].apply(lambda x: x[:-4]).astype(float)
df['profitability'] = df['profitability'].apply(lambda x: x[1:-4])
df['power'] = df['power'].apply(lambda x: x[:-1]).astype(int)
df['efficiency'] = df['efficiency'].apply(lambda x: x[:-4]).astype(float)

df['release'] = pd.to_datetime(df['release'],format= '%b %Y' )

print(df)
print(df.dtypes)
print(df.head())
release = df['release'].to_numpy()
hashRate = df['hashRate'].to_numpy()

df['efficiency'] = df['efficiency'].apply(lambda x: x*500)
efficiency = df['efficiency'].to_numpy()
power = df['power'].to_numpy()
df.to_csv('asic.csv',index=False)
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.cbook as cbook

fig, ax = plt.subplots()

ax.scatter(release, hashRate,s=efficiency,c=power, alpha=0.5)

ax.set_xlabel("Release Date", fontsize=15)
ax.set_ylabel("Hash Rate", fontsize=15)
ax.set_title('ASIC comparison')

ax.grid(True)
fig.tight_layout()

plt.show()