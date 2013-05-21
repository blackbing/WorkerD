(function() {
  define(function(require) {
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
