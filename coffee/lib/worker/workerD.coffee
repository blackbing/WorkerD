define (require)->
  worker_util = require './worker_util'

  class WorkerD
    dfr = $.Deferred()

    o = $({})

    onMessage = (event)->
      data = event.data
      if typeof data is 'object' and data.msgId?
        o.trigger(data.msgId, [data[data.msgId], event])

    constructor: (inlineWorker_js, opts)->
      @worker = worker_util.createInlineWorker(inlineWorker_js)
      @worker.addEventListener('message', onMessage)

    send: ()->
      @worker.postMessage.apply(@worker, arguments)

    on: (id, handle)->
      o.on.apply(o, arguments)









