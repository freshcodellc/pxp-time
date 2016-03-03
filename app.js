var express = require('express')
var session = require('express-session')
var exphbs = require('express-handlebars')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var moment = require('moment')
var flash = require('connect-flash')

var indexRoutes = require('./routes/index')
var timeRoutes = require('./routes/time')
var entriesRoutes = require('./routes/entries')

var cfg = require('./config')

var app = express()

var hbs = exphbs.create({
  defaultLayout: 'base',
  helpers: {
    formatTime: function(time) {
      var timeString = '0' + time.toString();
      return timeString.slice(-2)
    },
    formatDate: function(context, block) {
      var f = block.hash.format || "MMMM Do, YYYY";
      return moment(context).format(f);
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

// Include route files
app.use('/', indexRoutes)
app.use('/time', timeRoutes)
app.use('/entries', entriesRoutes)

app.listen(cfg.port, function() {
  console.log('Server running at http://localhost:' + cfg.port);
})
