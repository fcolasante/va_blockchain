1. Prelievo dati da `blockchair.com`: numero di blocchi generati e la loro difficoltà associata.
2. Prelievo dati sulle mining farm, sulla loro posizione e il loro tasso di emissione rispetto GWh prodotti.
3. Download database mining hardware: che gpu esistono e qual è la loro capacità di calcolo
4. Stima dei CO2 prodotti andando a calcolare la loro difficoltà in termini di HashProdotti e successivamente
il #hash prodotti sarà mappato ad un consumo elettrico e in base alla mining farm sarà stimato la C02 prodotte.
Poichè non abbiamo info inrenti le GPU utilizzata fa un'approssimazione provando con diverse configurazioni di GPU.

Userà questi dati per stimare la C02 prodotta nell'anno 2017 e poi farà una proiezione sui 
blocchi generati e la relativà difficoltà, andando a stimare le future emissioni.
