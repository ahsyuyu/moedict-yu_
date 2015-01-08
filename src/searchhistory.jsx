var Searchhistory=React.createClass({
  getInitialState: function() {
  	return {};
  },
  
  render: function() {
  	var s=this.props.entryHistory;
  	var searchhistory=s.join(" > ");
    return(
	<div>{searchhistory}</div>
    	
    ); 
  }
});
module.exports=Searchhistory;