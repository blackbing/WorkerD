  countSum = (max)->
    sum = cnt = 0
    while(cnt<=max)
      sum += cnt++
    sum

  $('#sum_without_worker_delay').on('click', ->
    loading()
    setTimeout(->
      sum = countSum(sumMax)
      log "getSum: #{sum}"
      loaded()
    , 200)
  )
