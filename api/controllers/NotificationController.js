/**
 * NotificationController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {

    subscribe: async function(req, res) {
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

    unsubscribe: async function(req, res) {
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

};
