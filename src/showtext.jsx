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
    	<Defbox result={this.props.result} /> 	
    </div>
    );
  }
});
module.exports=Showtext;