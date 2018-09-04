import {logger} from './log';

import * as dotenv from 'dotenv';
import * as fs from 'fs';

if (fs.existsSync('.env')) {
    logger.info('Using .env file to supply config environment variables');
    dotenv.config({ path: '.env' });
} else {
    logger.warn('Using .env.example file to supply config environment variables');
    dotenv.config({ path: '.env.example' });  // you can delete this after you create your own .env file!
}
export const ENVIRONMENT = process.env.NODE_ENV;
const prod = ENVIRONMENT === 'production'; // Anything else is treated as 'dev'

export const SESSION_SECRET = process.env['SESSION_SECRET'];
export const MONGODB_URI = process.env['MONGODB_URI'];
export const FRONTEND_DOMAIN = process.env['FRONTEND_DOMAIN'];
export const API_DOMAIN = process.env['API_DOMAIN'];
export const GOOGLE_OAUTH_CLIENTID = process.env['GOOGLE_OAUTH_CLIENTID'];
export const GOOGLE_OAUTH_CLIENTSECRET = process.env['GOOGLE_OAUTH_CLIENTSECRET'];


logger.info('xxx' + SESSION_SECRET);
if (!SESSION_SECRET) {
    logger.error('No client secret. Set SESSION_SECRET environment variable.');
    process.exit(1);
}

if (!MONGODB_URI) {
    logger.error('No mongo connection string. Set MONGODB_URI environment variable.');
    process.exit(1);
}
