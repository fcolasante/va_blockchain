import numpy as np
import pandas as pd

MODE    = "data"  # "data" or "sameHR"
SAVE    = True
VERBOSE = False

efficiencies = {
    "BTC" : 0.031,   # SHA-256
    "ETH" : 1250,    # EtHash
    "LTC" : 955,     # Scrypt
    "XMR" : 2000000, # CryptoNight
    "BCH" : 0.031,   # SHA-256
    "BSV" : 0.031,   # SHA-256
    "DASH": 5.0,     # X11
    "DOGE": 955,     # Scrypt
    "ETC" : 1250,    # EtHash 
    "VTC" : 860,     # EagleSong
    "ZEC" : 3595000, # Equihash     
}


def consumptionFromHashrate(data_df, eff: float=0.02, same_hr: bool=False, verbose: bool=VERBOSE):
    """
    Compute an estimate of cryptos energy consumption from estimated efficiency (eff) and hashrate data.
    """
    count = 0
    year_ends = []
    years = [str(year) for year in range(2016,2030,1)]
    for y in years:
        if int(y) % 4 == 0:
            count += 366
        else:
            count += 365

        year_ends.append(count)

    hr_race_df = pd.DataFrame(columns=data_df.columns)
    hr_race_df["date"] = years

    # computing hashrate prediction via regression for each crypto (i.e. each column)
    print(f"\n[INFO]: Computing crypto energy consumption from hashrate (using efficiency {eff:0.2f}) ...\n")
    for crypto in data_df.columns[1:]:
        print(f"Analyzing hashrate of {crypto} ...")
        
        # removing NaN values for cryptos that have only recent data
        y = np.array(data_df[crypto], dtype=np.float64)
        y[np.isnan(y)] = 0
        
        if (crypto == "BTC" and same_hr):
            hr_list = []

        cons_list = []
        start = 0
        for end in range(len(year_ends)):
            if not same_hr:
                hr_year = np.sum(y[start:year_ends[end]])
            else:
                # use BTC hahrate for all crypto with relative efficiency
                eff = efficiencies[crypto]
                if crypto == "BTC":
                    # compute year hr for BTC
                    hr_year = np.sum(y[start:year_ends[end]])
                    hr_list.append(hr_year)
                else:
                    # reuse BTC year hr for other crypto
                    hr_year = hr_list[end]

            if verbose:
                print(f"hr: {hr_year}")
                print(f"eff: {eff}, crypto: {crypto}")

            # compute estimated consumption
            cons_year = np.multiply(hr_year, eff*1000)
            cons_year = cons_year/(24*1000000)
            cons_year = np.divide(cons_year, 1000)
            # -----------------------------

            cons_list.append(cons_year)
            start = year_ends[end]

        hr_series = pd.Series(cons_list)
        hr_race_df[crypto] = hr_series
        #print("hr_list", len(cons_list))
            
    print()
    if verbose:
        print(hr_race_df.T)

    hr_race_df = hr_race_df.T
    hr_race_df.to_csv(f"data/dataset/temp_{eff}.csv")


###############################
#     ENERGY CONSUMPTION      #
###############################
print("\n################## CONSUMPTION")
mode = MODE

# read full consumption data from csv file to compute weighted percentile over all years
full_df = pd.read_csv(f"data/dataset/race/raw_race_{mode}.csv", delimiter=",", skiprows=2)
print(full_df)

country_col = "country"
race_df = pd.DataFrame(columns=["name", "value", "year", "lastValue", "rank"])
lastValue = 0.0

# compute country consumption ranking7 (since 1980)
print("\n[INFO]: Computing country consumption ranking...")
for col in full_df.columns[1:]:
    sorted_df = full_df.sort_values(by=[col], ascending=False, ignore_index=True)
    sorted_np = sorted_df[col].to_numpy()

    if col != "2029":
        # last year has no next
        next_col = str(int(col)+1)
        last_df = full_df.sort_values(by=[next_col], ascending=False, ignore_index=True)
        last_df = last_df[col][:30].append(last_df[col][-10:], ignore_index=True)

    # first 30 country consumption
    to_race = sorted_df[[country_col,col]][:30].rename(columns={
        country_col : "name", 
        col : "value"})

    # crypto consumption
    race_crypto = sorted_df[[country_col,col]][-10:].rename(columns={
        country_col : "name", 
        col : "value"})

    to_race = to_race[["name","value"]].append(race_crypto, ignore_index=True, verify_integrity=True)
    to_race.insert(2, "lastValue", lastValue, True)
    to_race.insert(2, "year", int(col), True)
    to_race.insert(2, "rank", np.arange(1,40+1), True)
    
    lastValue = last_df
    race_df = race_df.append(to_race, ignore_index=True, verify_integrity=True)

    print(f"---> year: {col}")
    if VERBOSE:
        print("  to_race cols: ", to_race.columns)
        print("  race_df cols: ", race_df.columns)
        print(f"col <{col}> added")

sorted_race = race_df.sort_values(by=["rank"], ascending=True, ignore_index=True)    
if SAVE:
    sorted_race.to_csv(f"data/dataset/race/race_{mode}.csv", columns=["name","value","year","lastValue","rank"])
print(sorted_race)


###############################
#         HASHRATE            #
###############################
print("\n################## HASHRATE")
hr_df = pd.read_csv("data/dataset/race/hashrate_race.csv", delimiter=",")
print(hr_df)

eff_range = [0.02, 0.05]
if MODE == "data":
    for eff in eff_range:
        consumptionFromHashrate(data_df=hr_df, eff=eff)

elif MODE == "sameHR":
    consumptionFromHashrate(data_df=hr_df, same_hr=True)
