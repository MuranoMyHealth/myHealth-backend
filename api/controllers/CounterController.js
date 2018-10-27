/**
 * CounterController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = {
    check: function (req, res) {
        try {
            var h = new Date().getHours();
            var entity = Counter.findOrCreate(
                {
                    hour: h,
                    token: req.body.token
                }
                , {
                    hour: h,
                    token: req.body.token
                });
            var count = Counter.count({ hour: h });
            res.ok({count: count});
        } catch (err) {
            res.serverError(err);
        }
    }

};

