var Twit = require('twit');
var _ = require('lodash');

var mapAuthOptionsEnv = {
    'twitter_consumer_key': 'consumer_key',
    'twitter_consumer_secret': 'consumer_secret',
    'twitter_access_token': 'access_token',
    'twitter_access_token_secret': 'access_token_secret'
};


module.exports = {
    follow: function (authOptions, params, callback) {
        var twitter = new Twit(authOptions);

        // Get accounts info
        twitter.get('users/lookup', params, callback);
    },
    /**
     * Returns fully-hydrated user objects for up to 100 users per request,
     * as specified by comma-separated values passed to the user_id and/or screen_name parameters.
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        // twitter auth property
        var authOptions = {};

        _.map(mapAuthOptionsEnv, function (authOpt, twitterOpt) {
            if(dexter.environment(twitterOpt)) {
                // get auth property
                authOptions[authOpt] = dexter.environment(twitterOpt);
            } else {
                // catch no-arguments message
                this.fail('A ' + twitterOpt + ' environment variable is required for this module');
            }
        }, this);

        this.follow(authOptions, step.inputs(), function (error, accountsInfo) {
            if (error) {
                // if error - send message
                this.fail(error);
            }
            // return tweets
            this.complete({accounts_info: accountsInfo});
        }.bind(this));
    }
};
