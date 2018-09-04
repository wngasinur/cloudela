
import * as Agenda from 'agenda';
import { syncCondoMaster } from './jobs/condo_master';

import { logger } from './util/log';
import { aggSalesHistory } from './jobs/agg_sales_history';
import fs = require('fs');
import { MONGODB_URI } from './util/secrets';
import { syncCondoMasterLoc } from './jobs/condo_master_loc';
import { syncSalesHistory } from './jobs/sales_history';
import { syncMapPolygons } from './jobs/map_polygons';

const agenda = new Agenda({db: {address: MONGODB_URI, collection: 'agendaJobs'}, processEvery: '30 seconds'});

agenda.define('Sales History', async (job, done) => {
  await syncSalesHistory();
  await aggSalesHistory();
});
agenda.define('Condo Master', async (job, done) => {
  await syncMapPolygons();
  await syncCondoMaster();
  await syncCondoMasterLoc();
});


agenda.on('start', job => {
  logger.info('Job %s starting', job.attrs.name);
});

(async function() { // IIFE to give access to async/await

  await agenda.start();

  await agenda.every('40 12 * * *', 'Condo Master');

  await agenda.every('40 13 * * *', 'Sales History');

  // await agenda.now('job1');

  // Alternatively, you could also do:
  // await agenda.every('*/3 * * * *', 'delete old users');
})();
