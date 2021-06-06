import numpy as np
import pandas as pd

VERBOSE = False

print("\n################## PREDICTIONS")
# read full consumption data from csv file to compute weighted percentile over all years
full_df = pd.read_csv("data/dataset/country_race.csv", delimiter=",", skiprows=2)
print(full_df)

race_df = pd.DataFrame(columns=["country", "value", "rank"])
country_col = "country"

# compute 90th weighted percentile for each year avilable (since 1980)
print("\n[INFO]: Computing 90th weighted percentile on all data...")
for col in full_df.columns[2:]:
    sorted_df = full_df.sort_values(by=[col], ascending=False, ignore_index=True)
    sorted_np = sorted_df[col].to_numpy()

    to_race = sorted_df[[country_col,col]].rename(columns={
        country_col : "country", 
        col : "value"})
    to_race.insert(2, "rank", np.arange(1,len(sorted_df["country"])+1), True)

    race_df = race_df.append(to_race, ignore_index=True, verify_integrity=True)

    print(f"---> year: {col}")
    if VERBOSE:
        print("  to_race cols: ", to_race.columns)
        print("  race_df cols: ", race_df.columns)
        print(f"col <{col}> added")

sorted_race = race_df.sort_values(by=["rank"], ascending=True, ignore_index=True)
sorted_race.to_csv("data/dataset/barRace_data.csv", columns=["country", "value", "rank"])
print()