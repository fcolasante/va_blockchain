import numpy as np
import pandas as pd
from scipy.interpolate import interp1d

VERBOSE = False

# read consumption data from csv file
print("\n################## MOST RECENT DATA")
df = pd.read_csv("data/dataset/country_consumption.csv", delimiter=",", skiprows=2)
print(df)
print()


"""
    WEIGHTED PERCENTILE
    (how much of the consumption (%) is due to how many countries)
"""
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
    weights_sum = np.sum(a, axis=None)
    if verbose:
        print("[INFO]: debug ...")
        print("  w_sum:", weights_sum)
    p_n, n = recursive_wp(seq=a, q=q, curr_n=len(a)-1, weights_sum=weights_sum, verbose=verbose)
    return p_n, n
    

# compute 90th weighted percentile for each year
for col in df.columns[1:4]:
    sorted_df = df.sort_values(by=[col], ascending=False, ignore_index=True)
    sorted_np = sorted_df[col].to_numpy()
    
    #percentile = np.percentile(sorted_np, 50, interpolation='lower')
    #percentile_idx = np.where(sorted == percentile)[0]
    #rslt_df = df.loc[df[col] == percentile]
    #print(f"    50th percentile: {percentile} ==> {rslt_df['country']} -> pos: {percentile_idx}")

    q = 0.9
    p_n, n = weighted_percentile(sorted_np, q=q)
    print(f"#### year: {col}")
    print(f"    weighted perc: {p_n:0.4f}, pos: {n}, country: {sorted_df['country'][n]}\n")

print()
countries = df["country"].apply(lambda row: str(row))



"""
    CONSUMPTION PREDICTION
"""
# read full consumption data from csv file
print("################## FULL DATA")
full_df = pd.read_csv("data/dataset/INT-Export-05-18-2021_11-31-59.csv", delimiter=",", skiprows=2)
print(full_df)

# compute 90th weighted percentile for each year avilable (since 1980)
for col in full_df.columns[2:-1]:
    sorted_df = full_df.sort_values(by=[col], ascending=False, ignore_index=True)
    sorted_np = sorted_df[col].to_numpy()
    if VERBOSE:
        print(sorted_np)

    p_n, n = weighted_percentile(sorted_np, q=0.9)
    print(f"#### year: {col}")
    print(f"---> weighted perc: {p_n:0.4f}, pos: {n}, country: {sorted_df['Country (billion kWh)'][n][8:]}")

print()