import * as passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import * as express from 'express';
import { Strategy} from 'passport-jwt';
import { User } from '../schema';
import { GOOGLE_OAUTH_CLIENTID, GOOGLE_OAUTH_CLIENTSECRET, API_DOMAIN } from '../util/secrets';


export default function () {

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
    // Use google strategy
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_OAUTH_CLIENTID,
        clientSecret: GOOGLE_OAUTH_CLIENTSECRET,
        callbackURL: API_DOMAIN + '/auth/google/callback',
        passReqToCallback: true
    },
        async function (req: express.Request, accessToken, refreshToken, profile, done) {
            // Set the provider data and include tokens
            const providerData = profile._json;
            providerData.accessToken = accessToken;
            providerData.refreshToken = refreshToken;


            // Create the user OAuth profile
            const providerUserProfile = {
                name: profile.displayName,
                email: profile.emails[0].value,
                provider: 'google',
                providerData: providerData
            };

            const user = await User.findOneAndUpdate({email: providerUserProfile.email}, providerUserProfile, {upsert: true, new: true}).exec();
            // Save the user OAuth profile

            return done(null, {
                profile: user.toObject(),
                token: accessToken
            });
        }
    ));

    passport.use(new Strategy({
        secretOrKey: 'secret',
        jwtFromRequest: (req) => {
            let token = null;
            if (req && req.cookies) {
                token = req.cookies['jwt'];
            }
            return token;
        }
    }, (jwtToken, cb) => {

        return User.findOne({email: jwtToken.profile.email})
            .then(user => {
                return cb(null, user);
            })
            .catch(err => {
                return cb(err);
            });
    }));

}
