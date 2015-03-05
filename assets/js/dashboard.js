/**
 * Dashboard component
 */
define(function(require){

var React = require('react'),
    io = require('socketio'),
    _ = require('underscore'),
    CircularGraph = require('graph/circular');
    EventsList = require('list/events');
    Header = require('el/header');
    $ = require('jquery');

return React.createClass({
    displayName: 'Dashboard',

    _eventTypes: {
        started: 0,
        error: 0,
        failure: 0,
        success: 0
    },

    /**
     * Total ammount of transactions
     */
    _total: 0,

    _graphEvents: [ 'error', 'failure', 'success' ],

    /**
     * Load events from history endpoint
     */
    loadHistoricEvents: function() {
        return $.get( 'http://testevents.neueda.lv/history', _.bind( this.handleHistoryEvents, this ), 'json' );
    },

    handleHistoryEvents: function( events ) {
        this.setState( {items: events} );

        events.forEach(function(ev){
            this.addEventType(ev.event);
        }, this);
        this.updateTotal();
        this.updateEventStats();
    },

    addEventToList: function( data ) {
        this.state.items.unshift( data );

        this.setState( {items: this.state.items} );
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
    },

    addEventType: function(ev) {
        if ( typeof this._eventTypes[ev] != 'undefined' )
            this._eventTypes[ev]++;
    },

    updateTotal: function() {
        this._total = _(this._graphEvents).reduce( function(m, ev){ 
            
            return this._eventTypes[ev] + m 

        }, 0, this );
    },

    /**
     * Calculate every event type percentage
     */
    updateEventStats: function() {

        // Update percentages for each event type and store in state
        _(this._graphEvents).each(function(ev){
            var s = {};
            s[ev] = this.getEventStateOjbect( ev );

            this.setState( s );

        }, this )
    },

    getEventStateOjbect: function(ev) {
        return {
            percents: Math.round( this._total == 0 ? 0 : this._eventTypes[ev] / this._total * 100 ),
            count: this._eventTypes[ev],
            caption: ev
        }
    },

    componentDidMount: function() {
        // Load history events and then start polling for new events
        this.loadHistoricEvents()
            .done( _.bind( this.setupPolling, this ) );
    },

    getInitialState: function() {
        var s = {
            items: []
        };

         _(this._graphEvents).each(function(ev){
            s[ev] = this.getEventStateOjbect( ev )
        }, this);

        return s;
    },

    render: function() {

        // Create graph component for each of event types
        var graphs = _(this._graphEvents).map(function(ev){
            return React.createElement( 
                CircularGraph, 
                {
                    ref: 'graph'+ev,
                    className: 'graph-'+ev,
                    // Graph data
                    item: this.state[ev]
                }
            )
        }, this);

        return React.DOM.div( 
            {
                className:'dashboard'
            },  

            // Circular graphs
            React.DOM.div(
                { 
                    className: 'circular-graphs doc' 
                }, 
                graphs
            ),
            // latest events list
            React.createElement( Header, { title: 'Test events list' } ),
            React.DOM.div(
                { 
                    className: 'events-list doc' 
                }, 
                React.createElement(
                    EventsList,
                    {
                        ref: 'list',
                        items: this.state.items
                    }
                )
            )
        )
    }
})
})