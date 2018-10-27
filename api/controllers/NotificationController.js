/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    subscribe: async function(req, res) {
        try {
            const token = req.params.token;
            const pushSubcription = JSON.parse(req.body);

            const entity = await Subscriber
                .update({ token: token })
                .set({pushSubcription: pushSubcription})
                .fetch();
            if (!!entity) {
                PushNotification.subscribe(pushSubscription, token);        
                res.ok(entity);
            } else {
                res.notFound();
            }
        } catch (err) {
            res.serverError(err);
        }
    },   

    logon: async function(req, res) {
        try {
            const entity = await Subscriber.create({
                token: req.body.token,
                timezone: req.body.timezone
            }).fetch();
            Notificator.set(entity);            
            res.ok(entity);
        } catch (err) {
            res.serverError(err);
        }
    },       

    logoff: async function(req, res) {
        try {
            const entities = await Subscriber.destroy({
                token: req.body.token
            }).fetch();
            if (entities.length === 1) {
                PushNotification.unsubscribe(token);
                Notificator.unset(entities[0]);
                res.ok(entities[0]);
            } else {
                res.notFound();
            }
        } catch (err) {
            res.serverError(err);
        }
    }, 
    update: async function(req, res) {
        try {
            const entity = await Subscriber.update({token: token.body.token}
                ,{
                from: req.body.from,
                to: req.body.to,
                silenceMode: req.body.silenceMode
            }).fetch();           
            res.ok(entity);
        } catch (err) {
            res.serverError(err);
        }
    },

};

