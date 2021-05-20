import pandas as pd
#pd.set_option('display.max_rows', None)

import numpy as np
from matplotlib import pyplot as plt
from sklearn.decomposition import PCA
from sklearn import preprocessing


""" PREPROCESSING DATA TO PERFORM PCA """
# using cleaned file 
df = pd.read_csv("data/asic/asic_clean.csv")
df['hashRate (Th/s)']       = df['hashRate (Th/s)'].astype(float)
df['profitability ($/day)'] = df['profitability ($/day)'].astype(float)
df['power (W)']             = df['power (W)'].astype(int)
df['efficiency (j/Gh)']     = df['efficiency (j/Gh)'].astype(float)
df['release'] = pd.to_datetime(df['release'],format= '%b %Y' )

# save cleaned file
df.to_csv("data/asic/pca_asic.csv")

print(df)
print()
print(df.dtypes)
print()
print(df.head())
print()

release       = df['release'].to_numpy()
hashRate      = df['hashRate (Th/s)'].to_numpy()
profitability = df['profitability ($/day)'].to_numpy()

#df['efficiency (j/Gh)'] = df['efficiency (j/Gh)'].apply(lambda x: x*500)
efficiency = df['efficiency (j/Gh)'].to_numpy()
power      = df['power (W)'].to_numpy()



import matplotlib.cbook as cbook
fig, ax = plt.subplots()

#ax.scatter(release, hashRate, s=efficiency, c=power, alpha=0.5)
ax.scatter(release, hashRate, alpha=0.5)
ax.set_xlabel("Release Date", fontsize=15)
ax.set_ylabel("Hash Rate", fontsize=15)
ax.set_title('ASIC comparison')

ax.grid(True)
fig.tight_layout()

plt.show()


""" PERFOMING PCA """
# stack the preprocessed data into a single numpy.ndarray matrix
d = np.stack([hashRate,power,profitability,efficiency], axis=1)
print(d.shape) 

# plotting d on a 2D scatterplot
plt.plot(d[:,0],d[:,2],
         'o', markersize=5,
         color='blue',
         alpha=0.5,
         label='original data')
plt.xlabel('X1')
plt.ylabel('X2')
plt.legend()
plt.show()


# normalize the data with StandardScaler
d_std = preprocessing.StandardScaler().fit_transform(d)
#d_std is a numpy array with scaled (Z-score) data
#compute PCA
pca=PCA(n_components=4)
d_pca=pca.fit_transform(d_std)
#d_pca is a numpy array with transformed data


#plotting d_pca 
plt.plot(d_pca[:,0],d_pca[:,1],
         'o', markersize=7,
         color='blue',
         alpha=0.5,
         label='PCA transformed data in the new 2D space')
plt.xlabel('X1')
plt.ylabel('X2')
plt.xlim([-4,4]) 
plt.ylim([-4,4]) 
plt.legend()
plt.show()


#projecting new values on the first component Y1
plt.plot(d_pca[:,0],[0] * len(d),  #=[0,0,0,0,..]
         'o',
         markersize=7,
         color='green',
         alpha=0.5,
         label='PCA first component proj')
plt.xlabel('Y1')
plt.ylabel('Y2')
plt.xlim([-4,4])
plt.ylim([-4,4])
plt.legend()
plt.title('Transformed data projected on first component')
plt.show()


d_cov=np.cov(d.T)
for i in range(len(d_cov)):
    print('Variance original data not scaled axis n'+str(i),d_cov[i][i])

#compute the covariance matrix
d_cov=np.cov(d_std.T)

#compute and sort eigenvalues
d_val,d_vec= np.linalg.eig(d_cov)
d_val.sort()

print('Variance of the two PCA components:',d_val[1]/sum(d_val),d_val[0]/sum(d_val))

v=pca.explained_variance_ratio_
print(v)