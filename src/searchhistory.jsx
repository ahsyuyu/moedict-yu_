var Searchhistory=React.createClass({
  getInitialState: function() {
  	return {};
  },
  goEntry: function(e) {
  	var entryIndex=e.target.dataset.entry;
  	var that=this;
  	this.props.entryHistory.map(function(item){
  		if(item[1]==entryIndex) {that.props.dosearch(item[2]);}
  	})
  	//this.props.gotoEntry(entryIndex);
  },
  renderHistory: function(item) {
  	return '<a data-entry='+item[1]+'>'+item[0]+'</a>';
  },
  render: function() {
  	var s=this.props.entryHistory;
  	var res=s.map(this.renderHistory);
  	var searchhistory=res.join(" > ");
    return(
	<div onClick={this.goEntry}>
		<div dangerouslySetInnerHTML={{__html: searchhistory}} />
	</div>
    	
    ); 
  }
});
module.exports=Searchhistory;