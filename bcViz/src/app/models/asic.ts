export interface Asic {
  model: string;
  profitability: number;
  release: Date;
  hashRate: number;
  power: number;
  algo: string;
  efficiency: number;
  pca_X?: number;
  pca_Y?: number;
  enabled: boolean;
  selParallel?: boolean;
}
