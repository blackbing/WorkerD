define (require) ->
  "use strict"
  WorkerD = require("WorkerD/WorkerD")
  inlineWorker_js = require "text!./workerScript/inlineWorker.build.js"
  log = require './log'
  sandboxView = require "./sandbox"

  $('iframe').each( ->
    $(@).height(@.contentWindow.document.body.scrollHeight)
  )

  sumMax = 1000000000

  loading = ->
    $('.loading').show()

  loaded = ->
    $('.loading').hide()
    log "<hr>"

  $('.loading').on('click', ->
    $(@).hide()
  )

  countSum = (max)->
    sum = cnt = 0
    while(cnt<=max)
      sum += cnt++
    sum

  $('#sum_without_worker').on('click', ->
    loading()
    ts = +(new Date())
    log 'sum without Worker start....'

    sum = countSum(sumMax)

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

      sum = countSum(sumMax)

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
    worker = new WorkerD(inlineWorker_js,
      enableRequire: true
      enableConsole: true
    )
    worker.send('getSum', sumMax)
    #worker.send('test')
    log 'sum with worker start'
    worker.on('gotSum', (event, data)->
      log "gotSum: #{data}"
      log 'sum with worker end'
      ts = +(new Date()) - ts
      log "time spend: #{ts} ms"
      loaded()
    )
  )

  if location.pathname.indexOf('/sandbox.html') > -1
    sandboxView()
