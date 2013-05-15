define (require)->
  worker_util  = require './worker_util'

  class WorkerD

    onMessage = (event)->
      data = event.data
      if typeof data is 'object' and data.msgId?
        @o.trigger(data.msgId, [data[data.msgId], event])

    constructor: (inlineWorker_js, opts)->
      @worker = worker_util.createInlineWorker(inlineWorker_js, opts)
      @worker.addEventListener('message', =>
        onMessage.apply(@, arguments)
      )
      @o = $({})

    send: (id, msgData, options)->
      msg =
        msgId: id
        msgData: msgData

      @worker.postMessage.apply(@worker, [msg, options])

    on: (id, handle)->
      @o.on(id, handle)

    terminate: ()->
      @worker.terminate()
      @o = null










