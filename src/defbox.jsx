var Defbox=React.createClass({
  getInitialState: function() {
  	return {definition:[]};
  },
  componentWillReceiveProps: function(nextProps) {
    var d=nextProps.def;
    var definition=d.map(this.renderDef);
    this.setState({definition:definition});
  },
  renderDef: function(item) {
    return (<div>{item}<br></br></div>);
  },
  render: function() {
    return(
	 <div>
	 	 {this.state.definition}
	 </div>	
    ); 
  }
});
module.exports=Defbox;