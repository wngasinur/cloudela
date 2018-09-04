import * as express from 'express';
import * as compression from 'compression';  // compresses requests
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
const flash = require('express-flash');
import * as path from 'path';
import * as passport from 'passport';
import * as expressValidator from 'express-validator';
import { MONGODB_URI, SESSION_SECRET, FRONTEND_DOMAIN } from './util/secrets';
import './db';
const cors = require('cors');
import googleAuth from './auth/google';
import * as cookieParser from 'cookie-parser';
import * as jwt from 'jsonwebtoken';
import * as connectMongo from 'connect-mongo';
// Load environment variables from .env file, where API keys and passwords are configured
dotenv.config({ path: '.env' });

// Controllers (route handlers)
import * as homeController from './controllers/home';
import * as jobController from './controllers/job';

// Create Express server
const app = express();

const MongoStore = connectMongo(session);

const auth = () => passport.authenticate('jwt', { session: false });
googleAuth();
app.use(cors({credentials: true, origin: FRONTEND_DOMAIN }));
// Express configuration
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(cookieParser());
app.use(session({
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({url: MONGODB_URI}),
  secret: SESSION_SECRET
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});
app.use((req, res, next) => {
  // After successful login, redirect back to the intended page
  if (!req.user &&
    req.path !== '/login' &&
    req.path !== '/signup' &&
    !req.path.match(/^\/auth/) &&
    !req.path.match(/\./)) {
    req.session.returnTo = req.path;
  } else if (req.user &&
    req.path === '/account') {
    req.session.returnTo = req.path;
  }
  next();
});

app.use('/',
  express.static(path.join(__dirname, '../public'), { maxAge: 31557600000 })
);

/**
 * Primary app routes.
 */
// app.get('/', cors(), homeController.index);

app.get('/api/region', auth(), homeController.region);

app.get('/api/dropdowns', auth(), homeController.dropdowns);

app.get('/api/summary', auth(),  homeController.summary);
app.get('/api/summary_area', auth(), homeController.summary_area);
app.get('/api/condo-info', auth(), homeController.condo_info);
app.get('/api/condo-list', auth(), homeController.condo_list);


app.get('/api/job/sync-condo-master', auth(), jobController.condoMaster);
app.get('/api/job/map-polygon', auth(), jobController.mapPolygon);
app.get('/api/job/sales-history', auth(), jobController.salesHistory);
app.get('/api/job/agg-sales-history', auth(), jobController.aggSalesHistory);
/**
 * OAuth authentication routes. (Sign in)
 */

// app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
// app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
//   res.redirect(req.session.returnTo || '/');
// });
app.get('/auth/google', passport.authenticate('google', {
  scope: ['https://www.googleapis.com/auth/userinfo.profile',
  'https://www.googleapis.com/auth/userinfo.email'],
  session: false
}));
app.get('/auth/google/callback',
  passport.authenticate('google', {
      failureRedirect: '/'
  }),
  (req, res) => {
    req.session.token = req.user.token;
    const jwtToken = jwt.sign(req.user, 'secret');
    res.cookie('jwt', jwtToken);
    res.redirect(FRONTEND_DOMAIN);
  }
);

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

export default app;
