const moment = require('moment');
const schedule = require('node-schedule');

module.exports = {
    load: async function() {
        sails.log.info('Load notificator...');
        sails.plan = { };
        var subscribedClients = await Subscriber.find();
        // Load and planed ntification for all subsctibed clients 
        subscribedClients.forEach(Notificator.set);
    },

    newSchedule: function(timezone) {
        /* Current date and time in timezone */
        const now = moment().utc().add(timezone, 'm').toDate();
        sails.log.info(`Planned the new schedule for timezone ${timezone}. Local time in this timezone at ${now.toISOString()}.`);

        //TODO: Получаем время до следующего часа и запускаем расписание спустя это время с интервалом раз в час
        const startTo = Date.now();

        const result = schedule.scheduleJob({ 
            start: startTo, 
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
            rule: '*/10 * * * * *' //TODO: 10 сек для тестов! '* * */1 * * *'
        }, 
        function(s) { Notificator.push(s); }
            .bind(null, timezone));

        return result;
    },
    
    set: function(subscriber) {        
        const token = subscriber.token;     
        if (sails.plan[subscriber.timezone] === undefined) {
            sails.log.info(`Appended the timezone ${subscriber.timezone} to plan.`);
            const schedule = {
                job: Notificator.newSchedule(subscriber.timezone),
                subscribers: { }
            };
            sails.plan[subscriber.timezone] = schedule;
        }

        const subNow = moment().utc().add(subscriber.timezone, 'm').toDate();
        sails.log.debug(`Subscribed the client with token ${token}, the local time ${subNow.toISOString()}`);
        sails.plan[subscriber.timezone].subscribers[token] = subscriber.id;
    },

    unset: function(subscriber) {
        const token = subscriber.token;
        sails.log.debug(`Unsubscribed the client with token ${token}`);

        const schedule = sails.plan[subscriber.timezone];
        if (!!schedule && !!schedule.subscribers[token]) {
            delete schedule.subscribers[token];
            const count = Object.keys(schedule.subscribers).length;
            if (count === 0) {
                schedule.job.cancel();
                delete sails.plan[subscriber.timezone];
                sails.log.info(`Deleted the timezone ${subscriber.timezone} from plan.`);
            }
        }
    },

    push: function(timezone) {
        if (!!sails.plan[timezone]) {
            /* Current date and time in timezone */
            const now = moment().utc().add(timezone, 'm').toDate();
            const subscribers = sails.plan[timezone].subscribers;
            sails.log.info(`Push notification in timezone ${timezone}, now local time at ${now.toISOString()}.`);
            for(let token in subscribers) {
                sails.log.debug(`Push notification to ${token} client token.`);

                //TODO: Push notification by token ... 
                
            }
        }
    }
};