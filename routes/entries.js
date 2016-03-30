var express = require('express');
var router = express.Router();
var axios = require('axios')
var api = require('../api')

router.get('/', function(req, res) {
  api.getEntries()
    .then(function(response) {
      res.render('entries', {
        entries: response.data.entries
      })
    })
    .catch(function(response) {
      // TODO: Remove once API isn't broken
      if (response.data.error === "Couldn't find any entries. Be sure to properly authenticate and supply a valid start date and end date to your request.") {
        res.render('entries', {
          entries: []
        })
      } else {
        console.log(response);
      }
    })
})

router.post('/', function(req, res) {
  var post_data = req.body
  var params = {}

  params.start = post_data.start;
  params.end = post_data.end;
  params.filter = post_data.filter;

  api.getEntries(params)
    .then(function(response) {
      res.render('entries', {
        entries: response.data.entries
      })
    })
    .catch(function(response) {
      res.render('entries', {
        entries: []
      })
    })
})

module.exports = router;
