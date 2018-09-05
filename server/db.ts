import mongoose = require('mongoose');
import * as bluebird from 'bluebird';
import { MONGODB_URI } from './util/secrets';

// Connect to MongoDB
const mongoUrl = MONGODB_URI;
(<any>mongoose).Promise = bluebird;

const opts = {
    keepAlive: 120,
    socketTimeoutMS: 90000 * 20,
    poolSize: 100,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 500,
    autoReconnect: true,
    useNewUrlParser: true
  };

mongoose.connect(mongoUrl, opts).then(
  () => { /** ready to use. The `mongoose.connect()` promise resolves to undefined. */ },
).catch(err => {
  console.log('MongoDB connection error. Please make sure MongoDB is running. ' + err);
  // process.exit();
});
