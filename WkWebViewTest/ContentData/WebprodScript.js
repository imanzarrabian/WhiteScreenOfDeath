/*global ActiveXObject, AskiaScript, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia XmlLoader Objects							  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| XmlLoader object manage the Xml or Xsl process							  |
|	Working on:																  |
|		Internet Explorer 			   [Tested on 6 / 7]					  |
|		NetScape (since the version 7) [Tested on 7 / 8]					  |
|		Opera (since the version 8)	   [Tested on 8]						  |
|		FireFox						   [Tested on 1 / 2]					  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| {No depencies}															  |			
|-----------------------------------------------------------------------------|
|2006-11-29 |V 1.0.0														  |
|			|	+  Load the Xml document like a DOM object					  |
|			|	+  Load the Xsl document like a DOM object					  |
|			|	+  Transform the Xml with the Xsl							  |
|-----------------------------------------------------------------------------|
| Created 2006-11-29 | All changes are in the log above. | Updated 2006-11-29 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|Askia - XmlLoader - API Version 1.0.0			Copyright Askia © 1994-2006   |
\----------------------------------------------------------------------------*/

/* === 
	Enumerators
=== */
var eXmlState={
		NOT_SUPPORTED	: -1,		//Not supported by the browser
		NOT_INITIALIZED :  0,		//Not initialized
		OPEN			:  1,		//Opening. The method open() is successfully called 
		SENT	        :  2,		//Sent. The method send()is successfully called 
		TRANSFERING     :  3,		//Transefering. The data are transfering (not ready)
		READYSTATE      :  4		//The data are loaded
	};
	

/* ====
	XmlLoader object
=== */
//Constructor
function XmlLoader() {
		//XmlDocument object
		this._xmlDoc=null;
		
		//State of loader
		this.readyState=eXmlState.NOT_INITIALIZED;
		
		//Initialize the component
		if (!this._initXmlDoc()){
				this.readyState=eXmlState.NOT_SUPPORTED;
				return;
			}
			
		//Path of xml file
		this.xmlPath="";
		
		//Method get the files (asynch or not)
		this.asynch=false;
		
		//DOM Xml element
		this.documentElement=null;
	}

//Function to initialize the XmlDocument object
//Return true when there are a success otherwize return false
XmlLoader.prototype._initXmlDoc=function(){
	if (document.implementation && document.implementation.createDocument){
			this._xmlDoc = document.implementation.createDocument("", "", null);
			var _THIS=this;
			this._xmlDoc.onload = function(){
				_THIS._changeState(eXmlState.READYSTATE);
			};
			return true;
		}
	else if (window.ActiveXObject) {
			this._xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			var _THIS=this;
			this._xmlDoc.onreadystatechange = function () {
				_THIS._changeState(_THIS._xmlDoc.readyState);
			};
			return true;
 		}
	else {
		//alert('Your browser can\'t handle this script');
		return false;
	}
};
	
//Function for load Xml (or xsl) file using the path in arguments
XmlLoader.prototype.load=function(xmlPath){
	if (xmlPath)this.xmlPath=xmlPath;

	//Treat the error when the browser not support the xml
	//implementation
	if (this.readyState==eXmlState.NOT_SUPPORTED){
			this.onreadystatechange();
			return;
		}
			
	//Treat the error when the path of xml is empty
	if (this.xmlPath==''){
			//Turn the state to ready
			this._changeState(eXmlState.NOT_INITIALIZED);
			return;
		}

	//Load the document
	this._xmlDoc.load(this.xmlPath);
};


//Function to transform the Xml with the Xsl and send the output
//The oXsl arguments is the XmlLoader object which are loaded the xsl document
XmlLoader.prototype.transform=function(oXsl){
	if (window.XSLTProcessor){
			//Transform xml using xsl
			var xslt = new XSLTProcessor();
			xslt.reset();
			xslt.importStylesheet(oXsl._xmlDoc);				
			var oResult=xslt.transformToFragment(this._xmlDoc,document);				
				
			//Write result into an hidden temporary element 
			//and get the HTML of them.
			var tmpDivId="__tmp__div__xsl__";
			var tempDiv=document.createElement("DIV");
				tempDiv.id=tmpDivId;
				tempDiv.appendChild(oResult);
				tempDiv.style.display="none";
			document.body.appendChild(tempDiv);
			var sHTML=document.getElementById(tmpDivId).innerHTML;
			document.body.removeChild(document.getElementById(tmpDivId));				
				
			return sHTML;
		}
	else if (window.ActiveXObject) {
			return this._xmlDoc.transformNode(oXsl._xmlDoc);
 		}
	else {
		return '';
	}	
};

//Private method to change the state of loader and 
//raise the appropriate event 
XmlLoader.prototype._changeState=function(state){
	//Set the actual state
	this.readyState=state;
		
	//If the xml document loaded then get the documentElement
	if(this.readyState==eXmlState.READYSTATE){	
			this.documentElement=this._xmlDoc.documentElement;
		}
		
	//Raise the event (Implemente by external function)
	this.onreadystatechange();
		
	//At the end of onreadystatechange() treatment,
	//turn the state to initial value
	this.readyState=eXmlState.NOT_INITIALIZED;
};

//Public shared methods
//This method return the attributes of XmlNode
XmlLoader.getAttributes=function(oXmlNode){
	var xmlAttributes={};
	for (var i=0;i<oXmlNode.attributes.length;i++){
			xmlAttributes[oXmlNode.attributes[i].nodeName]=oXmlNode.attributes[i].nodeValue;
		}			
	return xmlAttributes;
};
//This method an array of childNode which using the tagName in parameter
XmlLoader.getElementsByTagName=function(oXmlRoot,name){
	var arrElements=[];
	for (var i=0;i<oXmlRoot.childNodes.length;i++){
			if (oXmlRoot.childNodes[i].tagName==name){
					arrElements[arrElements.length]=oXmlRoot.childNodes[i];
				}
		}
	return arrElements;
};

	
//Public Events
//Called when the readyState has changed
XmlLoader.prototype.onreadystatechange=function(){/* Implemente event here */};
/*global ActiveXObject, AskiaScript, eXmlState, FOLDER_PLUGINS, FOLDER_PLUGINS, FILENAME_SETTINGS_XML, isNS6, UNDEFINED, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia PlugIns Objects							  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Plug the new script into the AskiaScript FrameWork						  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| Dependencies:																  |
|	+ AskiaScript.js														  |
|	+ XmlLoader.js															  |
|-----------------------------------------------------------------------------|
| 2006-11-29 |V 1.0.0														  |
|			 |+ First version												  |
|			 |+ Load the plug-ins											  |
|-----------------------------------------------------------------------------|
| 2010-04-15 |V 1.0.4														  |
|			 |+ Load the plugin in the AskiaScript._onPageLoad method		  |
|-----------------------------------------------------------------------------|
| Created 2006-11-29 | All changes are in the log above. | Updated 2010-04-15 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|Askia - PlugIns - API Version 1.0.4			Copyright Askia © 1994-2010   |
\----------------------------------------------------------------------------*/

/* ===
	Enumerator : list of names, attributes 
	use in the XML files
=== */
var ePlugInXml={
			NODE_ROOT				: 'AskiaScript',
			NODE_PLUGIN_ROOT		: 'PlugIns',
			NODE_PLUGIN				: 'PlugIn',
			NODE_FILE_ROOT			: 'files',
			NODE_FILE				: 'file',
			ATT_NAME				: 'name',
			ATT_TYPE				: 'type',
			ATT_IMPORT_MODE			: 'importMode',
			ATT_RELATIVE_INSTALL_PATH : 'relativeInsPath'
	};
	
/* ===
	Enumerator type of file
=== */
var ePlugInFileType={
		JAVASCRIPT					: 'javascript',
		CSS							: 'css'
	};

/* ===
	Mode of importation of plug-in
=== */
var ePlugInImportMode={
		MANUAL					: 0,
		AUTO					: 1
	};

/* ===
	PlugInHandler Object
=== */
//The PlugInHandler is use to load the list
//of plug-ins using the xml files
var PlugInHandler={
		//Collections of PlugIn object
		all					: {},
		childNodes			: [],
		//Add the PlugIn without duplicate
		add					: function(oPlugIn){
				if (this.all[oPlugIn.id])return this.all[oPlugIn.id];
				this.all[oPlugIn.id]=oPlugIn;
				this.childNodes[this.childNodes.length]=this.all[oPlugIn.id];
				return this.all[oPlugIn.id];
			},
		//The xml loader object
		_xmlLoader			: null,
		//Indicates if the current object is ready to load the plug-ins
		isReady				: false,
		//Load the xml file, parse it, and load the PlugIns
		load				: function(){
				try {
						this._xmlLoader=new XmlLoader();
					}
				catch(ex){
						//Retry again in few times
						setTimeout("PlugInHandler.load();",25);
						return;
					}
				if (!this._xmlLoader)return;
				if (this._xmlLoader.readyState==eXmlState.NOT_SUPPORTED)return;
				this._xmlLoader.onreadystatechange=function(){
						if (PlugInHandler._xmlLoader.readyState==eXmlState.READYSTATE){
								PlugInHandler._parseXml();
								PlugInHandler._loadPlugInStack();
							}
					};
				this._xmlLoader.load(AskiaScript.pathOfScripts + FILENAME_SETTINGS_XML);
			},
		//Load the plug-in into the stack
		_loadPlugInStack	: function(){
				for (var i=0;i<AskiaScript._tmpPlugInStack.length;i++){
						if (!this.all[AskiaScript._tmpPlugInStack[i]])continue;
						this.all[AskiaScript._tmpPlugInStack[i]].load();
					}
				
				//Set the status of object
				this.isReady=true;				
			},
		//Parse the xml of informations and load the additionnal javascript file
		_parseXml			: function(){
				if(!this._xmlLoader.documentElement)return;
				var xmlDoc=this._xmlLoader.documentElement;
				if (!xmlDoc.tagName)return;
				if (xmlDoc.tagName!=ePlugInXml.NODE_ROOT)return;
				
				//At this level we can says that the xml is loaded 
				//and it content an available root node
				//We can parse the sub-nodes and search the PlugIn elements
				/*
					//We don't need to check the version because, 
					//for the moment, we manage only one version of xml(1.0.0)
					var att=XmlLoader.getAttributes(xmlDoc);
					//att["version"]
				*/
				var xmlPlugInRoot=XmlLoader.getElementsByTagName(xmlDoc,ePlugInXml.NODE_PLUGIN_ROOT);
				if (xmlPlugInRoot.length<=0)return; //There is not the PlugIns root into the xml document
				//Now we can parse all AddOn Nodes
				for (var i=0;i<xmlPlugInRoot[0].childNodes.length;i++){
						if (xmlPlugInRoot[0].childNodes[i].tagName!=ePlugInXml.NODE_PLUGIN)continue;
						//Add the PlugIn into the collection
						this.add(new PlugIn(xmlPlugInRoot[0].childNodes[i]));
					}
			}
	};

/* ===
	PlugIn Object
=== */
//Constructor
function PlugIn(oXmlNode){
		//Read the attributes of node to manage some properties
		var plugInAttributes=XmlLoader.getAttributes(oXmlNode);
		this.id=plugInAttributes[ePlugInXml.ATT_NAME];
		
		//Don't add a duplicate fit
		if (PlugInHandler.all[this.id])return;
		
		this.importMode=plugInAttributes[ePlugInXml.ATT_IMPORT_MODE];
		this.attributes=plugInAttributes;
		this._xmlNode=oXmlNode;
		
		//Collection of plugInFiles	
		this.all={};
		this.childNodes=[];
		
		//Indicates if the plug-in is already loaded
		this._isLoaded=false;
		
		//Now parse the sub-node to load the collection of files
		var xmlFilesRoot=XmlLoader.getElementsByTagName(oXmlNode,ePlugInXml.NODE_FILE_ROOT);
		if (xmlFilesRoot.length<=0)return;
		for (var i=0;i<xmlFilesRoot[0].childNodes.length;i++){
				var xmlFile=xmlFilesRoot[0].childNodes[i];
				if (!xmlFile)continue;
				if (!xmlFile.tagName)continue;
				if (xmlFile.tagName!=ePlugInXml.NODE_FILE)continue;
				var att=XmlLoader.getAttributes(xmlFile);
				this.add(new PlugInFile(att));
			}
		
		//Auto-Import the plug-in
		if (this.importMode==ePlugInImportMode.AUTO)this.load();
	}

//Add the PlugInFile into the collection 
//and load it if it should be always loaded
PlugIn.prototype.add=function(oPlugInFile){
	if (this.all[oPlugInFile.id])return this.all[oPlugInFile.id];
	this.all[oPlugInFile.id]=oPlugInFile;
	this.childNodes[this.childNodes.length]=this.all[oPlugInFile.id];
	return this.all[oPlugInFile.id];
};

//Load the files of plug-in
PlugIn.prototype.load=function(){
	if (this._isLoaded)return;
	for (var i=0;i<this.childNodes.length;i++){
			this.childNodes[i].load();
		}
	this._isLoaded=true;
};

/* ===
	PlugInFile Object
=== */
//Constructor
function PlugInFile(oXmlAttributes){
	this.id=oXmlAttributes[ePlugInXml.ATT_NAME];
	this.name=this.id;
	this.type=oXmlAttributes[ePlugInXml.ATT_TYPE];
	this.relativeInsPath=oXmlAttributes[ePlugInXml.ATT_RELATIVE_INSTALL_PATH] || "";
}
//Load the file according to his type
PlugInFile.prototype.load=function(){
	switch(this.type){
		case ePlugInFileType.JAVASCRIPT:
				this._loadAsJavaScript();
				break;
		case ePlugInFileType.CSS:
				this._loadAsCss();
				break;
	}
};

//Add the DOMElement in the head section of document
PlugInFile.prototype._addInHeadSection=function(oDOMElement){
	//Search the head section and add the script element into it
	var head = document.getElementsByTagName("head")[0];
	head.appendChild(oDOMElement);		
	if (isNS6){
			alert("TODO::Find another thing to load the script in the Netscape 6 ...");
		}				
};
//Load the file as javascript
PlugInFile.prototype._loadAsJavaScript=function(){
	var script = document.createElement('script');
		script.type = 'text/javascript';
		script.src = AskiaScript.pathOfScripts + FOLDER_PLUGINS + AskiaScript.pathSeparator + this.relativeInsPath  + this.name;		
	this._addInHeadSection(script);
};
//Load the file as css
PlugInFile.prototype._loadAsCss=function(){
	//Not available for the moment
	var url=AskiaScript.pathOfScripts + FOLDER_PLUGINS + AskiaScript.pathSeparator + this.relativeInsPath  + this.name;
	//Double the backslash
	var tmpBackSlash="__tmp__backslash__";
		url=replace(url,'\\',tmpBackSlash);
		url=replace(url,tmpBackSlash,'\\\\');
			
	//Import the style
	var st=document.styleSheets[0];
	if (typeof(st.addImport)!=UNDEFINED){
			st.addImport(url);
		}
	else {
		st.insertRule("@import url(" + url + ");", st.cssRules.length);
		if (isNS6){
				alert("TODO::Find another method to load the css in the Netscape 6 ...");
			}				
	}
};


/*! jQuery v1.10.2 | (c) 2005, 2013 jQuery Foundation, Inc. | jquery.org/license
*/
(function(e,t){var n,r,i=typeof t,o=e.location,a=e.document,s=a.documentElement,l=e.jQuery,u=e.$,c={},p=[],f="1.10.2",d=p.concat,h=p.push,g=p.slice,m=p.indexOf,y=c.toString,v=c.hasOwnProperty,b=f.trim,x=function(e,t){return new x.fn.init(e,t,r)},w=/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,T=/\S+/g,C=/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,N=/^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,k=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,E=/^[\],:{}\s]*$/,S=/(?:^|:|,)(?:\s*\[)+/g,A=/\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g,j=/"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g,D=/^-ms-/,L=/-([\da-z])/gi,H=function(e,t){return t.toUpperCase()},q=function(e){(a.addEventListener||"load"===e.type||"complete"===a.readyState)&&(_(),x.ready())},_=function(){a.addEventListener?(a.removeEventListener("DOMContentLoaded",q,!1),e.removeEventListener("load",q,!1)):(a.detachEvent("onreadystatechange",q),e.detachEvent("onload",q))};x.fn=x.prototype={jquery:f,constructor:x,init:function(e,n,r){var i,o;if(!e)return this;if("string"==typeof e){if(i="<"===e.charAt(0)&&">"===e.charAt(e.length-1)&&e.length>=3?[null,e,null]:N.exec(e),!i||!i[1]&&n)return!n||n.jquery?(n||r).find(e):this.constructor(n).find(e);if(i[1]){if(n=n instanceof x?n[0]:n,x.merge(this,x.parseHTML(i[1],n&&n.nodeType?n.ownerDocument||n:a,!0)),k.test(i[1])&&x.isPlainObject(n))for(i in n)x.isFunction(this[i])?this[i](n[i]):this.attr(i,n[i]);return this}if(o=a.getElementById(i[2]),o&&o.parentNode){if(o.id!==i[2])return r.find(e);this.length=1,this[0]=o}return this.context=a,this.selector=e,this}return e.nodeType?(this.context=this[0]=e,this.length=1,this):x.isFunction(e)?r.ready(e):(e.selector!==t&&(this.selector=e.selector,this.context=e.context),x.makeArray(e,this))},selector:"",length:0,toArray:function(){return g.call(this)},get:function(e){return null==e?this.toArray():0>e?this[this.length+e]:this[e]},pushStack:function(e){var t=x.merge(this.constructor(),e);return t.prevObject=this,t.context=this.context,t},each:function(e,t){return x.each(this,e,t)},ready:function(e){return x.ready.promise().done(e),this},slice:function(){return this.pushStack(g.apply(this,arguments))},first:function(){return this.eq(0)},last:function(){return this.eq(-1)},eq:function(e){var t=this.length,n=+e+(0>e?t:0);return this.pushStack(n>=0&&t>n?[this[n]]:[])},map:function(e){return this.pushStack(x.map(this,function(t,n){return e.call(t,n,t)}))},end:function(){return this.prevObject||this.constructor(null)},push:h,sort:[].sort,splice:[].splice},x.fn.init.prototype=x.fn,x.extend=x.fn.extend=function(){var e,n,r,i,o,a,s=arguments[0]||{},l=1,u=arguments.length,c=!1;for("boolean"==typeof s&&(c=s,s=arguments[1]||{},l=2),"object"==typeof s||x.isFunction(s)||(s={}),u===l&&(s=this,--l);u>l;l++)if(null!=(o=arguments[l]))for(i in o)e=s[i],r=o[i],s!==r&&(c&&r&&(x.isPlainObject(r)||(n=x.isArray(r)))?(n?(n=!1,a=e&&x.isArray(e)?e:[]):a=e&&x.isPlainObject(e)?e:{},s[i]=x.extend(c,a,r)):r!==t&&(s[i]=r));return s},x.extend({expando:"jQuery"+(f+Math.random()).replace(/\D/g,""),noConflict:function(t){return e.$===x&&(e.$=u),t&&e.jQuery===x&&(e.jQuery=l),x},isReady:!1,readyWait:1,holdReady:function(e){e?x.readyWait++:x.ready(!0)},ready:function(e){if(e===!0?!--x.readyWait:!x.isReady){if(!a.body)return setTimeout(x.ready);x.isReady=!0,e!==!0&&--x.readyWait>0||(n.resolveWith(a,[x]),x.fn.trigger&&x(a).trigger("ready").off("ready"))}},isFunction:function(e){return"function"===x.type(e)},isArray:Array.isArray||function(e){return"array"===x.type(e)},isWindow:function(e){return null!=e&&e==e.window},isNumeric:function(e){return!isNaN(parseFloat(e))&&isFinite(e)},type:function(e){return null==e?e+"":"object"==typeof e||"function"==typeof e?c[y.call(e)]||"object":typeof e},isPlainObject:function(e){var n;if(!e||"object"!==x.type(e)||e.nodeType||x.isWindow(e))return!1;try{if(e.constructor&&!v.call(e,"constructor")&&!v.call(e.constructor.prototype,"isPrototypeOf"))return!1}catch(r){return!1}if(x.support.ownLast)for(n in e)return v.call(e,n);for(n in e);return n===t||v.call(e,n)},isEmptyObject:function(e){var t;for(t in e)return!1;return!0},error:function(e){throw Error(e)},parseHTML:function(e,t,n){if(!e||"string"!=typeof e)return null;"boolean"==typeof t&&(n=t,t=!1),t=t||a;var r=k.exec(e),i=!n&&[];return r?[t.createElement(r[1])]:(r=x.buildFragment([e],t,i),i&&x(i).remove(),x.merge([],r.childNodes))},parseJSON:function(n){return e.JSON&&e.JSON.parse?e.JSON.parse(n):null===n?n:"string"==typeof n&&(n=x.trim(n),n&&E.test(n.replace(A,"@").replace(j,"]").replace(S,"")))?Function("return "+n)():(x.error("Invalid JSON: "+n),t)},parseXML:function(n){var r,i;if(!n||"string"!=typeof n)return null;try{e.DOMParser?(i=new DOMParser,r=i.parseFromString(n,"text/xml")):(r=new ActiveXObject("Microsoft.XMLDOM"),r.async="false",r.loadXML(n))}catch(o){r=t}return r&&r.documentElement&&!r.getElementsByTagName("parsererror").length||x.error("Invalid XML: "+n),r},noop:function(){},globalEval:function(t){t&&x.trim(t)&&(e.execScript||function(t){e.eval.call(e,t)})(t)},camelCase:function(e){return e.replace(D,"ms-").replace(L,H)},nodeName:function(e,t){return e.nodeName&&e.nodeName.toLowerCase()===t.toLowerCase()},each:function(e,t,n){var r,i=0,o=e.length,a=M(e);if(n){if(a){for(;o>i;i++)if(r=t.apply(e[i],n),r===!1)break}else for(i in e)if(r=t.apply(e[i],n),r===!1)break}else if(a){for(;o>i;i++)if(r=t.call(e[i],i,e[i]),r===!1)break}else for(i in e)if(r=t.call(e[i],i,e[i]),r===!1)break;return e},trim:b&&!b.call("\ufeff\u00a0")?function(e){return null==e?"":b.call(e)}:function(e){return null==e?"":(e+"").replace(C,"")},makeArray:function(e,t){var n=t||[];return null!=e&&(M(Object(e))?x.merge(n,"string"==typeof e?[e]:e):h.call(n,e)),n},inArray:function(e,t,n){var r;if(t){if(m)return m.call(t,e,n);for(r=t.length,n=n?0>n?Math.max(0,r+n):n:0;r>n;n++)if(n in t&&t[n]===e)return n}return-1},merge:function(e,n){var r=n.length,i=e.length,o=0;if("number"==typeof r)for(;r>o;o++)e[i++]=n[o];else while(n[o]!==t)e[i++]=n[o++];return e.length=i,e},grep:function(e,t,n){var r,i=[],o=0,a=e.length;for(n=!!n;a>o;o++)r=!!t(e[o],o),n!==r&&i.push(e[o]);return i},map:function(e,t,n){var r,i=0,o=e.length,a=M(e),s=[];if(a)for(;o>i;i++)r=t(e[i],i,n),null!=r&&(s[s.length]=r);else for(i in e)r=t(e[i],i,n),null!=r&&(s[s.length]=r);return d.apply([],s)},guid:1,proxy:function(e,n){var r,i,o;return"string"==typeof n&&(o=e[n],n=e,e=o),x.isFunction(e)?(r=g.call(arguments,2),i=function(){return e.apply(n||this,r.concat(g.call(arguments)))},i.guid=e.guid=e.guid||x.guid++,i):t},access:function(e,n,r,i,o,a,s){var l=0,u=e.length,c=null==r;if("object"===x.type(r)){o=!0;for(l in r)x.access(e,n,l,r[l],!0,a,s)}else if(i!==t&&(o=!0,x.isFunction(i)||(s=!0),c&&(s?(n.call(e,i),n=null):(c=n,n=function(e,t,n){return c.call(x(e),n)})),n))for(;u>l;l++)n(e[l],r,s?i:i.call(e[l],l,n(e[l],r)));return o?e:c?n.call(e):u?n(e[0],r):a},now:function(){return(new Date).getTime()},swap:function(e,t,n,r){var i,o,a={};for(o in t)a[o]=e.style[o],e.style[o]=t[o];i=n.apply(e,r||[]);for(o in t)e.style[o]=a[o];return i}}),x.ready.promise=function(t){if(!n)if(n=x.Deferred(),"complete"===a.readyState)setTimeout(x.ready);else if(a.addEventListener)a.addEventListener("DOMContentLoaded",q,!1),e.addEventListener("load",q,!1);else{a.attachEvent("onreadystatechange",q),e.attachEvent("onload",q);var r=!1;try{r=null==e.frameElement&&a.documentElement}catch(i){}r&&r.doScroll&&function o(){if(!x.isReady){try{r.doScroll("left")}catch(e){return setTimeout(o,50)}_(),x.ready()}}()}return n.promise(t)},x.each("Boolean Number String Function Array Date RegExp Object Error".split(" "),function(e,t){c["[object "+t+"]"]=t.toLowerCase()});function M(e){var t=e.length,n=x.type(e);return x.isWindow(e)?!1:1===e.nodeType&&t?!0:"array"===n||"function"!==n&&(0===t||"number"==typeof t&&t>0&&t-1 in e)}r=x(a),function(e,t){var n,r,i,o,a,s,l,u,c,p,f,d,h,g,m,y,v,b="sizzle"+-new Date,w=e.document,T=0,C=0,N=st(),k=st(),E=st(),S=!1,A=function(e,t){return e===t?(S=!0,0):0},j=typeof t,D=1<<31,L={}.hasOwnProperty,H=[],q=H.pop,_=H.push,M=H.push,O=H.slice,F=H.indexOf||function(e){var t=0,n=this.length;for(;n>t;t++)if(this[t]===e)return t;return-1},B="checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",P="[\\x20\\t\\r\\n\\f]",R="(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",W=R.replace("w","w#"),$="\\["+P+"*("+R+")"+P+"*(?:([*^$|!~]?=)"+P+"*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|("+W+")|)|)"+P+"*\\]",I=":("+R+")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|"+$.replace(3,8)+")*)|.*)\\)|)",z=RegExp("^"+P+"+|((?:^|[^\\\\])(?:\\\\.)*)"+P+"+$","g"),X=RegExp("^"+P+"*,"+P+"*"),U=RegExp("^"+P+"*([>+~]|"+P+")"+P+"*"),V=RegExp(P+"*[+~]"),Y=RegExp("="+P+"*([^\\]'\"]*)"+P+"*\\]","g"),J=RegExp(I),G=RegExp("^"+W+"$"),Q={ID:RegExp("^#("+R+")"),CLASS:RegExp("^\\.("+R+")"),TAG:RegExp("^("+R.replace("w","w*")+")"),ATTR:RegExp("^"+$),PSEUDO:RegExp("^"+I),CHILD:RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\("+P+"*(even|odd|(([+-]|)(\\d*)n|)"+P+"*(?:([+-]|)"+P+"*(\\d+)|))"+P+"*\\)|)","i"),bool:RegExp("^(?:"+B+")$","i"),needsContext:RegExp("^"+P+"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\("+P+"*((?:-\\d)?\\d*)"+P+"*\\)|)(?=[^-]|$)","i")},K=/^[^{]+\{\s*\[native \w/,Z=/^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,et=/^(?:input|select|textarea|button)$/i,tt=/^h\d$/i,nt=/'|\\/g,rt=RegExp("\\\\([\\da-f]{1,6}"+P+"?|("+P+")|.)","ig"),it=function(e,t,n){var r="0x"+t-65536;return r!==r||n?t:0>r?String.fromCharCode(r+65536):String.fromCharCode(55296|r>>10,56320|1023&r)};try{M.apply(H=O.call(w.childNodes),w.childNodes),H[w.childNodes.length].nodeType}catch(ot){M={apply:H.length?function(e,t){_.apply(e,O.call(t))}:function(e,t){var n=e.length,r=0;while(e[n++]=t[r++]);e.length=n-1}}}function at(e,t,n,i){var o,a,s,l,u,c,d,m,y,x;if((t?t.ownerDocument||t:w)!==f&&p(t),t=t||f,n=n||[],!e||"string"!=typeof e)return n;if(1!==(l=t.nodeType)&&9!==l)return[];if(h&&!i){if(o=Z.exec(e))if(s=o[1]){if(9===l){if(a=t.getElementById(s),!a||!a.parentNode)return n;if(a.id===s)return n.push(a),n}else if(t.ownerDocument&&(a=t.ownerDocument.getElementById(s))&&v(t,a)&&a.id===s)return n.push(a),n}else{if(o[2])return M.apply(n,t.getElementsByTagName(e)),n;if((s=o[3])&&r.getElementsByClassName&&t.getElementsByClassName)return M.apply(n,t.getElementsByClassName(s)),n}if(r.qsa&&(!g||!g.test(e))){if(m=d=b,y=t,x=9===l&&e,1===l&&"object"!==t.nodeName.toLowerCase()){c=mt(e),(d=t.getAttribute("id"))?m=d.replace(nt,"\\$&"):t.setAttribute("id",m),m="[id='"+m+"'] ",u=c.length;while(u--)c[u]=m+yt(c[u]);y=V.test(e)&&t.parentNode||t,x=c.join(",")}if(x)try{return M.apply(n,y.querySelectorAll(x)),n}catch(T){}finally{d||t.removeAttribute("id")}}}return kt(e.replace(z,"$1"),t,n,i)}function st(){var e=[];function t(n,r){return e.push(n+=" ")>o.cacheLength&&delete t[e.shift()],t[n]=r}return t}function lt(e){return e[b]=!0,e}function ut(e){var t=f.createElement("div");try{return!!e(t)}catch(n){return!1}finally{t.parentNode&&t.parentNode.removeChild(t),t=null}}function ct(e,t){var n=e.split("|"),r=e.length;while(r--)o.attrHandle[n[r]]=t}function pt(e,t){var n=t&&e,r=n&&1===e.nodeType&&1===t.nodeType&&(~t.sourceIndex||D)-(~e.sourceIndex||D);if(r)return r;if(n)while(n=n.nextSibling)if(n===t)return-1;return e?1:-1}function ft(e){return function(t){var n=t.nodeName.toLowerCase();return"input"===n&&t.type===e}}function dt(e){return function(t){var n=t.nodeName.toLowerCase();return("input"===n||"button"===n)&&t.type===e}}function ht(e){return lt(function(t){return t=+t,lt(function(n,r){var i,o=e([],n.length,t),a=o.length;while(a--)n[i=o[a]]&&(n[i]=!(r[i]=n[i]))})})}s=at.isXML=function(e){var t=e&&(e.ownerDocument||e).documentElement;return t?"HTML"!==t.nodeName:!1},r=at.support={},p=at.setDocument=function(e){var n=e?e.ownerDocument||e:w,i=n.defaultView;return n!==f&&9===n.nodeType&&n.documentElement?(f=n,d=n.documentElement,h=!s(n),i&&i.attachEvent&&i!==i.top&&i.attachEvent("onbeforeunload",function(){p()}),r.attributes=ut(function(e){return e.className="i",!e.getAttribute("className")}),r.getElementsByTagName=ut(function(e){return e.appendChild(n.createComment("")),!e.getElementsByTagName("*").length}),r.getElementsByClassName=ut(function(e){return e.innerHTML="<div class='a'></div><div class='a i'></div>",e.firstChild.className="i",2===e.getElementsByClassName("i").length}),r.getById=ut(function(e){return d.appendChild(e).id=b,!n.getElementsByName||!n.getElementsByName(b).length}),r.getById?(o.find.ID=function(e,t){if(typeof t.getElementById!==j&&h){var n=t.getElementById(e);return n&&n.parentNode?[n]:[]}},o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){return e.getAttribute("id")===t}}):(delete o.find.ID,o.filter.ID=function(e){var t=e.replace(rt,it);return function(e){var n=typeof e.getAttributeNode!==j&&e.getAttributeNode("id");return n&&n.value===t}}),o.find.TAG=r.getElementsByTagName?function(e,n){return typeof n.getElementsByTagName!==j?n.getElementsByTagName(e):t}:function(e,t){var n,r=[],i=0,o=t.getElementsByTagName(e);if("*"===e){while(n=o[i++])1===n.nodeType&&r.push(n);return r}return o},o.find.CLASS=r.getElementsByClassName&&function(e,n){return typeof n.getElementsByClassName!==j&&h?n.getElementsByClassName(e):t},m=[],g=[],(r.qsa=K.test(n.querySelectorAll))&&(ut(function(e){e.innerHTML="<select><option selected=''></option></select>",e.querySelectorAll("[selected]").length||g.push("\\["+P+"*(?:value|"+B+")"),e.querySelectorAll(":checked").length||g.push(":checked")}),ut(function(e){var t=n.createElement("input");t.setAttribute("type","hidden"),e.appendChild(t).setAttribute("t",""),e.querySelectorAll("[t^='']").length&&g.push("[*^$]="+P+"*(?:''|\"\")"),e.querySelectorAll(":enabled").length||g.push(":enabled",":disabled"),e.querySelectorAll("*,:x"),g.push(",.*:")})),(r.matchesSelector=K.test(y=d.webkitMatchesSelector||d.mozMatchesSelector||d.oMatchesSelector||d.msMatchesSelector))&&ut(function(e){r.disconnectedMatch=y.call(e,"div"),y.call(e,"[s!='']:x"),m.push("!=",I)}),g=g.length&&RegExp(g.join("|")),m=m.length&&RegExp(m.join("|")),v=K.test(d.contains)||d.compareDocumentPosition?function(e,t){var n=9===e.nodeType?e.documentElement:e,r=t&&t.parentNode;return e===r||!(!r||1!==r.nodeType||!(n.contains?n.contains(r):e.compareDocumentPosition&&16&e.compareDocumentPosition(r)))}:function(e,t){if(t)while(t=t.parentNode)if(t===e)return!0;return!1},A=d.compareDocumentPosition?function(e,t){if(e===t)return S=!0,0;var i=t.compareDocumentPosition&&e.compareDocumentPosition&&e.compareDocumentPosition(t);return i?1&i||!r.sortDetached&&t.compareDocumentPosition(e)===i?e===n||v(w,e)?-1:t===n||v(w,t)?1:c?F.call(c,e)-F.call(c,t):0:4&i?-1:1:e.compareDocumentPosition?-1:1}:function(e,t){var r,i=0,o=e.parentNode,a=t.parentNode,s=[e],l=[t];if(e===t)return S=!0,0;if(!o||!a)return e===n?-1:t===n?1:o?-1:a?1:c?F.call(c,e)-F.call(c,t):0;if(o===a)return pt(e,t);r=e;while(r=r.parentNode)s.unshift(r);r=t;while(r=r.parentNode)l.unshift(r);while(s[i]===l[i])i++;return i?pt(s[i],l[i]):s[i]===w?-1:l[i]===w?1:0},n):f},at.matches=function(e,t){return at(e,null,null,t)},at.matchesSelector=function(e,t){if((e.ownerDocument||e)!==f&&p(e),t=t.replace(Y,"='$1']"),!(!r.matchesSelector||!h||m&&m.test(t)||g&&g.test(t)))try{var n=y.call(e,t);if(n||r.disconnectedMatch||e.document&&11!==e.document.nodeType)return n}catch(i){}return at(t,f,null,[e]).length>0},at.contains=function(e,t){return(e.ownerDocument||e)!==f&&p(e),v(e,t)},at.attr=function(e,n){(e.ownerDocument||e)!==f&&p(e);var i=o.attrHandle[n.toLowerCase()],a=i&&L.call(o.attrHandle,n.toLowerCase())?i(e,n,!h):t;return a===t?r.attributes||!h?e.getAttribute(n):(a=e.getAttributeNode(n))&&a.specified?a.value:null:a},at.error=function(e){throw Error("Syntax error, unrecognized expression: "+e)},at.uniqueSort=function(e){var t,n=[],i=0,o=0;if(S=!r.detectDuplicates,c=!r.sortStable&&e.slice(0),e.sort(A),S){while(t=e[o++])t===e[o]&&(i=n.push(o));while(i--)e.splice(n[i],1)}return e},a=at.getText=function(e){var t,n="",r=0,i=e.nodeType;if(i){if(1===i||9===i||11===i){if("string"==typeof e.textContent)return e.textContent;for(e=e.firstChild;e;e=e.nextSibling)n+=a(e)}else if(3===i||4===i)return e.nodeValue}else for(;t=e[r];r++)n+=a(t);return n},o=at.selectors={cacheLength:50,createPseudo:lt,match:Q,attrHandle:{},find:{},relative:{">":{dir:"parentNode",first:!0}," ":{dir:"parentNode"},"+":{dir:"previousSibling",first:!0},"~":{dir:"previousSibling"}},preFilter:{ATTR:function(e){return e[1]=e[1].replace(rt,it),e[3]=(e[4]||e[5]||"").replace(rt,it),"~="===e[2]&&(e[3]=" "+e[3]+" "),e.slice(0,4)},CHILD:function(e){return e[1]=e[1].toLowerCase(),"nth"===e[1].slice(0,3)?(e[3]||at.error(e[0]),e[4]=+(e[4]?e[5]+(e[6]||1):2*("even"===e[3]||"odd"===e[3])),e[5]=+(e[7]+e[8]||"odd"===e[3])):e[3]&&at.error(e[0]),e},PSEUDO:function(e){var n,r=!e[5]&&e[2];return Q.CHILD.test(e[0])?null:(e[3]&&e[4]!==t?e[2]=e[4]:r&&J.test(r)&&(n=mt(r,!0))&&(n=r.indexOf(")",r.length-n)-r.length)&&(e[0]=e[0].slice(0,n),e[2]=r.slice(0,n)),e.slice(0,3))}},filter:{TAG:function(e){var t=e.replace(rt,it).toLowerCase();return"*"===e?function(){return!0}:function(e){return e.nodeName&&e.nodeName.toLowerCase()===t}},CLASS:function(e){var t=N[e+" "];return t||(t=RegExp("(^|"+P+")"+e+"("+P+"|$)"))&&N(e,function(e){return t.test("string"==typeof e.className&&e.className||typeof e.getAttribute!==j&&e.getAttribute("class")||"")})},ATTR:function(e,t,n){return function(r){var i=at.attr(r,e);return null==i?"!="===t:t?(i+="","="===t?i===n:"!="===t?i!==n:"^="===t?n&&0===i.indexOf(n):"*="===t?n&&i.indexOf(n)>-1:"$="===t?n&&i.slice(-n.length)===n:"~="===t?(" "+i+" ").indexOf(n)>-1:"|="===t?i===n||i.slice(0,n.length+1)===n+"-":!1):!0}},CHILD:function(e,t,n,r,i){var o="nth"!==e.slice(0,3),a="last"!==e.slice(-4),s="of-type"===t;return 1===r&&0===i?function(e){return!!e.parentNode}:function(t,n,l){var u,c,p,f,d,h,g=o!==a?"nextSibling":"previousSibling",m=t.parentNode,y=s&&t.nodeName.toLowerCase(),v=!l&&!s;if(m){if(o){while(g){p=t;while(p=p[g])if(s?p.nodeName.toLowerCase()===y:1===p.nodeType)return!1;h=g="only"===e&&!h&&"nextSibling"}return!0}if(h=[a?m.firstChild:m.lastChild],a&&v){c=m[b]||(m[b]={}),u=c[e]||[],d=u[0]===T&&u[1],f=u[0]===T&&u[2],p=d&&m.childNodes[d];while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if(1===p.nodeType&&++f&&p===t){c[e]=[T,d,f];break}}else if(v&&(u=(t[b]||(t[b]={}))[e])&&u[0]===T)f=u[1];else while(p=++d&&p&&p[g]||(f=d=0)||h.pop())if((s?p.nodeName.toLowerCase()===y:1===p.nodeType)&&++f&&(v&&((p[b]||(p[b]={}))[e]=[T,f]),p===t))break;return f-=i,f===r||0===f%r&&f/r>=0}}},PSEUDO:function(e,t){var n,r=o.pseudos[e]||o.setFilters[e.toLowerCase()]||at.error("unsupported pseudo: "+e);return r[b]?r(t):r.length>1?(n=[e,e,"",t],o.setFilters.hasOwnProperty(e.toLowerCase())?lt(function(e,n){var i,o=r(e,t),a=o.length;while(a--)i=F.call(e,o[a]),e[i]=!(n[i]=o[a])}):function(e){return r(e,0,n)}):r}},pseudos:{not:lt(function(e){var t=[],n=[],r=l(e.replace(z,"$1"));return r[b]?lt(function(e,t,n,i){var o,a=r(e,null,i,[]),s=e.length;while(s--)(o=a[s])&&(e[s]=!(t[s]=o))}):function(e,i,o){return t[0]=e,r(t,null,o,n),!n.pop()}}),has:lt(function(e){return function(t){return at(e,t).length>0}}),contains:lt(function(e){return function(t){return(t.textContent||t.innerText||a(t)).indexOf(e)>-1}}),lang:lt(function(e){return G.test(e||"")||at.error("unsupported lang: "+e),e=e.replace(rt,it).toLowerCase(),function(t){var n;do if(n=h?t.lang:t.getAttribute("xml:lang")||t.getAttribute("lang"))return n=n.toLowerCase(),n===e||0===n.indexOf(e+"-");while((t=t.parentNode)&&1===t.nodeType);return!1}}),target:function(t){var n=e.location&&e.location.hash;return n&&n.slice(1)===t.id},root:function(e){return e===d},focus:function(e){return e===f.activeElement&&(!f.hasFocus||f.hasFocus())&&!!(e.type||e.href||~e.tabIndex)},enabled:function(e){return e.disabled===!1},disabled:function(e){return e.disabled===!0},checked:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&!!e.checked||"option"===t&&!!e.selected},selected:function(e){return e.parentNode&&e.parentNode.selectedIndex,e.selected===!0},empty:function(e){for(e=e.firstChild;e;e=e.nextSibling)if(e.nodeName>"@"||3===e.nodeType||4===e.nodeType)return!1;return!0},parent:function(e){return!o.pseudos.empty(e)},header:function(e){return tt.test(e.nodeName)},input:function(e){return et.test(e.nodeName)},button:function(e){var t=e.nodeName.toLowerCase();return"input"===t&&"button"===e.type||"button"===t},text:function(e){var t;return"input"===e.nodeName.toLowerCase()&&"text"===e.type&&(null==(t=e.getAttribute("type"))||t.toLowerCase()===e.type)},first:ht(function(){return[0]}),last:ht(function(e,t){return[t-1]}),eq:ht(function(e,t,n){return[0>n?n+t:n]}),even:ht(function(e,t){var n=0;for(;t>n;n+=2)e.push(n);return e}),odd:ht(function(e,t){var n=1;for(;t>n;n+=2)e.push(n);return e}),lt:ht(function(e,t,n){var r=0>n?n+t:n;for(;--r>=0;)e.push(r);return e}),gt:ht(function(e,t,n){var r=0>n?n+t:n;for(;t>++r;)e.push(r);return e})}},o.pseudos.nth=o.pseudos.eq;for(n in{radio:!0,checkbox:!0,file:!0,password:!0,image:!0})o.pseudos[n]=ft(n);for(n in{submit:!0,reset:!0})o.pseudos[n]=dt(n);function gt(){}gt.prototype=o.filters=o.pseudos,o.setFilters=new gt;function mt(e,t){var n,r,i,a,s,l,u,c=k[e+" "];if(c)return t?0:c.slice(0);s=e,l=[],u=o.preFilter;while(s){(!n||(r=X.exec(s)))&&(r&&(s=s.slice(r[0].length)||s),l.push(i=[])),n=!1,(r=U.exec(s))&&(n=r.shift(),i.push({value:n,type:r[0].replace(z," ")}),s=s.slice(n.length));for(a in o.filter)!(r=Q[a].exec(s))||u[a]&&!(r=u[a](r))||(n=r.shift(),i.push({value:n,type:a,matches:r}),s=s.slice(n.length));if(!n)break}return t?s.length:s?at.error(e):k(e,l).slice(0)}function yt(e){var t=0,n=e.length,r="";for(;n>t;t++)r+=e[t].value;return r}function vt(e,t,n){var r=t.dir,o=n&&"parentNode"===r,a=C++;return t.first?function(t,n,i){while(t=t[r])if(1===t.nodeType||o)return e(t,n,i)}:function(t,n,s){var l,u,c,p=T+" "+a;if(s){while(t=t[r])if((1===t.nodeType||o)&&e(t,n,s))return!0}else while(t=t[r])if(1===t.nodeType||o)if(c=t[b]||(t[b]={}),(u=c[r])&&u[0]===p){if((l=u[1])===!0||l===i)return l===!0}else if(u=c[r]=[p],u[1]=e(t,n,s)||i,u[1]===!0)return!0}}function bt(e){return e.length>1?function(t,n,r){var i=e.length;while(i--)if(!e[i](t,n,r))return!1;return!0}:e[0]}function xt(e,t,n,r,i){var o,a=[],s=0,l=e.length,u=null!=t;for(;l>s;s++)(o=e[s])&&(!n||n(o,r,i))&&(a.push(o),u&&t.push(s));return a}function wt(e,t,n,r,i,o){return r&&!r[b]&&(r=wt(r)),i&&!i[b]&&(i=wt(i,o)),lt(function(o,a,s,l){var u,c,p,f=[],d=[],h=a.length,g=o||Nt(t||"*",s.nodeType?[s]:s,[]),m=!e||!o&&t?g:xt(g,f,e,s,l),y=n?i||(o?e:h||r)?[]:a:m;if(n&&n(m,y,s,l),r){u=xt(y,d),r(u,[],s,l),c=u.length;while(c--)(p=u[c])&&(y[d[c]]=!(m[d[c]]=p))}if(o){if(i||e){if(i){u=[],c=y.length;while(c--)(p=y[c])&&u.push(m[c]=p);i(null,y=[],u,l)}c=y.length;while(c--)(p=y[c])&&(u=i?F.call(o,p):f[c])>-1&&(o[u]=!(a[u]=p))}}else y=xt(y===a?y.splice(h,y.length):y),i?i(null,a,y,l):M.apply(a,y)})}function Tt(e){var t,n,r,i=e.length,a=o.relative[e[0].type],s=a||o.relative[" "],l=a?1:0,c=vt(function(e){return e===t},s,!0),p=vt(function(e){return F.call(t,e)>-1},s,!0),f=[function(e,n,r){return!a&&(r||n!==u)||((t=n).nodeType?c(e,n,r):p(e,n,r))}];for(;i>l;l++)if(n=o.relative[e[l].type])f=[vt(bt(f),n)];else{if(n=o.filter[e[l].type].apply(null,e[l].matches),n[b]){for(r=++l;i>r;r++)if(o.relative[e[r].type])break;return wt(l>1&&bt(f),l>1&&yt(e.slice(0,l-1).concat({value:" "===e[l-2].type?"*":""})).replace(z,"$1"),n,r>l&&Tt(e.slice(l,r)),i>r&&Tt(e=e.slice(r)),i>r&&yt(e))}f.push(n)}return bt(f)}function Ct(e,t){var n=0,r=t.length>0,a=e.length>0,s=function(s,l,c,p,d){var h,g,m,y=[],v=0,b="0",x=s&&[],w=null!=d,C=u,N=s||a&&o.find.TAG("*",d&&l.parentNode||l),k=T+=null==C?1:Math.random()||.1;for(w&&(u=l!==f&&l,i=n);null!=(h=N[b]);b++){if(a&&h){g=0;while(m=e[g++])if(m(h,l,c)){p.push(h);break}w&&(T=k,i=++n)}r&&((h=!m&&h)&&v--,s&&x.push(h))}if(v+=b,r&&b!==v){g=0;while(m=t[g++])m(x,y,l,c);if(s){if(v>0)while(b--)x[b]||y[b]||(y[b]=q.call(p));y=xt(y)}M.apply(p,y),w&&!s&&y.length>0&&v+t.length>1&&at.uniqueSort(p)}return w&&(T=k,u=C),x};return r?lt(s):s}l=at.compile=function(e,t){var n,r=[],i=[],o=E[e+" "];if(!o){t||(t=mt(e)),n=t.length;while(n--)o=Tt(t[n]),o[b]?r.push(o):i.push(o);o=E(e,Ct(i,r))}return o};function Nt(e,t,n){var r=0,i=t.length;for(;i>r;r++)at(e,t[r],n);return n}function kt(e,t,n,i){var a,s,u,c,p,f=mt(e);if(!i&&1===f.length){if(s=f[0]=f[0].slice(0),s.length>2&&"ID"===(u=s[0]).type&&r.getById&&9===t.nodeType&&h&&o.relative[s[1].type]){if(t=(o.find.ID(u.matches[0].replace(rt,it),t)||[])[0],!t)return n;e=e.slice(s.shift().value.length)}a=Q.needsContext.test(e)?0:s.length;while(a--){if(u=s[a],o.relative[c=u.type])break;if((p=o.find[c])&&(i=p(u.matches[0].replace(rt,it),V.test(s[0].type)&&t.parentNode||t))){if(s.splice(a,1),e=i.length&&yt(s),!e)return M.apply(n,i),n;break}}}return l(e,f)(i,t,!h,n,V.test(e)),n}r.sortStable=b.split("").sort(A).join("")===b,r.detectDuplicates=S,p(),r.sortDetached=ut(function(e){return 1&e.compareDocumentPosition(f.createElement("div"))}),ut(function(e){return e.innerHTML="<a href='#'></a>","#"===e.firstChild.getAttribute("href")})||ct("type|href|height|width",function(e,n,r){return r?t:e.getAttribute(n,"type"===n.toLowerCase()?1:2)}),r.attributes&&ut(function(e){return e.innerHTML="<input/>",e.firstChild.setAttribute("value",""),""===e.firstChild.getAttribute("value")})||ct("value",function(e,n,r){return r||"input"!==e.nodeName.toLowerCase()?t:e.defaultValue}),ut(function(e){return null==e.getAttribute("disabled")})||ct(B,function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&i.specified?i.value:e[n]===!0?n.toLowerCase():null}),x.find=at,x.expr=at.selectors,x.expr[":"]=x.expr.pseudos,x.unique=at.uniqueSort,x.text=at.getText,x.isXMLDoc=at.isXML,x.contains=at.contains}(e);var O={};function F(e){var t=O[e]={};return x.each(e.match(T)||[],function(e,n){t[n]=!0}),t}x.Callbacks=function(e){e="string"==typeof e?O[e]||F(e):x.extend({},e);var n,r,i,o,a,s,l=[],u=!e.once&&[],c=function(t){for(r=e.memory&&t,i=!0,a=s||0,s=0,o=l.length,n=!0;l&&o>a;a++)if(l[a].apply(t[0],t[1])===!1&&e.stopOnFalse){r=!1;break}n=!1,l&&(u?u.length&&c(u.shift()):r?l=[]:p.disable())},p={add:function(){if(l){var t=l.length;(function i(t){x.each(t,function(t,n){var r=x.type(n);"function"===r?e.unique&&p.has(n)||l.push(n):n&&n.length&&"string"!==r&&i(n)})})(arguments),n?o=l.length:r&&(s=t,c(r))}return this},remove:function(){return l&&x.each(arguments,function(e,t){var r;while((r=x.inArray(t,l,r))>-1)l.splice(r,1),n&&(o>=r&&o--,a>=r&&a--)}),this},has:function(e){return e?x.inArray(e,l)>-1:!(!l||!l.length)},empty:function(){return l=[],o=0,this},disable:function(){return l=u=r=t,this},disabled:function(){return!l},lock:function(){return u=t,r||p.disable(),this},locked:function(){return!u},fireWith:function(e,t){return!l||i&&!u||(t=t||[],t=[e,t.slice?t.slice():t],n?u.push(t):c(t)),this},fire:function(){return p.fireWith(this,arguments),this},fired:function(){return!!i}};return p},x.extend({Deferred:function(e){var t=[["resolve","done",x.Callbacks("once memory"),"resolved"],["reject","fail",x.Callbacks("once memory"),"rejected"],["notify","progress",x.Callbacks("memory")]],n="pending",r={state:function(){return n},always:function(){return i.done(arguments).fail(arguments),this},then:function(){var e=arguments;return x.Deferred(function(n){x.each(t,function(t,o){var a=o[0],s=x.isFunction(e[t])&&e[t];i[o[1]](function(){var e=s&&s.apply(this,arguments);e&&x.isFunction(e.promise)?e.promise().done(n.resolve).fail(n.reject).progress(n.notify):n[a+"With"](this===r?n.promise():this,s?[e]:arguments)})}),e=null}).promise()},promise:function(e){return null!=e?x.extend(e,r):r}},i={};return r.pipe=r.then,x.each(t,function(e,o){var a=o[2],s=o[3];r[o[1]]=a.add,s&&a.add(function(){n=s},t[1^e][2].disable,t[2][2].lock),i[o[0]]=function(){return i[o[0]+"With"](this===i?r:this,arguments),this},i[o[0]+"With"]=a.fireWith}),r.promise(i),e&&e.call(i,i),i},when:function(e){var t=0,n=g.call(arguments),r=n.length,i=1!==r||e&&x.isFunction(e.promise)?r:0,o=1===i?e:x.Deferred(),a=function(e,t,n){return function(r){t[e]=this,n[e]=arguments.length>1?g.call(arguments):r,n===s?o.notifyWith(t,n):--i||o.resolveWith(t,n)}},s,l,u;if(r>1)for(s=Array(r),l=Array(r),u=Array(r);r>t;t++)n[t]&&x.isFunction(n[t].promise)?n[t].promise().done(a(t,u,n)).fail(o.reject).progress(a(t,l,s)):--i;return i||o.resolveWith(u,n),o.promise()}}),x.support=function(t){var n,r,o,s,l,u,c,p,f,d=a.createElement("div");if(d.setAttribute("className","t"),d.innerHTML="  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>",n=d.getElementsByTagName("*")||[],r=d.getElementsByTagName("a")[0],!r||!r.style||!n.length)return t;s=a.createElement("select"),u=s.appendChild(a.createElement("option")),o=d.getElementsByTagName("input")[0],r.style.cssText="top:1px;float:left;opacity:.5",t.getSetAttribute="t"!==d.className,t.leadingWhitespace=3===d.firstChild.nodeType,t.tbody=!d.getElementsByTagName("tbody").length,t.htmlSerialize=!!d.getElementsByTagName("link").length,t.style=/top/.test(r.getAttribute("style")),t.hrefNormalized="/a"===r.getAttribute("href"),t.opacity=/^0.5/.test(r.style.opacity),t.cssFloat=!!r.style.cssFloat,t.checkOn=!!o.value,t.optSelected=u.selected,t.enctype=!!a.createElement("form").enctype,t.html5Clone="<:nav></:nav>"!==a.createElement("nav").cloneNode(!0).outerHTML,t.inlineBlockNeedsLayout=!1,t.shrinkWrapBlocks=!1,t.pixelPosition=!1,t.deleteExpando=!0,t.noCloneEvent=!0,t.reliableMarginRight=!0,t.boxSizingReliable=!0,o.checked=!0,t.noCloneChecked=o.cloneNode(!0).checked,s.disabled=!0,t.optDisabled=!u.disabled;try{delete d.test}catch(h){t.deleteExpando=!1}o=a.createElement("input"),o.setAttribute("value",""),t.input=""===o.getAttribute("value"),o.value="t",o.setAttribute("type","radio"),t.radioValue="t"===o.value,o.setAttribute("checked","t"),o.setAttribute("name","t"),l=a.createDocumentFragment(),l.appendChild(o),t.appendChecked=o.checked,t.checkClone=l.cloneNode(!0).cloneNode(!0).lastChild.checked,d.attachEvent&&(d.attachEvent("onclick",function(){t.noCloneEvent=!1}),d.cloneNode(!0).click());for(f in{submit:!0,change:!0,focusin:!0})d.setAttribute(c="on"+f,"t"),t[f+"Bubbles"]=c in e||d.attributes[c].expando===!1;d.style.backgroundClip="content-box",d.cloneNode(!0).style.backgroundClip="",t.clearCloneStyle="content-box"===d.style.backgroundClip;for(f in x(t))break;return t.ownLast="0"!==f,x(function(){var n,r,o,s="padding:0;margin:0;border:0;display:block;box-sizing:content-box;-moz-box-sizing:content-box;-webkit-box-sizing:content-box;",l=a.getElementsByTagName("body")[0];l&&(n=a.createElement("div"),n.style.cssText="border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px",l.appendChild(n).appendChild(d),d.innerHTML="<table><tr><td></td><td>t</td></tr></table>",o=d.getElementsByTagName("td"),o[0].style.cssText="padding:0;margin:0;border:0;display:none",p=0===o[0].offsetHeight,o[0].style.display="",o[1].style.display="none",t.reliableHiddenOffsets=p&&0===o[0].offsetHeight,d.innerHTML="",d.style.cssText="box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;",x.swap(l,null!=l.style.zoom?{zoom:1}:{},function(){t.boxSizing=4===d.offsetWidth}),e.getComputedStyle&&(t.pixelPosition="1%"!==(e.getComputedStyle(d,null)||{}).top,t.boxSizingReliable="4px"===(e.getComputedStyle(d,null)||{width:"4px"}).width,r=d.appendChild(a.createElement("div")),r.style.cssText=d.style.cssText=s,r.style.marginRight=r.style.width="0",d.style.width="1px",t.reliableMarginRight=!parseFloat((e.getComputedStyle(r,null)||{}).marginRight)),typeof d.style.zoom!==i&&(d.innerHTML="",d.style.cssText=s+"width:1px;padding:1px;display:inline;zoom:1",t.inlineBlockNeedsLayout=3===d.offsetWidth,d.style.display="block",d.innerHTML="<div></div>",d.firstChild.style.width="5px",t.shrinkWrapBlocks=3!==d.offsetWidth,t.inlineBlockNeedsLayout&&(l.style.zoom=1)),l.removeChild(n),n=d=o=r=null)}),n=s=l=u=r=o=null,t
}({});var B=/(?:\{[\s\S]*\}|\[[\s\S]*\])$/,P=/([A-Z])/g;function R(e,n,r,i){if(x.acceptData(e)){var o,a,s=x.expando,l=e.nodeType,u=l?x.cache:e,c=l?e[s]:e[s]&&s;if(c&&u[c]&&(i||u[c].data)||r!==t||"string"!=typeof n)return c||(c=l?e[s]=p.pop()||x.guid++:s),u[c]||(u[c]=l?{}:{toJSON:x.noop}),("object"==typeof n||"function"==typeof n)&&(i?u[c]=x.extend(u[c],n):u[c].data=x.extend(u[c].data,n)),a=u[c],i||(a.data||(a.data={}),a=a.data),r!==t&&(a[x.camelCase(n)]=r),"string"==typeof n?(o=a[n],null==o&&(o=a[x.camelCase(n)])):o=a,o}}function W(e,t,n){if(x.acceptData(e)){var r,i,o=e.nodeType,a=o?x.cache:e,s=o?e[x.expando]:x.expando;if(a[s]){if(t&&(r=n?a[s]:a[s].data)){x.isArray(t)?t=t.concat(x.map(t,x.camelCase)):t in r?t=[t]:(t=x.camelCase(t),t=t in r?[t]:t.split(" ")),i=t.length;while(i--)delete r[t[i]];if(n?!I(r):!x.isEmptyObject(r))return}(n||(delete a[s].data,I(a[s])))&&(o?x.cleanData([e],!0):x.support.deleteExpando||a!=a.window?delete a[s]:a[s]=null)}}}x.extend({cache:{},noData:{applet:!0,embed:!0,object:"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"},hasData:function(e){return e=e.nodeType?x.cache[e[x.expando]]:e[x.expando],!!e&&!I(e)},data:function(e,t,n){return R(e,t,n)},removeData:function(e,t){return W(e,t)},_data:function(e,t,n){return R(e,t,n,!0)},_removeData:function(e,t){return W(e,t,!0)},acceptData:function(e){if(e.nodeType&&1!==e.nodeType&&9!==e.nodeType)return!1;var t=e.nodeName&&x.noData[e.nodeName.toLowerCase()];return!t||t!==!0&&e.getAttribute("classid")===t}}),x.fn.extend({data:function(e,n){var r,i,o=null,a=0,s=this[0];if(e===t){if(this.length&&(o=x.data(s),1===s.nodeType&&!x._data(s,"parsedAttrs"))){for(r=s.attributes;r.length>a;a++)i=r[a].name,0===i.indexOf("data-")&&(i=x.camelCase(i.slice(5)),$(s,i,o[i]));x._data(s,"parsedAttrs",!0)}return o}return"object"==typeof e?this.each(function(){x.data(this,e)}):arguments.length>1?this.each(function(){x.data(this,e,n)}):s?$(s,e,x.data(s,e)):null},removeData:function(e){return this.each(function(){x.removeData(this,e)})}});function $(e,n,r){if(r===t&&1===e.nodeType){var i="data-"+n.replace(P,"-$1").toLowerCase();if(r=e.getAttribute(i),"string"==typeof r){try{r="true"===r?!0:"false"===r?!1:"null"===r?null:+r+""===r?+r:B.test(r)?x.parseJSON(r):r}catch(o){}x.data(e,n,r)}else r=t}return r}function I(e){var t;for(t in e)if(("data"!==t||!x.isEmptyObject(e[t]))&&"toJSON"!==t)return!1;return!0}x.extend({queue:function(e,n,r){var i;return e?(n=(n||"fx")+"queue",i=x._data(e,n),r&&(!i||x.isArray(r)?i=x._data(e,n,x.makeArray(r)):i.push(r)),i||[]):t},dequeue:function(e,t){t=t||"fx";var n=x.queue(e,t),r=n.length,i=n.shift(),o=x._queueHooks(e,t),a=function(){x.dequeue(e,t)};"inprogress"===i&&(i=n.shift(),r--),i&&("fx"===t&&n.unshift("inprogress"),delete o.stop,i.call(e,a,o)),!r&&o&&o.empty.fire()},_queueHooks:function(e,t){var n=t+"queueHooks";return x._data(e,n)||x._data(e,n,{empty:x.Callbacks("once memory").add(function(){x._removeData(e,t+"queue"),x._removeData(e,n)})})}}),x.fn.extend({queue:function(e,n){var r=2;return"string"!=typeof e&&(n=e,e="fx",r--),r>arguments.length?x.queue(this[0],e):n===t?this:this.each(function(){var t=x.queue(this,e,n);x._queueHooks(this,e),"fx"===e&&"inprogress"!==t[0]&&x.dequeue(this,e)})},dequeue:function(e){return this.each(function(){x.dequeue(this,e)})},delay:function(e,t){return e=x.fx?x.fx.speeds[e]||e:e,t=t||"fx",this.queue(t,function(t,n){var r=setTimeout(t,e);n.stop=function(){clearTimeout(r)}})},clearQueue:function(e){return this.queue(e||"fx",[])},promise:function(e,n){var r,i=1,o=x.Deferred(),a=this,s=this.length,l=function(){--i||o.resolveWith(a,[a])};"string"!=typeof e&&(n=e,e=t),e=e||"fx";while(s--)r=x._data(a[s],e+"queueHooks"),r&&r.empty&&(i++,r.empty.add(l));return l(),o.promise(n)}});var z,X,U=/[\t\r\n\f]/g,V=/\r/g,Y=/^(?:input|select|textarea|button|object)$/i,J=/^(?:a|area)$/i,G=/^(?:checked|selected)$/i,Q=x.support.getSetAttribute,K=x.support.input;x.fn.extend({attr:function(e,t){return x.access(this,x.attr,e,t,arguments.length>1)},removeAttr:function(e){return this.each(function(){x.removeAttr(this,e)})},prop:function(e,t){return x.access(this,x.prop,e,t,arguments.length>1)},removeProp:function(e){return e=x.propFix[e]||e,this.each(function(){try{this[e]=t,delete this[e]}catch(n){}})},addClass:function(e){var t,n,r,i,o,a=0,s=this.length,l="string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).addClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):" ")){o=0;while(i=t[o++])0>r.indexOf(" "+i+" ")&&(r+=i+" ");n.className=x.trim(r)}return this},removeClass:function(e){var t,n,r,i,o,a=0,s=this.length,l=0===arguments.length||"string"==typeof e&&e;if(x.isFunction(e))return this.each(function(t){x(this).removeClass(e.call(this,t,this.className))});if(l)for(t=(e||"").match(T)||[];s>a;a++)if(n=this[a],r=1===n.nodeType&&(n.className?(" "+n.className+" ").replace(U," "):"")){o=0;while(i=t[o++])while(r.indexOf(" "+i+" ")>=0)r=r.replace(" "+i+" "," ");n.className=e?x.trim(r):""}return this},toggleClass:function(e,t){var n=typeof e;return"boolean"==typeof t&&"string"===n?t?this.addClass(e):this.removeClass(e):x.isFunction(e)?this.each(function(n){x(this).toggleClass(e.call(this,n,this.className,t),t)}):this.each(function(){if("string"===n){var t,r=0,o=x(this),a=e.match(T)||[];while(t=a[r++])o.hasClass(t)?o.removeClass(t):o.addClass(t)}else(n===i||"boolean"===n)&&(this.className&&x._data(this,"__className__",this.className),this.className=this.className||e===!1?"":x._data(this,"__className__")||"")})},hasClass:function(e){var t=" "+e+" ",n=0,r=this.length;for(;r>n;n++)if(1===this[n].nodeType&&(" "+this[n].className+" ").replace(U," ").indexOf(t)>=0)return!0;return!1},val:function(e){var n,r,i,o=this[0];{if(arguments.length)return i=x.isFunction(e),this.each(function(n){var o;1===this.nodeType&&(o=i?e.call(this,n,x(this).val()):e,null==o?o="":"number"==typeof o?o+="":x.isArray(o)&&(o=x.map(o,function(e){return null==e?"":e+""})),r=x.valHooks[this.type]||x.valHooks[this.nodeName.toLowerCase()],r&&"set"in r&&r.set(this,o,"value")!==t||(this.value=o))});if(o)return r=x.valHooks[o.type]||x.valHooks[o.nodeName.toLowerCase()],r&&"get"in r&&(n=r.get(o,"value"))!==t?n:(n=o.value,"string"==typeof n?n.replace(V,""):null==n?"":n)}}}),x.extend({valHooks:{option:{get:function(e){var t=x.find.attr(e,"value");return null!=t?t:e.text}},select:{get:function(e){var t,n,r=e.options,i=e.selectedIndex,o="select-one"===e.type||0>i,a=o?null:[],s=o?i+1:r.length,l=0>i?s:o?i:0;for(;s>l;l++)if(n=r[l],!(!n.selected&&l!==i||(x.support.optDisabled?n.disabled:null!==n.getAttribute("disabled"))||n.parentNode.disabled&&x.nodeName(n.parentNode,"optgroup"))){if(t=x(n).val(),o)return t;a.push(t)}return a},set:function(e,t){var n,r,i=e.options,o=x.makeArray(t),a=i.length;while(a--)r=i[a],(r.selected=x.inArray(x(r).val(),o)>=0)&&(n=!0);return n||(e.selectedIndex=-1),o}}},attr:function(e,n,r){var o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return typeof e.getAttribute===i?x.prop(e,n,r):(1===s&&x.isXMLDoc(e)||(n=n.toLowerCase(),o=x.attrHooks[n]||(x.expr.match.bool.test(n)?X:z)),r===t?o&&"get"in o&&null!==(a=o.get(e,n))?a:(a=x.find.attr(e,n),null==a?t:a):null!==r?o&&"set"in o&&(a=o.set(e,r,n))!==t?a:(e.setAttribute(n,r+""),r):(x.removeAttr(e,n),t))},removeAttr:function(e,t){var n,r,i=0,o=t&&t.match(T);if(o&&1===e.nodeType)while(n=o[i++])r=x.propFix[n]||n,x.expr.match.bool.test(n)?K&&Q||!G.test(n)?e[r]=!1:e[x.camelCase("default-"+n)]=e[r]=!1:x.attr(e,n,""),e.removeAttribute(Q?n:r)},attrHooks:{type:{set:function(e,t){if(!x.support.radioValue&&"radio"===t&&x.nodeName(e,"input")){var n=e.value;return e.setAttribute("type",t),n&&(e.value=n),t}}}},propFix:{"for":"htmlFor","class":"className"},prop:function(e,n,r){var i,o,a,s=e.nodeType;if(e&&3!==s&&8!==s&&2!==s)return a=1!==s||!x.isXMLDoc(e),a&&(n=x.propFix[n]||n,o=x.propHooks[n]),r!==t?o&&"set"in o&&(i=o.set(e,r,n))!==t?i:e[n]=r:o&&"get"in o&&null!==(i=o.get(e,n))?i:e[n]},propHooks:{tabIndex:{get:function(e){var t=x.find.attr(e,"tabindex");return t?parseInt(t,10):Y.test(e.nodeName)||J.test(e.nodeName)&&e.href?0:-1}}}}),X={set:function(e,t,n){return t===!1?x.removeAttr(e,n):K&&Q||!G.test(n)?e.setAttribute(!Q&&x.propFix[n]||n,n):e[x.camelCase("default-"+n)]=e[n]=!0,n}},x.each(x.expr.match.bool.source.match(/\w+/g),function(e,n){var r=x.expr.attrHandle[n]||x.find.attr;x.expr.attrHandle[n]=K&&Q||!G.test(n)?function(e,n,i){var o=x.expr.attrHandle[n],a=i?t:(x.expr.attrHandle[n]=t)!=r(e,n,i)?n.toLowerCase():null;return x.expr.attrHandle[n]=o,a}:function(e,n,r){return r?t:e[x.camelCase("default-"+n)]?n.toLowerCase():null}}),K&&Q||(x.attrHooks.value={set:function(e,n,r){return x.nodeName(e,"input")?(e.defaultValue=n,t):z&&z.set(e,n,r)}}),Q||(z={set:function(e,n,r){var i=e.getAttributeNode(r);return i||e.setAttributeNode(i=e.ownerDocument.createAttribute(r)),i.value=n+="","value"===r||n===e.getAttribute(r)?n:t}},x.expr.attrHandle.id=x.expr.attrHandle.name=x.expr.attrHandle.coords=function(e,n,r){var i;return r?t:(i=e.getAttributeNode(n))&&""!==i.value?i.value:null},x.valHooks.button={get:function(e,n){var r=e.getAttributeNode(n);return r&&r.specified?r.value:t},set:z.set},x.attrHooks.contenteditable={set:function(e,t,n){z.set(e,""===t?!1:t,n)}},x.each(["width","height"],function(e,n){x.attrHooks[n]={set:function(e,r){return""===r?(e.setAttribute(n,"auto"),r):t}}})),x.support.hrefNormalized||x.each(["href","src"],function(e,t){x.propHooks[t]={get:function(e){return e.getAttribute(t,4)}}}),x.support.style||(x.attrHooks.style={get:function(e){return e.style.cssText||t},set:function(e,t){return e.style.cssText=t+""}}),x.support.optSelected||(x.propHooks.selected={get:function(e){var t=e.parentNode;return t&&(t.selectedIndex,t.parentNode&&t.parentNode.selectedIndex),null}}),x.each(["tabIndex","readOnly","maxLength","cellSpacing","cellPadding","rowSpan","colSpan","useMap","frameBorder","contentEditable"],function(){x.propFix[this.toLowerCase()]=this}),x.support.enctype||(x.propFix.enctype="encoding"),x.each(["radio","checkbox"],function(){x.valHooks[this]={set:function(e,n){return x.isArray(n)?e.checked=x.inArray(x(e).val(),n)>=0:t}},x.support.checkOn||(x.valHooks[this].get=function(e){return null===e.getAttribute("value")?"on":e.value})});var Z=/^(?:input|select|textarea)$/i,et=/^key/,tt=/^(?:mouse|contextmenu)|click/,nt=/^(?:focusinfocus|focusoutblur)$/,rt=/^([^.]*)(?:\.(.+)|)$/;function it(){return!0}function ot(){return!1}function at(){try{return a.activeElement}catch(e){}}x.event={global:{},add:function(e,n,r,o,a){var s,l,u,c,p,f,d,h,g,m,y,v=x._data(e);if(v){r.handler&&(c=r,r=c.handler,a=c.selector),r.guid||(r.guid=x.guid++),(l=v.events)||(l=v.events={}),(f=v.handle)||(f=v.handle=function(e){return typeof x===i||e&&x.event.triggered===e.type?t:x.event.dispatch.apply(f.elem,arguments)},f.elem=e),n=(n||"").match(T)||[""],u=n.length;while(u--)s=rt.exec(n[u])||[],g=y=s[1],m=(s[2]||"").split(".").sort(),g&&(p=x.event.special[g]||{},g=(a?p.delegateType:p.bindType)||g,p=x.event.special[g]||{},d=x.extend({type:g,origType:y,data:o,handler:r,guid:r.guid,selector:a,needsContext:a&&x.expr.match.needsContext.test(a),namespace:m.join(".")},c),(h=l[g])||(h=l[g]=[],h.delegateCount=0,p.setup&&p.setup.call(e,o,m,f)!==!1||(e.addEventListener?e.addEventListener(g,f,!1):e.attachEvent&&e.attachEvent("on"+g,f))),p.add&&(p.add.call(e,d),d.handler.guid||(d.handler.guid=r.guid)),a?h.splice(h.delegateCount++,0,d):h.push(d),x.event.global[g]=!0);e=null}},remove:function(e,t,n,r,i){var o,a,s,l,u,c,p,f,d,h,g,m=x.hasData(e)&&x._data(e);if(m&&(c=m.events)){t=(t||"").match(T)||[""],u=t.length;while(u--)if(s=rt.exec(t[u])||[],d=g=s[1],h=(s[2]||"").split(".").sort(),d){p=x.event.special[d]||{},d=(r?p.delegateType:p.bindType)||d,f=c[d]||[],s=s[2]&&RegExp("(^|\\.)"+h.join("\\.(?:.*\\.|)")+"(\\.|$)"),l=o=f.length;while(o--)a=f[o],!i&&g!==a.origType||n&&n.guid!==a.guid||s&&!s.test(a.namespace)||r&&r!==a.selector&&("**"!==r||!a.selector)||(f.splice(o,1),a.selector&&f.delegateCount--,p.remove&&p.remove.call(e,a));l&&!f.length&&(p.teardown&&p.teardown.call(e,h,m.handle)!==!1||x.removeEvent(e,d,m.handle),delete c[d])}else for(d in c)x.event.remove(e,d+t[u],n,r,!0);x.isEmptyObject(c)&&(delete m.handle,x._removeData(e,"events"))}},trigger:function(n,r,i,o){var s,l,u,c,p,f,d,h=[i||a],g=v.call(n,"type")?n.type:n,m=v.call(n,"namespace")?n.namespace.split("."):[];if(u=f=i=i||a,3!==i.nodeType&&8!==i.nodeType&&!nt.test(g+x.event.triggered)&&(g.indexOf(".")>=0&&(m=g.split("."),g=m.shift(),m.sort()),l=0>g.indexOf(":")&&"on"+g,n=n[x.expando]?n:new x.Event(g,"object"==typeof n&&n),n.isTrigger=o?2:3,n.namespace=m.join("."),n.namespace_re=n.namespace?RegExp("(^|\\.)"+m.join("\\.(?:.*\\.|)")+"(\\.|$)"):null,n.result=t,n.target||(n.target=i),r=null==r?[n]:x.makeArray(r,[n]),p=x.event.special[g]||{},o||!p.trigger||p.trigger.apply(i,r)!==!1)){if(!o&&!p.noBubble&&!x.isWindow(i)){for(c=p.delegateType||g,nt.test(c+g)||(u=u.parentNode);u;u=u.parentNode)h.push(u),f=u;f===(i.ownerDocument||a)&&h.push(f.defaultView||f.parentWindow||e)}d=0;while((u=h[d++])&&!n.isPropagationStopped())n.type=d>1?c:p.bindType||g,s=(x._data(u,"events")||{})[n.type]&&x._data(u,"handle"),s&&s.apply(u,r),s=l&&u[l],s&&x.acceptData(u)&&s.apply&&s.apply(u,r)===!1&&n.preventDefault();if(n.type=g,!o&&!n.isDefaultPrevented()&&(!p._default||p._default.apply(h.pop(),r)===!1)&&x.acceptData(i)&&l&&i[g]&&!x.isWindow(i)){f=i[l],f&&(i[l]=null),x.event.triggered=g;try{i[g]()}catch(y){}x.event.triggered=t,f&&(i[l]=f)}return n.result}},dispatch:function(e){e=x.event.fix(e);var n,r,i,o,a,s=[],l=g.call(arguments),u=(x._data(this,"events")||{})[e.type]||[],c=x.event.special[e.type]||{};if(l[0]=e,e.delegateTarget=this,!c.preDispatch||c.preDispatch.call(this,e)!==!1){s=x.event.handlers.call(this,e,u),n=0;while((o=s[n++])&&!e.isPropagationStopped()){e.currentTarget=o.elem,a=0;while((i=o.handlers[a++])&&!e.isImmediatePropagationStopped())(!e.namespace_re||e.namespace_re.test(i.namespace))&&(e.handleObj=i,e.data=i.data,r=((x.event.special[i.origType]||{}).handle||i.handler).apply(o.elem,l),r!==t&&(e.result=r)===!1&&(e.preventDefault(),e.stopPropagation()))}return c.postDispatch&&c.postDispatch.call(this,e),e.result}},handlers:function(e,n){var r,i,o,a,s=[],l=n.delegateCount,u=e.target;if(l&&u.nodeType&&(!e.button||"click"!==e.type))for(;u!=this;u=u.parentNode||this)if(1===u.nodeType&&(u.disabled!==!0||"click"!==e.type)){for(o=[],a=0;l>a;a++)i=n[a],r=i.selector+" ",o[r]===t&&(o[r]=i.needsContext?x(r,this).index(u)>=0:x.find(r,this,null,[u]).length),o[r]&&o.push(i);o.length&&s.push({elem:u,handlers:o})}return n.length>l&&s.push({elem:this,handlers:n.slice(l)}),s},fix:function(e){if(e[x.expando])return e;var t,n,r,i=e.type,o=e,s=this.fixHooks[i];s||(this.fixHooks[i]=s=tt.test(i)?this.mouseHooks:et.test(i)?this.keyHooks:{}),r=s.props?this.props.concat(s.props):this.props,e=new x.Event(o),t=r.length;while(t--)n=r[t],e[n]=o[n];return e.target||(e.target=o.srcElement||a),3===e.target.nodeType&&(e.target=e.target.parentNode),e.metaKey=!!e.metaKey,s.filter?s.filter(e,o):e},props:"altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),fixHooks:{},keyHooks:{props:"char charCode key keyCode".split(" "),filter:function(e,t){return null==e.which&&(e.which=null!=t.charCode?t.charCode:t.keyCode),e}},mouseHooks:{props:"button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),filter:function(e,n){var r,i,o,s=n.button,l=n.fromElement;return null==e.pageX&&null!=n.clientX&&(i=e.target.ownerDocument||a,o=i.documentElement,r=i.body,e.pageX=n.clientX+(o&&o.scrollLeft||r&&r.scrollLeft||0)-(o&&o.clientLeft||r&&r.clientLeft||0),e.pageY=n.clientY+(o&&o.scrollTop||r&&r.scrollTop||0)-(o&&o.clientTop||r&&r.clientTop||0)),!e.relatedTarget&&l&&(e.relatedTarget=l===e.target?n.toElement:l),e.which||s===t||(e.which=1&s?1:2&s?3:4&s?2:0),e}},special:{load:{noBubble:!0},focus:{trigger:function(){if(this!==at()&&this.focus)try{return this.focus(),!1}catch(e){}},delegateType:"focusin"},blur:{trigger:function(){return this===at()&&this.blur?(this.blur(),!1):t},delegateType:"focusout"},click:{trigger:function(){return x.nodeName(this,"input")&&"checkbox"===this.type&&this.click?(this.click(),!1):t},_default:function(e){return x.nodeName(e.target,"a")}},beforeunload:{postDispatch:function(e){e.result!==t&&(e.originalEvent.returnValue=e.result)}}},simulate:function(e,t,n,r){var i=x.extend(new x.Event,n,{type:e,isSimulated:!0,originalEvent:{}});r?x.event.trigger(i,null,t):x.event.dispatch.call(t,i),i.isDefaultPrevented()&&n.preventDefault()}},x.removeEvent=a.removeEventListener?function(e,t,n){e.removeEventListener&&e.removeEventListener(t,n,!1)}:function(e,t,n){var r="on"+t;e.detachEvent&&(typeof e[r]===i&&(e[r]=null),e.detachEvent(r,n))},x.Event=function(e,n){return this instanceof x.Event?(e&&e.type?(this.originalEvent=e,this.type=e.type,this.isDefaultPrevented=e.defaultPrevented||e.returnValue===!1||e.getPreventDefault&&e.getPreventDefault()?it:ot):this.type=e,n&&x.extend(this,n),this.timeStamp=e&&e.timeStamp||x.now(),this[x.expando]=!0,t):new x.Event(e,n)},x.Event.prototype={isDefaultPrevented:ot,isPropagationStopped:ot,isImmediatePropagationStopped:ot,preventDefault:function(){var e=this.originalEvent;this.isDefaultPrevented=it,e&&(e.preventDefault?e.preventDefault():e.returnValue=!1)},stopPropagation:function(){var e=this.originalEvent;this.isPropagationStopped=it,e&&(e.stopPropagation&&e.stopPropagation(),e.cancelBubble=!0)},stopImmediatePropagation:function(){this.isImmediatePropagationStopped=it,this.stopPropagation()}},x.each({mouseenter:"mouseover",mouseleave:"mouseout"},function(e,t){x.event.special[e]={delegateType:t,bindType:t,handle:function(e){var n,r=this,i=e.relatedTarget,o=e.handleObj;return(!i||i!==r&&!x.contains(r,i))&&(e.type=o.origType,n=o.handler.apply(this,arguments),e.type=t),n}}}),x.support.submitBubbles||(x.event.special.submit={setup:function(){return x.nodeName(this,"form")?!1:(x.event.add(this,"click._submit keypress._submit",function(e){var n=e.target,r=x.nodeName(n,"input")||x.nodeName(n,"button")?n.form:t;r&&!x._data(r,"submitBubbles")&&(x.event.add(r,"submit._submit",function(e){e._submit_bubble=!0}),x._data(r,"submitBubbles",!0))}),t)},postDispatch:function(e){e._submit_bubble&&(delete e._submit_bubble,this.parentNode&&!e.isTrigger&&x.event.simulate("submit",this.parentNode,e,!0))},teardown:function(){return x.nodeName(this,"form")?!1:(x.event.remove(this,"._submit"),t)}}),x.support.changeBubbles||(x.event.special.change={setup:function(){return Z.test(this.nodeName)?(("checkbox"===this.type||"radio"===this.type)&&(x.event.add(this,"propertychange._change",function(e){"checked"===e.originalEvent.propertyName&&(this._just_changed=!0)}),x.event.add(this,"click._change",function(e){this._just_changed&&!e.isTrigger&&(this._just_changed=!1),x.event.simulate("change",this,e,!0)})),!1):(x.event.add(this,"beforeactivate._change",function(e){var t=e.target;Z.test(t.nodeName)&&!x._data(t,"changeBubbles")&&(x.event.add(t,"change._change",function(e){!this.parentNode||e.isSimulated||e.isTrigger||x.event.simulate("change",this.parentNode,e,!0)}),x._data(t,"changeBubbles",!0))}),t)},handle:function(e){var n=e.target;return this!==n||e.isSimulated||e.isTrigger||"radio"!==n.type&&"checkbox"!==n.type?e.handleObj.handler.apply(this,arguments):t},teardown:function(){return x.event.remove(this,"._change"),!Z.test(this.nodeName)}}),x.support.focusinBubbles||x.each({focus:"focusin",blur:"focusout"},function(e,t){var n=0,r=function(e){x.event.simulate(t,e.target,x.event.fix(e),!0)};x.event.special[t]={setup:function(){0===n++&&a.addEventListener(e,r,!0)},teardown:function(){0===--n&&a.removeEventListener(e,r,!0)}}}),x.fn.extend({on:function(e,n,r,i,o){var a,s;if("object"==typeof e){"string"!=typeof n&&(r=r||n,n=t);for(a in e)this.on(a,n,r,e[a],o);return this}if(null==r&&null==i?(i=n,r=n=t):null==i&&("string"==typeof n?(i=r,r=t):(i=r,r=n,n=t)),i===!1)i=ot;else if(!i)return this;return 1===o&&(s=i,i=function(e){return x().off(e),s.apply(this,arguments)},i.guid=s.guid||(s.guid=x.guid++)),this.each(function(){x.event.add(this,e,i,r,n)})},one:function(e,t,n,r){return this.on(e,t,n,r,1)},off:function(e,n,r){var i,o;if(e&&e.preventDefault&&e.handleObj)return i=e.handleObj,x(e.delegateTarget).off(i.namespace?i.origType+"."+i.namespace:i.origType,i.selector,i.handler),this;if("object"==typeof e){for(o in e)this.off(o,n,e[o]);return this}return(n===!1||"function"==typeof n)&&(r=n,n=t),r===!1&&(r=ot),this.each(function(){x.event.remove(this,e,r,n)})},trigger:function(e,t){return this.each(function(){x.event.trigger(e,t,this)})},triggerHandler:function(e,n){var r=this[0];return r?x.event.trigger(e,n,r,!0):t}});var st=/^.[^:#\[\.,]*$/,lt=/^(?:parents|prev(?:Until|All))/,ut=x.expr.match.needsContext,ct={children:!0,contents:!0,next:!0,prev:!0};x.fn.extend({find:function(e){var t,n=[],r=this,i=r.length;if("string"!=typeof e)return this.pushStack(x(e).filter(function(){for(t=0;i>t;t++)if(x.contains(r[t],this))return!0}));for(t=0;i>t;t++)x.find(e,r[t],n);return n=this.pushStack(i>1?x.unique(n):n),n.selector=this.selector?this.selector+" "+e:e,n},has:function(e){var t,n=x(e,this),r=n.length;return this.filter(function(){for(t=0;r>t;t++)if(x.contains(this,n[t]))return!0})},not:function(e){return this.pushStack(ft(this,e||[],!0))},filter:function(e){return this.pushStack(ft(this,e||[],!1))},is:function(e){return!!ft(this,"string"==typeof e&&ut.test(e)?x(e):e||[],!1).length},closest:function(e,t){var n,r=0,i=this.length,o=[],a=ut.test(e)||"string"!=typeof e?x(e,t||this.context):0;for(;i>r;r++)for(n=this[r];n&&n!==t;n=n.parentNode)if(11>n.nodeType&&(a?a.index(n)>-1:1===n.nodeType&&x.find.matchesSelector(n,e))){n=o.push(n);break}return this.pushStack(o.length>1?x.unique(o):o)},index:function(e){return e?"string"==typeof e?x.inArray(this[0],x(e)):x.inArray(e.jquery?e[0]:e,this):this[0]&&this[0].parentNode?this.first().prevAll().length:-1},add:function(e,t){var n="string"==typeof e?x(e,t):x.makeArray(e&&e.nodeType?[e]:e),r=x.merge(this.get(),n);return this.pushStack(x.unique(r))},addBack:function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}});function pt(e,t){do e=e[t];while(e&&1!==e.nodeType);return e}x.each({parent:function(e){var t=e.parentNode;return t&&11!==t.nodeType?t:null},parents:function(e){return x.dir(e,"parentNode")},parentsUntil:function(e,t,n){return x.dir(e,"parentNode",n)},next:function(e){return pt(e,"nextSibling")},prev:function(e){return pt(e,"previousSibling")},nextAll:function(e){return x.dir(e,"nextSibling")},prevAll:function(e){return x.dir(e,"previousSibling")},nextUntil:function(e,t,n){return x.dir(e,"nextSibling",n)},prevUntil:function(e,t,n){return x.dir(e,"previousSibling",n)},siblings:function(e){return x.sibling((e.parentNode||{}).firstChild,e)},children:function(e){return x.sibling(e.firstChild)},contents:function(e){return x.nodeName(e,"iframe")?e.contentDocument||e.contentWindow.document:x.merge([],e.childNodes)}},function(e,t){x.fn[e]=function(n,r){var i=x.map(this,t,n);return"Until"!==e.slice(-5)&&(r=n),r&&"string"==typeof r&&(i=x.filter(r,i)),this.length>1&&(ct[e]||(i=x.unique(i)),lt.test(e)&&(i=i.reverse())),this.pushStack(i)}}),x.extend({filter:function(e,t,n){var r=t[0];return n&&(e=":not("+e+")"),1===t.length&&1===r.nodeType?x.find.matchesSelector(r,e)?[r]:[]:x.find.matches(e,x.grep(t,function(e){return 1===e.nodeType}))},dir:function(e,n,r){var i=[],o=e[n];while(o&&9!==o.nodeType&&(r===t||1!==o.nodeType||!x(o).is(r)))1===o.nodeType&&i.push(o),o=o[n];return i},sibling:function(e,t){var n=[];for(;e;e=e.nextSibling)1===e.nodeType&&e!==t&&n.push(e);return n}});function ft(e,t,n){if(x.isFunction(t))return x.grep(e,function(e,r){return!!t.call(e,r,e)!==n});if(t.nodeType)return x.grep(e,function(e){return e===t!==n});if("string"==typeof t){if(st.test(t))return x.filter(t,e,n);t=x.filter(t,e)}return x.grep(e,function(e){return x.inArray(e,t)>=0!==n})}function dt(e){var t=ht.split("|"),n=e.createDocumentFragment();if(n.createElement)while(t.length)n.createElement(t.pop());return n}var ht="abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",gt=/ jQuery\d+="(?:null|\d+)"/g,mt=RegExp("<(?:"+ht+")[\\s/>]","i"),yt=/^\s+/,vt=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,bt=/<([\w:]+)/,xt=/<tbody/i,wt=/<|&#?\w+;/,Tt=/<(?:script|style|link)/i,Ct=/^(?:checkbox|radio)$/i,Nt=/checked\s*(?:[^=]|=\s*.checked.)/i,kt=/^$|\/(?:java|ecma)script/i,Et=/^true\/(.*)/,St=/^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,At={option:[1,"<select multiple='multiple'>","</select>"],legend:[1,"<fieldset>","</fieldset>"],area:[1,"<map>","</map>"],param:[1,"<object>","</object>"],thead:[1,"<table>","</table>"],tr:[2,"<table><tbody>","</tbody></table>"],col:[2,"<table><tbody></tbody><colgroup>","</colgroup></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:x.support.htmlSerialize?[0,"",""]:[1,"X<div>","</div>"]},jt=dt(a),Dt=jt.appendChild(a.createElement("div"));At.optgroup=At.option,At.tbody=At.tfoot=At.colgroup=At.caption=At.thead,At.th=At.td,x.fn.extend({text:function(e){return x.access(this,function(e){return e===t?x.text(this):this.empty().append((this[0]&&this[0].ownerDocument||a).createTextNode(e))},null,e,arguments.length)},append:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.appendChild(e)}})},prepend:function(){return this.domManip(arguments,function(e){if(1===this.nodeType||11===this.nodeType||9===this.nodeType){var t=Lt(this,e);t.insertBefore(e,t.firstChild)}})},before:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this)})},after:function(){return this.domManip(arguments,function(e){this.parentNode&&this.parentNode.insertBefore(e,this.nextSibling)})},remove:function(e,t){var n,r=e?x.filter(e,this):this,i=0;for(;null!=(n=r[i]);i++)t||1!==n.nodeType||x.cleanData(Ft(n)),n.parentNode&&(t&&x.contains(n.ownerDocument,n)&&_t(Ft(n,"script")),n.parentNode.removeChild(n));return this},empty:function(){var e,t=0;for(;null!=(e=this[t]);t++){1===e.nodeType&&x.cleanData(Ft(e,!1));while(e.firstChild)e.removeChild(e.firstChild);e.options&&x.nodeName(e,"select")&&(e.options.length=0)}return this},clone:function(e,t){return e=null==e?!1:e,t=null==t?e:t,this.map(function(){return x.clone(this,e,t)})},html:function(e){return x.access(this,function(e){var n=this[0]||{},r=0,i=this.length;if(e===t)return 1===n.nodeType?n.innerHTML.replace(gt,""):t;if(!("string"!=typeof e||Tt.test(e)||!x.support.htmlSerialize&&mt.test(e)||!x.support.leadingWhitespace&&yt.test(e)||At[(bt.exec(e)||["",""])[1].toLowerCase()])){e=e.replace(vt,"<$1></$2>");try{for(;i>r;r++)n=this[r]||{},1===n.nodeType&&(x.cleanData(Ft(n,!1)),n.innerHTML=e);n=0}catch(o){}}n&&this.empty().append(e)},null,e,arguments.length)},replaceWith:function(){var e=x.map(this,function(e){return[e.nextSibling,e.parentNode]}),t=0;return this.domManip(arguments,function(n){var r=e[t++],i=e[t++];i&&(r&&r.parentNode!==i&&(r=this.nextSibling),x(this).remove(),i.insertBefore(n,r))},!0),t?this:this.remove()},detach:function(e){return this.remove(e,!0)},domManip:function(e,t,n){e=d.apply([],e);var r,i,o,a,s,l,u=0,c=this.length,p=this,f=c-1,h=e[0],g=x.isFunction(h);if(g||!(1>=c||"string"!=typeof h||x.support.checkClone)&&Nt.test(h))return this.each(function(r){var i=p.eq(r);g&&(e[0]=h.call(this,r,i.html())),i.domManip(e,t,n)});if(c&&(l=x.buildFragment(e,this[0].ownerDocument,!1,!n&&this),r=l.firstChild,1===l.childNodes.length&&(l=r),r)){for(a=x.map(Ft(l,"script"),Ht),o=a.length;c>u;u++)i=l,u!==f&&(i=x.clone(i,!0,!0),o&&x.merge(a,Ft(i,"script"))),t.call(this[u],i,u);if(o)for(s=a[a.length-1].ownerDocument,x.map(a,qt),u=0;o>u;u++)i=a[u],kt.test(i.type||"")&&!x._data(i,"globalEval")&&x.contains(s,i)&&(i.src?x._evalUrl(i.src):x.globalEval((i.text||i.textContent||i.innerHTML||"").replace(St,"")));l=r=null}return this}});function Lt(e,t){return x.nodeName(e,"table")&&x.nodeName(1===t.nodeType?t:t.firstChild,"tr")?e.getElementsByTagName("tbody")[0]||e.appendChild(e.ownerDocument.createElement("tbody")):e}function Ht(e){return e.type=(null!==x.find.attr(e,"type"))+"/"+e.type,e}function qt(e){var t=Et.exec(e.type);return t?e.type=t[1]:e.removeAttribute("type"),e}function _t(e,t){var n,r=0;for(;null!=(n=e[r]);r++)x._data(n,"globalEval",!t||x._data(t[r],"globalEval"))}function Mt(e,t){if(1===t.nodeType&&x.hasData(e)){var n,r,i,o=x._data(e),a=x._data(t,o),s=o.events;if(s){delete a.handle,a.events={};for(n in s)for(r=0,i=s[n].length;i>r;r++)x.event.add(t,n,s[n][r])}a.data&&(a.data=x.extend({},a.data))}}function Ot(e,t){var n,r,i;if(1===t.nodeType){if(n=t.nodeName.toLowerCase(),!x.support.noCloneEvent&&t[x.expando]){i=x._data(t);for(r in i.events)x.removeEvent(t,r,i.handle);t.removeAttribute(x.expando)}"script"===n&&t.text!==e.text?(Ht(t).text=e.text,qt(t)):"object"===n?(t.parentNode&&(t.outerHTML=e.outerHTML),x.support.html5Clone&&e.innerHTML&&!x.trim(t.innerHTML)&&(t.innerHTML=e.innerHTML)):"input"===n&&Ct.test(e.type)?(t.defaultChecked=t.checked=e.checked,t.value!==e.value&&(t.value=e.value)):"option"===n?t.defaultSelected=t.selected=e.defaultSelected:("input"===n||"textarea"===n)&&(t.defaultValue=e.defaultValue)}}x.each({appendTo:"append",prependTo:"prepend",insertBefore:"before",insertAfter:"after",replaceAll:"replaceWith"},function(e,t){x.fn[e]=function(e){var n,r=0,i=[],o=x(e),a=o.length-1;for(;a>=r;r++)n=r===a?this:this.clone(!0),x(o[r])[t](n),h.apply(i,n.get());return this.pushStack(i)}});function Ft(e,n){var r,o,a=0,s=typeof e.getElementsByTagName!==i?e.getElementsByTagName(n||"*"):typeof e.querySelectorAll!==i?e.querySelectorAll(n||"*"):t;if(!s)for(s=[],r=e.childNodes||e;null!=(o=r[a]);a++)!n||x.nodeName(o,n)?s.push(o):x.merge(s,Ft(o,n));return n===t||n&&x.nodeName(e,n)?x.merge([e],s):s}function Bt(e){Ct.test(e.type)&&(e.defaultChecked=e.checked)}x.extend({clone:function(e,t,n){var r,i,o,a,s,l=x.contains(e.ownerDocument,e);if(x.support.html5Clone||x.isXMLDoc(e)||!mt.test("<"+e.nodeName+">")?o=e.cloneNode(!0):(Dt.innerHTML=e.outerHTML,Dt.removeChild(o=Dt.firstChild)),!(x.support.noCloneEvent&&x.support.noCloneChecked||1!==e.nodeType&&11!==e.nodeType||x.isXMLDoc(e)))for(r=Ft(o),s=Ft(e),a=0;null!=(i=s[a]);++a)r[a]&&Ot(i,r[a]);if(t)if(n)for(s=s||Ft(e),r=r||Ft(o),a=0;null!=(i=s[a]);a++)Mt(i,r[a]);else Mt(e,o);return r=Ft(o,"script"),r.length>0&&_t(r,!l&&Ft(e,"script")),r=s=i=null,o},buildFragment:function(e,t,n,r){var i,o,a,s,l,u,c,p=e.length,f=dt(t),d=[],h=0;for(;p>h;h++)if(o=e[h],o||0===o)if("object"===x.type(o))x.merge(d,o.nodeType?[o]:o);else if(wt.test(o)){s=s||f.appendChild(t.createElement("div")),l=(bt.exec(o)||["",""])[1].toLowerCase(),c=At[l]||At._default,s.innerHTML=c[1]+o.replace(vt,"<$1></$2>")+c[2],i=c[0];while(i--)s=s.lastChild;if(!x.support.leadingWhitespace&&yt.test(o)&&d.push(t.createTextNode(yt.exec(o)[0])),!x.support.tbody){o="table"!==l||xt.test(o)?"<table>"!==c[1]||xt.test(o)?0:s:s.firstChild,i=o&&o.childNodes.length;while(i--)x.nodeName(u=o.childNodes[i],"tbody")&&!u.childNodes.length&&o.removeChild(u)}x.merge(d,s.childNodes),s.textContent="";while(s.firstChild)s.removeChild(s.firstChild);s=f.lastChild}else d.push(t.createTextNode(o));s&&f.removeChild(s),x.support.appendChecked||x.grep(Ft(d,"input"),Bt),h=0;while(o=d[h++])if((!r||-1===x.inArray(o,r))&&(a=x.contains(o.ownerDocument,o),s=Ft(f.appendChild(o),"script"),a&&_t(s),n)){i=0;while(o=s[i++])kt.test(o.type||"")&&n.push(o)}return s=null,f},cleanData:function(e,t){var n,r,o,a,s=0,l=x.expando,u=x.cache,c=x.support.deleteExpando,f=x.event.special;for(;null!=(n=e[s]);s++)if((t||x.acceptData(n))&&(o=n[l],a=o&&u[o])){if(a.events)for(r in a.events)f[r]?x.event.remove(n,r):x.removeEvent(n,r,a.handle);
u[o]&&(delete u[o],c?delete n[l]:typeof n.removeAttribute!==i?n.removeAttribute(l):n[l]=null,p.push(o))}},_evalUrl:function(e){return x.ajax({url:e,type:"GET",dataType:"script",async:!1,global:!1,"throws":!0})}}),x.fn.extend({wrapAll:function(e){if(x.isFunction(e))return this.each(function(t){x(this).wrapAll(e.call(this,t))});if(this[0]){var t=x(e,this[0].ownerDocument).eq(0).clone(!0);this[0].parentNode&&t.insertBefore(this[0]),t.map(function(){var e=this;while(e.firstChild&&1===e.firstChild.nodeType)e=e.firstChild;return e}).append(this)}return this},wrapInner:function(e){return x.isFunction(e)?this.each(function(t){x(this).wrapInner(e.call(this,t))}):this.each(function(){var t=x(this),n=t.contents();n.length?n.wrapAll(e):t.append(e)})},wrap:function(e){var t=x.isFunction(e);return this.each(function(n){x(this).wrapAll(t?e.call(this,n):e)})},unwrap:function(){return this.parent().each(function(){x.nodeName(this,"body")||x(this).replaceWith(this.childNodes)}).end()}});var Pt,Rt,Wt,$t=/alpha\([^)]*\)/i,It=/opacity\s*=\s*([^)]*)/,zt=/^(top|right|bottom|left)$/,Xt=/^(none|table(?!-c[ea]).+)/,Ut=/^margin/,Vt=RegExp("^("+w+")(.*)$","i"),Yt=RegExp("^("+w+")(?!px)[a-z%]+$","i"),Jt=RegExp("^([+-])=("+w+")","i"),Gt={BODY:"block"},Qt={position:"absolute",visibility:"hidden",display:"block"},Kt={letterSpacing:0,fontWeight:400},Zt=["Top","Right","Bottom","Left"],en=["Webkit","O","Moz","ms"];function tn(e,t){if(t in e)return t;var n=t.charAt(0).toUpperCase()+t.slice(1),r=t,i=en.length;while(i--)if(t=en[i]+n,t in e)return t;return r}function nn(e,t){return e=t||e,"none"===x.css(e,"display")||!x.contains(e.ownerDocument,e)}function rn(e,t){var n,r,i,o=[],a=0,s=e.length;for(;s>a;a++)r=e[a],r.style&&(o[a]=x._data(r,"olddisplay"),n=r.style.display,t?(o[a]||"none"!==n||(r.style.display=""),""===r.style.display&&nn(r)&&(o[a]=x._data(r,"olddisplay",ln(r.nodeName)))):o[a]||(i=nn(r),(n&&"none"!==n||!i)&&x._data(r,"olddisplay",i?n:x.css(r,"display"))));for(a=0;s>a;a++)r=e[a],r.style&&(t&&"none"!==r.style.display&&""!==r.style.display||(r.style.display=t?o[a]||"":"none"));return e}x.fn.extend({css:function(e,n){return x.access(this,function(e,n,r){var i,o,a={},s=0;if(x.isArray(n)){for(o=Rt(e),i=n.length;i>s;s++)a[n[s]]=x.css(e,n[s],!1,o);return a}return r!==t?x.style(e,n,r):x.css(e,n)},e,n,arguments.length>1)},show:function(){return rn(this,!0)},hide:function(){return rn(this)},toggle:function(e){return"boolean"==typeof e?e?this.show():this.hide():this.each(function(){nn(this)?x(this).show():x(this).hide()})}}),x.extend({cssHooks:{opacity:{get:function(e,t){if(t){var n=Wt(e,"opacity");return""===n?"1":n}}}},cssNumber:{columnCount:!0,fillOpacity:!0,fontWeight:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,widows:!0,zIndex:!0,zoom:!0},cssProps:{"float":x.support.cssFloat?"cssFloat":"styleFloat"},style:function(e,n,r,i){if(e&&3!==e.nodeType&&8!==e.nodeType&&e.style){var o,a,s,l=x.camelCase(n),u=e.style;if(n=x.cssProps[l]||(x.cssProps[l]=tn(u,l)),s=x.cssHooks[n]||x.cssHooks[l],r===t)return s&&"get"in s&&(o=s.get(e,!1,i))!==t?o:u[n];if(a=typeof r,"string"===a&&(o=Jt.exec(r))&&(r=(o[1]+1)*o[2]+parseFloat(x.css(e,n)),a="number"),!(null==r||"number"===a&&isNaN(r)||("number"!==a||x.cssNumber[l]||(r+="px"),x.support.clearCloneStyle||""!==r||0!==n.indexOf("background")||(u[n]="inherit"),s&&"set"in s&&(r=s.set(e,r,i))===t)))try{u[n]=r}catch(c){}}},css:function(e,n,r,i){var o,a,s,l=x.camelCase(n);return n=x.cssProps[l]||(x.cssProps[l]=tn(e.style,l)),s=x.cssHooks[n]||x.cssHooks[l],s&&"get"in s&&(a=s.get(e,!0,r)),a===t&&(a=Wt(e,n,i)),"normal"===a&&n in Kt&&(a=Kt[n]),""===r||r?(o=parseFloat(a),r===!0||x.isNumeric(o)?o||0:a):a}}),e.getComputedStyle?(Rt=function(t){return e.getComputedStyle(t,null)},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s.getPropertyValue(n)||s[n]:t,u=e.style;return s&&(""!==l||x.contains(e.ownerDocument,e)||(l=x.style(e,n)),Yt.test(l)&&Ut.test(n)&&(i=u.width,o=u.minWidth,a=u.maxWidth,u.minWidth=u.maxWidth=u.width=l,l=s.width,u.width=i,u.minWidth=o,u.maxWidth=a)),l}):a.documentElement.currentStyle&&(Rt=function(e){return e.currentStyle},Wt=function(e,n,r){var i,o,a,s=r||Rt(e),l=s?s[n]:t,u=e.style;return null==l&&u&&u[n]&&(l=u[n]),Yt.test(l)&&!zt.test(n)&&(i=u.left,o=e.runtimeStyle,a=o&&o.left,a&&(o.left=e.currentStyle.left),u.left="fontSize"===n?"1em":l,l=u.pixelLeft+"px",u.left=i,a&&(o.left=a)),""===l?"auto":l});function on(e,t,n){var r=Vt.exec(t);return r?Math.max(0,r[1]-(n||0))+(r[2]||"px"):t}function an(e,t,n,r,i){var o=n===(r?"border":"content")?4:"width"===t?1:0,a=0;for(;4>o;o+=2)"margin"===n&&(a+=x.css(e,n+Zt[o],!0,i)),r?("content"===n&&(a-=x.css(e,"padding"+Zt[o],!0,i)),"margin"!==n&&(a-=x.css(e,"border"+Zt[o]+"Width",!0,i))):(a+=x.css(e,"padding"+Zt[o],!0,i),"padding"!==n&&(a+=x.css(e,"border"+Zt[o]+"Width",!0,i)));return a}function sn(e,t,n){var r=!0,i="width"===t?e.offsetWidth:e.offsetHeight,o=Rt(e),a=x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,o);if(0>=i||null==i){if(i=Wt(e,t,o),(0>i||null==i)&&(i=e.style[t]),Yt.test(i))return i;r=a&&(x.support.boxSizingReliable||i===e.style[t]),i=parseFloat(i)||0}return i+an(e,t,n||(a?"border":"content"),r,o)+"px"}function ln(e){var t=a,n=Gt[e];return n||(n=un(e,t),"none"!==n&&n||(Pt=(Pt||x("<iframe frameborder='0' width='0' height='0'/>").css("cssText","display:block !important")).appendTo(t.documentElement),t=(Pt[0].contentWindow||Pt[0].contentDocument).document,t.write("<!doctype html><html><body>"),t.close(),n=un(e,t),Pt.detach()),Gt[e]=n),n}function un(e,t){var n=x(t.createElement(e)).appendTo(t.body),r=x.css(n[0],"display");return n.remove(),r}x.each(["height","width"],function(e,n){x.cssHooks[n]={get:function(e,r,i){return r?0===e.offsetWidth&&Xt.test(x.css(e,"display"))?x.swap(e,Qt,function(){return sn(e,n,i)}):sn(e,n,i):t},set:function(e,t,r){var i=r&&Rt(e);return on(e,t,r?an(e,n,r,x.support.boxSizing&&"border-box"===x.css(e,"boxSizing",!1,i),i):0)}}}),x.support.opacity||(x.cssHooks.opacity={get:function(e,t){return It.test((t&&e.currentStyle?e.currentStyle.filter:e.style.filter)||"")?.01*parseFloat(RegExp.$1)+"":t?"1":""},set:function(e,t){var n=e.style,r=e.currentStyle,i=x.isNumeric(t)?"alpha(opacity="+100*t+")":"",o=r&&r.filter||n.filter||"";n.zoom=1,(t>=1||""===t)&&""===x.trim(o.replace($t,""))&&n.removeAttribute&&(n.removeAttribute("filter"),""===t||r&&!r.filter)||(n.filter=$t.test(o)?o.replace($t,i):o+" "+i)}}),x(function(){x.support.reliableMarginRight||(x.cssHooks.marginRight={get:function(e,n){return n?x.swap(e,{display:"inline-block"},Wt,[e,"marginRight"]):t}}),!x.support.pixelPosition&&x.fn.position&&x.each(["top","left"],function(e,n){x.cssHooks[n]={get:function(e,r){return r?(r=Wt(e,n),Yt.test(r)?x(e).position()[n]+"px":r):t}}})}),x.expr&&x.expr.filters&&(x.expr.filters.hidden=function(e){return 0>=e.offsetWidth&&0>=e.offsetHeight||!x.support.reliableHiddenOffsets&&"none"===(e.style&&e.style.display||x.css(e,"display"))},x.expr.filters.visible=function(e){return!x.expr.filters.hidden(e)}),x.each({margin:"",padding:"",border:"Width"},function(e,t){x.cssHooks[e+t]={expand:function(n){var r=0,i={},o="string"==typeof n?n.split(" "):[n];for(;4>r;r++)i[e+Zt[r]+t]=o[r]||o[r-2]||o[0];return i}},Ut.test(e)||(x.cssHooks[e+t].set=on)});var cn=/%20/g,pn=/\[\]$/,fn=/\r?\n/g,dn=/^(?:submit|button|image|reset|file)$/i,hn=/^(?:input|select|textarea|keygen)/i;x.fn.extend({serialize:function(){return x.param(this.serializeArray())},serializeArray:function(){return this.map(function(){var e=x.prop(this,"elements");return e?x.makeArray(e):this}).filter(function(){var e=this.type;return this.name&&!x(this).is(":disabled")&&hn.test(this.nodeName)&&!dn.test(e)&&(this.checked||!Ct.test(e))}).map(function(e,t){var n=x(this).val();return null==n?null:x.isArray(n)?x.map(n,function(e){return{name:t.name,value:e.replace(fn,"\r\n")}}):{name:t.name,value:n.replace(fn,"\r\n")}}).get()}}),x.param=function(e,n){var r,i=[],o=function(e,t){t=x.isFunction(t)?t():null==t?"":t,i[i.length]=encodeURIComponent(e)+"="+encodeURIComponent(t)};if(n===t&&(n=x.ajaxSettings&&x.ajaxSettings.traditional),x.isArray(e)||e.jquery&&!x.isPlainObject(e))x.each(e,function(){o(this.name,this.value)});else for(r in e)gn(r,e[r],n,o);return i.join("&").replace(cn,"+")};function gn(e,t,n,r){var i;if(x.isArray(t))x.each(t,function(t,i){n||pn.test(e)?r(e,i):gn(e+"["+("object"==typeof i?t:"")+"]",i,n,r)});else if(n||"object"!==x.type(t))r(e,t);else for(i in t)gn(e+"["+i+"]",t[i],n,r)}x.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "),function(e,t){x.fn[t]=function(e,n){return arguments.length>0?this.on(t,null,e,n):this.trigger(t)}}),x.fn.extend({hover:function(e,t){return this.mouseenter(e).mouseleave(t||e)},bind:function(e,t,n){return this.on(e,null,t,n)},unbind:function(e,t){return this.off(e,null,t)},delegate:function(e,t,n,r){return this.on(t,e,n,r)},undelegate:function(e,t,n){return 1===arguments.length?this.off(e,"**"):this.off(t,e||"**",n)}});var mn,yn,vn=x.now(),bn=/\?/,xn=/#.*$/,wn=/([?&])_=[^&]*/,Tn=/^(.*?):[ \t]*([^\r\n]*)\r?$/gm,Cn=/^(?:about|app|app-storage|.+-extension|file|res|widget):$/,Nn=/^(?:GET|HEAD)$/,kn=/^\/\//,En=/^([\w.+-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/,Sn=x.fn.load,An={},jn={},Dn="*/".concat("*");try{yn=o.href}catch(Ln){yn=a.createElement("a"),yn.href="",yn=yn.href}mn=En.exec(yn.toLowerCase())||[];function Hn(e){return function(t,n){"string"!=typeof t&&(n=t,t="*");var r,i=0,o=t.toLowerCase().match(T)||[];if(x.isFunction(n))while(r=o[i++])"+"===r[0]?(r=r.slice(1)||"*",(e[r]=e[r]||[]).unshift(n)):(e[r]=e[r]||[]).push(n)}}function qn(e,n,r,i){var o={},a=e===jn;function s(l){var u;return o[l]=!0,x.each(e[l]||[],function(e,l){var c=l(n,r,i);return"string"!=typeof c||a||o[c]?a?!(u=c):t:(n.dataTypes.unshift(c),s(c),!1)}),u}return s(n.dataTypes[0])||!o["*"]&&s("*")}function _n(e,n){var r,i,o=x.ajaxSettings.flatOptions||{};for(i in n)n[i]!==t&&((o[i]?e:r||(r={}))[i]=n[i]);return r&&x.extend(!0,e,r),e}x.fn.load=function(e,n,r){if("string"!=typeof e&&Sn)return Sn.apply(this,arguments);var i,o,a,s=this,l=e.indexOf(" ");return l>=0&&(i=e.slice(l,e.length),e=e.slice(0,l)),x.isFunction(n)?(r=n,n=t):n&&"object"==typeof n&&(a="POST"),s.length>0&&x.ajax({url:e,type:a,dataType:"html",data:n}).done(function(e){o=arguments,s.html(i?x("<div>").append(x.parseHTML(e)).find(i):e)}).complete(r&&function(e,t){s.each(r,o||[e.responseText,t,e])}),this},x.each(["ajaxStart","ajaxStop","ajaxComplete","ajaxError","ajaxSuccess","ajaxSend"],function(e,t){x.fn[t]=function(e){return this.on(t,e)}}),x.extend({active:0,lastModified:{},etag:{},ajaxSettings:{url:yn,type:"GET",isLocal:Cn.test(mn[1]),global:!0,processData:!0,async:!0,contentType:"application/x-www-form-urlencoded; charset=UTF-8",accepts:{"*":Dn,text:"text/plain",html:"text/html",xml:"application/xml, text/xml",json:"application/json, text/javascript"},contents:{xml:/xml/,html:/html/,json:/json/},responseFields:{xml:"responseXML",text:"responseText",json:"responseJSON"},converters:{"* text":String,"text html":!0,"text json":x.parseJSON,"text xml":x.parseXML},flatOptions:{url:!0,context:!0}},ajaxSetup:function(e,t){return t?_n(_n(e,x.ajaxSettings),t):_n(x.ajaxSettings,e)},ajaxPrefilter:Hn(An),ajaxTransport:Hn(jn),ajax:function(e,n){"object"==typeof e&&(n=e,e=t),n=n||{};var r,i,o,a,s,l,u,c,p=x.ajaxSetup({},n),f=p.context||p,d=p.context&&(f.nodeType||f.jquery)?x(f):x.event,h=x.Deferred(),g=x.Callbacks("once memory"),m=p.statusCode||{},y={},v={},b=0,w="canceled",C={readyState:0,getResponseHeader:function(e){var t;if(2===b){if(!c){c={};while(t=Tn.exec(a))c[t[1].toLowerCase()]=t[2]}t=c[e.toLowerCase()]}return null==t?null:t},getAllResponseHeaders:function(){return 2===b?a:null},setRequestHeader:function(e,t){var n=e.toLowerCase();return b||(e=v[n]=v[n]||e,y[e]=t),this},overrideMimeType:function(e){return b||(p.mimeType=e),this},statusCode:function(e){var t;if(e)if(2>b)for(t in e)m[t]=[m[t],e[t]];else C.always(e[C.status]);return this},abort:function(e){var t=e||w;return u&&u.abort(t),k(0,t),this}};if(h.promise(C).complete=g.add,C.success=C.done,C.error=C.fail,p.url=((e||p.url||yn)+"").replace(xn,"").replace(kn,mn[1]+"//"),p.type=n.method||n.type||p.method||p.type,p.dataTypes=x.trim(p.dataType||"*").toLowerCase().match(T)||[""],null==p.crossDomain&&(r=En.exec(p.url.toLowerCase()),p.crossDomain=!(!r||r[1]===mn[1]&&r[2]===mn[2]&&(r[3]||("http:"===r[1]?"80":"443"))===(mn[3]||("http:"===mn[1]?"80":"443")))),p.data&&p.processData&&"string"!=typeof p.data&&(p.data=x.param(p.data,p.traditional)),qn(An,p,n,C),2===b)return C;l=p.global,l&&0===x.active++&&x.event.trigger("ajaxStart"),p.type=p.type.toUpperCase(),p.hasContent=!Nn.test(p.type),o=p.url,p.hasContent||(p.data&&(o=p.url+=(bn.test(o)?"&":"?")+p.data,delete p.data),p.cache===!1&&(p.url=wn.test(o)?o.replace(wn,"$1_="+vn++):o+(bn.test(o)?"&":"?")+"_="+vn++)),p.ifModified&&(x.lastModified[o]&&C.setRequestHeader("If-Modified-Since",x.lastModified[o]),x.etag[o]&&C.setRequestHeader("If-None-Match",x.etag[o])),(p.data&&p.hasContent&&p.contentType!==!1||n.contentType)&&C.setRequestHeader("Content-Type",p.contentType),C.setRequestHeader("Accept",p.dataTypes[0]&&p.accepts[p.dataTypes[0]]?p.accepts[p.dataTypes[0]]+("*"!==p.dataTypes[0]?", "+Dn+"; q=0.01":""):p.accepts["*"]);for(i in p.headers)C.setRequestHeader(i,p.headers[i]);if(p.beforeSend&&(p.beforeSend.call(f,C,p)===!1||2===b))return C.abort();w="abort";for(i in{success:1,error:1,complete:1})C[i](p[i]);if(u=qn(jn,p,n,C)){C.readyState=1,l&&d.trigger("ajaxSend",[C,p]),p.async&&p.timeout>0&&(s=setTimeout(function(){C.abort("timeout")},p.timeout));try{b=1,u.send(y,k)}catch(N){if(!(2>b))throw N;k(-1,N)}}else k(-1,"No Transport");function k(e,n,r,i){var c,y,v,w,T,N=n;2!==b&&(b=2,s&&clearTimeout(s),u=t,a=i||"",C.readyState=e>0?4:0,c=e>=200&&300>e||304===e,r&&(w=Mn(p,C,r)),w=On(p,w,C,c),c?(p.ifModified&&(T=C.getResponseHeader("Last-Modified"),T&&(x.lastModified[o]=T),T=C.getResponseHeader("etag"),T&&(x.etag[o]=T)),204===e||"HEAD"===p.type?N="nocontent":304===e?N="notmodified":(N=w.state,y=w.data,v=w.error,c=!v)):(v=N,(e||!N)&&(N="error",0>e&&(e=0))),C.status=e,C.statusText=(n||N)+"",c?h.resolveWith(f,[y,N,C]):h.rejectWith(f,[C,N,v]),C.statusCode(m),m=t,l&&d.trigger(c?"ajaxSuccess":"ajaxError",[C,p,c?y:v]),g.fireWith(f,[C,N]),l&&(d.trigger("ajaxComplete",[C,p]),--x.active||x.event.trigger("ajaxStop")))}return C},getJSON:function(e,t,n){return x.get(e,t,n,"json")},getScript:function(e,n){return x.get(e,t,n,"script")}}),x.each(["get","post"],function(e,n){x[n]=function(e,r,i,o){return x.isFunction(r)&&(o=o||i,i=r,r=t),x.ajax({url:e,type:n,dataType:o,data:r,success:i})}});function Mn(e,n,r){var i,o,a,s,l=e.contents,u=e.dataTypes;while("*"===u[0])u.shift(),o===t&&(o=e.mimeType||n.getResponseHeader("Content-Type"));if(o)for(s in l)if(l[s]&&l[s].test(o)){u.unshift(s);break}if(u[0]in r)a=u[0];else{for(s in r){if(!u[0]||e.converters[s+" "+u[0]]){a=s;break}i||(i=s)}a=a||i}return a?(a!==u[0]&&u.unshift(a),r[a]):t}function On(e,t,n,r){var i,o,a,s,l,u={},c=e.dataTypes.slice();if(c[1])for(a in e.converters)u[a.toLowerCase()]=e.converters[a];o=c.shift();while(o)if(e.responseFields[o]&&(n[e.responseFields[o]]=t),!l&&r&&e.dataFilter&&(t=e.dataFilter(t,e.dataType)),l=o,o=c.shift())if("*"===o)o=l;else if("*"!==l&&l!==o){if(a=u[l+" "+o]||u["* "+o],!a)for(i in u)if(s=i.split(" "),s[1]===o&&(a=u[l+" "+s[0]]||u["* "+s[0]])){a===!0?a=u[i]:u[i]!==!0&&(o=s[0],c.unshift(s[1]));break}if(a!==!0)if(a&&e["throws"])t=a(t);else try{t=a(t)}catch(p){return{state:"parsererror",error:a?p:"No conversion from "+l+" to "+o}}}return{state:"success",data:t}}x.ajaxSetup({accepts:{script:"text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"},contents:{script:/(?:java|ecma)script/},converters:{"text script":function(e){return x.globalEval(e),e}}}),x.ajaxPrefilter("script",function(e){e.cache===t&&(e.cache=!1),e.crossDomain&&(e.type="GET",e.global=!1)}),x.ajaxTransport("script",function(e){if(e.crossDomain){var n,r=a.head||x("head")[0]||a.documentElement;return{send:function(t,i){n=a.createElement("script"),n.async=!0,e.scriptCharset&&(n.charset=e.scriptCharset),n.src=e.url,n.onload=n.onreadystatechange=function(e,t){(t||!n.readyState||/loaded|complete/.test(n.readyState))&&(n.onload=n.onreadystatechange=null,n.parentNode&&n.parentNode.removeChild(n),n=null,t||i(200,"success"))},r.insertBefore(n,r.firstChild)},abort:function(){n&&n.onload(t,!0)}}}});var Fn=[],Bn=/(=)\?(?=&|$)|\?\?/;x.ajaxSetup({jsonp:"callback",jsonpCallback:function(){var e=Fn.pop()||x.expando+"_"+vn++;return this[e]=!0,e}}),x.ajaxPrefilter("json jsonp",function(n,r,i){var o,a,s,l=n.jsonp!==!1&&(Bn.test(n.url)?"url":"string"==typeof n.data&&!(n.contentType||"").indexOf("application/x-www-form-urlencoded")&&Bn.test(n.data)&&"data");return l||"jsonp"===n.dataTypes[0]?(o=n.jsonpCallback=x.isFunction(n.jsonpCallback)?n.jsonpCallback():n.jsonpCallback,l?n[l]=n[l].replace(Bn,"$1"+o):n.jsonp!==!1&&(n.url+=(bn.test(n.url)?"&":"?")+n.jsonp+"="+o),n.converters["script json"]=function(){return s||x.error(o+" was not called"),s[0]},n.dataTypes[0]="json",a=e[o],e[o]=function(){s=arguments},i.always(function(){e[o]=a,n[o]&&(n.jsonpCallback=r.jsonpCallback,Fn.push(o)),s&&x.isFunction(a)&&a(s[0]),s=a=t}),"script"):t});var Pn,Rn,Wn=0,$n=e.ActiveXObject&&function(){var e;for(e in Pn)Pn[e](t,!0)};function In(){try{return new e.XMLHttpRequest}catch(t){}}function zn(){try{return new e.ActiveXObject("Microsoft.XMLHTTP")}catch(t){}}x.ajaxSettings.xhr=e.ActiveXObject?function(){return!this.isLocal&&In()||zn()}:In,Rn=x.ajaxSettings.xhr(),x.support.cors=!!Rn&&"withCredentials"in Rn,Rn=x.support.ajax=!!Rn,Rn&&x.ajaxTransport(function(n){if(!n.crossDomain||x.support.cors){var r;return{send:function(i,o){var a,s,l=n.xhr();if(n.username?l.open(n.type,n.url,n.async,n.username,n.password):l.open(n.type,n.url,n.async),n.xhrFields)for(s in n.xhrFields)l[s]=n.xhrFields[s];n.mimeType&&l.overrideMimeType&&l.overrideMimeType(n.mimeType),n.crossDomain||i["X-Requested-With"]||(i["X-Requested-With"]="XMLHttpRequest");try{for(s in i)l.setRequestHeader(s,i[s])}catch(u){}l.send(n.hasContent&&n.data||null),r=function(e,i){var s,u,c,p;try{if(r&&(i||4===l.readyState))if(r=t,a&&(l.onreadystatechange=x.noop,$n&&delete Pn[a]),i)4!==l.readyState&&l.abort();else{p={},s=l.status,u=l.getAllResponseHeaders(),"string"==typeof l.responseText&&(p.text=l.responseText);try{c=l.statusText}catch(f){c=""}s||!n.isLocal||n.crossDomain?1223===s&&(s=204):s=p.text?200:404}}catch(d){i||o(-1,d)}p&&o(s,c,p,u)},n.async?4===l.readyState?setTimeout(r):(a=++Wn,$n&&(Pn||(Pn={},x(e).unload($n)),Pn[a]=r),l.onreadystatechange=r):r()},abort:function(){r&&r(t,!0)}}}});var Xn,Un,Vn=/^(?:toggle|show|hide)$/,Yn=RegExp("^(?:([+-])=|)("+w+")([a-z%]*)$","i"),Jn=/queueHooks$/,Gn=[nr],Qn={"*":[function(e,t){var n=this.createTween(e,t),r=n.cur(),i=Yn.exec(t),o=i&&i[3]||(x.cssNumber[e]?"":"px"),a=(x.cssNumber[e]||"px"!==o&&+r)&&Yn.exec(x.css(n.elem,e)),s=1,l=20;if(a&&a[3]!==o){o=o||a[3],i=i||[],a=+r||1;do s=s||".5",a/=s,x.style(n.elem,e,a+o);while(s!==(s=n.cur()/r)&&1!==s&&--l)}return i&&(a=n.start=+a||+r||0,n.unit=o,n.end=i[1]?a+(i[1]+1)*i[2]:+i[2]),n}]};function Kn(){return setTimeout(function(){Xn=t}),Xn=x.now()}function Zn(e,t,n){var r,i=(Qn[t]||[]).concat(Qn["*"]),o=0,a=i.length;for(;a>o;o++)if(r=i[o].call(n,t,e))return r}function er(e,t,n){var r,i,o=0,a=Gn.length,s=x.Deferred().always(function(){delete l.elem}),l=function(){if(i)return!1;var t=Xn||Kn(),n=Math.max(0,u.startTime+u.duration-t),r=n/u.duration||0,o=1-r,a=0,l=u.tweens.length;for(;l>a;a++)u.tweens[a].run(o);return s.notifyWith(e,[u,o,n]),1>o&&l?n:(s.resolveWith(e,[u]),!1)},u=s.promise({elem:e,props:x.extend({},t),opts:x.extend(!0,{specialEasing:{}},n),originalProperties:t,originalOptions:n,startTime:Xn||Kn(),duration:n.duration,tweens:[],createTween:function(t,n){var r=x.Tween(e,u.opts,t,n,u.opts.specialEasing[t]||u.opts.easing);return u.tweens.push(r),r},stop:function(t){var n=0,r=t?u.tweens.length:0;if(i)return this;for(i=!0;r>n;n++)u.tweens[n].run(1);return t?s.resolveWith(e,[u,t]):s.rejectWith(e,[u,t]),this}}),c=u.props;for(tr(c,u.opts.specialEasing);a>o;o++)if(r=Gn[o].call(u,e,c,u.opts))return r;return x.map(c,Zn,u),x.isFunction(u.opts.start)&&u.opts.start.call(e,u),x.fx.timer(x.extend(l,{elem:e,anim:u,queue:u.opts.queue})),u.progress(u.opts.progress).done(u.opts.done,u.opts.complete).fail(u.opts.fail).always(u.opts.always)}function tr(e,t){var n,r,i,o,a;for(n in e)if(r=x.camelCase(n),i=t[r],o=e[n],x.isArray(o)&&(i=o[1],o=e[n]=o[0]),n!==r&&(e[r]=o,delete e[n]),a=x.cssHooks[r],a&&"expand"in a){o=a.expand(o),delete e[r];for(n in o)n in e||(e[n]=o[n],t[n]=i)}else t[r]=i}x.Animation=x.extend(er,{tweener:function(e,t){x.isFunction(e)?(t=e,e=["*"]):e=e.split(" ");var n,r=0,i=e.length;for(;i>r;r++)n=e[r],Qn[n]=Qn[n]||[],Qn[n].unshift(t)},prefilter:function(e,t){t?Gn.unshift(e):Gn.push(e)}});function nr(e,t,n){var r,i,o,a,s,l,u=this,c={},p=e.style,f=e.nodeType&&nn(e),d=x._data(e,"fxshow");n.queue||(s=x._queueHooks(e,"fx"),null==s.unqueued&&(s.unqueued=0,l=s.empty.fire,s.empty.fire=function(){s.unqueued||l()}),s.unqueued++,u.always(function(){u.always(function(){s.unqueued--,x.queue(e,"fx").length||s.empty.fire()})})),1===e.nodeType&&("height"in t||"width"in t)&&(n.overflow=[p.overflow,p.overflowX,p.overflowY],"inline"===x.css(e,"display")&&"none"===x.css(e,"float")&&(x.support.inlineBlockNeedsLayout&&"inline"!==ln(e.nodeName)?p.zoom=1:p.display="inline-block")),n.overflow&&(p.overflow="hidden",x.support.shrinkWrapBlocks||u.always(function(){p.overflow=n.overflow[0],p.overflowX=n.overflow[1],p.overflowY=n.overflow[2]}));for(r in t)if(i=t[r],Vn.exec(i)){if(delete t[r],o=o||"toggle"===i,i===(f?"hide":"show"))continue;c[r]=d&&d[r]||x.style(e,r)}if(!x.isEmptyObject(c)){d?"hidden"in d&&(f=d.hidden):d=x._data(e,"fxshow",{}),o&&(d.hidden=!f),f?x(e).show():u.done(function(){x(e).hide()}),u.done(function(){var t;x._removeData(e,"fxshow");for(t in c)x.style(e,t,c[t])});for(r in c)a=Zn(f?d[r]:0,r,u),r in d||(d[r]=a.start,f&&(a.end=a.start,a.start="width"===r||"height"===r?1:0))}}function rr(e,t,n,r,i){return new rr.prototype.init(e,t,n,r,i)}x.Tween=rr,rr.prototype={constructor:rr,init:function(e,t,n,r,i,o){this.elem=e,this.prop=n,this.easing=i||"swing",this.options=t,this.start=this.now=this.cur(),this.end=r,this.unit=o||(x.cssNumber[n]?"":"px")},cur:function(){var e=rr.propHooks[this.prop];return e&&e.get?e.get(this):rr.propHooks._default.get(this)},run:function(e){var t,n=rr.propHooks[this.prop];return this.pos=t=this.options.duration?x.easing[this.easing](e,this.options.duration*e,0,1,this.options.duration):e,this.now=(this.end-this.start)*t+this.start,this.options.step&&this.options.step.call(this.elem,this.now,this),n&&n.set?n.set(this):rr.propHooks._default.set(this),this}},rr.prototype.init.prototype=rr.prototype,rr.propHooks={_default:{get:function(e){var t;return null==e.elem[e.prop]||e.elem.style&&null!=e.elem.style[e.prop]?(t=x.css(e.elem,e.prop,""),t&&"auto"!==t?t:0):e.elem[e.prop]},set:function(e){x.fx.step[e.prop]?x.fx.step[e.prop](e):e.elem.style&&(null!=e.elem.style[x.cssProps[e.prop]]||x.cssHooks[e.prop])?x.style(e.elem,e.prop,e.now+e.unit):e.elem[e.prop]=e.now}}},rr.propHooks.scrollTop=rr.propHooks.scrollLeft={set:function(e){e.elem.nodeType&&e.elem.parentNode&&(e.elem[e.prop]=e.now)}},x.each(["toggle","show","hide"],function(e,t){var n=x.fn[t];x.fn[t]=function(e,r,i){return null==e||"boolean"==typeof e?n.apply(this,arguments):this.animate(ir(t,!0),e,r,i)}}),x.fn.extend({fadeTo:function(e,t,n,r){return this.filter(nn).css("opacity",0).show().end().animate({opacity:t},e,n,r)},animate:function(e,t,n,r){var i=x.isEmptyObject(e),o=x.speed(t,n,r),a=function(){var t=er(this,x.extend({},e),o);(i||x._data(this,"finish"))&&t.stop(!0)};return a.finish=a,i||o.queue===!1?this.each(a):this.queue(o.queue,a)},stop:function(e,n,r){var i=function(e){var t=e.stop;delete e.stop,t(r)};return"string"!=typeof e&&(r=n,n=e,e=t),n&&e!==!1&&this.queue(e||"fx",[]),this.each(function(){var t=!0,n=null!=e&&e+"queueHooks",o=x.timers,a=x._data(this);if(n)a[n]&&a[n].stop&&i(a[n]);else for(n in a)a[n]&&a[n].stop&&Jn.test(n)&&i(a[n]);for(n=o.length;n--;)o[n].elem!==this||null!=e&&o[n].queue!==e||(o[n].anim.stop(r),t=!1,o.splice(n,1));(t||!r)&&x.dequeue(this,e)})},finish:function(e){return e!==!1&&(e=e||"fx"),this.each(function(){var t,n=x._data(this),r=n[e+"queue"],i=n[e+"queueHooks"],o=x.timers,a=r?r.length:0;for(n.finish=!0,x.queue(this,e,[]),i&&i.stop&&i.stop.call(this,!0),t=o.length;t--;)o[t].elem===this&&o[t].queue===e&&(o[t].anim.stop(!0),o.splice(t,1));for(t=0;a>t;t++)r[t]&&r[t].finish&&r[t].finish.call(this);delete n.finish})}});function ir(e,t){var n,r={height:e},i=0;for(t=t?1:0;4>i;i+=2-t)n=Zt[i],r["margin"+n]=r["padding"+n]=e;return t&&(r.opacity=r.width=e),r}x.each({slideDown:ir("show"),slideUp:ir("hide"),slideToggle:ir("toggle"),fadeIn:{opacity:"show"},fadeOut:{opacity:"hide"},fadeToggle:{opacity:"toggle"}},function(e,t){x.fn[e]=function(e,n,r){return this.animate(t,e,n,r)}}),x.speed=function(e,t,n){var r=e&&"object"==typeof e?x.extend({},e):{complete:n||!n&&t||x.isFunction(e)&&e,duration:e,easing:n&&t||t&&!x.isFunction(t)&&t};return r.duration=x.fx.off?0:"number"==typeof r.duration?r.duration:r.duration in x.fx.speeds?x.fx.speeds[r.duration]:x.fx.speeds._default,(null==r.queue||r.queue===!0)&&(r.queue="fx"),r.old=r.complete,r.complete=function(){x.isFunction(r.old)&&r.old.call(this),r.queue&&x.dequeue(this,r.queue)},r},x.easing={linear:function(e){return e},swing:function(e){return.5-Math.cos(e*Math.PI)/2}},x.timers=[],x.fx=rr.prototype.init,x.fx.tick=function(){var e,n=x.timers,r=0;for(Xn=x.now();n.length>r;r++)e=n[r],e()||n[r]!==e||n.splice(r--,1);n.length||x.fx.stop(),Xn=t},x.fx.timer=function(e){e()&&x.timers.push(e)&&x.fx.start()},x.fx.interval=13,x.fx.start=function(){Un||(Un=setInterval(x.fx.tick,x.fx.interval))},x.fx.stop=function(){clearInterval(Un),Un=null},x.fx.speeds={slow:600,fast:200,_default:400},x.fx.step={},x.expr&&x.expr.filters&&(x.expr.filters.animated=function(e){return x.grep(x.timers,function(t){return e===t.elem}).length}),x.fn.offset=function(e){if(arguments.length)return e===t?this:this.each(function(t){x.offset.setOffset(this,e,t)});var n,r,o={top:0,left:0},a=this[0],s=a&&a.ownerDocument;if(s)return n=s.documentElement,x.contains(n,a)?(typeof a.getBoundingClientRect!==i&&(o=a.getBoundingClientRect()),r=or(s),{top:o.top+(r.pageYOffset||n.scrollTop)-(n.clientTop||0),left:o.left+(r.pageXOffset||n.scrollLeft)-(n.clientLeft||0)}):o},x.offset={setOffset:function(e,t,n){var r=x.css(e,"position");"static"===r&&(e.style.position="relative");var i=x(e),o=i.offset(),a=x.css(e,"top"),s=x.css(e,"left"),l=("absolute"===r||"fixed"===r)&&x.inArray("auto",[a,s])>-1,u={},c={},p,f;l?(c=i.position(),p=c.top,f=c.left):(p=parseFloat(a)||0,f=parseFloat(s)||0),x.isFunction(t)&&(t=t.call(e,n,o)),null!=t.top&&(u.top=t.top-o.top+p),null!=t.left&&(u.left=t.left-o.left+f),"using"in t?t.using.call(e,u):i.css(u)}},x.fn.extend({position:function(){if(this[0]){var e,t,n={top:0,left:0},r=this[0];return"fixed"===x.css(r,"position")?t=r.getBoundingClientRect():(e=this.offsetParent(),t=this.offset(),x.nodeName(e[0],"html")||(n=e.offset()),n.top+=x.css(e[0],"borderTopWidth",!0),n.left+=x.css(e[0],"borderLeftWidth",!0)),{top:t.top-n.top-x.css(r,"marginTop",!0),left:t.left-n.left-x.css(r,"marginLeft",!0)}}},offsetParent:function(){return this.map(function(){var e=this.offsetParent||s;while(e&&!x.nodeName(e,"html")&&"static"===x.css(e,"position"))e=e.offsetParent;return e||s})}}),x.each({scrollLeft:"pageXOffset",scrollTop:"pageYOffset"},function(e,n){var r=/Y/.test(n);x.fn[e]=function(i){return x.access(this,function(e,i,o){var a=or(e);return o===t?a?n in a?a[n]:a.document.documentElement[i]:e[i]:(a?a.scrollTo(r?x(a).scrollLeft():o,r?o:x(a).scrollTop()):e[i]=o,t)},e,i,arguments.length,null)}});function or(e){return x.isWindow(e)?e:9===e.nodeType?e.defaultView||e.parentWindow:!1}x.each({Height:"height",Width:"width"},function(e,n){x.each({padding:"inner"+e,content:n,"":"outer"+e},function(r,i){x.fn[i]=function(i,o){var a=arguments.length&&(r||"boolean"!=typeof i),s=r||(i===!0||o===!0?"margin":"border");return x.access(this,function(n,r,i){var o;return x.isWindow(n)?n.document.documentElement["client"+e]:9===n.nodeType?(o=n.documentElement,Math.max(n.body["scroll"+e],o["scroll"+e],n.body["offset"+e],o["offset"+e],o["client"+e])):i===t?x.css(n,r,s):x.style(n,r,i,s)},n,a?i:t,a,null)}})}),x.fn.size=function(){return this.length},x.fn.andSelf=x.fn.addBack,"object"==typeof module&&module&&"object"==typeof module.exports?module.exports=x:(e.jQuery=e.$=x,"function"==typeof define&&define.amd&&define("jquery",[],function(){return x}))})(window);

/*! jQuery UI - v1.10.3 - 2013-10-26
* http://jqueryui.com
* Includes: jquery.ui.core.js, jquery.ui.datepicker.js
* Copyright 2013 jQuery Foundation and other contributors; Licensed MIT */

(function(e,t){function i(t,i){var s,n,r,o=t.nodeName.toLowerCase();return"area"===o?(s=t.parentNode,n=s.name,t.href&&n&&"map"===s.nodeName.toLowerCase()?(r=e("img[usemap=#"+n+"]")[0],!!r&&a(r)):!1):(/input|select|textarea|button|object/.test(o)?!t.disabled:"a"===o?t.href||i:i)&&a(t)}function a(t){return e.expr.filters.visible(t)&&!e(t).parents().addBack().filter(function(){return"hidden"===e.css(this,"visibility")}).length}var s=0,n=/^ui-id-\d+$/;e.ui=e.ui||{},e.extend(e.ui,{version:"1.10.3",keyCode:{BACKSPACE:8,COMMA:188,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,NUMPAD_ADD:107,NUMPAD_DECIMAL:110,NUMPAD_DIVIDE:111,NUMPAD_ENTER:108,NUMPAD_MULTIPLY:106,NUMPAD_SUBTRACT:109,PAGE_DOWN:34,PAGE_UP:33,PERIOD:190,RIGHT:39,SPACE:32,TAB:9,UP:38}}),e.fn.extend({focus:function(t){return function(i,a){return"number"==typeof i?this.each(function(){var t=this;setTimeout(function(){e(t).focus(),a&&a.call(t)},i)}):t.apply(this,arguments)}}(e.fn.focus),scrollParent:function(){var t;return t=e.ui.ie&&/(static|relative)/.test(this.css("position"))||/absolute/.test(this.css("position"))?this.parents().filter(function(){return/(relative|absolute|fixed)/.test(e.css(this,"position"))&&/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0):this.parents().filter(function(){return/(auto|scroll)/.test(e.css(this,"overflow")+e.css(this,"overflow-y")+e.css(this,"overflow-x"))}).eq(0),/fixed/.test(this.css("position"))||!t.length?e(document):t},zIndex:function(i){if(i!==t)return this.css("zIndex",i);if(this.length)for(var a,s,n=e(this[0]);n.length&&n[0]!==document;){if(a=n.css("position"),("absolute"===a||"relative"===a||"fixed"===a)&&(s=parseInt(n.css("zIndex"),10),!isNaN(s)&&0!==s))return s;n=n.parent()}return 0},uniqueId:function(){return this.each(function(){this.id||(this.id="ui-id-"+ ++s)})},removeUniqueId:function(){return this.each(function(){n.test(this.id)&&e(this).removeAttr("id")})}}),e.extend(e.expr[":"],{data:e.expr.createPseudo?e.expr.createPseudo(function(t){return function(i){return!!e.data(i,t)}}):function(t,i,a){return!!e.data(t,a[3])},focusable:function(t){return i(t,!isNaN(e.attr(t,"tabindex")))},tabbable:function(t){var a=e.attr(t,"tabindex"),s=isNaN(a);return(s||a>=0)&&i(t,!s)}}),e("<a>").outerWidth(1).jquery||e.each(["Width","Height"],function(i,a){function s(t,i,a,s){return e.each(n,function(){i-=parseFloat(e.css(t,"padding"+this))||0,a&&(i-=parseFloat(e.css(t,"border"+this+"Width"))||0),s&&(i-=parseFloat(e.css(t,"margin"+this))||0)}),i}var n="Width"===a?["Left","Right"]:["Top","Bottom"],r=a.toLowerCase(),o={innerWidth:e.fn.innerWidth,innerHeight:e.fn.innerHeight,outerWidth:e.fn.outerWidth,outerHeight:e.fn.outerHeight};e.fn["inner"+a]=function(i){return i===t?o["inner"+a].call(this):this.each(function(){e(this).css(r,s(this,i)+"px")})},e.fn["outer"+a]=function(t,i){return"number"!=typeof t?o["outer"+a].call(this,t):this.each(function(){e(this).css(r,s(this,t,!0,i)+"px")})}}),e.fn.addBack||(e.fn.addBack=function(e){return this.add(null==e?this.prevObject:this.prevObject.filter(e))}),e("<a>").data("a-b","a").removeData("a-b").data("a-b")&&(e.fn.removeData=function(t){return function(i){return arguments.length?t.call(this,e.camelCase(i)):t.call(this)}}(e.fn.removeData)),e.ui.ie=!!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()),e.support.selectstart="onselectstart"in document.createElement("div"),e.fn.extend({disableSelection:function(){return this.bind((e.support.selectstart?"selectstart":"mousedown")+".ui-disableSelection",function(e){e.preventDefault()})},enableSelection:function(){return this.unbind(".ui-disableSelection")}}),e.extend(e.ui,{plugin:{add:function(t,i,a){var s,n=e.ui[t].prototype;for(s in a)n.plugins[s]=n.plugins[s]||[],n.plugins[s].push([i,a[s]])},call:function(e,t,i){var a,s=e.plugins[t];if(s&&e.element[0].parentNode&&11!==e.element[0].parentNode.nodeType)for(a=0;s.length>a;a++)e.options[s[a][0]]&&s[a][1].apply(e.element,i)}},hasScroll:function(t,i){if("hidden"===e(t).css("overflow"))return!1;var a=i&&"left"===i?"scrollLeft":"scrollTop",s=!1;return t[a]>0?!0:(t[a]=1,s=t[a]>0,t[a]=0,s)}})})(jQuery);(function(e,t){function i(){this._curInst=null,this._keyEvent=!1,this._disabledInputs=[],this._datepickerShowing=!1,this._inDialog=!1,this._mainDivId="ui-datepicker-div",this._inlineClass="ui-datepicker-inline",this._appendClass="ui-datepicker-append",this._triggerClass="ui-datepicker-trigger",this._dialogClass="ui-datepicker-dialog",this._disableClass="ui-datepicker-disabled",this._unselectableClass="ui-datepicker-unselectable",this._currentClass="ui-datepicker-current-day",this._dayOverClass="ui-datepicker-days-cell-over",this.regional=[],this.regional[""]={closeText:"Done",prevText:"Prev",nextText:"Next",currentText:"Today",monthNames:["January","February","March","April","May","June","July","August","September","October","November","December"],monthNamesShort:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],dayNames:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],dayNamesShort:["Sun","Mon","Tue","Wed","Thu","Fri","Sat"],dayNamesMin:["Su","Mo","Tu","We","Th","Fr","Sa"],weekHeader:"Wk",dateFormat:"mm/dd/yy",firstDay:0,isRTL:!1,showMonthAfterYear:!1,yearSuffix:""},this._defaults={showOn:"focus",showAnim:"fadeIn",showOptions:{},defaultDate:null,appendText:"",buttonText:"...",buttonImage:"",buttonImageOnly:!1,hideIfNoPrevNext:!1,navigationAsDateFormat:!1,gotoCurrent:!1,changeMonth:!1,changeYear:!1,yearRange:"c-10:c+10",showOtherMonths:!1,selectOtherMonths:!1,showWeek:!1,calculateWeek:this.iso8601Week,shortYearCutoff:"+10",minDate:null,maxDate:null,duration:"fast",beforeShowDay:null,beforeShow:null,onSelect:null,onChangeMonthYear:null,onClose:null,numberOfMonths:1,showCurrentAtPos:0,stepMonths:1,stepBigMonths:12,altField:"",altFormat:"",constrainInput:!0,showButtonPanel:!1,autoSize:!1,disabled:!1},e.extend(this._defaults,this.regional[""]),this.dpDiv=a(e("<div id='"+this._mainDivId+"' class='ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>"))}function a(t){var i="button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";return t.delegate(i,"mouseout",function(){e(this).removeClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).removeClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).removeClass("ui-datepicker-next-hover")}).delegate(i,"mouseover",function(){e.datepicker._isDisabledDatepicker(n.inline?t.parent()[0]:n.input[0])||(e(this).parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"),e(this).addClass("ui-state-hover"),-1!==this.className.indexOf("ui-datepicker-prev")&&e(this).addClass("ui-datepicker-prev-hover"),-1!==this.className.indexOf("ui-datepicker-next")&&e(this).addClass("ui-datepicker-next-hover"))})}function s(t,i){e.extend(t,i);for(var a in i)null==i[a]&&(t[a]=i[a]);return t}e.extend(e.ui,{datepicker:{version:"1.10.3"}});var n,r="datepicker";e.extend(i.prototype,{markerClassName:"hasDatepicker",maxRows:4,_widgetDatepicker:function(){return this.dpDiv},setDefaults:function(e){return s(this._defaults,e||{}),this},_attachDatepicker:function(t,i){var a,s,n;a=t.nodeName.toLowerCase(),s="div"===a||"span"===a,t.id||(this.uuid+=1,t.id="dp"+this.uuid),n=this._newInst(e(t),s),n.settings=e.extend({},i||{}),"input"===a?this._connectDatepicker(t,n):s&&this._inlineDatepicker(t,n)},_newInst:function(t,i){var s=t[0].id.replace(/([^A-Za-z0-9_\-])/g,"\\\\$1");return{id:s,input:t,selectedDay:0,selectedMonth:0,selectedYear:0,drawMonth:0,drawYear:0,inline:i,dpDiv:i?a(e("<div class='"+this._inlineClass+" ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all'></div>")):this.dpDiv}},_connectDatepicker:function(t,i){var a=e(t);i.append=e([]),i.trigger=e([]),a.hasClass(this.markerClassName)||(this._attachments(a,i),a.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp),this._autoSize(i),e.data(t,r,i),i.settings.disabled&&this._disableDatepicker(t))},_attachments:function(t,i){var a,s,n,r=this._get(i,"appendText"),o=this._get(i,"isRTL");i.append&&i.append.remove(),r&&(i.append=e("<span class='"+this._appendClass+"'>"+r+"</span>"),t[o?"before":"after"](i.append)),t.unbind("focus",this._showDatepicker),i.trigger&&i.trigger.remove(),a=this._get(i,"showOn"),("focus"===a||"both"===a)&&t.focus(this._showDatepicker),("button"===a||"both"===a)&&(s=this._get(i,"buttonText"),n=this._get(i,"buttonImage"),i.trigger=e(this._get(i,"buttonImageOnly")?e("<img/>").addClass(this._triggerClass).attr({src:n,alt:s,title:s}):e("<button type='button'></button>").addClass(this._triggerClass).html(n?e("<img/>").attr({src:n,alt:s,title:s}):s)),t[o?"before":"after"](i.trigger),i.trigger.click(function(){return e.datepicker._datepickerShowing&&e.datepicker._lastInput===t[0]?e.datepicker._hideDatepicker():e.datepicker._datepickerShowing&&e.datepicker._lastInput!==t[0]?(e.datepicker._hideDatepicker(),e.datepicker._showDatepicker(t[0])):e.datepicker._showDatepicker(t[0]),!1}))},_autoSize:function(e){if(this._get(e,"autoSize")&&!e.inline){var t,i,a,s,n=new Date(2009,11,20),r=this._get(e,"dateFormat");r.match(/[DM]/)&&(t=function(e){for(i=0,a=0,s=0;e.length>s;s++)e[s].length>i&&(i=e[s].length,a=s);return a},n.setMonth(t(this._get(e,r.match(/MM/)?"monthNames":"monthNamesShort"))),n.setDate(t(this._get(e,r.match(/DD/)?"dayNames":"dayNamesShort"))+20-n.getDay())),e.input.attr("size",this._formatDate(e,n).length)}},_inlineDatepicker:function(t,i){var a=e(t);a.hasClass(this.markerClassName)||(a.addClass(this.markerClassName).append(i.dpDiv),e.data(t,r,i),this._setDate(i,this._getDefaultDate(i),!0),this._updateDatepicker(i),this._updateAlternate(i),i.settings.disabled&&this._disableDatepicker(t),i.dpDiv.css("display","block"))},_dialogDatepicker:function(t,i,a,n,o){var h,l,u,d,c,p=this._dialogInst;return p||(this.uuid+=1,h="dp"+this.uuid,this._dialogInput=e("<input type='text' id='"+h+"' style='position: absolute; top: -100px; width: 0px;'/>"),this._dialogInput.keydown(this._doKeyDown),e("body").append(this._dialogInput),p=this._dialogInst=this._newInst(this._dialogInput,!1),p.settings={},e.data(this._dialogInput[0],r,p)),s(p.settings,n||{}),i=i&&i.constructor===Date?this._formatDate(p,i):i,this._dialogInput.val(i),this._pos=o?o.length?o:[o.pageX,o.pageY]:null,this._pos||(l=document.documentElement.clientWidth,u=document.documentElement.clientHeight,d=document.documentElement.scrollLeft||document.body.scrollLeft,c=document.documentElement.scrollTop||document.body.scrollTop,this._pos=[l/2-100+d,u/2-150+c]),this._dialogInput.css("left",this._pos[0]+20+"px").css("top",this._pos[1]+"px"),p.settings.onSelect=a,this._inDialog=!0,this.dpDiv.addClass(this._dialogClass),this._showDatepicker(this._dialogInput[0]),e.blockUI&&e.blockUI(this.dpDiv),e.data(this._dialogInput[0],r,p),this},_destroyDatepicker:function(t){var i,a=e(t),s=e.data(t,r);a.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),e.removeData(t,r),"input"===i?(s.append.remove(),s.trigger.remove(),a.removeClass(this.markerClassName).unbind("focus",this._showDatepicker).unbind("keydown",this._doKeyDown).unbind("keypress",this._doKeyPress).unbind("keyup",this._doKeyUp)):("div"===i||"span"===i)&&a.removeClass(this.markerClassName).empty())},_enableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!1,n.trigger.filter("button").each(function(){this.disabled=!1}).end().filter("img").css({opacity:"1.0",cursor:""})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().removeClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!1)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}))},_disableDatepicker:function(t){var i,a,s=e(t),n=e.data(t,r);s.hasClass(this.markerClassName)&&(i=t.nodeName.toLowerCase(),"input"===i?(t.disabled=!0,n.trigger.filter("button").each(function(){this.disabled=!0}).end().filter("img").css({opacity:"0.5",cursor:"default"})):("div"===i||"span"===i)&&(a=s.children("."+this._inlineClass),a.children().addClass("ui-state-disabled"),a.find("select.ui-datepicker-month, select.ui-datepicker-year").prop("disabled",!0)),this._disabledInputs=e.map(this._disabledInputs,function(e){return e===t?null:e}),this._disabledInputs[this._disabledInputs.length]=t)},_isDisabledDatepicker:function(e){if(!e)return!1;for(var t=0;this._disabledInputs.length>t;t++)if(this._disabledInputs[t]===e)return!0;return!1},_getInst:function(t){try{return e.data(t,r)}catch(i){throw"Missing instance data for this datepicker"}},_optionDatepicker:function(i,a,n){var r,o,h,l,u=this._getInst(i);return 2===arguments.length&&"string"==typeof a?"defaults"===a?e.extend({},e.datepicker._defaults):u?"all"===a?e.extend({},u.settings):this._get(u,a):null:(r=a||{},"string"==typeof a&&(r={},r[a]=n),u&&(this._curInst===u&&this._hideDatepicker(),o=this._getDateDatepicker(i,!0),h=this._getMinMaxDate(u,"min"),l=this._getMinMaxDate(u,"max"),s(u.settings,r),null!==h&&r.dateFormat!==t&&r.minDate===t&&(u.settings.minDate=this._formatDate(u,h)),null!==l&&r.dateFormat!==t&&r.maxDate===t&&(u.settings.maxDate=this._formatDate(u,l)),"disabled"in r&&(r.disabled?this._disableDatepicker(i):this._enableDatepicker(i)),this._attachments(e(i),u),this._autoSize(u),this._setDate(u,o),this._updateAlternate(u),this._updateDatepicker(u)),t)},_changeDatepicker:function(e,t,i){this._optionDatepicker(e,t,i)},_refreshDatepicker:function(e){var t=this._getInst(e);t&&this._updateDatepicker(t)},_setDateDatepicker:function(e,t){var i=this._getInst(e);i&&(this._setDate(i,t),this._updateDatepicker(i),this._updateAlternate(i))},_getDateDatepicker:function(e,t){var i=this._getInst(e);return i&&!i.inline&&this._setDateFromField(i,t),i?this._getDate(i):null},_doKeyDown:function(t){var i,a,s,n=e.datepicker._getInst(t.target),r=!0,o=n.dpDiv.is(".ui-datepicker-rtl");if(n._keyEvent=!0,e.datepicker._datepickerShowing)switch(t.keyCode){case 9:e.datepicker._hideDatepicker(),r=!1;break;case 13:return s=e("td."+e.datepicker._dayOverClass+":not(."+e.datepicker._currentClass+")",n.dpDiv),s[0]&&e.datepicker._selectDay(t.target,n.selectedMonth,n.selectedYear,s[0]),i=e.datepicker._get(n,"onSelect"),i?(a=e.datepicker._formatDate(n),i.apply(n.input?n.input[0]:null,[a,n])):e.datepicker._hideDatepicker(),!1;case 27:e.datepicker._hideDatepicker();break;case 33:e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 34:e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 35:(t.ctrlKey||t.metaKey)&&e.datepicker._clearDate(t.target),r=t.ctrlKey||t.metaKey;break;case 36:(t.ctrlKey||t.metaKey)&&e.datepicker._gotoToday(t.target),r=t.ctrlKey||t.metaKey;break;case 37:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?1:-1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?-e.datepicker._get(n,"stepBigMonths"):-e.datepicker._get(n,"stepMonths"),"M");break;case 38:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,-7,"D"),r=t.ctrlKey||t.metaKey;break;case 39:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,o?-1:1,"D"),r=t.ctrlKey||t.metaKey,t.originalEvent.altKey&&e.datepicker._adjustDate(t.target,t.ctrlKey?+e.datepicker._get(n,"stepBigMonths"):+e.datepicker._get(n,"stepMonths"),"M");break;case 40:(t.ctrlKey||t.metaKey)&&e.datepicker._adjustDate(t.target,7,"D"),r=t.ctrlKey||t.metaKey;break;default:r=!1}else 36===t.keyCode&&t.ctrlKey?e.datepicker._showDatepicker(this):r=!1;r&&(t.preventDefault(),t.stopPropagation())},_doKeyPress:function(i){var a,s,n=e.datepicker._getInst(i.target);return e.datepicker._get(n,"constrainInput")?(a=e.datepicker._possibleChars(e.datepicker._get(n,"dateFormat")),s=String.fromCharCode(null==i.charCode?i.keyCode:i.charCode),i.ctrlKey||i.metaKey||" ">s||!a||a.indexOf(s)>-1):t},_doKeyUp:function(t){var i,a=e.datepicker._getInst(t.target);if(a.input.val()!==a.lastVal)try{i=e.datepicker.parseDate(e.datepicker._get(a,"dateFormat"),a.input?a.input.val():null,e.datepicker._getFormatConfig(a)),i&&(e.datepicker._setDateFromField(a),e.datepicker._updateAlternate(a),e.datepicker._updateDatepicker(a))}catch(s){}return!0},_showDatepicker:function(t){if(t=t.target||t,"input"!==t.nodeName.toLowerCase()&&(t=e("input",t.parentNode)[0]),!e.datepicker._isDisabledDatepicker(t)&&e.datepicker._lastInput!==t){var i,a,n,r,o,h,l;i=e.datepicker._getInst(t),e.datepicker._curInst&&e.datepicker._curInst!==i&&(e.datepicker._curInst.dpDiv.stop(!0,!0),i&&e.datepicker._datepickerShowing&&e.datepicker._hideDatepicker(e.datepicker._curInst.input[0])),a=e.datepicker._get(i,"beforeShow"),n=a?a.apply(t,[t,i]):{},n!==!1&&(s(i.settings,n),i.lastVal=null,e.datepicker._lastInput=t,e.datepicker._setDateFromField(i),e.datepicker._inDialog&&(t.value=""),e.datepicker._pos||(e.datepicker._pos=e.datepicker._findPos(t),e.datepicker._pos[1]+=t.offsetHeight),r=!1,e(t).parents().each(function(){return r|="fixed"===e(this).css("position"),!r}),o={left:e.datepicker._pos[0],top:e.datepicker._pos[1]},e.datepicker._pos=null,i.dpDiv.empty(),i.dpDiv.css({position:"absolute",display:"block",top:"-1000px"}),e.datepicker._updateDatepicker(i),o=e.datepicker._checkOffset(i,o,r),i.dpDiv.css({position:e.datepicker._inDialog&&e.blockUI?"static":r?"fixed":"absolute",display:"none",left:o.left+"px",top:o.top+"px"}),i.inline||(h=e.datepicker._get(i,"showAnim"),l=e.datepicker._get(i,"duration"),i.dpDiv.zIndex(e(t).zIndex()+1),e.datepicker._datepickerShowing=!0,e.effects&&e.effects.effect[h]?i.dpDiv.show(h,e.datepicker._get(i,"showOptions"),l):i.dpDiv[h||"show"](h?l:null),e.datepicker._shouldFocusInput(i)&&i.input.focus(),e.datepicker._curInst=i))}},_updateDatepicker:function(t){this.maxRows=4,n=t,t.dpDiv.empty().append(this._generateHTML(t)),this._attachHandlers(t),t.dpDiv.find("."+this._dayOverClass+" a").mouseover();var i,a=this._getNumberOfMonths(t),s=a[1],r=17;t.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""),s>1&&t.dpDiv.addClass("ui-datepicker-multi-"+s).css("width",r*s+"em"),t.dpDiv[(1!==a[0]||1!==a[1]?"add":"remove")+"Class"]("ui-datepicker-multi"),t.dpDiv[(this._get(t,"isRTL")?"add":"remove")+"Class"]("ui-datepicker-rtl"),t===e.datepicker._curInst&&e.datepicker._datepickerShowing&&e.datepicker._shouldFocusInput(t)&&t.input.focus(),t.yearshtml&&(i=t.yearshtml,setTimeout(function(){i===t.yearshtml&&t.yearshtml&&t.dpDiv.find("select.ui-datepicker-year:first").replaceWith(t.yearshtml),i=t.yearshtml=null},0))},_shouldFocusInput:function(e){return e.input&&e.input.is(":visible")&&!e.input.is(":disabled")&&!e.input.is(":focus")},_checkOffset:function(t,i,a){var s=t.dpDiv.outerWidth(),n=t.dpDiv.outerHeight(),r=t.input?t.input.outerWidth():0,o=t.input?t.input.outerHeight():0,h=document.documentElement.clientWidth+(a?0:e(document).scrollLeft()),l=document.documentElement.clientHeight+(a?0:e(document).scrollTop());return i.left-=this._get(t,"isRTL")?s-r:0,i.left-=a&&i.left===t.input.offset().left?e(document).scrollLeft():0,i.top-=a&&i.top===t.input.offset().top+o?e(document).scrollTop():0,i.left-=Math.min(i.left,i.left+s>h&&h>s?Math.abs(i.left+s-h):0),i.top-=Math.min(i.top,i.top+n>l&&l>n?Math.abs(n+o):0),i},_findPos:function(t){for(var i,a=this._getInst(t),s=this._get(a,"isRTL");t&&("hidden"===t.type||1!==t.nodeType||e.expr.filters.hidden(t));)t=t[s?"previousSibling":"nextSibling"];return i=e(t).offset(),[i.left,i.top]},_hideDatepicker:function(t){var i,a,s,n,o=this._curInst;!o||t&&o!==e.data(t,r)||this._datepickerShowing&&(i=this._get(o,"showAnim"),a=this._get(o,"duration"),s=function(){e.datepicker._tidyDialog(o)},e.effects&&(e.effects.effect[i]||e.effects[i])?o.dpDiv.hide(i,e.datepicker._get(o,"showOptions"),a,s):o.dpDiv["slideDown"===i?"slideUp":"fadeIn"===i?"fadeOut":"hide"](i?a:null,s),i||s(),this._datepickerShowing=!1,n=this._get(o,"onClose"),n&&n.apply(o.input?o.input[0]:null,[o.input?o.input.val():"",o]),this._lastInput=null,this._inDialog&&(this._dialogInput.css({position:"absolute",left:"0",top:"-100px"}),e.blockUI&&(e.unblockUI(),e("body").append(this.dpDiv))),this._inDialog=!1)},_tidyDialog:function(e){e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")},_checkExternalClick:function(t){if(e.datepicker._curInst){var i=e(t.target),a=e.datepicker._getInst(i[0]);(i[0].id!==e.datepicker._mainDivId&&0===i.parents("#"+e.datepicker._mainDivId).length&&!i.hasClass(e.datepicker.markerClassName)&&!i.closest("."+e.datepicker._triggerClass).length&&e.datepicker._datepickerShowing&&(!e.datepicker._inDialog||!e.blockUI)||i.hasClass(e.datepicker.markerClassName)&&e.datepicker._curInst!==a)&&e.datepicker._hideDatepicker()}},_adjustDate:function(t,i,a){var s=e(t),n=this._getInst(s[0]);this._isDisabledDatepicker(s[0])||(this._adjustInstDate(n,i+("M"===a?this._get(n,"showCurrentAtPos"):0),a),this._updateDatepicker(n))},_gotoToday:function(t){var i,a=e(t),s=this._getInst(a[0]);this._get(s,"gotoCurrent")&&s.currentDay?(s.selectedDay=s.currentDay,s.drawMonth=s.selectedMonth=s.currentMonth,s.drawYear=s.selectedYear=s.currentYear):(i=new Date,s.selectedDay=i.getDate(),s.drawMonth=s.selectedMonth=i.getMonth(),s.drawYear=s.selectedYear=i.getFullYear()),this._notifyChange(s),this._adjustDate(a)},_selectMonthYear:function(t,i,a){var s=e(t),n=this._getInst(s[0]);n["selected"+("M"===a?"Month":"Year")]=n["draw"+("M"===a?"Month":"Year")]=parseInt(i.options[i.selectedIndex].value,10),this._notifyChange(n),this._adjustDate(s)},_selectDay:function(t,i,a,s){var n,r=e(t);e(s).hasClass(this._unselectableClass)||this._isDisabledDatepicker(r[0])||(n=this._getInst(r[0]),n.selectedDay=n.currentDay=e("a",s).html(),n.selectedMonth=n.currentMonth=i,n.selectedYear=n.currentYear=a,this._selectDate(t,this._formatDate(n,n.currentDay,n.currentMonth,n.currentYear)))},_clearDate:function(t){var i=e(t);this._selectDate(i,"")},_selectDate:function(t,i){var a,s=e(t),n=this._getInst(s[0]);i=null!=i?i:this._formatDate(n),n.input&&n.input.val(i),this._updateAlternate(n),a=this._get(n,"onSelect"),a?a.apply(n.input?n.input[0]:null,[i,n]):n.input&&n.input.trigger("change"),n.inline?this._updateDatepicker(n):(this._hideDatepicker(),this._lastInput=n.input[0],"object"!=typeof n.input[0]&&n.input.focus(),this._lastInput=null)},_updateAlternate:function(t){var i,a,s,n=this._get(t,"altField");n&&(i=this._get(t,"altFormat")||this._get(t,"dateFormat"),a=this._getDate(t),s=this.formatDate(i,a,this._getFormatConfig(t)),e(n).each(function(){e(this).val(s)}))},noWeekends:function(e){var t=e.getDay();return[t>0&&6>t,""]},iso8601Week:function(e){var t,i=new Date(e.getTime());return i.setDate(i.getDate()+4-(i.getDay()||7)),t=i.getTime(),i.setMonth(0),i.setDate(1),Math.floor(Math.round((t-i)/864e5)/7)+1},parseDate:function(i,a,s){if(null==i||null==a)throw"Invalid arguments";if(a="object"==typeof a?""+a:a+"",""===a)return null;var n,r,o,h,l=0,u=(s?s.shortYearCutoff:null)||this._defaults.shortYearCutoff,d="string"!=typeof u?u:(new Date).getFullYear()%100+parseInt(u,10),c=(s?s.dayNamesShort:null)||this._defaults.dayNamesShort,p=(s?s.dayNames:null)||this._defaults.dayNames,m=(s?s.monthNamesShort:null)||this._defaults.monthNamesShort,f=(s?s.monthNames:null)||this._defaults.monthNames,g=-1,v=-1,y=-1,b=-1,_=!1,k=function(e){var t=i.length>n+1&&i.charAt(n+1)===e;return t&&n++,t},x=function(e){var t=k(e),i="@"===e?14:"!"===e?20:"y"===e&&t?4:"o"===e?3:2,s=RegExp("^\\d{1,"+i+"}"),n=a.substring(l).match(s);if(!n)throw"Missing number at position "+l;return l+=n[0].length,parseInt(n[0],10)},D=function(i,s,n){var r=-1,o=e.map(k(i)?n:s,function(e,t){return[[t,e]]}).sort(function(e,t){return-(e[1].length-t[1].length)});if(e.each(o,function(e,i){var s=i[1];return a.substr(l,s.length).toLowerCase()===s.toLowerCase()?(r=i[0],l+=s.length,!1):t}),-1!==r)return r+1;throw"Unknown name at position "+l},w=function(){if(a.charAt(l)!==i.charAt(n))throw"Unexpected literal at position "+l;l++};for(n=0;i.length>n;n++)if(_)"'"!==i.charAt(n)||k("'")?w():_=!1;else switch(i.charAt(n)){case"d":y=x("d");break;case"D":D("D",c,p);break;case"o":b=x("o");break;case"m":v=x("m");break;case"M":v=D("M",m,f);break;case"y":g=x("y");break;case"@":h=new Date(x("@")),g=h.getFullYear(),v=h.getMonth()+1,y=h.getDate();break;case"!":h=new Date((x("!")-this._ticksTo1970)/1e4),g=h.getFullYear(),v=h.getMonth()+1,y=h.getDate();break;case"'":k("'")?w():_=!0;break;default:w()}if(a.length>l&&(o=a.substr(l),!/^\s+/.test(o)))throw"Extra/unparsed characters found in date: "+o;if(-1===g?g=(new Date).getFullYear():100>g&&(g+=(new Date).getFullYear()-(new Date).getFullYear()%100+(d>=g?0:-100)),b>-1)for(v=1,y=b;;){if(r=this._getDaysInMonth(g,v-1),r>=y)break;v++,y-=r}if(h=this._daylightSavingAdjust(new Date(g,v-1,y)),h.getFullYear()!==g||h.getMonth()+1!==v||h.getDate()!==y)throw"Invalid date";return h},ATOM:"yy-mm-dd",COOKIE:"D, dd M yy",ISO_8601:"yy-mm-dd",RFC_822:"D, d M y",RFC_850:"DD, dd-M-y",RFC_1036:"D, d M y",RFC_1123:"D, d M yy",RFC_2822:"D, d M yy",RSS:"D, d M y",TICKS:"!",TIMESTAMP:"@",W3C:"yy-mm-dd",_ticksTo1970:1e7*60*60*24*(718685+Math.floor(492.5)-Math.floor(19.7)+Math.floor(4.925)),formatDate:function(e,t,i){if(!t)return"";var a,s=(i?i.dayNamesShort:null)||this._defaults.dayNamesShort,n=(i?i.dayNames:null)||this._defaults.dayNames,r=(i?i.monthNamesShort:null)||this._defaults.monthNamesShort,o=(i?i.monthNames:null)||this._defaults.monthNames,h=function(t){var i=e.length>a+1&&e.charAt(a+1)===t;return i&&a++,i},l=function(e,t,i){var a=""+t;if(h(e))for(;i>a.length;)a="0"+a;return a},u=function(e,t,i,a){return h(e)?a[t]:i[t]},d="",c=!1;if(t)for(a=0;e.length>a;a++)if(c)"'"!==e.charAt(a)||h("'")?d+=e.charAt(a):c=!1;else switch(e.charAt(a)){case"d":d+=l("d",t.getDate(),2);break;case"D":d+=u("D",t.getDay(),s,n);break;case"o":d+=l("o",Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate()).getTime()-new Date(t.getFullYear(),0,0).getTime())/864e5),3);break;case"m":d+=l("m",t.getMonth()+1,2);break;case"M":d+=u("M",t.getMonth(),r,o);break;case"y":d+=h("y")?t.getFullYear():(10>t.getYear()%100?"0":"")+t.getYear()%100;break;case"@":d+=t.getTime();break;case"!":d+=1e4*t.getTime()+this._ticksTo1970;break;case"'":h("'")?d+="'":c=!0;break;default:d+=e.charAt(a)}return d},_possibleChars:function(e){var t,i="",a=!1,s=function(i){var a=e.length>t+1&&e.charAt(t+1)===i;return a&&t++,a};for(t=0;e.length>t;t++)if(a)"'"!==e.charAt(t)||s("'")?i+=e.charAt(t):a=!1;else switch(e.charAt(t)){case"d":case"m":case"y":case"@":i+="0123456789";break;case"D":case"M":return null;case"'":s("'")?i+="'":a=!0;break;default:i+=e.charAt(t)}return i},_get:function(e,i){return e.settings[i]!==t?e.settings[i]:this._defaults[i]},_setDateFromField:function(e,t){if(e.input.val()!==e.lastVal){var i=this._get(e,"dateFormat"),a=e.lastVal=e.input?e.input.val():null,s=this._getDefaultDate(e),n=s,r=this._getFormatConfig(e);try{n=this.parseDate(i,a,r)||s}catch(o){a=t?"":a}e.selectedDay=n.getDate(),e.drawMonth=e.selectedMonth=n.getMonth(),e.drawYear=e.selectedYear=n.getFullYear(),e.currentDay=a?n.getDate():0,e.currentMonth=a?n.getMonth():0,e.currentYear=a?n.getFullYear():0,this._adjustInstDate(e)}},_getDefaultDate:function(e){return this._restrictMinMax(e,this._determineDate(e,this._get(e,"defaultDate"),new Date))},_determineDate:function(t,i,a){var s=function(e){var t=new Date;return t.setDate(t.getDate()+e),t},n=function(i){try{return e.datepicker.parseDate(e.datepicker._get(t,"dateFormat"),i,e.datepicker._getFormatConfig(t))}catch(a){}for(var s=(i.toLowerCase().match(/^c/)?e.datepicker._getDate(t):null)||new Date,n=s.getFullYear(),r=s.getMonth(),o=s.getDate(),h=/([+\-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g,l=h.exec(i);l;){switch(l[2]||"d"){case"d":case"D":o+=parseInt(l[1],10);break;case"w":case"W":o+=7*parseInt(l[1],10);break;case"m":case"M":r+=parseInt(l[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r));break;case"y":case"Y":n+=parseInt(l[1],10),o=Math.min(o,e.datepicker._getDaysInMonth(n,r))}l=h.exec(i)}return new Date(n,r,o)},r=null==i||""===i?a:"string"==typeof i?n(i):"number"==typeof i?isNaN(i)?a:s(i):new Date(i.getTime());return r=r&&"Invalid Date"==""+r?a:r,r&&(r.setHours(0),r.setMinutes(0),r.setSeconds(0),r.setMilliseconds(0)),this._daylightSavingAdjust(r)},_daylightSavingAdjust:function(e){return e?(e.setHours(e.getHours()>12?e.getHours()+2:0),e):null},_setDate:function(e,t,i){var a=!t,s=e.selectedMonth,n=e.selectedYear,r=this._restrictMinMax(e,this._determineDate(e,t,new Date));e.selectedDay=e.currentDay=r.getDate(),e.drawMonth=e.selectedMonth=e.currentMonth=r.getMonth(),e.drawYear=e.selectedYear=e.currentYear=r.getFullYear(),s===e.selectedMonth&&n===e.selectedYear||i||this._notifyChange(e),this._adjustInstDate(e),e.input&&e.input.val(a?"":this._formatDate(e))},_getDate:function(e){var t=!e.currentYear||e.input&&""===e.input.val()?null:this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return t},_attachHandlers:function(t){var i=this._get(t,"stepMonths"),a="#"+t.id.replace(/\\\\/g,"\\");t.dpDiv.find("[data-handler]").map(function(){var t={prev:function(){e.datepicker._adjustDate(a,-i,"M")},next:function(){e.datepicker._adjustDate(a,+i,"M")},hide:function(){e.datepicker._hideDatepicker()},today:function(){e.datepicker._gotoToday(a)},selectDay:function(){return e.datepicker._selectDay(a,+this.getAttribute("data-month"),+this.getAttribute("data-year"),this),!1},selectMonth:function(){return e.datepicker._selectMonthYear(a,this,"M"),!1},selectYear:function(){return e.datepicker._selectMonthYear(a,this,"Y"),!1}};e(this).bind(this.getAttribute("data-event"),t[this.getAttribute("data-handler")])})},_generateHTML:function(e){var t,i,a,s,n,r,o,h,l,u,d,c,p,m,f,g,v,y,b,_,k,x,D,w,T,M,S,N,C,A,P,I,F,j,H,E,z,L,O,R=new Date,W=this._daylightSavingAdjust(new Date(R.getFullYear(),R.getMonth(),R.getDate())),Y=this._get(e,"isRTL"),J=this._get(e,"showButtonPanel"),$=this._get(e,"hideIfNoPrevNext"),Q=this._get(e,"navigationAsDateFormat"),B=this._getNumberOfMonths(e),K=this._get(e,"showCurrentAtPos"),V=this._get(e,"stepMonths"),U=1!==B[0]||1!==B[1],G=this._daylightSavingAdjust(e.currentDay?new Date(e.currentYear,e.currentMonth,e.currentDay):new Date(9999,9,9)),q=this._getMinMaxDate(e,"min"),X=this._getMinMaxDate(e,"max"),Z=e.drawMonth-K,et=e.drawYear;if(0>Z&&(Z+=12,et--),X)for(t=this._daylightSavingAdjust(new Date(X.getFullYear(),X.getMonth()-B[0]*B[1]+1,X.getDate())),t=q&&q>t?q:t;this._daylightSavingAdjust(new Date(et,Z,1))>t;)Z--,0>Z&&(Z=11,et--);for(e.drawMonth=Z,e.drawYear=et,i=this._get(e,"prevText"),i=Q?this.formatDate(i,this._daylightSavingAdjust(new Date(et,Z-V,1)),this._getFormatConfig(e)):i,a=this._canAdjustMonth(e,-1,et,Z)?"<a class='ui-datepicker-prev ui-corner-all' data-handler='prev' data-event='click' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>":$?"":"<a class='ui-datepicker-prev ui-corner-all ui-state-disabled' title='"+i+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"e":"w")+"'>"+i+"</span></a>",s=this._get(e,"nextText"),s=Q?this.formatDate(s,this._daylightSavingAdjust(new Date(et,Z+V,1)),this._getFormatConfig(e)):s,n=this._canAdjustMonth(e,1,et,Z)?"<a class='ui-datepicker-next ui-corner-all' data-handler='next' data-event='click' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+s+"</span></a>":$?"":"<a class='ui-datepicker-next ui-corner-all ui-state-disabled' title='"+s+"'><span class='ui-icon ui-icon-circle-triangle-"+(Y?"w":"e")+"'>"+s+"</span></a>",r=this._get(e,"currentText"),o=this._get(e,"gotoCurrent")&&e.currentDay?G:W,r=Q?this.formatDate(r,o,this._getFormatConfig(e)):r,h=e.inline?"":"<button type='button' class='ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all' data-handler='hide' data-event='click'>"+this._get(e,"closeText")+"</button>",l=J?"<div class='ui-datepicker-buttonpane ui-widget-content'>"+(Y?h:"")+(this._isInRange(e,o)?"<button type='button' class='ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all' data-handler='today' data-event='click'>"+r+"</button>":"")+(Y?"":h)+"</div>":"",u=parseInt(this._get(e,"firstDay"),10),u=isNaN(u)?0:u,d=this._get(e,"showWeek"),c=this._get(e,"dayNames"),p=this._get(e,"dayNamesMin"),m=this._get(e,"monthNames"),f=this._get(e,"monthNamesShort"),g=this._get(e,"beforeShowDay"),v=this._get(e,"showOtherMonths"),y=this._get(e,"selectOtherMonths"),b=this._getDefaultDate(e),_="",x=0;B[0]>x;x++){for(D="",this.maxRows=4,w=0;B[1]>w;w++){if(T=this._daylightSavingAdjust(new Date(et,Z,e.selectedDay)),M=" ui-corner-all",S="",U){if(S+="<div class='ui-datepicker-group",B[1]>1)switch(w){case 0:S+=" ui-datepicker-group-first",M=" ui-corner-"+(Y?"right":"left");break;case B[1]-1:S+=" ui-datepicker-group-last",M=" ui-corner-"+(Y?"left":"right");break;default:S+=" ui-datepicker-group-middle",M=""}S+="'>"}for(S+="<div class='ui-datepicker-header ui-widget-header ui-helper-clearfix"+M+"'>"+(/all|left/.test(M)&&0===x?Y?n:a:"")+(/all|right/.test(M)&&0===x?Y?a:n:"")+this._generateMonthYearHeader(e,Z,et,q,X,x>0||w>0,m,f)+"</div><table class='ui-datepicker-calendar'><thead>"+"<tr>",N=d?"<th class='ui-datepicker-week-col'>"+this._get(e,"weekHeader")+"</th>":"",k=0;7>k;k++)C=(k+u)%7,N+="<th"+((k+u+6)%7>=5?" class='ui-datepicker-week-end'":"")+">"+"<span title='"+c[C]+"'>"+p[C]+"</span></th>";for(S+=N+"</tr></thead><tbody>",A=this._getDaysInMonth(et,Z),et===e.selectedYear&&Z===e.selectedMonth&&(e.selectedDay=Math.min(e.selectedDay,A)),P=(this._getFirstDayOfMonth(et,Z)-u+7)%7,I=Math.ceil((P+A)/7),F=U?this.maxRows>I?this.maxRows:I:I,this.maxRows=F,j=this._daylightSavingAdjust(new Date(et,Z,1-P)),H=0;F>H;H++){for(S+="<tr>",E=d?"<td class='ui-datepicker-week-col'>"+this._get(e,"calculateWeek")(j)+"</td>":"",k=0;7>k;k++)z=g?g.apply(e.input?e.input[0]:null,[j]):[!0,""],L=j.getMonth()!==Z,O=L&&!y||!z[0]||q&&q>j||X&&j>X,E+="<td class='"+((k+u+6)%7>=5?" ui-datepicker-week-end":"")+(L?" ui-datepicker-other-month":"")+(j.getTime()===T.getTime()&&Z===e.selectedMonth&&e._keyEvent||b.getTime()===j.getTime()&&b.getTime()===T.getTime()?" "+this._dayOverClass:"")+(O?" "+this._unselectableClass+" ui-state-disabled":"")+(L&&!v?"":" "+z[1]+(j.getTime()===G.getTime()?" "+this._currentClass:"")+(j.getTime()===W.getTime()?" ui-datepicker-today":""))+"'"+(L&&!v||!z[2]?"":" title='"+z[2].replace(/'/g,"&#39;")+"'")+(O?"":" data-handler='selectDay' data-event='click' data-month='"+j.getMonth()+"' data-year='"+j.getFullYear()+"'")+">"+(L&&!v?"&#xa0;":O?"<span class='ui-state-default'>"+j.getDate()+"</span>":"<a class='ui-state-default"+(j.getTime()===W.getTime()?" ui-state-highlight":"")+(j.getTime()===G.getTime()?" ui-state-active":"")+(L?" ui-priority-secondary":"")+"' href='#'>"+j.getDate()+"</a>")+"</td>",j.setDate(j.getDate()+1),j=this._daylightSavingAdjust(j);S+=E+"</tr>"}Z++,Z>11&&(Z=0,et++),S+="</tbody></table>"+(U?"</div>"+(B[0]>0&&w===B[1]-1?"<div class='ui-datepicker-row-break'></div>":""):""),D+=S}_+=D}return _+=l,e._keyEvent=!1,_},_generateMonthYearHeader:function(e,t,i,a,s,n,r,o){var h,l,u,d,c,p,m,f,g=this._get(e,"changeMonth"),v=this._get(e,"changeYear"),y=this._get(e,"showMonthAfterYear"),b="<div class='ui-datepicker-title'>",_="";if(n||!g)_+="<span class='ui-datepicker-month'>"+r[t]+"</span>";else{for(h=a&&a.getFullYear()===i,l=s&&s.getFullYear()===i,_+="<select class='ui-datepicker-month' data-handler='selectMonth' data-event='change'>",u=0;12>u;u++)(!h||u>=a.getMonth())&&(!l||s.getMonth()>=u)&&(_+="<option value='"+u+"'"+(u===t?" selected='selected'":"")+">"+o[u]+"</option>");_+="</select>"}if(y||(b+=_+(!n&&g&&v?"":"&#xa0;")),!e.yearshtml)if(e.yearshtml="",n||!v)b+="<span class='ui-datepicker-year'>"+i+"</span>";else{for(d=this._get(e,"yearRange").split(":"),c=(new Date).getFullYear(),p=function(e){var t=e.match(/c[+\-].*/)?i+parseInt(e.substring(1),10):e.match(/[+\-].*/)?c+parseInt(e,10):parseInt(e,10);
return isNaN(t)?c:t},m=p(d[0]),f=Math.max(m,p(d[1]||"")),m=a?Math.max(m,a.getFullYear()):m,f=s?Math.min(f,s.getFullYear()):f,e.yearshtml+="<select class='ui-datepicker-year' data-handler='selectYear' data-event='change'>";f>=m;m++)e.yearshtml+="<option value='"+m+"'"+(m===i?" selected='selected'":"")+">"+m+"</option>";e.yearshtml+="</select>",b+=e.yearshtml,e.yearshtml=null}return b+=this._get(e,"yearSuffix"),y&&(b+=(!n&&g&&v?"":"&#xa0;")+_),b+="</div>"},_adjustInstDate:function(e,t,i){var a=e.drawYear+("Y"===i?t:0),s=e.drawMonth+("M"===i?t:0),n=Math.min(e.selectedDay,this._getDaysInMonth(a,s))+("D"===i?t:0),r=this._restrictMinMax(e,this._daylightSavingAdjust(new Date(a,s,n)));e.selectedDay=r.getDate(),e.drawMonth=e.selectedMonth=r.getMonth(),e.drawYear=e.selectedYear=r.getFullYear(),("M"===i||"Y"===i)&&this._notifyChange(e)},_restrictMinMax:function(e,t){var i=this._getMinMaxDate(e,"min"),a=this._getMinMaxDate(e,"max"),s=i&&i>t?i:t;return a&&s>a?a:s},_notifyChange:function(e){var t=this._get(e,"onChangeMonthYear");t&&t.apply(e.input?e.input[0]:null,[e.selectedYear,e.selectedMonth+1,e])},_getNumberOfMonths:function(e){var t=this._get(e,"numberOfMonths");return null==t?[1,1]:"number"==typeof t?[1,t]:t},_getMinMaxDate:function(e,t){return this._determineDate(e,this._get(e,t+"Date"),null)},_getDaysInMonth:function(e,t){return 32-this._daylightSavingAdjust(new Date(e,t,32)).getDate()},_getFirstDayOfMonth:function(e,t){return new Date(e,t,1).getDay()},_canAdjustMonth:function(e,t,i,a){var s=this._getNumberOfMonths(e),n=this._daylightSavingAdjust(new Date(i,a+(0>t?t:s[0]*s[1]),1));return 0>t&&n.setDate(this._getDaysInMonth(n.getFullYear(),n.getMonth())),this._isInRange(e,n)},_isInRange:function(e,t){var i,a,s=this._getMinMaxDate(e,"min"),n=this._getMinMaxDate(e,"max"),r=null,o=null,h=this._get(e,"yearRange");return h&&(i=h.split(":"),a=(new Date).getFullYear(),r=parseInt(i[0],10),o=parseInt(i[1],10),i[0].match(/[+\-].*/)&&(r+=a),i[1].match(/[+\-].*/)&&(o+=a)),(!s||t.getTime()>=s.getTime())&&(!n||t.getTime()<=n.getTime())&&(!r||t.getFullYear()>=r)&&(!o||o>=t.getFullYear())},_getFormatConfig:function(e){var t=this._get(e,"shortYearCutoff");return t="string"!=typeof t?t:(new Date).getFullYear()%100+parseInt(t,10),{shortYearCutoff:t,dayNamesShort:this._get(e,"dayNamesShort"),dayNames:this._get(e,"dayNames"),monthNamesShort:this._get(e,"monthNamesShort"),monthNames:this._get(e,"monthNames")}},_formatDate:function(e,t,i,a){t||(e.currentDay=e.selectedDay,e.currentMonth=e.selectedMonth,e.currentYear=e.selectedYear);var s=t?"object"==typeof t?t:this._daylightSavingAdjust(new Date(a,i,t)):this._daylightSavingAdjust(new Date(e.currentYear,e.currentMonth,e.currentDay));return this.formatDate(this._get(e,"dateFormat"),s,this._getFormatConfig(e))}}),e.fn.datepicker=function(t){if(!this.length)return this;e.datepicker.initialized||(e(document).mousedown(e.datepicker._checkExternalClick),e.datepicker.initialized=!0),0===e("#"+e.datepicker._mainDivId).length&&e("body").append(e.datepicker.dpDiv);var i=Array.prototype.slice.call(arguments,1);return"string"!=typeof t||"isDisabled"!==t&&"getDate"!==t&&"widget"!==t?"option"===t&&2===arguments.length&&"string"==typeof arguments[1]?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i)):this.each(function(){"string"==typeof t?e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this].concat(i)):e.datepicker._attachDatepicker(this,t)}):e.datepicker["_"+t+"Datepicker"].apply(e.datepicker,[this[0]].concat(i))},e.datepicker=new i,e.datepicker.initialized=!1,e.datepicker.uuid=(new Date).getTime(),e.datepicker.version="1.10.3"})(jQuery);
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia IEEmulatorForMoz							  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Emulate some Internet Explorer methods in Mozilla							  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2007						  |
|-----------------------------------------------------------------------------|
| {No Dependencies}															  |
|-----------------------------------------------------------------------------|
| 2006-05-26 |V 1.0.0														  |
|			 |+ Emulate insertAdjacentHTML									  |
|-----------------------------------------------------------------------------|
| 2007-05-22 |V 1.0.1														  |
|			 |+ Emulate innerText(read only)								  |
|-----------------------------------------------------------------------------|
| Created 2006-05-26 | All changes are in the log above. | Updated 2007-05-22 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|WebProd - IEEmulatorForMoz - API Version 1.0.1	Copyright Askia © 1994-2007   |
\----------------------------------------------------------------------------*/

//Emulator of IE features
//Redefine some behaviour and method of HTMLElement
//To have a compatiblities with Internet Explorer

/* -----------------------------------------------
	Redefine some IE functions in the DOM of Mozilla (and others)
  ------------------------------------------------*/

///<summary>
///Insert the HTML code
///</summary>
///<param name="sWhere">Indicates the location of insertion</param>
///<param name="sHTML">HTML code which want to insert</param>
if (window.HTMLElement && !window.HTMLElement.prototype.insertAjacentHTML) {
	window.HTMLElement.prototype.insertAdjacentHTML = function (sWhere, sHTML) { 
		  var r = this.ownerDocument.createRange(); 

		  switch (String(sWhere).toLowerCase()) { 
			 case "beforebegin": 
				r.setStartBefore(this); 
				var df = r.createContextualFragment(sHTML); 
				this.parentNode.insertBefore(df, this); 
				break; 

			 case "afterbegin": 
				r.selectNodeContents(this); 
				r.collapse(true); 
				var df = r.createContextualFragment(sHTML); 
				this.insertBefore(df, this.firstChild); 
				break; 

			 case "beforeend": 
				r.selectNodeContents(this); 
				r.collapse(false); 
				var df = r.createContextualFragment(sHTML); 
				this.appendChild(df); 
				break; 

			 case "afterend": 
				r.setStartAfter(this); 
				var df = r.createContextualFragment(sHTML); 
				this.parentNode.insertBefore(df, this.nextSibling); 
				break; 
		  } 
	   };  
 }

 ///<summary>
 ///Redefines the innerText properties in the HTMLElement
 ///</summary>
if (window.HTMLElement && !window.HTMLElement.innerText && typeof window.HTMLElement.prototype.__defineGetter__ === 'function') {
	window.HTMLElement.prototype.__defineGetter__("innerText", function(){
		var r = this.ownerDocument.createRange(); 
		r.selectNodeContents(this); 
		return r.toString(); 
	});
}
  
// #End Redefine



/*----------------------------------------------------------------------------\
|							Askia Script Objects							  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| The AskiaScript is the main javascript library of Askia					  |
| It will manage integrate all needed javascript files of Askia				  |
|-----------------------------------------------------------------------------|
|							Copyright Askia � 1994-2017					  |
|-----------------------------------------------------------------------------|
| {No Dependencies}															  |
|-----------------------------------------------------------------------------|
| 2006-05-23 |V 1.0.0														  |
|			 |+ AUTO-LOAD THE RESOURCES										  |
|			 |	Load the Javascript files into the html page				  |
|			 |	Load the resources files of the Javascripts	(pictures...)	  |			
|-----------------------------------------------------------------------------|
| 2006-11-06 |V 1.1.0														  |
|			 |+ Add the management of custom control						  |
|-----------------------------------------------------------------------------|
| 2007-06-29 |V 1.0.1														  |
|			 |+ Add the cursor constants									  |
|-----------------------------------------------------------------------------|
| 2006-11-29 |V 1.1.0														  |
|			 |+ Add the XmlLoader object in the framework					  |
|			 |+ Management of Plug-Ins										  |
| 2007-01-11 |+ Corrrection: Block the previous of browser					  |
| 2007-11-13 |+ Add the ranking management into the default framework         |
| 2009-05-06 |+ Add management of Flash										  |
|			 |+ Add the urlEncode() urlDecode() format() methods		      |
|-----------------------------------------------------------------------------|
| 2009-10-20 |V 1.1.1														  |
|			 |+ Improve the management of versionning (files per version)     |
|			 |+ Change version: Calendar.js								      |
|-----------------------------------------------------------------------------|
| 2009-10-27 |V 1.1.2														  |
|			 |+ Change version: ToolTipText.js, Common.js, Ranking.js	      |
|-----------------------------------------------------------------------------|
| 2010-01-12 |V 1.1.3														  |
|			 |+ Add the event when the DOM is completly loaded			      |
|			 |+ Change version: Ranking.js									  |
|-----------------------------------------------------------------------------|
| 2010-02-19 |V 1.1.4														  |
|			 |+ For flash send init the itemCaption when there is one item in |
|			 | the loop														  |
|			 |+ Send the AllowDk to flash									  |
| 2010-03-24 |+ Fix a problem with the ranking button						  |
| 2010-04-15 |+ Load the plugin in the AskiaScript._onPageLoad method		  |
|-----------------------------------------------------------------------------|
| 2010-05-17 |V 1.1.5														  |
|			 |+ Filter list of response with the filter box					  |
|			 |+ Fix date validation with the new format 'MM/dd/yyyy'	      |
| 2010-06-02 |+ Fix Ranking button for FF and Chrome						  |
|-----------------------------------------------------------------------------|
| 2010-06-24 |V 1.1.6														  |
|			 |+ Add options in the filter list to hide responses by default	  |	
|			 |+ Add options in the filter list to search after n characters	  |
| 2010-06-25 |+ Fix: Retrieve the caption of responses in FF and Chrome		  |		
| 2010-06-28 |+ Fix: Problem with the flash and loop in IE					  |		
|-----------------------------------------------------------------------------|
| 2010-08-16 |V 1.1.7														  |
|			 |+ Fix issue with the ranking => doesn't display the right order |	
|-----------------------------------------------------------------------------|
| 2010-08-27 |V 1.1.8														  |
|			 |+ Fix ranking issue => doesn't display the label when post-back |
|-----------------------------------------------------------------------------|
| 2010-12-20 |V 1.1.9														  |
|			 |+ Add jQuery in the scripts									  |
|			 |+ Add the form serializer										  |
|			 |+ Fix the filterBox with skin									  |
|			 |+ Fix the problem to load translation for calendar			  | 
|-----------------------------------------------------------------------------|
| 2011-05-10 |V 1.1.10														  |
|			 |+ Add regional settings for date and number					  |
| 2011-06-23 |+ Add regional settings for date and number					  |
|-----------------------------------------------------------------------------|
| 2011-01-20 |V 1.2.0														  |
|			 |+ Compatibilities with the new XHtml 1.0 generation			  |
|			 |+ AJAX queries for the live routing and dynamic label		      |
| 2011-05-24 |+ Add the chapters menu										  |
| 2012-02-06 |+ Add the flashFix.css, implements the class 'askia-touch'      |
| 2013-10-31 |+ Use the date-picker of jquery								  |
| 2015-01-23 |+ Add management of the start/stop recording for Web Cati       |
| 2015-03-17 |+ Deprecate the slider management                               |
|            |+ Deprecate the calendar management                             |
|            |+ Deprecate the tooltip management                              |
| 2015-03-18 |+ Remove the old loading way everything will be concatenate     |
| 2017-02-03 |+ Add PRG (Post-Redirect-Get) switch on load                    |
|-----------------------------------------------------------------------------|
| Created 2006-05-23 | All changes are in the log above. | Updated 2017-02-03 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|Askia - AskiaScript - API Version 1.2.0		Copyright Askia � 1994-2017  |
\---------------------------------------------------------------------------- */

/* -----
	Working on:
		Internet Explorer 			   [Tested on 6 / 7]
		NetScape (since the version 6) [Tested on 6 / 7 / 8]
		Opera (since the version 7)	   [Tested on 7 / 8] (no calendar appear on version 7)
		FireFox						   [Tested on 1 / 2]

	Not working on: 
		Opera 3 / 5 / 6
		NetScape 4 
		
----- */


/* ====
	Set-up browser checks and add emulator
==== */
var isOpera   = /opera|opera/i.test(navigator.userAgent);
var isIE	  = !isOpera && /msie/i.test(navigator.userAgent);			// preventing opera to be identified as ie
var isMozilla = !isIE && !isOpera && /mozilla\/5/i.test(navigator.userAgent);	// preventing opera to be identified as mz
var isNS6	  = isMozilla && /Netscape6/i.test(navigator.userAgent);	


//Other constants
var UNDEFINED='undefined';

//Cursors
var CURSOR_WAIT="wait";

//Special keys of keyboard
var KEY_BACK=8;
var KEY_ENTER=13;
var KEY_PAGEUP=33;
var KEY_PAGEDOWN=34;
var KEY_END=35;
var KEY_HOME=36;
var KEY_LEFT=37;
var KEY_UP=38;
var KEY_RIGHT=39;
var KEY_DOWN=40;
var KEY_DEL=46;


//Files
var FILENAME_SETTINGS_XML='WebprodScript.xml';
var FOLDER_PLUGINS='PLUGINS';
var FOLDER_SKINS='SKINS';

// Default jQuery ui date
var uiDatePickerOptions = {
	dayNamesMin: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
};


var eAskiaClass = false; // To be sure that everything works with the version 1.1 which not have this variable
						 // Should be overwrite by the Common.js
/* ====
	AskiaScript object
====*/
var AskiaScript = {
	//GLOBAL PROPERTIES OF SURVEY
	intNameOfSurvey: '',
	extNameOfSurvey: '',
	languageId: null,

	//ARCHITECTURE OF SERVER
	pathOfResources: '../Resources/',
	pathOfScripts: '../Scripts/',
	pathSeparator: '/',
	//
	_addedStyleSheet: {},
	isLocal: false,

	startRecordingText: '&#9679;',
	startRecordingTitle: "Start recording",
	stopRecordingText: '&#9646;&#9646;',
	stopRecordingTitle: "Stop recording",
	waitRecordingText: "",
	waitRecordingTitle: "Please wait...",

	//LOAD THE DIFFERENT LIBRARIES
	load: function (version, local, prg) {
		this.isLocal = local;
		/* === Lock the previous button of browser === */
		if (!prg){
			// Legacy usage prior Post-Redirect-Get
			try {
				window.history.forward(1);
			}
			catch (ex) { /* Do nothing */ }
			try {
				window.addEventListener('onpageshow', function (e) {
					if (e.persisted){
						window.history.forward(1);
					}
				});
			}
			catch (ex) { /* Do nothing */ }
		} else {
			// Using Post-Redirect-Get
			try {
				window.onpageshow = function(event) {
					if (event.persisted) {
						window.location.reload();
					}
				};
				window.onunload = function() { };
			}
			catch(ex){/* Do nothing */}
		}

		//Manage the load page
		if (window.addEventListener) {
			window.addEventListener("load", function () {
				AskiaScript._onPageLoad();
			}, false);
		}
		this._isPageLoaded();

		//Search the separator of path :
		// '\' or '/' (local or web)
		this.pathSeparator = (this.pathOfScripts.indexOf(":\\") > 0) ? "\\" : "/";
		//Load the skin first
		if (this.skinName != '') {
			document.write('<script language="javascript" src="' + this.pathOfScripts + FOLDER_SKINS + this.pathSeparator + this.skinName + this.pathSeparator + this.skinName + '.js"></script>');
		}
		//At the end, add the scripts overwrite the translations
		//in all scripts
        // Use the new file format 'Translation.2057.js' for english
		if (this.languageId && this.languageId != '') {
			document.write('<script language="javascript" src="' + this.pathOfScripts + '/Translation.' + this.languageId + '.js"></script>');
		}

		//Add the minified CSS file
		this.addStyleSheet(this.pathOfScripts + 'WebprodScript.min.css');
	},
	//Indicates if the page is completly loaded
	isPageLoaded: false,
	_nextRequest: 1000,
	ajax: function (data) {
		if (AskiaScript.isLocal) {
			// Increment the request id
			this._nextRequest += 1;
			if (this._nextRequest > 9999) {
				this._nextRequest = 1000; // Reset it
			}

			// We have to send the query by chunk if the length of message is over 255 characters (avoid using window.navigate)
			var MAX_LENGTH = 200,
					MAX_CHUNK_LENGTH = 200,
					currentRequestId = this._nextRequest,
					chunk,
					chunks = [],
					begin = 0,
					end = MAX_CHUNK_LENGTH,
					i,
					l;

			if (data.length <= MAX_LENGTH) {
				window.location.href = "admsg_" + data;
				return;
			}

			if (currentRequestId != this._nextRequest) {
				return; // Abort when another request has sent
			}

			chunk = data.slice(begin, end);
			while (chunk.length) {
				chunks.push(chunk);
				begin = end;
				end = end + MAX_CHUNK_LENGTH;
				chunk = data.slice(begin, end);
			}

			if (currentRequestId != this._nextRequest) {
				return; // Abort when another request has sent
			}
			for (i = 0, l = chunks.length; i < l; i += 1) {
				if (currentRequestId != this._nextRequest) {
					return; // Abort when another request has sent
				}
				if (i === 0) {
					window.location.href = "adstart_" + currentRequestId + "_" + chunks.length + "_" + chunks[i];
				} else {
					window.location.href = "adchnk_" + currentRequestId + "_" + (i + 1) + "_" + chunks[i];
				}
			}
		} else {
			this.executingLiveRouting = true;
			this.reexecuteLiveRouting = false;
			$.ajax({
				url: window.location,
				type: "POST",
				dataType: "script",
				data: data,
				complete: function () {
					setTimeout(function () {
						AskiaScript.executingLiveRouting = false;
						if (AskiaScript.reexecuteLiveRouting) {
							AskiaScript.reexecuteLiveRouting = false;
							AskiaScript.executeLiveRouting();
						}
					}, 250);
				}
			});
		}
	},
	executingLiveRouting: false,
	reexecuteLiveRouting: false,
	executeLiveRouting: function () {
		if (!this.executingLiveRouting) {
			this.ajax(serializeForm("EvaluateRouting"));
		} else {
			this.reexecuteLiveRouting = true;
		}
	},
	//Fire when the page is loaded
	_onPageLoad: function () {
		this.isPageLoaded = true;

		//Management of questions when the page is loaded
		for (var i = 0; i < QuestionHandler.childNodes.length; i++) {
			if (QuestionHandler.childNodes[i].isSorted) {
				//Create ranking element after the page load
				QuestionHandler.childNodes[i]._rankingElt = new Ranking(QuestionHandler.childNodes[i].id, QuestionHandler.childNodes[i].rankStyle);
			}
		}

		//Initialize the live routing
		if (eAskiaClass && eAskiaClass.live) {
			// Execute it now
			var hasLive = false;
			for (var i = 0; i < QuestionHandler.childNodes.length; i++) {
				if (QuestionHandler.childNodes[i].isLive) {
					hasLive = true;
					break;
				}
			}
			if (hasLive) {
				AskiaScript.executeLiveRouting();
			}
		}

		// Initialize the start/stop recording for the webcati screen
		// Default wait recording text
		if (!this.waitRecordingText) {
			this.waitRecordingText = '<img border="0" src="' + this.pathOfScripts + 'images/loader.gif" alt="Loading..."/>';
		}
		$('.askia_recording')
			.html(AskiaScript.startRecordingText)
			.attr('title', AskiaScript.startRecordingTitle)
			.on('mousedown', function () {
				$(this).addClass('pressed');
			})
			.on('mouseup', function () {
				$(this).removeClass('pressed');
			})
			.on('click', function () {
				// First disabled the button until we receive feedback
				$(this)
					.attr('disabled', 'disabled')
					.html(AskiaScript.stopRecordingText)
					.attr('title', AskiaScript.stopRecordingTitle);
				// Send the query to start/stop recording
				window.navigate("admsg_Action=StartStopRecording&Position=" + $(this).attr('data-pos'));
			});



		//Execute all events when the page is completly loaded
		for (var i = 0; i < this._readyEvents.length; i++) {
			this._readyEvents[i]();
		}
	},
	//Add function to call when the page is ready to use
	addReadyEvent: function (oFunction) {
		this._readyEvents[this._readyEvents.length] = oFunction;
	},
	//Array of events fires when the page is ready to use
	_readyEvents: [],
	//Verify if the page is loaded or not
	_isPageLoaded: function () {
		if (!document.readyState || window.addEventListener) return;
		if (document.readyState == "complete") {
			//Load the plugins first
			PlugInHandler.load();
			//Load the rest
			setTimeout("AskiaScript._onPageLoad();", 500);
		}
		else
			setTimeout("AskiaScript._isPageLoaded();", 2);
	},
	//Name of skin use by default
	skinName: '',
	//Collection of skins initiliazed in the document
	//Use the name of skin to retrieve it into the collection
	skinsCollection: {},
	initSkin: function (name) {
		if (!this.skinsCollection[name]) return;
		if (this.skinsCollection[name].isInit) return;
		var oSkin = new Object();
		oSkin.name = name;
		oSkin.single = CustomControl.fromSkin(name, 'single');
		oSkin.multiple = CustomControl.fromSkin(name, 'multiple');
		//Load the stylesheet now
		if (this.skinsCollection[name].single.useClass || this.skinsCollection[name].multiple.useClass) {
			var cssLink = this.pathOfScripts + FOLDER_SKINS + this.pathSeparator + name + this.pathSeparator + name + '.css';
			this.addStyleSheet(cssLink, true);
		}
		oSkin.isInit = true;
		this.skinsCollection[name] = oSkin;
	},
	//Add style sheet into the document
	///<param name="onFly">Indicates if the stylesheet is added after the page load</param>
	addStyleSheet: function (fileName, onFly) {
		//Don't add a duplicate stylesheet
		if (this._addedStyleSheet[fileName]) return;
		if (!onFly) {
			document.write('<link rel="stylesheet" href="' + fileName + '">');
		}
		else {
			//Double the backslash
			var tmpBackSlash = "__tmp__backslash__";
			fileName = replace(fileName, '\\', tmpBackSlash);
			fileName = replace(fileName, tmpBackSlash, '\\\\');
			//Import the style
			var st = document.styleSheets[0];
			if (typeof (st.addImport) != UNDEFINED) {
				st.addImport(fileName);
			}
			else {
				st.insertRule("@import url(" + fileName + ");", st.cssRules.length);
				if (isNS6) {
					alert("You're browser not support the live importation of stylesheet.");
				}
			}
		}
		this._addedStyleSheet[fileName] = true;
	},
	//State of navigation
	isNavigationInit: false,

	//Init NavigatorHandler object
	initNavigation: function (isFirstInit) {
		if (this.isNavigationInit) return;
		if (this.initNavigation.__attemptsCount && !isFirstInit) return;

		//10 attempts (represent 5 seconds) to initialize the navigator
		if (!this.initNavigation.__attemptsCount) {
			this.initNavigation.__attemptsCount = 0;
		}
		if (this.initNavigation.__attemptsCount >= 10) return;
		try {
			NavigatorHandler.init();
			this.isNavigationInit = true;
		}
		catch (ex) {
			this.initNavigation.__attemptsCount++;
			setTimeout("AskiaScript.initNavigation(true);", 500);
		}
	},
	//Temporary stack of plug-in
	//Should be imported when the PlugInHandler is already loaded
	_tmpPlugInStack: [],

	//Import a plug-in
	loadPlugIn: function (plugInName) {
		AskiaScript._tmpPlugInStack[AskiaScript._tmpPlugInStack.length] = plugInName;
	},
	// Event when the state of recording change on cati web screen
	onRecordingStateChange: function (position, state, message) {
		var $el = $('.askia_recording[data-pos=' + position + ']');
		switch (state) {
			case 0: // Stopped
				$el.html(AskiaScript.startRecordingText)
					.removeClass('started')
					.removeClass('progress')
					.attr('title', AskiaScript.startRecordingTitle)
					.removeAttr('disabled');
				break;
			case 1: // Started
				$el.html(AskiaScript.stopRecordingText)
					.addClass('started')
					.removeClass('progress')
					.attr('title', AskiaScript.stopRecordingTitle)
					.removeAttr('disabled');
				break;
			case 2: // Progress (wait)
				$el.html(AskiaScript.waitRecordingText)
					.attr('title', (message || AskiaScript.waitRecordingTitle))
					.addClass('progress')
					.attr('disabled', 'disabled');
				break;
			case 99: // Error
				alert(message || "An unknown error was occured during the recording");
				break;
		}

	}
};

///<summary>
///Format text using the parameters
///</summary>
function serializeForm(action, additionalParameters) {
	var i, l, dt= new Date(), array = $("form").serializeArray();

	for (i = 0, l = array.length; i < l; i +=1) {
		if (array[i].name && (array[i].name === "Action" || array[i].name === "MfcISAPICommand")){
			array[i].value = action; //Replace the action
		}
	}

	if (additionalParameters && additionalParameters.length) {
		for (i = 0, l = additionalParameters.length; i < l; i += 1) {
			array.push(additionalParameters[i]);
		}
	}
	array.push({name : "dmy", value : dt.getUTCDay() + "" + dt.getUTCMilliseconds() });
	return $.param(array);
}

    
//Function to replace all characters of string
//Example of use : 
//replace("Text With Three Spaces"," ","_");
//Will return: "Text_With_Three_Spaces"
function replace(text,match,replacement){
		var sReturn=text;
		if (match=='')return sReturn;
		if (!text)return '';
		if (match==replacement)return sReturn;
		while(sReturn.indexOf(match)!=-1){
				sReturn=sReturn.replace(match,replacement);
			}
		return sReturn;
	}


/*global ActiveXObject, AskiaScript, replace, QuestionHandler, StringBuilder, ErrorStackItem */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia Error Messages Library					  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Collections of error messages 											  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| StringBuilder.js															  |
|-----------------------------------------------------------------------------|
| 2006-05-24 |V 1.0.0														  |
|			 |+ First version												  |
|-----------------------------------------------------------------------------|
| 2007-09-04 |V 1.0.1														  |
|			 |+ Add the onError event on the stack                            |
|            |+ add the onClear event on the stack                            |
|-----------------------------------------------------------------------------|
| 2007-01-12 |V 1.1.0														  |
|			 |+ New error message EMAIL_FORMAT_INVALID						  |
| 2009-04-13 |+ The error message can be added by the server side			  |
|-----------------------------------------------------------------------------|
| Created 2006-05-31 | All changes are in the log above. | Updated 2009-04-13 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|WebProd - ErrprMessages - API Version 1.1.0	Copyright Askia © 1994-2009   |
\----------------------------------------------------------------------------*/


/* ===
	Collection of error messages
===	*/
var ErrorReplacementString={
		QUESTION_CAPTION	: "%q",
		MIN					: "%min",
		MAX					: "%max",
		MAX_DEC				: "%dec",
		VALUE				: "%v"
	};
	
var ErrorMessages={
		RESPONSE_REQUIRE			: "A response is expected for question '" + ErrorReplacementString.QUESTION_CAPTION + "'." ,
		SEMI_OPEN_REQUIRE			: "You must specify a semi-open response",
		
		//Ranking question
		RANKING_DUPLICATE_VALUE		: "Rank " + ErrorReplacementString.VALUE + " has been given more than once for question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		RANKING_REQUIRE_VALUE		: "Rank " + ErrorReplacementString.VALUE + " is missing for question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		
		//Numeric
		NUMERIC_FORMAT_INVALID		: "The response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be numeric.",
		NUMERIC_VALUE_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be between " + ErrorReplacementString.MIN + " and " + ErrorReplacementString.MAX + ".",
		NUMERIC_MINIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be above " + ErrorReplacementString.MIN + ".",
		NUMERIC_MAXIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be under " + ErrorReplacementString.MAX + ".",
		INVALID_NUMBER_OF_DECIMAL	: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must have " + ErrorReplacementString.MAX_DEC + " maximum of decimals.",
		
		//Text
		TEXT_VALUE_INVALID			: "The number of characters for question '" + ErrorReplacementString.QUESTION_CAPTION + " must be between " + ErrorReplacementString.MIN + " and " + ErrorReplacementString.MAX + ".",
		TEXT_MINIMUM_INVALID		: "The minimum length of text is " + ErrorReplacementString.MIN + ".",
		TEXT_MAXIMUM_INVALID		: "The maximum length of text is " + ErrorReplacementString.MAX + ".",
		
		//Number of selected responses
		RESPONSES_SIZE_INVALID		   : "The number of responses must lie between " + ErrorReplacementString.MIN  + " and " + ErrorReplacementString.MAX + ".",
		RESPONSES_SIZE_MINIMUM_INVALID : "At least " + ErrorReplacementString.MIN + " responses require for the question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		RESPONSES_SIZE_MAXIMUM_INVALID : "The maximum number of responses is " + ErrorReplacementString.MAX + " to question '" + ErrorReplacementString.QUESTION_CAPTION + "'.",
		
		//Date
		DATE_FORMAT_INVALID			: "Please enter a valid date for question '" + ErrorReplacementString.QUESTION_CAPTION + "'.\n(Valid format is 'dd/MM/yyyy')",
		DATE_VALUE_INVALID			: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be between " + ErrorReplacementString.MIN + " and " + ErrorReplacementString.MAX + ".",
		DATE_MINIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be above " + ErrorReplacementString.MIN + ".",
		DATE_MAXIMUM_INVALID		: "Response to question '" + ErrorReplacementString.QUESTION_CAPTION + "' must be under " + ErrorReplacementString.MAX + ".",
		
		//Misc
		EMAIL_FORMAT_INVALID		: "Please enter a valid email address for question '" + ErrorReplacementString.QUESTION_CAPTION + "'."
	};
/* ===
	Mode of error displaying
=== */
var eErrorDisplayMode={
		/* Keep the two following values for the backcompatibilities*/
		none		:	0,
		alert		:	1,
		/* ------------- */		
		NONE		:	0,
		ONALERT		:	1
	};

/* === 
	Stack of error
===	*/
var ErrorStack={
		//Collections of item
		all				:	{},
		childNodes		:	[],
		
		//Settings 
		displayMode			:	eErrorDisplayMode.NONE,
		displayErrorOnAdd	:	true,
		
		//Add item in collections
		add				:	function(oQuestion,message,value){
				//The oQuestion can be the id of question or the question itself
				var MyQuestion=(isNaN(parseInt(oQuestion)))?oQuestion:QuestionHandler.all[oQuestion];
				
				//Add an item by question
				if (!this.all[MyQuestion.id]){
						this.all[MyQuestion.id]=new ErrorStackItem(MyQuestion);
						this.childNodes[this.childNodes.length]=this.all[MyQuestion.id];
					}
				if (!message){
						return this.all[MyQuestion.id];
					}
				//Add message in item
				this.all[MyQuestion.id].add(message,value);
				
				//Manage the error
				this._manageNewError(this.all[MyQuestion.id]);
				
				//Return item
				return this.all[MyQuestion.id];
			},
		
		//Manage the new item entry
		_manageNewError	: function(oErrorStackItem){
				var message=oErrorStackItem.lastMessage;
				if (this.displayErrorOnAdd){
						switch(this.displayMode){
								case eErrorDisplayMode.NONE:
									//No action
									break;
								case eErrorDisplayMode.ONALERT:
									//Show the message using the alert box
									alert(message);
									break;
							}
					}
				this.onError(oErrorStackItem);
			},
		//Fires when the error appear
		onError     :function(oErrorStatckItem){/* Raise Event*/},
		//Fires when the error stack item was clear for the question
		onClear     :function(oErrorStackItem) {/* Raise Event*/},		
		//Return all error messages in string format for alert
		toString	: function(){
				if (this.childNodes.length==0)return'';
				var strBuilder=new StringBuilder('');
				for (var i=0;i<this.childNodes.length;i++){
						if (this.childNodes[i].lastMessage=='')continue;
						strBuilder.append(this.childNodes[i].toString());
					}
				return strBuilder.toString();				
			},
		//Return all error messages in html string
		toHTML		: function(){
				if (this.childNodes.length==0)return'';
				var strBuilder=new StringBuilder('');
				for (var i=0;i<this.childNodes.length;i++){
						if (this.childNodes[i].lastMessage=='')continue;
						strBuilder.append(this.childNodes[i].toHTML());
					}
				return strBuilder.toString();
			},
			
		//Return true when there at least one message in the error stack
		hasError			: function(){
				var isMessage=false;
				for (var i=0;i<this.childNodes.length;i++){
						if (this.childNodes[i].childNodes.length>0){
								isMessage=true;
								break;
							}
					}
				return isMessage;
			}
	};
	
/* ===
	Item of ErrorStack object
=== */
//Constructor
function ErrorStackItem(oQuestion){
		this.id=oQuestion.id;
		this.question=oQuestion;
		this.childNodes=[];
		this.firstMessage="";
		this.lastMessage="";
	}
//Return the error in string format for alert
ErrorStackItem.prototype.toString=function(){
	if (this.lastMessage=='')return '';
		
	var strBuilder=new StringBuilder('');
	strBuilder.append(this.question.caption + '\n');
	for (var i=0;i<this.childNodes.length;i++){
			strBuilder.append('  . ' + this.childNodes[i] + '\n');
		}
	strBuilder.append('\n');
	return strBuilder.toString();
};
//Return the error as HTML string
ErrorStackItem.prototype.toHTML=function(){
	if (this.lastMessage=='')return '';
		
	var strBuilder=new StringBuilder('<ul>');
	strBuilder.append(this.question.caption);
	for (var i=0;i<this.childNodes.length;i++){
			strBuilder.append('<li>' + this.childNodes[i] + '</li>');
		}
	strBuilder.append('</ul>');
	return strBuilder.toString();
};	
//Add message in collection
ErrorStackItem.prototype.add=function(message,value){
	//Modify the message according to the question 
	if (this.question.min || (this.question.min==0))message=replace(message,ErrorReplacementString.MIN,this.question.min);
	if (this.question.max || (this.question.max==0))message=replace(message,ErrorReplacementString.MAX,this.question.max);	
	if (this.question.caption)message=replace(message,ErrorReplacementString.QUESTION_CAPTION,this.question.caption);
	if (this.question.decimalNumber)message=replace(message,ErrorReplacementString.MAX_DEC,this.question.decimalNumber);
	if (value)message=replace(message,ErrorReplacementString.VALUE,value);
		
	//Set the first and latest message
	if (this.childNodes.length==0)this.firstMessage=message;
	this.lastMessage=message;
		
	//Add in collection of message
	this.childNodes[this.childNodes.length]=message;
	return this.childNodes[this.childNodes.length-1];
};

//Clear all messages
ErrorStackItem.prototype.clear=function(){
	this.childNodes=[];
	this.firstMessage="";
	this.lastMessage="";
	ErrorStack.onClear(this);
};
/*global ActiveXObject, AskiaScript, eDateFormat, eQuestionType, eResponseId, ErrorMessages, ErrorStack, QuestionHandler, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia FieldValidator Objects					  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Validate the inputs														  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| Dependencies:																  |
|	+ AskiaScript.js														  |
|	+ Common.js																  |
|	+ ErrorMessages.js														  |
|-----------------------------------------------------------------------------|
| 2006-05-26 |V 1.0.0														  |
|			 |+ Validate the number	(double and integer)					  |
|			 |+ Validate the date											  |
|			 |+ Validate the require fields									  |
|			 |+ Validate the minimum and the maximum						  |
|-----------------------------------------------------------------------------|
| 2007-01-12 |V 1.1.0														  |
|			 |+ Validate the email											  |
|			 |+ Implement the custom validator using the regular expression	  |
|			 |+ Correction in date validator for external use (open question) |
|-----------------------------------------------------------------------------|
| 2010-05-17 |V 1.1.7														  |
|			 |+ Change the date validation according to the new date format   |
|-----------------------------------------------------------------------------|
| 2011-05-16 |V 1.1.10														  |
|			 |+ Add regional settings for date and number					  |
|			 |+ Don't validate the date anymore								  |
|-----------------------------------------------------------------------------|
| 2015-03-17 |V 1.2.0                                                         |
|			 |+ Deprecate the slider management								  |
|            |+ Deprecate old calenader management                            |
|-----------------------------------------------------------------------------|
| Created 2006-05-26 | All changes are in the log above. | Updated 2015-03-17 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|WebProd - FieldValidator - API Version 1.2.0	Copyright Askia © 1994-2015   |
\----------------------------------------------------------------------------*/


/* ===
	Enumerator
===	*/
//Type of validation
var eValidationType={
		CUSTOM			: -1,
		NUMBER			: 1,
		TEXT			: 2,
		CLOSED			: 3,
		DATE			: 4,
		EMAIL			: 5
	};
	
//Replace string in the regular expression
var eRegExpReplacement={
		DECIMAL_CHARACTER		: "[DEC_CHAR]"
	};

//Collection of Regular expression
var eRegExpCollection={
		INTEGER			: /^\s*[-\+]?\d+\s*$/,
		DOUBLE			: "^\\s*([-\\+])?(\\d+)?(\\" + eRegExpReplacement.DECIMAL_CHARACTER  + "(\\d+))?\\s*$",
		DATE			: /^([0-9]{1,2}(?:\/|\.)[0-9]{1,2}(?:\/|\.)[0-9]{4}|[0-9]{4}-[0-9]{1,2}-[0-9]{1,2})$/,
		EMAIL			: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
	};
//Id of html element
var eValidatorElementId={
		SUMMARY_CONTAINER	:	'validationSummary',
		SUMMARY_FOCUS		:   '__dummyForFocus',
		ERROR_FIELD_PREFIX	:   'errorField'
	};
//Validation summary display mode
var eValidatorSummaryMode={
		NONE				: 0,
		ONALERT				: 1,
		ONCONTAINER			: 2
	};
	
/* ===
	ValidatorSummary object
===	*/
var ValidatorSummary={
		//State of html element
		isVisible		: false,
		
		//Mode of validator
		mode			: eValidatorSummaryMode.NONE,
		
		//Set the focus on the summary element
		focus			: function(){
					var dummyElt=document.getElementById(eValidatorElementId.SUMMARY_FOCUS);
					if (!dummyElt)return;
					dummyElt.style.display="block";
					dummyElt.focus();
					dummyElt.style.display="none";
			},
			
		//Validate all questions
		validate		: function(){
				var isOk=true;
				if(this.mode==eValidatorSummaryMode.NONE)return true;

				
				//Validate all questions 
				//(this action will put error into stack of error)
				for (var i=0;i<QuestionHandler.childNodes.length;i++){
						if (!QuestionHandler.childNodes[i].fieldValidator.validate(true)){
								isOk=false;
							}
					}
				
				if (!isOk)
					this.display();
				else 
					this.hide();	
		
				//Return the state of validation
				return isOk;
			},
		
		//Show the summary
		display		: function(){	
				if (this.mode==eValidatorSummaryMode.NONE)return;
				if (this.mode==eValidatorSummaryMode.ONALERT){
						alert(ErrorStack.toString());
						return;
					}
				//Try to find the validator summary container
				var summaryElt=document.getElementById(eValidatorElementId.SUMMARY_CONTAINER);
				//Write errors in html element which contain the summary of errors
				if (summaryElt){
						var sDummyElt='<input type="text" id="' + eValidatorElementId.SUMMARY_FOCUS + '" style="border:none;background:transparency;font-size:0.1pt;width:0.1pt;height:0.1pt">';
						summaryElt.innerHTML=sDummyElt + ErrorStack.toHTML();
						summaryElt.style.display="block";	
						//Set the focus on dummy element to display the summary of error
						//if the summary is not already visible
						if (!this.isVisible)this.focus();
						//Change the state of summary		
						this.isVisible=true;								
					}
			},
		
		//Hide the summary
		hide		: function(){		
				if (this.mode==eValidatorSummaryMode.NONE || this.mode==eValidatorSummaryMode.ONALERT)return;
				var summaryElt=document.getElementById(eValidatorElementId.SUMMARY_CONTAINER);
				
				//Hide the summary of error
				if (summaryElt){
						summaryElt.innerHTML="";
						summaryElt.style.display="none";				
					}
				this.isVisible=false;
			}
	};

/* ===
	FieldValidator object
=== */
//Constructor
function FieldValidator(oQuestion){
		//Collection of validator
		this.all={};
		this.childNodes=[];
		
		//Set the general properties
		this.question=oQuestion || null;
		
		//Search the validator type
		switch (oQuestion.type){
				//Numeric question
				case eQuestionType.numeric:
					this.add(new Validator(eValidationType.NUMBER));
					break;
				//Closed question
				case eQuestionType.single:
				case eQuestionType.multiple:
					this.add(new Validator(eValidationType.CLOSED));
					//Semi-open
					if (oQuestion.isSemiOpen)this.add(new Validator(eValidationType.TEXT));
					break;
				//Open question
				case eQuestionType.open:
					this.add(new Validator(eValidationType.TEXT));
					break;	
				//Question date				
				case eQuestionType.date:
					this.add(new Validator(eValidationType.DATE));
					break;
			}
	}

//Add validator in the collections
FieldValidator.prototype.add=function(oValidator){	
	//Attach the parentNode into validator
	oValidator.parentNode=this;
		
	//Add them into collections
	this.all[oValidator.id]=oValidator;
	this.childNodes[this.childNodes.length]=this.all[oValidator.id];
		
	//Return the validator into collection
	return this.all[oValidator.id];
};

//Validate question using all validator in the collections
FieldValidator.prototype.validate=function(isOnSubmit){
	if (!this.question)return true;//Don't manage this type of error (should manage by the server-side)
		
	if (ValidatorSummary.isVisible)isOnSubmit=true;
		
	//Clear the ErrorStack of the current question
	if (ErrorStack.all[this.question.id])ErrorStack.all[this.question.id].clear();
	//Manage the error informations 
	//Don't display the alert after each message detection,
	//when we are on submit event
	ErrorStack.displayErrorOnAdd=(isOnSubmit)?false:true;
		
	//Execute all validations
	var isOk=true;
	for (var i=0;i<this.childNodes.length;i++){
			if (!this.childNodes[i].validate(isOnSubmit)){
					isOk=false;
					//If we are not onsubmit or when the ValidatorSummary is not visible 
					if (!isOnSubmit)return false;
				}
		}
		
	//Set the error fields
	var errorFields=document.getElementById(eValidatorElementId.ERROR_FIELD_PREFIX + this.question.id);
	if (errorFields)errorFields.style.visibility=(isOk)?"hidden":"visible";
		
	if (ValidatorSummary.isVisible){
			//Refresh the summary of error
			if (ErrorStack.hasError()){
					ValidatorSummary.display();
				}
			else {
					ValidatorSummary.hide();
				}
		}

	return isOk;
};

/* === 
	Validator object
=== */
//Constructor
function Validator(oValidationType,message,oRegExp){
		//Search the new id of this validator
		if (!Validator.__increment_id)Validator.__increment_id=0;
		Validator.__increment_id++;
		
		//General properties
		this.id=Validator.__increment_id;
		this.type=oValidationType;
		this.regExp=oRegExp || null;
		this.message=message;
		this.parentNode=null;
	}
//Return the question concerned by the validation
Validator.prototype._getQuestion=function(){
	return this.parentNode.question;
};

//Validate the response of question
Validator.prototype.validate=function(isOnSubmit){
	switch(this.type){
			case eValidationType.NUMBER:
				return this._validateNumber(isOnSubmit);
				break;
			case eValidationType.CLOSED:
				return this._validateClosed(isOnSubmit);
				break;
			case eValidationType.TEXT:
				return this._validateText(isOnSubmit);
				break;	
			case eValidationType.DATE:
				return this._validateDate(isOnSubmit);
				break;
			case eValidationType.EMAIL:
				if (!this.message)this.message=ErrorMessages.EMAIL_FORMAT_INVALID;
				if (!this.regExp)this.regExp=eRegExpCollection.EMAIL;
				return this._validateText(isOnSubmit);
				break;
			case eValidationType.CUSTOM:
				if (this.regExp)return this._validateText(isOnSubmit);	
				break;
		}
	return true;
};

//Validate the number
Validator.prototype._validateNumber=function(isOnSubmit){
	var question=this._getQuestion();
	if (!question)return true;		   //Don't manage this type of error (should manage by the server-side)
	var response=question.childNodes[0];
	if (!response)return true;		   //Don't manage this type of error (should manage by the server-side)

	var number=response.htmlControl.value;
		
	//When the number is empty and the question not allowed the non answer
	if (number== "" && !question.isAllowDk) {
			ErrorStack.add(question, ErrorMessages.RESPONSE_REQUIRE);
			return false;
		}
	//When the data is empty and the question allowed the non-answer : return true
	if (number == "" && question.isAllowDk)return true;
		
	//Validate the number
	if (!this._isNumber(number,question.decimalNumber))return false;
		
	//Replace coma by point
	number +='';
	number=replace(number,',','.');
						
	//Validate the minimum and the maximum value		
	var isMinOk=true;
	var hasMinimum=question.min || (parseFloat(question.min)==0);
		if (hasMinimum)isMinOk=(parseFloat(number)<parseFloat(question.min))?false:true;
	var isMaxOk=true;
	var hasMaximum=question.max || (parseFloat(question.max)==0);
		if (hasMaximum)isMaxOk=(parseFloat(number)>parseFloat(question.max))?false:true;
			
	//Format the error messages according to min and max
	if (!isMinOk || !isMaxOk){
			var message=ErrorMessages.NUMERIC_VALUE_INVALID;
			if (hasMinimum  && !hasMaximum)message=ErrorMessages.NUMERIC_MINIMUM_INVALID;
			if (hasMaximum && !hasMinimum)message=ErrorMessages.NUMERIC_MAXIMUM_INVALID;
			ErrorStack.add(question,message);
			return false;
		}			

	//At this stage return true
	return true;
};
	
//Validate if the entry is a number 
Validator.prototype._isNumber=function(number,numberOfDecimal){
	var question=this._getQuestion();
		
	//Validate the format of number
	if (numberOfDecimal==0){
			if (!eRegExpCollection.INTEGER.test(number)){
					ErrorStack.add(question,ErrorMessages.NUMERIC_FORMAT_INVALID);
					return false; 
					}
		}
	else {
			//Try first with "." as decimal character
			var sDecChar='.';
			var sRegExpPoint=replace(eRegExpCollection.DOUBLE,eRegExpReplacement.DECIMAL_CHARACTER,sDecChar);
			var oRegExpPoint=new RegExp(sRegExpPoint);
			if (!oRegExpPoint.test(number)){
					//Re-try with "," as decimal character
					sDecChar=',';
					var sRegExpComa=replace(eRegExpCollection.DOUBLE,eRegExpReplacement.DECIMAL_CHARACTER,sDecChar);
					var oRegExpComa=new RegExp(sRegExpComa);
					if (!oRegExpComa.test(number)){
							ErrorStack.add(question,ErrorMessages.NUMERIC_FORMAT_INVALID);
							return false;
						}
				}
				
			//At this point we have retrieve the decimal character
			//Treat the number as string and count the decimal number
			number +=''; 
			var arrNumberPart=number.split(sDecChar);
			if (arrNumberPart.length>1){
					var decPart=arrNumberPart[1]+'';
					if (decPart.length>question.decimalNumber){
							ErrorStack.add(question,ErrorMessages.INVALID_NUMBER_OF_DECIMAL);
							return false;
						}
				}
			//Replace decimal character to have a valid number
			if (sDecChar!='.')number=replace(number,sDecChar,'.');
		}
			
	//At this stage return true
	return true;		
};
	
//Validate the closed question
Validator.prototype._validateClosed=function(isOnSubmit){
	var question=this._getQuestion();
	if (!question)return true; //Don't manage this type of error (should manage by the server-side)
		
	//Don't validate the single question after each hit
	if (question.type==eQuestionType.single && !isOnSubmit)return true;
		
	//Manage the select box
	if (question.isUseList && question.type==eQuestionType.single){
			if (question.isAllowDk && question.childNodes[0].htmlControl.value==0)return true;
			if (!question.isAllowDk && question.childNodes[0].htmlControl.value==0){
					ErrorStack.add(question, ErrorMessages.RESPONSE_REQUIRE);
					return false;
				}
			//At this stage return true for the list
			return true;
		}
		
	//If the question is empty return true when it allow don't know
	if (question.isAllowDk && question._selRespByIndex.length==0)return true;
		
	//Validate if the question have a value when we are on submit
	if (!question.isAllowDk && isOnSubmit){
			if (question._selRespByIndex.length==0){		
					ErrorStack.add(question, ErrorMessages.RESPONSE_REQUIRE);							
					return false;
				}
		}
		
		
	//Validate the minimum and the maximum of selection 
	//if there are not exclusive answer
	if (question._selRespByIndex[0]){
			if (question._selRespByIndex[0].isExclusive)return true;
		}
			
	//Validate the ranking question
	if (question.isRanking){
			var oAnswers={
					length	:1
				};
			for (var i=0;i<question._selRespByIndex.length;i++){
					var n=question._selRespByIndex[i].htmlControl.value;
					if (!this._isNumber(n,0))return false;
						
					//Verify the maximum
					if (question.max){
							var isMaxOk=(n>question.max)?false:true;
							if (!isMaxOk){
									ErrorStack.add(question,ErrorMessages.RESPONSES_SIZE_MAXIMUM_INVALID);
									return false;
								}
						}
					//Validate if there are duplicate answers
					if (oAnswers[n]){
							ErrorStack.add(question,ErrorMessages.RANKING_DUPLICATE_VALUE,n);
							return false;
						}
					oAnswers[n]=true;
					oAnswers.length++;
				}
			//if there are the hole in the responses
			if (isOnSubmit){
				for (var i=1;i<oAnswers.length;i++){
						if (!oAnswers[i]){
								ErrorStack.add(question,ErrorMessages.RANKING_REQUIRE_VALUE,i);
								return false;
							}
					}
				}
		}
		
	var length=question._selRespByIndex.length;
	var isMinOk=true;
	//Only check the minimum value on submition
	if (question.min && isOnSubmit)isMinOk=(length<question.min)?false:true;
	var isMaxOk=true;
	if (question.max)isMaxOk=(length>question.max)?false:true;
	//Don't return false, when we are not on submit event
	if (!isOnSubmit && !isMinOk)return true;
		
	//Format the error messages according to min and max
	if (!isMinOk || !isMaxOk){
			var message=ErrorMessages.RESPONSES_SIZE_INVALID;
			if (question.min && !question.max)message=ErrorMessages.RESPONSES_SIZE_MINIMUM_INVALID;
			if (question.max && !question.min)message=ErrorMessages.RESPONSES_SIZE_MAXIMUM_INVALID;
			ErrorStack.add(question,message);
			return false;
		}	
		
	//At this stage return true
	return true;
};
//Validate the text
Validator.prototype._validateText=function(isOnSubmit){
	//Validate the text
	var question=this._getQuestion();
	if (!question)return true;		//Don't manage this type of error (should manage by the server-side)
		
	var text="";
	var isAllowDk=true;
	var min=0;
	var max=0;

	if (!question.isSemiOpen){
			//Validate the question with the textbox
			if (question.type!=eQuestionType.open && question.type!=eQuestionType.numeric && question.type!=eQuestionType.date)return true;
			var response=question.childNodes[0];
			if (!response)return true	;//Don't manage this type of error (should manage by the server-side)
			text=response.htmlControl.value;
			isAllowDk=question.isAllowDk;
			min=question.min;
			max=question.max;
		}
	else {
			if (!question._canValidateSemiOpen && !isOnSubmit)return true;
			if (!question.isUseList){
					if (!question.isSorted && !question.all[eResponseId.semiOpen].htmlControl.checked)return true;
					if (question.isSorted && question.all[eResponseId.semiOpen].htmlControl.value=='')return true;		
				}
			else {
					if (question.childNodes[0].htmlControl.value!=eResponseId.semiOpen)return true;
				}
			var response=question._semiOpenResponse;
			if (!response)return true	;//Don't manage this type of error (should manage by the server-side)
			text=response.htmlControl.value;
			isAllowDk=question.isAllowEmptySemiOpen;
			min=question.minSemiOpen;
			max=question.maxSemiOpen;				
		}
			
	if (!this.regExp)
		return this._validateTextWithArgs(text,isAllowDk,min,max,isOnSubmit);
	else
		return this._validateTextWithRegExp(text,isAllowDk,isOnSubmit);
		
	//At this stage return true
	return true;
};
Validator.prototype._validateTextWithArgs=function(text,isAllowDk,min,max,isOnSubmit){
	var question=this._getQuestion();
		
	//When the text is empty and the question not allowed the non answer
	if (text == "" && !isAllowDk) {
			message=(!question.isSemiOpen)?ErrorMessages.RESPONSE_REQUIRE:ErrorMessages.SEMI_OPEN_REQUIRE;
			ErrorStack.add(question, message);		
			return false;
		}
	//When the text is empty and the question allowed the non-answer : return true
	if (text == "" && isAllowDk)return true; 		
		
	//Verify the minimum and the maximum length
	var isMinOk=true;
	if (min)isMinOk=(text.length<min)?false:true;
		
	var isMaxOk=true;			
	if (max)isMaxOk=(text.length>max)?false:true;
		
	//Format the error messages according to min and max
	if (!isMinOk || !isMaxOk){
			var message=ErrorMessages.TEXT_VALUE_INVALID;
			if (min && !max)message=ErrorMessages.TEXT_MINIMUM_INVALID;
			if (max && !min)message=ErrorMessages.TEXT_MAXIMUM_INVALID;
			ErrorStack.add(question,message);
			return false;
		}
			
	//At this stage return true
	return true;
};

//Validate the text using the regular expression
Validator.prototype._validateTextWithRegExp=function(text,isAllowDk,isOnSubmit){	
	//When the text is empty and the question allowed the non-answer : return true
	if (text=="" && isAllowDk)return true; 
		
	//Validate the format using the regular expression
	if (!this.regExp.test(text)){
			if (this.message){
					var question=this._getQuestion();
					ErrorStack.add(question,this.message);
				}
			return false; 
		}

	//At this stage return true
	return true;		
};
	
//Validate the date
Validator.prototype._validateDate=function(isOnSubmit){
	//Validate the date
	//If the format is invalid add the message in stack of error
	var question=this._getQuestion();
	if (!question)return true;		//Don't manage this type of error (should manage by the server-side)
		
	var date="";
	if (!question.isSemiOpen){
			//Validate the question with the textbox
			if (question.type!=eQuestionType.open && question.type!=eQuestionType.numeric && question.type!=eQuestionType.date)return true;
			var response=question.childNodes[0];
			if (!response)return true	;//Don't manage this type of error (should manage by the server-side)
			date=response.htmlControl.value;
		}
	else {
			if (!question._canValidateSemiOpen && !isOnSubmit)return true;
			if (!question.isUseList){
					if (!question.isSorted && !question.all[eResponseId.semiOpen].htmlControl.checked)return true;
					if (question.isSorted && question.all[eResponseId.semiOpen].htmlControl.value=='')return true;		
				}
			else {
					if (question.childNodes[0].htmlControl.value!=eResponseId.semiOpen)return true;
				}
			var response=question._semiOpenResponse;
			if (!response)return true	;//Don't manage this type of error (should manage by the server-side)
			date=response.htmlControl.value;
		}
			
	//When the date is empty and the question not allowed the non answer
	if (date == "" && !question.isAllowDk && question.type==eQuestionType.date) {
			ErrorStack.add(question, ErrorMessages.RESPONSE_REQUIRE);		
			return false;
		}
			
	//When the date is empty and the question allowed the non-answer : return true
	if (date == "" && (question.isAllowDk || question.type!=eQuestionType.date))return true; 

	return true;
};
//Return true if the response is on format date (dd/MM/yyyy)
Validator.prototype._isDate=function(date){		
	//Test using the regular expression to validate if the format
	//is valid date format
	if (!eRegExpCollection.DATE.test(date)) return false; 
  
	//Split the string
	var arrDate=date.split(/[\/\.-]/gi);
	if (arrDate.length!=3)return false;
		
	// Search from the AskiaScript
	var sFormat = (AskiaScript.regional && AskiaScript.regional.dateFormat) ? AskiaScript.regional.dateFormat : 'MM/dd/yyyy';
	var arrFormat=sFormat.split(/[\/\.-]/gi);
	var eFormat={
		day		: 'dd',
		month   : 'MM',
		year	: 'yyyy'
	};
	var oIndex={
			day		: 1,
			month	: 0,
			year	: 2
		};
	for (var i=0;i<arrFormat.length;i++){
			switch(arrFormat[i]){
					case eFormat.day:
						oIndex.day=i;
						break;
					case eFormat.month:
						oIndex.month=i;
						break;
					case eFormat.year:
						oIndex.year=i;					
						break;
				}
		}


	var mm	 = arrDate[oIndex.month]; // Month 
	var dd	 = arrDate[oIndex.day]; // Day
	var yyyy = arrDate[oIndex.year]; // Year 
		
	//Validate the day and month
	if (dd<1 || dd > 31)return false;
	if (mm <1 || mm > 12)return false;
				
	//Searcn the number of day of the year
	//Bissextil year can divide by 4 and not a siecle, or can divide by 400 
	var feb=(((yyyy % 4 == 0) && (yyyy % 100 !=0)) || (yyyy % 400 == 0))?29:28;
		  
	//Number of days for each months
	var arrNumbeOfDays= [31,feb,31,30,31,30,31,31,30,31,30,31]; 
		
	//If the day for the month is reached return false
	if (dd >arrNumbeOfDays[mm -1])return false;
		
	//Finally return true
	return true;
};


	
/*global ActiveXObject, AskiaScript, FOLDER_SKINS, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia CustomControl Scripts						  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| This file will manage the custom control instead of the classical input     |
| This object can be affected on the question or responses					  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| Dependencies:																  |
|  + AskiaScript.js															  |
|  + Common.js																  |
|-----------------------------------------------------------------------------|
| 2006-11-06 |V 1.0.0														  |
|			 |+ FIRST VERSION												  |
|			 |	> Manage the image for the custom control					  |
|			 |  > Manage the class for the custom control					  |
|-----------------------------------------------------------------------------|
| Created 2006-11-06 | All changes are in the log above. | Updated 2006-05-23 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|Askia - CustomControl - API Version 1.0.0		Copyright Askia © 1994-2006   |
\----------------------------------------------------------------------------*/

//Enumerates the name of pictures
var eCustomControlImgName={
    single      : {
            on      :   'RadioOn.png',
            off     :   'RadioOff.png',
            over    :   'RadioOver.png',
            press   :   'RadioPress.png'
        },
    multiple    : {
            on      :   'CheckOn.png',
            off     :   'CheckOff.png',
            over    :   'CheckOver.png',
            press   :   'CheckPress.png'        
        }
};
//Enumerates the class
var eCustomControlClassName={
    single      : {
            on      :   'single-on',
            off     :   'single-off',
            over    :   'single-over',
            press   :   'single-press'
        },
    multiple    : {
            on      :   'multiple-on',
            off     :   'multiple-off',
            over    :   'multiple-over',
            press   :   'multiple-press'        
        }
};
///<summary>
///Handler to all custom controls in screen
///</summary>
var CustomControlHandler={	
	//Collection of custom controls object
	all				: {},
	childNodes		: [],
	//Add controls into library
	add				: function(oCustomControl){
			if (this.all[oCustomControl.id])return this.all[oCustomControl.id];
				
			//Add control into the collection
			this.all[oCustomControl.id]=oCustomControl;
			this.childNodes[this.childNodes.length]=this.all[oCustomControl.id];
							
			//Return the control from the collection
			return this.all[oCustomControl.id];
		},
	//Collection of images
	images			: {},
	//Load the image
	loadImage		: function(fileName){	
			if (this.images[fileName])return;
			this.images[fileName]=new Image();
			this.images[fileName].src=fileName;
		}	
};
///<summary>
///Enumerates the state of element
///</summary>
var eCustomControlState={
        on              : 'on',
        off             : 'off',
        over            : 'over',
        press           : 'press',
        restore         : 'restore'
    };
    
///<summary>
///Behaviour of custom control
///</summary>
///<param name="on">Image/class or style when the response is selected</param>
///<param name="off">Image/class or style when the response is not selected</param>
///<param name="over">Image/class or style when the mouse is over the picture</param>
///<param name="press">Image/class or style when the mouse press the picture</param>
function CustomControlBehaviour(on,off,over,press){
        this.on =on;
        this.off=off;
        this.over=over || null;
        this.press=press || null;
        this.restore=off;
    }
///<summary>
///Returns the copy of object
///</summary>
CustomControlBehaviour.prototype.getCopy=function(){
    var sOn=this.on;
    var sOff=this.off;
    var sOver=this.over;
    var sPress=this.press;
    return new CustomControlBehaviour(sOn,sOff,sOver,sPress);
};
///<summary>
///Shared method to transform the string from arg to CustomControlBehaviour
///</summary>
///<param name="sArg">Argument</param>
///<param name="isSingle">Indicates if we speak about a single response</param>
CustomControlBehaviour.imageBehaviourFromArg=function(sArg,isSingle){
    if (!sArg)return null;
    if (sArg=="")return null;
    var arrProp=sArg.split(";");
    var props={};
    for (var i=0;i<arrProp.length;i++){
            var arrKeyVal=arrProp[i].split(">");
            if (arrKeyVal.length!=2)continue;
            var arrPaths=arrKeyVal[1].split("|");
            if (arrPaths.length!=2)continue;
            var pathImg=null;
            if (arrPaths[0]=="skin"){
                    var arrSkin=arrPaths[1].split(",");
                    if (arrSkin.length==1)arrSkin[1]="small"; 
                    pathImg=AskiaScript.pathOfScripts + FOLDER_SKINS + AskiaScript.pathSeparator + arrSkin[0]  + AskiaScript.pathSeparator + arrSkin[1] + AskiaScript.pathSeparator;
                    pathImg +=(isSingle)?eCustomControlImgName.single[arrKeyVal[0]]:eCustomControlImgName.multiple[arrKeyVal[0]];
                }
            if (arrPaths[0]=="custom"){
                    pathImg =arrPaths[1];   
                }
            if (!pathImg)continue;
            props[arrKeyVal[0]]=pathImg;
        }
        
    if (!props.on || !props.off)return null;
    return new CustomControlBehaviour(props.on,props.off,props.over,props.press).getCopy();
};
///<summary>
///Shared method to transform the string from arg to CustomControlBehaviour
///</summary>
///<param name="sArg">Argument</param>
///<param name="isSingle">Indicates if we speak about a single response</param>
CustomControlBehaviour.classBehaviourFromArg=function(sArg,isSingle){
    if (!sArg)return null;
    if (sArg=="")return null;
    var arrProp=sArg.split(";");
    var props={};
    for (var i=0;i<arrProp.length;i++){
            var arrKeyVal=arrProp[i].split(">");
            if (arrKeyVal.length!=2)continue;
            var arrClasses=arrKeyVal[1].split("|");
            if (arrClasses.length!=2)continue;
            var className=null;
            if (arrClasses[0]=="skin"){
                    var arrSkin=arrClasses[1].split(",");
                    if (arrSkin.length==1)arrSkin[1]="small"; 
                    var cssLink=AskiaScript.pathOfScripts + FOLDER_SKINS + AskiaScript.pathSeparator + arrSkin[0]  + AskiaScript.pathSeparator + arrSkin[1] + AskiaScript.pathSeparator + arrSkin[0] + '.css';
                    AskiaScript.addStyleSheet(cssLink,true);
                    className=arrSkin[0] + '-';
                    className +=(isSingle)?eCustomControlClassName.single[arrKeyVal[0]]:eCustomControlClassName.multiple[arrKeyVal[0]];
                }
            if (arrClasses[0]=="custom"){
                    className =arrClasses[1];   
                }
            if (!className)continue;
            props[arrKeyVal[0]]=className;
        }
    if (!props.on || !props.off)return null;
    return new CustomControlBehaviour(props.on,props.off,props.over,props.press).getCopy();
};  
///<summary>
///Shared method to transform the string from arg to CustomControlBehaviour
///</summary>
///<param name="sArg">Argument</param>
///<param name="isSingle">Indicates if we speak about a single response</param>
CustomControlBehaviour.styleBehaviourFromArg=function(sArg,isSingle){
    return null;
};      
///<summary>
///Creates a new instance of CustomControl object.
///Use this control instead of the classical input
///</summary>
///<param name="imageBehaviour">Image</param>
///<param name="classBehaviour">Class</param>
///<param name="styleBehaviour">[Not implemented yet]Style</param>
function CustomControl(id,imageBehaviour,classBehaviour,styleBehaviour){
		this.id=id;							//Id of custom controm
        this.imageBehaviour=imageBehaviour || null;
        this.classBehaviour=classBehaviour || null;
        this.styleBehaviour=styleBehaviour || null;
		
		//Preload the pictures
		if (this.imageBehaviour){
		        if (this.imageBehaviour.on)CustomControlHandler.loadImage(this.imageBehaviour.on);
		        if (this.imageBehaviour.off)CustomControlHandler.loadImage(this.imageBehaviour.off);
		        if (this.imageBehaviour.over)CustomControlHandler.loadImage(this.imageBehaviour.over);
		        if (this.imageBehaviour.press)CustomControlHandler.loadImage(this.imageBehaviour.press);
		    }
				
		this._htmlElts=[];//HTMLElement use by this control
				
		//Add the control into the collections
		CustomControlHandler.add[this];		
	}

///<summary>
///Shared method to transform a skin to custom control
///</summary>
///<param name="skinName">Name of skin</param>
///<param name="elementType">Single or multiple</param>
CustomControl.fromSkin=function(skinName,elementType){
    var s=AskiaScript.skinsCollection[skinName][elementType];
    //Prepare the image behaviour
    var img=null;
    if (s.useImage){
            var pathImg=AskiaScript.pathOfScripts + FOLDER_SKINS + AskiaScript.pathSeparator + skinName + AskiaScript.pathSeparator;
            var pOn=pathImg + eCustomControlImgName[elementType].on;
            var pOff=pathImg + eCustomControlImgName[elementType].off;
            var pOver=(s.useImageOver)?pathImg + eCustomControlImgName[elementType].over:null;
            var pPress=(s.useImagePress)?pathImg + eCustomControlImgName[elementType].press:null;
            img=new CustomControlBehaviour(pOn,pOff,pOver,pPress);
        }
    //Prepare the class behaviour
    var cl=null;
    if (s.useClass){
            var cOn=skinName + '-' + eCustomControlClassName[elementType].on;
            var cOff=skinName + '-' + eCustomControlClassName[elementType].off;
            var cOver=(s.useClassOver)?skinName + '-' + eCustomControlClassName[elementType].over:null;
            var cPress=(s.useClassPress)?skinName + '-' + eCustomControlClassName[elementType].press:null;
            cl=new CustomControlBehaviour(cOn,cOff,cOver,cPress);        
        }
        //Prepare the style behaviour
        var st=null;
        if (s.useStyle){/*Not implemented yet*/}
        return new CustomControl(skinName + '-' + elementType ,img,cl,st);
};
///<summary>	
///Returns the copy of current object
///</summary>
///<param name="id">Id of new element</param>
CustomControl.prototype.getCopy=function(id){
    var imgB=(this.imageBehaviour)?this.imageBehaviour.getCopy():null;
    var clB=(this.classBehaviour)?this.classBehaviour.getCopy():null;
    var stB=(this.styleBehaviour)?this.styleBehaviour.getCopy():null;
	var cCopy=new CustomControl(id,imgB,clB,stB);
	return cCopy;
};
///<summary>
///Set the HTMLElement use by the custom control
///</summary>
///<param name="oHTMLElements">Html element or collection of Html elements</param>
CustomControl.prototype.setHTMLElements=function(oHTMLElements){
	if (oHTMLElements.length && oHTMLElements.join){
		for (var i=0;i<oHTMLElements.length;i++){
				this._htmlElts[this._htmlElts.length]=oHTMLElements[i];
			}
		}
	else {
			this._htmlElts[this._htmlElts.length]=oHTMLElements;
		}
};
///<summary>
///Attach some events on response element
///</summary>
///<param name="oResponse">Response which use the control</param<
CustomControl.prototype.attachEventsOn=function(oResponse){
	if (!this._htmlElts)return;
	for (var i=0;i<this._htmlElts.length;i++){
		    //Manage the click
			this._htmlElts[i].onclick=function(){
				oResponse._isClickOnCell = (this.tagName.toLowerCase()!="input" && this.tagName.toLowerCase()!="img");
				var isHiddenCtrl=(oResponse.htmlControl.style.display.toLowerCase()=="none");
				if (oResponse._isPreventRecursiveEvents && !oResponse._isClickOnCell && isHiddenCtrl){
						return;
					}
				var isFireHtmlCtrlClick=true;
				if (oResponse._isPreventRecursiveEvents && oResponse.virtualControl)isFireHtmlCtrlClick=false;
				if (isFireHtmlCtrlClick){
						oResponse.htmlControl.click();
					}
				if (oResponse.virtualControl){
						oResponse.virtualControl.click();
					}
				oResponse._isClickOnCell=false;
			};
			//Manage the roll-over
			var isRollOver=false;
			if (this.imageBehaviour && this.imageBehaviour.over)isRollOver=true;
			if (this.classBehaviour && this.classBehaviour.over)isRollOver=true;
			if (isRollOver){
			        this._htmlElts[i].onmouseover=function(){
        			    oResponse.customControl.setState(eCustomControlState.over);
			        };
			        this._htmlElts[i].onmouseout=function(){
        			    oResponse.customControl.setState(eCustomControlState.restore);
			        };
			    }
            //Manage the press
            var isPress=false;
            if (this.imageBehaviour && this.imageBehaviour.press)isPress=true;
            if (this.classBehaviour && this.classBehaviour.press)isPress=true;
            if (isPress){
                    this._htmlElts[i].onmousedown=function(){
                        oResponse.customControl.setState(eCustomControlState.press);
                    };
                    this._htmlElts[i].onmouseup=function(){
                        oResponse.customControl.setState(eCustomControlState.restore);
                    };
                }
		}
};
///<summary>
///Set the state of control
///</summary>
///<param name="state">State of element</param>
CustomControl.prototype.setState=function(state){	
		if (!this._htmlElts)return;

		//Set the state into all html elements which use by the custom controls
		for (var i=0;i<this._htmlElts.length;i++){
			//Change the pictures
			if (this.imageBehaviour && this._htmlElts[i].tagName.toLowerCase()=="img"){						
			        var fileName=this.imageBehaviour[state];
					if (fileName){
					        if (!CustomControlHandler.images[fileName])CustomControlHandler.loadImage(fileName);
					        this._htmlElts[i].src=CustomControlHandler.images[fileName].src;
					        //Keep the state into the memory to restore it when there is a roll-over or other
					        if (state==eCustomControlState.on || state==eCustomControlState.off){
					                this.imageBehaviour.restore=fileName;
					            }
					    }
				}
			//Change the class (only for the text not for the image)
			if (this.classBehaviour && this._htmlElts[i].tagName.toLowerCase()!="img"){
					//Now add the class
					var className=this.classBehaviour[state];
					if (className){
					        //Clean the classes first
					        if (this.classBehaviour.on){
	    				            this._htmlElts[i].className=replace(this._htmlElts[i].className," " + this.classBehaviour.on,"");
    					            this._htmlElts[i].className=replace(this._htmlElts[i].className,this.classBehaviour.on,"");
					            }
					        if (this.classBehaviour.off){
					                this._htmlElts[i].className=replace(this._htmlElts[i].className," " + this.classBehaviour.off,"");
					                this._htmlElts[i].className=replace(this._htmlElts[i].className,this.classBehaviour.off,"");
					            }
					        if (this.classBehaviour.over){
					                this._htmlElts[i].className=replace(this._htmlElts[i].className," " + this.classBehaviour.over,"");
					                this._htmlElts[i].className=replace(this._htmlElts[i].className,this.classBehaviour.over,"");					
					            }
					        if (this.classBehaviour.press){
					                this._htmlElts[i].className=replace(this._htmlElts[i].className," " + this.classBehaviour.press,"");
					                this._htmlElts[i].className=replace(this._htmlElts[i].className,this.classBehaviour.press,"");										
					            }					
					        this._htmlElts[i].className += " " + className;				
			                //Keep the state into the memory to restore it when there is a roll-over or other
					        if (state==eCustomControlState.on || state==eCustomControlState.off){
					                this.classBehaviour.restore=className;
					            }					        
					    }
				}
			
			//Change the style (Not implement)
		}
	};
/*global ActiveXObject, AskiaScript, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia StringBuilder Objects						  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| StringBuilder object is use to optimized the concatenation of string		  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| Dependencies: No depencies												  |
|-----------------------------------------------------------------------------|
| 2006-04-04 |V 1.0.0														  |
|			 |+ Append data and build string								  |
|-----------------------------------------------------------------------------|
| Created 2006-04-04 | All changes are in the log above. | Updated 2006-04-04 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|WebProd - StringBuilder - API Version 1.0.0	Copyright Askia © 1994-2006   |
\----------------------------------------------------------------------------*/

// *** Constructor
//Can init the stringbuilder with a default text
function StringBuilder(text){
		this._arrString=new Array();
		this.length=0;
		if (text)this.append(text);
	}

// *** Public methods
//Add text for the concatenation
StringBuilder.prototype.append=function(text){
	this._arrString.push(text);
	this.length=this._arrString.length;
};
//Do the concatenation and return the string
//Can set the separator
StringBuilder.prototype.toString=function(separator){	
	if (!separator)separator="";
	var sResult=this._arrString.join(separator);
	return sResult;
};
//Re-initialize the stringbuilder content
StringBuilder.prototype.clear=function(){
	this._arrString=new Array();
	this.length=0;
};

/*------------------------------------------------------------------------------\
|							Askia Common Scripts								|
|-------------------------------------------------------------------------------|
|                          Created by Askia Company								|
|							(http://www.askia.com)								|
|-------------------------------------------------------------------------------|
| This file will manage the common object of Askia								|
| Questions/Responses etc...													|
|-------------------------------------------------------------------------------|
|							Copyright Askia (c) 1994-2010						|
|-------------------------------------------------------------------------------|
| Dependencies:																	|
|  + AskiaScript.js																|
|  + FieldsValidator.js															|
|  + ErrorMessages.js															|
|  + Calculator.js																|
|  + CustomControl.js															|
|-------------------------------------------------------------------------------|
|2006-05-23	|V 1.0.0															|
|			|+ FIRST VERSION													|
|			|	> Question object												|
|			|	> Response object												|
|			|  > Semi-open response management									|
|			|  > Exclusive response management									|
|			|  > Ranking management												|
|			|  > Question date management using calendar						|
|			|  > Numeric of single question using slider						|
|-------------------------------------------------------------------------------|
|2007-05-16	|V 1.0.1															|
|			|  > Fix: Search the exclusive information in virtual checkbox		|
|-------------------------------------------------------------------------------|
|2007-06-07	|V 1.0.2															|
|			| > Fix: Set the date today when there is no default date			|
|-------------------------------------------------------------------------------|
|2007-09-24	|V 1.0.3															|
|			| > Fix: Exclusive in FireFox										|
|-------------------------------------------------------------------------------|
|2006-11-06	|V 1.1.0															|
|			|	> Management of CustomControl									|
|2006-11-28	|	> Management of ranking output									|
|2007-01-08	|	> Manage the view of question									|
|2007-10-29	|  > Add setValue(values),removeValue(values),clearValues()		|
|           |  for the flash integration										|
|2009-04-12	|  > Improve for the flash integration								|
|           |  > Add property to retrieve the caption of items in loop			|
|2009-04-13 |  > Add methods to retrieve the caption of responses of loop		|
|2009-06-11 |  > Add the management of ranking with exclusive checkbox			|
|-------------------------------------------------------------------------------|
|2010-01-12	|V 1.1.2															|
|			|	> Fix: Don't add the skin element with ranking buttons			|
|-------------------------------------------------------------------------------|
|2010-01-14	|V 1.1.3															|
|			|	> Fix: For Flash integration don't found the responses caption	|
|			|		of loop in FF & Safari										|
|-------------------------------------------------------------------------------|
|2010-05-17	|V 1.1.5															|
|			|+ Filter list of response with the filter box						|
|2010-06-03	|+ Manage the "Don't know" answer for the non-closed question		|
|-------------------------------------------------------------------------------|
|2010-06-25	|V 1.1.6															|
|			|+ Fix problem with response caption in FF and chrome				|
|2010-06-28	|+ Fix problem with flash and loop in IE							|
|-------------------------------------------------------------------------------|
|2010-08-16	|V 1.1.7															|
|			|+ Fix issue with the ranking => doesn't display the right order	|
|-------------------------------------------------------------------------------|
|2010-08-27	|V 1.1.8															|
|			|+ Fix ranking issue => doesn't display the label when post-back	|
|-------------------------------------------------------------------------------|
|2010-12-20	|V 1.1.9															|
|			|+ Question/chapter caption send to flash with HTML encode			|
|-------------------------------------------------------------------------------|
|2011-01-20	|V 1.2.0															|
|			|+ Compatibilities with the new XHtml 1.0 generation				|
|2011-02-18 |+ Add setValuesById, setDk											|
|2012-03-08 |+ Don't fire the change on setValue when question doesn't change	|
|			|+ Fix a problem with the class askia-touch							|
|2012-06-30 |+ Using flash the onchange event is not fire						|
|2012-12-10 |+ Take in the account the double table created with the skin when  |
|           | show/hide a question												|
|2013-10-31 | + Use the jquery.ui.datepicker instead of calendar				|
|2014-02-04 | + Fix event.cancelBubble to allow websimulator to works			|
|2015-03-17 | + Deprecate the Slider management                             	|
|           | + Deprecate the Old Calendar management                           |
|           | + Take in account all text-like input not only 'text'             |
|           |   but also 'number', 'phone', 'color' etc...                     	|
|-------------------------------------------------------------------------------|
| Created 2006-05-23 | All changes are in the log above. | Updated 2015-03-17	|
|-------------------------------------------------------------------------------|
|														All rights reserved		|
|Askia - Common - API Version 1.2.0			Copyright Askia (C) 1994-2015		|
\-------------------------------------------------------------------------------*/

/* === Enumerator with the type of questions === */
var eQuestionType = {
	chapter			:	0,
	numeric			:	1,
	//numericDiscrete :2,
	//numericInterval :3,
	multiple		:	4,
	open			:	5,
	single			:   7,
	date			:	8
};

/* === Enumerator with the prefix of response controls === */
var eResponsePrefix = {
	chapter			:	'',
	numeric			:	'C',
	multiple		:	'M',
	open			:	'S',
	semiOpen		:   'O',
	single			:   'U',
	date			:	'D',
	virtualCheckbox	:   'chk',
	ranking			:   'R',
	listBox			:   'B',
	multipleList	:   'L',
	virtualButton	:   'btn',
	caption			:   'cpt',
	imgCustomControl:   'ccImg',
	rankingOutput	:   'rankingOutput',
	questionLabel	:	'qLbl',
	column			:	'col',
	filter			:	'filter'
};
	
/* === Enumerator of special id of responses === */
var eResponseId = {
	dontKnow		: '-1',
	semiOpen		: '-3'
};
	
/* === Enumerator of special html attributes === */
var eHTMLAttributes = {
	isExclusive			: 'isExclu',
	skinName			: 'skinName',
	calculationId		: 'calculationId',
	rankStyle           : 'rankStyle',
	isUseCustomControl  : 'isCustomCtrl',
	customControl		: 'customCtrl',
	imageBehaviour      : 'imageBehaviour',
	classBehaviour      : 'classBehaviour',
	styleBehaviour      : 'styleBehaviour'
};

/* === Enumerator for the different type of view === */
var eViewType = {
	show		: 1,
	hide		: 2,
	enable		: 3,
	disable		: 4
};

var eAskiaClass = {
	questionCaption	: "askia-caption",
	exclu			: "askia-exclusive",
	skin			: "askia-skin",
	rankButton		: "askia-ranking-button",
	rankList		: "askia-ranking-list",
	rankDragDrop	: "askia-ranking-dragdrop",
	rankLabel		: "askia-ranking-label",
	calculation		: "askia-calculation-", // Following by the id of the calculation
	live			: "askia-live"
};


/* === Handler to all questions in screen === */
var QuestionHandler = {
	//Collection of Questions
	all				: {},
	childNodes		: [],
		
	//Hashtable which content the indexes of element
	//which can retrieve using the shortcut
	indexesByShortcut: {},
		
	//Add Question into library
	add				: function (oQuestion) {
		//Don't add the duplicate object
		if (this.all[oQuestion.id]) {
			return this.all[oQuestion.id];
		}
				
		this.all[oQuestion.id] = oQuestion;
		this.childNodes[this.childNodes.length] = this.all[oQuestion.id];

		//Add the shortcut in the Hashtable
		if (!this.indexesByShortcut[oQuestion.shortcut]) {
			this.indexesByShortcut[oQuestion.shortcut] = [];
		}
		//Add an array of indexes in the hashtable
		var l = this.indexesByShortcut[oQuestion.shortcut].length;
		this.indexesByShortcut[oQuestion.shortcut][l] = this.childNodes.length - 1;
				
		//Add question in ErrorStack,
		//to have the error in order of question
		ErrorStack.add(this.all[oQuestion.id]);
				
		//Initialize the NavigatorHandler when it's not already done
		AskiaScript.initNavigation();
				
		//Return the question in the collection
		return this.all[oQuestion.id];
	},
			
	//Return the array of questions using the shortcut
	//When the question is not on the loop, it return the question
	getQuestionsByShortcut		: function (shortcut) {
		var arrShortCut = this.indexesByShortcut[shortcut];
		var arrQuestions = [];
		for (var i = 0; i < arrShortCut.length; i += 1) {
			arrQuestions[arrQuestions.length] = this.childNodes[arrShortCut[i]];
		}
				
		//Return the question or return the array of questions
		if (arrQuestions.length === 1) {
			return arrQuestions[0];
		} else {
			return arrQuestions;
		}
	},

	//Update the caption
	UpdateLiveCaption			: function (className, label) {
		$("." + className).html(label);
	},

	//Manage the click on the response (radio button or checkbox)
	click						: function (e) {
		if (!e) {
			e = window.event;
		}
		var htmlElt = this;
		var response = htmlElt._response;
		response.click(e);
	},

	//Manage the lost focused on the response (textbox)
	blur						: function (e) {
		if (!e) {
			e = window.event;
		}
		var htmlElt = this;
		var response = htmlElt._response;
		response.blur(e);
	},

	//Manage the selection on list box
	select						: function (e) {
		if (!e) {
			e = window.event;
		}
		var htmlElt = this;
		var response = htmlElt._response;
		response.select(e);
	},

	getQuestionCaptionElements : function (questionId) {
		var qLblId = eResponsePrefix.questionLabel + questionId, // 1.1
			qClass = eAskiaClass.questionCaption + questionId,   // 1.2
			arrElts = [];

		if (document.getElementById(qLblId)) { // 1.1
			return document.getElementById(qLblId);
		}

		// 1.2
		$("." + eAskiaClass.questionCaption + questionId).each(function () {
			arrElts.push(this);
		});

		if (arrElts.length) {
			return arrElts;
		}
	},

	//Get the caption HTMLElement (span)
	// Since 1.2.0, manage the id with and without space
	getCaptionElement			: function (questionId, responseId) {
		var cptId = eResponsePrefix.caption + questionId + " " + responseId; // 1.1
		if (document.getElementById(cptId)) {
			return document.getElementById(cptId);
		}
		cptId = eResponsePrefix.caption + questionId + "_" + responseId; // 1.2
		return document.getElementById(cptId);
	},

	//Get the column caption HTMLElement for the table
	// Since 1.2.0, manage the id with and without space
	getColumnCaptionElement			: function (questionId, responseId) {
		var colId = eResponsePrefix.column + questionId  + " " + responseId; // 1.1
		if (document.getElementById(colId)){
			return document.getElementById(colId);
		}
		colId = eResponsePrefix.column + questionId  + "_" + responseId; // 1.2
		return document.getElementById(colId);
	},

	//Indicates of the HTMLElement has a custom control attribute or class
	// Since 1.2.0
	hasCustomControl				: function (htmlElt) {
		if (htmlElt.getAttribute(eHTMLAttributes.isUseCustomControl)) {
			return htmlElt.getAttribute(eHTMLAttributes.isUseCustomControl);
		}
		return $(htmlElt).hasClass(eAskiaClass.skin);
	},

	//Indicates of the rankstyle of element
	// Since 1.2.0 search in the class too
	getRankType						: function (htmlElt) {
		if (htmlElt.getAttribute(eHTMLAttributes.rankStyle)) {
			return parseInt(htmlElt.getAttribute(eHTMLAttributes.rankStyle), 10);
		}
		if ($(htmlElt).hasClass(eAskiaClass.rankButton)) {
			return eRankingType.BUTTONS;
		}
		if ($(htmlElt).hasClass(eAskiaClass.rankDragDrop)) {
			return eRankingType.DRAG_DROP;
		}
		if ($(htmlElt).hasClass(eAskiaClass.rankList)) {
			return eRankingType.LISTS;
		}
		if ($(htmlElt).hasClass(eAskiaClass.rankLabel)) {
			return eRankingType.DISPLAY_ON_LABEL;
		}
		return eRankingType.NONE;
	},

	//Indicates of the ranking with label output element
	// Since 1.2.0 with " " or with "_"
	getRankingLabelElement				: function (htmlElt) {
		var output = document.getElementById(eResponsePrefix.rankingOutput + htmlElt.getAttribute("name"));
		if (output) {
			return output;
		}
		return document.getElementById(eResponsePrefix.rankingOutput + htmlElt.getAttribute("name").replace(/\s/gi, "_"));
	},


	//Indicates if the control is on the calculation group
	// Since 1.2.0 search in the CSS Class
	hasCalculation						: function (htmlElt) {
		if (htmlElt.getAttribute(eHTMLAttributes.calculationId)) {
			return true;
		}
		var classes = $(htmlElt).attr("class"), i, l;
		if (!classes) {
			return false;
		}
		return (classes.indexOf(eAskiaClass.calculation) !== -1);
	},

	//Get an array with the ids of calculation group
	//Since 1.2.0 search in the CSS class instead of the calculationFunction attribute
	getCalculationsIds					: function (htmlElt) {
		var str = '', arr = [];
		if (htmlElt.getAttribute(eHTMLAttributes.calculationId)) {
			str = htmlElt.getAttribute(eHTMLAttributes.calculationId);
			return str.split(";");
		}

		var classes = $(htmlElt).attr("class"), i, l;
		if (!classes) {
			return arr;
		}
		classes = classes.split(" ");
		for (i = 0, l = classes.length; i < l; i += 1) {
			if (classes[i].indexOf(eAskiaClass.calculation) !== -1) {
				arr.push(classes[i].replace(eAskiaClass.calculation, ""));
			}
		}
		return arr;
	},

    // Helper function to check if the input is not a radio button nor a checkbox
    isRadioOrCheckbox                   : function isRadioOrCheckbox(htmlElt) {
        return (htmlElt.getAttribute("type") === 'radio' || htmlElt.getAttribute("type") === 'checkbox');
    },

    // Helper function to check if the input is a text-like (text, number ...) all different than radio & checkbox
    isTextLike                            : function isTextLike(htmlElt) {
        return !QuestionHandler.isRadioOrCheckbox(htmlElt);
    }
};

/* === Question object === */
///<summary>
///Creates a new instance of Question object
///</summary>
///<param name="id">Id of question. This id is automatically generated by the AskiaExt</param>
///<param name="shortcut">Shortcut of question</param>
///<param name="caption">Caption of question</param>
///<param name="type">Type of question (see the eQuestionType)</param>
///<param name="isAllowDk">True when the question allow a blank response</param>
///<param name="isLive">True when there is a live routing to execute</param>
///<param name="min">Response minimum (length, number, date)</param>
///<param name="max">Response maximum (length, number, date)</param>
///<param name="defaultValue">Default value</param>
///<param name="decimalNumber">Number of decimal allowed</param>
function Question(id,shortcut,caption,type,isAllowDk,isLive,min,max,defaultValue,decimalNumber){
		//General properties
		this.id=id;								//Id of question
		this.type=eQuestionType.chapter || type; //Type of question
		this.shortcut=shortcut;					//Shortcut of question
		this.isClosed=this.type==eQuestionType.single || this.type==eQuestionType.multiple;
		this.caption=caption || '';				//Caption of question
		this.isSemiOpen=false;					//True when semi-open response
		this.isSorted=false;					//True when the responses are sorted
		this.isRanking=false;					//True when the style ranking is selected (textbox)
		this.isAllowDk=true;					//True when allow non-response
		if (isAllowDk==false)this.isAllowDk=false;
		this.isDkAnswer=false;					//True when there is a "Don't know" answer for the non-closed question
		this.isLive = false;
		if (isLive) {
			this.isLive = true;
		}

		//HTMLElement which content the caption of question
		this.questionLabel=null;
		
		//True when the response is on the list box
		this.isUseList=false;

		//
		this.min=min;									//Minimal value
		this.max=max;									//Maximal value
		this.defaultValue=defaultValue ||this.min;		//Default value
		//2007-06-07: Fix for question data, to have the date today when
		//there is no default date setted by default
		if (this.type==eQuestionType.date && !defaultValue)this.defaultValue=null;
		this.decimalNumber=decimalNumber || 0;
		//
		this.minSemiOpen=0;					//Minimal length of semi-open
		this.maxSemiOpen=0;					//Maximal length of semi-open
		this.isAllowEmptySemiOpen=false;	//True when allow non-response on semi-open
		
		//Collection of responses
		this.all={};							//Responses by id
		this.childNodes=[];						//Responses by index
		this._semiOpenResponse=null;			//Semi-open response-box
		//
		this._selRespById={};					//Selected responses by id
		this._selRespByIndex=[];				//Selected responses by index
		//
		this._excluRespById={};					//Exclusive responses by id
		this._excluRespByIndex=[];				//Exclusive responses by index
		
		//FieldValidator object
		this.fieldValidator=null;
		this._canValidateSemiOpen=false;		//True when the open text of semi-open can be validate
		
		//Prevent the change event
		this._preventChangeEvent = false;	// True when prevent the change event

		//Ranking layout
		this.rankStyle=eRankingType.NONE;   //Style of ranking
		
		//Ids of Calculation which use the current question
		this._calculationIds=null;
		
		
		//Add this object into handler
		QuestionHandler.add(this);
	}

//Parse the HTMLDocument to retrieve all responses of the questions
Question.prototype.init=function(){
	//Try to find the element which content the caption of question
	this.questionLabel = QuestionHandler.getQuestionCaptionElements(this.id);
		
	//-1.1.9-Fix
	//Write the question caption in an hidden element and get the HTML of it
	//This is to HTMLDecode the caption
	var div = document.createElement("DIV");
		div.innerHTML = this.caption;
		this.caption = div.innerText;
	//-End of fix

	//No response for the chapter
	if (this.type==eQuestionType.chapter) {
		this.fieldValidator = new FieldValidator(this);
		return;
	}
		
	//Search in textarea collection
	var arrTextArea=document.getElementsByTagName("TEXTAREA");
	var nRankType;
	for (var i=0;i<arrTextArea.length;i++){
			if (this._getIdOfQuestion(arrTextArea[i])!=this.id)continue;
				
			//Set semi-open if the question is closed
			if (this.isClosed && arrTextArea[i].getAttribute("name").indexOf(eResponsePrefix.ranking)==-1)this.isSemiOpen=true;
			//Set ranking if the question have the ranking style (textbox)
			if (this.isClosed && arrTextArea[i].getAttribute("type")=='text' && arrTextArea[i].getAttribute("name").indexOf(eResponsePrefix.ranking)!=-1){
					this.isRanking=true;
					this.isSorted=true;
					//Search the ranking style
					nRankType = QuestionHandler.getRankType(arrTextArea[i]);
					if (nRankType != eRankingType.NONE){
							this.rankStyle=nRankType;
						}
				}
			//Add response into global collection
			this.add(new Response(this._getIdOfResponse(arrTextArea[i]),'',arrTextArea[i]));
				
			//Only one control for the numeric, open or date
			if (!this.isClosed){
					//Raise Event after initialize
					this._oninit();
					return;
				}
		}
		
	//Search if the question is semi-open
	function hasSemiOpenResponse(list){
		for (var opt=0;opt<list.options.length;opt++){
				if (list.options[opt].value==eResponseId.semiOpen){
						return true;
					}
			}
		return false;
	}
	//Search in list (select)
	var arrList=document.getElementsByTagName("SELECT");
	for (var i=0;i<arrList.length;i++){
			if (this._getIdOfQuestion(arrList[i])!=this.id)continue;
			this.isUseList=true;
				
									
			//Add response into global collection
			this.add(new Response(this._getIdOfResponse(arrList[i]),'',arrList[i]));
				
				
			
			this.isSemiOpen=hasSemiOpenResponse(arrList[i]);
				

			//Search the text-box of semi-open
			if (this.isSemiOpen){
					var txtBox=document.getElementsByName(eResponsePrefix.semiOpen + this.id);
					if (txtBox){
							if (txtBox[0]){
									this.add (new Response(this._getIdOfResponse[txtBox[0]],'',txtBox[0]));
								}
							else {
									this.isSemiOpen=false;
								}
						}
					else {
							this.isSemiOpen=false;
						}
				}

			//Check the displaying of semi-open box
			this._checkSemiOpen();
			
			//Raise Event after initialize
			this._oninit();
			return;
		}
		
	//Search in input
	var arrInput=document.getElementsByTagName("INPUT");
	var virtualControl={};
	var selectedResponses={};
	for (var i=0;i<arrInput.length;i++){
			if (this._getIdOfQuestion(arrInput[i])!=this.id)continue;
			if (!arrInput[i].getAttribute("name"))continue;
				
			//Don't add the virtual button
			if (arrInput[i].getAttribute("name").indexOf(eResponsePrefix.virtualButton)!=-1)continue;

			//Set semi-open if the question is closed
			if (this.isClosed && QuestionHandler.isTextLike(arrInput[i]) && arrInput[i].getAttribute("name").indexOf(eResponsePrefix.ranking)==-1)this.isSemiOpen=true;
			//Set ranking if the question have the ranking style (textbox)
			if (this.isClosed && QuestionHandler.isTextLike(arrInput[i]) && arrInput[i].getAttribute("name").indexOf(eResponsePrefix.ranking)!=-1){
					this.isRanking=true;
					this.isSorted=true;
					//Search the style of ranking
					nRankType = QuestionHandler.getRankType(arrInput[i]);
					if (nRankType != eRankingType.NONE){
							this.rankStyle=nRankType;
						}
				}
				
			//Manage the virtual checkbox
			if (this.isClosed  && arrInput[i].getAttribute("name").indexOf(eResponsePrefix.virtualCheckbox)!=-1){
					nRankType = QuestionHandler.getRankType(arrInput[i]);
					if (nRankType != eRankingType.NONE){
							this.rankStyle=nRankType;
						}
					//Add checkbox in existing response
					if (this.all[this._getIdOfResponse(arrInput[i])]){
							var _r=this.all[this._getIdOfResponse(arrInput[i])];
							_r.virtualControl=arrInput[i];
							_r._attachEvents();
								
							//Temporary keep the selected responses into memory
							if (_r.virtualControl.checked)selectedResponses[_r.id]=_r;
						}
					//Keep the virtual checkbox in memory to add them after
					else {
							virtualControl[this._getIdOfResponse(arrInput[i])]=arrInput[i];
						}
					this.isSorted = true;
					continue;
				}
				
			//Add response into global collection
			var r=this.add(new Response(this._getIdOfResponse(arrInput[i]),'',arrInput[i]));
				
			//Only one control for the numeric, open or date
			if (!this.isClosed){
					//Raise Event after initialize
					this._oninit(selectedResponses);
					return;
				}
									
			//Add virtual checkbox if it's not already done
			if (virtualControl[this._getIdOfResponse(arrInput[i])]){
					r.virtualControl=virtualControl[this._getIdOfResponse(arrInput[i])];
					r._attachEvents();
				}
			//Temporary keep the selected responses into memory
			if (!r.virtualControl){
					if (r.htmlControl.checked)selectedResponses[r.id]=r;
					if (this.isRanking && QuestionHandler.isTextLike(r.htmlControl) && r.htmlControl.value!=''){
									selectedResponses[r.id]=r;
					}
				}
			else {
					if (r.virtualControl.checked)selectedResponses[r.id]=r;
				}
		}
	
	//Raise Event after initialize
	this._oninit(selectedResponses);
		
	//Check the displaying of semi-open box
	this._checkSemiOpen();
};

//Fire after init
Question.prototype._oninit = function (selectedResponses) {
	//Search if there is a Dk answer for the non-closed question
	if (!this.isClosed) {
		var arrElts = document.getElementsByName(eResponsePrefix.multiple + this.id + " " + eResponseId.dontKnow);
		if (arrElts && arrElts.length > 0) {
			this.isDkAnswer = true;
			var strCaption = (document.getElementsByName(eResponsePrefix.caption + this.id + " " + eResponseId.dontKnow) && document.getElementsByName(eResponsePrefix.caption + this.id + " " + eResponseId.dontKnow).length)?document.getElementsByName(eResponsePrefix.caption + this.id + " " + eResponseId.dontKnow)[0].innerText:"";
			var r = this.add(new Response(eResponseId.dontKnow, strCaption, arrElts[0]));
			if (!selectedResponses) {
				selectedResponses = {};
			}
			if (!r.virtualControl) {
				if (r.htmlControl.checked) selectedResponses[r.id] = r;
			} else {
				if (r.virtualControl.checked) selectedResponses[r.id] = r;
			}
		}
	}

	//Set the default value on custom controls
	//And add selected responses into the collections
	if (selectedResponses) {
	    for (var i = 0; i < this.childNodes.length; i++) {
	        if (!selectedResponses[this.childNodes[i].id]) {
	            if (this.childNodes[i].customControl) {
	                this.childNodes[i].customControl.setState(eCustomControlState.off);
	            }
	        }
	        else {
	            //For the non-closed response disable controls (text-box)
	            if (!this.isClosed && this.childNodes[i].id == eResponseId.dontKnow) {
	                this.childNodes[0].makeReadOnly();
	            }
	            //Set the state into the custom control
	            if (this.childNodes[i].customControl) {
	                this.childNodes[i].customControl.setState(eCustomControlState.on);
	            }
	            //Set the ranking if require => 2010-08-27 v1.1.8, display the value of ranking when the page is go back
	            var htmlElt = this.childNodes[i].htmlControl;
	            var nRankStyle = QuestionHandler.getRankType(htmlElt);
	            if (nRankStyle == eRankingType.NONE || nRankStyle == eRankingType.DISPLAY_ON_LABEL) {
	                //Write the number in the ranking output element
	                var oRankingOutput = QuestionHandler.getRankingLabelElement(htmlElt);
	                if (oRankingOutput) oRankingOutput.innerHTML = htmlElt.value;
	            }
	                
	            //Add response into collections
	            this._selRespById[this.childNodes[i].id] = this.childNodes[i];
	            this._selRespByIndex[this._selRespByIndex.length] = this._selRespById[this.childNodes[i].id];
	        }
	    }
	}

	//Add the field validator
	this.fieldValidator = new FieldValidator(this);

	//Add the filter
	if (document.getElementById(eResponsePrefix.filter + this.id)) {
	    filterBoxHandler.add(new filterBox(this));
	}
};

// Returns the date with the internal format
Question.prototype.getDateFromString = function getDateFromString(sDate) {
	if (sDate == "") return new Date();

	var arrDate = sDate.split('/'),
		 dt = new Date(), day, month, year;
	if (arrDate.length !== 3) return dt;
	day = parseInt(arrDate[0], 10);
	month = parseInt(arrDate[1], 10);
	year = parseInt(arrDate[2], 10);

    dt.setDate(1); // Make sure the set of month will pass for all months
    dt.setFullYear(year);
    dt.setMonth(month - 1);
	dt.setDate(day);

	return dt;
};
//Add responses into question
//Return the object in library
Question.prototype.add = function (oResponse) {
	//Set the reference to the parentNode
	oResponse.parentNode = this;
	oResponse.index = this.childNodes.length;

	//Add the class askia-live on the original control (add the class on the virtual control below)
	if (this.isLive) {
		$(oResponse.htmlControl).addClass(eAskiaClass.live);
	}

	//Add response into collections
	this.all[oResponse.id] = oResponse;
	this.childNodes[this.childNodes.length] = this.all[oResponse.id];

	//Create calendar for the question date
	if (this.type == eQuestionType.date) {
		// Use the jquery.ui.datepicker instead of calendar
		var options = {
			dateFormat: ((AskiaScript.regional && AskiaScript.regional.dateFormat) || 'MM/dd/yyyy').toLowerCase().replace('yyyy', 'yy'),
			changeMonth: true,
			changeYear: true
		};
		options.minDate = (this.min) ? this.getDateFromString(this.min) : new Date(1900, 0, 1);
		options.maxDate = (this.max) ? this.getDateFromString(this.max) : new Date(2100, 11, 31);
		options.yearRange = options.minDate.getFullYear() + ":" + options.maxDate.getFullYear();
		if (this.defaultValue) options.defaultDate = this.getDateFromString(this.defaultValue);
		if (uiDatePickerOptions) {
			options = $.extend(options, uiDatePickerOptions);
		}
		this.all[oResponse.id].uiControl = $(oResponse.htmlControl).datepicker(options);
		//Search the virtual button to display the calendar
		var btns = document.getElementsByName(eResponsePrefix.virtualButton + oResponse.htmlControl.getAttribute("name"));
		if (btns[0]) this.all[oResponse.id].virtualControl = btns[0];
	}

	//Initialize the custom control
	var nRankStyle = QuestionHandler.getRankType(oResponse.htmlControl);
	var isAllowCustomCtrl = (nRankStyle == eRankingType.NONE || nRankStyle == eRankingType.DISPLAY_ON_LABEL);
	var sImgId = this._getIdOfImage(oResponse.htmlControl);
	var virtualCtrls = document.getElementsByName(eResponsePrefix.virtualCheckbox + oResponse.htmlControl.getAttribute("name"));
	var virtualCtrl = (virtualCtrls) ? virtualCtrls[0] : null;

	if (virtualCtrls && this.isLive) {
		for (var i = 0; i < virtualCtrls.length; i++) {
			$(virtualCtrls[i]).addClass(eAskiaClass.live);
		}
	}

	if (isAllowCustomCtrl && (QuestionHandler.hasCustomControl(oResponse.htmlControl) || (virtualCtrl && QuestionHandler.hasCustomControl(virtualCtrl)))) {
		if (!AskiaScript.skinsCollection[AskiaScript.skinName]) {
			this.all[oResponse.id].customControl = new CustomControl(sImgId);
		}
		else {
			//Initialize the skin there if it's not already done
			if (!AskiaScript.skinsCollection[AskiaScript.skinName].isInit) {
				AskiaScript.initSkin(AskiaScript.skinName);
			}
			var oSkin = AskiaScript.skinsCollection[AskiaScript.skinName];
			if (this.type == eQuestionType.single && oSkin.single.imageBehaviour) {
				this.all[oResponse.id].customControl = oSkin.single.getCopy(sImgId);
			}
			if ((this.type == eQuestionType.multiple && oSkin.multiple.imageBehaviour) || (this.isDkAnswer)) {
				//Take the single control when the response is exclusive
				if (___isExclu() && oSkin.single.imageBehaviour) {
					this.all[oResponse.id].customControl = oSkin.single.getCopy(sImgId);
				}
				else {
					this.all[oResponse.id].customControl = oSkin.multiple.getCopy(sImgId);
				}
			}
		}
	}

	//Creates the custom control in document
	if (this.all[oResponse.id].customControl) {
		//Set specific properties on custom control
		var isSingle = (this.type == eQuestionType.single || ___isExclu());
		if (oResponse.htmlControl.getAttribute(eHTMLAttributes.imageBehaviour)) {
			this.all[oResponse.id].customControl.imageBehaviour = CustomControlBehaviour.imageBehaviourFromArg(oResponse.htmlControl.getAttribute(eHTMLAttributes.imageBehaviour), isSingle);
		}
		if (oResponse.htmlControl.getAttribute(eHTMLAttributes.classBehaviour)) {
			this.all[oResponse.id].customControl.classBehaviour = CustomControlBehaviour.classBehaviourFromArg(oResponse.htmlControl.getAttribute(eHTMLAttributes.classBehaviour), isSingle);
		}
		if (oResponse.htmlControl.getAttribute(eHTMLAttributes.styleBehaviour)) {
			this.all[oResponse.id].customControl.styleBehaviour = CustomControlBehaviour.styleBehaviourFromArg(oResponse.htmlControl.getAttribute(eHTMLAttributes.styleBehaviour), isSingle);
		}
		//Add the image into document
		if (this.all[oResponse.id].customControl.imageBehaviour) {
			var strHtmlImg = '<img id="' + sImgId + '" src="' + this.all[oResponse.id].customControl.imageBehaviour.off + '">';
			oResponse.htmlControl.insertAdjacentHTML('beforebegin', strHtmlImg);
			oResponse.htmlControl.style.display = "none";
			var _virtualCheckbox = document.getElementById(eResponsePrefix.virtualCheckbox + oResponse.htmlControl.getAttribute("name"));
			if (!_virtualCheckbox) {
				_virtualCheckbox = document.getElementsByName(eResponsePrefix.virtualCheckbox + oResponse.htmlControl.getAttribute("name"))[0];
			}
			if (_virtualCheckbox) _virtualCheckbox.style.display = "none";
			var img = document.getElementById(sImgId);
			if (this.isLive) {
				$(img).addClass(eAskiaClass.live);
			}
			this.all[oResponse.id].customControl.setHTMLElements(img);
		}
	}
	var captionElt = QuestionHandler.getCaptionElement(this.id, oResponse.id);
	if (captionElt) {
		this.all[oResponse.id].caption = captionElt.innerText;
		//Fix the problem with FF and Chrome (reading the caption in the innerHTML instead of innerText)
		if (this.all[oResponse.id].caption == "") this.all[oResponse.id].caption = captionElt.innerHTML;
		this.all[oResponse.id].htmlCaption = captionElt;
		if (!this.all[oResponse.id].customControl) {
			this.all[oResponse.id].customControl = new CustomControl(sImgId);
		}
		this.all[oResponse.id].customControl.setHTMLElements(this.all[oResponse.id].htmlCaption);
		if (this.isLive) {
			$(captionElt).addClass(eAskiaClass.live);
		}
	}

	//Search the caption of response into the header of loop
	var columnCaptionElt = QuestionHandler.getColumnCaptionElement(this.id, oResponse.id);
	if (columnCaptionElt) {
		this.all[oResponse.id].caption = ""; //Reset for the FF and Chrome issue
		this.all[oResponse.id].caption = columnCaptionElt.innerText;
		//Fix the problem with FF and Chrome (reading the caption in the innerHTML instead of innerText)
		if (this.all[oResponse.id].caption == "") this.all[oResponse.id].caption = columnCaptionElt.innerHTML;
	}
	else {
		//Search the id of first item in loop
		var qc = QuestionHandler.getQuestionsByShortcut(this.shortcut);
		if (qc.length) {
			var firstLoopId = qc[0].id;
			columnCaptionElt = QuestionHandler.getColumnCaptionElement(firstLoopId, oResponse.id);
			if (columnCaptionElt) {
				this.all[oResponse.id].caption = ""; //Reset for the FF and Chrome issue
				this.all[oResponse.id].caption = columnCaptionElt.innerText;
				//Fix the problem with FF and Chrome (reading the caption in the innerHTML instead of innerText)
				if (this.all[oResponse.id].caption == "") this.all[oResponse.id].caption = columnCaptionElt.innerHTML;
			}
		}
	}
	//Attach events on html controls
	this.all[oResponse.id]._attachEvents();

	//Verify if the response is exclusive or not
	//2007-05-16: Fix to manage the bad html generation 
	//(when the attributes is on the virtual button)
	if (___isExclu()) {
		this.all[oResponse.id].isExclusive = true;
		this.addExclusiveResponse(this.all[oResponse.id]);
	}
	//This function return true when the response is exclusive
	//2007-05-16: Fix to manage the bad html generation 
	//(when the attributes is on the virtual button)
	//2007-09-24: Fix to manage the employment of attributes name instead of id for the virtual checkbox
	function ___isExclu() {
		if (oResponse.htmlControl.getAttribute(eHTMLAttributes.isExclusive)) return true;
		if ($(oResponse.htmlControl).hasClass(eAskiaClass.exclu)) return true;
		var _virtualCheckbox = document.getElementById(eResponsePrefix.virtualCheckbox + oResponse.htmlControl.getAttribute("name"));
		if (!_virtualCheckbox) {
			_virtualCheckbox = document.getElementsByName(eResponsePrefix.virtualCheckbox + oResponse.htmlControl.getAttribute("name"))[0];
		}
		if (_virtualCheckbox) {
			if ($(_virtualCheckbox).hasClass(eAskiaClass.exclu)) return true;
			if (_virtualCheckbox.getAttribute(eHTMLAttributes.isExclusive)) return true;
		}
		return false;
	}

	//Verify if the response is on the calculator group
	if (QuestionHandler.hasCalculation(oResponse.htmlControl)) {
		var arrCalcId = QuestionHandler.getCalculationsIds(oResponse.htmlControl);
		this._calculationIds = arrCalcId.join(";");
		for (var i = 0; i < arrCalcId.length; i++) {
			if (!CalculationHandler.all[arrCalcId[i]]) {
				var cG = new Calculation(arrCalcId[i]);
			}
			CalculationHandler.all[arrCalcId[i]].add(this);
		}
	}

	//Return the element
	return this.all[oResponse.id];
};
//Add exclusive response
Question.prototype.addExclusiveResponse=function(oResponse){
	this._excluRespById[oResponse.id]=oResponse;
	this._excluRespByIndex[this._excluRespByIndex.length]=this._excluRespById[oResponse.id];
	return this._excluRespById[oResponse.id];
};
//Add selected responses into question
Question.prototype.addSelectedResponse=function(oResponse){
	//For single question remove all selected response before
	if (this.type!=eQuestionType.multiple || oResponse.isExclusive){
			//If the response is already selected do nothing
			if (this._selRespById[oResponse.id])return;
			this.removeAllSelectedResponses();
		}
	//For the non-closed response disable controls (text-box)
	if (!this.isClosed && oResponse.id ==eResponseId.dontKnow){
		this.childNodes[0].makeReadOnly();
	}
	//Remove the exclusive answers if there in the selected response collection
	if (this.type==eQuestionType.multiple && !oResponse.isExclusive && this._selRespByIndex.length>0){
			if (this._selRespByIndex[0].isExclusive)this.removeAllSelectedResponses();
		}
	//Set the state into the custom control
	if (oResponse.customControl){
			oResponse.customControl.setState(eCustomControlState.on);
		}
		
	if (this._selRespById[oResponse.id])return this._selRespById[oResponse.id];
	//Add response into collections
	this._selRespById[oResponse.id]=oResponse;
	this._selRespByIndex[this._selRespByIndex.length]=this._selRespById[oResponse.id];
	this._checkOrder(oResponse);
	//Return the response in the collection
	return this._selRespById[oResponse.id];
};
//Remove selected responses into question
Question.prototype.removeSelectedResponse=function(oResponse){
	if (!this.isRanking && !this.isSorted) {
				oResponse.htmlControl.checked = false;
		}
	else {
			if (oResponse.virtualControl)oResponse.virtualControl.checked=false;
			this._checkOrder(oResponse);
		}
	if (oResponse.virtualControl) {
			oResponse.htmlControl.value = "";
			oResponse.virtualControl.checked = false;
		}
	//For the non-closed response enable controls (text-box)
	if (!this.isClosed && oResponse.id ==eResponseId.dontKnow){
		this.childNodes[0].makeWritable();
	}            
	//Set the new state into the custom control 
	if (oResponse.customControl){
			oResponse.customControl.setState(eCustomControlState.off);
		}		
	//Remove the response into collections
	this._selRespById[oResponse.id]=null;
	var nIndex=-1;
	for (var i=0;i<this._selRespByIndex.length;i++){
		if (this._selRespByIndex[i]==oResponse){
				var arrDummyFirstPart=this._selRespByIndex.slice(0,i);
				var arrDummyLastPart=this._selRespByIndex.slice(i+1,this._selRespByIndex.length);
				this._selRespByIndex=arrDummyFirstPart.concat(arrDummyLastPart);	
				break;
			}
		}
	return oResponse;
};
//Remove all selected responses
Question.prototype.removeAllSelectedResponses = function () {
	//Remove the values into all html elements
	for (var i=0;i<this._selRespByIndex.length;i++){
			var strType=this._selRespByIndex[i].htmlControl.getAttribute("type");
			if (strType =='radio' || strType =='checkbox'){
					this._selRespByIndex[i].htmlControl.checked=false;
					//For the non-closed response enable controls (text-box)
					if (!this.isClosed && this._selRespByIndex[i].id ==eResponseId.dontKnow){
						this.childNodes[0].makeWritable();
					}  						
				}
			else {
					this._selRespByIndex[i].htmlControl.value="";
					//Clear the number in the ranking output element
					var oRankingOutput = QuestionHandler.getRankingLabelElement(this._selRespByIndex[i].htmlControl);						
					if (oRankingOutput)oRankingOutput.innerHTML="";																								
				}
			if (this._selRespByIndex[i].virtualControl){
					this._selRespByIndex[i].htmlControl.value="";
					this._selRespByIndex[i].virtualControl.checked=false;
				}
					
			//Set the state into the custom control
			if (this._selRespByIndex[i].customControl){
					this._selRespByIndex[i].customControl.setState(eCustomControlState.off);
				}
		}

	this._selRespById={};
	this._selRespByIndex=[];
};
	
//Return the id of question using the htmlControl
Question.prototype._getIdOfQuestion=function(htmlControl){
	var sId=htmlControl.getAttribute("name");
	for (var pref in eResponsePrefix){
			if (eResponsePrefix[pref]=='')continue;
			sId=replace(sId,eResponsePrefix[pref],'');
		}
	if (this.type==eQuestionType.multiple){
			var indexOfQuestionId=0;
			var arrId=sId.split(' ');
			if (arrId.length>1)sId=arrId[indexOfQuestionId];
		}
	return sId;		
};
//Return the id of response using the htmlControl	
Question.prototype._getIdOfResponse=function(htmlControl){
	var sId=(this.type==eQuestionType.single)?htmlControl.getAttribute("value"):htmlControl.getAttribute("name");
		
	//Search the id of textbox
	if (QuestionHandler.isTextLike(htmlControl))sId=htmlControl.getAttribute("name");
		
	if (this.type==eQuestionType.multiple){
			var indexOfResponseId=1;
			var arrId=sId.split(' ');
			if (arrId.length>1)sId=arrId[indexOfResponseId];
		}
	for (var pref in eResponsePrefix){
			if (eResponsePrefix[pref]=='')continue;
			sId=replace(sId,eResponsePrefix[pref],'');
		}

	return sId;
};
///<summary>
///Returns the Id of image which is use as custom control
///</summary>
///<param name="htmlControl">HTMLControl of response</param>
///<remarks>Available since v1.1.0</remarks>
Question.prototype._getIdOfImage=function(htmlControl){
	var sId=htmlControl.getAttribute("name").replace(/\s/gi, "_");
	if (this.type==eQuestionType.single)sId+= "_" + htmlControl.getAttribute("value");
	sId=eResponsePrefix.imgCustomControl + sId;
	return sId;
};
//Manage the semi-open response
Question.prototype._checkSemiOpen=function(){
	if(!this.isSemiOpen || !this._semiOpenResponse || (!this.all[eResponseId.semiOpen] && !this.isUseList))return;
		
	//Classical semi-open (with checkbox or list)
	var isSemiSelected=(!this.isUseList)?this.all[eResponseId.semiOpen].htmlControl.checked:(this.childNodes[0].htmlControl.value==eResponseId.semiOpen);
	this._semiOpenResponse.htmlControl.style.display=(isSemiSelected)?"block":"none";
		
	//Re-validate the semi-open in 100ms
	//It's to manage the browsers which send the event onclick 
	//before to change the state of selectbox 
	if (this.isUseList){
			window.__lastQuestion=this;
			setTimeout("window.__lastQuestion._checkSemiOpen();",100);
			return;
		}		
					
	//Semi-open with virtual checkbox (Sorted question)
	if (this.isSorted && this.all[eResponseId.semiOpen].virtualControl){
			this._semiOpenResponse.htmlControl.style.display=(this.all[eResponseId.semiOpen].virtualControl.checked)?"block":"none";
		}
		
	//Semi-open with the ranking style
	if (this.isRanking)this._semiOpenResponse.htmlControl.style.display=(this.all[eResponseId.semiOpen].htmlControl.value!='')?"block":"none";
		
	//Re-validate the semi-open in 100ms
	//It's to manage the browsers which send the event onclick 
	//before to change the state of radio button (Netscape6 for example)
	if (this.all[eResponseId.semiOpen].htmlControl.getAttribute("type")=="radio"){
			window.__lastQuestion=this;
			setTimeout("window.__lastQuestion._checkSemiOpen();",100);
		}
};

//Manage the ordered responses
Question.prototype._checkOrder=function(oLastResponse){
	if (!this.isClosed || !this.isSorted)return;
	if (oLastResponse){
		if (!oLastResponse.virtualControl)return;
		//Increment order of response
		if (oLastResponse.virtualControl.checked){
				oLastResponse.htmlControl.value=this._selRespByIndex.length;
				//Write the number in the ranking output element
				var oRankingOutput = QuestionHandler.getRankingLabelElement(oLastResponse.htmlControl);
				if (oRankingOutput)oRankingOutput.innerHTML=this._selRespByIndex.length;
			}
		//Decreament order of response
		else {
				var nLastValue=parseInt(oLastResponse.htmlControl.value);
				oLastResponse.htmlControl.value="";
				//Remove the number in the ranking output element
				var oRankingOutput = QuestionHandler.getRankingLabelElement(oLastResponse.htmlControl);						
				if (oRankingOutput)oRankingOutput.innerHTML="";		
										
				for (var i=0;i<this._selRespByIndex.length;i++){
						if (parseInt(this._selRespByIndex[i].htmlControl.value)>nLastValue){
								this._selRespByIndex[i].htmlControl.value=parseInt(this._selRespByIndex[i].htmlControl.value) -1;
								//Rewrite the number in the ranking output element
								var oRankingOutput = QuestionHandler.getRankingLabelElement(this._selRespByIndex[i].htmlControl);
								if (oRankingOutput)oRankingOutput.innerHTML=parseInt(this._selRespByIndex[i].htmlControl.value);																
							}
					}
			}
	}
};
//Private events
Question.prototype._onchange=function(){	
	this.fieldValidator.validate();
	this._canValidateSemiOpen = true;
	if (this._calculationIds){
		var arrCalcId = this._calculationIds.split(";");
		for (var i=0;i<arrCalcId.length;i++){
			if (CalculationHandler.all[arrCalcId[i]]) {
				CalculationHandler.all[arrCalcId[i]].execute();
			}
		}
	}

	if (!this._preventChangeEvent) {
		// Execute the liverouting
		if (this.isLive) {
			AskiaScript.executeLiveRouting();
		}
		//Fires the event
		this.onchange();
	}
};

//Hide all element of question
Question.prototype.hide=function(){this._changeView(eViewType.hide);};
//Show all element of question
Question.prototype.show=function(){this._changeView(eViewType.show);};
//Hide all element of question
Question.prototype.enable=function(){this._changeView(eViewType.enable);};
//Show all element of question
Question.prototype.disable=function(){this._changeView(eViewType.disable);};

//Manage the visualisation of question
Question.prototype._changeView = function (viewType) {
	var currentQuestionId = this.id,
	    i, l,
	    isShareRow;

	// Extract the id of question using a regular expression
	function extractQuestionId(val, re) {
		if (val) {
			var id = val.replace(re, "$1");
			if (id) {
				id = parseInt(id);
				if (!isNaN(id)) {
					return id;
				}
			}
		}
		return undefined;
	}

	// Indicates if there is another question element in the childnodes
	function hasAnotherQuestionElement(elt) {
		var i, l,
		    node, qId,
		    reClass = /askia-caption(\d+)/gi,
		    reId = /(?:col|cpt|qLbl)(\d+)(?:(\s|_)*\d*)?/gi,
		    reName = /(?:M|S|O|U|D|R|B|L)(\d+)(?:\s*\d*)?/gi;

		for (i = 0, l = elt.childNodes.length; i < l; i += 1) {
			node = elt.childNodes[i];
			if (node.getAttribute) {
				// Search in ids
				qId = extractQuestionId(node.getAttribute("id"), reId);
				if (qId !== undefined && qId !== currentQuestionId) {
					return true;
				}
				// Search in name
				qId = extractQuestionId(node.getAttribute("name"), reName);
				if (qId !== undefined && qId !== currentQuestionId) {
					return true;
				}
				// Search in classes
				qId = extractQuestionId(node.className, reClass);
				if (qId !== undefined && qId !== currentQuestionId) {
					return true;
				}
			}
			// Apply recursivity
			if (hasAnotherQuestionElement(node)) {
				return true;
			}
		}

		return false;
	}

	// Indicates if the question shared is row with other question
	// In this case we will apply a style="visibility:hidden|visible" instead of style="display:none|''"
	function shareRowWithOtherQuestions(htmlElt) {
		var isOnTd = (htmlElt.parentNode.tagName.toLowerCase() === 'td'),
			isATd = (htmlElt.tagName.toLowerCase() === 'td'),
			row;

		if (!isOnTd && !isATd) {
			return false;
		}
		// Parse row
		return hasAnotherQuestionElement(((isATd) ? htmlElt.parentNode : htmlElt.parentNode.parentNode));
	}

	//This internal function change the view of element
	function __setViewOnElt(htmlElt, shareRow) {
		if (viewType === eViewType.show || viewType === eViewType.hide) {
			var isTd = (htmlElt.parentNode.tagName.toLowerCase() === 'td'),
			    reSkinClass = /.*\s*askia-skin\s*.*/gi,
			    trElement,
			    tableElement;

			if (shareRow) {
				htmlElt.parentNode.style.visibility = (viewType === eViewType.show) ? "visible" : "hidden";
			} else {
				if (isTd) {
					// For the skin there is an additional table with only one TR
					// This TR should have two TD: one with the input and the other one with the span:
					// Table > TR > TD > INPUT
					//			  > TD > SPAN
					if (reSkinClass.test(htmlElt.className) || htmlElt.getAttribute(eHTMLAttributes.isUseCustomControl)) {
						trElement = htmlElt.parentNode.parentNode; // TR
						if (trElement.parentNode.childNodes.length === 1) { // Only one TR in the table
							if (trElement.childNodes.length === 2) { // The TR have two cells
								// The first TD should contain the input
								if (trElement.childNodes[0].childNodes.length > 0 && trElement.childNodes[0].childNodes[trElement.childNodes[0].childNodes.length - 1] == htmlElt) {
									// The second TD only contain one span
									if (trElement.childNodes[1].childNodes.length === 1 && trElement.childNodes[1].childNodes[0].tagName.toLowerCase() === 'span') {
										// Search the table container
										tableElement = trElement.parentNode;
										while (tableElement.tagName.toLowerCase() !== 'table') {
											tableElement = tableElement.parentNode;
										}
										if (tableElement.parentNode.tagName.toLowerCase() === 'td') {
											tableElement.parentNode.parentNode.style.display = (viewType === eViewType.show) ? "" : "none";
											return; // Break the process here
										}
									}
								}
							}
						}
					}
					htmlElt.parentNode.parentNode.style.display = (viewType === eViewType.show) ? "" : "none";
				} else {
					if (htmlElt.parentNode.tagName.toLowerCase() === "form" || htmlElt.parentNode.tagName.toLowerCase() === "body") {
						htmlElt.style.display = (viewType === eViewType.show) ? "" : "none";
					} else {
						htmlElt.parentNode.style.display = (viewType === eViewType.show) ? "" : "none";
					}
				}
			}

		} else {
			htmlElt.disabled = (viewType === eViewType.disable);
			htmlElt.parentNode.disabled = (viewType === eViewType.disable);
		}
	}

	//Display or hide the caption
	if (this.questionLabel) {
		if (this.questionLabel.length && this.questionLabel.join) {
			for (i = 0, l = this.questionLabel.length; i < l; i += 1) {
				if (!shareRowWithOtherQuestions(this.questionLabel[i])) { // Don't hide the question label when it's on same row of another question (possibly a table)
					__setViewOnElt(this.questionLabel[i], false);
				}
			}
		} else {
			if (!shareRowWithOtherQuestions(this.questionLabel)) { // Don't hide the question label when it's on same row of another question (possibly a table)
				__setViewOnElt(this.questionLabel, false);
			}
		}
	}

	//Display or hide the responses
	if (this.childNodes.length) {
		isShareRow = shareRowWithOtherQuestions(this.childNodes[0].htmlControl);
	}
	for (i = 0; i < this.childNodes.length; i++) {
		__setViewOnElt(this.childNodes[i].htmlControl, isShareRow);
	}

	//Raise the event
	this.onchangeView(viewType);

};
//Get the response(s) of question
Question.prototype.getValue = function () {
	var arrReturn = [];
		
	//Closed question
	if (this.isClosed){
		var isSemiOpenSelected = false;
		for (var i = 0; i < this._selRespByIndex.length; i++) {
			arrReturn[arrReturn.length] = (this._selRespByIndex[i].index + 1);
			if (this._selRespByIndex[i].id === eResponseId.semiOpen) {
				isSemiOpenSelected = true;
			}
		}
		if (isSemiOpenSelected) {		
			arrReturn[arrReturn.length] = this._semiOpenResponse.htmlControl.value;
		}
	} else { //All other questions (read the text box)
		arrReturn[arrReturn.length] = this.childNodes[0].htmlControl.value;
	}
		
	if (arrReturn.length === 1) {
		return arrReturn[0];
	}
	return arrReturn;
};

Question.prototype._IdsToIndexes = function (ids) {
	if (ids === undefined || ids === null ){
		return null;
	}

	if (typeof (ids) === "string") {
		return ids;
	}

	var idx, i, l, indexes;
	indexes = [];
	if (ids.length && ids.join) {
		for (i = 0, l = ids.length; i < l; i += 1) {
			idx = this._IdsToIndexes(ids[i]);
			if (idx !== null && idx !== undefined) {
				indexes.push(idx);
			}
		}
		return indexes;
	}

	if (!isNaN(parseInt(ids, 10))) {
		if (this.all[ids]) {
			return this.all[ids].index + 1;
		}
		return null;
	}

	return null;
};

// Set the response(s) of question using the ids of responses
// Warning: This method unselect all responses before to select the new values
Question.prototype.setValuesById = function (values) {
	this.clearValues();
	this.setValue(this._IdsToIndexes(values));
};

// Set the DK response
Question.prototype.setDk = function() {
	var e=window.event;
	if (!e){
		e = {stopPropagation:function(){}};
	}
	this.clearValues();
	if (this.all[eResponseId.dontKnow]){
		this.all[eResponseId.dontKnow].htmlControl.checked=true;
		this.all[eResponseId.dontKnow].click(e);
	}
};

// Clear the DK
Question.prototype.clearDk = function () {
	var e = window.event;
	if (!e) {
		e = {stopPropagation:function () {}};
	}
	if (this.all[eResponseId.dontKnow]) {
		this.all[eResponseId.dontKnow].htmlControl.checked = false;
		this.all[eResponseId.dontKnow].click(e);
	}
};

// Set the response(s) in question
Question.prototype.setValue = function (values, recursive) {
	var e = window.event;
	if (!e){
		e = {
			stopPropagation : function () {}
		};
	}
	if (values === null || values === undefined) {
		return;
	}
	var eValueType = {
		number  :   1,
		string  :   2,
		array   :   3
	};
	//Search the type of values
	var valueType = eValueType.number;
	if (values.length && values.join) {
		valueType = eValueType.array;
	}
	if (values.length && !values.join) {
		valueType = eValueType.string;
	}
	if (values === "") {
		valueType=eValueType.string;
	}
		
		
	//The numeric question have a same treatment as the open-ended
	//question, so to manage the things one time, we simulate the 
	//numeric value as string
	if (this.type === eQuestionType.numeric && valueType === eValueType.number) {
		valueType = eValueType.string;
	}

	// Prevent the change event
	this._preventChangeEvent = true;

	// Get the previous values to know if the question has change after the execution
	var previousValues = (recursive) ? undefined : this.getValue();
		
	//Set value on open-ended question or on semi-open response
	switch (valueType) {
		//Closed questions
		case eValueType.number:

			//Correct the value there
			//In Askia the lower index is 1
			//But the script the lower index is 0
			var nIndex = values - 1;

			//Incorrect values
			if (nIndex < 0 || nIndex > this.childNodes.length) {
				this._preventChangeEvent = false; // Restore the state
				return;
			}
			//Check the response
			if (!this.isUseList) {
							
				if (this.type !== eQuestionType.multiple) {
					for (var i = 0, l = this.childNodes.length; i < l; i++) {
						this.childNodes[i].htmlControl.checked = false;
					}
				}
				if (this.childNodes[nIndex].virtualControl) {
					this.childNodes[nIndex].virtualControl.checked = true;
				} else {
					this.childNodes[nIndex].htmlControl.checked = true;
				}
				this.childNodes[nIndex].click(e);

			} else {

				this.childNodes[0].value = nIndex;
				this.childNodes[0].select();
			}
			break;

		//Open-ended, semi-open or numeric question
		case eValueType.string:

			//Invalid value type
			if (this.isClosed && !this.isSemiOpen) {
				this._preventChangeEvent = false; // Restore the state
				return;
			}

			//Set value on semi-open or open-ended box
			var resp = (this.isSemiOpen) ? this._semiOpenResponse : this.childNodes[0];
			resp.htmlControl.value = values;
			resp.blur(e);
			break;

		//Multiple responses
		case eValueType.array:

			//Select a random values 
			for (var i = 0, l = values.length; i < l; i++) {
				this.setValue(values[i], true);
			}
			break;
	}

	var currentValues = (recursive) ? undefined : this.getValue();

	// Restore the state
	if (!recursive) {
		this._preventChangeEvent = false;
	}

	// Trigger the change only if there is a change
	if (!recursive && currentValues !== previousValues) {
		this._onchange(); 
	}
};

//Clear all responses from question
Question.prototype.clearValues=function(){
	//Remove the value from the text-boxes
	if (!this.isClosed || this.isSemiOpen){
			this.setValue("");
		}
	if (this.isClosed){
		this.removeAllSelectedResponses();
		this._checkSemiOpen();
	}
};

//Remove the response from question
Question.prototype.removeValue=function(values){
	//Remove the value from the text-boxes
	if (!this.isClosed){
			this.setValue("");
			return;
		}
	//Remove the value from single questions
	if (this.type==eQuestionType.single){
			this.removeAllSelectedResponses();
			return;
		}
	//Remove the values from the multiple questions
	if (this.type==eQuestionType.multiple){
			if (values.length){
					for (var i=0;i<values.length;i++){
							//Correct the values (the lower index is 0 for the script)
							var resp=this.childNodes[values[i]-1];
							this.removeSelectedResponse(resp);
						}
			}
			else {
					//Correct the values (the lower index is 0 for the script)
					var resp=this.childNodes[values-1];
					this.removeSelectedResponse(resp);                    
			}
		}
};
//Public events
Question.prototype.onchange=function(){/* EVENT */};
Question.prototype.onchangeView=function(viewType){/*EVENT*/};

/* === Response object (modality or options in list) ===	*/
function Response(id,caption,htmlControl){
	//General properties
	this.id=id;						//Id of response
	this.index=-1;					//Index of response in the Question collection 
	this.caption='' || caption;		//Caption of response
	this.htmlControl=htmlControl;	//Html element
	this.virtualControl=null;		//Virtual checkbox for the ranking question
	this.customControl=null;		//CustomControl will be use instead of the classical input
	this.isExclusive=false;			//True when the response is exclusive (only for multiple question)
	this.isSemiOpenBox=false;		//Box for the semi-open response
	this.htmlCaption=null;          //HtmlElement which content the caption
	this.parentNode=null;			//Question
	this._isPreventRecursiveEvents=false; //Prevent the recursive events (when the parent is clickable and contains the control)
	this._isClickOnCell=false;			  //Indicates if the the click is on cell
}
//Attach events on html control
Response.prototype._attachEvents=function(){

	//Set reference of response object into html control
	this.htmlControl._response=this;	
		
	//Manage event on select box
	if (this.htmlControl.tagName=="SELECT"){
			this.htmlControl.onchange=QuestionHandler.select;
		}

	//Manage event on html control
	var sType=this.htmlControl.getAttribute("type");
	if (!sType)sType='';
	if (sType.toLowerCase()=='radio' || sType.toLowerCase()=='checkbox'){
			this.htmlControl.onclick=QuestionHandler.click;
		}
	else {
		if (sType || this.htmlControl.tagName=='TEXTAREA'){
				this.htmlControl.onblur=QuestionHandler.blur;
				//Keep the semi-open response-box in memory
				if (this.parentNode.isClosed && this.htmlControl.getAttribute("name").indexOf(eResponsePrefix.semiOpen)!=-1){
						this.parentNode._semiOpenResponse=this;
						this.isSemiOpenBox=true;
					}
			}
		}
	//Manage event on virtual control (checkbox)
	if (this.virtualControl){
			//Set reference of response object into html control
			this.virtualControl._response=this;	
			sType=this.virtualControl.getAttribute("type");
			if (!sType)sType='';
			if (sType.toLowerCase()=='radio' || sType.toLowerCase()=='checkbox' || this.parentNode.type==eQuestionType.date){
			
					this.virtualControl.onclick=QuestionHandler.click;
				}
		}
			
	//Verify if the control is the parent container is a customControl
	//to don't fires the event two times
	if (this.htmlCaption){
			var parent=(this.virtualControl)?this.virtualControl.parentNode:this.htmlControl.parentNode;		
			if (parent.id==this.htmlCaption.id)this._isPreventRecursiveEvents =true;
			while(!this._isPreventRecursiveEvents && parent.tagName.toLowerCase()!="body"){
					parent=parent.parentNode;
					if (parent.id==this.htmlCaption.id)this._isPreventRecursiveEvents =true;
				}
		}				
	//Manage event on custom control (image)
	if (this.customControl){
			this.customControl.attachEventsOn(this);
		}
};
//Manage the click on the response (radio, button or checkbox)
Response.prototype.click = function (e) {
	
	//Manage the click on virtual button of question date
	if (this.parentNode.type == eQuestionType.date && this.uiControl) {
		// Use the jquery.ui.datepicker instead of calendar
		this.uiControl.datepicker("show");
		return;
	}

	if (!isIE && e) {
		e.cancelBubble = true;
		if (e.stopPropagation) e.stopPropagation();
	}

	//Manage the propagation of events
	if (this._isPreventRecursiveEvents && this._isClickOnCell) {

		//Make a little verification
		var isControlSelected = this.htmlControl.checked;
		if (this.virtualControl) isControlSelected = this.virtualControl.checked;
		if (isControlSelected && this.parentNode._selRespById[this.id]) return;
		if (!isControlSelected && !this.parentNode._selRespById[this.id]) return;
	}

	//Add or delete response into collections of selected response
	var isChecked = false;
	isChecked = this.htmlControl.checked;
	if (this.virtualControl) isChecked = this.virtualControl.checked;
	if (isChecked)
		this.parentNode.addSelectedResponse(this);
	else
		this.parentNode.removeSelectedResponse(this);

	//Checked the semi-open response
	this.parentNode._checkSemiOpen();

	//Fires the event on change
	this.parentNode._canValidateSemiOpen = false;
	this.parentNode._onchange();
};

//Manage the lost focused on the response (textbox)
Response.prototype.blur=function(e){
	//Ranking
	if (this.parentNode.isRanking){
			var isSemiOpenBox=false; 
			if (this.parentNode._semiOpenResponse){
					if (this.parentNode._semiOpenResponse==this){
							isSemiOpenBox=true;
						}
				}
			if (!isSemiOpenBox){
					if (this.htmlControl.value!=''){
							this.parentNode.addSelectedResponse(this);
						}
					else {
							this.parentNode.removeSelectedResponse(this);
						}
					this.parentNode._canValidateSemiOpen=false;
				}
			//Checked the semi-open response
			this.parentNode._checkSemiOpen();					
		}
			
	//Fires the event on change
	this.parentNode._onchange();
};

//Manage the selection into select box
Response.prototype.select=function(e){
	//Checked the semi-open response
	this.parentNode._checkSemiOpen();
						
	//Fires the event on change
	this.parentNode._canValidateSemiOpen=false;
		
	//Fires the event on change
	this.parentNode._onchange();
};
//Make the HTMLElement read-only
Response.prototype.makeReadOnly=function(){
	if (!this._originalBackground ){
		this._originalBackground =this.htmlControl.style.backgroundColor;
	}
	this.htmlControl.readOnly=true;
	this.htmlControl.style.backgroundColor="#D4D0C8";
};
//Make the HTMLElement writtable
Response.prototype.makeWritable=function(){
	if (!this.htmlControl.readOnly)return;
	this.htmlControl.readOnly=false;
	this.htmlControl.style.backgroundColor=this._originalBackground || '';
};

// For the form with <div class="askia-touch"><ul><li><input /><span /></li></ul></div>
AskiaScript.addReadyEvent(function () {
    $('.askia-touch').delegate('li', 'click', function (e) {
        if ((/(span|input|img)/gi).exec(e.target.nodeName)) {
            e.stopPropagation();
            return;
        }
        $(this).find('input[type=checkbox],input[type=radio]')[0].click();   
	});
});
/*global ActiveXObject:true */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia Calculation Objects						  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Do a live calculation														  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| Dependencies:																  |
|	+ AskiaScript.js														  |
|-----------------------------------------------------------------------------|
| 2006-07-04 |V 1.0.0														  |
|			 |+ Load the expression of calculation							  |
|			 |+ Do a calculation into a loop using a group of variables 	  |
|			 |+ Do a custom calculation using a function					  |
|-----------------------------------------------------------------------------|
| 2007-01-11 |V 1.1.0														  |
|			 |+ Execute the calculation when the page loading				  |
| 2007-01-18 |+ Apply the max number of decimal in the sum					  |
| 2007-01-31 |+ Add the CvDkNa() method to transform the NaN to Zero          |
|			 |+ Set Zero if the value of varName isNaN                        |
|			 |+ Fix: Bug when try to execute the calculation on load		  |
| 2007-05-02 |+ Add the event onExecute(htmlControl,result)					  |
|			 |+ Add the management of event using the 'onExecute' attributes  |
|-----------------------------------------------------------------------------|
| 2011-01-20 |V 1.2.	0													      |
|			 |+ Compatibilities with the new XHtml 1.0 generation			  |
|-----------------------------------------------------------------------------|
| Created 2006-07-04 | All changes are in the log above. | Updated 2011-01-20 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|WebProd - Calculation - API Version 1.2.0		Copyright Askia © 1994-2011   |
\----------------------------------------------------------------------------*/


/* ===
	Enumerator
=== */ 
//Special id of html elements to do the calculation
var eCalculationHTMLId={
		calculationResult	: 'calculationResult' //Id of HTML element which content the result
	};

//Special attributes of html elements to do the calculation	
var eCalculationHTMLAttributes={
		calculationFunction : 'calculationFunction',	//Attributes which content the function of calculation
		varName				: 'varName',				//Attributes which content the name of variable use in function
		onExecute			: 'onExecute'				//Attributes which content the function which will execute after the execution
	};
var calculationFunction = {}; // 1.2 Manage the calculation function in javascript instead of custom invalid HTML attributes

/* ===
	Generic function for calculation
=== */
//Do the sum with the Calculation
//Return the sum
function sum(CalculationId){
		var oCalculation=CalculationHandler.all[CalculationId];
		if (!oCalculation)return null;
		var result=0;
		var nMaxDec=0;
		for (var i=0;i<oCalculation.childNodes.length;i++){
				var number=oCalculation.childNodes[i].childNodes[0].htmlControl.value;
				number=replace(number,',','.');
				var nDec=getLengthOfDec(number);
				nMaxDec=Math.max(nDec,nMaxDec);
				if (number!='' && !isNaN(number))result += parseFloat(number);
			}
		//Internal function which return the number of decimal
		function getLengthOfDec(n){
				if (n=='' || isNaN(n))return 0;
				var arr=n.split('.');
				if (arr.length>1)return arr[1].length;
				return 0;
			}
		
		//Apply the max number of dec to round the number
		return result.toFixed(nMaxDec);
	}
/* The sum function will not case sensitive */
function Sum(CalculationId){return sum(CalculationId);}
function SUM(CalculationId){return sum(CalculationId);}
/* ---									--- */

//Transform the non-answer and not-ask to Zero (AskiaDesign logic)
//Transform the NaN (Not A Number) to Zero (JavaScript logic)
//Return Zero or the numeric value
function cvDkNa(value){
		if (isNaN(parseFloat(value)))return 0;
		return parseFloat(value);
	}
/* The cvDkNa function will not case sensitive */
function cvdkna(value){return cvDkNa(value);}
function CVDKNA(value){return cvDkNa(value);}
function CvDKNA(value){return cvDkNa(value);}
function CvDkNa(value){return cvDkNa(value);}
/* The cvDkNa function can be write in french  */
function cvNrNi(value){return cvDkNa(value);}
function cvnrni(value){return cvDkNa(value);}
function CVNRNI(value){return cvDkNa(value);}
function CvNRNI(value){return cvDkNa(value);}
function CvNrNi(value){return cvDkNa(value);}
/* ---									--- */



/* ===
	Collection of Calculation
=== */
var CalculationHandler={
		//Collections of Calculation
		all			:	{},
		childNodes	:	[],
		
		//Collections of variable
		variables   : {},
		
		//Add the Calculation into collections
		add			:  function(oCalculation){
				if (this.all[oCalculation.id])return this.all[oCalculation.id];
				this.all[oCalculation.id]=oCalculation;
				this.childNodes[this.childNodes.length]=this.all[oCalculation.id];
				return this.all[oCalculation.id];
			}
	};

/* === 
	Calculation object
=== */
function Calculation(id){
		//Id of calculation
		this.id=id;
		
		//Collections of Questions use by the calculation
		this.all={};
		this.childNodes=[];	
		
		//Html Control which content the result
		this.htmlControl=null;
		
		//Function use for the calculation
		this.calculationFunction='';
		
		this.init();
		
		//Add them into collection
		CalculationHandler.add(this);
	}

//Init the Calculation object with html elements
Calculation.prototype.init=function(){
		if (this.htmlControl && this.calculationFunction!='')return;
		this.htmlControl=document.getElementById(eCalculationHTMLId.calculationResult + this.id) || null;
		if (this.htmlControl){
				// Since 1.2.0 - Search calculation function in attributes or in the calculationFunction object
				this.calculationFunction = this.htmlControl.getAttribute(eCalculationHTMLAttributes.calculationFunction) || calculationFunction[this.id];
				var sOnExecuteMethod=this.htmlControl.getAttribute(eCalculationHTMLAttributes.onExecute);
				if (sOnExecuteMethod && sOnExecuteMethod!=''){
						sOnExecuteMethod += "(h,r);";
						this.onExecute=function(h,r) {
							eval(sOnExecuteMethod);
						};
					}
			}
		
	};
	
//Add the Question into the calculator group
Calculation.prototype.add=function(oQuestion){
		if (this.all[oQuestion.id])return this.all[oQuestion.id];
		this.all[oQuestion.id]=oQuestion;
		this.childNodes[this.childNodes.length]=this.all[oQuestion.id];
		//Add variables
		if (oQuestion.childNodes[0].htmlControl.getAttribute(eCalculationHTMLAttributes.varName)!=""){
				CalculationHandler.variables[oQuestion.childNodes[0].htmlControl.getAttribute(eCalculationHTMLAttributes.varName)]=oQuestion.childNodes[0].htmlControl;
			}
		//Execute the calculation when the page loading
		this.execute();
		return this.all[oQuestion.id];
	};

//Execute the calculation
Calculation.prototype.execute=function(){
		this.init();
		if (!this.htmlControl || this.calculationFunction=='')return;
		
		//Replace the variable in function
		var sFunction=this.calculationFunction;
		for (varName in CalculationHandler.variables){
				sFunction=replace(sFunction,varName,cvDkNa(CalculationHandler.variables[varName].value));
			}
		var result=null;
		try {
				result=eval(sFunction);
			}
		catch(ex){/* Do nothing */}
		if (result || result==0){
				this.htmlControl.innerHTML=result;
				this.onExecute(this.htmlControl,result);
			}
	};
//Events
Calculation.prototype.onExecute=function(htmlControl,result){/* RaiseEvent */};
/*global ActiveXObject, AskiaScript, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia FilterBox Scripts							  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| This file will manage the filter in the list of responses					  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2010						  |
|-----------------------------------------------------------------------------|
| Dependencies:																  |
|  + AskiaScript.js															  |
|  + Common.js																  |
|-----------------------------------------------------------------------------|
| 2010-05-17 |V 1.1.5														  |
|			 |+ INITIAL VERSION												  |
|-----------------------------------------------------------------------------|
| Created 2010-05-17 | All changes are in the log above. | Updated 2010-05-17 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|Askia - FilterBox - API Version 1.1.5			Copyright Askia © 1994-2010   |
\----------------------------------------------------------------------------*/

//Collection of filter box
var filterBoxHandler={
	all		:{},
	add		: function(oFilterBox){
		this.all[oFilterBox.id]=oFilterBox;
	}

};
//Filter box object
function filterBox(question){
	this.id=question.id;
	this.question=question;
	this._list =(this.question.isUseList)?this.question.childNodes[0].htmlControl:false;
	this._htmlControl=document.getElementById(eResponsePrefix.filter + this.id);
	
	//Filter option in arguments
	this._minLength =this._htmlControl.getAttribute("data-filterminlength") || 1;
	this._hideOnLoad=this._htmlControl.getAttribute("data-filterhideonload") || false;
	
	if (this._hideOnLoad)this.reset();

	this._isFiltering=false;
	this._lastText="";
	this._timer=null;
	var self=this;
	
	this._htmlControl.onkeyup=function(e){
		if (self._lastText != self._htmlControl.value){
			self.filter();
		}
	};
}
//Do the filter
filterBox.prototype.filter=function(){
	
	if (this._htmlControl.value.length < this._minLength){
		this.reset();
		return;
	}
	if (this._isFiltering){
		if (this._timer!=null){
			window.clearTimeout(this._timer);
		}
		this._timer=window.setInterval("filterBoxHandler[" + this.id + "].filter()",50);
		return;
	}
	this._isFiltering=true;
	this._lastText=this._htmlControl.value;
	if (this._list){
		this.filterList();
	}
	else {
		this.filterInput();
	}
	this._isFiltering=false;
};

//Reset the filter
filterBox.prototype.reset=function(){
	this._lastText="";
	if (this._list){
		this.resetList();
	}
	else {
		this.resetInput();
	}
};
// Return the minimum index to start with
filterBox.prototype._getListMinIndex = function _getListMinIndex() {
	var minIndex = (this.question.type == eQuestionType.single) ? 1 : 0,
		size = this._list.getAttribute("size");
	if (size) {
		size = parseInt(size);
		if (!isNaN(size) && size > 1) {
			return 0;
		}
	}
	return minIndex;
};
//Filter a list box
filterBox.prototype.filterList=function(){
	this._backupOptions();
	this.emptyList();
	var isAlreadySelected=this._getSelectedOptions();
	var reg= new RegExp(this._lastText,"gi");
	for (var i=0;i<this.question._backupOptions.length;i++){
		var str =this.question._backupOptions[i].text;
		if (!str.match(reg) || isAlreadySelected[this.question._backupOptions[i].value])continue ;
		this._list.options[this._list.options.length]=this.question._backupOptions[i];
	}
};

//Reset the filter
filterBox.prototype.resetList=function(){
	if (!this._hideOnLoad && !this.question._backupOptions)return;
	this._backupOptions();
	this.emptyList();
	if (this._hideOnLoad)return;
	var isAlreadySelected=this._getSelectedOptions();
	for (var i=0;i<this.question._backupOptions.length;i++){
		if (isAlreadySelected[this.question._backupOptions[i].value])continue;
		this._list.options[this._list.options.length]=this.question._backupOptions[i];
	}	
};

//Empty the list
filterBox.prototype.emptyList=function(){
	var minIndex=this._getListMinIndex();
	selectedOptions=[];
	for (var i=minIndex;i<this._list.options.length;i++){
		if (!this._list.options[i].selected)continue;
		selectedOptions[selectedOptions.length]=this._list.options[i];
	}
	this._list.options.length=minIndex;
	for (var i=0;i<selectedOptions.length;i++){
		this._list.options[this._list.options.length]=selectedOptions[i];
	}
};

//Returns an hash of selected options
filterBox.prototype._getSelectedOptions=function(){
	isAlreadySelected={};
	for (var i=0;i<this._list.options.length;i++){
		if (!this._list.options[i].selected)continue;
		isAlreadySelected[this._list.options[i].value]=true;
	}
	return isAlreadySelected;
};
//Make the backup of option for the list
filterBox.prototype._backupOptions=function(){
	if (this.question._backupOptions)return;
	this.question._backupOptions=[];
	var minIndex = this._getListMinIndex();
	for(var i=minIndex;i<this._list.options.length;i++){
		this.question._backupOptions[this.question._backupOptions.length]=this._list.options[i];
	}
};
//Filter input controls
filterBox.prototype.filterInput=function(){
	var reg= new RegExp(this._lastText,"gi");
	for (var i=0;i<this.question.childNodes.length;i++){
		var resp=this.question.childNodes[i];
		var str =resp.caption;
		var isVisible =(str.match(reg));
		if (resp.htmlControl.checked)isVisible =true;
		var isTd=(resp.htmlControl.parentNode.tagName.toLowerCase()=='td');
		var elt=(isTd)?resp.htmlControl.parentNode.parentNode:resp.htmlControl.parentNode;
			elt.style.display=(isVisible)?"":"none";
		if (!resp.customControl){
			resp.htmlControl.style.display=(isVisible)?"":"none";
		}
	}	
};
//Reset the filter
filterBox.prototype.resetInput=function(){
	var isDisplay=(this._hideOnLoad)?"none":"";

	for (var i=0;i<this.question.childNodes.length;i++){
		var resp=this.question.childNodes[i];
		var isTd=(resp.htmlControl.parentNode.tagName.toLowerCase()=='td');
		var elt=(isTd)?resp.htmlControl.parentNode.parentNode:resp.htmlControl.parentNode;
		var newDisplayStatus=(resp.htmlControl.checked)?"":isDisplay;
			elt.style.display=newDisplayStatus;
		if (!resp.customControl){
			resp.htmlControl.style.display=newDisplayStatus;
		}
	}
};
/*global ActiveXObject, AskiaScript, eQuestionType, eAskiaClass, QuestionHandler,  ErrorStack, eErrorDisplayMode, isIE, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia Ranking Objects							  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Manage the different ranking styles   									  |
| WARNING: This javascript only works with the ranking or sorted questions	  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2007						  |
|-----------------------------------------------------------------------------|
| Dependencies:																  |
|		- AskiaScript FrameWork (1.0.0)										  |
|       - Ranking.css                                                         |
|-----------------------------------------------------------------------------|
| 2007-09-20 |V 1.0.0														  |
|			 |+	Ranking buttons instead of checkboxes                         |
| 2007-11-13 |+ Add the RankingDragDrop object                                |
|-----------------------------------------------------------------------------|
| 2009-10-27 |V 1.1.2														  |
|			 |+	On ranking buttons, manage the change event of responses      |
|			 |+	On ranking buttons, add command refresh();					  |
|			 |+	On drag'n drop, manage the caption of response using caption  |
|-----------------------------------------------------------------------------|
| 2010-01-12 |V 1.1.3														  |
|			 |+	On ranking buttons, stop the propagation when the button      |
|			 |    is on clickable cell (cpt)								  |
|			 |+	On ranking buttons, validate max of responses				  |
|-----------------------------------------------------------------------------|
| 2010-06-02 |V 1.1.5														  |
|			 |+	Fix the ranking buttons on FF and Chrome				      |
|-----------------------------------------------------------------------------|
| 2011-01-20 |V 1.2.0													      |
|			 |+ Compatibilities with the new XHtml 1.0 generation			  |
| 2011-11-21 |+ Fix paddingLeft, paddingTop inversion in drag'n drop		  |
| 2015-03-17 |+ Add getPosition locally                                		  |
|-----------------------------------------------------------------------------|
| Created 2007-09-20 | All changes are in the log above. | Updated 2015-03-17 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
| WebProd - Ranking - API Version 1.2.0	    	Copyright Askia © 1994-2015   |
\----------------------------------------------------------------------------*/

///<summary>
///Enumerates the type of ranking
///</summary>
var eRankingType={
        ///<summary>
        ///No management of ranking
        ///</summary>
        NONE                :   0,
        ///<summary>
        ///Display the rank into the label
        ///</summary>
        DISPLAY_ON_LABEL    :   1,
        ///<summary>
        ///Use the drag'n drop UI (Use the plug-in RankingDragDrop)
        ///</summary>
        DRAG_DROP           :   2,
        ///<summary>
        ///Use the "Ranking buttons" instead of the checkboxes
        ///</summary>
        BUTTONS             :   3,
        ///<summary>
        ///Use lists to do the rank
        ///</summary>
        LISTS               :   4
    };
///<summary>
///Format of IDs for the ranking buttons
///</summary>
var _RANKING_BUTTONS_FORMAT_ID="btnRnk{0}_{1}";
///<summary>
///Style of ranking button
///</summary>
var RANKING_BUTTONS_STYLE="width:25px;height:25px;";
///<summary>
///Collections of ranking objects
///</summary>
var RankingHandler={
        ///<summary>
        ///Collection of ranking objects (use the id of ranking)
        ///</summary>
        all             : {},
        ///<summary>
        //Collection of ranking objects (use the index of ranking)
        ///</summary>
        childNodes      : [],
        ///<summary>
        ///Add the ranking in the collections
        ///</summary>
        add             : function(oRanking){
                if (this.all[oRanking.id])return this.all[oRanking.id];
                this.all[oRanking.id]=oRanking;
                this.childNodes[this.childNodes.length]=this.all[oRanking.id];
                return this.all[oRanking.id];
            }
    };
///<summary>
///Create a new ranking UI
///</summary>
///<param name="questionId">Id of question</param>
///<param name="oRankingType">Type of ranking (see the enumerator eRankingType)</param>
function Ranking(questionId,oRankingType){
    this.id=questionId;
    this.question=QuestionHandler.all[questionId];
    this.type=oRankingType || eRankingType.NONE;
    this._RankingDragDrop=null;
    this._RankingLists=null;
    RankingHandler.add(this);
    this._init();
}
///<summary>
///Initialize the UI
///</summary>
Ranking.prototype._init=function(){
    switch (this.type){
            case eRankingType.NONE:
            case eRankingType.DISPLAY_ON_LABEL:
                return;
            case eRankingType.DRAG_DROP:
                this._createRankingRankingDragDrop();
                break;
            case eRankingType.BUTTONS:
                this._createRankingButtons();
                break;
            case eRankingType.LISTS:
                this._createRankingLists();
                break;
        }
};
///<summary>
///Creates the UI to have the ranking with drag'n drop
///</summary>
Ranking.prototype._createRankingRankingDragDrop=function(){
    this._RankingDragDrop=new RankingDragDrop(this.question.id);
};
///<summary>
///Creates the UI to have the ranking buttons
///</summary>
Ranking.prototype._createRankingButtons=function(){
	//Refresh when the question changed
	var ptrOnChange=this.question.onchange;
	var _THIS=this;
	this.question.onchange=function(){
		_THIS.refresh();
		ptrOnChange();
	};
    for (var i=0;i<this.question.childNodes.length;i++){
            var resp=this.question.childNodes[i];
            var sBtnId=this._getButtonId(resp.id);
			var sClass = (this.question.isLive) ? ' class="' + eAskiaClass.live + '"' : '';
            resp.virtualControl.insertAdjacentHTML('beforebegin','<input' + sClass + ' onclick="RankingHandler.all[' + this.id +'].buttonClick(' + resp.id + ',event);return false;" style="' +  RANKING_BUTTONS_STYLE + '"  id="' + sBtnId + '" type="button" value="' + resp.htmlControl.value + ' "/>');
            resp.virtualControl.style.display="none";
			//Disable propagation when the button is on cell
			if (resp.htmlCaption){
					var isIncludeInCaption=false;
					for (var r=0;r<resp.htmlCaption.childNodes.length;r++){
							if (resp.htmlCaption.childNodes[r].toString()==resp.htmlCaption.innerText)continue;
							var elt=resp.htmlCaption.childNodes[r];
							if (!elt.getAttribute)continue;
							if (elt.getAttribute("id")==sBtnId){
									isIncludeInCaption =true;
									break;
								}
						}
					if (isIncludeInCaption){
						resp.htmlCaption.onclick = function () {
							return true;
						};
					}
				}                
        }
};
///<summary>
///Returns the id of button
///</summary>
Ranking.prototype._getButtonId=function(RespId){
	//Internal method to format the text 
    //(This method should be placed into the AskiaScript framework)
    function format(text){
            if (arguments.length<2)return text;
            for (var i=1;i<arguments.length;i++){
                    text= text.replace("{" + (i-1) + "}",arguments[i]);
                }
            return text;
        }


    return format(_RANKING_BUTTONS_FORMAT_ID,this.question.id,RespId);
};
///<summary>
///Manage the click on ranking button
///</summary>
Ranking.prototype.buttonClick=function(RespId,e){
	var resp=this.question.all[RespId];
		
	var restore_status=false;
	//Make the validation before to click on response
	//after that keep the click to fire error and restore the status
	if (ErrorStack.displayMode==eErrorDisplayMode.ONALERT && this.question.max){
			if (resp.isExclusive || !this.question._selRespById[RespId]){
				if (this.question._selRespByIndex.length==this.question.max){
						restore_status =true;
					}
			}
		}
    resp.virtualControl.checked=(!resp.virtualControl.checked);
    resp.click(e);
    if (restore_status){
			resp.virtualControl.checked=(!resp.virtualControl.checked);
			resp.click(e);
		}
	this.refresh();
};
///<summary>
///Refresh the button value
///</summary>
Ranking.prototype.refresh=function(){
    for (var i=0;i<this.question.childNodes.length;i++){
            var sBtnId=this._getButtonId(this.question.childNodes[i].id);
            document.getElementById(sBtnId).value=this.question.childNodes[i].htmlControl.value + " ";
        }
};
///<summary>
///Creates the UI to have the ranking lists
///</summary>
Ranking.prototype._createRankingLists=function(){
    this._RankingLists=new RankingLists(this.id);
};

/* --------------------------------*/
/*** RANKING WITH LISTS          ***/
/* ------------------------------*-*/
///<summary>
///Enumerates the suffix of html elements
///</summary>
var eRankingListsSuffix={
		///<summary>
		///Suffix of html container
		///</summary>
		container		:	'askia-list-',
		///<summary>
		///Source list
		///</summary>
		source          :   'askia-list-source-',
		///<summary>
		///Target list
		///</summary>
		target          :   'askia-list-target-'
    };
    
var _defaultStyleOfRankingListsButton=(isIE)?'font-family:webdings;width:25px':'width:75px';
///<summary>
///Collection of buttons to manage the lists
///</summary>
var RankingListsButtonsHandler={
    ///<summary>
    ///Button to select one response
    ///</summary>
    toAdd  : new RankingListsButtons (((isIE)?'4':'>'),'',_defaultStyleOfRankingListsButton),
    ///<summary>
    ///Button to remove one response
    ///</summary>
    toRemove : new RankingListsButtons (((isIE)?'3':'<'),'',_defaultStyleOfRankingListsButton),
    ///<summary>
    ///Button to remove all selected responses
    ///</summary>
    toRemoveAll : new RankingListsButtons (((isIE)?'7':'<<'),'',_defaultStyleOfRankingListsButton),
    ///<summary>
    ///Button to move up the response
    ///</summary>            
    toMoveUp    : new RankingListsButtons (((isIE)?'5':'UP'),'',_defaultStyleOfRankingListsButton),
    ///<summary>
    ///Button to move down the response
    ///</summary>                        
    toMoveDown  : new RankingListsButtons (((isIE)?'6':'DOWN'),'',_defaultStyleOfRankingListsButton)
};
///<summary>
///Buttons to manage the lists
///</summary>
function RankingListsButtons(text,src,style,title){
    this.text=text || '';
    this.src=src || '';
    this.style=style || '';
    this.title=title || '';
}
///<summary>
///Transform the object to html string
///</summary>
RankingListsButtons.prototype.toHTML=function(action, question){
	var sClass= (question.isLive) ? ' class="' + eAskiaClass.live + '"' : '';
    if (this.src==""){
            return '<input' + sClass + ' onclick="' + action  + '" type="button" style="' + this.style + '" value="' + this.text + '" title="' + this.title + '" />';
        }
    else {
            return '<img' + sClass + ' src="' + this.src + '" onclick="' + action  + '"  style="' + this.style + '" title="' + this.title + '" alt="' + this.title + '" />';
        } 
};
///<summary>
///Ranking lists
///</summary>
function RankingLists(questionId,sourceListStyle,targetListStyle){
	//Id of question
	this.id=questionId;
	//Style of lists
	this.sourceListStyle=sourceListStyle;
	this.targetListStyle=targetListStyle;
						
	//Handler to the question
	this.question=QuestionHandler.all[questionId];
		
	this.writeInContainer();
}
///<summary>
///Write the lists into the container
///</summary>    
RankingLists.prototype.writeInContainer=function(){
	var container = document.getElementById(eRankingListsSuffix.container + this.id); // 1.2
	if (!container) { // 1.1
		container = document.getElementById('-lst-' + this.id);
	}
	container.innerHTML=this.toHTML();
};
///<summary>
///Redefines the order of selected responses
///</summary>
RankingLists.prototype._fixOrder=function(){
	var order={};
	var nLength=this.question._selRespByIndex.length;
	//Keep the order in object order
	for (var i=0;i<nLength;i++){
		r=this.question._selRespByIndex[i];
		var n=parseInt(r.htmlControl.value)-1;		
		order[n]=r.id;
	}
	//Redefines the array according to the order
	for (var i=0;i<nLength;i++){
		this.question._selRespByIndex[i]=this.question._selRespById[order[i]];
	}
};
///<summary>
///Transform the object to HTML string
///</summary>
RankingLists.prototype.toHTML=function(){
    var MAX_VISIBLE_ELEMENT=10;
    var strSize=(this.question.childNodes.length>MAX_VISIBLE_ELEMENT)?MAX_VISIBLE_ELEMENT:this.question.childNodes.length;
        strSize =' size="' + strSize  + '"';
    var str='<table border="0" cellspacing="0" cellpadding="5">';
    str +='<tr><td vAlign="top">';
    str +='<select style="' +  this.sourceListStyle + '" id="' + eRankingListsSuffix.source  + this.id + '" ' + strSize + '>';
    for (var i=0;i<this.question.childNodes.length;i++){
            var r=this.question.childNodes[i];
            if (r.caption==''){
                    r.caption=r.htmlControl.parentNode.innerText;
                }
            if (r.htmlControl.value==''){
                    str +='<option value="' + r.id + '">' + r.caption + '</option>';
                }
        }
    str +='</select>';
    str +='</td><td vAlign="center">';
    str +='<div>' + RankingListsButtonsHandler.toAdd.toHTML('RankingHandler.all[\''+ this.id + '\']._RankingLists.addResponse(event);', this.question) + '</div>';
    str +='<div>' + RankingListsButtonsHandler.toRemove.toHTML('RankingHandler.all[\''+ this.id + '\']._RankingLists.removeResponse(event);', this.question) + '</div>';
    str +='<div>' + RankingListsButtonsHandler.toRemoveAll.toHTML('RankingHandler.all[\''+ this.id + '\']._RankingLists.removeAllResponses();', this.question) + '</div>';
    str +='</td><td vAlign="top">';
        strSize =(this.question.max>MAX_VISIBLE_ELEMENT)?MAX_VISIBLE_ELEMENT:this.question.max;
        strSize = ' size="' + strSize + '"';
    this._fixOrder();
    str +='<select style="' +  this.targetListStyle + '" id="' + eRankingListsSuffix.target  + this.id + '" ' + strSize + '>';
    for (var i=0;i<this.question._selRespByIndex.length;i++){
            var r=this.question._selRespByIndex[i];
            str +='<option value="' + r.id + '">' + r.caption + '</option>';
        }
    str +='</select>';
    str +='</td><td vAlign="center">';
    str +='<div>' + RankingListsButtonsHandler.toMoveUp.toHTML('RankingHandler.all[\''+ this.id + '\']._RankingLists.moveUp();', this.question) + '</div>';
    str +='<div>' + RankingListsButtonsHandler.toMoveDown.toHTML('RankingHandler.all[\''+ this.id + '\']._RankingLists.moveDown();', this.question) + '</div>';
    str +='</td></tr></table>';
    return str;       
};
///<summary>
///Returns the list
///</summary>
///<param name="listSuffix">Suffix of list</param>
RankingLists.prototype._getList=function(listSuffix){
	return document.getElementById(listSuffix  + this.id);
};
///<summary>
///Add selected response in target list
///</summary>
RankingLists.prototype.addResponse=function(e){
    var source=this._getList(eRankingListsSuffix.source);
    if (source.selectedIndex==-1)return; //No selection
    var selOpt=source.options[source.selectedIndex];
    var nRespId=selOpt.value;
    var target=this._getList(eRankingListsSuffix.target);
    target.options[target.options.length]=new Option(selOpt.text,selOpt.value,false,true);
    //Remove options from the source
    var nIndex=source.selectedIndex;
    source.options[nIndex]=null;      
    if (nIndex<source.options.length){
            source.selectedIndex=nIndex;
        }
    else if (source.options.length>0){
            source.selectedIndex=nIndex -1;   
        }              
    //Set the value to question
    var resp=this.question.all[nRespId];
    resp.virtualControl.checked=true;
    resp.click(e);           
};
///<summary>
///Remove selected response from target list
///</summary>
RankingLists.prototype.removeResponse=function(e){
    var target=this._getList(eRankingListsSuffix.target);
    if (target.selectedIndex==-1)return; //No selection
    var selOpt=target.options[target.selectedIndex];
    var nRespId=selOpt.value;
    var source=this._getList(eRankingListsSuffix.source);
    source.options[source.options.length]=new Option(selOpt.text,selOpt.value,false,true);
    //Remove options from the source
    var nIndex=target.selectedIndex;
    target.options[nIndex]=null;    
    if (nIndex<target.options.length){
            target.selectedIndex=nIndex;
        } 
    else if (target.options.length>0){
            target.selectedIndex=nIndex -1;   
        }        
    //Set the value to question
    var resp=this.question.all[nRespId];
    resp.virtualControl.checked=false;
    resp.click(e);        
};
///<summary>
///Remove all selected responses from target list
///</summary>    
RankingLists.prototype.removeAllResponses=function(){
    this.question.removeAllSelectedResponses();
    //Clear all options
    var target=this._getList(eRankingListsSuffix.target);
    while (target.options.length>0){
        target.options[0]=null;
    }
    var source=this._getList(eRankingListsSuffix.source);            
    while(source.options.length>0){  
        source.options[0]=null;
    }
       
    //Re-init with the original options (in good order)
    for (var i=0;i<this.question.childNodes.length;i++){
        var r=this.question.childNodes[i];
        source.options[source.options.length]=new Option(r.caption,r.id,false,false);
    }         
};
///<summary>
///Move the selected response up into the target list
///</summary>    
RankingLists.prototype.moveUp=function(){
    var target=this._getList(eRankingListsSuffix.target);
    if (target.selectedIndex<1)return;
    var nIndex=target.selectedIndex;
    var topValue=target.options[nIndex-1].value;
    var topText=target.options[nIndex-1].text;
    var selValue=target.options[nIndex].value;
    var selText=target.options[nIndex].text;
    //Swap the index into the final control
    this.question.all[topValue].htmlControl.value=nIndex + 1;
    this.question.all[selValue].htmlControl.value=nIndex;
    //Swap the options
    target.options[nIndex].text=topText;
    target.options[nIndex].value=topValue;
    target.options[nIndex-1].text=selText;
    target.options[nIndex-1].value=selValue;
    target.selectedIndex=nIndex-1;
};
///<summary>
///Move the selected response down into the target list
///</summary>    
RankingLists.prototype.moveDown=function(){
    var target=this._getList(eRankingListsSuffix.target);
    if (target.selectedIndex==-1)return;
    if (target.selectedIndex>(target.options.length-2))return;
    var nIndex=target.selectedIndex;
    var bottomValue=target.options[nIndex+1].value;
    var bottomText=target.options[nIndex+1].text;
    var selValue=target.options[nIndex].value;
    var selText=target.options[nIndex].text;
    //Swap the index into the final control
    this.question.all[bottomValue].htmlControl.value=nIndex + 1;
    this.question.all[selValue].htmlControl.value=nIndex + 2;
    //Swap the options
    target.options[nIndex + 1].text=selText;
    target.options[nIndex + 1].value=selValue;
    target.options[nIndex].text=bottomText;
    target.options[nIndex].value=bottomValue;
    target.selectedIndex=nIndex+1;
};

        
/* --------------------------------*/
/*** RANKING WITH DRAG'N DROP    ***/
/* ------------------------------*-*/

///<summary>
///Enumerates the suffix of html elements
///</summary>
var eRankingDragDropSuffix={
	///<summary>
	///Suffix of html element which can drag and drop
	///</summary>
	RankingDragDropItem	: '-RankingDragDropItem-',
	///<summary>
	///Suffix of html element of the drag zone
	///</summary>
	dragZone		:	'-drag-',
	///<summary>
	///Suffix of html element of the drop zone
	///</summary>
	dropZone		:   '-drop-'
};
///<summary>
///Enumerates the type of drag'n drop
///</summary>
var eRankingDragDropType={
		///<summary>
		///Type of drag'n drop
		///</summary>
		ranking		: 'ranking'
	};

///<summary>
///Collection of Drag'NDrop object for ranking
///</summary>
var RankingRankingDragDropHandler={
	///<summary>
	///Last selected RankingDragDrop object
	///</summary>
	lastSelection	: null,
	///<summary>
	///Number X to calculate the position X during drag'n drop
	///</summary>
	_dX				: 0,
	///<summary>
	///Number Y to calculate the position Y during the drag'n drop
	///</summary>
	_dY				: 0,
	///<summary>
	///Last z-Index of element to always have the item in top of others
	///</summary>
	_zIndex			: 2000,
	///<summary>
	///Drag element
	///</summary>
	///<param name="e">Event</param>
	drag			: function(e){
			if (!e)e=window.event;
			RankingRankingDragDropHandler.lastSelection.lastSelection.style.left=parseInt(e.screenX) - RankingRankingDragDropHandler._dX;
			RankingRankingDragDropHandler.lastSelection.lastSelection.style.top=parseInt(e.screenY) - RankingRankingDragDropHandler._dY;		
		},
	///<summary>
	///Drop element
	///</summary>
	///<param name="e">Event</param>
	drop			: function(e){
			if (!e)e=window.event;
			//Remove the events
			document.documentElement.onmousemove=null;
			document.documentElement.onmouseup=null;
			//Manage the drop event
			RankingRankingDragDropHandler.lastSelection.manageDropEvent(e);
		}
};

///<summary>
///Creates a new instance of behaviour object for the drag'n drop
///</summary>
function RankingDragDropBehaviour(){
		///<summary>
		///Type of drag'n drop
		///</summary>
		this.type=eRankingDragDropType.ranking;
		///<summary>
		///Default class of item
		///</summary>
		this.className="";
		///<summary>
		///Name of css class use by item during drag
		///</summary>
		this.dragClassName="";
		///<summary>
		///Name of css class use by item in drop zone
		///</summary>
		this.dropClassName="";
		///<summary>
		//Indicates if the drag item should always go back to the drag zone
		//when it was not dropped into the correct zone
		///</summary>
		this.alwaysBackToDragZone=false;		
		///<summary>
		///Height of item (in px)
		///</summary>
		this.height=25;
		///<summary>
		///Width of item (in px)
		///</summary>
		this.width=200;
		///<summary>
		///Vertical space (in px) between two items
		///</summary>
		this.topSpace=5;
		///<summary>
		///Horizontal space (in px) between two items
		///</summary>
		this.leftSpace=0;
		///<summary>
		///Left padding (in px)
		///</summary>
		this.paddingLeft=5;
		///<summary>
		///Top padding (in px)
		///</summary>	
		this.paddingTop=5;
	}

/* ---- CREATE THE DEFAULT BEHAVIOUR -------- */
var defaultRankingDragDropBehaviour=new RankingDragDropBehaviour();
	defaultRankingDragDropBehaviour.className="in-drag-zone";
	defaultRankingDragDropBehaviour.dragClassName="during-drag-event";
	defaultRankingDragDropBehaviour.dropClassName="in-drop-zone";
/* ~~~~~~~~~~~~~~~~~~~ */

///<summary>
///Creates the new drag and drop behaviour
///</summary>
///<param name="questionId">Id of question</param>
///<param name="behaviour">Behaviour of object</param>
function RankingDragDrop(questionId,behaviour){
		//Disabled the selection
		document.documentElement.onselectstart=function(){
			return false;
		};
		
		//Id of question
		this.id=questionId;
		
		//Behaviour of drag'n drop
		this.behaviour=behaviour || defaultRankingDragDropBehaviour;
				
		//Handler to the question
		this.question=QuestionHandler.all[questionId];
				
		//HTMLElement which represent the drag and drop zone
		this.dragZone=document.getElementById(eRankingDragDropSuffix.dragZone + questionId);
		if (!this.dragZone) this.dragZone = document.getElementById("askia" + eRankingDragDropSuffix.dragZone + questionId); // 1.2 -drag => askia-drag
		this.dropZone=document.getElementById(eRankingDragDropSuffix.dropZone + questionId);
		if (!this.dropZone) this.dropZone = document.getElementById("askia" + eRankingDragDropSuffix.dropZone + questionId); // 1.2 -drop => askia-drop
						
		//Last selected item
		this.lastSelection=null;
		
		//Write the zones
		this._writeZones();
	}
///<summary>
///Fix the order of responses in question
///</summary>
RankingDragDrop.prototype._fixOrder=function(){
	var order={};
	var nLength=this.question._selRespByIndex.length;
	//Keep the order in object order
	for (var i=0;i<nLength;i++){
			r=this.question._selRespByIndex[i];
			var n=parseInt(r.htmlControl.value)-1;		
			order[n]=r.id;
		}
	//Redefines the array according to the order
	for (var i=0;i<nLength;i++){
			this.question._selRespByIndex[i]=this.question._selRespById[order[i]];
		}
};

//Return the position of HTMLElement
//Example of use :
//var left=getPosition(document.getElementById("MyElement"),'left');
//var top=getPosition(document.getElementById("MyElement"),'top');
//alert("Left=>" + left + "px,Top=>" + top + "px");
RankingDragDrop.getPosition = function getPosition(htmlElt,pos){
    switch (String(pos).toLowerCase()) {
        case 'left' :
            var l=htmlElt.offsetLeft;
            var parent=htmlElt.parentNode;
            while (parent.offsetLeft){
                l +=parent.offsetLeft;
                parent=parent.parentNode;
            }
            return l;
            break;

        case 'top' :
            var t=htmlElt.offsetTop;
            if (isNS6)return t;
            var parent=htmlElt.parentNode;
            var previous=htmlElt;
            while (parent.offsetTop){
                //Don't calculate the position twice
                //For example if my element is a TD,
                //the offsetTop of TD is the same of the offsetTop of TR
                if (previous.offsetTop!=parent.offsetTop){
                    t +=parent.offsetTop;
                    previous=parent;
                }
                parent=parent.parentNode;
            }
            return t;
            break;
    }
};
///<summary>	
///Write the drag and drop zones
///</summary>
RankingDragDrop.prototype._writeZones=function(){
	//Add the deck element which content all items
	//this deck element is use to have a complete absolute coordinates
	//based on top 0, left 0
	var deck=document.createElement("DIV");
		deck.style.position="absolute";
		deck.style.left="0px";
		deck.style.top="0px";
		deck.style.width=this.dragZone.style.width;
		deck.style.height=this.dragZone.style.height;
	//Get the default positions
	var drgT=parseInt(this.dragZone.style.top);
		if (isNaN(drgT)){
		        drgT=RankingDragDrop.getPosition(this.dragZone,'top') + 20;
		        this.dragZone.style.top=drgT;
		    }
	var drgL=parseInt(this.dragZone.style.left);
		if (isNaN(drgL)){
		        drgL =RankingDragDrop.getPosition(this.dragZone, 'left') + 15;
		        this.dragZone.style.left=drgL;
		    }
	//Correct the height of dragzone
	var drgMinH=(this.question.childNodes.length * (this.behaviour.topSpace + this.behaviour.height)) + (this.behaviour.topSpace + this.behaviour.height);
	var drgH=parseInt(this.dragZone.style.height);
	if (isNaN(drgH)){    
		    this.dragZone.style.height=drgMinH;
		}
		else {
		    if (drgH<drgMinH)this.dragZone.style.height=drgMinH;
		}		        
	var t=drgT + this.behaviour.paddingTop;
	var l=drgL + this.behaviour.paddingLeft;
	var tIncrement=(this.behaviour.topSpace==0)?0:(this.behaviour.topSpace + this.behaviour.height);
	var lIncrement=(this.behaviour.leftSpace==0)?0:(this.behaviour.leftSpace + this.behaviour.width);
	//Initialize the position of drop zone
	var drpT=parseInt(this.dropZone.style.top);
	if (isNaN(drpT)){
		    drpT =RankingDragDrop.getPosition(this.dropZone, 'top') + 20;
		    this.dropZone.style.top=drpT;
		}
	var drpL=parseInt(this.dropZone.style.left);
	if (isNaN(drpL)) {
		    drpL =RankingDragDrop.getPosition(this.dropZone, 'left') + 15;
		    this.dropZone.style.left=drpL;
		}
	//Correct the height of drop zone
	var drpMinH=(!this.question.max)?drgMinH:(parseInt(this.question.max) * (this.behaviour.topSpace + this.behaviour.height)) + (this.behaviour.topSpace + this.behaviour.height);
	var drpH=parseInt(this.dropZone.style.height);
	if (isNaN(drpH)){    
		    this.dropZone.style.height=drpMinH;
		}
		else {
		    if (drpH<drpMinH)this.dropZone.style.height=drpMinH;
		}
	//HTML string
	var strHtml='';
	//Parse and put all responses in the drag zone
	for (var i=0;i<this.question.childNodes.length;i++){
			strHtml +=this._getResponseToHtml(this.question.childNodes[i],t,l);
			t +=tIncrement;
			l +=lIncrement;
		}
		
	//Set the HTML element
	deck.innerHTML=strHtml;
		
	document.body.appendChild(deck);
		
	//Attach the events
	this._attachEvents();
		
	//Set the selected item
	this._fixOrder();
	this._checkOrder();
};
///<summary>
///Attach the events on the HTMLElements
///</summary>
RankingDragDrop.prototype._attachEvents=function(){
	for (var i=0;i<this.question.childNodes.length;i++){
			var sId=this.question.childNodes[i].id;
			var elt=document.getElementById(eRankingDragDropSuffix.RankingDragDropItem + sId);
			elt._RankingDragDrop=this;
			elt._responseId=sId;
			elt._defaultLeft=parseInt(elt.style.left);
			elt._defaultTop=parseInt(elt.style.top);
			///<summary>
			///Begin the drag event
			///</summary>
			///param name="e">Event</param>
			elt.onmousedown=function(e){
				//Here the keyword 'this' represent the 
				//element which provoke the event
						
				//Set the last selection
				RankingRankingDragDropHandler.lastSelection=this._RankingDragDrop;
				this._RankingDragDrop.lastSelection=this;
						
				//Change the class of element
				if (this._RankingDragDrop.behaviour.dragClassName!=''){
						this.className=this._RankingDragDrop.behaviour.dragClassName;
					}
						
				//Calculate the numbers for the drag'n drop
				if (!e)e=window.event;
				RankingRankingDragDropHandler._dX=parseInt(e.screenX) - parseInt(this.style.left);
				RankingRankingDragDropHandler._dY=parseInt(e.screenY) - parseInt(this.style.top);
						
				//Increment the zIndex to always have the item in top of others
				RankingRankingDragDropHandler._zIndex++;
				this.style.zIndex=RankingRankingDragDropHandler._zIndex;
						
				//Attach the events for the drag and drop
				document.documentElement.onmousemove=RankingRankingDragDropHandler.drag;
				document.documentElement.onmouseup=RankingRankingDragDropHandler.drop;
			};
		}
};
///<summary>
///Transform the response to the HTML element
///</summary>
///<param name="response">Response item</param>
///<param name="top">Top position of element</param>
///<param name="left">Left position of element</param>
RankingDragDrop.prototype._getResponseToHtml=function(response,top,left){	
	//Build the html string
	var str='<div id="' + eRankingDragDropSuffix.RankingDragDropItem + response.id + '" class="' + this.behaviour.className + '" style="position:absolute;z-Index:1000;top:' + top + 'px;left:' + left + 'px;width:' + this.behaviour.width + 'px;height:' + this.behaviour.height + 'px;">';
		str += response.caption;
		str +='</div>';
	return str;
};
///<summary>
///Manage the drop event
///</summary>
///<param name="e">Event</param>
RankingDragDrop.prototype.manageDropEvent=function(e){
	//Defines where the element is over
	var isOverDrag=this._isOverZone(this.dragZone);
	var isOverDrop=this._isOverZone(this.dropZone);
		
	//Correct the drop event according to the max number of responses
	if (this.question._selRespByIndex.length>=this.question.max && !this.question._selRespById[this.lastSelection._responseId]){
			isOverDrag=true;
			isOverDrop=false;
		}
		
	//Always go back to the drag zone when the element is not on drop zone
	if (this.alwaysBackToDragZone && !isOverDrop){
			isOverDrag =true;
		}
		
	if (isOverDrop){
			this.addResponse(this.lastSelection._responseId,e);
		}
	else {				
			this.removeResponse(this.lastSelection._responseId,isOverDrag,e);
		}
	if (this.question.isLive) {
		AskiaScript.executeLiveRouting();
	}

	//Erase the last selection
	this.lastSelection=null;
};
///<summary>
///Insert response according to the focused item
///</summary>
///<param name="responseId">Id of response which want to add</param>
RankingDragDrop.prototype.addResponse=function(responseId,e){
	var focusedIndex=this._getIndexOfFocusedItem();
	//Search the index of response
	var index=null;
	if (this.question._selRespById[responseId]){
			for (var i=0;i<this.question._selRespByIndex.length;i++){
					if (this.question._selRespByIndex[i].id==responseId){
							index=i;
							break;
						}
				}
		}
				
	//Add a new element at the end
	if (index==null && focusedIndex==null){
			index=this.question._selRespByIndex.length;
			//Add the response
			var r= this.question.all[responseId];
			r.htmlControl.value=index + 1;
			if (r.virtualControl){
					r.virtualControl.checked=true;
					r.click(e);	
				}
			else{
				r.blur(e);
			}
			this._setPositionInDrop(responseId,index);
			return;
		}
		
	//Add a new element or move element in the middle
	if (focusedIndex!=null){
			//To move the element delete them before
			if (index!=null){
				//Remove the dragged element
				var arrDummyFirstPart=this.question._selRespByIndex.slice(0,index);
				var arrDummyLastPart=this.question._selRespByIndex.slice(index +1,this.question._selRespByIndex.length);
				var arrDummy= arrDummyFirstPart.concat(arrDummyLastPart);
				this.question._selRespByIndex=arrDummy;
			}
				
		
			var arrDummyFirstPart=this.question._selRespByIndex.slice(0,focusedIndex); 
			var arrDummyLastPart=this.question._selRespByIndex.slice(focusedIndex,this.question._selRespByIndex.length);
			//Add  element into the first part
			this.question._selRespById[responseId]=this.question.all[responseId];
			arrDummyFirstPart[arrDummyFirstPart.length]=this.question._selRespById[responseId];
			//Concat two part
			this.question._selRespByIndex=arrDummyFirstPart.concat(arrDummyLastPart);	
		}		
				
	//Check the order
	this._checkOrder();
};
///<summary>
///Remove the response from the selection
///Back the item to drag zone
///</summary>
///<param name="responseId">Id of response which want to reset</param>
///<param name="isOverDrag">Indicates if the element should go back to the drag zone</param>
RankingDragDrop.prototype.removeResponse=function(responseId,isOverDrag,e){
	var elt=document.getElementById(eRankingDragDropSuffix.RankingDragDropItem + responseId);
	//Reset the positions of element
	if (isOverDrag){
			elt.style.left=elt._defaultLeft;
			elt.style.top=elt._defaultTop;
		}
	//Change the class of element
	elt.className=this.behaviour.className;
		
	//Clear the response
	if (!this.question._selRespById[responseId])return;
	var r= this.question.all[responseId];
	r.htmlControl.value='';
	if (r.virtualControl){
			r.virtualControl.checked=false;
			r.click(e);
		}
	else {
		r.blur(e);
	}
	this._checkOrder();
};
///<summary>
///Get the focused item to change the order when it's necessary
///</summary>
RankingDragDrop.prototype._getIndexOfFocusedItem=function(){
	if (!this.question.isSorted)return null;
	if (!this.lastSelection)return null;
	var elt=this.lastSelection;
	for (var i=0;i<this.question._selRespByIndex.length;i++){
			var sId=this.question._selRespByIndex[i].id;
			if (this.lastSelection._responseId==sId)continue;
			var eltTest=document.getElementById(eRankingDragDropSuffix.RankingDragDropItem + sId);
			if (this._isOverZone(eltTest)){
					return i;
				}
		}
	return null;
};
///<summary>
///Returns true when the element is over the zone
///</summary>
///<param name="oZone">Zone which want to test</param>
RankingDragDrop.prototype._isOverZone=function(oZone){
	var elt=this.lastSelection;
	var l=parseInt(elt.style.left) + (parseInt(elt.offsetWidth)/2);
	var lZone=parseInt(oZone.style.left);
	var wZone=parseInt(oZone.style.width);
	if (l<lZone)return false;
	if (l>(lZone + wZone))return false;
	var t=parseInt(elt.style.top) + (parseInt(elt.offsetHeight)/2);
	var tZone=parseInt(oZone.style.top);
	var hZone=parseInt(oZone.style.height);
	if (t<tZone)return false;
	if (t>(tZone + hZone))return false;
	return true;
};	
///<summary>
///Set the position of item in the drop zone
///</summary>
///<param name="responseId">Id of response which want to add</param>
///<param name="index">Order of response</param>
RankingDragDrop.prototype._setPositionInDrop=function(responseId,index){				
	//Calculate the position of element
	var lDropZone=parseInt(this.dropZone.style.left);
	var tDropZone=parseInt(this.dropZone.style.top);
	var dTop=(this.behaviour.topSpace==0)?0:(index * (this.behaviour.topSpace + this.behaviour.height));
	var dLeft=(this.behaviour.leftSpace==0)?0:(index * (this.behaviour.leftSpace + this.behaviour.width));
	
	var t=tDropZone + dTop  + this.behaviour.paddingTop;
	var l=lDropZone + dLeft +  this.behaviour.paddingLeft;
		
	var elt=document.getElementById(eRankingDragDropSuffix.RankingDragDropItem + responseId);
	elt.style.top=t;
	elt.style.left=l;	
		
	//Change the class of element
	elt.className=(this.behaviour.dropClassName!='')?this.behaviour.dropClassName:this.behaviour.className;
};

///<summary>
///Verify the order of element
///</summary>
RankingDragDrop.prototype._checkOrder=function(){
	for (var i=0;i<this.question._selRespByIndex.length;i++){
			var r=this.question._selRespByIndex[i];
			//Correct the html elements
			if (r.virtualControl)r.virtualControl.checked=true;	
			r.htmlControl.value=(i+1);		
			//Set the position of element
			this._setPositionInDrop(r.id,i);
		}
};


/*global AskiaScript, serializeForm, ActiveXObject:true */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia Chapters Menu Scripts						  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| Creates a menu with the list of chapters									  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2011						  |
|-----------------------------------------------------------------------------|
| Dependencies:																  |
|  + AskiaScript.js (1.2.0)													  |
|-----------------------------------------------------------------------------|
| 2011-05-24 |V 1.2.0														  |
|			 |+ INITIAL VERSION												  |
|			 |	> Creates the menu using AJAX query							  |
|			 |	> Navigate through chapters using HTTP Post request			  |			
|-----------------------------------------------------------------------------|
| Created 2011-05-24 | All changes are in the log above. | Updated 2011-05-24 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|Askia - Chapters Menu - API Version 1.2.0		Copyright Askia © 1994-2011   |
\----------------------------------------------------------------------------*/

if (AskiaScript) {
	
	/**
	 * Creates the list of chapters
	 *
	 * @param {Object} def Definition of chapters
	 */
	AskiaScript.updateChapters = function (def) {
		AskiaScript.chapters = []; // Collection of chapters
		if (!$.isPlainObject(def) || !def.chapters || !def.chapters.length) {
			return;
		}

		var i, l, chapter, str = [], classes;
		for (i = 0, l = def.chapters.length; i < l; i += 1) {	
			chapter = def.chapters[i];
			AskiaScript.chapters[i] = chapter; // Register the chapter

			classes = [];
			str.push('<li');
			if (chapter.done && chapter.done === 100) {
				classes.push("complete");	
			} 
			if (chapter.current) {
				classes.push("current");
			}
			if (classes.length) {
				str.push(' class="' +  classes.join(' ') + '"');
			}
			str.push('>');
			str.push('<a href="#" class="askia-chapter" id="askia-chapter-' + i + '">');
			str.push(chapter.caption);
			str.push('</a>');
			str.push('<div class="askia-chapter-progress"><div style="width:' + chapter.done + '%"></div></div>');
			str.push('</li>');
		}

		// Update the DOM
		$("#askia-chapters").html(str.join(''));
	};

	/**
	 * Go to a given chapter
	 * This method is fire by the link of chapter
	 * The keyword 'this' refer to the link clicked
	 */
	AskiaScript.gotoChapter = function (e) {
		e.stopImmediatePropagation();
		e.preventDefault();

		var index = parseInt($(this).attr('id').replace(/askia\-chapter\-/gi, ''), 10),
			chapter;
		if (!isNaN(index) && index >= 0 && index < AskiaScript.chapters.length) {
			chapter = AskiaScript.chapters[index];
			$("input[name=MfcISAPICommand], input[name=Action]").val("GoTo");
			if (!$("input[name=Action]").length) {
				$("form[name=FormAskia]").append('<input type="hidden" name="action" value="GoTo" />');
			}
			$("form[name=FormAskia]").append('<input type="hidden" name="shortcut" />');
			$("input[name=shortcut]").val(chapter.shortcut);
			$("input[name=Next]").click();
		}

		return false;
	};

	// When the DOM is loaded ask to update the chapters
	$(function () {
		if ($("#askia-chapters").length) {
			var classes = $("#askia-chapters").attr("class");
			if (!classes) { // Add the default style
				$("#askia-chapters").addClass("default");
			}

			// Delay the execution of getChapters
			var timeout = (AskiaScript.isLocal) ? 500 : 0;
			setTimeout(function () {
				AskiaScript.ajax(serializeForm("getChapters"));
			}, timeout);

			$("#askia-chapters").delegate(".askia-chapter", "click", AskiaScript.gotoChapter);
		}
	});

}
/*global ActiveXObject, AskiaScript, CURSOR_WAIT, isOpera, KEY_ENTER, ValidatorSummary, ErrorStack, QuestionHandler, replace */
/*jshint evil:true,bitwise:false,proto:true,nomen:false,strict:false,globalstrict:false,onevar:false,white:false,plusplus:false,eqeq:false*/
/*----------------------------------------------------------------------------\
|							Askia Navigator Objects							  |
|-----------------------------------------------------------------------------|
|                          Created by Askia Company							  |
|							(http://www.askia.com)							  |
|-----------------------------------------------------------------------------|
| The Navigator manage the navigation into the questionnaire				  |
|-----------------------------------------------------------------------------|
|							Copyright Askia © 1994-2006						  |
|-----------------------------------------------------------------------------|
| AskiaScript.js															  |
| FieldValidator.js															  |
|-----------------------------------------------------------------------------|
| 2006-05-23 |V 1.0.0														  |
|			 |+ Attach the event on button Next								  |
|-----------------------------------------------------------------------------|
| 2007-05-29 |V 1.0.1														  |
|			 |+ Disable the form during submittion							  |
|-----------------------------------------------------------------------------|
| 2007-01-11 |V 1.1.0														  |
|			 |+ Corrrection: Block the previous of browser into AskiaScript.js|
|-----------------------------------------------------------------------------|
| 2015-10-13 |V 1.1.1														  |
|			 |+ Fix: Bugs when hit the key 'ENTER' twice and quickly  		  |
|-----------------------------------------------------------------------------|
| Created 2006-05-29 | All changes are in the log above. | Updated 2015-10-13 |
|-----------------------------------------------------------------------------|
|														All rights reserved	  |
|Askia - Navigator - API Version 1.1.1			Copyright Askia © 1994-2015   |
\---------------------------------------------------------------------------- */

/* === 
	Enumerator with the name of button
=== */
var eNavigatorButtonName={
		PREVIOUS	: 'Previous',
		PAUSE		: 'Pause',
		NEXT		: 'Next'
	};

/* ===
	Navigator Handler object
===	*/
var NavigatorHandler={
		//Collection of buttons
		buttons			:	{},
		
		//True when the we should cancel the submittion
		_cancelSubmit	: false,
		
		//Initialize the buttons collection
		init			:	function(){				
				//Reference all navigation buttons
				for (var btn in eNavigatorButtonName){
						if (document.getElementsByName(eNavigatorButtonName[btn])[0]){
								this.buttons[eNavigatorButtonName[btn]]=new NavigatorButton(eNavigatorButtonName[btn]);
							}				
					}
					
				//Set the action of key enter to the next button
				document.documentElement.onkeydown=NavigatorHandler.keydown;
				document.FormAskia.onsubmit=function(e){
						if (!e)e=window.event;
						//When the submittion is alreay in process 
						//lock other attempts
						if (document.documentElement.style.cursor==CURSOR_WAIT)return false;												
						var elt=(e.target)?e.target:e.srcElement;
						if (elt.tagName=="FORM" && !isOpera){
								//Lock the next submittions
								NavigatorHandler._disableForm();
								return true;						
							}
						if (NavigatorHandler._cancelSubmit){
								NavigatorHandler._cancelSubmit=false;
								e.cancelBubble=true;
								if (e.preventDefault)e.preventDefault();
								if (e.stopPropagation)e.stopPropagation();
								e.returnValue=false;
								return false;
							}
						//Lock the next submittions
						NavigatorHandler._disableForm();														
						return true;
					};
			},
		
		//Manage the key down event
		keydown		: function(e){
				if (!e)e=window.event;
				//When the submittion is alreay in process 
				//lock other attempts
				if (document.documentElement.style.cursor==CURSOR_WAIT)return true;				
				var elt=(e.target)?e.target:e.srcElement;
				if (e.keyCode!=KEY_ENTER)return true;	
				if (elt.tagName=="TEXTAREA")return true;							
				if (elt.tagName!="SELECT" && NavigatorHandler.buttons[eNavigatorButtonName.NEXT]){
						NavigatorHandler._disableForm();				
						NavigatorHandler.buttons[eNavigatorButtonName.NEXT].click(e,true);
					}
				e.cancelBubble=true;
				if (e.preventDefault)e.preventDefault();
				if (e.stopPropagation)e.stopPropagation();
				e.returnValue=false;
				return false;				
			},

		//Disable form during the submition
		_disableForm	: function(){
					NavigatorHandler._cancelSubmit=true;
					document.documentElement.style.cursor=CURSOR_WAIT;
			},
		

		//Manage the click on button
		click			: function(e){
				if (!e)e=window.event;
				var htmlElt=this;
				var navButton=htmlElt._navButton;
				if (!navButton)return;
				navButton.click(e);					
			}
	};

/* ====
	Navigator button object
=== */
//Constructor
function NavigatorButton(id){
		this.id=id;
		this.htmlControl=document.getElementsByName(this.id)[0];
		
		//Attach the events and the properties on button
		this.htmlControl._navButton=this;
		this.htmlControl.onclick=NavigatorHandler.click;
	}
//Manage the click event on button
NavigatorButton.prototype.click=function(e,isSubmit){		
	if (this.id!=eNavigatorButtonName.NEXT)return true;
	if (!e)e=window.event;
		
	if (!ValidatorSummary)return true;	//Don't manage this type of error (classical behaviour)
	var isOk=ValidatorSummary.validate();
	if (!isOk){			
			NavigatorHandler._cancelSubmit=true;
			if (isOpera){
					setTimeout("NavigatorHandler._cancelSubmit=false;",100);
				}
			e.cancelBubble =true;
			if (e.preventDefault)e.preventDefault();
			if (e.stopPropagation) e.stopPropagation();	
			e.returnValue=false;
			ValidatorSummary.focus();
			return false;
		}
			
	NavigatorHandler._cancelSubmit=false;
	if (isSubmit)document.FormAskia.submit();
	return true;
};

//Init navigation
AskiaScript.initNavigation();