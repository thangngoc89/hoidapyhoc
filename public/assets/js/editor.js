/*!
 * froala_editor v1.2.6 (http://editor.froala.com)
 * License http://editor.froala.com/license
 * Copyright 2014-2015 Froala Labs
 */
if("undefined"==typeof jQuery)throw new Error("Froala requires jQuery");!function(a){"use strict";var b=function(c,d){return this.options=a.extend({},b.DEFAULTS,a(c).data(),"object"==typeof d&&d),this.options.unsupportedAgents.test(navigator.userAgent)?!1:(this.valid_nodes=a.merge([],b.VALID_NODES),this.valid_nodes=a.merge(this.valid_nodes,a.map(Object.keys(this.options.blockTags),function(a){return a.toUpperCase()})),this.browser=b.browser(),this.disabledList=[],this._id=++b.count,this._events={},this.blurred=!0,this.$original_element=a(c),this.document=c.ownerDocument,this.window="defaultView"in this.document?this.document.defaultView:this.document.parentWindow,this.$document=a(this.document),this.$window=a(this.window),this.br=this.browser.msie&&a.Editable.getIEversion()<=10?"":"<br/>",this.init(c),void a(c).on("editable.focus",a.proxy(function(){for(var b=1;b<=a.Editable.count;b++)b!=this._id&&this.$window.trigger("blur."+b)},this)))};b.initializers=[],b.count=0,b.VALID_NODES=["P","DIV","LI","TD","TH"],b.LANGS=[],b.INVISIBLE_SPACE="&#x200b;",b.DEFAULTS={allowComments:!0,allowScript:!1,allowStyle:!1,allowedAttrs:["accept","accept-charset","accesskey","action","align","alt","async","autocomplete","autofocus","autoplay","autosave","background","bgcolor","border","charset","cellpadding","cellspacing","checked","cite","class","color","cols","colspan","content","contenteditable","contextmenu","controls","coords","data","data-.*","datetime","default","defer","dir","dirname","disabled","download","draggable","dropzone","enctype","for","form","formaction","headers","height","hidden","high","href","hreflang","http-equiv","icon","id","ismap","itemprop","keytype","kind","label","lang","language","list","loop","low","max","maxlength","media","method","min","multiple","name","novalidate","open","optimum","pattern","ping","placeholder","poster","preload","pubdate","radiogroup","readonly","rel","required","reversed","rows","rowspan","sandbox","scope","scoped","scrolling","seamless","selected","shape","size","sizes","span","src","srcdoc","srclang","srcset","start","step","summary","spellcheck","style","tabindex","target","title","type","translate","usemap","value","valign","width","wrap"],allowedTags:["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","blockquote","br","button","canvas","caption","cite","code","col","colgroup","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","menu","menuitem","meter","nav","noscript","object","ol","optgroup","option","output","p","param","pre","progress","queue","rp","rt","ruby","s","samp","script","section","select","small","source","span","strike","strong","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr"],alwaysBlank:!1,alwaysVisible:!1,autosave:!1,autosaveInterval:1e4,beautifyCode:!0,blockTags:{n:"Normal",blockquote:"Quote",pre:"Code",h1:"Heading 1",h2:"Heading 2",h3:"Heading 3",h4:"Heading 4",h5:"Heading 5",h6:"Heading 6"},buttons:["bold","italic","underline","strikeThrough","fontSize","fontFamily","color","sep","formatBlock","blockStyle","align","insertOrderedList","insertUnorderedList","outdent","indent","sep","createLink","insertImage","insertVideo","insertHorizontalRule","undo","redo","html"],crossDomain:!0,convertMailAddresses:!0,customButtons:{},customDropdowns:{},customText:!1,defaultTag:"P",direction:"ltr",disableRightClick:!1,editInPopup:!1,editorClass:"",formatTags:["p","pre","blockquote","h1","h2","h3","h4","h5","h6","div","ul","ol","li","table","tbody","thead","tfoot","tr","th","td","body","head","html","title","meta","link","base","script","style"],headers:{},height:"auto",icons:{},inlineMode:!0,initOnClick:!1,fullPage:!1,language:"en_us",linkList:[],linkText:!1,linkClasses:{},linkAutoPrefix:"",maxHeight:"auto",minHeight:"auto",multiLine:!0,noFollow:!0,paragraphy:!0,placeholder:"Type something",plainPaste:!1,preloaderSrc:"",saveURL:null,saveParams:{},saveRequestType:"POST",scrollableContainer:"body",simpleAmpersand:!1,shortcuts:!0,shortcutsAvailable:["show","bold","italic","underline","createLink","insertImage","indent","outdent","html","formatBlock n","formatBlock h1","formatBlock h2","formatBlock h3","formatBlock h4","formatBlock h5","formatBlock h6","formatBlock blockquote","formatBlock pre","strikeThrough"],showNextToCursor:!1,spellcheck:!1,theme:null,toolbarFixed:!0,trackScroll:!1,unlinkButton:!0,useClasses:!0,tabSpaces:!0,typingTimer:500,pastedImagesUploadRequestType:"POST",pastedImagesUploadURL:"http://i.froala.com/upload_base64",unsupportedAgents:/Opera Mini/i,useFrTag:!1,width:"auto",withCredentials:!1,zIndex:2e3},b.prototype.destroy=function(){this.sync(),this.options.useFrTag&&this.addFrTag(),this.hide(),this.isHTML&&this.html(),this.$bttn_wrapper&&this.$bttn_wrapper.html("").removeData().remove(),this.$editor&&this.$editor.html("").removeData().remove(),this.raiseEvent("destroy"),this.$popup_editor&&this.$popup_editor.html("").removeData().remove(),this.$placeholder&&this.$placeholder.html("").removeData().remove(),clearTimeout(this.ajaxInterval),clearTimeout(this.typingTimer),this.$element.off("mousedown mouseup click keydown keyup cut copy paste focus keypress touchstart touchend touch drop"),this.$element.off("mousedown mouseup click keydown keyup cut copy paste focus keypress touchstart touchend touch drop","**"),this.$window.off("mouseup."+this._id),this.$window.off("keydown."+this._id),this.$window.off("keyup."+this._id),this.$window.off("blur."+this._id),this.$window.off("hide."+this._id),this.$window.off("scroll."+this._id),this.$window.off("resize."+this._id),this.$window.off("orientationchange."+this._id),this.$document.off("selectionchange."+this._id),this.$original_element.off("editable"),void 0!==this.$upload_frame&&this.$upload_frame.remove(),this.$textarea&&(this.$box.remove(),this.$textarea.removeData("fa.editable"),this.$textarea.show());for(var a in this._events)delete this._events[a];this.$placeholder&&this.$placeholder.remove(),this.isLink?this.$element.removeData("fa.editable"):(this.$wrapper?this.$wrapper.replaceWith(this.getHTML(!1,!1)):this.$element.replaceWith(this.getHTML(!1,!1)),this.$box&&!this.editableDisabled&&(this.$box.removeClass("froala-box f-rtl"),this.$box.find(".html-switch").remove(),this.$box.removeData("fa.editable"),clearTimeout(this.typingTimer))),this.$lb&&this.$lb.remove()},b.prototype.triggerEvent=function(b,c,d,e){void 0===d&&(d=!0),void 0===e&&(e=!1),d===!0&&(this.isResizing()||this.editableDisabled||this.imageMode||!e||this.cleanify(),this.sync());var f=!0;return c||(c=[]),f=this.$original_element.triggerHandler("editable."+b,a.merge([this],c)),void 0===f?!0:f},b.prototype.syncStyle=function(){if(this.options.fullPage){var a=this.$element.html().match(/\[style[^\]]*\].*\[\/style\]/gi);if(this.$document.find("head style[data-id]").remove(),a)for(var b=0;b<a.length;b++)this.$document.find("head").append(a[b].replace(/\[/gi,"<").replace(/\]/gi,">"))}},b.prototype.sync=function(){if(!this.isHTML){this.raiseEvent("sync"),this.disableImageResize(),this.isLink||this.isImage||this.checkPlaceholder();var a=this.getHTML(!1,!1);this.trackHTML!==a&&null!=this.trackHTML?(this.refreshImageList(),this.refreshButtons(),this.trackHTML=a,this.$textarea&&this.$textarea.val(a),this.doingRedo||this.saveUndoStep(),this.triggerEvent("contentChanged",[],!1)):null==this.trackHTML&&(this.trackHTML=a),this.syncStyle()}},b.prototype.emptyElement=function(b){if("IMG"==b.tagName||a(b).find("img").length>0)return!1;if(a(b).find("input, iframe").length>0)return!1;for(var c=a(b).text(),d=0;d<c.length;d++)if("\n"!==c[d]&&"\r"!==c[d]&&"	"!==c[d]&&8203!=c[d].charCodeAt(0))return!1;return!0},b.prototype.initEvents=function(){this.mobile()?(this.mousedown="touchstart",this.mouseup="touchend",this.move="touchmove"):(this.mousedown="mousedown",this.mouseup="mouseup",this.move="")},b.prototype.initDisable=function(){this.$element.on("keypress keydown keyup",a.proxy(function(a){return this.isDisabled?(a.stopPropagation(),a.preventDefault(),!1):void 0},this))},b.prototype.continueInit=function(){this.initDisable(),this.initEvents(),this.browserFixes(),this.handleEnter(),this.editableDisabled||(this.initUndoRedo(),this.enableTyping(),this.initShortcuts()),this.initTabs(),this.initEditor();for(var b=0;b<a.Editable.initializers.length;b++)a.Editable.initializers[b].call(this);this.initOptions(),this.initEditorSelection(),this.initAjaxSaver(),this.setLanguage(),this.setCustomText(),this.editableDisabled||this.registerPaste(),this.refreshDisabledState(),this.refreshUndo(),this.refreshRedo(),this.initPopupSubmit(),this.initialized=!0,this.triggerEvent("initialized",[],!1,!1)},b.prototype.initPopupSubmit=function(){this.$popup_editor.find(".froala-popup input").keydown(function(b){var c=b.which;13==c&&(b.preventDefault(),b.stopPropagation(),a(this).blur(),a(this).parents(".froala-popup").find("button.f-submit").click())})},b.prototype.lateInit=function(){this.saveSelectionByMarkers(),this.continueInit(),this.restoreSelectionByMarkers(),this.$element.focus(),this.hideOtherEditors()},b.prototype.init=function(b){this.options.paragraphy||(this.options.defaultTag="DIV"),this.initElement(b),this.initElementStyle(),(!this.isLink||this.isImage)&&(this.initImageEvents(),this.buildImageMove()),this.options.initOnClick?(this.editableDisabled||(this.$element.attr("contenteditable",!0),this.$element.attr("spellcheck",!1)),this.$element.bind("mousedown.element focus.element",a.proxy(function(a){return this.isLink||a.stopPropagation(),this.isDisabled?!1:(this.$element.unbind("mousedown.element focus.element"),void this.lateInit())},this))):this.continueInit()},b.prototype.phone=function(){var a=!1;return function(b){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(b)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0,4)))&&(a=!0)}(navigator.userAgent||navigator.vendor||window.opera),a},b.prototype.mobile=function(){return this.phone()||this.android()||this.iOS()||this.blackberry()},b.prototype.iOS=function(){return/(iPad|iPhone|iPod)/g.test(navigator.userAgent)},b.prototype.iOSVersion=function(){if(/iP(hone|od|ad)/.test(navigator.platform)){var a=navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),b=[parseInt(a[1],10),parseInt(a[2],10),parseInt(a[3]||0,10)];if(b&&b[0])return b[0]}return 0},b.prototype.iPad=function(){return/(iPad)/g.test(navigator.userAgent)},b.prototype.iPhone=function(){return/(iPhone)/g.test(navigator.userAgent)},b.prototype.iPod=function(){return/(iPod)/g.test(navigator.userAgent)},b.prototype.android=function(){return/(Android)/g.test(navigator.userAgent)},b.prototype.blackberry=function(){return/(Blackberry)/g.test(navigator.userAgent)},b.prototype.initOnTextarea=function(b){this.$textarea=a(b),void 0!==this.$textarea.attr("placeholder")&&"Type something"==this.options.placeholder&&(this.options.placeholder=this.$textarea.attr("placeholder")),this.$element=a("<div>").html(this.$textarea.val()),this.$textarea.before(this.$element).hide(),this.$textarea.parents("form").bind("submit",a.proxy(function(){this.isHTML?this.html():this.sync()},this)),this.addListener("destroy",a.proxy(function(){this.$textarea.parents("form").unbind("submit")},this))},b.prototype.initOnLink=function(b){this.isLink=!0,this.options.linkText=!0,this.selectionDisabled=!0,this.editableDisabled=!0,this.options.buttons=[],this.$element=a(b),this.options.paragraphy=!1,this.options.countCharacters=!1,this.$box=this.$element},b.prototype.initOnImage=function(b){var c=a(b).css("float");"A"==a(b).parent().get(0).tagName&&(b=a(b).parent()),this.isImage=!0,this.editableDisabled=!0,this.imageList=[],this.options.buttons=[],this.options.paragraphy=!1,this.options.imageMargin="auto",a(b).wrap("<div>"),this.$element=a(b).parent(),this.$element.css("display","inline-block"),this.$element.css("max-width","100%"),this.$element.css("margin-left","auto"),this.$element.css("margin-right","auto"),this.$element.css("float",c),this.$element.addClass("f-image"),this.$box=a(b)},b.prototype.initForPopup=function(b){this.$element=a(b),this.$box=this.$element,this.editableDisabled=!0,this.options.countCharacters=!1,this.options.buttons=[],this.$element.on("click",a.proxy(function(a){a.preventDefault()},this))},b.prototype.initOnDefault=function(b){"DIV"!=b.tagName&&this.options.buttons.indexOf("formatBlock")>=0&&this.disabledList.push("formatBlock"),this.$element=a(b)},b.prototype.initElement=function(b){if("TEXTAREA"==b.tagName?this.initOnTextarea(b):"A"==b.tagName?this.initOnLink(b):"IMG"==b.tagName?this.initOnImage(b):this.options.editInPopup?this.initForPopup(b):this.initOnDefault(b),!this.editableDisabled){this.$box=this.$element.addClass("froala-box"),this.$wrapper=a('<div class="froala-wrapper">'),this.$element=a("<div>");var c=this.$box.html();this.$box.html(this.$wrapper.html(this.$element)),this.$element.on("keyup",a.proxy(function(){this.$element.find("ul, ol").length>1&&this.cleanupLists()},this)),this.setHTML(c,!0)}this.$element.on("drop",a.proxy(function(){setTimeout(a.proxy(function(){a("html").click(),this.$element.find(".f-img-wrap").each(function(b,c){0===a(c).find("img").length&&a(c).remove()}),this.$element.find(this.options.defaultTag+":empty").remove()},this),1)},this))},b.prototype.trim=function(a){return a=String(a).replace(/^\s+|\s+$/g,""),a=a.replace(/\u200B/gi,"")},b.prototype.unwrapText=function(){this.options.paragraphy||this.$element.find(this.options.defaultTag).each(a.proxy(function(b,c){if(0===c.attributes.length){var d=a(c).find("br:last");a(c).replaceWith(d.length&&this.isLastSibling(d.get(0))?a(c).html():a(c).html()+"<br/>")}},this))},b.prototype.wrapTextInElement=function(b,c){void 0===c&&(c=!1);var d=[],e=["SPAN","A","B","I","EM","U","S","STRONG","STRIKE","FONT","IMG","SUB","SUP"],f=this;this.no_verify=!0;var g=function(){if(0===d.length)return!1;var b=a("<"+f.options.defaultTag+">"),c=a(d[0]);if(1==d.length&&"f-marker"==c.attr("class"))return void(d=[]);for(var e=0;e<d.length;e++){var g=a(d[e]);b.append(g.clone()),e==d.length-1?g.replaceWith(b):g.remove()}d=[]},h=!1,i=!1,j=!1;b.contents().filter(function(){var b=a(this);if(b.hasClass("f-marker")||b.find(".f-marker").length){var k=b;if(1==b.find(".f-marker").length||b.hasClass("f-marker")){k=b.find(".f-marker").length?a(b.find(".f-marker")[0]):b;var l=k.prev();"true"===k.attr("data-type")?l.length&&a(l[0]).hasClass("f-marker")?j=!0:(h=!0,i=!1):i=!0}else j=!0}this.nodeType==Node.TEXT_NODE&&b.text().length>0||e.indexOf(this.tagName)>=0?d.push(this):this.nodeType==Node.TEXT_NODE&&0===b.text().length&&f.options.beautifyCode?b.remove():h||c||j?("BR"===this.tagName&&(d.length>0?b.remove():d.push(this)),g(),i&&(h=!1),j=!1):d=[]}),(h||c||j)&&g(),b.find("> "+this.options.defaultTag).each(function(b,c){0===a(c).text().trim().length&&0===a(c).find("img").length&&0===a(c).find("br").length&&a(c).append(this.br)}),b.find("div:empty:not([class])").remove(),b.is(":empty")&&b.append(f.options.paragraphy===!0?"<"+this.options.defaultTag+">"+this.br+"</"+this.options.defaultTag+">":this.br),this.no_verify=!1},b.prototype.wrapText=function(b){if(this.isImage||this.isLink)return!1;this.allow_div=!0,this.removeBlankSpans();for(var c=this.getSelectionElements(),d=0;d<c.length;d++){var e=a(c[d]);["LI","TH","TD"].indexOf(e.get(0).tagName)>=0?this.wrapTextInElement(e,!0):this.parents(e,"li").length?this.wrapTextInElement(a(this.parents(e,"li")[0]),b):this.wrapTextInElement(this.$element,b)}this.allow_div=!1},b.prototype.setHTML=function(b,c){this.no_verify=!0,this.allow_div=!0,void 0===c&&(c=!0),b=this.clean(b,!0,!1),b=b.replace(/>\s+</g,"><"),this.$element.html(b),this.$element.find("pre").each(function(b,c){var d=a(c),e=a(c).html();e.indexOf("\n")>=0&&d.html(e.replace(/\n/g,"<br>"))}),this.imageList=[],this.refreshImageList(),this.options.paragraphy&&this.wrapText(!0),this.$element.find("li:empty").append(a.Editable.INVISIBLE_SPACE),this.cleanupLists(),this.cleanify(!1,!0,!1),c&&(this.restoreSelectionByMarkers(),this.sync()),this.$element.find("span").attr("data-fr-verified",!0),this.initialized&&(this.hide(),this.closeImageMode(),this.imageMode=!1),this.no_verify=!1,this.allow_div=!1},b.prototype.beforePaste=function(){this.saveSelectionByMarkers(),this.clipboardHTML=null,this.scrollPosition=this.$window.scrollTop(),this.$pasteDiv=a('<div contenteditable="true" style="position: fixed; top: 0; left: -9999px; height: 100%; width: 0; z-index: 99999; line-height: 140%;"></div>').appendTo("body"),this.$pasteDiv.focus(),this.window.setTimeout(a.proxy(this.processPaste,this),1)},b.prototype.processPaste=function(){var c=this.clipboardHTML;null===this.clipboardHTML&&(c=this.$pasteDiv.html(),this.restoreSelectionByMarkers(),this.$window.scrollTop(this.scrollPosition));var d,e=this.triggerEvent("onPaste",[c],!1);"string"==typeof e&&(c=e),c=c.replace(/<img /gi,'<img data-fr-image-pasted="true" '),c.match(/(class=\"?Mso|style=\"[^\"]*\bmso\-|w:WordDocument)/gi)?(d=this.wordClean(c),d=this.clean(a("<div>").append(d).html(),!1,!0),d=this.removeEmptyTags(d)):(d=this.clean(c,!1,!0),d=this.removeEmptyTags(d),b.copiedText&&a("<div>").html(d).text().replace(/\u00A0/gi," ")==b.copiedText.replace(/(\u00A0|\r|\n)/gi," ")&&(d=b.copiedHTML)),this.options.plainPaste&&(d=this.plainPasteClean(d)),""!==d&&(this.insertHTML(d,!0,!0),this.saveSelectionByMarkers(),this.removeBlankSpans(),this.$element.find(this.valid_nodes.join(":empty, ")+":empty").remove(),this.restoreSelectionByMarkers(),this.$element.find("li[data-indent]").each(a.proxy(function(b,c){this.indentLi?(a(c).removeAttr("data-indent"),this.indentLi(a(c))):a(c).removeAttr("data-indent")},this)),this.$element.find("li").each(a.proxy(function(b,c){this.wrapTextInElement(a(c),!0)},this)),this.options.paragraphy&&this.wrapText(!0),this.cleanupLists()),this.afterPaste()},b.prototype.afterPaste=function(){this.uploadPastedImages(),this.checkPlaceholder(),this.pasting=!1,this.triggerEvent("afterPaste",[],!0,!1)},b.prototype.getSelectedHTML=function(){function b(b,d){for(;3==d.nodeType||c.valid_nodes.indexOf(d.tagName)<0;)3!=d.nodeType&&a(b).wrapInner("<"+d.tagName+c.attrs(d)+"></"+d.tagName+">"),d=d.parentNode}var c=this,d="";if("undefined"!=typeof window.getSelection)for(var e=this.getRanges(),f=0;f<e.length;f++){var g=document.createElement("div");g.appendChild(e[f].cloneContents()),b(g,this.getSelectionParent()),d+=g.innerHTML}else"undefined"!=typeof document.selection&&"Text"==document.selection.type&&(d=document.selection.createRange().htmlText);return d},b.prototype.registerPaste=function(){this.$element.on("copy cut",a.proxy(function(){this.isHTML||(b.copiedHTML=this.getSelectedHTML(),b.copiedText=a("<div>").html(b.copiedHTML).text())},this)),this.$element.on("paste",a.proxy(function(b){if(!this.isHTML){if(b.originalEvent&&(b=b.originalEvent),!this.triggerEvent("beforePaste",[],!1))return!1;if(this.clipboardPaste(b))return!1;this.clipboardHTML="",this.pasting=!0,this.scrollPosition=this.$window.scrollTop();var c=!1;if(b&&b.clipboardData&&b.clipboardData.getData){var d="",e=b.clipboardData.types;if(a.Editable.isArray(e))for(var f=0;f<e.length;f++)d+=e[f]+";";else d=e;if(/text\/html/.test(d)?this.clipboardHTML=b.clipboardData.getData("text/html"):/text\/rtf/.test(d)&&this.browser.safari?this.clipboardHTML=b.clipboardData.getData("text/rtf"):/text\/plain/.test(d)&&!this.browser.mozilla&&(this.clipboardHTML=b.clipboardData.getData("text/plain").replace(/\n/g,"<br/>")),""!==this.clipboardHTML?c=!0:this.clipboardHTML=null,c)return this.processPaste(),b.preventDefault&&(b.stopPropagation(),b.preventDefault()),!1}this.beforePaste()}},this))},b.prototype.clipboardPaste=function(b){if(b&&b.clipboardData&&b.clipboardData.items&&b.clipboardData.items[0]){var c=b.clipboardData.items[0].getAsFile();if(c){var d=new FileReader;return d.onload=a.proxy(function(a){var b=a.target.result;this.insertHTML('<img data-fr-image-pasted="true" src="'+b+'" />'),this.afterPaste()},this),d.readAsDataURL(c),!0}}return!1},b.prototype.uploadPastedImages=function(){this.$element.find("img[data-fr-image-pasted]").each(a.proxy(function(b,c){this.options.pasteImage?(0===c.src.indexOf("data:")?(this.options.defaultImageWidth&&a(c).attr("width",this.options.defaultImageWidth),this.options.pastedImagesUploadURL&&(setTimeout(a.proxy(function(){this.showImageLoader(),this.$progress_bar.find("span").css("width","100%").text("Please wait!"),this.showByCoordinates(a(c).offset().left+a(c).width()/2,a(c).offset().top+a(c).height()+10),this.isDisabled=!0},this),10),a.ajax({type:this.options.pastedImagesUploadRequestType,url:this.options.pastedImagesUploadURL,data:a.extend({image:decodeURIComponent(c.src)},this.options.imageUploadParams),crossDomain:this.options.crossDomain,xhrFields:{withCredentials:this.options.withCredentials},headers:this.options.headers,dataType:"json"}).done(a.proxy(function(b){try{if(b.link){var d=new Image;d.onerror=a.proxy(function(){a(c).remove(),this.hide(),this.throwImageError(1)},this),d.onload=a.proxy(function(){c.src=b.link,this.hideImageLoader(),this.hide(),this.enable(),setTimeout(function(){a(c).trigger("touchend")},50),this.triggerEvent("afterUploadPastedImage",[a(c)])},this),d.src=b.link}else b.error?(a(c).remove(),this.hide(),this.throwImageErrorWithMessage(b.error)):(a(c).remove(),this.hide(),this.throwImageError(2))}catch(e){a(c).remove(),this.hide(),this.throwImageError(4)}},this)).fail(a.proxy(function(){a(c).remove(),this.hide(),this.throwImageError(3)},this)))):0!==c.src.indexOf("http")&&a(c).remove(),a(c).removeAttr("data-fr-image-pasted")):a(c).remove()},this))},b.prototype.disable=function(){this.isDisabled=!0,this.$element.blur(),this.$box.addClass("fr-disabled"),this.$element.attr("contenteditable",!1)},b.prototype.enable=function(){this.isDisabled=!1,this.$box.removeClass("fr-disabled"),this.$element.attr("contenteditable",!0)},b.prototype.wordClean=function(a){a.indexOf("<body")>=0&&(a=a.replace(/[.\s\S\w\W<>]*<body[^>]*>([.\s\S\w\W<>]*)<\/body>[.\s\S\w\W<>]*/g,"$1")),a=a.replace(/<p(.*?)class="?'?MsoListParagraph"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ul><li>$3</li></ul>"),a=a.replace(/<p(.*?)class="?'?NumberedText"?'? ([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ol><li>$3</li></ol>"),a=a.replace(/<p(.*?)class="?'?MsoListParagraphCxSpFirst"?'?([\s\S]*?)(level\d)([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ul><li$3>$5</li>"),a=a.replace(/<p(.*?)class="?'?NumberedTextCxSpFirst"?'?([\s\S]*?)(level\d)([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<ol><li$3>$5</li>"),a=a.replace(/<p(.*?)class="?'?MsoListParagraphCxSpMiddle"?'?([\s\S]*?)(level\d)([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li>"),a=a.replace(/<p(.*?)class="?'?NumberedTextCxSpMiddle"?'?([\s\S]*?)(level\d)([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li>"),a=a.replace(/<p(.*?)class="?'?MsoListParagraphCxSpLast"?'?([\s\S]*?)(level\d)([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li></ul>"),a=a.replace(/<p(.*?)class="?'?NumberedTextCxSpLast"?'?([\s\S]*?)(level\d)([\s\S]*?)>([\s\S]*?)<\/p>/gi,"<li$3>$5</li></ol>"),a=a.replace(/<span([^<]*?)style="?'?mso-list:Ignore"?'?([\s\S]*?)>([\s\S]*?)<span/gi,"<span><span"),a=a.replace(/<!--\[if \!supportLists\]-->([\s\S]*?)<!--\[endif\]-->/gi,""),a=a.replace(/<!\[if \!supportLists\]>([\s\S]*?)<!\[endif\]>/gi,""),a=a.replace(/(\n|\r| class=(")?Mso[a-zA-Z0-9]+(")?)/gi," "),a=a.replace(/<!--[\s\S]*?-->/gi,""),a=a.replace(/<(\/)*(meta|link|span|\\?xml:|st1:|o:|font)(.*?)>/gi,"");for(var b=["style","script","applet","embed","noframes","noscript"],c=0;c<b.length;c++){var d=new RegExp("<"+b[c]+".*?"+b[c]+"(.*?)>","gi");a=a.replace(d,"")}a=a.replace(/([\w\-]*)=("[^<>"]*"|'[^<>']*'|\w+)/gi,""),a=a.replace(/&nbsp;/gi," ");var e;do e=a,a=a.replace(/<[^\/>][^>]*><\/[^>]+>/gi,"");while(a!=e);return a=a.replace(/<lilevel([^1])([^>]*)>/gi,'<li data-indent="true"$2>'),a=a.replace(/<lilevel1([^>]*)>/gi,"<li$1>"),a=this.clean(a),a=a.replace(/<a>(.[^<]+)<\/a>/gi,"$1")},b.prototype.tabs=function(a){for(var b="",c=0;a>c;c++)b+="  ";return b},b.prototype.cleanTags=function(a,b){void 0===b&&(b=!1);var c,d,e,f,g=[],h=[],i=!1,j=!1,k=this.options.formatTags;for(d=0;d<a.length;d++)if(c=a.charAt(d),"<"==c){var l=a.indexOf(">",d+1);if(-1!==l){var m=a.substring(d,l+1),n=this.tagName(m);if("head"==n&&this.options.fullPage&&(j=!0),j){h.push(m),d=l,"head"==n&&this.isClosingTag(m)&&(j=!1);continue}if(this.options.allowedTags.indexOf(n)<0&&(!this.options.fullPage||["html","head","body","!doctype"].indexOf(n)<0)){d=l;continue}if(0===n.indexOf("!")){h.push(m),d=l;continue}var o=this.isClosingTag(m);if("pre"===n&&(i=o?!1:!0),this.isSelfClosingTag(m))h.push("br"===n&&i?"\n":m);else if(o)for(e=!1,f=!0;e===!1&&void 0!==f;)f=g.pop(),void 0!==f&&f.tag_name!==n?h.splice(f.i,1):(e=!0,void 0!==f&&h.push(m));else h.push(m),g.push({tag_name:n,i:h.length-1});d=l}}else"\n"===c&&this.options.beautifyCode?b&&i?h.push("<br/>"):i?h.push(c):g.length>0&&h.push(" "):9!=c.charCodeAt(0)&&h.push(c);for(;g.length>0;)f=g.pop(),h.splice(f.i,1);var p="\n";this.options.beautifyCode||(p=""),a="",g=0;var q=!0;for(d=0;d<h.length;d++)1==h[d].length?q&&" "===h[d]||(a+=h[d],q=!1):k.indexOf(this.tagName(h[d]).toLowerCase())<0?(a+=h[d],"br"==this.tagName(h[d])&&(a+=p)):this.isSelfClosingTag(h[d])?k.indexOf(this.tagName(h[d]).toLowerCase())>=0?(a+=this.tabs(g)+h[d]+p,q=!1):a+=h[d]:this.isClosingTag(h[d])?(g-=1,0===g&&(q=!0),a.length>0&&a[a.length-1]==p&&(a+=this.tabs(g)),a+=h[d]+p):(a+=p+this.tabs(g)+h[d],g+=1,q=!1);return a[0]==p&&(a=a.substring(1,a.length)),a[a.length-1]==p&&(a=a.substring(0,a.length-1)),a},b.prototype.cleanupLists=function(){this.$element.find("ul, ol").each(function(b,c){var d=a(c);if(d.find(".close-ul, .open-ul, .close-ol, .open-ol, .open-li, .close-li").length>0){var e="<"+c.tagName.toLowerCase()+">"+d.html()+"</"+c.tagName.toLowerCase()+">";e=e.replace(new RegExp('<span class="close-ul" data-fr-verified="true"></span>',"g"),"</ul>"),e=e.replace(new RegExp('<span class="open-ul" data-fr-verified="true"></span>',"g"),"<ul>"),e=e.replace(new RegExp('<span class="close-ol" data-fr-verified="true"></span>',"g"),"</ol>"),e=e.replace(new RegExp('<span class="open-ol" data-fr-verified="true"></span>',"g"),"<ol>"),e=e.replace(new RegExp('<span class="close-li" data-fr-verified="true"></span>',"g"),"</li>"),e=e.replace(new RegExp('<span class="open-li" data-fr-verified="true"></span>',"g"),"<li>"),d.replaceWith(e)}}),this.$element.find("li > td").remove(),this.$element.find("li td:empty").append(a.Editable.INVISIBLE_SPACE),this.$element.find("ul, ol").each(a.proxy(function(b,c){var d=a(c);0===d.find(this.valid_nodes.join(",")).length&&d.remove()},this)),this.$element.find("li > ul, li > ol").each(a.proxy(function(b,c){this.isFirstSibling(c)&&a(c).before("<br/>")},this)),this.$element.find("li:empty").remove();for(var b=this.$element.find("ol + ol, ul + ul"),c=0;c<b.length;c++){var d=a(b[c]);d.prev().append(d.html()),d.remove()}this.$element.find("li > td").remove(),this.$element.find("li td:empty").append(a.Editable.INVISIBLE_SPACE),this.$element.find("li > "+this.options.defaultTag).each(function(b,c){0===c.attributes.length&&a(c).replaceWith(a(c).html())})},b.prototype.clean=function(c,d,e,f,g){g||(g=a.merge([],this.options.allowedAttrs)),f||(f=a.merge([],this.options.allowedTags)),d||g.indexOf("id")>-1&&g.splice(g.indexOf("id"),1),this.options.fullPage&&(c=c.replace(/<!DOCTYPE([^>]*?)>/i,"<!-- DOCTYPE$1 -->"),c=c.replace(/<html([^>]*?)>/i,"<!-- html$1 -->"),c=c.replace(/<\/html([^>]*?)>/i,"<!-- /html$1 -->"),c=c.replace(/<body([^>]*?)>/i,"<!-- body$1 -->"),c=c.replace(/<\/body([^>]*?)>/i,"<!-- /body$1 -->"),c=c.replace(/<head>([\w\W]*)<\/head>/i,function(a,b){var c=1;return b=b.replace(/(<style)/gi,function(a,b){return b+" data-id="+c++}),"<!-- head "+b.replace(/(>)([\s|\t]*)(<)/gi,"$1$3").replace(/</gi,"[").replace(/>/gi,"]")+" -->"})),this.options.allowComments?(this.options.allowedTags.push("!--"),this.options.allowedTags.push("!")):c=c.replace(/<!--.*?-->/gi,""),this.options.allowScript?f.push("script"):c=c.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,""),this.options.allowStyle?f.push("style"):c=c.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,"");var h=new RegExp("<\\/?((?!(?:"+f.join(" |")+" |"+f.join(">|")+">|"+f.join("/>|")+"/>))\\w+)[^>]*?>","gi");c=c.replace(h,"");var i=new RegExp("( (?!(?:"+g.join("|")+"))[a-zA-Z0-9-_]+)=((?:.(?!\\s+(?:\\S+)=|[>]|(\\/>)))+.)","gi");if(c=c.replace(/<\/?[^>]*?>/gi,function(a){return a.replace(i,"")}),this.pasting&&b.copiedText===a("<div>").html(c).text()&&(e=!1,d=!0),e){var j=new RegExp("style=(\"[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,!\\/'%]*\"|'[a-zA-Z0-9:;\\.\\s\\(\\)\\-\\,!\\/\"%]*')","gi");c=c.replace(j,""),c=c.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi,"")}c=this.cleanTags(c,!0),c=c.replace(/(\r|\n)/gi,"");var k=new RegExp("<([^>]*)( src| href)=('[^']*'|\"[^\"]*\"|[^\\s>]+)([^>]*)>","gi");if(c=c.replace(k,a.proxy(function(a,b,c,d,e){return"<"+b+c+'="'+this.sanitizeURL(d.replace(/^["'](.*)["']\/?$/gi,"$1"))+'"'+e+">"},this)),!d){var l=a("<div>").append(c);l.find('[class]:not([class^="fr-"])').each(function(b,c){a(c).removeAttr("class")}),c=l.html()}return c},b.prototype.removeBlankSpans=function(){this.no_verify=!0,this.$element.find("span").removeAttr("data-fr-verified"),this.$element.find("span").each(a.proxy(function(b,c){0===this.attrs(c).length&&a(c).replaceWith(a(c).html())},this)),this.$element.find("span").attr("data-fr-verified",!0),this.no_verify=!1},b.prototype.plainPasteClean=function(b){var c=a("<div>").html(b);c.find("h1, h2, h3, h4, h5, h6, pre, blockquote, li").each(a.proxy(function(b,c){a(c).replaceWith("<"+this.options.defaultTag+">"+a(c).html()+"</"+this.options.defaultTag+">")},this));for(var d=function(b,c){a(c).replaceWith(a(c).html())};c.find("strong, em, strike, b, u, i, sup, sub, span, a").length;)c.find("strong, em, strike, b, u, i, sup, sub, span, a").each(d);return c.html()},b.prototype.removeEmptyTags=function(b){for(var c,d=a("<div>").html(b),e=d.find("*:empty:not(br, img, td, th)");e.length;){for(c=0;c<e.length;c++)a(e[c]).remove();
e=d.find("*:empty:not(br, img, td, th)")}d.find("> div").each(function(b,c){a(c).replaceWith(a(c).html()+"<br/>")});for(var f=d.find("div");f.length;){for(c=0;c<f.length;c++){var g=a(f[c]),h=g.html().replace(/\u0009/gi,"").trim();g.replaceWith(h)}f=d.find("div")}return d.html()},b.prototype.initElementStyle=function(){this.editableDisabled||this.$element.attr("contenteditable",!0);var a="froala-view froala-element "+this.options.editorClass;this.browser.msie&&b.getIEversion()<9&&(a+=" ie8"),this.$element.css("outline",0),this.browser.msie||(a+=" not-msie"),this.$element.addClass(a)},b.prototype.CJKclean=function(a){var b=/[\u3041-\u3096\u30A0-\u30FF\u4E00-\u9FFF\u3130-\u318F\uAC00-\uD7AF]/gi;return a.replace(b,"")},b.prototype.enableTyping=function(){this.typingTimer=null,this.$element.on("keydown","textarea, input",function(a){a.stopPropagation()}),this.$element.on("keydown cut",a.proxy(function(b){if(!this.isHTML){if(!this.options.multiLine&&13==b.which)return b.preventDefault(),b.stopPropagation(),!1;if("keydown"===b.type&&!this.triggerEvent("keydown",[b],!1))return!1;clearTimeout(this.typingTimer),this.ajaxSave=!1,this.oldHTML=this.getHTML(!0,!1),this.typingTimer=setTimeout(a.proxy(function(){var a=this.getHTML(!0,!1);this.ime||this.CJKclean(a)===this.CJKclean(this.oldHTML)||this.CJKclean(a)!==a||this.sync()},this),Math.max(this.options.typingTimer,500))}},this))},b.prototype.removeMarkersByRegex=function(a){return a.replace(/<span[^>]*? class\s*=\s*["']?f-marker["']?[^>]+>([\S\s][^\/])*<\/span>/gi,"")},b.prototype.getImageHTML=function(){return JSON.stringify({src:this.$element.find("img").attr("src"),style:this.$element.find("img").attr("style"),alt:this.$element.find("img").attr("alt"),width:this.$element.find("img").attr("width"),link:this.$element.find("a").attr("href"),link_title:this.$element.find("a").attr("title"),link_target:this.$element.find("a").attr("target")})},b.prototype.getLinkHTML=function(){return JSON.stringify({body:this.$element.html(),href:this.$element.attr("href"),title:this.$element.attr("title"),popout:this.$element.hasClass("popout"),nofollow:"nofollow"==this.$element.attr("ref"),blank:"_blank"==this.$element.attr("target"),cls:this.$element.attr("class")?this.$element.attr("class").replace(/froala-element ?|not-msie ?|froala-view ?/gi,"").trim():""})},b.prototype.addFrTag=function(){this.$element.find(this.valid_nodes.join(",")+", table, ul, ol, img").addClass("fr-tag")},b.prototype.removeFrTag=function(){this.$element.find(this.valid_nodes.join(",")+", table, ul, ol, img").removeClass("fr-tag")},b.prototype.getHTML=function(b,c,d){if(void 0===b&&(b=!1),void 0===c&&(c=this.options.useFrTag),void 0===d&&(d=!0),this.$element.hasClass("f-placeholder")&&!b)return"";if(this.isHTML)return this.$html_area.val();if(this.isImage)return this.getImageHTML();if(this.isLink)return this.getLinkHTML();this.$element.find("a").data("fr-link",!0),c&&this.addFrTag(),this.$element.find(".f-img-editor > img").each(a.proxy(function(b,c){a(c).removeClass("fr-fin fr-fil fr-fir fr-dib fr-dii").addClass(this.getImageClass(a(c).parent().attr("class")))},this)),this.options.useClasses||this.$element.find("img").each(a.proxy(function(b,c){var d=a(c);d.attr("data-style",this.getImageStyle(d))},this)),this.$element.find("pre").each(a.proxy(function(b,c){var d=a(c),e=d.html(),f=e.replace(/\&nbsp;/gi," ");e!=f&&(this.saveSelectionByMarkers(),d.html(f),this.restoreSelectionByMarkers())},this)),this.$element.find("pre br").addClass("fr-br"),this.$element.find('[class=""]').removeAttr("class");var e=this.$element.html();if(this.removeFrTag(),this.$element.find("pre br").removeAttr("class"),e=e.replace(/<a[^>]*?><\/a>/g,""),b||(e=this.removeMarkersByRegex(e)),e=e.replace(/<span[^>]*? class\s*=\s*["']?f-img-handle[^>]+><\/span>/gi,""),e=e.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-editor[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi,"$1$2$3"),e=e.replace(/^([\S\s]*)<span[^>]*? class\s*=\s*["']?f-img-wrap[^>]+>([\S\s]*)<\/span>([\S\s]*)$/gi,"$1$2$3"),this.options.useClasses||(e=e.replace(/data-style/gi,"style"),e=e.replace(/(<img[^>]*)( class\s*=['"]?[a-zA-Z0-9- ]+['"]?)([^>]*\/?>)/gi,"$1$3")),this.options.simpleAmpersand&&(e=e.replace(/\&amp;/gi,"&")),d&&(e=e.replace(/ data-fr-verified="true"/gi,"")),this.options.beautifyCode&&(e=e.replace(/\n/gi,"")),e=e.replace(/<br class="fr-br">/gi,"\n"),e=e.replace(/\u200B/gi,""),this.options.fullPage&&(e=e.replace(/<!-- DOCTYPE([^>]*?) -->/i,"<!DOCTYPE$1>"),e=e.replace(/<!-- html([^>]*?) -->/i,"<html$1>"),e=e.replace(/<!-- \/html([^>]*?) -->/i,"</html$1>"),e=e.replace(/<!-- body([^>]*?) -->/i,"<body$1>"),e=e.replace(/<!-- \/body([^>]*?) -->/i,"</body$1>"),e=e.replace(/<!-- head ([\w\W]*?) -->/i,function(a,b){return"<head>"+b.replace(/\[/gi,"<").replace(/\]/gi,">")+"</head>"})),c){var f=this.triggerEvent("getHTML",[e],!1);if("string"==typeof f)return f}return e},b.prototype.getText=function(){return this.$element.text()},b.prototype.setDirty=function(a){this.dirty=a,a||(clearTimeout(this.ajaxInterval),this.ajaxHTML=this.getHTML(!1,!1))},b.prototype.initAjaxSaver=function(){this.ajaxHTML=this.getHTML(!1,!1),this.ajaxSave=!0,this.ajaxInterval=setInterval(a.proxy(function(){var a=this.getHTML(!1,!1);(this.ajaxHTML!=a||this.dirty)&&this.ajaxSave&&(this.options.autosave&&this.save(),this.dirty=!1,this.ajaxHTML=a),this.ajaxSave=!0},this),Math.max(this.options.autosaveInterval,100))},b.prototype.disableBrowserUndo=function(){this.$element.keydown(a.proxy(function(a){var b=a.which,c=(a.ctrlKey||a.metaKey)&&!a.altKey;if(!this.isHTML&&c){if(90==b&&a.shiftKey)return a.preventDefault(),!1;if(90==b)return a.preventDefault(),!1}},this))},b.prototype.shortcutEnabled=function(a){return this.options.shortcutsAvailable.indexOf(a)>=0},b.prototype.shortcuts_map={69:{cmd:"show",params:[null],id:"show"},66:{cmd:"exec",params:["bold"],id:"bold"},73:{cmd:"exec",params:["italic"],id:"italic"},85:{cmd:"exec",params:["underline"],id:"underline"},83:{cmd:"exec",params:["strikeThrough"],id:"strikeThrough"},75:{cmd:"exec",params:["createLink"],id:"createLink"},80:{cmd:"exec",params:["insertImage"],id:"insertImage"},221:{cmd:"exec",params:["indent"],id:"indent"},219:{cmd:"exec",params:["outdent"],id:"outdent"},72:{cmd:"exec",params:["html"],id:"html"},48:{cmd:"exec",params:["formatBlock","n"],id:"formatBlock n"},49:{cmd:"exec",params:["formatBlock","h1"],id:"formatBlock h1"},50:{cmd:"exec",params:["formatBlock","h2"],id:"formatBlock h2"},51:{cmd:"exec",params:["formatBlock","h3"],id:"formatBlock h3"},52:{cmd:"exec",params:["formatBlock","h4"],id:"formatBlock h4"},53:{cmd:"exec",params:["formatBlock","h5"],id:"formatBlock h5"},54:{cmd:"exec",params:["formatBlock","h6"],id:"formatBlock h6"},222:{cmd:"exec",params:["formatBlock","blockquote"],id:"formatBlock blockquote"},220:{cmd:"exec",params:["formatBlock","pre"],id:"formatBlock pre"}},b.prototype.ctrlKey=function(a){if(-1!=navigator.userAgent.indexOf("Mac OS X")){if(a.metaKey&&!a.altKey)return!0}else if(a.ctrlKey&&!a.altKey)return!0;return!1},b.prototype.initShortcuts=function(){this.options.shortcuts&&this.$element.on("keydown",a.proxy(function(a){var b=a.which,c=this.ctrlKey(a);if(!this.isHTML&&c){if(this.shortcuts_map[b]&&this.shortcutEnabled(this.shortcuts_map[b].id))return this.execDefaultShortcut(this.shortcuts_map[b].cmd,this.shortcuts_map[b].params);if(90==b&&a.shiftKey)return a.preventDefault(),a.stopPropagation(),this.redo(),!1;if(90==b)return a.preventDefault(),a.stopPropagation(),this.undo(),!1}},this))},b.prototype.initTabs=function(){this.$element.on("keydown",a.proxy(function(a){var b=a.which;if(9!=b||a.shiftKey)9==b&&a.shiftKey&&(this.raiseEvent("shift+tab")?this.options.tabSpaces?a.preventDefault():this.blur():a.preventDefault());else if(this.raiseEvent("tab"))if(this.options.tabSpaces){a.preventDefault();var c="&nbsp;&nbsp;&nbsp;&nbsp;",d=this.getSelectionElements()[0];"PRE"===d.tagName&&(c="    "),this.insertHTML(c,!1)}else this.blur();else a.preventDefault()},this))},b.prototype.textEmpty=function(b){var c=a(b).text().replace(/(\r\n|\n|\r|\t)/gm,"");return(""===c||b===this.$element.get(0))&&0===a(b).find("br").length},b.prototype.inEditor=function(a){for(;a&&"BODY"!==a.tagName;){if(a===this.$element.get(0))return!0;a=a.parentNode}return!1},b.prototype.focus=function(b){if(this.isDisabled)return!1;if(void 0===b&&(b=!0),""!==this.text()&&!this.$element.is(":focus"))return void(this.browser.msie||this.$element.focus());if(!this.isHTML){if(b&&!this.pasting&&this.$element.focus(),this.pasting&&!this.$element.is(":focus")&&this.$element.focus(),this.$element.hasClass("f-placeholder"))return void this.setSelection(this.$element.find(this.options.defaultTag).length>0?this.$element.find(this.options.defaultTag)[0]:this.$element.get(0));var c=this.getRange();if(""===this.text()&&c&&(0===c.startOffset||c.startContainer===this.$element.get(0)||!this.inEditor(c.startContainer))){var d,e,f=this.getSelectionElements();if(a.merge(["IMG","BR"],this.valid_nodes).indexOf(this.getSelectionElement().tagName)<0)return!1;if(c.startOffset>0&&this.valid_nodes.indexOf(this.getSelectionElement().tagName)>=0&&"BODY"!=c.startContainer.tagName||c.startContainer&&3===c.startContainer.nodeType)return;if(!this.options.paragraphy&&f.length>=1&&f[0]===this.$element.get(0)){var g=function(b){if(!b)return null;if(3==b.nodeType&&b.textContent.length>0)return b;if(1==b.nodeType&&"BR"==b.tagName)return b;for(var c=a(b).contents(),d=0;d<c.length;d++){var e=g(c[d]);if(null!=e)return e}return null};if(0===c.startOffset&&this.$element.contents().length>0&&3!=this.$element.contents()[0].nodeType){var h=g(this.$element.get(0));null!=h&&("BR"==h.tagName?this.$element.is(":focus")&&(a(h).before(this.markers_html),this.restoreSelectionByMarkers()):this.setSelection(h))}return!1}if(f.length>=1&&f[0]!==this.$element.get(0))for(d=0;d<f.length;d++){if(e=f[d],!this.textEmpty(e)||this.browser.msie)return void this.setSelection(e);if(this.textEmpty(e)&&["LI","TD"].indexOf(e.tagName)>=0)return}if(c.startContainer===this.$element.get(0)&&c.startOffset>0&&!this.options.paragraphy)return void this.setSelection(this.$element.get(0),c.startOffset);for(f=this.$element.find(this.valid_nodes.join(",")),d=0;d<f.length;d++)if(e=f[d],!this.textEmpty(e)&&0===a(e).find(this.valid_nodes.join(",")).length)return void this.setSelection(e);this.setSelection(this.$element.get(0))}}},b.prototype.addMarkersAtEnd=function(b){var c=b.find(this.valid_nodes.join(", "));0===c.length&&c.push(b.get(0));var d=c[c.length-1];a(d).append(this.markers_html)},b.prototype.setFocusAtEnd=function(a){void 0===a&&(a=this.$element),this.addMarkersAtEnd(a),this.restoreSelectionByMarkers()},b.prototype.breakHTML=function(b){this.removeMarkers(),0===this.$element.find("break").length&&this.insertSimpleHTML("<break></break>");var c=this.parents(this.$element.find("break"),a.merge(["UL","OL"],this.valid_nodes).join(","))[0];if(this.parents(a(c),"ul, ol").length&&(c=this.parents(a(c),"ul, ol")[0]),void 0===c&&(c=this.$element.get(0)),["UL","OL"].indexOf(c.tagName)>=0){var d=a("<div>").html(b);d.find("> li").wrap("<"+c.tagName+">"),b=d.html()}if(c==this.$element.get(0)){if(this.$element.find("break").next().length){this.insertSimpleHTML('<div id="inserted-div">'+b+"</div>");var e=this.$element.find("div#inserted-div");this.setFocusAtEnd(e),this.saveSelectionByMarkers(),e.replaceWith(e.contents()),this.restoreSelectionByMarkers()}else this.insertSimpleHTML(b),this.setFocusAtEnd();return this.$element.find("break").remove(),this.checkPlaceholder(),!0}if("TD"===c.tagName)return this.$element.find("break").remove(),this.insertSimpleHTML(b),!0;var f=a("<div>").html(b);if(this.addMarkersAtEnd(f),b=f.html(),this.emptyElement(a(c)))return a(c).replaceWith(b),this.restoreSelectionByMarkers(),this.checkPlaceholder(),!0;this.$element.find("li").each(a.proxy(function(b,c){this.emptyElement(c)&&a(c).addClass("empty-li")},this));for(var g,h,i=a("<div></div>").append(a(c).clone()).html(),j=[],k={},l=[],m=0,n=0;n<i.length;n++)if(h=i.charAt(n),"<"==h){var o=i.indexOf(">",n+1);if(-1!==o){g=i.substring(n,o+1);var p=this.tagName(g);if(n=o,"break"==p){if(!this.isClosingTag(g)){for(var q=j.length-1;q>=0;q--){var r=this.tagName(j[q]);l.push("</"+r+">")}l.push(b);for(var s=0;s<j.length;s++)l.push(j[s])}}else if(l.push(g),!this.isSelfClosingTag(g))if(this.isClosingTag(g)){var t=k[p].pop();j.splice(t,1)}else j.push(g),void 0===k[p]&&(k[p]=[]),k[p].push(j.length-1)}}else m++,l.push(h);a(c).replaceWith(l.join("")),this.$element.find("li").each(a.proxy(function(b,c){var d=a(c);d.hasClass("empty-li")?d.removeClass("empty-li"):this.emptyElement(c)&&d.remove()},this)),this.cleanupLists(),this.restoreSelectionByMarkers()},b.prototype.insertSimpleHTML=function(a){var b,c;if(this.no_verify=!0,this.window.getSelection){if(b=this.window.getSelection(),b.getRangeAt&&b.rangeCount){c=b.getRangeAt(0),c.deleteContents();var d=this.document.createElement("div");d.innerHTML=a;for(var e,f,g=this.document.createDocumentFragment();e=d.firstChild;)f=g.appendChild(e);c.insertNode(g),f&&(c=c.cloneRange(),c.setStartAfter(f),c.collapse(!0),b.removeAllRanges(),b.addRange(c))}}else if((b=this.document.selection)&&"Control"!=b.type){var h=b.createRange();h.collapse(!0),b.createRange().pasteHTML(a)}this.no_verify=!1},b.prototype.insertHTML=function(b,c,d){if(void 0===c&&(c=!0),void 0===d&&(d=!1),!this.isHTML&&c&&this.focus(),this.removeMarkers(),this.insertSimpleHTML("<break></break>"),this.checkPlaceholder(!0),this.$element.hasClass("f-placeholder"))return this.$element.html(b),this.options.paragraphy&&this.wrapText(!0),this.$element.find("break").remove(),this.setFocusAtEnd(),this.checkPlaceholder(),!1;for(var e=a("<div>").append(b).find("*"),f=0;f<e.length;f++)if(this.valid_nodes.indexOf(e[f].tagName)>=0)return this.breakHTML(b),this.$element.find("break").remove(),!1;this.$element.find("break").remove(),this.insertSimpleHTML(b)},b.prototype.execDefaultShortcut=function(a,b){return this[a].apply(this,b),!1},b.prototype.initEditor=function(){var c="froala-editor";this.mobile()&&(c+=" touch"),this.browser.msie&&b.getIEversion()<9&&(c+=" ie8"),this.$editor=a('<div class="'+c+'" style="display: none;">');var d=this.$document.find(this.options.scrollableContainer);d.append(this.$editor),this.options.inlineMode?this.initInlineEditor():this.initBasicEditor()},b.prototype.refreshToolbarPosition=function(){this.$window.scrollTop()>this.$box.offset().top&&this.$window.scrollTop()<this.$box.offset().top+this.$box.outerHeight()-this.$editor.outerHeight()?(this.$element.css("padding-top",this.$editor.outerHeight()+this.$element.data("padding-top")),this.$placeholder.css("margin-top",this.$editor.outerHeight()+this.$element.data("padding-top")),this.$editor.addClass("f-scroll").removeClass("f-scroll-abs").css("bottom","").css("left",this.$box.offset().left+parseFloat(this.$box.css("padding-left"),10)-this.$window.scrollLeft()).width(this.$box.width()-parseFloat(this.$editor.css("border-left-width"),10)-parseFloat(this.$editor.css("border-right-width"),10)),this.iOS()&&(this.$element.is(":focus")?this.$editor.css("top",this.$window.scrollTop()):this.$editor.css("top",""))):this.$window.scrollTop()<this.$box.offset().top?this.iOS()&&this.$element.is(":focus")?(this.$element.css("padding-top",this.$editor.outerHeight()+this.$element.data("padding-top")),this.$placeholder.css("margin-top",this.$editor.outerHeight()+this.$element.data("padding-top")),this.$editor.addClass("f-scroll").removeClass("f-scroll-abs").css("bottom","").css("left",this.$box.offset().left+parseFloat(this.$box.css("padding-left"),10)-this.$window.scrollLeft()).width(this.$box.width()-parseFloat(this.$editor.css("border-left-width"),10)-parseFloat(this.$editor.css("border-right-width"),10)),this.$editor.css("top",this.$box.offset().top)):(this.$editor.removeClass("f-scroll f-scroll-abs").css("bottom","").css("top","").width(""),this.$element.css("padding-top",""),this.$placeholder.css("margin-top","")):this.$window.scrollTop()>this.$box.offset().top+this.$box.outerHeight()-this.$editor.outerHeight()&&!this.$editor.hasClass("f-scroll-abs")&&(this.$element.css("padding-top",this.$editor.outerHeight()+this.$element.data("padding-top")),this.$placeholder.css("margin-top",this.$editor.outerHeight()+this.$element.data("padding-top")),this.$editor.removeClass("f-scroll").addClass("f-scroll-abs"),this.$editor.css("bottom",0).css("top","").css("left",""))},b.prototype.toolbarTop=function(){this.options.toolbarFixed||this.options.inlineMode||(this.$element.data("padding-top",parseInt(this.$element.css("padding-top"),10)),this.$window.on("scroll resize load",a.proxy(function(){this.refreshToolbarPosition()},this)),this.iOS()&&this.$element.on("focus blur",a.proxy(function(){this.refreshToolbarPosition()},this)))},b.prototype.initBasicEditor=function(){this.$element.addClass("f-basic"),this.$wrapper.addClass("f-basic"),this.$popup_editor=this.$editor.clone();var a=this.$document.find(this.options.scrollableContainer);this.$popup_editor.appendTo(a).addClass("f-inline"),this.$editor.addClass("f-basic").show(),this.$editor.insertBefore(this.$wrapper),this.toolbarTop()},b.prototype.initInlineEditor=function(){this.$editor.addClass("f-inline"),this.$element.addClass("f-inline"),this.$popup_editor=this.$editor},b.prototype.initDrag=function(){this.drag_support={filereader:"undefined"!=typeof FileReader,formdata:!!this.window.FormData,progress:"upload"in new XMLHttpRequest}},b.prototype.initOptions=function(){this.setDimensions(),this.setSpellcheck(),this.setImageUploadURL(),this.setButtons(),this.setDirection(),this.setZIndex(),this.setTheme(),this.options.editInPopup&&this.buildEditPopup(),this.editableDisabled||(this.setPlaceholder(),this.setPlaceholderEvents())},b.prototype.isTouch=function(){return WYSIWYGModernizr.touch&&void 0!==this.window.Touch},b.prototype.initEditorSelection=function(){this.$element.on("keyup",a.proxy(function(a){return this.triggerEvent("keyup",[a],!1)},this)),this.$element.on("focus",a.proxy(function(){this.blurred&&(this.blurred=!1,this.pasting||""!==this.text()||this.focus(!1),this.triggerEvent("focus",[],!1))},this)),this.$element.on("mousedown touchstart",a.proxy(function(){return this.isDisabled?!1:void(this.isResizing()||(this.closeImageMode(),this.hide()))},this)),this.options.disableRightClick&&this.$element.contextmenu(a.proxy(function(a){return a.preventDefault(),this.options.inlineMode&&this.$element.focus(),!1},this)),this.$element.on(this.mouseup,a.proxy(function(b){if(this.isDisabled)return!1;if(!this.isResizing()){var c=this.text();b.stopPropagation(),this.imageMode=!1,!(""!==c||this.options.alwaysVisible||this.options.editInPopup||(3==b.which||2==b.button)&&this.options.inlineMode&&!this.isImage&&this.options.disableRightClick)||this.link||this.imageMode?this.options.inlineMode||this.refreshButtons():setTimeout(a.proxy(function(){c=this.text(),!(""!==c||this.options.alwaysVisible||this.options.editInPopup||(3==b.which||2==b.button)&&this.options.inlineMode&&!this.isImage&&this.options.disableRightClick)||this.link||this.imageMode||(this.show(b),this.options.editInPopup&&this.showEditPopup())},this),0)}this.hideDropdowns(),this.hideOtherEditors()},this)),this.$editor.on(this.mouseup,a.proxy(function(a){return this.isDisabled?!1:void(this.isResizing()||(a.stopPropagation(),this.options.inlineMode===!1&&this.hide()))},this)),this.$editor.on("mousedown",".fr-dropdown-menu",a.proxy(function(a){return this.isDisabled?!1:(a.stopPropagation(),void(this.noHide=!0))},this)),this.$popup_editor.on("mousedown",".fr-dropdown-menu",a.proxy(function(a){return this.isDisabled?!1:(a.stopPropagation(),void(this.noHide=!0))},this)),this.$popup_editor.on("mouseup",a.proxy(function(a){return this.isDisabled?!1:void(this.isResizing()||a.stopPropagation())},this)),this.$edit_popup_wrapper&&this.$edit_popup_wrapper.on("mouseup",a.proxy(function(a){return this.isDisabled?!1:void(this.isResizing()||a.stopPropagation())},this)),this.setDocumentSelectionChangeEvent(),this.setWindowMouseUpEvent(),this.setWindowKeyDownEvent(),this.setWindowKeyUpEvent(),this.setWindowOrientationChangeEvent(),this.setWindowHideEvent(),this.setWindowBlurEvent(),this.options.trackScroll&&this.setWindowScrollEvent(),this.setWindowResize()},b.prototype.setWindowResize=function(){this.$window.on("resize."+this._id,a.proxy(function(){this.hide(),this.closeImageMode(),this.imageMode=!1},this))},b.prototype.blur=function(b){this.blurred||this.pasting||(this.selectionDisabled=!0,this.triggerEvent("blur",[]),b&&0===a("*:focus").length&&this.clearSelection(),this.isLink||this.isImage||(this.selectionDisabled=!1),this.blurred=!0)},b.prototype.setWindowBlurEvent=function(){this.$window.on("blur."+this._id,a.proxy(function(a,b){this.blur(b)},this))},b.prototype.setWindowHideEvent=function(){this.$window.on("hide."+this._id,a.proxy(function(){this.isResizing()?this.$element.find(".f-img-handle").trigger("moveend"):this.hide(!1)},this))},b.prototype.setWindowOrientationChangeEvent=function(){this.$window.on("orientationchange."+this._id,a.proxy(function(){setTimeout(a.proxy(function(){this.hide()},this),10)},this))},b.prototype.setDocumentSelectionChangeEvent=function(){this.$document.on("selectionchange."+this._id,a.proxy(function(b){return this.isDisabled?!1:void(this.isResizing()||this.isScrolling||(clearTimeout(this.selectionChangedTimeout),this.selectionChangedTimeout=setTimeout(a.proxy(function(){if(this.options.inlineMode&&this.selectionInEditor()&&this.link!==!0&&this.isTouch()){var a=this.text();""!==a?(this.iPod()?this.options.alwaysVisible&&this.hide():this.show(null),b.stopPropagation()):this.options.alwaysVisible?this.show(null):(this.hide(),this.closeImageMode(),this.imageMode=!1)}},this),75)))},this))},b.prototype.setWindowMouseUpEvent=function(){this.$window.on(this.mouseup+"."+this._id,a.proxy(function(){this.isResizing()||this.isScrolling||this.isDisabled||(this.$bttn_wrapper.find("button.fr-trigger").removeClass("active"),this.selectionInEditor()&&""!==this.text()&&!this.isTouch()?this.show(null):this.$popup_editor.is(":visible")&&(this.hide(),this.closeImageMode(),this.imageMode=!1),this.blur(!0)),a("[data-down]").removeAttr("data-down")},this))},b.prototype.setWindowKeyDownEvent=function(){this.$window.on("keydown."+this._id,a.proxy(function(b){var c=b.which;if(27==c&&(this.focus(),this.restoreSelection(),this.hide(),this.closeImageMode(),this.imageMode=!1),this.imageMode){if(13==c)return this.$element.find(".f-img-editor").parents(".f-img-wrap").before("<br/>"),this.sync(),this.$element.find(".f-img-editor img").click(),!1;if(46==c||8==c)return b.stopPropagation(),b.preventDefault(),setTimeout(a.proxy(function(){this.removeImage(this.$element.find(".f-img-editor img"))},this),0),!1}else if(this.selectionInEditor()){if(this.isDisabled)return!0;var d=(b.ctrlKey||b.metaKey)&&!b.altKey;!d&&this.$popup_editor.is(":visible")&&this.$bttn_wrapper.is(":visible")&&this.options.inlineMode&&(this.hide(),this.closeImageMode(),this.imageMode=!1)}},this))},b.prototype.setWindowKeyUpEvent=function(){this.$window.on("keyup."+this._id,a.proxy(function(){return this.isDisabled?!1:void(this.selectionInEditor()&&""!==this.text()&&!this.$popup_editor.is(":visible")&&this.repositionEditor())},this))},b.prototype.setWindowScrollEvent=function(){a.merge(this.$window,a(this.options.scrollableContainer)).on("scroll."+this._id,a.proxy(function(){return this.isDisabled?!1:(clearTimeout(this.scrollTimer),this.isScrolling=!0,void(this.scrollTimer=setTimeout(a.proxy(function(){this.isScrolling=!1},this),2500)))},this))},b.prototype.setPlaceholder=function(b){b&&(this.options.placeholder=b),this.$textarea&&this.$textarea.attr("placeholder",this.options.placeholder),this.$placeholder||(this.$placeholder=a('<span class="fr-placeholder" unselectable="on"></span>').bind("click",a.proxy(function(){this.focus()},this)),this.$element.after(this.$placeholder)),this.$placeholder.text(this.options.placeholder)},b.prototype.isEmpty=function(){var b=this.$element.text().replace(/(\r\n|\n|\r|\t|\u200B|\u0020)/gm,"");return""===b&&0===this.$element.find("img, table, iframe, input, textarea, hr, li").length&&0===this.$element.find(this.options.defaultTag+" > br, br").length&&0===this.$element.find(a.map(this.valid_nodes,a.proxy(function(a){return this.options.defaultTag==a?null:a},this)).join(", ")).length},b.prototype.checkPlaceholder=function(c){if(this.isDisabled&&!c)return!1;if(this.pasting&&!c)return!1;if(this.$element.find("td:empty, th:empty").append(a.Editable.INVISIBLE_SPACE),this.$element.find(this.valid_nodes.join(":empty, ")+":empty").append(this.br),!this.isHTML)if(this.isEmpty()&&!this.fakeEmpty()){var d,e=this.selectionInEditor()||this.$element.is(":focus");this.options.paragraphy?(d=a("<"+this.options.defaultTag+">"+this.br+"</"+this.options.defaultTag+">"),this.$element.html(d),e&&this.setSelection(d.get(0)),this.$element.addClass("f-placeholder")):(0!==this.$element.find("br").length||this.browser.msie&&b.getIEversion()<=10||(this.$element.append(this.br),e&&this.browser.msie&&this.focus()),this.$element.addClass("f-placeholder"))}else!this.$element.find(this.options.defaultTag+", li").length&&this.options.paragraphy?(this.wrapText(!0),this.$element.find(this.options.defaultTag).length&&""===this.text()?this.setSelection(this.$element.find(this.options.defaultTag)[0],this.$element.find(this.options.defaultTag).text().length,null,this.$element.find(this.options.defaultTag).text().length):this.$element.removeClass("f-placeholder")):this.fakeEmpty()===!1&&(!this.options.paragraphy||this.$element.find(this.valid_nodes.join(",")).length>=1)?this.$element.removeClass("f-placeholder"):!this.options.paragraphy&&this.$element.find(this.valid_nodes.join(",")).length>=1?this.$element.removeClass("f-placeholder"):this.$element.addClass("f-placeholder");return!0},b.prototype.fakeEmpty=function(a){void 0===a&&(a=this.$element);var b=!0;this.options.paragraphy&&(b=1==a.find(this.options.defaultTag).length?!0:!1);var c=a.text().replace(/(\r\n|\n|\r|\t|\u200B)/gm,"");return""===c&&b&&1==a.find("br, li").length&&0===a.find("img, table, iframe, input, textarea, hr, li").length},b.prototype.setPlaceholderEvents=function(){this.browser.msie&&b.getIEversion()<9||(this.$element.on("focus click",a.proxy(function(a){return this.isDisabled?!1:void(""!==this.$element.text()||this.pasting||(this.$element.data("focused")||"click"!==a.type?"focus"==a.type&&this.focus(!1):this.$element.focus(),this.$element.data("focused",!0)))},this)),this.$element.on("keyup keydown input focus placeholderCheck",a.proxy(function(){return this.checkPlaceholder()},this)),this.$element.trigger("placeholderCheck"))},b.prototype.setDimensions=function(a,b,c,d){a&&(this.options.height=a),b&&(this.options.width=b),c&&(this.options.minHeight=c),d&&(this.options.maxHeight=d),"auto"!=this.options.height&&(this.$wrapper.css("height",this.options.height),this.$element.css("minHeight",this.options.height-parseInt(this.$element.css("padding-top"),10)-parseInt(this.$element.css("padding-bottom"),10))),"auto"!=this.options.minHeight&&(this.$wrapper.css("minHeight",this.options.minHeight),this.$element.css("minHeight",this.options.minHeight)),"auto"!=this.options.maxHeight&&this.$wrapper.css("maxHeight",this.options.maxHeight),"auto"!=this.options.width&&this.$box.css("width",this.options.width)},b.prototype.setDirection=function(a){a&&(this.options.direction=a),"ltr"!=this.options.direction&&"rtl"!=this.options.direction&&(this.options.direction="ltr"),"rtl"==this.options.direction?(this.$box.addClass("f-rtl"),this.$element.addClass("f-rtl"),this.$editor.addClass("f-rtl"),this.$popup_editor.addClass("f-rtl"),this.$image_modal&&this.$image_modal.addClass("f-rtl")):(this.$box.removeClass("f-rtl"),this.$element.removeClass("f-rtl"),this.$editor.removeClass("f-rtl"),this.$popup_editor.removeClass("f-rtl"),this.$image_modal&&this.$image_modal.removeClass("f-rtl"))},b.prototype.setZIndex=function(a){a&&(this.options.zIndex=a),this.$editor.css("z-index",this.options.zIndex),this.$popup_editor.css("z-index",this.options.zIndex+1),this.$overlay&&this.$overlay.css("z-index",this.options.zIndex+2),this.$image_modal&&this.$image_modal.css("z-index",this.options.zIndex+3)},b.prototype.setTheme=function(a){a&&(this.options.theme=a),null!=this.options.theme&&(this.$editor.addClass(this.options.theme+"-theme"),this.$popup_editor.addClass(this.options.theme+"-theme"),this.$box&&this.$box.addClass(this.options.theme+"-theme"),this.$image_modal&&this.$image_modal.addClass(this.options.theme+"-theme"))},b.prototype.setSpellcheck=function(a){void 0!==a&&(this.options.spellcheck=a),this.$element.attr("spellcheck",this.options.spellcheck)},b.prototype.customizeText=function(b){if(b){var c=this.$editor.find("[title]").add(this.$popup_editor.find("[title]"));this.$image_modal&&(c=c.add(this.$image_modal.find("[title]"))),c.each(a.proxy(function(c,d){for(var e in b)a(d).attr("title").toLowerCase()==e.toLowerCase()&&a(d).attr("title",b[e])},this)),c=this.$editor.find('[data-text="true"]').add(this.$popup_editor.find('[data-text="true"]')),this.$image_modal&&(c=c.add(this.$image_modal.find('[data-text="true"]'))),c.each(a.proxy(function(c,d){for(var e in b)a(d).text().toLowerCase()==e.toLowerCase()&&a(d).text(b[e])},this))}},b.prototype.setLanguage=function(b){void 0!==b&&(this.options.language=b),a.Editable.LANGS[this.options.language]&&(this.customizeText(a.Editable.LANGS[this.options.language].translation),a.Editable.LANGS[this.options.language].direction&&a.Editable.LANGS[this.options.language].direction!=a.Editable.DEFAULTS.direction&&this.setDirection(a.Editable.LANGS[this.options.language].direction),a.Editable.LANGS[this.options.language].translation[this.options.placeholder]&&this.setPlaceholder(a.Editable.LANGS[this.options.language].translation[this.options.placeholder]))},b.prototype.setCustomText=function(a){a&&(this.options.customText=a),this.options.customText&&this.customizeText(this.options.customText)},b.prototype.execHTML=function(){this.html()},b.prototype.initHTMLArea=function(){this.$html_area=a('<textarea wrap="hard">').keydown(function(b){var c=b.keyCode||b.which;if(9==c){b.preventDefault();var d=a(this).get(0).selectionStart,e=a(this).get(0).selectionEnd;a(this).val(a(this).val().substring(0,d)+"	"+a(this).val().substring(e)),a(this).get(0).selectionStart=a(this).get(0).selectionEnd=d+1}}).focus(a.proxy(function(){this.blurred&&(this.blurred=!1,this.triggerEvent("focus",[],!1))},this)).mouseup(a.proxy(function(){this.blurred&&(this.blurred=!1,this.triggerEvent("focus",[],!1))},this))},b.prototype.command_dispatcher={align:function(a){var b=this.buildDropdownAlign(a),c=this.buildDropdownButton(a,b);return c},formatBlock:function(a){var b=this.buildDropdownFormatBlock(a),c=this.buildDropdownButton(a,b);return c},html:function(b){var c=this.buildDefaultButton(b);return this.options.inlineMode&&this.$box.append(a(c).clone(!0).addClass("html-switch").attr("title","Hide HTML").click(a.proxy(this.execHTML,this))),this.initHTMLArea(),c}},b.prototype.setButtons=function(a){a&&(this.options.buttons=a),this.$editor.append('<div class="bttn-wrapper" id="bttn-wrapper-'+this._id+'">'),this.$bttn_wrapper=this.$editor.find("#bttn-wrapper-"+this._id),this.mobile()&&this.$bttn_wrapper.addClass("touch");for(var c,d,e="",f=0;f<this.options.buttons.length;f++){var g=this.options.buttons[f];if("sep"!=g){var h=b.commands[g];if(void 0!==h){h.cmd=g;var i=this.command_dispatcher[h.cmd];i?e+=i.apply(this,[h]):h.seed?(c=this.buildDefaultDropdown(h),d=this.buildDropdownButton(h,c),e+=d):(d=this.buildDefaultButton(h),e+=d,this.bindRefreshListener(h))}else{if(h=this.options.customButtons[g],void 0===h){if(h=this.options.customDropdowns[g],void 0===h)continue;d=this.buildCustomDropdown(h,g),e+=d,this.bindRefreshListener(h);continue}d=this.buildCustomButton(h,g),e+=d,this.bindRefreshListener(h)}}else e+=this.options.inlineMode?'<div class="f-clear"></div><hr/>':'<span class="f-sep"></span>'
}this.$bttn_wrapper.html(e),this.$bttn_wrapper.find('button[data-cmd="undo"], button[data-cmd="redo"]').prop("disabled",!0),this.bindButtonEvents()},b.prototype.bindRefreshListener=function(b){b.refresh&&this.addListener("refresh",a.proxy(function(){b.refresh.apply(this,[b.cmd])},this))},b.prototype.buildDefaultButton=function(a){var b='<button tabIndex="-1" type="button" class="fr-bttn" title="'+a.title+'" data-cmd="'+a.cmd+'">';return b+=void 0===this.options.icons[a.cmd]?this.addButtonIcon(a):this.prepareIcon(this.options.icons[a.cmd],a.title),b+="</button>"},b.prototype.prepareIcon=function(a,b){switch(a.type){case"font":return this.addButtonIcon({icon:a.value});case"img":return this.addButtonIcon({icon_img:a.value,title:b});case"txt":return this.addButtonIcon({icon_txt:a.value})}},b.prototype.addButtonIcon=function(a){return a.icon?'<i class="'+a.icon+'"></i>':a.icon_alt?'<i class="for-text">'+a.icon_alt+"</i>":a.icon_img?'<img src="'+a.icon_img+'" alt="'+a.title+'"/>':a.icon_txt?"<i>"+a.icon_txt+"</i>":a.title},b.prototype.buildCustomButton=function(a,b){this["call_"+b]=a.callback;var c='<button tabIndex="-1" type="button" class="fr-bttn" data-callback="call_'+b+'" data-cmd="button_name" data-name="'+b+'" title="'+a.title+'">'+this.prepareIcon(a.icon,a.title)+"</button>";return c},b.prototype.callDropdown=function(b,c){this.$bttn_wrapper.on("click touch",'[data-name="'+b+'"]',a.proxy(function(a){a.preventDefault(),a.stopPropagation(),c.apply(this)},this))},b.prototype.buildCustomDropdown=function(a,b){var c='<div class="fr-bttn fr-dropdown">';c+='<button tabIndex="-1" type="button" class="fr-trigger" title="'+a.title+'" data-name="'+b+'">'+this.prepareIcon(a.icon,a.title)+"</button>",c+='<ul class="fr-dropdown-menu">';var d=0;for(var e in a.options){this["call_"+b+d]=a.options[e];var f='<li data-callback="call_'+b+d+'" data-cmd="'+b+d+'" data-name="'+b+d+'"><a href="#">'+e+"</a></li>";c+=f,d++}return c+="</ul></div>"},b.prototype.buildDropdownButton=function(a,b,c){c=c||"";var d='<div class="fr-bttn fr-dropdown '+c+'">',e="";e+=void 0===this.options.icons[a.cmd]?this.addButtonIcon(a):this.prepareIcon(this.options.icons[a.cmd],a.title);var f='<button tabIndex="-1" type="button" data-name="'+a.cmd+'" class="fr-trigger" title="'+a.title+'">'+e+"</button>";return d+=f,d+=b,d+="</div>"},b.prototype.buildDropdownAlign=function(a){this.bindRefreshListener(a);for(var b='<ul class="fr-dropdown-menu f-align">',c=0;c<a.seed.length;c++){var d=a.seed[c];b+='<li data-cmd="align" data-val="'+d.cmd+'" title="'+d.title+'"><a href="#"><i class="'+d.icon+'"></i></a></li>'}return b+="</ul>"},b.prototype.buildDropdownFormatBlock=function(a){var b='<ul class="fr-dropdown-menu">';for(var c in this.options.blockTags){var d='<li data-cmd="'+a.cmd+'" data-val="'+c+'">';d+='<a href="#" data-text="true" class="format-'+c+'" title="'+this.options.blockTags[c]+'">'+this.options.blockTags[c]+"</a></li>",b+=d}return b+="</ul>"},b.prototype.buildDefaultDropdown=function(a){for(var b='<ul class="fr-dropdown-menu">',c=0;c<a.seed.length;c++){var d=a.seed[c],e='<li data-namespace="'+a.namespace+'" data-cmd="'+(d.cmd||a.cmd)+'" data-val="'+d.value+'" data-param="'+(d.param||a.param)+'">';e+='<a href="#" data-text="true" class="'+d.value+'" title="'+d.title+'">'+d.title+"</a></li>",b+=e}return b+="</ul>"},b.prototype.createEditPopupHTML=function(){var a='<div class="froala-popup froala-text-popup" style="display:none;">';return a+='<h4><span data-text="true">Edit text</span><i title="Cancel" class="fa fa-times" id="f-text-close-'+this._id+'"></i></h4></h4>',a+='<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu" id="f-ti-'+this._id+'">',a+='<button data-text="true" type="button" class="f-ok" id="f-edit-popup-ok-'+this._id+'">OK</button>',a+="</div>",a+="</div>"},b.prototype.buildEditPopup=function(){this.$edit_popup_wrapper=a(this.createEditPopupHTML()),this.$popup_editor.append(this.$edit_popup_wrapper),this.$edit_popup_wrapper.find("#f-ti-"+this._id).on("mouseup keydown",function(a){a.stopPropagation()}),this.addListener("hidePopups",a.proxy(function(){this.$edit_popup_wrapper.hide()},this)),this.$edit_popup_wrapper.on("click","#f-edit-popup-ok-"+this._id,a.proxy(function(){this.$element.text(this.$edit_popup_wrapper.find("#f-ti-"+this._id).val()),this.sync(),this.hide()},this)),this.$edit_popup_wrapper.on("click","i#f-text-close-"+this._id,a.proxy(function(){this.hide()},this))},b.prototype.createCORSRequest=function(a,b){var c=new XMLHttpRequest;if("withCredentials"in c){c.open(a,b,!0),this.options.withCredentials&&(c.withCredentials=!0);for(var d in this.options.headers)c.setRequestHeader(d,this.options.headers[d])}else"undefined"!=typeof XDomainRequest?(c=new XDomainRequest,c.open(a,b)):c=null;return c},b.prototype.isEnabled=function(b){return a.inArray(b,this.options.buttons)>=0},b.prototype.bindButtonEvents=function(){this.bindDropdownEvents(this.$bttn_wrapper),this.bindCommandEvents(this.$bttn_wrapper)},b.prototype.bindDropdownEvents=function(c){var d=this;c.on(this.mousedown,".fr-dropdown .fr-trigger:not([disabled])",function(b){return"mousedown"===b.type&&1!==b.which?!0:("LI"===this.tagName&&"touchstart"===b.type&&d.android()||d.iOS()||b.preventDefault(),void a(this).attr("data-down",!0))}),c.on(this.mouseup,".fr-dropdown .fr-trigger:not([disabled])",function(e){if(d.isDisabled)return!1;if(e.stopPropagation(),e.preventDefault(),!a(this).attr("data-down"))return a("[data-down]").removeAttr("data-down"),!1;a("[data-down]").removeAttr("data-down"),d.options.inlineMode===!1&&0===a(this).parents(".froala-popup").length&&(d.hide(),d.closeImageMode(),d.imageMode=!1),a(this).toggleClass("active").trigger("blur");var f,g=a(this).attr("data-name");return b.commands[g]?f=b.commands[g].refreshOnShow:d.options.customDropdowns[g]?f=d.options.customDropdowns[g].refreshOnShow:b.image_commands[g]&&(f=b.image_commands[g].refreshOnShow),f&&f.call(d),c.find("button.fr-trigger").not(this).removeClass("active"),!1}),c.on(this.mouseup,".fr-dropdown",function(a){a.stopPropagation(),a.preventDefault()}),this.$element.on("mouseup","img, a",a.proxy(function(){return this.isDisabled?!1:void c.find(".fr-dropdown .fr-trigger").removeClass("active")},this)),c.on("click","li[data-cmd] > a",function(a){a.preventDefault()})},b.prototype.bindCommandEvents=function(b){var c=this;b.on(this.mousedown,"button[data-cmd], li[data-cmd], span[data-cmd], a[data-cmd]",function(b){return"mousedown"===b.type&&1!==b.which?!0:("LI"===this.tagName&&"touchstart"===b.type&&c.android()||c.iOS()||b.preventDefault(),void a(this).attr("data-down",!0))}),b.on(this.mouseup+" "+this.move,"button[data-cmd], li[data-cmd], span[data-cmd], a[data-cmd]",a.proxy(function(b){if(c.isDisabled)return!1;if("mouseup"===b.type&&1!==b.which)return!0;var d=b.currentTarget;if("touchmove"!=b.type){if(b.stopPropagation(),b.preventDefault(),!a(d).attr("data-down"))return a("[data-down]").removeAttr("data-down"),!1;if(a("[data-down]").removeAttr("data-down"),a(d).data("dragging")||a(d).attr("disabled"))return a(d).removeData("dragging"),!1;var e=a(d).data("timeout");e&&(clearTimeout(e),a(d).removeData("timeout"));var f=a(d).attr("data-callback");if(c.options.inlineMode===!1&&0===a(d).parents(".froala-popup").length&&(c.hide(),c.closeImageMode(),c.imageMode=!1),f)a(d).parents(".fr-dropdown").find(".fr-trigger.active").removeClass("active"),c[f]();else{var g=a(d).attr("data-namespace"),h=a(d).attr("data-cmd"),i=a(d).attr("data-val"),j=a(d).attr("data-param");g?c["exec"+g](h,i,j):(c.exec(h,i,j),c.$bttn_wrapper.find(".fr-dropdown .fr-trigger").removeClass("active"))}return!1}a(d).data("timeout")||a(d).data("timeout",setTimeout(function(){a(d).data("dragging",!0)},200))},this))},b.prototype.save=function(){if(!this.triggerEvent("beforeSave",[],!1))return!1;if(this.options.saveURL){var b={};for(var c in this.options.saveParams){var d=this.options.saveParams[c];b[c]="function"==typeof d?d.call(this):d}a.ajax({type:this.options.saveRequestType,url:this.options.saveURL,data:a.extend({body:this.getHTML()},this.options.saveParams),crossDomain:this.options.crossDomain,xhrFields:{withCredentials:this.options.withCredentials},headers:this.options.headers}).done(a.proxy(function(a){this.triggerEvent("afterSave",[a])},this)).fail(a.proxy(function(){this.triggerEvent("saveError",["Save request failed on the server."])},this))}else this.triggerEvent("saveError",["Missing save URL."])},b.prototype.isURL=function(a){if(!/^(https?:|ftps?:|)\/\//.test(a))return!1;a=String(a).replace(/</g,"%3C").replace(/>/g,"%3E").replace(/"/g,"%22").replace(/ /g,"%20");var b=/\(?(?:(https?:|ftps?:|)\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|(?:www.)?(?:[^\W\s]|\.|-)|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi;return b.test(a)},b.prototype.sanitizeURL=function(a){if(/^(https?:|ftps?:|)\/\//.test(a)){if(!this.isURL(a))return""}else a=encodeURIComponent(a).replace(/%23/g,"#").replace(/%2F/g,"/").replace(/%25/g,"%").replace(/mailto%3A/g,"mailto:").replace(/tel%3A/g,"tel:").replace(/data%3Aimage/g,"data:image").replace(/webkit-fake-url%3A/g,"webkit-fake-url:").replace(/%3F/g,"?").replace(/%3D/g,"=").replace(/%26/g,"&").replace(/&amp;/g,"&").replace(/%2C/g,",").replace(/%3B/g,";").replace(/%2B/g,"+").replace(/%40/g,"@");return a},b.prototype.parents=function(a,b){return a.get(0)!=this.$element.get(0)?a.parentsUntil(this.$element,b):[]},b.prototype.option=function(b,c){if(void 0===b)return this.options;if(b instanceof Object)this.options=a.extend({},this.options,b),this.initOptions(),this.setCustomText(),this.setLanguage();else{if(void 0===c)return this.options[b];switch(this.options[b]=c,b){case"direction":this.setDirection();break;case"height":case"width":case"minHeight":case"maxHeight":this.setDimensions();break;case"spellcheck":this.setSpellcheck();break;case"placeholder":this.setPlaceholder();break;case"customText":this.setCustomText();break;case"language":this.setLanguage();break;case"textNearImage":this.setTextNearImage();break;case"zIndex":this.setZIndex();break;case"theme":this.setTheme()}}};var c=a.fn.editable;a.fn.editable=function(c){for(var d=[],e=0;e<arguments.length;e++)d.push(arguments[e]);if("string"==typeof c){var f=[];return this.each(function(){var b=a(this),e=b.data("fa.editable");if(!e[c])return a.error("Method "+c+" does not exist in Froala Editor.");var g=e[c].apply(e,d.slice(1));void 0===g?f.push(this):0===f.length&&f.push(g)}),1==f.length?f[0]:f}return"object"!=typeof c&&c?void 0:this.each(function(){var d=this,e=a(d),f=e.data("fa.editable");f||e.data("fa.editable",f=new b(d,c))})},a.fn.editable.Constructor=b,a.Editable=b,a.fn.editable.noConflict=function(){return a.fn.editable=c,this}}(window.jQuery),function(a){a.Editable.prototype.initUndoRedo=function(){this.undoStack=[],this.undoIndex=0,this.saveUndoStep(),this.disableBrowserUndo()},a.Editable.prototype.undo=function(){if(this.no_verify=!0,this.undoIndex>1){clearTimeout(this.typingTimer),this.triggerEvent("beforeUndo",[],!1);var a=this.undoStack[--this.undoIndex-1];this.restoreSnapshot(a),this.doingRedo=!0,this.triggerEvent("afterUndo",[]),this.doingRedo=!1,""!==this.text()?this.repositionEditor():this.hide(),this.$element.trigger("placeholderCheck"),this.focus(),this.refreshButtons()}this.no_verify=!1},a.Editable.prototype.redo=function(){if(this.no_verify=!0,this.undoIndex<this.undoStack.length){clearTimeout(this.typingTimer),this.triggerEvent("beforeRedo",[],!1);var a=this.undoStack[this.undoIndex++];this.restoreSnapshot(a),this.doingRedo=!0,this.triggerEvent("afterRedo",[]),this.doingRedo=!1,""!==this.text()?this.repositionEditor():this.hide(),this.$element.trigger("placeholderCheck"),this.focus(),this.refreshButtons()}this.no_verify=!1},a.Editable.prototype.saveUndoStep=function(){if(!this.undoStack)return!1;for(;this.undoStack.length>this.undoIndex;)this.undoStack.pop();var a=this.getSnapshot();this.undoStack[this.undoIndex-1]&&this.identicSnapshots(this.undoStack[this.undoIndex-1],a)||(this.undoStack.push(a),this.undoIndex++),this.refreshUndo(),this.refreshRedo()},a.Editable.prototype.refreshUndo=function(){if(this.isEnabled("undo")){if(void 0===this.$editor)return;this.$bttn_wrapper.find('[data-cmd="undo"]').removeAttr("disabled"),(0===this.undoStack.length||this.undoIndex<=1||this.isHTML)&&this.$bttn_wrapper.find('[data-cmd="undo"]').attr("disabled",!0)}},a.Editable.prototype.refreshRedo=function(){if(this.isEnabled("redo")){if(void 0===this.$editor)return;this.$bttn_wrapper.find('[data-cmd="redo"]').removeAttr("disabled"),(this.undoIndex==this.undoStack.length||this.isHTML)&&this.$bttn_wrapper.find('[data-cmd="redo"]').prop("disabled",!0)}},a.Editable.prototype.getNodeIndex=function(a){for(var b=a.parentNode.childNodes,c=0,d=null,e=0;e<b.length;e++){if(d){var f=3===b[e].nodeType&&""===b[e].textContent,g=3===d.nodeType&&3===b[e].nodeType;f||g||c++}if(b[e]==a)return c;d=b[e]}},a.Editable.prototype.getNodeLocation=function(a){var b=[];if(!a.parentNode)return[];for(;a!=this.$element.get(0);)b.push(this.getNodeIndex(a)),a=a.parentNode;return b.reverse()},a.Editable.prototype.getNodeByLocation=function(a){for(var b=this.$element.get(0),c=0;c<a.length;c++)b=b.childNodes[a[c]];return b},a.Editable.prototype.getRealNodeOffset=function(a,b){for(;a&&3===a.nodeType;){var c=a.previousSibling;c&&3==c.nodeType&&(b+=c.textContent.length),a=c}return b},a.Editable.prototype.getRangeSnapshot=function(a){return{scLoc:this.getNodeLocation(a.startContainer),scOffset:this.getRealNodeOffset(a.startContainer,a.startOffset),ecLoc:this.getNodeLocation(a.endContainer),ecOffset:this.getRealNodeOffset(a.endContainer,a.endOffset)}},a.Editable.prototype.getSnapshot=function(){var a={};if(a.html=this.$element.html(),a.ranges=[],this.selectionInEditor()&&this.$element.is(":focus"))for(var b=this.getRanges(),c=0;c<b.length;c++)a.ranges.push(this.getRangeSnapshot(b[c]));return a},a.Editable.prototype.identicSnapshots=function(a,b){return a.html!=b.html?!1:JSON.stringify(a.ranges)!=JSON.stringify(b.ranges)?!1:!0},a.Editable.prototype.restoreRangeSnapshot=function(a,b){try{var c=this.getNodeByLocation(a.scLoc),d=a.scOffset,e=this.getNodeByLocation(a.ecLoc),f=a.ecOffset,g=this.document.createRange();g.setStart(c,d),g.setEnd(e,f),b.addRange(g)}catch(h){}},a.Editable.prototype.restoreSnapshot=function(b){this.$element.html()!=b.html&&this.$element.html(b.html);var c=this.getSelection();this.clearSelection(),this.$element.focus();for(var d=0;d<b.ranges.length;d++)this.restoreRangeSnapshot(b.ranges[d],c);setTimeout(a.proxy(function(){this.$element.find(".f-img-wrap img").click()},this),0)}}(jQuery),function(a){a.Editable.prototype.refreshButtons=function(b){return this.initialized&&(this.selectionInEditor()&&!this.isHTML||this.browser.msie&&a.Editable.getIEversion()<9||b)?(this.$editor.find("button[data-cmd]").removeClass("active"),this.refreshDisabledState(),void this.raiseEvent("refresh")):!1},a.Editable.prototype.refreshDisabledState=function(){if(this.isHTML)return!1;if(this.$editor){for(var b=0;b<this.options.buttons.length;b++){var c=this.options.buttons[b];if(void 0!==a.Editable.commands[c]){var d=!1;a.isFunction(a.Editable.commands[c].disabled)?d=a.Editable.commands[c].disabled.apply(this):void 0!==a.Editable.commands[c].disabled&&(d=!0),d?(this.$editor.find('button[data-cmd="'+c+'"]').prop("disabled",!0),this.$editor.find('button[data-name="'+c+'"]').prop("disabled",!0)):(this.$editor.find('button[data-cmd="'+c+'"]').removeAttr("disabled"),this.$editor.find('button[data-name="'+c+'"]').removeAttr("disabled"))}}this.refreshUndo(),this.refreshRedo()}},a.Editable.prototype.refreshFormatBlocks=function(){var a=this.getSelectionElements()[0],b=a.tagName.toLowerCase();this.options.paragraphy&&b===this.options.defaultTag.toLowerCase()&&(b="n"),this.$editor.find('.fr-bttn > button[data-name="formatBlock"] + ul li').removeClass("active"),this.$bttn_wrapper.find('.fr-bttn > button[data-name="formatBlock"] + ul li[data-val="'+b+'"]').addClass("active")},a.Editable.prototype.refreshDefault=function(a){try{this.document.queryCommandState(a)===!0&&this.$editor.find('[data-cmd="'+a+'"]').addClass("active")}catch(b){}},a.Editable.prototype.refreshAlign=function(){var b=a(this.getSelectionElements()[0]);this.$editor.find('.fr-dropdown > button[data-name="align"] + ul li').removeClass("active");var c,d=b.css("text-align");["left","right","justify","center"].indexOf(d)<0&&(d="left"),"left"==d?c="justifyLeft":"right"==d?c="justifyRight":"justify"==d?c="justifyFull":"center"==d&&(c="justifyCenter"),this.$editor.find('.fr-dropdown > button[data-name="align"].fr-trigger i').attr("class","fa fa-align-"+d),this.$editor.find('.fr-dropdown > button[data-name="align"] + ul li[data-val="'+c+'"]').addClass("active")},a.Editable.prototype.refreshHTML=function(){this.isActive("html")?this.$editor.find('[data-cmd="html"]').addClass("active"):this.$editor.find('[data-cmd="html"]').removeClass("active")}}(jQuery),function(a){a.Editable.commands={bold:{title:"Bold",icon:"fa fa-bold",shortcut:"(Ctrl + B)",refresh:a.Editable.prototype.refreshDefault,undo:!0,callbackWithoutSelection:function(a){this._startInDefault(a)}},italic:{title:"Italic",icon:"fa fa-italic",shortcut:"(Ctrl + I)",refresh:a.Editable.prototype.refreshDefault,undo:!0,callbackWithoutSelection:function(a){this._startInDefault(a)}},underline:{cmd:"underline",title:"Underline",icon:"fa fa-underline",shortcut:"(Ctrl + U)",refresh:a.Editable.prototype.refreshDefault,undo:!0,callbackWithoutSelection:function(a){this._startInDefault(a)}},strikeThrough:{title:"Strikethrough",icon:"fa fa-strikethrough",refresh:a.Editable.prototype.refreshDefault,undo:!0,callbackWithoutSelection:function(a){this._startInDefault(a)}},subscript:{title:"Subscript",icon:"fa fa-subscript",refresh:a.Editable.prototype.refreshDefault,undo:!0,callbackWithoutSelection:function(a){this._startInDefault(a)}},superscript:{title:"Superscript",icon:"fa fa-superscript",refresh:a.Editable.prototype.refreshDefault,undo:!0,callbackWithoutSelection:function(a){this._startInDefault(a)}},formatBlock:{title:"Format Block",icon:"fa fa-paragraph",refreshOnShow:a.Editable.prototype.refreshFormatBlocks,callback:function(a,b){this.formatBlock(b)},undo:!0},align:{title:"Alignment",icon:"fa fa-align-left",refresh:a.Editable.prototype.refreshAlign,refreshOnShow:a.Editable.prototype.refreshAlign,seed:[{cmd:"justifyLeft",title:"Align Left",icon:"fa fa-align-left"},{cmd:"justifyCenter",title:"Align Center",icon:"fa fa-align-center"},{cmd:"justifyRight",title:"Align Right",icon:"fa fa-align-right"},{cmd:"justifyFull",title:"Justify",icon:"fa fa-align-justify"}],callback:function(a,b){this.align(b)},undo:!0},outdent:{title:"Indent Less",icon:"fa fa-dedent",activeless:!0,shortcut:"(Ctrl + <)",callback:function(){this.outdent(!0)},undo:!0},indent:{title:"Indent More",icon:"fa fa-indent",activeless:!0,shortcut:"(Ctrl + >)",callback:function(){this.indent()},undo:!0},selectAll:{title:"Select All",icon:"fa fa-file-text",shortcut:"(Ctrl + A)",callback:function(a,b){this.$element.focus(),this.execDefault(a,b)},undo:!1},createLink:{title:"Insert Link",icon:"fa fa-link",shortcut:"(Ctrl + K)",callback:function(){this.insertLink()},undo:!1},insertImage:{title:"Insert Image",icon:"fa fa-picture-o",activeless:!0,shortcut:"(Ctrl + P)",callback:function(){this.insertImage()},undo:!1},undo:{title:"Undo",icon:"fa fa-undo",activeless:!0,shortcut:"(Ctrl+Z)",refresh:a.Editable.prototype.refreshUndo,callback:function(){this.undo()},undo:!1},redo:{title:"Redo",icon:"fa fa-repeat",activeless:!0,shortcut:"(Shift+Ctrl+Z)",refresh:a.Editable.prototype.refreshRedo,callback:function(){this.redo()},undo:!1},html:{title:"Show HTML",icon:"fa fa-code",refresh:a.Editable.prototype.refreshHTML,callback:function(){this.html()},undo:!1},save:{title:"Save",icon:"fa fa-floppy-o",callback:function(){this.save()},undo:!1},insertHorizontalRule:{title:"Insert Horizontal Line",icon:"fa fa-minus",callback:function(a){this.insertHR(a)},undo:!0},removeFormat:{title:"Clear formatting",icon:"fa fa-eraser",activeless:!0,callback:function(){this.removeFormat()},undo:!0}},a.Editable.prototype.exec=function(b,c,d){return!this.selectionInEditor()&&a.Editable.commands[b].undo&&this.focus(),this.selectionInEditor()&&""===this.text()&&a.Editable.commands[b].callbackWithoutSelection?(a.Editable.commands[b].callbackWithoutSelection.apply(this,[b,c,d]),!1):void(a.Editable.commands[b].callback?a.Editable.commands[b].callback.apply(this,[b,c,d]):this.execDefault(b,c))},a.Editable.prototype.html=function(){var a;this.isHTML?(this.isHTML=!1,a=this.$html_area.val(),this.$box.removeClass("f-html"),this.$element.attr("contenteditable",!0),this.setHTML(a,!1),this.$editor.find('.fr-bttn:not([data-cmd="html"]), .fr-trigger').removeAttr("disabled"),this.$editor.find('.fr-bttn[data-cmd="html"]').removeClass("active"),this.$element.blur(),this.focus(),this.refreshButtons(),this.triggerEvent("htmlHide",[a],!0,!1)):(this.$box.removeClass("f-placeholder"),this.clearSelection(),this.cleanify(!1,!0,!1),a=this.cleanTags(this.getHTML(!1,!1)),this.$html_area.val(a).trigger("resize"),this.$html_area.css("height",this.$element.height()-1),this.$element.html("").append(this.$html_area).removeAttr("contenteditable"),this.$box.addClass("f-html"),this.$editor.find('button.fr-bttn:not([data-cmd="html"]), button.fr-trigger').attr("disabled",!0),this.$editor.find('.fr-bttn[data-cmd="html"]').addClass("active"),this.isHTML=!0,this.hide(),this.imageMode=!1,this.$element.blur(),this.$element.removeAttr("contenteditable"),this.triggerEvent("htmlShow",[a],!0,!1))},a.Editable.prototype.insertHR=function(b){this.$element.find("hr").addClass("fr-tag"),this.$element.hasClass("f-placeholder")?a(this.$element.find("> "+this.valid_nodes.join(", >"))[0]).before("<hr/>"):this.document.execCommand(b),this.hide();var c=this.$element.find("hr:not(.fr-tag)").next(this.valid_nodes.join(","));c.length>0?a(c[0]).prepend(this.markers_html):this.$element.find("hr:not(.fr-tag)").after(this.options.paragraphy?"<p>"+this.markers_html+"<br/></p>":this.markers_html),this.restoreSelectionByMarkers(),this.triggerEvent(b,[],!0,!1)},a.Editable.prototype.formatBlock=function(b){if(this.disabledList.indexOf("formatBlock")>=0)return!1;if(this.browser.msie&&a.Editable.getIEversion()<9)return"n"==b&&(b=this.options.defaultTag),this.document.execCommand("formatBlock",!1,"<"+b+">"),this.triggerEvent("formatBlock"),!1;if(this.$element.hasClass("f-placeholder")){if(this.options.paragraphy||"n"!=b){"n"==b&&(b=this.options.defaultTag);var c=a("<"+b+"><br/></"+b+">");this.$element.html(c),this.setSelection(c.get(0),0),this.$element.removeClass("f-placeholder")}}else{this.saveSelectionByMarkers(),this.wrapText(),this.restoreSelectionByMarkers();var d=this.getSelectionElements();d[0]==this.$element.get(0)&&(d=this.$element.find("> "+this.valid_nodes.join(", >"))),this.saveSelectionByMarkers();for(var e,f=function(b){if("PRE"==b.get(0).tagName)for(;b.find("br + br").length>0;){var c=a(b.find("br + br")[0]);c.prev().remove(),c.replaceWith("\n\n")}},g=0;g<d.length;g++){var h=a(d[g]);if(!this.fakeEmpty(h)){if(f(h),!this.options.paragraphy&&this.emptyElement(h.get(0))&&h.append("<br/>"),"n"==b)if(this.options.paragraphy){var i="<"+this.options.defaultTag+this.attrs(h.get(0))+">"+h.html()+"</"+this.options.defaultTag+">";e=a(i)}else e=h.html()+"<br/>";else e=a("<"+b+this.attrs(h.get(0))+">").html(h.html());h.get(0)!=this.$element.get(0)?h.replaceWith(e):h.html(e)}}this.unwrapText(),this.$element.find("pre + pre").each(function(){a(this).prepend(a(this).prev().html()+"<br/><br/>"),a(this).prev().remove()});var j=this;this.$element.find(this.valid_nodes.join(",")).each(function(){"PRE"!=this.tagName&&a(this).replaceWith("<"+this.tagName+j.attrs(this)+">"+a(this).html().replace(/\n\n/gi,"</"+this.tagName+"><"+this.tagName+">")+"</"+this.tagName+">")}),this.$element.find(this.valid_nodes.join(":empty ,")+":empty").append("<br/>"),this.cleanupLists(),this.restoreSelectionByMarkers()}this.triggerEvent("formatBlock"),this.repositionEditor()},a.Editable.prototype.align=function(b){if(this.browser.msie&&a.Editable.getIEversion()<9)return this.document.execCommand(b,!1,!1),this.triggerEvent("align",[b]),!1;this.saveSelectionByMarkers(),this.wrapText(),this.restoreSelectionByMarkers(),this.saveSelectionByMarkers();var c=this.getSelectionElements();"justifyLeft"==b?b="left":"justifyRight"==b?b="right":"justifyCenter"==b?b="center":"justifyFull"==b&&(b="justify");for(var d=0;d<c.length;d++)this.parents(a(c[d]),"LI").length>0&&(c[d]=a(c[d]).parents("LI").get(0)),a(c[d]).css("text-align",b);this.cleanupLists(),this.unwrapText(),this.restoreSelectionByMarkers(),this.repositionEditor(),this.triggerEvent("align",[b])},a.Editable.prototype.indent=function(b,c){if(void 0===c&&(c=!0),this.browser.msie&&a.Editable.getIEversion()<9)return b?this.document.execCommand("outdent",!1,!1):this.document.execCommand("indent",!1,!1),!1;var d=20;b&&(d=-20),this.saveSelectionByMarkers(),this.wrapText(),this.restoreSelectionByMarkers();var e=this.getSelectionElements();this.saveSelectionByMarkers();for(var f=0;f<e.length;f++){var g=a(e[f]);if(g.parentsUntil(this.$element,"li").length>0&&(g=g.closest("li")),this.raiseEvent("indent",[g,b]))if(g.get(0)!=this.$element.get(0)){var h=parseInt(g.css("margin-left"),10),i=Math.max(0,h+d);g.css("marginLeft",i),0===i&&(g.css("marginLeft",""),void 0===g.css("style")&&g.removeAttr("style"))}else{var j=a("<div>").html(g.html());g.html(j),j.css("marginLeft",Math.max(0,d)),0===Math.max(0,d)&&(j.css("marginLeft",""),void 0===j.css("style")&&j.removeAttr("style"))}}this.unwrapText(),this.restoreSelectionByMarkers(),c&&this.repositionEditor(),b||this.triggerEvent("indent")},a.Editable.prototype.outdent=function(a){this.indent(!0,a),this.triggerEvent("outdent")},a.Editable.prototype.execDefault=function(a,b){this.saveUndoStep(),this.document.execCommand(a,!1,b),this.triggerEvent(a,[],!0,!0)},a.Editable.prototype._startInDefault=function(a){this.focus(),this.document.execCommand(a,!1,!1),this.refreshButtons()},a.Editable.prototype._startInFontExec=function(b,c,d){this.focus();try{var e=this.getRange(),f=e.cloneRange();f.collapse(!1);var g=a('<span data-inserted="true" data-fr-verified="true" style="'+b+": "+d+';">'+a.Editable.INVISIBLE_SPACE+"</span>",this.document);f.insertNode(g[0]),g=this.$element.find("[data-inserted]"),g.removeAttr("data-inserted"),this.setSelection(g.get(0),1)}catch(h){}},a.Editable.prototype.removeFormat=function(){this.document.execCommand("removeFormat",!1,!1),this.document.execCommand("unlink",!1,!1)},a.Editable.prototype.inlineStyle=function(b,c,d){if(this.browser.webkit&&"font-size"!=b){var e=function(a){return a.attr("style").indexOf("font-size")>=0};this.$element.find("span").each(function(b,c){var d=a(c);d.attr("style")&&e(d)&&(d.data("font-size",d.css("font-size")),d.css("font-size",""))})}this.document.execCommand("fontSize",!1,4),this.saveSelectionByMarkers(),this.browser.webkit&&"font-size"!=b&&this.$element.find("span").each(function(b,c){var d=a(c);d.data("font-size")&&(d.css("font-size",d.data("font-size")),d.removeData("font-size"))});var f=function(c){var e=a(c);e.css(b)!=d&&e.css(b,""),""===e.attr("style")&&e.replaceWith(e.html())};this.$element.find("font").each(function(c,e){var g=a('<span data-fr-verified="true" style="'+b+": "+d+';">'+a(e).html()+"</span>");a(e).replaceWith(g);for(var h=g.find("span"),i=h.length-1;i>=0;i--)f(h[i])}),this.removeBlankSpans(),this.restoreSelectionByMarkers(),this.repositionEditor(),null!=c&&this.triggerEvent(c,[d],!0,!0)}}(jQuery),function(a){a.Editable.prototype.addListener=function(a,b){var c=this._events,d=c[a]=c[a]||[];d.push(b)},a.Editable.prototype.raiseEvent=function(a,b){void 0===b&&(b=[]);var c=!0,d=this._events[a];if(d)for(var e=0,f=d.length;f>e;e++){var g=d[e].apply(this,b);void 0!==g&&c!==!1&&(c=g)}return void 0===c&&(c=!0),c}}(jQuery),function(a){a.Editable.prototype.start_marker='<span class="f-marker" data-id="0" data-fr-verified="true" data-type="true"></span>',a.Editable.prototype.end_marker='<span class="f-marker" data-id="0" data-fr-verified="true" data-type="false"></span>',a.Editable.prototype.markers_html='<span class="f-marker" data-id="0" data-fr-verified="true" data-type="false"></span><span class="f-marker" data-id="0" data-fr-verified="true" data-type="true"></span>',a.Editable.prototype.text=function(){var a="";return this.window.getSelection?a=this.window.getSelection():this.document.getSelection?a=this.document.getSelection():this.document.selection&&(a=this.document.selection.createRange().text),a.toString()},a.Editable.prototype.selectionInEditor=function(){var b=this.getSelectionParent(),c=!1;return b==this.$element.get(0)&&(c=!0),c===!1&&a(b).parents().each(a.proxy(function(a,b){b==this.$element.get(0)&&(c=!0)},this)),c},a.Editable.prototype.getSelection=function(){var a="";return a=this.window.getSelection?this.window.getSelection():this.document.getSelection?this.document.getSelection():this.document.selection.createRange()},a.Editable.prototype.getRange=function(){var a=this.getRanges();return a.length>0?a[0]:null},a.Editable.prototype.getRanges=function(){var a=this.getSelection();if(a.getRangeAt&&a.rangeCount){for(var b=[],c=0;c<a.rangeCount;c++)b.push(a.getRangeAt(c));return b}return this.document.createRange?[this.document.createRange()]:[]},a.Editable.prototype.clearSelection=function(){var a=this.getSelection();try{a.removeAllRanges?a.removeAllRanges():a.empty?a.empty():a.clear&&a.clear()}catch(b){}},a.Editable.prototype.getSelectionElement=function(){var b=this.getSelection();if(b.rangeCount){var c=this.getRange(),d=c.startContainer;if(1==d.nodeType){var e=!1;d.childNodes.length>0&&d.childNodes[c.startOffset]&&a(d.childNodes[c.startOffset]).text()===this.text()&&(d=d.childNodes[c.startOffset],e=!0),!e&&d.childNodes.length>0&&a(d.childNodes[0]).text()===this.text()&&["BR","IMG","HR"].indexOf(d.childNodes[0].tagName)<0&&(d=d.childNodes[0])}for(;1!=d.nodeType&&d.parentNode;)d=d.parentNode;for(var f=d;f&&"BODY"!=f.tagName;){if(f==this.$element.get(0))return d;f=a(f).parent()[0]}}return this.$element.get(0)},a.Editable.prototype.getSelectionParent=function(){var b,c=null;return this.window.getSelection?(b=this.window.getSelection(),b.rangeCount&&(c=b.getRangeAt(0).commonAncestorContainer,1!=c.nodeType&&(c=c.parentNode))):(b=this.document.selection)&&"Control"!=b.type&&(c=b.createRange().parentElement()),null!=c&&(a.inArray(this.$element.get(0),a(c).parents())>=0||c==this.$element.get(0))?c:null},a.Editable.prototype.nodeInRange=function(a,b){var c;if(a.intersectsNode)return a.intersectsNode(b);c=b.ownerthis.document.createRange();try{c.selectNode(b)}catch(d){c.selectNodeContents(b)}return-1==a.compareBoundaryPoints(Range.END_TO_START,c)&&1==a.compareBoundaryPoints(Range.START_TO_END,c)},a.Editable.prototype.getElementFromNode=function(b){for(1!=b.nodeType&&(b=b.parentNode);null!==b&&this.valid_nodes.indexOf(b.tagName)<0;)b=b.parentNode;return null!=b&&"LI"==b.tagName&&a(b).find(this.valid_nodes.join(",")).not("li").length>0?null:a.makeArray(a(b).parents()).indexOf(this.$element.get(0))>=0?b:null},a.Editable.prototype.nextNode=function(a,b){if(a.hasChildNodes())return a.firstChild;for(;a&&!a.nextSibling&&a!=b;)a=a.parentNode;return a&&a!=b?a.nextSibling:null},a.Editable.prototype.getRangeSelectedNodes=function(a){var b=[],c=a.startContainer,d=a.endContainer;if(c==d&&"TR"!=c.tagName){if(c.hasChildNodes()&&0!==c.children.length){for(var e=c.children,f=a.startOffset;f<a.endOffset;f++)e[f]&&b.push(e[f]);return 0===b.length&&b.push(c),b}return[c]}if(c==d&&"TR"==c.tagName){var g=c.childNodes,h=a.startOffset;if(g.length>h&&h>=0){var i=g[h];if("TD"==i.tagName||"TH"==i.tagName)return[i]}}for(;c&&c!=d;)b.push(c=this.nextNode(c,d));
for(c=a.startContainer;c&&c!=a.commonAncestorContainer;)b.unshift(c),c=c.parentNode;return b},a.Editable.prototype.getSelectedNodes=function(){if(this.window.getSelection){var b=this.window.getSelection();if(!b.isCollapsed){for(var c=this.getRanges(),d=[],e=0;e<c.length;e++)d=a.merge(d,this.getRangeSelectedNodes(c[e]));return d}if(this.selectionInEditor()){var f=b.getRangeAt(0).startContainer;return 3==f.nodeType?[f.parentNode]:[f]}}return[]},a.Editable.prototype.getSelectionElements=function(){var b=this.getSelectedNodes(),c=[];return a.each(b,a.proxy(function(a,b){if(null!==b){var d=this.getElementFromNode(b);c.indexOf(d)<0&&d!=this.$element.get(0)&&null!==d&&c.push(d)}},this)),0===c.length&&c.push(this.$element.get(0)),c},a.Editable.prototype.getSelectionLink=function(){var b=this.getSelectionLinks();return b.length>0?a(b[0]).attr("href"):null},a.Editable.prototype.saveSelection=function(){if(!this.selectionDisabled){this.savedRanges=[];for(var a=this.getRanges(),b=0;b<a.length;b++)this.savedRanges.push(a[b].cloneRange())}},a.Editable.prototype.restoreSelection=function(){if(!this.selectionDisabled){var a,b,c=this.getSelection();if(this.savedRanges&&this.savedRanges.length)for(c.removeAllRanges(),a=0,b=this.savedRanges.length;b>a;a+=1)c.addRange(this.savedRanges[a]);this.savedRanges=null}},a.Editable.prototype.insertMarkersAtPoint=function(a){var b=a.clientX,c=a.clientY;this.removeMarkers();var d,e=null;if("undefined"!=typeof this.document.caretPositionFromPoint?(d=this.document.caretPositionFromPoint(b,c),e=this.document.createRange(),e.setStart(d.offsetNode,d.offset),e.setEnd(d.offsetNode,d.offset)):"undefined"!=typeof this.document.caretRangeFromPoint&&(d=this.document.caretRangeFromPoint(b,c),e=this.document.createRange(),e.setStart(d.startContainer,d.startOffset),e.setEnd(d.startContainer,d.startOffset)),null!==e&&"undefined"!=typeof this.window.getSelection){var f=this.window.getSelection();f.removeAllRanges(),f.addRange(e)}else if("undefined"!=typeof this.document.body.createTextRange)try{e=this.document.body.createTextRange(),e.moveToPoint(b,c);var g=e.duplicate();g.moveToPoint(b,c),e.setEndPoint("EndToEnd",g),e.select()}catch(h){}this.placeMarker(e,!0,0),this.placeMarker(e,!1,0)},a.Editable.prototype.saveSelectionByMarkers=function(){if(!this.selectionDisabled){this.selectionInEditor()||this.focus(),this.removeMarkers();for(var a=this.getRanges(),b=0;b<a.length;b++)if(a[b].startContainer!==this.document){var c=a[b];this.placeMarker(c,!0,b),this.placeMarker(c,!1,b)}}},a.Editable.prototype.hasSelectionByMarkers=function(){var a=this.$element.find('.f-marker[data-type="true"]');return a.length>0?!0:!1},a.Editable.prototype.restoreSelectionByMarkers=function(b){if(void 0===b&&(b=!0),!this.selectionDisabled){var c=this.$element.find('.f-marker[data-type="true"]');if(0===c.length)return!1;this.$element.is(":focus")||this.browser.msie||this.$element.focus();var d=this.getSelection();(b||this.getRange()&&!this.getRange().collapsed||!a(c[0]).attr("data-collapsed"))&&(this.browser.msie&&a.Editable.getIEversion()<9||(this.clearSelection(),b=!0));for(var e=0;e<c.length;e++){var f=a(c[e]).data("id"),g=c[e],h=this.$element.find('.f-marker[data-type="false"][data-id="'+f+'"]');if(this.browser.msie&&a.Editable.getIEversion()<9)return this.setSelection(g,0,h,0),this.removeMarkers(),!1;var i;if(i=b?this.document.createRange():this.getRange(),h.length>0){h=h[0];try{i.setStartAfter(g),i.setEndBefore(h)}catch(j){}}b&&d.addRange(i)}this.removeMarkers()}},a.Editable.prototype.setSelection=function(a,b,c,d){var e=this.getSelection();if(e){this.clearSelection();try{c||(c=a),void 0===b&&(b=0),void 0===d&&(d=b);var f=this.getRange();f.setStart(a,b),f.setEnd(c,d),e.addRange(f)}catch(g){}}},a.Editable.prototype.buildMarker=function(b,c,d){return void 0===d&&(d=""),a('<span class="f-marker"'+d+' style="display:none; line-height: 0;" data-fr-verified="true" data-id="'+c+'" data-type="'+b+'">',this.document)[0]},a.Editable.prototype.placeMarker=function(b,c,d){var e="";b.collapsed&&(e=' data-collapsed="true"');try{var f=b.cloneRange();if(f.collapse(c),f.insertNode(this.buildMarker(c,d,e)),c===!0&&e)for(var g=this.$element.find('span.f-marker[data-type="true"][data-id="'+d+'"]').get(0).nextSibling;3===g.nodeType&&0===g.data.length;)a(g).remove(),g=this.$element.find('span.f-marker[data-type="true"][data-id="'+d+'"]').get(0).nextSibling}catch(h){}},a.Editable.prototype.removeMarkers=function(){this.$element.find(".f-marker").remove()},a.Editable.prototype.getSelectionTextInfo=function(a){var b,c,d=!1,e=!1;if(this.window.getSelection){var f=this.window.getSelection();f.rangeCount&&(b=f.getRangeAt(0),c=b.cloneRange(),c.selectNodeContents(a),c.setEnd(b.startContainer,b.startOffset),d=""===c.toString(),c.selectNodeContents(a),c.setStart(b.endContainer,b.endOffset),e=""===c.toString())}else this.document.selection&&"Control"!=this.document.selection.type&&(b=this.document.selection.createRange(),c=b.duplicate(),c.moveToElementText(a),c.setEndPoint("EndToStart",b),d=""===c.text,c.moveToElementText(a),c.setEndPoint("StartToEnd",b),e=""===c.text);return{atStart:d,atEnd:e}},a.Editable.prototype.endsWith=function(a,b){return-1!==a.indexOf(b,a.length-b.length)}}(jQuery),function(a){a.Editable.hexToRGB=function(a){var b=/^#?([a-f\d])([a-f\d])([a-f\d])$/i;a=a.replace(b,function(a,b,c,d){return b+b+c+c+d+d});var c=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(a);return c?{r:parseInt(c[1],16),g:parseInt(c[2],16),b:parseInt(c[3],16)}:null},a.Editable.hexToRGBString=function(a){var b=this.hexToRGB(a);return b?"rgb("+b.r+", "+b.g+", "+b.b+")":""},a.Editable.RGBToHex=function(a){function b(a){return("0"+parseInt(a,10).toString(16)).slice(-2)}try{return a&&"transparent"!==a?/^#[0-9A-F]{6}$/i.test(a)?a:(a=a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),("#"+b(a[1])+b(a[2])+b(a[3])).toUpperCase()):""}catch(c){return null}},a.Editable.getIEversion=function(){var a,b,c=-1;return"Microsoft Internet Explorer"==navigator.appName?(a=navigator.userAgent,b=new RegExp("MSIE ([0-9]{1,}[\\.0-9]{0,})"),null!==b.exec(a)&&(c=parseFloat(RegExp.$1))):"Netscape"==navigator.appName&&(a=navigator.userAgent,b=new RegExp("Trident/.*rv:([0-9]{1,}[\\.0-9]{0,})"),null!==b.exec(a)&&(c=parseFloat(RegExp.$1))),c},a.Editable.browser=function(){var a={};if(this.getIEversion()>0)a.msie=!0;else{var b=navigator.userAgent.toLowerCase(),c=/(chrome)[ \/]([\w.]+)/.exec(b)||/(webkit)[ \/]([\w.]+)/.exec(b)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(b)||/(msie) ([\w.]+)/.exec(b)||b.indexOf("compatible")<0&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(b)||[],d={browser:c[1]||"",version:c[2]||"0"};c[1]&&(a[d.browser]=!0),parseInt(d.version,10)<9&&a.msie&&(a.oldMsie=!0),a.chrome?a.webkit=!0:a.webkit&&(a.safari=!0)}return a},a.Editable.isArray=function(a){return a&&!a.propertyIsEnumerable("length")&&"object"==typeof a&&"number"==typeof a.length},a.Editable.uniq=function(b){return a.grep(b,function(c,d){return d==a.inArray(c,b)})},a.Editable.cleanWhitespace=function(b){b.contents().filter(function(){return 1==this.nodeType&&a.Editable.cleanWhitespace(a(this)),3==this.nodeType&&!/\S/.test(this.nodeValue)}).remove()}}(jQuery),function(a){a.Editable.prototype.show=function(b){if(this.hideDropdowns(),void 0!==b){if(this.options.inlineMode||this.options.editInPopup)if(null!==b&&"touchend"!==b.type){if(this.options.showNextToCursor){var c=b.pageX,d=b.pageY;c<this.$element.offset().left&&(c=this.$element.offset().left),c>this.$element.offset().left+this.$element.width()&&(c=this.$element.offset().left+this.$element.width()),d<this.$element.offset.top&&(d=this.$element.offset().top),d>this.$element.offset().top+this.$element.height()&&(d=this.$element.offset().top+this.$element.height()),20>c&&(c=20),0>d&&(d=0),this.showByCoordinates(c,d)}else this.repositionEditor();a(".froala-editor:not(.f-basic)").hide(),this.$editor.show(),0!==this.options.buttons.length||this.options.editInPopup||this.$editor.hide()}else a(".froala-editor:not(.f-basic)").hide(),this.$editor.show(),this.repositionEditor();this.hidePopups(),this.options.editInPopup||this.showEditPopupWrapper(),this.$bttn_wrapper.show(),this.refreshButtons(),this.imageMode=!1}},a.Editable.prototype.hideDropdowns=function(){this.$bttn_wrapper.find(".fr-dropdown .fr-trigger").removeClass("active"),this.$bttn_wrapper.find(".fr-dropdown .fr-trigger")},a.Editable.prototype.hide=function(a){return this.initialized?(void 0===a&&(a=!0),a?this.hideOtherEditors():(this.closeImageMode(),this.imageMode=!1),this.$popup_editor.hide(),this.hidePopups(!1),void(this.link=!1)):!1},a.Editable.prototype.hideOtherEditors=function(){for(var b=1;b<=a.Editable.count;b++)b!=this._id&&this.$window.trigger("hide."+b)},a.Editable.prototype.hideBttnWrapper=function(){this.options.inlineMode&&this.$bttn_wrapper.hide()},a.Editable.prototype.showBttnWrapper=function(){this.options.inlineMode&&this.$bttn_wrapper.show()},a.Editable.prototype.showEditPopupWrapper=function(){this.$edit_popup_wrapper&&(this.$edit_popup_wrapper.show(),setTimeout(a.proxy(function(){this.$edit_popup_wrapper.find("input").val(this.$element.text()).focus().select()},this),1))},a.Editable.prototype.hidePopups=function(a){void 0===a&&(a=!0),a&&this.hideBttnWrapper(),this.raiseEvent("hidePopups")},a.Editable.prototype.showEditPopup=function(){this.showEditPopupWrapper()}}(jQuery),function(a){a.Editable.prototype.getBoundingRect=function(){var b;if(this.isLink){b={};var c=this.$element;b.left=c.offset().left-this.$window.scrollLeft(),b.top=c.offset().top-this.$window.scrollTop(),b.width=c.outerWidth(),b.height=parseInt(c.css("padding-top").replace("px",""),10)+c.height(),b.right=1,b.bottom=1,b.ok=!0}else if(this.getRange()&&this.getRange().collapsed){var d=a(this.getSelectionElement());this.saveSelectionByMarkers();var e=this.$element.find(".f-marker:first");e.css("display","inline");var f=e.offset();e.css("display","none"),b={},b.left=f.left-this.$window.scrollLeft(),b.width=0,b.height=(parseInt(d.css("line-height").replace("px",""),10)||10)-10-this.$window.scrollTop(),b.top=f.top,b.right=1,b.bottom=1,b.ok=!0,this.removeMarkers()}else this.getRange()&&(b=this.getRange().getBoundingClientRect());return b},a.Editable.prototype.repositionEditor=function(a){var b,c,d;if(this.options.inlineMode||a){if(b=this.getBoundingRect(),this.showBttnWrapper(),b.ok||b.left>=0&&b.top>=0&&b.right>0&&b.bottom>0)c=b.left+b.width/2,d=b.top+b.height,this.iOS()&&this.iOSVersion()<8||(c+=this.$window.scrollLeft(),d+=this.$window.scrollTop()),this.showByCoordinates(c,d);else if(this.options.alwaysVisible)this.hide();else{var e=this.$element.offset();this.showByCoordinates(e.left,e.top+10)}0===this.options.buttons.length&&this.hide()}},a.Editable.prototype.showByCoordinates=function(a,b){a-=22,b+=8;var c=this.$document.find(this.options.scrollableContainer);"body"!=this.options.scrollableContainer&&(a-=c.offset().left,b-=c.offset().top,this.iPad()||(b+=c.scrollTop(),a+=c.scrollLeft()));var d=Math.max(this.$popup_editor.outerWidth(),250);a+d>=c.outerWidth()-50&&a+44-d>0?(this.$popup_editor.addClass("right-side"),a=c.outerWidth()-(a+44),"static"==c.css("position")&&(a=a+parseFloat(c.css("margin-left"),10)+parseFloat(c.css("margin-right"),10)),this.$popup_editor.css("top",b),this.$popup_editor.css("right",a),this.$popup_editor.css("left","auto")):a+d<c.outerWidth()-50?(this.$popup_editor.removeClass("right-side"),this.$popup_editor.css("top",b),this.$popup_editor.css("left",a),this.$popup_editor.css("right","auto")):(this.$popup_editor.removeClass("right-side"),this.$popup_editor.css("top",b),this.$popup_editor.css("left",Math.max(c.outerWidth()-d,10)/2),this.$popup_editor.css("right","auto")),this.$popup_editor.show()},a.Editable.prototype.positionPopup=function(b){if(a(this.$editor.find('button.fr-bttn[data-cmd="'+b+'"]')).length){var c=this.$editor.find('button.fr-bttn[data-cmd="'+b+'"]'),d=c.width(),e=c.height(),f=c.offset().left+d/2,g=c.offset().top+e;this.showByCoordinates(f,g)}}}(jQuery),function(a){a.Editable.prototype.refreshImageAlign=function(a){this.$image_editor.find('.fr-dropdown > button[data-name="align"] + ul li').removeClass("active");var b="floatImageNone",c="center";a.hasClass("fr-fil")?(c="left",b="floatImageLeft"):a.hasClass("fr-fir")&&(c="right",b="floatImageRight"),this.$image_editor.find('.fr-dropdown > button[data-name="align"].fr-trigger i').attr("class","fa fa-align-"+c),this.$image_editor.find('.fr-dropdown > button[data-name="align"] + ul li[data-val="'+b+'"]').addClass("active")},a.Editable.prototype.refreshImageDisplay=function(){var a=this.$element.find(".f-img-editor");this.$image_editor.find('.fr-dropdown > button[data-name="display"] + ul li').removeClass("active"),a.hasClass("fr-dib")?this.$image_editor.find('.fr-dropdown > button[data-name="display"] + ul li[data-val="fr-dib"]').addClass("active"):this.$image_editor.find('.fr-dropdown > button[data-name="display"] + ul li[data-val="fr-dii"]').addClass("active")},a.Editable.image_commands={align:{title:"Alignment",icon:"fa fa-align-center",refresh:a.Editable.prototype.refreshImageAlign,refreshOnShow:a.Editable.prototype.refreshImageAlign,seed:[{cmd:"floatImageLeft",title:"Align Left",icon:"fa fa-align-left"},{cmd:"floatImageNone",title:"Align Center",icon:"fa fa-align-center"},{cmd:"floatImageRight",title:"Align Right",icon:"fa fa-align-right"}],callback:function(a,b,c){this[c](a)},undo:!0},display:{title:"Text Wrap",icon:"fa fa-star",refreshOnShow:a.Editable.prototype.refreshImageDisplay,namespace:"Image",seed:[{title:"Inline",value:"fr-dii"},{title:"Break Text",value:"fr-dib"}],callback:function(a,b,c){this.displayImage(a,c)},undo:!0},linkImage:{title:"Insert Link",icon:{type:"font",value:"fa fa-link"},callback:function(a){this.linkImage(a)}},replaceImage:{title:"Replace Image",icon:{type:"font",value:"fa fa-exchange"},callback:function(a){this.replaceImage(a)}},removeImage:{title:"Remove Image",icon:{type:"font",value:"fa fa-trash-o"},callback:function(a){this.removeImage(a)}}},a.Editable.DEFAULTS=a.extend(a.Editable.DEFAULTS,{allowedImageTypes:["jpeg","jpg","png","gif"],customImageButtons:{},defaultImageTitle:"Image title",defaultImageWidth:300,defaultImageDisplay:"block",defaultImageAlignment:"center",imageButtons:["display","align","linkImage","replaceImage","removeImage"],imageDeleteConfirmation:!0,imageDeleteURL:null,imageDeleteParams:{},imageMove:!0,imageResize:!0,imageLink:!0,imageTitle:!0,imageUpload:!0,imageUploadParams:{},imageUploadParam:"file",imageUploadToS3:!1,imageUploadURL:"http://i.froala.com/upload",maxImageSize:10485760,pasteImage:!0,textNearImage:!0}),a.Editable.prototype.hideImageEditorPopup=function(){this.$image_editor&&this.$image_editor.hide()},a.Editable.prototype.showImageEditorPopup=function(){this.$image_editor&&this.$image_editor.show(),this.options.imageMove||this.$element.attr("contenteditable",!1)},a.Editable.prototype.showImageWrapper=function(){this.$image_wrapper&&this.$image_wrapper.show()},a.Editable.prototype.hideImageWrapper=function(a){this.$image_wrapper&&(this.$element.attr("data-resize")||a||(this.closeImageMode(),this.imageMode=!1),this.$image_wrapper.hide(),this.$image_wrapper.find("input").blur())},a.Editable.prototype.showInsertImage=function(){this.hidePopups(),this.showImageWrapper()},a.Editable.prototype.showImageEditor=function(){this.hidePopups(),this.showImageEditorPopup()},a.Editable.prototype.insertImageHTML=function(){var b='<div class="froala-popup froala-image-popup" style="display: none;"><h4><span data-text="true">Insert Image</span><span data-text="true">Uploading image</span><i title="Cancel" class="fa fa-times" id="f-image-close-'+this._id+'"></i></h4>';return b+='<div id="f-image-list-'+this._id+'">',this.options.imageUpload&&(b+='<div class="f-popup-line drop-upload">',b+='<div class="f-upload" id="f-upload-div-'+this._id+'"><strong data-text="true">Drop Image</strong><br>(<span data-text="true">or click</span>)<form target="frame-'+this._id+'" enctype="multipart/form-data" encoding="multipart/form-data" action="'+this.options.imageUploadURL+'" method="post" id="f-upload-form-'+this._id+'"><input id="f-file-upload-'+this._id+'" type="file" name="'+this.options.imageUploadParam+'" accept="image/*"></form></div>',this.browser.msie&&a.Editable.getIEversion()<=9&&(b+='<iframe id="frame-'+this._id+'" name="frame-'+this._id+'" src="javascript:false;" style="width:0; height:0; border:0px solid #FFF; position: fixed; z-index: -1;"></iframe>'),b+="</div>"),this.options.imageLink&&(b+='<div class="f-popup-line"><label><span data-text="true">Enter URL</span>: </label><input id="f-image-url-'+this._id+'" type="text" placeholder="http://example.com"><button class="f-browse fr-p-bttn" id="f-browser-'+this._id+'"><i class="fa fa-search"></i></button><button data-text="true" class="f-ok fr-p-bttn f-submit" id="f-image-ok-'+this._id+'">OK</button></div>'),b+="</div>",b+='<p class="f-progress" id="f-progress-'+this._id+'"><span></span></p>',b+="</div>"},a.Editable.prototype.iFrameLoad=function(){var a=this.$image_wrapper.find("iframe#frame-"+this._id);if(!a.attr("data-loaded"))return a.attr("data-loaded",!0),!1;try{var b=this.$image_wrapper.find("#f-upload-form-"+this._id);if(this.options.imageUploadToS3){var c=b.attr("action"),d=b.find('input[name="key"]').val(),e=c+d;this.writeImage(e),this.options.imageUploadToS3.callback&&this.options.imageUploadToS3.callback.call(this,e,d)}else{var f=a.contents().text();this.parseImageResponse(f)}}catch(g){this.throwImageError(7)}},a.Editable.prototype.initImage=function(){this.buildInsertImage(),(!this.isLink||this.isImage)&&this.initImagePopup(),this.addListener("destroy",this.destroyImage)},a.Editable.initializers.push(a.Editable.prototype.initImage),a.Editable.prototype.destroyImage=function(){this.$image_editor&&this.$image_editor.html("").removeData().remove(),this.$image_wrapper&&this.$image_wrapper.html("").removeData().remove()},a.Editable.prototype.buildInsertImage=function(){this.$image_wrapper=a(this.insertImageHTML()),this.$popup_editor.append(this.$image_wrapper);var b=this;if(this.$image_wrapper.on("mouseup touchend",a.proxy(function(a){this.isResizing()||a.stopPropagation()},this)),this.addListener("hidePopups",a.proxy(function(){this.hideImageWrapper(!0)}),this),this.$progress_bar=this.$image_wrapper.find("p#f-progress-"+this._id),this.options.imageUpload){if(this.browser.msie&&a.Editable.getIEversion()<=9){var c=this.$image_wrapper.find("iframe").get(0);c.attachEvent?c.attachEvent("onload",function(){b.iFrameLoad()}):c.onload=function(){b.iFrameLoad()}}this.$image_wrapper.on("change",'input[type="file"]',function(){if(void 0!==this.files)b.uploadImage(this.files);else{var c=a(this).parents("form");c.find('input[type="hidden"]').remove();var d;for(d in b.options.imageUploadParams)c.prepend('<input type="hidden" name="'+d+'" value="'+b.options.imageUploadParams[d]+'" />');if(b.options.imageUploadToS3!==!1){for(d in b.options.imageUploadToS3.params)c.prepend('<input type="hidden" name="'+d+'" value="'+b.options.imageUploadToS3.params[d]+'" />');c.prepend('<input type="hidden" name="success_action_status" value="201" />'),c.prepend('<input type="hidden" name="X-Requested-With" value="xhr" />'),c.prepend('<input type="hidden" name="Content-Type" value="" />'),c.prepend('<input type="hidden" name="key" value="'+b.options.imageUploadToS3.keyStart+(new Date).getTime()+"-"+a(this).val().match(/[^\/\\]+$/)+'" />')}else c.prepend('<input type="hidden" name="XHR_CORS_TRARGETORIGIN" value="'+b.window.location.href+'" />');b.showInsertImage(),b.showImageLoader(!0),b.disable(),c.submit()}a(this).val("")})}this.buildDragUpload(),this.$image_wrapper.on("mouseup keydown","#f-image-url-"+this._id,a.proxy(function(a){var b=a.which;b&&27===b||a.stopPropagation()},this)),this.$image_wrapper.on("click","#f-image-ok-"+this._id,a.proxy(function(){this.writeImage(this.$image_wrapper.find("#f-image-url-"+this._id).val(),!0)},this)),this.$image_wrapper.on(this.mouseup,"#f-image-close-"+this._id,a.proxy(function(a){return this.isDisabled?!1:(a.stopPropagation(),this.$bttn_wrapper.show(),this.hideImageWrapper(!0),this.options.inlineMode&&0===this.options.buttons.length&&(this.imageMode?this.showImageEditor():this.hide()),this.imageMode||(this.restoreSelection(),this.focus()),void(this.options.inlineMode||this.imageMode?this.imageMode&&this.showImageEditor():this.hide()))},this)),this.$image_wrapper.on("click",function(a){a.stopPropagation()}),this.$image_wrapper.on("click","*",function(a){a.stopPropagation()})},a.Editable.prototype.deleteImage=function(b){if(this.options.imageDeleteURL){var c=this.options.imageDeleteParams;c.info=b.data("info"),c.src=b.attr("src"),a.ajax({type:"POST",url:this.options.imageDeleteURL,data:c,crossDomain:this.options.crossDomain,xhrFields:{withCredentials:this.options.withCredentials},headers:this.options.headers}).done(a.proxy(function(a){b.parent().parent().hasClass("f-image-list")?b.parent().remove():b.parent().removeClass("f-img-deleting"),this.triggerEvent("imageDeleteSuccess",[a],!1)},this)).fail(a.proxy(function(){b.parent().removeClass("f-img-deleting"),this.triggerEvent("imageDeleteError",["Error during image delete."],!1)},this))}else b.parent().removeClass("f-img-deleting"),this.triggerEvent("imageDeleteError",["Missing imageDeleteURL option."],!1)},a.Editable.prototype.imageHandle=function(){var b=this,c=a('<span data-fr-verified="true">').addClass("f-img-handle").on({movestart:function(c){b.hide(),b.$element.addClass("f-non-selectable").attr("contenteditable",!1),b.$element.attr("data-resize",!0),a(this).attr("data-start-x",c.startX),a(this).attr("data-start-y",c.startY)},move:function(c){var d=a(this),e=c.pageX-parseInt(d.attr("data-start-x"),10);d.attr("data-start-x",c.pageX),d.attr("data-start-y",c.pageY);var f=d.prevAll("img"),g=f.width();d.hasClass("f-h-ne")||d.hasClass("f-h-se")?f.attr("width",g+e):f.attr("width",g-e),b.triggerEvent("imageResize",[],!1)},moveend:function(){a(this).removeAttr("data-start-x"),a(this).removeAttr("data-start-y"),b.$element.removeClass("f-non-selectable"),b.isImage||b.$element.attr("contenteditable",!0),b.triggerEvent("imageResizeEnd"),a(this).trigger("mouseup")},touchend:function(){a(this).trigger("moveend")}});return c},a.Editable.prototype.disableImageResize=function(){if(this.browser.mozilla)try{document.execCommand("enableObjectResizing",!1,!1),document.execCommand("enableInlineTableEditing",!1,!1)}catch(a){}},a.Editable.prototype.isResizing=function(){return this.$element.attr("data-resize")},a.Editable.prototype.getImageStyle=function(a){var b="z-index: 1; position: relative; overflow: auto;",c=a,d="padding";return a.parent().hasClass("f-img-editor")&&(c=a.parent(),d="margin"),b+=" padding-left:"+c.css(d+"-left")+";",b+=" padding-right:"+c.css(d+"-right")+";",b+=" padding-bottom:"+c.css(d+"-bottom")+";",b+=" padding-top:"+c.css(d+"-top")+";",a.hasClass("fr-dib")?(b+=" vertical-align: top; display: block;",b+=a.hasClass("fr-fir")?" float: none; margin-right: 0; margin-left: auto;":a.hasClass("fr-fil")?" float: none; margin-left: 0; margin-right: auto;":" float: none; margin: auto;"):(b+=" display: inline-block;",b+=a.hasClass("fr-fir")?" float: right;":a.hasClass("fr-fil")?" float: left;":" float: none;"),b},a.Editable.prototype.getImageClass=function(a){var b=a.split(" ");return a="fr-fin",b.indexOf("fr-fir")>=0&&(a="fr-fir"),b.indexOf("fr-fil")>=0&&(a="fr-fil"),b.indexOf("fr-dib")>=0&&(a+=" fr-dib"),b.indexOf("fr-dii")>=0&&(a+=" fr-dii"),a},a.Editable.prototype.refreshImageButtons=function(a){this.$image_editor.find("button").removeClass("active");var b=a.css("float");b=a.hasClass("fr-fil")?"Left":a.hasClass("fr-fir")?"Right":"None",this.$image_editor.find('button[data-cmd="floatImage'+b+'"]').addClass("active"),this.raiseEvent("refreshImage",[a])},a.Editable.prototype.initImageEvents=function(){document.addEventListener&&!document.dropAssigned&&(document.dropAssigned=!0,document.addEventListener("drop",a.proxy(function(b){return a(".froala-element img.fr-image-move").length?(b.preventDefault(),b.stopPropagation(),a(".froala-element img.fr-image-move").removeClass("fr-image-move"),!1):void 0},this))),this.disableImageResize();var b=this;this.$element.on("mousedown",'img:not([contenteditable="false"])',function(c){return b.isDisabled?!1:void(b.isResizing()||(b.initialized&&c.stopPropagation(),b.$element.attr("contenteditable",!1),a(this).addClass("fr-image-move")))}),this.$element.on("mouseup",'img:not([contenteditable="false"])',function(){return b.isDisabled?!1:void(b.isResizing()||(b.options.imageMove||b.isImage||b.isHTML||b.$element.attr("contenteditable",!0),a(this).removeClass("fr-image-move")))}),this.$element.on("click touchend",'img:not([contenteditable="false"])',function(c){if(b.isDisabled)return!1;if(!b.isResizing()&&b.initialized){if(c.preventDefault(),c.stopPropagation(),b.closeImageMode(),b.$element.blur(),b.refreshImageButtons(a(this)),b.$image_editor.find('.f-image-alt input[type="text"]').val(a(this).attr("alt")||a(this).attr("title")),b.showImageEditor(),!a(this).parent().hasClass("f-img-editor")||"SPAN"!=a(this).parent().get(0).tagName){var d=b.getImageClass(a(this).attr("class"));a(this).wrap('<span data-fr-verified="true" class="f-img-editor '+d+'"></span>'),0!==a(this).parents(".f-img-wrap").length||b.isImage?a(this).parents(".f-img-wrap").attr("class",d+" f-img-wrap"):a(this).parents("a").length>0?a(this).parents("a:first").wrap('<span data-fr-verified="true" class="f-img-wrap '+d+'"></span>'):a(this).parent().wrap('<span data-fr-verified="true" class="f-img-wrap '+d+'"></span>')}if(a(this).parent().find(".f-img-handle").remove(),b.options.imageResize){var e=b.imageHandle();a(this).parent().append(e.clone(!0).addClass("f-h-ne")),a(this).parent().append(e.clone(!0).addClass("f-h-se")),a(this).parent().append(e.clone(!0).addClass("f-h-sw")),a(this).parent().append(e.clone(!0).addClass("f-h-nw"))}b.showByCoordinates(a(this).offset().left+a(this).width()/2,a(this).offset().top+a(this).height()),b.imageMode=!0,b.$bttn_wrapper.find(".fr-bttn").removeClass("active"),b.clearSelection()}}),this.$element.on("mousedown touchstart",".f-img-handle",a.proxy(function(){return b.isDisabled?!1:void this.$element.attr("data-resize",!0)},this)),this.$element.on("mouseup",".f-img-handle",a.proxy(function(c){if(b.isDisabled)return!1;var d=a(c.target).prevAll("img");setTimeout(a.proxy(function(){this.$element.removeAttr("data-resize"),d.click()},this),0)},this))},a.Editable.prototype.execImage=function(b,c,d){var e=this.$element.find("span.f-img-editor"),f=e.find("img"),g=a.Editable.image_commands[b]||this.options.customImageButtons[b];g&&g.callback&&g.callback.apply(this,[f,b,c,d])},a.Editable.prototype.bindImageRefreshListener=function(b){b.refresh&&this.addListener("refreshImage",a.proxy(function(a){b.refresh.apply(this,[a])},this))},a.Editable.prototype.buildImageButton=function(a,b){var c='<button class="fr-bttn" data-namespace="Image" data-cmd="'+b+'" title="'+a.title+'">';return c+=void 0!==this.options.icons[b]?this.prepareIcon(this.options.icons[b],a.title):this.prepareIcon(a.icon,a.title),c+="</button>",this.bindImageRefreshListener(a),c},a.Editable.prototype.buildImageAlignDropdown=function(a){this.bindImageRefreshListener(a);for(var b='<ul class="fr-dropdown-menu f-align">',c=0;c<a.seed.length;c++){var d=a.seed[c];b+='<li data-cmd="align" data-namespace="Image" data-val="'+d.cmd+'" title="'+d.title+'"><a href="#"><i class="'+d.icon+'"></i></a></li>'}return b+="</ul>"},a.Editable.prototype.buildImageDropdown=function(a){return dropdown=this.buildDefaultDropdown(a),btn=this.buildDropdownButton(a,dropdown),btn},a.Editable.prototype.image_command_dispatcher={align:function(a){var b=this.buildImageAlignDropdown(a),c=this.buildDropdownButton(a,b);return c}},a.Editable.prototype.buildImageButtons=function(){for(var b="",c=0;c<this.options.imageButtons.length;c++){var d=this.options.imageButtons[c];if(void 0!==a.Editable.image_commands[d]||void 0!==this.options.customImageButtons[d]){var e=a.Editable.image_commands[d]||this.options.customImageButtons[d];e.cmd=d;var f=this.image_command_dispatcher[d];b+=f?f.apply(this,[e]):e.seed?this.buildImageDropdown(e,d):this.buildImageButton(e,d)}}return b},a.Editable.prototype.initImagePopup=function(){this.$image_editor=a('<div class="froala-popup froala-image-editor-popup" style="display: none">');var b=a('<div class="f-popup-line f-popup-toolbar">').appendTo(this.$image_editor);b.append(this.buildImageButtons()),this.addListener("hidePopups",this.hideImageEditorPopup),this.options.imageTitle&&a('<div class="f-popup-line f-image-alt">').append('<label><span data-text="true">Title</span>: </label>').append(a('<input type="text">').on("mouseup keydown touchend",function(a){var b=a.which;b&&27===b||a.stopPropagation()})).append('<button class="fr-p-bttn f-ok" data-text="true" data-callback="setImageAlt" data-cmd="setImageAlt" title="OK">OK</button>').appendTo(this.$image_editor),this.$popup_editor.append(this.$image_editor),this.bindCommandEvents(this.$image_editor),this.bindDropdownEvents(this.$image_editor)},a.Editable.prototype.displayImage=function(a,b){var c=a.parents("span.f-img-editor");c.removeClass("fr-dii fr-dib").addClass(b),this.triggerEvent("imageDisplayed",[a,b]),a.click()},a.Editable.prototype.floatImageLeft=function(a){var b=a.parents("span.f-img-editor");b.removeClass("fr-fin fr-fil fr-fir").addClass("fr-fil"),this.isImage&&this.$element.css("float","left"),this.triggerEvent("imageFloatedLeft",[a]),a.click()},a.Editable.prototype.floatImageNone=function(a){var b=a.parents("span.f-img-editor");b.removeClass("fr-fin fr-fil fr-fir").addClass("fr-fin"),this.isImage||(b.parent().get(0)==this.$element.get(0)?b.wrap('<div style="text-align: center;"></div>'):b.parents(".f-img-wrap:first").css("text-align","center")),this.isImage&&this.$element.css("float","none"),this.triggerEvent("imageFloatedNone",[a]),a.click()},a.Editable.prototype.floatImageRight=function(a){var b=a.parents("span.f-img-editor");b.removeClass("fr-fin fr-fil fr-fir").addClass("fr-fir"),this.isImage&&this.$element.css("float","right"),this.triggerEvent("imageFloatedRight",[a]),a.click()},a.Editable.prototype.linkImage=function(a){this.imageMode=!0,this.showInsertLink();var b=a.parents("span.f-img-editor");"A"==b.parent().get(0).tagName?(this.$link_wrapper.find('input[type="text"]').val(b.parent().attr("href")),this.$link_wrapper.find(".f-external-link").attr("href",b.parent().attr("href")),"_blank"==b.parent().attr("target")?this.$link_wrapper.find('input[type="checkbox"]').prop("checked",!0):this.$link_wrapper.find('input[type="checkbox"]').prop("checked",!1),this.$link_wrapper.find("a.f-external-link, button.f-unlink").show()):(this.$link_wrapper.find('input[type="text"]').val("http://"),this.$link_wrapper.find(".f-external-link").attr("href","#"),this.$link_wrapper.find('input[type="checkbox"]').prop("checked",this.options.alwaysBlank),this.$link_wrapper.find("a.f-external-link, button.f-unlink").hide())},a.Editable.prototype.replaceImage=function(a){this.showInsertImage(),this.imageMode=!0,this.$image_wrapper.find('input[type="text"]').val(a.attr("src")),this.showByCoordinates(a.offset().left+a.width()/2,a.offset().top+a.height())},a.Editable.prototype.removeImage=function(b){var c=b.parents("span.f-img-editor");if(0===c.length)return!1;var d=b.get(0),e="Are you sure? Image will be deleted.";if(a.Editable.LANGS[this.options.language]&&(e=a.Editable.LANGS[this.options.language].translation[e]),!this.options.imageDeleteConfirmation||confirm(e)){if(this.triggerEvent("beforeRemoveImage",[a(d)],!1)){var f=c.parents(this.valid_nodes.join(","));c.parents(".f-img-wrap").length?c.parents(".f-img-wrap").remove():c.remove(),this.refreshImageList(!0),this.hide(),f.length&&f[0]!=this.$element.get(0)&&""===a(f[0]).text()&&a(f[0]).remove(),this.wrapText(),this.triggerEvent("afterRemoveImage",[b]),this.focus(),this.imageMode=!1}}else b.click()},a.Editable.prototype.setImageAlt=function(){var a=this.$element.find("span.f-img-editor");
a.find("img").attr("alt",this.$image_editor.find('.f-image-alt input[type="text"]').val()),a.find("img").attr("title",this.$image_editor.find('.f-image-alt input[type="text"]').val()),this.hide(),this.closeImageMode(),this.triggerEvent("imageAltSet")},a.Editable.prototype.buildImageMove=function(){var b=this;this.isLink||this.initDrag(),b.$element.on("dragover dragenter dragend",function(){return!1}),b.$element.on("drop",function(c){if(b.isDisabled)return!1;if(b.closeImageMode(),b.hide(),b.imageMode=!1,b.initialized||(b.$element.unbind("mousedown.element"),b.lateInit()),!b.options.imageUpload||0!==a(".froala-element img.fr-image-move").length){if(a(".froala-element .fr-image-move").length>0&&b.options.imageMove){c.preventDefault(),c.stopPropagation(),b.insertMarkersAtPoint(c.originalEvent),b.restoreSelectionByMarkers();var d=a("<div>").append(a(".froala-element img.fr-image-move").clone().removeClass("fr-image-move").addClass("fr-image-dropped")).html();b.insertHTML(d);var e=a(".froala-element img.fr-image-move").parent();a(".froala-element img.fr-image-move").remove(),e.get(0)!=b.$element.get(0)&&e.is(":empty")&&e.remove(),b.clearSelection(),b.initialized?setTimeout(function(){b.$element.find(".fr-image-dropped").removeClass(".fr-image-dropped").click()},0):b.$element.find(".fr-image-dropped").removeClass(".fr-image-dropped"),b.sync(),b.hideOtherEditors()}else c.preventDefault(),c.stopPropagation(),a(".froala-element img.fr-image-move").removeClass("fr-image-move");return!1}if(c.originalEvent.dataTransfer&&c.originalEvent.dataTransfer.files&&c.originalEvent.dataTransfer.files.length){if(b.isDisabled)return!1;var f=c.originalEvent.dataTransfer.files;b.options.allowedImageTypes.indexOf(f[0].type.replace(/image\//g,""))>=0&&(b.insertMarkersAtPoint(c.originalEvent),b.showByCoordinates(c.originalEvent.pageX,c.originalEvent.pageY),b.uploadImage(f),c.preventDefault(),c.stopPropagation())}})},a.Editable.prototype.buildDragUpload=function(){var b=this;b.$image_wrapper.on("dragover","#f-upload-div-"+this._id,function(){return a(this).addClass("f-hover"),!1}),b.$image_wrapper.on("dragend","#f-upload-div-"+this._id,function(){return a(this).removeClass("f-hover"),!1}),b.$image_wrapper.on("drop","#f-upload-div-"+this._id,function(c){return c.preventDefault(),c.stopPropagation(),b.options.imageUpload?(a(this).removeClass("f-hover"),void b.uploadImage(c.originalEvent.dataTransfer.files)):!1})},a.Editable.prototype.showImageLoader=function(b){if(void 0===b&&(b=!1),b){var c="Please wait!";a.Editable.LANGS[this.options.language]&&(c=a.Editable.LANGS[this.options.language].translation[c]),this.$progress_bar.find("span").css("width","100%").text(c)}else this.$image_wrapper.find("h4").addClass("uploading");this.$image_wrapper.find("#f-image-list-"+this._id).hide(),this.$progress_bar.show(),this.showInsertImage()},a.Editable.prototype.hideImageLoader=function(){this.$progress_bar.hide(),this.$progress_bar.find("span").css("width","0%").text(""),this.$image_wrapper.find("#f-image-list-"+this._id).show(),this.$image_wrapper.find("h4").removeClass("uploading")},a.Editable.prototype.writeImage=function(b,c,d){if(c&&(b=this.sanitizeURL(b),""===b))return!1;var e=new Image;e.onerror=a.proxy(function(){this.hideImageLoader(),this.throwImageError(1)},this),e.onload=this.imageMode?a.proxy(function(){var a=this.$element.find(".f-img-editor > img");a.attr("src",b),this.hide(),this.hideImageLoader(),this.$image_editor.show(),this.enable(),this.triggerEvent("imageReplaced",[a,d]),setTimeout(function(){a.trigger("click")},0)},this):a.proxy(function(){this.insertLoadedImage(b,d)},this),this.showImageLoader(!0),e.src=b},a.Editable.prototype.processInsertImage=function(b,c){void 0===c&&(c=!0),this.enable(),this.restoreSelection(),this.focus();var d="";parseInt(this.options.defaultImageWidth,10)&&(d=' width="'+this.options.defaultImageWidth+'"');var e="fr-fin";"left"==this.options.defaultImageAlignment&&(e="fr-fil"),"right"==this.options.defaultImageAlignment&&(e="fr-fir"),e+=" fr-di"+this.options.defaultImageDisplay[0];var f='<img class="'+e+' fr-just-inserted" alt="'+this.options.defaultImageTitle+'" src="'+b+'"'+d+">",g=this.getSelectionElements()[0],h=this.getRange(),i=!this.browser.msie&&a.Editable.getIEversion()>8?a(h.startContainer):null;i&&i.hasClass("f-img-wrap")?(1===h.startOffset?(i.after("<"+this.options.defaultTag+'><span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span></'+this.options.defaultTag+">"),this.restoreSelectionByMarkers(),this.getSelection().collapseToStart()):0===h.startOffset&&(i.before("<"+this.options.defaultTag+'><span class="f-marker" data-type="true" data-id="0"></span><br/><span class="f-marker" data-type="false" data-id="0"></span></'+this.options.defaultTag+">"),this.restoreSelectionByMarkers(),this.getSelection().collapseToStart()),this.insertHTML(f)):this.getSelectionTextInfo(g).atStart&&g!=this.$element.get(0)&&"TD"!=g.tagName&&"TH"!=g.tagName&&"LI"!=g.tagName?a(g).before("<"+this.options.defaultTag+">"+f+"</"+this.options.defaultTag+">"):this.insertHTML(f),this.disable()},a.Editable.prototype.insertLoadedImage=function(b,c){this.triggerEvent("imageLoaded",[b],!1),this.processInsertImage(b,!1),this.browser.msie&&this.$element.find("img").each(function(a,b){b.oncontrolselect=function(){return!1}}),this.enable(),this.hide(),this.hideImageLoader(),this.wrapText(),this.cleanupLists();var d,e=this.$element.find("img.fr-just-inserted").get(0);e&&(d=e.previousSibling),d&&3==d.nodeType&&/\u200B/gi.test(d.textContent)&&a(d).remove(),this.triggerEvent("imageInserted",[this.$element.find("img.fr-just-inserted"),c]),setTimeout(a.proxy(function(){this.$element.find("img.fr-just-inserted").removeClass("fr-just-inserted").trigger("touchend")},this),50)},a.Editable.prototype.throwImageErrorWithMessage=function(a){this.enable(),this.triggerEvent("imageError",[{message:a,code:0}],!1),this.hideImageLoader()},a.Editable.prototype.throwImageError=function(a){this.enable();var b="Unknown image upload error.";1==a?b="Bad link.":2==a?b="No link in upload response.":3==a?b="Error during file upload.":4==a?b="Parsing response failed.":5==a?b="Image too large.":6==a?b="Invalid image type.":7==a&&(b="Image can be uploaded only to same domain in IE 8 and IE 9."),this.triggerEvent("imageError",[{code:a,message:b}],!1),this.hideImageLoader()},a.Editable.prototype.uploadImage=function(b){if(!this.triggerEvent("beforeImageUpload",[b],!1))return!1;if(void 0!==b&&b.length>0){var c;if(this.drag_support.formdata&&(c=this.drag_support.formdata?new FormData:null),c){var d;for(d in this.options.imageUploadParams)c.append(d,this.options.imageUploadParams[d]);if(this.options.imageUploadToS3!==!1){for(d in this.options.imageUploadToS3.params)c.append(d,this.options.imageUploadToS3.params[d]);c.append("success_action_status","201"),c.append("X-Requested-With","xhr"),c.append("Content-Type",b[0].type),c.append("key",this.options.imageUploadToS3.keyStart+(new Date).getTime()+"-"+b[0].name)}if(c.append(this.options.imageUploadParam,b[0]),b[0].size>this.options.maxImageSize)return this.throwImageError(5),!1;if(this.options.allowedImageTypes.indexOf(b[0].type.replace(/image\//g,""))<0)return this.throwImageError(6),!1}if(c){var e;if(this.options.crossDomain)e=this.createCORSRequest("POST",this.options.imageUploadURL);else{e=new XMLHttpRequest,e.open("POST",this.options.imageUploadURL);for(var f in this.options.headers)e.setRequestHeader(f,this.options.headers[f])}e.onload=a.proxy(function(){var b="Please wait!";a.Editable.LANGS[this.options.language]&&(b=a.Editable.LANGS[this.options.language].translation[b]),this.$progress_bar.find("span").css("width","100%").text(b);try{this.options.imageUploadToS3?201==e.status?this.parseImageResponseXML(e.responseXML):this.throwImageError(3):e.status>=200&&e.status<300?this.parseImageResponse(e.responseText):this.throwImageError(3)}catch(c){this.throwImageError(4)}},this),e.onerror=a.proxy(function(){this.throwImageError(3)},this),e.upload.onprogress=a.proxy(function(a){if(a.lengthComputable){var b=a.loaded/a.total*100|0;this.$progress_bar.find("span").css("width",b+"%")}},this),this.disable(),e.send(c),this.showImageLoader()}}},a.Editable.prototype.parseImageResponse=function(b){try{var c=a.parseJSON(b);c.link?this.writeImage(c.link,!1,b):c.error?this.throwImageErrorWithMessage(c.error):this.throwImageError(2)}catch(d){this.throwImageError(4)}},a.Editable.prototype.parseImageResponseXML=function(b){try{var c=a(b).find("Location").text(),d=a(b).find("Key").text();this.options.imageUploadToS3.callback.call(this,c,d),c?this.writeImage(c):this.throwImageError(2)}catch(e){this.throwImageError(4)}},a.Editable.prototype.setImageUploadURL=function(a){a&&(this.options.imageUploadURL=a),this.options.imageUploadToS3&&(this.options.imageUploadURL="https://"+this.options.imageUploadToS3.bucket+"."+this.options.imageUploadToS3.region+".amazonaws.com/")},a.Editable.prototype.closeImageMode=function(){this.$element.find("span.f-img-editor > img").each(a.proxy(function(b,c){a(c).removeClass("fr-fin fr-fil fr-fir fr-dib fr-dii").addClass(this.getImageClass(a(c).parent().attr("class"))),a(c).parents(".f-img-wrap").length>0?"A"==a(c).parent().parent().get(0).tagName?a(c).siblings("span.f-img-handle").remove().end().unwrap().parent().unwrap():a(c).siblings("span.f-img-handle").remove().end().unwrap().unwrap():a(c).siblings("span.f-img-handle").remove().end().unwrap()},this)),this.$element.find("span.f-img-editor").length&&(this.$element.find("span.f-img-editor").remove(),this.$element.parents("span.f-img-editor").remove()),this.$element.removeClass("f-non-selectable"),this.editableDisabled||this.isHTML||this.$element.attr("contenteditable",!0),this.$image_editor&&this.$image_editor.hide(),this.$link_wrapper&&this.options.linkText&&this.$link_wrapper.find('input[type="text"].f-lt').parent().removeClass("fr-hidden")},a.Editable.prototype.refreshImageList=function(b){if(!this.isLink&&!this.options.editInPopup){var c=[],d=[],e=this;if(this.$element.find("img").each(function(b,f){var g=a(f);if(c.push(g.attr("src")),d.push(g),0!==g.parents(".f-img-editor").length||g.hasClass("fr-dii")||g.hasClass("fr-dib")||(e.options.textNearImage?g.addClass(g.hasClass("fr-fin")?"fr-dib":g.hasClass("fr-fil")||g.hasClass("fr-fir")?"fr-dii":"block"==g.css("display")&&"none"==g.css("float")?"fr-dib":"fr-dii"):(g.addClass("fr-dib"),e.options.imageButtons.splice(e.options.imageButtons.indexOf("display"),1))),e.options.textNearImage||g.removeClass("fr-dii").addClass("fr-dib"),0===g.parents(".f-img-editor").length&&!g.hasClass("fr-fil")&&!g.hasClass("fr-fir")&&!g.hasClass("fr-fin"))if(g.hasClass("fr-dii"))g.addClass("right"==g.css("float")?"fr-fir":"left"==g.css("float")?"fr-fil":"fr-fin");else{var h=g.attr("style");g.hide(),g.addClass(0===parseInt(g.css("margin-right"),10)&&h?"fr-fir":0===parseInt(g.css("margin-left"),10)&&h?"fr-fil":"fr-fin"),g.show()}g.css("margin",""),g.css("float",""),g.removeAttr("style"),g.removeAttr("data-style")}),void 0===b)for(var f=0;f<this.imageList.length;f++)c.indexOf(this.imageList[f].attr("src"))<0&&this.triggerEvent("afterRemoveImage",[this.imageList[f]],!1);this.imageList=d}},a.Editable.prototype.insertImage=function(){this.options.inlineMode||(this.closeImageMode(),this.imageMode=!1,this.positionPopup("insertImage")),this.selectionInEditor()&&this.saveSelection(),this.showInsertImage(),this.imageMode=!1,this.$image_wrapper.find('input[type="text"]').val("")}}(jQuery),function(a){a.Editable.prototype.showLinkWrapper=function(){this.$link_wrapper&&(this.$link_wrapper.show(),this.$link_wrapper.trigger("hideLinkList"),this.$link_wrapper.trigger("hideLinkClassList"),this.$link_wrapper.find("input.f-lu").removeClass("fr-error"),this.imageMode||!this.options.linkText?this.$link_wrapper.find('input[type="text"].f-lt').parent().addClass("fr-hidden"):this.$link_wrapper.find('input[type="text"].f-lt').parent().removeClass("fr-hidden"),this.imageMode&&this.$link_wrapper.find('input[type="text"].f-lu').removeAttr("disabled"),this.phone()?this.$document.scrollTop(this.$link_wrapper.offset().top+30):setTimeout(a.proxy(function(){this.imageMode&&this.iPad()||this.$link_wrapper.find('input[type="text"].f-lu').focus().select()},this),0),this.link=!0),this.refreshDisabledState()},a.Editable.prototype.hideLinkWrapper=function(){this.$link_wrapper&&(this.$link_wrapper.hide(),this.$link_wrapper.find("input").blur()),this.refreshDisabledState()},a.Editable.prototype.showInsertLink=function(){this.hidePopups(),this.showLinkWrapper()},a.Editable.prototype.initLinkEvents=function(){var b=this,c=function(a){a.stopPropagation(),a.preventDefault()},d=function(c){if(c.stopPropagation(),c.preventDefault(),b.isDisabled)return!1;if(""!==b.text())return b.hide(),!1;b.link=!0,b.clearSelection(),b.removeMarkers(),b.selectionDisabled||(a(this).before('<span class="f-marker" data-type="true" data-id="0" data-fr-verified="true"></span>'),a(this).after('<span class="f-marker" data-type="false" data-id="0" data-fr-verified="true"></span>'),b.restoreSelectionByMarkers()),b.exec("createLink");var d=a(this).attr("href")||"";b.$link_wrapper.find("input.f-lt").val(a(this).text()),b.isLink?("#"==d&&(d=""),b.$link_wrapper.find("input#f-lu-"+b._id).val(d.replace(/\&amp;/g,"&")),b.$link_wrapper.find(".f-external-link").attr("href",d||"#")):(b.$link_wrapper.find("input.f-lu").val(d.replace(/\&amp;/g,"&")),b.$link_wrapper.find(".f-external-link").attr("href",d)),b.$link_wrapper.find('input[type="checkbox"]').prop("checked","_blank"==a(this).attr("target")),b.$link_wrapper.find("li.f-choose-link-class").each(a.proxy(function(b,c){a(this).hasClass(a(c).data("class"))&&a(c).click()},this)),b.showByCoordinates(a(this).offset().left+a(this).outerWidth()/2,a(this).offset().top+(parseInt(a(this).css("padding-top"),10)||0)+a(this).height()),b.showInsertLink(),a(this).hasClass("fr-file")?b.$link_wrapper.find("input.f-lu").attr("disabled","disabled"):b.$link_wrapper.find("input.f-lu").removeAttr("disabled"),b.closeImageMode()};this.$element.on("mousedown","a",a.proxy(function(a){this.isResizing()||a.stopPropagation()},this)),this.isLink?this.iOS()?(this.$element.on("touchstart",c),this.$element.on("touchend",d)):this.$element.on("click",d):this.iOS()?(this.$element.on("touchstart",'a:not([contenteditable="false"])',c),this.$element.on("touchend",'a:not([contenteditable="false"])',d),this.$element.on("touchstart",'a[contenteditable="false"]',c),this.$element.on("touchend",'a[contenteditable="false"]',c)):(this.$element.on("click",'a:not([contenteditable="false"])',d),this.$element.on("click",'a[contenteditable="false"]',c))},a.Editable.prototype.destroyLink=function(){this.$link_wrapper.html("").removeData().remove()},a.Editable.prototype.initLink=function(){this.buildCreateLink(),this.initLinkEvents(),this.addListener("destroy",this.destroyLink)},a.Editable.initializers.push(a.Editable.prototype.initLink),a.Editable.prototype.removeLink=function(){this.imageMode?("A"==this.$element.find(".f-img-editor").parent().get(0).tagName&&a(this.$element.find(".f-img-editor").get(0)).unwrap(),this.triggerEvent("imageLinkRemoved"),this.showImageEditor(),this.$element.find(".f-img-editor").find("img").click(),this.link=!1):(this.restoreSelection(),this.document.execCommand("unlink",!1,null),this.isLink||this.$element.find("a:empty").remove(),this.triggerEvent("linkRemoved"),this.hideLinkWrapper(),this.$bttn_wrapper.show(),(!this.options.inlineMode||this.isLink)&&this.hide(),this.link=!1)},a.Editable.prototype.writeLink=function(b,c,d,e,f){var g;this.options.noFollow&&(f=!0),this.options.alwaysBlank&&(e=!0);var h="",i="";f===!0&&/^https?:\/\//.test(b)&&(h='rel="nofollow"'),e===!0&&(i='target="_blank"');var j=b;if(b=this.sanitizeURL(b),this.options.convertMailAddresses){var k=/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/i;k.test(b)&&0!==b.indexOf("mailto:")&&(b="mailto:"+b)}if(0===b.indexOf("mailto:")||""===this.options.linkAutoPrefix||/^(https?:|ftps?:|)\/\//.test(b)||(b=this.options.linkAutoPrefix+b),""===b)return this.$link_wrapper.find("input.f-lu").addClass("fr-error").focus(),this.triggerEvent("badLink",[j],!1),!1;if(this.$link_wrapper.find("input.f-lu").removeClass("fr-error"),this.imageMode){if("A"!=this.$element.find(".f-img-editor").parent().get(0).tagName)this.$element.find(".f-img-editor").wrap('<a data-fr-link="true" href="'+b+'" '+i+" "+h+"></a>");else{var l=this.$element.find(".f-img-editor").parent();e===!0?l.attr("target","_blank"):l.removeAttr("target"),f===!0?l.attr("rel","nofollow"):l.removeAttr("rel"),l.removeClass(Object.keys(this.options.linkClasses).join(" ")),l.attr("href",b).addClass(d)}this.triggerEvent("imageLinkInserted",[b]),this.showImageEditor(),this.$element.find(".f-img-editor").find("img").click(),this.link=!1}else{var m=null;this.isLink?""===c&&(c=this.$element.text()):(this.restoreSelection(),g=this.getSelectionLinks(),g.length>0&&(m=g[0].attributes,is_file=a(g[0]).hasClass("fr-file")),this.saveSelectionByMarkers(),this.document.execCommand("unlink",!1,b),this.$element.find('span[data-fr-link="true"]').each(function(b,c){a(c).replaceWith(a(c).html())}),this.restoreSelectionByMarkers()),this.isLink?(this.$element.text(c),g=[this.$element.attr("href",b).get(0)]):(this.removeMarkers(),(this.options.linkText||""===this.text())&&(this.insertHTML('<span class="f-marker" data-fr-verified="true" data-id="0" data-type="true"></span>'+(c||b)+'<span class="f-marker" data-fr-verified="true" data-id="0" data-type="false"></span>'),this.restoreSelectionByMarkers()),this.document.execCommand("createLink",!1,b),g=this.getSelectionLinks());for(var n=0;n<g.length;n++){if(m)for(var o=0;o<m.length;o++)"href"!=m[o].nodeName&&a(g[n]).attr(m[o].nodeName,m[o].value);e===!0?a(g[n]).attr("target","_blank"):a(g[n]).removeAttr("target"),f===!0&&/^https?:\/\//.test(b)?a(g[n]).attr("rel","nofollow"):a(g[n]).removeAttr("rel"),a(g[n]).data("fr-link",!0),a(g[n]).removeClass(Object.keys(this.options.linkClasses).join(" ")),a(g[n]).addClass(d)}this.$element.find("a:empty").remove(),this.triggerEvent("linkInserted",[b]),this.hideLinkWrapper(),this.$bttn_wrapper.show(),(!this.options.inlineMode||this.isLink)&&this.hide(),this.link=!1}},a.Editable.prototype.createLinkHTML=function(){var a='<div class="froala-popup froala-link-popup" style="display: none;">';a+='<h4><span data-text="true">Insert Link</span><a target="_blank" title="Open Link" class="f-external-link" href="#"><i class="fa fa-external-link"></i></a><i title="Cancel" class="fa fa-times" id="f-link-close-'+this._id+'"></i></h4>',a+='<div class="f-popup-line fr-hidden"><input type="text" placeholder="Text" class="f-lt" id="f-lt-'+this._id+'"></div>';var b="";if(this.options.linkList.length&&(b="f-bi"),a+='<div class="f-popup-line"><input type="text" placeholder="http://www.example.com" class="f-lu '+b+'" id="f-lu-'+this._id+'"/>',this.options.linkList.length){a+='<button class="fr-p-bttn f-browse-links" id="f-browse-links-'+this._id+'"><i class="fa fa-chevron-down"></i></button>',a+='<ul id="f-link-list-'+this._id+'">';for(var c=0;c<this.options.linkList.length;c++){var d=this.options.linkList[c];a+='<li class="f-choose-link" data-nofollow="'+d.nofollow+'" data-blank="'+d.blank+'" data-body="'+d.body+'" data-title="'+d.title+'" data-href="'+d.href+'">'+d.body+"</li>"}a+="</ul>"}if(a+="</div>",Object.keys(this.options.linkClasses).length){a+='<div class="f-popup-line"><input type="text" placeholder="Choose link type" class="f-bi" id="f-luc-'+this._id+'" disabled="disabled"/>',a+='<button class="fr-p-bttn f-browse-links" id="f-links-class-'+this._id+'"><i class="fa fa-chevron-down"></i></button>',a+='<ul id="f-link-class-list-'+this._id+'">';for(var e in this.options.linkClasses){var f=this.options.linkClasses[e];a+='<li class="f-choose-link-class" data-class="'+e+'">'+f+"</li>"}a+="</ul>",a+="</div>"}return a+='<div class="f-popup-line"><input type="checkbox" id="f-checkbox-'+this._id+'"> <label data-text="true" for="f-checkbox-'+this._id+'">Open in new tab</label><button data-text="true" type="button" class="fr-p-bttn f-ok f-submit" id="f-ok-'+this._id+'">OK</button>',this.options.unlinkButton&&(a+='<button type="button" data-text="true" class="fr-p-bttn f-ok f-unlink" id="f-unlink-'+this._id+'">UNLINK</button>'),a+="</div></div>"},a.Editable.prototype.buildCreateLink=function(){this.$link_wrapper=a(this.createLinkHTML()),this.$popup_editor.append(this.$link_wrapper);var b=this;this.addListener("hidePopups",this.hideLinkWrapper),this.$link_wrapper.on("mouseup touchend",a.proxy(function(a){this.isResizing()||(a.stopPropagation(),this.$link_wrapper.trigger("hideLinkList"))},this)),this.$link_wrapper.on("click",function(a){a.stopPropagation()}),this.$link_wrapper.on("click","*",function(a){a.stopPropagation()}),this.options.linkText&&this.$link_wrapper.on("mouseup keydown","input#f-lt-"+this._id,a.proxy(function(a){var b=a.which;b&&27===b||a.stopPropagation(),this.$link_wrapper.trigger("hideLinkList"),this.$link_wrapper.trigger("hideLinkClassList")},this)),this.$link_wrapper.on("mouseup keydown touchend touchstart","input#f-lu-"+this._id,a.proxy(function(a){var b=a.which;b&&27===b||a.stopPropagation(),this.$link_wrapper.trigger("hideLinkList"),this.$link_wrapper.trigger("hideLinkClassList")},this)),this.$link_wrapper.on("click keydown","input#f-checkbox-"+this._id,function(a){var b=a.which;b&&27===b||a.stopPropagation()}),this.$link_wrapper.on("touchend","button#f-ok-"+this._id,function(a){a.stopPropagation()}).on("click","button#f-ok-"+this._id,a.proxy(function(){var a,b=this.$link_wrapper.find("input#f-lt-"+this._id),c=this.$link_wrapper.find("input#f-lu-"+this._id),d=this.$link_wrapper.find("input#f-luc-"+this._id),e=this.$link_wrapper.find("input#f-checkbox-"+this._id);a=b?b.val():"";var f=c.val();this.isLink&&""===f&&(f="#");var g="";d&&(g=d.data("class")),this.writeLink(f,a,g,e.prop("checked"))},this)),this.$link_wrapper.on("click touch","button#f-unlink-"+this._id,a.proxy(function(){this.link=!0,this.removeLink()},this)),this.options.linkList.length&&(this.$link_wrapper.on("click touch","li.f-choose-link",function(){var c=b.$link_wrapper.find("button#f-browse-links-"+b._id),d=b.$link_wrapper.find("input#f-lt-"+b._id),e=b.$link_wrapper.find("input#f-lu-"+b._id),f=b.$link_wrapper.find("input#f-checkbox-"+b._id);d&&d.val(a(this).data("body")),e.val(a(this).data("href")),f.prop("checked",a(this).data("blank")),c.click()}).on("mouseup","li.f-choose-link",function(a){a.stopPropagation()}),this.$link_wrapper.on("click","button#f-browse-links-"+this._id+", button#f-browse-links-"+this._id+" > i",function(c){c.stopPropagation();var d=b.$link_wrapper.find("ul#f-link-list-"+b._id);b.$link_wrapper.trigger("hideLinkClassList"),a(this).find("i").toggleClass("fa-chevron-down"),a(this).find("i").toggleClass("fa-chevron-up"),d.toggle()}).on("mouseup","button#f-browse-links-"+this._id+", button#f-browse-links-"+this._id+" > i",function(a){a.stopPropagation()}),this.$link_wrapper.bind("hideLinkList",function(){var a=b.$link_wrapper.find("ul#f-link-list-"+b._id),c=b.$link_wrapper.find("button#f-browse-links-"+b._id);a&&a.is(":visible")&&c.click()})),Object.keys(this.options.linkClasses).length&&(this.$link_wrapper.on("mouseup keydown","input#f-luc-"+this._id,a.proxy(function(a){var b=a.which;b&&27===b||a.stopPropagation(),this.$link_wrapper.trigger("hideLinkList"),this.$link_wrapper.trigger("hideLinkClassList")},this)),this.$link_wrapper.on("click touch","li.f-choose-link-class",function(){var c=b.$link_wrapper.find("input#f-luc-"+b._id);c.val(a(this).text()),c.data("class",a(this).data("class")),b.$link_wrapper.trigger("hideLinkClassList")}).on("mouseup","li.f-choose-link-class",function(a){a.stopPropagation()}),this.$link_wrapper.on("click","button#f-links-class-"+this._id,function(c){c.stopPropagation(),b.$link_wrapper.trigger("hideLinkList");var d=b.$link_wrapper.find("ul#f-link-class-list-"+b._id);a(this).find("i").toggleClass("fa-chevron-down"),a(this).find("i").toggleClass("fa-chevron-up"),d.toggle()}).on("mouseup","button#f-links-class-"+this._id,function(a){a.stopPropagation()}),this.$link_wrapper.bind("hideLinkClassList",function(){var a=b.$link_wrapper.find("ul#f-link-class-list-"+b._id),c=b.$link_wrapper.find("button#f-links-class-"+b._id);a&&a.is(":visible")&&c.click()})),this.$link_wrapper.on(this.mouseup,"i#f-link-close-"+this._id,a.proxy(function(){this.$bttn_wrapper.show(),this.hideLinkWrapper(),(!this.options.inlineMode&&!this.imageMode||this.isLink||0===this.options.buttons.length)&&this.hide(),this.imageMode?this.showImageEditor():(this.restoreSelection(),this.focus())},this))},a.Editable.prototype.getSelectionLinks=function(){var a,b,c,d,e=[];if(window.getSelection){var f=window.getSelection();if(f.getRangeAt&&f.rangeCount){d=this.document.createRange();for(var g=0;g<f.rangeCount;++g)if(a=f.getRangeAt(g),b=a.commonAncestorContainer,b&&1!=b.nodeType&&(b=b.parentNode),b&&"a"==b.nodeName.toLowerCase())e.push(b);else{c=b.getElementsByTagName("a");for(var h=0;h<c.length;++h)d.selectNodeContents(c[h]),d.compareBoundaryPoints(a.END_TO_START,a)<1&&d.compareBoundaryPoints(a.START_TO_END,a)>-1&&e.push(c[h])}}}else if(this.document.selection&&"Control"!=this.document.selection.type)if(a=this.document.selection.createRange(),b=a.parentElement(),"a"==b.nodeName.toLowerCase())e.push(b);else{c=b.getElementsByTagName("a"),d=this.document.body.createTextRange();for(var i=0;i<c.length;++i)d.moveToElementText(c[i]),d.compareEndPoints("StartToEnd",a)>-1&&d.compareEndPoints("EndToStart",a)<1&&e.push(c[i])}return e},a.Editable.prototype.insertLink=function(){this.options.inlineMode||(this.closeImageMode(),this.imageMode=!1,this.positionPopup("createLink")),this.selectionInEditor()&&this.saveSelection(),this.showInsertLink();var b=this.getSelectionLink()||"",c=this.getSelectionLinks();c.length>0?(this.$link_wrapper.find('input[type="checkbox"]').prop("checked","_blank"==a(c[0]).attr("target")),this.$link_wrapper.find('input[type="text"].f-lt').val(a(c[0]).text()||""),a(c[0]).hasClass("fr-file")?this.$link_wrapper.find('input[type="text"].f-lu').attr("disabled","disabled"):this.$link_wrapper.find('input[type="text"].f-lu').removeAttr("disabled"),this.$link_wrapper.find("a.f-external-link, button.f-unlink").show()):(this.$link_wrapper.find('input[type="checkbox"]').prop("checked",this.options.alwaysBlank),this.$link_wrapper.find('input[type="text"].f-lt').val(this.text()),this.$link_wrapper.find('input[type="text"].f-lu').removeAttr("disabled"),this.$link_wrapper.find("a.f-external-link, button.f-unlink").hide()),this.$link_wrapper.find(".f-external-link").attr("href",b||"#"),this.$link_wrapper.find('input[type="text"].f-lu').val(b.replace(/\&amp;/g,"&")||"http://")}}(jQuery),function(a){a.Editable.prototype.browserFixes=function(){this.backspaceEmpty(),this.backspaceInEmptyBlock(),this.fixHR(),this.domInsert(),this.fixIME(),this.cleanInvisibleSpace(),this.cleanBR(),this.insertSpace()},a.Editable.prototype.backspaceInEmptyBlock=function(){this.$element.on("keyup",a.proxy(function(b){var c=b.which;if(this.browser.mozilla&&!this.isHTML&&8==c){var d=a(this.getSelectionElement());this.valid_nodes.indexOf(d.get(0).tagName)>=0&&1==d.find("*").length&&""===d.text()&&1==d.find("br").length&&this.setSelection(d.get(0))}},this))},a.Editable.prototype.insertSpace=function(){this.browser.mozilla&&this.$element.on("keypress",a.proxy(function(a){var b=a.which,c=this.getSelectionElements()[0];this.isHTML||32!=b||"PRE"==c.tagName||(a.preventDefault(),this.insertSimpleHTML("&nbsp;"))},this))},a.Editable.prototype.cleanBR=function(){this.$element.on("keyup",a.proxy(function(){this.$element.find(this.valid_nodes.join(" > br:last, ")+" > br:last").each(a.proxy(function(b,c){var d=c.previousSibling;["TH","TD"].indexOf(a(c).parent().get(0).tagName)<0&&d&&"BR"!=d.tagName&&a(c).parent().text().length>0&&this.isLastSibling(c)&&a(c).remove()},this))},this))},a.Editable.prototype.replaceU200B=function(b){for(var c=0;c<b.length;c++)3==b[c].nodeType&&/\u200B/gi.test(b[c].textContent)?b[c].textContent=b[c].textContent.replace(/\u200B/gi,""):1==b[c].nodeType&&this.replaceU200B(a(b[c]).contents())},a.Editable.prototype.cleanInvisibleSpace=function(){var b=function(b){var c=a(b).text();return b&&/\u200B/.test(a(b).text())&&c.replace(/\u200B/gi,"").length>0?!0:!1};this.$element.on("keyup",a.proxy(function(){var c=this.getSelectionElement();b(c)&&0===a(c).find("li").length&&(this.saveSelectionByMarkers(),this.replaceU200B(a(c).contents()),this.restoreSelectionByMarkers())},this))},a.Editable.prototype.fixHR=function(){this.$element.on("keypress",a.proxy(function(b){var c=a(this.getSelectionElement());if(c.is("hr")||c.parents("hr").length)return!1;var d=b.which;if(8==d){var e=a(this.getSelectionElements()[0]);e.prev().is("hr")&&this.getSelectionTextInfo(e.get(0)).atStart&&(this.saveSelectionByMarkers(),e.prev().remove(),this.restoreSelectionByMarkers(),b.preventDefault())}},this))},a.Editable.prototype.backspaceEmpty=function(){this.$element.on("keydown",a.proxy(function(a){var b=a.which;!this.isHTML&&8==b&&this.$element.hasClass("f-placeholder")&&a.preventDefault()},this))},a.Editable.prototype.domInsert=function(){this.$element.on("keydown",a.proxy(function(a){var b=a.which;8===b&&(this.no_verify=!0),13===b&&(this.add_br=!0)},this)),this.$element.on("DOMNodeInserted",a.proxy(function(b){if("SPAN"!==b.target.tagName||a(b.target).attr("data-fr-verified")||this.no_verify||this.textEmpty(b.target)||a(b.target).replaceWith(a(b.target).contents()),"BR"===b.target.tagName&&setTimeout(function(){a(b.target).removeAttr("type")},0),"A"===b.target.tagName&&setTimeout(function(){a(b.target).removeAttr("_moz_dirty")},0),this.options.paragraphy&&this.add_br&&"BR"===b.target.tagName&&(a(b.target).prev().length&&"TABLE"===a(b.target).prev().get(0).tagName||a(b.target).next().length&&"TABLE"===a(b.target).next().get(0).tagName)){a(b.target).wrap('<p class="fr-p-wrap">');var c=this.$element.find("p.fr-p-wrap").removeAttr("class");this.setSelection(c.get(0))}"BR"===b.target.tagName&&this.isLastSibling(b.target)&&"LI"==b.target.parentNode.tagName&&a(b.target).remove()},this)),this.$element.on("keyup",a.proxy(function(a){var b=a.which;8===b&&(this.$element.find("span:not(.fr-verified)").attr("data-fr-verified",!0),this.no_verify=!1),13===b&&(this.add_br=!1)},this))},a.Editable.prototype.fixIME=function(){try{this.$element.get(0).msGetInputContext&&(this.$element.get(0).msGetInputContext().addEventListener("MSCandidateWindowShow",a.proxy(function(){this.ime=!0},this)),this.$element.get(0).msGetInputContext().addEventListener("MSCandidateWindowHide",a.proxy(function(){this.ime=!1,this.$element.trigger("keydown"),this.oldHTML=""},this)))}catch(b){}}}(jQuery),function(a){a.Editable.prototype.handleEnter=function(){var b=a.proxy(function(){var b=this.getSelectionElement();return"LI"==b.tagName||this.parents(a(b),"li").length>0?!0:!1},this);this.$element.on("keypress",a.proxy(function(a){if(!this.isHTML&&!b()){var c=a.which;if(13==c&&!a.shiftKey){a.preventDefault(),this.saveUndoStep(),this.insertSimpleHTML("<break></break>");var d=this.getSelectionElements();d[0]==this.$element.get(0)?this.enterInMainElement(d[0]):this.enterInElement(d[0])}}},this))},a.Editable.prototype.enterInMainElement=function(b){var c=a(b).find("break").get(0);if(a(c).parent().get(0)==b)this.isLastSibling(c)?this.insertSimpleHTML("</br>"+this.markers_html+this.br):a(b).hasClass("f-placeholder")?a(b).html("</br>"+this.markers_html+this.br):this.insertSimpleHTML("</br>"+this.markers_html),a(b).find("break").remove(),this.restoreSelectionByMarkers();else if(a(c).parents(this.$element).length){for(b=this.getSelectionElement();"BREAK"==b.tagName||0===a(b).text().length;)b=b.parentNode;if(this.getSelectionTextInfo(b).atEnd)a(b).after(this.breakEnd(this.getDeepParent(b),!0)),this.$element.find("break").remove(),this.restoreSelectionByMarkers();else if(this.getSelectionTextInfo(b).atStart){for(;c.parentNode!=this.$element.get(0);)c=c.parentNode;
a(c).before("<br/>"),this.$element.find("break").remove(),this.$element.find("a:empty").replaceWith(this.markers_html+"<br/>"),this.restoreSelectionByMarkers()}else this.breakMiddle(this.getDeepParent(b),!0),this.restoreSelectionByMarkers()}else a(c).remove()},a.Editable.prototype.enterInElement=function(b){["TD","TH"].indexOf(b.tagName)<0?this.getSelectionTextInfo(b).atEnd?(a(b).after(this.breakEnd(b)),this.$element.find("break").remove(),this.restoreSelectionByMarkers()):this.getSelectionTextInfo(b).atStart?(a(b).before(this.options.paragraphy?"<"+this.options.defaultTag+">"+this.br+"</"+this.options.defaultTag+">":"<br/>"),this.$element.find("break").remove()):"PRE"==b.tagName?(this.$element.find("break").after("<br/>"+this.markers_html),this.$element.find("break").remove(),this.restoreSelectionByMarkers()):(this.breakMiddle(b),this.restoreSelectionByMarkers()):this.enterInMainElement(b)},a.Editable.prototype.breakEnd=function(b,c){void 0===c&&(c=!1);var d=a(b).find("break").get(0),e=this.br;this.options.paragraphy||(e="<br/>");var f=this.markers_html+e;for(c&&(f=this.markers_html+a.Editable.INVISIBLE_SPACE);d!=b;)"A"!=d.tagName&&"BREAK"!=d.tagName&&(f="<"+d.tagName+this.attrs(d)+">"+f+"</"+d.tagName+">"),d=d.parentNode;return c&&"A"!=d.tagName&&"BREAK"!=d.tagName&&(f="<"+d.tagName+this.attrs(d)+">"+f+"</"+d.tagName+">"),this.options.paragraphy&&(f="<"+this.options.defaultTag+">"+f+"</"+this.options.defaultTag+">"),c&&(f=e+f),f},a.Editable.prototype.breakMiddle=function(b,c){void 0===c&&(c=!1);for(var d=a(b).find("break").get(0),e=this.markers_html,f="";d!=b;)d=d.parentNode,f=f+"</"+d.tagName+">",e="<"+d.tagName+this.attrs(d)+">"+e;var g="<"+b.tagName+this.attrs(b)+">"+a(b).html()+"</"+b.tagName+">";g=g.replace(/<break><\/break>/,f+(c?this.br:"")+e),a(b).replaceWith(g)}}(jQuery),function(a){a.Editable.prototype.isFirstSibling=function(a){var b=a.previousSibling;return b?3==b.nodeType&&""===b.textContent?this.isFirstSibling(b):!1:!0},a.Editable.prototype.isLastSibling=function(a){var b=a.nextSibling;return b?3==b.nodeType&&""===b.textContent?this.isLastSibling(b):!1:!0},a.Editable.prototype.getDeepParent=function(a){return a.parentNode==this.$element.get(0)?a:this.getDeepParent(a.parentNode)},a.Editable.prototype.attrs=function(a){for(var b="",c=a.attributes,d=0;d<c.length;d++){var e=c[d];b+=" "+e.nodeName+'="'+e.value+'"'}return b}}(jQuery),function(a){"function"==typeof define&&define.amd?define(["jquery"],a):a(jQuery)}(function(a,b){function c(a){function b(){d?(c(),M(b),e=!0,d=!1):e=!1}var c=a,d=!1,e=!1;this.kick=function(){d=!0,e||b()},this.end=function(a){var b=c;a&&(e?(c=d?function(){b(),a()}:a,d=!0):a())}}function d(){return!0}function e(){return!1}function f(a){a.preventDefault()}function g(a){N[a.target.tagName.toLowerCase()]||a.preventDefault()}function h(a){return 1===a.which&&!a.ctrlKey&&!a.altKey}function i(a,b){var c,d;if(a.identifiedTouch)return a.identifiedTouch(b);for(c=-1,d=a.length;++c<d;)if(a[c].identifier===b)return a[c]}function j(a,b){var c=i(a.changedTouches,b.identifier);if(c&&(c.pageX!==b.pageX||c.pageY!==b.pageY))return c}function k(a){var b;h(a)&&(b={target:a.target,startX:a.pageX,startY:a.pageY,timeStamp:a.timeStamp},J(document,O.move,l,b),J(document,O.cancel,m,b))}function l(a){var b=a.data;s(a,b,a,n)}function m(){n()}function n(){K(document,O.move,l),K(document,O.cancel,m)}function o(a){var b,c;N[a.target.tagName.toLowerCase()]||(b=a.changedTouches[0],c={target:b.target,startX:b.pageX,startY:b.pageY,timeStamp:a.timeStamp,identifier:b.identifier},J(document,P.move+"."+b.identifier,p,c),J(document,P.cancel+"."+b.identifier,q,c))}function p(a){var b=a.data,c=j(a,b);c&&s(a,b,c,r)}function q(a){var b=a.data,c=i(a.changedTouches,b.identifier);c&&r(b.identifier)}function r(a){K(document,"."+a,p),K(document,"."+a,q)}function s(a,b,c,d){var e=c.pageX-b.startX,f=c.pageY-b.startY;I*I>e*e+f*f||v(a,b,c,e,f,d)}function t(){return this._handled=d,!1}function u(a){try{a._handled()}catch(b){return!1}}function v(a,b,c,d,e,f){{var g,h;b.target}g=a.targetTouches,h=a.timeStamp-b.timeStamp,b.type="movestart",b.distX=d,b.distY=e,b.deltaX=d,b.deltaY=e,b.pageX=c.pageX,b.pageY=c.pageY,b.velocityX=d/h,b.velocityY=e/h,b.targetTouches=g,b.finger=g?g.length:1,b._handled=t,b._preventTouchmoveDefault=function(){a.preventDefault()},L(b.target,b),f(b.identifier)}function w(a){var b=a.data.timer;a.data.touch=a,a.data.timeStamp=a.timeStamp,b.kick()}function x(a){var b=a.data.event,c=a.data.timer;y(),D(b,c,function(){setTimeout(function(){K(b.target,"click",e)},0)})}function y(){K(document,O.move,w),K(document,O.end,x)}function z(a){var b=a.data.event,c=a.data.timer,d=j(a,b);d&&(a.preventDefault(),b.targetTouches=a.targetTouches,a.data.touch=d,a.data.timeStamp=a.timeStamp,c.kick())}function A(a){var b=a.data.event,c=a.data.timer,d=i(a.changedTouches,b.identifier);d&&(B(b),D(b,c))}function B(a){K(document,"."+a.identifier,z),K(document,"."+a.identifier,A)}function C(a,b,c){var d=c-a.timeStamp;a.type="move",a.distX=b.pageX-a.startX,a.distY=b.pageY-a.startY,a.deltaX=b.pageX-a.pageX,a.deltaY=b.pageY-a.pageY,a.velocityX=.3*a.velocityX+.7*a.deltaX/d,a.velocityY=.3*a.velocityY+.7*a.deltaY/d,a.pageX=b.pageX,a.pageY=b.pageY}function D(a,b,c){b.end(function(){return a.type="moveend",L(a.target,a),c&&c()})}function E(){return J(this,"movestart.move",u),!0}function F(){return K(this,"dragstart drag",f),K(this,"mousedown touchstart",g),K(this,"movestart",u),!0}function G(a){"move"!==a.namespace&&"moveend"!==a.namespace&&(J(this,"dragstart."+a.guid+" drag."+a.guid,f,b,a.selector),J(this,"mousedown."+a.guid,g,b,a.selector))}function H(a){"move"!==a.namespace&&"moveend"!==a.namespace&&(K(this,"dragstart."+a.guid+" drag."+a.guid),K(this,"mousedown."+a.guid))}var I=6,J=a.event.add,K=a.event.remove,L=function(b,c,d){a.event.trigger(c,d,b)},M=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(a){return window.setTimeout(function(){a()},25)}}(),N={textarea:!0,input:!0,select:!0,button:!0},O={move:"mousemove",cancel:"mouseup dragstart",end:"mouseup"},P={move:"touchmove",cancel:"touchend",end:"touchend"};a.event.special.movestart={setup:E,teardown:F,add:G,remove:H,_default:function(a){function d(){C(f,g.touch,g.timeStamp),L(a.target,f)}var f,g;a._handled()&&(f={target:a.target,startX:a.startX,startY:a.startY,pageX:a.pageX,pageY:a.pageY,distX:a.distX,distY:a.distY,deltaX:a.deltaX,deltaY:a.deltaY,velocityX:a.velocityX,velocityY:a.velocityY,timeStamp:a.timeStamp,identifier:a.identifier,targetTouches:a.targetTouches,finger:a.finger},g={event:f,timer:new c(d),touch:b,timeStamp:b},a.identifier===b?(J(a.target,"click",e),J(document,O.move,w,g),J(document,O.end,x,g)):(a._preventTouchmoveDefault(),J(document,P.move+"."+a.identifier,z,g),J(document,P.end+"."+a.identifier,A,g)))}},a.event.special.move={setup:function(){J(this,"movestart.move",a.noop)},teardown:function(){K(this,"movestart.move",a.noop)}},a.event.special.moveend={setup:function(){J(this,"movestart.moveend",a.noop)},teardown:function(){K(this,"movestart.moveend",a.noop)}},J(document,"mousedown.move",k),J(document,"touchstart.move",o),"function"==typeof Array.prototype.indexOf&&!function(a){for(var b=["changedTouches","targetTouches"],c=b.length;c--;)-1===a.event.props.indexOf(b[c])&&a.event.props.push(b[c])}(a)}),window.WYSIWYGModernizr=function(a,b,c){function d(a){n.cssText=a}function e(a,b){return typeof a===b}var f,g,h,i="2.7.1",j={},k=b.documentElement,l="modernizr",m=b.createElement(l),n=m.style,o=({}.toString," -webkit- -moz- -o- -ms- ".split(" ")),p={},q=[],r=q.slice,s=function(a,c,d,e){var f,g,h,i,j=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))for(;d--;)h=b.createElement("div"),h.id=e?e[d]:l+(d+1),j.appendChild(h);return f=["&#173;",'<style id="s',l,'">',a,"</style>"].join(""),j.id=l,(m?j:n).innerHTML+=f,n.appendChild(j),m||(n.style.background="",n.style.overflow="hidden",i=k.style.overflow,k.style.overflow="hidden",k.appendChild(n)),g=c(j,a),m?j.parentNode.removeChild(j):(n.parentNode.removeChild(n),k.style.overflow=i),!!g},t=function(b){var c=a.matchMedia||a.msMatchMedia;if(c)return c(b).matches;var d;return s("@media "+b+" { #"+l+" { position: absolute; } }",function(b){d="absolute"==(a.getComputedStyle?getComputedStyle(b,null):b.currentStyle).position}),d},u={}.hasOwnProperty;h=e(u,"undefined")||e(u.call,"undefined")?function(a,b){return b in a&&e(a.constructor.prototype[b],"undefined")}:function(a,b){return u.call(a,b)},Function.prototype.bind||(Function.prototype.bind=function(a){var b=this;if("function"!=typeof b)throw new TypeError;var c=r.call(arguments,1),d=function(){if(this instanceof d){var e=function(){};e.prototype=b.prototype;var f=new e,g=b.apply(f,c.concat(r.call(arguments)));return Object(g)===g?g:f}return b.apply(a,c.concat(r.call(arguments)))};return d}),p.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:s(["@media (",o.join("touch-enabled),("),l,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=9===a.offsetTop}),c};for(var v in p)h(p,v)&&(g=v.toLowerCase(),j[g]=p[v](),q.push((j[g]?"":"no-")+g));return j.addTest=function(a,b){if("object"==typeof a)for(var d in a)h(a,d)&&j.addTest(d,a[d]);else{if(a=a.toLowerCase(),j[a]!==c)return j;b="function"==typeof b?b():b,"undefined"!=typeof enableClasses&&enableClasses&&(k.className+=" "+(b?"":"no-")+a),j[a]=b}return j},d(""),m=f=null,j._version=i,j._prefixes=o,j.mq=t,j.testStyles=s,j}(this,this.document),!function(a){a.Editable.prototype.coreInit=function(){var a=this,b="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",c=function(a){for(var b=a.toString(),c=0,d=0;d<b.length;d++)c+=parseInt(b.charAt(d),10);return c>10?c%9+1:c};if(a.options.key!==!1){var d=function(a,b,c){for(var d=Math.abs(c);d-->0;)a-=b;return 0>c&&(a+=123),a},e=function(a){return a},f=function(a){if(!a)return a;for(var f="",g=e("charCodeAt"),h=e("fromCharCode"),i=b.indexOf(a[0]),j=1;j<a.length-2;j++){for(var k=c(++i),l=a[g](j),m="";/[0-9-]/.test(a[j+1]);)m+=a[++j];m=parseInt(m,10)||0,l=d(l,k,m),l^=i-1&31,f+=String[h](l)}return f},g=e(f),h=function(a){return"none"==a.css("display")?(a.attr("style",a.attr("style")+g("zD4D2qJ-7dhuB-11bB4E1wqlhlfE4gjhkbB6C5eg1C-8h1besB-16e1==")),!0):!1},i=function(){for(var a=0,b=document.domain,c=b.split("."),d="_gd"+(new Date).getTime();a<c.length-1&&-1==document.cookie.indexOf(d+"="+d);)b=c.slice(-1-++a).join("."),document.cookie=d+"="+d+";domain="+b+";";return document.cookie=d+"=;expires=Thu, 01 Jan 1970 00:00:01 GMT;domain="+b+";",b}(),j=function(){var b=g(a.options.key)||"";return b!==g("eQZMe1NJGC1HTMVANU==")&&b.indexOf(i,b.length-i.length)<0&&[g("9qqG-7amjlwq=="),g("KA3B3C2A6D1D5H5H1A3==")].indexOf(i)<0?(a.$box.append(g("uA5kygD3g1h1lzrA7E2jtotjvooB2A5eguhdC-22C-16nC2B3lh1deA-21C-16B4A2B4gi1F4D1wyA-13jA4H5C2rA-65A1C10dhzmoyJ2A10A-21d1B-13xvC2I4enC4C2B5B4G4G4H1H4A10aA8jqacD1C3c1B-16D-13A-13B2E5A4jtxfB-13fA1pewxvzA3E-11qrB4E4qwB-16icA1B3ykohde1hF4A2E4clA4C7E6haA4D1xtmolf1F-10A1H4lhkagoD5naalB-22B8B4quvB-8pjvouxB3A-9plnpA2B6D6BD2D1C2H1C3C3A4mf1G-10C-8i1G3C5B3pqB-9E5B1oyejA3ddalvdrnggE3C3bbj1jC6B3D3gugqrlD8B2DB-9qC-7qkA10D2VjiodmgynhA4HA-9D-8pI-7rD4PrE-11lvhE3B5A-16C7A6A3ekuD1==")),a.$lb=a.$box.find("> div:last"),a.$ab=a.$lb.find("> a"),h(a.$lb)||h(a.$ab)):void 0};j()}},a.Editable.initializers.push(a.Editable.prototype.coreInit)}(jQuery),function(a){a.Editable.DEFAULTS=a.extend(a.Editable.DEFAULTS,{allowedBlankTags:["TEXTAREA"],selfClosingTags:["br","button","input","img","hr","param","!--","source","embed","!","meta","link","base"]}),a.Editable.prototype.isClosingTag=function(a){return a?null!==a.match(/^<\/([a-zA-Z0-9]+)([^<]+)*>$/gi):!1},a.Editable.prototype.tagName=function(a){return a.replace(/^<\/?([a-zA-Z0-9-!]+)([^>]+)*>$/gi,"$1").toLowerCase()},a.Editable.SELF_CLOSING_AFTER=["source"],a.Editable.prototype.isSelfClosingTag=function(a){var b=this.tagName(a);return this.options.selfClosingTags.indexOf(b.toLowerCase())>=0},a.Editable.prototype.tagKey=function(a){return a.type+(a.attrs||[]).sort().join("|")},a.Editable.prototype.extendedKey=function(a){return this.tagKey(a)+JSON.stringify(a.style)},a.Editable.prototype.mapDOM=function(b){var c=[],d={},e={},f=0,g=this;a(b).find(".f-marker").html(a.Editable.INVISIBLE_SPACE);var h=function(b,c){if(3===b.nodeType)return[];if(8===b.nodeType)return[{comment:!0,attrs:{},styles:{},idx:f++,sp:c,ep:c,text:b.textContent}];var d=b.tagName;"B"==d&&(d="STRONG"),"I"==d&&(!b.className||b.className.indexOf("fa-")<0)&&(d="EM"),b.style.display="";var e={},h={},i=null;if(b.attributes)for(var j=0;j<b.attributes.length;j++){var k=b.attributes[j];"style"==k.nodeName?i=k.value:e[k.nodeName]=k.value}if(i){var l=i.match(/([^:]*):([^:;]*(;|$))/gi);if(l)for(var m=0;m<l.length;m++){var n=l[m].split(":"),o=n.slice(1).join(":").trim();";"==o[o.length-1]&&(o=o.substr(0,o.length-1)),h[n[0].trim()]=o}}var p=[];if(a.isEmptyObject(e)&&"SPAN"==b.tagName&&!a.isEmptyObject(h)){for(var q in h){var r={};r[q]=h[q],p.push({selfClosing:!1,attrs:e,styles:r,idx:f++,sp:c,ep:c+b.textContent.length,tagName:d})}return p}return[{selfClosing:g.options.selfClosingTags.indexOf(d.toLowerCase())>=0,attrs:e,styles:h,idx:f++,sp:c,ep:c+b.textContent.length,tagName:d}]},i=function(a,g){var j,k,l;if(a!=b)for(k=h(a,g),j=0;j<k.length;j++)l=k[j],c.push(l),d[l.sp]||(d[l.sp]={}),e[l.ep]||(e[l.ep]={}),d[l.sp][l.tagName]||(d[l.sp][l.tagName]=[]),e[l.ep][l.tagName]||(e[l.ep][l.tagName]=[]),d[l.sp][l.tagName].push(l),e[l.ep][l.tagName].push(l);var m=a.childNodes;if(m){for(j=0;j<m.length;j++)j>0&&8!=m[j-1].nodeType&&(g+=m[j-1].textContent.length),i(m[j],g);if(k)for(j=0;j<k.length;j++)l=k[j],l.ci=f++,d[l.ep]||(d[l.ep]={}),d[l.ep][l.tagName]||(d[l.ep][l.tagName]=[]),d[l.ep][l.tagName].push({shadow:!0,ci:f-1})}},j=function(){var b,e,f,h;for(b in d)for(var i in d[b])for(f=0;f<d[b][i].length;f++)if(e=d[b][i][f],!(e.selfClosing||e.dirty||e.shadow||e.comment))for(var j=f+1;j<d[b][i].length;j++)if(h=d[b][i][j],!(h.selfClosing||h.dirty||h.shadow||h.comment||1!=Object.keys(e.styles).length||1!=Object.keys(h.styles).length||h.sp==h.ep)){var k=Object.keys(e.styles)[0];if(h.styles[k]){e.sp=h.ep;for(var l=0;l<d[e.sp][e.tagName].length;l++){var m=d[e.sp][e.tagName][l];if(m.shadow&&m.ci==h.ci){d[e.sp][e.tagName].splice(l,0,e);break}}d[b][i].splice(f,1),f--;break}}for(b=0;b<c.length;b++)if(e=c[b],!e.dirty&&!e.selfClosing&&!e.comment)if(e.sp==e.ep&&a.isEmptyObject(e.attrs)&&a.isEmptyObject(e.style)&&g.options.allowedBlankTags.indexOf(e.tagName)<0)e.dirty=!0;else if(d[e.ep]&&d[e.ep][e.tagName])for(f=0;f<d[e.ep][e.tagName].length;f++)if(h=d[e.ep][e.tagName][f],!h.dirty&&e!=h&&!e.selfClosing&&!h.shadow&&!h.comment&&a.isEmptyObject(h.attrs)&&JSON.stringify(h.styles)==JSON.stringify(e.styles)){e.ep=h.ep,h.dirty=!0,b--;break}for(b=0;b<c.length;b++)if(e=c[b],!e.dirty&&!e.selfClosing&&!e.comment)if(e.sp==e.ep&&a.isEmptyObject(e.attrs)&&a.isEmptyObject(e.style)&&g.options.allowedBlankTags.indexOf(e.tagName)<0)e.dirty=!0;else if(d[e.sp]&&d[e.sp][e.tagName])for(f=d[e.sp][e.tagName].length-1;f>=0;f--)h=d[e.sp][e.tagName][f],h.dirty||e!=h&&(e.selfClosing||h.shadow||h.comment||e.ep==h.ep&&a.isEmptyObject(h.attrs)&&(e.styles=a.extend(e.styles,h.styles),h.dirty=!0))};i(b,0),j();for(var k=c.length-1;k>=0;k--)c.dirty&&c.splice(k,1);return c},a.Editable.prototype.sortNodes=function(a,b){if("BR"==a.tagName)return-1;if("BR"==b.tagName)return 1;if(a.comment)return 1;var c=a.ep-a.sp,d=b.ep-a.sp;return 0===c&&0===d?a.idx-b.idx:c===d?b.ci-a.ci:d-c},a.Editable.prototype.openTag=function(a){var b,c="<"+a.tagName.toLowerCase(),d=Object.keys(a.attrs).sort();for(b=0;b<d.length;b++){var e=d[b];c+=" "+e+'="'+a.attrs[e]+'"'}var f="",g=Object.keys(a.styles).sort();for(b=0;b<g.length;b++){var h=g[b];null!=a.styles[h]&&(f+=h.replace("_","-")+": "+a.styles[h]+"; ")}return""!==f&&(c+=' style="'+f.trim()+'"'),c+=">"},a.Editable.prototype.commentTag=function(a){var b="";if(a.selfClosing){var c;b="<"+a.tagName.toLowerCase();var d=Object.keys(a.attrs).sort();for(c=0;c<d.length;c++){var e=d[c];b+=" "+e+'="'+a.attrs[e]+'"'}var f="",g=Object.keys(a.styles).sort();for(c=0;c<g.length;c++){var h=g[c];null!=a.styles[h]&&(f+=h.replace("_","-")+": "+a.styles[h]+"; ")}""!==f&&(b+=' style="'+f.trim()+'"'),b+="/>"}else a.comment&&(b="<!--"+a.text+"-->");return b},a.Editable.prototype.closeTag=function(a){return"</"+a.tagName.toLowerCase()+">"},a.Editable.prototype.nodesOpenedAt=function(a,b){for(var c=[],d=a.length-1;d>=0&&a[d].sp==b;)c.push(a.pop()),d--;return c},a.Editable.prototype.entity=function(a){return ch_map={">":"&gt;","<":"&lt;","&":"&amp;"},ch_map[a]?ch_map[a]:a},a.Editable.prototype.removeInvisibleWhitespace=function(a){for(var b=0;b<a.childNodes.length;b++){var c=a.childNodes[b];c.childNodes.length?this.removeInvisibleWhitespace(c):c.textContent=c.textContent.replace(/\u200B/gi,"")}},a.Editable.prototype.cleanOutput=function(b,c){var d,e,f,g;c&&this.removeInvisibleWhitespace(b);var h=this.mapDOM(b,c).sort(function(a,b){return b.sp-a.sp}),i=b.textContent;html="";var j=[],k=-1,l=a.proxy(function(){for(var b="";j.length;){var c=j.pop();c.selfClosing||c.comment?b+=this.commentTag(c):(!a.isEmptyObject(c.attrs)||this.options.allowedBlankTags.indexOf(c.tagName)>=0)&&(b=this.openTag(c)+b+this.closeTag(c))}html+=b},this),m={},n=[];for(d=0;d<=i.length;d++){if(m[d])for(e=m[d].length-1;e>=0;e--)if(n[n.length-1].tagName==m[d][e].tagName&&JSON.stringify(n[n.length-1].styles)==JSON.stringify(m[d][e].styles))html+=this.closeTag(m[d][e]),n.pop();else{for(var o=[];n[n.length-1].tagName!==m[d][e].tagName||JSON.stringify(n[n.length-1].styles)!==JSON.stringify(m[d][e].styles);)g=n.pop(),html+=this.closeTag(g),o.push(g);for(html+=this.closeTag(m[d][e]),n.pop();o.length;){var p=o.pop();html+=this.openTag(p),n.push(p)}}for(var q=this.nodesOpenedAt(h,d).sort(this.sortNodes).reverse();q.length;){var r=q.pop();if(!r.dirty)if(r.selfClosing||r.comment)r.ci>k||"BR"==r.tagName?(l(),html+=this.commentTag(r),k=r.ci):j.length?(j.push(r),k=r.ci):(html+=this.commentTag(r),k=r.ci);else if(r.ep>r.sp){r.ci>k&&l();var s=[];if("A"==r.tagName)for(var t=r.sp+1;t<r.ep;t++)if(m[t]&&m[t].length)for(f=0;f<m[t].length;f++)s.push(m[t][f]),html+=this.closeTag(m[t][f]),n.pop();var u=[];if("SPAN"==r.tagName&&("#123456"==r.styles["background-color"]||"#123456"===a.Editable.RGBToHex(r.styles["background-color"])||"#123456"==r.styles.color||"#123456"===a.Editable.RGBToHex(r.styles.color)))for(;n.length;){var v=n.pop();html+=this.closeTag(v),u.push(v)}for(html+=this.openTag(r),k=r.ci,n.push(r),m[r.ep]||(m[r.ep]=[]),m[r.ep].push(r);s.length;)r=s.pop(),html+=this.openTag(r),n.push(r);for(;u.length;)r=u.pop(),html+=this.openTag(r),n.push(r)}else r.sp==r.ep&&(j.push(r),k=r.ci)}l(),d!=i.length&&(html+=this.entity(i[d]))}return html=html.replace(/(<span[^>]*? class\s*=\s*["']?f-marker["']?[^>]+>)\u200B(<\/span>)/gi,"$1$2"),html},a.Editable.prototype.wrapDirectContent=function(){if(!this.options.paragraphy)for(var b=null,c=this.$element.contents(),d=0;d<c.length;d++)1!=c[d].nodeType||this.valid_nodes.indexOf(c[d].tagName)<0?(b||(b=a('<div class="fr-wrap">'),a(c[d]).before(b)),b.append(c[d])):b=null},a.Editable.prototype.cleanify=function(b,c,d){if(this.browser.msie&&a.Editable.getIEversion()<9)return!1;var e;if(this.isHTML)return!1;void 0===b&&(b=!0),void 0===d&&(d=!0),this.no_verify=!0,this.$element.find("span").removeAttr("data-fr-verified"),d&&this.saveSelectionByMarkers(),b?e=this.getSelectionElements():(this.wrapDirectContent(),e=this.$element.find(this.valid_nodes.join(",")),0===e.length&&(e=[this.$element.get(0)]));var f,g;if(e[0]!=this.$element.get(0))for(var h=0;h<e.length;h++){var i=a(e[h]);0===i.find(this.valid_nodes.join(",")).length&&(f=i.html(),g=this.cleanOutput(i.get(0),c),g!==f&&i.html(g))}else 0===this.$element.find(this.valid_nodes.join(",")).length&&(f=this.$element.html(),g=this.cleanOutput(this.$element.get(0),c),g!==f&&this.$element.html(g));this.$element.find("[data-fr-idx]").removeAttr("data-fr-idx"),this.$element.find(".fr-wrap").each(function(){a(this).replaceWith(a(this).html())}),this.$element.find(".f-marker").html(""),d&&this.restoreSelectionByMarkers(),this.$element.find("span").attr("data-fr-verified",!0),this.no_verify=!1}}(jQuery);
/*!
 * froala_editor v1.2.6 (http://editor.froala.com)
 * License http://editor.froala.com/license
 * Copyright 2014-2015 Froala Labs
 */
!function(a){a.Editable.DEFAULTS=a.extend(a.Editable.DEFAULTS,{colors:["#61BD6D","#1ABC9C","#54ACD2","#2C82C9","#9365B8","#475577","#CCCCCC","#41A85F","#00A885","#3D8EB9","#2969B0","#553982","#28324E","#000000","#F7DA64","#FBA026","#EB6B56","#E25041","#A38F84","#EFEFEF","#FFFFFF","#FAC51C","#F37934","#D14841","#B8312F","#7C706B","#D1D5D8","REMOVE"],foreColors:[],backColors:[],colorsStep:7,defaultColorOption:"foreColor",backColorsDisabled:!1,foreColorsDisabled:!1}),a.Editable.prototype.refreshColors=function(){var a=this.getSelectionElement();this.$editor.find(".fr-color-picker button.fr-color-bttn").removeClass("active"),this.refreshColor(a,"background-color","backColor"),this.refreshColor(a,"color","foreColor")},a.Editable.prototype.refreshColor=function(b,c,d){for(;a(b).get(0)!=this.$element.get(0);){if("transparent"!==a(b).css(c)&&"rgba(0, 0, 0, 0)"!==a(b).css(c)){this.$editor.find('.fr-color-picker button.fr-color-bttn[data-param="'+d+'"][data-val="'+a.Editable.RGBToHex(a(b).css(c))+'"]').addClass("active");break}b=a(b).parent()}},a.Editable.commands=a.extend(a.Editable.commands,{color:{icon:"fa fa-tint",title:"Color",refreshOnShow:a.Editable.prototype.refreshColors,seed:[{cmd:"backColor"},{cmd:"foreColor"}],callback:function(a,b,c){this[c].apply(this,[b])},callbackWithoutSelection:function(b,c,d){"backColor"===d&&(d="background-color"),"foreColor"===d&&(d="color"),this._startInFontExec(d,b,c),"#123456"===c&&""===this.text()&&(this.cleanify(!0,!1),this.$element.find("span").each(function(b,c){var d=a(c),e=d.css("background-color");("#123456"===e||"#123456"===a.Editable.RGBToHex(e))&&d.css("background-color",""),e=d.css("color"),("#123456"===e||"#123456"===a.Editable.RGBToHex(e))&&d.css("color","")}))},undo:!0}}),a.Editable.prototype.command_dispatcher=a.extend(a.Editable.prototype.command_dispatcher,{color:function(a){var b=this.buildDropdownColor(a),c=this.buildDropdownButton(a,b,"fr-color-picker");return c}}),a.Editable.prototype.buildColorList=function(a){for(var b=this.options[a+"s"].length>0?this.options[a+"s"]:this.options.colors,c=this.options.defaultColorOption==a?"block":"none",d='<div class="fr-color-set fr-'+a+'" style="display: '+c+'">',e=0;e<b.length;e++){var f=b[e];d+="REMOVE"!==f?'<button type="button" class="fr-color-bttn" data-val="'+f+'" data-cmd="color" data-param="'+a+'" style="background: '+f+';">&nbsp;</button>':'<button type="button" class="fr-color-bttn" data-val="#123456" data-cmd="color" data-param="'+a+'" style="background: #FFF;"><i class="fa fa-eraser"></i></button>',e%this.options.colorsStep==this.options.colorsStep-1&&e>0&&(d+="<hr/>",e!=this.options.colorsStep-1&&e!=2*this.options.colorsStep-1||!this.options.colorsTopChoices||(d+='<div class="separator"></div>'))}return d+="</div>"},a.Editable.prototype.buildDropdownColor=function(){var b="",c='<div class="fr-dropdown-menu">';this.options.textColorsDisabled||(c+=this.buildColorList("foreColor")),this.options.backColorsDisabled||(c+=this.buildColorList("backColor")),c+="<p>";var d=this.options.textColorsDisabled||this.options.backColorsDisabled?"":"fr-50 ";this.options.textColorsDisabled||(b="foreColor"==this.options.defaultColorOption?"active":"",c+='<span class="fr-choose-color '+d+b+'" data-text="true" data-param="foreColor">Text</span>'),this.options.backColorsDisabled||(b="backColor"==this.options.defaultColorOption?"active":"",c+='<span class="fr-choose-color '+d+b+'" data-text="true" data-param="backColor">Background</span>'),c+="</p></div>",this.$bttn_wrapper.on(this.mousedown,".fr-choose-color",function(a){return a.preventDefault(),a.stopPropagation(),"mousedown"===a.type&&1!==a.which?!0:void 0});var e=this;return this.$bttn_wrapper.on(this.mouseup,".fr-choose-color",function(b){if(b.preventDefault(),b.stopPropagation(),"mouseup"===b.type&&1!==b.which)return!0;var c=a(this);c.siblings().removeClass("active"),c.addClass("active"),c.parents(".fr-dropdown-menu").find("button").attr("data-param",c.attr("data-param")),c.parents(".fr-dropdown-menu").find(".fr-color-set").hide(),c.parents(".fr-dropdown-menu").find(".fr-color-set.fr-"+c.attr("data-param")).show(),e.refreshColors()}),c},a.Editable.prototype.backColor=function(b){this.inlineStyle("background-color","backColor",b),this.saveSelectionByMarkers(),this.$element.find("span").each(function(b,c){var d=a(c),e=d.css("background-color");("#123456"===e||"#123456"===a.Editable.RGBToHex(e))&&(d.css("background-color",""),d.find("span").each(function(b,c){var d=a(c);d.css("background-color",""),""!==d.attr("style")||d.hasClass("f-marker")||d.replaceWith(d.contents())})),""!==d.attr("style")||d.hasClass("f-marker")||d.replaceWith(d.contents())}),this.restoreSelectionByMarkers(),this.cleanify();var c=this.$editor.find('button.fr-color-bttn[data-cmd="backColor"][data-val="'+b+'"]');c.addClass("active"),c.siblings().removeClass("active")},a.Editable.prototype.foreColor=function(b){this.inlineStyle("color","foreColor",b),this.saveSelectionByMarkers(),this.$element.find("span").each(function(b,c){var d=a(c),e=d.css("color");("#123456"===e||"#123456"===a.Editable.RGBToHex(e))&&(d.css("color",""),d.find("span").each(function(b,c){var d=a(c);d.css("color",""),""!==d.attr("style")||d.hasClass("f-marker")||d.replaceWith(d.contents())})),""!==d.attr("style")||d.hasClass("f-marker")||d.replaceWith(d.contents())}),this.restoreSelectionByMarkers(),this.cleanify();var c=this.$editor.find('button.fr-color-bttn[data-cmd="foreColor"][data-val="'+b+'"]');c.addClass("active"),c.siblings().removeClass("active")}}(jQuery);

/*
 *
 * More info at [www.dropzonejs.com](http://www.dropzonejs.com)
 *
 * Copyright (c) 2012, Matias Meno
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

(function() {
  var Dropzone, Emitter, camelize, contentLoaded, detectVerticalSquash, drawImageIOSFix, noop, without,
    __slice = [].slice,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  noop = function() {};

  Emitter = (function() {
    function Emitter() {}

    Emitter.prototype.addEventListener = Emitter.prototype.on;

    Emitter.prototype.on = function(event, fn) {
      this._callbacks = this._callbacks || {};
      if (!this._callbacks[event]) {
        this._callbacks[event] = [];
      }
      this._callbacks[event].push(fn);
      return this;
    };

    Emitter.prototype.emit = function() {
      var args, callback, callbacks, event, _i, _len;
      event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      this._callbacks = this._callbacks || {};
      callbacks = this._callbacks[event];
      if (callbacks) {
        for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
          callback = callbacks[_i];
          callback.apply(this, args);
        }
      }
      return this;
    };

    Emitter.prototype.removeListener = Emitter.prototype.off;

    Emitter.prototype.removeAllListeners = Emitter.prototype.off;

    Emitter.prototype.removeEventListener = Emitter.prototype.off;

    Emitter.prototype.off = function(event, fn) {
      var callback, callbacks, i, _i, _len;
      if (!this._callbacks || arguments.length === 0) {
        this._callbacks = {};
        return this;
      }
      callbacks = this._callbacks[event];
      if (!callbacks) {
        return this;
      }
      if (arguments.length === 1) {
        delete this._callbacks[event];
        return this;
      }
      for (i = _i = 0, _len = callbacks.length; _i < _len; i = ++_i) {
        callback = callbacks[i];
        if (callback === fn) {
          callbacks.splice(i, 1);
          break;
        }
      }
      return this;
    };

    return Emitter;

  })();

  Dropzone = (function(_super) {
    var extend, resolveOption;

    __extends(Dropzone, _super);

    Dropzone.prototype.Emitter = Emitter;


    /*
    This is a list of all available events you can register on a dropzone object.
    
    You can register an event handler like this:
    
        dropzone.on("dragEnter", function() { });
     */

    Dropzone.prototype.events = ["drop", "dragstart", "dragend", "dragenter", "dragover", "dragleave", "addedfile", "removedfile", "thumbnail", "error", "errormultiple", "processing", "processingmultiple", "uploadprogress", "totaluploadprogress", "sending", "sendingmultiple", "success", "successmultiple", "canceled", "canceledmultiple", "complete", "completemultiple", "reset", "maxfilesexceeded", "maxfilesreached", "queuecomplete"];

    Dropzone.prototype.defaultOptions = {
      url: null,
      method: "post",
      withCredentials: false,
      parallelUploads: 2,
      uploadMultiple: false,
      maxFilesize: 256,
      paramName: "file",
      createImageThumbnails: true,
      maxThumbnailFilesize: 10,
      thumbnailWidth: 120,
      thumbnailHeight: 120,
      filesizeBase: 1000,
      maxFiles: null,
      filesizeBase: 1000,
      params: {},
      clickable: true,
      ignoreHiddenFiles: true,
      acceptedFiles: null,
      acceptedMimeTypes: null,
      autoProcessQueue: true,
      autoQueue: true,
      addRemoveLinks: false,
      previewsContainer: null,
      capture: null,
      dictDefaultMessage: "Drop files here to upload",
      dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
      dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
      dictFileTooBig: "File is too big ({{filesize}}MiB). Max filesize: {{maxFilesize}}MiB.",
      dictInvalidFileType: "You can't upload files of this type.",
      dictResponseError: "Server responded with {{statusCode}} code.",
      dictCancelUpload: "Cancel upload",
      dictCancelUploadConfirmation: "Are you sure you want to cancel this upload?",
      dictRemoveFile: "Remove file",
      dictRemoveFileConfirmation: null,
      dictMaxFilesExceeded: "You can not upload any more files.",
      accept: function(file, done) {
        return done();
      },
      init: function() {
        return noop;
      },
      forceFallback: false,
      fallback: function() {
        var child, messageElement, span, _i, _len, _ref;
        this.element.className = "" + this.element.className + " dz-browser-not-supported";
        _ref = this.element.getElementsByTagName("div");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          if (/(^| )dz-message($| )/.test(child.className)) {
            messageElement = child;
            child.className = "dz-message";
            continue;
          }
        }
        if (!messageElement) {
          messageElement = Dropzone.createElement("<div class=\"dz-message\"><span></span></div>");
          this.element.appendChild(messageElement);
        }
        span = messageElement.getElementsByTagName("span")[0];
        if (span) {
          span.textContent = this.options.dictFallbackMessage;
        }
        return this.element.appendChild(this.getFallbackForm());
      },
      resize: function(file) {
        var info, srcRatio, trgRatio;
        info = {
          srcX: 0,
          srcY: 0,
          srcWidth: file.width,
          srcHeight: file.height
        };
        srcRatio = file.width / file.height;
        info.optWidth = this.options.thumbnailWidth;
        info.optHeight = this.options.thumbnailHeight;
        if ((info.optWidth == null) && (info.optHeight == null)) {
          info.optWidth = info.srcWidth;
          info.optHeight = info.srcHeight;
        } else if (info.optWidth == null) {
          info.optWidth = srcRatio * info.optHeight;
        } else if (info.optHeight == null) {
          info.optHeight = (1 / srcRatio) * info.optWidth;
        }
        trgRatio = info.optWidth / info.optHeight;
        if (file.height < info.optHeight || file.width < info.optWidth) {
          info.trgHeight = info.srcHeight;
          info.trgWidth = info.srcWidth;
        } else {
          if (srcRatio > trgRatio) {
            info.srcHeight = file.height;
            info.srcWidth = info.srcHeight * trgRatio;
          } else {
            info.srcWidth = file.width;
            info.srcHeight = info.srcWidth / trgRatio;
          }
        }
        info.srcX = (file.width - info.srcWidth) / 2;
        info.srcY = (file.height - info.srcHeight) / 2;
        return info;
      },

      /*
      Those functions register themselves to the events on init and handle all
      the user interface specific stuff. Overwriting them won't break the upload
      but can break the way it's displayed.
      You can overwrite them if you don't like the default behavior. If you just
      want to add an additional event handler, register it on the dropzone object
      and don't overwrite those options.
       */
      drop: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragstart: noop,
      dragend: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      dragenter: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragover: function(e) {
        return this.element.classList.add("dz-drag-hover");
      },
      dragleave: function(e) {
        return this.element.classList.remove("dz-drag-hover");
      },
      paste: noop,
      reset: function() {
        return this.element.classList.remove("dz-started");
      },
      addedfile: function(file) {
        var node, removeFileEvent, removeLink, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
        if (this.element === this.previewsContainer) {
          this.element.classList.add("dz-started");
        }
        if (this.previewsContainer) {
          file.previewElement = Dropzone.createElement(this.options.previewTemplate.trim());
          file.previewTemplate = file.previewElement;
          this.previewsContainer.appendChild(file.previewElement);
          _ref = file.previewElement.querySelectorAll("[data-dz-name]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            node.textContent = file.name;
          }
          _ref1 = file.previewElement.querySelectorAll("[data-dz-size]");
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            node = _ref1[_j];
            node.innerHTML = this.filesize(file.size);
          }
          if (this.options.addRemoveLinks) {
            file._removeLink = Dropzone.createElement("<a class=\"dz-remove\" href=\"javascript:undefined;\" data-dz-remove>" + this.options.dictRemoveFile + "</a>");
            file.previewElement.appendChild(file._removeLink);
          }
          removeFileEvent = (function(_this) {
            return function(e) {
              e.preventDefault();
              e.stopPropagation();
              if (file.status === Dropzone.UPLOADING) {
                return Dropzone.confirm(_this.options.dictCancelUploadConfirmation, function() {
                  return _this.removeFile(file);
                });
              } else {
                if (_this.options.dictRemoveFileConfirmation) {
                  return Dropzone.confirm(_this.options.dictRemoveFileConfirmation, function() {
                    return _this.removeFile(file);
                  });
                } else {
                  return _this.removeFile(file);
                }
              }
            };
          })(this);
          _ref2 = file.previewElement.querySelectorAll("[data-dz-remove]");
          _results = [];
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            removeLink = _ref2[_k];
            _results.push(removeLink.addEventListener("click", removeFileEvent));
          }
          return _results;
        }
      },
      removedfile: function(file) {
        var _ref;
        if (file.previewElement) {
          if ((_ref = file.previewElement) != null) {
            _ref.parentNode.removeChild(file.previewElement);
          }
        }
        return this._updateMaxFilesReachedClass();
      },
      thumbnail: function(file, dataUrl) {
        var thumbnailElement, _i, _len, _ref;
        if (file.previewElement) {
          file.previewElement.classList.remove("dz-file-preview");
          _ref = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            thumbnailElement = _ref[_i];
            thumbnailElement.alt = file.name;
            thumbnailElement.src = dataUrl;
          }
          return setTimeout(((function(_this) {
            return function() {
              return file.previewElement.classList.add("dz-image-preview");
            };
          })(this)), 1);
        }
      },
      error: function(file, message) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          file.previewElement.classList.add("dz-error");
          if (typeof message !== "String" && message.error) {
            message = message.error;
          }
          _ref = file.previewElement.querySelectorAll("[data-dz-errormessage]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            _results.push(node.textContent = message);
          }
          return _results;
        }
      },
      errormultiple: noop,
      processing: function(file) {
        if (file.previewElement) {
          file.previewElement.classList.add("dz-processing");
          if (file._removeLink) {
            return file._removeLink.textContent = this.options.dictCancelUpload;
          }
        }
      },
      processingmultiple: noop,
      uploadprogress: function(file, progress, bytesSent) {
        var node, _i, _len, _ref, _results;
        if (file.previewElement) {
          _ref = file.previewElement.querySelectorAll("[data-dz-uploadprogress]");
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            node = _ref[_i];
            if (node.nodeName === 'PROGRESS') {
              _results.push(node.value = progress);
            } else {
              _results.push(node.style.width = "" + progress + "%");
            }
          }
          return _results;
        }
      },
      totaluploadprogress: noop,
      sending: noop,
      sendingmultiple: noop,
      success: function(file) {
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-success");
        }
      },
      successmultiple: noop,
      canceled: function(file) {
        return this.emit("error", file, "Upload canceled.");
      },
      canceledmultiple: noop,
      complete: function(file) {
        if (file._removeLink) {
          file._removeLink.textContent = this.options.dictRemoveFile;
        }
        if (file.previewElement) {
          return file.previewElement.classList.add("dz-complete");
        }
      },
      completemultiple: noop,
      maxfilesexceeded: noop,
      maxfilesreached: noop,
      queuecomplete: noop,
      previewTemplate: "<div class=\"dz-preview dz-file-preview\">\n  <div class=\"dz-image\"><img data-dz-thumbnail /></div>\n  <div class=\"dz-details\">\n    <div class=\"dz-size\"><span data-dz-size></span></div>\n    <div class=\"dz-filename\"><span data-dz-name></span></div>\n  </div>\n  <div class=\"dz-progress\"><span class=\"dz-upload\" data-dz-uploadprogress></span></div>\n  <div class=\"dz-error-message\"><span data-dz-errormessage></span></div>\n  <div class=\"dz-success-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Check</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <path d=\"M23.5,31.8431458 L17.5852419,25.9283877 C16.0248253,24.3679711 13.4910294,24.366835 11.9289322,25.9289322 C10.3700136,27.4878508 10.3665912,30.0234455 11.9283877,31.5852419 L20.4147581,40.0716123 C20.5133999,40.1702541 20.6159315,40.2626649 20.7218615,40.3488435 C22.2835669,41.8725651 24.794234,41.8626202 26.3461564,40.3106978 L43.3106978,23.3461564 C44.8771021,21.7797521 44.8758057,19.2483887 43.3137085,17.6862915 C41.7547899,16.1273729 39.2176035,16.1255422 37.6538436,17.6893022 L23.5,31.8431458 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" stroke-opacity=\"0.198794158\" stroke=\"#747474\" fill-opacity=\"0.816519475\" fill=\"#FFFFFF\" sketch:type=\"MSShapeGroup\"></path>\n      </g>\n    </svg>\n  </div>\n  <div class=\"dz-error-mark\">\n    <svg width=\"54px\" height=\"54px\" viewBox=\"0 0 54 54\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" xmlns:sketch=\"http://www.bohemiancoding.com/sketch/ns\">\n      <title>Error</title>\n      <defs></defs>\n      <g id=\"Page-1\" stroke=\"none\" stroke-width=\"1\" fill=\"none\" fill-rule=\"evenodd\" sketch:type=\"MSPage\">\n        <g id=\"Check-+-Oval-2\" sketch:type=\"MSLayerGroup\" stroke=\"#747474\" stroke-opacity=\"0.198794158\" fill=\"#FFFFFF\" fill-opacity=\"0.816519475\">\n          <path d=\"M32.6568542,29 L38.3106978,23.3461564 C39.8771021,21.7797521 39.8758057,19.2483887 38.3137085,17.6862915 C36.7547899,16.1273729 34.2176035,16.1255422 32.6538436,17.6893022 L27,23.3431458 L21.3461564,17.6893022 C19.7823965,16.1255422 17.2452101,16.1273729 15.6862915,17.6862915 C14.1241943,19.2483887 14.1228979,21.7797521 15.6893022,23.3461564 L21.3431458,29 L15.6893022,34.6538436 C14.1228979,36.2202479 14.1241943,38.7516113 15.6862915,40.3137085 C17.2452101,41.8726271 19.7823965,41.8744578 21.3461564,40.3106978 L27,34.6568542 L32.6538436,40.3106978 C34.2176035,41.8744578 36.7547899,41.8726271 38.3137085,40.3137085 C39.8758057,38.7516113 39.8771021,36.2202479 38.3106978,34.6538436 L32.6568542,29 Z M27,53 C41.3594035,53 53,41.3594035 53,27 C53,12.6405965 41.3594035,1 27,1 C12.6405965,1 1,12.6405965 1,27 C1,41.3594035 12.6405965,53 27,53 Z\" id=\"Oval-2\" sketch:type=\"MSShapeGroup\"></path>\n        </g>\n      </g>\n    </svg>\n  </div>\n</div>"
    };

    extend = function() {
      var key, object, objects, target, val, _i, _len;
      target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      for (_i = 0, _len = objects.length; _i < _len; _i++) {
        object = objects[_i];
        for (key in object) {
          val = object[key];
          target[key] = val;
        }
      }
      return target;
    };

    function Dropzone(element, options) {
      var elementOptions, fallback, _ref;
      this.element = element;
      this.version = Dropzone.version;
      this.defaultOptions.previewTemplate = this.defaultOptions.previewTemplate.replace(/\n*/g, "");
      this.clickableElements = [];
      this.listeners = [];
      this.files = [];
      if (typeof this.element === "string") {
        this.element = document.querySelector(this.element);
      }
      if (!(this.element && (this.element.nodeType != null))) {
        throw new Error("Invalid dropzone element.");
      }
      if (this.element.dropzone) {
        throw new Error("Dropzone already attached.");
      }
      Dropzone.instances.push(this);
      this.element.dropzone = this;
      elementOptions = (_ref = Dropzone.optionsForElement(this.element)) != null ? _ref : {};
      this.options = extend({}, this.defaultOptions, elementOptions, options != null ? options : {});
      if (this.options.forceFallback || !Dropzone.isBrowserSupported()) {
        return this.options.fallback.call(this);
      }
      if (this.options.url == null) {
        this.options.url = this.element.getAttribute("action");
      }
      if (!this.options.url) {
        throw new Error("No URL provided.");
      }
      if (this.options.acceptedFiles && this.options.acceptedMimeTypes) {
        throw new Error("You can't provide both 'acceptedFiles' and 'acceptedMimeTypes'. 'acceptedMimeTypes' is deprecated.");
      }
      if (this.options.acceptedMimeTypes) {
        this.options.acceptedFiles = this.options.acceptedMimeTypes;
        delete this.options.acceptedMimeTypes;
      }
      this.options.method = this.options.method.toUpperCase();
      if ((fallback = this.getExistingFallback()) && fallback.parentNode) {
        fallback.parentNode.removeChild(fallback);
      }
      if (this.options.previewsContainer !== false) {
        if (this.options.previewsContainer) {
          this.previewsContainer = Dropzone.getElement(this.options.previewsContainer, "previewsContainer");
        } else {
          this.previewsContainer = this.element;
        }
      }
      if (this.options.clickable) {
        if (this.options.clickable === true) {
          this.clickableElements = [this.element];
        } else {
          this.clickableElements = Dropzone.getElements(this.options.clickable, "clickable");
        }
      }
      this.init();
    }

    Dropzone.prototype.getAcceptedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getRejectedFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (!file.accepted) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getFilesWithStatus = function(status) {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === status) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.getQueuedFiles = function() {
      return this.getFilesWithStatus(Dropzone.QUEUED);
    };

    Dropzone.prototype.getUploadingFiles = function() {
      return this.getFilesWithStatus(Dropzone.UPLOADING);
    };

    Dropzone.prototype.getActiveFiles = function() {
      var file, _i, _len, _ref, _results;
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status === Dropzone.UPLOADING || file.status === Dropzone.QUEUED) {
          _results.push(file);
        }
      }
      return _results;
    };

    Dropzone.prototype.init = function() {
      var eventName, noPropagation, setupHiddenFileInput, _i, _len, _ref, _ref1;
      if (this.element.tagName === "form") {
        this.element.setAttribute("enctype", "multipart/form-data");
      }
      if (this.element.classList.contains("dropzone") && !this.element.querySelector(".dz-message")) {
        this.element.appendChild(Dropzone.createElement("<div class=\"dz-default dz-message\"><span>" + this.options.dictDefaultMessage + "</span></div>"));
      }
      if (this.clickableElements.length) {
        setupHiddenFileInput = (function(_this) {
          return function() {
            if (_this.hiddenFileInput) {
              document.body.removeChild(_this.hiddenFileInput);
            }
            _this.hiddenFileInput = document.createElement("input");
            _this.hiddenFileInput.setAttribute("type", "file");
            if ((_this.options.maxFiles == null) || _this.options.maxFiles > 1) {
              _this.hiddenFileInput.setAttribute("multiple", "multiple");
            }
            _this.hiddenFileInput.className = "dz-hidden-input";
            if (_this.options.acceptedFiles != null) {
              _this.hiddenFileInput.setAttribute("accept", _this.options.acceptedFiles);
            }
            if (_this.options.capture != null) {
              _this.hiddenFileInput.setAttribute("capture", _this.options.capture);
            }
            _this.hiddenFileInput.style.visibility = "hidden";
            _this.hiddenFileInput.style.position = "absolute";
            _this.hiddenFileInput.style.top = "0";
            _this.hiddenFileInput.style.left = "0";
            _this.hiddenFileInput.style.height = "0";
            _this.hiddenFileInput.style.width = "0";
            document.body.appendChild(_this.hiddenFileInput);
            return _this.hiddenFileInput.addEventListener("change", function() {
              var file, files, _i, _len;
              files = _this.hiddenFileInput.files;
              if (files.length) {
                for (_i = 0, _len = files.length; _i < _len; _i++) {
                  file = files[_i];
                  _this.addFile(file);
                }
              }
              return setupHiddenFileInput();
            });
          };
        })(this);
        setupHiddenFileInput();
      }
      this.URL = (_ref = window.URL) != null ? _ref : window.webkitURL;
      _ref1 = this.events;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        eventName = _ref1[_i];
        this.on(eventName, this.options[eventName]);
      }
      this.on("uploadprogress", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("removedfile", (function(_this) {
        return function() {
          return _this.updateTotalUploadProgress();
        };
      })(this));
      this.on("canceled", (function(_this) {
        return function(file) {
          return _this.emit("complete", file);
        };
      })(this));
      this.on("complete", (function(_this) {
        return function(file) {
          if (_this.getUploadingFiles().length === 0 && _this.getQueuedFiles().length === 0) {
            return setTimeout((function() {
              return _this.emit("queuecomplete");
            }), 0);
          }
        };
      })(this));
      noPropagation = function(e) {
        e.stopPropagation();
        if (e.preventDefault) {
          return e.preventDefault();
        } else {
          return e.returnValue = false;
        }
      };
      this.listeners = [
        {
          element: this.element,
          events: {
            "dragstart": (function(_this) {
              return function(e) {
                return _this.emit("dragstart", e);
              };
            })(this),
            "dragenter": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.emit("dragenter", e);
              };
            })(this),
            "dragover": (function(_this) {
              return function(e) {
                var efct;
                try {
                  efct = e.dataTransfer.effectAllowed;
                } catch (_error) {}
                e.dataTransfer.dropEffect = 'move' === efct || 'linkMove' === efct ? 'move' : 'copy';
                noPropagation(e);
                return _this.emit("dragover", e);
              };
            })(this),
            "dragleave": (function(_this) {
              return function(e) {
                return _this.emit("dragleave", e);
              };
            })(this),
            "drop": (function(_this) {
              return function(e) {
                noPropagation(e);
                return _this.drop(e);
              };
            })(this),
            "dragend": (function(_this) {
              return function(e) {
                return _this.emit("dragend", e);
              };
            })(this)
          }
        }
      ];
      this.clickableElements.forEach((function(_this) {
        return function(clickableElement) {
          return _this.listeners.push({
            element: clickableElement,
            events: {
              "click": function(evt) {
                if ((clickableElement !== _this.element) || (evt.target === _this.element || Dropzone.elementInside(evt.target, _this.element.querySelector(".dz-message")))) {
                  return _this.hiddenFileInput.click();
                }
              }
            }
          });
        };
      })(this));
      this.enable();
      return this.options.init.call(this);
    };

    Dropzone.prototype.destroy = function() {
      var _ref;
      this.disable();
      this.removeAllFiles(true);
      if ((_ref = this.hiddenFileInput) != null ? _ref.parentNode : void 0) {
        this.hiddenFileInput.parentNode.removeChild(this.hiddenFileInput);
        this.hiddenFileInput = null;
      }
      delete this.element.dropzone;
      return Dropzone.instances.splice(Dropzone.instances.indexOf(this), 1);
    };

    Dropzone.prototype.updateTotalUploadProgress = function() {
      var activeFiles, file, totalBytes, totalBytesSent, totalUploadProgress, _i, _len, _ref;
      totalBytesSent = 0;
      totalBytes = 0;
      activeFiles = this.getActiveFiles();
      if (activeFiles.length) {
        _ref = this.getActiveFiles();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          totalBytesSent += file.upload.bytesSent;
          totalBytes += file.upload.total;
        }
        totalUploadProgress = 100 * totalBytesSent / totalBytes;
      } else {
        totalUploadProgress = 100;
      }
      return this.emit("totaluploadprogress", totalUploadProgress, totalBytes, totalBytesSent);
    };

    Dropzone.prototype._getParamName = function(n) {
      if (typeof this.options.paramName === "function") {
        return this.options.paramName(n);
      } else {
        return "" + this.options.paramName + (this.options.uploadMultiple ? "[" + n + "]" : "");
      }
    };

    Dropzone.prototype.getFallbackForm = function() {
      var existingFallback, fields, fieldsString, form;
      if (existingFallback = this.getExistingFallback()) {
        return existingFallback;
      }
      fieldsString = "<div class=\"dz-fallback\">";
      if (this.options.dictFallbackText) {
        fieldsString += "<p>" + this.options.dictFallbackText + "</p>";
      }
      fieldsString += "<input type=\"file\" name=\"" + (this._getParamName(0)) + "\" " + (this.options.uploadMultiple ? 'multiple="multiple"' : void 0) + " /><input type=\"submit\" value=\"Upload!\"></div>";
      fields = Dropzone.createElement(fieldsString);
      if (this.element.tagName !== "FORM") {
        form = Dropzone.createElement("<form action=\"" + this.options.url + "\" enctype=\"multipart/form-data\" method=\"" + this.options.method + "\"></form>");
        form.appendChild(fields);
      } else {
        this.element.setAttribute("enctype", "multipart/form-data");
        this.element.setAttribute("method", this.options.method);
      }
      return form != null ? form : fields;
    };

    Dropzone.prototype.getExistingFallback = function() {
      var fallback, getFallback, tagName, _i, _len, _ref;
      getFallback = function(elements) {
        var el, _i, _len;
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )fallback($| )/.test(el.className)) {
            return el;
          }
        }
      };
      _ref = ["div", "form"];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        tagName = _ref[_i];
        if (fallback = getFallback(this.element.getElementsByTagName(tagName))) {
          return fallback;
        }
      }
    };

    Dropzone.prototype.setupEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.addEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.removeEventListeners = function() {
      var elementListeners, event, listener, _i, _len, _ref, _results;
      _ref = this.listeners;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elementListeners = _ref[_i];
        _results.push((function() {
          var _ref1, _results1;
          _ref1 = elementListeners.events;
          _results1 = [];
          for (event in _ref1) {
            listener = _ref1[event];
            _results1.push(elementListeners.element.removeEventListener(event, listener, false));
          }
          return _results1;
        })());
      }
      return _results;
    };

    Dropzone.prototype.disable = function() {
      var file, _i, _len, _ref, _results;
      this.clickableElements.forEach(function(element) {
        return element.classList.remove("dz-clickable");
      });
      this.removeEventListeners();
      _ref = this.files;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        _results.push(this.cancelUpload(file));
      }
      return _results;
    };

    Dropzone.prototype.enable = function() {
      this.clickableElements.forEach(function(element) {
        return element.classList.add("dz-clickable");
      });
      return this.setupEventListeners();
    };

    Dropzone.prototype.filesize = function(size) {
      var cutoff, i, selectedSize, selectedUnit, unit, units, _i, _len;
      units = ['TB', 'GB', 'MB', 'KB', 'b'];
      selectedSize = selectedUnit = null;
      for (i = _i = 0, _len = units.length; _i < _len; i = ++_i) {
        unit = units[i];
        cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;
        if (size >= cutoff) {
          selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
          selectedUnit = unit;
          break;
        }
      }
      selectedSize = Math.round(10 * selectedSize) / 10;
      return "<strong>" + selectedSize + "</strong> " + selectedUnit;
    };

    Dropzone.prototype._updateMaxFilesReachedClass = function() {
      if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        if (this.getAcceptedFiles().length === this.options.maxFiles) {
          this.emit('maxfilesreached', this.files);
        }
        return this.element.classList.add("dz-max-files-reached");
      } else {
        return this.element.classList.remove("dz-max-files-reached");
      }
    };

    Dropzone.prototype.drop = function(e) {
      var files, items;
      if (!e.dataTransfer) {
        return;
      }
      this.emit("drop", e);
      files = e.dataTransfer.files;
      if (files.length) {
        items = e.dataTransfer.items;
        if (items && items.length && (items[0].webkitGetAsEntry != null)) {
          this._addFilesFromItems(items);
        } else {
          this.handleFiles(files);
        }
      }
    };

    Dropzone.prototype.paste = function(e) {
      var items, _ref;
      if ((e != null ? (_ref = e.clipboardData) != null ? _ref.items : void 0 : void 0) == null) {
        return;
      }
      this.emit("paste", e);
      items = e.clipboardData.items;
      if (items.length) {
        return this._addFilesFromItems(items);
      }
    };

    Dropzone.prototype.handleFiles = function(files) {
      var file, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        _results.push(this.addFile(file));
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromItems = function(items) {
      var entry, item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        if ((item.webkitGetAsEntry != null) && (entry = item.webkitGetAsEntry())) {
          if (entry.isFile) {
            _results.push(this.addFile(item.getAsFile()));
          } else if (entry.isDirectory) {
            _results.push(this._addFilesFromDirectory(entry, entry.name));
          } else {
            _results.push(void 0);
          }
        } else if (item.getAsFile != null) {
          if ((item.kind == null) || item.kind === "file") {
            _results.push(this.addFile(item.getAsFile()));
          } else {
            _results.push(void 0);
          }
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    Dropzone.prototype._addFilesFromDirectory = function(directory, path) {
      var dirReader, entriesReader;
      dirReader = directory.createReader();
      entriesReader = (function(_this) {
        return function(entries) {
          var entry, _i, _len;
          for (_i = 0, _len = entries.length; _i < _len; _i++) {
            entry = entries[_i];
            if (entry.isFile) {
              entry.file(function(file) {
                if (_this.options.ignoreHiddenFiles && file.name.substring(0, 1) === '.') {
                  return;
                }
                file.fullPath = "" + path + "/" + file.name;
                return _this.addFile(file);
              });
            } else if (entry.isDirectory) {
              _this._addFilesFromDirectory(entry, "" + path + "/" + entry.name);
            }
          }
        };
      })(this);
      return dirReader.readEntries(entriesReader, function(error) {
        return typeof console !== "undefined" && console !== null ? typeof console.log === "function" ? console.log(error) : void 0 : void 0;
      });
    };

    Dropzone.prototype.accept = function(file, done) {
      if (file.size > this.options.maxFilesize * 1024 * 1024) {
        return done(this.options.dictFileTooBig.replace("{{filesize}}", Math.round(file.size / 1024 / 10.24) / 100).replace("{{maxFilesize}}", this.options.maxFilesize));
      } else if (!Dropzone.isValidFile(file, this.options.acceptedFiles)) {
        return done(this.options.dictInvalidFileType);
      } else if ((this.options.maxFiles != null) && this.getAcceptedFiles().length >= this.options.maxFiles) {
        done(this.options.dictMaxFilesExceeded.replace("{{maxFiles}}", this.options.maxFiles));
        return this.emit("maxfilesexceeded", file);
      } else {
        return this.options.accept.call(this, file, done);
      }
    };

    Dropzone.prototype.addFile = function(file) {
      file.upload = {
        progress: 0,
        total: file.size,
        bytesSent: 0
      };
      this.files.push(file);
      file.status = Dropzone.ADDED;
      this.emit("addedfile", file);
      this._enqueueThumbnail(file);
      return this.accept(file, (function(_this) {
        return function(error) {
          if (error) {
            file.accepted = false;
            _this._errorProcessing([file], error);
          } else {
            file.accepted = true;
            if (_this.options.autoQueue) {
              _this.enqueueFile(file);
            }
          }
          return _this._updateMaxFilesReachedClass();
        };
      })(this));
    };

    Dropzone.prototype.enqueueFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        this.enqueueFile(file);
      }
      return null;
    };

    Dropzone.prototype.enqueueFile = function(file) {
      if (file.status === Dropzone.ADDED && file.accepted === true) {
        file.status = Dropzone.QUEUED;
        if (this.options.autoProcessQueue) {
          return setTimeout(((function(_this) {
            return function() {
              return _this.processQueue();
            };
          })(this)), 0);
        }
      } else {
        throw new Error("This file can't be queued because it has already been processed or was rejected.");
      }
    };

    Dropzone.prototype._thumbnailQueue = [];

    Dropzone.prototype._processingThumbnail = false;

    Dropzone.prototype._enqueueThumbnail = function(file) {
      if (this.options.createImageThumbnails && file.type.match(/image.*/) && file.size <= this.options.maxThumbnailFilesize * 1024 * 1024) {
        this._thumbnailQueue.push(file);
        return setTimeout(((function(_this) {
          return function() {
            return _this._processThumbnailQueue();
          };
        })(this)), 0);
      }
    };

    Dropzone.prototype._processThumbnailQueue = function() {
      if (this._processingThumbnail || this._thumbnailQueue.length === 0) {
        return;
      }
      this._processingThumbnail = true;
      return this.createThumbnail(this._thumbnailQueue.shift(), (function(_this) {
        return function() {
          _this._processingThumbnail = false;
          return _this._processThumbnailQueue();
        };
      })(this));
    };

    Dropzone.prototype.removeFile = function(file) {
      if (file.status === Dropzone.UPLOADING) {
        this.cancelUpload(file);
      }
      this.files = without(this.files, file);
      this.emit("removedfile", file);
      if (this.files.length === 0) {
        return this.emit("reset");
      }
    };

    Dropzone.prototype.removeAllFiles = function(cancelIfNecessary) {
      var file, _i, _len, _ref;
      if (cancelIfNecessary == null) {
        cancelIfNecessary = false;
      }
      _ref = this.files.slice();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        file = _ref[_i];
        if (file.status !== Dropzone.UPLOADING || cancelIfNecessary) {
          this.removeFile(file);
        }
      }
      return null;
    };

    Dropzone.prototype.createThumbnail = function(file, callback) {
      var fileReader;
      fileReader = new FileReader;
      fileReader.onload = (function(_this) {
        return function() {
          if (file.type === "image/svg+xml") {
            _this.emit("thumbnail", file, fileReader.result);
            if (callback != null) {
              callback();
            }
            return;
          }
          return _this.createThumbnailFromUrl(file, fileReader.result, callback);
        };
      })(this);
      return fileReader.readAsDataURL(file);
    };

    Dropzone.prototype.createThumbnailFromUrl = function(file, imageUrl, callback) {
      var img;
      img = document.createElement("img");
      img.onload = (function(_this) {
        return function() {
          var canvas, ctx, resizeInfo, thumbnail, _ref, _ref1, _ref2, _ref3;
          file.width = img.width;
          file.height = img.height;
          resizeInfo = _this.options.resize.call(_this, file);
          if (resizeInfo.trgWidth == null) {
            resizeInfo.trgWidth = resizeInfo.optWidth;
          }
          if (resizeInfo.trgHeight == null) {
            resizeInfo.trgHeight = resizeInfo.optHeight;
          }
          canvas = document.createElement("canvas");
          ctx = canvas.getContext("2d");
          canvas.width = resizeInfo.trgWidth;
          canvas.height = resizeInfo.trgHeight;
          drawImageIOSFix(ctx, img, (_ref = resizeInfo.srcX) != null ? _ref : 0, (_ref1 = resizeInfo.srcY) != null ? _ref1 : 0, resizeInfo.srcWidth, resizeInfo.srcHeight, (_ref2 = resizeInfo.trgX) != null ? _ref2 : 0, (_ref3 = resizeInfo.trgY) != null ? _ref3 : 0, resizeInfo.trgWidth, resizeInfo.trgHeight);
          thumbnail = canvas.toDataURL("image/png");
          _this.emit("thumbnail", file, thumbnail);
          if (callback != null) {
            return callback();
          }
        };
      })(this);
      if (callback != null) {
        img.onerror = callback;
      }
      return img.src = imageUrl;
    };

    Dropzone.prototype.processQueue = function() {
      var i, parallelUploads, processingLength, queuedFiles;
      parallelUploads = this.options.parallelUploads;
      processingLength = this.getUploadingFiles().length;
      i = processingLength;
      if (processingLength >= parallelUploads) {
        return;
      }
      queuedFiles = this.getQueuedFiles();
      if (!(queuedFiles.length > 0)) {
        return;
      }
      if (this.options.uploadMultiple) {
        return this.processFiles(queuedFiles.slice(0, parallelUploads - processingLength));
      } else {
        while (i < parallelUploads) {
          if (!queuedFiles.length) {
            return;
          }
          this.processFile(queuedFiles.shift());
          i++;
        }
      }
    };

    Dropzone.prototype.processFile = function(file) {
      return this.processFiles([file]);
    };

    Dropzone.prototype.processFiles = function(files) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.processing = true;
        file.status = Dropzone.UPLOADING;
        this.emit("processing", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("processingmultiple", files);
      }
      return this.uploadFiles(files);
    };

    Dropzone.prototype._getFilesWithXhr = function(xhr) {
      var file, files;
      return files = (function() {
        var _i, _len, _ref, _results;
        _ref = this.files;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          file = _ref[_i];
          if (file.xhr === xhr) {
            _results.push(file);
          }
        }
        return _results;
      }).call(this);
    };

    Dropzone.prototype.cancelUpload = function(file) {
      var groupedFile, groupedFiles, _i, _j, _len, _len1, _ref;
      if (file.status === Dropzone.UPLOADING) {
        groupedFiles = this._getFilesWithXhr(file.xhr);
        for (_i = 0, _len = groupedFiles.length; _i < _len; _i++) {
          groupedFile = groupedFiles[_i];
          groupedFile.status = Dropzone.CANCELED;
        }
        file.xhr.abort();
        for (_j = 0, _len1 = groupedFiles.length; _j < _len1; _j++) {
          groupedFile = groupedFiles[_j];
          this.emit("canceled", groupedFile);
        }
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", groupedFiles);
        }
      } else if ((_ref = file.status) === Dropzone.ADDED || _ref === Dropzone.QUEUED) {
        file.status = Dropzone.CANCELED;
        this.emit("canceled", file);
        if (this.options.uploadMultiple) {
          this.emit("canceledmultiple", [file]);
        }
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    resolveOption = function() {
      var args, option;
      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (typeof option === 'function') {
        return option.apply(this, args);
      }
      return option;
    };

    Dropzone.prototype.uploadFile = function(file) {
      return this.uploadFiles([file]);
    };

    Dropzone.prototype.uploadFiles = function(files) {
      var file, formData, handleError, headerName, headerValue, headers, i, input, inputName, inputType, key, method, option, progressObj, response, updateProgress, url, value, xhr, _i, _j, _k, _l, _len, _len1, _len2, _len3, _m, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
      xhr = new XMLHttpRequest();
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.xhr = xhr;
      }
      method = resolveOption(this.options.method, files);
      url = resolveOption(this.options.url, files);
      xhr.open(method, url, true);
      xhr.withCredentials = !!this.options.withCredentials;
      response = null;
      handleError = (function(_this) {
        return function() {
          var _j, _len1, _results;
          _results = [];
          for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
            file = files[_j];
            _results.push(_this._errorProcessing(files, response || _this.options.dictResponseError.replace("{{statusCode}}", xhr.status), xhr));
          }
          return _results;
        };
      })(this);
      updateProgress = (function(_this) {
        return function(e) {
          var allFilesFinished, progress, _j, _k, _l, _len1, _len2, _len3, _results;
          if (e != null) {
            progress = 100 * e.loaded / e.total;
            for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
              file = files[_j];
              file.upload = {
                progress: progress,
                total: e.total,
                bytesSent: e.loaded
              };
            }
          } else {
            allFilesFinished = true;
            progress = 100;
            for (_k = 0, _len2 = files.length; _k < _len2; _k++) {
              file = files[_k];
              if (!(file.upload.progress === 100 && file.upload.bytesSent === file.upload.total)) {
                allFilesFinished = false;
              }
              file.upload.progress = progress;
              file.upload.bytesSent = file.upload.total;
            }
            if (allFilesFinished) {
              return;
            }
          }
          _results = [];
          for (_l = 0, _len3 = files.length; _l < _len3; _l++) {
            file = files[_l];
            _results.push(_this.emit("uploadprogress", file, progress, file.upload.bytesSent));
          }
          return _results;
        };
      })(this);
      xhr.onload = (function(_this) {
        return function(e) {
          var _ref;
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          if (xhr.readyState !== 4) {
            return;
          }
          response = xhr.responseText;
          if (xhr.getResponseHeader("content-type") && ~xhr.getResponseHeader("content-type").indexOf("application/json")) {
            try {
              response = JSON.parse(response);
            } catch (_error) {
              e = _error;
              response = "Invalid JSON response from server.";
            }
          }
          updateProgress();
          if (!((200 <= (_ref = xhr.status) && _ref < 300))) {
            return handleError();
          } else {
            return _this._finished(files, response, e);
          }
        };
      })(this);
      xhr.onerror = (function(_this) {
        return function() {
          if (files[0].status === Dropzone.CANCELED) {
            return;
          }
          return handleError();
        };
      })(this);
      progressObj = (_ref = xhr.upload) != null ? _ref : xhr;
      progressObj.onprogress = updateProgress;
      headers = {
        "Accept": "application/json",
        "Cache-Control": "no-cache",
        "X-Requested-With": "XMLHttpRequest"
      };
      if (this.options.headers) {
        extend(headers, this.options.headers);
      }
      for (headerName in headers) {
        headerValue = headers[headerName];
        xhr.setRequestHeader(headerName, headerValue);
      }
      formData = new FormData();
      if (this.options.params) {
        _ref1 = this.options.params;
        for (key in _ref1) {
          value = _ref1[key];
          formData.append(key, value);
        }
      }
      for (_j = 0, _len1 = files.length; _j < _len1; _j++) {
        file = files[_j];
        this.emit("sending", file, xhr, formData);
      }
      if (this.options.uploadMultiple) {
        this.emit("sendingmultiple", files, xhr, formData);
      }
      if (this.element.tagName === "FORM") {
        _ref2 = this.element.querySelectorAll("input, textarea, select, button");
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          input = _ref2[_k];
          inputName = input.getAttribute("name");
          inputType = input.getAttribute("type");
          if (input.tagName === "SELECT" && input.hasAttribute("multiple")) {
            _ref3 = input.options;
            for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
              option = _ref3[_l];
              if (option.selected) {
                formData.append(inputName, option.value);
              }
            }
          } else if (!inputType || ((_ref4 = inputType.toLowerCase()) !== "checkbox" && _ref4 !== "radio") || input.checked) {
            formData.append(inputName, input.value);
          }
        }
      }
      for (i = _m = 0, _ref5 = files.length - 1; 0 <= _ref5 ? _m <= _ref5 : _m >= _ref5; i = 0 <= _ref5 ? ++_m : --_m) {
        formData.append(this._getParamName(i), files[i], files[i].name);
      }
      return xhr.send(formData);
    };

    Dropzone.prototype._finished = function(files, responseText, e) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.SUCCESS;
        this.emit("success", file, responseText, e);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("successmultiple", files, responseText, e);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    Dropzone.prototype._errorProcessing = function(files, message, xhr) {
      var file, _i, _len;
      for (_i = 0, _len = files.length; _i < _len; _i++) {
        file = files[_i];
        file.status = Dropzone.ERROR;
        this.emit("error", file, message, xhr);
        this.emit("complete", file);
      }
      if (this.options.uploadMultiple) {
        this.emit("errormultiple", files, message, xhr);
        this.emit("completemultiple", files);
      }
      if (this.options.autoProcessQueue) {
        return this.processQueue();
      }
    };

    return Dropzone;

  })(Emitter);

  Dropzone.version = "4.0.1";

  Dropzone.options = {};

  Dropzone.optionsForElement = function(element) {
    if (element.getAttribute("id")) {
      return Dropzone.options[camelize(element.getAttribute("id"))];
    } else {
      return void 0;
    }
  };

  Dropzone.instances = [];

  Dropzone.forElement = function(element) {
    if (typeof element === "string") {
      element = document.querySelector(element);
    }
    if ((element != null ? element.dropzone : void 0) == null) {
      throw new Error("No Dropzone found for given element. This is probably because you're trying to access it before Dropzone had the time to initialize. Use the `init` option to setup any additional observers on your Dropzone.");
    }
    return element.dropzone;
  };

  Dropzone.autoDiscover = true;

  Dropzone.discover = function() {
    var checkElements, dropzone, dropzones, _i, _len, _results;
    if (document.querySelectorAll) {
      dropzones = document.querySelectorAll(".dropzone");
    } else {
      dropzones = [];
      checkElements = function(elements) {
        var el, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = elements.length; _i < _len; _i++) {
          el = elements[_i];
          if (/(^| )dropzone($| )/.test(el.className)) {
            _results.push(dropzones.push(el));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      checkElements(document.getElementsByTagName("div"));
      checkElements(document.getElementsByTagName("form"));
    }
    _results = [];
    for (_i = 0, _len = dropzones.length; _i < _len; _i++) {
      dropzone = dropzones[_i];
      if (Dropzone.optionsForElement(dropzone) !== false) {
        _results.push(new Dropzone(dropzone));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  Dropzone.blacklistedBrowsers = [/opera.*Macintosh.*version\/12/i];

  Dropzone.isBrowserSupported = function() {
    var capableBrowser, regex, _i, _len, _ref;
    capableBrowser = true;
    if (window.File && window.FileReader && window.FileList && window.Blob && window.FormData && document.querySelector) {
      if (!("classList" in document.createElement("a"))) {
        capableBrowser = false;
      } else {
        _ref = Dropzone.blacklistedBrowsers;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          regex = _ref[_i];
          if (regex.test(navigator.userAgent)) {
            capableBrowser = false;
            continue;
          }
        }
      }
    } else {
      capableBrowser = false;
    }
    return capableBrowser;
  };

  without = function(list, rejectedItem) {
    var item, _i, _len, _results;
    _results = [];
    for (_i = 0, _len = list.length; _i < _len; _i++) {
      item = list[_i];
      if (item !== rejectedItem) {
        _results.push(item);
      }
    }
    return _results;
  };

  camelize = function(str) {
    return str.replace(/[\-_](\w)/g, function(match) {
      return match.charAt(1).toUpperCase();
    });
  };

  Dropzone.createElement = function(string) {
    var div;
    div = document.createElement("div");
    div.innerHTML = string;
    return div.childNodes[0];
  };

  Dropzone.elementInside = function(element, container) {
    if (element === container) {
      return true;
    }
    while (element = element.parentNode) {
      if (element === container) {
        return true;
      }
    }
    return false;
  };

  Dropzone.getElement = function(el, name) {
    var element;
    if (typeof el === "string") {
      element = document.querySelector(el);
    } else if (el.nodeType != null) {
      element = el;
    }
    if (element == null) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector or a plain HTML element.");
    }
    return element;
  };

  Dropzone.getElements = function(els, name) {
    var e, el, elements, _i, _j, _len, _len1, _ref;
    if (els instanceof Array) {
      elements = [];
      try {
        for (_i = 0, _len = els.length; _i < _len; _i++) {
          el = els[_i];
          elements.push(this.getElement(el, name));
        }
      } catch (_error) {
        e = _error;
        elements = null;
      }
    } else if (typeof els === "string") {
      elements = [];
      _ref = document.querySelectorAll(els);
      for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
        el = _ref[_j];
        elements.push(el);
      }
    } else if (els.nodeType != null) {
      elements = [els];
    }
    if (!((elements != null) && elements.length)) {
      throw new Error("Invalid `" + name + "` option provided. Please provide a CSS selector, a plain HTML element or a list of those.");
    }
    return elements;
  };

  Dropzone.confirm = function(question, accepted, rejected) {
    if (window.confirm(question)) {
      return accepted();
    } else if (rejected != null) {
      return rejected();
    }
  };

  Dropzone.isValidFile = function(file, acceptedFiles) {
    var baseMimeType, mimeType, validType, _i, _len;
    if (!acceptedFiles) {
      return true;
    }
    acceptedFiles = acceptedFiles.split(",");
    mimeType = file.type;
    baseMimeType = mimeType.replace(/\/.*$/, "");
    for (_i = 0, _len = acceptedFiles.length; _i < _len; _i++) {
      validType = acceptedFiles[_i];
      validType = validType.trim();
      if (validType.charAt(0) === ".") {
        if (file.name.toLowerCase().indexOf(validType.toLowerCase(), file.name.length - validType.length) !== -1) {
          return true;
        }
      } else if (/\/\*$/.test(validType)) {
        if (baseMimeType === validType.replace(/\/.*$/, "")) {
          return true;
        }
      } else {
        if (mimeType === validType) {
          return true;
        }
      }
    }
    return false;
  };

  if (typeof jQuery !== "undefined" && jQuery !== null) {
    jQuery.fn.dropzone = function(options) {
      return this.each(function() {
        return new Dropzone(this, options);
      });
    };
  }

  if (typeof module !== "undefined" && module !== null) {
    module.exports = Dropzone;
  } else {
    window.Dropzone = Dropzone;
  }

  Dropzone.ADDED = "added";

  Dropzone.QUEUED = "queued";

  Dropzone.ACCEPTED = Dropzone.QUEUED;

  Dropzone.UPLOADING = "uploading";

  Dropzone.PROCESSING = Dropzone.UPLOADING;

  Dropzone.CANCELED = "canceled";

  Dropzone.ERROR = "error";

  Dropzone.SUCCESS = "success";


  /*
  
  Bugfix for iOS 6 and 7
  Source: http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
  based on the work of https://github.com/stomita/ios-imagefile-megapixel
   */

  detectVerticalSquash = function(img) {
    var alpha, canvas, ctx, data, ey, ih, iw, py, ratio, sy;
    iw = img.naturalWidth;
    ih = img.naturalHeight;
    canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = ih;
    ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    data = ctx.getImageData(0, 0, 1, ih).data;
    sy = 0;
    ey = ih;
    py = ih;
    while (py > sy) {
      alpha = data[(py - 1) * 4 + 3];
      if (alpha === 0) {
        ey = py;
      } else {
        sy = py;
      }
      py = (ey + sy) >> 1;
    }
    ratio = py / ih;
    if (ratio === 0) {
      return 1;
    } else {
      return ratio;
    }
  };

  drawImageIOSFix = function(ctx, img, sx, sy, sw, sh, dx, dy, dw, dh) {
    var vertSquashRatio;
    vertSquashRatio = detectVerticalSquash(img);
    return ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh / vertSquashRatio);
  };


  /*
   * contentloaded.js
   *
   * Author: Diego Perini (diego.perini at gmail.com)
   * Summary: cross-browser wrapper for DOMContentLoaded
   * Updated: 20101020
   * License: MIT
   * Version: 1.2
   *
   * URL:
   * http://javascript.nwbox.com/ContentLoaded/
   * http://javascript.nwbox.com/ContentLoaded/MIT-LICENSE
   */

  contentLoaded = function(win, fn) {
    var add, doc, done, init, poll, pre, rem, root, top;
    done = false;
    top = true;
    doc = win.document;
    root = doc.documentElement;
    add = (doc.addEventListener ? "addEventListener" : "attachEvent");
    rem = (doc.addEventListener ? "removeEventListener" : "detachEvent");
    pre = (doc.addEventListener ? "" : "on");
    init = function(e) {
      if (e.type === "readystatechange" && doc.readyState !== "complete") {
        return;
      }
      (e.type === "load" ? win : doc)[rem](pre + e.type, init, false);
      if (!done && (done = true)) {
        return fn.call(win, e.type || e);
      }
    };
    poll = function() {
      var e;
      try {
        root.doScroll("left");
      } catch (_error) {
        e = _error;
        setTimeout(poll, 50);
        return;
      }
      return init("poll");
    };
    if (doc.readyState !== "complete") {
      if (doc.createEventObject && root.doScroll) {
        try {
          top = !win.frameElement;
        } catch (_error) {}
        if (top) {
          poll();
        }
      }
      doc[add](pre + "DOMContentLoaded", init, false);
      doc[add](pre + "readystatechange", init, false);
      return win[add](pre + "load", init, false);
    }
  };

  Dropzone._autoDiscoverFunction = function() {
    if (Dropzone.autoDiscover) {
      return Dropzone.discover();
    }
  };

  contentLoaded(window, Dropzone._autoDiscoverFunction);

}).call(this);
