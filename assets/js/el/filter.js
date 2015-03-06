/**
 * Simple header element
 */
define(['react', 'underscore', 'el/suggestions'], function(React, _, Suggestions){
    return React.createClass({
        displayName: 'EventsFilter',

        getInitialState: function() {
            return {
                found: []
            }
        },
        
        handleChange: function( ev ) {

            this.setState({
                found: this.findItems( this.refs.search.getDOMNode().value )
            })
        },

        handleFocus: function() {
            this.setState({
                suggestionsCanBeVisible: true
            });
            this.refs.suggestions.show();
        },

        handleBlur: function() {
            this.setState({
                suggestionsCanBeVisible: false
            });
            _.delay( _.bind( function(){
                this.refs.suggestions.hide();
            }, this ), 500 )
        },

        handleSuggestionsSelect: function( suggestion ) {
            this.refs.search.getDOMNode().value = suggestion;
            this.handleChange();
            this.props.onSelect( suggestion );
        },

        findItems: function( phrase ) {
            return _(this.props.items).filter( function(item){
                return item.toLowerCase().indexOf(phrase.toLowerCase()) >= 0;
            }, this )
        },

        render: function() {
            return React.DOM.div(
                {
                    className: 'events-filter'
                }, 
                React.DOM.label(
                    {
                        htmlFor: 'fieldfilter'
                    },
                    'Filter requirement'
                ),
                React.DOM.input(
                    {
                        ref: 'search',
                        type: 'text',
                        id: 'fieldfilter',
                        onChange: _.debounce( this.handleChange, 20 ),
                        onFocus: this.handleFocus,
                        onBlur: this.handleBlur
                    }
                ),
                React.createElement(
                    Suggestions, 
                    {
                        ref: 'suggestions',
                        items: this.state.found,
                        canBeVisible: this.state.suggestionsCanBeVisible,
                        onSelect: this.handleSuggestionsSelect
                    }
                )
                
            )
        }
    })
});