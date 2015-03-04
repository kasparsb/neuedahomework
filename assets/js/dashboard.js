/**
 * Dashboard component
 */
define(function(require){

var React = require('react'),
    io = require('socketio'),
    _ = require('underscore'),
    CircularGraph = require('graph/circular');

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
        if ( typeof this._eventTypes[data.event] != 'undefined' )
            this._eventTypes[data.event]++;

        this.updateTotal();
        this.updateEventStats();
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
        this.setupPolling();
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
            React.DOM.div({ className: 'circular-graphs' }, graphs)
            
        )
    }
})
})