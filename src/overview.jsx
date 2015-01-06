var Overview=React.createClass({
  getInitialState: function() {
  	return {};
  },
  renderResult: function(item) {
  	return (<option>{item}</option>);
  },
  render: function() {
  	var res=this.props.result || "";
  	var result=res.map(this.renderResult);
    return(
	<div>
    <span id="vertical_center" className="badge">{res.length}</span>
		<div className="col-sm-2">
			<select className="form-control">
			{result}
			</select>
		</div>
	</div>	
    ); 
  }
});
module.exports=Overview;