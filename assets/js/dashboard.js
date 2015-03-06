/**
 * Dashboard component
 */
define(function(require){

var React = require('react'),
    CircularGraph = require('graph/circular'),
    TransactionsGraph = require('graph/transactions'),
    EventsList = require('list/events'),
    Header = require('el/header'),
    EventsModel = require('model/events'),
    Filter = require('el/filter');

return React.createClass({
    displayName: 'Dashboard',

    _graphEvents: [ 'error', 'failure', 'success' ],

    _getState: function() {
        var s = {
            items: EventsModel.getItems(),
            transactions: EventsModel.getTransactionsForGraph( this._graphEvents ),
            requirements: EventsModel._requirement
        }

        this._graphEvents.forEach(function(ev){
            s[ev] = EventsModel.getEventStatOjbect( ev )
        }, this);

        return s;
    },

    updateEvents: function() {
        this.setState( this._getState() );
    },

    handleFilterSelect: function( requirement ) {
        EventsModel.filterRequirements( requirement );
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
            // Events filter
            React.DOM.div(
                {
                    className: 'transactions-filter doc'
                },
                React.createElement(
                    Filter,
                    {
                        items: this.state.requirements,
                        onSelect: this.handleFilterSelect
                    }
                )
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