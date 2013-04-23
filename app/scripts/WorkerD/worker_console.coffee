@postDebugMessage = (type, args)->
  self.postMessage(
    debug: type
    args: args
  )

console_attr = [
  'debug'
  'error'
  'info'
  'log'
  'warn'
  'group'
  'groupCollapsed'
  'groupEnd'
  'dir'
  'trace'
  'assert'
  'count'
  'markTimeline'
  'profile'
  'profileEnd'
  'time'
  'timeEnd'
  'timeStamp'
]

self.console = {}
for attr in console_attr
  self.console[attr] = do (attr)=>
    ()=>
      @postDebugMessage(attr, arguments)
