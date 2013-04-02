define (require)->

  #sharedworker_js = require 'text!./sharedWorker.js'
  log = require './lib/log'
  WorkerD = require './lib/worker/workerD'
  inlineWorker_js = require 'text!./inlineWorker.js'

  loading = ->
    $('.loading').show()

  loaded = ->
    $('.loading').hide()
    log "<hr>"

  countSum = (max)->
    sum = cnt = 0
    while(cnt<=max)
      sum += cnt++
    sum

  $('#sum_without_worker').on('click', ->
    loading()
    ts = +(new Date())
    log 'sum without Worker start....'

    sum = countSum(1000000000)

    log "getSum: #{sum}"
    log 'sum without worker end'
    ts = +(new Date()) - ts
    log "time spend: #{ts} ms"
    loaded()
  )

  $('#sum_without_worker_delay').on('click', ->
    loading()
    ts = +(new Date())
    log 'sum without Worker start....'

    setTimeout(->

      sum = countSum(1000000000)


      log "getSum: #{sum}"
      log 'sum without worker end'
      ts = +(new Date()) - ts
      log "time spend: #{ts} ms"
      loaded()
    , 200)
  )

  $('#sum_with_worker').on('click', ->
    loading()
    ts = +(new Date())
    worker = new WorkerD(inlineWorker_js)
    #worker.send('getSum', {start:0, end: 10})
    worker.send('test')
    log 'sum with worker start'
    worker.on('getSum', (event, data)->
      log "getSum: #{data}"
      log 'sum with worker end'
      ts = +(new Date()) - ts
      log "time spend: #{ts} ms"
      loaded()
    )
  )

