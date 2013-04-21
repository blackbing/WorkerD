
// Generated by CoffeeScript 1.6.2
(function() {
  define('lib/log',['require'],function(require) {
    return function(log) {
      return $('#log').prepend("<p>" + log + "</p>");
    };
  });

}).call(this);

/**
 * @license RequireJS text 2.0.3 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require: false, XMLHttpRequest: false, ActiveXObject: false,
  define: false, window: false, process: false, Packages: false,
  java: false, location: false */

define('text',['module'], function (module) {
    

    var text, fs,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = [],
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.3',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var strip = false, index = name.indexOf("."),
                modName = name.substring(0, index),
                ext = name.substring(index + 1, name.length);

            index = ext.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = ext.substring(index + 1, ext.length);
                strip = strip === "strip";
                ext = ext.substring(0, index);
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                nonStripName = parsed.moduleName + '.' + parsed.ext,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + '.' +
                                     parsed.ext) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node)) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback) {
            var file = fs.readFileSync(url, 'utf8');
            //Remove BOM (Byte Mark Order) from utf8 files if it is there.
            if (file.indexOf('\uFEFF') === 0) {
                file = file.substring(1);
            }
            callback(file);
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback) {
            var xhr = text.createXhr();
            xhr.open('GET', url, true);

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        errback(err);
                    } else {
                        callback(xhr.responseText);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                stringBuffer.append(line);

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    }

    return text;
});

define('text!lib/WorkerD/worker_console.js',[],function () { return '// Generated by CoffeeScript 1.6.2\n(function() {\n  var attr, console_attr, _i, _len,\n    _this = this;\n\n  this.postDebugMessage = function(type, args) {\n    return postMessage({\n      debug: type,\n      args: args\n    });\n  };\n\n  console_attr = [\'debug\', \'error\', \'info\', \'log\', \'warn\', \'dir\', \'dirxml\', \'trace\', \'assert\', \'count\', \'markTimeline\', \'profile\', \'profileEnd\', \'time\', \'timeEnd\', \'timeStamp\', \'group\', \'groupCollapsed\', \'groupEnd\'];\n\n  this.console = {};\n\n  for (_i = 0, _len = console_attr.length; _i < _len; _i++) {\n    attr = console_attr[_i];\n    this.console[attr] = (function(attr) {\n      return function() {\n        return _this.postDebugMessage(attr, arguments);\n      };\n    })(attr);\n  }\n\n}).call(this);\n';});

define('text!lib/WorkerD/worker_event.js',[],function () { return '// Generated by CoffeeScript 1.6.2\n(function() {\n  var Callbacks,\n    _this = this;\n\n  Callbacks = {};\n\n  this.send = function(id, data) {\n    var res;\n\n    res = {};\n    res.msgId = id;\n    res[id] = data;\n    return self.postMessage(res);\n  };\n\n  this.on = function(id, callback) {\n    return Callbacks[id] = callback;\n  };\n\n  this.off = function(id) {\n    return delete Callbacks[id];\n  };\n\n  this.addEventListener("message", function(event) {\n    var data, id, msgData;\n\n    data = event.data;\n    if ((data.msgId != null) && (data.msgData != null)) {\n      id = data.msgId;\n      msgData = data.msgData;\n      if (Callbacks[id]) {\n        return Callbacks[id](msgData);\n      }\n    }\n  });\n\n}).call(this);\n';});

// Generated by CoffeeScript 1.6.2
(function() {
  define('lib/WorkerD/worker_util',['require','text!./worker_console.js','text!./worker_event.js'],function(require) {
    var URL, WorkerUtil, importRequirejs, requirejsPath, worker_console_js, worker_event_js;

    worker_console_js = require('text!./worker_console.js');
    worker_event_js = require('text!./worker_event.js');
    requirejsPath = 'http://requirejs.org/docs/release/2.1.5/minified/require.js';
    importRequirejs = "importScripts('" + requirejsPath + "');";
    URL = window.URL || window.webkitURL;
    WorkerUtil = (function() {
      var append_console, consoleStyle, getSharedWorkerURL, options, prepareInlineDebug, storeSharedWorkerURL;

      consoleStyle = 'background: #000; color: #FFF;';

      append_console = function(content, opts) {
        var jsContent;

        jsContent = [];
        if (opts.enableRequire) {
          console.info('enableRequire');
          jsContent.push(importRequirejs);
        }
        if (opts.enableDebug) {
          console.info('enableDebug');
          jsContent.push(worker_console_js);
        }
        jsContent.push(worker_event_js);
        jsContent.push(content);
        return jsContent.join("\n");
      };

      prepareInlineDebug = function(inlineWorker, opts) {
        var _this = this;

        inlineWorker.addEventListener('message', function(event) {
          var args, data;

          if (!opts.enableDebug) {
            return false;
          }
          data = event.data;
          if (typeof data === 'object' && (data.debug != null)) {
            console.group("%c console from worker", consoleStyle);
            args = _.toArray(data.args);
            console[data.debug].apply(console, args);
            return console.groupEnd("%c console from worker", consoleStyle);
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
        enableDebug: true,
        enableRequire: true
      };

      function WorkerUtil(opts) {
        options = _.extend(options, opts);
        this.options = options;
      }

      WorkerUtil.prototype.createInlineWorker = function(content, opts) {
        var blobWorker, blobWorker_url, inlineWorker;

        opts = _.extend(options, opts);
        content = append_console(content, opts);
        blobWorker = new Blob([content], {
          type: 'application/javascript'
        });
        blobWorker_url = URL.createObjectURL(blobWorker);
        inlineWorker = new Worker(blobWorker_url);
        prepareInlineDebug(inlineWorker, opts);
        URL.revokeObjectURL(blobWorker_url);
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

// Generated by CoffeeScript 1.6.2
(function() {
  define('lib/WorkerD/WorkerD',['require','./worker_util'],function(require) {
    var WorkerD, worker_util;

    worker_util = require('./worker_util');
    return WorkerD = (function() {
      var dfr, o, onMessage;

      dfr = $.Deferred();

      o = $({});

      onMessage = function(event) {
        var data;

        data = event.data;
        if (typeof data === 'object' && (data.msgId != null)) {
          return o.trigger(data.msgId, [data[data.msgId], event]);
        }
      };

      function WorkerD(inlineWorker_js, opts) {
        this.worker = worker_util.createInlineWorker(inlineWorker_js, opts);
        this.worker.addEventListener('message', onMessage);
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
        return o.on.apply(o, arguments);
      };

      WorkerD.prototype.terminate = function() {
        return this.worker.terminate();
      };

      return WorkerD;

    })();
  });

}).call(this);

define('text!inlineWorker-built.js',[],function () { return '\n// Generated by CoffeeScript 1.6.2\n(function() {\n  define(\'test-car\',[\'require\'],function(require) {\n    var Car;\n\n    return Car = (function() {\n      function Car(color) {\n        this.color = color;\n      }\n\n      Car.prototype.get = function(attr) {\n        if (this[attr]) {\n          return this[attr];\n        }\n      };\n\n      return Car;\n\n    })();\n  });\n\n}).call(this);\n\n// Generated by CoffeeScript 1.6.2\n(function() {\n  console.log(\'inlineWorker loaded\');\n\n  require(["require", "module", "test-car"], function(require, module, Car) {\n    var car;\n\n    car = new Car(\'red\');\n    return console.log(car);\n  });\n\n  this.on("getSum", function(max) {\n    var cnt, sum;\n\n    console.time(\'getSum\');\n    console.log(\'getSum\', max);\n    sum = cnt = 0;\n    while (cnt <= max) {\n      sum += cnt++;\n    }\n    console.log(\'sum=\', sum);\n    self.send(\'getSum\', sum);\n    console.log(\'inlineWorker send message\');\n    return console.timeEnd(\'getSum\');\n  });\n\n}).call(this);\n\ndefine("inlineWorker", function(){});\n';});

// Generated by CoffeeScript 1.6.2
(function() {
  define('main',['require','./lib/log','./lib/WorkerD/WorkerD','text!./inlineWorker-built.js'],function(require) {
    var WorkerD, countSum, inlineWorker_js, loaded, loading, log, sumMax;

    log = require('./lib/log');
    WorkerD = require('./lib/WorkerD/WorkerD');
    inlineWorker_js = require('text!./inlineWorker-built.js');
    sumMax = 1000000000;
    loading = function() {
      return $('.loading').show();
    };
    loaded = function() {
      $('.loading').hide();
      return log("<hr>");
    };
    countSum = function(max) {
      var cnt, sum;

      sum = cnt = 0;
      while (cnt <= max) {
        sum += cnt++;
      }
      return sum;
    };
    $('#sum_without_worker').on('click', function() {
      var sum, ts;

      loading();
      ts = +(new Date());
      log('sum without Worker start....');
      sum = countSum(sumMax);
      log("getSum: " + sum);
      log('sum without worker end');
      ts = +(new Date()) - ts;
      log("time spend: " + ts + " ms");
      return loaded();
    });
    $('#sum_without_worker_delay').on('click', function() {
      var ts;

      loading();
      ts = +(new Date());
      log('sum without Worker start....');
      return setTimeout(function() {
        var sum;

        sum = countSum(sumMax);
        log("getSum: " + sum);
        log('sum without worker end');
        ts = +(new Date()) - ts;
        log("time spend: " + ts + " ms");
        return loaded();
      }, 200);
    });
    return $('#sum_with_worker').on('click', function() {
      var ts, worker;

      loading();
      ts = +(new Date());
      worker = new WorkerD(inlineWorker_js, {
        enableRequire: true,
        enableDebug: true
      });
      worker.send('getSum', sumMax);
      log('sum with worker start');
      return worker.on('getSum', function(event, data) {
        log("getSum: " + data);
        log('sum with worker end');
        ts = +(new Date()) - ts;
        log("time spend: " + ts + " ms");
        return loaded();
      });
    });
  });

}).call(this);