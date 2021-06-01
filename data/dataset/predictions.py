import numpy as np
from numpy.core.numeric import full
import pandas as pd
import matplotlib.pyplot as plt

PLOTS = False
VERBOSE = False


def recursive_wp(seq, q, curr_n, weights_sum, verbose=False):
    if curr_n <= 0:
        return 0.0, 0

    w_n = seq[curr_n]
    s_n = np.sum(seq[:curr_n], axis=None) # + w_n ??
    curr_p_n = (s_n - (w_n/2))/weights_sum
    if verbose:
        print("[INFO]: debug ...")
        print("  w_sum:", weights_sum)
        print("  curr_p_n:", curr_p_n)
        print("  curr_n:", curr_n)

    if curr_p_n <= q:
        # basic step 
        return curr_p_n, curr_n
    else:
        # recursive step
        return recursive_wp(seq,q,curr_n-1,weights_sum)

def weighted_percentile(a, q=0.5, verbose=VERBOSE):
    """
    Computes the q-th weighted percentile of the np.array a. 
    """
    weights_sum = np.sum(a, axis=None)
    if verbose:
        print("[INFO]: debug ...")
        print("  w_sum:", weights_sum)
    p_n, n = recursive_wp(seq=a, q=q, curr_n=len(a)-1, weights_sum=weights_sum, verbose=verbose)
    return p_n, n


"""
    WEIGHTED PERCENTILE
    (how much of the consumption (%) is due to how many countries)
"""
# read consumption data from csv file
print("\n################## MOST RECENT DATA")
df = pd.read_csv("data/dataset/country_consumption.csv", delimiter=",", skiprows=2)
print(df)
print()
    
# compute 90th weighted percentile for each year
print("[INFO]: Computing 90th weighted percentile on recent data...")
for col in df.columns[1:4]:
    sorted_df = df.sort_values(by=[col], ascending=False, ignore_index=True)
    sorted_np = sorted_df[col].to_numpy()
    
    #percentile = np.percentile(sorted_np, 50, interpolation='lower')
    #percentile_idx = np.where(sorted == percentile)[0]
    #rslt_df = df.loc[df[col] == percentile]
    #print(f"    50th percentile: {percentile} ==> {rslt_df['country']} -> pos: {percentile_idx}")

    q = 0.9
    p_n, n = weighted_percentile(sorted_np, q=q)
    print(f"---> year: {col}")
    print(f"  weighted perc: {p_n:0.4f}, pos: {n}, country: {sorted_df['country'][n]}")


print("\n################## FULL DATA")
# read full consumption data from csv file to compute weighted percentile over all years
full_df = pd.read_csv("data/dataset/INT-Export-05-18-2021_11-31-59.csv", delimiter=",", skiprows=2)
print(full_df)

# compute 90th weighted percentile for each year avilable (since 1980)
print("\n[INFO]: Computing 90th weighted percentile on all data...")
for col in full_df.columns[2:-1]:
    sorted_df = full_df.sort_values(by=[col], ascending=False, ignore_index=True)
    sorted_np = sorted_df[col].to_numpy()
    if VERBOSE:
        print(sorted_np)

    p_n, n = weighted_percentile(sorted_np, q=0.9)
    print(f"---> year: {col}")
    print(f"  weighted perc: {p_n:0.4f}, pos: {n}, country: {sorted_df['Country (billion kWh)'][n][8:]}")

print()



"""
    CONSUMPTION PREDICTION
    (through polynomial regression)
"""
print("\n################## PREDICTIONS")
#sorted_df = full_df.sort_values(by=["Country (billion kWh)"], ascending=True, ignore_index=True)

tot_years = 42
years_to_plt = 40 # starting from latest
col_idx = tot_years - years_to_plt
cons_preds = []

# computing consumption prediction via regression for each country (i.e. each row)
print(f"\n[INFO]: Computing regression on consumption data (38 years data) ...")
for idx, row in full_df.iterrows():
    country_name = row["Country (billion kWh)"][8:]
    x = np.arange(0,len(row[col_idx:-1]),1,dtype=np.float64)
    y = np.array(row[col_idx:-1],dtype=np.float64)
    #print("Analyzing consumption of", country_name, "...")
    
    poly_model = np.polyfit(x,y,1)
    predict = np.poly1d(poly_model)

    x_sqr_reg = np.arange(0,len(row[col_idx:-1]),1)
    y_sqr_reg = predict(x_sqr_reg)
    if PLOTS:
        plt.figure()
        cols_labels = [full_df.columns[col_idx:-1][col] for col in range(0,len(full_df.columns[col_idx:-1])+1,5)]

        plt.scatter(x, y, alpha=0.5)
        plt.plot(x_sqr_reg, y_sqr_reg, c='r')
        plt.xlabel("year", fontsize=10)
        plt.xticks(np.arange(0,len(row[col_idx:-1])+1,5), labels=cols_labels, rotation=45)
        plt.ylabel("consumption (10^9 kWh)", fontsize=10)
        plt.yticks(np.arange(0,100+1,10))

        plt.title(country_name)
        plt.grid(True)
        if VERBOSE:
            print(len(row[col_idx:-1]))
            print([col for col in full_df.columns[col_idx:-1]])

        plt.show()
        
    x_to_pred = np.arange(years_to_plt,years_to_plt+10,1)
    y_preds = predict(x_to_pred)
    # append prediction to DataFrame
    cons_preds.append([country_name] + list(y_preds))
    

year_to_pred = ["country"] + [str(year) for year in range(2020,2030,1)]
cons_preds_df = pd.DataFrame(cons_preds, columns=year_to_pred)
print(cons_preds_df)
cons_preds_df.to_csv("data/dataset/consumption_preds.csv")



"""
    HASHRATE PREDICTION
    (through polynomial regression)
"""
print("\n\n################## CRYPTO HASHRATE")
# read crypto hashrate data from csv
hr_df = pd.read_csv("data/dataset/hashrate_complete.csv", delimiter=",")
print(hr_df)

days_to_pred = (366*3) + (365*7)  # 3 leap and 7 normal years to predict 
hr_preds_df = pd.DataFrame(columns=hr_df.columns)


# computing hashrate prediction via regression for each crypto (i.e. each column)
print(f"\n[INFO]: Computing regression on hashrate data ({len(hr_df['date'])//365} years data) ...")
for crypto in hr_df.columns[1:]:
    x = np.arange(0,len(hr_df[crypto]),1,dtype=np.float64)
    y = np.array(hr_df[crypto],dtype=np.float64)
    print(f"Analyzing hashrate of {crypto} ...")

    poly_model = np.polyfit(x,y,1)
    predict = np.poly1d(poly_model)

    x_sqr_reg = np.arange(0,len(hr_df[crypto]),1)
    y_sqr_reg = predict(x_sqr_reg)

    x_to_pred = np.arange(len(hr_df[crypto]),len(hr_df[crypto])+days_to_pred,1)
    y_preds = predict(x_to_pred)
    # append prediction to DataFrame
    hr_preds_df[crypto] = pd.Series(y_preds)


import datetime 
base = datetime.date.fromisoformat(list(hr_df["date"])[-1])
date_list = [base + datetime.timedelta(days=x) for x in range(1,days_to_pred+1)]
hr_preds_df["date"] = date_list
print("\n[INFO]: last hr date:", base)
print("[INFO]: last pred date:", date_list[-1])


print()
print(hr_preds_df)
hr_preds_df.to_csv("data/dataset/hashrate_preds.csv")