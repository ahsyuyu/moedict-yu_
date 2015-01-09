(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"c:\\ksana2015\\moedict-yu\\index.js":[function(require,module,exports){
var runtime=require("ksana2015-webruntime");
runtime.boot("moedict-yu",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=React.render(Main,document.getElementById("main"));
});
},{"./src/main.jsx":"c:\\ksana2015\\moedict-yu\\src\\main.jsx","ksana2015-webruntime":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\index.js"}],"c:\\ksana2015\\moedict-yu\\src\\api.js":[function(require,module,exports){
var indexOfSorted = function (array, obj) { 
    var low = 0,
    high = array.length-1;
    while (low < high) {
      var mid = (low + high) >> 1;
      array[mid] < obj ? low = mid + 1 : high = mid;
    }
    //if(array[low] != obj) return null;
    return low;
 }

 var test = function(input) {
 	console.log(input);
 }

 var api={test:test,indexOfSorted:indexOfSorted};

module.exports=api;
},{}],"c:\\ksana2015\\moedict-yu\\src\\defbox.jsx":[function(require,module,exports){
var Defbox=React.createClass({displayName: "Defbox",
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
	 React.createElement("div", {onClick: this.dosearch_history}, 
      React.createElement("div", {dangerouslySetInnerHTML: {__html: this.state.definition.join("<br>")}})
	 )	
    ); 
  }
});
module.exports=Defbox;
},{}],"c:\\ksana2015\\moedict-yu\\src\\main.jsx":[function(require,module,exports){
var kse=require("ksana-search");
var kde=require("ksana-database");
var api=require("./api");
var Showtext=require("./showtext.jsx");
var Searchbar=require("./searchbar.jsx");
var Overview=require("./overview.jsx");
var maincomponent = React.createClass({displayName: "maincomponent",
  getInitialState: function() {
    var that=this;
    kde.open("moedict",function(err,db){
      var entries=db.get("segnames");
      that.setState({entries:entries,db:db});
    });    
  	return {entries:[],result:["搜尋結果列表"],searchtype:"start",defs:[]};
  },
  dosearch: function(tofind,field) {
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
    var out=[];
    kse.search("moedict",tofind,{range:{start:0,maxseg:500}},function(err,data){
      out=data.excerpt.map(function(item){return [item.segname,item.seg];});
      that.setState({result:out});
    }) 
    // kse.highlightSeg(this.state.db,0,{q:tofind,nospan:true},function(data){
    //   out=data.excerpt.map(function(item){return [item.segname,item.seg];});
    //   that.setState({result:out});
    // });
  },
  defSearch: function(tofind,reset) {//點選def做搜尋就是用defSearch
    this.setState({tofind:tofind});
    if(reset==1) defs=[];
    var that=this;
    var index=api.indexOfSorted(this.state.entries,tofind);
    if(this.state.entries[index]==tofind){
      kde.open("moedict",function(err,db){
        var def=db.get(["filecontents",0,index],function(data){
          defs.push([data,index]);
          that.setState({defs:defs});
          //that.state.defs.push(data);
        });
      });    
    }
  },
  gotoEntry: function(index) {// 從下拉選單點選的項目or 點searchhistory會用gotoEntry 來顯示def
    var that=this;
    var defs=[];
    kde.open("moedict",function(err,db){
      //var def=db.get("moedict.fileContents.0."+index);
      var def=db.get(["filecontents",0,index],function(data){
        defs.push([data,index]);
        that.setState({defs:defs});
      });
    }); 
  },
  render: function() {
    return(
    React.createElement("div", null, 
      React.createElement(Searchbar, {dosearch: this.dosearch}), 
      React.createElement(Overview, {result: this.state.result, gotoEntry: this.gotoEntry}), 
      React.createElement("br", null), React.createElement("br", null), 
      React.createElement(Showtext, {gotoEntry: this.gotoEntry, defSearch: this.defSearch, defs: this.state.defs, tofind: this.state.tofind, result: this.state.result})
    )
    );
  }
});
module.exports=maincomponent;
},{"./api":"c:\\ksana2015\\moedict-yu\\src\\api.js","./overview.jsx":"c:\\ksana2015\\moedict-yu\\src\\overview.jsx","./searchbar.jsx":"c:\\ksana2015\\moedict-yu\\src\\searchbar.jsx","./showtext.jsx":"c:\\ksana2015\\moedict-yu\\src\\showtext.jsx","ksana-database":"c:\\ksana2015\\node_modules\\ksana-database\\index.js","ksana-search":"c:\\ksana2015\\node_modules\\ksana-search\\index.js"}],"c:\\ksana2015\\moedict-yu\\src\\overview.jsx":[function(require,module,exports){
var Overview=React.createClass({displayName: "Overview",
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
    if(item!="搜尋結果列表") return (React.createElement("option", {value: item[1]}, item[0]));
    else return (React.createElement("option", null, item));
  },
  render: function() {
  	var res=this.props.result || "";
    return(
	React.createElement("div", null, 
    React.createElement("span", {id: "vertical_center", className: "badge"}, res.length), 
		React.createElement("div", {className: "col-sm-2"}, 
			React.createElement("select", {ref: "entryList", className: "form-control", onChange: this.getDefFromEntryId}, 
      this.props.result.map(this.renderResult)
			)
		)
	)	
    ); 
  }
});
module.exports=Overview;
},{}],"c:\\ksana2015\\moedict-yu\\src\\searchbar.jsx":[function(require,module,exports){
var Searchbar=React.createClass({displayName: "Searchbar",
  getInitialState: function() {
  	return {};
  },
  dosearch: function() {
  	var tofind=this.refs.tofind.getDOMNode().value;
    var field=$(this.refs.searchtype.getDOMNode()).find(".active")[0].dataset.type;
    
  	this.props.dosearch(tofind,field);
  },
  render: function() {
    return(
  React.createElement("div", null, 
  	React.createElement("div", null, 
	  React.createElement("div", {className: "col-sm-3"}, 
	    React.createElement("input", {className: "form-control col-sm-1", type: "text", ref: "tofind", placeholder: "請輸入字詞", defaultValue: "月", onKeyDown: this.dosearch, onChange: this.dosearch})
	  ), 
	  React.createElement("br", null), React.createElement("br", null), "    ",     
	  React.createElement("div", {className: "btn-group", "data-toggle": "buttons", ref: "searchtype", onClick: this.dosearch}, 
	    React.createElement("label", {"data-type": "start", className: "btn btn-success active"}, 
	      React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, "頭")
	    ), 
	    React.createElement("label", {"data-type": "end", className: "btn btn-success"}, 
	      React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, "尾")
	    ), 
	    React.createElement("label", {"data-type": "middle", className: "btn btn-success"}, 
	      React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, "中")
	    ), 
	    React.createElement("label", {"data-type": "fulltext", className: "btn btn-success"}, 
	      React.createElement("input", {type: "radio", name: "field", autocomplete: "off"}, "全")
	    )
	  )
	)
  )
    	
    ); 
  }
});
module.exports=Searchbar;
},{}],"c:\\ksana2015\\moedict-yu\\src\\searchhistory.jsx":[function(require,module,exports){
var Searchhistory=React.createClass({displayName: "Searchhistory",
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
	React.createElement("div", {onClick: this.goEntry}, 
		React.createElement("div", {dangerouslySetInnerHTML: {__html: searchhistory}})
	)
    	
    ); 
  }
});
module.exports=Searchhistory;
},{}],"c:\\ksana2015\\moedict-yu\\src\\showtext.jsx":[function(require,module,exports){
var Searchhistory=require("./searchhistory.jsx");
var Defbox=require("./defbox.jsx");
var Showtext=React.createClass({displayName: "Showtext",
  getInitialState: function() {
  	return {entryHistory:[],tofind:""};
  },
  pushHistory: function(searchResult,clickedIndex) {//searchResult [title,titleIndex,tofind]
    var that=this;
    searchResult.map(function(item){
      if(item[1]==clickedIndex) that.state.entryHistory.push(item);
    });
  },
  dosearch: function(tofind) {
    for(var i=1; i<tofind.length; i++){
      var t=tofind.substr(0,i);
      this.props.defSearch(t,i);
    }
  },
  render: function() {
    return (
    React.createElement("div", null, 
    	React.createElement(Searchhistory, {dosearch: this.dosearch, gotoEntry: this.props.gotoEntry, entryHistory: this.state.entryHistory, result: this.props.result}), 
      React.createElement("br", null), 
    	React.createElement(Defbox, {dosearch: this.dosearch, pushHistory: this.pushHistory, defs: this.props.defs, result: this.props.result})	
    )
    );
  }
});
module.exports=Showtext;
},{"./defbox.jsx":"c:\\ksana2015\\moedict-yu\\src\\defbox.jsx","./searchhistory.jsx":"c:\\ksana2015\\moedict-yu\\src\\searchhistory.jsx"}],"c:\\ksana2015\\node_modules\\ksana-analyzer\\configs.js":[function(require,module,exports){
var tokenizers=require('./tokenizers');
var normalizeTbl=null;
var setNormalizeTable=function(tbl,obj) {
	if (!obj) {
		obj={};
		for (var i=0;i<tbl.length;i++) {
			var arr=tbl[i].split("=");
			obj[arr[0]]=arr[1];
		}
	}
	normalizeTbl=obj;
	return obj;
}
var normalize1=function(token) {
	if (!token) return "";
	token=token.replace(/[ \n\.,，。！．「」：；、]/g,'').trim();
	if (!normalizeTbl) return token;
	if (token.length==1) {
		return normalizeTbl[token] || token;
	} else {
		for (var i=0;i<token.length;i++) {
			token[i]=normalizeTbl[token[i]] || token[i];
		}
		return token;
	}
}
var isSkip1=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" || t=="※" || t=="\n");
}
var normalize_tibetan=function(token) {
	return token.replace(/[།་ ]/g,'').trim();
}

var isSkip_tibetan=function(token) {
	var t=token.trim();
	return (t=="" || t=="　" ||  t=="\n");	
}
var simple1={
	func:{
		tokenize:tokenizers.simple
		,setNormalizeTable:setNormalizeTable
		,normalize: normalize1
		,isSkip:	isSkip1
	}
	
}
var tibetan1={
	func:{
		tokenize:tokenizers.tibetan
		,setNormalizeTable:setNormalizeTable
		,normalize:normalize_tibetan
		,isSkip:isSkip_tibetan
	}
}
module.exports={"simple1":simple1,"tibetan1":tibetan1}
},{"./tokenizers":"c:\\ksana2015\\node_modules\\ksana-analyzer\\tokenizers.js"}],"c:\\ksana2015\\node_modules\\ksana-analyzer\\index.js":[function(require,module,exports){
/* 
  custom func for building and searching ydb

  keep all version
  
  getAPI(version); //return hash of functions , if ver is omit , return lastest
	
  postings2Tree      // if version is not supply, get lastest
  tokenize(text,api) // convert a string into tokens(depends on other api)
  normalizeToken     // stemming and etc
  isSpaceChar        // not a searchable token
  isSkipChar         // 0 vpos

  for client and server side
  
*/
var configs=require("./configs");
var config_simple="simple1";
var optimize=function(json,config) {
	config=config||config_simple;
	return json;
}

var getAPI=function(config) {
	config=config||config_simple;
	var func=configs[config].func;
	func.optimize=optimize;
	if (config=="simple1") {
		//add common custom function here
	} else if (config=="tibetan1") {

	} else throw "config "+config +"not supported";

	return func;
}

module.exports={getAPI:getAPI};
},{"./configs":"c:\\ksana2015\\node_modules\\ksana-analyzer\\configs.js"}],"c:\\ksana2015\\node_modules\\ksana-analyzer\\tokenizers.js":[function(require,module,exports){
var tibetan =function(s) {
	//continuous tsheg grouped into same token
	//shad and space grouped into same token
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	var arr=s.split('\n');

	for (var i=0;i<arr.length;i++) {
		var last=0;
		var str=arr[i];
		str.replace(/[།་ ]+/g,function(m,m1){
			tokens.push(str.substring(last,m1)+m);
			offsets.push(offset+last);
			last=m1+m.length;
		});
		if (last<str.length) {
			tokens.push(str.substring(last));
			offsets.push(last);
		}
		if (i===arr.length-1) break;
		tokens.push('\n');
		offsets.push(offset+last);
		offset+=str.length+1;
	}

	return {tokens:tokens,offsets:offsets};
};
var isSpace=function(c) {
	return (c==" ") ;//|| (c==",") || (c==".");
}
var isCJK =function(c) {return ((c>=0x3000 && c<=0x9FFF) 
|| (c>=0xD800 && c<0xDC00) || (c>=0xFF00) ) ;}
var simple1=function(s) {
	var offset=0;
	var tokens=[],offsets=[];
	s=s.replace(/\r\n/g,'\n').replace(/\r/g,'\n');
	arr=s.split('\n');

	var pushtoken=function(t,off) {
		var i=0;
		if (t.charCodeAt(0)>255) {
			while (i<t.length) {
				var c=t.charCodeAt(i);
				offsets.push(off+i);
				tokens.push(t[i]);
				if (c>=0xD800 && c<=0xDFFF) {
					tokens[tokens.length-1]+=t[i]; //extension B,C,D
				}
				i++;
			}
		} else {
			tokens.push(t);
			offsets.push(off);	
		}
	}
	for (var i=0;i<arr.length;i++) {
		var last=0,sp="";
		str=arr[i];
		str.replace(/[_0-9A-Za-z]+/g,function(m,m1){
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last,m1)+m , offset+last);
			offsets.push(offset+last);
			last=m1+m.length;
		});

		if (last<str.length) {
			while (isSpace(sp=str[last]) && last<str.length) {
				tokens[tokens.length-1]+=sp;
				last++;
			}
			pushtoken(str.substring(last), offset+last);
			
		}		
		offsets.push(offset+last);
		offset+=str.length+1;
		if (i===arr.length-1) break;
		tokens.push('\n');
	}

	return {tokens:tokens,offsets:offsets};

};

var simple=function(s) {
	var token='';
	var tokens=[], offsets=[] ;
	var i=0; 
	var lastspace=false;
	var addtoken=function() {
		if (!token) return;
		tokens.push(token);
		offsets.push(i);
		token='';
	}
	while (i<s.length) {
		var c=s.charAt(i);
		var code=s.charCodeAt(i);
		if (isCJK(code)) {
			addtoken();
			token=c;
			if (code>=0xD800 && code<0xDC00) { //high sorragate
				token+=s.charAt(i+1);i++;
			}
			addtoken();
		} else {
			if (c=='&' || c=='<' || c=='?' || c=="," || c=="."
			|| c=='|' || c=='~' || c=='`' || c==';' 
			|| c=='>' || c==':' 
			|| c=='=' || c=='@'  || c=="-" 
			|| c==']' || c=='}'  || c==")" 
			//|| c=='{' || c=='}'|| c=='[' || c==']' || c=='(' || c==')'
			|| code==0xf0b || code==0xf0d // tibetan space
			|| (code>=0x2000 && code<=0x206f)) {
				addtoken();
				if (c=='&' || c=='<'){ // || c=='{'|| c=='('|| c=='[') {
					var endchar='>';
					if (c=='&') endchar=';'
					//else if (c=='{') endchar='}';
					//else if (c=='[') endchar=']';
					//else if (c=='(') endchar=')';

					while (i<s.length && s.charAt(i)!=endchar) {
						token+=s.charAt(i);
						i++;
					}
					token+=endchar;
					addtoken();
				} else {
					token=c;
					addtoken();
				}
				token='';
			} else {
				if (c==" ") {
					token+=c;
					lastspace=true;
				} else {
					if (lastspace) addtoken();
					lastspace=false;
					token+=c;
				}
			}
		}
		i++;
	}
	addtoken();
	return {tokens:tokens,offsets:offsets};
}
module.exports={simple:simple,tibetan:tibetan};
},{}],"c:\\ksana2015\\node_modules\\ksana-database\\bsearch.js":[function(require,module,exports){
var indexOfSorted = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};
var indexOfSorted_str = function (array, obj, near) { 
  var low = 0,
  high = array.length;
  while (low < high) {
    var mid = (low + high) >> 1;
    if (array[mid]==obj) return mid;
    (array[mid].localeCompare(obj)<0) ? low = mid + 1 : high = mid;
  }
  if (near) return low;
  else if (array[low]==obj) return low;else return -1;
};


var bsearch=function(array,value,near) {
	var func=indexOfSorted;
	if (typeof array[0]=="string") func=indexOfSorted_str;
	return func(array,value,near);
}
var bsearchNear=function(array,value) {
	return bsearch(array,value,true);
}

module.exports=bsearch;//{bsearchNear:bsearchNear,bsearch:bsearch};
},{}],"c:\\ksana2015\\node_modules\\ksana-database\\index.js":[function(require,module,exports){
var KDE=require("./kde");
//currently only support node.js fs, ksanagap native fs, html5 file system
//use socket.io to read kdb from remote server in future
module.exports=KDE;
},{"./kde":"c:\\ksana2015\\node_modules\\ksana-database\\kde.js"}],"c:\\ksana2015\\node_modules\\ksana-database\\kde.js":[function(require,module,exports){
/* Ksana Database Engine

   2015/1/2 , 
   move to ksana-database
   simplified by removing document support and socket.io support


*/
var pool={},localPool={};
var apppath="";
var bsearch=require("./bsearch");
var Kdb=require('ksana-jsonrom');
var kdbs=[]; //available kdb , id and absolute path
var strsep="\uffff";
var kdblisted=false;
/*
var _getSync=function(paths,opts) {
	var out=[];
	for (var i in paths) {
		out.push(this.getSync(paths[i],opts));	
	}
	return out;
}
*/
var _gets=function(paths,opts,cb) { //get many data with one call

	if (!paths) return ;
	if (typeof paths=='string') {
		paths=[paths];
	}
	var engine=this, output=[];

	var makecb=function(path){
		return function(data){
				if (!(data && typeof data =='object' && data.__empty)) output.push(data);
				engine.get(path,opts,taskqueue.shift());
		};
	};

	var taskqueue=[];
	for (var i=0;i<paths.length;i++) {
		if (typeof paths[i]=="null") { //this is only a place holder for key data already in client cache
			output.push(null);
		} else {
			taskqueue.push(makecb(paths[i]));
		}
	};

	taskqueue.push(function(data){
		output.push(data);
		cb.apply(engine.context||engine,[output,paths]); //return to caller
	});

	taskqueue.shift()({__empty:true}); //run the task
}

var getFileRange=function(i) {
	var engine=this;

	var filesegcount=engine.get(["filesegcount"]);
	if (filesegcount) {
		if (i==0) {
			return {start:0,end:filesegcount[0]-1};
		} else {
			return {start:filesegcount[i-1],end:filesegcount[i]-1};
		}
	}
	//old buggy code
	var filenames=engine.get(["filenames"]);
	var fileoffsets=engine.get(["fileoffsets"]);
	var segoffsets=engine.get(["segoffsets"]);
	var segnames=engine.get(["segnames"]);
	var filestart=fileoffsets[i], fileend=fileoffsets[i+1]-1;

	var start=bsearch(segoffsets,filestart,true);
	//if (segOffsets[start]==fileStart) start--;
	
	//work around for jiangkangyur
	while (segNames[start+1]=="_") start++;

  //if (i==0) start=0; //work around for first file
	var end=bsearch(segoffsets,fileend,true);
	return {start:start,end:end};
}

var getfileseg=function(absoluteseg) {
	var fileoffsets=this.get(["fileoffsets"]);
	var segoffsets=this.get(["segoffsets"]);
	var segoffset=segOffsets[absoluteseg];
	var file=bsearch(fileOffsets,segoffset,true)-1;

	var fileStart=fileoffsets[file];
	var start=bsearch(segoffsets,fileStart,true);	

	var seg=absoluteseg-start-1;
	return {file:file,seg:seg};
}
//return array of object of nfile nseg given segname
var findSeg=function(segname) {
	var segnames=this.get("segnames");
	var out=[];
	for (var i=0;i<segnames.length;i++) {
		if (segnames[i]==segname) {
			var fileseg=getfileseg.apply(this,[i]);
			out.push({file:fileseg.file,seg:fileseg.seg,absseg:i});
		}
	}
	return out;
}
var getFileSegOffsets=function(i) {
	var segoffsets=this.get("segoffsets");
	var range=getFileRange.apply(this,[i]);
	return segoffsets.slice(range.start,range.end+1);
}

var getFileSegNames=function(i) {
	var range=getFileRange.apply(this,[i]);
	var segnames=this.get("segnames");
	return segnames.slice(range.start,range.end+1);
}
var localengine_get=function(path,opts,cb) {
	var engine=this;
	if (typeof opts=="function") {
		cb=opts;
		opts={recursive:false};
	}
	if (!path) {
		if (cb) cb(null);
		return null;
	}

	if (typeof cb!="function") {
		return engine.kdb.get(path,opts);
	}

	if (typeof path=="string") {
		return engine.kdb.get([path],opts,cb);
	} else if (typeof path[0] =="string") {
		return engine.kdb.get(path,opts,cb);
	} else if (typeof path[0] =="object") {
		return _gets.apply(engine,[path,opts,cb]);
	} else {
		engine.kdb.get([],opts,function(data){
			cb(data[0]);//return top level keys
		});
	}
};	

var getPreloadField=function(user) {
	var preload=[["meta"],["filenames"],["fileoffsets"],["segnames"],["segoffsets"],["filesegcount"]];
	//["tokens"],["postingslen"] kse will load it
	if (user && user.length) { //user supply preload
		for (var i=0;i<user.length;i++) {
			if (preload.indexOf(user[i])==-1) {
				preload.push(user[i]);
			}
		}
	}
	return preload;
}
var createLocalEngine=function(kdb,opts,cb,context) {
	var engine={kdb:kdb, queryCache:{}, postingCache:{}, cache:{}};

	if (typeof context=="object") engine.context=context;
	engine.get=localengine_get;

	engine.segOffset=segOffset;
	engine.fileOffset=fileOffset;
	engine.getFileSegNames=getFileSegNames;
	engine.getFileSegOffsets=getFileSegOffsets;
	engine.getFileRange=getFileRange;
	engine.findSeg=findSeg;
	//only local engine allow getSync
	//if (kdb.fs.getSync) engine.getSync=engine.kdb.getSync;
	
	//speedy native functions
	if (kdb.fs.mergePostings) {
		engine.mergePostings=kdb.fs.mergePostings.bind(kdb.fs);
	}
	
	var setPreload=function(res) {
		engine.dbname=res[0].name;
		//engine.customfunc=customfunc.getAPI(res[0].config);
		engine.ready=true;
	}

	var preload=getPreloadField(opts.preload);
	var opts={recursive:true};
	//if (typeof cb=="function") {
		_gets.apply(engine,[ preload, opts,function(res){
			setPreload(res);
			cb.apply(engine.context,[engine]);
		}]);
	//} else {
	//	setPreload(_getSync.apply(engine,[preload,opts]));
	//}
	return engine;
}

var segOffset=function(segname) {
	var engine=this;
	if (arguments.length>1) throw "argument : segname ";

	var segNames=engine.get("segnames");
	var segOffsets=engine.get("segoffsets");

	var i=segNames.indexOf(segname);
	return (i>-1)?segOffsets[i]:0;
}
var fileOffset=function(fn) {
	var engine=this;
	var filenames=engine.get("filenames");
	var offsets=engine.get("fileoffsets");
	var i=filenames.indexOf(fn);
	if (i==-1) return null;
	return {start: offsets[i], end:offsets[i+1]};
}

var folderOffset=function(folder) {
	var engine=this;
	var start=0,end=0;
	var filenames=engine.get("filenames");
	var offsets=engine.get("fileoffsets");
	for (var i=0;i<filenames.length;i++) {
		if (filenames[i].substring(0,folder.length)==folder) {
			if (!start) start=offsets[i];
			end=offsets[i];
		} else if (start) break;
	}
	return {start:start,end:end};
}

 //TODO delete directly from kdb instance
 //kdb.free();
var closeLocal=function(kdbid) {
	var engine=localPool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete localPool[kdbid];
	}
}
var close=function(kdbid) {
	var engine=pool[kdbid];
	if (engine) {
		engine.kdb.free();
		delete pool[kdbid];
	}
}

var getLocalTries=function(kdbfn) {
	if (!kdblisted) {
		kdbs=require("./listkdb")();
		kdblisted=true;
	}

	var kdbid=kdbfn.replace('.kdb','');
	var tries= ["./"+kdbid+".kdb"
	           ,"../"+kdbid+".kdb"
	];

	for (var i=0;i<kdbs.length;i++) {
		if (kdbs[i][0]==kdbid) {
			tries.push(kdbs[i][1]);
		}
	}
	return tries;
}
var openLocalKsanagap=function(kdbid,opts,cb,context) {
	var kdbfn=kdbid;
	var tries=getLocalTries(kdbfn);

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {
			//console.log("kdb path: "+nodeRequire('path').resolve(tries[i]));
			var kdb=new Kdb.open(tries[i],function(err,kdb){
				if (err) {
					cb.apply(context,[err]);
				} else {
					createLocalEngine(kdb,opts,function(engine){
						localPool[kdbid]=engine;
						cb.apply(context||engine.context,[0,engine]);
					},context);
				}
			});
			return null;
		}
	}
	if (cb) cb.apply(context,[kdbid+" not found"]);
	return null;

}
var openLocalNode=function(kdbid,opts,cb,context) {
	var fs=require('fs');
	var tries=getLocalTries(kdbid);

	for (var i=0;i<tries.length;i++) {
		if (fs.existsSync(tries[i])) {

			new Kdb.open(tries[i],function(err,kdb){
				if (err) {
					cb.apply(context||engine.content,[err]);
				} else {
					createLocalEngine(kdb,opts,function(engine){
							localPool[kdbid]=engine;
							cb.apply(context||engine.context,[0,engine]);
					},context);
				}
			});
			return null;
		}
	}
	if (cb) cb.apply(context,[kdbid+" not found"]);
	return null;
}

var openLocalHtml5=function(kdbid,opts,cb,context) {	
	var engine=localPool[kdbid];
	var kdbfn=kdbid;
	if (kdbfn.indexOf(".kdb")==-1) kdbfn+=".kdb";
	new Kdb.open(kdbfn,function(err,handle){
		if (err) {
			cb.apply(context,[err]);
		} else {
			createLocalEngine(handle,opts,function(engine){
				localPool[kdbid]=engine;
				cb.apply(context||engine.context,[0,engine]);
			},context);
		}
	});
}
//omit cb for syncronize open
var openLocal=function(kdbid,opts,cb,context)  {
	if (typeof opts=="function") { //no opts
		if (typeof cb=="object") context=cb;
		cb=opts;
		opts={};
	}

	var engine=localPool[kdbid];
	if (engine) {
		if (cb) cb.apply(context||engine.context,[0,engine]);
		return engine;
	}

	var platform=require("./platform").getPlatform();
	if (platform=="node-webkit" || platform=="node") {
		openLocalNode(kdbid,opts,cb,context);
	} else if (platform=="html5" || platform=="chrome"){
		openLocalHtml5(kdbid,opts,cb,context);		
	} else {
		openLocalKsanagap(kdbid,opts,cb,context);	
	}
}
var setPath=function(path) {
	apppath=path;
	console.log("set path",path)
}

var enumKdb=function(cb,context){
	return kdbs.map(function(k){return k[0]});
}

module.exports={open:openLocal,setPath:setPath, close:closeLocal, enumKdb:enumKdb};
},{"./bsearch":"c:\\ksana2015\\node_modules\\ksana-database\\bsearch.js","./listkdb":"c:\\ksana2015\\node_modules\\ksana-database\\listkdb.js","./platform":"c:\\ksana2015\\node_modules\\ksana-database\\platform.js","fs":false,"ksana-jsonrom":"c:\\ksana2015\\node_modules\\ksana-jsonrom\\index.js"}],"c:\\ksana2015\\node_modules\\ksana-database\\listkdb.js":[function(require,module,exports){
/* return array of dbid and absolute path*/
var listkdb_html5=function() {
	throw "not implement yet";
	require("ksana-jsonrom").html5fs.readdir(function(kdbs){
			cb.apply(this,[kdbs]);
	},context||this);		

}

var listkdb_node=function(){
	var fs=require("fs");
	var path=require("path")
	var parent=path.resolve(process.cwd(),"..");
	var files=fs.readdirSync(parent);
	var output=[];
	files.map(function(f){
		var subdir=parent+path.sep+f;
		var stat=fs.statSync(subdir );
		if (stat.isDirectory()) {
			var subfiles=fs.readdirSync(subdir);
			for (var i=0;i<subfiles.length;i++) {
				var file=subfiles[i];
				var idx=file.indexOf(".kdb");
				if (idx>-1&&idx==file.length-4) {
					output.push([ file.substr(0,file.length-4), subdir+path.sep+file]);
				}
			}
		}
	})
	return output;
}
var fileNameOnly=function(fn) {
	var at=fn.lastIndexOf("/");
	if (at>-1) return fn.substr(at+1);
	return fn;
}
var listkdb_ksanagap=function() {
	var output=[];
	var apps=JSON.parse(kfs.listApps());
	for (var i=0;i<apps.length;i++) {
		var app=apps[i];
		if (app.files) for (var j=0;j<app.files.length;j++) {
			var file=app.files[j];
			if (file.substr(file.length-4)==".kdb") {
				output.push([app.dbid,fileNameOnly(file)]);
			}
		}
	};
	return output;
}
var listkdb=function() {
	var platform=require("./platform").getPlatform();
	var files=[];
	if (platform=="node" || platform=="node-webkit") {
		files=listkdb_node();
	} else if (typeof kfs!="undefined") {
		files=listkdb_ksanagap();
	} else {
		throw "not implement yet";
	}
	return files;
}
module.exports=listkdb;
},{"./platform":"c:\\ksana2015\\node_modules\\ksana-database\\platform.js","fs":false,"ksana-jsonrom":"c:\\ksana2015\\node_modules\\ksana-jsonrom\\index.js","path":false}],"c:\\ksana2015\\node_modules\\ksana-database\\platform.js":[function(require,module,exports){
var getPlatform=function() {
	if (typeof ksanagap=="undefined") {
		platform="node";
	} else {
		platform=ksanagap.platform;
	}
	return platform;
}
module.exports={getPlatform:getPlatform};
},{}],"c:\\ksana2015\\node_modules\\ksana-jsonrom\\html5read.js":[function(require,module,exports){

/* emulate filesystem on html5 browser */
/* emulate filesystem on html5 browser */
var read=function(handle,buffer,offset,length,position,cb) {//buffer and offset is not used
	var xhr = new XMLHttpRequest();
	xhr.open('GET', handle.url , true);
	var range=[position,length+position-1];
	xhr.setRequestHeader('Range', 'bytes='+range[0]+'-'+range[1]);
	xhr.responseType = 'arraybuffer';
	xhr.send();
	xhr.onload = function(e) {
		var that=this;
		setTimeout(function(){
			cb(0,that.response.byteLength,that.response);
		},0);
	}; 
}
var close=function(handle) {}
var fstatSync=function(handle) {
	throw "not implement yet";
}
var fstat=function(handle,cb) {
	throw "not implement yet";
}
var _open=function(fn_url,cb) {
		var handle={};
		if (fn_url.indexOf("filesystem:")==0){
			handle.url=fn_url;
			handle.fn=fn_url.substr( fn_url.lastIndexOf("/")+1);
		} else {
			handle.fn=fn_url;
			var url=API.files.filter(function(f){ return (f[0]==fn_url)});
			if (url.length) handle.url=url[0][1];
			else cb(null);
		}
		cb(handle);
}
var open=function(fn_url,cb) {
		if (!API.initialized) {init(1024*1024,function(){
			_open.apply(this,[fn_url,cb]);
		},this)} else _open.apply(this,[fn_url,cb]);
}
var load=function(filename,mode,cb) {
	open(filename,mode,cb,true);
}
function errorHandler(e) {
	console.error('Error: ' +e.name+ " "+e.message);
}
var readdir=function(cb,context) {
	 var dirReader = API.fs.root.createReader();
	 var out=[],that=this;
		dirReader.readEntries(function(entries) {
			if (entries.length) {
				for (var i = 0, entry; entry = entries[i]; ++i) {
					if (entry.isFile) {
						out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
					}
				}
			}
			API.files=out;
			if (cb) cb.apply(context,[out]);
		}, function(){
			if (cb) cb.apply(context,[null]);
		});
}
var initfs=function(grantedBytes,cb,context) {
	webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
		API.fs=fs;
		API.quota=grantedBytes;
		readdir(function(){
			API.initialized=true;
			cb.apply(context,[grantedBytes,fs]);
		},context);
	}, errorHandler);
}
var init=function(quota,cb,context) {
	navigator.webkitPersistentStorage.requestQuota(quota, 
			function(grantedBytes) {
				initfs(grantedBytes,cb,context);
		}, errorHandler 
	);
}
var API={
	read:read
	,readdir:readdir
	,open:open
	,close:close
	,fstatSync:fstatSync
	,fstat:fstat
}
module.exports=API;
},{}],"c:\\ksana2015\\node_modules\\ksana-jsonrom\\index.js":[function(require,module,exports){
module.exports={
	open:require("./kdb")
}

},{"./kdb":"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdb.js"}],"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdb.js":[function(require,module,exports){
/*
	KDB version 3.0 GPL
	yapcheahshen@gmail.com
	2013/12/28
	asyncronize version of yadb

  remove dependency of Q, thanks to
  http://stackoverflow.com/questions/4234619/how-to-avoid-long-nesting-of-asynchronous-functions-in-node-js

  2015/1/2
  moved to ksanaforge/ksana-jsonrom
  add err in callback for node.js compliant
*/
var Kfs=null;

if (typeof ksanagap=="undefined") {
	Kfs=require('./kdbfs');			
} else {
	if (ksanagap.platform=="ios") {
		Kfs=require("./kdbfs_ios");
	} else if (ksanagap.platform=="node-webkit") {
		Kfs=require("./kdbfs");
	} else if (ksanagap.platform=="chrome") {
		Kfs=require("./kdbfs");
	} else {
		Kfs=require("./kdbfs_android");
	}
		
}


var DT={
	uint8:'1', //unsigned 1 byte integer
	int32:'4', // signed 4 bytes integer
	utf8:'8',  
	ucs2:'2',
	bool:'^', 
	blob:'&',
	utf8arr:'*', //shift of 8
	ucs2arr:'@', //shift of 2
	uint8arr:'!', //shift of 1
	int32arr:'$', //shift of 4
	vint:'`',
	pint:'~',	

	array:'\u001b',
	object:'\u001a' 
	//ydb start with object signature,
	//type a ydb in command prompt shows nothing
}
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;
var strsep="\uffff";
var Create=function(path,opts,cb) {
	/* loadxxx functions move file pointer */
	// load variable length int
	if (typeof opts=="function") {
		cb=opts;
		opts={};
	}

	
	var loadVInt =function(opts,blocksize,count,cb) {
		//if (count==0) return [];
		var that=this;

		this.fs.readBuf_packedint(opts.cur,blocksize,count,true,function(o){
			//console.log("vint");
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	var loadVInt1=function(opts,cb) {
		var that=this;
		loadVInt.apply(this,[opts,6,1,function(data){
			//console.log("vint1");
			cb.apply(that,[data[0]]);
		}])
	}
	//for postings
	var loadPInt =function(opts,blocksize,count,cb) {
		var that=this;
		this.fs.readBuf_packedint(opts.cur,blocksize,count,false,function(o){
			//console.log("pint");
			opts.cur+=o.adv;
			cb.apply(that,[o.data]);
		});
	}
	// item can be any type (variable length)
	// maximum size of array is 1TB 2^40
	// structure:
	// signature,5 bytes offset, payload, itemlengths
	var getArrayLength=function(opts,cb) {
		var that=this;
		var dataoffset=0;

		this.fs.readUI8(opts.cur,function(len){
			var lengthoffset=len*4294967296;
			opts.cur++;
			that.fs.readUI32(opts.cur,function(len){
				opts.cur+=4;
				dataoffset=opts.cur; //keep this
				lengthoffset+=len;
				opts.cur+=lengthoffset;

				loadVInt1.apply(that,[opts,function(count){
					loadVInt.apply(that,[opts,count*6,count,function(sz){						
						cb({count:count,sz:sz,offset:dataoffset});
					}]);
				}]);
				
			});
		});
	}

	var loadArray = function(opts,blocksize,cb) {
		var that=this;
		getArrayLength.apply(this,[opts,function(L){
				var o=[];
				var endcur=opts.cur;
				opts.cur=L.offset;

				if (opts.lazy) { 
						var offset=L.offset;
						L.sz.map(function(sz){
							o[o.length]=strsep+offset.toString(16)
								   +strsep+sz.toString(16);
							offset+=sz;
						})
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											 //not pushing the first call
										}	else o.push(data);
										opts.blocksize=sz;
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i])
						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o.push(data);
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}

				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}
		])
	}		
	// item can be any type (variable length)
	// support lazy load
	// structure:
	// signature,5 bytes offset, payload, itemlengths, 
	//                    stringarray_signature, keys
	var loadObject = function(opts,blocksize,cb) {
		var that=this;
		var start=opts.cur;
		getArrayLength.apply(this,[opts,function(L) {
			opts.blocksize=blocksize-opts.cur+start;
			load.apply(that,[opts,function(keys){ //load the keys
				if (opts.keys) { //caller ask for keys
					keys.map(function(k) { opts.keys.push(k)});
				}

				var o={};
				var endcur=opts.cur;
				opts.cur=L.offset;
				if (opts.lazy) { 
					var offset=L.offset;
					for (var i=0;i<L.sz.length;i++) {
						//prefix with a \0, impossible for normal string
						o[keys[i]]=strsep+offset.toString(16)
							   +strsep+L.sz[i].toString(16);
						offset+=L.sz[i];
					}
				} else {
					var taskqueue=[];
					for (var i=0;i<L.count;i++) {
						taskqueue.push(
							(function(sz,key){
								return (
									function(data){
										if (typeof data=='object' && data.__empty) {
											//not saving the first call;
										} else {
											o[key]=data; 
										}
										opts.blocksize=sz;
										if (verbose) readLog("key",key);
										load.apply(that,[opts, taskqueue.shift()]);
									}
								);
							})(L.sz[i],keys[i-1])

						);
					}
					//last call to child load
					taskqueue.push(function(data){
						o[keys[keys.length-1]]=data;
						opts.cur=endcur;
						cb.apply(that,[o]);
					});
				}
				if (opts.lazy) cb.apply(that,[o]);
				else {
					taskqueue.shift()({__empty:true});
				}
			}]);
		}]);
	}

	//item is same known type
	var loadStringArray=function(opts,blocksize,encoding,cb) {
		var that=this;
		this.fs.readStringArray(opts.cur,blocksize,encoding,function(o){
			opts.cur+=blocksize;
			cb.apply(that,[o]);
		});
	}
	var loadIntegerArray=function(opts,blocksize,unitsize,cb) {
		var that=this;
		loadVInt1.apply(this,[opts,function(count){
			var o=that.fs.readFixedArray(opts.cur,count,unitsize,function(o){
				opts.cur+=count*unitsize;
				cb.apply(that,[o]);
			});
		}]);
	}
	var loadBlob=function(blocksize,cb) {
		var o=this.fs.readBuf(this.cur,blocksize);
		this.cur+=blocksize;
		return o;
	}	
	var loadbysignature=function(opts,signature,cb) {
		  var blocksize=opts.blocksize||this.fs.size; 
			opts.cur+=this.fs.signature_size;
			var datasize=blocksize-this.fs.signature_size;
			//basic types
			if (signature===DT.int32) {
				opts.cur+=4;
				this.fs.readI32(opts.cur-4,cb);
			} else if (signature===DT.uint8) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,cb);
			} else if (signature===DT.utf8) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'utf8',cb);
			} else if (signature===DT.ucs2) {
				var c=opts.cur;opts.cur+=datasize;
				this.fs.readString(c,datasize,'ucs2',cb);	
			} else if (signature===DT.bool) {
				opts.cur++;
				this.fs.readUI8(opts.cur-1,function(data){cb(!!data)});
			} else if (signature===DT.blob) {
				loadBlob(datasize,cb);
			}
			//variable length integers
			else if (signature===DT.vint) {
				loadVInt.apply(this,[opts,datasize,datasize,cb]);
			}
			else if (signature===DT.pint) {
				loadPInt.apply(this,[opts,datasize,datasize,cb]);
			}
			//simple array
			else if (signature===DT.utf8arr) {
				loadStringArray.apply(this,[opts,datasize,'utf8',cb]);
			}
			else if (signature===DT.ucs2arr) {
				loadStringArray.apply(this,[opts,datasize,'ucs2',cb]);
			}
			else if (signature===DT.uint8arr) {
				loadIntegerArray.apply(this,[opts,datasize,1,cb]);
			}
			else if (signature===DT.int32arr) {
				loadIntegerArray.apply(this,[opts,datasize,4,cb]);
			}
			//nested structure
			else if (signature===DT.array) {
				loadArray.apply(this,[opts,datasize,cb]);
			}
			else if (signature===DT.object) {
				loadObject.apply(this,[opts,datasize,cb]);
			}
			else {
				console.error('unsupported type',signature,opts)
				cb.apply(this,[null]);//make sure it return
				//throw 'unsupported type '+signature;
			}
	}

	var load=function(opts,cb) {
		opts=opts||{}; // this will served as context for entire load procedure
		opts.cur=opts.cur||0;
		var that=this;
		this.fs.readSignature(opts.cur, function(signature){
			loadbysignature.apply(that,[opts,signature,cb])
		});
		return this;
	}
	var CACHE=null;
	var KEY={};
	var ADDRESS={};
	var reset=function(cb) {
		if (!CACHE) {
			load.apply(this,[{cur:0,lazy:true},function(data){
				CACHE=data;
				cb.call(this);
			}]);	
		} else {
			cb.call(this);
		}
	}

	var exists=function(path,cb) {
		if (path.length==0) return true;
		var key=path.pop();
		var that=this;
		get.apply(this,[path,false,function(data){
			if (!path.join(strsep)) return (!!KEY[key]);
			var keys=KEY[path.join(strsep)];
			path.push(key);//put it back
			if (keys) cb.apply(that,[keys.indexOf(key)>-1]);
			else cb.apply(that,[false]);
		}]);
	}

	var getSync=function(path) {
		if (!CACHE) return undefined;	
		var o=CACHE;
		for (var i=0;i<path.length;i++) {
			var r=o[path[i]];
			if (typeof r=="undefined") return null;
			o=r;
		}
		return o;
	}
	var get=function(path,opts,cb) {
		if (typeof path=='undefined') path=[];
		if (typeof path=="string") path=[path];
		//opts.recursive=!!opts.recursive;
		if (typeof opts=="function") {
			cb=opts;node
			opts={};
		}
		var that=this;
		if (typeof cb!='function') return getSync(path);

		reset.apply(this,[function(){
			var o=CACHE;
			if (path.length==0) {
				if (opts.address) {
					cb([0,that.fs.size]);
				} else {
					cb([Object.keys(CACHE)]);
				}
				return;
			} 
			
			var pathnow="",taskqueue=[],newopts={},r=null;
			var lastkey="";

			for (var i=0;i<path.length;i++) {
				var task=(function(key,k){

					return (function(data){
						if (!(typeof data=='object' && data.__empty)) {
							if (typeof o[lastkey]=='string' && o[lastkey][0]==strsep) o[lastkey]={};
							o[lastkey]=data; 
							o=o[lastkey];
							r=data[key];
							KEY[pathnow]=opts.keys;								
						} else {
							data=o[key];
							r=data;
						}

						if (typeof r==="undefined") {
							taskqueue=null;
							cb.apply(that,[r]); //return empty value
						} else {							
							if (parseInt(k)) pathnow+=strsep;
							pathnow+=key;
							if (typeof r=='string' && r[0]==strsep) { //offset of data to be loaded
								var p=r.substring(1).split(strsep).map(function(item){return parseInt(item,16)});
								var cur=p[0],sz=p[1];
								newopts.lazy=!opts.recursive || (k<path.length-1) ;
								newopts.blocksize=sz;newopts.cur=cur,newopts.keys=[];
								lastkey=key; //load is sync in android
								if (opts.address && taskqueue.length==1) {
									ADDRESS[pathnow]=[cur,sz];
									taskqueue.shift()(null,ADDRESS[pathnow]);
								} else {
									load.apply(that,[newopts, taskqueue.shift()]);
								}
							} else {
								if (opts.address && taskqueue.length==1) {
									taskqueue.shift()(null,ADDRESS[pathnow]);
								} else {
									taskqueue.shift().apply(that,[r]);
								}
							}
						}
					})
				})
				(path[i],i);
				
				taskqueue.push(task);
			}

			if (taskqueue.length==0) {
				cb.apply(that,[o]);
			} else {
				//last call to child load
				taskqueue.push(function(data,cursz){
					if (opts.address) {
						cb.apply(that,[cursz]);
					} else{
						var key=path[path.length-1];
						o[key]=data; KEY[pathnow]=opts.keys;
						cb.apply(that,[data]);
					}
				});
				taskqueue.shift()({__empty:true});			
			}

		}]); //reset
	}
	// get all keys in given path
	var getkeys=function(path,cb) {
		if (!path) path=[]
		var that=this;

		get.apply(this,[path,false,function(){
			if (path && path.length) {
				cb.apply(that,[KEY[path.join(strsep)]]);
			} else {
				cb.apply(that,[Object.keys(CACHE)]); 
				//top level, normally it is very small
			}
		}]);
	}

	var setupapi=function() {
		this.load=load;
//		this.cur=0;
		this.cache=function() {return CACHE};
		this.key=function() {return KEY};
		this.free=function() {
			CACHE=null;
			KEY=null;
			this.fs.free();
		}
		this.setCache=function(c) {CACHE=c};
		this.keys=getkeys;
		this.get=get;   // get a field, load if needed
		this.exists=exists;
		this.DT=DT;
		
		//install the sync version for node
		//if (typeof process!="undefined") require("./kdb_sync")(this);
		//if (cb) setTimeout(cb.bind(this),0);
		var that=this;
		var err=0;
		if (cb) {
			setTimeout(function(){
				cb(err,that);	
			},0);
		}
	}
	var that=this;
	var kfs=new Kfs(path,opts,function(err){
		if (err) {
			setTimeout(function(){
				cb(err,0);
			},0);
			return null;
		} else {
			that.size=this.size;
			setupapi.call(that);			
		}
	});
	this.fs=kfs;
	return this;
}

Create.datatypes=DT;

if (module) module.exports=Create;
//return Create;

},{"./kdbfs":"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdbfs.js","./kdbfs_android":"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdbfs_android.js","./kdbfs_ios":"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdbfs_ios.js"}],"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdbfs.js":[function(require,module,exports){
/* node.js and html5 file system abstraction layer*/
try {
	var fs=require("fs");
	var Buffer=require("buffer").Buffer;
} catch (e) {
	var fs=require('./html5read');
	var Buffer=function(){ return ""};
	var html5fs=true; 	
}
var signature_size=1;
var verbose=0, readLog=function(){};
var _readLog=function(readtype,bytes) {
	console.log(readtype,bytes,"bytes");
}
if (verbose) readLog=_readLog;

var unpack_int = function (ar, count , reset) {
   count=count||ar.length;
  var r = [], i = 0, v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;	  
	} while (ar[++i] & 0x80);
	r.push(v); if (reset) v=0;
	count--;
  } while (i<ar.length && count);
  return {data:r, adv:i };
}
var Open=function(path,opts,cb) {
	opts=opts||{};

	var readSignature=function(pos,cb) {
		var buf=new Buffer(signature_size);
		var that=this;
		fs.read(this.handle,buf,0,signature_size,pos,function(err,len,buffer){
			if (html5fs) var signature=String.fromCharCode((new Uint8Array(buffer))[0])
			else var signature=buffer.toString('utf8',0,signature_size);
			cb.apply(that,[signature]);
		});
	}

	//this is quite slow
	//wait for StringView +ArrayBuffer to solve the problem
	//https://groups.google.com/a/chromium.org/forum/#!topic/blink-dev/ylgiNY_ZSV0
	//if the string is always ucs2
	//can use Uint16 to read it.
	//http://updates.html5rocks.com/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
	var decodeutf8 = function (utftext) {
		var string = "";
		var i = 0;
		var c=0,c1 = 0, c2 = 0 , c3=0;
		for (var i=0;i<utftext.length;i++) {
			if (utftext.charCodeAt(i)>127) break;
		}
		if (i>=utftext.length) return utftext;

		while ( i < utftext.length ) {
			c = utftext.charCodeAt(i);
			if (c < 128) {
				string += utftext[i];
				i++;
			} else if((c > 191) && (c < 224)) {
				c2 = utftext.charCodeAt(i+1);
				string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
				i += 2;
			} else {
				c2 = utftext.charCodeAt(i+1);
				c3 = utftext.charCodeAt(i+2);
				string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
				i += 3;
			}
		}
		return string;
	}

	var readString= function(pos,blocksize,encoding,cb) {
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		var that=this;
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
			readLog("string",len);
			if (html5fs) {
				if (encoding=='utf8') {
					var str=decodeutf8(String.fromCharCode.apply(null, new Uint8Array(buffer)))
				} else { //ucs2 is 3 times faster
					var str=String.fromCharCode.apply(null, new Uint16Array(buffer))	
				}
				
				cb.apply(that,[str]);
			} 
			else cb.apply(that,[buffer.toString(encoding)]);	
		});
	}

	//work around for chrome fromCharCode cannot accept huge array
	//https://code.google.com/p/chromium/issues/detail?id=56588
	var buf2stringarr=function(buf,enc) {
		if (enc=="utf8") 	var arr=new Uint8Array(buf);
		else var arr=new Uint16Array(buf);
		var i=0,codes=[],out=[],s="";
		while (i<arr.length) {
			if (arr[i]) {
				codes[codes.length]=arr[i];
			} else {
				s=String.fromCharCode.apply(null,codes);
				if (enc=="utf8") out[out.length]=decodeutf8(s);
				else out[out.length]=s;
				codes=[];				
			}
			i++;
		}
		
		s=String.fromCharCode.apply(null,codes);
		if (enc=="utf8") out[out.length]=decodeutf8(s);
		else out[out.length]=s;

		return out;
	}
	var readStringArray = function(pos,blocksize,encoding,cb) {
		var that=this,out=null;
		if (blocksize==0) return [];
		encoding=encoding||'utf8';
		var buffer=new Buffer(blocksize);
		fs.read(this.handle,buffer,0,blocksize,pos,function(err,len,buffer){
			if (html5fs) {
				readLog("stringArray",buffer.byteLength);

				if (encoding=='utf8') {
					out=buf2stringarr(buffer,"utf8");
				} else { //ucs2 is 3 times faster
					out=buf2stringarr(buffer,"ucs2");
				}
			} else {
				readLog("stringArray",buffer.length);
				out=buffer.toString(encoding).split('\0');
			} 	
			cb.apply(that,[out]);
		});
	}
	var readUI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("ui32",len);
			if (html5fs){
				//v=(new Uint32Array(buffer))[0];
				var v=new DataView(buffer).getUint32(0, false)
				cb(v);
			}
			else cb.apply(that,[buffer.readInt32BE(0)]);	
		});		
	}

	var readI32=function(pos,cb) {
		var buffer=new Buffer(4);
		var that=this;
		fs.read(this.handle,buffer,0,4,pos,function(err,len,buffer){
			readLog("i32",len);
			if (html5fs){
				var v=new DataView(buffer).getInt32(0, false)
				cb(v);
			}
			else  	cb.apply(that,[buffer.readInt32BE(0)]);	
		});
	}
	var readUI8=function(pos,cb) {
		var buffer=new Buffer(1);
		var that=this;

		fs.read(this.handle,buffer,0,1,pos,function(err,len,buffer){
			readLog("ui8",len);
			if (html5fs)cb( (new Uint8Array(buffer))[0]) ;
			else  			cb.apply(that,[buffer.readUInt8(0)]);	
			
		});
	}
	var readBuf=function(pos,blocksize,cb) {
		var that=this;
		var buf=new Buffer(blocksize);
		fs.read(this.handle,buf,0,blocksize,pos,function(err,len,buffer){
			readLog("buf",len);
			var buff=new Uint8Array(buffer)
			cb.apply(that,[buff]);
		});
	}
	var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
		var that=this;
		readBuf.apply(this,[pos,blocksize,function(buffer){
			cb.apply(that,[unpack_int(buffer,count,reset)]);	
		}]);
		
	}
	var readFixedArray_html5fs=function(pos,count,unitsize,cb) {
		var func=null;
		if (unitsize===1) {
			func='getUint8';//Uint8Array;
		} else if (unitsize===2) {
			func='getUint16';//Uint16Array;
		} else if (unitsize===4) {
			func='getUint32';//Uint32Array;
		} else throw 'unsupported integer size';

		fs.read(this.handle,null,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			if (unitsize==1) {
				out=new Uint8Array(buffer);
			} else {
				for (var i = 0; i < len / unitsize; i++) { //endian problem
				//	out.push( func(buffer,i*unitsize));
					out.push( v=new DataView(buffer)[func](i,false) );
				}
			}

			cb.apply(that,[out]);
		});
	}
	// signature, itemcount, payload
	var readFixedArray = function(pos ,count, unitsize,cb) {
		var func=null;
		var that=this;
		
		if (unitsize* count>this.size && this.size)  {
			console.log("array size exceed file size",this.size)
			return;
		}
		
		if (html5fs) return readFixedArray_html5fs.apply(this,[pos,count,unitsize,cb]);

		var items=new Buffer( unitsize* count);
		if (unitsize===1) {
			func=items.readUInt8;
		} else if (unitsize===2) {
			func=items.readUInt16BE;
		} else if (unitsize===4) {
			func=items.readUInt32BE;
		} else throw 'unsupported integer size';
		//console.log('itemcount',itemcount,'buffer',buffer);

		fs.read(this.handle,items,0,unitsize*count,pos,function(err,len,buffer){
			readLog("fix array",len);
			var out=[];
			for (var i = 0; i < items.length / unitsize; i++) {
				out.push( func.apply(items,[i*unitsize]));
			}
			cb.apply(that,[out]);
		});
	}

	var free=function() {
		//console.log('closing ',handle);
		fs.closeSync(this.handle);
	}
	var setupapi=function() {
		var that=this;
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.free=free;
		if (html5fs) {
			var fn=path;
			if (path.indexOf("filesystem:")==0) fn=path.substr(path.lastIndexOf("/"));
			fs.fs.root.getFile(fn,{},function(entry){
			  entry.getMetadata(function(metadata) { 
				that.size=metadata.size;
				if (cb) setTimeout(cb.bind(that),0);
				});
			});
		} else {
			var stat=fs.fstatSync(this.handle);
			this.stat=stat;
			this.size=stat.size;		
			if (cb)	setTimeout(cb.bind(this,0),0);	
		}
	}

	var that=this;
	if (html5fs) {
		fs.open(path,function(h){
			if (!h) {
				if (cb)	setTimeout(cb.bind(null,"file not found:"+path),0);	
			} else {
				that.handle=h;
				that.html5fs=true;
				setupapi.call(that);
				that.opened=true;				
			}
		})
	} else {
		if (fs.existsSync(path)){
			this.handle=fs.openSync(path,'r');//,function(err,handle){
			this.opened=true;
			setupapi.call(this);
		} else {
			if (cb)	setTimeout(cb.bind(null,"file not found:"+path),0);	
			return null;
		}
	}
	return this;
}
module.exports=Open;
},{"./html5read":"c:\\ksana2015\\node_modules\\ksana-jsonrom\\html5read.js","buffer":false,"fs":false}],"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdbfs_android.js":[function(require,module,exports){
/*
  JAVA can only return Number and String
	array and buffer return in string format
	need JSON.parse
*/
var verbose=0;

var readSignature=function(pos,cb) {
	if (verbose) console.debug("read signature");
	var signature=kfs.readUTF8String(this.handle,pos,1);
	if (verbose) console.debug(signature,signature.charCodeAt(0));
	cb.apply(this,[signature]);
}
var readI32=function(pos,cb) {
	if (verbose) console.debug("read i32 at "+pos);
	var i32=kfs.readInt32(this.handle,pos);
	if (verbose) console.debug(i32);
	cb.apply(this,[i32]);	
}
var readUI32=function(pos,cb) {
	if (verbose) console.debug("read ui32 at "+pos);
	var ui32=kfs.readUInt32(this.handle,pos);
	if (verbose) console.debug(ui32);
	cb.apply(this,[ui32]);
}
var readUI8=function(pos,cb) {
	if (verbose) console.debug("read ui8 at "+pos); 
	var ui8=kfs.readUInt8(this.handle,pos);
	if (verbose) console.debug(ui8);
	cb.apply(this,[ui8]);
}
var readBuf=function(pos,blocksize,cb) {
	if (verbose) console.debug("read buffer at "+pos+ " blocksize "+blocksize);
	var buf=kfs.readBuf(this.handle,pos,blocksize);
	var buff=JSON.parse(buf);
	if (verbose) console.debug("buffer length"+buff.length);
	cb.apply(this,[buff]);	
}
var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
	if (verbose) console.debug("read packed int at "+pos+" blocksize "+blocksize+" count "+count);
	var buf=kfs.readBuf_packedint(this.handle,pos,blocksize,count,reset);
	var adv=parseInt(buf);
	var buff=JSON.parse(buf.substr(buf.indexOf("[")));
	if (verbose) console.debug("packedInt length "+buff.length+" first item="+buff[0]);
	cb.apply(this,[{data:buff,adv:adv}]);	
}


var readString= function(pos,blocksize,encoding,cb) {
	if (verbose) console.debug("readstring at "+pos+" blocksize " +blocksize+" enc:"+encoding);
	if (encoding=="ucs2") {
		var str=kfs.readULE16String(this.handle,pos,blocksize);
	} else {
		var str=kfs.readUTF8String(this.handle,pos,blocksize);	
	}	 
	if (verbose) console.debug(str);
	cb.apply(this,[str]);	
}

var readFixedArray = function(pos ,count, unitsize,cb) {
	if (verbose) console.debug("read fixed array at "+pos+" count "+count+" unitsize "+unitsize); 
	var buf=kfs.readFixedArray(this.handle,pos,count,unitsize);
	var buff=JSON.parse(buf);
	if (verbose) console.debug("array length"+buff.length);
	cb.apply(this,[buff]);	
}
var readStringArray = function(pos,blocksize,encoding,cb) {
	if (verbose) console.log("read String array at "+pos+" blocksize "+blocksize +" enc "+encoding); 
	encoding = encoding||"utf8";
	var buf=kfs.readStringArray(this.handle,pos,blocksize,encoding);
	//var buff=JSON.parse(buf);
	if (verbose) console.debug("read string array");
	var buff=buf.split("\uffff"); //cannot return string with 0
	if (verbose) console.debug("array length"+buff.length);
	cb.apply(this,[buff]);	
}
var mergePostings=function(positions,cb) {
	var buf=kfs.mergePostings(this.handle,JSON.stringify(positions));
	if (!buf || buf.length==0) return [];
	else return JSON.parse(buf);
}

var free=function() {
	//console.log('closing ',handle);
	kfs.close(this.handle);
}
var Open=function(path,opts,cb) {
	opts=opts||{};
	var signature_size=1;
	var setupapi=function() { 
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.mergePostings=mergePostings;
		this.free=free;
		this.size=kfs.getFileSize(this.handle);
		if (verbose) console.log("filesize  "+this.size);
		if (cb)	cb.call(this);
	}

	this.handle=kfs.open(path);
	this.opened=true;
	setupapi.call(this);
	return this;
}

module.exports=Open;
},{}],"c:\\ksana2015\\node_modules\\ksana-jsonrom\\kdbfs_ios.js":[function(require,module,exports){
/*
  JSContext can return all Javascript types.
*/
var verbose=1;

var readSignature=function(pos,cb) {
	if (verbose)  ksanagap.log("read signature at "+pos);
	var signature=kfs.readUTF8String(this.handle,pos,1);
	if (verbose)  ksanagap.log(signature+" "+signature.charCodeAt(0));
	cb.apply(this,[signature]);
}
var readI32=function(pos,cb) {
	if (verbose)  ksanagap.log("read i32 at "+pos);
	var i32=kfs.readInt32(this.handle,pos);
	if (verbose)  ksanagap.log(i32);
	cb.apply(this,[i32]);	
}
var readUI32=function(pos,cb) {
	if (verbose)  ksanagap.log("read ui32 at "+pos);
	var ui32=kfs.readUInt32(this.handle,pos);
	if (verbose)  ksanagap.log(ui32);
	cb.apply(this,[ui32]);
}
var readUI8=function(pos,cb) {
	if (verbose)  ksanagap.log("read ui8 at "+pos); 
	var ui8=kfs.readUInt8(this.handle,pos);
	if (verbose)  ksanagap.log(ui8);
	cb.apply(this,[ui8]);
}
var readBuf=function(pos,blocksize,cb) {
	if (verbose)  ksanagap.log("read buffer at "+pos);
	var buf=kfs.readBuf(this.handle,pos,blocksize);
	if (verbose)  ksanagap.log("buffer length"+buf.length);
	cb.apply(this,[buf]);	
}
var readBuf_packedint=function(pos,blocksize,count,reset,cb) {
	if (verbose)  ksanagap.log("read packed int fast, blocksize "+blocksize+" at "+pos);var t=new Date();
	var buf=kfs.readBuf_packedint(this.handle,pos,blocksize,count,reset);
	if (verbose)  ksanagap.log("return from packedint, time" + (new Date()-t));
	if (typeof buf.data=="string") {
		buf.data=eval("["+buf.data.substr(0,buf.data.length-1)+"]");
	}
	if (verbose)  ksanagap.log("unpacked length"+buf.data.length+" time" + (new Date()-t) );
	cb.apply(this,[buf]);
}


var readString= function(pos,blocksize,encoding,cb) {

	if (verbose)  ksanagap.log("readstring at "+pos+" blocksize "+blocksize+" "+encoding);var t=new Date();
	if (encoding=="ucs2") {
		var str=kfs.readULE16String(this.handle,pos,blocksize);
	} else {
		var str=kfs.readUTF8String(this.handle,pos,blocksize);	
	}
	if (verbose)  ksanagap.log(str+" time"+(new Date()-t));
	cb.apply(this,[str]);	
}

var readFixedArray = function(pos ,count, unitsize,cb) {
	if (verbose)  ksanagap.log("read fixed array at "+pos); var t=new Date();
	var buf=kfs.readFixedArray(this.handle,pos,count,unitsize);
	if (verbose)  ksanagap.log("array length "+buf.length+" time"+(new Date()-t));
	cb.apply(this,[buf]);	
}
var readStringArray = function(pos,blocksize,encoding,cb) {
	//if (verbose)  ksanagap.log("read String array "+blocksize +" "+encoding); 
	encoding = encoding||"utf8";
	if (verbose)  ksanagap.log("read string array at "+pos);var t=new Date();
	var buf=kfs.readStringArray(this.handle,pos,blocksize,encoding);
	if (typeof buf=="string") buf=buf.split("\0");
	//var buff=JSON.parse(buf);
	//var buff=buf.split("\uffff"); //cannot return string with 0
	if (verbose)  ksanagap.log("string array length"+buf.length+" time"+(new Date()-t));
	cb.apply(this,[buf]);
}

var mergePostings=function(positions) {
	var buf=kfs.mergePostings(this.handle,positions);
	if (typeof buf=="string") {
		buf=eval("["+buf.substr(0,buf.length-1)+"]");
	}
	return buf;
}
var free=function() {
	////if (verbose)  ksanagap.log('closing ',handle);
	kfs.close(this.handle);
}
var Open=function(path,opts,cb) {
	opts=opts||{};
	var signature_size=1;
	var setupapi=function() { 
		this.readSignature=readSignature;
		this.readI32=readI32;
		this.readUI32=readUI32;
		this.readUI8=readUI8;
		this.readBuf=readBuf;
		this.readBuf_packedint=readBuf_packedint;
		this.readFixedArray=readFixedArray;
		this.readString=readString;
		this.readStringArray=readStringArray;
		this.signature_size=signature_size;
		this.mergePostings=mergePostings;
		this.free=free;
		this.size=kfs.getFileSize(this.handle);
		if (verbose)  ksanagap.log("filesize  "+this.size);
		if (cb)	cb.call(this);
	}

	this.handle=kfs.open(path);
	this.opened=true;
	setupapi.call(this);
	return this;
}

module.exports=Open;
},{}],"c:\\ksana2015\\node_modules\\ksana-search\\boolsearch.js":[function(require,module,exports){
/*
  TODO
  and not

*/

// http://jsfiddle.net/neoswf/aXzWw/
var plist=require('./plist');
function intersect(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
     if      (I[i] < J[j]) i++; 
     else if (I[i] > J[j]) j++; 
     else {
       result[result.length]=l[i];
       i++;j++;
     }
  }
  return result;
}

/* return all items in I but not in J */
function subtract(I, J) {
  var i = j = 0;
  var result = [];

  while( i < I.length && j < J.length ){
    if (I[i]==J[j]) {
      i++;j++;
    } else if (I[i]<J[j]) {
      while (I[i]<J[j]) result[result.length]= I[i++];
    } else {
      while(J[j]<I[i]) j++;
    }
  }

  if (j==J.length) {
    while (i<I.length) result[result.length]=I[i++];
  }

  return result;
}

var union=function(a,b) {
	if (!a || !a.length) return b;
	if (!b || !b.length) return a;
    var result = [];
    var ai = 0;
    var bi = 0;
    while (true) {
        if ( ai < a.length && bi < b.length) {
            if (a[ai] < b[bi]) {
                result[result.length]=a[ai];
                ai++;
            } else if (a[ai] > b[bi]) {
                result[result.length]=b[bi];
                bi++;
            } else {
                result[result.length]=a[ai];
                result[result.length]=b[bi];
                ai++;
                bi++;
            }
        } else if (ai < a.length) {
            result.push.apply(result, a.slice(ai, a.length));
            break;
        } else if (bi < b.length) {
            result.push.apply(result, b.slice(bi, b.length));
            break;
        } else {
            break;
        }
    }
    return result;
}
var OPERATION={'include':intersect, 'union':union, 'exclude':subtract};

var boolSearch=function(opts) {
  opts=opts||{};
  ops=opts.op||this.opts.op;
  this.docs=[];
	if (!this.phrases.length) return;
	var r=this.phrases[0].docs;
  /* ignore operator of first phrase */
	for (var i=1;i<this.phrases.length;i++) {
		var op= ops[i] || 'union';
		r=OPERATION[op](r,this.phrases[i].docs);
	}
	this.docs=plist.unique(r);
	return this;
}
module.exports={search:boolSearch}
},{"./plist":"c:\\ksana2015\\node_modules\\ksana-search\\plist.js"}],"c:\\ksana2015\\node_modules\\ksana-search\\bsearch.js":[function(require,module,exports){
module.exports=require("c:\\ksana2015\\node_modules\\ksana-database\\bsearch.js")
},{"c:\\ksana2015\\node_modules\\ksana-database\\bsearch.js":"c:\\ksana2015\\node_modules\\ksana-database\\bsearch.js"}],"c:\\ksana2015\\node_modules\\ksana-search\\excerpt.js":[function(require,module,exports){
var plist=require("./plist");

var getPhraseWidths=function (Q,phraseid,vposs) {
	var res=[];
	for (var i in vposs) {
		res.push(getPhraseWidth(Q,phraseid,vposs[i]));
	}
	return res;
}
var getPhraseWidth=function (Q,phraseid,vpos) {
	var P=Q.phrases[phraseid];
	var width=0,varwidth=false;
	if (P.width) return P.width; // no wildcard
	if (P.termid.length<2) return P.termlength[0];
	var lasttermposting=Q.terms[P.termid[P.termid.length-1]].posting;

	for (var i in P.termid) {
		var T=Q.terms[P.termid[i]];
		if (T.op=='wildcard') {
			width+=T.width;
			if (T.wildcard=='*') varwidth=true;
		} else {
			width+=P.termlength[i];
		}
	}
	if (varwidth) { //width might be smaller due to * wildcard
		var at=plist.indexOfSorted(lasttermposting,vpos);
		var endpos=lasttermposting[at];
		if (endpos-vpos<width) width=endpos-vpos+1;
	}

	return width;
}
/* return [vpos, phraseid, phrasewidth, optional_tagname] by slot range*/
var hitInRange=function(Q,startvpos,endvpos) {
	var res=[];
	if (!Q || !Q.rawresult || !Q.rawresult.length) return res;
	for (var i=0;i<Q.phrases.length;i++) {
		var P=Q.phrases[i];
		if (!P.posting) continue;
		var s=plist.indexOfSorted(P.posting,startvpos);
		var e=plist.indexOfSorted(P.posting,endvpos);
		var r=P.posting.slice(s,e+1);
		var width=getPhraseWidths(Q,i,r);

		res=res.concat(r.map(function(vpos,idx){ return [vpos,width[idx],i] }));
	}
	// order by vpos, if vpos is the same, larger width come first.
	// so the output will be
	// <tag1><tag2>one</tag2>two</tag1>
	//TODO, might cause overlap if same vpos and same width
	//need to check tag name
	res.sort(function(a,b){return a[0]==b[0]? b[1]-a[1] :a[0]-b[0]});

	return res;
}

var tagsInRange=function(Q,renderTags,startvpos,endvpos) {
	var res=[];
	if (typeof renderTags=="string") renderTags=[renderTags];

	renderTags.map(function(tag){
		var starts=Q.engine.get(["fields",tag+"_start"]);
		var ends=Q.engine.get(["fields",tag+"_end"]);
		if (!starts) return;

		var s=plist.indexOfSorted(starts,startvpos);
		var e=s;
		while (e<starts.length && starts[e]<endvpos) e++;
		var opentags=starts.slice(s,e);

		s=plist.indexOfSorted(ends,startvpos);
		e=s;
		while (e<ends.length && ends[e]<endvpos) e++;
		var closetags=ends.slice(s,e);

		opentags.map(function(start,idx) {
			res.push([start,closetags[idx]-start,tag]);
		})
	});
	// order by vpos, if vpos is the same, larger width come first.
	res.sort(function(a,b){return a[0]==b[0]? b[1]-a[1] :a[0]-b[0]});

	return res;
}

/*
given a vpos range start, file, convert to filestart, fileend
   filestart : starting file
   start   : vpos start
   showfile: how many files to display
   showpage: how many pages to display

output:
   array of fileid with hits
*/
var getFileWithHits=function(engine,Q,range) {
	var fileOffsets=engine.get("fileoffsets");
	var out=[],filecount=100;
	var start=0 , end=Q.byFile.length;
	Q.excerptOverflow=false;
	if (range.start) {
		var first=range.start ;
		var last=range.end;
		if (!last) last=Number.MAX_SAFE_INTEGER;
		for (var i=0;i<fileOffsets.length;i++) {
			//if (fileOffsets[i]>first) break;
			if (fileOffsets[i]>last) {
				end=i;
				break;
			}
			if (fileOffsets[i]<first) start=i;
		}		
	} else {
		start=range.filestart || 0;
		if (range.maxfile) {
			filecount=range.maxfile;
		} else if (range.showseg) {
			throw "not implement yet"
		}
	}

	var fileWithHits=[],totalhit=0;
	range.maxhit=range.maxhit||1000;

	for (var i=start;i<end;i++) {
		if(Q.byFile[i].length>0) {
			totalhit+=Q.byFile[i].length;
			fileWithHits.push(i);
			range.nextFileStart=i;
			if (fileWithHits.length>=filecount) {
				Q.excerptOverflow=true;
				break;
			}
			if (totalhit>range.maxhit) {
				Q.excerptOverflow=true;
				break;
			}
		}
	}
	if (i>=end) { //no more file
		Q.excerptStop=true;
	}
	return fileWithHits;
}
var resultlist=function(engine,Q,opts,cb) {
	var output=[];
	if (!Q.rawresult || !Q.rawresult.length) {
		cb(output);
		return;
	}

	if (opts.range) {
		if (opts.range.maxhit && !opts.range.maxfile) {
			opts.range.maxfile=opts.range.maxhit;
			opts.range.maxseg=opts.range.maxhit;
		}
		if (!opts.range.maxseg) opts.range.maxseg=100;
		if (!opts.range.end) {
			opts.range.end=Number.MAX_SAFE_INTEGER;
		}
	}
	var fileWithHits=getFileWithHits(engine,Q,opts.range);
	if (!fileWithHits.length) {
		cb(output);
		return;
	}

	var output=[],files=[];//temporary holder for segnames
	for (var i=0;i<fileWithHits.length;i++) {
		var nfile=fileWithHits[i];
		var segoffsets=engine.getFileSegOffsets(nfile);
		var segnames=engine.getFileSegNames(nfile);
		files[nfile]={segoffsets:segoffsets};
		var segwithhit=plist.groupbyposting2(Q.byFile[ nfile ],  segoffsets);
		//if (segoffsets[0]==1)
		//segwithhit.shift(); //the first item is not used (0~Q.byFile[0] )

		for (var j=0; j<segwithhit.length;j++) {
			if (!segwithhit[j].length) continue;
			//var offsets=segwithhit[j].map(function(p){return p- fileOffsets[i]});
			if (segoffsets[j]>opts.range.end) break;
			output.push(  {file: nfile, seg:j,  segname:segnames[j]});
			if (output.length>opts.range.maxseg) break;
		}
	}

	var segpaths=output.map(function(p){
		return ["filecontents",p.file,p.seg];
	});
	//prepare the text
	engine.get(segpaths,function(segs){
		var seq=0;
		if (segs) for (var i=0;i<segs.length;i++) {
			var startvpos=files[output[i].file].segoffsets[output[i].seg-1] ||0;
			var endvpos=files[output[i].file].segoffsets[output[i].seg];
			var hl={};

			if (opts.range && opts.range.start  ) {
				if ( startvpos<opts.range.start) startvpos=opts.range.start;
			//	if (endvpos>opts.range.end) endvpos=opts.range.end;
			}
			
			if (opts.nohighlight) {
				hl.text=segs[i];
				hl.hits=hitInRange(Q,startvpos,endvpos);
			} else {
				var o={nocrlf:true,nospan:true,
					text:segs[i],startvpos:startvpos, endvpos: endvpos, 
					Q:Q,fulltext:opts.fulltext};
				hl=highlight(Q,o);
			}
			if (hl.text) {
				output[i].text=hl.text;
				output[i].hits=hl.hits;
				output[i].seq=seq;
				seq+=hl.hits.length;

				output[i].start=startvpos;				
			} else {
				output[i]=null; //remove item vpos less than opts.range.start
			}
		} 
		output=output.filter(function(o){return o!=null});
		cb(output);
	});
}
var injectTag=function(Q,opts){
	var hits=opts.hits;
	var tags=opts.tags;
	if (!tags) tags=[];
	var hitclass=opts.hitclass||'hl';
	var output='',O=[],j=0,k=0;
	var surround=opts.surround||5;

	var tokens=Q.tokenize(opts.text).tokens;
	var vpos=opts.vpos;
	var i=0,previnrange=!!opts.fulltext ,inrange=!!opts.fulltext;
	var hitstart=0,hitend=0,tagstart=0,tagend=0,tagclass="";
	while (i<tokens.length) {
		var skip=Q.isSkip(tokens[i]);
		var hashit=false;
		inrange=opts.fulltext || (j<hits.length && vpos+surround>=hits[j][0] ||
				(j>0 && j<=hits.length &&  hits[j-1][0]+surround*2>=vpos));	

		if (previnrange!=inrange) {
			output+=opts.abridge||"...";
		}
		previnrange=inrange;
		var token=tokens[i];
		if (opts.nocrlf && token=="\n") token="";

		if (inrange && i<tokens.length) {
			if (skip) {
				output+=token;
			} else {
				var classes="";	

				//check hit
				if (j<hits.length && vpos==hits[j][0]) {
					var nphrase=hits[j][2] % 10, width=hits[j][1];
					hitstart=hits[j][0];
					hitend=hitstart+width;
					j++;
				}

				//check tag
				if (k<tags.length && vpos==tags[k][0]) {
					var width=tags[k][1];
					tagstart=tags[k][0];
					tagend=tagstart+width;
					tagclass=tags[k][2];
					k++;
				}

				if (vpos>=hitstart && vpos<hitend) classes=hitclass+" "+hitclass+nphrase;
				if (vpos>=tagstart && vpos<tagend) classes+=" "+tagclass;

				if (classes || !opts.nospan) {
					output+='<span vpos="'+vpos+'"';
					if (classes) classes=' class="'+classes+'"';
					output+=classes+'>';
					output+=token+'</span>';
				} else {
					output+=token;
				}
			}
		}
		if (!skip) vpos++;
		i++; 
	}

	O.push(output);
	output="";

	return O.join("");
}
var highlight=function(Q,opts) {
	if (!opts.text) return {text:"",hits:[]};
	var opt={text:opts.text,
		hits:null,abridge:opts.abridge,vpos:opts.startvpos,
		fulltext:opts.fulltext,renderTags:opts.renderTags,nospan:opts.nospan,nocrlf:opts.nocrlf,
	};

	opt.hits=hitInRange(opts.Q,opts.startvpos,opts.endvpos);
	return {text:injectTag(Q,opt),hits:opt.hits};
}

var getSeg=function(engine,fileid,segid,cb) {
	var fileOffsets=engine.get("fileoffsets");
	var segpaths=["filecontents",fileid,segid];
	var segnames=engine.getFileSegNames(fileid);

	engine.get(segpaths,function(text){
		cb.apply(engine.context,[{text:text,file:fileid,seg:segid,segname:segnames[segid]}]);
	});
}

var getSegSync=function(engine,fileid,segid) {
	var fileOffsets=engine.get("fileoffsets");
	var segpaths=["filecontents",fileid,segid];
	var segnames=engine.getFileSegNames(fileid);

	var text=engine.get(segpaths);
	return {text:text,file:fileid,seg:segid,segname:segnames[segid]};
}

var getRange=function(engine,start,end,cb) {
	var fileoffsets=engine.get("fileoffsets");
	//var pagepaths=["fileContents",];
	//find first page and last page
	//create get paths

}

var getFile=function(engine,fileid,cb) {
	var filename=engine.get("filenames")[fileid];
	var segnames=engine.getFileSegNames(fileid);
	var filestart=engine.get("fileoffsets")[fileid];
	var offsets=engine.getFileSegOffsets(fileid);
	var pc=0;
	engine.get(["fileContents",fileid],true,function(data){
		var text=data.map(function(t,idx) {
			if (idx==0) return ""; 
			var pb='<pb n="'+segnames[idx]+'"></pb>';
			return pb+t;
		});
		cb({texts:data,text:text.join(""),segnames:segnames,filestart:filestart,offsets:offsets,file:fileid,filename:filename}); //force different token
	});
}

var highlightRange=function(Q,startvpos,endvpos,opts,cb){
	//not implement yet
}

var highlightFile=function(Q,fileid,opts,cb) {
	if (typeof opts=="function") {
		cb=opts;
	}

	if (!Q || !Q.engine) return cb(null);

	var segoffsets=Q.engine.getFileSegOffsets(fileid);
	var output=[];	
	//console.log(startvpos,endvpos)
	Q.engine.get(["fileContents",fileid],true,function(data){
		if (!data) {
			console.error("wrong file id",fileid);
		} else {
			for (var i=0;i<data.length-1;i++ ){
				var startvpos=segoffsets[i];
				var endvpos=segoffsets[i+1];
				var segnames=Q.engine.getFileSegNames(fileid);
				var seg=getSegSync(Q.engine, fileid,i+1);
					var opt={text:seg.text,hits:null,tag:'hl',vpos:startvpos,
					fulltext:true,nospan:opts.nospan,nocrlf:opts.nocrlf};
				var segname=segnames[i+1];
				opt.hits=hitInRange(Q,startvpos,endvpos);
				var pb='<pb n="'+segname+'"></pb>';
				var withtag=injectTag(Q,opt);
				output.push(pb+withtag);
			}			
		}

		cb.apply(Q.engine.context,[{text:output.join(""),file:fileid}]);
	})
}
var highlightSeg=function(Q,fileid,segid,opts,cb) {
	if (typeof opts=="function") {
		cb=opts;
	}

	if (!Q || !Q.engine) return cb(null);
	var segoffsets=Q.engine.getFileSegOffsets(fileid);
	var startvpos=segoffsets[segid-1];
	var endvpos=segoffsets[segid];
	var segnames=Q.engine.getFileSegNames(fileid);

	this.getSeg(Q.engine,fileid,segid,function(res){
		var opt={text:res.text,hits:null,vpos:startvpos,fulltext:true,
			nospan:opts.nospan,nocrlf:opts.nocrlf};
		opt.hits=hitInRange(Q,startvpos,endvpos);
		if (opts.renderTags) {
			opt.tags=tagsInRange(Q,opts.renderTags,startvpos,endvpos);
		}

		var segname=segnames[segid];
		cb.apply(Q.engine.context,[{text:injectTag(Q,opt),seg:segid,file:fileid,hits:opt.hits,segname:segname}]);
	});
}
module.exports={resultlist:resultlist, 
	hitInRange:hitInRange, 
	highlightSeg:highlightSeg,
	getSeg:getSeg,
	highlightFile:highlightFile,
	getFile:getFile
	//highlightRange:highlightRange,
  //getRange:getRange,
};
},{"./plist":"c:\\ksana2015\\node_modules\\ksana-search\\plist.js"}],"c:\\ksana2015\\node_modules\\ksana-search\\index.js":[function(require,module,exports){
/*
  Ksana Search Engine.

  need a KDE instance to be functional
  
*/
var bsearch=require("./bsearch");
var dosearch=require("./search");

var prepareEngineForSearch=function(engine,cb){
	if (engine.analyzer) {
		cb();
		return;
	}
	var analyzer=require("ksana-analyzer");
	var config=engine.get("meta").config;
	engine.analyzer=analyzer.getAPI(config);
	engine.get([["tokens"],["postingslength"]],function(){
		cb();
	});
}

var _search=function(engine,q,opts,cb,context) {
	if (typeof engine=="string") {//browser only
		var kde=require("ksana-database");
		if (typeof opts=="function") { //user didn't supply options
			if (typeof cb=="object")context=cb;
			cb=opts;
			opts={};
		}
		opts.q=q;
		opts.dbid=engine;
		kde.open(opts.dbid,function(err,db){
			if (err) {
				cb(err);
				return;
			}
			console.log("opened",opts.dbid)
			prepareEngineForSearch(db,function(){
				return dosearch(db,q,opts,cb);	
			});
		},context);
	} else {
		prepareEngineForSearch(engine,function(){
			return dosearch(engine,q,opts,cb);	
		});
	}
}

var _highlightSeg=function(engine,fileid,segid,opts,cb){
	if (!opts.q) opts.q=""; 
	_search(engine,opts.q,opts,function(Q){
		api.excerpt.highlightSeg(Q,fileid,segid,opts,cb);
	});	
}
var _highlightRange=function(engine,start,end,opts,cb){

	if (opts.q) {
		_search(engine,opts.q,opts,function(Q){
			api.excerpt.highlightRange(Q,start,end,opts,cb);
		});
	} else {
		prepareEngineForSearch(engine,function(){
			api.excerpt.getRange(engine,start,end,cb);
		});
	}
}
var _highlightFile=function(engine,fileid,opts,cb){
	if (!opts.q) opts.q=""; 
	_search(engine,opts.q,opts,function(Q){
		api.excerpt.highlightFile(Q,fileid,opts,cb);
	});
	/*
	} else {
		api.excerpt.getFile(engine,fileid,function(data) {
			cb.apply(engine.context,[data]);
		});
	}
	*/
}

var vpos2fileseg=function(engine,vpos) {
    var segoffsets=engine.get("segoffsets");
    var fileoffsets=engine.get(["fileoffsets"]);
    var segnames=engine.get("segnames");
    var fileid=bsearch(fileoffsets,vpos+1,true);
    fileid--;
    var segid=bsearch(segoffsets,vpos+1,true);
	var range=engine.getFileRange(fileid);
	segid-=range.start;
    return {file:fileid,seg:segid};
}
var api={
	search:_search
//	,concordance:require("./concordance")
//	,regex:require("./regex")
	,highlightSeg:_highlightSeg
	,highlightFile:_highlightFile
//	,highlightRange:_highlightRange
	,excerpt:require("./excerpt")
	,vpos2fileseg:vpos2fileseg
}
module.exports=api;
},{"./bsearch":"c:\\ksana2015\\node_modules\\ksana-search\\bsearch.js","./excerpt":"c:\\ksana2015\\node_modules\\ksana-search\\excerpt.js","./search":"c:\\ksana2015\\node_modules\\ksana-search\\search.js","ksana-analyzer":"c:\\ksana2015\\node_modules\\ksana-analyzer\\index.js","ksana-database":"c:\\ksana2015\\node_modules\\ksana-database\\index.js"}],"c:\\ksana2015\\node_modules\\ksana-search\\plist.js":[function(require,module,exports){

var unpack = function (ar) { // unpack variable length integer list
  var r = [],
  i = 0,
  v = 0;
  do {
	var shift = 0;
	do {
	  v += ((ar[i] & 0x7F) << shift);
	  shift += 7;
	} while (ar[++i] & 0x80);
	r[r.length]=v;
  } while (i < ar.length);
  return r;
}

/*
   arr:  [1,1,1,1,1,1,1,1,1]
   levels: [0,1,1,2,2,0,1,2]
   output: [5,1,3,1,1,3,1,1]
*/

var groupsum=function(arr,levels) {
  if (arr.length!=levels.length+1) return null;
  var stack=[];
  var output=new Array(levels.length);
  for (var i=0;i<levels.length;i++) output[i]=0;
  for (var i=1;i<arr.length;i++) { //first one out of toc scope, ignored
    if (stack.length>levels[i-1]) {
      while (stack.length>levels[i-1]) stack.pop();
    }
    stack.push(i-1);
    for (var j=0;j<stack.length;j++) {
      output[stack[j]]+=arr[i];
    }
  }
  return output;
}
/* arr= 1 , 2 , 3 ,4 ,5,6,7 //token posting
  posting= 3 , 5  //tag posting
  out = 3 , 2, 2
*/
var countbyposting = function (arr, posting) {
  if (!posting.length) return [arr.length];
  var out=[];
  for (var i=0;i<posting.length;i++) out[i]=0;
  out[posting.length]=0;
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<posting.length) {
    if (arr[i]<=posting[p]) {
      while (p<posting.length && i<arr.length && arr[i]<=posting[p]) {
        out[p]++;
        i++;
      }      
    } 
    p++;
  }
  out[posting.length] = arr.length-i; //remaining
  return out;
}

var groupbyposting=function(arr,gposting) { //relative vpos
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1];
        out[p].push(arr[i++]-start);  // relative
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyposting2=function(arr,gposting) { //absolute vpos
  if (!arr || !arr.length) return [];
  if (!gposting.length) return [arr.length];
  var out=[];
  for (var i=0;i<=gposting.length;i++) out[i]=[];
  
  var p=0,i=0,lasti=0;
  while (i<arr.length && p<gposting.length) {
    if (arr[i]<gposting[p]) {
      while (p<gposting.length && i<arr.length && arr[i]<gposting[p]) {
        var start=0;
        if (p>0) start=gposting[p-1]; //absolute
        out[p].push(arr[i++]);
      }      
    } 
    p++;
  }
  //remaining
  while(i<arr.length) out[out.length-1].push(arr[i++]-gposting[gposting.length-1]);
  return out;
}
var groupbyblock2 = function(ar, ntoken,slotshift,opts) {
  if (!ar.length) return [{},{}];
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {}, ntokens={};
  var groupcount=0;
  do {
    var group = Math.floor(ar[i] / g) ;
    if (!r[group]) {
      r[group] = [];
      ntokens[group]=[];
      groupcount++;
    }
    r[group].push(ar[i] % g);
    ntokens[group].push(ntoken[i]);
    i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return [r,ntokens];
}
var groupbyslot = function (ar, slotshift, opts) {
  if (!ar.length)
	return {};
  
  slotshift = slotshift || 16;
  var g = Math.pow(2,slotshift);
  var i = 0;
  var r = {};
  var groupcount=0;
  do {
	var group = Math.floor(ar[i] / g) ;
	if (!r[group]) {
	  r[group] = [];
	  groupcount++;
	}
	r[group].push(ar[i] % g);
	i++;
  } while (i < ar.length);
  if (opts) opts.groupcount=groupcount;
  return r;
}
/*
var identity = function (value) {
  return value;
};
var sortedIndex = function (array, obj, iterator) { //taken from underscore
  iterator || (iterator = identity);
  var low = 0,
  high = array.length;
  while (low < high) {
	var mid = (low + high) >> 1;
	iterator(array[mid]) < iterator(obj) ? low = mid + 1 : high = mid;
  }
  return low;
};*/

var indexOfSorted = function (array, obj) { 
  var low = 0,
  high = array.length-1;
  while (low < high) {
    var mid = (low + high) >> 1;
    array[mid] < obj ? low = mid + 1 : high = mid;
  }
  return low;
};
var plhead=function(pl, pltag, opts) {
  opts=opts||{};
  opts.max=opts.max||1;
  var out=[];
  if (pltag.length<pl.length) {
    for (var i=0;i<pltag.length;i++) {
       k = indexOfSorted(pl, pltag[i]);
       if (k>-1 && k<pl.length) {
        if (pl[k]==pltag[i]) {
          out[out.length]=pltag[i];
          if (out.length>=opts.max) break;
        }
      }
    }
  } else {
    for (var i=0;i<pl.length;i++) {
       k = indexOfSorted(pltag, pl[i]);
       if (k>-1 && k<pltag.length) {
        if (pltag[k]==pl[i]) {
          out[out.length]=pltag[k];
          if (out.length>=opts.max) break;
        }
      }
    }
  }
  return out;
}
/*
 pl2 occur after pl1, 
 pl2>=pl1+mindis
 pl2<=pl1+maxdis
*/
var plfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      r[r.length]=pl1[i];
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-maxdis);
      if (k2>i) {
        var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
        if (t>-1) r[r.length]=pl1[k2];
        i=k2;
      } else break;
    }
  }
  return r;
}

var plnotfollow2 = function (pl1, pl2, mindis, maxdis) {
  var r = [],i=0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + mindis);
    var t = (pl2[k] >= (pl1[i] +mindis) && pl2[k]<=(pl1[i]+maxdis)) ? k : -1;
    if (t > -1) {
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-maxdis);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
/* this is incorrect */
var plfollow = function (pl1, pl2, distance) {
  var r = [],i=0;

  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i]);
      i++;
    } else {
      if (k>=pl2.length) break;
      var k2=indexOfSorted (pl1,pl2[k]-distance);
      if (k2>i) {
        t = (pl2[k] === (pl1[k2] + distance)) ? k : -1;
        if (t>-1) {
           r.push(pl1[k2]);
           k2++;
        }
        i=k2;
      } else break;
    }
  }
  return r;
}
var plnotfollow = function (pl1, pl2, distance) {
  var r = [];
  var r = [],i=0;
  var swap = 0;
  
  while (i<pl1.length){
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) { 
      i++;
    } else {
      if (k>=pl2.length) {
        r=r.concat(pl1.slice(i));
        break;
      } else {
        var k2=indexOfSorted (pl1,pl2[k]-distance);
        if (k2>i) {
          r=r.concat(pl1.slice(i,k2));
          i=k2;
        } else break;
      }
    }
  }
  return r;
}
var pland = function (pl1, pl2, distance) {
  var r = [];
  var swap = 0;
  
  if (pl1.length > pl2.length) { //swap for faster compare
    var t = pl2;
    pl2 = pl1;
    pl1 = t;
    swap = distance;
    distance = -distance;
  }
  for (var i = 0; i < pl1.length; i++) {
    var k = indexOfSorted(pl2, pl1[i] + distance);
    var t = (pl2[k] === (pl1[i] + distance)) ? k : -1;
    if (t > -1) {
      r.push(pl1[i] - swap);
    }
  }
  return r;
}
var combine=function (postings) {
  var out=[];
  for (var i in postings) {
    out=out.concat(postings[i]);
  }
  out.sort(function(a,b){return a-b});
  return out;
}

var unique = function(ar){
   if (!ar || !ar.length) return [];
   var u = {}, a = [];
   for(var i = 0, l = ar.length; i < l; ++i){
    if(u.hasOwnProperty(ar[i])) continue;
    a.push(ar[i]);
    u[ar[i]] = 1;
   }
   return a;
}



var plphrase = function (postings,ops) {
  var r = [];
  for (var i=0;i<postings.length;i++) {
  	if (!postings[i])  return [];
  	if (0 === i) {
  	  r = postings[0];
  	} else {
      if (ops[i]=='andnot') {
        r = plnotfollow(r, postings[i], i);  
      }else {
        r = pland(r, postings[i], i);  
      }
  	}
  }
  
  return r;
}
//return an array of group having any of pl item
var matchPosting=function(pl,gupl,start,end) {
  start=start||0;
  end=end||-1;
  if (end==-1) end=Math.pow(2, 53); // max integer value

  var count=0, i = j= 0,  result = [] ,v=0;
  var docs=[], freq=[];
  if (!pl) return {docs:[],freq:[]};
  while( i < pl.length && j < gupl.length ){
     if (pl[i] < gupl[j] ){ 
       count++;
       v=pl[i];
       i++; 
     } else {
       if (count) {
        if (v>=start && v<end) {
          docs.push(j);
          freq.push(count);          
        }
       }
       j++;
       count=0;
     }
  }
  if (count && j<gupl.length && v>=start && v<end) {
    docs.push(j);
    freq.push(count);
    count=0;
  }
  else {
    while (j==gupl.length && i<pl.length && pl[i] >= gupl[gupl.length-1]) {
      i++;
      count++;
    }
    if (v>=start && v<end) {
      docs.push(j);
      freq.push(count);      
    }
  } 
  return {docs:docs,freq:freq};
}

var trim=function(arr,start,end) {
  var s=indexOfSorted(arr,start);
  var e=indexOfSorted(arr,end);
  return arr.slice(s,e+1);
}
var plist={};
plist.unpack=unpack;
plist.plphrase=plphrase;
plist.plhead=plhead;
plist.plfollow2=plfollow2;
plist.plnotfollow2=plnotfollow2;
plist.plfollow=plfollow;
plist.plnotfollow=plnotfollow;
plist.unique=unique;
plist.indexOfSorted=indexOfSorted;
plist.matchPosting=matchPosting;
plist.trim=trim;

plist.groupbyslot=groupbyslot;
plist.groupbyblock2=groupbyblock2;
plist.countbyposting=countbyposting;
plist.groupbyposting=groupbyposting;
plist.groupbyposting2=groupbyposting2;
plist.groupsum=groupsum;
plist.combine=combine;
module.exports=plist;
},{}],"c:\\ksana2015\\node_modules\\ksana-search\\search.js":[function(require,module,exports){
/*
var dosearch2=function(engine,opts,cb,context) {
	opts
		nfile,npage  //return a highlighted page
		nfile,[pages] //return highlighted pages 
		nfile        //return entire highlighted file
		abs_npage
		[abs_pages]  //return set of highlighted pages (may cross file)

		filename, pagename
		filename,[pagenames]

		excerpt      //
	    sortBy       //default natural, sortby by vsm ranking

	//return err,array_of_string ,Q  (Q contains low level search result)
}

*/
/* TODO sorted tokens */
var plist=require("./plist");
var boolsearch=require("./boolsearch");
var excerpt=require("./excerpt");
var parseTerm = function(engine,raw,opts) {
	if (!raw) return;
	var res={raw:raw,variants:[],term:'',op:''};
	var term=raw, op=0;
	var firstchar=term[0];
	var termregex="";
	if (firstchar=='-') {
		term=term.substring(1);
		firstchar=term[0];
		res.exclude=true; //exclude
	}
	term=term.trim();
	var lastchar=term[term.length-1];
	term=engine.analyzer.normalize(term);
	
	if (term.indexOf("%")>-1) {
		var termregex="^"+term.replace(/%+/g,".+")+"$";
		if (firstchar=="%") 	termregex=".+"+termregex.substr(1);
		if (lastchar=="%") 	termregex=termregex.substr(0,termregex.length-1)+".+";
	}

	if (termregex) {
		res.variants=expandTerm(engine,termregex);
	}

	res.key=term;
	return res;
}
var expandTerm=function(engine,regex) {
	var r=new RegExp(regex);
	var tokens=engine.get("tokens");
	var postingsLength=engine.get("postingslength");
	if (!postingsLength) postingsLength=[];
	var out=[];
	for (var i=0;i<tokens.length;i++) {
		var m=tokens[i].match(r);
		if (m) {
			out.push([m[0],postingsLength[i]||1]);
		}
	}
	out.sort(function(a,b){return b[1]-a[1]});
	return out;
}
var isWildcard=function(raw) {
	return !!raw.match(/[\*\?]/);
}

var isOrTerm=function(term) {
	term=term.trim();
	return (term[term.length-1]===',');
}
var orterm=function(engine,term,key) {
		var t={text:key};
		if (engine.analyzer.simplifiedToken) {
			t.simplified=engine.analyzer.simplifiedToken(key);
		}
		term.variants.push(t);
}
var orTerms=function(engine,tokens,now) {
	var raw=tokens[now];
	var term=parseTerm(engine,raw);
	if (!term) return;
	orterm(engine,term,term.key);
	while (isOrTerm(raw))  {
		raw=tokens[++now];
		var term2=parseTerm(engine,raw);
		orterm(engine,term,term2.key);
		for (var i in term2.variants){
			term.variants[i]=term2.variants[i];
		}
		term.key+=','+term2.key;
	}
	return term;
}

var getOperator=function(raw) {
	var op='';
	if (raw[0]=='+') op='include';
	if (raw[0]=='-') op='exclude';
	return op;
}
var parsePhrase=function(q) {
	var match=q.match(/(".+?"|'.+?'|\S+)/g)
	match=match.map(function(str){
		var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
		if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
		return str;
	})
	return match;
}
var tibetanNumber={
	"\u0f20":"0","\u0f21":"1","\u0f22":"2",	"\u0f23":"3",	"\u0f24":"4",
	"\u0f25":"5","\u0f26":"6","\u0f27":"7","\u0f28":"8","\u0f29":"9"
}
var parseNumber=function(raw) {
	var n=parseInt(raw,10);
	if (isNaN(n)){
		var converted=[];
		for (var i=0;i<raw.length;i++) {
			var nn=tibetanNumber[raw[i]];
			if (typeof nn !="undefined") converted[i]=nn;
			else break;
		}
		return parseInt(converted,10);
	} else {
		return n;
	}
}
var parseWildcard=function(raw) {
	var n=parseNumber(raw) || 1;
	var qcount=raw.split('?').length-1;
	var scount=raw.split('*').length-1;
	var type='';
	if (qcount) type='?';
	else if (scount) type='*';
	return {wildcard:type, width: n , op:'wildcard'};
}

var newPhrase=function() {
	return {termid:[],posting:[],raw:'',termlength:[]};
} 
var parseQuery=function(q,sep) {
	if (sep && q.indexOf(sep)>-1) {
		var match=q.split(sep);
	} else {
		var match=q.match(/(".+?"|'.+?'|\S+)/g)
		match=match.map(function(str){
			var n=str.length, h=str.charAt(0), t=str.charAt(n-1)
			if (h===t&&(h==='"'|h==="'")) str=str.substr(1,n-2)
			return str
		})
		//console.log(input,'==>',match)		
	}
	return match;
}
var loadPhrase=function(phrase) {
	/* remove leading and ending wildcard */
	var Q=this;
	var cache=Q.engine.postingCache;
	if (cache[phrase.key]) {
		phrase.posting=cache[phrase.key];
		return Q;
	}
	if (phrase.termid.length==1) {
		if (!Q.terms.length){
			phrase.posting=[];
		} else {
			cache[phrase.key]=phrase.posting=Q.terms[phrase.termid[0]].posting;	
		}
		return Q;
	}

	var i=0, r=[],dis=0;
	while(i<phrase.termid.length) {
	  var T=Q.terms[phrase.termid[i]];
		if (0 === i) {
			r = T.posting;
		} else {
		    if (T.op=='wildcard') {
		    	T=Q.terms[phrase.termid[i++]];
		    	var width=T.width;
		    	var wildcard=T.wildcard;
		    	T=Q.terms[phrase.termid[i]];
		    	var mindis=dis;
		    	if (wildcard=='?') mindis=dis+width;
		    	if (T.exclude) r = plist.plnotfollow2(r, T.posting, mindis, dis+width);
		    	else r = plist.plfollow2(r, T.posting, mindis, dis+width);		    	
		    	dis+=(width-1);
		    }else {
		    	if (T.posting) {
		    		if (T.exclude) r = plist.plnotfollow(r, T.posting, dis);
		    		else r = plist.plfollow(r, T.posting, dis);
		    	}
		    }
		}
		dis += phrase.termlength[i];
		i++;
		if (!r) return Q;
  }
  phrase.posting=r;
  cache[phrase.key]=r;
  return Q;
}
var trimSpace=function(engine,query) {
	if (!query) return "";
	var i=0;
	var isSkip=engine.analyzer.isSkip;
	while (isSkip(query[i]) && i<query.length) i++;
	return query.substring(i);
}
var getSegWithHit=function(fileid,offsets) {
	var Q=this,engine=Q.engine;
	var segWithHit=plist.groupbyposting2(Q.byFile[fileid ], offsets);
	if (segWithHit.length) segWithHit.shift(); //the first item is not used (0~Q.byFile[0] )
	var out=[];
	segWithHit.map(function(p,idx){if (p.length) out.push(idx)});
	return out;
}
var segWithHit=function(fileid) {
	var Q=this,engine=Q.engine;
	var offsets=engine.getFileSegOffsets(fileid);
	return getSegWithHit.apply(this,[fileid,offsets]);
}
var isSimplePhrase=function(phrase) {
	var m=phrase.match(/[\?%^]/);
	return !m;
}

// 發菩提心   ==> 發菩  提心       2 2   
// 菩提心     ==> 菩提  提心       1 2
// 劫劫       ==> 劫    劫         1 1   // invalid
// 因緣所生道  ==> 因緣  所生   道   2 2 1
var splitPhrase=function(engine,simplephrase,bigram) {
	var bigram=bigram||engine.get("meta").bigram||[];
	var tokens=engine.analyzer.tokenize(simplephrase).tokens;
	var loadtokens=[],lengths=[],j=0,lastbigrampos=-1;
	while (j+1<tokens.length) {
		var token=engine.analyzer.normalize(tokens[j]);
		var nexttoken=engine.analyzer.normalize(tokens[j+1]);
		var bi=token+nexttoken;
		var i=plist.indexOfSorted(bigram,bi);
		if (bigram[i]==bi) {
			loadtokens.push(bi);
			if (j+3<tokens.length) {
				lastbigrampos=j;
				j++;
			} else {
				if (j+2==tokens.length){ 
					if (lastbigrampos+1==j ) {
						lengths[lengths.length-1]--;
					}
					lastbigrampos=j;
					j++;
				}else {
					lastbigrampos=j;	
				}
			}
			lengths.push(2);
		} else {
			if (!bigram || lastbigrampos==-1 || lastbigrampos+1!=j) {
				loadtokens.push(token);
				lengths.push(1);				
			}
		}
		j++;
	}

	while (j<tokens.length) {
		var token=engine.analyzer.normalize(tokens[j]);
		loadtokens.push(token);
		lengths.push(1);
		j++;
	}

	return {tokens:loadtokens, lengths: lengths , tokenlength: tokens.length};
}
/* host has fast native function */
var fastPhrase=function(engine,phrase) {
	var phrase_term=newPhrase();
	//var tokens=engine.analyzer.tokenize(phrase).tokens;
	var splitted=splitPhrase(engine,phrase);

	var paths=postingPathFromTokens(engine,splitted.tokens);
//create wildcard

	phrase_term.width=splitted.tokenlength; //for excerpt.js to getPhraseWidth

	engine.get(paths,{address:true},function(postingAddress){ //this is sync
		phrase_term.key=phrase;
		var postingAddressWithWildcard=[];
		for (var i=0;i<postingAddress.length;i++) {
			postingAddressWithWildcard.push(postingAddress[i]);
			if (splitted.lengths[i]>1) {
				postingAddressWithWildcard.push([splitted.lengths[i],0]); //wildcard has blocksize==0 
			}
		}
		engine.postingCache[phrase]=engine.mergePostings(postingAddressWithWildcard);
	});
	return phrase_term;
	// put posting into cache[phrase.key]
}
var slowPhrase=function(engine,terms,phrase) {
	var j=0,tokens=engine.analyzer.tokenize(phrase).tokens;
	var phrase_term=newPhrase();
	var termid=0;
	while (j<tokens.length) {
		var raw=tokens[j], termlength=1;
		if (isWildcard(raw)) {
			if (phrase_term.termid.length==0)  { //skip leading wild card
				j++
				continue;
			}
			terms.push(parseWildcard(raw));
			termid=terms.length-1;
			phrase_term.termid.push(termid);
			phrase_term.termlength.push(termlength);
		} else if (isOrTerm(raw)){
			var term=orTerms.apply(this,[tokens,j]);
			if (term) {
				terms.push(term);
				termid=terms.length-1;
				j+=term.key.split(',').length-1;					
			}
			j++;
			phrase_term.termid.push(termid);
			phrase_term.termlength.push(termlength);
		} else {
			var phrase="";
			while (j<tokens.length) {
				if (!(isWildcard(tokens[j]) || isOrTerm(tokens[j]))) {
					phrase+=tokens[j];
					j++;
				} else break;
			}

			var splitted=splitPhrase(engine,phrase);
			for (var i=0;i<splitted.tokens.length;i++) {

				var term=parseTerm(engine,splitted.tokens[i]);
				var termidx=terms.map(function(a){return a.key}).indexOf(term.key);
				if (termidx==-1) {
					terms.push(term);
					termid=terms.length-1;
				} else {
					termid=termidx;
				}				
				phrase_term.termid.push(termid);
				phrase_term.termlength.push(splitted.lengths[i]);
			}
		}
		j++;
	}
	phrase_term.key=phrase;
	//remove ending wildcard
	var P=phrase_term , T=null;
	do {
		T=terms[P.termid[P.termid.length-1]];
		if (!T) break;
		if (T.wildcard) P.termid.pop(); else break;
	} while(T);		
	return phrase_term;
}
var newQuery =function(engine,query,opts) {
	//if (!query) return;
	opts=opts||{};
	query=trimSpace(engine,query);

	var phrases=query,phrases=[];
	if (typeof query=='string' && query) {
		phrases=parseQuery(query,opts.phrase_sep || "");
	}
	
	var phrase_terms=[], terms=[],variants=[],operators=[];
	var pc=0;//phrase count
	for  (var i=0;i<phrases.length;i++) {
		var op=getOperator(phrases[pc]);
		if (op) phrases[pc]=phrases[pc].substring(1);

		/* auto add + for natural order ?*/
		//if (!opts.rank && op!='exclude' &&i) op='include';
		operators.push(op);

		if (isSimplePhrase(phrases[pc]) && engine.mergePostings ) {
			var phrase_term=fastPhrase(engine,phrases[pc]);
		} else {
			var phrase_term=slowPhrase(engine,terms,phrases[pc]);
		}
		phrase_terms.push(phrase_term);

		if (!engine.mergePostings && phrase_terms[pc].termid.length==0) {
			phrase_terms.pop();
		} else pc++;
	}
	opts.op=operators;

	var Q={dbname:engine.dbname,engine:engine,opts:opts,query:query,
		phrases:phrase_terms,terms:terms
	};
	Q.tokenize=function() {return engine.analyzer.tokenize.apply(engine,arguments);}
	Q.isSkip=function() {return engine.analyzer.isSkip.apply(engine,arguments);}
	Q.normalize=function() {return engine.analyzer.normalize.apply(engine,arguments);}
	Q.segWithHit=segWithHit;

	//Q.getRange=function() {return that.getRange.apply(that,arguments)};
	//API.queryid='Q'+(Math.floor(Math.random()*10000000)).toString(16);
	return Q;
}
var postingPathFromTokens=function(engine,tokens) {
	var alltokens=engine.get("tokens");

	var tokenIds=tokens.map(function(t){ return 1+alltokens.indexOf(t)});
	var postingid=[];
	for (var i=0;i<tokenIds.length;i++) {
		postingid.push( tokenIds[i]); // tokenId==0 , empty token
	}
	return postingid.map(function(t){return ["postings",t]});
}
var loadPostings=function(engine,tokens,cb) {
	var toloadtokens=tokens.filter(function(t){
		return !engine.postingCache[t.key]; //already in cache
	});
	if (toloadtokens.length==0) {
		cb();
		return;
	}
	var postingPaths=postingPathFromTokens(engine,tokens.map(function(t){return t.key}));
	engine.get(postingPaths,function(postings){
		postings.map(function(p,i) { tokens[i].posting=p });
		if (cb) cb();
	});
}
var groupBy=function(Q,posting) {
	phrases.forEach(function(P){
		var key=P.key;
		var docfreq=docfreqcache[key];
		if (!docfreq) docfreq=docfreqcache[key]={};
		if (!docfreq[that.groupunit]) {
			docfreq[that.groupunit]={doclist:null,freq:null};
		}		
		if (P.posting) {
			var res=matchPosting(engine,P.posting);
			P.freq=res.freq;
			P.docs=res.docs;
		} else {
			P.docs=[];
			P.freq=[];
		}
		docfreq[that.groupunit]={doclist:P.docs,freq:P.freq};
	});
	return this;
}
var groupByFolder=function(engine,filehits) {
	var files=engine.get("filenames");
	var prevfolder="",hits=0,out=[];
	for (var i=0;i<filehits.length;i++) {
		var fn=files[i];
		var folder=fn.substring(0,fn.indexOf('/'));
		if (prevfolder && prevfolder!=folder) {
			out.push(hits);
			hits=0;
		}
		hits+=filehits[i].length;
		prevfolder=folder;
	}
	out.push(hits);
	return out;
}
var phrase_intersect=function(engine,Q) {
	var intersected=null;
	var fileoffsets=Q.engine.get("fileoffsets");
	var empty=[],emptycount=0,hashit=0;
	for (var i=0;i<Q.phrases.length;i++) {
		var byfile=plist.groupbyposting2(Q.phrases[i].posting,fileoffsets);
		if (byfile.length) byfile.shift();
		if (byfile.length) byfile.pop();
		byfile.pop();
		if (intersected==null) {
			intersected=byfile;
		} else {
			for (var j=0;j<byfile.length;j++) {
				if (!(byfile[j].length && intersected[j].length)) {
					intersected[j]=empty; //reuse empty array
					emptycount++;
				} else hashit++;
			}
		}
	}

	Q.byFile=intersected;
	Q.byFolder=groupByFolder(engine,Q.byFile);
	var out=[];
	//calculate new rawposting
	for (var i=0;i<Q.byFile.length;i++) {
		if (Q.byFile[i].length) out=out.concat(Q.byFile[i]);
	}
	Q.rawresult=out;
	countFolderFile(Q);
}
var countFolderFile=function(Q) {
	Q.fileWithHitCount=0;
	Q.byFile.map(function(f){if (f.length) Q.fileWithHitCount++});
			
	Q.folderWithHitCount=0;
	Q.byFolder.map(function(f){if (f) Q.folderWithHitCount++});
}

var main=function(engine,q,opts,cb){
	var starttime=new Date();
	var meta=engine.get("meta");
	if (meta.normalize && engine.analyzer.setNormalizeTable) {
		meta.normalizeObj=engine.analyzer.setNormalizeTable(meta.normalize,meta.normalizeObj);
	}
	if (typeof opts=="function") cb=opts;
	opts=opts||{};
	var Q=engine.queryCache[q];
	if (!Q) Q=newQuery(engine,q,opts); 
	if (!Q) {
		engine.searchtime=new Date()-starttime;
		engine.totaltime=engine.searchtime;
		if (engine.context) cb.apply(engine.context,["empty result",{rawresult:[]}]);
		else cb("empty result",{rawresult:[]});
		return;
	};
	engine.queryCache[q]=Q;
	if (Q.phrases.length) {
		loadPostings(engine,Q.terms,function(){
			if (!Q.phrases[0].posting) {
				engine.searchtime=new Date()-starttime;
				engine.totaltime=engine.searchtime

				cb.apply(engine.context,["no such posting",{rawresult:[]}]);
				return;			
			}
			
			if (!Q.phrases[0].posting.length) { //
				Q.phrases.forEach(loadPhrase.bind(Q));
			}
			if (Q.phrases.length==1) {
				Q.rawresult=Q.phrases[0].posting;
			} else {
				phrase_intersect(engine,Q);
			}
			var fileoffsets=Q.engine.get("fileoffsets");
			//console.log("search opts "+JSON.stringify(opts));

			if (!Q.byFile && Q.rawresult && !opts.nogroup) {
				Q.byFile=plist.groupbyposting2(Q.rawresult, fileoffsets);
				Q.byFile.shift();Q.byFile.pop();
				Q.byFolder=groupByFolder(engine,Q.byFile);

				countFolderFile(Q);
			}

			if (opts.range) {
				engine.searchtime=new Date()-starttime;
				excerpt.resultlist(engine,Q,opts,function(data) { 
					//console.log("excerpt ok");
					Q.excerpt=data;
					engine.totaltime=new Date()-starttime;
					cb.apply(engine.context,[0,Q]);
				});
			} else {
				engine.searchtime=new Date()-starttime;
				engine.totaltime=new Date()-starttime;
				cb.apply(engine.context,[0,Q]);
			}
		});
	} else { //empty search
		engine.searchtime=new Date()-starttime;
		engine.totaltime=new Date()-starttime;
		cb.apply(engine.context,[0,Q]);
	};
}

main.splitPhrase=splitPhrase; //just for debug
module.exports=main;
},{"./boolsearch":"c:\\ksana2015\\node_modules\\ksana-search\\boolsearch.js","./excerpt":"c:\\ksana2015\\node_modules\\ksana-search\\excerpt.js","./plist":"c:\\ksana2015\\node_modules\\ksana-search\\plist.js"}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\checkbrowser.js":[function(require,module,exports){
/** @jsx React.DOM */
/*
convert to pure js
save -g reactify
*/
var E=React.createElement;

var hasksanagap=(typeof ksanagap!="undefined");
if (hasksanagap && (typeof console=="undefined" || typeof console.log=="undefined")) {
		window.console={log:ksanagap.log,error:ksanagap.error,debug:ksanagap.debug,warn:ksanagap.warn};
		console.log("install console output funciton");
}

var checkfs=function() {
	return (navigator && navigator.webkitPersistentStorage) || hasksanagap;
}
var featurechecks={
	"fs":checkfs
}
var checkbrowser = React.createClass({
	getInitialState:function() {

		var missingFeatures=this.getMissingFeatures();
		return {ready:false, missing:missingFeatures};
	},
	getMissingFeatures:function() {
		var feature=this.props.feature.split(",");
		var status=[];
		feature.map(function(f){
			var checker=featurechecks[f];
			if (checker) checker=checker();
			status.push([f,checker]);
		});
		return status.filter(function(f){return !f[1]});
	},
	downloadbrowser:function() {
		window.location="https://www.google.com/chrome/"
	},
	renderMissing:function() {
		var showMissing=function(m) {
			return E("div", null, m);
		}
		return (
		 E("div", {ref: "dialog1", className: "modal fade", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("button", {type: "button", className: "close", "data-dismiss": "modal", "aria-hidden": "true"}, "×"), 
		          E("h4", {className: "modal-title"}, "Browser Check")
		        ), 
		        E("div", {className: "modal-body"}, 
		          E("p", null, "Sorry but the following feature is missing"), 
		          this.state.missing.map(showMissing)
		        ), 
		        E("div", {className: "modal-footer"}, 
		          E("button", {onClick: this.downloadbrowser, type: "button", className: "btn btn-primary"}, "Download Google Chrome")
		        )
		      )
		    )
		  )
		 );
	},
	renderReady:function() {
		return E("span", null, "browser ok")
	},
	render:function(){
		return  (this.state.missing.length)?this.renderMissing():this.renderReady();
	},
	componentDidMount:function() {
		if (!this.state.missing.length) {
			this.props.onReady();
		} else {
			$(this.refs.dialog1.getDOMNode()).modal('show');
		}
	}
});

module.exports=checkbrowser;
},{}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js":[function(require,module,exports){

var userCancel=false;
var files=[];
var totalDownloadByte=0;
var targetPath="";
var tempPath="";
var nfile=0;
var baseurl="";
var result="";
var downloading=false;
var startDownload=function(dbid,_baseurl,_files) { //return download id
	var fs     = require("fs");
	var path   = require("path");

	
	files=_files.split("\uffff");
	if (downloading) return false; //only one session
	userCancel=false;
	totalDownloadByte=0;
	nextFile();
	downloading=true;
	baseurl=_baseurl;
	if (baseurl[baseurl.length-1]!='/')baseurl+='/';
	targetPath=ksanagap.rootPath+dbid+'/';
	tempPath=ksanagap.rootPath+".tmp/";
	result="";
	return true;
}

var nextFile=function() {
	setTimeout(function(){
		if (nfile==files.length) {
			nfile++;
			endDownload();
		} else {
			downloadFile(nfile++);	
		}
	},100);
}

var downloadFile=function(nfile) {
	var url=baseurl+files[nfile];
	var tmpfilename=tempPath+files[nfile];
	var mkdirp = require("./mkdirp");
	var fs     = require("fs");
	var http   = require("http");

	mkdirp.sync(path.dirname(tmpfilename));
	var writeStream = fs.createWriteStream(tmpfilename);
	var datalength=0;
	var request = http.get(url, function(response) {
		response.on('data',function(chunk){
			writeStream.write(chunk);
			totalDownloadByte+=chunk.length;
			if (userCancel) {
				writeStream.end();
				setTimeout(function(){nextFile();},100);
			}
		});
		response.on("end",function() {
			writeStream.end();
			setTimeout(function(){nextFile();},100);
		});
	});
}

var cancelDownload=function() {
	userCancel=true;
	endDownload();
}
var verify=function() {
	return true;
}
var endDownload=function() {
	nfile=files.length+1;//stop
	result="cancelled";
	downloading=false;
	if (userCancel) return;
	var fs     = require("fs");
	var mkdirp = require("./mkdirp");

	for (var i=0;i<files.length;i++) {
		var targetfilename=targetPath+files[i];
		var tmpfilename   =tempPath+files[i];
		mkdirp.sync(path.dirname(targetfilename));
		fs.renameSync(tmpfilename,targetfilename);
	}
	if (verify()) {
		result="success";
	} else {
		result="error";
	}
}

var downloadedByte=function() {
	return totalDownloadByte;
}
var doneDownload=function() {
	if (nfile>files.length) return result;
	else return "";
}
var downloadingFile=function() {
	return nfile-1;
}

var downloader={startDownload:startDownload, downloadedByte:downloadedByte,
	downloadingFile:downloadingFile, cancelDownload:cancelDownload,doneDownload:doneDownload};
module.exports=downloader;
},{"./mkdirp":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js","fs":false,"http":false,"path":false}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\fileinstaller.js":[function(require,module,exports){
/** @jsx React.DOM */

/* todo , optional kdb */

var HtmlFS=require("./htmlfs");
var html5fs=require("./html5fs");
var CheckBrowser=require("./checkbrowser");
var E=React.createElement;
  

var FileList = React.createClass({
	getInitialState:function() {
		return {downloading:false,progress:0};
	},
	updatable:function(f) {
        var classes="btn btn-warning";
        if (this.state.downloading) classes+=" disabled";
		if (f.hasUpdate) return   E("button", {className: classes, 
			"data-filename": f.filename, "data-url": f.url, 
	            onClick: this.download
	       }, "Update")
		else return null;
	},
	showLocal:function(f) {
        var classes="btn btn-danger";
        if (this.state.downloading) classes+=" disabled";
	  return E("tr", null, E("td", null, f.filename), 
	      E("td", null), 
	      E("td", {className: "pull-right"}, 
	      this.updatable(f), E("button", {className: classes, 
	               onClick: this.deleteFile, "data-filename": f.filename}, "Delete")
	        
	      )
	  )
	},  
	showRemote:function(f) { 
	  var classes="btn btn-warning";
	  if (this.state.downloading) classes+=" disabled";
	  return (E("tr", {"data-id": f.filename}, E("td", null, 
	      f.filename), 
	      E("td", null, f.desc), 
	      E("td", null, 
	      E("span", {"data-filename": f.filename, "data-url": f.url, 
	            className: classes, 
	            onClick: this.download}, "Download")
	      )
	  ));
	},
	showFile:function(f) {
	//	return <span data-id={f.filename}>{f.url}</span>
		return (f.ready)?this.showLocal(f):this.showRemote(f);
	},
	reloadDir:function() {
		this.props.action("reload");
	},
	download:function(e) {
		var url=e.target.dataset["url"];
		var filename=e.target.dataset["filename"];
		this.setState({downloading:true,progress:0,url:url});
		this.userbreak=false;
		html5fs.download(url,filename,function(){
			this.reloadDir();
			this.setState({downloading:false,progress:1});
			},function(progress,total){
				if (progress==0) {
					this.setState({message:"total "+total})
			 	}
			 	this.setState({progress:progress});
			 	//if user press abort return true
			 	return this.userbreak;
			}
		,this);
	},
	deleteFile:function( e) {
		var filename=e.target.attributes["data-filename"].value;
		this.props.action("delete",filename);
	},
	allFilesReady:function(e) {
		return this.props.files.every(function(f){ return f.ready});
	},
	dismiss:function() {
		$(this.refs.dialog1.getDOMNode()).modal('hide');
		this.props.action("dismiss");
	},
	abortdownload:function() {
		this.userbreak=true;
	},
	showProgress:function() {
	     if (this.state.downloading) {
	      var progress=Math.round(this.state.progress*100);
	      return (
	      	E("div", null, 
	      	"Downloading from ", this.state.url, 
	      E("div", {key: "progress", className: "progress col-md-8"}, 
	          E("div", {className: "progress-bar", role: "progressbar", 
	              "aria-valuenow": progress, "aria-valuemin": "0", 
	              "aria-valuemax": "100", style: {width: progress+"%"}}, 
	            progress, "%"
	          )
	        ), 
	        E("button", {onClick: this.abortdownload, 
	        	className: "btn btn-danger col-md-4"}, "Abort")
	        )
	        );
	      } else {
	      		if ( this.allFilesReady() ) {
	      			return E("button", {onClick: this.dismiss, className: "btn btn-success"}, "Ok")
	      		} else return null;
	      		
	      }
	},
	showUsage:function() {
		var percent=this.props.remainPercent;
           return (E("div", null, E("span", {className: "pull-left"}, "Usage:"), E("div", {className: "progress"}, 
		  E("div", {className: "progress-bar progress-bar-success progress-bar-striped", role: "progressbar", style: {width: percent+"%"}}, 
		    	percent+"%"
		  )
		)));
	},
	render:function() {
	  	return (
		E("div", {ref: "dialog1", className: "modal fade", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("h4", {className: "modal-title"}, "File Installer")
		        ), 
		        E("div", {className: "modal-body"}, 
		        	E("table", {className: "table"}, 
		        	E("tbody", null, 
		          	this.props.files.map(this.showFile)
		          	)
		          )
		        ), 
		        E("div", {className: "modal-footer"}, 
		        	this.showUsage(), 
		           this.showProgress()
		        )
		      )
		    )
		  )
		);
	},	
	componentDidMount:function() {
		$(this.refs.dialog1.getDOMNode()).modal('show');
	}
});
/*TODO kdb check version*/
var Filemanager = React.createClass({
	getInitialState:function() {
		var quota=this.getQuota();
		return {browserReady:false,noupdate:true,	requestQuota:quota,remain:0};
	},
	getQuota:function() {
		var q=this.props.quota||"128M";
		var unit=q[q.length-1];
		var times=1;
		if (unit=="M") times=1024*1024;
		else if (unit="K") times=1024;
		return parseInt(q) * times;
	},
	missingKdb:function() {
		if (ksanagap.platform!="chrome") return [];
		var missing=this.props.needed.filter(function(kdb){
			for (var i in html5fs.files) {
				if (html5fs.files[i][0]==kdb.filename) return false;
			}
			return true;
		},this);
		return missing;
	},
	getRemoteUrl:function(fn) {
		var f=this.props.needed.filter(function(f){return f.filename==fn});
		if (f.length ) return f[0].url;
	},
	genFileList:function(existing,missing){
		var out=[];
		for (var i in existing) {
			var url=this.getRemoteUrl(existing[i][0]);
			out.push({filename:existing[i][0], url :url, ready:true });
		}
		for (var i in missing) {
			out.push(missing[i]);
		}
		return out;
	},
	reload:function() {
		html5fs.readdir(function(files){
  			this.setState({files:this.genFileList(files,this.missingKdb())});
  		},this);
	 },
	deleteFile:function(fn) {
	  html5fs.rm(fn,function(){
	  	this.reload();
	  },this);
	},
	onQuoteOk:function(quota,usage) {
		if (ksanagap.platform!="chrome") {
			//console.log("onquoteok");
			this.setState({noupdate:true,missing:[],files:[],autoclose:true
				,quota:quota,remain:quota-usage,usage:usage});
			return;
		}
		//console.log("quote ok");
		var files=this.genFileList(html5fs.files,this.missingKdb());
		var that=this;
		that.checkIfUpdate(files,function(hasupdate) {
			var missing=this.missingKdb();
			var autoclose=this.props.autoclose;
			if (missing.length) autoclose=false;
			that.setState({autoclose:autoclose,
				quota:quota,usage:usage,files:files,
				missing:missing,
				noupdate:!hasupdate,
				remain:quota-usage});
		});
	},  
	onBrowserOk:function() {
	  this.totalDownloadSize();
	}, 
	dismiss:function() {
		this.props.onReady(this.state.usage,this.state.quota);
		setTimeout(function(){
			var modalin=$(".modal.in");
			if (modalin.modal) modalin.modal('hide');
		},500);
	}, 
	totalDownloadSize:function() {
		var files=this.missingKdb();
		var taskqueue=[],totalsize=0;
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) totalsize+=data;
						html5fs.getDownloadSize(files[idx].url,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			totalsize+=data;
			setTimeout(function(){that.setState({requireSpace:totalsize,browserReady:true})},0);
		});
		taskqueue.shift()({__empty:true});
	},
	checkIfUpdate:function(files,cb) {
		var taskqueue=[];
		for (var i=0;i<files.length;i++) {
			taskqueue.push(
				(function(idx){
					return (function(data){
						if (!(typeof data=='object' && data.__empty)) files[idx-1].hasUpdate=data;
						html5fs.checkUpdate(files[idx].url,files[idx].filename,taskqueue.shift());
					});
				})(i)
			);
		}
		var that=this;
		taskqueue.push(function(data){	
			files[files.length-1].hasUpdate=data;
			var hasupdate=files.some(function(f){return f.hasUpdate});
			if (cb) cb.apply(that,[hasupdate]);
		});
		taskqueue.shift()({__empty:true});
	},
	render:function(){
    		if (!this.state.browserReady) {   
      			return E(CheckBrowser, {feature: "fs", onReady: this.onBrowserOk})
    		} if (!this.state.quota || this.state.remain<this.state.requireSpace) {  
    			var quota=this.state.requestQuota;
    			if (this.state.usage+this.state.requireSpace>quota) {
    				quota=(this.state.usage+this.state.requireSpace)*1.5;
    			}
      			return E(HtmlFS, {quota: quota, autoclose: "true", onReady: this.onQuoteOk})
      		} else {
			if (!this.state.noupdate || this.missingKdb().length || !this.state.autoclose) {
				var remain=Math.round((this.state.usage/this.state.quota)*100);				
				return E(FileList, {action: this.action, files: this.state.files, remainPercent: remain})
			} else {
				setTimeout( this.dismiss ,0);
				return E("span", null, "Success");
			}
      		}
	},
	action:function() {
	  var args = Array.prototype.slice.call(arguments);
	  var type=args.shift();
	  var res=null, that=this;
	  if (type=="delete") {
	    this.deleteFile(args[0]);
	  }  else if (type=="reload") {
	  	this.reload();
	  } else if (type=="dismiss") {
	  	this.dismiss();
	  }
	}
});

module.exports=Filemanager;
},{"./checkbrowser":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\checkbrowser.js","./html5fs":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js","./htmlfs":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\htmlfs.js"}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js":[function(require,module,exports){
/* emulate filesystem on html5 browser */
var get_head=function(url,field,cb){
	var xhr = new XMLHttpRequest();
	xhr.open("HEAD", url, true);
	xhr.onreadystatechange = function() {
			if (this.readyState == this.DONE) {
				cb(xhr.getResponseHeader(field));
			} else {
				if (this.status!==200&&this.status!==206) {
					cb("");
				}
			} 
	};
	xhr.send();	
}
var get_date=function(url,cb) {
	get_head(url,"Last-Modified",function(value){
		cb(value);
	});
}
var get_size=function(url, cb) {
	get_head(url,"Content-Length",function(value){
		cb(parseInt(value));
	});
};
var checkUpdate=function(url,fn,cb) {
	if (!url) {
		cb(false);
		return;
	}
	get_date(url,function(d){
		API.fs.root.getFile(fn, {create: false, exclusive: false}, function(fileEntry) {
			fileEntry.getMetadata(function(metadata){
				var localDate=Date.parse(metadata.modificationTime);
				var urlDate=Date.parse(d);
				cb(urlDate>localDate);
			});
		},function(){
			cb(false);
		});
	});
}
var download=function(url,fn,cb,statuscb,context) {
	 var totalsize=0,batches=null,written=0;
	 var fileEntry=0, fileWriter=0;
	 var createBatches=function(size) {
		var bytes=1024*1024, out=[];
		var b=Math.floor(size / bytes);
		var last=size %bytes;
		for (var i=0;i<=b;i++) {
			out.push(i*bytes);
		}
		out.push(b*bytes+last);
		return out;
	 }
	 var finish=function() {
		 rm(fn,function(){
				fileEntry.moveTo(fileEntry.filesystem.root, fn,function(){
					setTimeout( cb.bind(context,false) , 0) ; 
				},function(e){
					console.log("failed",e)
				});
		 },this); 
	 };
		var tempfn="temp.kdb";
		var batch=function(b) {
		var abort=false;
		var xhr = new XMLHttpRequest();
		var requesturl=url+"?"+Math.random();
		xhr.open('get', requesturl, true);
		xhr.setRequestHeader('Range', 'bytes='+batches[b]+'-'+(batches[b+1]-1));
		xhr.responseType = 'blob';    
		xhr.addEventListener('load', function() {
			var blob=this.response;
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.seek(fileWriter.length);
				fileWriter.write(blob);
				written+=blob.size;
				fileWriter.onwriteend = function(e) {
					if (statuscb) {
						abort=statuscb.apply(context,[ fileWriter.length / totalsize,totalsize ]);
						if (abort) setTimeout( cb.bind(context,false) , 0) ;
				 	}
					b++;
					if (!abort) {
						if (b<batches.length-1) setTimeout(batch.bind(context,b),0);
						else                    finish();
				 	}
			 	};
			}, console.error);
		},false);
		xhr.send();
	}

	get_size(url,function(size){
		totalsize=size;
		if (!size) {
			if (cb) cb.apply(context,[false]);
		} else {//ready to download
			rm(tempfn,function(){
				 batches=createBatches(size);
				 if (statuscb) statuscb.apply(context,[ 0, totalsize ]);
				 API.fs.root.getFile(tempfn, {create: 1, exclusive: false}, function(_fileEntry) {
							fileEntry=_fileEntry;
						batch(0);
				 });
			},this);
		}
	});
}

var readFile=function(filename,cb,context) {
	API.fs.root.getFile(filename, function(fileEntry) {
			var reader = new FileReader();
			reader.onloadend = function(e) {
					if (cb) cb.apply(cb,[this.result]);
				};            
	}, console.error);
}
var writeFile=function(filename,buf,cb,context){
	API.fs.root.getFile(filename, {create: true, exclusive: true}, function(fileEntry) {
			fileEntry.createWriter(function(fileWriter) {
				fileWriter.write(buf);
				fileWriter.onwriteend = function(e) {
					if (cb) cb.apply(cb,[buf.byteLength]);
				};            
			}, console.error);
	}, console.error);
}

var readdir=function(cb,context) {
	var dirReader = API.fs.root.createReader();
	var out=[],that=this;
	dirReader.readEntries(function(entries) {
		if (entries.length) {
			for (var i = 0, entry; entry = entries[i]; ++i) {
				if (entry.isFile) {
					out.push([entry.name,entry.toURL ? entry.toURL() : entry.toURI()]);
				}
			}
		}
		API.files=out;
		if (cb) cb.apply(context,[out]);
	}, function(){
		if (cb) cb.apply(context,[null]);
	});
}
var getFileURL=function(filename) {
	if (!API.files ) return null;
	var file= API.files.filter(function(f){return f[0]==filename});
	if (file.length) return file[0][1];
}
var rm=function(filename,cb,context) {
	var url=getFileURL(filename);
	if (url) rmURL(url,cb,context);
	else if (cb) cb.apply(context,[false]);
}

var rmURL=function(filename,cb,context) {
	webkitResolveLocalFileSystemURL(filename, function(fileEntry) {
		fileEntry.remove(function() {
			if (cb) cb.apply(context,[true]);
		}, console.error);
	},  function(e){
		if (cb) cb.apply(context,[false]);//no such file
	});
}
function errorHandler(e) {
	console.error('Error: ' +e.name+ " "+e.message);
}
var initfs=function(grantedBytes,cb,context) {
	webkitRequestFileSystem(PERSISTENT, grantedBytes,  function(fs) {
		API.fs=fs;
		API.quota=grantedBytes;
		readdir(function(){
			API.initialized=true;
			cb.apply(context,[grantedBytes,fs]);
		},context);
	}, errorHandler);
}
var init=function(quota,cb,context) {
	navigator.webkitPersistentStorage.requestQuota(quota, 
			function(grantedBytes) {
				initfs(grantedBytes,cb,context);
		}, errorHandler
	);
}
var queryQuota=function(cb,context) {
	var that=this;
	navigator.webkitPersistentStorage.queryUsageAndQuota( 
	 function(usage,quota){
			initfs(quota,function(){
				cb.apply(context,[usage,quota]);
			},context);
	});
}
var API={
	init:init
	,readdir:readdir
	,checkUpdate:checkUpdate
	,rm:rm
	,rmURL:rmURL
	,getFileURL:getFileURL
	,writeFile:writeFile
	,readFile:readFile
	,download:download
	,get_head:get_head
	,get_date:get_date
	,get_size:get_size
	,getDownloadSize:get_size
	,queryQuota:queryQuota
}
module.exports=API;
},{}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\htmlfs.js":[function(require,module,exports){
var html5fs=require("./html5fs");
var E=React.createElement;

var htmlfs = React.createClass({
	getInitialState:function() { 
		return {ready:false, quota:0,usage:0,Initialized:false,autoclose:this.props.autoclose};
	},
	initFilesystem:function() {
		var quota=this.props.quota||1024*1024*128; // default 128MB
		quota=parseInt(quota);
		html5fs.init(quota,function(q){
			this.dialog=false;
			$(this.refs.dialog1.getDOMNode()).modal('hide');
			this.setState({quota:q,autoclose:true});
		},this);
	},
	welcome:function() {
		return (
		E("div", {ref: "dialog1", className: "modal fade", id: "myModal", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("h4", {className: "modal-title"}, "Welcome")
		        ), 
		        E("div", {className: "modal-body"}, 
		          "Browser will ask for your confirmation."
		        ), 
		        E("div", {className: "modal-footer"}, 
		          E("button", {onClick: this.initFilesystem, type: "button", 
		            className: "btn btn-primary"}, "Initialize File System")
		        )
		      )
		    )
		  )
		 );
	},
	renderDefault:function(){
		var used=Math.floor(this.state.usage/this.state.quota *100);
		var more=function() {
			if (used>50) return E("button", {type: "button", className: "btn btn-primary"}, "Allocate More");
			else null;
		}
		return (
		E("div", {ref: "dialog1", className: "modal fade", id: "myModal", "data-backdrop": "static"}, 
		    E("div", {className: "modal-dialog"}, 
		      E("div", {className: "modal-content"}, 
		        E("div", {className: "modal-header"}, 
		          E("h4", {className: "modal-title"}, "Sandbox File System")
		        ), 
		        E("div", {className: "modal-body"}, 
		          E("div", {className: "progress"}, 
		            E("div", {className: "progress-bar", role: "progressbar", style: {width: used+"%"}}, 
		               used, "%"
		            )
		          ), 
		          E("span", null, this.state.quota, " total , ", this.state.usage, " in used")
		        ), 
		        E("div", {className: "modal-footer"}, 
		          E("button", {onClick: this.dismiss, type: "button", className: "btn btn-default", "data-dismiss": "modal"}, "Close"), 
		          more()
		        )
		      )
		    )
		  )
		  );
	},
	dismiss:function() {
		var that=this;
		setTimeout(function(){
			that.props.onReady(that.state.quota,that.state.usage);	
		},0);
	},
	queryQuota:function() {
		if (ksanagap.platform=="chrome") {
			html5fs.queryQuota(function(usage,quota){
				this.setState({usage:usage,quota:quota,initialized:true});
			},this);			
		} else {
			this.setState({usage:333,quota:1000*1000*1024,initialized:true,autoclose:true});
		}
	},
	render:function() {
		var that=this;
		if (!this.state.quota || this.state.quota<this.props.quota) {
			if (this.state.initialized) {
				this.dialog=true;
				return this.welcome();	
			} else {
				return E("span", null, "checking quota");
			}			
		} else {
			if (!this.state.autoclose) {
				this.dialog=true;
				return this.renderDefault(); 
			}
			this.dismiss();
			this.dialog=false;
			return null;
		}
	},
	componentDidMount:function() {
		if (!this.state.quota) {
			this.queryQuota();

		};
	},
	componentDidUpdate:function() {
		if (this.dialog) $(this.refs.dialog1.getDOMNode()).modal('show');
	}
});

module.exports=htmlfs;
},{"./html5fs":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js"}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\index.js":[function(require,module,exports){
var ksana={"platform":"remote"};
if (typeof window!="undefined") {
	window.ksana=ksana;
	if (typeof ksanagap=="undefined") {
		window.ksanagap=require("./ksanagap"); //compatible layer with mobile
	}
}
if (typeof process !="undefined") {
	if (process.versions && process.versions["node-webkit"]) {
  		if (typeof nodeRequire!="undefined") ksana.require=nodeRequire;
  		ksana.platform="node-webkit";
  		window.ksanagap.platform="node-webkit";
		var ksanajs=require("fs").readFileSync("ksana.js","utf8").trim();
		ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
		window.kfs=require("./kfs");
  	}
} else if (typeof chrome!="undefined"){//} && chrome.fileSystem){
//	window.ksanagap=require("./ksanagap"); //compatible layer with mobile
	window.ksanagap.platform="chrome";
	window.kfs=require("./kfs_html5");
	require("./livereload")();
	ksana.platform="chrome";
} else {
	if (typeof ksanagap!="undefined" && typeof fs!="undefined") {//mobile
		var ksanajs=fs.readFileSync("ksana.js","utf8").trim(); //android extra \n at the end
		ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
		ksana.platform=ksanagap.platform;
		if (typeof ksanagap.android !="undefined") {
			ksana.platform="android";
		}
	}
}
var timer=null;
var boot=function(appId,cb) {
	ksana.appId=appId;
	if (ksanagap.platform=="chrome") { //need to wait for jsonp ksana.js
		timer=setInterval(function(){
			if (ksana.ready){
				clearInterval(timer);
				if (ksana.js && ksana.js.files && ksana.js.files.length) {
					require("./installkdb")(ksana.js,cb);
				} else {
					cb();		
				}
			}
		},300);
	} else {
		cb();
	}
}

module.exports={boot:boot
	,htmlfs:require("./htmlfs")
	,html5fs:require("./html5fs")
	,liveupdate:require("./liveupdate")
	,fileinstaller:require("./fileinstaller")
	,downloader:require("./downloader")
	,installkdb:require("./installkdb")
};
},{"./downloader":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js","./fileinstaller":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\fileinstaller.js","./html5fs":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js","./htmlfs":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\htmlfs.js","./installkdb":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\installkdb.js","./kfs":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs.js","./kfs_html5":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs_html5.js","./ksanagap":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js","./livereload":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js","./liveupdate":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\liveupdate.js","fs":false}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\installkdb.js":[function(require,module,exports){
var Fileinstaller=require("./fileinstaller");

var getRequire_kdb=function() {
    var required=[];
    ksana.js.files.map(function(f){
      if (f.indexOf(".kdb")==f.length-4) {
        var slash=f.lastIndexOf("/");
        if (slash>-1) {
          var dbid=f.substring(slash+1,f.length-4);
          required.push({url:f,dbid:dbid,filename:dbid+".kdb"});
        } else {
          var dbid=f.substring(0,f.length-4);
          required.push({url:ksana.js.baseurl+f,dbid:dbid,filename:f});
        }        
      }
    });
    return required;
}
var callback=null;
var onReady=function() {
	callback();
}
var openFileinstaller=function(keep) {
	var require_kdb=getRequire_kdb().map(function(db){
	  return {
	    url:window.location.origin+window.location.pathname+db.dbid+".kdb",
	    dbdb:db.dbid,
	    filename:db.filename
	  }
	})
	return React.createElement(Fileinstaller, {quota: "512M", autoclose: !keep, needed: require_kdb, 
	                 onReady: onReady});
}
var installkdb=function(ksanajs,cb,context) {
	console.log(ksanajs.files);
	React.render(openFileinstaller(),document.getElementById("main"));
	callback=cb;
}
module.exports=installkdb;
},{"./fileinstaller":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\fileinstaller.js"}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs.js":[function(require,module,exports){
//Simulate feature in ksanagap
/* 
  runs on node-webkit only
*/

var readDir=function(path) { //simulate Ksanagap function
	var fs=nodeRequire("fs");
	path=path||"..";
	var dirs=[];
	if (path[0]==".") {
		if (path==".") dirs=fs.readdirSync(".");
		else {
			dirs=fs.readdirSync("..");
		}
	} else {
		dirs=fs.readdirSync(path);
	}

	return dirs.join("\uffff");
}
var listApps=function() {
	var fs=nodeRequire("fs");
	var ksanajsfile=function(d) {return "../"+d+"/ksana.js"};
	var dirs=fs.readdirSync("..").filter(function(d){
				return fs.statSync("../"+d).isDirectory() && d[0]!="."
				   && fs.existsSync(ksanajsfile(d));
	});
	
	var out=dirs.map(function(d){
		var content=fs.readFileSync(ksanajsfile(d),"utf8");
  	content=content.replace("})","}");
  	content=content.replace("jsonp_handler(","");
		var obj= JSON.parse(content);
		obj.dbid=d;
		obj.path=d;
		return obj;
	})
	return JSON.stringify(out);
}



var kfs={readDir:readDir,listApps:listApps};

module.exports=kfs;
},{}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\kfs_html5.js":[function(require,module,exports){
var readDir=function(){
	return [];
}
var listApps=function(){
	return [];
}
module.exports={readDir:readDir,listApps:listApps};
},{}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\ksanagap.js":[function(require,module,exports){
var appname="installer";
var switchApp=function(path) {
	var fs=require("fs");
	path="../"+path;
	appname=path;
	document.location.href= path+"/index.html"; 
	process.chdir(path);
}
var downloader={};
var rootPath="";

var deleteApp=function(app) {
	console.error("not allow on PC, do it in File Explorer/ Finder");
}
var username=function() {
	return "";
}
var useremail=function() {
	return ""
}
var runtime_version=function() {
	return "1.4";
}

//copy from liveupdate
var jsonp=function(url,dbid,callback,context) {
  var script=document.getElementById("jsonp2");
  if (script) {
    script.parentNode.removeChild(script);
  }
  window.jsonp_handler=function(data) {
    if (typeof data=="object") {
      data.dbid=dbid;
      callback.apply(context,[data]);    
    }  
  }
  window.jsonp_error_handler=function() {
    console.error("url unreachable",url);
    callback.apply(context,[null]);
  }
  script=document.createElement('script');
  script.setAttribute('id', "jsonp2");
  script.setAttribute('onerror', "jsonp_error_handler()");
  url=url+'?'+(new Date().getTime());
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script); 
}

var ksanagap={
	platform:"node-webkit",
	startDownload:downloader.startDownload,
	downloadedByte:downloader.downloadedByte,
	downloadingFile:downloader.downloadingFile,
	cancelDownload:downloader.cancelDownload,
	doneDownload:downloader.doneDownload,
	switchApp:switchApp,
	rootPath:rootPath,
	deleteApp: deleteApp,
	username:username, //not support on PC
	useremail:username,
	runtime_version:runtime_version,
	
}

if (typeof process!="undefined") {
	var ksanajs=require("fs").readFileSync("./ksana.js","utf8").trim();
	downloader=require("./downloader");
	console.log(ksanajs);
	//ksana.js=JSON.parse(ksanajs.substring(14,ksanajs.length-1));
	rootPath=process.cwd();
	rootPath=require("path").resolve(rootPath,"..").replace(/\\/g,"/")+'/';
	ksana.ready=true;
} else{
	var url=window.location.origin+window.location.pathname.replace("index.html","")+"ksana.js";
	jsonp(url,appname,function(data){
		ksana.js=data;
		ksana.ready=true;
	});
}
module.exports=ksanagap;
},{"./downloader":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\downloader.js","fs":false,"path":false}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\livereload.js":[function(require,module,exports){
var started=false;
var timer=null;
var bundledate=null;
var get_date=require("./html5fs").get_date;
var checkIfBundleUpdated=function() {
	get_date("bundle.js",function(date){
		if (bundledate &&bundledate!=date){
			location.reload();
		}
		bundledate=date;
	});
}
var livereload=function() {
	if (started) return;

	timer1=setInterval(function(){
		checkIfBundleUpdated();
	},2000);
	started=true;
}

module.exports=livereload;
},{"./html5fs":"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\html5fs.js"}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\liveupdate.js":[function(require,module,exports){

var jsonp=function(url,dbid,callback,context) {
  var script=document.getElementById("jsonp");
  if (script) {
    script.parentNode.removeChild(script);
  }
  window.jsonp_handler=function(data) {
    //console.log("receive from ksana.js",data);
    if (typeof data=="object") {
      if (typeof data.dbid=="undefined") {
        data.dbid=dbid;
      }
      callback.apply(context,[data]);
    }  
  }

  window.jsonp_error_handler=function() {
    console.error("url unreachable",url);
    callback.apply(context,[null]);
  }

  script=document.createElement('script');
  script.setAttribute('id', "jsonp");
  script.setAttribute('onerror', "jsonp_error_handler()");
  url=url+'?'+(new Date().getTime());
  script.setAttribute('src', url);
  document.getElementsByTagName('head')[0].appendChild(script); 
}
var runtime_version_ok=function(minruntime) {
  if (!minruntime) return true;//not mentioned.
  var min=parseFloat(minruntime);
  var runtime=parseFloat( ksanagap.runtime_version()||"1.0");
  if (min>runtime) return false;
  return true;
}

var needToUpdate=function(fromjson,tojson) {
  var needUpdates=[];
  for (var i=0;i<fromjson.length;i++) { 
    var to=tojson[i];
    var from=fromjson[i];
    var newfiles=[],newfilesizes=[],removed=[];
    
    if (!to) continue; //cannot reach host
    if (!runtime_version_ok(to.minruntime)) {
      console.warn("runtime too old, need "+to.minruntime);
      continue; 
    }
    if (!from.filedates) {
      console.warn("missing filedates in ksana.js of "+from.dbid);
      continue;
    }
    from.filedates.map(function(f,idx){
      var newidx=to.files.indexOf( from.files[idx]);
      if (newidx==-1) {
        //file removed in new version
        removed.push(from.files[idx]);
      } else {
        var fromdate=Date.parse(f);
        var todate=Date.parse(to.filedates[newidx]);
        if (fromdate<todate) {
          newfiles.push( to.files[newidx] );
          newfilesizes.push(to.filesizes[newidx]);
        }        
      }
    });
    if (newfiles.length) {
      from.newfiles=newfiles;
      from.newfilesizes=newfilesizes;
      from.removed=removed;
      needUpdates.push(from);
    }
  }
  return needUpdates;
}
var getUpdatables=function(apps,cb,context) {
  getRemoteJson(apps,function(jsons){
    var hasUpdates=needToUpdate(apps,jsons);
    cb.apply(context,[hasUpdates]);
  },context);
}
var getRemoteJson=function(apps,cb,context) {
  var taskqueue=[],output=[];
  var makecb=function(app){
    return function(data){
        if (!(data && typeof data =='object' && data.__empty)) output.push(data);
        if (!app.baseurl) {
          taskqueue.shift({__empty:true});
        } else {
          var url=app.baseurl+"/ksana.js";    
          console.log(url);
          jsonp( url ,app.dbid,taskqueue.shift(), context);           
        }
    };
  };
  apps.forEach(function(app){taskqueue.push(makecb(app))});

  taskqueue.push(function(data){
    output.push(data);
    cb.apply(context,[output]);
  });

  taskqueue.shift()({__empty:true}); //run the task
}
var humanFileSize=function(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(bytes < thresh) return bytes + ' B';
    var units = si ? ['kB','MB','GB','TB','PB','EB','ZB','YB'] : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(bytes >= thresh);
    return bytes.toFixed(1)+' '+units[u];
};

var start=function(ksanajs,cb,context){
  var files=ksanajs.newfiles||ksanajs.files;
  var baseurl=ksanajs.baseurl|| "http://127.0.0.1:8080/"+ksanajs.dbid+"/";
  var started=ksanagap.startDownload(ksanajs.dbid,baseurl,files.join("\uffff"));
  cb.apply(context,[started]);
}
var status=function(){
  var nfile=ksanagap.downloadingFile();
  var downloadedByte=ksanagap.downloadedByte();
  var done=ksanagap.doneDownload();
  return {nfile:nfile,downloadedByte:downloadedByte, done:done};
}

var cancel=function(){
  return ksanagap.cancelDownload();
}

var liveupdate={ humanFileSize: humanFileSize, 
  needToUpdate: needToUpdate , jsonp:jsonp, 
  getUpdatables:getUpdatables,
  start:start,
  cancel:cancel,
  status:status
  };
module.exports=liveupdate;
},{}],"c:\\ksana2015\\node_modules\\ksana2015-webruntime\\mkdirp.js":[function(require,module,exports){
function mkdirP (p, mode, f, made) {
     var path = nodeRequire('path');
     var fs = nodeRequire('fs');
	
    if (typeof mode === 'function' || mode === undefined) {
        f = mode;
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    var cb = f || function () {};
    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    fs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                mkdirP(path.dirname(p), mode, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, mode, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                fs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, mode, made) {
    var path = nodeRequire('path');
    var fs = nodeRequire('fs');
    if (mode === undefined) {
        mode = 0x1FF & (~process.umask());
    }
    if (!made) made = null;

    if (typeof mode === 'string') mode = parseInt(mode, 8);
    p = path.resolve(p);

    try {
        fs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), mode, made);
                sync(p, mode, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = fs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

},{}]},{},["c:\\ksana2015\\moedict-yu\\index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcVXNlcnNcXGNoZWFoc2hlblxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsImluZGV4LmpzIiwic3JjXFxhcGkuanMiLCJzcmNcXGRlZmJveC5qc3giLCJzcmNcXG1haW4uanN4Iiwic3JjXFxvdmVydmlldy5qc3giLCJzcmNcXHNlYXJjaGJhci5qc3giLCJzcmNcXHNlYXJjaGhpc3RvcnkuanN4Iiwic3JjXFxzaG93dGV4dC5qc3giLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYS1hbmFseXplclxcY29uZmlncy5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLWFuYWx5emVyXFxpbmRleC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLWFuYWx5emVyXFx0b2tlbml6ZXJzLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEtZGF0YWJhc2VcXGJzZWFyY2guanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYS1kYXRhYmFzZVxcaW5kZXguanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYS1kYXRhYmFzZVxca2RlLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEtZGF0YWJhc2VcXGxpc3RrZGIuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYS1kYXRhYmFzZVxccGxhdGZvcm0uanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYS1qc29ucm9tXFxodG1sNXJlYWQuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYS1qc29ucm9tXFxpbmRleC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLWpzb25yb21cXGtkYi5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLWpzb25yb21cXGtkYmZzLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEtanNvbnJvbVxca2RiZnNfYW5kcm9pZC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLWpzb25yb21cXGtkYmZzX2lvcy5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLXNlYXJjaFxcYm9vbHNlYXJjaC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLXNlYXJjaFxcZXhjZXJwdC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hLXNlYXJjaFxcaW5kZXguanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYS1zZWFyY2hcXHBsaXN0LmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEtc2VhcmNoXFxzZWFyY2guanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxcY2hlY2ticm93c2VyLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXGRvd25sb2FkZXIuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxcZmlsZWluc3RhbGxlci5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxodG1sNWZzLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXGh0bWxmcy5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxpbmRleC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxpbnN0YWxsa2RiLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXGtmcy5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxrZnNfaHRtbDUuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxca3NhbmFnYXAuanMiLCIuLlxcbm9kZV9tb2R1bGVzXFxrc2FuYTIwMTUtd2VicnVudGltZVxcbGl2ZXJlbG9hZC5qcyIsIi4uXFxub2RlX21vZHVsZXNcXGtzYW5hMjAxNS13ZWJydW50aW1lXFxsaXZldXBkYXRlLmpzIiwiLi5cXG5vZGVfbW9kdWxlc1xca3NhbmEyMDE1LXdlYnJ1bnRpbWVcXG1rZGlycC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQzdGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xrQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJ1bnRpbWU9cmVxdWlyZShcImtzYW5hMjAxNS13ZWJydW50aW1lXCIpO1xyXG5ydW50aW1lLmJvb3QoXCJtb2VkaWN0LXl1XCIsZnVuY3Rpb24oKXtcclxuXHR2YXIgTWFpbj1SZWFjdC5jcmVhdGVFbGVtZW50KHJlcXVpcmUoXCIuL3NyYy9tYWluLmpzeFwiKSk7XHJcblx0a3NhbmEubWFpbkNvbXBvbmVudD1SZWFjdC5yZW5kZXIoTWFpbixkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xyXG59KTsiLCJ2YXIgaW5kZXhPZlNvcnRlZCA9IGZ1bmN0aW9uIChhcnJheSwgb2JqKSB7IFxyXG4gICAgdmFyIGxvdyA9IDAsXHJcbiAgICBoaWdoID0gYXJyYXkubGVuZ3RoLTE7XHJcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xyXG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XHJcbiAgICAgIGFycmF5W21pZF0gPCBvYmogPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcclxuICAgIH1cclxuICAgIC8vaWYoYXJyYXlbbG93XSAhPSBvYmopIHJldHVybiBudWxsO1xyXG4gICAgcmV0dXJuIGxvdztcclxuIH1cclxuXHJcbiB2YXIgdGVzdCA9IGZ1bmN0aW9uKGlucHV0KSB7XHJcbiBcdGNvbnNvbGUubG9nKGlucHV0KTtcclxuIH1cclxuXHJcbiB2YXIgYXBpPXt0ZXN0OnRlc3QsaW5kZXhPZlNvcnRlZDppbmRleE9mU29ydGVkfTtcclxuXHJcbm1vZHVsZS5leHBvcnRzPWFwaTsiLCJ2YXIgRGVmYm94PVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJEZWZib3hcIixcclxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gIFx0cmV0dXJuIHtkZWZpbml0aW9uOltdLHNlYXJjaFJlc3VsdDpbXSx0b2ZpbmRzOltdfTtcclxuICB9LFxyXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xyXG4gICAgdmFyIGQ9bmV4dFByb3BzLmRlZnM7IC8v57WQ5qeL54K6W1tkZWYxLGVudHJ5MV0sW2RlZjIsZW50cnkyXS4uLl1cclxuICAgIHZhciBkZWZzPVtdO1xyXG4gICAgdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHQ9W107XHJcbiAgICBpZihkLmxlbmd0aCE9MCkge1xyXG4gICAgICBmb3IodmFyIGk9MDsgaTxkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgdmFyIHQ9ZFtpXVswXS5zcGxpdChcIlxcblwiKTtcclxuICAgICAgICB2YXIgdGl0bGU9JzxzcGFuIGNsYXNzPVwidGl0bGVcIj4nK3RbMF0rJzwvc3Bhbj4nO1xyXG4gICAgICAgIGRlZnMucHVzaCh0aXRsZSk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHQucHVzaChbdFswXSxkW2ldWzFdXSk7XHJcbiAgICAgICAgZm9yKHZhciBqPTE7IGo8dC5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgdmFyIHQxPXRoaXMucmVuZGVyRGVmKHRbal0sZFtpXVsxXSk7XHJcbiAgICAgICAgICBkZWZzLnB1c2godDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGVmaW5pdGlvbjpkZWZzfSk7XHJcbiAgfSxcclxuICByZW5kZXJEZWY6IGZ1bmN0aW9uKGl0ZW0sZSkge1xyXG4gICAgdmFyIHBhcnNlZEl0ZW09aXRlbS5yZXBsYWNlKC8uL2csZnVuY3Rpb24ocil7XHJcbiAgICAgICAgcmV0dXJuICc8c3BhbiBkYXRhLWVudHJ5PScrZSsnPicrcisnPC9zcGFuPic7XHJcbiAgICAgIH0pO1xyXG4gICAgcmV0dXJuIHBhcnNlZEl0ZW07XHJcbiAgfSxcclxuICBkb3NlYXJjaF9oaXN0b3J5OiBmdW5jdGlvbihlKSB7XHJcbiAgICB2YXIgZW50cnlJbmRleD1lLnRhcmdldC5kYXRhc2V0LmVudHJ5O1xyXG4gICAgdmFyIHRvZmluZD1lLnRhcmdldC50ZXh0Q29udGVudDtcclxuICAgIHZhciBuZXh0PWUudGFyZ2V0Lm5leHRTaWJsaW5nO1xyXG4gICAgdmFyIHRmPXRoaXMuc3RhdGUudG9maW5kcztcclxuICAgIGZvcih2YXIgaT0wOyBpPDEwOyBpKyspe1xyXG4gICAgICBpZighbmV4dCB8fCBuZXh0LnRleHRDb250ZW50Lm1hdGNoKC9b44CC77yM44CB44CM44CN77yaXS9nKSkgYnJlYWs7ICBcclxuICAgICAgdG9maW5kKz1uZXh0LnRleHRDb250ZW50O1xyXG4gICAgICBuZXh0PW5leHQubmV4dFNpYmxpbmc7XHJcbiAgICB9XHJcbiAgICBpZih0Zi5sZW5ndGg9PTApIHRmLnB1c2godGhpcy5zdGF0ZS5zZWFyY2hSZXN1bHRbMF1bMF0pO1xyXG4gICAgdGYucHVzaCh0b2ZpbmQpO1xyXG4gICAgaWYoZW50cnlJbmRleCkge1xyXG4gICAgICB0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdC5tYXAoZnVuY3Rpb24oaXRlbSl7aXRlbS5wdXNoKHRmW3RmLmxlbmd0aC0yXSl9KTtcclxuICAgICAgdGhpcy5wcm9wcy5wdXNoSGlzdG9yeSh0aGlzLnN0YXRlLnNlYXJjaFJlc3VsdCxlbnRyeUluZGV4KTtcclxuICAgIH1cclxuICAgIHRoaXMucHJvcHMuZG9zZWFyY2godG9maW5kKTtcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4oXHJcblx0IFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge29uQ2xpY2s6IHRoaXMuZG9zZWFyY2hfaGlzdG9yeX0sIFxyXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtkYW5nZXJvdXNseVNldElubmVySFRNTDoge19faHRtbDogdGhpcy5zdGF0ZS5kZWZpbml0aW9uLmpvaW4oXCI8YnI+XCIpfX0pXHJcblx0IClcdFxyXG4gICAgKTsgXHJcbiAgfVxyXG59KTtcclxubW9kdWxlLmV4cG9ydHM9RGVmYm94OyIsInZhciBrc2U9cmVxdWlyZShcImtzYW5hLXNlYXJjaFwiKTtcclxudmFyIGtkZT1yZXF1aXJlKFwia3NhbmEtZGF0YWJhc2VcIik7XHJcbnZhciBhcGk9cmVxdWlyZShcIi4vYXBpXCIpO1xyXG52YXIgU2hvd3RleHQ9cmVxdWlyZShcIi4vc2hvd3RleHQuanN4XCIpO1xyXG52YXIgU2VhcmNoYmFyPXJlcXVpcmUoXCIuL3NlYXJjaGJhci5qc3hcIik7XHJcbnZhciBPdmVydmlldz1yZXF1aXJlKFwiLi9vdmVydmlldy5qc3hcIik7XHJcbnZhciBtYWluY29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIm1haW5jb21wb25lbnRcIixcclxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgIGtkZS5vcGVuKFwibW9lZGljdFwiLGZ1bmN0aW9uKGVycixkYil7XHJcbiAgICAgIHZhciBlbnRyaWVzPWRiLmdldChcInNlZ25hbWVzXCIpO1xyXG4gICAgICB0aGF0LnNldFN0YXRlKHtlbnRyaWVzOmVudHJpZXMsZGI6ZGJ9KTtcclxuICAgIH0pOyAgICBcclxuICBcdHJldHVybiB7ZW50cmllczpbXSxyZXN1bHQ6W1wi5pCc5bCL57WQ5p6c5YiX6KGoXCJdLHNlYXJjaHR5cGU6XCJzdGFydFwiLGRlZnM6W119O1xyXG4gIH0sXHJcbiAgZG9zZWFyY2g6IGZ1bmN0aW9uKHRvZmluZCxmaWVsZCkge1xyXG4gICAgaWYoZmllbGQ9PVwic3RhcnRcIil7XHJcbiAgICAgIHRoaXMuc2VhcmNoX3N0YXJ0KHRvZmluZCk7XHJcbiAgICB9XHJcbiAgICBpZihmaWVsZD09XCJlbmRcIil7XHJcbiAgICAgIHRoaXMuc2VhcmNoX2VuZCh0b2ZpbmQpO1xyXG4gICAgfVxyXG4gICAgaWYoZmllbGQ9PVwibWlkZGxlXCIpe1xyXG4gICAgICB0aGlzLnNlYXJjaF9taWRkbGUodG9maW5kKTtcclxuICAgIH1cclxuICAgIGlmKGZpZWxkPT1cImZ1bGx0ZXh0XCIpe1xyXG4gICAgICB0aGlzLnNlYXJjaF9mdWxsdGV4dCh0b2ZpbmQpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2VhcmNoX3N0YXJ0OiBmdW5jdGlvbih0b2ZpbmQpIHtcclxuICAgIHZhciBvdXQ9W107XHJcbiAgICB2YXIgaW5kZXg9YXBpLmluZGV4T2ZTb3J0ZWQodGhpcy5zdGF0ZS5lbnRyaWVzLHRvZmluZCk7XHJcbiAgICB2YXIgaT0wO1xyXG4gICAgd2hpbGUodGhpcy5zdGF0ZS5lbnRyaWVzW2luZGV4K2ldLmluZGV4T2YodG9maW5kKT09MCl7XHJcbiAgICAgIG91dC5wdXNoKFt0aGlzLnN0YXRlLmVudHJpZXNbaW5kZXgraV0scGFyc2VJbnQoaW5kZXgpK2ldKTtcclxuICAgICAgaSsrO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0Om91dH0pO1xyXG4gIH0sXHJcbiAgc2VhcmNoX2VuZDogZnVuY3Rpb24odG9maW5kKSB7XHJcbiAgICB2YXIgb3V0PVtdO1xyXG4gICAgdmFyIGk9MDtcclxuICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuc3RhdGUuZW50cmllcy5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIGlmKHRoaXMuc3RhdGUuZW50cmllc1tpXS5pbmRleE9mKHRvZmluZCk9PXRoaXMuc3RhdGUuZW50cmllc1tpXS5sZW5ndGgtMSl7XHJcbiAgICAgICAgb3V0LnB1c2goW3RoaXMuc3RhdGUuZW50cmllc1tpXSxpXSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdDpvdXR9KTtcclxuICB9LFxyXG4gIHNlYXJjaF9taWRkbGU6IGZ1bmN0aW9uKHRvZmluZCkge1xyXG4gICAgdmFyIG91dD1bXTtcclxuICAgIHZhciBpPTA7XHJcbiAgICBmb3IodmFyIGk9MDsgaTx0aGlzLnN0YXRlLmVudHJpZXMubGVuZ3RoOyBpKyspe1xyXG4gICAgICB2YXIgZW50PXRoaXMuc3RhdGUuZW50cmllc1tpXTtcclxuICAgICAgaWYoZW50LmluZGV4T2YodG9maW5kKSA+LTEgJiYgZW50LmluZGV4T2YodG9maW5kKSE9MCAmJiBlbnQuaW5kZXhPZih0b2ZpbmQpIT1lbnQubGVuZ3RoLTEpe1xyXG4gICAgICAgIG91dC5wdXNoKFt0aGlzLnN0YXRlLmVudHJpZXNbaV0saV0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHQ6b3V0fSk7ICBcclxuICB9LFxyXG5cclxuICBzZWFyY2hfZnVsbHRleHQ6IGZ1bmN0aW9uKHRvZmluZCkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgIHZhciBvdXQ9W107XHJcbiAgICBrc2Uuc2VhcmNoKFwibW9lZGljdFwiLHRvZmluZCx7cmFuZ2U6e3N0YXJ0OjAsbWF4c2VnOjUwMH19LGZ1bmN0aW9uKGVycixkYXRhKXtcclxuICAgICAgb3V0PWRhdGEuZXhjZXJwdC5tYXAoZnVuY3Rpb24oaXRlbSl7cmV0dXJuIFtpdGVtLnNlZ25hbWUsaXRlbS5zZWddO30pO1xyXG4gICAgICB0aGF0LnNldFN0YXRlKHtyZXN1bHQ6b3V0fSk7XHJcbiAgICB9KSBcclxuICAgIC8vIGtzZS5oaWdobGlnaHRTZWcodGhpcy5zdGF0ZS5kYiwwLHtxOnRvZmluZCxub3NwYW46dHJ1ZX0sZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAvLyAgIG91dD1kYXRhLmV4Y2VycHQubWFwKGZ1bmN0aW9uKGl0ZW0pe3JldHVybiBbaXRlbS5zZWduYW1lLGl0ZW0uc2VnXTt9KTtcclxuICAgIC8vICAgdGhhdC5zZXRTdGF0ZSh7cmVzdWx0Om91dH0pO1xyXG4gICAgLy8gfSk7XHJcbiAgfSxcclxuICBkZWZTZWFyY2g6IGZ1bmN0aW9uKHRvZmluZCxyZXNldCkgey8v6bue6YG4ZGVm5YGa5pCc5bCL5bCx5piv55SoZGVmU2VhcmNoXHJcbiAgICB0aGlzLnNldFN0YXRlKHt0b2ZpbmQ6dG9maW5kfSk7XHJcbiAgICBpZihyZXNldD09MSkgZGVmcz1bXTtcclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICB2YXIgaW5kZXg9YXBpLmluZGV4T2ZTb3J0ZWQodGhpcy5zdGF0ZS5lbnRyaWVzLHRvZmluZCk7XHJcbiAgICBpZih0aGlzLnN0YXRlLmVudHJpZXNbaW5kZXhdPT10b2ZpbmQpe1xyXG4gICAgICBrZGUub3BlbihcIm1vZWRpY3RcIixmdW5jdGlvbihlcnIsZGIpe1xyXG4gICAgICAgIHZhciBkZWY9ZGIuZ2V0KFtcImZpbGVjb250ZW50c1wiLDAsaW5kZXhdLGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgZGVmcy5wdXNoKFtkYXRhLGluZGV4XSk7XHJcbiAgICAgICAgICB0aGF0LnNldFN0YXRlKHtkZWZzOmRlZnN9KTtcclxuICAgICAgICAgIC8vdGhhdC5zdGF0ZS5kZWZzLnB1c2goZGF0YSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0pOyAgICBcclxuICAgIH1cclxuICB9LFxyXG4gIGdvdG9FbnRyeTogZnVuY3Rpb24oaW5kZXgpIHsvLyDlvp7kuIvmi4npgbjllq7pu57pgbjnmoTpoIXnm65vciDpu55zZWFyY2hoaXN0b3J55pyD55SoZ290b0VudHJ5IOS+humhr+ekumRlZlxyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgIHZhciBkZWZzPVtdO1xyXG4gICAga2RlLm9wZW4oXCJtb2VkaWN0XCIsZnVuY3Rpb24oZXJyLGRiKXtcclxuICAgICAgLy92YXIgZGVmPWRiLmdldChcIm1vZWRpY3QuZmlsZUNvbnRlbnRzLjAuXCIraW5kZXgpO1xyXG4gICAgICB2YXIgZGVmPWRiLmdldChbXCJmaWxlY29udGVudHNcIiwwLGluZGV4XSxmdW5jdGlvbihkYXRhKXtcclxuICAgICAgICBkZWZzLnB1c2goW2RhdGEsaW5kZXhdKTtcclxuICAgICAgICB0aGF0LnNldFN0YXRlKHtkZWZzOmRlZnN9KTtcclxuICAgICAgfSk7XHJcbiAgICB9KTsgXHJcbiAgfSxcclxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuKFxyXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTZWFyY2hiYXIsIHtkb3NlYXJjaDogdGhpcy5kb3NlYXJjaH0pLCBcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPdmVydmlldywge3Jlc3VsdDogdGhpcy5zdGF0ZS5yZXN1bHQsIGdvdG9FbnRyeTogdGhpcy5nb3RvRW50cnl9KSwgXHJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLCBcclxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChTaG93dGV4dCwge2dvdG9FbnRyeTogdGhpcy5nb3RvRW50cnksIGRlZlNlYXJjaDogdGhpcy5kZWZTZWFyY2gsIGRlZnM6IHRoaXMuc3RhdGUuZGVmcywgdG9maW5kOiB0aGlzLnN0YXRlLnRvZmluZCwgcmVzdWx0OiB0aGlzLnN0YXRlLnJlc3VsdH0pXHJcbiAgICApXHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcbm1vZHVsZS5leHBvcnRzPW1haW5jb21wb25lbnQ7IiwidmFyIE92ZXJ2aWV3PVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJPdmVydmlld1wiLFxyXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgXHRyZXR1cm4ge307XHJcbiAgfSxcclxuICBnZXREZWZGcm9tRW50cnlJZDogZnVuY3Rpb24oZSkge1xyXG4gICAgdmFyIGVudHJ5SW5kZXg9ZS50YXJnZXQudmFsdWU7XHJcbiAgICB0aGlzLnByb3BzLmdvdG9FbnRyeShlbnRyeUluZGV4KTtcclxuICB9LFxyXG4gIHNob3VsZENvbXBvbmVudFVwZGF0ZTogZnVuY3Rpb24obmV4dFByb3BzLG5leHRTdGF0ZSkge1xyXG4gICAgaWYobmV4dFByb3BzLnJlc3VsdD09dGhpcy5wcm9wcy5yZXN1bHQpIHJldHVybiBmYWxzZTtcclxuICAgIGVsc2UgcmV0dXJuIHRydWU7XHJcbiAgfSxcclxuICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRoYXQ9dGhpcztcclxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcclxuICAgICAgdGhhdC5yZWZzLmVudHJ5TGlzdC5nZXRET01Ob2RlKCkuc2VsZWN0ZWRJbmRleD0wO1xyXG4gICAgIHRoYXQucHJvcHMuZ290b0VudHJ5KHRoYXQucHJvcHMucmVzdWx0WzBdWzFdKTsgXHJcbiAgICB9LDUwMCk7XHJcbiAgICAgXHJcbiAgICAvL2lmKGRlZmF1bHRJbmRleCkgdGhpcy5hdXRvZ2V0RW50cnkoZGVmYXVsdEluZGV4KTtcclxuICB9LFxyXG4gIHJlbmRlclJlc3VsdDogZnVuY3Rpb24oaXRlbSxpbmRleCkge1xyXG4gICAgaWYoaXRlbSE9XCLmkJzlsIvntZDmnpzliJfooahcIikgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIsIHt2YWx1ZTogaXRlbVsxXX0sIGl0ZW1bMF0pKTtcclxuICAgIGVsc2UgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIsIG51bGwsIGl0ZW0pKTtcclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgXHR2YXIgcmVzPXRoaXMucHJvcHMucmVzdWx0IHx8IFwiXCI7XHJcbiAgICByZXR1cm4oXHJcblx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcclxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJ2ZXJ0aWNhbF9jZW50ZXJcIiwgY2xhc3NOYW1lOiBcImJhZGdlXCJ9LCByZXMubGVuZ3RoKSwgXHJcblx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sLXNtLTJcIn0sIFxyXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIsIHtyZWY6IFwiZW50cnlMaXN0XCIsIGNsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgb25DaGFuZ2U6IHRoaXMuZ2V0RGVmRnJvbUVudHJ5SWR9LCBcclxuICAgICAgdGhpcy5wcm9wcy5yZXN1bHQubWFwKHRoaXMucmVuZGVyUmVzdWx0KVxyXG5cdFx0XHQpXHJcblx0XHQpXHJcblx0KVx0XHJcbiAgICApOyBcclxuICB9XHJcbn0pO1xyXG5tb2R1bGUuZXhwb3J0cz1PdmVydmlldzsiLCJ2YXIgU2VhcmNoYmFyPVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTZWFyY2hiYXJcIixcclxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gIFx0cmV0dXJuIHt9O1xyXG4gIH0sXHJcbiAgZG9zZWFyY2g6IGZ1bmN0aW9uKCkge1xyXG4gIFx0dmFyIHRvZmluZD10aGlzLnJlZnMudG9maW5kLmdldERPTU5vZGUoKS52YWx1ZTtcclxuICAgIHZhciBmaWVsZD0kKHRoaXMucmVmcy5zZWFyY2h0eXBlLmdldERPTU5vZGUoKSkuZmluZChcIi5hY3RpdmVcIilbMF0uZGF0YXNldC50eXBlO1xyXG4gICAgXHJcbiAgXHR0aGlzLnByb3BzLmRvc2VhcmNoKHRvZmluZCxmaWVsZCk7XHJcbiAgfSxcclxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgcmV0dXJuKFxyXG4gIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXHJcbiAgXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxyXG5cdCAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbC1zbS0zXCJ9LCBcclxuXHQgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHtjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sIGNvbC1zbS0xXCIsIHR5cGU6IFwidGV4dFwiLCByZWY6IFwidG9maW5kXCIsIHBsYWNlaG9sZGVyOiBcIuiri+i8uOWFpeWtl+ipnlwiLCBkZWZhdWx0VmFsdWU6IFwi5pyIXCIsIG9uS2V5RG93bjogdGhpcy5kb3NlYXJjaCwgb25DaGFuZ2U6IHRoaXMuZG9zZWFyY2h9KVxyXG5cdCAgKSwgXHJcblx0ICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgXCLCoMKgwqDCoFwiLCAgICAgXG5cdCAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJ0bi1ncm91cFwiLCBcImRhdGEtdG9nZ2xlXCI6IFwiYnV0dG9uc1wiLCByZWY6IFwic2VhcmNodHlwZVwiLCBvbkNsaWNrOiB0aGlzLmRvc2VhcmNofSwgXHJcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJzdGFydFwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzIGFjdGl2ZVwifSwgXHJcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInJhZGlvXCIsIG5hbWU6IFwiZmllbGRcIiwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSwgXCLpoK1cIilcclxuXHQgICAgKSwgXHJcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJlbmRcIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXHJcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInJhZGlvXCIsIG5hbWU6IFwiZmllbGRcIiwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSwgXCLlsL5cIilcclxuXHQgICAgKSwgXHJcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJtaWRkbGVcIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXHJcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInJhZGlvXCIsIG5hbWU6IFwiZmllbGRcIiwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSwgXCLkuK1cIilcclxuXHQgICAgKSwgXHJcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJmdWxsdGV4dFwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzXCJ9LCBcclxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwicmFkaW9cIiwgbmFtZTogXCJmaWVsZFwiLCBhdXRvY29tcGxldGU6IFwib2ZmXCJ9LCBcIuWFqFwiKVxyXG5cdCAgICApXHJcblx0ICApXHJcblx0KVxyXG4gIClcclxuICAgIFx0XHJcbiAgICApOyBcclxuICB9XHJcbn0pO1xyXG5tb2R1bGUuZXhwb3J0cz1TZWFyY2hiYXI7IiwidmFyIFNlYXJjaGhpc3Rvcnk9UmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNlYXJjaGhpc3RvcnlcIixcclxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gIFx0cmV0dXJuIHt9O1xyXG4gIH0sXHJcbiAgZ29FbnRyeTogZnVuY3Rpb24oZSkge1xyXG4gIFx0dmFyIGVudHJ5SW5kZXg9ZS50YXJnZXQuZGF0YXNldC5lbnRyeTtcclxuICBcdHZhciB0aGF0PXRoaXM7XHJcbiAgXHR0aGlzLnByb3BzLmVudHJ5SGlzdG9yeS5tYXAoZnVuY3Rpb24oaXRlbSl7XHJcbiAgXHRcdGlmKGl0ZW1bMV09PWVudHJ5SW5kZXgpIHt0aGF0LnByb3BzLmRvc2VhcmNoKGl0ZW1bMl0pO31cclxuICBcdH0pXHJcbiAgXHQvL3RoaXMucHJvcHMuZ290b0VudHJ5KGVudHJ5SW5kZXgpO1xyXG4gIH0sXHJcbiAgcmVuZGVySGlzdG9yeTogZnVuY3Rpb24oaXRlbSkge1xyXG4gIFx0cmV0dXJuICc8YSBkYXRhLWVudHJ5PScraXRlbVsxXSsnPicraXRlbVswXSsnPC9hPic7XHJcbiAgfSxcclxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gIFx0dmFyIHM9dGhpcy5wcm9wcy5lbnRyeUhpc3Rvcnk7XHJcbiAgXHR2YXIgcmVzPXMubWFwKHRoaXMucmVuZGVySGlzdG9yeSk7XHJcbiAgXHR2YXIgc2VhcmNoaGlzdG9yeT1yZXMuam9pbihcIiA+IFwiKTtcclxuICAgIHJldHVybihcclxuXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtvbkNsaWNrOiB0aGlzLmdvRW50cnl9LCBcclxuXHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2Rhbmdlcm91c2x5U2V0SW5uZXJIVE1MOiB7X19odG1sOiBzZWFyY2hoaXN0b3J5fX0pXHJcblx0KVxyXG4gICAgXHRcclxuICAgICk7IFxyXG4gIH1cclxufSk7XHJcbm1vZHVsZS5leHBvcnRzPVNlYXJjaGhpc3Rvcnk7IiwidmFyIFNlYXJjaGhpc3Rvcnk9cmVxdWlyZShcIi4vc2VhcmNoaGlzdG9yeS5qc3hcIik7XHJcbnZhciBEZWZib3g9cmVxdWlyZShcIi4vZGVmYm94LmpzeFwiKTtcclxudmFyIFNob3d0ZXh0PVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTaG93dGV4dFwiLFxyXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgXHRyZXR1cm4ge2VudHJ5SGlzdG9yeTpbXSx0b2ZpbmQ6XCJcIn07XHJcbiAgfSxcclxuICBwdXNoSGlzdG9yeTogZnVuY3Rpb24oc2VhcmNoUmVzdWx0LGNsaWNrZWRJbmRleCkgey8vc2VhcmNoUmVzdWx0IFt0aXRsZSx0aXRsZUluZGV4LHRvZmluZF1cclxuICAgIHZhciB0aGF0PXRoaXM7XHJcbiAgICBzZWFyY2hSZXN1bHQubWFwKGZ1bmN0aW9uKGl0ZW0pe1xyXG4gICAgICBpZihpdGVtWzFdPT1jbGlja2VkSW5kZXgpIHRoYXQuc3RhdGUuZW50cnlIaXN0b3J5LnB1c2goaXRlbSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGRvc2VhcmNoOiBmdW5jdGlvbih0b2ZpbmQpIHtcclxuICAgIGZvcih2YXIgaT0xOyBpPHRvZmluZC5sZW5ndGg7IGkrKyl7XHJcbiAgICAgIHZhciB0PXRvZmluZC5zdWJzdHIoMCxpKTtcclxuICAgICAgdGhpcy5wcm9wcy5kZWZTZWFyY2godCxpKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcclxuICAgIFx0UmVhY3QuY3JlYXRlRWxlbWVudChTZWFyY2hoaXN0b3J5LCB7ZG9zZWFyY2g6IHRoaXMuZG9zZWFyY2gsIGdvdG9FbnRyeTogdGhpcy5wcm9wcy5nb3RvRW50cnksIGVudHJ5SGlzdG9yeTogdGhpcy5zdGF0ZS5lbnRyeUhpc3RvcnksIHJlc3VsdDogdGhpcy5wcm9wcy5yZXN1bHR9KSwgXHJcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgXHJcbiAgICBcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGVmYm94LCB7ZG9zZWFyY2g6IHRoaXMuZG9zZWFyY2gsIHB1c2hIaXN0b3J5OiB0aGlzLnB1c2hIaXN0b3J5LCBkZWZzOiB0aGlzLnByb3BzLmRlZnMsIHJlc3VsdDogdGhpcy5wcm9wcy5yZXN1bHR9KVx0XHJcbiAgICApXHJcbiAgICApO1xyXG4gIH1cclxufSk7XHJcbm1vZHVsZS5leHBvcnRzPVNob3d0ZXh0OyIsInZhciB0b2tlbml6ZXJzPXJlcXVpcmUoJy4vdG9rZW5pemVycycpO1xyXG52YXIgbm9ybWFsaXplVGJsPW51bGw7XHJcbnZhciBzZXROb3JtYWxpemVUYWJsZT1mdW5jdGlvbih0Ymwsb2JqKSB7XHJcblx0aWYgKCFvYmopIHtcclxuXHRcdG9iaj17fTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHRibC5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciBhcnI9dGJsW2ldLnNwbGl0KFwiPVwiKTtcclxuXHRcdFx0b2JqW2FyclswXV09YXJyWzFdO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRub3JtYWxpemVUYmw9b2JqO1xyXG5cdHJldHVybiBvYmo7XHJcbn1cclxudmFyIG5vcm1hbGl6ZTE9ZnVuY3Rpb24odG9rZW4pIHtcclxuXHRpZiAoIXRva2VuKSByZXR1cm4gXCJcIjtcclxuXHR0b2tlbj10b2tlbi5yZXBsYWNlKC9bIFxcblxcLizvvIzjgILvvIHvvI7jgIzjgI3vvJrvvJvjgIFdL2csJycpLnRyaW0oKTtcclxuXHRpZiAoIW5vcm1hbGl6ZVRibCkgcmV0dXJuIHRva2VuO1xyXG5cdGlmICh0b2tlbi5sZW5ndGg9PTEpIHtcclxuXHRcdHJldHVybiBub3JtYWxpemVUYmxbdG9rZW5dIHx8IHRva2VuO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRmb3IgKHZhciBpPTA7aTx0b2tlbi5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHRva2VuW2ldPW5vcm1hbGl6ZVRibFt0b2tlbltpXV0gfHwgdG9rZW5baV07XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdG9rZW47XHJcblx0fVxyXG59XHJcbnZhciBpc1NraXAxPWZ1bmN0aW9uKHRva2VuKSB7XHJcblx0dmFyIHQ9dG9rZW4udHJpbSgpO1xyXG5cdHJldHVybiAodD09XCJcIiB8fCB0PT1cIuOAgFwiIHx8IHQ9PVwi4oC7XCIgfHwgdD09XCJcXG5cIik7XHJcbn1cclxudmFyIG5vcm1hbGl6ZV90aWJldGFuPWZ1bmN0aW9uKHRva2VuKSB7XHJcblx0cmV0dXJuIHRva2VuLnJlcGxhY2UoL1vgvI3gvIsgXS9nLCcnKS50cmltKCk7XHJcbn1cclxuXHJcbnZhciBpc1NraXBfdGliZXRhbj1mdW5jdGlvbih0b2tlbikge1xyXG5cdHZhciB0PXRva2VuLnRyaW0oKTtcclxuXHRyZXR1cm4gKHQ9PVwiXCIgfHwgdD09XCLjgIBcIiB8fCAgdD09XCJcXG5cIik7XHRcclxufVxyXG52YXIgc2ltcGxlMT17XHJcblx0ZnVuYzp7XHJcblx0XHR0b2tlbml6ZTp0b2tlbml6ZXJzLnNpbXBsZVxyXG5cdFx0LHNldE5vcm1hbGl6ZVRhYmxlOnNldE5vcm1hbGl6ZVRhYmxlXHJcblx0XHQsbm9ybWFsaXplOiBub3JtYWxpemUxXHJcblx0XHQsaXNTa2lwOlx0aXNTa2lwMVxyXG5cdH1cclxuXHRcclxufVxyXG52YXIgdGliZXRhbjE9e1xyXG5cdGZ1bmM6e1xyXG5cdFx0dG9rZW5pemU6dG9rZW5pemVycy50aWJldGFuXHJcblx0XHQsc2V0Tm9ybWFsaXplVGFibGU6c2V0Tm9ybWFsaXplVGFibGVcclxuXHRcdCxub3JtYWxpemU6bm9ybWFsaXplX3RpYmV0YW5cclxuXHRcdCxpc1NraXA6aXNTa2lwX3RpYmV0YW5cclxuXHR9XHJcbn1cclxubW9kdWxlLmV4cG9ydHM9e1wic2ltcGxlMVwiOnNpbXBsZTEsXCJ0aWJldGFuMVwiOnRpYmV0YW4xfSIsIi8qIFxyXG4gIGN1c3RvbSBmdW5jIGZvciBidWlsZGluZyBhbmQgc2VhcmNoaW5nIHlkYlxyXG5cclxuICBrZWVwIGFsbCB2ZXJzaW9uXHJcbiAgXHJcbiAgZ2V0QVBJKHZlcnNpb24pOyAvL3JldHVybiBoYXNoIG9mIGZ1bmN0aW9ucyAsIGlmIHZlciBpcyBvbWl0ICwgcmV0dXJuIGxhc3Rlc3RcclxuXHRcclxuICBwb3N0aW5nczJUcmVlICAgICAgLy8gaWYgdmVyc2lvbiBpcyBub3Qgc3VwcGx5LCBnZXQgbGFzdGVzdFxyXG4gIHRva2VuaXplKHRleHQsYXBpKSAvLyBjb252ZXJ0IGEgc3RyaW5nIGludG8gdG9rZW5zKGRlcGVuZHMgb24gb3RoZXIgYXBpKVxyXG4gIG5vcm1hbGl6ZVRva2VuICAgICAvLyBzdGVtbWluZyBhbmQgZXRjXHJcbiAgaXNTcGFjZUNoYXIgICAgICAgIC8vIG5vdCBhIHNlYXJjaGFibGUgdG9rZW5cclxuICBpc1NraXBDaGFyICAgICAgICAgLy8gMCB2cG9zXHJcblxyXG4gIGZvciBjbGllbnQgYW5kIHNlcnZlciBzaWRlXHJcbiAgXHJcbiovXHJcbnZhciBjb25maWdzPXJlcXVpcmUoXCIuL2NvbmZpZ3NcIik7XHJcbnZhciBjb25maWdfc2ltcGxlPVwic2ltcGxlMVwiO1xyXG52YXIgb3B0aW1pemU9ZnVuY3Rpb24oanNvbixjb25maWcpIHtcclxuXHRjb25maWc9Y29uZmlnfHxjb25maWdfc2ltcGxlO1xyXG5cdHJldHVybiBqc29uO1xyXG59XHJcblxyXG52YXIgZ2V0QVBJPWZ1bmN0aW9uKGNvbmZpZykge1xyXG5cdGNvbmZpZz1jb25maWd8fGNvbmZpZ19zaW1wbGU7XHJcblx0dmFyIGZ1bmM9Y29uZmlnc1tjb25maWddLmZ1bmM7XHJcblx0ZnVuYy5vcHRpbWl6ZT1vcHRpbWl6ZTtcclxuXHRpZiAoY29uZmlnPT1cInNpbXBsZTFcIikge1xyXG5cdFx0Ly9hZGQgY29tbW9uIGN1c3RvbSBmdW5jdGlvbiBoZXJlXHJcblx0fSBlbHNlIGlmIChjb25maWc9PVwidGliZXRhbjFcIikge1xyXG5cclxuXHR9IGVsc2UgdGhyb3cgXCJjb25maWcgXCIrY29uZmlnICtcIm5vdCBzdXBwb3J0ZWRcIjtcclxuXHJcblx0cmV0dXJuIGZ1bmM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzPXtnZXRBUEk6Z2V0QVBJfTsiLCJ2YXIgdGliZXRhbiA9ZnVuY3Rpb24ocykge1xyXG5cdC8vY29udGludW91cyB0c2hlZyBncm91cGVkIGludG8gc2FtZSB0b2tlblxyXG5cdC8vc2hhZCBhbmQgc3BhY2UgZ3JvdXBlZCBpbnRvIHNhbWUgdG9rZW5cclxuXHR2YXIgb2Zmc2V0PTA7XHJcblx0dmFyIHRva2Vucz1bXSxvZmZzZXRzPVtdO1xyXG5cdHM9cy5yZXBsYWNlKC9cXHJcXG4vZywnXFxuJykucmVwbGFjZSgvXFxyL2csJ1xcbicpO1xyXG5cdHZhciBhcnI9cy5zcGxpdCgnXFxuJyk7XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgbGFzdD0wO1xyXG5cdFx0dmFyIHN0cj1hcnJbaV07XHJcblx0XHRzdHIucmVwbGFjZSgvW+C8jeC8iyBdKy9nLGZ1bmN0aW9uKG0sbTEpe1xyXG5cdFx0XHR0b2tlbnMucHVzaChzdHIuc3Vic3RyaW5nKGxhc3QsbTEpK20pO1xyXG5cdFx0XHRvZmZzZXRzLnB1c2gob2Zmc2V0K2xhc3QpO1xyXG5cdFx0XHRsYXN0PW0xK20ubGVuZ3RoO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAobGFzdDxzdHIubGVuZ3RoKSB7XHJcblx0XHRcdHRva2Vucy5wdXNoKHN0ci5zdWJzdHJpbmcobGFzdCkpO1xyXG5cdFx0XHRvZmZzZXRzLnB1c2gobGFzdCk7XHJcblx0XHR9XHJcblx0XHRpZiAoaT09PWFyci5sZW5ndGgtMSkgYnJlYWs7XHJcblx0XHR0b2tlbnMucHVzaCgnXFxuJyk7XHJcblx0XHRvZmZzZXRzLnB1c2gob2Zmc2V0K2xhc3QpO1xyXG5cdFx0b2Zmc2V0Kz1zdHIubGVuZ3RoKzE7XHJcblx0fVxyXG5cclxuXHRyZXR1cm4ge3Rva2Vuczp0b2tlbnMsb2Zmc2V0czpvZmZzZXRzfTtcclxufTtcclxudmFyIGlzU3BhY2U9ZnVuY3Rpb24oYykge1xyXG5cdHJldHVybiAoYz09XCIgXCIpIDsvL3x8IChjPT1cIixcIikgfHwgKGM9PVwiLlwiKTtcclxufVxyXG52YXIgaXNDSksgPWZ1bmN0aW9uKGMpIHtyZXR1cm4gKChjPj0weDMwMDAgJiYgYzw9MHg5RkZGKSBcclxufHwgKGM+PTB4RDgwMCAmJiBjPDB4REMwMCkgfHwgKGM+PTB4RkYwMCkgKSA7fVxyXG52YXIgc2ltcGxlMT1mdW5jdGlvbihzKSB7XHJcblx0dmFyIG9mZnNldD0wO1xyXG5cdHZhciB0b2tlbnM9W10sb2Zmc2V0cz1bXTtcclxuXHRzPXMucmVwbGFjZSgvXFxyXFxuL2csJ1xcbicpLnJlcGxhY2UoL1xcci9nLCdcXG4nKTtcclxuXHRhcnI9cy5zcGxpdCgnXFxuJyk7XHJcblxyXG5cdHZhciBwdXNodG9rZW49ZnVuY3Rpb24odCxvZmYpIHtcclxuXHRcdHZhciBpPTA7XHJcblx0XHRpZiAodC5jaGFyQ29kZUF0KDApPjI1NSkge1xyXG5cdFx0XHR3aGlsZSAoaTx0Lmxlbmd0aCkge1xyXG5cdFx0XHRcdHZhciBjPXQuY2hhckNvZGVBdChpKTtcclxuXHRcdFx0XHRvZmZzZXRzLnB1c2gob2ZmK2kpO1xyXG5cdFx0XHRcdHRva2Vucy5wdXNoKHRbaV0pO1xyXG5cdFx0XHRcdGlmIChjPj0weEQ4MDAgJiYgYzw9MHhERkZGKSB7XHJcblx0XHRcdFx0XHR0b2tlbnNbdG9rZW5zLmxlbmd0aC0xXSs9dFtpXTsgLy9leHRlbnNpb24gQixDLERcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHR9XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0b2tlbnMucHVzaCh0KTtcclxuXHRcdFx0b2Zmc2V0cy5wdXNoKG9mZik7XHRcclxuXHRcdH1cclxuXHR9XHJcblx0Zm9yICh2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBsYXN0PTAsc3A9XCJcIjtcclxuXHRcdHN0cj1hcnJbaV07XHJcblx0XHRzdHIucmVwbGFjZSgvW18wLTlBLVphLXpdKy9nLGZ1bmN0aW9uKG0sbTEpe1xyXG5cdFx0XHR3aGlsZSAoaXNTcGFjZShzcD1zdHJbbGFzdF0pICYmIGxhc3Q8c3RyLmxlbmd0aCkge1xyXG5cdFx0XHRcdHRva2Vuc1t0b2tlbnMubGVuZ3RoLTFdKz1zcDtcclxuXHRcdFx0XHRsYXN0Kys7XHJcblx0XHRcdH1cclxuXHRcdFx0cHVzaHRva2VuKHN0ci5zdWJzdHJpbmcobGFzdCxtMSkrbSAsIG9mZnNldCtsYXN0KTtcclxuXHRcdFx0b2Zmc2V0cy5wdXNoKG9mZnNldCtsYXN0KTtcclxuXHRcdFx0bGFzdD1tMSttLmxlbmd0aDtcclxuXHRcdH0pO1xyXG5cclxuXHRcdGlmIChsYXN0PHN0ci5sZW5ndGgpIHtcclxuXHRcdFx0d2hpbGUgKGlzU3BhY2Uoc3A9c3RyW2xhc3RdKSAmJiBsYXN0PHN0ci5sZW5ndGgpIHtcclxuXHRcdFx0XHR0b2tlbnNbdG9rZW5zLmxlbmd0aC0xXSs9c3A7XHJcblx0XHRcdFx0bGFzdCsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdHB1c2h0b2tlbihzdHIuc3Vic3RyaW5nKGxhc3QpLCBvZmZzZXQrbGFzdCk7XHJcblx0XHRcdFxyXG5cdFx0fVx0XHRcclxuXHRcdG9mZnNldHMucHVzaChvZmZzZXQrbGFzdCk7XHJcblx0XHRvZmZzZXQrPXN0ci5sZW5ndGgrMTtcclxuXHRcdGlmIChpPT09YXJyLmxlbmd0aC0xKSBicmVhaztcclxuXHRcdHRva2Vucy5wdXNoKCdcXG4nKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB7dG9rZW5zOnRva2VucyxvZmZzZXRzOm9mZnNldHN9O1xyXG5cclxufTtcclxuXHJcbnZhciBzaW1wbGU9ZnVuY3Rpb24ocykge1xyXG5cdHZhciB0b2tlbj0nJztcclxuXHR2YXIgdG9rZW5zPVtdLCBvZmZzZXRzPVtdIDtcclxuXHR2YXIgaT0wOyBcclxuXHR2YXIgbGFzdHNwYWNlPWZhbHNlO1xyXG5cdHZhciBhZGR0b2tlbj1mdW5jdGlvbigpIHtcclxuXHRcdGlmICghdG9rZW4pIHJldHVybjtcclxuXHRcdHRva2Vucy5wdXNoKHRva2VuKTtcclxuXHRcdG9mZnNldHMucHVzaChpKTtcclxuXHRcdHRva2VuPScnO1xyXG5cdH1cclxuXHR3aGlsZSAoaTxzLmxlbmd0aCkge1xyXG5cdFx0dmFyIGM9cy5jaGFyQXQoaSk7XHJcblx0XHR2YXIgY29kZT1zLmNoYXJDb2RlQXQoaSk7XHJcblx0XHRpZiAoaXNDSksoY29kZSkpIHtcclxuXHRcdFx0YWRkdG9rZW4oKTtcclxuXHRcdFx0dG9rZW49YztcclxuXHRcdFx0aWYgKGNvZGU+PTB4RDgwMCAmJiBjb2RlPDB4REMwMCkgeyAvL2hpZ2ggc29ycmFnYXRlXHJcblx0XHRcdFx0dG9rZW4rPXMuY2hhckF0KGkrMSk7aSsrO1xyXG5cdFx0XHR9XHJcblx0XHRcdGFkZHRva2VuKCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoYz09JyYnIHx8IGM9PSc8JyB8fCBjPT0nPycgfHwgYz09XCIsXCIgfHwgYz09XCIuXCJcclxuXHRcdFx0fHwgYz09J3wnIHx8IGM9PSd+JyB8fCBjPT0nYCcgfHwgYz09JzsnIFxyXG5cdFx0XHR8fCBjPT0nPicgfHwgYz09JzonIFxyXG5cdFx0XHR8fCBjPT0nPScgfHwgYz09J0AnICB8fCBjPT1cIi1cIiBcclxuXHRcdFx0fHwgYz09J10nIHx8IGM9PSd9JyAgfHwgYz09XCIpXCIgXHJcblx0XHRcdC8vfHwgYz09J3snIHx8IGM9PSd9J3x8IGM9PSdbJyB8fCBjPT0nXScgfHwgYz09JygnIHx8IGM9PScpJ1xyXG5cdFx0XHR8fCBjb2RlPT0weGYwYiB8fCBjb2RlPT0weGYwZCAvLyB0aWJldGFuIHNwYWNlXHJcblx0XHRcdHx8IChjb2RlPj0weDIwMDAgJiYgY29kZTw9MHgyMDZmKSkge1xyXG5cdFx0XHRcdGFkZHRva2VuKCk7XHJcblx0XHRcdFx0aWYgKGM9PScmJyB8fCBjPT0nPCcpeyAvLyB8fCBjPT0neyd8fCBjPT0nKCd8fCBjPT0nWycpIHtcclxuXHRcdFx0XHRcdHZhciBlbmRjaGFyPSc+JztcclxuXHRcdFx0XHRcdGlmIChjPT0nJicpIGVuZGNoYXI9JzsnXHJcblx0XHRcdFx0XHQvL2Vsc2UgaWYgKGM9PSd7JykgZW5kY2hhcj0nfSc7XHJcblx0XHRcdFx0XHQvL2Vsc2UgaWYgKGM9PSdbJykgZW5kY2hhcj0nXSc7XHJcblx0XHRcdFx0XHQvL2Vsc2UgaWYgKGM9PScoJykgZW5kY2hhcj0nKSc7XHJcblxyXG5cdFx0XHRcdFx0d2hpbGUgKGk8cy5sZW5ndGggJiYgcy5jaGFyQXQoaSkhPWVuZGNoYXIpIHtcclxuXHRcdFx0XHRcdFx0dG9rZW4rPXMuY2hhckF0KGkpO1xyXG5cdFx0XHRcdFx0XHRpKys7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR0b2tlbis9ZW5kY2hhcjtcclxuXHRcdFx0XHRcdGFkZHRva2VuKCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRva2VuPWM7XHJcblx0XHRcdFx0XHRhZGR0b2tlbigpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHR0b2tlbj0nJztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoYz09XCIgXCIpIHtcclxuXHRcdFx0XHRcdHRva2VuKz1jO1xyXG5cdFx0XHRcdFx0bGFzdHNwYWNlPXRydWU7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdGlmIChsYXN0c3BhY2UpIGFkZHRva2VuKCk7XHJcblx0XHRcdFx0XHRsYXN0c3BhY2U9ZmFsc2U7XHJcblx0XHRcdFx0XHR0b2tlbis9YztcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGkrKztcclxuXHR9XHJcblx0YWRkdG9rZW4oKTtcclxuXHRyZXR1cm4ge3Rva2Vuczp0b2tlbnMsb2Zmc2V0czpvZmZzZXRzfTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cz17c2ltcGxlOnNpbXBsZSx0aWJldGFuOnRpYmV0YW59OyIsInZhciBpbmRleE9mU29ydGVkID0gZnVuY3Rpb24gKGFycmF5LCBvYmosIG5lYXIpIHsgXHJcbiAgdmFyIGxvdyA9IDAsXHJcbiAgaGlnaCA9IGFycmF5Lmxlbmd0aDtcclxuICB3aGlsZSAobG93IDwgaGlnaCkge1xyXG4gICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxO1xyXG4gICAgaWYgKGFycmF5W21pZF09PW9iaikgcmV0dXJuIG1pZDtcclxuICAgIGFycmF5W21pZF0gPCBvYmogPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcclxuICB9XHJcbiAgaWYgKG5lYXIpIHJldHVybiBsb3c7XHJcbiAgZWxzZSBpZiAoYXJyYXlbbG93XT09b2JqKSByZXR1cm4gbG93O2Vsc2UgcmV0dXJuIC0xO1xyXG59O1xyXG52YXIgaW5kZXhPZlNvcnRlZF9zdHIgPSBmdW5jdGlvbiAoYXJyYXksIG9iaiwgbmVhcikgeyBcclxuICB2YXIgbG93ID0gMCxcclxuICBoaWdoID0gYXJyYXkubGVuZ3RoO1xyXG4gIHdoaWxlIChsb3cgPCBoaWdoKSB7XHJcbiAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XHJcbiAgICBpZiAoYXJyYXlbbWlkXT09b2JqKSByZXR1cm4gbWlkO1xyXG4gICAgKGFycmF5W21pZF0ubG9jYWxlQ29tcGFyZShvYmopPDApID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XHJcbiAgfVxyXG4gIGlmIChuZWFyKSByZXR1cm4gbG93O1xyXG4gIGVsc2UgaWYgKGFycmF5W2xvd109PW9iaikgcmV0dXJuIGxvdztlbHNlIHJldHVybiAtMTtcclxufTtcclxuXHJcblxyXG52YXIgYnNlYXJjaD1mdW5jdGlvbihhcnJheSx2YWx1ZSxuZWFyKSB7XHJcblx0dmFyIGZ1bmM9aW5kZXhPZlNvcnRlZDtcclxuXHRpZiAodHlwZW9mIGFycmF5WzBdPT1cInN0cmluZ1wiKSBmdW5jPWluZGV4T2ZTb3J0ZWRfc3RyO1xyXG5cdHJldHVybiBmdW5jKGFycmF5LHZhbHVlLG5lYXIpO1xyXG59XHJcbnZhciBic2VhcmNoTmVhcj1mdW5jdGlvbihhcnJheSx2YWx1ZSkge1xyXG5cdHJldHVybiBic2VhcmNoKGFycmF5LHZhbHVlLHRydWUpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cz1ic2VhcmNoOy8ve2JzZWFyY2hOZWFyOmJzZWFyY2hOZWFyLGJzZWFyY2g6YnNlYXJjaH07IiwidmFyIEtERT1yZXF1aXJlKFwiLi9rZGVcIik7XHJcbi8vY3VycmVudGx5IG9ubHkgc3VwcG9ydCBub2RlLmpzIGZzLCBrc2FuYWdhcCBuYXRpdmUgZnMsIGh0bWw1IGZpbGUgc3lzdGVtXHJcbi8vdXNlIHNvY2tldC5pbyB0byByZWFkIGtkYiBmcm9tIHJlbW90ZSBzZXJ2ZXIgaW4gZnV0dXJlXHJcbm1vZHVsZS5leHBvcnRzPUtERTsiLCIvKiBLc2FuYSBEYXRhYmFzZSBFbmdpbmVcclxuXHJcbiAgIDIwMTUvMS8yICwgXHJcbiAgIG1vdmUgdG8ga3NhbmEtZGF0YWJhc2VcclxuICAgc2ltcGxpZmllZCBieSByZW1vdmluZyBkb2N1bWVudCBzdXBwb3J0IGFuZCBzb2NrZXQuaW8gc3VwcG9ydFxyXG5cclxuXHJcbiovXHJcbnZhciBwb29sPXt9LGxvY2FsUG9vbD17fTtcclxudmFyIGFwcHBhdGg9XCJcIjtcclxudmFyIGJzZWFyY2g9cmVxdWlyZShcIi4vYnNlYXJjaFwiKTtcclxudmFyIEtkYj1yZXF1aXJlKCdrc2FuYS1qc29ucm9tJyk7XHJcbnZhciBrZGJzPVtdOyAvL2F2YWlsYWJsZSBrZGIgLCBpZCBhbmQgYWJzb2x1dGUgcGF0aFxyXG52YXIgc3Ryc2VwPVwiXFx1ZmZmZlwiO1xyXG52YXIga2RibGlzdGVkPWZhbHNlO1xyXG4vKlxyXG52YXIgX2dldFN5bmM9ZnVuY3Rpb24ocGF0aHMsb3B0cykge1xyXG5cdHZhciBvdXQ9W107XHJcblx0Zm9yICh2YXIgaSBpbiBwYXRocykge1xyXG5cdFx0b3V0LnB1c2godGhpcy5nZXRTeW5jKHBhdGhzW2ldLG9wdHMpKTtcdFxyXG5cdH1cclxuXHRyZXR1cm4gb3V0O1xyXG59XHJcbiovXHJcbnZhciBfZ2V0cz1mdW5jdGlvbihwYXRocyxvcHRzLGNiKSB7IC8vZ2V0IG1hbnkgZGF0YSB3aXRoIG9uZSBjYWxsXHJcblxyXG5cdGlmICghcGF0aHMpIHJldHVybiA7XHJcblx0aWYgKHR5cGVvZiBwYXRocz09J3N0cmluZycpIHtcclxuXHRcdHBhdGhzPVtwYXRoc107XHJcblx0fVxyXG5cdHZhciBlbmdpbmU9dGhpcywgb3V0cHV0PVtdO1xyXG5cclxuXHR2YXIgbWFrZWNiPWZ1bmN0aW9uKHBhdGgpe1xyXG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdGlmICghKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSBvdXRwdXQucHVzaChkYXRhKTtcclxuXHRcdFx0XHRlbmdpbmUuZ2V0KHBhdGgsb3B0cyx0YXNrcXVldWUuc2hpZnQoKSk7XHJcblx0XHR9O1xyXG5cdH07XHJcblxyXG5cdHZhciB0YXNrcXVldWU9W107XHJcblx0Zm9yICh2YXIgaT0wO2k8cGF0aHMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKHR5cGVvZiBwYXRoc1tpXT09XCJudWxsXCIpIHsgLy90aGlzIGlzIG9ubHkgYSBwbGFjZSBob2xkZXIgZm9yIGtleSBkYXRhIGFscmVhZHkgaW4gY2xpZW50IGNhY2hlXHJcblx0XHRcdG91dHB1dC5wdXNoKG51bGwpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dGFza3F1ZXVlLnB1c2gobWFrZWNiKHBhdGhzW2ldKSk7XHJcblx0XHR9XHJcblx0fTtcclxuXHJcblx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRvdXRwdXQucHVzaChkYXRhKTtcclxuXHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0fHxlbmdpbmUsW291dHB1dCxwYXRoc10pOyAvL3JldHVybiB0byBjYWxsZXJcclxuXHR9KTtcclxuXHJcblx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pOyAvL3J1biB0aGUgdGFza1xyXG59XHJcblxyXG52YXIgZ2V0RmlsZVJhbmdlPWZ1bmN0aW9uKGkpIHtcclxuXHR2YXIgZW5naW5lPXRoaXM7XHJcblxyXG5cdHZhciBmaWxlc2VnY291bnQ9ZW5naW5lLmdldChbXCJmaWxlc2VnY291bnRcIl0pO1xyXG5cdGlmIChmaWxlc2VnY291bnQpIHtcclxuXHRcdGlmIChpPT0wKSB7XHJcblx0XHRcdHJldHVybiB7c3RhcnQ6MCxlbmQ6ZmlsZXNlZ2NvdW50WzBdLTF9O1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0cmV0dXJuIHtzdGFydDpmaWxlc2VnY291bnRbaS0xXSxlbmQ6ZmlsZXNlZ2NvdW50W2ldLTF9O1xyXG5cdFx0fVxyXG5cdH1cclxuXHQvL29sZCBidWdneSBjb2RlXHJcblx0dmFyIGZpbGVuYW1lcz1lbmdpbmUuZ2V0KFtcImZpbGVuYW1lc1wiXSk7XHJcblx0dmFyIGZpbGVvZmZzZXRzPWVuZ2luZS5nZXQoW1wiZmlsZW9mZnNldHNcIl0pO1xyXG5cdHZhciBzZWdvZmZzZXRzPWVuZ2luZS5nZXQoW1wic2Vnb2Zmc2V0c1wiXSk7XHJcblx0dmFyIHNlZ25hbWVzPWVuZ2luZS5nZXQoW1wic2VnbmFtZXNcIl0pO1xyXG5cdHZhciBmaWxlc3RhcnQ9ZmlsZW9mZnNldHNbaV0sIGZpbGVlbmQ9ZmlsZW9mZnNldHNbaSsxXS0xO1xyXG5cclxuXHR2YXIgc3RhcnQ9YnNlYXJjaChzZWdvZmZzZXRzLGZpbGVzdGFydCx0cnVlKTtcclxuXHQvL2lmIChzZWdPZmZzZXRzW3N0YXJ0XT09ZmlsZVN0YXJ0KSBzdGFydC0tO1xyXG5cdFxyXG5cdC8vd29yayBhcm91bmQgZm9yIGppYW5na2FuZ3l1clxyXG5cdHdoaWxlIChzZWdOYW1lc1tzdGFydCsxXT09XCJfXCIpIHN0YXJ0Kys7XHJcblxyXG4gIC8vaWYgKGk9PTApIHN0YXJ0PTA7IC8vd29yayBhcm91bmQgZm9yIGZpcnN0IGZpbGVcclxuXHR2YXIgZW5kPWJzZWFyY2goc2Vnb2Zmc2V0cyxmaWxlZW5kLHRydWUpO1xyXG5cdHJldHVybiB7c3RhcnQ6c3RhcnQsZW5kOmVuZH07XHJcbn1cclxuXHJcbnZhciBnZXRmaWxlc2VnPWZ1bmN0aW9uKGFic29sdXRlc2VnKSB7XHJcblx0dmFyIGZpbGVvZmZzZXRzPXRoaXMuZ2V0KFtcImZpbGVvZmZzZXRzXCJdKTtcclxuXHR2YXIgc2Vnb2Zmc2V0cz10aGlzLmdldChbXCJzZWdvZmZzZXRzXCJdKTtcclxuXHR2YXIgc2Vnb2Zmc2V0PXNlZ09mZnNldHNbYWJzb2x1dGVzZWddO1xyXG5cdHZhciBmaWxlPWJzZWFyY2goZmlsZU9mZnNldHMsc2Vnb2Zmc2V0LHRydWUpLTE7XHJcblxyXG5cdHZhciBmaWxlU3RhcnQ9ZmlsZW9mZnNldHNbZmlsZV07XHJcblx0dmFyIHN0YXJ0PWJzZWFyY2goc2Vnb2Zmc2V0cyxmaWxlU3RhcnQsdHJ1ZSk7XHRcclxuXHJcblx0dmFyIHNlZz1hYnNvbHV0ZXNlZy1zdGFydC0xO1xyXG5cdHJldHVybiB7ZmlsZTpmaWxlLHNlZzpzZWd9O1xyXG59XHJcbi8vcmV0dXJuIGFycmF5IG9mIG9iamVjdCBvZiBuZmlsZSBuc2VnIGdpdmVuIHNlZ25hbWVcclxudmFyIGZpbmRTZWc9ZnVuY3Rpb24oc2VnbmFtZSkge1xyXG5cdHZhciBzZWduYW1lcz10aGlzLmdldChcInNlZ25hbWVzXCIpO1xyXG5cdHZhciBvdXQ9W107XHJcblx0Zm9yICh2YXIgaT0wO2k8c2VnbmFtZXMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKHNlZ25hbWVzW2ldPT1zZWduYW1lKSB7XHJcblx0XHRcdHZhciBmaWxlc2VnPWdldGZpbGVzZWcuYXBwbHkodGhpcyxbaV0pO1xyXG5cdFx0XHRvdXQucHVzaCh7ZmlsZTpmaWxlc2VnLmZpbGUsc2VnOmZpbGVzZWcuc2VnLGFic3NlZzppfSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBvdXQ7XHJcbn1cclxudmFyIGdldEZpbGVTZWdPZmZzZXRzPWZ1bmN0aW9uKGkpIHtcclxuXHR2YXIgc2Vnb2Zmc2V0cz10aGlzLmdldChcInNlZ29mZnNldHNcIik7XHJcblx0dmFyIHJhbmdlPWdldEZpbGVSYW5nZS5hcHBseSh0aGlzLFtpXSk7XHJcblx0cmV0dXJuIHNlZ29mZnNldHMuc2xpY2UocmFuZ2Uuc3RhcnQscmFuZ2UuZW5kKzEpO1xyXG59XHJcblxyXG52YXIgZ2V0RmlsZVNlZ05hbWVzPWZ1bmN0aW9uKGkpIHtcclxuXHR2YXIgcmFuZ2U9Z2V0RmlsZVJhbmdlLmFwcGx5KHRoaXMsW2ldKTtcclxuXHR2YXIgc2VnbmFtZXM9dGhpcy5nZXQoXCJzZWduYW1lc1wiKTtcclxuXHRyZXR1cm4gc2VnbmFtZXMuc2xpY2UocmFuZ2Uuc3RhcnQscmFuZ2UuZW5kKzEpO1xyXG59XHJcbnZhciBsb2NhbGVuZ2luZV9nZXQ9ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XHJcblx0dmFyIGVuZ2luZT10aGlzO1xyXG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XHJcblx0XHRjYj1vcHRzO1xyXG5cdFx0b3B0cz17cmVjdXJzaXZlOmZhbHNlfTtcclxuXHR9XHJcblx0aWYgKCFwYXRoKSB7XHJcblx0XHRpZiAoY2IpIGNiKG51bGwpO1xyXG5cdFx0cmV0dXJuIG51bGw7XHJcblx0fVxyXG5cclxuXHRpZiAodHlwZW9mIGNiIT1cImZ1bmN0aW9uXCIpIHtcclxuXHRcdHJldHVybiBlbmdpbmUua2RiLmdldChwYXRoLG9wdHMpO1xyXG5cdH1cclxuXHJcblx0aWYgKHR5cGVvZiBwYXRoPT1cInN0cmluZ1wiKSB7XHJcblx0XHRyZXR1cm4gZW5naW5lLmtkYi5nZXQoW3BhdGhdLG9wdHMsY2IpO1xyXG5cdH0gZWxzZSBpZiAodHlwZW9mIHBhdGhbMF0gPT1cInN0cmluZ1wiKSB7XHJcblx0XHRyZXR1cm4gZW5naW5lLmtkYi5nZXQocGF0aCxvcHRzLGNiKTtcclxuXHR9IGVsc2UgaWYgKHR5cGVvZiBwYXRoWzBdID09XCJvYmplY3RcIikge1xyXG5cdFx0cmV0dXJuIF9nZXRzLmFwcGx5KGVuZ2luZSxbcGF0aCxvcHRzLGNiXSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGVuZ2luZS5rZGIuZ2V0KFtdLG9wdHMsZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdGNiKGRhdGFbMF0pOy8vcmV0dXJuIHRvcCBsZXZlbCBrZXlzXHJcblx0XHR9KTtcclxuXHR9XHJcbn07XHRcclxuXHJcbnZhciBnZXRQcmVsb2FkRmllbGQ9ZnVuY3Rpb24odXNlcikge1xyXG5cdHZhciBwcmVsb2FkPVtbXCJtZXRhXCJdLFtcImZpbGVuYW1lc1wiXSxbXCJmaWxlb2Zmc2V0c1wiXSxbXCJzZWduYW1lc1wiXSxbXCJzZWdvZmZzZXRzXCJdLFtcImZpbGVzZWdjb3VudFwiXV07XHJcblx0Ly9bXCJ0b2tlbnNcIl0sW1wicG9zdGluZ3NsZW5cIl0ga3NlIHdpbGwgbG9hZCBpdFxyXG5cdGlmICh1c2VyICYmIHVzZXIubGVuZ3RoKSB7IC8vdXNlciBzdXBwbHkgcHJlbG9hZFxyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dXNlci5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdGlmIChwcmVsb2FkLmluZGV4T2YodXNlcltpXSk9PS0xKSB7XHJcblx0XHRcdFx0cHJlbG9hZC5wdXNoKHVzZXJbaV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiBwcmVsb2FkO1xyXG59XHJcbnZhciBjcmVhdGVMb2NhbEVuZ2luZT1mdW5jdGlvbihrZGIsb3B0cyxjYixjb250ZXh0KSB7XHJcblx0dmFyIGVuZ2luZT17a2RiOmtkYiwgcXVlcnlDYWNoZTp7fSwgcG9zdGluZ0NhY2hlOnt9LCBjYWNoZTp7fX07XHJcblxyXG5cdGlmICh0eXBlb2YgY29udGV4dD09XCJvYmplY3RcIikgZW5naW5lLmNvbnRleHQ9Y29udGV4dDtcclxuXHRlbmdpbmUuZ2V0PWxvY2FsZW5naW5lX2dldDtcclxuXHJcblx0ZW5naW5lLnNlZ09mZnNldD1zZWdPZmZzZXQ7XHJcblx0ZW5naW5lLmZpbGVPZmZzZXQ9ZmlsZU9mZnNldDtcclxuXHRlbmdpbmUuZ2V0RmlsZVNlZ05hbWVzPWdldEZpbGVTZWdOYW1lcztcclxuXHRlbmdpbmUuZ2V0RmlsZVNlZ09mZnNldHM9Z2V0RmlsZVNlZ09mZnNldHM7XHJcblx0ZW5naW5lLmdldEZpbGVSYW5nZT1nZXRGaWxlUmFuZ2U7XHJcblx0ZW5naW5lLmZpbmRTZWc9ZmluZFNlZztcclxuXHQvL29ubHkgbG9jYWwgZW5naW5lIGFsbG93IGdldFN5bmNcclxuXHQvL2lmIChrZGIuZnMuZ2V0U3luYykgZW5naW5lLmdldFN5bmM9ZW5naW5lLmtkYi5nZXRTeW5jO1xyXG5cdFxyXG5cdC8vc3BlZWR5IG5hdGl2ZSBmdW5jdGlvbnNcclxuXHRpZiAoa2RiLmZzLm1lcmdlUG9zdGluZ3MpIHtcclxuXHRcdGVuZ2luZS5tZXJnZVBvc3RpbmdzPWtkYi5mcy5tZXJnZVBvc3RpbmdzLmJpbmQoa2RiLmZzKTtcclxuXHR9XHJcblx0XHJcblx0dmFyIHNldFByZWxvYWQ9ZnVuY3Rpb24ocmVzKSB7XHJcblx0XHRlbmdpbmUuZGJuYW1lPXJlc1swXS5uYW1lO1xyXG5cdFx0Ly9lbmdpbmUuY3VzdG9tZnVuYz1jdXN0b21mdW5jLmdldEFQSShyZXNbMF0uY29uZmlnKTtcclxuXHRcdGVuZ2luZS5yZWFkeT10cnVlO1xyXG5cdH1cclxuXHJcblx0dmFyIHByZWxvYWQ9Z2V0UHJlbG9hZEZpZWxkKG9wdHMucHJlbG9hZCk7XHJcblx0dmFyIG9wdHM9e3JlY3Vyc2l2ZTp0cnVlfTtcclxuXHQvL2lmICh0eXBlb2YgY2I9PVwiZnVuY3Rpb25cIikge1xyXG5cdFx0X2dldHMuYXBwbHkoZW5naW5lLFsgcHJlbG9hZCwgb3B0cyxmdW5jdGlvbihyZXMpe1xyXG5cdFx0XHRzZXRQcmVsb2FkKHJlcyk7XHJcblx0XHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFtlbmdpbmVdKTtcclxuXHRcdH1dKTtcclxuXHQvL30gZWxzZSB7XHJcblx0Ly9cdHNldFByZWxvYWQoX2dldFN5bmMuYXBwbHkoZW5naW5lLFtwcmVsb2FkLG9wdHNdKSk7XHJcblx0Ly99XHJcblx0cmV0dXJuIGVuZ2luZTtcclxufVxyXG5cclxudmFyIHNlZ09mZnNldD1mdW5jdGlvbihzZWduYW1lKSB7XHJcblx0dmFyIGVuZ2luZT10aGlzO1xyXG5cdGlmIChhcmd1bWVudHMubGVuZ3RoPjEpIHRocm93IFwiYXJndW1lbnQgOiBzZWduYW1lIFwiO1xyXG5cclxuXHR2YXIgc2VnTmFtZXM9ZW5naW5lLmdldChcInNlZ25hbWVzXCIpO1xyXG5cdHZhciBzZWdPZmZzZXRzPWVuZ2luZS5nZXQoXCJzZWdvZmZzZXRzXCIpO1xyXG5cclxuXHR2YXIgaT1zZWdOYW1lcy5pbmRleE9mKHNlZ25hbWUpO1xyXG5cdHJldHVybiAoaT4tMSk/c2VnT2Zmc2V0c1tpXTowO1xyXG59XHJcbnZhciBmaWxlT2Zmc2V0PWZ1bmN0aW9uKGZuKSB7XHJcblx0dmFyIGVuZ2luZT10aGlzO1xyXG5cdHZhciBmaWxlbmFtZXM9ZW5naW5lLmdldChcImZpbGVuYW1lc1wiKTtcclxuXHR2YXIgb2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZW9mZnNldHNcIik7XHJcblx0dmFyIGk9ZmlsZW5hbWVzLmluZGV4T2YoZm4pO1xyXG5cdGlmIChpPT0tMSkgcmV0dXJuIG51bGw7XHJcblx0cmV0dXJuIHtzdGFydDogb2Zmc2V0c1tpXSwgZW5kOm9mZnNldHNbaSsxXX07XHJcbn1cclxuXHJcbnZhciBmb2xkZXJPZmZzZXQ9ZnVuY3Rpb24oZm9sZGVyKSB7XHJcblx0dmFyIGVuZ2luZT10aGlzO1xyXG5cdHZhciBzdGFydD0wLGVuZD0wO1xyXG5cdHZhciBmaWxlbmFtZXM9ZW5naW5lLmdldChcImZpbGVuYW1lc1wiKTtcclxuXHR2YXIgb2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZW9mZnNldHNcIik7XHJcblx0Zm9yICh2YXIgaT0wO2k8ZmlsZW5hbWVzLmxlbmd0aDtpKyspIHtcclxuXHRcdGlmIChmaWxlbmFtZXNbaV0uc3Vic3RyaW5nKDAsZm9sZGVyLmxlbmd0aCk9PWZvbGRlcikge1xyXG5cdFx0XHRpZiAoIXN0YXJ0KSBzdGFydD1vZmZzZXRzW2ldO1xyXG5cdFx0XHRlbmQ9b2Zmc2V0c1tpXTtcclxuXHRcdH0gZWxzZSBpZiAoc3RhcnQpIGJyZWFrO1xyXG5cdH1cclxuXHRyZXR1cm4ge3N0YXJ0OnN0YXJ0LGVuZDplbmR9O1xyXG59XHJcblxyXG4gLy9UT0RPIGRlbGV0ZSBkaXJlY3RseSBmcm9tIGtkYiBpbnN0YW5jZVxyXG4gLy9rZGIuZnJlZSgpO1xyXG52YXIgY2xvc2VMb2NhbD1mdW5jdGlvbihrZGJpZCkge1xyXG5cdHZhciBlbmdpbmU9bG9jYWxQb29sW2tkYmlkXTtcclxuXHRpZiAoZW5naW5lKSB7XHJcblx0XHRlbmdpbmUua2RiLmZyZWUoKTtcclxuXHRcdGRlbGV0ZSBsb2NhbFBvb2xba2RiaWRdO1xyXG5cdH1cclxufVxyXG52YXIgY2xvc2U9ZnVuY3Rpb24oa2RiaWQpIHtcclxuXHR2YXIgZW5naW5lPXBvb2xba2RiaWRdO1xyXG5cdGlmIChlbmdpbmUpIHtcclxuXHRcdGVuZ2luZS5rZGIuZnJlZSgpO1xyXG5cdFx0ZGVsZXRlIHBvb2xba2RiaWRdO1xyXG5cdH1cclxufVxyXG5cclxudmFyIGdldExvY2FsVHJpZXM9ZnVuY3Rpb24oa2RiZm4pIHtcclxuXHRpZiAoIWtkYmxpc3RlZCkge1xyXG5cdFx0a2Ricz1yZXF1aXJlKFwiLi9saXN0a2RiXCIpKCk7XHJcblx0XHRrZGJsaXN0ZWQ9dHJ1ZTtcclxuXHR9XHJcblxyXG5cdHZhciBrZGJpZD1rZGJmbi5yZXBsYWNlKCcua2RiJywnJyk7XHJcblx0dmFyIHRyaWVzPSBbXCIuL1wiK2tkYmlkK1wiLmtkYlwiXHJcblx0ICAgICAgICAgICAsXCIuLi9cIitrZGJpZCtcIi5rZGJcIlxyXG5cdF07XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPGtkYnMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKGtkYnNbaV1bMF09PWtkYmlkKSB7XHJcblx0XHRcdHRyaWVzLnB1c2goa2Ric1tpXVsxXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHJldHVybiB0cmllcztcclxufVxyXG52YXIgb3BlbkxvY2FsS3NhbmFnYXA9ZnVuY3Rpb24oa2RiaWQsb3B0cyxjYixjb250ZXh0KSB7XHJcblx0dmFyIGtkYmZuPWtkYmlkO1xyXG5cdHZhciB0cmllcz1nZXRMb2NhbFRyaWVzKGtkYmZuKTtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8dHJpZXMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKGZzLmV4aXN0c1N5bmModHJpZXNbaV0pKSB7XHJcblx0XHRcdC8vY29uc29sZS5sb2coXCJrZGIgcGF0aDogXCIrbm9kZVJlcXVpcmUoJ3BhdGgnKS5yZXNvbHZlKHRyaWVzW2ldKSk7XHJcblx0XHRcdHZhciBrZGI9bmV3IEtkYi5vcGVuKHRyaWVzW2ldLGZ1bmN0aW9uKGVycixrZGIpe1xyXG5cdFx0XHRcdGlmIChlcnIpIHtcclxuXHRcdFx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW2Vycl0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjcmVhdGVMb2NhbEVuZ2luZShrZGIsb3B0cyxmdW5jdGlvbihlbmdpbmUpe1xyXG5cdFx0XHRcdFx0XHRsb2NhbFBvb2xba2RiaWRdPWVuZ2luZTtcclxuXHRcdFx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dHx8ZW5naW5lLmNvbnRleHQsWzAsZW5naW5lXSk7XHJcblx0XHRcdFx0XHR9LGNvbnRleHQpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2tkYmlkK1wiIG5vdCBmb3VuZFwiXSk7XHJcblx0cmV0dXJuIG51bGw7XHJcblxyXG59XHJcbnZhciBvcGVuTG9jYWxOb2RlPWZ1bmN0aW9uKGtkYmlkLG9wdHMsY2IsY29udGV4dCkge1xyXG5cdHZhciBmcz1yZXF1aXJlKCdmcycpO1xyXG5cdHZhciB0cmllcz1nZXRMb2NhbFRyaWVzKGtkYmlkKTtcclxuXHJcblx0Zm9yICh2YXIgaT0wO2k8dHJpZXMubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKGZzLmV4aXN0c1N5bmModHJpZXNbaV0pKSB7XHJcblxyXG5cdFx0XHRuZXcgS2RiLm9wZW4odHJpZXNbaV0sZnVuY3Rpb24oZXJyLGtkYil7XHJcblx0XHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dHx8ZW5naW5lLmNvbnRlbnQsW2Vycl0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjcmVhdGVMb2NhbEVuZ2luZShrZGIsb3B0cyxmdW5jdGlvbihlbmdpbmUpe1xyXG5cdFx0XHRcdFx0XHRcdGxvY2FsUG9vbFtrZGJpZF09ZW5naW5lO1xyXG5cdFx0XHRcdFx0XHRcdGNiLmFwcGx5KGNvbnRleHR8fGVuZ2luZS5jb250ZXh0LFswLGVuZ2luZV0pO1xyXG5cdFx0XHRcdFx0fSxjb250ZXh0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtrZGJpZCtcIiBub3QgZm91bmRcIl0pO1xyXG5cdHJldHVybiBudWxsO1xyXG59XHJcblxyXG52YXIgb3BlbkxvY2FsSHRtbDU9ZnVuY3Rpb24oa2RiaWQsb3B0cyxjYixjb250ZXh0KSB7XHRcclxuXHR2YXIgZW5naW5lPWxvY2FsUG9vbFtrZGJpZF07XHJcblx0dmFyIGtkYmZuPWtkYmlkO1xyXG5cdGlmIChrZGJmbi5pbmRleE9mKFwiLmtkYlwiKT09LTEpIGtkYmZuKz1cIi5rZGJcIjtcclxuXHRuZXcgS2RiLm9wZW4oa2RiZm4sZnVuY3Rpb24oZXJyLGhhbmRsZSl7XHJcblx0XHRpZiAoZXJyKSB7XHJcblx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW2Vycl0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y3JlYXRlTG9jYWxFbmdpbmUoaGFuZGxlLG9wdHMsZnVuY3Rpb24oZW5naW5lKXtcclxuXHRcdFx0XHRsb2NhbFBvb2xba2RiaWRdPWVuZ2luZTtcclxuXHRcdFx0XHRjYi5hcHBseShjb250ZXh0fHxlbmdpbmUuY29udGV4dCxbMCxlbmdpbmVdKTtcclxuXHRcdFx0fSxjb250ZXh0KTtcclxuXHRcdH1cclxuXHR9KTtcclxufVxyXG4vL29taXQgY2IgZm9yIHN5bmNyb25pemUgb3BlblxyXG52YXIgb3BlbkxvY2FsPWZ1bmN0aW9uKGtkYmlkLG9wdHMsY2IsY29udGV4dCkgIHtcclxuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikgeyAvL25vIG9wdHNcclxuXHRcdGlmICh0eXBlb2YgY2I9PVwib2JqZWN0XCIpIGNvbnRleHQ9Y2I7XHJcblx0XHRjYj1vcHRzO1xyXG5cdFx0b3B0cz17fTtcclxuXHR9XHJcblxyXG5cdHZhciBlbmdpbmU9bG9jYWxQb29sW2tkYmlkXTtcclxuXHRpZiAoZW5naW5lKSB7XHJcblx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHR8fGVuZ2luZS5jb250ZXh0LFswLGVuZ2luZV0pO1xyXG5cdFx0cmV0dXJuIGVuZ2luZTtcclxuXHR9XHJcblxyXG5cdHZhciBwbGF0Zm9ybT1yZXF1aXJlKFwiLi9wbGF0Zm9ybVwiKS5nZXRQbGF0Zm9ybSgpO1xyXG5cdGlmIChwbGF0Zm9ybT09XCJub2RlLXdlYmtpdFwiIHx8IHBsYXRmb3JtPT1cIm5vZGVcIikge1xyXG5cdFx0b3BlbkxvY2FsTm9kZShrZGJpZCxvcHRzLGNiLGNvbnRleHQpO1xyXG5cdH0gZWxzZSBpZiAocGxhdGZvcm09PVwiaHRtbDVcIiB8fCBwbGF0Zm9ybT09XCJjaHJvbWVcIil7XHJcblx0XHRvcGVuTG9jYWxIdG1sNShrZGJpZCxvcHRzLGNiLGNvbnRleHQpO1x0XHRcclxuXHR9IGVsc2Uge1xyXG5cdFx0b3BlbkxvY2FsS3NhbmFnYXAoa2RiaWQsb3B0cyxjYixjb250ZXh0KTtcdFxyXG5cdH1cclxufVxyXG52YXIgc2V0UGF0aD1mdW5jdGlvbihwYXRoKSB7XHJcblx0YXBwcGF0aD1wYXRoO1xyXG5cdGNvbnNvbGUubG9nKFwic2V0IHBhdGhcIixwYXRoKVxyXG59XHJcblxyXG52YXIgZW51bUtkYj1mdW5jdGlvbihjYixjb250ZXh0KXtcclxuXHRyZXR1cm4ga2Ricy5tYXAoZnVuY3Rpb24oayl7cmV0dXJuIGtbMF19KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHM9e29wZW46b3BlbkxvY2FsLHNldFBhdGg6c2V0UGF0aCwgY2xvc2U6Y2xvc2VMb2NhbCwgZW51bUtkYjplbnVtS2RifTsiLCIvKiByZXR1cm4gYXJyYXkgb2YgZGJpZCBhbmQgYWJzb2x1dGUgcGF0aCovXHJcbnZhciBsaXN0a2RiX2h0bWw1PWZ1bmN0aW9uKCkge1xyXG5cdHRocm93IFwibm90IGltcGxlbWVudCB5ZXRcIjtcclxuXHRyZXF1aXJlKFwia3NhbmEtanNvbnJvbVwiKS5odG1sNWZzLnJlYWRkaXIoZnVuY3Rpb24oa2Ricyl7XHJcblx0XHRcdGNiLmFwcGx5KHRoaXMsW2tkYnNdKTtcclxuXHR9LGNvbnRleHR8fHRoaXMpO1x0XHRcclxuXHJcbn1cclxuXHJcbnZhciBsaXN0a2RiX25vZGU9ZnVuY3Rpb24oKXtcclxuXHR2YXIgZnM9cmVxdWlyZShcImZzXCIpO1xyXG5cdHZhciBwYXRoPXJlcXVpcmUoXCJwYXRoXCIpXHJcblx0dmFyIHBhcmVudD1wYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxcIi4uXCIpO1xyXG5cdHZhciBmaWxlcz1mcy5yZWFkZGlyU3luYyhwYXJlbnQpO1xyXG5cdHZhciBvdXRwdXQ9W107XHJcblx0ZmlsZXMubWFwKGZ1bmN0aW9uKGYpe1xyXG5cdFx0dmFyIHN1YmRpcj1wYXJlbnQrcGF0aC5zZXArZjtcclxuXHRcdHZhciBzdGF0PWZzLnN0YXRTeW5jKHN1YmRpciApO1xyXG5cdFx0aWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xyXG5cdFx0XHR2YXIgc3ViZmlsZXM9ZnMucmVhZGRpclN5bmMoc3ViZGlyKTtcclxuXHRcdFx0Zm9yICh2YXIgaT0wO2k8c3ViZmlsZXMubGVuZ3RoO2krKykge1xyXG5cdFx0XHRcdHZhciBmaWxlPXN1YmZpbGVzW2ldO1xyXG5cdFx0XHRcdHZhciBpZHg9ZmlsZS5pbmRleE9mKFwiLmtkYlwiKTtcclxuXHRcdFx0XHRpZiAoaWR4Pi0xJiZpZHg9PWZpbGUubGVuZ3RoLTQpIHtcclxuXHRcdFx0XHRcdG91dHB1dC5wdXNoKFsgZmlsZS5zdWJzdHIoMCxmaWxlLmxlbmd0aC00KSwgc3ViZGlyK3BhdGguc2VwK2ZpbGVdKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9KVxyXG5cdHJldHVybiBvdXRwdXQ7XHJcbn1cclxudmFyIGZpbGVOYW1lT25seT1mdW5jdGlvbihmbikge1xyXG5cdHZhciBhdD1mbi5sYXN0SW5kZXhPZihcIi9cIik7XHJcblx0aWYgKGF0Pi0xKSByZXR1cm4gZm4uc3Vic3RyKGF0KzEpO1xyXG5cdHJldHVybiBmbjtcclxufVxyXG52YXIgbGlzdGtkYl9rc2FuYWdhcD1mdW5jdGlvbigpIHtcclxuXHR2YXIgb3V0cHV0PVtdO1xyXG5cdHZhciBhcHBzPUpTT04ucGFyc2Uoa2ZzLmxpc3RBcHBzKCkpO1xyXG5cdGZvciAodmFyIGk9MDtpPGFwcHMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIGFwcD1hcHBzW2ldO1xyXG5cdFx0aWYgKGFwcC5maWxlcykgZm9yICh2YXIgaj0wO2o8YXBwLmZpbGVzLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0dmFyIGZpbGU9YXBwLmZpbGVzW2pdO1xyXG5cdFx0XHRpZiAoZmlsZS5zdWJzdHIoZmlsZS5sZW5ndGgtNCk9PVwiLmtkYlwiKSB7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2goW2FwcC5kYmlkLGZpbGVOYW1lT25seShmaWxlKV0pO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fTtcclxuXHRyZXR1cm4gb3V0cHV0O1xyXG59XHJcbnZhciBsaXN0a2RiPWZ1bmN0aW9uKCkge1xyXG5cdHZhciBwbGF0Zm9ybT1yZXF1aXJlKFwiLi9wbGF0Zm9ybVwiKS5nZXRQbGF0Zm9ybSgpO1xyXG5cdHZhciBmaWxlcz1bXTtcclxuXHRpZiAocGxhdGZvcm09PVwibm9kZVwiIHx8IHBsYXRmb3JtPT1cIm5vZGUtd2Via2l0XCIpIHtcclxuXHRcdGZpbGVzPWxpc3RrZGJfbm9kZSgpO1xyXG5cdH0gZWxzZSBpZiAodHlwZW9mIGtmcyE9XCJ1bmRlZmluZWRcIikge1xyXG5cdFx0ZmlsZXM9bGlzdGtkYl9rc2FuYWdhcCgpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCI7XHJcblx0fVxyXG5cdHJldHVybiBmaWxlcztcclxufVxyXG5tb2R1bGUuZXhwb3J0cz1saXN0a2RiOyIsInZhciBnZXRQbGF0Zm9ybT1mdW5jdGlvbigpIHtcclxuXHRpZiAodHlwZW9mIGtzYW5hZ2FwPT1cInVuZGVmaW5lZFwiKSB7XHJcblx0XHRwbGF0Zm9ybT1cIm5vZGVcIjtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cGxhdGZvcm09a3NhbmFnYXAucGxhdGZvcm07XHJcblx0fVxyXG5cdHJldHVybiBwbGF0Zm9ybTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cz17Z2V0UGxhdGZvcm06Z2V0UGxhdGZvcm19OyIsIlxyXG4vKiBlbXVsYXRlIGZpbGVzeXN0ZW0gb24gaHRtbDUgYnJvd3NlciAqL1xyXG4vKiBlbXVsYXRlIGZpbGVzeXN0ZW0gb24gaHRtbDUgYnJvd3NlciAqL1xyXG52YXIgcmVhZD1mdW5jdGlvbihoYW5kbGUsYnVmZmVyLG9mZnNldCxsZW5ndGgscG9zaXRpb24sY2IpIHsvL2J1ZmZlciBhbmQgb2Zmc2V0IGlzIG5vdCB1c2VkXHJcblx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdHhoci5vcGVuKCdHRVQnLCBoYW5kbGUudXJsICwgdHJ1ZSk7XHJcblx0dmFyIHJhbmdlPVtwb3NpdGlvbixsZW5ndGgrcG9zaXRpb24tMV07XHJcblx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ1JhbmdlJywgJ2J5dGVzPScrcmFuZ2VbMF0rJy0nK3JhbmdlWzFdKTtcclxuXHR4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcclxuXHR4aHIuc2VuZCgpO1xyXG5cdHhoci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHRjYigwLHRoYXQucmVzcG9uc2UuYnl0ZUxlbmd0aCx0aGF0LnJlc3BvbnNlKTtcclxuXHRcdH0sMCk7XHJcblx0fTsgXHJcbn1cclxudmFyIGNsb3NlPWZ1bmN0aW9uKGhhbmRsZSkge31cclxudmFyIGZzdGF0U3luYz1mdW5jdGlvbihoYW5kbGUpIHtcclxuXHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCI7XHJcbn1cclxudmFyIGZzdGF0PWZ1bmN0aW9uKGhhbmRsZSxjYikge1xyXG5cdHRocm93IFwibm90IGltcGxlbWVudCB5ZXRcIjtcclxufVxyXG52YXIgX29wZW49ZnVuY3Rpb24oZm5fdXJsLGNiKSB7XHJcblx0XHR2YXIgaGFuZGxlPXt9O1xyXG5cdFx0aWYgKGZuX3VybC5pbmRleE9mKFwiZmlsZXN5c3RlbTpcIik9PTApe1xyXG5cdFx0XHRoYW5kbGUudXJsPWZuX3VybDtcclxuXHRcdFx0aGFuZGxlLmZuPWZuX3VybC5zdWJzdHIoIGZuX3VybC5sYXN0SW5kZXhPZihcIi9cIikrMSk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRoYW5kbGUuZm49Zm5fdXJsO1xyXG5cdFx0XHR2YXIgdXJsPUFQSS5maWxlcy5maWx0ZXIoZnVuY3Rpb24oZil7IHJldHVybiAoZlswXT09Zm5fdXJsKX0pO1xyXG5cdFx0XHRpZiAodXJsLmxlbmd0aCkgaGFuZGxlLnVybD11cmxbMF1bMV07XHJcblx0XHRcdGVsc2UgY2IobnVsbCk7XHJcblx0XHR9XHJcblx0XHRjYihoYW5kbGUpO1xyXG59XHJcbnZhciBvcGVuPWZ1bmN0aW9uKGZuX3VybCxjYikge1xyXG5cdFx0aWYgKCFBUEkuaW5pdGlhbGl6ZWQpIHtpbml0KDEwMjQqMTAyNCxmdW5jdGlvbigpe1xyXG5cdFx0XHRfb3Blbi5hcHBseSh0aGlzLFtmbl91cmwsY2JdKTtcclxuXHRcdH0sdGhpcyl9IGVsc2UgX29wZW4uYXBwbHkodGhpcyxbZm5fdXJsLGNiXSk7XHJcbn1cclxudmFyIGxvYWQ9ZnVuY3Rpb24oZmlsZW5hbWUsbW9kZSxjYikge1xyXG5cdG9wZW4oZmlsZW5hbWUsbW9kZSxjYix0cnVlKTtcclxufVxyXG5mdW5jdGlvbiBlcnJvckhhbmRsZXIoZSkge1xyXG5cdGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnICtlLm5hbWUrIFwiIFwiK2UubWVzc2FnZSk7XHJcbn1cclxudmFyIHJlYWRkaXI9ZnVuY3Rpb24oY2IsY29udGV4dCkge1xyXG5cdCB2YXIgZGlyUmVhZGVyID0gQVBJLmZzLnJvb3QuY3JlYXRlUmVhZGVyKCk7XHJcblx0IHZhciBvdXQ9W10sdGhhdD10aGlzO1xyXG5cdFx0ZGlyUmVhZGVyLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGVudHJpZXMpIHtcclxuXHRcdFx0aWYgKGVudHJpZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGVudHJ5OyBlbnRyeSA9IGVudHJpZXNbaV07ICsraSkge1xyXG5cdFx0XHRcdFx0aWYgKGVudHJ5LmlzRmlsZSkge1xyXG5cdFx0XHRcdFx0XHRvdXQucHVzaChbZW50cnkubmFtZSxlbnRyeS50b1VSTCA/IGVudHJ5LnRvVVJMKCkgOiBlbnRyeS50b1VSSSgpXSk7XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdEFQSS5maWxlcz1vdXQ7XHJcblx0XHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbb3V0XSk7XHJcblx0XHR9LCBmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW251bGxdKTtcclxuXHRcdH0pO1xyXG59XHJcbnZhciBpbml0ZnM9ZnVuY3Rpb24oZ3JhbnRlZEJ5dGVzLGNiLGNvbnRleHQpIHtcclxuXHR3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbShQRVJTSVNURU5ULCBncmFudGVkQnl0ZXMsICBmdW5jdGlvbihmcykge1xyXG5cdFx0QVBJLmZzPWZzO1xyXG5cdFx0QVBJLnF1b3RhPWdyYW50ZWRCeXRlcztcclxuXHRcdHJlYWRkaXIoZnVuY3Rpb24oKXtcclxuXHRcdFx0QVBJLmluaXRpYWxpemVkPXRydWU7XHJcblx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW2dyYW50ZWRCeXRlcyxmc10pO1xyXG5cdFx0fSxjb250ZXh0KTtcclxuXHR9LCBlcnJvckhhbmRsZXIpO1xyXG59XHJcbnZhciBpbml0PWZ1bmN0aW9uKHF1b3RhLGNiLGNvbnRleHQpIHtcclxuXHRuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UucmVxdWVzdFF1b3RhKHF1b3RhLCBcclxuXHRcdFx0ZnVuY3Rpb24oZ3JhbnRlZEJ5dGVzKSB7XHJcblx0XHRcdFx0aW5pdGZzKGdyYW50ZWRCeXRlcyxjYixjb250ZXh0KTtcclxuXHRcdH0sIGVycm9ySGFuZGxlciBcclxuXHQpO1xyXG59XHJcbnZhciBBUEk9e1xyXG5cdHJlYWQ6cmVhZFxyXG5cdCxyZWFkZGlyOnJlYWRkaXJcclxuXHQsb3BlbjpvcGVuXHJcblx0LGNsb3NlOmNsb3NlXHJcblx0LGZzdGF0U3luYzpmc3RhdFN5bmNcclxuXHQsZnN0YXQ6ZnN0YXRcclxufVxyXG5tb2R1bGUuZXhwb3J0cz1BUEk7IiwibW9kdWxlLmV4cG9ydHM9e1xyXG5cdG9wZW46cmVxdWlyZShcIi4va2RiXCIpXHJcbn1cclxuIiwiLypcclxuXHRLREIgdmVyc2lvbiAzLjAgR1BMXHJcblx0eWFwY2hlYWhzaGVuQGdtYWlsLmNvbVxyXG5cdDIwMTMvMTIvMjhcclxuXHRhc3luY3Jvbml6ZSB2ZXJzaW9uIG9mIHlhZGJcclxuXHJcbiAgcmVtb3ZlIGRlcGVuZGVuY3kgb2YgUSwgdGhhbmtzIHRvXHJcbiAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MjM0NjE5L2hvdy10by1hdm9pZC1sb25nLW5lc3Rpbmctb2YtYXN5bmNocm9ub3VzLWZ1bmN0aW9ucy1pbi1ub2RlLWpzXHJcblxyXG4gIDIwMTUvMS8yXHJcbiAgbW92ZWQgdG8ga3NhbmFmb3JnZS9rc2FuYS1qc29ucm9tXHJcbiAgYWRkIGVyciBpbiBjYWxsYmFjayBmb3Igbm9kZS5qcyBjb21wbGlhbnRcclxuKi9cclxudmFyIEtmcz1udWxsO1xyXG5cclxuaWYgKHR5cGVvZiBrc2FuYWdhcD09XCJ1bmRlZmluZWRcIikge1xyXG5cdEtmcz1yZXF1aXJlKCcuL2tkYmZzJyk7XHRcdFx0XHJcbn0gZWxzZSB7XHJcblx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cImlvc1wiKSB7XHJcblx0XHRLZnM9cmVxdWlyZShcIi4va2RiZnNfaW9zXCIpO1xyXG5cdH0gZWxzZSBpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwibm9kZS13ZWJraXRcIikge1xyXG5cdFx0S2ZzPXJlcXVpcmUoXCIuL2tkYmZzXCIpO1xyXG5cdH0gZWxzZSBpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwiY2hyb21lXCIpIHtcclxuXHRcdEtmcz1yZXF1aXJlKFwiLi9rZGJmc1wiKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0S2ZzPXJlcXVpcmUoXCIuL2tkYmZzX2FuZHJvaWRcIik7XHJcblx0fVxyXG5cdFx0XHJcbn1cclxuXHJcblxyXG52YXIgRFQ9e1xyXG5cdHVpbnQ4OicxJywgLy91bnNpZ25lZCAxIGJ5dGUgaW50ZWdlclxyXG5cdGludDMyOic0JywgLy8gc2lnbmVkIDQgYnl0ZXMgaW50ZWdlclxyXG5cdHV0Zjg6JzgnLCAgXHJcblx0dWNzMjonMicsXHJcblx0Ym9vbDonXicsIFxyXG5cdGJsb2I6JyYnLFxyXG5cdHV0ZjhhcnI6JyonLCAvL3NoaWZ0IG9mIDhcclxuXHR1Y3MyYXJyOidAJywgLy9zaGlmdCBvZiAyXHJcblx0dWludDhhcnI6JyEnLCAvL3NoaWZ0IG9mIDFcclxuXHRpbnQzMmFycjonJCcsIC8vc2hpZnQgb2YgNFxyXG5cdHZpbnQ6J2AnLFxyXG5cdHBpbnQ6J34nLFx0XHJcblxyXG5cdGFycmF5OidcXHUwMDFiJyxcclxuXHRvYmplY3Q6J1xcdTAwMWEnIFxyXG5cdC8veWRiIHN0YXJ0IHdpdGggb2JqZWN0IHNpZ25hdHVyZSxcclxuXHQvL3R5cGUgYSB5ZGIgaW4gY29tbWFuZCBwcm9tcHQgc2hvd3Mgbm90aGluZ1xyXG59XHJcbnZhciB2ZXJib3NlPTAsIHJlYWRMb2c9ZnVuY3Rpb24oKXt9O1xyXG52YXIgX3JlYWRMb2c9ZnVuY3Rpb24ocmVhZHR5cGUsYnl0ZXMpIHtcclxuXHRjb25zb2xlLmxvZyhyZWFkdHlwZSxieXRlcyxcImJ5dGVzXCIpO1xyXG59XHJcbmlmICh2ZXJib3NlKSByZWFkTG9nPV9yZWFkTG9nO1xyXG52YXIgc3Ryc2VwPVwiXFx1ZmZmZlwiO1xyXG52YXIgQ3JlYXRlPWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xyXG5cdC8qIGxvYWR4eHggZnVuY3Rpb25zIG1vdmUgZmlsZSBwb2ludGVyICovXHJcblx0Ly8gbG9hZCB2YXJpYWJsZSBsZW5ndGggaW50XHJcblx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcclxuXHRcdGNiPW9wdHM7XHJcblx0XHRvcHRzPXt9O1xyXG5cdH1cclxuXHJcblx0XHJcblx0dmFyIGxvYWRWSW50ID1mdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxjb3VudCxjYikge1xyXG5cdFx0Ly9pZiAoY291bnQ9PTApIHJldHVybiBbXTtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblxyXG5cdFx0dGhpcy5mcy5yZWFkQnVmX3BhY2tlZGludChvcHRzLmN1cixibG9ja3NpemUsY291bnQsdHJ1ZSxmdW5jdGlvbihvKXtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInZpbnRcIik7XHJcblx0XHRcdG9wdHMuY3VyKz1vLmFkdjtcclxuXHRcdFx0Y2IuYXBwbHkodGhhdCxbby5kYXRhXSk7XHJcblx0XHR9KTtcclxuXHR9XHJcblx0dmFyIGxvYWRWSW50MT1mdW5jdGlvbihvcHRzLGNiKSB7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0bG9hZFZJbnQuYXBwbHkodGhpcyxbb3B0cyw2LDEsZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdC8vY29uc29sZS5sb2coXCJ2aW50MVwiKTtcclxuXHRcdFx0Y2IuYXBwbHkodGhhdCxbZGF0YVswXV0pO1xyXG5cdFx0fV0pXHJcblx0fVxyXG5cdC8vZm9yIHBvc3RpbmdzXHJcblx0dmFyIGxvYWRQSW50ID1mdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxjb3VudCxjYikge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdHRoaXMuZnMucmVhZEJ1Zl9wYWNrZWRpbnQob3B0cy5jdXIsYmxvY2tzaXplLGNvdW50LGZhbHNlLGZ1bmN0aW9uKG8pe1xyXG5cdFx0XHQvL2NvbnNvbGUubG9nKFwicGludFwiKTtcclxuXHRcdFx0b3B0cy5jdXIrPW8uYWR2O1xyXG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvLmRhdGFdKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHQvLyBpdGVtIGNhbiBiZSBhbnkgdHlwZSAodmFyaWFibGUgbGVuZ3RoKVxyXG5cdC8vIG1heGltdW0gc2l6ZSBvZiBhcnJheSBpcyAxVEIgMl40MFxyXG5cdC8vIHN0cnVjdHVyZTpcclxuXHQvLyBzaWduYXR1cmUsNSBieXRlcyBvZmZzZXQsIHBheWxvYWQsIGl0ZW1sZW5ndGhzXHJcblx0dmFyIGdldEFycmF5TGVuZ3RoPWZ1bmN0aW9uKG9wdHMsY2IpIHtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHR2YXIgZGF0YW9mZnNldD0wO1xyXG5cclxuXHRcdHRoaXMuZnMucmVhZFVJOChvcHRzLmN1cixmdW5jdGlvbihsZW4pe1xyXG5cdFx0XHR2YXIgbGVuZ3Rob2Zmc2V0PWxlbio0Mjk0OTY3Mjk2O1xyXG5cdFx0XHRvcHRzLmN1cisrO1xyXG5cdFx0XHR0aGF0LmZzLnJlYWRVSTMyKG9wdHMuY3VyLGZ1bmN0aW9uKGxlbil7XHJcblx0XHRcdFx0b3B0cy5jdXIrPTQ7XHJcblx0XHRcdFx0ZGF0YW9mZnNldD1vcHRzLmN1cjsgLy9rZWVwIHRoaXNcclxuXHRcdFx0XHRsZW5ndGhvZmZzZXQrPWxlbjtcclxuXHRcdFx0XHRvcHRzLmN1cis9bGVuZ3Rob2Zmc2V0O1xyXG5cclxuXHRcdFx0XHRsb2FkVkludDEuYXBwbHkodGhhdCxbb3B0cyxmdW5jdGlvbihjb3VudCl7XHJcblx0XHRcdFx0XHRsb2FkVkludC5hcHBseSh0aGF0LFtvcHRzLGNvdW50KjYsY291bnQsZnVuY3Rpb24oc3ope1x0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRjYih7Y291bnQ6Y291bnQsc3o6c3osb2Zmc2V0OmRhdGFvZmZzZXR9KTtcclxuXHRcdFx0XHRcdH1dKTtcclxuXHRcdFx0XHR9XSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR2YXIgbG9hZEFycmF5ID0gZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsY2IpIHtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHRnZXRBcnJheUxlbmd0aC5hcHBseSh0aGlzLFtvcHRzLGZ1bmN0aW9uKEwpe1xyXG5cdFx0XHRcdHZhciBvPVtdO1xyXG5cdFx0XHRcdHZhciBlbmRjdXI9b3B0cy5jdXI7XHJcblx0XHRcdFx0b3B0cy5jdXI9TC5vZmZzZXQ7XHJcblxyXG5cdFx0XHRcdGlmIChvcHRzLmxhenkpIHsgXHJcblx0XHRcdFx0XHRcdHZhciBvZmZzZXQ9TC5vZmZzZXQ7XHJcblx0XHRcdFx0XHRcdEwuc3oubWFwKGZ1bmN0aW9uKHN6KXtcclxuXHRcdFx0XHRcdFx0XHRvW28ubGVuZ3RoXT1zdHJzZXArb2Zmc2V0LnRvU3RyaW5nKDE2KVxyXG5cdFx0XHRcdFx0XHRcdFx0ICAgK3N0cnNlcCtzei50b1N0cmluZygxNik7XHJcblx0XHRcdFx0XHRcdFx0b2Zmc2V0Kz1zejtcclxuXHRcdFx0XHRcdFx0fSlcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0dmFyIHRhc2txdWV1ZT1bXTtcclxuXHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPEwuY291bnQ7aSsrKSB7XHJcblx0XHRcdFx0XHRcdHRhc2txdWV1ZS5wdXNoKFxyXG5cdFx0XHRcdFx0XHRcdChmdW5jdGlvbihzeil7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGRhdGE9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IC8vbm90IHB1c2hpbmcgdGhlIGZpcnN0IGNhbGxcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHRlbHNlIG8ucHVzaChkYXRhKTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRzLmJsb2Nrc2l6ZT1zejtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb2FkLmFwcGx5KHRoYXQsW29wdHMsIHRhc2txdWV1ZS5zaGlmdCgpXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0fSkoTC5zeltpXSlcclxuXHRcdFx0XHRcdFx0KTtcclxuXHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdC8vbGFzdCBjYWxsIHRvIGNoaWxkIGxvYWRcclxuXHRcdFx0XHRcdHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRvLnB1c2goZGF0YSk7XHJcblx0XHRcdFx0XHRcdG9wdHMuY3VyPWVuZGN1cjtcclxuXHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAob3B0cy5sYXp5KSBjYi5hcHBseSh0aGF0LFtvXSk7XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRdKVxyXG5cdH1cdFx0XHJcblx0Ly8gaXRlbSBjYW4gYmUgYW55IHR5cGUgKHZhcmlhYmxlIGxlbmd0aClcclxuXHQvLyBzdXBwb3J0IGxhenkgbG9hZFxyXG5cdC8vIHN0cnVjdHVyZTpcclxuXHQvLyBzaWduYXR1cmUsNSBieXRlcyBvZmZzZXQsIHBheWxvYWQsIGl0ZW1sZW5ndGhzLCBcclxuXHQvLyAgICAgICAgICAgICAgICAgICAgc3RyaW5nYXJyYXlfc2lnbmF0dXJlLCBrZXlzXHJcblx0dmFyIGxvYWRPYmplY3QgPSBmdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxjYikge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdHZhciBzdGFydD1vcHRzLmN1cjtcclxuXHRcdGdldEFycmF5TGVuZ3RoLmFwcGx5KHRoaXMsW29wdHMsZnVuY3Rpb24oTCkge1xyXG5cdFx0XHRvcHRzLmJsb2Nrc2l6ZT1ibG9ja3NpemUtb3B0cy5jdXIrc3RhcnQ7XHJcblx0XHRcdGxvYWQuYXBwbHkodGhhdCxbb3B0cyxmdW5jdGlvbihrZXlzKXsgLy9sb2FkIHRoZSBrZXlzXHJcblx0XHRcdFx0aWYgKG9wdHMua2V5cykgeyAvL2NhbGxlciBhc2sgZm9yIGtleXNcclxuXHRcdFx0XHRcdGtleXMubWFwKGZ1bmN0aW9uKGspIHsgb3B0cy5rZXlzLnB1c2goayl9KTtcclxuXHRcdFx0XHR9XHJcblxyXG5cdFx0XHRcdHZhciBvPXt9O1xyXG5cdFx0XHRcdHZhciBlbmRjdXI9b3B0cy5jdXI7XHJcblx0XHRcdFx0b3B0cy5jdXI9TC5vZmZzZXQ7XHJcblx0XHRcdFx0aWYgKG9wdHMubGF6eSkgeyBcclxuXHRcdFx0XHRcdHZhciBvZmZzZXQ9TC5vZmZzZXQ7XHJcblx0XHRcdFx0XHRmb3IgKHZhciBpPTA7aTxMLnN6Lmxlbmd0aDtpKyspIHtcclxuXHRcdFx0XHRcdFx0Ly9wcmVmaXggd2l0aCBhIFxcMCwgaW1wb3NzaWJsZSBmb3Igbm9ybWFsIHN0cmluZ1xyXG5cdFx0XHRcdFx0XHRvW2tleXNbaV1dPXN0cnNlcCtvZmZzZXQudG9TdHJpbmcoMTYpXHJcblx0XHRcdFx0XHRcdFx0ICAgK3N0cnNlcCtMLnN6W2ldLnRvU3RyaW5nKDE2KTtcclxuXHRcdFx0XHRcdFx0b2Zmc2V0Kz1MLnN6W2ldO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR2YXIgdGFza3F1ZXVlPVtdO1xyXG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8TC5jb3VudDtpKyspIHtcclxuXHRcdFx0XHRcdFx0dGFza3F1ZXVlLnB1c2goXHJcblx0XHRcdFx0XHRcdFx0KGZ1bmN0aW9uKHN6LGtleSl7XHJcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxyXG5cdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbihkYXRhKXtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGRhdGE9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9ub3Qgc2F2aW5nIHRoZSBmaXJzdCBjYWxsO1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvW2tleV09ZGF0YTsgXHJcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9wdHMuYmxvY2tzaXplPXN6O1xyXG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh2ZXJib3NlKSByZWFkTG9nKFwia2V5XCIsa2V5KTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb2FkLmFwcGx5KHRoYXQsW29wdHMsIHRhc2txdWV1ZS5zaGlmdCgpXSk7XHJcblx0XHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHRcdCk7XHJcblx0XHRcdFx0XHRcdFx0fSkoTC5zeltpXSxrZXlzW2ktMV0pXHJcblxyXG5cdFx0XHRcdFx0XHQpO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0Ly9sYXN0IGNhbGwgdG8gY2hpbGQgbG9hZFxyXG5cdFx0XHRcdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdG9ba2V5c1trZXlzLmxlbmd0aC0xXV09ZGF0YTtcclxuXHRcdFx0XHRcdFx0b3B0cy5jdXI9ZW5kY3VyO1xyXG5cdFx0XHRcdFx0XHRjYi5hcHBseSh0aGF0LFtvXSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0aWYgKG9wdHMubGF6eSkgY2IuYXBwbHkodGhhdCxbb10pO1xyXG5cdFx0XHRcdGVsc2Uge1xyXG5cdFx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fV0pO1xyXG5cdFx0fV0pO1xyXG5cdH1cclxuXHJcblx0Ly9pdGVtIGlzIHNhbWUga25vd24gdHlwZVxyXG5cdHZhciBsb2FkU3RyaW5nQXJyYXk9ZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHR0aGlzLmZzLnJlYWRTdHJpbmdBcnJheShvcHRzLmN1cixibG9ja3NpemUsZW5jb2RpbmcsZnVuY3Rpb24obyl7XHJcblx0XHRcdG9wdHMuY3VyKz1ibG9ja3NpemU7XHJcblx0XHRcdGNiLmFwcGx5KHRoYXQsW29dKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHR2YXIgbG9hZEludGVnZXJBcnJheT1mdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSx1bml0c2l6ZSxjYikge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdGxvYWRWSW50MS5hcHBseSh0aGlzLFtvcHRzLGZ1bmN0aW9uKGNvdW50KXtcclxuXHRcdFx0dmFyIG89dGhhdC5mcy5yZWFkRml4ZWRBcnJheShvcHRzLmN1cixjb3VudCx1bml0c2l6ZSxmdW5jdGlvbihvKXtcclxuXHRcdFx0XHRvcHRzLmN1cis9Y291bnQqdW5pdHNpemU7XHJcblx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH1dKTtcclxuXHR9XHJcblx0dmFyIGxvYWRCbG9iPWZ1bmN0aW9uKGJsb2Nrc2l6ZSxjYikge1xyXG5cdFx0dmFyIG89dGhpcy5mcy5yZWFkQnVmKHRoaXMuY3VyLGJsb2Nrc2l6ZSk7XHJcblx0XHR0aGlzLmN1cis9YmxvY2tzaXplO1xyXG5cdFx0cmV0dXJuIG87XHJcblx0fVx0XHJcblx0dmFyIGxvYWRieXNpZ25hdHVyZT1mdW5jdGlvbihvcHRzLHNpZ25hdHVyZSxjYikge1xyXG5cdFx0ICB2YXIgYmxvY2tzaXplPW9wdHMuYmxvY2tzaXplfHx0aGlzLmZzLnNpemU7IFxyXG5cdFx0XHRvcHRzLmN1cis9dGhpcy5mcy5zaWduYXR1cmVfc2l6ZTtcclxuXHRcdFx0dmFyIGRhdGFzaXplPWJsb2Nrc2l6ZS10aGlzLmZzLnNpZ25hdHVyZV9zaXplO1xyXG5cdFx0XHQvL2Jhc2ljIHR5cGVzXHJcblx0XHRcdGlmIChzaWduYXR1cmU9PT1EVC5pbnQzMikge1xyXG5cdFx0XHRcdG9wdHMuY3VyKz00O1xyXG5cdFx0XHRcdHRoaXMuZnMucmVhZEkzMihvcHRzLmN1ci00LGNiKTtcclxuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51aW50OCkge1xyXG5cdFx0XHRcdG9wdHMuY3VyKys7XHJcblx0XHRcdFx0dGhpcy5mcy5yZWFkVUk4KG9wdHMuY3VyLTEsY2IpO1xyXG5cdFx0XHR9IGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnV0ZjgpIHtcclxuXHRcdFx0XHR2YXIgYz1vcHRzLmN1cjtvcHRzLmN1cis9ZGF0YXNpemU7XHJcblx0XHRcdFx0dGhpcy5mcy5yZWFkU3RyaW5nKGMsZGF0YXNpemUsJ3V0ZjgnLGNiKTtcclxuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51Y3MyKSB7XHJcblx0XHRcdFx0dmFyIGM9b3B0cy5jdXI7b3B0cy5jdXIrPWRhdGFzaXplO1xyXG5cdFx0XHRcdHRoaXMuZnMucmVhZFN0cmluZyhjLGRhdGFzaXplLCd1Y3MyJyxjYik7XHRcclxuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5ib29sKSB7XHJcblx0XHRcdFx0b3B0cy5jdXIrKztcclxuXHRcdFx0XHR0aGlzLmZzLnJlYWRVSTgob3B0cy5jdXItMSxmdW5jdGlvbihkYXRhKXtjYighIWRhdGEpfSk7XHJcblx0XHRcdH0gZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQuYmxvYikge1xyXG5cdFx0XHRcdGxvYWRCbG9iKGRhdGFzaXplLGNiKTtcclxuXHRcdFx0fVxyXG5cdFx0XHQvL3ZhcmlhYmxlIGxlbmd0aCBpbnRlZ2Vyc1xyXG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC52aW50KSB7XHJcblx0XHRcdFx0bG9hZFZJbnQuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSxkYXRhc2l6ZSxjYl0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnBpbnQpIHtcclxuXHRcdFx0XHRsb2FkUEludC5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLGRhdGFzaXplLGNiXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0Ly9zaW1wbGUgYXJyYXlcclxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudXRmOGFycikge1xyXG5cdFx0XHRcdGxvYWRTdHJpbmdBcnJheS5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLCd1dGY4JyxjYl0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnVjczJhcnIpIHtcclxuXHRcdFx0XHRsb2FkU3RyaW5nQXJyYXkuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSwndWNzMicsY2JdKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51aW50OGFycikge1xyXG5cdFx0XHRcdGxvYWRJbnRlZ2VyQXJyYXkuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSwxLGNiXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQuaW50MzJhcnIpIHtcclxuXHRcdFx0XHRsb2FkSW50ZWdlckFycmF5LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsNCxjYl0pO1xyXG5cdFx0XHR9XHJcblx0XHRcdC8vbmVzdGVkIHN0cnVjdHVyZVxyXG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5hcnJheSkge1xyXG5cdFx0XHRcdGxvYWRBcnJheS5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLGNiXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQub2JqZWN0KSB7XHJcblx0XHRcdFx0bG9hZE9iamVjdC5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLGNiXSk7XHJcblx0XHRcdH1cclxuXHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0Y29uc29sZS5lcnJvcigndW5zdXBwb3J0ZWQgdHlwZScsc2lnbmF0dXJlLG9wdHMpXHJcblx0XHRcdFx0Y2IuYXBwbHkodGhpcyxbbnVsbF0pOy8vbWFrZSBzdXJlIGl0IHJldHVyblxyXG5cdFx0XHRcdC8vdGhyb3cgJ3Vuc3VwcG9ydGVkIHR5cGUgJytzaWduYXR1cmU7XHJcblx0XHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBsb2FkPWZ1bmN0aW9uKG9wdHMsY2IpIHtcclxuXHRcdG9wdHM9b3B0c3x8e307IC8vIHRoaXMgd2lsbCBzZXJ2ZWQgYXMgY29udGV4dCBmb3IgZW50aXJlIGxvYWQgcHJvY2VkdXJlXHJcblx0XHRvcHRzLmN1cj1vcHRzLmN1cnx8MDtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHR0aGlzLmZzLnJlYWRTaWduYXR1cmUob3B0cy5jdXIsIGZ1bmN0aW9uKHNpZ25hdHVyZSl7XHJcblx0XHRcdGxvYWRieXNpZ25hdHVyZS5hcHBseSh0aGF0LFtvcHRzLHNpZ25hdHVyZSxjYl0pXHJcblx0XHR9KTtcclxuXHRcdHJldHVybiB0aGlzO1xyXG5cdH1cclxuXHR2YXIgQ0FDSEU9bnVsbDtcclxuXHR2YXIgS0VZPXt9O1xyXG5cdHZhciBBRERSRVNTPXt9O1xyXG5cdHZhciByZXNldD1mdW5jdGlvbihjYikge1xyXG5cdFx0aWYgKCFDQUNIRSkge1xyXG5cdFx0XHRsb2FkLmFwcGx5KHRoaXMsW3tjdXI6MCxsYXp5OnRydWV9LGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdENBQ0hFPWRhdGE7XHJcblx0XHRcdFx0Y2IuY2FsbCh0aGlzKTtcclxuXHRcdFx0fV0pO1x0XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRjYi5jYWxsKHRoaXMpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIGV4aXN0cz1mdW5jdGlvbihwYXRoLGNiKSB7XHJcblx0XHRpZiAocGF0aC5sZW5ndGg9PTApIHJldHVybiB0cnVlO1xyXG5cdFx0dmFyIGtleT1wYXRoLnBvcCgpO1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdGdldC5hcHBseSh0aGlzLFtwYXRoLGZhbHNlLGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRpZiAoIXBhdGguam9pbihzdHJzZXApKSByZXR1cm4gKCEhS0VZW2tleV0pO1xyXG5cdFx0XHR2YXIga2V5cz1LRVlbcGF0aC5qb2luKHN0cnNlcCldO1xyXG5cdFx0XHRwYXRoLnB1c2goa2V5KTsvL3B1dCBpdCBiYWNrXHJcblx0XHRcdGlmIChrZXlzKSBjYi5hcHBseSh0aGF0LFtrZXlzLmluZGV4T2Yoa2V5KT4tMV0pO1xyXG5cdFx0XHRlbHNlIGNiLmFwcGx5KHRoYXQsW2ZhbHNlXSk7XHJcblx0XHR9XSk7XHJcblx0fVxyXG5cclxuXHR2YXIgZ2V0U3luYz1mdW5jdGlvbihwYXRoKSB7XHJcblx0XHRpZiAoIUNBQ0hFKSByZXR1cm4gdW5kZWZpbmVkO1x0XHJcblx0XHR2YXIgbz1DQUNIRTtcclxuXHRcdGZvciAodmFyIGk9MDtpPHBhdGgubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgcj1vW3BhdGhbaV1dO1xyXG5cdFx0XHRpZiAodHlwZW9mIHI9PVwidW5kZWZpbmVkXCIpIHJldHVybiBudWxsO1xyXG5cdFx0XHRvPXI7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbztcclxuXHR9XHJcblx0dmFyIGdldD1mdW5jdGlvbihwYXRoLG9wdHMsY2IpIHtcclxuXHRcdGlmICh0eXBlb2YgcGF0aD09J3VuZGVmaW5lZCcpIHBhdGg9W107XHJcblx0XHRpZiAodHlwZW9mIHBhdGg9PVwic3RyaW5nXCIpIHBhdGg9W3BhdGhdO1xyXG5cdFx0Ly9vcHRzLnJlY3Vyc2l2ZT0hIW9wdHMucmVjdXJzaXZlO1xyXG5cdFx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcclxuXHRcdFx0Y2I9b3B0cztub2RlXHJcblx0XHRcdG9wdHM9e307XHJcblx0XHR9XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0aWYgKHR5cGVvZiBjYiE9J2Z1bmN0aW9uJykgcmV0dXJuIGdldFN5bmMocGF0aCk7XHJcblxyXG5cdFx0cmVzZXQuYXBwbHkodGhpcyxbZnVuY3Rpb24oKXtcclxuXHRcdFx0dmFyIG89Q0FDSEU7XHJcblx0XHRcdGlmIChwYXRoLmxlbmd0aD09MCkge1xyXG5cdFx0XHRcdGlmIChvcHRzLmFkZHJlc3MpIHtcclxuXHRcdFx0XHRcdGNiKFswLHRoYXQuZnMuc2l6ZV0pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRjYihbT2JqZWN0LmtleXMoQ0FDSEUpXSk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRcdHJldHVybjtcclxuXHRcdFx0fSBcclxuXHRcdFx0XHJcblx0XHRcdHZhciBwYXRobm93PVwiXCIsdGFza3F1ZXVlPVtdLG5ld29wdHM9e30scj1udWxsO1xyXG5cdFx0XHR2YXIgbGFzdGtleT1cIlwiO1xyXG5cclxuXHRcdFx0Zm9yICh2YXIgaT0wO2k8cGF0aC5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdFx0dmFyIHRhc2s9KGZ1bmN0aW9uKGtleSxrKXtcclxuXHJcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoISh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkge1xyXG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygb1tsYXN0a2V5XT09J3N0cmluZycgJiYgb1tsYXN0a2V5XVswXT09c3Ryc2VwKSBvW2xhc3RrZXldPXt9O1xyXG5cdFx0XHRcdFx0XHRcdG9bbGFzdGtleV09ZGF0YTsgXHJcblx0XHRcdFx0XHRcdFx0bz1vW2xhc3RrZXldO1xyXG5cdFx0XHRcdFx0XHRcdHI9ZGF0YVtrZXldO1xyXG5cdFx0XHRcdFx0XHRcdEtFWVtwYXRobm93XT1vcHRzLmtleXM7XHRcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdGRhdGE9b1trZXldO1xyXG5cdFx0XHRcdFx0XHRcdHI9ZGF0YTtcclxuXHRcdFx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByPT09XCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRcdFx0XHRcdHRhc2txdWV1ZT1udWxsO1xyXG5cdFx0XHRcdFx0XHRcdGNiLmFwcGx5KHRoYXQsW3JdKTsgLy9yZXR1cm4gZW1wdHkgdmFsdWVcclxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcdFx0XHRcdFx0XHRcdFxyXG5cdFx0XHRcdFx0XHRcdGlmIChwYXJzZUludChrKSkgcGF0aG5vdys9c3Ryc2VwO1xyXG5cdFx0XHRcdFx0XHRcdHBhdGhub3crPWtleTtcclxuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHI9PSdzdHJpbmcnICYmIHJbMF09PXN0cnNlcCkgeyAvL29mZnNldCBvZiBkYXRhIHRvIGJlIGxvYWRlZFxyXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHA9ci5zdWJzdHJpbmcoMSkuc3BsaXQoc3Ryc2VwKS5tYXAoZnVuY3Rpb24oaXRlbSl7cmV0dXJuIHBhcnNlSW50KGl0ZW0sMTYpfSk7XHJcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyPXBbMF0sc3o9cFsxXTtcclxuXHRcdFx0XHRcdFx0XHRcdG5ld29wdHMubGF6eT0hb3B0cy5yZWN1cnNpdmUgfHwgKGs8cGF0aC5sZW5ndGgtMSkgO1xyXG5cdFx0XHRcdFx0XHRcdFx0bmV3b3B0cy5ibG9ja3NpemU9c3o7bmV3b3B0cy5jdXI9Y3VyLG5ld29wdHMua2V5cz1bXTtcclxuXHRcdFx0XHRcdFx0XHRcdGxhc3RrZXk9a2V5OyAvL2xvYWQgaXMgc3luYyBpbiBhbmRyb2lkXHJcblx0XHRcdFx0XHRcdFx0XHRpZiAob3B0cy5hZGRyZXNzICYmIHRhc2txdWV1ZS5sZW5ndGg9PTEpIHtcclxuXHRcdFx0XHRcdFx0XHRcdFx0QUREUkVTU1twYXRobm93XT1bY3VyLHN6XTtcclxuXHRcdFx0XHRcdFx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkobnVsbCxBRERSRVNTW3BhdGhub3ddKTtcclxuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdGxvYWQuYXBwbHkodGhhdCxbbmV3b3B0cywgdGFza3F1ZXVlLnNoaWZ0KCldKTtcclxuXHRcdFx0XHRcdFx0XHRcdH1cclxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9wdHMuYWRkcmVzcyAmJiB0YXNrcXVldWUubGVuZ3RoPT0xKSB7XHJcblx0XHRcdFx0XHRcdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpKG51bGwsQUREUkVTU1twYXRobm93XSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0XHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKS5hcHBseSh0aGF0LFtyXSk7XHJcblx0XHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdFx0fVxyXG5cdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdH0pXHJcblx0XHRcdFx0KHBhdGhbaV0saSk7XHJcblx0XHRcdFx0XHJcblx0XHRcdFx0dGFza3F1ZXVlLnB1c2godGFzayk7XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGlmICh0YXNrcXVldWUubGVuZ3RoPT0wKSB7XHJcblx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdC8vbGFzdCBjYWxsIHRvIGNoaWxkIGxvYWRcclxuXHRcdFx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhLGN1cnN6KXtcclxuXHRcdFx0XHRcdGlmIChvcHRzLmFkZHJlc3MpIHtcclxuXHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbY3Vyc3pdKTtcclxuXHRcdFx0XHRcdH0gZWxzZXtcclxuXHRcdFx0XHRcdFx0dmFyIGtleT1wYXRoW3BhdGgubGVuZ3RoLTFdO1xyXG5cdFx0XHRcdFx0XHRvW2tleV09ZGF0YTsgS0VZW3BhdGhub3ddPW9wdHMua2V5cztcclxuXHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbZGF0YV0pO1xyXG5cdFx0XHRcdFx0fVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTtcdFx0XHRcclxuXHRcdFx0fVxyXG5cclxuXHRcdH1dKTsgLy9yZXNldFxyXG5cdH1cclxuXHQvLyBnZXQgYWxsIGtleXMgaW4gZ2l2ZW4gcGF0aFxyXG5cdHZhciBnZXRrZXlzPWZ1bmN0aW9uKHBhdGgsY2IpIHtcclxuXHRcdGlmICghcGF0aCkgcGF0aD1bXVxyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHJcblx0XHRnZXQuYXBwbHkodGhpcyxbcGF0aCxmYWxzZSxmdW5jdGlvbigpe1xyXG5cdFx0XHRpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCkge1xyXG5cdFx0XHRcdGNiLmFwcGx5KHRoYXQsW0tFWVtwYXRoLmpvaW4oc3Ryc2VwKV1dKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRjYi5hcHBseSh0aGF0LFtPYmplY3Qua2V5cyhDQUNIRSldKTsgXHJcblx0XHRcdFx0Ly90b3AgbGV2ZWwsIG5vcm1hbGx5IGl0IGlzIHZlcnkgc21hbGxcclxuXHRcdFx0fVxyXG5cdFx0fV0pO1xyXG5cdH1cclxuXHJcblx0dmFyIHNldHVwYXBpPWZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5sb2FkPWxvYWQ7XHJcbi8vXHRcdHRoaXMuY3VyPTA7XHJcblx0XHR0aGlzLmNhY2hlPWZ1bmN0aW9uKCkge3JldHVybiBDQUNIRX07XHJcblx0XHR0aGlzLmtleT1mdW5jdGlvbigpIHtyZXR1cm4gS0VZfTtcclxuXHRcdHRoaXMuZnJlZT1mdW5jdGlvbigpIHtcclxuXHRcdFx0Q0FDSEU9bnVsbDtcclxuXHRcdFx0S0VZPW51bGw7XHJcblx0XHRcdHRoaXMuZnMuZnJlZSgpO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zZXRDYWNoZT1mdW5jdGlvbihjKSB7Q0FDSEU9Y307XHJcblx0XHR0aGlzLmtleXM9Z2V0a2V5cztcclxuXHRcdHRoaXMuZ2V0PWdldDsgICAvLyBnZXQgYSBmaWVsZCwgbG9hZCBpZiBuZWVkZWRcclxuXHRcdHRoaXMuZXhpc3RzPWV4aXN0cztcclxuXHRcdHRoaXMuRFQ9RFQ7XHJcblx0XHRcclxuXHRcdC8vaW5zdGFsbCB0aGUgc3luYyB2ZXJzaW9uIGZvciBub2RlXHJcblx0XHQvL2lmICh0eXBlb2YgcHJvY2VzcyE9XCJ1bmRlZmluZWRcIikgcmVxdWlyZShcIi4va2RiX3N5bmNcIikodGhpcyk7XHJcblx0XHQvL2lmIChjYikgc2V0VGltZW91dChjYi5iaW5kKHRoaXMpLDApO1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdHZhciBlcnI9MDtcclxuXHRcdGlmIChjYikge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Y2IoZXJyLHRoYXQpO1x0XHJcblx0XHRcdH0sMCk7XHJcblx0XHR9XHJcblx0fVxyXG5cdHZhciB0aGF0PXRoaXM7XHJcblx0dmFyIGtmcz1uZXcgS2ZzKHBhdGgsb3B0cyxmdW5jdGlvbihlcnIpe1xyXG5cdFx0aWYgKGVycikge1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0Y2IoZXJyLDApO1xyXG5cdFx0XHR9LDApO1xyXG5cdFx0XHRyZXR1cm4gbnVsbDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoYXQuc2l6ZT10aGlzLnNpemU7XHJcblx0XHRcdHNldHVwYXBpLmNhbGwodGhhdCk7XHRcdFx0XHJcblx0XHR9XHJcblx0fSk7XHJcblx0dGhpcy5mcz1rZnM7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbkNyZWF0ZS5kYXRhdHlwZXM9RFQ7XHJcblxyXG5pZiAobW9kdWxlKSBtb2R1bGUuZXhwb3J0cz1DcmVhdGU7XHJcbi8vcmV0dXJuIENyZWF0ZTtcclxuIiwiLyogbm9kZS5qcyBhbmQgaHRtbDUgZmlsZSBzeXN0ZW0gYWJzdHJhY3Rpb24gbGF5ZXIqL1xyXG50cnkge1xyXG5cdHZhciBmcz1yZXF1aXJlKFwiZnNcIik7XHJcblx0dmFyIEJ1ZmZlcj1yZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcjtcclxufSBjYXRjaCAoZSkge1xyXG5cdHZhciBmcz1yZXF1aXJlKCcuL2h0bWw1cmVhZCcpO1xyXG5cdHZhciBCdWZmZXI9ZnVuY3Rpb24oKXsgcmV0dXJuIFwiXCJ9O1xyXG5cdHZhciBodG1sNWZzPXRydWU7IFx0XHJcbn1cclxudmFyIHNpZ25hdHVyZV9zaXplPTE7XHJcbnZhciB2ZXJib3NlPTAsIHJlYWRMb2c9ZnVuY3Rpb24oKXt9O1xyXG52YXIgX3JlYWRMb2c9ZnVuY3Rpb24ocmVhZHR5cGUsYnl0ZXMpIHtcclxuXHRjb25zb2xlLmxvZyhyZWFkdHlwZSxieXRlcyxcImJ5dGVzXCIpO1xyXG59XHJcbmlmICh2ZXJib3NlKSByZWFkTG9nPV9yZWFkTG9nO1xyXG5cclxudmFyIHVucGFja19pbnQgPSBmdW5jdGlvbiAoYXIsIGNvdW50ICwgcmVzZXQpIHtcclxuICAgY291bnQ9Y291bnR8fGFyLmxlbmd0aDtcclxuICB2YXIgciA9IFtdLCBpID0gMCwgdiA9IDA7XHJcbiAgZG8ge1xyXG5cdHZhciBzaGlmdCA9IDA7XHJcblx0ZG8ge1xyXG5cdCAgdiArPSAoKGFyW2ldICYgMHg3RikgPDwgc2hpZnQpO1xyXG5cdCAgc2hpZnQgKz0gNztcdCAgXHJcblx0fSB3aGlsZSAoYXJbKytpXSAmIDB4ODApO1xyXG5cdHIucHVzaCh2KTsgaWYgKHJlc2V0KSB2PTA7XHJcblx0Y291bnQtLTtcclxuICB9IHdoaWxlIChpPGFyLmxlbmd0aCAmJiBjb3VudCk7XHJcbiAgcmV0dXJuIHtkYXRhOnIsIGFkdjppIH07XHJcbn1cclxudmFyIE9wZW49ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XHJcblx0b3B0cz1vcHRzfHx7fTtcclxuXHJcblx0dmFyIHJlYWRTaWduYXR1cmU9ZnVuY3Rpb24ocG9zLGNiKSB7XHJcblx0XHR2YXIgYnVmPW5ldyBCdWZmZXIoc2lnbmF0dXJlX3NpemUpO1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmLDAsc2lnbmF0dXJlX3NpemUscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcclxuXHRcdFx0aWYgKGh0bWw1ZnMpIHZhciBzaWduYXR1cmU9U3RyaW5nLmZyb21DaGFyQ29kZSgobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSlbMF0pXHJcblx0XHRcdGVsc2UgdmFyIHNpZ25hdHVyZT1idWZmZXIudG9TdHJpbmcoJ3V0ZjgnLDAsc2lnbmF0dXJlX3NpemUpO1xyXG5cdFx0XHRjYi5hcHBseSh0aGF0LFtzaWduYXR1cmVdKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly90aGlzIGlzIHF1aXRlIHNsb3dcclxuXHQvL3dhaXQgZm9yIFN0cmluZ1ZpZXcgK0FycmF5QnVmZmVyIHRvIHNvbHZlIHRoZSBwcm9ibGVtXHJcblx0Ly9odHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2EvY2hyb21pdW0ub3JnL2ZvcnVtLyMhdG9waWMvYmxpbmstZGV2L3lsZ2lOWV9aU1YwXHJcblx0Ly9pZiB0aGUgc3RyaW5nIGlzIGFsd2F5cyB1Y3MyXHJcblx0Ly9jYW4gdXNlIFVpbnQxNiB0byByZWFkIGl0LlxyXG5cdC8vaHR0cDovL3VwZGF0ZXMuaHRtbDVyb2Nrcy5jb20vMjAxMi8wNi9Ib3ctdG8tY29udmVydC1BcnJheUJ1ZmZlci10by1hbmQtZnJvbS1TdHJpbmdcclxuXHR2YXIgZGVjb2RldXRmOCA9IGZ1bmN0aW9uICh1dGZ0ZXh0KSB7XHJcblx0XHR2YXIgc3RyaW5nID0gXCJcIjtcclxuXHRcdHZhciBpID0gMDtcclxuXHRcdHZhciBjPTAsYzEgPSAwLCBjMiA9IDAgLCBjMz0wO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8dXRmdGV4dC5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdGlmICh1dGZ0ZXh0LmNoYXJDb2RlQXQoaSk+MTI3KSBicmVhaztcclxuXHRcdH1cclxuXHRcdGlmIChpPj11dGZ0ZXh0Lmxlbmd0aCkgcmV0dXJuIHV0ZnRleHQ7XHJcblxyXG5cdFx0d2hpbGUgKCBpIDwgdXRmdGV4dC5sZW5ndGggKSB7XHJcblx0XHRcdGMgPSB1dGZ0ZXh0LmNoYXJDb2RlQXQoaSk7XHJcblx0XHRcdGlmIChjIDwgMTI4KSB7XHJcblx0XHRcdFx0c3RyaW5nICs9IHV0ZnRleHRbaV07XHJcblx0XHRcdFx0aSsrO1xyXG5cdFx0XHR9IGVsc2UgaWYoKGMgPiAxOTEpICYmIChjIDwgMjI0KSkge1xyXG5cdFx0XHRcdGMyID0gdXRmdGV4dC5jaGFyQ29kZUF0KGkrMSk7XHJcblx0XHRcdFx0c3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcclxuXHRcdFx0XHRpICs9IDI7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0YzIgPSB1dGZ0ZXh0LmNoYXJDb2RlQXQoaSsxKTtcclxuXHRcdFx0XHRjMyA9IHV0ZnRleHQuY2hhckNvZGVBdChpKzIpO1xyXG5cdFx0XHRcdHN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcclxuXHRcdFx0XHRpICs9IDM7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBzdHJpbmc7XHJcblx0fVxyXG5cclxuXHR2YXIgcmVhZFN0cmluZz0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xyXG5cdFx0ZW5jb2Rpbmc9ZW5jb2Rpbmd8fCd1dGY4JztcclxuXHRcdHZhciBidWZmZXI9bmV3IEJ1ZmZlcihibG9ja3NpemUpO1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsYmxvY2tzaXplLHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XHJcblx0XHRcdHJlYWRMb2coXCJzdHJpbmdcIixsZW4pO1xyXG5cdFx0XHRpZiAoaHRtbDVmcykge1xyXG5cdFx0XHRcdGlmIChlbmNvZGluZz09J3V0ZjgnKSB7XHJcblx0XHRcdFx0XHR2YXIgc3RyPWRlY29kZXV0ZjgoU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDhBcnJheShidWZmZXIpKSlcclxuXHRcdFx0XHR9IGVsc2UgeyAvL3VjczIgaXMgMyB0aW1lcyBmYXN0ZXJcclxuXHRcdFx0XHRcdHZhciBzdHI9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDE2QXJyYXkoYnVmZmVyKSlcdFxyXG5cdFx0XHRcdH1cclxuXHRcdFx0XHRcclxuXHRcdFx0XHRjYi5hcHBseSh0aGF0LFtzdHJdKTtcclxuXHRcdFx0fSBcclxuXHRcdFx0ZWxzZSBjYi5hcHBseSh0aGF0LFtidWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpXSk7XHRcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly93b3JrIGFyb3VuZCBmb3IgY2hyb21lIGZyb21DaGFyQ29kZSBjYW5ub3QgYWNjZXB0IGh1Z2UgYXJyYXlcclxuXHQvL2h0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD01NjU4OFxyXG5cdHZhciBidWYyc3RyaW5nYXJyPWZ1bmN0aW9uKGJ1ZixlbmMpIHtcclxuXHRcdGlmIChlbmM9PVwidXRmOFwiKSBcdHZhciBhcnI9bmV3IFVpbnQ4QXJyYXkoYnVmKTtcclxuXHRcdGVsc2UgdmFyIGFycj1uZXcgVWludDE2QXJyYXkoYnVmKTtcclxuXHRcdHZhciBpPTAsY29kZXM9W10sb3V0PVtdLHM9XCJcIjtcclxuXHRcdHdoaWxlIChpPGFyci5sZW5ndGgpIHtcclxuXHRcdFx0aWYgKGFycltpXSkge1xyXG5cdFx0XHRcdGNvZGVzW2NvZGVzLmxlbmd0aF09YXJyW2ldO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHM9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGNvZGVzKTtcclxuXHRcdFx0XHRpZiAoZW5jPT1cInV0ZjhcIikgb3V0W291dC5sZW5ndGhdPWRlY29kZXV0Zjgocyk7XHJcblx0XHRcdFx0ZWxzZSBvdXRbb3V0Lmxlbmd0aF09cztcclxuXHRcdFx0XHRjb2Rlcz1bXTtcdFx0XHRcdFxyXG5cdFx0XHR9XHJcblx0XHRcdGkrKztcclxuXHRcdH1cclxuXHRcdFxyXG5cdFx0cz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsY29kZXMpO1xyXG5cdFx0aWYgKGVuYz09XCJ1dGY4XCIpIG91dFtvdXQubGVuZ3RoXT1kZWNvZGV1dGY4KHMpO1xyXG5cdFx0ZWxzZSBvdXRbb3V0Lmxlbmd0aF09cztcclxuXHJcblx0XHRyZXR1cm4gb3V0O1xyXG5cdH1cclxuXHR2YXIgcmVhZFN0cmluZ0FycmF5ID0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcyxvdXQ9bnVsbDtcclxuXHRcdGlmIChibG9ja3NpemU9PTApIHJldHVybiBbXTtcclxuXHRcdGVuY29kaW5nPWVuY29kaW5nfHwndXRmOCc7XHJcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoYmxvY2tzaXplKTtcclxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsYmxvY2tzaXplLHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XHJcblx0XHRcdGlmIChodG1sNWZzKSB7XHJcblx0XHRcdFx0cmVhZExvZyhcInN0cmluZ0FycmF5XCIsYnVmZmVyLmJ5dGVMZW5ndGgpO1xyXG5cclxuXHRcdFx0XHRpZiAoZW5jb2Rpbmc9PSd1dGY4Jykge1xyXG5cdFx0XHRcdFx0b3V0PWJ1ZjJzdHJpbmdhcnIoYnVmZmVyLFwidXRmOFwiKTtcclxuXHRcdFx0XHR9IGVsc2UgeyAvL3VjczIgaXMgMyB0aW1lcyBmYXN0ZXJcclxuXHRcdFx0XHRcdG91dD1idWYyc3RyaW5nYXJyKGJ1ZmZlcixcInVjczJcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJlYWRMb2coXCJzdHJpbmdBcnJheVwiLGJ1ZmZlci5sZW5ndGgpO1xyXG5cdFx0XHRcdG91dD1idWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpLnNwbGl0KCdcXDAnKTtcclxuXHRcdFx0fSBcdFxyXG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvdXRdKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHR2YXIgcmVhZFVJMzI9ZnVuY3Rpb24ocG9zLGNiKSB7XHJcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoNCk7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWZmZXIsMCw0LHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XHJcblx0XHRcdHJlYWRMb2coXCJ1aTMyXCIsbGVuKTtcclxuXHRcdFx0aWYgKGh0bWw1ZnMpe1xyXG5cdFx0XHRcdC8vdj0obmV3IFVpbnQzMkFycmF5KGJ1ZmZlcikpWzBdO1xyXG5cdFx0XHRcdHZhciB2PW5ldyBEYXRhVmlldyhidWZmZXIpLmdldFVpbnQzMigwLCBmYWxzZSlcclxuXHRcdFx0XHRjYih2KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlIGNiLmFwcGx5KHRoYXQsW2J1ZmZlci5yZWFkSW50MzJCRSgwKV0pO1x0XHJcblx0XHR9KTtcdFx0XHJcblx0fVxyXG5cclxuXHR2YXIgcmVhZEkzMj1mdW5jdGlvbihwb3MsY2IpIHtcclxuXHRcdHZhciBidWZmZXI9bmV3IEJ1ZmZlcig0KTtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZmZlciwwLDQscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcclxuXHRcdFx0cmVhZExvZyhcImkzMlwiLGxlbik7XHJcblx0XHRcdGlmIChodG1sNWZzKXtcclxuXHRcdFx0XHR2YXIgdj1uZXcgRGF0YVZpZXcoYnVmZmVyKS5nZXRJbnQzMigwLCBmYWxzZSlcclxuXHRcdFx0XHRjYih2KTtcclxuXHRcdFx0fVxyXG5cdFx0XHRlbHNlICBcdGNiLmFwcGx5KHRoYXQsW2J1ZmZlci5yZWFkSW50MzJCRSgwKV0pO1x0XHJcblx0XHR9KTtcclxuXHR9XHJcblx0dmFyIHJlYWRVSTg9ZnVuY3Rpb24ocG9zLGNiKSB7XHJcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoMSk7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cclxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsMSxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xyXG5cdFx0XHRyZWFkTG9nKFwidWk4XCIsbGVuKTtcclxuXHRcdFx0aWYgKGh0bWw1ZnMpY2IoIChuZXcgVWludDhBcnJheShidWZmZXIpKVswXSkgO1xyXG5cdFx0XHRlbHNlICBcdFx0XHRjYi5hcHBseSh0aGF0LFtidWZmZXIucmVhZFVJbnQ4KDApXSk7XHRcclxuXHRcdFx0XHJcblx0XHR9KTtcclxuXHR9XHJcblx0dmFyIHJlYWRCdWY9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjYikge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdHZhciBidWY9bmV3IEJ1ZmZlcihibG9ja3NpemUpO1xyXG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWYsMCxibG9ja3NpemUscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcclxuXHRcdFx0cmVhZExvZyhcImJ1ZlwiLGxlbik7XHJcblx0XHRcdHZhciBidWZmPW5ldyBVaW50OEFycmF5KGJ1ZmZlcilcclxuXHRcdFx0Y2IuYXBwbHkodGhhdCxbYnVmZl0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdHZhciByZWFkQnVmX3BhY2tlZGludD1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNvdW50LHJlc2V0LGNiKSB7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0cmVhZEJ1Zi5hcHBseSh0aGlzLFtwb3MsYmxvY2tzaXplLGZ1bmN0aW9uKGJ1ZmZlcil7XHJcblx0XHRcdGNiLmFwcGx5KHRoYXQsW3VucGFja19pbnQoYnVmZmVyLGNvdW50LHJlc2V0KV0pO1x0XHJcblx0XHR9XSk7XHJcblx0XHRcclxuXHR9XHJcblx0dmFyIHJlYWRGaXhlZEFycmF5X2h0bWw1ZnM9ZnVuY3Rpb24ocG9zLGNvdW50LHVuaXRzaXplLGNiKSB7XHJcblx0XHR2YXIgZnVuYz1udWxsO1xyXG5cdFx0aWYgKHVuaXRzaXplPT09MSkge1xyXG5cdFx0XHRmdW5jPSdnZXRVaW50OCc7Ly9VaW50OEFycmF5O1xyXG5cdFx0fSBlbHNlIGlmICh1bml0c2l6ZT09PTIpIHtcclxuXHRcdFx0ZnVuYz0nZ2V0VWludDE2JzsvL1VpbnQxNkFycmF5O1xyXG5cdFx0fSBlbHNlIGlmICh1bml0c2l6ZT09PTQpIHtcclxuXHRcdFx0ZnVuYz0nZ2V0VWludDMyJzsvL1VpbnQzMkFycmF5O1xyXG5cdFx0fSBlbHNlIHRocm93ICd1bnN1cHBvcnRlZCBpbnRlZ2VyIHNpemUnO1xyXG5cclxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsbnVsbCwwLHVuaXRzaXplKmNvdW50LHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XHJcblx0XHRcdHJlYWRMb2coXCJmaXggYXJyYXlcIixsZW4pO1xyXG5cdFx0XHR2YXIgb3V0PVtdO1xyXG5cdFx0XHRpZiAodW5pdHNpemU9PTEpIHtcclxuXHRcdFx0XHRvdXQ9bmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbiAvIHVuaXRzaXplOyBpKyspIHsgLy9lbmRpYW4gcHJvYmxlbVxyXG5cdFx0XHRcdC8vXHRvdXQucHVzaCggZnVuYyhidWZmZXIsaSp1bml0c2l6ZSkpO1xyXG5cdFx0XHRcdFx0b3V0LnB1c2goIHY9bmV3IERhdGFWaWV3KGJ1ZmZlcilbZnVuY10oaSxmYWxzZSkgKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHJcblx0XHRcdGNiLmFwcGx5KHRoYXQsW291dF0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cdC8vIHNpZ25hdHVyZSwgaXRlbWNvdW50LCBwYXlsb2FkXHJcblx0dmFyIHJlYWRGaXhlZEFycmF5ID0gZnVuY3Rpb24ocG9zICxjb3VudCwgdW5pdHNpemUsY2IpIHtcclxuXHRcdHZhciBmdW5jPW51bGw7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0XHJcblx0XHRpZiAodW5pdHNpemUqIGNvdW50PnRoaXMuc2l6ZSAmJiB0aGlzLnNpemUpICB7XHJcblx0XHRcdGNvbnNvbGUubG9nKFwiYXJyYXkgc2l6ZSBleGNlZWQgZmlsZSBzaXplXCIsdGhpcy5zaXplKVxyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdGlmIChodG1sNWZzKSByZXR1cm4gcmVhZEZpeGVkQXJyYXlfaHRtbDVmcy5hcHBseSh0aGlzLFtwb3MsY291bnQsdW5pdHNpemUsY2JdKTtcclxuXHJcblx0XHR2YXIgaXRlbXM9bmV3IEJ1ZmZlciggdW5pdHNpemUqIGNvdW50KTtcclxuXHRcdGlmICh1bml0c2l6ZT09PTEpIHtcclxuXHRcdFx0ZnVuYz1pdGVtcy5yZWFkVUludDg7XHJcblx0XHR9IGVsc2UgaWYgKHVuaXRzaXplPT09Mikge1xyXG5cdFx0XHRmdW5jPWl0ZW1zLnJlYWRVSW50MTZCRTtcclxuXHRcdH0gZWxzZSBpZiAodW5pdHNpemU9PT00KSB7XHJcblx0XHRcdGZ1bmM9aXRlbXMucmVhZFVJbnQzMkJFO1xyXG5cdFx0fSBlbHNlIHRocm93ICd1bnN1cHBvcnRlZCBpbnRlZ2VyIHNpemUnO1xyXG5cdFx0Ly9jb25zb2xlLmxvZygnaXRlbWNvdW50JyxpdGVtY291bnQsJ2J1ZmZlcicsYnVmZmVyKTtcclxuXHJcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGl0ZW1zLDAsdW5pdHNpemUqY291bnQscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcclxuXHRcdFx0cmVhZExvZyhcImZpeCBhcnJheVwiLGxlbik7XHJcblx0XHRcdHZhciBvdXQ9W107XHJcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoIC8gdW5pdHNpemU7IGkrKykge1xyXG5cdFx0XHRcdG91dC5wdXNoKCBmdW5jLmFwcGx5KGl0ZW1zLFtpKnVuaXRzaXplXSkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNiLmFwcGx5KHRoYXQsW291dF0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHR2YXIgZnJlZT1mdW5jdGlvbigpIHtcclxuXHRcdC8vY29uc29sZS5sb2coJ2Nsb3NpbmcgJyxoYW5kbGUpO1xyXG5cdFx0ZnMuY2xvc2VTeW5jKHRoaXMuaGFuZGxlKTtcclxuXHR9XHJcblx0dmFyIHNldHVwYXBpPWZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdHRoaXMucmVhZFNpZ25hdHVyZT1yZWFkU2lnbmF0dXJlO1xyXG5cdFx0dGhpcy5yZWFkSTMyPXJlYWRJMzI7XHJcblx0XHR0aGlzLnJlYWRVSTMyPXJlYWRVSTMyO1xyXG5cdFx0dGhpcy5yZWFkVUk4PXJlYWRVSTg7XHJcblx0XHR0aGlzLnJlYWRCdWY9cmVhZEJ1ZjtcclxuXHRcdHRoaXMucmVhZEJ1Zl9wYWNrZWRpbnQ9cmVhZEJ1Zl9wYWNrZWRpbnQ7XHJcblx0XHR0aGlzLnJlYWRGaXhlZEFycmF5PXJlYWRGaXhlZEFycmF5O1xyXG5cdFx0dGhpcy5yZWFkU3RyaW5nPXJlYWRTdHJpbmc7XHJcblx0XHR0aGlzLnJlYWRTdHJpbmdBcnJheT1yZWFkU3RyaW5nQXJyYXk7XHJcblx0XHR0aGlzLnNpZ25hdHVyZV9zaXplPXNpZ25hdHVyZV9zaXplO1xyXG5cdFx0dGhpcy5mcmVlPWZyZWU7XHJcblx0XHRpZiAoaHRtbDVmcykge1xyXG5cdFx0XHR2YXIgZm49cGF0aDtcclxuXHRcdFx0aWYgKHBhdGguaW5kZXhPZihcImZpbGVzeXN0ZW06XCIpPT0wKSBmbj1wYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSk7XHJcblx0XHRcdGZzLmZzLnJvb3QuZ2V0RmlsZShmbix7fSxmdW5jdGlvbihlbnRyeSl7XHJcblx0XHRcdCAgZW50cnkuZ2V0TWV0YWRhdGEoZnVuY3Rpb24obWV0YWRhdGEpIHsgXHJcblx0XHRcdFx0dGhhdC5zaXplPW1ldGFkYXRhLnNpemU7XHJcblx0XHRcdFx0aWYgKGNiKSBzZXRUaW1lb3V0KGNiLmJpbmQodGhhdCksMCk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHN0YXQ9ZnMuZnN0YXRTeW5jKHRoaXMuaGFuZGxlKTtcclxuXHRcdFx0dGhpcy5zdGF0PXN0YXQ7XHJcblx0XHRcdHRoaXMuc2l6ZT1zdGF0LnNpemU7XHRcdFxyXG5cdFx0XHRpZiAoY2IpXHRzZXRUaW1lb3V0KGNiLmJpbmQodGhpcywwKSwwKTtcdFxyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0dmFyIHRoYXQ9dGhpcztcclxuXHRpZiAoaHRtbDVmcykge1xyXG5cdFx0ZnMub3BlbihwYXRoLGZ1bmN0aW9uKGgpe1xyXG5cdFx0XHRpZiAoIWgpIHtcclxuXHRcdFx0XHRpZiAoY2IpXHRzZXRUaW1lb3V0KGNiLmJpbmQobnVsbCxcImZpbGUgbm90IGZvdW5kOlwiK3BhdGgpLDApO1x0XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dGhhdC5oYW5kbGU9aDtcclxuXHRcdFx0XHR0aGF0Lmh0bWw1ZnM9dHJ1ZTtcclxuXHRcdFx0XHRzZXR1cGFwaS5jYWxsKHRoYXQpO1xyXG5cdFx0XHRcdHRoYXQub3BlbmVkPXRydWU7XHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0fSlcclxuXHR9IGVsc2Uge1xyXG5cdFx0aWYgKGZzLmV4aXN0c1N5bmMocGF0aCkpe1xyXG5cdFx0XHR0aGlzLmhhbmRsZT1mcy5vcGVuU3luYyhwYXRoLCdyJyk7Ly8sZnVuY3Rpb24oZXJyLGhhbmRsZSl7XHJcblx0XHRcdHRoaXMub3BlbmVkPXRydWU7XHJcblx0XHRcdHNldHVwYXBpLmNhbGwodGhpcyk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoY2IpXHRzZXRUaW1lb3V0KGNiLmJpbmQobnVsbCxcImZpbGUgbm90IGZvdW5kOlwiK3BhdGgpLDApO1x0XHJcblx0XHRcdHJldHVybiBudWxsO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRyZXR1cm4gdGhpcztcclxufVxyXG5tb2R1bGUuZXhwb3J0cz1PcGVuOyIsIi8qXHJcbiAgSkFWQSBjYW4gb25seSByZXR1cm4gTnVtYmVyIGFuZCBTdHJpbmdcclxuXHRhcnJheSBhbmQgYnVmZmVyIHJldHVybiBpbiBzdHJpbmcgZm9ybWF0XHJcblx0bmVlZCBKU09OLnBhcnNlXHJcbiovXHJcbnZhciB2ZXJib3NlPTA7XHJcblxyXG52YXIgcmVhZFNpZ25hdHVyZT1mdW5jdGlvbihwb3MsY2IpIHtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgc2lnbmF0dXJlXCIpO1xyXG5cdHZhciBzaWduYXR1cmU9a2ZzLnJlYWRVVEY4U3RyaW5nKHRoaXMuaGFuZGxlLHBvcywxKTtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhzaWduYXR1cmUsc2lnbmF0dXJlLmNoYXJDb2RlQXQoMCkpO1xyXG5cdGNiLmFwcGx5KHRoaXMsW3NpZ25hdHVyZV0pO1xyXG59XHJcbnZhciByZWFkSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xyXG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBpMzIgYXQgXCIrcG9zKTtcclxuXHR2YXIgaTMyPWtmcy5yZWFkSW50MzIodGhpcy5oYW5kbGUscG9zKTtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhpMzIpO1xyXG5cdGNiLmFwcGx5KHRoaXMsW2kzMl0pO1x0XHJcbn1cclxudmFyIHJlYWRVSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xyXG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCB1aTMyIGF0IFwiK3Bvcyk7XHJcblx0dmFyIHVpMzI9a2ZzLnJlYWRVSW50MzIodGhpcy5oYW5kbGUscG9zKTtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1Zyh1aTMyKTtcclxuXHRjYi5hcHBseSh0aGlzLFt1aTMyXSk7XHJcbn1cclxudmFyIHJlYWRVSTg9ZnVuY3Rpb24ocG9zLGNiKSB7XHJcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIHVpOCBhdCBcIitwb3MpOyBcclxuXHR2YXIgdWk4PWtmcy5yZWFkVUludDgodGhpcy5oYW5kbGUscG9zKTtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1Zyh1aTgpO1xyXG5cdGNiLmFwcGx5KHRoaXMsW3VpOF0pO1xyXG59XHJcbnZhciByZWFkQnVmPWZ1bmN0aW9uKHBvcyxibG9ja3NpemUsY2IpIHtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgYnVmZmVyIGF0IFwiK3BvcysgXCIgYmxvY2tzaXplIFwiK2Jsb2Nrc2l6ZSk7XHJcblx0dmFyIGJ1Zj1rZnMucmVhZEJ1Zih0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcclxuXHR2YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zik7XHJcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJidWZmZXIgbGVuZ3RoXCIrYnVmZi5sZW5ndGgpO1xyXG5cdGNiLmFwcGx5KHRoaXMsW2J1ZmZdKTtcdFxyXG59XHJcbnZhciByZWFkQnVmX3BhY2tlZGludD1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNvdW50LHJlc2V0LGNiKSB7XHJcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIHBhY2tlZCBpbnQgYXQgXCIrcG9zK1wiIGJsb2Nrc2l6ZSBcIitibG9ja3NpemUrXCIgY291bnQgXCIrY291bnQpO1xyXG5cdHZhciBidWY9a2ZzLnJlYWRCdWZfcGFja2VkaW50KHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUsY291bnQscmVzZXQpO1xyXG5cdHZhciBhZHY9cGFyc2VJbnQoYnVmKTtcclxuXHR2YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zi5zdWJzdHIoYnVmLmluZGV4T2YoXCJbXCIpKSk7XHJcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJwYWNrZWRJbnQgbGVuZ3RoIFwiK2J1ZmYubGVuZ3RoK1wiIGZpcnN0IGl0ZW09XCIrYnVmZlswXSk7XHJcblx0Y2IuYXBwbHkodGhpcyxbe2RhdGE6YnVmZixhZHY6YWR2fV0pO1x0XHJcbn1cclxuXHJcblxyXG52YXIgcmVhZFN0cmluZz0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xyXG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZHN0cmluZyBhdCBcIitwb3MrXCIgYmxvY2tzaXplIFwiICtibG9ja3NpemUrXCIgZW5jOlwiK2VuY29kaW5nKTtcclxuXHRpZiAoZW5jb2Rpbmc9PVwidWNzMlwiKSB7XHJcblx0XHR2YXIgc3RyPWtmcy5yZWFkVUxFMTZTdHJpbmcodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBzdHI9a2ZzLnJlYWRVVEY4U3RyaW5nKHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUpO1x0XHJcblx0fVx0IFxyXG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKHN0cik7XHJcblx0Y2IuYXBwbHkodGhpcyxbc3RyXSk7XHRcclxufVxyXG5cclxudmFyIHJlYWRGaXhlZEFycmF5ID0gZnVuY3Rpb24ocG9zICxjb3VudCwgdW5pdHNpemUsY2IpIHtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgZml4ZWQgYXJyYXkgYXQgXCIrcG9zK1wiIGNvdW50IFwiK2NvdW50K1wiIHVuaXRzaXplIFwiK3VuaXRzaXplKTsgXHJcblx0dmFyIGJ1Zj1rZnMucmVhZEZpeGVkQXJyYXkodGhpcy5oYW5kbGUscG9zLGNvdW50LHVuaXRzaXplKTtcclxuXHR2YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zik7XHJcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJhcnJheSBsZW5ndGhcIitidWZmLmxlbmd0aCk7XHJcblx0Y2IuYXBwbHkodGhpcyxbYnVmZl0pO1x0XHJcbn1cclxudmFyIHJlYWRTdHJpbmdBcnJheSA9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5sb2coXCJyZWFkIFN0cmluZyBhcnJheSBhdCBcIitwb3MrXCIgYmxvY2tzaXplIFwiK2Jsb2Nrc2l6ZSArXCIgZW5jIFwiK2VuY29kaW5nKTsgXHJcblx0ZW5jb2RpbmcgPSBlbmNvZGluZ3x8XCJ1dGY4XCI7XHJcblx0dmFyIGJ1Zj1rZnMucmVhZFN0cmluZ0FycmF5KHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUsZW5jb2RpbmcpO1xyXG5cdC8vdmFyIGJ1ZmY9SlNPTi5wYXJzZShidWYpO1xyXG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBzdHJpbmcgYXJyYXlcIik7XHJcblx0dmFyIGJ1ZmY9YnVmLnNwbGl0KFwiXFx1ZmZmZlwiKTsgLy9jYW5ub3QgcmV0dXJuIHN0cmluZyB3aXRoIDBcclxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcImFycmF5IGxlbmd0aFwiK2J1ZmYubGVuZ3RoKTtcclxuXHRjYi5hcHBseSh0aGlzLFtidWZmXSk7XHRcclxufVxyXG52YXIgbWVyZ2VQb3N0aW5ncz1mdW5jdGlvbihwb3NpdGlvbnMsY2IpIHtcclxuXHR2YXIgYnVmPWtmcy5tZXJnZVBvc3RpbmdzKHRoaXMuaGFuZGxlLEpTT04uc3RyaW5naWZ5KHBvc2l0aW9ucykpO1xyXG5cdGlmICghYnVmIHx8IGJ1Zi5sZW5ndGg9PTApIHJldHVybiBbXTtcclxuXHRlbHNlIHJldHVybiBKU09OLnBhcnNlKGJ1Zik7XHJcbn1cclxuXHJcbnZhciBmcmVlPWZ1bmN0aW9uKCkge1xyXG5cdC8vY29uc29sZS5sb2coJ2Nsb3NpbmcgJyxoYW5kbGUpO1xyXG5cdGtmcy5jbG9zZSh0aGlzLmhhbmRsZSk7XHJcbn1cclxudmFyIE9wZW49ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XHJcblx0b3B0cz1vcHRzfHx7fTtcclxuXHR2YXIgc2lnbmF0dXJlX3NpemU9MTtcclxuXHR2YXIgc2V0dXBhcGk9ZnVuY3Rpb24oKSB7IFxyXG5cdFx0dGhpcy5yZWFkU2lnbmF0dXJlPXJlYWRTaWduYXR1cmU7XHJcblx0XHR0aGlzLnJlYWRJMzI9cmVhZEkzMjtcclxuXHRcdHRoaXMucmVhZFVJMzI9cmVhZFVJMzI7XHJcblx0XHR0aGlzLnJlYWRVSTg9cmVhZFVJODtcclxuXHRcdHRoaXMucmVhZEJ1Zj1yZWFkQnVmO1xyXG5cdFx0dGhpcy5yZWFkQnVmX3BhY2tlZGludD1yZWFkQnVmX3BhY2tlZGludDtcclxuXHRcdHRoaXMucmVhZEZpeGVkQXJyYXk9cmVhZEZpeGVkQXJyYXk7XHJcblx0XHR0aGlzLnJlYWRTdHJpbmc9cmVhZFN0cmluZztcclxuXHRcdHRoaXMucmVhZFN0cmluZ0FycmF5PXJlYWRTdHJpbmdBcnJheTtcclxuXHRcdHRoaXMuc2lnbmF0dXJlX3NpemU9c2lnbmF0dXJlX3NpemU7XHJcblx0XHR0aGlzLm1lcmdlUG9zdGluZ3M9bWVyZ2VQb3N0aW5ncztcclxuXHRcdHRoaXMuZnJlZT1mcmVlO1xyXG5cdFx0dGhpcy5zaXplPWtmcy5nZXRGaWxlU2l6ZSh0aGlzLmhhbmRsZSk7XHJcblx0XHRpZiAodmVyYm9zZSkgY29uc29sZS5sb2coXCJmaWxlc2l6ZSAgXCIrdGhpcy5zaXplKTtcclxuXHRcdGlmIChjYilcdGNiLmNhbGwodGhpcyk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmhhbmRsZT1rZnMub3BlbihwYXRoKTtcclxuXHR0aGlzLm9wZW5lZD10cnVlO1xyXG5cdHNldHVwYXBpLmNhbGwodGhpcyk7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzPU9wZW47IiwiLypcclxuICBKU0NvbnRleHQgY2FuIHJldHVybiBhbGwgSmF2YXNjcmlwdCB0eXBlcy5cclxuKi9cclxudmFyIHZlcmJvc2U9MTtcclxuXHJcbnZhciByZWFkU2lnbmF0dXJlPWZ1bmN0aW9uKHBvcyxjYikge1xyXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBzaWduYXR1cmUgYXQgXCIrcG9zKTtcclxuXHR2YXIgc2lnbmF0dXJlPWtmcy5yZWFkVVRGOFN0cmluZyh0aGlzLmhhbmRsZSxwb3MsMSk7XHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coc2lnbmF0dXJlK1wiIFwiK3NpZ25hdHVyZS5jaGFyQ29kZUF0KDApKTtcclxuXHRjYi5hcHBseSh0aGlzLFtzaWduYXR1cmVdKTtcclxufVxyXG52YXIgcmVhZEkzMj1mdW5jdGlvbihwb3MsY2IpIHtcclxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgaTMyIGF0IFwiK3Bvcyk7XHJcblx0dmFyIGkzMj1rZnMucmVhZEludDMyKHRoaXMuaGFuZGxlLHBvcyk7XHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coaTMyKTtcclxuXHRjYi5hcHBseSh0aGlzLFtpMzJdKTtcdFxyXG59XHJcbnZhciByZWFkVUkzMj1mdW5jdGlvbihwb3MsY2IpIHtcclxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgdWkzMiBhdCBcIitwb3MpO1xyXG5cdHZhciB1aTMyPWtmcy5yZWFkVUludDMyKHRoaXMuaGFuZGxlLHBvcyk7XHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2codWkzMik7XHJcblx0Y2IuYXBwbHkodGhpcyxbdWkzMl0pO1xyXG59XHJcbnZhciByZWFkVUk4PWZ1bmN0aW9uKHBvcyxjYikge1xyXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCB1aTggYXQgXCIrcG9zKTsgXHJcblx0dmFyIHVpOD1rZnMucmVhZFVJbnQ4KHRoaXMuaGFuZGxlLHBvcyk7XHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2codWk4KTtcclxuXHRjYi5hcHBseSh0aGlzLFt1aThdKTtcclxufVxyXG52YXIgcmVhZEJ1Zj1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNiKSB7XHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIGJ1ZmZlciBhdCBcIitwb3MpO1xyXG5cdHZhciBidWY9a2ZzLnJlYWRCdWYodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJidWZmZXIgbGVuZ3RoXCIrYnVmLmxlbmd0aCk7XHJcblx0Y2IuYXBwbHkodGhpcyxbYnVmXSk7XHRcclxufVxyXG52YXIgcmVhZEJ1Zl9wYWNrZWRpbnQ9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjb3VudCxyZXNldCxjYikge1xyXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBwYWNrZWQgaW50IGZhc3QsIGJsb2Nrc2l6ZSBcIitibG9ja3NpemUrXCIgYXQgXCIrcG9zKTt2YXIgdD1uZXcgRGF0ZSgpO1xyXG5cdHZhciBidWY9a2ZzLnJlYWRCdWZfcGFja2VkaW50KHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUsY291bnQscmVzZXQpO1xyXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmV0dXJuIGZyb20gcGFja2VkaW50LCB0aW1lXCIgKyAobmV3IERhdGUoKS10KSk7XHJcblx0aWYgKHR5cGVvZiBidWYuZGF0YT09XCJzdHJpbmdcIikge1xyXG5cdFx0YnVmLmRhdGE9ZXZhbChcIltcIitidWYuZGF0YS5zdWJzdHIoMCxidWYuZGF0YS5sZW5ndGgtMSkrXCJdXCIpO1xyXG5cdH1cclxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInVucGFja2VkIGxlbmd0aFwiK2J1Zi5kYXRhLmxlbmd0aCtcIiB0aW1lXCIgKyAobmV3IERhdGUoKS10KSApO1xyXG5cdGNiLmFwcGx5KHRoaXMsW2J1Zl0pO1xyXG59XHJcblxyXG5cclxudmFyIHJlYWRTdHJpbmc9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcclxuXHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkc3RyaW5nIGF0IFwiK3BvcytcIiBibG9ja3NpemUgXCIrYmxvY2tzaXplK1wiIFwiK2VuY29kaW5nKTt2YXIgdD1uZXcgRGF0ZSgpO1xyXG5cdGlmIChlbmNvZGluZz09XCJ1Y3MyXCIpIHtcclxuXHRcdHZhciBzdHI9a2ZzLnJlYWRVTEUxNlN0cmluZyh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0dmFyIHN0cj1rZnMucmVhZFVURjhTdHJpbmcodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XHRcclxuXHR9XHJcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coc3RyK1wiIHRpbWVcIisobmV3IERhdGUoKS10KSk7XHJcblx0Y2IuYXBwbHkodGhpcyxbc3RyXSk7XHRcclxufVxyXG5cclxudmFyIHJlYWRGaXhlZEFycmF5ID0gZnVuY3Rpb24ocG9zICxjb3VudCwgdW5pdHNpemUsY2IpIHtcclxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgZml4ZWQgYXJyYXkgYXQgXCIrcG9zKTsgdmFyIHQ9bmV3IERhdGUoKTtcclxuXHR2YXIgYnVmPWtmcy5yZWFkRml4ZWRBcnJheSh0aGlzLmhhbmRsZSxwb3MsY291bnQsdW5pdHNpemUpO1xyXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwiYXJyYXkgbGVuZ3RoIFwiK2J1Zi5sZW5ndGgrXCIgdGltZVwiKyhuZXcgRGF0ZSgpLXQpKTtcclxuXHRjYi5hcHBseSh0aGlzLFtidWZdKTtcdFxyXG59XHJcbnZhciByZWFkU3RyaW5nQXJyYXkgPSBmdW5jdGlvbihwb3MsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XHJcblx0Ly9pZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgU3RyaW5nIGFycmF5IFwiK2Jsb2Nrc2l6ZSArXCIgXCIrZW5jb2RpbmcpOyBcclxuXHRlbmNvZGluZyA9IGVuY29kaW5nfHxcInV0ZjhcIjtcclxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgc3RyaW5nIGFycmF5IGF0IFwiK3Bvcyk7dmFyIHQ9bmV3IERhdGUoKTtcclxuXHR2YXIgYnVmPWtmcy5yZWFkU3RyaW5nQXJyYXkodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyk7XHJcblx0aWYgKHR5cGVvZiBidWY9PVwic3RyaW5nXCIpIGJ1Zj1idWYuc3BsaXQoXCJcXDBcIik7XHJcblx0Ly92YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zik7XHJcblx0Ly92YXIgYnVmZj1idWYuc3BsaXQoXCJcXHVmZmZmXCIpOyAvL2Nhbm5vdCByZXR1cm4gc3RyaW5nIHdpdGggMFxyXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwic3RyaW5nIGFycmF5IGxlbmd0aFwiK2J1Zi5sZW5ndGgrXCIgdGltZVwiKyhuZXcgRGF0ZSgpLXQpKTtcclxuXHRjYi5hcHBseSh0aGlzLFtidWZdKTtcclxufVxyXG5cclxudmFyIG1lcmdlUG9zdGluZ3M9ZnVuY3Rpb24ocG9zaXRpb25zKSB7XHJcblx0dmFyIGJ1Zj1rZnMubWVyZ2VQb3N0aW5ncyh0aGlzLmhhbmRsZSxwb3NpdGlvbnMpO1xyXG5cdGlmICh0eXBlb2YgYnVmPT1cInN0cmluZ1wiKSB7XHJcblx0XHRidWY9ZXZhbChcIltcIitidWYuc3Vic3RyKDAsYnVmLmxlbmd0aC0xKStcIl1cIik7XHJcblx0fVxyXG5cdHJldHVybiBidWY7XHJcbn1cclxudmFyIGZyZWU9ZnVuY3Rpb24oKSB7XHJcblx0Ly8vL2lmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKCdjbG9zaW5nICcsaGFuZGxlKTtcclxuXHRrZnMuY2xvc2UodGhpcy5oYW5kbGUpO1xyXG59XHJcbnZhciBPcGVuPWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xyXG5cdG9wdHM9b3B0c3x8e307XHJcblx0dmFyIHNpZ25hdHVyZV9zaXplPTE7XHJcblx0dmFyIHNldHVwYXBpPWZ1bmN0aW9uKCkgeyBcclxuXHRcdHRoaXMucmVhZFNpZ25hdHVyZT1yZWFkU2lnbmF0dXJlO1xyXG5cdFx0dGhpcy5yZWFkSTMyPXJlYWRJMzI7XHJcblx0XHR0aGlzLnJlYWRVSTMyPXJlYWRVSTMyO1xyXG5cdFx0dGhpcy5yZWFkVUk4PXJlYWRVSTg7XHJcblx0XHR0aGlzLnJlYWRCdWY9cmVhZEJ1ZjtcclxuXHRcdHRoaXMucmVhZEJ1Zl9wYWNrZWRpbnQ9cmVhZEJ1Zl9wYWNrZWRpbnQ7XHJcblx0XHR0aGlzLnJlYWRGaXhlZEFycmF5PXJlYWRGaXhlZEFycmF5O1xyXG5cdFx0dGhpcy5yZWFkU3RyaW5nPXJlYWRTdHJpbmc7XHJcblx0XHR0aGlzLnJlYWRTdHJpbmdBcnJheT1yZWFkU3RyaW5nQXJyYXk7XHJcblx0XHR0aGlzLnNpZ25hdHVyZV9zaXplPXNpZ25hdHVyZV9zaXplO1xyXG5cdFx0dGhpcy5tZXJnZVBvc3RpbmdzPW1lcmdlUG9zdGluZ3M7XHJcblx0XHR0aGlzLmZyZWU9ZnJlZTtcclxuXHRcdHRoaXMuc2l6ZT1rZnMuZ2V0RmlsZVNpemUodGhpcy5oYW5kbGUpO1xyXG5cdFx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJmaWxlc2l6ZSAgXCIrdGhpcy5zaXplKTtcclxuXHRcdGlmIChjYilcdGNiLmNhbGwodGhpcyk7XHJcblx0fVxyXG5cclxuXHR0aGlzLmhhbmRsZT1rZnMub3BlbihwYXRoKTtcclxuXHR0aGlzLm9wZW5lZD10cnVlO1xyXG5cdHNldHVwYXBpLmNhbGwodGhpcyk7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzPU9wZW47IiwiLypcclxuICBUT0RPXHJcbiAgYW5kIG5vdFxyXG5cclxuKi9cclxuXHJcbi8vIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvbmVvc3dmL2FYeld3L1xyXG52YXIgcGxpc3Q9cmVxdWlyZSgnLi9wbGlzdCcpO1xyXG5mdW5jdGlvbiBpbnRlcnNlY3QoSSwgSikge1xyXG4gIHZhciBpID0gaiA9IDA7XHJcbiAgdmFyIHJlc3VsdCA9IFtdO1xyXG5cclxuICB3aGlsZSggaSA8IEkubGVuZ3RoICYmIGogPCBKLmxlbmd0aCApe1xyXG4gICAgIGlmICAgICAgKElbaV0gPCBKW2pdKSBpKys7IFxyXG4gICAgIGVsc2UgaWYgKElbaV0gPiBKW2pdKSBqKys7IFxyXG4gICAgIGVsc2Uge1xyXG4gICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPWxbaV07XHJcbiAgICAgICBpKys7aisrO1xyXG4gICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuLyogcmV0dXJuIGFsbCBpdGVtcyBpbiBJIGJ1dCBub3QgaW4gSiAqL1xyXG5mdW5jdGlvbiBzdWJ0cmFjdChJLCBKKSB7XHJcbiAgdmFyIGkgPSBqID0gMDtcclxuICB2YXIgcmVzdWx0ID0gW107XHJcblxyXG4gIHdoaWxlKCBpIDwgSS5sZW5ndGggJiYgaiA8IEoubGVuZ3RoICl7XHJcbiAgICBpZiAoSVtpXT09SltqXSkge1xyXG4gICAgICBpKys7aisrO1xyXG4gICAgfSBlbHNlIGlmIChJW2ldPEpbal0pIHtcclxuICAgICAgd2hpbGUgKElbaV08SltqXSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPSBJW2krK107XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB3aGlsZShKW2pdPElbaV0pIGorKztcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGlmIChqPT1KLmxlbmd0aCkge1xyXG4gICAgd2hpbGUgKGk8SS5sZW5ndGgpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1JW2krK107XHJcbiAgfVxyXG5cclxuICByZXR1cm4gcmVzdWx0O1xyXG59XHJcblxyXG52YXIgdW5pb249ZnVuY3Rpb24oYSxiKSB7XHJcblx0aWYgKCFhIHx8ICFhLmxlbmd0aCkgcmV0dXJuIGI7XHJcblx0aWYgKCFiIHx8ICFiLmxlbmd0aCkgcmV0dXJuIGE7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICB2YXIgYWkgPSAwO1xyXG4gICAgdmFyIGJpID0gMDtcclxuICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgaWYgKCBhaSA8IGEubGVuZ3RoICYmIGJpIDwgYi5sZW5ndGgpIHtcclxuICAgICAgICAgICAgaWYgKGFbYWldIDwgYltiaV0pIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1hW2FpXTtcclxuICAgICAgICAgICAgICAgIGFpKys7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYVthaV0gPiBiW2JpXSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPWJbYmldO1xyXG4gICAgICAgICAgICAgICAgYmkrKztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1hW2FpXTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1iW2JpXTtcclxuICAgICAgICAgICAgICAgIGFpKys7XHJcbiAgICAgICAgICAgICAgICBiaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIGlmIChhaSA8IGEubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgYS5zbGljZShhaSwgYS5sZW5ndGgpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfSBlbHNlIGlmIChiaSA8IGIubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgYi5zbGljZShiaSwgYi5sZW5ndGgpKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG52YXIgT1BFUkFUSU9OPXsnaW5jbHVkZSc6aW50ZXJzZWN0LCAndW5pb24nOnVuaW9uLCAnZXhjbHVkZSc6c3VidHJhY3R9O1xyXG5cclxudmFyIGJvb2xTZWFyY2g9ZnVuY3Rpb24ob3B0cykge1xyXG4gIG9wdHM9b3B0c3x8e307XHJcbiAgb3BzPW9wdHMub3B8fHRoaXMub3B0cy5vcDtcclxuICB0aGlzLmRvY3M9W107XHJcblx0aWYgKCF0aGlzLnBocmFzZXMubGVuZ3RoKSByZXR1cm47XHJcblx0dmFyIHI9dGhpcy5waHJhc2VzWzBdLmRvY3M7XHJcbiAgLyogaWdub3JlIG9wZXJhdG9yIG9mIGZpcnN0IHBocmFzZSAqL1xyXG5cdGZvciAodmFyIGk9MTtpPHRoaXMucGhyYXNlcy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgb3A9IG9wc1tpXSB8fCAndW5pb24nO1xyXG5cdFx0cj1PUEVSQVRJT05bb3BdKHIsdGhpcy5waHJhc2VzW2ldLmRvY3MpO1xyXG5cdH1cclxuXHR0aGlzLmRvY3M9cGxpc3QudW5pcXVlKHIpO1xyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzPXtzZWFyY2g6Ym9vbFNlYXJjaH0iLCJ2YXIgcGxpc3Q9cmVxdWlyZShcIi4vcGxpc3RcIik7XHJcblxyXG52YXIgZ2V0UGhyYXNlV2lkdGhzPWZ1bmN0aW9uIChRLHBocmFzZWlkLHZwb3NzKSB7XHJcblx0dmFyIHJlcz1bXTtcclxuXHRmb3IgKHZhciBpIGluIHZwb3NzKSB7XHJcblx0XHRyZXMucHVzaChnZXRQaHJhc2VXaWR0aChRLHBocmFzZWlkLHZwb3NzW2ldKSk7XHJcblx0fVxyXG5cdHJldHVybiByZXM7XHJcbn1cclxudmFyIGdldFBocmFzZVdpZHRoPWZ1bmN0aW9uIChRLHBocmFzZWlkLHZwb3MpIHtcclxuXHR2YXIgUD1RLnBocmFzZXNbcGhyYXNlaWRdO1xyXG5cdHZhciB3aWR0aD0wLHZhcndpZHRoPWZhbHNlO1xyXG5cdGlmIChQLndpZHRoKSByZXR1cm4gUC53aWR0aDsgLy8gbm8gd2lsZGNhcmRcclxuXHRpZiAoUC50ZXJtaWQubGVuZ3RoPDIpIHJldHVybiBQLnRlcm1sZW5ndGhbMF07XHJcblx0dmFyIGxhc3R0ZXJtcG9zdGluZz1RLnRlcm1zW1AudGVybWlkW1AudGVybWlkLmxlbmd0aC0xXV0ucG9zdGluZztcclxuXHJcblx0Zm9yICh2YXIgaSBpbiBQLnRlcm1pZCkge1xyXG5cdFx0dmFyIFQ9US50ZXJtc1tQLnRlcm1pZFtpXV07XHJcblx0XHRpZiAoVC5vcD09J3dpbGRjYXJkJykge1xyXG5cdFx0XHR3aWR0aCs9VC53aWR0aDtcclxuXHRcdFx0aWYgKFQud2lsZGNhcmQ9PScqJykgdmFyd2lkdGg9dHJ1ZTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHdpZHRoKz1QLnRlcm1sZW5ndGhbaV07XHJcblx0XHR9XHJcblx0fVxyXG5cdGlmICh2YXJ3aWR0aCkgeyAvL3dpZHRoIG1pZ2h0IGJlIHNtYWxsZXIgZHVlIHRvICogd2lsZGNhcmRcclxuXHRcdHZhciBhdD1wbGlzdC5pbmRleE9mU29ydGVkKGxhc3R0ZXJtcG9zdGluZyx2cG9zKTtcclxuXHRcdHZhciBlbmRwb3M9bGFzdHRlcm1wb3N0aW5nW2F0XTtcclxuXHRcdGlmIChlbmRwb3MtdnBvczx3aWR0aCkgd2lkdGg9ZW5kcG9zLXZwb3MrMTtcclxuXHR9XHJcblxyXG5cdHJldHVybiB3aWR0aDtcclxufVxyXG4vKiByZXR1cm4gW3Zwb3MsIHBocmFzZWlkLCBwaHJhc2V3aWR0aCwgb3B0aW9uYWxfdGFnbmFtZV0gYnkgc2xvdCByYW5nZSovXHJcbnZhciBoaXRJblJhbmdlPWZ1bmN0aW9uKFEsc3RhcnR2cG9zLGVuZHZwb3MpIHtcclxuXHR2YXIgcmVzPVtdO1xyXG5cdGlmICghUSB8fCAhUS5yYXdyZXN1bHQgfHwgIVEucmF3cmVzdWx0Lmxlbmd0aCkgcmV0dXJuIHJlcztcclxuXHRmb3IgKHZhciBpPTA7aTxRLnBocmFzZXMubGVuZ3RoO2krKykge1xyXG5cdFx0dmFyIFA9US5waHJhc2VzW2ldO1xyXG5cdFx0aWYgKCFQLnBvc3RpbmcpIGNvbnRpbnVlO1xyXG5cdFx0dmFyIHM9cGxpc3QuaW5kZXhPZlNvcnRlZChQLnBvc3Rpbmcsc3RhcnR2cG9zKTtcclxuXHRcdHZhciBlPXBsaXN0LmluZGV4T2ZTb3J0ZWQoUC5wb3N0aW5nLGVuZHZwb3MpO1xyXG5cdFx0dmFyIHI9UC5wb3N0aW5nLnNsaWNlKHMsZSsxKTtcclxuXHRcdHZhciB3aWR0aD1nZXRQaHJhc2VXaWR0aHMoUSxpLHIpO1xyXG5cclxuXHRcdHJlcz1yZXMuY29uY2F0KHIubWFwKGZ1bmN0aW9uKHZwb3MsaWR4KXsgcmV0dXJuIFt2cG9zLHdpZHRoW2lkeF0saV0gfSkpO1xyXG5cdH1cclxuXHQvLyBvcmRlciBieSB2cG9zLCBpZiB2cG9zIGlzIHRoZSBzYW1lLCBsYXJnZXIgd2lkdGggY29tZSBmaXJzdC5cclxuXHQvLyBzbyB0aGUgb3V0cHV0IHdpbGwgYmVcclxuXHQvLyA8dGFnMT48dGFnMj5vbmU8L3RhZzI+dHdvPC90YWcxPlxyXG5cdC8vVE9ETywgbWlnaHQgY2F1c2Ugb3ZlcmxhcCBpZiBzYW1lIHZwb3MgYW5kIHNhbWUgd2lkdGhcclxuXHQvL25lZWQgdG8gY2hlY2sgdGFnIG5hbWVcclxuXHRyZXMuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhWzBdPT1iWzBdPyBiWzFdLWFbMV0gOmFbMF0tYlswXX0pO1xyXG5cclxuXHRyZXR1cm4gcmVzO1xyXG59XHJcblxyXG52YXIgdGFnc0luUmFuZ2U9ZnVuY3Rpb24oUSxyZW5kZXJUYWdzLHN0YXJ0dnBvcyxlbmR2cG9zKSB7XHJcblx0dmFyIHJlcz1bXTtcclxuXHRpZiAodHlwZW9mIHJlbmRlclRhZ3M9PVwic3RyaW5nXCIpIHJlbmRlclRhZ3M9W3JlbmRlclRhZ3NdO1xyXG5cclxuXHRyZW5kZXJUYWdzLm1hcChmdW5jdGlvbih0YWcpe1xyXG5cdFx0dmFyIHN0YXJ0cz1RLmVuZ2luZS5nZXQoW1wiZmllbGRzXCIsdGFnK1wiX3N0YXJ0XCJdKTtcclxuXHRcdHZhciBlbmRzPVEuZW5naW5lLmdldChbXCJmaWVsZHNcIix0YWcrXCJfZW5kXCJdKTtcclxuXHRcdGlmICghc3RhcnRzKSByZXR1cm47XHJcblxyXG5cdFx0dmFyIHM9cGxpc3QuaW5kZXhPZlNvcnRlZChzdGFydHMsc3RhcnR2cG9zKTtcclxuXHRcdHZhciBlPXM7XHJcblx0XHR3aGlsZSAoZTxzdGFydHMubGVuZ3RoICYmIHN0YXJ0c1tlXTxlbmR2cG9zKSBlKys7XHJcblx0XHR2YXIgb3BlbnRhZ3M9c3RhcnRzLnNsaWNlKHMsZSk7XHJcblxyXG5cdFx0cz1wbGlzdC5pbmRleE9mU29ydGVkKGVuZHMsc3RhcnR2cG9zKTtcclxuXHRcdGU9cztcclxuXHRcdHdoaWxlIChlPGVuZHMubGVuZ3RoICYmIGVuZHNbZV08ZW5kdnBvcykgZSsrO1xyXG5cdFx0dmFyIGNsb3NldGFncz1lbmRzLnNsaWNlKHMsZSk7XHJcblxyXG5cdFx0b3BlbnRhZ3MubWFwKGZ1bmN0aW9uKHN0YXJ0LGlkeCkge1xyXG5cdFx0XHRyZXMucHVzaChbc3RhcnQsY2xvc2V0YWdzW2lkeF0tc3RhcnQsdGFnXSk7XHJcblx0XHR9KVxyXG5cdH0pO1xyXG5cdC8vIG9yZGVyIGJ5IHZwb3MsIGlmIHZwb3MgaXMgdGhlIHNhbWUsIGxhcmdlciB3aWR0aCBjb21lIGZpcnN0LlxyXG5cdHJlcy5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGFbMF09PWJbMF0/IGJbMV0tYVsxXSA6YVswXS1iWzBdfSk7XHJcblxyXG5cdHJldHVybiByZXM7XHJcbn1cclxuXHJcbi8qXHJcbmdpdmVuIGEgdnBvcyByYW5nZSBzdGFydCwgZmlsZSwgY29udmVydCB0byBmaWxlc3RhcnQsIGZpbGVlbmRcclxuICAgZmlsZXN0YXJ0IDogc3RhcnRpbmcgZmlsZVxyXG4gICBzdGFydCAgIDogdnBvcyBzdGFydFxyXG4gICBzaG93ZmlsZTogaG93IG1hbnkgZmlsZXMgdG8gZGlzcGxheVxyXG4gICBzaG93cGFnZTogaG93IG1hbnkgcGFnZXMgdG8gZGlzcGxheVxyXG5cclxub3V0cHV0OlxyXG4gICBhcnJheSBvZiBmaWxlaWQgd2l0aCBoaXRzXHJcbiovXHJcbnZhciBnZXRGaWxlV2l0aEhpdHM9ZnVuY3Rpb24oZW5naW5lLFEscmFuZ2UpIHtcclxuXHR2YXIgZmlsZU9mZnNldHM9ZW5naW5lLmdldChcImZpbGVvZmZzZXRzXCIpO1xyXG5cdHZhciBvdXQ9W10sZmlsZWNvdW50PTEwMDtcclxuXHR2YXIgc3RhcnQ9MCAsIGVuZD1RLmJ5RmlsZS5sZW5ndGg7XHJcblx0US5leGNlcnB0T3ZlcmZsb3c9ZmFsc2U7XHJcblx0aWYgKHJhbmdlLnN0YXJ0KSB7XHJcblx0XHR2YXIgZmlyc3Q9cmFuZ2Uuc3RhcnQgO1xyXG5cdFx0dmFyIGxhc3Q9cmFuZ2UuZW5kO1xyXG5cdFx0aWYgKCFsYXN0KSBsYXN0PU51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8ZmlsZU9mZnNldHMubGVuZ3RoO2krKykge1xyXG5cdFx0XHQvL2lmIChmaWxlT2Zmc2V0c1tpXT5maXJzdCkgYnJlYWs7XHJcblx0XHRcdGlmIChmaWxlT2Zmc2V0c1tpXT5sYXN0KSB7XHJcblx0XHRcdFx0ZW5kPWk7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKGZpbGVPZmZzZXRzW2ldPGZpcnN0KSBzdGFydD1pO1xyXG5cdFx0fVx0XHRcclxuXHR9IGVsc2Uge1xyXG5cdFx0c3RhcnQ9cmFuZ2UuZmlsZXN0YXJ0IHx8IDA7XHJcblx0XHRpZiAocmFuZ2UubWF4ZmlsZSkge1xyXG5cdFx0XHRmaWxlY291bnQ9cmFuZ2UubWF4ZmlsZTtcclxuXHRcdH0gZWxzZSBpZiAocmFuZ2Uuc2hvd3NlZykge1xyXG5cdFx0XHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCJcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHZhciBmaWxlV2l0aEhpdHM9W10sdG90YWxoaXQ9MDtcclxuXHRyYW5nZS5tYXhoaXQ9cmFuZ2UubWF4aGl0fHwxMDAwO1xyXG5cclxuXHRmb3IgKHZhciBpPXN0YXJ0O2k8ZW5kO2krKykge1xyXG5cdFx0aWYoUS5ieUZpbGVbaV0ubGVuZ3RoPjApIHtcclxuXHRcdFx0dG90YWxoaXQrPVEuYnlGaWxlW2ldLmxlbmd0aDtcclxuXHRcdFx0ZmlsZVdpdGhIaXRzLnB1c2goaSk7XHJcblx0XHRcdHJhbmdlLm5leHRGaWxlU3RhcnQ9aTtcclxuXHRcdFx0aWYgKGZpbGVXaXRoSGl0cy5sZW5ndGg+PWZpbGVjb3VudCkge1xyXG5cdFx0XHRcdFEuZXhjZXJwdE92ZXJmbG93PXRydWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdFx0aWYgKHRvdGFsaGl0PnJhbmdlLm1heGhpdCkge1xyXG5cdFx0XHRcdFEuZXhjZXJwdE92ZXJmbG93PXRydWU7XHJcblx0XHRcdFx0YnJlYWs7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblx0aWYgKGk+PWVuZCkgeyAvL25vIG1vcmUgZmlsZVxyXG5cdFx0US5leGNlcnB0U3RvcD10cnVlO1xyXG5cdH1cclxuXHRyZXR1cm4gZmlsZVdpdGhIaXRzO1xyXG59XHJcbnZhciByZXN1bHRsaXN0PWZ1bmN0aW9uKGVuZ2luZSxRLG9wdHMsY2IpIHtcclxuXHR2YXIgb3V0cHV0PVtdO1xyXG5cdGlmICghUS5yYXdyZXN1bHQgfHwgIVEucmF3cmVzdWx0Lmxlbmd0aCkge1xyXG5cdFx0Y2Iob3V0cHV0KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblxyXG5cdGlmIChvcHRzLnJhbmdlKSB7XHJcblx0XHRpZiAob3B0cy5yYW5nZS5tYXhoaXQgJiYgIW9wdHMucmFuZ2UubWF4ZmlsZSkge1xyXG5cdFx0XHRvcHRzLnJhbmdlLm1heGZpbGU9b3B0cy5yYW5nZS5tYXhoaXQ7XHJcblx0XHRcdG9wdHMucmFuZ2UubWF4c2VnPW9wdHMucmFuZ2UubWF4aGl0O1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFvcHRzLnJhbmdlLm1heHNlZykgb3B0cy5yYW5nZS5tYXhzZWc9MTAwO1xyXG5cdFx0aWYgKCFvcHRzLnJhbmdlLmVuZCkge1xyXG5cdFx0XHRvcHRzLnJhbmdlLmVuZD1OdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcclxuXHRcdH1cclxuXHR9XHJcblx0dmFyIGZpbGVXaXRoSGl0cz1nZXRGaWxlV2l0aEhpdHMoZW5naW5lLFEsb3B0cy5yYW5nZSk7XHJcblx0aWYgKCFmaWxlV2l0aEhpdHMubGVuZ3RoKSB7XHJcblx0XHRjYihvdXRwdXQpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0dmFyIG91dHB1dD1bXSxmaWxlcz1bXTsvL3RlbXBvcmFyeSBob2xkZXIgZm9yIHNlZ25hbWVzXHJcblx0Zm9yICh2YXIgaT0wO2k8ZmlsZVdpdGhIaXRzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBuZmlsZT1maWxlV2l0aEhpdHNbaV07XHJcblx0XHR2YXIgc2Vnb2Zmc2V0cz1lbmdpbmUuZ2V0RmlsZVNlZ09mZnNldHMobmZpbGUpO1xyXG5cdFx0dmFyIHNlZ25hbWVzPWVuZ2luZS5nZXRGaWxlU2VnTmFtZXMobmZpbGUpO1xyXG5cdFx0ZmlsZXNbbmZpbGVdPXtzZWdvZmZzZXRzOnNlZ29mZnNldHN9O1xyXG5cdFx0dmFyIHNlZ3dpdGhoaXQ9cGxpc3QuZ3JvdXBieXBvc3RpbmcyKFEuYnlGaWxlWyBuZmlsZSBdLCAgc2Vnb2Zmc2V0cyk7XHJcblx0XHQvL2lmIChzZWdvZmZzZXRzWzBdPT0xKVxyXG5cdFx0Ly9zZWd3aXRoaGl0LnNoaWZ0KCk7IC8vdGhlIGZpcnN0IGl0ZW0gaXMgbm90IHVzZWQgKDB+US5ieUZpbGVbMF0gKVxyXG5cclxuXHRcdGZvciAodmFyIGo9MDsgajxzZWd3aXRoaGl0Lmxlbmd0aDtqKyspIHtcclxuXHRcdFx0aWYgKCFzZWd3aXRoaGl0W2pdLmxlbmd0aCkgY29udGludWU7XHJcblx0XHRcdC8vdmFyIG9mZnNldHM9c2Vnd2l0aGhpdFtqXS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIHAtIGZpbGVPZmZzZXRzW2ldfSk7XHJcblx0XHRcdGlmIChzZWdvZmZzZXRzW2pdPm9wdHMucmFuZ2UuZW5kKSBicmVhaztcclxuXHRcdFx0b3V0cHV0LnB1c2goICB7ZmlsZTogbmZpbGUsIHNlZzpqLCAgc2VnbmFtZTpzZWduYW1lc1tqXX0pO1xyXG5cdFx0XHRpZiAob3V0cHV0Lmxlbmd0aD5vcHRzLnJhbmdlLm1heHNlZykgYnJlYWs7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHR2YXIgc2VncGF0aHM9b3V0cHV0Lm1hcChmdW5jdGlvbihwKXtcclxuXHRcdHJldHVybiBbXCJmaWxlY29udGVudHNcIixwLmZpbGUscC5zZWddO1xyXG5cdH0pO1xyXG5cdC8vcHJlcGFyZSB0aGUgdGV4dFxyXG5cdGVuZ2luZS5nZXQoc2VncGF0aHMsZnVuY3Rpb24oc2Vncyl7XHJcblx0XHR2YXIgc2VxPTA7XHJcblx0XHRpZiAoc2VncykgZm9yICh2YXIgaT0wO2k8c2Vncy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHZhciBzdGFydHZwb3M9ZmlsZXNbb3V0cHV0W2ldLmZpbGVdLnNlZ29mZnNldHNbb3V0cHV0W2ldLnNlZy0xXSB8fDA7XHJcblx0XHRcdHZhciBlbmR2cG9zPWZpbGVzW291dHB1dFtpXS5maWxlXS5zZWdvZmZzZXRzW291dHB1dFtpXS5zZWddO1xyXG5cdFx0XHR2YXIgaGw9e307XHJcblxyXG5cdFx0XHRpZiAob3B0cy5yYW5nZSAmJiBvcHRzLnJhbmdlLnN0YXJ0ICApIHtcclxuXHRcdFx0XHRpZiAoIHN0YXJ0dnBvczxvcHRzLnJhbmdlLnN0YXJ0KSBzdGFydHZwb3M9b3B0cy5yYW5nZS5zdGFydDtcclxuXHRcdFx0Ly9cdGlmIChlbmR2cG9zPm9wdHMucmFuZ2UuZW5kKSBlbmR2cG9zPW9wdHMucmFuZ2UuZW5kO1xyXG5cdFx0XHR9XHJcblx0XHRcdFxyXG5cdFx0XHRpZiAob3B0cy5ub2hpZ2hsaWdodCkge1xyXG5cdFx0XHRcdGhsLnRleHQ9c2Vnc1tpXTtcclxuXHRcdFx0XHRobC5oaXRzPWhpdEluUmFuZ2UoUSxzdGFydHZwb3MsZW5kdnBvcyk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIG89e25vY3JsZjp0cnVlLG5vc3Bhbjp0cnVlLFxyXG5cdFx0XHRcdFx0dGV4dDpzZWdzW2ldLHN0YXJ0dnBvczpzdGFydHZwb3MsIGVuZHZwb3M6IGVuZHZwb3MsIFxyXG5cdFx0XHRcdFx0UTpRLGZ1bGx0ZXh0Om9wdHMuZnVsbHRleHR9O1xyXG5cdFx0XHRcdGhsPWhpZ2hsaWdodChRLG8pO1xyXG5cdFx0XHR9XHJcblx0XHRcdGlmIChobC50ZXh0KSB7XHJcblx0XHRcdFx0b3V0cHV0W2ldLnRleHQ9aGwudGV4dDtcclxuXHRcdFx0XHRvdXRwdXRbaV0uaGl0cz1obC5oaXRzO1xyXG5cdFx0XHRcdG91dHB1dFtpXS5zZXE9c2VxO1xyXG5cdFx0XHRcdHNlcSs9aGwuaGl0cy5sZW5ndGg7XHJcblxyXG5cdFx0XHRcdG91dHB1dFtpXS5zdGFydD1zdGFydHZwb3M7XHRcdFx0XHRcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRvdXRwdXRbaV09bnVsbDsgLy9yZW1vdmUgaXRlbSB2cG9zIGxlc3MgdGhhbiBvcHRzLnJhbmdlLnN0YXJ0XHJcblx0XHRcdH1cclxuXHRcdH0gXHJcblx0XHRvdXRwdXQ9b3V0cHV0LmZpbHRlcihmdW5jdGlvbihvKXtyZXR1cm4gbyE9bnVsbH0pO1xyXG5cdFx0Y2Iob3V0cHV0KTtcclxuXHR9KTtcclxufVxyXG52YXIgaW5qZWN0VGFnPWZ1bmN0aW9uKFEsb3B0cyl7XHJcblx0dmFyIGhpdHM9b3B0cy5oaXRzO1xyXG5cdHZhciB0YWdzPW9wdHMudGFncztcclxuXHRpZiAoIXRhZ3MpIHRhZ3M9W107XHJcblx0dmFyIGhpdGNsYXNzPW9wdHMuaGl0Y2xhc3N8fCdobCc7XHJcblx0dmFyIG91dHB1dD0nJyxPPVtdLGo9MCxrPTA7XHJcblx0dmFyIHN1cnJvdW5kPW9wdHMuc3Vycm91bmR8fDU7XHJcblxyXG5cdHZhciB0b2tlbnM9US50b2tlbml6ZShvcHRzLnRleHQpLnRva2VucztcclxuXHR2YXIgdnBvcz1vcHRzLnZwb3M7XHJcblx0dmFyIGk9MCxwcmV2aW5yYW5nZT0hIW9wdHMuZnVsbHRleHQgLGlucmFuZ2U9ISFvcHRzLmZ1bGx0ZXh0O1xyXG5cdHZhciBoaXRzdGFydD0wLGhpdGVuZD0wLHRhZ3N0YXJ0PTAsdGFnZW5kPTAsdGFnY2xhc3M9XCJcIjtcclxuXHR3aGlsZSAoaTx0b2tlbnMubGVuZ3RoKSB7XHJcblx0XHR2YXIgc2tpcD1RLmlzU2tpcCh0b2tlbnNbaV0pO1xyXG5cdFx0dmFyIGhhc2hpdD1mYWxzZTtcclxuXHRcdGlucmFuZ2U9b3B0cy5mdWxsdGV4dCB8fCAoajxoaXRzLmxlbmd0aCAmJiB2cG9zK3N1cnJvdW5kPj1oaXRzW2pdWzBdIHx8XHJcblx0XHRcdFx0KGo+MCAmJiBqPD1oaXRzLmxlbmd0aCAmJiAgaGl0c1tqLTFdWzBdK3N1cnJvdW5kKjI+PXZwb3MpKTtcdFxyXG5cclxuXHRcdGlmIChwcmV2aW5yYW5nZSE9aW5yYW5nZSkge1xyXG5cdFx0XHRvdXRwdXQrPW9wdHMuYWJyaWRnZXx8XCIuLi5cIjtcclxuXHRcdH1cclxuXHRcdHByZXZpbnJhbmdlPWlucmFuZ2U7XHJcblx0XHR2YXIgdG9rZW49dG9rZW5zW2ldO1xyXG5cdFx0aWYgKG9wdHMubm9jcmxmICYmIHRva2VuPT1cIlxcblwiKSB0b2tlbj1cIlwiO1xyXG5cclxuXHRcdGlmIChpbnJhbmdlICYmIGk8dG9rZW5zLmxlbmd0aCkge1xyXG5cdFx0XHRpZiAoc2tpcCkge1xyXG5cdFx0XHRcdG91dHB1dCs9dG9rZW47XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0dmFyIGNsYXNzZXM9XCJcIjtcdFxyXG5cclxuXHRcdFx0XHQvL2NoZWNrIGhpdFxyXG5cdFx0XHRcdGlmIChqPGhpdHMubGVuZ3RoICYmIHZwb3M9PWhpdHNbal1bMF0pIHtcclxuXHRcdFx0XHRcdHZhciBucGhyYXNlPWhpdHNbal1bMl0gJSAxMCwgd2lkdGg9aGl0c1tqXVsxXTtcclxuXHRcdFx0XHRcdGhpdHN0YXJ0PWhpdHNbal1bMF07XHJcblx0XHRcdFx0XHRoaXRlbmQ9aGl0c3RhcnQrd2lkdGg7XHJcblx0XHRcdFx0XHRqKys7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHQvL2NoZWNrIHRhZ1xyXG5cdFx0XHRcdGlmIChrPHRhZ3MubGVuZ3RoICYmIHZwb3M9PXRhZ3Nba11bMF0pIHtcclxuXHRcdFx0XHRcdHZhciB3aWR0aD10YWdzW2tdWzFdO1xyXG5cdFx0XHRcdFx0dGFnc3RhcnQ9dGFnc1trXVswXTtcclxuXHRcdFx0XHRcdHRhZ2VuZD10YWdzdGFydCt3aWR0aDtcclxuXHRcdFx0XHRcdHRhZ2NsYXNzPXRhZ3Nba11bMl07XHJcblx0XHRcdFx0XHRrKys7XHJcblx0XHRcdFx0fVxyXG5cclxuXHRcdFx0XHRpZiAodnBvcz49aGl0c3RhcnQgJiYgdnBvczxoaXRlbmQpIGNsYXNzZXM9aGl0Y2xhc3MrXCIgXCIraGl0Y2xhc3MrbnBocmFzZTtcclxuXHRcdFx0XHRpZiAodnBvcz49dGFnc3RhcnQgJiYgdnBvczx0YWdlbmQpIGNsYXNzZXMrPVwiIFwiK3RhZ2NsYXNzO1xyXG5cclxuXHRcdFx0XHRpZiAoY2xhc3NlcyB8fCAhb3B0cy5ub3NwYW4pIHtcclxuXHRcdFx0XHRcdG91dHB1dCs9JzxzcGFuIHZwb3M9XCInK3Zwb3MrJ1wiJztcclxuXHRcdFx0XHRcdGlmIChjbGFzc2VzKSBjbGFzc2VzPScgY2xhc3M9XCInK2NsYXNzZXMrJ1wiJztcclxuXHRcdFx0XHRcdG91dHB1dCs9Y2xhc3NlcysnPic7XHJcblx0XHRcdFx0XHRvdXRwdXQrPXRva2VuKyc8L3NwYW4+JztcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0b3V0cHV0Kz10b2tlbjtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmICghc2tpcCkgdnBvcysrO1xyXG5cdFx0aSsrOyBcclxuXHR9XHJcblxyXG5cdE8ucHVzaChvdXRwdXQpO1xyXG5cdG91dHB1dD1cIlwiO1xyXG5cclxuXHRyZXR1cm4gTy5qb2luKFwiXCIpO1xyXG59XHJcbnZhciBoaWdobGlnaHQ9ZnVuY3Rpb24oUSxvcHRzKSB7XHJcblx0aWYgKCFvcHRzLnRleHQpIHJldHVybiB7dGV4dDpcIlwiLGhpdHM6W119O1xyXG5cdHZhciBvcHQ9e3RleHQ6b3B0cy50ZXh0LFxyXG5cdFx0aGl0czpudWxsLGFicmlkZ2U6b3B0cy5hYnJpZGdlLHZwb3M6b3B0cy5zdGFydHZwb3MsXHJcblx0XHRmdWxsdGV4dDpvcHRzLmZ1bGx0ZXh0LHJlbmRlclRhZ3M6b3B0cy5yZW5kZXJUYWdzLG5vc3BhbjpvcHRzLm5vc3Bhbixub2NybGY6b3B0cy5ub2NybGYsXHJcblx0fTtcclxuXHJcblx0b3B0LmhpdHM9aGl0SW5SYW5nZShvcHRzLlEsb3B0cy5zdGFydHZwb3Msb3B0cy5lbmR2cG9zKTtcclxuXHRyZXR1cm4ge3RleHQ6aW5qZWN0VGFnKFEsb3B0KSxoaXRzOm9wdC5oaXRzfTtcclxufVxyXG5cclxudmFyIGdldFNlZz1mdW5jdGlvbihlbmdpbmUsZmlsZWlkLHNlZ2lkLGNiKSB7XHJcblx0dmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlb2Zmc2V0c1wiKTtcclxuXHR2YXIgc2VncGF0aHM9W1wiZmlsZWNvbnRlbnRzXCIsZmlsZWlkLHNlZ2lkXTtcclxuXHR2YXIgc2VnbmFtZXM9ZW5naW5lLmdldEZpbGVTZWdOYW1lcyhmaWxlaWQpO1xyXG5cclxuXHRlbmdpbmUuZ2V0KHNlZ3BhdGhzLGZ1bmN0aW9uKHRleHQpe1xyXG5cdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW3t0ZXh0OnRleHQsZmlsZTpmaWxlaWQsc2VnOnNlZ2lkLHNlZ25hbWU6c2VnbmFtZXNbc2VnaWRdfV0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG52YXIgZ2V0U2VnU3luYz1mdW5jdGlvbihlbmdpbmUsZmlsZWlkLHNlZ2lkKSB7XHJcblx0dmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlb2Zmc2V0c1wiKTtcclxuXHR2YXIgc2VncGF0aHM9W1wiZmlsZWNvbnRlbnRzXCIsZmlsZWlkLHNlZ2lkXTtcclxuXHR2YXIgc2VnbmFtZXM9ZW5naW5lLmdldEZpbGVTZWdOYW1lcyhmaWxlaWQpO1xyXG5cclxuXHR2YXIgdGV4dD1lbmdpbmUuZ2V0KHNlZ3BhdGhzKTtcclxuXHRyZXR1cm4ge3RleHQ6dGV4dCxmaWxlOmZpbGVpZCxzZWc6c2VnaWQsc2VnbmFtZTpzZWduYW1lc1tzZWdpZF19O1xyXG59XHJcblxyXG52YXIgZ2V0UmFuZ2U9ZnVuY3Rpb24oZW5naW5lLHN0YXJ0LGVuZCxjYikge1xyXG5cdHZhciBmaWxlb2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZW9mZnNldHNcIik7XHJcblx0Ly92YXIgcGFnZXBhdGhzPVtcImZpbGVDb250ZW50c1wiLF07XHJcblx0Ly9maW5kIGZpcnN0IHBhZ2UgYW5kIGxhc3QgcGFnZVxyXG5cdC8vY3JlYXRlIGdldCBwYXRoc1xyXG5cclxufVxyXG5cclxudmFyIGdldEZpbGU9ZnVuY3Rpb24oZW5naW5lLGZpbGVpZCxjYikge1xyXG5cdHZhciBmaWxlbmFtZT1lbmdpbmUuZ2V0KFwiZmlsZW5hbWVzXCIpW2ZpbGVpZF07XHJcblx0dmFyIHNlZ25hbWVzPWVuZ2luZS5nZXRGaWxlU2VnTmFtZXMoZmlsZWlkKTtcclxuXHR2YXIgZmlsZXN0YXJ0PWVuZ2luZS5nZXQoXCJmaWxlb2Zmc2V0c1wiKVtmaWxlaWRdO1xyXG5cdHZhciBvZmZzZXRzPWVuZ2luZS5nZXRGaWxlU2VnT2Zmc2V0cyhmaWxlaWQpO1xyXG5cdHZhciBwYz0wO1xyXG5cdGVuZ2luZS5nZXQoW1wiZmlsZUNvbnRlbnRzXCIsZmlsZWlkXSx0cnVlLGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0dmFyIHRleHQ9ZGF0YS5tYXAoZnVuY3Rpb24odCxpZHgpIHtcclxuXHRcdFx0aWYgKGlkeD09MCkgcmV0dXJuIFwiXCI7IFxyXG5cdFx0XHR2YXIgcGI9JzxwYiBuPVwiJytzZWduYW1lc1tpZHhdKydcIj48L3BiPic7XHJcblx0XHRcdHJldHVybiBwYit0O1xyXG5cdFx0fSk7XHJcblx0XHRjYih7dGV4dHM6ZGF0YSx0ZXh0OnRleHQuam9pbihcIlwiKSxzZWduYW1lczpzZWduYW1lcyxmaWxlc3RhcnQ6ZmlsZXN0YXJ0LG9mZnNldHM6b2Zmc2V0cyxmaWxlOmZpbGVpZCxmaWxlbmFtZTpmaWxlbmFtZX0pOyAvL2ZvcmNlIGRpZmZlcmVudCB0b2tlblxyXG5cdH0pO1xyXG59XHJcblxyXG52YXIgaGlnaGxpZ2h0UmFuZ2U9ZnVuY3Rpb24oUSxzdGFydHZwb3MsZW5kdnBvcyxvcHRzLGNiKXtcclxuXHQvL25vdCBpbXBsZW1lbnQgeWV0XHJcbn1cclxuXHJcbnZhciBoaWdobGlnaHRGaWxlPWZ1bmN0aW9uKFEsZmlsZWlkLG9wdHMsY2IpIHtcclxuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikge1xyXG5cdFx0Y2I9b3B0cztcclxuXHR9XHJcblxyXG5cdGlmICghUSB8fCAhUS5lbmdpbmUpIHJldHVybiBjYihudWxsKTtcclxuXHJcblx0dmFyIHNlZ29mZnNldHM9US5lbmdpbmUuZ2V0RmlsZVNlZ09mZnNldHMoZmlsZWlkKTtcclxuXHR2YXIgb3V0cHV0PVtdO1x0XHJcblx0Ly9jb25zb2xlLmxvZyhzdGFydHZwb3MsZW5kdnBvcylcclxuXHRRLmVuZ2luZS5nZXQoW1wiZmlsZUNvbnRlbnRzXCIsZmlsZWlkXSx0cnVlLGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0aWYgKCFkYXRhKSB7XHJcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJ3cm9uZyBmaWxlIGlkXCIsZmlsZWlkKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGZvciAodmFyIGk9MDtpPGRhdGEubGVuZ3RoLTE7aSsrICl7XHJcblx0XHRcdFx0dmFyIHN0YXJ0dnBvcz1zZWdvZmZzZXRzW2ldO1xyXG5cdFx0XHRcdHZhciBlbmR2cG9zPXNlZ29mZnNldHNbaSsxXTtcclxuXHRcdFx0XHR2YXIgc2VnbmFtZXM9US5lbmdpbmUuZ2V0RmlsZVNlZ05hbWVzKGZpbGVpZCk7XHJcblx0XHRcdFx0dmFyIHNlZz1nZXRTZWdTeW5jKFEuZW5naW5lLCBmaWxlaWQsaSsxKTtcclxuXHRcdFx0XHRcdHZhciBvcHQ9e3RleHQ6c2VnLnRleHQsaGl0czpudWxsLHRhZzonaGwnLHZwb3M6c3RhcnR2cG9zLFxyXG5cdFx0XHRcdFx0ZnVsbHRleHQ6dHJ1ZSxub3NwYW46b3B0cy5ub3NwYW4sbm9jcmxmOm9wdHMubm9jcmxmfTtcclxuXHRcdFx0XHR2YXIgc2VnbmFtZT1zZWduYW1lc1tpKzFdO1xyXG5cdFx0XHRcdG9wdC5oaXRzPWhpdEluUmFuZ2UoUSxzdGFydHZwb3MsZW5kdnBvcyk7XHJcblx0XHRcdFx0dmFyIHBiPSc8cGIgbj1cIicrc2VnbmFtZSsnXCI+PC9wYj4nO1xyXG5cdFx0XHRcdHZhciB3aXRodGFnPWluamVjdFRhZyhRLG9wdCk7XHJcblx0XHRcdFx0b3V0cHV0LnB1c2gocGIrd2l0aHRhZyk7XHJcblx0XHRcdH1cdFx0XHRcclxuXHRcdH1cclxuXHJcblx0XHRjYi5hcHBseShRLmVuZ2luZS5jb250ZXh0LFt7dGV4dDpvdXRwdXQuam9pbihcIlwiKSxmaWxlOmZpbGVpZH1dKTtcclxuXHR9KVxyXG59XHJcbnZhciBoaWdobGlnaHRTZWc9ZnVuY3Rpb24oUSxmaWxlaWQsc2VnaWQsb3B0cyxjYikge1xyXG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XHJcblx0XHRjYj1vcHRzO1xyXG5cdH1cclxuXHJcblx0aWYgKCFRIHx8ICFRLmVuZ2luZSkgcmV0dXJuIGNiKG51bGwpO1xyXG5cdHZhciBzZWdvZmZzZXRzPVEuZW5naW5lLmdldEZpbGVTZWdPZmZzZXRzKGZpbGVpZCk7XHJcblx0dmFyIHN0YXJ0dnBvcz1zZWdvZmZzZXRzW3NlZ2lkLTFdO1xyXG5cdHZhciBlbmR2cG9zPXNlZ29mZnNldHNbc2VnaWRdO1xyXG5cdHZhciBzZWduYW1lcz1RLmVuZ2luZS5nZXRGaWxlU2VnTmFtZXMoZmlsZWlkKTtcclxuXHJcblx0dGhpcy5nZXRTZWcoUS5lbmdpbmUsZmlsZWlkLHNlZ2lkLGZ1bmN0aW9uKHJlcyl7XHJcblx0XHR2YXIgb3B0PXt0ZXh0OnJlcy50ZXh0LGhpdHM6bnVsbCx2cG9zOnN0YXJ0dnBvcyxmdWxsdGV4dDp0cnVlLFxyXG5cdFx0XHRub3NwYW46b3B0cy5ub3NwYW4sbm9jcmxmOm9wdHMubm9jcmxmfTtcclxuXHRcdG9wdC5oaXRzPWhpdEluUmFuZ2UoUSxzdGFydHZwb3MsZW5kdnBvcyk7XHJcblx0XHRpZiAob3B0cy5yZW5kZXJUYWdzKSB7XHJcblx0XHRcdG9wdC50YWdzPXRhZ3NJblJhbmdlKFEsb3B0cy5yZW5kZXJUYWdzLHN0YXJ0dnBvcyxlbmR2cG9zKTtcclxuXHRcdH1cclxuXHJcblx0XHR2YXIgc2VnbmFtZT1zZWduYW1lc1tzZWdpZF07XHJcblx0XHRjYi5hcHBseShRLmVuZ2luZS5jb250ZXh0LFt7dGV4dDppbmplY3RUYWcoUSxvcHQpLHNlZzpzZWdpZCxmaWxlOmZpbGVpZCxoaXRzOm9wdC5oaXRzLHNlZ25hbWU6c2VnbmFtZX1dKTtcclxuXHR9KTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cz17cmVzdWx0bGlzdDpyZXN1bHRsaXN0LCBcclxuXHRoaXRJblJhbmdlOmhpdEluUmFuZ2UsIFxyXG5cdGhpZ2hsaWdodFNlZzpoaWdobGlnaHRTZWcsXHJcblx0Z2V0U2VnOmdldFNlZyxcclxuXHRoaWdobGlnaHRGaWxlOmhpZ2hsaWdodEZpbGUsXHJcblx0Z2V0RmlsZTpnZXRGaWxlXHJcblx0Ly9oaWdobGlnaHRSYW5nZTpoaWdobGlnaHRSYW5nZSxcclxuICAvL2dldFJhbmdlOmdldFJhbmdlLFxyXG59OyIsIi8qXHJcbiAgS3NhbmEgU2VhcmNoIEVuZ2luZS5cclxuXHJcbiAgbmVlZCBhIEtERSBpbnN0YW5jZSB0byBiZSBmdW5jdGlvbmFsXHJcbiAgXHJcbiovXHJcbnZhciBic2VhcmNoPXJlcXVpcmUoXCIuL2JzZWFyY2hcIik7XHJcbnZhciBkb3NlYXJjaD1yZXF1aXJlKFwiLi9zZWFyY2hcIik7XHJcblxyXG52YXIgcHJlcGFyZUVuZ2luZUZvclNlYXJjaD1mdW5jdGlvbihlbmdpbmUsY2Ipe1xyXG5cdGlmIChlbmdpbmUuYW5hbHl6ZXIpIHtcclxuXHRcdGNiKCk7XHJcblx0XHRyZXR1cm47XHJcblx0fVxyXG5cdHZhciBhbmFseXplcj1yZXF1aXJlKFwia3NhbmEtYW5hbHl6ZXJcIik7XHJcblx0dmFyIGNvbmZpZz1lbmdpbmUuZ2V0KFwibWV0YVwiKS5jb25maWc7XHJcblx0ZW5naW5lLmFuYWx5emVyPWFuYWx5emVyLmdldEFQSShjb25maWcpO1xyXG5cdGVuZ2luZS5nZXQoW1tcInRva2Vuc1wiXSxbXCJwb3N0aW5nc2xlbmd0aFwiXV0sZnVuY3Rpb24oKXtcclxuXHRcdGNiKCk7XHJcblx0fSk7XHJcbn1cclxuXHJcbnZhciBfc2VhcmNoPWZ1bmN0aW9uKGVuZ2luZSxxLG9wdHMsY2IsY29udGV4dCkge1xyXG5cdGlmICh0eXBlb2YgZW5naW5lPT1cInN0cmluZ1wiKSB7Ly9icm93c2VyIG9ubHlcclxuXHRcdHZhciBrZGU9cmVxdWlyZShcImtzYW5hLWRhdGFiYXNlXCIpO1xyXG5cdFx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHsgLy91c2VyIGRpZG4ndCBzdXBwbHkgb3B0aW9uc1xyXG5cdFx0XHRpZiAodHlwZW9mIGNiPT1cIm9iamVjdFwiKWNvbnRleHQ9Y2I7XHJcblx0XHRcdGNiPW9wdHM7XHJcblx0XHRcdG9wdHM9e307XHJcblx0XHR9XHJcblx0XHRvcHRzLnE9cTtcclxuXHRcdG9wdHMuZGJpZD1lbmdpbmU7XHJcblx0XHRrZGUub3BlbihvcHRzLmRiaWQsZnVuY3Rpb24oZXJyLGRiKXtcclxuXHRcdFx0aWYgKGVycikge1xyXG5cdFx0XHRcdGNiKGVycik7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdGNvbnNvbGUubG9nKFwib3BlbmVkXCIsb3B0cy5kYmlkKVxyXG5cdFx0XHRwcmVwYXJlRW5naW5lRm9yU2VhcmNoKGRiLGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0cmV0dXJuIGRvc2VhcmNoKGRiLHEsb3B0cyxjYik7XHRcclxuXHRcdFx0fSk7XHJcblx0XHR9LGNvbnRleHQpO1xyXG5cdH0gZWxzZSB7XHJcblx0XHRwcmVwYXJlRW5naW5lRm9yU2VhcmNoKGVuZ2luZSxmdW5jdGlvbigpe1xyXG5cdFx0XHRyZXR1cm4gZG9zZWFyY2goZW5naW5lLHEsb3B0cyxjYik7XHRcclxuXHRcdH0pO1xyXG5cdH1cclxufVxyXG5cclxudmFyIF9oaWdobGlnaHRTZWc9ZnVuY3Rpb24oZW5naW5lLGZpbGVpZCxzZWdpZCxvcHRzLGNiKXtcclxuXHRpZiAoIW9wdHMucSkgb3B0cy5xPVwiXCI7IFxyXG5cdF9zZWFyY2goZW5naW5lLG9wdHMucSxvcHRzLGZ1bmN0aW9uKFEpe1xyXG5cdFx0YXBpLmV4Y2VycHQuaGlnaGxpZ2h0U2VnKFEsZmlsZWlkLHNlZ2lkLG9wdHMsY2IpO1xyXG5cdH0pO1x0XHJcbn1cclxudmFyIF9oaWdobGlnaHRSYW5nZT1mdW5jdGlvbihlbmdpbmUsc3RhcnQsZW5kLG9wdHMsY2Ipe1xyXG5cclxuXHRpZiAob3B0cy5xKSB7XHJcblx0XHRfc2VhcmNoKGVuZ2luZSxvcHRzLnEsb3B0cyxmdW5jdGlvbihRKXtcclxuXHRcdFx0YXBpLmV4Y2VycHQuaGlnaGxpZ2h0UmFuZ2UoUSxzdGFydCxlbmQsb3B0cyxjYik7XHJcblx0XHR9KTtcclxuXHR9IGVsc2Uge1xyXG5cdFx0cHJlcGFyZUVuZ2luZUZvclNlYXJjaChlbmdpbmUsZnVuY3Rpb24oKXtcclxuXHRcdFx0YXBpLmV4Y2VycHQuZ2V0UmFuZ2UoZW5naW5lLHN0YXJ0LGVuZCxjYik7XHJcblx0XHR9KTtcclxuXHR9XHJcbn1cclxudmFyIF9oaWdobGlnaHRGaWxlPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaWQsb3B0cyxjYil7XHJcblx0aWYgKCFvcHRzLnEpIG9wdHMucT1cIlwiOyBcclxuXHRfc2VhcmNoKGVuZ2luZSxvcHRzLnEsb3B0cyxmdW5jdGlvbihRKXtcclxuXHRcdGFwaS5leGNlcnB0LmhpZ2hsaWdodEZpbGUoUSxmaWxlaWQsb3B0cyxjYik7XHJcblx0fSk7XHJcblx0LypcclxuXHR9IGVsc2Uge1xyXG5cdFx0YXBpLmV4Y2VycHQuZ2V0RmlsZShlbmdpbmUsZmlsZWlkLGZ1bmN0aW9uKGRhdGEpIHtcclxuXHRcdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW2RhdGFdKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHQqL1xyXG59XHJcblxyXG52YXIgdnBvczJmaWxlc2VnPWZ1bmN0aW9uKGVuZ2luZSx2cG9zKSB7XHJcbiAgICB2YXIgc2Vnb2Zmc2V0cz1lbmdpbmUuZ2V0KFwic2Vnb2Zmc2V0c1wiKTtcclxuICAgIHZhciBmaWxlb2Zmc2V0cz1lbmdpbmUuZ2V0KFtcImZpbGVvZmZzZXRzXCJdKTtcclxuICAgIHZhciBzZWduYW1lcz1lbmdpbmUuZ2V0KFwic2VnbmFtZXNcIik7XHJcbiAgICB2YXIgZmlsZWlkPWJzZWFyY2goZmlsZW9mZnNldHMsdnBvcysxLHRydWUpO1xyXG4gICAgZmlsZWlkLS07XHJcbiAgICB2YXIgc2VnaWQ9YnNlYXJjaChzZWdvZmZzZXRzLHZwb3MrMSx0cnVlKTtcclxuXHR2YXIgcmFuZ2U9ZW5naW5lLmdldEZpbGVSYW5nZShmaWxlaWQpO1xyXG5cdHNlZ2lkLT1yYW5nZS5zdGFydDtcclxuICAgIHJldHVybiB7ZmlsZTpmaWxlaWQsc2VnOnNlZ2lkfTtcclxufVxyXG52YXIgYXBpPXtcclxuXHRzZWFyY2g6X3NlYXJjaFxyXG4vL1x0LGNvbmNvcmRhbmNlOnJlcXVpcmUoXCIuL2NvbmNvcmRhbmNlXCIpXHJcbi8vXHQscmVnZXg6cmVxdWlyZShcIi4vcmVnZXhcIilcclxuXHQsaGlnaGxpZ2h0U2VnOl9oaWdobGlnaHRTZWdcclxuXHQsaGlnaGxpZ2h0RmlsZTpfaGlnaGxpZ2h0RmlsZVxyXG4vL1x0LGhpZ2hsaWdodFJhbmdlOl9oaWdobGlnaHRSYW5nZVxyXG5cdCxleGNlcnB0OnJlcXVpcmUoXCIuL2V4Y2VycHRcIilcclxuXHQsdnBvczJmaWxlc2VnOnZwb3MyZmlsZXNlZ1xyXG59XHJcbm1vZHVsZS5leHBvcnRzPWFwaTsiLCJcclxudmFyIHVucGFjayA9IGZ1bmN0aW9uIChhcikgeyAvLyB1bnBhY2sgdmFyaWFibGUgbGVuZ3RoIGludGVnZXIgbGlzdFxyXG4gIHZhciByID0gW10sXHJcbiAgaSA9IDAsXHJcbiAgdiA9IDA7XHJcbiAgZG8ge1xyXG5cdHZhciBzaGlmdCA9IDA7XHJcblx0ZG8ge1xyXG5cdCAgdiArPSAoKGFyW2ldICYgMHg3RikgPDwgc2hpZnQpO1xyXG5cdCAgc2hpZnQgKz0gNztcclxuXHR9IHdoaWxlIChhclsrK2ldICYgMHg4MCk7XHJcblx0cltyLmxlbmd0aF09djtcclxuICB9IHdoaWxlIChpIDwgYXIubGVuZ3RoKTtcclxuICByZXR1cm4gcjtcclxufVxyXG5cclxuLypcclxuICAgYXJyOiAgWzEsMSwxLDEsMSwxLDEsMSwxXVxyXG4gICBsZXZlbHM6IFswLDEsMSwyLDIsMCwxLDJdXHJcbiAgIG91dHB1dDogWzUsMSwzLDEsMSwzLDEsMV1cclxuKi9cclxuXHJcbnZhciBncm91cHN1bT1mdW5jdGlvbihhcnIsbGV2ZWxzKSB7XHJcbiAgaWYgKGFyci5sZW5ndGghPWxldmVscy5sZW5ndGgrMSkgcmV0dXJuIG51bGw7XHJcbiAgdmFyIHN0YWNrPVtdO1xyXG4gIHZhciBvdXRwdXQ9bmV3IEFycmF5KGxldmVscy5sZW5ndGgpO1xyXG4gIGZvciAodmFyIGk9MDtpPGxldmVscy5sZW5ndGg7aSsrKSBvdXRwdXRbaV09MDtcclxuICBmb3IgKHZhciBpPTE7aTxhcnIubGVuZ3RoO2krKykgeyAvL2ZpcnN0IG9uZSBvdXQgb2YgdG9jIHNjb3BlLCBpZ25vcmVkXHJcbiAgICBpZiAoc3RhY2subGVuZ3RoPmxldmVsc1tpLTFdKSB7XHJcbiAgICAgIHdoaWxlIChzdGFjay5sZW5ndGg+bGV2ZWxzW2ktMV0pIHN0YWNrLnBvcCgpO1xyXG4gICAgfVxyXG4gICAgc3RhY2sucHVzaChpLTEpO1xyXG4gICAgZm9yICh2YXIgaj0wO2o8c3RhY2subGVuZ3RoO2orKykge1xyXG4gICAgICBvdXRwdXRbc3RhY2tbal1dKz1hcnJbaV07XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvdXRwdXQ7XHJcbn1cclxuLyogYXJyPSAxICwgMiAsIDMgLDQgLDUsNiw3IC8vdG9rZW4gcG9zdGluZ1xyXG4gIHBvc3Rpbmc9IDMgLCA1ICAvL3RhZyBwb3N0aW5nXHJcbiAgb3V0ID0gMyAsIDIsIDJcclxuKi9cclxudmFyIGNvdW50Ynlwb3N0aW5nID0gZnVuY3Rpb24gKGFyciwgcG9zdGluZykge1xyXG4gIGlmICghcG9zdGluZy5sZW5ndGgpIHJldHVybiBbYXJyLmxlbmd0aF07XHJcbiAgdmFyIG91dD1bXTtcclxuICBmb3IgKHZhciBpPTA7aTxwb3N0aW5nLmxlbmd0aDtpKyspIG91dFtpXT0wO1xyXG4gIG91dFtwb3N0aW5nLmxlbmd0aF09MDtcclxuICB2YXIgcD0wLGk9MCxsYXN0aT0wO1xyXG4gIHdoaWxlIChpPGFyci5sZW5ndGggJiYgcDxwb3N0aW5nLmxlbmd0aCkge1xyXG4gICAgaWYgKGFycltpXTw9cG9zdGluZ1twXSkge1xyXG4gICAgICB3aGlsZSAocDxwb3N0aW5nLmxlbmd0aCAmJiBpPGFyci5sZW5ndGggJiYgYXJyW2ldPD1wb3N0aW5nW3BdKSB7XHJcbiAgICAgICAgb3V0W3BdKys7XHJcbiAgICAgICAgaSsrO1xyXG4gICAgICB9ICAgICAgXHJcbiAgICB9IFxyXG4gICAgcCsrO1xyXG4gIH1cclxuICBvdXRbcG9zdGluZy5sZW5ndGhdID0gYXJyLmxlbmd0aC1pOyAvL3JlbWFpbmluZ1xyXG4gIHJldHVybiBvdXQ7XHJcbn1cclxuXHJcbnZhciBncm91cGJ5cG9zdGluZz1mdW5jdGlvbihhcnIsZ3Bvc3RpbmcpIHsgLy9yZWxhdGl2ZSB2cG9zXHJcbiAgaWYgKCFncG9zdGluZy5sZW5ndGgpIHJldHVybiBbYXJyLmxlbmd0aF07XHJcbiAgdmFyIG91dD1bXTtcclxuICBmb3IgKHZhciBpPTA7aTw9Z3Bvc3RpbmcubGVuZ3RoO2krKykgb3V0W2ldPVtdO1xyXG4gIFxyXG4gIHZhciBwPTAsaT0wLGxhc3RpPTA7XHJcbiAgd2hpbGUgKGk8YXJyLmxlbmd0aCAmJiBwPGdwb3N0aW5nLmxlbmd0aCkge1xyXG4gICAgaWYgKGFycltpXTxncG9zdGluZ1twXSkge1xyXG4gICAgICB3aGlsZSAocDxncG9zdGluZy5sZW5ndGggJiYgaTxhcnIubGVuZ3RoICYmIGFycltpXTxncG9zdGluZ1twXSkge1xyXG4gICAgICAgIHZhciBzdGFydD0wO1xyXG4gICAgICAgIGlmIChwPjApIHN0YXJ0PWdwb3N0aW5nW3AtMV07XHJcbiAgICAgICAgb3V0W3BdLnB1c2goYXJyW2krK10tc3RhcnQpOyAgLy8gcmVsYXRpdmVcclxuICAgICAgfSAgICAgIFxyXG4gICAgfSBcclxuICAgIHArKztcclxuICB9XHJcbiAgLy9yZW1haW5pbmdcclxuICB3aGlsZShpPGFyci5sZW5ndGgpIG91dFtvdXQubGVuZ3RoLTFdLnB1c2goYXJyW2krK10tZ3Bvc3RpbmdbZ3Bvc3RpbmcubGVuZ3RoLTFdKTtcclxuICByZXR1cm4gb3V0O1xyXG59XHJcbnZhciBncm91cGJ5cG9zdGluZzI9ZnVuY3Rpb24oYXJyLGdwb3N0aW5nKSB7IC8vYWJzb2x1dGUgdnBvc1xyXG4gIGlmICghYXJyIHx8ICFhcnIubGVuZ3RoKSByZXR1cm4gW107XHJcbiAgaWYgKCFncG9zdGluZy5sZW5ndGgpIHJldHVybiBbYXJyLmxlbmd0aF07XHJcbiAgdmFyIG91dD1bXTtcclxuICBmb3IgKHZhciBpPTA7aTw9Z3Bvc3RpbmcubGVuZ3RoO2krKykgb3V0W2ldPVtdO1xyXG4gIFxyXG4gIHZhciBwPTAsaT0wLGxhc3RpPTA7XHJcbiAgd2hpbGUgKGk8YXJyLmxlbmd0aCAmJiBwPGdwb3N0aW5nLmxlbmd0aCkge1xyXG4gICAgaWYgKGFycltpXTxncG9zdGluZ1twXSkge1xyXG4gICAgICB3aGlsZSAocDxncG9zdGluZy5sZW5ndGggJiYgaTxhcnIubGVuZ3RoICYmIGFycltpXTxncG9zdGluZ1twXSkge1xyXG4gICAgICAgIHZhciBzdGFydD0wO1xyXG4gICAgICAgIGlmIChwPjApIHN0YXJ0PWdwb3N0aW5nW3AtMV07IC8vYWJzb2x1dGVcclxuICAgICAgICBvdXRbcF0ucHVzaChhcnJbaSsrXSk7XHJcbiAgICAgIH0gICAgICBcclxuICAgIH0gXHJcbiAgICBwKys7XHJcbiAgfVxyXG4gIC8vcmVtYWluaW5nXHJcbiAgd2hpbGUoaTxhcnIubGVuZ3RoKSBvdXRbb3V0Lmxlbmd0aC0xXS5wdXNoKGFycltpKytdLWdwb3N0aW5nW2dwb3N0aW5nLmxlbmd0aC0xXSk7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG52YXIgZ3JvdXBieWJsb2NrMiA9IGZ1bmN0aW9uKGFyLCBudG9rZW4sc2xvdHNoaWZ0LG9wdHMpIHtcclxuICBpZiAoIWFyLmxlbmd0aCkgcmV0dXJuIFt7fSx7fV07XHJcbiAgXHJcbiAgc2xvdHNoaWZ0ID0gc2xvdHNoaWZ0IHx8IDE2O1xyXG4gIHZhciBnID0gTWF0aC5wb3coMixzbG90c2hpZnQpO1xyXG4gIHZhciBpID0gMDtcclxuICB2YXIgciA9IHt9LCBudG9rZW5zPXt9O1xyXG4gIHZhciBncm91cGNvdW50PTA7XHJcbiAgZG8ge1xyXG4gICAgdmFyIGdyb3VwID0gTWF0aC5mbG9vcihhcltpXSAvIGcpIDtcclxuICAgIGlmICghcltncm91cF0pIHtcclxuICAgICAgcltncm91cF0gPSBbXTtcclxuICAgICAgbnRva2Vuc1tncm91cF09W107XHJcbiAgICAgIGdyb3VwY291bnQrKztcclxuICAgIH1cclxuICAgIHJbZ3JvdXBdLnB1c2goYXJbaV0gJSBnKTtcclxuICAgIG50b2tlbnNbZ3JvdXBdLnB1c2gobnRva2VuW2ldKTtcclxuICAgIGkrKztcclxuICB9IHdoaWxlIChpIDwgYXIubGVuZ3RoKTtcclxuICBpZiAob3B0cykgb3B0cy5ncm91cGNvdW50PWdyb3VwY291bnQ7XHJcbiAgcmV0dXJuIFtyLG50b2tlbnNdO1xyXG59XHJcbnZhciBncm91cGJ5c2xvdCA9IGZ1bmN0aW9uIChhciwgc2xvdHNoaWZ0LCBvcHRzKSB7XHJcbiAgaWYgKCFhci5sZW5ndGgpXHJcblx0cmV0dXJuIHt9O1xyXG4gIFxyXG4gIHNsb3RzaGlmdCA9IHNsb3RzaGlmdCB8fCAxNjtcclxuICB2YXIgZyA9IE1hdGgucG93KDIsc2xvdHNoaWZ0KTtcclxuICB2YXIgaSA9IDA7XHJcbiAgdmFyIHIgPSB7fTtcclxuICB2YXIgZ3JvdXBjb3VudD0wO1xyXG4gIGRvIHtcclxuXHR2YXIgZ3JvdXAgPSBNYXRoLmZsb29yKGFyW2ldIC8gZykgO1xyXG5cdGlmICghcltncm91cF0pIHtcclxuXHQgIHJbZ3JvdXBdID0gW107XHJcblx0ICBncm91cGNvdW50Kys7XHJcblx0fVxyXG5cdHJbZ3JvdXBdLnB1c2goYXJbaV0gJSBnKTtcclxuXHRpKys7XHJcbiAgfSB3aGlsZSAoaSA8IGFyLmxlbmd0aCk7XHJcbiAgaWYgKG9wdHMpIG9wdHMuZ3JvdXBjb3VudD1ncm91cGNvdW50O1xyXG4gIHJldHVybiByO1xyXG59XHJcbi8qXHJcbnZhciBpZGVudGl0eSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gIHJldHVybiB2YWx1ZTtcclxufTtcclxudmFyIHNvcnRlZEluZGV4ID0gZnVuY3Rpb24gKGFycmF5LCBvYmosIGl0ZXJhdG9yKSB7IC8vdGFrZW4gZnJvbSB1bmRlcnNjb3JlXHJcbiAgaXRlcmF0b3IgfHwgKGl0ZXJhdG9yID0gaWRlbnRpdHkpO1xyXG4gIHZhciBsb3cgPSAwLFxyXG4gIGhpZ2ggPSBhcnJheS5sZW5ndGg7XHJcbiAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcclxuXHR2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XHJcblx0aXRlcmF0b3IoYXJyYXlbbWlkXSkgPCBpdGVyYXRvcihvYmopID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XHJcbiAgfVxyXG4gIHJldHVybiBsb3c7XHJcbn07Ki9cclxuXHJcbnZhciBpbmRleE9mU29ydGVkID0gZnVuY3Rpb24gKGFycmF5LCBvYmopIHsgXHJcbiAgdmFyIGxvdyA9IDAsXHJcbiAgaGlnaCA9IGFycmF5Lmxlbmd0aC0xO1xyXG4gIHdoaWxlIChsb3cgPCBoaWdoKSB7XHJcbiAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XHJcbiAgICBhcnJheVttaWRdIDwgb2JqID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XHJcbiAgfVxyXG4gIHJldHVybiBsb3c7XHJcbn07XHJcbnZhciBwbGhlYWQ9ZnVuY3Rpb24ocGwsIHBsdGFnLCBvcHRzKSB7XHJcbiAgb3B0cz1vcHRzfHx7fTtcclxuICBvcHRzLm1heD1vcHRzLm1heHx8MTtcclxuICB2YXIgb3V0PVtdO1xyXG4gIGlmIChwbHRhZy5sZW5ndGg8cGwubGVuZ3RoKSB7XHJcbiAgICBmb3IgKHZhciBpPTA7aTxwbHRhZy5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICBrID0gaW5kZXhPZlNvcnRlZChwbCwgcGx0YWdbaV0pO1xyXG4gICAgICAgaWYgKGs+LTEgJiYgazxwbC5sZW5ndGgpIHtcclxuICAgICAgICBpZiAocGxba109PXBsdGFnW2ldKSB7XHJcbiAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF09cGx0YWdbaV07XHJcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aD49b3B0cy5tYXgpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBmb3IgKHZhciBpPTA7aTxwbC5sZW5ndGg7aSsrKSB7XHJcbiAgICAgICBrID0gaW5kZXhPZlNvcnRlZChwbHRhZywgcGxbaV0pO1xyXG4gICAgICAgaWYgKGs+LTEgJiYgazxwbHRhZy5sZW5ndGgpIHtcclxuICAgICAgICBpZiAocGx0YWdba109PXBsW2ldKSB7XHJcbiAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF09cGx0YWdba107XHJcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aD49b3B0cy5tYXgpIGJyZWFrO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb3V0O1xyXG59XHJcbi8qXHJcbiBwbDIgb2NjdXIgYWZ0ZXIgcGwxLCBcclxuIHBsMj49cGwxK21pbmRpc1xyXG4gcGwyPD1wbDErbWF4ZGlzXHJcbiovXHJcbnZhciBwbGZvbGxvdzIgPSBmdW5jdGlvbiAocGwxLCBwbDIsIG1pbmRpcywgbWF4ZGlzKSB7XHJcbiAgdmFyIHIgPSBbXSxpPTA7XHJcbiAgdmFyIHN3YXAgPSAwO1xyXG4gIFxyXG4gIHdoaWxlIChpPHBsMS5sZW5ndGgpe1xyXG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgbWluZGlzKTtcclxuICAgIHZhciB0ID0gKHBsMltrXSA+PSAocGwxW2ldICttaW5kaXMpICYmIHBsMltrXTw9KHBsMVtpXSttYXhkaXMpKSA/IGsgOiAtMTtcclxuICAgIGlmICh0ID4gLTEpIHtcclxuICAgICAgcltyLmxlbmd0aF09cGwxW2ldO1xyXG4gICAgICBpKys7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaz49cGwyLmxlbmd0aCkgYnJlYWs7XHJcbiAgICAgIHZhciBrMj1pbmRleE9mU29ydGVkIChwbDEscGwyW2tdLW1heGRpcyk7XHJcbiAgICAgIGlmIChrMj5pKSB7XHJcbiAgICAgICAgdmFyIHQgPSAocGwyW2tdID49IChwbDFbaV0gK21pbmRpcykgJiYgcGwyW2tdPD0ocGwxW2ldK21heGRpcykpID8gayA6IC0xO1xyXG4gICAgICAgIGlmICh0Pi0xKSByW3IubGVuZ3RoXT1wbDFbazJdO1xyXG4gICAgICAgIGk9azI7XHJcbiAgICAgIH0gZWxzZSBicmVhaztcclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIHI7XHJcbn1cclxuXHJcbnZhciBwbG5vdGZvbGxvdzIgPSBmdW5jdGlvbiAocGwxLCBwbDIsIG1pbmRpcywgbWF4ZGlzKSB7XHJcbiAgdmFyIHIgPSBbXSxpPTA7XHJcbiAgXHJcbiAgd2hpbGUgKGk8cGwxLmxlbmd0aCl7XHJcbiAgICB2YXIgayA9IGluZGV4T2ZTb3J0ZWQocGwyLCBwbDFbaV0gKyBtaW5kaXMpO1xyXG4gICAgdmFyIHQgPSAocGwyW2tdID49IChwbDFbaV0gK21pbmRpcykgJiYgcGwyW2tdPD0ocGwxW2ldK21heGRpcykpID8gayA6IC0xO1xyXG4gICAgaWYgKHQgPiAtMSkge1xyXG4gICAgICBpKys7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoaz49cGwyLmxlbmd0aCkge1xyXG4gICAgICAgIHI9ci5jb25jYXQocGwxLnNsaWNlKGkpKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgazI9aW5kZXhPZlNvcnRlZCAocGwxLHBsMltrXS1tYXhkaXMpO1xyXG4gICAgICAgIGlmIChrMj5pKSB7XHJcbiAgICAgICAgICByPXIuY29uY2F0KHBsMS5zbGljZShpLGsyKSk7XHJcbiAgICAgICAgICBpPWsyO1xyXG4gICAgICAgIH0gZWxzZSBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG4vKiB0aGlzIGlzIGluY29ycmVjdCAqL1xyXG52YXIgcGxmb2xsb3cgPSBmdW5jdGlvbiAocGwxLCBwbDIsIGRpc3RhbmNlKSB7XHJcbiAgdmFyIHIgPSBbXSxpPTA7XHJcblxyXG4gIHdoaWxlIChpPHBsMS5sZW5ndGgpe1xyXG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgZGlzdGFuY2UpO1xyXG4gICAgdmFyIHQgPSAocGwyW2tdID09PSAocGwxW2ldICsgZGlzdGFuY2UpKSA/IGsgOiAtMTtcclxuICAgIGlmICh0ID4gLTEpIHtcclxuICAgICAgci5wdXNoKHBsMVtpXSk7XHJcbiAgICAgIGkrKztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChrPj1wbDIubGVuZ3RoKSBicmVhaztcclxuICAgICAgdmFyIGsyPWluZGV4T2ZTb3J0ZWQgKHBsMSxwbDJba10tZGlzdGFuY2UpO1xyXG4gICAgICBpZiAoazI+aSkge1xyXG4gICAgICAgIHQgPSAocGwyW2tdID09PSAocGwxW2syXSArIGRpc3RhbmNlKSkgPyBrIDogLTE7XHJcbiAgICAgICAgaWYgKHQ+LTEpIHtcclxuICAgICAgICAgICByLnB1c2gocGwxW2syXSk7XHJcbiAgICAgICAgICAgazIrKztcclxuICAgICAgICB9XHJcbiAgICAgICAgaT1rMjtcclxuICAgICAgfSBlbHNlIGJyZWFrO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG52YXIgcGxub3Rmb2xsb3cgPSBmdW5jdGlvbiAocGwxLCBwbDIsIGRpc3RhbmNlKSB7XHJcbiAgdmFyIHIgPSBbXTtcclxuICB2YXIgciA9IFtdLGk9MDtcclxuICB2YXIgc3dhcCA9IDA7XHJcbiAgXHJcbiAgd2hpbGUgKGk8cGwxLmxlbmd0aCl7XHJcbiAgICB2YXIgayA9IGluZGV4T2ZTb3J0ZWQocGwyLCBwbDFbaV0gKyBkaXN0YW5jZSk7XHJcbiAgICB2YXIgdCA9IChwbDJba10gPT09IChwbDFbaV0gKyBkaXN0YW5jZSkpID8gayA6IC0xO1xyXG4gICAgaWYgKHQgPiAtMSkgeyBcclxuICAgICAgaSsrO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGs+PXBsMi5sZW5ndGgpIHtcclxuICAgICAgICByPXIuY29uY2F0KHBsMS5zbGljZShpKSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGsyPWluZGV4T2ZTb3J0ZWQgKHBsMSxwbDJba10tZGlzdGFuY2UpO1xyXG4gICAgICAgIGlmIChrMj5pKSB7XHJcbiAgICAgICAgICByPXIuY29uY2F0KHBsMS5zbGljZShpLGsyKSk7XHJcbiAgICAgICAgICBpPWsyO1xyXG4gICAgICAgIH0gZWxzZSBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG52YXIgcGxhbmQgPSBmdW5jdGlvbiAocGwxLCBwbDIsIGRpc3RhbmNlKSB7XHJcbiAgdmFyIHIgPSBbXTtcclxuICB2YXIgc3dhcCA9IDA7XHJcbiAgXHJcbiAgaWYgKHBsMS5sZW5ndGggPiBwbDIubGVuZ3RoKSB7IC8vc3dhcCBmb3IgZmFzdGVyIGNvbXBhcmVcclxuICAgIHZhciB0ID0gcGwyO1xyXG4gICAgcGwyID0gcGwxO1xyXG4gICAgcGwxID0gdDtcclxuICAgIHN3YXAgPSBkaXN0YW5jZTtcclxuICAgIGRpc3RhbmNlID0gLWRpc3RhbmNlO1xyXG4gIH1cclxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBsMS5sZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgZGlzdGFuY2UpO1xyXG4gICAgdmFyIHQgPSAocGwyW2tdID09PSAocGwxW2ldICsgZGlzdGFuY2UpKSA/IGsgOiAtMTtcclxuICAgIGlmICh0ID4gLTEpIHtcclxuICAgICAgci5wdXNoKHBsMVtpXSAtIHN3YXApO1xyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gcjtcclxufVxyXG52YXIgY29tYmluZT1mdW5jdGlvbiAocG9zdGluZ3MpIHtcclxuICB2YXIgb3V0PVtdO1xyXG4gIGZvciAodmFyIGkgaW4gcG9zdGluZ3MpIHtcclxuICAgIG91dD1vdXQuY29uY2F0KHBvc3RpbmdzW2ldKTtcclxuICB9XHJcbiAgb3V0LnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS1ifSk7XHJcbiAgcmV0dXJuIG91dDtcclxufVxyXG5cclxudmFyIHVuaXF1ZSA9IGZ1bmN0aW9uKGFyKXtcclxuICAgaWYgKCFhciB8fCAhYXIubGVuZ3RoKSByZXR1cm4gW107XHJcbiAgIHZhciB1ID0ge30sIGEgPSBbXTtcclxuICAgZm9yKHZhciBpID0gMCwgbCA9IGFyLmxlbmd0aDsgaSA8IGw7ICsraSl7XHJcbiAgICBpZih1Lmhhc093blByb3BlcnR5KGFyW2ldKSkgY29udGludWU7XHJcbiAgICBhLnB1c2goYXJbaV0pO1xyXG4gICAgdVthcltpXV0gPSAxO1xyXG4gICB9XHJcbiAgIHJldHVybiBhO1xyXG59XHJcblxyXG5cclxuXHJcbnZhciBwbHBocmFzZSA9IGZ1bmN0aW9uIChwb3N0aW5ncyxvcHMpIHtcclxuICB2YXIgciA9IFtdO1xyXG4gIGZvciAodmFyIGk9MDtpPHBvc3RpbmdzLmxlbmd0aDtpKyspIHtcclxuICBcdGlmICghcG9zdGluZ3NbaV0pICByZXR1cm4gW107XHJcbiAgXHRpZiAoMCA9PT0gaSkge1xyXG4gIFx0ICByID0gcG9zdGluZ3NbMF07XHJcbiAgXHR9IGVsc2Uge1xyXG4gICAgICBpZiAob3BzW2ldPT0nYW5kbm90Jykge1xyXG4gICAgICAgIHIgPSBwbG5vdGZvbGxvdyhyLCBwb3N0aW5nc1tpXSwgaSk7ICBcclxuICAgICAgfWVsc2Uge1xyXG4gICAgICAgIHIgPSBwbGFuZChyLCBwb3N0aW5nc1tpXSwgaSk7ICBcclxuICAgICAgfVxyXG4gIFx0fVxyXG4gIH1cclxuICBcclxuICByZXR1cm4gcjtcclxufVxyXG4vL3JldHVybiBhbiBhcnJheSBvZiBncm91cCBoYXZpbmcgYW55IG9mIHBsIGl0ZW1cclxudmFyIG1hdGNoUG9zdGluZz1mdW5jdGlvbihwbCxndXBsLHN0YXJ0LGVuZCkge1xyXG4gIHN0YXJ0PXN0YXJ0fHwwO1xyXG4gIGVuZD1lbmR8fC0xO1xyXG4gIGlmIChlbmQ9PS0xKSBlbmQ9TWF0aC5wb3coMiwgNTMpOyAvLyBtYXggaW50ZWdlciB2YWx1ZVxyXG5cclxuICB2YXIgY291bnQ9MCwgaSA9IGo9IDAsICByZXN1bHQgPSBbXSAsdj0wO1xyXG4gIHZhciBkb2NzPVtdLCBmcmVxPVtdO1xyXG4gIGlmICghcGwpIHJldHVybiB7ZG9jczpbXSxmcmVxOltdfTtcclxuICB3aGlsZSggaSA8IHBsLmxlbmd0aCAmJiBqIDwgZ3VwbC5sZW5ndGggKXtcclxuICAgICBpZiAocGxbaV0gPCBndXBsW2pdICl7IFxyXG4gICAgICAgY291bnQrKztcclxuICAgICAgIHY9cGxbaV07XHJcbiAgICAgICBpKys7IFxyXG4gICAgIH0gZWxzZSB7XHJcbiAgICAgICBpZiAoY291bnQpIHtcclxuICAgICAgICBpZiAodj49c3RhcnQgJiYgdjxlbmQpIHtcclxuICAgICAgICAgIGRvY3MucHVzaChqKTtcclxuICAgICAgICAgIGZyZXEucHVzaChjb3VudCk7ICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgIH1cclxuICAgICAgIGorKztcclxuICAgICAgIGNvdW50PTA7XHJcbiAgICAgfVxyXG4gIH1cclxuICBpZiAoY291bnQgJiYgajxndXBsLmxlbmd0aCAmJiB2Pj1zdGFydCAmJiB2PGVuZCkge1xyXG4gICAgZG9jcy5wdXNoKGopO1xyXG4gICAgZnJlcS5wdXNoKGNvdW50KTtcclxuICAgIGNvdW50PTA7XHJcbiAgfVxyXG4gIGVsc2Uge1xyXG4gICAgd2hpbGUgKGo9PWd1cGwubGVuZ3RoICYmIGk8cGwubGVuZ3RoICYmIHBsW2ldID49IGd1cGxbZ3VwbC5sZW5ndGgtMV0pIHtcclxuICAgICAgaSsrO1xyXG4gICAgICBjb3VudCsrO1xyXG4gICAgfVxyXG4gICAgaWYgKHY+PXN0YXJ0ICYmIHY8ZW5kKSB7XHJcbiAgICAgIGRvY3MucHVzaChqKTtcclxuICAgICAgZnJlcS5wdXNoKGNvdW50KTsgICAgICBcclxuICAgIH1cclxuICB9IFxyXG4gIHJldHVybiB7ZG9jczpkb2NzLGZyZXE6ZnJlcX07XHJcbn1cclxuXHJcbnZhciB0cmltPWZ1bmN0aW9uKGFycixzdGFydCxlbmQpIHtcclxuICB2YXIgcz1pbmRleE9mU29ydGVkKGFycixzdGFydCk7XHJcbiAgdmFyIGU9aW5kZXhPZlNvcnRlZChhcnIsZW5kKTtcclxuICByZXR1cm4gYXJyLnNsaWNlKHMsZSsxKTtcclxufVxyXG52YXIgcGxpc3Q9e307XHJcbnBsaXN0LnVucGFjaz11bnBhY2s7XHJcbnBsaXN0LnBscGhyYXNlPXBscGhyYXNlO1xyXG5wbGlzdC5wbGhlYWQ9cGxoZWFkO1xyXG5wbGlzdC5wbGZvbGxvdzI9cGxmb2xsb3cyO1xyXG5wbGlzdC5wbG5vdGZvbGxvdzI9cGxub3Rmb2xsb3cyO1xyXG5wbGlzdC5wbGZvbGxvdz1wbGZvbGxvdztcclxucGxpc3QucGxub3Rmb2xsb3c9cGxub3Rmb2xsb3c7XHJcbnBsaXN0LnVuaXF1ZT11bmlxdWU7XHJcbnBsaXN0LmluZGV4T2ZTb3J0ZWQ9aW5kZXhPZlNvcnRlZDtcclxucGxpc3QubWF0Y2hQb3N0aW5nPW1hdGNoUG9zdGluZztcclxucGxpc3QudHJpbT10cmltO1xyXG5cclxucGxpc3QuZ3JvdXBieXNsb3Q9Z3JvdXBieXNsb3Q7XHJcbnBsaXN0Lmdyb3VwYnlibG9jazI9Z3JvdXBieWJsb2NrMjtcclxucGxpc3QuY291bnRieXBvc3Rpbmc9Y291bnRieXBvc3Rpbmc7XHJcbnBsaXN0Lmdyb3VwYnlwb3N0aW5nPWdyb3VwYnlwb3N0aW5nO1xyXG5wbGlzdC5ncm91cGJ5cG9zdGluZzI9Z3JvdXBieXBvc3RpbmcyO1xyXG5wbGlzdC5ncm91cHN1bT1ncm91cHN1bTtcclxucGxpc3QuY29tYmluZT1jb21iaW5lO1xyXG5tb2R1bGUuZXhwb3J0cz1wbGlzdDsiLCIvKlxyXG52YXIgZG9zZWFyY2gyPWZ1bmN0aW9uKGVuZ2luZSxvcHRzLGNiLGNvbnRleHQpIHtcclxuXHRvcHRzXHJcblx0XHRuZmlsZSxucGFnZSAgLy9yZXR1cm4gYSBoaWdobGlnaHRlZCBwYWdlXHJcblx0XHRuZmlsZSxbcGFnZXNdIC8vcmV0dXJuIGhpZ2hsaWdodGVkIHBhZ2VzIFxyXG5cdFx0bmZpbGUgICAgICAgIC8vcmV0dXJuIGVudGlyZSBoaWdobGlnaHRlZCBmaWxlXHJcblx0XHRhYnNfbnBhZ2VcclxuXHRcdFthYnNfcGFnZXNdICAvL3JldHVybiBzZXQgb2YgaGlnaGxpZ2h0ZWQgcGFnZXMgKG1heSBjcm9zcyBmaWxlKVxyXG5cclxuXHRcdGZpbGVuYW1lLCBwYWdlbmFtZVxyXG5cdFx0ZmlsZW5hbWUsW3BhZ2VuYW1lc11cclxuXHJcblx0XHRleGNlcnB0ICAgICAgLy9cclxuXHQgICAgc29ydEJ5ICAgICAgIC8vZGVmYXVsdCBuYXR1cmFsLCBzb3J0YnkgYnkgdnNtIHJhbmtpbmdcclxuXHJcblx0Ly9yZXR1cm4gZXJyLGFycmF5X29mX3N0cmluZyAsUSAgKFEgY29udGFpbnMgbG93IGxldmVsIHNlYXJjaCByZXN1bHQpXHJcbn1cclxuXHJcbiovXHJcbi8qIFRPRE8gc29ydGVkIHRva2VucyAqL1xyXG52YXIgcGxpc3Q9cmVxdWlyZShcIi4vcGxpc3RcIik7XHJcbnZhciBib29sc2VhcmNoPXJlcXVpcmUoXCIuL2Jvb2xzZWFyY2hcIik7XHJcbnZhciBleGNlcnB0PXJlcXVpcmUoXCIuL2V4Y2VycHRcIik7XHJcbnZhciBwYXJzZVRlcm0gPSBmdW5jdGlvbihlbmdpbmUscmF3LG9wdHMpIHtcclxuXHRpZiAoIXJhdykgcmV0dXJuO1xyXG5cdHZhciByZXM9e3JhdzpyYXcsdmFyaWFudHM6W10sdGVybTonJyxvcDonJ307XHJcblx0dmFyIHRlcm09cmF3LCBvcD0wO1xyXG5cdHZhciBmaXJzdGNoYXI9dGVybVswXTtcclxuXHR2YXIgdGVybXJlZ2V4PVwiXCI7XHJcblx0aWYgKGZpcnN0Y2hhcj09Jy0nKSB7XHJcblx0XHR0ZXJtPXRlcm0uc3Vic3RyaW5nKDEpO1xyXG5cdFx0Zmlyc3RjaGFyPXRlcm1bMF07XHJcblx0XHRyZXMuZXhjbHVkZT10cnVlOyAvL2V4Y2x1ZGVcclxuXHR9XHJcblx0dGVybT10ZXJtLnRyaW0oKTtcclxuXHR2YXIgbGFzdGNoYXI9dGVybVt0ZXJtLmxlbmd0aC0xXTtcclxuXHR0ZXJtPWVuZ2luZS5hbmFseXplci5ub3JtYWxpemUodGVybSk7XHJcblx0XHJcblx0aWYgKHRlcm0uaW5kZXhPZihcIiVcIik+LTEpIHtcclxuXHRcdHZhciB0ZXJtcmVnZXg9XCJeXCIrdGVybS5yZXBsYWNlKC8lKy9nLFwiLitcIikrXCIkXCI7XHJcblx0XHRpZiAoZmlyc3RjaGFyPT1cIiVcIikgXHR0ZXJtcmVnZXg9XCIuK1wiK3Rlcm1yZWdleC5zdWJzdHIoMSk7XHJcblx0XHRpZiAobGFzdGNoYXI9PVwiJVwiKSBcdHRlcm1yZWdleD10ZXJtcmVnZXguc3Vic3RyKDAsdGVybXJlZ2V4Lmxlbmd0aC0xKStcIi4rXCI7XHJcblx0fVxyXG5cclxuXHRpZiAodGVybXJlZ2V4KSB7XHJcblx0XHRyZXMudmFyaWFudHM9ZXhwYW5kVGVybShlbmdpbmUsdGVybXJlZ2V4KTtcclxuXHR9XHJcblxyXG5cdHJlcy5rZXk9dGVybTtcclxuXHRyZXR1cm4gcmVzO1xyXG59XHJcbnZhciBleHBhbmRUZXJtPWZ1bmN0aW9uKGVuZ2luZSxyZWdleCkge1xyXG5cdHZhciByPW5ldyBSZWdFeHAocmVnZXgpO1xyXG5cdHZhciB0b2tlbnM9ZW5naW5lLmdldChcInRva2Vuc1wiKTtcclxuXHR2YXIgcG9zdGluZ3NMZW5ndGg9ZW5naW5lLmdldChcInBvc3RpbmdzbGVuZ3RoXCIpO1xyXG5cdGlmICghcG9zdGluZ3NMZW5ndGgpIHBvc3RpbmdzTGVuZ3RoPVtdO1xyXG5cdHZhciBvdXQ9W107XHJcblx0Zm9yICh2YXIgaT0wO2k8dG9rZW5zLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBtPXRva2Vuc1tpXS5tYXRjaChyKTtcclxuXHRcdGlmIChtKSB7XHJcblx0XHRcdG91dC5wdXNoKFttWzBdLHBvc3RpbmdzTGVuZ3RoW2ldfHwxXSk7XHJcblx0XHR9XHJcblx0fVxyXG5cdG91dC5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xyXG5cdHJldHVybiBvdXQ7XHJcbn1cclxudmFyIGlzV2lsZGNhcmQ9ZnVuY3Rpb24ocmF3KSB7XHJcblx0cmV0dXJuICEhcmF3Lm1hdGNoKC9bXFwqXFw/XS8pO1xyXG59XHJcblxyXG52YXIgaXNPclRlcm09ZnVuY3Rpb24odGVybSkge1xyXG5cdHRlcm09dGVybS50cmltKCk7XHJcblx0cmV0dXJuICh0ZXJtW3Rlcm0ubGVuZ3RoLTFdPT09JywnKTtcclxufVxyXG52YXIgb3J0ZXJtPWZ1bmN0aW9uKGVuZ2luZSx0ZXJtLGtleSkge1xyXG5cdFx0dmFyIHQ9e3RleHQ6a2V5fTtcclxuXHRcdGlmIChlbmdpbmUuYW5hbHl6ZXIuc2ltcGxpZmllZFRva2VuKSB7XHJcblx0XHRcdHQuc2ltcGxpZmllZD1lbmdpbmUuYW5hbHl6ZXIuc2ltcGxpZmllZFRva2VuKGtleSk7XHJcblx0XHR9XHJcblx0XHR0ZXJtLnZhcmlhbnRzLnB1c2godCk7XHJcbn1cclxudmFyIG9yVGVybXM9ZnVuY3Rpb24oZW5naW5lLHRva2Vucyxub3cpIHtcclxuXHR2YXIgcmF3PXRva2Vuc1tub3ddO1xyXG5cdHZhciB0ZXJtPXBhcnNlVGVybShlbmdpbmUscmF3KTtcclxuXHRpZiAoIXRlcm0pIHJldHVybjtcclxuXHRvcnRlcm0oZW5naW5lLHRlcm0sdGVybS5rZXkpO1xyXG5cdHdoaWxlIChpc09yVGVybShyYXcpKSAge1xyXG5cdFx0cmF3PXRva2Vuc1srK25vd107XHJcblx0XHR2YXIgdGVybTI9cGFyc2VUZXJtKGVuZ2luZSxyYXcpO1xyXG5cdFx0b3J0ZXJtKGVuZ2luZSx0ZXJtLHRlcm0yLmtleSk7XHJcblx0XHRmb3IgKHZhciBpIGluIHRlcm0yLnZhcmlhbnRzKXtcclxuXHRcdFx0dGVybS52YXJpYW50c1tpXT10ZXJtMi52YXJpYW50c1tpXTtcclxuXHRcdH1cclxuXHRcdHRlcm0ua2V5Kz0nLCcrdGVybTIua2V5O1xyXG5cdH1cclxuXHRyZXR1cm4gdGVybTtcclxufVxyXG5cclxudmFyIGdldE9wZXJhdG9yPWZ1bmN0aW9uKHJhdykge1xyXG5cdHZhciBvcD0nJztcclxuXHRpZiAocmF3WzBdPT0nKycpIG9wPSdpbmNsdWRlJztcclxuXHRpZiAocmF3WzBdPT0nLScpIG9wPSdleGNsdWRlJztcclxuXHRyZXR1cm4gb3A7XHJcbn1cclxudmFyIHBhcnNlUGhyYXNlPWZ1bmN0aW9uKHEpIHtcclxuXHR2YXIgbWF0Y2g9cS5tYXRjaCgvKFwiLis/XCJ8Jy4rPyd8XFxTKykvZylcclxuXHRtYXRjaD1tYXRjaC5tYXAoZnVuY3Rpb24oc3RyKXtcclxuXHRcdHZhciBuPXN0ci5sZW5ndGgsIGg9c3RyLmNoYXJBdCgwKSwgdD1zdHIuY2hhckF0KG4tMSlcclxuXHRcdGlmIChoPT09dCYmKGg9PT0nXCInfGg9PT1cIidcIikpIHN0cj1zdHIuc3Vic3RyKDEsbi0yKVxyXG5cdFx0cmV0dXJuIHN0cjtcclxuXHR9KVxyXG5cdHJldHVybiBtYXRjaDtcclxufVxyXG52YXIgdGliZXRhbk51bWJlcj17XHJcblx0XCJcXHUwZjIwXCI6XCIwXCIsXCJcXHUwZjIxXCI6XCIxXCIsXCJcXHUwZjIyXCI6XCIyXCIsXHRcIlxcdTBmMjNcIjpcIjNcIixcdFwiXFx1MGYyNFwiOlwiNFwiLFxyXG5cdFwiXFx1MGYyNVwiOlwiNVwiLFwiXFx1MGYyNlwiOlwiNlwiLFwiXFx1MGYyN1wiOlwiN1wiLFwiXFx1MGYyOFwiOlwiOFwiLFwiXFx1MGYyOVwiOlwiOVwiXHJcbn1cclxudmFyIHBhcnNlTnVtYmVyPWZ1bmN0aW9uKHJhdykge1xyXG5cdHZhciBuPXBhcnNlSW50KHJhdywxMCk7XHJcblx0aWYgKGlzTmFOKG4pKXtcclxuXHRcdHZhciBjb252ZXJ0ZWQ9W107XHJcblx0XHRmb3IgKHZhciBpPTA7aTxyYXcubGVuZ3RoO2krKykge1xyXG5cdFx0XHR2YXIgbm49dGliZXRhbk51bWJlcltyYXdbaV1dO1xyXG5cdFx0XHRpZiAodHlwZW9mIG5uICE9XCJ1bmRlZmluZWRcIikgY29udmVydGVkW2ldPW5uO1xyXG5cdFx0XHRlbHNlIGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHBhcnNlSW50KGNvbnZlcnRlZCwxMCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJldHVybiBuO1xyXG5cdH1cclxufVxyXG52YXIgcGFyc2VXaWxkY2FyZD1mdW5jdGlvbihyYXcpIHtcclxuXHR2YXIgbj1wYXJzZU51bWJlcihyYXcpIHx8IDE7XHJcblx0dmFyIHFjb3VudD1yYXcuc3BsaXQoJz8nKS5sZW5ndGgtMTtcclxuXHR2YXIgc2NvdW50PXJhdy5zcGxpdCgnKicpLmxlbmd0aC0xO1xyXG5cdHZhciB0eXBlPScnO1xyXG5cdGlmIChxY291bnQpIHR5cGU9Jz8nO1xyXG5cdGVsc2UgaWYgKHNjb3VudCkgdHlwZT0nKic7XHJcblx0cmV0dXJuIHt3aWxkY2FyZDp0eXBlLCB3aWR0aDogbiAsIG9wOid3aWxkY2FyZCd9O1xyXG59XHJcblxyXG52YXIgbmV3UGhyYXNlPWZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB7dGVybWlkOltdLHBvc3Rpbmc6W10scmF3OicnLHRlcm1sZW5ndGg6W119O1xyXG59IFxyXG52YXIgcGFyc2VRdWVyeT1mdW5jdGlvbihxLHNlcCkge1xyXG5cdGlmIChzZXAgJiYgcS5pbmRleE9mKHNlcCk+LTEpIHtcclxuXHRcdHZhciBtYXRjaD1xLnNwbGl0KHNlcCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdHZhciBtYXRjaD1xLm1hdGNoKC8oXCIuKz9cInwnLis/J3xcXFMrKS9nKVxyXG5cdFx0bWF0Y2g9bWF0Y2gubWFwKGZ1bmN0aW9uKHN0cil7XHJcblx0XHRcdHZhciBuPXN0ci5sZW5ndGgsIGg9c3RyLmNoYXJBdCgwKSwgdD1zdHIuY2hhckF0KG4tMSlcclxuXHRcdFx0aWYgKGg9PT10JiYoaD09PSdcIid8aD09PVwiJ1wiKSkgc3RyPXN0ci5zdWJzdHIoMSxuLTIpXHJcblx0XHRcdHJldHVybiBzdHJcclxuXHRcdH0pXHJcblx0XHQvL2NvbnNvbGUubG9nKGlucHV0LCc9PT4nLG1hdGNoKVx0XHRcclxuXHR9XHJcblx0cmV0dXJuIG1hdGNoO1xyXG59XHJcbnZhciBsb2FkUGhyYXNlPWZ1bmN0aW9uKHBocmFzZSkge1xyXG5cdC8qIHJlbW92ZSBsZWFkaW5nIGFuZCBlbmRpbmcgd2lsZGNhcmQgKi9cclxuXHR2YXIgUT10aGlzO1xyXG5cdHZhciBjYWNoZT1RLmVuZ2luZS5wb3N0aW5nQ2FjaGU7XHJcblx0aWYgKGNhY2hlW3BocmFzZS5rZXldKSB7XHJcblx0XHRwaHJhc2UucG9zdGluZz1jYWNoZVtwaHJhc2Uua2V5XTtcclxuXHRcdHJldHVybiBRO1xyXG5cdH1cclxuXHRpZiAocGhyYXNlLnRlcm1pZC5sZW5ndGg9PTEpIHtcclxuXHRcdGlmICghUS50ZXJtcy5sZW5ndGgpe1xyXG5cdFx0XHRwaHJhc2UucG9zdGluZz1bXTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGNhY2hlW3BocmFzZS5rZXldPXBocmFzZS5wb3N0aW5nPVEudGVybXNbcGhyYXNlLnRlcm1pZFswXV0ucG9zdGluZztcdFxyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIFE7XHJcblx0fVxyXG5cclxuXHR2YXIgaT0wLCByPVtdLGRpcz0wO1xyXG5cdHdoaWxlKGk8cGhyYXNlLnRlcm1pZC5sZW5ndGgpIHtcclxuXHQgIHZhciBUPVEudGVybXNbcGhyYXNlLnRlcm1pZFtpXV07XHJcblx0XHRpZiAoMCA9PT0gaSkge1xyXG5cdFx0XHRyID0gVC5wb3N0aW5nO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdCAgICBpZiAoVC5vcD09J3dpbGRjYXJkJykge1xyXG5cdFx0ICAgIFx0VD1RLnRlcm1zW3BocmFzZS50ZXJtaWRbaSsrXV07XHJcblx0XHQgICAgXHR2YXIgd2lkdGg9VC53aWR0aDtcclxuXHRcdCAgICBcdHZhciB3aWxkY2FyZD1ULndpbGRjYXJkO1xyXG5cdFx0ICAgIFx0VD1RLnRlcm1zW3BocmFzZS50ZXJtaWRbaV1dO1xyXG5cdFx0ICAgIFx0dmFyIG1pbmRpcz1kaXM7XHJcblx0XHQgICAgXHRpZiAod2lsZGNhcmQ9PSc/JykgbWluZGlzPWRpcyt3aWR0aDtcclxuXHRcdCAgICBcdGlmIChULmV4Y2x1ZGUpIHIgPSBwbGlzdC5wbG5vdGZvbGxvdzIociwgVC5wb3N0aW5nLCBtaW5kaXMsIGRpcyt3aWR0aCk7XHJcblx0XHQgICAgXHRlbHNlIHIgPSBwbGlzdC5wbGZvbGxvdzIociwgVC5wb3N0aW5nLCBtaW5kaXMsIGRpcyt3aWR0aCk7XHRcdCAgICBcdFxyXG5cdFx0ICAgIFx0ZGlzKz0od2lkdGgtMSk7XHJcblx0XHQgICAgfWVsc2Uge1xyXG5cdFx0ICAgIFx0aWYgKFQucG9zdGluZykge1xyXG5cdFx0ICAgIFx0XHRpZiAoVC5leGNsdWRlKSByID0gcGxpc3QucGxub3Rmb2xsb3cociwgVC5wb3N0aW5nLCBkaXMpO1xyXG5cdFx0ICAgIFx0XHRlbHNlIHIgPSBwbGlzdC5wbGZvbGxvdyhyLCBULnBvc3RpbmcsIGRpcyk7XHJcblx0XHQgICAgXHR9XHJcblx0XHQgICAgfVxyXG5cdFx0fVxyXG5cdFx0ZGlzICs9IHBocmFzZS50ZXJtbGVuZ3RoW2ldO1xyXG5cdFx0aSsrO1xyXG5cdFx0aWYgKCFyKSByZXR1cm4gUTtcclxuICB9XHJcbiAgcGhyYXNlLnBvc3Rpbmc9cjtcclxuICBjYWNoZVtwaHJhc2Uua2V5XT1yO1xyXG4gIHJldHVybiBRO1xyXG59XHJcbnZhciB0cmltU3BhY2U9ZnVuY3Rpb24oZW5naW5lLHF1ZXJ5KSB7XHJcblx0aWYgKCFxdWVyeSkgcmV0dXJuIFwiXCI7XHJcblx0dmFyIGk9MDtcclxuXHR2YXIgaXNTa2lwPWVuZ2luZS5hbmFseXplci5pc1NraXA7XHJcblx0d2hpbGUgKGlzU2tpcChxdWVyeVtpXSkgJiYgaTxxdWVyeS5sZW5ndGgpIGkrKztcclxuXHRyZXR1cm4gcXVlcnkuc3Vic3RyaW5nKGkpO1xyXG59XHJcbnZhciBnZXRTZWdXaXRoSGl0PWZ1bmN0aW9uKGZpbGVpZCxvZmZzZXRzKSB7XHJcblx0dmFyIFE9dGhpcyxlbmdpbmU9US5lbmdpbmU7XHJcblx0dmFyIHNlZ1dpdGhIaXQ9cGxpc3QuZ3JvdXBieXBvc3RpbmcyKFEuYnlGaWxlW2ZpbGVpZCBdLCBvZmZzZXRzKTtcclxuXHRpZiAoc2VnV2l0aEhpdC5sZW5ndGgpIHNlZ1dpdGhIaXQuc2hpZnQoKTsgLy90aGUgZmlyc3QgaXRlbSBpcyBub3QgdXNlZCAoMH5RLmJ5RmlsZVswXSApXHJcblx0dmFyIG91dD1bXTtcclxuXHRzZWdXaXRoSGl0Lm1hcChmdW5jdGlvbihwLGlkeCl7aWYgKHAubGVuZ3RoKSBvdXQucHVzaChpZHgpfSk7XHJcblx0cmV0dXJuIG91dDtcclxufVxyXG52YXIgc2VnV2l0aEhpdD1mdW5jdGlvbihmaWxlaWQpIHtcclxuXHR2YXIgUT10aGlzLGVuZ2luZT1RLmVuZ2luZTtcclxuXHR2YXIgb2Zmc2V0cz1lbmdpbmUuZ2V0RmlsZVNlZ09mZnNldHMoZmlsZWlkKTtcclxuXHRyZXR1cm4gZ2V0U2VnV2l0aEhpdC5hcHBseSh0aGlzLFtmaWxlaWQsb2Zmc2V0c10pO1xyXG59XHJcbnZhciBpc1NpbXBsZVBocmFzZT1mdW5jdGlvbihwaHJhc2UpIHtcclxuXHR2YXIgbT1waHJhc2UubWF0Y2goL1tcXD8lXl0vKTtcclxuXHRyZXR1cm4gIW07XHJcbn1cclxuXHJcbi8vIOeZvOiPqeaPkOW/gyAgID09PiDnmbzoj6kgIOaPkOW/gyAgICAgICAyIDIgICBcclxuLy8g6I+p5o+Q5b+DICAgICA9PT4g6I+p5o+QICDmj5Dlv4MgICAgICAgMSAyXHJcbi8vIOWKq+WKqyAgICAgICA9PT4g5YqrICAgIOWKqyAgICAgICAgIDEgMSAgIC8vIGludmFsaWRcclxuLy8g5Zug57ej5omA55Sf6YGTICA9PT4g5Zug57ejICDmiYDnlJ8gICDpgZMgICAyIDIgMVxyXG52YXIgc3BsaXRQaHJhc2U9ZnVuY3Rpb24oZW5naW5lLHNpbXBsZXBocmFzZSxiaWdyYW0pIHtcclxuXHR2YXIgYmlncmFtPWJpZ3JhbXx8ZW5naW5lLmdldChcIm1ldGFcIikuYmlncmFtfHxbXTtcclxuXHR2YXIgdG9rZW5zPWVuZ2luZS5hbmFseXplci50b2tlbml6ZShzaW1wbGVwaHJhc2UpLnRva2VucztcclxuXHR2YXIgbG9hZHRva2Vucz1bXSxsZW5ndGhzPVtdLGo9MCxsYXN0YmlncmFtcG9zPS0xO1xyXG5cdHdoaWxlIChqKzE8dG9rZW5zLmxlbmd0aCkge1xyXG5cdFx0dmFyIHRva2VuPWVuZ2luZS5hbmFseXplci5ub3JtYWxpemUodG9rZW5zW2pdKTtcclxuXHRcdHZhciBuZXh0dG9rZW49ZW5naW5lLmFuYWx5emVyLm5vcm1hbGl6ZSh0b2tlbnNbaisxXSk7XHJcblx0XHR2YXIgYmk9dG9rZW4rbmV4dHRva2VuO1xyXG5cdFx0dmFyIGk9cGxpc3QuaW5kZXhPZlNvcnRlZChiaWdyYW0sYmkpO1xyXG5cdFx0aWYgKGJpZ3JhbVtpXT09YmkpIHtcclxuXHRcdFx0bG9hZHRva2Vucy5wdXNoKGJpKTtcclxuXHRcdFx0aWYgKGorMzx0b2tlbnMubGVuZ3RoKSB7XHJcblx0XHRcdFx0bGFzdGJpZ3JhbXBvcz1qO1xyXG5cdFx0XHRcdGorKztcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRpZiAoaisyPT10b2tlbnMubGVuZ3RoKXsgXHJcblx0XHRcdFx0XHRpZiAobGFzdGJpZ3JhbXBvcysxPT1qICkge1xyXG5cdFx0XHRcdFx0XHRsZW5ndGhzW2xlbmd0aHMubGVuZ3RoLTFdLS07XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRsYXN0YmlncmFtcG9zPWo7XHJcblx0XHRcdFx0XHRqKys7XHJcblx0XHRcdFx0fWVsc2Uge1xyXG5cdFx0XHRcdFx0bGFzdGJpZ3JhbXBvcz1qO1x0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHRcdGxlbmd0aHMucHVzaCgyKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICghYmlncmFtIHx8IGxhc3RiaWdyYW1wb3M9PS0xIHx8IGxhc3RiaWdyYW1wb3MrMSE9aikge1xyXG5cdFx0XHRcdGxvYWR0b2tlbnMucHVzaCh0b2tlbik7XHJcblx0XHRcdFx0bGVuZ3Rocy5wdXNoKDEpO1x0XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGorKztcclxuXHR9XHJcblxyXG5cdHdoaWxlIChqPHRva2Vucy5sZW5ndGgpIHtcclxuXHRcdHZhciB0b2tlbj1lbmdpbmUuYW5hbHl6ZXIubm9ybWFsaXplKHRva2Vuc1tqXSk7XHJcblx0XHRsb2FkdG9rZW5zLnB1c2godG9rZW4pO1xyXG5cdFx0bGVuZ3Rocy5wdXNoKDEpO1xyXG5cdFx0aisrO1xyXG5cdH1cclxuXHJcblx0cmV0dXJuIHt0b2tlbnM6bG9hZHRva2VucywgbGVuZ3RoczogbGVuZ3RocyAsIHRva2VubGVuZ3RoOiB0b2tlbnMubGVuZ3RofTtcclxufVxyXG4vKiBob3N0IGhhcyBmYXN0IG5hdGl2ZSBmdW5jdGlvbiAqL1xyXG52YXIgZmFzdFBocmFzZT1mdW5jdGlvbihlbmdpbmUscGhyYXNlKSB7XHJcblx0dmFyIHBocmFzZV90ZXJtPW5ld1BocmFzZSgpO1xyXG5cdC8vdmFyIHRva2Vucz1lbmdpbmUuYW5hbHl6ZXIudG9rZW5pemUocGhyYXNlKS50b2tlbnM7XHJcblx0dmFyIHNwbGl0dGVkPXNwbGl0UGhyYXNlKGVuZ2luZSxwaHJhc2UpO1xyXG5cclxuXHR2YXIgcGF0aHM9cG9zdGluZ1BhdGhGcm9tVG9rZW5zKGVuZ2luZSxzcGxpdHRlZC50b2tlbnMpO1xyXG4vL2NyZWF0ZSB3aWxkY2FyZFxyXG5cclxuXHRwaHJhc2VfdGVybS53aWR0aD1zcGxpdHRlZC50b2tlbmxlbmd0aDsgLy9mb3IgZXhjZXJwdC5qcyB0byBnZXRQaHJhc2VXaWR0aFxyXG5cclxuXHRlbmdpbmUuZ2V0KHBhdGhzLHthZGRyZXNzOnRydWV9LGZ1bmN0aW9uKHBvc3RpbmdBZGRyZXNzKXsgLy90aGlzIGlzIHN5bmNcclxuXHRcdHBocmFzZV90ZXJtLmtleT1waHJhc2U7XHJcblx0XHR2YXIgcG9zdGluZ0FkZHJlc3NXaXRoV2lsZGNhcmQ9W107XHJcblx0XHRmb3IgKHZhciBpPTA7aTxwb3N0aW5nQWRkcmVzcy5sZW5ndGg7aSsrKSB7XHJcblx0XHRcdHBvc3RpbmdBZGRyZXNzV2l0aFdpbGRjYXJkLnB1c2gocG9zdGluZ0FkZHJlc3NbaV0pO1xyXG5cdFx0XHRpZiAoc3BsaXR0ZWQubGVuZ3Roc1tpXT4xKSB7XHJcblx0XHRcdFx0cG9zdGluZ0FkZHJlc3NXaXRoV2lsZGNhcmQucHVzaChbc3BsaXR0ZWQubGVuZ3Roc1tpXSwwXSk7IC8vd2lsZGNhcmQgaGFzIGJsb2Nrc2l6ZT09MCBcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0ZW5naW5lLnBvc3RpbmdDYWNoZVtwaHJhc2VdPWVuZ2luZS5tZXJnZVBvc3RpbmdzKHBvc3RpbmdBZGRyZXNzV2l0aFdpbGRjYXJkKTtcclxuXHR9KTtcclxuXHRyZXR1cm4gcGhyYXNlX3Rlcm07XHJcblx0Ly8gcHV0IHBvc3RpbmcgaW50byBjYWNoZVtwaHJhc2Uua2V5XVxyXG59XHJcbnZhciBzbG93UGhyYXNlPWZ1bmN0aW9uKGVuZ2luZSx0ZXJtcyxwaHJhc2UpIHtcclxuXHR2YXIgaj0wLHRva2Vucz1lbmdpbmUuYW5hbHl6ZXIudG9rZW5pemUocGhyYXNlKS50b2tlbnM7XHJcblx0dmFyIHBocmFzZV90ZXJtPW5ld1BocmFzZSgpO1xyXG5cdHZhciB0ZXJtaWQ9MDtcclxuXHR3aGlsZSAoajx0b2tlbnMubGVuZ3RoKSB7XHJcblx0XHR2YXIgcmF3PXRva2Vuc1tqXSwgdGVybWxlbmd0aD0xO1xyXG5cdFx0aWYgKGlzV2lsZGNhcmQocmF3KSkge1xyXG5cdFx0XHRpZiAocGhyYXNlX3Rlcm0udGVybWlkLmxlbmd0aD09MCkgIHsgLy9za2lwIGxlYWRpbmcgd2lsZCBjYXJkXHJcblx0XHRcdFx0aisrXHJcblx0XHRcdFx0Y29udGludWU7XHJcblx0XHRcdH1cclxuXHRcdFx0dGVybXMucHVzaChwYXJzZVdpbGRjYXJkKHJhdykpO1xyXG5cdFx0XHR0ZXJtaWQ9dGVybXMubGVuZ3RoLTE7XHJcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1pZC5wdXNoKHRlcm1pZCk7XHJcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1sZW5ndGgucHVzaCh0ZXJtbGVuZ3RoKTtcclxuXHRcdH0gZWxzZSBpZiAoaXNPclRlcm0ocmF3KSl7XHJcblx0XHRcdHZhciB0ZXJtPW9yVGVybXMuYXBwbHkodGhpcyxbdG9rZW5zLGpdKTtcclxuXHRcdFx0aWYgKHRlcm0pIHtcclxuXHRcdFx0XHR0ZXJtcy5wdXNoKHRlcm0pO1xyXG5cdFx0XHRcdHRlcm1pZD10ZXJtcy5sZW5ndGgtMTtcclxuXHRcdFx0XHRqKz10ZXJtLmtleS5zcGxpdCgnLCcpLmxlbmd0aC0xO1x0XHRcdFx0XHRcclxuXHRcdFx0fVxyXG5cdFx0XHRqKys7XHJcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1pZC5wdXNoKHRlcm1pZCk7XHJcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1sZW5ndGgucHVzaCh0ZXJtbGVuZ3RoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHZhciBwaHJhc2U9XCJcIjtcclxuXHRcdFx0d2hpbGUgKGo8dG9rZW5zLmxlbmd0aCkge1xyXG5cdFx0XHRcdGlmICghKGlzV2lsZGNhcmQodG9rZW5zW2pdKSB8fCBpc09yVGVybSh0b2tlbnNbal0pKSkge1xyXG5cdFx0XHRcdFx0cGhyYXNlKz10b2tlbnNbal07XHJcblx0XHRcdFx0XHRqKys7XHJcblx0XHRcdFx0fSBlbHNlIGJyZWFrO1xyXG5cdFx0XHR9XHJcblxyXG5cdFx0XHR2YXIgc3BsaXR0ZWQ9c3BsaXRQaHJhc2UoZW5naW5lLHBocmFzZSk7XHJcblx0XHRcdGZvciAodmFyIGk9MDtpPHNwbGl0dGVkLnRva2Vucy5sZW5ndGg7aSsrKSB7XHJcblxyXG5cdFx0XHRcdHZhciB0ZXJtPXBhcnNlVGVybShlbmdpbmUsc3BsaXR0ZWQudG9rZW5zW2ldKTtcclxuXHRcdFx0XHR2YXIgdGVybWlkeD10ZXJtcy5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEua2V5fSkuaW5kZXhPZih0ZXJtLmtleSk7XHJcblx0XHRcdFx0aWYgKHRlcm1pZHg9PS0xKSB7XHJcblx0XHRcdFx0XHR0ZXJtcy5wdXNoKHRlcm0pO1xyXG5cdFx0XHRcdFx0dGVybWlkPXRlcm1zLmxlbmd0aC0xO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0ZXJtaWQ9dGVybWlkeDtcclxuXHRcdFx0XHR9XHRcdFx0XHRcclxuXHRcdFx0XHRwaHJhc2VfdGVybS50ZXJtaWQucHVzaCh0ZXJtaWQpO1xyXG5cdFx0XHRcdHBocmFzZV90ZXJtLnRlcm1sZW5ndGgucHVzaChzcGxpdHRlZC5sZW5ndGhzW2ldKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0aisrO1xyXG5cdH1cclxuXHRwaHJhc2VfdGVybS5rZXk9cGhyYXNlO1xyXG5cdC8vcmVtb3ZlIGVuZGluZyB3aWxkY2FyZFxyXG5cdHZhciBQPXBocmFzZV90ZXJtICwgVD1udWxsO1xyXG5cdGRvIHtcclxuXHRcdFQ9dGVybXNbUC50ZXJtaWRbUC50ZXJtaWQubGVuZ3RoLTFdXTtcclxuXHRcdGlmICghVCkgYnJlYWs7XHJcblx0XHRpZiAoVC53aWxkY2FyZCkgUC50ZXJtaWQucG9wKCk7IGVsc2UgYnJlYWs7XHJcblx0fSB3aGlsZShUKTtcdFx0XHJcblx0cmV0dXJuIHBocmFzZV90ZXJtO1xyXG59XHJcbnZhciBuZXdRdWVyeSA9ZnVuY3Rpb24oZW5naW5lLHF1ZXJ5LG9wdHMpIHtcclxuXHQvL2lmICghcXVlcnkpIHJldHVybjtcclxuXHRvcHRzPW9wdHN8fHt9O1xyXG5cdHF1ZXJ5PXRyaW1TcGFjZShlbmdpbmUscXVlcnkpO1xyXG5cclxuXHR2YXIgcGhyYXNlcz1xdWVyeSxwaHJhc2VzPVtdO1xyXG5cdGlmICh0eXBlb2YgcXVlcnk9PSdzdHJpbmcnICYmIHF1ZXJ5KSB7XHJcblx0XHRwaHJhc2VzPXBhcnNlUXVlcnkocXVlcnksb3B0cy5waHJhc2Vfc2VwIHx8IFwiXCIpO1xyXG5cdH1cclxuXHRcclxuXHR2YXIgcGhyYXNlX3Rlcm1zPVtdLCB0ZXJtcz1bXSx2YXJpYW50cz1bXSxvcGVyYXRvcnM9W107XHJcblx0dmFyIHBjPTA7Ly9waHJhc2UgY291bnRcclxuXHRmb3IgICh2YXIgaT0wO2k8cGhyYXNlcy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgb3A9Z2V0T3BlcmF0b3IocGhyYXNlc1twY10pO1xyXG5cdFx0aWYgKG9wKSBwaHJhc2VzW3BjXT1waHJhc2VzW3BjXS5zdWJzdHJpbmcoMSk7XHJcblxyXG5cdFx0LyogYXV0byBhZGQgKyBmb3IgbmF0dXJhbCBvcmRlciA/Ki9cclxuXHRcdC8vaWYgKCFvcHRzLnJhbmsgJiYgb3AhPSdleGNsdWRlJyAmJmkpIG9wPSdpbmNsdWRlJztcclxuXHRcdG9wZXJhdG9ycy5wdXNoKG9wKTtcclxuXHJcblx0XHRpZiAoaXNTaW1wbGVQaHJhc2UocGhyYXNlc1twY10pICYmIGVuZ2luZS5tZXJnZVBvc3RpbmdzICkge1xyXG5cdFx0XHR2YXIgcGhyYXNlX3Rlcm09ZmFzdFBocmFzZShlbmdpbmUscGhyYXNlc1twY10pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0dmFyIHBocmFzZV90ZXJtPXNsb3dQaHJhc2UoZW5naW5lLHRlcm1zLHBocmFzZXNbcGNdKTtcclxuXHRcdH1cclxuXHRcdHBocmFzZV90ZXJtcy5wdXNoKHBocmFzZV90ZXJtKTtcclxuXHJcblx0XHRpZiAoIWVuZ2luZS5tZXJnZVBvc3RpbmdzICYmIHBocmFzZV90ZXJtc1twY10udGVybWlkLmxlbmd0aD09MCkge1xyXG5cdFx0XHRwaHJhc2VfdGVybXMucG9wKCk7XHJcblx0XHR9IGVsc2UgcGMrKztcclxuXHR9XHJcblx0b3B0cy5vcD1vcGVyYXRvcnM7XHJcblxyXG5cdHZhciBRPXtkYm5hbWU6ZW5naW5lLmRibmFtZSxlbmdpbmU6ZW5naW5lLG9wdHM6b3B0cyxxdWVyeTpxdWVyeSxcclxuXHRcdHBocmFzZXM6cGhyYXNlX3Rlcm1zLHRlcm1zOnRlcm1zXHJcblx0fTtcclxuXHRRLnRva2VuaXplPWZ1bmN0aW9uKCkge3JldHVybiBlbmdpbmUuYW5hbHl6ZXIudG9rZW5pemUuYXBwbHkoZW5naW5lLGFyZ3VtZW50cyk7fVxyXG5cdFEuaXNTa2lwPWZ1bmN0aW9uKCkge3JldHVybiBlbmdpbmUuYW5hbHl6ZXIuaXNTa2lwLmFwcGx5KGVuZ2luZSxhcmd1bWVudHMpO31cclxuXHRRLm5vcm1hbGl6ZT1mdW5jdGlvbigpIHtyZXR1cm4gZW5naW5lLmFuYWx5emVyLm5vcm1hbGl6ZS5hcHBseShlbmdpbmUsYXJndW1lbnRzKTt9XHJcblx0US5zZWdXaXRoSGl0PXNlZ1dpdGhIaXQ7XHJcblxyXG5cdC8vUS5nZXRSYW5nZT1mdW5jdGlvbigpIHtyZXR1cm4gdGhhdC5nZXRSYW5nZS5hcHBseSh0aGF0LGFyZ3VtZW50cyl9O1xyXG5cdC8vQVBJLnF1ZXJ5aWQ9J1EnKyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTAwMDAwMDApKS50b1N0cmluZygxNik7XHJcblx0cmV0dXJuIFE7XHJcbn1cclxudmFyIHBvc3RpbmdQYXRoRnJvbVRva2Vucz1mdW5jdGlvbihlbmdpbmUsdG9rZW5zKSB7XHJcblx0dmFyIGFsbHRva2Vucz1lbmdpbmUuZ2V0KFwidG9rZW5zXCIpO1xyXG5cclxuXHR2YXIgdG9rZW5JZHM9dG9rZW5zLm1hcChmdW5jdGlvbih0KXsgcmV0dXJuIDErYWxsdG9rZW5zLmluZGV4T2YodCl9KTtcclxuXHR2YXIgcG9zdGluZ2lkPVtdO1xyXG5cdGZvciAodmFyIGk9MDtpPHRva2VuSWRzLmxlbmd0aDtpKyspIHtcclxuXHRcdHBvc3RpbmdpZC5wdXNoKCB0b2tlbklkc1tpXSk7IC8vIHRva2VuSWQ9PTAgLCBlbXB0eSB0b2tlblxyXG5cdH1cclxuXHRyZXR1cm4gcG9zdGluZ2lkLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gW1wicG9zdGluZ3NcIix0XX0pO1xyXG59XHJcbnZhciBsb2FkUG9zdGluZ3M9ZnVuY3Rpb24oZW5naW5lLHRva2VucyxjYikge1xyXG5cdHZhciB0b2xvYWR0b2tlbnM9dG9rZW5zLmZpbHRlcihmdW5jdGlvbih0KXtcclxuXHRcdHJldHVybiAhZW5naW5lLnBvc3RpbmdDYWNoZVt0LmtleV07IC8vYWxyZWFkeSBpbiBjYWNoZVxyXG5cdH0pO1xyXG5cdGlmICh0b2xvYWR0b2tlbnMubGVuZ3RoPT0wKSB7XHJcblx0XHRjYigpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHR2YXIgcG9zdGluZ1BhdGhzPXBvc3RpbmdQYXRoRnJvbVRva2VucyhlbmdpbmUsdG9rZW5zLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5rZXl9KSk7XHJcblx0ZW5naW5lLmdldChwb3N0aW5nUGF0aHMsZnVuY3Rpb24ocG9zdGluZ3Mpe1xyXG5cdFx0cG9zdGluZ3MubWFwKGZ1bmN0aW9uKHAsaSkgeyB0b2tlbnNbaV0ucG9zdGluZz1wIH0pO1xyXG5cdFx0aWYgKGNiKSBjYigpO1xyXG5cdH0pO1xyXG59XHJcbnZhciBncm91cEJ5PWZ1bmN0aW9uKFEscG9zdGluZykge1xyXG5cdHBocmFzZXMuZm9yRWFjaChmdW5jdGlvbihQKXtcclxuXHRcdHZhciBrZXk9UC5rZXk7XHJcblx0XHR2YXIgZG9jZnJlcT1kb2NmcmVxY2FjaGVba2V5XTtcclxuXHRcdGlmICghZG9jZnJlcSkgZG9jZnJlcT1kb2NmcmVxY2FjaGVba2V5XT17fTtcclxuXHRcdGlmICghZG9jZnJlcVt0aGF0Lmdyb3VwdW5pdF0pIHtcclxuXHRcdFx0ZG9jZnJlcVt0aGF0Lmdyb3VwdW5pdF09e2RvY2xpc3Q6bnVsbCxmcmVxOm51bGx9O1xyXG5cdFx0fVx0XHRcclxuXHRcdGlmIChQLnBvc3RpbmcpIHtcclxuXHRcdFx0dmFyIHJlcz1tYXRjaFBvc3RpbmcoZW5naW5lLFAucG9zdGluZyk7XHJcblx0XHRcdFAuZnJlcT1yZXMuZnJlcTtcclxuXHRcdFx0UC5kb2NzPXJlcy5kb2NzO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0UC5kb2NzPVtdO1xyXG5cdFx0XHRQLmZyZXE9W107XHJcblx0XHR9XHJcblx0XHRkb2NmcmVxW3RoYXQuZ3JvdXB1bml0XT17ZG9jbGlzdDpQLmRvY3MsZnJlcTpQLmZyZXF9O1xyXG5cdH0pO1xyXG5cdHJldHVybiB0aGlzO1xyXG59XHJcbnZhciBncm91cEJ5Rm9sZGVyPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaGl0cykge1xyXG5cdHZhciBmaWxlcz1lbmdpbmUuZ2V0KFwiZmlsZW5hbWVzXCIpO1xyXG5cdHZhciBwcmV2Zm9sZGVyPVwiXCIsaGl0cz0wLG91dD1bXTtcclxuXHRmb3IgKHZhciBpPTA7aTxmaWxlaGl0cy5sZW5ndGg7aSsrKSB7XHJcblx0XHR2YXIgZm49ZmlsZXNbaV07XHJcblx0XHR2YXIgZm9sZGVyPWZuLnN1YnN0cmluZygwLGZuLmluZGV4T2YoJy8nKSk7XHJcblx0XHRpZiAocHJldmZvbGRlciAmJiBwcmV2Zm9sZGVyIT1mb2xkZXIpIHtcclxuXHRcdFx0b3V0LnB1c2goaGl0cyk7XHJcblx0XHRcdGhpdHM9MDtcclxuXHRcdH1cclxuXHRcdGhpdHMrPWZpbGVoaXRzW2ldLmxlbmd0aDtcclxuXHRcdHByZXZmb2xkZXI9Zm9sZGVyO1xyXG5cdH1cclxuXHRvdXQucHVzaChoaXRzKTtcclxuXHRyZXR1cm4gb3V0O1xyXG59XHJcbnZhciBwaHJhc2VfaW50ZXJzZWN0PWZ1bmN0aW9uKGVuZ2luZSxRKSB7XHJcblx0dmFyIGludGVyc2VjdGVkPW51bGw7XHJcblx0dmFyIGZpbGVvZmZzZXRzPVEuZW5naW5lLmdldChcImZpbGVvZmZzZXRzXCIpO1xyXG5cdHZhciBlbXB0eT1bXSxlbXB0eWNvdW50PTAsaGFzaGl0PTA7XHJcblx0Zm9yICh2YXIgaT0wO2k8US5waHJhc2VzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciBieWZpbGU9cGxpc3QuZ3JvdXBieXBvc3RpbmcyKFEucGhyYXNlc1tpXS5wb3N0aW5nLGZpbGVvZmZzZXRzKTtcclxuXHRcdGlmIChieWZpbGUubGVuZ3RoKSBieWZpbGUuc2hpZnQoKTtcclxuXHRcdGlmIChieWZpbGUubGVuZ3RoKSBieWZpbGUucG9wKCk7XHJcblx0XHRieWZpbGUucG9wKCk7XHJcblx0XHRpZiAoaW50ZXJzZWN0ZWQ9PW51bGwpIHtcclxuXHRcdFx0aW50ZXJzZWN0ZWQ9YnlmaWxlO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Zm9yICh2YXIgaj0wO2o8YnlmaWxlLmxlbmd0aDtqKyspIHtcclxuXHRcdFx0XHRpZiAoIShieWZpbGVbal0ubGVuZ3RoICYmIGludGVyc2VjdGVkW2pdLmxlbmd0aCkpIHtcclxuXHRcdFx0XHRcdGludGVyc2VjdGVkW2pdPWVtcHR5OyAvL3JldXNlIGVtcHR5IGFycmF5XHJcblx0XHRcdFx0XHRlbXB0eWNvdW50Kys7XHJcblx0XHRcdFx0fSBlbHNlIGhhc2hpdCsrO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRRLmJ5RmlsZT1pbnRlcnNlY3RlZDtcclxuXHRRLmJ5Rm9sZGVyPWdyb3VwQnlGb2xkZXIoZW5naW5lLFEuYnlGaWxlKTtcclxuXHR2YXIgb3V0PVtdO1xyXG5cdC8vY2FsY3VsYXRlIG5ldyByYXdwb3N0aW5nXHJcblx0Zm9yICh2YXIgaT0wO2k8US5ieUZpbGUubGVuZ3RoO2krKykge1xyXG5cdFx0aWYgKFEuYnlGaWxlW2ldLmxlbmd0aCkgb3V0PW91dC5jb25jYXQoUS5ieUZpbGVbaV0pO1xyXG5cdH1cclxuXHRRLnJhd3Jlc3VsdD1vdXQ7XHJcblx0Y291bnRGb2xkZXJGaWxlKFEpO1xyXG59XHJcbnZhciBjb3VudEZvbGRlckZpbGU9ZnVuY3Rpb24oUSkge1xyXG5cdFEuZmlsZVdpdGhIaXRDb3VudD0wO1xyXG5cdFEuYnlGaWxlLm1hcChmdW5jdGlvbihmKXtpZiAoZi5sZW5ndGgpIFEuZmlsZVdpdGhIaXRDb3VudCsrfSk7XHJcblx0XHRcdFxyXG5cdFEuZm9sZGVyV2l0aEhpdENvdW50PTA7XHJcblx0US5ieUZvbGRlci5tYXAoZnVuY3Rpb24oZil7aWYgKGYpIFEuZm9sZGVyV2l0aEhpdENvdW50Kyt9KTtcclxufVxyXG5cclxudmFyIG1haW49ZnVuY3Rpb24oZW5naW5lLHEsb3B0cyxjYil7XHJcblx0dmFyIHN0YXJ0dGltZT1uZXcgRGF0ZSgpO1xyXG5cdHZhciBtZXRhPWVuZ2luZS5nZXQoXCJtZXRhXCIpO1xyXG5cdGlmIChtZXRhLm5vcm1hbGl6ZSAmJiBlbmdpbmUuYW5hbHl6ZXIuc2V0Tm9ybWFsaXplVGFibGUpIHtcclxuXHRcdG1ldGEubm9ybWFsaXplT2JqPWVuZ2luZS5hbmFseXplci5zZXROb3JtYWxpemVUYWJsZShtZXRhLm5vcm1hbGl6ZSxtZXRhLm5vcm1hbGl6ZU9iaik7XHJcblx0fVxyXG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSBjYj1vcHRzO1xyXG5cdG9wdHM9b3B0c3x8e307XHJcblx0dmFyIFE9ZW5naW5lLnF1ZXJ5Q2FjaGVbcV07XHJcblx0aWYgKCFRKSBRPW5ld1F1ZXJ5KGVuZ2luZSxxLG9wdHMpOyBcclxuXHRpZiAoIVEpIHtcclxuXHRcdGVuZ2luZS5zZWFyY2h0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xyXG5cdFx0ZW5naW5lLnRvdGFsdGltZT1lbmdpbmUuc2VhcmNodGltZTtcclxuXHRcdGlmIChlbmdpbmUuY29udGV4dCkgY2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW1wiZW1wdHkgcmVzdWx0XCIse3Jhd3Jlc3VsdDpbXX1dKTtcclxuXHRcdGVsc2UgY2IoXCJlbXB0eSByZXN1bHRcIix7cmF3cmVzdWx0OltdfSk7XHJcblx0XHRyZXR1cm47XHJcblx0fTtcclxuXHRlbmdpbmUucXVlcnlDYWNoZVtxXT1RO1xyXG5cdGlmIChRLnBocmFzZXMubGVuZ3RoKSB7XHJcblx0XHRsb2FkUG9zdGluZ3MoZW5naW5lLFEudGVybXMsZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKCFRLnBocmFzZXNbMF0ucG9zdGluZykge1xyXG5cdFx0XHRcdGVuZ2luZS5zZWFyY2h0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xyXG5cdFx0XHRcdGVuZ2luZS50b3RhbHRpbWU9ZW5naW5lLnNlYXJjaHRpbWVcclxuXHJcblx0XHRcdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW1wibm8gc3VjaCBwb3N0aW5nXCIse3Jhd3Jlc3VsdDpbXX1dKTtcclxuXHRcdFx0XHRyZXR1cm47XHRcdFx0XHJcblx0XHRcdH1cclxuXHRcdFx0XHJcblx0XHRcdGlmICghUS5waHJhc2VzWzBdLnBvc3RpbmcubGVuZ3RoKSB7IC8vXHJcblx0XHRcdFx0US5waHJhc2VzLmZvckVhY2gobG9hZFBocmFzZS5iaW5kKFEpKTtcclxuXHRcdFx0fVxyXG5cdFx0XHRpZiAoUS5waHJhc2VzLmxlbmd0aD09MSkge1xyXG5cdFx0XHRcdFEucmF3cmVzdWx0PVEucGhyYXNlc1swXS5wb3N0aW5nO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHBocmFzZV9pbnRlcnNlY3QoZW5naW5lLFEpO1xyXG5cdFx0XHR9XHJcblx0XHRcdHZhciBmaWxlb2Zmc2V0cz1RLmVuZ2luZS5nZXQoXCJmaWxlb2Zmc2V0c1wiKTtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInNlYXJjaCBvcHRzIFwiK0pTT04uc3RyaW5naWZ5KG9wdHMpKTtcclxuXHJcblx0XHRcdGlmICghUS5ieUZpbGUgJiYgUS5yYXdyZXN1bHQgJiYgIW9wdHMubm9ncm91cCkge1xyXG5cdFx0XHRcdFEuYnlGaWxlPXBsaXN0Lmdyb3VwYnlwb3N0aW5nMihRLnJhd3Jlc3VsdCwgZmlsZW9mZnNldHMpO1xyXG5cdFx0XHRcdFEuYnlGaWxlLnNoaWZ0KCk7US5ieUZpbGUucG9wKCk7XHJcblx0XHRcdFx0US5ieUZvbGRlcj1ncm91cEJ5Rm9sZGVyKGVuZ2luZSxRLmJ5RmlsZSk7XHJcblxyXG5cdFx0XHRcdGNvdW50Rm9sZGVyRmlsZShRKTtcclxuXHRcdFx0fVxyXG5cclxuXHRcdFx0aWYgKG9wdHMucmFuZ2UpIHtcclxuXHRcdFx0XHRlbmdpbmUuc2VhcmNodGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcclxuXHRcdFx0XHRleGNlcnB0LnJlc3VsdGxpc3QoZW5naW5lLFEsb3B0cyxmdW5jdGlvbihkYXRhKSB7IFxyXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImV4Y2VycHQgb2tcIik7XHJcblx0XHRcdFx0XHRRLmV4Y2VycHQ9ZGF0YTtcclxuXHRcdFx0XHRcdGVuZ2luZS50b3RhbHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XHJcblx0XHRcdFx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbMCxRXSk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0ZW5naW5lLnNlYXJjaHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XHJcblx0XHRcdFx0ZW5naW5lLnRvdGFsdGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcclxuXHRcdFx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbMCxRXSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH0gZWxzZSB7IC8vZW1wdHkgc2VhcmNoXHJcblx0XHRlbmdpbmUuc2VhcmNodGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcclxuXHRcdGVuZ2luZS50b3RhbHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XHJcblx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbMCxRXSk7XHJcblx0fTtcclxufVxyXG5cclxubWFpbi5zcGxpdFBocmFzZT1zcGxpdFBocmFzZTsgLy9qdXN0IGZvciBkZWJ1Z1xyXG5tb2R1bGUuZXhwb3J0cz1tYWluOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xyXG4vKlxyXG5jb252ZXJ0IHRvIHB1cmUganNcclxuc2F2ZSAtZyByZWFjdGlmeVxyXG4qL1xyXG52YXIgRT1SZWFjdC5jcmVhdGVFbGVtZW50O1xyXG5cclxudmFyIGhhc2tzYW5hZ2FwPSh0eXBlb2Yga3NhbmFnYXAhPVwidW5kZWZpbmVkXCIpO1xyXG5pZiAoaGFza3NhbmFnYXAgJiYgKHR5cGVvZiBjb25zb2xlPT1cInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlLmxvZz09XCJ1bmRlZmluZWRcIikpIHtcclxuXHRcdHdpbmRvdy5jb25zb2xlPXtsb2c6a3NhbmFnYXAubG9nLGVycm9yOmtzYW5hZ2FwLmVycm9yLGRlYnVnOmtzYW5hZ2FwLmRlYnVnLHdhcm46a3NhbmFnYXAud2Fybn07XHJcblx0XHRjb25zb2xlLmxvZyhcImluc3RhbGwgY29uc29sZSBvdXRwdXQgZnVuY2l0b25cIik7XHJcbn1cclxuXHJcbnZhciBjaGVja2ZzPWZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiAobmF2aWdhdG9yICYmIG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZSkgfHwgaGFza3NhbmFnYXA7XHJcbn1cclxudmFyIGZlYXR1cmVjaGVja3M9e1xyXG5cdFwiZnNcIjpjaGVja2ZzXHJcbn1cclxudmFyIGNoZWNrYnJvd3NlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblxyXG5cdFx0dmFyIG1pc3NpbmdGZWF0dXJlcz10aGlzLmdldE1pc3NpbmdGZWF0dXJlcygpO1xyXG5cdFx0cmV0dXJuIHtyZWFkeTpmYWxzZSwgbWlzc2luZzptaXNzaW5nRmVhdHVyZXN9O1xyXG5cdH0sXHJcblx0Z2V0TWlzc2luZ0ZlYXR1cmVzOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIGZlYXR1cmU9dGhpcy5wcm9wcy5mZWF0dXJlLnNwbGl0KFwiLFwiKTtcclxuXHRcdHZhciBzdGF0dXM9W107XHJcblx0XHRmZWF0dXJlLm1hcChmdW5jdGlvbihmKXtcclxuXHRcdFx0dmFyIGNoZWNrZXI9ZmVhdHVyZWNoZWNrc1tmXTtcclxuXHRcdFx0aWYgKGNoZWNrZXIpIGNoZWNrZXI9Y2hlY2tlcigpO1xyXG5cdFx0XHRzdGF0dXMucHVzaChbZixjaGVja2VyXSk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBzdGF0dXMuZmlsdGVyKGZ1bmN0aW9uKGYpe3JldHVybiAhZlsxXX0pO1xyXG5cdH0sXHJcblx0ZG93bmxvYWRicm93c2VyOmZ1bmN0aW9uKCkge1xyXG5cdFx0d2luZG93LmxvY2F0aW9uPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9jaHJvbWUvXCJcclxuXHR9LFxyXG5cdHJlbmRlck1pc3Npbmc6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgc2hvd01pc3Npbmc9ZnVuY3Rpb24obSkge1xyXG5cdFx0XHRyZXR1cm4gRShcImRpdlwiLCBudWxsLCBtKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiAoXHJcblx0XHQgRShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcclxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcclxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcclxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXHJcblx0XHQgICAgICAgICAgRShcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImNsb3NlXCIsIFwiZGF0YS1kaXNtaXNzXCI6IFwibW9kYWxcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0sIFwiw5dcIiksIFxyXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIkJyb3dzZXIgQ2hlY2tcIilcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwicFwiLCBudWxsLCBcIlNvcnJ5IGJ1dCB0aGUgZm9sbG93aW5nIGZlYXR1cmUgaXMgbWlzc2luZ1wiKSwgXHJcblx0XHQgICAgICAgICAgdGhpcy5zdGF0ZS5taXNzaW5nLm1hcChzaG93TWlzc2luZylcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1mb290ZXJcIn0sIFxyXG5cdFx0ICAgICAgICAgIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuZG93bmxvYWRicm93c2VyLCB0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCJ9LCBcIkRvd25sb2FkIEdvb2dsZSBDaHJvbWVcIilcclxuXHRcdCAgICAgICAgKVxyXG5cdFx0ICAgICAgKVxyXG5cdFx0ICAgIClcclxuXHRcdCAgKVxyXG5cdFx0ICk7XHJcblx0fSxcclxuXHRyZW5kZXJSZWFkeTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiBFKFwic3BhblwiLCBudWxsLCBcImJyb3dzZXIgb2tcIilcclxuXHR9LFxyXG5cdHJlbmRlcjpmdW5jdGlvbigpe1xyXG5cdFx0cmV0dXJuICAodGhpcy5zdGF0ZS5taXNzaW5nLmxlbmd0aCk/dGhpcy5yZW5kZXJNaXNzaW5nKCk6dGhpcy5yZW5kZXJSZWFkeSgpO1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoIXRoaXMuc3RhdGUubWlzc2luZy5sZW5ndGgpIHtcclxuXHRcdFx0dGhpcy5wcm9wcy5vblJlYWR5KCk7XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHQkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcclxuXHRcdH1cclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHM9Y2hlY2ticm93c2VyOyIsIlxyXG52YXIgdXNlckNhbmNlbD1mYWxzZTtcclxudmFyIGZpbGVzPVtdO1xyXG52YXIgdG90YWxEb3dubG9hZEJ5dGU9MDtcclxudmFyIHRhcmdldFBhdGg9XCJcIjtcclxudmFyIHRlbXBQYXRoPVwiXCI7XHJcbnZhciBuZmlsZT0wO1xyXG52YXIgYmFzZXVybD1cIlwiO1xyXG52YXIgcmVzdWx0PVwiXCI7XHJcbnZhciBkb3dubG9hZGluZz1mYWxzZTtcclxudmFyIHN0YXJ0RG93bmxvYWQ9ZnVuY3Rpb24oZGJpZCxfYmFzZXVybCxfZmlsZXMpIHsgLy9yZXR1cm4gZG93bmxvYWQgaWRcclxuXHR2YXIgZnMgICAgID0gcmVxdWlyZShcImZzXCIpO1xyXG5cdHZhciBwYXRoICAgPSByZXF1aXJlKFwicGF0aFwiKTtcclxuXHJcblx0XHJcblx0ZmlsZXM9X2ZpbGVzLnNwbGl0KFwiXFx1ZmZmZlwiKTtcclxuXHRpZiAoZG93bmxvYWRpbmcpIHJldHVybiBmYWxzZTsgLy9vbmx5IG9uZSBzZXNzaW9uXHJcblx0dXNlckNhbmNlbD1mYWxzZTtcclxuXHR0b3RhbERvd25sb2FkQnl0ZT0wO1xyXG5cdG5leHRGaWxlKCk7XHJcblx0ZG93bmxvYWRpbmc9dHJ1ZTtcclxuXHRiYXNldXJsPV9iYXNldXJsO1xyXG5cdGlmIChiYXNldXJsW2Jhc2V1cmwubGVuZ3RoLTFdIT0nLycpYmFzZXVybCs9Jy8nO1xyXG5cdHRhcmdldFBhdGg9a3NhbmFnYXAucm9vdFBhdGgrZGJpZCsnLyc7XHJcblx0dGVtcFBhdGg9a3NhbmFnYXAucm9vdFBhdGgrXCIudG1wL1wiO1xyXG5cdHJlc3VsdD1cIlwiO1xyXG5cdHJldHVybiB0cnVlO1xyXG59XHJcblxyXG52YXIgbmV4dEZpbGU9ZnVuY3Rpb24oKSB7XHJcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0aWYgKG5maWxlPT1maWxlcy5sZW5ndGgpIHtcclxuXHRcdFx0bmZpbGUrKztcclxuXHRcdFx0ZW5kRG93bmxvYWQoKTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGRvd25sb2FkRmlsZShuZmlsZSsrKTtcdFxyXG5cdFx0fVxyXG5cdH0sMTAwKTtcclxufVxyXG5cclxudmFyIGRvd25sb2FkRmlsZT1mdW5jdGlvbihuZmlsZSkge1xyXG5cdHZhciB1cmw9YmFzZXVybCtmaWxlc1tuZmlsZV07XHJcblx0dmFyIHRtcGZpbGVuYW1lPXRlbXBQYXRoK2ZpbGVzW25maWxlXTtcclxuXHR2YXIgbWtkaXJwID0gcmVxdWlyZShcIi4vbWtkaXJwXCIpO1xyXG5cdHZhciBmcyAgICAgPSByZXF1aXJlKFwiZnNcIik7XHJcblx0dmFyIGh0dHAgICA9IHJlcXVpcmUoXCJodHRwXCIpO1xyXG5cclxuXHRta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUodG1wZmlsZW5hbWUpKTtcclxuXHR2YXIgd3JpdGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0bXBmaWxlbmFtZSk7XHJcblx0dmFyIGRhdGFsZW5ndGg9MDtcclxuXHR2YXIgcmVxdWVzdCA9IGh0dHAuZ2V0KHVybCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuXHRcdHJlc3BvbnNlLm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XHJcblx0XHRcdHdyaXRlU3RyZWFtLndyaXRlKGNodW5rKTtcclxuXHRcdFx0dG90YWxEb3dubG9hZEJ5dGUrPWNodW5rLmxlbmd0aDtcclxuXHRcdFx0aWYgKHVzZXJDYW5jZWwpIHtcclxuXHRcdFx0XHR3cml0ZVN0cmVhbS5lbmQoKTtcclxuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bmV4dEZpbGUoKTt9LDEwMCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmVzcG9uc2Uub24oXCJlbmRcIixmdW5jdGlvbigpIHtcclxuXHRcdFx0d3JpdGVTdHJlYW0uZW5kKCk7XHJcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtuZXh0RmlsZSgpO30sMTAwKTtcclxuXHRcdH0pO1xyXG5cdH0pO1xyXG59XHJcblxyXG52YXIgY2FuY2VsRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XHJcblx0dXNlckNhbmNlbD10cnVlO1xyXG5cdGVuZERvd25sb2FkKCk7XHJcbn1cclxudmFyIHZlcmlmeT1mdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdHJ1ZTtcclxufVxyXG52YXIgZW5kRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XHJcblx0bmZpbGU9ZmlsZXMubGVuZ3RoKzE7Ly9zdG9wXHJcblx0cmVzdWx0PVwiY2FuY2VsbGVkXCI7XHJcblx0ZG93bmxvYWRpbmc9ZmFsc2U7XHJcblx0aWYgKHVzZXJDYW5jZWwpIHJldHVybjtcclxuXHR2YXIgZnMgICAgID0gcmVxdWlyZShcImZzXCIpO1xyXG5cdHZhciBta2RpcnAgPSByZXF1aXJlKFwiLi9ta2RpcnBcIik7XHJcblxyXG5cdGZvciAodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspIHtcclxuXHRcdHZhciB0YXJnZXRmaWxlbmFtZT10YXJnZXRQYXRoK2ZpbGVzW2ldO1xyXG5cdFx0dmFyIHRtcGZpbGVuYW1lICAgPXRlbXBQYXRoK2ZpbGVzW2ldO1xyXG5cdFx0bWtkaXJwLnN5bmMocGF0aC5kaXJuYW1lKHRhcmdldGZpbGVuYW1lKSk7XHJcblx0XHRmcy5yZW5hbWVTeW5jKHRtcGZpbGVuYW1lLHRhcmdldGZpbGVuYW1lKTtcclxuXHR9XHJcblx0aWYgKHZlcmlmeSgpKSB7XHJcblx0XHRyZXN1bHQ9XCJzdWNjZXNzXCI7XHJcblx0fSBlbHNlIHtcclxuXHRcdHJlc3VsdD1cImVycm9yXCI7XHJcblx0fVxyXG59XHJcblxyXG52YXIgZG93bmxvYWRlZEJ5dGU9ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRvdGFsRG93bmxvYWRCeXRlO1xyXG59XHJcbnZhciBkb25lRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XHJcblx0aWYgKG5maWxlPmZpbGVzLmxlbmd0aCkgcmV0dXJuIHJlc3VsdDtcclxuXHRlbHNlIHJldHVybiBcIlwiO1xyXG59XHJcbnZhciBkb3dubG9hZGluZ0ZpbGU9ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIG5maWxlLTE7XHJcbn1cclxuXHJcbnZhciBkb3dubG9hZGVyPXtzdGFydERvd25sb2FkOnN0YXJ0RG93bmxvYWQsIGRvd25sb2FkZWRCeXRlOmRvd25sb2FkZWRCeXRlLFxyXG5cdGRvd25sb2FkaW5nRmlsZTpkb3dubG9hZGluZ0ZpbGUsIGNhbmNlbERvd25sb2FkOmNhbmNlbERvd25sb2FkLGRvbmVEb3dubG9hZDpkb25lRG93bmxvYWR9O1xyXG5tb2R1bGUuZXhwb3J0cz1kb3dubG9hZGVyOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xyXG5cclxuLyogdG9kbyAsIG9wdGlvbmFsIGtkYiAqL1xyXG5cclxudmFyIEh0bWxGUz1yZXF1aXJlKFwiLi9odG1sZnNcIik7XHJcbnZhciBodG1sNWZzPXJlcXVpcmUoXCIuL2h0bWw1ZnNcIik7XHJcbnZhciBDaGVja0Jyb3dzZXI9cmVxdWlyZShcIi4vY2hlY2ticm93c2VyXCIpO1xyXG52YXIgRT1SZWFjdC5jcmVhdGVFbGVtZW50O1xyXG4gIFxyXG5cclxudmFyIEZpbGVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiB7ZG93bmxvYWRpbmc6ZmFsc2UscHJvZ3Jlc3M6MH07XHJcblx0fSxcclxuXHR1cGRhdGFibGU6ZnVuY3Rpb24oZikge1xyXG4gICAgICAgIHZhciBjbGFzc2VzPVwiYnRuIGJ0bi13YXJuaW5nXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIGNsYXNzZXMrPVwiIGRpc2FibGVkXCI7XHJcblx0XHRpZiAoZi5oYXNVcGRhdGUpIHJldHVybiAgIEUoXCJidXR0b25cIiwge2NsYXNzTmFtZTogY2xhc3NlcywgXHJcblx0XHRcdFwiZGF0YS1maWxlbmFtZVwiOiBmLmZpbGVuYW1lLCBcImRhdGEtdXJsXCI6IGYudXJsLCBcclxuXHQgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRvd25sb2FkXHJcblx0ICAgICAgIH0sIFwiVXBkYXRlXCIpXHJcblx0XHRlbHNlIHJldHVybiBudWxsO1xyXG5cdH0sXHJcblx0c2hvd0xvY2FsOmZ1bmN0aW9uKGYpIHtcclxuICAgICAgICB2YXIgY2xhc3Nlcz1cImJ0biBidG4tZGFuZ2VyXCI7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIGNsYXNzZXMrPVwiIGRpc2FibGVkXCI7XHJcblx0ICByZXR1cm4gRShcInRyXCIsIG51bGwsIEUoXCJ0ZFwiLCBudWxsLCBmLmZpbGVuYW1lKSwgXHJcblx0ICAgICAgRShcInRkXCIsIG51bGwpLCBcclxuXHQgICAgICBFKFwidGRcIiwge2NsYXNzTmFtZTogXCJwdWxsLXJpZ2h0XCJ9LCBcclxuXHQgICAgICB0aGlzLnVwZGF0YWJsZShmKSwgRShcImJ1dHRvblwiLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLCBcclxuXHQgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRlbGV0ZUZpbGUsIFwiZGF0YS1maWxlbmFtZVwiOiBmLmZpbGVuYW1lfSwgXCJEZWxldGVcIilcclxuXHQgICAgICAgIFxyXG5cdCAgICAgIClcclxuXHQgIClcclxuXHR9LCAgXHJcblx0c2hvd1JlbW90ZTpmdW5jdGlvbihmKSB7IFxyXG5cdCAgdmFyIGNsYXNzZXM9XCJidG4gYnRuLXdhcm5pbmdcIjtcclxuXHQgIGlmICh0aGlzLnN0YXRlLmRvd25sb2FkaW5nKSBjbGFzc2VzKz1cIiBkaXNhYmxlZFwiO1xyXG5cdCAgcmV0dXJuIChFKFwidHJcIiwge1wiZGF0YS1pZFwiOiBmLmZpbGVuYW1lfSwgRShcInRkXCIsIG51bGwsIFxyXG5cdCAgICAgIGYuZmlsZW5hbWUpLCBcclxuXHQgICAgICBFKFwidGRcIiwgbnVsbCwgZi5kZXNjKSwgXHJcblx0ICAgICAgRShcInRkXCIsIG51bGwsIFxyXG5cdCAgICAgIEUoXCJzcGFuXCIsIHtcImRhdGEtZmlsZW5hbWVcIjogZi5maWxlbmFtZSwgXCJkYXRhLXVybFwiOiBmLnVybCwgXHJcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc2VzLCBcclxuXHQgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRvd25sb2FkfSwgXCJEb3dubG9hZFwiKVxyXG5cdCAgICAgIClcclxuXHQgICkpO1xyXG5cdH0sXHJcblx0c2hvd0ZpbGU6ZnVuY3Rpb24oZikge1xyXG5cdC8vXHRyZXR1cm4gPHNwYW4gZGF0YS1pZD17Zi5maWxlbmFtZX0+e2YudXJsfTwvc3Bhbj5cclxuXHRcdHJldHVybiAoZi5yZWFkeSk/dGhpcy5zaG93TG9jYWwoZik6dGhpcy5zaG93UmVtb3RlKGYpO1xyXG5cdH0sXHJcblx0cmVsb2FkRGlyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJyZWxvYWRcIik7XHJcblx0fSxcclxuXHRkb3dubG9hZDpmdW5jdGlvbihlKSB7XHJcblx0XHR2YXIgdXJsPWUudGFyZ2V0LmRhdGFzZXRbXCJ1cmxcIl07XHJcblx0XHR2YXIgZmlsZW5hbWU9ZS50YXJnZXQuZGF0YXNldFtcImZpbGVuYW1lXCJdO1xyXG5cdFx0dGhpcy5zZXRTdGF0ZSh7ZG93bmxvYWRpbmc6dHJ1ZSxwcm9ncmVzczowLHVybDp1cmx9KTtcclxuXHRcdHRoaXMudXNlcmJyZWFrPWZhbHNlO1xyXG5cdFx0aHRtbDVmcy5kb3dubG9hZCh1cmwsZmlsZW5hbWUsZnVuY3Rpb24oKXtcclxuXHRcdFx0dGhpcy5yZWxvYWREaXIoKTtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7ZG93bmxvYWRpbmc6ZmFsc2UscHJvZ3Jlc3M6MX0pO1xyXG5cdFx0XHR9LGZ1bmN0aW9uKHByb2dyZXNzLHRvdGFsKXtcclxuXHRcdFx0XHRpZiAocHJvZ3Jlc3M9PTApIHtcclxuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe21lc3NhZ2U6XCJ0b3RhbCBcIit0b3RhbH0pXHJcblx0XHRcdCBcdH1cclxuXHRcdFx0IFx0dGhpcy5zZXRTdGF0ZSh7cHJvZ3Jlc3M6cHJvZ3Jlc3N9KTtcclxuXHRcdFx0IFx0Ly9pZiB1c2VyIHByZXNzIGFib3J0IHJldHVybiB0cnVlXHJcblx0XHRcdCBcdHJldHVybiB0aGlzLnVzZXJicmVhaztcclxuXHRcdFx0fVxyXG5cdFx0LHRoaXMpO1xyXG5cdH0sXHJcblx0ZGVsZXRlRmlsZTpmdW5jdGlvbiggZSkge1xyXG5cdFx0dmFyIGZpbGVuYW1lPWUudGFyZ2V0LmF0dHJpYnV0ZXNbXCJkYXRhLWZpbGVuYW1lXCJdLnZhbHVlO1xyXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJkZWxldGVcIixmaWxlbmFtZSk7XHJcblx0fSxcclxuXHRhbGxGaWxlc1JlYWR5OmZ1bmN0aW9uKGUpIHtcclxuXHRcdHJldHVybiB0aGlzLnByb3BzLmZpbGVzLmV2ZXJ5KGZ1bmN0aW9uKGYpeyByZXR1cm4gZi5yZWFkeX0pO1xyXG5cdH0sXHJcblx0ZGlzbWlzczpmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xyXG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJkaXNtaXNzXCIpO1xyXG5cdH0sXHJcblx0YWJvcnRkb3dubG9hZDpmdW5jdGlvbigpIHtcclxuXHRcdHRoaXMudXNlcmJyZWFrPXRydWU7XHJcblx0fSxcclxuXHRzaG93UHJvZ3Jlc3M6ZnVuY3Rpb24oKSB7XHJcblx0ICAgICBpZiAodGhpcy5zdGF0ZS5kb3dubG9hZGluZykge1xyXG5cdCAgICAgIHZhciBwcm9ncmVzcz1NYXRoLnJvdW5kKHRoaXMuc3RhdGUucHJvZ3Jlc3MqMTAwKTtcclxuXHQgICAgICByZXR1cm4gKFxyXG5cdCAgICAgIFx0RShcImRpdlwiLCBudWxsLCBcclxuXHQgICAgICBcdFwiRG93bmxvYWRpbmcgZnJvbSBcIiwgdGhpcy5zdGF0ZS51cmwsIFxyXG5cdCAgICAgIEUoXCJkaXZcIiwge2tleTogXCJwcm9ncmVzc1wiLCBjbGFzc05hbWU6IFwicHJvZ3Jlc3MgY29sLW1kLThcIn0sIFxyXG5cdCAgICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyXCIsIHJvbGU6IFwicHJvZ3Jlc3NiYXJcIiwgXHJcblx0ICAgICAgICAgICAgICBcImFyaWEtdmFsdWVub3dcIjogcHJvZ3Jlc3MsIFwiYXJpYS12YWx1ZW1pblwiOiBcIjBcIiwgXHJcblx0ICAgICAgICAgICAgICBcImFyaWEtdmFsdWVtYXhcIjogXCIxMDBcIiwgc3R5bGU6IHt3aWR0aDogcHJvZ3Jlc3MrXCIlXCJ9fSwgXHJcblx0ICAgICAgICAgICAgcHJvZ3Jlc3MsIFwiJVwiXHJcblx0ICAgICAgICAgIClcclxuXHQgICAgICAgICksIFxyXG5cdCAgICAgICAgRShcImJ1dHRvblwiLCB7b25DbGljazogdGhpcy5hYm9ydGRvd25sb2FkLCBcclxuXHQgICAgICAgIFx0Y2xhc3NOYW1lOiBcImJ0biBidG4tZGFuZ2VyIGNvbC1tZC00XCJ9LCBcIkFib3J0XCIpXHJcblx0ICAgICAgICApXHJcblx0ICAgICAgICApO1xyXG5cdCAgICAgIH0gZWxzZSB7XHJcblx0ICAgICAgXHRcdGlmICggdGhpcy5hbGxGaWxlc1JlYWR5KCkgKSB7XHJcblx0ICAgICAgXHRcdFx0cmV0dXJuIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuZGlzbWlzcywgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXCJPa1wiKVxyXG5cdCAgICAgIFx0XHR9IGVsc2UgcmV0dXJuIG51bGw7XHJcblx0ICAgICAgXHRcdFxyXG5cdCAgICAgIH1cclxuXHR9LFxyXG5cdHNob3dVc2FnZTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBwZXJjZW50PXRoaXMucHJvcHMucmVtYWluUGVyY2VudDtcclxuICAgICAgICAgICByZXR1cm4gKEUoXCJkaXZcIiwgbnVsbCwgRShcInNwYW5cIiwge2NsYXNzTmFtZTogXCJwdWxsLWxlZnRcIn0sIFwiVXNhZ2U6XCIpLCBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3NcIn0sIFxyXG5cdFx0ICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzIHByb2dyZXNzLWJhci1zdHJpcGVkXCIsIHJvbGU6IFwicHJvZ3Jlc3NiYXJcIiwgc3R5bGU6IHt3aWR0aDogcGVyY2VudCtcIiVcIn19LCBcclxuXHRcdCAgICBcdHBlcmNlbnQrXCIlXCJcclxuXHRcdCAgKVxyXG5cdFx0KSkpO1xyXG5cdH0sXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdCAgXHRyZXR1cm4gKFxyXG5cdFx0RShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcclxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcclxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcclxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXHJcblx0XHQgICAgICAgICAgRShcImg0XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtdGl0bGVcIn0sIFwiRmlsZSBJbnN0YWxsZXJcIilcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcclxuXHRcdCAgICAgICAgXHRFKFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJ0YWJsZVwifSwgXHJcblx0XHQgICAgICAgIFx0RShcInRib2R5XCIsIG51bGwsIFxyXG5cdFx0ICAgICAgICAgIFx0dGhpcy5wcm9wcy5maWxlcy5tYXAodGhpcy5zaG93RmlsZSlcclxuXHRcdCAgICAgICAgICBcdClcclxuXHRcdCAgICAgICAgICApXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcclxuXHRcdCAgICAgICAgXHR0aGlzLnNob3dVc2FnZSgpLCBcclxuXHRcdCAgICAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MoKVxyXG5cdFx0ICAgICAgICApXHJcblx0XHQgICAgICApXHJcblx0XHQgICAgKVxyXG5cdFx0ICApXHJcblx0XHQpO1xyXG5cdH0sXHRcclxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnc2hvdycpO1xyXG5cdH1cclxufSk7XHJcbi8qVE9ETyBrZGIgY2hlY2sgdmVyc2lvbiovXHJcbnZhciBGaWxlbWFuYWdlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgcXVvdGE9dGhpcy5nZXRRdW90YSgpO1xyXG5cdFx0cmV0dXJuIHticm93c2VyUmVhZHk6ZmFsc2Usbm91cGRhdGU6dHJ1ZSxcdHJlcXVlc3RRdW90YTpxdW90YSxyZW1haW46MH07XHJcblx0fSxcclxuXHRnZXRRdW90YTpmdW5jdGlvbigpIHtcclxuXHRcdHZhciBxPXRoaXMucHJvcHMucXVvdGF8fFwiMTI4TVwiO1xyXG5cdFx0dmFyIHVuaXQ9cVtxLmxlbmd0aC0xXTtcclxuXHRcdHZhciB0aW1lcz0xO1xyXG5cdFx0aWYgKHVuaXQ9PVwiTVwiKSB0aW1lcz0xMDI0KjEwMjQ7XHJcblx0XHRlbHNlIGlmICh1bml0PVwiS1wiKSB0aW1lcz0xMDI0O1xyXG5cdFx0cmV0dXJuIHBhcnNlSW50KHEpICogdGltZXM7XHJcblx0fSxcclxuXHRtaXNzaW5nS2RiOmZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtIT1cImNocm9tZVwiKSByZXR1cm4gW107XHJcblx0XHR2YXIgbWlzc2luZz10aGlzLnByb3BzLm5lZWRlZC5maWx0ZXIoZnVuY3Rpb24oa2RiKXtcclxuXHRcdFx0Zm9yICh2YXIgaSBpbiBodG1sNWZzLmZpbGVzKSB7XHJcblx0XHRcdFx0aWYgKGh0bWw1ZnMuZmlsZXNbaV1bMF09PWtkYi5maWxlbmFtZSkgcmV0dXJuIGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHRcdHJldHVybiB0cnVlO1xyXG5cdFx0fSx0aGlzKTtcclxuXHRcdHJldHVybiBtaXNzaW5nO1xyXG5cdH0sXHJcblx0Z2V0UmVtb3RlVXJsOmZ1bmN0aW9uKGZuKSB7XHJcblx0XHR2YXIgZj10aGlzLnByb3BzLm5lZWRlZC5maWx0ZXIoZnVuY3Rpb24oZil7cmV0dXJuIGYuZmlsZW5hbWU9PWZufSk7XHJcblx0XHRpZiAoZi5sZW5ndGggKSByZXR1cm4gZlswXS51cmw7XHJcblx0fSxcclxuXHRnZW5GaWxlTGlzdDpmdW5jdGlvbihleGlzdGluZyxtaXNzaW5nKXtcclxuXHRcdHZhciBvdXQ9W107XHJcblx0XHRmb3IgKHZhciBpIGluIGV4aXN0aW5nKSB7XHJcblx0XHRcdHZhciB1cmw9dGhpcy5nZXRSZW1vdGVVcmwoZXhpc3RpbmdbaV1bMF0pO1xyXG5cdFx0XHRvdXQucHVzaCh7ZmlsZW5hbWU6ZXhpc3RpbmdbaV1bMF0sIHVybCA6dXJsLCByZWFkeTp0cnVlIH0pO1xyXG5cdFx0fVxyXG5cdFx0Zm9yICh2YXIgaSBpbiBtaXNzaW5nKSB7XHJcblx0XHRcdG91dC5wdXNoKG1pc3NpbmdbaV0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIG91dDtcclxuXHR9LFxyXG5cdHJlbG9hZDpmdW5jdGlvbigpIHtcclxuXHRcdGh0bWw1ZnMucmVhZGRpcihmdW5jdGlvbihmaWxlcyl7XHJcbiAgXHRcdFx0dGhpcy5zZXRTdGF0ZSh7ZmlsZXM6dGhpcy5nZW5GaWxlTGlzdChmaWxlcyx0aGlzLm1pc3NpbmdLZGIoKSl9KTtcclxuICBcdFx0fSx0aGlzKTtcclxuXHQgfSxcclxuXHRkZWxldGVGaWxlOmZ1bmN0aW9uKGZuKSB7XHJcblx0ICBodG1sNWZzLnJtKGZuLGZ1bmN0aW9uKCl7XHJcblx0ICBcdHRoaXMucmVsb2FkKCk7XHJcblx0ICB9LHRoaXMpO1xyXG5cdH0sXHJcblx0b25RdW90ZU9rOmZ1bmN0aW9uKHF1b3RhLHVzYWdlKSB7XHJcblx0XHRpZiAoa3NhbmFnYXAucGxhdGZvcm0hPVwiY2hyb21lXCIpIHtcclxuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIm9ucXVvdGVva1wiKTtcclxuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7bm91cGRhdGU6dHJ1ZSxtaXNzaW5nOltdLGZpbGVzOltdLGF1dG9jbG9zZTp0cnVlXHJcblx0XHRcdFx0LHF1b3RhOnF1b3RhLHJlbWFpbjpxdW90YS11c2FnZSx1c2FnZTp1c2FnZX0pO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvL2NvbnNvbGUubG9nKFwicXVvdGUgb2tcIik7XHJcblx0XHR2YXIgZmlsZXM9dGhpcy5nZW5GaWxlTGlzdChodG1sNWZzLmZpbGVzLHRoaXMubWlzc2luZ0tkYigpKTtcclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHR0aGF0LmNoZWNrSWZVcGRhdGUoZmlsZXMsZnVuY3Rpb24oaGFzdXBkYXRlKSB7XHJcblx0XHRcdHZhciBtaXNzaW5nPXRoaXMubWlzc2luZ0tkYigpO1xyXG5cdFx0XHR2YXIgYXV0b2Nsb3NlPXRoaXMucHJvcHMuYXV0b2Nsb3NlO1xyXG5cdFx0XHRpZiAobWlzc2luZy5sZW5ndGgpIGF1dG9jbG9zZT1mYWxzZTtcclxuXHRcdFx0dGhhdC5zZXRTdGF0ZSh7YXV0b2Nsb3NlOmF1dG9jbG9zZSxcclxuXHRcdFx0XHRxdW90YTpxdW90YSx1c2FnZTp1c2FnZSxmaWxlczpmaWxlcyxcclxuXHRcdFx0XHRtaXNzaW5nOm1pc3NpbmcsXHJcblx0XHRcdFx0bm91cGRhdGU6IWhhc3VwZGF0ZSxcclxuXHRcdFx0XHRyZW1haW46cXVvdGEtdXNhZ2V9KTtcclxuXHRcdH0pO1xyXG5cdH0sICBcclxuXHRvbkJyb3dzZXJPazpmdW5jdGlvbigpIHtcclxuXHQgIHRoaXMudG90YWxEb3dubG9hZFNpemUoKTtcclxuXHR9LCBcclxuXHRkaXNtaXNzOmZ1bmN0aW9uKCkge1xyXG5cdFx0dGhpcy5wcm9wcy5vblJlYWR5KHRoaXMuc3RhdGUudXNhZ2UsdGhpcy5zdGF0ZS5xdW90YSk7XHJcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XHJcblx0XHRcdHZhciBtb2RhbGluPSQoXCIubW9kYWwuaW5cIik7XHJcblx0XHRcdGlmIChtb2RhbGluLm1vZGFsKSBtb2RhbGluLm1vZGFsKCdoaWRlJyk7XHJcblx0XHR9LDUwMCk7XHJcblx0fSwgXHJcblx0dG90YWxEb3dubG9hZFNpemU6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgZmlsZXM9dGhpcy5taXNzaW5nS2RiKCk7XHJcblx0XHR2YXIgdGFza3F1ZXVlPVtdLHRvdGFsc2l6ZT0wO1xyXG5cdFx0Zm9yICh2YXIgaT0wO2k8ZmlsZXMubGVuZ3RoO2krKykge1xyXG5cdFx0XHR0YXNrcXVldWUucHVzaChcclxuXHRcdFx0XHQoZnVuY3Rpb24oaWR4KXtcclxuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24oZGF0YSl7XHJcblx0XHRcdFx0XHRcdGlmICghKHR5cGVvZiBkYXRhPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSB0b3RhbHNpemUrPWRhdGE7XHJcblx0XHRcdFx0XHRcdGh0bWw1ZnMuZ2V0RG93bmxvYWRTaXplKGZpbGVzW2lkeF0udXJsLHRhc2txdWV1ZS5zaGlmdCgpKTtcclxuXHRcdFx0XHRcdH0pO1xyXG5cdFx0XHRcdH0pKGkpXHJcblx0XHRcdCk7XHJcblx0XHR9XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHRcclxuXHRcdFx0dG90YWxzaXplKz1kYXRhO1xyXG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhhdC5zZXRTdGF0ZSh7cmVxdWlyZVNwYWNlOnRvdGFsc2l6ZSxicm93c2VyUmVhZHk6dHJ1ZX0pfSwwKTtcclxuXHRcdH0pO1xyXG5cdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xyXG5cdH0sXHJcblx0Y2hlY2tJZlVwZGF0ZTpmdW5jdGlvbihmaWxlcyxjYikge1xyXG5cdFx0dmFyIHRhc2txdWV1ZT1bXTtcclxuXHRcdGZvciAodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspIHtcclxuXHRcdFx0dGFza3F1ZXVlLnB1c2goXHJcblx0XHRcdFx0KGZ1bmN0aW9uKGlkeCl7XHJcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0XHRcdFx0XHRpZiAoISh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkgZmlsZXNbaWR4LTFdLmhhc1VwZGF0ZT1kYXRhO1xyXG5cdFx0XHRcdFx0XHRodG1sNWZzLmNoZWNrVXBkYXRlKGZpbGVzW2lkeF0udXJsLGZpbGVzW2lkeF0uZmlsZW5hbWUsdGFza3F1ZXVlLnNoaWZ0KCkpO1xyXG5cdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0fSkoaSlcclxuXHRcdFx0KTtcclxuXHRcdH1cclxuXHRcdHZhciB0aGF0PXRoaXM7XHJcblx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcdFxyXG5cdFx0XHRmaWxlc1tmaWxlcy5sZW5ndGgtMV0uaGFzVXBkYXRlPWRhdGE7XHJcblx0XHRcdHZhciBoYXN1cGRhdGU9ZmlsZXMuc29tZShmdW5jdGlvbihmKXtyZXR1cm4gZi5oYXNVcGRhdGV9KTtcclxuXHRcdFx0aWYgKGNiKSBjYi5hcHBseSh0aGF0LFtoYXN1cGRhdGVdKTtcclxuXHRcdH0pO1xyXG5cdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xyXG5cdH0sXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCl7XHJcbiAgICBcdFx0aWYgKCF0aGlzLnN0YXRlLmJyb3dzZXJSZWFkeSkgeyAgIFxyXG4gICAgICBcdFx0XHRyZXR1cm4gRShDaGVja0Jyb3dzZXIsIHtmZWF0dXJlOiBcImZzXCIsIG9uUmVhZHk6IHRoaXMub25Ccm93c2VyT2t9KVxyXG4gICAgXHRcdH0gaWYgKCF0aGlzLnN0YXRlLnF1b3RhIHx8IHRoaXMuc3RhdGUucmVtYWluPHRoaXMuc3RhdGUucmVxdWlyZVNwYWNlKSB7ICBcclxuICAgIFx0XHRcdHZhciBxdW90YT10aGlzLnN0YXRlLnJlcXVlc3RRdW90YTtcclxuICAgIFx0XHRcdGlmICh0aGlzLnN0YXRlLnVzYWdlK3RoaXMuc3RhdGUucmVxdWlyZVNwYWNlPnF1b3RhKSB7XHJcbiAgICBcdFx0XHRcdHF1b3RhPSh0aGlzLnN0YXRlLnVzYWdlK3RoaXMuc3RhdGUucmVxdWlyZVNwYWNlKSoxLjU7XHJcbiAgICBcdFx0XHR9XHJcbiAgICAgIFx0XHRcdHJldHVybiBFKEh0bWxGUywge3F1b3RhOiBxdW90YSwgYXV0b2Nsb3NlOiBcInRydWVcIiwgb25SZWFkeTogdGhpcy5vblF1b3RlT2t9KVxyXG4gICAgICBcdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKCF0aGlzLnN0YXRlLm5vdXBkYXRlIHx8IHRoaXMubWlzc2luZ0tkYigpLmxlbmd0aCB8fCAhdGhpcy5zdGF0ZS5hdXRvY2xvc2UpIHtcclxuXHRcdFx0XHR2YXIgcmVtYWluPU1hdGgucm91bmQoKHRoaXMuc3RhdGUudXNhZ2UvdGhpcy5zdGF0ZS5xdW90YSkqMTAwKTtcdFx0XHRcdFxyXG5cdFx0XHRcdHJldHVybiBFKEZpbGVMaXN0LCB7YWN0aW9uOiB0aGlzLmFjdGlvbiwgZmlsZXM6IHRoaXMuc3RhdGUuZmlsZXMsIHJlbWFpblBlcmNlbnQ6IHJlbWFpbn0pXHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0c2V0VGltZW91dCggdGhpcy5kaXNtaXNzICwwKTtcclxuXHRcdFx0XHRyZXR1cm4gRShcInNwYW5cIiwgbnVsbCwgXCJTdWNjZXNzXCIpO1xyXG5cdFx0XHR9XHJcbiAgICAgIFx0XHR9XHJcblx0fSxcclxuXHRhY3Rpb246ZnVuY3Rpb24oKSB7XHJcblx0ICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XHJcblx0ICB2YXIgdHlwZT1hcmdzLnNoaWZ0KCk7XHJcblx0ICB2YXIgcmVzPW51bGwsIHRoYXQ9dGhpcztcclxuXHQgIGlmICh0eXBlPT1cImRlbGV0ZVwiKSB7XHJcblx0ICAgIHRoaXMuZGVsZXRlRmlsZShhcmdzWzBdKTtcclxuXHQgIH0gIGVsc2UgaWYgKHR5cGU9PVwicmVsb2FkXCIpIHtcclxuXHQgIFx0dGhpcy5yZWxvYWQoKTtcclxuXHQgIH0gZWxzZSBpZiAodHlwZT09XCJkaXNtaXNzXCIpIHtcclxuXHQgIFx0dGhpcy5kaXNtaXNzKCk7XHJcblx0ICB9XHJcblx0fVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzPUZpbGVtYW5hZ2VyOyIsIi8qIGVtdWxhdGUgZmlsZXN5c3RlbSBvbiBodG1sNSBicm93c2VyICovXHJcbnZhciBnZXRfaGVhZD1mdW5jdGlvbih1cmwsZmllbGQsY2Ipe1xyXG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuXHR4aHIub3BlbihcIkhFQURcIiwgdXJsLCB0cnVlKTtcclxuXHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gdGhpcy5ET05FKSB7XHJcblx0XHRcdFx0Y2IoeGhyLmdldFJlc3BvbnNlSGVhZGVyKGZpZWxkKSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0aWYgKHRoaXMuc3RhdHVzIT09MjAwJiZ0aGlzLnN0YXR1cyE9PTIwNikge1xyXG5cdFx0XHRcdFx0Y2IoXCJcIik7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9IFxyXG5cdH07XHJcblx0eGhyLnNlbmQoKTtcdFxyXG59XHJcbnZhciBnZXRfZGF0ZT1mdW5jdGlvbih1cmwsY2IpIHtcclxuXHRnZXRfaGVhZCh1cmwsXCJMYXN0LU1vZGlmaWVkXCIsZnVuY3Rpb24odmFsdWUpe1xyXG5cdFx0Y2IodmFsdWUpO1xyXG5cdH0pO1xyXG59XHJcbnZhciBnZXRfc2l6ZT1mdW5jdGlvbih1cmwsIGNiKSB7XHJcblx0Z2V0X2hlYWQodXJsLFwiQ29udGVudC1MZW5ndGhcIixmdW5jdGlvbih2YWx1ZSl7XHJcblx0XHRjYihwYXJzZUludCh2YWx1ZSkpO1xyXG5cdH0pO1xyXG59O1xyXG52YXIgY2hlY2tVcGRhdGU9ZnVuY3Rpb24odXJsLGZuLGNiKSB7XHJcblx0aWYgKCF1cmwpIHtcclxuXHRcdGNiKGZhbHNlKTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0Z2V0X2RhdGUodXJsLGZ1bmN0aW9uKGQpe1xyXG5cdFx0QVBJLmZzLnJvb3QuZ2V0RmlsZShmbiwge2NyZWF0ZTogZmFsc2UsIGV4Y2x1c2l2ZTogZmFsc2V9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcclxuXHRcdFx0ZmlsZUVudHJ5LmdldE1ldGFkYXRhKGZ1bmN0aW9uKG1ldGFkYXRhKXtcclxuXHRcdFx0XHR2YXIgbG9jYWxEYXRlPURhdGUucGFyc2UobWV0YWRhdGEubW9kaWZpY2F0aW9uVGltZSk7XHJcblx0XHRcdFx0dmFyIHVybERhdGU9RGF0ZS5wYXJzZShkKTtcclxuXHRcdFx0XHRjYih1cmxEYXRlPmxvY2FsRGF0ZSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSxmdW5jdGlvbigpe1xyXG5cdFx0XHRjYihmYWxzZSk7XHJcblx0XHR9KTtcclxuXHR9KTtcclxufVxyXG52YXIgZG93bmxvYWQ9ZnVuY3Rpb24odXJsLGZuLGNiLHN0YXR1c2NiLGNvbnRleHQpIHtcclxuXHQgdmFyIHRvdGFsc2l6ZT0wLGJhdGNoZXM9bnVsbCx3cml0dGVuPTA7XHJcblx0IHZhciBmaWxlRW50cnk9MCwgZmlsZVdyaXRlcj0wO1xyXG5cdCB2YXIgY3JlYXRlQmF0Y2hlcz1mdW5jdGlvbihzaXplKSB7XHJcblx0XHR2YXIgYnl0ZXM9MTAyNCoxMDI0LCBvdXQ9W107XHJcblx0XHR2YXIgYj1NYXRoLmZsb29yKHNpemUgLyBieXRlcyk7XHJcblx0XHR2YXIgbGFzdD1zaXplICVieXRlcztcclxuXHRcdGZvciAodmFyIGk9MDtpPD1iO2krKykge1xyXG5cdFx0XHRvdXQucHVzaChpKmJ5dGVzKTtcclxuXHRcdH1cclxuXHRcdG91dC5wdXNoKGIqYnl0ZXMrbGFzdCk7XHJcblx0XHRyZXR1cm4gb3V0O1xyXG5cdCB9XHJcblx0IHZhciBmaW5pc2g9ZnVuY3Rpb24oKSB7XHJcblx0XHQgcm0oZm4sZnVuY3Rpb24oKXtcclxuXHRcdFx0XHRmaWxlRW50cnkubW92ZVRvKGZpbGVFbnRyeS5maWxlc3lzdGVtLnJvb3QsIGZuLGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBjYi5iaW5kKGNvbnRleHQsZmFsc2UpICwgMCkgOyBcclxuXHRcdFx0XHR9LGZ1bmN0aW9uKGUpe1xyXG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJmYWlsZWRcIixlKVxyXG5cdFx0XHRcdH0pO1xyXG5cdFx0IH0sdGhpcyk7IFxyXG5cdCB9O1xyXG5cdFx0dmFyIHRlbXBmbj1cInRlbXAua2RiXCI7XHJcblx0XHR2YXIgYmF0Y2g9ZnVuY3Rpb24oYikge1xyXG5cdFx0dmFyIGFib3J0PWZhbHNlO1xyXG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG5cdFx0dmFyIHJlcXVlc3R1cmw9dXJsK1wiP1wiK01hdGgucmFuZG9tKCk7XHJcblx0XHR4aHIub3BlbignZ2V0JywgcmVxdWVzdHVybCwgdHJ1ZSk7XHJcblx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignUmFuZ2UnLCAnYnl0ZXM9JytiYXRjaGVzW2JdKyctJysoYmF0Y2hlc1tiKzFdLTEpKTtcclxuXHRcdHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7ICAgIFxyXG5cdFx0eGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcclxuXHRcdFx0dmFyIGJsb2I9dGhpcy5yZXNwb25zZTtcclxuXHRcdFx0ZmlsZUVudHJ5LmNyZWF0ZVdyaXRlcihmdW5jdGlvbihmaWxlV3JpdGVyKSB7XHJcblx0XHRcdFx0ZmlsZVdyaXRlci5zZWVrKGZpbGVXcml0ZXIubGVuZ3RoKTtcclxuXHRcdFx0XHRmaWxlV3JpdGVyLndyaXRlKGJsb2IpO1xyXG5cdFx0XHRcdHdyaXR0ZW4rPWJsb2Iuc2l6ZTtcclxuXHRcdFx0XHRmaWxlV3JpdGVyLm9ud3JpdGVlbmQgPSBmdW5jdGlvbihlKSB7XHJcblx0XHRcdFx0XHRpZiAoc3RhdHVzY2IpIHtcclxuXHRcdFx0XHRcdFx0YWJvcnQ9c3RhdHVzY2IuYXBwbHkoY29udGV4dCxbIGZpbGVXcml0ZXIubGVuZ3RoIC8gdG90YWxzaXplLHRvdGFsc2l6ZSBdKTtcclxuXHRcdFx0XHRcdFx0aWYgKGFib3J0KSBzZXRUaW1lb3V0KCBjYi5iaW5kKGNvbnRleHQsZmFsc2UpICwgMCkgO1xyXG5cdFx0XHRcdCBcdH1cclxuXHRcdFx0XHRcdGIrKztcclxuXHRcdFx0XHRcdGlmICghYWJvcnQpIHtcclxuXHRcdFx0XHRcdFx0aWYgKGI8YmF0Y2hlcy5sZW5ndGgtMSkgc2V0VGltZW91dChiYXRjaC5iaW5kKGNvbnRleHQsYiksMCk7XHJcblx0XHRcdFx0XHRcdGVsc2UgICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xyXG5cdFx0XHRcdCBcdH1cclxuXHRcdFx0IFx0fTtcclxuXHRcdFx0fSwgY29uc29sZS5lcnJvcik7XHJcblx0XHR9LGZhbHNlKTtcclxuXHRcdHhoci5zZW5kKCk7XHJcblx0fVxyXG5cclxuXHRnZXRfc2l6ZSh1cmwsZnVuY3Rpb24oc2l6ZSl7XHJcblx0XHR0b3RhbHNpemU9c2l6ZTtcclxuXHRcdGlmICghc2l6ZSkge1xyXG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2ZhbHNlXSk7XHJcblx0XHR9IGVsc2Ugey8vcmVhZHkgdG8gZG93bmxvYWRcclxuXHRcdFx0cm0odGVtcGZuLGZ1bmN0aW9uKCl7XHJcblx0XHRcdFx0IGJhdGNoZXM9Y3JlYXRlQmF0Y2hlcyhzaXplKTtcclxuXHRcdFx0XHQgaWYgKHN0YXR1c2NiKSBzdGF0dXNjYi5hcHBseShjb250ZXh0LFsgMCwgdG90YWxzaXplIF0pO1xyXG5cdFx0XHRcdCBBUEkuZnMucm9vdC5nZXRGaWxlKHRlbXBmbiwge2NyZWF0ZTogMSwgZXhjbHVzaXZlOiBmYWxzZX0sIGZ1bmN0aW9uKF9maWxlRW50cnkpIHtcclxuXHRcdFx0XHRcdFx0XHRmaWxlRW50cnk9X2ZpbGVFbnRyeTtcclxuXHRcdFx0XHRcdFx0YmF0Y2goMCk7XHJcblx0XHRcdFx0IH0pO1xyXG5cdFx0XHR9LHRoaXMpO1xyXG5cdFx0fVxyXG5cdH0pO1xyXG59XHJcblxyXG52YXIgcmVhZEZpbGU9ZnVuY3Rpb24oZmlsZW5hbWUsY2IsY29udGV4dCkge1xyXG5cdEFQSS5mcy5yb290LmdldEZpbGUoZmlsZW5hbWUsIGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xyXG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcclxuXHRcdFx0cmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGlmIChjYikgY2IuYXBwbHkoY2IsW3RoaXMucmVzdWx0XSk7XHJcblx0XHRcdFx0fTsgICAgICAgICAgICBcclxuXHR9LCBjb25zb2xlLmVycm9yKTtcclxufVxyXG52YXIgd3JpdGVGaWxlPWZ1bmN0aW9uKGZpbGVuYW1lLGJ1ZixjYixjb250ZXh0KXtcclxuXHRBUEkuZnMucm9vdC5nZXRGaWxlKGZpbGVuYW1lLCB7Y3JlYXRlOiB0cnVlLCBleGNsdXNpdmU6IHRydWV9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcclxuXHRcdFx0ZmlsZUVudHJ5LmNyZWF0ZVdyaXRlcihmdW5jdGlvbihmaWxlV3JpdGVyKSB7XHJcblx0XHRcdFx0ZmlsZVdyaXRlci53cml0ZShidWYpO1xyXG5cdFx0XHRcdGZpbGVXcml0ZXIub253cml0ZWVuZCA9IGZ1bmN0aW9uKGUpIHtcclxuXHRcdFx0XHRcdGlmIChjYikgY2IuYXBwbHkoY2IsW2J1Zi5ieXRlTGVuZ3RoXSk7XHJcblx0XHRcdFx0fTsgICAgICAgICAgICBcclxuXHRcdFx0fSwgY29uc29sZS5lcnJvcik7XHJcblx0fSwgY29uc29sZS5lcnJvcik7XHJcbn1cclxuXHJcbnZhciByZWFkZGlyPWZ1bmN0aW9uKGNiLGNvbnRleHQpIHtcclxuXHR2YXIgZGlyUmVhZGVyID0gQVBJLmZzLnJvb3QuY3JlYXRlUmVhZGVyKCk7XHJcblx0dmFyIG91dD1bXSx0aGF0PXRoaXM7XHJcblx0ZGlyUmVhZGVyLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGVudHJpZXMpIHtcclxuXHRcdGlmIChlbnRyaWVzLmxlbmd0aCkge1xyXG5cdFx0XHRmb3IgKHZhciBpID0gMCwgZW50cnk7IGVudHJ5ID0gZW50cmllc1tpXTsgKytpKSB7XHJcblx0XHRcdFx0aWYgKGVudHJ5LmlzRmlsZSkge1xyXG5cdFx0XHRcdFx0b3V0LnB1c2goW2VudHJ5Lm5hbWUsZW50cnkudG9VUkwgPyBlbnRyeS50b1VSTCgpIDogZW50cnkudG9VUkkoKV0pO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0QVBJLmZpbGVzPW91dDtcclxuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbb3V0XSk7XHJcblx0fSwgZnVuY3Rpb24oKXtcclxuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbbnVsbF0pO1xyXG5cdH0pO1xyXG59XHJcbnZhciBnZXRGaWxlVVJMPWZ1bmN0aW9uKGZpbGVuYW1lKSB7XHJcblx0aWYgKCFBUEkuZmlsZXMgKSByZXR1cm4gbnVsbDtcclxuXHR2YXIgZmlsZT0gQVBJLmZpbGVzLmZpbHRlcihmdW5jdGlvbihmKXtyZXR1cm4gZlswXT09ZmlsZW5hbWV9KTtcclxuXHRpZiAoZmlsZS5sZW5ndGgpIHJldHVybiBmaWxlWzBdWzFdO1xyXG59XHJcbnZhciBybT1mdW5jdGlvbihmaWxlbmFtZSxjYixjb250ZXh0KSB7XHJcblx0dmFyIHVybD1nZXRGaWxlVVJMKGZpbGVuYW1lKTtcclxuXHRpZiAodXJsKSBybVVSTCh1cmwsY2IsY29udGV4dCk7XHJcblx0ZWxzZSBpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2ZhbHNlXSk7XHJcbn1cclxuXHJcbnZhciBybVVSTD1mdW5jdGlvbihmaWxlbmFtZSxjYixjb250ZXh0KSB7XHJcblx0d2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlbmFtZSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XHJcblx0XHRmaWxlRW50cnkucmVtb3ZlKGZ1bmN0aW9uKCkge1xyXG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW3RydWVdKTtcclxuXHRcdH0sIGNvbnNvbGUuZXJyb3IpO1xyXG5cdH0sICBmdW5jdGlvbihlKXtcclxuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbZmFsc2VdKTsvL25vIHN1Y2ggZmlsZVxyXG5cdH0pO1xyXG59XHJcbmZ1bmN0aW9uIGVycm9ySGFuZGxlcihlKSB7XHJcblx0Y29uc29sZS5lcnJvcignRXJyb3I6ICcgK2UubmFtZSsgXCIgXCIrZS5tZXNzYWdlKTtcclxufVxyXG52YXIgaW5pdGZzPWZ1bmN0aW9uKGdyYW50ZWRCeXRlcyxjYixjb250ZXh0KSB7XHJcblx0d2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0oUEVSU0lTVEVOVCwgZ3JhbnRlZEJ5dGVzLCAgZnVuY3Rpb24oZnMpIHtcclxuXHRcdEFQSS5mcz1mcztcclxuXHRcdEFQSS5xdW90YT1ncmFudGVkQnl0ZXM7XHJcblx0XHRyZWFkZGlyKGZ1bmN0aW9uKCl7XHJcblx0XHRcdEFQSS5pbml0aWFsaXplZD10cnVlO1xyXG5cdFx0XHRjYi5hcHBseShjb250ZXh0LFtncmFudGVkQnl0ZXMsZnNdKTtcclxuXHRcdH0sY29udGV4dCk7XHJcblx0fSwgZXJyb3JIYW5kbGVyKTtcclxufVxyXG52YXIgaW5pdD1mdW5jdGlvbihxdW90YSxjYixjb250ZXh0KSB7XHJcblx0bmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlLnJlcXVlc3RRdW90YShxdW90YSwgXHJcblx0XHRcdGZ1bmN0aW9uKGdyYW50ZWRCeXRlcykge1xyXG5cdFx0XHRcdGluaXRmcyhncmFudGVkQnl0ZXMsY2IsY29udGV4dCk7XHJcblx0XHR9LCBlcnJvckhhbmRsZXJcclxuXHQpO1xyXG59XHJcbnZhciBxdWVyeVF1b3RhPWZ1bmN0aW9uKGNiLGNvbnRleHQpIHtcclxuXHR2YXIgdGhhdD10aGlzO1xyXG5cdG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZS5xdWVyeVVzYWdlQW5kUXVvdGEoIFxyXG5cdCBmdW5jdGlvbih1c2FnZSxxdW90YSl7XHJcblx0XHRcdGluaXRmcyhxdW90YSxmdW5jdGlvbigpe1xyXG5cdFx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW3VzYWdlLHF1b3RhXSk7XHJcblx0XHRcdH0sY29udGV4dCk7XHJcblx0fSk7XHJcbn1cclxudmFyIEFQST17XHJcblx0aW5pdDppbml0XHJcblx0LHJlYWRkaXI6cmVhZGRpclxyXG5cdCxjaGVja1VwZGF0ZTpjaGVja1VwZGF0ZVxyXG5cdCxybTpybVxyXG5cdCxybVVSTDpybVVSTFxyXG5cdCxnZXRGaWxlVVJMOmdldEZpbGVVUkxcclxuXHQsd3JpdGVGaWxlOndyaXRlRmlsZVxyXG5cdCxyZWFkRmlsZTpyZWFkRmlsZVxyXG5cdCxkb3dubG9hZDpkb3dubG9hZFxyXG5cdCxnZXRfaGVhZDpnZXRfaGVhZFxyXG5cdCxnZXRfZGF0ZTpnZXRfZGF0ZVxyXG5cdCxnZXRfc2l6ZTpnZXRfc2l6ZVxyXG5cdCxnZXREb3dubG9hZFNpemU6Z2V0X3NpemVcclxuXHQscXVlcnlRdW90YTpxdWVyeVF1b3RhXHJcbn1cclxubW9kdWxlLmV4cG9ydHM9QVBJOyIsInZhciBodG1sNWZzPXJlcXVpcmUoXCIuL2h0bWw1ZnNcIik7XHJcbnZhciBFPVJlYWN0LmNyZWF0ZUVsZW1lbnQ7XHJcblxyXG52YXIgaHRtbGZzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHsgXHJcblx0XHRyZXR1cm4ge3JlYWR5OmZhbHNlLCBxdW90YTowLHVzYWdlOjAsSW5pdGlhbGl6ZWQ6ZmFsc2UsYXV0b2Nsb3NlOnRoaXMucHJvcHMuYXV0b2Nsb3NlfTtcclxuXHR9LFxyXG5cdGluaXRGaWxlc3lzdGVtOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHF1b3RhPXRoaXMucHJvcHMucXVvdGF8fDEwMjQqMTAyNCoxMjg7IC8vIGRlZmF1bHQgMTI4TUJcclxuXHRcdHF1b3RhPXBhcnNlSW50KHF1b3RhKTtcclxuXHRcdGh0bWw1ZnMuaW5pdChxdW90YSxmdW5jdGlvbihxKXtcclxuXHRcdFx0dGhpcy5kaWFsb2c9ZmFsc2U7XHJcblx0XHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHtxdW90YTpxLGF1dG9jbG9zZTp0cnVlfSk7XHJcblx0XHR9LHRoaXMpO1xyXG5cdH0sXHJcblx0d2VsY29tZTpmdW5jdGlvbigpIHtcclxuXHRcdHJldHVybiAoXHJcblx0XHRFKFwiZGl2XCIsIHtyZWY6IFwiZGlhbG9nMVwiLCBjbGFzc05hbWU6IFwibW9kYWwgZmFkZVwiLCBpZDogXCJteU1vZGFsXCIsIFwiZGF0YS1iYWNrZHJvcFwiOiBcInN0YXRpY1wifSwgXHJcblx0XHQgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWRpYWxvZ1wifSwgXHJcblx0XHQgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtY29udGVudFwifSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1oZWFkZXJcIn0sIFxyXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIldlbGNvbWVcIilcclxuXHRcdCAgICAgICAgKSwgXHJcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcclxuXHRcdCAgICAgICAgICBcIkJyb3dzZXIgd2lsbCBhc2sgZm9yIHlvdXIgY29uZmlybWF0aW9uLlwiXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmluaXRGaWxlc3lzdGVtLCB0eXBlOiBcImJ1dHRvblwiLCBcclxuXHRcdCAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIn0sIFwiSW5pdGlhbGl6ZSBGaWxlIFN5c3RlbVwiKVxyXG5cdFx0ICAgICAgICApXHJcblx0XHQgICAgICApXHJcblx0XHQgICAgKVxyXG5cdFx0ICApXHJcblx0XHQgKTtcclxuXHR9LFxyXG5cdHJlbmRlckRlZmF1bHQ6ZnVuY3Rpb24oKXtcclxuXHRcdHZhciB1c2VkPU1hdGguZmxvb3IodGhpcy5zdGF0ZS51c2FnZS90aGlzLnN0YXRlLnF1b3RhICoxMDApO1xyXG5cdFx0dmFyIG1vcmU9ZnVuY3Rpb24oKSB7XHJcblx0XHRcdGlmICh1c2VkPjUwKSByZXR1cm4gRShcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwifSwgXCJBbGxvY2F0ZSBNb3JlXCIpO1xyXG5cdFx0XHRlbHNlIG51bGw7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gKFxyXG5cdFx0RShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgaWQ6IFwibXlNb2RhbFwiLCBcImRhdGEtYmFja2Ryb3BcIjogXCJzdGF0aWNcIn0sIFxyXG5cdFx0ICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1kaWFsb2dcIn0sIFxyXG5cdFx0ICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWNvbnRlbnRcIn0sIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtaGVhZGVyXCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwiaDRcIiwge2NsYXNzTmFtZTogXCJtb2RhbC10aXRsZVwifSwgXCJTYW5kYm94IEZpbGUgU3lzdGVtXCIpXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtYm9keVwifSwgXHJcblx0XHQgICAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByb2dyZXNzXCJ9LCBcclxuXHRcdCAgICAgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwcm9ncmVzcy1iYXJcIiwgcm9sZTogXCJwcm9ncmVzc2JhclwiLCBzdHlsZToge3dpZHRoOiB1c2VkK1wiJVwifX0sIFxyXG5cdFx0ICAgICAgICAgICAgICAgdXNlZCwgXCIlXCJcclxuXHRcdCAgICAgICAgICAgIClcclxuXHRcdCAgICAgICAgICApLCBcclxuXHRcdCAgICAgICAgICBFKFwic3BhblwiLCBudWxsLCB0aGlzLnN0YXRlLnF1b3RhLCBcIiB0b3RhbCAsIFwiLCB0aGlzLnN0YXRlLnVzYWdlLCBcIiBpbiB1c2VkXCIpXHJcblx0XHQgICAgICAgICksIFxyXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcclxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmRpc21pc3MsIHR5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHRcIiwgXCJkYXRhLWRpc21pc3NcIjogXCJtb2RhbFwifSwgXCJDbG9zZVwiKSwgXHJcblx0XHQgICAgICAgICAgbW9yZSgpXHJcblx0XHQgICAgICAgIClcclxuXHRcdCAgICAgIClcclxuXHRcdCAgICApXHJcblx0XHQgIClcclxuXHRcdCAgKTtcclxuXHR9LFxyXG5cdGRpc21pc3M6ZnVuY3Rpb24oKSB7XHJcblx0XHR2YXIgdGhhdD10aGlzO1xyXG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xyXG5cdFx0XHR0aGF0LnByb3BzLm9uUmVhZHkodGhhdC5zdGF0ZS5xdW90YSx0aGF0LnN0YXRlLnVzYWdlKTtcdFxyXG5cdFx0fSwwKTtcclxuXHR9LFxyXG5cdHF1ZXJ5UXVvdGE6ZnVuY3Rpb24oKSB7XHJcblx0XHRpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwiY2hyb21lXCIpIHtcclxuXHRcdFx0aHRtbDVmcy5xdWVyeVF1b3RhKGZ1bmN0aW9uKHVzYWdlLHF1b3RhKXtcclxuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHt1c2FnZTp1c2FnZSxxdW90YTpxdW90YSxpbml0aWFsaXplZDp0cnVlfSk7XHJcblx0XHRcdH0sdGhpcyk7XHRcdFx0XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKHt1c2FnZTozMzMscXVvdGE6MTAwMCoxMDAwKjEwMjQsaW5pdGlhbGl6ZWQ6dHJ1ZSxhdXRvY2xvc2U6dHJ1ZX0pO1xyXG5cdFx0fVxyXG5cdH0sXHJcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xyXG5cdFx0dmFyIHRoYXQ9dGhpcztcclxuXHRcdGlmICghdGhpcy5zdGF0ZS5xdW90YSB8fCB0aGlzLnN0YXRlLnF1b3RhPHRoaXMucHJvcHMucXVvdGEpIHtcclxuXHRcdFx0aWYgKHRoaXMuc3RhdGUuaW5pdGlhbGl6ZWQpIHtcclxuXHRcdFx0XHR0aGlzLmRpYWxvZz10cnVlO1xyXG5cdFx0XHRcdHJldHVybiB0aGlzLndlbGNvbWUoKTtcdFxyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdHJldHVybiBFKFwic3BhblwiLCBudWxsLCBcImNoZWNraW5nIHF1b3RhXCIpO1xyXG5cdFx0XHR9XHRcdFx0XHJcblx0XHR9IGVsc2Uge1xyXG5cdFx0XHRpZiAoIXRoaXMuc3RhdGUuYXV0b2Nsb3NlKSB7XHJcblx0XHRcdFx0dGhpcy5kaWFsb2c9dHJ1ZTtcclxuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJEZWZhdWx0KCk7IFxyXG5cdFx0XHR9XHJcblx0XHRcdHRoaXMuZGlzbWlzcygpO1xyXG5cdFx0XHR0aGlzLmRpYWxvZz1mYWxzZTtcclxuXHRcdFx0cmV0dXJuIG51bGw7XHJcblx0XHR9XHJcblx0fSxcclxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcclxuXHRcdGlmICghdGhpcy5zdGF0ZS5xdW90YSkge1xyXG5cdFx0XHR0aGlzLnF1ZXJ5UXVvdGEoKTtcclxuXHJcblx0XHR9O1xyXG5cdH0sXHJcblx0Y29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuZGlhbG9nKSAkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcclxuXHR9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHM9aHRtbGZzOyIsInZhciBrc2FuYT17XCJwbGF0Zm9ybVwiOlwicmVtb3RlXCJ9O1xyXG5pZiAodHlwZW9mIHdpbmRvdyE9XCJ1bmRlZmluZWRcIikge1xyXG5cdHdpbmRvdy5rc2FuYT1rc2FuYTtcclxuXHRpZiAodHlwZW9mIGtzYW5hZ2FwPT1cInVuZGVmaW5lZFwiKSB7XHJcblx0XHR3aW5kb3cua3NhbmFnYXA9cmVxdWlyZShcIi4va3NhbmFnYXBcIik7IC8vY29tcGF0aWJsZSBsYXllciB3aXRoIG1vYmlsZVxyXG5cdH1cclxufVxyXG5pZiAodHlwZW9mIHByb2Nlc3MgIT1cInVuZGVmaW5lZFwiKSB7XHJcblx0aWYgKHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9uc1tcIm5vZGUtd2Via2l0XCJdKSB7XHJcbiAgXHRcdGlmICh0eXBlb2Ygbm9kZVJlcXVpcmUhPVwidW5kZWZpbmVkXCIpIGtzYW5hLnJlcXVpcmU9bm9kZVJlcXVpcmU7XHJcbiAgXHRcdGtzYW5hLnBsYXRmb3JtPVwibm9kZS13ZWJraXRcIjtcclxuICBcdFx0d2luZG93LmtzYW5hZ2FwLnBsYXRmb3JtPVwibm9kZS13ZWJraXRcIjtcclxuXHRcdHZhciBrc2FuYWpzPXJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoXCJrc2FuYS5qc1wiLFwidXRmOFwiKS50cmltKCk7XHJcblx0XHRrc2FuYS5qcz1KU09OLnBhcnNlKGtzYW5hanMuc3Vic3RyaW5nKDE0LGtzYW5hanMubGVuZ3RoLTEpKTtcclxuXHRcdHdpbmRvdy5rZnM9cmVxdWlyZShcIi4va2ZzXCIpO1xyXG4gIFx0fVxyXG59IGVsc2UgaWYgKHR5cGVvZiBjaHJvbWUhPVwidW5kZWZpbmVkXCIpey8vfSAmJiBjaHJvbWUuZmlsZVN5c3RlbSl7XHJcbi8vXHR3aW5kb3cua3NhbmFnYXA9cmVxdWlyZShcIi4va3NhbmFnYXBcIik7IC8vY29tcGF0aWJsZSBsYXllciB3aXRoIG1vYmlsZVxyXG5cdHdpbmRvdy5rc2FuYWdhcC5wbGF0Zm9ybT1cImNocm9tZVwiO1xyXG5cdHdpbmRvdy5rZnM9cmVxdWlyZShcIi4va2ZzX2h0bWw1XCIpO1xyXG5cdHJlcXVpcmUoXCIuL2xpdmVyZWxvYWRcIikoKTtcclxuXHRrc2FuYS5wbGF0Zm9ybT1cImNocm9tZVwiO1xyXG59IGVsc2Uge1xyXG5cdGlmICh0eXBlb2Yga3NhbmFnYXAhPVwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGZzIT1cInVuZGVmaW5lZFwiKSB7Ly9tb2JpbGVcclxuXHRcdHZhciBrc2FuYWpzPWZzLnJlYWRGaWxlU3luYyhcImtzYW5hLmpzXCIsXCJ1dGY4XCIpLnRyaW0oKTsgLy9hbmRyb2lkIGV4dHJhIFxcbiBhdCB0aGUgZW5kXHJcblx0XHRrc2FuYS5qcz1KU09OLnBhcnNlKGtzYW5hanMuc3Vic3RyaW5nKDE0LGtzYW5hanMubGVuZ3RoLTEpKTtcclxuXHRcdGtzYW5hLnBsYXRmb3JtPWtzYW5hZ2FwLnBsYXRmb3JtO1xyXG5cdFx0aWYgKHR5cGVvZiBrc2FuYWdhcC5hbmRyb2lkICE9XCJ1bmRlZmluZWRcIikge1xyXG5cdFx0XHRrc2FuYS5wbGF0Zm9ybT1cImFuZHJvaWRcIjtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxudmFyIHRpbWVyPW51bGw7XHJcbnZhciBib290PWZ1bmN0aW9uKGFwcElkLGNiKSB7XHJcblx0a3NhbmEuYXBwSWQ9YXBwSWQ7XHJcblx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cImNocm9tZVwiKSB7IC8vbmVlZCB0byB3YWl0IGZvciBqc29ucCBrc2FuYS5qc1xyXG5cdFx0dGltZXI9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdFx0aWYgKGtzYW5hLnJlYWR5KXtcclxuXHRcdFx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcclxuXHRcdFx0XHRpZiAoa3NhbmEuanMgJiYga3NhbmEuanMuZmlsZXMgJiYga3NhbmEuanMuZmlsZXMubGVuZ3RoKSB7XHJcblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9pbnN0YWxsa2RiXCIpKGtzYW5hLmpzLGNiKTtcclxuXHRcdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdFx0Y2IoKTtcdFx0XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9LDMwMCk7XHJcblx0fSBlbHNlIHtcclxuXHRcdGNiKCk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cz17Ym9vdDpib290XHJcblx0LGh0bWxmczpyZXF1aXJlKFwiLi9odG1sZnNcIilcclxuXHQsaHRtbDVmczpyZXF1aXJlKFwiLi9odG1sNWZzXCIpXHJcblx0LGxpdmV1cGRhdGU6cmVxdWlyZShcIi4vbGl2ZXVwZGF0ZVwiKVxyXG5cdCxmaWxlaW5zdGFsbGVyOnJlcXVpcmUoXCIuL2ZpbGVpbnN0YWxsZXJcIilcclxuXHQsZG93bmxvYWRlcjpyZXF1aXJlKFwiLi9kb3dubG9hZGVyXCIpXHJcblx0LGluc3RhbGxrZGI6cmVxdWlyZShcIi4vaW5zdGFsbGtkYlwiKVxyXG59OyIsInZhciBGaWxlaW5zdGFsbGVyPXJlcXVpcmUoXCIuL2ZpbGVpbnN0YWxsZXJcIik7XHJcblxyXG52YXIgZ2V0UmVxdWlyZV9rZGI9ZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgcmVxdWlyZWQ9W107XHJcbiAgICBrc2FuYS5qcy5maWxlcy5tYXAoZnVuY3Rpb24oZil7XHJcbiAgICAgIGlmIChmLmluZGV4T2YoXCIua2RiXCIpPT1mLmxlbmd0aC00KSB7XHJcbiAgICAgICAgdmFyIHNsYXNoPWYubGFzdEluZGV4T2YoXCIvXCIpO1xyXG4gICAgICAgIGlmIChzbGFzaD4tMSkge1xyXG4gICAgICAgICAgdmFyIGRiaWQ9Zi5zdWJzdHJpbmcoc2xhc2grMSxmLmxlbmd0aC00KTtcclxuICAgICAgICAgIHJlcXVpcmVkLnB1c2goe3VybDpmLGRiaWQ6ZGJpZCxmaWxlbmFtZTpkYmlkK1wiLmtkYlwifSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhciBkYmlkPWYuc3Vic3RyaW5nKDAsZi5sZW5ndGgtNCk7XHJcbiAgICAgICAgICByZXF1aXJlZC5wdXNoKHt1cmw6a3NhbmEuanMuYmFzZXVybCtmLGRiaWQ6ZGJpZCxmaWxlbmFtZTpmfSk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcXVpcmVkO1xyXG59XHJcbnZhciBjYWxsYmFjaz1udWxsO1xyXG52YXIgb25SZWFkeT1mdW5jdGlvbigpIHtcclxuXHRjYWxsYmFjaygpO1xyXG59XHJcbnZhciBvcGVuRmlsZWluc3RhbGxlcj1mdW5jdGlvbihrZWVwKSB7XHJcblx0dmFyIHJlcXVpcmVfa2RiPWdldFJlcXVpcmVfa2RiKCkubWFwKGZ1bmN0aW9uKGRiKXtcclxuXHQgIHJldHVybiB7XHJcblx0ICAgIHVybDp3aW5kb3cubG9jYXRpb24ub3JpZ2luK3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZStkYi5kYmlkK1wiLmtkYlwiLFxyXG5cdCAgICBkYmRiOmRiLmRiaWQsXHJcblx0ICAgIGZpbGVuYW1lOmRiLmZpbGVuYW1lXHJcblx0ICB9XHJcblx0fSlcclxuXHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlaW5zdGFsbGVyLCB7cXVvdGE6IFwiNTEyTVwiLCBhdXRvY2xvc2U6ICFrZWVwLCBuZWVkZWQ6IHJlcXVpcmVfa2RiLCBcclxuXHQgICAgICAgICAgICAgICAgIG9uUmVhZHk6IG9uUmVhZHl9KTtcclxufVxyXG52YXIgaW5zdGFsbGtkYj1mdW5jdGlvbihrc2FuYWpzLGNiLGNvbnRleHQpIHtcclxuXHRjb25zb2xlLmxvZyhrc2FuYWpzLmZpbGVzKTtcclxuXHRSZWFjdC5yZW5kZXIob3BlbkZpbGVpbnN0YWxsZXIoKSxkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xyXG5cdGNhbGxiYWNrPWNiO1xyXG59XHJcbm1vZHVsZS5leHBvcnRzPWluc3RhbGxrZGI7IiwiLy9TaW11bGF0ZSBmZWF0dXJlIGluIGtzYW5hZ2FwXHJcbi8qIFxyXG4gIHJ1bnMgb24gbm9kZS13ZWJraXQgb25seVxyXG4qL1xyXG5cclxudmFyIHJlYWREaXI9ZnVuY3Rpb24ocGF0aCkgeyAvL3NpbXVsYXRlIEtzYW5hZ2FwIGZ1bmN0aW9uXHJcblx0dmFyIGZzPW5vZGVSZXF1aXJlKFwiZnNcIik7XHJcblx0cGF0aD1wYXRofHxcIi4uXCI7XHJcblx0dmFyIGRpcnM9W107XHJcblx0aWYgKHBhdGhbMF09PVwiLlwiKSB7XHJcblx0XHRpZiAocGF0aD09XCIuXCIpIGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuXCIpO1xyXG5cdFx0ZWxzZSB7XHJcblx0XHRcdGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuLlwiKTtcclxuXHRcdH1cclxuXHR9IGVsc2Uge1xyXG5cdFx0ZGlycz1mcy5yZWFkZGlyU3luYyhwYXRoKTtcclxuXHR9XHJcblxyXG5cdHJldHVybiBkaXJzLmpvaW4oXCJcXHVmZmZmXCIpO1xyXG59XHJcbnZhciBsaXN0QXBwcz1mdW5jdGlvbigpIHtcclxuXHR2YXIgZnM9bm9kZVJlcXVpcmUoXCJmc1wiKTtcclxuXHR2YXIga3NhbmFqc2ZpbGU9ZnVuY3Rpb24oZCkge3JldHVybiBcIi4uL1wiK2QrXCIva3NhbmEuanNcIn07XHJcblx0dmFyIGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuLlwiKS5maWx0ZXIoZnVuY3Rpb24oZCl7XHJcblx0XHRcdFx0cmV0dXJuIGZzLnN0YXRTeW5jKFwiLi4vXCIrZCkuaXNEaXJlY3RvcnkoKSAmJiBkWzBdIT1cIi5cIlxyXG5cdFx0XHRcdCAgICYmIGZzLmV4aXN0c1N5bmMoa3NhbmFqc2ZpbGUoZCkpO1xyXG5cdH0pO1xyXG5cdFxyXG5cdHZhciBvdXQ9ZGlycy5tYXAoZnVuY3Rpb24oZCl7XHJcblx0XHR2YXIgY29udGVudD1mcy5yZWFkRmlsZVN5bmMoa3NhbmFqc2ZpbGUoZCksXCJ1dGY4XCIpO1xyXG4gIFx0Y29udGVudD1jb250ZW50LnJlcGxhY2UoXCJ9KVwiLFwifVwiKTtcclxuICBcdGNvbnRlbnQ9Y29udGVudC5yZXBsYWNlKFwianNvbnBfaGFuZGxlcihcIixcIlwiKTtcclxuXHRcdHZhciBvYmo9IEpTT04ucGFyc2UoY29udGVudCk7XHJcblx0XHRvYmouZGJpZD1kO1xyXG5cdFx0b2JqLnBhdGg9ZDtcclxuXHRcdHJldHVybiBvYmo7XHJcblx0fSlcclxuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkob3V0KTtcclxufVxyXG5cclxuXHJcblxyXG52YXIga2ZzPXtyZWFkRGlyOnJlYWREaXIsbGlzdEFwcHM6bGlzdEFwcHN9O1xyXG5cclxubW9kdWxlLmV4cG9ydHM9a2ZzOyIsInZhciByZWFkRGlyPWZ1bmN0aW9uKCl7XHJcblx0cmV0dXJuIFtdO1xyXG59XHJcbnZhciBsaXN0QXBwcz1mdW5jdGlvbigpe1xyXG5cdHJldHVybiBbXTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cz17cmVhZERpcjpyZWFkRGlyLGxpc3RBcHBzOmxpc3RBcHBzfTsiLCJ2YXIgYXBwbmFtZT1cImluc3RhbGxlclwiO1xyXG52YXIgc3dpdGNoQXBwPWZ1bmN0aW9uKHBhdGgpIHtcclxuXHR2YXIgZnM9cmVxdWlyZShcImZzXCIpO1xyXG5cdHBhdGg9XCIuLi9cIitwYXRoO1xyXG5cdGFwcG5hbWU9cGF0aDtcclxuXHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmPSBwYXRoK1wiL2luZGV4Lmh0bWxcIjsgXHJcblx0cHJvY2Vzcy5jaGRpcihwYXRoKTtcclxufVxyXG52YXIgZG93bmxvYWRlcj17fTtcclxudmFyIHJvb3RQYXRoPVwiXCI7XHJcblxyXG52YXIgZGVsZXRlQXBwPWZ1bmN0aW9uKGFwcCkge1xyXG5cdGNvbnNvbGUuZXJyb3IoXCJub3QgYWxsb3cgb24gUEMsIGRvIGl0IGluIEZpbGUgRXhwbG9yZXIvIEZpbmRlclwiKTtcclxufVxyXG52YXIgdXNlcm5hbWU9ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIFwiXCI7XHJcbn1cclxudmFyIHVzZXJlbWFpbD1mdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gXCJcIlxyXG59XHJcbnZhciBydW50aW1lX3ZlcnNpb249ZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIFwiMS40XCI7XHJcbn1cclxuXHJcbi8vY29weSBmcm9tIGxpdmV1cGRhdGVcclxudmFyIGpzb25wPWZ1bmN0aW9uKHVybCxkYmlkLGNhbGxiYWNrLGNvbnRleHQpIHtcclxuICB2YXIgc2NyaXB0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNvbnAyXCIpO1xyXG4gIGlmIChzY3JpcHQpIHtcclxuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcbiAgfVxyXG4gIHdpbmRvdy5qc29ucF9oYW5kbGVyPWZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIGlmICh0eXBlb2YgZGF0YT09XCJvYmplY3RcIikge1xyXG4gICAgICBkYXRhLmRiaWQ9ZGJpZDtcclxuICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbZGF0YV0pOyAgICBcclxuICAgIH0gIFxyXG4gIH1cclxuICB3aW5kb3cuanNvbnBfZXJyb3JfaGFuZGxlcj1mdW5jdGlvbigpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoXCJ1cmwgdW5yZWFjaGFibGVcIix1cmwpO1xyXG4gICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbbnVsbF0pO1xyXG4gIH1cclxuICBzY3JpcHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnaWQnLCBcImpzb25wMlwiKTtcclxuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdvbmVycm9yJywgXCJqc29ucF9lcnJvcl9oYW5kbGVyKClcIik7XHJcbiAgdXJsPXVybCsnPycrKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcclxuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmwpO1xyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTsgXHJcbn1cclxuXHJcbnZhciBrc2FuYWdhcD17XHJcblx0cGxhdGZvcm06XCJub2RlLXdlYmtpdFwiLFxyXG5cdHN0YXJ0RG93bmxvYWQ6ZG93bmxvYWRlci5zdGFydERvd25sb2FkLFxyXG5cdGRvd25sb2FkZWRCeXRlOmRvd25sb2FkZXIuZG93bmxvYWRlZEJ5dGUsXHJcblx0ZG93bmxvYWRpbmdGaWxlOmRvd25sb2FkZXIuZG93bmxvYWRpbmdGaWxlLFxyXG5cdGNhbmNlbERvd25sb2FkOmRvd25sb2FkZXIuY2FuY2VsRG93bmxvYWQsXHJcblx0ZG9uZURvd25sb2FkOmRvd25sb2FkZXIuZG9uZURvd25sb2FkLFxyXG5cdHN3aXRjaEFwcDpzd2l0Y2hBcHAsXHJcblx0cm9vdFBhdGg6cm9vdFBhdGgsXHJcblx0ZGVsZXRlQXBwOiBkZWxldGVBcHAsXHJcblx0dXNlcm5hbWU6dXNlcm5hbWUsIC8vbm90IHN1cHBvcnQgb24gUENcclxuXHR1c2VyZW1haWw6dXNlcm5hbWUsXHJcblx0cnVudGltZV92ZXJzaW9uOnJ1bnRpbWVfdmVyc2lvbixcclxuXHRcclxufVxyXG5cclxuaWYgKHR5cGVvZiBwcm9jZXNzIT1cInVuZGVmaW5lZFwiKSB7XHJcblx0dmFyIGtzYW5hanM9cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhcIi4va3NhbmEuanNcIixcInV0ZjhcIikudHJpbSgpO1xyXG5cdGRvd25sb2FkZXI9cmVxdWlyZShcIi4vZG93bmxvYWRlclwiKTtcclxuXHRjb25zb2xlLmxvZyhrc2FuYWpzKTtcclxuXHQvL2tzYW5hLmpzPUpTT04ucGFyc2Uoa3NhbmFqcy5zdWJzdHJpbmcoMTQsa3NhbmFqcy5sZW5ndGgtMSkpO1xyXG5cdHJvb3RQYXRoPXByb2Nlc3MuY3dkKCk7XHJcblx0cm9vdFBhdGg9cmVxdWlyZShcInBhdGhcIikucmVzb2x2ZShyb290UGF0aCxcIi4uXCIpLnJlcGxhY2UoL1xcXFwvZyxcIi9cIikrJy8nO1xyXG5cdGtzYW5hLnJlYWR5PXRydWU7XHJcbn0gZWxzZXtcclxuXHR2YXIgdXJsPXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoXCJpbmRleC5odG1sXCIsXCJcIikrXCJrc2FuYS5qc1wiO1xyXG5cdGpzb25wKHVybCxhcHBuYW1lLGZ1bmN0aW9uKGRhdGEpe1xyXG5cdFx0a3NhbmEuanM9ZGF0YTtcclxuXHRcdGtzYW5hLnJlYWR5PXRydWU7XHJcblx0fSk7XHJcbn1cclxubW9kdWxlLmV4cG9ydHM9a3NhbmFnYXA7IiwidmFyIHN0YXJ0ZWQ9ZmFsc2U7XHJcbnZhciB0aW1lcj1udWxsO1xyXG52YXIgYnVuZGxlZGF0ZT1udWxsO1xyXG52YXIgZ2V0X2RhdGU9cmVxdWlyZShcIi4vaHRtbDVmc1wiKS5nZXRfZGF0ZTtcclxudmFyIGNoZWNrSWZCdW5kbGVVcGRhdGVkPWZ1bmN0aW9uKCkge1xyXG5cdGdldF9kYXRlKFwiYnVuZGxlLmpzXCIsZnVuY3Rpb24oZGF0ZSl7XHJcblx0XHRpZiAoYnVuZGxlZGF0ZSAmJmJ1bmRsZWRhdGUhPWRhdGUpe1xyXG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcclxuXHRcdH1cclxuXHRcdGJ1bmRsZWRhdGU9ZGF0ZTtcclxuXHR9KTtcclxufVxyXG52YXIgbGl2ZXJlbG9hZD1mdW5jdGlvbigpIHtcclxuXHRpZiAoc3RhcnRlZCkgcmV0dXJuO1xyXG5cclxuXHR0aW1lcjE9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcclxuXHRcdGNoZWNrSWZCdW5kbGVVcGRhdGVkKCk7XHJcblx0fSwyMDAwKTtcclxuXHRzdGFydGVkPXRydWU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzPWxpdmVyZWxvYWQ7IiwiXHJcbnZhciBqc29ucD1mdW5jdGlvbih1cmwsZGJpZCxjYWxsYmFjayxjb250ZXh0KSB7XHJcbiAgdmFyIHNjcmlwdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzb25wXCIpO1xyXG4gIGlmIChzY3JpcHQpIHtcclxuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XHJcbiAgfVxyXG4gIHdpbmRvdy5qc29ucF9oYW5kbGVyPWZ1bmN0aW9uKGRhdGEpIHtcclxuICAgIC8vY29uc29sZS5sb2coXCJyZWNlaXZlIGZyb20ga3NhbmEuanNcIixkYXRhKTtcclxuICAgIGlmICh0eXBlb2YgZGF0YT09XCJvYmplY3RcIikge1xyXG4gICAgICBpZiAodHlwZW9mIGRhdGEuZGJpZD09XCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgIGRhdGEuZGJpZD1kYmlkO1xyXG4gICAgICB9XHJcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW2RhdGFdKTtcclxuICAgIH0gIFxyXG4gIH1cclxuXHJcbiAgd2luZG93Lmpzb25wX2Vycm9yX2hhbmRsZXI9ZnVuY3Rpb24oKSB7XHJcbiAgICBjb25zb2xlLmVycm9yKFwidXJsIHVucmVhY2hhYmxlXCIsdXJsKTtcclxuICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW251bGxdKTtcclxuICB9XHJcblxyXG4gIHNjcmlwdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcclxuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdpZCcsIFwianNvbnBcIik7XHJcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnb25lcnJvcicsIFwianNvbnBfZXJyb3JfaGFuZGxlcigpXCIpO1xyXG4gIHVybD11cmwrJz8nKyhuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKTtcclxuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7IFxyXG59XHJcbnZhciBydW50aW1lX3ZlcnNpb25fb2s9ZnVuY3Rpb24obWlucnVudGltZSkge1xyXG4gIGlmICghbWlucnVudGltZSkgcmV0dXJuIHRydWU7Ly9ub3QgbWVudGlvbmVkLlxyXG4gIHZhciBtaW49cGFyc2VGbG9hdChtaW5ydW50aW1lKTtcclxuICB2YXIgcnVudGltZT1wYXJzZUZsb2F0KCBrc2FuYWdhcC5ydW50aW1lX3ZlcnNpb24oKXx8XCIxLjBcIik7XHJcbiAgaWYgKG1pbj5ydW50aW1lKSByZXR1cm4gZmFsc2U7XHJcbiAgcmV0dXJuIHRydWU7XHJcbn1cclxuXHJcbnZhciBuZWVkVG9VcGRhdGU9ZnVuY3Rpb24oZnJvbWpzb24sdG9qc29uKSB7XHJcbiAgdmFyIG5lZWRVcGRhdGVzPVtdO1xyXG4gIGZvciAodmFyIGk9MDtpPGZyb21qc29uLmxlbmd0aDtpKyspIHsgXHJcbiAgICB2YXIgdG89dG9qc29uW2ldO1xyXG4gICAgdmFyIGZyb209ZnJvbWpzb25baV07XHJcbiAgICB2YXIgbmV3ZmlsZXM9W10sbmV3ZmlsZXNpemVzPVtdLHJlbW92ZWQ9W107XHJcbiAgICBcclxuICAgIGlmICghdG8pIGNvbnRpbnVlOyAvL2Nhbm5vdCByZWFjaCBob3N0XHJcbiAgICBpZiAoIXJ1bnRpbWVfdmVyc2lvbl9vayh0by5taW5ydW50aW1lKSkge1xyXG4gICAgICBjb25zb2xlLndhcm4oXCJydW50aW1lIHRvbyBvbGQsIG5lZWQgXCIrdG8ubWlucnVudGltZSk7XHJcbiAgICAgIGNvbnRpbnVlOyBcclxuICAgIH1cclxuICAgIGlmICghZnJvbS5maWxlZGF0ZXMpIHtcclxuICAgICAgY29uc29sZS53YXJuKFwibWlzc2luZyBmaWxlZGF0ZXMgaW4ga3NhbmEuanMgb2YgXCIrZnJvbS5kYmlkKTtcclxuICAgICAgY29udGludWU7XHJcbiAgICB9XHJcbiAgICBmcm9tLmZpbGVkYXRlcy5tYXAoZnVuY3Rpb24oZixpZHgpe1xyXG4gICAgICB2YXIgbmV3aWR4PXRvLmZpbGVzLmluZGV4T2YoIGZyb20uZmlsZXNbaWR4XSk7XHJcbiAgICAgIGlmIChuZXdpZHg9PS0xKSB7XHJcbiAgICAgICAgLy9maWxlIHJlbW92ZWQgaW4gbmV3IHZlcnNpb25cclxuICAgICAgICByZW1vdmVkLnB1c2goZnJvbS5maWxlc1tpZHhdKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgZnJvbWRhdGU9RGF0ZS5wYXJzZShmKTtcclxuICAgICAgICB2YXIgdG9kYXRlPURhdGUucGFyc2UodG8uZmlsZWRhdGVzW25ld2lkeF0pO1xyXG4gICAgICAgIGlmIChmcm9tZGF0ZTx0b2RhdGUpIHtcclxuICAgICAgICAgIG5ld2ZpbGVzLnB1c2goIHRvLmZpbGVzW25ld2lkeF0gKTtcclxuICAgICAgICAgIG5ld2ZpbGVzaXplcy5wdXNoKHRvLmZpbGVzaXplc1tuZXdpZHhdKTtcclxuICAgICAgICB9ICAgICAgICBcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICBpZiAobmV3ZmlsZXMubGVuZ3RoKSB7XHJcbiAgICAgIGZyb20ubmV3ZmlsZXM9bmV3ZmlsZXM7XHJcbiAgICAgIGZyb20ubmV3ZmlsZXNpemVzPW5ld2ZpbGVzaXplcztcclxuICAgICAgZnJvbS5yZW1vdmVkPXJlbW92ZWQ7XHJcbiAgICAgIG5lZWRVcGRhdGVzLnB1c2goZnJvbSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBuZWVkVXBkYXRlcztcclxufVxyXG52YXIgZ2V0VXBkYXRhYmxlcz1mdW5jdGlvbihhcHBzLGNiLGNvbnRleHQpIHtcclxuICBnZXRSZW1vdGVKc29uKGFwcHMsZnVuY3Rpb24oanNvbnMpe1xyXG4gICAgdmFyIGhhc1VwZGF0ZXM9bmVlZFRvVXBkYXRlKGFwcHMsanNvbnMpO1xyXG4gICAgY2IuYXBwbHkoY29udGV4dCxbaGFzVXBkYXRlc10pO1xyXG4gIH0sY29udGV4dCk7XHJcbn1cclxudmFyIGdldFJlbW90ZUpzb249ZnVuY3Rpb24oYXBwcyxjYixjb250ZXh0KSB7XHJcbiAgdmFyIHRhc2txdWV1ZT1bXSxvdXRwdXQ9W107XHJcbiAgdmFyIG1ha2VjYj1mdW5jdGlvbihhcHApe1xyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgIGlmICghKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSBvdXRwdXQucHVzaChkYXRhKTtcclxuICAgICAgICBpZiAoIWFwcC5iYXNldXJsKSB7XHJcbiAgICAgICAgICB0YXNrcXVldWUuc2hpZnQoe19fZW1wdHk6dHJ1ZX0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YXIgdXJsPWFwcC5iYXNldXJsK1wiL2tzYW5hLmpzXCI7ICAgIFxyXG4gICAgICAgICAgY29uc29sZS5sb2codXJsKTtcclxuICAgICAgICAgIGpzb25wKCB1cmwgLGFwcC5kYmlkLHRhc2txdWV1ZS5zaGlmdCgpLCBjb250ZXh0KTsgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgfTtcclxuICBhcHBzLmZvckVhY2goZnVuY3Rpb24oYXBwKXt0YXNrcXVldWUucHVzaChtYWtlY2IoYXBwKSl9KTtcclxuXHJcbiAgdGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHJcbiAgICBvdXRwdXQucHVzaChkYXRhKTtcclxuICAgIGNiLmFwcGx5KGNvbnRleHQsW291dHB1dF0pO1xyXG4gIH0pO1xyXG5cclxuICB0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7IC8vcnVuIHRoZSB0YXNrXHJcbn1cclxudmFyIGh1bWFuRmlsZVNpemU9ZnVuY3Rpb24oYnl0ZXMsIHNpKSB7XHJcbiAgICB2YXIgdGhyZXNoID0gc2kgPyAxMDAwIDogMTAyNDtcclxuICAgIGlmKGJ5dGVzIDwgdGhyZXNoKSByZXR1cm4gYnl0ZXMgKyAnIEInO1xyXG4gICAgdmFyIHVuaXRzID0gc2kgPyBbJ2tCJywnTUInLCdHQicsJ1RCJywnUEInLCdFQicsJ1pCJywnWUInXSA6IFsnS2lCJywnTWlCJywnR2lCJywnVGlCJywnUGlCJywnRWlCJywnWmlCJywnWWlCJ107XHJcbiAgICB2YXIgdSA9IC0xO1xyXG4gICAgZG8ge1xyXG4gICAgICAgIGJ5dGVzIC89IHRocmVzaDtcclxuICAgICAgICArK3U7XHJcbiAgICB9IHdoaWxlKGJ5dGVzID49IHRocmVzaCk7XHJcbiAgICByZXR1cm4gYnl0ZXMudG9GaXhlZCgxKSsnICcrdW5pdHNbdV07XHJcbn07XHJcblxyXG52YXIgc3RhcnQ9ZnVuY3Rpb24oa3NhbmFqcyxjYixjb250ZXh0KXtcclxuICB2YXIgZmlsZXM9a3NhbmFqcy5uZXdmaWxlc3x8a3NhbmFqcy5maWxlcztcclxuICB2YXIgYmFzZXVybD1rc2FuYWpzLmJhc2V1cmx8fCBcImh0dHA6Ly8xMjcuMC4wLjE6ODA4MC9cIitrc2FuYWpzLmRiaWQrXCIvXCI7XHJcbiAgdmFyIHN0YXJ0ZWQ9a3NhbmFnYXAuc3RhcnREb3dubG9hZChrc2FuYWpzLmRiaWQsYmFzZXVybCxmaWxlcy5qb2luKFwiXFx1ZmZmZlwiKSk7XHJcbiAgY2IuYXBwbHkoY29udGV4dCxbc3RhcnRlZF0pO1xyXG59XHJcbnZhciBzdGF0dXM9ZnVuY3Rpb24oKXtcclxuICB2YXIgbmZpbGU9a3NhbmFnYXAuZG93bmxvYWRpbmdGaWxlKCk7XHJcbiAgdmFyIGRvd25sb2FkZWRCeXRlPWtzYW5hZ2FwLmRvd25sb2FkZWRCeXRlKCk7XHJcbiAgdmFyIGRvbmU9a3NhbmFnYXAuZG9uZURvd25sb2FkKCk7XHJcbiAgcmV0dXJuIHtuZmlsZTpuZmlsZSxkb3dubG9hZGVkQnl0ZTpkb3dubG9hZGVkQnl0ZSwgZG9uZTpkb25lfTtcclxufVxyXG5cclxudmFyIGNhbmNlbD1mdW5jdGlvbigpe1xyXG4gIHJldHVybiBrc2FuYWdhcC5jYW5jZWxEb3dubG9hZCgpO1xyXG59XHJcblxyXG52YXIgbGl2ZXVwZGF0ZT17IGh1bWFuRmlsZVNpemU6IGh1bWFuRmlsZVNpemUsIFxyXG4gIG5lZWRUb1VwZGF0ZTogbmVlZFRvVXBkYXRlICwganNvbnA6anNvbnAsIFxyXG4gIGdldFVwZGF0YWJsZXM6Z2V0VXBkYXRhYmxlcyxcclxuICBzdGFydDpzdGFydCxcclxuICBjYW5jZWw6Y2FuY2VsLFxyXG4gIHN0YXR1czpzdGF0dXNcclxuICB9O1xyXG5tb2R1bGUuZXhwb3J0cz1saXZldXBkYXRlOyIsImZ1bmN0aW9uIG1rZGlyUCAocCwgbW9kZSwgZiwgbWFkZSkge1xyXG4gICAgIHZhciBwYXRoID0gbm9kZVJlcXVpcmUoJ3BhdGgnKTtcclxuICAgICB2YXIgZnMgPSBub2RlUmVxdWlyZSgnZnMnKTtcclxuXHRcclxuICAgIGlmICh0eXBlb2YgbW9kZSA9PT0gJ2Z1bmN0aW9uJyB8fCBtb2RlID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICBmID0gbW9kZTtcclxuICAgICAgICBtb2RlID0gMHgxRkYgJiAofnByb2Nlc3MudW1hc2soKSk7XHJcbiAgICB9XHJcbiAgICBpZiAoIW1hZGUpIG1hZGUgPSBudWxsO1xyXG5cclxuICAgIHZhciBjYiA9IGYgfHwgZnVuY3Rpb24gKCkge307XHJcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdzdHJpbmcnKSBtb2RlID0gcGFyc2VJbnQobW9kZSwgOCk7XHJcbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xyXG5cclxuICAgIGZzLm1rZGlyKHAsIG1vZGUsIGZ1bmN0aW9uIChlcikge1xyXG4gICAgICAgIGlmICghZXIpIHtcclxuICAgICAgICAgICAgbWFkZSA9IG1hZGUgfHwgcDtcclxuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIG1hZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzd2l0Y2ggKGVyLmNvZGUpIHtcclxuICAgICAgICAgICAgY2FzZSAnRU5PRU5UJzpcclxuICAgICAgICAgICAgICAgIG1rZGlyUChwYXRoLmRpcm5hbWUocCksIG1vZGUsIGZ1bmN0aW9uIChlciwgbWFkZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcikgY2IoZXIsIG1hZGUpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgbWtkaXJQKHAsIG1vZGUsIGNiLCBtYWRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXJcclxuICAgICAgICAgICAgLy8gdGhlcmUgYWxyZWFkeS4gIElmIHNvLCB0aGVuIGhvb3JheSEgIElmIG5vdCwgdGhlbiBzb21ldGhpbmdcclxuICAgICAgICAgICAgLy8gaXMgYm9ya2VkLlxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgZnMuc3RhdChwLCBmdW5jdGlvbiAoZXIyLCBzdGF0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHN0YXQgZmFpbHMsIHRoZW4gdGhhdCdzIHN1cGVyIHdlaXJkLlxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCB0aGUgb3JpZ2luYWwgZXJyb3IgYmUgdGhlIGZhaWx1cmUgcmVhc29uLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcjIgfHwgIXN0YXQuaXNEaXJlY3RvcnkoKSkgY2IoZXIsIG1hZGUpXHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBjYihudWxsLCBtYWRlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcbn1cclxuXHJcbm1rZGlyUC5zeW5jID0gZnVuY3Rpb24gc3luYyAocCwgbW9kZSwgbWFkZSkge1xyXG4gICAgdmFyIHBhdGggPSBub2RlUmVxdWlyZSgncGF0aCcpO1xyXG4gICAgdmFyIGZzID0gbm9kZVJlcXVpcmUoJ2ZzJyk7XHJcbiAgICBpZiAobW9kZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgbW9kZSA9IDB4MUZGICYgKH5wcm9jZXNzLnVtYXNrKCkpO1xyXG4gICAgfVxyXG4gICAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbDtcclxuXHJcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdzdHJpbmcnKSBtb2RlID0gcGFyc2VJbnQobW9kZSwgOCk7XHJcbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xyXG5cclxuICAgIHRyeSB7XHJcbiAgICAgICAgZnMubWtkaXJTeW5jKHAsIG1vZGUpO1xyXG4gICAgICAgIG1hZGUgPSBtYWRlIHx8IHA7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyMCkge1xyXG4gICAgICAgIHN3aXRjaCAoZXJyMC5jb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgJ0VOT0VOVCcgOlxyXG4gICAgICAgICAgICAgICAgbWFkZSA9IHN5bmMocGF0aC5kaXJuYW1lKHApLCBtb2RlLCBtYWRlKTtcclxuICAgICAgICAgICAgICAgIHN5bmMocCwgbW9kZSwgbWFkZSk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgIC8vIEluIHRoZSBjYXNlIG9mIGFueSBvdGhlciBlcnJvciwganVzdCBzZWUgaWYgdGhlcmUncyBhIGRpclxyXG4gICAgICAgICAgICAvLyB0aGVyZSBhbHJlYWR5LiAgSWYgc28sIHRoZW4gaG9vcmF5ISAgSWYgbm90LCB0aGVuIHNvbWV0aGluZ1xyXG4gICAgICAgICAgICAvLyBpcyBib3JrZWQuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhdDtcclxuICAgICAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKHApO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycjEpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnIwO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKCFzdGF0LmlzRGlyZWN0b3J5KCkpIHRocm93IGVycjA7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG1hZGU7XHJcbn07XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IG1rZGlyUC5ta2RpcnAgPSBta2RpclAubWtkaXJQID0gbWtkaXJQO1xyXG4iXX0=
