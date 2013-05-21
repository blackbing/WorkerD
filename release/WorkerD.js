
define('text!worker_console.js',[],function () { return '(function() {\n  var attr, console_attr, _i, _len,\n    _this = this;\n\n  this.postDebugMessage = function(type, args) {\n    return self.postMessage({\n      debug: type,\n      args: args\n    });\n  };\n\n  console_attr = [\'debug\', \'error\', \'info\', \'log\', \'warn\', \'group\', \'groupCollapsed\', \'groupEnd\', \'dir\', \'trace\', \'assert\', \'count\', \'markTimeline\', \'profile\', \'profileEnd\', \'time\', \'timeEnd\', \'timeStamp\'];\n\n  self.console = {};\n\n  for (_i = 0, _len = console_attr.length; _i < _len; _i++) {\n    attr = console_attr[_i];\n    self.console[attr] = (function(attr) {\n      return function() {\n        var args;\n\n        args = Array.prototype.slice.call(arguments);\n        return _this.postDebugMessage(attr, args);\n      };\n    })(attr);\n  }\n\n}).call(this);\n';});

define('text!worker_event.js',[],function () { return '(function() {\n  var Callbacks,\n    _this = this;\n\n  Callbacks = {};\n\n  this.send = function(id, data) {\n    var res;\n\n    res = {};\n    res.msgId = id;\n    res[id] = data;\n    return self.postMessage(res);\n  };\n\n  this.on = function(id, callback) {\n    return Callbacks[id] = callback;\n  };\n\n  this.off = function(id) {\n    return delete Callbacks[id];\n  };\n\n  this.addEventListener("message", function(event) {\n    var data, id, msgData;\n\n    data = event.data;\n    if ((data.msgId != null) && (data.msgData != null)) {\n      id = data.msgId;\n      msgData = data.msgData;\n      if (Callbacks[id]) {\n        return Callbacks[id](msgData);\n      }\n    }\n  });\n\n}).call(this);\n';});

(function() {
  define('worker_util',['require','text!./worker_console.js','text!./worker_event.js'],function(require) {
    var WorkerUtil, worker_console_js, worker_event_js;

    worker_console_js = require('text!./worker_console.js');
    worker_event_js = require('text!./worker_event.js');
    WorkerUtil = (function() {
      var URL, append_console, consoleStyle, consoleStylePrefix, getSharedWorkerURL, importRequirejs, options, prepareInlineDebug, requirejsPath, storeSharedWorkerURL, supportSyntaxList;

      URL = window.URL || window.webkitURL;

      requirejsPath = 'http://requirejs.org/docs/release/2.1.5/minified/require.js';

      importRequirejs = "importScripts('" + requirejsPath + "');";

      consoleStyle = 'background: #555454; color: #F1F179; padding: 2px;';

      supportSyntaxList = ['debug', 'error', 'info', 'log', 'warn', 'group', 'groupCollapsed', 'groupEnd'];

      consoleStylePrefix = '%c';

      append_console = function(content, opts) {
        var jsContent;

        jsContent = [];
        if (opts.enableRequire) {
          jsContent.push(importRequirejs);
        }
        if (opts.enableConsole) {
          jsContent.push(worker_console_js);
        }
        jsContent.push(worker_event_js);
        jsContent.push(content);
        return jsContent.join("\n");
      };

      prepareInlineDebug = function(inlineWorker, opts) {
        var _this = this;

        inlineWorker.addEventListener('message', function(event) {
          var args, data, k, v, _ref;

          if (!opts.enableConsole) {
            return false;
          }
          data = event.data;
          if (typeof data === 'object' && (data.debug != null)) {
            args = [];
            _ref = data.args;
            for (k in _ref) {
              v = _ref[k];
              args.push(v);
            }
            if ((typeof args[0]) === 'object') {
              console.group("%cconsole from worker", consoleStyle);
              console[data.debug].apply(console, args);
              return console.groupEnd("%cconsole from worker", consoleStyle);
            } else {
              if ($.inArray(data.debug, supportSyntaxList) >= 0) {
                args[0] = consoleStylePrefix + args[0];
                args.push(consoleStyle);
              }
              return console[data.debug].apply(console, args);
            }
          }
        }, false);
        inlineWorker.addEventListener('error', function(event) {
          console.group("error from worker");
          console.error(event);
          return console.groupEnd("error from worker");
        }, false);
        return inlineWorker;
      };

      storeSharedWorkerURL = function(name, url) {
        return localStorage.setItem(name, url);
      };

      getSharedWorkerURL = function(name) {
        return localStorage.getItem(name);
      };

      options = {
        enableConsole: true,
        enableRequire: true
      };

      function WorkerUtil(opts) {}

      WorkerUtil.prototype.createInlineWorker = function(content, opts) {
        var blobWorker, blobWorker_url, inlineWorker, key, val;

        for (key in options) {
          val = options[key];
          opts[key] = !(opts[key] && options[key]) ? opts[key] : options[key];
        }
        content = append_console(content, opts);
        blobWorker = new Blob([content], {
          type: 'application/javascript'
        });
        blobWorker_url = URL.createObjectURL(blobWorker);
        inlineWorker = new Worker(blobWorker_url);
        prepareInlineDebug(inlineWorker, opts);
        return inlineWorker;
      };

      WorkerUtil.prototype.createInlineSharedWorker = function(content, name) {
        var blobWorker, blobWorker_url, inlineURL, inlineWorker;

        inlineURL = getSharedWorkerURL(name);
        if (inlineURL) {
          blobWorker_url = inlineURL;
        } else {
          blobWorker = new Blob([content], {
            type: 'application/javascript'
          });
          blobWorker_url = URL.createObjectURL(blobWorker);
          storeSharedWorkerURL(name, blobWorker_url);
        }
        inlineWorker = new SharedWorker(blobWorker_url, name);
        prepareInlineDebug(inlineWorker);
        URL.revokeObjectURL(blobWorker_url);
        return inlineWorker;
      };

      return WorkerUtil;

    })();
    return new WorkerUtil();
  });

}).call(this);

(function() {
  define('WorkerD',['require','./worker_util'],function(require) {
    var WorkerD, worker_util;

    worker_util = require('./worker_util');
    return WorkerD = (function() {
      /*
      options =
        #default is true
        enableConsole: true
        enableRequire: true
      */

      var onMessage;

      onMessage = function(event) {
        var data;

        data = event.data;
        if (typeof data === 'object' && (data.msgId != null)) {
          return this.o.trigger(data.msgId, [data[data.msgId], event]);
        }
      };

      function WorkerD(inlineWorker_js, opts) {
        var _this = this;

        this.opts = opts != null ? opts : {};
        this.worker = worker_util.createInlineWorker(inlineWorker_js, this.opts);
        this.worker.addEventListener('message', function() {
          return onMessage.apply(_this, arguments);
        });
        this.o = $({});
      }

      WorkerD.prototype.send = function(id, msgData, options) {
        var msg;

        msg = {
          msgId: id,
          msgData: msgData
        };
        return this.worker.postMessage.apply(this.worker, [msg, options]);
      };

      WorkerD.prototype.on = function(id, handle) {
        return this.o.on(id, handle);
      };

      WorkerD.prototype.terminate = function() {
        this.worker.terminate();
        return this.o = null;
      };

      return WorkerD;

    })();
  });

}).call(this);
