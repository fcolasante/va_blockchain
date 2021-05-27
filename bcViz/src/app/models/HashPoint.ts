export interface HashPoint {
  date: Date;
  hashRate: number;
}

export interface CryptoHash {
  id: string;
  values: HashPoint[];
}

