var kse=require("ksana-search");
var kde=require("ksana-database");
var api=require("./api");
var Showtext=require("./showtext.jsx");
var Searchbar=require("./searchbar.jsx");
var Overview=require("./overview.jsx");
var maincomponent = React.createClass({
  getInitialState: function() {
    var that=this;
    kde.open("moedict",function(err,db){
      var entries=db.get("pageNames");
      that.setState({entries:entries});
    });    
  	return {result:["搜尋結果列表"],searchtype:"start",defs:[],entryIndexes:[]};
  },
  dosearch: function(tofind,field) {
    console.log(field);
    this.setState({tofind:tofind,searchtype:field});
    if(field=="start"){
      this.search_start(tofind);
    }
    if(field=="end"){
      this.search_end(tofind);
    }
    if(field=="middle"){
      this.search_middle(tofind);
    }
    if(field=="fulltext"){
      this.search_fulltext(tofind);
    }
  },
  search_start: function(tofind) {
    var out=[];
    var index=api.indexOfSorted(this.state.entries,tofind);
    var i=0;
    while(this.state.entries[index+i].indexOf(tofind)==0){
      out.push([this.state.entries[index+i],parseInt(index)+i]);
      i++;
    }
    this.setState({result:out});
  },
  search_end: function(tofind) {
    var out=[];
    var i=0;
    for(var i=0; i<this.state.entries.length; i++){
      if(this.state.entries[i].indexOf(tofind)==this.state.entries[i].length-1){
        out.push([this.state.entries[i],i]);
      }
    }
    this.setState({result:out});
  },
  search_middle: function(tofind) {
    var out=[];
    var i=0;
    for(var i=0; i<this.state.entries.length; i++){
      var ent=this.state.entries[i];
      if(ent.indexOf(tofind) >-1 && ent.indexOf(tofind)!=0 && ent.indexOf(tofind)!=ent.length-1){
        out.push([this.state.entries[i],i]);
      }
    }
    this.setState({result:out});  
  },
  search_fulltext: function(tofind) {
    var that=this;
    kse.search("moedict",tofind,{range:{start:0}},function(err,data){
      that.setState({result:data.excerpt});
    }) 
  },
  defSearch: function(tofind,reset) {
    if(reset==1) defs=[];
    var that=this;
    var index=api.indexOfSorted(this.state.entries,tofind);
    if(this.state.entries[index]==tofind){
      kde.open("moedict",function(err,db){
        var def=db.get(["fileContents",0,index],function(data){
          defs.push(data);
          that.setState({defs:defs});
          //that.state.defs.push(data);
        });
      });    
    }
    //that.state.entryIndexes.push();
  },
  gotoEntry: function(index) {
    var that=this;
    var defs=[];
    kde.open("moedict",function(err,db){
      //var def=db.get("moedict.fileContents.0."+index);
      var def=db.get(["fileContents",0,index],function(data){
        defs.push(data);
        that.setState({defs:defs});
      });
      that.state.entryIndexes.push(index);
    }); 
  },
  render: function() {
    return(
    <div>
      <Searchbar dosearch={this.dosearch} />
      <Overview result={this.state.result} gotoEntry={this.gotoEntry} />
      <br></br><br></br>
      <Showtext defSearch={this.defSearch} entryIndexes={this.state.entryIndexes} defs={this.state.defs} searchtype={this.state.searchtype} tofind={this.state.tofind} result={this.state.result}/>
    </div>
    );
  }
});
module.exports=maincomponent;