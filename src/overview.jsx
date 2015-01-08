var Overview=React.createClass({
  getInitialState: function() {
  	return {resList:[]};
  },
  getEntry: function(e) {
    var entryIndex=e.target.value;
    this.props.gotoEntry(entryIndex);
  },
  componentWillReceiveProps: function(nextProps){
    var res=nextProps.result;
    var resList=res.map(this.renderResult);
    this.setState({resList:resList});
  },
  renderResult: function(item,index) {
    if(item!="搜尋結果列表") return (<option value={item[1]}>{item[0]}</option>);
    else return (<option>{item}</option>);
  },
  render: function() {
  	var res=this.props.result || "";
    return(
	<div>
    <span id="vertical_center" className="badge">{res.length}</span>
		<div className="col-sm-2">
			<select className="form-control" onChange={this.getEntry}>
      {this.state.resList}
			</select>
		</div>
	</div>	
    ); 
  }
});
module.exports=Overview;