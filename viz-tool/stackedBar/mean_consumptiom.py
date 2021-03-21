import pandas as pd

cols = ["group","date","value"]
df = pd.read_csv("./viz-tool/stacked_bar/stacked_bar_test.csv", delimiter=',', parse_dates=True, usecols=cols)


df["date"] = df["date"].apply(lambda row: row[-4:] + "/" + (row[row.find("/")+1:row.find("/")+3].strip("/") 
                                        if len(row[row.find("/")+1:row.find("/")+3].strip("/")) == 2 
                                        else "0" + row[row.find("/")+1:row.find("/")+3].strip("/")))
print(df)

gut_df = df.groupby(["group","date"]).mean()
print(gut_df)

gut_df.to_csv("./viz-tool/stacked_bar/stacked_bar_months.csv")