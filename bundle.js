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
		React.createElement("div", {className: "col-sm-3"}, 
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3Vzci9sb2NhbC9saWIvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIm1vZWRpY3QteXUvaW5kZXguanMiLCJtb2VkaWN0LXl1L3NyYy9kZWZib3guanN4IiwibW9lZGljdC15dS9zcmMvbWFpbi5qc3giLCJtb2VkaWN0LXl1L3NyYy9vdmVydmlldy5qc3giLCJtb2VkaWN0LXl1L3NyYy9zZWFyY2hiYXIuanN4IiwibW9lZGljdC15dS9zcmMvc2VhcmNoaGlzdG9yeS5qc3giLCJtb2VkaWN0LXl1L3NyYy9zaG93dGV4dC5qc3giLCJub2RlX21vZHVsZXMva3NhbmEtYW5hbHl6ZXIvY29uZmlncy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1hbmFseXplci9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1hbmFseXplci90b2tlbml6ZXJzLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWRhdGFiYXNlL2JzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2UvaW5kZXguanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2Uva2RlLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWRhdGFiYXNlL2xpc3RrZGIuanMiLCJub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2UvcGxhdGZvcm0uanMiLCJub2RlX21vZHVsZXMva3NhbmEtanNvbnJvbS9odG1sNXJlYWQuanMiLCJub2RlX21vZHVsZXMva3NhbmEtanNvbnJvbS9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYi5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYmZzLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLWpzb25yb20va2RiZnNfYW5kcm9pZC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYmZzX2lvcy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1qc29ucm9tL2tkYncuanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2Jvb2xzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2JzZWFyY2guanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2V4Y2VycHQuanMiLCJub2RlX21vZHVsZXMva3NhbmEtc2VhcmNoL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hLXNlYXJjaC9wbGlzdC5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYS1zZWFyY2gvc2VhcmNoLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2NoZWNrYnJvd3Nlci5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9kb3dubG9hZGVyLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2ZpbGVpbnN0YWxsZXIuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaHRtbDVmcy5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9odG1sZnMuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaW5kZXguanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvaW5zdGFsbGtkYi5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9rZnMuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUva2ZzX2h0bWw1LmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2tzYW5hZ2FwLmpzIiwibm9kZV9tb2R1bGVzL2tzYW5hMjAxNS13ZWJydW50aW1lL2xpdmVyZWxvYWQuanMiLCJub2RlX21vZHVsZXMva3NhbmEyMDE1LXdlYnJ1bnRpbWUvbGl2ZXVwZGF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9rc2FuYTIwMTUtd2VicnVudGltZS9ta2RpcnAuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdXQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2ZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Y0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvaUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1U0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUlBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBydW50aW1lPXJlcXVpcmUoXCJrc2FuYTIwMTUtd2VicnVudGltZVwiKTtcbnJ1bnRpbWUuYm9vdChcIm1vZWRpY3QteXVcIixmdW5jdGlvbigpe1xuXHR2YXIgTWFpbj1SZWFjdC5jcmVhdGVFbGVtZW50KHJlcXVpcmUoXCIuL3NyYy9tYWluLmpzeFwiKSk7XG5cdGtzYW5hLm1haW5Db21wb25lbnQ9UmVhY3QucmVuZGVyKE1haW4sZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJtYWluXCIpKTtcbn0pOyIsInZhciBEZWZib3g9UmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIkRlZmJveFwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICBcdHJldHVybiB7fTtcbiAgfSxcbiAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4oXG5cdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdFx0XCJyZW5kZXIgZGVmYm94XCJcblx0KVx0XG4gICAgKTsgXG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHM9RGVmYm94OyIsInZhciBrc2U9cmVxdWlyZShcImtzYW5hLXNlYXJjaFwiKTtcbnZhciBrZGU9cmVxdWlyZShcImtzYW5hLWRhdGFiYXNlXCIpO1xudmFyIFNob3d0ZXh0PXJlcXVpcmUoXCIuL3Nob3d0ZXh0LmpzeFwiKTtcbnZhciBTZWFyY2hiYXI9cmVxdWlyZShcIi4vc2VhcmNoYmFyLmpzeFwiKTtcbnZhciBPdmVydmlldz1yZXF1aXJlKFwiLi9vdmVydmlldy5qc3hcIik7XG52YXIgbWFpbmNvbXBvbmVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtkaXNwbGF5TmFtZTogXCJtYWluY29tcG9uZW50XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgdmFyIHRoYXQ9dGhpcztcbiAgICBrZGUub3BlbihcIm1vZWRpY3RcIixmdW5jdGlvbihlcnIsZGIpe1xuICAgICAgdmFyIGVudHJpZXM9ZGIuZ2V0KFwicGFnZU5hbWVzXCIpO1xuICAgICAgdGhhdC5zZXRTdGF0ZSh7ZW50cmllczplbnRyaWVzfSk7XG4gICAgfSk7ICAgIFxuICBcdHJldHVybiB7cmVzdWx0OltcIummrFwiXSxzZWFyY2h0eXBlOlwic3RhcnRcIn07XG4gIH0sXG4gIGluZGV4T2ZTb3J0ZWQ6IGZ1bmN0aW9uIChhcnJheSwgb2JqKSB7IFxuICAgIHZhciBsb3cgPSAwLFxuICAgIGhpZ2ggPSBhcnJheS5sZW5ndGgtMTtcbiAgICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxO1xuICAgICAgYXJyYXlbbWlkXSA8IG9iaiA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICAgIH1cbiAgICBpZihhcnJheVtsb3ddICE9IG9iaikgcmV0dXJuIG51bGw7XG4gICAgcmV0dXJuIGxvdztcbiAgfSxcbiAgZG9zZWFyY2g6IGZ1bmN0aW9uKHRvZmluZCxmaWVsZCkge1xuICAgIHRoaXMuc2V0U3RhdGUoe3RvZmluZDp0b2ZpbmQsc2VhcmNodHlwZTpmaWVsZH0pO1xuICAgIGlmKHRoaXMuc3RhdGUuc2VhcmNodHlwZT09XCJzdGFydFwiKXtcbiAgICAgIHRoaXMuc2VhcmNoX3N0YXJ0KHRvZmluZCk7XG4gICAgfVxuICAgIGlmKHRoaXMuc3RhdGUuc2VhcmNodHlwZT09XCJlbmRcIil7XG4gICAgICBcbiAgICB9XG4gICAgaWYodGhpcy5zdGF0ZS5zZWFyY2h0eXBlPT1cIm1pZGRsZVwiKXtcbiAgICAgIFxuICAgIH1cbiAgICBpZih0aGlzLnN0YXRlLnNlYXJjaHR5cGU9PVwiZnVsbHRleHRcIil7XG4gICAgICB0aGlzLnNlYXJjaF9mdWxsdGV4dCh0b2ZpbmQpO1xuICAgIH1cblxuICB9LFxuICBzZWFyY2hfc3RhcnQ6IGZ1bmN0aW9uKHRvZmluZCkge1xuICAgIHZhciBvdXQ9W107XG4gICAgdmFyIGluZGV4PXRoaXMuaW5kZXhPZlNvcnRlZCh0aGlzLnN0YXRlLmVudHJpZXMsdG9maW5kKTtcbiAgICB2YXIgaT0wO1xuICAgIHdoaWxlKHRoaXMuc3RhdGUuZW50cmllc1tpbmRleCtpXS5pbmRleE9mKHRvZmluZCk9PTApe1xuICAgICAgb3V0LnB1c2godGhpcy5zdGF0ZS5lbnRyaWVzW2luZGV4K2ldKTtcbiAgICAgIGkrK1xuICAgIH1cbiAgICB0aGlzLnNldFN0YXRlKHtyZXN1bHQ6b3V0fSk7XG4gIH0sXG4gIHNlYXJjaF9lbmQ6IGZ1bmN0aW9uKCkge1xuXG4gIH0sXG4gIHNlYXJjaF9taWRkbGU6IGZ1bmN0aW9uKCkge1xuICBcbiAgfSxcbiAgc2VhcmNoX2Z1bGx0ZXh0OiBmdW5jdGlvbih0b2ZpbmQpIHtcbiAgICBrc2Uuc2VhcmNoKFwibW9lZGljdFwiLHRvZmluZCx7cmFuZ2U6e3N0YXJ0OjB9fSxmdW5jdGlvbihlcnIsZGF0YSl7XG4gICAgICB0aGF0LnNldFN0YXRlKHtyZXN1bHQ6ZGF0YS5leGNlcnB0fSk7XG4gICAgfSkgXG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNlYXJjaGJhciwge2Rvc2VhcmNoOiB0aGlzLmRvc2VhcmNofSksIFxuICAgICAgUmVhY3QuY3JlYXRlRWxlbWVudChPdmVydmlldywge3Jlc3VsdDogdGhpcy5zdGF0ZS5yZXN1bHR9KSwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgXG4gICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFNob3d0ZXh0LCB7c2VhcmNodHlwZTogdGhpcy5zdGF0ZS5zZWFyY2h0eXBlLCB0b2ZpbmQ6IHRoaXMuc3RhdGUudG9maW5kLCByZXN1bHQ6IHRoaXMuc3RhdGUucmVzdWx0fSlcbiAgICApXG4gICAgKTtcbiAgfVxufSk7XG5tb2R1bGUuZXhwb3J0cz1tYWluY29tcG9uZW50OyIsInZhciBPdmVydmlldz1SZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiT3ZlcnZpZXdcIixcbiAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgXHRyZXR1cm4ge307XG4gIH0sXG4gIHJlbmRlclJlc3VsdDogZnVuY3Rpb24oaXRlbSkge1xuICBcdHJldHVybiAoUmVhY3QuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiLCBudWxsLCBpdGVtKSk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gIFx0dmFyIHJlcz10aGlzLnByb3BzLnJlc3VsdCB8fCBcIlwiO1xuICBcdHZhciByZXN1bHQ9cmVzLm1hcCh0aGlzLnJlbmRlclJlc3VsdCk7XG4gICAgcmV0dXJuKFxuXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuXHRcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJjb2wtc20tM1wifSwgXG5cdFx0XHRSZWFjdC5jcmVhdGVFbGVtZW50KFwic2VsZWN0XCIsIHtjbGFzc05hbWU6IFwiZm9ybS1jb250cm9sXCJ9LCBcblx0XHRcdHJlc3VsdFxuXHRcdFx0KVxuXHRcdClcblx0KVx0XG4gICAgKTsgXG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHM9T3ZlcnZpZXc7IiwidmFyIFNlYXJjaGJhcj1SZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU2VhcmNoYmFyXCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIFx0cmV0dXJuIHt9O1xuICB9LFxuICBkb3NlYXJjaDogZnVuY3Rpb24oKSB7XG4gIFx0dmFyIHRvZmluZD10aGlzLnJlZnMudG9maW5kLmdldERPTU5vZGUoKS52YWx1ZTtcbiAgICB2YXIgZmllbGQ9JCh0aGlzLnJlZnMuc2VhcmNodHlwZS5nZXRET01Ob2RlKCkpLmZpbmQoXCIuYWN0aXZlXCIpWzBdLmRhdGFzZXQudHlwZTtcbiAgICBcbiAgXHR0aGlzLnByb3BzLmRvc2VhcmNoKHRvZmluZCxmaWVsZCk7XG4gIH0sXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFxuICBcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIiwgbnVsbCwgXG5cdCAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImNvbC1zbS0zXCJ9LCBcblx0ICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7Y2xhc3NOYW1lOiBcImZvcm0tY29udHJvbCBjb2wtc20tMVwiLCB0eXBlOiBcInRleHRcIiwgcmVmOiBcInRvZmluZFwiLCBkZWZhdWx0VmFsdWU6IFwi5piOXCIsIG9uQ2hhbmdlOiB0aGlzLmRvc2VhcmNofSlcblx0ICApLCBcblx0ICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiYnJcIiwgbnVsbCksIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJiclwiLCBudWxsKSwgXCLCoMKgwqDCoFwiLCAgICAgXG5cdCAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCB7Y2xhc3NOYW1lOiBcImJ0bi1ncm91cFwiLCBcImRhdGEtdG9nZ2xlXCI6IFwiYnV0dG9uc1wiLCByZWY6IFwic2VhcmNodHlwZVwiLCBvbkNsaWNrOiB0aGlzLmRvc2VhcmNofSwgXG5cdCAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge1wiZGF0YS10eXBlXCI6IFwic3RhcnRcIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2VzcyBhY3RpdmVcIn0sIFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwicmFkaW9cIiwgbmFtZTogXCJmaWVsZFwiLCBhdXRvY29tcGxldGU6IFwib2ZmXCJ9LCBcIumgrVwiKVxuXHQgICAgKSwgXG5cdCAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge1wiZGF0YS10eXBlXCI6IFwiZW5kXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXN1Y2Nlc3NcIn0sIFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwicmFkaW9cIiwgbmFtZTogXCJmaWVsZFwiLCBhdXRvY29tcGxldGU6IFwib2ZmXCJ9LCBcIuWwvlwiKVxuXHQgICAgKSwgXG5cdCAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge1wiZGF0YS10eXBlXCI6IFwibWlkZGxlXCIsIGNsYXNzTmFtZTogXCJidG4gYnRuLXN1Y2Nlc3NcIn0sIFxuXHQgICAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwiaW5wdXRcIiwge3R5cGU6IFwicmFkaW9cIiwgbmFtZTogXCJmaWVsZFwiLCBhdXRvY29tcGxldGU6IFwib2ZmXCJ9LCBcIuS4rVwiKVxuXHQgICAgKSwgXG5cdCAgICBSZWFjdC5jcmVhdGVFbGVtZW50KFwibGFiZWxcIiwge1wiZGF0YS10eXBlXCI6IFwiZnVsbHRleHRcIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tc3VjY2Vzc1wifSwgXG5cdCAgICAgIFJlYWN0LmNyZWF0ZUVsZW1lbnQoXCJpbnB1dFwiLCB7dHlwZTogXCJyYWRpb1wiLCBuYW1lOiBcImZpZWxkXCIsIGF1dG9jb21wbGV0ZTogXCJvZmZcIn0sIFwi5YWoXCIpXG5cdCAgICApXG5cdCAgKVxuXHQpXG4gIClcbiAgICBcdFxuICAgICk7IFxuICB9XG59KTtcbm1vZHVsZS5leHBvcnRzPVNlYXJjaGJhcjsiLCJ2YXIgU2VhcmNoaGlzdG9yeT1SZWFjdC5jcmVhdGVDbGFzcyh7ZGlzcGxheU5hbWU6IFwiU2VhcmNoaGlzdG9yeVwiLFxuICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICBcdHJldHVybiB7fTtcbiAgfSxcbiAgXG4gIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuKFxuXHRSZWFjdC5jcmVhdGVFbGVtZW50KFwiZGl2XCIsIG51bGwsIFwicmVuZGVyIFNlYXJjaGhpc3RvcnlcIilcbiAgICBcdFxuICAgICk7IFxuICB9XG59KTtcbm1vZHVsZS5leHBvcnRzPVNlYXJjaGhpc3Rvcnk7IiwidmFyIFNlYXJjaGhpc3Rvcnk9cmVxdWlyZShcIi4vc2VhcmNoaGlzdG9yeS5qc3hcIik7XG52YXIgRGVmYm94PXJlcXVpcmUoXCIuL2RlZmJveC5qc3hcIik7XG52YXIgU2hvd3RleHQ9UmVhY3QuY3JlYXRlQ2xhc3Moe2Rpc3BsYXlOYW1lOiBcIlNob3d0ZXh0XCIsXG4gIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG4gIFx0cmV0dXJuIHt9O1xuICB9LFxuICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAoXG4gICAgUmVhY3QuY3JlYXRlRWxlbWVudChcImRpdlwiLCBudWxsLCBcbiAgICBcdFJlYWN0LmNyZWF0ZUVsZW1lbnQoU2VhcmNoaGlzdG9yeSwge3Jlc3VsdDogdGhpcy5wcm9wcy5yZXN1bHR9KSwgXG4gICAgXHRSZWFjdC5jcmVhdGVFbGVtZW50KERlZmJveCwge3Jlc3VsdDogdGhpcy5wcm9wcy5yZXN1bHR9KVx0XG4gICAgKVxuICAgICk7XG4gIH1cbn0pO1xubW9kdWxlLmV4cG9ydHM9U2hvd3RleHQ7IiwidmFyIHRva2VuaXplcnM9cmVxdWlyZSgnLi90b2tlbml6ZXJzJyk7XG52YXIgbm9ybWFsaXplVGJsPW51bGw7XG52YXIgc2V0Tm9ybWFsaXplVGFibGU9ZnVuY3Rpb24odGJsLG9iaikge1xuXHRpZiAoIW9iaikge1xuXHRcdG9iaj17fTtcblx0XHRmb3IgKHZhciBpPTA7aTx0YmwubGVuZ3RoO2krKykge1xuXHRcdFx0dmFyIGFycj10YmxbaV0uc3BsaXQoXCI9XCIpO1xuXHRcdFx0b2JqW2FyclswXV09YXJyWzFdO1xuXHRcdH1cblx0fVxuXHRub3JtYWxpemVUYmw9b2JqO1xuXHRyZXR1cm4gb2JqO1xufVxudmFyIG5vcm1hbGl6ZTE9ZnVuY3Rpb24odG9rZW4pIHtcblx0aWYgKCF0b2tlbikgcmV0dXJuIFwiXCI7XG5cdHRva2VuPXRva2VuLnJlcGxhY2UoL1sgXFxuXFwuLO+8jOOAgu+8ge+8juOAjOOAje+8mu+8m+OAgV0vZywnJykudHJpbSgpO1xuXHRpZiAoIW5vcm1hbGl6ZVRibCkgcmV0dXJuIHRva2VuO1xuXHRpZiAodG9rZW4ubGVuZ3RoPT0xKSB7XG5cdFx0cmV0dXJuIG5vcm1hbGl6ZVRibFt0b2tlbl0gfHwgdG9rZW47XG5cdH0gZWxzZSB7XG5cdFx0Zm9yICh2YXIgaT0wO2k8dG9rZW4ubGVuZ3RoO2krKykge1xuXHRcdFx0dG9rZW5baV09bm9ybWFsaXplVGJsW3Rva2VuW2ldXSB8fCB0b2tlbltpXTtcblx0XHR9XG5cdFx0cmV0dXJuIHRva2VuO1xuXHR9XG59XG52YXIgaXNTa2lwMT1mdW5jdGlvbih0b2tlbikge1xuXHR2YXIgdD10b2tlbi50cmltKCk7XG5cdHJldHVybiAodD09XCJcIiB8fCB0PT1cIuOAgFwiIHx8IHQ9PVwi4oC7XCIgfHwgdD09XCJcXG5cIik7XG59XG52YXIgbm9ybWFsaXplX3RpYmV0YW49ZnVuY3Rpb24odG9rZW4pIHtcblx0cmV0dXJuIHRva2VuLnJlcGxhY2UoL1vgvI3gvIsgXS9nLCcnKS50cmltKCk7XG59XG5cbnZhciBpc1NraXBfdGliZXRhbj1mdW5jdGlvbih0b2tlbikge1xuXHR2YXIgdD10b2tlbi50cmltKCk7XG5cdHJldHVybiAodD09XCJcIiB8fCB0PT1cIuOAgFwiIHx8ICB0PT1cIlxcblwiKTtcdFxufVxudmFyIHNpbXBsZTE9e1xuXHRmdW5jOntcblx0XHR0b2tlbml6ZTp0b2tlbml6ZXJzLnNpbXBsZVxuXHRcdCxzZXROb3JtYWxpemVUYWJsZTpzZXROb3JtYWxpemVUYWJsZVxuXHRcdCxub3JtYWxpemU6IG5vcm1hbGl6ZTFcblx0XHQsaXNTa2lwOlx0aXNTa2lwMVxuXHR9XG5cdFxufVxudmFyIHRpYmV0YW4xPXtcblx0ZnVuYzp7XG5cdFx0dG9rZW5pemU6dG9rZW5pemVycy50aWJldGFuXG5cdFx0LHNldE5vcm1hbGl6ZVRhYmxlOnNldE5vcm1hbGl6ZVRhYmxlXG5cdFx0LG5vcm1hbGl6ZTpub3JtYWxpemVfdGliZXRhblxuXHRcdCxpc1NraXA6aXNTa2lwX3RpYmV0YW5cblx0fVxufVxubW9kdWxlLmV4cG9ydHM9e1wic2ltcGxlMVwiOnNpbXBsZTEsXCJ0aWJldGFuMVwiOnRpYmV0YW4xfSIsIi8qIFxuICBjdXN0b20gZnVuYyBmb3IgYnVpbGRpbmcgYW5kIHNlYXJjaGluZyB5ZGJcblxuICBrZWVwIGFsbCB2ZXJzaW9uXG4gIFxuICBnZXRBUEkodmVyc2lvbik7IC8vcmV0dXJuIGhhc2ggb2YgZnVuY3Rpb25zICwgaWYgdmVyIGlzIG9taXQgLCByZXR1cm4gbGFzdGVzdFxuXHRcbiAgcG9zdGluZ3MyVHJlZSAgICAgIC8vIGlmIHZlcnNpb24gaXMgbm90IHN1cHBseSwgZ2V0IGxhc3Rlc3RcbiAgdG9rZW5pemUodGV4dCxhcGkpIC8vIGNvbnZlcnQgYSBzdHJpbmcgaW50byB0b2tlbnMoZGVwZW5kcyBvbiBvdGhlciBhcGkpXG4gIG5vcm1hbGl6ZVRva2VuICAgICAvLyBzdGVtbWluZyBhbmQgZXRjXG4gIGlzU3BhY2VDaGFyICAgICAgICAvLyBub3QgYSBzZWFyY2hhYmxlIHRva2VuXG4gIGlzU2tpcENoYXIgICAgICAgICAvLyAwIHZwb3NcblxuICBmb3IgY2xpZW50IGFuZCBzZXJ2ZXIgc2lkZVxuICBcbiovXG52YXIgY29uZmlncz1yZXF1aXJlKFwiLi9jb25maWdzXCIpO1xudmFyIGNvbmZpZ19zaW1wbGU9XCJzaW1wbGUxXCI7XG52YXIgb3B0aW1pemU9ZnVuY3Rpb24oanNvbixjb25maWcpIHtcblx0Y29uZmlnPWNvbmZpZ3x8Y29uZmlnX3NpbXBsZTtcblx0cmV0dXJuIGpzb247XG59XG5cbnZhciBnZXRBUEk9ZnVuY3Rpb24oY29uZmlnKSB7XG5cdGNvbmZpZz1jb25maWd8fGNvbmZpZ19zaW1wbGU7XG5cdHZhciBmdW5jPWNvbmZpZ3NbY29uZmlnXS5mdW5jO1xuXHRmdW5jLm9wdGltaXplPW9wdGltaXplO1xuXHRpZiAoY29uZmlnPT1cInNpbXBsZTFcIikge1xuXHRcdC8vYWRkIGNvbW1vbiBjdXN0b20gZnVuY3Rpb24gaGVyZVxuXHR9IGVsc2UgaWYgKGNvbmZpZz09XCJ0aWJldGFuMVwiKSB7XG5cblx0fSBlbHNlIHRocm93IFwiY29uZmlnIFwiK2NvbmZpZyArXCJub3Qgc3VwcG9ydGVkXCI7XG5cblx0cmV0dXJuIGZ1bmM7XG59XG5cbm1vZHVsZS5leHBvcnRzPXtnZXRBUEk6Z2V0QVBJfTsiLCJ2YXIgdGliZXRhbiA9ZnVuY3Rpb24ocykge1xuXHQvL2NvbnRpbnVvdXMgdHNoZWcgZ3JvdXBlZCBpbnRvIHNhbWUgdG9rZW5cblx0Ly9zaGFkIGFuZCBzcGFjZSBncm91cGVkIGludG8gc2FtZSB0b2tlblxuXHR2YXIgb2Zmc2V0PTA7XG5cdHZhciB0b2tlbnM9W10sb2Zmc2V0cz1bXTtcblx0cz1zLnJlcGxhY2UoL1xcclxcbi9nLCdcXG4nKS5yZXBsYWNlKC9cXHIvZywnXFxuJyk7XG5cdHZhciBhcnI9cy5zcGxpdCgnXFxuJyk7XG5cblx0Zm9yICh2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgbGFzdD0wO1xuXHRcdHZhciBzdHI9YXJyW2ldO1xuXHRcdHN0ci5yZXBsYWNlKC9b4LyN4LyLIF0rL2csZnVuY3Rpb24obSxtMSl7XG5cdFx0XHR0b2tlbnMucHVzaChzdHIuc3Vic3RyaW5nKGxhc3QsbTEpK20pO1xuXHRcdFx0b2Zmc2V0cy5wdXNoKG9mZnNldCtsYXN0KTtcblx0XHRcdGxhc3Q9bTErbS5sZW5ndGg7XG5cdFx0fSk7XG5cdFx0aWYgKGxhc3Q8c3RyLmxlbmd0aCkge1xuXHRcdFx0dG9rZW5zLnB1c2goc3RyLnN1YnN0cmluZyhsYXN0KSk7XG5cdFx0XHRvZmZzZXRzLnB1c2gobGFzdCk7XG5cdFx0fVxuXHRcdGlmIChpPT09YXJyLmxlbmd0aC0xKSBicmVhaztcblx0XHR0b2tlbnMucHVzaCgnXFxuJyk7XG5cdFx0b2Zmc2V0cy5wdXNoKG9mZnNldCtsYXN0KTtcblx0XHRvZmZzZXQrPXN0ci5sZW5ndGgrMTtcblx0fVxuXG5cdHJldHVybiB7dG9rZW5zOnRva2VucyxvZmZzZXRzOm9mZnNldHN9O1xufTtcbnZhciBpc1NwYWNlPWZ1bmN0aW9uKGMpIHtcblx0cmV0dXJuIChjPT1cIiBcIikgOy8vfHwgKGM9PVwiLFwiKSB8fCAoYz09XCIuXCIpO1xufVxudmFyIGlzQ0pLID1mdW5jdGlvbihjKSB7cmV0dXJuICgoYz49MHgzMDAwICYmIGM8PTB4OUZGRikgXG58fCAoYz49MHhEODAwICYmIGM8MHhEQzAwKSB8fCAoYz49MHhGRjAwKSApIDt9XG52YXIgc2ltcGxlMT1mdW5jdGlvbihzKSB7XG5cdHZhciBvZmZzZXQ9MDtcblx0dmFyIHRva2Vucz1bXSxvZmZzZXRzPVtdO1xuXHRzPXMucmVwbGFjZSgvXFxyXFxuL2csJ1xcbicpLnJlcGxhY2UoL1xcci9nLCdcXG4nKTtcblx0YXJyPXMuc3BsaXQoJ1xcbicpO1xuXG5cdHZhciBwdXNodG9rZW49ZnVuY3Rpb24odCxvZmYpIHtcblx0XHR2YXIgaT0wO1xuXHRcdGlmICh0LmNoYXJDb2RlQXQoMCk+MjU1KSB7XG5cdFx0XHR3aGlsZSAoaTx0Lmxlbmd0aCkge1xuXHRcdFx0XHR2YXIgYz10LmNoYXJDb2RlQXQoaSk7XG5cdFx0XHRcdG9mZnNldHMucHVzaChvZmYraSk7XG5cdFx0XHRcdHRva2Vucy5wdXNoKHRbaV0pO1xuXHRcdFx0XHRpZiAoYz49MHhEODAwICYmIGM8PTB4REZGRikge1xuXHRcdFx0XHRcdHRva2Vuc1t0b2tlbnMubGVuZ3RoLTFdKz10W2ldOyAvL2V4dGVuc2lvbiBCLEMsRFxuXHRcdFx0XHR9XG5cdFx0XHRcdGkrKztcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dG9rZW5zLnB1c2godCk7XG5cdFx0XHRvZmZzZXRzLnB1c2gob2ZmKTtcdFxuXHRcdH1cblx0fVxuXHRmb3IgKHZhciBpPTA7aTxhcnIubGVuZ3RoO2krKykge1xuXHRcdHZhciBsYXN0PTAsc3A9XCJcIjtcblx0XHRzdHI9YXJyW2ldO1xuXHRcdHN0ci5yZXBsYWNlKC9bXzAtOUEtWmEtel0rL2csZnVuY3Rpb24obSxtMSl7XG5cdFx0XHR3aGlsZSAoaXNTcGFjZShzcD1zdHJbbGFzdF0pICYmIGxhc3Q8c3RyLmxlbmd0aCkge1xuXHRcdFx0XHR0b2tlbnNbdG9rZW5zLmxlbmd0aC0xXSs9c3A7XG5cdFx0XHRcdGxhc3QrKztcblx0XHRcdH1cblx0XHRcdHB1c2h0b2tlbihzdHIuc3Vic3RyaW5nKGxhc3QsbTEpK20gLCBvZmZzZXQrbGFzdCk7XG5cdFx0XHRvZmZzZXRzLnB1c2gob2Zmc2V0K2xhc3QpO1xuXHRcdFx0bGFzdD1tMSttLmxlbmd0aDtcblx0XHR9KTtcblxuXHRcdGlmIChsYXN0PHN0ci5sZW5ndGgpIHtcblx0XHRcdHdoaWxlIChpc1NwYWNlKHNwPXN0cltsYXN0XSkgJiYgbGFzdDxzdHIubGVuZ3RoKSB7XG5cdFx0XHRcdHRva2Vuc1t0b2tlbnMubGVuZ3RoLTFdKz1zcDtcblx0XHRcdFx0bGFzdCsrO1xuXHRcdFx0fVxuXHRcdFx0cHVzaHRva2VuKHN0ci5zdWJzdHJpbmcobGFzdCksIG9mZnNldCtsYXN0KTtcblx0XHRcdFxuXHRcdH1cdFx0XG5cdFx0b2Zmc2V0cy5wdXNoKG9mZnNldCtsYXN0KTtcblx0XHRvZmZzZXQrPXN0ci5sZW5ndGgrMTtcblx0XHRpZiAoaT09PWFyci5sZW5ndGgtMSkgYnJlYWs7XG5cdFx0dG9rZW5zLnB1c2goJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIHt0b2tlbnM6dG9rZW5zLG9mZnNldHM6b2Zmc2V0c307XG5cbn07XG5cbnZhciBzaW1wbGU9ZnVuY3Rpb24ocykge1xuXHR2YXIgdG9rZW49Jyc7XG5cdHZhciB0b2tlbnM9W10sIG9mZnNldHM9W10gO1xuXHR2YXIgaT0wOyBcblx0dmFyIGxhc3RzcGFjZT1mYWxzZTtcblx0dmFyIGFkZHRva2VuPWZ1bmN0aW9uKCkge1xuXHRcdGlmICghdG9rZW4pIHJldHVybjtcblx0XHR0b2tlbnMucHVzaCh0b2tlbik7XG5cdFx0b2Zmc2V0cy5wdXNoKGkpO1xuXHRcdHRva2VuPScnO1xuXHR9XG5cdHdoaWxlIChpPHMubGVuZ3RoKSB7XG5cdFx0dmFyIGM9cy5jaGFyQXQoaSk7XG5cdFx0dmFyIGNvZGU9cy5jaGFyQ29kZUF0KGkpO1xuXHRcdGlmIChpc0NKSyhjb2RlKSkge1xuXHRcdFx0YWRkdG9rZW4oKTtcblx0XHRcdHRva2VuPWM7XG5cdFx0XHRpZiAoY29kZT49MHhEODAwICYmIGNvZGU8MHhEQzAwKSB7IC8vaGlnaCBzb3JyYWdhdGVcblx0XHRcdFx0dG9rZW4rPXMuY2hhckF0KGkrMSk7aSsrO1xuXHRcdFx0fVxuXHRcdFx0YWRkdG9rZW4oKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKGM9PScmJyB8fCBjPT0nPCcgfHwgYz09Jz8nIHx8IGM9PVwiLFwiIHx8IGM9PVwiLlwiXG5cdFx0XHR8fCBjPT0nfCcgfHwgYz09J34nIHx8IGM9PSdgJyB8fCBjPT0nOycgXG5cdFx0XHR8fCBjPT0nPicgfHwgYz09JzonIFxuXHRcdFx0fHwgYz09Jz0nIHx8IGM9PSdAJyAgfHwgYz09XCItXCIgXG5cdFx0XHR8fCBjPT0nXScgfHwgYz09J30nICB8fCBjPT1cIilcIiBcblx0XHRcdC8vfHwgYz09J3snIHx8IGM9PSd9J3x8IGM9PSdbJyB8fCBjPT0nXScgfHwgYz09JygnIHx8IGM9PScpJ1xuXHRcdFx0fHwgY29kZT09MHhmMGIgfHwgY29kZT09MHhmMGQgLy8gdGliZXRhbiBzcGFjZVxuXHRcdFx0fHwgKGNvZGU+PTB4MjAwMCAmJiBjb2RlPD0weDIwNmYpKSB7XG5cdFx0XHRcdGFkZHRva2VuKCk7XG5cdFx0XHRcdGlmIChjPT0nJicgfHwgYz09JzwnKXsgLy8gfHwgYz09J3snfHwgYz09JygnfHwgYz09J1snKSB7XG5cdFx0XHRcdFx0dmFyIGVuZGNoYXI9Jz4nO1xuXHRcdFx0XHRcdGlmIChjPT0nJicpIGVuZGNoYXI9JzsnXG5cdFx0XHRcdFx0Ly9lbHNlIGlmIChjPT0neycpIGVuZGNoYXI9J30nO1xuXHRcdFx0XHRcdC8vZWxzZSBpZiAoYz09J1snKSBlbmRjaGFyPSddJztcblx0XHRcdFx0XHQvL2Vsc2UgaWYgKGM9PScoJykgZW5kY2hhcj0nKSc7XG5cblx0XHRcdFx0XHR3aGlsZSAoaTxzLmxlbmd0aCAmJiBzLmNoYXJBdChpKSE9ZW5kY2hhcikge1xuXHRcdFx0XHRcdFx0dG9rZW4rPXMuY2hhckF0KGkpO1xuXHRcdFx0XHRcdFx0aSsrO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHR0b2tlbis9ZW5kY2hhcjtcblx0XHRcdFx0XHRhZGR0b2tlbigpO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHRva2VuPWM7XG5cdFx0XHRcdFx0YWRkdG9rZW4oKTtcblx0XHRcdFx0fVxuXHRcdFx0XHR0b2tlbj0nJztcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmIChjPT1cIiBcIikge1xuXHRcdFx0XHRcdHRva2VuKz1jO1xuXHRcdFx0XHRcdGxhc3RzcGFjZT10cnVlO1xuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdGlmIChsYXN0c3BhY2UpIGFkZHRva2VuKCk7XG5cdFx0XHRcdFx0bGFzdHNwYWNlPWZhbHNlO1xuXHRcdFx0XHRcdHRva2VuKz1jO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGkrKztcblx0fVxuXHRhZGR0b2tlbigpO1xuXHRyZXR1cm4ge3Rva2Vuczp0b2tlbnMsb2Zmc2V0czpvZmZzZXRzfTtcbn1cbm1vZHVsZS5leHBvcnRzPXtzaW1wbGU6c2ltcGxlLHRpYmV0YW46dGliZXRhbn07IiwidmFyIGluZGV4T2ZTb3J0ZWQgPSBmdW5jdGlvbiAoYXJyYXksIG9iaiwgbmVhcikgeyBcbiAgdmFyIGxvdyA9IDAsXG4gIGhpZ2ggPSBhcnJheS5sZW5ndGg7XG4gIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxO1xuICAgIGlmIChhcnJheVttaWRdPT1vYmopIHJldHVybiBtaWQ7XG4gICAgYXJyYXlbbWlkXSA8IG9iaiA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICB9XG4gIGlmIChuZWFyKSByZXR1cm4gbG93O1xuICBlbHNlIGlmIChhcnJheVtsb3ddPT1vYmopIHJldHVybiBsb3c7ZWxzZSByZXR1cm4gLTE7XG59O1xudmFyIGluZGV4T2ZTb3J0ZWRfc3RyID0gZnVuY3Rpb24gKGFycmF5LCBvYmosIG5lYXIpIHsgXG4gIHZhciBsb3cgPSAwLFxuICBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobG93IDwgaGlnaCkge1xuICAgIHZhciBtaWQgPSAobG93ICsgaGlnaCkgPj4gMTtcbiAgICBpZiAoYXJyYXlbbWlkXT09b2JqKSByZXR1cm4gbWlkO1xuICAgIChhcnJheVttaWRdLmxvY2FsZUNvbXBhcmUob2JqKTwwKSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICB9XG4gIGlmIChuZWFyKSByZXR1cm4gbG93O1xuICBlbHNlIGlmIChhcnJheVtsb3ddPT1vYmopIHJldHVybiBsb3c7ZWxzZSByZXR1cm4gLTE7XG59O1xuXG5cbnZhciBic2VhcmNoPWZ1bmN0aW9uKGFycmF5LHZhbHVlLG5lYXIpIHtcblx0dmFyIGZ1bmM9aW5kZXhPZlNvcnRlZDtcblx0aWYgKHR5cGVvZiBhcnJheVswXT09XCJzdHJpbmdcIikgZnVuYz1pbmRleE9mU29ydGVkX3N0cjtcblx0cmV0dXJuIGZ1bmMoYXJyYXksdmFsdWUsbmVhcik7XG59XG52YXIgYnNlYXJjaE5lYXI9ZnVuY3Rpb24oYXJyYXksdmFsdWUpIHtcblx0cmV0dXJuIGJzZWFyY2goYXJyYXksdmFsdWUsdHJ1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzPWJzZWFyY2g7Ly97YnNlYXJjaE5lYXI6YnNlYXJjaE5lYXIsYnNlYXJjaDpic2VhcmNofTsiLCJ2YXIgS0RFPXJlcXVpcmUoXCIuL2tkZVwiKTtcbi8vY3VycmVudGx5IG9ubHkgc3VwcG9ydCBub2RlLmpzIGZzLCBrc2FuYWdhcCBuYXRpdmUgZnMsIGh0bWw1IGZpbGUgc3lzdGVtXG4vL3VzZSBzb2NrZXQuaW8gdG8gcmVhZCBrZGIgZnJvbSByZW1vdGUgc2VydmVyIGluIGZ1dHVyZVxubW9kdWxlLmV4cG9ydHM9S0RFOyIsIi8qIEtzYW5hIERhdGFiYXNlIEVuZ2luZVxuXG4gICAyMDE1LzEvMiAsIFxuICAgbW92ZSB0byBrc2FuYS1kYXRhYmFzZVxuICAgc2ltcGxpZmllZCBieSByZW1vdmluZyBkb2N1bWVudCBzdXBwb3J0IGFuZCBzb2NrZXQuaW8gc3VwcG9ydFxuXG5cbiovXG52YXIgcG9vbD17fSxsb2NhbFBvb2w9e307XG52YXIgYXBwcGF0aD1cIlwiO1xudmFyIGJzZWFyY2g9cmVxdWlyZShcIi4vYnNlYXJjaFwiKTtcbnZhciBLZGI9cmVxdWlyZSgna3NhbmEtanNvbnJvbScpO1xudmFyIGtkYnM9W107IC8vYXZhaWxhYmxlIGtkYiAsIGlkIGFuZCBhYnNvbHV0ZSBwYXRoXG52YXIgc3Ryc2VwPVwiXFx1ZmZmZlwiO1xudmFyIGtkYmxpc3RlZD1mYWxzZTtcbi8qXG52YXIgX2dldFN5bmM9ZnVuY3Rpb24ocGF0aHMsb3B0cykge1xuXHR2YXIgb3V0PVtdO1xuXHRmb3IgKHZhciBpIGluIHBhdGhzKSB7XG5cdFx0b3V0LnB1c2godGhpcy5nZXRTeW5jKHBhdGhzW2ldLG9wdHMpKTtcdFxuXHR9XG5cdHJldHVybiBvdXQ7XG59XG4qL1xudmFyIF9nZXRzPWZ1bmN0aW9uKHBhdGhzLG9wdHMsY2IpIHsgLy9nZXQgbWFueSBkYXRhIHdpdGggb25lIGNhbGxcblxuXHRpZiAoIXBhdGhzKSByZXR1cm4gO1xuXHRpZiAodHlwZW9mIHBhdGhzPT0nc3RyaW5nJykge1xuXHRcdHBhdGhzPVtwYXRoc107XG5cdH1cblx0dmFyIGVuZ2luZT10aGlzLCBvdXRwdXQ9W107XG5cblx0dmFyIG1ha2VjYj1mdW5jdGlvbihwYXRoKXtcblx0XHRyZXR1cm4gZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdGlmICghKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSBvdXRwdXQucHVzaChkYXRhKTtcblx0XHRcdFx0ZW5naW5lLmdldChwYXRoLG9wdHMsdGFza3F1ZXVlLnNoaWZ0KCkpO1xuXHRcdH07XG5cdH07XG5cblx0dmFyIHRhc2txdWV1ZT1bXTtcblx0Zm9yICh2YXIgaT0wO2k8cGF0aHMubGVuZ3RoO2krKykge1xuXHRcdGlmICh0eXBlb2YgcGF0aHNbaV09PVwibnVsbFwiKSB7IC8vdGhpcyBpcyBvbmx5IGEgcGxhY2UgaG9sZGVyIGZvciBrZXkgZGF0YSBhbHJlYWR5IGluIGNsaWVudCBjYWNoZVxuXHRcdFx0b3V0cHV0LnB1c2gobnVsbCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRhc2txdWV1ZS5wdXNoKG1ha2VjYihwYXRoc1tpXSkpO1xuXHRcdH1cblx0fTtcblxuXHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcblx0XHRvdXRwdXQucHVzaChkYXRhKTtcblx0XHRjYi5hcHBseShlbmdpbmUuY29udGV4dHx8ZW5naW5lLFtvdXRwdXQscGF0aHNdKTsgLy9yZXR1cm4gdG8gY2FsbGVyXG5cdH0pO1xuXG5cdHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTsgLy9ydW4gdGhlIHRhc2tcbn1cblxudmFyIGdldEZpbGVSYW5nZT1mdW5jdGlvbihpKSB7XG5cdHZhciBlbmdpbmU9dGhpcztcblxuXHR2YXIgZmlsZVBhZ2VDb3VudD1lbmdpbmUuZ2V0KFtcImZpbGVQYWdlQ291bnRcIl0pO1xuXHRpZiAoZmlsZVBhZ2VDb3VudCkge1xuXHRcdGlmIChpPT0wKSB7XG5cdFx0XHRyZXR1cm4ge3N0YXJ0OjAsZW5kOmZpbGVQYWdlQ291bnRbMF0tMX07XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB7c3RhcnQ6ZmlsZVBhZ2VDb3VudFtpLTFdLGVuZDpmaWxlUGFnZUNvdW50W2ldLTF9O1xuXHRcdH1cblx0fVxuXG5cdC8vb2xkIGJ1Z2d5IGNvZGVcblx0dmFyIGZpbGVOYW1lcz1lbmdpbmUuZ2V0KFtcImZpbGVOYW1lc1wiXSk7XG5cdHZhciBmaWxlT2Zmc2V0cz1lbmdpbmUuZ2V0KFtcImZpbGVPZmZzZXRzXCJdKTtcblx0dmFyIHBhZ2VPZmZzZXRzPWVuZ2luZS5nZXQoW1wicGFnZU9mZnNldHNcIl0pO1xuXHR2YXIgcGFnZU5hbWVzPWVuZ2luZS5nZXQoW1wicGFnZU5hbWVzXCJdKTtcblx0dmFyIGZpbGVTdGFydD1maWxlT2Zmc2V0c1tpXSwgZmlsZUVuZD1maWxlT2Zmc2V0c1tpKzFdLTE7XG5cblx0XG5cdHZhciBzdGFydD1ic2VhcmNoKHBhZ2VPZmZzZXRzLGZpbGVTdGFydCx0cnVlKTtcdFxuXHQvL2lmIChwYWdlT2Zmc2V0c1tzdGFydF09PWZpbGVTdGFydCkgc3RhcnQtLTtcblx0XG5cdC8vd29yayBhcm91bmQgZm9yIGppYW5na2FuZ3l1clxuXHR3aGlsZSAocGFnZU5hbWVzW3N0YXJ0KzFdPT1cIl9cIikgc3RhcnQrKztcblxuICAvL2lmIChpPT0wKSBzdGFydD0wOyAvL3dvcmsgYXJvdW5kIGZvciBmaXJzdCBmaWxlXG5cdHZhciBlbmQ9YnNlYXJjaChwYWdlT2Zmc2V0cyxmaWxlRW5kLHRydWUpO1xuXHRyZXR1cm4ge3N0YXJ0OnN0YXJ0LGVuZDplbmR9O1xufVxuXG52YXIgZ2V0ZnA9ZnVuY3Rpb24oYWJzb2x1dGVwYWdlKSB7XG5cdHZhciBmaWxlT2Zmc2V0cz10aGlzLmdldChbXCJmaWxlT2Zmc2V0c1wiXSk7XG5cdHZhciBwYWdlT2Zmc2V0cz10aGlzLmdldChbXCJwYWdlT2Zmc2V0c1wiXSk7XG5cdHZhciBwYWdlb2Zmc2V0PXBhZ2VPZmZzZXRzW2Fic29sdXRlcGFnZV07XG5cdHZhciBmaWxlPWJzZWFyY2goZmlsZU9mZnNldHMscGFnZW9mZnNldCx0cnVlKS0xO1xuXG5cdHZhciBmaWxlU3RhcnQ9ZmlsZU9mZnNldHNbZmlsZV07XG5cdHZhciBzdGFydD1ic2VhcmNoKHBhZ2VPZmZzZXRzLGZpbGVTdGFydCx0cnVlKTtcdFxuXG5cdHZhciBwYWdlPWFic29sdXRlcGFnZS1zdGFydC0xO1xuXHRyZXR1cm4ge2ZpbGU6ZmlsZSxwYWdlOnBhZ2V9O1xufVxuLy9yZXR1cm4gYXJyYXkgb2Ygb2JqZWN0IG9mIG5maWxlIG5wYWdlIGdpdmVuIHBhZ2VuYW1lXG52YXIgZmluZFBhZ2U9ZnVuY3Rpb24ocGFnZW5hbWUpIHtcblx0dmFyIHBhZ2VuYW1lcz10aGlzLmdldChcInBhZ2VOYW1lc1wiKTtcblx0dmFyIG91dD1bXTtcblx0Zm9yICh2YXIgaT0wO2k8cGFnZW5hbWVzLmxlbmd0aDtpKyspIHtcblx0XHRpZiAocGFnZW5hbWVzW2ldPT1wYWdlbmFtZSkge1xuXHRcdFx0dmFyIGZwPWdldGZwLmFwcGx5KHRoaXMsW2ldKTtcblx0XHRcdG91dC5wdXNoKHtmaWxlOmZwLmZpbGUscGFnZTpmcC5wYWdlLGFic3BhZ2U6aX0pO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gb3V0O1xufVxudmFyIGdldEZpbGVQYWdlT2Zmc2V0cz1mdW5jdGlvbihpKSB7XG5cdHZhciBwYWdlT2Zmc2V0cz10aGlzLmdldChcInBhZ2VPZmZzZXRzXCIpO1xuXHR2YXIgcmFuZ2U9Z2V0RmlsZVJhbmdlLmFwcGx5KHRoaXMsW2ldKTtcblx0cmV0dXJuIHBhZ2VPZmZzZXRzLnNsaWNlKHJhbmdlLnN0YXJ0LHJhbmdlLmVuZCsxKTtcbn1cblxudmFyIGdldEZpbGVQYWdlTmFtZXM9ZnVuY3Rpb24oaSkge1xuXHR2YXIgcmFuZ2U9Z2V0RmlsZVJhbmdlLmFwcGx5KHRoaXMsW2ldKTtcblx0dmFyIHBhZ2VOYW1lcz10aGlzLmdldChcInBhZ2VOYW1lc1wiKTtcblx0cmV0dXJuIHBhZ2VOYW1lcy5zbGljZShyYW5nZS5zdGFydCxyYW5nZS5lbmQrMSk7XG59XG52YXIgbG9jYWxlbmdpbmVfZ2V0PWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xuXHR2YXIgZW5naW5lPXRoaXM7XG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XG5cdFx0Y2I9b3B0cztcblx0XHRvcHRzPXtyZWN1cnNpdmU6ZmFsc2V9O1xuXHR9XG5cdGlmICghcGF0aCkge1xuXHRcdGlmIChjYikgY2IobnVsbCk7XG5cdFx0cmV0dXJuIG51bGw7XG5cdH1cblxuXHRpZiAodHlwZW9mIGNiIT1cImZ1bmN0aW9uXCIpIHtcblx0XHRyZXR1cm4gZW5naW5lLmtkYi5nZXQocGF0aCxvcHRzKTtcblx0fVxuXG5cdGlmICh0eXBlb2YgcGF0aD09XCJzdHJpbmdcIikge1xuXHRcdHJldHVybiBlbmdpbmUua2RiLmdldChbcGF0aF0sb3B0cyxjYik7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHBhdGhbMF0gPT1cInN0cmluZ1wiKSB7XG5cdFx0cmV0dXJuIGVuZ2luZS5rZGIuZ2V0KHBhdGgsb3B0cyxjYik7XG5cdH0gZWxzZSBpZiAodHlwZW9mIHBhdGhbMF0gPT1cIm9iamVjdFwiKSB7XG5cdFx0cmV0dXJuIF9nZXRzLmFwcGx5KGVuZ2luZSxbcGF0aCxvcHRzLGNiXSk7XG5cdH0gZWxzZSB7XG5cdFx0ZW5naW5lLmtkYi5nZXQoW10sb3B0cyxmdW5jdGlvbihkYXRhKXtcblx0XHRcdGNiKGRhdGFbMF0pOy8vcmV0dXJuIHRvcCBsZXZlbCBrZXlzXG5cdFx0fSk7XG5cdH1cbn07XHRcblxudmFyIGdldFByZWxvYWRGaWVsZD1mdW5jdGlvbih1c2VyKSB7XG5cdHZhciBwcmVsb2FkPVtbXCJtZXRhXCJdLFtcImZpbGVOYW1lc1wiXSxbXCJmaWxlT2Zmc2V0c1wiXSxbXCJwYWdlTmFtZXNcIl0sW1wicGFnZU9mZnNldHNcIl0sW1wiZmlsZVBhZ2VDb3VudFwiXV07XG5cdC8vW1widG9rZW5zXCJdLFtcInBvc3RpbmdzbGVuXCJdIGtzZSB3aWxsIGxvYWQgaXRcblx0aWYgKHVzZXIgJiYgdXNlci5sZW5ndGgpIHsgLy91c2VyIHN1cHBseSBwcmVsb2FkXG5cdFx0Zm9yICh2YXIgaT0wO2k8dXNlci5sZW5ndGg7aSsrKSB7XG5cdFx0XHRpZiAocHJlbG9hZC5pbmRleE9mKHVzZXJbaV0pPT0tMSkge1xuXHRcdFx0XHRwcmVsb2FkLnB1c2godXNlcltpXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBwcmVsb2FkO1xufVxudmFyIGNyZWF0ZUxvY2FsRW5naW5lPWZ1bmN0aW9uKGtkYixvcHRzLGNiLGNvbnRleHQpIHtcblx0dmFyIGVuZ2luZT17a2RiOmtkYiwgcXVlcnlDYWNoZTp7fSwgcG9zdGluZ0NhY2hlOnt9LCBjYWNoZTp7fX07XG5cblx0aWYgKHR5cGVvZiBjb250ZXh0PT1cIm9iamVjdFwiKSBlbmdpbmUuY29udGV4dD1jb250ZXh0O1xuXHRlbmdpbmUuZ2V0PWxvY2FsZW5naW5lX2dldDtcblxuXHRlbmdpbmUuZmlsZU9mZnNldD1maWxlT2Zmc2V0O1xuXHRlbmdpbmUuZm9sZGVyT2Zmc2V0PWZvbGRlck9mZnNldDtcblx0ZW5naW5lLnBhZ2VPZmZzZXQ9cGFnZU9mZnNldDtcblx0ZW5naW5lLmdldEZpbGVQYWdlTmFtZXM9Z2V0RmlsZVBhZ2VOYW1lcztcblx0ZW5naW5lLmdldEZpbGVQYWdlT2Zmc2V0cz1nZXRGaWxlUGFnZU9mZnNldHM7XG5cdGVuZ2luZS5nZXRGaWxlUmFuZ2U9Z2V0RmlsZVJhbmdlO1xuXHRlbmdpbmUuZmluZFBhZ2U9ZmluZFBhZ2U7XG5cdC8vb25seSBsb2NhbCBlbmdpbmUgYWxsb3cgZ2V0U3luY1xuXHQvL2lmIChrZGIuZnMuZ2V0U3luYykgZW5naW5lLmdldFN5bmM9ZW5naW5lLmtkYi5nZXRTeW5jO1xuXHRcblx0Ly9zcGVlZHkgbmF0aXZlIGZ1bmN0aW9uc1xuXHRpZiAoa2RiLmZzLm1lcmdlUG9zdGluZ3MpIHtcblx0XHRlbmdpbmUubWVyZ2VQb3N0aW5ncz1rZGIuZnMubWVyZ2VQb3N0aW5ncy5iaW5kKGtkYi5mcyk7XG5cdH1cblx0XG5cdHZhciBzZXRQcmVsb2FkPWZ1bmN0aW9uKHJlcykge1xuXHRcdGVuZ2luZS5kYm5hbWU9cmVzWzBdLm5hbWU7XG5cdFx0Ly9lbmdpbmUuY3VzdG9tZnVuYz1jdXN0b21mdW5jLmdldEFQSShyZXNbMF0uY29uZmlnKTtcblx0XHRlbmdpbmUucmVhZHk9dHJ1ZTtcblx0fVxuXG5cdHZhciBwcmVsb2FkPWdldFByZWxvYWRGaWVsZChvcHRzLnByZWxvYWQpO1xuXHR2YXIgb3B0cz17cmVjdXJzaXZlOnRydWV9O1xuXHQvL2lmICh0eXBlb2YgY2I9PVwiZnVuY3Rpb25cIikge1xuXHRcdF9nZXRzLmFwcGx5KGVuZ2luZSxbIHByZWxvYWQsIG9wdHMsZnVuY3Rpb24ocmVzKXtcblx0XHRcdHNldFByZWxvYWQocmVzKTtcblx0XHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFtlbmdpbmVdKTtcblx0XHR9XSk7XG5cdC8vfSBlbHNlIHtcblx0Ly9cdHNldFByZWxvYWQoX2dldFN5bmMuYXBwbHkoZW5naW5lLFtwcmVsb2FkLG9wdHNdKSk7XG5cdC8vfVxuXHRyZXR1cm4gZW5naW5lO1xufVxuXG52YXIgcGFnZU9mZnNldD1mdW5jdGlvbihwYWdlbmFtZSkge1xuXHR2YXIgZW5naW5lPXRoaXM7XG5cdGlmIChhcmd1bWVudHMubGVuZ3RoPjEpIHRocm93IFwiYXJndW1lbnQgOiBwYWdlbmFtZSBcIjtcblxuXHR2YXIgcGFnZU5hbWVzPWVuZ2luZS5nZXQoXCJwYWdlTmFtZXNcIik7XG5cdHZhciBwYWdlT2Zmc2V0cz1lbmdpbmUuZ2V0KFwicGFnZU9mZnNldHNcIik7XG5cblx0dmFyIGk9cGFnZU5hbWVzLmluZGV4T2YocGFnZW5hbWUpO1xuXHRyZXR1cm4gKGk+LTEpP3BhZ2VPZmZzZXRzW2ldOjA7XG59XG52YXIgZmlsZU9mZnNldD1mdW5jdGlvbihmbikge1xuXHR2YXIgZW5naW5lPXRoaXM7XG5cdHZhciBmaWxlbmFtZXM9ZW5naW5lLmdldChcImZpbGVOYW1lc1wiKTtcblx0dmFyIG9mZnNldHM9ZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpO1xuXHR2YXIgaT1maWxlbmFtZXMuaW5kZXhPZihmbik7XG5cdGlmIChpPT0tMSkgcmV0dXJuIG51bGw7XG5cdHJldHVybiB7c3RhcnQ6IG9mZnNldHNbaV0sIGVuZDpvZmZzZXRzW2krMV19O1xufVxuXG52YXIgZm9sZGVyT2Zmc2V0PWZ1bmN0aW9uKGZvbGRlcikge1xuXHR2YXIgZW5naW5lPXRoaXM7XG5cdHZhciBzdGFydD0wLGVuZD0wO1xuXHR2YXIgZmlsZW5hbWVzPWVuZ2luZS5nZXQoXCJmaWxlTmFtZXNcIik7XG5cdHZhciBvZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0Zm9yICh2YXIgaT0wO2k8ZmlsZW5hbWVzLmxlbmd0aDtpKyspIHtcblx0XHRpZiAoZmlsZW5hbWVzW2ldLnN1YnN0cmluZygwLGZvbGRlci5sZW5ndGgpPT1mb2xkZXIpIHtcblx0XHRcdGlmICghc3RhcnQpIHN0YXJ0PW9mZnNldHNbaV07XG5cdFx0XHRlbmQ9b2Zmc2V0c1tpXTtcblx0XHR9IGVsc2UgaWYgKHN0YXJ0KSBicmVhaztcblx0fVxuXHRyZXR1cm4ge3N0YXJ0OnN0YXJ0LGVuZDplbmR9O1xufVxuXG4gLy9UT0RPIGRlbGV0ZSBkaXJlY3RseSBmcm9tIGtkYiBpbnN0YW5jZVxuIC8va2RiLmZyZWUoKTtcbnZhciBjbG9zZUxvY2FsPWZ1bmN0aW9uKGtkYmlkKSB7XG5cdHZhciBlbmdpbmU9bG9jYWxQb29sW2tkYmlkXTtcblx0aWYgKGVuZ2luZSkge1xuXHRcdGVuZ2luZS5rZGIuZnJlZSgpO1xuXHRcdGRlbGV0ZSBsb2NhbFBvb2xba2RiaWRdO1xuXHR9XG59XG52YXIgY2xvc2U9ZnVuY3Rpb24oa2RiaWQpIHtcblx0dmFyIGVuZ2luZT1wb29sW2tkYmlkXTtcblx0aWYgKGVuZ2luZSkge1xuXHRcdGVuZ2luZS5rZGIuZnJlZSgpO1xuXHRcdGRlbGV0ZSBwb29sW2tkYmlkXTtcblx0fVxufVxuXG52YXIgZ2V0TG9jYWxUcmllcz1mdW5jdGlvbihrZGJmbikge1xuXHRpZiAoIWtkYmxpc3RlZCkge1xuXHRcdGtkYnM9cmVxdWlyZShcIi4vbGlzdGtkYlwiKSgpO1xuXHRcdGtkYmxpc3RlZD10cnVlO1xuXHR9XG5cblx0dmFyIGtkYmlkPWtkYmZuLnJlcGxhY2UoJy5rZGInLCcnKTtcblx0dmFyIHRyaWVzPSBbXCIuL1wiK2tkYmlkK1wiLmtkYlwiXG5cdCAgICAgICAgICAgLFwiLi4vXCIra2RiaWQrXCIua2RiXCJcblx0XTtcblxuXHRmb3IgKHZhciBpPTA7aTxrZGJzLmxlbmd0aDtpKyspIHtcblx0XHRpZiAoa2Ric1tpXVswXT09a2RiaWQpIHtcblx0XHRcdHRyaWVzLnB1c2goa2Ric1tpXVsxXSk7XG5cdFx0fVxuXHR9XG5cdHJldHVybiB0cmllcztcbn1cbnZhciBvcGVuTG9jYWxLc2FuYWdhcD1mdW5jdGlvbihrZGJpZCxvcHRzLGNiLGNvbnRleHQpIHtcblx0dmFyIGtkYmZuPWtkYmlkO1xuXHR2YXIgdHJpZXM9Z2V0TG9jYWxUcmllcyhrZGJmbik7XG5cblx0Zm9yICh2YXIgaT0wO2k8dHJpZXMubGVuZ3RoO2krKykge1xuXHRcdGlmIChmcy5leGlzdHNTeW5jKHRyaWVzW2ldKSkge1xuXHRcdFx0Ly9jb25zb2xlLmxvZyhcImtkYiBwYXRoOiBcIitub2RlUmVxdWlyZSgncGF0aCcpLnJlc29sdmUodHJpZXNbaV0pKTtcblx0XHRcdHZhciBrZGI9bmV3IEtkYi5vcGVuKHRyaWVzW2ldLGZ1bmN0aW9uKGVycixrZGIpe1xuXHRcdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dCxbZXJyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y3JlYXRlTG9jYWxFbmdpbmUoa2RiLG9wdHMsZnVuY3Rpb24oZW5naW5lKXtcblx0XHRcdFx0XHRcdGxvY2FsUG9vbFtrZGJpZF09ZW5naW5lO1xuXHRcdFx0XHRcdFx0Y2IuYXBwbHkoY29udGV4dHx8ZW5naW5lLmNvbnRleHQsWzAsZW5naW5lXSk7XG5cdFx0XHRcdFx0fSxjb250ZXh0KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cdH1cblx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtrZGJpZCtcIiBub3QgZm91bmRcIl0pO1xuXHRyZXR1cm4gbnVsbDtcblxufVxudmFyIG9wZW5Mb2NhbE5vZGU9ZnVuY3Rpb24oa2RiaWQsb3B0cyxjYixjb250ZXh0KSB7XG5cdHZhciBmcz1yZXF1aXJlKCdmcycpO1xuXHR2YXIgdHJpZXM9Z2V0TG9jYWxUcmllcyhrZGJpZCk7XG5cblx0Zm9yICh2YXIgaT0wO2k8dHJpZXMubGVuZ3RoO2krKykge1xuXHRcdGlmIChmcy5leGlzdHNTeW5jKHRyaWVzW2ldKSkge1xuXG5cdFx0XHRuZXcgS2RiLm9wZW4odHJpZXNbaV0sZnVuY3Rpb24oZXJyLGtkYil7XG5cdFx0XHRcdGlmIChlcnIpIHtcblx0XHRcdFx0XHRjYi5hcHBseShjb250ZXh0fHxlbmdpbmUuY29udGVudCxbZXJyXSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y3JlYXRlTG9jYWxFbmdpbmUoa2RiLG9wdHMsZnVuY3Rpb24oZW5naW5lKXtcblx0XHRcdFx0XHRcdFx0bG9jYWxQb29sW2tkYmlkXT1lbmdpbmU7XG5cdFx0XHRcdFx0XHRcdGNiLmFwcGx5KGNvbnRleHR8fGVuZ2luZS5jb250ZXh0LFswLGVuZ2luZV0pO1xuXHRcdFx0XHRcdH0sY29udGV4dCk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXHR9XG5cdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxba2RiaWQrXCIgbm90IGZvdW5kXCJdKTtcblx0cmV0dXJuIG51bGw7XG59XG5cbnZhciBvcGVuTG9jYWxIdG1sNT1mdW5jdGlvbihrZGJpZCxvcHRzLGNiLGNvbnRleHQpIHtcdFxuXHR2YXIgZW5naW5lPWxvY2FsUG9vbFtrZGJpZF07XG5cdHZhciBrZGJmbj1rZGJpZDtcblx0aWYgKGtkYmZuLmluZGV4T2YoXCIua2RiXCIpPT0tMSkga2RiZm4rPVwiLmtkYlwiO1xuXHRuZXcgS2RiLm9wZW4oa2RiZm4sZnVuY3Rpb24oZXJyLGhhbmRsZSl7XG5cdFx0aWYgKGVycikge1xuXHRcdFx0Y2IuYXBwbHkoY29udGV4dCxbZXJyXSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGNyZWF0ZUxvY2FsRW5naW5lKGhhbmRsZSxvcHRzLGZ1bmN0aW9uKGVuZ2luZSl7XG5cdFx0XHRcdGxvY2FsUG9vbFtrZGJpZF09ZW5naW5lO1xuXHRcdFx0XHRjYi5hcHBseShjb250ZXh0fHxlbmdpbmUuY29udGV4dCxbMCxlbmdpbmVdKTtcblx0XHRcdH0sY29udGV4dCk7XG5cdFx0fVxuXHR9KTtcbn1cbi8vb21pdCBjYiBmb3Igc3luY3Jvbml6ZSBvcGVuXG52YXIgb3BlbkxvY2FsPWZ1bmN0aW9uKGtkYmlkLG9wdHMsY2IsY29udGV4dCkgIHtcblx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHsgLy9ubyBvcHRzXG5cdFx0aWYgKHR5cGVvZiBjYj09XCJvYmplY3RcIikgY29udGV4dD1jYjtcblx0XHRjYj1vcHRzO1xuXHRcdG9wdHM9e307XG5cdH1cblxuXHR2YXIgZW5naW5lPWxvY2FsUG9vbFtrZGJpZF07XG5cdGlmIChlbmdpbmUpIHtcblx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHR8fGVuZ2luZS5jb250ZXh0LFswLGVuZ2luZV0pO1xuXHRcdHJldHVybiBlbmdpbmU7XG5cdH1cblxuXHR2YXIgcGxhdGZvcm09cmVxdWlyZShcIi4vcGxhdGZvcm1cIikuZ2V0UGxhdGZvcm0oKTtcblx0aWYgKHBsYXRmb3JtPT1cIm5vZGUtd2Via2l0XCIgfHwgcGxhdGZvcm09PVwibm9kZVwiKSB7XG5cdFx0b3BlbkxvY2FsTm9kZShrZGJpZCxvcHRzLGNiLGNvbnRleHQpO1xuXHR9IGVsc2UgaWYgKHBsYXRmb3JtPT1cImh0bWw1XCIgfHwgcGxhdGZvcm09PVwiY2hyb21lXCIpe1xuXHRcdG9wZW5Mb2NhbEh0bWw1KGtkYmlkLG9wdHMsY2IsY29udGV4dCk7XHRcdFxuXHR9IGVsc2Uge1xuXHRcdG9wZW5Mb2NhbEtzYW5hZ2FwKGtkYmlkLG9wdHMsY2IsY29udGV4dCk7XHRcblx0fVxufVxudmFyIHNldFBhdGg9ZnVuY3Rpb24ocGF0aCkge1xuXHRhcHBwYXRoPXBhdGg7XG5cdGNvbnNvbGUubG9nKFwic2V0IHBhdGhcIixwYXRoKVxufVxuXG52YXIgZW51bUtkYj1mdW5jdGlvbihjYixjb250ZXh0KXtcblx0cmV0dXJuIGtkYnMubWFwKGZ1bmN0aW9uKGspe3JldHVybiBrWzBdfSk7XG59XG5cbm1vZHVsZS5leHBvcnRzPXtvcGVuOm9wZW5Mb2NhbCxzZXRQYXRoOnNldFBhdGgsIGNsb3NlOmNsb3NlTG9jYWwsIGVudW1LZGI6ZW51bUtkYn07IiwiLyogcmV0dXJuIGFycmF5IG9mIGRiaWQgYW5kIGFic29sdXRlIHBhdGgqL1xudmFyIGxpc3RrZGJfaHRtbDU9ZnVuY3Rpb24oKSB7XG5cdHRocm93IFwibm90IGltcGxlbWVudCB5ZXRcIjtcblx0cmVxdWlyZShcImtzYW5hLWpzb25yb21cIikuaHRtbDVmcy5yZWFkZGlyKGZ1bmN0aW9uKGtkYnMpe1xuXHRcdFx0Y2IuYXBwbHkodGhpcyxba2Ric10pO1xuXHR9LGNvbnRleHR8fHRoaXMpO1x0XHRcblxufVxuXG52YXIgbGlzdGtkYl9ub2RlPWZ1bmN0aW9uKCl7XG5cdHZhciBmcz1yZXF1aXJlKFwiZnNcIik7XG5cdHZhciBwYXRoPXJlcXVpcmUoXCJwYXRoXCIpXG5cdHZhciBwYXJlbnQ9cGF0aC5yZXNvbHZlKHByb2Nlc3MuY3dkKCksXCIuLlwiKTtcblx0dmFyIGZpbGVzPWZzLnJlYWRkaXJTeW5jKHBhcmVudCk7XG5cdHZhciBvdXRwdXQ9W107XG5cdGZpbGVzLm1hcChmdW5jdGlvbihmKXtcblx0XHR2YXIgc3ViZGlyPXBhcmVudCtwYXRoLnNlcCtmO1xuXHRcdHZhciBzdGF0PWZzLnN0YXRTeW5jKHN1YmRpciApO1xuXHRcdGlmIChzdGF0LmlzRGlyZWN0b3J5KCkpIHtcblx0XHRcdHZhciBzdWJmaWxlcz1mcy5yZWFkZGlyU3luYyhzdWJkaXIpO1xuXHRcdFx0Zm9yICh2YXIgaT0wO2k8c3ViZmlsZXMubGVuZ3RoO2krKykge1xuXHRcdFx0XHR2YXIgZmlsZT1zdWJmaWxlc1tpXTtcblx0XHRcdFx0dmFyIGlkeD1maWxlLmluZGV4T2YoXCIua2RiXCIpO1xuXHRcdFx0XHRpZiAoaWR4Pi0xJiZpZHg9PWZpbGUubGVuZ3RoLTQpIHtcblx0XHRcdFx0XHRvdXRwdXQucHVzaChbIGZpbGUuc3Vic3RyKDAsZmlsZS5sZW5ndGgtNCksIHN1YmRpcitwYXRoLnNlcCtmaWxlXSk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9XG5cdH0pXG5cdHJldHVybiBvdXRwdXQ7XG59XG5cbnZhciBsaXN0a2RiPWZ1bmN0aW9uKCkge1xuXHR2YXIgcGxhdGZvcm09cmVxdWlyZShcIi4vcGxhdGZvcm1cIikuZ2V0UGxhdGZvcm0oKTtcblx0dmFyIGZpbGVzPVtdO1xuXHRpZiAocGxhdGZvcm09PVwibm9kZVwiIHx8IHBsYXRmb3JtPT1cIm5vZGUtd2Via2l0XCIpIHtcblx0XHRmaWxlcz1saXN0a2RiX25vZGUoKTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCI7XG5cdH1cblx0cmV0dXJuIGZpbGVzO1xufVxubW9kdWxlLmV4cG9ydHM9bGlzdGtkYjsiLCJ2YXIgZ2V0UGxhdGZvcm09ZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2Yga3NhbmFnYXA9PVwidW5kZWZpbmVkXCIpIHtcblx0XHRwbGF0Zm9ybT1cIm5vZGVcIjtcblx0fSBlbHNlIHtcblx0XHRwbGF0Zm9ybT1rc2FuYWdhcC5wbGF0Zm9ybTtcblx0fVxuXHRyZXR1cm4gcGxhdGZvcm07XG59XG5tb2R1bGUuZXhwb3J0cz17Z2V0UGxhdGZvcm06Z2V0UGxhdGZvcm19OyIsIlxuLyogZW11bGF0ZSBmaWxlc3lzdGVtIG9uIGh0bWw1IGJyb3dzZXIgKi9cbi8qIGVtdWxhdGUgZmlsZXN5c3RlbSBvbiBodG1sNSBicm93c2VyICovXG52YXIgcmVhZD1mdW5jdGlvbihoYW5kbGUsYnVmZmVyLG9mZnNldCxsZW5ndGgscG9zaXRpb24sY2IpIHsvL2J1ZmZlciBhbmQgb2Zmc2V0IGlzIG5vdCB1c2VkXG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0eGhyLm9wZW4oJ0dFVCcsIGhhbmRsZS51cmwgLCB0cnVlKTtcblx0dmFyIHJhbmdlPVtwb3NpdGlvbixsZW5ndGgrcG9zaXRpb24tMV07XG5cdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdSYW5nZScsICdieXRlcz0nK3JhbmdlWzBdKyctJytyYW5nZVsxXSk7XG5cdHhoci5yZXNwb25zZVR5cGUgPSAnYXJyYXlidWZmZXInO1xuXHR4aHIuc2VuZCgpO1xuXHR4aHIub25sb2FkID0gZnVuY3Rpb24oZSkge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0Y2IoMCx0aGF0LnJlc3BvbnNlLmJ5dGVMZW5ndGgsdGhhdC5yZXNwb25zZSk7XG5cdFx0fSwwKTtcblx0fTsgXG59XG52YXIgY2xvc2U9ZnVuY3Rpb24oaGFuZGxlKSB7fVxudmFyIGZzdGF0U3luYz1mdW5jdGlvbihoYW5kbGUpIHtcblx0dGhyb3cgXCJub3QgaW1wbGVtZW50IHlldFwiO1xufVxudmFyIGZzdGF0PWZ1bmN0aW9uKGhhbmRsZSxjYikge1xuXHR0aHJvdyBcIm5vdCBpbXBsZW1lbnQgeWV0XCI7XG59XG52YXIgX29wZW49ZnVuY3Rpb24oZm5fdXJsLGNiKSB7XG5cdFx0dmFyIGhhbmRsZT17fTtcblx0XHRpZiAoZm5fdXJsLmluZGV4T2YoXCJmaWxlc3lzdGVtOlwiKT09MCl7XG5cdFx0XHRoYW5kbGUudXJsPWZuX3VybDtcblx0XHRcdGhhbmRsZS5mbj1mbl91cmwuc3Vic3RyKCBmbl91cmwubGFzdEluZGV4T2YoXCIvXCIpKzEpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRoYW5kbGUuZm49Zm5fdXJsO1xuXHRcdFx0dmFyIHVybD1BUEkuZmlsZXMuZmlsdGVyKGZ1bmN0aW9uKGYpeyByZXR1cm4gKGZbMF09PWZuX3VybCl9KTtcblx0XHRcdGlmICh1cmwubGVuZ3RoKSBoYW5kbGUudXJsPXVybFswXVsxXTtcblx0XHRcdGVsc2UgY2IobnVsbCk7XG5cdFx0fVxuXHRcdGNiKGhhbmRsZSk7XG59XG52YXIgb3Blbj1mdW5jdGlvbihmbl91cmwsY2IpIHtcblx0XHRpZiAoIUFQSS5pbml0aWFsaXplZCkge2luaXQoMTAyNCoxMDI0LGZ1bmN0aW9uKCl7XG5cdFx0XHRfb3Blbi5hcHBseSh0aGlzLFtmbl91cmwsY2JdKTtcblx0XHR9LHRoaXMpfSBlbHNlIF9vcGVuLmFwcGx5KHRoaXMsW2ZuX3VybCxjYl0pO1xufVxudmFyIGxvYWQ9ZnVuY3Rpb24oZmlsZW5hbWUsbW9kZSxjYikge1xuXHRvcGVuKGZpbGVuYW1lLG1vZGUsY2IsdHJ1ZSk7XG59XG5mdW5jdGlvbiBlcnJvckhhbmRsZXIoZSkge1xuXHRjb25zb2xlLmVycm9yKCdFcnJvcjogJyArZS5uYW1lKyBcIiBcIitlLm1lc3NhZ2UpO1xufVxudmFyIHJlYWRkaXI9ZnVuY3Rpb24oY2IsY29udGV4dCkge1xuXHQgdmFyIGRpclJlYWRlciA9IEFQSS5mcy5yb290LmNyZWF0ZVJlYWRlcigpO1xuXHQgdmFyIG91dD1bXSx0aGF0PXRoaXM7XG5cdFx0ZGlyUmVhZGVyLnJlYWRFbnRyaWVzKGZ1bmN0aW9uKGVudHJpZXMpIHtcblx0XHRcdGlmIChlbnRyaWVzLmxlbmd0aCkge1xuXHRcdFx0XHRmb3IgKHZhciBpID0gMCwgZW50cnk7IGVudHJ5ID0gZW50cmllc1tpXTsgKytpKSB7XG5cdFx0XHRcdFx0aWYgKGVudHJ5LmlzRmlsZSkge1xuXHRcdFx0XHRcdFx0b3V0LnB1c2goW2VudHJ5Lm5hbWUsZW50cnkudG9VUkwgPyBlbnRyeS50b1VSTCgpIDogZW50cnkudG9VUkkoKV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0QVBJLmZpbGVzPW91dDtcblx0XHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbb3V0XSk7XG5cdFx0fSwgZnVuY3Rpb24oKXtcblx0XHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbbnVsbF0pO1xuXHRcdH0pO1xufVxudmFyIGluaXRmcz1mdW5jdGlvbihncmFudGVkQnl0ZXMsY2IsY29udGV4dCkge1xuXHR3ZWJraXRSZXF1ZXN0RmlsZVN5c3RlbShQRVJTSVNURU5ULCBncmFudGVkQnl0ZXMsICBmdW5jdGlvbihmcykge1xuXHRcdEFQSS5mcz1mcztcblx0XHRBUEkucXVvdGE9Z3JhbnRlZEJ5dGVzO1xuXHRcdHJlYWRkaXIoZnVuY3Rpb24oKXtcblx0XHRcdEFQSS5pbml0aWFsaXplZD10cnVlO1xuXHRcdFx0Y2IuYXBwbHkoY29udGV4dCxbZ3JhbnRlZEJ5dGVzLGZzXSk7XG5cdFx0fSxjb250ZXh0KTtcblx0fSwgZXJyb3JIYW5kbGVyKTtcbn1cbnZhciBpbml0PWZ1bmN0aW9uKHF1b3RhLGNiLGNvbnRleHQpIHtcblx0bmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlLnJlcXVlc3RRdW90YShxdW90YSwgXG5cdFx0XHRmdW5jdGlvbihncmFudGVkQnl0ZXMpIHtcblx0XHRcdFx0aW5pdGZzKGdyYW50ZWRCeXRlcyxjYixjb250ZXh0KTtcblx0XHR9LCBlcnJvckhhbmRsZXIgXG5cdCk7XG59XG52YXIgQVBJPXtcblx0cmVhZDpyZWFkXG5cdCxyZWFkZGlyOnJlYWRkaXJcblx0LG9wZW46b3BlblxuXHQsY2xvc2U6Y2xvc2Vcblx0LGZzdGF0U3luYzpmc3RhdFN5bmNcblx0LGZzdGF0OmZzdGF0XG59XG5tb2R1bGUuZXhwb3J0cz1BUEk7IiwibW9kdWxlLmV4cG9ydHM9e1xuXHRvcGVuOnJlcXVpcmUoXCIuL2tkYlwiKVxuXHQsY3JlYXRlOnJlcXVpcmUoXCIuL2tkYndcIilcbn1cbiIsIi8qXG5cdEtEQiB2ZXJzaW9uIDMuMCBHUExcblx0eWFwY2hlYWhzaGVuQGdtYWlsLmNvbVxuXHQyMDEzLzEyLzI4XG5cdGFzeW5jcm9uaXplIHZlcnNpb24gb2YgeWFkYlxuXG4gIHJlbW92ZSBkZXBlbmRlbmN5IG9mIFEsIHRoYW5rcyB0b1xuICBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzQyMzQ2MTkvaG93LXRvLWF2b2lkLWxvbmctbmVzdGluZy1vZi1hc3luY2hyb25vdXMtZnVuY3Rpb25zLWluLW5vZGUtanNcblxuICAyMDE1LzEvMlxuICBtb3ZlZCB0byBrc2FuYWZvcmdlL2tzYW5hLWpzb25yb21cbiAgYWRkIGVyciBpbiBjYWxsYmFjayBmb3Igbm9kZS5qcyBjb21wbGlhbnRcbiovXG52YXIgS2ZzPW51bGw7XG5cbmlmICh0eXBlb2Yga3NhbmFnYXA9PVwidW5kZWZpbmVkXCIpIHtcblx0S2ZzPXJlcXVpcmUoJy4va2RiZnMnKTtcdFx0XHRcbn0gZWxzZSB7XG5cdGlmIChrc2FuYWdhcC5wbGF0Zm9ybT09XCJpb3NcIikge1xuXHRcdEtmcz1yZXF1aXJlKFwiLi9rZGJmc19pb3NcIik7XG5cdH0gZWxzZSBpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwibm9kZS13ZWJraXRcIikge1xuXHRcdEtmcz1yZXF1aXJlKFwiLi9rZGJmc1wiKTtcblx0fSBlbHNlIGlmIChrc2FuYWdhcC5wbGF0Zm9ybT09XCJjaHJvbWVcIikge1xuXHRcdEtmcz1yZXF1aXJlKFwiLi9rZGJmc1wiKTtcblx0fSBlbHNlIHtcblx0XHRLZnM9cmVxdWlyZShcIi4va2RiZnNfYW5kcm9pZFwiKTtcblx0fVxuXHRcdFxufVxuXG5cbnZhciBEVD17XG5cdHVpbnQ4OicxJywgLy91bnNpZ25lZCAxIGJ5dGUgaW50ZWdlclxuXHRpbnQzMjonNCcsIC8vIHNpZ25lZCA0IGJ5dGVzIGludGVnZXJcblx0dXRmODonOCcsICBcblx0dWNzMjonMicsXG5cdGJvb2w6J14nLCBcblx0YmxvYjonJicsXG5cdHV0ZjhhcnI6JyonLCAvL3NoaWZ0IG9mIDhcblx0dWNzMmFycjonQCcsIC8vc2hpZnQgb2YgMlxuXHR1aW50OGFycjonIScsIC8vc2hpZnQgb2YgMVxuXHRpbnQzMmFycjonJCcsIC8vc2hpZnQgb2YgNFxuXHR2aW50OidgJyxcblx0cGludDonficsXHRcblxuXHRhcnJheTonXFx1MDAxYicsXG5cdG9iamVjdDonXFx1MDAxYScgXG5cdC8veWRiIHN0YXJ0IHdpdGggb2JqZWN0IHNpZ25hdHVyZSxcblx0Ly90eXBlIGEgeWRiIGluIGNvbW1hbmQgcHJvbXB0IHNob3dzIG5vdGhpbmdcbn1cbnZhciB2ZXJib3NlPTAsIHJlYWRMb2c9ZnVuY3Rpb24oKXt9O1xudmFyIF9yZWFkTG9nPWZ1bmN0aW9uKHJlYWR0eXBlLGJ5dGVzKSB7XG5cdGNvbnNvbGUubG9nKHJlYWR0eXBlLGJ5dGVzLFwiYnl0ZXNcIik7XG59XG5pZiAodmVyYm9zZSkgcmVhZExvZz1fcmVhZExvZztcbnZhciBzdHJzZXA9XCJcXHVmZmZmXCI7XG52YXIgQ3JlYXRlPWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xuXHQvKiBsb2FkeHh4IGZ1bmN0aW9ucyBtb3ZlIGZpbGUgcG9pbnRlciAqL1xuXHQvLyBsb2FkIHZhcmlhYmxlIGxlbmd0aCBpbnRcblx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHtcblx0XHRjYj1vcHRzO1xuXHRcdG9wdHM9e307XG5cdH1cblxuXHRcblx0dmFyIGxvYWRWSW50ID1mdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxjb3VudCxjYikge1xuXHRcdC8vaWYgKGNvdW50PT0wKSByZXR1cm4gW107XG5cdFx0dmFyIHRoYXQ9dGhpcztcblxuXHRcdHRoaXMuZnMucmVhZEJ1Zl9wYWNrZWRpbnQob3B0cy5jdXIsYmxvY2tzaXplLGNvdW50LHRydWUsZnVuY3Rpb24obyl7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwidmludFwiKTtcblx0XHRcdG9wdHMuY3VyKz1vLmFkdjtcblx0XHRcdGNiLmFwcGx5KHRoYXQsW28uZGF0YV0pO1xuXHRcdH0pO1xuXHR9XG5cdHZhciBsb2FkVkludDE9ZnVuY3Rpb24ob3B0cyxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0bG9hZFZJbnQuYXBwbHkodGhpcyxbb3B0cyw2LDEsZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwidmludDFcIik7XG5cdFx0XHRjYi5hcHBseSh0aGF0LFtkYXRhWzBdXSk7XG5cdFx0fV0pXG5cdH1cblx0Ly9mb3IgcG9zdGluZ3Ncblx0dmFyIGxvYWRQSW50ID1mdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxjb3VudCxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dGhpcy5mcy5yZWFkQnVmX3BhY2tlZGludChvcHRzLmN1cixibG9ja3NpemUsY291bnQsZmFsc2UsZnVuY3Rpb24obyl7XG5cdFx0XHQvL2NvbnNvbGUubG9nKFwicGludFwiKTtcblx0XHRcdG9wdHMuY3VyKz1vLmFkdjtcblx0XHRcdGNiLmFwcGx5KHRoYXQsW28uZGF0YV0pO1xuXHRcdH0pO1xuXHR9XG5cdC8vIGl0ZW0gY2FuIGJlIGFueSB0eXBlICh2YXJpYWJsZSBsZW5ndGgpXG5cdC8vIG1heGltdW0gc2l6ZSBvZiBhcnJheSBpcyAxVEIgMl40MFxuXHQvLyBzdHJ1Y3R1cmU6XG5cdC8vIHNpZ25hdHVyZSw1IGJ5dGVzIG9mZnNldCwgcGF5bG9hZCwgaXRlbWxlbmd0aHNcblx0dmFyIGdldEFycmF5TGVuZ3RoPWZ1bmN0aW9uKG9wdHMsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHZhciBkYXRhb2Zmc2V0PTA7XG5cblx0XHR0aGlzLmZzLnJlYWRVSTgob3B0cy5jdXIsZnVuY3Rpb24obGVuKXtcblx0XHRcdHZhciBsZW5ndGhvZmZzZXQ9bGVuKjQyOTQ5NjcyOTY7XG5cdFx0XHRvcHRzLmN1cisrO1xuXHRcdFx0dGhhdC5mcy5yZWFkVUkzMihvcHRzLmN1cixmdW5jdGlvbihsZW4pe1xuXHRcdFx0XHRvcHRzLmN1cis9NDtcblx0XHRcdFx0ZGF0YW9mZnNldD1vcHRzLmN1cjsgLy9rZWVwIHRoaXNcblx0XHRcdFx0bGVuZ3Rob2Zmc2V0Kz1sZW47XG5cdFx0XHRcdG9wdHMuY3VyKz1sZW5ndGhvZmZzZXQ7XG5cblx0XHRcdFx0bG9hZFZJbnQxLmFwcGx5KHRoYXQsW29wdHMsZnVuY3Rpb24oY291bnQpe1xuXHRcdFx0XHRcdGxvYWRWSW50LmFwcGx5KHRoYXQsW29wdHMsY291bnQqNixjb3VudCxmdW5jdGlvbihzeil7XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRjYih7Y291bnQ6Y291bnQsc3o6c3osb2Zmc2V0OmRhdGFvZmZzZXR9KTtcblx0XHRcdFx0XHR9XSk7XG5cdFx0XHRcdH1dKTtcblx0XHRcdFx0XG5cdFx0XHR9KTtcblx0XHR9KTtcblx0fVxuXG5cdHZhciBsb2FkQXJyYXkgPSBmdW5jdGlvbihvcHRzLGJsb2Nrc2l6ZSxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0Z2V0QXJyYXlMZW5ndGguYXBwbHkodGhpcyxbb3B0cyxmdW5jdGlvbihMKXtcblx0XHRcdFx0dmFyIG89W107XG5cdFx0XHRcdHZhciBlbmRjdXI9b3B0cy5jdXI7XG5cdFx0XHRcdG9wdHMuY3VyPUwub2Zmc2V0O1xuXG5cdFx0XHRcdGlmIChvcHRzLmxhenkpIHsgXG5cdFx0XHRcdFx0XHR2YXIgb2Zmc2V0PUwub2Zmc2V0O1xuXHRcdFx0XHRcdFx0TC5zei5tYXAoZnVuY3Rpb24oc3ope1xuXHRcdFx0XHRcdFx0XHRvW28ubGVuZ3RoXT1zdHJzZXArb2Zmc2V0LnRvU3RyaW5nKDE2KVxuXHRcdFx0XHRcdFx0XHRcdCAgICtzdHJzZXArc3oudG9TdHJpbmcoMTYpO1xuXHRcdFx0XHRcdFx0XHRvZmZzZXQrPXN6O1xuXHRcdFx0XHRcdFx0fSlcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgdGFza3F1ZXVlPVtdO1xuXHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPEwuY291bnQ7aSsrKSB7XG5cdFx0XHRcdFx0XHR0YXNrcXVldWUucHVzaChcblx0XHRcdFx0XHRcdFx0KGZ1bmN0aW9uKHN6KXtcblx0XHRcdFx0XHRcdFx0XHRyZXR1cm4gKFxuXHRcdFx0XHRcdFx0XHRcdFx0ZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSB7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdFx0IC8vbm90IHB1c2hpbmcgdGhlIGZpcnN0IGNhbGxcblx0XHRcdFx0XHRcdFx0XHRcdFx0fVx0ZWxzZSBvLnB1c2goZGF0YSk7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdG9wdHMuYmxvY2tzaXplPXN6O1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRsb2FkLmFwcGx5KHRoYXQsW29wdHMsIHRhc2txdWV1ZS5zaGlmdCgpXSk7XG5cdFx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdFx0KTtcblx0XHRcdFx0XHRcdFx0fSkoTC5zeltpXSlcblx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdC8vbGFzdCBjYWxsIHRvIGNoaWxkIGxvYWRcblx0XHRcdFx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdG8ucHVzaChkYXRhKTtcblx0XHRcdFx0XHRcdG9wdHMuY3VyPWVuZGN1cjtcblx0XHRcdFx0XHRcdGNiLmFwcGx5KHRoYXQsW29dKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmIChvcHRzLmxhenkpIGNiLmFwcGx5KHRoYXQsW29dKTtcblx0XHRcdFx0ZWxzZSB7XG5cdFx0XHRcdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XSlcblx0fVx0XHRcblx0Ly8gaXRlbSBjYW4gYmUgYW55IHR5cGUgKHZhcmlhYmxlIGxlbmd0aClcblx0Ly8gc3VwcG9ydCBsYXp5IGxvYWRcblx0Ly8gc3RydWN0dXJlOlxuXHQvLyBzaWduYXR1cmUsNSBieXRlcyBvZmZzZXQsIHBheWxvYWQsIGl0ZW1sZW5ndGhzLCBcblx0Ly8gICAgICAgICAgICAgICAgICAgIHN0cmluZ2FycmF5X3NpZ25hdHVyZSwga2V5c1xuXHR2YXIgbG9hZE9iamVjdCA9IGZ1bmN0aW9uKG9wdHMsYmxvY2tzaXplLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR2YXIgc3RhcnQ9b3B0cy5jdXI7XG5cdFx0Z2V0QXJyYXlMZW5ndGguYXBwbHkodGhpcyxbb3B0cyxmdW5jdGlvbihMKSB7XG5cdFx0XHRvcHRzLmJsb2Nrc2l6ZT1ibG9ja3NpemUtb3B0cy5jdXIrc3RhcnQ7XG5cdFx0XHRsb2FkLmFwcGx5KHRoYXQsW29wdHMsZnVuY3Rpb24oa2V5cyl7IC8vbG9hZCB0aGUga2V5c1xuXHRcdFx0XHRpZiAob3B0cy5rZXlzKSB7IC8vY2FsbGVyIGFzayBmb3Iga2V5c1xuXHRcdFx0XHRcdGtleXMubWFwKGZ1bmN0aW9uKGspIHsgb3B0cy5rZXlzLnB1c2goayl9KTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHZhciBvPXt9O1xuXHRcdFx0XHR2YXIgZW5kY3VyPW9wdHMuY3VyO1xuXHRcdFx0XHRvcHRzLmN1cj1MLm9mZnNldDtcblx0XHRcdFx0aWYgKG9wdHMubGF6eSkgeyBcblx0XHRcdFx0XHR2YXIgb2Zmc2V0PUwub2Zmc2V0O1xuXHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPEwuc3oubGVuZ3RoO2krKykge1xuXHRcdFx0XHRcdFx0Ly9wcmVmaXggd2l0aCBhIFxcMCwgaW1wb3NzaWJsZSBmb3Igbm9ybWFsIHN0cmluZ1xuXHRcdFx0XHRcdFx0b1trZXlzW2ldXT1zdHJzZXArb2Zmc2V0LnRvU3RyaW5nKDE2KVxuXHRcdFx0XHRcdFx0XHQgICArc3Ryc2VwK0wuc3pbaV0udG9TdHJpbmcoMTYpO1xuXHRcdFx0XHRcdFx0b2Zmc2V0Kz1MLnN6W2ldO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHR2YXIgdGFza3F1ZXVlPVtdO1xuXHRcdFx0XHRcdGZvciAodmFyIGk9MDtpPEwuY291bnQ7aSsrKSB7XG5cdFx0XHRcdFx0XHR0YXNrcXVldWUucHVzaChcblx0XHRcdFx0XHRcdFx0KGZ1bmN0aW9uKHN6LGtleSl7XG5cdFx0XHRcdFx0XHRcdFx0cmV0dXJuIChcblx0XHRcdFx0XHRcdFx0XHRcdGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIGRhdGE9PSdvYmplY3QnICYmIGRhdGEuX19lbXB0eSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vbm90IHNhdmluZyB0aGUgZmlyc3QgY2FsbDtcblx0XHRcdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdFx0XHRvW2tleV09ZGF0YTsgXG5cdFx0XHRcdFx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcdFx0XHRcdFx0b3B0cy5ibG9ja3NpemU9c3o7XG5cdFx0XHRcdFx0XHRcdFx0XHRcdGlmICh2ZXJib3NlKSByZWFkTG9nKFwia2V5XCIsa2V5KTtcblx0XHRcdFx0XHRcdFx0XHRcdFx0bG9hZC5hcHBseSh0aGF0LFtvcHRzLCB0YXNrcXVldWUuc2hpZnQoKV0pO1xuXHRcdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHRcdCk7XG5cdFx0XHRcdFx0XHRcdH0pKEwuc3pbaV0sa2V5c1tpLTFdKVxuXG5cdFx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHQvL2xhc3QgY2FsbCB0byBjaGlsZCBsb2FkXG5cdFx0XHRcdFx0dGFza3F1ZXVlLnB1c2goZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRvW2tleXNba2V5cy5sZW5ndGgtMV1dPWRhdGE7XG5cdFx0XHRcdFx0XHRvcHRzLmN1cj1lbmRjdXI7XG5cdFx0XHRcdFx0XHRjYi5hcHBseSh0aGF0LFtvXSk7XG5cdFx0XHRcdFx0fSk7XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKG9wdHMubGF6eSkgY2IuYXBwbHkodGhhdCxbb10pO1xuXHRcdFx0XHRlbHNlIHtcblx0XHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7XG5cdFx0XHRcdH1cblx0XHRcdH1dKTtcblx0XHR9XSk7XG5cdH1cblxuXHQvL2l0ZW0gaXMgc2FtZSBrbm93biB0eXBlXG5cdHZhciBsb2FkU3RyaW5nQXJyYXk9ZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdHRoaXMuZnMucmVhZFN0cmluZ0FycmF5KG9wdHMuY3VyLGJsb2Nrc2l6ZSxlbmNvZGluZyxmdW5jdGlvbihvKXtcblx0XHRcdG9wdHMuY3VyKz1ibG9ja3NpemU7XG5cdFx0XHRjYi5hcHBseSh0aGF0LFtvXSk7XG5cdFx0fSk7XG5cdH1cblx0dmFyIGxvYWRJbnRlZ2VyQXJyYXk9ZnVuY3Rpb24ob3B0cyxibG9ja3NpemUsdW5pdHNpemUsY2IpIHtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGxvYWRWSW50MS5hcHBseSh0aGlzLFtvcHRzLGZ1bmN0aW9uKGNvdW50KXtcblx0XHRcdHZhciBvPXRoYXQuZnMucmVhZEZpeGVkQXJyYXkob3B0cy5jdXIsY291bnQsdW5pdHNpemUsZnVuY3Rpb24obyl7XG5cdFx0XHRcdG9wdHMuY3VyKz1jb3VudCp1bml0c2l6ZTtcblx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xuXHRcdFx0fSk7XG5cdFx0fV0pO1xuXHR9XG5cdHZhciBsb2FkQmxvYj1mdW5jdGlvbihibG9ja3NpemUsY2IpIHtcblx0XHR2YXIgbz10aGlzLmZzLnJlYWRCdWYodGhpcy5jdXIsYmxvY2tzaXplKTtcblx0XHR0aGlzLmN1cis9YmxvY2tzaXplO1xuXHRcdHJldHVybiBvO1xuXHR9XHRcblx0dmFyIGxvYWRieXNpZ25hdHVyZT1mdW5jdGlvbihvcHRzLHNpZ25hdHVyZSxjYikge1xuXHRcdCAgdmFyIGJsb2Nrc2l6ZT1vcHRzLmJsb2Nrc2l6ZXx8dGhpcy5mcy5zaXplOyBcblx0XHRcdG9wdHMuY3VyKz10aGlzLmZzLnNpZ25hdHVyZV9zaXplO1xuXHRcdFx0dmFyIGRhdGFzaXplPWJsb2Nrc2l6ZS10aGlzLmZzLnNpZ25hdHVyZV9zaXplO1xuXHRcdFx0Ly9iYXNpYyB0eXBlc1xuXHRcdFx0aWYgKHNpZ25hdHVyZT09PURULmludDMyKSB7XG5cdFx0XHRcdG9wdHMuY3VyKz00O1xuXHRcdFx0XHR0aGlzLmZzLnJlYWRJMzIob3B0cy5jdXItNCxjYik7XG5cdFx0XHR9IGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnVpbnQ4KSB7XG5cdFx0XHRcdG9wdHMuY3VyKys7XG5cdFx0XHRcdHRoaXMuZnMucmVhZFVJOChvcHRzLmN1ci0xLGNiKTtcblx0XHRcdH0gZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudXRmOCkge1xuXHRcdFx0XHR2YXIgYz1vcHRzLmN1cjtvcHRzLmN1cis9ZGF0YXNpemU7XG5cdFx0XHRcdHRoaXMuZnMucmVhZFN0cmluZyhjLGRhdGFzaXplLCd1dGY4JyxjYik7XG5cdFx0XHR9IGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnVjczIpIHtcblx0XHRcdFx0dmFyIGM9b3B0cy5jdXI7b3B0cy5jdXIrPWRhdGFzaXplO1xuXHRcdFx0XHR0aGlzLmZzLnJlYWRTdHJpbmcoYyxkYXRhc2l6ZSwndWNzMicsY2IpO1x0XG5cdFx0XHR9IGVsc2UgaWYgKHNpZ25hdHVyZT09PURULmJvb2wpIHtcblx0XHRcdFx0b3B0cy5jdXIrKztcblx0XHRcdFx0dGhpcy5mcy5yZWFkVUk4KG9wdHMuY3VyLTEsZnVuY3Rpb24oZGF0YSl7Y2IoISFkYXRhKX0pO1xuXHRcdFx0fSBlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5ibG9iKSB7XG5cdFx0XHRcdGxvYWRCbG9iKGRhdGFzaXplLGNiKTtcblx0XHRcdH1cblx0XHRcdC8vdmFyaWFibGUgbGVuZ3RoIGludGVnZXJzXG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC52aW50KSB7XG5cdFx0XHRcdGxvYWRWSW50LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsZGF0YXNpemUsY2JdKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnBpbnQpIHtcblx0XHRcdFx0bG9hZFBJbnQuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSxkYXRhc2l6ZSxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0Ly9zaW1wbGUgYXJyYXlcblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULnV0ZjhhcnIpIHtcblx0XHRcdFx0bG9hZFN0cmluZ0FycmF5LmFwcGx5KHRoaXMsW29wdHMsZGF0YXNpemUsJ3V0ZjgnLGNiXSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC51Y3MyYXJyKSB7XG5cdFx0XHRcdGxvYWRTdHJpbmdBcnJheS5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLCd1Y3MyJyxjYl0pO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSBpZiAoc2lnbmF0dXJlPT09RFQudWludDhhcnIpIHtcblx0XHRcdFx0bG9hZEludGVnZXJBcnJheS5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLDEsY2JdKTtcblx0XHRcdH1cblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULmludDMyYXJyKSB7XG5cdFx0XHRcdGxvYWRJbnRlZ2VyQXJyYXkuYXBwbHkodGhpcyxbb3B0cyxkYXRhc2l6ZSw0LGNiXSk7XG5cdFx0XHR9XG5cdFx0XHQvL25lc3RlZCBzdHJ1Y3R1cmVcblx0XHRcdGVsc2UgaWYgKHNpZ25hdHVyZT09PURULmFycmF5KSB7XG5cdFx0XHRcdGxvYWRBcnJheS5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLGNiXSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGlmIChzaWduYXR1cmU9PT1EVC5vYmplY3QpIHtcblx0XHRcdFx0bG9hZE9iamVjdC5hcHBseSh0aGlzLFtvcHRzLGRhdGFzaXplLGNiXSk7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcigndW5zdXBwb3J0ZWQgdHlwZScsc2lnbmF0dXJlLG9wdHMpXG5cdFx0XHRcdGNiLmFwcGx5KHRoaXMsW251bGxdKTsvL21ha2Ugc3VyZSBpdCByZXR1cm5cblx0XHRcdFx0Ly90aHJvdyAndW5zdXBwb3J0ZWQgdHlwZSAnK3NpZ25hdHVyZTtcblx0XHRcdH1cblx0fVxuXG5cdHZhciBsb2FkPWZ1bmN0aW9uKG9wdHMsY2IpIHtcblx0XHRvcHRzPW9wdHN8fHt9OyAvLyB0aGlzIHdpbGwgc2VydmVkIGFzIGNvbnRleHQgZm9yIGVudGlyZSBsb2FkIHByb2NlZHVyZVxuXHRcdG9wdHMuY3VyPW9wdHMuY3VyfHwwO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dGhpcy5mcy5yZWFkU2lnbmF0dXJlKG9wdHMuY3VyLCBmdW5jdGlvbihzaWduYXR1cmUpe1xuXHRcdFx0bG9hZGJ5c2lnbmF0dXJlLmFwcGx5KHRoYXQsW29wdHMsc2lnbmF0dXJlLGNiXSlcblx0XHR9KTtcblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXHR2YXIgQ0FDSEU9bnVsbDtcblx0dmFyIEtFWT17fTtcblx0dmFyIEFERFJFU1M9e307XG5cdHZhciByZXNldD1mdW5jdGlvbihjYikge1xuXHRcdGlmICghQ0FDSEUpIHtcblx0XHRcdGxvYWQuYXBwbHkodGhpcyxbe2N1cjowLGxhenk6dHJ1ZX0sZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdENBQ0hFPWRhdGE7XG5cdFx0XHRcdGNiLmNhbGwodGhpcyk7XG5cdFx0XHR9XSk7XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2IuY2FsbCh0aGlzKTtcblx0XHR9XG5cdH1cblxuXHR2YXIgZXhpc3RzPWZ1bmN0aW9uKHBhdGgsY2IpIHtcblx0XHRpZiAocGF0aC5sZW5ndGg9PTApIHJldHVybiB0cnVlO1xuXHRcdHZhciBrZXk9cGF0aC5wb3AoKTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGdldC5hcHBseSh0aGlzLFtwYXRoLGZhbHNlLGZ1bmN0aW9uKGRhdGEpe1xuXHRcdFx0aWYgKCFwYXRoLmpvaW4oc3Ryc2VwKSkgcmV0dXJuICghIUtFWVtrZXldKTtcblx0XHRcdHZhciBrZXlzPUtFWVtwYXRoLmpvaW4oc3Ryc2VwKV07XG5cdFx0XHRwYXRoLnB1c2goa2V5KTsvL3B1dCBpdCBiYWNrXG5cdFx0XHRpZiAoa2V5cykgY2IuYXBwbHkodGhhdCxba2V5cy5pbmRleE9mKGtleSk+LTFdKTtcblx0XHRcdGVsc2UgY2IuYXBwbHkodGhhdCxbZmFsc2VdKTtcblx0XHR9XSk7XG5cdH1cblxuXHR2YXIgZ2V0U3luYz1mdW5jdGlvbihwYXRoKSB7XG5cdFx0aWYgKCFDQUNIRSkgcmV0dXJuIHVuZGVmaW5lZDtcdFxuXHRcdHZhciBvPUNBQ0hFO1xuXHRcdGZvciAodmFyIGk9MDtpPHBhdGgubGVuZ3RoO2krKykge1xuXHRcdFx0dmFyIHI9b1twYXRoW2ldXTtcblx0XHRcdGlmICh0eXBlb2Ygcj09XCJ1bmRlZmluZWRcIikgcmV0dXJuIG51bGw7XG5cdFx0XHRvPXI7XG5cdFx0fVxuXHRcdHJldHVybiBvO1xuXHR9XG5cdHZhciBnZXQ9ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XG5cdFx0aWYgKHR5cGVvZiBwYXRoPT0ndW5kZWZpbmVkJykgcGF0aD1bXTtcblx0XHRpZiAodHlwZW9mIHBhdGg9PVwic3RyaW5nXCIpIHBhdGg9W3BhdGhdO1xuXHRcdC8vb3B0cy5yZWN1cnNpdmU9ISFvcHRzLnJlY3Vyc2l2ZTtcblx0XHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikge1xuXHRcdFx0Y2I9b3B0cztub2RlXG5cdFx0XHRvcHRzPXt9O1xuXHRcdH1cblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGlmICh0eXBlb2YgY2IhPSdmdW5jdGlvbicpIHJldHVybiBnZXRTeW5jKHBhdGgpO1xuXG5cdFx0cmVzZXQuYXBwbHkodGhpcyxbZnVuY3Rpb24oKXtcblx0XHRcdHZhciBvPUNBQ0hFO1xuXHRcdFx0aWYgKHBhdGgubGVuZ3RoPT0wKSB7XG5cdFx0XHRcdGlmIChvcHRzLmFkZHJlc3MpIHtcblx0XHRcdFx0XHRjYihbMCx0aGF0LmZzLnNpemVdKTtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRjYihPYmplY3Qua2V5cyhDQUNIRSkpO1x0XG5cdFx0XHRcdH1cblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0fSBcblx0XHRcdFxuXHRcdFx0dmFyIHBhdGhub3c9XCJcIix0YXNrcXVldWU9W10sbmV3b3B0cz17fSxyPW51bGw7XG5cdFx0XHR2YXIgbGFzdGtleT1cIlwiO1xuXG5cdFx0XHRmb3IgKHZhciBpPTA7aTxwYXRoLmxlbmd0aDtpKyspIHtcblx0XHRcdFx0dmFyIHRhc2s9KGZ1bmN0aW9uKGtleSxrKXtcblxuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRpZiAoISh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkge1xuXHRcdFx0XHRcdFx0XHRpZiAodHlwZW9mIG9bbGFzdGtleV09PSdzdHJpbmcnICYmIG9bbGFzdGtleV1bMF09PXN0cnNlcCkgb1tsYXN0a2V5XT17fTtcblx0XHRcdFx0XHRcdFx0b1tsYXN0a2V5XT1kYXRhOyBcblx0XHRcdFx0XHRcdFx0bz1vW2xhc3RrZXldO1xuXHRcdFx0XHRcdFx0XHRyPWRhdGFba2V5XTtcblx0XHRcdFx0XHRcdFx0S0VZW3BhdGhub3ddPW9wdHMua2V5cztcdFx0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0XHRkYXRhPW9ba2V5XTtcblx0XHRcdFx0XHRcdFx0cj1kYXRhO1xuXHRcdFx0XHRcdFx0fVxuXG5cdFx0XHRcdFx0XHRpZiAodHlwZW9mIHI9PT1cInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHRcdHRhc2txdWV1ZT1udWxsO1xuXHRcdFx0XHRcdFx0XHRjYi5hcHBseSh0aGF0LFtyXSk7IC8vcmV0dXJuIGVtcHR5IHZhbHVlXG5cdFx0XHRcdFx0XHR9IGVsc2Uge1x0XHRcdFx0XHRcdFx0XG5cdFx0XHRcdFx0XHRcdGlmIChwYXJzZUludChrKSkgcGF0aG5vdys9c3Ryc2VwO1xuXHRcdFx0XHRcdFx0XHRwYXRobm93Kz1rZXk7XG5cdFx0XHRcdFx0XHRcdGlmICh0eXBlb2Ygcj09J3N0cmluZycgJiYgclswXT09c3Ryc2VwKSB7IC8vb2Zmc2V0IG9mIGRhdGEgdG8gYmUgbG9hZGVkXG5cdFx0XHRcdFx0XHRcdFx0dmFyIHA9ci5zdWJzdHJpbmcoMSkuc3BsaXQoc3Ryc2VwKS5tYXAoZnVuY3Rpb24oaXRlbSl7cmV0dXJuIHBhcnNlSW50KGl0ZW0sMTYpfSk7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGN1cj1wWzBdLHN6PXBbMV07XG5cdFx0XHRcdFx0XHRcdFx0bmV3b3B0cy5sYXp5PSFvcHRzLnJlY3Vyc2l2ZSB8fCAoazxwYXRoLmxlbmd0aC0xKSA7XG5cdFx0XHRcdFx0XHRcdFx0bmV3b3B0cy5ibG9ja3NpemU9c3o7bmV3b3B0cy5jdXI9Y3VyLG5ld29wdHMua2V5cz1bXTtcblx0XHRcdFx0XHRcdFx0XHRsYXN0a2V5PWtleTsgLy9sb2FkIGlzIHN5bmMgaW4gYW5kcm9pZFxuXHRcdFx0XHRcdFx0XHRcdGlmIChvcHRzLmFkZHJlc3MgJiYgdGFza3F1ZXVlLmxlbmd0aD09MSkge1xuXHRcdFx0XHRcdFx0XHRcdFx0QUREUkVTU1twYXRobm93XT1bY3VyLHN6XTtcblx0XHRcdFx0XHRcdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpKG51bGwsQUREUkVTU1twYXRobm93XSk7XG5cdFx0XHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0XHRcdGxvYWQuYXBwbHkodGhhdCxbbmV3b3B0cywgdGFza3F1ZXVlLnNoaWZ0KCldKTtcblx0XHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0aWYgKG9wdHMuYWRkcmVzcyAmJiB0YXNrcXVldWUubGVuZ3RoPT0xKSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKShudWxsLEFERFJFU1NbcGF0aG5vd10pO1xuXHRcdFx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdFx0XHR0YXNrcXVldWUuc2hpZnQoKS5hcHBseSh0aGF0LFtyXSk7XG5cdFx0XHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fSlcblx0XHRcdFx0fSlcblx0XHRcdFx0KHBhdGhbaV0saSk7XG5cdFx0XHRcdFxuXHRcdFx0XHR0YXNrcXVldWUucHVzaCh0YXNrKTtcblx0XHRcdH1cblxuXHRcdFx0aWYgKHRhc2txdWV1ZS5sZW5ndGg9PTApIHtcblx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbb10pO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Ly9sYXN0IGNhbGwgdG8gY2hpbGQgbG9hZFxuXHRcdFx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhLGN1cnN6KXtcblx0XHRcdFx0XHRpZiAob3B0cy5hZGRyZXNzKSB7XG5cdFx0XHRcdFx0XHRjYi5hcHBseSh0aGF0LFtjdXJzel0pO1xuXHRcdFx0XHRcdH0gZWxzZXtcblx0XHRcdFx0XHRcdHZhciBrZXk9cGF0aFtwYXRoLmxlbmd0aC0xXTtcblx0XHRcdFx0XHRcdG9ba2V5XT1kYXRhOyBLRVlbcGF0aG5vd109b3B0cy5rZXlzO1xuXHRcdFx0XHRcdFx0Y2IuYXBwbHkodGhhdCxbZGF0YV0pO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHRcdHRhc2txdWV1ZS5zaGlmdCgpKHtfX2VtcHR5OnRydWV9KTtcdFx0XHRcblx0XHRcdH1cblxuXHRcdH1dKTsgLy9yZXNldFxuXHR9XG5cdC8vIGdldCBhbGwga2V5cyBpbiBnaXZlbiBwYXRoXG5cdHZhciBnZXRrZXlzPWZ1bmN0aW9uKHBhdGgsY2IpIHtcblx0XHRpZiAoIXBhdGgpIHBhdGg9W11cblx0XHR2YXIgdGhhdD10aGlzO1xuXHRcdGdldC5hcHBseSh0aGlzLFtwYXRoLGZhbHNlLGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAocGF0aCAmJiBwYXRoLmxlbmd0aCkge1xuXHRcdFx0XHRjYi5hcHBseSh0aGF0LFtLRVlbcGF0aC5qb2luKHN0cnNlcCldXSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRjYi5hcHBseSh0aGF0LFtPYmplY3Qua2V5cyhDQUNIRSldKTsgXG5cdFx0XHRcdC8vdG9wIGxldmVsLCBub3JtYWxseSBpdCBpcyB2ZXJ5IHNtYWxsXG5cdFx0XHR9XG5cdFx0fV0pO1xuXHR9XG5cblx0dmFyIHNldHVwYXBpPWZ1bmN0aW9uKCkge1xuXHRcdHRoaXMubG9hZD1sb2FkO1xuLy9cdFx0dGhpcy5jdXI9MDtcblx0XHR0aGlzLmNhY2hlPWZ1bmN0aW9uKCkge3JldHVybiBDQUNIRX07XG5cdFx0dGhpcy5rZXk9ZnVuY3Rpb24oKSB7cmV0dXJuIEtFWX07XG5cdFx0dGhpcy5mcmVlPWZ1bmN0aW9uKCkge1xuXHRcdFx0Q0FDSEU9bnVsbDtcblx0XHRcdEtFWT1udWxsO1xuXHRcdFx0dGhpcy5mcy5mcmVlKCk7XG5cdFx0fVxuXHRcdHRoaXMuc2V0Q2FjaGU9ZnVuY3Rpb24oYykge0NBQ0hFPWN9O1xuXHRcdHRoaXMua2V5cz1nZXRrZXlzO1xuXHRcdHRoaXMuZ2V0PWdldDsgICAvLyBnZXQgYSBmaWVsZCwgbG9hZCBpZiBuZWVkZWRcblx0XHR0aGlzLmV4aXN0cz1leGlzdHM7XG5cdFx0dGhpcy5EVD1EVDtcblx0XHRcblx0XHQvL2luc3RhbGwgdGhlIHN5bmMgdmVyc2lvbiBmb3Igbm9kZVxuXHRcdC8vaWYgKHR5cGVvZiBwcm9jZXNzIT1cInVuZGVmaW5lZFwiKSByZXF1aXJlKFwiLi9rZGJfc3luY1wiKSh0aGlzKTtcblx0XHQvL2lmIChjYikgc2V0VGltZW91dChjYi5iaW5kKHRoaXMpLDApO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dmFyIGVycj0wO1xuXHRcdGlmIChjYikge1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0XHRjYihlcnIsdGhhdCk7XHRcblx0XHRcdH0sMCk7XG5cdFx0fVxuXHR9XG5cdHZhciB0aGF0PXRoaXM7XG5cdHZhciBrZnM9bmV3IEtmcyhwYXRoLG9wdHMsZnVuY3Rpb24oZXJyKXtcblx0XHRpZiAoZXJyKSB7XG5cdFx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHRcdGNiKGVyciwwKTtcblx0XHRcdH0sMCk7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dGhhdC5zaXplPXRoaXMuc2l6ZTtcblx0XHRcdHNldHVwYXBpLmNhbGwodGhhdCk7XHRcdFx0XG5cdFx0fVxuXHR9KTtcblx0dGhpcy5mcz1rZnM7XG5cdHJldHVybiB0aGlzO1xufVxuXG5DcmVhdGUuZGF0YXR5cGVzPURUO1xuXG5pZiAobW9kdWxlKSBtb2R1bGUuZXhwb3J0cz1DcmVhdGU7XG4vL3JldHVybiBDcmVhdGU7XG4iLCIvKiBub2RlLmpzIGFuZCBodG1sNSBmaWxlIHN5c3RlbSBhYnN0cmFjdGlvbiBsYXllciovXG50cnkge1xuXHR2YXIgZnM9cmVxdWlyZShcImZzXCIpO1xuXHR2YXIgQnVmZmVyPXJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyO1xufSBjYXRjaCAoZSkge1xuXHR2YXIgZnM9cmVxdWlyZSgnLi9odG1sNXJlYWQnKTtcblx0dmFyIEJ1ZmZlcj1mdW5jdGlvbigpeyByZXR1cm4gXCJcIn07XG5cdHZhciBodG1sNWZzPXRydWU7IFx0XG59XG52YXIgc2lnbmF0dXJlX3NpemU9MTtcbnZhciB2ZXJib3NlPTAsIHJlYWRMb2c9ZnVuY3Rpb24oKXt9O1xudmFyIF9yZWFkTG9nPWZ1bmN0aW9uKHJlYWR0eXBlLGJ5dGVzKSB7XG5cdGNvbnNvbGUubG9nKHJlYWR0eXBlLGJ5dGVzLFwiYnl0ZXNcIik7XG59XG5pZiAodmVyYm9zZSkgcmVhZExvZz1fcmVhZExvZztcblxudmFyIHVucGFja19pbnQgPSBmdW5jdGlvbiAoYXIsIGNvdW50ICwgcmVzZXQpIHtcbiAgIGNvdW50PWNvdW50fHxhci5sZW5ndGg7XG4gIHZhciByID0gW10sIGkgPSAwLCB2ID0gMDtcbiAgZG8ge1xuXHR2YXIgc2hpZnQgPSAwO1xuXHRkbyB7XG5cdCAgdiArPSAoKGFyW2ldICYgMHg3RikgPDwgc2hpZnQpO1xuXHQgIHNoaWZ0ICs9IDc7XHQgIFxuXHR9IHdoaWxlIChhclsrK2ldICYgMHg4MCk7XG5cdHIucHVzaCh2KTsgaWYgKHJlc2V0KSB2PTA7XG5cdGNvdW50LS07XG4gIH0gd2hpbGUgKGk8YXIubGVuZ3RoICYmIGNvdW50KTtcbiAgcmV0dXJuIHtkYXRhOnIsIGFkdjppIH07XG59XG52YXIgT3Blbj1mdW5jdGlvbihwYXRoLG9wdHMsY2IpIHtcblx0b3B0cz1vcHRzfHx7fTtcblxuXHR2YXIgcmVhZFNpZ25hdHVyZT1mdW5jdGlvbihwb3MsY2IpIHtcblx0XHR2YXIgYnVmPW5ldyBCdWZmZXIoc2lnbmF0dXJlX3NpemUpO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWYsMCxzaWduYXR1cmVfc2l6ZSxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0aWYgKGh0bWw1ZnMpIHZhciBzaWduYXR1cmU9U3RyaW5nLmZyb21DaGFyQ29kZSgobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSlbMF0pXG5cdFx0XHRlbHNlIHZhciBzaWduYXR1cmU9YnVmZmVyLnRvU3RyaW5nKCd1dGY4JywwLHNpZ25hdHVyZV9zaXplKTtcblx0XHRcdGNiLmFwcGx5KHRoYXQsW3NpZ25hdHVyZV0pO1xuXHRcdH0pO1xuXHR9XG5cblx0Ly90aGlzIGlzIHF1aXRlIHNsb3dcblx0Ly93YWl0IGZvciBTdHJpbmdWaWV3ICtBcnJheUJ1ZmZlciB0byBzb2x2ZSB0aGUgcHJvYmxlbVxuXHQvL2h0dHBzOi8vZ3JvdXBzLmdvb2dsZS5jb20vYS9jaHJvbWl1bS5vcmcvZm9ydW0vIyF0b3BpYy9ibGluay1kZXYveWxnaU5ZX1pTVjBcblx0Ly9pZiB0aGUgc3RyaW5nIGlzIGFsd2F5cyB1Y3MyXG5cdC8vY2FuIHVzZSBVaW50MTYgdG8gcmVhZCBpdC5cblx0Ly9odHRwOi8vdXBkYXRlcy5odG1sNXJvY2tzLmNvbS8yMDEyLzA2L0hvdy10by1jb252ZXJ0LUFycmF5QnVmZmVyLXRvLWFuZC1mcm9tLVN0cmluZ1xuXHR2YXIgZGVjb2RldXRmOCA9IGZ1bmN0aW9uICh1dGZ0ZXh0KSB7XG5cdFx0dmFyIHN0cmluZyA9IFwiXCI7XG5cdFx0dmFyIGkgPSAwO1xuXHRcdHZhciBjPTAsYzEgPSAwLCBjMiA9IDAgLCBjMz0wO1xuXHRcdGZvciAodmFyIGk9MDtpPHV0ZnRleHQubGVuZ3RoO2krKykge1xuXHRcdFx0aWYgKHV0ZnRleHQuY2hhckNvZGVBdChpKT4xMjcpIGJyZWFrO1xuXHRcdH1cblx0XHRpZiAoaT49dXRmdGV4dC5sZW5ndGgpIHJldHVybiB1dGZ0ZXh0O1xuXG5cdFx0d2hpbGUgKCBpIDwgdXRmdGV4dC5sZW5ndGggKSB7XG5cdFx0XHRjID0gdXRmdGV4dC5jaGFyQ29kZUF0KGkpO1xuXHRcdFx0aWYgKGMgPCAxMjgpIHtcblx0XHRcdFx0c3RyaW5nICs9IHV0ZnRleHRbaV07XG5cdFx0XHRcdGkrKztcblx0XHRcdH0gZWxzZSBpZigoYyA+IDE5MSkgJiYgKGMgPCAyMjQpKSB7XG5cdFx0XHRcdGMyID0gdXRmdGV4dC5jaGFyQ29kZUF0KGkrMSk7XG5cdFx0XHRcdHN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDMxKSA8PCA2KSB8IChjMiAmIDYzKSk7XG5cdFx0XHRcdGkgKz0gMjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGMyID0gdXRmdGV4dC5jaGFyQ29kZUF0KGkrMSk7XG5cdFx0XHRcdGMzID0gdXRmdGV4dC5jaGFyQ29kZUF0KGkrMik7XG5cdFx0XHRcdHN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDE1KSA8PCAxMikgfCAoKGMyICYgNjMpIDw8IDYpIHwgKGMzICYgNjMpKTtcblx0XHRcdFx0aSArPSAzO1xuXHRcdFx0fVxuXHRcdH1cblx0XHRyZXR1cm4gc3RyaW5nO1xuXHR9XG5cblx0dmFyIHJlYWRTdHJpbmc9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcblx0XHRlbmNvZGluZz1lbmNvZGluZ3x8J3V0ZjgnO1xuXHRcdHZhciBidWZmZXI9bmV3IEJ1ZmZlcihibG9ja3NpemUpO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWZmZXIsMCxibG9ja3NpemUscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdHJlYWRMb2coXCJzdHJpbmdcIixsZW4pO1xuXHRcdFx0aWYgKGh0bWw1ZnMpIHtcblx0XHRcdFx0aWYgKGVuY29kaW5nPT0ndXRmOCcpIHtcblx0XHRcdFx0XHR2YXIgc3RyPWRlY29kZXV0ZjgoU3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLCBuZXcgVWludDhBcnJheShidWZmZXIpKSlcblx0XHRcdFx0fSBlbHNlIHsgLy91Y3MyIGlzIDMgdGltZXMgZmFzdGVyXG5cdFx0XHRcdFx0dmFyIHN0cj1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KG51bGwsIG5ldyBVaW50MTZBcnJheShidWZmZXIpKVx0XG5cdFx0XHRcdH1cblx0XHRcdFx0XG5cdFx0XHRcdGNiLmFwcGx5KHRoYXQsW3N0cl0pO1xuXHRcdFx0fSBcblx0XHRcdGVsc2UgY2IuYXBwbHkodGhhdCxbYnVmZmVyLnRvU3RyaW5nKGVuY29kaW5nKV0pO1x0XG5cdFx0fSk7XG5cdH1cblxuXHQvL3dvcmsgYXJvdW5kIGZvciBjaHJvbWUgZnJvbUNoYXJDb2RlIGNhbm5vdCBhY2NlcHQgaHVnZSBhcnJheVxuXHQvL2h0dHBzOi8vY29kZS5nb29nbGUuY29tL3AvY2hyb21pdW0vaXNzdWVzL2RldGFpbD9pZD01NjU4OFxuXHR2YXIgYnVmMnN0cmluZ2Fycj1mdW5jdGlvbihidWYsZW5jKSB7XG5cdFx0aWYgKGVuYz09XCJ1dGY4XCIpIFx0dmFyIGFycj1uZXcgVWludDhBcnJheShidWYpO1xuXHRcdGVsc2UgdmFyIGFycj1uZXcgVWludDE2QXJyYXkoYnVmKTtcblx0XHR2YXIgaT0wLGNvZGVzPVtdLG91dD1bXSxzPVwiXCI7XG5cdFx0d2hpbGUgKGk8YXJyLmxlbmd0aCkge1xuXHRcdFx0aWYgKGFycltpXSkge1xuXHRcdFx0XHRjb2Rlc1tjb2Rlcy5sZW5ndGhdPWFycltpXTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHM9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShudWxsLGNvZGVzKTtcblx0XHRcdFx0aWYgKGVuYz09XCJ1dGY4XCIpIG91dFtvdXQubGVuZ3RoXT1kZWNvZGV1dGY4KHMpO1xuXHRcdFx0XHRlbHNlIG91dFtvdXQubGVuZ3RoXT1zO1xuXHRcdFx0XHRjb2Rlcz1bXTtcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdFx0aSsrO1xuXHRcdH1cblx0XHRcblx0XHRzPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkobnVsbCxjb2Rlcyk7XG5cdFx0aWYgKGVuYz09XCJ1dGY4XCIpIG91dFtvdXQubGVuZ3RoXT1kZWNvZGV1dGY4KHMpO1xuXHRcdGVsc2Ugb3V0W291dC5sZW5ndGhdPXM7XG5cblx0XHRyZXR1cm4gb3V0O1xuXHR9XG5cdHZhciByZWFkU3RyaW5nQXJyYXkgPSBmdW5jdGlvbihwb3MsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcyxvdXQ9bnVsbDtcblx0XHRpZiAoYmxvY2tzaXplPT0wKSByZXR1cm4gW107XG5cdFx0ZW5jb2Rpbmc9ZW5jb2Rpbmd8fCd1dGY4Jztcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoYmxvY2tzaXplKTtcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZmZlciwwLGJsb2Nrc2l6ZSxwb3MsZnVuY3Rpb24oZXJyLGxlbixidWZmZXIpe1xuXHRcdFx0aWYgKGh0bWw1ZnMpIHtcblx0XHRcdFx0cmVhZExvZyhcInN0cmluZ0FycmF5XCIsYnVmZmVyLmJ5dGVMZW5ndGgpO1xuXG5cdFx0XHRcdGlmIChlbmNvZGluZz09J3V0ZjgnKSB7XG5cdFx0XHRcdFx0b3V0PWJ1ZjJzdHJpbmdhcnIoYnVmZmVyLFwidXRmOFwiKTtcblx0XHRcdFx0fSBlbHNlIHsgLy91Y3MyIGlzIDMgdGltZXMgZmFzdGVyXG5cdFx0XHRcdFx0b3V0PWJ1ZjJzdHJpbmdhcnIoYnVmZmVyLFwidWNzMlwiKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmVhZExvZyhcInN0cmluZ0FycmF5XCIsYnVmZmVyLmxlbmd0aCk7XG5cdFx0XHRcdG91dD1idWZmZXIudG9TdHJpbmcoZW5jb2RpbmcpLnNwbGl0KCdcXDAnKTtcblx0XHRcdH0gXHRcblx0XHRcdGNiLmFwcGx5KHRoYXQsW291dF0pO1xuXHRcdH0pO1xuXHR9XG5cdHZhciByZWFkVUkzMj1mdW5jdGlvbihwb3MsY2IpIHtcblx0XHR2YXIgYnVmZmVyPW5ldyBCdWZmZXIoNCk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGJ1ZmZlciwwLDQscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdHJlYWRMb2coXCJ1aTMyXCIsbGVuKTtcblx0XHRcdGlmIChodG1sNWZzKXtcblx0XHRcdFx0Ly92PShuZXcgVWludDMyQXJyYXkoYnVmZmVyKSlbMF07XG5cdFx0XHRcdHZhciB2PW5ldyBEYXRhVmlldyhidWZmZXIpLmdldFVpbnQzMigwLCBmYWxzZSlcblx0XHRcdFx0Y2Iodik7XG5cdFx0XHR9XG5cdFx0XHRlbHNlIGNiLmFwcGx5KHRoYXQsW2J1ZmZlci5yZWFkSW50MzJCRSgwKV0pO1x0XG5cdFx0fSk7XHRcdFxuXHR9XG5cblx0dmFyIHJlYWRJMzI9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdFx0dmFyIGJ1ZmZlcj1uZXcgQnVmZmVyKDQpO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWZmZXIsMCw0LHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRyZWFkTG9nKFwiaTMyXCIsbGVuKTtcblx0XHRcdGlmIChodG1sNWZzKXtcblx0XHRcdFx0dmFyIHY9bmV3IERhdGFWaWV3KGJ1ZmZlcikuZ2V0SW50MzIoMCwgZmFsc2UpXG5cdFx0XHRcdGNiKHYpO1xuXHRcdFx0fVxuXHRcdFx0ZWxzZSAgXHRjYi5hcHBseSh0aGF0LFtidWZmZXIucmVhZEludDMyQkUoMCldKTtcdFxuXHRcdH0pO1xuXHR9XG5cdHZhciByZWFkVUk4PWZ1bmN0aW9uKHBvcyxjYikge1xuXHRcdHZhciBidWZmZXI9bmV3IEJ1ZmZlcigxKTtcblx0XHR2YXIgdGhhdD10aGlzO1xuXG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWZmZXIsMCwxLHBvcyxmdW5jdGlvbihlcnIsbGVuLGJ1ZmZlcil7XG5cdFx0XHRyZWFkTG9nKFwidWk4XCIsbGVuKTtcblx0XHRcdGlmIChodG1sNWZzKWNiKCAobmV3IFVpbnQ4QXJyYXkoYnVmZmVyKSlbMF0pIDtcblx0XHRcdGVsc2UgIFx0XHRcdGNiLmFwcGx5KHRoYXQsW2J1ZmZlci5yZWFkVUludDgoMCldKTtcdFxuXHRcdFx0XG5cdFx0fSk7XG5cdH1cblx0dmFyIHJlYWRCdWY9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjYikge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0dmFyIGJ1Zj1uZXcgQnVmZmVyKGJsb2Nrc2l6ZSk7XG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxidWYsMCxibG9ja3NpemUscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdHJlYWRMb2coXCJidWZcIixsZW4pO1xuXHRcdFx0dmFyIGJ1ZmY9bmV3IFVpbnQ4QXJyYXkoYnVmZmVyKVxuXHRcdFx0Y2IuYXBwbHkodGhhdCxbYnVmZl0pO1xuXHRcdH0pO1xuXHR9XG5cdHZhciByZWFkQnVmX3BhY2tlZGludD1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNvdW50LHJlc2V0LGNiKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRyZWFkQnVmLmFwcGx5KHRoaXMsW3BvcyxibG9ja3NpemUsZnVuY3Rpb24oYnVmZmVyKXtcblx0XHRcdGNiLmFwcGx5KHRoYXQsW3VucGFja19pbnQoYnVmZmVyLGNvdW50LHJlc2V0KV0pO1x0XG5cdFx0fV0pO1xuXHRcdFxuXHR9XG5cdHZhciByZWFkRml4ZWRBcnJheV9odG1sNWZzPWZ1bmN0aW9uKHBvcyxjb3VudCx1bml0c2l6ZSxjYikge1xuXHRcdHZhciBmdW5jPW51bGw7XG5cdFx0aWYgKHVuaXRzaXplPT09MSkge1xuXHRcdFx0ZnVuYz0nZ2V0VWludDgnOy8vVWludDhBcnJheTtcblx0XHR9IGVsc2UgaWYgKHVuaXRzaXplPT09Mikge1xuXHRcdFx0ZnVuYz0nZ2V0VWludDE2JzsvL1VpbnQxNkFycmF5O1xuXHRcdH0gZWxzZSBpZiAodW5pdHNpemU9PT00KSB7XG5cdFx0XHRmdW5jPSdnZXRVaW50MzInOy8vVWludDMyQXJyYXk7XG5cdFx0fSBlbHNlIHRocm93ICd1bnN1cHBvcnRlZCBpbnRlZ2VyIHNpemUnO1xuXG5cdFx0ZnMucmVhZCh0aGlzLmhhbmRsZSxudWxsLDAsdW5pdHNpemUqY291bnQscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdHJlYWRMb2coXCJmaXggYXJyYXlcIixsZW4pO1xuXHRcdFx0dmFyIG91dD1bXTtcblx0XHRcdGlmICh1bml0c2l6ZT09MSkge1xuXHRcdFx0XHRvdXQ9bmV3IFVpbnQ4QXJyYXkoYnVmZmVyKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgbGVuIC8gdW5pdHNpemU7IGkrKykgeyAvL2VuZGlhbiBwcm9ibGVtXG5cdFx0XHRcdC8vXHRvdXQucHVzaCggZnVuYyhidWZmZXIsaSp1bml0c2l6ZSkpO1xuXHRcdFx0XHRcdG91dC5wdXNoKCB2PW5ldyBEYXRhVmlldyhidWZmZXIpW2Z1bmNdKGksZmFsc2UpICk7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdFx0Y2IuYXBwbHkodGhhdCxbb3V0XSk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gc2lnbmF0dXJlLCBpdGVtY291bnQsIHBheWxvYWRcblx0dmFyIHJlYWRGaXhlZEFycmF5ID0gZnVuY3Rpb24ocG9zICxjb3VudCwgdW5pdHNpemUsY2IpIHtcblx0XHR2YXIgZnVuYz1udWxsO1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0XG5cdFx0aWYgKHVuaXRzaXplKiBjb3VudD50aGlzLnNpemUgJiYgdGhpcy5zaXplKSAge1xuXHRcdFx0Y29uc29sZS5sb2coXCJhcnJheSBzaXplIGV4Y2VlZCBmaWxlIHNpemVcIix0aGlzLnNpemUpXG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdFxuXHRcdGlmIChodG1sNWZzKSByZXR1cm4gcmVhZEZpeGVkQXJyYXlfaHRtbDVmcy5hcHBseSh0aGlzLFtwb3MsY291bnQsdW5pdHNpemUsY2JdKTtcblxuXHRcdHZhciBpdGVtcz1uZXcgQnVmZmVyKCB1bml0c2l6ZSogY291bnQpO1xuXHRcdGlmICh1bml0c2l6ZT09PTEpIHtcblx0XHRcdGZ1bmM9aXRlbXMucmVhZFVJbnQ4O1xuXHRcdH0gZWxzZSBpZiAodW5pdHNpemU9PT0yKSB7XG5cdFx0XHRmdW5jPWl0ZW1zLnJlYWRVSW50MTZCRTtcblx0XHR9IGVsc2UgaWYgKHVuaXRzaXplPT09NCkge1xuXHRcdFx0ZnVuYz1pdGVtcy5yZWFkVUludDMyQkU7XG5cdFx0fSBlbHNlIHRocm93ICd1bnN1cHBvcnRlZCBpbnRlZ2VyIHNpemUnO1xuXHRcdC8vY29uc29sZS5sb2coJ2l0ZW1jb3VudCcsaXRlbWNvdW50LCdidWZmZXInLGJ1ZmZlcik7XG5cblx0XHRmcy5yZWFkKHRoaXMuaGFuZGxlLGl0ZW1zLDAsdW5pdHNpemUqY291bnQscG9zLGZ1bmN0aW9uKGVycixsZW4sYnVmZmVyKXtcblx0XHRcdHJlYWRMb2coXCJmaXggYXJyYXlcIixsZW4pO1xuXHRcdFx0dmFyIG91dD1bXTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoIC8gdW5pdHNpemU7IGkrKykge1xuXHRcdFx0XHRvdXQucHVzaCggZnVuYy5hcHBseShpdGVtcyxbaSp1bml0c2l6ZV0pKTtcblx0XHRcdH1cblx0XHRcdGNiLmFwcGx5KHRoYXQsW291dF0pO1xuXHRcdH0pO1xuXHR9XG5cblx0dmFyIGZyZWU9ZnVuY3Rpb24oKSB7XG5cdFx0Ly9jb25zb2xlLmxvZygnY2xvc2luZyAnLGhhbmRsZSk7XG5cdFx0ZnMuY2xvc2VTeW5jKHRoaXMuaGFuZGxlKTtcblx0fVxuXHR2YXIgc2V0dXBhcGk9ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR0aGlzLnJlYWRTaWduYXR1cmU9cmVhZFNpZ25hdHVyZTtcblx0XHR0aGlzLnJlYWRJMzI9cmVhZEkzMjtcblx0XHR0aGlzLnJlYWRVSTMyPXJlYWRVSTMyO1xuXHRcdHRoaXMucmVhZFVJOD1yZWFkVUk4O1xuXHRcdHRoaXMucmVhZEJ1Zj1yZWFkQnVmO1xuXHRcdHRoaXMucmVhZEJ1Zl9wYWNrZWRpbnQ9cmVhZEJ1Zl9wYWNrZWRpbnQ7XG5cdFx0dGhpcy5yZWFkRml4ZWRBcnJheT1yZWFkRml4ZWRBcnJheTtcblx0XHR0aGlzLnJlYWRTdHJpbmc9cmVhZFN0cmluZztcblx0XHR0aGlzLnJlYWRTdHJpbmdBcnJheT1yZWFkU3RyaW5nQXJyYXk7XG5cdFx0dGhpcy5zaWduYXR1cmVfc2l6ZT1zaWduYXR1cmVfc2l6ZTtcblx0XHR0aGlzLmZyZWU9ZnJlZTtcblx0XHRpZiAoaHRtbDVmcykge1xuXHRcdFx0dmFyIGZuPXBhdGg7XG5cdFx0XHRpZiAocGF0aC5pbmRleE9mKFwiZmlsZXN5c3RlbTpcIik9PTApIGZuPXBhdGguc3Vic3RyKHBhdGgubGFzdEluZGV4T2YoXCIvXCIpKTtcblx0XHRcdGZzLmZzLnJvb3QuZ2V0RmlsZShmbix7fSxmdW5jdGlvbihlbnRyeSl7XG5cdFx0XHQgIGVudHJ5LmdldE1ldGFkYXRhKGZ1bmN0aW9uKG1ldGFkYXRhKSB7IFxuXHRcdFx0XHR0aGF0LnNpemU9bWV0YWRhdGEuc2l6ZTtcblx0XHRcdFx0aWYgKGNiKSBzZXRUaW1lb3V0KGNiLmJpbmQodGhhdCksMCk7XG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBzdGF0PWZzLmZzdGF0U3luYyh0aGlzLmhhbmRsZSk7XG5cdFx0XHR0aGlzLnN0YXQ9c3RhdDtcblx0XHRcdHRoaXMuc2l6ZT1zdGF0LnNpemU7XHRcdFxuXHRcdFx0aWYgKGNiKVx0c2V0VGltZW91dChjYi5iaW5kKHRoaXMsMCksMCk7XHRcblx0XHR9XG5cdH1cblxuXHR2YXIgdGhhdD10aGlzO1xuXHRpZiAoaHRtbDVmcykge1xuXHRcdGZzLm9wZW4ocGF0aCxmdW5jdGlvbihoKXtcblx0XHRcdGlmICghaCkge1xuXHRcdFx0XHRpZiAoY2IpXHRzZXRUaW1lb3V0KGNiLmJpbmQobnVsbCxcImZpbGUgbm90IGZvdW5kOlwiK3BhdGgpLDApO1x0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGF0LmhhbmRsZT1oO1xuXHRcdFx0XHR0aGF0Lmh0bWw1ZnM9dHJ1ZTtcblx0XHRcdFx0c2V0dXBhcGkuY2FsbCh0aGF0KTtcblx0XHRcdFx0dGhhdC5vcGVuZWQ9dHJ1ZTtcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdH0pXG5cdH0gZWxzZSB7XG5cdFx0aWYgKGZzLmV4aXN0c1N5bmMocGF0aCkpe1xuXHRcdFx0dGhpcy5oYW5kbGU9ZnMub3BlblN5bmMocGF0aCwncicpOy8vLGZ1bmN0aW9uKGVycixoYW5kbGUpe1xuXHRcdFx0dGhpcy5vcGVuZWQ9dHJ1ZTtcblx0XHRcdHNldHVwYXBpLmNhbGwodGhpcyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChjYilcdHNldFRpbWVvdXQoY2IuYmluZChudWxsLFwiZmlsZSBub3QgZm91bmQ6XCIrcGF0aCksMCk7XHRcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gdGhpcztcbn1cbm1vZHVsZS5leHBvcnRzPU9wZW47IiwiLypcbiAgSkFWQSBjYW4gb25seSByZXR1cm4gTnVtYmVyIGFuZCBTdHJpbmdcblx0YXJyYXkgYW5kIGJ1ZmZlciByZXR1cm4gaW4gc3RyaW5nIGZvcm1hdFxuXHRuZWVkIEpTT04ucGFyc2VcbiovXG52YXIgdmVyYm9zZT0wO1xuXG52YXIgcmVhZFNpZ25hdHVyZT1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIHNpZ25hdHVyZVwiKTtcblx0dmFyIHNpZ25hdHVyZT1rZnMucmVhZFVURjhTdHJpbmcodGhpcy5oYW5kbGUscG9zLDEpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhzaWduYXR1cmUsc2lnbmF0dXJlLmNoYXJDb2RlQXQoMCkpO1xuXHRjYi5hcHBseSh0aGlzLFtzaWduYXR1cmVdKTtcbn1cbnZhciByZWFkSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgaTMyIGF0IFwiK3Bvcyk7XG5cdHZhciBpMzI9a2ZzLnJlYWRJbnQzMih0aGlzLmhhbmRsZSxwb3MpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhpMzIpO1xuXHRjYi5hcHBseSh0aGlzLFtpMzJdKTtcdFxufVxudmFyIHJlYWRVSTMyPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgdWkzMiBhdCBcIitwb3MpO1xuXHR2YXIgdWkzMj1rZnMucmVhZFVJbnQzMih0aGlzLmhhbmRsZSxwb3MpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1Zyh1aTMyKTtcblx0Y2IuYXBwbHkodGhpcyxbdWkzMl0pO1xufVxudmFyIHJlYWRVSTg9ZnVuY3Rpb24ocG9zLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCB1aTggYXQgXCIrcG9zKTsgXG5cdHZhciB1aTg9a2ZzLnJlYWRVSW50OCh0aGlzLmhhbmRsZSxwb3MpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1Zyh1aTgpO1xuXHRjYi5hcHBseSh0aGlzLFt1aThdKTtcbn1cbnZhciByZWFkQnVmPWZ1bmN0aW9uKHBvcyxibG9ja3NpemUsY2IpIHtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJyZWFkIGJ1ZmZlciBhdCBcIitwb3MrIFwiIGJsb2Nrc2l6ZSBcIitibG9ja3NpemUpO1xuXHR2YXIgYnVmPWtmcy5yZWFkQnVmKHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUpO1xuXHR2YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zik7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwiYnVmZmVyIGxlbmd0aFwiK2J1ZmYubGVuZ3RoKTtcblx0Y2IuYXBwbHkodGhpcyxbYnVmZl0pO1x0XG59XG52YXIgcmVhZEJ1Zl9wYWNrZWRpbnQ9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjb3VudCxyZXNldCxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgcGFja2VkIGludCBhdCBcIitwb3MrXCIgYmxvY2tzaXplIFwiK2Jsb2Nrc2l6ZStcIiBjb3VudCBcIitjb3VudCk7XG5cdHZhciBidWY9a2ZzLnJlYWRCdWZfcGFja2VkaW50KHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUsY291bnQscmVzZXQpO1xuXHR2YXIgYWR2PXBhcnNlSW50KGJ1Zik7XG5cdHZhciBidWZmPUpTT04ucGFyc2UoYnVmLnN1YnN0cihidWYuaW5kZXhPZihcIltcIikpKTtcblx0aWYgKHZlcmJvc2UpIGNvbnNvbGUuZGVidWcoXCJwYWNrZWRJbnQgbGVuZ3RoIFwiK2J1ZmYubGVuZ3RoK1wiIGZpcnN0IGl0ZW09XCIrYnVmZlswXSk7XG5cdGNiLmFwcGx5KHRoaXMsW3tkYXRhOmJ1ZmYsYWR2OmFkdn1dKTtcdFxufVxuXG5cbnZhciByZWFkU3RyaW5nPSBmdW5jdGlvbihwb3MsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZHN0cmluZyBhdCBcIitwb3MrXCIgYmxvY2tzaXplIFwiICtibG9ja3NpemUrXCIgZW5jOlwiK2VuY29kaW5nKTtcblx0aWYgKGVuY29kaW5nPT1cInVjczJcIikge1xuXHRcdHZhciBzdHI9a2ZzLnJlYWRVTEUxNlN0cmluZyh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgc3RyPWtmcy5yZWFkVVRGOFN0cmluZyh0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcdFxuXHR9XHQgXG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKHN0cik7XG5cdGNiLmFwcGx5KHRoaXMsW3N0cl0pO1x0XG59XG5cbnZhciByZWFkRml4ZWRBcnJheSA9IGZ1bmN0aW9uKHBvcyAsY291bnQsIHVuaXRzaXplLGNiKSB7XG5cdGlmICh2ZXJib3NlKSBjb25zb2xlLmRlYnVnKFwicmVhZCBmaXhlZCBhcnJheSBhdCBcIitwb3MrXCIgY291bnQgXCIrY291bnQrXCIgdW5pdHNpemUgXCIrdW5pdHNpemUpOyBcblx0dmFyIGJ1Zj1rZnMucmVhZEZpeGVkQXJyYXkodGhpcy5oYW5kbGUscG9zLGNvdW50LHVuaXRzaXplKTtcblx0dmFyIGJ1ZmY9SlNPTi5wYXJzZShidWYpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcImFycmF5IGxlbmd0aFwiK2J1ZmYubGVuZ3RoKTtcblx0Y2IuYXBwbHkodGhpcyxbYnVmZl0pO1x0XG59XG52YXIgcmVhZFN0cmluZ0FycmF5ID0gZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyxjYikge1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5sb2coXCJyZWFkIFN0cmluZyBhcnJheSBhdCBcIitwb3MrXCIgYmxvY2tzaXplIFwiK2Jsb2Nrc2l6ZSArXCIgZW5jIFwiK2VuY29kaW5nKTsgXG5cdGVuY29kaW5nID0gZW5jb2Rpbmd8fFwidXRmOFwiO1xuXHR2YXIgYnVmPWtmcy5yZWFkU3RyaW5nQXJyYXkodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSxlbmNvZGluZyk7XG5cdC8vdmFyIGJ1ZmY9SlNPTi5wYXJzZShidWYpO1xuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcInJlYWQgc3RyaW5nIGFycmF5XCIpO1xuXHR2YXIgYnVmZj1idWYuc3BsaXQoXCJcXHVmZmZmXCIpOyAvL2Nhbm5vdCByZXR1cm4gc3RyaW5nIHdpdGggMFxuXHRpZiAodmVyYm9zZSkgY29uc29sZS5kZWJ1ZyhcImFycmF5IGxlbmd0aFwiK2J1ZmYubGVuZ3RoKTtcblx0Y2IuYXBwbHkodGhpcyxbYnVmZl0pO1x0XG59XG52YXIgbWVyZ2VQb3N0aW5ncz1mdW5jdGlvbihwb3NpdGlvbnMsY2IpIHtcblx0dmFyIGJ1Zj1rZnMubWVyZ2VQb3N0aW5ncyh0aGlzLmhhbmRsZSxKU09OLnN0cmluZ2lmeShwb3NpdGlvbnMpKTtcblx0aWYgKCFidWYgfHwgYnVmLmxlbmd0aD09MCkgcmV0dXJuIFtdO1xuXHRlbHNlIHJldHVybiBKU09OLnBhcnNlKGJ1Zik7XG59XG5cbnZhciBmcmVlPWZ1bmN0aW9uKCkge1xuXHQvL2NvbnNvbGUubG9nKCdjbG9zaW5nICcsaGFuZGxlKTtcblx0a2ZzLmNsb3NlKHRoaXMuaGFuZGxlKTtcbn1cbnZhciBPcGVuPWZ1bmN0aW9uKHBhdGgsb3B0cyxjYikge1xuXHRvcHRzPW9wdHN8fHt9O1xuXHR2YXIgc2lnbmF0dXJlX3NpemU9MTtcblx0dmFyIHNldHVwYXBpPWZ1bmN0aW9uKCkgeyBcblx0XHR0aGlzLnJlYWRTaWduYXR1cmU9cmVhZFNpZ25hdHVyZTtcblx0XHR0aGlzLnJlYWRJMzI9cmVhZEkzMjtcblx0XHR0aGlzLnJlYWRVSTMyPXJlYWRVSTMyO1xuXHRcdHRoaXMucmVhZFVJOD1yZWFkVUk4O1xuXHRcdHRoaXMucmVhZEJ1Zj1yZWFkQnVmO1xuXHRcdHRoaXMucmVhZEJ1Zl9wYWNrZWRpbnQ9cmVhZEJ1Zl9wYWNrZWRpbnQ7XG5cdFx0dGhpcy5yZWFkRml4ZWRBcnJheT1yZWFkRml4ZWRBcnJheTtcblx0XHR0aGlzLnJlYWRTdHJpbmc9cmVhZFN0cmluZztcblx0XHR0aGlzLnJlYWRTdHJpbmdBcnJheT1yZWFkU3RyaW5nQXJyYXk7XG5cdFx0dGhpcy5zaWduYXR1cmVfc2l6ZT1zaWduYXR1cmVfc2l6ZTtcblx0XHR0aGlzLm1lcmdlUG9zdGluZ3M9bWVyZ2VQb3N0aW5ncztcblx0XHR0aGlzLmZyZWU9ZnJlZTtcblx0XHR0aGlzLnNpemU9a2ZzLmdldEZpbGVTaXplKHRoaXMuaGFuZGxlKTtcblx0XHRpZiAodmVyYm9zZSkgY29uc29sZS5sb2coXCJmaWxlc2l6ZSAgXCIrdGhpcy5zaXplKTtcblx0XHRpZiAoY2IpXHRjYi5jYWxsKHRoaXMpO1xuXHR9XG5cblx0dGhpcy5oYW5kbGU9a2ZzLm9wZW4ocGF0aCk7XG5cdHRoaXMub3BlbmVkPXRydWU7XG5cdHNldHVwYXBpLmNhbGwodGhpcyk7XG5cdHJldHVybiB0aGlzO1xufVxuXG5tb2R1bGUuZXhwb3J0cz1PcGVuOyIsIi8qXG4gIEpTQ29udGV4dCBjYW4gcmV0dXJuIGFsbCBKYXZhc2NyaXB0IHR5cGVzLlxuKi9cbnZhciB2ZXJib3NlPTE7XG5cbnZhciByZWFkU2lnbmF0dXJlPWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgc2lnbmF0dXJlIGF0IFwiK3Bvcyk7XG5cdHZhciBzaWduYXR1cmU9a2ZzLnJlYWRVVEY4U3RyaW5nKHRoaXMuaGFuZGxlLHBvcywxKTtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coc2lnbmF0dXJlK1wiIFwiK3NpZ25hdHVyZS5jaGFyQ29kZUF0KDApKTtcblx0Y2IuYXBwbHkodGhpcyxbc2lnbmF0dXJlXSk7XG59XG52YXIgcmVhZEkzMj1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIGkzMiBhdCBcIitwb3MpO1xuXHR2YXIgaTMyPWtmcy5yZWFkSW50MzIodGhpcy5oYW5kbGUscG9zKTtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coaTMyKTtcblx0Y2IuYXBwbHkodGhpcyxbaTMyXSk7XHRcbn1cbnZhciByZWFkVUkzMj1mdW5jdGlvbihwb3MsY2IpIHtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIHVpMzIgYXQgXCIrcG9zKTtcblx0dmFyIHVpMzI9a2ZzLnJlYWRVSW50MzIodGhpcy5oYW5kbGUscG9zKTtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2codWkzMik7XG5cdGNiLmFwcGx5KHRoaXMsW3VpMzJdKTtcbn1cbnZhciByZWFkVUk4PWZ1bmN0aW9uKHBvcyxjYikge1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgdWk4IGF0IFwiK3Bvcyk7IFxuXHR2YXIgdWk4PWtmcy5yZWFkVUludDgodGhpcy5oYW5kbGUscG9zKTtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2codWk4KTtcblx0Y2IuYXBwbHkodGhpcyxbdWk4XSk7XG59XG52YXIgcmVhZEJ1Zj1mdW5jdGlvbihwb3MsYmxvY2tzaXplLGNiKSB7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmVhZCBidWZmZXIgYXQgXCIrcG9zKTtcblx0dmFyIGJ1Zj1rZnMucmVhZEJ1Zih0aGlzLmhhbmRsZSxwb3MsYmxvY2tzaXplKTtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJidWZmZXIgbGVuZ3RoXCIrYnVmLmxlbmd0aCk7XG5cdGNiLmFwcGx5KHRoaXMsW2J1Zl0pO1x0XG59XG52YXIgcmVhZEJ1Zl9wYWNrZWRpbnQ9ZnVuY3Rpb24ocG9zLGJsb2Nrc2l6ZSxjb3VudCxyZXNldCxjYikge1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgcGFja2VkIGludCBmYXN0LCBibG9ja3NpemUgXCIrYmxvY2tzaXplK1wiIGF0IFwiK3Bvcyk7dmFyIHQ9bmV3IERhdGUoKTtcblx0dmFyIGJ1Zj1rZnMucmVhZEJ1Zl9wYWNrZWRpbnQodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSxjb3VudCxyZXNldCk7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwicmV0dXJuIGZyb20gcGFja2VkaW50LCB0aW1lXCIgKyAobmV3IERhdGUoKS10KSk7XG5cdGlmICh0eXBlb2YgYnVmLmRhdGE9PVwic3RyaW5nXCIpIHtcblx0XHRidWYuZGF0YT1ldmFsKFwiW1wiK2J1Zi5kYXRhLnN1YnN0cigwLGJ1Zi5kYXRhLmxlbmd0aC0xKStcIl1cIik7XG5cdH1cblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJ1bnBhY2tlZCBsZW5ndGhcIitidWYuZGF0YS5sZW5ndGgrXCIgdGltZVwiICsgKG5ldyBEYXRlKCktdCkgKTtcblx0Y2IuYXBwbHkodGhpcyxbYnVmXSk7XG59XG5cblxudmFyIHJlYWRTdHJpbmc9IGZ1bmN0aW9uKHBvcyxibG9ja3NpemUsZW5jb2RpbmcsY2IpIHtcblxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWRzdHJpbmcgYXQgXCIrcG9zK1wiIGJsb2Nrc2l6ZSBcIitibG9ja3NpemUrXCIgXCIrZW5jb2RpbmcpO3ZhciB0PW5ldyBEYXRlKCk7XG5cdGlmIChlbmNvZGluZz09XCJ1Y3MyXCIpIHtcblx0XHR2YXIgc3RyPWtmcy5yZWFkVUxFMTZTdHJpbmcodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIHN0cj1rZnMucmVhZFVURjhTdHJpbmcodGhpcy5oYW5kbGUscG9zLGJsb2Nrc2l6ZSk7XHRcblx0fVxuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhzdHIrXCIgdGltZVwiKyhuZXcgRGF0ZSgpLXQpKTtcblx0Y2IuYXBwbHkodGhpcyxbc3RyXSk7XHRcbn1cblxudmFyIHJlYWRGaXhlZEFycmF5ID0gZnVuY3Rpb24ocG9zICxjb3VudCwgdW5pdHNpemUsY2IpIHtcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIGZpeGVkIGFycmF5IGF0IFwiK3Bvcyk7IHZhciB0PW5ldyBEYXRlKCk7XG5cdHZhciBidWY9a2ZzLnJlYWRGaXhlZEFycmF5KHRoaXMuaGFuZGxlLHBvcyxjb3VudCx1bml0c2l6ZSk7XG5cdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwiYXJyYXkgbGVuZ3RoIFwiK2J1Zi5sZW5ndGgrXCIgdGltZVwiKyhuZXcgRGF0ZSgpLXQpKTtcblx0Y2IuYXBwbHkodGhpcyxbYnVmXSk7XHRcbn1cbnZhciByZWFkU3RyaW5nQXJyYXkgPSBmdW5jdGlvbihwb3MsYmxvY2tzaXplLGVuY29kaW5nLGNiKSB7XG5cdC8vaWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJyZWFkIFN0cmluZyBhcnJheSBcIitibG9ja3NpemUgK1wiIFwiK2VuY29kaW5nKTsgXG5cdGVuY29kaW5nID0gZW5jb2Rpbmd8fFwidXRmOFwiO1xuXHRpZiAodmVyYm9zZSkgIGtzYW5hZ2FwLmxvZyhcInJlYWQgc3RyaW5nIGFycmF5IGF0IFwiK3Bvcyk7dmFyIHQ9bmV3IERhdGUoKTtcblx0dmFyIGJ1Zj1rZnMucmVhZFN0cmluZ0FycmF5KHRoaXMuaGFuZGxlLHBvcyxibG9ja3NpemUsZW5jb2RpbmcpO1xuXHRpZiAodHlwZW9mIGJ1Zj09XCJzdHJpbmdcIikgYnVmPWJ1Zi5zcGxpdChcIlxcMFwiKTtcblx0Ly92YXIgYnVmZj1KU09OLnBhcnNlKGJ1Zik7XG5cdC8vdmFyIGJ1ZmY9YnVmLnNwbGl0KFwiXFx1ZmZmZlwiKTsgLy9jYW5ub3QgcmV0dXJuIHN0cmluZyB3aXRoIDBcblx0aWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coXCJzdHJpbmcgYXJyYXkgbGVuZ3RoXCIrYnVmLmxlbmd0aCtcIiB0aW1lXCIrKG5ldyBEYXRlKCktdCkpO1xuXHRjYi5hcHBseSh0aGlzLFtidWZdKTtcbn1cblxudmFyIG1lcmdlUG9zdGluZ3M9ZnVuY3Rpb24ocG9zaXRpb25zKSB7XG5cdHZhciBidWY9a2ZzLm1lcmdlUG9zdGluZ3ModGhpcy5oYW5kbGUscG9zaXRpb25zKTtcblx0aWYgKHR5cGVvZiBidWY9PVwic3RyaW5nXCIpIHtcblx0XHRidWY9ZXZhbChcIltcIitidWYuc3Vic3RyKDAsYnVmLmxlbmd0aC0xKStcIl1cIik7XG5cdH1cblx0cmV0dXJuIGJ1Zjtcbn1cbnZhciBmcmVlPWZ1bmN0aW9uKCkge1xuXHQvLy8vaWYgKHZlcmJvc2UpICBrc2FuYWdhcC5sb2coJ2Nsb3NpbmcgJyxoYW5kbGUpO1xuXHRrZnMuY2xvc2UodGhpcy5oYW5kbGUpO1xufVxudmFyIE9wZW49ZnVuY3Rpb24ocGF0aCxvcHRzLGNiKSB7XG5cdG9wdHM9b3B0c3x8e307XG5cdHZhciBzaWduYXR1cmVfc2l6ZT0xO1xuXHR2YXIgc2V0dXBhcGk9ZnVuY3Rpb24oKSB7IFxuXHRcdHRoaXMucmVhZFNpZ25hdHVyZT1yZWFkU2lnbmF0dXJlO1xuXHRcdHRoaXMucmVhZEkzMj1yZWFkSTMyO1xuXHRcdHRoaXMucmVhZFVJMzI9cmVhZFVJMzI7XG5cdFx0dGhpcy5yZWFkVUk4PXJlYWRVSTg7XG5cdFx0dGhpcy5yZWFkQnVmPXJlYWRCdWY7XG5cdFx0dGhpcy5yZWFkQnVmX3BhY2tlZGludD1yZWFkQnVmX3BhY2tlZGludDtcblx0XHR0aGlzLnJlYWRGaXhlZEFycmF5PXJlYWRGaXhlZEFycmF5O1xuXHRcdHRoaXMucmVhZFN0cmluZz1yZWFkU3RyaW5nO1xuXHRcdHRoaXMucmVhZFN0cmluZ0FycmF5PXJlYWRTdHJpbmdBcnJheTtcblx0XHR0aGlzLnNpZ25hdHVyZV9zaXplPXNpZ25hdHVyZV9zaXplO1xuXHRcdHRoaXMubWVyZ2VQb3N0aW5ncz1tZXJnZVBvc3RpbmdzO1xuXHRcdHRoaXMuZnJlZT1mcmVlO1xuXHRcdHRoaXMuc2l6ZT1rZnMuZ2V0RmlsZVNpemUodGhpcy5oYW5kbGUpO1xuXHRcdGlmICh2ZXJib3NlKSAga3NhbmFnYXAubG9nKFwiZmlsZXNpemUgIFwiK3RoaXMuc2l6ZSk7XG5cdFx0aWYgKGNiKVx0Y2IuY2FsbCh0aGlzKTtcblx0fVxuXG5cdHRoaXMuaGFuZGxlPWtmcy5vcGVuKHBhdGgpO1xuXHR0aGlzLm9wZW5lZD10cnVlO1xuXHRzZXR1cGFwaS5jYWxsKHRoaXMpO1xuXHRyZXR1cm4gdGhpcztcbn1cblxubW9kdWxlLmV4cG9ydHM9T3BlbjsiLCIvKlxuICBjb252ZXJ0IGFueSBqc29uIGludG8gYSBiaW5hcnkgYnVmZmVyXG4gIHRoZSBidWZmZXIgY2FuIGJlIHNhdmVkIHdpdGggYSBzaW5nbGUgbGluZSBvZiBmcy53cml0ZUZpbGVcbiovXG5cbnZhciBEVD17XG5cdHVpbnQ4OicxJywgLy91bnNpZ25lZCAxIGJ5dGUgaW50ZWdlclxuXHRpbnQzMjonNCcsIC8vIHNpZ25lZCA0IGJ5dGVzIGludGVnZXJcblx0dXRmODonOCcsICBcblx0dWNzMjonMicsXG5cdGJvb2w6J14nLCBcblx0YmxvYjonJicsXG5cdHV0ZjhhcnI6JyonLCAvL3NoaWZ0IG9mIDhcblx0dWNzMmFycjonQCcsIC8vc2hpZnQgb2YgMlxuXHR1aW50OGFycjonIScsIC8vc2hpZnQgb2YgMVxuXHRpbnQzMmFycjonJCcsIC8vc2hpZnQgb2YgNFxuXHR2aW50OidgJyxcblx0cGludDonficsXHRcblxuXHRhcnJheTonXFx1MDAxYicsXG5cdG9iamVjdDonXFx1MDAxYScgXG5cdC8veWRiIHN0YXJ0IHdpdGggb2JqZWN0IHNpZ25hdHVyZSxcblx0Ly90eXBlIGEgeWRiIGluIGNvbW1hbmQgcHJvbXB0IHNob3dzIG5vdGhpbmdcbn1cbnZhciBrZXlfd3JpdGluZz1cIlwiOy8vZm9yIGRlYnVnZ2luZ1xudmFyIHBhY2tfaW50ID0gZnVuY3Rpb24gKGFyLCBzYXZlZGVsdGEpIHsgLy8gcGFjayBhciBpbnRvXG4gIGlmICghYXIgfHwgYXIubGVuZ3RoID09PSAwKSByZXR1cm4gW107IC8vIGVtcHR5IGFycmF5XG4gIHZhciByID0gW10sXG4gIGkgPSAwLFxuICBqID0gMCxcbiAgZGVsdGEgPSAwLFxuICBwcmV2ID0gMDtcbiAgXG4gIGRvIHtcblx0ZGVsdGEgPSBhcltpXTtcblx0aWYgKHNhdmVkZWx0YSkge1xuXHRcdGRlbHRhIC09IHByZXY7XG5cdH1cblx0aWYgKGRlbHRhIDwgMCkge1xuXHQgIGNvbnNvbGUudHJhY2UoJ25lZ2F0aXZlJyxwcmV2LGFyW2ldKVxuXHQgIHRocm93ICduZWdldGl2ZSc7XG5cdCAgYnJlYWs7XG5cdH1cblx0XG5cdHJbaisrXSA9IGRlbHRhICYgMHg3Zjtcblx0ZGVsdGEgPj49IDc7XG5cdHdoaWxlIChkZWx0YSA+IDApIHtcblx0ICByW2orK10gPSAoZGVsdGEgJiAweDdmKSB8IDB4ODA7XG5cdCAgZGVsdGEgPj49IDc7XG5cdH1cblx0cHJldiA9IGFyW2ldO1xuXHRpKys7XG4gIH0gd2hpbGUgKGkgPCBhci5sZW5ndGgpO1xuICByZXR1cm4gcjtcbn1cbnZhciBLZnM9ZnVuY3Rpb24ocGF0aCxvcHRzKSB7XG5cdFxuXHR2YXIgaGFuZGxlPW51bGw7XG5cdG9wdHM9b3B0c3x8e307XG5cdG9wdHMuc2l6ZT1vcHRzLnNpemV8fDY1NTM2KjIwNDg7IFxuXHRjb25zb2xlLmxvZygna2RiIGVzdGltYXRlIHNpemU6JyxvcHRzLnNpemUpO1xuXHR2YXIgZGJ1Zj1uZXcgQnVmZmVyKG9wdHMuc2l6ZSk7XG5cdHZhciBjdXI9MDsvL2RidWYgY3Vyc29yXG5cdFxuXHR2YXIgd3JpdGVTaWduYXR1cmU9ZnVuY3Rpb24odmFsdWUscG9zKSB7XG5cdFx0ZGJ1Zi53cml0ZSh2YWx1ZSxwb3MsdmFsdWUubGVuZ3RoLCd1dGY4Jyk7XG5cdFx0aWYgKHBvcyt2YWx1ZS5sZW5ndGg+Y3VyKSBjdXI9cG9zK3ZhbHVlLmxlbmd0aDtcblx0XHRyZXR1cm4gdmFsdWUubGVuZ3RoO1xuXHR9XG5cdHZhciB3cml0ZU9mZnNldD1mdW5jdGlvbih2YWx1ZSxwb3MpIHtcblx0XHRkYnVmLndyaXRlVUludDgoTWF0aC5mbG9vcih2YWx1ZSAvICg2NTUzNio2NTUzNikpLHBvcyk7XG5cdFx0ZGJ1Zi53cml0ZVVJbnQzMkJFKCB2YWx1ZSAmIDB4RkZGRkZGRkYscG9zKzEpO1xuXHRcdGlmIChwb3MrNT5jdXIpIGN1cj1wb3MrNTtcblx0XHRyZXR1cm4gNTtcblx0fVxuXHR2YXIgd3JpdGVTdHJpbmc9IGZ1bmN0aW9uKHZhbHVlLHBvcyxlbmNvZGluZykge1xuXHRcdGVuY29kaW5nPWVuY29kaW5nfHwndWNzMic7XG5cdFx0aWYgKHZhbHVlPT1cIlwiKSB0aHJvdyBcImNhbm5vdCB3cml0ZSBudWxsIHN0cmluZ1wiO1xuXHRcdGlmIChlbmNvZGluZz09PSd1dGY4JylkYnVmLndyaXRlKERULnV0ZjgscG9zLDEsJ3V0ZjgnKTtcblx0XHRlbHNlIGlmIChlbmNvZGluZz09PSd1Y3MyJylkYnVmLndyaXRlKERULnVjczIscG9zLDEsJ3V0ZjgnKTtcblx0XHRlbHNlIHRocm93ICd1bnN1cHBvcnRlZCBlbmNvZGluZyAnK2VuY29kaW5nO1xuXHRcdFx0XG5cdFx0dmFyIGxlbj1CdWZmZXIuYnl0ZUxlbmd0aCh2YWx1ZSwgZW5jb2RpbmcpO1xuXHRcdGRidWYud3JpdGUodmFsdWUscG9zKzEsbGVuLGVuY29kaW5nKTtcblx0XHRcblx0XHRpZiAocG9zK2xlbisxPmN1cikgY3VyPXBvcytsZW4rMTtcblx0XHRyZXR1cm4gbGVuKzE7IC8vIHNpZ25hdHVyZVxuXHR9XG5cdHZhciB3cml0ZVN0cmluZ0FycmF5ID0gZnVuY3Rpb24odmFsdWUscG9zLGVuY29kaW5nKSB7XG5cdFx0ZW5jb2Rpbmc9ZW5jb2Rpbmd8fCd1Y3MyJztcblx0XHRpZiAoZW5jb2Rpbmc9PT0ndXRmOCcpIGRidWYud3JpdGUoRFQudXRmOGFycixwb3MsMSwndXRmOCcpO1xuXHRcdGVsc2UgaWYgKGVuY29kaW5nPT09J3VjczInKWRidWYud3JpdGUoRFQudWNzMmFycixwb3MsMSwndXRmOCcpO1xuXHRcdGVsc2UgdGhyb3cgJ3Vuc3VwcG9ydGVkIGVuY29kaW5nICcrZW5jb2Rpbmc7XG5cdFx0XG5cdFx0dmFyIHY9dmFsdWUuam9pbignXFwwJyk7XG5cdFx0dmFyIGxlbj1CdWZmZXIuYnl0ZUxlbmd0aCh2LCBlbmNvZGluZyk7XG5cdFx0aWYgKDA9PT1sZW4pIHtcblx0XHRcdHRocm93IFwiZW1wdHkgc3RyaW5nIGFycmF5IFwiICsga2V5X3dyaXRpbmc7XG5cdFx0fVxuXHRcdGRidWYud3JpdGUodixwb3MrMSxsZW4sZW5jb2RpbmcpO1xuXHRcdGlmIChwb3MrbGVuKzE+Y3VyKSBjdXI9cG9zK2xlbisxO1xuXHRcdHJldHVybiBsZW4rMTtcblx0fVxuXHR2YXIgd3JpdGVJMzI9ZnVuY3Rpb24odmFsdWUscG9zKSB7XG5cdFx0ZGJ1Zi53cml0ZShEVC5pbnQzMixwb3MsMSwndXRmOCcpO1xuXHRcdGRidWYud3JpdGVJbnQzMkJFKHZhbHVlLHBvcysxKTtcblx0XHRpZiAocG9zKzU+Y3VyKSBjdXI9cG9zKzU7XG5cdFx0cmV0dXJuIDU7XG5cdH1cblx0dmFyIHdyaXRlVUk4PWZ1bmN0aW9uKHZhbHVlLHBvcykge1xuXHRcdGRidWYud3JpdGUoRFQudWludDgscG9zLDEsJ3V0ZjgnKTtcblx0XHRkYnVmLndyaXRlVUludDgodmFsdWUscG9zKzEpO1xuXHRcdGlmIChwb3MrMj5jdXIpIGN1cj1wb3MrMjtcblx0XHRyZXR1cm4gMjtcblx0fVxuXHR2YXIgd3JpdGVCb29sPWZ1bmN0aW9uKHZhbHVlLHBvcykge1xuXHRcdGRidWYud3JpdGUoRFQuYm9vbCxwb3MsMSwndXRmOCcpO1xuXHRcdGRidWYud3JpdGVVSW50OChOdW1iZXIodmFsdWUpLHBvcysxKTtcblx0XHRpZiAocG9zKzI+Y3VyKSBjdXI9cG9zKzI7XG5cdFx0cmV0dXJuIDI7XG5cdH1cdFx0XG5cdHZhciB3cml0ZUJsb2I9ZnVuY3Rpb24odmFsdWUscG9zKSB7XG5cdFx0ZGJ1Zi53cml0ZShEVC5ibG9iLHBvcywxLCd1dGY4Jyk7XG5cdFx0dmFsdWUuY29weShkYnVmLCBwb3MrMSk7XG5cdFx0dmFyIHdyaXR0ZW49dmFsdWUubGVuZ3RoKzE7XG5cdFx0aWYgKHBvcyt3cml0dGVuPmN1cikgY3VyPXBvcyt3cml0dGVuO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XHRcdFxuXHQvKiBubyBzaWduYXR1cmUgKi9cblx0dmFyIHdyaXRlRml4ZWRBcnJheSA9IGZ1bmN0aW9uKHZhbHVlLHBvcyx1bml0c2l6ZSkge1xuXHRcdC8vY29uc29sZS5sb2coJ3YubGVuJyx2YWx1ZS5sZW5ndGgsaXRlbXMubGVuZ3RoLHVuaXRzaXplKTtcblx0XHRpZiAodW5pdHNpemU9PT0xKSB2YXIgZnVuYz1kYnVmLndyaXRlVUludDg7XG5cdFx0ZWxzZSBpZiAodW5pdHNpemU9PT00KXZhciBmdW5jPWRidWYud3JpdGVJbnQzMkJFO1xuXHRcdGVsc2UgdGhyb3cgJ3Vuc3VwcG9ydGVkIGludGVnZXIgc2l6ZSc7XG5cdFx0aWYgKCF2YWx1ZS5sZW5ndGgpIHtcblx0XHRcdHRocm93IFwiZW1wdHkgZml4ZWQgYXJyYXkgXCIra2V5X3dyaXRpbmc7XG5cdFx0fVxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoIDsgaSsrKSB7XG5cdFx0XHRmdW5jLmFwcGx5KGRidWYsW3ZhbHVlW2ldLGkqdW5pdHNpemUrcG9zXSlcblx0XHR9XG5cdFx0dmFyIGxlbj11bml0c2l6ZSp2YWx1ZS5sZW5ndGg7XG5cdFx0aWYgKHBvcytsZW4+Y3VyKSBjdXI9cG9zK2xlbjtcblx0XHRyZXR1cm4gbGVuO1xuXHR9XG5cblx0dGhpcy53cml0ZUkzMj13cml0ZUkzMjtcblx0dGhpcy53cml0ZUJvb2w9d3JpdGVCb29sO1xuXHR0aGlzLndyaXRlQmxvYj13cml0ZUJsb2I7XG5cdHRoaXMud3JpdGVVSTg9d3JpdGVVSTg7XG5cdHRoaXMud3JpdGVTdHJpbmc9d3JpdGVTdHJpbmc7XG5cdHRoaXMud3JpdGVTaWduYXR1cmU9d3JpdGVTaWduYXR1cmU7XG5cdHRoaXMud3JpdGVPZmZzZXQ9d3JpdGVPZmZzZXQ7IC8vNSBieXRlcyBvZmZzZXRcblx0dGhpcy53cml0ZVN0cmluZ0FycmF5PXdyaXRlU3RyaW5nQXJyYXk7XG5cdHRoaXMud3JpdGVGaXhlZEFycmF5PXdyaXRlRml4ZWRBcnJheTtcblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KHRoaXMsIFwiYnVmXCIsIHtnZXQgOiBmdW5jdGlvbigpeyByZXR1cm4gZGJ1ZjsgfX0pO1xuXHRcblx0cmV0dXJuIHRoaXM7XG59XG5cbnZhciBDcmVhdGU9ZnVuY3Rpb24ocGF0aCxvcHRzKSB7XG5cdG9wdHM9b3B0c3x8e307XG5cdHZhciBrZnM9bmV3IEtmcyhwYXRoLG9wdHMpO1xuXHR2YXIgY3VyPTA7XG5cblx0dmFyIGhhbmRsZT17fTtcblx0XG5cdC8vbm8gc2lnbmF0dXJlXG5cdHZhciB3cml0ZVZJbnQgPWZ1bmN0aW9uKGFycikge1xuXHRcdHZhciBvPXBhY2tfaW50KGFycixmYWxzZSk7XG5cdFx0a2ZzLndyaXRlRml4ZWRBcnJheShvLGN1ciwxKTtcblx0XHRjdXIrPW8ubGVuZ3RoO1xuXHR9XG5cdHZhciB3cml0ZVZJbnQxPWZ1bmN0aW9uKHZhbHVlKSB7XG5cdFx0d3JpdGVWSW50KFt2YWx1ZV0pO1xuXHR9XG5cdC8vZm9yIHBvc3RpbmdzXG5cdHZhciB3cml0ZVBJbnQgPWZ1bmN0aW9uKGFycikge1xuXHRcdHZhciBvPXBhY2tfaW50KGFycix0cnVlKTtcblx0XHRrZnMud3JpdGVGaXhlZEFycmF5KG8sY3VyLDEpO1xuXHRcdGN1cis9by5sZW5ndGg7XG5cdH1cblx0XG5cdHZhciBzYXZlVkludCA9IGZ1bmN0aW9uKGFycixrZXkpIHtcblx0XHR2YXIgc3RhcnQ9Y3VyO1xuXHRcdGtleV93cml0aW5nPWtleTtcblx0XHRjdXIrPWtmcy53cml0ZVNpZ25hdHVyZShEVC52aW50LGN1cik7XG5cdFx0d3JpdGVWSW50KGFycik7XG5cdFx0dmFyIHdyaXR0ZW4gPSBjdXItc3RhcnQ7XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1x0XHRcblx0fVxuXHR2YXIgc2F2ZVBJbnQgPSBmdW5jdGlvbihhcnIsa2V5KSB7XG5cdFx0dmFyIHN0YXJ0PWN1cjtcblx0XHRrZXlfd3JpdGluZz1rZXk7XG5cdFx0Y3VyKz1rZnMud3JpdGVTaWduYXR1cmUoRFQucGludCxjdXIpO1xuXHRcdHdyaXRlUEludChhcnIpO1xuXHRcdHZhciB3cml0dGVuID0gY3VyLXN0YXJ0O1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcdFxuXHR9XG5cblx0XG5cdHZhciBzYXZlVUk4ID0gZnVuY3Rpb24odmFsdWUsa2V5KSB7XG5cdFx0dmFyIHdyaXR0ZW49a2ZzLndyaXRlVUk4KHZhbHVlLGN1cik7XG5cdFx0Y3VyKz13cml0dGVuO1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVxuXHR2YXIgc2F2ZUJvb2w9ZnVuY3Rpb24odmFsdWUsa2V5KSB7XG5cdFx0dmFyIHdyaXR0ZW49a2ZzLndyaXRlQm9vbCh2YWx1ZSxjdXIpO1xuXHRcdGN1cis9d3JpdHRlbjtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cblx0dmFyIHNhdmVJMzIgPSBmdW5jdGlvbih2YWx1ZSxrZXkpIHtcblx0XHR2YXIgd3JpdHRlbj1rZnMud3JpdGVJMzIodmFsdWUsY3VyKTtcblx0XHRjdXIrPXdyaXR0ZW47XG5cdFx0cHVzaGl0ZW0oa2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XHRcblx0dmFyIHNhdmVTdHJpbmcgPSBmdW5jdGlvbih2YWx1ZSxrZXksZW5jb2RpbmcpIHtcblx0XHRlbmNvZGluZz1lbmNvZGluZ3x8c3RyaW5nZW5jb2Rpbmc7XG5cdFx0a2V5X3dyaXRpbmc9a2V5O1xuXHRcdHZhciB3cml0dGVuPWtmcy53cml0ZVN0cmluZyh2YWx1ZSxjdXIsZW5jb2RpbmcpO1xuXHRcdGN1cis9d3JpdHRlbjtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cblx0dmFyIHNhdmVTdHJpbmdBcnJheSA9IGZ1bmN0aW9uKGFycixrZXksZW5jb2RpbmcpIHtcblx0XHRlbmNvZGluZz1lbmNvZGluZ3x8c3RyaW5nZW5jb2Rpbmc7XG5cdFx0a2V5X3dyaXRpbmc9a2V5O1xuXHRcdHRyeSB7XG5cdFx0XHR2YXIgd3JpdHRlbj1rZnMud3JpdGVTdHJpbmdBcnJheShhcnIsY3VyLGVuY29kaW5nKTtcblx0XHR9IGNhdGNoKGUpIHtcblx0XHRcdHRocm93IGU7XG5cdFx0fVxuXHRcdGN1cis9d3JpdHRlbjtcblx0XHRwdXNoaXRlbShrZXksd3JpdHRlbik7XG5cdFx0cmV0dXJuIHdyaXR0ZW47XG5cdH1cblx0XG5cdHZhciBzYXZlQmxvYiA9IGZ1bmN0aW9uKHZhbHVlLGtleSkge1xuXHRcdGtleV93cml0aW5nPWtleTtcblx0XHR2YXIgd3JpdHRlbj1rZnMud3JpdGVCbG9iKHZhbHVlLGN1cik7XG5cdFx0Y3VyKz13cml0dGVuO1xuXHRcdHB1c2hpdGVtKGtleSx3cml0dGVuKTtcblx0XHRyZXR1cm4gd3JpdHRlbjtcblx0fVxuXG5cdHZhciBmb2xkZXJzPVtdO1xuXHR2YXIgcHVzaGl0ZW09ZnVuY3Rpb24oa2V5LHdyaXR0ZW4pIHtcblx0XHR2YXIgZm9sZGVyPWZvbGRlcnNbZm9sZGVycy5sZW5ndGgtMV07XHRcblx0XHRpZiAoIWZvbGRlcikgcmV0dXJuIDtcblx0XHRmb2xkZXIuaXRlbXNsZW5ndGgucHVzaCh3cml0dGVuKTtcblx0XHRpZiAoa2V5KSB7XG5cdFx0XHRpZiAoIWZvbGRlci5rZXlzKSB0aHJvdyAnY2Fubm90IGhhdmUga2V5IGluIGFycmF5Jztcblx0XHRcdGZvbGRlci5rZXlzLnB1c2goa2V5KTtcblx0XHR9XG5cdH1cdFxuXHR2YXIgb3BlbiA9IGZ1bmN0aW9uKG9wdCkge1xuXHRcdHZhciBzdGFydD1jdXI7XG5cdFx0dmFyIGtleT1vcHQua2V5IHx8IG51bGw7XG5cdFx0dmFyIHR5cGU9b3B0LnR5cGV8fERULmFycmF5O1xuXHRcdGN1cis9a2ZzLndyaXRlU2lnbmF0dXJlKHR5cGUsY3VyKTtcblx0XHRjdXIrPWtmcy53cml0ZU9mZnNldCgweDAsY3VyKTsgLy8gcHJlLWFsbG9jIHNwYWNlIGZvciBvZmZzZXRcblx0XHR2YXIgZm9sZGVyPXtcblx0XHRcdHR5cGU6dHlwZSwga2V5OmtleSxcblx0XHRcdHN0YXJ0OnN0YXJ0LGRhdGFzdGFydDpjdXIsXG5cdFx0XHRpdGVtc2xlbmd0aDpbXSB9O1xuXHRcdGlmICh0eXBlPT09RFQub2JqZWN0KSBmb2xkZXIua2V5cz1bXTtcblx0XHRmb2xkZXJzLnB1c2goZm9sZGVyKTtcblx0fVxuXHR2YXIgb3Blbk9iamVjdCA9IGZ1bmN0aW9uKGtleSkge1xuXHRcdG9wZW4oe3R5cGU6RFQub2JqZWN0LGtleTprZXl9KTtcblx0fVxuXHR2YXIgb3BlbkFycmF5ID0gZnVuY3Rpb24oa2V5KSB7XG5cdFx0b3Blbih7dHlwZTpEVC5hcnJheSxrZXk6a2V5fSk7XG5cdH1cblx0dmFyIHNhdmVJbnRzPWZ1bmN0aW9uKGFycixrZXksZnVuYykge1xuXHRcdGZ1bmMuYXBwbHkoaGFuZGxlLFthcnIsa2V5XSk7XG5cdH1cblx0dmFyIGNsb3NlID0gZnVuY3Rpb24ob3B0KSB7XG5cdFx0aWYgKCFmb2xkZXJzLmxlbmd0aCkgdGhyb3cgJ2VtcHR5IHN0YWNrJztcblx0XHR2YXIgZm9sZGVyPWZvbGRlcnMucG9wKCk7XG5cdFx0Ly9qdW1wIHRvIGxlbmd0aHMgYW5kIGtleXNcblx0XHRrZnMud3JpdGVPZmZzZXQoIGN1ci1mb2xkZXIuZGF0YXN0YXJ0LCBmb2xkZXIuZGF0YXN0YXJ0LTUpO1xuXHRcdHZhciBpdGVtY291bnQ9Zm9sZGVyLml0ZW1zbGVuZ3RoLmxlbmd0aDtcblx0XHQvL3NhdmUgbGVuZ3Roc1xuXHRcdHdyaXRlVkludDEoaXRlbWNvdW50KTtcblx0XHR3cml0ZVZJbnQoZm9sZGVyLml0ZW1zbGVuZ3RoKTtcblx0XHRcblx0XHRpZiAoZm9sZGVyLnR5cGU9PT1EVC5vYmplY3QpIHtcblx0XHRcdC8vdXNlIHV0ZjggZm9yIGtleXNcblx0XHRcdGN1cis9a2ZzLndyaXRlU3RyaW5nQXJyYXkoZm9sZGVyLmtleXMsY3VyLCd1dGY4Jyk7XG5cdFx0fVxuXHRcdHdyaXR0ZW49Y3VyLWZvbGRlci5zdGFydDtcblx0XHRwdXNoaXRlbShmb2xkZXIua2V5LHdyaXR0ZW4pO1xuXHRcdHJldHVybiB3cml0dGVuO1xuXHR9XG5cdFxuXHRcblx0dmFyIHN0cmluZ2VuY29kaW5nPSd1Y3MyJztcblx0dmFyIHN0cmluZ0VuY29kaW5nPWZ1bmN0aW9uKG5ld2VuY29kaW5nKSB7XG5cdFx0aWYgKG5ld2VuY29kaW5nKSBzdHJpbmdlbmNvZGluZz1uZXdlbmNvZGluZztcblx0XHRlbHNlIHJldHVybiBzdHJpbmdlbmNvZGluZztcblx0fVxuXHRcblx0dmFyIGFsbG51bWJlcl9mYXN0PWZ1bmN0aW9uKGFycikge1xuXHRcdGlmIChhcnIubGVuZ3RoPDUpIHJldHVybiBhbGxudW1iZXIoYXJyKTtcblx0XHRpZiAodHlwZW9mIGFyclswXT09J251bWJlcidcblx0XHQgICAgJiYgTWF0aC5yb3VuZChhcnJbMF0pPT1hcnJbMF0gJiYgYXJyWzBdPj0wKVxuXHRcdFx0cmV0dXJuIHRydWU7XG5cdFx0cmV0dXJuIGZhbHNlO1xuXHR9XG5cdHZhciBhbGxzdHJpbmdfZmFzdD1mdW5jdGlvbihhcnIpIHtcblx0XHRpZiAoYXJyLmxlbmd0aDw1KSByZXR1cm4gYWxsc3RyaW5nKGFycik7XG5cdFx0aWYgKHR5cGVvZiBhcnJbMF09PSdzdHJpbmcnKSByZXR1cm4gdHJ1ZTtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cdFxuXHR2YXIgYWxsbnVtYmVyPWZ1bmN0aW9uKGFycikge1xuXHRcdGZvciAodmFyIGk9MDtpPGFyci5sZW5ndGg7aSsrKSB7XG5cdFx0XHRpZiAodHlwZW9mIGFycltpXSE9PSdudW1iZXInKSByZXR1cm4gZmFsc2U7XG5cdFx0fVxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cdHZhciBhbGxzdHJpbmc9ZnVuY3Rpb24oYXJyKSB7XG5cdFx0Zm9yICh2YXIgaT0wO2k8YXJyLmxlbmd0aDtpKyspIHtcblx0XHRcdGlmICh0eXBlb2YgYXJyW2ldIT09J3N0cmluZycpIHJldHVybiBmYWxzZTtcblx0XHR9XG5cdFx0cmV0dXJuIHRydWU7XG5cdH1cblx0dmFyIGdldEVuY29kaW5nPWZ1bmN0aW9uKGtleSxlbmNzKSB7XG5cdFx0dmFyIGVuYz1lbmNzW2tleV07XG5cdFx0aWYgKCFlbmMpIHJldHVybiBudWxsO1xuXHRcdGlmIChlbmM9PSdkZWx0YScgfHwgZW5jPT0ncG9zdGluZycpIHtcblx0XHRcdHJldHVybiBzYXZlUEludDtcblx0XHR9IGVsc2UgaWYgKGVuYz09XCJ2YXJpYWJsZVwiKSB7XG5cdFx0XHRyZXR1cm4gc2F2ZVZJbnQ7XG5cdFx0fVxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cdHZhciBzYXZlPWZ1bmN0aW9uKEosa2V5LG9wdHMpIHtcblx0XHRvcHRzPW9wdHN8fHt9O1xuXHRcdFxuXHRcdGlmICh0eXBlb2YgSj09XCJudWxsXCIgfHwgdHlwZW9mIEo9PVwidW5kZWZpbmVkXCIpIHtcblx0XHRcdHRocm93ICdjYW5ub3Qgc2F2ZSBudWxsIHZhbHVlIG9mIFsnK2tleSsnXSBmb2xkZXJzJytKU09OLnN0cmluZ2lmeShmb2xkZXJzKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dmFyIHR5cGU9Si5jb25zdHJ1Y3Rvci5uYW1lO1xuXHRcdGlmICh0eXBlPT09J09iamVjdCcpIHtcblx0XHRcdG9wZW5PYmplY3Qoa2V5KTtcblx0XHRcdGZvciAodmFyIGkgaW4gSikge1xuXHRcdFx0XHRzYXZlKEpbaV0saSxvcHRzKTtcblx0XHRcdFx0aWYgKG9wdHMuYXV0b2RlbGV0ZSkgZGVsZXRlIEpbaV07XG5cdFx0XHR9XG5cdFx0XHRjbG9zZSgpO1xuXHRcdH0gZWxzZSBpZiAodHlwZT09PSdBcnJheScpIHtcblx0XHRcdGlmIChhbGxudW1iZXJfZmFzdChKKSkge1xuXHRcdFx0XHRpZiAoSi5zb3J0ZWQpIHsgLy9udW1iZXIgYXJyYXkgaXMgc29ydGVkXG5cdFx0XHRcdFx0c2F2ZUludHMoSixrZXksc2F2ZVBJbnQpO1x0Ly9wb3N0aW5nIGRlbHRhIGZvcm1hdFxuXHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdHNhdmVJbnRzKEosa2V5LHNhdmVWSW50KTtcdFxuXHRcdFx0XHR9XG5cdFx0XHR9IGVsc2UgaWYgKGFsbHN0cmluZ19mYXN0KEopKSB7XG5cdFx0XHRcdHNhdmVTdHJpbmdBcnJheShKLGtleSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRvcGVuQXJyYXkoa2V5KTtcblx0XHRcdFx0Zm9yICh2YXIgaT0wO2k8Si5sZW5ndGg7aSsrKSB7XG5cdFx0XHRcdFx0c2F2ZShKW2ldLG51bGwsb3B0cyk7XG5cdFx0XHRcdFx0aWYgKG9wdHMuYXV0b2RlbGV0ZSkgZGVsZXRlIEpbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0Y2xvc2UoKTtcblx0XHRcdH1cblx0XHR9IGVsc2UgaWYgKHR5cGU9PT0nU3RyaW5nJykge1xuXHRcdFx0c2F2ZVN0cmluZyhKLGtleSk7XG5cdFx0fSBlbHNlIGlmICh0eXBlPT09J051bWJlcicpIHtcblx0XHRcdGlmIChKPj0wJiZKPDI1Nikgc2F2ZVVJOChKLGtleSk7XG5cdFx0XHRlbHNlIHNhdmVJMzIoSixrZXkpO1xuXHRcdH0gZWxzZSBpZiAodHlwZT09PSdCb29sZWFuJykge1xuXHRcdFx0c2F2ZUJvb2woSixrZXkpO1xuXHRcdH0gZWxzZSBpZiAodHlwZT09PSdCdWZmZXInKSB7XG5cdFx0XHRzYXZlQmxvYihKLGtleSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHRocm93ICd1bnN1cHBvcnRlZCB0eXBlICcrdHlwZTtcblx0XHR9XG5cdH1cblx0XG5cdHZhciBmcmVlPWZ1bmN0aW9uKCkge1xuXHRcdHdoaWxlIChmb2xkZXJzLmxlbmd0aCkgY2xvc2UoKTtcblx0XHRrZnMuZnJlZSgpO1xuXHR9XG5cdHZhciBjdXJyZW50c2l6ZT1mdW5jdGlvbigpIHtcblx0XHRyZXR1cm4gY3VyO1xuXHR9XG5cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGhhbmRsZSwgXCJzaXplXCIsIHtnZXQgOiBmdW5jdGlvbigpeyByZXR1cm4gY3VyOyB9fSk7XG5cblx0dmFyIHdyaXRlRmlsZT1mdW5jdGlvbihmbixvcHRzLGNiKSB7XG5cdFx0aWYgKHR5cGVvZiBmcz09XCJ1bmRlZmluZWRcIikge1xuXHRcdFx0dmFyIGZzPW9wdHMuZnN8fHJlcXVpcmUoJ2ZzJyk7XHRcblx0XHR9XG5cdFx0dmFyIHRvdGFsYnl0ZT1oYW5kbGUuY3VycmVudHNpemUoKTtcblx0XHR2YXIgd3JpdHRlbj0wLGJhdGNoPTA7XG5cdFx0XG5cdFx0aWYgKHR5cGVvZiBjYj09XCJ1bmRlZmluZWRcIiB8fCB0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSB7XG5cdFx0XHRjYj1vcHRzO1xuXHRcdH1cblx0XHRvcHRzPW9wdHN8fHt9O1xuXHRcdGJhdGNoc2l6ZT1vcHRzLmJhdGNoc2l6ZXx8MTAyNCoxMDI0KjE2OyAvLzE2IE1CXG5cblx0XHRpZiAoZnMuZXhpc3RzU3luYyhmbikpIGZzLnVubGlua1N5bmMoZm4pO1xuXG5cdFx0dmFyIHdyaXRlQ2I9ZnVuY3Rpb24odG90YWwsd3JpdHRlbixjYixuZXh0KSB7XG5cdFx0XHRyZXR1cm4gZnVuY3Rpb24oZXJyKSB7XG5cdFx0XHRcdGlmIChlcnIpIHRocm93IFwid3JpdGUgZXJyb3JcIitlcnI7XG5cdFx0XHRcdGNiKHRvdGFsLHdyaXR0ZW4pO1xuXHRcdFx0XHRiYXRjaCsrO1xuXHRcdFx0XHRuZXh0KCk7XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0dmFyIG5leHQ9ZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoYmF0Y2g8YmF0Y2hlcykge1xuXHRcdFx0XHR2YXIgYnVmc3RhcnQ9YmF0Y2hzaXplKmJhdGNoO1xuXHRcdFx0XHR2YXIgYnVmZW5kPWJ1ZnN0YXJ0K2JhdGNoc2l6ZTtcblx0XHRcdFx0aWYgKGJ1ZmVuZD50b3RhbGJ5dGUpIGJ1ZmVuZD10b3RhbGJ5dGU7XG5cdFx0XHRcdHZhciBzbGljZWQ9a2ZzLmJ1Zi5zbGljZShidWZzdGFydCxidWZlbmQpO1xuXHRcdFx0XHR3cml0dGVuKz1zbGljZWQubGVuZ3RoO1xuXHRcdFx0XHRmcy5hcHBlbmRGaWxlKGZuLHNsaWNlZCx3cml0ZUNiKHRvdGFsYnl0ZSx3cml0dGVuLCBjYixuZXh0KSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdHZhciBiYXRjaGVzPTErTWF0aC5mbG9vcihoYW5kbGUuc2l6ZS9iYXRjaHNpemUpO1xuXHRcdG5leHQoKTtcblx0fVxuXHRoYW5kbGUuZnJlZT1mcmVlO1xuXHRoYW5kbGUuc2F2ZUkzMj1zYXZlSTMyO1xuXHRoYW5kbGUuc2F2ZVVJOD1zYXZlVUk4O1xuXHRoYW5kbGUuc2F2ZUJvb2w9c2F2ZUJvb2w7XG5cdGhhbmRsZS5zYXZlU3RyaW5nPXNhdmVTdHJpbmc7XG5cdGhhbmRsZS5zYXZlVkludD1zYXZlVkludDtcblx0aGFuZGxlLnNhdmVQSW50PXNhdmVQSW50O1xuXHRoYW5kbGUuc2F2ZUludHM9c2F2ZUludHM7XG5cdGhhbmRsZS5zYXZlQmxvYj1zYXZlQmxvYjtcblx0aGFuZGxlLnNhdmU9c2F2ZTtcblx0aGFuZGxlLm9wZW5BcnJheT1vcGVuQXJyYXk7XG5cdGhhbmRsZS5vcGVuT2JqZWN0PW9wZW5PYmplY3Q7XG5cdGhhbmRsZS5zdHJpbmdFbmNvZGluZz1zdHJpbmdFbmNvZGluZztcblx0Ly90aGlzLmludGVnZXJFbmNvZGluZz1pbnRlZ2VyRW5jb2Rpbmc7XG5cdGhhbmRsZS5jbG9zZT1jbG9zZTtcblx0aGFuZGxlLndyaXRlRmlsZT13cml0ZUZpbGU7XG5cdGhhbmRsZS5jdXJyZW50c2l6ZT1jdXJyZW50c2l6ZTtcblx0cmV0dXJuIGhhbmRsZTtcbn1cblxubW9kdWxlLmV4cG9ydHM9Q3JlYXRlOyIsIi8qXG4gIFRPRE9cbiAgYW5kIG5vdFxuXG4qL1xuXG4vLyBodHRwOi8vanNmaWRkbGUubmV0L25lb3N3Zi9hWHpXdy9cbnZhciBwbGlzdD1yZXF1aXJlKCcuL3BsaXN0Jyk7XG5mdW5jdGlvbiBpbnRlcnNlY3QoSSwgSikge1xuICB2YXIgaSA9IGogPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUoIGkgPCBJLmxlbmd0aCAmJiBqIDwgSi5sZW5ndGggKXtcbiAgICAgaWYgICAgICAoSVtpXSA8IEpbal0pIGkrKzsgXG4gICAgIGVsc2UgaWYgKElbaV0gPiBKW2pdKSBqKys7IFxuICAgICBlbHNlIHtcbiAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF09bFtpXTtcbiAgICAgICBpKys7aisrO1xuICAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyogcmV0dXJuIGFsbCBpdGVtcyBpbiBJIGJ1dCBub3QgaW4gSiAqL1xuZnVuY3Rpb24gc3VidHJhY3QoSSwgSikge1xuICB2YXIgaSA9IGogPSAwO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgd2hpbGUoIGkgPCBJLmxlbmd0aCAmJiBqIDwgSi5sZW5ndGggKXtcbiAgICBpZiAoSVtpXT09SltqXSkge1xuICAgICAgaSsrO2orKztcbiAgICB9IGVsc2UgaWYgKElbaV08SltqXSkge1xuICAgICAgd2hpbGUgKElbaV08SltqXSkgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPSBJW2krK107XG4gICAgfSBlbHNlIHtcbiAgICAgIHdoaWxlKEpbal08SVtpXSkgaisrO1xuICAgIH1cbiAgfVxuXG4gIGlmIChqPT1KLmxlbmd0aCkge1xuICAgIHdoaWxlIChpPEkubGVuZ3RoKSByZXN1bHRbcmVzdWx0Lmxlbmd0aF09SVtpKytdO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxudmFyIHVuaW9uPWZ1bmN0aW9uKGEsYikge1xuXHRpZiAoIWEgfHwgIWEubGVuZ3RoKSByZXR1cm4gYjtcblx0aWYgKCFiIHx8ICFiLmxlbmd0aCkgcmV0dXJuIGE7XG4gICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgIHZhciBhaSA9IDA7XG4gICAgdmFyIGJpID0gMDtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICBpZiAoIGFpIDwgYS5sZW5ndGggJiYgYmkgPCBiLmxlbmd0aCkge1xuICAgICAgICAgICAgaWYgKGFbYWldIDwgYltiaV0pIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF09YVthaV07XG4gICAgICAgICAgICAgICAgYWkrKztcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoYVthaV0gPiBiW2JpXSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdFtyZXN1bHQubGVuZ3RoXT1iW2JpXTtcbiAgICAgICAgICAgICAgICBiaSsrO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbcmVzdWx0Lmxlbmd0aF09YVthaV07XG4gICAgICAgICAgICAgICAgcmVzdWx0W3Jlc3VsdC5sZW5ndGhdPWJbYmldO1xuICAgICAgICAgICAgICAgIGFpKys7XG4gICAgICAgICAgICAgICAgYmkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIGlmIChhaSA8IGEubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIGEuc2xpY2UoYWksIGEubGVuZ3RoKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIGlmIChiaSA8IGIubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaC5hcHBseShyZXN1bHQsIGIuc2xpY2UoYmksIGIubGVuZ3RoKSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG52YXIgT1BFUkFUSU9OPXsnaW5jbHVkZSc6aW50ZXJzZWN0LCAndW5pb24nOnVuaW9uLCAnZXhjbHVkZSc6c3VidHJhY3R9O1xuXG52YXIgYm9vbFNlYXJjaD1mdW5jdGlvbihvcHRzKSB7XG4gIG9wdHM9b3B0c3x8e307XG4gIG9wcz1vcHRzLm9wfHx0aGlzLm9wdHMub3A7XG4gIHRoaXMuZG9jcz1bXTtcblx0aWYgKCF0aGlzLnBocmFzZXMubGVuZ3RoKSByZXR1cm47XG5cdHZhciByPXRoaXMucGhyYXNlc1swXS5kb2NzO1xuICAvKiBpZ25vcmUgb3BlcmF0b3Igb2YgZmlyc3QgcGhyYXNlICovXG5cdGZvciAodmFyIGk9MTtpPHRoaXMucGhyYXNlcy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIG9wPSBvcHNbaV0gfHwgJ3VuaW9uJztcblx0XHRyPU9QRVJBVElPTltvcF0ocix0aGlzLnBocmFzZXNbaV0uZG9jcyk7XG5cdH1cblx0dGhpcy5kb2NzPXBsaXN0LnVuaXF1ZShyKTtcblx0cmV0dXJuIHRoaXM7XG59XG5tb2R1bGUuZXhwb3J0cz17c2VhcmNoOmJvb2xTZWFyY2h9IiwiYXJndW1lbnRzWzRdW1wiL1VzZXJzL3l1L2tzYW5hMjAxNS9ub2RlX21vZHVsZXMva3NhbmEtZGF0YWJhc2UvYnNlYXJjaC5qc1wiXVswXS5hcHBseShleHBvcnRzLGFyZ3VtZW50cykiLCJ2YXIgcGxpc3Q9cmVxdWlyZShcIi4vcGxpc3RcIik7XG5cbnZhciBnZXRQaHJhc2VXaWR0aHM9ZnVuY3Rpb24gKFEscGhyYXNlaWQsdnBvc3MpIHtcblx0dmFyIHJlcz1bXTtcblx0Zm9yICh2YXIgaSBpbiB2cG9zcykge1xuXHRcdHJlcy5wdXNoKGdldFBocmFzZVdpZHRoKFEscGhyYXNlaWQsdnBvc3NbaV0pKTtcblx0fVxuXHRyZXR1cm4gcmVzO1xufVxudmFyIGdldFBocmFzZVdpZHRoPWZ1bmN0aW9uIChRLHBocmFzZWlkLHZwb3MpIHtcblx0dmFyIFA9US5waHJhc2VzW3BocmFzZWlkXTtcblx0dmFyIHdpZHRoPTAsdmFyd2lkdGg9ZmFsc2U7XG5cdGlmIChQLndpZHRoKSByZXR1cm4gUC53aWR0aDsgLy8gbm8gd2lsZGNhcmRcblx0aWYgKFAudGVybWlkLmxlbmd0aDwyKSByZXR1cm4gUC50ZXJtbGVuZ3RoWzBdO1xuXHR2YXIgbGFzdHRlcm1wb3N0aW5nPVEudGVybXNbUC50ZXJtaWRbUC50ZXJtaWQubGVuZ3RoLTFdXS5wb3N0aW5nO1xuXG5cdGZvciAodmFyIGkgaW4gUC50ZXJtaWQpIHtcblx0XHR2YXIgVD1RLnRlcm1zW1AudGVybWlkW2ldXTtcblx0XHRpZiAoVC5vcD09J3dpbGRjYXJkJykge1xuXHRcdFx0d2lkdGgrPVQud2lkdGg7XG5cdFx0XHRpZiAoVC53aWxkY2FyZD09JyonKSB2YXJ3aWR0aD10cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR3aWR0aCs9UC50ZXJtbGVuZ3RoW2ldO1xuXHRcdH1cblx0fVxuXHRpZiAodmFyd2lkdGgpIHsgLy93aWR0aCBtaWdodCBiZSBzbWFsbGVyIGR1ZSB0byAqIHdpbGRjYXJkXG5cdFx0dmFyIGF0PXBsaXN0LmluZGV4T2ZTb3J0ZWQobGFzdHRlcm1wb3N0aW5nLHZwb3MpO1xuXHRcdHZhciBlbmRwb3M9bGFzdHRlcm1wb3N0aW5nW2F0XTtcblx0XHRpZiAoZW5kcG9zLXZwb3M8d2lkdGgpIHdpZHRoPWVuZHBvcy12cG9zKzE7XG5cdH1cblxuXHRyZXR1cm4gd2lkdGg7XG59XG4vKiByZXR1cm4gW3Zwb3MsIHBocmFzZWlkLCBwaHJhc2V3aWR0aCwgb3B0aW9uYWxfdGFnbmFtZV0gYnkgc2xvdCByYW5nZSovXG52YXIgaGl0SW5SYW5nZT1mdW5jdGlvbihRLHN0YXJ0dnBvcyxlbmR2cG9zKSB7XG5cdHZhciByZXM9W107XG5cdGlmICghUSB8fCAhUS5yYXdyZXN1bHQgfHwgIVEucmF3cmVzdWx0Lmxlbmd0aCkgcmV0dXJuIHJlcztcblx0Zm9yICh2YXIgaT0wO2k8US5waHJhc2VzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgUD1RLnBocmFzZXNbaV07XG5cdFx0aWYgKCFQLnBvc3RpbmcpIGNvbnRpbnVlO1xuXHRcdHZhciBzPXBsaXN0LmluZGV4T2ZTb3J0ZWQoUC5wb3N0aW5nLHN0YXJ0dnBvcyk7XG5cdFx0dmFyIGU9cGxpc3QuaW5kZXhPZlNvcnRlZChQLnBvc3RpbmcsZW5kdnBvcyk7XG5cdFx0dmFyIHI9UC5wb3N0aW5nLnNsaWNlKHMsZSsxKTtcblx0XHR2YXIgd2lkdGg9Z2V0UGhyYXNlV2lkdGhzKFEsaSxyKTtcblxuXHRcdHJlcz1yZXMuY29uY2F0KHIubWFwKGZ1bmN0aW9uKHZwb3MsaWR4KXsgcmV0dXJuIFt2cG9zLHdpZHRoW2lkeF0saV0gfSkpO1xuXHR9XG5cdC8vIG9yZGVyIGJ5IHZwb3MsIGlmIHZwb3MgaXMgdGhlIHNhbWUsIGxhcmdlciB3aWR0aCBjb21lIGZpcnN0LlxuXHQvLyBzbyB0aGUgb3V0cHV0IHdpbGwgYmVcblx0Ly8gPHRhZzE+PHRhZzI+b25lPC90YWcyPnR3bzwvdGFnMT5cblx0Ly9UT0RPLCBtaWdodCBjYXVzZSBvdmVybGFwIGlmIHNhbWUgdnBvcyBhbmQgc2FtZSB3aWR0aFxuXHQvL25lZWQgdG8gY2hlY2sgdGFnIG5hbWVcblx0cmVzLnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYVswXT09YlswXT8gYlsxXS1hWzFdIDphWzBdLWJbMF19KTtcblxuXHRyZXR1cm4gcmVzO1xufVxuXG52YXIgdGFnc0luUmFuZ2U9ZnVuY3Rpb24oUSxyZW5kZXJUYWdzLHN0YXJ0dnBvcyxlbmR2cG9zKSB7XG5cdHZhciByZXM9W107XG5cdGlmICh0eXBlb2YgcmVuZGVyVGFncz09XCJzdHJpbmdcIikgcmVuZGVyVGFncz1bcmVuZGVyVGFnc107XG5cblx0cmVuZGVyVGFncy5tYXAoZnVuY3Rpb24odGFnKXtcblx0XHR2YXIgc3RhcnRzPVEuZW5naW5lLmdldChbXCJmaWVsZHNcIix0YWcrXCJfc3RhcnRcIl0pO1xuXHRcdHZhciBlbmRzPVEuZW5naW5lLmdldChbXCJmaWVsZHNcIix0YWcrXCJfZW5kXCJdKTtcblx0XHRpZiAoIXN0YXJ0cykgcmV0dXJuO1xuXG5cdFx0dmFyIHM9cGxpc3QuaW5kZXhPZlNvcnRlZChzdGFydHMsc3RhcnR2cG9zKTtcblx0XHR2YXIgZT1zO1xuXHRcdHdoaWxlIChlPHN0YXJ0cy5sZW5ndGggJiYgc3RhcnRzW2VdPGVuZHZwb3MpIGUrKztcblx0XHR2YXIgb3BlbnRhZ3M9c3RhcnRzLnNsaWNlKHMsZSk7XG5cblx0XHRzPXBsaXN0LmluZGV4T2ZTb3J0ZWQoZW5kcyxzdGFydHZwb3MpO1xuXHRcdGU9cztcblx0XHR3aGlsZSAoZTxlbmRzLmxlbmd0aCAmJiBlbmRzW2VdPGVuZHZwb3MpIGUrKztcblx0XHR2YXIgY2xvc2V0YWdzPWVuZHMuc2xpY2UocyxlKTtcblxuXHRcdG9wZW50YWdzLm1hcChmdW5jdGlvbihzdGFydCxpZHgpIHtcblx0XHRcdHJlcy5wdXNoKFtzdGFydCxjbG9zZXRhZ3NbaWR4XS1zdGFydCx0YWddKTtcblx0XHR9KVxuXHR9KTtcblx0Ly8gb3JkZXIgYnkgdnBvcywgaWYgdnBvcyBpcyB0aGUgc2FtZSwgbGFyZ2VyIHdpZHRoIGNvbWUgZmlyc3QuXG5cdHJlcy5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGFbMF09PWJbMF0/IGJbMV0tYVsxXSA6YVswXS1iWzBdfSk7XG5cblx0cmV0dXJuIHJlcztcbn1cblxuLypcbmdpdmVuIGEgdnBvcyByYW5nZSBzdGFydCwgZmlsZSwgY29udmVydCB0byBmaWxlc3RhcnQsIGZpbGVlbmRcbiAgIGZpbGVzdGFydCA6IHN0YXJ0aW5nIGZpbGVcbiAgIHN0YXJ0ICAgOiB2cG9zIHN0YXJ0XG4gICBzaG93ZmlsZTogaG93IG1hbnkgZmlsZXMgdG8gZGlzcGxheVxuICAgc2hvd3BhZ2U6IGhvdyBtYW55IHBhZ2VzIHRvIGRpc3BsYXlcblxub3V0cHV0OlxuICAgYXJyYXkgb2YgZmlsZWlkIHdpdGggaGl0c1xuKi9cbnZhciBnZXRGaWxlV2l0aEhpdHM9ZnVuY3Rpb24oZW5naW5lLFEscmFuZ2UpIHtcblx0dmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0dmFyIG91dD1bXSxmaWxlY291bnQ9MTAwO1xuXHR2YXIgc3RhcnQ9MCAsIGVuZD1RLmJ5RmlsZS5sZW5ndGg7XG5cdFEuZXhjZXJwdE92ZXJmbG93PWZhbHNlO1xuXHRpZiAocmFuZ2Uuc3RhcnQpIHtcblx0XHR2YXIgZmlyc3Q9cmFuZ2Uuc3RhcnQgO1xuXHRcdHZhciBsYXN0PXJhbmdlLmVuZDtcblx0XHRpZiAoIWxhc3QpIGxhc3Q9TnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cdFx0Zm9yICh2YXIgaT0wO2k8ZmlsZU9mZnNldHMubGVuZ3RoO2krKykge1xuXHRcdFx0Ly9pZiAoZmlsZU9mZnNldHNbaV0+Zmlyc3QpIGJyZWFrO1xuXHRcdFx0aWYgKGZpbGVPZmZzZXRzW2ldPmxhc3QpIHtcblx0XHRcdFx0ZW5kPWk7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKGZpbGVPZmZzZXRzW2ldPGZpcnN0KSBzdGFydD1pO1xuXHRcdH1cdFx0XG5cdH0gZWxzZSB7XG5cdFx0c3RhcnQ9cmFuZ2UuZmlsZXN0YXJ0IHx8IDA7XG5cdFx0aWYgKHJhbmdlLm1heGZpbGUpIHtcblx0XHRcdGZpbGVjb3VudD1yYW5nZS5tYXhmaWxlO1xuXHRcdH0gZWxzZSBpZiAocmFuZ2Uuc2hvd3BhZ2UpIHtcblx0XHRcdHRocm93IFwibm90IGltcGxlbWVudCB5ZXRcIlxuXHRcdH1cblx0fVxuXG5cdHZhciBmaWxlV2l0aEhpdHM9W10sdG90YWxoaXQ9MDtcblx0cmFuZ2UubWF4aGl0PXJhbmdlLm1heGhpdHx8MTAwMDtcblxuXHRmb3IgKHZhciBpPXN0YXJ0O2k8ZW5kO2krKykge1xuXHRcdGlmKFEuYnlGaWxlW2ldLmxlbmd0aD4wKSB7XG5cdFx0XHR0b3RhbGhpdCs9US5ieUZpbGVbaV0ubGVuZ3RoO1xuXHRcdFx0ZmlsZVdpdGhIaXRzLnB1c2goaSk7XG5cdFx0XHRyYW5nZS5uZXh0RmlsZVN0YXJ0PWk7XG5cdFx0XHRpZiAoZmlsZVdpdGhIaXRzLmxlbmd0aD49ZmlsZWNvdW50KSB7XG5cdFx0XHRcdFEuZXhjZXJwdE92ZXJmbG93PXRydWU7XG5cdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRvdGFsaGl0PnJhbmdlLm1heGhpdCkge1xuXHRcdFx0XHRRLmV4Y2VycHRPdmVyZmxvdz10cnVlO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cdH1cblx0aWYgKGk+PWVuZCkgeyAvL25vIG1vcmUgZmlsZVxuXHRcdFEuZXhjZXJwdFN0b3A9dHJ1ZTtcblx0fVxuXHRyZXR1cm4gZmlsZVdpdGhIaXRzO1xufVxudmFyIHJlc3VsdGxpc3Q9ZnVuY3Rpb24oZW5naW5lLFEsb3B0cyxjYikge1xuXHR2YXIgb3V0cHV0PVtdO1xuXHRpZiAoIVEucmF3cmVzdWx0IHx8ICFRLnJhd3Jlc3VsdC5sZW5ndGgpIHtcblx0XHRjYihvdXRwdXQpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdGlmIChvcHRzLnJhbmdlKSB7XG5cdFx0aWYgKG9wdHMucmFuZ2UubWF4aGl0ICYmICFvcHRzLnJhbmdlLm1heGZpbGUpIHtcblx0XHRcdG9wdHMucmFuZ2UubWF4ZmlsZT1vcHRzLnJhbmdlLm1heGhpdDtcblx0XHRcdG9wdHMucmFuZ2UubWF4cGFnZT1vcHRzLnJhbmdlLm1heGhpdDtcblx0XHR9XG5cdFx0aWYgKCFvcHRzLnJhbmdlLm1heHBhZ2UpIG9wdHMucmFuZ2UubWF4cGFnZT0xMDA7XG5cdFx0aWYgKCFvcHRzLnJhbmdlLmVuZCkge1xuXHRcdFx0b3B0cy5yYW5nZS5lbmQ9TnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cdFx0fVxuXHR9XG5cdHZhciBmaWxlV2l0aEhpdHM9Z2V0RmlsZVdpdGhIaXRzKGVuZ2luZSxRLG9wdHMucmFuZ2UpO1xuXHRpZiAoIWZpbGVXaXRoSGl0cy5sZW5ndGgpIHtcblx0XHRjYihvdXRwdXQpO1xuXHRcdHJldHVybjtcblx0fVxuXG5cdHZhciBvdXRwdXQ9W10sZmlsZXM9W107Ly90ZW1wb3JhcnkgaG9sZGVyIGZvciBwYWdlbmFtZXNcblx0Zm9yICh2YXIgaT0wO2k8ZmlsZVdpdGhIaXRzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgbmZpbGU9ZmlsZVdpdGhIaXRzW2ldO1xuXHRcdHZhciBwYWdlT2Zmc2V0cz1lbmdpbmUuZ2V0RmlsZVBhZ2VPZmZzZXRzKG5maWxlKTtcblx0XHR2YXIgcGFnZU5hbWVzPWVuZ2luZS5nZXRGaWxlUGFnZU5hbWVzKG5maWxlKTtcblx0XHRmaWxlc1tuZmlsZV09e3BhZ2VPZmZzZXRzOnBhZ2VPZmZzZXRzfTtcblx0XHR2YXIgcGFnZXdpdGhoaXQ9cGxpc3QuZ3JvdXBieXBvc3RpbmcyKFEuYnlGaWxlWyBuZmlsZSBdLCAgcGFnZU9mZnNldHMpO1xuXHRcdC8vaWYgKHBhZ2VPZmZzZXRzWzBdPT0xKVxuXHRcdC8vcGFnZXdpdGhoaXQuc2hpZnQoKTsgLy90aGUgZmlyc3QgaXRlbSBpcyBub3QgdXNlZCAoMH5RLmJ5RmlsZVswXSApXG5cblx0XHRmb3IgKHZhciBqPTA7IGo8cGFnZXdpdGhoaXQubGVuZ3RoO2orKykge1xuXHRcdFx0aWYgKCFwYWdld2l0aGhpdFtqXS5sZW5ndGgpIGNvbnRpbnVlO1xuXHRcdFx0Ly92YXIgb2Zmc2V0cz1wYWdld2l0aGhpdFtqXS5tYXAoZnVuY3Rpb24ocCl7cmV0dXJuIHAtIGZpbGVPZmZzZXRzW2ldfSk7XG5cdFx0XHRpZiAocGFnZU9mZnNldHNbal0+b3B0cy5yYW5nZS5lbmQpIGJyZWFrO1xuXHRcdFx0b3V0cHV0LnB1c2goICB7ZmlsZTogbmZpbGUsIHBhZ2U6aiwgIHBhZ2VuYW1lOnBhZ2VOYW1lc1tqXX0pO1xuXHRcdFx0aWYgKG91dHB1dC5sZW5ndGg+b3B0cy5yYW5nZS5tYXhwYWdlKSBicmVhaztcblx0XHR9XG5cdH1cblxuXHR2YXIgcGFnZXBhdGhzPW91dHB1dC5tYXAoZnVuY3Rpb24ocCl7XG5cdFx0cmV0dXJuIFtcImZpbGVDb250ZW50c1wiLHAuZmlsZSxwLnBhZ2VdO1xuXHR9KTtcblx0Ly9wcmVwYXJlIHRoZSB0ZXh0XG5cdGVuZ2luZS5nZXQocGFnZXBhdGhzLGZ1bmN0aW9uKHBhZ2VzKXtcblx0XHR2YXIgc2VxPTA7XG5cdFx0aWYgKHBhZ2VzKSBmb3IgKHZhciBpPTA7aTxwYWdlcy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR2YXIgc3RhcnR2cG9zPWZpbGVzW291dHB1dFtpXS5maWxlXS5wYWdlT2Zmc2V0c1tvdXRwdXRbaV0ucGFnZS0xXTtcblx0XHRcdHZhciBlbmR2cG9zPWZpbGVzW291dHB1dFtpXS5maWxlXS5wYWdlT2Zmc2V0c1tvdXRwdXRbaV0ucGFnZV07XG5cdFx0XHR2YXIgaGw9e307XG5cblx0XHRcdGlmIChvcHRzLnJhbmdlICYmIG9wdHMucmFuZ2Uuc3RhcnQgICkge1xuXHRcdFx0XHRpZiAoIHN0YXJ0dnBvczxvcHRzLnJhbmdlLnN0YXJ0KSBzdGFydHZwb3M9b3B0cy5yYW5nZS5zdGFydDtcblx0XHRcdC8vXHRpZiAoZW5kdnBvcz5vcHRzLnJhbmdlLmVuZCkgZW5kdnBvcz1vcHRzLnJhbmdlLmVuZDtcblx0XHRcdH1cblx0XHRcdFxuXHRcdFx0aWYgKG9wdHMubm9oaWdobGlnaHQpIHtcblx0XHRcdFx0aGwudGV4dD1wYWdlc1tpXTtcblx0XHRcdFx0aGwuaGl0cz1oaXRJblJhbmdlKFEsc3RhcnR2cG9zLGVuZHZwb3MpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0dmFyIG89e25vY3JsZjp0cnVlLG5vc3Bhbjp0cnVlLFxuXHRcdFx0XHRcdHRleHQ6cGFnZXNbaV0sc3RhcnR2cG9zOnN0YXJ0dnBvcywgZW5kdnBvczogZW5kdnBvcywgXG5cdFx0XHRcdFx0UTpRLGZ1bGx0ZXh0Om9wdHMuZnVsbHRleHR9O1xuXHRcdFx0XHRobD1oaWdobGlnaHQoUSxvKTtcblx0XHRcdH1cblx0XHRcdGlmIChobC50ZXh0KSB7XG5cdFx0XHRcdG91dHB1dFtpXS50ZXh0PWhsLnRleHQ7XG5cdFx0XHRcdG91dHB1dFtpXS5oaXRzPWhsLmhpdHM7XG5cdFx0XHRcdG91dHB1dFtpXS5zZXE9c2VxO1xuXHRcdFx0XHRzZXErPWhsLmhpdHMubGVuZ3RoO1xuXG5cdFx0XHRcdG91dHB1dFtpXS5zdGFydD1zdGFydHZwb3M7XHRcdFx0XHRcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdG91dHB1dFtpXT1udWxsOyAvL3JlbW92ZSBpdGVtIHZwb3MgbGVzcyB0aGFuIG9wdHMucmFuZ2Uuc3RhcnRcblx0XHRcdH1cblx0XHR9IFxuXHRcdG91dHB1dD1vdXRwdXQuZmlsdGVyKGZ1bmN0aW9uKG8pe3JldHVybiBvIT1udWxsfSk7XG5cdFx0Y2Iob3V0cHV0KTtcblx0fSk7XG59XG52YXIgaW5qZWN0VGFnPWZ1bmN0aW9uKFEsb3B0cyl7XG5cdHZhciBoaXRzPW9wdHMuaGl0cztcblx0dmFyIHRhZ3M9b3B0cy50YWdzO1xuXHRpZiAoIXRhZ3MpIHRhZ3M9W107XG5cdHZhciBoaXRjbGFzcz1vcHRzLmhpdGNsYXNzfHwnaGwnO1xuXHR2YXIgb3V0cHV0PScnLE89W10saj0wLGs9MDtcblx0dmFyIHN1cnJvdW5kPW9wdHMuc3Vycm91bmR8fDU7XG5cblx0dmFyIHRva2Vucz1RLnRva2VuaXplKG9wdHMudGV4dCkudG9rZW5zO1xuXHR2YXIgdnBvcz1vcHRzLnZwb3M7XG5cdHZhciBpPTAscHJldmlucmFuZ2U9ISFvcHRzLmZ1bGx0ZXh0ICxpbnJhbmdlPSEhb3B0cy5mdWxsdGV4dDtcblx0dmFyIGhpdHN0YXJ0PTAsaGl0ZW5kPTAsdGFnc3RhcnQ9MCx0YWdlbmQ9MCx0YWdjbGFzcz1cIlwiO1xuXHR3aGlsZSAoaTx0b2tlbnMubGVuZ3RoKSB7XG5cdFx0dmFyIHNraXA9US5pc1NraXAodG9rZW5zW2ldKTtcblx0XHR2YXIgaGFzaGl0PWZhbHNlO1xuXHRcdGlucmFuZ2U9b3B0cy5mdWxsdGV4dCB8fCAoajxoaXRzLmxlbmd0aCAmJiB2cG9zK3N1cnJvdW5kPj1oaXRzW2pdWzBdIHx8XG5cdFx0XHRcdChqPjAgJiYgajw9aGl0cy5sZW5ndGggJiYgIGhpdHNbai0xXVswXStzdXJyb3VuZCoyPj12cG9zKSk7XHRcblxuXHRcdGlmIChwcmV2aW5yYW5nZSE9aW5yYW5nZSkge1xuXHRcdFx0b3V0cHV0Kz1vcHRzLmFicmlkZ2V8fFwiLi4uXCI7XG5cdFx0fVxuXHRcdHByZXZpbnJhbmdlPWlucmFuZ2U7XG5cdFx0dmFyIHRva2VuPXRva2Vuc1tpXTtcblx0XHRpZiAob3B0cy5ub2NybGYgJiYgdG9rZW49PVwiXFxuXCIpIHRva2VuPVwiXCI7XG5cblx0XHRpZiAoaW5yYW5nZSAmJiBpPHRva2Vucy5sZW5ndGgpIHtcblx0XHRcdGlmIChza2lwKSB7XG5cdFx0XHRcdG91dHB1dCs9dG9rZW47XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR2YXIgY2xhc3Nlcz1cIlwiO1x0XG5cblx0XHRcdFx0Ly9jaGVjayBoaXRcblx0XHRcdFx0aWYgKGo8aGl0cy5sZW5ndGggJiYgdnBvcz09aGl0c1tqXVswXSkge1xuXHRcdFx0XHRcdHZhciBucGhyYXNlPWhpdHNbal1bMl0gJSAxMCwgd2lkdGg9aGl0c1tqXVsxXTtcblx0XHRcdFx0XHRoaXRzdGFydD1oaXRzW2pdWzBdO1xuXHRcdFx0XHRcdGhpdGVuZD1oaXRzdGFydCt3aWR0aDtcblx0XHRcdFx0XHRqKys7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQvL2NoZWNrIHRhZ1xuXHRcdFx0XHRpZiAoazx0YWdzLmxlbmd0aCAmJiB2cG9zPT10YWdzW2tdWzBdKSB7XG5cdFx0XHRcdFx0dmFyIHdpZHRoPXRhZ3Nba11bMV07XG5cdFx0XHRcdFx0dGFnc3RhcnQ9dGFnc1trXVswXTtcblx0XHRcdFx0XHR0YWdlbmQ9dGFnc3RhcnQrd2lkdGg7XG5cdFx0XHRcdFx0dGFnY2xhc3M9dGFnc1trXVsyXTtcblx0XHRcdFx0XHRrKys7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAodnBvcz49aGl0c3RhcnQgJiYgdnBvczxoaXRlbmQpIGNsYXNzZXM9aGl0Y2xhc3MrXCIgXCIraGl0Y2xhc3MrbnBocmFzZTtcblx0XHRcdFx0aWYgKHZwb3M+PXRhZ3N0YXJ0ICYmIHZwb3M8dGFnZW5kKSBjbGFzc2VzKz1cIiBcIit0YWdjbGFzcztcblxuXHRcdFx0XHRpZiAoY2xhc3NlcyB8fCAhb3B0cy5ub3NwYW4pIHtcblx0XHRcdFx0XHRvdXRwdXQrPSc8c3BhbiB2cG9zPVwiJyt2cG9zKydcIic7XG5cdFx0XHRcdFx0aWYgKGNsYXNzZXMpIGNsYXNzZXM9JyBjbGFzcz1cIicrY2xhc3NlcysnXCInO1xuXHRcdFx0XHRcdG91dHB1dCs9Y2xhc3NlcysnPic7XG5cdFx0XHRcdFx0b3V0cHV0Kz10b2tlbisnPC9zcGFuPic7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0b3V0cHV0Kz10b2tlbjtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH1cblx0XHRpZiAoIXNraXApIHZwb3MrKztcblx0XHRpKys7IFxuXHR9XG5cblx0Ty5wdXNoKG91dHB1dCk7XG5cdG91dHB1dD1cIlwiO1xuXG5cdHJldHVybiBPLmpvaW4oXCJcIik7XG59XG52YXIgaGlnaGxpZ2h0PWZ1bmN0aW9uKFEsb3B0cykge1xuXHRpZiAoIW9wdHMudGV4dCkgcmV0dXJuIHt0ZXh0OlwiXCIsaGl0czpbXX07XG5cdHZhciBvcHQ9e3RleHQ6b3B0cy50ZXh0LFxuXHRcdGhpdHM6bnVsbCxhYnJpZGdlOm9wdHMuYWJyaWRnZSx2cG9zOm9wdHMuc3RhcnR2cG9zLFxuXHRcdGZ1bGx0ZXh0Om9wdHMuZnVsbHRleHQscmVuZGVyVGFnczpvcHRzLnJlbmRlclRhZ3Msbm9zcGFuOm9wdHMubm9zcGFuLG5vY3JsZjpvcHRzLm5vY3JsZixcblx0fTtcblxuXHRvcHQuaGl0cz1oaXRJblJhbmdlKG9wdHMuUSxvcHRzLnN0YXJ0dnBvcyxvcHRzLmVuZHZwb3MpO1xuXHRyZXR1cm4ge3RleHQ6aW5qZWN0VGFnKFEsb3B0KSxoaXRzOm9wdC5oaXRzfTtcbn1cblxudmFyIGdldFBhZ2U9ZnVuY3Rpb24oZW5naW5lLGZpbGVpZCxwYWdlaWQsY2IpIHtcblx0dmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0dmFyIHBhZ2VwYXRocz1bXCJmaWxlQ29udGVudHNcIixmaWxlaWQscGFnZWlkXTtcblx0dmFyIHBhZ2VuYW1lcz1lbmdpbmUuZ2V0RmlsZVBhZ2VOYW1lcyhmaWxlaWQpO1xuXG5cdGVuZ2luZS5nZXQocGFnZXBhdGhzLGZ1bmN0aW9uKHRleHQpe1xuXHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFt7dGV4dDp0ZXh0LGZpbGU6ZmlsZWlkLHBhZ2U6cGFnZWlkLHBhZ2VuYW1lOnBhZ2VuYW1lc1twYWdlaWRdfV0pO1xuXHR9KTtcbn1cblxudmFyIGdldFBhZ2VTeW5jPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaWQscGFnZWlkKSB7XG5cdHZhciBmaWxlT2Zmc2V0cz1lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdHZhciBwYWdlcGF0aHM9W1wiZmlsZUNvbnRlbnRzXCIsZmlsZWlkLHBhZ2VpZF07XG5cdHZhciBwYWdlbmFtZXM9ZW5naW5lLmdldEZpbGVQYWdlTmFtZXMoZmlsZWlkKTtcblxuXHR2YXIgdGV4dD1lbmdpbmUuZ2V0KHBhZ2VwYXRocyk7XG5cdHJldHVybiB7dGV4dDp0ZXh0LGZpbGU6ZmlsZWlkLHBhZ2U6cGFnZWlkLHBhZ2VuYW1lOnBhZ2VuYW1lc1twYWdlaWRdfTtcbn1cblxudmFyIGdldFJhbmdlPWZ1bmN0aW9uKGVuZ2luZSxzdGFydCxlbmQsY2IpIHtcblx0dmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0Ly92YXIgcGFnZXBhdGhzPVtcImZpbGVDb250ZW50c1wiLF07XG5cdC8vZmluZCBmaXJzdCBwYWdlIGFuZCBsYXN0IHBhZ2Vcblx0Ly9jcmVhdGUgZ2V0IHBhdGhzXG5cbn1cblxudmFyIGdldEZpbGU9ZnVuY3Rpb24oZW5naW5lLGZpbGVpZCxjYikge1xuXHR2YXIgZmlsZW5hbWU9ZW5naW5lLmdldChcImZpbGVOYW1lc1wiKVtmaWxlaWRdO1xuXHR2YXIgcGFnZW5hbWVzPWVuZ2luZS5nZXRGaWxlUGFnZU5hbWVzKGZpbGVpZCk7XG5cdHZhciBmaWxlc3RhcnQ9ZW5naW5lLmdldChcImZpbGVPZmZzZXRzXCIpW2ZpbGVpZF07XG5cdHZhciBvZmZzZXRzPWVuZ2luZS5nZXRGaWxlUGFnZU9mZnNldHMoZmlsZWlkKTtcblx0dmFyIHBjPTA7XG5cdGVuZ2luZS5nZXQoW1wiZmlsZUNvbnRlbnRzXCIsZmlsZWlkXSx0cnVlLGZ1bmN0aW9uKGRhdGEpe1xuXHRcdHZhciB0ZXh0PWRhdGEubWFwKGZ1bmN0aW9uKHQsaWR4KSB7XG5cdFx0XHRpZiAoaWR4PT0wKSByZXR1cm4gXCJcIjsgXG5cdFx0XHR2YXIgcGI9JzxwYiBuPVwiJytwYWdlbmFtZXNbaWR4XSsnXCI+PC9wYj4nO1xuXHRcdFx0cmV0dXJuIHBiK3Q7XG5cdFx0fSk7XG5cdFx0Y2Ioe3RleHRzOmRhdGEsdGV4dDp0ZXh0LmpvaW4oXCJcIikscGFnZW5hbWVzOnBhZ2VuYW1lcyxmaWxlc3RhcnQ6ZmlsZXN0YXJ0LG9mZnNldHM6b2Zmc2V0cyxmaWxlOmZpbGVpZCxmaWxlbmFtZTpmaWxlbmFtZX0pOyAvL2ZvcmNlIGRpZmZlcmVudCB0b2tlblxuXHR9KTtcbn1cblxudmFyIGhpZ2hsaWdodFJhbmdlPWZ1bmN0aW9uKFEsc3RhcnR2cG9zLGVuZHZwb3Msb3B0cyxjYil7XG5cdC8vbm90IGltcGxlbWVudCB5ZXRcbn1cblxudmFyIGhpZ2hsaWdodEZpbGU9ZnVuY3Rpb24oUSxmaWxlaWQsb3B0cyxjYikge1xuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikge1xuXHRcdGNiPW9wdHM7XG5cdH1cblxuXHRpZiAoIVEgfHwgIVEuZW5naW5lKSByZXR1cm4gY2IobnVsbCk7XG5cblx0dmFyIHBhZ2VPZmZzZXRzPVEuZW5naW5lLmdldEZpbGVQYWdlT2Zmc2V0cyhmaWxlaWQpO1xuXHR2YXIgb3V0cHV0PVtdO1x0XG5cdC8vY29uc29sZS5sb2coc3RhcnR2cG9zLGVuZHZwb3MpXG5cdFEuZW5naW5lLmdldChbXCJmaWxlQ29udGVudHNcIixmaWxlaWRdLHRydWUsZnVuY3Rpb24oZGF0YSl7XG5cdFx0aWYgKCFkYXRhKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFwid3JvbmcgZmlsZSBpZFwiLGZpbGVpZCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGZvciAodmFyIGk9MDtpPGRhdGEubGVuZ3RoLTE7aSsrICl7XG5cdFx0XHRcdHZhciBzdGFydHZwb3M9cGFnZU9mZnNldHNbaV07XG5cdFx0XHRcdHZhciBlbmR2cG9zPXBhZ2VPZmZzZXRzW2krMV07XG5cdFx0XHRcdHZhciBwYWdlbmFtZXM9US5lbmdpbmUuZ2V0RmlsZVBhZ2VOYW1lcyhmaWxlaWQpO1xuXHRcdFx0XHR2YXIgcGFnZT1nZXRQYWdlU3luYyhRLmVuZ2luZSwgZmlsZWlkLGkrMSk7XG5cdFx0XHRcdFx0dmFyIG9wdD17dGV4dDpwYWdlLnRleHQsaGl0czpudWxsLHRhZzonaGwnLHZwb3M6c3RhcnR2cG9zLFxuXHRcdFx0XHRcdGZ1bGx0ZXh0OnRydWUsbm9zcGFuOm9wdHMubm9zcGFuLG5vY3JsZjpvcHRzLm5vY3JsZn07XG5cdFx0XHRcdHZhciBwYWdlbmFtZT1wYWdlbmFtZXNbaSsxXTtcblx0XHRcdFx0b3B0LmhpdHM9aGl0SW5SYW5nZShRLHN0YXJ0dnBvcyxlbmR2cG9zKTtcblx0XHRcdFx0dmFyIHBiPSc8cGIgbj1cIicrcGFnZW5hbWUrJ1wiPjwvcGI+Jztcblx0XHRcdFx0dmFyIHdpdGh0YWc9aW5qZWN0VGFnKFEsb3B0KTtcblx0XHRcdFx0b3V0cHV0LnB1c2gocGIrd2l0aHRhZyk7XG5cdFx0XHR9XHRcdFx0XG5cdFx0fVxuXG5cdFx0Y2IuYXBwbHkoUS5lbmdpbmUuY29udGV4dCxbe3RleHQ6b3V0cHV0LmpvaW4oXCJcIiksZmlsZTpmaWxlaWR9XSk7XG5cdH0pXG59XG52YXIgaGlnaGxpZ2h0UGFnZT1mdW5jdGlvbihRLGZpbGVpZCxwYWdlaWQsb3B0cyxjYikge1xuXHRpZiAodHlwZW9mIG9wdHM9PVwiZnVuY3Rpb25cIikge1xuXHRcdGNiPW9wdHM7XG5cdH1cblxuXHRpZiAoIVEgfHwgIVEuZW5naW5lKSByZXR1cm4gY2IobnVsbCk7XG5cdHZhciBwYWdlT2Zmc2V0cz1RLmVuZ2luZS5nZXRGaWxlUGFnZU9mZnNldHMoZmlsZWlkKTtcblx0dmFyIHN0YXJ0dnBvcz1wYWdlT2Zmc2V0c1twYWdlaWQtMV07XG5cdHZhciBlbmR2cG9zPXBhZ2VPZmZzZXRzW3BhZ2VpZF07XG5cdHZhciBwYWdlbmFtZXM9US5lbmdpbmUuZ2V0RmlsZVBhZ2VOYW1lcyhmaWxlaWQpO1xuXG5cdHRoaXMuZ2V0UGFnZShRLmVuZ2luZSxmaWxlaWQscGFnZWlkLGZ1bmN0aW9uKHJlcyl7XG5cdFx0dmFyIG9wdD17dGV4dDpyZXMudGV4dCxoaXRzOm51bGwsdnBvczpzdGFydHZwb3MsZnVsbHRleHQ6dHJ1ZSxcblx0XHRcdG5vc3BhbjpvcHRzLm5vc3Bhbixub2NybGY6b3B0cy5ub2NybGZ9O1xuXHRcdG9wdC5oaXRzPWhpdEluUmFuZ2UoUSxzdGFydHZwb3MsZW5kdnBvcyk7XG5cdFx0aWYgKG9wdHMucmVuZGVyVGFncykge1xuXHRcdFx0b3B0LnRhZ3M9dGFnc0luUmFuZ2UoUSxvcHRzLnJlbmRlclRhZ3Msc3RhcnR2cG9zLGVuZHZwb3MpO1xuXHRcdH1cblxuXHRcdHZhciBwYWdlbmFtZT1wYWdlbmFtZXNbcGFnZWlkXTtcblx0XHRjYi5hcHBseShRLmVuZ2luZS5jb250ZXh0LFt7dGV4dDppbmplY3RUYWcoUSxvcHQpLHBhZ2U6cGFnZWlkLGZpbGU6ZmlsZWlkLGhpdHM6b3B0LmhpdHMscGFnZW5hbWU6cGFnZW5hbWV9XSk7XG5cdH0pO1xufVxubW9kdWxlLmV4cG9ydHM9e3Jlc3VsdGxpc3Q6cmVzdWx0bGlzdCwgXG5cdGhpdEluUmFuZ2U6aGl0SW5SYW5nZSwgXG5cdGhpZ2hsaWdodFBhZ2U6aGlnaGxpZ2h0UGFnZSxcblx0Z2V0UGFnZTpnZXRQYWdlLFxuXHRoaWdobGlnaHRGaWxlOmhpZ2hsaWdodEZpbGUsXG5cdGdldEZpbGU6Z2V0RmlsZVxuXHQvL2hpZ2hsaWdodFJhbmdlOmhpZ2hsaWdodFJhbmdlLFxuICAvL2dldFJhbmdlOmdldFJhbmdlLFxufTsiLCIvKlxuICBLc2FuYSBTZWFyY2ggRW5naW5lLlxuXG4gIG5lZWQgYSBLREUgaW5zdGFuY2UgdG8gYmUgZnVuY3Rpb25hbFxuICBcbiovXG52YXIgYnNlYXJjaD1yZXF1aXJlKFwiLi9ic2VhcmNoXCIpO1xudmFyIGRvc2VhcmNoPXJlcXVpcmUoXCIuL3NlYXJjaFwiKTtcblxudmFyIHByZXBhcmVFbmdpbmVGb3JTZWFyY2g9ZnVuY3Rpb24oZW5naW5lLGNiKXtcblx0aWYgKGVuZ2luZS5hbmFseXplcilyZXR1cm47XG5cdHZhciBhbmFseXplcj1yZXF1aXJlKFwia3NhbmEtYW5hbHl6ZXJcIik7XG5cdHZhciBjb25maWc9ZW5naW5lLmdldChcIm1ldGFcIikuY29uZmlnO1xuXHRlbmdpbmUuYW5hbHl6ZXI9YW5hbHl6ZXIuZ2V0QVBJKGNvbmZpZyk7XG5cdGVuZ2luZS5nZXQoW1tcInRva2Vuc1wiXSxbXCJwb3N0aW5nc0xlbmd0aFwiXV0sZnVuY3Rpb24oKXtcblx0XHRjYigpO1xuXHR9KTtcbn1cbnZhciBfc2VhcmNoPWZ1bmN0aW9uKGVuZ2luZSxxLG9wdHMsY2IsY29udGV4dCkge1xuXHRpZiAodHlwZW9mIGVuZ2luZT09XCJzdHJpbmdcIikgey8vYnJvd3NlciBvbmx5XG5cdFx0dmFyIGtkZT1yZXF1aXJlKFwia3NhbmEtZGF0YWJhc2VcIik7XG5cdFx0aWYgKHR5cGVvZiBvcHRzPT1cImZ1bmN0aW9uXCIpIHsgLy91c2VyIGRpZG4ndCBzdXBwbHkgb3B0aW9uc1xuXHRcdFx0aWYgKHR5cGVvZiBjYj09XCJvYmplY3RcIiljb250ZXh0PWNiO1xuXHRcdFx0Y2I9b3B0cztcblx0XHRcdG9wdHM9e307XG5cdFx0fVxuXHRcdG9wdHMucT1xO1xuXHRcdG9wdHMuZGJpZD1lbmdpbmU7XG5cdFx0a2RlLm9wZW4ob3B0cy5kYmlkLGZ1bmN0aW9uKGVycixkYil7XG5cdFx0XHRpZiAoZXJyKSB7XG5cdFx0XHRcdGNiKGVycik7XG5cdFx0XHRcdHJldHVybjtcblx0XHRcdH1cblx0XHRcdGNvbnNvbGUubG9nKFwib3BlbmVkXCIsb3B0cy5kYmlkKVxuXHRcdFx0cHJlcGFyZUVuZ2luZUZvclNlYXJjaChkYixmdW5jdGlvbigpe1xuXHRcdFx0XHRyZXR1cm4gZG9zZWFyY2goZGIscSxvcHRzLGNiKTtcdFxuXHRcdFx0fSk7XG5cdFx0fSxjb250ZXh0KTtcblx0fSBlbHNlIHtcblx0XHRwcmVwYXJlRW5naW5lRm9yU2VhcmNoKGVuZ2luZSxmdW5jdGlvbigpe1xuXHRcdFx0cmV0dXJuIGRvc2VhcmNoKGVuZ2luZSxxLG9wdHMsY2IpO1x0XG5cdFx0fSk7XG5cdH1cbn1cblxudmFyIF9oaWdobGlnaHRQYWdlPWZ1bmN0aW9uKGVuZ2luZSxmaWxlaWQscGFnZWlkLG9wdHMsY2Ipe1xuXHRpZiAoIW9wdHMucSkgb3B0cy5xPVwiXCI7IFxuXHRfc2VhcmNoKGVuZ2luZSxvcHRzLnEsb3B0cyxmdW5jdGlvbihRKXtcblx0XHRhcGkuZXhjZXJwdC5oaWdobGlnaHRQYWdlKFEsZmlsZWlkLHBhZ2VpZCxvcHRzLGNiKTtcblx0fSk7XHRcbn1cbnZhciBfaGlnaGxpZ2h0UmFuZ2U9ZnVuY3Rpb24oZW5naW5lLHN0YXJ0LGVuZCxvcHRzLGNiKXtcblxuXHRpZiAob3B0cy5xKSB7XG5cdFx0X3NlYXJjaChlbmdpbmUsb3B0cy5xLG9wdHMsZnVuY3Rpb24oUSl7XG5cdFx0XHRhcGkuZXhjZXJwdC5oaWdobGlnaHRSYW5nZShRLHN0YXJ0LGVuZCxvcHRzLGNiKTtcblx0XHR9KTtcblx0fSBlbHNlIHtcblx0XHRwcmVwYXJlRW5naW5lRm9yU2VhcmNoKGVuZ2luZSxmdW5jdGlvbigpe1xuXHRcdFx0YXBpLmV4Y2VycHQuZ2V0UmFuZ2UoZW5naW5lLHN0YXJ0LGVuZCxjYik7XG5cdFx0fSk7XG5cdH1cbn1cbnZhciBfaGlnaGxpZ2h0RmlsZT1mdW5jdGlvbihlbmdpbmUsZmlsZWlkLG9wdHMsY2Ipe1xuXHRpZiAoIW9wdHMucSkgb3B0cy5xPVwiXCI7IFxuXHRfc2VhcmNoKGVuZ2luZSxvcHRzLnEsb3B0cyxmdW5jdGlvbihRKXtcblx0XHRhcGkuZXhjZXJwdC5oaWdobGlnaHRGaWxlKFEsZmlsZWlkLG9wdHMsY2IpO1xuXHR9KTtcblx0Lypcblx0fSBlbHNlIHtcblx0XHRhcGkuZXhjZXJwdC5nZXRGaWxlKGVuZ2luZSxmaWxlaWQsZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW2RhdGFdKTtcblx0XHR9KTtcblx0fVxuXHQqL1xufVxuXG52YXIgdnBvczJmaWxlcGFnZT1mdW5jdGlvbihlbmdpbmUsdnBvcykge1xuICAgIHZhciBwYWdlT2Zmc2V0cz1lbmdpbmUuZ2V0KFwicGFnZU9mZnNldHNcIik7XG4gICAgdmFyIGZpbGVPZmZzZXRzPWVuZ2luZS5nZXQoW1wiZmlsZU9mZnNldHNcIl0pO1xuICAgIHZhciBwYWdlTmFtZXM9ZW5naW5lLmdldChcInBhZ2VOYW1lc1wiKTtcbiAgICB2YXIgZmlsZWlkPWJzZWFyY2goZmlsZU9mZnNldHMsdnBvcysxLHRydWUpO1xuICAgIGZpbGVpZC0tO1xuICAgIHZhciBwYWdlaWQ9YnNlYXJjaChwYWdlT2Zmc2V0cyx2cG9zKzEsdHJ1ZSk7XG5cdHZhciByYW5nZT1lbmdpbmUuZ2V0RmlsZVJhbmdlKGZpbGVpZCk7XG5cdHBhZ2VpZC09cmFuZ2Uuc3RhcnQ7XG4gICAgcmV0dXJuIHtmaWxlOmZpbGVpZCxwYWdlOnBhZ2VpZH07XG59XG52YXIgYXBpPXtcblx0c2VhcmNoOl9zZWFyY2hcbi8vXHQsY29uY29yZGFuY2U6cmVxdWlyZShcIi4vY29uY29yZGFuY2VcIilcbi8vXHQscmVnZXg6cmVxdWlyZShcIi4vcmVnZXhcIilcblx0LGhpZ2hsaWdodFBhZ2U6X2hpZ2hsaWdodFBhZ2Vcblx0LGhpZ2hsaWdodEZpbGU6X2hpZ2hsaWdodEZpbGVcbi8vXHQsaGlnaGxpZ2h0UmFuZ2U6X2hpZ2hsaWdodFJhbmdlXG5cdCxleGNlcnB0OnJlcXVpcmUoXCIuL2V4Y2VycHRcIilcblx0LHZwb3MyZmlsZXBhZ2U6dnBvczJmaWxlcGFnZVxufVxubW9kdWxlLmV4cG9ydHM9YXBpOyIsIlxudmFyIHVucGFjayA9IGZ1bmN0aW9uIChhcikgeyAvLyB1bnBhY2sgdmFyaWFibGUgbGVuZ3RoIGludGVnZXIgbGlzdFxuICB2YXIgciA9IFtdLFxuICBpID0gMCxcbiAgdiA9IDA7XG4gIGRvIHtcblx0dmFyIHNoaWZ0ID0gMDtcblx0ZG8ge1xuXHQgIHYgKz0gKChhcltpXSAmIDB4N0YpIDw8IHNoaWZ0KTtcblx0ICBzaGlmdCArPSA3O1xuXHR9IHdoaWxlIChhclsrK2ldICYgMHg4MCk7XG5cdHJbci5sZW5ndGhdPXY7XG4gIH0gd2hpbGUgKGkgPCBhci5sZW5ndGgpO1xuICByZXR1cm4gcjtcbn1cblxuLypcbiAgIGFycjogIFsxLDEsMSwxLDEsMSwxLDEsMV1cbiAgIGxldmVsczogWzAsMSwxLDIsMiwwLDEsMl1cbiAgIG91dHB1dDogWzUsMSwzLDEsMSwzLDEsMV1cbiovXG5cbnZhciBncm91cHN1bT1mdW5jdGlvbihhcnIsbGV2ZWxzKSB7XG4gIGlmIChhcnIubGVuZ3RoIT1sZXZlbHMubGVuZ3RoKzEpIHJldHVybiBudWxsO1xuICB2YXIgc3RhY2s9W107XG4gIHZhciBvdXRwdXQ9bmV3IEFycmF5KGxldmVscy5sZW5ndGgpO1xuICBmb3IgKHZhciBpPTA7aTxsZXZlbHMubGVuZ3RoO2krKykgb3V0cHV0W2ldPTA7XG4gIGZvciAodmFyIGk9MTtpPGFyci5sZW5ndGg7aSsrKSB7IC8vZmlyc3Qgb25lIG91dCBvZiB0b2Mgc2NvcGUsIGlnbm9yZWRcbiAgICBpZiAoc3RhY2subGVuZ3RoPmxldmVsc1tpLTFdKSB7XG4gICAgICB3aGlsZSAoc3RhY2subGVuZ3RoPmxldmVsc1tpLTFdKSBzdGFjay5wb3AoKTtcbiAgICB9XG4gICAgc3RhY2sucHVzaChpLTEpO1xuICAgIGZvciAodmFyIGo9MDtqPHN0YWNrLmxlbmd0aDtqKyspIHtcbiAgICAgIG91dHB1dFtzdGFja1tqXV0rPWFycltpXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dHB1dDtcbn1cbi8qIGFycj0gMSAsIDIgLCAzICw0ICw1LDYsNyAvL3Rva2VuIHBvc3RpbmdcbiAgcG9zdGluZz0gMyAsIDUgIC8vdGFnIHBvc3RpbmdcbiAgb3V0ID0gMyAsIDIsIDJcbiovXG52YXIgY291bnRieXBvc3RpbmcgPSBmdW5jdGlvbiAoYXJyLCBwb3N0aW5nKSB7XG4gIGlmICghcG9zdGluZy5sZW5ndGgpIHJldHVybiBbYXJyLmxlbmd0aF07XG4gIHZhciBvdXQ9W107XG4gIGZvciAodmFyIGk9MDtpPHBvc3RpbmcubGVuZ3RoO2krKykgb3V0W2ldPTA7XG4gIG91dFtwb3N0aW5nLmxlbmd0aF09MDtcbiAgdmFyIHA9MCxpPTAsbGFzdGk9MDtcbiAgd2hpbGUgKGk8YXJyLmxlbmd0aCAmJiBwPHBvc3RpbmcubGVuZ3RoKSB7XG4gICAgaWYgKGFycltpXTw9cG9zdGluZ1twXSkge1xuICAgICAgd2hpbGUgKHA8cG9zdGluZy5sZW5ndGggJiYgaTxhcnIubGVuZ3RoICYmIGFycltpXTw9cG9zdGluZ1twXSkge1xuICAgICAgICBvdXRbcF0rKztcbiAgICAgICAgaSsrO1xuICAgICAgfSAgICAgIFxuICAgIH0gXG4gICAgcCsrO1xuICB9XG4gIG91dFtwb3N0aW5nLmxlbmd0aF0gPSBhcnIubGVuZ3RoLWk7IC8vcmVtYWluaW5nXG4gIHJldHVybiBvdXQ7XG59XG5cbnZhciBncm91cGJ5cG9zdGluZz1mdW5jdGlvbihhcnIsZ3Bvc3RpbmcpIHsgLy9yZWxhdGl2ZSB2cG9zXG4gIGlmICghZ3Bvc3RpbmcubGVuZ3RoKSByZXR1cm4gW2Fyci5sZW5ndGhdO1xuICB2YXIgb3V0PVtdO1xuICBmb3IgKHZhciBpPTA7aTw9Z3Bvc3RpbmcubGVuZ3RoO2krKykgb3V0W2ldPVtdO1xuICBcbiAgdmFyIHA9MCxpPTAsbGFzdGk9MDtcbiAgd2hpbGUgKGk8YXJyLmxlbmd0aCAmJiBwPGdwb3N0aW5nLmxlbmd0aCkge1xuICAgIGlmIChhcnJbaV08Z3Bvc3RpbmdbcF0pIHtcbiAgICAgIHdoaWxlIChwPGdwb3N0aW5nLmxlbmd0aCAmJiBpPGFyci5sZW5ndGggJiYgYXJyW2ldPGdwb3N0aW5nW3BdKSB7XG4gICAgICAgIHZhciBzdGFydD0wO1xuICAgICAgICBpZiAocD4wKSBzdGFydD1ncG9zdGluZ1twLTFdO1xuICAgICAgICBvdXRbcF0ucHVzaChhcnJbaSsrXS1zdGFydCk7ICAvLyByZWxhdGl2ZVxuICAgICAgfSAgICAgIFxuICAgIH0gXG4gICAgcCsrO1xuICB9XG4gIC8vcmVtYWluaW5nXG4gIHdoaWxlKGk8YXJyLmxlbmd0aCkgb3V0W291dC5sZW5ndGgtMV0ucHVzaChhcnJbaSsrXS1ncG9zdGluZ1tncG9zdGluZy5sZW5ndGgtMV0pO1xuICByZXR1cm4gb3V0O1xufVxudmFyIGdyb3VwYnlwb3N0aW5nMj1mdW5jdGlvbihhcnIsZ3Bvc3RpbmcpIHsgLy9hYnNvbHV0ZSB2cG9zXG4gIGlmICghYXJyIHx8ICFhcnIubGVuZ3RoKSByZXR1cm4gW107XG4gIGlmICghZ3Bvc3RpbmcubGVuZ3RoKSByZXR1cm4gW2Fyci5sZW5ndGhdO1xuICB2YXIgb3V0PVtdO1xuICBmb3IgKHZhciBpPTA7aTw9Z3Bvc3RpbmcubGVuZ3RoO2krKykgb3V0W2ldPVtdO1xuICBcbiAgdmFyIHA9MCxpPTAsbGFzdGk9MDtcbiAgd2hpbGUgKGk8YXJyLmxlbmd0aCAmJiBwPGdwb3N0aW5nLmxlbmd0aCkge1xuICAgIGlmIChhcnJbaV08Z3Bvc3RpbmdbcF0pIHtcbiAgICAgIHdoaWxlIChwPGdwb3N0aW5nLmxlbmd0aCAmJiBpPGFyci5sZW5ndGggJiYgYXJyW2ldPGdwb3N0aW5nW3BdKSB7XG4gICAgICAgIHZhciBzdGFydD0wO1xuICAgICAgICBpZiAocD4wKSBzdGFydD1ncG9zdGluZ1twLTFdOyAvL2Fic29sdXRlXG4gICAgICAgIG91dFtwXS5wdXNoKGFycltpKytdKTtcbiAgICAgIH0gICAgICBcbiAgICB9IFxuICAgIHArKztcbiAgfVxuICAvL3JlbWFpbmluZ1xuICB3aGlsZShpPGFyci5sZW5ndGgpIG91dFtvdXQubGVuZ3RoLTFdLnB1c2goYXJyW2krK10tZ3Bvc3RpbmdbZ3Bvc3RpbmcubGVuZ3RoLTFdKTtcbiAgcmV0dXJuIG91dDtcbn1cbnZhciBncm91cGJ5YmxvY2syID0gZnVuY3Rpb24oYXIsIG50b2tlbixzbG90c2hpZnQsb3B0cykge1xuICBpZiAoIWFyLmxlbmd0aCkgcmV0dXJuIFt7fSx7fV07XG4gIFxuICBzbG90c2hpZnQgPSBzbG90c2hpZnQgfHwgMTY7XG4gIHZhciBnID0gTWF0aC5wb3coMixzbG90c2hpZnQpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByID0ge30sIG50b2tlbnM9e307XG4gIHZhciBncm91cGNvdW50PTA7XG4gIGRvIHtcbiAgICB2YXIgZ3JvdXAgPSBNYXRoLmZsb29yKGFyW2ldIC8gZykgO1xuICAgIGlmICghcltncm91cF0pIHtcbiAgICAgIHJbZ3JvdXBdID0gW107XG4gICAgICBudG9rZW5zW2dyb3VwXT1bXTtcbiAgICAgIGdyb3VwY291bnQrKztcbiAgICB9XG4gICAgcltncm91cF0ucHVzaChhcltpXSAlIGcpO1xuICAgIG50b2tlbnNbZ3JvdXBdLnB1c2gobnRva2VuW2ldKTtcbiAgICBpKys7XG4gIH0gd2hpbGUgKGkgPCBhci5sZW5ndGgpO1xuICBpZiAob3B0cykgb3B0cy5ncm91cGNvdW50PWdyb3VwY291bnQ7XG4gIHJldHVybiBbcixudG9rZW5zXTtcbn1cbnZhciBncm91cGJ5c2xvdCA9IGZ1bmN0aW9uIChhciwgc2xvdHNoaWZ0LCBvcHRzKSB7XG4gIGlmICghYXIubGVuZ3RoKVxuXHRyZXR1cm4ge307XG4gIFxuICBzbG90c2hpZnQgPSBzbG90c2hpZnQgfHwgMTY7XG4gIHZhciBnID0gTWF0aC5wb3coMixzbG90c2hpZnQpO1xuICB2YXIgaSA9IDA7XG4gIHZhciByID0ge307XG4gIHZhciBncm91cGNvdW50PTA7XG4gIGRvIHtcblx0dmFyIGdyb3VwID0gTWF0aC5mbG9vcihhcltpXSAvIGcpIDtcblx0aWYgKCFyW2dyb3VwXSkge1xuXHQgIHJbZ3JvdXBdID0gW107XG5cdCAgZ3JvdXBjb3VudCsrO1xuXHR9XG5cdHJbZ3JvdXBdLnB1c2goYXJbaV0gJSBnKTtcblx0aSsrO1xuICB9IHdoaWxlIChpIDwgYXIubGVuZ3RoKTtcbiAgaWYgKG9wdHMpIG9wdHMuZ3JvdXBjb3VudD1ncm91cGNvdW50O1xuICByZXR1cm4gcjtcbn1cbi8qXG52YXIgaWRlbnRpdHkgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlO1xufTtcbnZhciBzb3J0ZWRJbmRleCA9IGZ1bmN0aW9uIChhcnJheSwgb2JqLCBpdGVyYXRvcikgeyAvL3Rha2VuIGZyb20gdW5kZXJzY29yZVxuICBpdGVyYXRvciB8fCAoaXRlcmF0b3IgPSBpZGVudGl0eSk7XG4gIHZhciBsb3cgPSAwLFxuICBoaWdoID0gYXJyYXkubGVuZ3RoO1xuICB3aGlsZSAobG93IDwgaGlnaCkge1xuXHR2YXIgbWlkID0gKGxvdyArIGhpZ2gpID4+IDE7XG5cdGl0ZXJhdG9yKGFycmF5W21pZF0pIDwgaXRlcmF0b3Iob2JqKSA/IGxvdyA9IG1pZCArIDEgOiBoaWdoID0gbWlkO1xuICB9XG4gIHJldHVybiBsb3c7XG59OyovXG5cbnZhciBpbmRleE9mU29ydGVkID0gZnVuY3Rpb24gKGFycmF5LCBvYmopIHsgXG4gIHZhciBsb3cgPSAwLFxuICBoaWdoID0gYXJyYXkubGVuZ3RoLTE7XG4gIHdoaWxlIChsb3cgPCBoaWdoKSB7XG4gICAgdmFyIG1pZCA9IChsb3cgKyBoaWdoKSA+PiAxO1xuICAgIGFycmF5W21pZF0gPCBvYmogPyBsb3cgPSBtaWQgKyAxIDogaGlnaCA9IG1pZDtcbiAgfVxuICByZXR1cm4gbG93O1xufTtcbnZhciBwbGhlYWQ9ZnVuY3Rpb24ocGwsIHBsdGFnLCBvcHRzKSB7XG4gIG9wdHM9b3B0c3x8e307XG4gIG9wdHMubWF4PW9wdHMubWF4fHwxO1xuICB2YXIgb3V0PVtdO1xuICBpZiAocGx0YWcubGVuZ3RoPHBsLmxlbmd0aCkge1xuICAgIGZvciAodmFyIGk9MDtpPHBsdGFnLmxlbmd0aDtpKyspIHtcbiAgICAgICBrID0gaW5kZXhPZlNvcnRlZChwbCwgcGx0YWdbaV0pO1xuICAgICAgIGlmIChrPi0xICYmIGs8cGwubGVuZ3RoKSB7XG4gICAgICAgIGlmIChwbFtrXT09cGx0YWdbaV0pIHtcbiAgICAgICAgICBvdXRbb3V0Lmxlbmd0aF09cGx0YWdbaV07XG4gICAgICAgICAgaWYgKG91dC5sZW5ndGg+PW9wdHMubWF4KSBicmVhaztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpPTA7aTxwbC5sZW5ndGg7aSsrKSB7XG4gICAgICAgayA9IGluZGV4T2ZTb3J0ZWQocGx0YWcsIHBsW2ldKTtcbiAgICAgICBpZiAoaz4tMSAmJiBrPHBsdGFnLmxlbmd0aCkge1xuICAgICAgICBpZiAocGx0YWdba109PXBsW2ldKSB7XG4gICAgICAgICAgb3V0W291dC5sZW5ndGhdPXBsdGFnW2tdO1xuICAgICAgICAgIGlmIChvdXQubGVuZ3RoPj1vcHRzLm1heCkgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIG91dDtcbn1cbi8qXG4gcGwyIG9jY3VyIGFmdGVyIHBsMSwgXG4gcGwyPj1wbDErbWluZGlzXG4gcGwyPD1wbDErbWF4ZGlzXG4qL1xudmFyIHBsZm9sbG93MiA9IGZ1bmN0aW9uIChwbDEsIHBsMiwgbWluZGlzLCBtYXhkaXMpIHtcbiAgdmFyIHIgPSBbXSxpPTA7XG4gIHZhciBzd2FwID0gMDtcbiAgXG4gIHdoaWxlIChpPHBsMS5sZW5ndGgpe1xuICAgIHZhciBrID0gaW5kZXhPZlNvcnRlZChwbDIsIHBsMVtpXSArIG1pbmRpcyk7XG4gICAgdmFyIHQgPSAocGwyW2tdID49IChwbDFbaV0gK21pbmRpcykgJiYgcGwyW2tdPD0ocGwxW2ldK21heGRpcykpID8gayA6IC0xO1xuICAgIGlmICh0ID4gLTEpIHtcbiAgICAgIHJbci5sZW5ndGhdPXBsMVtpXTtcbiAgICAgIGkrKztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGs+PXBsMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgdmFyIGsyPWluZGV4T2ZTb3J0ZWQgKHBsMSxwbDJba10tbWF4ZGlzKTtcbiAgICAgIGlmIChrMj5pKSB7XG4gICAgICAgIHZhciB0ID0gKHBsMltrXSA+PSAocGwxW2ldICttaW5kaXMpICYmIHBsMltrXTw9KHBsMVtpXSttYXhkaXMpKSA/IGsgOiAtMTtcbiAgICAgICAgaWYgKHQ+LTEpIHJbci5sZW5ndGhdPXBsMVtrMl07XG4gICAgICAgIGk9azI7XG4gICAgICB9IGVsc2UgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufVxuXG52YXIgcGxub3Rmb2xsb3cyID0gZnVuY3Rpb24gKHBsMSwgcGwyLCBtaW5kaXMsIG1heGRpcykge1xuICB2YXIgciA9IFtdLGk9MDtcbiAgXG4gIHdoaWxlIChpPHBsMS5sZW5ndGgpe1xuICAgIHZhciBrID0gaW5kZXhPZlNvcnRlZChwbDIsIHBsMVtpXSArIG1pbmRpcyk7XG4gICAgdmFyIHQgPSAocGwyW2tdID49IChwbDFbaV0gK21pbmRpcykgJiYgcGwyW2tdPD0ocGwxW2ldK21heGRpcykpID8gayA6IC0xO1xuICAgIGlmICh0ID4gLTEpIHtcbiAgICAgIGkrKztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGs+PXBsMi5sZW5ndGgpIHtcbiAgICAgICAgcj1yLmNvbmNhdChwbDEuc2xpY2UoaSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBrMj1pbmRleE9mU29ydGVkIChwbDEscGwyW2tdLW1heGRpcyk7XG4gICAgICAgIGlmIChrMj5pKSB7XG4gICAgICAgICAgcj1yLmNvbmNhdChwbDEuc2xpY2UoaSxrMikpO1xuICAgICAgICAgIGk9azI7XG4gICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHI7XG59XG4vKiB0aGlzIGlzIGluY29ycmVjdCAqL1xudmFyIHBsZm9sbG93ID0gZnVuY3Rpb24gKHBsMSwgcGwyLCBkaXN0YW5jZSkge1xuICB2YXIgciA9IFtdLGk9MDtcblxuICB3aGlsZSAoaTxwbDEubGVuZ3RoKXtcbiAgICB2YXIgayA9IGluZGV4T2ZTb3J0ZWQocGwyLCBwbDFbaV0gKyBkaXN0YW5jZSk7XG4gICAgdmFyIHQgPSAocGwyW2tdID09PSAocGwxW2ldICsgZGlzdGFuY2UpKSA/IGsgOiAtMTtcbiAgICBpZiAodCA+IC0xKSB7XG4gICAgICByLnB1c2gocGwxW2ldKTtcbiAgICAgIGkrKztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGs+PXBsMi5sZW5ndGgpIGJyZWFrO1xuICAgICAgdmFyIGsyPWluZGV4T2ZTb3J0ZWQgKHBsMSxwbDJba10tZGlzdGFuY2UpO1xuICAgICAgaWYgKGsyPmkpIHtcbiAgICAgICAgdCA9IChwbDJba10gPT09IChwbDFbazJdICsgZGlzdGFuY2UpKSA/IGsgOiAtMTtcbiAgICAgICAgaWYgKHQ+LTEpIHtcbiAgICAgICAgICAgci5wdXNoKHBsMVtrMl0pO1xuICAgICAgICAgICBrMisrO1xuICAgICAgICB9XG4gICAgICAgIGk9azI7XG4gICAgICB9IGVsc2UgYnJlYWs7XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufVxudmFyIHBsbm90Zm9sbG93ID0gZnVuY3Rpb24gKHBsMSwgcGwyLCBkaXN0YW5jZSkge1xuICB2YXIgciA9IFtdO1xuICB2YXIgciA9IFtdLGk9MDtcbiAgdmFyIHN3YXAgPSAwO1xuICBcbiAgd2hpbGUgKGk8cGwxLmxlbmd0aCl7XG4gICAgdmFyIGsgPSBpbmRleE9mU29ydGVkKHBsMiwgcGwxW2ldICsgZGlzdGFuY2UpO1xuICAgIHZhciB0ID0gKHBsMltrXSA9PT0gKHBsMVtpXSArIGRpc3RhbmNlKSkgPyBrIDogLTE7XG4gICAgaWYgKHQgPiAtMSkgeyBcbiAgICAgIGkrKztcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKGs+PXBsMi5sZW5ndGgpIHtcbiAgICAgICAgcj1yLmNvbmNhdChwbDEuc2xpY2UoaSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBrMj1pbmRleE9mU29ydGVkIChwbDEscGwyW2tdLWRpc3RhbmNlKTtcbiAgICAgICAgaWYgKGsyPmkpIHtcbiAgICAgICAgICByPXIuY29uY2F0KHBsMS5zbGljZShpLGsyKSk7XG4gICAgICAgICAgaT1rMjtcbiAgICAgICAgfSBlbHNlIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gcjtcbn1cbnZhciBwbGFuZCA9IGZ1bmN0aW9uIChwbDEsIHBsMiwgZGlzdGFuY2UpIHtcbiAgdmFyIHIgPSBbXTtcbiAgdmFyIHN3YXAgPSAwO1xuICBcbiAgaWYgKHBsMS5sZW5ndGggPiBwbDIubGVuZ3RoKSB7IC8vc3dhcCBmb3IgZmFzdGVyIGNvbXBhcmVcbiAgICB2YXIgdCA9IHBsMjtcbiAgICBwbDIgPSBwbDE7XG4gICAgcGwxID0gdDtcbiAgICBzd2FwID0gZGlzdGFuY2U7XG4gICAgZGlzdGFuY2UgPSAtZGlzdGFuY2U7XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwbDEubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgayA9IGluZGV4T2ZTb3J0ZWQocGwyLCBwbDFbaV0gKyBkaXN0YW5jZSk7XG4gICAgdmFyIHQgPSAocGwyW2tdID09PSAocGwxW2ldICsgZGlzdGFuY2UpKSA/IGsgOiAtMTtcbiAgICBpZiAodCA+IC0xKSB7XG4gICAgICByLnB1c2gocGwxW2ldIC0gc3dhcCk7XG4gICAgfVxuICB9XG4gIHJldHVybiByO1xufVxudmFyIGNvbWJpbmU9ZnVuY3Rpb24gKHBvc3RpbmdzKSB7XG4gIHZhciBvdXQ9W107XG4gIGZvciAodmFyIGkgaW4gcG9zdGluZ3MpIHtcbiAgICBvdXQ9b3V0LmNvbmNhdChwb3N0aW5nc1tpXSk7XG4gIH1cbiAgb3V0LnNvcnQoZnVuY3Rpb24oYSxiKXtyZXR1cm4gYS1ifSk7XG4gIHJldHVybiBvdXQ7XG59XG5cbnZhciB1bmlxdWUgPSBmdW5jdGlvbihhcil7XG4gICBpZiAoIWFyIHx8ICFhci5sZW5ndGgpIHJldHVybiBbXTtcbiAgIHZhciB1ID0ge30sIGEgPSBbXTtcbiAgIGZvcih2YXIgaSA9IDAsIGwgPSBhci5sZW5ndGg7IGkgPCBsOyArK2kpe1xuICAgIGlmKHUuaGFzT3duUHJvcGVydHkoYXJbaV0pKSBjb250aW51ZTtcbiAgICBhLnB1c2goYXJbaV0pO1xuICAgIHVbYXJbaV1dID0gMTtcbiAgIH1cbiAgIHJldHVybiBhO1xufVxuXG5cblxudmFyIHBscGhyYXNlID0gZnVuY3Rpb24gKHBvc3RpbmdzLG9wcykge1xuICB2YXIgciA9IFtdO1xuICBmb3IgKHZhciBpPTA7aTxwb3N0aW5ncy5sZW5ndGg7aSsrKSB7XG4gIFx0aWYgKCFwb3N0aW5nc1tpXSkgIHJldHVybiBbXTtcbiAgXHRpZiAoMCA9PT0gaSkge1xuICBcdCAgciA9IHBvc3RpbmdzWzBdO1xuICBcdH0gZWxzZSB7XG4gICAgICBpZiAob3BzW2ldPT0nYW5kbm90Jykge1xuICAgICAgICByID0gcGxub3Rmb2xsb3cociwgcG9zdGluZ3NbaV0sIGkpOyAgXG4gICAgICB9ZWxzZSB7XG4gICAgICAgIHIgPSBwbGFuZChyLCBwb3N0aW5nc1tpXSwgaSk7ICBcbiAgICAgIH1cbiAgXHR9XG4gIH1cbiAgXG4gIHJldHVybiByO1xufVxuLy9yZXR1cm4gYW4gYXJyYXkgb2YgZ3JvdXAgaGF2aW5nIGFueSBvZiBwbCBpdGVtXG52YXIgbWF0Y2hQb3N0aW5nPWZ1bmN0aW9uKHBsLGd1cGwsc3RhcnQsZW5kKSB7XG4gIHN0YXJ0PXN0YXJ0fHwwO1xuICBlbmQ9ZW5kfHwtMTtcbiAgaWYgKGVuZD09LTEpIGVuZD1NYXRoLnBvdygyLCA1Myk7IC8vIG1heCBpbnRlZ2VyIHZhbHVlXG5cbiAgdmFyIGNvdW50PTAsIGkgPSBqPSAwLCAgcmVzdWx0ID0gW10gLHY9MDtcbiAgdmFyIGRvY3M9W10sIGZyZXE9W107XG4gIGlmICghcGwpIHJldHVybiB7ZG9jczpbXSxmcmVxOltdfTtcbiAgd2hpbGUoIGkgPCBwbC5sZW5ndGggJiYgaiA8IGd1cGwubGVuZ3RoICl7XG4gICAgIGlmIChwbFtpXSA8IGd1cGxbal0gKXsgXG4gICAgICAgY291bnQrKztcbiAgICAgICB2PXBsW2ldO1xuICAgICAgIGkrKzsgXG4gICAgIH0gZWxzZSB7XG4gICAgICAgaWYgKGNvdW50KSB7XG4gICAgICAgIGlmICh2Pj1zdGFydCAmJiB2PGVuZCkge1xuICAgICAgICAgIGRvY3MucHVzaChqKTtcbiAgICAgICAgICBmcmVxLnB1c2goY291bnQpOyAgICAgICAgICBcbiAgICAgICAgfVxuICAgICAgIH1cbiAgICAgICBqKys7XG4gICAgICAgY291bnQ9MDtcbiAgICAgfVxuICB9XG4gIGlmIChjb3VudCAmJiBqPGd1cGwubGVuZ3RoICYmIHY+PXN0YXJ0ICYmIHY8ZW5kKSB7XG4gICAgZG9jcy5wdXNoKGopO1xuICAgIGZyZXEucHVzaChjb3VudCk7XG4gICAgY291bnQ9MDtcbiAgfVxuICBlbHNlIHtcbiAgICB3aGlsZSAoaj09Z3VwbC5sZW5ndGggJiYgaTxwbC5sZW5ndGggJiYgcGxbaV0gPj0gZ3VwbFtndXBsLmxlbmd0aC0xXSkge1xuICAgICAgaSsrO1xuICAgICAgY291bnQrKztcbiAgICB9XG4gICAgaWYgKHY+PXN0YXJ0ICYmIHY8ZW5kKSB7XG4gICAgICBkb2NzLnB1c2goaik7XG4gICAgICBmcmVxLnB1c2goY291bnQpOyAgICAgIFxuICAgIH1cbiAgfSBcbiAgcmV0dXJuIHtkb2NzOmRvY3MsZnJlcTpmcmVxfTtcbn1cblxudmFyIHRyaW09ZnVuY3Rpb24oYXJyLHN0YXJ0LGVuZCkge1xuICB2YXIgcz1pbmRleE9mU29ydGVkKGFycixzdGFydCk7XG4gIHZhciBlPWluZGV4T2ZTb3J0ZWQoYXJyLGVuZCk7XG4gIHJldHVybiBhcnIuc2xpY2UocyxlKzEpO1xufVxudmFyIHBsaXN0PXt9O1xucGxpc3QudW5wYWNrPXVucGFjaztcbnBsaXN0LnBscGhyYXNlPXBscGhyYXNlO1xucGxpc3QucGxoZWFkPXBsaGVhZDtcbnBsaXN0LnBsZm9sbG93Mj1wbGZvbGxvdzI7XG5wbGlzdC5wbG5vdGZvbGxvdzI9cGxub3Rmb2xsb3cyO1xucGxpc3QucGxmb2xsb3c9cGxmb2xsb3c7XG5wbGlzdC5wbG5vdGZvbGxvdz1wbG5vdGZvbGxvdztcbnBsaXN0LnVuaXF1ZT11bmlxdWU7XG5wbGlzdC5pbmRleE9mU29ydGVkPWluZGV4T2ZTb3J0ZWQ7XG5wbGlzdC5tYXRjaFBvc3Rpbmc9bWF0Y2hQb3N0aW5nO1xucGxpc3QudHJpbT10cmltO1xuXG5wbGlzdC5ncm91cGJ5c2xvdD1ncm91cGJ5c2xvdDtcbnBsaXN0Lmdyb3VwYnlibG9jazI9Z3JvdXBieWJsb2NrMjtcbnBsaXN0LmNvdW50Ynlwb3N0aW5nPWNvdW50Ynlwb3N0aW5nO1xucGxpc3QuZ3JvdXBieXBvc3Rpbmc9Z3JvdXBieXBvc3Rpbmc7XG5wbGlzdC5ncm91cGJ5cG9zdGluZzI9Z3JvdXBieXBvc3RpbmcyO1xucGxpc3QuZ3JvdXBzdW09Z3JvdXBzdW07XG5wbGlzdC5jb21iaW5lPWNvbWJpbmU7XG5tb2R1bGUuZXhwb3J0cz1wbGlzdDsiLCIvKiBUT0RPIHNvcnRlZCB0b2tlbnMgKi9cbnZhciBwbGlzdD1yZXF1aXJlKFwiLi9wbGlzdFwiKTtcbnZhciBib29sc2VhcmNoPXJlcXVpcmUoXCIuL2Jvb2xzZWFyY2hcIik7XG52YXIgZXhjZXJwdD1yZXF1aXJlKFwiLi9leGNlcnB0XCIpO1xudmFyIHBhcnNlVGVybSA9IGZ1bmN0aW9uKGVuZ2luZSxyYXcsb3B0cykge1xuXHRpZiAoIXJhdykgcmV0dXJuO1xuXHR2YXIgcmVzPXtyYXc6cmF3LHZhcmlhbnRzOltdLHRlcm06Jycsb3A6Jyd9O1xuXHR2YXIgdGVybT1yYXcsIG9wPTA7XG5cdHZhciBmaXJzdGNoYXI9dGVybVswXTtcblx0dmFyIHRlcm1yZWdleD1cIlwiO1xuXHRpZiAoZmlyc3RjaGFyPT0nLScpIHtcblx0XHR0ZXJtPXRlcm0uc3Vic3RyaW5nKDEpO1xuXHRcdGZpcnN0Y2hhcj10ZXJtWzBdO1xuXHRcdHJlcy5leGNsdWRlPXRydWU7IC8vZXhjbHVkZVxuXHR9XG5cdHRlcm09dGVybS50cmltKCk7XG5cdHZhciBsYXN0Y2hhcj10ZXJtW3Rlcm0ubGVuZ3RoLTFdO1xuXHR0ZXJtPWVuZ2luZS5hbmFseXplci5ub3JtYWxpemUodGVybSk7XG5cdFxuXHRpZiAodGVybS5pbmRleE9mKFwiJVwiKT4tMSkge1xuXHRcdHZhciB0ZXJtcmVnZXg9XCJeXCIrdGVybS5yZXBsYWNlKC8lKy9nLFwiLitcIikrXCIkXCI7XG5cdFx0aWYgKGZpcnN0Y2hhcj09XCIlXCIpIFx0dGVybXJlZ2V4PVwiLitcIit0ZXJtcmVnZXguc3Vic3RyKDEpO1xuXHRcdGlmIChsYXN0Y2hhcj09XCIlXCIpIFx0dGVybXJlZ2V4PXRlcm1yZWdleC5zdWJzdHIoMCx0ZXJtcmVnZXgubGVuZ3RoLTEpK1wiLitcIjtcblx0fVxuXG5cdGlmICh0ZXJtcmVnZXgpIHtcblx0XHRyZXMudmFyaWFudHM9ZXhwYW5kVGVybShlbmdpbmUsdGVybXJlZ2V4KTtcblx0fVxuXG5cdHJlcy5rZXk9dGVybTtcblx0cmV0dXJuIHJlcztcbn1cbnZhciBleHBhbmRUZXJtPWZ1bmN0aW9uKGVuZ2luZSxyZWdleCkge1xuXHR2YXIgcj1uZXcgUmVnRXhwKHJlZ2V4KTtcblx0dmFyIHRva2Vucz1lbmdpbmUuZ2V0KFwidG9rZW5zXCIpO1xuXHR2YXIgcG9zdGluZ3NMZW5ndGg9ZW5naW5lLmdldChcInBvc3RpbmdzTGVuZ3RoXCIpO1xuXHRpZiAoIXBvc3RpbmdzTGVuZ3RoKSBwb3N0aW5nc0xlbmd0aD1bXTtcblx0dmFyIG91dD1bXTtcblx0Zm9yICh2YXIgaT0wO2k8dG9rZW5zLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgbT10b2tlbnNbaV0ubWF0Y2gocik7XG5cdFx0aWYgKG0pIHtcblx0XHRcdG91dC5wdXNoKFttWzBdLHBvc3RpbmdzTGVuZ3RoW2ldfHwxXSk7XG5cdFx0fVxuXHR9XG5cdG91dC5zb3J0KGZ1bmN0aW9uKGEsYil7cmV0dXJuIGJbMV0tYVsxXX0pO1xuXHRyZXR1cm4gb3V0O1xufVxudmFyIGlzV2lsZGNhcmQ9ZnVuY3Rpb24ocmF3KSB7XG5cdHJldHVybiAhIXJhdy5tYXRjaCgvW1xcKlxcP10vKTtcbn1cblxudmFyIGlzT3JUZXJtPWZ1bmN0aW9uKHRlcm0pIHtcblx0dGVybT10ZXJtLnRyaW0oKTtcblx0cmV0dXJuICh0ZXJtW3Rlcm0ubGVuZ3RoLTFdPT09JywnKTtcbn1cbnZhciBvcnRlcm09ZnVuY3Rpb24oZW5naW5lLHRlcm0sa2V5KSB7XG5cdFx0dmFyIHQ9e3RleHQ6a2V5fTtcblx0XHRpZiAoZW5naW5lLmFuYWx5emVyLnNpbXBsaWZpZWRUb2tlbikge1xuXHRcdFx0dC5zaW1wbGlmaWVkPWVuZ2luZS5hbmFseXplci5zaW1wbGlmaWVkVG9rZW4oa2V5KTtcblx0XHR9XG5cdFx0dGVybS52YXJpYW50cy5wdXNoKHQpO1xufVxudmFyIG9yVGVybXM9ZnVuY3Rpb24oZW5naW5lLHRva2Vucyxub3cpIHtcblx0dmFyIHJhdz10b2tlbnNbbm93XTtcblx0dmFyIHRlcm09cGFyc2VUZXJtKGVuZ2luZSxyYXcpO1xuXHRpZiAoIXRlcm0pIHJldHVybjtcblx0b3J0ZXJtKGVuZ2luZSx0ZXJtLHRlcm0ua2V5KTtcblx0d2hpbGUgKGlzT3JUZXJtKHJhdykpICB7XG5cdFx0cmF3PXRva2Vuc1srK25vd107XG5cdFx0dmFyIHRlcm0yPXBhcnNlVGVybShlbmdpbmUscmF3KTtcblx0XHRvcnRlcm0oZW5naW5lLHRlcm0sdGVybTIua2V5KTtcblx0XHRmb3IgKHZhciBpIGluIHRlcm0yLnZhcmlhbnRzKXtcblx0XHRcdHRlcm0udmFyaWFudHNbaV09dGVybTIudmFyaWFudHNbaV07XG5cdFx0fVxuXHRcdHRlcm0ua2V5Kz0nLCcrdGVybTIua2V5O1xuXHR9XG5cdHJldHVybiB0ZXJtO1xufVxuXG52YXIgZ2V0T3BlcmF0b3I9ZnVuY3Rpb24ocmF3KSB7XG5cdHZhciBvcD0nJztcblx0aWYgKHJhd1swXT09JysnKSBvcD0naW5jbHVkZSc7XG5cdGlmIChyYXdbMF09PSctJykgb3A9J2V4Y2x1ZGUnO1xuXHRyZXR1cm4gb3A7XG59XG52YXIgcGFyc2VQaHJhc2U9ZnVuY3Rpb24ocSkge1xuXHR2YXIgbWF0Y2g9cS5tYXRjaCgvKFwiLis/XCJ8Jy4rPyd8XFxTKykvZylcblx0bWF0Y2g9bWF0Y2gubWFwKGZ1bmN0aW9uKHN0cil7XG5cdFx0dmFyIG49c3RyLmxlbmd0aCwgaD1zdHIuY2hhckF0KDApLCB0PXN0ci5jaGFyQXQobi0xKVxuXHRcdGlmIChoPT09dCYmKGg9PT0nXCInfGg9PT1cIidcIikpIHN0cj1zdHIuc3Vic3RyKDEsbi0yKVxuXHRcdHJldHVybiBzdHI7XG5cdH0pXG5cdHJldHVybiBtYXRjaDtcbn1cbnZhciB0aWJldGFuTnVtYmVyPXtcblx0XCJcXHUwZjIwXCI6XCIwXCIsXCJcXHUwZjIxXCI6XCIxXCIsXCJcXHUwZjIyXCI6XCIyXCIsXHRcIlxcdTBmMjNcIjpcIjNcIixcdFwiXFx1MGYyNFwiOlwiNFwiLFxuXHRcIlxcdTBmMjVcIjpcIjVcIixcIlxcdTBmMjZcIjpcIjZcIixcIlxcdTBmMjdcIjpcIjdcIixcIlxcdTBmMjhcIjpcIjhcIixcIlxcdTBmMjlcIjpcIjlcIlxufVxudmFyIHBhcnNlTnVtYmVyPWZ1bmN0aW9uKHJhdykge1xuXHR2YXIgbj1wYXJzZUludChyYXcsMTApO1xuXHRpZiAoaXNOYU4obikpe1xuXHRcdHZhciBjb252ZXJ0ZWQ9W107XG5cdFx0Zm9yICh2YXIgaT0wO2k8cmF3Lmxlbmd0aDtpKyspIHtcblx0XHRcdHZhciBubj10aWJldGFuTnVtYmVyW3Jhd1tpXV07XG5cdFx0XHRpZiAodHlwZW9mIG5uICE9XCJ1bmRlZmluZWRcIikgY29udmVydGVkW2ldPW5uO1xuXHRcdFx0ZWxzZSBicmVhaztcblx0XHR9XG5cdFx0cmV0dXJuIHBhcnNlSW50KGNvbnZlcnRlZCwxMCk7XG5cdH0gZWxzZSB7XG5cdFx0cmV0dXJuIG47XG5cdH1cbn1cbnZhciBwYXJzZVdpbGRjYXJkPWZ1bmN0aW9uKHJhdykge1xuXHR2YXIgbj1wYXJzZU51bWJlcihyYXcpIHx8IDE7XG5cdHZhciBxY291bnQ9cmF3LnNwbGl0KCc/JykubGVuZ3RoLTE7XG5cdHZhciBzY291bnQ9cmF3LnNwbGl0KCcqJykubGVuZ3RoLTE7XG5cdHZhciB0eXBlPScnO1xuXHRpZiAocWNvdW50KSB0eXBlPSc/Jztcblx0ZWxzZSBpZiAoc2NvdW50KSB0eXBlPScqJztcblx0cmV0dXJuIHt3aWxkY2FyZDp0eXBlLCB3aWR0aDogbiAsIG9wOid3aWxkY2FyZCd9O1xufVxuXG52YXIgbmV3UGhyYXNlPWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4ge3Rlcm1pZDpbXSxwb3N0aW5nOltdLHJhdzonJyx0ZXJtbGVuZ3RoOltdfTtcbn0gXG52YXIgcGFyc2VRdWVyeT1mdW5jdGlvbihxLHNlcCkge1xuXHRpZiAoc2VwICYmIHEuaW5kZXhPZihzZXApPi0xKSB7XG5cdFx0dmFyIG1hdGNoPXEuc3BsaXQoc2VwKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgbWF0Y2g9cS5tYXRjaCgvKFwiLis/XCJ8Jy4rPyd8XFxTKykvZylcblx0XHRtYXRjaD1tYXRjaC5tYXAoZnVuY3Rpb24oc3RyKXtcblx0XHRcdHZhciBuPXN0ci5sZW5ndGgsIGg9c3RyLmNoYXJBdCgwKSwgdD1zdHIuY2hhckF0KG4tMSlcblx0XHRcdGlmIChoPT09dCYmKGg9PT0nXCInfGg9PT1cIidcIikpIHN0cj1zdHIuc3Vic3RyKDEsbi0yKVxuXHRcdFx0cmV0dXJuIHN0clxuXHRcdH0pXG5cdFx0Ly9jb25zb2xlLmxvZyhpbnB1dCwnPT0+JyxtYXRjaClcdFx0XG5cdH1cblx0cmV0dXJuIG1hdGNoO1xufVxudmFyIGxvYWRQaHJhc2U9ZnVuY3Rpb24ocGhyYXNlKSB7XG5cdC8qIHJlbW92ZSBsZWFkaW5nIGFuZCBlbmRpbmcgd2lsZGNhcmQgKi9cblx0dmFyIFE9dGhpcztcblx0dmFyIGNhY2hlPVEuZW5naW5lLnBvc3RpbmdDYWNoZTtcblx0aWYgKGNhY2hlW3BocmFzZS5rZXldKSB7XG5cdFx0cGhyYXNlLnBvc3Rpbmc9Y2FjaGVbcGhyYXNlLmtleV07XG5cdFx0cmV0dXJuIFE7XG5cdH1cblx0aWYgKHBocmFzZS50ZXJtaWQubGVuZ3RoPT0xKSB7XG5cdFx0aWYgKCFRLnRlcm1zLmxlbmd0aCl7XG5cdFx0XHRwaHJhc2UucG9zdGluZz1bXTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Y2FjaGVbcGhyYXNlLmtleV09cGhyYXNlLnBvc3Rpbmc9US50ZXJtc1twaHJhc2UudGVybWlkWzBdXS5wb3N0aW5nO1x0XG5cdFx0fVxuXHRcdHJldHVybiBRO1xuXHR9XG5cblx0dmFyIGk9MCwgcj1bXSxkaXM9MDtcblx0d2hpbGUoaTxwaHJhc2UudGVybWlkLmxlbmd0aCkge1xuXHQgIHZhciBUPVEudGVybXNbcGhyYXNlLnRlcm1pZFtpXV07XG5cdFx0aWYgKDAgPT09IGkpIHtcblx0XHRcdHIgPSBULnBvc3Rpbmc7XG5cdFx0fSBlbHNlIHtcblx0XHQgICAgaWYgKFQub3A9PSd3aWxkY2FyZCcpIHtcblx0XHQgICAgXHRUPVEudGVybXNbcGhyYXNlLnRlcm1pZFtpKytdXTtcblx0XHQgICAgXHR2YXIgd2lkdGg9VC53aWR0aDtcblx0XHQgICAgXHR2YXIgd2lsZGNhcmQ9VC53aWxkY2FyZDtcblx0XHQgICAgXHRUPVEudGVybXNbcGhyYXNlLnRlcm1pZFtpXV07XG5cdFx0ICAgIFx0dmFyIG1pbmRpcz1kaXM7XG5cdFx0ICAgIFx0aWYgKHdpbGRjYXJkPT0nPycpIG1pbmRpcz1kaXMrd2lkdGg7XG5cdFx0ICAgIFx0aWYgKFQuZXhjbHVkZSkgciA9IHBsaXN0LnBsbm90Zm9sbG93MihyLCBULnBvc3RpbmcsIG1pbmRpcywgZGlzK3dpZHRoKTtcblx0XHQgICAgXHRlbHNlIHIgPSBwbGlzdC5wbGZvbGxvdzIociwgVC5wb3N0aW5nLCBtaW5kaXMsIGRpcyt3aWR0aCk7XHRcdCAgICBcdFxuXHRcdCAgICBcdGRpcys9KHdpZHRoLTEpO1xuXHRcdCAgICB9ZWxzZSB7XG5cdFx0ICAgIFx0aWYgKFQucG9zdGluZykge1xuXHRcdCAgICBcdFx0aWYgKFQuZXhjbHVkZSkgciA9IHBsaXN0LnBsbm90Zm9sbG93KHIsIFQucG9zdGluZywgZGlzKTtcblx0XHQgICAgXHRcdGVsc2UgciA9IHBsaXN0LnBsZm9sbG93KHIsIFQucG9zdGluZywgZGlzKTtcblx0XHQgICAgXHR9XG5cdFx0ICAgIH1cblx0XHR9XG5cdFx0ZGlzICs9IHBocmFzZS50ZXJtbGVuZ3RoW2ldO1xuXHRcdGkrKztcblx0XHRpZiAoIXIpIHJldHVybiBRO1xuICB9XG4gIHBocmFzZS5wb3N0aW5nPXI7XG4gIGNhY2hlW3BocmFzZS5rZXldPXI7XG4gIHJldHVybiBRO1xufVxudmFyIHRyaW1TcGFjZT1mdW5jdGlvbihlbmdpbmUscXVlcnkpIHtcblx0aWYgKCFxdWVyeSkgcmV0dXJuIFwiXCI7XG5cdHZhciBpPTA7XG5cdHZhciBpc1NraXA9ZW5naW5lLmFuYWx5emVyLmlzU2tpcDtcblx0d2hpbGUgKGlzU2tpcChxdWVyeVtpXSkgJiYgaTxxdWVyeS5sZW5ndGgpIGkrKztcblx0cmV0dXJuIHF1ZXJ5LnN1YnN0cmluZyhpKTtcbn1cbnZhciBnZXRQYWdlV2l0aEhpdD1mdW5jdGlvbihmaWxlaWQsb2Zmc2V0cykge1xuXHR2YXIgUT10aGlzLGVuZ2luZT1RLmVuZ2luZTtcblx0dmFyIHBhZ2V3aXRoaGl0PXBsaXN0Lmdyb3VwYnlwb3N0aW5nMihRLmJ5RmlsZVtmaWxlaWQgXSwgb2Zmc2V0cyk7XG5cdGlmIChwYWdld2l0aGhpdC5sZW5ndGgpIHBhZ2V3aXRoaGl0LnNoaWZ0KCk7IC8vdGhlIGZpcnN0IGl0ZW0gaXMgbm90IHVzZWQgKDB+US5ieUZpbGVbMF0gKVxuXHR2YXIgb3V0PVtdO1xuXHRwYWdld2l0aGhpdC5tYXAoZnVuY3Rpb24ocCxpZHgpe2lmIChwLmxlbmd0aCkgb3V0LnB1c2goaWR4KX0pO1xuXHRyZXR1cm4gb3V0O1xufVxudmFyIHBhZ2VXaXRoSGl0PWZ1bmN0aW9uKGZpbGVpZCkge1xuXHR2YXIgUT10aGlzLGVuZ2luZT1RLmVuZ2luZTtcblx0dmFyIG9mZnNldHM9ZW5naW5lLmdldEZpbGVQYWdlT2Zmc2V0cyhmaWxlaWQpO1xuXHRyZXR1cm4gZ2V0UGFnZVdpdGhIaXQuYXBwbHkodGhpcyxbZmlsZWlkLG9mZnNldHNdKTtcbn1cbnZhciBpc1NpbXBsZVBocmFzZT1mdW5jdGlvbihwaHJhc2UpIHtcblx0dmFyIG09cGhyYXNlLm1hdGNoKC9bXFw/JV5dLyk7XG5cdHJldHVybiAhbTtcbn1cblxuLy8g55m86I+p5o+Q5b+DICAgPT0+IOeZvOiPqSAg5o+Q5b+DICAgICAgIDIgMiAgIFxuLy8g6I+p5o+Q5b+DICAgICA9PT4g6I+p5o+QICDmj5Dlv4MgICAgICAgMSAyXG4vLyDliqvliqsgICAgICAgPT0+IOWKqyAgICDliqsgICAgICAgICAxIDEgICAvLyBpbnZhbGlkXG4vLyDlm6Dnt6PmiYDnlJ/pgZMgID09PiDlm6Dnt6MgIOaJgOeUnyAgIOmBkyAgIDIgMiAxXG52YXIgc3BsaXRQaHJhc2U9ZnVuY3Rpb24oZW5naW5lLHNpbXBsZXBocmFzZSxiaWdyYW0pIHtcblx0dmFyIGJpZ3JhbT1iaWdyYW18fGVuZ2luZS5nZXQoXCJtZXRhXCIpLmJpZ3JhbXx8W107XG5cdHZhciB0b2tlbnM9ZW5naW5lLmFuYWx5emVyLnRva2VuaXplKHNpbXBsZXBocmFzZSkudG9rZW5zO1xuXHR2YXIgbG9hZHRva2Vucz1bXSxsZW5ndGhzPVtdLGo9MCxsYXN0YmlncmFtcG9zPS0xO1xuXHR3aGlsZSAoaisxPHRva2Vucy5sZW5ndGgpIHtcblx0XHR2YXIgdG9rZW49ZW5naW5lLmFuYWx5emVyLm5vcm1hbGl6ZSh0b2tlbnNbal0pO1xuXHRcdHZhciBuZXh0dG9rZW49ZW5naW5lLmFuYWx5emVyLm5vcm1hbGl6ZSh0b2tlbnNbaisxXSk7XG5cdFx0dmFyIGJpPXRva2VuK25leHR0b2tlbjtcblx0XHR2YXIgaT1wbGlzdC5pbmRleE9mU29ydGVkKGJpZ3JhbSxiaSk7XG5cdFx0aWYgKGJpZ3JhbVtpXT09YmkpIHtcblx0XHRcdGxvYWR0b2tlbnMucHVzaChiaSk7XG5cdFx0XHRpZiAoaiszPHRva2Vucy5sZW5ndGgpIHtcblx0XHRcdFx0bGFzdGJpZ3JhbXBvcz1qO1xuXHRcdFx0XHRqKys7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRpZiAoaisyPT10b2tlbnMubGVuZ3RoKXsgXG5cdFx0XHRcdFx0aWYgKGxhc3RiaWdyYW1wb3MrMT09aiApIHtcblx0XHRcdFx0XHRcdGxlbmd0aHNbbGVuZ3Rocy5sZW5ndGgtMV0tLTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGFzdGJpZ3JhbXBvcz1qO1xuXHRcdFx0XHRcdGorKztcblx0XHRcdFx0fWVsc2Uge1xuXHRcdFx0XHRcdGxhc3RiaWdyYW1wb3M9ajtcdFxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHRsZW5ndGhzLnB1c2goMik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmICghYmlncmFtIHx8IGxhc3RiaWdyYW1wb3M9PS0xIHx8IGxhc3RiaWdyYW1wb3MrMSE9aikge1xuXHRcdFx0XHRsb2FkdG9rZW5zLnB1c2godG9rZW4pO1xuXHRcdFx0XHRsZW5ndGhzLnB1c2goMSk7XHRcdFx0XHRcblx0XHRcdH1cblx0XHR9XG5cdFx0aisrO1xuXHR9XG5cblx0d2hpbGUgKGo8dG9rZW5zLmxlbmd0aCkge1xuXHRcdHZhciB0b2tlbj1lbmdpbmUuYW5hbHl6ZXIubm9ybWFsaXplKHRva2Vuc1tqXSk7XG5cdFx0bG9hZHRva2Vucy5wdXNoKHRva2VuKTtcblx0XHRsZW5ndGhzLnB1c2goMSk7XG5cdFx0aisrO1xuXHR9XG5cblx0cmV0dXJuIHt0b2tlbnM6bG9hZHRva2VucywgbGVuZ3RoczogbGVuZ3RocyAsIHRva2VubGVuZ3RoOiB0b2tlbnMubGVuZ3RofTtcbn1cbi8qIGhvc3QgaGFzIGZhc3QgbmF0aXZlIGZ1bmN0aW9uICovXG52YXIgZmFzdFBocmFzZT1mdW5jdGlvbihlbmdpbmUscGhyYXNlKSB7XG5cdHZhciBwaHJhc2VfdGVybT1uZXdQaHJhc2UoKTtcblx0Ly92YXIgdG9rZW5zPWVuZ2luZS5hbmFseXplci50b2tlbml6ZShwaHJhc2UpLnRva2Vucztcblx0dmFyIHNwbGl0dGVkPXNwbGl0UGhyYXNlKGVuZ2luZSxwaHJhc2UpO1xuXG5cdHZhciBwYXRocz1wb3N0aW5nUGF0aEZyb21Ub2tlbnMoZW5naW5lLHNwbGl0dGVkLnRva2Vucyk7XG4vL2NyZWF0ZSB3aWxkY2FyZFxuXG5cdHBocmFzZV90ZXJtLndpZHRoPXNwbGl0dGVkLnRva2VubGVuZ3RoOyAvL2ZvciBleGNlcnB0LmpzIHRvIGdldFBocmFzZVdpZHRoXG5cblx0ZW5naW5lLmdldChwYXRocyx7YWRkcmVzczp0cnVlfSxmdW5jdGlvbihwb3N0aW5nQWRkcmVzcyl7IC8vdGhpcyBpcyBzeW5jXG5cdFx0cGhyYXNlX3Rlcm0ua2V5PXBocmFzZTtcblx0XHR2YXIgcG9zdGluZ0FkZHJlc3NXaXRoV2lsZGNhcmQ9W107XG5cdFx0Zm9yICh2YXIgaT0wO2k8cG9zdGluZ0FkZHJlc3MubGVuZ3RoO2krKykge1xuXHRcdFx0cG9zdGluZ0FkZHJlc3NXaXRoV2lsZGNhcmQucHVzaChwb3N0aW5nQWRkcmVzc1tpXSk7XG5cdFx0XHRpZiAoc3BsaXR0ZWQubGVuZ3Roc1tpXT4xKSB7XG5cdFx0XHRcdHBvc3RpbmdBZGRyZXNzV2l0aFdpbGRjYXJkLnB1c2goW3NwbGl0dGVkLmxlbmd0aHNbaV0sMF0pOyAvL3dpbGRjYXJkIGhhcyBibG9ja3NpemU9PTAgXG5cdFx0XHR9XG5cdFx0fVxuXHRcdGVuZ2luZS5wb3N0aW5nQ2FjaGVbcGhyYXNlXT1lbmdpbmUubWVyZ2VQb3N0aW5ncyhwb3N0aW5nQWRkcmVzc1dpdGhXaWxkY2FyZCk7XG5cdH0pO1xuXHRyZXR1cm4gcGhyYXNlX3Rlcm07XG5cdC8vIHB1dCBwb3N0aW5nIGludG8gY2FjaGVbcGhyYXNlLmtleV1cbn1cbnZhciBzbG93UGhyYXNlPWZ1bmN0aW9uKGVuZ2luZSx0ZXJtcyxwaHJhc2UpIHtcblx0dmFyIGo9MCx0b2tlbnM9ZW5naW5lLmFuYWx5emVyLnRva2VuaXplKHBocmFzZSkudG9rZW5zO1xuXHR2YXIgcGhyYXNlX3Rlcm09bmV3UGhyYXNlKCk7XG5cdHZhciB0ZXJtaWQ9MDtcblx0d2hpbGUgKGo8dG9rZW5zLmxlbmd0aCkge1xuXHRcdHZhciByYXc9dG9rZW5zW2pdLCB0ZXJtbGVuZ3RoPTE7XG5cdFx0aWYgKGlzV2lsZGNhcmQocmF3KSkge1xuXHRcdFx0aWYgKHBocmFzZV90ZXJtLnRlcm1pZC5sZW5ndGg9PTApICB7IC8vc2tpcCBsZWFkaW5nIHdpbGQgY2FyZFxuXHRcdFx0XHRqKytcblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cdFx0XHR0ZXJtcy5wdXNoKHBhcnNlV2lsZGNhcmQocmF3KSk7XG5cdFx0XHR0ZXJtaWQ9dGVybXMubGVuZ3RoLTE7XG5cdFx0XHRwaHJhc2VfdGVybS50ZXJtaWQucHVzaCh0ZXJtaWQpO1xuXHRcdFx0cGhyYXNlX3Rlcm0udGVybWxlbmd0aC5wdXNoKHRlcm1sZW5ndGgpO1xuXHRcdH0gZWxzZSBpZiAoaXNPclRlcm0ocmF3KSl7XG5cdFx0XHR2YXIgdGVybT1vclRlcm1zLmFwcGx5KHRoaXMsW3Rva2VucyxqXSk7XG5cdFx0XHRpZiAodGVybSkge1xuXHRcdFx0XHR0ZXJtcy5wdXNoKHRlcm0pO1xuXHRcdFx0XHR0ZXJtaWQ9dGVybXMubGVuZ3RoLTE7XG5cdFx0XHRcdGorPXRlcm0ua2V5LnNwbGl0KCcsJykubGVuZ3RoLTE7XHRcdFx0XHRcdFxuXHRcdFx0fVxuXHRcdFx0aisrO1xuXHRcdFx0cGhyYXNlX3Rlcm0udGVybWlkLnB1c2godGVybWlkKTtcblx0XHRcdHBocmFzZV90ZXJtLnRlcm1sZW5ndGgucHVzaCh0ZXJtbGVuZ3RoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBocmFzZT1cIlwiO1xuXHRcdFx0d2hpbGUgKGo8dG9rZW5zLmxlbmd0aCkge1xuXHRcdFx0XHRpZiAoIShpc1dpbGRjYXJkKHRva2Vuc1tqXSkgfHwgaXNPclRlcm0odG9rZW5zW2pdKSkpIHtcblx0XHRcdFx0XHRwaHJhc2UrPXRva2Vuc1tqXTtcblx0XHRcdFx0XHRqKys7XG5cdFx0XHRcdH0gZWxzZSBicmVhaztcblx0XHRcdH1cblxuXHRcdFx0dmFyIHNwbGl0dGVkPXNwbGl0UGhyYXNlKGVuZ2luZSxwaHJhc2UpO1xuXHRcdFx0Zm9yICh2YXIgaT0wO2k8c3BsaXR0ZWQudG9rZW5zLmxlbmd0aDtpKyspIHtcblxuXHRcdFx0XHR2YXIgdGVybT1wYXJzZVRlcm0oZW5naW5lLHNwbGl0dGVkLnRva2Vuc1tpXSk7XG5cdFx0XHRcdHZhciB0ZXJtaWR4PXRlcm1zLm1hcChmdW5jdGlvbihhKXtyZXR1cm4gYS5rZXl9KS5pbmRleE9mKHRlcm0ua2V5KTtcblx0XHRcdFx0aWYgKHRlcm1pZHg9PS0xKSB7XG5cdFx0XHRcdFx0dGVybXMucHVzaCh0ZXJtKTtcblx0XHRcdFx0XHR0ZXJtaWQ9dGVybXMubGVuZ3RoLTE7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0dGVybWlkPXRlcm1pZHg7XG5cdFx0XHRcdH1cdFx0XHRcdFxuXHRcdFx0XHRwaHJhc2VfdGVybS50ZXJtaWQucHVzaCh0ZXJtaWQpO1xuXHRcdFx0XHRwaHJhc2VfdGVybS50ZXJtbGVuZ3RoLnB1c2goc3BsaXR0ZWQubGVuZ3Roc1tpXSk7XG5cdFx0XHR9XG5cdFx0fVxuXHRcdGorKztcblx0fVxuXHRwaHJhc2VfdGVybS5rZXk9cGhyYXNlO1xuXHQvL3JlbW92ZSBlbmRpbmcgd2lsZGNhcmRcblx0dmFyIFA9cGhyYXNlX3Rlcm0gLCBUPW51bGw7XG5cdGRvIHtcblx0XHRUPXRlcm1zW1AudGVybWlkW1AudGVybWlkLmxlbmd0aC0xXV07XG5cdFx0aWYgKCFUKSBicmVhaztcblx0XHRpZiAoVC53aWxkY2FyZCkgUC50ZXJtaWQucG9wKCk7IGVsc2UgYnJlYWs7XG5cdH0gd2hpbGUoVCk7XHRcdFxuXHRyZXR1cm4gcGhyYXNlX3Rlcm07XG59XG52YXIgbmV3UXVlcnkgPWZ1bmN0aW9uKGVuZ2luZSxxdWVyeSxvcHRzKSB7XG5cdC8vaWYgKCFxdWVyeSkgcmV0dXJuO1xuXHRvcHRzPW9wdHN8fHt9O1xuXHRxdWVyeT10cmltU3BhY2UoZW5naW5lLHF1ZXJ5KTtcblxuXHR2YXIgcGhyYXNlcz1xdWVyeSxwaHJhc2VzPVtdO1xuXHRpZiAodHlwZW9mIHF1ZXJ5PT0nc3RyaW5nJyAmJiBxdWVyeSkge1xuXHRcdHBocmFzZXM9cGFyc2VRdWVyeShxdWVyeSxvcHRzLnBocmFzZV9zZXAgfHwgXCJcIik7XG5cdH1cblx0XG5cdHZhciBwaHJhc2VfdGVybXM9W10sIHRlcm1zPVtdLHZhcmlhbnRzPVtdLG9wZXJhdG9ycz1bXTtcblx0dmFyIHBjPTA7Ly9waHJhc2UgY291bnRcblx0Zm9yICAodmFyIGk9MDtpPHBocmFzZXMubGVuZ3RoO2krKykge1xuXHRcdHZhciBvcD1nZXRPcGVyYXRvcihwaHJhc2VzW3BjXSk7XG5cdFx0aWYgKG9wKSBwaHJhc2VzW3BjXT1waHJhc2VzW3BjXS5zdWJzdHJpbmcoMSk7XG5cblx0XHQvKiBhdXRvIGFkZCArIGZvciBuYXR1cmFsIG9yZGVyID8qL1xuXHRcdC8vaWYgKCFvcHRzLnJhbmsgJiYgb3AhPSdleGNsdWRlJyAmJmkpIG9wPSdpbmNsdWRlJztcblx0XHRvcGVyYXRvcnMucHVzaChvcCk7XG5cblx0XHRpZiAoaXNTaW1wbGVQaHJhc2UocGhyYXNlc1twY10pICYmIGVuZ2luZS5tZXJnZVBvc3RpbmdzICkge1xuXHRcdFx0dmFyIHBocmFzZV90ZXJtPWZhc3RQaHJhc2UoZW5naW5lLHBocmFzZXNbcGNdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBocmFzZV90ZXJtPXNsb3dQaHJhc2UoZW5naW5lLHRlcm1zLHBocmFzZXNbcGNdKTtcblx0XHR9XG5cdFx0cGhyYXNlX3Rlcm1zLnB1c2gocGhyYXNlX3Rlcm0pO1xuXG5cdFx0aWYgKCFlbmdpbmUubWVyZ2VQb3N0aW5ncyAmJiBwaHJhc2VfdGVybXNbcGNdLnRlcm1pZC5sZW5ndGg9PTApIHtcblx0XHRcdHBocmFzZV90ZXJtcy5wb3AoKTtcblx0XHR9IGVsc2UgcGMrKztcblx0fVxuXHRvcHRzLm9wPW9wZXJhdG9ycztcblxuXHR2YXIgUT17ZGJuYW1lOmVuZ2luZS5kYm5hbWUsZW5naW5lOmVuZ2luZSxvcHRzOm9wdHMscXVlcnk6cXVlcnksXG5cdFx0cGhyYXNlczpwaHJhc2VfdGVybXMsdGVybXM6dGVybXNcblx0fTtcblx0US50b2tlbml6ZT1mdW5jdGlvbigpIHtyZXR1cm4gZW5naW5lLmFuYWx5emVyLnRva2VuaXplLmFwcGx5KGVuZ2luZSxhcmd1bWVudHMpO31cblx0US5pc1NraXA9ZnVuY3Rpb24oKSB7cmV0dXJuIGVuZ2luZS5hbmFseXplci5pc1NraXAuYXBwbHkoZW5naW5lLGFyZ3VtZW50cyk7fVxuXHRRLm5vcm1hbGl6ZT1mdW5jdGlvbigpIHtyZXR1cm4gZW5naW5lLmFuYWx5emVyLm5vcm1hbGl6ZS5hcHBseShlbmdpbmUsYXJndW1lbnRzKTt9XG5cdFEucGFnZVdpdGhIaXQ9cGFnZVdpdGhIaXQ7XG5cblx0Ly9RLmdldFJhbmdlPWZ1bmN0aW9uKCkge3JldHVybiB0aGF0LmdldFJhbmdlLmFwcGx5KHRoYXQsYXJndW1lbnRzKX07XG5cdC8vQVBJLnF1ZXJ5aWQ9J1EnKyhNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkqMTAwMDAwMDApKS50b1N0cmluZygxNik7XG5cdHJldHVybiBRO1xufVxudmFyIHBvc3RpbmdQYXRoRnJvbVRva2Vucz1mdW5jdGlvbihlbmdpbmUsdG9rZW5zKSB7XG5cdHZhciBhbGx0b2tlbnM9ZW5naW5lLmdldChcInRva2Vuc1wiKTtcblxuXHR2YXIgdG9rZW5JZHM9dG9rZW5zLm1hcChmdW5jdGlvbih0KXsgcmV0dXJuIDErYWxsdG9rZW5zLmluZGV4T2YodCl9KTtcblx0dmFyIHBvc3RpbmdpZD1bXTtcblx0Zm9yICh2YXIgaT0wO2k8dG9rZW5JZHMubGVuZ3RoO2krKykge1xuXHRcdHBvc3RpbmdpZC5wdXNoKCB0b2tlbklkc1tpXSk7IC8vIHRva2VuSWQ9PTAgLCBlbXB0eSB0b2tlblxuXHR9XG5cdHJldHVybiBwb3N0aW5naWQubWFwKGZ1bmN0aW9uKHQpe3JldHVybiBbXCJwb3N0aW5nc1wiLHRdfSk7XG59XG52YXIgbG9hZFBvc3RpbmdzPWZ1bmN0aW9uKGVuZ2luZSx0b2tlbnMsY2IpIHtcblx0dmFyIHRvbG9hZHRva2Vucz10b2tlbnMuZmlsdGVyKGZ1bmN0aW9uKHQpe1xuXHRcdHJldHVybiAhZW5naW5lLnBvc3RpbmdDYWNoZVt0LmtleV07IC8vYWxyZWFkeSBpbiBjYWNoZVxuXHR9KTtcblx0aWYgKHRvbG9hZHRva2Vucy5sZW5ndGg9PTApIHtcblx0XHRjYigpO1xuXHRcdHJldHVybjtcblx0fVxuXHR2YXIgcG9zdGluZ1BhdGhzPXBvc3RpbmdQYXRoRnJvbVRva2VucyhlbmdpbmUsdG9rZW5zLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5rZXl9KSk7XG5cdGVuZ2luZS5nZXQocG9zdGluZ1BhdGhzLGZ1bmN0aW9uKHBvc3RpbmdzKXtcblx0XHRwb3N0aW5ncy5tYXAoZnVuY3Rpb24ocCxpKSB7IHRva2Vuc1tpXS5wb3N0aW5nPXAgfSk7XG5cdFx0aWYgKGNiKSBjYigpO1xuXHR9KTtcbn1cbnZhciBncm91cEJ5PWZ1bmN0aW9uKFEscG9zdGluZykge1xuXHRwaHJhc2VzLmZvckVhY2goZnVuY3Rpb24oUCl7XG5cdFx0dmFyIGtleT1QLmtleTtcblx0XHR2YXIgZG9jZnJlcT1kb2NmcmVxY2FjaGVba2V5XTtcblx0XHRpZiAoIWRvY2ZyZXEpIGRvY2ZyZXE9ZG9jZnJlcWNhY2hlW2tleV09e307XG5cdFx0aWYgKCFkb2NmcmVxW3RoYXQuZ3JvdXB1bml0XSkge1xuXHRcdFx0ZG9jZnJlcVt0aGF0Lmdyb3VwdW5pdF09e2RvY2xpc3Q6bnVsbCxmcmVxOm51bGx9O1xuXHRcdH1cdFx0XG5cdFx0aWYgKFAucG9zdGluZykge1xuXHRcdFx0dmFyIHJlcz1tYXRjaFBvc3RpbmcoZW5naW5lLFAucG9zdGluZyk7XG5cdFx0XHRQLmZyZXE9cmVzLmZyZXE7XG5cdFx0XHRQLmRvY3M9cmVzLmRvY3M7XG5cdFx0fSBlbHNlIHtcblx0XHRcdFAuZG9jcz1bXTtcblx0XHRcdFAuZnJlcT1bXTtcblx0XHR9XG5cdFx0ZG9jZnJlcVt0aGF0Lmdyb3VwdW5pdF09e2RvY2xpc3Q6UC5kb2NzLGZyZXE6UC5mcmVxfTtcblx0fSk7XG5cdHJldHVybiB0aGlzO1xufVxudmFyIGdyb3VwQnlGb2xkZXI9ZnVuY3Rpb24oZW5naW5lLGZpbGVoaXRzKSB7XG5cdHZhciBmaWxlcz1lbmdpbmUuZ2V0KFwiZmlsZU5hbWVzXCIpO1xuXHR2YXIgcHJldmZvbGRlcj1cIlwiLGhpdHM9MCxvdXQ9W107XG5cdGZvciAodmFyIGk9MDtpPGZpbGVoaXRzLmxlbmd0aDtpKyspIHtcblx0XHR2YXIgZm49ZmlsZXNbaV07XG5cdFx0dmFyIGZvbGRlcj1mbi5zdWJzdHJpbmcoMCxmbi5pbmRleE9mKCcvJykpO1xuXHRcdGlmIChwcmV2Zm9sZGVyICYmIHByZXZmb2xkZXIhPWZvbGRlcikge1xuXHRcdFx0b3V0LnB1c2goaGl0cyk7XG5cdFx0XHRoaXRzPTA7XG5cdFx0fVxuXHRcdGhpdHMrPWZpbGVoaXRzW2ldLmxlbmd0aDtcblx0XHRwcmV2Zm9sZGVyPWZvbGRlcjtcblx0fVxuXHRvdXQucHVzaChoaXRzKTtcblx0cmV0dXJuIG91dDtcbn1cbnZhciBwaHJhc2VfaW50ZXJzZWN0PWZ1bmN0aW9uKGVuZ2luZSxRKSB7XG5cdHZhciBpbnRlcnNlY3RlZD1udWxsO1xuXHR2YXIgZmlsZU9mZnNldHM9US5lbmdpbmUuZ2V0KFwiZmlsZU9mZnNldHNcIik7XG5cdHZhciBlbXB0eT1bXSxlbXB0eWNvdW50PTAsaGFzaGl0PTA7XG5cdGZvciAodmFyIGk9MDtpPFEucGhyYXNlcy5sZW5ndGg7aSsrKSB7XG5cdFx0dmFyIGJ5ZmlsZT1wbGlzdC5ncm91cGJ5cG9zdGluZzIoUS5waHJhc2VzW2ldLnBvc3RpbmcsZmlsZU9mZnNldHMpO1xuXHRcdGlmIChieWZpbGUubGVuZ3RoKSBieWZpbGUuc2hpZnQoKTtcblx0XHRpZiAoYnlmaWxlLmxlbmd0aCkgYnlmaWxlLnBvcCgpO1xuXHRcdGJ5ZmlsZS5wb3AoKTtcblx0XHRpZiAoaW50ZXJzZWN0ZWQ9PW51bGwpIHtcblx0XHRcdGludGVyc2VjdGVkPWJ5ZmlsZTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0Zm9yICh2YXIgaj0wO2o8YnlmaWxlLmxlbmd0aDtqKyspIHtcblx0XHRcdFx0aWYgKCEoYnlmaWxlW2pdLmxlbmd0aCAmJiBpbnRlcnNlY3RlZFtqXS5sZW5ndGgpKSB7XG5cdFx0XHRcdFx0aW50ZXJzZWN0ZWRbal09ZW1wdHk7IC8vcmV1c2UgZW1wdHkgYXJyYXlcblx0XHRcdFx0XHRlbXB0eWNvdW50Kys7XG5cdFx0XHRcdH0gZWxzZSBoYXNoaXQrKztcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHRRLmJ5RmlsZT1pbnRlcnNlY3RlZDtcblx0US5ieUZvbGRlcj1ncm91cEJ5Rm9sZGVyKGVuZ2luZSxRLmJ5RmlsZSk7XG5cdHZhciBvdXQ9W107XG5cdC8vY2FsY3VsYXRlIG5ldyByYXdwb3N0aW5nXG5cdGZvciAodmFyIGk9MDtpPFEuYnlGaWxlLmxlbmd0aDtpKyspIHtcblx0XHRpZiAoUS5ieUZpbGVbaV0ubGVuZ3RoKSBvdXQ9b3V0LmNvbmNhdChRLmJ5RmlsZVtpXSk7XG5cdH1cblx0US5yYXdyZXN1bHQ9b3V0O1xuXHRjb3VudEZvbGRlckZpbGUoUSk7XG59XG52YXIgY291bnRGb2xkZXJGaWxlPWZ1bmN0aW9uKFEpIHtcblx0US5maWxlV2l0aEhpdENvdW50PTA7XG5cdFEuYnlGaWxlLm1hcChmdW5jdGlvbihmKXtpZiAoZi5sZW5ndGgpIFEuZmlsZVdpdGhIaXRDb3VudCsrfSk7XG5cdFx0XHRcblx0US5mb2xkZXJXaXRoSGl0Q291bnQ9MDtcblx0US5ieUZvbGRlci5tYXAoZnVuY3Rpb24oZil7aWYgKGYpIFEuZm9sZGVyV2l0aEhpdENvdW50Kyt9KTtcbn1cblxudmFyIG1haW49ZnVuY3Rpb24oZW5naW5lLHEsb3B0cyxjYil7XG5cdHZhciBzdGFydHRpbWU9bmV3IERhdGUoKTtcblx0dmFyIG1ldGE9ZW5naW5lLmdldChcIm1ldGFcIik7XG5cdGlmIChtZXRhLm5vcm1hbGl6ZSAmJiBlbmdpbmUuYW5hbHl6ZXIuc2V0Tm9ybWFsaXplVGFibGUpIHtcblx0XHRtZXRhLm5vcm1hbGl6ZU9iaj1lbmdpbmUuYW5hbHl6ZXIuc2V0Tm9ybWFsaXplVGFibGUobWV0YS5ub3JtYWxpemUsbWV0YS5ub3JtYWxpemVPYmopO1xuXHR9XG5cdGlmICh0eXBlb2Ygb3B0cz09XCJmdW5jdGlvblwiKSBjYj1vcHRzO1xuXHRvcHRzPW9wdHN8fHt9O1xuXHR2YXIgUT1lbmdpbmUucXVlcnlDYWNoZVtxXTtcblx0aWYgKCFRKSBRPW5ld1F1ZXJ5KGVuZ2luZSxxLG9wdHMpOyBcblx0aWYgKCFRKSB7XG5cdFx0ZW5naW5lLnNlYXJjaHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0ZW5naW5lLnRvdGFsdGltZT1lbmdpbmUuc2VhcmNodGltZTtcblx0XHRpZiAoZW5naW5lLmNvbnRleHQpIGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFtcImVtcHR5IHJlc3VsdFwiLHtyYXdyZXN1bHQ6W119XSk7XG5cdFx0ZWxzZSBjYihcImVtcHR5IHJlc3VsdFwiLHtyYXdyZXN1bHQ6W119KTtcblx0XHRyZXR1cm47XG5cdH07XG5cdGVuZ2luZS5xdWVyeUNhY2hlW3FdPVE7XG5cdGlmIChRLnBocmFzZXMubGVuZ3RoKSB7XG5cdFx0bG9hZFBvc3RpbmdzKGVuZ2luZSxRLnRlcm1zLGZ1bmN0aW9uKCl7XG5cdFx0XHRpZiAoIVEucGhyYXNlc1swXS5wb3N0aW5nKSB7XG5cdFx0XHRcdGVuZ2luZS5zZWFyY2h0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdFx0XHRlbmdpbmUudG90YWx0aW1lPWVuZ2luZS5zZWFyY2h0aW1lXG5cblx0XHRcdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsW1wibm8gc3VjaCBwb3N0aW5nXCIse3Jhd3Jlc3VsdDpbXX1dKTtcblx0XHRcdFx0cmV0dXJuO1x0XHRcdFxuXHRcdFx0fVxuXHRcdFx0XG5cdFx0XHRpZiAoIVEucGhyYXNlc1swXS5wb3N0aW5nLmxlbmd0aCkgeyAvL1xuXHRcdFx0XHRRLnBocmFzZXMuZm9yRWFjaChsb2FkUGhyYXNlLmJpbmQoUSkpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKFEucGhyYXNlcy5sZW5ndGg9PTEpIHtcblx0XHRcdFx0US5yYXdyZXN1bHQ9US5waHJhc2VzWzBdLnBvc3Rpbmc7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRwaHJhc2VfaW50ZXJzZWN0KGVuZ2luZSxRKTtcblx0XHRcdH1cblx0XHRcdHZhciBmaWxlT2Zmc2V0cz1RLmVuZ2luZS5nZXQoXCJmaWxlT2Zmc2V0c1wiKTtcblx0XHRcdC8vY29uc29sZS5sb2coXCJzZWFyY2ggb3B0cyBcIitKU09OLnN0cmluZ2lmeShvcHRzKSk7XG5cblx0XHRcdGlmICghUS5ieUZpbGUgJiYgUS5yYXdyZXN1bHQgJiYgIW9wdHMubm9ncm91cCkge1xuXHRcdFx0XHRRLmJ5RmlsZT1wbGlzdC5ncm91cGJ5cG9zdGluZzIoUS5yYXdyZXN1bHQsIGZpbGVPZmZzZXRzKTtcblx0XHRcdFx0US5ieUZpbGUuc2hpZnQoKTtRLmJ5RmlsZS5wb3AoKTtcblx0XHRcdFx0US5ieUZvbGRlcj1ncm91cEJ5Rm9sZGVyKGVuZ2luZSxRLmJ5RmlsZSk7XG5cblx0XHRcdFx0Y291bnRGb2xkZXJGaWxlKFEpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0cy5yYW5nZSkge1xuXHRcdFx0XHRlbmdpbmUuc2VhcmNodGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRcdFx0ZXhjZXJwdC5yZXN1bHRsaXN0KGVuZ2luZSxRLG9wdHMsZnVuY3Rpb24oZGF0YSkgeyBcblx0XHRcdFx0XHQvL2NvbnNvbGUubG9nKFwiZXhjZXJwdCBva1wiKTtcblx0XHRcdFx0XHRRLmV4Y2VycHQ9ZGF0YTtcblx0XHRcdFx0XHRlbmdpbmUudG90YWx0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdFx0XHRcdGNiLmFwcGx5KGVuZ2luZS5jb250ZXh0LFswLFFdKTtcblx0XHRcdFx0fSk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRlbmdpbmUuc2VhcmNodGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRcdFx0ZW5naW5lLnRvdGFsdGltZT1uZXcgRGF0ZSgpLXN0YXJ0dGltZTtcblx0XHRcdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsWzAsUV0pO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9IGVsc2UgeyAvL2VtcHR5IHNlYXJjaFxuXHRcdGVuZ2luZS5zZWFyY2h0aW1lPW5ldyBEYXRlKCktc3RhcnR0aW1lO1xuXHRcdGVuZ2luZS50b3RhbHRpbWU9bmV3IERhdGUoKS1zdGFydHRpbWU7XG5cdFx0Y2IuYXBwbHkoZW5naW5lLmNvbnRleHQsWzAsUV0pO1xuXHR9O1xufVxuXG5tYWluLnNwbGl0UGhyYXNlPXNwbGl0UGhyYXNlOyAvL2p1c3QgZm9yIGRlYnVnXG5tb2R1bGUuZXhwb3J0cz1tYWluOyIsIi8qKiBAanN4IFJlYWN0LkRPTSAqL1xuLypcbmNvbnZlcnQgdG8gcHVyZSBqc1xuc2F2ZSAtZyByZWFjdGlmeVxuKi9cbnZhciBFPVJlYWN0LmNyZWF0ZUVsZW1lbnQ7XG5cbnZhciBoYXNrc2FuYWdhcD0odHlwZW9mIGtzYW5hZ2FwIT1cInVuZGVmaW5lZFwiKTtcbmlmIChoYXNrc2FuYWdhcCAmJiAodHlwZW9mIGNvbnNvbGU9PVwidW5kZWZpbmVkXCIgfHwgdHlwZW9mIGNvbnNvbGUubG9nPT1cInVuZGVmaW5lZFwiKSkge1xuXHRcdHdpbmRvdy5jb25zb2xlPXtsb2c6a3NhbmFnYXAubG9nLGVycm9yOmtzYW5hZ2FwLmVycm9yLGRlYnVnOmtzYW5hZ2FwLmRlYnVnLHdhcm46a3NhbmFnYXAud2Fybn07XG5cdFx0Y29uc29sZS5sb2coXCJpbnN0YWxsIGNvbnNvbGUgb3V0cHV0IGZ1bmNpdG9uXCIpO1xufVxuXG52YXIgY2hlY2tmcz1mdW5jdGlvbigpIHtcblx0cmV0dXJuIChuYXZpZ2F0b3IgJiYgbmF2aWdhdG9yLndlYmtpdFBlcnNpc3RlbnRTdG9yYWdlKSB8fCBoYXNrc2FuYWdhcDtcbn1cbnZhciBmZWF0dXJlY2hlY2tzPXtcblx0XCJmc1wiOmNoZWNrZnNcbn1cbnZhciBjaGVja2Jyb3dzZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcblxuXHRcdHZhciBtaXNzaW5nRmVhdHVyZXM9dGhpcy5nZXRNaXNzaW5nRmVhdHVyZXMoKTtcblx0XHRyZXR1cm4ge3JlYWR5OmZhbHNlLCBtaXNzaW5nOm1pc3NpbmdGZWF0dXJlc307XG5cdH0sXG5cdGdldE1pc3NpbmdGZWF0dXJlczpmdW5jdGlvbigpIHtcblx0XHR2YXIgZmVhdHVyZT10aGlzLnByb3BzLmZlYXR1cmUuc3BsaXQoXCIsXCIpO1xuXHRcdHZhciBzdGF0dXM9W107XG5cdFx0ZmVhdHVyZS5tYXAoZnVuY3Rpb24oZil7XG5cdFx0XHR2YXIgY2hlY2tlcj1mZWF0dXJlY2hlY2tzW2ZdO1xuXHRcdFx0aWYgKGNoZWNrZXIpIGNoZWNrZXI9Y2hlY2tlcigpO1xuXHRcdFx0c3RhdHVzLnB1c2goW2YsY2hlY2tlcl0pO1xuXHRcdH0pO1xuXHRcdHJldHVybiBzdGF0dXMuZmlsdGVyKGZ1bmN0aW9uKGYpe3JldHVybiAhZlsxXX0pO1xuXHR9LFxuXHRkb3dubG9hZGJyb3dzZXI6ZnVuY3Rpb24oKSB7XG5cdFx0d2luZG93LmxvY2F0aW9uPVwiaHR0cHM6Ly93d3cuZ29vZ2xlLmNvbS9jaHJvbWUvXCJcblx0fSxcblx0cmVuZGVyTWlzc2luZzpmdW5jdGlvbigpIHtcblx0XHR2YXIgc2hvd01pc3Npbmc9ZnVuY3Rpb24obSkge1xuXHRcdFx0cmV0dXJuIEUoXCJkaXZcIiwgbnVsbCwgbSk7XG5cdFx0fVxuXHRcdHJldHVybiAoXG5cdFx0IEUoXCJkaXZcIiwge3JlZjogXCJkaWFsb2cxXCIsIGNsYXNzTmFtZTogXCJtb2RhbCBmYWRlXCIsIFwiZGF0YS1iYWNrZHJvcFwiOiBcInN0YXRpY1wifSwgXG5cdFx0ICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1kaWFsb2dcIn0sIFxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1oZWFkZXJcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHt0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwiY2xvc2VcIiwgXCJkYXRhLWRpc21pc3NcIjogXCJtb2RhbFwiLCBcImFyaWEtaGlkZGVuXCI6IFwidHJ1ZVwifSwgXCLDl1wiKSwgXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIkJyb3dzZXIgQ2hlY2tcIilcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWJvZHlcIn0sIFxuXHRcdCAgICAgICAgICBFKFwicFwiLCBudWxsLCBcIlNvcnJ5IGJ1dCB0aGUgZm9sbG93aW5nIGZlYXR1cmUgaXMgbWlzc2luZ1wiKSwgXG5cdFx0ICAgICAgICAgIHRoaXMuc3RhdGUubWlzc2luZy5tYXAoc2hvd01pc3NpbmcpXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1mb290ZXJcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmRvd25sb2FkYnJvd3NlciwgdHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwifSwgXCJEb3dubG9hZCBHb29nbGUgQ2hyb21lXCIpXG5cdFx0ICAgICAgICApXG5cdFx0ICAgICAgKVxuXHRcdCAgICApXG5cdFx0ICApXG5cdFx0ICk7XG5cdH0sXG5cdHJlbmRlclJlYWR5OmZ1bmN0aW9uKCkge1xuXHRcdHJldHVybiBFKFwic3BhblwiLCBudWxsLCBcImJyb3dzZXIgb2tcIilcblx0fSxcblx0cmVuZGVyOmZ1bmN0aW9uKCl7XG5cdFx0cmV0dXJuICAodGhpcy5zdGF0ZS5taXNzaW5nLmxlbmd0aCk/dGhpcy5yZW5kZXJNaXNzaW5nKCk6dGhpcy5yZW5kZXJSZWFkeSgpO1xuXHR9LFxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcblx0XHRpZiAoIXRoaXMuc3RhdGUubWlzc2luZy5sZW5ndGgpIHtcblx0XHRcdHRoaXMucHJvcHMub25SZWFkeSgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcblx0XHR9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cz1jaGVja2Jyb3dzZXI7IiwiXG52YXIgdXNlckNhbmNlbD1mYWxzZTtcbnZhciBmaWxlcz1bXTtcbnZhciB0b3RhbERvd25sb2FkQnl0ZT0wO1xudmFyIHRhcmdldFBhdGg9XCJcIjtcbnZhciB0ZW1wUGF0aD1cIlwiO1xudmFyIG5maWxlPTA7XG52YXIgYmFzZXVybD1cIlwiO1xudmFyIHJlc3VsdD1cIlwiO1xudmFyIGRvd25sb2FkaW5nPWZhbHNlO1xudmFyIHN0YXJ0RG93bmxvYWQ9ZnVuY3Rpb24oZGJpZCxfYmFzZXVybCxfZmlsZXMpIHsgLy9yZXR1cm4gZG93bmxvYWQgaWRcblx0dmFyIGZzICAgICA9IHJlcXVpcmUoXCJmc1wiKTtcblx0dmFyIHBhdGggICA9IHJlcXVpcmUoXCJwYXRoXCIpO1xuXG5cdFxuXHRmaWxlcz1fZmlsZXMuc3BsaXQoXCJcXHVmZmZmXCIpO1xuXHRpZiAoZG93bmxvYWRpbmcpIHJldHVybiBmYWxzZTsgLy9vbmx5IG9uZSBzZXNzaW9uXG5cdHVzZXJDYW5jZWw9ZmFsc2U7XG5cdHRvdGFsRG93bmxvYWRCeXRlPTA7XG5cdG5leHRGaWxlKCk7XG5cdGRvd25sb2FkaW5nPXRydWU7XG5cdGJhc2V1cmw9X2Jhc2V1cmw7XG5cdGlmIChiYXNldXJsW2Jhc2V1cmwubGVuZ3RoLTFdIT0nLycpYmFzZXVybCs9Jy8nO1xuXHR0YXJnZXRQYXRoPWtzYW5hZ2FwLnJvb3RQYXRoK2RiaWQrJy8nO1xuXHR0ZW1wUGF0aD1rc2FuYWdhcC5yb290UGF0aCtcIi50bXAvXCI7XG5cdHJlc3VsdD1cIlwiO1xuXHRyZXR1cm4gdHJ1ZTtcbn1cblxudmFyIG5leHRGaWxlPWZ1bmN0aW9uKCkge1xuXHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0aWYgKG5maWxlPT1maWxlcy5sZW5ndGgpIHtcblx0XHRcdG5maWxlKys7XG5cdFx0XHRlbmREb3dubG9hZCgpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkb3dubG9hZEZpbGUobmZpbGUrKyk7XHRcblx0XHR9XG5cdH0sMTAwKTtcbn1cblxudmFyIGRvd25sb2FkRmlsZT1mdW5jdGlvbihuZmlsZSkge1xuXHR2YXIgdXJsPWJhc2V1cmwrZmlsZXNbbmZpbGVdO1xuXHR2YXIgdG1wZmlsZW5hbWU9dGVtcFBhdGgrZmlsZXNbbmZpbGVdO1xuXHR2YXIgbWtkaXJwID0gcmVxdWlyZShcIi4vbWtkaXJwXCIpO1xuXHR2YXIgZnMgICAgID0gcmVxdWlyZShcImZzXCIpO1xuXHR2YXIgaHR0cCAgID0gcmVxdWlyZShcImh0dHBcIik7XG5cblx0bWtkaXJwLnN5bmMocGF0aC5kaXJuYW1lKHRtcGZpbGVuYW1lKSk7XG5cdHZhciB3cml0ZVN0cmVhbSA9IGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRtcGZpbGVuYW1lKTtcblx0dmFyIGRhdGFsZW5ndGg9MDtcblx0dmFyIHJlcXVlc3QgPSBodHRwLmdldCh1cmwsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG5cdFx0cmVzcG9uc2Uub24oJ2RhdGEnLGZ1bmN0aW9uKGNodW5rKXtcblx0XHRcdHdyaXRlU3RyZWFtLndyaXRlKGNodW5rKTtcblx0XHRcdHRvdGFsRG93bmxvYWRCeXRlKz1jaHVuay5sZW5ndGg7XG5cdFx0XHRpZiAodXNlckNhbmNlbCkge1xuXHRcdFx0XHR3cml0ZVN0cmVhbS5lbmQoKTtcblx0XHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe25leHRGaWxlKCk7fSwxMDApO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHRcdHJlc3BvbnNlLm9uKFwiZW5kXCIsZnVuY3Rpb24oKSB7XG5cdFx0XHR3cml0ZVN0cmVhbS5lbmQoKTtcblx0XHRcdHNldFRpbWVvdXQoZnVuY3Rpb24oKXtuZXh0RmlsZSgpO30sMTAwKTtcblx0XHR9KTtcblx0fSk7XG59XG5cbnZhciBjYW5jZWxEb3dubG9hZD1mdW5jdGlvbigpIHtcblx0dXNlckNhbmNlbD10cnVlO1xuXHRlbmREb3dubG9hZCgpO1xufVxudmFyIHZlcmlmeT1mdW5jdGlvbigpIHtcblx0cmV0dXJuIHRydWU7XG59XG52YXIgZW5kRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XG5cdG5maWxlPWZpbGVzLmxlbmd0aCsxOy8vc3RvcFxuXHRyZXN1bHQ9XCJjYW5jZWxsZWRcIjtcblx0ZG93bmxvYWRpbmc9ZmFsc2U7XG5cdGlmICh1c2VyQ2FuY2VsKSByZXR1cm47XG5cdHZhciBmcyAgICAgPSByZXF1aXJlKFwiZnNcIik7XG5cdHZhciBta2RpcnAgPSByZXF1aXJlKFwiLi9ta2RpcnBcIik7XG5cblx0Zm9yICh2YXIgaT0wO2k8ZmlsZXMubGVuZ3RoO2krKykge1xuXHRcdHZhciB0YXJnZXRmaWxlbmFtZT10YXJnZXRQYXRoK2ZpbGVzW2ldO1xuXHRcdHZhciB0bXBmaWxlbmFtZSAgID10ZW1wUGF0aCtmaWxlc1tpXTtcblx0XHRta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUodGFyZ2V0ZmlsZW5hbWUpKTtcblx0XHRmcy5yZW5hbWVTeW5jKHRtcGZpbGVuYW1lLHRhcmdldGZpbGVuYW1lKTtcblx0fVxuXHRpZiAodmVyaWZ5KCkpIHtcblx0XHRyZXN1bHQ9XCJzdWNjZXNzXCI7XG5cdH0gZWxzZSB7XG5cdFx0cmVzdWx0PVwiZXJyb3JcIjtcblx0fVxufVxuXG52YXIgZG93bmxvYWRlZEJ5dGU9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiB0b3RhbERvd25sb2FkQnl0ZTtcbn1cbnZhciBkb25lRG93bmxvYWQ9ZnVuY3Rpb24oKSB7XG5cdGlmIChuZmlsZT5maWxlcy5sZW5ndGgpIHJldHVybiByZXN1bHQ7XG5cdGVsc2UgcmV0dXJuIFwiXCI7XG59XG52YXIgZG93bmxvYWRpbmdGaWxlPWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gbmZpbGUtMTtcbn1cblxudmFyIGRvd25sb2FkZXI9e3N0YXJ0RG93bmxvYWQ6c3RhcnREb3dubG9hZCwgZG93bmxvYWRlZEJ5dGU6ZG93bmxvYWRlZEJ5dGUsXG5cdGRvd25sb2FkaW5nRmlsZTpkb3dubG9hZGluZ0ZpbGUsIGNhbmNlbERvd25sb2FkOmNhbmNlbERvd25sb2FkLGRvbmVEb3dubG9hZDpkb25lRG93bmxvYWR9O1xubW9kdWxlLmV4cG9ydHM9ZG93bmxvYWRlcjsiLCIvKiogQGpzeCBSZWFjdC5ET00gKi9cblxuLyogdG9kbyAsIG9wdGlvbmFsIGtkYiAqL1xuXG52YXIgSHRtbEZTPXJlcXVpcmUoXCIuL2h0bWxmc1wiKTtcbnZhciBodG1sNWZzPXJlcXVpcmUoXCIuL2h0bWw1ZnNcIik7XG52YXIgQ2hlY2tCcm93c2VyPXJlcXVpcmUoXCIuL2NoZWNrYnJvd3NlclwiKTtcbnZhciBFPVJlYWN0LmNyZWF0ZUVsZW1lbnQ7XG4gIFxuXG52YXIgRmlsZUxpc3QgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG5cdGdldEluaXRpYWxTdGF0ZTpmdW5jdGlvbigpIHtcblx0XHRyZXR1cm4ge2Rvd25sb2FkaW5nOmZhbHNlLHByb2dyZXNzOjB9O1xuXHR9LFxuXHR1cGRhdGFibGU6ZnVuY3Rpb24oZikge1xuICAgICAgICB2YXIgY2xhc3Nlcz1cImJ0biBidG4td2FybmluZ1wiO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5kb3dubG9hZGluZykgY2xhc3Nlcys9XCIgZGlzYWJsZWRcIjtcblx0XHRpZiAoZi5oYXNVcGRhdGUpIHJldHVybiAgIEUoXCJidXR0b25cIiwge2NsYXNzTmFtZTogY2xhc3NlcywgXG5cdFx0XHRcImRhdGEtZmlsZW5hbWVcIjogZi5maWxlbmFtZSwgXCJkYXRhLXVybFwiOiBmLnVybCwgXG5cdCAgICAgICAgICAgIG9uQ2xpY2s6IHRoaXMuZG93bmxvYWRcblx0ICAgICAgIH0sIFwiVXBkYXRlXCIpXG5cdFx0ZWxzZSByZXR1cm4gbnVsbDtcblx0fSxcblx0c2hvd0xvY2FsOmZ1bmN0aW9uKGYpIHtcbiAgICAgICAgdmFyIGNsYXNzZXM9XCJidG4gYnRuLWRhbmdlclwiO1xuICAgICAgICBpZiAodGhpcy5zdGF0ZS5kb3dubG9hZGluZykgY2xhc3Nlcys9XCIgZGlzYWJsZWRcIjtcblx0ICByZXR1cm4gRShcInRyXCIsIG51bGwsIEUoXCJ0ZFwiLCBudWxsLCBmLmZpbGVuYW1lKSwgXG5cdCAgICAgIEUoXCJ0ZFwiLCBudWxsKSwgXG5cdCAgICAgIEUoXCJ0ZFwiLCB7Y2xhc3NOYW1lOiBcInB1bGwtcmlnaHRcIn0sIFxuXHQgICAgICB0aGlzLnVwZGF0YWJsZShmKSwgRShcImJ1dHRvblwiLCB7Y2xhc3NOYW1lOiBjbGFzc2VzLCBcblx0ICAgICAgICAgICAgICAgb25DbGljazogdGhpcy5kZWxldGVGaWxlLCBcImRhdGEtZmlsZW5hbWVcIjogZi5maWxlbmFtZX0sIFwiRGVsZXRlXCIpXG5cdCAgICAgICAgXG5cdCAgICAgIClcblx0ICApXG5cdH0sICBcblx0c2hvd1JlbW90ZTpmdW5jdGlvbihmKSB7IFxuXHQgIHZhciBjbGFzc2VzPVwiYnRuIGJ0bi13YXJuaW5nXCI7XG5cdCAgaWYgKHRoaXMuc3RhdGUuZG93bmxvYWRpbmcpIGNsYXNzZXMrPVwiIGRpc2FibGVkXCI7XG5cdCAgcmV0dXJuIChFKFwidHJcIiwge1wiZGF0YS1pZFwiOiBmLmZpbGVuYW1lfSwgRShcInRkXCIsIG51bGwsIFxuXHQgICAgICBmLmZpbGVuYW1lKSwgXG5cdCAgICAgIEUoXCJ0ZFwiLCBudWxsLCBmLmRlc2MpLCBcblx0ICAgICAgRShcInRkXCIsIG51bGwsIFxuXHQgICAgICBFKFwic3BhblwiLCB7XCJkYXRhLWZpbGVuYW1lXCI6IGYuZmlsZW5hbWUsIFwiZGF0YS11cmxcIjogZi51cmwsIFxuXHQgICAgICAgICAgICBjbGFzc05hbWU6IGNsYXNzZXMsIFxuXHQgICAgICAgICAgICBvbkNsaWNrOiB0aGlzLmRvd25sb2FkfSwgXCJEb3dubG9hZFwiKVxuXHQgICAgICApXG5cdCAgKSk7XG5cdH0sXG5cdHNob3dGaWxlOmZ1bmN0aW9uKGYpIHtcblx0Ly9cdHJldHVybiA8c3BhbiBkYXRhLWlkPXtmLmZpbGVuYW1lfT57Zi51cmx9PC9zcGFuPlxuXHRcdHJldHVybiAoZi5yZWFkeSk/dGhpcy5zaG93TG9jYWwoZik6dGhpcy5zaG93UmVtb3RlKGYpO1xuXHR9LFxuXHRyZWxvYWREaXI6ZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wcm9wcy5hY3Rpb24oXCJyZWxvYWRcIik7XG5cdH0sXG5cdGRvd25sb2FkOmZ1bmN0aW9uKGUpIHtcblx0XHR2YXIgdXJsPWUudGFyZ2V0LmRhdGFzZXRbXCJ1cmxcIl07XG5cdFx0dmFyIGZpbGVuYW1lPWUudGFyZ2V0LmRhdGFzZXRbXCJmaWxlbmFtZVwiXTtcblx0XHR0aGlzLnNldFN0YXRlKHtkb3dubG9hZGluZzp0cnVlLHByb2dyZXNzOjAsdXJsOnVybH0pO1xuXHRcdHRoaXMudXNlcmJyZWFrPWZhbHNlO1xuXHRcdGh0bWw1ZnMuZG93bmxvYWQodXJsLGZpbGVuYW1lLGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGlzLnJlbG9hZERpcigpO1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7ZG93bmxvYWRpbmc6ZmFsc2UscHJvZ3Jlc3M6MX0pO1xuXHRcdFx0fSxmdW5jdGlvbihwcm9ncmVzcyx0b3RhbCl7XG5cdFx0XHRcdGlmIChwcm9ncmVzcz09MCkge1xuXHRcdFx0XHRcdHRoaXMuc2V0U3RhdGUoe21lc3NhZ2U6XCJ0b3RhbCBcIit0b3RhbH0pXG5cdFx0XHQgXHR9XG5cdFx0XHQgXHR0aGlzLnNldFN0YXRlKHtwcm9ncmVzczpwcm9ncmVzc30pO1xuXHRcdFx0IFx0Ly9pZiB1c2VyIHByZXNzIGFib3J0IHJldHVybiB0cnVlXG5cdFx0XHQgXHRyZXR1cm4gdGhpcy51c2VyYnJlYWs7XG5cdFx0XHR9XG5cdFx0LHRoaXMpO1xuXHR9LFxuXHRkZWxldGVGaWxlOmZ1bmN0aW9uKCBlKSB7XG5cdFx0dmFyIGZpbGVuYW1lPWUudGFyZ2V0LmF0dHJpYnV0ZXNbXCJkYXRhLWZpbGVuYW1lXCJdLnZhbHVlO1xuXHRcdHRoaXMucHJvcHMuYWN0aW9uKFwiZGVsZXRlXCIsZmlsZW5hbWUpO1xuXHR9LFxuXHRhbGxGaWxlc1JlYWR5OmZ1bmN0aW9uKGUpIHtcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5maWxlcy5ldmVyeShmdW5jdGlvbihmKXsgcmV0dXJuIGYucmVhZHl9KTtcblx0fSxcblx0ZGlzbWlzczpmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ2hpZGUnKTtcblx0XHR0aGlzLnByb3BzLmFjdGlvbihcImRpc21pc3NcIik7XG5cdH0sXG5cdGFib3J0ZG93bmxvYWQ6ZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy51c2VyYnJlYWs9dHJ1ZTtcblx0fSxcblx0c2hvd1Byb2dyZXNzOmZ1bmN0aW9uKCkge1xuXHQgICAgIGlmICh0aGlzLnN0YXRlLmRvd25sb2FkaW5nKSB7XG5cdCAgICAgIHZhciBwcm9ncmVzcz1NYXRoLnJvdW5kKHRoaXMuc3RhdGUucHJvZ3Jlc3MqMTAwKTtcblx0ICAgICAgcmV0dXJuIChcblx0ICAgICAgXHRFKFwiZGl2XCIsIG51bGwsIFxuXHQgICAgICBcdFwiRG93bmxvYWRpbmcgZnJvbSBcIiwgdGhpcy5zdGF0ZS51cmwsIFxuXHQgICAgICBFKFwiZGl2XCIsIHtrZXk6IFwicHJvZ3Jlc3NcIiwgY2xhc3NOYW1lOiBcInByb2dyZXNzIGNvbC1tZC04XCJ9LCBcblx0ICAgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwcm9ncmVzcy1iYXJcIiwgcm9sZTogXCJwcm9ncmVzc2JhclwiLCBcblx0ICAgICAgICAgICAgICBcImFyaWEtdmFsdWVub3dcIjogcHJvZ3Jlc3MsIFwiYXJpYS12YWx1ZW1pblwiOiBcIjBcIiwgXG5cdCAgICAgICAgICAgICAgXCJhcmlhLXZhbHVlbWF4XCI6IFwiMTAwXCIsIHN0eWxlOiB7d2lkdGg6IHByb2dyZXNzK1wiJVwifX0sIFxuXHQgICAgICAgICAgICBwcm9ncmVzcywgXCIlXCJcblx0ICAgICAgICAgIClcblx0ICAgICAgICApLCBcblx0ICAgICAgICBFKFwiYnV0dG9uXCIsIHtvbkNsaWNrOiB0aGlzLmFib3J0ZG93bmxvYWQsIFxuXHQgICAgICAgIFx0Y2xhc3NOYW1lOiBcImJ0biBidG4tZGFuZ2VyIGNvbC1tZC00XCJ9LCBcIkFib3J0XCIpXG5cdCAgICAgICAgKVxuXHQgICAgICAgICk7XG5cdCAgICAgIH0gZWxzZSB7XG5cdCAgICAgIFx0XHRpZiAoIHRoaXMuYWxsRmlsZXNSZWFkeSgpICkge1xuXHQgICAgICBcdFx0XHRyZXR1cm4gRShcImJ1dHRvblwiLCB7b25DbGljazogdGhpcy5kaXNtaXNzLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1zdWNjZXNzXCJ9LCBcIk9rXCIpXG5cdCAgICAgIFx0XHR9IGVsc2UgcmV0dXJuIG51bGw7XG5cdCAgICAgIFx0XHRcblx0ICAgICAgfVxuXHR9LFxuXHRzaG93VXNhZ2U6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHBlcmNlbnQ9dGhpcy5wcm9wcy5yZW1haW5QZXJjZW50O1xuICAgICAgICAgICByZXR1cm4gKEUoXCJkaXZcIiwgbnVsbCwgRShcInNwYW5cIiwge2NsYXNzTmFtZTogXCJwdWxsLWxlZnRcIn0sIFwiVXNhZ2U6XCIpLCBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3NcIn0sIFxuXHRcdCAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcInByb2dyZXNzLWJhciBwcm9ncmVzcy1iYXItc3VjY2VzcyBwcm9ncmVzcy1iYXItc3RyaXBlZFwiLCByb2xlOiBcInByb2dyZXNzYmFyXCIsIHN0eWxlOiB7d2lkdGg6IHBlcmNlbnQrXCIlXCJ9fSwgXG5cdFx0ICAgIFx0cGVyY2VudCtcIiVcIlxuXHRcdCAgKVxuXHRcdCkpKTtcblx0fSxcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xuXHQgIFx0cmV0dXJuIChcblx0XHRFKFwiZGl2XCIsIHtyZWY6IFwiZGlhbG9nMVwiLCBjbGFzc05hbWU6IFwibW9kYWwgZmFkZVwiLCBcImRhdGEtYmFja2Ryb3BcIjogXCJzdGF0aWNcIn0sIFxuXHRcdCAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZGlhbG9nXCJ9LCBcblx0XHQgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtY29udGVudFwifSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtaGVhZGVyXCJ9LCBcblx0XHQgICAgICAgICAgRShcImg0XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtdGl0bGVcIn0sIFwiRmlsZSBJbnN0YWxsZXJcIilcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWJvZHlcIn0sIFxuXHRcdCAgICAgICAgXHRFKFwidGFibGVcIiwge2NsYXNzTmFtZTogXCJ0YWJsZVwifSwgXG5cdFx0ICAgICAgICBcdEUoXCJ0Ym9keVwiLCBudWxsLCBcblx0XHQgICAgICAgICAgXHR0aGlzLnByb3BzLmZpbGVzLm1hcCh0aGlzLnNob3dGaWxlKVxuXHRcdCAgICAgICAgICBcdClcblx0XHQgICAgICAgICAgKVxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcblx0XHQgICAgICAgIFx0dGhpcy5zaG93VXNhZ2UoKSwgXG5cdFx0ICAgICAgICAgICB0aGlzLnNob3dQcm9ncmVzcygpXG5cdFx0ICAgICAgICApXG5cdFx0ICAgICAgKVxuXHRcdCAgICApXG5cdFx0ICApXG5cdFx0KTtcblx0fSxcdFxuXHRjb21wb25lbnREaWRNb3VudDpmdW5jdGlvbigpIHtcblx0XHQkKHRoaXMucmVmcy5kaWFsb2cxLmdldERPTU5vZGUoKSkubW9kYWwoJ3Nob3cnKTtcblx0fVxufSk7XG4vKlRPRE8ga2RiIGNoZWNrIHZlcnNpb24qL1xudmFyIEZpbGVtYW5hZ2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHF1b3RhPXRoaXMuZ2V0UXVvdGEoKTtcblx0XHRyZXR1cm4ge2Jyb3dzZXJSZWFkeTpmYWxzZSxub3VwZGF0ZTp0cnVlLFx0cmVxdWVzdFF1b3RhOnF1b3RhLHJlbWFpbjowfTtcblx0fSxcblx0Z2V0UXVvdGE6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHE9dGhpcy5wcm9wcy5xdW90YXx8XCIxMjhNXCI7XG5cdFx0dmFyIHVuaXQ9cVtxLmxlbmd0aC0xXTtcblx0XHR2YXIgdGltZXM9MTtcblx0XHRpZiAodW5pdD09XCJNXCIpIHRpbWVzPTEwMjQqMTAyNDtcblx0XHRlbHNlIGlmICh1bml0PVwiS1wiKSB0aW1lcz0xMDI0O1xuXHRcdHJldHVybiBwYXJzZUludChxKSAqIHRpbWVzO1xuXHR9LFxuXHRtaXNzaW5nS2RiOmZ1bmN0aW9uKCkge1xuXHRcdGlmIChrc2FuYWdhcC5wbGF0Zm9ybSE9XCJjaHJvbWVcIikgcmV0dXJuIFtdO1xuXHRcdHZhciBtaXNzaW5nPXRoaXMucHJvcHMubmVlZGVkLmZpbHRlcihmdW5jdGlvbihrZGIpe1xuXHRcdFx0Zm9yICh2YXIgaSBpbiBodG1sNWZzLmZpbGVzKSB7XG5cdFx0XHRcdGlmIChodG1sNWZzLmZpbGVzW2ldWzBdPT1rZGIuZmlsZW5hbWUpIHJldHVybiBmYWxzZTtcblx0XHRcdH1cblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH0sdGhpcyk7XG5cdFx0cmV0dXJuIG1pc3Npbmc7XG5cdH0sXG5cdGdldFJlbW90ZVVybDpmdW5jdGlvbihmbikge1xuXHRcdHZhciBmPXRoaXMucHJvcHMubmVlZGVkLmZpbHRlcihmdW5jdGlvbihmKXtyZXR1cm4gZi5maWxlbmFtZT09Zm59KTtcblx0XHRpZiAoZi5sZW5ndGggKSByZXR1cm4gZlswXS51cmw7XG5cdH0sXG5cdGdlbkZpbGVMaXN0OmZ1bmN0aW9uKGV4aXN0aW5nLG1pc3Npbmcpe1xuXHRcdHZhciBvdXQ9W107XG5cdFx0Zm9yICh2YXIgaSBpbiBleGlzdGluZykge1xuXHRcdFx0dmFyIHVybD10aGlzLmdldFJlbW90ZVVybChleGlzdGluZ1tpXVswXSk7XG5cdFx0XHRvdXQucHVzaCh7ZmlsZW5hbWU6ZXhpc3RpbmdbaV1bMF0sIHVybCA6dXJsLCByZWFkeTp0cnVlIH0pO1xuXHRcdH1cblx0XHRmb3IgKHZhciBpIGluIG1pc3NpbmcpIHtcblx0XHRcdG91dC5wdXNoKG1pc3NpbmdbaV0pO1xuXHRcdH1cblx0XHRyZXR1cm4gb3V0O1xuXHR9LFxuXHRyZWxvYWQ6ZnVuY3Rpb24oKSB7XG5cdFx0aHRtbDVmcy5yZWFkZGlyKGZ1bmN0aW9uKGZpbGVzKXtcbiAgXHRcdFx0dGhpcy5zZXRTdGF0ZSh7ZmlsZXM6dGhpcy5nZW5GaWxlTGlzdChmaWxlcyx0aGlzLm1pc3NpbmdLZGIoKSl9KTtcbiAgXHRcdH0sdGhpcyk7XG5cdCB9LFxuXHRkZWxldGVGaWxlOmZ1bmN0aW9uKGZuKSB7XG5cdCAgaHRtbDVmcy5ybShmbixmdW5jdGlvbigpe1xuXHQgIFx0dGhpcy5yZWxvYWQoKTtcblx0ICB9LHRoaXMpO1xuXHR9LFxuXHRvblF1b3RlT2s6ZnVuY3Rpb24ocXVvdGEsdXNhZ2UpIHtcblx0XHRpZiAoa3NhbmFnYXAucGxhdGZvcm0hPVwiY2hyb21lXCIpIHtcblx0XHRcdC8vY29uc29sZS5sb2coXCJvbnF1b3Rlb2tcIik7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHtub3VwZGF0ZTp0cnVlLG1pc3Npbmc6W10sZmlsZXM6W10sYXV0b2Nsb3NlOnRydWVcblx0XHRcdFx0LHF1b3RhOnF1b3RhLHJlbWFpbjpxdW90YS11c2FnZSx1c2FnZTp1c2FnZX0pO1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHQvL2NvbnNvbGUubG9nKFwicXVvdGUgb2tcIik7XG5cdFx0dmFyIGZpbGVzPXRoaXMuZ2VuRmlsZUxpc3QoaHRtbDVmcy5maWxlcyx0aGlzLm1pc3NpbmdLZGIoKSk7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR0aGF0LmNoZWNrSWZVcGRhdGUoZmlsZXMsZnVuY3Rpb24oaGFzdXBkYXRlKSB7XG5cdFx0XHR2YXIgbWlzc2luZz10aGlzLm1pc3NpbmdLZGIoKTtcblx0XHRcdHZhciBhdXRvY2xvc2U9dGhpcy5wcm9wcy5hdXRvY2xvc2U7XG5cdFx0XHRpZiAobWlzc2luZy5sZW5ndGgpIGF1dG9jbG9zZT1mYWxzZTtcblx0XHRcdHRoYXQuc2V0U3RhdGUoe2F1dG9jbG9zZTphdXRvY2xvc2UsXG5cdFx0XHRcdHF1b3RhOnF1b3RhLHVzYWdlOnVzYWdlLGZpbGVzOmZpbGVzLFxuXHRcdFx0XHRtaXNzaW5nOm1pc3NpbmcsXG5cdFx0XHRcdG5vdXBkYXRlOiFoYXN1cGRhdGUsXG5cdFx0XHRcdHJlbWFpbjpxdW90YS11c2FnZX0pO1xuXHRcdH0pO1xuXHR9LCAgXG5cdG9uQnJvd3Nlck9rOmZ1bmN0aW9uKCkge1xuXHQgIHRoaXMudG90YWxEb3dubG9hZFNpemUoKTtcblx0fSwgXG5cdGRpc21pc3M6ZnVuY3Rpb24oKSB7XG5cdFx0dGhpcy5wcm9wcy5vblJlYWR5KHRoaXMuc3RhdGUudXNhZ2UsdGhpcy5zdGF0ZS5xdW90YSk7XG5cdFx0c2V0VGltZW91dChmdW5jdGlvbigpe1xuXHRcdFx0dmFyIG1vZGFsaW49JChcIi5tb2RhbC5pblwiKTtcblx0XHRcdGlmIChtb2RhbGluLm1vZGFsKSBtb2RhbGluLm1vZGFsKCdoaWRlJyk7XG5cdFx0fSw1MDApO1xuXHR9LCBcblx0dG90YWxEb3dubG9hZFNpemU6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIGZpbGVzPXRoaXMubWlzc2luZ0tkYigpO1xuXHRcdHZhciB0YXNrcXVldWU9W10sdG90YWxzaXplPTA7XG5cdFx0Zm9yICh2YXIgaT0wO2k8ZmlsZXMubGVuZ3RoO2krKykge1xuXHRcdFx0dGFza3F1ZXVlLnB1c2goXG5cdFx0XHRcdChmdW5jdGlvbihpZHgpe1xuXHRcdFx0XHRcdHJldHVybiAoZnVuY3Rpb24oZGF0YSl7XG5cdFx0XHRcdFx0XHRpZiAoISh0eXBlb2YgZGF0YT09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkgdG90YWxzaXplKz1kYXRhO1xuXHRcdFx0XHRcdFx0aHRtbDVmcy5nZXREb3dubG9hZFNpemUoZmlsZXNbaWR4XS51cmwsdGFza3F1ZXVlLnNoaWZ0KCkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KShpKVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcdFxuXHRcdFx0dG90YWxzaXplKz1kYXRhO1xuXHRcdFx0c2V0VGltZW91dChmdW5jdGlvbigpe3RoYXQuc2V0U3RhdGUoe3JlcXVpcmVTcGFjZTp0b3RhbHNpemUsYnJvd3NlclJlYWR5OnRydWV9KX0sMCk7XG5cdFx0fSk7XG5cdFx0dGFza3F1ZXVlLnNoaWZ0KCkoe19fZW1wdHk6dHJ1ZX0pO1xuXHR9LFxuXHRjaGVja0lmVXBkYXRlOmZ1bmN0aW9uKGZpbGVzLGNiKSB7XG5cdFx0dmFyIHRhc2txdWV1ZT1bXTtcblx0XHRmb3IgKHZhciBpPTA7aTxmaWxlcy5sZW5ndGg7aSsrKSB7XG5cdFx0XHR0YXNrcXVldWUucHVzaChcblx0XHRcdFx0KGZ1bmN0aW9uKGlkeCl7XG5cdFx0XHRcdFx0cmV0dXJuIChmdW5jdGlvbihkYXRhKXtcblx0XHRcdFx0XHRcdGlmICghKHR5cGVvZiBkYXRhPT0nb2JqZWN0JyAmJiBkYXRhLl9fZW1wdHkpKSBmaWxlc1tpZHgtMV0uaGFzVXBkYXRlPWRhdGE7XG5cdFx0XHRcdFx0XHRodG1sNWZzLmNoZWNrVXBkYXRlKGZpbGVzW2lkeF0udXJsLGZpbGVzW2lkeF0uZmlsZW5hbWUsdGFza3F1ZXVlLnNoaWZ0KCkpO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHR9KShpKVxuXHRcdFx0KTtcblx0XHR9XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHR0YXNrcXVldWUucHVzaChmdW5jdGlvbihkYXRhKXtcdFxuXHRcdFx0ZmlsZXNbZmlsZXMubGVuZ3RoLTFdLmhhc1VwZGF0ZT1kYXRhO1xuXHRcdFx0dmFyIGhhc3VwZGF0ZT1maWxlcy5zb21lKGZ1bmN0aW9uKGYpe3JldHVybiBmLmhhc1VwZGF0ZX0pO1xuXHRcdFx0aWYgKGNiKSBjYi5hcHBseSh0aGF0LFtoYXN1cGRhdGVdKTtcblx0XHR9KTtcblx0XHR0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7XG5cdH0sXG5cdHJlbmRlcjpmdW5jdGlvbigpe1xuICAgIFx0XHRpZiAoIXRoaXMuc3RhdGUuYnJvd3NlclJlYWR5KSB7ICAgXG4gICAgICBcdFx0XHRyZXR1cm4gRShDaGVja0Jyb3dzZXIsIHtmZWF0dXJlOiBcImZzXCIsIG9uUmVhZHk6IHRoaXMub25Ccm93c2VyT2t9KVxuICAgIFx0XHR9IGlmICghdGhpcy5zdGF0ZS5xdW90YSB8fCB0aGlzLnN0YXRlLnJlbWFpbjx0aGlzLnN0YXRlLnJlcXVpcmVTcGFjZSkgeyAgXG4gICAgXHRcdFx0dmFyIHF1b3RhPXRoaXMuc3RhdGUucmVxdWVzdFF1b3RhO1xuICAgIFx0XHRcdGlmICh0aGlzLnN0YXRlLnVzYWdlK3RoaXMuc3RhdGUucmVxdWlyZVNwYWNlPnF1b3RhKSB7XG4gICAgXHRcdFx0XHRxdW90YT0odGhpcy5zdGF0ZS51c2FnZSt0aGlzLnN0YXRlLnJlcXVpcmVTcGFjZSkqMS41O1xuICAgIFx0XHRcdH1cbiAgICAgIFx0XHRcdHJldHVybiBFKEh0bWxGUywge3F1b3RhOiBxdW90YSwgYXV0b2Nsb3NlOiBcInRydWVcIiwgb25SZWFkeTogdGhpcy5vblF1b3RlT2t9KVxuICAgICAgXHRcdH0gZWxzZSB7XG5cdFx0XHRpZiAoIXRoaXMuc3RhdGUubm91cGRhdGUgfHwgdGhpcy5taXNzaW5nS2RiKCkubGVuZ3RoIHx8ICF0aGlzLnN0YXRlLmF1dG9jbG9zZSkge1xuXHRcdFx0XHR2YXIgcmVtYWluPU1hdGgucm91bmQoKHRoaXMuc3RhdGUudXNhZ2UvdGhpcy5zdGF0ZS5xdW90YSkqMTAwKTtcdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4gRShGaWxlTGlzdCwge2FjdGlvbjogdGhpcy5hY3Rpb24sIGZpbGVzOiB0aGlzLnN0YXRlLmZpbGVzLCByZW1haW5QZXJjZW50OiByZW1haW59KVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0c2V0VGltZW91dCggdGhpcy5kaXNtaXNzICwwKTtcblx0XHRcdFx0cmV0dXJuIEUoXCJzcGFuXCIsIG51bGwsIFwiU3VjY2Vzc1wiKTtcblx0XHRcdH1cbiAgICAgIFx0XHR9XG5cdH0sXG5cdGFjdGlvbjpmdW5jdGlvbigpIHtcblx0ICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cyk7XG5cdCAgdmFyIHR5cGU9YXJncy5zaGlmdCgpO1xuXHQgIHZhciByZXM9bnVsbCwgdGhhdD10aGlzO1xuXHQgIGlmICh0eXBlPT1cImRlbGV0ZVwiKSB7XG5cdCAgICB0aGlzLmRlbGV0ZUZpbGUoYXJnc1swXSk7XG5cdCAgfSAgZWxzZSBpZiAodHlwZT09XCJyZWxvYWRcIikge1xuXHQgIFx0dGhpcy5yZWxvYWQoKTtcblx0ICB9IGVsc2UgaWYgKHR5cGU9PVwiZGlzbWlzc1wiKSB7XG5cdCAgXHR0aGlzLmRpc21pc3MoKTtcblx0ICB9XG5cdH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cz1GaWxlbWFuYWdlcjsiLCIvKiBlbXVsYXRlIGZpbGVzeXN0ZW0gb24gaHRtbDUgYnJvd3NlciAqL1xudmFyIGdldF9oZWFkPWZ1bmN0aW9uKHVybCxmaWVsZCxjYil7XG5cdHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcblx0eGhyLm9wZW4oXCJIRUFEXCIsIHVybCwgdHJ1ZSk7XG5cdHhoci5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbigpIHtcblx0XHRcdGlmICh0aGlzLnJlYWR5U3RhdGUgPT0gdGhpcy5ET05FKSB7XG5cdFx0XHRcdGNiKHhoci5nZXRSZXNwb25zZUhlYWRlcihmaWVsZCkpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0aWYgKHRoaXMuc3RhdHVzIT09MjAwJiZ0aGlzLnN0YXR1cyE9PTIwNikge1xuXHRcdFx0XHRcdGNiKFwiXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9IFxuXHR9O1xuXHR4aHIuc2VuZCgpO1x0XG59XG52YXIgZ2V0X2RhdGU9ZnVuY3Rpb24odXJsLGNiKSB7XG5cdGdldF9oZWFkKHVybCxcIkxhc3QtTW9kaWZpZWRcIixmdW5jdGlvbih2YWx1ZSl7XG5cdFx0Y2IodmFsdWUpO1xuXHR9KTtcbn1cbnZhciBnZXRfc2l6ZT1mdW5jdGlvbih1cmwsIGNiKSB7XG5cdGdldF9oZWFkKHVybCxcIkNvbnRlbnQtTGVuZ3RoXCIsZnVuY3Rpb24odmFsdWUpe1xuXHRcdGNiKHBhcnNlSW50KHZhbHVlKSk7XG5cdH0pO1xufTtcbnZhciBjaGVja1VwZGF0ZT1mdW5jdGlvbih1cmwsZm4sY2IpIHtcblx0aWYgKCF1cmwpIHtcblx0XHRjYihmYWxzZSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGdldF9kYXRlKHVybCxmdW5jdGlvbihkKXtcblx0XHRBUEkuZnMucm9vdC5nZXRGaWxlKGZuLCB7Y3JlYXRlOiBmYWxzZSwgZXhjbHVzaXZlOiBmYWxzZX0sIGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuXHRcdFx0ZmlsZUVudHJ5LmdldE1ldGFkYXRhKGZ1bmN0aW9uKG1ldGFkYXRhKXtcblx0XHRcdFx0dmFyIGxvY2FsRGF0ZT1EYXRlLnBhcnNlKG1ldGFkYXRhLm1vZGlmaWNhdGlvblRpbWUpO1xuXHRcdFx0XHR2YXIgdXJsRGF0ZT1EYXRlLnBhcnNlKGQpO1xuXHRcdFx0XHRjYih1cmxEYXRlPmxvY2FsRGF0ZSk7XG5cdFx0XHR9KTtcblx0XHR9LGZ1bmN0aW9uKCl7XG5cdFx0XHRjYihmYWxzZSk7XG5cdFx0fSk7XG5cdH0pO1xufVxudmFyIGRvd25sb2FkPWZ1bmN0aW9uKHVybCxmbixjYixzdGF0dXNjYixjb250ZXh0KSB7XG5cdCB2YXIgdG90YWxzaXplPTAsYmF0Y2hlcz1udWxsLHdyaXR0ZW49MDtcblx0IHZhciBmaWxlRW50cnk9MCwgZmlsZVdyaXRlcj0wO1xuXHQgdmFyIGNyZWF0ZUJhdGNoZXM9ZnVuY3Rpb24oc2l6ZSkge1xuXHRcdHZhciBieXRlcz0xMDI0KjEwMjQsIG91dD1bXTtcblx0XHR2YXIgYj1NYXRoLmZsb29yKHNpemUgLyBieXRlcyk7XG5cdFx0dmFyIGxhc3Q9c2l6ZSAlYnl0ZXM7XG5cdFx0Zm9yICh2YXIgaT0wO2k8PWI7aSsrKSB7XG5cdFx0XHRvdXQucHVzaChpKmJ5dGVzKTtcblx0XHR9XG5cdFx0b3V0LnB1c2goYipieXRlcytsYXN0KTtcblx0XHRyZXR1cm4gb3V0O1xuXHQgfVxuXHQgdmFyIGZpbmlzaD1mdW5jdGlvbigpIHtcblx0XHQgcm0oZm4sZnVuY3Rpb24oKXtcblx0XHRcdFx0ZmlsZUVudHJ5Lm1vdmVUbyhmaWxlRW50cnkuZmlsZXN5c3RlbS5yb290LCBmbixmdW5jdGlvbigpe1xuXHRcdFx0XHRcdHNldFRpbWVvdXQoIGNiLmJpbmQoY29udGV4dCxmYWxzZSkgLCAwKSA7IFxuXHRcdFx0XHR9LGZ1bmN0aW9uKGUpe1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKFwiZmFpbGVkXCIsZSlcblx0XHRcdFx0fSk7XG5cdFx0IH0sdGhpcyk7IFxuXHQgfTtcblx0XHR2YXIgdGVtcGZuPVwidGVtcC5rZGJcIjtcblx0XHR2YXIgYmF0Y2g9ZnVuY3Rpb24oYikge1xuXHRcdHZhciBhYm9ydD1mYWxzZTtcblx0XHR2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0dmFyIHJlcXVlc3R1cmw9dXJsK1wiP1wiK01hdGgucmFuZG9tKCk7XG5cdFx0eGhyLm9wZW4oJ2dldCcsIHJlcXVlc3R1cmwsIHRydWUpO1xuXHRcdHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdSYW5nZScsICdieXRlcz0nK2JhdGNoZXNbYl0rJy0nKyhiYXRjaGVzW2IrMV0tMSkpO1xuXHRcdHhoci5yZXNwb25zZVR5cGUgPSAnYmxvYic7ICAgIFxuXHRcdHhoci5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgYmxvYj10aGlzLnJlc3BvbnNlO1xuXHRcdFx0ZmlsZUVudHJ5LmNyZWF0ZVdyaXRlcihmdW5jdGlvbihmaWxlV3JpdGVyKSB7XG5cdFx0XHRcdGZpbGVXcml0ZXIuc2VlayhmaWxlV3JpdGVyLmxlbmd0aCk7XG5cdFx0XHRcdGZpbGVXcml0ZXIud3JpdGUoYmxvYik7XG5cdFx0XHRcdHdyaXR0ZW4rPWJsb2Iuc2l6ZTtcblx0XHRcdFx0ZmlsZVdyaXRlci5vbndyaXRlZW5kID0gZnVuY3Rpb24oZSkge1xuXHRcdFx0XHRcdGlmIChzdGF0dXNjYikge1xuXHRcdFx0XHRcdFx0YWJvcnQ9c3RhdHVzY2IuYXBwbHkoY29udGV4dCxbIGZpbGVXcml0ZXIubGVuZ3RoIC8gdG90YWxzaXplLHRvdGFsc2l6ZSBdKTtcblx0XHRcdFx0XHRcdGlmIChhYm9ydCkgc2V0VGltZW91dCggY2IuYmluZChjb250ZXh0LGZhbHNlKSAsIDApIDtcblx0XHRcdFx0IFx0fVxuXHRcdFx0XHRcdGIrKztcblx0XHRcdFx0XHRpZiAoIWFib3J0KSB7XG5cdFx0XHRcdFx0XHRpZiAoYjxiYXRjaGVzLmxlbmd0aC0xKSBzZXRUaW1lb3V0KGJhdGNoLmJpbmQoY29udGV4dCxiKSwwKTtcblx0XHRcdFx0XHRcdGVsc2UgICAgICAgICAgICAgICAgICAgIGZpbmlzaCgpO1xuXHRcdFx0XHQgXHR9XG5cdFx0XHQgXHR9O1xuXHRcdFx0fSwgY29uc29sZS5lcnJvcik7XG5cdFx0fSxmYWxzZSk7XG5cdFx0eGhyLnNlbmQoKTtcblx0fVxuXG5cdGdldF9zaXplKHVybCxmdW5jdGlvbihzaXplKXtcblx0XHR0b3RhbHNpemU9c2l6ZTtcblx0XHRpZiAoIXNpemUpIHtcblx0XHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbZmFsc2VdKTtcblx0XHR9IGVsc2Ugey8vcmVhZHkgdG8gZG93bmxvYWRcblx0XHRcdHJtKHRlbXBmbixmdW5jdGlvbigpe1xuXHRcdFx0XHQgYmF0Y2hlcz1jcmVhdGVCYXRjaGVzKHNpemUpO1xuXHRcdFx0XHQgaWYgKHN0YXR1c2NiKSBzdGF0dXNjYi5hcHBseShjb250ZXh0LFsgMCwgdG90YWxzaXplIF0pO1xuXHRcdFx0XHQgQVBJLmZzLnJvb3QuZ2V0RmlsZSh0ZW1wZm4sIHtjcmVhdGU6IDEsIGV4Y2x1c2l2ZTogZmFsc2V9LCBmdW5jdGlvbihfZmlsZUVudHJ5KSB7XG5cdFx0XHRcdFx0XHRcdGZpbGVFbnRyeT1fZmlsZUVudHJ5O1xuXHRcdFx0XHRcdFx0YmF0Y2goMCk7XG5cdFx0XHRcdCB9KTtcblx0XHRcdH0sdGhpcyk7XG5cdFx0fVxuXHR9KTtcbn1cblxudmFyIHJlYWRGaWxlPWZ1bmN0aW9uKGZpbGVuYW1lLGNiLGNvbnRleHQpIHtcblx0QVBJLmZzLnJvb3QuZ2V0RmlsZShmaWxlbmFtZSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG5cdFx0XHR2YXIgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcblx0XHRcdHJlYWRlci5vbmxvYWRlbmQgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0aWYgKGNiKSBjYi5hcHBseShjYixbdGhpcy5yZXN1bHRdKTtcblx0XHRcdFx0fTsgICAgICAgICAgICBcblx0fSwgY29uc29sZS5lcnJvcik7XG59XG52YXIgd3JpdGVGaWxlPWZ1bmN0aW9uKGZpbGVuYW1lLGJ1ZixjYixjb250ZXh0KXtcblx0QVBJLmZzLnJvb3QuZ2V0RmlsZShmaWxlbmFtZSwge2NyZWF0ZTogdHJ1ZSwgZXhjbHVzaXZlOiB0cnVlfSwgZnVuY3Rpb24oZmlsZUVudHJ5KSB7XG5cdFx0XHRmaWxlRW50cnkuY3JlYXRlV3JpdGVyKGZ1bmN0aW9uKGZpbGVXcml0ZXIpIHtcblx0XHRcdFx0ZmlsZVdyaXRlci53cml0ZShidWYpO1xuXHRcdFx0XHRmaWxlV3JpdGVyLm9ud3JpdGVlbmQgPSBmdW5jdGlvbihlKSB7XG5cdFx0XHRcdFx0aWYgKGNiKSBjYi5hcHBseShjYixbYnVmLmJ5dGVMZW5ndGhdKTtcblx0XHRcdFx0fTsgICAgICAgICAgICBcblx0XHRcdH0sIGNvbnNvbGUuZXJyb3IpO1xuXHR9LCBjb25zb2xlLmVycm9yKTtcbn1cblxudmFyIHJlYWRkaXI9ZnVuY3Rpb24oY2IsY29udGV4dCkge1xuXHR2YXIgZGlyUmVhZGVyID0gQVBJLmZzLnJvb3QuY3JlYXRlUmVhZGVyKCk7XG5cdHZhciBvdXQ9W10sdGhhdD10aGlzO1xuXHRkaXJSZWFkZXIucmVhZEVudHJpZXMoZnVuY3Rpb24oZW50cmllcykge1xuXHRcdGlmIChlbnRyaWVzLmxlbmd0aCkge1xuXHRcdFx0Zm9yICh2YXIgaSA9IDAsIGVudHJ5OyBlbnRyeSA9IGVudHJpZXNbaV07ICsraSkge1xuXHRcdFx0XHRpZiAoZW50cnkuaXNGaWxlKSB7XG5cdFx0XHRcdFx0b3V0LnB1c2goW2VudHJ5Lm5hbWUsZW50cnkudG9VUkwgPyBlbnRyeS50b1VSTCgpIDogZW50cnkudG9VUkkoKV0pO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHRcdEFQSS5maWxlcz1vdXQ7XG5cdFx0aWYgKGNiKSBjYi5hcHBseShjb250ZXh0LFtvdXRdKTtcblx0fSwgZnVuY3Rpb24oKXtcblx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW251bGxdKTtcblx0fSk7XG59XG52YXIgZ2V0RmlsZVVSTD1mdW5jdGlvbihmaWxlbmFtZSkge1xuXHRpZiAoIUFQSS5maWxlcyApIHJldHVybiBudWxsO1xuXHR2YXIgZmlsZT0gQVBJLmZpbGVzLmZpbHRlcihmdW5jdGlvbihmKXtyZXR1cm4gZlswXT09ZmlsZW5hbWV9KTtcblx0aWYgKGZpbGUubGVuZ3RoKSByZXR1cm4gZmlsZVswXVsxXTtcbn1cbnZhciBybT1mdW5jdGlvbihmaWxlbmFtZSxjYixjb250ZXh0KSB7XG5cdHZhciB1cmw9Z2V0RmlsZVVSTChmaWxlbmFtZSk7XG5cdGlmICh1cmwpIHJtVVJMKHVybCxjYixjb250ZXh0KTtcblx0ZWxzZSBpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW2ZhbHNlXSk7XG59XG5cbnZhciBybVVSTD1mdW5jdGlvbihmaWxlbmFtZSxjYixjb250ZXh0KSB7XG5cdHdlYmtpdFJlc29sdmVMb2NhbEZpbGVTeXN0ZW1VUkwoZmlsZW5hbWUsIGZ1bmN0aW9uKGZpbGVFbnRyeSkge1xuXHRcdGZpbGVFbnRyeS5yZW1vdmUoZnVuY3Rpb24oKSB7XG5cdFx0XHRpZiAoY2IpIGNiLmFwcGx5KGNvbnRleHQsW3RydWVdKTtcblx0XHR9LCBjb25zb2xlLmVycm9yKTtcblx0fSwgIGZ1bmN0aW9uKGUpe1xuXHRcdGlmIChjYikgY2IuYXBwbHkoY29udGV4dCxbZmFsc2VdKTsvL25vIHN1Y2ggZmlsZVxuXHR9KTtcbn1cbmZ1bmN0aW9uIGVycm9ySGFuZGxlcihlKSB7XG5cdGNvbnNvbGUuZXJyb3IoJ0Vycm9yOiAnICtlLm5hbWUrIFwiIFwiK2UubWVzc2FnZSk7XG59XG52YXIgaW5pdGZzPWZ1bmN0aW9uKGdyYW50ZWRCeXRlcyxjYixjb250ZXh0KSB7XG5cdHdlYmtpdFJlcXVlc3RGaWxlU3lzdGVtKFBFUlNJU1RFTlQsIGdyYW50ZWRCeXRlcywgIGZ1bmN0aW9uKGZzKSB7XG5cdFx0QVBJLmZzPWZzO1xuXHRcdEFQSS5xdW90YT1ncmFudGVkQnl0ZXM7XG5cdFx0cmVhZGRpcihmdW5jdGlvbigpe1xuXHRcdFx0QVBJLmluaXRpYWxpemVkPXRydWU7XG5cdFx0XHRjYi5hcHBseShjb250ZXh0LFtncmFudGVkQnl0ZXMsZnNdKTtcblx0XHR9LGNvbnRleHQpO1xuXHR9LCBlcnJvckhhbmRsZXIpO1xufVxudmFyIGluaXQ9ZnVuY3Rpb24ocXVvdGEsY2IsY29udGV4dCkge1xuXHRuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UucmVxdWVzdFF1b3RhKHF1b3RhLCBcblx0XHRcdGZ1bmN0aW9uKGdyYW50ZWRCeXRlcykge1xuXHRcdFx0XHRpbml0ZnMoZ3JhbnRlZEJ5dGVzLGNiLGNvbnRleHQpO1xuXHRcdH0sIGVycm9ySGFuZGxlclxuXHQpO1xufVxudmFyIHF1ZXJ5UXVvdGE9ZnVuY3Rpb24oY2IsY29udGV4dCkge1xuXHR2YXIgdGhhdD10aGlzO1xuXHRuYXZpZ2F0b3Iud2Via2l0UGVyc2lzdGVudFN0b3JhZ2UucXVlcnlVc2FnZUFuZFF1b3RhKCBcblx0IGZ1bmN0aW9uKHVzYWdlLHF1b3RhKXtcblx0XHRcdGluaXRmcyhxdW90YSxmdW5jdGlvbigpe1xuXHRcdFx0XHRjYi5hcHBseShjb250ZXh0LFt1c2FnZSxxdW90YV0pO1xuXHRcdFx0fSxjb250ZXh0KTtcblx0fSk7XG59XG52YXIgQVBJPXtcblx0aW5pdDppbml0XG5cdCxyZWFkZGlyOnJlYWRkaXJcblx0LGNoZWNrVXBkYXRlOmNoZWNrVXBkYXRlXG5cdCxybTpybVxuXHQscm1VUkw6cm1VUkxcblx0LGdldEZpbGVVUkw6Z2V0RmlsZVVSTFxuXHQsd3JpdGVGaWxlOndyaXRlRmlsZVxuXHQscmVhZEZpbGU6cmVhZEZpbGVcblx0LGRvd25sb2FkOmRvd25sb2FkXG5cdCxnZXRfaGVhZDpnZXRfaGVhZFxuXHQsZ2V0X2RhdGU6Z2V0X2RhdGVcblx0LGdldF9zaXplOmdldF9zaXplXG5cdCxnZXREb3dubG9hZFNpemU6Z2V0X3NpemVcblx0LHF1ZXJ5UXVvdGE6cXVlcnlRdW90YVxufVxubW9kdWxlLmV4cG9ydHM9QVBJOyIsInZhciBodG1sNWZzPXJlcXVpcmUoXCIuL2h0bWw1ZnNcIik7XG52YXIgRT1SZWFjdC5jcmVhdGVFbGVtZW50O1xuXG52YXIgaHRtbGZzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuXHRnZXRJbml0aWFsU3RhdGU6ZnVuY3Rpb24oKSB7IFxuXHRcdHJldHVybiB7cmVhZHk6ZmFsc2UsIHF1b3RhOjAsdXNhZ2U6MCxJbml0aWFsaXplZDpmYWxzZSxhdXRvY2xvc2U6dGhpcy5wcm9wcy5hdXRvY2xvc2V9O1xuXHR9LFxuXHRpbml0RmlsZXN5c3RlbTpmdW5jdGlvbigpIHtcblx0XHR2YXIgcXVvdGE9dGhpcy5wcm9wcy5xdW90YXx8MTAyNCoxMDI0KjEyODsgLy8gZGVmYXVsdCAxMjhNQlxuXHRcdHF1b3RhPXBhcnNlSW50KHF1b3RhKTtcblx0XHRodG1sNWZzLmluaXQocXVvdGEsZnVuY3Rpb24ocSl7XG5cdFx0XHR0aGlzLmRpYWxvZz1mYWxzZTtcblx0XHRcdCQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnaGlkZScpO1xuXHRcdFx0dGhpcy5zZXRTdGF0ZSh7cXVvdGE6cSxhdXRvY2xvc2U6dHJ1ZX0pO1xuXHRcdH0sdGhpcyk7XG5cdH0sXG5cdHdlbGNvbWU6ZnVuY3Rpb24oKSB7XG5cdFx0cmV0dXJuIChcblx0XHRFKFwiZGl2XCIsIHtyZWY6IFwiZGlhbG9nMVwiLCBjbGFzc05hbWU6IFwibW9kYWwgZmFkZVwiLCBpZDogXCJteU1vZGFsXCIsIFwiZGF0YS1iYWNrZHJvcFwiOiBcInN0YXRpY1wifSwgXG5cdFx0ICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1kaWFsb2dcIn0sIFxuXHRcdCAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1jb250ZW50XCJ9LCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1oZWFkZXJcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiaDRcIiwge2NsYXNzTmFtZTogXCJtb2RhbC10aXRsZVwifSwgXCJXZWxjb21lXCIpXG5cdFx0ICAgICAgICApLCBcblx0XHQgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJtb2RhbC1ib2R5XCJ9LCBcblx0XHQgICAgICAgICAgXCJCcm93c2VyIHdpbGwgYXNrIGZvciB5b3VyIGNvbmZpcm1hdGlvbi5cIlxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcblx0XHQgICAgICAgICAgRShcImJ1dHRvblwiLCB7b25DbGljazogdGhpcy5pbml0RmlsZXN5c3RlbSwgdHlwZTogXCJidXR0b25cIiwgXG5cdFx0ICAgICAgICAgICAgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwifSwgXCJJbml0aWFsaXplIEZpbGUgU3lzdGVtXCIpXG5cdFx0ICAgICAgICApXG5cdFx0ICAgICAgKVxuXHRcdCAgICApXG5cdFx0ICApXG5cdFx0ICk7XG5cdH0sXG5cdHJlbmRlckRlZmF1bHQ6ZnVuY3Rpb24oKXtcblx0XHR2YXIgdXNlZD1NYXRoLmZsb29yKHRoaXMuc3RhdGUudXNhZ2UvdGhpcy5zdGF0ZS5xdW90YSAqMTAwKTtcblx0XHR2YXIgbW9yZT1mdW5jdGlvbigpIHtcblx0XHRcdGlmICh1c2VkPjUwKSByZXR1cm4gRShcImJ1dHRvblwiLCB7dHlwZTogXCJidXR0b25cIiwgY2xhc3NOYW1lOiBcImJ0biBidG4tcHJpbWFyeVwifSwgXCJBbGxvY2F0ZSBNb3JlXCIpO1xuXHRcdFx0ZWxzZSBudWxsO1xuXHRcdH1cblx0XHRyZXR1cm4gKFxuXHRcdEUoXCJkaXZcIiwge3JlZjogXCJkaWFsb2cxXCIsIGNsYXNzTmFtZTogXCJtb2RhbCBmYWRlXCIsIGlkOiBcIm15TW9kYWxcIiwgXCJkYXRhLWJhY2tkcm9wXCI6IFwic3RhdGljXCJ9LCBcblx0XHQgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWRpYWxvZ1wifSwgXG5cdFx0ICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWNvbnRlbnRcIn0sIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWhlYWRlclwifSwgXG5cdFx0ICAgICAgICAgIEUoXCJoNFwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLXRpdGxlXCJ9LCBcIlNhbmRib3ggRmlsZSBTeXN0ZW1cIilcblx0XHQgICAgICAgICksIFxuXHRcdCAgICAgICAgRShcImRpdlwiLCB7Y2xhc3NOYW1lOiBcIm1vZGFsLWJvZHlcIn0sIFxuXHRcdCAgICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwicHJvZ3Jlc3NcIn0sIFxuXHRcdCAgICAgICAgICAgIEUoXCJkaXZcIiwge2NsYXNzTmFtZTogXCJwcm9ncmVzcy1iYXJcIiwgcm9sZTogXCJwcm9ncmVzc2JhclwiLCBzdHlsZToge3dpZHRoOiB1c2VkK1wiJVwifX0sIFxuXHRcdCAgICAgICAgICAgICAgIHVzZWQsIFwiJVwiXG5cdFx0ICAgICAgICAgICAgKVxuXHRcdCAgICAgICAgICApLCBcblx0XHQgICAgICAgICAgRShcInNwYW5cIiwgbnVsbCwgdGhpcy5zdGF0ZS5xdW90YSwgXCIgdG90YWwgLCBcIiwgdGhpcy5zdGF0ZS51c2FnZSwgXCIgaW4gdXNlZFwiKVxuXHRcdCAgICAgICAgKSwgXG5cdFx0ICAgICAgICBFKFwiZGl2XCIsIHtjbGFzc05hbWU6IFwibW9kYWwtZm9vdGVyXCJ9LCBcblx0XHQgICAgICAgICAgRShcImJ1dHRvblwiLCB7b25DbGljazogdGhpcy5kaXNtaXNzLCB0eXBlOiBcImJ1dHRvblwiLCBjbGFzc05hbWU6IFwiYnRuIGJ0bi1kZWZhdWx0XCIsIFwiZGF0YS1kaXNtaXNzXCI6IFwibW9kYWxcIn0sIFwiQ2xvc2VcIiksIFxuXHRcdCAgICAgICAgICBtb3JlKClcblx0XHQgICAgICAgIClcblx0XHQgICAgICApXG5cdFx0ICAgIClcblx0XHQgIClcblx0XHQgICk7XG5cdH0sXG5cdGRpc21pc3M6ZnVuY3Rpb24oKSB7XG5cdFx0dmFyIHRoYXQ9dGhpcztcblx0XHRzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0XHR0aGF0LnByb3BzLm9uUmVhZHkodGhhdC5zdGF0ZS5xdW90YSx0aGF0LnN0YXRlLnVzYWdlKTtcdFxuXHRcdH0sMCk7XG5cdH0sXG5cdHF1ZXJ5UXVvdGE6ZnVuY3Rpb24oKSB7XG5cdFx0aWYgKGtzYW5hZ2FwLnBsYXRmb3JtPT1cImNocm9tZVwiKSB7XG5cdFx0XHRodG1sNWZzLnF1ZXJ5UXVvdGEoZnVuY3Rpb24odXNhZ2UscXVvdGEpe1xuXHRcdFx0XHR0aGlzLnNldFN0YXRlKHt1c2FnZTp1c2FnZSxxdW90YTpxdW90YSxpbml0aWFsaXplZDp0cnVlfSk7XG5cdFx0XHR9LHRoaXMpO1x0XHRcdFxuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLnNldFN0YXRlKHt1c2FnZTozMzMscXVvdGE6MTAwMCoxMDAwKjEwMjQsaW5pdGlhbGl6ZWQ6dHJ1ZSxhdXRvY2xvc2U6dHJ1ZX0pO1xuXHRcdH1cblx0fSxcblx0cmVuZGVyOmZ1bmN0aW9uKCkge1xuXHRcdHZhciB0aGF0PXRoaXM7XG5cdFx0aWYgKCF0aGlzLnN0YXRlLnF1b3RhIHx8IHRoaXMuc3RhdGUucXVvdGE8dGhpcy5wcm9wcy5xdW90YSkge1xuXHRcdFx0aWYgKHRoaXMuc3RhdGUuaW5pdGlhbGl6ZWQpIHtcblx0XHRcdFx0dGhpcy5kaWFsb2c9dHJ1ZTtcblx0XHRcdFx0cmV0dXJuIHRoaXMud2VsY29tZSgpO1x0XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gRShcInNwYW5cIiwgbnVsbCwgXCJjaGVja2luZyBxdW90YVwiKTtcblx0XHRcdH1cdFx0XHRcblx0XHR9IGVsc2Uge1xuXHRcdFx0aWYgKCF0aGlzLnN0YXRlLmF1dG9jbG9zZSkge1xuXHRcdFx0XHR0aGlzLmRpYWxvZz10cnVlO1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5yZW5kZXJEZWZhdWx0KCk7IFxuXHRcdFx0fVxuXHRcdFx0dGhpcy5kaXNtaXNzKCk7XG5cdFx0XHR0aGlzLmRpYWxvZz1mYWxzZTtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblx0fSxcblx0Y29tcG9uZW50RGlkTW91bnQ6ZnVuY3Rpb24oKSB7XG5cdFx0aWYgKCF0aGlzLnN0YXRlLnF1b3RhKSB7XG5cdFx0XHR0aGlzLnF1ZXJ5UXVvdGEoKTtcblxuXHRcdH07XG5cdH0sXG5cdGNvbXBvbmVudERpZFVwZGF0ZTpmdW5jdGlvbigpIHtcblx0XHRpZiAodGhpcy5kaWFsb2cpICQodGhpcy5yZWZzLmRpYWxvZzEuZ2V0RE9NTm9kZSgpKS5tb2RhbCgnc2hvdycpO1xuXHR9XG59KTtcblxubW9kdWxlLmV4cG9ydHM9aHRtbGZzOyIsInZhciBrc2FuYT17XCJwbGF0Zm9ybVwiOlwicmVtb3RlXCJ9O1xuaWYgKHR5cGVvZiB3aW5kb3chPVwidW5kZWZpbmVkXCIpIHtcblx0d2luZG93LmtzYW5hPWtzYW5hO1xuXHRpZiAodHlwZW9mIGtzYW5hZ2FwPT1cInVuZGVmaW5lZFwiKSB7XG5cdFx0d2luZG93LmtzYW5hZ2FwPXJlcXVpcmUoXCIuL2tzYW5hZ2FwXCIpOyAvL2NvbXBhdGlibGUgbGF5ZXIgd2l0aCBtb2JpbGVcblx0fVxufVxuaWYgKHR5cGVvZiBwcm9jZXNzICE9XCJ1bmRlZmluZWRcIikge1xuXHRpZiAocHJvY2Vzcy52ZXJzaW9ucyAmJiBwcm9jZXNzLnZlcnNpb25zW1wibm9kZS13ZWJraXRcIl0pIHtcbiAgXHRcdGlmICh0eXBlb2Ygbm9kZVJlcXVpcmUhPVwidW5kZWZpbmVkXCIpIGtzYW5hLnJlcXVpcmU9bm9kZVJlcXVpcmU7XG4gIFx0XHRrc2FuYS5wbGF0Zm9ybT1cIm5vZGUtd2Via2l0XCI7XG4gIFx0XHR3aW5kb3cua3NhbmFnYXAucGxhdGZvcm09XCJub2RlLXdlYmtpdFwiO1xuXHRcdHZhciBrc2FuYWpzPXJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoXCJrc2FuYS5qc1wiLFwidXRmOFwiKS50cmltKCk7XG5cdFx0a3NhbmEuanM9SlNPTi5wYXJzZShrc2FuYWpzLnN1YnN0cmluZygxNCxrc2FuYWpzLmxlbmd0aC0xKSk7XG5cdFx0d2luZG93Lmtmcz1yZXF1aXJlKFwiLi9rZnNcIik7XG4gIFx0fVxufSBlbHNlIGlmICh0eXBlb2YgY2hyb21lIT1cInVuZGVmaW5lZFwiKXsvL30gJiYgY2hyb21lLmZpbGVTeXN0ZW0pe1xuLy9cdHdpbmRvdy5rc2FuYWdhcD1yZXF1aXJlKFwiLi9rc2FuYWdhcFwiKTsgLy9jb21wYXRpYmxlIGxheWVyIHdpdGggbW9iaWxlXG5cdHdpbmRvdy5rc2FuYWdhcC5wbGF0Zm9ybT1cImNocm9tZVwiO1xuXHR3aW5kb3cua2ZzPXJlcXVpcmUoXCIuL2tmc19odG1sNVwiKTtcblx0cmVxdWlyZShcIi4vbGl2ZXJlbG9hZFwiKSgpO1xuXHRrc2FuYS5wbGF0Zm9ybT1cImNocm9tZVwiO1xufSBlbHNlIHtcblx0aWYgKHR5cGVvZiBrc2FuYWdhcCE9XCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZnMhPVwidW5kZWZpbmVkXCIpIHsvL21vYmlsZVxuXHRcdHZhciBrc2FuYWpzPWZzLnJlYWRGaWxlU3luYyhcImtzYW5hLmpzXCIsXCJ1dGY4XCIpLnRyaW0oKTsgLy9hbmRyb2lkIGV4dHJhIFxcbiBhdCB0aGUgZW5kXG5cdFx0a3NhbmEuanM9SlNPTi5wYXJzZShrc2FuYWpzLnN1YnN0cmluZygxNCxrc2FuYWpzLmxlbmd0aC0xKSk7XG5cdFx0a3NhbmEucGxhdGZvcm09a3NhbmFnYXAucGxhdGZvcm07XG5cdFx0aWYgKHR5cGVvZiBrc2FuYWdhcC5hbmRyb2lkICE9XCJ1bmRlZmluZWRcIikge1xuXHRcdFx0a3NhbmEucGxhdGZvcm09XCJhbmRyb2lkXCI7XG5cdFx0fVxuXHR9XG59XG52YXIgdGltZXI9bnVsbDtcbnZhciBib290PWZ1bmN0aW9uKGFwcElkLGNiKSB7XG5cdGtzYW5hLmFwcElkPWFwcElkO1xuXHRpZiAoa3NhbmFnYXAucGxhdGZvcm09PVwiY2hyb21lXCIpIHsgLy9uZWVkIHRvIHdhaXQgZm9yIGpzb25wIGtzYW5hLmpzXG5cdFx0dGltZXI9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRcdGlmIChrc2FuYS5yZWFkeSl7XG5cdFx0XHRcdGNsZWFySW50ZXJ2YWwodGltZXIpO1xuXHRcdFx0XHRpZiAoa3NhbmEuanMgJiYga3NhbmEuanMuZmlsZXMgJiYga3NhbmEuanMuZmlsZXMubGVuZ3RoKSB7XG5cdFx0XHRcdFx0cmVxdWlyZShcIi4vaW5zdGFsbGtkYlwiKShrc2FuYS5qcyxjYik7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Y2IoKTtcdFx0XG5cdFx0XHRcdH1cblx0XHRcdH1cblx0XHR9LDMwMCk7XG5cdH0gZWxzZSB7XG5cdFx0Y2IoKTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cz17Ym9vdDpib290XG5cdCxodG1sZnM6cmVxdWlyZShcIi4vaHRtbGZzXCIpXG5cdCxodG1sNWZzOnJlcXVpcmUoXCIuL2h0bWw1ZnNcIilcblx0LGxpdmV1cGRhdGU6cmVxdWlyZShcIi4vbGl2ZXVwZGF0ZVwiKVxuXHQsZmlsZWluc3RhbGxlcjpyZXF1aXJlKFwiLi9maWxlaW5zdGFsbGVyXCIpXG5cdCxkb3dubG9hZGVyOnJlcXVpcmUoXCIuL2Rvd25sb2FkZXJcIilcblx0LGluc3RhbGxrZGI6cmVxdWlyZShcIi4vaW5zdGFsbGtkYlwiKVxufTsiLCJ2YXIgRmlsZWluc3RhbGxlcj1yZXF1aXJlKFwiLi9maWxlaW5zdGFsbGVyXCIpO1xuXG52YXIgZ2V0UmVxdWlyZV9rZGI9ZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcXVpcmVkPVtdO1xuICAgIGtzYW5hLmpzLmZpbGVzLm1hcChmdW5jdGlvbihmKXtcbiAgICAgIGlmIChmLmluZGV4T2YoXCIua2RiXCIpPT1mLmxlbmd0aC00KSB7XG4gICAgICAgIHZhciBzbGFzaD1mLmxhc3RJbmRleE9mKFwiL1wiKTtcbiAgICAgICAgaWYgKHNsYXNoPi0xKSB7XG4gICAgICAgICAgdmFyIGRiaWQ9Zi5zdWJzdHJpbmcoc2xhc2grMSxmLmxlbmd0aC00KTtcbiAgICAgICAgICByZXF1aXJlZC5wdXNoKHt1cmw6ZixkYmlkOmRiaWQsZmlsZW5hbWU6ZGJpZCtcIi5rZGJcIn0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciBkYmlkPWYuc3Vic3RyaW5nKDAsZi5sZW5ndGgtNCk7XG4gICAgICAgICAgcmVxdWlyZWQucHVzaCh7dXJsOmtzYW5hLmpzLmJhc2V1cmwrZixkYmlkOmRiaWQsZmlsZW5hbWU6Zn0pO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgIH1cbiAgICB9KTtcbiAgICByZXR1cm4gcmVxdWlyZWQ7XG59XG52YXIgY2FsbGJhY2s9bnVsbDtcbnZhciBvblJlYWR5PWZ1bmN0aW9uKCkge1xuXHRjYWxsYmFjaygpO1xufVxudmFyIG9wZW5GaWxlaW5zdGFsbGVyPWZ1bmN0aW9uKGtlZXApIHtcblx0dmFyIHJlcXVpcmVfa2RiPWdldFJlcXVpcmVfa2RiKCkubWFwKGZ1bmN0aW9uKGRiKXtcblx0ICByZXR1cm4ge1xuXHQgICAgdXJsOndpbmRvdy5sb2NhdGlvbi5vcmlnaW4rd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lK2RiLmRiaWQrXCIua2RiXCIsXG5cdCAgICBkYmRiOmRiLmRiaWQsXG5cdCAgICBmaWxlbmFtZTpkYi5maWxlbmFtZVxuXHQgIH1cblx0fSlcblx0cmV0dXJuIFJlYWN0LmNyZWF0ZUVsZW1lbnQoRmlsZWluc3RhbGxlciwge3F1b3RhOiBcIjUxMk1cIiwgYXV0b2Nsb3NlOiAha2VlcCwgbmVlZGVkOiByZXF1aXJlX2tkYiwgXG5cdCAgICAgICAgICAgICAgICAgb25SZWFkeTogb25SZWFkeX0pO1xufVxudmFyIGluc3RhbGxrZGI9ZnVuY3Rpb24oa3NhbmFqcyxjYixjb250ZXh0KSB7XG5cdGNvbnNvbGUubG9nKGtzYW5hanMuZmlsZXMpO1xuXHRSZWFjdC5yZW5kZXIob3BlbkZpbGVpbnN0YWxsZXIoKSxkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIm1haW5cIikpO1xuXHRjYWxsYmFjaz1jYjtcbn1cbm1vZHVsZS5leHBvcnRzPWluc3RhbGxrZGI7IiwiLy9TaW11bGF0ZSBmZWF0dXJlIGluIGtzYW5hZ2FwXG4vKiBcbiAgcnVucyBvbiBub2RlLXdlYmtpdCBvbmx5XG4qL1xuXG52YXIgcmVhZERpcj1mdW5jdGlvbihwYXRoKSB7IC8vc2ltdWxhdGUgS3NhbmFnYXAgZnVuY3Rpb25cblx0dmFyIGZzPW5vZGVSZXF1aXJlKFwiZnNcIik7XG5cdHBhdGg9cGF0aHx8XCIuLlwiO1xuXHR2YXIgZGlycz1bXTtcblx0aWYgKHBhdGhbMF09PVwiLlwiKSB7XG5cdFx0aWYgKHBhdGg9PVwiLlwiKSBkaXJzPWZzLnJlYWRkaXJTeW5jKFwiLlwiKTtcblx0XHRlbHNlIHtcblx0XHRcdGRpcnM9ZnMucmVhZGRpclN5bmMoXCIuLlwiKTtcblx0XHR9XG5cdH0gZWxzZSB7XG5cdFx0ZGlycz1mcy5yZWFkZGlyU3luYyhwYXRoKTtcblx0fVxuXG5cdHJldHVybiBkaXJzLmpvaW4oXCJcXHVmZmZmXCIpO1xufVxudmFyIGxpc3RBcHBzPWZ1bmN0aW9uKCkge1xuXHR2YXIgZnM9bm9kZVJlcXVpcmUoXCJmc1wiKTtcblx0dmFyIGtzYW5hanNmaWxlPWZ1bmN0aW9uKGQpIHtyZXR1cm4gXCIuLi9cIitkK1wiL2tzYW5hLmpzXCJ9O1xuXHR2YXIgZGlycz1mcy5yZWFkZGlyU3luYyhcIi4uXCIpLmZpbHRlcihmdW5jdGlvbihkKXtcblx0XHRcdFx0cmV0dXJuIGZzLnN0YXRTeW5jKFwiLi4vXCIrZCkuaXNEaXJlY3RvcnkoKSAmJiBkWzBdIT1cIi5cIlxuXHRcdFx0XHQgICAmJiBmcy5leGlzdHNTeW5jKGtzYW5hanNmaWxlKGQpKTtcblx0fSk7XG5cdFxuXHR2YXIgb3V0PWRpcnMubWFwKGZ1bmN0aW9uKGQpe1xuXHRcdHZhciBjb250ZW50PWZzLnJlYWRGaWxlU3luYyhrc2FuYWpzZmlsZShkKSxcInV0ZjhcIik7XG4gIFx0Y29udGVudD1jb250ZW50LnJlcGxhY2UoXCJ9KVwiLFwifVwiKTtcbiAgXHRjb250ZW50PWNvbnRlbnQucmVwbGFjZShcImpzb25wX2hhbmRsZXIoXCIsXCJcIik7XG5cdFx0dmFyIG9iaj0gSlNPTi5wYXJzZShjb250ZW50KTtcblx0XHRvYmouZGJpZD1kO1xuXHRcdG9iai5wYXRoPWQ7XG5cdFx0cmV0dXJuIG9iajtcblx0fSlcblx0cmV0dXJuIEpTT04uc3RyaW5naWZ5KG91dCk7XG59XG5cblxuXG52YXIga2ZzPXtyZWFkRGlyOnJlYWREaXIsbGlzdEFwcHM6bGlzdEFwcHN9O1xuXG5tb2R1bGUuZXhwb3J0cz1rZnM7IiwidmFyIHJlYWREaXI9ZnVuY3Rpb24oKXtcblx0cmV0dXJuIFtdO1xufVxudmFyIGxpc3RBcHBzPWZ1bmN0aW9uKCl7XG5cdHJldHVybiBbXTtcbn1cbm1vZHVsZS5leHBvcnRzPXtyZWFkRGlyOnJlYWREaXIsbGlzdEFwcHM6bGlzdEFwcHN9OyIsInZhciBhcHBuYW1lPVwiaW5zdGFsbGVyXCI7XG52YXIgc3dpdGNoQXBwPWZ1bmN0aW9uKHBhdGgpIHtcblx0dmFyIGZzPXJlcXVpcmUoXCJmc1wiKTtcblx0cGF0aD1cIi4uL1wiK3BhdGg7XG5cdGFwcG5hbWU9cGF0aDtcblx0ZG9jdW1lbnQubG9jYXRpb24uaHJlZj0gcGF0aCtcIi9pbmRleC5odG1sXCI7IFxuXHRwcm9jZXNzLmNoZGlyKHBhdGgpO1xufVxudmFyIGRvd25sb2FkZXI9e307XG52YXIgcm9vdFBhdGg9XCJcIjtcblxudmFyIGRlbGV0ZUFwcD1mdW5jdGlvbihhcHApIHtcblx0Y29uc29sZS5lcnJvcihcIm5vdCBhbGxvdyBvbiBQQywgZG8gaXQgaW4gRmlsZSBFeHBsb3Jlci8gRmluZGVyXCIpO1xufVxudmFyIHVzZXJuYW1lPWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gXCJcIjtcbn1cbnZhciB1c2VyZW1haWw9ZnVuY3Rpb24oKSB7XG5cdHJldHVybiBcIlwiXG59XG52YXIgcnVudGltZV92ZXJzaW9uPWZ1bmN0aW9uKCkge1xuXHRyZXR1cm4gXCIxLjRcIjtcbn1cblxuLy9jb3B5IGZyb20gbGl2ZXVwZGF0ZVxudmFyIGpzb25wPWZ1bmN0aW9uKHVybCxkYmlkLGNhbGxiYWNrLGNvbnRleHQpIHtcbiAgdmFyIHNjcmlwdD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImpzb25wMlwiKTtcbiAgaWYgKHNjcmlwdCkge1xuICAgIHNjcmlwdC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHNjcmlwdCk7XG4gIH1cbiAgd2luZG93Lmpzb25wX2hhbmRsZXI9ZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmICh0eXBlb2YgZGF0YT09XCJvYmplY3RcIikge1xuICAgICAgZGF0YS5kYmlkPWRiaWQ7XG4gICAgICBjYWxsYmFjay5hcHBseShjb250ZXh0LFtkYXRhXSk7ICAgIFxuICAgIH0gIFxuICB9XG4gIHdpbmRvdy5qc29ucF9lcnJvcl9oYW5kbGVyPWZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJ1cmwgdW5yZWFjaGFibGVcIix1cmwpO1xuICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW251bGxdKTtcbiAgfVxuICBzY3JpcHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ2lkJywgXCJqc29ucDJcIik7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ29uZXJyb3InLCBcImpzb25wX2Vycm9yX2hhbmRsZXIoKVwiKTtcbiAgdXJsPXVybCsnPycrKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnc3JjJywgdXJsKTtcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXS5hcHBlbmRDaGlsZChzY3JpcHQpOyBcbn1cblxudmFyIGtzYW5hZ2FwPXtcblx0cGxhdGZvcm06XCJub2RlLXdlYmtpdFwiLFxuXHRzdGFydERvd25sb2FkOmRvd25sb2FkZXIuc3RhcnREb3dubG9hZCxcblx0ZG93bmxvYWRlZEJ5dGU6ZG93bmxvYWRlci5kb3dubG9hZGVkQnl0ZSxcblx0ZG93bmxvYWRpbmdGaWxlOmRvd25sb2FkZXIuZG93bmxvYWRpbmdGaWxlLFxuXHRjYW5jZWxEb3dubG9hZDpkb3dubG9hZGVyLmNhbmNlbERvd25sb2FkLFxuXHRkb25lRG93bmxvYWQ6ZG93bmxvYWRlci5kb25lRG93bmxvYWQsXG5cdHN3aXRjaEFwcDpzd2l0Y2hBcHAsXG5cdHJvb3RQYXRoOnJvb3RQYXRoLFxuXHRkZWxldGVBcHA6IGRlbGV0ZUFwcCxcblx0dXNlcm5hbWU6dXNlcm5hbWUsIC8vbm90IHN1cHBvcnQgb24gUENcblx0dXNlcmVtYWlsOnVzZXJuYW1lLFxuXHRydW50aW1lX3ZlcnNpb246cnVudGltZV92ZXJzaW9uLFxuXHRcbn1cblxuaWYgKHR5cGVvZiBwcm9jZXNzIT1cInVuZGVmaW5lZFwiKSB7XG5cdHZhciBrc2FuYWpzPXJlcXVpcmUoXCJmc1wiKS5yZWFkRmlsZVN5bmMoXCIuL2tzYW5hLmpzXCIsXCJ1dGY4XCIpLnRyaW0oKTtcblx0ZG93bmxvYWRlcj1yZXF1aXJlKFwiLi9kb3dubG9hZGVyXCIpO1xuXHRjb25zb2xlLmxvZyhrc2FuYWpzKTtcblx0Ly9rc2FuYS5qcz1KU09OLnBhcnNlKGtzYW5hanMuc3Vic3RyaW5nKDE0LGtzYW5hanMubGVuZ3RoLTEpKTtcblx0cm9vdFBhdGg9cHJvY2Vzcy5jd2QoKTtcblx0cm9vdFBhdGg9cmVxdWlyZShcInBhdGhcIikucmVzb2x2ZShyb290UGF0aCxcIi4uXCIpLnJlcGxhY2UoL1xcXFwvZyxcIi9cIikrJy8nO1xuXHRrc2FuYS5yZWFkeT10cnVlO1xufSBlbHNle1xuXHR2YXIgdXJsPXdpbmRvdy5sb2NhdGlvbi5vcmlnaW4rd2luZG93LmxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoXCJpbmRleC5odG1sXCIsXCJcIikrXCJrc2FuYS5qc1wiO1xuXHRqc29ucCh1cmwsYXBwbmFtZSxmdW5jdGlvbihkYXRhKXtcblx0XHRrc2FuYS5qcz1kYXRhO1xuXHRcdGtzYW5hLnJlYWR5PXRydWU7XG5cdH0pO1xufVxubW9kdWxlLmV4cG9ydHM9a3NhbmFnYXA7IiwidmFyIHN0YXJ0ZWQ9ZmFsc2U7XG52YXIgdGltZXI9bnVsbDtcbnZhciBidW5kbGVkYXRlPW51bGw7XG52YXIgZ2V0X2RhdGU9cmVxdWlyZShcIi4vaHRtbDVmc1wiKS5nZXRfZGF0ZTtcbnZhciBjaGVja0lmQnVuZGxlVXBkYXRlZD1mdW5jdGlvbigpIHtcblx0Z2V0X2RhdGUoXCJidW5kbGUuanNcIixmdW5jdGlvbihkYXRlKXtcblx0XHRpZiAoYnVuZGxlZGF0ZSAmJmJ1bmRsZWRhdGUhPWRhdGUpe1xuXHRcdFx0bG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0fVxuXHRcdGJ1bmRsZWRhdGU9ZGF0ZTtcblx0fSk7XG59XG52YXIgbGl2ZXJlbG9hZD1mdW5jdGlvbigpIHtcblx0aWYgKHN0YXJ0ZWQpIHJldHVybjtcblxuXHR0aW1lcjE9c2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcblx0XHRjaGVja0lmQnVuZGxlVXBkYXRlZCgpO1xuXHR9LDIwMDApO1xuXHRzdGFydGVkPXRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzPWxpdmVyZWxvYWQ7IiwiXG52YXIganNvbnA9ZnVuY3Rpb24odXJsLGRiaWQsY2FsbGJhY2ssY29udGV4dCkge1xuICB2YXIgc2NyaXB0PWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwianNvbnBcIik7XG4gIGlmIChzY3JpcHQpIHtcbiAgICBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuICB9XG4gIHdpbmRvdy5qc29ucF9oYW5kbGVyPWZ1bmN0aW9uKGRhdGEpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwicmVjZWl2ZSBmcm9tIGtzYW5hLmpzXCIsZGF0YSk7XG4gICAgaWYgKHR5cGVvZiBkYXRhPT1cIm9iamVjdFwiKSB7XG4gICAgICBpZiAodHlwZW9mIGRhdGEuZGJpZD09XCJ1bmRlZmluZWRcIikge1xuICAgICAgICBkYXRhLmRiaWQ9ZGJpZDtcbiAgICAgIH1cbiAgICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW2RhdGFdKTtcbiAgICB9ICBcbiAgfVxuXG4gIHdpbmRvdy5qc29ucF9lcnJvcl9oYW5kbGVyPWZ1bmN0aW9uKCkge1xuICAgIGNvbnNvbGUuZXJyb3IoXCJ1cmwgdW5yZWFjaGFibGVcIix1cmwpO1xuICAgIGNhbGxiYWNrLmFwcGx5KGNvbnRleHQsW251bGxdKTtcbiAgfVxuXG4gIHNjcmlwdD1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcbiAgc2NyaXB0LnNldEF0dHJpYnV0ZSgnaWQnLCBcImpzb25wXCIpO1xuICBzY3JpcHQuc2V0QXR0cmlidXRlKCdvbmVycm9yJywgXCJqc29ucF9lcnJvcl9oYW5kbGVyKClcIik7XG4gIHVybD11cmwrJz8nKyhuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XG4gIHNjcmlwdC5zZXRBdHRyaWJ1dGUoJ3NyYycsIHVybCk7XG4gIGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQoc2NyaXB0KTsgXG59XG52YXIgcnVudGltZV92ZXJzaW9uX29rPWZ1bmN0aW9uKG1pbnJ1bnRpbWUpIHtcbiAgaWYgKCFtaW5ydW50aW1lKSByZXR1cm4gdHJ1ZTsvL25vdCBtZW50aW9uZWQuXG4gIHZhciBtaW49cGFyc2VGbG9hdChtaW5ydW50aW1lKTtcbiAgdmFyIHJ1bnRpbWU9cGFyc2VGbG9hdCgga3NhbmFnYXAucnVudGltZV92ZXJzaW9uKCl8fFwiMS4wXCIpO1xuICBpZiAobWluPnJ1bnRpbWUpIHJldHVybiBmYWxzZTtcbiAgcmV0dXJuIHRydWU7XG59XG5cbnZhciBuZWVkVG9VcGRhdGU9ZnVuY3Rpb24oZnJvbWpzb24sdG9qc29uKSB7XG4gIHZhciBuZWVkVXBkYXRlcz1bXTtcbiAgZm9yICh2YXIgaT0wO2k8ZnJvbWpzb24ubGVuZ3RoO2krKykgeyBcbiAgICB2YXIgdG89dG9qc29uW2ldO1xuICAgIHZhciBmcm9tPWZyb21qc29uW2ldO1xuICAgIHZhciBuZXdmaWxlcz1bXSxuZXdmaWxlc2l6ZXM9W10scmVtb3ZlZD1bXTtcbiAgICBcbiAgICBpZiAoIXRvKSBjb250aW51ZTsgLy9jYW5ub3QgcmVhY2ggaG9zdFxuICAgIGlmICghcnVudGltZV92ZXJzaW9uX29rKHRvLm1pbnJ1bnRpbWUpKSB7XG4gICAgICBjb25zb2xlLndhcm4oXCJydW50aW1lIHRvbyBvbGQsIG5lZWQgXCIrdG8ubWlucnVudGltZSk7XG4gICAgICBjb250aW51ZTsgXG4gICAgfVxuICAgIGlmICghZnJvbS5maWxlZGF0ZXMpIHtcbiAgICAgIGNvbnNvbGUud2FybihcIm1pc3NpbmcgZmlsZWRhdGVzIGluIGtzYW5hLmpzIG9mIFwiK2Zyb20uZGJpZCk7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgZnJvbS5maWxlZGF0ZXMubWFwKGZ1bmN0aW9uKGYsaWR4KXtcbiAgICAgIHZhciBuZXdpZHg9dG8uZmlsZXMuaW5kZXhPZiggZnJvbS5maWxlc1tpZHhdKTtcbiAgICAgIGlmIChuZXdpZHg9PS0xKSB7XG4gICAgICAgIC8vZmlsZSByZW1vdmVkIGluIG5ldyB2ZXJzaW9uXG4gICAgICAgIHJlbW92ZWQucHVzaChmcm9tLmZpbGVzW2lkeF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGZyb21kYXRlPURhdGUucGFyc2UoZik7XG4gICAgICAgIHZhciB0b2RhdGU9RGF0ZS5wYXJzZSh0by5maWxlZGF0ZXNbbmV3aWR4XSk7XG4gICAgICAgIGlmIChmcm9tZGF0ZTx0b2RhdGUpIHtcbiAgICAgICAgICBuZXdmaWxlcy5wdXNoKCB0by5maWxlc1tuZXdpZHhdICk7XG4gICAgICAgICAgbmV3ZmlsZXNpemVzLnB1c2godG8uZmlsZXNpemVzW25ld2lkeF0pO1xuICAgICAgICB9ICAgICAgICBcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAobmV3ZmlsZXMubGVuZ3RoKSB7XG4gICAgICBmcm9tLm5ld2ZpbGVzPW5ld2ZpbGVzO1xuICAgICAgZnJvbS5uZXdmaWxlc2l6ZXM9bmV3ZmlsZXNpemVzO1xuICAgICAgZnJvbS5yZW1vdmVkPXJlbW92ZWQ7XG4gICAgICBuZWVkVXBkYXRlcy5wdXNoKGZyb20pO1xuICAgIH1cbiAgfVxuICByZXR1cm4gbmVlZFVwZGF0ZXM7XG59XG52YXIgZ2V0VXBkYXRhYmxlcz1mdW5jdGlvbihhcHBzLGNiLGNvbnRleHQpIHtcbiAgZ2V0UmVtb3RlSnNvbihhcHBzLGZ1bmN0aW9uKGpzb25zKXtcbiAgICB2YXIgaGFzVXBkYXRlcz1uZWVkVG9VcGRhdGUoYXBwcyxqc29ucyk7XG4gICAgY2IuYXBwbHkoY29udGV4dCxbaGFzVXBkYXRlc10pO1xuICB9LGNvbnRleHQpO1xufVxudmFyIGdldFJlbW90ZUpzb249ZnVuY3Rpb24oYXBwcyxjYixjb250ZXh0KSB7XG4gIHZhciB0YXNrcXVldWU9W10sb3V0cHV0PVtdO1xuICB2YXIgbWFrZWNiPWZ1bmN0aW9uKGFwcCl7XG4gICAgcmV0dXJuIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICBpZiAoIShkYXRhICYmIHR5cGVvZiBkYXRhID09J29iamVjdCcgJiYgZGF0YS5fX2VtcHR5KSkgb3V0cHV0LnB1c2goZGF0YSk7XG4gICAgICAgIGlmICghYXBwLmJhc2V1cmwpIHtcbiAgICAgICAgICB0YXNrcXVldWUuc2hpZnQoe19fZW1wdHk6dHJ1ZX0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHZhciB1cmw9YXBwLmJhc2V1cmwrXCIva3NhbmEuanNcIjsgICAgXG4gICAgICAgICAgY29uc29sZS5sb2codXJsKTtcbiAgICAgICAgICBqc29ucCggdXJsICxhcHAuZGJpZCx0YXNrcXVldWUuc2hpZnQoKSwgY29udGV4dCk7ICAgICAgICAgICBcbiAgICAgICAgfVxuICAgIH07XG4gIH07XG4gIGFwcHMuZm9yRWFjaChmdW5jdGlvbihhcHApe3Rhc2txdWV1ZS5wdXNoKG1ha2VjYihhcHApKX0pO1xuXG4gIHRhc2txdWV1ZS5wdXNoKGZ1bmN0aW9uKGRhdGEpe1xuICAgIG91dHB1dC5wdXNoKGRhdGEpO1xuICAgIGNiLmFwcGx5KGNvbnRleHQsW291dHB1dF0pO1xuICB9KTtcblxuICB0YXNrcXVldWUuc2hpZnQoKSh7X19lbXB0eTp0cnVlfSk7IC8vcnVuIHRoZSB0YXNrXG59XG52YXIgaHVtYW5GaWxlU2l6ZT1mdW5jdGlvbihieXRlcywgc2kpIHtcbiAgICB2YXIgdGhyZXNoID0gc2kgPyAxMDAwIDogMTAyNDtcbiAgICBpZihieXRlcyA8IHRocmVzaCkgcmV0dXJuIGJ5dGVzICsgJyBCJztcbiAgICB2YXIgdW5pdHMgPSBzaSA/IFsna0InLCdNQicsJ0dCJywnVEInLCdQQicsJ0VCJywnWkInLCdZQiddIDogWydLaUInLCdNaUInLCdHaUInLCdUaUInLCdQaUInLCdFaUInLCdaaUInLCdZaUInXTtcbiAgICB2YXIgdSA9IC0xO1xuICAgIGRvIHtcbiAgICAgICAgYnl0ZXMgLz0gdGhyZXNoO1xuICAgICAgICArK3U7XG4gICAgfSB3aGlsZShieXRlcyA+PSB0aHJlc2gpO1xuICAgIHJldHVybiBieXRlcy50b0ZpeGVkKDEpKycgJyt1bml0c1t1XTtcbn07XG5cbnZhciBzdGFydD1mdW5jdGlvbihrc2FuYWpzLGNiLGNvbnRleHQpe1xuICB2YXIgZmlsZXM9a3NhbmFqcy5uZXdmaWxlc3x8a3NhbmFqcy5maWxlcztcbiAgdmFyIGJhc2V1cmw9a3NhbmFqcy5iYXNldXJsfHwgXCJodHRwOi8vMTI3LjAuMC4xOjgwODAvXCIra3NhbmFqcy5kYmlkK1wiL1wiO1xuICB2YXIgc3RhcnRlZD1rc2FuYWdhcC5zdGFydERvd25sb2FkKGtzYW5hanMuZGJpZCxiYXNldXJsLGZpbGVzLmpvaW4oXCJcXHVmZmZmXCIpKTtcbiAgY2IuYXBwbHkoY29udGV4dCxbc3RhcnRlZF0pO1xufVxudmFyIHN0YXR1cz1mdW5jdGlvbigpe1xuICB2YXIgbmZpbGU9a3NhbmFnYXAuZG93bmxvYWRpbmdGaWxlKCk7XG4gIHZhciBkb3dubG9hZGVkQnl0ZT1rc2FuYWdhcC5kb3dubG9hZGVkQnl0ZSgpO1xuICB2YXIgZG9uZT1rc2FuYWdhcC5kb25lRG93bmxvYWQoKTtcbiAgcmV0dXJuIHtuZmlsZTpuZmlsZSxkb3dubG9hZGVkQnl0ZTpkb3dubG9hZGVkQnl0ZSwgZG9uZTpkb25lfTtcbn1cblxudmFyIGNhbmNlbD1mdW5jdGlvbigpe1xuICByZXR1cm4ga3NhbmFnYXAuY2FuY2VsRG93bmxvYWQoKTtcbn1cblxudmFyIGxpdmV1cGRhdGU9eyBodW1hbkZpbGVTaXplOiBodW1hbkZpbGVTaXplLCBcbiAgbmVlZFRvVXBkYXRlOiBuZWVkVG9VcGRhdGUgLCBqc29ucDpqc29ucCwgXG4gIGdldFVwZGF0YWJsZXM6Z2V0VXBkYXRhYmxlcyxcbiAgc3RhcnQ6c3RhcnQsXG4gIGNhbmNlbDpjYW5jZWwsXG4gIHN0YXR1czpzdGF0dXNcbiAgfTtcbm1vZHVsZS5leHBvcnRzPWxpdmV1cGRhdGU7IiwiZnVuY3Rpb24gbWtkaXJQIChwLCBtb2RlLCBmLCBtYWRlKSB7XG4gICAgIHZhciBwYXRoID0gbm9kZVJlcXVpcmUoJ3BhdGgnKTtcbiAgICAgdmFyIGZzID0gbm9kZVJlcXVpcmUoJ2ZzJyk7XG5cdFxuICAgIGlmICh0eXBlb2YgbW9kZSA9PT0gJ2Z1bmN0aW9uJyB8fCBtb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgZiA9IG1vZGU7XG4gICAgICAgIG1vZGUgPSAweDFGRiAmICh+cHJvY2Vzcy51bWFzaygpKTtcbiAgICB9XG4gICAgaWYgKCFtYWRlKSBtYWRlID0gbnVsbDtcblxuICAgIHZhciBjYiA9IGYgfHwgZnVuY3Rpb24gKCkge307XG4gICAgaWYgKHR5cGVvZiBtb2RlID09PSAnc3RyaW5nJykgbW9kZSA9IHBhcnNlSW50KG1vZGUsIDgpO1xuICAgIHAgPSBwYXRoLnJlc29sdmUocCk7XG5cbiAgICBmcy5ta2RpcihwLCBtb2RlLCBmdW5jdGlvbiAoZXIpIHtcbiAgICAgICAgaWYgKCFlcikge1xuICAgICAgICAgICAgbWFkZSA9IG1hZGUgfHwgcDtcbiAgICAgICAgICAgIHJldHVybiBjYihudWxsLCBtYWRlKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGVyLmNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgJ0VOT0VOVCc6XG4gICAgICAgICAgICAgICAgbWtkaXJQKHBhdGguZGlybmFtZShwKSwgbW9kZSwgZnVuY3Rpb24gKGVyLCBtYWRlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlcikgY2IoZXIsIG1hZGUpO1xuICAgICAgICAgICAgICAgICAgICBlbHNlIG1rZGlyUChwLCBtb2RlLCBjYiwgbWFkZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIEluIHRoZSBjYXNlIG9mIGFueSBvdGhlciBlcnJvciwganVzdCBzZWUgaWYgdGhlcmUncyBhIGRpclxuICAgICAgICAgICAgLy8gdGhlcmUgYWxyZWFkeS4gIElmIHNvLCB0aGVuIGhvb3JheSEgIElmIG5vdCwgdGhlbiBzb21ldGhpbmdcbiAgICAgICAgICAgIC8vIGlzIGJvcmtlZC5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgZnMuc3RhdChwLCBmdW5jdGlvbiAoZXIyLCBzdGF0KSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRoZSBzdGF0IGZhaWxzLCB0aGVuIHRoYXQncyBzdXBlciB3ZWlyZC5cbiAgICAgICAgICAgICAgICAgICAgLy8gbGV0IHRoZSBvcmlnaW5hbCBlcnJvciBiZSB0aGUgZmFpbHVyZSByZWFzb24uXG4gICAgICAgICAgICAgICAgICAgIGlmIChlcjIgfHwgIXN0YXQuaXNEaXJlY3RvcnkoKSkgY2IoZXIsIG1hZGUpXG4gICAgICAgICAgICAgICAgICAgIGVsc2UgY2IobnVsbCwgbWFkZSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxubWtkaXJQLnN5bmMgPSBmdW5jdGlvbiBzeW5jIChwLCBtb2RlLCBtYWRlKSB7XG4gICAgdmFyIHBhdGggPSBub2RlUmVxdWlyZSgncGF0aCcpO1xuICAgIHZhciBmcyA9IG5vZGVSZXF1aXJlKCdmcycpO1xuICAgIGlmIChtb2RlID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbW9kZSA9IDB4MUZGICYgKH5wcm9jZXNzLnVtYXNrKCkpO1xuICAgIH1cbiAgICBpZiAoIW1hZGUpIG1hZGUgPSBudWxsO1xuXG4gICAgaWYgKHR5cGVvZiBtb2RlID09PSAnc3RyaW5nJykgbW9kZSA9IHBhcnNlSW50KG1vZGUsIDgpO1xuICAgIHAgPSBwYXRoLnJlc29sdmUocCk7XG5cbiAgICB0cnkge1xuICAgICAgICBmcy5ta2RpclN5bmMocCwgbW9kZSk7XG4gICAgICAgIG1hZGUgPSBtYWRlIHx8IHA7XG4gICAgfVxuICAgIGNhdGNoIChlcnIwKSB7XG4gICAgICAgIHN3aXRjaCAoZXJyMC5jb2RlKSB7XG4gICAgICAgICAgICBjYXNlICdFTk9FTlQnIDpcbiAgICAgICAgICAgICAgICBtYWRlID0gc3luYyhwYXRoLmRpcm5hbWUocCksIG1vZGUsIG1hZGUpO1xuICAgICAgICAgICAgICAgIHN5bmMocCwgbW9kZSwgbWFkZSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgIC8vIEluIHRoZSBjYXNlIG9mIGFueSBvdGhlciBlcnJvciwganVzdCBzZWUgaWYgdGhlcmUncyBhIGRpclxuICAgICAgICAgICAgLy8gdGhlcmUgYWxyZWFkeS4gIElmIHNvLCB0aGVuIGhvb3JheSEgIElmIG5vdCwgdGhlbiBzb21ldGhpbmdcbiAgICAgICAgICAgIC8vIGlzIGJvcmtlZC5cbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdmFyIHN0YXQ7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdCA9IGZzLnN0YXRTeW5jKHApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaCAoZXJyMSkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBlcnIwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIXN0YXQuaXNEaXJlY3RvcnkoKSkgdGhyb3cgZXJyMDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBtYWRlO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBta2RpclAubWtkaXJwID0gbWtkaXJQLm1rZGlyUCA9IG1rZGlyUDtcbiJdfQ==
