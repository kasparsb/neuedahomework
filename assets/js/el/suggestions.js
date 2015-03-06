/**
 * Simple header element
 */
define(['react', 'jquery'], function(React, $){
    return React.createClass({
        displayName: 'Suggestions',

        /**
         * Current selected suggestion in list
         */
        _current: -1,

        /**
         * Move to previous suggestion
         */
        prev: function() {
            this._current--;
            this._validateCurrent();
            this._selectItem(this._current);
        },

        /**
         * Move to next suggestion
         */
        next: function() {
            this._current++;
            this._validateCurrent();
            this._selectItem(this._current);
        },

        _validateCurrent: function() {
            if ( this._current < 0 )
                this._current = 0;
            if ( this._current >= this.props.items.length )
                this._current = this.props.items.length-1;
        },

        /**
         * Select item from list by index
         */
        _selectItem: function( index ) {
            $( this.getDOMNode() ).find('.item.selected').removeClass('selected');
            $( this.getDOMNode() ).find('.item:eq('+index+')').addClass('selected');
        },

        clickSelected: function() {
            $( this.getDOMNode() ).find('.item.selected').click();
        },

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
            if ( this.props.items.length != newProps.items.length )
                this._current = -1;
            this.checkVisibility( newProps.items );
        },
        
        render: function() {

            this.items = this.props.items.map(function(v, i){
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
                this.items
            )
        }
    })
});