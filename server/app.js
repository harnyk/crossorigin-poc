const url = require('url');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

const env = process.env.NODE_ENV || 'development';
app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env == 'development';

// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// app.use(favicon(__dirname + '/public/img/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true
    })
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

///OUR CODE

const whitelabelDomains = {
    'garkin.im': true,
    localhost: true
};

const allowedRequestHeaders = ['X-BZ-Custom-Header'];

const getDomainFromOrigin = origin => {
    const parts = url.parse(origin);
    return parts.hostname;
};

const isOriginAllowed = origin => {
    const domain = getDomainFromOrigin(origin);
    return whitelabelDomains[domain] === true;
};

const isNotCORS = origin => {
    return origin === undefined;
};

const accessControlMiddleware = (req, res, next) => {
    const origin = req.get('origin');

    //1. Regular request
    if (isNotCORS(origin)) {
        next();
        return;
    }

    //2. Cross-origin request from whitelabel domain
    if (isOriginAllowed(origin)) {
        res.set('access-control-allow-origin', origin);
        res.set(
            'access-control-allow-headers',
            allowedRequestHeaders.join(',')
        );
        next();
        return;
    }

    //3. Cross-origin request from unknown domain
    res.status(401).send();
};

const emptyResponse = (req, res) => {
    res.status(200).send();
};

// OPTIONS /
app.options('/', accessControlMiddleware, emptyResponse);

// GET /
app.get('/', accessControlMiddleware, (req, res) => {
    res.status(200).json({ hello: 'world' });
});

// OPTIONS /postable
app.options('/postable', accessControlMiddleware, emptyResponse);

// POST /postable
app.post('/postable', accessControlMiddleware, (req, res) => {
    res.status(200).json({ hello: 'world' });
});

///END OF OUR CODE

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

module.exports = app;
