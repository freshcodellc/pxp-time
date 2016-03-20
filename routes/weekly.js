var _ = require('lodash');
var moment = require('moment')
var express = require('express');
var router = express.Router();
var axios = require('axios')
var api = require('../api')

router.get('/', function(req, res) {
  api.getWeekly()
    .then(function(response) {

      var entries = response.data.entries;
      var entryList = [];
      // GRAB JUST NEEDED INFO
      for (var i = 0; i < entries.length; i++){
        var entry = {
          name: entries[i].board.public.name,
          created_at: moment(entries[i].entry.created_at, 'YYYY-MM-DD HH:mm:ss').format('dddd'),
          hours: entries[i].entry.hours,
          minutes: entries[i].entry.minutes
        };
        entryList.push(entry);
      }
      // Add up all the time for the week
      var grandTotalTimeWeek = moment.duration();
      for (var i = 0; i < entryList.length; i++) {
        grandTotalTimeWeek.add(moment.duration({
          hours: entryList[i].hours,
          minutes: entryList[i].minutes
        }))
      }
      grandTotalTimeWeek = grandTotalTimeWeek.hours() + ' hrs ' + grandTotalTimeWeek.minutes() + ' min'

      // Group time entries by project
      var projectGrouped = _.chain(entryList).groupBy('name').toPairs().map(function (pair) { 
        return _.zipObject(['name', 'entries'], pair); 
      }).value();

      var projectList = [];
      for (y = 0; y < projectGrouped.length; y++ ) {
        // Group time entries by day of the week.
        var daysGrouped = _.chain(projectGrouped[y].entries).groupBy('created_at').toPairs().map(function (pair) { 
          return _.zipObject(['day', 'entries'], pair); 
        }).value();
        var project = {};
        var totalTimeWeek = moment.duration();
        for (x = 0; x < daysGrouped.length; x++) {
          var dayEntries = daysGrouped[x].entries;
          var totalTimeDay = moment.duration();
          for (z = 0; z < dayEntries.length; z++) {
            totalTimeDay.add(moment.duration({
              hours: dayEntries[z].hours,
              minutes: dayEntries[z].minutes
            }))
          }
          var time = { total: totalTimeDay.hours() + ' hrs ' + totalTimeDay.minutes() + ' min'}
          project[daysGrouped[x].day] = time;
          totalTimeWeek.add(totalTimeDay);
        }
        project.name = projectGrouped[y].name;
        project.weekTotal = totalTimeWeek.hours() + ' hrs ' + totalTimeWeek.minutes() + ' min';
        projectList.push(project);
      }

      res.render('weekly', {
        projects: projectList,
        grandTotalTimeWeek: grandTotalTimeWeek
      })
    })
    .catch(function(response) {
      // TODO: Remove once API isn't broken
      if (response.data.error === "Couldn't find any entries. Be sure to properly authenticate and supply a valid start date and end date to your request.") {
        res.render('entries', {
          entries: []
        })
      } else {
        console.log(response)
      }
    })
})

module.exports = router;
