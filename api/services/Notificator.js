const moment = require('moment');
const schedule = require('node-schedule');

// Get next hour by local time with correct to timezone
const getNextHour = function(timezone) {
    const staging = true; //TODO: get env variable ...
    
    let now = new Date();
    let divMinutes = timezone - now.getTimezoneOffset();      
    divMinutes = divMinutes - Math.floor(Math.abs(divMinutes) / 60) * 60;

    if (staging) {
        var mNextHour = moment().add(1 + divMinutes, 'm');
    } else {
        var mNextHour = moment(
            { y: now.getFullYear(), M: now.getMonth(), d: now.getDate(), h: now.getHours(), m: 0, s: 0, ms: 0 })
                .add(60 + divMinutes, 'm');
    }

    let result = mNextHour.toDate();
    return result;
}

module.exports = {
    load: async function() {
        sails.log.info('Load notificator...');
        sails.plan = { };
        var subscribedClients = await Subscriber.find();
        // Load and planed ntification for all subsctibed clients 
        subscribedClients.forEach(Notificator.set);
    },

    newSchedule: function(timezone) {
        const staging = true; //TODO: get env variable ...

        /* Current date and time in timezone */
        const nextHourToStart = getNextHour(timezone);
        const rule = (staging ? '*/60 * * * * *' : '* * */1 * * *');
        sails.log.info(`Planned the new schedule, be started at ${nextHourToStart} for timezone ${timezone} (${rule}).`);
        const result = schedule.scheduleJob({ 
            start: nextHourToStart, 
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
            rule: rule
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

        sails.log.debug(`Subscribed the client with token ${token}.`);
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
            let divMinutes = (new Date()).getTimezoneOffset() - timezone;    
            const now = moment().add(divMinutes, 'm').toDate();

            const subscribers = sails.plan[timezone].subscribers;
            sails.log.info(`Push notification in timezone ${timezone}, now local time at ${now.toISOString()}.`);
            for(let token in subscribers) {
                sails.log.debug(`Push notification to ${token} client token.`);
                
                //TODO: Если now - локальное время с учетом timezone, попадает в допустимый период
                // Push notification by subscriber token
                PushNotification.push(token, {
                    command: 'next_session',
                    delay: 180
                });                
                
            }
        }
    }
};