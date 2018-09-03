
import * as Agenda from 'agenda';
import { syncCondoMaster } from './jobs/condo_master';

import { logger } from './util/log';
import { aggSalesHistory } from './jobs/agg_sales_history';
const fs = require('fs');

const agenda = new Agenda({db: {address: 'localhost:27017/agenda-test', collection: 'agendaJobs'}, processEvery: '30 seconds'});


agenda.define('job1', async (job, done) => {
  logger.info('starting job1');
  await aggSalesHistory();
  logger.info('end job1');
});


agenda.define('job2', async (job, done) => {
  logger.info('starting job2');
  await syncCondoMaster();
  logger.info('end job2');
});

agenda.on('start', job => {
  logger.info('Job %s starting', job.attrs.name);
});

(async function() { // IIFE to give access to async/await

  await agenda.start();

  await agenda.purge();
  
  await agenda.every('2 minute', 'job2');

  // await agenda.now('job1');

  // Alternatively, you could also do:
  // await agenda.every('*/3 * * * *', 'delete old users');
})();