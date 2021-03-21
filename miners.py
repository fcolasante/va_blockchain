from bs4 import BeautifulSoup
import requests
import pandas as pd
import csv

def dumpASIC(algo, out_file):
    url = "https://www.asicminervalue.com/efficiency/{}".format(algo)
    new_file = out_file #'efficiency_sha.txt'
    content = requests.get(url).content
    soup = BeautifulSoup(content,'html.parser')
    table = soup.find("table", {"id": "datatable_profitability"})
    for i,tr in enumerate(table.findAll('tr')):
        row = []
        for td in tr.findAll('td'):
            row.append(td.text)
        if i == 0: # write header
            with open(new_file, 'w') as f:
                writer = csv.DictWriter(f, fieldnames=["model","release","hashRate","power",
                                                        "algo","profitability","efficiency"])
                writer.writeheader() # header
        else:
            with open(new_file, 'a') as f:
                writer = csv.writer(f, delimiter=",")
                writer.writerow(row)

def dumpAll():
    dumpASIC("sha-256", "data/asic/efficiency_sha256.csv")
    dumpASIC("ethash",  "data/asic/efficiency_ethash.csv")
    dumpASIC("scrypt",  "data/asic/efficiency_scrypt.csv")
    dumpASIC("equihash","data/asic/efficiency_equihash.csv")
    dumpASIC("x11","data/asic/efficiency_x11.csv")
    dumpASIC("eaglesong","data/asic/efficiency_eaglesong.csv")
    dumpASIC("cryptonight","data/asic/efficiency_cryptonight.csv")

    print("ASCI data dumped...")
    return

def dumpCAP():
    url = "https://coinmarketcap.com/currencies/xrp/historical-data/?start=20130428&end=20180802"
    new_file = 'cap.txt'
    content = requests.get(url).content
    soup = BeautifulSoup(content,'html.parser')
    print(soup.prettify())
    table = soup.find("table")
    print(table)
    for i,tr in enumerate(table.findAll('tr')):
        row = []
        for td in tr.findAll('td'):
            row.append(td.text)
        if i == 0: # write header
            with open(new_file, 'w') as f:
                writer = csv.DictWriter(f, row)
                writer.writeheader() # header
        else:
            with open(new_file, 'a') as f:
                writer = csv.writer(f, delimiter=",")
                writer.writerow(row)

def efficiencyEstimates(crypto="BTC"):
    print("\nRetrieveing {} hardware efficiency data...".format(crypto))
    if crypto == "XMR":
        c_cols = ["cpu","hashRate","TDP","OS","date"]
        g_cols = ["gpu","hashRate","TDP","OS","date"]
        df_cpu = pd.read_csv("data/asic/efficiency_randomx_cpu.csv", delimiter=',', parse_dates=True, usecols=c_cols)
        df_gpu = pd.read_csv("data/asic/efficiency_randomx_gpu.csv", delimiter=',', parse_dates=True, usecols=g_cols)    

        # remove measure units 
        df_cpu["TDP"] = df_cpu["TDP"].apply(lambda row: int(str(row)[:-2]) if str(row) != "nan" else 0)
        df_gpu["TDP"] = df_gpu["TDP"].apply(lambda row: int(str(row)[:-2]) if str(row) != "nan" else 0)

        # compute hw efficiency (j/H)
        eff_cpu = df_cpu[["hashRate","TDP"]].apply(lambda row: row.TDP/row.hashRate, axis=1)
        eff_gpu = df_gpu[["hashRate","TDP"]].apply(lambda row: row.TDP/row.hashRate, axis=1)

        df_eff = eff_cpu.append(eff_gpu, ignore_index=True)
        print("mean:",round(df_eff.mean(),2),"j/h")
        print("std :",round(df_eff.std(), 2))
        print("max :",round(df_eff.max(), 2),"j/h")
        print("min :",round(df_eff.min(), 2),"j/h")
        
        return df_eff
        
    else:  # BTC, ETH or LTC
        if crypto == "BTC":
            unit = "j/Gh"
            df = pd.read_csv("data/asic/efficiency_sha256.csv", delimiter=',', parse_dates=True)
        elif crypto == "ETH":
            unit = "j/Mh"
            df = pd.read_csv("data/asic/efficiency_ethash.csv", delimiter=',', parse_dates=True)
        elif crypto == "LTC":
            unit = "j/Mh"
            df = pd.read_csv("data/asic/efficiency_scrypt.csv", delimiter=',', parse_dates=True)

        # get efficiency data
        df["efficiency"] = df["efficiency"].apply(lambda row: float(str(row)[:-4]) if str(row) != "nan" else 0)
        print("mean:",round(df["efficiency"].mean(),2),unit)
        print("std :",round(df["efficiency"].std(), 2))
        print("max :",round(df["efficiency"].max(), 2),unit)
        print("min :",round(df["efficiency"].min(), 2),unit)

        return df["efficiency"]


if __name__ == "__main__":
    dumpAll()
    #dumpCAP()
    
    efficiencyEstimates(crypto="BTC")
    efficiencyEstimates(crypto="ETH")
    efficiencyEstimates(crypto="LTC")
    efficiencyEstimates(crypto="XMR")
    print("\nDONE.")