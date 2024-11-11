const express = require("express");
const session = require("express-session")
const ir = require("./routes/index.routes");
const dr = require("./routes/datatable.routes");
const path = require("path")

const app = express();

const port = 3000;


app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));

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


app.listen(port);