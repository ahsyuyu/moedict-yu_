var Searchhistory=require("./searchhistory.jsx");
var Defbox=require("./defbox.jsx");
var Showtext=React.createClass({
  getInitialState: function() {
  	return {};
  },
  render: function() {
    return (
    <div>
    	<Searchhistory result={this.props.result}/>
    	<Defbox def={this.props.def} result={this.props.result} /> 	
    </div>
    );
  }
});
module.exports=Showtext;