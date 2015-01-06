var Overview=React.createClass({
  getInitialState: function() {
  	return {};
  },
  getEntry: function(e) {
    var entryIndex=e.target.value;
    this.props.gotoEntry(entryIndex);
  },
  renderResult: function(item,index) {
  	return (<option value={item[1]}>{item[0]}</option>);
  },
  render: function() {
  	var res=this.props.result || "";
  	var result=res.map(this.renderResult);
    return(
	<div>
    <span id="vertical_center" className="badge">{res.length}</span>
		<div className="col-sm-2">
			<select className="form-control" onChange={this.getEntry}>
			{result}
			</select>
		</div>
	</div>	
    ); 
  }
});
module.exports=Overview;