var express = require('express');
var router = express.Router();
var axios = require('axios');
var api = require('../api');
var moment = require('moment');
var _ = require('lodash');

router.get('/:apikey', function(req, res) {
  var params = {}

  params.start = moment().format('MM/DD/YYYY');
  params.end = moment().add(2, 'days').format('MM/DD/YYYY');

  axios.all([api.getBoard(req.params.apikey), api.getEntries(params)])
    .then(axios.spread(function (r1, r2) {
      var board = r1.data;
      var cards = _.filter(r1.data.cards, function(o) { return o.list.public.name !== 'Completed' });
      var entries = r2.data.entries;
      var hours = 0;
      var minutes = 0;

      entries.forEach(function(entry) {
        hours = hours + entry.entry.hours;
        minutes = minutes + entry.entry.minutes;
      })

      var hoursMs = hours*60*60;
      var minutesMs = minutes*60;

      var newTotal = (hoursMs + minutesMs)*1000;
      var total = moment.utc(newTotal).format("HH:mm");

      res.render('time', {
        board: board,
        cards: cards,
        entries: entries,
        total: total,
        message: req.flash('info'),
        error: req.flash('error')
      })
    }))
    .catch(function(response) {
      // TODO: Remove once API isn't broken
      if (response.data.error === "Couldn't find any entries. Be sure to properly authenticate and supply a valid start date and end date to your request.") {
        api.getBoard(req.params.apikey)
          .then(function(response) {
            var board = response.data
            res.render('time', {
              board: board,
              message: req.flash('info'),
              error: req.flash('error')
            })
          })
          .catch(function(resposne) {
            console.log(response);
            req.flash('error', 'An Error Happened!')
            res.render('time')
          })
      } else {
        console.log(response);
        req.flash('error', 'An Error Happened!')
        res.render('time')
      }
    })
})

router.post('/', function(req, res) {
  var post_data = req.body
  post_data.hours = parseInt(post_data.timer.split(':')[0])
  post_data.minutes = parseInt(post_data.timer.split(':')[1])

  api.postEntry(post_data)
    .then(function(response) {
      req.flash('info', 'Time Entry Saved Successfully!')
      res.redirect(req.get('referer'));
    })
    .catch(function(response) {
      console.log(response)
      req.flash('error', 'An Error Happened!')
      res.redirect(req.get('referer'));
    })
})

module.exports = router;
