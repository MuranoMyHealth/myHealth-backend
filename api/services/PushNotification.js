
const webpush = require('web-push');
const publicKey = "BOGDs4PHqDZsr8cElNDyir-7rcJ57QEuRd0oOwR0ASUgnk5hg5HJ_1lqOncRElRXVdRh99ZlUkAXtnYthAJdtOU";
const privateKey = "Nb8ONaRycdNXoFbdy60xeGQz0FqVrkDBBhzaBwEf3bU";

webpush.setVapidDetails('mailto:myhealth@gmail.com', publicKey, privateKey);

module.exports = {
    subscribe: function(pushSubscription, token) {
        if(sails.subs === undefined) {
            sails.subs = { };
        } 
        sails.log.info(`Token ${token} subscribed to push notification.`);
        sails.subs[token] = pushSubscription;
        PushNotification.subscribe(pushSubscription, token);
    },

    unsubscribe: function(token) {
        PushNotification.unsubscribe(token);
        if(sails.subs !== undefined && sails.subs[token] !== undefined) {
            delete sails.subs[token];
        }
    },

    push: async function(token, message) {
        const pushSubscription = sails.subs[token];
        if (pushSubscription === undefined) {
            sails.log.warn(`The token ${token} subscription to push notification not subscribed.`);
            return;
        }

        sails.log.info("Push to " + token + ', ' + JSON.stringify(message));
        const payload = JSON.stringify(message);
        try {
            await webpush.sendNotification(pushSubscription, payload);
        } catch (err) {
            sails.log.console.error(err);;      
        }
    }
};