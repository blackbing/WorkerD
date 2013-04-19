// Generated by CoffeeScript 1.6.2
(function() {
  define(function(require) {
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
