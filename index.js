var Twit = require('twit');
var _ = require('lodash');

module.exports = {
    /**
     * Returns fully-hydrated user objects for up to 100 users per request,
     * as specified by comma-separated values passed to the user_id and/or screen_name parameters.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var credentials = dexter.provider('twitter').credentials(),
            twitter = new Twit({
                access_token: credentials.access_token,
                access_token_secret: credentials.access_token_secret,
                consumer_key: credentials.consumer_key,
                consumer_secret: credentials.consumer_secret
            });

        twitter.get('users/lookup', step.inputs(), function (error, accountsInfo) {
            if (error)
                // if error - send message
                this.fail(error);
            else
                // return tweets
                this.complete({accounts_info: accountsInfo});
        }.bind(this));
    }
};
