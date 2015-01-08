var Searchhistory=require("./searchhistory.jsx");
var Defbox=require("./defbox.jsx");
var Showtext=React.createClass({
  getInitialState: function() {
  	return {entryHistory:[]};
  },
  pushHistory: function(entry) {
    this.state.entryHistory.push(entry);
  },
  dosearch: function(tofind) {
    for(var i=1; i<tofind.length; i++){
      var t=tofind.substr(0,i);
      this.props.defSearch(t,i);
    }
  },
  render: function() {
    return (
    <div>
    	<Searchhistory entryHistory={this.state.entryHistory} result={this.props.result}/>
      <br/>
    	<Defbox dosearch={this.dosearch} pushHistory={this.pushHistory} entryIndexes={this.props.entryIndexes} defs={this.props.defs} result={this.props.result} /> 	
    </div>
    );
  }
});
module.exports=Showtext;