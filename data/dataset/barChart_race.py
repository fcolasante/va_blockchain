import numpy as np
import pandas as pd

SAVE    = True
VERBOSE = False


def consumptionFromHashrate(path="data/dataset/hashrate_race.csv"):
    print("\n################## HASHRATE")
    hr_df = pd.read_csv(path, delimiter=",")
    print(hr_df)

    count = 0
    year_lens = []
    years = [str(year) for year in range(2016,2030,1)]
    for y in years:
        if int(y) % 4 == 0:
            count += 366
        else:
            count += 365

        year_lens.append(count)


    hr_race_df = pd.DataFrame(columns=hr_df.columns)
    hr_race_df["date"] = years

    # computing hashrate prediction via regression for each crypto (i.e. each column)
    print(f"\n[INFO]: Computing crypto consumptio from hashrate ({len(hr_df['date'])//365} years data) ...")
    for crypto in hr_df.columns[1:]:
        print(f"\nAnalyzing hashrate of {crypto} ...")
        
        # removing NaN values for cryptos that have only recent data
        y = np.array(hr_df[crypto], dtype=np.float64)
        nan = np.isnan(y)
        y[nan] = 0
        
        hr_list = []
        start = 0
        for end in year_lens:
            hr_year = np.sum(y[start:end])
            print(f"hr: {hr_year}")

            eff = 0.02
            hr_year = np.multiply(hr_year, eff*1000)
            hr_year = np.divide(hr_year, 24*1000000)

            hr_list.append(hr_year)
            start = end

        hr_list = pd.Series(hr_list)
        hr_race_df[crypto] = hr_list
            
    print()
    print(hr_race_df.T)

    hr_race_df = hr_race_df.T
    hr_race_df.to_csv("data/dataset/temp.csv")

###############################
#     ENERGY CONSUMPTION
###############################
print("\n################## CONSUMPTION")
# read full consumption data from csv file to compute weighted percentile over all years
full_df = pd.read_csv("data/dataset/country_race.csv", delimiter=",", skiprows=2)
print(full_df)

race_df = pd.DataFrame(columns=["country", "value", "year", "rank"])
country_col = "country"

# compute 90th weighted percentile for each year avilable (since 1980)
print("\n[INFO]: Computing 90th weighted percentile on all data...")
for col in full_df.columns[1:]:
    sorted_df = full_df.sort_values(by=[col], ascending=False, ignore_index=True)
    sorted_np = sorted_df[col].to_numpy()

    to_race = sorted_df[[country_col,col]].rename(columns={
        country_col : "country", 
        col : "value"})
    to_race.insert(2, "rank", np.arange(1,len(sorted_df["country"])+1), True)
    to_race.insert(2, "year", int(col), True)

    race_df = race_df.append(to_race, ignore_index=True, verify_integrity=True)

    print(f"---> year: {col}")
    if VERBOSE:
        print("  to_race cols: ", to_race.columns)
        print("  race_df cols: ", race_df.columns)
        print(f"col <{col}> added")

if SAVE:
    sorted_race = race_df.sort_values(by=["rank"], ascending=True, ignore_index=True)
    sorted_race.to_csv("data/dataset/race_data.csv", columns=["country", "value", "year", "rank"])
print()


###############################
#         HASHRATE
###############################
#consumptionFromHashrate()




