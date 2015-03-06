/**
 * Transactions graph
 */
define(['react', 'jquery', 'underscore', 'snapsvg'], function(React, $, _, Snap){

    return React.createClass({
        displayName: 'TransactionsGraph',

        /**
         * Graph paddings
         */
        padding: {
            top: 20,
            left: 60,
            right: 20,
            bottom: 70
        },

        axis: {
            x: {
                // Svg element of axis
                el: null,
                // Data extremes (min and moax)
                extremes: { min: null, max: null, delta: null },
                step: null,
                // Width in pixels
                size: null
            },
            y: {
                // Svg element of axis
                el: null,
                // Data extremes (min and moax)
                extremes: { min: null, max: null, delta: null },
                step: null,
                // Height in pixels
                size: null
            }
        },

        series: [
            {
                label: 'Error',
                name: 'error',
                data: [10, 20, 5, 2, 18, 19, 34, 20, 5, 7, 9, 16, 10, 20, 5, 2, 18, 19, 34, 20, 5, 7, 9, 16]
            },
            {
                label: 'Success',
                name: 'success',
                data: [20, 14, 12, 2, 20, 44, 10, 20, 5, 2, 18, 34, 20, 14, 12, 2, 20, 44, 10, 20, 5, 2, 18, 34]
            },
            {
                label: 'failure',
                name: 'failure',
                data: [34, 20, 5, 7, 9, 16, 2, 18, 19, 34, 20, 24, 34, 20, 5, 7, 9, 16, 2, 18, 19, 34, 20, 24]
            }
        ],

        dimensions: function() {
            this.width = $( this.getDOMNode() ).find('svg').width();
            this.height = $( this.getDOMNode() ).find('svg').height();
        },

        /**
         * Find max and min Y axis values
         */
        yExtremes: function() {
            var d = _(this.series).pluck( 'data' );
            d = _(d).flatten();

            this.axis.y.extremes = {
                min: d.length > 0 ? _(d).min() : 0,
                max: d.length > 0 ? _(d).max() : 0
            }

            this.axis.y.extremes.delta = this.axis.y.extremes.max - this.axis.y.extremes.min;
        },

        /**
         * Calculate x axis steps
         */
        steps: function() {
            // Data items count
            var count = this.series[0].data.length;

            this.axis.x.step = this.axis.x.size / count;
        },

        _createGraph: function() {
            this.dimensions();

            this.graphContainer = new Snap( this.getDOMNode().getElementsByTagName('svg')[0] );

            this.createXAxis();
            this.createYAxis();

            this.drawSeries();
        },

        createXAxis: function() {
            this.createAx(
                'x',
                this.padding.left,
                this.height - this.padding.bottom,
                this.width - this.padding.right,
                this.height - this.padding.bottom
            );

            this.axis.x.size = this.width - ( this.padding.left + this.padding.right );
        },

        createYAxis: function() {
            this.createAx(
                'y',
                this.padding.left,
                this.padding.top,
                this.padding.left,
                this.height - this.padding.bottom
            );

            this.axis.y.size = this.height - ( this.padding.top + this.padding.bottom );
        },

        createAx: function( type, x1, y1, x2, y2 ) {
            this.axis[type].el = this.graphContainer.line( x1, y1, x2, y2 );
            this.axis[type].el.attr({
                'class': 'axis '+type+'axis'
            })
        },

        createXAxisLabels: function() {
            if ( !this._xLabels )
                this._xLabels = [];
            else {
                for ( var i in this._xLabels )
                    this._xLabels[i].remove();
                this._xLabels = [];
            }

            this.props.labels.forEach(function(label, i){
                var x = this.getItemX( i ), 
                    y = this.axis.y.size + this.padding.top + 4;

                this._xLabels.push(
                    this.graphContainer.text( x, y, label ).attr({
                        'class': 'xlabel',
                        textAnchor: 'start',
                        alignmentBaseline: 'before-edge',
                        transform: 'rotate(45 '+x+' '+y+')'
                    })
                )

            }, this)
        },

        createYAxisLabels: function() {
            if ( !this._yLabels )
                this._yLabels = [];
            else {
                for ( var i in this._yLabels )
                    this._yLabels[i].remove();
                this._yLabels = [];
            }
            
            this._yLabels.push(
                this.graphContainer.text( 
                    this.padding.left - 8, 
                    this.padding.top + 14, 
                    this.axis.y.extremes.max+''
                ).attr({
                    'class': 'ylabel',
                    textAnchor: 'end'
                })
            );
            this._yLabels.push(
                this.graphContainer.text(
                    this.padding.left - 8,
                    this.axis.y.size + this.padding.top - 4,
                    this.axis.y.extremes.min+''
                ).attr({
                    'class': 'ylabel',
                    textAnchor: 'end'
                })
            );
        },

        drawSeries: function() {
            // Calculations
            this.yExtremes();
            this.steps();
            this.createXAxisLabels();
            this.createYAxisLabels();

            // And draw graphs
            this.series.forEach( this.drawSerie, this )
        },

        drawSerie: function( serie, index ) {
            if ( typeof serie._points == 'undefined' )
                serie._points = [];
            if ( typeof serie._lines == 'undefined' )
                serie._lines = [];

            this.drawGraphPoints( serie, index );
            this.drawGraphLines( serie );
        },

        destroySerieGraph: function( serie ) {
            var remove = function( p ) { p.el.remove() }

            serie._points.forEach( remove );
            serie._lines.forEach( remove );

            serie._points = [];
            serie._lines = [];
        },

        destroyGraphs: function() {
            this.series.forEach( function( serie ){
                this.destroySerieGraph( serie )
            }, this )
        },

        drawGraphPoints: function( serie, index ) {
            /**
             * Every series has its own small offset, to ensure, that graphs are not overlaping
             */
            var offset = index * 3;
            serie.data.forEach( function( v, pos ){

                var y = this.getValueY( v ) - offset;
                var x = this.getItemX( pos ) + offset;

                serie._points.push( this.drawGraphPoint( serie.name, x, y ) );

            }, this );
        },

        drawGraphPoint: function( name, x, y ) {
            var el = this.graphContainer.circle( x, y, 2 ).attr({
                'class': 'graph-point graph-item-'+name
            });

            return {
                x: x,
                y: y,
                el: el
            }
        },

        drawGraphLines: function( serie ) {
            var prevPoint = null;

            serie._points.forEach( function( point ){
                if ( prevPoint ) {
                    var el = this.graphContainer.line( prevPoint.x, prevPoint.y, point.x, point.y ).attr({
                        'class': 'graph-line graph-item-'+serie.name
                    })

                    serie._lines.push({
                        el: el
                    })
                }
                prevPoint = point;
            }, this );
        },

        /**
         * Calculate value's Y coordinates in pixels
         */
        getValueY: function( value ) {
            var p = (this.axis.y.extremes.max - value) / this.axis.y.extremes.delta;

            return this.axis.y.size * p + this.padding.top;
        },

        /**
         * Calculate X coordinate based in value position in dataset
         */
        getItemX: function( position ) {
            var total = this.series[0].data.length-1;

            var p = (position)/total;

            return (this.axis.x.size-30) * p + this.padding.left + 10;
        },

        componentDidMount: function() {

            this.series = _( this.props.items ).clone();

            this._createGraph();
        },

        componentWillReceiveProps: function( newProps ) {
            this.destroyGraphs();

            this.series = _( newProps.items ).clone();
            this.drawSeries();
        },

        render: function() {
            return React.DOM.div(
                {
                    className:'transactions-graph '+this.props.className
                },
                React.DOM.div(
                    {
                        className: 'graph-container'
                    },
                    // Graph svg
                    React.DOM.svg()
                )
            )
        }
    })

});