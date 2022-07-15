import { Router } from "express";
import passport from "passport";
import conf from "@d3lab/config";

const router = Router();

router.get("/check", (req, res) => {
    if (req.isAuthenticated()) {
        res.json({
            info: req.user,
            isLogin: true
        })
    } else {
        res.json({isLogin: false})
    }
})

router.get("/login", (req, res, next) => {
    res.status(302).send({url: conf.front.login})
});

router.get("/login/federated/google", passport.authenticate("google"));

router.get(
    "/oauth2/redirect/google",
    passport.authenticate("google", {
        successReturnToOrRedirect: conf.front.main,
        failureRedirect: conf.front.login,
    })
);

router.get("/login/federated/github", passport.authenticate("github"));

router.get(
    "/oauth2/redirect/github",
    passport.authenticate("github", {
        successReturnToOrRedirect: conf.front.main,
        failureRedirect: conf.front.login,
    })
);


router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        if (!conf.front.main) {
            console.error("You need to set frontend main address");
        } else {
            req.session.destroy((err) => {})
            res.redirect(conf.front.main);
        }
    });
});

export default router;
