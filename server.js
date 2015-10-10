var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
require('./sockets/base')(io);
//var router = express.Router();
var surveys = require('./surveys/base');
var body_parser = require('body-parser')

app.set('view engine', 'ejs');

//app.use('*', express.static(__dirname + '/public/404.html'));
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/:id([0-9]+)?', function(req, res) {
    res.render('pages/survey_show', {
        survey_id: req.id
    });
});

app.get('/survey', function(req, res) {
    res.render('pages/survey');
});

app.get('/survey/:id([0-9]+)?', function(req, res) {
    res.render('pages/survey');
});

app.get('/admin', function(req, res) {
    res.render('pages/admin');
});
app.use('/static', express.static(__dirname + '/static'));
app.use(body_parser.urlencoded({'extended':'true'}));
app.use(body_parser.json());
//app.use(router);

//router.all('/api/*', requireAuthentication);
//router.get('/api/v1/surveys/:id', surveys.get_questions);
//router.get('/api/v1/surveys', surveys.get_surveys);
//router.post('/api/v1/surveys', surveys.add_poll);
//router.delete('/api/v1/surveys/:id', surveys.del_poll);

var port = 3000;

http.listen(port, function() {
    console.log('listen on *:' + port);
});
