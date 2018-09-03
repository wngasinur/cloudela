import { Region } from './region';
import { CondoMaster } from './condo-master';
import { SalesHistoryAgg } from './sales-histories-agg';
import { Summary } from './summary';

export interface CondoMasterSales {
    condoMaster: CondoMaster;
    psfSummary: Summary;
    salesHistories?: SalesHistoryAgg[];
}
