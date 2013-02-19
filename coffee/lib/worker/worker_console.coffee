@postDebugMessage = (type, args)->
  postMessage(
    debug: type
    args: args
  )

console_attr = [
  'debug'
  'error'
  'info'
  'log'
  'warn'
  'dir'
  'dirxml'
  'trace'
  'assert'
  'count'
  'markTimeline'
  'profile'
  'profileEnd'
  'time'
  'timeEnd'
  'timeStamp'
  'group'
  'groupCollapsed'
  'groupEnd'
]

@console = {}
for attr in console_attr
  @console[attr] = do (attr)=>
    ()=>
      @postDebugMessage(attr, arguments)
