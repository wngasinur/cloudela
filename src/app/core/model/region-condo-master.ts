import { Region } from './region';
import { CondoMaster } from './condo-master';

export interface RegionCondoMaster {
    region:       Region;
    condoMasters: CondoMaster[];
}
