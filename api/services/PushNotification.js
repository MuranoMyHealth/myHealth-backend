
const webpush = require('web-push');
const publicKey = "BOGDs4PHqDZsr8cElNDyir-7rcJ57QEuRd0oOwR0ASUgnk5hg5HJ_1lqOncRElRXVdRh99ZlUkAXtnYthAJdtOU";
const privateKey = "Nb8ONaRycdNXoFbdy60xeGQz0FqVrkDBBhzaBwEf3bU";

webpush.setVapidDetails('mailto:myhealth@gmail.com', publicKey, privateKey);

module.exports = {
    push: async function(token, message) {
      var record = await Subscriber.findOne({ token: token });
      if (!record) {
          sails.log.warn(`The token ${token} subscription to push notification not subscribed.`);
          return;
      }

      sails.log.debug(record.pushSubscription);
      const pushSubscription = JSON.parse(record.pushSubscription);

      sails.log.info("Push to " + token + ', ' + JSON.stringify(message));
      const payload = JSON.stringify(message);
      try {
          await webpush.sendNotification(pushSubscription, payload);
      } catch (err) {
          sails.log.console.error(err);
          sails.log.debug(pushSubscription);
      }
    }
};
