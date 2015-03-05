/**
 * Events list
 */
define(['react'], function(React){

    return React.createClass({
        displayName: 'EventsList',

        createRow: function( data ) {

            var d = new Date(data.time);
            var date = d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();
            var time = d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();

            return React.DOM.tr(
                {
                    key: data.uuid,
                    className: 'eventtype-'+data.event
                },
                React.DOM.td( { className: 'time' }, 
                    date+' '+time
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