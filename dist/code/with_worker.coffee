
  $('#sum_with_worker').on('click', ->
    loading()
    worker = new WorkerD(inlineWorker_js)
    worker.send('getSum', sumMax)
    worker.on('gotSum', (event, data)->
      log "gotSum: #{data}"
      loaded()
    )
  )
