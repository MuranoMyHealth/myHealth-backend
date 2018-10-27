
const webpush = require('web-push');
const vapidKeys = {
    "publicKey":"BBHtHGBlXrT-FCeLBiBlPt3BZvdBDb5XVKrF_PofAdP-VLzOHeEC_X1M7foI3VScxRpOoio77A5Y_ukTuFp7jd4",
    "privateKey":"J4L5ur4JBsfzi1KNTSZa2U1xBIuLTHnB4O3Ix8CzFh8"
};

module.exports = {
    push: function(token, message) {
        sails.log.info("Push to " + token + ', ' + JSON.stringify(message));
        
        //TODO: ...
    }
};