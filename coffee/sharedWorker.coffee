connections = 0 # count active connections
self.addEventListener "connect", ((e) ->
  port = e.ports[0]
  port.addEventListener "message", ((e) ->
    port.postMessage "Welcome to " + e.data + " (On port #" + connections + ")"
  ), false

  #port.start()
  #setInterval(->
  connections++
  port.postMessage "connection ok:"+connections
  #, 1000)
), false
