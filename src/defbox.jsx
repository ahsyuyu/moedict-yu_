var Defbox=React.createClass({
  getInitialState: function() {
  	return {};
  },
  render: function() {
    return(
	<div>
		{this.props.def}
	</div>	
    ); 
  }
});
module.exports=Defbox;