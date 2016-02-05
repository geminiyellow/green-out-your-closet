var Item = require('../models/item');
var stream = Item.synchronize();
var count = 0;
// var jwt = require('jsonwebtoken');
// var config = require('../../config');

// var superSecret = config.secret;


module.exports = function(app, express) {

    stream.on('data', function(err, doc) {
        count++;
    });
    stream.on('close', function() {
        console.log('indexed ' + count + ' documents!');
    });
    stream.on('error', function(err) {
        console.log(err);
    });


    var apiRouter = express.Router();

    // accessed at GET http://localhost:8080/search
    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'nice! lets search our closet'
        });
    });

    apiRouter.route('/all')

    .get(function(req, res) {
        Item.find(function(err, items) {
            if (err) res.send(err);

            // return the users
            res.json(items);
        });
    });

    apiRouter.route('/singleItem')


    .post(function(req, res) {

        console.log("hi there");
        console.log(req.body)

        var gender = req.body.gender;
        var type = req.body.type;
        var color = req.body.color;
        var description1 = req.body.description
        var description2 = req.body.description2

        if (description2 == null) description2 = "";
        if (description1 == null) description1 = "";
 
        console.log(description1);

        Item.search({
        	
                "bool": {
                    "must": [{
                        "term": {
                            "gender": gender
                        }},
                        {
                        "term": {
                            "type": type
                        }} 
                    ],

                    "should": [
                        {
                        "term": {
                            "color": color
                        }},
                        {
                        "term": {
                            "description": description1
                        }},
                        {
                        "term": {
                            "description": description2
                        }}
                    ],
                }

            },

            function(err, items) {
                console.log(items.hits.hits);
               
                res.json(items.hits.hits);
            });



    });

    return apiRouter;
};