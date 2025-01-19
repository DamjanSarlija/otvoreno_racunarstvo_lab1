const express = require("express");
const session = require("express-session")
const ir = require("./routes/index.routes");
const dr = require("./routes/datatable.routes");
const ar = require("./routes/api.routes");
const path = require("path")
const { auth } = require("express-openid-connect");


const app = express();

const port = 3000;

const authConfig = {
    authRequired: false,
    auth0Logout: true,
    secret: "anything",
    baseURL: "http://localhost:3000",
    clientID: "Jx7y3oPNmCMRgdvONJj9BEG8BIJzni6h",
    issuerBaseURL: "https://dev-58jxy06foitq3exp.us.auth0.com",
};

app.use(auth(authConfig));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json())



app.use(
    session({
        secret: "anything",
        resave: false,
        saveUninitialized: true,
    })
);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Doslo je do greske');
});

app.use("/", ir);
app.use("/datatable", dr)
app.use("/api", ar)


app.use((req, res, next) => {
    res.status(404).json({
        status: "Not Found",
        message: "Traženi endpoint ne postoji ili se koristi neispravna HTTP metoda"
    });
  });

app.listen(port);
