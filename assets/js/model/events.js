/**
 * Events model
 */
define(function(require){

var io = require('socketio'),
    _ = require('underscore');
    $ = require('jquery');

return {

    _listeners: [],

    _eventTypes: {
        started: 0,
        error: 0,
        failure: 0,
        success: 0
    },

    _eventTypeStats: [],

    /**
     * Total ammount of transactions
     */
    _total: 0,

    // Events list
    _items: [],

    init: function() {
        
        this._eventsNames = Object.keys( this._eventTypes );
        
        this.updateEventStats();

        return this;
    },

    /**
     * Load events from history endpoint
     */
    loadHistoricEvents: function() {
        return $.get( 'http://testevents.neueda.lv/history', _.bind( this.handleHistoryEvents, this ), 'json' );
    },

    handleHistoryEvents: function( events ) {
        this._items = events;

        events.forEach(function(ev){
            this.addEventType(ev.event);
        }, this);

        this.updateTotal();
        this.updateEventStats();
    },

    addEventToList: function( data ) {
        this._items.unshift( data );
    },

    /**
     * Setup live data polling
     */
    setupPolling: function() {
        
        this._socket = io('http://testevents.neueda.lv:80', {
            path: '/live'
        });
        
        this._socket.on('test', _.bind( this.pushEvent, this ));
    },

    /**
     * Add new event
     */
    pushEvent: function( data ) {
        this.addEventToList( data );

        this.addEventType( data.event );
        
        this.updateTotal();
        this.updateEventStats();

        this.trigger( 'update' );
    },

    addEventType: function(ev) {
        if ( typeof this._eventTypes[ev] != 'undefined' )
            this._eventTypes[ev]++;
    },

    updateTotal: function() {
        this._total = this._eventsNames.reduce( _.bind( function(m, ev) { 
            return this._eventTypes[ev] + m 
        }, this ), 0 );
    },

    /**
     * Calculate every event type percentage
     */
    updateEventStats: function() {

        this._eventsNames.forEach(function(ev){
            this._eventTypeStats[ev] = this.getEventStatOjbect( ev );
        }, this )
    },

    getEventStatOjbect: function(ev) {
        return {
            percents: Math.round( this._total == 0 ? 0 : this._eventTypes[ev] / this._total * 100 ),
            count: this._eventTypes[ev],
            caption: ev
        }
    },

    on: function( eventName, cb ) {
        if ( typeof this._listeners[eventName] == 'undefined' )
            this._listeners[eventName] = [];

        this._listeners[eventName].push(cb);

        return this;
    },

    trigger: function( eventName ) {
        if ( this._listeners[eventName] )
            this._listeners[eventName].forEach( function(cb){
                cb();
            } )
    },

    fetch: function() {
        // Load history events and then start polling for new events
        this.loadHistoricEvents()
            .done( _.bind( function(){
                
                this.trigger( 'update' );

                // Start polling for new events
                this.setupPolling()
            }, this ) );
    }
}

});