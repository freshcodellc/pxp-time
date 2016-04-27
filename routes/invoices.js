var express = require('express');
var router = express.Router();
var axios = require('axios')
var api = require('../api')

router.get('/', function(req, res) {
  axios.all([api.getInvoices(), api.getUser()])
    .then(axios.spread(function (r1, r2) {
      res.render('invoices', {
        invoices: r1.data.invoices,
        user: r2.data.user.private_profile,
        message: req.flash('info'),
        error: req.flash('error')
      })
    }))
    .catch(function(response) {
      console.log(response.data.error);
      res.render('index')
    })
})

router.post('/', function(req, res) {
  var post_data = req.body
  var params = {}

  params.start = post_data.start;
  params.end = post_data.end;
  params.filter = post_data.filter;

  api.getInvoices(params)
    .then(function(response) {
      res.render('invoices', {
        invoices: response.data.invoices
      })
    })
    .catch(function(response) {
      res.render('invoices', {
        entries: []
      })
    })
})

module.exports = router;
