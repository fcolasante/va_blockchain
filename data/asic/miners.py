from bs4 import BeautifulSoup
import requests
import pandas as pd
import csv

def dumpASIC():
    url = "https://www.asicminervalue.com/efficiency/sha-256"
    new_file = 'efficiency_sha.txt'
    content = requests.get(url).content
    soup = BeautifulSoup(content,'html.parser')
    table = soup.find("table", {"id": "datatable_profitability"})
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

dumpCAP()