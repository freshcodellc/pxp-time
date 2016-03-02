var express = require('express')
var session = require('express-session')
var exphbs = require('express-handlebars')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var axios = require('axios')
var moment = require('moment')
var flash = require('connect-flash')
var api = require('./api')

var cfg = require('./config')

var app = express()

var hbs = exphbs.create({
  defaultLayout: 'base',
  helpers: {
    formatTime: function(time) {
      var timeString = '0' + time.toString();
      return timeString.slice(-2)
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(session({
  cookieName: 'session',
  secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
  resave: false,
  saveUninitialized: true
}));

app.use(cookieParser())
app.use(flash())

app.use(bodyParser.urlencoded({ extended: false }))

app.use('/static', express.static(__dirname + '/public'));

app.get('/', function(req, res) {
  // console.log(req.flash('info'))
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

app.get('/time/:apikey', function(req, res) {
  var params = {}

  params.start = moment().format('MM/DD/YYYY');
  params.end = moment().add(1, 'days').format('MM/DD/YYYY');

  axios.all([api.getBoard(req.params.apikey), api.getEntries(params)])
    .then(axios.spread(function (r1, r2) {
      var board = r1.data
      var entries = r2.data.entries
      res.render('time', {
        board: board,
        entries: entries,
        message: req.flash('info'),
        error: req.flash('error')
      })
    }))
    .catch(function(response) {
      console.log(response)
      req.flash('error', 'An Error Happened!')
      res.render('time')
    })
})

app.post('/time/', function(req, res) {
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

app.get('/entries', function(req, res) {
  api.getEntries()
    .then(function(response) {
      res.render('entries', {
        entries: response.data.entries
      })
    })
    .catch(function(response) {
      console.log(response)
    })
})

app.post('/entries', function(req, res) {
  var post_data = req.body
  var params = {}

  params.start = post_data.start;
  params.end = post_data.end;

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


app.listen(cfg.port, function() {
  console.log('Server running at http://localhost:' + cfg.port);
})
