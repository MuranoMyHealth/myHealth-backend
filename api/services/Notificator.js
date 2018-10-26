const moment = require('moment');

module.exports = {
    do: async function() {
        const nowUtc = moment().utc().toDate();
        sails.log.info(nowUtc.toISOString() + " - doing pushing the periodical notify operation ... ");
        
        var subscribedClients = await Subscriber.find();

        subscribedClients.forEach(function(entity) {
            const subNow = moment().utc().add(entity.timezone, 'm').toDate();
            const token = entity.token;
            sails.log.debug(`Subscriber token ${token}, local time ${subNow.toISOString()}`);
            //TODO: ...
        });

        sails.log.info("Notifier operation is completed.");
    }
};