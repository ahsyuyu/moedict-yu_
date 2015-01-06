(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"/Users/yu/ksana2015/moedict-yu/index.js":[function(require,module,exports){
var runtime=require("ksana2015-webruntime");
runtime.boot("moedict-yu",function(){
	var Main=React.createElement(require("./src/main.jsx"));
	ksana.mainComponent=React.render(Main,document.getElementById("main"));
});
},{"./src/main.jsx":"/Users/yu/ksana2015/moedict-yu/src/main.jsx","ksana2015-webruntime":"/Users/yu/ksana2015/node_modules/ksana2015-webruntime/index.js"}],"/Users/yu/ksana2015/moedict-yu/src/defbox.jsx":[function(require,module,exports){
var Defbox=React.createClass({displayName: "Defbox",
  getInitialState: function() {
  	return {};
  },
  render: function() {
    return(
	React.createElement("div", null, 
		"render defbox"
	)	
    ); 
  }
});
module.exports=Defbox;
},{}],"/Users/yu/ksana2015/moedict-yu/src/main.jsx":[function(require,module,exports){
var kse=require("ksana-search");
var kde=require("ksana-database");
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
    React.createElement("div", null, 
      React.createElement(Searchbar, {dosearch: this.dosearch}), 
      React.createElement(Overview, {result: this.state.result}), 
      React.createElement("br", null), React.createElement("br", null), 
      React.createElement(Showtext, {searchtype: this.state.searchtype, tofind: this.state.tofind, result: this.state.result})
    )
    );
  }
});
module.exports=maincomponent;
},{"./overview.jsx":"/Users/yu/ksana2015/moedict-yu/src/overview.jsx","./searchbar.jsx":"/Users/yu/ksana2015/moedict-yu/src/searchbar.jsx","./showtext.jsx":"/Users/yu/ksana2015/moedict-yu/src/showtext.jsx","ksana-database":"/Users/yu/ksana2015/node_modules/ksana-database/index.js","ksana-search":"/Users/yu/ksana2015/node_modules/ksana-search/index.js"}],"/Users/yu/ksana2015/moedict-yu/src/overview.jsx":[function(require,module,exports){
var Overview=React.createClass({displayName: "Overview",
  getInitialState: function() {
  	return {};
  },
  renderResult: function(item) {
  	return (React.createElement("option", null, item));
  },
  render: function() {
  	var res=this.props.result || "";
  	var result=res.map(this.renderResult);
    return(
	React.createElement("div", null, 
    React.createElement("span", {id: "vertical_center", className: "badge"}, res.length), 
		React.createElement("div", {className: "col-sm-2"}, 
			React.createElement("select", {className: "form-control"}, 
			result
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
	    React.createElement("input", {className: "form-control col-sm-1", type: "text", ref: "tofind", defaultValue: "明", onChange: this.dosearch})
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
    	React.createElement(Defbox, {result: this.props.result})	
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm1vZWRpY3QteXUvaW5kZXguanMiLCJtb2VkaWN0LXl1L3NyYy9kZWZib3guanN4IiwibW9lZGljdC15dS9zcmMvbWFpbi5qc3giLCJtb2VkaWN0LXl1L3NyYy9vdmVydmlldy5qc3giLCJtb2VkaWN0LXl1L3NyYy9zZWFyY2hiYXIuanN4IiwibW9lZGljdC15dS9zcmMvc2VhcmNoaGlzdG9yeS5qc3giLCJtb2VkaWN0LXl1L3NyYy9zaG93dGV4dC5qc3giLCJub2RlX21vZHVsZXMva3NhbmEtYW5hbHl6ZXIvY29uZmlncy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1hbmFseXplci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1hbmFseXplci90b2tlbml6ZXJzLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWRhdGFiYXNlL2JzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2Uva2RlLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWRhdGFiYXNlL2xpc3RrZGIuanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2UvcGxhdGZvcm0uanMiLCJub2RlX21vZHVsZXMva3NhbmEtanNvbnJvbS9odG1sNXJlYWQuanMiLCJub2RlX21vZHVsZXMva3NhbmEtanNvbnJvbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYi5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYmZzLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWpzb25yb20va2RiZnNfYW5kcm9pZC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYmZzX2lvcy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYncuanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2Jvb2xzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2JzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2V4Y2VycHQuanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLXNlYXJjaC9wbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1zZWFyY2gvc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2NoZWNrYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9kb3dubG9hZGVyLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2ZpbGVpbnN0YWxsZXIuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaHRtbDVmcy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9odG1sZnMuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaW5zdGFsbGtkYi5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9rZnMuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUva2ZzX2h0bWw1LmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2tzYW5hZ2FwLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2xpdmVyZWxvYWQuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvbGl2ZXVwZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9ta2RpcnAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN1dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25IQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hhQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9pQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVTQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcE5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9HQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIHJ1bnRpbWU9cmVxdWlyZShcImtzYW5hMjAxNS13ZWJydW50aW1lXCIpO1xucnVudGltZS5ib290KFwibW9lZGljdC15dVwiLGZ1bmN0aW9uKCl7XG5cdHZhciBNYWluPVJlYWN0LmNyZWF0ZUVsZW1lbnQocmVxdWlyZShcIi4vc3JjL21haW4uanN4XCIpKTtcblx0a3NhbmEubWFpbkNvbXBvbmVudD1SZWFjdC5yZW5kZXIoTWFpbixkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xufSk7IiwidmFyIERlZmJveD1SZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiRGVmYm94XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIFx0cmV0dXJuIHt9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcblx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcblx0XHRcInJlbmRlciBkZWZib3hcIlxuXHQpXHRcbiAgICApOyBcbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cz1EZWZib3g7IiwidmFyIGtzZT1yZXF1aXJlKFwia3NhbmEtc2VhcmNoXCIpO1xudmFyIGtkZT1yZXF1aXJlKFwia3NhbmEtZGF0YWJhc2VcIik7XG52YXIgU2hvd3RleHQ9cmVxdWlyZShcIi4vc2hvd3RleHQuanN4XCIpO1xudmFyIFNlYXJjaGJhcj1yZXF1aXJlKFwiLi9zZWFyY2hiYXIuanN4XCIpO1xudmFyIE92ZXJ2aWV3PXJlcXVpcmUoXCIuL292ZXJ2aWV3LmpzeFwiKTtcbnZhciBtYWluY29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIm1haW5jb21wb25lbnRcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICB2YXIgdGhhdD10aGlzO1xuICAgIGtkZS5vcGVuKFwibW9lZGljdFwiLGZ1bmN0aW9uKGVycixkYil7XG4gICAgICB2YXIgZW50cmllcz1kYi5nZXQoXCJwYWdlTmFtZXNcIik7XG4gICAgICB0aGF0LnNldFN0YXRlKHtlbnRyaWVzOmVudHJpZXN9KTtcbiAgICB9KTsgICAgXG4gIFx0cmV0dXJuIHtyZXN1bHQ6W1wi6aasXCJdLHNlYXJjaHR5cGU6XCJzdGFydFwifTtcbiAgfSxcbiAgaW5kZXhPZlNvcnRlZDogZnVuY3Rpb24gKGFycmF5LCBvYmopIHsgXG4gICAgdmFyIGxvdyA9IDAsXG4gICAgaGlnaCA9IGFycmF5Lmxlbmd0aC0xO1xuICAgIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG4gICAgICBhcnJheVttaWRdIDwgb2JqID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gICAgfVxuICAgIGlmKGFycmF5W2xvd10gIT0gb2JqKSByZXR1cm4gbnVsbDtcbiAgICByZXR1cm4gbG93O1xuICB9LFxuICBkb3NlYXJjaDogZnVuY3Rpb24odG9maW5kLGZpZWxkKSB7XG4gICAgdGhpcy5zZXRTdGF0ZSh7dG9maW5kOnRvZmluZCxzZWFyY2h0eXBlOmZpZWxkfSk7XG4gICAgaWYodGhpcy5zdGF0ZS5zZWFyY2h0eXBlPT1cInN0YXJ0XCIpe1xuICAgICAgdGhpcy5zZWFyY2hfc3RhcnQodG9maW5kKTtcbiAgICB9XG4gICAgaWYodGhpcy5zdGF0ZS5zZWFyY2h0eXBlPT1cImVuZFwiKXtcbiAgICAgIFxuICAgIH1cbiAgICBpZih0aGlzLnN0YXRlLnNlYXJjaHR5cGU9PVwibWlkZGxlXCIpe1xuICAgICAgXG4gICAgfVxuICAgIGlmKHRoaXMuc3RhdGUuc2VhcmNodHlwZT09XCJmdWxsdGV4dFwiKXtcbiAgICAgIHRoaXMuc2VhcmNoX2Z1bGx0ZXh0KHRvZmluZCk7XG4gICAgfVxuXG4gIH0sXG4gIHNlYXJjaF9zdGFydDogZnVuY3Rpb24odG9maW5kKSB7XG4gICAgdmFyIG91dD1bXTtcbiAgICB2YXIgaW5kZXg9dGhpcy5pbmRleE9mU29ydGVkKHRoaXMuc3RhdGUuZW50cmllcyx0b2ZpbmQpO1xuICAgIHZhciBpPTA7XG4gICAgd2hpbGUodGhpcy5zdGF0ZS5lbnRyaWVzW2luZGV4K2ldLmluZGV4T2YodG9maW5kKT09MCl7XG4gICAgICBvdXQucHVzaCh0aGlzLnN0YXRlLmVudHJpZXNbaW5kZXgraV0pO1xuICAgICAgaSsrXG4gICAgfVxuICAgIHRoaXMuc2V0U3RhdGUoe3Jlc3VsdDpvdXR9KTtcbiAgfSxcbiAgc2VhcmNoX2VuZDogZnVuY3Rpb24oKSB7XG5cbiAgfSxcbiAgc2VhcmNoX21pZGRsZTogZnVuY3Rpb24oKSB7XG4gIFxuICB9LFxuICBzZWFyY2hfZnVsbHRleHQ6IGZ1bmN0aW9uKHRvZmluZCkge1xuICAgIGtzZS5zZWFyY2goXCJtb2VkaWN0XCIsdG9maW5kLHtyYW5nZTp7c3RhcnQ6MH19LGZ1bmN0aW9uKGVycixkYXRhKXtcbiAgICAgIHRoYXQuc2V0U3RhdGUoe3Jlc3VsdDpkYXRhLmV4Y2VycHR9KTtcbiAgICB9KSBcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VhcmNoYmFyLCB7ZG9zZWFyY2g6IHRoaXMuZG9zZWFyY2h9KSwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KE92ZXJ2aWV3LCB7cmVzdWx0OiB0aGlzLnN0YXRlLnJlc3VsdH0pLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLCBcbiAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2hvd3RleHQsIHtzZWFyY2h0eXBlOiB0aGlzLnN0YXRlLnNlYXJjaHR5cGUsIHRvZmluZDogdGhpcy5zdGF0ZS50b2ZpbmQsIHJlc3VsdDogdGhpcy5zdGF0ZS5yZXN1bHR9KVxuICAgIClcbiAgICApO1xuICB9XG59KTtcbm1vZHVsZS5leHBvcnRzPW1haW5jb21wb25lbnQ7IiwidmFyIE92ZXJ2aWV3PVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJPdmVydmlld1wiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICBcdHJldHVybiB7fTtcbiAgfSxcbiAgcmVuZGVyUmVzdWx0OiBmdW5jdGlvbihpdGVtKSB7XG4gIFx0cmV0dXJuIChSZWFjdC5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIsIG51bGwsIGl0ZW0pKTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgXHR2YXIgcmVzPXRoaXMucHJvcHMucmVzdWx0IHx8IFwiXCI7XG4gIFx0dmFyIHJlc3VsdD1yZXMubWFwKHRoaXMucmVuZGVyUmVzdWx0KTtcbiAgICByZXR1cm4oXG5cdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcInNwYW5cIiwge2lkOiBcInZlcnRpY2FsX2NlbnRlclwiLCBjbGFzc05hbWU6IFwiYmFkZ2VcIn0sIHJlcy5sZW5ndGgpLCBcblx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIHtjbGFzc05hbWU6IFwiY29sLXNtLTJcIn0sIFxuXHRcdFx0UmVhY3QuY3JlYXRlRWxlbWVudChcInNlbGVjdFwiLCB7Y2xhc3NOYW1lOiBcImZvcm0tY29udHJvbFwifSwgXG5cdFx0XHRyZXN1bHRcblx0XHRcdClcblx0XHQpXG5cdClcdFxuICAgICk7IFxuICB9XG59KTtcbm1vZHVsZS5leHBvcnRzPU92ZXJ2aWV3OyIsInZhciBTZWFyY2hiYXI9UmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNlYXJjaGJhclwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICBcdHJldHVybiB7fTtcbiAgfSxcbiAgZG9zZWFyY2g6IGZ1bmN0aW9uKCkge1xuICBcdHZhciB0b2ZpbmQ9dGhpcy5yZWZzLnRvZmluZC5nZXRET01Ob2RlKCkudmFsdWU7XG4gICAgdmFyIGZpZWxkPSQodGhpcy5yZWZzLnNlYXJjaHR5cGUuZ2V0RE9NTm9kZSgpKS5maW5kKFwiLmFjdGl2ZVwiKVswXS5kYXRhc2V0LnR5cGU7XG4gICAgXG4gIFx0dGhpcy5wcm9wcy5kb3NlYXJjaCh0b2ZpbmQsZmllbGQpO1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcbiAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHQgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2wtc20tM1wifSwgXG5cdCAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge2NsYXNzTmFtZTogXCJmb3JtLWNvbnRyb2wgY29sLXNtLTFcIiwgdHlwZTogXCJ0ZXh0XCIsIHJlZjogXCJ0b2ZpbmRcIiwgZGVmYXVsdFZhbHVlOiBcIuaYjlwiLCBvbkNoYW5nZTogdGhpcy5kb3NlYXJjaH0pXG5cdCAgKSwgXG5cdCAgUmVhY3QuY3JlYXRlRWxlbWVudChcImJyXCIsIG51bGwpLCBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksIFwiwqDCoMKgwqBcIiwgICAgIFxuXHQgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJidG4tZ3JvdXBcIiwgXCJkYXRhLXRvZ2dsZVwiOiBcImJ1dHRvbnNcIiwgcmVmOiBcInNlYXJjaHR5cGVcIiwgb25DbGljazogdGhpcy5kb3NlYXJjaH0sIFxuXHQgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHtcImRhdGEtdHlwZVwiOiBcInN0YXJ0XCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXN1Y2Nlc3MgYWN0aXZlXCJ9LCBcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInJhZGlvXCIsIG5hbWU6IFwiZmllbGRcIiwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSwgXCLpoK1cIilcblx0ICAgICksIFxuXHQgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHtcImRhdGEtdHlwZVwiOiBcImVuZFwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzXCJ9LCBcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInJhZGlvXCIsIG5hbWU6IFwiZmllbGRcIiwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSwgXCLlsL5cIilcblx0ICAgICksIFxuXHQgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHtcImRhdGEtdHlwZVwiOiBcIm1pZGRsZVwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzXCJ9LCBcblx0ICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImlucHV0XCIsIHt0eXBlOiBcInJhZGlvXCIsIG5hbWU6IFwiZmllbGRcIiwgYXV0b2NvbXBsZXRlOiBcIm9mZlwifSwgXCLkuK1cIilcblx0ICAgICksIFxuXHQgICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImxhYmVsXCIsIHtcImRhdGEtdHlwZVwiOiBcImZ1bGx0ZXh0XCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXN1Y2Nlc3NcIn0sIFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwicmFkaW9cIiwgbmFtZTogXCJmaWVsZFwiLCBhdXRvY29tcGxldGU6IFwib2ZmXCJ9LCBcIuWFqFwiKVxuXHQgICAgKVxuXHQgIClcblx0KVxuICApXG4gICAgXHRcbiAgICApOyBcbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cz1TZWFyY2hiYXI7IiwidmFyIFNlYXJjaGhpc3Rvcnk9UmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNlYXJjaGhpc3RvcnlcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgXHRyZXR1cm4ge307XG4gIH0sXG4gIFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybihcblx0UmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcInJlbmRlciBTZWFyY2hoaXN0b3J5XCIpXG4gICAgXHRcbiAgICApOyBcbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cz1TZWFyY2hoaXN0b3J5OyIsInZhciBTZWFyY2hoaXN0b3J5PXJlcXVpcmUoXCIuL3NlYXJjaGhpc3RvcnkuanN4XCIpO1xudmFyIERlZmJveD1yZXF1aXJlKFwiLi9kZWZib3guanN4XCIpO1xudmFyIFNob3d0ZXh0PVJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJTaG93dGV4dFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICBcdHJldHVybiB7fTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgXHRSZWFjdC5jcmVhdGVFbGVtZW50KFNlYXJjaGhpc3RvcnksIHtyZXN1bHQ6IHRoaXMucHJvcHMucmVzdWx0fSksIFxuICAgIFx0UmVhY3QuY3JlYXRlRWxlbWVudChEZWZib3gsIHtyZXN1bHQ6IHRoaXMucHJvcHMucmVzdWx0fSlcdFxuICAgIClcbiAgICApO1xuICB9XG59KTtcbm1vZHVsZS5leHBvcnRzPVNob3d0ZXh0OyIsInZhciB0b2tlbml6ZXJzPXJlcXVpcmUoJy4vdG9rZW5pemVycycpO1xudmFyIG5vcm1hbGl6ZVRibD1udWxsO1xudmFyIHNldE5vcm1hbGl6ZVRhYmxlPWZ1bmN0aW9uKHRibCxvYmopIHtcblx0aWYgKCFvYmopIHtcblx0XHRvYmo9e307XG5cdFx0Zm9yICh2YXIgaT0wO2k8dGJsLmxlbmd0aDtpKyspIHtcblx0XHRcdHZhciBhcnI9dGJsW2ldLnNwbGl0KFwiPVwiKTtcblx0XHRcdG9ialthcnJbMF1dPWFyclsxXTtcblx0XHR9XG5cdH1cblx0bm9ybWFsaXplVGJsPW9iajtcblx0cmV0dXJuIG9iajtcbn1cbnZhciBub3JtYWxpemUxPWZ1bmN0aW9uKHRva2VuKSB7XG5cdGlmICghdG9rZW4pIHJldHVybiBcIlwiO1xuXHR0b2tlbj10b2tlbi5yZXBsYWNlKC9bIFxcblxcLizvvIzjgILvvIHvvI7jgIzjgI3vvJrvvJvjgIFdL2csJycpLnRyaW0oKTtcblx0aWYgKCFub3JtYWxpemVUYmwpIHJldHVybiB0b2tlbjtcblx0aWYgKHRva2VuLmxlbmd0aD09MSkge1xuXHRcdHJldHVybiBub3JtYWxpemVUYmxbdG9rZW5dIHx8IHRva2VuO1xuXHR9IGVsc2Uge1xuXHRcdGZvciAodmFyIGk9MDtpPHRva2VuLmxlbmd0aDtpKyspIHtcblx0XHRcdHRva2VuW2ldPW5vcm1hbGl6ZVRibFt0b2tlbltpXV0gfHwgdG9rZW5baV07XG5cdFx0fVxuXHRcdHJldHVybiB0b2tlbjtcblx0fVxufVxudmFyIGlzU2tpcDE9ZnVuY3Rpb24odG9rZW4pIHtcblx0dmFyIHQ9dG9rZW4udHJpbSgpO1xuXHRyZXR1cm4gKHQ9PVwiXCIgfHwgdD09XCLjgIBcIiB8fCB0PT1cIuKAu1wiIHx8IHQ9PVwiXFxuXCIpO1xufVxudmFyIG5vcm1hbGl6ZV90aWJldGFuPWZ1bmN0aW9uKHRva2VuKSB7XG5cdHJldHVybiB0b2tlbi5yZXBsYWNlKC9b4LyN4LyLIF0vZywnJykudHJpbSgpO1xufVxuXG52YXIgaXNTa2lwX3RpYmV0YW49ZnVuY3Rpb24odG9rZW4pIHtcblx0dmFyIHQ9dG9rZW4udHJpbSgpO1xuXHRyZXR1cm4gKHQ9PVwiXCIgfHwgdD09XCLjgIBcIiB8fCAgdD09XCJcXG5cIik7XHRcbn1cbnZhciBzaW1wbGUxPXtcblx0ZnVuYzp7XG5cdFx0dG9rZW5pemU6dG9rZW5pemVycy5zaW1wbGVcblx0XHQsc2V0Tm9ybWFsaXplVGFibGU6c2V0Tm9ybWFsaXplVGFibGVcblx0XHQsbm9ybWFsaXplOiBub3JtYWxpemUxXG5cdFx0LGlzU2tpcDpcdGlzU2tpcDFcblx0fVxuXHRcbn1cbnZhciB0aWJldGFuMT17XG5cdGZ1bmM6e1xuXHRcdHRva2VuaXplOnRva2VuaXplcnMudGliZXRhblxuXHRcdCxzZXROb3JtYWxpemVUYWJsZTpzZXROb3JtYWxpemVUYWJsZVxuXHRcdCxub3JtYWxpemU6bm9ybWFsaXplX3RpYmV0YW5cblx0XHQsaXNTa2lwOmlzU2tpcF90aWJldGFuXG5cdH1cbn1cbm1vZHVsZS5leHBvcnRzPXtcInNpbXBsZTFcIjpzaW1wbGUxLFwidGliZXRhbjFcIjp0aWJldGFuMX0iLCIvKiBcbiAgY3VzdG9tIGZ1bmMgZm9yIGJ1aWxkaW5nIGFuZCBzZWFyY2hpbmcgeWRiXG5cbiAga2VlcCBhbGwgdmVyc2lvblxuICBcbiAgZ2V0QVBJKHZlcnNpb24pOyAvL3JldHVybiBoYXNoIG9mIGZ1bmN0aW9ucyAsIGlmIHZlciBpcyBvbWl0ICwgcmV0dXJuIGxhc3Rlc3Rcblx0XG4gIHBvc3RpbmdzMlRyZWUgICAgICAvLyBpZiB2ZXJzaW9uIGlzIG5vdCBzdXBwbHksIGdldCBsYXN0ZXN0XG4gIHRva2VuaXplKHRleHQsYXBpKSAvLyBjb252ZXJ0IGEgc3RyaW5nIGludG8gdG9rZW5zKGRlcGVuZHMgb24gb3RoZXIgYXBpKVxuICBub3JtYWxpemVUb2tlbiAgICAgLy8gc3RlbW1pbmcgYW5kIGV0Y1xuICBpc1NwYWNlQ2hhciAgICAgICAgLy8gbm90IGEgc2VhcmNoYWJsZSB0b2tlblxuICBpc1NraXBDaGFyICAgICAgICAgLy8gMCB2cG9zXG5cbiAgZm9yIGNsaWVudCBhbmQgc2VydmVyIHNpZGVcbiAgXG4qL1xudmFyIGNvbmZpZ3M9cmVxdWlyZShcIi4vY29uZmlnc1wiKTtcbnZhciBjb25maWdfc2ltcGxlPVwic2ltcGxlMVwiO1xudmFyIG9wdGltaXplPWZ1bmN0aW9uKGpzb24sY29uZmlnKSB7XG5cdGNvbmZpZz1jb25maWd8fGNvbmZpZ19zaW1wbGU7XG5cdHJldHVybiBqc29uO1xufVxuXG52YXIgZ2V0QVBJPWZ1bmN0aW9uKGNvbmZpZykge1xuXHRjb25maWc9Y29uZmlnfHxjb25maWdfc2ltcGxlO1xuXHR2YXIgZnVuYz1jb25maWdzW2NvbmZpZ10uZnVuYztcblx0ZnVuYy5vcHRpbWl6ZT1vcHRpbWl6ZTtcblx0aWYgKGNvbmZpZz09XCJzaW1wbGUxXCIpIHtcblx0XHQvL2FkZCBjb21tb24gY3VzdG9tIGZ1bmN0aW9uIGhlcmVcblx0fSBlbHNlIGlmIChjb25maWc9PVwidGliZXRhbjFcIikge1xuXG5cdH0gZWxzZSB0aHJvdyBcImNvbmZpZyBcIitjb25maWcgK1wibm90IHN1cHBvcnRlZFwiO1xuXG5cdHJldHVybiBmdW5jO1xufVxuXG5tb2R1bGUuZXhwb3J0cz17Z2V0QVBJOmdldEFQSX07IiwidmFyIHRpYmV0YW4gPWZ1bmN0aW9uKHMpIHtcblx0Ly9jb250aW51b3VzIHRzaGVnIGdyb3VwZWQgaW50byBzYW1lIHRva2VuXG5cdC8vc2hhZCBhbmQgc3BhY2UgZ3JvdXBlZCBpbnRvIHNhbWUgdG9rZW5cblx0dmFyIG9mZnNldD0wO1xuXHR2YXIgdG9rZW5zPVtdLG9mZnNldHM9W107XG5cdHM9cy5yZXBsYWNlKC9cXHJcXG4vZywnXFxuJykucmVwbGFjZSgvXFxyL2csJ1xcbicpO1xuXHR2YXIgYXJyPXMuc3BsaXQoJ1xcbicpO1xuXG5cdGZvciAodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIGxhc3Q9MDtcblx0XHR2YXIgc3RyPWFycltpXTtcblx0XHRzdHIucmVwbGFjZSgvW+C8jeC8iyBdKy9nLGZ1bmN0aW9uKG0sbTEpe1xuXHRcdFx0dG9rZW5zLnB1c2goc3RyLnN1YnN0cmluZyhsYXN0LG0xKSttKTtcblx0XHRcdG9mZnNldHMucHVzaChvZmZzZXQrbGFzdCk7XG5cdFx0XHRsYXN0PW0xK20ubGVuZ3RoO1xuXHRcdH0pO1xuXHRcdGlmIChsYXN0PHN0ci5sZW5ndGgpIHtcblx0XHRcdHRva2Vucy5wdXNoKHN0ci5zdWJzdHJpbmcobGFzdCkpO1xuXHRcdFx0b2Zmc2V0cy5wdXNoKGxhc3QpO1xuXHRcdH1cblx0XHRpZiAoaT09PWFyci5sZW5ndGgtMSkgYnJlYWs7XG5cdFx0dG9rZW5zLnB1c2goJ1xcbicpO1xuXHRcdG9mZnNldHMucHVzaChvZmZzZXQrbGFzdCk7XG5cdFx0b2Zmc2V0Kz1zdHIubGVuZ3RoKzE7XG5cdH1cblxuXHRyZXR1cm4ge3Rva2Vuczp0b2tlbnMsb2Zmc2V0czpvZmZzZXRzfTtcbn07XG52YXIgaXNTcGFjZT1mdW5jdGlvbihjKSB7XG5cdHJldHVybiAoYz09XCIgXCIpIDsvL3x8IChjPT1cIixcIikgfHwgKGM9PVwiLlwiKTtcbn1cbnZhciBpc0NKSyA9ZnVuY3Rpb24oYykge3JldHVybiAoKGM+PTB4MzAwMCAmJiBjPD0weDlGRkYpIFxufHwgKGM+PTB4RDgwMCAmJiBjPDB4REMwMCkgfHwgKGM+PTB4RkYwMCkgKSA7fVxudmFyIHNpbXBsZTE9ZnVuY3Rpb24ocykge1xuXHR2YXIgb2Zmc2V0PTA7XG5cdHZhciB0b2tlbnM9W10sb2Zmc2V0cz1bXTtcblx0cz1zLnJlcGxhY2UoL1xcclxcbi9nLCdcXG4nKS5yZXBsYWNlKC9cXHIvZywnXFxuJyk7XG5cdGFycj1zLnNwbGl0KCdcXG4nKTtcblxuXHR2YXIgcHVzaHRva2VuPWZ1bmN0aW9uKHQsb2ZmKSB7XG5cdFx0dmFyIGk9MDtcblx0XHRpZiAodC5jaGFyQ29kZUF0KDApPjI1NSkge1xuXHRcdFx0d2hpbGUgKGk8dC5sZW5ndGgpIHtcblx0XHRcdFx0dmFyIGM9dC5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0XHRvZmZzZXRzLnB1c2gob2ZmK2kpO1xuXHRcdFx0XHR0b2tlbnMucHVzaCh0W2ldKTtcblx0XHRcdFx0aWYgKGM+PTB4RDgwMCAmJiBjPD0weERGRkYpIHtcblx0XHRcdFx0XHR0b2tlbnNbdG9rZW5zLmxlbmd0aC0xXSs9dFtpXTsgLy9leHRlbnNpb24gQixDLERcblx0XHRcdFx0fVxuXHRcdFx0XHRpKys7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRva2Vucy5wdXNoKHQpO1xuXHRcdFx0b2Zmc2V0cy5wdXNoKG9mZik7XHRcblx0XHR9XG5cdH1cblx0Zm9yICh2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgbGFzdD0wLHNwPVwiXCI7XG5cdFx0c3RyPWFycltpXTtcblx0XHRzdHIucmVwbGFjZSgvW18wLTlBLVphLXpdKy9nLGZ1bmN0aW9uKG0sbTEpe1xuXHRcdFx0d2hpbGUgKGlzU3BhY2Uoc3A9c3RyW2xhc3RdKSAmJiBsYXN0PHN0ci5sZW5ndGgpIHtcblx0XHRcdFx0dG9rZW5zW3Rva2Vucy5sZW5ndGgtMV0rPXNwO1xuXHRcdFx0XHRsYXN0Kys7XG5cdFx0XHR9XG5cdFx0XHRwdXNodG9rZW4oc3RyLnN1YnN0cmluZyhsYXN0LG0xKSttICwgb2Zmc2V0K2xhc3QpO1xuXHRcdFx0b2Zmc2V0cy5wdXNoKG9mZnNldCtsYXN0KTtcblx0XHRcdGxhc3Q9bTErbS5sZW5ndGg7XG5cdFx0fSk7XG5cblx0XHRpZiAobGFzdDxzdHIubGVuZ3RoKSB7XG5cdFx0XHR3aGlsZSAoaXNTcGFjZShzcD1zdHJbbGFzdF0pICYmIGxhc3Q8c3RyLmxlbmd0aCkge1xuXHRcdFx0XHR0b2tlbnNbdG9rZW5zLmxlbmd0aC0xXSs9c3A7XG5cdFx0XHRcdGxhc3QrKztcblx0XHRcdH1cblx0XHRcdHB1c2h0b2tlbihzdHIuc3Vic3RyaW5nKGxhc3QpLCBvZmZzZXQrbGFzdCk7XG5cdFx0XHRcblx0XHR9XHRcdFxuXHRcdG9mZnNldHMucHVzaChvZmZzZXQrbGFzdCk7XG5cdFx0b2Zmc2V0Kz1zdHIubGVuZ3RoKzE7XG5cdFx0aWYgKGk9PT1hcnIubGVuZ3RoLTEpIGJyZWFrO1xuXHRcdHRva2Vucy5wdXNoKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiB7dG9rZW5zOnRva2VucyxvZmZzZXRzOm9mZnNldHN9O1xuXG59O1xuXG52YXIgc2ltcGxlPWZ1bmN0aW9uKHMpIHtcblx0dmFyIHRva2VuPScnO1xuXHR2YXIgdG9rZW5zPVtdLCBvZmZzZXRzPVtdIDtcblx0dmFyIGk9MDsgXG5cdHZhciBsYXN0c3BhY2U9ZmFsc2U7XG5cdHZhciBhZGR0b2tlbj1mdW5jdGlvbigpIHtcblx0XHRpZiAoIXRva2VuKSByZXR1cm47XG5cdFx0dG9rZW5zLnB1c2godG9rZW4pO1xuXHRcdG9mZnNldHMucHVzaChpKTtcblx0XHR0b2tlbj0nJztcblx0fVxuXHR3aGlsZSAoaTxzLmxlbmd0aCkge1xuXHRcdHZhciBjPXMuY2hhckF0KGkpO1xuXHRcdHZhciBjb2RlPXMuY2hhckNvZGVBdChpKTtcblx0XHRpZiAoaXNDSksoY29kZSkpIHtcblx0XHRcdGFkZHRva2VuKCk7XG5cdFx0XHR0b2tlbj1jO1xuXHRcdFx0aWYgKGNvZGU+PTB4RDgwMCAmJiBjb2RlPDB4REMwMCkgeyAvL2hpZ2ggc29ycmFnYXRlXG5cdFx0XHRcdHRva2VuKz1zLmNoYXJBdChpKzEpO2krKztcblx0XHRcdH1cblx0XHRcdGFkZHRva2VuKCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChjPT0nJicgfHwgYz09JzwnIHx8IGM9PSc/JyB8fCBjPT1cIixcIiB8fCBjPT1cIi5cIlxuXHRcdFx0fHwgYz09J3wnIHx8IGM9PSd+JyB8fCBjPT0nYCcgfHwgYz09JzsnIFxuXHRcdFx0fHwgYz09Jz4nIHx8IGM9PSc6JyBcblx0XHRcdHx8IGM9PSc9JyB8fCBjPT0nQCcgIHx8IGM9PVwiLVwiIFxuXHRcdFx0fHwgYz09J10nIHx8IGM9PSd9JyAgfHwgYz09XCIpXCIgXG5cdFx0XHQvL3x8IGM9PSd7JyB8fCBjPT0nfSd8fCBjPT0nWycgfHwgYz09J10nIHx8IGM9PScoJyB8fCBjPT0nKSdcblx0XHRcdHx8IGNvZGU9PTB4ZjBiIHx8IGNvZGU9PTB4ZjBkIC8vIHRpYmV0YW4gc3BhY2Vcblx0XHRcdHx8IChjb2RlPj0weDIwMDAgJiYgY29kZTw9MHgyMDZmKSkge1xuXHRcdFx0XHRhZGR0b2tlbigpO1xuXHRcdFx0XHRpZiAoYz09JyYnIHx8IGM9PSc8Jyl7IC8vIHx8IGM9PSd7J3x8IGM9PScoJ3x8IGM9PSdbJykge1xuXHRcdFx0XHRcdHZhciBlbmRjaGFyPSc+Jztcblx0XHRcdFx0XHRpZiAoYz09JyYnKSBlbmRjaGFyPSc7J1xuXHRcdFx0XHRcdC8vZWxzZSBpZiAoYz09J3snKSBlbmRjaGFyPSd9Jztcblx0XHRcdFx0XHQvL2Vsc2UgaWYgKGM9PSdbJykgZW5kY2hhcj0nXSc7XG5cdFx0XHRcdFx0Ly9lbHNlIGlmIChjPT0nKCcpIGVuZGNoYXI9JyknO1xuXG5cdFx0XHRcdFx0d2hpbGUgKGk8cy5sZW5ndGggJiYgcy5jaGFyQXQoaSkhPWVuZGNoYXIpIHtcblx0XHRcdFx0XHRcdHRva2VuKz1zLmNoYXJBdChpKTtcblx0XHRcdFx0XHRcdGkrKztcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0dG9rZW4rPWVuZGNoYXI7XG5cdFx0XHRcdFx0YWRkdG9rZW4oKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR0b2tlbj1jO1xuXHRcdFx0XHRcdGFkZHRva2VuKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0dG9rZW49Jyc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoYz09XCIgXCIpIHtcblx0XHRcdFx0XHR0b2tlbis9Yztcblx0XHRcdFx0XHRsYXN0c3BhY2U9dHJ1ZTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRpZiAobGFzdHNwYWNlKSBhZGR0b2tlbigpO1xuXHRcdFx0XHRcdGxhc3RzcGFjZT1mYWxzZTtcblx0XHRcdFx0XHR0b2tlbis9Yztcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpKys7XG5cdH1cblx0YWRkdG9rZW4oKTtcblx0cmV0dXJuIHt0b2tlbnM6dG9rZW5zLG9mZnNldHM6b2Zmc2V0c307XG59XG5tb2R1bGUuZXhwb3J0cz17c2ltcGxlOnNpbXBsZSx0aWJldGFuOnRpYmV0YW59OyIsInZhciBpbmRleE9mU29ydGVkID0gZnVuY3Rpb24gKGFycmF5LCBvYmosIG5lYXIpIHsgXG4gIHZhciBsb3cgPSAwLFxuICBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4gMTtcbiAgICBpZiAoYXJyYXlbbWlkXT09b2JqKSByZXR1cm4gbWlkO1xuICAgIGFycmF5W21pZF0gPCBvYmogPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgfVxuICBpZiAobmVhcikgcmV0dXJuIGxvdztcbiAgZWxzZSBpZiAoYXJyYXlbbG93XT09b2JqKSByZXR1cm4gbG93O2Vsc2UgcmV0dXJuIC0xO1xufTtcbnZhciBpbmRleE9mU29ydGVkX3N0ciA9IGZ1bmN0aW9uIChhcnJheSwgb2JqLCBuZWFyKSB7IFxuICB2YXIgbG93ID0gMCxcbiAgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcbiAgICB2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG4gICAgaWYgKGFycmF5W21pZF09PW9iaikgcmV0dXJuIG1pZDtcbiAgICAoYXJyYXlbbWlkXS5sb2NhbGVDb21wYXJlKG9iaik8MCkgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgfVxuICBpZiAobmVhcikgcmV0dXJuIGxvdztcbiAgZWxzZSBpZiAoYXJyYXlbbG93XT09b2JqKSByZXR1cm4gbG93O2Vsc2UgcmV0dXJuIC0xO1xufTtcblxuXG52YXIgYnNlYXJjaD1mdW5jdGlvbihhcnJheSx2YWx1ZSxuZWFyKSB7XG5cdHZhciBmdW5jPWluZGV4T2ZTb3J0ZWQ7XG5cdGlmICh0eXBlb2YgYXJyYXlbMF09PVwic3RyaW5nXCIpIGZ1bmM9aW5kZXhPZlNvcnRlZF9zdHI7XG5cdHJldHVybiBmdW5jKGFycmF5LHZhbHVlLG5lYXIpO1xufVxudmFyIGJzZWFyY2hOZWFyPWZ1bmN0aW9uKGFycmF5LHZhbHVlKSB7XG5cdHJldHVybiBic2VhcmNoKGFycmF5LHZhbHVlLHRydWUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cz1ic2VhcmNoOy8ve2JzZWFyY2hOZWFyOmJzZWFyY2hOZWFyLGJzZWFyY2g6YnNlYXJjaH07IiwidmFyIEtERT1yZXF1aXJlKFwiLi9rZGVcIik7XG4vL2N1cnJlbnRseSBvbmx5IHN1cHBvcnQgbm9kZS5qcyBmcywga3NhbmFnYXAgbmF0aXZlIGZzLCBodG1sNSBmaWxlIHN5c3RlbVxuLy91c2Ugc29ja2V0LmlvIHRvIHJlYWQga2RiIGZyb20gcmVtb3RlIHNlcnZlciBpbiBmdXR1cmVcbm1vZHVsZS5leHBvcnRzPUtERTsiLCIvKiBLc2FuYSBEYXRhYmFzZSBFbmdpbmVcblxuICAgMjAxNS8xLzIgLCBcbiAgIG1vdmUgdG8ga3NhbmEtZGF0YWJhc2VcbiAgIHNpbXBsaWZpZWQgYnkgcmVtb3ZpbmcgZG9jdW1lbnQgc3VwcG9ydCBhbmQgc29ja2V0LmlvIHN1cHBvcnRcblxuXG4qL1xudmFyIHBvb2w9e30sbG9jYWxQb29sPXt9O1xudmFyIGFwcHBhdGg9XCJcIjtcbnZhciBic2VhcmNoPXJlcXVpcmUoXCIuL2JzZWFyY2hcIik7XG52YXIgS2RiPXJlcXVpcmUoJ2tzYW5hLWpzb25yb20nKTtcbnZhciBrZGJzPVtdOyAvL2F2YWlsYWJsZSBrZGIgLCBpZCBhbmQgYWJzb2x1dGUgcGF0aFxudmFyIHN0cnNlcD1cIlxcdWZmZmZcIjtcbnZhciBrZGJsaXN0ZWQ9ZmFsc2U7XG4vKlxudmFyIF9nZXRTeW5jPWZ1bmN0aW9uKHBhdGhzLG9wdHMpIHtcblx0dmFyIG91dD1bXTtcblx0Zm9yICh2YXIgaSBpbiBwYXRocykge1xuXHRcdG91dC5wdXNoKHRoaXMuZ2V0U3luYyhwYXRoc1tpXSxvcHRzKSk7XHRcblx0fVxuXHRyZXR1cm4gb3V0O1xufVxuKi9cbnZhciBfZ2V0cz1mdW5jdGlvbihwYXRocyxvcHRzLGNiKSB7IC8vZ2V0IG1hbnkgZGF0YSB3aXRoIG9uZSBjYWxsXG5cblx0aWYgKCFwYXRocykgcmV0dXJuIDtcblx0aWYgKHR5cGVvZiBwYXRocz09J3N0cmluZycpIHtcblx0XHRwYXRocz1bcGF0aHNdO1xuXHR9XG5cdHZhciBlbmdpbmU9dGhpcywgb3V0cHV0PVtdO1xuXG5cdHZhciBtYWtlY2I9ZnVuY3Rpb24ocGF0aCl7XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRpZiAoIShkYXRhICYmIHR5cGVvZiBkYXRhID09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkgb3V0cHV0LnB1c2goZGF0YSk7XG5cdFx0XHRcdGVuZ2luZS5nZXQocGF0aCxvcHRzLHRhc2txdWV1ZS5zaGlmdCgpKTtcblx0XHR9O1xuXHR9O1xuXG5cdHZhciB0YXNrcXVldWU9W107XG5cdGZvciAodmFyIGk9MDtpPHBhdGhzLmxlbmd0aDtpKyspIHtcblx0XHRpZiAodHlwZW9mIHBhdGhzW2ldPT1cIm51bGxcIikgeyAvL3RoaXMgaXMgb25seSBhIHBsYWNlIGhvbGRlciBmb3Iga2V5IGRhdGEgYWxyZWFkeSBpbiBjbGllbnQgY2FjaGVcblx0XHRcdG91dHB1dC5wdXNoKG51bGwpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0YXNrcXVldWUucHVzaChtYWtlY2IocGF0aHNbaV0pKTtcblx0XHR9XG5cdH07XG5cblx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XG5cdFx0b3V0cHV0LnB1c2goZGF0YSk7XG5cdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHR8fGVuZ2luZSxbb3V0cHV0LHBhdGhzXSk7IC8vcmV0dXJuIHRvIGNhbGxlclxuXHR9KTtcblxuXHR0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7IC8vcnVuIHRoZSB0YXNrXG59XG5cbnZhciBnZXRGaWxlUmFuZ2U9ZnVuY3Rpb24oaSkge1xuXHR2YXIgZW5naW5lPXRoaXM7XG5cblx0dmFyIGZpbGVQYWdlQ291bnQ9ZW5naW5lLmdldChbXCJmaWxlUGFnZUNvdW50XCJdKTtcblx0aWYgKGZpbGVQYWdlQ291bnQpIHtcblx0XHRpZiAoaT09MCkge1xuXHRcdFx0cmV0dXJuIHtzdGFydDowLGVuZDpmaWxlUGFnZUNvdW50WzBdLTF9O1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZXR1cm4ge3N0YXJ0OmZpbGVQYWdlQ291bnRbaS0xXSxlbmQ6ZmlsZVBhZ2VDb3VudFtpXS0xfTtcblx0XHR9XG5cdH1cblxuXHQvL29sZCBidWdneSBjb2RlXG5cdHZhciBmaWxlTmFtZXM9ZW5naW5lLmdldChbXCJmaWxlTmFtZXNcIl0pO1xuXHR2YXIgZmlsZU9mZnNldHM9ZW5naW5lLmdldChbXCJmaWxlT2Zmc2V0c1wiXSk7XG5cdHZhciBwYWdlT2Zmc2V0cz1lbmdpbmUuZ2V0KFtcInBhZ2VPZmZzZXRzXCJdKTtcblx0dmFyIHBhZ2VOYW1lcz1lbmdpbmUuZ2V0KFtcInBhZ2VOYW1lc1wiXSk7XG5cdHZhciBmaWxlU3RhcnQ9ZmlsZU9mZnNldHNbaV0sIGZpbGVFbmQ9ZmlsZU9mZnNldHNbaSsxXS0xO1xuXG5cdFxuXHR2YXIgc3RhcnQ9YnNlYXJjaChwYWdlT2Zmc2V0cyxmaWxlU3RhcnQsdHJ1ZSk7XHRcblx0Ly9pZiAocGFnZU9mZnNldHNbc3RhcnRdPT1maWxlU3RhcnQpIHN0YXJ0LS07XG5cdFxuXHQvL3dvcmsgYXJvdW5kIGZvciBqaWFuZ2thbmd5dXJcblx0d2hpbGUgKHBhZ2VOYW1lc1tzdGFydCsxXT09XCJfXCIpIHN0YXJ0Kys7XG5cbiAgLy9pZiAoaT09MCkgc3RhcnQ9MDsgLy93b3JrIGFyb3VuZCBmb3IgZmlyc3QgZmlsZVxuXHR2YXIgZW5kPWJzZWFyY2gocGFnZU9mZnNldHMsZmlsZUVuZCx0cnVlKTtcblx0cmV0dXJuIHtzdGFydDpzdGFydCxlbmQ6ZW5kfTtcbn1cblxudmFyIGdldGZwPWZ1bmN0aW9uKGFic29sdXRlcGFnZSkge1xuXHR2YXIgZmlsZU9mZnNldHM9dGhpcy5nZXQoW1wiZmlsZU9mZnNldHNcIl0pO1xuXHR2YXIgcGFnZU9mZnNldHM9dGhpcy5nZXQoW1wicGFnZU9mZnNldHNcIl0pO1xuXHR2YXIgcGFnZW9mZnNldD1wYWdlT2Zmc2V0c1thYnNvbHV0ZXBhZ2VdO1xuXHR2YXIgZmlsZT1ic2VhcmNoKGZpbGVPZmZzZXRzLHBhZ2VvZmZzZXQsdHJ1ZSktMTtcblxuXHR2YXIgZmlsZVN0YXJ0PWZpbGVPZmZzZXRzW2ZpbGVdO1xuXHR2YXIgc3RhcnQ9YnNlYXJjaChwYWdlT2Zmc2V0cyxmaWxlU3RhcnQsdHJ1ZSk7XHRcblxuXHR2YXIgcGFnZT1hYnNvbHV0ZXBhZ2Utc3RhcnQtMTtcblx0cmV0dXJuIHtmaWxlOmZpbGUscGFnZTpwYWdlfTtcbn1cbi8vcmV0dXJuIGFycmF5IG9mIG9iamVjdCBvZiBuZmlsZSBucGFnZSBnaXZlbiBwYWdlbmFtZVxudmFyIGZpbmRQYWdlPWZ1bmN0aW9uKHBhZ2VuYW1lKSB7XG5cdHZhciBwYWdlbmFtZXM9dGhpcy5nZXQoXCJwYWdlTmFtZXNcIik7XG5cdHZhciBvdXQ9W107XG5cdGZvciAodmFyIGk9MDtpPHBhZ2VuYW1lcy5sZW5ndGg7aSsrKSB7XG5cdFx0aWYgKHBhZ2VuYW1lc1tpXT09cGFnZW5hbWUpIHtcblx0XHRcdHZhciBmcD1nZXRmcC5hcHBseSh0aGlzLFtpXSk7XG5cdFx0XHRvdXQucHVzaCh7ZmlsZTpmcC5maWxlLHBhZ2U6ZnAucGFnZSxhYnNwYWdlOml9KTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG91dDtcbn1cbnZhciBnZXRGaWxlUGFnZU9mZnNldHM9ZnVuY3Rpb24oaSkge1xuXHR2YXIgcGFnZU9mZnNldHM9dGhpcy5nZXQoXCJwYWdlT2Zmc2V0c1wiKTtcblx0dmFyIHJhbmdlPWdldEZpbGVSYW5nZS5hcHBseSh0aGlzLFtpXSk7XG5cdHJldHVybiBwYWdlT2Zmc2V0cy5zbGljZShyYW5nZS5zdGFydCxyYW5nZS5lbmQrMSk7XG59XG5cbnZhciBnZXRGaWxlUGFnZU5hbWVzPWZ1bmN0aW9uKGkpIHtcblx0dmFyIHJhbmdlPWdldEZpbGVSYW5nZS5hcHBseSh0aGlzLFtpXSk7XG5cdHZhciBwYWdlTmFtZXM9dGhpcy5nZXQoXCJwYWdlTmFtZXNcIik7XG5cdHJldHVybiBwYWdlTmFtZXMuc2xpY2UocmFuZ2Uuc3RhcnQscmFuZ2UuZW5kKzEpO1xufVxudmFyIGxvY2FsZW5naW5lX2dldD1mdW5jdGlvbihwYXRoLG9wdHMsY2IpIHtcblx0dmFyIGVuZ2luZT10aGlzO1xuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikge1xuXHRcdGNiPW9wdHM7XG5cdFx0b3B0cz17cmVjdXJzaXZlOmZhbHNlfTtcblx0fVxuXHRpZiAoIXBhdGgpIHtcblx0XHRpZiAoY2IpIGNiKG51bGwpO1xuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBjYiE9XCJmdW5jdGlvblwiKSB7XG5cdFx0cmV0dXJuIGVuZ2luZS5rZGIuZ2V0KHBhdGgsb3B0cyk7XG5cdH1cblxuXHRpZiAodHlwZW9mIHBhdGg9PVwic3RyaW5nXCIpIHtcblx0XHRyZXR1cm4gZW5naW5lLmtkYi5nZXQoW3BhdGhdLG9wdHMsY2IpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBwYXRoWzBdID09XCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBlbmdpbmUua2RiLmdldChwYXRoLG9wdHMsY2IpO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBwYXRoWzBdID09XCJvYmplY3RcIikge1xuXHRcdHJldHVybiBfZ2V0cy5hcHBseShlbmdpbmUsW3BhdGgsb3B0cyxjYl0pO1xuXHR9IGVsc2Uge1xuXHRcdGVuZ2luZS5rZGIuZ2V0KFtdLG9wdHMsZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRjYihkYXRhWzBdKTsvL3JldHVybiB0b3AgbGV2ZWwga2V5c1xuXHRcdH0pO1xuXHR9XG59O1x0XG5cbnZhciBnZXRQcmVsb2FkRmllbGQ9ZnVuY3Rpb24odXNlcikge1xuXHR2YXIgcHJlbG9hZD1bW1wibWV0YVwiXSxbXCJmaWxlTmFtZXNcIl0sW1wiZmlsZU9mZnNldHNcIl0sW1wicGFnZU5hbWVzXCJdLFtcInBhZ2VPZmZzZXRzXCJdLFtcImZpbGVQYWdlQ291bnRcIl1dO1xuXHQvL1tcInRva2Vuc1wiXSxbXCJwb3N0aW5nc2xlblwiXSBrc2Ugd2lsbCBsb2FkIGl0XG5cdGlmICh1c2VyICYmIHVzZXIubGVuZ3RoKSB7IC8vdXNlciBzdXBwbHkgcHJlbG9hZFxuXHRcdGZvciAodmFyIGk9MDtpPHVzZXIubGVuZ3RoO2krKykge1xuXHRcdFx0aWYgKHByZWxvYWQuaW5kZXhPZih1c2VyW2ldKT09LTEpIHtcblx0XHRcdFx0cHJlbG9hZC5wdXNoKHVzZXJbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcHJlbG9hZDtcbn1cbnZhciBjcmVhdGVMb2NhbEVuZ2luZT1mdW5jdGlvbihrZGIsb3B0cyxjYixjb250ZXh0KSB7XG5cdHZhciBlbmdpbmU9e2tkYjprZGIsIHF1ZXJ5Q2FjaGU6e30sIHBvc3RpbmdDYWNoZTp7fSwgY2FjaGU6e319O1xuXG5cdGlmICh0eXBlb2YgY29udGV4dD09XCJvYmplY3RcIikgZW5naW5lLmNvbnRleHQ9Y29udGV4dDtcblx0ZW5naW5lLmdldD1sb2NhbGVuZ2luZV9nZXQ7XG5cblx0ZW5naW5lLmZpbGVPZmZzZXQ9ZmlsZU9mZnNldDtcblx0ZW5naW5lLmZvbGRlck9mZnNldD1mb2xkZXJPZmZzZXQ7XG5cdGVuZ2luZS5wYWdlT2Zmc2V0PXBhZ2VPZmZzZXQ7XG5cdGVuZ2luZS5nZXRGaWxlUGFnZU5hbWVzPWdldEZpbGVQYWdlTmFtZXM7XG5cdGVuZ2luZS5nZXRGaWxlUGFnZU9mZnNldHM9Z2V0RmlsZVBhZ2VPZmZzZXRzO1xuXHRlbmdpbmUuZ2V0RmlsZVJhbmdlPWdldEZpbGVSYW5nZTtcblx0ZW5naW5lLmZpbmRQYWdlPWZpbmRQYWdlO1xuXHQvL29ubHkgbG9jYWwgZW5naW5lIGFsbG93IGdldFN5bmNcblx0Ly9pZiAoa2RiLmZzLmdldFN5bmMpIGVuZ2luZS5nZXRTeW5jPWVuZ2luZS5rZGIuZ2V0U3luYztcblx0XG5cdC8vc3BlZWR5IG5hdGl2ZSBmdW5jdGlvbnNcblx0aWYgKGtkYi5mcy5tZXJnZVBvc3RpbmdzKSB7XG5cdFx0ZW5naW5lLm1lcmdlUG9zdGluZ3M9a2RiLmZzLm1lcmdlUG9zdGluZ3MuYmluZChrZGIuZnMpO1xuXHR9XG5cdFxuXHR2YXIgc2V0UHJlbG9hZD1mdW5jdGlvbihyZXMpIHtcblx0XHRlbmdpbmUuZGJuYW1lPXJlc1swXS5uYW1lO1xuXHRcdC8vZW5naW5lLmN1c3RvbWZ1bmM9Y3VzdG9tZnVuYy5nZXRBUEkocmVzWzBdLmNvbmZpZyk7XG5cdFx0ZW5naW5lLnJlYWR5PXRydWU7XG5cdH1cblxuXHR2YXIgcHJlbG9hZD1nZXRQcmVsb2FkRmllbGQob3B0cy5wcmVsb2FkKTtcblx0dmFyIG9wdHM9e3JlY3Vyc2l2ZTp0cnVlfTtcblx0Ly9pZiAodHlwZW9mIGNiPT1cImZ1bmN0aW9uXCIpIHtcblx0XHRfZ2V0cy5hcHBseShlbmdpbmUsWyBwcmVsb2FkLCBvcHRzLGZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRzZXRQcmVsb2FkKHJlcyk7XG5cdFx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbZW5naW5lXSk7XG5cdFx0fV0pO1xuXHQvL30gZWxzZSB7XG5cdC8vXHRzZXRQcmVsb2FkKF9nZXRTeW5jLmFwcGx5KGVuZ2luZSxbcHJlbG9hZCxvcHRzXSkpO1xuXHQvL31cblx0cmV0dXJuIGVuZ2luZTtcbn1cblxudmFyIHBhZ2VPZmZzZXQ9ZnVuY3Rpb24ocGFnZW5hbWUpIHtcblx0dmFyIGVuZ2luZT10aGlzO1xuXHRpZiAoYXJndW1lbnRzLmxlbmd0aD4xKSB0aHJvdyBcImFyZ3VtZW50IDogcGFnZW5hbWUgXCI7XG5cblx0dmFyIHBhZ2VOYW1lcz1lbmdpbmUuZ2V0KFwicGFnZU5hbWVzXCIpO1xuXHR2YXIgcGFnZU9mZnNldHM9ZW5naW5lLmdldChcInBhZ2VPZmZzZXRzXCIpO1xuXG5cdHZhciBpPXBhZ2VOYW1lcy5pbmRleE9mKHBhZ2VuYW1lKTtcblx0cmV0dXJuIChpPi0xKT9wYWdlT2Zmc2V0c1tpXTowO1xufVxudmFyIGZpbGVPZmZzZXQ9ZnVuY3Rpb24oZm4pIHtcblx0dmFyIGVuZ2luZT10aGlzO1xuXHR2YXIgZmlsZW5hbWVzPWVuZ2luZS5nZXQoXCJmaWxlTmFtZXNcIik7XG5cdHZhciBvZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0dmFyIGk9ZmlsZW5hbWVzLmluZGV4T2YoZm4pO1xuXHRpZiAoaT09LTEpIHJldHVybiBudWxsO1xuXHRyZXR1cm4ge3N0YXJ0OiBvZmZzZXRzW2ldLCBlbmQ6b2Zmc2V0c1tpKzFdfTtcbn1cblxudmFyIGZvbGRlck9mZnNldD1mdW5jdGlvbihmb2xkZXIpIHtcblx0dmFyIGVuZ2luZT10aGlzO1xuXHR2YXIgc3RhcnQ9MCxlbmQ9MDtcblx0dmFyIGZpbGVuYW1lcz1lbmdpbmUuZ2V0KFwiZmlsZU5hbWVzXCIpO1xuXHR2YXIgb2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdGZvciAodmFyIGk9MDtpPGZpbGVuYW1lcy5sZW5ndGg7aSsrKSB7XG5cdFx0aWYgKGZpbGVuYW1lc1tpXS5zdWJzdHJpbmcoMCxmb2xkZXIubGVuZ3RoKT09Zm9sZGVyKSB7XG5cdFx0XHRpZiAoIXN0YXJ0KSBzdGFydD1vZmZzZXRzW2ldO1xuXHRcdFx0ZW5kPW9mZnNldHNbaV07XG5cdFx0fSBlbHNlIGlmIChzdGFydCkgYnJlYWs7XG5cdH1cblx0cmV0dXJuIHtzdGFydDpzdGFydCxlbmQ6ZW5kfTtcbn1cblxuIC8vVE9ETyBkZWxldGUgZGlyZWN0bHkgZnJvbSBrZGIgaW5zdGFuY2VcbiAvL2tkYi5mcmVlKCk7XG52YXIgY2xvc2VMb2NhbD1mdW5jdGlvbihrZGJpZCkge1xuXHR2YXIgZW5naW5lPWxvY2FsUG9vbFtrZGJpZF07XG5cdGlmIChlbmdpbmUpIHtcblx0XHRlbmdpbmUua2RiLmZyZWUoKTtcblx0XHRkZWxldGUgbG9jYWxQb29sW2tkYmlkXTtcblx0fVxufVxudmFyIGNsb3NlPWZ1bmN0aW9uKGtkYmlkKSB7XG5cdHZhciBlbmdpbmU9cG9vbFtrZGJpZF07XG5cdGlmIChlbmdpbmUpIHtcblx0XHRlbmdpbmUua2RiLmZyZWUoKTtcblx0XHRkZWxldGUgcG9vbFtrZGJpZF07XG5cdH1cbn1cblxudmFyIGdldExvY2FsVHJpZXM9ZnVuY3Rpb24oa2RiZm4pIHtcblx0aWYgKCFrZGJsaXN0ZWQpIHtcblx0XHRrZGJzPXJlcXVpcmUoXCIuL2xpc3RrZGJcIikoKTtcblx0XHRrZGJsaXN0ZWQ9dHJ1ZTtcblx0fVxuXG5cdHZhciBrZGJpZD1rZGJmbi5yZXBsYWNlKCcua2RiJywnJyk7XG5cdHZhciB0cmllcz0gW1wiLi9cIitrZGJpZCtcIi5rZGJcIlxuXHQgICAgICAgICAgICxcIi4uL1wiK2tkYmlkK1wiLmtkYlwiXG5cdF07XG5cblx0Zm9yICh2YXIgaT0wO2k8a2Ricy5sZW5ndGg7aSsrKSB7XG5cdFx0aWYgKGtkYnNbaV1bMF09PWtkYmlkKSB7XG5cdFx0XHR0cmllcy5wdXNoKGtkYnNbaV1bMV0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdHJpZXM7XG59XG52YXIgb3BlbkxvY2FsS3NhbmFnYXA9ZnVuY3Rpb24oa2RiaWQsb3B0cyxjYixjb250ZXh0KSB7XG5cdHZhciBrZGJmbj1rZGJpZDtcblx0dmFyIHRyaWVzPWdldExvY2FsVHJpZXMoa2RiZm4pO1xuXG5cdGZvciAodmFyIGk9MDtpPHRyaWVzLmxlbmd0aDtpKyspIHtcblx0XHRpZiAoZnMuZXhpc3RzU3luYyh0cmllc1tpXSkpIHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJrZGIgcGF0aDogXCIrbm9kZVJlcXVpcmUoJ3BhdGgnKS5yZXNvbHZlKHRyaWVzW2ldKSk7XG5cdFx0XHR2YXIga2RiPW5ldyBLZGIub3Blbih0cmllc1tpXSxmdW5jdGlvbihlcnIsa2RiKXtcblx0XHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW2Vycl0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNyZWF0ZUxvY2FsRW5naW5lKGtkYixvcHRzLGZ1bmN0aW9uKGVuZ2luZSl7XG5cdFx0XHRcdFx0XHRsb2NhbFBvb2xba2RiaWRdPWVuZ2luZTtcblx0XHRcdFx0XHRcdGNiLmFwcGx5KGNvbnRleHR8fGVuZ2luZS5jb250ZXh0LFswLGVuZ2luZV0pO1xuXHRcdFx0XHRcdH0sY29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxba2RiaWQrXCIgbm90IGZvdW5kXCJdKTtcblx0cmV0dXJuIG51bGw7XG5cbn1cbnZhciBvcGVuTG9jYWxOb2RlPWZ1bmN0aW9uKGtkYmlkLG9wdHMsY2IsY29udGV4dCkge1xuXHR2YXIgZnM9cmVxdWlyZSgnZnMnKTtcblx0dmFyIHRyaWVzPWdldExvY2FsVHJpZXMoa2RiaWQpO1xuXG5cdGZvciAodmFyIGk9MDtpPHRyaWVzLmxlbmd0aDtpKyspIHtcblx0XHRpZiAoZnMuZXhpc3RzU3luYyh0cmllc1tpXSkpIHtcblxuXHRcdFx0bmV3IEtkYi5vcGVuKHRyaWVzW2ldLGZ1bmN0aW9uKGVycixrZGIpe1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dHx8ZW5naW5lLmNvbnRlbnQsW2Vycl0pO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNyZWF0ZUxvY2FsRW5naW5lKGtkYixvcHRzLGZ1bmN0aW9uKGVuZ2luZSl7XG5cdFx0XHRcdFx0XHRcdGxvY2FsUG9vbFtrZGJpZF09ZW5naW5lO1xuXHRcdFx0XHRcdFx0XHRjYi5hcHBseShjb250ZXh0fHxlbmdpbmUuY29udGV4dCxbMCxlbmdpbmVdKTtcblx0XHRcdFx0XHR9LGNvbnRleHQpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2tkYmlkK1wiIG5vdCBmb3VuZFwiXSk7XG5cdHJldHVybiBudWxsO1xufVxuXG52YXIgb3BlbkxvY2FsSHRtbDU9ZnVuY3Rpb24oa2RiaWQsb3B0cyxjYixjb250ZXh0KSB7XHRcblx0dmFyIGVuZ2luZT1sb2NhbFBvb2xba2RiaWRdO1xuXHR2YXIga2RiZm49a2RiaWQ7XG5cdGlmIChrZGJmbi5pbmRleE9mKFwiLmtkYlwiKT09LTEpIGtkYmZuKz1cIi5rZGJcIjtcblx0bmV3IEtkYi5vcGVuKGtkYmZuLGZ1bmN0aW9uKGVycixoYW5kbGUpe1xuXHRcdGlmIChlcnIpIHtcblx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW2Vycl0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRjcmVhdGVMb2NhbEVuZ2luZShoYW5kbGUsb3B0cyxmdW5jdGlvbihlbmdpbmUpe1xuXHRcdFx0XHRsb2NhbFBvb2xba2RiaWRdPWVuZ2luZTtcblx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dHx8ZW5naW5lLmNvbnRleHQsWzAsZW5naW5lXSk7XG5cdFx0XHR9LGNvbnRleHQpO1xuXHRcdH1cblx0fSk7XG59XG4vL29taXQgY2IgZm9yIHN5bmNyb25pemUgb3BlblxudmFyIG9wZW5Mb2NhbD1mdW5jdGlvbihrZGJpZCxvcHRzLGNiLGNvbnRleHQpICB7XG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7IC8vbm8gb3B0c1xuXHRcdGlmICh0eXBlb2YgY2I9PVwib2JqZWN0XCIpIGNvbnRleHQ9Y2I7XG5cdFx0Y2I9b3B0cztcblx0XHRvcHRzPXt9O1xuXHR9XG5cblx0dmFyIGVuZ2luZT1sb2NhbFBvb2xba2RiaWRdO1xuXHRpZiAoZW5naW5lKSB7XG5cdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0fHxlbmdpbmUuY29udGV4dCxbMCxlbmdpbmVdKTtcblx0XHRyZXR1cm4gZW5naW5lO1xuXHR9XG5cblx0dmFyIHBsYXRmb3JtPXJlcXVpcmUoXCIuL3BsYXRmb3JtXCIpLmdldFBsYXRmb3JtKCk7XG5cdGlmIChwbGF0Zm9ybT09XCJub2RlLXdlYmtpdFwiIHx8IHBsYXRmb3JtPT1cIm5vZGVcIikge1xuXHRcdG9wZW5Mb2NhbE5vZGUoa2RiaWQsb3B0cyxjYixjb250ZXh0KTtcblx0fSBlbHNlIGlmIChwbGF0Zm9ybT09XCJodG1sNVwiIHx8IHBsYXRmb3JtPT1cImNocm9tZVwiKXtcblx0XHRvcGVuTG9jYWxIdG1sNShrZGJpZCxvcHRzLGNiLGNvbnRleHQpO1x0XHRcblx0fSBlbHNlIHtcblx0XHRvcGVuTG9jYWxLc2FuYWdhcChrZGJpZCxvcHRzLGNiLGNvbnRleHQpO1x0XG5cdH1cbn1cbnZhciBzZXRQYXRoPWZ1bmN0aW9uKHBhdGgpIHtcblx0YXBwcGF0aD1wYXRoO1xuXHRjb25zb2xlLmxvZyhcInNldCBwYXRoXCIscGF0aClcbn1cblxudmFyIGVudW1LZGI9ZnVuY3Rpb24oY2IsY29udGV4dCl7XG5cdHJldHVybiBrZGJzLm1hcChmdW5jdGlvbihrKXtyZXR1cm4ga1swXX0pO1xufVxuXG5tb2R1bGUuZXhwb3J0cz17b3BlbjpvcGVuTG9jYWwsc2V0UGF0aDpzZXRQYXRoLCBjbG9zZTpjbG9zZUxvY2FsLCBlbnVtS2RiOmVudW1LZGJ9OyIsIi8qIHJldHVybiBhcnJheSBvZiBkYmlkIGFuZCBhYnNvbHV0ZSBwYXRoKi9cbnZhciBsaXN0a2RiX2h0bWw1PWZ1bmN0aW9uKCkge1xuXHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCI7XG5cdHJlcXVpcmUoXCJrc2FuYS1qc29ucm9tXCIpLmh0bWw1ZnMucmVhZGRpcihmdW5jdGlvbihrZGJzKXtcblx0XHRcdGNiLmFwcGx5KHRoaXMsW2tkYnNdKTtcblx0fSxjb250ZXh0fHx0aGlzKTtcdFx0XG5cbn1cblxudmFyIGxpc3RrZGJfbm9kZT1mdW5jdGlvbigpe1xuXHR2YXIgZnM9cmVxdWlyZShcImZzXCIpO1xuXHR2YXIgcGF0aD1yZXF1aXJlKFwicGF0aFwiKVxuXHR2YXIgcGFyZW50PXBhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLFwiLi5cIik7XG5cdHZhciBmaWxlcz1mcy5yZWFkZGlyU3luYyhwYXJlbnQpO1xuXHR2YXIgb3V0cHV0PVtdO1xuXHRmaWxlcy5tYXAoZnVuY3Rpb24oZil7XG5cdFx0dmFyIHN1YmRpcj1wYXJlbnQrcGF0aC5zZXArZjtcblx0XHR2YXIgc3RhdD1mcy5zdGF0U3luYyhzdWJkaXIgKTtcblx0XHRpZiAoc3RhdC5pc0RpcmVjdG9yeSgpKSB7XG5cdFx0XHR2YXIgc3ViZmlsZXM9ZnMucmVhZGRpclN5bmMoc3ViZGlyKTtcblx0XHRcdGZvciAodmFyIGk9MDtpPHN1YmZpbGVzLmxlbmd0aDtpKyspIHtcblx0XHRcdFx0dmFyIGZpbGU9c3ViZmlsZXNbaV07XG5cdFx0XHRcdHZhciBpZHg9ZmlsZS5pbmRleE9mKFwiLmtkYlwiKTtcblx0XHRcdFx0aWYgKGlkeD4tMSYmaWR4PT1maWxlLmxlbmd0aC00KSB7XG5cdFx0XHRcdFx0b3V0cHV0LnB1c2goWyBmaWxlLnN1YnN0cigwLGZpbGUubGVuZ3RoLTQpLCBzdWJkaXIrcGF0aC5zZXArZmlsZV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9KVxuXHRyZXR1cm4gb3V0cHV0O1xufVxuXG52YXIgbGlzdGtkYj1mdW5jdGlvbigpIHtcblx0dmFyIHBsYXRmb3JtPXJlcXVpcmUoXCIuL3BsYXRmb3JtXCIpLmdldFBsYXRmb3JtKCk7XG5cdHZhciBmaWxlcz1bXTtcblx0aWYgKHBsYXRmb3JtPT1cIm5vZGVcIiB8fCBwbGF0Zm9ybT09XCJub2RlLXdlYmtpdFwiKSB7XG5cdFx0ZmlsZXM9bGlzdGtkYl9ub2RlKCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgXCJub3QgaW1wbGVtZW50IHlldFwiO1xuXHR9XG5cdHJldHVybiBmaWxlcztcbn1cbm1vZHVsZS5leHBvcnRzPWxpc3RrZGI7IiwidmFyIGdldFBsYXRmb3JtPWZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGtzYW5hZ2FwPT1cInVuZGVmaW5lZFwiKSB7XG5cdFx0cGxhdGZvcm09XCJub2RlXCI7XG5cdH0gZWxzZSB7XG5cdFx0cGxhdGZvcm09a3NhbmFnYXAucGxhdGZvcm07XG5cdH1cblx0cmV0dXJuIHBsYXRmb3JtO1xufVxubW9kdWxlLmV4cG9ydHM9e2dldFBsYXRmb3JtOmdldFBsYXRmb3JtfTsiLCJcbi8qIGVtdWxhdGUgZmlsZXN5c3RlbSBvbiBodG1sNSBicm93c2VyICovXG4vKiBlbXVsYXRlIGZpbGVzeXN0ZW0gb24gaHRtbDUgYnJvd3NlciAqL1xudmFyIHJlYWQ9ZnVuY3Rpb24oaGFuZGxlLGJ1ZmZlcixvZmZzZXQsbGVuZ3RoLHBvc2l0aW9uLGNiKSB7Ly9idWZmZXIgYW5kIG9mZnNldCBpcyBub3QgdXNlZFxuXHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHhoci5vcGVuKCdHRVQnLCBoYW5kbGUudXJsICwgdHJ1ZSk7XG5cdHZhciByYW5nZT1bcG9zaXRpb24sbGVuZ3RoK3Bvc2l0aW9uLTFdO1xuXHR4aHIuc2V0UmVxdWVzdEhlYWRlcignUmFuZ2UnLCAnYnl0ZXM9JytyYW5nZVswXSsnLScrcmFuZ2VbMV0pO1xuXHR4aHIucmVzcG9uc2VUeXBlID0gJ2FycmF5YnVmZmVyJztcblx0eGhyLnNlbmQoKTtcblx0eGhyLm9ubG9hZCA9IGZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdGNiKDAsdGhhdC5yZXNwb25zZS5ieXRlTGVuZ3RoLHRoYXQucmVzcG9uc2UpO1xuXHRcdH0sMCk7XG5cdH07IFxufVxudmFyIGNsb3NlPWZ1bmN0aW9uKGhhbmRsZSkge31cbnZhciBmc3RhdFN5bmM9ZnVuY3Rpb24oaGFuZGxlKSB7XG5cdHRocm93IFwibm90IGltcGxlbWVudCB5ZXRcIjtcbn1cbnZhciBmc3RhdD1mdW5jdGlvbihoYW5kbGUsY2IpIHtcblx0dGhyb3cgXCJub3QgaW1wbGVtZW50IHlldFwiO1xufVxudmFyIF9vcGVuPWZ1bmN0aW9uKGZuX3VybCxjYikge1xuXHRcdHZhciBoYW5kbGU9e307XG5cdFx0aWYgKGZuX3VybC5pbmRleE9mKFwiZmlsZXN5c3RlbTpcIik9PTApe1xuXHRcdFx0aGFuZGxlLnVybD1mbl91cmw7XG5cdFx0XHRoYW5kbGUuZm49Zm5fdXJsLnN1YnN0ciggZm5fdXJsLmxhc3RJbmRleE9mKFwiL1wiKSsxKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aGFuZGxlLmZuPWZuX3VybDtcblx0XHRcdHZhciB1cmw9QVBJLmZpbGVzLmZpbHRlcihmdW5jdGlvbihmKXsgcmV0dXJuIChmWzBdPT1mbl91cmwpfSk7XG5cdFx0XHRpZiAodXJsLmxlbmd0aCkgaGFuZGxlLnVybD11cmxbMF1bMV07XG5cdFx0XHRlbHNlIGNiKG51bGwpO1xuXHRcdH1cblx0XHRjYihoYW5kbGUpO1xufVxudmFyIG9wZW49ZnVuY3Rpb24oZm5fdXJsLGNiKSB7XG5cdFx0aWYgKCFBUEkuaW5pdGlhbGl6ZWQpIHtpbml0KDEwMjQqMTAyNCxmdW5jdGlvbigpe1xuXHRcdFx0X29wZW4uYXBwbHkodGhpcyxbZm5fdXJsLGNiXSk7XG5cdFx0fSx0aGlzKX0gZWxzZSBfb3Blbi5hcHBseSh0aGlzLFtmbl91cmwsY2JdKTtcbn1cbnZhciBsb2FkPWZ1bmN0aW9uKGZpbGVuYW1lLG1vZGUsY2IpIHtcblx0b3BlbihmaWxlbmFtZSxtb2RlLGNiLHRydWUpO1xufVxuZnVuY3Rpb24gZXJyb3JIYW5kbGVyKGUpIHtcblx0Y29uc29sZS5lcnJvcignRXJyb3I6ICcgK2UubmFtZSsgXCIgXCIrZS5tZXNzYWdlKTtcbn1cbnZhciByZWFkZGlyPWZ1bmN0aW9uKGNiLGNvbnRleHQpIHtcblx0IHZhciBkaXJSZWFkZXIgPSBBUEkuZnMucm9vdC5jcmVhdGVSZWFkZXIoKTtcblx0IHZhciBvdXQ9W10sdGhhdD10aGlzO1xuXHRcdGRpclJlYWRlci5yZWFkRW50cmllcyhmdW5jdGlvbihlbnRyaWVzKSB7XG5cdFx0XHRpZiAoZW50cmllcy5sZW5ndGgpIHtcblx0XHRcdFx0Zm9yICh2YXIgaSA9IDAsIGVudHJ5OyBlbnRyeSA9IGVudHJpZXNbaV07ICsraSkge1xuXHRcdFx0XHRcdGlmIChlbnRyeS5pc0ZpbGUpIHtcblx0XHRcdFx0XHRcdG91dC5wdXNoKFtlbnRyeS5uYW1lLGVudHJ5LnRvVVJMID8gZW50cnkudG9VUkwoKSA6IGVudHJ5LnRvVVJJKCldKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHRcdEFQSS5maWxlcz1vdXQ7XG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW291dF0pO1xuXHRcdH0sIGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW251bGxdKTtcblx0XHR9KTtcbn1cbnZhciBpbml0ZnM9ZnVuY3Rpb24oZ3JhbnRlZEJ5dGVzLGNiLGNvbnRleHQpIHtcblx0d2Via2l0UmVxdWVzdEZpbGVTeXN0ZW0oUEVSU0lTVEVOVCwgZ3JhbnRlZEJ5dGVzLCAgZnVuY3Rpb24oZnMpIHtcblx0XHRBUEkuZnM9ZnM7XG5cdFx0QVBJLnF1b3RhPWdyYW50ZWRCeXRlcztcblx0XHRyZWFkZGlyKGZ1bmN0aW9uKCl7XG5cdFx0XHRBUEkuaW5pdGlhbGl6ZWQ9dHJ1ZTtcblx0XHRcdGNiLmFwcGx5KGNvbnRleHQsW2dyYW50ZWRCeXRlcyxmc10pO1xuXHRcdH0sY29udGV4dCk7XG5cdH0sIGVycm9ySGFuZGxlcik7XG59XG52YXIgaW5pdD1mdW5jdGlvbihxdW90YSxjYixjb250ZXh0KSB7XG5cdG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZS5yZXF1ZXN0UXVvdGEocXVvdGEsIFxuXHRcdFx0ZnVuY3Rpb24oZ3JhbnRlZEJ5dGVzKSB7XG5cdFx0XHRcdGluaXRmcyhncmFudGVkQnl0ZXMsY2IsY29udGV4dCk7XG5cdFx0fSwgZXJyb3JIYW5kbGVyIFxuXHQpO1xufVxudmFyIEFQST17XG5cdHJlYWQ6cmVhZFxuXHQscmVhZGRpcjpyZWFkZGlyXG5cdCxvcGVuOm9wZW5cblx0LGNsb3NlOmNsb3NlXG5cdCxmc3RhdFN5bmM6ZnN0YXRTeW5jXG5cdCxmc3RhdDpmc3RhdFxufVxubW9kdWxlLmV4cG9ydHM9QVBJOyIsIm1vZHVsZS5leHBvcnRzPXtcblx0b3BlbjpyZXF1aXJlKFwiLi9rZGJcIilcblx0LGNyZWF0ZTpyZXF1aXJlKFwiLi9rZGJ3XCIpXG59XG4iLCIvKlxuXHRLREIgdmVyc2lvbiAzLjAgR1BMXG5cdHlhcGNoZWFoc2hlbkBnbWFpbC5jb21cblx0MjAxMy8xMi8yOFxuXHRhc3luY3Jvbml6ZSB2ZXJzaW9uIG9mIHlhZGJcblxuICByZW1vdmUgZGVwZW5kZW5jeSBvZiBRLCB0aGFua3MgdG9cbiAgaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL3F1ZXN0aW9ucy80MjM0NjE5L2hvdy10by1hdm9pZC1sb25nLW5lc3Rpbmctb2YtYXN5bmNocm9ub3VzLWZ1bmN0aW9ucy1pbi1ub2RlLWpzXG5cbiAgMjAxNS8xLzJcbiAgbW92ZWQgdG8ga3NhbmFmb3JnZS9rc2FuYS1qc29ucm9tXG4gIGFkZCBlcnIgaW4gY2FsbGJhY2sgZm9yIG5vZGUuanMgY29tcGxpYW50XG4qL1xudmFyIEtmcz1udWxsO1xuXG5pZiAodHlwZW9mIGtzYW5hZ2FwPT1cInVuZGVmaW5lZFwiKSB7XG5cdEtmcz1yZXF1aXJlKCcuL2tkYmZzJyk7XHRcdFx0XG59IGVsc2Uge1xuXHRpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwiaW9zXCIpIHtcblx0XHRLZnM9cmVxdWlyZShcIi4va2RiZnNfaW9zXCIpO1xuXHR9IGVsc2UgaWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cIm5vZGUtd2Via2l0XCIpIHtcblx0XHRLZnM9cmVxdWlyZShcIi4va2RiZnNcIik7XG5cdH0gZWxzZSBpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwiY2hyb21lXCIpIHtcblx0XHRLZnM9cmVxdWlyZShcIi4va2RiZnNcIik7XG5cdH0gZWxzZSB7XG5cdFx0S2ZzPXJlcXVpcmUoXCIuL2tkYmZzX2FuZHJvaWRcIik7XG5cdH1cblx0XHRcbn1cblxuXG52YXIgRFQ9e1xuXHR1aW50ODonMScsIC8vdW5zaWduZWQgMSBieXRlIGludGVnZXJcblx0aW50MzI6JzQnLCAvLyBzaWduZWQgNCBieXRlcyBpbnRlZ2VyXG5cdHV0Zjg6JzgnLCAgXG5cdHVjczI6JzInLFxuXHRib29sOideJywgXG5cdGJsb2I6JyYnLFxuXHR1dGY4YXJyOicqJywgLy9zaGlmdCBvZiA4XG5cdHVjczJhcnI6J0AnLCAvL3NoaWZ0IG9mIDJcblx0dWludDhhcnI6JyEnLCAvL3NoaWZ0IG9mIDFcblx0aW50MzJhcnI6JyQnLCAvL3NoaWZ0IG9mIDRcblx0dmludDonYCcsXG5cdHBpbnQ6J34nLFx0XG5cblx0YXJyYXk6J1xcdTAwMWInLFxuXHRvYmplY3Q6J1xcdTAwMWEnIFxuXHQvL3lkYiBzdGFydCB3aXRoIG9iamVjdCBzaWduYXR1cmUsXG5cdC8vdHlwZSBhIHlkYiBpbiBjb21tYW5kIHByb21wdCBzaG93cyBub3RoaW5nXG59XG52YXIgdmVyYm9zZT0wLCByZWFkTG9nPWZ1bmN0aW9uKCl7fTtcbnZhciBfcmVhZExvZz1mdW5jdGlvbihyZWFkdHlwZSxieXRlcykge1xuXHRjb25zb2xlLmxvZyhyZWFkdHlwZSxieXRlcyxcImJ5dGVzXCIpO1xufVxuaWYgKHZlcmJvc2UpIHJlYWRMb2c9X3JlYWRMb2c7XG52YXIgc3Ryc2VwPVwiXFx1ZmZmZlwiO1xudmFyIENyZWF0ZT1mdW5jdGlvbihwYXRoLG9wdHMsY2IpIHtcblx0LyogbG9hZHh4eCBmdW5jdGlvbnMgbW92ZSBmaWxlIHBvaW50ZXIgKi9cblx0Ly8gbG9hZCB2YXJpYWJsZSBsZW5ndGggaW50XG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XG5cdFx0Y2I9b3B0cztcblx0XHRvcHRzPXt9O1xuXHR9XG5cblx0XG5cdHZhciBsb2FkVkludCA9ZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsY291bnQsY2IpIHtcblx0XHQvL2lmIChjb3VudD09MCkgcmV0dXJuIFtdO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cblx0XHR0aGlzLmZzLnJlYWRCdWZfcGFja2VkaW50KG9wdHMuY3VyLGJsb2Nrc2l6ZSxjb3VudCx0cnVlLGZ1bmN0aW9uKG8pe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInZpbnRcIik7XG5cdFx0XHRvcHRzLmN1cis9by5hZHY7XG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvLmRhdGFdKTtcblx0XHR9KTtcblx0fVxuXHR2YXIgbG9hZFZJbnQxPWZ1bmN0aW9uKG9wdHMsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGxvYWRWSW50LmFwcGx5KHRoaXMsW29wdHMsNiwxLGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInZpbnQxXCIpO1xuXHRcdFx0Y2IuYXBwbHkodGhhdCxbZGF0YVswXV0pO1xuXHRcdH1dKVxuXHR9XG5cdC8vZm9yIHBvc3RpbmdzXG5cdHZhciBsb2FkUEludCA9ZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsY291bnQsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHRoaXMuZnMucmVhZEJ1Zl9wYWNrZWRpbnQob3B0cy5jdXIsYmxvY2tzaXplLGNvdW50LGZhbHNlLGZ1bmN0aW9uKG8pe1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcInBpbnRcIik7XG5cdFx0XHRvcHRzLmN1cis9by5hZHY7XG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvLmRhdGFdKTtcblx0XHR9KTtcblx0fVxuXHQvLyBpdGVtIGNhbiBiZSBhbnkgdHlwZSAodmFyaWFibGUgbGVuZ3RoKVxuXHQvLyBtYXhpbXVtIHNpemUgb2YgYXJyYXkgaXMgMVRCIDJeNDBcblx0Ly8gc3RydWN0dXJlOlxuXHQvLyBzaWduYXR1cmUsNSBieXRlcyBvZmZzZXQsIHBheWxvYWQsIGl0ZW1sZW5ndGhzXG5cdHZhciBnZXRBcnJheUxlbmd0aD1mdW5jdGlvbihvcHRzLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR2YXIgZGF0YW9mZnNldD0wO1xuXG5cdFx0dGhpcy5mcy5yZWFkVUk4KG9wdHMuY3VyLGZ1bmN0aW9uKGxlbil7XG5cdFx0XHR2YXIgbGVuZ3Rob2Zmc2V0PWxlbio0Mjk0OTY3Mjk2O1xuXHRcdFx0b3B0cy5jdXIrKztcblx0XHRcdHRoYXQuZnMucmVhZFVJMzIob3B0cy5jdXIsZnVuY3Rpb24obGVuKXtcblx0XHRcdFx0b3B0cy5jdXIrPTQ7XG5cdFx0XHRcdGRhdGFvZmZzZXQ9b3B0cy5jdXI7IC8va2VlcCB0aGlzXG5cdFx0XHRcdGxlbmd0aG9mZnNldCs9bGVuO1xuXHRcdFx0XHRvcHRzLmN1cis9bGVuZ3Rob2Zmc2V0O1xuXG5cdFx0XHRcdGxvYWRWSW50MS5hcHBseSh0aGF0LFtvcHRzLGZ1bmN0aW9uKGNvdW50KXtcblx0XHRcdFx0XHRsb2FkVkludC5hcHBseSh0aGF0LFtvcHRzLGNvdW50KjYsY291bnQsZnVuY3Rpb24oc3ope1x0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0Y2Ioe2NvdW50OmNvdW50LHN6OnN6LG9mZnNldDpkYXRhb2Zmc2V0fSk7XG5cdFx0XHRcdFx0fV0pO1xuXHRcdFx0XHR9XSk7XG5cdFx0XHRcdFxuXHRcdFx0fSk7XG5cdFx0fSk7XG5cdH1cblxuXHR2YXIgbG9hZEFycmF5ID0gZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGdldEFycmF5TGVuZ3RoLmFwcGx5KHRoaXMsW29wdHMsZnVuY3Rpb24oTCl7XG5cdFx0XHRcdHZhciBvPVtdO1xuXHRcdFx0XHR2YXIgZW5kY3VyPW9wdHMuY3VyO1xuXHRcdFx0XHRvcHRzLmN1cj1MLm9mZnNldDtcblxuXHRcdFx0XHRpZiAob3B0cy5sYXp5KSB7IFxuXHRcdFx0XHRcdFx0dmFyIG9mZnNldD1MLm9mZnNldDtcblx0XHRcdFx0XHRcdEwuc3oubWFwKGZ1bmN0aW9uKHN6KXtcblx0XHRcdFx0XHRcdFx0b1tvLmxlbmd0aF09c3Ryc2VwK29mZnNldC50b1N0cmluZygxNilcblx0XHRcdFx0XHRcdFx0XHQgICArc3Ryc2VwK3N6LnRvU3RyaW5nKDE2KTtcblx0XHRcdFx0XHRcdFx0b2Zmc2V0Kz1zejtcblx0XHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHRhc2txdWV1ZT1bXTtcblx0XHRcdFx0XHRmb3IgKHZhciBpPTA7aTxMLmNvdW50O2krKykge1xuXHRcdFx0XHRcdFx0dGFza3F1ZXVlLnB1c2goXG5cdFx0XHRcdFx0XHRcdChmdW5jdGlvbihzeil7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGRhdGE9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdCAvL25vdCBwdXNoaW5nIHRoZSBmaXJzdCBjYWxsXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cdGVsc2Ugby5wdXNoKGRhdGEpO1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRvcHRzLmJsb2Nrc2l6ZT1zejtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9hZC5hcHBseSh0aGF0LFtvcHRzLCB0YXNrcXVldWUuc2hpZnQoKV0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH0pKEwuc3pbaV0pXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2xhc3QgY2FsbCB0byBjaGlsZCBsb2FkXG5cdFx0XHRcdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRvLnB1c2goZGF0YSk7XG5cdFx0XHRcdFx0XHRvcHRzLmN1cj1lbmRjdXI7XG5cdFx0XHRcdFx0XHRjYi5hcHBseSh0aGF0LFtvXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAob3B0cy5sYXp5KSBjYi5hcHBseSh0aGF0LFtvXSk7XG5cdFx0XHRcdGVsc2Uge1xuXHRcdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdF0pXG5cdH1cdFx0XG5cdC8vIGl0ZW0gY2FuIGJlIGFueSB0eXBlICh2YXJpYWJsZSBsZW5ndGgpXG5cdC8vIHN1cHBvcnQgbGF6eSBsb2FkXG5cdC8vIHN0cnVjdHVyZTpcblx0Ly8gc2lnbmF0dXJlLDUgYnl0ZXMgb2Zmc2V0LCBwYXlsb2FkLCBpdGVtbGVuZ3RocywgXG5cdC8vICAgICAgICAgICAgICAgICAgICBzdHJpbmdhcnJheV9zaWduYXR1cmUsIGtleXNcblx0dmFyIGxvYWRPYmplY3QgPSBmdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dmFyIHN0YXJ0PW9wdHMuY3VyO1xuXHRcdGdldEFycmF5TGVuZ3RoLmFwcGx5KHRoaXMsW29wdHMsZnVuY3Rpb24oTCkge1xuXHRcdFx0b3B0cy5ibG9ja3NpemU9YmxvY2tzaXplLW9wdHMuY3VyK3N0YXJ0O1xuXHRcdFx0bG9hZC5hcHBseSh0aGF0LFtvcHRzLGZ1bmN0aW9uKGtleXMpeyAvL2xvYWQgdGhlIGtleXNcblx0XHRcdFx0aWYgKG9wdHMua2V5cykgeyAvL2NhbGxlciBhc2sgZm9yIGtleXNcblx0XHRcdFx0XHRrZXlzLm1hcChmdW5jdGlvbihrKSB7IG9wdHMua2V5cy5wdXNoKGspfSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHR2YXIgbz17fTtcblx0XHRcdFx0dmFyIGVuZGN1cj1vcHRzLmN1cjtcblx0XHRcdFx0b3B0cy5jdXI9TC5vZmZzZXQ7XG5cdFx0XHRcdGlmIChvcHRzLmxhenkpIHsgXG5cdFx0XHRcdFx0dmFyIG9mZnNldD1MLm9mZnNldDtcblx0XHRcdFx0XHRmb3IgKHZhciBpPTA7aTxMLnN6Lmxlbmd0aDtpKyspIHtcblx0XHRcdFx0XHRcdC8vcHJlZml4IHdpdGggYSBcXDAsIGltcG9zc2libGUgZm9yIG5vcm1hbCBzdHJpbmdcblx0XHRcdFx0XHRcdG9ba2V5c1tpXV09c3Ryc2VwK29mZnNldC50b1N0cmluZygxNilcblx0XHRcdFx0XHRcdFx0ICAgK3N0cnNlcCtMLnN6W2ldLnRvU3RyaW5nKDE2KTtcblx0XHRcdFx0XHRcdG9mZnNldCs9TC5zeltpXTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dmFyIHRhc2txdWV1ZT1bXTtcblx0XHRcdFx0XHRmb3IgKHZhciBpPTA7aTxMLmNvdW50O2krKykge1xuXHRcdFx0XHRcdFx0dGFza3F1ZXVlLnB1c2goXG5cdFx0XHRcdFx0XHRcdChmdW5jdGlvbihzeixrZXkpe1xuXHRcdFx0XHRcdFx0XHRcdHJldHVybiAoXG5cdFx0XHRcdFx0XHRcdFx0XHRmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBkYXRhPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvL25vdCBzYXZpbmcgdGhlIGZpcnN0IGNhbGw7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0b1trZXldPWRhdGE7IFxuXHRcdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9wdHMuYmxvY2tzaXplPXN6O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodmVyYm9zZSkgcmVhZExvZyhcImtleVwiLGtleSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGxvYWQuYXBwbHkodGhhdCxbb3B0cywgdGFza3F1ZXVlLnNoaWZ0KCldKTtcblx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdFx0XHR9KShMLnN6W2ldLGtleXNbaS0xXSlcblxuXHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0Ly9sYXN0IGNhbGwgdG8gY2hpbGQgbG9hZFxuXHRcdFx0XHRcdHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0b1trZXlzW2tleXMubGVuZ3RoLTFdXT1kYXRhO1xuXHRcdFx0XHRcdFx0b3B0cy5jdXI9ZW5kY3VyO1xuXHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChvcHRzLmxhenkpIGNiLmFwcGx5KHRoYXQsW29dKTtcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XSk7XG5cdFx0fV0pO1xuXHR9XG5cblx0Ly9pdGVtIGlzIHNhbWUga25vd24gdHlwZVxuXHR2YXIgbG9hZFN0cmluZ0FycmF5PWZ1bmN0aW9uKG9wdHMsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR0aGlzLmZzLnJlYWRTdHJpbmdBcnJheShvcHRzLmN1cixibG9ja3NpemUsZW5jb2RpbmcsZnVuY3Rpb24obyl7XG5cdFx0XHRvcHRzLmN1cis9YmxvY2tzaXplO1xuXHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xuXHRcdH0pO1xuXHR9XG5cdHZhciBsb2FkSW50ZWdlckFycmF5PWZ1bmN0aW9uKG9wdHMsYmxvY2tzaXplLHVuaXRzaXplLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRsb2FkVkludDEuYXBwbHkodGhpcyxbb3B0cyxmdW5jdGlvbihjb3VudCl7XG5cdFx0XHR2YXIgbz10aGF0LmZzLnJlYWRGaXhlZEFycmF5KG9wdHMuY3VyLGNvdW50LHVuaXRzaXplLGZ1bmN0aW9uKG8pe1xuXHRcdFx0XHRvcHRzLmN1cis9Y291bnQqdW5pdHNpemU7XG5cdFx0XHRcdGNiLmFwcGx5KHRoYXQsW29dKTtcblx0XHRcdH0pO1xuXHRcdH1dKTtcblx0fVxuXHR2YXIgbG9hZEJsb2I9ZnVuY3Rpb24oYmxvY2tzaXplLGNiKSB7XG5cdFx0dmFyIG89dGhpcy5mcy5yZWFkQnVmKHRoaXMuY3VyLGJsb2Nrc2l6ZSk7XG5cdFx0dGhpcy5jdXIrPWJsb2Nrc2l6ZTtcblx0XHRyZXR1cm4gbztcblx0fVx0XG5cdHZhciBsb2FkYnlzaWduYXR1cmU9ZnVuY3Rpb24ob3B0cyxzaWduYXR1cmUsY2IpIHtcblx0XHQgIHZhciBibG9ja3NpemU9b3B0cy5ibG9ja3NpemV8fHRoaXMuZnMuc2l6ZTsgXG5cdFx0XHRvcHRzLmN1cis9dGhpcy5mcy5zaWduYXR1cmVfc2l6ZTtcblx0XHRcdHZhciBkYXRhc2l6ZT1ibG9ja3NpemUtdGhpcy5mcy5zaWduYXR1cmVfc2l6ZTtcblx0XHRcdC8vYmFzaWMgdHlwZXNcblx0XHRcdGlmIChzaWduYXR1cmU9PT1EVC5pbnQzMikge1xuXHRcdFx0XHRvcHRzLmN1cis9NDtcblx0XHRcdFx0dGhpcy5mcy5yZWFkSTMyKG9wdHMuY3VyLTQsY2IpO1xuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51aW50OCkge1xuXHRcdFx0XHRvcHRzLmN1cisrO1xuXHRcdFx0XHR0aGlzLmZzLnJlYWRVSTgob3B0cy5jdXItMSxjYik7XG5cdFx0XHR9IGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnV0ZjgpIHtcblx0XHRcdFx0dmFyIGM9b3B0cy5jdXI7b3B0cy5jdXIrPWRhdGFzaXplO1xuXHRcdFx0XHR0aGlzLmZzLnJlYWRTdHJpbmcoYyxkYXRhc2l6ZSwndXRmOCcsY2IpO1xuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51Y3MyKSB7XG5cdFx0XHRcdHZhciBjPW9wdHMuY3VyO29wdHMuY3VyKz1kYXRhc2l6ZTtcblx0XHRcdFx0dGhpcy5mcy5yZWFkU3RyaW5nKGMsZGF0YXNpemUsJ3VjczInLGNiKTtcdFxuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5ib29sKSB7XG5cdFx0XHRcdG9wdHMuY3VyKys7XG5cdFx0XHRcdHRoaXMuZnMucmVhZFVJOChvcHRzLmN1ci0xLGZ1bmN0aW9uKGRhdGEpe2NiKCEhZGF0YSl9KTtcblx0XHRcdH0gZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQuYmxvYikge1xuXHRcdFx0XHRsb2FkQmxvYihkYXRhc2l6ZSxjYik7XG5cdFx0XHR9XG5cdFx0XHQvL3ZhcmlhYmxlIGxlbmd0aCBpbnRlZ2Vyc1xuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudmludCkge1xuXHRcdFx0XHRsb2FkVkludC5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLGRhdGFzaXplLGNiXSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5waW50KSB7XG5cdFx0XHRcdGxvYWRQSW50LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsZGF0YXNpemUsY2JdKTtcblx0XHRcdH1cblx0XHRcdC8vc2ltcGxlIGFycmF5XG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51dGY4YXJyKSB7XG5cdFx0XHRcdGxvYWRTdHJpbmdBcnJheS5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLCd1dGY4JyxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudWNzMmFycikge1xuXHRcdFx0XHRsb2FkU3RyaW5nQXJyYXkuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSwndWNzMicsY2JdKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnVpbnQ4YXJyKSB7XG5cdFx0XHRcdGxvYWRJbnRlZ2VyQXJyYXkuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSwxLGNiXSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5pbnQzMmFycikge1xuXHRcdFx0XHRsb2FkSW50ZWdlckFycmF5LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsNCxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0Ly9uZXN0ZWQgc3RydWN0dXJlXG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5hcnJheSkge1xuXHRcdFx0XHRsb2FkQXJyYXkuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQub2JqZWN0KSB7XG5cdFx0XHRcdGxvYWRPYmplY3QuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoJ3Vuc3VwcG9ydGVkIHR5cGUnLHNpZ25hdHVyZSxvcHRzKVxuXHRcdFx0XHRjYi5hcHBseSh0aGlzLFtudWxsXSk7Ly9tYWtlIHN1cmUgaXQgcmV0dXJuXG5cdFx0XHRcdC8vdGhyb3cgJ3Vuc3VwcG9ydGVkIHR5cGUgJytzaWduYXR1cmU7XG5cdFx0XHR9XG5cdH1cblxuXHR2YXIgbG9hZD1mdW5jdGlvbihvcHRzLGNiKSB7XG5cdFx0b3B0cz1vcHRzfHx7fTsgLy8gdGhpcyB3aWxsIHNlcnZlZCBhcyBjb250ZXh0IGZvciBlbnRpcmUgbG9hZCBwcm9jZWR1cmVcblx0XHRvcHRzLmN1cj1vcHRzLmN1cnx8MDtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHRoaXMuZnMucmVhZFNpZ25hdHVyZShvcHRzLmN1ciwgZnVuY3Rpb24oc2lnbmF0dXJlKXtcblx0XHRcdGxvYWRieXNpZ25hdHVyZS5hcHBseSh0aGF0LFtvcHRzLHNpZ25hdHVyZSxjYl0pXG5cdFx0fSk7XG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblx0dmFyIENBQ0hFPW51bGw7XG5cdHZhciBLRVk9e307XG5cdHZhciBBRERSRVNTPXt9O1xuXHR2YXIgcmVzZXQ9ZnVuY3Rpb24oY2IpIHtcblx0XHRpZiAoIUNBQ0hFKSB7XG5cdFx0XHRsb2FkLmFwcGx5KHRoaXMsW3tjdXI6MCxsYXp5OnRydWV9LGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRDQUNIRT1kYXRhO1xuXHRcdFx0XHRjYi5jYWxsKHRoaXMpO1xuXHRcdFx0fV0pO1x0XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNiLmNhbGwodGhpcyk7XG5cdFx0fVxuXHR9XG5cblx0dmFyIGV4aXN0cz1mdW5jdGlvbihwYXRoLGNiKSB7XG5cdFx0aWYgKHBhdGgubGVuZ3RoPT0wKSByZXR1cm4gdHJ1ZTtcblx0XHR2YXIga2V5PXBhdGgucG9wKCk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRnZXQuYXBwbHkodGhpcyxbcGF0aCxmYWxzZSxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGlmICghcGF0aC5qb2luKHN0cnNlcCkpIHJldHVybiAoISFLRVlba2V5XSk7XG5cdFx0XHR2YXIga2V5cz1LRVlbcGF0aC5qb2luKHN0cnNlcCldO1xuXHRcdFx0cGF0aC5wdXNoKGtleSk7Ly9wdXQgaXQgYmFja1xuXHRcdFx0aWYgKGtleXMpIGNiLmFwcGx5KHRoYXQsW2tleXMuaW5kZXhPZihrZXkpPi0xXSk7XG5cdFx0XHRlbHNlIGNiLmFwcGx5KHRoYXQsW2ZhbHNlXSk7XG5cdFx0fV0pO1xuXHR9XG5cblx0dmFyIGdldFN5bmM9ZnVuY3Rpb24ocGF0aCkge1xuXHRcdGlmICghQ0FDSEUpIHJldHVybiB1bmRlZmluZWQ7XHRcblx0XHR2YXIgbz1DQUNIRTtcblx0XHRmb3IgKHZhciBpPTA7aTxwYXRoLmxlbmd0aDtpKyspIHtcblx0XHRcdHZhciByPW9bcGF0aFtpXV07XG5cdFx0XHRpZiAodHlwZW9mIHI9PVwidW5kZWZpbmVkXCIpIHJldHVybiBudWxsO1xuXHRcdFx0bz1yO1xuXHRcdH1cblx0XHRyZXR1cm4gbztcblx0fVxuXHR2YXIgZ2V0PWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xuXHRcdGlmICh0eXBlb2YgcGF0aD09J3VuZGVmaW5lZCcpIHBhdGg9W107XG5cdFx0aWYgKHR5cGVvZiBwYXRoPT1cInN0cmluZ1wiKSBwYXRoPVtwYXRoXTtcblx0XHQvL29wdHMucmVjdXJzaXZlPSEhb3B0cy5yZWN1cnNpdmU7XG5cdFx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcblx0XHRcdGNiPW9wdHM7bm9kZVxuXHRcdFx0b3B0cz17fTtcblx0XHR9XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRpZiAodHlwZW9mIGNiIT0nZnVuY3Rpb24nKSByZXR1cm4gZ2V0U3luYyhwYXRoKTtcblxuXHRcdHJlc2V0LmFwcGx5KHRoaXMsW2Z1bmN0aW9uKCl7XG5cdFx0XHR2YXIgbz1DQUNIRTtcblx0XHRcdGlmIChwYXRoLmxlbmd0aD09MCkge1xuXHRcdFx0XHRpZiAob3B0cy5hZGRyZXNzKSB7XG5cdFx0XHRcdFx0Y2IoWzAsdGhhdC5mcy5zaXplXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2IoT2JqZWN0LmtleXMoQ0FDSEUpKTtcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH0gXG5cdFx0XHRcblx0XHRcdHZhciBwYXRobm93PVwiXCIsdGFza3F1ZXVlPVtdLG5ld29wdHM9e30scj1udWxsO1xuXHRcdFx0dmFyIGxhc3RrZXk9XCJcIjtcblxuXHRcdFx0Zm9yICh2YXIgaT0wO2k8cGF0aC5sZW5ndGg7aSsrKSB7XG5cdFx0XHRcdHZhciB0YXNrPShmdW5jdGlvbihrZXksayl7XG5cblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKCEodHlwZW9mIGRhdGE9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkpIHtcblx0XHRcdFx0XHRcdFx0aWYgKHR5cGVvZiBvW2xhc3RrZXldPT0nc3RyaW5nJyAmJiBvW2xhc3RrZXldWzBdPT1zdHJzZXApIG9bbGFzdGtleV09e307XG5cdFx0XHRcdFx0XHRcdG9bbGFzdGtleV09ZGF0YTsgXG5cdFx0XHRcdFx0XHRcdG89b1tsYXN0a2V5XTtcblx0XHRcdFx0XHRcdFx0cj1kYXRhW2tleV07XG5cdFx0XHRcdFx0XHRcdEtFWVtwYXRobm93XT1vcHRzLmtleXM7XHRcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0ZGF0YT1vW2tleV07XG5cdFx0XHRcdFx0XHRcdHI9ZGF0YTtcblx0XHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdFx0aWYgKHR5cGVvZiByPT09XCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0XHR0YXNrcXVldWU9bnVsbDtcblx0XHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbcl0pOyAvL3JldHVybiBlbXB0eSB2YWx1ZVxuXHRcdFx0XHRcdFx0fSBlbHNlIHtcdFx0XHRcdFx0XHRcdFxuXHRcdFx0XHRcdFx0XHRpZiAocGFyc2VJbnQoaykpIHBhdGhub3crPXN0cnNlcDtcblx0XHRcdFx0XHRcdFx0cGF0aG5vdys9a2V5O1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIHI9PSdzdHJpbmcnICYmIHJbMF09PXN0cnNlcCkgeyAvL29mZnNldCBvZiBkYXRhIHRvIGJlIGxvYWRlZFxuXHRcdFx0XHRcdFx0XHRcdHZhciBwPXIuc3Vic3RyaW5nKDEpLnNwbGl0KHN0cnNlcCkubWFwKGZ1bmN0aW9uKGl0ZW0pe3JldHVybiBwYXJzZUludChpdGVtLDE2KX0pO1xuXHRcdFx0XHRcdFx0XHRcdHZhciBjdXI9cFswXSxzej1wWzFdO1xuXHRcdFx0XHRcdFx0XHRcdG5ld29wdHMubGF6eT0hb3B0cy5yZWN1cnNpdmUgfHwgKGs8cGF0aC5sZW5ndGgtMSkgO1xuXHRcdFx0XHRcdFx0XHRcdG5ld29wdHMuYmxvY2tzaXplPXN6O25ld29wdHMuY3VyPWN1cixuZXdvcHRzLmtleXM9W107XG5cdFx0XHRcdFx0XHRcdFx0bGFzdGtleT1rZXk7IC8vbG9hZCBpcyBzeW5jIGluIGFuZHJvaWRcblx0XHRcdFx0XHRcdFx0XHRpZiAob3B0cy5hZGRyZXNzICYmIHRhc2txdWV1ZS5sZW5ndGg9PTEpIHtcblx0XHRcdFx0XHRcdFx0XHRcdEFERFJFU1NbcGF0aG5vd109W2N1cixzel07XG5cdFx0XHRcdFx0XHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKShudWxsLEFERFJFU1NbcGF0aG5vd10pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRsb2FkLmFwcGx5KHRoYXQsW25ld29wdHMsIHRhc2txdWV1ZS5zaGlmdCgpXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdGlmIChvcHRzLmFkZHJlc3MgJiYgdGFza3F1ZXVlLmxlbmd0aD09MSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkobnVsbCxBRERSRVNTW3BhdGhub3ddKTtcblx0XHRcdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkuYXBwbHkodGhhdCxbcl0pO1xuXHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH0pXG5cdFx0XHRcdH0pXG5cdFx0XHRcdChwYXRoW2ldLGkpO1xuXHRcdFx0XHRcblx0XHRcdFx0dGFza3F1ZXVlLnB1c2godGFzayk7XG5cdFx0XHR9XG5cblx0XHRcdGlmICh0YXNrcXVldWUubGVuZ3RoPT0wKSB7XG5cdFx0XHRcdGNiLmFwcGx5KHRoYXQsW29dKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdC8vbGFzdCBjYWxsIHRvIGNoaWxkIGxvYWRcblx0XHRcdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSxjdXJzeil7XG5cdFx0XHRcdFx0aWYgKG9wdHMuYWRkcmVzcykge1xuXHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbY3Vyc3pdKTtcblx0XHRcdFx0XHR9IGVsc2V7XG5cdFx0XHRcdFx0XHR2YXIga2V5PXBhdGhbcGF0aC5sZW5ndGgtMV07XG5cdFx0XHRcdFx0XHRvW2tleV09ZGF0YTsgS0VZW3BhdGhub3ddPW9wdHMua2V5cztcblx0XHRcdFx0XHRcdGNiLmFwcGx5KHRoYXQsW2RhdGFdKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0pO1xuXHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7XHRcdFx0XG5cdFx0XHR9XG5cblx0XHR9XSk7IC8vcmVzZXRcblx0fVxuXHQvLyBnZXQgYWxsIGtleXMgaW4gZ2l2ZW4gcGF0aFxuXHR2YXIgZ2V0a2V5cz1mdW5jdGlvbihwYXRoLGNiKSB7XG5cdFx0aWYgKCFwYXRoKSBwYXRoPVtdXG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRnZXQuYXBwbHkodGhpcyxbcGF0aCxmYWxzZSxmdW5jdGlvbigpe1xuXHRcdFx0aWYgKHBhdGggJiYgcGF0aC5sZW5ndGgpIHtcblx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbS0VZW3BhdGguam9pbihzdHJzZXApXV0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbT2JqZWN0LmtleXMoQ0FDSEUpXSk7IFxuXHRcdFx0XHQvL3RvcCBsZXZlbCwgbm9ybWFsbHkgaXQgaXMgdmVyeSBzbWFsbFxuXHRcdFx0fVxuXHRcdH1dKTtcblx0fVxuXG5cdHZhciBzZXR1cGFwaT1mdW5jdGlvbigpIHtcblx0XHR0aGlzLmxvYWQ9bG9hZDtcbi8vXHRcdHRoaXMuY3VyPTA7XG5cdFx0dGhpcy5jYWNoZT1mdW5jdGlvbigpIHtyZXR1cm4gQ0FDSEV9O1xuXHRcdHRoaXMua2V5PWZ1bmN0aW9uKCkge3JldHVybiBLRVl9O1xuXHRcdHRoaXMuZnJlZT1mdW5jdGlvbigpIHtcblx0XHRcdENBQ0hFPW51bGw7XG5cdFx0XHRLRVk9bnVsbDtcblx0XHRcdHRoaXMuZnMuZnJlZSgpO1xuXHRcdH1cblx0XHR0aGlzLnNldENhY2hlPWZ1bmN0aW9uKGMpIHtDQUNIRT1jfTtcblx0XHR0aGlzLmtleXM9Z2V0a2V5cztcblx0XHR0aGlzLmdldD1nZXQ7ICAgLy8gZ2V0IGEgZmllbGQsIGxvYWQgaWYgbmVlZGVkXG5cdFx0dGhpcy5leGlzdHM9ZXhpc3RzO1xuXHRcdHRoaXMuRFQ9RFQ7XG5cdFx0XG5cdFx0Ly9pbnN0YWxsIHRoZSBzeW5jIHZlcnNpb24gZm9yIG5vZGVcblx0XHQvL2lmICh0eXBlb2YgcHJvY2VzcyE9XCJ1bmRlZmluZWRcIikgcmVxdWlyZShcIi4va2RiX3N5bmNcIikodGhpcyk7XG5cdFx0Ly9pZiAoY2IpIHNldFRpbWVvdXQoY2IuYmluZCh0aGlzKSwwKTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHZhciBlcnI9MDtcblx0XHRpZiAoY2IpIHtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdFx0Y2IoZXJyLHRoYXQpO1x0XG5cdFx0XHR9LDApO1xuXHRcdH1cblx0fVxuXHR2YXIgdGhhdD10aGlzO1xuXHR2YXIga2ZzPW5ldyBLZnMocGF0aCxvcHRzLGZ1bmN0aW9uKGVycil7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRjYihlcnIsMCk7XG5cdFx0XHR9LDApO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRoYXQuc2l6ZT10aGlzLnNpemU7XG5cdFx0XHRzZXR1cGFwaS5jYWxsKHRoYXQpO1x0XHRcdFxuXHRcdH1cblx0fSk7XG5cdHRoaXMuZnM9a2ZzO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuQ3JlYXRlLmRhdGF0eXBlcz1EVDtcblxuaWYgKG1vZHVsZSkgbW9kdWxlLmV4cG9ydHM9Q3JlYXRlO1xuLy9yZXR1cm4gQ3JlYXRlO1xuIiwiLyogbm9kZS5qcyBhbmQgaHRtbDUgZmlsZSBzeXN0ZW0gYWJzdHJhY3Rpb24gbGF5ZXIqL1xudHJ5IHtcblx0dmFyIGZzPXJlcXVpcmUoXCJmc1wiKTtcblx0dmFyIEJ1ZmZlcj1yZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcjtcbn0gY2F0Y2ggKGUpIHtcblx0dmFyIGZzPXJlcXVpcmUoJy4vaHRtbDVyZWFkJyk7XG5cdHZhciBCdWZmZXI9ZnVuY3Rpb24oKXsgcmV0dXJuIFwiXCJ9O1xuXHR2YXIgaHRtbDVmcz10cnVlOyBcdFxufVxudmFyIHNpZ25hdHVyZV9zaXplPTE7XG52YXIgdmVyYm9zZT0wLCByZWFkTG9nPWZ1bmN0aW9uKCl7fTtcbnZhciBfcmVhZExvZz1mdW5jdGlvbihyZWFkdHlwZSxieXRlcykge1xuXHRjb25zb2xlLmxvZyhyZWFkdHlwZSxieXRlcyxcImJ5dGVzXCIpO1xufVxuaWYgKHZlcmJvc2UpIHJlYWRMb2c9X3JlYWRMb2c7XG5cbnZhciB1bnBhY2tfaW50ID0gZnVuY3Rpb24gKGFyLCBjb3VudCAsIHJlc2V0KSB7XG4gICBjb3VudD1jb3VudHx8YXIubGVuZ3RoO1xuICB2YXIgciA9IFtdLCBpID0gMCwgdiA9IDA7XG4gIGRvIHtcblx0dmFyIHNoaWZ0ID0gMDtcblx0ZG8ge1xuXHQgIHYgKz0gKChhcltpXSAmIDB4N0YpIDw8IHNoaWZ0KTtcblx0ICBzaGlmdCArPSA3O1x0ICBcblx0fSB3aGlsZSAoYXJbKytpXSAmIDB4ODApO1xuXHRyLnB1c2godik7IGlmIChyZXNldCkgdj0wO1xuXHRjb3VudC0tO1xuICB9IHdoaWxlIChpPGFyLmxlbmd0aCAmJiBjb3VudCk7XG4gIHJldHVybiB7ZGF0YTpyLCBhZHY6aSB9O1xufVxudmFyIE9wZW49ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XG5cdG9wdHM9b3B0c3x8e307XG5cblx0dmFyIHJlYWRTaWduYXR1cmU9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdFx0dmFyIGJ1Zj1uZXcgQnVmZmVyKHNpZ25hdHVyZV9zaXplKTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmLDAsc2lnbmF0dXJlX3NpemUscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdGlmIChodG1sNWZzKSB2YXIgc2lnbmF0dXJlPVN0cmluZy5mcm9tQ2hhckNvZGUoKG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpWzBdKVxuXHRcdFx0ZWxzZSB2YXIgc2lnbmF0dXJlPWJ1ZmZlci50b1N0cmluZygndXRmOCcsMCxzaWduYXR1cmVfc2l6ZSk7XG5cdFx0XHRjYi5hcHBseSh0aGF0LFtzaWduYXR1cmVdKTtcblx0XHR9KTtcblx0fVxuXG5cdC8vdGhpcyBpcyBxdWl0ZSBzbG93XG5cdC8vd2FpdCBmb3IgU3RyaW5nVmlldyArQXJyYXlCdWZmZXIgdG8gc29sdmUgdGhlIHByb2JsZW1cblx0Ly9odHRwczovL2dyb3Vwcy5nb29nbGUuY29tL2EvY2hyb21pdW0ub3JnL2ZvcnVtLyMhdG9waWMvYmxpbmstZGV2L3lsZ2lOWV9aU1YwXG5cdC8vaWYgdGhlIHN0cmluZyBpcyBhbHdheXMgdWNzMlxuXHQvL2NhbiB1c2UgVWludDE2IHRvIHJlYWQgaXQuXG5cdC8vaHR0cDovL3VwZGF0ZXMuaHRtbDVyb2Nrcy5jb20vMjAxMi8wNi9Ib3ctdG8tY29udmVydC1BcnJheUJ1ZmZlci10by1hbmQtZnJvbS1TdHJpbmdcblx0dmFyIGRlY29kZXV0ZjggPSBmdW5jdGlvbiAodXRmdGV4dCkge1xuXHRcdHZhciBzdHJpbmcgPSBcIlwiO1xuXHRcdHZhciBpID0gMDtcblx0XHR2YXIgYz0wLGMxID0gMCwgYzIgPSAwICwgYzM9MDtcblx0XHRmb3IgKHZhciBpPTA7aTx1dGZ0ZXh0Lmxlbmd0aDtpKyspIHtcblx0XHRcdGlmICh1dGZ0ZXh0LmNoYXJDb2RlQXQoaSk+MTI3KSBicmVhaztcblx0XHR9XG5cdFx0aWYgKGk+PXV0ZnRleHQubGVuZ3RoKSByZXR1cm4gdXRmdGV4dDtcblxuXHRcdHdoaWxlICggaSA8IHV0ZnRleHQubGVuZ3RoICkge1xuXHRcdFx0YyA9IHV0ZnRleHQuY2hhckNvZGVBdChpKTtcblx0XHRcdGlmIChjIDwgMTI4KSB7XG5cdFx0XHRcdHN0cmluZyArPSB1dGZ0ZXh0W2ldO1xuXHRcdFx0XHRpKys7XG5cdFx0XHR9IGVsc2UgaWYoKGMgPiAxOTEpICYmIChjIDwgMjI0KSkge1xuXHRcdFx0XHRjMiA9IHV0ZnRleHQuY2hhckNvZGVBdChpKzEpO1xuXHRcdFx0XHRzdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAzMSkgPDwgNikgfCAoYzIgJiA2MykpO1xuXHRcdFx0XHRpICs9IDI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjMiA9IHV0ZnRleHQuY2hhckNvZGVBdChpKzEpO1xuXHRcdFx0XHRjMyA9IHV0ZnRleHQuY2hhckNvZGVBdChpKzIpO1xuXHRcdFx0XHRzdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAxNSkgPDwgMTIpIHwgKChjMiAmIDYzKSA8PCA2KSB8IChjMyAmIDYzKSk7XG5cdFx0XHRcdGkgKz0gMztcblx0XHRcdH1cblx0XHR9XG5cdFx0cmV0dXJuIHN0cmluZztcblx0fVxuXG5cdHZhciByZWFkU3RyaW5nPSBmdW5jdGlvbihwb3MsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XG5cdFx0ZW5jb2Rpbmc9ZW5jb2Rpbmd8fCd1dGY4Jztcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoYmxvY2tzaXplKTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsYmxvY2tzaXplLHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRyZWFkTG9nKFwic3RyaW5nXCIsbGVuKTtcblx0XHRcdGlmIChodG1sNWZzKSB7XG5cdFx0XHRcdGlmIChlbmNvZGluZz09J3V0ZjgnKSB7XG5cdFx0XHRcdFx0dmFyIHN0cj1kZWNvZGV1dGY4KFN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCwgbmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSkpXG5cdFx0XHRcdH0gZWxzZSB7IC8vdWNzMiBpcyAzIHRpbWVzIGZhc3RlclxuXHRcdFx0XHRcdHZhciBzdHI9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDE2QXJyYXkoYnVmZmVyKSlcdFxuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRjYi5hcHBseSh0aGF0LFtzdHJdKTtcblx0XHRcdH0gXG5cdFx0XHRlbHNlIGNiLmFwcGx5KHRoYXQsW2J1ZmZlci50b1N0cmluZyhlbmNvZGluZyldKTtcdFxuXHRcdH0pO1xuXHR9XG5cblx0Ly93b3JrIGFyb3VuZCBmb3IgY2hyb21lIGZyb21DaGFyQ29kZSBjYW5ub3QgYWNjZXB0IGh1Z2UgYXJyYXlcblx0Ly9odHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL2Nocm9taXVtL2lzc3Vlcy9kZXRhaWw/aWQ9NTY1ODhcblx0dmFyIGJ1ZjJzdHJpbmdhcnI9ZnVuY3Rpb24oYnVmLGVuYykge1xuXHRcdGlmIChlbmM9PVwidXRmOFwiKSBcdHZhciBhcnI9bmV3IFVpbnQ4QXJyYXkoYnVmKTtcblx0XHRlbHNlIHZhciBhcnI9bmV3IFVpbnQxNkFycmF5KGJ1Zik7XG5cdFx0dmFyIGk9MCxjb2Rlcz1bXSxvdXQ9W10scz1cIlwiO1xuXHRcdHdoaWxlIChpPGFyci5sZW5ndGgpIHtcblx0XHRcdGlmIChhcnJbaV0pIHtcblx0XHRcdFx0Y29kZXNbY29kZXMubGVuZ3RoXT1hcnJbaV07XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRzPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxjb2Rlcyk7XG5cdFx0XHRcdGlmIChlbmM9PVwidXRmOFwiKSBvdXRbb3V0Lmxlbmd0aF09ZGVjb2RldXRmOChzKTtcblx0XHRcdFx0ZWxzZSBvdXRbb3V0Lmxlbmd0aF09cztcblx0XHRcdFx0Y29kZXM9W107XHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdGkrKztcblx0XHR9XG5cdFx0XG5cdFx0cz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsY29kZXMpO1xuXHRcdGlmIChlbmM9PVwidXRmOFwiKSBvdXRbb3V0Lmxlbmd0aF09ZGVjb2RldXRmOChzKTtcblx0XHRlbHNlIG91dFtvdXQubGVuZ3RoXT1zO1xuXG5cdFx0cmV0dXJuIG91dDtcblx0fVxuXHR2YXIgcmVhZFN0cmluZ0FycmF5ID0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xuXHRcdHZhciB0aGF0PXRoaXMsb3V0PW51bGw7XG5cdFx0aWYgKGJsb2Nrc2l6ZT09MCkgcmV0dXJuIFtdO1xuXHRcdGVuY29kaW5nPWVuY29kaW5nfHwndXRmOCc7XG5cdFx0dmFyIGJ1ZmZlcj1uZXcgQnVmZmVyKGJsb2Nrc2l6ZSk7XG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWZmZXIsMCxibG9ja3NpemUscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdGlmIChodG1sNWZzKSB7XG5cdFx0XHRcdHJlYWRMb2coXCJzdHJpbmdBcnJheVwiLGJ1ZmZlci5ieXRlTGVuZ3RoKTtcblxuXHRcdFx0XHRpZiAoZW5jb2Rpbmc9PSd1dGY4Jykge1xuXHRcdFx0XHRcdG91dD1idWYyc3RyaW5nYXJyKGJ1ZmZlcixcInV0ZjhcIik7XG5cdFx0XHRcdH0gZWxzZSB7IC8vdWNzMiBpcyAzIHRpbWVzIGZhc3RlclxuXHRcdFx0XHRcdG91dD1idWYyc3RyaW5nYXJyKGJ1ZmZlcixcInVjczJcIik7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlYWRMb2coXCJzdHJpbmdBcnJheVwiLGJ1ZmZlci5sZW5ndGgpO1xuXHRcdFx0XHRvdXQ9YnVmZmVyLnRvU3RyaW5nKGVuY29kaW5nKS5zcGxpdCgnXFwwJyk7XG5cdFx0XHR9IFx0XG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvdXRdKTtcblx0XHR9KTtcblx0fVxuXHR2YXIgcmVhZFVJMzI9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdFx0dmFyIGJ1ZmZlcj1uZXcgQnVmZmVyKDQpO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWZmZXIsMCw0LHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRyZWFkTG9nKFwidWkzMlwiLGxlbik7XG5cdFx0XHRpZiAoaHRtbDVmcyl7XG5cdFx0XHRcdC8vdj0obmV3IFVpbnQzMkFycmF5KGJ1ZmZlcikpWzBdO1xuXHRcdFx0XHR2YXIgdj1uZXcgRGF0YVZpZXcoYnVmZmVyKS5nZXRVaW50MzIoMCwgZmFsc2UpXG5cdFx0XHRcdGNiKHYpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBjYi5hcHBseSh0aGF0LFtidWZmZXIucmVhZEludDMyQkUoMCldKTtcdFxuXHRcdH0pO1x0XHRcblx0fVxuXG5cdHZhciByZWFkSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRcdHZhciBidWZmZXI9bmV3IEJ1ZmZlcig0KTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsNCxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0cmVhZExvZyhcImkzMlwiLGxlbik7XG5cdFx0XHRpZiAoaHRtbDVmcyl7XG5cdFx0XHRcdHZhciB2PW5ldyBEYXRhVmlldyhidWZmZXIpLmdldEludDMyKDAsIGZhbHNlKVxuXHRcdFx0XHRjYih2KTtcblx0XHRcdH1cblx0XHRcdGVsc2UgIFx0Y2IuYXBwbHkodGhhdCxbYnVmZmVyLnJlYWRJbnQzMkJFKDApXSk7XHRcblx0XHR9KTtcblx0fVxuXHR2YXIgcmVhZFVJOD1mdW5jdGlvbihwb3MsY2IpIHtcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoMSk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmZmVyLDAsMSxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0cmVhZExvZyhcInVpOFwiLGxlbik7XG5cdFx0XHRpZiAoaHRtbDVmcyljYiggKG5ldyBVaW50OEFycmF5KGJ1ZmZlcikpWzBdKSA7XG5cdFx0XHRlbHNlICBcdFx0XHRjYi5hcHBseSh0aGF0LFtidWZmZXIucmVhZFVJbnQ4KDApXSk7XHRcblx0XHRcdFxuXHRcdH0pO1xuXHR9XG5cdHZhciByZWFkQnVmPWZ1bmN0aW9uKHBvcyxibG9ja3NpemUsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHZhciBidWY9bmV3IEJ1ZmZlcihibG9ja3NpemUpO1xuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsYnVmLDAsYmxvY2tzaXplLHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRyZWFkTG9nKFwiYnVmXCIsbGVuKTtcblx0XHRcdHZhciBidWZmPW5ldyBVaW50OEFycmF5KGJ1ZmZlcilcblx0XHRcdGNiLmFwcGx5KHRoYXQsW2J1ZmZdKTtcblx0XHR9KTtcblx0fVxuXHR2YXIgcmVhZEJ1Zl9wYWNrZWRpbnQ9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjb3VudCxyZXNldCxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0cmVhZEJ1Zi5hcHBseSh0aGlzLFtwb3MsYmxvY2tzaXplLGZ1bmN0aW9uKGJ1ZmZlcil7XG5cdFx0XHRjYi5hcHBseSh0aGF0LFt1bnBhY2tfaW50KGJ1ZmZlcixjb3VudCxyZXNldCldKTtcdFxuXHRcdH1dKTtcblx0XHRcblx0fVxuXHR2YXIgcmVhZEZpeGVkQXJyYXlfaHRtbDVmcz1mdW5jdGlvbihwb3MsY291bnQsdW5pdHNpemUsY2IpIHtcblx0XHR2YXIgZnVuYz1udWxsO1xuXHRcdGlmICh1bml0c2l6ZT09PTEpIHtcblx0XHRcdGZ1bmM9J2dldFVpbnQ4JzsvL1VpbnQ4QXJyYXk7XG5cdFx0fSBlbHNlIGlmICh1bml0c2l6ZT09PTIpIHtcblx0XHRcdGZ1bmM9J2dldFVpbnQxNic7Ly9VaW50MTZBcnJheTtcblx0XHR9IGVsc2UgaWYgKHVuaXRzaXplPT09NCkge1xuXHRcdFx0ZnVuYz0nZ2V0VWludDMyJzsvL1VpbnQzMkFycmF5O1xuXHRcdH0gZWxzZSB0aHJvdyAndW5zdXBwb3J0ZWQgaW50ZWdlciBzaXplJztcblxuXHRcdGZzLnJlYWQodGhpcy5oYW5kbGUsbnVsbCwwLHVuaXRzaXplKmNvdW50LHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRyZWFkTG9nKFwiZml4IGFycmF5XCIsbGVuKTtcblx0XHRcdHZhciBvdXQ9W107XG5cdFx0XHRpZiAodW5pdHNpemU9PTEpIHtcblx0XHRcdFx0b3V0PW5ldyBVaW50OEFycmF5KGJ1ZmZlcik7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGxlbiAvIHVuaXRzaXplOyBpKyspIHsgLy9lbmRpYW4gcHJvYmxlbVxuXHRcdFx0XHQvL1x0b3V0LnB1c2goIGZ1bmMoYnVmZmVyLGkqdW5pdHNpemUpKTtcblx0XHRcdFx0XHRvdXQucHVzaCggdj1uZXcgRGF0YVZpZXcoYnVmZmVyKVtmdW5jXShpLGZhbHNlKSApO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdGNiLmFwcGx5KHRoYXQsW291dF0pO1xuXHRcdH0pO1xuXHR9XG5cdC8vIHNpZ25hdHVyZSwgaXRlbWNvdW50LCBwYXlsb2FkXG5cdHZhciByZWFkRml4ZWRBcnJheSA9IGZ1bmN0aW9uKHBvcyAsY291bnQsIHVuaXRzaXplLGNiKSB7XG5cdFx0dmFyIGZ1bmM9bnVsbDtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdFxuXHRcdGlmICh1bml0c2l6ZSogY291bnQ+dGhpcy5zaXplICYmIHRoaXMuc2l6ZSkgIHtcblx0XHRcdGNvbnNvbGUubG9nKFwiYXJyYXkgc2l6ZSBleGNlZWQgZmlsZSBzaXplXCIsdGhpcy5zaXplKVxuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRcblx0XHRpZiAoaHRtbDVmcykgcmV0dXJuIHJlYWRGaXhlZEFycmF5X2h0bWw1ZnMuYXBwbHkodGhpcyxbcG9zLGNvdW50LHVuaXRzaXplLGNiXSk7XG5cblx0XHR2YXIgaXRlbXM9bmV3IEJ1ZmZlciggdW5pdHNpemUqIGNvdW50KTtcblx0XHRpZiAodW5pdHNpemU9PT0xKSB7XG5cdFx0XHRmdW5jPWl0ZW1zLnJlYWRVSW50ODtcblx0XHR9IGVsc2UgaWYgKHVuaXRzaXplPT09Mikge1xuXHRcdFx0ZnVuYz1pdGVtcy5yZWFkVUludDE2QkU7XG5cdFx0fSBlbHNlIGlmICh1bml0c2l6ZT09PTQpIHtcblx0XHRcdGZ1bmM9aXRlbXMucmVhZFVJbnQzMkJFO1xuXHRcdH0gZWxzZSB0aHJvdyAndW5zdXBwb3J0ZWQgaW50ZWdlciBzaXplJztcblx0XHQvL2NvbnNvbGUubG9nKCdpdGVtY291bnQnLGl0ZW1jb3VudCwnYnVmZmVyJyxidWZmZXIpO1xuXG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxpdGVtcywwLHVuaXRzaXplKmNvdW50LHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRyZWFkTG9nKFwiZml4IGFycmF5XCIsbGVuKTtcblx0XHRcdHZhciBvdXQ9W107XG5cdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aCAvIHVuaXRzaXplOyBpKyspIHtcblx0XHRcdFx0b3V0LnB1c2goIGZ1bmMuYXBwbHkoaXRlbXMsW2kqdW5pdHNpemVdKSk7XG5cdFx0XHR9XG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvdXRdKTtcblx0XHR9KTtcblx0fVxuXG5cdHZhciBmcmVlPWZ1bmN0aW9uKCkge1xuXHRcdC8vY29uc29sZS5sb2coJ2Nsb3NpbmcgJyxoYW5kbGUpO1xuXHRcdGZzLmNsb3NlU3luYyh0aGlzLmhhbmRsZSk7XG5cdH1cblx0dmFyIHNldHVwYXBpPWZ1bmN0aW9uKCkge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dGhpcy5yZWFkU2lnbmF0dXJlPXJlYWRTaWduYXR1cmU7XG5cdFx0dGhpcy5yZWFkSTMyPXJlYWRJMzI7XG5cdFx0dGhpcy5yZWFkVUkzMj1yZWFkVUkzMjtcblx0XHR0aGlzLnJlYWRVSTg9cmVhZFVJODtcblx0XHR0aGlzLnJlYWRCdWY9cmVhZEJ1Zjtcblx0XHR0aGlzLnJlYWRCdWZfcGFja2VkaW50PXJlYWRCdWZfcGFja2VkaW50O1xuXHRcdHRoaXMucmVhZEZpeGVkQXJyYXk9cmVhZEZpeGVkQXJyYXk7XG5cdFx0dGhpcy5yZWFkU3RyaW5nPXJlYWRTdHJpbmc7XG5cdFx0dGhpcy5yZWFkU3RyaW5nQXJyYXk9cmVhZFN0cmluZ0FycmF5O1xuXHRcdHRoaXMuc2lnbmF0dXJlX3NpemU9c2lnbmF0dXJlX3NpemU7XG5cdFx0dGhpcy5mcmVlPWZyZWU7XG5cdFx0aWYgKGh0bWw1ZnMpIHtcblx0XHRcdHZhciBmbj1wYXRoO1xuXHRcdFx0aWYgKHBhdGguaW5kZXhPZihcImZpbGVzeXN0ZW06XCIpPT0wKSBmbj1wYXRoLnN1YnN0cihwYXRoLmxhc3RJbmRleE9mKFwiL1wiKSk7XG5cdFx0XHRmcy5mcy5yb290LmdldEZpbGUoZm4se30sZnVuY3Rpb24oZW50cnkpe1xuXHRcdFx0ICBlbnRyeS5nZXRNZXRhZGF0YShmdW5jdGlvbihtZXRhZGF0YSkgeyBcblx0XHRcdFx0dGhhdC5zaXplPW1ldGFkYXRhLnNpemU7XG5cdFx0XHRcdGlmIChjYikgc2V0VGltZW91dChjYi5iaW5kKHRoYXQpLDApO1xuXHRcdFx0XHR9KTtcblx0XHRcdH0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgc3RhdD1mcy5mc3RhdFN5bmModGhpcy5oYW5kbGUpO1xuXHRcdFx0dGhpcy5zdGF0PXN0YXQ7XG5cdFx0XHR0aGlzLnNpemU9c3RhdC5zaXplO1x0XHRcblx0XHRcdGlmIChjYilcdHNldFRpbWVvdXQoY2IuYmluZCh0aGlzLDApLDApO1x0XG5cdFx0fVxuXHR9XG5cblx0dmFyIHRoYXQ9dGhpcztcblx0aWYgKGh0bWw1ZnMpIHtcblx0XHRmcy5vcGVuKHBhdGgsZnVuY3Rpb24oaCl7XG5cdFx0XHRpZiAoIWgpIHtcblx0XHRcdFx0aWYgKGNiKVx0c2V0VGltZW91dChjYi5iaW5kKG51bGwsXCJmaWxlIG5vdCBmb3VuZDpcIitwYXRoKSwwKTtcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dGhhdC5oYW5kbGU9aDtcblx0XHRcdFx0dGhhdC5odG1sNWZzPXRydWU7XG5cdFx0XHRcdHNldHVwYXBpLmNhbGwodGhhdCk7XG5cdFx0XHRcdHRoYXQub3BlbmVkPXRydWU7XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9KVxuXHR9IGVsc2Uge1xuXHRcdGlmIChmcy5leGlzdHNTeW5jKHBhdGgpKXtcblx0XHRcdHRoaXMuaGFuZGxlPWZzLm9wZW5TeW5jKHBhdGgsJ3InKTsvLyxmdW5jdGlvbihlcnIsaGFuZGxlKXtcblx0XHRcdHRoaXMub3BlbmVkPXRydWU7XG5cdFx0XHRzZXR1cGFwaS5jYWxsKHRoaXMpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoY2IpXHRzZXRUaW1lb3V0KGNiLmJpbmQobnVsbCxcImZpbGUgbm90IGZvdW5kOlwiK3BhdGgpLDApO1x0XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cblx0cmV0dXJuIHRoaXM7XG59XG5tb2R1bGUuZXhwb3J0cz1PcGVuOyIsIi8qXG4gIEpBVkEgY2FuIG9ubHkgcmV0dXJuIE51bWJlciBhbmQgU3RyaW5nXG5cdGFycmF5IGFuZCBidWZmZXIgcmV0dXJuIGluIHN0cmluZyBmb3JtYXRcblx0bmVlZCBKU09OLnBhcnNlXG4qL1xudmFyIHZlcmJvc2U9MDtcblxudmFyIHJlYWRTaWduYXR1cmU9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBzaWduYXR1cmVcIik7XG5cdHZhciBzaWduYXR1cmU9a2ZzLnJlYWRVVEY4U3RyaW5nKHRoaXMuaGFuZGxlLHBvcywxKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoc2lnbmF0dXJlLHNpZ25hdHVyZS5jaGFyQ29kZUF0KDApKTtcblx0Y2IuYXBwbHkodGhpcyxbc2lnbmF0dXJlXSk7XG59XG52YXIgcmVhZEkzMj1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIGkzMiBhdCBcIitwb3MpO1xuXHR2YXIgaTMyPWtmcy5yZWFkSW50MzIodGhpcy5oYW5kbGUscG9zKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoaTMyKTtcblx0Y2IuYXBwbHkodGhpcyxbaTMyXSk7XHRcbn1cbnZhciByZWFkVUkzMj1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIHVpMzIgYXQgXCIrcG9zKTtcblx0dmFyIHVpMzI9a2ZzLnJlYWRVSW50MzIodGhpcy5oYW5kbGUscG9zKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcodWkzMik7XG5cdGNiLmFwcGx5KHRoaXMsW3VpMzJdKTtcbn1cbnZhciByZWFkVUk4PWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgdWk4IGF0IFwiK3Bvcyk7IFxuXHR2YXIgdWk4PWtmcy5yZWFkVUludDgodGhpcy5oYW5kbGUscG9zKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcodWk4KTtcblx0Y2IuYXBwbHkodGhpcyxbdWk4XSk7XG59XG52YXIgcmVhZEJ1Zj1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBidWZmZXIgYXQgXCIrcG9zKyBcIiBibG9ja3NpemUgXCIrYmxvY2tzaXplKTtcblx0dmFyIGJ1Zj1rZnMucmVhZEJ1Zih0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcblx0dmFyIGJ1ZmY9SlNPTi5wYXJzZShidWYpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcImJ1ZmZlciBsZW5ndGhcIitidWZmLmxlbmd0aCk7XG5cdGNiLmFwcGx5KHRoaXMsW2J1ZmZdKTtcdFxufVxudmFyIHJlYWRCdWZfcGFja2VkaW50PWZ1bmN0aW9uKHBvcyxibG9ja3NpemUsY291bnQscmVzZXQsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIHBhY2tlZCBpbnQgYXQgXCIrcG9zK1wiIGJsb2Nrc2l6ZSBcIitibG9ja3NpemUrXCIgY291bnQgXCIrY291bnQpO1xuXHR2YXIgYnVmPWtmcy5yZWFkQnVmX3BhY2tlZGludCh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplLGNvdW50LHJlc2V0KTtcblx0dmFyIGFkdj1wYXJzZUludChidWYpO1xuXHR2YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zi5zdWJzdHIoYnVmLmluZGV4T2YoXCJbXCIpKSk7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicGFja2VkSW50IGxlbmd0aCBcIitidWZmLmxlbmd0aCtcIiBmaXJzdCBpdGVtPVwiK2J1ZmZbMF0pO1xuXHRjYi5hcHBseSh0aGlzLFt7ZGF0YTpidWZmLGFkdjphZHZ9XSk7XHRcbn1cblxuXG52YXIgcmVhZFN0cmluZz0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWRzdHJpbmcgYXQgXCIrcG9zK1wiIGJsb2Nrc2l6ZSBcIiArYmxvY2tzaXplK1wiIGVuYzpcIitlbmNvZGluZyk7XG5cdGlmIChlbmNvZGluZz09XCJ1Y3MyXCIpIHtcblx0XHR2YXIgc3RyPWtmcy5yZWFkVUxFMTZTdHJpbmcodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHN0cj1rZnMucmVhZFVURjhTdHJpbmcodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XHRcblx0fVx0IFxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhzdHIpO1xuXHRjYi5hcHBseSh0aGlzLFtzdHJdKTtcdFxufVxuXG52YXIgcmVhZEZpeGVkQXJyYXkgPSBmdW5jdGlvbihwb3MgLGNvdW50LCB1bml0c2l6ZSxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgZml4ZWQgYXJyYXkgYXQgXCIrcG9zK1wiIGNvdW50IFwiK2NvdW50K1wiIHVuaXRzaXplIFwiK3VuaXRzaXplKTsgXG5cdHZhciBidWY9a2ZzLnJlYWRGaXhlZEFycmF5KHRoaXMuaGFuZGxlLHBvcyxjb3VudCx1bml0c2l6ZSk7XG5cdHZhciBidWZmPUpTT04ucGFyc2UoYnVmKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJhcnJheSBsZW5ndGhcIitidWZmLmxlbmd0aCk7XG5cdGNiLmFwcGx5KHRoaXMsW2J1ZmZdKTtcdFxufVxudmFyIHJlYWRTdHJpbmdBcnJheSA9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUubG9nKFwicmVhZCBTdHJpbmcgYXJyYXkgYXQgXCIrcG9zK1wiIGJsb2Nrc2l6ZSBcIitibG9ja3NpemUgK1wiIGVuYyBcIitlbmNvZGluZyk7IFxuXHRlbmNvZGluZyA9IGVuY29kaW5nfHxcInV0ZjhcIjtcblx0dmFyIGJ1Zj1rZnMucmVhZFN0cmluZ0FycmF5KHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUsZW5jb2RpbmcpO1xuXHQvL3ZhciBidWZmPUpTT04ucGFyc2UoYnVmKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIHN0cmluZyBhcnJheVwiKTtcblx0dmFyIGJ1ZmY9YnVmLnNwbGl0KFwiXFx1ZmZmZlwiKTsgLy9jYW5ub3QgcmV0dXJuIHN0cmluZyB3aXRoIDBcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJhcnJheSBsZW5ndGhcIitidWZmLmxlbmd0aCk7XG5cdGNiLmFwcGx5KHRoaXMsW2J1ZmZdKTtcdFxufVxudmFyIG1lcmdlUG9zdGluZ3M9ZnVuY3Rpb24ocG9zaXRpb25zLGNiKSB7XG5cdHZhciBidWY9a2ZzLm1lcmdlUG9zdGluZ3ModGhpcy5oYW5kbGUsSlNPTi5zdHJpbmdpZnkocG9zaXRpb25zKSk7XG5cdGlmICghYnVmIHx8IGJ1Zi5sZW5ndGg9PTApIHJldHVybiBbXTtcblx0ZWxzZSByZXR1cm4gSlNPTi5wYXJzZShidWYpO1xufVxuXG52YXIgZnJlZT1mdW5jdGlvbigpIHtcblx0Ly9jb25zb2xlLmxvZygnY2xvc2luZyAnLGhhbmRsZSk7XG5cdGtmcy5jbG9zZSh0aGlzLmhhbmRsZSk7XG59XG52YXIgT3Blbj1mdW5jdGlvbihwYXRoLG9wdHMsY2IpIHtcblx0b3B0cz1vcHRzfHx7fTtcblx0dmFyIHNpZ25hdHVyZV9zaXplPTE7XG5cdHZhciBzZXR1cGFwaT1mdW5jdGlvbigpIHsgXG5cdFx0dGhpcy5yZWFkU2lnbmF0dXJlPXJlYWRTaWduYXR1cmU7XG5cdFx0dGhpcy5yZWFkSTMyPXJlYWRJMzI7XG5cdFx0dGhpcy5yZWFkVUkzMj1yZWFkVUkzMjtcblx0XHR0aGlzLnJlYWRVSTg9cmVhZFVJODtcblx0XHR0aGlzLnJlYWRCdWY9cmVhZEJ1Zjtcblx0XHR0aGlzLnJlYWRCdWZfcGFja2VkaW50PXJlYWRCdWZfcGFja2VkaW50O1xuXHRcdHRoaXMucmVhZEZpeGVkQXJyYXk9cmVhZEZpeGVkQXJyYXk7XG5cdFx0dGhpcy5yZWFkU3RyaW5nPXJlYWRTdHJpbmc7XG5cdFx0dGhpcy5yZWFkU3RyaW5nQXJyYXk9cmVhZFN0cmluZ0FycmF5O1xuXHRcdHRoaXMuc2lnbmF0dXJlX3NpemU9c2lnbmF0dXJlX3NpemU7XG5cdFx0dGhpcy5tZXJnZVBvc3RpbmdzPW1lcmdlUG9zdGluZ3M7XG5cdFx0dGhpcy5mcmVlPWZyZWU7XG5cdFx0dGhpcy5zaXplPWtmcy5nZXRGaWxlU2l6ZSh0aGlzLmhhbmRsZSk7XG5cdFx0aWYgKHZlcmJvc2UpIGNvbnNvbGUubG9nKFwiZmlsZXNpemUgIFwiK3RoaXMuc2l6ZSk7XG5cdFx0aWYgKGNiKVx0Y2IuY2FsbCh0aGlzKTtcblx0fVxuXG5cdHRoaXMuaGFuZGxlPWtmcy5vcGVuKHBhdGgpO1xuXHR0aGlzLm9wZW5lZD10cnVlO1xuXHRzZXR1cGFwaS5jYWxsKHRoaXMpO1xuXHRyZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHM9T3BlbjsiLCIvKlxuICBKU0NvbnRleHQgY2FuIHJldHVybiBhbGwgSmF2YXNjcmlwdCB0eXBlcy5cbiovXG52YXIgdmVyYm9zZT0xO1xuXG52YXIgcmVhZFNpZ25hdHVyZT1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIHNpZ25hdHVyZSBhdCBcIitwb3MpO1xuXHR2YXIgc2lnbmF0dXJlPWtmcy5yZWFkVVRGOFN0cmluZyh0aGlzLmhhbmRsZSxwb3MsMSk7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKHNpZ25hdHVyZStcIiBcIitzaWduYXR1cmUuY2hhckNvZGVBdCgwKSk7XG5cdGNiLmFwcGx5KHRoaXMsW3NpZ25hdHVyZV0pO1xufVxudmFyIHJlYWRJMzI9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBpMzIgYXQgXCIrcG9zKTtcblx0dmFyIGkzMj1rZnMucmVhZEludDMyKHRoaXMuaGFuZGxlLHBvcyk7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKGkzMik7XG5cdGNiLmFwcGx5KHRoaXMsW2kzMl0pO1x0XG59XG52YXIgcmVhZFVJMzI9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCB1aTMyIGF0IFwiK3Bvcyk7XG5cdHZhciB1aTMyPWtmcy5yZWFkVUludDMyKHRoaXMuaGFuZGxlLHBvcyk7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKHVpMzIpO1xuXHRjYi5hcHBseSh0aGlzLFt1aTMyXSk7XG59XG52YXIgcmVhZFVJOD1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIHVpOCBhdCBcIitwb3MpOyBcblx0dmFyIHVpOD1rZnMucmVhZFVJbnQ4KHRoaXMuaGFuZGxlLHBvcyk7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKHVpOCk7XG5cdGNiLmFwcGx5KHRoaXMsW3VpOF0pO1xufVxudmFyIHJlYWRCdWY9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjYikge1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgYnVmZmVyIGF0IFwiK3Bvcyk7XG5cdHZhciBidWY9a2ZzLnJlYWRCdWYodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwiYnVmZmVyIGxlbmd0aFwiK2J1Zi5sZW5ndGgpO1xuXHRjYi5hcHBseSh0aGlzLFtidWZdKTtcdFxufVxudmFyIHJlYWRCdWZfcGFja2VkaW50PWZ1bmN0aW9uKHBvcyxibG9ja3NpemUsY291bnQscmVzZXQsY2IpIHtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIHBhY2tlZCBpbnQgZmFzdCwgYmxvY2tzaXplIFwiK2Jsb2Nrc2l6ZStcIiBhdCBcIitwb3MpO3ZhciB0PW5ldyBEYXRlKCk7XG5cdHZhciBidWY9a2ZzLnJlYWRCdWZfcGFja2VkaW50KHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUsY291bnQscmVzZXQpO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJldHVybiBmcm9tIHBhY2tlZGludCwgdGltZVwiICsgKG5ldyBEYXRlKCktdCkpO1xuXHRpZiAodHlwZW9mIGJ1Zi5kYXRhPT1cInN0cmluZ1wiKSB7XG5cdFx0YnVmLmRhdGE9ZXZhbChcIltcIitidWYuZGF0YS5zdWJzdHIoMCxidWYuZGF0YS5sZW5ndGgtMSkrXCJdXCIpO1xuXHR9XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwidW5wYWNrZWQgbGVuZ3RoXCIrYnVmLmRhdGEubGVuZ3RoK1wiIHRpbWVcIiArIChuZXcgRGF0ZSgpLXQpICk7XG5cdGNiLmFwcGx5KHRoaXMsW2J1Zl0pO1xufVxuXG5cbnZhciByZWFkU3RyaW5nPSBmdW5jdGlvbihwb3MsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XG5cblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkc3RyaW5nIGF0IFwiK3BvcytcIiBibG9ja3NpemUgXCIrYmxvY2tzaXplK1wiIFwiK2VuY29kaW5nKTt2YXIgdD1uZXcgRGF0ZSgpO1xuXHRpZiAoZW5jb2Rpbmc9PVwidWNzMlwiKSB7XG5cdFx0dmFyIHN0cj1rZnMucmVhZFVMRTE2U3RyaW5nKHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBzdHI9a2ZzLnJlYWRVVEY4U3RyaW5nKHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUpO1x0XG5cdH1cblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coc3RyK1wiIHRpbWVcIisobmV3IERhdGUoKS10KSk7XG5cdGNiLmFwcGx5KHRoaXMsW3N0cl0pO1x0XG59XG5cbnZhciByZWFkRml4ZWRBcnJheSA9IGZ1bmN0aW9uKHBvcyAsY291bnQsIHVuaXRzaXplLGNiKSB7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBmaXhlZCBhcnJheSBhdCBcIitwb3MpOyB2YXIgdD1uZXcgRGF0ZSgpO1xuXHR2YXIgYnVmPWtmcy5yZWFkRml4ZWRBcnJheSh0aGlzLmhhbmRsZSxwb3MsY291bnQsdW5pdHNpemUpO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcImFycmF5IGxlbmd0aCBcIitidWYubGVuZ3RoK1wiIHRpbWVcIisobmV3IERhdGUoKS10KSk7XG5cdGNiLmFwcGx5KHRoaXMsW2J1Zl0pO1x0XG59XG52YXIgcmVhZFN0cmluZ0FycmF5ID0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xuXHQvL2lmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBTdHJpbmcgYXJyYXkgXCIrYmxvY2tzaXplICtcIiBcIitlbmNvZGluZyk7IFxuXHRlbmNvZGluZyA9IGVuY29kaW5nfHxcInV0ZjhcIjtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIHN0cmluZyBhcnJheSBhdCBcIitwb3MpO3ZhciB0PW5ldyBEYXRlKCk7XG5cdHZhciBidWY9a2ZzLnJlYWRTdHJpbmdBcnJheSh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplLGVuY29kaW5nKTtcblx0aWYgKHR5cGVvZiBidWY9PVwic3RyaW5nXCIpIGJ1Zj1idWYuc3BsaXQoXCJcXDBcIik7XG5cdC8vdmFyIGJ1ZmY9SlNPTi5wYXJzZShidWYpO1xuXHQvL3ZhciBidWZmPWJ1Zi5zcGxpdChcIlxcdWZmZmZcIik7IC8vY2Fubm90IHJldHVybiBzdHJpbmcgd2l0aCAwXG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwic3RyaW5nIGFycmF5IGxlbmd0aFwiK2J1Zi5sZW5ndGgrXCIgdGltZVwiKyhuZXcgRGF0ZSgpLXQpKTtcblx0Y2IuYXBwbHkodGhpcyxbYnVmXSk7XG59XG5cbnZhciBtZXJnZVBvc3RpbmdzPWZ1bmN0aW9uKHBvc2l0aW9ucykge1xuXHR2YXIgYnVmPWtmcy5tZXJnZVBvc3RpbmdzKHRoaXMuaGFuZGxlLHBvc2l0aW9ucyk7XG5cdGlmICh0eXBlb2YgYnVmPT1cInN0cmluZ1wiKSB7XG5cdFx0YnVmPWV2YWwoXCJbXCIrYnVmLnN1YnN0cigwLGJ1Zi5sZW5ndGgtMSkrXCJdXCIpO1xuXHR9XG5cdHJldHVybiBidWY7XG59XG52YXIgZnJlZT1mdW5jdGlvbigpIHtcblx0Ly8vL2lmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKCdjbG9zaW5nICcsaGFuZGxlKTtcblx0a2ZzLmNsb3NlKHRoaXMuaGFuZGxlKTtcbn1cbnZhciBPcGVuPWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xuXHRvcHRzPW9wdHN8fHt9O1xuXHR2YXIgc2lnbmF0dXJlX3NpemU9MTtcblx0dmFyIHNldHVwYXBpPWZ1bmN0aW9uKCkgeyBcblx0XHR0aGlzLnJlYWRTaWduYXR1cmU9cmVhZFNpZ25hdHVyZTtcblx0XHR0aGlzLnJlYWRJMzI9cmVhZEkzMjtcblx0XHR0aGlzLnJlYWRVSTMyPXJlYWRVSTMyO1xuXHRcdHRoaXMucmVhZFVJOD1yZWFkVUk4O1xuXHRcdHRoaXMucmVhZEJ1Zj1yZWFkQnVmO1xuXHRcdHRoaXMucmVhZEJ1Zl9wYWNrZWRpbnQ9cmVhZEJ1Zl9wYWNrZWRpbnQ7XG5cdFx0dGhpcy5yZWFkRml4ZWRBcnJheT1yZWFkRml4ZWRBcnJheTtcblx0XHR0aGlzLnJlYWRTdHJpbmc9cmVhZFN0cmluZztcblx0XHR0aGlzLnJlYWRTdHJpbmdBcnJheT1yZWFkU3RyaW5nQXJyYXk7XG5cdFx0dGhpcy5zaWduYXR1cmVfc2l6ZT1zaWduYXR1cmVfc2l6ZTtcblx0XHR0aGlzLm1lcmdlUG9zdGluZ3M9bWVyZ2VQb3N0aW5ncztcblx0XHR0aGlzLmZyZWU9ZnJlZTtcblx0XHR0aGlzLnNpemU9a2ZzLmdldEZpbGVTaXplKHRoaXMuaGFuZGxlKTtcblx0XHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcImZpbGVzaXplICBcIit0aGlzLnNpemUpO1xuXHRcdGlmIChjYilcdGNiLmNhbGwodGhpcyk7XG5cdH1cblxuXHR0aGlzLmhhbmRsZT1rZnMub3BlbihwYXRoKTtcblx0dGhpcy5vcGVuZWQ9dHJ1ZTtcblx0c2V0dXBhcGkuY2FsbCh0aGlzKTtcblx0cmV0dXJuIHRoaXM7XG59XG5cbm1vZHVsZS5leHBvcnRzPU9wZW47IiwiLypcbiAgY29udmVydCBhbnkganNvbiBpbnRvIGEgYmluYXJ5IGJ1ZmZlclxuICB0aGUgYnVmZmVyIGNhbiBiZSBzYXZlZCB3aXRoIGEgc2luZ2xlIGxpbmUgb2YgZnMud3JpdGVGaWxlXG4qL1xuXG52YXIgRFQ9e1xuXHR1aW50ODonMScsIC8vdW5zaWduZWQgMSBieXRlIGludGVnZXJcblx0aW50MzI6JzQnLCAvLyBzaWduZWQgNCBieXRlcyBpbnRlZ2VyXG5cdHV0Zjg6JzgnLCAgXG5cdHVjczI6JzInLFxuXHRib29sOideJywgXG5cdGJsb2I6JyYnLFxuXHR1dGY4YXJyOicqJywgLy9zaGlmdCBvZiA4XG5cdHVjczJhcnI6J0AnLCAvL3NoaWZ0IG9mIDJcblx0dWludDhhcnI6JyEnLCAvL3NoaWZ0IG9mIDFcblx0aW50MzJhcnI6JyQnLCAvL3NoaWZ0IG9mIDRcblx0dmludDonYCcsXG5cdHBpbnQ6J34nLFx0XG5cblx0YXJyYXk6J1xcdTAwMWInLFxuXHRvYmplY3Q6J1xcdTAwMWEnIFxuXHQvL3lkYiBzdGFydCB3aXRoIG9iamVjdCBzaWduYXR1cmUsXG5cdC8vdHlwZSBhIHlkYiBpbiBjb21tYW5kIHByb21wdCBzaG93cyBub3RoaW5nXG59XG52YXIga2V5X3dyaXRpbmc9XCJcIjsvL2ZvciBkZWJ1Z2dpbmdcbnZhciBwYWNrX2ludCA9IGZ1bmN0aW9uIChhciwgc2F2ZWRlbHRhKSB7IC8vIHBhY2sgYXIgaW50b1xuICBpZiAoIWFyIHx8IGFyLmxlbmd0aCA9PT0gMCkgcmV0dXJuIFtdOyAvLyBlbXB0eSBhcnJheVxuICB2YXIgciA9IFtdLFxuICBpID0gMCxcbiAgaiA9IDAsXG4gIGRlbHRhID0gMCxcbiAgcHJldiA9IDA7XG4gIFxuICBkbyB7XG5cdGRlbHRhID0gYXJbaV07XG5cdGlmIChzYXZlZGVsdGEpIHtcblx0XHRkZWx0YSAtPSBwcmV2O1xuXHR9XG5cdGlmIChkZWx0YSA8IDApIHtcblx0ICBjb25zb2xlLnRyYWNlKCduZWdhdGl2ZScscHJldixhcltpXSlcblx0ICB0aHJvdyAnbmVnZXRpdmUnO1xuXHQgIGJyZWFrO1xuXHR9XG5cdFxuXHRyW2orK10gPSBkZWx0YSAmIDB4N2Y7XG5cdGRlbHRhID4+PSA3O1xuXHR3aGlsZSAoZGVsdGEgPiAwKSB7XG5cdCAgcltqKytdID0gKGRlbHRhICYgMHg3ZikgfCAweDgwO1xuXHQgIGRlbHRhID4+PSA3O1xuXHR9XG5cdHByZXYgPSBhcltpXTtcblx0aSsrO1xuICB9IHdoaWxlIChpIDwgYXIubGVuZ3RoKTtcbiAgcmV0dXJuIHI7XG59XG52YXIgS2ZzPWZ1bmN0aW9uKHBhdGgsb3B0cykge1xuXHRcblx0dmFyIGhhbmRsZT1udWxsO1xuXHRvcHRzPW9wdHN8fHt9O1xuXHRvcHRzLnNpemU9b3B0cy5zaXplfHw2NTUzNioyMDQ4OyBcblx0Y29uc29sZS5sb2coJ2tkYiBlc3RpbWF0ZSBzaXplOicsb3B0cy5zaXplKTtcblx0dmFyIGRidWY9bmV3IEJ1ZmZlcihvcHRzLnNpemUpO1xuXHR2YXIgY3VyPTA7Ly9kYnVmIGN1cnNvclxuXHRcblx0dmFyIHdyaXRlU2lnbmF0dXJlPWZ1bmN0aW9uKHZhbHVlLHBvcykge1xuXHRcdGRidWYud3JpdGUodmFsdWUscG9zLHZhbHVlLmxlbmd0aCwndXRmOCcpO1xuXHRcdGlmIChwb3MrdmFsdWUubGVuZ3RoPmN1cikgY3VyPXBvcyt2YWx1ZS5sZW5ndGg7XG5cdFx0cmV0dXJuIHZhbHVlLmxlbmd0aDtcblx0fVxuXHR2YXIgd3JpdGVPZmZzZXQ9ZnVuY3Rpb24odmFsdWUscG9zKSB7XG5cdFx0ZGJ1Zi53cml0ZVVJbnQ4KE1hdGguZmxvb3IodmFsdWUgLyAoNjU1MzYqNjU1MzYpKSxwb3MpO1xuXHRcdGRidWYud3JpdGVVSW50MzJCRSggdmFsdWUgJiAweEZGRkZGRkZGLHBvcysxKTtcblx0XHRpZiAocG9zKzU+Y3VyKSBjdXI9cG9zKzU7XG5cdFx0cmV0dXJuIDU7XG5cdH1cblx0dmFyIHdyaXRlU3RyaW5nPSBmdW5jdGlvbih2YWx1ZSxwb3MsZW5jb2RpbmcpIHtcblx0XHRlbmNvZGluZz1lbmNvZGluZ3x8J3VjczInO1xuXHRcdGlmICh2YWx1ZT09XCJcIikgdGhyb3cgXCJjYW5ub3Qgd3JpdGUgbnVsbCBzdHJpbmdcIjtcblx0XHRpZiAoZW5jb2Rpbmc9PT0ndXRmOCcpZGJ1Zi53cml0ZShEVC51dGY4LHBvcywxLCd1dGY4Jyk7XG5cdFx0ZWxzZSBpZiAoZW5jb2Rpbmc9PT0ndWNzMicpZGJ1Zi53cml0ZShEVC51Y3MyLHBvcywxLCd1dGY4Jyk7XG5cdFx0ZWxzZSB0aHJvdyAndW5zdXBwb3J0ZWQgZW5jb2RpbmcgJytlbmNvZGluZztcblx0XHRcdFxuXHRcdHZhciBsZW49QnVmZmVyLmJ5dGVMZW5ndGgodmFsdWUsIGVuY29kaW5nKTtcblx0XHRkYnVmLndyaXRlKHZhbHVlLHBvcysxLGxlbixlbmNvZGluZyk7XG5cdFx0XG5cdFx0aWYgKHBvcytsZW4rMT5jdXIpIGN1cj1wb3MrbGVuKzE7XG5cdFx0cmV0dXJuIGxlbisxOyAvLyBzaWduYXR1cmVcblx0fVxuXHR2YXIgd3JpdGVTdHJpbmdBcnJheSA9IGZ1bmN0aW9uKHZhbHVlLHBvcyxlbmNvZGluZykge1xuXHRcdGVuY29kaW5nPWVuY29kaW5nfHwndWNzMic7XG5cdFx0aWYgKGVuY29kaW5nPT09J3V0ZjgnKSBkYnVmLndyaXRlKERULnV0ZjhhcnIscG9zLDEsJ3V0ZjgnKTtcblx0XHRlbHNlIGlmIChlbmNvZGluZz09PSd1Y3MyJylkYnVmLndyaXRlKERULnVjczJhcnIscG9zLDEsJ3V0ZjgnKTtcblx0XHRlbHNlIHRocm93ICd1bnN1cHBvcnRlZCBlbmNvZGluZyAnK2VuY29kaW5nO1xuXHRcdFxuXHRcdHZhciB2PXZhbHVlLmpvaW4oJ1xcMCcpO1xuXHRcdHZhciBsZW49QnVmZmVyLmJ5dGVMZW5ndGgodiwgZW5jb2RpbmcpO1xuXHRcdGlmICgwPT09bGVuKSB7XG5cdFx0XHR0aHJvdyBcImVtcHR5IHN0cmluZyBhcnJheSBcIiArIGtleV93cml0aW5nO1xuXHRcdH1cblx0XHRkYnVmLndyaXRlKHYscG9zKzEsbGVuLGVuY29kaW5nKTtcblx0XHRpZiAocG9zK2xlbisxPmN1cikgY3VyPXBvcytsZW4rMTtcblx0XHRyZXR1cm4gbGVuKzE7XG5cdH1cblx0dmFyIHdyaXRlSTMyPWZ1bmN0aW9uKHZhbHVlLHBvcykge1xuXHRcdGRidWYud3JpdGUoRFQuaW50MzIscG9zLDEsJ3V0ZjgnKTtcblx0XHRkYnVmLndyaXRlSW50MzJCRSh2YWx1ZSxwb3MrMSk7XG5cdFx0aWYgKHBvcys1PmN1cikgY3VyPXBvcys1O1xuXHRcdHJldHVybiA1O1xuXHR9XG5cdHZhciB3cml0ZVVJOD1mdW5jdGlvbih2YWx1ZSxwb3MpIHtcblx0XHRkYnVmLndyaXRlKERULnVpbnQ4LHBvcywxLCd1dGY4Jyk7XG5cdFx0ZGJ1Zi53cml0ZVVJbnQ4KHZhbHVlLHBvcysxKTtcblx0XHRpZiAocG9zKzI+Y3VyKSBjdXI9cG9zKzI7XG5cdFx0cmV0dXJuIDI7XG5cdH1cblx0dmFyIHdyaXRlQm9vbD1mdW5jdGlvbih2YWx1ZSxwb3MpIHtcblx0XHRkYnVmLndyaXRlKERULmJvb2wscG9zLDEsJ3V0ZjgnKTtcblx0XHRkYnVmLndyaXRlVUludDgoTnVtYmVyKHZhbHVlKSxwb3MrMSk7XG5cdFx0aWYgKHBvcysyPmN1cikgY3VyPXBvcysyO1xuXHRcdHJldHVybiAyO1xuXHR9XHRcdFxuXHR2YXIgd3JpdGVCbG9iPWZ1bmN0aW9uKHZhbHVlLHBvcykge1xuXHRcdGRidWYud3JpdGUoRFQuYmxvYixwb3MsMSwndXRmOCcpO1xuXHRcdHZhbHVlLmNvcHkoZGJ1ZiwgcG9zKzEpO1xuXHRcdHZhciB3cml0dGVuPXZhbHVlLmxlbmd0aCsxO1xuXHRcdGlmIChwb3Mrd3JpdHRlbj5jdXIpIGN1cj1wb3Mrd3JpdHRlbjtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVx0XHRcblx0Lyogbm8gc2lnbmF0dXJlICovXG5cdHZhciB3cml0ZUZpeGVkQXJyYXkgPSBmdW5jdGlvbih2YWx1ZSxwb3MsdW5pdHNpemUpIHtcblx0XHQvL2NvbnNvbGUubG9nKCd2LmxlbicsdmFsdWUubGVuZ3RoLGl0ZW1zLmxlbmd0aCx1bml0c2l6ZSk7XG5cdFx0aWYgKHVuaXRzaXplPT09MSkgdmFyIGZ1bmM9ZGJ1Zi53cml0ZVVJbnQ4O1xuXHRcdGVsc2UgaWYgKHVuaXRzaXplPT09NCl2YXIgZnVuYz1kYnVmLndyaXRlSW50MzJCRTtcblx0XHRlbHNlIHRocm93ICd1bnN1cHBvcnRlZCBpbnRlZ2VyIHNpemUnO1xuXHRcdGlmICghdmFsdWUubGVuZ3RoKSB7XG5cdFx0XHR0aHJvdyBcImVtcHR5IGZpeGVkIGFycmF5IFwiK2tleV93cml0aW5nO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aCA7IGkrKykge1xuXHRcdFx0ZnVuYy5hcHBseShkYnVmLFt2YWx1ZVtpXSxpKnVuaXRzaXplK3Bvc10pXG5cdFx0fVxuXHRcdHZhciBsZW49dW5pdHNpemUqdmFsdWUubGVuZ3RoO1xuXHRcdGlmIChwb3MrbGVuPmN1cikgY3VyPXBvcytsZW47XG5cdFx0cmV0dXJuIGxlbjtcblx0fVxuXG5cdHRoaXMud3JpdGVJMzI9d3JpdGVJMzI7XG5cdHRoaXMud3JpdGVCb29sPXdyaXRlQm9vbDtcblx0dGhpcy53cml0ZUJsb2I9d3JpdGVCbG9iO1xuXHR0aGlzLndyaXRlVUk4PXdyaXRlVUk4O1xuXHR0aGlzLndyaXRlU3RyaW5nPXdyaXRlU3RyaW5nO1xuXHR0aGlzLndyaXRlU2lnbmF0dXJlPXdyaXRlU2lnbmF0dXJlO1xuXHR0aGlzLndyaXRlT2Zmc2V0PXdyaXRlT2Zmc2V0OyAvLzUgYnl0ZXMgb2Zmc2V0XG5cdHRoaXMud3JpdGVTdHJpbmdBcnJheT13cml0ZVN0cmluZ0FycmF5O1xuXHR0aGlzLndyaXRlRml4ZWRBcnJheT13cml0ZUZpeGVkQXJyYXk7XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCBcImJ1ZlwiLCB7Z2V0IDogZnVuY3Rpb24oKXsgcmV0dXJuIGRidWY7IH19KTtcblx0XG5cdHJldHVybiB0aGlzO1xufVxuXG52YXIgQ3JlYXRlPWZ1bmN0aW9uKHBhdGgsb3B0cykge1xuXHRvcHRzPW9wdHN8fHt9O1xuXHR2YXIga2ZzPW5ldyBLZnMocGF0aCxvcHRzKTtcblx0dmFyIGN1cj0wO1xuXG5cdHZhciBoYW5kbGU9e307XG5cdFxuXHQvL25vIHNpZ25hdHVyZVxuXHR2YXIgd3JpdGVWSW50ID1mdW5jdGlvbihhcnIpIHtcblx0XHR2YXIgbz1wYWNrX2ludChhcnIsZmFsc2UpO1xuXHRcdGtmcy53cml0ZUZpeGVkQXJyYXkobyxjdXIsMSk7XG5cdFx0Y3VyKz1vLmxlbmd0aDtcblx0fVxuXHR2YXIgd3JpdGVWSW50MT1mdW5jdGlvbih2YWx1ZSkge1xuXHRcdHdyaXRlVkludChbdmFsdWVdKTtcblx0fVxuXHQvL2ZvciBwb3N0aW5nc1xuXHR2YXIgd3JpdGVQSW50ID1mdW5jdGlvbihhcnIpIHtcblx0XHR2YXIgbz1wYWNrX2ludChhcnIsdHJ1ZSk7XG5cdFx0a2ZzLndyaXRlRml4ZWRBcnJheShvLGN1ciwxKTtcblx0XHRjdXIrPW8ubGVuZ3RoO1xuXHR9XG5cdFxuXHR2YXIgc2F2ZVZJbnQgPSBmdW5jdGlvbihhcnIsa2V5KSB7XG5cdFx0dmFyIHN0YXJ0PWN1cjtcblx0XHRrZXlfd3JpdGluZz1rZXk7XG5cdFx0Y3VyKz1rZnMud3JpdGVTaWduYXR1cmUoRFQudmludCxjdXIpO1xuXHRcdHdyaXRlVkludChhcnIpO1xuXHRcdHZhciB3cml0dGVuID0gY3VyLXN0YXJ0O1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcdFx0XG5cdH1cblx0dmFyIHNhdmVQSW50ID0gZnVuY3Rpb24oYXJyLGtleSkge1xuXHRcdHZhciBzdGFydD1jdXI7XG5cdFx0a2V5X3dyaXRpbmc9a2V5O1xuXHRcdGN1cis9a2ZzLndyaXRlU2lnbmF0dXJlKERULnBpbnQsY3VyKTtcblx0XHR3cml0ZVBJbnQoYXJyKTtcblx0XHR2YXIgd3JpdHRlbiA9IGN1ci1zdGFydDtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XHRcblx0fVxuXG5cdFxuXHR2YXIgc2F2ZVVJOCA9IGZ1bmN0aW9uKHZhbHVlLGtleSkge1xuXHRcdHZhciB3cml0dGVuPWtmcy53cml0ZVVJOCh2YWx1ZSxjdXIpO1xuXHRcdGN1cis9d3JpdHRlbjtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cblx0dmFyIHNhdmVCb29sPWZ1bmN0aW9uKHZhbHVlLGtleSkge1xuXHRcdHZhciB3cml0dGVuPWtmcy53cml0ZUJvb2wodmFsdWUsY3VyKTtcblx0XHRjdXIrPXdyaXR0ZW47XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XG5cdHZhciBzYXZlSTMyID0gZnVuY3Rpb24odmFsdWUsa2V5KSB7XG5cdFx0dmFyIHdyaXR0ZW49a2ZzLndyaXRlSTMyKHZhbHVlLGN1cik7XG5cdFx0Y3VyKz13cml0dGVuO1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVx0XG5cdHZhciBzYXZlU3RyaW5nID0gZnVuY3Rpb24odmFsdWUsa2V5LGVuY29kaW5nKSB7XG5cdFx0ZW5jb2Rpbmc9ZW5jb2Rpbmd8fHN0cmluZ2VuY29kaW5nO1xuXHRcdGtleV93cml0aW5nPWtleTtcblx0XHR2YXIgd3JpdHRlbj1rZnMud3JpdGVTdHJpbmcodmFsdWUsY3VyLGVuY29kaW5nKTtcblx0XHRjdXIrPXdyaXR0ZW47XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XG5cdHZhciBzYXZlU3RyaW5nQXJyYXkgPSBmdW5jdGlvbihhcnIsa2V5LGVuY29kaW5nKSB7XG5cdFx0ZW5jb2Rpbmc9ZW5jb2Rpbmd8fHN0cmluZ2VuY29kaW5nO1xuXHRcdGtleV93cml0aW5nPWtleTtcblx0XHR0cnkge1xuXHRcdFx0dmFyIHdyaXR0ZW49a2ZzLndyaXRlU3RyaW5nQXJyYXkoYXJyLGN1cixlbmNvZGluZyk7XG5cdFx0fSBjYXRjaChlKSB7XG5cdFx0XHR0aHJvdyBlO1xuXHRcdH1cblx0XHRjdXIrPXdyaXR0ZW47XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XG5cdFxuXHR2YXIgc2F2ZUJsb2IgPSBmdW5jdGlvbih2YWx1ZSxrZXkpIHtcblx0XHRrZXlfd3JpdGluZz1rZXk7XG5cdFx0dmFyIHdyaXR0ZW49a2ZzLndyaXRlQmxvYih2YWx1ZSxjdXIpO1xuXHRcdGN1cis9d3JpdHRlbjtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cblxuXHR2YXIgZm9sZGVycz1bXTtcblx0dmFyIHB1c2hpdGVtPWZ1bmN0aW9uKGtleSx3cml0dGVuKSB7XG5cdFx0dmFyIGZvbGRlcj1mb2xkZXJzW2ZvbGRlcnMubGVuZ3RoLTFdO1x0XG5cdFx0aWYgKCFmb2xkZXIpIHJldHVybiA7XG5cdFx0Zm9sZGVyLml0ZW1zbGVuZ3RoLnB1c2god3JpdHRlbik7XG5cdFx0aWYgKGtleSkge1xuXHRcdFx0aWYgKCFmb2xkZXIua2V5cykgdGhyb3cgJ2Nhbm5vdCBoYXZlIGtleSBpbiBhcnJheSc7XG5cdFx0XHRmb2xkZXIua2V5cy5wdXNoKGtleSk7XG5cdFx0fVxuXHR9XHRcblx0dmFyIG9wZW4gPSBmdW5jdGlvbihvcHQpIHtcblx0XHR2YXIgc3RhcnQ9Y3VyO1xuXHRcdHZhciBrZXk9b3B0LmtleSB8fCBudWxsO1xuXHRcdHZhciB0eXBlPW9wdC50eXBlfHxEVC5hcnJheTtcblx0XHRjdXIrPWtmcy53cml0ZVNpZ25hdHVyZSh0eXBlLGN1cik7XG5cdFx0Y3VyKz1rZnMud3JpdGVPZmZzZXQoMHgwLGN1cik7IC8vIHByZS1hbGxvYyBzcGFjZSBmb3Igb2Zmc2V0XG5cdFx0dmFyIGZvbGRlcj17XG5cdFx0XHR0eXBlOnR5cGUsIGtleTprZXksXG5cdFx0XHRzdGFydDpzdGFydCxkYXRhc3RhcnQ6Y3VyLFxuXHRcdFx0aXRlbXNsZW5ndGg6W10gfTtcblx0XHRpZiAodHlwZT09PURULm9iamVjdCkgZm9sZGVyLmtleXM9W107XG5cdFx0Zm9sZGVycy5wdXNoKGZvbGRlcik7XG5cdH1cblx0dmFyIG9wZW5PYmplY3QgPSBmdW5jdGlvbihrZXkpIHtcblx0XHRvcGVuKHt0eXBlOkRULm9iamVjdCxrZXk6a2V5fSk7XG5cdH1cblx0dmFyIG9wZW5BcnJheSA9IGZ1bmN0aW9uKGtleSkge1xuXHRcdG9wZW4oe3R5cGU6RFQuYXJyYXksa2V5OmtleX0pO1xuXHR9XG5cdHZhciBzYXZlSW50cz1mdW5jdGlvbihhcnIsa2V5LGZ1bmMpIHtcblx0XHRmdW5jLmFwcGx5KGhhbmRsZSxbYXJyLGtleV0pO1xuXHR9XG5cdHZhciBjbG9zZSA9IGZ1bmN0aW9uKG9wdCkge1xuXHRcdGlmICghZm9sZGVycy5sZW5ndGgpIHRocm93ICdlbXB0eSBzdGFjayc7XG5cdFx0dmFyIGZvbGRlcj1mb2xkZXJzLnBvcCgpO1xuXHRcdC8vanVtcCB0byBsZW5ndGhzIGFuZCBrZXlzXG5cdFx0a2ZzLndyaXRlT2Zmc2V0KCBjdXItZm9sZGVyLmRhdGFzdGFydCwgZm9sZGVyLmRhdGFzdGFydC01KTtcblx0XHR2YXIgaXRlbWNvdW50PWZvbGRlci5pdGVtc2xlbmd0aC5sZW5ndGg7XG5cdFx0Ly9zYXZlIGxlbmd0aHNcblx0XHR3cml0ZVZJbnQxKGl0ZW1jb3VudCk7XG5cdFx0d3JpdGVWSW50KGZvbGRlci5pdGVtc2xlbmd0aCk7XG5cdFx0XG5cdFx0aWYgKGZvbGRlci50eXBlPT09RFQub2JqZWN0KSB7XG5cdFx0XHQvL3VzZSB1dGY4IGZvciBrZXlzXG5cdFx0XHRjdXIrPWtmcy53cml0ZVN0cmluZ0FycmF5KGZvbGRlci5rZXlzLGN1ciwndXRmOCcpO1xuXHRcdH1cblx0XHR3cml0dGVuPWN1ci1mb2xkZXIuc3RhcnQ7XG5cdFx0cHVzaGl0ZW0oZm9sZGVyLmtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVxuXHRcblx0XG5cdHZhciBzdHJpbmdlbmNvZGluZz0ndWNzMic7XG5cdHZhciBzdHJpbmdFbmNvZGluZz1mdW5jdGlvbihuZXdlbmNvZGluZykge1xuXHRcdGlmIChuZXdlbmNvZGluZykgc3RyaW5nZW5jb2Rpbmc9bmV3ZW5jb2Rpbmc7XG5cdFx0ZWxzZSByZXR1cm4gc3RyaW5nZW5jb2Rpbmc7XG5cdH1cblx0XG5cdHZhciBhbGxudW1iZXJfZmFzdD1mdW5jdGlvbihhcnIpIHtcblx0XHRpZiAoYXJyLmxlbmd0aDw1KSByZXR1cm4gYWxsbnVtYmVyKGFycik7XG5cdFx0aWYgKHR5cGVvZiBhcnJbMF09PSdudW1iZXInXG5cdFx0ICAgICYmIE1hdGgucm91bmQoYXJyWzBdKT09YXJyWzBdICYmIGFyclswXT49MClcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdHJldHVybiBmYWxzZTtcblx0fVxuXHR2YXIgYWxsc3RyaW5nX2Zhc3Q9ZnVuY3Rpb24oYXJyKSB7XG5cdFx0aWYgKGFyci5sZW5ndGg8NSkgcmV0dXJuIGFsbHN0cmluZyhhcnIpO1xuXHRcdGlmICh0eXBlb2YgYXJyWzBdPT0nc3RyaW5nJykgcmV0dXJuIHRydWU7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XHRcblx0dmFyIGFsbG51bWJlcj1mdW5jdGlvbihhcnIpIHtcblx0XHRmb3IgKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKykge1xuXHRcdFx0aWYgKHR5cGVvZiBhcnJbaV0hPT0nbnVtYmVyJykgcmV0dXJuIGZhbHNlO1xuXHRcdH1cblx0XHRyZXR1cm4gdHJ1ZTtcblx0fVxuXHR2YXIgYWxsc3RyaW5nPWZ1bmN0aW9uKGFycikge1xuXHRcdGZvciAodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKSB7XG5cdFx0XHRpZiAodHlwZW9mIGFycltpXSE9PSdzdHJpbmcnKSByZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHZhciBnZXRFbmNvZGluZz1mdW5jdGlvbihrZXksZW5jcykge1xuXHRcdHZhciBlbmM9ZW5jc1trZXldO1xuXHRcdGlmICghZW5jKSByZXR1cm4gbnVsbDtcblx0XHRpZiAoZW5jPT0nZGVsdGEnIHx8IGVuYz09J3Bvc3RpbmcnKSB7XG5cdFx0XHRyZXR1cm4gc2F2ZVBJbnQ7XG5cdFx0fSBlbHNlIGlmIChlbmM9PVwidmFyaWFibGVcIikge1xuXHRcdFx0cmV0dXJuIHNhdmVWSW50O1xuXHRcdH1cblx0XHRyZXR1cm4gbnVsbDtcblx0fVxuXHR2YXIgc2F2ZT1mdW5jdGlvbihKLGtleSxvcHRzKSB7XG5cdFx0b3B0cz1vcHRzfHx7fTtcblx0XHRcblx0XHRpZiAodHlwZW9mIEo9PVwibnVsbFwiIHx8IHR5cGVvZiBKPT1cInVuZGVmaW5lZFwiKSB7XG5cdFx0XHR0aHJvdyAnY2Fubm90IHNhdmUgbnVsbCB2YWx1ZSBvZiBbJytrZXkrJ10gZm9sZGVycycrSlNPTi5zdHJpbmdpZnkoZm9sZGVycyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHZhciB0eXBlPUouY29uc3RydWN0b3IubmFtZTtcblx0XHRpZiAodHlwZT09PSdPYmplY3QnKSB7XG5cdFx0XHRvcGVuT2JqZWN0KGtleSk7XG5cdFx0XHRmb3IgKHZhciBpIGluIEopIHtcblx0XHRcdFx0c2F2ZShKW2ldLGksb3B0cyk7XG5cdFx0XHRcdGlmIChvcHRzLmF1dG9kZWxldGUpIGRlbGV0ZSBKW2ldO1xuXHRcdFx0fVxuXHRcdFx0Y2xvc2UoKTtcblx0XHR9IGVsc2UgaWYgKHR5cGU9PT0nQXJyYXknKSB7XG5cdFx0XHRpZiAoYWxsbnVtYmVyX2Zhc3QoSikpIHtcblx0XHRcdFx0aWYgKEouc29ydGVkKSB7IC8vbnVtYmVyIGFycmF5IGlzIHNvcnRlZFxuXHRcdFx0XHRcdHNhdmVJbnRzKEosa2V5LHNhdmVQSW50KTtcdC8vcG9zdGluZyBkZWx0YSBmb3JtYXRcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRzYXZlSW50cyhKLGtleSxzYXZlVkludCk7XHRcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIGlmIChhbGxzdHJpbmdfZmFzdChKKSkge1xuXHRcdFx0XHRzYXZlU3RyaW5nQXJyYXkoSixrZXkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0b3BlbkFycmF5KGtleSk7XG5cdFx0XHRcdGZvciAodmFyIGk9MDtpPEoubGVuZ3RoO2krKykge1xuXHRcdFx0XHRcdHNhdmUoSltpXSxudWxsLG9wdHMpO1xuXHRcdFx0XHRcdGlmIChvcHRzLmF1dG9kZWxldGUpIGRlbGV0ZSBKW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGNsb3NlKCk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIGlmICh0eXBlPT09J1N0cmluZycpIHtcblx0XHRcdHNhdmVTdHJpbmcoSixrZXkpO1xuXHRcdH0gZWxzZSBpZiAodHlwZT09PSdOdW1iZXInKSB7XG5cdFx0XHRpZiAoSj49MCYmSjwyNTYpIHNhdmVVSTgoSixrZXkpO1xuXHRcdFx0ZWxzZSBzYXZlSTMyKEosa2V5KTtcblx0XHR9IGVsc2UgaWYgKHR5cGU9PT0nQm9vbGVhbicpIHtcblx0XHRcdHNhdmVCb29sKEosa2V5KTtcblx0XHR9IGVsc2UgaWYgKHR5cGU9PT0nQnVmZmVyJykge1xuXHRcdFx0c2F2ZUJsb2IoSixrZXkpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aHJvdyAndW5zdXBwb3J0ZWQgdHlwZSAnK3R5cGU7XG5cdFx0fVxuXHR9XG5cdFxuXHR2YXIgZnJlZT1mdW5jdGlvbigpIHtcblx0XHR3aGlsZSAoZm9sZGVycy5sZW5ndGgpIGNsb3NlKCk7XG5cdFx0a2ZzLmZyZWUoKTtcblx0fVxuXHR2YXIgY3VycmVudHNpemU9ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIGN1cjtcblx0fVxuXG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShoYW5kbGUsIFwic2l6ZVwiLCB7Z2V0IDogZnVuY3Rpb24oKXsgcmV0dXJuIGN1cjsgfX0pO1xuXG5cdHZhciB3cml0ZUZpbGU9ZnVuY3Rpb24oZm4sb3B0cyxjYikge1xuXHRcdGlmICh0eXBlb2YgZnM9PVwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHZhciBmcz1vcHRzLmZzfHxyZXF1aXJlKCdmcycpO1x0XG5cdFx0fVxuXHRcdHZhciB0b3RhbGJ5dGU9aGFuZGxlLmN1cnJlbnRzaXplKCk7XG5cdFx0dmFyIHdyaXR0ZW49MCxiYXRjaD0wO1xuXHRcdFxuXHRcdGlmICh0eXBlb2YgY2I9PVwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y2I9b3B0cztcblx0XHR9XG5cdFx0b3B0cz1vcHRzfHx7fTtcblx0XHRiYXRjaHNpemU9b3B0cy5iYXRjaHNpemV8fDEwMjQqMTAyNCoxNjsgLy8xNiBNQlxuXG5cdFx0aWYgKGZzLmV4aXN0c1N5bmMoZm4pKSBmcy51bmxpbmtTeW5jKGZuKTtcblxuXHRcdHZhciB3cml0ZUNiPWZ1bmN0aW9uKHRvdGFsLHdyaXR0ZW4sY2IsbmV4dCkge1xuXHRcdFx0cmV0dXJuIGZ1bmN0aW9uKGVycikge1xuXHRcdFx0XHRpZiAoZXJyKSB0aHJvdyBcIndyaXRlIGVycm9yXCIrZXJyO1xuXHRcdFx0XHRjYih0b3RhbCx3cml0dGVuKTtcblx0XHRcdFx0YmF0Y2grKztcblx0XHRcdFx0bmV4dCgpO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdHZhciBuZXh0PWZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKGJhdGNoPGJhdGNoZXMpIHtcblx0XHRcdFx0dmFyIGJ1ZnN0YXJ0PWJhdGNoc2l6ZSpiYXRjaDtcblx0XHRcdFx0dmFyIGJ1ZmVuZD1idWZzdGFydCtiYXRjaHNpemU7XG5cdFx0XHRcdGlmIChidWZlbmQ+dG90YWxieXRlKSBidWZlbmQ9dG90YWxieXRlO1xuXHRcdFx0XHR2YXIgc2xpY2VkPWtmcy5idWYuc2xpY2UoYnVmc3RhcnQsYnVmZW5kKTtcblx0XHRcdFx0d3JpdHRlbis9c2xpY2VkLmxlbmd0aDtcblx0XHRcdFx0ZnMuYXBwZW5kRmlsZShmbixzbGljZWQsd3JpdGVDYih0b3RhbGJ5dGUsd3JpdHRlbiwgY2IsbmV4dCkpO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR2YXIgYmF0Y2hlcz0xK01hdGguZmxvb3IoaGFuZGxlLnNpemUvYmF0Y2hzaXplKTtcblx0XHRuZXh0KCk7XG5cdH1cblx0aGFuZGxlLmZyZWU9ZnJlZTtcblx0aGFuZGxlLnNhdmVJMzI9c2F2ZUkzMjtcblx0aGFuZGxlLnNhdmVVSTg9c2F2ZVVJODtcblx0aGFuZGxlLnNhdmVCb29sPXNhdmVCb29sO1xuXHRoYW5kbGUuc2F2ZVN0cmluZz1zYXZlU3RyaW5nO1xuXHRoYW5kbGUuc2F2ZVZJbnQ9c2F2ZVZJbnQ7XG5cdGhhbmRsZS5zYXZlUEludD1zYXZlUEludDtcblx0aGFuZGxlLnNhdmVJbnRzPXNhdmVJbnRzO1xuXHRoYW5kbGUuc2F2ZUJsb2I9c2F2ZUJsb2I7XG5cdGhhbmRsZS5zYXZlPXNhdmU7XG5cdGhhbmRsZS5vcGVuQXJyYXk9b3BlbkFycmF5O1xuXHRoYW5kbGUub3Blbk9iamVjdD1vcGVuT2JqZWN0O1xuXHRoYW5kbGUuc3RyaW5nRW5jb2Rpbmc9c3RyaW5nRW5jb2Rpbmc7XG5cdC8vdGhpcy5pbnRlZ2VyRW5jb2Rpbmc9aW50ZWdlckVuY29kaW5nO1xuXHRoYW5kbGUuY2xvc2U9Y2xvc2U7XG5cdGhhbmRsZS53cml0ZUZpbGU9d3JpdGVGaWxlO1xuXHRoYW5kbGUuY3VycmVudHNpemU9Y3VycmVudHNpemU7XG5cdHJldHVybiBoYW5kbGU7XG59XG5cbm1vZHVsZS5leHBvcnRzPUNyZWF0ZTsiLCIvKlxuICBUT0RPXG4gIGFuZCBub3RcblxuKi9cblxuLy8gaHR0cDovL2pzZmlkZGxlLm5ldC9uZW9zd2YvYVh6V3cvXG52YXIgcGxpc3Q9cmVxdWlyZSgnLi9wbGlzdCcpO1xuZnVuY3Rpb24gaW50ZXJzZWN0KEksIEopIHtcbiAgdmFyIGkgPSBqID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlKCBpIDwgSS5sZW5ndGggJiYgaiA8IEoubGVuZ3RoICl7XG4gICAgIGlmICAgICAgKElbaV0gPCBKW2pdKSBpKys7IFxuICAgICBlbHNlIGlmIChJW2ldID4gSltqXSkgaisrOyBcbiAgICAgZWxzZSB7XG4gICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPWxbaV07XG4gICAgICAgaSsrO2orKztcbiAgICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qIHJldHVybiBhbGwgaXRlbXMgaW4gSSBidXQgbm90IGluIEogKi9cbmZ1bmN0aW9uIHN1YnRyYWN0KEksIEopIHtcbiAgdmFyIGkgPSBqID0gMDtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHdoaWxlKCBpIDwgSS5sZW5ndGggJiYgaiA8IEoubGVuZ3RoICl7XG4gICAgaWYgKElbaV09PUpbal0pIHtcbiAgICAgIGkrKztqKys7XG4gICAgfSBlbHNlIGlmIChJW2ldPEpbal0pIHtcbiAgICAgIHdoaWxlIChJW2ldPEpbal0pIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT0gSVtpKytdO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZShKW2pdPElbaV0pIGorKztcbiAgICB9XG4gIH1cblxuICBpZiAoaj09Si5sZW5ndGgpIHtcbiAgICB3aGlsZSAoaTxJLmxlbmd0aCkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPUlbaSsrXTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnZhciB1bmlvbj1mdW5jdGlvbihhLGIpIHtcblx0aWYgKCFhIHx8ICFhLmxlbmd0aCkgcmV0dXJuIGI7XG5cdGlmICghYiB8fCAhYi5sZW5ndGgpIHJldHVybiBhO1xuICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICB2YXIgYWkgPSAwO1xuICAgIHZhciBiaSA9IDA7XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgaWYgKCBhaSA8IGEubGVuZ3RoICYmIGJpIDwgYi5sZW5ndGgpIHtcbiAgICAgICAgICAgIGlmIChhW2FpXSA8IGJbYmldKSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPWFbYWldO1xuICAgICAgICAgICAgICAgIGFpKys7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGFbYWldID4gYltiaV0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF09YltiaV07XG4gICAgICAgICAgICAgICAgYmkrKztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPWFbYWldO1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1iW2JpXTtcbiAgICAgICAgICAgICAgICBhaSsrO1xuICAgICAgICAgICAgICAgIGJpKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSBpZiAoYWkgPCBhLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBhLnNsaWNlKGFpLCBhLmxlbmd0aCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSBpZiAoYmkgPCBiLmxlbmd0aCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2guYXBwbHkocmVzdWx0LCBiLnNsaWNlKGJpLCBiLmxlbmd0aCkpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxudmFyIE9QRVJBVElPTj17J2luY2x1ZGUnOmludGVyc2VjdCwgJ3VuaW9uJzp1bmlvbiwgJ2V4Y2x1ZGUnOnN1YnRyYWN0fTtcblxudmFyIGJvb2xTZWFyY2g9ZnVuY3Rpb24ob3B0cykge1xuICBvcHRzPW9wdHN8fHt9O1xuICBvcHM9b3B0cy5vcHx8dGhpcy5vcHRzLm9wO1xuICB0aGlzLmRvY3M9W107XG5cdGlmICghdGhpcy5waHJhc2VzLmxlbmd0aCkgcmV0dXJuO1xuXHR2YXIgcj10aGlzLnBocmFzZXNbMF0uZG9jcztcbiAgLyogaWdub3JlIG9wZXJhdG9yIG9mIGZpcnN0IHBocmFzZSAqL1xuXHRmb3IgKHZhciBpPTE7aTx0aGlzLnBocmFzZXMubGVuZ3RoO2krKykge1xuXHRcdHZhciBvcD0gb3BzW2ldIHx8ICd1bmlvbic7XG5cdFx0cj1PUEVSQVRJT05bb3BdKHIsdGhpcy5waHJhc2VzW2ldLmRvY3MpO1xuXHR9XG5cdHRoaXMuZG9jcz1wbGlzdC51bmlxdWUocik7XG5cdHJldHVybiB0aGlzO1xufVxubW9kdWxlLmV4cG9ydHM9e3NlYXJjaDpib29sU2VhcmNofSIsImFyZ3VtZW50c1s0XVtcIi9Vc2Vycy95dS9rc2FuYTIwMTUvbm9kZV9tb2R1bGVzL2tzYW5hLWRhdGFiYXNlL2JzZWFyY2guanNcIl1bMF0uYXBwbHkoZXhwb3J0cyxhcmd1bWVudHMpIiwidmFyIHBsaXN0PXJlcXVpcmUoXCIuL3BsaXN0XCIpO1xuXG52YXIgZ2V0UGhyYXNlV2lkdGhzPWZ1bmN0aW9uIChRLHBocmFzZWlkLHZwb3NzKSB7XG5cdHZhciByZXM9W107XG5cdGZvciAodmFyIGkgaW4gdnBvc3MpIHtcblx0XHRyZXMucHVzaChnZXRQaHJhc2VXaWR0aChRLHBocmFzZWlkLHZwb3NzW2ldKSk7XG5cdH1cblx0cmV0dXJuIHJlcztcbn1cbnZhciBnZXRQaHJhc2VXaWR0aD1mdW5jdGlvbiAoUSxwaHJhc2VpZCx2cG9zKSB7XG5cdHZhciBQPVEucGhyYXNlc1twaHJhc2VpZF07XG5cdHZhciB3aWR0aD0wLHZhcndpZHRoPWZhbHNlO1xuXHRpZiAoUC53aWR0aCkgcmV0dXJuIFAud2lkdGg7IC8vIG5vIHdpbGRjYXJkXG5cdGlmIChQLnRlcm1pZC5sZW5ndGg8MikgcmV0dXJuIFAudGVybWxlbmd0aFswXTtcblx0dmFyIGxhc3R0ZXJtcG9zdGluZz1RLnRlcm1zW1AudGVybWlkW1AudGVybWlkLmxlbmd0aC0xXV0ucG9zdGluZztcblxuXHRmb3IgKHZhciBpIGluIFAudGVybWlkKSB7XG5cdFx0dmFyIFQ9US50ZXJtc1tQLnRlcm1pZFtpXV07XG5cdFx0aWYgKFQub3A9PSd3aWxkY2FyZCcpIHtcblx0XHRcdHdpZHRoKz1ULndpZHRoO1xuXHRcdFx0aWYgKFQud2lsZGNhcmQ9PScqJykgdmFyd2lkdGg9dHJ1ZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d2lkdGgrPVAudGVybWxlbmd0aFtpXTtcblx0XHR9XG5cdH1cblx0aWYgKHZhcndpZHRoKSB7IC8vd2lkdGggbWlnaHQgYmUgc21hbGxlciBkdWUgdG8gKiB3aWxkY2FyZFxuXHRcdHZhciBhdD1wbGlzdC5pbmRleE9mU29ydGVkKGxhc3R0ZXJtcG9zdGluZyx2cG9zKTtcblx0XHR2YXIgZW5kcG9zPWxhc3R0ZXJtcG9zdGluZ1thdF07XG5cdFx0aWYgKGVuZHBvcy12cG9zPHdpZHRoKSB3aWR0aD1lbmRwb3MtdnBvcysxO1xuXHR9XG5cblx0cmV0dXJuIHdpZHRoO1xufVxuLyogcmV0dXJuIFt2cG9zLCBwaHJhc2VpZCwgcGhyYXNld2lkdGgsIG9wdGlvbmFsX3RhZ25hbWVdIGJ5IHNsb3QgcmFuZ2UqL1xudmFyIGhpdEluUmFuZ2U9ZnVuY3Rpb24oUSxzdGFydHZwb3MsZW5kdnBvcykge1xuXHR2YXIgcmVzPVtdO1xuXHRpZiAoIVEgfHwgIVEucmF3cmVzdWx0IHx8ICFRLnJhd3Jlc3VsdC5sZW5ndGgpIHJldHVybiByZXM7XG5cdGZvciAodmFyIGk9MDtpPFEucGhyYXNlcy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIFA9US5waHJhc2VzW2ldO1xuXHRcdGlmICghUC5wb3N0aW5nKSBjb250aW51ZTtcblx0XHR2YXIgcz1wbGlzdC5pbmRleE9mU29ydGVkKFAucG9zdGluZyxzdGFydHZwb3MpO1xuXHRcdHZhciBlPXBsaXN0LmluZGV4T2ZTb3J0ZWQoUC5wb3N0aW5nLGVuZHZwb3MpO1xuXHRcdHZhciByPVAucG9zdGluZy5zbGljZShzLGUrMSk7XG5cdFx0dmFyIHdpZHRoPWdldFBocmFzZVdpZHRocyhRLGkscik7XG5cblx0XHRyZXM9cmVzLmNvbmNhdChyLm1hcChmdW5jdGlvbih2cG9zLGlkeCl7IHJldHVybiBbdnBvcyx3aWR0aFtpZHhdLGldIH0pKTtcblx0fVxuXHQvLyBvcmRlciBieSB2cG9zLCBpZiB2cG9zIGlzIHRoZSBzYW1lLCBsYXJnZXIgd2lkdGggY29tZSBmaXJzdC5cblx0Ly8gc28gdGhlIG91dHB1dCB3aWxsIGJlXG5cdC8vIDx0YWcxPjx0YWcyPm9uZTwvdGFnMj50d288L3RhZzE+XG5cdC8vVE9ETywgbWlnaHQgY2F1c2Ugb3ZlcmxhcCBpZiBzYW1lIHZwb3MgYW5kIHNhbWUgd2lkdGhcblx0Ly9uZWVkIHRvIGNoZWNrIHRhZyBuYW1lXG5cdHJlcy5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGFbMF09PWJbMF0/IGJbMV0tYVsxXSA6YVswXS1iWzBdfSk7XG5cblx0cmV0dXJuIHJlcztcbn1cblxudmFyIHRhZ3NJblJhbmdlPWZ1bmN0aW9uKFEscmVuZGVyVGFncyxzdGFydHZwb3MsZW5kdnBvcykge1xuXHR2YXIgcmVzPVtdO1xuXHRpZiAodHlwZW9mIHJlbmRlclRhZ3M9PVwic3RyaW5nXCIpIHJlbmRlclRhZ3M9W3JlbmRlclRhZ3NdO1xuXG5cdHJlbmRlclRhZ3MubWFwKGZ1bmN0aW9uKHRhZyl7XG5cdFx0dmFyIHN0YXJ0cz1RLmVuZ2luZS5nZXQoW1wiZmllbGRzXCIsdGFnK1wiX3N0YXJ0XCJdKTtcblx0XHR2YXIgZW5kcz1RLmVuZ2luZS5nZXQoW1wiZmllbGRzXCIsdGFnK1wiX2VuZFwiXSk7XG5cdFx0aWYgKCFzdGFydHMpIHJldHVybjtcblxuXHRcdHZhciBzPXBsaXN0LmluZGV4T2ZTb3J0ZWQoc3RhcnRzLHN0YXJ0dnBvcyk7XG5cdFx0dmFyIGU9cztcblx0XHR3aGlsZSAoZTxzdGFydHMubGVuZ3RoICYmIHN0YXJ0c1tlXTxlbmR2cG9zKSBlKys7XG5cdFx0dmFyIG9wZW50YWdzPXN0YXJ0cy5zbGljZShzLGUpO1xuXG5cdFx0cz1wbGlzdC5pbmRleE9mU29ydGVkKGVuZHMsc3RhcnR2cG9zKTtcblx0XHRlPXM7XG5cdFx0d2hpbGUgKGU8ZW5kcy5sZW5ndGggJiYgZW5kc1tlXTxlbmR2cG9zKSBlKys7XG5cdFx0dmFyIGNsb3NldGFncz1lbmRzLnNsaWNlKHMsZSk7XG5cblx0XHRvcGVudGFncy5tYXAoZnVuY3Rpb24oc3RhcnQsaWR4KSB7XG5cdFx0XHRyZXMucHVzaChbc3RhcnQsY2xvc2V0YWdzW2lkeF0tc3RhcnQsdGFnXSk7XG5cdFx0fSlcblx0fSk7XG5cdC8vIG9yZGVyIGJ5IHZwb3MsIGlmIHZwb3MgaXMgdGhlIHNhbWUsIGxhcmdlciB3aWR0aCBjb21lIGZpcnN0LlxuXHRyZXMuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBhWzBdPT1iWzBdPyBiWzFdLWFbMV0gOmFbMF0tYlswXX0pO1xuXG5cdHJldHVybiByZXM7XG59XG5cbi8qXG5naXZlbiBhIHZwb3MgcmFuZ2Ugc3RhcnQsIGZpbGUsIGNvbnZlcnQgdG8gZmlsZXN0YXJ0LCBmaWxlZW5kXG4gICBmaWxlc3RhcnQgOiBzdGFydGluZyBmaWxlXG4gICBzdGFydCAgIDogdnBvcyBzdGFydFxuICAgc2hvd2ZpbGU6IGhvdyBtYW55IGZpbGVzIHRvIGRpc3BsYXlcbiAgIHNob3dwYWdlOiBob3cgbWFueSBwYWdlcyB0byBkaXNwbGF5XG5cbm91dHB1dDpcbiAgIGFycmF5IG9mIGZpbGVpZCB3aXRoIGhpdHNcbiovXG52YXIgZ2V0RmlsZVdpdGhIaXRzPWZ1bmN0aW9uKGVuZ2luZSxRLHJhbmdlKSB7XG5cdHZhciBmaWxlT2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdHZhciBvdXQ9W10sZmlsZWNvdW50PTEwMDtcblx0dmFyIHN0YXJ0PTAgLCBlbmQ9US5ieUZpbGUubGVuZ3RoO1xuXHRRLmV4Y2VycHRPdmVyZmxvdz1mYWxzZTtcblx0aWYgKHJhbmdlLnN0YXJ0KSB7XG5cdFx0dmFyIGZpcnN0PXJhbmdlLnN0YXJ0IDtcblx0XHR2YXIgbGFzdD1yYW5nZS5lbmQ7XG5cdFx0aWYgKCFsYXN0KSBsYXN0PU51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXHRcdGZvciAodmFyIGk9MDtpPGZpbGVPZmZzZXRzLmxlbmd0aDtpKyspIHtcblx0XHRcdC8vaWYgKGZpbGVPZmZzZXRzW2ldPmZpcnN0KSBicmVhaztcblx0XHRcdGlmIChmaWxlT2Zmc2V0c1tpXT5sYXN0KSB7XG5cdFx0XHRcdGVuZD1pO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmIChmaWxlT2Zmc2V0c1tpXTxmaXJzdCkgc3RhcnQ9aTtcblx0XHR9XHRcdFxuXHR9IGVsc2Uge1xuXHRcdHN0YXJ0PXJhbmdlLmZpbGVzdGFydCB8fCAwO1xuXHRcdGlmIChyYW5nZS5tYXhmaWxlKSB7XG5cdFx0XHRmaWxlY291bnQ9cmFuZ2UubWF4ZmlsZTtcblx0XHR9IGVsc2UgaWYgKHJhbmdlLnNob3dwYWdlKSB7XG5cdFx0XHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCJcblx0XHR9XG5cdH1cblxuXHR2YXIgZmlsZVdpdGhIaXRzPVtdLHRvdGFsaGl0PTA7XG5cdHJhbmdlLm1heGhpdD1yYW5nZS5tYXhoaXR8fDEwMDA7XG5cblx0Zm9yICh2YXIgaT1zdGFydDtpPGVuZDtpKyspIHtcblx0XHRpZihRLmJ5RmlsZVtpXS5sZW5ndGg+MCkge1xuXHRcdFx0dG90YWxoaXQrPVEuYnlGaWxlW2ldLmxlbmd0aDtcblx0XHRcdGZpbGVXaXRoSGl0cy5wdXNoKGkpO1xuXHRcdFx0cmFuZ2UubmV4dEZpbGVTdGFydD1pO1xuXHRcdFx0aWYgKGZpbGVXaXRoSGl0cy5sZW5ndGg+PWZpbGVjb3VudCkge1xuXHRcdFx0XHRRLmV4Y2VycHRPdmVyZmxvdz10cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdGlmICh0b3RhbGhpdD5yYW5nZS5tYXhoaXQpIHtcblx0XHRcdFx0US5leGNlcnB0T3ZlcmZsb3c9dHJ1ZTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdGlmIChpPj1lbmQpIHsgLy9ubyBtb3JlIGZpbGVcblx0XHRRLmV4Y2VycHRTdG9wPXRydWU7XG5cdH1cblx0cmV0dXJuIGZpbGVXaXRoSGl0cztcbn1cbnZhciByZXN1bHRsaXN0PWZ1bmN0aW9uKGVuZ2luZSxRLG9wdHMsY2IpIHtcblx0dmFyIG91dHB1dD1bXTtcblx0aWYgKCFRLnJhd3Jlc3VsdCB8fCAhUS5yYXdyZXN1bHQubGVuZ3RoKSB7XG5cdFx0Y2Iob3V0cHV0KTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHRpZiAob3B0cy5yYW5nZSkge1xuXHRcdGlmIChvcHRzLnJhbmdlLm1heGhpdCAmJiAhb3B0cy5yYW5nZS5tYXhmaWxlKSB7XG5cdFx0XHRvcHRzLnJhbmdlLm1heGZpbGU9b3B0cy5yYW5nZS5tYXhoaXQ7XG5cdFx0XHRvcHRzLnJhbmdlLm1heHBhZ2U9b3B0cy5yYW5nZS5tYXhoaXQ7XG5cdFx0fVxuXHRcdGlmICghb3B0cy5yYW5nZS5tYXhwYWdlKSBvcHRzLnJhbmdlLm1heHBhZ2U9MTAwO1xuXHRcdGlmICghb3B0cy5yYW5nZS5lbmQpIHtcblx0XHRcdG9wdHMucmFuZ2UuZW5kPU51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXHRcdH1cblx0fVxuXHR2YXIgZmlsZVdpdGhIaXRzPWdldEZpbGVXaXRoSGl0cyhlbmdpbmUsUSxvcHRzLnJhbmdlKTtcblx0aWYgKCFmaWxlV2l0aEhpdHMubGVuZ3RoKSB7XG5cdFx0Y2Iob3V0cHV0KTtcblx0XHRyZXR1cm47XG5cdH1cblxuXHR2YXIgb3V0cHV0PVtdLGZpbGVzPVtdOy8vdGVtcG9yYXJ5IGhvbGRlciBmb3IgcGFnZW5hbWVzXG5cdGZvciAodmFyIGk9MDtpPGZpbGVXaXRoSGl0cy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIG5maWxlPWZpbGVXaXRoSGl0c1tpXTtcblx0XHR2YXIgcGFnZU9mZnNldHM9ZW5naW5lLmdldEZpbGVQYWdlT2Zmc2V0cyhuZmlsZSk7XG5cdFx0dmFyIHBhZ2VOYW1lcz1lbmdpbmUuZ2V0RmlsZVBhZ2VOYW1lcyhuZmlsZSk7XG5cdFx0ZmlsZXNbbmZpbGVdPXtwYWdlT2Zmc2V0czpwYWdlT2Zmc2V0c307XG5cdFx0dmFyIHBhZ2V3aXRoaGl0PXBsaXN0Lmdyb3VwYnlwb3N0aW5nMihRLmJ5RmlsZVsgbmZpbGUgXSwgIHBhZ2VPZmZzZXRzKTtcblx0XHQvL2lmIChwYWdlT2Zmc2V0c1swXT09MSlcblx0XHQvL3BhZ2V3aXRoaGl0LnNoaWZ0KCk7IC8vdGhlIGZpcnN0IGl0ZW0gaXMgbm90IHVzZWQgKDB+US5ieUZpbGVbMF0gKVxuXG5cdFx0Zm9yICh2YXIgaj0wOyBqPHBhZ2V3aXRoaGl0Lmxlbmd0aDtqKyspIHtcblx0XHRcdGlmICghcGFnZXdpdGhoaXRbal0ubGVuZ3RoKSBjb250aW51ZTtcblx0XHRcdC8vdmFyIG9mZnNldHM9cGFnZXdpdGhoaXRbal0ubWFwKGZ1bmN0aW9uKHApe3JldHVybiBwLSBmaWxlT2Zmc2V0c1tpXX0pO1xuXHRcdFx0aWYgKHBhZ2VPZmZzZXRzW2pdPm9wdHMucmFuZ2UuZW5kKSBicmVhaztcblx0XHRcdG91dHB1dC5wdXNoKCAge2ZpbGU6IG5maWxlLCBwYWdlOmosICBwYWdlbmFtZTpwYWdlTmFtZXNbal19KTtcblx0XHRcdGlmIChvdXRwdXQubGVuZ3RoPm9wdHMucmFuZ2UubWF4cGFnZSkgYnJlYWs7XG5cdFx0fVxuXHR9XG5cblx0dmFyIHBhZ2VwYXRocz1vdXRwdXQubWFwKGZ1bmN0aW9uKHApe1xuXHRcdHJldHVybiBbXCJmaWxlQ29udGVudHNcIixwLmZpbGUscC5wYWdlXTtcblx0fSk7XG5cdC8vcHJlcGFyZSB0aGUgdGV4dFxuXHRlbmdpbmUuZ2V0KHBhZ2VwYXRocyxmdW5jdGlvbihwYWdlcyl7XG5cdFx0dmFyIHNlcT0wO1xuXHRcdGlmIChwYWdlcykgZm9yICh2YXIgaT0wO2k8cGFnZXMubGVuZ3RoO2krKykge1xuXHRcdFx0dmFyIHN0YXJ0dnBvcz1maWxlc1tvdXRwdXRbaV0uZmlsZV0ucGFnZU9mZnNldHNbb3V0cHV0W2ldLnBhZ2UtMV07XG5cdFx0XHR2YXIgZW5kdnBvcz1maWxlc1tvdXRwdXRbaV0uZmlsZV0ucGFnZU9mZnNldHNbb3V0cHV0W2ldLnBhZ2VdO1xuXHRcdFx0dmFyIGhsPXt9O1xuXG5cdFx0XHRpZiAob3B0cy5yYW5nZSAmJiBvcHRzLnJhbmdlLnN0YXJ0ICApIHtcblx0XHRcdFx0aWYgKCBzdGFydHZwb3M8b3B0cy5yYW5nZS5zdGFydCkgc3RhcnR2cG9zPW9wdHMucmFuZ2Uuc3RhcnQ7XG5cdFx0XHQvL1x0aWYgKGVuZHZwb3M+b3B0cy5yYW5nZS5lbmQpIGVuZHZwb3M9b3B0cy5yYW5nZS5lbmQ7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmIChvcHRzLm5vaGlnaGxpZ2h0KSB7XG5cdFx0XHRcdGhsLnRleHQ9cGFnZXNbaV07XG5cdFx0XHRcdGhsLmhpdHM9aGl0SW5SYW5nZShRLHN0YXJ0dnBvcyxlbmR2cG9zKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHZhciBvPXtub2NybGY6dHJ1ZSxub3NwYW46dHJ1ZSxcblx0XHRcdFx0XHR0ZXh0OnBhZ2VzW2ldLHN0YXJ0dnBvczpzdGFydHZwb3MsIGVuZHZwb3M6IGVuZHZwb3MsIFxuXHRcdFx0XHRcdFE6USxmdWxsdGV4dDpvcHRzLmZ1bGx0ZXh0fTtcblx0XHRcdFx0aGw9aGlnaGxpZ2h0KFEsbyk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoaGwudGV4dCkge1xuXHRcdFx0XHRvdXRwdXRbaV0udGV4dD1obC50ZXh0O1xuXHRcdFx0XHRvdXRwdXRbaV0uaGl0cz1obC5oaXRzO1xuXHRcdFx0XHRvdXRwdXRbaV0uc2VxPXNlcTtcblx0XHRcdFx0c2VxKz1obC5oaXRzLmxlbmd0aDtcblxuXHRcdFx0XHRvdXRwdXRbaV0uc3RhcnQ9c3RhcnR2cG9zO1x0XHRcdFx0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvdXRwdXRbaV09bnVsbDsgLy9yZW1vdmUgaXRlbSB2cG9zIGxlc3MgdGhhbiBvcHRzLnJhbmdlLnN0YXJ0XG5cdFx0XHR9XG5cdFx0fSBcblx0XHRvdXRwdXQ9b3V0cHV0LmZpbHRlcihmdW5jdGlvbihvKXtyZXR1cm4gbyE9bnVsbH0pO1xuXHRcdGNiKG91dHB1dCk7XG5cdH0pO1xufVxudmFyIGluamVjdFRhZz1mdW5jdGlvbihRLG9wdHMpe1xuXHR2YXIgaGl0cz1vcHRzLmhpdHM7XG5cdHZhciB0YWdzPW9wdHMudGFncztcblx0aWYgKCF0YWdzKSB0YWdzPVtdO1xuXHR2YXIgaGl0Y2xhc3M9b3B0cy5oaXRjbGFzc3x8J2hsJztcblx0dmFyIG91dHB1dD0nJyxPPVtdLGo9MCxrPTA7XG5cdHZhciBzdXJyb3VuZD1vcHRzLnN1cnJvdW5kfHw1O1xuXG5cdHZhciB0b2tlbnM9US50b2tlbml6ZShvcHRzLnRleHQpLnRva2Vucztcblx0dmFyIHZwb3M9b3B0cy52cG9zO1xuXHR2YXIgaT0wLHByZXZpbnJhbmdlPSEhb3B0cy5mdWxsdGV4dCAsaW5yYW5nZT0hIW9wdHMuZnVsbHRleHQ7XG5cdHZhciBoaXRzdGFydD0wLGhpdGVuZD0wLHRhZ3N0YXJ0PTAsdGFnZW5kPTAsdGFnY2xhc3M9XCJcIjtcblx0d2hpbGUgKGk8dG9rZW5zLmxlbmd0aCkge1xuXHRcdHZhciBza2lwPVEuaXNTa2lwKHRva2Vuc1tpXSk7XG5cdFx0dmFyIGhhc2hpdD1mYWxzZTtcblx0XHRpbnJhbmdlPW9wdHMuZnVsbHRleHQgfHwgKGo8aGl0cy5sZW5ndGggJiYgdnBvcytzdXJyb3VuZD49aGl0c1tqXVswXSB8fFxuXHRcdFx0XHQoaj4wICYmIGo8PWhpdHMubGVuZ3RoICYmICBoaXRzW2otMV1bMF0rc3Vycm91bmQqMj49dnBvcykpO1x0XG5cblx0XHRpZiAocHJldmlucmFuZ2UhPWlucmFuZ2UpIHtcblx0XHRcdG91dHB1dCs9b3B0cy5hYnJpZGdlfHxcIi4uLlwiO1xuXHRcdH1cblx0XHRwcmV2aW5yYW5nZT1pbnJhbmdlO1xuXHRcdHZhciB0b2tlbj10b2tlbnNbaV07XG5cdFx0aWYgKG9wdHMubm9jcmxmICYmIHRva2VuPT1cIlxcblwiKSB0b2tlbj1cIlwiO1xuXG5cdFx0aWYgKGlucmFuZ2UgJiYgaTx0b2tlbnMubGVuZ3RoKSB7XG5cdFx0XHRpZiAoc2tpcCkge1xuXHRcdFx0XHRvdXRwdXQrPXRva2VuO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIGNsYXNzZXM9XCJcIjtcdFxuXG5cdFx0XHRcdC8vY2hlY2sgaGl0XG5cdFx0XHRcdGlmIChqPGhpdHMubGVuZ3RoICYmIHZwb3M9PWhpdHNbal1bMF0pIHtcblx0XHRcdFx0XHR2YXIgbnBocmFzZT1oaXRzW2pdWzJdICUgMTAsIHdpZHRoPWhpdHNbal1bMV07XG5cdFx0XHRcdFx0aGl0c3RhcnQ9aGl0c1tqXVswXTtcblx0XHRcdFx0XHRoaXRlbmQ9aGl0c3RhcnQrd2lkdGg7XG5cdFx0XHRcdFx0aisrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0Ly9jaGVjayB0YWdcblx0XHRcdFx0aWYgKGs8dGFncy5sZW5ndGggJiYgdnBvcz09dGFnc1trXVswXSkge1xuXHRcdFx0XHRcdHZhciB3aWR0aD10YWdzW2tdWzFdO1xuXHRcdFx0XHRcdHRhZ3N0YXJ0PXRhZ3Nba11bMF07XG5cdFx0XHRcdFx0dGFnZW5kPXRhZ3N0YXJ0K3dpZHRoO1xuXHRcdFx0XHRcdHRhZ2NsYXNzPXRhZ3Nba11bMl07XG5cdFx0XHRcdFx0aysrO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0aWYgKHZwb3M+PWhpdHN0YXJ0ICYmIHZwb3M8aGl0ZW5kKSBjbGFzc2VzPWhpdGNsYXNzK1wiIFwiK2hpdGNsYXNzK25waHJhc2U7XG5cdFx0XHRcdGlmICh2cG9zPj10YWdzdGFydCAmJiB2cG9zPHRhZ2VuZCkgY2xhc3Nlcys9XCIgXCIrdGFnY2xhc3M7XG5cblx0XHRcdFx0aWYgKGNsYXNzZXMgfHwgIW9wdHMubm9zcGFuKSB7XG5cdFx0XHRcdFx0b3V0cHV0Kz0nPHNwYW4gdnBvcz1cIicrdnBvcysnXCInO1xuXHRcdFx0XHRcdGlmIChjbGFzc2VzKSBjbGFzc2VzPScgY2xhc3M9XCInK2NsYXNzZXMrJ1wiJztcblx0XHRcdFx0XHRvdXRwdXQrPWNsYXNzZXMrJz4nO1xuXHRcdFx0XHRcdG91dHB1dCs9dG9rZW4rJzwvc3Bhbj4nO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdG91dHB1dCs9dG9rZW47XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKCFza2lwKSB2cG9zKys7XG5cdFx0aSsrOyBcblx0fVxuXG5cdE8ucHVzaChvdXRwdXQpO1xuXHRvdXRwdXQ9XCJcIjtcblxuXHRyZXR1cm4gTy5qb2luKFwiXCIpO1xufVxudmFyIGhpZ2hsaWdodD1mdW5jdGlvbihRLG9wdHMpIHtcblx0aWYgKCFvcHRzLnRleHQpIHJldHVybiB7dGV4dDpcIlwiLGhpdHM6W119O1xuXHR2YXIgb3B0PXt0ZXh0Om9wdHMudGV4dCxcblx0XHRoaXRzOm51bGwsYWJyaWRnZTpvcHRzLmFicmlkZ2UsdnBvczpvcHRzLnN0YXJ0dnBvcyxcblx0XHRmdWxsdGV4dDpvcHRzLmZ1bGx0ZXh0LHJlbmRlclRhZ3M6b3B0cy5yZW5kZXJUYWdzLG5vc3BhbjpvcHRzLm5vc3Bhbixub2NybGY6b3B0cy5ub2NybGYsXG5cdH07XG5cblx0b3B0LmhpdHM9aGl0SW5SYW5nZShvcHRzLlEsb3B0cy5zdGFydHZwb3Msb3B0cy5lbmR2cG9zKTtcblx0cmV0dXJuIHt0ZXh0OmluamVjdFRhZyhRLG9wdCksaGl0czpvcHQuaGl0c307XG59XG5cbnZhciBnZXRQYWdlPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaWQscGFnZWlkLGNiKSB7XG5cdHZhciBmaWxlT2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdHZhciBwYWdlcGF0aHM9W1wiZmlsZUNvbnRlbnRzXCIsZmlsZWlkLHBhZ2VpZF07XG5cdHZhciBwYWdlbmFtZXM9ZW5naW5lLmdldEZpbGVQYWdlTmFtZXMoZmlsZWlkKTtcblxuXHRlbmdpbmUuZ2V0KHBhZ2VwYXRocyxmdW5jdGlvbih0ZXh0KXtcblx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbe3RleHQ6dGV4dCxmaWxlOmZpbGVpZCxwYWdlOnBhZ2VpZCxwYWdlbmFtZTpwYWdlbmFtZXNbcGFnZWlkXX1dKTtcblx0fSk7XG59XG5cbnZhciBnZXRQYWdlU3luYz1mdW5jdGlvbihlbmdpbmUsZmlsZWlkLHBhZ2VpZCkge1xuXHR2YXIgZmlsZU9mZnNldHM9ZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHR2YXIgcGFnZXBhdGhzPVtcImZpbGVDb250ZW50c1wiLGZpbGVpZCxwYWdlaWRdO1xuXHR2YXIgcGFnZW5hbWVzPWVuZ2luZS5nZXRGaWxlUGFnZU5hbWVzKGZpbGVpZCk7XG5cblx0dmFyIHRleHQ9ZW5naW5lLmdldChwYWdlcGF0aHMpO1xuXHRyZXR1cm4ge3RleHQ6dGV4dCxmaWxlOmZpbGVpZCxwYWdlOnBhZ2VpZCxwYWdlbmFtZTpwYWdlbmFtZXNbcGFnZWlkXX07XG59XG5cbnZhciBnZXRSYW5nZT1mdW5jdGlvbihlbmdpbmUsc3RhcnQsZW5kLGNiKSB7XG5cdHZhciBmaWxlT2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdC8vdmFyIHBhZ2VwYXRocz1bXCJmaWxlQ29udGVudHNcIixdO1xuXHQvL2ZpbmQgZmlyc3QgcGFnZSBhbmQgbGFzdCBwYWdlXG5cdC8vY3JlYXRlIGdldCBwYXRoc1xuXG59XG5cbnZhciBnZXRGaWxlPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaWQsY2IpIHtcblx0dmFyIGZpbGVuYW1lPWVuZ2luZS5nZXQoXCJmaWxlTmFtZXNcIilbZmlsZWlkXTtcblx0dmFyIHBhZ2VuYW1lcz1lbmdpbmUuZ2V0RmlsZVBhZ2VOYW1lcyhmaWxlaWQpO1xuXHR2YXIgZmlsZXN0YXJ0PWVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKVtmaWxlaWRdO1xuXHR2YXIgb2Zmc2V0cz1lbmdpbmUuZ2V0RmlsZVBhZ2VPZmZzZXRzKGZpbGVpZCk7XG5cdHZhciBwYz0wO1xuXHRlbmdpbmUuZ2V0KFtcImZpbGVDb250ZW50c1wiLGZpbGVpZF0sdHJ1ZSxmdW5jdGlvbihkYXRhKXtcblx0XHR2YXIgdGV4dD1kYXRhLm1hcChmdW5jdGlvbih0LGlkeCkge1xuXHRcdFx0aWYgKGlkeD09MCkgcmV0dXJuIFwiXCI7IFxuXHRcdFx0dmFyIHBiPSc8cGIgbj1cIicrcGFnZW5hbWVzW2lkeF0rJ1wiPjwvcGI+Jztcblx0XHRcdHJldHVybiBwYit0O1xuXHRcdH0pO1xuXHRcdGNiKHt0ZXh0czpkYXRhLHRleHQ6dGV4dC5qb2luKFwiXCIpLHBhZ2VuYW1lczpwYWdlbmFtZXMsZmlsZXN0YXJ0OmZpbGVzdGFydCxvZmZzZXRzOm9mZnNldHMsZmlsZTpmaWxlaWQsZmlsZW5hbWU6ZmlsZW5hbWV9KTsgLy9mb3JjZSBkaWZmZXJlbnQgdG9rZW5cblx0fSk7XG59XG5cbnZhciBoaWdobGlnaHRSYW5nZT1mdW5jdGlvbihRLHN0YXJ0dnBvcyxlbmR2cG9zLG9wdHMsY2Ipe1xuXHQvL25vdCBpbXBsZW1lbnQgeWV0XG59XG5cbnZhciBoaWdobGlnaHRGaWxlPWZ1bmN0aW9uKFEsZmlsZWlkLG9wdHMsY2IpIHtcblx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcblx0XHRjYj1vcHRzO1xuXHR9XG5cblx0aWYgKCFRIHx8ICFRLmVuZ2luZSkgcmV0dXJuIGNiKG51bGwpO1xuXG5cdHZhciBwYWdlT2Zmc2V0cz1RLmVuZ2luZS5nZXRGaWxlUGFnZU9mZnNldHMoZmlsZWlkKTtcblx0dmFyIG91dHB1dD1bXTtcdFxuXHQvL2NvbnNvbGUubG9nKHN0YXJ0dnBvcyxlbmR2cG9zKVxuXHRRLmVuZ2luZS5nZXQoW1wiZmlsZUNvbnRlbnRzXCIsZmlsZWlkXSx0cnVlLGZ1bmN0aW9uKGRhdGEpe1xuXHRcdGlmICghZGF0YSkge1xuXHRcdFx0Y29uc29sZS5lcnJvcihcIndyb25nIGZpbGUgaWRcIixmaWxlaWQpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRmb3IgKHZhciBpPTA7aTxkYXRhLmxlbmd0aC0xO2krKyApe1xuXHRcdFx0XHR2YXIgc3RhcnR2cG9zPXBhZ2VPZmZzZXRzW2ldO1xuXHRcdFx0XHR2YXIgZW5kdnBvcz1wYWdlT2Zmc2V0c1tpKzFdO1xuXHRcdFx0XHR2YXIgcGFnZW5hbWVzPVEuZW5naW5lLmdldEZpbGVQYWdlTmFtZXMoZmlsZWlkKTtcblx0XHRcdFx0dmFyIHBhZ2U9Z2V0UGFnZVN5bmMoUS5lbmdpbmUsIGZpbGVpZCxpKzEpO1xuXHRcdFx0XHRcdHZhciBvcHQ9e3RleHQ6cGFnZS50ZXh0LGhpdHM6bnVsbCx0YWc6J2hsJyx2cG9zOnN0YXJ0dnBvcyxcblx0XHRcdFx0XHRmdWxsdGV4dDp0cnVlLG5vc3BhbjpvcHRzLm5vc3Bhbixub2NybGY6b3B0cy5ub2NybGZ9O1xuXHRcdFx0XHR2YXIgcGFnZW5hbWU9cGFnZW5hbWVzW2krMV07XG5cdFx0XHRcdG9wdC5oaXRzPWhpdEluUmFuZ2UoUSxzdGFydHZwb3MsZW5kdnBvcyk7XG5cdFx0XHRcdHZhciBwYj0nPHBiIG49XCInK3BhZ2VuYW1lKydcIj48L3BiPic7XG5cdFx0XHRcdHZhciB3aXRodGFnPWluamVjdFRhZyhRLG9wdCk7XG5cdFx0XHRcdG91dHB1dC5wdXNoKHBiK3dpdGh0YWcpO1xuXHRcdFx0fVx0XHRcdFxuXHRcdH1cblxuXHRcdGNiLmFwcGx5KFEuZW5naW5lLmNvbnRleHQsW3t0ZXh0Om91dHB1dC5qb2luKFwiXCIpLGZpbGU6ZmlsZWlkfV0pO1xuXHR9KVxufVxudmFyIGhpZ2hsaWdodFBhZ2U9ZnVuY3Rpb24oUSxmaWxlaWQscGFnZWlkLG9wdHMsY2IpIHtcblx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcblx0XHRjYj1vcHRzO1xuXHR9XG5cblx0aWYgKCFRIHx8ICFRLmVuZ2luZSkgcmV0dXJuIGNiKG51bGwpO1xuXHR2YXIgcGFnZU9mZnNldHM9US5lbmdpbmUuZ2V0RmlsZVBhZ2VPZmZzZXRzKGZpbGVpZCk7XG5cdHZhciBzdGFydHZwb3M9cGFnZU9mZnNldHNbcGFnZWlkLTFdO1xuXHR2YXIgZW5kdnBvcz1wYWdlT2Zmc2V0c1twYWdlaWRdO1xuXHR2YXIgcGFnZW5hbWVzPVEuZW5naW5lLmdldEZpbGVQYWdlTmFtZXMoZmlsZWlkKTtcblxuXHR0aGlzLmdldFBhZ2UoUS5lbmdpbmUsZmlsZWlkLHBhZ2VpZCxmdW5jdGlvbihyZXMpe1xuXHRcdHZhciBvcHQ9e3RleHQ6cmVzLnRleHQsaGl0czpudWxsLHZwb3M6c3RhcnR2cG9zLGZ1bGx0ZXh0OnRydWUsXG5cdFx0XHRub3NwYW46b3B0cy5ub3NwYW4sbm9jcmxmOm9wdHMubm9jcmxmfTtcblx0XHRvcHQuaGl0cz1oaXRJblJhbmdlKFEsc3RhcnR2cG9zLGVuZHZwb3MpO1xuXHRcdGlmIChvcHRzLnJlbmRlclRhZ3MpIHtcblx0XHRcdG9wdC50YWdzPXRhZ3NJblJhbmdlKFEsb3B0cy5yZW5kZXJUYWdzLHN0YXJ0dnBvcyxlbmR2cG9zKTtcblx0XHR9XG5cblx0XHR2YXIgcGFnZW5hbWU9cGFnZW5hbWVzW3BhZ2VpZF07XG5cdFx0Y2IuYXBwbHkoUS5lbmdpbmUuY29udGV4dCxbe3RleHQ6aW5qZWN0VGFnKFEsb3B0KSxwYWdlOnBhZ2VpZCxmaWxlOmZpbGVpZCxoaXRzOm9wdC5oaXRzLHBhZ2VuYW1lOnBhZ2VuYW1lfV0pO1xuXHR9KTtcbn1cbm1vZHVsZS5leHBvcnRzPXtyZXN1bHRsaXN0OnJlc3VsdGxpc3QsIFxuXHRoaXRJblJhbmdlOmhpdEluUmFuZ2UsIFxuXHRoaWdobGlnaHRQYWdlOmhpZ2hsaWdodFBhZ2UsXG5cdGdldFBhZ2U6Z2V0UGFnZSxcblx0aGlnaGxpZ2h0RmlsZTpoaWdobGlnaHRGaWxlLFxuXHRnZXRGaWxlOmdldEZpbGVcblx0Ly9oaWdobGlnaHRSYW5nZTpoaWdobGlnaHRSYW5nZSxcbiAgLy9nZXRSYW5nZTpnZXRSYW5nZSxcbn07IiwiLypcbiAgS3NhbmEgU2VhcmNoIEVuZ2luZS5cblxuICBuZWVkIGEgS0RFIGluc3RhbmNlIHRvIGJlIGZ1bmN0aW9uYWxcbiAgXG4qL1xudmFyIGJzZWFyY2g9cmVxdWlyZShcIi4vYnNlYXJjaFwiKTtcbnZhciBkb3NlYXJjaD1yZXF1aXJlKFwiLi9zZWFyY2hcIik7XG5cbnZhciBwcmVwYXJlRW5naW5lRm9yU2VhcmNoPWZ1bmN0aW9uKGVuZ2luZSxjYil7XG5cdGlmIChlbmdpbmUuYW5hbHl6ZXIpcmV0dXJuO1xuXHR2YXIgYW5hbHl6ZXI9cmVxdWlyZShcImtzYW5hLWFuYWx5emVyXCIpO1xuXHR2YXIgY29uZmlnPWVuZ2luZS5nZXQoXCJtZXRhXCIpLmNvbmZpZztcblx0ZW5naW5lLmFuYWx5emVyPWFuYWx5emVyLmdldEFQSShjb25maWcpO1xuXHRlbmdpbmUuZ2V0KFtbXCJ0b2tlbnNcIl0sW1wicG9zdGluZ3NMZW5ndGhcIl1dLGZ1bmN0aW9uKCl7XG5cdFx0Y2IoKTtcblx0fSk7XG59XG52YXIgX3NlYXJjaD1mdW5jdGlvbihlbmdpbmUscSxvcHRzLGNiLGNvbnRleHQpIHtcblx0aWYgKHR5cGVvZiBlbmdpbmU9PVwic3RyaW5nXCIpIHsvL2Jyb3dzZXIgb25seVxuXHRcdHZhciBrZGU9cmVxdWlyZShcImtzYW5hLWRhdGFiYXNlXCIpO1xuXHRcdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7IC8vdXNlciBkaWRuJ3Qgc3VwcGx5IG9wdGlvbnNcblx0XHRcdGlmICh0eXBlb2YgY2I9PVwib2JqZWN0XCIpY29udGV4dD1jYjtcblx0XHRcdGNiPW9wdHM7XG5cdFx0XHRvcHRzPXt9O1xuXHRcdH1cblx0XHRvcHRzLnE9cTtcblx0XHRvcHRzLmRiaWQ9ZW5naW5lO1xuXHRcdGtkZS5vcGVuKG9wdHMuZGJpZCxmdW5jdGlvbihlcnIsZGIpe1xuXHRcdFx0aWYgKGVycikge1xuXHRcdFx0XHRjYihlcnIpO1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cdFx0XHRjb25zb2xlLmxvZyhcIm9wZW5lZFwiLG9wdHMuZGJpZClcblx0XHRcdHByZXBhcmVFbmdpbmVGb3JTZWFyY2goZGIsZnVuY3Rpb24oKXtcblx0XHRcdFx0cmV0dXJuIGRvc2VhcmNoKGRiLHEsb3B0cyxjYik7XHRcblx0XHRcdH0pO1xuXHRcdH0sY29udGV4dCk7XG5cdH0gZWxzZSB7XG5cdFx0cHJlcGFyZUVuZ2luZUZvclNlYXJjaChlbmdpbmUsZnVuY3Rpb24oKXtcblx0XHRcdHJldHVybiBkb3NlYXJjaChlbmdpbmUscSxvcHRzLGNiKTtcdFxuXHRcdH0pO1xuXHR9XG59XG5cbnZhciBfaGlnaGxpZ2h0UGFnZT1mdW5jdGlvbihlbmdpbmUsZmlsZWlkLHBhZ2VpZCxvcHRzLGNiKXtcblx0aWYgKCFvcHRzLnEpIG9wdHMucT1cIlwiOyBcblx0X3NlYXJjaChlbmdpbmUsb3B0cy5xLG9wdHMsZnVuY3Rpb24oUSl7XG5cdFx0YXBpLmV4Y2VycHQuaGlnaGxpZ2h0UGFnZShRLGZpbGVpZCxwYWdlaWQsb3B0cyxjYik7XG5cdH0pO1x0XG59XG52YXIgX2hpZ2hsaWdodFJhbmdlPWZ1bmN0aW9uKGVuZ2luZSxzdGFydCxlbmQsb3B0cyxjYil7XG5cblx0aWYgKG9wdHMucSkge1xuXHRcdF9zZWFyY2goZW5naW5lLG9wdHMucSxvcHRzLGZ1bmN0aW9uKFEpe1xuXHRcdFx0YXBpLmV4Y2VycHQuaGlnaGxpZ2h0UmFuZ2UoUSxzdGFydCxlbmQsb3B0cyxjYik7XG5cdFx0fSk7XG5cdH0gZWxzZSB7XG5cdFx0cHJlcGFyZUVuZ2luZUZvclNlYXJjaChlbmdpbmUsZnVuY3Rpb24oKXtcblx0XHRcdGFwaS5leGNlcnB0LmdldFJhbmdlKGVuZ2luZSxzdGFydCxlbmQsY2IpO1xuXHRcdH0pO1xuXHR9XG59XG52YXIgX2hpZ2hsaWdodEZpbGU9ZnVuY3Rpb24oZW5naW5lLGZpbGVpZCxvcHRzLGNiKXtcblx0aWYgKCFvcHRzLnEpIG9wdHMucT1cIlwiOyBcblx0X3NlYXJjaChlbmdpbmUsb3B0cy5xLG9wdHMsZnVuY3Rpb24oUSl7XG5cdFx0YXBpLmV4Y2VycHQuaGlnaGxpZ2h0RmlsZShRLGZpbGVpZCxvcHRzLGNiKTtcblx0fSk7XG5cdC8qXG5cdH0gZWxzZSB7XG5cdFx0YXBpLmV4Y2VycHQuZ2V0RmlsZShlbmdpbmUsZmlsZWlkLGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFtkYXRhXSk7XG5cdFx0fSk7XG5cdH1cblx0Ki9cbn1cblxudmFyIHZwb3MyZmlsZXBhZ2U9ZnVuY3Rpb24oZW5naW5lLHZwb3MpIHtcbiAgICB2YXIgcGFnZU9mZnNldHM9ZW5naW5lLmdldChcInBhZ2VPZmZzZXRzXCIpO1xuICAgIHZhciBmaWxlT2Zmc2V0cz1lbmdpbmUuZ2V0KFtcImZpbGVPZmZzZXRzXCJdKTtcbiAgICB2YXIgcGFnZU5hbWVzPWVuZ2luZS5nZXQoXCJwYWdlTmFtZXNcIik7XG4gICAgdmFyIGZpbGVpZD1ic2VhcmNoKGZpbGVPZmZzZXRzLHZwb3MrMSx0cnVlKTtcbiAgICBmaWxlaWQtLTtcbiAgICB2YXIgcGFnZWlkPWJzZWFyY2gocGFnZU9mZnNldHMsdnBvcysxLHRydWUpO1xuXHR2YXIgcmFuZ2U9ZW5naW5lLmdldEZpbGVSYW5nZShmaWxlaWQpO1xuXHRwYWdlaWQtPXJhbmdlLnN0YXJ0O1xuICAgIHJldHVybiB7ZmlsZTpmaWxlaWQscGFnZTpwYWdlaWR9O1xufVxudmFyIGFwaT17XG5cdHNlYXJjaDpfc2VhcmNoXG4vL1x0LGNvbmNvcmRhbmNlOnJlcXVpcmUoXCIuL2NvbmNvcmRhbmNlXCIpXG4vL1x0LHJlZ2V4OnJlcXVpcmUoXCIuL3JlZ2V4XCIpXG5cdCxoaWdobGlnaHRQYWdlOl9oaWdobGlnaHRQYWdlXG5cdCxoaWdobGlnaHRGaWxlOl9oaWdobGlnaHRGaWxlXG4vL1x0LGhpZ2hsaWdodFJhbmdlOl9oaWdobGlnaHRSYW5nZVxuXHQsZXhjZXJwdDpyZXF1aXJlKFwiLi9leGNlcnB0XCIpXG5cdCx2cG9zMmZpbGVwYWdlOnZwb3MyZmlsZXBhZ2Vcbn1cbm1vZHVsZS5leHBvcnRzPWFwaTsiLCJcbnZhciB1bnBhY2sgPSBmdW5jdGlvbiAoYXIpIHsgLy8gdW5wYWNrIHZhcmlhYmxlIGxlbmd0aCBpbnRlZ2VyIGxpc3RcbiAgdmFyIHIgPSBbXSxcbiAgaSA9IDAsXG4gIHYgPSAwO1xuICBkbyB7XG5cdHZhciBzaGlmdCA9IDA7XG5cdGRvIHtcblx0ICB2ICs9ICgoYXJbaV0gJiAweDdGKSA8PCBzaGlmdCk7XG5cdCAgc2hpZnQgKz0gNztcblx0fSB3aGlsZSAoYXJbKytpXSAmIDB4ODApO1xuXHRyW3IubGVuZ3RoXT12O1xuICB9IHdoaWxlIChpIDwgYXIubGVuZ3RoKTtcbiAgcmV0dXJuIHI7XG59XG5cbi8qXG4gICBhcnI6ICBbMSwxLDEsMSwxLDEsMSwxLDFdXG4gICBsZXZlbHM6IFswLDEsMSwyLDIsMCwxLDJdXG4gICBvdXRwdXQ6IFs1LDEsMywxLDEsMywxLDFdXG4qL1xuXG52YXIgZ3JvdXBzdW09ZnVuY3Rpb24oYXJyLGxldmVscykge1xuICBpZiAoYXJyLmxlbmd0aCE9bGV2ZWxzLmxlbmd0aCsxKSByZXR1cm4gbnVsbDtcbiAgdmFyIHN0YWNrPVtdO1xuICB2YXIgb3V0cHV0PW5ldyBBcnJheShsZXZlbHMubGVuZ3RoKTtcbiAgZm9yICh2YXIgaT0wO2k8bGV2ZWxzLmxlbmd0aDtpKyspIG91dHB1dFtpXT0wO1xuICBmb3IgKHZhciBpPTE7aTxhcnIubGVuZ3RoO2krKykgeyAvL2ZpcnN0IG9uZSBvdXQgb2YgdG9jIHNjb3BlLCBpZ25vcmVkXG4gICAgaWYgKHN0YWNrLmxlbmd0aD5sZXZlbHNbaS0xXSkge1xuICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aD5sZXZlbHNbaS0xXSkgc3RhY2sucG9wKCk7XG4gICAgfVxuICAgIHN0YWNrLnB1c2goaS0xKTtcbiAgICBmb3IgKHZhciBqPTA7ajxzdGFjay5sZW5ndGg7aisrKSB7XG4gICAgICBvdXRwdXRbc3RhY2tbal1dKz1hcnJbaV07XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXRwdXQ7XG59XG4vKiBhcnI9IDEgLCAyICwgMyAsNCAsNSw2LDcgLy90b2tlbiBwb3N0aW5nXG4gIHBvc3Rpbmc9IDMgLCA1ICAvL3RhZyBwb3N0aW5nXG4gIG91dCA9IDMgLCAyLCAyXG4qL1xudmFyIGNvdW50Ynlwb3N0aW5nID0gZnVuY3Rpb24gKGFyciwgcG9zdGluZykge1xuICBpZiAoIXBvc3RpbmcubGVuZ3RoKSByZXR1cm4gW2Fyci5sZW5ndGhdO1xuICB2YXIgb3V0PVtdO1xuICBmb3IgKHZhciBpPTA7aTxwb3N0aW5nLmxlbmd0aDtpKyspIG91dFtpXT0wO1xuICBvdXRbcG9zdGluZy5sZW5ndGhdPTA7XG4gIHZhciBwPTAsaT0wLGxhc3RpPTA7XG4gIHdoaWxlIChpPGFyci5sZW5ndGggJiYgcDxwb3N0aW5nLmxlbmd0aCkge1xuICAgIGlmIChhcnJbaV08PXBvc3RpbmdbcF0pIHtcbiAgICAgIHdoaWxlIChwPHBvc3RpbmcubGVuZ3RoICYmIGk8YXJyLmxlbmd0aCAmJiBhcnJbaV08PXBvc3RpbmdbcF0pIHtcbiAgICAgICAgb3V0W3BdKys7XG4gICAgICAgIGkrKztcbiAgICAgIH0gICAgICBcbiAgICB9IFxuICAgIHArKztcbiAgfVxuICBvdXRbcG9zdGluZy5sZW5ndGhdID0gYXJyLmxlbmd0aC1pOyAvL3JlbWFpbmluZ1xuICByZXR1cm4gb3V0O1xufVxuXG52YXIgZ3JvdXBieXBvc3Rpbmc9ZnVuY3Rpb24oYXJyLGdwb3N0aW5nKSB7IC8vcmVsYXRpdmUgdnBvc1xuICBpZiAoIWdwb3N0aW5nLmxlbmd0aCkgcmV0dXJuIFthcnIubGVuZ3RoXTtcbiAgdmFyIG91dD1bXTtcbiAgZm9yICh2YXIgaT0wO2k8PWdwb3N0aW5nLmxlbmd0aDtpKyspIG91dFtpXT1bXTtcbiAgXG4gIHZhciBwPTAsaT0wLGxhc3RpPTA7XG4gIHdoaWxlIChpPGFyci5sZW5ndGggJiYgcDxncG9zdGluZy5sZW5ndGgpIHtcbiAgICBpZiAoYXJyW2ldPGdwb3N0aW5nW3BdKSB7XG4gICAgICB3aGlsZSAocDxncG9zdGluZy5sZW5ndGggJiYgaTxhcnIubGVuZ3RoICYmIGFycltpXTxncG9zdGluZ1twXSkge1xuICAgICAgICB2YXIgc3RhcnQ9MDtcbiAgICAgICAgaWYgKHA+MCkgc3RhcnQ9Z3Bvc3RpbmdbcC0xXTtcbiAgICAgICAgb3V0W3BdLnB1c2goYXJyW2krK10tc3RhcnQpOyAgLy8gcmVsYXRpdmVcbiAgICAgIH0gICAgICBcbiAgICB9IFxuICAgIHArKztcbiAgfVxuICAvL3JlbWFpbmluZ1xuICB3aGlsZShpPGFyci5sZW5ndGgpIG91dFtvdXQubGVuZ3RoLTFdLnB1c2goYXJyW2krK10tZ3Bvc3RpbmdbZ3Bvc3RpbmcubGVuZ3RoLTFdKTtcbiAgcmV0dXJuIG91dDtcbn1cbnZhciBncm91cGJ5cG9zdGluZzI9ZnVuY3Rpb24oYXJyLGdwb3N0aW5nKSB7IC8vYWJzb2x1dGUgdnBvc1xuICBpZiAoIWFyciB8fCAhYXJyLmxlbmd0aCkgcmV0dXJuIFtdO1xuICBpZiAoIWdwb3N0aW5nLmxlbmd0aCkgcmV0dXJuIFthcnIubGVuZ3RoXTtcbiAgdmFyIG91dD1bXTtcbiAgZm9yICh2YXIgaT0wO2k8PWdwb3N0aW5nLmxlbmd0aDtpKyspIG91dFtpXT1bXTtcbiAgXG4gIHZhciBwPTAsaT0wLGxhc3RpPTA7XG4gIHdoaWxlIChpPGFyci5sZW5ndGggJiYgcDxncG9zdGluZy5sZW5ndGgpIHtcbiAgICBpZiAoYXJyW2ldPGdwb3N0aW5nW3BdKSB7XG4gICAgICB3aGlsZSAocDxncG9zdGluZy5sZW5ndGggJiYgaTxhcnIubGVuZ3RoICYmIGFycltpXTxncG9zdGluZ1twXSkge1xuICAgICAgICB2YXIgc3RhcnQ9MDtcbiAgICAgICAgaWYgKHA+MCkgc3RhcnQ9Z3Bvc3RpbmdbcC0xXTsgLy9hYnNvbHV0ZVxuICAgICAgICBvdXRbcF0ucHVzaChhcnJbaSsrXSk7XG4gICAgICB9ICAgICAgXG4gICAgfSBcbiAgICBwKys7XG4gIH1cbiAgLy9yZW1haW5pbmdcbiAgd2hpbGUoaTxhcnIubGVuZ3RoKSBvdXRbb3V0Lmxlbmd0aC0xXS5wdXNoKGFycltpKytdLWdwb3N0aW5nW2dwb3N0aW5nLmxlbmd0aC0xXSk7XG4gIHJldHVybiBvdXQ7XG59XG52YXIgZ3JvdXBieWJsb2NrMiA9IGZ1bmN0aW9uKGFyLCBudG9rZW4sc2xvdHNoaWZ0LG9wdHMpIHtcbiAgaWYgKCFhci5sZW5ndGgpIHJldHVybiBbe30se31dO1xuICBcbiAgc2xvdHNoaWZ0ID0gc2xvdHNoaWZ0IHx8IDE2O1xuICB2YXIgZyA9IE1hdGgucG93KDIsc2xvdHNoaWZ0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgciA9IHt9LCBudG9rZW5zPXt9O1xuICB2YXIgZ3JvdXBjb3VudD0wO1xuICBkbyB7XG4gICAgdmFyIGdyb3VwID0gTWF0aC5mbG9vcihhcltpXSAvIGcpIDtcbiAgICBpZiAoIXJbZ3JvdXBdKSB7XG4gICAgICByW2dyb3VwXSA9IFtdO1xuICAgICAgbnRva2Vuc1tncm91cF09W107XG4gICAgICBncm91cGNvdW50Kys7XG4gICAgfVxuICAgIHJbZ3JvdXBdLnB1c2goYXJbaV0gJSBnKTtcbiAgICBudG9rZW5zW2dyb3VwXS5wdXNoKG50b2tlbltpXSk7XG4gICAgaSsrO1xuICB9IHdoaWxlIChpIDwgYXIubGVuZ3RoKTtcbiAgaWYgKG9wdHMpIG9wdHMuZ3JvdXBjb3VudD1ncm91cGNvdW50O1xuICByZXR1cm4gW3IsbnRva2Vuc107XG59XG52YXIgZ3JvdXBieXNsb3QgPSBmdW5jdGlvbiAoYXIsIHNsb3RzaGlmdCwgb3B0cykge1xuICBpZiAoIWFyLmxlbmd0aClcblx0cmV0dXJuIHt9O1xuICBcbiAgc2xvdHNoaWZ0ID0gc2xvdHNoaWZ0IHx8IDE2O1xuICB2YXIgZyA9IE1hdGgucG93KDIsc2xvdHNoaWZ0KTtcbiAgdmFyIGkgPSAwO1xuICB2YXIgciA9IHt9O1xuICB2YXIgZ3JvdXBjb3VudD0wO1xuICBkbyB7XG5cdHZhciBncm91cCA9IE1hdGguZmxvb3IoYXJbaV0gLyBnKSA7XG5cdGlmICghcltncm91cF0pIHtcblx0ICByW2dyb3VwXSA9IFtdO1xuXHQgIGdyb3VwY291bnQrKztcblx0fVxuXHRyW2dyb3VwXS5wdXNoKGFyW2ldICUgZyk7XG5cdGkrKztcbiAgfSB3aGlsZSAoaSA8IGFyLmxlbmd0aCk7XG4gIGlmIChvcHRzKSBvcHRzLmdyb3VwY291bnQ9Z3JvdXBjb3VudDtcbiAgcmV0dXJuIHI7XG59XG4vKlxudmFyIGlkZW50aXR5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn07XG52YXIgc29ydGVkSW5kZXggPSBmdW5jdGlvbiAoYXJyYXksIG9iaiwgaXRlcmF0b3IpIHsgLy90YWtlbiBmcm9tIHVuZGVyc2NvcmVcbiAgaXRlcmF0b3IgfHwgKGl0ZXJhdG9yID0gaWRlbnRpdHkpO1xuICB2YXIgbG93ID0gMCxcbiAgaGlnaCA9IGFycmF5Lmxlbmd0aDtcbiAgd2hpbGUgKGxvdyA8IGhpZ2gpIHtcblx0dmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxO1xuXHRpdGVyYXRvcihhcnJheVttaWRdKSA8IGl0ZXJhdG9yKG9iaikgPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgfVxuICByZXR1cm4gbG93O1xufTsqL1xuXG52YXIgaW5kZXhPZlNvcnRlZCA9IGZ1bmN0aW9uIChhcnJheSwgb2JqKSB7IFxuICB2YXIgbG93ID0gMCxcbiAgaGlnaCA9IGFycmF5Lmxlbmd0aC0xO1xuICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4gMTtcbiAgICBhcnJheVttaWRdIDwgb2JqID8gbG93ID0gbWlkICsgMSA6IGhpZ2ggPSBtaWQ7XG4gIH1cbiAgcmV0dXJuIGxvdztcbn07XG52YXIgcGxoZWFkPWZ1bmN0aW9uKHBsLCBwbHRhZywgb3B0cykge1xuICBvcHRzPW9wdHN8fHt9O1xuICBvcHRzLm1heD1vcHRzLm1heHx8MTtcbiAgdmFyIG91dD1bXTtcbiAgaWYgKHBsdGFnLmxlbmd0aDxwbC5sZW5ndGgpIHtcbiAgICBmb3IgKHZhciBpPTA7aTxwbHRhZy5sZW5ndGg7aSsrKSB7XG4gICAgICAgayA9IGluZGV4T2ZTb3J0ZWQocGwsIHBsdGFnW2ldKTtcbiAgICAgICBpZiAoaz4tMSAmJiBrPHBsLmxlbmd0aCkge1xuICAgICAgICBpZiAocGxba109PXBsdGFnW2ldKSB7XG4gICAgICAgICAgb3V0W291dC5sZW5ndGhdPXBsdGFnW2ldO1xuICAgICAgICAgIGlmIChvdXQubGVuZ3RoPj1vcHRzLm1heCkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaT0wO2k8cGwubGVuZ3RoO2krKykge1xuICAgICAgIGsgPSBpbmRleE9mU29ydGVkKHBsdGFnLCBwbFtpXSk7XG4gICAgICAgaWYgKGs+LTEgJiYgazxwbHRhZy5sZW5ndGgpIHtcbiAgICAgICAgaWYgKHBsdGFnW2tdPT1wbFtpXSkge1xuICAgICAgICAgIG91dFtvdXQubGVuZ3RoXT1wbHRhZ1trXTtcbiAgICAgICAgICBpZiAob3V0Lmxlbmd0aD49b3B0cy5tYXgpIGJyZWFrO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBvdXQ7XG59XG4vKlxuIHBsMiBvY2N1ciBhZnRlciBwbDEsIFxuIHBsMj49cGwxK21pbmRpc1xuIHBsMjw9cGwxK21heGRpc1xuKi9cbnZhciBwbGZvbGxvdzIgPSBmdW5jdGlvbiAocGwxLCBwbDIsIG1pbmRpcywgbWF4ZGlzKSB7XG4gIHZhciByID0gW10saT0wO1xuICB2YXIgc3dhcCA9IDA7XG4gIFxuICB3aGlsZSAoaTxwbDEubGVuZ3RoKXtcbiAgICB2YXIgayA9IGluZGV4T2ZTb3J0ZWQocGwyLCBwbDFbaV0gKyBtaW5kaXMpO1xuICAgIHZhciB0ID0gKHBsMltrXSA+PSAocGwxW2ldICttaW5kaXMpICYmIHBsMltrXTw9KHBsMVtpXSttYXhkaXMpKSA/IGsgOiAtMTtcbiAgICBpZiAodCA+IC0xKSB7XG4gICAgICByW3IubGVuZ3RoXT1wbDFbaV07XG4gICAgICBpKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrPj1wbDIubGVuZ3RoKSBicmVhaztcbiAgICAgIHZhciBrMj1pbmRleE9mU29ydGVkIChwbDEscGwyW2tdLW1heGRpcyk7XG4gICAgICBpZiAoazI+aSkge1xuICAgICAgICB2YXIgdCA9IChwbDJba10gPj0gKHBsMVtpXSArbWluZGlzKSAmJiBwbDJba108PShwbDFbaV0rbWF4ZGlzKSkgPyBrIDogLTE7XG4gICAgICAgIGlmICh0Pi0xKSByW3IubGVuZ3RoXT1wbDFbazJdO1xuICAgICAgICBpPWsyO1xuICAgICAgfSBlbHNlIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cblxudmFyIHBsbm90Zm9sbG93MiA9IGZ1bmN0aW9uIChwbDEsIHBsMiwgbWluZGlzLCBtYXhkaXMpIHtcbiAgdmFyIHIgPSBbXSxpPTA7XG4gIFxuICB3aGlsZSAoaTxwbDEubGVuZ3RoKXtcbiAgICB2YXIgayA9IGluZGV4T2ZTb3J0ZWQocGwyLCBwbDFbaV0gKyBtaW5kaXMpO1xuICAgIHZhciB0ID0gKHBsMltrXSA+PSAocGwxW2ldICttaW5kaXMpICYmIHBsMltrXTw9KHBsMVtpXSttYXhkaXMpKSA/IGsgOiAtMTtcbiAgICBpZiAodCA+IC0xKSB7XG4gICAgICBpKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrPj1wbDIubGVuZ3RoKSB7XG4gICAgICAgIHI9ci5jb25jYXQocGwxLnNsaWNlKGkpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgazI9aW5kZXhPZlNvcnRlZCAocGwxLHBsMltrXS1tYXhkaXMpO1xuICAgICAgICBpZiAoazI+aSkge1xuICAgICAgICAgIHI9ci5jb25jYXQocGwxLnNsaWNlKGksazIpKTtcbiAgICAgICAgICBpPWsyO1xuICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufVxuLyogdGhpcyBpcyBpbmNvcnJlY3QgKi9cbnZhciBwbGZvbGxvdyA9IGZ1bmN0aW9uIChwbDEsIHBsMiwgZGlzdGFuY2UpIHtcbiAgdmFyIHIgPSBbXSxpPTA7XG5cbiAgd2hpbGUgKGk8cGwxLmxlbmd0aCl7XG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgZGlzdGFuY2UpO1xuICAgIHZhciB0ID0gKHBsMltrXSA9PT0gKHBsMVtpXSArIGRpc3RhbmNlKSkgPyBrIDogLTE7XG4gICAgaWYgKHQgPiAtMSkge1xuICAgICAgci5wdXNoKHBsMVtpXSk7XG4gICAgICBpKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrPj1wbDIubGVuZ3RoKSBicmVhaztcbiAgICAgIHZhciBrMj1pbmRleE9mU29ydGVkIChwbDEscGwyW2tdLWRpc3RhbmNlKTtcbiAgICAgIGlmIChrMj5pKSB7XG4gICAgICAgIHQgPSAocGwyW2tdID09PSAocGwxW2syXSArIGRpc3RhbmNlKSkgPyBrIDogLTE7XG4gICAgICAgIGlmICh0Pi0xKSB7XG4gICAgICAgICAgIHIucHVzaChwbDFbazJdKTtcbiAgICAgICAgICAgazIrKztcbiAgICAgICAgfVxuICAgICAgICBpPWsyO1xuICAgICAgfSBlbHNlIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cbnZhciBwbG5vdGZvbGxvdyA9IGZ1bmN0aW9uIChwbDEsIHBsMiwgZGlzdGFuY2UpIHtcbiAgdmFyIHIgPSBbXTtcbiAgdmFyIHIgPSBbXSxpPTA7XG4gIHZhciBzd2FwID0gMDtcbiAgXG4gIHdoaWxlIChpPHBsMS5sZW5ndGgpe1xuICAgIHZhciBrID0gaW5kZXhPZlNvcnRlZChwbDIsIHBsMVtpXSArIGRpc3RhbmNlKTtcbiAgICB2YXIgdCA9IChwbDJba10gPT09IChwbDFbaV0gKyBkaXN0YW5jZSkpID8gayA6IC0xO1xuICAgIGlmICh0ID4gLTEpIHsgXG4gICAgICBpKys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChrPj1wbDIubGVuZ3RoKSB7XG4gICAgICAgIHI9ci5jb25jYXQocGwxLnNsaWNlKGkpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgazI9aW5kZXhPZlNvcnRlZCAocGwxLHBsMltrXS1kaXN0YW5jZSk7XG4gICAgICAgIGlmIChrMj5pKSB7XG4gICAgICAgICAgcj1yLmNvbmNhdChwbDEuc2xpY2UoaSxrMikpO1xuICAgICAgICAgIGk9azI7XG4gICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG52YXIgcGxhbmQgPSBmdW5jdGlvbiAocGwxLCBwbDIsIGRpc3RhbmNlKSB7XG4gIHZhciByID0gW107XG4gIHZhciBzd2FwID0gMDtcbiAgXG4gIGlmIChwbDEubGVuZ3RoID4gcGwyLmxlbmd0aCkgeyAvL3N3YXAgZm9yIGZhc3RlciBjb21wYXJlXG4gICAgdmFyIHQgPSBwbDI7XG4gICAgcGwyID0gcGwxO1xuICAgIHBsMSA9IHQ7XG4gICAgc3dhcCA9IGRpc3RhbmNlO1xuICAgIGRpc3RhbmNlID0gLWRpc3RhbmNlO1xuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGwxLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgZGlzdGFuY2UpO1xuICAgIHZhciB0ID0gKHBsMltrXSA9PT0gKHBsMVtpXSArIGRpc3RhbmNlKSkgPyBrIDogLTE7XG4gICAgaWYgKHQgPiAtMSkge1xuICAgICAgci5wdXNoKHBsMVtpXSAtIHN3YXApO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cbnZhciBjb21iaW5lPWZ1bmN0aW9uIChwb3N0aW5ncykge1xuICB2YXIgb3V0PVtdO1xuICBmb3IgKHZhciBpIGluIHBvc3RpbmdzKSB7XG4gICAgb3V0PW91dC5jb25jYXQocG9zdGluZ3NbaV0pO1xuICB9XG4gIG91dC5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGEtYn0pO1xuICByZXR1cm4gb3V0O1xufVxuXG52YXIgdW5pcXVlID0gZnVuY3Rpb24oYXIpe1xuICAgaWYgKCFhciB8fCAhYXIubGVuZ3RoKSByZXR1cm4gW107XG4gICB2YXIgdSA9IHt9LCBhID0gW107XG4gICBmb3IodmFyIGkgPSAwLCBsID0gYXIubGVuZ3RoOyBpIDwgbDsgKytpKXtcbiAgICBpZih1Lmhhc093blByb3BlcnR5KGFyW2ldKSkgY29udGludWU7XG4gICAgYS5wdXNoKGFyW2ldKTtcbiAgICB1W2FyW2ldXSA9IDE7XG4gICB9XG4gICByZXR1cm4gYTtcbn1cblxuXG5cbnZhciBwbHBocmFzZSA9IGZ1bmN0aW9uIChwb3N0aW5ncyxvcHMpIHtcbiAgdmFyIHIgPSBbXTtcbiAgZm9yICh2YXIgaT0wO2k8cG9zdGluZ3MubGVuZ3RoO2krKykge1xuICBcdGlmICghcG9zdGluZ3NbaV0pICByZXR1cm4gW107XG4gIFx0aWYgKDAgPT09IGkpIHtcbiAgXHQgIHIgPSBwb3N0aW5nc1swXTtcbiAgXHR9IGVsc2Uge1xuICAgICAgaWYgKG9wc1tpXT09J2FuZG5vdCcpIHtcbiAgICAgICAgciA9IHBsbm90Zm9sbG93KHIsIHBvc3RpbmdzW2ldLCBpKTsgIFxuICAgICAgfWVsc2Uge1xuICAgICAgICByID0gcGxhbmQociwgcG9zdGluZ3NbaV0sIGkpOyAgXG4gICAgICB9XG4gIFx0fVxuICB9XG4gIFxuICByZXR1cm4gcjtcbn1cbi8vcmV0dXJuIGFuIGFycmF5IG9mIGdyb3VwIGhhdmluZyBhbnkgb2YgcGwgaXRlbVxudmFyIG1hdGNoUG9zdGluZz1mdW5jdGlvbihwbCxndXBsLHN0YXJ0LGVuZCkge1xuICBzdGFydD1zdGFydHx8MDtcbiAgZW5kPWVuZHx8LTE7XG4gIGlmIChlbmQ9PS0xKSBlbmQ9TWF0aC5wb3coMiwgNTMpOyAvLyBtYXggaW50ZWdlciB2YWx1ZVxuXG4gIHZhciBjb3VudD0wLCBpID0gaj0gMCwgIHJlc3VsdCA9IFtdICx2PTA7XG4gIHZhciBkb2NzPVtdLCBmcmVxPVtdO1xuICBpZiAoIXBsKSByZXR1cm4ge2RvY3M6W10sZnJlcTpbXX07XG4gIHdoaWxlKCBpIDwgcGwubGVuZ3RoICYmIGogPCBndXBsLmxlbmd0aCApe1xuICAgICBpZiAocGxbaV0gPCBndXBsW2pdICl7IFxuICAgICAgIGNvdW50Kys7XG4gICAgICAgdj1wbFtpXTtcbiAgICAgICBpKys7IFxuICAgICB9IGVsc2Uge1xuICAgICAgIGlmIChjb3VudCkge1xuICAgICAgICBpZiAodj49c3RhcnQgJiYgdjxlbmQpIHtcbiAgICAgICAgICBkb2NzLnB1c2goaik7XG4gICAgICAgICAgZnJlcS5wdXNoKGNvdW50KTsgICAgICAgICAgXG4gICAgICAgIH1cbiAgICAgICB9XG4gICAgICAgaisrO1xuICAgICAgIGNvdW50PTA7XG4gICAgIH1cbiAgfVxuICBpZiAoY291bnQgJiYgajxndXBsLmxlbmd0aCAmJiB2Pj1zdGFydCAmJiB2PGVuZCkge1xuICAgIGRvY3MucHVzaChqKTtcbiAgICBmcmVxLnB1c2goY291bnQpO1xuICAgIGNvdW50PTA7XG4gIH1cbiAgZWxzZSB7XG4gICAgd2hpbGUgKGo9PWd1cGwubGVuZ3RoICYmIGk8cGwubGVuZ3RoICYmIHBsW2ldID49IGd1cGxbZ3VwbC5sZW5ndGgtMV0pIHtcbiAgICAgIGkrKztcbiAgICAgIGNvdW50Kys7XG4gICAgfVxuICAgIGlmICh2Pj1zdGFydCAmJiB2PGVuZCkge1xuICAgICAgZG9jcy5wdXNoKGopO1xuICAgICAgZnJlcS5wdXNoKGNvdW50KTsgICAgICBcbiAgICB9XG4gIH0gXG4gIHJldHVybiB7ZG9jczpkb2NzLGZyZXE6ZnJlcX07XG59XG5cbnZhciB0cmltPWZ1bmN0aW9uKGFycixzdGFydCxlbmQpIHtcbiAgdmFyIHM9aW5kZXhPZlNvcnRlZChhcnIsc3RhcnQpO1xuICB2YXIgZT1pbmRleE9mU29ydGVkKGFycixlbmQpO1xuICByZXR1cm4gYXJyLnNsaWNlKHMsZSsxKTtcbn1cbnZhciBwbGlzdD17fTtcbnBsaXN0LnVucGFjaz11bnBhY2s7XG5wbGlzdC5wbHBocmFzZT1wbHBocmFzZTtcbnBsaXN0LnBsaGVhZD1wbGhlYWQ7XG5wbGlzdC5wbGZvbGxvdzI9cGxmb2xsb3cyO1xucGxpc3QucGxub3Rmb2xsb3cyPXBsbm90Zm9sbG93MjtcbnBsaXN0LnBsZm9sbG93PXBsZm9sbG93O1xucGxpc3QucGxub3Rmb2xsb3c9cGxub3Rmb2xsb3c7XG5wbGlzdC51bmlxdWU9dW5pcXVlO1xucGxpc3QuaW5kZXhPZlNvcnRlZD1pbmRleE9mU29ydGVkO1xucGxpc3QubWF0Y2hQb3N0aW5nPW1hdGNoUG9zdGluZztcbnBsaXN0LnRyaW09dHJpbTtcblxucGxpc3QuZ3JvdXBieXNsb3Q9Z3JvdXBieXNsb3Q7XG5wbGlzdC5ncm91cGJ5YmxvY2syPWdyb3VwYnlibG9jazI7XG5wbGlzdC5jb3VudGJ5cG9zdGluZz1jb3VudGJ5cG9zdGluZztcbnBsaXN0Lmdyb3VwYnlwb3N0aW5nPWdyb3VwYnlwb3N0aW5nO1xucGxpc3QuZ3JvdXBieXBvc3RpbmcyPWdyb3VwYnlwb3N0aW5nMjtcbnBsaXN0Lmdyb3Vwc3VtPWdyb3Vwc3VtO1xucGxpc3QuY29tYmluZT1jb21iaW5lO1xubW9kdWxlLmV4cG9ydHM9cGxpc3Q7IiwiLyogVE9ETyBzb3J0ZWQgdG9rZW5zICovXG52YXIgcGxpc3Q9cmVxdWlyZShcIi4vcGxpc3RcIik7XG52YXIgYm9vbHNlYXJjaD1yZXF1aXJlKFwiLi9ib29sc2VhcmNoXCIpO1xudmFyIGV4Y2VycHQ9cmVxdWlyZShcIi4vZXhjZXJwdFwiKTtcbnZhciBwYXJzZVRlcm0gPSBmdW5jdGlvbihlbmdpbmUscmF3LG9wdHMpIHtcblx0aWYgKCFyYXcpIHJldHVybjtcblx0dmFyIHJlcz17cmF3OnJhdyx2YXJpYW50czpbXSx0ZXJtOicnLG9wOicnfTtcblx0dmFyIHRlcm09cmF3LCBvcD0wO1xuXHR2YXIgZmlyc3RjaGFyPXRlcm1bMF07XG5cdHZhciB0ZXJtcmVnZXg9XCJcIjtcblx0aWYgKGZpcnN0Y2hhcj09Jy0nKSB7XG5cdFx0dGVybT10ZXJtLnN1YnN0cmluZygxKTtcblx0XHRmaXJzdGNoYXI9dGVybVswXTtcblx0XHRyZXMuZXhjbHVkZT10cnVlOyAvL2V4Y2x1ZGVcblx0fVxuXHR0ZXJtPXRlcm0udHJpbSgpO1xuXHR2YXIgbGFzdGNoYXI9dGVybVt0ZXJtLmxlbmd0aC0xXTtcblx0dGVybT1lbmdpbmUuYW5hbHl6ZXIubm9ybWFsaXplKHRlcm0pO1xuXHRcblx0aWYgKHRlcm0uaW5kZXhPZihcIiVcIik+LTEpIHtcblx0XHR2YXIgdGVybXJlZ2V4PVwiXlwiK3Rlcm0ucmVwbGFjZSgvJSsvZyxcIi4rXCIpK1wiJFwiO1xuXHRcdGlmIChmaXJzdGNoYXI9PVwiJVwiKSBcdHRlcm1yZWdleD1cIi4rXCIrdGVybXJlZ2V4LnN1YnN0cigxKTtcblx0XHRpZiAobGFzdGNoYXI9PVwiJVwiKSBcdHRlcm1yZWdleD10ZXJtcmVnZXguc3Vic3RyKDAsdGVybXJlZ2V4Lmxlbmd0aC0xKStcIi4rXCI7XG5cdH1cblxuXHRpZiAodGVybXJlZ2V4KSB7XG5cdFx0cmVzLnZhcmlhbnRzPWV4cGFuZFRlcm0oZW5naW5lLHRlcm1yZWdleCk7XG5cdH1cblxuXHRyZXMua2V5PXRlcm07XG5cdHJldHVybiByZXM7XG59XG52YXIgZXhwYW5kVGVybT1mdW5jdGlvbihlbmdpbmUscmVnZXgpIHtcblx0dmFyIHI9bmV3IFJlZ0V4cChyZWdleCk7XG5cdHZhciB0b2tlbnM9ZW5naW5lLmdldChcInRva2Vuc1wiKTtcblx0dmFyIHBvc3RpbmdzTGVuZ3RoPWVuZ2luZS5nZXQoXCJwb3N0aW5nc0xlbmd0aFwiKTtcblx0aWYgKCFwb3N0aW5nc0xlbmd0aCkgcG9zdGluZ3NMZW5ndGg9W107XG5cdHZhciBvdXQ9W107XG5cdGZvciAodmFyIGk9MDtpPHRva2Vucy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIG09dG9rZW5zW2ldLm1hdGNoKHIpO1xuXHRcdGlmIChtKSB7XG5cdFx0XHRvdXQucHVzaChbbVswXSxwb3N0aW5nc0xlbmd0aFtpXXx8MV0pO1xuXHRcdH1cblx0fVxuXHRvdXQuc29ydChmdW5jdGlvbihhLGIpe3JldHVybiBiWzFdLWFbMV19KTtcblx0cmV0dXJuIG91dDtcbn1cbnZhciBpc1dpbGRjYXJkPWZ1bmN0aW9uKHJhdykge1xuXHRyZXR1cm4gISFyYXcubWF0Y2goL1tcXCpcXD9dLyk7XG59XG5cbnZhciBpc09yVGVybT1mdW5jdGlvbih0ZXJtKSB7XG5cdHRlcm09dGVybS50cmltKCk7XG5cdHJldHVybiAodGVybVt0ZXJtLmxlbmd0aC0xXT09PScsJyk7XG59XG52YXIgb3J0ZXJtPWZ1bmN0aW9uKGVuZ2luZSx0ZXJtLGtleSkge1xuXHRcdHZhciB0PXt0ZXh0OmtleX07XG5cdFx0aWYgKGVuZ2luZS5hbmFseXplci5zaW1wbGlmaWVkVG9rZW4pIHtcblx0XHRcdHQuc2ltcGxpZmllZD1lbmdpbmUuYW5hbHl6ZXIuc2ltcGxpZmllZFRva2VuKGtleSk7XG5cdFx0fVxuXHRcdHRlcm0udmFyaWFudHMucHVzaCh0KTtcbn1cbnZhciBvclRlcm1zPWZ1bmN0aW9uKGVuZ2luZSx0b2tlbnMsbm93KSB7XG5cdHZhciByYXc9dG9rZW5zW25vd107XG5cdHZhciB0ZXJtPXBhcnNlVGVybShlbmdpbmUscmF3KTtcblx0aWYgKCF0ZXJtKSByZXR1cm47XG5cdG9ydGVybShlbmdpbmUsdGVybSx0ZXJtLmtleSk7XG5cdHdoaWxlIChpc09yVGVybShyYXcpKSAge1xuXHRcdHJhdz10b2tlbnNbKytub3ddO1xuXHRcdHZhciB0ZXJtMj1wYXJzZVRlcm0oZW5naW5lLHJhdyk7XG5cdFx0b3J0ZXJtKGVuZ2luZSx0ZXJtLHRlcm0yLmtleSk7XG5cdFx0Zm9yICh2YXIgaSBpbiB0ZXJtMi52YXJpYW50cyl7XG5cdFx0XHR0ZXJtLnZhcmlhbnRzW2ldPXRlcm0yLnZhcmlhbnRzW2ldO1xuXHRcdH1cblx0XHR0ZXJtLmtleSs9JywnK3Rlcm0yLmtleTtcblx0fVxuXHRyZXR1cm4gdGVybTtcbn1cblxudmFyIGdldE9wZXJhdG9yPWZ1bmN0aW9uKHJhdykge1xuXHR2YXIgb3A9Jyc7XG5cdGlmIChyYXdbMF09PScrJykgb3A9J2luY2x1ZGUnO1xuXHRpZiAocmF3WzBdPT0nLScpIG9wPSdleGNsdWRlJztcblx0cmV0dXJuIG9wO1xufVxudmFyIHBhcnNlUGhyYXNlPWZ1bmN0aW9uKHEpIHtcblx0dmFyIG1hdGNoPXEubWF0Y2goLyhcIi4rP1wifCcuKz8nfFxcUyspL2cpXG5cdG1hdGNoPW1hdGNoLm1hcChmdW5jdGlvbihzdHIpe1xuXHRcdHZhciBuPXN0ci5sZW5ndGgsIGg9c3RyLmNoYXJBdCgwKSwgdD1zdHIuY2hhckF0KG4tMSlcblx0XHRpZiAoaD09PXQmJihoPT09J1wiJ3xoPT09XCInXCIpKSBzdHI9c3RyLnN1YnN0cigxLG4tMilcblx0XHRyZXR1cm4gc3RyO1xuXHR9KVxuXHRyZXR1cm4gbWF0Y2g7XG59XG52YXIgdGliZXRhbk51bWJlcj17XG5cdFwiXFx1MGYyMFwiOlwiMFwiLFwiXFx1MGYyMVwiOlwiMVwiLFwiXFx1MGYyMlwiOlwiMlwiLFx0XCJcXHUwZjIzXCI6XCIzXCIsXHRcIlxcdTBmMjRcIjpcIjRcIixcblx0XCJcXHUwZjI1XCI6XCI1XCIsXCJcXHUwZjI2XCI6XCI2XCIsXCJcXHUwZjI3XCI6XCI3XCIsXCJcXHUwZjI4XCI6XCI4XCIsXCJcXHUwZjI5XCI6XCI5XCJcbn1cbnZhciBwYXJzZU51bWJlcj1mdW5jdGlvbihyYXcpIHtcblx0dmFyIG49cGFyc2VJbnQocmF3LDEwKTtcblx0aWYgKGlzTmFOKG4pKXtcblx0XHR2YXIgY29udmVydGVkPVtdO1xuXHRcdGZvciAodmFyIGk9MDtpPHJhdy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgbm49dGliZXRhbk51bWJlcltyYXdbaV1dO1xuXHRcdFx0aWYgKHR5cGVvZiBubiAhPVwidW5kZWZpbmVkXCIpIGNvbnZlcnRlZFtpXT1ubjtcblx0XHRcdGVsc2UgYnJlYWs7XG5cdFx0fVxuXHRcdHJldHVybiBwYXJzZUludChjb252ZXJ0ZWQsMTApO1xuXHR9IGVsc2Uge1xuXHRcdHJldHVybiBuO1xuXHR9XG59XG52YXIgcGFyc2VXaWxkY2FyZD1mdW5jdGlvbihyYXcpIHtcblx0dmFyIG49cGFyc2VOdW1iZXIocmF3KSB8fCAxO1xuXHR2YXIgcWNvdW50PXJhdy5zcGxpdCgnPycpLmxlbmd0aC0xO1xuXHR2YXIgc2NvdW50PXJhdy5zcGxpdCgnKicpLmxlbmd0aC0xO1xuXHR2YXIgdHlwZT0nJztcblx0aWYgKHFjb3VudCkgdHlwZT0nPyc7XG5cdGVsc2UgaWYgKHNjb3VudCkgdHlwZT0nKic7XG5cdHJldHVybiB7d2lsZGNhcmQ6dHlwZSwgd2lkdGg6IG4gLCBvcDond2lsZGNhcmQnfTtcbn1cblxudmFyIG5ld1BocmFzZT1mdW5jdGlvbigpIHtcblx0cmV0dXJuIHt0ZXJtaWQ6W10scG9zdGluZzpbXSxyYXc6JycsdGVybWxlbmd0aDpbXX07XG59IFxudmFyIHBhcnNlUXVlcnk9ZnVuY3Rpb24ocSxzZXApIHtcblx0aWYgKHNlcCAmJiBxLmluZGV4T2Yoc2VwKT4tMSkge1xuXHRcdHZhciBtYXRjaD1xLnNwbGl0KHNlcCk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIG1hdGNoPXEubWF0Y2goLyhcIi4rP1wifCcuKz8nfFxcUyspL2cpXG5cdFx0bWF0Y2g9bWF0Y2gubWFwKGZ1bmN0aW9uKHN0cil7XG5cdFx0XHR2YXIgbj1zdHIubGVuZ3RoLCBoPXN0ci5jaGFyQXQoMCksIHQ9c3RyLmNoYXJBdChuLTEpXG5cdFx0XHRpZiAoaD09PXQmJihoPT09J1wiJ3xoPT09XCInXCIpKSBzdHI9c3RyLnN1YnN0cigxLG4tMilcblx0XHRcdHJldHVybiBzdHJcblx0XHR9KVxuXHRcdC8vY29uc29sZS5sb2coaW5wdXQsJz09PicsbWF0Y2gpXHRcdFxuXHR9XG5cdHJldHVybiBtYXRjaDtcbn1cbnZhciBsb2FkUGhyYXNlPWZ1bmN0aW9uKHBocmFzZSkge1xuXHQvKiByZW1vdmUgbGVhZGluZyBhbmQgZW5kaW5nIHdpbGRjYXJkICovXG5cdHZhciBRPXRoaXM7XG5cdHZhciBjYWNoZT1RLmVuZ2luZS5wb3N0aW5nQ2FjaGU7XG5cdGlmIChjYWNoZVtwaHJhc2Uua2V5XSkge1xuXHRcdHBocmFzZS5wb3N0aW5nPWNhY2hlW3BocmFzZS5rZXldO1xuXHRcdHJldHVybiBRO1xuXHR9XG5cdGlmIChwaHJhc2UudGVybWlkLmxlbmd0aD09MSkge1xuXHRcdGlmICghUS50ZXJtcy5sZW5ndGgpe1xuXHRcdFx0cGhyYXNlLnBvc3Rpbmc9W107XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNhY2hlW3BocmFzZS5rZXldPXBocmFzZS5wb3N0aW5nPVEudGVybXNbcGhyYXNlLnRlcm1pZFswXV0ucG9zdGluZztcdFxuXHRcdH1cblx0XHRyZXR1cm4gUTtcblx0fVxuXG5cdHZhciBpPTAsIHI9W10sZGlzPTA7XG5cdHdoaWxlKGk8cGhyYXNlLnRlcm1pZC5sZW5ndGgpIHtcblx0ICB2YXIgVD1RLnRlcm1zW3BocmFzZS50ZXJtaWRbaV1dO1xuXHRcdGlmICgwID09PSBpKSB7XG5cdFx0XHRyID0gVC5wb3N0aW5nO1xuXHRcdH0gZWxzZSB7XG5cdFx0ICAgIGlmIChULm9wPT0nd2lsZGNhcmQnKSB7XG5cdFx0ICAgIFx0VD1RLnRlcm1zW3BocmFzZS50ZXJtaWRbaSsrXV07XG5cdFx0ICAgIFx0dmFyIHdpZHRoPVQud2lkdGg7XG5cdFx0ICAgIFx0dmFyIHdpbGRjYXJkPVQud2lsZGNhcmQ7XG5cdFx0ICAgIFx0VD1RLnRlcm1zW3BocmFzZS50ZXJtaWRbaV1dO1xuXHRcdCAgICBcdHZhciBtaW5kaXM9ZGlzO1xuXHRcdCAgICBcdGlmICh3aWxkY2FyZD09Jz8nKSBtaW5kaXM9ZGlzK3dpZHRoO1xuXHRcdCAgICBcdGlmIChULmV4Y2x1ZGUpIHIgPSBwbGlzdC5wbG5vdGZvbGxvdzIociwgVC5wb3N0aW5nLCBtaW5kaXMsIGRpcyt3aWR0aCk7XG5cdFx0ICAgIFx0ZWxzZSByID0gcGxpc3QucGxmb2xsb3cyKHIsIFQucG9zdGluZywgbWluZGlzLCBkaXMrd2lkdGgpO1x0XHQgICAgXHRcblx0XHQgICAgXHRkaXMrPSh3aWR0aC0xKTtcblx0XHQgICAgfWVsc2Uge1xuXHRcdCAgICBcdGlmIChULnBvc3RpbmcpIHtcblx0XHQgICAgXHRcdGlmIChULmV4Y2x1ZGUpIHIgPSBwbGlzdC5wbG5vdGZvbGxvdyhyLCBULnBvc3RpbmcsIGRpcyk7XG5cdFx0ICAgIFx0XHRlbHNlIHIgPSBwbGlzdC5wbGZvbGxvdyhyLCBULnBvc3RpbmcsIGRpcyk7XG5cdFx0ICAgIFx0fVxuXHRcdCAgICB9XG5cdFx0fVxuXHRcdGRpcyArPSBwaHJhc2UudGVybWxlbmd0aFtpXTtcblx0XHRpKys7XG5cdFx0aWYgKCFyKSByZXR1cm4gUTtcbiAgfVxuICBwaHJhc2UucG9zdGluZz1yO1xuICBjYWNoZVtwaHJhc2Uua2V5XT1yO1xuICByZXR1cm4gUTtcbn1cbnZhciB0cmltU3BhY2U9ZnVuY3Rpb24oZW5naW5lLHF1ZXJ5KSB7XG5cdGlmICghcXVlcnkpIHJldHVybiBcIlwiO1xuXHR2YXIgaT0wO1xuXHR2YXIgaXNTa2lwPWVuZ2luZS5hbmFseXplci5pc1NraXA7XG5cdHdoaWxlIChpc1NraXAocXVlcnlbaV0pICYmIGk8cXVlcnkubGVuZ3RoKSBpKys7XG5cdHJldHVybiBxdWVyeS5zdWJzdHJpbmcoaSk7XG59XG52YXIgZ2V0UGFnZVdpdGhIaXQ9ZnVuY3Rpb24oZmlsZWlkLG9mZnNldHMpIHtcblx0dmFyIFE9dGhpcyxlbmdpbmU9US5lbmdpbmU7XG5cdHZhciBwYWdld2l0aGhpdD1wbGlzdC5ncm91cGJ5cG9zdGluZzIoUS5ieUZpbGVbZmlsZWlkIF0sIG9mZnNldHMpO1xuXHRpZiAocGFnZXdpdGhoaXQubGVuZ3RoKSBwYWdld2l0aGhpdC5zaGlmdCgpOyAvL3RoZSBmaXJzdCBpdGVtIGlzIG5vdCB1c2VkICgwflEuYnlGaWxlWzBdIClcblx0dmFyIG91dD1bXTtcblx0cGFnZXdpdGhoaXQubWFwKGZ1bmN0aW9uKHAsaWR4KXtpZiAocC5sZW5ndGgpIG91dC5wdXNoKGlkeCl9KTtcblx0cmV0dXJuIG91dDtcbn1cbnZhciBwYWdlV2l0aEhpdD1mdW5jdGlvbihmaWxlaWQpIHtcblx0dmFyIFE9dGhpcyxlbmdpbmU9US5lbmdpbmU7XG5cdHZhciBvZmZzZXRzPWVuZ2luZS5nZXRGaWxlUGFnZU9mZnNldHMoZmlsZWlkKTtcblx0cmV0dXJuIGdldFBhZ2VXaXRoSGl0LmFwcGx5KHRoaXMsW2ZpbGVpZCxvZmZzZXRzXSk7XG59XG52YXIgaXNTaW1wbGVQaHJhc2U9ZnVuY3Rpb24ocGhyYXNlKSB7XG5cdHZhciBtPXBocmFzZS5tYXRjaCgvW1xcPyVeXS8pO1xuXHRyZXR1cm4gIW07XG59XG5cbi8vIOeZvOiPqeaPkOW/gyAgID09PiDnmbzoj6kgIOaPkOW/gyAgICAgICAyIDIgICBcbi8vIOiPqeaPkOW/gyAgICAgPT0+IOiPqeaPkCAg5o+Q5b+DICAgICAgIDEgMlxuLy8g5Yqr5YqrICAgICAgID09PiDliqsgICAg5YqrICAgICAgICAgMSAxICAgLy8gaW52YWxpZFxuLy8g5Zug57ej5omA55Sf6YGTICA9PT4g5Zug57ejICDmiYDnlJ8gICDpgZMgICAyIDIgMVxudmFyIHNwbGl0UGhyYXNlPWZ1bmN0aW9uKGVuZ2luZSxzaW1wbGVwaHJhc2UsYmlncmFtKSB7XG5cdHZhciBiaWdyYW09YmlncmFtfHxlbmdpbmUuZ2V0KFwibWV0YVwiKS5iaWdyYW18fFtdO1xuXHR2YXIgdG9rZW5zPWVuZ2luZS5hbmFseXplci50b2tlbml6ZShzaW1wbGVwaHJhc2UpLnRva2Vucztcblx0dmFyIGxvYWR0b2tlbnM9W10sbGVuZ3Rocz1bXSxqPTAsbGFzdGJpZ3JhbXBvcz0tMTtcblx0d2hpbGUgKGorMTx0b2tlbnMubGVuZ3RoKSB7XG5cdFx0dmFyIHRva2VuPWVuZ2luZS5hbmFseXplci5ub3JtYWxpemUodG9rZW5zW2pdKTtcblx0XHR2YXIgbmV4dHRva2VuPWVuZ2luZS5hbmFseXplci5ub3JtYWxpemUodG9rZW5zW2orMV0pO1xuXHRcdHZhciBiaT10b2tlbituZXh0dG9rZW47XG5cdFx0dmFyIGk9cGxpc3QuaW5kZXhPZlNvcnRlZChiaWdyYW0sYmkpO1xuXHRcdGlmIChiaWdyYW1baV09PWJpKSB7XG5cdFx0XHRsb2FkdG9rZW5zLnB1c2goYmkpO1xuXHRcdFx0aWYgKGorMzx0b2tlbnMubGVuZ3RoKSB7XG5cdFx0XHRcdGxhc3RiaWdyYW1wb3M9ajtcblx0XHRcdFx0aisrO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKGorMj09dG9rZW5zLmxlbmd0aCl7IFxuXHRcdFx0XHRcdGlmIChsYXN0YmlncmFtcG9zKzE9PWogKSB7XG5cdFx0XHRcdFx0XHRsZW5ndGhzW2xlbmd0aHMubGVuZ3RoLTFdLS07XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGxhc3RiaWdyYW1wb3M9ajtcblx0XHRcdFx0XHRqKys7XG5cdFx0XHRcdH1lbHNlIHtcblx0XHRcdFx0XHRsYXN0YmlncmFtcG9zPWo7XHRcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0bGVuZ3Rocy5wdXNoKDIpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIWJpZ3JhbSB8fCBsYXN0YmlncmFtcG9zPT0tMSB8fCBsYXN0YmlncmFtcG9zKzEhPWopIHtcblx0XHRcdFx0bG9hZHRva2Vucy5wdXNoKHRva2VuKTtcblx0XHRcdFx0bGVuZ3Rocy5wdXNoKDEpO1x0XHRcdFx0XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGorKztcblx0fVxuXG5cdHdoaWxlIChqPHRva2Vucy5sZW5ndGgpIHtcblx0XHR2YXIgdG9rZW49ZW5naW5lLmFuYWx5emVyLm5vcm1hbGl6ZSh0b2tlbnNbal0pO1xuXHRcdGxvYWR0b2tlbnMucHVzaCh0b2tlbik7XG5cdFx0bGVuZ3Rocy5wdXNoKDEpO1xuXHRcdGorKztcblx0fVxuXG5cdHJldHVybiB7dG9rZW5zOmxvYWR0b2tlbnMsIGxlbmd0aHM6IGxlbmd0aHMgLCB0b2tlbmxlbmd0aDogdG9rZW5zLmxlbmd0aH07XG59XG4vKiBob3N0IGhhcyBmYXN0IG5hdGl2ZSBmdW5jdGlvbiAqL1xudmFyIGZhc3RQaHJhc2U9ZnVuY3Rpb24oZW5naW5lLHBocmFzZSkge1xuXHR2YXIgcGhyYXNlX3Rlcm09bmV3UGhyYXNlKCk7XG5cdC8vdmFyIHRva2Vucz1lbmdpbmUuYW5hbHl6ZXIudG9rZW5pemUocGhyYXNlKS50b2tlbnM7XG5cdHZhciBzcGxpdHRlZD1zcGxpdFBocmFzZShlbmdpbmUscGhyYXNlKTtcblxuXHR2YXIgcGF0aHM9cG9zdGluZ1BhdGhGcm9tVG9rZW5zKGVuZ2luZSxzcGxpdHRlZC50b2tlbnMpO1xuLy9jcmVhdGUgd2lsZGNhcmRcblxuXHRwaHJhc2VfdGVybS53aWR0aD1zcGxpdHRlZC50b2tlbmxlbmd0aDsgLy9mb3IgZXhjZXJwdC5qcyB0byBnZXRQaHJhc2VXaWR0aFxuXG5cdGVuZ2luZS5nZXQocGF0aHMse2FkZHJlc3M6dHJ1ZX0sZnVuY3Rpb24ocG9zdGluZ0FkZHJlc3MpeyAvL3RoaXMgaXMgc3luY1xuXHRcdHBocmFzZV90ZXJtLmtleT1waHJhc2U7XG5cdFx0dmFyIHBvc3RpbmdBZGRyZXNzV2l0aFdpbGRjYXJkPVtdO1xuXHRcdGZvciAodmFyIGk9MDtpPHBvc3RpbmdBZGRyZXNzLmxlbmd0aDtpKyspIHtcblx0XHRcdHBvc3RpbmdBZGRyZXNzV2l0aFdpbGRjYXJkLnB1c2gocG9zdGluZ0FkZHJlc3NbaV0pO1xuXHRcdFx0aWYgKHNwbGl0dGVkLmxlbmd0aHNbaV0+MSkge1xuXHRcdFx0XHRwb3N0aW5nQWRkcmVzc1dpdGhXaWxkY2FyZC5wdXNoKFtzcGxpdHRlZC5sZW5ndGhzW2ldLDBdKTsgLy93aWxkY2FyZCBoYXMgYmxvY2tzaXplPT0wIFxuXHRcdFx0fVxuXHRcdH1cblx0XHRlbmdpbmUucG9zdGluZ0NhY2hlW3BocmFzZV09ZW5naW5lLm1lcmdlUG9zdGluZ3MocG9zdGluZ0FkZHJlc3NXaXRoV2lsZGNhcmQpO1xuXHR9KTtcblx0cmV0dXJuIHBocmFzZV90ZXJtO1xuXHQvLyBwdXQgcG9zdGluZyBpbnRvIGNhY2hlW3BocmFzZS5rZXldXG59XG52YXIgc2xvd1BocmFzZT1mdW5jdGlvbihlbmdpbmUsdGVybXMscGhyYXNlKSB7XG5cdHZhciBqPTAsdG9rZW5zPWVuZ2luZS5hbmFseXplci50b2tlbml6ZShwaHJhc2UpLnRva2Vucztcblx0dmFyIHBocmFzZV90ZXJtPW5ld1BocmFzZSgpO1xuXHR2YXIgdGVybWlkPTA7XG5cdHdoaWxlIChqPHRva2Vucy5sZW5ndGgpIHtcblx0XHR2YXIgcmF3PXRva2Vuc1tqXSwgdGVybWxlbmd0aD0xO1xuXHRcdGlmIChpc1dpbGRjYXJkKHJhdykpIHtcblx0XHRcdGlmIChwaHJhc2VfdGVybS50ZXJtaWQubGVuZ3RoPT0wKSAgeyAvL3NraXAgbGVhZGluZyB3aWxkIGNhcmRcblx0XHRcdFx0aisrXG5cdFx0XHRcdGNvbnRpbnVlO1xuXHRcdFx0fVxuXHRcdFx0dGVybXMucHVzaChwYXJzZVdpbGRjYXJkKHJhdykpO1xuXHRcdFx0dGVybWlkPXRlcm1zLmxlbmd0aC0xO1xuXHRcdFx0cGhyYXNlX3Rlcm0udGVybWlkLnB1c2godGVybWlkKTtcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1sZW5ndGgucHVzaCh0ZXJtbGVuZ3RoKTtcblx0XHR9IGVsc2UgaWYgKGlzT3JUZXJtKHJhdykpe1xuXHRcdFx0dmFyIHRlcm09b3JUZXJtcy5hcHBseSh0aGlzLFt0b2tlbnMsal0pO1xuXHRcdFx0aWYgKHRlcm0pIHtcblx0XHRcdFx0dGVybXMucHVzaCh0ZXJtKTtcblx0XHRcdFx0dGVybWlkPXRlcm1zLmxlbmd0aC0xO1xuXHRcdFx0XHRqKz10ZXJtLmtleS5zcGxpdCgnLCcpLmxlbmd0aC0xO1x0XHRcdFx0XHRcblx0XHRcdH1cblx0XHRcdGorKztcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1pZC5wdXNoKHRlcm1pZCk7XG5cdFx0XHRwaHJhc2VfdGVybS50ZXJtbGVuZ3RoLnB1c2godGVybWxlbmd0aCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwaHJhc2U9XCJcIjtcblx0XHRcdHdoaWxlIChqPHRva2Vucy5sZW5ndGgpIHtcblx0XHRcdFx0aWYgKCEoaXNXaWxkY2FyZCh0b2tlbnNbal0pIHx8IGlzT3JUZXJtKHRva2Vuc1tqXSkpKSB7XG5cdFx0XHRcdFx0cGhyYXNlKz10b2tlbnNbal07XG5cdFx0XHRcdFx0aisrO1xuXHRcdFx0XHR9IGVsc2UgYnJlYWs7XG5cdFx0XHR9XG5cblx0XHRcdHZhciBzcGxpdHRlZD1zcGxpdFBocmFzZShlbmdpbmUscGhyYXNlKTtcblx0XHRcdGZvciAodmFyIGk9MDtpPHNwbGl0dGVkLnRva2Vucy5sZW5ndGg7aSsrKSB7XG5cblx0XHRcdFx0dmFyIHRlcm09cGFyc2VUZXJtKGVuZ2luZSxzcGxpdHRlZC50b2tlbnNbaV0pO1xuXHRcdFx0XHR2YXIgdGVybWlkeD10ZXJtcy5tYXAoZnVuY3Rpb24oYSl7cmV0dXJuIGEua2V5fSkuaW5kZXhPZih0ZXJtLmtleSk7XG5cdFx0XHRcdGlmICh0ZXJtaWR4PT0tMSkge1xuXHRcdFx0XHRcdHRlcm1zLnB1c2godGVybSk7XG5cdFx0XHRcdFx0dGVybWlkPXRlcm1zLmxlbmd0aC0xO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRlcm1pZD10ZXJtaWR4O1xuXHRcdFx0XHR9XHRcdFx0XHRcblx0XHRcdFx0cGhyYXNlX3Rlcm0udGVybWlkLnB1c2godGVybWlkKTtcblx0XHRcdFx0cGhyYXNlX3Rlcm0udGVybWxlbmd0aC5wdXNoKHNwbGl0dGVkLmxlbmd0aHNbaV0pO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRqKys7XG5cdH1cblx0cGhyYXNlX3Rlcm0ua2V5PXBocmFzZTtcblx0Ly9yZW1vdmUgZW5kaW5nIHdpbGRjYXJkXG5cdHZhciBQPXBocmFzZV90ZXJtICwgVD1udWxsO1xuXHRkbyB7XG5cdFx0VD10ZXJtc1tQLnRlcm1pZFtQLnRlcm1pZC5sZW5ndGgtMV1dO1xuXHRcdGlmICghVCkgYnJlYWs7XG5cdFx0aWYgKFQud2lsZGNhcmQpIFAudGVybWlkLnBvcCgpOyBlbHNlIGJyZWFrO1xuXHR9IHdoaWxlKFQpO1x0XHRcblx0cmV0dXJuIHBocmFzZV90ZXJtO1xufVxudmFyIG5ld1F1ZXJ5ID1mdW5jdGlvbihlbmdpbmUscXVlcnksb3B0cykge1xuXHQvL2lmICghcXVlcnkpIHJldHVybjtcblx0b3B0cz1vcHRzfHx7fTtcblx0cXVlcnk9dHJpbVNwYWNlKGVuZ2luZSxxdWVyeSk7XG5cblx0dmFyIHBocmFzZXM9cXVlcnkscGhyYXNlcz1bXTtcblx0aWYgKHR5cGVvZiBxdWVyeT09J3N0cmluZycgJiYgcXVlcnkpIHtcblx0XHRwaHJhc2VzPXBhcnNlUXVlcnkocXVlcnksb3B0cy5waHJhc2Vfc2VwIHx8IFwiXCIpO1xuXHR9XG5cdFxuXHR2YXIgcGhyYXNlX3Rlcm1zPVtdLCB0ZXJtcz1bXSx2YXJpYW50cz1bXSxvcGVyYXRvcnM9W107XG5cdHZhciBwYz0wOy8vcGhyYXNlIGNvdW50XG5cdGZvciAgKHZhciBpPTA7aTxwaHJhc2VzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgb3A9Z2V0T3BlcmF0b3IocGhyYXNlc1twY10pO1xuXHRcdGlmIChvcCkgcGhyYXNlc1twY109cGhyYXNlc1twY10uc3Vic3RyaW5nKDEpO1xuXG5cdFx0LyogYXV0byBhZGQgKyBmb3IgbmF0dXJhbCBvcmRlciA/Ki9cblx0XHQvL2lmICghb3B0cy5yYW5rICYmIG9wIT0nZXhjbHVkZScgJiZpKSBvcD0naW5jbHVkZSc7XG5cdFx0b3BlcmF0b3JzLnB1c2gob3ApO1xuXG5cdFx0aWYgKGlzU2ltcGxlUGhyYXNlKHBocmFzZXNbcGNdKSAmJiBlbmdpbmUubWVyZ2VQb3N0aW5ncyApIHtcblx0XHRcdHZhciBwaHJhc2VfdGVybT1mYXN0UGhyYXNlKGVuZ2luZSxwaHJhc2VzW3BjXSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwaHJhc2VfdGVybT1zbG93UGhyYXNlKGVuZ2luZSx0ZXJtcyxwaHJhc2VzW3BjXSk7XG5cdFx0fVxuXHRcdHBocmFzZV90ZXJtcy5wdXNoKHBocmFzZV90ZXJtKTtcblxuXHRcdGlmICghZW5naW5lLm1lcmdlUG9zdGluZ3MgJiYgcGhyYXNlX3Rlcm1zW3BjXS50ZXJtaWQubGVuZ3RoPT0wKSB7XG5cdFx0XHRwaHJhc2VfdGVybXMucG9wKCk7XG5cdFx0fSBlbHNlIHBjKys7XG5cdH1cblx0b3B0cy5vcD1vcGVyYXRvcnM7XG5cblx0dmFyIFE9e2RibmFtZTplbmdpbmUuZGJuYW1lLGVuZ2luZTplbmdpbmUsb3B0czpvcHRzLHF1ZXJ5OnF1ZXJ5LFxuXHRcdHBocmFzZXM6cGhyYXNlX3Rlcm1zLHRlcm1zOnRlcm1zXG5cdH07XG5cdFEudG9rZW5pemU9ZnVuY3Rpb24oKSB7cmV0dXJuIGVuZ2luZS5hbmFseXplci50b2tlbml6ZS5hcHBseShlbmdpbmUsYXJndW1lbnRzKTt9XG5cdFEuaXNTa2lwPWZ1bmN0aW9uKCkge3JldHVybiBlbmdpbmUuYW5hbHl6ZXIuaXNTa2lwLmFwcGx5KGVuZ2luZSxhcmd1bWVudHMpO31cblx0US5ub3JtYWxpemU9ZnVuY3Rpb24oKSB7cmV0dXJuIGVuZ2luZS5hbmFseXplci5ub3JtYWxpemUuYXBwbHkoZW5naW5lLGFyZ3VtZW50cyk7fVxuXHRRLnBhZ2VXaXRoSGl0PXBhZ2VXaXRoSGl0O1xuXG5cdC8vUS5nZXRSYW5nZT1mdW5jdGlvbigpIHtyZXR1cm4gdGhhdC5nZXRSYW5nZS5hcHBseSh0aGF0LGFyZ3VtZW50cyl9O1xuXHQvL0FQSS5xdWVyeWlkPSdRJysoTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpKjEwMDAwMDAwKSkudG9TdHJpbmcoMTYpO1xuXHRyZXR1cm4gUTtcbn1cbnZhciBwb3N0aW5nUGF0aEZyb21Ub2tlbnM9ZnVuY3Rpb24oZW5naW5lLHRva2Vucykge1xuXHR2YXIgYWxsdG9rZW5zPWVuZ2luZS5nZXQoXCJ0b2tlbnNcIik7XG5cblx0dmFyIHRva2VuSWRzPXRva2Vucy5tYXAoZnVuY3Rpb24odCl7IHJldHVybiAxK2FsbHRva2Vucy5pbmRleE9mKHQpfSk7XG5cdHZhciBwb3N0aW5naWQ9W107XG5cdGZvciAodmFyIGk9MDtpPHRva2VuSWRzLmxlbmd0aDtpKyspIHtcblx0XHRwb3N0aW5naWQucHVzaCggdG9rZW5JZHNbaV0pOyAvLyB0b2tlbklkPT0wICwgZW1wdHkgdG9rZW5cblx0fVxuXHRyZXR1cm4gcG9zdGluZ2lkLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gW1wicG9zdGluZ3NcIix0XX0pO1xufVxudmFyIGxvYWRQb3N0aW5ncz1mdW5jdGlvbihlbmdpbmUsdG9rZW5zLGNiKSB7XG5cdHZhciB0b2xvYWR0b2tlbnM9dG9rZW5zLmZpbHRlcihmdW5jdGlvbih0KXtcblx0XHRyZXR1cm4gIWVuZ2luZS5wb3N0aW5nQ2FjaGVbdC5rZXldOyAvL2FscmVhZHkgaW4gY2FjaGVcblx0fSk7XG5cdGlmICh0b2xvYWR0b2tlbnMubGVuZ3RoPT0wKSB7XG5cdFx0Y2IoKTtcblx0XHRyZXR1cm47XG5cdH1cblx0dmFyIHBvc3RpbmdQYXRocz1wb3N0aW5nUGF0aEZyb21Ub2tlbnMoZW5naW5lLHRva2Vucy5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQua2V5fSkpO1xuXHRlbmdpbmUuZ2V0KHBvc3RpbmdQYXRocyxmdW5jdGlvbihwb3N0aW5ncyl7XG5cdFx0cG9zdGluZ3MubWFwKGZ1bmN0aW9uKHAsaSkgeyB0b2tlbnNbaV0ucG9zdGluZz1wIH0pO1xuXHRcdGlmIChjYikgY2IoKTtcblx0fSk7XG59XG52YXIgZ3JvdXBCeT1mdW5jdGlvbihRLHBvc3RpbmcpIHtcblx0cGhyYXNlcy5mb3JFYWNoKGZ1bmN0aW9uKFApe1xuXHRcdHZhciBrZXk9UC5rZXk7XG5cdFx0dmFyIGRvY2ZyZXE9ZG9jZnJlcWNhY2hlW2tleV07XG5cdFx0aWYgKCFkb2NmcmVxKSBkb2NmcmVxPWRvY2ZyZXFjYWNoZVtrZXldPXt9O1xuXHRcdGlmICghZG9jZnJlcVt0aGF0Lmdyb3VwdW5pdF0pIHtcblx0XHRcdGRvY2ZyZXFbdGhhdC5ncm91cHVuaXRdPXtkb2NsaXN0Om51bGwsZnJlcTpudWxsfTtcblx0XHR9XHRcdFxuXHRcdGlmIChQLnBvc3RpbmcpIHtcblx0XHRcdHZhciByZXM9bWF0Y2hQb3N0aW5nKGVuZ2luZSxQLnBvc3RpbmcpO1xuXHRcdFx0UC5mcmVxPXJlcy5mcmVxO1xuXHRcdFx0UC5kb2NzPXJlcy5kb2NzO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRQLmRvY3M9W107XG5cdFx0XHRQLmZyZXE9W107XG5cdFx0fVxuXHRcdGRvY2ZyZXFbdGhhdC5ncm91cHVuaXRdPXtkb2NsaXN0OlAuZG9jcyxmcmVxOlAuZnJlcX07XG5cdH0pO1xuXHRyZXR1cm4gdGhpcztcbn1cbnZhciBncm91cEJ5Rm9sZGVyPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaGl0cykge1xuXHR2YXIgZmlsZXM9ZW5naW5lLmdldChcImZpbGVOYW1lc1wiKTtcblx0dmFyIHByZXZmb2xkZXI9XCJcIixoaXRzPTAsb3V0PVtdO1xuXHRmb3IgKHZhciBpPTA7aTxmaWxlaGl0cy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIGZuPWZpbGVzW2ldO1xuXHRcdHZhciBmb2xkZXI9Zm4uc3Vic3RyaW5nKDAsZm4uaW5kZXhPZignLycpKTtcblx0XHRpZiAocHJldmZvbGRlciAmJiBwcmV2Zm9sZGVyIT1mb2xkZXIpIHtcblx0XHRcdG91dC5wdXNoKGhpdHMpO1xuXHRcdFx0aGl0cz0wO1xuXHRcdH1cblx0XHRoaXRzKz1maWxlaGl0c1tpXS5sZW5ndGg7XG5cdFx0cHJldmZvbGRlcj1mb2xkZXI7XG5cdH1cblx0b3V0LnB1c2goaGl0cyk7XG5cdHJldHVybiBvdXQ7XG59XG52YXIgcGhyYXNlX2ludGVyc2VjdD1mdW5jdGlvbihlbmdpbmUsUSkge1xuXHR2YXIgaW50ZXJzZWN0ZWQ9bnVsbDtcblx0dmFyIGZpbGVPZmZzZXRzPVEuZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHR2YXIgZW1wdHk9W10sZW1wdHljb3VudD0wLGhhc2hpdD0wO1xuXHRmb3IgKHZhciBpPTA7aTxRLnBocmFzZXMubGVuZ3RoO2krKykge1xuXHRcdHZhciBieWZpbGU9cGxpc3QuZ3JvdXBieXBvc3RpbmcyKFEucGhyYXNlc1tpXS5wb3N0aW5nLGZpbGVPZmZzZXRzKTtcblx0XHRpZiAoYnlmaWxlLmxlbmd0aCkgYnlmaWxlLnNoaWZ0KCk7XG5cdFx0aWYgKGJ5ZmlsZS5sZW5ndGgpIGJ5ZmlsZS5wb3AoKTtcblx0XHRieWZpbGUucG9wKCk7XG5cdFx0aWYgKGludGVyc2VjdGVkPT1udWxsKSB7XG5cdFx0XHRpbnRlcnNlY3RlZD1ieWZpbGU7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAodmFyIGo9MDtqPGJ5ZmlsZS5sZW5ndGg7aisrKSB7XG5cdFx0XHRcdGlmICghKGJ5ZmlsZVtqXS5sZW5ndGggJiYgaW50ZXJzZWN0ZWRbal0ubGVuZ3RoKSkge1xuXHRcdFx0XHRcdGludGVyc2VjdGVkW2pdPWVtcHR5OyAvL3JldXNlIGVtcHR5IGFycmF5XG5cdFx0XHRcdFx0ZW1wdHljb3VudCsrO1xuXHRcdFx0XHR9IGVsc2UgaGFzaGl0Kys7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0US5ieUZpbGU9aW50ZXJzZWN0ZWQ7XG5cdFEuYnlGb2xkZXI9Z3JvdXBCeUZvbGRlcihlbmdpbmUsUS5ieUZpbGUpO1xuXHR2YXIgb3V0PVtdO1xuXHQvL2NhbGN1bGF0ZSBuZXcgcmF3cG9zdGluZ1xuXHRmb3IgKHZhciBpPTA7aTxRLmJ5RmlsZS5sZW5ndGg7aSsrKSB7XG5cdFx0aWYgKFEuYnlGaWxlW2ldLmxlbmd0aCkgb3V0PW91dC5jb25jYXQoUS5ieUZpbGVbaV0pO1xuXHR9XG5cdFEucmF3cmVzdWx0PW91dDtcblx0Y291bnRGb2xkZXJGaWxlKFEpO1xufVxudmFyIGNvdW50Rm9sZGVyRmlsZT1mdW5jdGlvbihRKSB7XG5cdFEuZmlsZVdpdGhIaXRDb3VudD0wO1xuXHRRLmJ5RmlsZS5tYXAoZnVuY3Rpb24oZil7aWYgKGYubGVuZ3RoKSBRLmZpbGVXaXRoSGl0Q291bnQrK30pO1xuXHRcdFx0XG5cdFEuZm9sZGVyV2l0aEhpdENvdW50PTA7XG5cdFEuYnlGb2xkZXIubWFwKGZ1bmN0aW9uKGYpe2lmIChmKSBRLmZvbGRlcldpdGhIaXRDb3VudCsrfSk7XG59XG5cbnZhciBtYWluPWZ1bmN0aW9uKGVuZ2luZSxxLG9wdHMsY2Ipe1xuXHR2YXIgc3RhcnR0aW1lPW5ldyBEYXRlKCk7XG5cdHZhciBtZXRhPWVuZ2luZS5nZXQoXCJtZXRhXCIpO1xuXHRpZiAobWV0YS5ub3JtYWxpemUgJiYgZW5naW5lLmFuYWx5emVyLnNldE5vcm1hbGl6ZVRhYmxlKSB7XG5cdFx0bWV0YS5ub3JtYWxpemVPYmo9ZW5naW5lLmFuYWx5emVyLnNldE5vcm1hbGl6ZVRhYmxlKG1ldGEubm9ybWFsaXplLG1ldGEubm9ybWFsaXplT2JqKTtcblx0fVxuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikgY2I9b3B0cztcblx0b3B0cz1vcHRzfHx7fTtcblx0dmFyIFE9ZW5naW5lLnF1ZXJ5Q2FjaGVbcV07XG5cdGlmICghUSkgUT1uZXdRdWVyeShlbmdpbmUscSxvcHRzKTsgXG5cdGlmICghUSkge1xuXHRcdGVuZ2luZS5zZWFyY2h0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdGVuZ2luZS50b3RhbHRpbWU9ZW5naW5lLnNlYXJjaHRpbWU7XG5cdFx0aWYgKGVuZ2luZS5jb250ZXh0KSBjYi5hcHBseShlbmdpbmUuY29udGV4dCxbXCJlbXB0eSByZXN1bHRcIix7cmF3cmVzdWx0OltdfV0pO1xuXHRcdGVsc2UgY2IoXCJlbXB0eSByZXN1bHRcIix7cmF3cmVzdWx0OltdfSk7XG5cdFx0cmV0dXJuO1xuXHR9O1xuXHRlbmdpbmUucXVlcnlDYWNoZVtxXT1RO1xuXHRpZiAoUS5waHJhc2VzLmxlbmd0aCkge1xuXHRcdGxvYWRQb3N0aW5ncyhlbmdpbmUsUS50ZXJtcyxmdW5jdGlvbigpe1xuXHRcdFx0aWYgKCFRLnBocmFzZXNbMF0ucG9zdGluZykge1xuXHRcdFx0XHRlbmdpbmUuc2VhcmNodGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRcdFx0ZW5naW5lLnRvdGFsdGltZT1lbmdpbmUuc2VhcmNodGltZVxuXG5cdFx0XHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFtcIm5vIHN1Y2ggcG9zdGluZ1wiLHtyYXdyZXN1bHQ6W119XSk7XG5cdFx0XHRcdHJldHVybjtcdFx0XHRcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKCFRLnBocmFzZXNbMF0ucG9zdGluZy5sZW5ndGgpIHsgLy9cblx0XHRcdFx0US5waHJhc2VzLmZvckVhY2gobG9hZFBocmFzZS5iaW5kKFEpKTtcblx0XHRcdH1cblx0XHRcdGlmIChRLnBocmFzZXMubGVuZ3RoPT0xKSB7XG5cdFx0XHRcdFEucmF3cmVzdWx0PVEucGhyYXNlc1swXS5wb3N0aW5nO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cGhyYXNlX2ludGVyc2VjdChlbmdpbmUsUSk7XG5cdFx0XHR9XG5cdFx0XHR2YXIgZmlsZU9mZnNldHM9US5lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwic2VhcmNoIG9wdHMgXCIrSlNPTi5zdHJpbmdpZnkob3B0cykpO1xuXG5cdFx0XHRpZiAoIVEuYnlGaWxlICYmIFEucmF3cmVzdWx0ICYmICFvcHRzLm5vZ3JvdXApIHtcblx0XHRcdFx0US5ieUZpbGU9cGxpc3QuZ3JvdXBieXBvc3RpbmcyKFEucmF3cmVzdWx0LCBmaWxlT2Zmc2V0cyk7XG5cdFx0XHRcdFEuYnlGaWxlLnNoaWZ0KCk7US5ieUZpbGUucG9wKCk7XG5cdFx0XHRcdFEuYnlGb2xkZXI9Z3JvdXBCeUZvbGRlcihlbmdpbmUsUS5ieUZpbGUpO1xuXG5cdFx0XHRcdGNvdW50Rm9sZGVyRmlsZShRKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKG9wdHMucmFuZ2UpIHtcblx0XHRcdFx0ZW5naW5lLnNlYXJjaHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0XHRcdGV4Y2VycHQucmVzdWx0bGlzdChlbmdpbmUsUSxvcHRzLGZ1bmN0aW9uKGRhdGEpIHsgXG5cdFx0XHRcdFx0Ly9jb25zb2xlLmxvZyhcImV4Y2VycHQgb2tcIik7XG5cdFx0XHRcdFx0US5leGNlcnB0PWRhdGE7XG5cdFx0XHRcdFx0ZW5naW5lLnRvdGFsdGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRcdFx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dCxbMCxRXSk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0ZW5naW5lLnNlYXJjaHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0XHRcdGVuZ2luZS50b3RhbHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0XHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFswLFFdKTtcblx0XHRcdH1cblx0XHR9KTtcblx0fSBlbHNlIHsgLy9lbXB0eSBzZWFyY2hcblx0XHRlbmdpbmUuc2VhcmNodGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRlbmdpbmUudG90YWx0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFswLFFdKTtcblx0fTtcbn1cblxubWFpbi5zcGxpdFBocmFzZT1zcGxpdFBocmFzZTsgLy9qdXN0IGZvciBkZWJ1Z1xubW9kdWxlLmV4cG9ydHM9bWFpbjsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cbi8qXG5jb252ZXJ0IHRvIHB1cmUganNcbnNhdmUgLWcgcmVhY3RpZnlcbiovXG52YXIgRT1SZWFjdC5jcmVhdGVFbGVtZW50O1xuXG52YXIgaGFza3NhbmFnYXA9KHR5cGVvZiBrc2FuYWdhcCE9XCJ1bmRlZmluZWRcIik7XG5pZiAoaGFza3NhbmFnYXAgJiYgKHR5cGVvZiBjb25zb2xlPT1cInVuZGVmaW5lZFwiIHx8IHR5cGVvZiBjb25zb2xlLmxvZz09XCJ1bmRlZmluZWRcIikpIHtcblx0XHR3aW5kb3cuY29uc29sZT17bG9nOmtzYW5hZ2FwLmxvZyxlcnJvcjprc2FuYWdhcC5lcnJvcixkZWJ1Zzprc2FuYWdhcC5kZWJ1Zyx3YXJuOmtzYW5hZ2FwLndhcm59O1xuXHRcdGNvbnNvbGUubG9nKFwiaW5zdGFsbCBjb25zb2xlIG91dHB1dCBmdW5jaXRvblwiKTtcbn1cblxudmFyIGNoZWNrZnM9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiAobmF2aWdhdG9yICYmIG5hdmlnYXRvci53ZWJraXRQZXJzaXN0ZW50U3RvcmFnZSkgfHwgaGFza3NhbmFnYXA7XG59XG52YXIgZmVhdHVyZWNoZWNrcz17XG5cdFwiZnNcIjpjaGVja2ZzXG59XG52YXIgY2hlY2ticm93c2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XG5cblx0XHR2YXIgbWlzc2luZ0ZlYXR1cmVzPXRoaXMuZ2V0TWlzc2luZ0ZlYXR1cmVzKCk7XG5cdFx0cmV0dXJuIHtyZWFkeTpmYWxzZSwgbWlzc2luZzptaXNzaW5nRmVhdHVyZXN9O1xuXHR9LFxuXHRnZXRNaXNzaW5nRmVhdHVyZXM6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGZlYXR1cmU9dGhpcy5wcm9wcy5mZWF0dXJlLnNwbGl0KFwiLFwiKTtcblx0XHR2YXIgc3RhdHVzPVtdO1xuXHRcdGZlYXR1cmUubWFwKGZ1bmN0aW9uKGYpe1xuXHRcdFx0dmFyIGNoZWNrZXI9ZmVhdHVyZWNoZWNrc1tmXTtcblx0XHRcdGlmIChjaGVja2VyKSBjaGVja2VyPWNoZWNrZXIoKTtcblx0XHRcdHN0YXR1cy5wdXNoKFtmLGNoZWNrZXJdKTtcblx0XHR9KTtcblx0XHRyZXR1cm4gc3RhdHVzLmZpbHRlcihmdW5jdGlvbihmKXtyZXR1cm4gIWZbMV19KTtcblx0fSxcblx0ZG93bmxvYWRicm93c2VyOmZ1bmN0aW9uKCkge1xuXHRcdHdpbmRvdy5sb2NhdGlvbj1cImh0dHBzOi8vd3d3Lmdvb2dsZS5jb20vY2hyb21lL1wiXG5cdH0sXG5cdHJlbmRlck1pc3Npbmc6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHNob3dNaXNzaW5nPWZ1bmN0aW9uKG0pIHtcblx0XHRcdHJldHVybiBFKFwiZGl2XCIsIG51bGwsIG0pO1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdCBFKFwiZGl2XCIsIHtyZWY6IFwiZGlhbG9nMVwiLCBjbGFzc05hbWU6IFwibW9kYWwgZmFkZVwiLCBcImRhdGEtYmFja2Ryb3BcIjogXCJzdGF0aWNcIn0sIFxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcblx0XHQgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtY29udGVudFwifSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtaGVhZGVyXCJ9LCBcblx0XHQgICAgICAgICAgRShcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImNsb3NlXCIsIFwiZGF0YS1kaXNtaXNzXCI6IFwibW9kYWxcIiwgXCJhcmlhLWhpZGRlblwiOiBcInRydWVcIn0sIFwiw5dcIiksIFxuXHRcdCAgICAgICAgICBFKFwiaDRcIiwge2NsYXNzTmFtZTogXCJtb2RhbC10aXRsZVwifSwgXCJCcm93c2VyIENoZWNrXCIpXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcblx0XHQgICAgICAgICAgRShcInBcIiwgbnVsbCwgXCJTb3JyeSBidXQgdGhlIGZvbGxvd2luZyBmZWF0dXJlIGlzIG1pc3NpbmdcIiksIFxuXHRcdCAgICAgICAgICB0aGlzLnN0YXRlLm1pc3NpbmcubWFwKHNob3dNaXNzaW5nKVxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcblx0XHQgICAgICAgICAgRShcImJ1dHRvblwiLCB7b25DbGljazogdGhpcy5kb3dubG9hZGJyb3dzZXIsIHR5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIn0sIFwiRG93bmxvYWQgR29vZ2xlIENocm9tZVwiKVxuXHRcdCAgICAgICAgKVxuXHRcdCAgICAgIClcblx0XHQgICAgKVxuXHRcdCAgKVxuXHRcdCApO1xuXHR9LFxuXHRyZW5kZXJSZWFkeTpmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gRShcInNwYW5cIiwgbnVsbCwgXCJicm93c2VyIG9rXCIpXG5cdH0sXG5cdHJlbmRlcjpmdW5jdGlvbigpe1xuXHRcdHJldHVybiAgKHRoaXMuc3RhdGUubWlzc2luZy5sZW5ndGgpP3RoaXMucmVuZGVyTWlzc2luZygpOnRoaXMucmVuZGVyUmVhZHkoKTtcblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCF0aGlzLnN0YXRlLm1pc3NpbmcubGVuZ3RoKSB7XG5cdFx0XHR0aGlzLnByb3BzLm9uUmVhZHkoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0JCh0aGlzLnJlZnMuZGlhbG9nMS5nZXRET01Ob2RlKCkpLm1vZGFsKCdzaG93Jyk7XG5cdFx0fVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHM9Y2hlY2ticm93c2VyOyIsIlxudmFyIHVzZXJDYW5jZWw9ZmFsc2U7XG52YXIgZmlsZXM9W107XG52YXIgdG90YWxEb3dubG9hZEJ5dGU9MDtcbnZhciB0YXJnZXRQYXRoPVwiXCI7XG52YXIgdGVtcFBhdGg9XCJcIjtcbnZhciBuZmlsZT0wO1xudmFyIGJhc2V1cmw9XCJcIjtcbnZhciByZXN1bHQ9XCJcIjtcbnZhciBkb3dubG9hZGluZz1mYWxzZTtcbnZhciBzdGFydERvd25sb2FkPWZ1bmN0aW9uKGRiaWQsX2Jhc2V1cmwsX2ZpbGVzKSB7IC8vcmV0dXJuIGRvd25sb2FkIGlkXG5cdHZhciBmcyAgICAgPSByZXF1aXJlKFwiZnNcIik7XG5cdHZhciBwYXRoICAgPSByZXF1aXJlKFwicGF0aFwiKTtcblxuXHRcblx0ZmlsZXM9X2ZpbGVzLnNwbGl0KFwiXFx1ZmZmZlwiKTtcblx0aWYgKGRvd25sb2FkaW5nKSByZXR1cm4gZmFsc2U7IC8vb25seSBvbmUgc2Vzc2lvblxuXHR1c2VyQ2FuY2VsPWZhbHNlO1xuXHR0b3RhbERvd25sb2FkQnl0ZT0wO1xuXHRuZXh0RmlsZSgpO1xuXHRkb3dubG9hZGluZz10cnVlO1xuXHRiYXNldXJsPV9iYXNldXJsO1xuXHRpZiAoYmFzZXVybFtiYXNldXJsLmxlbmd0aC0xXSE9Jy8nKWJhc2V1cmwrPScvJztcblx0dGFyZ2V0UGF0aD1rc2FuYWdhcC5yb290UGF0aCtkYmlkKycvJztcblx0dGVtcFBhdGg9a3NhbmFnYXAucm9vdFBhdGgrXCIudG1wL1wiO1xuXHRyZXN1bHQ9XCJcIjtcblx0cmV0dXJuIHRydWU7XG59XG5cbnZhciBuZXh0RmlsZT1mdW5jdGlvbigpIHtcblx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdGlmIChuZmlsZT09ZmlsZXMubGVuZ3RoKSB7XG5cdFx0XHRuZmlsZSsrO1xuXHRcdFx0ZW5kRG93bmxvYWQoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZG93bmxvYWRGaWxlKG5maWxlKyspO1x0XG5cdFx0fVxuXHR9LDEwMCk7XG59XG5cbnZhciBkb3dubG9hZEZpbGU9ZnVuY3Rpb24obmZpbGUpIHtcblx0dmFyIHVybD1iYXNldXJsK2ZpbGVzW25maWxlXTtcblx0dmFyIHRtcGZpbGVuYW1lPXRlbXBQYXRoK2ZpbGVzW25maWxlXTtcblx0dmFyIG1rZGlycCA9IHJlcXVpcmUoXCIuL21rZGlycFwiKTtcblx0dmFyIGZzICAgICA9IHJlcXVpcmUoXCJmc1wiKTtcblx0dmFyIGh0dHAgICA9IHJlcXVpcmUoXCJodHRwXCIpO1xuXG5cdG1rZGlycC5zeW5jKHBhdGguZGlybmFtZSh0bXBmaWxlbmFtZSkpO1xuXHR2YXIgd3JpdGVTdHJlYW0gPSBmcy5jcmVhdGVXcml0ZVN0cmVhbSh0bXBmaWxlbmFtZSk7XG5cdHZhciBkYXRhbGVuZ3RoPTA7XG5cdHZhciByZXF1ZXN0ID0gaHR0cC5nZXQodXJsLCBmdW5jdGlvbihyZXNwb25zZSkge1xuXHRcdHJlc3BvbnNlLm9uKCdkYXRhJyxmdW5jdGlvbihjaHVuayl7XG5cdFx0XHR3cml0ZVN0cmVhbS53cml0ZShjaHVuayk7XG5cdFx0XHR0b3RhbERvd25sb2FkQnl0ZSs9Y2h1bmsubGVuZ3RoO1xuXHRcdFx0aWYgKHVzZXJDYW5jZWwpIHtcblx0XHRcdFx0d3JpdGVTdHJlYW0uZW5kKCk7XG5cdFx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtuZXh0RmlsZSgpO30sMTAwKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHRyZXNwb25zZS5vbihcImVuZFwiLGZ1bmN0aW9uKCkge1xuXHRcdFx0d3JpdGVTdHJlYW0uZW5kKCk7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7bmV4dEZpbGUoKTt9LDEwMCk7XG5cdFx0fSk7XG5cdH0pO1xufVxuXG52YXIgY2FuY2VsRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XG5cdHVzZXJDYW5jZWw9dHJ1ZTtcblx0ZW5kRG93bmxvYWQoKTtcbn1cbnZhciB2ZXJpZnk9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0cnVlO1xufVxudmFyIGVuZERvd25sb2FkPWZ1bmN0aW9uKCkge1xuXHRuZmlsZT1maWxlcy5sZW5ndGgrMTsvL3N0b3Bcblx0cmVzdWx0PVwiY2FuY2VsbGVkXCI7XG5cdGRvd25sb2FkaW5nPWZhbHNlO1xuXHRpZiAodXNlckNhbmNlbCkgcmV0dXJuO1xuXHR2YXIgZnMgICAgID0gcmVxdWlyZShcImZzXCIpO1xuXHR2YXIgbWtkaXJwID0gcmVxdWlyZShcIi4vbWtkaXJwXCIpO1xuXG5cdGZvciAodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgdGFyZ2V0ZmlsZW5hbWU9dGFyZ2V0UGF0aCtmaWxlc1tpXTtcblx0XHR2YXIgdG1wZmlsZW5hbWUgICA9dGVtcFBhdGgrZmlsZXNbaV07XG5cdFx0bWtkaXJwLnN5bmMocGF0aC5kaXJuYW1lKHRhcmdldGZpbGVuYW1lKSk7XG5cdFx0ZnMucmVuYW1lU3luYyh0bXBmaWxlbmFtZSx0YXJnZXRmaWxlbmFtZSk7XG5cdH1cblx0aWYgKHZlcmlmeSgpKSB7XG5cdFx0cmVzdWx0PVwic3VjY2Vzc1wiO1xuXHR9IGVsc2Uge1xuXHRcdHJlc3VsdD1cImVycm9yXCI7XG5cdH1cbn1cblxudmFyIGRvd25sb2FkZWRCeXRlPWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gdG90YWxEb3dubG9hZEJ5dGU7XG59XG52YXIgZG9uZURvd25sb2FkPWZ1bmN0aW9uKCkge1xuXHRpZiAobmZpbGU+ZmlsZXMubGVuZ3RoKSByZXR1cm4gcmVzdWx0O1xuXHRlbHNlIHJldHVybiBcIlwiO1xufVxudmFyIGRvd25sb2FkaW5nRmlsZT1mdW5jdGlvbigpIHtcblx0cmV0dXJuIG5maWxlLTE7XG59XG5cbnZhciBkb3dubG9hZGVyPXtzdGFydERvd25sb2FkOnN0YXJ0RG93bmxvYWQsIGRvd25sb2FkZWRCeXRlOmRvd25sb2FkZWRCeXRlLFxuXHRkb3dubG9hZGluZ0ZpbGU6ZG93bmxvYWRpbmdGaWxlLCBjYW5jZWxEb3dubG9hZDpjYW5jZWxEb3dubG9hZCxkb25lRG93bmxvYWQ6ZG9uZURvd25sb2FkfTtcbm1vZHVsZS5leHBvcnRzPWRvd25sb2FkZXI7IiwiLyoqIEBqc3ggUmVhY3QuRE9NICovXG5cbi8qIHRvZG8gLCBvcHRpb25hbCBrZGIgKi9cblxudmFyIEh0bWxGUz1yZXF1aXJlKFwiLi9odG1sZnNcIik7XG52YXIgaHRtbDVmcz1yZXF1aXJlKFwiLi9odG1sNWZzXCIpO1xudmFyIENoZWNrQnJvd3Nlcj1yZXF1aXJlKFwiLi9jaGVja2Jyb3dzZXJcIik7XG52YXIgRT1SZWFjdC5jcmVhdGVFbGVtZW50O1xuICBcblxudmFyIEZpbGVMaXN0ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIHtkb3dubG9hZGluZzpmYWxzZSxwcm9ncmVzczowfTtcblx0fSxcblx0dXBkYXRhYmxlOmZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGNsYXNzZXM9XCJidG4gYnRuLXdhcm5pbmdcIjtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIGNsYXNzZXMrPVwiIGRpc2FibGVkXCI7XG5cdFx0aWYgKGYuaGFzVXBkYXRlKSByZXR1cm4gICBFKFwiYnV0dG9uXCIsIHtjbGFzc05hbWU6IGNsYXNzZXMsIFxuXHRcdFx0XCJkYXRhLWZpbGVuYW1lXCI6IGYuZmlsZW5hbWUsIFwiZGF0YS11cmxcIjogZi51cmwsIFxuXHQgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRvd25sb2FkXG5cdCAgICAgICB9LCBcIlVwZGF0ZVwiKVxuXHRcdGVsc2UgcmV0dXJuIG51bGw7XG5cdH0sXG5cdHNob3dMb2NhbDpmdW5jdGlvbihmKSB7XG4gICAgICAgIHZhciBjbGFzc2VzPVwiYnRuIGJ0bi1kYW5nZXJcIjtcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIGNsYXNzZXMrPVwiIGRpc2FibGVkXCI7XG5cdCAgcmV0dXJuIEUoXCJ0clwiLCBudWxsLCBFKFwidGRcIiwgbnVsbCwgZi5maWxlbmFtZSksIFxuXHQgICAgICBFKFwidGRcIiwgbnVsbCksIFxuXHQgICAgICBFKFwidGRcIiwge2NsYXNzTmFtZTogXCJwdWxsLXJpZ2h0XCJ9LCBcblx0ICAgICAgdGhpcy51cGRhdGFibGUoZiksIEUoXCJidXR0b25cIiwge2NsYXNzTmFtZTogY2xhc3NlcywgXG5cdCAgICAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuZGVsZXRlRmlsZSwgXCJkYXRhLWZpbGVuYW1lXCI6IGYuZmlsZW5hbWV9LCBcIkRlbGV0ZVwiKVxuXHQgICAgICAgIFxuXHQgICAgICApXG5cdCAgKVxuXHR9LCAgXG5cdHNob3dSZW1vdGU6ZnVuY3Rpb24oZikgeyBcblx0ICB2YXIgY2xhc3Nlcz1cImJ0biBidG4td2FybmluZ1wiO1xuXHQgIGlmICh0aGlzLnN0YXRlLmRvd25sb2FkaW5nKSBjbGFzc2VzKz1cIiBkaXNhYmxlZFwiO1xuXHQgIHJldHVybiAoRShcInRyXCIsIHtcImRhdGEtaWRcIjogZi5maWxlbmFtZX0sIEUoXCJ0ZFwiLCBudWxsLCBcblx0ICAgICAgZi5maWxlbmFtZSksIFxuXHQgICAgICBFKFwidGRcIiwgbnVsbCwgZi5kZXNjKSwgXG5cdCAgICAgIEUoXCJ0ZFwiLCBudWxsLCBcblx0ICAgICAgRShcInNwYW5cIiwge1wiZGF0YS1maWxlbmFtZVwiOiBmLmZpbGVuYW1lLCBcImRhdGEtdXJsXCI6IGYudXJsLCBcblx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBjbGFzc2VzLCBcblx0ICAgICAgICAgICAgb25DbGljazogdGhpcy5kb3dubG9hZH0sIFwiRG93bmxvYWRcIilcblx0ICAgICAgKVxuXHQgICkpO1xuXHR9LFxuXHRzaG93RmlsZTpmdW5jdGlvbihmKSB7XG5cdC8vXHRyZXR1cm4gPHNwYW4gZGF0YS1pZD17Zi5maWxlbmFtZX0+e2YudXJsfTwvc3Bhbj5cblx0XHRyZXR1cm4gKGYucmVhZHkpP3RoaXMuc2hvd0xvY2FsKGYpOnRoaXMuc2hvd1JlbW90ZShmKTtcblx0fSxcblx0cmVsb2FkRGlyOmZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucHJvcHMuYWN0aW9uKFwicmVsb2FkXCIpO1xuXHR9LFxuXHRkb3dubG9hZDpmdW5jdGlvbihlKSB7XG5cdFx0dmFyIHVybD1lLnRhcmdldC5kYXRhc2V0W1widXJsXCJdO1xuXHRcdHZhciBmaWxlbmFtZT1lLnRhcmdldC5kYXRhc2V0W1wiZmlsZW5hbWVcIl07XG5cdFx0dGhpcy5zZXRTdGF0ZSh7ZG93bmxvYWRpbmc6dHJ1ZSxwcm9ncmVzczowLHVybDp1cmx9KTtcblx0XHR0aGlzLnVzZXJicmVhaz1mYWxzZTtcblx0XHRodG1sNWZzLmRvd25sb2FkKHVybCxmaWxlbmFtZSxmdW5jdGlvbigpe1xuXHRcdFx0dGhpcy5yZWxvYWREaXIoKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe2Rvd25sb2FkaW5nOmZhbHNlLHByb2dyZXNzOjF9KTtcblx0XHRcdH0sZnVuY3Rpb24ocHJvZ3Jlc3MsdG90YWwpe1xuXHRcdFx0XHRpZiAocHJvZ3Jlc3M9PTApIHtcblx0XHRcdFx0XHR0aGlzLnNldFN0YXRlKHttZXNzYWdlOlwidG90YWwgXCIrdG90YWx9KVxuXHRcdFx0IFx0fVxuXHRcdFx0IFx0dGhpcy5zZXRTdGF0ZSh7cHJvZ3Jlc3M6cHJvZ3Jlc3N9KTtcblx0XHRcdCBcdC8vaWYgdXNlciBwcmVzcyBhYm9ydCByZXR1cm4gdHJ1ZVxuXHRcdFx0IFx0cmV0dXJuIHRoaXMudXNlcmJyZWFrO1xuXHRcdFx0fVxuXHRcdCx0aGlzKTtcblx0fSxcblx0ZGVsZXRlRmlsZTpmdW5jdGlvbiggZSkge1xuXHRcdHZhciBmaWxlbmFtZT1lLnRhcmdldC5hdHRyaWJ1dGVzW1wiZGF0YS1maWxlbmFtZVwiXS52YWx1ZTtcblx0XHR0aGlzLnByb3BzLmFjdGlvbihcImRlbGV0ZVwiLGZpbGVuYW1lKTtcblx0fSxcblx0YWxsRmlsZXNSZWFkeTpmdW5jdGlvbihlKSB7XG5cdFx0cmV0dXJuIHRoaXMucHJvcHMuZmlsZXMuZXZlcnkoZnVuY3Rpb24oZil7IHJldHVybiBmLnJlYWR5fSk7XG5cdH0sXG5cdGRpc21pc3M6ZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzLnJlZnMuZGlhbG9nMS5nZXRET01Ob2RlKCkpLm1vZGFsKCdoaWRlJyk7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJkaXNtaXNzXCIpO1xuXHR9LFxuXHRhYm9ydGRvd25sb2FkOmZ1bmN0aW9uKCkge1xuXHRcdHRoaXMudXNlcmJyZWFrPXRydWU7XG5cdH0sXG5cdHNob3dQcm9ncmVzczpmdW5jdGlvbigpIHtcblx0ICAgICBpZiAodGhpcy5zdGF0ZS5kb3dubG9hZGluZykge1xuXHQgICAgICB2YXIgcHJvZ3Jlc3M9TWF0aC5yb3VuZCh0aGlzLnN0YXRlLnByb2dyZXNzKjEwMCk7XG5cdCAgICAgIHJldHVybiAoXG5cdCAgICAgIFx0RShcImRpdlwiLCBudWxsLCBcblx0ICAgICAgXHRcIkRvd25sb2FkaW5nIGZyb20gXCIsIHRoaXMuc3RhdGUudXJsLCBcblx0ICAgICAgRShcImRpdlwiLCB7a2V5OiBcInByb2dyZXNzXCIsIGNsYXNzTmFtZTogXCJwcm9ncmVzcyBjb2wtbWQtOFwifSwgXG5cdCAgICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyXCIsIHJvbGU6IFwicHJvZ3Jlc3NiYXJcIiwgXG5cdCAgICAgICAgICAgICAgXCJhcmlhLXZhbHVlbm93XCI6IHByb2dyZXNzLCBcImFyaWEtdmFsdWVtaW5cIjogXCIwXCIsIFxuXHQgICAgICAgICAgICAgIFwiYXJpYS12YWx1ZW1heFwiOiBcIjEwMFwiLCBzdHlsZToge3dpZHRoOiBwcm9ncmVzcytcIiVcIn19LCBcblx0ICAgICAgICAgICAgcHJvZ3Jlc3MsIFwiJVwiXG5cdCAgICAgICAgICApXG5cdCAgICAgICAgKSwgXG5cdCAgICAgICAgRShcImJ1dHRvblwiLCB7b25DbGljazogdGhpcy5hYm9ydGRvd25sb2FkLCBcblx0ICAgICAgICBcdGNsYXNzTmFtZTogXCJidG4gYnRuLWRhbmdlciBjb2wtbWQtNFwifSwgXCJBYm9ydFwiKVxuXHQgICAgICAgIClcblx0ICAgICAgICApO1xuXHQgICAgICB9IGVsc2Uge1xuXHQgICAgICBcdFx0aWYgKCB0aGlzLmFsbEZpbGVzUmVhZHkoKSApIHtcblx0ICAgICAgXHRcdFx0cmV0dXJuIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuZGlzbWlzcywgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXCJPa1wiKVxuXHQgICAgICBcdFx0fSBlbHNlIHJldHVybiBudWxsO1xuXHQgICAgICBcdFx0XG5cdCAgICAgIH1cblx0fSxcblx0c2hvd1VzYWdlOmZ1bmN0aW9uKCkge1xuXHRcdHZhciBwZXJjZW50PXRoaXMucHJvcHMucmVtYWluUGVyY2VudDtcbiAgICAgICAgICAgcmV0dXJuIChFKFwiZGl2XCIsIG51bGwsIEUoXCJzcGFuXCIsIHtjbGFzc05hbWU6IFwicHVsbC1sZWZ0XCJ9LCBcIlVzYWdlOlwiKSwgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByb2dyZXNzXCJ9LCBcblx0XHQgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwcm9ncmVzcy1iYXIgcHJvZ3Jlc3MtYmFyLXN1Y2Nlc3MgcHJvZ3Jlc3MtYmFyLXN0cmlwZWRcIiwgcm9sZTogXCJwcm9ncmVzc2JhclwiLCBzdHlsZToge3dpZHRoOiBwZXJjZW50K1wiJVwifX0sIFxuXHRcdCAgICBcdHBlcmNlbnQrXCIlXCJcblx0XHQgIClcblx0XHQpKSk7XG5cdH0sXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcblx0ICBcdHJldHVybiAoXG5cdFx0RShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcblx0XHQgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWRpYWxvZ1wifSwgXG5cdFx0ICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWNvbnRlbnRcIn0sIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIkZpbGUgSW5zdGFsbGVyXCIpXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcblx0XHQgICAgICAgIFx0RShcInRhYmxlXCIsIHtjbGFzc05hbWU6IFwidGFibGVcIn0sIFxuXHRcdCAgICAgICAgXHRFKFwidGJvZHlcIiwgbnVsbCwgXG5cdFx0ICAgICAgICAgIFx0dGhpcy5wcm9wcy5maWxlcy5tYXAodGhpcy5zaG93RmlsZSlcblx0XHQgICAgICAgICAgXHQpXG5cdFx0ICAgICAgICAgIClcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWZvb3RlclwifSwgXG5cdFx0ICAgICAgICBcdHRoaXMuc2hvd1VzYWdlKCksIFxuXHRcdCAgICAgICAgICAgdGhpcy5zaG93UHJvZ3Jlc3MoKVxuXHRcdCAgICAgICAgKVxuXHRcdCAgICAgIClcblx0XHQgICAgKVxuXHRcdCAgKVxuXHRcdCk7XG5cdH0sXHRcblx0Y29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XG5cdFx0JCh0aGlzLnJlZnMuZGlhbG9nMS5nZXRET01Ob2RlKCkpLm1vZGFsKCdzaG93Jyk7XG5cdH1cbn0pO1xuLypUT0RPIGtkYiBjaGVjayB2ZXJzaW9uKi9cbnZhciBGaWxlbWFuYWdlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkge1xuXHRcdHZhciBxdW90YT10aGlzLmdldFF1b3RhKCk7XG5cdFx0cmV0dXJuIHticm93c2VyUmVhZHk6ZmFsc2Usbm91cGRhdGU6dHJ1ZSxcdHJlcXVlc3RRdW90YTpxdW90YSxyZW1haW46MH07XG5cdH0sXG5cdGdldFF1b3RhOmZ1bmN0aW9uKCkge1xuXHRcdHZhciBxPXRoaXMucHJvcHMucXVvdGF8fFwiMTI4TVwiO1xuXHRcdHZhciB1bml0PXFbcS5sZW5ndGgtMV07XG5cdFx0dmFyIHRpbWVzPTE7XG5cdFx0aWYgKHVuaXQ9PVwiTVwiKSB0aW1lcz0xMDI0KjEwMjQ7XG5cdFx0ZWxzZSBpZiAodW5pdD1cIktcIikgdGltZXM9MTAyNDtcblx0XHRyZXR1cm4gcGFyc2VJbnQocSkgKiB0aW1lcztcblx0fSxcblx0bWlzc2luZ0tkYjpmdW5jdGlvbigpIHtcblx0XHRpZiAoa3NhbmFnYXAucGxhdGZvcm0hPVwiY2hyb21lXCIpIHJldHVybiBbXTtcblx0XHR2YXIgbWlzc2luZz10aGlzLnByb3BzLm5lZWRlZC5maWx0ZXIoZnVuY3Rpb24oa2RiKXtcblx0XHRcdGZvciAodmFyIGkgaW4gaHRtbDVmcy5maWxlcykge1xuXHRcdFx0XHRpZiAoaHRtbDVmcy5maWxlc1tpXVswXT09a2RiLmZpbGVuYW1lKSByZXR1cm4gZmFsc2U7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gdHJ1ZTtcblx0XHR9LHRoaXMpO1xuXHRcdHJldHVybiBtaXNzaW5nO1xuXHR9LFxuXHRnZXRSZW1vdGVVcmw6ZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgZj10aGlzLnByb3BzLm5lZWRlZC5maWx0ZXIoZnVuY3Rpb24oZil7cmV0dXJuIGYuZmlsZW5hbWU9PWZufSk7XG5cdFx0aWYgKGYubGVuZ3RoICkgcmV0dXJuIGZbMF0udXJsO1xuXHR9LFxuXHRnZW5GaWxlTGlzdDpmdW5jdGlvbihleGlzdGluZyxtaXNzaW5nKXtcblx0XHR2YXIgb3V0PVtdO1xuXHRcdGZvciAodmFyIGkgaW4gZXhpc3RpbmcpIHtcblx0XHRcdHZhciB1cmw9dGhpcy5nZXRSZW1vdGVVcmwoZXhpc3RpbmdbaV1bMF0pO1xuXHRcdFx0b3V0LnB1c2goe2ZpbGVuYW1lOmV4aXN0aW5nW2ldWzBdLCB1cmwgOnVybCwgcmVhZHk6dHJ1ZSB9KTtcblx0XHR9XG5cdFx0Zm9yICh2YXIgaSBpbiBtaXNzaW5nKSB7XG5cdFx0XHRvdXQucHVzaChtaXNzaW5nW2ldKTtcblx0XHR9XG5cdFx0cmV0dXJuIG91dDtcblx0fSxcblx0cmVsb2FkOmZ1bmN0aW9uKCkge1xuXHRcdGh0bWw1ZnMucmVhZGRpcihmdW5jdGlvbihmaWxlcyl7XG4gIFx0XHRcdHRoaXMuc2V0U3RhdGUoe2ZpbGVzOnRoaXMuZ2VuRmlsZUxpc3QoZmlsZXMsdGhpcy5taXNzaW5nS2RiKCkpfSk7XG4gIFx0XHR9LHRoaXMpO1xuXHQgfSxcblx0ZGVsZXRlRmlsZTpmdW5jdGlvbihmbikge1xuXHQgIGh0bWw1ZnMucm0oZm4sZnVuY3Rpb24oKXtcblx0ICBcdHRoaXMucmVsb2FkKCk7XG5cdCAgfSx0aGlzKTtcblx0fSxcblx0b25RdW90ZU9rOmZ1bmN0aW9uKHF1b3RhLHVzYWdlKSB7XG5cdFx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtIT1cImNocm9tZVwiKSB7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwib25xdW90ZW9rXCIpO1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7bm91cGRhdGU6dHJ1ZSxtaXNzaW5nOltdLGZpbGVzOltdLGF1dG9jbG9zZTp0cnVlXG5cdFx0XHRcdCxxdW90YTpxdW90YSxyZW1haW46cXVvdGEtdXNhZ2UsdXNhZ2U6dXNhZ2V9KTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0Ly9jb25zb2xlLmxvZyhcInF1b3RlIG9rXCIpO1xuXHRcdHZhciBmaWxlcz10aGlzLmdlbkZpbGVMaXN0KGh0bWw1ZnMuZmlsZXMsdGhpcy5taXNzaW5nS2RiKCkpO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dGhhdC5jaGVja0lmVXBkYXRlKGZpbGVzLGZ1bmN0aW9uKGhhc3VwZGF0ZSkge1xuXHRcdFx0dmFyIG1pc3Npbmc9dGhpcy5taXNzaW5nS2RiKCk7XG5cdFx0XHR2YXIgYXV0b2Nsb3NlPXRoaXMucHJvcHMuYXV0b2Nsb3NlO1xuXHRcdFx0aWYgKG1pc3NpbmcubGVuZ3RoKSBhdXRvY2xvc2U9ZmFsc2U7XG5cdFx0XHR0aGF0LnNldFN0YXRlKHthdXRvY2xvc2U6YXV0b2Nsb3NlLFxuXHRcdFx0XHRxdW90YTpxdW90YSx1c2FnZTp1c2FnZSxmaWxlczpmaWxlcyxcblx0XHRcdFx0bWlzc2luZzptaXNzaW5nLFxuXHRcdFx0XHRub3VwZGF0ZTohaGFzdXBkYXRlLFxuXHRcdFx0XHRyZW1haW46cXVvdGEtdXNhZ2V9KTtcblx0XHR9KTtcblx0fSwgIFxuXHRvbkJyb3dzZXJPazpmdW5jdGlvbigpIHtcblx0ICB0aGlzLnRvdGFsRG93bmxvYWRTaXplKCk7XG5cdH0sIFxuXHRkaXNtaXNzOmZ1bmN0aW9uKCkge1xuXHRcdHRoaXMucHJvcHMub25SZWFkeSh0aGlzLnN0YXRlLnVzYWdlLHRoaXMuc3RhdGUucXVvdGEpO1xuXHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHRcdHZhciBtb2RhbGluPSQoXCIubW9kYWwuaW5cIik7XG5cdFx0XHRpZiAobW9kYWxpbi5tb2RhbCkgbW9kYWxpbi5tb2RhbCgnaGlkZScpO1xuXHRcdH0sNTAwKTtcblx0fSwgXG5cdHRvdGFsRG93bmxvYWRTaXplOmZ1bmN0aW9uKCkge1xuXHRcdHZhciBmaWxlcz10aGlzLm1pc3NpbmdLZGIoKTtcblx0XHR2YXIgdGFza3F1ZXVlPVtdLHRvdGFsc2l6ZT0wO1xuXHRcdGZvciAodmFyIGk9MDtpPGZpbGVzLmxlbmd0aDtpKyspIHtcblx0XHRcdHRhc2txdWV1ZS5wdXNoKFxuXHRcdFx0XHQoZnVuY3Rpb24oaWR4KXtcblx0XHRcdFx0XHRyZXR1cm4gKGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0aWYgKCEodHlwZW9mIGRhdGE9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkpIHRvdGFsc2l6ZSs9ZGF0YTtcblx0XHRcdFx0XHRcdGh0bWw1ZnMuZ2V0RG93bmxvYWRTaXplKGZpbGVzW2lkeF0udXJsLHRhc2txdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSkoaSlcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHRcblx0XHRcdHRvdGFsc2l6ZSs9ZGF0YTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXt0aGF0LnNldFN0YXRlKHtyZXF1aXJlU3BhY2U6dG90YWxzaXplLGJyb3dzZXJSZWFkeTp0cnVlfSl9LDApO1xuXHRcdH0pO1xuXHRcdHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTtcblx0fSxcblx0Y2hlY2tJZlVwZGF0ZTpmdW5jdGlvbihmaWxlcyxjYikge1xuXHRcdHZhciB0YXNrcXVldWU9W107XG5cdFx0Zm9yICh2YXIgaT0wO2k8ZmlsZXMubGVuZ3RoO2krKykge1xuXHRcdFx0dGFza3F1ZXVlLnB1c2goXG5cdFx0XHRcdChmdW5jdGlvbihpZHgpe1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRpZiAoISh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkgZmlsZXNbaWR4LTFdLmhhc1VwZGF0ZT1kYXRhO1xuXHRcdFx0XHRcdFx0aHRtbDVmcy5jaGVja1VwZGF0ZShmaWxlc1tpZHhdLnVybCxmaWxlc1tpZHhdLmZpbGVuYW1lLHRhc2txdWV1ZS5zaGlmdCgpKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fSkoaSlcblx0XHRcdCk7XG5cdFx0fVxuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XHRcblx0XHRcdGZpbGVzW2ZpbGVzLmxlbmd0aC0xXS5oYXNVcGRhdGU9ZGF0YTtcblx0XHRcdHZhciBoYXN1cGRhdGU9ZmlsZXMuc29tZShmdW5jdGlvbihmKXtyZXR1cm4gZi5oYXNVcGRhdGV9KTtcblx0XHRcdGlmIChjYikgY2IuYXBwbHkodGhhdCxbaGFzdXBkYXRlXSk7XG5cdFx0fSk7XG5cdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xuXHR9LFxuXHRyZW5kZXI6ZnVuY3Rpb24oKXtcbiAgICBcdFx0aWYgKCF0aGlzLnN0YXRlLmJyb3dzZXJSZWFkeSkgeyAgIFxuICAgICAgXHRcdFx0cmV0dXJuIEUoQ2hlY2tCcm93c2VyLCB7ZmVhdHVyZTogXCJmc1wiLCBvblJlYWR5OiB0aGlzLm9uQnJvd3Nlck9rfSlcbiAgICBcdFx0fSBpZiAoIXRoaXMuc3RhdGUucXVvdGEgfHwgdGhpcy5zdGF0ZS5yZW1haW48dGhpcy5zdGF0ZS5yZXF1aXJlU3BhY2UpIHsgIFxuICAgIFx0XHRcdHZhciBxdW90YT10aGlzLnN0YXRlLnJlcXVlc3RRdW90YTtcbiAgICBcdFx0XHRpZiAodGhpcy5zdGF0ZS51c2FnZSt0aGlzLnN0YXRlLnJlcXVpcmVTcGFjZT5xdW90YSkge1xuICAgIFx0XHRcdFx0cXVvdGE9KHRoaXMuc3RhdGUudXNhZ2UrdGhpcy5zdGF0ZS5yZXF1aXJlU3BhY2UpKjEuNTtcbiAgICBcdFx0XHR9XG4gICAgICBcdFx0XHRyZXR1cm4gRShIdG1sRlMsIHtxdW90YTogcXVvdGEsIGF1dG9jbG9zZTogXCJ0cnVlXCIsIG9uUmVhZHk6IHRoaXMub25RdW90ZU9rfSlcbiAgICAgIFx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCF0aGlzLnN0YXRlLm5vdXBkYXRlIHx8IHRoaXMubWlzc2luZ0tkYigpLmxlbmd0aCB8fCAhdGhpcy5zdGF0ZS5hdXRvY2xvc2UpIHtcblx0XHRcdFx0dmFyIHJlbWFpbj1NYXRoLnJvdW5kKCh0aGlzLnN0YXRlLnVzYWdlL3RoaXMuc3RhdGUucXVvdGEpKjEwMCk7XHRcdFx0XHRcblx0XHRcdFx0cmV0dXJuIEUoRmlsZUxpc3QsIHthY3Rpb246IHRoaXMuYWN0aW9uLCBmaWxlczogdGhpcy5zdGF0ZS5maWxlcywgcmVtYWluUGVyY2VudDogcmVtYWlufSlcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHNldFRpbWVvdXQoIHRoaXMuZGlzbWlzcyAsMCk7XG5cdFx0XHRcdHJldHVybiBFKFwic3BhblwiLCBudWxsLCBcIlN1Y2Nlc3NcIik7XG5cdFx0XHR9XG4gICAgICBcdFx0fVxuXHR9LFxuXHRhY3Rpb246ZnVuY3Rpb24oKSB7XG5cdCAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuXHQgIHZhciB0eXBlPWFyZ3Muc2hpZnQoKTtcblx0ICB2YXIgcmVzPW51bGwsIHRoYXQ9dGhpcztcblx0ICBpZiAodHlwZT09XCJkZWxldGVcIikge1xuXHQgICAgdGhpcy5kZWxldGVGaWxlKGFyZ3NbMF0pO1xuXHQgIH0gIGVsc2UgaWYgKHR5cGU9PVwicmVsb2FkXCIpIHtcblx0ICBcdHRoaXMucmVsb2FkKCk7XG5cdCAgfSBlbHNlIGlmICh0eXBlPT1cImRpc21pc3NcIikge1xuXHQgIFx0dGhpcy5kaXNtaXNzKCk7XG5cdCAgfVxuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHM9RmlsZW1hbmFnZXI7IiwiLyogZW11bGF0ZSBmaWxlc3lzdGVtIG9uIGh0bWw1IGJyb3dzZXIgKi9cbnZhciBnZXRfaGVhZD1mdW5jdGlvbih1cmwsZmllbGQsY2Ipe1xuXHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdHhoci5vcGVuKFwiSEVBRFwiLCB1cmwsIHRydWUpO1xuXHR4aHIub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodGhpcy5yZWFkeVN0YXRlID09IHRoaXMuRE9ORSkge1xuXHRcdFx0XHRjYih4aHIuZ2V0UmVzcG9uc2VIZWFkZXIoZmllbGQpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmICh0aGlzLnN0YXR1cyE9PTIwMCYmdGhpcy5zdGF0dXMhPT0yMDYpIHtcblx0XHRcdFx0XHRjYihcIlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBcblx0fTtcblx0eGhyLnNlbmQoKTtcdFxufVxudmFyIGdldF9kYXRlPWZ1bmN0aW9uKHVybCxjYikge1xuXHRnZXRfaGVhZCh1cmwsXCJMYXN0LU1vZGlmaWVkXCIsZnVuY3Rpb24odmFsdWUpe1xuXHRcdGNiKHZhbHVlKTtcblx0fSk7XG59XG52YXIgZ2V0X3NpemU9ZnVuY3Rpb24odXJsLCBjYikge1xuXHRnZXRfaGVhZCh1cmwsXCJDb250ZW50LUxlbmd0aFwiLGZ1bmN0aW9uKHZhbHVlKXtcblx0XHRjYihwYXJzZUludCh2YWx1ZSkpO1xuXHR9KTtcbn07XG52YXIgY2hlY2tVcGRhdGU9ZnVuY3Rpb24odXJsLGZuLGNiKSB7XG5cdGlmICghdXJsKSB7XG5cdFx0Y2IoZmFsc2UpO1xuXHRcdHJldHVybjtcblx0fVxuXHRnZXRfZGF0ZSh1cmwsZnVuY3Rpb24oZCl7XG5cdFx0QVBJLmZzLnJvb3QuZ2V0RmlsZShmbiwge2NyZWF0ZTogZmFsc2UsIGV4Y2x1c2l2ZTogZmFsc2V9LCBmdW5jdGlvbihmaWxlRW50cnkpIHtcblx0XHRcdGZpbGVFbnRyeS5nZXRNZXRhZGF0YShmdW5jdGlvbihtZXRhZGF0YSl7XG5cdFx0XHRcdHZhciBsb2NhbERhdGU9RGF0ZS5wYXJzZShtZXRhZGF0YS5tb2RpZmljYXRpb25UaW1lKTtcblx0XHRcdFx0dmFyIHVybERhdGU9RGF0ZS5wYXJzZShkKTtcblx0XHRcdFx0Y2IodXJsRGF0ZT5sb2NhbERhdGUpO1xuXHRcdFx0fSk7XG5cdFx0fSxmdW5jdGlvbigpe1xuXHRcdFx0Y2IoZmFsc2UpO1xuXHRcdH0pO1xuXHR9KTtcbn1cbnZhciBkb3dubG9hZD1mdW5jdGlvbih1cmwsZm4sY2Isc3RhdHVzY2IsY29udGV4dCkge1xuXHQgdmFyIHRvdGFsc2l6ZT0wLGJhdGNoZXM9bnVsbCx3cml0dGVuPTA7XG5cdCB2YXIgZmlsZUVudHJ5PTAsIGZpbGVXcml0ZXI9MDtcblx0IHZhciBjcmVhdGVCYXRjaGVzPWZ1bmN0aW9uKHNpemUpIHtcblx0XHR2YXIgYnl0ZXM9MTAyNCoxMDI0LCBvdXQ9W107XG5cdFx0dmFyIGI9TWF0aC5mbG9vcihzaXplIC8gYnl0ZXMpO1xuXHRcdHZhciBsYXN0PXNpemUgJWJ5dGVzO1xuXHRcdGZvciAodmFyIGk9MDtpPD1iO2krKykge1xuXHRcdFx0b3V0LnB1c2goaSpieXRlcyk7XG5cdFx0fVxuXHRcdG91dC5wdXNoKGIqYnl0ZXMrbGFzdCk7XG5cdFx0cmV0dXJuIG91dDtcblx0IH1cblx0IHZhciBmaW5pc2g9ZnVuY3Rpb24oKSB7XG5cdFx0IHJtKGZuLGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGZpbGVFbnRyeS5tb3ZlVG8oZmlsZUVudHJ5LmZpbGVzeXN0ZW0ucm9vdCwgZm4sZnVuY3Rpb24oKXtcblx0XHRcdFx0XHRzZXRUaW1lb3V0KCBjYi5iaW5kKGNvbnRleHQsZmFsc2UpICwgMCkgOyBcblx0XHRcdFx0fSxmdW5jdGlvbihlKXtcblx0XHRcdFx0XHRjb25zb2xlLmxvZyhcImZhaWxlZFwiLGUpXG5cdFx0XHRcdH0pO1xuXHRcdCB9LHRoaXMpOyBcblx0IH07XG5cdFx0dmFyIHRlbXBmbj1cInRlbXAua2RiXCI7XG5cdFx0dmFyIGJhdGNoPWZ1bmN0aW9uKGIpIHtcblx0XHR2YXIgYWJvcnQ9ZmFsc2U7XG5cdFx0dmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdHZhciByZXF1ZXN0dXJsPXVybCtcIj9cIitNYXRoLnJhbmRvbSgpO1xuXHRcdHhoci5vcGVuKCdnZXQnLCByZXF1ZXN0dXJsLCB0cnVlKTtcblx0XHR4aHIuc2V0UmVxdWVzdEhlYWRlcignUmFuZ2UnLCAnYnl0ZXM9JytiYXRjaGVzW2JdKyctJysoYmF0Y2hlc1tiKzFdLTEpKTtcblx0XHR4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InOyAgICBcblx0XHR4aHIuYWRkRXZlbnRMaXN0ZW5lcignbG9hZCcsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIGJsb2I9dGhpcy5yZXNwb25zZTtcblx0XHRcdGZpbGVFbnRyeS5jcmVhdGVXcml0ZXIoZnVuY3Rpb24oZmlsZVdyaXRlcikge1xuXHRcdFx0XHRmaWxlV3JpdGVyLnNlZWsoZmlsZVdyaXRlci5sZW5ndGgpO1xuXHRcdFx0XHRmaWxlV3JpdGVyLndyaXRlKGJsb2IpO1xuXHRcdFx0XHR3cml0dGVuKz1ibG9iLnNpemU7XG5cdFx0XHRcdGZpbGVXcml0ZXIub253cml0ZWVuZCA9IGZ1bmN0aW9uKGUpIHtcblx0XHRcdFx0XHRpZiAoc3RhdHVzY2IpIHtcblx0XHRcdFx0XHRcdGFib3J0PXN0YXR1c2NiLmFwcGx5KGNvbnRleHQsWyBmaWxlV3JpdGVyLmxlbmd0aCAvIHRvdGFsc2l6ZSx0b3RhbHNpemUgXSk7XG5cdFx0XHRcdFx0XHRpZiAoYWJvcnQpIHNldFRpbWVvdXQoIGNiLmJpbmQoY29udGV4dCxmYWxzZSkgLCAwKSA7XG5cdFx0XHRcdCBcdH1cblx0XHRcdFx0XHRiKys7XG5cdFx0XHRcdFx0aWYgKCFhYm9ydCkge1xuXHRcdFx0XHRcdFx0aWYgKGI8YmF0Y2hlcy5sZW5ndGgtMSkgc2V0VGltZW91dChiYXRjaC5iaW5kKGNvbnRleHQsYiksMCk7XG5cdFx0XHRcdFx0XHRlbHNlICAgICAgICAgICAgICAgICAgICBmaW5pc2goKTtcblx0XHRcdFx0IFx0fVxuXHRcdFx0IFx0fTtcblx0XHRcdH0sIGNvbnNvbGUuZXJyb3IpO1xuXHRcdH0sZmFsc2UpO1xuXHRcdHhoci5zZW5kKCk7XG5cdH1cblxuXHRnZXRfc2l6ZSh1cmwsZnVuY3Rpb24oc2l6ZSl7XG5cdFx0dG90YWxzaXplPXNpemU7XG5cdFx0aWYgKCFzaXplKSB7XG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2ZhbHNlXSk7XG5cdFx0fSBlbHNlIHsvL3JlYWR5IHRvIGRvd25sb2FkXG5cdFx0XHRybSh0ZW1wZm4sZnVuY3Rpb24oKXtcblx0XHRcdFx0IGJhdGNoZXM9Y3JlYXRlQmF0Y2hlcyhzaXplKTtcblx0XHRcdFx0IGlmIChzdGF0dXNjYikgc3RhdHVzY2IuYXBwbHkoY29udGV4dCxbIDAsIHRvdGFsc2l6ZSBdKTtcblx0XHRcdFx0IEFQSS5mcy5yb290LmdldEZpbGUodGVtcGZuLCB7Y3JlYXRlOiAxLCBleGNsdXNpdmU6IGZhbHNlfSwgZnVuY3Rpb24oX2ZpbGVFbnRyeSkge1xuXHRcdFx0XHRcdFx0XHRmaWxlRW50cnk9X2ZpbGVFbnRyeTtcblx0XHRcdFx0XHRcdGJhdGNoKDApO1xuXHRcdFx0XHQgfSk7XG5cdFx0XHR9LHRoaXMpO1xuXHRcdH1cblx0fSk7XG59XG5cbnZhciByZWFkRmlsZT1mdW5jdGlvbihmaWxlbmFtZSxjYixjb250ZXh0KSB7XG5cdEFQSS5mcy5yb290LmdldEZpbGUoZmlsZW5hbWUsIGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuXHRcdFx0dmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG5cdFx0XHRyZWFkZXIub25sb2FkZW5kID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGlmIChjYikgY2IuYXBwbHkoY2IsW3RoaXMucmVzdWx0XSk7XG5cdFx0XHRcdH07ICAgICAgICAgICAgXG5cdH0sIGNvbnNvbGUuZXJyb3IpO1xufVxudmFyIHdyaXRlRmlsZT1mdW5jdGlvbihmaWxlbmFtZSxidWYsY2IsY29udGV4dCl7XG5cdEFQSS5mcy5yb290LmdldEZpbGUoZmlsZW5hbWUsIHtjcmVhdGU6IHRydWUsIGV4Y2x1c2l2ZTogdHJ1ZX0sIGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuXHRcdFx0ZmlsZUVudHJ5LmNyZWF0ZVdyaXRlcihmdW5jdGlvbihmaWxlV3JpdGVyKSB7XG5cdFx0XHRcdGZpbGVXcml0ZXIud3JpdGUoYnVmKTtcblx0XHRcdFx0ZmlsZVdyaXRlci5vbndyaXRlZW5kID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGlmIChjYikgY2IuYXBwbHkoY2IsW2J1Zi5ieXRlTGVuZ3RoXSk7XG5cdFx0XHRcdH07ICAgICAgICAgICAgXG5cdFx0XHR9LCBjb25zb2xlLmVycm9yKTtcblx0fSwgY29uc29sZS5lcnJvcik7XG59XG5cbnZhciByZWFkZGlyPWZ1bmN0aW9uKGNiLGNvbnRleHQpIHtcblx0dmFyIGRpclJlYWRlciA9IEFQSS5mcy5yb290LmNyZWF0ZVJlYWRlcigpO1xuXHR2YXIgb3V0PVtdLHRoYXQ9dGhpcztcblx0ZGlyUmVhZGVyLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGVudHJpZXMpIHtcblx0XHRpZiAoZW50cmllcy5sZW5ndGgpIHtcblx0XHRcdGZvciAodmFyIGkgPSAwLCBlbnRyeTsgZW50cnkgPSBlbnRyaWVzW2ldOyArK2kpIHtcblx0XHRcdFx0aWYgKGVudHJ5LmlzRmlsZSkge1xuXHRcdFx0XHRcdG91dC5wdXNoKFtlbnRyeS5uYW1lLGVudHJ5LnRvVVJMID8gZW50cnkudG9VUkwoKSA6IGVudHJ5LnRvVVJJKCldKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRBUEkuZmlsZXM9b3V0O1xuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbb3V0XSk7XG5cdH0sIGZ1bmN0aW9uKCl7XG5cdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtudWxsXSk7XG5cdH0pO1xufVxudmFyIGdldEZpbGVVUkw9ZnVuY3Rpb24oZmlsZW5hbWUpIHtcblx0aWYgKCFBUEkuZmlsZXMgKSByZXR1cm4gbnVsbDtcblx0dmFyIGZpbGU9IEFQSS5maWxlcy5maWx0ZXIoZnVuY3Rpb24oZil7cmV0dXJuIGZbMF09PWZpbGVuYW1lfSk7XG5cdGlmIChmaWxlLmxlbmd0aCkgcmV0dXJuIGZpbGVbMF1bMV07XG59XG52YXIgcm09ZnVuY3Rpb24oZmlsZW5hbWUsY2IsY29udGV4dCkge1xuXHR2YXIgdXJsPWdldEZpbGVVUkwoZmlsZW5hbWUpO1xuXHRpZiAodXJsKSBybVVSTCh1cmwsY2IsY29udGV4dCk7XG5cdGVsc2UgaWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtmYWxzZV0pO1xufVxuXG52YXIgcm1VUkw9ZnVuY3Rpb24oZmlsZW5hbWUsY2IsY29udGV4dCkge1xuXHR3ZWJraXRSZXNvbHZlTG9jYWxGaWxlU3lzdGVtVVJMKGZpbGVuYW1lLCBmdW5jdGlvbihmaWxlRW50cnkpIHtcblx0XHRmaWxlRW50cnkucmVtb3ZlKGZ1bmN0aW9uKCkge1xuXHRcdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFt0cnVlXSk7XG5cdFx0fSwgY29uc29sZS5lcnJvcik7XG5cdH0sICBmdW5jdGlvbihlKXtcblx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2ZhbHNlXSk7Ly9ubyBzdWNoIGZpbGVcblx0fSk7XG59XG5mdW5jdGlvbiBlcnJvckhhbmRsZXIoZSkge1xuXHRjb25zb2xlLmVycm9yKCdFcnJvcjogJyArZS5uYW1lKyBcIiBcIitlLm1lc3NhZ2UpO1xufVxudmFyIGluaXRmcz1mdW5jdGlvbihncmFudGVkQnl0ZXMsY2IsY29udGV4dCkge1xuXHR3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbShQRVJTSVNURU5ULCBncmFudGVkQnl0ZXMsICBmdW5jdGlvbihmcykge1xuXHRcdEFQSS5mcz1mcztcblx0XHRBUEkucXVvdGE9Z3JhbnRlZEJ5dGVzO1xuXHRcdHJlYWRkaXIoZnVuY3Rpb24oKXtcblx0XHRcdEFQSS5pbml0aWFsaXplZD10cnVlO1xuXHRcdFx0Y2IuYXBwbHkoY29udGV4dCxbZ3JhbnRlZEJ5dGVzLGZzXSk7XG5cdFx0fSxjb250ZXh0KTtcblx0fSwgZXJyb3JIYW5kbGVyKTtcbn1cbnZhciBpbml0PWZ1bmN0aW9uKHF1b3RhLGNiLGNvbnRleHQpIHtcblx0bmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlLnJlcXVlc3RRdW90YShxdW90YSwgXG5cdFx0XHRmdW5jdGlvbihncmFudGVkQnl0ZXMpIHtcblx0XHRcdFx0aW5pdGZzKGdyYW50ZWRCeXRlcyxjYixjb250ZXh0KTtcblx0XHR9LCBlcnJvckhhbmRsZXJcblx0KTtcbn1cbnZhciBxdWVyeVF1b3RhPWZ1bmN0aW9uKGNiLGNvbnRleHQpIHtcblx0dmFyIHRoYXQ9dGhpcztcblx0bmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlLnF1ZXJ5VXNhZ2VBbmRRdW90YSggXG5cdCBmdW5jdGlvbih1c2FnZSxxdW90YSl7XG5cdFx0XHRpbml0ZnMocXVvdGEsZnVuY3Rpb24oKXtcblx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dCxbdXNhZ2UscXVvdGFdKTtcblx0XHRcdH0sY29udGV4dCk7XG5cdH0pO1xufVxudmFyIEFQST17XG5cdGluaXQ6aW5pdFxuXHQscmVhZGRpcjpyZWFkZGlyXG5cdCxjaGVja1VwZGF0ZTpjaGVja1VwZGF0ZVxuXHQscm06cm1cblx0LHJtVVJMOnJtVVJMXG5cdCxnZXRGaWxlVVJMOmdldEZpbGVVUkxcblx0LHdyaXRlRmlsZTp3cml0ZUZpbGVcblx0LHJlYWRGaWxlOnJlYWRGaWxlXG5cdCxkb3dubG9hZDpkb3dubG9hZFxuXHQsZ2V0X2hlYWQ6Z2V0X2hlYWRcblx0LGdldF9kYXRlOmdldF9kYXRlXG5cdCxnZXRfc2l6ZTpnZXRfc2l6ZVxuXHQsZ2V0RG93bmxvYWRTaXplOmdldF9zaXplXG5cdCxxdWVyeVF1b3RhOnF1ZXJ5UXVvdGFcbn1cbm1vZHVsZS5leHBvcnRzPUFQSTsiLCJ2YXIgaHRtbDVmcz1yZXF1aXJlKFwiLi9odG1sNWZzXCIpO1xudmFyIEU9UmVhY3QuY3JlYXRlRWxlbWVudDtcblxudmFyIGh0bWxmcyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcblx0Z2V0SW5pdGlhbFN0YXRlOmZ1bmN0aW9uKCkgeyBcblx0XHRyZXR1cm4ge3JlYWR5OmZhbHNlLCBxdW90YTowLHVzYWdlOjAsSW5pdGlhbGl6ZWQ6ZmFsc2UsYXV0b2Nsb3NlOnRoaXMucHJvcHMuYXV0b2Nsb3NlfTtcblx0fSxcblx0aW5pdEZpbGVzeXN0ZW06ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHF1b3RhPXRoaXMucHJvcHMucXVvdGF8fDEwMjQqMTAyNCoxMjg7IC8vIGRlZmF1bHQgMTI4TUJcblx0XHRxdW90YT1wYXJzZUludChxdW90YSk7XG5cdFx0aHRtbDVmcy5pbml0KHF1b3RhLGZ1bmN0aW9uKHEpe1xuXHRcdFx0dGhpcy5kaWFsb2c9ZmFsc2U7XG5cdFx0XHQkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ2hpZGUnKTtcblx0XHRcdHRoaXMuc2V0U3RhdGUoe3F1b3RhOnEsYXV0b2Nsb3NlOnRydWV9KTtcblx0XHR9LHRoaXMpO1xuXHR9LFxuXHR3ZWxjb21lOmZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiAoXG5cdFx0RShcImRpdlwiLCB7cmVmOiBcImRpYWxvZzFcIiwgY2xhc3NOYW1lOiBcIm1vZGFsIGZhZGVcIiwgaWQ6IFwibXlNb2RhbFwiLCBcImRhdGEtYmFja2Ryb3BcIjogXCJzdGF0aWNcIn0sIFxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcblx0XHQgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtY29udGVudFwifSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtaGVhZGVyXCJ9LCBcblx0XHQgICAgICAgICAgRShcImg0XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtdGl0bGVcIn0sIFwiV2VsY29tZVwiKVxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtYm9keVwifSwgXG5cdFx0ICAgICAgICAgIFwiQnJvd3NlciB3aWxsIGFzayBmb3IgeW91ciBjb25maXJtYXRpb24uXCJcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWZvb3RlclwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuaW5pdEZpbGVzeXN0ZW0sIHR5cGU6IFwiYnV0dG9uXCIsIFxuXHRcdCAgICAgICAgICAgIGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIn0sIFwiSW5pdGlhbGl6ZSBGaWxlIFN5c3RlbVwiKVxuXHRcdCAgICAgICAgKVxuXHRcdCAgICAgIClcblx0XHQgICAgKVxuXHRcdCAgKVxuXHRcdCApO1xuXHR9LFxuXHRyZW5kZXJEZWZhdWx0OmZ1bmN0aW9uKCl7XG5cdFx0dmFyIHVzZWQ9TWF0aC5mbG9vcih0aGlzLnN0YXRlLnVzYWdlL3RoaXMuc3RhdGUucXVvdGEgKjEwMCk7XG5cdFx0dmFyIG1vcmU9ZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAodXNlZD41MCkgcmV0dXJuIEUoXCJidXR0b25cIiwge3R5cGU6IFwiYnV0dG9uXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXByaW1hcnlcIn0sIFwiQWxsb2NhdGUgTW9yZVwiKTtcblx0XHRcdGVsc2UgbnVsbDtcblx0XHR9XG5cdFx0cmV0dXJuIChcblx0XHRFKFwiZGl2XCIsIHtyZWY6IFwiZGlhbG9nMVwiLCBjbGFzc05hbWU6IFwibW9kYWwgZmFkZVwiLCBpZDogXCJteU1vZGFsXCIsIFwiZGF0YS1iYWNrZHJvcFwiOiBcInN0YXRpY1wifSwgXG5cdFx0ICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1kaWFsb2dcIn0sIFxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1oZWFkZXJcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiaDRcIiwge2NsYXNzTmFtZTogXCJtb2RhbC10aXRsZVwifSwgXCJTYW5kYm94IEZpbGUgU3lzdGVtXCIpXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcblx0XHQgICAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByb2dyZXNzXCJ9LCBcblx0XHQgICAgICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3MtYmFyXCIsIHJvbGU6IFwicHJvZ3Jlc3NiYXJcIiwgc3R5bGU6IHt3aWR0aDogdXNlZCtcIiVcIn19LCBcblx0XHQgICAgICAgICAgICAgICB1c2VkLCBcIiVcIlxuXHRcdCAgICAgICAgICAgIClcblx0XHQgICAgICAgICAgKSwgXG5cdFx0ICAgICAgICAgIEUoXCJzcGFuXCIsIG51bGwsIHRoaXMuc3RhdGUucXVvdGEsIFwiIHRvdGFsICwgXCIsIHRoaXMuc3RhdGUudXNhZ2UsIFwiIGluIHVzZWRcIilcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWZvb3RlclwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJidXR0b25cIiwge29uQ2xpY2s6IHRoaXMuZGlzbWlzcywgdHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tZGVmYXVsdFwiLCBcImRhdGEtZGlzbWlzc1wiOiBcIm1vZGFsXCJ9LCBcIkNsb3NlXCIpLCBcblx0XHQgICAgICAgICAgbW9yZSgpXG5cdFx0ICAgICAgICApXG5cdFx0ICAgICAgKVxuXHRcdCAgICApXG5cdFx0ICApXG5cdFx0ICApO1xuXHR9LFxuXHRkaXNtaXNzOmZ1bmN0aW9uKCkge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dGhhdC5wcm9wcy5vblJlYWR5KHRoYXQuc3RhdGUucXVvdGEsdGhhdC5zdGF0ZS51c2FnZSk7XHRcblx0XHR9LDApO1xuXHR9LFxuXHRxdWVyeVF1b3RhOmZ1bmN0aW9uKCkge1xuXHRcdGlmIChrc2FuYWdhcC5wbGF0Zm9ybT09XCJjaHJvbWVcIikge1xuXHRcdFx0aHRtbDVmcy5xdWVyeVF1b3RhKGZ1bmN0aW9uKHVzYWdlLHF1b3RhKXtcblx0XHRcdFx0dGhpcy5zZXRTdGF0ZSh7dXNhZ2U6dXNhZ2UscXVvdGE6cXVvdGEsaW5pdGlhbGl6ZWQ6dHJ1ZX0pO1xuXHRcdFx0fSx0aGlzKTtcdFx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7dXNhZ2U6MzMzLHF1b3RhOjEwMDAqMTAwMCoxMDI0LGluaXRpYWxpemVkOnRydWUsYXV0b2Nsb3NlOnRydWV9KTtcblx0XHR9XG5cdH0sXG5cdHJlbmRlcjpmdW5jdGlvbigpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGlmICghdGhpcy5zdGF0ZS5xdW90YSB8fCB0aGlzLnN0YXRlLnF1b3RhPHRoaXMucHJvcHMucXVvdGEpIHtcblx0XHRcdGlmICh0aGlzLnN0YXRlLmluaXRpYWxpemVkKSB7XG5cdFx0XHRcdHRoaXMuZGlhbG9nPXRydWU7XG5cdFx0XHRcdHJldHVybiB0aGlzLndlbGNvbWUoKTtcdFxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIEUoXCJzcGFuXCIsIG51bGwsIFwiY2hlY2tpbmcgcXVvdGFcIik7XG5cdFx0XHR9XHRcdFx0XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghdGhpcy5zdGF0ZS5hdXRvY2xvc2UpIHtcblx0XHRcdFx0dGhpcy5kaWFsb2c9dHJ1ZTtcblx0XHRcdFx0cmV0dXJuIHRoaXMucmVuZGVyRGVmYXVsdCgpOyBcblx0XHRcdH1cblx0XHRcdHRoaXMuZGlzbWlzcygpO1xuXHRcdFx0dGhpcy5kaWFsb2c9ZmFsc2U7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH0sXG5cdGNvbXBvbmVudERpZE1vdW50OmZ1bmN0aW9uKCkge1xuXHRcdGlmICghdGhpcy5zdGF0ZS5xdW90YSkge1xuXHRcdFx0dGhpcy5xdWVyeVF1b3RhKCk7XG5cblx0XHR9O1xuXHR9LFxuXHRjb21wb25lbnREaWRVcGRhdGU6ZnVuY3Rpb24oKSB7XG5cdFx0aWYgKHRoaXMuZGlhbG9nKSAkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzPWh0bWxmczsiLCJ2YXIga3NhbmE9e1wicGxhdGZvcm1cIjpcInJlbW90ZVwifTtcbmlmICh0eXBlb2Ygd2luZG93IT1cInVuZGVmaW5lZFwiKSB7XG5cdHdpbmRvdy5rc2FuYT1rc2FuYTtcblx0aWYgKHR5cGVvZiBrc2FuYWdhcD09XCJ1bmRlZmluZWRcIikge1xuXHRcdHdpbmRvdy5rc2FuYWdhcD1yZXF1aXJlKFwiLi9rc2FuYWdhcFwiKTsgLy9jb21wYXRpYmxlIGxheWVyIHdpdGggbW9iaWxlXG5cdH1cbn1cbmlmICh0eXBlb2YgcHJvY2VzcyAhPVwidW5kZWZpbmVkXCIpIHtcblx0aWYgKHByb2Nlc3MudmVyc2lvbnMgJiYgcHJvY2Vzcy52ZXJzaW9uc1tcIm5vZGUtd2Via2l0XCJdKSB7XG4gIFx0XHRpZiAodHlwZW9mIG5vZGVSZXF1aXJlIT1cInVuZGVmaW5lZFwiKSBrc2FuYS5yZXF1aXJlPW5vZGVSZXF1aXJlO1xuICBcdFx0a3NhbmEucGxhdGZvcm09XCJub2RlLXdlYmtpdFwiO1xuICBcdFx0d2luZG93LmtzYW5hZ2FwLnBsYXRmb3JtPVwibm9kZS13ZWJraXRcIjtcblx0XHR2YXIga3NhbmFqcz1yZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKFwia3NhbmEuanNcIixcInV0ZjhcIikudHJpbSgpO1xuXHRcdGtzYW5hLmpzPUpTT04ucGFyc2Uoa3NhbmFqcy5zdWJzdHJpbmcoMTQsa3NhbmFqcy5sZW5ndGgtMSkpO1xuXHRcdHdpbmRvdy5rZnM9cmVxdWlyZShcIi4va2ZzXCIpO1xuICBcdH1cbn0gZWxzZSBpZiAodHlwZW9mIGNocm9tZSE9XCJ1bmRlZmluZWRcIil7Ly99ICYmIGNocm9tZS5maWxlU3lzdGVtKXtcbi8vXHR3aW5kb3cua3NhbmFnYXA9cmVxdWlyZShcIi4va3NhbmFnYXBcIik7IC8vY29tcGF0aWJsZSBsYXllciB3aXRoIG1vYmlsZVxuXHR3aW5kb3cua3NhbmFnYXAucGxhdGZvcm09XCJjaHJvbWVcIjtcblx0d2luZG93Lmtmcz1yZXF1aXJlKFwiLi9rZnNfaHRtbDVcIik7XG5cdHJlcXVpcmUoXCIuL2xpdmVyZWxvYWRcIikoKTtcblx0a3NhbmEucGxhdGZvcm09XCJjaHJvbWVcIjtcbn0gZWxzZSB7XG5cdGlmICh0eXBlb2Yga3NhbmFnYXAhPVwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGZzIT1cInVuZGVmaW5lZFwiKSB7Ly9tb2JpbGVcblx0XHR2YXIga3NhbmFqcz1mcy5yZWFkRmlsZVN5bmMoXCJrc2FuYS5qc1wiLFwidXRmOFwiKS50cmltKCk7IC8vYW5kcm9pZCBleHRyYSBcXG4gYXQgdGhlIGVuZFxuXHRcdGtzYW5hLmpzPUpTT04ucGFyc2Uoa3NhbmFqcy5zdWJzdHJpbmcoMTQsa3NhbmFqcy5sZW5ndGgtMSkpO1xuXHRcdGtzYW5hLnBsYXRmb3JtPWtzYW5hZ2FwLnBsYXRmb3JtO1xuXHRcdGlmICh0eXBlb2Yga3NhbmFnYXAuYW5kcm9pZCAhPVwidW5kZWZpbmVkXCIpIHtcblx0XHRcdGtzYW5hLnBsYXRmb3JtPVwiYW5kcm9pZFwiO1xuXHRcdH1cblx0fVxufVxudmFyIHRpbWVyPW51bGw7XG52YXIgYm9vdD1mdW5jdGlvbihhcHBJZCxjYikge1xuXHRrc2FuYS5hcHBJZD1hcHBJZDtcblx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cImNocm9tZVwiKSB7IC8vbmVlZCB0byB3YWl0IGZvciBqc29ucCBrc2FuYS5qc1xuXHRcdHRpbWVyPXNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoa3NhbmEucmVhZHkpe1xuXHRcdFx0XHRjbGVhckludGVydmFsKHRpbWVyKTtcblx0XHRcdFx0aWYgKGtzYW5hLmpzICYmIGtzYW5hLmpzLmZpbGVzICYmIGtzYW5hLmpzLmZpbGVzLmxlbmd0aCkge1xuXHRcdFx0XHRcdHJlcXVpcmUoXCIuL2luc3RhbGxrZGJcIikoa3NhbmEuanMsY2IpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGNiKCk7XHRcdFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fSwzMDApO1xuXHR9IGVsc2Uge1xuXHRcdGNiKCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHM9e2Jvb3Q6Ym9vdFxuXHQsaHRtbGZzOnJlcXVpcmUoXCIuL2h0bWxmc1wiKVxuXHQsaHRtbDVmczpyZXF1aXJlKFwiLi9odG1sNWZzXCIpXG5cdCxsaXZldXBkYXRlOnJlcXVpcmUoXCIuL2xpdmV1cGRhdGVcIilcblx0LGZpbGVpbnN0YWxsZXI6cmVxdWlyZShcIi4vZmlsZWluc3RhbGxlclwiKVxuXHQsZG93bmxvYWRlcjpyZXF1aXJlKFwiLi9kb3dubG9hZGVyXCIpXG5cdCxpbnN0YWxsa2RiOnJlcXVpcmUoXCIuL2luc3RhbGxrZGJcIilcbn07IiwidmFyIEZpbGVpbnN0YWxsZXI9cmVxdWlyZShcIi4vZmlsZWluc3RhbGxlclwiKTtcblxudmFyIGdldFJlcXVpcmVfa2RiPWZ1bmN0aW9uKCkge1xuICAgIHZhciByZXF1aXJlZD1bXTtcbiAgICBrc2FuYS5qcy5maWxlcy5tYXAoZnVuY3Rpb24oZil7XG4gICAgICBpZiAoZi5pbmRleE9mKFwiLmtkYlwiKT09Zi5sZW5ndGgtNCkge1xuICAgICAgICB2YXIgc2xhc2g9Zi5sYXN0SW5kZXhPZihcIi9cIik7XG4gICAgICAgIGlmIChzbGFzaD4tMSkge1xuICAgICAgICAgIHZhciBkYmlkPWYuc3Vic3RyaW5nKHNsYXNoKzEsZi5sZW5ndGgtNCk7XG4gICAgICAgICAgcmVxdWlyZWQucHVzaCh7dXJsOmYsZGJpZDpkYmlkLGZpbGVuYW1lOmRiaWQrXCIua2RiXCJ9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgZGJpZD1mLnN1YnN0cmluZygwLGYubGVuZ3RoLTQpO1xuICAgICAgICAgIHJlcXVpcmVkLnB1c2goe3VybDprc2FuYS5qcy5iYXNldXJsK2YsZGJpZDpkYmlkLGZpbGVuYW1lOmZ9KTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlcXVpcmVkO1xufVxudmFyIGNhbGxiYWNrPW51bGw7XG52YXIgb25SZWFkeT1mdW5jdGlvbigpIHtcblx0Y2FsbGJhY2soKTtcbn1cbnZhciBvcGVuRmlsZWluc3RhbGxlcj1mdW5jdGlvbihrZWVwKSB7XG5cdHZhciByZXF1aXJlX2tkYj1nZXRSZXF1aXJlX2tkYigpLm1hcChmdW5jdGlvbihkYil7XG5cdCAgcmV0dXJuIHtcblx0ICAgIHVybDp3aW5kb3cubG9jYXRpb24ub3JpZ2luK3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZStkYi5kYmlkK1wiLmtkYlwiLFxuXHQgICAgZGJkYjpkYi5kYmlkLFxuXHQgICAgZmlsZW5hbWU6ZGIuZmlsZW5hbWVcblx0ICB9XG5cdH0pXG5cdHJldHVybiBSZWFjdC5jcmVhdGVFbGVtZW50KEZpbGVpbnN0YWxsZXIsIHtxdW90YTogXCI1MTJNXCIsIGF1dG9jbG9zZTogIWtlZXAsIG5lZWRlZDogcmVxdWlyZV9rZGIsIFxuXHQgICAgICAgICAgICAgICAgIG9uUmVhZHk6IG9uUmVhZHl9KTtcbn1cbnZhciBpbnN0YWxsa2RiPWZ1bmN0aW9uKGtzYW5hanMsY2IsY29udGV4dCkge1xuXHRjb25zb2xlLmxvZyhrc2FuYWpzLmZpbGVzKTtcblx0UmVhY3QucmVuZGVyKG9wZW5GaWxlaW5zdGFsbGVyKCksZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpKTtcblx0Y2FsbGJhY2s9Y2I7XG59XG5tb2R1bGUuZXhwb3J0cz1pbnN0YWxsa2RiOyIsIi8vU2ltdWxhdGUgZmVhdHVyZSBpbiBrc2FuYWdhcFxuLyogXG4gIHJ1bnMgb24gbm9kZS13ZWJraXQgb25seVxuKi9cblxudmFyIHJlYWREaXI9ZnVuY3Rpb24ocGF0aCkgeyAvL3NpbXVsYXRlIEtzYW5hZ2FwIGZ1bmN0aW9uXG5cdHZhciBmcz1ub2RlUmVxdWlyZShcImZzXCIpO1xuXHRwYXRoPXBhdGh8fFwiLi5cIjtcblx0dmFyIGRpcnM9W107XG5cdGlmIChwYXRoWzBdPT1cIi5cIikge1xuXHRcdGlmIChwYXRoPT1cIi5cIikgZGlycz1mcy5yZWFkZGlyU3luYyhcIi5cIik7XG5cdFx0ZWxzZSB7XG5cdFx0XHRkaXJzPWZzLnJlYWRkaXJTeW5jKFwiLi5cIik7XG5cdFx0fVxuXHR9IGVsc2Uge1xuXHRcdGRpcnM9ZnMucmVhZGRpclN5bmMocGF0aCk7XG5cdH1cblxuXHRyZXR1cm4gZGlycy5qb2luKFwiXFx1ZmZmZlwiKTtcbn1cbnZhciBsaXN0QXBwcz1mdW5jdGlvbigpIHtcblx0dmFyIGZzPW5vZGVSZXF1aXJlKFwiZnNcIik7XG5cdHZhciBrc2FuYWpzZmlsZT1mdW5jdGlvbihkKSB7cmV0dXJuIFwiLi4vXCIrZCtcIi9rc2FuYS5qc1wifTtcblx0dmFyIGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuLlwiKS5maWx0ZXIoZnVuY3Rpb24oZCl7XG5cdFx0XHRcdHJldHVybiBmcy5zdGF0U3luYyhcIi4uL1wiK2QpLmlzRGlyZWN0b3J5KCkgJiYgZFswXSE9XCIuXCJcblx0XHRcdFx0ICAgJiYgZnMuZXhpc3RzU3luYyhrc2FuYWpzZmlsZShkKSk7XG5cdH0pO1xuXHRcblx0dmFyIG91dD1kaXJzLm1hcChmdW5jdGlvbihkKXtcblx0XHR2YXIgY29udGVudD1mcy5yZWFkRmlsZVN5bmMoa3NhbmFqc2ZpbGUoZCksXCJ1dGY4XCIpO1xuICBcdGNvbnRlbnQ9Y29udGVudC5yZXBsYWNlKFwifSlcIixcIn1cIik7XG4gIFx0Y29udGVudD1jb250ZW50LnJlcGxhY2UoXCJqc29ucF9oYW5kbGVyKFwiLFwiXCIpO1xuXHRcdHZhciBvYmo9IEpTT04ucGFyc2UoY29udGVudCk7XG5cdFx0b2JqLmRiaWQ9ZDtcblx0XHRvYmoucGF0aD1kO1xuXHRcdHJldHVybiBvYmo7XG5cdH0pXG5cdHJldHVybiBKU09OLnN0cmluZ2lmeShvdXQpO1xufVxuXG5cblxudmFyIGtmcz17cmVhZERpcjpyZWFkRGlyLGxpc3RBcHBzOmxpc3RBcHBzfTtcblxubW9kdWxlLmV4cG9ydHM9a2ZzOyIsInZhciByZWFkRGlyPWZ1bmN0aW9uKCl7XG5cdHJldHVybiBbXTtcbn1cbnZhciBsaXN0QXBwcz1mdW5jdGlvbigpe1xuXHRyZXR1cm4gW107XG59XG5tb2R1bGUuZXhwb3J0cz17cmVhZERpcjpyZWFkRGlyLGxpc3RBcHBzOmxpc3RBcHBzfTsiLCJ2YXIgYXBwbmFtZT1cImluc3RhbGxlclwiO1xudmFyIHN3aXRjaEFwcD1mdW5jdGlvbihwYXRoKSB7XG5cdHZhciBmcz1yZXF1aXJlKFwiZnNcIik7XG5cdHBhdGg9XCIuLi9cIitwYXRoO1xuXHRhcHBuYW1lPXBhdGg7XG5cdGRvY3VtZW50LmxvY2F0aW9uLmhyZWY9IHBhdGgrXCIvaW5kZXguaHRtbFwiOyBcblx0cHJvY2Vzcy5jaGRpcihwYXRoKTtcbn1cbnZhciBkb3dubG9hZGVyPXt9O1xudmFyIHJvb3RQYXRoPVwiXCI7XG5cbnZhciBkZWxldGVBcHA9ZnVuY3Rpb24oYXBwKSB7XG5cdGNvbnNvbGUuZXJyb3IoXCJub3QgYWxsb3cgb24gUEMsIGRvIGl0IGluIEZpbGUgRXhwbG9yZXIvIEZpbmRlclwiKTtcbn1cbnZhciB1c2VybmFtZT1mdW5jdGlvbigpIHtcblx0cmV0dXJuIFwiXCI7XG59XG52YXIgdXNlcmVtYWlsPWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gXCJcIlxufVxudmFyIHJ1bnRpbWVfdmVyc2lvbj1mdW5jdGlvbigpIHtcblx0cmV0dXJuIFwiMS40XCI7XG59XG5cbi8vY29weSBmcm9tIGxpdmV1cGRhdGVcbnZhciBqc29ucD1mdW5jdGlvbih1cmwsZGJpZCxjYWxsYmFjayxjb250ZXh0KSB7XG4gIHZhciBzY3JpcHQ9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJqc29ucDJcIik7XG4gIGlmIChzY3JpcHQpIHtcbiAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICB9XG4gIHdpbmRvdy5qc29ucF9oYW5kbGVyPWZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZiAodHlwZW9mIGRhdGE9PVwib2JqZWN0XCIpIHtcbiAgICAgIGRhdGEuZGJpZD1kYmlkO1xuICAgICAgY2FsbGJhY2suYXBwbHkoY29udGV4dCxbZGF0YV0pOyAgICBcbiAgICB9ICBcbiAgfVxuICB3aW5kb3cuanNvbnBfZXJyb3JfaGFuZGxlcj1mdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmVycm9yKFwidXJsIHVucmVhY2hhYmxlXCIsdXJsKTtcbiAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LFtudWxsXSk7XG4gIH1cbiAgc2NyaXB0PWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NjcmlwdCcpO1xuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdpZCcsIFwianNvbnAyXCIpO1xuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdvbmVycm9yJywgXCJqc29ucF9lcnJvcl9oYW5kbGVyKClcIik7XG4gIHVybD11cmwrJz8nKyhuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybCk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTsgXG59XG5cbnZhciBrc2FuYWdhcD17XG5cdHBsYXRmb3JtOlwibm9kZS13ZWJraXRcIixcblx0c3RhcnREb3dubG9hZDpkb3dubG9hZGVyLnN0YXJ0RG93bmxvYWQsXG5cdGRvd25sb2FkZWRCeXRlOmRvd25sb2FkZXIuZG93bmxvYWRlZEJ5dGUsXG5cdGRvd25sb2FkaW5nRmlsZTpkb3dubG9hZGVyLmRvd25sb2FkaW5nRmlsZSxcblx0Y2FuY2VsRG93bmxvYWQ6ZG93bmxvYWRlci5jYW5jZWxEb3dubG9hZCxcblx0ZG9uZURvd25sb2FkOmRvd25sb2FkZXIuZG9uZURvd25sb2FkLFxuXHRzd2l0Y2hBcHA6c3dpdGNoQXBwLFxuXHRyb290UGF0aDpyb290UGF0aCxcblx0ZGVsZXRlQXBwOiBkZWxldGVBcHAsXG5cdHVzZXJuYW1lOnVzZXJuYW1lLCAvL25vdCBzdXBwb3J0IG9uIFBDXG5cdHVzZXJlbWFpbDp1c2VybmFtZSxcblx0cnVudGltZV92ZXJzaW9uOnJ1bnRpbWVfdmVyc2lvbixcblx0XG59XG5cbmlmICh0eXBlb2YgcHJvY2VzcyE9XCJ1bmRlZmluZWRcIikge1xuXHR2YXIga3NhbmFqcz1yZXF1aXJlKFwiZnNcIikucmVhZEZpbGVTeW5jKFwiLi9rc2FuYS5qc1wiLFwidXRmOFwiKS50cmltKCk7XG5cdGRvd25sb2FkZXI9cmVxdWlyZShcIi4vZG93bmxvYWRlclwiKTtcblx0Y29uc29sZS5sb2coa3NhbmFqcyk7XG5cdC8va3NhbmEuanM9SlNPTi5wYXJzZShrc2FuYWpzLnN1YnN0cmluZygxNCxrc2FuYWpzLmxlbmd0aC0xKSk7XG5cdHJvb3RQYXRoPXByb2Nlc3MuY3dkKCk7XG5cdHJvb3RQYXRoPXJlcXVpcmUoXCJwYXRoXCIpLnJlc29sdmUocm9vdFBhdGgsXCIuLlwiKS5yZXBsYWNlKC9cXFxcL2csXCIvXCIpKycvJztcblx0a3NhbmEucmVhZHk9dHJ1ZTtcbn0gZWxzZXtcblx0dmFyIHVybD13aW5kb3cubG9jYXRpb24ub3JpZ2luK3dpbmRvdy5sb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKFwiaW5kZXguaHRtbFwiLFwiXCIpK1wia3NhbmEuanNcIjtcblx0anNvbnAodXJsLGFwcG5hbWUsZnVuY3Rpb24oZGF0YSl7XG5cdFx0a3NhbmEuanM9ZGF0YTtcblx0XHRrc2FuYS5yZWFkeT10cnVlO1xuXHR9KTtcbn1cbm1vZHVsZS5leHBvcnRzPWtzYW5hZ2FwOyIsInZhciBzdGFydGVkPWZhbHNlO1xudmFyIHRpbWVyPW51bGw7XG52YXIgYnVuZGxlZGF0ZT1udWxsO1xudmFyIGdldF9kYXRlPXJlcXVpcmUoXCIuL2h0bWw1ZnNcIikuZ2V0X2RhdGU7XG52YXIgY2hlY2tJZkJ1bmRsZVVwZGF0ZWQ9ZnVuY3Rpb24oKSB7XG5cdGdldF9kYXRlKFwiYnVuZGxlLmpzXCIsZnVuY3Rpb24oZGF0ZSl7XG5cdFx0aWYgKGJ1bmRsZWRhdGUgJiZidW5kbGVkYXRlIT1kYXRlKXtcblx0XHRcdGxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdH1cblx0XHRidW5kbGVkYXRlPWRhdGU7XG5cdH0pO1xufVxudmFyIGxpdmVyZWxvYWQ9ZnVuY3Rpb24oKSB7XG5cdGlmIChzdGFydGVkKSByZXR1cm47XG5cblx0dGltZXIxPXNldEludGVydmFsKGZ1bmN0aW9uKCl7XG5cdFx0Y2hlY2tJZkJ1bmRsZVVwZGF0ZWQoKTtcblx0fSwyMDAwKTtcblx0c3RhcnRlZD10cnVlO1xufVxuXG5tb2R1bGUuZXhwb3J0cz1saXZlcmVsb2FkOyIsIlxudmFyIGpzb25wPWZ1bmN0aW9uKHVybCxkYmlkLGNhbGxiYWNrLGNvbnRleHQpIHtcbiAgdmFyIHNjcmlwdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzb25wXCIpO1xuICBpZiAoc2NyaXB0KSB7XG4gICAgc2NyaXB0LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc2NyaXB0KTtcbiAgfVxuICB3aW5kb3cuanNvbnBfaGFuZGxlcj1mdW5jdGlvbihkYXRhKSB7XG4gICAgLy9jb25zb2xlLmxvZyhcInJlY2VpdmUgZnJvbSBrc2FuYS5qc1wiLGRhdGEpO1xuICAgIGlmICh0eXBlb2YgZGF0YT09XCJvYmplY3RcIikge1xuICAgICAgaWYgKHR5cGVvZiBkYXRhLmRiaWQ9PVwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgZGF0YS5kYmlkPWRiaWQ7XG4gICAgICB9XG4gICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LFtkYXRhXSk7XG4gICAgfSAgXG4gIH1cblxuICB3aW5kb3cuanNvbnBfZXJyb3JfaGFuZGxlcj1mdW5jdGlvbigpIHtcbiAgICBjb25zb2xlLmVycm9yKFwidXJsIHVucmVhY2hhYmxlXCIsdXJsKTtcbiAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LFtudWxsXSk7XG4gIH1cblxuICBzY3JpcHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJqc29ucFwiKTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnb25lcnJvcicsIFwianNvbnBfZXJyb3JfaGFuZGxlcigpXCIpO1xuICB1cmw9dXJsKyc/JysobmV3IERhdGUoKS5nZXRUaW1lKCkpO1xuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdzcmMnLCB1cmwpO1xuICBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKHNjcmlwdCk7IFxufVxudmFyIHJ1bnRpbWVfdmVyc2lvbl9vaz1mdW5jdGlvbihtaW5ydW50aW1lKSB7XG4gIGlmICghbWlucnVudGltZSkgcmV0dXJuIHRydWU7Ly9ub3QgbWVudGlvbmVkLlxuICB2YXIgbWluPXBhcnNlRmxvYXQobWlucnVudGltZSk7XG4gIHZhciBydW50aW1lPXBhcnNlRmxvYXQoIGtzYW5hZ2FwLnJ1bnRpbWVfdmVyc2lvbigpfHxcIjEuMFwiKTtcbiAgaWYgKG1pbj5ydW50aW1lKSByZXR1cm4gZmFsc2U7XG4gIHJldHVybiB0cnVlO1xufVxuXG52YXIgbmVlZFRvVXBkYXRlPWZ1bmN0aW9uKGZyb21qc29uLHRvanNvbikge1xuICB2YXIgbmVlZFVwZGF0ZXM9W107XG4gIGZvciAodmFyIGk9MDtpPGZyb21qc29uLmxlbmd0aDtpKyspIHsgXG4gICAgdmFyIHRvPXRvanNvbltpXTtcbiAgICB2YXIgZnJvbT1mcm9tanNvbltpXTtcbiAgICB2YXIgbmV3ZmlsZXM9W10sbmV3ZmlsZXNpemVzPVtdLHJlbW92ZWQ9W107XG4gICAgXG4gICAgaWYgKCF0bykgY29udGludWU7IC8vY2Fubm90IHJlYWNoIGhvc3RcbiAgICBpZiAoIXJ1bnRpbWVfdmVyc2lvbl9vayh0by5taW5ydW50aW1lKSkge1xuICAgICAgY29uc29sZS53YXJuKFwicnVudGltZSB0b28gb2xkLCBuZWVkIFwiK3RvLm1pbnJ1bnRpbWUpO1xuICAgICAgY29udGludWU7IFxuICAgIH1cbiAgICBpZiAoIWZyb20uZmlsZWRhdGVzKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJtaXNzaW5nIGZpbGVkYXRlcyBpbiBrc2FuYS5qcyBvZiBcIitmcm9tLmRiaWQpO1xuICAgICAgY29udGludWU7XG4gICAgfVxuICAgIGZyb20uZmlsZWRhdGVzLm1hcChmdW5jdGlvbihmLGlkeCl7XG4gICAgICB2YXIgbmV3aWR4PXRvLmZpbGVzLmluZGV4T2YoIGZyb20uZmlsZXNbaWR4XSk7XG4gICAgICBpZiAobmV3aWR4PT0tMSkge1xuICAgICAgICAvL2ZpbGUgcmVtb3ZlZCBpbiBuZXcgdmVyc2lvblxuICAgICAgICByZW1vdmVkLnB1c2goZnJvbS5maWxlc1tpZHhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBmcm9tZGF0ZT1EYXRlLnBhcnNlKGYpO1xuICAgICAgICB2YXIgdG9kYXRlPURhdGUucGFyc2UodG8uZmlsZWRhdGVzW25ld2lkeF0pO1xuICAgICAgICBpZiAoZnJvbWRhdGU8dG9kYXRlKSB7XG4gICAgICAgICAgbmV3ZmlsZXMucHVzaCggdG8uZmlsZXNbbmV3aWR4XSApO1xuICAgICAgICAgIG5ld2ZpbGVzaXplcy5wdXNoKHRvLmZpbGVzaXplc1tuZXdpZHhdKTtcbiAgICAgICAgfSAgICAgICAgXG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKG5ld2ZpbGVzLmxlbmd0aCkge1xuICAgICAgZnJvbS5uZXdmaWxlcz1uZXdmaWxlcztcbiAgICAgIGZyb20ubmV3ZmlsZXNpemVzPW5ld2ZpbGVzaXplcztcbiAgICAgIGZyb20ucmVtb3ZlZD1yZW1vdmVkO1xuICAgICAgbmVlZFVwZGF0ZXMucHVzaChmcm9tKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG5lZWRVcGRhdGVzO1xufVxudmFyIGdldFVwZGF0YWJsZXM9ZnVuY3Rpb24oYXBwcyxjYixjb250ZXh0KSB7XG4gIGdldFJlbW90ZUpzb24oYXBwcyxmdW5jdGlvbihqc29ucyl7XG4gICAgdmFyIGhhc1VwZGF0ZXM9bmVlZFRvVXBkYXRlKGFwcHMsanNvbnMpO1xuICAgIGNiLmFwcGx5KGNvbnRleHQsW2hhc1VwZGF0ZXNdKTtcbiAgfSxjb250ZXh0KTtcbn1cbnZhciBnZXRSZW1vdGVKc29uPWZ1bmN0aW9uKGFwcHMsY2IsY29udGV4dCkge1xuICB2YXIgdGFza3F1ZXVlPVtdLG91dHB1dD1bXTtcbiAgdmFyIG1ha2VjYj1mdW5jdGlvbihhcHApe1xuICAgIHJldHVybiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgaWYgKCEoZGF0YSAmJiB0eXBlb2YgZGF0YSA9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkpIG91dHB1dC5wdXNoKGRhdGEpO1xuICAgICAgICBpZiAoIWFwcC5iYXNldXJsKSB7XG4gICAgICAgICAgdGFza3F1ZXVlLnNoaWZ0KHtfX2VtcHR5OnRydWV9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB2YXIgdXJsPWFwcC5iYXNldXJsK1wiL2tzYW5hLmpzXCI7ICAgIFxuICAgICAgICAgIGNvbnNvbGUubG9nKHVybCk7XG4gICAgICAgICAganNvbnAoIHVybCAsYXBwLmRiaWQsdGFza3F1ZXVlLnNoaWZ0KCksIGNvbnRleHQpOyAgICAgICAgICAgXG4gICAgICAgIH1cbiAgICB9O1xuICB9O1xuICBhcHBzLmZvckVhY2goZnVuY3Rpb24oYXBwKXt0YXNrcXVldWUucHVzaChtYWtlY2IoYXBwKSl9KTtcblxuICB0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcbiAgICBvdXRwdXQucHVzaChkYXRhKTtcbiAgICBjYi5hcHBseShjb250ZXh0LFtvdXRwdXRdKTtcbiAgfSk7XG5cbiAgdGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pOyAvL3J1biB0aGUgdGFza1xufVxudmFyIGh1bWFuRmlsZVNpemU9ZnVuY3Rpb24oYnl0ZXMsIHNpKSB7XG4gICAgdmFyIHRocmVzaCA9IHNpID8gMTAwMCA6IDEwMjQ7XG4gICAgaWYoYnl0ZXMgPCB0aHJlc2gpIHJldHVybiBieXRlcyArICcgQic7XG4gICAgdmFyIHVuaXRzID0gc2kgPyBbJ2tCJywnTUInLCdHQicsJ1RCJywnUEInLCdFQicsJ1pCJywnWUInXSA6IFsnS2lCJywnTWlCJywnR2lCJywnVGlCJywnUGlCJywnRWlCJywnWmlCJywnWWlCJ107XG4gICAgdmFyIHUgPSAtMTtcbiAgICBkbyB7XG4gICAgICAgIGJ5dGVzIC89IHRocmVzaDtcbiAgICAgICAgKyt1O1xuICAgIH0gd2hpbGUoYnl0ZXMgPj0gdGhyZXNoKTtcbiAgICByZXR1cm4gYnl0ZXMudG9GaXhlZCgxKSsnICcrdW5pdHNbdV07XG59O1xuXG52YXIgc3RhcnQ9ZnVuY3Rpb24oa3NhbmFqcyxjYixjb250ZXh0KXtcbiAgdmFyIGZpbGVzPWtzYW5hanMubmV3ZmlsZXN8fGtzYW5hanMuZmlsZXM7XG4gIHZhciBiYXNldXJsPWtzYW5hanMuYmFzZXVybHx8IFwiaHR0cDovLzEyNy4wLjAuMTo4MDgwL1wiK2tzYW5hanMuZGJpZCtcIi9cIjtcbiAgdmFyIHN0YXJ0ZWQ9a3NhbmFnYXAuc3RhcnREb3dubG9hZChrc2FuYWpzLmRiaWQsYmFzZXVybCxmaWxlcy5qb2luKFwiXFx1ZmZmZlwiKSk7XG4gIGNiLmFwcGx5KGNvbnRleHQsW3N0YXJ0ZWRdKTtcbn1cbnZhciBzdGF0dXM9ZnVuY3Rpb24oKXtcbiAgdmFyIG5maWxlPWtzYW5hZ2FwLmRvd25sb2FkaW5nRmlsZSgpO1xuICB2YXIgZG93bmxvYWRlZEJ5dGU9a3NhbmFnYXAuZG93bmxvYWRlZEJ5dGUoKTtcbiAgdmFyIGRvbmU9a3NhbmFnYXAuZG9uZURvd25sb2FkKCk7XG4gIHJldHVybiB7bmZpbGU6bmZpbGUsZG93bmxvYWRlZEJ5dGU6ZG93bmxvYWRlZEJ5dGUsIGRvbmU6ZG9uZX07XG59XG5cbnZhciBjYW5jZWw9ZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGtzYW5hZ2FwLmNhbmNlbERvd25sb2FkKCk7XG59XG5cbnZhciBsaXZldXBkYXRlPXsgaHVtYW5GaWxlU2l6ZTogaHVtYW5GaWxlU2l6ZSwgXG4gIG5lZWRUb1VwZGF0ZTogbmVlZFRvVXBkYXRlICwganNvbnA6anNvbnAsIFxuICBnZXRVcGRhdGFibGVzOmdldFVwZGF0YWJsZXMsXG4gIHN0YXJ0OnN0YXJ0LFxuICBjYW5jZWw6Y2FuY2VsLFxuICBzdGF0dXM6c3RhdHVzXG4gIH07XG5tb2R1bGUuZXhwb3J0cz1saXZldXBkYXRlOyIsImZ1bmN0aW9uIG1rZGlyUCAocCwgbW9kZSwgZiwgbWFkZSkge1xuICAgICB2YXIgcGF0aCA9IG5vZGVSZXF1aXJlKCdwYXRoJyk7XG4gICAgIHZhciBmcyA9IG5vZGVSZXF1aXJlKCdmcycpO1xuXHRcbiAgICBpZiAodHlwZW9mIG1vZGUgPT09ICdmdW5jdGlvbicgfHwgbW9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGYgPSBtb2RlO1xuICAgICAgICBtb2RlID0gMHgxRkYgJiAofnByb2Nlc3MudW1hc2soKSk7XG4gICAgfVxuICAgIGlmICghbWFkZSkgbWFkZSA9IG51bGw7XG5cbiAgICB2YXIgY2IgPSBmIHx8IGZ1bmN0aW9uICgpIHt9O1xuICAgIGlmICh0eXBlb2YgbW9kZSA9PT0gJ3N0cmluZycpIG1vZGUgPSBwYXJzZUludChtb2RlLCA4KTtcbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xuXG4gICAgZnMubWtkaXIocCwgbW9kZSwgZnVuY3Rpb24gKGVyKSB7XG4gICAgICAgIGlmICghZXIpIHtcbiAgICAgICAgICAgIG1hZGUgPSBtYWRlIHx8IHA7XG4gICAgICAgICAgICByZXR1cm4gY2IobnVsbCwgbWFkZSk7XG4gICAgICAgIH1cbiAgICAgICAgc3dpdGNoIChlci5jb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdFTk9FTlQnOlxuICAgICAgICAgICAgICAgIG1rZGlyUChwYXRoLmRpcm5hbWUocCksIG1vZGUsIGZ1bmN0aW9uIChlciwgbWFkZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZXIpIGNiKGVyLCBtYWRlKTtcbiAgICAgICAgICAgICAgICAgICAgZWxzZSBta2RpclAocCwgbW9kZSwgY2IsIG1hZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXJcbiAgICAgICAgICAgIC8vIHRoZXJlIGFscmVhZHkuICBJZiBzbywgdGhlbiBob29yYXkhICBJZiBub3QsIHRoZW4gc29tZXRoaW5nXG4gICAgICAgICAgICAvLyBpcyBib3JrZWQuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIGZzLnN0YXQocCwgZnVuY3Rpb24gKGVyMiwgc3RhdCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBpZiB0aGUgc3RhdCBmYWlscywgdGhlbiB0aGF0J3Mgc3VwZXIgd2VpcmQuXG4gICAgICAgICAgICAgICAgICAgIC8vIGxldCB0aGUgb3JpZ2luYWwgZXJyb3IgYmUgdGhlIGZhaWx1cmUgcmVhc29uLlxuICAgICAgICAgICAgICAgICAgICBpZiAoZXIyIHx8ICFzdGF0LmlzRGlyZWN0b3J5KCkpIGNiKGVyLCBtYWRlKVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGNiKG51bGwsIG1hZGUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSk7XG59XG5cbm1rZGlyUC5zeW5jID0gZnVuY3Rpb24gc3luYyAocCwgbW9kZSwgbWFkZSkge1xuICAgIHZhciBwYXRoID0gbm9kZVJlcXVpcmUoJ3BhdGgnKTtcbiAgICB2YXIgZnMgPSBub2RlUmVxdWlyZSgnZnMnKTtcbiAgICBpZiAobW9kZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIG1vZGUgPSAweDFGRiAmICh+cHJvY2Vzcy51bWFzaygpKTtcbiAgICB9XG4gICAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbDtcblxuICAgIGlmICh0eXBlb2YgbW9kZSA9PT0gJ3N0cmluZycpIG1vZGUgPSBwYXJzZUludChtb2RlLCA4KTtcbiAgICBwID0gcGF0aC5yZXNvbHZlKHApO1xuXG4gICAgdHJ5IHtcbiAgICAgICAgZnMubWtkaXJTeW5jKHAsIG1vZGUpO1xuICAgICAgICBtYWRlID0gbWFkZSB8fCBwO1xuICAgIH1cbiAgICBjYXRjaCAoZXJyMCkge1xuICAgICAgICBzd2l0Y2ggKGVycjAuY29kZSkge1xuICAgICAgICAgICAgY2FzZSAnRU5PRU5UJyA6XG4gICAgICAgICAgICAgICAgbWFkZSA9IHN5bmMocGF0aC5kaXJuYW1lKHApLCBtb2RlLCBtYWRlKTtcbiAgICAgICAgICAgICAgICBzeW5jKHAsIG1vZGUsIG1hZGUpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAvLyBJbiB0aGUgY2FzZSBvZiBhbnkgb3RoZXIgZXJyb3IsIGp1c3Qgc2VlIGlmIHRoZXJlJ3MgYSBkaXJcbiAgICAgICAgICAgIC8vIHRoZXJlIGFscmVhZHkuICBJZiBzbywgdGhlbiBob29yYXkhICBJZiBub3QsIHRoZW4gc29tZXRoaW5nXG4gICAgICAgICAgICAvLyBpcyBib3JrZWQuXG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHZhciBzdGF0O1xuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXQgPSBmcy5zdGF0U3luYyhwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY2F0Y2ggKGVycjEpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgZXJyMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCFzdGF0LmlzRGlyZWN0b3J5KCkpIHRocm93IGVycjA7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbWFkZTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gbWtkaXJQLm1rZGlycCA9IG1rZGlyUC5ta2RpclAgPSBta2RpclA7XG4iXX0=
