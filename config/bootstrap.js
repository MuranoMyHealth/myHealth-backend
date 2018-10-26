/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs just before your Sails app gets lifted.
 * > Need more flexibility?  You can also do this by creating a hook.
 *
 * For more information on bootstrapping your app, check out:
 * https://sailsjs.com/config/bootstrap
 */

const moment = require('moment');
const schedule = require('node-schedule');

module.exports.bootstrap = function(done) {

  sails.log.debug("bootstrap ..");

  // By convention, this is a good place to set up fake data during development.
  //
  // For example:
  // ```
  // // Set up fake development data (or if we already have some, avast)
  // if (await User.count() > 0) {
  //   return done();
  // }
  //
  // await User.createEach([
  //   { emailAddress: 'ry@example.com', fullName: 'Ryan Dahl', },
  //   { emailAddress: 'rachael@example.com', fullName: 'Rachael Shaw', },
  //   // etc.
  // ]);
  // ```

  // Don't forget to trigger `done()` when this bootstrap function's logic is finished.
  // (otherwise your server will never lift, since it's waiting on the bootstrap) 

  /*
    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    │
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)
    │    └──────────────────── minute (0 - 59)
    └───────────────────────── second (0 - 59, OPTIONAL)
  */

  //TODO: Из репозитория время след. сессии, далее с интервалом
  const jobIntervalSec = sails.config.custom.jobIntervalSec;
  // Время от 0 часов
  //var nowTime = moment().utc().toDate();
  const startJobDate = moment().utc().toDate();
  //const dayUtcSeconds = 67657657;
  //Math.floor(dayUtcSeconds / jobIntervalSec) * jobIntervalSec + jobIntervalSec;

  sails.scheduledJob = schedule.scheduleJob({ 
    start: Date.now(), 
    rule: `*/${jobIntervalSec} * * * * *`
  }, 
  async function() {
    sails.log.debug("Scheduled job executed ...");    
    await Notificator.do();
    sails.log.debug("Scheduled job is completed.");
    sails.log.debug("___________________________");
  });

  return done();
};
