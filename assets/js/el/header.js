/**
 * Simple header element
 */
define(['react'], function(React){
	return React.createClass({
		displayName: 'ElHeader',
		
		render: function() {
			return React.DOM.header(
				{
					className: 'heading'
				}, 
				React.DOM.div(
					{
						className: 'doc',
					},
					React.DOM.h2( null, this.props.title )
				)
			)
		}
	})
});