const express = require("express")
const router = express.Router();
const { requiresAuth } = require("express-openid-connect");
const path = require("path");

const redirectIndex = (req, res, next) => {
    if (!req.session.status) {
        return res.redirect('/');
    }
    next();
};

router.get("/", (req, res) => {
    const isAuthenticated = req.oidc.isAuthenticated();
    const user = req.oidc.user;
    res.sendFile("index.html")
})

router.get("/preuzmiJson", (req, res) => {
    res.download("./data/studenci.json")
})

router.get("/preuzmiCsv", (req, res) => {
    res.download("./data/studenci.csv")
})

router.get("/status.js", (req, res) => {
    isAuthenticated = false
    if (req.session.status == true) {
        isAuthenticated = true
    }

    res.type("application/javascript");
    res.send(`
        const isAuthenticated = ${isAuthenticated};
    `);
});

router.get('/logiraj', (req, res) => {
    console.log("Tu sam u login endpointu")
    if (!req.oidc.isAuthenticated()) {
        console.log("Nismo bili logirani. Sad se logiramo.")
        req.session.status = true;
        res.oidc.login();
    } else {
        req.session.status = true;
        console.log("Već smo logirani. Nema potrebe ponovo.")
        res.redirect('/');
    }
    
    
});

router.get('/logoutaj', (req, res) => {
    console.log("Tu smo u logoutu")
    req.session.status = false
    res.redirect('/');
});

router.get('/oidcLogout', (req, res) => {
    req.session.status = false
    res.oidc.logout()
})

router.get("/korisnickiProfil", redirectIndex, (req, res) => {
    res.render("profil", {
        name: req.oidc.user.name,
        sub: req.oidc.user.sub,
        email: req.oidc.user.email,
        email_verified: req.oidc.user.email_verified
    })
})

router.get("/osvjeziPreslike", redirectIndex, (req, res) => {
    
})

module.exports = router
