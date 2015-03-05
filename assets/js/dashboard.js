/**
 * Dashboard component
 */
define(function(require){

var React = require('react'),
    CircularGraph = require('graph/circular'),
    TransactionsGraph = require('graph/transactions'),
    EventsList = require('list/events'),
    Header = require('el/header'),
    EventsModel = require('model/events');

return React.createClass({
    displayName: 'Dashboard',

    _graphEvents: [ 'error', 'failure', 'success' ],

    _getState: function() {
        var s = {
            items: EventsModel._items,
            transactions: []//EventsModel._transactions,
        }

        this._graphEvents.forEach(function(ev){
            s[ev] = EventsModel.getEventStatOjbect( ev )
        }, this);

        return s;
    },

    updateEvents: function() {
        this.setState( this._getState() );
    },

    componentDidMount: function() {
        var mthis = this;
        EventsModel
            .init()
            .on( 'update', function(){
                mthis.updateEvents()
            })
            .fetch();
    },

    getInitialState: function() {
        return this._getState();
    },

    render: function() {

        // Create graph component for each of event types
        var graphs = this._graphEvents.map(function(ev){
            return React.createElement( 
                CircularGraph, 
                {
                    key: 'graph'+ev,
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
            // Transactions graph
            React.createElement(
                TransactionsGraph,
                {
                    className: 'doc',
                    items: this.state.transactions
                }
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