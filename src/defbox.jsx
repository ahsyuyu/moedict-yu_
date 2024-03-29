var Defbox=React.createClass({
  getInitialState: function() {
  	return {definition:[],searchResult:[],tofinds:[]};
  },
  componentWillReceiveProps: function(nextProps) {
    var d=nextProps.defs; //結構為[[def1,entry1],[def2,entry2]...]
    var defs=[];
    this.state.searchResult=[];
    if(d.length!=0) {
      for(var i=0; i<d.length; i++) {
        var t=d[i][0].split("\n");
        var title='<span class="title">'+t[0]+'</span>';
        defs.push(title);
        this.state.searchResult.push([t[0],d[i][1]]);
        for(var j=1; j<t.length; j++) {
          var t1=this.renderDef(t[j],d[i][1]);
          defs.push(t1);
        }
      }
    }
    this.setState({definition:defs});
  },
  renderDef: function(item,e) {
    var parsedItem=item.replace(/./g,function(r){
        return '<span data-entry='+e+'>'+r+'</span>';
      });
    return parsedItem;
  },
  dosearch_history: function(e) {
    var entryIndex=e.target.dataset.entry;
    var tofind=e.target.textContent;
    var next=e.target.nextSibling;
    var tf=this.state.tofinds;
    for(var i=0; i<10; i++){
      if(!next || next.textContent.match(/[。，、「」：]/g)) break;  
      tofind+=next.textContent;
      next=next.nextSibling;
    }
    if(tf.length==0) tf.push(this.state.searchResult[0][0]);
    tf.push(tofind);
    if(entryIndex) {
      this.state.searchResult.map(function(item){item.push(tf[tf.length-2])});
      this.props.pushHistory(this.state.searchResult,entryIndex);
    }
    this.props.dosearch(tofind);
  },
  render: function() {
    return(
	 <div onClick={this.dosearch_history}>
      <div dangerouslySetInnerHTML={{__html: this.state.definition.join("<br>")}} />
	 </div>	
    ); 
  }
});
module.exports=Defbox;