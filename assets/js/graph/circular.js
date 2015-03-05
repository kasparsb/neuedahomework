/**
 * Circular graph. Svg based
 */
define(['react', 'underscore', 'snapsvg'], function(React, _, Snap){
    return React.createClass({
        displayName: 'CircularGraph',

        /**
         * SVG path for circle
         */
        _path: "m6,72c0,-36.464088 29.535915,-66 66,-66c36.464096,0 66,29.535912 66,66c0,36.464096 -29.535904,66 -66,66c-36.464085,0 -66,-29.535904 -66,-66z",

        _createGraphs: function() {
            // Decorative shadow under graph
            this._graphDecor = this._graphContainer.path( this._path ).attr({
                'class': 'decor',
                transform: 'rotate(-90deg)'
            });

            // Graph object
            this._graph = this._graphContainer.path( this._path ).attr({
                'class': 'graph',
                transform: 'rotate(-90deg)'
            });

            // Circle length
            this._graphTotalLength = this._graph.getTotalLength();

            var dashArray = [this._graphTotalLength, this._graphTotalLength];

            /**
             * Graph length is 70% of pathLength
             * This is used, to calculate graph depending on state value
             */
            this._graphLength = Math.round( this._graphTotalLength * 0.7 );

            // This will remain static. Its purpose is decorative
            this._graphDecor.attr({
                strokeDasharray: dashArray,
                // Decor is full
                strokeDashoffset: this._graphTotalLength - this._graphLength
            });
            
            // Set up stroke dasharray and dashoffset. This is used to animate graph
            this._graph.attr({
                strokeDasharray: dashArray,

                // Set graph as empty (0%)
                strokeDashoffset: this._getDashoffsetByPercents( 0 )
            });
        },

        /**
         * Calculate SVG strokeDashoffset, so it is percents of full grpah
         */
        _getDashoffsetByPercents: function( percents ) {
            return this._graphTotalLength - this._graphLength * ( percents / 100 );
        },

        _animateGraphState: function( props ) {
            this._graph.animate({
                strokeDashoffset: this._getDashoffsetByPercents( props.item.percents )
            }, 700)
        },

        /**
         * Component is ready. Now its time to create graph elements
         */
        componentDidMount: function() {
            var mthis = this;

            this._graphContainer = new Snap( this.getDOMNode().getElementsByTagName('svg')[0] );
            
            this._createGraphs();

            // Create debounced animate callback
            this._anim = _.debounce( function( props ){
                mthis._animateGraphState( props )
            }, 50 );
            this._anim( this.props );
        },

        componentWillReceiveProps: function( newProps ) {
            this._anim( newProps );
        },

        render: function() {
            return React.DOM.div( 
                {
                    className:'circular-graph '+this.props.className
                },
                React.DOM.div(
                    {
                        className: 'graph-container'
                    },
                    // Graph svg
                    React.DOM.svg(),
                    // Percents
                    React.DOM.label(
                        {
                            className: 'graph-value'
                        }, 
                        this.props.item.percents+'%'
                    )
                ),
                // Percents
                React.DOM.div(
                    {
                        className: 'graph-legend'
                    }, 
                    React.DOM.span({ className:'caption' }, this.props.item.caption),
                    React.DOM.span({ className:'value' }, this.props.item.count)
                )
            )
        }
    })
})