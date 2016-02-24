var axios = require('axios')
var moment = require('moment')

var cfg = require('./config')

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    var token_header = 'Token token=' + cfg.pxp_time_api_key
    config.headers = {
      'Authorization': token_header
    }
    return config;
  }, function (error) {
    // Do something with request error
    console.log(error)
    return Promise.reject(error);
  });

var resources = {}

var boardsUrl = cfg.api_root + '/boards/'
resources.getBoards = function() {
  return axios.get(boardsUrl)
}

resources.getBoard = function(apikey) {
  var boardUrl = boardsUrl + 'cards_for_user/' + apikey
  return axios.get(boardUrl)
}

var userUrl = cfg.api_root + '/users/' + cfg.pxp_time_user_handle
resources.getUser = function() {
  return axios.get(userUrl)
}

var entriesUrl = cfg.api_root + '/entries'
resources.getEntries = function(params) {
  var options = {}

  if (typeof params == 'undefined' && params !== '') {
    var params = {}
    params.start = moment().subtract(30, 'days').format('YYYY-MM-DD')
    params.end = moment().add(1, 'days').format('YYYY-MM-DD')
  } else {
    params.start = moment(params.start).format('YYYY-MM-DD')
    params.end = moment(params.end).format('YYYY-MM-DD')
  }

  options.params = params

  return axios.get(entriesUrl, options)
}

var url = cfg.api_root + '/entries'
resources.postEntry = function(post_data) {
  return axios.post(url, post_data)
}

module.exports = resources
