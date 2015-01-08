var Defbox=React.createClass({
  getInitialState: function() {
  	return {definition:[],entryIndex:[]};
  },
  componentWillReceiveProps: function(nextProps) {
    var defs=[];
    var d=nextProps.defs;
    var i=nextProps.entryIndexes;
    this.setState({entryIndex:i});
    if(d.length!=0) {
      for(var i=0; i<d.length; i++) {
        var t=d[i].split("\n");
        var t1=t.map(this.renderDef);
        defs.push(t1);
        this.setState({entry:t[0]});
      }
    }
    this.setState({definition:defs});
  },
  renderDef: function(item) {
    var e=this.state.entryIndex;
    var parsedItem=item.replace(/./g,function(r){
        return '<span data-entry='+e+'>'+r+'</span>';
      });
    return (<div>
      <div dangerouslySetInnerHTML={{__html: parsedItem}} />
      </div>);
  },
  dosearch_history: function(e) {
    var entryIndex=e.target.dataset.entry;
    var tofind=e.target.textContent;
    var next=e.target.nextSibling;
    for(var i=0; i<10; i++){
      if(!next || next.textContent.match(/[。，、「」：]/g)) break;  
      tofind+=next.textContent;
      next=next.nextSibling;
    }
    this.props.pushHistory(this.state.entry);
    this.props.dosearch(tofind);
  },
  render: function() {
    return(
	 <div onClick={this.dosearch_history}>
	 	 {this.state.definition}
	 </div>	
    ); 
  }
});
module.exports=Defbox;