/**
 * Live events poller
 */
define(function(require){

var io = require('socketio');

var P = {
	/**
     * Setup live data polling
     */
    setupPolling: function() {
        this._socket = io('http://testevents.neueda.lv:80', {
            path: '/live'
        });
        
        this._socket.on('test', _.bind( this.pushEvent, this ));
    }
}

return P;

})