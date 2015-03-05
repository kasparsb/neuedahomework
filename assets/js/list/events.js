/**
 * Events list
 */
define(['react'], function(React, moment){

    return React.createClass({
        displayName: 'EventsList',

        createRow: function( data ) {

            var d = new Date(data.time);

            return React.DOM.tr(
                {
                    key: data.uuid,
                    className: 'eventtype-'+data.event
                },
                React.DOM.td( { className: 'time' }, 
                    d.toLocaleDateString()+' '+d.toLocaleTimeString()
                ),
                React.DOM.td( { className: 'event' }, data.event ),
                React.DOM.td( { className: 'component' }, data.testCase.component ),
                React.DOM.td( { className: 'requirement' }, data.testCase.requirement ),
                React.DOM.td( { className: 'title' }, data.testCase.title )
            )
        },

        render: function() {

            var rows = this.props.items.map( this.createRow, this );

            return React.DOM.table(
                {
                    className: 'data-list events-list'
                },
                React.DOM.thead(null,
                    React.DOM.tr(null, 
                        React.DOM.th( { className: 'time' }, 'Date' ),
                        React.DOM.th( { className: 'event' }, 'Event' ),
                        React.DOM.th( { className: 'component' }, 'Component' ),
                        React.DOM.th( { className: 'requirement' }, 'Requirement' ),
                        React.DOM.th( { className: 'title' }, 'Title' )
                    )
                ),
                React.DOM.tbody(null, rows)
            )
        }
    })
});