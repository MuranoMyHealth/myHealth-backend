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
            const pushSubscription = JSON.stringify(req.body);

            sails.log.debug(pushSubscription);

            const entity = await Subscriber
                .update({ token: token })
                .set({ pushSubscription: pushSubscription })
                .fetch();
            if (!!entity) {
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
            const entity = await Subscriber.findOrCreate(
              {
                token: req.body.token
              },
              {
                token: req.body.token,
                timezone: req.body.timezone
              });

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
            const entity = await Subscriber.update({token: req.body.token}
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

