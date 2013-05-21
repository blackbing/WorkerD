(function() {
  define(function(require) {
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

        console.log('append_console', opts);
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
