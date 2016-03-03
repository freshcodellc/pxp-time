var express = require('express');
var router = express.Router();
var axios = require('axios')
var api = require('../api')

router.get('/', function(req, res) {
  axios.all([api.getBoards(), api.getUser()])
    .then(axios.spread(function (r1, r2) {
      res.render('index', {
        boards: r1.data.boards,
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

module.exports = router;
