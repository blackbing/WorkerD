define("text!lib/WorkerD/worker_console.js",[],function(){return"// Generated by CoffeeScript 1.6.2\n(function() {\n  var attr, console_attr, _i, _len,\n    _this = this;\n\n  this.postDebugMessage = function(type, args) {\n    return postMessage({\n      debug: type,\n      args: args\n    });\n  };\n\n  console_attr = ['debug', 'error', 'info', 'log', 'warn', 'dir', 'dirxml', 'trace', 'assert', 'count', 'markTimeline', 'profile', 'profileEnd', 'time', 'timeEnd', 'timeStamp', 'group', 'groupCollapsed', 'groupEnd'];\n\n  this.console = {};\n\n  for (_i = 0, _len = console_attr.length; _i < _len; _i++) {\n    attr = console_attr[_i];\n    this.console[attr] = (function(attr) {\n      return function() {\n        return _this.postDebugMessage(attr, arguments);\n      };\n    })(attr);\n  }\n\n}).call(this);\n"}),define("text!lib/WorkerD/worker_event.js",[],function(){return'// Generated by CoffeeScript 1.6.2\n(function() {\n  var Callbacks,\n    _this = this;\n\n  Callbacks = {};\n\n  this.send = function(id, data) {\n    var res;\n\n    res = {};\n    res.msgId = id;\n    res[id] = data;\n    return self.postMessage(res);\n  };\n\n  this.on = function(id, callback) {\n    return Callbacks[id] = callback;\n  };\n\n  this.off = function(id) {\n    return delete Callbacks[id];\n  };\n\n  this.addEventListener("message", function(event) {\n    var data, id, msgData;\n\n    data = event.data;\n    if ((data.msgId != null) && (data.msgData != null)) {\n      id = data.msgId;\n      msgData = data.msgData;\n      if (Callbacks[id]) {\n        return Callbacks[id](msgData);\n      }\n    }\n  });\n\n}).call(this);\n'}),function(){define("lib/WorkerD/worker_util",["require","text!./worker_console.js","text!./worker_event.js"],function(e){var t,n,r,i,s,o;return s=e("text!./worker_console.js"),o=e("text!./worker_event.js"),i="http://requirejs.org/docs/release/2.1.5/minified/require.js",r="importScripts('"+i+"');",t=window.URL||window.webkitURL,n=function(){function l(e){u=_.extend(u,e),this.options=u}var e,n,i,u,a,f;return n="background: #000; color: #FFF;",e=function(e,t){var n;return n=[],t.enableRequire&&(console.info("enableRequire"),n.push(r)),t.enableDebug&&(console.info("enableDebug"),n.push(s)),n.push(o),n.push(e),n.join("\n")},a=function(e,t){var r=this;return e.addEventListener("message",function(e){var r,i;if(!t.enableDebug)return!1;i=e.data;if(typeof i=="object"&&i.debug!=null)return console.group("%c console from worker",n),r=_.toArray(i.args),console[i.debug].apply(console,r),console.groupEnd("%c console from worker",n)},!1),e.addEventListener("error",function(e){return console.group("error from worker"),console.error(e),console.groupEnd("error from worker")},!1),e},f=function(e,t){return localStorage.setItem(e,t)},i=function(e){return localStorage.getItem(e)},u={enableDebug:!0,enableRequire:!0},l.prototype.createInlineWorker=function(n,r){var i,s,o;return r=_.extend(u,r),n=e(n,r),i=new Blob([n],{type:"application/javascript"}),s=t.createObjectURL(i),o=new Worker(s),a(o,r),t.revokeObjectURL(s),o},l.prototype.createInlineSharedWorker=function(e,n){var r,s,o,u;return o=i(n),o?s=o:(r=new Blob([e],{type:"application/javascript"}),s=t.createObjectURL(r),f(n,s)),u=new SharedWorker(s,n),a(u),t.revokeObjectURL(s),u},l}(),new n})}.call(this),function(){define("lib/WorkerD/WorkerD",["require","./worker_util"],function(e){var t,n;return n=e("./worker_util"),t=function(){function i(e,t){this.worker=n.createInlineWorker(e,t),this.worker.addEventListener("message",r)}var e,t,r;return e=$.Deferred(),t=$({}),r=function(e){var n;n=e.data;if(typeof n=="object"&&n.msgId!=null)return t.trigger(n.msgId,[n[n.msgId],e])},i.prototype.send=function(e,t,n){var r;return r={msgId:e,msgData:t},this.worker.postMessage.apply(this.worker,[r,n])},i.prototype.on=function(e,n){return t.on.apply(t,arguments)},i.prototype.terminate=function(){return this.worker.terminate()},i}()})}.call(this);