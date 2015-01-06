var kse=require("ksana-search");
var kde=require("ksana-database");
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
  	return {result:["馬"],searchtype:"start"};
  },
  indexOfSorted: function (array, obj) { 
    var low = 0,
    high = array.length-1;
    while (low < high) {
      var mid = (low + high) >> 1;
      array[mid] < obj ? low = mid + 1 : high = mid;
    }
    if(array[low] != obj) return null;
    return low;
  },
  dosearch: function(tofind,field) {
    this.setState({tofind:tofind,searchtype:field});
    if(this.state.searchtype=="start"){
      this.search_start(tofind);
    }
    if(this.state.searchtype=="end"){
      
    }
    if(this.state.searchtype=="middle"){
      
    }
    if(this.state.searchtype=="fulltext"){
      this.search_fulltext(tofind);
    }

  },
  search_start: function(tofind) {
    var out=[];
    var index=this.indexOfSorted(this.state.entries,tofind);
    var i=0;
    while(this.state.entries[index+i].indexOf(tofind)==0){
      out.push(this.state.entries[index+i]);
      i++
    }
    this.setState({result:out});
  },
  search_end: function() {

  },
  search_middle: function() {
  
  },
  search_fulltext: function(tofind) {
    kse.search("moedict",tofind,{range:{start:0}},function(err,data){
      that.setState({result:data.excerpt});
    }) 
  },
  render: function() {
    return(
    <div>
      <Searchbar dosearch={this.dosearch} />
      <Overview result={this.state.result} />
      <br></br><br></br>
      <Showtext searchtype={this.state.searchtype} tofind={this.state.tofind} result={this.state.result}/>
    </div>
    );
  }
});
module.exports=maincomponent;