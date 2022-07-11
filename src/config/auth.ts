import passport from "passport";
import GoogleStrategy from "passport-google-oidc";
import {Strategy as GithubStrategy} from "passport-github";
import { pg } from "@d3lab/db";
import { PassportProfile } from "@d3lab/types";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env["GOOGLE_CLIENT_ID"],
            clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
            callbackURL: "/auth/oauth2/redirect/google",
            scope: ["profile"],
        },
        async function verify(
            issuer: string,
            profile: PassportProfile,
            cb: any
        ) {
            let pgdb;
            try {
                pgdb = await pg.getClient();
                let res = await pgdb.query(
                    "SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2",
                    [profile.provider, profile.id]
                );
                if (res.rows.length === 0) {
                    await pgdb.query(
                        "INSERT INTO users (provider, subject, disp_name, lesson, chapter) VALUES($1, $2, $3, $4, $5)",
                        [profile.provider, profile.id, profile.displayName, 0, 1]
                    );
                    await pgdb.query(
                        "INSERT INTO federated_credentials (provider, subject, created_at) VALUES($1, $2, $3)",
                        [profile.provider, profile.id, new Date().toISOString()]
                    );

                    return cb(null, { id: profile.id, issuer: profile.provider });
                } else {
                    return cb(null, { id: profile.id, issuer: profile.provider });
                }
            } catch (error) {
                cb(error);
            } finally {
                pgdb?.release();
            }
        }
    )
);

passport.use(
    new GithubStrategy(
        {
            clientID: process.env["GITHUB_CLIENT_ID"]!,
            clientSecret: process.env["GITHUB_CLIENT_SECRET"]!,
            callbackURL: "/auth/oauth2/redirect/github"
        },
        async function verify(
            accessToken: string,
            refreshToken: string,
            profile: PassportProfile,
            cb: any
        ) {
            let pgdb;
            try {
                pgdb = await pg.getClient();
                let res = await pgdb.query(
                    "SELECT * FROM federated_credentials WHERE provider = $1 AND subject = $2",
                    [profile.provider, profile.id]
                );
                if (res.rows.length === 0) {
                    await pgdb.query(
                        "INSERT INTO users (provider, subject, disp_name, lesson, chapter) VALUES($1, $2, $3, $4, $5)",
                        [profile.provider, profile.id, profile.displayName, 0, 1]
                    );
                    await pgdb.query(
                        "INSERT INTO federated_credentials (provider, subject, created_at) VALUES($1, $2, $3)",
                        [profile.provider, profile.id, new Date().toISOString()]
                    );

                    return cb(null, { id: profile.id, issuer: profile.provider });
                } else {
                    return cb(null, { id: profile.id, issuer: profile.provider });
                }
            } catch (error) {
                cb(error);
            } finally {
                pgdb?.release();
            }
        }
    )
);


passport.serializeUser((user: Express.User, cb) => {
    process.nextTick(() => {
        cb(null, { id: user.id, issuer: user.issuer });
    });
});

passport.deserializeUser((user: Express.User, cb) => {
    process.nextTick(() => {
        return cb(null, user);
    });
});
