var express = require('express');
var app = express();
var log = require('./libs/log')(module)
var HeroModel = require('./libs/mongoose').HeroModel;
var config = require('./libs/config');
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/api', function(req, res) {
    res.send('API is running');
});

app.get('/ErrorExample', function(req, res, next) {
    next(new Error('Random error!'));
});

app.get('/api/heroes', function(req, res) {
    return HeroModel.find(function(err, heroes) {
        if(!err) {
            return res.send(heroes);
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s', res.statusCode, err.message);
            return res.send({error: 'Server error'});
        }
    });
});

app.post('/api/heroes', function(req, res) {
    var heroe = new HeroModel({
        name: req.body.name
    });
    heroe.save(function(err) {
        if(!err) {
            log.info('heroe created');
            return res.send({
                status: 'OK',
                heroe: heroe
            });
        } else {
            if(err.name == 'ValidationError') {
                res.statusCode = 400;
                res.send({error: 'Validation error'});
            } else {
                res.statusCode = 500;
                res.send({error: 'Server error'});
            }
            log.error('Internal error(%d): %s', res.statusCode, err.message);
        }
    });
});

app.get('/api/heroes/:id', function(req, res) {
    return HeroModel.findById(req.params.id, function (err, heroe) {
        if(!heroe) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        if (!err) {
            // TEST TEST TEST REMOVE AFTER
            log.info('Fetched hero');
            return res.send({ status: 'OK', heroe:heroe });
        } else {
            res.statusCode = 500;
            log.error('Internal error(%d): %s',res.statusCode,err.message);
            return res.send({ error: 'Server error' });
        }
    }); 
});

app.put('/api/heroes/:id', function(req, res) {
    return HeroModel.findById(req.params.id, function (err, heroe) {
        if(!heroe) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        heroe.name = req.body.name;
        return heroe.save(function (err) {
            if (!err) {
                log.info("heroe updated");
                return res.send({ status: 'OK', heroe:heroe });
            } else { 
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                log.error('Internal error(%d): %s',
                res.statusCode,err.message);
            }
        });
    });
});

app.delete('/api/heroes/:id', function(req, res) {
    return HeroModel.findById(req.params.id, function (err, heroe) {
        if(!heroe) {
            res.statusCode = 404;
            return res.send({ error: 'Not found' });
        }
        return heroe.remove(function (err) {
            if (!err) {
                log.info("heroe removed");
                return res.send({ status: 'OK' });
            } else {
                res.statusCode = 500;
                log.error('Internal error(%d): %s',
                res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    }); 
        
});

app.use(function(req, res, next) {
    res.status(404);
    log.debug('Not found URL: ' + req.url);
    res.send({error: 'Not found'});
    return next();
})

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    log.error('Internal error(' + res.statusCode + '): ' + err.message);
    res.send({error: err.message});
    return next();
})

app.listen(config.get('port'), function() {
    console.log('Express server listening on port ' + config.get('port'));
});