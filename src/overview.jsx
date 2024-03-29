var Overview=React.createClass({
  getInitialState: function() {
  	return {};
  },
  getDefFromEntryId: function(e) {
    var entryIndex=e.target.value;
    this.props.gotoEntry(entryIndex);
  },
  shouldComponentUpdate: function(nextProps,nextState) {
    if(nextProps.result==this.props.result) return false;
    else return true;
  },
  componentDidUpdate: function() {
    var that=this;
    setTimeout(function(){
      that.refs.entryList.getDOMNode().selectedIndex=0;
     that.props.gotoEntry(that.props.result[0][1]); 
    },500);
     
    //if(defaultIndex) this.autogetEntry(defaultIndex);
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
			<select ref="entryList" className="form-control" onChange={this.getDefFromEntryId}>
      {this.props.result.map(this.renderResult)}
			</select>
		</div>
	</div>	
    ); 
  }
});
module.exports=Overview;