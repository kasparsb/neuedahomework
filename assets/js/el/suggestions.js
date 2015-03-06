/**
 * Simple header element
 */
define(['react'], function(React){
    return React.createClass({
        displayName: 'Suggestions',

        show: function() {
            this.getDOMNode().style.display = 'block';
        },

        hide: function() {
            this.getDOMNode().style.display = 'none';
        },

        checkVisibility: function( items ) {
            if ( this.props.canBeVisible && items.length > 0 )
                this.show();
            else
                this.hide();
        },

        handleClick: function(ev) {
            this.props.onSelect( ev.target.innerHTML )
        },

        componentDidMount: function() {
            this.checkVisibility( this.props.items );
        },

        componentWillReceiveProps: function(newProps) {
            this.checkVisibility( newProps.items );
        },
        
        render: function() {

            var items = this.props.items.map(function(v, i){
                return React.DOM.div(
                    {
                        key: v,
                        className: 'item',
                        onClick: this.handleClick
                    },
                    v
                )
            }, this)

            return React.DOM.div(
                {
                    className: 'suggestions'
                },
                items
            )
        }
    })
});