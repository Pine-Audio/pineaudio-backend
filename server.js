require('dotenv').config()
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const debug = process.env.NODE_ENV !== 'production'
console.log(process.env.DATABASE_URL)

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true });

if(!debug) {
    const compression = require('compression');
    const helmet = require('helmet')
    app.use(helmet())
    app.use(compression());
    app.enable('view cache');
}

app.use(express.static("public"));

app.use('/v1/', require('./api/v1/api.js'));
app.use('/auth/', require('./routes/auth.js'));

app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = debug ? err : {};
    res.locals.meta.title = err.status;
    res.status(err.status || 500);
    res.render('error');
});

const listener = app.listen(process.env.PORT, () => {
    console.log("Your app is listening on port " + listener.address().port);
});
  