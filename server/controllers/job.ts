import { Request, Response } from 'express';
import { asyncMiddleware } from '../util/asyncMiddleware';

import { logger } from '../util/log';
import { syncCondoMaster } from '../jobs/condo_master';
import { syncMapPolygons } from '../jobs/map_polygons';
import { syncCondoMasterLoc } from '../jobs/condo_master_loc';
import { syncSalesHistory } from '../jobs/sales_history';
import { syncAggSalesHistory } from '../jobs/agg_sales_history';


export let condoMaster = asyncMiddleware(async (req: Request, res: Response) => {

  await syncCondoMaster();
  await syncCondoMasterLoc();

  res.json('ok');

});

export let mapPolygon = asyncMiddleware(async (req: Request, res: Response) => {
    await syncMapPolygons();
    res.json('ok');
});


export let salesHistory = asyncMiddleware(async (req: Request, res: Response) => {
    await syncSalesHistory();
    res.json('ok');
});

export let aggSalesHistory = asyncMiddleware(async (req: Request, res: Response) => {
    await syncAggSalesHistory();
    res.json('ok');
});
