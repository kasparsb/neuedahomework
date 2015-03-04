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

            this.updateEventStats();
        },

        /**
         * Calculate every event type percentage
         */
        updateEventStats: function() {
            

            // Total ammount of transactions
            var total = _(this._graphEvents).reduce( function(m, ev){ 
                return this._eventTypes[ev] + m 
            }, 0, this );

            // Update percentages for each event type and store in state
            _(this._graphEvents).each(function(ev){
                var s = {};
                s[ev] = {
                    percents: Math.round( this._eventTypes[ev] / total * 100 ),
                    count: this._eventTypes[ev]
                }
                
                this.setState( s );

            }, this )
        },

        getInitialState: function() {
            var s = {};

             _(this._graphEvents).each(function(ev){
                s[ev] = {
                    percents: 0,
                    count: 0
                }
            }, this);

            return s;
        },

        componentDidMount: function() {
            this.setupPolling();
        },

        render: function() {

            // Createa graph component for each of event types
            var graphs = _(this._graphEvents).map(function(ev){
                return React.createElement( 
                    CircularGraph, 
                    {
                        ref: 'graph'+ev,
                        className: 'graph-'+ev,

                        state: this.state[ev].percents,
                        count: this.state[ev].count
                    }
                )
            }, this)

            return React.DOM.div( {
                className:'dashboard'
            }, graphs )
        }
    })
})