/**
 * Events model
 */
define(function(require){

var io = require('socketio'),
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

    // Grouped transactions by time and event type
    _transactions: [],

    _transactionKeysLimit: 20,

    init: function() {
        
        this._eventsNames = Object.keys( this._eventTypes );

        this.updateEventStats();
        
        return this;
    },

    /**
     * Load events from history endpoint
     */
    loadHistoricEvents: function() {
        var mthis = this;

        return $.get( 'http://testevents.neueda.lv/history', function( events ){
            mthis.handleHistoryEvents( events )
        }, 'json' );
    },

    handleHistoryEvents: function( events ) {
        this._items = events;

        events.forEach(function(ev){
            this.addEventType(ev.event);
            this.addTransaction(ev);
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
        var mthis = this;

        this._socket = io('http://testevents.neueda.lv:80', {
            path: '/live'
        });
        
        this._socket.on('test', function( data ){
            mthis.pushEvent( data )
        } );
    },

    /**
     * Add new event
     */
    pushEvent: function( data ) {
        this.addEventToList( data );

        this.addEventType( data.event );
        this.addTransaction( data );
        
        this.updateTotal();
        this.updateEventStats();

        this.trigger( 'update' );
    },

    addEventType: function(ev) {
        if ( typeof this._eventTypes[ev] != 'undefined' )
            this._eventTypes[ev]++;
    },

    /**
     * Transactions are grouped by 5 minutes
     */
    addTransaction: function( data ) {
        var key = this.getTransactionsGroupingKey( data );
        var transaction = this.findTransactionByKey( key );
        

        if ( !transaction ) {
            transaction = {
                key: key,
                eventTypes: {}
            };

            // Make sure all events is defined in eventTypes
            this._eventsNames.forEach(function(ev){
                if ( typeof transaction.eventTypes[ev] == 'undefined' )
                    transaction.eventTypes[ev] = 0;
            });

            this._transactions.push( transaction );
        }

        // Increment
        transaction.eventTypes[data.event]++;


        // Limit transactions count
        if ( this._transactions.length > this._transactionKeysLimit )
            this._transactions.shift();
    },

    findTransactionByKey: function( key ) {
        for ( var i in this._transactions )
            if ( this._transactions[i].key == key )
                return this._transactions[i];
        return false;
    },

    getTransactionsGroupingKey: function( data ) {
        var d = new Date(data.time);

        return ['getFullYear','getMonth','getDate','getHours','getMinutes','getSeconds']
            .map(function(segment){

                if ( segment == 'getSeconds' ) {
                    // In case of seconds divide by ten
                    return Math.round( d[segment]() / 10 );
                }
                else {
                    return d[segment]();
                }


            })
            .join('-');
    },

    updateTotal: function() {
        var mthis = this;

        this._total = this._eventsNames.reduce( function(m, ev) { 
            return mthis._eventTypes[ev] + m 
        }, 0 );
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

    /**
     * Prepare transactions data for consumption in graph
     */
    getTransactionsForGraph: function( eventNames ) {
        return eventNames.map( function(ev){
            
            var data = [];
            for ( var i in this._transactions )
                data.push( this._transactions[i].eventTypes[ev] );
            
            return {
                label: ev,
                name: ev,
                data: data
            }
            
        }, this );
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
        var mthis = this;

        // Load history events and then start polling for new events
        this.loadHistoricEvents()
            .done( function(){
                
                mthis.trigger( 'update' );

                // Start polling for new events
                mthis.setupPolling()
            } );
    }
}

});