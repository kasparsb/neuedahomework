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
            var pathLength = this._graph.getTotalLength();

            /**
             * Graph length is 70% of pathLength
             * This is used, to calculate graph depending on state value
             */
            this._graphLength = Math.round( pathLength * 0.7 );

            // This will remain static. Its purpose is decorative
            this._graphDecor.attr({
                strokeDasharray: [pathLength, pathLength],
                // Start as empty graph
                strokeDashoffset: pathLength - this._graphLength
            });
            
            // Set up stroke dasharray and dashoffset. This is used to animate graph
            this._graph.attr({
                strokeDasharray: [pathLength, pathLength],

                // This will be animated
                strokeDashoffset: this._graphLength
            });
        },

        _createGraphValue: function() {
            this._graphValue = this._graphContainer.text( 120, 18, '' );
            this._graphValue.attr({
                color: '#000000'
            });
        },

        /**
         * Component is ready. Now its time to create graph elements
         */
        componentDidMount: function() {
            this._graphContainer = new Snap( this.getDOMNode().getElementsByTagName('svg')[0] );
            
            this._createGraphs();
            this._createGraphValue();

            // Create debounce animate callback
            this._anim = _.debounce( _.bind( this.animateState, this ), 50 );
            this._anim( this.props );
        },

        componentWillReceiveProps: function( newProps ) {
            this._graphValue.node.innerHTML = this.props.count;
            this._anim( newProps );
        },

        animateState: function( props ) {
            return;

            var p = isNaN( props.state ) ? 0 : props.state;

            console.log('animate', p);

            this._graph.animate({
                strokeDashoffset: 100
            }, 700)
        },

        render: function() {
            return React.DOM.div( {
                className:'circular-graph '+this.props.className
            }, React.DOM.svg() )
        }
    })
})