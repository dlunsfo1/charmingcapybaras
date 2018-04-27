var archive = require('../helpers/utils');
var cron = require('cron');

var CronJob = require('cron').CronJob;
//  '*/1 * * * *',
new CronJob(
  '*/1 * * * *',
  function() {
    console.log('cronjob running');
    archive.getUserAgenda();
  },
  null,
  true,
  'America/Los_Angeles'
);
