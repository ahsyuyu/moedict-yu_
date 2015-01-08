(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/yu/ksana2015/moedict-yu/index.js":[function(require,module,exports){
var runtime=require("ksana2015-webruntime");
runtime.boot("moedict-yu",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=React.render(Main,document.getElementById("main"));
});
},{"./src/main.jsx":"/Users/yu/ksana2015/moedict-yu/src/main.jsx","ksana2015-webruntime":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/index.js"}],"/Users/yu/ksana2015/moedict-yu/src/api.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/moedict-yu/src/defbox.jsx":[function(require,module,exports){
var Defbox=React.createClass({displayName: "Defbox",
  getInitialState: function() {
  	return {definition:[]};
  },
  componentWillReceiveProps: function(nextProps) {
    var d=nextProps.def;
    var definition=d.map(this.renderDef);
    this.setState({definition:definition});
  },
  renderDef: function(item) {
    return (React.createElement("div", null, item, React.createElement("br", null)));
  },
  render: function() {
    return(
	 React.createElement("div", null, 
	 	 this.state.definition
	 )	
    ); 
  }
});
module.exports=Defbox;
},{}],"/Users/yu/ksana2015/moedict-yu/src/main.jsx":[function(require,module,exports){
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
      var entries=db.get("pageNames");
      that.setState({entries:entries});
    });    
  	return {result:["搜尋結果列表"],searchtype:"start",def:[]};
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
  gotoEntry: function(index) {
    var that=this;
    kde.open("moedict",function(err,db){
      //var def=db.get("moedict.fileContents.0."+index);
      var def=db.get(["fileContents",0,index],function(data){
        var d=data.split("\n");
        that.setState({def:d});
      });
    }); 
  },
  render: function() {
    return(
    React.createElement("div", null, 
      React.createElement(Searchbar, {dosearch: this.dosearch}), 
      React.createElement(Overview, {result: this.state.result, gotoEntry: this.gotoEntry}), 
      React.createElement("br", null), React.createElement("br", null), 
      React.createElement(Showtext, {def: this.state.def, searchtype: this.state.searchtype, tofind: this.state.tofind, result: this.state.result})
    )
    );
  }
});
module.exports=maincomponent;
},{"./api":"/Users/yu/ksana2015/moedict-yu/src/api.js","./overview.jsx":"/Users/yu/ksana2015/moedict-yu/src/overview.jsx","./searchbar.jsx":"/Users/yu/ksana2015/moedict-yu/src/searchbar.jsx","./showtext.jsx":"/Users/yu/ksana2015/moedict-yu/src/showtext.jsx","ksana-database":"/Users/yu/ksana2015/node_modules/ksana-database/index.js","ksana-search":"/Users/yu/ksana2015/node_modules/ksana-search/index.js"}],"/Users/yu/ksana2015/moedict-yu/src/overview.jsx":[function(require,module,exports){
var Overview=React.createClass({displayName: "Overview",
  getInitialState: function() {
  	return {resList:[]};
  },
  getEntry: function(e) {
    var entryIndex=e.target.value;
    this.props.gotoEntry(entryIndex);
  },
  componentWillReceiveProps: function(nextProps){
    var res=nextProps.result;
    var resList=res.map(this.renderResult);
    this.setState({resList:resList});
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
			React.createElement("select", {className: "form-control", onChange: this.getEntry}, 
      this.state.resList
			)
		)
	)	
    ); 
  }
});
module.exports=Overview;
},{}],"/Users/yu/ksana2015/moedict-yu/src/searchbar.jsx":[function(require,module,exports){
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
	    React.createElement("input", {className: "form-control col-sm-1", type: "text", ref: "tofind", placeholder: "請輸入字詞", onChange: this.dosearch})
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
},{}],"/Users/yu/ksana2015/moedict-yu/src/searchhistory.jsx":[function(require,module,exports){
var Searchhistory=React.createClass({displayName: "Searchhistory",
  getInitialState: function() {
  	return {};
  },
  
  render: function() {
    return(
	React.createElement("div", null, "render Searchhistory")
    	
    ); 
  }
});
module.exports=Searchhistory;
},{}],"/Users/yu/ksana2015/moedict-yu/src/showtext.jsx":[function(require,module,exports){
var Searchhistory=require("./searchhistory.jsx");
var Defbox=require("./defbox.jsx");
var Showtext=React.createClass({displayName: "Showtext",
  getInitialState: function() {
  	return {};
  },
  render: function() {
    return (
    React.createElement("div", null, 
    	React.createElement(Searchhistory, {result: this.props.result}), 
    	React.createElement(Defbox, {def: this.props.def, result: this.props.result})	
    )
    );
  }
});
module.exports=Showtext;
},{"./defbox.jsx":"/Users/yu/ksana2015/moedict-yu/src/defbox.jsx","./searchhistory.jsx":"/Users/yu/ksana2015/moedict-yu/src/searchhistory.jsx"}],"/Users/yu/ksana2015/node_modules/ksana-analyzer/configs.js":[function(require,module,exports){
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
},{"./tokenizers":"/Users/yu/ksana2015/node_modules/ksana-analyzer/tokenizers.js"}],"/Users/yu/ksana2015/node_modules/ksana-analyzer/index.js":[function(require,module,exports){
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
},{"./configs":"/Users/yu/ksana2015/node_modules/ksana-analyzer/configs.js"}],"/Users/yu/ksana2015/node_modules/ksana-analyzer/tokenizers.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/node_modules/ksana-database/bsearch.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/node_modules/ksana-database/index.js":[function(require,module,exports){
var KDE=require("./kde");
//currently only support node.js fs, ksanagap native fs, html5 file system
//use socket.io to read kdb from remote server in future
module.exports=KDE;
},{"./kde":"/Users/yu/ksana2015/node_modules/ksana-database/kde.js"}],"/Users/yu/ksana2015/node_modules/ksana-database/kde.js":[function(require,module,exports){
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

	var filePageCount=engine.get(["filePageCount"]);
	if (filePageCount) {
		if (i==0) {
			return {start:0,end:filePageCount[0]-1};
		} else {
			return {start:filePageCount[i-1],end:filePageCount[i]-1};
		}
	}

	//old buggy code
	var fileNames=engine.get(["fileNames"]);
	var fileOffsets=engine.get(["fileOffsets"]);
	var pageOffsets=engine.get(["pageOffsets"]);
	var pageNames=engine.get(["pageNames"]);
	var fileStart=fileOffsets[i], fileEnd=fileOffsets[i+1]-1;

	
	var start=bsearch(pageOffsets,fileStart,true);	
	//if (pageOffsets[start]==fileStart) start--;
	
	//work around for jiangkangyur
	while (pageNames[start+1]=="_") start++;

  //if (i==0) start=0; //work around for first file
	var end=bsearch(pageOffsets,fileEnd,true);
	return {start:start,end:end};
}

var getfp=function(absolutepage) {
	var fileOffsets=this.get(["fileOffsets"]);
	var pageOffsets=this.get(["pageOffsets"]);
	var pageoffset=pageOffsets[absolutepage];
	var file=bsearch(fileOffsets,pageoffset,true)-1;

	var fileStart=fileOffsets[file];
	var start=bsearch(pageOffsets,fileStart,true);	

	var page=absolutepage-start-1;
	return {file:file,page:page};
}
//return array of object of nfile npage given pagename
var findPage=function(pagename) {
	var pagenames=this.get("pageNames");
	var out=[];
	for (var i=0;i<pagenames.length;i++) {
		if (pagenames[i]==pagename) {
			var fp=getfp.apply(this,[i]);
			out.push({file:fp.file,page:fp.page,abspage:i});
		}
	}
	return out;
}
var getFilePageOffsets=function(i) {
	var pageOffsets=this.get("pageOffsets");
	var range=getFileRange.apply(this,[i]);
	return pageOffsets.slice(range.start,range.end+1);
}

var getFilePageNames=function(i) {
	var range=getFileRange.apply(this,[i]);
	var pageNames=this.get("pageNames");
	return pageNames.slice(range.start,range.end+1);
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
	var preload=[["meta"],["fileNames"],["fileOffsets"],["pageNames"],["pageOffsets"],["filePageCount"]];
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

	engine.fileOffset=fileOffset;
	engine.folderOffset=folderOffset;
	engine.pageOffset=pageOffset;
	engine.getFilePageNames=getFilePageNames;
	engine.getFilePageOffsets=getFilePageOffsets;
	engine.getFileRange=getFileRange;
	engine.findPage=findPage;
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

var pageOffset=function(pagename) {
	var engine=this;
	if (arguments.length>1) throw "argument : pagename ";

	var pageNames=engine.get("pageNames");
	var pageOffsets=engine.get("pageOffsets");

	var i=pageNames.indexOf(pagename);
	return (i>-1)?pageOffsets[i]:0;
}
var fileOffset=function(fn) {
	var engine=this;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
	var i=filenames.indexOf(fn);
	if (i==-1) return null;
	return {start: offsets[i], end:offsets[i+1]};
}

var folderOffset=function(folder) {
	var engine=this;
	var start=0,end=0;
	var filenames=engine.get("fileNames");
	var offsets=engine.get("fileOffsets");
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
},{"./bsearch":"/Users/yu/ksana2015/node_modules/ksana-database/bsearch.js","./listkdb":"/Users/yu/ksana2015/node_modules/ksana-database/listkdb.js","./platform":"/Users/yu/ksana2015/node_modules/ksana-database/platform.js","fs":false,"ksana-jsonrom":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/index.js"}],"/Users/yu/ksana2015/node_modules/ksana-database/listkdb.js":[function(require,module,exports){
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

var listkdb=function() {
	var platform=require("./platform").getPlatform();
	var files=[];
	if (platform=="node" || platform=="node-webkit") {
		files=listkdb_node();
	} else {
		throw "not implement yet";
	}
	return files;
}
module.exports=listkdb;
},{"./platform":"/Users/yu/ksana2015/node_modules/ksana-database/platform.js","fs":false,"ksana-jsonrom":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/index.js","path":false}],"/Users/yu/ksana2015/node_modules/ksana-database/platform.js":[function(require,module,exports){
var getPlatform=function() {
	if (typeof ksanagap=="undefined") {
		platform="node";
	} else {
		platform=ksanagap.platform;
	}
	return platform;
}
module.exports={getPlatform:getPlatform};
},{}],"/Users/yu/ksana2015/node_modules/ksana-jsonrom/html5read.js":[function(require,module,exports){

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
},{}],"/Users/yu/ksana2015/node_modules/ksana-jsonrom/index.js":[function(require,module,exports){
module.exports={
	open:require("./kdb")
	,create:require("./kdbw")
}

},{"./kdb":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdb.js","./kdbw":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbw.js"}],"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdb.js":[function(require,module,exports){
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
					cb(Object.keys(CACHE));	
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

},{"./kdbfs":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbfs.js","./kdbfs_android":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbfs_android.js","./kdbfs_ios":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbfs_ios.js"}],"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbfs.js":[function(require,module,exports){
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
},{"./html5read":"/Users/yu/ksana2015/node_modules/ksana-jsonrom/html5read.js","buffer":false,"fs":false}],"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbfs_android.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbfs_ios.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/node_modules/ksana-jsonrom/kdbw.js":[function(require,module,exports){
/*
  convert any json into a binary buffer
  the buffer can be saved with a single line of fs.writeFile
*/

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
var key_writing="";//for debugging
var pack_int = function (ar, savedelta) { // pack ar into
  if (!ar || ar.length === 0) return []; // empty array
  var r = [],
  i = 0,
  j = 0,
  delta = 0,
  prev = 0;
  
  do {
	delta = ar[i];
	if (savedelta) {
		delta -= prev;
	}
	if (delta < 0) {
	  console.trace('negative',prev,ar[i])
	  throw 'negetive';
	  break;
	}
	
	r[j++] = delta & 0x7f;
	delta >>= 7;
	while (delta > 0) {
	  r[j++] = (delta & 0x7f) | 0x80;
	  delta >>= 7;
	}
	prev = ar[i];
	i++;
  } while (i < ar.length);
  return r;
}
var Kfs=function(path,opts) {
	
	var handle=null;
	opts=opts||{};
	opts.size=opts.size||65536*2048; 
	console.log('kdb estimate size:',opts.size);
	var dbuf=new Buffer(opts.size);
	var cur=0;//dbuf cursor
	
	var writeSignature=function(value,pos) {
		dbuf.write(value,pos,value.length,'utf8');
		if (pos+value.length>cur) cur=pos+value.length;
		return value.length;
	}
	var writeOffset=function(value,pos) {
		dbuf.writeUInt8(Math.floor(value / (65536*65536)),pos);
		dbuf.writeUInt32BE( value & 0xFFFFFFFF,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeString= function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (value=="") throw "cannot write null string";
		if (encoding==='utf8')dbuf.write(DT.utf8,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
			
		var len=Buffer.byteLength(value, encoding);
		dbuf.write(value,pos+1,len,encoding);
		
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1; // signature
	}
	var writeStringArray = function(value,pos,encoding) {
		encoding=encoding||'ucs2';
		if (encoding==='utf8') dbuf.write(DT.utf8arr,pos,1,'utf8');
		else if (encoding==='ucs2')dbuf.write(DT.ucs2arr,pos,1,'utf8');
		else throw 'unsupported encoding '+encoding;
		
		var v=value.join('\0');
		var len=Buffer.byteLength(v, encoding);
		if (0===len) {
			throw "empty string array " + key_writing;
		}
		dbuf.write(v,pos+1,len,encoding);
		if (pos+len+1>cur) cur=pos+len+1;
		return len+1;
	}
	var writeI32=function(value,pos) {
		dbuf.write(DT.int32,pos,1,'utf8');
		dbuf.writeInt32BE(value,pos+1);
		if (pos+5>cur) cur=pos+5;
		return 5;
	}
	var writeUI8=function(value,pos) {
		dbuf.write(DT.uint8,pos,1,'utf8');
		dbuf.writeUInt8(value,pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}
	var writeBool=function(value,pos) {
		dbuf.write(DT.bool,pos,1,'utf8');
		dbuf.writeUInt8(Number(value),pos+1);
		if (pos+2>cur) cur=pos+2;
		return 2;
	}		
	var writeBlob=function(value,pos) {
		dbuf.write(DT.blob,pos,1,'utf8');
		value.copy(dbuf, pos+1);
		var written=value.length+1;
		if (pos+written>cur) cur=pos+written;
		return written;
	}		
	/* no signature */
	var writeFixedArray = function(value,pos,unitsize) {
		//console.log('v.len',value.length,items.length,unitsize);
		if (unitsize===1) var func=dbuf.writeUInt8;
		else if (unitsize===4)var func=dbuf.writeInt32BE;
		else throw 'unsupported integer size';
		if (!value.length) {
			throw "empty fixed array "+key_writing;
		}
		for (var i = 0; i < value.length ; i++) {
			func.apply(dbuf,[value[i],i*unitsize+pos])
		}
		var len=unitsize*value.length;
		if (pos+len>cur) cur=pos+len;
		return len;
	}

	this.writeI32=writeI32;
	this.writeBool=writeBool;
	this.writeBlob=writeBlob;
	this.writeUI8=writeUI8;
	this.writeString=writeString;
	this.writeSignature=writeSignature;
	this.writeOffset=writeOffset; //5 bytes offset
	this.writeStringArray=writeStringArray;
	this.writeFixedArray=writeFixedArray;
	Object.defineProperty(this, "buf", {get : function(){ return dbuf; }});
	
	return this;
}

var Create=function(path,opts) {
	opts=opts||{};
	var kfs=new Kfs(path,opts);
	var cur=0;

	var handle={};
	
	//no signature
	var writeVInt =function(arr) {
		var o=pack_int(arr,false);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	var writeVInt1=function(value) {
		writeVInt([value]);
	}
	//for postings
	var writePInt =function(arr) {
		var o=pack_int(arr,true);
		kfs.writeFixedArray(o,cur,1);
		cur+=o.length;
	}
	
	var saveVInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.vint,cur);
		writeVInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;		
	}
	var savePInt = function(arr,key) {
		var start=cur;
		key_writing=key;
		cur+=kfs.writeSignature(DT.pint,cur);
		writePInt(arr);
		var written = cur-start;
		pushitem(key,written);
		return written;	
	}

	
	var saveUI8 = function(value,key) {
		var written=kfs.writeUI8(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveBool=function(value,key) {
		var written=kfs.writeBool(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveI32 = function(value,key) {
		var written=kfs.writeI32(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}	
	var saveString = function(value,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		var written=kfs.writeString(value,cur,encoding);
		cur+=written;
		pushitem(key,written);
		return written;
	}
	var saveStringArray = function(arr,key,encoding) {
		encoding=encoding||stringencoding;
		key_writing=key;
		try {
			var written=kfs.writeStringArray(arr,cur,encoding);
		} catch(e) {
			throw e;
		}
		cur+=written;
		pushitem(key,written);
		return written;
	}
	
	var saveBlob = function(value,key) {
		key_writing=key;
		var written=kfs.writeBlob(value,cur);
		cur+=written;
		pushitem(key,written);
		return written;
	}

	var folders=[];
	var pushitem=function(key,written) {
		var folder=folders[folders.length-1];	
		if (!folder) return ;
		folder.itemslength.push(written);
		if (key) {
			if (!folder.keys) throw 'cannot have key in array';
			folder.keys.push(key);
		}
	}	
	var open = function(opt) {
		var start=cur;
		var key=opt.key || null;
		var type=opt.type||DT.array;
		cur+=kfs.writeSignature(type,cur);
		cur+=kfs.writeOffset(0x0,cur); // pre-alloc space for offset
		var folder={
			type:type, key:key,
			start:start,datastart:cur,
			itemslength:[] };
		if (type===DT.object) folder.keys=[];
		folders.push(folder);
	}
	var openObject = function(key) {
		open({type:DT.object,key:key});
	}
	var openArray = function(key) {
		open({type:DT.array,key:key});
	}
	var saveInts=function(arr,key,func) {
		func.apply(handle,[arr,key]);
	}
	var close = function(opt) {
		if (!folders.length) throw 'empty stack';
		var folder=folders.pop();
		//jump to lengths and keys
		kfs.writeOffset( cur-folder.datastart, folder.datastart-5);
		var itemcount=folder.itemslength.length;
		//save lengths
		writeVInt1(itemcount);
		writeVInt(folder.itemslength);
		
		if (folder.type===DT.object) {
			//use utf8 for keys
			cur+=kfs.writeStringArray(folder.keys,cur,'utf8');
		}
		written=cur-folder.start;
		pushitem(folder.key,written);
		return written;
	}
	
	
	var stringencoding='ucs2';
	var stringEncoding=function(newencoding) {
		if (newencoding) stringencoding=newencoding;
		else return stringencoding;
	}
	
	var allnumber_fast=function(arr) {
		if (arr.length<5) return allnumber(arr);
		if (typeof arr[0]=='number'
		    && Math.round(arr[0])==arr[0] && arr[0]>=0)
			return true;
		return false;
	}
	var allstring_fast=function(arr) {
		if (arr.length<5) return allstring(arr);
		if (typeof arr[0]=='string') return true;
		return false;
	}	
	var allnumber=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='number') return false;
		}
		return true;
	}
	var allstring=function(arr) {
		for (var i=0;i<arr.length;i++) {
			if (typeof arr[i]!=='string') return false;
		}
		return true;
	}
	var getEncoding=function(key,encs) {
		var enc=encs[key];
		if (!enc) return null;
		if (enc=='delta' || enc=='posting') {
			return savePInt;
		} else if (enc=="variable") {
			return saveVInt;
		}
		return null;
	}
	var save=function(J,key,opts) {
		opts=opts||{};
		
		if (typeof J=="null" || typeof J=="undefined") {
			throw 'cannot save null value of ['+key+'] folders'+JSON.stringify(folders);
			return;
		}
		var type=J.constructor.name;
		if (type==='Object') {
			openObject(key);
			for (var i in J) {
				save(J[i],i,opts);
				if (opts.autodelete) delete J[i];
			}
			close();
		} else if (type==='Array') {
			if (allnumber_fast(J)) {
				if (J.sorted) { //number array is sorted
					saveInts(J,key,savePInt);	//posting delta format
				} else {
					saveInts(J,key,saveVInt);	
				}
			} else if (allstring_fast(J)) {
				saveStringArray(J,key);
			} else {
				openArray(key);
				for (var i=0;i<J.length;i++) {
					save(J[i],null,opts);
					if (opts.autodelete) delete J[i];
				}
				close();
			}
		} else if (type==='String') {
			saveString(J,key);
		} else if (type==='Number') {
			if (J>=0&&J<256) saveUI8(J,key);
			else saveI32(J,key);
		} else if (type==='Boolean') {
			saveBool(J,key);
		} else if (type==='Buffer') {
			saveBlob(J,key);
		} else {
			throw 'unsupported type '+type;
		}
	}
	
	var free=function() {
		while (folders.length) close();
		kfs.free();
	}
	var currentsize=function() {
		return cur;
	}

	Object.defineProperty(handle, "size", {get : function(){ return cur; }});

	var writeFile=function(fn,opts,cb) {
		if (typeof fs=="undefined") {
			var fs=opts.fs||require('fs');	
		}
		var totalbyte=handle.currentsize();
		var written=0,batch=0;
		
		if (typeof cb=="undefined" || typeof opts=="function") {
			cb=opts;
		}
		opts=opts||{};
		batchsize=opts.batchsize||1024*1024*16; //16 MB

		if (fs.existsSync(fn)) fs.unlinkSync(fn);

		var writeCb=function(total,written,cb,next) {
			return function(err) {
				if (err) throw "write error"+err;
				cb(total,written);
				batch++;
				next();
			}
		}

		var next=function() {
			if (batch<batches) {
				var bufstart=batchsize*batch;
				var bufend=bufstart+batchsize;
				if (bufend>totalbyte) bufend=totalbyte;
				var sliced=kfs.buf.slice(bufstart,bufend);
				written+=sliced.length;
				fs.appendFile(fn,sliced,writeCb(totalbyte,written, cb,next));
			}
		}
		var batches=1+Math.floor(handle.size/batchsize);
		next();
	}
	handle.free=free;
	handle.saveI32=saveI32;
	handle.saveUI8=saveUI8;
	handle.saveBool=saveBool;
	handle.saveString=saveString;
	handle.saveVInt=saveVInt;
	handle.savePInt=savePInt;
	handle.saveInts=saveInts;
	handle.saveBlob=saveBlob;
	handle.save=save;
	handle.openArray=openArray;
	handle.openObject=openObject;
	handle.stringEncoding=stringEncoding;
	//this.integerEncoding=integerEncoding;
	handle.close=close;
	handle.writeFile=writeFile;
	handle.currentsize=currentsize;
	return handle;
}

module.exports=Create;
},{"fs":false}],"/Users/yu/ksana2015/node_modules/ksana-search/boolsearch.js":[function(require,module,exports){
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
},{"./plist":"/Users/yu/ksana2015/node_modules/ksana-search/plist.js"}],"/Users/yu/ksana2015/node_modules/ksana-search/bsearch.js":[function(require,module,exports){
arguments[4]["/Users/yu/ksana2015/node_modules/ksana-database/bsearch.js"][0].apply(exports,arguments)
},{}],"/Users/yu/ksana2015/node_modules/ksana-search/excerpt.js":[function(require,module,exports){
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
	var fileOffsets=engine.get("fileOffsets");
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
		} else if (range.showpage) {
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
			opts.range.maxpage=opts.range.maxhit;
		}
		if (!opts.range.maxpage) opts.range.maxpage=100;
		if (!opts.range.end) {
			opts.range.end=Number.MAX_SAFE_INTEGER;
		}
	}
	var fileWithHits=getFileWithHits(engine,Q,opts.range);
	if (!fileWithHits.length) {
		cb(output);
		return;
	}

	var output=[],files=[];//temporary holder for pagenames
	for (var i=0;i<fileWithHits.length;i++) {
		var nfile=fileWithHits[i];
		var pageOffsets=engine.getFilePageOffsets(nfile);
		var pageNames=engine.getFilePageNames(nfile);
		files[nfile]={pageOffsets:pageOffsets};
		var pagewithhit=plist.groupbyposting2(Q.byFile[ nfile ],  pageOffsets);
		//if (pageOffsets[0]==1)
		//pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )

		for (var j=0; j<pagewithhit.length;j++) {
			if (!pagewithhit[j].length) continue;
			//var offsets=pagewithhit[j].map(function(p){return p- fileOffsets[i]});
			if (pageOffsets[j]>opts.range.end) break;
			output.push(  {file: nfile, page:j,  pagename:pageNames[j]});
			if (output.length>opts.range.maxpage) break;
		}
	}

	var pagepaths=output.map(function(p){
		return ["fileContents",p.file,p.page];
	});
	//prepare the text
	engine.get(pagepaths,function(pages){
		var seq=0;
		if (pages) for (var i=0;i<pages.length;i++) {
			var startvpos=files[output[i].file].pageOffsets[output[i].page-1];
			var endvpos=files[output[i].file].pageOffsets[output[i].page];
			var hl={};

			if (opts.range && opts.range.start  ) {
				if ( startvpos<opts.range.start) startvpos=opts.range.start;
			//	if (endvpos>opts.range.end) endvpos=opts.range.end;
			}
			
			if (opts.nohighlight) {
				hl.text=pages[i];
				hl.hits=hitInRange(Q,startvpos,endvpos);
			} else {
				var o={nocrlf:true,nospan:true,
					text:pages[i],startvpos:startvpos, endvpos: endvpos, 
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

var getPage=function(engine,fileid,pageid,cb) {
	var fileOffsets=engine.get("fileOffsets");
	var pagepaths=["fileContents",fileid,pageid];
	var pagenames=engine.getFilePageNames(fileid);

	engine.get(pagepaths,function(text){
		cb.apply(engine.context,[{text:text,file:fileid,page:pageid,pagename:pagenames[pageid]}]);
	});
}

var getPageSync=function(engine,fileid,pageid) {
	var fileOffsets=engine.get("fileOffsets");
	var pagepaths=["fileContents",fileid,pageid];
	var pagenames=engine.getFilePageNames(fileid);

	var text=engine.get(pagepaths);
	return {text:text,file:fileid,page:pageid,pagename:pagenames[pageid]};
}

var getRange=function(engine,start,end,cb) {
	var fileOffsets=engine.get("fileOffsets");
	//var pagepaths=["fileContents",];
	//find first page and last page
	//create get paths

}

var getFile=function(engine,fileid,cb) {
	var filename=engine.get("fileNames")[fileid];
	var pagenames=engine.getFilePageNames(fileid);
	var filestart=engine.get("fileOffsets")[fileid];
	var offsets=engine.getFilePageOffsets(fileid);
	var pc=0;
	engine.get(["fileContents",fileid],true,function(data){
		var text=data.map(function(t,idx) {
			if (idx==0) return ""; 
			var pb='<pb n="'+pagenames[idx]+'"></pb>';
			return pb+t;
		});
		cb({texts:data,text:text.join(""),pagenames:pagenames,filestart:filestart,offsets:offsets,file:fileid,filename:filename}); //force different token
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

	var pageOffsets=Q.engine.getFilePageOffsets(fileid);
	var output=[];	
	//console.log(startvpos,endvpos)
	Q.engine.get(["fileContents",fileid],true,function(data){
		if (!data) {
			console.error("wrong file id",fileid);
		} else {
			for (var i=0;i<data.length-1;i++ ){
				var startvpos=pageOffsets[i];
				var endvpos=pageOffsets[i+1];
				var pagenames=Q.engine.getFilePageNames(fileid);
				var page=getPageSync(Q.engine, fileid,i+1);
					var opt={text:page.text,hits:null,tag:'hl',vpos:startvpos,
					fulltext:true,nospan:opts.nospan,nocrlf:opts.nocrlf};
				var pagename=pagenames[i+1];
				opt.hits=hitInRange(Q,startvpos,endvpos);
				var pb='<pb n="'+pagename+'"></pb>';
				var withtag=injectTag(Q,opt);
				output.push(pb+withtag);
			}			
		}

		cb.apply(Q.engine.context,[{text:output.join(""),file:fileid}]);
	})
}
var highlightPage=function(Q,fileid,pageid,opts,cb) {
	if (typeof opts=="function") {
		cb=opts;
	}

	if (!Q || !Q.engine) return cb(null);
	var pageOffsets=Q.engine.getFilePageOffsets(fileid);
	var startvpos=pageOffsets[pageid-1];
	var endvpos=pageOffsets[pageid];
	var pagenames=Q.engine.getFilePageNames(fileid);

	this.getPage(Q.engine,fileid,pageid,function(res){
		var opt={text:res.text,hits:null,vpos:startvpos,fulltext:true,
			nospan:opts.nospan,nocrlf:opts.nocrlf};
		opt.hits=hitInRange(Q,startvpos,endvpos);
		if (opts.renderTags) {
			opt.tags=tagsInRange(Q,opts.renderTags,startvpos,endvpos);
		}

		var pagename=pagenames[pageid];
		cb.apply(Q.engine.context,[{text:injectTag(Q,opt),page:pageid,file:fileid,hits:opt.hits,pagename:pagename}]);
	});
}
module.exports={resultlist:resultlist, 
	hitInRange:hitInRange, 
	highlightPage:highlightPage,
	getPage:getPage,
	highlightFile:highlightFile,
	getFile:getFile
	//highlightRange:highlightRange,
  //getRange:getRange,
};
},{"./plist":"/Users/yu/ksana2015/node_modules/ksana-search/plist.js"}],"/Users/yu/ksana2015/node_modules/ksana-search/index.js":[function(require,module,exports){
/*
  Ksana Search Engine.

  need a KDE instance to be functional
  
*/
var bsearch=require("./bsearch");
var dosearch=require("./search");

var prepareEngineForSearch=function(engine,cb){
	if (engine.analyzer)return;
	var analyzer=require("ksana-analyzer");
	var config=engine.get("meta").config;
	engine.analyzer=analyzer.getAPI(config);
	engine.get([["tokens"],["postingsLength"]],function(){
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

var _highlightPage=function(engine,fileid,pageid,opts,cb){
	if (!opts.q) opts.q=""; 
	_search(engine,opts.q,opts,function(Q){
		api.excerpt.highlightPage(Q,fileid,pageid,opts,cb);
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

var vpos2filepage=function(engine,vpos) {
    var pageOffsets=engine.get("pageOffsets");
    var fileOffsets=engine.get(["fileOffsets"]);
    var pageNames=engine.get("pageNames");
    var fileid=bsearch(fileOffsets,vpos+1,true);
    fileid--;
    var pageid=bsearch(pageOffsets,vpos+1,true);
	var range=engine.getFileRange(fileid);
	pageid-=range.start;
    return {file:fileid,page:pageid};
}
var api={
	search:_search
//	,concordance:require("./concordance")
//	,regex:require("./regex")
	,highlightPage:_highlightPage
	,highlightFile:_highlightFile
//	,highlightRange:_highlightRange
	,excerpt:require("./excerpt")
	,vpos2filepage:vpos2filepage
}
module.exports=api;
},{"./bsearch":"/Users/yu/ksana2015/node_modules/ksana-search/bsearch.js","./excerpt":"/Users/yu/ksana2015/node_modules/ksana-search/excerpt.js","./search":"/Users/yu/ksana2015/node_modules/ksana-search/search.js","ksana-analyzer":"/Users/yu/ksana2015/node_modules/ksana-analyzer/index.js","ksana-database":"/Users/yu/ksana2015/node_modules/ksana-database/index.js"}],"/Users/yu/ksana2015/node_modules/ksana-search/plist.js":[function(require,module,exports){

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
},{}],"/Users/yu/ksana2015/node_modules/ksana-search/search.js":[function(require,module,exports){
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
	var postingsLength=engine.get("postingsLength");
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
var getPageWithHit=function(fileid,offsets) {
	var Q=this,engine=Q.engine;
	var pagewithhit=plist.groupbyposting2(Q.byFile[fileid ], offsets);
	if (pagewithhit.length) pagewithhit.shift(); //the first item is not used (0~Q.byFile[0] )
	var out=[];
	pagewithhit.map(function(p,idx){if (p.length) out.push(idx)});
	return out;
}
var pageWithHit=function(fileid) {
	var Q=this,engine=Q.engine;
	var offsets=engine.getFilePageOffsets(fileid);
	return getPageWithHit.apply(this,[fileid,offsets]);
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
	Q.pageWithHit=pageWithHit;

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
	var files=engine.get("fileNames");
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
	var fileOffsets=Q.engine.get("fileOffsets");
	var empty=[],emptycount=0,hashit=0;
	for (var i=0;i<Q.phrases.length;i++) {
		var byfile=plist.groupbyposting2(Q.phrases[i].posting,fileOffsets);
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
			var fileOffsets=Q.engine.get("fileOffsets");
			//console.log("search opts "+JSON.stringify(opts));

			if (!Q.byFile && Q.rawresult && !opts.nogroup) {
				Q.byFile=plist.groupbyposting2(Q.rawresult, fileOffsets);
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
},{"./boolsearch":"/Users/yu/ksana2015/node_modules/ksana-search/boolsearch.js","./excerpt":"/Users/yu/ksana2015/node_modules/ksana-search/excerpt.js","./plist":"/Users/yu/ksana2015/node_modules/ksana-search/plist.js"}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/checkbrowser.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/downloader.js":[function(require,module,exports){

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
},{"./mkdirp":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/mkdirp.js","fs":false,"http":false,"path":false}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/fileinstaller.js":[function(require,module,exports){
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
},{"./checkbrowser":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/checkbrowser.js","./html5fs":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/html5fs.js","./htmlfs":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/htmlfs.js"}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/html5fs.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/htmlfs.js":[function(require,module,exports){
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
},{"./html5fs":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/html5fs.js"}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/index.js":[function(require,module,exports){
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
},{"./downloader":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/downloader.js","./fileinstaller":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/fileinstaller.js","./html5fs":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/html5fs.js","./htmlfs":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/htmlfs.js","./installkdb":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/installkdb.js","./kfs":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/kfs.js","./kfs_html5":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/kfs_html5.js","./ksanagap":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/ksanagap.js","./livereload":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/livereload.js","./liveupdate":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/liveupdate.js","fs":false}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/installkdb.js":[function(require,module,exports){
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
},{"./fileinstaller":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/fileinstaller.js"}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/kfs.js":[function(require,module,exports){
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
},{}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/kfs_html5.js":[function(require,module,exports){
var readDir=function(){
	return [];
}
var listApps=function(){
	return [];
}
module.exports={readDir:readDir,listApps:listApps};
},{}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/ksanagap.js":[function(require,module,exports){
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
},{"./downloader":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/downloader.js","fs":false,"path":false}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/livereload.js":[function(require,module,exports){
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
},{"./html5fs":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/html5fs.js"}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/liveupdate.js":[function(require,module,exports){

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
},{}],"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/mkdirp.js":[function(require,module,exports){
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

},{}]},{},["/Users/yu/ksana2015/moedict-yu/index.js"])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm1vZWRpY3QteXUvaW5kZXguanMiLCJtb2VkaWN0LXl1L3NyYy9hcGkuanMiLCJtb2VkaWN0LXl1L3NyYy9kZWZib3guanN4IiwibW9lZGljdC15dS9zcmMvbWFpbi5qc3giLCJtb2VkaWN0LXl1L3NyYy9vdmVydmlldy5qc3giLCJtb2VkaWN0LXl1L3NyYy9zZWFyY2hiYXIuanN4IiwibW9lZGljdC15dS9zcmMvc2VhcmNoaGlzdG9yeS5qc3giLCJtb2VkaWN0LXl1L3NyYy9zaG93dGV4dC5qc3giLCJub2RlX21vZHVsZXMva3NhbmEtYW5hbHl6ZXIvY29uZmlncy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1hbmFseXplci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1hbmFseXplci90b2tlbml6ZXJzLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWRhdGFiYXNlL2JzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2Uva2RlLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWRhdGFiYXNlL2xpc3RrZGIuanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2UvcGxhdGZvcm0uanMiLCJub2RlX21vZHVsZXMva3NhbmEtanNvbnJvbS9odG1sNXJlYWQuanMiLCJub2RlX21vZHVsZXMva3NhbmEtanNvbnJvbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYi5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYmZzLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWpzb25yb20va2RiZnNfYW5kcm9pZC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYmZzX2lvcy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYncuanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2Jvb2xzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2JzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2V4Y2VycHQuanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLXNlYXJjaC9wbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1zZWFyY2gvc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2NoZWNrYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9kb3dubG9hZGVyLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2ZpbGVpbnN0YWxsZXIuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaHRtbDVmcy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9odG1sZnMuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaW5zdGFsbGtkYi5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9rZnMuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUva2ZzX2h0bWw1LmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2tzYW5hZ2FwLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2xpdmVyZWxvYWQuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvbGl2ZXVwZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9ta2RpcnAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBydW50aW1lPXJlcXVpcmUoXCJrc2FuYTIwMTUtd2VicnVudGltZVwiKTtcbnJ1bnRpbWUuYm9vdChcIm1vZWRpY3QteXVcIixmdW5jdGlvbigpe1xuXHR2YXIgTWFpbj1SZWFjdC5jcmVhdGVFbGVtZW50KHJlcXVpcmUoXCIuL3NyYy9tYWluLmpzeFwiKSk7XG5cdGtzYW5hLm1haW5Db21wb25lbnQ9UmVhY3QucmVuZGVyKE1haW4sZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpKTtcbn0pOyIsInZhciBpbmRleE9mU29ydGVkID0gZnVuY3Rpb24gKGFycmF5LCBvYmopIHsgXG4gICAgdmFyIGxvdyA9IDAsXG4gICAgaGlnaCA9IGFycmF5Lmxlbmd0aC0xO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG4gICAgICBhcnJheVttaWRdIDwgb2JqID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIC8vaWYoYXJyYXlbbG93XSAhPSBvYmopIHJldHVybiBudWxsO1xuICAgIHJldHVybiBsb3c7XG4gfVxuXG4gdmFyIHRlc3QgPSBmdW5jdGlvbihpbnB1dCkge1xuIFx0Y29uc29sZS5sb2coaW5wdXQpO1xuIH1cblxuIHZhciBhcGk9e3Rlc3Q6dGVzdCxpbmRleE9mU29ydGVkOmluZGV4T2ZTb3J0ZWR9O1xuXG5tb2R1bGUuZXhwb3J0cz1hcGk7IiwidmFyIERlZmJveD1SZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRGVmYm94XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIFx0cmV0dXJuIHtkZWZpbml0aW9uOltdfTtcbiAgfSxcbiAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgdmFyIGQ9bmV4dFByb3BzLmRlZjtcbiAgICB2YXIgZGVmaW5pdGlvbj1kLm1hcCh0aGlzLnJlbmRlckRlZik7XG4gICAgdGhpcy5zZXRTdGF0ZSh7ZGVmaW5pdGlvbjpkZWZpbml0aW9ufSk7XG4gIH0sXG4gIHJlbmRlckRlZjogZnVuY3Rpb24oaXRlbSkge1xuICAgIHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBpdGVtLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCkpKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG5cdCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHQgXHQgdGhpcy5zdGF0ZS5kZWZpbml0aW9uXG5cdCApXHRcbiAgICApOyBcbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cz1EZWZib3g7IiwidmFyIGtzZT1yZXF1aXJlKFwia3NhbmEtc2VhcmNoXCIpO1xudmFyIGtkZT1yZXF1aXJlKFwia3NhbmEtZGF0YWJhc2VcIik7XG52YXIgYXBpPXJlcXVpcmUoXCIuL2FwaVwiKTtcbnZhciBTaG93dGV4dD1yZXF1aXJlKFwiLi9zaG93dGV4dC5qc3hcIik7XG52YXIgU2VhcmNoYmFyPXJlcXVpcmUoXCIuL3NlYXJjaGJhci5qc3hcIik7XG52YXIgT3ZlcnZpZXc9cmVxdWlyZShcIi4vb3ZlcnZpZXcuanN4XCIpO1xudmFyIG1haW5jb21wb25lbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwibWFpbmNvbXBvbmVudFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgIHZhciB0aGF0PXRoaXM7XG4gICAga2RlLm9wZW4oXCJtb2VkaWN0XCIsZnVuY3Rpb24oZXJyLGRiKXtcbiAgICAgIHZhciBlbnRyaWVzPWRiLmdldChcInBhZ2VOYW1lc1wiKTtcbiAgICAgIHRoYXQuc2V0U3RhdGUoe2VudHJpZXM6ZW50cmllc30pO1xuICAgIH0pOyAgICBcbiAgXHRyZXR1cm4ge3Jlc3VsdDpbXCLmkJzlsIvntZDmnpzliJfooahcIl0sc2VhcmNodHlwZTpcInN0YXJ0XCIsZGVmOltdfTtcbiAgfSxcbiAgZG9zZWFyY2g6IGZ1bmN0aW9uKHRvZmluZCxmaWVsZCkge1xuICAgIGNvbnNvbGUubG9nKGZpZWxkKTtcbiAgICB0aGlzLnNldFN0YXRlKHt0b2ZpbmQ6dG9maW5kLHNlYXJjaHR5cGU6ZmllbGR9KTtcbiAgICBpZihmaWVsZD09XCJzdGFydFwiKXtcbiAgICAgIHRoaXMuc2VhcmNoX3N0YXJ0KHRvZmluZCk7XG4gICAgfVxuICAgIGlmKGZpZWxkPT1cImVuZFwiKXtcbiAgICAgIHRoaXMuc2VhcmNoX2VuZCh0b2ZpbmQpO1xuICAgIH1cbiAgICBpZihmaWVsZD09XCJtaWRkbGVcIil7XG4gICAgICB0aGlzLnNlYXJjaF9taWRkbGUodG9maW5kKTtcbiAgICB9XG4gICAgaWYoZmllbGQ9PVwiZnVsbHRleHRcIil7XG4gICAgICB0aGlzLnNlYXJjaF9mdWxsdGV4dCh0b2ZpbmQpO1xuICAgIH1cblxuICB9LFxuICBzZWFyY2hfc3RhcnQ6IGZ1bmN0aW9uKHRvZmluZCkge1xuICAgIHZhciBvdXQ9W107XG4gICAgdmFyIGluZGV4PWFwaS5pbmRleE9mU29ydGVkKHRoaXMuc3RhdGUuZW50cmllcyx0b2ZpbmQpO1xuICAgIHZhciBpPTA7XG4gICAgd2hpbGUodGhpcy5zdGF0ZS5lbnRyaWVzW2luZGV4K2ldLmluZGV4T2YodG9maW5kKT09MCl7XG4gICAgICBvdXQucHVzaChbdGhpcy5zdGF0ZS5lbnRyaWVzW2luZGV4K2ldLHBhcnNlSW50KGluZGV4KStpXSk7XG4gICAgICBpKys7XG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdDpvdXR9KTtcbiAgfSxcbiAgc2VhcmNoX2VuZDogZnVuY3Rpb24odG9maW5kKSB7XG4gICAgdmFyIG91dD1bXTtcbiAgICB2YXIgaT0wO1xuICAgIGZvcih2YXIgaT0wOyBpPHRoaXMuc3RhdGUuZW50cmllcy5sZW5ndGg7IGkrKyl7XG4gICAgICBpZih0aGlzLnN0YXRlLmVudHJpZXNbaV0uaW5kZXhPZih0b2ZpbmQpPT10aGlzLnN0YXRlLmVudHJpZXNbaV0ubGVuZ3RoLTEpe1xuICAgICAgICBvdXQucHVzaChbdGhpcy5zdGF0ZS5lbnRyaWVzW2ldLGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0Om91dH0pO1xuICB9LFxuICBzZWFyY2hfbWlkZGxlOiBmdW5jdGlvbih0b2ZpbmQpIHtcbiAgICB2YXIgb3V0PVtdO1xuICAgIHZhciBpPTA7XG4gICAgZm9yKHZhciBpPTA7IGk8dGhpcy5zdGF0ZS5lbnRyaWVzLmxlbmd0aDsgaSsrKXtcbiAgICAgIHZhciBlbnQ9dGhpcy5zdGF0ZS5lbnRyaWVzW2ldO1xuICAgICAgaWYoZW50LmluZGV4T2YodG9maW5kKSA+LTEgJiYgZW50LmluZGV4T2YodG9maW5kKSE9MCAmJiBlbnQuaW5kZXhPZih0b2ZpbmQpIT1lbnQubGVuZ3RoLTEpe1xuICAgICAgICBvdXQucHVzaChbdGhpcy5zdGF0ZS5lbnRyaWVzW2ldLGldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRTdGF0ZSh7cmVzdWx0Om91dH0pOyAgXG4gIH0sXG4gIHNlYXJjaF9mdWxsdGV4dDogZnVuY3Rpb24odG9maW5kKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBrc2Uuc2VhcmNoKFwibW9lZGljdFwiLHRvZmluZCx7cmFuZ2U6e3N0YXJ0OjB9fSxmdW5jdGlvbihlcnIsZGF0YSl7XG4gICAgICB0aGF0LnNldFN0YXRlKHtyZXN1bHQ6ZGF0YS5leGNlcnB0fSk7XG4gICAgfSkgXG4gIH0sXG4gIGdvdG9FbnRyeTogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIGtkZS5vcGVuKFwibW9lZGljdFwiLGZ1bmN0aW9uKGVycixkYil7XG4gICAgICAvL3ZhciBkZWY9ZGIuZ2V0KFwibW9lZGljdC5maWxlQ29udGVudHMuMC5cIitpbmRleCk7XG4gICAgICB2YXIgZGVmPWRiLmdldChbXCJmaWxlQ29udGVudHNcIiwwLGluZGV4XSxmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgdmFyIGQ9ZGF0YS5zcGxpdChcIlxcblwiKTtcbiAgICAgICAgdGhhdC5zZXRTdGF0ZSh7ZGVmOmR9KTtcbiAgICAgIH0pO1xuICAgIH0pOyBcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VhcmNoYmFyLCB7ZG9zZWFyY2g6IHRoaXMuZG9zZWFyY2h9KSwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJ2aWV3LCB7cmVzdWx0OiB0aGlzLnN0YXRlLnJlc3VsdCwgZ290b0VudHJ5OiB0aGlzLmdvdG9FbnRyeX0pLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2hvd3RleHQsIHtkZWY6IHRoaXMuc3RhdGUuZGVmLCBzZWFyY2h0eXBlOiB0aGlzLnN0YXRlLnNlYXJjaHR5cGUsIHRvZmluZDogdGhpcy5zdGF0ZS50b2ZpbmQsIHJlc3VsdDogdGhpcy5zdGF0ZS5yZXN1bHR9KVxuICAgIClcbiAgICApO1xuICB9XG59KTtcbm1vZHVsZS5leHBvcnRzPW1haW5jb21wb25lbnQ7IiwidmFyIE92ZXJ2aWV3PVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJPdmVydmlld1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICBcdHJldHVybiB7cmVzTGlzdDpbXX07XG4gIH0sXG4gIGdldEVudHJ5OiBmdW5jdGlvbihlKSB7XG4gICAgdmFyIGVudHJ5SW5kZXg9ZS50YXJnZXQudmFsdWU7XG4gICAgdGhpcy5wcm9wcy5nb3RvRW50cnkoZW50cnlJbmRleCk7XG4gIH0sXG4gIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcyl7XG4gICAgdmFyIHJlcz1uZXh0UHJvcHMucmVzdWx0O1xuICAgIHZhciByZXNMaXN0PXJlcy5tYXAodGhpcy5yZW5kZXJSZXN1bHQpO1xuICAgIHRoaXMuc2V0U3RhdGUoe3Jlc0xpc3Q6cmVzTGlzdH0pO1xuICB9LFxuICByZW5kZXJSZXN1bHQ6IGZ1bmN0aW9uKGl0ZW0saW5kZXgpIHtcbiAgICBpZihpdGVtIT1cIuaQnOWwi+e1kOaenOWIl+ihqFwiKSByZXR1cm4gKFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIiwge3ZhbHVlOiBpdGVtWzFdfSwgaXRlbVswXSkpO1xuICAgIGVsc2UgcmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIsIG51bGwsIGl0ZW0pKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgXHR2YXIgcmVzPXRoaXMucHJvcHMucmVzdWx0IHx8IFwiXCI7XG4gICAgcmV0dXJuKFxuXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIsIHtpZDogXCJ2ZXJ0aWNhbF9jZW50ZXJcIiwgY2xhc3NOYW1lOiBcImJhZGdlXCJ9LCByZXMubGVuZ3RoKSwgXG5cdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbC1zbS0yXCJ9LCBcblx0XHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJzZWxlY3RcIiwge2NsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2xcIiwgb25DaGFuZ2U6IHRoaXMuZ2V0RW50cnl9LCBcbiAgICAgIHRoaXMuc3RhdGUucmVzTGlzdFxuXHRcdFx0KVxuXHRcdClcblx0KVx0XG4gICAgKTsgXG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHM9T3ZlcnZpZXc7IiwidmFyIFNlYXJjaGJhcj1SZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU2VhcmNoYmFyXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIFx0cmV0dXJuIHt9O1xuICB9LFxuICBkb3NlYXJjaDogZnVuY3Rpb24oKSB7XG4gIFx0dmFyIHRvZmluZD10aGlzLnJlZnMudG9maW5kLmdldERPTU5vZGUoKS52YWx1ZTtcbiAgICB2YXIgZmllbGQ9JCh0aGlzLnJlZnMuc2VhcmNodHlwZS5nZXRET01Ob2RlKCkpLmZpbmQoXCIuYWN0aXZlXCIpWzBdLmRhdGFzZXQudHlwZTtcbiAgICBcbiAgXHR0aGlzLnByb3BzLmRvc2VhcmNoKHRvZmluZCxmaWVsZCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICBcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdCAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbC1zbS0zXCJ9LCBcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7Y2xhc3NOYW1lOiBcImZvcm0tY29udHJvbCBjb2wtc20tMVwiLCB0eXBlOiBcInRleHRcIiwgcmVmOiBcInRvZmluZFwiLCBwbGFjZWhvbGRlcjogXCLoq4vovLjlhaXlrZfoqZ5cIiwgb25DaGFuZ2U6IHRoaXMuZG9zZWFyY2h9KVxuXHQgICksIFxuXHQgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLCBcIsKgwqDCoMKgXCIsICAgICBcblx0ICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiYnRuLWdyb3VwXCIsIFwiZGF0YS10b2dnbGVcIjogXCJidXR0b25zXCIsIHJlZjogXCJzZWFyY2h0eXBlXCIsIG9uQ2xpY2s6IHRoaXMuZG9zZWFyY2h9LCBcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJzdGFydFwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzIGFjdGl2ZVwifSwgXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJyYWRpb1wiLCBuYW1lOiBcImZpZWxkXCIsIGF1dG9jb21wbGV0ZTogXCJvZmZcIn0sIFwi6aCtXCIpXG5cdCAgICApLCBcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJlbmRcIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJyYWRpb1wiLCBuYW1lOiBcImZpZWxkXCIsIGF1dG9jb21wbGV0ZTogXCJvZmZcIn0sIFwi5bC+XCIpXG5cdCAgICApLCBcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJtaWRkbGVcIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJyYWRpb1wiLCBuYW1lOiBcImZpZWxkXCIsIGF1dG9jb21wbGV0ZTogXCJvZmZcIn0sIFwi5LitXCIpXG5cdCAgICApLCBcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJsYWJlbFwiLCB7XCJkYXRhLXR5cGVcIjogXCJmdWxsdGV4dFwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzXCJ9LCBcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInJhZGlvXCIsIG5hbWU6IFwiZmllbGRcIiwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSwgXCLlhahcIilcblx0ICAgIClcblx0ICApXG5cdClcbiAgKVxuICAgIFx0XG4gICAgKTsgXG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHM9U2VhcmNoYmFyOyIsInZhciBTZWFyY2hoaXN0b3J5PVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTZWFyY2hoaXN0b3J5XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIFx0cmV0dXJuIHt9O1xuICB9LFxuICBcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG5cdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXCJyZW5kZXIgU2VhcmNoaGlzdG9yeVwiKVxuICAgIFx0XG4gICAgKTsgXG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHM9U2VhcmNoaGlzdG9yeTsiLCJ2YXIgU2VhcmNoaGlzdG9yeT1yZXF1aXJlKFwiLi9zZWFyY2hoaXN0b3J5LmpzeFwiKTtcbnZhciBEZWZib3g9cmVxdWlyZShcIi4vZGVmYm94LmpzeFwiKTtcbnZhciBTaG93dGV4dD1SZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU2hvd3RleHRcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgXHRyZXR1cm4ge307XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIChcbiAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICAgIFx0UmVhY3QuY3JlYXRlRWxlbWVudChTZWFyY2hoaXN0b3J5LCB7cmVzdWx0OiB0aGlzLnByb3BzLnJlc3VsdH0pLCBcbiAgICBcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoRGVmYm94LCB7ZGVmOiB0aGlzLnByb3BzLmRlZiwgcmVzdWx0OiB0aGlzLnByb3BzLnJlc3VsdH0pXHRcbiAgICApXG4gICAgKTtcbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cz1TaG93dGV4dDsiLCJ2YXIgdG9rZW5pemVycz1yZXF1aXJlKCcuL3Rva2VuaXplcnMnKTtcbnZhciBub3JtYWxpemVUYmw9bnVsbDtcbnZhciBzZXROb3JtYWxpemVUYWJsZT1mdW5jdGlvbih0Ymwsb2JqKSB7XG5cdGlmICghb2JqKSB7XG5cdFx0b2JqPXt9O1xuXHRcdGZvciAodmFyIGk9MDtpPHRibC5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgYXJyPXRibFtpXS5zcGxpdChcIj1cIik7XG5cdFx0XHRvYmpbYXJyWzBdXT1hcnJbMV07XG5cdFx0fVxuXHR9XG5cdG5vcm1hbGl6ZVRibD1vYmo7XG5cdHJldHVybiBvYmo7XG59XG52YXIgbm9ybWFsaXplMT1mdW5jdGlvbih0b2tlbikge1xuXHRpZiAoIXRva2VuKSByZXR1cm4gXCJcIjtcblx0dG9rZW49dG9rZW4ucmVwbGFjZSgvWyBcXG5cXC4s77yM44CC77yB77yO44CM44CN77ya77yb44CBXS9nLCcnKS50cmltKCk7XG5cdGlmICghbm9ybWFsaXplVGJsKSByZXR1cm4gdG9rZW47XG5cdGlmICh0b2tlbi5sZW5ndGg9PTEpIHtcblx0XHRyZXR1cm4gbm9ybWFsaXplVGJsW3Rva2VuXSB8fCB0b2tlbjtcblx0fSBlbHNlIHtcblx0XHRmb3IgKHZhciBpPTA7aTx0b2tlbi5sZW5ndGg7aSsrKSB7XG5cdFx0XHR0b2tlbltpXT1ub3JtYWxpemVUYmxbdG9rZW5baV1dIHx8IHRva2VuW2ldO1xuXHRcdH1cblx0XHRyZXR1cm4gdG9rZW47XG5cdH1cbn1cbnZhciBpc1NraXAxPWZ1bmN0aW9uKHRva2VuKSB7XG5cdHZhciB0PXRva2VuLnRyaW0oKTtcblx0cmV0dXJuICh0PT1cIlwiIHx8IHQ9PVwi44CAXCIgfHwgdD09XCLigLtcIiB8fCB0PT1cIlxcblwiKTtcbn1cbnZhciBub3JtYWxpemVfdGliZXRhbj1mdW5jdGlvbih0b2tlbikge1xuXHRyZXR1cm4gdG9rZW4ucmVwbGFjZSgvW+C8jeC8iyBdL2csJycpLnRyaW0oKTtcbn1cblxudmFyIGlzU2tpcF90aWJldGFuPWZ1bmN0aW9uKHRva2VuKSB7XG5cdHZhciB0PXRva2VuLnRyaW0oKTtcblx0cmV0dXJuICh0PT1cIlwiIHx8IHQ9PVwi44CAXCIgfHwgIHQ9PVwiXFxuXCIpO1x0XG59XG52YXIgc2ltcGxlMT17XG5cdGZ1bmM6e1xuXHRcdHRva2VuaXplOnRva2VuaXplcnMuc2ltcGxlXG5cdFx0LHNldE5vcm1hbGl6ZVRhYmxlOnNldE5vcm1hbGl6ZVRhYmxlXG5cdFx0LG5vcm1hbGl6ZTogbm9ybWFsaXplMVxuXHRcdCxpc1NraXA6XHRpc1NraXAxXG5cdH1cblx0XG59XG52YXIgdGliZXRhbjE9e1xuXHRmdW5jOntcblx0XHR0b2tlbml6ZTp0b2tlbml6ZXJzLnRpYmV0YW5cblx0XHQsc2V0Tm9ybWFsaXplVGFibGU6c2V0Tm9ybWFsaXplVGFibGVcblx0XHQsbm9ybWFsaXplOm5vcm1hbGl6ZV90aWJldGFuXG5cdFx0LGlzU2tpcDppc1NraXBfdGliZXRhblxuXHR9XG59XG5tb2R1bGUuZXhwb3J0cz17XCJzaW1wbGUxXCI6c2ltcGxlMSxcInRpYmV0YW4xXCI6dGliZXRhbjF9IiwiLyogXG4gIGN1c3RvbSBmdW5jIGZvciBidWlsZGluZyBhbmQgc2VhcmNoaW5nIHlkYlxuXG4gIGtlZXAgYWxsIHZlcnNpb25cbiAgXG4gIGdldEFQSSh2ZXJzaW9uKTsgLy9yZXR1cm4gaGFzaCBvZiBmdW5jdGlvbnMgLCBpZiB2ZXIgaXMgb21pdCAsIHJldHVybiBsYXN0ZXN0XG5cdFxuICBwb3N0aW5nczJUcmVlICAgICAgLy8gaWYgdmVyc2lvbiBpcyBub3Qgc3VwcGx5LCBnZXQgbGFzdGVzdFxuICB0b2tlbml6ZSh0ZXh0LGFwaSkgLy8gY29udmVydCBhIHN0cmluZyBpbnRvIHRva2VucyhkZXBlbmRzIG9uIG90aGVyIGFwaSlcbiAgbm9ybWFsaXplVG9rZW4gICAgIC8vIHN0ZW1taW5nIGFuZCBldGNcbiAgaXNTcGFjZUNoYXIgICAgICAgIC8vIG5vdCBhIHNlYXJjaGFibGUgdG9rZW5cbiAgaXNTa2lwQ2hhciAgICAgICAgIC8vIDAgdnBvc1xuXG4gIGZvciBjbGllbnQgYW5kIHNlcnZlciBzaWRlXG4gIFxuKi9cbnZhciBjb25maWdzPXJlcXVpcmUoXCIuL2NvbmZpZ3NcIik7XG52YXIgY29uZmlnX3NpbXBsZT1cInNpbXBsZTFcIjtcbnZhciBvcHRpbWl6ZT1mdW5jdGlvbihqc29uLGNvbmZpZykge1xuXHRjb25maWc9Y29uZmlnfHxjb25maWdfc2ltcGxlO1xuXHRyZXR1cm4ganNvbjtcbn1cblxudmFyIGdldEFQST1mdW5jdGlvbihjb25maWcpIHtcblx0Y29uZmlnPWNvbmZpZ3x8Y29uZmlnX3NpbXBsZTtcblx0dmFyIGZ1bmM9Y29uZmlnc1tjb25maWddLmZ1bmM7XG5cdGZ1bmMub3B0aW1pemU9b3B0aW1pemU7XG5cdGlmIChjb25maWc9PVwic2ltcGxlMVwiKSB7XG5cdFx0Ly9hZGQgY29tbW9uIGN1c3RvbSBmdW5jdGlvbiBoZXJlXG5cdH0gZWxzZSBpZiAoY29uZmlnPT1cInRpYmV0YW4xXCIpIHtcblxuXHR9IGVsc2UgdGhyb3cgXCJjb25maWcgXCIrY29uZmlnICtcIm5vdCBzdXBwb3J0ZWRcIjtcblxuXHRyZXR1cm4gZnVuYztcbn1cblxubW9kdWxlLmV4cG9ydHM9e2dldEFQSTpnZXRBUEl9OyIsInZhciB0aWJldGFuID1mdW5jdGlvbihzKSB7XG5cdC8vY29udGludW91cyB0c2hlZyBncm91cGVkIGludG8gc2FtZSB0b2tlblxuXHQvL3NoYWQgYW5kIHNwYWNlIGdyb3VwZWQgaW50byBzYW1lIHRva2VuXG5cdHZhciBvZmZzZXQ9MDtcblx0dmFyIHRva2Vucz1bXSxvZmZzZXRzPVtdO1xuXHRzPXMucmVwbGFjZSgvXFxyXFxuL2csJ1xcbicpLnJlcGxhY2UoL1xcci9nLCdcXG4nKTtcblx0dmFyIGFycj1zLnNwbGl0KCdcXG4nKTtcblxuXHRmb3IgKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKykge1xuXHRcdHZhciBsYXN0PTA7XG5cdFx0dmFyIHN0cj1hcnJbaV07XG5cdFx0c3RyLnJlcGxhY2UoL1vgvI3gvIsgXSsvZyxmdW5jdGlvbihtLG0xKXtcblx0XHRcdHRva2Vucy5wdXNoKHN0ci5zdWJzdHJpbmcobGFzdCxtMSkrbSk7XG5cdFx0XHRvZmZzZXRzLnB1c2gob2Zmc2V0K2xhc3QpO1xuXHRcdFx0bGFzdD1tMSttLmxlbmd0aDtcblx0XHR9KTtcblx0XHRpZiAobGFzdDxzdHIubGVuZ3RoKSB7XG5cdFx0XHR0b2tlbnMucHVzaChzdHIuc3Vic3RyaW5nKGxhc3QpKTtcblx0XHRcdG9mZnNldHMucHVzaChsYXN0KTtcblx0XHR9XG5cdFx0aWYgKGk9PT1hcnIubGVuZ3RoLTEpIGJyZWFrO1xuXHRcdHRva2Vucy5wdXNoKCdcXG4nKTtcblx0XHRvZmZzZXRzLnB1c2gob2Zmc2V0K2xhc3QpO1xuXHRcdG9mZnNldCs9c3RyLmxlbmd0aCsxO1xuXHR9XG5cblx0cmV0dXJuIHt0b2tlbnM6dG9rZW5zLG9mZnNldHM6b2Zmc2V0c307XG59O1xudmFyIGlzU3BhY2U9ZnVuY3Rpb24oYykge1xuXHRyZXR1cm4gKGM9PVwiIFwiKSA7Ly98fCAoYz09XCIsXCIpIHx8IChjPT1cIi5cIik7XG59XG52YXIgaXNDSksgPWZ1bmN0aW9uKGMpIHtyZXR1cm4gKChjPj0weDMwMDAgJiYgYzw9MHg5RkZGKSBcbnx8IChjPj0weEQ4MDAgJiYgYzwweERDMDApIHx8IChjPj0weEZGMDApICkgO31cbnZhciBzaW1wbGUxPWZ1bmN0aW9uKHMpIHtcblx0dmFyIG9mZnNldD0wO1xuXHR2YXIgdG9rZW5zPVtdLG9mZnNldHM9W107XG5cdHM9cy5yZXBsYWNlKC9cXHJcXG4vZywnXFxuJykucmVwbGFjZSgvXFxyL2csJ1xcbicpO1xuXHRhcnI9cy5zcGxpdCgnXFxuJyk7XG5cblx0dmFyIHB1c2h0b2tlbj1mdW5jdGlvbih0LG9mZikge1xuXHRcdHZhciBpPTA7XG5cdFx0aWYgKHQuY2hhckNvZGVBdCgwKT4yNTUpIHtcblx0XHRcdHdoaWxlIChpPHQubGVuZ3RoKSB7XG5cdFx0XHRcdHZhciBjPXQuY2hhckNvZGVBdChpKTtcblx0XHRcdFx0b2Zmc2V0cy5wdXNoKG9mZitpKTtcblx0XHRcdFx0dG9rZW5zLnB1c2godFtpXSk7XG5cdFx0XHRcdGlmIChjPj0weEQ4MDAgJiYgYzw9MHhERkZGKSB7XG5cdFx0XHRcdFx0dG9rZW5zW3Rva2Vucy5sZW5ndGgtMV0rPXRbaV07IC8vZXh0ZW5zaW9uIEIsQyxEXG5cdFx0XHRcdH1cblx0XHRcdFx0aSsrO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0b2tlbnMucHVzaCh0KTtcblx0XHRcdG9mZnNldHMucHVzaChvZmYpO1x0XG5cdFx0fVxuXHR9XG5cdGZvciAodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIGxhc3Q9MCxzcD1cIlwiO1xuXHRcdHN0cj1hcnJbaV07XG5cdFx0c3RyLnJlcGxhY2UoL1tfMC05QS1aYS16XSsvZyxmdW5jdGlvbihtLG0xKXtcblx0XHRcdHdoaWxlIChpc1NwYWNlKHNwPXN0cltsYXN0XSkgJiYgbGFzdDxzdHIubGVuZ3RoKSB7XG5cdFx0XHRcdHRva2Vuc1t0b2tlbnMubGVuZ3RoLTFdKz1zcDtcblx0XHRcdFx0bGFzdCsrO1xuXHRcdFx0fVxuXHRcdFx0cHVzaHRva2VuKHN0ci5zdWJzdHJpbmcobGFzdCxtMSkrbSAsIG9mZnNldCtsYXN0KTtcblx0XHRcdG9mZnNldHMucHVzaChvZmZzZXQrbGFzdCk7XG5cdFx0XHRsYXN0PW0xK20ubGVuZ3RoO1xuXHRcdH0pO1xuXG5cdFx0aWYgKGxhc3Q8c3RyLmxlbmd0aCkge1xuXHRcdFx0d2hpbGUgKGlzU3BhY2Uoc3A9c3RyW2xhc3RdKSAmJiBsYXN0PHN0ci5sZW5ndGgpIHtcblx0XHRcdFx0dG9rZW5zW3Rva2Vucy5sZW5ndGgtMV0rPXNwO1xuXHRcdFx0XHRsYXN0Kys7XG5cdFx0XHR9XG5cdFx0XHRwdXNodG9rZW4oc3RyLnN1YnN0cmluZyhsYXN0KSwgb2Zmc2V0K2xhc3QpO1xuXHRcdFx0XG5cdFx0fVx0XHRcblx0XHRvZmZzZXRzLnB1c2gob2Zmc2V0K2xhc3QpO1xuXHRcdG9mZnNldCs9c3RyLmxlbmd0aCsxO1xuXHRcdGlmIChpPT09YXJyLmxlbmd0aC0xKSBicmVhaztcblx0XHR0b2tlbnMucHVzaCgnXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4ge3Rva2Vuczp0b2tlbnMsb2Zmc2V0czpvZmZzZXRzfTtcblxufTtcblxudmFyIHNpbXBsZT1mdW5jdGlvbihzKSB7XG5cdHZhciB0b2tlbj0nJztcblx0dmFyIHRva2Vucz1bXSwgb2Zmc2V0cz1bXSA7XG5cdHZhciBpPTA7IFxuXHR2YXIgbGFzdHNwYWNlPWZhbHNlO1xuXHR2YXIgYWRkdG9rZW49ZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCF0b2tlbikgcmV0dXJuO1xuXHRcdHRva2Vucy5wdXNoKHRva2VuKTtcblx0XHRvZmZzZXRzLnB1c2goaSk7XG5cdFx0dG9rZW49Jyc7XG5cdH1cblx0d2hpbGUgKGk8cy5sZW5ndGgpIHtcblx0XHR2YXIgYz1zLmNoYXJBdChpKTtcblx0XHR2YXIgY29kZT1zLmNoYXJDb2RlQXQoaSk7XG5cdFx0aWYgKGlzQ0pLKGNvZGUpKSB7XG5cdFx0XHRhZGR0b2tlbigpO1xuXHRcdFx0dG9rZW49Yztcblx0XHRcdGlmIChjb2RlPj0weEQ4MDAgJiYgY29kZTwweERDMDApIHsgLy9oaWdoIHNvcnJhZ2F0ZVxuXHRcdFx0XHR0b2tlbis9cy5jaGFyQXQoaSsxKTtpKys7XG5cdFx0XHR9XG5cdFx0XHRhZGR0b2tlbigpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoYz09JyYnIHx8IGM9PSc8JyB8fCBjPT0nPycgfHwgYz09XCIsXCIgfHwgYz09XCIuXCJcblx0XHRcdHx8IGM9PSd8JyB8fCBjPT0nficgfHwgYz09J2AnIHx8IGM9PSc7JyBcblx0XHRcdHx8IGM9PSc+JyB8fCBjPT0nOicgXG5cdFx0XHR8fCBjPT0nPScgfHwgYz09J0AnICB8fCBjPT1cIi1cIiBcblx0XHRcdHx8IGM9PSddJyB8fCBjPT0nfScgIHx8IGM9PVwiKVwiIFxuXHRcdFx0Ly98fCBjPT0neycgfHwgYz09J30nfHwgYz09J1snIHx8IGM9PSddJyB8fCBjPT0nKCcgfHwgYz09JyknXG5cdFx0XHR8fCBjb2RlPT0weGYwYiB8fCBjb2RlPT0weGYwZCAvLyB0aWJldGFuIHNwYWNlXG5cdFx0XHR8fCAoY29kZT49MHgyMDAwICYmIGNvZGU8PTB4MjA2ZikpIHtcblx0XHRcdFx0YWRkdG9rZW4oKTtcblx0XHRcdFx0aWYgKGM9PScmJyB8fCBjPT0nPCcpeyAvLyB8fCBjPT0neyd8fCBjPT0nKCd8fCBjPT0nWycpIHtcblx0XHRcdFx0XHR2YXIgZW5kY2hhcj0nPic7XG5cdFx0XHRcdFx0aWYgKGM9PScmJykgZW5kY2hhcj0nOydcblx0XHRcdFx0XHQvL2Vsc2UgaWYgKGM9PSd7JykgZW5kY2hhcj0nfSc7XG5cdFx0XHRcdFx0Ly9lbHNlIGlmIChjPT0nWycpIGVuZGNoYXI9J10nO1xuXHRcdFx0XHRcdC8vZWxzZSBpZiAoYz09JygnKSBlbmRjaGFyPScpJztcblxuXHRcdFx0XHRcdHdoaWxlIChpPHMubGVuZ3RoICYmIHMuY2hhckF0KGkpIT1lbmRjaGFyKSB7XG5cdFx0XHRcdFx0XHR0b2tlbis9cy5jaGFyQXQoaSk7XG5cdFx0XHRcdFx0XHRpKys7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHRva2VuKz1lbmRjaGFyO1xuXHRcdFx0XHRcdGFkZHRva2VuKCk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dG9rZW49Yztcblx0XHRcdFx0XHRhZGR0b2tlbigpO1xuXHRcdFx0XHR9XG5cdFx0XHRcdHRva2VuPScnO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGM9PVwiIFwiKSB7XG5cdFx0XHRcdFx0dG9rZW4rPWM7XG5cdFx0XHRcdFx0bGFzdHNwYWNlPXRydWU7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0aWYgKGxhc3RzcGFjZSkgYWRkdG9rZW4oKTtcblx0XHRcdFx0XHRsYXN0c3BhY2U9ZmFsc2U7XG5cdFx0XHRcdFx0dG9rZW4rPWM7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aSsrO1xuXHR9XG5cdGFkZHRva2VuKCk7XG5cdHJldHVybiB7dG9rZW5zOnRva2VucyxvZmZzZXRzOm9mZnNldHN9O1xufVxubW9kdWxlLmV4cG9ydHM9e3NpbXBsZTpzaW1wbGUsdGliZXRhbjp0aWJldGFufTsiLCJ2YXIgaW5kZXhPZlNvcnRlZCA9IGZ1bmN0aW9uIChhcnJheSwgb2JqLCBuZWFyKSB7IFxuICB2YXIgbG93ID0gMCxcbiAgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG4gICAgaWYgKGFycmF5W21pZF09PW9iaikgcmV0dXJuIG1pZDtcbiAgICBhcnJheVttaWRdIDwgb2JqID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gIH1cbiAgaWYgKG5lYXIpIHJldHVybiBsb3c7XG4gIGVsc2UgaWYgKGFycmF5W2xvd109PW9iaikgcmV0dXJuIGxvdztlbHNlIHJldHVybiAtMTtcbn07XG52YXIgaW5kZXhPZlNvcnRlZF9zdHIgPSBmdW5jdGlvbiAoYXJyYXksIG9iaiwgbmVhcikgeyBcbiAgdmFyIGxvdyA9IDAsXG4gIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxO1xuICAgIGlmIChhcnJheVttaWRdPT1vYmopIHJldHVybiBtaWQ7XG4gICAgKGFycmF5W21pZF0ubG9jYWxlQ29tcGFyZShvYmopPDApID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gIH1cbiAgaWYgKG5lYXIpIHJldHVybiBsb3c7XG4gIGVsc2UgaWYgKGFycmF5W2xvd109PW9iaikgcmV0dXJuIGxvdztlbHNlIHJldHVybiAtMTtcbn07XG5cblxudmFyIGJzZWFyY2g9ZnVuY3Rpb24oYXJyYXksdmFsdWUsbmVhcikge1xuXHR2YXIgZnVuYz1pbmRleE9mU29ydGVkO1xuXHRpZiAodHlwZW9mIGFycmF5WzBdPT1cInN0cmluZ1wiKSBmdW5jPWluZGV4T2ZTb3J0ZWRfc3RyO1xuXHRyZXR1cm4gZnVuYyhhcnJheSx2YWx1ZSxuZWFyKTtcbn1cbnZhciBic2VhcmNoTmVhcj1mdW5jdGlvbihhcnJheSx2YWx1ZSkge1xuXHRyZXR1cm4gYnNlYXJjaChhcnJheSx2YWx1ZSx0cnVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHM9YnNlYXJjaDsvL3tic2VhcmNoTmVhcjpic2VhcmNoTmVhcixic2VhcmNoOmJzZWFyY2h9OyIsInZhciBLREU9cmVxdWlyZShcIi4va2RlXCIpO1xuLy9jdXJyZW50bHkgb25seSBzdXBwb3J0IG5vZGUuanMgZnMsIGtzYW5hZ2FwIG5hdGl2ZSBmcywgaHRtbDUgZmlsZSBzeXN0ZW1cbi8vdXNlIHNvY2tldC5pbyB0byByZWFkIGtkYiBmcm9tIHJlbW90ZSBzZXJ2ZXIgaW4gZnV0dXJlXG5tb2R1bGUuZXhwb3J0cz1LREU7IiwiLyogS3NhbmEgRGF0YWJhc2UgRW5naW5lXG5cbiAgIDIwMTUvMS8yICwgXG4gICBtb3ZlIHRvIGtzYW5hLWRhdGFiYXNlXG4gICBzaW1wbGlmaWVkIGJ5IHJlbW92aW5nIGRvY3VtZW50IHN1cHBvcnQgYW5kIHNvY2tldC5pbyBzdXBwb3J0XG5cblxuKi9cbnZhciBwb29sPXt9LGxvY2FsUG9vbD17fTtcbnZhciBhcHBwYXRoPVwiXCI7XG52YXIgYnNlYXJjaD1yZXF1aXJlKFwiLi9ic2VhcmNoXCIpO1xudmFyIEtkYj1yZXF1aXJlKCdrc2FuYS1qc29ucm9tJyk7XG52YXIga2Ricz1bXTsgLy9hdmFpbGFibGUga2RiICwgaWQgYW5kIGFic29sdXRlIHBhdGhcbnZhciBzdHJzZXA9XCJcXHVmZmZmXCI7XG52YXIga2RibGlzdGVkPWZhbHNlO1xuLypcbnZhciBfZ2V0U3luYz1mdW5jdGlvbihwYXRocyxvcHRzKSB7XG5cdHZhciBvdXQ9W107XG5cdGZvciAodmFyIGkgaW4gcGF0aHMpIHtcblx0XHRvdXQucHVzaCh0aGlzLmdldFN5bmMocGF0aHNbaV0sb3B0cykpO1x0XG5cdH1cblx0cmV0dXJuIG91dDtcbn1cbiovXG52YXIgX2dldHM9ZnVuY3Rpb24ocGF0aHMsb3B0cyxjYikgeyAvL2dldCBtYW55IGRhdGEgd2l0aCBvbmUgY2FsbFxuXG5cdGlmICghcGF0aHMpIHJldHVybiA7XG5cdGlmICh0eXBlb2YgcGF0aHM9PSdzdHJpbmcnKSB7XG5cdFx0cGF0aHM9W3BhdGhzXTtcblx0fVxuXHR2YXIgZW5naW5lPXRoaXMsIG91dHB1dD1bXTtcblxuXHR2YXIgbWFrZWNiPWZ1bmN0aW9uKHBhdGgpe1xuXHRcdHJldHVybiBmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0aWYgKCEoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkpIG91dHB1dC5wdXNoKGRhdGEpO1xuXHRcdFx0XHRlbmdpbmUuZ2V0KHBhdGgsb3B0cyx0YXNrcXVldWUuc2hpZnQoKSk7XG5cdFx0fTtcblx0fTtcblxuXHR2YXIgdGFza3F1ZXVlPVtdO1xuXHRmb3IgKHZhciBpPTA7aTxwYXRocy5sZW5ndGg7aSsrKSB7XG5cdFx0aWYgKHR5cGVvZiBwYXRoc1tpXT09XCJudWxsXCIpIHsgLy90aGlzIGlzIG9ubHkgYSBwbGFjZSBob2xkZXIgZm9yIGtleSBkYXRhIGFscmVhZHkgaW4gY2xpZW50IGNhY2hlXG5cdFx0XHRvdXRwdXQucHVzaChudWxsKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGFza3F1ZXVlLnB1c2gobWFrZWNiKHBhdGhzW2ldKSk7XG5cdFx0fVxuXHR9O1xuXG5cdHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdG91dHB1dC5wdXNoKGRhdGEpO1xuXHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0fHxlbmdpbmUsW291dHB1dCxwYXRoc10pOyAvL3JldHVybiB0byBjYWxsZXJcblx0fSk7XG5cblx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pOyAvL3J1biB0aGUgdGFza1xufVxuXG52YXIgZ2V0RmlsZVJhbmdlPWZ1bmN0aW9uKGkpIHtcblx0dmFyIGVuZ2luZT10aGlzO1xuXG5cdHZhciBmaWxlUGFnZUNvdW50PWVuZ2luZS5nZXQoW1wiZmlsZVBhZ2VDb3VudFwiXSk7XG5cdGlmIChmaWxlUGFnZUNvdW50KSB7XG5cdFx0aWYgKGk9PTApIHtcblx0XHRcdHJldHVybiB7c3RhcnQ6MCxlbmQ6ZmlsZVBhZ2VDb3VudFswXS0xfTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmV0dXJuIHtzdGFydDpmaWxlUGFnZUNvdW50W2ktMV0sZW5kOmZpbGVQYWdlQ291bnRbaV0tMX07XG5cdFx0fVxuXHR9XG5cblx0Ly9vbGQgYnVnZ3kgY29kZVxuXHR2YXIgZmlsZU5hbWVzPWVuZ2luZS5nZXQoW1wiZmlsZU5hbWVzXCJdKTtcblx0dmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoW1wiZmlsZU9mZnNldHNcIl0pO1xuXHR2YXIgcGFnZU9mZnNldHM9ZW5naW5lLmdldChbXCJwYWdlT2Zmc2V0c1wiXSk7XG5cdHZhciBwYWdlTmFtZXM9ZW5naW5lLmdldChbXCJwYWdlTmFtZXNcIl0pO1xuXHR2YXIgZmlsZVN0YXJ0PWZpbGVPZmZzZXRzW2ldLCBmaWxlRW5kPWZpbGVPZmZzZXRzW2krMV0tMTtcblxuXHRcblx0dmFyIHN0YXJ0PWJzZWFyY2gocGFnZU9mZnNldHMsZmlsZVN0YXJ0LHRydWUpO1x0XG5cdC8vaWYgKHBhZ2VPZmZzZXRzW3N0YXJ0XT09ZmlsZVN0YXJ0KSBzdGFydC0tO1xuXHRcblx0Ly93b3JrIGFyb3VuZCBmb3IgamlhbmdrYW5neXVyXG5cdHdoaWxlIChwYWdlTmFtZXNbc3RhcnQrMV09PVwiX1wiKSBzdGFydCsrO1xuXG4gIC8vaWYgKGk9PTApIHN0YXJ0PTA7IC8vd29yayBhcm91bmQgZm9yIGZpcnN0IGZpbGVcblx0dmFyIGVuZD1ic2VhcmNoKHBhZ2VPZmZzZXRzLGZpbGVFbmQsdHJ1ZSk7XG5cdHJldHVybiB7c3RhcnQ6c3RhcnQsZW5kOmVuZH07XG59XG5cbnZhciBnZXRmcD1mdW5jdGlvbihhYnNvbHV0ZXBhZ2UpIHtcblx0dmFyIGZpbGVPZmZzZXRzPXRoaXMuZ2V0KFtcImZpbGVPZmZzZXRzXCJdKTtcblx0dmFyIHBhZ2VPZmZzZXRzPXRoaXMuZ2V0KFtcInBhZ2VPZmZzZXRzXCJdKTtcblx0dmFyIHBhZ2VvZmZzZXQ9cGFnZU9mZnNldHNbYWJzb2x1dGVwYWdlXTtcblx0dmFyIGZpbGU9YnNlYXJjaChmaWxlT2Zmc2V0cyxwYWdlb2Zmc2V0LHRydWUpLTE7XG5cblx0dmFyIGZpbGVTdGFydD1maWxlT2Zmc2V0c1tmaWxlXTtcblx0dmFyIHN0YXJ0PWJzZWFyY2gocGFnZU9mZnNldHMsZmlsZVN0YXJ0LHRydWUpO1x0XG5cblx0dmFyIHBhZ2U9YWJzb2x1dGVwYWdlLXN0YXJ0LTE7XG5cdHJldHVybiB7ZmlsZTpmaWxlLHBhZ2U6cGFnZX07XG59XG4vL3JldHVybiBhcnJheSBvZiBvYmplY3Qgb2YgbmZpbGUgbnBhZ2UgZ2l2ZW4gcGFnZW5hbWVcbnZhciBmaW5kUGFnZT1mdW5jdGlvbihwYWdlbmFtZSkge1xuXHR2YXIgcGFnZW5hbWVzPXRoaXMuZ2V0KFwicGFnZU5hbWVzXCIpO1xuXHR2YXIgb3V0PVtdO1xuXHRmb3IgKHZhciBpPTA7aTxwYWdlbmFtZXMubGVuZ3RoO2krKykge1xuXHRcdGlmIChwYWdlbmFtZXNbaV09PXBhZ2VuYW1lKSB7XG5cdFx0XHR2YXIgZnA9Z2V0ZnAuYXBwbHkodGhpcyxbaV0pO1xuXHRcdFx0b3V0LnB1c2goe2ZpbGU6ZnAuZmlsZSxwYWdlOmZwLnBhZ2UsYWJzcGFnZTppfSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiBvdXQ7XG59XG52YXIgZ2V0RmlsZVBhZ2VPZmZzZXRzPWZ1bmN0aW9uKGkpIHtcblx0dmFyIHBhZ2VPZmZzZXRzPXRoaXMuZ2V0KFwicGFnZU9mZnNldHNcIik7XG5cdHZhciByYW5nZT1nZXRGaWxlUmFuZ2UuYXBwbHkodGhpcyxbaV0pO1xuXHRyZXR1cm4gcGFnZU9mZnNldHMuc2xpY2UocmFuZ2Uuc3RhcnQscmFuZ2UuZW5kKzEpO1xufVxuXG52YXIgZ2V0RmlsZVBhZ2VOYW1lcz1mdW5jdGlvbihpKSB7XG5cdHZhciByYW5nZT1nZXRGaWxlUmFuZ2UuYXBwbHkodGhpcyxbaV0pO1xuXHR2YXIgcGFnZU5hbWVzPXRoaXMuZ2V0KFwicGFnZU5hbWVzXCIpO1xuXHRyZXR1cm4gcGFnZU5hbWVzLnNsaWNlKHJhbmdlLnN0YXJ0LHJhbmdlLmVuZCsxKTtcbn1cbnZhciBsb2NhbGVuZ2luZV9nZXQ9ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XG5cdHZhciBlbmdpbmU9dGhpcztcblx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcblx0XHRjYj1vcHRzO1xuXHRcdG9wdHM9e3JlY3Vyc2l2ZTpmYWxzZX07XG5cdH1cblx0aWYgKCFwYXRoKSB7XG5cdFx0aWYgKGNiKSBjYihudWxsKTtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXG5cdGlmICh0eXBlb2YgY2IhPVwiZnVuY3Rpb25cIikge1xuXHRcdHJldHVybiBlbmdpbmUua2RiLmdldChwYXRoLG9wdHMpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBwYXRoPT1cInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGVuZ2luZS5rZGIuZ2V0KFtwYXRoXSxvcHRzLGNiKTtcblx0fSBlbHNlIGlmICh0eXBlb2YgcGF0aFswXSA9PVwic3RyaW5nXCIpIHtcblx0XHRyZXR1cm4gZW5naW5lLmtkYi5nZXQocGF0aCxvcHRzLGNiKTtcblx0fSBlbHNlIGlmICh0eXBlb2YgcGF0aFswXSA9PVwib2JqZWN0XCIpIHtcblx0XHRyZXR1cm4gX2dldHMuYXBwbHkoZW5naW5lLFtwYXRoLG9wdHMsY2JdKTtcblx0fSBlbHNlIHtcblx0XHRlbmdpbmUua2RiLmdldChbXSxvcHRzLGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Y2IoZGF0YVswXSk7Ly9yZXR1cm4gdG9wIGxldmVsIGtleXNcblx0XHR9KTtcblx0fVxufTtcdFxuXG52YXIgZ2V0UHJlbG9hZEZpZWxkPWZ1bmN0aW9uKHVzZXIpIHtcblx0dmFyIHByZWxvYWQ9W1tcIm1ldGFcIl0sW1wiZmlsZU5hbWVzXCJdLFtcImZpbGVPZmZzZXRzXCJdLFtcInBhZ2VOYW1lc1wiXSxbXCJwYWdlT2Zmc2V0c1wiXSxbXCJmaWxlUGFnZUNvdW50XCJdXTtcblx0Ly9bXCJ0b2tlbnNcIl0sW1wicG9zdGluZ3NsZW5cIl0ga3NlIHdpbGwgbG9hZCBpdFxuXHRpZiAodXNlciAmJiB1c2VyLmxlbmd0aCkgeyAvL3VzZXIgc3VwcGx5IHByZWxvYWRcblx0XHRmb3IgKHZhciBpPTA7aTx1c2VyLmxlbmd0aDtpKyspIHtcblx0XHRcdGlmIChwcmVsb2FkLmluZGV4T2YodXNlcltpXSk9PS0xKSB7XG5cdFx0XHRcdHByZWxvYWQucHVzaCh1c2VyW2ldKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0cmV0dXJuIHByZWxvYWQ7XG59XG52YXIgY3JlYXRlTG9jYWxFbmdpbmU9ZnVuY3Rpb24oa2RiLG9wdHMsY2IsY29udGV4dCkge1xuXHR2YXIgZW5naW5lPXtrZGI6a2RiLCBxdWVyeUNhY2hlOnt9LCBwb3N0aW5nQ2FjaGU6e30sIGNhY2hlOnt9fTtcblxuXHRpZiAodHlwZW9mIGNvbnRleHQ9PVwib2JqZWN0XCIpIGVuZ2luZS5jb250ZXh0PWNvbnRleHQ7XG5cdGVuZ2luZS5nZXQ9bG9jYWxlbmdpbmVfZ2V0O1xuXG5cdGVuZ2luZS5maWxlT2Zmc2V0PWZpbGVPZmZzZXQ7XG5cdGVuZ2luZS5mb2xkZXJPZmZzZXQ9Zm9sZGVyT2Zmc2V0O1xuXHRlbmdpbmUucGFnZU9mZnNldD1wYWdlT2Zmc2V0O1xuXHRlbmdpbmUuZ2V0RmlsZVBhZ2VOYW1lcz1nZXRGaWxlUGFnZU5hbWVzO1xuXHRlbmdpbmUuZ2V0RmlsZVBhZ2VPZmZzZXRzPWdldEZpbGVQYWdlT2Zmc2V0cztcblx0ZW5naW5lLmdldEZpbGVSYW5nZT1nZXRGaWxlUmFuZ2U7XG5cdGVuZ2luZS5maW5kUGFnZT1maW5kUGFnZTtcblx0Ly9vbmx5IGxvY2FsIGVuZ2luZSBhbGxvdyBnZXRTeW5jXG5cdC8vaWYgKGtkYi5mcy5nZXRTeW5jKSBlbmdpbmUuZ2V0U3luYz1lbmdpbmUua2RiLmdldFN5bmM7XG5cdFxuXHQvL3NwZWVkeSBuYXRpdmUgZnVuY3Rpb25zXG5cdGlmIChrZGIuZnMubWVyZ2VQb3N0aW5ncykge1xuXHRcdGVuZ2luZS5tZXJnZVBvc3RpbmdzPWtkYi5mcy5tZXJnZVBvc3RpbmdzLmJpbmQoa2RiLmZzKTtcblx0fVxuXHRcblx0dmFyIHNldFByZWxvYWQ9ZnVuY3Rpb24ocmVzKSB7XG5cdFx0ZW5naW5lLmRibmFtZT1yZXNbMF0ubmFtZTtcblx0XHQvL2VuZ2luZS5jdXN0b21mdW5jPWN1c3RvbWZ1bmMuZ2V0QVBJKHJlc1swXS5jb25maWcpO1xuXHRcdGVuZ2luZS5yZWFkeT10cnVlO1xuXHR9XG5cblx0dmFyIHByZWxvYWQ9Z2V0UHJlbG9hZEZpZWxkKG9wdHMucHJlbG9hZCk7XG5cdHZhciBvcHRzPXtyZWN1cnNpdmU6dHJ1ZX07XG5cdC8vaWYgKHR5cGVvZiBjYj09XCJmdW5jdGlvblwiKSB7XG5cdFx0X2dldHMuYXBwbHkoZW5naW5lLFsgcHJlbG9hZCwgb3B0cyxmdW5jdGlvbihyZXMpe1xuXHRcdFx0c2V0UHJlbG9hZChyZXMpO1xuXHRcdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW2VuZ2luZV0pO1xuXHRcdH1dKTtcblx0Ly99IGVsc2Uge1xuXHQvL1x0c2V0UHJlbG9hZChfZ2V0U3luYy5hcHBseShlbmdpbmUsW3ByZWxvYWQsb3B0c10pKTtcblx0Ly99XG5cdHJldHVybiBlbmdpbmU7XG59XG5cbnZhciBwYWdlT2Zmc2V0PWZ1bmN0aW9uKHBhZ2VuYW1lKSB7XG5cdHZhciBlbmdpbmU9dGhpcztcblx0aWYgKGFyZ3VtZW50cy5sZW5ndGg+MSkgdGhyb3cgXCJhcmd1bWVudCA6IHBhZ2VuYW1lIFwiO1xuXG5cdHZhciBwYWdlTmFtZXM9ZW5naW5lLmdldChcInBhZ2VOYW1lc1wiKTtcblx0dmFyIHBhZ2VPZmZzZXRzPWVuZ2luZS5nZXQoXCJwYWdlT2Zmc2V0c1wiKTtcblxuXHR2YXIgaT1wYWdlTmFtZXMuaW5kZXhPZihwYWdlbmFtZSk7XG5cdHJldHVybiAoaT4tMSk/cGFnZU9mZnNldHNbaV06MDtcbn1cbnZhciBmaWxlT2Zmc2V0PWZ1bmN0aW9uKGZuKSB7XG5cdHZhciBlbmdpbmU9dGhpcztcblx0dmFyIGZpbGVuYW1lcz1lbmdpbmUuZ2V0KFwiZmlsZU5hbWVzXCIpO1xuXHR2YXIgb2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdHZhciBpPWZpbGVuYW1lcy5pbmRleE9mKGZuKTtcblx0aWYgKGk9PS0xKSByZXR1cm4gbnVsbDtcblx0cmV0dXJuIHtzdGFydDogb2Zmc2V0c1tpXSwgZW5kOm9mZnNldHNbaSsxXX07XG59XG5cbnZhciBmb2xkZXJPZmZzZXQ9ZnVuY3Rpb24oZm9sZGVyKSB7XG5cdHZhciBlbmdpbmU9dGhpcztcblx0dmFyIHN0YXJ0PTAsZW5kPTA7XG5cdHZhciBmaWxlbmFtZXM9ZW5naW5lLmdldChcImZpbGVOYW1lc1wiKTtcblx0dmFyIG9mZnNldHM9ZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHRmb3IgKHZhciBpPTA7aTxmaWxlbmFtZXMubGVuZ3RoO2krKykge1xuXHRcdGlmIChmaWxlbmFtZXNbaV0uc3Vic3RyaW5nKDAsZm9sZGVyLmxlbmd0aCk9PWZvbGRlcikge1xuXHRcdFx0aWYgKCFzdGFydCkgc3RhcnQ9b2Zmc2V0c1tpXTtcblx0XHRcdGVuZD1vZmZzZXRzW2ldO1xuXHRcdH0gZWxzZSBpZiAoc3RhcnQpIGJyZWFrO1xuXHR9XG5cdHJldHVybiB7c3RhcnQ6c3RhcnQsZW5kOmVuZH07XG59XG5cbiAvL1RPRE8gZGVsZXRlIGRpcmVjdGx5IGZyb20ga2RiIGluc3RhbmNlXG4gLy9rZGIuZnJlZSgpO1xudmFyIGNsb3NlTG9jYWw9ZnVuY3Rpb24oa2RiaWQpIHtcblx0dmFyIGVuZ2luZT1sb2NhbFBvb2xba2RiaWRdO1xuXHRpZiAoZW5naW5lKSB7XG5cdFx0ZW5naW5lLmtkYi5mcmVlKCk7XG5cdFx0ZGVsZXRlIGxvY2FsUG9vbFtrZGJpZF07XG5cdH1cbn1cbnZhciBjbG9zZT1mdW5jdGlvbihrZGJpZCkge1xuXHR2YXIgZW5naW5lPXBvb2xba2RiaWRdO1xuXHRpZiAoZW5naW5lKSB7XG5cdFx0ZW5naW5lLmtkYi5mcmVlKCk7XG5cdFx0ZGVsZXRlIHBvb2xba2RiaWRdO1xuXHR9XG59XG5cbnZhciBnZXRMb2NhbFRyaWVzPWZ1bmN0aW9uKGtkYmZuKSB7XG5cdGlmICgha2RibGlzdGVkKSB7XG5cdFx0a2Ricz1yZXF1aXJlKFwiLi9saXN0a2RiXCIpKCk7XG5cdFx0a2RibGlzdGVkPXRydWU7XG5cdH1cblxuXHR2YXIga2RiaWQ9a2RiZm4ucmVwbGFjZSgnLmtkYicsJycpO1xuXHR2YXIgdHJpZXM9IFtcIi4vXCIra2RiaWQrXCIua2RiXCJcblx0ICAgICAgICAgICAsXCIuLi9cIitrZGJpZCtcIi5rZGJcIlxuXHRdO1xuXG5cdGZvciAodmFyIGk9MDtpPGtkYnMubGVuZ3RoO2krKykge1xuXHRcdGlmIChrZGJzW2ldWzBdPT1rZGJpZCkge1xuXHRcdFx0dHJpZXMucHVzaChrZGJzW2ldWzFdKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRyaWVzO1xufVxudmFyIG9wZW5Mb2NhbEtzYW5hZ2FwPWZ1bmN0aW9uKGtkYmlkLG9wdHMsY2IsY29udGV4dCkge1xuXHR2YXIga2RiZm49a2RiaWQ7XG5cdHZhciB0cmllcz1nZXRMb2NhbFRyaWVzKGtkYmZuKTtcblxuXHRmb3IgKHZhciBpPTA7aTx0cmllcy5sZW5ndGg7aSsrKSB7XG5cdFx0aWYgKGZzLmV4aXN0c1N5bmModHJpZXNbaV0pKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwia2RiIHBhdGg6IFwiK25vZGVSZXF1aXJlKCdwYXRoJykucmVzb2x2ZSh0cmllc1tpXSkpO1xuXHRcdFx0dmFyIGtkYj1uZXcgS2RiLm9wZW4odHJpZXNbaV0sZnVuY3Rpb24oZXJyLGtkYil7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRjYi5hcHBseShjb250ZXh0LFtlcnJdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjcmVhdGVMb2NhbEVuZ2luZShrZGIsb3B0cyxmdW5jdGlvbihlbmdpbmUpe1xuXHRcdFx0XHRcdFx0bG9jYWxQb29sW2tkYmlkXT1lbmdpbmU7XG5cdFx0XHRcdFx0XHRjYi5hcHBseShjb250ZXh0fHxlbmdpbmUuY29udGV4dCxbMCxlbmdpbmVdKTtcblx0XHRcdFx0XHR9LGNvbnRleHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2tkYmlkK1wiIG5vdCBmb3VuZFwiXSk7XG5cdHJldHVybiBudWxsO1xuXG59XG52YXIgb3BlbkxvY2FsTm9kZT1mdW5jdGlvbihrZGJpZCxvcHRzLGNiLGNvbnRleHQpIHtcblx0dmFyIGZzPXJlcXVpcmUoJ2ZzJyk7XG5cdHZhciB0cmllcz1nZXRMb2NhbFRyaWVzKGtkYmlkKTtcblxuXHRmb3IgKHZhciBpPTA7aTx0cmllcy5sZW5ndGg7aSsrKSB7XG5cdFx0aWYgKGZzLmV4aXN0c1N5bmModHJpZXNbaV0pKSB7XG5cblx0XHRcdG5ldyBLZGIub3Blbih0cmllc1tpXSxmdW5jdGlvbihlcnIsa2RiKXtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNiLmFwcGx5KGNvbnRleHR8fGVuZ2luZS5jb250ZW50LFtlcnJdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjcmVhdGVMb2NhbEVuZ2luZShrZGIsb3B0cyxmdW5jdGlvbihlbmdpbmUpe1xuXHRcdFx0XHRcdFx0XHRsb2NhbFBvb2xba2RiaWRdPWVuZ2luZTtcblx0XHRcdFx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dHx8ZW5naW5lLmNvbnRleHQsWzAsZW5naW5lXSk7XG5cdFx0XHRcdFx0fSxjb250ZXh0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cblx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtrZGJpZCtcIiBub3QgZm91bmRcIl0pO1xuXHRyZXR1cm4gbnVsbDtcbn1cblxudmFyIG9wZW5Mb2NhbEh0bWw1PWZ1bmN0aW9uKGtkYmlkLG9wdHMsY2IsY29udGV4dCkge1x0XG5cdHZhciBlbmdpbmU9bG9jYWxQb29sW2tkYmlkXTtcblx0dmFyIGtkYmZuPWtkYmlkO1xuXHRpZiAoa2RiZm4uaW5kZXhPZihcIi5rZGJcIik9PS0xKSBrZGJmbis9XCIua2RiXCI7XG5cdG5ldyBLZGIub3BlbihrZGJmbixmdW5jdGlvbihlcnIsaGFuZGxlKXtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRjYi5hcHBseShjb250ZXh0LFtlcnJdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y3JlYXRlTG9jYWxFbmdpbmUoaGFuZGxlLG9wdHMsZnVuY3Rpb24oZW5naW5lKXtcblx0XHRcdFx0bG9jYWxQb29sW2tkYmlkXT1lbmdpbmU7XG5cdFx0XHRcdGNiLmFwcGx5KGNvbnRleHR8fGVuZ2luZS5jb250ZXh0LFswLGVuZ2luZV0pO1xuXHRcdFx0fSxjb250ZXh0KTtcblx0XHR9XG5cdH0pO1xufVxuLy9vbWl0IGNiIGZvciBzeW5jcm9uaXplIG9wZW5cbnZhciBvcGVuTG9jYWw9ZnVuY3Rpb24oa2RiaWQsb3B0cyxjYixjb250ZXh0KSAge1xuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikgeyAvL25vIG9wdHNcblx0XHRpZiAodHlwZW9mIGNiPT1cIm9iamVjdFwiKSBjb250ZXh0PWNiO1xuXHRcdGNiPW9wdHM7XG5cdFx0b3B0cz17fTtcblx0fVxuXG5cdHZhciBlbmdpbmU9bG9jYWxQb29sW2tkYmlkXTtcblx0aWYgKGVuZ2luZSkge1xuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dHx8ZW5naW5lLmNvbnRleHQsWzAsZW5naW5lXSk7XG5cdFx0cmV0dXJuIGVuZ2luZTtcblx0fVxuXG5cdHZhciBwbGF0Zm9ybT1yZXF1aXJlKFwiLi9wbGF0Zm9ybVwiKS5nZXRQbGF0Zm9ybSgpO1xuXHRpZiAocGxhdGZvcm09PVwibm9kZS13ZWJraXRcIiB8fCBwbGF0Zm9ybT09XCJub2RlXCIpIHtcblx0XHRvcGVuTG9jYWxOb2RlKGtkYmlkLG9wdHMsY2IsY29udGV4dCk7XG5cdH0gZWxzZSBpZiAocGxhdGZvcm09PVwiaHRtbDVcIiB8fCBwbGF0Zm9ybT09XCJjaHJvbWVcIil7XG5cdFx0b3BlbkxvY2FsSHRtbDUoa2RiaWQsb3B0cyxjYixjb250ZXh0KTtcdFx0XG5cdH0gZWxzZSB7XG5cdFx0b3BlbkxvY2FsS3NhbmFnYXAoa2RiaWQsb3B0cyxjYixjb250ZXh0KTtcdFxuXHR9XG59XG52YXIgc2V0UGF0aD1mdW5jdGlvbihwYXRoKSB7XG5cdGFwcHBhdGg9cGF0aDtcblx0Y29uc29sZS5sb2coXCJzZXQgcGF0aFwiLHBhdGgpXG59XG5cbnZhciBlbnVtS2RiPWZ1bmN0aW9uKGNiLGNvbnRleHQpe1xuXHRyZXR1cm4ga2Ricy5tYXAoZnVuY3Rpb24oayl7cmV0dXJuIGtbMF19KTtcbn1cblxubW9kdWxlLmV4cG9ydHM9e29wZW46b3BlbkxvY2FsLHNldFBhdGg6c2V0UGF0aCwgY2xvc2U6Y2xvc2VMb2NhbCwgZW51bUtkYjplbnVtS2RifTsiLCIvKiByZXR1cm4gYXJyYXkgb2YgZGJpZCBhbmQgYWJzb2x1dGUgcGF0aCovXG52YXIgbGlzdGtkYl9odG1sNT1mdW5jdGlvbigpIHtcblx0dGhyb3cgXCJub3QgaW1wbGVtZW50IHlldFwiO1xuXHRyZXF1aXJlKFwia3NhbmEtanNvbnJvbVwiKS5odG1sNWZzLnJlYWRkaXIoZnVuY3Rpb24oa2Ricyl7XG5cdFx0XHRjYi5hcHBseSh0aGlzLFtrZGJzXSk7XG5cdH0sY29udGV4dHx8dGhpcyk7XHRcdFxuXG59XG5cbnZhciBsaXN0a2RiX25vZGU9ZnVuY3Rpb24oKXtcblx0dmFyIGZzPXJlcXVpcmUoXCJmc1wiKTtcblx0dmFyIHBhdGg9cmVxdWlyZShcInBhdGhcIilcblx0dmFyIHBhcmVudD1wYXRoLnJlc29sdmUocHJvY2Vzcy5jd2QoKSxcIi4uXCIpO1xuXHR2YXIgZmlsZXM9ZnMucmVhZGRpclN5bmMocGFyZW50KTtcblx0dmFyIG91dHB1dD1bXTtcblx0ZmlsZXMubWFwKGZ1bmN0aW9uKGYpe1xuXHRcdHZhciBzdWJkaXI9cGFyZW50K3BhdGguc2VwK2Y7XG5cdFx0dmFyIHN0YXQ9ZnMuc3RhdFN5bmMoc3ViZGlyICk7XG5cdFx0aWYgKHN0YXQuaXNEaXJlY3RvcnkoKSkge1xuXHRcdFx0dmFyIHN1YmZpbGVzPWZzLnJlYWRkaXJTeW5jKHN1YmRpcik7XG5cdFx0XHRmb3IgKHZhciBpPTA7aTxzdWJmaWxlcy5sZW5ndGg7aSsrKSB7XG5cdFx0XHRcdHZhciBmaWxlPXN1YmZpbGVzW2ldO1xuXHRcdFx0XHR2YXIgaWR4PWZpbGUuaW5kZXhPZihcIi5rZGJcIik7XG5cdFx0XHRcdGlmIChpZHg+LTEmJmlkeD09ZmlsZS5sZW5ndGgtNCkge1xuXHRcdFx0XHRcdG91dHB1dC5wdXNoKFsgZmlsZS5zdWJzdHIoMCxmaWxlLmxlbmd0aC00KSwgc3ViZGlyK3BhdGguc2VwK2ZpbGVdKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0fSlcblx0cmV0dXJuIG91dHB1dDtcbn1cblxudmFyIGxpc3RrZGI9ZnVuY3Rpb24oKSB7XG5cdHZhciBwbGF0Zm9ybT1yZXF1aXJlKFwiLi9wbGF0Zm9ybVwiKS5nZXRQbGF0Zm9ybSgpO1xuXHR2YXIgZmlsZXM9W107XG5cdGlmIChwbGF0Zm9ybT09XCJub2RlXCIgfHwgcGxhdGZvcm09PVwibm9kZS13ZWJraXRcIikge1xuXHRcdGZpbGVzPWxpc3RrZGJfbm9kZSgpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IFwibm90IGltcGxlbWVudCB5ZXRcIjtcblx0fVxuXHRyZXR1cm4gZmlsZXM7XG59XG5tb2R1bGUuZXhwb3J0cz1saXN0a2RiOyIsInZhciBnZXRQbGF0Zm9ybT1mdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBrc2FuYWdhcD09XCJ1bmRlZmluZWRcIikge1xuXHRcdHBsYXRmb3JtPVwibm9kZVwiO1xuXHR9IGVsc2Uge1xuXHRcdHBsYXRmb3JtPWtzYW5hZ2FwLnBsYXRmb3JtO1xuXHR9XG5cdHJldHVybiBwbGF0Zm9ybTtcbn1cbm1vZHVsZS5leHBvcnRzPXtnZXRQbGF0Zm9ybTpnZXRQbGF0Zm9ybX07IiwiXG4vKiBlbXVsYXRlIGZpbGVzeXN0ZW0gb24gaHRtbDUgYnJvd3NlciAqL1xuLyogZW11bGF0ZSBmaWxlc3lzdGVtIG9uIGh0bWw1IGJyb3dzZXIgKi9cbnZhciByZWFkPWZ1bmN0aW9uKGhhbmRsZSxidWZmZXIsb2Zmc2V0LGxlbmd0aCxwb3NpdGlvbixjYikgey8vYnVmZmVyIGFuZCBvZmZzZXQgaXMgbm90IHVzZWRcblx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHR4aHIub3BlbignR0VUJywgaGFuZGxlLnVybCAsIHRydWUpO1xuXHR2YXIgcmFuZ2U9W3Bvc2l0aW9uLGxlbmd0aCtwb3NpdGlvbi0xXTtcblx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ1JhbmdlJywgJ2J5dGVzPScrcmFuZ2VbMF0rJy0nK3JhbmdlWzFdKTtcblx0eGhyLnJlc3BvbnNlVHlwZSA9ICdhcnJheWJ1ZmZlcic7XG5cdHhoci5zZW5kKCk7XG5cdHhoci5vbmxvYWQgPSBmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRjYigwLHRoYXQucmVzcG9uc2UuYnl0ZUxlbmd0aCx0aGF0LnJlc3BvbnNlKTtcblx0XHR9LDApO1xuXHR9OyBcbn1cbnZhciBjbG9zZT1mdW5jdGlvbihoYW5kbGUpIHt9XG52YXIgZnN0YXRTeW5jPWZ1bmN0aW9uKGhhbmRsZSkge1xuXHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCI7XG59XG52YXIgZnN0YXQ9ZnVuY3Rpb24oaGFuZGxlLGNiKSB7XG5cdHRocm93IFwibm90IGltcGxlbWVudCB5ZXRcIjtcbn1cbnZhciBfb3Blbj1mdW5jdGlvbihmbl91cmwsY2IpIHtcblx0XHR2YXIgaGFuZGxlPXt9O1xuXHRcdGlmIChmbl91cmwuaW5kZXhPZihcImZpbGVzeXN0ZW06XCIpPT0wKXtcblx0XHRcdGhhbmRsZS51cmw9Zm5fdXJsO1xuXHRcdFx0aGFuZGxlLmZuPWZuX3VybC5zdWJzdHIoIGZuX3VybC5sYXN0SW5kZXhPZihcIi9cIikrMSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGhhbmRsZS5mbj1mbl91cmw7XG5cdFx0XHR2YXIgdXJsPUFQSS5maWxlcy5maWx0ZXIoZnVuY3Rpb24oZil7IHJldHVybiAoZlswXT09Zm5fdXJsKX0pO1xuXHRcdFx0aWYgKHVybC5sZW5ndGgpIGhhbmRsZS51cmw9dXJsWzBdWzFdO1xuXHRcdFx0ZWxzZSBjYihudWxsKTtcblx0XHR9XG5cdFx0Y2IoaGFuZGxlKTtcbn1cbnZhciBvcGVuPWZ1bmN0aW9uKGZuX3VybCxjYikge1xuXHRcdGlmICghQVBJLmluaXRpYWxpemVkKSB7aW5pdCgxMDI0KjEwMjQsZnVuY3Rpb24oKXtcblx0XHRcdF9vcGVuLmFwcGx5KHRoaXMsW2ZuX3VybCxjYl0pO1xuXHRcdH0sdGhpcyl9IGVsc2UgX29wZW4uYXBwbHkodGhpcyxbZm5fdXJsLGNiXSk7XG59XG52YXIgbG9hZD1mdW5jdGlvbihmaWxlbmFtZSxtb2RlLGNiKSB7XG5cdG9wZW4oZmlsZW5hbWUsbW9kZSxjYix0cnVlKTtcbn1cbmZ1bmN0aW9uIGVycm9ySGFuZGxlcihlKSB7XG5cdGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnICtlLm5hbWUrIFwiIFwiK2UubWVzc2FnZSk7XG59XG52YXIgcmVhZGRpcj1mdW5jdGlvbihjYixjb250ZXh0KSB7XG5cdCB2YXIgZGlyUmVhZGVyID0gQVBJLmZzLnJvb3QuY3JlYXRlUmVhZGVyKCk7XG5cdCB2YXIgb3V0PVtdLHRoYXQ9dGhpcztcblx0XHRkaXJSZWFkZXIucmVhZEVudHJpZXMoZnVuY3Rpb24oZW50cmllcykge1xuXHRcdFx0aWYgKGVudHJpZXMubGVuZ3RoKSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwLCBlbnRyeTsgZW50cnkgPSBlbnRyaWVzW2ldOyArK2kpIHtcblx0XHRcdFx0XHRpZiAoZW50cnkuaXNGaWxlKSB7XG5cdFx0XHRcdFx0XHRvdXQucHVzaChbZW50cnkubmFtZSxlbnRyeS50b1VSTCA/IGVudHJ5LnRvVVJMKCkgOiBlbnRyeS50b1VSSSgpXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRBUEkuZmlsZXM9b3V0O1xuXHRcdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtvdXRdKTtcblx0XHR9LCBmdW5jdGlvbigpe1xuXHRcdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtudWxsXSk7XG5cdFx0fSk7XG59XG52YXIgaW5pdGZzPWZ1bmN0aW9uKGdyYW50ZWRCeXRlcyxjYixjb250ZXh0KSB7XG5cdHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtKFBFUlNJU1RFTlQsIGdyYW50ZWRCeXRlcywgIGZ1bmN0aW9uKGZzKSB7XG5cdFx0QVBJLmZzPWZzO1xuXHRcdEFQSS5xdW90YT1ncmFudGVkQnl0ZXM7XG5cdFx0cmVhZGRpcihmdW5jdGlvbigpe1xuXHRcdFx0QVBJLmluaXRpYWxpemVkPXRydWU7XG5cdFx0XHRjYi5hcHBseShjb250ZXh0LFtncmFudGVkQnl0ZXMsZnNdKTtcblx0XHR9LGNvbnRleHQpO1xuXHR9LCBlcnJvckhhbmRsZXIpO1xufVxudmFyIGluaXQ9ZnVuY3Rpb24ocXVvdGEsY2IsY29udGV4dCkge1xuXHRuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UucmVxdWVzdFF1b3RhKHF1b3RhLCBcblx0XHRcdGZ1bmN0aW9uKGdyYW50ZWRCeXRlcykge1xuXHRcdFx0XHRpbml0ZnMoZ3JhbnRlZEJ5dGVzLGNiLGNvbnRleHQpO1xuXHRcdH0sIGVycm9ySGFuZGxlciBcblx0KTtcbn1cbnZhciBBUEk9e1xuXHRyZWFkOnJlYWRcblx0LHJlYWRkaXI6cmVhZGRpclxuXHQsb3BlbjpvcGVuXG5cdCxjbG9zZTpjbG9zZVxuXHQsZnN0YXRTeW5jOmZzdGF0U3luY1xuXHQsZnN0YXQ6ZnN0YXRcbn1cbm1vZHVsZS5leHBvcnRzPUFQSTsiLCJtb2R1bGUuZXhwb3J0cz17XG5cdG9wZW46cmVxdWlyZShcIi4va2RiXCIpXG5cdCxjcmVhdGU6cmVxdWlyZShcIi4va2Rid1wiKVxufVxuIiwiLypcblx0S0RCIHZlcnNpb24gMy4wIEdQTFxuXHR5YXBjaGVhaHNoZW5AZ21haWwuY29tXG5cdDIwMTMvMTIvMjhcblx0YXN5bmNyb25pemUgdmVyc2lvbiBvZiB5YWRiXG5cbiAgcmVtb3ZlIGRlcGVuZGVuY3kgb2YgUSwgdGhhbmtzIHRvXG4gIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvNDIzNDYxOS9ob3ctdG8tYXZvaWQtbG9uZy1uZXN0aW5nLW9mLWFzeW5jaHJvbm91cy1mdW5jdGlvbnMtaW4tbm9kZS1qc1xuXG4gIDIwMTUvMS8yXG4gIG1vdmVkIHRvIGtzYW5hZm9yZ2Uva3NhbmEtanNvbnJvbVxuICBhZGQgZXJyIGluIGNhbGxiYWNrIGZvciBub2RlLmpzIGNvbXBsaWFudFxuKi9cbnZhciBLZnM9bnVsbDtcblxuaWYgKHR5cGVvZiBrc2FuYWdhcD09XCJ1bmRlZmluZWRcIikge1xuXHRLZnM9cmVxdWlyZSgnLi9rZGJmcycpO1x0XHRcdFxufSBlbHNlIHtcblx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cImlvc1wiKSB7XG5cdFx0S2ZzPXJlcXVpcmUoXCIuL2tkYmZzX2lvc1wiKTtcblx0fSBlbHNlIGlmIChrc2FuYWdhcC5wbGF0Zm9ybT09XCJub2RlLXdlYmtpdFwiKSB7XG5cdFx0S2ZzPXJlcXVpcmUoXCIuL2tkYmZzXCIpO1xuXHR9IGVsc2UgaWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cImNocm9tZVwiKSB7XG5cdFx0S2ZzPXJlcXVpcmUoXCIuL2tkYmZzXCIpO1xuXHR9IGVsc2Uge1xuXHRcdEtmcz1yZXF1aXJlKFwiLi9rZGJmc19hbmRyb2lkXCIpO1xuXHR9XG5cdFx0XG59XG5cblxudmFyIERUPXtcblx0dWludDg6JzEnLCAvL3Vuc2lnbmVkIDEgYnl0ZSBpbnRlZ2VyXG5cdGludDMyOic0JywgLy8gc2lnbmVkIDQgYnl0ZXMgaW50ZWdlclxuXHR1dGY4Oic4JywgIFxuXHR1Y3MyOicyJyxcblx0Ym9vbDonXicsIFxuXHRibG9iOicmJyxcblx0dXRmOGFycjonKicsIC8vc2hpZnQgb2YgOFxuXHR1Y3MyYXJyOidAJywgLy9zaGlmdCBvZiAyXG5cdHVpbnQ4YXJyOichJywgLy9zaGlmdCBvZiAxXG5cdGludDMyYXJyOickJywgLy9zaGlmdCBvZiA0XG5cdHZpbnQ6J2AnLFxuXHRwaW50Oid+JyxcdFxuXG5cdGFycmF5OidcXHUwMDFiJyxcblx0b2JqZWN0OidcXHUwMDFhJyBcblx0Ly95ZGIgc3RhcnQgd2l0aCBvYmplY3Qgc2lnbmF0dXJlLFxuXHQvL3R5cGUgYSB5ZGIgaW4gY29tbWFuZCBwcm9tcHQgc2hvd3Mgbm90aGluZ1xufVxudmFyIHZlcmJvc2U9MCwgcmVhZExvZz1mdW5jdGlvbigpe307XG52YXIgX3JlYWRMb2c9ZnVuY3Rpb24ocmVhZHR5cGUsYnl0ZXMpIHtcblx0Y29uc29sZS5sb2cocmVhZHR5cGUsYnl0ZXMsXCJieXRlc1wiKTtcbn1cbmlmICh2ZXJib3NlKSByZWFkTG9nPV9yZWFkTG9nO1xudmFyIHN0cnNlcD1cIlxcdWZmZmZcIjtcbnZhciBDcmVhdGU9ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XG5cdC8qIGxvYWR4eHggZnVuY3Rpb25zIG1vdmUgZmlsZSBwb2ludGVyICovXG5cdC8vIGxvYWQgdmFyaWFibGUgbGVuZ3RoIGludFxuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikge1xuXHRcdGNiPW9wdHM7XG5cdFx0b3B0cz17fTtcblx0fVxuXG5cdFxuXHR2YXIgbG9hZFZJbnQgPWZ1bmN0aW9uKG9wdHMsYmxvY2tzaXplLGNvdW50LGNiKSB7XG5cdFx0Ly9pZiAoY291bnQ9PTApIHJldHVybiBbXTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXG5cdFx0dGhpcy5mcy5yZWFkQnVmX3BhY2tlZGludChvcHRzLmN1cixibG9ja3NpemUsY291bnQsdHJ1ZSxmdW5jdGlvbihvKXtcblx0XHRcdC8vY29uc29sZS5sb2coXCJ2aW50XCIpO1xuXHRcdFx0b3B0cy5jdXIrPW8uYWR2O1xuXHRcdFx0Y2IuYXBwbHkodGhhdCxbby5kYXRhXSk7XG5cdFx0fSk7XG5cdH1cblx0dmFyIGxvYWRWSW50MT1mdW5jdGlvbihvcHRzLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRsb2FkVkludC5hcHBseSh0aGlzLFtvcHRzLDYsMSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdC8vY29uc29sZS5sb2coXCJ2aW50MVwiKTtcblx0XHRcdGNiLmFwcGx5KHRoYXQsW2RhdGFbMF1dKTtcblx0XHR9XSlcblx0fVxuXHQvL2ZvciBwb3N0aW5nc1xuXHR2YXIgbG9hZFBJbnQgPWZ1bmN0aW9uKG9wdHMsYmxvY2tzaXplLGNvdW50LGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR0aGlzLmZzLnJlYWRCdWZfcGFja2VkaW50KG9wdHMuY3VyLGJsb2Nrc2l6ZSxjb3VudCxmYWxzZSxmdW5jdGlvbihvKXtcblx0XHRcdC8vY29uc29sZS5sb2coXCJwaW50XCIpO1xuXHRcdFx0b3B0cy5jdXIrPW8uYWR2O1xuXHRcdFx0Y2IuYXBwbHkodGhhdCxbby5kYXRhXSk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gaXRlbSBjYW4gYmUgYW55IHR5cGUgKHZhcmlhYmxlIGxlbmd0aClcblx0Ly8gbWF4aW11bSBzaXplIG9mIGFycmF5IGlzIDFUQiAyXjQwXG5cdC8vIHN0cnVjdHVyZTpcblx0Ly8gc2lnbmF0dXJlLDUgYnl0ZXMgb2Zmc2V0LCBwYXlsb2FkLCBpdGVtbGVuZ3Roc1xuXHR2YXIgZ2V0QXJyYXlMZW5ndGg9ZnVuY3Rpb24ob3B0cyxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dmFyIGRhdGFvZmZzZXQ9MDtcblxuXHRcdHRoaXMuZnMucmVhZFVJOChvcHRzLmN1cixmdW5jdGlvbihsZW4pe1xuXHRcdFx0dmFyIGxlbmd0aG9mZnNldD1sZW4qNDI5NDk2NzI5Njtcblx0XHRcdG9wdHMuY3VyKys7XG5cdFx0XHR0aGF0LmZzLnJlYWRVSTMyKG9wdHMuY3VyLGZ1bmN0aW9uKGxlbil7XG5cdFx0XHRcdG9wdHMuY3VyKz00O1xuXHRcdFx0XHRkYXRhb2Zmc2V0PW9wdHMuY3VyOyAvL2tlZXAgdGhpc1xuXHRcdFx0XHRsZW5ndGhvZmZzZXQrPWxlbjtcblx0XHRcdFx0b3B0cy5jdXIrPWxlbmd0aG9mZnNldDtcblxuXHRcdFx0XHRsb2FkVkludDEuYXBwbHkodGhhdCxbb3B0cyxmdW5jdGlvbihjb3VudCl7XG5cdFx0XHRcdFx0bG9hZFZJbnQuYXBwbHkodGhhdCxbb3B0cyxjb3VudCo2LGNvdW50LGZ1bmN0aW9uKHN6KXtcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdGNiKHtjb3VudDpjb3VudCxzejpzeixvZmZzZXQ6ZGF0YW9mZnNldH0pO1xuXHRcdFx0XHRcdH1dKTtcblx0XHRcdFx0fV0pO1xuXHRcdFx0XHRcblx0XHRcdH0pO1xuXHRcdH0pO1xuXHR9XG5cblx0dmFyIGxvYWRBcnJheSA9IGZ1bmN0aW9uKG9wdHMsYmxvY2tzaXplLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRnZXRBcnJheUxlbmd0aC5hcHBseSh0aGlzLFtvcHRzLGZ1bmN0aW9uKEwpe1xuXHRcdFx0XHR2YXIgbz1bXTtcblx0XHRcdFx0dmFyIGVuZGN1cj1vcHRzLmN1cjtcblx0XHRcdFx0b3B0cy5jdXI9TC5vZmZzZXQ7XG5cblx0XHRcdFx0aWYgKG9wdHMubGF6eSkgeyBcblx0XHRcdFx0XHRcdHZhciBvZmZzZXQ9TC5vZmZzZXQ7XG5cdFx0XHRcdFx0XHRMLnN6Lm1hcChmdW5jdGlvbihzeil7XG5cdFx0XHRcdFx0XHRcdG9bby5sZW5ndGhdPXN0cnNlcCtvZmZzZXQudG9TdHJpbmcoMTYpXG5cdFx0XHRcdFx0XHRcdFx0ICAgK3N0cnNlcCtzei50b1N0cmluZygxNik7XG5cdFx0XHRcdFx0XHRcdG9mZnNldCs9c3o7XG5cdFx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciB0YXNrcXVldWU9W107XG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8TC5jb3VudDtpKyspIHtcblx0XHRcdFx0XHRcdHRhc2txdWV1ZS5wdXNoKFxuXHRcdFx0XHRcdFx0XHQoZnVuY3Rpb24oc3ope1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQgLy9ub3QgcHVzaGluZyB0aGUgZmlyc3QgY2FsbFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XHRlbHNlIG8ucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0cy5ibG9ja3NpemU9c3o7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvYWQuYXBwbHkodGhhdCxbb3B0cywgdGFza3F1ZXVlLnNoaWZ0KCldKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHR9KShMLnN6W2ldKVxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9sYXN0IGNhbGwgdG8gY2hpbGQgbG9hZFxuXHRcdFx0XHRcdHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0by5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0b3B0cy5jdXI9ZW5kY3VyO1xuXHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKG9wdHMubGF6eSkgY2IuYXBwbHkodGhhdCxbb10pO1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRdKVxuXHR9XHRcdFxuXHQvLyBpdGVtIGNhbiBiZSBhbnkgdHlwZSAodmFyaWFibGUgbGVuZ3RoKVxuXHQvLyBzdXBwb3J0IGxhenkgbG9hZFxuXHQvLyBzdHJ1Y3R1cmU6XG5cdC8vIHNpZ25hdHVyZSw1IGJ5dGVzIG9mZnNldCwgcGF5bG9hZCwgaXRlbWxlbmd0aHMsIFxuXHQvLyAgICAgICAgICAgICAgICAgICAgc3RyaW5nYXJyYXlfc2lnbmF0dXJlLCBrZXlzXG5cdHZhciBsb2FkT2JqZWN0ID0gZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHZhciBzdGFydD1vcHRzLmN1cjtcblx0XHRnZXRBcnJheUxlbmd0aC5hcHBseSh0aGlzLFtvcHRzLGZ1bmN0aW9uKEwpIHtcblx0XHRcdG9wdHMuYmxvY2tzaXplPWJsb2Nrc2l6ZS1vcHRzLmN1citzdGFydDtcblx0XHRcdGxvYWQuYXBwbHkodGhhdCxbb3B0cyxmdW5jdGlvbihrZXlzKXsgLy9sb2FkIHRoZSBrZXlzXG5cdFx0XHRcdGlmIChvcHRzLmtleXMpIHsgLy9jYWxsZXIgYXNrIGZvciBrZXlzXG5cdFx0XHRcdFx0a2V5cy5tYXAoZnVuY3Rpb24oaykgeyBvcHRzLmtleXMucHVzaChrKX0pO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0dmFyIG89e307XG5cdFx0XHRcdHZhciBlbmRjdXI9b3B0cy5jdXI7XG5cdFx0XHRcdG9wdHMuY3VyPUwub2Zmc2V0O1xuXHRcdFx0XHRpZiAob3B0cy5sYXp5KSB7IFxuXHRcdFx0XHRcdHZhciBvZmZzZXQ9TC5vZmZzZXQ7XG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8TC5zei5sZW5ndGg7aSsrKSB7XG5cdFx0XHRcdFx0XHQvL3ByZWZpeCB3aXRoIGEgXFwwLCBpbXBvc3NpYmxlIGZvciBub3JtYWwgc3RyaW5nXG5cdFx0XHRcdFx0XHRvW2tleXNbaV1dPXN0cnNlcCtvZmZzZXQudG9TdHJpbmcoMTYpXG5cdFx0XHRcdFx0XHRcdCAgICtzdHJzZXArTC5zeltpXS50b1N0cmluZygxNik7XG5cdFx0XHRcdFx0XHRvZmZzZXQrPUwuc3pbaV07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHZhciB0YXNrcXVldWU9W107XG5cdFx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8TC5jb3VudDtpKyspIHtcblx0XHRcdFx0XHRcdHRhc2txdWV1ZS5wdXNoKFxuXHRcdFx0XHRcdFx0XHQoZnVuY3Rpb24oc3osa2V5KXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9ub3Qgc2F2aW5nIHRoZSBmaXJzdCBjYWxsO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdG9ba2V5XT1kYXRhOyBcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRzLmJsb2Nrc2l6ZT1zejtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHZlcmJvc2UpIHJlYWRMb2coXCJrZXlcIixrZXkpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb2FkLmFwcGx5KHRoYXQsW29wdHMsIHRhc2txdWV1ZS5zaGlmdCgpXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fSkoTC5zeltpXSxrZXlzW2ktMV0pXG5cblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vbGFzdCBjYWxsIHRvIGNoaWxkIGxvYWRcblx0XHRcdFx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdG9ba2V5c1trZXlzLmxlbmd0aC0xXV09ZGF0YTtcblx0XHRcdFx0XHRcdG9wdHMuY3VyPWVuZGN1cjtcblx0XHRcdFx0XHRcdGNiLmFwcGx5KHRoYXQsW29dKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAob3B0cy5sYXp5KSBjYi5hcHBseSh0aGF0LFtvXSk7XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTtcblx0XHRcdFx0fVxuXHRcdFx0fV0pO1xuXHRcdH1dKTtcblx0fVxuXG5cdC8vaXRlbSBpcyBzYW1lIGtub3duIHR5cGVcblx0dmFyIGxvYWRTdHJpbmdBcnJheT1mdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dGhpcy5mcy5yZWFkU3RyaW5nQXJyYXkob3B0cy5jdXIsYmxvY2tzaXplLGVuY29kaW5nLGZ1bmN0aW9uKG8pe1xuXHRcdFx0b3B0cy5jdXIrPWJsb2Nrc2l6ZTtcblx0XHRcdGNiLmFwcGx5KHRoYXQsW29dKTtcblx0XHR9KTtcblx0fVxuXHR2YXIgbG9hZEludGVnZXJBcnJheT1mdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSx1bml0c2l6ZSxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0bG9hZFZJbnQxLmFwcGx5KHRoaXMsW29wdHMsZnVuY3Rpb24oY291bnQpe1xuXHRcdFx0dmFyIG89dGhhdC5mcy5yZWFkRml4ZWRBcnJheShvcHRzLmN1cixjb3VudCx1bml0c2l6ZSxmdW5jdGlvbihvKXtcblx0XHRcdFx0b3B0cy5jdXIrPWNvdW50KnVuaXRzaXplO1xuXHRcdFx0XHRjYi5hcHBseSh0aGF0LFtvXSk7XG5cdFx0XHR9KTtcblx0XHR9XSk7XG5cdH1cblx0dmFyIGxvYWRCbG9iPWZ1bmN0aW9uKGJsb2Nrc2l6ZSxjYikge1xuXHRcdHZhciBvPXRoaXMuZnMucmVhZEJ1Zih0aGlzLmN1cixibG9ja3NpemUpO1xuXHRcdHRoaXMuY3VyKz1ibG9ja3NpemU7XG5cdFx0cmV0dXJuIG87XG5cdH1cdFxuXHR2YXIgbG9hZGJ5c2lnbmF0dXJlPWZ1bmN0aW9uKG9wdHMsc2lnbmF0dXJlLGNiKSB7XG5cdFx0ICB2YXIgYmxvY2tzaXplPW9wdHMuYmxvY2tzaXplfHx0aGlzLmZzLnNpemU7IFxuXHRcdFx0b3B0cy5jdXIrPXRoaXMuZnMuc2lnbmF0dXJlX3NpemU7XG5cdFx0XHR2YXIgZGF0YXNpemU9YmxvY2tzaXplLXRoaXMuZnMuc2lnbmF0dXJlX3NpemU7XG5cdFx0XHQvL2Jhc2ljIHR5cGVzXG5cdFx0XHRpZiAoc2lnbmF0dXJlPT09RFQuaW50MzIpIHtcblx0XHRcdFx0b3B0cy5jdXIrPTQ7XG5cdFx0XHRcdHRoaXMuZnMucmVhZEkzMihvcHRzLmN1ci00LGNiKTtcblx0XHRcdH0gZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudWludDgpIHtcblx0XHRcdFx0b3B0cy5jdXIrKztcblx0XHRcdFx0dGhpcy5mcy5yZWFkVUk4KG9wdHMuY3VyLTEsY2IpO1xuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51dGY4KSB7XG5cdFx0XHRcdHZhciBjPW9wdHMuY3VyO29wdHMuY3VyKz1kYXRhc2l6ZTtcblx0XHRcdFx0dGhpcy5mcy5yZWFkU3RyaW5nKGMsZGF0YXNpemUsJ3V0ZjgnLGNiKTtcblx0XHRcdH0gZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudWNzMikge1xuXHRcdFx0XHR2YXIgYz1vcHRzLmN1cjtvcHRzLmN1cis9ZGF0YXNpemU7XG5cdFx0XHRcdHRoaXMuZnMucmVhZFN0cmluZyhjLGRhdGFzaXplLCd1Y3MyJyxjYik7XHRcblx0XHRcdH0gZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQuYm9vbCkge1xuXHRcdFx0XHRvcHRzLmN1cisrO1xuXHRcdFx0XHR0aGlzLmZzLnJlYWRVSTgob3B0cy5jdXItMSxmdW5jdGlvbihkYXRhKXtjYighIWRhdGEpfSk7XG5cdFx0XHR9IGVsc2UgaWYgKHNpZ25hdHVyZT09PURULmJsb2IpIHtcblx0XHRcdFx0bG9hZEJsb2IoZGF0YXNpemUsY2IpO1xuXHRcdFx0fVxuXHRcdFx0Ly92YXJpYWJsZSBsZW5ndGggaW50ZWdlcnNcblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnZpbnQpIHtcblx0XHRcdFx0bG9hZFZJbnQuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSxkYXRhc2l6ZSxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQucGludCkge1xuXHRcdFx0XHRsb2FkUEludC5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLGRhdGFzaXplLGNiXSk7XG5cdFx0XHR9XG5cdFx0XHQvL3NpbXBsZSBhcnJheVxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudXRmOGFycikge1xuXHRcdFx0XHRsb2FkU3RyaW5nQXJyYXkuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSwndXRmOCcsY2JdKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnVjczJhcnIpIHtcblx0XHRcdFx0bG9hZFN0cmluZ0FycmF5LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsJ3VjczInLGNiXSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51aW50OGFycikge1xuXHRcdFx0XHRsb2FkSW50ZWdlckFycmF5LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsMSxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQuaW50MzJhcnIpIHtcblx0XHRcdFx0bG9hZEludGVnZXJBcnJheS5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLDQsY2JdKTtcblx0XHRcdH1cblx0XHRcdC8vbmVzdGVkIHN0cnVjdHVyZVxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQuYXJyYXkpIHtcblx0XHRcdFx0bG9hZEFycmF5LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsY2JdKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULm9iamVjdCkge1xuXHRcdFx0XHRsb2FkT2JqZWN0LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsY2JdKTtcblx0XHRcdH1cblx0XHRcdGVsc2Uge1xuXHRcdFx0XHRjb25zb2xlLmVycm9yKCd1bnN1cHBvcnRlZCB0eXBlJyxzaWduYXR1cmUsb3B0cylcblx0XHRcdFx0Y2IuYXBwbHkodGhpcyxbbnVsbF0pOy8vbWFrZSBzdXJlIGl0IHJldHVyblxuXHRcdFx0XHQvL3Rocm93ICd1bnN1cHBvcnRlZCB0eXBlICcrc2lnbmF0dXJlO1xuXHRcdFx0fVxuXHR9XG5cblx0dmFyIGxvYWQ9ZnVuY3Rpb24ob3B0cyxjYikge1xuXHRcdG9wdHM9b3B0c3x8e307IC8vIHRoaXMgd2lsbCBzZXJ2ZWQgYXMgY29udGV4dCBmb3IgZW50aXJlIGxvYWQgcHJvY2VkdXJlXG5cdFx0b3B0cy5jdXI9b3B0cy5jdXJ8fDA7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR0aGlzLmZzLnJlYWRTaWduYXR1cmUob3B0cy5jdXIsIGZ1bmN0aW9uKHNpZ25hdHVyZSl7XG5cdFx0XHRsb2FkYnlzaWduYXR1cmUuYXBwbHkodGhhdCxbb3B0cyxzaWduYXR1cmUsY2JdKVxuXHRcdH0pO1xuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cdHZhciBDQUNIRT1udWxsO1xuXHR2YXIgS0VZPXt9O1xuXHR2YXIgQUREUkVTUz17fTtcblx0dmFyIHJlc2V0PWZ1bmN0aW9uKGNiKSB7XG5cdFx0aWYgKCFDQUNIRSkge1xuXHRcdFx0bG9hZC5hcHBseSh0aGlzLFt7Y3VyOjAsbGF6eTp0cnVlfSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0Q0FDSEU9ZGF0YTtcblx0XHRcdFx0Y2IuY2FsbCh0aGlzKTtcblx0XHRcdH1dKTtcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRjYi5jYWxsKHRoaXMpO1xuXHRcdH1cblx0fVxuXG5cdHZhciBleGlzdHM9ZnVuY3Rpb24ocGF0aCxjYikge1xuXHRcdGlmIChwYXRoLmxlbmd0aD09MCkgcmV0dXJuIHRydWU7XG5cdFx0dmFyIGtleT1wYXRoLnBvcCgpO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0Z2V0LmFwcGx5KHRoaXMsW3BhdGgsZmFsc2UsZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRpZiAoIXBhdGguam9pbihzdHJzZXApKSByZXR1cm4gKCEhS0VZW2tleV0pO1xuXHRcdFx0dmFyIGtleXM9S0VZW3BhdGguam9pbihzdHJzZXApXTtcblx0XHRcdHBhdGgucHVzaChrZXkpOy8vcHV0IGl0IGJhY2tcblx0XHRcdGlmIChrZXlzKSBjYi5hcHBseSh0aGF0LFtrZXlzLmluZGV4T2Yoa2V5KT4tMV0pO1xuXHRcdFx0ZWxzZSBjYi5hcHBseSh0aGF0LFtmYWxzZV0pO1xuXHRcdH1dKTtcblx0fVxuXG5cdHZhciBnZXRTeW5jPWZ1bmN0aW9uKHBhdGgpIHtcblx0XHRpZiAoIUNBQ0hFKSByZXR1cm4gdW5kZWZpbmVkO1x0XG5cdFx0dmFyIG89Q0FDSEU7XG5cdFx0Zm9yICh2YXIgaT0wO2k8cGF0aC5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgcj1vW3BhdGhbaV1dO1xuXHRcdFx0aWYgKHR5cGVvZiByPT1cInVuZGVmaW5lZFwiKSByZXR1cm4gbnVsbDtcblx0XHRcdG89cjtcblx0XHR9XG5cdFx0cmV0dXJuIG87XG5cdH1cblx0dmFyIGdldD1mdW5jdGlvbihwYXRoLG9wdHMsY2IpIHtcblx0XHRpZiAodHlwZW9mIHBhdGg9PSd1bmRlZmluZWQnKSBwYXRoPVtdO1xuXHRcdGlmICh0eXBlb2YgcGF0aD09XCJzdHJpbmdcIikgcGF0aD1bcGF0aF07XG5cdFx0Ly9vcHRzLnJlY3Vyc2l2ZT0hIW9wdHMucmVjdXJzaXZlO1xuXHRcdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XG5cdFx0XHRjYj1vcHRzO25vZGVcblx0XHRcdG9wdHM9e307XG5cdFx0fVxuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0aWYgKHR5cGVvZiBjYiE9J2Z1bmN0aW9uJykgcmV0dXJuIGdldFN5bmMocGF0aCk7XG5cblx0XHRyZXNldC5hcHBseSh0aGlzLFtmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG89Q0FDSEU7XG5cdFx0XHRpZiAocGF0aC5sZW5ndGg9PTApIHtcblx0XHRcdFx0aWYgKG9wdHMuYWRkcmVzcykge1xuXHRcdFx0XHRcdGNiKFswLHRoYXQuZnMuc2l6ZV0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNiKE9iamVjdC5rZXlzKENBQ0hFKSk7XHRcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9IFxuXHRcdFx0XG5cdFx0XHR2YXIgcGF0aG5vdz1cIlwiLHRhc2txdWV1ZT1bXSxuZXdvcHRzPXt9LHI9bnVsbDtcblx0XHRcdHZhciBsYXN0a2V5PVwiXCI7XG5cblx0XHRcdGZvciAodmFyIGk9MDtpPHBhdGgubGVuZ3RoO2krKykge1xuXHRcdFx0XHR2YXIgdGFzaz0oZnVuY3Rpb24oa2V5LGspe1xuXG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdGlmICghKHR5cGVvZiBkYXRhPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSB7XG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygb1tsYXN0a2V5XT09J3N0cmluZycgJiYgb1tsYXN0a2V5XVswXT09c3Ryc2VwKSBvW2xhc3RrZXldPXt9O1xuXHRcdFx0XHRcdFx0XHRvW2xhc3RrZXldPWRhdGE7IFxuXHRcdFx0XHRcdFx0XHRvPW9bbGFzdGtleV07XG5cdFx0XHRcdFx0XHRcdHI9ZGF0YVtrZXldO1xuXHRcdFx0XHRcdFx0XHRLRVlbcGF0aG5vd109b3B0cy5rZXlzO1x0XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdGRhdGE9b1trZXldO1xuXHRcdFx0XHRcdFx0XHRyPWRhdGE7XG5cdFx0XHRcdFx0XHR9XG5cblx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygcj09PVwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0XHRcdFx0dGFza3F1ZXVlPW51bGw7XG5cdFx0XHRcdFx0XHRcdGNiLmFwcGx5KHRoYXQsW3JdKTsgLy9yZXR1cm4gZW1wdHkgdmFsdWVcblx0XHRcdFx0XHRcdH0gZWxzZSB7XHRcdFx0XHRcdFx0XHRcblx0XHRcdFx0XHRcdFx0aWYgKHBhcnNlSW50KGspKSBwYXRobm93Kz1zdHJzZXA7XG5cdFx0XHRcdFx0XHRcdHBhdGhub3crPWtleTtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByPT0nc3RyaW5nJyAmJiByWzBdPT1zdHJzZXApIHsgLy9vZmZzZXQgb2YgZGF0YSB0byBiZSBsb2FkZWRcblx0XHRcdFx0XHRcdFx0XHR2YXIgcD1yLnN1YnN0cmluZygxKS5zcGxpdChzdHJzZXApLm1hcChmdW5jdGlvbihpdGVtKXtyZXR1cm4gcGFyc2VJbnQoaXRlbSwxNil9KTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgY3VyPXBbMF0sc3o9cFsxXTtcblx0XHRcdFx0XHRcdFx0XHRuZXdvcHRzLmxhenk9IW9wdHMucmVjdXJzaXZlIHx8IChrPHBhdGgubGVuZ3RoLTEpIDtcblx0XHRcdFx0XHRcdFx0XHRuZXdvcHRzLmJsb2Nrc2l6ZT1zejtuZXdvcHRzLmN1cj1jdXIsbmV3b3B0cy5rZXlzPVtdO1xuXHRcdFx0XHRcdFx0XHRcdGxhc3RrZXk9a2V5OyAvL2xvYWQgaXMgc3luYyBpbiBhbmRyb2lkXG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9wdHMuYWRkcmVzcyAmJiB0YXNrcXVldWUubGVuZ3RoPT0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRBRERSRVNTW3BhdGhub3ddPVtjdXIsc3pdO1xuXHRcdFx0XHRcdFx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkobnVsbCxBRERSRVNTW3BhdGhub3ddKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0bG9hZC5hcHBseSh0aGF0LFtuZXdvcHRzLCB0YXNrcXVldWUuc2hpZnQoKV0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRpZiAob3B0cy5hZGRyZXNzICYmIHRhc2txdWV1ZS5sZW5ndGg9PTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpKG51bGwsQUREUkVTU1twYXRobm93XSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpLmFwcGx5KHRoYXQsW3JdKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9KVxuXHRcdFx0XHR9KVxuXHRcdFx0XHQocGF0aFtpXSxpKTtcblx0XHRcdFx0XG5cdFx0XHRcdHRhc2txdWV1ZS5wdXNoKHRhc2spO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGFza3F1ZXVlLmxlbmd0aD09MCkge1xuXHRcdFx0XHRjYi5hcHBseSh0aGF0LFtvXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvL2xhc3QgY2FsbCB0byBjaGlsZCBsb2FkXG5cdFx0XHRcdHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEsY3Vyc3ope1xuXHRcdFx0XHRcdGlmIChvcHRzLmFkZHJlc3MpIHtcblx0XHRcdFx0XHRcdGNiLmFwcGx5KHRoYXQsW2N1cnN6XSk7XG5cdFx0XHRcdFx0fSBlbHNle1xuXHRcdFx0XHRcdFx0dmFyIGtleT1wYXRoW3BhdGgubGVuZ3RoLTFdO1xuXHRcdFx0XHRcdFx0b1trZXldPWRhdGE7IEtFWVtwYXRobm93XT1vcHRzLmtleXM7XG5cdFx0XHRcdFx0XHRjYi5hcHBseSh0aGF0LFtkYXRhXSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9KTtcblx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1x0XHRcdFxuXHRcdFx0fVxuXG5cdFx0fV0pOyAvL3Jlc2V0XG5cdH1cblx0Ly8gZ2V0IGFsbCBrZXlzIGluIGdpdmVuIHBhdGhcblx0dmFyIGdldGtleXM9ZnVuY3Rpb24ocGF0aCxjYikge1xuXHRcdGlmICghcGF0aCkgcGF0aD1bXVxuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0Z2V0LmFwcGx5KHRoaXMsW3BhdGgsZmFsc2UsZnVuY3Rpb24oKXtcblx0XHRcdGlmIChwYXRoICYmIHBhdGgubGVuZ3RoKSB7XG5cdFx0XHRcdGNiLmFwcGx5KHRoYXQsW0tFWVtwYXRoLmpvaW4oc3Ryc2VwKV1dKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNiLmFwcGx5KHRoYXQsW09iamVjdC5rZXlzKENBQ0hFKV0pOyBcblx0XHRcdFx0Ly90b3AgbGV2ZWwsIG5vcm1hbGx5IGl0IGlzIHZlcnkgc21hbGxcblx0XHRcdH1cblx0XHR9XSk7XG5cdH1cblxuXHR2YXIgc2V0dXBhcGk9ZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5sb2FkPWxvYWQ7XG4vL1x0XHR0aGlzLmN1cj0wO1xuXHRcdHRoaXMuY2FjaGU9ZnVuY3Rpb24oKSB7cmV0dXJuIENBQ0hFfTtcblx0XHR0aGlzLmtleT1mdW5jdGlvbigpIHtyZXR1cm4gS0VZfTtcblx0XHR0aGlzLmZyZWU9ZnVuY3Rpb24oKSB7XG5cdFx0XHRDQUNIRT1udWxsO1xuXHRcdFx0S0VZPW51bGw7XG5cdFx0XHR0aGlzLmZzLmZyZWUoKTtcblx0XHR9XG5cdFx0dGhpcy5zZXRDYWNoZT1mdW5jdGlvbihjKSB7Q0FDSEU9Y307XG5cdFx0dGhpcy5rZXlzPWdldGtleXM7XG5cdFx0dGhpcy5nZXQ9Z2V0OyAgIC8vIGdldCBhIGZpZWxkLCBsb2FkIGlmIG5lZWRlZFxuXHRcdHRoaXMuZXhpc3RzPWV4aXN0cztcblx0XHR0aGlzLkRUPURUO1xuXHRcdFxuXHRcdC8vaW5zdGFsbCB0aGUgc3luYyB2ZXJzaW9uIGZvciBub2RlXG5cdFx0Ly9pZiAodHlwZW9mIHByb2Nlc3MhPVwidW5kZWZpbmVkXCIpIHJlcXVpcmUoXCIuL2tkYl9zeW5jXCIpKHRoaXMpO1xuXHRcdC8vaWYgKGNiKSBzZXRUaW1lb3V0KGNiLmJpbmQodGhpcyksMCk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR2YXIgZXJyPTA7XG5cdFx0aWYgKGNiKSB7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNiKGVycix0aGF0KTtcdFxuXHRcdFx0fSwwKTtcblx0XHR9XG5cdH1cblx0dmFyIHRoYXQ9dGhpcztcblx0dmFyIGtmcz1uZXcgS2ZzKHBhdGgsb3B0cyxmdW5jdGlvbihlcnIpe1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0Y2IoZXJyLDApO1xuXHRcdFx0fSwwKTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGF0LnNpemU9dGhpcy5zaXplO1xuXHRcdFx0c2V0dXBhcGkuY2FsbCh0aGF0KTtcdFx0XHRcblx0XHR9XG5cdH0pO1xuXHR0aGlzLmZzPWtmcztcblx0cmV0dXJuIHRoaXM7XG59XG5cbkNyZWF0ZS5kYXRhdHlwZXM9RFQ7XG5cbmlmIChtb2R1bGUpIG1vZHVsZS5leHBvcnRzPUNyZWF0ZTtcbi8vcmV0dXJuIENyZWF0ZTtcbiIsIi8qIG5vZGUuanMgYW5kIGh0bWw1IGZpbGUgc3lzdGVtIGFic3RyYWN0aW9uIGxheWVyKi9cbnRyeSB7XG5cdHZhciBmcz1yZXF1aXJlKFwiZnNcIik7XG5cdHZhciBCdWZmZXI9cmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXI7XG59IGNhdGNoIChlKSB7XG5cdHZhciBmcz1yZXF1aXJlKCcuL2h0bWw1cmVhZCcpO1xuXHR2YXIgQnVmZmVyPWZ1bmN0aW9uKCl7IHJldHVybiBcIlwifTtcblx0dmFyIGh0bWw1ZnM9dHJ1ZTsgXHRcbn1cbnZhciBzaWduYXR1cmVfc2l6ZT0xO1xudmFyIHZlcmJvc2U9MCwgcmVhZExvZz1mdW5jdGlvbigpe307XG52YXIgX3JlYWRMb2c9ZnVuY3Rpb24ocmVhZHR5cGUsYnl0ZXMpIHtcblx0Y29uc29sZS5sb2cocmVhZHR5cGUsYnl0ZXMsXCJieXRlc1wiKTtcbn1cbmlmICh2ZXJib3NlKSByZWFkTG9nPV9yZWFkTG9nO1xuXG52YXIgdW5wYWNrX2ludCA9IGZ1bmN0aW9uIChhciwgY291bnQgLCByZXNldCkge1xuICAgY291bnQ9Y291bnR8fGFyLmxlbmd0aDtcbiAgdmFyIHIgPSBbXSwgaSA9IDAsIHYgPSAwO1xuICBkbyB7XG5cdHZhciBzaGlmdCA9IDA7XG5cdGRvIHtcblx0ICB2ICs9ICgoYXJbaV0gJiAweDdGKSA8PCBzaGlmdCk7XG5cdCAgc2hpZnQgKz0gNztcdCAgXG5cdH0gd2hpbGUgKGFyWysraV0gJiAweDgwKTtcblx0ci5wdXNoKHYpOyBpZiAocmVzZXQpIHY9MDtcblx0Y291bnQtLTtcbiAgfSB3aGlsZSAoaTxhci5sZW5ndGggJiYgY291bnQpO1xuICByZXR1cm4ge2RhdGE6ciwgYWR2OmkgfTtcbn1cbnZhciBPcGVuPWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xuXHRvcHRzPW9wdHN8fHt9O1xuXG5cdHZhciByZWFkU2lnbmF0dXJlPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRcdHZhciBidWY9bmV3IEJ1ZmZlcihzaWduYXR1cmVfc2l6ZSk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZiwwLHNpZ25hdHVyZV9zaXplLHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRpZiAoaHRtbDVmcykgdmFyIHNpZ25hdHVyZT1TdHJpbmcuZnJvbUNoYXJDb2RlKChuZXcgVWludDhBcnJheShidWZmZXIpKVswXSlcblx0XHRcdGVsc2UgdmFyIHNpZ25hdHVyZT1idWZmZXIudG9TdHJpbmcoJ3V0ZjgnLDAsc2lnbmF0dXJlX3NpemUpO1xuXHRcdFx0Y2IuYXBwbHkodGhhdCxbc2lnbmF0dXJlXSk7XG5cdFx0fSk7XG5cdH1cblxuXHQvL3RoaXMgaXMgcXVpdGUgc2xvd1xuXHQvL3dhaXQgZm9yIFN0cmluZ1ZpZXcgK0FycmF5QnVmZmVyIHRvIHNvbHZlIHRoZSBwcm9ibGVtXG5cdC8vaHR0cHM6Ly9ncm91cHMuZ29vZ2xlLmNvbS9hL2Nocm9taXVtLm9yZy9mb3J1bS8jIXRvcGljL2JsaW5rLWRldi95bGdpTllfWlNWMFxuXHQvL2lmIHRoZSBzdHJpbmcgaXMgYWx3YXlzIHVjczJcblx0Ly9jYW4gdXNlIFVpbnQxNiB0byByZWFkIGl0LlxuXHQvL2h0dHA6Ly91cGRhdGVzLmh0bWw1cm9ja3MuY29tLzIwMTIvMDYvSG93LXRvLWNvbnZlcnQtQXJyYXlCdWZmZXItdG8tYW5kLWZyb20tU3RyaW5nXG5cdHZhciBkZWNvZGV1dGY4ID0gZnVuY3Rpb24gKHV0ZnRleHQpIHtcblx0XHR2YXIgc3RyaW5nID0gXCJcIjtcblx0XHR2YXIgaSA9IDA7XG5cdFx0dmFyIGM9MCxjMSA9IDAsIGMyID0gMCAsIGMzPTA7XG5cdFx0Zm9yICh2YXIgaT0wO2k8dXRmdGV4dC5sZW5ndGg7aSsrKSB7XG5cdFx0XHRpZiAodXRmdGV4dC5jaGFyQ29kZUF0KGkpPjEyNykgYnJlYWs7XG5cdFx0fVxuXHRcdGlmIChpPj11dGZ0ZXh0Lmxlbmd0aCkgcmV0dXJuIHV0ZnRleHQ7XG5cblx0XHR3aGlsZSAoIGkgPCB1dGZ0ZXh0Lmxlbmd0aCApIHtcblx0XHRcdGMgPSB1dGZ0ZXh0LmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRpZiAoYyA8IDEyOCkge1xuXHRcdFx0XHRzdHJpbmcgKz0gdXRmdGV4dFtpXTtcblx0XHRcdFx0aSsrO1xuXHRcdFx0fSBlbHNlIGlmKChjID4gMTkxKSAmJiAoYyA8IDIyNCkpIHtcblx0XHRcdFx0YzIgPSB1dGZ0ZXh0LmNoYXJDb2RlQXQoaSsxKTtcblx0XHRcdFx0c3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMzEpIDw8IDYpIHwgKGMyICYgNjMpKTtcblx0XHRcdFx0aSArPSAyO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0YzIgPSB1dGZ0ZXh0LmNoYXJDb2RlQXQoaSsxKTtcblx0XHRcdFx0YzMgPSB1dGZ0ZXh0LmNoYXJDb2RlQXQoaSsyKTtcblx0XHRcdFx0c3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMTUpIDw8IDEyKSB8ICgoYzIgJiA2MykgPDwgNikgfCAoYzMgJiA2MykpO1xuXHRcdFx0XHRpICs9IDM7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHJldHVybiBzdHJpbmc7XG5cdH1cblxuXHR2YXIgcmVhZFN0cmluZz0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xuXHRcdGVuY29kaW5nPWVuY29kaW5nfHwndXRmOCc7XG5cdFx0dmFyIGJ1ZmZlcj1uZXcgQnVmZmVyKGJsb2Nrc2l6ZSk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZmZlciwwLGJsb2Nrc2l6ZSxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0cmVhZExvZyhcInN0cmluZ1wiLGxlbik7XG5cdFx0XHRpZiAoaHRtbDVmcykge1xuXHRcdFx0XHRpZiAoZW5jb2Rpbmc9PSd1dGY4Jykge1xuXHRcdFx0XHRcdHZhciBzdHI9ZGVjb2RldXRmOChTdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpKVxuXHRcdFx0XHR9IGVsc2UgeyAvL3VjczIgaXMgMyB0aW1lcyBmYXN0ZXJcblx0XHRcdFx0XHR2YXIgc3RyPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQxNkFycmF5KGJ1ZmZlcikpXHRcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbc3RyXSk7XG5cdFx0XHR9IFxuXHRcdFx0ZWxzZSBjYi5hcHBseSh0aGF0LFtidWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpXSk7XHRcblx0XHR9KTtcblx0fVxuXG5cdC8vd29yayBhcm91bmQgZm9yIGNocm9tZSBmcm9tQ2hhckNvZGUgY2Fubm90IGFjY2VwdCBodWdlIGFycmF5XG5cdC8vaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC9jaHJvbWl1bS9pc3N1ZXMvZGV0YWlsP2lkPTU2NTg4XG5cdHZhciBidWYyc3RyaW5nYXJyPWZ1bmN0aW9uKGJ1ZixlbmMpIHtcblx0XHRpZiAoZW5jPT1cInV0ZjhcIikgXHR2YXIgYXJyPW5ldyBVaW50OEFycmF5KGJ1Zik7XG5cdFx0ZWxzZSB2YXIgYXJyPW5ldyBVaW50MTZBcnJheShidWYpO1xuXHRcdHZhciBpPTAsY29kZXM9W10sb3V0PVtdLHM9XCJcIjtcblx0XHR3aGlsZSAoaTxhcnIubGVuZ3RoKSB7XG5cdFx0XHRpZiAoYXJyW2ldKSB7XG5cdFx0XHRcdGNvZGVzW2NvZGVzLmxlbmd0aF09YXJyW2ldO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsY29kZXMpO1xuXHRcdFx0XHRpZiAoZW5jPT1cInV0ZjhcIikgb3V0W291dC5sZW5ndGhdPWRlY29kZXV0Zjgocyk7XG5cdFx0XHRcdGVsc2Ugb3V0W291dC5sZW5ndGhdPXM7XG5cdFx0XHRcdGNvZGVzPVtdO1x0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRpKys7XG5cdFx0fVxuXHRcdFxuXHRcdHM9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGNvZGVzKTtcblx0XHRpZiAoZW5jPT1cInV0ZjhcIikgb3V0W291dC5sZW5ndGhdPWRlY29kZXV0Zjgocyk7XG5cdFx0ZWxzZSBvdXRbb3V0Lmxlbmd0aF09cztcblxuXHRcdHJldHVybiBvdXQ7XG5cdH1cblx0dmFyIHJlYWRTdHJpbmdBcnJheSA9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzLG91dD1udWxsO1xuXHRcdGlmIChibG9ja3NpemU9PTApIHJldHVybiBbXTtcblx0XHRlbmNvZGluZz1lbmNvZGluZ3x8J3V0ZjgnO1xuXHRcdHZhciBidWZmZXI9bmV3IEJ1ZmZlcihibG9ja3NpemUpO1xuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsYmxvY2tzaXplLHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRpZiAoaHRtbDVmcykge1xuXHRcdFx0XHRyZWFkTG9nKFwic3RyaW5nQXJyYXlcIixidWZmZXIuYnl0ZUxlbmd0aCk7XG5cblx0XHRcdFx0aWYgKGVuY29kaW5nPT0ndXRmOCcpIHtcblx0XHRcdFx0XHRvdXQ9YnVmMnN0cmluZ2FycihidWZmZXIsXCJ1dGY4XCIpO1xuXHRcdFx0XHR9IGVsc2UgeyAvL3VjczIgaXMgMyB0aW1lcyBmYXN0ZXJcblx0XHRcdFx0XHRvdXQ9YnVmMnN0cmluZ2FycihidWZmZXIsXCJ1Y3MyXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZWFkTG9nKFwic3RyaW5nQXJyYXlcIixidWZmZXIubGVuZ3RoKTtcblx0XHRcdFx0b3V0PWJ1ZmZlci50b1N0cmluZyhlbmNvZGluZykuc3BsaXQoJ1xcMCcpO1xuXHRcdFx0fSBcdFxuXHRcdFx0Y2IuYXBwbHkodGhhdCxbb3V0XSk7XG5cdFx0fSk7XG5cdH1cblx0dmFyIHJlYWRVSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRcdHZhciBidWZmZXI9bmV3IEJ1ZmZlcig0KTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsNCxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0cmVhZExvZyhcInVpMzJcIixsZW4pO1xuXHRcdFx0aWYgKGh0bWw1ZnMpe1xuXHRcdFx0XHQvL3Y9KG5ldyBVaW50MzJBcnJheShidWZmZXIpKVswXTtcblx0XHRcdFx0dmFyIHY9bmV3IERhdGFWaWV3KGJ1ZmZlcikuZ2V0VWludDMyKDAsIGZhbHNlKVxuXHRcdFx0XHRjYih2KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgY2IuYXBwbHkodGhhdCxbYnVmZmVyLnJlYWRJbnQzMkJFKDApXSk7XHRcblx0XHR9KTtcdFx0XG5cdH1cblxuXHR2YXIgcmVhZEkzMj1mdW5jdGlvbihwb3MsY2IpIHtcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoNCk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZmZlciwwLDQscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdHJlYWRMb2coXCJpMzJcIixsZW4pO1xuXHRcdFx0aWYgKGh0bWw1ZnMpe1xuXHRcdFx0XHR2YXIgdj1uZXcgRGF0YVZpZXcoYnVmZmVyKS5nZXRJbnQzMigwLCBmYWxzZSlcblx0XHRcdFx0Y2Iodik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlICBcdGNiLmFwcGx5KHRoYXQsW2J1ZmZlci5yZWFkSW50MzJCRSgwKV0pO1x0XG5cdFx0fSk7XG5cdH1cblx0dmFyIHJlYWRVSTg9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdFx0dmFyIGJ1ZmZlcj1uZXcgQnVmZmVyKDEpO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZmZlciwwLDEscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdHJlYWRMb2coXCJ1aThcIixsZW4pO1xuXHRcdFx0aWYgKGh0bWw1ZnMpY2IoIChuZXcgVWludDhBcnJheShidWZmZXIpKVswXSkgO1xuXHRcdFx0ZWxzZSAgXHRcdFx0Y2IuYXBwbHkodGhhdCxbYnVmZmVyLnJlYWRVSW50OCgwKV0pO1x0XG5cdFx0XHRcblx0XHR9KTtcblx0fVxuXHR2YXIgcmVhZEJ1Zj1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR2YXIgYnVmPW5ldyBCdWZmZXIoYmxvY2tzaXplKTtcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZiwwLGJsb2Nrc2l6ZSxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0cmVhZExvZyhcImJ1ZlwiLGxlbik7XG5cdFx0XHR2YXIgYnVmZj1uZXcgVWludDhBcnJheShidWZmZXIpXG5cdFx0XHRjYi5hcHBseSh0aGF0LFtidWZmXSk7XG5cdFx0fSk7XG5cdH1cblx0dmFyIHJlYWRCdWZfcGFja2VkaW50PWZ1bmN0aW9uKHBvcyxibG9ja3NpemUsY291bnQscmVzZXQsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHJlYWRCdWYuYXBwbHkodGhpcyxbcG9zLGJsb2Nrc2l6ZSxmdW5jdGlvbihidWZmZXIpe1xuXHRcdFx0Y2IuYXBwbHkodGhhdCxbdW5wYWNrX2ludChidWZmZXIsY291bnQscmVzZXQpXSk7XHRcblx0XHR9XSk7XG5cdFx0XG5cdH1cblx0dmFyIHJlYWRGaXhlZEFycmF5X2h0bWw1ZnM9ZnVuY3Rpb24ocG9zLGNvdW50LHVuaXRzaXplLGNiKSB7XG5cdFx0dmFyIGZ1bmM9bnVsbDtcblx0XHRpZiAodW5pdHNpemU9PT0xKSB7XG5cdFx0XHRmdW5jPSdnZXRVaW50OCc7Ly9VaW50OEFycmF5O1xuXHRcdH0gZWxzZSBpZiAodW5pdHNpemU9PT0yKSB7XG5cdFx0XHRmdW5jPSdnZXRVaW50MTYnOy8vVWludDE2QXJyYXk7XG5cdFx0fSBlbHNlIGlmICh1bml0c2l6ZT09PTQpIHtcblx0XHRcdGZ1bmM9J2dldFVpbnQzMic7Ly9VaW50MzJBcnJheTtcblx0XHR9IGVsc2UgdGhyb3cgJ3Vuc3VwcG9ydGVkIGludGVnZXIgc2l6ZSc7XG5cblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLG51bGwsMCx1bml0c2l6ZSpjb3VudCxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0cmVhZExvZyhcImZpeCBhcnJheVwiLGxlbik7XG5cdFx0XHR2YXIgb3V0PVtdO1xuXHRcdFx0aWYgKHVuaXRzaXplPT0xKSB7XG5cdFx0XHRcdG91dD1uZXcgVWludDhBcnJheShidWZmZXIpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBsZW4gLyB1bml0c2l6ZTsgaSsrKSB7IC8vZW5kaWFuIHByb2JsZW1cblx0XHRcdFx0Ly9cdG91dC5wdXNoKCBmdW5jKGJ1ZmZlcixpKnVuaXRzaXplKSk7XG5cdFx0XHRcdFx0b3V0LnB1c2goIHY9bmV3IERhdGFWaWV3KGJ1ZmZlcilbZnVuY10oaSxmYWxzZSkgKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvdXRdKTtcblx0XHR9KTtcblx0fVxuXHQvLyBzaWduYXR1cmUsIGl0ZW1jb3VudCwgcGF5bG9hZFxuXHR2YXIgcmVhZEZpeGVkQXJyYXkgPSBmdW5jdGlvbihwb3MgLGNvdW50LCB1bml0c2l6ZSxjYikge1xuXHRcdHZhciBmdW5jPW51bGw7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRcblx0XHRpZiAodW5pdHNpemUqIGNvdW50PnRoaXMuc2l6ZSAmJiB0aGlzLnNpemUpICB7XG5cdFx0XHRjb25zb2xlLmxvZyhcImFycmF5IHNpemUgZXhjZWVkIGZpbGUgc2l6ZVwiLHRoaXMuc2l6ZSlcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0XG5cdFx0aWYgKGh0bWw1ZnMpIHJldHVybiByZWFkRml4ZWRBcnJheV9odG1sNWZzLmFwcGx5KHRoaXMsW3Bvcyxjb3VudCx1bml0c2l6ZSxjYl0pO1xuXG5cdFx0dmFyIGl0ZW1zPW5ldyBCdWZmZXIoIHVuaXRzaXplKiBjb3VudCk7XG5cdFx0aWYgKHVuaXRzaXplPT09MSkge1xuXHRcdFx0ZnVuYz1pdGVtcy5yZWFkVUludDg7XG5cdFx0fSBlbHNlIGlmICh1bml0c2l6ZT09PTIpIHtcblx0XHRcdGZ1bmM9aXRlbXMucmVhZFVJbnQxNkJFO1xuXHRcdH0gZWxzZSBpZiAodW5pdHNpemU9PT00KSB7XG5cdFx0XHRmdW5jPWl0ZW1zLnJlYWRVSW50MzJCRTtcblx0XHR9IGVsc2UgdGhyb3cgJ3Vuc3VwcG9ydGVkIGludGVnZXIgc2l6ZSc7XG5cdFx0Ly9jb25zb2xlLmxvZygnaXRlbWNvdW50JyxpdGVtY291bnQsJ2J1ZmZlcicsYnVmZmVyKTtcblxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsaXRlbXMsMCx1bml0c2l6ZSpjb3VudCxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0cmVhZExvZyhcImZpeCBhcnJheVwiLGxlbik7XG5cdFx0XHR2YXIgb3V0PVtdO1xuXHRcdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGggLyB1bml0c2l6ZTsgaSsrKSB7XG5cdFx0XHRcdG91dC5wdXNoKCBmdW5jLmFwcGx5KGl0ZW1zLFtpKnVuaXRzaXplXSkpO1xuXHRcdFx0fVxuXHRcdFx0Y2IuYXBwbHkodGhhdCxbb3V0XSk7XG5cdFx0fSk7XG5cdH1cblxuXHR2YXIgZnJlZT1mdW5jdGlvbigpIHtcblx0XHQvL2NvbnNvbGUubG9nKCdjbG9zaW5nICcsaGFuZGxlKTtcblx0XHRmcy5jbG9zZVN5bmModGhpcy5oYW5kbGUpO1xuXHR9XG5cdHZhciBzZXR1cGFwaT1mdW5jdGlvbigpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHRoaXMucmVhZFNpZ25hdHVyZT1yZWFkU2lnbmF0dXJlO1xuXHRcdHRoaXMucmVhZEkzMj1yZWFkSTMyO1xuXHRcdHRoaXMucmVhZFVJMzI9cmVhZFVJMzI7XG5cdFx0dGhpcy5yZWFkVUk4PXJlYWRVSTg7XG5cdFx0dGhpcy5yZWFkQnVmPXJlYWRCdWY7XG5cdFx0dGhpcy5yZWFkQnVmX3BhY2tlZGludD1yZWFkQnVmX3BhY2tlZGludDtcblx0XHR0aGlzLnJlYWRGaXhlZEFycmF5PXJlYWRGaXhlZEFycmF5O1xuXHRcdHRoaXMucmVhZFN0cmluZz1yZWFkU3RyaW5nO1xuXHRcdHRoaXMucmVhZFN0cmluZ0FycmF5PXJlYWRTdHJpbmdBcnJheTtcblx0XHR0aGlzLnNpZ25hdHVyZV9zaXplPXNpZ25hdHVyZV9zaXplO1xuXHRcdHRoaXMuZnJlZT1mcmVlO1xuXHRcdGlmIChodG1sNWZzKSB7XG5cdFx0XHR2YXIgZm49cGF0aDtcblx0XHRcdGlmIChwYXRoLmluZGV4T2YoXCJmaWxlc3lzdGVtOlwiKT09MCkgZm49cGF0aC5zdWJzdHIocGF0aC5sYXN0SW5kZXhPZihcIi9cIikpO1xuXHRcdFx0ZnMuZnMucm9vdC5nZXRGaWxlKGZuLHt9LGZ1bmN0aW9uKGVudHJ5KXtcblx0XHRcdCAgZW50cnkuZ2V0TWV0YWRhdGEoZnVuY3Rpb24obWV0YWRhdGEpIHsgXG5cdFx0XHRcdHRoYXQuc2l6ZT1tZXRhZGF0YS5zaXplO1xuXHRcdFx0XHRpZiAoY2IpIHNldFRpbWVvdXQoY2IuYmluZCh0aGF0KSwwKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHN0YXQ9ZnMuZnN0YXRTeW5jKHRoaXMuaGFuZGxlKTtcblx0XHRcdHRoaXMuc3RhdD1zdGF0O1xuXHRcdFx0dGhpcy5zaXplPXN0YXQuc2l6ZTtcdFx0XG5cdFx0XHRpZiAoY2IpXHRzZXRUaW1lb3V0KGNiLmJpbmQodGhpcywwKSwwKTtcdFxuXHRcdH1cblx0fVxuXG5cdHZhciB0aGF0PXRoaXM7XG5cdGlmIChodG1sNWZzKSB7XG5cdFx0ZnMub3BlbihwYXRoLGZ1bmN0aW9uKGgpe1xuXHRcdFx0aWYgKCFoKSB7XG5cdFx0XHRcdGlmIChjYilcdHNldFRpbWVvdXQoY2IuYmluZChudWxsLFwiZmlsZSBub3QgZm91bmQ6XCIrcGF0aCksMCk7XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHRoYXQuaGFuZGxlPWg7XG5cdFx0XHRcdHRoYXQuaHRtbDVmcz10cnVlO1xuXHRcdFx0XHRzZXR1cGFwaS5jYWxsKHRoYXQpO1xuXHRcdFx0XHR0aGF0Lm9wZW5lZD10cnVlO1x0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fSlcblx0fSBlbHNlIHtcblx0XHRpZiAoZnMuZXhpc3RzU3luYyhwYXRoKSl7XG5cdFx0XHR0aGlzLmhhbmRsZT1mcy5vcGVuU3luYyhwYXRoLCdyJyk7Ly8sZnVuY3Rpb24oZXJyLGhhbmRsZSl7XG5cdFx0XHR0aGlzLm9wZW5lZD10cnVlO1xuXHRcdFx0c2V0dXBhcGkuY2FsbCh0aGlzKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGNiKVx0c2V0VGltZW91dChjYi5iaW5kKG51bGwsXCJmaWxlIG5vdCBmb3VuZDpcIitwYXRoKSwwKTtcdFxuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0aGlzO1xufVxubW9kdWxlLmV4cG9ydHM9T3BlbjsiLCIvKlxuICBKQVZBIGNhbiBvbmx5IHJldHVybiBOdW1iZXIgYW5kIFN0cmluZ1xuXHRhcnJheSBhbmQgYnVmZmVyIHJldHVybiBpbiBzdHJpbmcgZm9ybWF0XG5cdG5lZWQgSlNPTi5wYXJzZVxuKi9cbnZhciB2ZXJib3NlPTA7XG5cbnZhciByZWFkU2lnbmF0dXJlPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgc2lnbmF0dXJlXCIpO1xuXHR2YXIgc2lnbmF0dXJlPWtmcy5yZWFkVVRGOFN0cmluZyh0aGlzLmhhbmRsZSxwb3MsMSk7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKHNpZ25hdHVyZSxzaWduYXR1cmUuY2hhckNvZGVBdCgwKSk7XG5cdGNiLmFwcGx5KHRoaXMsW3NpZ25hdHVyZV0pO1xufVxudmFyIHJlYWRJMzI9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBpMzIgYXQgXCIrcG9zKTtcblx0dmFyIGkzMj1rZnMucmVhZEludDMyKHRoaXMuaGFuZGxlLHBvcyk7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKGkzMik7XG5cdGNiLmFwcGx5KHRoaXMsW2kzMl0pO1x0XG59XG52YXIgcmVhZFVJMzI9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCB1aTMyIGF0IFwiK3Bvcyk7XG5cdHZhciB1aTMyPWtmcy5yZWFkVUludDMyKHRoaXMuaGFuZGxlLHBvcyk7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKHVpMzIpO1xuXHRjYi5hcHBseSh0aGlzLFt1aTMyXSk7XG59XG52YXIgcmVhZFVJOD1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIHVpOCBhdCBcIitwb3MpOyBcblx0dmFyIHVpOD1rZnMucmVhZFVJbnQ4KHRoaXMuaGFuZGxlLHBvcyk7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKHVpOCk7XG5cdGNiLmFwcGx5KHRoaXMsW3VpOF0pO1xufVxudmFyIHJlYWRCdWY9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgYnVmZmVyIGF0IFwiK3BvcysgXCIgYmxvY2tzaXplIFwiK2Jsb2Nrc2l6ZSk7XG5cdHZhciBidWY9a2ZzLnJlYWRCdWYodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XG5cdHZhciBidWZmPUpTT04ucGFyc2UoYnVmKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJidWZmZXIgbGVuZ3RoXCIrYnVmZi5sZW5ndGgpO1xuXHRjYi5hcHBseSh0aGlzLFtidWZmXSk7XHRcbn1cbnZhciByZWFkQnVmX3BhY2tlZGludD1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNvdW50LHJlc2V0LGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBwYWNrZWQgaW50IGF0IFwiK3BvcytcIiBibG9ja3NpemUgXCIrYmxvY2tzaXplK1wiIGNvdW50IFwiK2NvdW50KTtcblx0dmFyIGJ1Zj1rZnMucmVhZEJ1Zl9wYWNrZWRpbnQodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSxjb3VudCxyZXNldCk7XG5cdHZhciBhZHY9cGFyc2VJbnQoYnVmKTtcblx0dmFyIGJ1ZmY9SlNPTi5wYXJzZShidWYuc3Vic3RyKGJ1Zi5pbmRleE9mKFwiW1wiKSkpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInBhY2tlZEludCBsZW5ndGggXCIrYnVmZi5sZW5ndGgrXCIgZmlyc3QgaXRlbT1cIitidWZmWzBdKTtcblx0Y2IuYXBwbHkodGhpcyxbe2RhdGE6YnVmZixhZHY6YWR2fV0pO1x0XG59XG5cblxudmFyIHJlYWRTdHJpbmc9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkc3RyaW5nIGF0IFwiK3BvcytcIiBibG9ja3NpemUgXCIgK2Jsb2Nrc2l6ZStcIiBlbmM6XCIrZW5jb2RpbmcpO1xuXHRpZiAoZW5jb2Rpbmc9PVwidWNzMlwiKSB7XG5cdFx0dmFyIHN0cj1rZnMucmVhZFVMRTE2U3RyaW5nKHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBzdHI9a2ZzLnJlYWRVVEY4U3RyaW5nKHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUpO1x0XG5cdH1cdCBcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoc3RyKTtcblx0Y2IuYXBwbHkodGhpcyxbc3RyXSk7XHRcbn1cblxudmFyIHJlYWRGaXhlZEFycmF5ID0gZnVuY3Rpb24ocG9zICxjb3VudCwgdW5pdHNpemUsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIGZpeGVkIGFycmF5IGF0IFwiK3BvcytcIiBjb3VudCBcIitjb3VudCtcIiB1bml0c2l6ZSBcIit1bml0c2l6ZSk7IFxuXHR2YXIgYnVmPWtmcy5yZWFkRml4ZWRBcnJheSh0aGlzLmhhbmRsZSxwb3MsY291bnQsdW5pdHNpemUpO1xuXHR2YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zik7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwiYXJyYXkgbGVuZ3RoXCIrYnVmZi5sZW5ndGgpO1xuXHRjYi5hcHBseSh0aGlzLFtidWZmXSk7XHRcbn1cbnZhciByZWFkU3RyaW5nQXJyYXkgPSBmdW5jdGlvbihwb3MsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmxvZyhcInJlYWQgU3RyaW5nIGFycmF5IGF0IFwiK3BvcytcIiBibG9ja3NpemUgXCIrYmxvY2tzaXplICtcIiBlbmMgXCIrZW5jb2RpbmcpOyBcblx0ZW5jb2RpbmcgPSBlbmNvZGluZ3x8XCJ1dGY4XCI7XG5cdHZhciBidWY9a2ZzLnJlYWRTdHJpbmdBcnJheSh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplLGVuY29kaW5nKTtcblx0Ly92YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zik7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBzdHJpbmcgYXJyYXlcIik7XG5cdHZhciBidWZmPWJ1Zi5zcGxpdChcIlxcdWZmZmZcIik7IC8vY2Fubm90IHJldHVybiBzdHJpbmcgd2l0aCAwXG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwiYXJyYXkgbGVuZ3RoXCIrYnVmZi5sZW5ndGgpO1xuXHRjYi5hcHBseSh0aGlzLFtidWZmXSk7XHRcbn1cbnZhciBtZXJnZVBvc3RpbmdzPWZ1bmN0aW9uKHBvc2l0aW9ucyxjYikge1xuXHR2YXIgYnVmPWtmcy5tZXJnZVBvc3RpbmdzKHRoaXMuaGFuZGxlLEpTT04uc3RyaW5naWZ5KHBvc2l0aW9ucykpO1xuXHRpZiAoIWJ1ZiB8fCBidWYubGVuZ3RoPT0wKSByZXR1cm4gW107XG5cdGVsc2UgcmV0dXJuIEpTT04ucGFyc2UoYnVmKTtcbn1cblxudmFyIGZyZWU9ZnVuY3Rpb24oKSB7XG5cdC8vY29uc29sZS5sb2coJ2Nsb3NpbmcgJyxoYW5kbGUpO1xuXHRrZnMuY2xvc2UodGhpcy5oYW5kbGUpO1xufVxudmFyIE9wZW49ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XG5cdG9wdHM9b3B0c3x8e307XG5cdHZhciBzaWduYXR1cmVfc2l6ZT0xO1xuXHR2YXIgc2V0dXBhcGk9ZnVuY3Rpb24oKSB7IFxuXHRcdHRoaXMucmVhZFNpZ25hdHVyZT1yZWFkU2lnbmF0dXJlO1xuXHRcdHRoaXMucmVhZEkzMj1yZWFkSTMyO1xuXHRcdHRoaXMucmVhZFVJMzI9cmVhZFVJMzI7XG5cdFx0dGhpcy5yZWFkVUk4PXJlYWRVSTg7XG5cdFx0dGhpcy5yZWFkQnVmPXJlYWRCdWY7XG5cdFx0dGhpcy5yZWFkQnVmX3BhY2tlZGludD1yZWFkQnVmX3BhY2tlZGludDtcblx0XHR0aGlzLnJlYWRGaXhlZEFycmF5PXJlYWRGaXhlZEFycmF5O1xuXHRcdHRoaXMucmVhZFN0cmluZz1yZWFkU3RyaW5nO1xuXHRcdHRoaXMucmVhZFN0cmluZ0FycmF5PXJlYWRTdHJpbmdBcnJheTtcblx0XHR0aGlzLnNpZ25hdHVyZV9zaXplPXNpZ25hdHVyZV9zaXplO1xuXHRcdHRoaXMubWVyZ2VQb3N0aW5ncz1tZXJnZVBvc3RpbmdzO1xuXHRcdHRoaXMuZnJlZT1mcmVlO1xuXHRcdHRoaXMuc2l6ZT1rZnMuZ2V0RmlsZVNpemUodGhpcy5oYW5kbGUpO1xuXHRcdGlmICh2ZXJib3NlKSBjb25zb2xlLmxvZyhcImZpbGVzaXplICBcIit0aGlzLnNpemUpO1xuXHRcdGlmIChjYilcdGNiLmNhbGwodGhpcyk7XG5cdH1cblxuXHR0aGlzLmhhbmRsZT1rZnMub3BlbihwYXRoKTtcblx0dGhpcy5vcGVuZWQ9dHJ1ZTtcblx0c2V0dXBhcGkuY2FsbCh0aGlzKTtcblx0cmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzPU9wZW47IiwiLypcbiAgSlNDb250ZXh0IGNhbiByZXR1cm4gYWxsIEphdmFzY3JpcHQgdHlwZXMuXG4qL1xudmFyIHZlcmJvc2U9MTtcblxudmFyIHJlYWRTaWduYXR1cmU9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBzaWduYXR1cmUgYXQgXCIrcG9zKTtcblx0dmFyIHNpZ25hdHVyZT1rZnMucmVhZFVURjhTdHJpbmcodGhpcy5oYW5kbGUscG9zLDEpO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhzaWduYXR1cmUrXCIgXCIrc2lnbmF0dXJlLmNoYXJDb2RlQXQoMCkpO1xuXHRjYi5hcHBseSh0aGlzLFtzaWduYXR1cmVdKTtcbn1cbnZhciByZWFkSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgaTMyIGF0IFwiK3Bvcyk7XG5cdHZhciBpMzI9a2ZzLnJlYWRJbnQzMih0aGlzLmhhbmRsZSxwb3MpO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhpMzIpO1xuXHRjYi5hcHBseSh0aGlzLFtpMzJdKTtcdFxufVxudmFyIHJlYWRVSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgdWkzMiBhdCBcIitwb3MpO1xuXHR2YXIgdWkzMj1rZnMucmVhZFVJbnQzMih0aGlzLmhhbmRsZSxwb3MpO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyh1aTMyKTtcblx0Y2IuYXBwbHkodGhpcyxbdWkzMl0pO1xufVxudmFyIHJlYWRVSTg9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCB1aTggYXQgXCIrcG9zKTsgXG5cdHZhciB1aTg9a2ZzLnJlYWRVSW50OCh0aGlzLmhhbmRsZSxwb3MpO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyh1aTgpO1xuXHRjYi5hcHBseSh0aGlzLFt1aThdKTtcbn1cbnZhciByZWFkQnVmPWZ1bmN0aW9uKHBvcyxibG9ja3NpemUsY2IpIHtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIGJ1ZmZlciBhdCBcIitwb3MpO1xuXHR2YXIgYnVmPWtmcy5yZWFkQnVmKHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUpO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcImJ1ZmZlciBsZW5ndGhcIitidWYubGVuZ3RoKTtcblx0Y2IuYXBwbHkodGhpcyxbYnVmXSk7XHRcbn1cbnZhciByZWFkQnVmX3BhY2tlZGludD1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNvdW50LHJlc2V0LGNiKSB7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBwYWNrZWQgaW50IGZhc3QsIGJsb2Nrc2l6ZSBcIitibG9ja3NpemUrXCIgYXQgXCIrcG9zKTt2YXIgdD1uZXcgRGF0ZSgpO1xuXHR2YXIgYnVmPWtmcy5yZWFkQnVmX3BhY2tlZGludCh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplLGNvdW50LHJlc2V0KTtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZXR1cm4gZnJvbSBwYWNrZWRpbnQsIHRpbWVcIiArIChuZXcgRGF0ZSgpLXQpKTtcblx0aWYgKHR5cGVvZiBidWYuZGF0YT09XCJzdHJpbmdcIikge1xuXHRcdGJ1Zi5kYXRhPWV2YWwoXCJbXCIrYnVmLmRhdGEuc3Vic3RyKDAsYnVmLmRhdGEubGVuZ3RoLTEpK1wiXVwiKTtcblx0fVxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInVucGFja2VkIGxlbmd0aFwiK2J1Zi5kYXRhLmxlbmd0aCtcIiB0aW1lXCIgKyAobmV3IERhdGUoKS10KSApO1xuXHRjYi5hcHBseSh0aGlzLFtidWZdKTtcbn1cblxuXG52YXIgcmVhZFN0cmluZz0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xuXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZHN0cmluZyBhdCBcIitwb3MrXCIgYmxvY2tzaXplIFwiK2Jsb2Nrc2l6ZStcIiBcIitlbmNvZGluZyk7dmFyIHQ9bmV3IERhdGUoKTtcblx0aWYgKGVuY29kaW5nPT1cInVjczJcIikge1xuXHRcdHZhciBzdHI9a2ZzLnJlYWRVTEUxNlN0cmluZyh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgc3RyPWtmcy5yZWFkVVRGOFN0cmluZyh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcdFxuXHR9XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKHN0citcIiB0aW1lXCIrKG5ldyBEYXRlKCktdCkpO1xuXHRjYi5hcHBseSh0aGlzLFtzdHJdKTtcdFxufVxuXG52YXIgcmVhZEZpeGVkQXJyYXkgPSBmdW5jdGlvbihwb3MgLGNvdW50LCB1bml0c2l6ZSxjYikge1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgZml4ZWQgYXJyYXkgYXQgXCIrcG9zKTsgdmFyIHQ9bmV3IERhdGUoKTtcblx0dmFyIGJ1Zj1rZnMucmVhZEZpeGVkQXJyYXkodGhpcy5oYW5kbGUscG9zLGNvdW50LHVuaXRzaXplKTtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJhcnJheSBsZW5ndGggXCIrYnVmLmxlbmd0aCtcIiB0aW1lXCIrKG5ldyBEYXRlKCktdCkpO1xuXHRjYi5hcHBseSh0aGlzLFtidWZdKTtcdFxufVxudmFyIHJlYWRTdHJpbmdBcnJheSA9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcblx0Ly9pZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgU3RyaW5nIGFycmF5IFwiK2Jsb2Nrc2l6ZSArXCIgXCIrZW5jb2RpbmcpOyBcblx0ZW5jb2RpbmcgPSBlbmNvZGluZ3x8XCJ1dGY4XCI7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBzdHJpbmcgYXJyYXkgYXQgXCIrcG9zKTt2YXIgdD1uZXcgRGF0ZSgpO1xuXHR2YXIgYnVmPWtmcy5yZWFkU3RyaW5nQXJyYXkodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyk7XG5cdGlmICh0eXBlb2YgYnVmPT1cInN0cmluZ1wiKSBidWY9YnVmLnNwbGl0KFwiXFwwXCIpO1xuXHQvL3ZhciBidWZmPUpTT04ucGFyc2UoYnVmKTtcblx0Ly92YXIgYnVmZj1idWYuc3BsaXQoXCJcXHVmZmZmXCIpOyAvL2Nhbm5vdCByZXR1cm4gc3RyaW5nIHdpdGggMFxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInN0cmluZyBhcnJheSBsZW5ndGhcIitidWYubGVuZ3RoK1wiIHRpbWVcIisobmV3IERhdGUoKS10KSk7XG5cdGNiLmFwcGx5KHRoaXMsW2J1Zl0pO1xufVxuXG52YXIgbWVyZ2VQb3N0aW5ncz1mdW5jdGlvbihwb3NpdGlvbnMpIHtcblx0dmFyIGJ1Zj1rZnMubWVyZ2VQb3N0aW5ncyh0aGlzLmhhbmRsZSxwb3NpdGlvbnMpO1xuXHRpZiAodHlwZW9mIGJ1Zj09XCJzdHJpbmdcIikge1xuXHRcdGJ1Zj1ldmFsKFwiW1wiK2J1Zi5zdWJzdHIoMCxidWYubGVuZ3RoLTEpK1wiXVwiKTtcblx0fVxuXHRyZXR1cm4gYnVmO1xufVxudmFyIGZyZWU9ZnVuY3Rpb24oKSB7XG5cdC8vLy9pZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZygnY2xvc2luZyAnLGhhbmRsZSk7XG5cdGtmcy5jbG9zZSh0aGlzLmhhbmRsZSk7XG59XG52YXIgT3Blbj1mdW5jdGlvbihwYXRoLG9wdHMsY2IpIHtcblx0b3B0cz1vcHRzfHx7fTtcblx0dmFyIHNpZ25hdHVyZV9zaXplPTE7XG5cdHZhciBzZXR1cGFwaT1mdW5jdGlvbigpIHsgXG5cdFx0dGhpcy5yZWFkU2lnbmF0dXJlPXJlYWRTaWduYXR1cmU7XG5cdFx0dGhpcy5yZWFkSTMyPXJlYWRJMzI7XG5cdFx0dGhpcy5yZWFkVUkzMj1yZWFkVUkzMjtcblx0XHR0aGlzLnJlYWRVSTg9cmVhZFVJODtcblx0XHR0aGlzLnJlYWRCdWY9cmVhZEJ1Zjtcblx0XHR0aGlzLnJlYWRCdWZfcGFja2VkaW50PXJlYWRCdWZfcGFja2VkaW50O1xuXHRcdHRoaXMucmVhZEZpeGVkQXJyYXk9cmVhZEZpeGVkQXJyYXk7XG5cdFx0dGhpcy5yZWFkU3RyaW5nPXJlYWRTdHJpbmc7XG5cdFx0dGhpcy5yZWFkU3RyaW5nQXJyYXk9cmVhZFN0cmluZ0FycmF5O1xuXHRcdHRoaXMuc2lnbmF0dXJlX3NpemU9c2lnbmF0dXJlX3NpemU7XG5cdFx0dGhpcy5tZXJnZVBvc3RpbmdzPW1lcmdlUG9zdGluZ3M7XG5cdFx0dGhpcy5mcmVlPWZyZWU7XG5cdFx0dGhpcy5zaXplPWtmcy5nZXRGaWxlU2l6ZSh0aGlzLmhhbmRsZSk7XG5cdFx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJmaWxlc2l6ZSAgXCIrdGhpcy5zaXplKTtcblx0XHRpZiAoY2IpXHRjYi5jYWxsKHRoaXMpO1xuXHR9XG5cblx0dGhpcy5oYW5kbGU9a2ZzLm9wZW4ocGF0aCk7XG5cdHRoaXMub3BlbmVkPXRydWU7XG5cdHNldHVwYXBpLmNhbGwodGhpcyk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cz1PcGVuOyIsIi8qXG4gIGNvbnZlcnQgYW55IGpzb24gaW50byBhIGJpbmFyeSBidWZmZXJcbiAgdGhlIGJ1ZmZlciBjYW4gYmUgc2F2ZWQgd2l0aCBhIHNpbmdsZSBsaW5lIG9mIGZzLndyaXRlRmlsZVxuKi9cblxudmFyIERUPXtcblx0dWludDg6JzEnLCAvL3Vuc2lnbmVkIDEgYnl0ZSBpbnRlZ2VyXG5cdGludDMyOic0JywgLy8gc2lnbmVkIDQgYnl0ZXMgaW50ZWdlclxuXHR1dGY4Oic4JywgIFxuXHR1Y3MyOicyJyxcblx0Ym9vbDonXicsIFxuXHRibG9iOicmJyxcblx0dXRmOGFycjonKicsIC8vc2hpZnQgb2YgOFxuXHR1Y3MyYXJyOidAJywgLy9zaGlmdCBvZiAyXG5cdHVpbnQ4YXJyOichJywgLy9zaGlmdCBvZiAxXG5cdGludDMyYXJyOickJywgLy9zaGlmdCBvZiA0XG5cdHZpbnQ6J2AnLFxuXHRwaW50Oid+JyxcdFxuXG5cdGFycmF5OidcXHUwMDFiJyxcblx0b2JqZWN0OidcXHUwMDFhJyBcblx0Ly95ZGIgc3RhcnQgd2l0aCBvYmplY3Qgc2lnbmF0dXJlLFxuXHQvL3R5cGUgYSB5ZGIgaW4gY29tbWFuZCBwcm9tcHQgc2hvd3Mgbm90aGluZ1xufVxudmFyIGtleV93cml0aW5nPVwiXCI7Ly9mb3IgZGVidWdnaW5nXG52YXIgcGFja19pbnQgPSBmdW5jdGlvbiAoYXIsIHNhdmVkZWx0YSkgeyAvLyBwYWNrIGFyIGludG9cbiAgaWYgKCFhciB8fCBhci5sZW5ndGggPT09IDApIHJldHVybiBbXTsgLy8gZW1wdHkgYXJyYXlcbiAgdmFyIHIgPSBbXSxcbiAgaSA9IDAsXG4gIGogPSAwLFxuICBkZWx0YSA9IDAsXG4gIHByZXYgPSAwO1xuICBcbiAgZG8ge1xuXHRkZWx0YSA9IGFyW2ldO1xuXHRpZiAoc2F2ZWRlbHRhKSB7XG5cdFx0ZGVsdGEgLT0gcHJldjtcblx0fVxuXHRpZiAoZGVsdGEgPCAwKSB7XG5cdCAgY29uc29sZS50cmFjZSgnbmVnYXRpdmUnLHByZXYsYXJbaV0pXG5cdCAgdGhyb3cgJ25lZ2V0aXZlJztcblx0ICBicmVhaztcblx0fVxuXHRcblx0cltqKytdID0gZGVsdGEgJiAweDdmO1xuXHRkZWx0YSA+Pj0gNztcblx0d2hpbGUgKGRlbHRhID4gMCkge1xuXHQgIHJbaisrXSA9IChkZWx0YSAmIDB4N2YpIHwgMHg4MDtcblx0ICBkZWx0YSA+Pj0gNztcblx0fVxuXHRwcmV2ID0gYXJbaV07XG5cdGkrKztcbiAgfSB3aGlsZSAoaSA8IGFyLmxlbmd0aCk7XG4gIHJldHVybiByO1xufVxudmFyIEtmcz1mdW5jdGlvbihwYXRoLG9wdHMpIHtcblx0XG5cdHZhciBoYW5kbGU9bnVsbDtcblx0b3B0cz1vcHRzfHx7fTtcblx0b3B0cy5zaXplPW9wdHMuc2l6ZXx8NjU1MzYqMjA0ODsgXG5cdGNvbnNvbGUubG9nKCdrZGIgZXN0aW1hdGUgc2l6ZTonLG9wdHMuc2l6ZSk7XG5cdHZhciBkYnVmPW5ldyBCdWZmZXIob3B0cy5zaXplKTtcblx0dmFyIGN1cj0wOy8vZGJ1ZiBjdXJzb3Jcblx0XG5cdHZhciB3cml0ZVNpZ25hdHVyZT1mdW5jdGlvbih2YWx1ZSxwb3MpIHtcblx0XHRkYnVmLndyaXRlKHZhbHVlLHBvcyx2YWx1ZS5sZW5ndGgsJ3V0ZjgnKTtcblx0XHRpZiAocG9zK3ZhbHVlLmxlbmd0aD5jdXIpIGN1cj1wb3MrdmFsdWUubGVuZ3RoO1xuXHRcdHJldHVybiB2YWx1ZS5sZW5ndGg7XG5cdH1cblx0dmFyIHdyaXRlT2Zmc2V0PWZ1bmN0aW9uKHZhbHVlLHBvcykge1xuXHRcdGRidWYud3JpdGVVSW50OChNYXRoLmZsb29yKHZhbHVlIC8gKDY1NTM2KjY1NTM2KSkscG9zKTtcblx0XHRkYnVmLndyaXRlVUludDMyQkUoIHZhbHVlICYgMHhGRkZGRkZGRixwb3MrMSk7XG5cdFx0aWYgKHBvcys1PmN1cikgY3VyPXBvcys1O1xuXHRcdHJldHVybiA1O1xuXHR9XG5cdHZhciB3cml0ZVN0cmluZz0gZnVuY3Rpb24odmFsdWUscG9zLGVuY29kaW5nKSB7XG5cdFx0ZW5jb2Rpbmc9ZW5jb2Rpbmd8fCd1Y3MyJztcblx0XHRpZiAodmFsdWU9PVwiXCIpIHRocm93IFwiY2Fubm90IHdyaXRlIG51bGwgc3RyaW5nXCI7XG5cdFx0aWYgKGVuY29kaW5nPT09J3V0ZjgnKWRidWYud3JpdGUoRFQudXRmOCxwb3MsMSwndXRmOCcpO1xuXHRcdGVsc2UgaWYgKGVuY29kaW5nPT09J3VjczInKWRidWYud3JpdGUoRFQudWNzMixwb3MsMSwndXRmOCcpO1xuXHRcdGVsc2UgdGhyb3cgJ3Vuc3VwcG9ydGVkIGVuY29kaW5nICcrZW5jb2Rpbmc7XG5cdFx0XHRcblx0XHR2YXIgbGVuPUJ1ZmZlci5ieXRlTGVuZ3RoKHZhbHVlLCBlbmNvZGluZyk7XG5cdFx0ZGJ1Zi53cml0ZSh2YWx1ZSxwb3MrMSxsZW4sZW5jb2RpbmcpO1xuXHRcdFxuXHRcdGlmIChwb3MrbGVuKzE+Y3VyKSBjdXI9cG9zK2xlbisxO1xuXHRcdHJldHVybiBsZW4rMTsgLy8gc2lnbmF0dXJlXG5cdH1cblx0dmFyIHdyaXRlU3RyaW5nQXJyYXkgPSBmdW5jdGlvbih2YWx1ZSxwb3MsZW5jb2RpbmcpIHtcblx0XHRlbmNvZGluZz1lbmNvZGluZ3x8J3VjczInO1xuXHRcdGlmIChlbmNvZGluZz09PSd1dGY4JykgZGJ1Zi53cml0ZShEVC51dGY4YXJyLHBvcywxLCd1dGY4Jyk7XG5cdFx0ZWxzZSBpZiAoZW5jb2Rpbmc9PT0ndWNzMicpZGJ1Zi53cml0ZShEVC51Y3MyYXJyLHBvcywxLCd1dGY4Jyk7XG5cdFx0ZWxzZSB0aHJvdyAndW5zdXBwb3J0ZWQgZW5jb2RpbmcgJytlbmNvZGluZztcblx0XHRcblx0XHR2YXIgdj12YWx1ZS5qb2luKCdcXDAnKTtcblx0XHR2YXIgbGVuPUJ1ZmZlci5ieXRlTGVuZ3RoKHYsIGVuY29kaW5nKTtcblx0XHRpZiAoMD09PWxlbikge1xuXHRcdFx0dGhyb3cgXCJlbXB0eSBzdHJpbmcgYXJyYXkgXCIgKyBrZXlfd3JpdGluZztcblx0XHR9XG5cdFx0ZGJ1Zi53cml0ZSh2LHBvcysxLGxlbixlbmNvZGluZyk7XG5cdFx0aWYgKHBvcytsZW4rMT5jdXIpIGN1cj1wb3MrbGVuKzE7XG5cdFx0cmV0dXJuIGxlbisxO1xuXHR9XG5cdHZhciB3cml0ZUkzMj1mdW5jdGlvbih2YWx1ZSxwb3MpIHtcblx0XHRkYnVmLndyaXRlKERULmludDMyLHBvcywxLCd1dGY4Jyk7XG5cdFx0ZGJ1Zi53cml0ZUludDMyQkUodmFsdWUscG9zKzEpO1xuXHRcdGlmIChwb3MrNT5jdXIpIGN1cj1wb3MrNTtcblx0XHRyZXR1cm4gNTtcblx0fVxuXHR2YXIgd3JpdGVVSTg9ZnVuY3Rpb24odmFsdWUscG9zKSB7XG5cdFx0ZGJ1Zi53cml0ZShEVC51aW50OCxwb3MsMSwndXRmOCcpO1xuXHRcdGRidWYud3JpdGVVSW50OCh2YWx1ZSxwb3MrMSk7XG5cdFx0aWYgKHBvcysyPmN1cikgY3VyPXBvcysyO1xuXHRcdHJldHVybiAyO1xuXHR9XG5cdHZhciB3cml0ZUJvb2w9ZnVuY3Rpb24odmFsdWUscG9zKSB7XG5cdFx0ZGJ1Zi53cml0ZShEVC5ib29sLHBvcywxLCd1dGY4Jyk7XG5cdFx0ZGJ1Zi53cml0ZVVJbnQ4KE51bWJlcih2YWx1ZSkscG9zKzEpO1xuXHRcdGlmIChwb3MrMj5jdXIpIGN1cj1wb3MrMjtcblx0XHRyZXR1cm4gMjtcblx0fVx0XHRcblx0dmFyIHdyaXRlQmxvYj1mdW5jdGlvbih2YWx1ZSxwb3MpIHtcblx0XHRkYnVmLndyaXRlKERULmJsb2IscG9zLDEsJ3V0ZjgnKTtcblx0XHR2YWx1ZS5jb3B5KGRidWYsIHBvcysxKTtcblx0XHR2YXIgd3JpdHRlbj12YWx1ZS5sZW5ndGgrMTtcblx0XHRpZiAocG9zK3dyaXR0ZW4+Y3VyKSBjdXI9cG9zK3dyaXR0ZW47XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cdFx0XG5cdC8qIG5vIHNpZ25hdHVyZSAqL1xuXHR2YXIgd3JpdGVGaXhlZEFycmF5ID0gZnVuY3Rpb24odmFsdWUscG9zLHVuaXRzaXplKSB7XG5cdFx0Ly9jb25zb2xlLmxvZygndi5sZW4nLHZhbHVlLmxlbmd0aCxpdGVtcy5sZW5ndGgsdW5pdHNpemUpO1xuXHRcdGlmICh1bml0c2l6ZT09PTEpIHZhciBmdW5jPWRidWYud3JpdGVVSW50ODtcblx0XHRlbHNlIGlmICh1bml0c2l6ZT09PTQpdmFyIGZ1bmM9ZGJ1Zi53cml0ZUludDMyQkU7XG5cdFx0ZWxzZSB0aHJvdyAndW5zdXBwb3J0ZWQgaW50ZWdlciBzaXplJztcblx0XHRpZiAoIXZhbHVlLmxlbmd0aCkge1xuXHRcdFx0dGhyb3cgXCJlbXB0eSBmaXhlZCBhcnJheSBcIitrZXlfd3JpdGluZztcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGggOyBpKyspIHtcblx0XHRcdGZ1bmMuYXBwbHkoZGJ1ZixbdmFsdWVbaV0saSp1bml0c2l6ZStwb3NdKVxuXHRcdH1cblx0XHR2YXIgbGVuPXVuaXRzaXplKnZhbHVlLmxlbmd0aDtcblx0XHRpZiAocG9zK2xlbj5jdXIpIGN1cj1wb3MrbGVuO1xuXHRcdHJldHVybiBsZW47XG5cdH1cblxuXHR0aGlzLndyaXRlSTMyPXdyaXRlSTMyO1xuXHR0aGlzLndyaXRlQm9vbD13cml0ZUJvb2w7XG5cdHRoaXMud3JpdGVCbG9iPXdyaXRlQmxvYjtcblx0dGhpcy53cml0ZVVJOD13cml0ZVVJODtcblx0dGhpcy53cml0ZVN0cmluZz13cml0ZVN0cmluZztcblx0dGhpcy53cml0ZVNpZ25hdHVyZT13cml0ZVNpZ25hdHVyZTtcblx0dGhpcy53cml0ZU9mZnNldD13cml0ZU9mZnNldDsgLy81IGJ5dGVzIG9mZnNldFxuXHR0aGlzLndyaXRlU3RyaW5nQXJyYXk9d3JpdGVTdHJpbmdBcnJheTtcblx0dGhpcy53cml0ZUZpeGVkQXJyYXk9d3JpdGVGaXhlZEFycmF5O1xuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywgXCJidWZcIiwge2dldCA6IGZ1bmN0aW9uKCl7IHJldHVybiBkYnVmOyB9fSk7XG5cdFxuXHRyZXR1cm4gdGhpcztcbn1cblxudmFyIENyZWF0ZT1mdW5jdGlvbihwYXRoLG9wdHMpIHtcblx0b3B0cz1vcHRzfHx7fTtcblx0dmFyIGtmcz1uZXcgS2ZzKHBhdGgsb3B0cyk7XG5cdHZhciBjdXI9MDtcblxuXHR2YXIgaGFuZGxlPXt9O1xuXHRcblx0Ly9ubyBzaWduYXR1cmVcblx0dmFyIHdyaXRlVkludCA9ZnVuY3Rpb24oYXJyKSB7XG5cdFx0dmFyIG89cGFja19pbnQoYXJyLGZhbHNlKTtcblx0XHRrZnMud3JpdGVGaXhlZEFycmF5KG8sY3VyLDEpO1xuXHRcdGN1cis9by5sZW5ndGg7XG5cdH1cblx0dmFyIHdyaXRlVkludDE9ZnVuY3Rpb24odmFsdWUpIHtcblx0XHR3cml0ZVZJbnQoW3ZhbHVlXSk7XG5cdH1cblx0Ly9mb3IgcG9zdGluZ3Ncblx0dmFyIHdyaXRlUEludCA9ZnVuY3Rpb24oYXJyKSB7XG5cdFx0dmFyIG89cGFja19pbnQoYXJyLHRydWUpO1xuXHRcdGtmcy53cml0ZUZpeGVkQXJyYXkobyxjdXIsMSk7XG5cdFx0Y3VyKz1vLmxlbmd0aDtcblx0fVxuXHRcblx0dmFyIHNhdmVWSW50ID0gZnVuY3Rpb24oYXJyLGtleSkge1xuXHRcdHZhciBzdGFydD1jdXI7XG5cdFx0a2V5X3dyaXRpbmc9a2V5O1xuXHRcdGN1cis9a2ZzLndyaXRlU2lnbmF0dXJlKERULnZpbnQsY3VyKTtcblx0XHR3cml0ZVZJbnQoYXJyKTtcblx0XHR2YXIgd3JpdHRlbiA9IGN1ci1zdGFydDtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XHRcdFxuXHR9XG5cdHZhciBzYXZlUEludCA9IGZ1bmN0aW9uKGFycixrZXkpIHtcblx0XHR2YXIgc3RhcnQ9Y3VyO1xuXHRcdGtleV93cml0aW5nPWtleTtcblx0XHRjdXIrPWtmcy53cml0ZVNpZ25hdHVyZShEVC5waW50LGN1cik7XG5cdFx0d3JpdGVQSW50KGFycik7XG5cdFx0dmFyIHdyaXR0ZW4gPSBjdXItc3RhcnQ7XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1x0XG5cdH1cblxuXHRcblx0dmFyIHNhdmVVSTggPSBmdW5jdGlvbih2YWx1ZSxrZXkpIHtcblx0XHR2YXIgd3JpdHRlbj1rZnMud3JpdGVVSTgodmFsdWUsY3VyKTtcblx0XHRjdXIrPXdyaXR0ZW47XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XG5cdHZhciBzYXZlQm9vbD1mdW5jdGlvbih2YWx1ZSxrZXkpIHtcblx0XHR2YXIgd3JpdHRlbj1rZnMud3JpdGVCb29sKHZhbHVlLGN1cik7XG5cdFx0Y3VyKz13cml0dGVuO1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVxuXHR2YXIgc2F2ZUkzMiA9IGZ1bmN0aW9uKHZhbHVlLGtleSkge1xuXHRcdHZhciB3cml0dGVuPWtmcy53cml0ZUkzMih2YWx1ZSxjdXIpO1xuXHRcdGN1cis9d3JpdHRlbjtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cdFxuXHR2YXIgc2F2ZVN0cmluZyA9IGZ1bmN0aW9uKHZhbHVlLGtleSxlbmNvZGluZykge1xuXHRcdGVuY29kaW5nPWVuY29kaW5nfHxzdHJpbmdlbmNvZGluZztcblx0XHRrZXlfd3JpdGluZz1rZXk7XG5cdFx0dmFyIHdyaXR0ZW49a2ZzLndyaXRlU3RyaW5nKHZhbHVlLGN1cixlbmNvZGluZyk7XG5cdFx0Y3VyKz13cml0dGVuO1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVxuXHR2YXIgc2F2ZVN0cmluZ0FycmF5ID0gZnVuY3Rpb24oYXJyLGtleSxlbmNvZGluZykge1xuXHRcdGVuY29kaW5nPWVuY29kaW5nfHxzdHJpbmdlbmNvZGluZztcblx0XHRrZXlfd3JpdGluZz1rZXk7XG5cdFx0dHJ5IHtcblx0XHRcdHZhciB3cml0dGVuPWtmcy53cml0ZVN0cmluZ0FycmF5KGFycixjdXIsZW5jb2RpbmcpO1xuXHRcdH0gY2F0Y2goZSkge1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9XG5cdFx0Y3VyKz13cml0dGVuO1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVxuXHRcblx0dmFyIHNhdmVCbG9iID0gZnVuY3Rpb24odmFsdWUsa2V5KSB7XG5cdFx0a2V5X3dyaXRpbmc9a2V5O1xuXHRcdHZhciB3cml0dGVuPWtmcy53cml0ZUJsb2IodmFsdWUsY3VyKTtcblx0XHRjdXIrPXdyaXR0ZW47XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XG5cblx0dmFyIGZvbGRlcnM9W107XG5cdHZhciBwdXNoaXRlbT1mdW5jdGlvbihrZXksd3JpdHRlbikge1xuXHRcdHZhciBmb2xkZXI9Zm9sZGVyc1tmb2xkZXJzLmxlbmd0aC0xXTtcdFxuXHRcdGlmICghZm9sZGVyKSByZXR1cm4gO1xuXHRcdGZvbGRlci5pdGVtc2xlbmd0aC5wdXNoKHdyaXR0ZW4pO1xuXHRcdGlmIChrZXkpIHtcblx0XHRcdGlmICghZm9sZGVyLmtleXMpIHRocm93ICdjYW5ub3QgaGF2ZSBrZXkgaW4gYXJyYXknO1xuXHRcdFx0Zm9sZGVyLmtleXMucHVzaChrZXkpO1xuXHRcdH1cblx0fVx0XG5cdHZhciBvcGVuID0gZnVuY3Rpb24ob3B0KSB7XG5cdFx0dmFyIHN0YXJ0PWN1cjtcblx0XHR2YXIga2V5PW9wdC5rZXkgfHwgbnVsbDtcblx0XHR2YXIgdHlwZT1vcHQudHlwZXx8RFQuYXJyYXk7XG5cdFx0Y3VyKz1rZnMud3JpdGVTaWduYXR1cmUodHlwZSxjdXIpO1xuXHRcdGN1cis9a2ZzLndyaXRlT2Zmc2V0KDB4MCxjdXIpOyAvLyBwcmUtYWxsb2Mgc3BhY2UgZm9yIG9mZnNldFxuXHRcdHZhciBmb2xkZXI9e1xuXHRcdFx0dHlwZTp0eXBlLCBrZXk6a2V5LFxuXHRcdFx0c3RhcnQ6c3RhcnQsZGF0YXN0YXJ0OmN1cixcblx0XHRcdGl0ZW1zbGVuZ3RoOltdIH07XG5cdFx0aWYgKHR5cGU9PT1EVC5vYmplY3QpIGZvbGRlci5rZXlzPVtdO1xuXHRcdGZvbGRlcnMucHVzaChmb2xkZXIpO1xuXHR9XG5cdHZhciBvcGVuT2JqZWN0ID0gZnVuY3Rpb24oa2V5KSB7XG5cdFx0b3Blbih7dHlwZTpEVC5vYmplY3Qsa2V5OmtleX0pO1xuXHR9XG5cdHZhciBvcGVuQXJyYXkgPSBmdW5jdGlvbihrZXkpIHtcblx0XHRvcGVuKHt0eXBlOkRULmFycmF5LGtleTprZXl9KTtcblx0fVxuXHR2YXIgc2F2ZUludHM9ZnVuY3Rpb24oYXJyLGtleSxmdW5jKSB7XG5cdFx0ZnVuYy5hcHBseShoYW5kbGUsW2FycixrZXldKTtcblx0fVxuXHR2YXIgY2xvc2UgPSBmdW5jdGlvbihvcHQpIHtcblx0XHRpZiAoIWZvbGRlcnMubGVuZ3RoKSB0aHJvdyAnZW1wdHkgc3RhY2snO1xuXHRcdHZhciBmb2xkZXI9Zm9sZGVycy5wb3AoKTtcblx0XHQvL2p1bXAgdG8gbGVuZ3RocyBhbmQga2V5c1xuXHRcdGtmcy53cml0ZU9mZnNldCggY3VyLWZvbGRlci5kYXRhc3RhcnQsIGZvbGRlci5kYXRhc3RhcnQtNSk7XG5cdFx0dmFyIGl0ZW1jb3VudD1mb2xkZXIuaXRlbXNsZW5ndGgubGVuZ3RoO1xuXHRcdC8vc2F2ZSBsZW5ndGhzXG5cdFx0d3JpdGVWSW50MShpdGVtY291bnQpO1xuXHRcdHdyaXRlVkludChmb2xkZXIuaXRlbXNsZW5ndGgpO1xuXHRcdFxuXHRcdGlmIChmb2xkZXIudHlwZT09PURULm9iamVjdCkge1xuXHRcdFx0Ly91c2UgdXRmOCBmb3Iga2V5c1xuXHRcdFx0Y3VyKz1rZnMud3JpdGVTdHJpbmdBcnJheShmb2xkZXIua2V5cyxjdXIsJ3V0ZjgnKTtcblx0XHR9XG5cdFx0d3JpdHRlbj1jdXItZm9sZGVyLnN0YXJ0O1xuXHRcdHB1c2hpdGVtKGZvbGRlci5rZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cblx0XG5cdFxuXHR2YXIgc3RyaW5nZW5jb2Rpbmc9J3VjczInO1xuXHR2YXIgc3RyaW5nRW5jb2Rpbmc9ZnVuY3Rpb24obmV3ZW5jb2RpbmcpIHtcblx0XHRpZiAobmV3ZW5jb2RpbmcpIHN0cmluZ2VuY29kaW5nPW5ld2VuY29kaW5nO1xuXHRcdGVsc2UgcmV0dXJuIHN0cmluZ2VuY29kaW5nO1xuXHR9XG5cdFxuXHR2YXIgYWxsbnVtYmVyX2Zhc3Q9ZnVuY3Rpb24oYXJyKSB7XG5cdFx0aWYgKGFyci5sZW5ndGg8NSkgcmV0dXJuIGFsbG51bWJlcihhcnIpO1xuXHRcdGlmICh0eXBlb2YgYXJyWzBdPT0nbnVtYmVyJ1xuXHRcdCAgICAmJiBNYXRoLnJvdW5kKGFyclswXSk9PWFyclswXSAmJiBhcnJbMF0+PTApXG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0dmFyIGFsbHN0cmluZ19mYXN0PWZ1bmN0aW9uKGFycikge1xuXHRcdGlmIChhcnIubGVuZ3RoPDUpIHJldHVybiBhbGxzdHJpbmcoYXJyKTtcblx0XHRpZiAodHlwZW9mIGFyclswXT09J3N0cmluZycpIHJldHVybiB0cnVlO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVx0XG5cdHZhciBhbGxudW1iZXI9ZnVuY3Rpb24oYXJyKSB7XG5cdFx0Zm9yICh2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspIHtcblx0XHRcdGlmICh0eXBlb2YgYXJyW2ldIT09J251bWJlcicpIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0dmFyIGFsbHN0cmluZz1mdW5jdGlvbihhcnIpIHtcblx0XHRmb3IgKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKykge1xuXHRcdFx0aWYgKHR5cGVvZiBhcnJbaV0hPT0nc3RyaW5nJykgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHR2YXIgZ2V0RW5jb2Rpbmc9ZnVuY3Rpb24oa2V5LGVuY3MpIHtcblx0XHR2YXIgZW5jPWVuY3Nba2V5XTtcblx0XHRpZiAoIWVuYykgcmV0dXJuIG51bGw7XG5cdFx0aWYgKGVuYz09J2RlbHRhJyB8fCBlbmM9PSdwb3N0aW5nJykge1xuXHRcdFx0cmV0dXJuIHNhdmVQSW50O1xuXHRcdH0gZWxzZSBpZiAoZW5jPT1cInZhcmlhYmxlXCIpIHtcblx0XHRcdHJldHVybiBzYXZlVkludDtcblx0XHR9XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblx0dmFyIHNhdmU9ZnVuY3Rpb24oSixrZXksb3B0cykge1xuXHRcdG9wdHM9b3B0c3x8e307XG5cdFx0XG5cdFx0aWYgKHR5cGVvZiBKPT1cIm51bGxcIiB8fCB0eXBlb2YgSj09XCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dGhyb3cgJ2Nhbm5vdCBzYXZlIG51bGwgdmFsdWUgb2YgWycra2V5KyddIGZvbGRlcnMnK0pTT04uc3RyaW5naWZ5KGZvbGRlcnMpO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHR2YXIgdHlwZT1KLmNvbnN0cnVjdG9yLm5hbWU7XG5cdFx0aWYgKHR5cGU9PT0nT2JqZWN0Jykge1xuXHRcdFx0b3Blbk9iamVjdChrZXkpO1xuXHRcdFx0Zm9yICh2YXIgaSBpbiBKKSB7XG5cdFx0XHRcdHNhdmUoSltpXSxpLG9wdHMpO1xuXHRcdFx0XHRpZiAob3B0cy5hdXRvZGVsZXRlKSBkZWxldGUgSltpXTtcblx0XHRcdH1cblx0XHRcdGNsb3NlKCk7XG5cdFx0fSBlbHNlIGlmICh0eXBlPT09J0FycmF5Jykge1xuXHRcdFx0aWYgKGFsbG51bWJlcl9mYXN0KEopKSB7XG5cdFx0XHRcdGlmIChKLnNvcnRlZCkgeyAvL251bWJlciBhcnJheSBpcyBzb3J0ZWRcblx0XHRcdFx0XHRzYXZlSW50cyhKLGtleSxzYXZlUEludCk7XHQvL3Bvc3RpbmcgZGVsdGEgZm9ybWF0XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0c2F2ZUludHMoSixrZXksc2F2ZVZJbnQpO1x0XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSBpZiAoYWxsc3RyaW5nX2Zhc3QoSikpIHtcblx0XHRcdFx0c2F2ZVN0cmluZ0FycmF5KEosa2V5KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG9wZW5BcnJheShrZXkpO1xuXHRcdFx0XHRmb3IgKHZhciBpPTA7aTxKLmxlbmd0aDtpKyspIHtcblx0XHRcdFx0XHRzYXZlKEpbaV0sbnVsbCxvcHRzKTtcblx0XHRcdFx0XHRpZiAob3B0cy5hdXRvZGVsZXRlKSBkZWxldGUgSltpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRjbG9zZSgpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSBpZiAodHlwZT09PSdTdHJpbmcnKSB7XG5cdFx0XHRzYXZlU3RyaW5nKEosa2V5KTtcblx0XHR9IGVsc2UgaWYgKHR5cGU9PT0nTnVtYmVyJykge1xuXHRcdFx0aWYgKEo+PTAmJko8MjU2KSBzYXZlVUk4KEosa2V5KTtcblx0XHRcdGVsc2Ugc2F2ZUkzMihKLGtleSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlPT09J0Jvb2xlYW4nKSB7XG5cdFx0XHRzYXZlQm9vbChKLGtleSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlPT09J0J1ZmZlcicpIHtcblx0XHRcdHNhdmVCbG9iKEosa2V5KTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhyb3cgJ3Vuc3VwcG9ydGVkIHR5cGUgJyt0eXBlO1xuXHRcdH1cblx0fVxuXHRcblx0dmFyIGZyZWU9ZnVuY3Rpb24oKSB7XG5cdFx0d2hpbGUgKGZvbGRlcnMubGVuZ3RoKSBjbG9zZSgpO1xuXHRcdGtmcy5mcmVlKCk7XG5cdH1cblx0dmFyIGN1cnJlbnRzaXplPWZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBjdXI7XG5cdH1cblxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoaGFuZGxlLCBcInNpemVcIiwge2dldCA6IGZ1bmN0aW9uKCl7IHJldHVybiBjdXI7IH19KTtcblxuXHR2YXIgd3JpdGVGaWxlPWZ1bmN0aW9uKGZuLG9wdHMsY2IpIHtcblx0XHRpZiAodHlwZW9mIGZzPT1cInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR2YXIgZnM9b3B0cy5mc3x8cmVxdWlyZSgnZnMnKTtcdFxuXHRcdH1cblx0XHR2YXIgdG90YWxieXRlPWhhbmRsZS5jdXJyZW50c2l6ZSgpO1xuXHRcdHZhciB3cml0dGVuPTAsYmF0Y2g9MDtcblx0XHRcblx0XHRpZiAodHlwZW9mIGNiPT1cInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcblx0XHRcdGNiPW9wdHM7XG5cdFx0fVxuXHRcdG9wdHM9b3B0c3x8e307XG5cdFx0YmF0Y2hzaXplPW9wdHMuYmF0Y2hzaXplfHwxMDI0KjEwMjQqMTY7IC8vMTYgTUJcblxuXHRcdGlmIChmcy5leGlzdHNTeW5jKGZuKSkgZnMudW5saW5rU3luYyhmbik7XG5cblx0XHR2YXIgd3JpdGVDYj1mdW5jdGlvbih0b3RhbCx3cml0dGVuLGNiLG5leHQpIHtcblx0XHRcdHJldHVybiBmdW5jdGlvbihlcnIpIHtcblx0XHRcdFx0aWYgKGVycikgdGhyb3cgXCJ3cml0ZSBlcnJvclwiK2Vycjtcblx0XHRcdFx0Y2IodG90YWwsd3JpdHRlbik7XG5cdFx0XHRcdGJhdGNoKys7XG5cdFx0XHRcdG5leHQoKTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHR2YXIgbmV4dD1mdW5jdGlvbigpIHtcblx0XHRcdGlmIChiYXRjaDxiYXRjaGVzKSB7XG5cdFx0XHRcdHZhciBidWZzdGFydD1iYXRjaHNpemUqYmF0Y2g7XG5cdFx0XHRcdHZhciBidWZlbmQ9YnVmc3RhcnQrYmF0Y2hzaXplO1xuXHRcdFx0XHRpZiAoYnVmZW5kPnRvdGFsYnl0ZSkgYnVmZW5kPXRvdGFsYnl0ZTtcblx0XHRcdFx0dmFyIHNsaWNlZD1rZnMuYnVmLnNsaWNlKGJ1ZnN0YXJ0LGJ1ZmVuZCk7XG5cdFx0XHRcdHdyaXR0ZW4rPXNsaWNlZC5sZW5ndGg7XG5cdFx0XHRcdGZzLmFwcGVuZEZpbGUoZm4sc2xpY2VkLHdyaXRlQ2IodG90YWxieXRlLHdyaXR0ZW4sIGNiLG5leHQpKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0dmFyIGJhdGNoZXM9MStNYXRoLmZsb29yKGhhbmRsZS5zaXplL2JhdGNoc2l6ZSk7XG5cdFx0bmV4dCgpO1xuXHR9XG5cdGhhbmRsZS5mcmVlPWZyZWU7XG5cdGhhbmRsZS5zYXZlSTMyPXNhdmVJMzI7XG5cdGhhbmRsZS5zYXZlVUk4PXNhdmVVSTg7XG5cdGhhbmRsZS5zYXZlQm9vbD1zYXZlQm9vbDtcblx0aGFuZGxlLnNhdmVTdHJpbmc9c2F2ZVN0cmluZztcblx0aGFuZGxlLnNhdmVWSW50PXNhdmVWSW50O1xuXHRoYW5kbGUuc2F2ZVBJbnQ9c2F2ZVBJbnQ7XG5cdGhhbmRsZS5zYXZlSW50cz1zYXZlSW50cztcblx0aGFuZGxlLnNhdmVCbG9iPXNhdmVCbG9iO1xuXHRoYW5kbGUuc2F2ZT1zYXZlO1xuXHRoYW5kbGUub3BlbkFycmF5PW9wZW5BcnJheTtcblx0aGFuZGxlLm9wZW5PYmplY3Q9b3Blbk9iamVjdDtcblx0aGFuZGxlLnN0cmluZ0VuY29kaW5nPXN0cmluZ0VuY29kaW5nO1xuXHQvL3RoaXMuaW50ZWdlckVuY29kaW5nPWludGVnZXJFbmNvZGluZztcblx0aGFuZGxlLmNsb3NlPWNsb3NlO1xuXHRoYW5kbGUud3JpdGVGaWxlPXdyaXRlRmlsZTtcblx0aGFuZGxlLmN1cnJlbnRzaXplPWN1cnJlbnRzaXplO1xuXHRyZXR1cm4gaGFuZGxlO1xufVxuXG5tb2R1bGUuZXhwb3J0cz1DcmVhdGU7IiwiLypcbiAgVE9ET1xuICBhbmQgbm90XG5cbiovXG5cbi8vIGh0dHA6Ly9qc2ZpZGRsZS5uZXQvbmVvc3dmL2FYeld3L1xudmFyIHBsaXN0PXJlcXVpcmUoJy4vcGxpc3QnKTtcbmZ1bmN0aW9uIGludGVyc2VjdChJLCBKKSB7XG4gIHZhciBpID0gaiA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICB3aGlsZSggaSA8IEkubGVuZ3RoICYmIGogPCBKLmxlbmd0aCApe1xuICAgICBpZiAgICAgIChJW2ldIDwgSltqXSkgaSsrOyBcbiAgICAgZWxzZSBpZiAoSVtpXSA+IEpbal0pIGorKzsgXG4gICAgIGVsc2Uge1xuICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1sW2ldO1xuICAgICAgIGkrKztqKys7XG4gICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiByZXR1cm4gYWxsIGl0ZW1zIGluIEkgYnV0IG5vdCBpbiBKICovXG5mdW5jdGlvbiBzdWJ0cmFjdChJLCBKKSB7XG4gIHZhciBpID0gaiA9IDA7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICB3aGlsZSggaSA8IEkubGVuZ3RoICYmIGogPCBKLmxlbmd0aCApe1xuICAgIGlmIChJW2ldPT1KW2pdKSB7XG4gICAgICBpKys7aisrO1xuICAgIH0gZWxzZSBpZiAoSVtpXTxKW2pdKSB7XG4gICAgICB3aGlsZSAoSVtpXTxKW2pdKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF09IElbaSsrXTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUoSltqXTxJW2ldKSBqKys7XG4gICAgfVxuICB9XG5cbiAgaWYgKGo9PUoubGVuZ3RoKSB7XG4gICAgd2hpbGUgKGk8SS5sZW5ndGgpIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1JW2krK107XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG52YXIgdW5pb249ZnVuY3Rpb24oYSxiKSB7XG5cdGlmICghYSB8fCAhYS5sZW5ndGgpIHJldHVybiBiO1xuXHRpZiAoIWIgfHwgIWIubGVuZ3RoKSByZXR1cm4gYTtcbiAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgdmFyIGFpID0gMDtcbiAgICB2YXIgYmkgPSAwO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgIGlmICggYWkgPCBhLmxlbmd0aCAmJiBiaSA8IGIubGVuZ3RoKSB7XG4gICAgICAgICAgICBpZiAoYVthaV0gPCBiW2JpXSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1hW2FpXTtcbiAgICAgICAgICAgICAgICBhaSsrO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChhW2FpXSA+IGJbYmldKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPWJbYmldO1xuICAgICAgICAgICAgICAgIGJpKys7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1hW2FpXTtcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF09YltiaV07XG4gICAgICAgICAgICAgICAgYWkrKztcbiAgICAgICAgICAgICAgICBiaSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGFpIDwgYS5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgYS5zbGljZShhaSwgYS5sZW5ndGgpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2UgaWYgKGJpIDwgYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoLmFwcGx5KHJlc3VsdCwgYi5zbGljZShiaSwgYi5sZW5ndGgpKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn1cbnZhciBPUEVSQVRJT049eydpbmNsdWRlJzppbnRlcnNlY3QsICd1bmlvbic6dW5pb24sICdleGNsdWRlJzpzdWJ0cmFjdH07XG5cbnZhciBib29sU2VhcmNoPWZ1bmN0aW9uKG9wdHMpIHtcbiAgb3B0cz1vcHRzfHx7fTtcbiAgb3BzPW9wdHMub3B8fHRoaXMub3B0cy5vcDtcbiAgdGhpcy5kb2NzPVtdO1xuXHRpZiAoIXRoaXMucGhyYXNlcy5sZW5ndGgpIHJldHVybjtcblx0dmFyIHI9dGhpcy5waHJhc2VzWzBdLmRvY3M7XG4gIC8qIGlnbm9yZSBvcGVyYXRvciBvZiBmaXJzdCBwaHJhc2UgKi9cblx0Zm9yICh2YXIgaT0xO2k8dGhpcy5waHJhc2VzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgb3A9IG9wc1tpXSB8fCAndW5pb24nO1xuXHRcdHI9T1BFUkFUSU9OW29wXShyLHRoaXMucGhyYXNlc1tpXS5kb2NzKTtcblx0fVxuXHR0aGlzLmRvY3M9cGxpc3QudW5pcXVlKHIpO1xuXHRyZXR1cm4gdGhpcztcbn1cbm1vZHVsZS5leHBvcnRzPXtzZWFyY2g6Ym9vbFNlYXJjaH0iLCJhcmd1bWVudHNbNF1bXCIvVXNlcnMveXUva3NhbmEyMDE1L25vZGVfbW9kdWxlcy9rc2FuYS1kYXRhYmFzZS9ic2VhcmNoLmpzXCJdWzBdLmFwcGx5KGV4cG9ydHMsYXJndW1lbnRzKSIsInZhciBwbGlzdD1yZXF1aXJlKFwiLi9wbGlzdFwiKTtcblxudmFyIGdldFBocmFzZVdpZHRocz1mdW5jdGlvbiAoUSxwaHJhc2VpZCx2cG9zcykge1xuXHR2YXIgcmVzPVtdO1xuXHRmb3IgKHZhciBpIGluIHZwb3NzKSB7XG5cdFx0cmVzLnB1c2goZ2V0UGhyYXNlV2lkdGgoUSxwaHJhc2VpZCx2cG9zc1tpXSkpO1xuXHR9XG5cdHJldHVybiByZXM7XG59XG52YXIgZ2V0UGhyYXNlV2lkdGg9ZnVuY3Rpb24gKFEscGhyYXNlaWQsdnBvcykge1xuXHR2YXIgUD1RLnBocmFzZXNbcGhyYXNlaWRdO1xuXHR2YXIgd2lkdGg9MCx2YXJ3aWR0aD1mYWxzZTtcblx0aWYgKFAud2lkdGgpIHJldHVybiBQLndpZHRoOyAvLyBubyB3aWxkY2FyZFxuXHRpZiAoUC50ZXJtaWQubGVuZ3RoPDIpIHJldHVybiBQLnRlcm1sZW5ndGhbMF07XG5cdHZhciBsYXN0dGVybXBvc3Rpbmc9US50ZXJtc1tQLnRlcm1pZFtQLnRlcm1pZC5sZW5ndGgtMV1dLnBvc3Rpbmc7XG5cblx0Zm9yICh2YXIgaSBpbiBQLnRlcm1pZCkge1xuXHRcdHZhciBUPVEudGVybXNbUC50ZXJtaWRbaV1dO1xuXHRcdGlmIChULm9wPT0nd2lsZGNhcmQnKSB7XG5cdFx0XHR3aWR0aCs9VC53aWR0aDtcblx0XHRcdGlmIChULndpbGRjYXJkPT0nKicpIHZhcndpZHRoPXRydWU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHdpZHRoKz1QLnRlcm1sZW5ndGhbaV07XG5cdFx0fVxuXHR9XG5cdGlmICh2YXJ3aWR0aCkgeyAvL3dpZHRoIG1pZ2h0IGJlIHNtYWxsZXIgZHVlIHRvICogd2lsZGNhcmRcblx0XHR2YXIgYXQ9cGxpc3QuaW5kZXhPZlNvcnRlZChsYXN0dGVybXBvc3RpbmcsdnBvcyk7XG5cdFx0dmFyIGVuZHBvcz1sYXN0dGVybXBvc3RpbmdbYXRdO1xuXHRcdGlmIChlbmRwb3MtdnBvczx3aWR0aCkgd2lkdGg9ZW5kcG9zLXZwb3MrMTtcblx0fVxuXG5cdHJldHVybiB3aWR0aDtcbn1cbi8qIHJldHVybiBbdnBvcywgcGhyYXNlaWQsIHBocmFzZXdpZHRoLCBvcHRpb25hbF90YWduYW1lXSBieSBzbG90IHJhbmdlKi9cbnZhciBoaXRJblJhbmdlPWZ1bmN0aW9uKFEsc3RhcnR2cG9zLGVuZHZwb3MpIHtcblx0dmFyIHJlcz1bXTtcblx0aWYgKCFRIHx8ICFRLnJhd3Jlc3VsdCB8fCAhUS5yYXdyZXN1bHQubGVuZ3RoKSByZXR1cm4gcmVzO1xuXHRmb3IgKHZhciBpPTA7aTxRLnBocmFzZXMubGVuZ3RoO2krKykge1xuXHRcdHZhciBQPVEucGhyYXNlc1tpXTtcblx0XHRpZiAoIVAucG9zdGluZykgY29udGludWU7XG5cdFx0dmFyIHM9cGxpc3QuaW5kZXhPZlNvcnRlZChQLnBvc3Rpbmcsc3RhcnR2cG9zKTtcblx0XHR2YXIgZT1wbGlzdC5pbmRleE9mU29ydGVkKFAucG9zdGluZyxlbmR2cG9zKTtcblx0XHR2YXIgcj1QLnBvc3Rpbmcuc2xpY2UocyxlKzEpO1xuXHRcdHZhciB3aWR0aD1nZXRQaHJhc2VXaWR0aHMoUSxpLHIpO1xuXG5cdFx0cmVzPXJlcy5jb25jYXQoci5tYXAoZnVuY3Rpb24odnBvcyxpZHgpeyByZXR1cm4gW3Zwb3Msd2lkdGhbaWR4XSxpXSB9KSk7XG5cdH1cblx0Ly8gb3JkZXIgYnkgdnBvcywgaWYgdnBvcyBpcyB0aGUgc2FtZSwgbGFyZ2VyIHdpZHRoIGNvbWUgZmlyc3QuXG5cdC8vIHNvIHRoZSBvdXRwdXQgd2lsbCBiZVxuXHQvLyA8dGFnMT48dGFnMj5vbmU8L3RhZzI+dHdvPC90YWcxPlxuXHQvL1RPRE8sIG1pZ2h0IGNhdXNlIG92ZXJsYXAgaWYgc2FtZSB2cG9zIGFuZCBzYW1lIHdpZHRoXG5cdC8vbmVlZCB0byBjaGVjayB0YWcgbmFtZVxuXHRyZXMuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhWzBdPT1iWzBdPyBiWzFdLWFbMV0gOmFbMF0tYlswXX0pO1xuXG5cdHJldHVybiByZXM7XG59XG5cbnZhciB0YWdzSW5SYW5nZT1mdW5jdGlvbihRLHJlbmRlclRhZ3Msc3RhcnR2cG9zLGVuZHZwb3MpIHtcblx0dmFyIHJlcz1bXTtcblx0aWYgKHR5cGVvZiByZW5kZXJUYWdzPT1cInN0cmluZ1wiKSByZW5kZXJUYWdzPVtyZW5kZXJUYWdzXTtcblxuXHRyZW5kZXJUYWdzLm1hcChmdW5jdGlvbih0YWcpe1xuXHRcdHZhciBzdGFydHM9US5lbmdpbmUuZ2V0KFtcImZpZWxkc1wiLHRhZytcIl9zdGFydFwiXSk7XG5cdFx0dmFyIGVuZHM9US5lbmdpbmUuZ2V0KFtcImZpZWxkc1wiLHRhZytcIl9lbmRcIl0pO1xuXHRcdGlmICghc3RhcnRzKSByZXR1cm47XG5cblx0XHR2YXIgcz1wbGlzdC5pbmRleE9mU29ydGVkKHN0YXJ0cyxzdGFydHZwb3MpO1xuXHRcdHZhciBlPXM7XG5cdFx0d2hpbGUgKGU8c3RhcnRzLmxlbmd0aCAmJiBzdGFydHNbZV08ZW5kdnBvcykgZSsrO1xuXHRcdHZhciBvcGVudGFncz1zdGFydHMuc2xpY2UocyxlKTtcblxuXHRcdHM9cGxpc3QuaW5kZXhPZlNvcnRlZChlbmRzLHN0YXJ0dnBvcyk7XG5cdFx0ZT1zO1xuXHRcdHdoaWxlIChlPGVuZHMubGVuZ3RoICYmIGVuZHNbZV08ZW5kdnBvcykgZSsrO1xuXHRcdHZhciBjbG9zZXRhZ3M9ZW5kcy5zbGljZShzLGUpO1xuXG5cdFx0b3BlbnRhZ3MubWFwKGZ1bmN0aW9uKHN0YXJ0LGlkeCkge1xuXHRcdFx0cmVzLnB1c2goW3N0YXJ0LGNsb3NldGFnc1tpZHhdLXN0YXJ0LHRhZ10pO1xuXHRcdH0pXG5cdH0pO1xuXHQvLyBvcmRlciBieSB2cG9zLCBpZiB2cG9zIGlzIHRoZSBzYW1lLCBsYXJnZXIgd2lkdGggY29tZSBmaXJzdC5cblx0cmVzLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXT09YlswXT8gYlsxXS1hWzFdIDphWzBdLWJbMF19KTtcblxuXHRyZXR1cm4gcmVzO1xufVxuXG4vKlxuZ2l2ZW4gYSB2cG9zIHJhbmdlIHN0YXJ0LCBmaWxlLCBjb252ZXJ0IHRvIGZpbGVzdGFydCwgZmlsZWVuZFxuICAgZmlsZXN0YXJ0IDogc3RhcnRpbmcgZmlsZVxuICAgc3RhcnQgICA6IHZwb3Mgc3RhcnRcbiAgIHNob3dmaWxlOiBob3cgbWFueSBmaWxlcyB0byBkaXNwbGF5XG4gICBzaG93cGFnZTogaG93IG1hbnkgcGFnZXMgdG8gZGlzcGxheVxuXG5vdXRwdXQ6XG4gICBhcnJheSBvZiBmaWxlaWQgd2l0aCBoaXRzXG4qL1xudmFyIGdldEZpbGVXaXRoSGl0cz1mdW5jdGlvbihlbmdpbmUsUSxyYW5nZSkge1xuXHR2YXIgZmlsZU9mZnNldHM9ZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHR2YXIgb3V0PVtdLGZpbGVjb3VudD0xMDA7XG5cdHZhciBzdGFydD0wICwgZW5kPVEuYnlGaWxlLmxlbmd0aDtcblx0US5leGNlcnB0T3ZlcmZsb3c9ZmFsc2U7XG5cdGlmIChyYW5nZS5zdGFydCkge1xuXHRcdHZhciBmaXJzdD1yYW5nZS5zdGFydCA7XG5cdFx0dmFyIGxhc3Q9cmFuZ2UuZW5kO1xuXHRcdGlmICghbGFzdCkgbGFzdD1OdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblx0XHRmb3IgKHZhciBpPTA7aTxmaWxlT2Zmc2V0cy5sZW5ndGg7aSsrKSB7XG5cdFx0XHQvL2lmIChmaWxlT2Zmc2V0c1tpXT5maXJzdCkgYnJlYWs7XG5cdFx0XHRpZiAoZmlsZU9mZnNldHNbaV0+bGFzdCkge1xuXHRcdFx0XHRlbmQ9aTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAoZmlsZU9mZnNldHNbaV08Zmlyc3QpIHN0YXJ0PWk7XG5cdFx0fVx0XHRcblx0fSBlbHNlIHtcblx0XHRzdGFydD1yYW5nZS5maWxlc3RhcnQgfHwgMDtcblx0XHRpZiAocmFuZ2UubWF4ZmlsZSkge1xuXHRcdFx0ZmlsZWNvdW50PXJhbmdlLm1heGZpbGU7XG5cdFx0fSBlbHNlIGlmIChyYW5nZS5zaG93cGFnZSkge1xuXHRcdFx0dGhyb3cgXCJub3QgaW1wbGVtZW50IHlldFwiXG5cdFx0fVxuXHR9XG5cblx0dmFyIGZpbGVXaXRoSGl0cz1bXSx0b3RhbGhpdD0wO1xuXHRyYW5nZS5tYXhoaXQ9cmFuZ2UubWF4aGl0fHwxMDAwO1xuXG5cdGZvciAodmFyIGk9c3RhcnQ7aTxlbmQ7aSsrKSB7XG5cdFx0aWYoUS5ieUZpbGVbaV0ubGVuZ3RoPjApIHtcblx0XHRcdHRvdGFsaGl0Kz1RLmJ5RmlsZVtpXS5sZW5ndGg7XG5cdFx0XHRmaWxlV2l0aEhpdHMucHVzaChpKTtcblx0XHRcdHJhbmdlLm5leHRGaWxlU3RhcnQ9aTtcblx0XHRcdGlmIChmaWxlV2l0aEhpdHMubGVuZ3RoPj1maWxlY291bnQpIHtcblx0XHRcdFx0US5leGNlcnB0T3ZlcmZsb3c9dHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0XHRpZiAodG90YWxoaXQ+cmFuZ2UubWF4aGl0KSB7XG5cdFx0XHRcdFEuZXhjZXJwdE92ZXJmbG93PXRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRpZiAoaT49ZW5kKSB7IC8vbm8gbW9yZSBmaWxlXG5cdFx0US5leGNlcnB0U3RvcD10cnVlO1xuXHR9XG5cdHJldHVybiBmaWxlV2l0aEhpdHM7XG59XG52YXIgcmVzdWx0bGlzdD1mdW5jdGlvbihlbmdpbmUsUSxvcHRzLGNiKSB7XG5cdHZhciBvdXRwdXQ9W107XG5cdGlmICghUS5yYXdyZXN1bHQgfHwgIVEucmF3cmVzdWx0Lmxlbmd0aCkge1xuXHRcdGNiKG91dHB1dCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0aWYgKG9wdHMucmFuZ2UpIHtcblx0XHRpZiAob3B0cy5yYW5nZS5tYXhoaXQgJiYgIW9wdHMucmFuZ2UubWF4ZmlsZSkge1xuXHRcdFx0b3B0cy5yYW5nZS5tYXhmaWxlPW9wdHMucmFuZ2UubWF4aGl0O1xuXHRcdFx0b3B0cy5yYW5nZS5tYXhwYWdlPW9wdHMucmFuZ2UubWF4aGl0O1xuXHRcdH1cblx0XHRpZiAoIW9wdHMucmFuZ2UubWF4cGFnZSkgb3B0cy5yYW5nZS5tYXhwYWdlPTEwMDtcblx0XHRpZiAoIW9wdHMucmFuZ2UuZW5kKSB7XG5cdFx0XHRvcHRzLnJhbmdlLmVuZD1OdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblx0XHR9XG5cdH1cblx0dmFyIGZpbGVXaXRoSGl0cz1nZXRGaWxlV2l0aEhpdHMoZW5naW5lLFEsb3B0cy5yYW5nZSk7XG5cdGlmICghZmlsZVdpdGhIaXRzLmxlbmd0aCkge1xuXHRcdGNiKG91dHB1dCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cblx0dmFyIG91dHB1dD1bXSxmaWxlcz1bXTsvL3RlbXBvcmFyeSBob2xkZXIgZm9yIHBhZ2VuYW1lc1xuXHRmb3IgKHZhciBpPTA7aTxmaWxlV2l0aEhpdHMubGVuZ3RoO2krKykge1xuXHRcdHZhciBuZmlsZT1maWxlV2l0aEhpdHNbaV07XG5cdFx0dmFyIHBhZ2VPZmZzZXRzPWVuZ2luZS5nZXRGaWxlUGFnZU9mZnNldHMobmZpbGUpO1xuXHRcdHZhciBwYWdlTmFtZXM9ZW5naW5lLmdldEZpbGVQYWdlTmFtZXMobmZpbGUpO1xuXHRcdGZpbGVzW25maWxlXT17cGFnZU9mZnNldHM6cGFnZU9mZnNldHN9O1xuXHRcdHZhciBwYWdld2l0aGhpdD1wbGlzdC5ncm91cGJ5cG9zdGluZzIoUS5ieUZpbGVbIG5maWxlIF0sICBwYWdlT2Zmc2V0cyk7XG5cdFx0Ly9pZiAocGFnZU9mZnNldHNbMF09PTEpXG5cdFx0Ly9wYWdld2l0aGhpdC5zaGlmdCgpOyAvL3RoZSBmaXJzdCBpdGVtIGlzIG5vdCB1c2VkICgwflEuYnlGaWxlWzBdIClcblxuXHRcdGZvciAodmFyIGo9MDsgajxwYWdld2l0aGhpdC5sZW5ndGg7aisrKSB7XG5cdFx0XHRpZiAoIXBhZ2V3aXRoaGl0W2pdLmxlbmd0aCkgY29udGludWU7XG5cdFx0XHQvL3ZhciBvZmZzZXRzPXBhZ2V3aXRoaGl0W2pdLm1hcChmdW5jdGlvbihwKXtyZXR1cm4gcC0gZmlsZU9mZnNldHNbaV19KTtcblx0XHRcdGlmIChwYWdlT2Zmc2V0c1tqXT5vcHRzLnJhbmdlLmVuZCkgYnJlYWs7XG5cdFx0XHRvdXRwdXQucHVzaCggIHtmaWxlOiBuZmlsZSwgcGFnZTpqLCAgcGFnZW5hbWU6cGFnZU5hbWVzW2pdfSk7XG5cdFx0XHRpZiAob3V0cHV0Lmxlbmd0aD5vcHRzLnJhbmdlLm1heHBhZ2UpIGJyZWFrO1xuXHRcdH1cblx0fVxuXG5cdHZhciBwYWdlcGF0aHM9b3V0cHV0Lm1hcChmdW5jdGlvbihwKXtcblx0XHRyZXR1cm4gW1wiZmlsZUNvbnRlbnRzXCIscC5maWxlLHAucGFnZV07XG5cdH0pO1xuXHQvL3ByZXBhcmUgdGhlIHRleHRcblx0ZW5naW5lLmdldChwYWdlcGF0aHMsZnVuY3Rpb24ocGFnZXMpe1xuXHRcdHZhciBzZXE9MDtcblx0XHRpZiAocGFnZXMpIGZvciAodmFyIGk9MDtpPHBhZ2VzLmxlbmd0aDtpKyspIHtcblx0XHRcdHZhciBzdGFydHZwb3M9ZmlsZXNbb3V0cHV0W2ldLmZpbGVdLnBhZ2VPZmZzZXRzW291dHB1dFtpXS5wYWdlLTFdO1xuXHRcdFx0dmFyIGVuZHZwb3M9ZmlsZXNbb3V0cHV0W2ldLmZpbGVdLnBhZ2VPZmZzZXRzW291dHB1dFtpXS5wYWdlXTtcblx0XHRcdHZhciBobD17fTtcblxuXHRcdFx0aWYgKG9wdHMucmFuZ2UgJiYgb3B0cy5yYW5nZS5zdGFydCAgKSB7XG5cdFx0XHRcdGlmICggc3RhcnR2cG9zPG9wdHMucmFuZ2Uuc3RhcnQpIHN0YXJ0dnBvcz1vcHRzLnJhbmdlLnN0YXJ0O1xuXHRcdFx0Ly9cdGlmIChlbmR2cG9zPm9wdHMucmFuZ2UuZW5kKSBlbmR2cG9zPW9wdHMucmFuZ2UuZW5kO1xuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAob3B0cy5ub2hpZ2hsaWdodCkge1xuXHRcdFx0XHRobC50ZXh0PXBhZ2VzW2ldO1xuXHRcdFx0XHRobC5oaXRzPWhpdEluUmFuZ2UoUSxzdGFydHZwb3MsZW5kdnBvcyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgbz17bm9jcmxmOnRydWUsbm9zcGFuOnRydWUsXG5cdFx0XHRcdFx0dGV4dDpwYWdlc1tpXSxzdGFydHZwb3M6c3RhcnR2cG9zLCBlbmR2cG9zOiBlbmR2cG9zLCBcblx0XHRcdFx0XHRROlEsZnVsbHRleHQ6b3B0cy5mdWxsdGV4dH07XG5cdFx0XHRcdGhsPWhpZ2hsaWdodChRLG8pO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGhsLnRleHQpIHtcblx0XHRcdFx0b3V0cHV0W2ldLnRleHQ9aGwudGV4dDtcblx0XHRcdFx0b3V0cHV0W2ldLmhpdHM9aGwuaGl0cztcblx0XHRcdFx0b3V0cHV0W2ldLnNlcT1zZXE7XG5cdFx0XHRcdHNlcSs9aGwuaGl0cy5sZW5ndGg7XG5cblx0XHRcdFx0b3V0cHV0W2ldLnN0YXJ0PXN0YXJ0dnBvcztcdFx0XHRcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3V0cHV0W2ldPW51bGw7IC8vcmVtb3ZlIGl0ZW0gdnBvcyBsZXNzIHRoYW4gb3B0cy5yYW5nZS5zdGFydFxuXHRcdFx0fVxuXHRcdH0gXG5cdFx0b3V0cHV0PW91dHB1dC5maWx0ZXIoZnVuY3Rpb24obyl7cmV0dXJuIG8hPW51bGx9KTtcblx0XHRjYihvdXRwdXQpO1xuXHR9KTtcbn1cbnZhciBpbmplY3RUYWc9ZnVuY3Rpb24oUSxvcHRzKXtcblx0dmFyIGhpdHM9b3B0cy5oaXRzO1xuXHR2YXIgdGFncz1vcHRzLnRhZ3M7XG5cdGlmICghdGFncykgdGFncz1bXTtcblx0dmFyIGhpdGNsYXNzPW9wdHMuaGl0Y2xhc3N8fCdobCc7XG5cdHZhciBvdXRwdXQ9JycsTz1bXSxqPTAsaz0wO1xuXHR2YXIgc3Vycm91bmQ9b3B0cy5zdXJyb3VuZHx8NTtcblxuXHR2YXIgdG9rZW5zPVEudG9rZW5pemUob3B0cy50ZXh0KS50b2tlbnM7XG5cdHZhciB2cG9zPW9wdHMudnBvcztcblx0dmFyIGk9MCxwcmV2aW5yYW5nZT0hIW9wdHMuZnVsbHRleHQgLGlucmFuZ2U9ISFvcHRzLmZ1bGx0ZXh0O1xuXHR2YXIgaGl0c3RhcnQ9MCxoaXRlbmQ9MCx0YWdzdGFydD0wLHRhZ2VuZD0wLHRhZ2NsYXNzPVwiXCI7XG5cdHdoaWxlIChpPHRva2Vucy5sZW5ndGgpIHtcblx0XHR2YXIgc2tpcD1RLmlzU2tpcCh0b2tlbnNbaV0pO1xuXHRcdHZhciBoYXNoaXQ9ZmFsc2U7XG5cdFx0aW5yYW5nZT1vcHRzLmZ1bGx0ZXh0IHx8IChqPGhpdHMubGVuZ3RoICYmIHZwb3Mrc3Vycm91bmQ+PWhpdHNbal1bMF0gfHxcblx0XHRcdFx0KGo+MCAmJiBqPD1oaXRzLmxlbmd0aCAmJiAgaGl0c1tqLTFdWzBdK3N1cnJvdW5kKjI+PXZwb3MpKTtcdFxuXG5cdFx0aWYgKHByZXZpbnJhbmdlIT1pbnJhbmdlKSB7XG5cdFx0XHRvdXRwdXQrPW9wdHMuYWJyaWRnZXx8XCIuLi5cIjtcblx0XHR9XG5cdFx0cHJldmlucmFuZ2U9aW5yYW5nZTtcblx0XHR2YXIgdG9rZW49dG9rZW5zW2ldO1xuXHRcdGlmIChvcHRzLm5vY3JsZiAmJiB0b2tlbj09XCJcXG5cIikgdG9rZW49XCJcIjtcblxuXHRcdGlmIChpbnJhbmdlICYmIGk8dG9rZW5zLmxlbmd0aCkge1xuXHRcdFx0aWYgKHNraXApIHtcblx0XHRcdFx0b3V0cHV0Kz10b2tlbjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBjbGFzc2VzPVwiXCI7XHRcblxuXHRcdFx0XHQvL2NoZWNrIGhpdFxuXHRcdFx0XHRpZiAoajxoaXRzLmxlbmd0aCAmJiB2cG9zPT1oaXRzW2pdWzBdKSB7XG5cdFx0XHRcdFx0dmFyIG5waHJhc2U9aGl0c1tqXVsyXSAlIDEwLCB3aWR0aD1oaXRzW2pdWzFdO1xuXHRcdFx0XHRcdGhpdHN0YXJ0PWhpdHNbal1bMF07XG5cdFx0XHRcdFx0aGl0ZW5kPWhpdHN0YXJ0K3dpZHRoO1xuXHRcdFx0XHRcdGorKztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdC8vY2hlY2sgdGFnXG5cdFx0XHRcdGlmIChrPHRhZ3MubGVuZ3RoICYmIHZwb3M9PXRhZ3Nba11bMF0pIHtcblx0XHRcdFx0XHR2YXIgd2lkdGg9dGFnc1trXVsxXTtcblx0XHRcdFx0XHR0YWdzdGFydD10YWdzW2tdWzBdO1xuXHRcdFx0XHRcdHRhZ2VuZD10YWdzdGFydCt3aWR0aDtcblx0XHRcdFx0XHR0YWdjbGFzcz10YWdzW2tdWzJdO1xuXHRcdFx0XHRcdGsrKztcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICh2cG9zPj1oaXRzdGFydCAmJiB2cG9zPGhpdGVuZCkgY2xhc3Nlcz1oaXRjbGFzcytcIiBcIitoaXRjbGFzcytucGhyYXNlO1xuXHRcdFx0XHRpZiAodnBvcz49dGFnc3RhcnQgJiYgdnBvczx0YWdlbmQpIGNsYXNzZXMrPVwiIFwiK3RhZ2NsYXNzO1xuXG5cdFx0XHRcdGlmIChjbGFzc2VzIHx8ICFvcHRzLm5vc3Bhbikge1xuXHRcdFx0XHRcdG91dHB1dCs9JzxzcGFuIHZwb3M9XCInK3Zwb3MrJ1wiJztcblx0XHRcdFx0XHRpZiAoY2xhc3NlcykgY2xhc3Nlcz0nIGNsYXNzPVwiJytjbGFzc2VzKydcIic7XG5cdFx0XHRcdFx0b3V0cHV0Kz1jbGFzc2VzKyc+Jztcblx0XHRcdFx0XHRvdXRwdXQrPXRva2VuKyc8L3NwYW4+Jztcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRvdXRwdXQrPXRva2VuO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGlmICghc2tpcCkgdnBvcysrO1xuXHRcdGkrKzsgXG5cdH1cblxuXHRPLnB1c2gob3V0cHV0KTtcblx0b3V0cHV0PVwiXCI7XG5cblx0cmV0dXJuIE8uam9pbihcIlwiKTtcbn1cbnZhciBoaWdobGlnaHQ9ZnVuY3Rpb24oUSxvcHRzKSB7XG5cdGlmICghb3B0cy50ZXh0KSByZXR1cm4ge3RleHQ6XCJcIixoaXRzOltdfTtcblx0dmFyIG9wdD17dGV4dDpvcHRzLnRleHQsXG5cdFx0aGl0czpudWxsLGFicmlkZ2U6b3B0cy5hYnJpZGdlLHZwb3M6b3B0cy5zdGFydHZwb3MsXG5cdFx0ZnVsbHRleHQ6b3B0cy5mdWxsdGV4dCxyZW5kZXJUYWdzOm9wdHMucmVuZGVyVGFncyxub3NwYW46b3B0cy5ub3NwYW4sbm9jcmxmOm9wdHMubm9jcmxmLFxuXHR9O1xuXG5cdG9wdC5oaXRzPWhpdEluUmFuZ2Uob3B0cy5RLG9wdHMuc3RhcnR2cG9zLG9wdHMuZW5kdnBvcyk7XG5cdHJldHVybiB7dGV4dDppbmplY3RUYWcoUSxvcHQpLGhpdHM6b3B0LmhpdHN9O1xufVxuXG52YXIgZ2V0UGFnZT1mdW5jdGlvbihlbmdpbmUsZmlsZWlkLHBhZ2VpZCxjYikge1xuXHR2YXIgZmlsZU9mZnNldHM9ZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHR2YXIgcGFnZXBhdGhzPVtcImZpbGVDb250ZW50c1wiLGZpbGVpZCxwYWdlaWRdO1xuXHR2YXIgcGFnZW5hbWVzPWVuZ2luZS5nZXRGaWxlUGFnZU5hbWVzKGZpbGVpZCk7XG5cblx0ZW5naW5lLmdldChwYWdlcGF0aHMsZnVuY3Rpb24odGV4dCl7XG5cdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW3t0ZXh0OnRleHQsZmlsZTpmaWxlaWQscGFnZTpwYWdlaWQscGFnZW5hbWU6cGFnZW5hbWVzW3BhZ2VpZF19XSk7XG5cdH0pO1xufVxuXG52YXIgZ2V0UGFnZVN5bmM9ZnVuY3Rpb24oZW5naW5lLGZpbGVpZCxwYWdlaWQpIHtcblx0dmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0dmFyIHBhZ2VwYXRocz1bXCJmaWxlQ29udGVudHNcIixmaWxlaWQscGFnZWlkXTtcblx0dmFyIHBhZ2VuYW1lcz1lbmdpbmUuZ2V0RmlsZVBhZ2VOYW1lcyhmaWxlaWQpO1xuXG5cdHZhciB0ZXh0PWVuZ2luZS5nZXQocGFnZXBhdGhzKTtcblx0cmV0dXJuIHt0ZXh0OnRleHQsZmlsZTpmaWxlaWQscGFnZTpwYWdlaWQscGFnZW5hbWU6cGFnZW5hbWVzW3BhZ2VpZF19O1xufVxuXG52YXIgZ2V0UmFuZ2U9ZnVuY3Rpb24oZW5naW5lLHN0YXJ0LGVuZCxjYikge1xuXHR2YXIgZmlsZU9mZnNldHM9ZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHQvL3ZhciBwYWdlcGF0aHM9W1wiZmlsZUNvbnRlbnRzXCIsXTtcblx0Ly9maW5kIGZpcnN0IHBhZ2UgYW5kIGxhc3QgcGFnZVxuXHQvL2NyZWF0ZSBnZXQgcGF0aHNcblxufVxuXG52YXIgZ2V0RmlsZT1mdW5jdGlvbihlbmdpbmUsZmlsZWlkLGNiKSB7XG5cdHZhciBmaWxlbmFtZT1lbmdpbmUuZ2V0KFwiZmlsZU5hbWVzXCIpW2ZpbGVpZF07XG5cdHZhciBwYWdlbmFtZXM9ZW5naW5lLmdldEZpbGVQYWdlTmFtZXMoZmlsZWlkKTtcblx0dmFyIGZpbGVzdGFydD1lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIilbZmlsZWlkXTtcblx0dmFyIG9mZnNldHM9ZW5naW5lLmdldEZpbGVQYWdlT2Zmc2V0cyhmaWxlaWQpO1xuXHR2YXIgcGM9MDtcblx0ZW5naW5lLmdldChbXCJmaWxlQ29udGVudHNcIixmaWxlaWRdLHRydWUsZnVuY3Rpb24oZGF0YSl7XG5cdFx0dmFyIHRleHQ9ZGF0YS5tYXAoZnVuY3Rpb24odCxpZHgpIHtcblx0XHRcdGlmIChpZHg9PTApIHJldHVybiBcIlwiOyBcblx0XHRcdHZhciBwYj0nPHBiIG49XCInK3BhZ2VuYW1lc1tpZHhdKydcIj48L3BiPic7XG5cdFx0XHRyZXR1cm4gcGIrdDtcblx0XHR9KTtcblx0XHRjYih7dGV4dHM6ZGF0YSx0ZXh0OnRleHQuam9pbihcIlwiKSxwYWdlbmFtZXM6cGFnZW5hbWVzLGZpbGVzdGFydDpmaWxlc3RhcnQsb2Zmc2V0czpvZmZzZXRzLGZpbGU6ZmlsZWlkLGZpbGVuYW1lOmZpbGVuYW1lfSk7IC8vZm9yY2UgZGlmZmVyZW50IHRva2VuXG5cdH0pO1xufVxuXG52YXIgaGlnaGxpZ2h0UmFuZ2U9ZnVuY3Rpb24oUSxzdGFydHZwb3MsZW5kdnBvcyxvcHRzLGNiKXtcblx0Ly9ub3QgaW1wbGVtZW50IHlldFxufVxuXG52YXIgaGlnaGxpZ2h0RmlsZT1mdW5jdGlvbihRLGZpbGVpZCxvcHRzLGNiKSB7XG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XG5cdFx0Y2I9b3B0cztcblx0fVxuXG5cdGlmICghUSB8fCAhUS5lbmdpbmUpIHJldHVybiBjYihudWxsKTtcblxuXHR2YXIgcGFnZU9mZnNldHM9US5lbmdpbmUuZ2V0RmlsZVBhZ2VPZmZzZXRzKGZpbGVpZCk7XG5cdHZhciBvdXRwdXQ9W107XHRcblx0Ly9jb25zb2xlLmxvZyhzdGFydHZwb3MsZW5kdnBvcylcblx0US5lbmdpbmUuZ2V0KFtcImZpbGVDb250ZW50c1wiLGZpbGVpZF0sdHJ1ZSxmdW5jdGlvbihkYXRhKXtcblx0XHRpZiAoIWRhdGEpIHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoXCJ3cm9uZyBmaWxlIGlkXCIsZmlsZWlkKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICh2YXIgaT0wO2k8ZGF0YS5sZW5ndGgtMTtpKysgKXtcblx0XHRcdFx0dmFyIHN0YXJ0dnBvcz1wYWdlT2Zmc2V0c1tpXTtcblx0XHRcdFx0dmFyIGVuZHZwb3M9cGFnZU9mZnNldHNbaSsxXTtcblx0XHRcdFx0dmFyIHBhZ2VuYW1lcz1RLmVuZ2luZS5nZXRGaWxlUGFnZU5hbWVzKGZpbGVpZCk7XG5cdFx0XHRcdHZhciBwYWdlPWdldFBhZ2VTeW5jKFEuZW5naW5lLCBmaWxlaWQsaSsxKTtcblx0XHRcdFx0XHR2YXIgb3B0PXt0ZXh0OnBhZ2UudGV4dCxoaXRzOm51bGwsdGFnOidobCcsdnBvczpzdGFydHZwb3MsXG5cdFx0XHRcdFx0ZnVsbHRleHQ6dHJ1ZSxub3NwYW46b3B0cy5ub3NwYW4sbm9jcmxmOm9wdHMubm9jcmxmfTtcblx0XHRcdFx0dmFyIHBhZ2VuYW1lPXBhZ2VuYW1lc1tpKzFdO1xuXHRcdFx0XHRvcHQuaGl0cz1oaXRJblJhbmdlKFEsc3RhcnR2cG9zLGVuZHZwb3MpO1xuXHRcdFx0XHR2YXIgcGI9JzxwYiBuPVwiJytwYWdlbmFtZSsnXCI+PC9wYj4nO1xuXHRcdFx0XHR2YXIgd2l0aHRhZz1pbmplY3RUYWcoUSxvcHQpO1xuXHRcdFx0XHRvdXRwdXQucHVzaChwYit3aXRodGFnKTtcblx0XHRcdH1cdFx0XHRcblx0XHR9XG5cblx0XHRjYi5hcHBseShRLmVuZ2luZS5jb250ZXh0LFt7dGV4dDpvdXRwdXQuam9pbihcIlwiKSxmaWxlOmZpbGVpZH1dKTtcblx0fSlcbn1cbnZhciBoaWdobGlnaHRQYWdlPWZ1bmN0aW9uKFEsZmlsZWlkLHBhZ2VpZCxvcHRzLGNiKSB7XG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XG5cdFx0Y2I9b3B0cztcblx0fVxuXG5cdGlmICghUSB8fCAhUS5lbmdpbmUpIHJldHVybiBjYihudWxsKTtcblx0dmFyIHBhZ2VPZmZzZXRzPVEuZW5naW5lLmdldEZpbGVQYWdlT2Zmc2V0cyhmaWxlaWQpO1xuXHR2YXIgc3RhcnR2cG9zPXBhZ2VPZmZzZXRzW3BhZ2VpZC0xXTtcblx0dmFyIGVuZHZwb3M9cGFnZU9mZnNldHNbcGFnZWlkXTtcblx0dmFyIHBhZ2VuYW1lcz1RLmVuZ2luZS5nZXRGaWxlUGFnZU5hbWVzKGZpbGVpZCk7XG5cblx0dGhpcy5nZXRQYWdlKFEuZW5naW5lLGZpbGVpZCxwYWdlaWQsZnVuY3Rpb24ocmVzKXtcblx0XHR2YXIgb3B0PXt0ZXh0OnJlcy50ZXh0LGhpdHM6bnVsbCx2cG9zOnN0YXJ0dnBvcyxmdWxsdGV4dDp0cnVlLFxuXHRcdFx0bm9zcGFuOm9wdHMubm9zcGFuLG5vY3JsZjpvcHRzLm5vY3JsZn07XG5cdFx0b3B0LmhpdHM9aGl0SW5SYW5nZShRLHN0YXJ0dnBvcyxlbmR2cG9zKTtcblx0XHRpZiAob3B0cy5yZW5kZXJUYWdzKSB7XG5cdFx0XHRvcHQudGFncz10YWdzSW5SYW5nZShRLG9wdHMucmVuZGVyVGFncyxzdGFydHZwb3MsZW5kdnBvcyk7XG5cdFx0fVxuXG5cdFx0dmFyIHBhZ2VuYW1lPXBhZ2VuYW1lc1twYWdlaWRdO1xuXHRcdGNiLmFwcGx5KFEuZW5naW5lLmNvbnRleHQsW3t0ZXh0OmluamVjdFRhZyhRLG9wdCkscGFnZTpwYWdlaWQsZmlsZTpmaWxlaWQsaGl0czpvcHQuaGl0cyxwYWdlbmFtZTpwYWdlbmFtZX1dKTtcblx0fSk7XG59XG5tb2R1bGUuZXhwb3J0cz17cmVzdWx0bGlzdDpyZXN1bHRsaXN0LCBcblx0aGl0SW5SYW5nZTpoaXRJblJhbmdlLCBcblx0aGlnaGxpZ2h0UGFnZTpoaWdobGlnaHRQYWdlLFxuXHRnZXRQYWdlOmdldFBhZ2UsXG5cdGhpZ2hsaWdodEZpbGU6aGlnaGxpZ2h0RmlsZSxcblx0Z2V0RmlsZTpnZXRGaWxlXG5cdC8vaGlnaGxpZ2h0UmFuZ2U6aGlnaGxpZ2h0UmFuZ2UsXG4gIC8vZ2V0UmFuZ2U6Z2V0UmFuZ2UsXG59OyIsIi8qXG4gIEtzYW5hIFNlYXJjaCBFbmdpbmUuXG5cbiAgbmVlZCBhIEtERSBpbnN0YW5jZSB0byBiZSBmdW5jdGlvbmFsXG4gIFxuKi9cbnZhciBic2VhcmNoPXJlcXVpcmUoXCIuL2JzZWFyY2hcIik7XG52YXIgZG9zZWFyY2g9cmVxdWlyZShcIi4vc2VhcmNoXCIpO1xuXG52YXIgcHJlcGFyZUVuZ2luZUZvclNlYXJjaD1mdW5jdGlvbihlbmdpbmUsY2Ipe1xuXHRpZiAoZW5naW5lLmFuYWx5emVyKXJldHVybjtcblx0dmFyIGFuYWx5emVyPXJlcXVpcmUoXCJrc2FuYS1hbmFseXplclwiKTtcblx0dmFyIGNvbmZpZz1lbmdpbmUuZ2V0KFwibWV0YVwiKS5jb25maWc7XG5cdGVuZ2luZS5hbmFseXplcj1hbmFseXplci5nZXRBUEkoY29uZmlnKTtcblx0ZW5naW5lLmdldChbW1widG9rZW5zXCJdLFtcInBvc3RpbmdzTGVuZ3RoXCJdXSxmdW5jdGlvbigpe1xuXHRcdGNiKCk7XG5cdH0pO1xufVxudmFyIF9zZWFyY2g9ZnVuY3Rpb24oZW5naW5lLHEsb3B0cyxjYixjb250ZXh0KSB7XG5cdGlmICh0eXBlb2YgZW5naW5lPT1cInN0cmluZ1wiKSB7Ly9icm93c2VyIG9ubHlcblx0XHR2YXIga2RlPXJlcXVpcmUoXCJrc2FuYS1kYXRhYmFzZVwiKTtcblx0XHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikgeyAvL3VzZXIgZGlkbid0IHN1cHBseSBvcHRpb25zXG5cdFx0XHRpZiAodHlwZW9mIGNiPT1cIm9iamVjdFwiKWNvbnRleHQ9Y2I7XG5cdFx0XHRjYj1vcHRzO1xuXHRcdFx0b3B0cz17fTtcblx0XHR9XG5cdFx0b3B0cy5xPXE7XG5cdFx0b3B0cy5kYmlkPWVuZ2luZTtcblx0XHRrZGUub3BlbihvcHRzLmRiaWQsZnVuY3Rpb24oZXJyLGRiKXtcblx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0Y2IoZXJyKTtcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fVxuXHRcdFx0Y29uc29sZS5sb2coXCJvcGVuZWRcIixvcHRzLmRiaWQpXG5cdFx0XHRwcmVwYXJlRW5naW5lRm9yU2VhcmNoKGRiLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdHJldHVybiBkb3NlYXJjaChkYixxLG9wdHMsY2IpO1x0XG5cdFx0XHR9KTtcblx0XHR9LGNvbnRleHQpO1xuXHR9IGVsc2Uge1xuXHRcdHByZXBhcmVFbmdpbmVGb3JTZWFyY2goZW5naW5lLGZ1bmN0aW9uKCl7XG5cdFx0XHRyZXR1cm4gZG9zZWFyY2goZW5naW5lLHEsb3B0cyxjYik7XHRcblx0XHR9KTtcblx0fVxufVxuXG52YXIgX2hpZ2hsaWdodFBhZ2U9ZnVuY3Rpb24oZW5naW5lLGZpbGVpZCxwYWdlaWQsb3B0cyxjYil7XG5cdGlmICghb3B0cy5xKSBvcHRzLnE9XCJcIjsgXG5cdF9zZWFyY2goZW5naW5lLG9wdHMucSxvcHRzLGZ1bmN0aW9uKFEpe1xuXHRcdGFwaS5leGNlcnB0LmhpZ2hsaWdodFBhZ2UoUSxmaWxlaWQscGFnZWlkLG9wdHMsY2IpO1xuXHR9KTtcdFxufVxudmFyIF9oaWdobGlnaHRSYW5nZT1mdW5jdGlvbihlbmdpbmUsc3RhcnQsZW5kLG9wdHMsY2Ipe1xuXG5cdGlmIChvcHRzLnEpIHtcblx0XHRfc2VhcmNoKGVuZ2luZSxvcHRzLnEsb3B0cyxmdW5jdGlvbihRKXtcblx0XHRcdGFwaS5leGNlcnB0LmhpZ2hsaWdodFJhbmdlKFEsc3RhcnQsZW5kLG9wdHMsY2IpO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHByZXBhcmVFbmdpbmVGb3JTZWFyY2goZW5naW5lLGZ1bmN0aW9uKCl7XG5cdFx0XHRhcGkuZXhjZXJwdC5nZXRSYW5nZShlbmdpbmUsc3RhcnQsZW5kLGNiKTtcblx0XHR9KTtcblx0fVxufVxudmFyIF9oaWdobGlnaHRGaWxlPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaWQsb3B0cyxjYil7XG5cdGlmICghb3B0cy5xKSBvcHRzLnE9XCJcIjsgXG5cdF9zZWFyY2goZW5naW5lLG9wdHMucSxvcHRzLGZ1bmN0aW9uKFEpe1xuXHRcdGFwaS5leGNlcnB0LmhpZ2hsaWdodEZpbGUoUSxmaWxlaWQsb3B0cyxjYik7XG5cdH0pO1xuXHQvKlxuXHR9IGVsc2Uge1xuXHRcdGFwaS5leGNlcnB0LmdldEZpbGUoZW5naW5lLGZpbGVpZCxmdW5jdGlvbihkYXRhKSB7XG5cdFx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbZGF0YV0pO1xuXHRcdH0pO1xuXHR9XG5cdCovXG59XG5cbnZhciB2cG9zMmZpbGVwYWdlPWZ1bmN0aW9uKGVuZ2luZSx2cG9zKSB7XG4gICAgdmFyIHBhZ2VPZmZzZXRzPWVuZ2luZS5nZXQoXCJwYWdlT2Zmc2V0c1wiKTtcbiAgICB2YXIgZmlsZU9mZnNldHM9ZW5naW5lLmdldChbXCJmaWxlT2Zmc2V0c1wiXSk7XG4gICAgdmFyIHBhZ2VOYW1lcz1lbmdpbmUuZ2V0KFwicGFnZU5hbWVzXCIpO1xuICAgIHZhciBmaWxlaWQ9YnNlYXJjaChmaWxlT2Zmc2V0cyx2cG9zKzEsdHJ1ZSk7XG4gICAgZmlsZWlkLS07XG4gICAgdmFyIHBhZ2VpZD1ic2VhcmNoKHBhZ2VPZmZzZXRzLHZwb3MrMSx0cnVlKTtcblx0dmFyIHJhbmdlPWVuZ2luZS5nZXRGaWxlUmFuZ2UoZmlsZWlkKTtcblx0cGFnZWlkLT1yYW5nZS5zdGFydDtcbiAgICByZXR1cm4ge2ZpbGU6ZmlsZWlkLHBhZ2U6cGFnZWlkfTtcbn1cbnZhciBhcGk9e1xuXHRzZWFyY2g6X3NlYXJjaFxuLy9cdCxjb25jb3JkYW5jZTpyZXF1aXJlKFwiLi9jb25jb3JkYW5jZVwiKVxuLy9cdCxyZWdleDpyZXF1aXJlKFwiLi9yZWdleFwiKVxuXHQsaGlnaGxpZ2h0UGFnZTpfaGlnaGxpZ2h0UGFnZVxuXHQsaGlnaGxpZ2h0RmlsZTpfaGlnaGxpZ2h0RmlsZVxuLy9cdCxoaWdobGlnaHRSYW5nZTpfaGlnaGxpZ2h0UmFuZ2Vcblx0LGV4Y2VycHQ6cmVxdWlyZShcIi4vZXhjZXJwdFwiKVxuXHQsdnBvczJmaWxlcGFnZTp2cG9zMmZpbGVwYWdlXG59XG5tb2R1bGUuZXhwb3J0cz1hcGk7IiwiXG52YXIgdW5wYWNrID0gZnVuY3Rpb24gKGFyKSB7IC8vIHVucGFjayB2YXJpYWJsZSBsZW5ndGggaW50ZWdlciBsaXN0XG4gIHZhciByID0gW10sXG4gIGkgPSAwLFxuICB2ID0gMDtcbiAgZG8ge1xuXHR2YXIgc2hpZnQgPSAwO1xuXHRkbyB7XG5cdCAgdiArPSAoKGFyW2ldICYgMHg3RikgPDwgc2hpZnQpO1xuXHQgIHNoaWZ0ICs9IDc7XG5cdH0gd2hpbGUgKGFyWysraV0gJiAweDgwKTtcblx0cltyLmxlbmd0aF09djtcbiAgfSB3aGlsZSAoaSA8IGFyLmxlbmd0aCk7XG4gIHJldHVybiByO1xufVxuXG4vKlxuICAgYXJyOiAgWzEsMSwxLDEsMSwxLDEsMSwxXVxuICAgbGV2ZWxzOiBbMCwxLDEsMiwyLDAsMSwyXVxuICAgb3V0cHV0OiBbNSwxLDMsMSwxLDMsMSwxXVxuKi9cblxudmFyIGdyb3Vwc3VtPWZ1bmN0aW9uKGFycixsZXZlbHMpIHtcbiAgaWYgKGFyci5sZW5ndGghPWxldmVscy5sZW5ndGgrMSkgcmV0dXJuIG51bGw7XG4gIHZhciBzdGFjaz1bXTtcbiAgdmFyIG91dHB1dD1uZXcgQXJyYXkobGV2ZWxzLmxlbmd0aCk7XG4gIGZvciAodmFyIGk9MDtpPGxldmVscy5sZW5ndGg7aSsrKSBvdXRwdXRbaV09MDtcbiAgZm9yICh2YXIgaT0xO2k8YXJyLmxlbmd0aDtpKyspIHsgLy9maXJzdCBvbmUgb3V0IG9mIHRvYyBzY29wZSwgaWdub3JlZFxuICAgIGlmIChzdGFjay5sZW5ndGg+bGV2ZWxzW2ktMV0pIHtcbiAgICAgIHdoaWxlIChzdGFjay5sZW5ndGg+bGV2ZWxzW2ktMV0pIHN0YWNrLnBvcCgpO1xuICAgIH1cbiAgICBzdGFjay5wdXNoKGktMSk7XG4gICAgZm9yICh2YXIgaj0wO2o8c3RhY2subGVuZ3RoO2orKykge1xuICAgICAgb3V0cHV0W3N0YWNrW2pdXSs9YXJyW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufVxuLyogYXJyPSAxICwgMiAsIDMgLDQgLDUsNiw3IC8vdG9rZW4gcG9zdGluZ1xuICBwb3N0aW5nPSAzICwgNSAgLy90YWcgcG9zdGluZ1xuICBvdXQgPSAzICwgMiwgMlxuKi9cbnZhciBjb3VudGJ5cG9zdGluZyA9IGZ1bmN0aW9uIChhcnIsIHBvc3RpbmcpIHtcbiAgaWYgKCFwb3N0aW5nLmxlbmd0aCkgcmV0dXJuIFthcnIubGVuZ3RoXTtcbiAgdmFyIG91dD1bXTtcbiAgZm9yICh2YXIgaT0wO2k8cG9zdGluZy5sZW5ndGg7aSsrKSBvdXRbaV09MDtcbiAgb3V0W3Bvc3RpbmcubGVuZ3RoXT0wO1xuICB2YXIgcD0wLGk9MCxsYXN0aT0wO1xuICB3aGlsZSAoaTxhcnIubGVuZ3RoICYmIHA8cG9zdGluZy5sZW5ndGgpIHtcbiAgICBpZiAoYXJyW2ldPD1wb3N0aW5nW3BdKSB7XG4gICAgICB3aGlsZSAocDxwb3N0aW5nLmxlbmd0aCAmJiBpPGFyci5sZW5ndGggJiYgYXJyW2ldPD1wb3N0aW5nW3BdKSB7XG4gICAgICAgIG91dFtwXSsrO1xuICAgICAgICBpKys7XG4gICAgICB9ICAgICAgXG4gICAgfSBcbiAgICBwKys7XG4gIH1cbiAgb3V0W3Bvc3RpbmcubGVuZ3RoXSA9IGFyci5sZW5ndGgtaTsgLy9yZW1haW5pbmdcbiAgcmV0dXJuIG91dDtcbn1cblxudmFyIGdyb3VwYnlwb3N0aW5nPWZ1bmN0aW9uKGFycixncG9zdGluZykgeyAvL3JlbGF0aXZlIHZwb3NcbiAgaWYgKCFncG9zdGluZy5sZW5ndGgpIHJldHVybiBbYXJyLmxlbmd0aF07XG4gIHZhciBvdXQ9W107XG4gIGZvciAodmFyIGk9MDtpPD1ncG9zdGluZy5sZW5ndGg7aSsrKSBvdXRbaV09W107XG4gIFxuICB2YXIgcD0wLGk9MCxsYXN0aT0wO1xuICB3aGlsZSAoaTxhcnIubGVuZ3RoICYmIHA8Z3Bvc3RpbmcubGVuZ3RoKSB7XG4gICAgaWYgKGFycltpXTxncG9zdGluZ1twXSkge1xuICAgICAgd2hpbGUgKHA8Z3Bvc3RpbmcubGVuZ3RoICYmIGk8YXJyLmxlbmd0aCAmJiBhcnJbaV08Z3Bvc3RpbmdbcF0pIHtcbiAgICAgICAgdmFyIHN0YXJ0PTA7XG4gICAgICAgIGlmIChwPjApIHN0YXJ0PWdwb3N0aW5nW3AtMV07XG4gICAgICAgIG91dFtwXS5wdXNoKGFycltpKytdLXN0YXJ0KTsgIC8vIHJlbGF0aXZlXG4gICAgICB9ICAgICAgXG4gICAgfSBcbiAgICBwKys7XG4gIH1cbiAgLy9yZW1haW5pbmdcbiAgd2hpbGUoaTxhcnIubGVuZ3RoKSBvdXRbb3V0Lmxlbmd0aC0xXS5wdXNoKGFycltpKytdLWdwb3N0aW5nW2dwb3N0aW5nLmxlbmd0aC0xXSk7XG4gIHJldHVybiBvdXQ7XG59XG52YXIgZ3JvdXBieXBvc3RpbmcyPWZ1bmN0aW9uKGFycixncG9zdGluZykgeyAvL2Fic29sdXRlIHZwb3NcbiAgaWYgKCFhcnIgfHwgIWFyci5sZW5ndGgpIHJldHVybiBbXTtcbiAgaWYgKCFncG9zdGluZy5sZW5ndGgpIHJldHVybiBbYXJyLmxlbmd0aF07XG4gIHZhciBvdXQ9W107XG4gIGZvciAodmFyIGk9MDtpPD1ncG9zdGluZy5sZW5ndGg7aSsrKSBvdXRbaV09W107XG4gIFxuICB2YXIgcD0wLGk9MCxsYXN0aT0wO1xuICB3aGlsZSAoaTxhcnIubGVuZ3RoICYmIHA8Z3Bvc3RpbmcubGVuZ3RoKSB7XG4gICAgaWYgKGFycltpXTxncG9zdGluZ1twXSkge1xuICAgICAgd2hpbGUgKHA8Z3Bvc3RpbmcubGVuZ3RoICYmIGk8YXJyLmxlbmd0aCAmJiBhcnJbaV08Z3Bvc3RpbmdbcF0pIHtcbiAgICAgICAgdmFyIHN0YXJ0PTA7XG4gICAgICAgIGlmIChwPjApIHN0YXJ0PWdwb3N0aW5nW3AtMV07IC8vYWJzb2x1dGVcbiAgICAgICAgb3V0W3BdLnB1c2goYXJyW2krK10pO1xuICAgICAgfSAgICAgIFxuICAgIH0gXG4gICAgcCsrO1xuICB9XG4gIC8vcmVtYWluaW5nXG4gIHdoaWxlKGk8YXJyLmxlbmd0aCkgb3V0W291dC5sZW5ndGgtMV0ucHVzaChhcnJbaSsrXS1ncG9zdGluZ1tncG9zdGluZy5sZW5ndGgtMV0pO1xuICByZXR1cm4gb3V0O1xufVxudmFyIGdyb3VwYnlibG9jazIgPSBmdW5jdGlvbihhciwgbnRva2VuLHNsb3RzaGlmdCxvcHRzKSB7XG4gIGlmICghYXIubGVuZ3RoKSByZXR1cm4gW3t9LHt9XTtcbiAgXG4gIHNsb3RzaGlmdCA9IHNsb3RzaGlmdCB8fCAxNjtcbiAgdmFyIGcgPSBNYXRoLnBvdygyLHNsb3RzaGlmdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHIgPSB7fSwgbnRva2Vucz17fTtcbiAgdmFyIGdyb3VwY291bnQ9MDtcbiAgZG8ge1xuICAgIHZhciBncm91cCA9IE1hdGguZmxvb3IoYXJbaV0gLyBnKSA7XG4gICAgaWYgKCFyW2dyb3VwXSkge1xuICAgICAgcltncm91cF0gPSBbXTtcbiAgICAgIG50b2tlbnNbZ3JvdXBdPVtdO1xuICAgICAgZ3JvdXBjb3VudCsrO1xuICAgIH1cbiAgICByW2dyb3VwXS5wdXNoKGFyW2ldICUgZyk7XG4gICAgbnRva2Vuc1tncm91cF0ucHVzaChudG9rZW5baV0pO1xuICAgIGkrKztcbiAgfSB3aGlsZSAoaSA8IGFyLmxlbmd0aCk7XG4gIGlmIChvcHRzKSBvcHRzLmdyb3VwY291bnQ9Z3JvdXBjb3VudDtcbiAgcmV0dXJuIFtyLG50b2tlbnNdO1xufVxudmFyIGdyb3VwYnlzbG90ID0gZnVuY3Rpb24gKGFyLCBzbG90c2hpZnQsIG9wdHMpIHtcbiAgaWYgKCFhci5sZW5ndGgpXG5cdHJldHVybiB7fTtcbiAgXG4gIHNsb3RzaGlmdCA9IHNsb3RzaGlmdCB8fCAxNjtcbiAgdmFyIGcgPSBNYXRoLnBvdygyLHNsb3RzaGlmdCk7XG4gIHZhciBpID0gMDtcbiAgdmFyIHIgPSB7fTtcbiAgdmFyIGdyb3VwY291bnQ9MDtcbiAgZG8ge1xuXHR2YXIgZ3JvdXAgPSBNYXRoLmZsb29yKGFyW2ldIC8gZykgO1xuXHRpZiAoIXJbZ3JvdXBdKSB7XG5cdCAgcltncm91cF0gPSBbXTtcblx0ICBncm91cGNvdW50Kys7XG5cdH1cblx0cltncm91cF0ucHVzaChhcltpXSAlIGcpO1xuXHRpKys7XG4gIH0gd2hpbGUgKGkgPCBhci5sZW5ndGgpO1xuICBpZiAob3B0cykgb3B0cy5ncm91cGNvdW50PWdyb3VwY291bnQ7XG4gIHJldHVybiByO1xufVxuLypcbnZhciBpZGVudGl0eSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWU7XG59O1xudmFyIHNvcnRlZEluZGV4ID0gZnVuY3Rpb24gKGFycmF5LCBvYmosIGl0ZXJhdG9yKSB7IC8vdGFrZW4gZnJvbSB1bmRlcnNjb3JlXG4gIGl0ZXJhdG9yIHx8IChpdGVyYXRvciA9IGlkZW50aXR5KTtcbiAgdmFyIGxvdyA9IDAsXG4gIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsb3cgPCBoaWdoKSB7XG5cdHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4gMTtcblx0aXRlcmF0b3IoYXJyYXlbbWlkXSkgPCBpdGVyYXRvcihvYmopID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gIH1cbiAgcmV0dXJuIGxvdztcbn07Ki9cblxudmFyIGluZGV4T2ZTb3J0ZWQgPSBmdW5jdGlvbiAoYXJyYXksIG9iaikgeyBcbiAgdmFyIGxvdyA9IDAsXG4gIGhpZ2ggPSBhcnJheS5sZW5ndGgtMTtcbiAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG4gICAgYXJyYXlbbWlkXSA8IG9iaiA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICB9XG4gIHJldHVybiBsb3c7XG59O1xudmFyIHBsaGVhZD1mdW5jdGlvbihwbCwgcGx0YWcsIG9wdHMpIHtcbiAgb3B0cz1vcHRzfHx7fTtcbiAgb3B0cy5tYXg9b3B0cy5tYXh8fDE7XG4gIHZhciBvdXQ9W107XG4gIGlmIChwbHRhZy5sZW5ndGg8cGwubGVuZ3RoKSB7XG4gICAgZm9yICh2YXIgaT0wO2k8cGx0YWcubGVuZ3RoO2krKykge1xuICAgICAgIGsgPSBpbmRleE9mU29ydGVkKHBsLCBwbHRhZ1tpXSk7XG4gICAgICAgaWYgKGs+LTEgJiYgazxwbC5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHBsW2tdPT1wbHRhZ1tpXSkge1xuICAgICAgICAgIG91dFtvdXQubGVuZ3RoXT1wbHRhZ1tpXTtcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aD49b3B0cy5tYXgpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAodmFyIGk9MDtpPHBsLmxlbmd0aDtpKyspIHtcbiAgICAgICBrID0gaW5kZXhPZlNvcnRlZChwbHRhZywgcGxbaV0pO1xuICAgICAgIGlmIChrPi0xICYmIGs8cGx0YWcubGVuZ3RoKSB7XG4gICAgICAgIGlmIChwbHRhZ1trXT09cGxbaV0pIHtcbiAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF09cGx0YWdba107XG4gICAgICAgICAgaWYgKG91dC5sZW5ndGg+PW9wdHMubWF4KSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gb3V0O1xufVxuLypcbiBwbDIgb2NjdXIgYWZ0ZXIgcGwxLCBcbiBwbDI+PXBsMSttaW5kaXNcbiBwbDI8PXBsMSttYXhkaXNcbiovXG52YXIgcGxmb2xsb3cyID0gZnVuY3Rpb24gKHBsMSwgcGwyLCBtaW5kaXMsIG1heGRpcykge1xuICB2YXIgciA9IFtdLGk9MDtcbiAgdmFyIHN3YXAgPSAwO1xuICBcbiAgd2hpbGUgKGk8cGwxLmxlbmd0aCl7XG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgbWluZGlzKTtcbiAgICB2YXIgdCA9IChwbDJba10gPj0gKHBsMVtpXSArbWluZGlzKSAmJiBwbDJba108PShwbDFbaV0rbWF4ZGlzKSkgPyBrIDogLTE7XG4gICAgaWYgKHQgPiAtMSkge1xuICAgICAgcltyLmxlbmd0aF09cGwxW2ldO1xuICAgICAgaSsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaz49cGwyLmxlbmd0aCkgYnJlYWs7XG4gICAgICB2YXIgazI9aW5kZXhPZlNvcnRlZCAocGwxLHBsMltrXS1tYXhkaXMpO1xuICAgICAgaWYgKGsyPmkpIHtcbiAgICAgICAgdmFyIHQgPSAocGwyW2tdID49IChwbDFbaV0gK21pbmRpcykgJiYgcGwyW2tdPD0ocGwxW2ldK21heGRpcykpID8gayA6IC0xO1xuICAgICAgICBpZiAodD4tMSkgcltyLmxlbmd0aF09cGwxW2syXTtcbiAgICAgICAgaT1rMjtcbiAgICAgIH0gZWxzZSBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG5cbnZhciBwbG5vdGZvbGxvdzIgPSBmdW5jdGlvbiAocGwxLCBwbDIsIG1pbmRpcywgbWF4ZGlzKSB7XG4gIHZhciByID0gW10saT0wO1xuICBcbiAgd2hpbGUgKGk8cGwxLmxlbmd0aCl7XG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgbWluZGlzKTtcbiAgICB2YXIgdCA9IChwbDJba10gPj0gKHBsMVtpXSArbWluZGlzKSAmJiBwbDJba108PShwbDFbaV0rbWF4ZGlzKSkgPyBrIDogLTE7XG4gICAgaWYgKHQgPiAtMSkge1xuICAgICAgaSsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaz49cGwyLmxlbmd0aCkge1xuICAgICAgICByPXIuY29uY2F0KHBsMS5zbGljZShpKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGsyPWluZGV4T2ZTb3J0ZWQgKHBsMSxwbDJba10tbWF4ZGlzKTtcbiAgICAgICAgaWYgKGsyPmkpIHtcbiAgICAgICAgICByPXIuY29uY2F0KHBsMS5zbGljZShpLGsyKSk7XG4gICAgICAgICAgaT1rMjtcbiAgICAgICAgfSBlbHNlIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cbi8qIHRoaXMgaXMgaW5jb3JyZWN0ICovXG52YXIgcGxmb2xsb3cgPSBmdW5jdGlvbiAocGwxLCBwbDIsIGRpc3RhbmNlKSB7XG4gIHZhciByID0gW10saT0wO1xuXG4gIHdoaWxlIChpPHBsMS5sZW5ndGgpe1xuICAgIHZhciBrID0gaW5kZXhPZlNvcnRlZChwbDIsIHBsMVtpXSArIGRpc3RhbmNlKTtcbiAgICB2YXIgdCA9IChwbDJba10gPT09IChwbDFbaV0gKyBkaXN0YW5jZSkpID8gayA6IC0xO1xuICAgIGlmICh0ID4gLTEpIHtcbiAgICAgIHIucHVzaChwbDFbaV0pO1xuICAgICAgaSsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaz49cGwyLmxlbmd0aCkgYnJlYWs7XG4gICAgICB2YXIgazI9aW5kZXhPZlNvcnRlZCAocGwxLHBsMltrXS1kaXN0YW5jZSk7XG4gICAgICBpZiAoazI+aSkge1xuICAgICAgICB0ID0gKHBsMltrXSA9PT0gKHBsMVtrMl0gKyBkaXN0YW5jZSkpID8gayA6IC0xO1xuICAgICAgICBpZiAodD4tMSkge1xuICAgICAgICAgICByLnB1c2gocGwxW2syXSk7XG4gICAgICAgICAgIGsyKys7XG4gICAgICAgIH1cbiAgICAgICAgaT1rMjtcbiAgICAgIH0gZWxzZSBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG52YXIgcGxub3Rmb2xsb3cgPSBmdW5jdGlvbiAocGwxLCBwbDIsIGRpc3RhbmNlKSB7XG4gIHZhciByID0gW107XG4gIHZhciByID0gW10saT0wO1xuICB2YXIgc3dhcCA9IDA7XG4gIFxuICB3aGlsZSAoaTxwbDEubGVuZ3RoKXtcbiAgICB2YXIgayA9IGluZGV4T2ZTb3J0ZWQocGwyLCBwbDFbaV0gKyBkaXN0YW5jZSk7XG4gICAgdmFyIHQgPSAocGwyW2tdID09PSAocGwxW2ldICsgZGlzdGFuY2UpKSA/IGsgOiAtMTtcbiAgICBpZiAodCA+IC0xKSB7IFxuICAgICAgaSsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoaz49cGwyLmxlbmd0aCkge1xuICAgICAgICByPXIuY29uY2F0KHBsMS5zbGljZShpKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGsyPWluZGV4T2ZTb3J0ZWQgKHBsMSxwbDJba10tZGlzdGFuY2UpO1xuICAgICAgICBpZiAoazI+aSkge1xuICAgICAgICAgIHI9ci5jb25jYXQocGwxLnNsaWNlKGksazIpKTtcbiAgICAgICAgICBpPWsyO1xuICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufVxudmFyIHBsYW5kID0gZnVuY3Rpb24gKHBsMSwgcGwyLCBkaXN0YW5jZSkge1xuICB2YXIgciA9IFtdO1xuICB2YXIgc3dhcCA9IDA7XG4gIFxuICBpZiAocGwxLmxlbmd0aCA+IHBsMi5sZW5ndGgpIHsgLy9zd2FwIGZvciBmYXN0ZXIgY29tcGFyZVxuICAgIHZhciB0ID0gcGwyO1xuICAgIHBsMiA9IHBsMTtcbiAgICBwbDEgPSB0O1xuICAgIHN3YXAgPSBkaXN0YW5jZTtcbiAgICBkaXN0YW5jZSA9IC1kaXN0YW5jZTtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHBsMS5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrID0gaW5kZXhPZlNvcnRlZChwbDIsIHBsMVtpXSArIGRpc3RhbmNlKTtcbiAgICB2YXIgdCA9IChwbDJba10gPT09IChwbDFbaV0gKyBkaXN0YW5jZSkpID8gayA6IC0xO1xuICAgIGlmICh0ID4gLTEpIHtcbiAgICAgIHIucHVzaChwbDFbaV0gLSBzd2FwKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG52YXIgY29tYmluZT1mdW5jdGlvbiAocG9zdGluZ3MpIHtcbiAgdmFyIG91dD1bXTtcbiAgZm9yICh2YXIgaSBpbiBwb3N0aW5ncykge1xuICAgIG91dD1vdXQuY29uY2F0KHBvc3RpbmdzW2ldKTtcbiAgfVxuICBvdXQuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhLWJ9KTtcbiAgcmV0dXJuIG91dDtcbn1cblxudmFyIHVuaXF1ZSA9IGZ1bmN0aW9uKGFyKXtcbiAgIGlmICghYXIgfHwgIWFyLmxlbmd0aCkgcmV0dXJuIFtdO1xuICAgdmFyIHUgPSB7fSwgYSA9IFtdO1xuICAgZm9yKHZhciBpID0gMCwgbCA9IGFyLmxlbmd0aDsgaSA8IGw7ICsraSl7XG4gICAgaWYodS5oYXNPd25Qcm9wZXJ0eShhcltpXSkpIGNvbnRpbnVlO1xuICAgIGEucHVzaChhcltpXSk7XG4gICAgdVthcltpXV0gPSAxO1xuICAgfVxuICAgcmV0dXJuIGE7XG59XG5cblxuXG52YXIgcGxwaHJhc2UgPSBmdW5jdGlvbiAocG9zdGluZ3Msb3BzKSB7XG4gIHZhciByID0gW107XG4gIGZvciAodmFyIGk9MDtpPHBvc3RpbmdzLmxlbmd0aDtpKyspIHtcbiAgXHRpZiAoIXBvc3RpbmdzW2ldKSAgcmV0dXJuIFtdO1xuICBcdGlmICgwID09PSBpKSB7XG4gIFx0ICByID0gcG9zdGluZ3NbMF07XG4gIFx0fSBlbHNlIHtcbiAgICAgIGlmIChvcHNbaV09PSdhbmRub3QnKSB7XG4gICAgICAgIHIgPSBwbG5vdGZvbGxvdyhyLCBwb3N0aW5nc1tpXSwgaSk7ICBcbiAgICAgIH1lbHNlIHtcbiAgICAgICAgciA9IHBsYW5kKHIsIHBvc3RpbmdzW2ldLCBpKTsgIFxuICAgICAgfVxuICBcdH1cbiAgfVxuICBcbiAgcmV0dXJuIHI7XG59XG4vL3JldHVybiBhbiBhcnJheSBvZiBncm91cCBoYXZpbmcgYW55IG9mIHBsIGl0ZW1cbnZhciBtYXRjaFBvc3Rpbmc9ZnVuY3Rpb24ocGwsZ3VwbCxzdGFydCxlbmQpIHtcbiAgc3RhcnQ9c3RhcnR8fDA7XG4gIGVuZD1lbmR8fC0xO1xuICBpZiAoZW5kPT0tMSkgZW5kPU1hdGgucG93KDIsIDUzKTsgLy8gbWF4IGludGVnZXIgdmFsdWVcblxuICB2YXIgY291bnQ9MCwgaSA9IGo9IDAsICByZXN1bHQgPSBbXSAsdj0wO1xuICB2YXIgZG9jcz1bXSwgZnJlcT1bXTtcbiAgaWYgKCFwbCkgcmV0dXJuIHtkb2NzOltdLGZyZXE6W119O1xuICB3aGlsZSggaSA8IHBsLmxlbmd0aCAmJiBqIDwgZ3VwbC5sZW5ndGggKXtcbiAgICAgaWYgKHBsW2ldIDwgZ3VwbFtqXSApeyBcbiAgICAgICBjb3VudCsrO1xuICAgICAgIHY9cGxbaV07XG4gICAgICAgaSsrOyBcbiAgICAgfSBlbHNlIHtcbiAgICAgICBpZiAoY291bnQpIHtcbiAgICAgICAgaWYgKHY+PXN0YXJ0ICYmIHY8ZW5kKSB7XG4gICAgICAgICAgZG9jcy5wdXNoKGopO1xuICAgICAgICAgIGZyZXEucHVzaChjb3VudCk7ICAgICAgICAgIFxuICAgICAgICB9XG4gICAgICAgfVxuICAgICAgIGorKztcbiAgICAgICBjb3VudD0wO1xuICAgICB9XG4gIH1cbiAgaWYgKGNvdW50ICYmIGo8Z3VwbC5sZW5ndGggJiYgdj49c3RhcnQgJiYgdjxlbmQpIHtcbiAgICBkb2NzLnB1c2goaik7XG4gICAgZnJlcS5wdXNoKGNvdW50KTtcbiAgICBjb3VudD0wO1xuICB9XG4gIGVsc2Uge1xuICAgIHdoaWxlIChqPT1ndXBsLmxlbmd0aCAmJiBpPHBsLmxlbmd0aCAmJiBwbFtpXSA+PSBndXBsW2d1cGwubGVuZ3RoLTFdKSB7XG4gICAgICBpKys7XG4gICAgICBjb3VudCsrO1xuICAgIH1cbiAgICBpZiAodj49c3RhcnQgJiYgdjxlbmQpIHtcbiAgICAgIGRvY3MucHVzaChqKTtcbiAgICAgIGZyZXEucHVzaChjb3VudCk7ICAgICAgXG4gICAgfVxuICB9IFxuICByZXR1cm4ge2RvY3M6ZG9jcyxmcmVxOmZyZXF9O1xufVxuXG52YXIgdHJpbT1mdW5jdGlvbihhcnIsc3RhcnQsZW5kKSB7XG4gIHZhciBzPWluZGV4T2ZTb3J0ZWQoYXJyLHN0YXJ0KTtcbiAgdmFyIGU9aW5kZXhPZlNvcnRlZChhcnIsZW5kKTtcbiAgcmV0dXJuIGFyci5zbGljZShzLGUrMSk7XG59XG52YXIgcGxpc3Q9e307XG5wbGlzdC51bnBhY2s9dW5wYWNrO1xucGxpc3QucGxwaHJhc2U9cGxwaHJhc2U7XG5wbGlzdC5wbGhlYWQ9cGxoZWFkO1xucGxpc3QucGxmb2xsb3cyPXBsZm9sbG93MjtcbnBsaXN0LnBsbm90Zm9sbG93Mj1wbG5vdGZvbGxvdzI7XG5wbGlzdC5wbGZvbGxvdz1wbGZvbGxvdztcbnBsaXN0LnBsbm90Zm9sbG93PXBsbm90Zm9sbG93O1xucGxpc3QudW5pcXVlPXVuaXF1ZTtcbnBsaXN0LmluZGV4T2ZTb3J0ZWQ9aW5kZXhPZlNvcnRlZDtcbnBsaXN0Lm1hdGNoUG9zdGluZz1tYXRjaFBvc3Rpbmc7XG5wbGlzdC50cmltPXRyaW07XG5cbnBsaXN0Lmdyb3VwYnlzbG90PWdyb3VwYnlzbG90O1xucGxpc3QuZ3JvdXBieWJsb2NrMj1ncm91cGJ5YmxvY2syO1xucGxpc3QuY291bnRieXBvc3Rpbmc9Y291bnRieXBvc3Rpbmc7XG5wbGlzdC5ncm91cGJ5cG9zdGluZz1ncm91cGJ5cG9zdGluZztcbnBsaXN0Lmdyb3VwYnlwb3N0aW5nMj1ncm91cGJ5cG9zdGluZzI7XG5wbGlzdC5ncm91cHN1bT1ncm91cHN1bTtcbnBsaXN0LmNvbWJpbmU9Y29tYmluZTtcbm1vZHVsZS5leHBvcnRzPXBsaXN0OyIsIi8qIFRPRE8gc29ydGVkIHRva2VucyAqL1xudmFyIHBsaXN0PXJlcXVpcmUoXCIuL3BsaXN0XCIpO1xudmFyIGJvb2xzZWFyY2g9cmVxdWlyZShcIi4vYm9vbHNlYXJjaFwiKTtcbnZhciBleGNlcnB0PXJlcXVpcmUoXCIuL2V4Y2VycHRcIik7XG52YXIgcGFyc2VUZXJtID0gZnVuY3Rpb24oZW5naW5lLHJhdyxvcHRzKSB7XG5cdGlmICghcmF3KSByZXR1cm47XG5cdHZhciByZXM9e3JhdzpyYXcsdmFyaWFudHM6W10sdGVybTonJyxvcDonJ307XG5cdHZhciB0ZXJtPXJhdywgb3A9MDtcblx0dmFyIGZpcnN0Y2hhcj10ZXJtWzBdO1xuXHR2YXIgdGVybXJlZ2V4PVwiXCI7XG5cdGlmIChmaXJzdGNoYXI9PSctJykge1xuXHRcdHRlcm09dGVybS5zdWJzdHJpbmcoMSk7XG5cdFx0Zmlyc3RjaGFyPXRlcm1bMF07XG5cdFx0cmVzLmV4Y2x1ZGU9dHJ1ZTsgLy9leGNsdWRlXG5cdH1cblx0dGVybT10ZXJtLnRyaW0oKTtcblx0dmFyIGxhc3RjaGFyPXRlcm1bdGVybS5sZW5ndGgtMV07XG5cdHRlcm09ZW5naW5lLmFuYWx5emVyLm5vcm1hbGl6ZSh0ZXJtKTtcblx0XG5cdGlmICh0ZXJtLmluZGV4T2YoXCIlXCIpPi0xKSB7XG5cdFx0dmFyIHRlcm1yZWdleD1cIl5cIit0ZXJtLnJlcGxhY2UoLyUrL2csXCIuK1wiKStcIiRcIjtcblx0XHRpZiAoZmlyc3RjaGFyPT1cIiVcIikgXHR0ZXJtcmVnZXg9XCIuK1wiK3Rlcm1yZWdleC5zdWJzdHIoMSk7XG5cdFx0aWYgKGxhc3RjaGFyPT1cIiVcIikgXHR0ZXJtcmVnZXg9dGVybXJlZ2V4LnN1YnN0cigwLHRlcm1yZWdleC5sZW5ndGgtMSkrXCIuK1wiO1xuXHR9XG5cblx0aWYgKHRlcm1yZWdleCkge1xuXHRcdHJlcy52YXJpYW50cz1leHBhbmRUZXJtKGVuZ2luZSx0ZXJtcmVnZXgpO1xuXHR9XG5cblx0cmVzLmtleT10ZXJtO1xuXHRyZXR1cm4gcmVzO1xufVxudmFyIGV4cGFuZFRlcm09ZnVuY3Rpb24oZW5naW5lLHJlZ2V4KSB7XG5cdHZhciByPW5ldyBSZWdFeHAocmVnZXgpO1xuXHR2YXIgdG9rZW5zPWVuZ2luZS5nZXQoXCJ0b2tlbnNcIik7XG5cdHZhciBwb3N0aW5nc0xlbmd0aD1lbmdpbmUuZ2V0KFwicG9zdGluZ3NMZW5ndGhcIik7XG5cdGlmICghcG9zdGluZ3NMZW5ndGgpIHBvc3RpbmdzTGVuZ3RoPVtdO1xuXHR2YXIgb3V0PVtdO1xuXHRmb3IgKHZhciBpPTA7aTx0b2tlbnMubGVuZ3RoO2krKykge1xuXHRcdHZhciBtPXRva2Vuc1tpXS5tYXRjaChyKTtcblx0XHRpZiAobSkge1xuXHRcdFx0b3V0LnB1c2goW21bMF0scG9zdGluZ3NMZW5ndGhbaV18fDFdKTtcblx0XHR9XG5cdH1cblx0b3V0LnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYlsxXS1hWzFdfSk7XG5cdHJldHVybiBvdXQ7XG59XG52YXIgaXNXaWxkY2FyZD1mdW5jdGlvbihyYXcpIHtcblx0cmV0dXJuICEhcmF3Lm1hdGNoKC9bXFwqXFw/XS8pO1xufVxuXG52YXIgaXNPclRlcm09ZnVuY3Rpb24odGVybSkge1xuXHR0ZXJtPXRlcm0udHJpbSgpO1xuXHRyZXR1cm4gKHRlcm1bdGVybS5sZW5ndGgtMV09PT0nLCcpO1xufVxudmFyIG9ydGVybT1mdW5jdGlvbihlbmdpbmUsdGVybSxrZXkpIHtcblx0XHR2YXIgdD17dGV4dDprZXl9O1xuXHRcdGlmIChlbmdpbmUuYW5hbHl6ZXIuc2ltcGxpZmllZFRva2VuKSB7XG5cdFx0XHR0LnNpbXBsaWZpZWQ9ZW5naW5lLmFuYWx5emVyLnNpbXBsaWZpZWRUb2tlbihrZXkpO1xuXHRcdH1cblx0XHR0ZXJtLnZhcmlhbnRzLnB1c2godCk7XG59XG52YXIgb3JUZXJtcz1mdW5jdGlvbihlbmdpbmUsdG9rZW5zLG5vdykge1xuXHR2YXIgcmF3PXRva2Vuc1tub3ddO1xuXHR2YXIgdGVybT1wYXJzZVRlcm0oZW5naW5lLHJhdyk7XG5cdGlmICghdGVybSkgcmV0dXJuO1xuXHRvcnRlcm0oZW5naW5lLHRlcm0sdGVybS5rZXkpO1xuXHR3aGlsZSAoaXNPclRlcm0ocmF3KSkgIHtcblx0XHRyYXc9dG9rZW5zWysrbm93XTtcblx0XHR2YXIgdGVybTI9cGFyc2VUZXJtKGVuZ2luZSxyYXcpO1xuXHRcdG9ydGVybShlbmdpbmUsdGVybSx0ZXJtMi5rZXkpO1xuXHRcdGZvciAodmFyIGkgaW4gdGVybTIudmFyaWFudHMpe1xuXHRcdFx0dGVybS52YXJpYW50c1tpXT10ZXJtMi52YXJpYW50c1tpXTtcblx0XHR9XG5cdFx0dGVybS5rZXkrPScsJyt0ZXJtMi5rZXk7XG5cdH1cblx0cmV0dXJuIHRlcm07XG59XG5cbnZhciBnZXRPcGVyYXRvcj1mdW5jdGlvbihyYXcpIHtcblx0dmFyIG9wPScnO1xuXHRpZiAocmF3WzBdPT0nKycpIG9wPSdpbmNsdWRlJztcblx0aWYgKHJhd1swXT09Jy0nKSBvcD0nZXhjbHVkZSc7XG5cdHJldHVybiBvcDtcbn1cbnZhciBwYXJzZVBocmFzZT1mdW5jdGlvbihxKSB7XG5cdHZhciBtYXRjaD1xLm1hdGNoKC8oXCIuKz9cInwnLis/J3xcXFMrKS9nKVxuXHRtYXRjaD1tYXRjaC5tYXAoZnVuY3Rpb24oc3RyKXtcblx0XHR2YXIgbj1zdHIubGVuZ3RoLCBoPXN0ci5jaGFyQXQoMCksIHQ9c3RyLmNoYXJBdChuLTEpXG5cdFx0aWYgKGg9PT10JiYoaD09PSdcIid8aD09PVwiJ1wiKSkgc3RyPXN0ci5zdWJzdHIoMSxuLTIpXG5cdFx0cmV0dXJuIHN0cjtcblx0fSlcblx0cmV0dXJuIG1hdGNoO1xufVxudmFyIHRpYmV0YW5OdW1iZXI9e1xuXHRcIlxcdTBmMjBcIjpcIjBcIixcIlxcdTBmMjFcIjpcIjFcIixcIlxcdTBmMjJcIjpcIjJcIixcdFwiXFx1MGYyM1wiOlwiM1wiLFx0XCJcXHUwZjI0XCI6XCI0XCIsXG5cdFwiXFx1MGYyNVwiOlwiNVwiLFwiXFx1MGYyNlwiOlwiNlwiLFwiXFx1MGYyN1wiOlwiN1wiLFwiXFx1MGYyOFwiOlwiOFwiLFwiXFx1MGYyOVwiOlwiOVwiXG59XG52YXIgcGFyc2VOdW1iZXI9ZnVuY3Rpb24ocmF3KSB7XG5cdHZhciBuPXBhcnNlSW50KHJhdywxMCk7XG5cdGlmIChpc05hTihuKSl7XG5cdFx0dmFyIGNvbnZlcnRlZD1bXTtcblx0XHRmb3IgKHZhciBpPTA7aTxyYXcubGVuZ3RoO2krKykge1xuXHRcdFx0dmFyIG5uPXRpYmV0YW5OdW1iZXJbcmF3W2ldXTtcblx0XHRcdGlmICh0eXBlb2Ygbm4gIT1cInVuZGVmaW5lZFwiKSBjb252ZXJ0ZWRbaV09bm47XG5cdFx0XHRlbHNlIGJyZWFrO1xuXHRcdH1cblx0XHRyZXR1cm4gcGFyc2VJbnQoY29udmVydGVkLDEwKTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gbjtcblx0fVxufVxudmFyIHBhcnNlV2lsZGNhcmQ9ZnVuY3Rpb24ocmF3KSB7XG5cdHZhciBuPXBhcnNlTnVtYmVyKHJhdykgfHwgMTtcblx0dmFyIHFjb3VudD1yYXcuc3BsaXQoJz8nKS5sZW5ndGgtMTtcblx0dmFyIHNjb3VudD1yYXcuc3BsaXQoJyonKS5sZW5ndGgtMTtcblx0dmFyIHR5cGU9Jyc7XG5cdGlmIChxY291bnQpIHR5cGU9Jz8nO1xuXHRlbHNlIGlmIChzY291bnQpIHR5cGU9JyonO1xuXHRyZXR1cm4ge3dpbGRjYXJkOnR5cGUsIHdpZHRoOiBuICwgb3A6J3dpbGRjYXJkJ307XG59XG5cbnZhciBuZXdQaHJhc2U9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiB7dGVybWlkOltdLHBvc3Rpbmc6W10scmF3OicnLHRlcm1sZW5ndGg6W119O1xufSBcbnZhciBwYXJzZVF1ZXJ5PWZ1bmN0aW9uKHEsc2VwKSB7XG5cdGlmIChzZXAgJiYgcS5pbmRleE9mKHNlcCk+LTEpIHtcblx0XHR2YXIgbWF0Y2g9cS5zcGxpdChzZXApO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBtYXRjaD1xLm1hdGNoKC8oXCIuKz9cInwnLis/J3xcXFMrKS9nKVxuXHRcdG1hdGNoPW1hdGNoLm1hcChmdW5jdGlvbihzdHIpe1xuXHRcdFx0dmFyIG49c3RyLmxlbmd0aCwgaD1zdHIuY2hhckF0KDApLCB0PXN0ci5jaGFyQXQobi0xKVxuXHRcdFx0aWYgKGg9PT10JiYoaD09PSdcIid8aD09PVwiJ1wiKSkgc3RyPXN0ci5zdWJzdHIoMSxuLTIpXG5cdFx0XHRyZXR1cm4gc3RyXG5cdFx0fSlcblx0XHQvL2NvbnNvbGUubG9nKGlucHV0LCc9PT4nLG1hdGNoKVx0XHRcblx0fVxuXHRyZXR1cm4gbWF0Y2g7XG59XG52YXIgbG9hZFBocmFzZT1mdW5jdGlvbihwaHJhc2UpIHtcblx0LyogcmVtb3ZlIGxlYWRpbmcgYW5kIGVuZGluZyB3aWxkY2FyZCAqL1xuXHR2YXIgUT10aGlzO1xuXHR2YXIgY2FjaGU9US5lbmdpbmUucG9zdGluZ0NhY2hlO1xuXHRpZiAoY2FjaGVbcGhyYXNlLmtleV0pIHtcblx0XHRwaHJhc2UucG9zdGluZz1jYWNoZVtwaHJhc2Uua2V5XTtcblx0XHRyZXR1cm4gUTtcblx0fVxuXHRpZiAocGhyYXNlLnRlcm1pZC5sZW5ndGg9PTEpIHtcblx0XHRpZiAoIVEudGVybXMubGVuZ3RoKXtcblx0XHRcdHBocmFzZS5wb3N0aW5nPVtdO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjYWNoZVtwaHJhc2Uua2V5XT1waHJhc2UucG9zdGluZz1RLnRlcm1zW3BocmFzZS50ZXJtaWRbMF1dLnBvc3Rpbmc7XHRcblx0XHR9XG5cdFx0cmV0dXJuIFE7XG5cdH1cblxuXHR2YXIgaT0wLCByPVtdLGRpcz0wO1xuXHR3aGlsZShpPHBocmFzZS50ZXJtaWQubGVuZ3RoKSB7XG5cdCAgdmFyIFQ9US50ZXJtc1twaHJhc2UudGVybWlkW2ldXTtcblx0XHRpZiAoMCA9PT0gaSkge1xuXHRcdFx0ciA9IFQucG9zdGluZztcblx0XHR9IGVsc2Uge1xuXHRcdCAgICBpZiAoVC5vcD09J3dpbGRjYXJkJykge1xuXHRcdCAgICBcdFQ9US50ZXJtc1twaHJhc2UudGVybWlkW2krK11dO1xuXHRcdCAgICBcdHZhciB3aWR0aD1ULndpZHRoO1xuXHRcdCAgICBcdHZhciB3aWxkY2FyZD1ULndpbGRjYXJkO1xuXHRcdCAgICBcdFQ9US50ZXJtc1twaHJhc2UudGVybWlkW2ldXTtcblx0XHQgICAgXHR2YXIgbWluZGlzPWRpcztcblx0XHQgICAgXHRpZiAod2lsZGNhcmQ9PSc/JykgbWluZGlzPWRpcyt3aWR0aDtcblx0XHQgICAgXHRpZiAoVC5leGNsdWRlKSByID0gcGxpc3QucGxub3Rmb2xsb3cyKHIsIFQucG9zdGluZywgbWluZGlzLCBkaXMrd2lkdGgpO1xuXHRcdCAgICBcdGVsc2UgciA9IHBsaXN0LnBsZm9sbG93MihyLCBULnBvc3RpbmcsIG1pbmRpcywgZGlzK3dpZHRoKTtcdFx0ICAgIFx0XG5cdFx0ICAgIFx0ZGlzKz0od2lkdGgtMSk7XG5cdFx0ICAgIH1lbHNlIHtcblx0XHQgICAgXHRpZiAoVC5wb3N0aW5nKSB7XG5cdFx0ICAgIFx0XHRpZiAoVC5leGNsdWRlKSByID0gcGxpc3QucGxub3Rmb2xsb3cociwgVC5wb3N0aW5nLCBkaXMpO1xuXHRcdCAgICBcdFx0ZWxzZSByID0gcGxpc3QucGxmb2xsb3cociwgVC5wb3N0aW5nLCBkaXMpO1xuXHRcdCAgICBcdH1cblx0XHQgICAgfVxuXHRcdH1cblx0XHRkaXMgKz0gcGhyYXNlLnRlcm1sZW5ndGhbaV07XG5cdFx0aSsrO1xuXHRcdGlmICghcikgcmV0dXJuIFE7XG4gIH1cbiAgcGhyYXNlLnBvc3Rpbmc9cjtcbiAgY2FjaGVbcGhyYXNlLmtleV09cjtcbiAgcmV0dXJuIFE7XG59XG52YXIgdHJpbVNwYWNlPWZ1bmN0aW9uKGVuZ2luZSxxdWVyeSkge1xuXHRpZiAoIXF1ZXJ5KSByZXR1cm4gXCJcIjtcblx0dmFyIGk9MDtcblx0dmFyIGlzU2tpcD1lbmdpbmUuYW5hbHl6ZXIuaXNTa2lwO1xuXHR3aGlsZSAoaXNTa2lwKHF1ZXJ5W2ldKSAmJiBpPHF1ZXJ5Lmxlbmd0aCkgaSsrO1xuXHRyZXR1cm4gcXVlcnkuc3Vic3RyaW5nKGkpO1xufVxudmFyIGdldFBhZ2VXaXRoSGl0PWZ1bmN0aW9uKGZpbGVpZCxvZmZzZXRzKSB7XG5cdHZhciBRPXRoaXMsZW5naW5lPVEuZW5naW5lO1xuXHR2YXIgcGFnZXdpdGhoaXQ9cGxpc3QuZ3JvdXBieXBvc3RpbmcyKFEuYnlGaWxlW2ZpbGVpZCBdLCBvZmZzZXRzKTtcblx0aWYgKHBhZ2V3aXRoaGl0Lmxlbmd0aCkgcGFnZXdpdGhoaXQuc2hpZnQoKTsgLy90aGUgZmlyc3QgaXRlbSBpcyBub3QgdXNlZCAoMH5RLmJ5RmlsZVswXSApXG5cdHZhciBvdXQ9W107XG5cdHBhZ2V3aXRoaGl0Lm1hcChmdW5jdGlvbihwLGlkeCl7aWYgKHAubGVuZ3RoKSBvdXQucHVzaChpZHgpfSk7XG5cdHJldHVybiBvdXQ7XG59XG52YXIgcGFnZVdpdGhIaXQ9ZnVuY3Rpb24oZmlsZWlkKSB7XG5cdHZhciBRPXRoaXMsZW5naW5lPVEuZW5naW5lO1xuXHR2YXIgb2Zmc2V0cz1lbmdpbmUuZ2V0RmlsZVBhZ2VPZmZzZXRzKGZpbGVpZCk7XG5cdHJldHVybiBnZXRQYWdlV2l0aEhpdC5hcHBseSh0aGlzLFtmaWxlaWQsb2Zmc2V0c10pO1xufVxudmFyIGlzU2ltcGxlUGhyYXNlPWZ1bmN0aW9uKHBocmFzZSkge1xuXHR2YXIgbT1waHJhc2UubWF0Y2goL1tcXD8lXl0vKTtcblx0cmV0dXJuICFtO1xufVxuXG4vLyDnmbzoj6nmj5Dlv4MgICA9PT4g55m86I+pICDmj5Dlv4MgICAgICAgMiAyICAgXG4vLyDoj6nmj5Dlv4MgICAgID09PiDoj6nmj5AgIOaPkOW/gyAgICAgICAxIDJcbi8vIOWKq+WKqyAgICAgICA9PT4g5YqrICAgIOWKqyAgICAgICAgIDEgMSAgIC8vIGludmFsaWRcbi8vIOWboOe3o+aJgOeUn+mBkyAgPT0+IOWboOe3oyAg5omA55SfICAg6YGTICAgMiAyIDFcbnZhciBzcGxpdFBocmFzZT1mdW5jdGlvbihlbmdpbmUsc2ltcGxlcGhyYXNlLGJpZ3JhbSkge1xuXHR2YXIgYmlncmFtPWJpZ3JhbXx8ZW5naW5lLmdldChcIm1ldGFcIikuYmlncmFtfHxbXTtcblx0dmFyIHRva2Vucz1lbmdpbmUuYW5hbHl6ZXIudG9rZW5pemUoc2ltcGxlcGhyYXNlKS50b2tlbnM7XG5cdHZhciBsb2FkdG9rZW5zPVtdLGxlbmd0aHM9W10saj0wLGxhc3RiaWdyYW1wb3M9LTE7XG5cdHdoaWxlIChqKzE8dG9rZW5zLmxlbmd0aCkge1xuXHRcdHZhciB0b2tlbj1lbmdpbmUuYW5hbHl6ZXIubm9ybWFsaXplKHRva2Vuc1tqXSk7XG5cdFx0dmFyIG5leHR0b2tlbj1lbmdpbmUuYW5hbHl6ZXIubm9ybWFsaXplKHRva2Vuc1tqKzFdKTtcblx0XHR2YXIgYmk9dG9rZW4rbmV4dHRva2VuO1xuXHRcdHZhciBpPXBsaXN0LmluZGV4T2ZTb3J0ZWQoYmlncmFtLGJpKTtcblx0XHRpZiAoYmlncmFtW2ldPT1iaSkge1xuXHRcdFx0bG9hZHRva2Vucy5wdXNoKGJpKTtcblx0XHRcdGlmIChqKzM8dG9rZW5zLmxlbmd0aCkge1xuXHRcdFx0XHRsYXN0YmlncmFtcG9zPWo7XG5cdFx0XHRcdGorKztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChqKzI9PXRva2Vucy5sZW5ndGgpeyBcblx0XHRcdFx0XHRpZiAobGFzdGJpZ3JhbXBvcysxPT1qICkge1xuXHRcdFx0XHRcdFx0bGVuZ3Roc1tsZW5ndGhzLmxlbmd0aC0xXS0tO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRsYXN0YmlncmFtcG9zPWo7XG5cdFx0XHRcdFx0aisrO1xuXHRcdFx0XHR9ZWxzZSB7XG5cdFx0XHRcdFx0bGFzdGJpZ3JhbXBvcz1qO1x0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdGxlbmd0aHMucHVzaCgyKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCFiaWdyYW0gfHwgbGFzdGJpZ3JhbXBvcz09LTEgfHwgbGFzdGJpZ3JhbXBvcysxIT1qKSB7XG5cdFx0XHRcdGxvYWR0b2tlbnMucHVzaCh0b2tlbik7XG5cdFx0XHRcdGxlbmd0aHMucHVzaCgxKTtcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH1cblx0XHRqKys7XG5cdH1cblxuXHR3aGlsZSAoajx0b2tlbnMubGVuZ3RoKSB7XG5cdFx0dmFyIHRva2VuPWVuZ2luZS5hbmFseXplci5ub3JtYWxpemUodG9rZW5zW2pdKTtcblx0XHRsb2FkdG9rZW5zLnB1c2godG9rZW4pO1xuXHRcdGxlbmd0aHMucHVzaCgxKTtcblx0XHRqKys7XG5cdH1cblxuXHRyZXR1cm4ge3Rva2Vuczpsb2FkdG9rZW5zLCBsZW5ndGhzOiBsZW5ndGhzICwgdG9rZW5sZW5ndGg6IHRva2Vucy5sZW5ndGh9O1xufVxuLyogaG9zdCBoYXMgZmFzdCBuYXRpdmUgZnVuY3Rpb24gKi9cbnZhciBmYXN0UGhyYXNlPWZ1bmN0aW9uKGVuZ2luZSxwaHJhc2UpIHtcblx0dmFyIHBocmFzZV90ZXJtPW5ld1BocmFzZSgpO1xuXHQvL3ZhciB0b2tlbnM9ZW5naW5lLmFuYWx5emVyLnRva2VuaXplKHBocmFzZSkudG9rZW5zO1xuXHR2YXIgc3BsaXR0ZWQ9c3BsaXRQaHJhc2UoZW5naW5lLHBocmFzZSk7XG5cblx0dmFyIHBhdGhzPXBvc3RpbmdQYXRoRnJvbVRva2VucyhlbmdpbmUsc3BsaXR0ZWQudG9rZW5zKTtcbi8vY3JlYXRlIHdpbGRjYXJkXG5cblx0cGhyYXNlX3Rlcm0ud2lkdGg9c3BsaXR0ZWQudG9rZW5sZW5ndGg7IC8vZm9yIGV4Y2VycHQuanMgdG8gZ2V0UGhyYXNlV2lkdGhcblxuXHRlbmdpbmUuZ2V0KHBhdGhzLHthZGRyZXNzOnRydWV9LGZ1bmN0aW9uKHBvc3RpbmdBZGRyZXNzKXsgLy90aGlzIGlzIHN5bmNcblx0XHRwaHJhc2VfdGVybS5rZXk9cGhyYXNlO1xuXHRcdHZhciBwb3N0aW5nQWRkcmVzc1dpdGhXaWxkY2FyZD1bXTtcblx0XHRmb3IgKHZhciBpPTA7aTxwb3N0aW5nQWRkcmVzcy5sZW5ndGg7aSsrKSB7XG5cdFx0XHRwb3N0aW5nQWRkcmVzc1dpdGhXaWxkY2FyZC5wdXNoKHBvc3RpbmdBZGRyZXNzW2ldKTtcblx0XHRcdGlmIChzcGxpdHRlZC5sZW5ndGhzW2ldPjEpIHtcblx0XHRcdFx0cG9zdGluZ0FkZHJlc3NXaXRoV2lsZGNhcmQucHVzaChbc3BsaXR0ZWQubGVuZ3Roc1tpXSwwXSk7IC8vd2lsZGNhcmQgaGFzIGJsb2Nrc2l6ZT09MCBcblx0XHRcdH1cblx0XHR9XG5cdFx0ZW5naW5lLnBvc3RpbmdDYWNoZVtwaHJhc2VdPWVuZ2luZS5tZXJnZVBvc3RpbmdzKHBvc3RpbmdBZGRyZXNzV2l0aFdpbGRjYXJkKTtcblx0fSk7XG5cdHJldHVybiBwaHJhc2VfdGVybTtcblx0Ly8gcHV0IHBvc3RpbmcgaW50byBjYWNoZVtwaHJhc2Uua2V5XVxufVxudmFyIHNsb3dQaHJhc2U9ZnVuY3Rpb24oZW5naW5lLHRlcm1zLHBocmFzZSkge1xuXHR2YXIgaj0wLHRva2Vucz1lbmdpbmUuYW5hbHl6ZXIudG9rZW5pemUocGhyYXNlKS50b2tlbnM7XG5cdHZhciBwaHJhc2VfdGVybT1uZXdQaHJhc2UoKTtcblx0dmFyIHRlcm1pZD0wO1xuXHR3aGlsZSAoajx0b2tlbnMubGVuZ3RoKSB7XG5cdFx0dmFyIHJhdz10b2tlbnNbal0sIHRlcm1sZW5ndGg9MTtcblx0XHRpZiAoaXNXaWxkY2FyZChyYXcpKSB7XG5cdFx0XHRpZiAocGhyYXNlX3Rlcm0udGVybWlkLmxlbmd0aD09MCkgIHsgLy9za2lwIGxlYWRpbmcgd2lsZCBjYXJkXG5cdFx0XHRcdGorK1xuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblx0XHRcdHRlcm1zLnB1c2gocGFyc2VXaWxkY2FyZChyYXcpKTtcblx0XHRcdHRlcm1pZD10ZXJtcy5sZW5ndGgtMTtcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1pZC5wdXNoKHRlcm1pZCk7XG5cdFx0XHRwaHJhc2VfdGVybS50ZXJtbGVuZ3RoLnB1c2godGVybWxlbmd0aCk7XG5cdFx0fSBlbHNlIGlmIChpc09yVGVybShyYXcpKXtcblx0XHRcdHZhciB0ZXJtPW9yVGVybXMuYXBwbHkodGhpcyxbdG9rZW5zLGpdKTtcblx0XHRcdGlmICh0ZXJtKSB7XG5cdFx0XHRcdHRlcm1zLnB1c2godGVybSk7XG5cdFx0XHRcdHRlcm1pZD10ZXJtcy5sZW5ndGgtMTtcblx0XHRcdFx0ais9dGVybS5rZXkuc3BsaXQoJywnKS5sZW5ndGgtMTtcdFx0XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRqKys7XG5cdFx0XHRwaHJhc2VfdGVybS50ZXJtaWQucHVzaCh0ZXJtaWQpO1xuXHRcdFx0cGhyYXNlX3Rlcm0udGVybWxlbmd0aC5wdXNoKHRlcm1sZW5ndGgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGhyYXNlPVwiXCI7XG5cdFx0XHR3aGlsZSAoajx0b2tlbnMubGVuZ3RoKSB7XG5cdFx0XHRcdGlmICghKGlzV2lsZGNhcmQodG9rZW5zW2pdKSB8fCBpc09yVGVybSh0b2tlbnNbal0pKSkge1xuXHRcdFx0XHRcdHBocmFzZSs9dG9rZW5zW2pdO1xuXHRcdFx0XHRcdGorKztcblx0XHRcdFx0fSBlbHNlIGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHR2YXIgc3BsaXR0ZWQ9c3BsaXRQaHJhc2UoZW5naW5lLHBocmFzZSk7XG5cdFx0XHRmb3IgKHZhciBpPTA7aTxzcGxpdHRlZC50b2tlbnMubGVuZ3RoO2krKykge1xuXG5cdFx0XHRcdHZhciB0ZXJtPXBhcnNlVGVybShlbmdpbmUsc3BsaXR0ZWQudG9rZW5zW2ldKTtcblx0XHRcdFx0dmFyIHRlcm1pZHg9dGVybXMubWFwKGZ1bmN0aW9uKGEpe3JldHVybiBhLmtleX0pLmluZGV4T2YodGVybS5rZXkpO1xuXHRcdFx0XHRpZiAodGVybWlkeD09LTEpIHtcblx0XHRcdFx0XHR0ZXJtcy5wdXNoKHRlcm0pO1xuXHRcdFx0XHRcdHRlcm1pZD10ZXJtcy5sZW5ndGgtMTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0ZXJtaWQ9dGVybWlkeDtcblx0XHRcdFx0fVx0XHRcdFx0XG5cdFx0XHRcdHBocmFzZV90ZXJtLnRlcm1pZC5wdXNoKHRlcm1pZCk7XG5cdFx0XHRcdHBocmFzZV90ZXJtLnRlcm1sZW5ndGgucHVzaChzcGxpdHRlZC5sZW5ndGhzW2ldKTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aisrO1xuXHR9XG5cdHBocmFzZV90ZXJtLmtleT1waHJhc2U7XG5cdC8vcmVtb3ZlIGVuZGluZyB3aWxkY2FyZFxuXHR2YXIgUD1waHJhc2VfdGVybSAsIFQ9bnVsbDtcblx0ZG8ge1xuXHRcdFQ9dGVybXNbUC50ZXJtaWRbUC50ZXJtaWQubGVuZ3RoLTFdXTtcblx0XHRpZiAoIVQpIGJyZWFrO1xuXHRcdGlmIChULndpbGRjYXJkKSBQLnRlcm1pZC5wb3AoKTsgZWxzZSBicmVhaztcblx0fSB3aGlsZShUKTtcdFx0XG5cdHJldHVybiBwaHJhc2VfdGVybTtcbn1cbnZhciBuZXdRdWVyeSA9ZnVuY3Rpb24oZW5naW5lLHF1ZXJ5LG9wdHMpIHtcblx0Ly9pZiAoIXF1ZXJ5KSByZXR1cm47XG5cdG9wdHM9b3B0c3x8e307XG5cdHF1ZXJ5PXRyaW1TcGFjZShlbmdpbmUscXVlcnkpO1xuXG5cdHZhciBwaHJhc2VzPXF1ZXJ5LHBocmFzZXM9W107XG5cdGlmICh0eXBlb2YgcXVlcnk9PSdzdHJpbmcnICYmIHF1ZXJ5KSB7XG5cdFx0cGhyYXNlcz1wYXJzZVF1ZXJ5KHF1ZXJ5LG9wdHMucGhyYXNlX3NlcCB8fCBcIlwiKTtcblx0fVxuXHRcblx0dmFyIHBocmFzZV90ZXJtcz1bXSwgdGVybXM9W10sdmFyaWFudHM9W10sb3BlcmF0b3JzPVtdO1xuXHR2YXIgcGM9MDsvL3BocmFzZSBjb3VudFxuXHRmb3IgICh2YXIgaT0wO2k8cGhyYXNlcy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIG9wPWdldE9wZXJhdG9yKHBocmFzZXNbcGNdKTtcblx0XHRpZiAob3ApIHBocmFzZXNbcGNdPXBocmFzZXNbcGNdLnN1YnN0cmluZygxKTtcblxuXHRcdC8qIGF1dG8gYWRkICsgZm9yIG5hdHVyYWwgb3JkZXIgPyovXG5cdFx0Ly9pZiAoIW9wdHMucmFuayAmJiBvcCE9J2V4Y2x1ZGUnICYmaSkgb3A9J2luY2x1ZGUnO1xuXHRcdG9wZXJhdG9ycy5wdXNoKG9wKTtcblxuXHRcdGlmIChpc1NpbXBsZVBocmFzZShwaHJhc2VzW3BjXSkgJiYgZW5naW5lLm1lcmdlUG9zdGluZ3MgKSB7XG5cdFx0XHR2YXIgcGhyYXNlX3Rlcm09ZmFzdFBocmFzZShlbmdpbmUscGhyYXNlc1twY10pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGhyYXNlX3Rlcm09c2xvd1BocmFzZShlbmdpbmUsdGVybXMscGhyYXNlc1twY10pO1xuXHRcdH1cblx0XHRwaHJhc2VfdGVybXMucHVzaChwaHJhc2VfdGVybSk7XG5cblx0XHRpZiAoIWVuZ2luZS5tZXJnZVBvc3RpbmdzICYmIHBocmFzZV90ZXJtc1twY10udGVybWlkLmxlbmd0aD09MCkge1xuXHRcdFx0cGhyYXNlX3Rlcm1zLnBvcCgpO1xuXHRcdH0gZWxzZSBwYysrO1xuXHR9XG5cdG9wdHMub3A9b3BlcmF0b3JzO1xuXG5cdHZhciBRPXtkYm5hbWU6ZW5naW5lLmRibmFtZSxlbmdpbmU6ZW5naW5lLG9wdHM6b3B0cyxxdWVyeTpxdWVyeSxcblx0XHRwaHJhc2VzOnBocmFzZV90ZXJtcyx0ZXJtczp0ZXJtc1xuXHR9O1xuXHRRLnRva2VuaXplPWZ1bmN0aW9uKCkge3JldHVybiBlbmdpbmUuYW5hbHl6ZXIudG9rZW5pemUuYXBwbHkoZW5naW5lLGFyZ3VtZW50cyk7fVxuXHRRLmlzU2tpcD1mdW5jdGlvbigpIHtyZXR1cm4gZW5naW5lLmFuYWx5emVyLmlzU2tpcC5hcHBseShlbmdpbmUsYXJndW1lbnRzKTt9XG5cdFEubm9ybWFsaXplPWZ1bmN0aW9uKCkge3JldHVybiBlbmdpbmUuYW5hbHl6ZXIubm9ybWFsaXplLmFwcGx5KGVuZ2luZSxhcmd1bWVudHMpO31cblx0US5wYWdlV2l0aEhpdD1wYWdlV2l0aEhpdDtcblxuXHQvL1EuZ2V0UmFuZ2U9ZnVuY3Rpb24oKSB7cmV0dXJuIHRoYXQuZ2V0UmFuZ2UuYXBwbHkodGhhdCxhcmd1bWVudHMpfTtcblx0Ly9BUEkucXVlcnlpZD0nUScrKE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSoxMDAwMDAwMCkpLnRvU3RyaW5nKDE2KTtcblx0cmV0dXJuIFE7XG59XG52YXIgcG9zdGluZ1BhdGhGcm9tVG9rZW5zPWZ1bmN0aW9uKGVuZ2luZSx0b2tlbnMpIHtcblx0dmFyIGFsbHRva2Vucz1lbmdpbmUuZ2V0KFwidG9rZW5zXCIpO1xuXG5cdHZhciB0b2tlbklkcz10b2tlbnMubWFwKGZ1bmN0aW9uKHQpeyByZXR1cm4gMSthbGx0b2tlbnMuaW5kZXhPZih0KX0pO1xuXHR2YXIgcG9zdGluZ2lkPVtdO1xuXHRmb3IgKHZhciBpPTA7aTx0b2tlbklkcy5sZW5ndGg7aSsrKSB7XG5cdFx0cG9zdGluZ2lkLnB1c2goIHRva2VuSWRzW2ldKTsgLy8gdG9rZW5JZD09MCAsIGVtcHR5IHRva2VuXG5cdH1cblx0cmV0dXJuIHBvc3RpbmdpZC5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIFtcInBvc3RpbmdzXCIsdF19KTtcbn1cbnZhciBsb2FkUG9zdGluZ3M9ZnVuY3Rpb24oZW5naW5lLHRva2VucyxjYikge1xuXHR2YXIgdG9sb2FkdG9rZW5zPXRva2Vucy5maWx0ZXIoZnVuY3Rpb24odCl7XG5cdFx0cmV0dXJuICFlbmdpbmUucG9zdGluZ0NhY2hlW3Qua2V5XTsgLy9hbHJlYWR5IGluIGNhY2hlXG5cdH0pO1xuXHRpZiAodG9sb2FkdG9rZW5zLmxlbmd0aD09MCkge1xuXHRcdGNiKCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHZhciBwb3N0aW5nUGF0aHM9cG9zdGluZ1BhdGhGcm9tVG9rZW5zKGVuZ2luZSx0b2tlbnMubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LmtleX0pKTtcblx0ZW5naW5lLmdldChwb3N0aW5nUGF0aHMsZnVuY3Rpb24ocG9zdGluZ3Mpe1xuXHRcdHBvc3RpbmdzLm1hcChmdW5jdGlvbihwLGkpIHsgdG9rZW5zW2ldLnBvc3Rpbmc9cCB9KTtcblx0XHRpZiAoY2IpIGNiKCk7XG5cdH0pO1xufVxudmFyIGdyb3VwQnk9ZnVuY3Rpb24oUSxwb3N0aW5nKSB7XG5cdHBocmFzZXMuZm9yRWFjaChmdW5jdGlvbihQKXtcblx0XHR2YXIga2V5PVAua2V5O1xuXHRcdHZhciBkb2NmcmVxPWRvY2ZyZXFjYWNoZVtrZXldO1xuXHRcdGlmICghZG9jZnJlcSkgZG9jZnJlcT1kb2NmcmVxY2FjaGVba2V5XT17fTtcblx0XHRpZiAoIWRvY2ZyZXFbdGhhdC5ncm91cHVuaXRdKSB7XG5cdFx0XHRkb2NmcmVxW3RoYXQuZ3JvdXB1bml0XT17ZG9jbGlzdDpudWxsLGZyZXE6bnVsbH07XG5cdFx0fVx0XHRcblx0XHRpZiAoUC5wb3N0aW5nKSB7XG5cdFx0XHR2YXIgcmVzPW1hdGNoUG9zdGluZyhlbmdpbmUsUC5wb3N0aW5nKTtcblx0XHRcdFAuZnJlcT1yZXMuZnJlcTtcblx0XHRcdFAuZG9jcz1yZXMuZG9jcztcblx0XHR9IGVsc2Uge1xuXHRcdFx0UC5kb2NzPVtdO1xuXHRcdFx0UC5mcmVxPVtdO1xuXHRcdH1cblx0XHRkb2NmcmVxW3RoYXQuZ3JvdXB1bml0XT17ZG9jbGlzdDpQLmRvY3MsZnJlcTpQLmZyZXF9O1xuXHR9KTtcblx0cmV0dXJuIHRoaXM7XG59XG52YXIgZ3JvdXBCeUZvbGRlcj1mdW5jdGlvbihlbmdpbmUsZmlsZWhpdHMpIHtcblx0dmFyIGZpbGVzPWVuZ2luZS5nZXQoXCJmaWxlTmFtZXNcIik7XG5cdHZhciBwcmV2Zm9sZGVyPVwiXCIsaGl0cz0wLG91dD1bXTtcblx0Zm9yICh2YXIgaT0wO2k8ZmlsZWhpdHMubGVuZ3RoO2krKykge1xuXHRcdHZhciBmbj1maWxlc1tpXTtcblx0XHR2YXIgZm9sZGVyPWZuLnN1YnN0cmluZygwLGZuLmluZGV4T2YoJy8nKSk7XG5cdFx0aWYgKHByZXZmb2xkZXIgJiYgcHJldmZvbGRlciE9Zm9sZGVyKSB7XG5cdFx0XHRvdXQucHVzaChoaXRzKTtcblx0XHRcdGhpdHM9MDtcblx0XHR9XG5cdFx0aGl0cys9ZmlsZWhpdHNbaV0ubGVuZ3RoO1xuXHRcdHByZXZmb2xkZXI9Zm9sZGVyO1xuXHR9XG5cdG91dC5wdXNoKGhpdHMpO1xuXHRyZXR1cm4gb3V0O1xufVxudmFyIHBocmFzZV9pbnRlcnNlY3Q9ZnVuY3Rpb24oZW5naW5lLFEpIHtcblx0dmFyIGludGVyc2VjdGVkPW51bGw7XG5cdHZhciBmaWxlT2Zmc2V0cz1RLmVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0dmFyIGVtcHR5PVtdLGVtcHR5Y291bnQ9MCxoYXNoaXQ9MDtcblx0Zm9yICh2YXIgaT0wO2k8US5waHJhc2VzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgYnlmaWxlPXBsaXN0Lmdyb3VwYnlwb3N0aW5nMihRLnBocmFzZXNbaV0ucG9zdGluZyxmaWxlT2Zmc2V0cyk7XG5cdFx0aWYgKGJ5ZmlsZS5sZW5ndGgpIGJ5ZmlsZS5zaGlmdCgpO1xuXHRcdGlmIChieWZpbGUubGVuZ3RoKSBieWZpbGUucG9wKCk7XG5cdFx0YnlmaWxlLnBvcCgpO1xuXHRcdGlmIChpbnRlcnNlY3RlZD09bnVsbCkge1xuXHRcdFx0aW50ZXJzZWN0ZWQ9YnlmaWxlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKHZhciBqPTA7ajxieWZpbGUubGVuZ3RoO2orKykge1xuXHRcdFx0XHRpZiAoIShieWZpbGVbal0ubGVuZ3RoICYmIGludGVyc2VjdGVkW2pdLmxlbmd0aCkpIHtcblx0XHRcdFx0XHRpbnRlcnNlY3RlZFtqXT1lbXB0eTsgLy9yZXVzZSBlbXB0eSBhcnJheVxuXHRcdFx0XHRcdGVtcHR5Y291bnQrKztcblx0XHRcdFx0fSBlbHNlIGhhc2hpdCsrO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXG5cdFEuYnlGaWxlPWludGVyc2VjdGVkO1xuXHRRLmJ5Rm9sZGVyPWdyb3VwQnlGb2xkZXIoZW5naW5lLFEuYnlGaWxlKTtcblx0dmFyIG91dD1bXTtcblx0Ly9jYWxjdWxhdGUgbmV3IHJhd3Bvc3Rpbmdcblx0Zm9yICh2YXIgaT0wO2k8US5ieUZpbGUubGVuZ3RoO2krKykge1xuXHRcdGlmIChRLmJ5RmlsZVtpXS5sZW5ndGgpIG91dD1vdXQuY29uY2F0KFEuYnlGaWxlW2ldKTtcblx0fVxuXHRRLnJhd3Jlc3VsdD1vdXQ7XG5cdGNvdW50Rm9sZGVyRmlsZShRKTtcbn1cbnZhciBjb3VudEZvbGRlckZpbGU9ZnVuY3Rpb24oUSkge1xuXHRRLmZpbGVXaXRoSGl0Q291bnQ9MDtcblx0US5ieUZpbGUubWFwKGZ1bmN0aW9uKGYpe2lmIChmLmxlbmd0aCkgUS5maWxlV2l0aEhpdENvdW50Kyt9KTtcblx0XHRcdFxuXHRRLmZvbGRlcldpdGhIaXRDb3VudD0wO1xuXHRRLmJ5Rm9sZGVyLm1hcChmdW5jdGlvbihmKXtpZiAoZikgUS5mb2xkZXJXaXRoSGl0Q291bnQrK30pO1xufVxuXG52YXIgbWFpbj1mdW5jdGlvbihlbmdpbmUscSxvcHRzLGNiKXtcblx0dmFyIHN0YXJ0dGltZT1uZXcgRGF0ZSgpO1xuXHR2YXIgbWV0YT1lbmdpbmUuZ2V0KFwibWV0YVwiKTtcblx0aWYgKG1ldGEubm9ybWFsaXplICYmIGVuZ2luZS5hbmFseXplci5zZXROb3JtYWxpemVUYWJsZSkge1xuXHRcdG1ldGEubm9ybWFsaXplT2JqPWVuZ2luZS5hbmFseXplci5zZXROb3JtYWxpemVUYWJsZShtZXRhLm5vcm1hbGl6ZSxtZXRhLm5vcm1hbGl6ZU9iaik7XG5cdH1cblx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIGNiPW9wdHM7XG5cdG9wdHM9b3B0c3x8e307XG5cdHZhciBRPWVuZ2luZS5xdWVyeUNhY2hlW3FdO1xuXHRpZiAoIVEpIFE9bmV3UXVlcnkoZW5naW5lLHEsb3B0cyk7IFxuXHRpZiAoIVEpIHtcblx0XHRlbmdpbmUuc2VhcmNodGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRlbmdpbmUudG90YWx0aW1lPWVuZ2luZS5zZWFyY2h0aW1lO1xuXHRcdGlmIChlbmdpbmUuY29udGV4dCkgY2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW1wiZW1wdHkgcmVzdWx0XCIse3Jhd3Jlc3VsdDpbXX1dKTtcblx0XHRlbHNlIGNiKFwiZW1wdHkgcmVzdWx0XCIse3Jhd3Jlc3VsdDpbXX0pO1xuXHRcdHJldHVybjtcblx0fTtcblx0ZW5naW5lLnF1ZXJ5Q2FjaGVbcV09UTtcblx0aWYgKFEucGhyYXNlcy5sZW5ndGgpIHtcblx0XHRsb2FkUG9zdGluZ3MoZW5naW5lLFEudGVybXMsZnVuY3Rpb24oKXtcblx0XHRcdGlmICghUS5waHJhc2VzWzBdLnBvc3RpbmcpIHtcblx0XHRcdFx0ZW5naW5lLnNlYXJjaHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0XHRcdGVuZ2luZS50b3RhbHRpbWU9ZW5naW5lLnNlYXJjaHRpbWVcblxuXHRcdFx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbXCJubyBzdWNoIHBvc3RpbmdcIix7cmF3cmVzdWx0OltdfV0pO1xuXHRcdFx0XHRyZXR1cm47XHRcdFx0XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmICghUS5waHJhc2VzWzBdLnBvc3RpbmcubGVuZ3RoKSB7IC8vXG5cdFx0XHRcdFEucGhyYXNlcy5mb3JFYWNoKGxvYWRQaHJhc2UuYmluZChRKSk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoUS5waHJhc2VzLmxlbmd0aD09MSkge1xuXHRcdFx0XHRRLnJhd3Jlc3VsdD1RLnBocmFzZXNbMF0ucG9zdGluZztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBocmFzZV9pbnRlcnNlY3QoZW5naW5lLFEpO1xuXHRcdFx0fVxuXHRcdFx0dmFyIGZpbGVPZmZzZXRzPVEuZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInNlYXJjaCBvcHRzIFwiK0pTT04uc3RyaW5naWZ5KG9wdHMpKTtcblxuXHRcdFx0aWYgKCFRLmJ5RmlsZSAmJiBRLnJhd3Jlc3VsdCAmJiAhb3B0cy5ub2dyb3VwKSB7XG5cdFx0XHRcdFEuYnlGaWxlPXBsaXN0Lmdyb3VwYnlwb3N0aW5nMihRLnJhd3Jlc3VsdCwgZmlsZU9mZnNldHMpO1xuXHRcdFx0XHRRLmJ5RmlsZS5zaGlmdCgpO1EuYnlGaWxlLnBvcCgpO1xuXHRcdFx0XHRRLmJ5Rm9sZGVyPWdyb3VwQnlGb2xkZXIoZW5naW5lLFEuYnlGaWxlKTtcblxuXHRcdFx0XHRjb3VudEZvbGRlckZpbGUoUSk7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChvcHRzLnJhbmdlKSB7XG5cdFx0XHRcdGVuZ2luZS5zZWFyY2h0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdFx0XHRleGNlcnB0LnJlc3VsdGxpc3QoZW5naW5lLFEsb3B0cyxmdW5jdGlvbihkYXRhKSB7IFxuXHRcdFx0XHRcdC8vY29uc29sZS5sb2coXCJleGNlcnB0IG9rXCIpO1xuXHRcdFx0XHRcdFEuZXhjZXJwdD1kYXRhO1xuXHRcdFx0XHRcdGVuZ2luZS50b3RhbHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0XHRcdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsWzAsUV0pO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGVuZ2luZS5zZWFyY2h0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdFx0XHRlbmdpbmUudG90YWx0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdFx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbMCxRXSk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdH0gZWxzZSB7IC8vZW1wdHkgc2VhcmNoXG5cdFx0ZW5naW5lLnNlYXJjaHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0ZW5naW5lLnRvdGFsdGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbMCxRXSk7XG5cdH07XG59XG5cbm1haW4uc3BsaXRQaHJhc2U9c3BsaXRQaHJhc2U7IC8vanVzdCBmb3IgZGVidWdcbm1vZHVsZS5leHBvcnRzPW1haW47IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG4vKlxuY29udmVydCB0byBwdXJlIGpzXG5zYXZlIC1nIHJlYWN0aWZ5XG4qL1xudmFyIEU9UmVhY3QuY3JlYXRlRWxlbWVudDtcblxudmFyIGhhc2tzYW5hZ2FwPSh0eXBlb2Yga3NhbmFnYXAhPVwidW5kZWZpbmVkXCIpO1xuaWYgKGhhc2tzYW5hZ2FwICYmICh0eXBlb2YgY29uc29sZT09XCJ1bmRlZmluZWRcIiB8fCB0eXBlb2YgY29uc29sZS5sb2c9PVwidW5kZWZpbmVkXCIpKSB7XG5cdFx0d2luZG93LmNvbnNvbGU9e2xvZzprc2FuYWdhcC5sb2csZXJyb3I6a3NhbmFnYXAuZXJyb3IsZGVidWc6a3NhbmFnYXAuZGVidWcsd2Fybjprc2FuYWdhcC53YXJufTtcblx0XHRjb25zb2xlLmxvZyhcImluc3RhbGwgY29uc29sZSBvdXRwdXQgZnVuY2l0b25cIik7XG59XG5cbnZhciBjaGVja2ZzPWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gKG5hdmlnYXRvciAmJiBuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UpIHx8IGhhc2tzYW5hZ2FwO1xufVxudmFyIGZlYXR1cmVjaGVja3M9e1xuXHRcImZzXCI6Y2hlY2tmc1xufVxudmFyIGNoZWNrYnJvd3NlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xuXG5cdFx0dmFyIG1pc3NpbmdGZWF0dXJlcz10aGlzLmdldE1pc3NpbmdGZWF0dXJlcygpO1xuXHRcdHJldHVybiB7cmVhZHk6ZmFsc2UsIG1pc3Npbmc6bWlzc2luZ0ZlYXR1cmVzfTtcblx0fSxcblx0Z2V0TWlzc2luZ0ZlYXR1cmVzOmZ1bmN0aW9uKCkge1xuXHRcdHZhciBmZWF0dXJlPXRoaXMucHJvcHMuZmVhdHVyZS5zcGxpdChcIixcIik7XG5cdFx0dmFyIHN0YXR1cz1bXTtcblx0XHRmZWF0dXJlLm1hcChmdW5jdGlvbihmKXtcblx0XHRcdHZhciBjaGVja2VyPWZlYXR1cmVjaGVja3NbZl07XG5cdFx0XHRpZiAoY2hlY2tlcikgY2hlY2tlcj1jaGVja2VyKCk7XG5cdFx0XHRzdGF0dXMucHVzaChbZixjaGVja2VyXSk7XG5cdFx0fSk7XG5cdFx0cmV0dXJuIHN0YXR1cy5maWx0ZXIoZnVuY3Rpb24oZil7cmV0dXJuICFmWzFdfSk7XG5cdH0sXG5cdGRvd25sb2FkYnJvd3NlcjpmdW5jdGlvbigpIHtcblx0XHR3aW5kb3cubG9jYXRpb249XCJodHRwczovL3d3dy5nb29nbGUuY29tL2Nocm9tZS9cIlxuXHR9LFxuXHRyZW5kZXJNaXNzaW5nOmZ1bmN0aW9uKCkge1xuXHRcdHZhciBzaG93TWlzc2luZz1mdW5jdGlvbihtKSB7XG5cdFx0XHRyZXR1cm4gRShcImRpdlwiLCBudWxsLCBtKTtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHQgRShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcblx0XHQgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWRpYWxvZ1wifSwgXG5cdFx0ICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWNvbnRlbnRcIn0sIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJjbG9zZVwiLCBcImRhdGEtZGlzbWlzc1wiOiBcIm1vZGFsXCIsIFwiYXJpYS1oaWRkZW5cIjogXCJ0cnVlXCJ9LCBcIsOXXCIpLCBcblx0XHQgICAgICAgICAgRShcImg0XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtdGl0bGVcIn0sIFwiQnJvd3NlciBDaGVja1wiKVxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtYm9keVwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJwXCIsIG51bGwsIFwiU29ycnkgYnV0IHRoZSBmb2xsb3dpbmcgZmVhdHVyZSBpcyBtaXNzaW5nXCIpLCBcblx0XHQgICAgICAgICAgdGhpcy5zdGF0ZS5taXNzaW5nLm1hcChzaG93TWlzc2luZylcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWZvb3RlclwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuZG93bmxvYWRicm93c2VyLCB0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCJ9LCBcIkRvd25sb2FkIEdvb2dsZSBDaHJvbWVcIilcblx0XHQgICAgICAgIClcblx0XHQgICAgICApXG5cdFx0ICAgIClcblx0XHQgIClcblx0XHQgKTtcblx0fSxcblx0cmVuZGVyUmVhZHk6ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIEUoXCJzcGFuXCIsIG51bGwsIFwiYnJvd3NlciBva1wiKVxuXHR9LFxuXHRyZW5kZXI6ZnVuY3Rpb24oKXtcblx0XHRyZXR1cm4gICh0aGlzLnN0YXRlLm1pc3NpbmcubGVuZ3RoKT90aGlzLnJlbmRlck1pc3NpbmcoKTp0aGlzLnJlbmRlclJlYWR5KCk7XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OmZ1bmN0aW9uKCkge1xuXHRcdGlmICghdGhpcy5zdGF0ZS5taXNzaW5nLmxlbmd0aCkge1xuXHRcdFx0dGhpcy5wcm9wcy5vblJlYWR5KCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnc2hvdycpO1xuXHRcdH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzPWNoZWNrYnJvd3NlcjsiLCJcbnZhciB1c2VyQ2FuY2VsPWZhbHNlO1xudmFyIGZpbGVzPVtdO1xudmFyIHRvdGFsRG93bmxvYWRCeXRlPTA7XG52YXIgdGFyZ2V0UGF0aD1cIlwiO1xudmFyIHRlbXBQYXRoPVwiXCI7XG52YXIgbmZpbGU9MDtcbnZhciBiYXNldXJsPVwiXCI7XG52YXIgcmVzdWx0PVwiXCI7XG52YXIgZG93bmxvYWRpbmc9ZmFsc2U7XG52YXIgc3RhcnREb3dubG9hZD1mdW5jdGlvbihkYmlkLF9iYXNldXJsLF9maWxlcykgeyAvL3JldHVybiBkb3dubG9hZCBpZFxuXHR2YXIgZnMgICAgID0gcmVxdWlyZShcImZzXCIpO1xuXHR2YXIgcGF0aCAgID0gcmVxdWlyZShcInBhdGhcIik7XG5cblx0XG5cdGZpbGVzPV9maWxlcy5zcGxpdChcIlxcdWZmZmZcIik7XG5cdGlmIChkb3dubG9hZGluZykgcmV0dXJuIGZhbHNlOyAvL29ubHkgb25lIHNlc3Npb25cblx0dXNlckNhbmNlbD1mYWxzZTtcblx0dG90YWxEb3dubG9hZEJ5dGU9MDtcblx0bmV4dEZpbGUoKTtcblx0ZG93bmxvYWRpbmc9dHJ1ZTtcblx0YmFzZXVybD1fYmFzZXVybDtcblx0aWYgKGJhc2V1cmxbYmFzZXVybC5sZW5ndGgtMV0hPScvJyliYXNldXJsKz0nLyc7XG5cdHRhcmdldFBhdGg9a3NhbmFnYXAucm9vdFBhdGgrZGJpZCsnLyc7XG5cdHRlbXBQYXRoPWtzYW5hZ2FwLnJvb3RQYXRoK1wiLnRtcC9cIjtcblx0cmVzdWx0PVwiXCI7XG5cdHJldHVybiB0cnVlO1xufVxuXG52YXIgbmV4dEZpbGU9ZnVuY3Rpb24oKSB7XG5cdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRpZiAobmZpbGU9PWZpbGVzLmxlbmd0aCkge1xuXHRcdFx0bmZpbGUrKztcblx0XHRcdGVuZERvd25sb2FkKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGRvd25sb2FkRmlsZShuZmlsZSsrKTtcdFxuXHRcdH1cblx0fSwxMDApO1xufVxuXG52YXIgZG93bmxvYWRGaWxlPWZ1bmN0aW9uKG5maWxlKSB7XG5cdHZhciB1cmw9YmFzZXVybCtmaWxlc1tuZmlsZV07XG5cdHZhciB0bXBmaWxlbmFtZT10ZW1wUGF0aCtmaWxlc1tuZmlsZV07XG5cdHZhciBta2RpcnAgPSByZXF1aXJlKFwiLi9ta2RpcnBcIik7XG5cdHZhciBmcyAgICAgPSByZXF1aXJlKFwiZnNcIik7XG5cdHZhciBodHRwICAgPSByZXF1aXJlKFwiaHR0cFwiKTtcblxuXHRta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUodG1wZmlsZW5hbWUpKTtcblx0dmFyIHdyaXRlU3RyZWFtID0gZnMuY3JlYXRlV3JpdGVTdHJlYW0odG1wZmlsZW5hbWUpO1xuXHR2YXIgZGF0YWxlbmd0aD0wO1xuXHR2YXIgcmVxdWVzdCA9IGh0dHAuZ2V0KHVybCwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcblx0XHRyZXNwb25zZS5vbignZGF0YScsZnVuY3Rpb24oY2h1bmspe1xuXHRcdFx0d3JpdGVTdHJlYW0ud3JpdGUoY2h1bmspO1xuXHRcdFx0dG90YWxEb3dubG9hZEJ5dGUrPWNodW5rLmxlbmd0aDtcblx0XHRcdGlmICh1c2VyQ2FuY2VsKSB7XG5cdFx0XHRcdHdyaXRlU3RyZWFtLmVuZCgpO1xuXHRcdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bmV4dEZpbGUoKTt9LDEwMCk7XG5cdFx0XHR9XG5cdFx0fSk7XG5cdFx0cmVzcG9uc2Uub24oXCJlbmRcIixmdW5jdGlvbigpIHtcblx0XHRcdHdyaXRlU3RyZWFtLmVuZCgpO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe25leHRGaWxlKCk7fSwxMDApO1xuXHRcdH0pO1xuXHR9KTtcbn1cblxudmFyIGNhbmNlbERvd25sb2FkPWZ1bmN0aW9uKCkge1xuXHR1c2VyQ2FuY2VsPXRydWU7XG5cdGVuZERvd25sb2FkKCk7XG59XG52YXIgdmVyaWZ5PWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdHJ1ZTtcbn1cbnZhciBlbmREb3dubG9hZD1mdW5jdGlvbigpIHtcblx0bmZpbGU9ZmlsZXMubGVuZ3RoKzE7Ly9zdG9wXG5cdHJlc3VsdD1cImNhbmNlbGxlZFwiO1xuXHRkb3dubG9hZGluZz1mYWxzZTtcblx0aWYgKHVzZXJDYW5jZWwpIHJldHVybjtcblx0dmFyIGZzICAgICA9IHJlcXVpcmUoXCJmc1wiKTtcblx0dmFyIG1rZGlycCA9IHJlcXVpcmUoXCIuL21rZGlycFwiKTtcblxuXHRmb3IgKHZhciBpPTA7aTxmaWxlcy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIHRhcmdldGZpbGVuYW1lPXRhcmdldFBhdGgrZmlsZXNbaV07XG5cdFx0dmFyIHRtcGZpbGVuYW1lICAgPXRlbXBQYXRoK2ZpbGVzW2ldO1xuXHRcdG1rZGlycC5zeW5jKHBhdGguZGlybmFtZSh0YXJnZXRmaWxlbmFtZSkpO1xuXHRcdGZzLnJlbmFtZVN5bmModG1wZmlsZW5hbWUsdGFyZ2V0ZmlsZW5hbWUpO1xuXHR9XG5cdGlmICh2ZXJpZnkoKSkge1xuXHRcdHJlc3VsdD1cInN1Y2Nlc3NcIjtcblx0fSBlbHNlIHtcblx0XHRyZXN1bHQ9XCJlcnJvclwiO1xuXHR9XG59XG5cbnZhciBkb3dubG9hZGVkQnl0ZT1mdW5jdGlvbigpIHtcblx0cmV0dXJuIHRvdGFsRG93bmxvYWRCeXRlO1xufVxudmFyIGRvbmVEb3dubG9hZD1mdW5jdGlvbigpIHtcblx0aWYgKG5maWxlPmZpbGVzLmxlbmd0aCkgcmV0dXJuIHJlc3VsdDtcblx0ZWxzZSByZXR1cm4gXCJcIjtcbn1cbnZhciBkb3dubG9hZGluZ0ZpbGU9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBuZmlsZS0xO1xufVxuXG52YXIgZG93bmxvYWRlcj17c3RhcnREb3dubG9hZDpzdGFydERvd25sb2FkLCBkb3dubG9hZGVkQnl0ZTpkb3dubG9hZGVkQnl0ZSxcblx0ZG93bmxvYWRpbmdGaWxlOmRvd25sb2FkaW5nRmlsZSwgY2FuY2VsRG93bmxvYWQ6Y2FuY2VsRG93bmxvYWQsZG9uZURvd25sb2FkOmRvbmVEb3dubG9hZH07XG5tb2R1bGUuZXhwb3J0cz1kb3dubG9hZGVyOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuXG4vKiB0b2RvICwgb3B0aW9uYWwga2RiICovXG5cbnZhciBIdG1sRlM9cmVxdWlyZShcIi4vaHRtbGZzXCIpO1xudmFyIGh0bWw1ZnM9cmVxdWlyZShcIi4vaHRtbDVmc1wiKTtcbnZhciBDaGVja0Jyb3dzZXI9cmVxdWlyZShcIi4vY2hlY2ticm93c2VyXCIpO1xudmFyIEU9UmVhY3QuY3JlYXRlRWxlbWVudDtcbiAgXG5cbnZhciBGaWxlTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiB7ZG93bmxvYWRpbmc6ZmFsc2UscHJvZ3Jlc3M6MH07XG5cdH0sXG5cdHVwZGF0YWJsZTpmdW5jdGlvbihmKSB7XG4gICAgICAgIHZhciBjbGFzc2VzPVwiYnRuIGJ0bi13YXJuaW5nXCI7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmRvd25sb2FkaW5nKSBjbGFzc2VzKz1cIiBkaXNhYmxlZFwiO1xuXHRcdGlmIChmLmhhc1VwZGF0ZSkgcmV0dXJuICAgRShcImJ1dHRvblwiLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLCBcblx0XHRcdFwiZGF0YS1maWxlbmFtZVwiOiBmLmZpbGVuYW1lLCBcImRhdGEtdXJsXCI6IGYudXJsLCBcblx0ICAgICAgICAgICAgb25DbGljazogdGhpcy5kb3dubG9hZFxuXHQgICAgICAgfSwgXCJVcGRhdGVcIilcblx0XHRlbHNlIHJldHVybiBudWxsO1xuXHR9LFxuXHRzaG93TG9jYWw6ZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgY2xhc3Nlcz1cImJ0biBidG4tZGFuZ2VyXCI7XG4gICAgICAgIGlmICh0aGlzLnN0YXRlLmRvd25sb2FkaW5nKSBjbGFzc2VzKz1cIiBkaXNhYmxlZFwiO1xuXHQgIHJldHVybiBFKFwidHJcIiwgbnVsbCwgRShcInRkXCIsIG51bGwsIGYuZmlsZW5hbWUpLCBcblx0ICAgICAgRShcInRkXCIsIG51bGwpLCBcblx0ICAgICAgRShcInRkXCIsIHtjbGFzc05hbWU6IFwicHVsbC1yaWdodFwifSwgXG5cdCAgICAgIHRoaXMudXBkYXRhYmxlKGYpLCBFKFwiYnV0dG9uXCIsIHtjbGFzc05hbWU6IGNsYXNzZXMsIFxuXHQgICAgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRlbGV0ZUZpbGUsIFwiZGF0YS1maWxlbmFtZVwiOiBmLmZpbGVuYW1lfSwgXCJEZWxldGVcIilcblx0ICAgICAgICBcblx0ICAgICAgKVxuXHQgIClcblx0fSwgIFxuXHRzaG93UmVtb3RlOmZ1bmN0aW9uKGYpIHsgXG5cdCAgdmFyIGNsYXNzZXM9XCJidG4gYnRuLXdhcm5pbmdcIjtcblx0ICBpZiAodGhpcy5zdGF0ZS5kb3dubG9hZGluZykgY2xhc3Nlcys9XCIgZGlzYWJsZWRcIjtcblx0ICByZXR1cm4gKEUoXCJ0clwiLCB7XCJkYXRhLWlkXCI6IGYuZmlsZW5hbWV9LCBFKFwidGRcIiwgbnVsbCwgXG5cdCAgICAgIGYuZmlsZW5hbWUpLCBcblx0ICAgICAgRShcInRkXCIsIG51bGwsIGYuZGVzYyksIFxuXHQgICAgICBFKFwidGRcIiwgbnVsbCwgXG5cdCAgICAgIEUoXCJzcGFuXCIsIHtcImRhdGEtZmlsZW5hbWVcIjogZi5maWxlbmFtZSwgXCJkYXRhLXVybFwiOiBmLnVybCwgXG5cdCAgICAgICAgICAgIGNsYXNzTmFtZTogY2xhc3NlcywgXG5cdCAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuZG93bmxvYWR9LCBcIkRvd25sb2FkXCIpXG5cdCAgICAgIClcblx0ICApKTtcblx0fSxcblx0c2hvd0ZpbGU6ZnVuY3Rpb24oZikge1xuXHQvL1x0cmV0dXJuIDxzcGFuIGRhdGEtaWQ9e2YuZmlsZW5hbWV9PntmLnVybH08L3NwYW4+XG5cdFx0cmV0dXJuIChmLnJlYWR5KT90aGlzLnNob3dMb2NhbChmKTp0aGlzLnNob3dSZW1vdGUoZik7XG5cdH0sXG5cdHJlbG9hZERpcjpmdW5jdGlvbigpIHtcblx0XHR0aGlzLnByb3BzLmFjdGlvbihcInJlbG9hZFwiKTtcblx0fSxcblx0ZG93bmxvYWQ6ZnVuY3Rpb24oZSkge1xuXHRcdHZhciB1cmw9ZS50YXJnZXQuZGF0YXNldFtcInVybFwiXTtcblx0XHR2YXIgZmlsZW5hbWU9ZS50YXJnZXQuZGF0YXNldFtcImZpbGVuYW1lXCJdO1xuXHRcdHRoaXMuc2V0U3RhdGUoe2Rvd25sb2FkaW5nOnRydWUscHJvZ3Jlc3M6MCx1cmw6dXJsfSk7XG5cdFx0dGhpcy51c2VyYnJlYWs9ZmFsc2U7XG5cdFx0aHRtbDVmcy5kb3dubG9hZCh1cmwsZmlsZW5hbWUsZnVuY3Rpb24oKXtcblx0XHRcdHRoaXMucmVsb2FkRGlyKCk7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtkb3dubG9hZGluZzpmYWxzZSxwcm9ncmVzczoxfSk7XG5cdFx0XHR9LGZ1bmN0aW9uKHByb2dyZXNzLHRvdGFsKXtcblx0XHRcdFx0aWYgKHByb2dyZXNzPT0wKSB7XG5cdFx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7bWVzc2FnZTpcInRvdGFsIFwiK3RvdGFsfSlcblx0XHRcdCBcdH1cblx0XHRcdCBcdHRoaXMuc2V0U3RhdGUoe3Byb2dyZXNzOnByb2dyZXNzfSk7XG5cdFx0XHQgXHQvL2lmIHVzZXIgcHJlc3MgYWJvcnQgcmV0dXJuIHRydWVcblx0XHRcdCBcdHJldHVybiB0aGlzLnVzZXJicmVhaztcblx0XHRcdH1cblx0XHQsdGhpcyk7XG5cdH0sXG5cdGRlbGV0ZUZpbGU6ZnVuY3Rpb24oIGUpIHtcblx0XHR2YXIgZmlsZW5hbWU9ZS50YXJnZXQuYXR0cmlidXRlc1tcImRhdGEtZmlsZW5hbWVcIl0udmFsdWU7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJkZWxldGVcIixmaWxlbmFtZSk7XG5cdH0sXG5cdGFsbEZpbGVzUmVhZHk6ZnVuY3Rpb24oZSkge1xuXHRcdHJldHVybiB0aGlzLnByb3BzLmZpbGVzLmV2ZXJ5KGZ1bmN0aW9uKGYpeyByZXR1cm4gZi5yZWFkeX0pO1xuXHR9LFxuXHRkaXNtaXNzOmZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9uKFwiZGlzbWlzc1wiKTtcblx0fSxcblx0YWJvcnRkb3dubG9hZDpmdW5jdGlvbigpIHtcblx0XHR0aGlzLnVzZXJicmVhaz10cnVlO1xuXHR9LFxuXHRzaG93UHJvZ3Jlc3M6ZnVuY3Rpb24oKSB7XG5cdCAgICAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIHtcblx0ICAgICAgdmFyIHByb2dyZXNzPU1hdGgucm91bmQodGhpcy5zdGF0ZS5wcm9ncmVzcyoxMDApO1xuXHQgICAgICByZXR1cm4gKFxuXHQgICAgICBcdEUoXCJkaXZcIiwgbnVsbCwgXG5cdCAgICAgIFx0XCJEb3dubG9hZGluZyBmcm9tIFwiLCB0aGlzLnN0YXRlLnVybCwgXG5cdCAgICAgIEUoXCJkaXZcIiwge2tleTogXCJwcm9ncmVzc1wiLCBjbGFzc05hbWU6IFwicHJvZ3Jlc3MgY29sLW1kLThcIn0sIFxuXHQgICAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByb2dyZXNzLWJhclwiLCByb2xlOiBcInByb2dyZXNzYmFyXCIsIFxuXHQgICAgICAgICAgICAgIFwiYXJpYS12YWx1ZW5vd1wiOiBwcm9ncmVzcywgXCJhcmlhLXZhbHVlbWluXCI6IFwiMFwiLCBcblx0ICAgICAgICAgICAgICBcImFyaWEtdmFsdWVtYXhcIjogXCIxMDBcIiwgc3R5bGU6IHt3aWR0aDogcHJvZ3Jlc3MrXCIlXCJ9fSwgXG5cdCAgICAgICAgICAgIHByb2dyZXNzLCBcIiVcIlxuXHQgICAgICAgICAgKVxuXHQgICAgICAgICksIFxuXHQgICAgICAgIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuYWJvcnRkb3dubG9hZCwgXG5cdCAgICAgICAgXHRjbGFzc05hbWU6IFwiYnRuIGJ0bi1kYW5nZXIgY29sLW1kLTRcIn0sIFwiQWJvcnRcIilcblx0ICAgICAgICApXG5cdCAgICAgICAgKTtcblx0ICAgICAgfSBlbHNlIHtcblx0ICAgICAgXHRcdGlmICggdGhpcy5hbGxGaWxlc1JlYWR5KCkgKSB7XG5cdCAgICAgIFx0XHRcdHJldHVybiBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmRpc21pc3MsIGNsYXNzTmFtZTogXCJidG4gYnRuLXN1Y2Nlc3NcIn0sIFwiT2tcIilcblx0ICAgICAgXHRcdH0gZWxzZSByZXR1cm4gbnVsbDtcblx0ICAgICAgXHRcdFxuXHQgICAgICB9XG5cdH0sXG5cdHNob3dVc2FnZTpmdW5jdGlvbigpIHtcblx0XHR2YXIgcGVyY2VudD10aGlzLnByb3BzLnJlbWFpblBlcmNlbnQ7XG4gICAgICAgICAgIHJldHVybiAoRShcImRpdlwiLCBudWxsLCBFKFwic3BhblwiLCB7Y2xhc3NOYW1lOiBcInB1bGwtbGVmdFwifSwgXCJVc2FnZTpcIiksIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwcm9ncmVzc1wifSwgXG5cdFx0ICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyIHByb2dyZXNzLWJhci1zdWNjZXNzIHByb2dyZXNzLWJhci1zdHJpcGVkXCIsIHJvbGU6IFwicHJvZ3Jlc3NiYXJcIiwgc3R5bGU6IHt3aWR0aDogcGVyY2VudCtcIiVcIn19LCBcblx0XHQgICAgXHRwZXJjZW50K1wiJVwiXG5cdFx0ICApXG5cdFx0KSkpO1xuXHR9LFxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XG5cdCAgXHRyZXR1cm4gKFxuXHRcdEUoXCJkaXZcIiwge3JlZjogXCJkaWFsb2cxXCIsIGNsYXNzTmFtZTogXCJtb2RhbCBmYWRlXCIsIFwiZGF0YS1iYWNrZHJvcFwiOiBcInN0YXRpY1wifSwgXG5cdFx0ICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1kaWFsb2dcIn0sIFxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1oZWFkZXJcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiaDRcIiwge2NsYXNzTmFtZTogXCJtb2RhbC10aXRsZVwifSwgXCJGaWxlIEluc3RhbGxlclwiKVxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtYm9keVwifSwgXG5cdFx0ICAgICAgICBcdEUoXCJ0YWJsZVwiLCB7Y2xhc3NOYW1lOiBcInRhYmxlXCJ9LCBcblx0XHQgICAgICAgIFx0RShcInRib2R5XCIsIG51bGwsIFxuXHRcdCAgICAgICAgICBcdHRoaXMucHJvcHMuZmlsZXMubWFwKHRoaXMuc2hvd0ZpbGUpXG5cdFx0ICAgICAgICAgIFx0KVxuXHRcdCAgICAgICAgICApXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1mb290ZXJcIn0sIFxuXHRcdCAgICAgICAgXHR0aGlzLnNob3dVc2FnZSgpLCBcblx0XHQgICAgICAgICAgIHRoaXMuc2hvd1Byb2dyZXNzKClcblx0XHQgICAgICAgIClcblx0XHQgICAgICApXG5cdFx0ICAgIClcblx0XHQgIClcblx0XHQpO1xuXHR9LFx0XG5cdGNvbXBvbmVudERpZE1vdW50OmZ1bmN0aW9uKCkge1xuXHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnc2hvdycpO1xuXHR9XG59KTtcbi8qVE9ETyBrZGIgY2hlY2sgdmVyc2lvbiovXG52YXIgRmlsZW1hbmFnZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcblx0XHR2YXIgcXVvdGE9dGhpcy5nZXRRdW90YSgpO1xuXHRcdHJldHVybiB7YnJvd3NlclJlYWR5OmZhbHNlLG5vdXBkYXRlOnRydWUsXHRyZXF1ZXN0UXVvdGE6cXVvdGEscmVtYWluOjB9O1xuXHR9LFxuXHRnZXRRdW90YTpmdW5jdGlvbigpIHtcblx0XHR2YXIgcT10aGlzLnByb3BzLnF1b3RhfHxcIjEyOE1cIjtcblx0XHR2YXIgdW5pdD1xW3EubGVuZ3RoLTFdO1xuXHRcdHZhciB0aW1lcz0xO1xuXHRcdGlmICh1bml0PT1cIk1cIikgdGltZXM9MTAyNCoxMDI0O1xuXHRcdGVsc2UgaWYgKHVuaXQ9XCJLXCIpIHRpbWVzPTEwMjQ7XG5cdFx0cmV0dXJuIHBhcnNlSW50KHEpICogdGltZXM7XG5cdH0sXG5cdG1pc3NpbmdLZGI6ZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtIT1cImNocm9tZVwiKSByZXR1cm4gW107XG5cdFx0dmFyIG1pc3Npbmc9dGhpcy5wcm9wcy5uZWVkZWQuZmlsdGVyKGZ1bmN0aW9uKGtkYil7XG5cdFx0XHRmb3IgKHZhciBpIGluIGh0bWw1ZnMuZmlsZXMpIHtcblx0XHRcdFx0aWYgKGh0bWw1ZnMuZmlsZXNbaV1bMF09PWtkYi5maWxlbmFtZSkgcmV0dXJuIGZhbHNlO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0fSx0aGlzKTtcblx0XHRyZXR1cm4gbWlzc2luZztcblx0fSxcblx0Z2V0UmVtb3RlVXJsOmZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIGY9dGhpcy5wcm9wcy5uZWVkZWQuZmlsdGVyKGZ1bmN0aW9uKGYpe3JldHVybiBmLmZpbGVuYW1lPT1mbn0pO1xuXHRcdGlmIChmLmxlbmd0aCApIHJldHVybiBmWzBdLnVybDtcblx0fSxcblx0Z2VuRmlsZUxpc3Q6ZnVuY3Rpb24oZXhpc3RpbmcsbWlzc2luZyl7XG5cdFx0dmFyIG91dD1bXTtcblx0XHRmb3IgKHZhciBpIGluIGV4aXN0aW5nKSB7XG5cdFx0XHR2YXIgdXJsPXRoaXMuZ2V0UmVtb3RlVXJsKGV4aXN0aW5nW2ldWzBdKTtcblx0XHRcdG91dC5wdXNoKHtmaWxlbmFtZTpleGlzdGluZ1tpXVswXSwgdXJsIDp1cmwsIHJlYWR5OnRydWUgfSk7XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgaW4gbWlzc2luZykge1xuXHRcdFx0b3V0LnB1c2gobWlzc2luZ1tpXSk7XG5cdFx0fVxuXHRcdHJldHVybiBvdXQ7XG5cdH0sXG5cdHJlbG9hZDpmdW5jdGlvbigpIHtcblx0XHRodG1sNWZzLnJlYWRkaXIoZnVuY3Rpb24oZmlsZXMpe1xuICBcdFx0XHR0aGlzLnNldFN0YXRlKHtmaWxlczp0aGlzLmdlbkZpbGVMaXN0KGZpbGVzLHRoaXMubWlzc2luZ0tkYigpKX0pO1xuICBcdFx0fSx0aGlzKTtcblx0IH0sXG5cdGRlbGV0ZUZpbGU6ZnVuY3Rpb24oZm4pIHtcblx0ICBodG1sNWZzLnJtKGZuLGZ1bmN0aW9uKCl7XG5cdCAgXHR0aGlzLnJlbG9hZCgpO1xuXHQgIH0sdGhpcyk7XG5cdH0sXG5cdG9uUXVvdGVPazpmdW5jdGlvbihxdW90YSx1c2FnZSkge1xuXHRcdGlmIChrc2FuYWdhcC5wbGF0Zm9ybSE9XCJjaHJvbWVcIikge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcIm9ucXVvdGVva1wiKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe25vdXBkYXRlOnRydWUsbWlzc2luZzpbXSxmaWxlczpbXSxhdXRvY2xvc2U6dHJ1ZVxuXHRcdFx0XHQscXVvdGE6cXVvdGEscmVtYWluOnF1b3RhLXVzYWdlLHVzYWdlOnVzYWdlfSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdC8vY29uc29sZS5sb2coXCJxdW90ZSBva1wiKTtcblx0XHR2YXIgZmlsZXM9dGhpcy5nZW5GaWxlTGlzdChodG1sNWZzLmZpbGVzLHRoaXMubWlzc2luZ0tkYigpKTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHRoYXQuY2hlY2tJZlVwZGF0ZShmaWxlcyxmdW5jdGlvbihoYXN1cGRhdGUpIHtcblx0XHRcdHZhciBtaXNzaW5nPXRoaXMubWlzc2luZ0tkYigpO1xuXHRcdFx0dmFyIGF1dG9jbG9zZT10aGlzLnByb3BzLmF1dG9jbG9zZTtcblx0XHRcdGlmIChtaXNzaW5nLmxlbmd0aCkgYXV0b2Nsb3NlPWZhbHNlO1xuXHRcdFx0dGhhdC5zZXRTdGF0ZSh7YXV0b2Nsb3NlOmF1dG9jbG9zZSxcblx0XHRcdFx0cXVvdGE6cXVvdGEsdXNhZ2U6dXNhZ2UsZmlsZXM6ZmlsZXMsXG5cdFx0XHRcdG1pc3Npbmc6bWlzc2luZyxcblx0XHRcdFx0bm91cGRhdGU6IWhhc3VwZGF0ZSxcblx0XHRcdFx0cmVtYWluOnF1b3RhLXVzYWdlfSk7XG5cdFx0fSk7XG5cdH0sICBcblx0b25Ccm93c2VyT2s6ZnVuY3Rpb24oKSB7XG5cdCAgdGhpcy50b3RhbERvd25sb2FkU2l6ZSgpO1xuXHR9LCBcblx0ZGlzbWlzczpmdW5jdGlvbigpIHtcblx0XHR0aGlzLnByb3BzLm9uUmVhZHkodGhpcy5zdGF0ZS51c2FnZSx0aGlzLnN0YXRlLnF1b3RhKTtcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHR2YXIgbW9kYWxpbj0kKFwiLm1vZGFsLmluXCIpO1xuXHRcdFx0aWYgKG1vZGFsaW4ubW9kYWwpIG1vZGFsaW4ubW9kYWwoJ2hpZGUnKTtcblx0XHR9LDUwMCk7XG5cdH0sIFxuXHR0b3RhbERvd25sb2FkU2l6ZTpmdW5jdGlvbigpIHtcblx0XHR2YXIgZmlsZXM9dGhpcy5taXNzaW5nS2RiKCk7XG5cdFx0dmFyIHRhc2txdWV1ZT1bXSx0b3RhbHNpemU9MDtcblx0XHRmb3IgKHZhciBpPTA7aTxmaWxlcy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR0YXNrcXVldWUucHVzaChcblx0XHRcdFx0KGZ1bmN0aW9uKGlkeCl7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdGlmICghKHR5cGVvZiBkYXRhPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSB0b3RhbHNpemUrPWRhdGE7XG5cdFx0XHRcdFx0XHRodG1sNWZzLmdldERvd25sb2FkU2l6ZShmaWxlc1tpZHhdLnVybCx0YXNrcXVldWUuc2hpZnQoKSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pKGkpXG5cdFx0XHQpO1xuXHRcdH1cblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEpe1x0XG5cdFx0XHR0b3RhbHNpemUrPWRhdGE7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dGhhdC5zZXRTdGF0ZSh7cmVxdWlyZVNwYWNlOnRvdGFsc2l6ZSxicm93c2VyUmVhZHk6dHJ1ZX0pfSwwKTtcblx0XHR9KTtcblx0XHR0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7XG5cdH0sXG5cdGNoZWNrSWZVcGRhdGU6ZnVuY3Rpb24oZmlsZXMsY2IpIHtcblx0XHR2YXIgdGFza3F1ZXVlPVtdO1xuXHRcdGZvciAodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspIHtcblx0XHRcdHRhc2txdWV1ZS5wdXNoKFxuXHRcdFx0XHQoZnVuY3Rpb24oaWR4KXtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKCEodHlwZW9mIGRhdGE9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkpIGZpbGVzW2lkeC0xXS5oYXNVcGRhdGU9ZGF0YTtcblx0XHRcdFx0XHRcdGh0bWw1ZnMuY2hlY2tVcGRhdGUoZmlsZXNbaWR4XS51cmwsZmlsZXNbaWR4XS5maWxlbmFtZSx0YXNrcXVldWUuc2hpZnQoKSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH0pKGkpXG5cdFx0XHQpO1xuXHRcdH1cblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEpe1x0XG5cdFx0XHRmaWxlc1tmaWxlcy5sZW5ndGgtMV0uaGFzVXBkYXRlPWRhdGE7XG5cdFx0XHR2YXIgaGFzdXBkYXRlPWZpbGVzLnNvbWUoZnVuY3Rpb24oZil7cmV0dXJuIGYuaGFzVXBkYXRlfSk7XG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KHRoYXQsW2hhc3VwZGF0ZV0pO1xuXHRcdH0pO1xuXHRcdHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTtcblx0fSxcblx0cmVuZGVyOmZ1bmN0aW9uKCl7XG4gICAgXHRcdGlmICghdGhpcy5zdGF0ZS5icm93c2VyUmVhZHkpIHsgICBcbiAgICAgIFx0XHRcdHJldHVybiBFKENoZWNrQnJvd3Nlciwge2ZlYXR1cmU6IFwiZnNcIiwgb25SZWFkeTogdGhpcy5vbkJyb3dzZXJPa30pXG4gICAgXHRcdH0gaWYgKCF0aGlzLnN0YXRlLnF1b3RhIHx8IHRoaXMuc3RhdGUucmVtYWluPHRoaXMuc3RhdGUucmVxdWlyZVNwYWNlKSB7ICBcbiAgICBcdFx0XHR2YXIgcXVvdGE9dGhpcy5zdGF0ZS5yZXF1ZXN0UXVvdGE7XG4gICAgXHRcdFx0aWYgKHRoaXMuc3RhdGUudXNhZ2UrdGhpcy5zdGF0ZS5yZXF1aXJlU3BhY2U+cXVvdGEpIHtcbiAgICBcdFx0XHRcdHF1b3RhPSh0aGlzLnN0YXRlLnVzYWdlK3RoaXMuc3RhdGUucmVxdWlyZVNwYWNlKSoxLjU7XG4gICAgXHRcdFx0fVxuICAgICAgXHRcdFx0cmV0dXJuIEUoSHRtbEZTLCB7cXVvdGE6IHF1b3RhLCBhdXRvY2xvc2U6IFwidHJ1ZVwiLCBvblJlYWR5OiB0aGlzLm9uUXVvdGVPa30pXG4gICAgICBcdFx0fSBlbHNlIHtcblx0XHRcdGlmICghdGhpcy5zdGF0ZS5ub3VwZGF0ZSB8fCB0aGlzLm1pc3NpbmdLZGIoKS5sZW5ndGggfHwgIXRoaXMuc3RhdGUuYXV0b2Nsb3NlKSB7XG5cdFx0XHRcdHZhciByZW1haW49TWF0aC5yb3VuZCgodGhpcy5zdGF0ZS51c2FnZS90aGlzLnN0YXRlLnF1b3RhKSoxMDApO1x0XHRcdFx0XG5cdFx0XHRcdHJldHVybiBFKEZpbGVMaXN0LCB7YWN0aW9uOiB0aGlzLmFjdGlvbiwgZmlsZXM6IHRoaXMuc3RhdGUuZmlsZXMsIHJlbWFpblBlcmNlbnQ6IHJlbWFpbn0pXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzZXRUaW1lb3V0KCB0aGlzLmRpc21pc3MgLDApO1xuXHRcdFx0XHRyZXR1cm4gRShcInNwYW5cIiwgbnVsbCwgXCJTdWNjZXNzXCIpO1xuXHRcdFx0fVxuICAgICAgXHRcdH1cblx0fSxcblx0YWN0aW9uOmZ1bmN0aW9uKCkge1xuXHQgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcblx0ICB2YXIgdHlwZT1hcmdzLnNoaWZ0KCk7XG5cdCAgdmFyIHJlcz1udWxsLCB0aGF0PXRoaXM7XG5cdCAgaWYgKHR5cGU9PVwiZGVsZXRlXCIpIHtcblx0ICAgIHRoaXMuZGVsZXRlRmlsZShhcmdzWzBdKTtcblx0ICB9ICBlbHNlIGlmICh0eXBlPT1cInJlbG9hZFwiKSB7XG5cdCAgXHR0aGlzLnJlbG9hZCgpO1xuXHQgIH0gZWxzZSBpZiAodHlwZT09XCJkaXNtaXNzXCIpIHtcblx0ICBcdHRoaXMuZGlzbWlzcygpO1xuXHQgIH1cblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzPUZpbGVtYW5hZ2VyOyIsIi8qIGVtdWxhdGUgZmlsZXN5c3RlbSBvbiBodG1sNSBicm93c2VyICovXG52YXIgZ2V0X2hlYWQ9ZnVuY3Rpb24odXJsLGZpZWxkLGNiKXtcblx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHR4aHIub3BlbihcIkhFQURcIiwgdXJsLCB0cnVlKTtcblx0eGhyLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHRoaXMucmVhZHlTdGF0ZSA9PSB0aGlzLkRPTkUpIHtcblx0XHRcdFx0Y2IoeGhyLmdldFJlc3BvbnNlSGVhZGVyKGZpZWxkKSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAodGhpcy5zdGF0dXMhPT0yMDAmJnRoaXMuc3RhdHVzIT09MjA2KSB7XG5cdFx0XHRcdFx0Y2IoXCJcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0gXG5cdH07XG5cdHhoci5zZW5kKCk7XHRcbn1cbnZhciBnZXRfZGF0ZT1mdW5jdGlvbih1cmwsY2IpIHtcblx0Z2V0X2hlYWQodXJsLFwiTGFzdC1Nb2RpZmllZFwiLGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRjYih2YWx1ZSk7XG5cdH0pO1xufVxudmFyIGdldF9zaXplPWZ1bmN0aW9uKHVybCwgY2IpIHtcblx0Z2V0X2hlYWQodXJsLFwiQ29udGVudC1MZW5ndGhcIixmdW5jdGlvbih2YWx1ZSl7XG5cdFx0Y2IocGFyc2VJbnQodmFsdWUpKTtcblx0fSk7XG59O1xudmFyIGNoZWNrVXBkYXRlPWZ1bmN0aW9uKHVybCxmbixjYikge1xuXHRpZiAoIXVybCkge1xuXHRcdGNiKGZhbHNlKTtcblx0XHRyZXR1cm47XG5cdH1cblx0Z2V0X2RhdGUodXJsLGZ1bmN0aW9uKGQpe1xuXHRcdEFQSS5mcy5yb290LmdldEZpbGUoZm4sIHtjcmVhdGU6IGZhbHNlLCBleGNsdXNpdmU6IGZhbHNlfSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG5cdFx0XHRmaWxlRW50cnkuZ2V0TWV0YWRhdGEoZnVuY3Rpb24obWV0YWRhdGEpe1xuXHRcdFx0XHR2YXIgbG9jYWxEYXRlPURhdGUucGFyc2UobWV0YWRhdGEubW9kaWZpY2F0aW9uVGltZSk7XG5cdFx0XHRcdHZhciB1cmxEYXRlPURhdGUucGFyc2UoZCk7XG5cdFx0XHRcdGNiKHVybERhdGU+bG9jYWxEYXRlKTtcblx0XHRcdH0pO1xuXHRcdH0sZnVuY3Rpb24oKXtcblx0XHRcdGNiKGZhbHNlKTtcblx0XHR9KTtcblx0fSk7XG59XG52YXIgZG93bmxvYWQ9ZnVuY3Rpb24odXJsLGZuLGNiLHN0YXR1c2NiLGNvbnRleHQpIHtcblx0IHZhciB0b3RhbHNpemU9MCxiYXRjaGVzPW51bGwsd3JpdHRlbj0wO1xuXHQgdmFyIGZpbGVFbnRyeT0wLCBmaWxlV3JpdGVyPTA7XG5cdCB2YXIgY3JlYXRlQmF0Y2hlcz1mdW5jdGlvbihzaXplKSB7XG5cdFx0dmFyIGJ5dGVzPTEwMjQqMTAyNCwgb3V0PVtdO1xuXHRcdHZhciBiPU1hdGguZmxvb3Ioc2l6ZSAvIGJ5dGVzKTtcblx0XHR2YXIgbGFzdD1zaXplICVieXRlcztcblx0XHRmb3IgKHZhciBpPTA7aTw9YjtpKyspIHtcblx0XHRcdG91dC5wdXNoKGkqYnl0ZXMpO1xuXHRcdH1cblx0XHRvdXQucHVzaChiKmJ5dGVzK2xhc3QpO1xuXHRcdHJldHVybiBvdXQ7XG5cdCB9XG5cdCB2YXIgZmluaXNoPWZ1bmN0aW9uKCkge1xuXHRcdCBybShmbixmdW5jdGlvbigpe1xuXHRcdFx0XHRmaWxlRW50cnkubW92ZVRvKGZpbGVFbnRyeS5maWxlc3lzdGVtLnJvb3QsIGZuLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdFx0c2V0VGltZW91dCggY2IuYmluZChjb250ZXh0LGZhbHNlKSAsIDApIDsgXG5cdFx0XHRcdH0sZnVuY3Rpb24oZSl7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coXCJmYWlsZWRcIixlKVxuXHRcdFx0XHR9KTtcblx0XHQgfSx0aGlzKTsgXG5cdCB9O1xuXHRcdHZhciB0ZW1wZm49XCJ0ZW1wLmtkYlwiO1xuXHRcdHZhciBiYXRjaD1mdW5jdGlvbihiKSB7XG5cdFx0dmFyIGFib3J0PWZhbHNlO1xuXHRcdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0XHR2YXIgcmVxdWVzdHVybD11cmwrXCI/XCIrTWF0aC5yYW5kb20oKTtcblx0XHR4aHIub3BlbignZ2V0JywgcmVxdWVzdHVybCwgdHJ1ZSk7XG5cdFx0eGhyLnNldFJlcXVlc3RIZWFkZXIoJ1JhbmdlJywgJ2J5dGVzPScrYmF0Y2hlc1tiXSsnLScrKGJhdGNoZXNbYisxXS0xKSk7XG5cdFx0eGhyLnJlc3BvbnNlVHlwZSA9ICdibG9iJzsgICAgXG5cdFx0eGhyLmFkZEV2ZW50TGlzdGVuZXIoJ2xvYWQnLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBibG9iPXRoaXMucmVzcG9uc2U7XG5cdFx0XHRmaWxlRW50cnkuY3JlYXRlV3JpdGVyKGZ1bmN0aW9uKGZpbGVXcml0ZXIpIHtcblx0XHRcdFx0ZmlsZVdyaXRlci5zZWVrKGZpbGVXcml0ZXIubGVuZ3RoKTtcblx0XHRcdFx0ZmlsZVdyaXRlci53cml0ZShibG9iKTtcblx0XHRcdFx0d3JpdHRlbis9YmxvYi5zaXplO1xuXHRcdFx0XHRmaWxlV3JpdGVyLm9ud3JpdGVlbmQgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0aWYgKHN0YXR1c2NiKSB7XG5cdFx0XHRcdFx0XHRhYm9ydD1zdGF0dXNjYi5hcHBseShjb250ZXh0LFsgZmlsZVdyaXRlci5sZW5ndGggLyB0b3RhbHNpemUsdG90YWxzaXplIF0pO1xuXHRcdFx0XHRcdFx0aWYgKGFib3J0KSBzZXRUaW1lb3V0KCBjYi5iaW5kKGNvbnRleHQsZmFsc2UpICwgMCkgO1xuXHRcdFx0XHQgXHR9XG5cdFx0XHRcdFx0YisrO1xuXHRcdFx0XHRcdGlmICghYWJvcnQpIHtcblx0XHRcdFx0XHRcdGlmIChiPGJhdGNoZXMubGVuZ3RoLTEpIHNldFRpbWVvdXQoYmF0Y2guYmluZChjb250ZXh0LGIpLDApO1xuXHRcdFx0XHRcdFx0ZWxzZSAgICAgICAgICAgICAgICAgICAgZmluaXNoKCk7XG5cdFx0XHRcdCBcdH1cblx0XHRcdCBcdH07XG5cdFx0XHR9LCBjb25zb2xlLmVycm9yKTtcblx0XHR9LGZhbHNlKTtcblx0XHR4aHIuc2VuZCgpO1xuXHR9XG5cblx0Z2V0X3NpemUodXJsLGZ1bmN0aW9uKHNpemUpe1xuXHRcdHRvdGFsc2l6ZT1zaXplO1xuXHRcdGlmICghc2l6ZSkge1xuXHRcdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtmYWxzZV0pO1xuXHRcdH0gZWxzZSB7Ly9yZWFkeSB0byBkb3dubG9hZFxuXHRcdFx0cm0odGVtcGZuLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdCBiYXRjaGVzPWNyZWF0ZUJhdGNoZXMoc2l6ZSk7XG5cdFx0XHRcdCBpZiAoc3RhdHVzY2IpIHN0YXR1c2NiLmFwcGx5KGNvbnRleHQsWyAwLCB0b3RhbHNpemUgXSk7XG5cdFx0XHRcdCBBUEkuZnMucm9vdC5nZXRGaWxlKHRlbXBmbiwge2NyZWF0ZTogMSwgZXhjbHVzaXZlOiBmYWxzZX0sIGZ1bmN0aW9uKF9maWxlRW50cnkpIHtcblx0XHRcdFx0XHRcdFx0ZmlsZUVudHJ5PV9maWxlRW50cnk7XG5cdFx0XHRcdFx0XHRiYXRjaCgwKTtcblx0XHRcdFx0IH0pO1xuXHRcdFx0fSx0aGlzKTtcblx0XHR9XG5cdH0pO1xufVxuXG52YXIgcmVhZEZpbGU9ZnVuY3Rpb24oZmlsZW5hbWUsY2IsY29udGV4dCkge1xuXHRBUEkuZnMucm9vdC5nZXRGaWxlKGZpbGVuYW1lLCBmdW5jdGlvbihmaWxlRW50cnkpIHtcblx0XHRcdHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXHRcdFx0cmVhZGVyLm9ubG9hZGVuZCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNiLFt0aGlzLnJlc3VsdF0pO1xuXHRcdFx0XHR9OyAgICAgICAgICAgIFxuXHR9LCBjb25zb2xlLmVycm9yKTtcbn1cbnZhciB3cml0ZUZpbGU9ZnVuY3Rpb24oZmlsZW5hbWUsYnVmLGNiLGNvbnRleHQpe1xuXHRBUEkuZnMucm9vdC5nZXRGaWxlKGZpbGVuYW1lLCB7Y3JlYXRlOiB0cnVlLCBleGNsdXNpdmU6IHRydWV9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcblx0XHRcdGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIoZnVuY3Rpb24oZmlsZVdyaXRlcikge1xuXHRcdFx0XHRmaWxlV3JpdGVyLndyaXRlKGJ1Zik7XG5cdFx0XHRcdGZpbGVXcml0ZXIub253cml0ZWVuZCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNiLFtidWYuYnl0ZUxlbmd0aF0pO1xuXHRcdFx0XHR9OyAgICAgICAgICAgIFxuXHRcdFx0fSwgY29uc29sZS5lcnJvcik7XG5cdH0sIGNvbnNvbGUuZXJyb3IpO1xufVxuXG52YXIgcmVhZGRpcj1mdW5jdGlvbihjYixjb250ZXh0KSB7XG5cdHZhciBkaXJSZWFkZXIgPSBBUEkuZnMucm9vdC5jcmVhdGVSZWFkZXIoKTtcblx0dmFyIG91dD1bXSx0aGF0PXRoaXM7XG5cdGRpclJlYWRlci5yZWFkRW50cmllcyhmdW5jdGlvbihlbnRyaWVzKSB7XG5cdFx0aWYgKGVudHJpZXMubGVuZ3RoKSB7XG5cdFx0XHRmb3IgKHZhciBpID0gMCwgZW50cnk7IGVudHJ5ID0gZW50cmllc1tpXTsgKytpKSB7XG5cdFx0XHRcdGlmIChlbnRyeS5pc0ZpbGUpIHtcblx0XHRcdFx0XHRvdXQucHVzaChbZW50cnkubmFtZSxlbnRyeS50b1VSTCA/IGVudHJ5LnRvVVJMKCkgOiBlbnRyeS50b1VSSSgpXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0QVBJLmZpbGVzPW91dDtcblx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW291dF0pO1xuXHR9LCBmdW5jdGlvbigpe1xuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbbnVsbF0pO1xuXHR9KTtcbn1cbnZhciBnZXRGaWxlVVJMPWZ1bmN0aW9uKGZpbGVuYW1lKSB7XG5cdGlmICghQVBJLmZpbGVzICkgcmV0dXJuIG51bGw7XG5cdHZhciBmaWxlPSBBUEkuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGYpe3JldHVybiBmWzBdPT1maWxlbmFtZX0pO1xuXHRpZiAoZmlsZS5sZW5ndGgpIHJldHVybiBmaWxlWzBdWzFdO1xufVxudmFyIHJtPWZ1bmN0aW9uKGZpbGVuYW1lLGNiLGNvbnRleHQpIHtcblx0dmFyIHVybD1nZXRGaWxlVVJMKGZpbGVuYW1lKTtcblx0aWYgKHVybCkgcm1VUkwodXJsLGNiLGNvbnRleHQpO1xuXHRlbHNlIGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbZmFsc2VdKTtcbn1cblxudmFyIHJtVVJMPWZ1bmN0aW9uKGZpbGVuYW1lLGNiLGNvbnRleHQpIHtcblx0d2Via2l0UmVzb2x2ZUxvY2FsRmlsZVN5c3RlbVVSTChmaWxlbmFtZSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG5cdFx0ZmlsZUVudHJ5LnJlbW92ZShmdW5jdGlvbigpIHtcblx0XHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbdHJ1ZV0pO1xuXHRcdH0sIGNvbnNvbGUuZXJyb3IpO1xuXHR9LCAgZnVuY3Rpb24oZSl7XG5cdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtmYWxzZV0pOy8vbm8gc3VjaCBmaWxlXG5cdH0pO1xufVxuZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGUpIHtcblx0Y29uc29sZS5lcnJvcignRXJyb3I6ICcgK2UubmFtZSsgXCIgXCIrZS5tZXNzYWdlKTtcbn1cbnZhciBpbml0ZnM9ZnVuY3Rpb24oZ3JhbnRlZEJ5dGVzLGNiLGNvbnRleHQpIHtcblx0d2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0oUEVSU0lTVEVOVCwgZ3JhbnRlZEJ5dGVzLCAgZnVuY3Rpb24oZnMpIHtcblx0XHRBUEkuZnM9ZnM7XG5cdFx0QVBJLnF1b3RhPWdyYW50ZWRCeXRlcztcblx0XHRyZWFkZGlyKGZ1bmN0aW9uKCl7XG5cdFx0XHRBUEkuaW5pdGlhbGl6ZWQ9dHJ1ZTtcblx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW2dyYW50ZWRCeXRlcyxmc10pO1xuXHRcdH0sY29udGV4dCk7XG5cdH0sIGVycm9ySGFuZGxlcik7XG59XG52YXIgaW5pdD1mdW5jdGlvbihxdW90YSxjYixjb250ZXh0KSB7XG5cdG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZS5yZXF1ZXN0UXVvdGEocXVvdGEsIFxuXHRcdFx0ZnVuY3Rpb24oZ3JhbnRlZEJ5dGVzKSB7XG5cdFx0XHRcdGluaXRmcyhncmFudGVkQnl0ZXMsY2IsY29udGV4dCk7XG5cdFx0fSwgZXJyb3JIYW5kbGVyXG5cdCk7XG59XG52YXIgcXVlcnlRdW90YT1mdW5jdGlvbihjYixjb250ZXh0KSB7XG5cdHZhciB0aGF0PXRoaXM7XG5cdG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZS5xdWVyeVVzYWdlQW5kUXVvdGEoIFxuXHQgZnVuY3Rpb24odXNhZ2UscXVvdGEpe1xuXHRcdFx0aW5pdGZzKHF1b3RhLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW3VzYWdlLHF1b3RhXSk7XG5cdFx0XHR9LGNvbnRleHQpO1xuXHR9KTtcbn1cbnZhciBBUEk9e1xuXHRpbml0OmluaXRcblx0LHJlYWRkaXI6cmVhZGRpclxuXHQsY2hlY2tVcGRhdGU6Y2hlY2tVcGRhdGVcblx0LHJtOnJtXG5cdCxybVVSTDpybVVSTFxuXHQsZ2V0RmlsZVVSTDpnZXRGaWxlVVJMXG5cdCx3cml0ZUZpbGU6d3JpdGVGaWxlXG5cdCxyZWFkRmlsZTpyZWFkRmlsZVxuXHQsZG93bmxvYWQ6ZG93bmxvYWRcblx0LGdldF9oZWFkOmdldF9oZWFkXG5cdCxnZXRfZGF0ZTpnZXRfZGF0ZVxuXHQsZ2V0X3NpemU6Z2V0X3NpemVcblx0LGdldERvd25sb2FkU2l6ZTpnZXRfc2l6ZVxuXHQscXVlcnlRdW90YTpxdWVyeVF1b3RhXG59XG5tb2R1bGUuZXhwb3J0cz1BUEk7IiwidmFyIGh0bWw1ZnM9cmVxdWlyZShcIi4vaHRtbDVmc1wiKTtcbnZhciBFPVJlYWN0LmNyZWF0ZUVsZW1lbnQ7XG5cbnZhciBodG1sZnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHsgXG5cdFx0cmV0dXJuIHtyZWFkeTpmYWxzZSwgcXVvdGE6MCx1c2FnZTowLEluaXRpYWxpemVkOmZhbHNlLGF1dG9jbG9zZTp0aGlzLnByb3BzLmF1dG9jbG9zZX07XG5cdH0sXG5cdGluaXRGaWxlc3lzdGVtOmZ1bmN0aW9uKCkge1xuXHRcdHZhciBxdW90YT10aGlzLnByb3BzLnF1b3RhfHwxMDI0KjEwMjQqMTI4OyAvLyBkZWZhdWx0IDEyOE1CXG5cdFx0cXVvdGE9cGFyc2VJbnQocXVvdGEpO1xuXHRcdGh0bWw1ZnMuaW5pdChxdW90YSxmdW5jdGlvbihxKXtcblx0XHRcdHRoaXMuZGlhbG9nPWZhbHNlO1xuXHRcdFx0JCh0aGlzLnJlZnMuZGlhbG9nMS5nZXRET01Ob2RlKCkpLm1vZGFsKCdoaWRlJyk7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtxdW90YTpxLGF1dG9jbG9zZTp0cnVlfSk7XG5cdFx0fSx0aGlzKTtcblx0fSxcblx0d2VsY29tZTpmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gKFxuXHRcdEUoXCJkaXZcIiwge3JlZjogXCJkaWFsb2cxXCIsIGNsYXNzTmFtZTogXCJtb2RhbCBmYWRlXCIsIGlkOiBcIm15TW9kYWxcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcblx0XHQgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWRpYWxvZ1wifSwgXG5cdFx0ICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWNvbnRlbnRcIn0sIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIldlbGNvbWVcIilcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWJvZHlcIn0sIFxuXHRcdCAgICAgICAgICBcIkJyb3dzZXIgd2lsbCBhc2sgZm9yIHlvdXIgY29uZmlybWF0aW9uLlwiXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1mb290ZXJcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmluaXRGaWxlc3lzdGVtLCB0eXBlOiBcImJ1dHRvblwiLCBcblx0XHQgICAgICAgICAgICBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCJ9LCBcIkluaXRpYWxpemUgRmlsZSBTeXN0ZW1cIilcblx0XHQgICAgICAgIClcblx0XHQgICAgICApXG5cdFx0ICAgIClcblx0XHQgIClcblx0XHQgKTtcblx0fSxcblx0cmVuZGVyRGVmYXVsdDpmdW5jdGlvbigpe1xuXHRcdHZhciB1c2VkPU1hdGguZmxvb3IodGhpcy5zdGF0ZS51c2FnZS90aGlzLnN0YXRlLnF1b3RhICoxMDApO1xuXHRcdHZhciBtb3JlPWZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKHVzZWQ+NTApIHJldHVybiBFKFwiYnV0dG9uXCIsIHt0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1wcmltYXJ5XCJ9LCBcIkFsbG9jYXRlIE1vcmVcIik7XG5cdFx0XHRlbHNlIG51bGw7XG5cdFx0fVxuXHRcdHJldHVybiAoXG5cdFx0RShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgaWQ6IFwibXlNb2RhbFwiLCBcImRhdGEtYmFja2Ryb3BcIjogXCJzdGF0aWNcIn0sIFxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcblx0XHQgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtY29udGVudFwifSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtaGVhZGVyXCJ9LCBcblx0XHQgICAgICAgICAgRShcImg0XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtdGl0bGVcIn0sIFwiU2FuZGJveCBGaWxlIFN5c3RlbVwiKVxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtYm9keVwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwcm9ncmVzc1wifSwgXG5cdFx0ICAgICAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByb2dyZXNzLWJhclwiLCByb2xlOiBcInByb2dyZXNzYmFyXCIsIHN0eWxlOiB7d2lkdGg6IHVzZWQrXCIlXCJ9fSwgXG5cdFx0ICAgICAgICAgICAgICAgdXNlZCwgXCIlXCJcblx0XHQgICAgICAgICAgICApXG5cdFx0ICAgICAgICAgICksIFxuXHRcdCAgICAgICAgICBFKFwic3BhblwiLCBudWxsLCB0aGlzLnN0YXRlLnF1b3RhLCBcIiB0b3RhbCAsIFwiLCB0aGlzLnN0YXRlLnVzYWdlLCBcIiBpbiB1c2VkXCIpXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1mb290ZXJcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmRpc21pc3MsIHR5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLWRlZmF1bHRcIiwgXCJkYXRhLWRpc21pc3NcIjogXCJtb2RhbFwifSwgXCJDbG9zZVwiKSwgXG5cdFx0ICAgICAgICAgIG1vcmUoKVxuXHRcdCAgICAgICAgKVxuXHRcdCAgICAgIClcblx0XHQgICAgKVxuXHRcdCAgKVxuXHRcdCAgKTtcblx0fSxcblx0ZGlzbWlzczpmdW5jdGlvbigpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdHRoYXQucHJvcHMub25SZWFkeSh0aGF0LnN0YXRlLnF1b3RhLHRoYXQuc3RhdGUudXNhZ2UpO1x0XG5cdFx0fSwwKTtcblx0fSxcblx0cXVlcnlRdW90YTpmdW5jdGlvbigpIHtcblx0XHRpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwiY2hyb21lXCIpIHtcblx0XHRcdGh0bWw1ZnMucXVlcnlRdW90YShmdW5jdGlvbih1c2FnZSxxdW90YSl7XG5cdFx0XHRcdHRoaXMuc2V0U3RhdGUoe3VzYWdlOnVzYWdlLHF1b3RhOnF1b3RhLGluaXRpYWxpemVkOnRydWV9KTtcblx0XHRcdH0sdGhpcyk7XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe3VzYWdlOjMzMyxxdW90YToxMDAwKjEwMDAqMTAyNCxpbml0aWFsaXplZDp0cnVlLGF1dG9jbG9zZTp0cnVlfSk7XG5cdFx0fVxuXHR9LFxuXHRyZW5kZXI6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRpZiAoIXRoaXMuc3RhdGUucXVvdGEgfHwgdGhpcy5zdGF0ZS5xdW90YTx0aGlzLnByb3BzLnF1b3RhKSB7XG5cdFx0XHRpZiAodGhpcy5zdGF0ZS5pbml0aWFsaXplZCkge1xuXHRcdFx0XHR0aGlzLmRpYWxvZz10cnVlO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy53ZWxjb21lKCk7XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBFKFwic3BhblwiLCBudWxsLCBcImNoZWNraW5nIHF1b3RhXCIpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIXRoaXMuc3RhdGUuYXV0b2Nsb3NlKSB7XG5cdFx0XHRcdHRoaXMuZGlhbG9nPXRydWU7XG5cdFx0XHRcdHJldHVybiB0aGlzLnJlbmRlckRlZmF1bHQoKTsgXG5cdFx0XHR9XG5cdFx0XHR0aGlzLmRpc21pc3MoKTtcblx0XHRcdHRoaXMuZGlhbG9nPWZhbHNlO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcblx0XHRpZiAoIXRoaXMuc3RhdGUucXVvdGEpIHtcblx0XHRcdHRoaXMucXVlcnlRdW90YSgpO1xuXG5cdFx0fTtcblx0fSxcblx0Y29tcG9uZW50RGlkVXBkYXRlOmZ1bmN0aW9uKCkge1xuXHRcdGlmICh0aGlzLmRpYWxvZykgJCh0aGlzLnJlZnMuZGlhbG9nMS5nZXRET01Ob2RlKCkpLm1vZGFsKCdzaG93Jyk7XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cz1odG1sZnM7IiwidmFyIGtzYW5hPXtcInBsYXRmb3JtXCI6XCJyZW1vdGVcIn07XG5pZiAodHlwZW9mIHdpbmRvdyE9XCJ1bmRlZmluZWRcIikge1xuXHR3aW5kb3cua3NhbmE9a3NhbmE7XG5cdGlmICh0eXBlb2Yga3NhbmFnYXA9PVwidW5kZWZpbmVkXCIpIHtcblx0XHR3aW5kb3cua3NhbmFnYXA9cmVxdWlyZShcIi4va3NhbmFnYXBcIik7IC8vY29tcGF0aWJsZSBsYXllciB3aXRoIG1vYmlsZVxuXHR9XG59XG5pZiAodHlwZW9mIHByb2Nlc3MgIT1cInVuZGVmaW5lZFwiKSB7XG5cdGlmIChwcm9jZXNzLnZlcnNpb25zICYmIHByb2Nlc3MudmVyc2lvbnNbXCJub2RlLXdlYmtpdFwiXSkge1xuICBcdFx0aWYgKHR5cGVvZiBub2RlUmVxdWlyZSE9XCJ1bmRlZmluZWRcIikga3NhbmEucmVxdWlyZT1ub2RlUmVxdWlyZTtcbiAgXHRcdGtzYW5hLnBsYXRmb3JtPVwibm9kZS13ZWJraXRcIjtcbiAgXHRcdHdpbmRvdy5rc2FuYWdhcC5wbGF0Zm9ybT1cIm5vZGUtd2Via2l0XCI7XG5cdFx0dmFyIGtzYW5hanM9cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhcImtzYW5hLmpzXCIsXCJ1dGY4XCIpLnRyaW0oKTtcblx0XHRrc2FuYS5qcz1KU09OLnBhcnNlKGtzYW5hanMuc3Vic3RyaW5nKDE0LGtzYW5hanMubGVuZ3RoLTEpKTtcblx0XHR3aW5kb3cua2ZzPXJlcXVpcmUoXCIuL2tmc1wiKTtcbiAgXHR9XG59IGVsc2UgaWYgKHR5cGVvZiBjaHJvbWUhPVwidW5kZWZpbmVkXCIpey8vfSAmJiBjaHJvbWUuZmlsZVN5c3RlbSl7XG4vL1x0d2luZG93LmtzYW5hZ2FwPXJlcXVpcmUoXCIuL2tzYW5hZ2FwXCIpOyAvL2NvbXBhdGlibGUgbGF5ZXIgd2l0aCBtb2JpbGVcblx0d2luZG93LmtzYW5hZ2FwLnBsYXRmb3JtPVwiY2hyb21lXCI7XG5cdHdpbmRvdy5rZnM9cmVxdWlyZShcIi4va2ZzX2h0bWw1XCIpO1xuXHRyZXF1aXJlKFwiLi9saXZlcmVsb2FkXCIpKCk7XG5cdGtzYW5hLnBsYXRmb3JtPVwiY2hyb21lXCI7XG59IGVsc2Uge1xuXHRpZiAodHlwZW9mIGtzYW5hZ2FwIT1cInVuZGVmaW5lZFwiICYmIHR5cGVvZiBmcyE9XCJ1bmRlZmluZWRcIikgey8vbW9iaWxlXG5cdFx0dmFyIGtzYW5hanM9ZnMucmVhZEZpbGVTeW5jKFwia3NhbmEuanNcIixcInV0ZjhcIikudHJpbSgpOyAvL2FuZHJvaWQgZXh0cmEgXFxuIGF0IHRoZSBlbmRcblx0XHRrc2FuYS5qcz1KU09OLnBhcnNlKGtzYW5hanMuc3Vic3RyaW5nKDE0LGtzYW5hanMubGVuZ3RoLTEpKTtcblx0XHRrc2FuYS5wbGF0Zm9ybT1rc2FuYWdhcC5wbGF0Zm9ybTtcblx0XHRpZiAodHlwZW9mIGtzYW5hZ2FwLmFuZHJvaWQgIT1cInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRrc2FuYS5wbGF0Zm9ybT1cImFuZHJvaWRcIjtcblx0XHR9XG5cdH1cbn1cbnZhciB0aW1lcj1udWxsO1xudmFyIGJvb3Q9ZnVuY3Rpb24oYXBwSWQsY2IpIHtcblx0a3NhbmEuYXBwSWQ9YXBwSWQ7XG5cdGlmIChrc2FuYWdhcC5wbGF0Zm9ybT09XCJjaHJvbWVcIikgeyAvL25lZWQgdG8gd2FpdCBmb3IganNvbnAga3NhbmEuanNcblx0XHR0aW1lcj1zZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdFx0aWYgKGtzYW5hLnJlYWR5KXtcblx0XHRcdFx0Y2xlYXJJbnRlcnZhbCh0aW1lcik7XG5cdFx0XHRcdGlmIChrc2FuYS5qcyAmJiBrc2FuYS5qcy5maWxlcyAmJiBrc2FuYS5qcy5maWxlcy5sZW5ndGgpIHtcblx0XHRcdFx0XHRyZXF1aXJlKFwiLi9pbnN0YWxsa2RiXCIpKGtzYW5hLmpzLGNiKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjYigpO1x0XHRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0sMzAwKTtcblx0fSBlbHNlIHtcblx0XHRjYigpO1xuXHR9XG59XG5cbm1vZHVsZS5leHBvcnRzPXtib290OmJvb3Rcblx0LGh0bWxmczpyZXF1aXJlKFwiLi9odG1sZnNcIilcblx0LGh0bWw1ZnM6cmVxdWlyZShcIi4vaHRtbDVmc1wiKVxuXHQsbGl2ZXVwZGF0ZTpyZXF1aXJlKFwiLi9saXZldXBkYXRlXCIpXG5cdCxmaWxlaW5zdGFsbGVyOnJlcXVpcmUoXCIuL2ZpbGVpbnN0YWxsZXJcIilcblx0LGRvd25sb2FkZXI6cmVxdWlyZShcIi4vZG93bmxvYWRlclwiKVxuXHQsaW5zdGFsbGtkYjpyZXF1aXJlKFwiLi9pbnN0YWxsa2RiXCIpXG59OyIsInZhciBGaWxlaW5zdGFsbGVyPXJlcXVpcmUoXCIuL2ZpbGVpbnN0YWxsZXJcIik7XG5cbnZhciBnZXRSZXF1aXJlX2tkYj1mdW5jdGlvbigpIHtcbiAgICB2YXIgcmVxdWlyZWQ9W107XG4gICAga3NhbmEuanMuZmlsZXMubWFwKGZ1bmN0aW9uKGYpe1xuICAgICAgaWYgKGYuaW5kZXhPZihcIi5rZGJcIik9PWYubGVuZ3RoLTQpIHtcbiAgICAgICAgdmFyIHNsYXNoPWYubGFzdEluZGV4T2YoXCIvXCIpO1xuICAgICAgICBpZiAoc2xhc2g+LTEpIHtcbiAgICAgICAgICB2YXIgZGJpZD1mLnN1YnN0cmluZyhzbGFzaCsxLGYubGVuZ3RoLTQpO1xuICAgICAgICAgIHJlcXVpcmVkLnB1c2goe3VybDpmLGRiaWQ6ZGJpZCxmaWxlbmFtZTpkYmlkK1wiLmtkYlwifSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIGRiaWQ9Zi5zdWJzdHJpbmcoMCxmLmxlbmd0aC00KTtcbiAgICAgICAgICByZXF1aXJlZC5wdXNoKHt1cmw6a3NhbmEuanMuYmFzZXVybCtmLGRiaWQ6ZGJpZCxmaWxlbmFtZTpmfSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXF1aXJlZDtcbn1cbnZhciBjYWxsYmFjaz1udWxsO1xudmFyIG9uUmVhZHk9ZnVuY3Rpb24oKSB7XG5cdGNhbGxiYWNrKCk7XG59XG52YXIgb3BlbkZpbGVpbnN0YWxsZXI9ZnVuY3Rpb24oa2VlcCkge1xuXHR2YXIgcmVxdWlyZV9rZGI9Z2V0UmVxdWlyZV9rZGIoKS5tYXAoZnVuY3Rpb24oZGIpe1xuXHQgIHJldHVybiB7XG5cdCAgICB1cmw6d2luZG93LmxvY2F0aW9uLm9yaWdpbit3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUrZGIuZGJpZCtcIi5rZGJcIixcblx0ICAgIGRiZGI6ZGIuZGJpZCxcblx0ICAgIGZpbGVuYW1lOmRiLmZpbGVuYW1lXG5cdCAgfVxuXHR9KVxuXHRyZXR1cm4gUmVhY3QuY3JlYXRlRWxlbWVudChGaWxlaW5zdGFsbGVyLCB7cXVvdGE6IFwiNTEyTVwiLCBhdXRvY2xvc2U6ICFrZWVwLCBuZWVkZWQ6IHJlcXVpcmVfa2RiLCBcblx0ICAgICAgICAgICAgICAgICBvblJlYWR5OiBvblJlYWR5fSk7XG59XG52YXIgaW5zdGFsbGtkYj1mdW5jdGlvbihrc2FuYWpzLGNiLGNvbnRleHQpIHtcblx0Y29uc29sZS5sb2coa3NhbmFqcy5maWxlcyk7XG5cdFJlYWN0LnJlbmRlcihvcGVuRmlsZWluc3RhbGxlcigpLGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwibWFpblwiKSk7XG5cdGNhbGxiYWNrPWNiO1xufVxubW9kdWxlLmV4cG9ydHM9aW5zdGFsbGtkYjsiLCIvL1NpbXVsYXRlIGZlYXR1cmUgaW4ga3NhbmFnYXBcbi8qIFxuICBydW5zIG9uIG5vZGUtd2Via2l0IG9ubHlcbiovXG5cbnZhciByZWFkRGlyPWZ1bmN0aW9uKHBhdGgpIHsgLy9zaW11bGF0ZSBLc2FuYWdhcCBmdW5jdGlvblxuXHR2YXIgZnM9bm9kZVJlcXVpcmUoXCJmc1wiKTtcblx0cGF0aD1wYXRofHxcIi4uXCI7XG5cdHZhciBkaXJzPVtdO1xuXHRpZiAocGF0aFswXT09XCIuXCIpIHtcblx0XHRpZiAocGF0aD09XCIuXCIpIGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuXCIpO1xuXHRcdGVsc2Uge1xuXHRcdFx0ZGlycz1mcy5yZWFkZGlyU3luYyhcIi4uXCIpO1xuXHRcdH1cblx0fSBlbHNlIHtcblx0XHRkaXJzPWZzLnJlYWRkaXJTeW5jKHBhdGgpO1xuXHR9XG5cblx0cmV0dXJuIGRpcnMuam9pbihcIlxcdWZmZmZcIik7XG59XG52YXIgbGlzdEFwcHM9ZnVuY3Rpb24oKSB7XG5cdHZhciBmcz1ub2RlUmVxdWlyZShcImZzXCIpO1xuXHR2YXIga3NhbmFqc2ZpbGU9ZnVuY3Rpb24oZCkge3JldHVybiBcIi4uL1wiK2QrXCIva3NhbmEuanNcIn07XG5cdHZhciBkaXJzPWZzLnJlYWRkaXJTeW5jKFwiLi5cIikuZmlsdGVyKGZ1bmN0aW9uKGQpe1xuXHRcdFx0XHRyZXR1cm4gZnMuc3RhdFN5bmMoXCIuLi9cIitkKS5pc0RpcmVjdG9yeSgpICYmIGRbMF0hPVwiLlwiXG5cdFx0XHRcdCAgICYmIGZzLmV4aXN0c1N5bmMoa3NhbmFqc2ZpbGUoZCkpO1xuXHR9KTtcblx0XG5cdHZhciBvdXQ9ZGlycy5tYXAoZnVuY3Rpb24oZCl7XG5cdFx0dmFyIGNvbnRlbnQ9ZnMucmVhZEZpbGVTeW5jKGtzYW5hanNmaWxlKGQpLFwidXRmOFwiKTtcbiAgXHRjb250ZW50PWNvbnRlbnQucmVwbGFjZShcIn0pXCIsXCJ9XCIpO1xuICBcdGNvbnRlbnQ9Y29udGVudC5yZXBsYWNlKFwianNvbnBfaGFuZGxlcihcIixcIlwiKTtcblx0XHR2YXIgb2JqPSBKU09OLnBhcnNlKGNvbnRlbnQpO1xuXHRcdG9iai5kYmlkPWQ7XG5cdFx0b2JqLnBhdGg9ZDtcblx0XHRyZXR1cm4gb2JqO1xuXHR9KVxuXHRyZXR1cm4gSlNPTi5zdHJpbmdpZnkob3V0KTtcbn1cblxuXG5cbnZhciBrZnM9e3JlYWREaXI6cmVhZERpcixsaXN0QXBwczpsaXN0QXBwc307XG5cbm1vZHVsZS5leHBvcnRzPWtmczsiLCJ2YXIgcmVhZERpcj1mdW5jdGlvbigpe1xuXHRyZXR1cm4gW107XG59XG52YXIgbGlzdEFwcHM9ZnVuY3Rpb24oKXtcblx0cmV0dXJuIFtdO1xufVxubW9kdWxlLmV4cG9ydHM9e3JlYWREaXI6cmVhZERpcixsaXN0QXBwczpsaXN0QXBwc307IiwidmFyIGFwcG5hbWU9XCJpbnN0YWxsZXJcIjtcbnZhciBzd2l0Y2hBcHA9ZnVuY3Rpb24ocGF0aCkge1xuXHR2YXIgZnM9cmVxdWlyZShcImZzXCIpO1xuXHRwYXRoPVwiLi4vXCIrcGF0aDtcblx0YXBwbmFtZT1wYXRoO1xuXHRkb2N1bWVudC5sb2NhdGlvbi5ocmVmPSBwYXRoK1wiL2luZGV4Lmh0bWxcIjsgXG5cdHByb2Nlc3MuY2hkaXIocGF0aCk7XG59XG52YXIgZG93bmxvYWRlcj17fTtcbnZhciByb290UGF0aD1cIlwiO1xuXG52YXIgZGVsZXRlQXBwPWZ1bmN0aW9uKGFwcCkge1xuXHRjb25zb2xlLmVycm9yKFwibm90IGFsbG93IG9uIFBDLCBkbyBpdCBpbiBGaWxlIEV4cGxvcmVyLyBGaW5kZXJcIik7XG59XG52YXIgdXNlcm5hbWU9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBcIlwiO1xufVxudmFyIHVzZXJlbWFpbD1mdW5jdGlvbigpIHtcblx0cmV0dXJuIFwiXCJcbn1cbnZhciBydW50aW1lX3ZlcnNpb249ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBcIjEuNFwiO1xufVxuXG4vL2NvcHkgZnJvbSBsaXZldXBkYXRlXG52YXIganNvbnA9ZnVuY3Rpb24odXJsLGRiaWQsY2FsbGJhY2ssY29udGV4dCkge1xuICB2YXIgc2NyaXB0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNvbnAyXCIpO1xuICBpZiAoc2NyaXB0KSB7XG4gICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgfVxuICB3aW5kb3cuanNvbnBfaGFuZGxlcj1mdW5jdGlvbihkYXRhKSB7XG4gICAgaWYgKHR5cGVvZiBkYXRhPT1cIm9iamVjdFwiKSB7XG4gICAgICBkYXRhLmRiaWQ9ZGJpZDtcbiAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW2RhdGFdKTsgICAgXG4gICAgfSAgXG4gIH1cbiAgd2luZG93Lmpzb25wX2Vycm9yX2hhbmRsZXI9ZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5lcnJvcihcInVybCB1bnJlYWNoYWJsZVwiLHVybCk7XG4gICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbbnVsbF0pO1xuICB9XG4gIHNjcmlwdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnaWQnLCBcImpzb25wMlwiKTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnb25lcnJvcicsIFwianNvbnBfZXJyb3JfaGFuZGxlcigpXCIpO1xuICB1cmw9dXJsKyc/JysobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmwpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7IFxufVxuXG52YXIga3NhbmFnYXA9e1xuXHRwbGF0Zm9ybTpcIm5vZGUtd2Via2l0XCIsXG5cdHN0YXJ0RG93bmxvYWQ6ZG93bmxvYWRlci5zdGFydERvd25sb2FkLFxuXHRkb3dubG9hZGVkQnl0ZTpkb3dubG9hZGVyLmRvd25sb2FkZWRCeXRlLFxuXHRkb3dubG9hZGluZ0ZpbGU6ZG93bmxvYWRlci5kb3dubG9hZGluZ0ZpbGUsXG5cdGNhbmNlbERvd25sb2FkOmRvd25sb2FkZXIuY2FuY2VsRG93bmxvYWQsXG5cdGRvbmVEb3dubG9hZDpkb3dubG9hZGVyLmRvbmVEb3dubG9hZCxcblx0c3dpdGNoQXBwOnN3aXRjaEFwcCxcblx0cm9vdFBhdGg6cm9vdFBhdGgsXG5cdGRlbGV0ZUFwcDogZGVsZXRlQXBwLFxuXHR1c2VybmFtZTp1c2VybmFtZSwgLy9ub3Qgc3VwcG9ydCBvbiBQQ1xuXHR1c2VyZW1haWw6dXNlcm5hbWUsXG5cdHJ1bnRpbWVfdmVyc2lvbjpydW50aW1lX3ZlcnNpb24sXG5cdFxufVxuXG5pZiAodHlwZW9mIHByb2Nlc3MhPVwidW5kZWZpbmVkXCIpIHtcblx0dmFyIGtzYW5hanM9cmVxdWlyZShcImZzXCIpLnJlYWRGaWxlU3luYyhcIi4va3NhbmEuanNcIixcInV0ZjhcIikudHJpbSgpO1xuXHRkb3dubG9hZGVyPXJlcXVpcmUoXCIuL2Rvd25sb2FkZXJcIik7XG5cdGNvbnNvbGUubG9nKGtzYW5hanMpO1xuXHQvL2tzYW5hLmpzPUpTT04ucGFyc2Uoa3NhbmFqcy5zdWJzdHJpbmcoMTQsa3NhbmFqcy5sZW5ndGgtMSkpO1xuXHRyb290UGF0aD1wcm9jZXNzLmN3ZCgpO1xuXHRyb290UGF0aD1yZXF1aXJlKFwicGF0aFwiKS5yZXNvbHZlKHJvb3RQYXRoLFwiLi5cIikucmVwbGFjZSgvXFxcXC9nLFwiL1wiKSsnLyc7XG5cdGtzYW5hLnJlYWR5PXRydWU7XG59IGVsc2V7XG5cdHZhciB1cmw9d2luZG93LmxvY2F0aW9uLm9yaWdpbit3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZShcImluZGV4Lmh0bWxcIixcIlwiKStcImtzYW5hLmpzXCI7XG5cdGpzb25wKHVybCxhcHBuYW1lLGZ1bmN0aW9uKGRhdGEpe1xuXHRcdGtzYW5hLmpzPWRhdGE7XG5cdFx0a3NhbmEucmVhZHk9dHJ1ZTtcblx0fSk7XG59XG5tb2R1bGUuZXhwb3J0cz1rc2FuYWdhcDsiLCJ2YXIgc3RhcnRlZD1mYWxzZTtcbnZhciB0aW1lcj1udWxsO1xudmFyIGJ1bmRsZWRhdGU9bnVsbDtcbnZhciBnZXRfZGF0ZT1yZXF1aXJlKFwiLi9odG1sNWZzXCIpLmdldF9kYXRlO1xudmFyIGNoZWNrSWZCdW5kbGVVcGRhdGVkPWZ1bmN0aW9uKCkge1xuXHRnZXRfZGF0ZShcImJ1bmRsZS5qc1wiLGZ1bmN0aW9uKGRhdGUpe1xuXHRcdGlmIChidW5kbGVkYXRlICYmYnVuZGxlZGF0ZSE9ZGF0ZSl7XG5cdFx0XHRsb2NhdGlvbi5yZWxvYWQoKTtcblx0XHR9XG5cdFx0YnVuZGxlZGF0ZT1kYXRlO1xuXHR9KTtcbn1cbnZhciBsaXZlcmVsb2FkPWZ1bmN0aW9uKCkge1xuXHRpZiAoc3RhcnRlZCkgcmV0dXJuO1xuXG5cdHRpbWVyMT1zZXRJbnRlcnZhbChmdW5jdGlvbigpe1xuXHRcdGNoZWNrSWZCdW5kbGVVcGRhdGVkKCk7XG5cdH0sMjAwMCk7XG5cdHN0YXJ0ZWQ9dHJ1ZTtcbn1cblxubW9kdWxlLmV4cG9ydHM9bGl2ZXJlbG9hZDsiLCJcbnZhciBqc29ucD1mdW5jdGlvbih1cmwsZGJpZCxjYWxsYmFjayxjb250ZXh0KSB7XG4gIHZhciBzY3JpcHQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc29ucFwiKTtcbiAgaWYgKHNjcmlwdCkge1xuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gIH1cbiAgd2luZG93Lmpzb25wX2hhbmRsZXI9ZnVuY3Rpb24oZGF0YSkge1xuICAgIC8vY29uc29sZS5sb2coXCJyZWNlaXZlIGZyb20ga3NhbmEuanNcIixkYXRhKTtcbiAgICBpZiAodHlwZW9mIGRhdGE9PVwib2JqZWN0XCIpIHtcbiAgICAgIGlmICh0eXBlb2YgZGF0YS5kYmlkPT1cInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGRhdGEuZGJpZD1kYmlkO1xuICAgICAgfVxuICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbZGF0YV0pO1xuICAgIH0gIFxuICB9XG5cbiAgd2luZG93Lmpzb25wX2Vycm9yX2hhbmRsZXI9ZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5lcnJvcihcInVybCB1bnJlYWNoYWJsZVwiLHVybCk7XG4gICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbbnVsbF0pO1xuICB9XG5cbiAgc2NyaXB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdpZCcsIFwianNvbnBcIik7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ29uZXJyb3InLCBcImpzb25wX2Vycm9yX2hhbmRsZXIoKVwiKTtcbiAgdXJsPXVybCsnPycrKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpOyBcbn1cbnZhciBydW50aW1lX3ZlcnNpb25fb2s9ZnVuY3Rpb24obWlucnVudGltZSkge1xuICBpZiAoIW1pbnJ1bnRpbWUpIHJldHVybiB0cnVlOy8vbm90IG1lbnRpb25lZC5cbiAgdmFyIG1pbj1wYXJzZUZsb2F0KG1pbnJ1bnRpbWUpO1xuICB2YXIgcnVudGltZT1wYXJzZUZsb2F0KCBrc2FuYWdhcC5ydW50aW1lX3ZlcnNpb24oKXx8XCIxLjBcIik7XG4gIGlmIChtaW4+cnVudGltZSkgcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxudmFyIG5lZWRUb1VwZGF0ZT1mdW5jdGlvbihmcm9tanNvbix0b2pzb24pIHtcbiAgdmFyIG5lZWRVcGRhdGVzPVtdO1xuICBmb3IgKHZhciBpPTA7aTxmcm9tanNvbi5sZW5ndGg7aSsrKSB7IFxuICAgIHZhciB0bz10b2pzb25baV07XG4gICAgdmFyIGZyb209ZnJvbWpzb25baV07XG4gICAgdmFyIG5ld2ZpbGVzPVtdLG5ld2ZpbGVzaXplcz1bXSxyZW1vdmVkPVtdO1xuICAgIFxuICAgIGlmICghdG8pIGNvbnRpbnVlOyAvL2Nhbm5vdCByZWFjaCBob3N0XG4gICAgaWYgKCFydW50aW1lX3ZlcnNpb25fb2sodG8ubWlucnVudGltZSkpIHtcbiAgICAgIGNvbnNvbGUud2FybihcInJ1bnRpbWUgdG9vIG9sZCwgbmVlZCBcIit0by5taW5ydW50aW1lKTtcbiAgICAgIGNvbnRpbnVlOyBcbiAgICB9XG4gICAgaWYgKCFmcm9tLmZpbGVkYXRlcykge1xuICAgICAgY29uc29sZS53YXJuKFwibWlzc2luZyBmaWxlZGF0ZXMgaW4ga3NhbmEuanMgb2YgXCIrZnJvbS5kYmlkKTtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICBmcm9tLmZpbGVkYXRlcy5tYXAoZnVuY3Rpb24oZixpZHgpe1xuICAgICAgdmFyIG5ld2lkeD10by5maWxlcy5pbmRleE9mKCBmcm9tLmZpbGVzW2lkeF0pO1xuICAgICAgaWYgKG5ld2lkeD09LTEpIHtcbiAgICAgICAgLy9maWxlIHJlbW92ZWQgaW4gbmV3IHZlcnNpb25cbiAgICAgICAgcmVtb3ZlZC5wdXNoKGZyb20uZmlsZXNbaWR4XSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZnJvbWRhdGU9RGF0ZS5wYXJzZShmKTtcbiAgICAgICAgdmFyIHRvZGF0ZT1EYXRlLnBhcnNlKHRvLmZpbGVkYXRlc1tuZXdpZHhdKTtcbiAgICAgICAgaWYgKGZyb21kYXRlPHRvZGF0ZSkge1xuICAgICAgICAgIG5ld2ZpbGVzLnB1c2goIHRvLmZpbGVzW25ld2lkeF0gKTtcbiAgICAgICAgICBuZXdmaWxlc2l6ZXMucHVzaCh0by5maWxlc2l6ZXNbbmV3aWR4XSk7XG4gICAgICAgIH0gICAgICAgIFxuICAgICAgfVxuICAgIH0pO1xuICAgIGlmIChuZXdmaWxlcy5sZW5ndGgpIHtcbiAgICAgIGZyb20ubmV3ZmlsZXM9bmV3ZmlsZXM7XG4gICAgICBmcm9tLm5ld2ZpbGVzaXplcz1uZXdmaWxlc2l6ZXM7XG4gICAgICBmcm9tLnJlbW92ZWQ9cmVtb3ZlZDtcbiAgICAgIG5lZWRVcGRhdGVzLnB1c2goZnJvbSk7XG4gICAgfVxuICB9XG4gIHJldHVybiBuZWVkVXBkYXRlcztcbn1cbnZhciBnZXRVcGRhdGFibGVzPWZ1bmN0aW9uKGFwcHMsY2IsY29udGV4dCkge1xuICBnZXRSZW1vdGVKc29uKGFwcHMsZnVuY3Rpb24oanNvbnMpe1xuICAgIHZhciBoYXNVcGRhdGVzPW5lZWRUb1VwZGF0ZShhcHBzLGpzb25zKTtcbiAgICBjYi5hcHBseShjb250ZXh0LFtoYXNVcGRhdGVzXSk7XG4gIH0sY29udGV4dCk7XG59XG52YXIgZ2V0UmVtb3RlSnNvbj1mdW5jdGlvbihhcHBzLGNiLGNvbnRleHQpIHtcbiAgdmFyIHRhc2txdWV1ZT1bXSxvdXRwdXQ9W107XG4gIHZhciBtYWtlY2I9ZnVuY3Rpb24oYXBwKXtcbiAgICByZXR1cm4gZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIGlmICghKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSBvdXRwdXQucHVzaChkYXRhKTtcbiAgICAgICAgaWYgKCFhcHAuYmFzZXVybCkge1xuICAgICAgICAgIHRhc2txdWV1ZS5zaGlmdCh7X19lbXB0eTp0cnVlfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdmFyIHVybD1hcHAuYmFzZXVybCtcIi9rc2FuYS5qc1wiOyAgICBcbiAgICAgICAgICBjb25zb2xlLmxvZyh1cmwpO1xuICAgICAgICAgIGpzb25wKCB1cmwgLGFwcC5kYmlkLHRhc2txdWV1ZS5zaGlmdCgpLCBjb250ZXh0KTsgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfTtcbiAgfTtcbiAgYXBwcy5mb3JFYWNoKGZ1bmN0aW9uKGFwcCl7dGFza3F1ZXVlLnB1c2gobWFrZWNiKGFwcCkpfSk7XG5cbiAgdGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XG4gICAgb3V0cHV0LnB1c2goZGF0YSk7XG4gICAgY2IuYXBwbHkoY29udGV4dCxbb3V0cHV0XSk7XG4gIH0pO1xuXG4gIHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTsgLy9ydW4gdGhlIHRhc2tcbn1cbnZhciBodW1hbkZpbGVTaXplPWZ1bmN0aW9uKGJ5dGVzLCBzaSkge1xuICAgIHZhciB0aHJlc2ggPSBzaSA/IDEwMDAgOiAxMDI0O1xuICAgIGlmKGJ5dGVzIDwgdGhyZXNoKSByZXR1cm4gYnl0ZXMgKyAnIEInO1xuICAgIHZhciB1bml0cyA9IHNpID8gWydrQicsJ01CJywnR0InLCdUQicsJ1BCJywnRUInLCdaQicsJ1lCJ10gOiBbJ0tpQicsJ01pQicsJ0dpQicsJ1RpQicsJ1BpQicsJ0VpQicsJ1ppQicsJ1lpQiddO1xuICAgIHZhciB1ID0gLTE7XG4gICAgZG8ge1xuICAgICAgICBieXRlcyAvPSB0aHJlc2g7XG4gICAgICAgICsrdTtcbiAgICB9IHdoaWxlKGJ5dGVzID49IHRocmVzaCk7XG4gICAgcmV0dXJuIGJ5dGVzLnRvRml4ZWQoMSkrJyAnK3VuaXRzW3VdO1xufTtcblxudmFyIHN0YXJ0PWZ1bmN0aW9uKGtzYW5hanMsY2IsY29udGV4dCl7XG4gIHZhciBmaWxlcz1rc2FuYWpzLm5ld2ZpbGVzfHxrc2FuYWpzLmZpbGVzO1xuICB2YXIgYmFzZXVybD1rc2FuYWpzLmJhc2V1cmx8fCBcImh0dHA6Ly8xMjcuMC4wLjE6ODA4MC9cIitrc2FuYWpzLmRiaWQrXCIvXCI7XG4gIHZhciBzdGFydGVkPWtzYW5hZ2FwLnN0YXJ0RG93bmxvYWQoa3NhbmFqcy5kYmlkLGJhc2V1cmwsZmlsZXMuam9pbihcIlxcdWZmZmZcIikpO1xuICBjYi5hcHBseShjb250ZXh0LFtzdGFydGVkXSk7XG59XG52YXIgc3RhdHVzPWZ1bmN0aW9uKCl7XG4gIHZhciBuZmlsZT1rc2FuYWdhcC5kb3dubG9hZGluZ0ZpbGUoKTtcbiAgdmFyIGRvd25sb2FkZWRCeXRlPWtzYW5hZ2FwLmRvd25sb2FkZWRCeXRlKCk7XG4gIHZhciBkb25lPWtzYW5hZ2FwLmRvbmVEb3dubG9hZCgpO1xuICByZXR1cm4ge25maWxlOm5maWxlLGRvd25sb2FkZWRCeXRlOmRvd25sb2FkZWRCeXRlLCBkb25lOmRvbmV9O1xufVxuXG52YXIgY2FuY2VsPWZ1bmN0aW9uKCl7XG4gIHJldHVybiBrc2FuYWdhcC5jYW5jZWxEb3dubG9hZCgpO1xufVxuXG52YXIgbGl2ZXVwZGF0ZT17IGh1bWFuRmlsZVNpemU6IGh1bWFuRmlsZVNpemUsIFxuICBuZWVkVG9VcGRhdGU6IG5lZWRUb1VwZGF0ZSAsIGpzb25wOmpzb25wLCBcbiAgZ2V0VXBkYXRhYmxlczpnZXRVcGRhdGFibGVzLFxuICBzdGFydDpzdGFydCxcbiAgY2FuY2VsOmNhbmNlbCxcbiAgc3RhdHVzOnN0YXR1c1xuICB9O1xubW9kdWxlLmV4cG9ydHM9bGl2ZXVwZGF0ZTsiLCJmdW5jdGlvbiBta2RpclAgKHAsIG1vZGUsIGYsIG1hZGUpIHtcbiAgICAgdmFyIHBhdGggPSBub2RlUmVxdWlyZSgncGF0aCcpO1xuICAgICB2YXIgZnMgPSBub2RlUmVxdWlyZSgnZnMnKTtcblx0XG4gICAgaWYgKHR5cGVvZiBtb2RlID09PSAnZnVuY3Rpb24nIHx8IG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBmID0gbW9kZTtcbiAgICAgICAgbW9kZSA9IDB4MUZGICYgKH5wcm9jZXNzLnVtYXNrKCkpO1xuICAgIH1cbiAgICBpZiAoIW1hZGUpIG1hZGUgPSBudWxsO1xuXG4gICAgdmFyIGNiID0gZiB8fCBmdW5jdGlvbiAoKSB7fTtcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdzdHJpbmcnKSBtb2RlID0gcGFyc2VJbnQobW9kZSwgOCk7XG4gICAgcCA9IHBhdGgucmVzb2x2ZShwKTtcblxuICAgIGZzLm1rZGlyKHAsIG1vZGUsIGZ1bmN0aW9uIChlcikge1xuICAgICAgICBpZiAoIWVyKSB7XG4gICAgICAgICAgICBtYWRlID0gbWFkZSB8fCBwO1xuICAgICAgICAgICAgcmV0dXJuIGNiKG51bGwsIG1hZGUpO1xuICAgICAgICB9XG4gICAgICAgIHN3aXRjaCAoZXIuY29kZSkge1xuICAgICAgICAgICAgY2FzZSAnRU5PRU5UJzpcbiAgICAgICAgICAgICAgICBta2RpclAocGF0aC5kaXJuYW1lKHApLCBtb2RlLCBmdW5jdGlvbiAoZXIsIG1hZGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyKSBjYihlciwgbWFkZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsc2UgbWtkaXJQKHAsIG1vZGUsIGNiLCBtYWRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgYW55IG90aGVyIGVycm9yLCBqdXN0IHNlZSBpZiB0aGVyZSdzIGEgZGlyXG4gICAgICAgICAgICAvLyB0aGVyZSBhbHJlYWR5LiAgSWYgc28sIHRoZW4gaG9vcmF5ISAgSWYgbm90LCB0aGVuIHNvbWV0aGluZ1xuICAgICAgICAgICAgLy8gaXMgYm9ya2VkLlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICBmcy5zdGF0KHAsIGZ1bmN0aW9uIChlcjIsIHN0YXQpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gaWYgdGhlIHN0YXQgZmFpbHMsIHRoZW4gdGhhdCdzIHN1cGVyIHdlaXJkLlxuICAgICAgICAgICAgICAgICAgICAvLyBsZXQgdGhlIG9yaWdpbmFsIGVycm9yIGJlIHRoZSBmYWlsdXJlIHJlYXNvbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVyMiB8fCAhc3RhdC5pc0RpcmVjdG9yeSgpKSBjYihlciwgbWFkZSlcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBjYihudWxsLCBtYWRlKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5ta2RpclAuc3luYyA9IGZ1bmN0aW9uIHN5bmMgKHAsIG1vZGUsIG1hZGUpIHtcbiAgICB2YXIgcGF0aCA9IG5vZGVSZXF1aXJlKCdwYXRoJyk7XG4gICAgdmFyIGZzID0gbm9kZVJlcXVpcmUoJ2ZzJyk7XG4gICAgaWYgKG1vZGUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBtb2RlID0gMHgxRkYgJiAofnByb2Nlc3MudW1hc2soKSk7XG4gICAgfVxuICAgIGlmICghbWFkZSkgbWFkZSA9IG51bGw7XG5cbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdzdHJpbmcnKSBtb2RlID0gcGFyc2VJbnQobW9kZSwgOCk7XG4gICAgcCA9IHBhdGgucmVzb2x2ZShwKTtcblxuICAgIHRyeSB7XG4gICAgICAgIGZzLm1rZGlyU3luYyhwLCBtb2RlKTtcbiAgICAgICAgbWFkZSA9IG1hZGUgfHwgcDtcbiAgICB9XG4gICAgY2F0Y2ggKGVycjApIHtcbiAgICAgICAgc3dpdGNoIChlcnIwLmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ0VOT0VOVCcgOlxuICAgICAgICAgICAgICAgIG1hZGUgPSBzeW5jKHBhdGguZGlybmFtZShwKSwgbW9kZSwgbWFkZSk7XG4gICAgICAgICAgICAgICAgc3luYyhwLCBtb2RlLCBtYWRlKTtcbiAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgLy8gSW4gdGhlIGNhc2Ugb2YgYW55IG90aGVyIGVycm9yLCBqdXN0IHNlZSBpZiB0aGVyZSdzIGEgZGlyXG4gICAgICAgICAgICAvLyB0aGVyZSBhbHJlYWR5LiAgSWYgc28sIHRoZW4gaG9vcmF5ISAgSWYgbm90LCB0aGVuIHNvbWV0aGluZ1xuICAgICAgICAgICAgLy8gaXMgYm9ya2VkLlxuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB2YXIgc3RhdDtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ID0gZnMuc3RhdFN5bmMocCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoIChlcnIxKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IGVycjA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghc3RhdC5pc0RpcmVjdG9yeSgpKSB0aHJvdyBlcnIwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG1hZGU7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IG1rZGlyUC5ta2RpcnAgPSBta2RpclAubWtkaXJQID0gbWtkaXJQO1xuIl19
