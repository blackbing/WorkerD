define (require)->

  sharedworker_js = require 'text!./sharedWorker.js'
  worker_util = require './lib/worker/worker_util'


  class ChatRoom
    constructor: ->
      @worker = worker_util.createInlineSharedWorker(sharedworker_js, 'chatroom')
      @worker.port.addEventListener('message', @onMessage, false)
      console.log @worker
      console.log 'initial ChatRoom'
      @worker.port.start()
      #@worker.port.postMessage('initial postMessage')

    onMessage: (event)->
      console.log event
      data = event.data
      console.log data

  new ChatRoom()



