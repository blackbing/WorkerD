define (require)->
  worker_console_js = require 'text!./worker_console.js'
  worker_event_js = require 'text!./worker_event.js'

  class WorkerUtil
    URL = window.URL or window.webkitURL
    requirejsPath = 'http://requirejs.org/docs/release/2.1.5/minified/require.js'
    importRequirejs = "importScripts('#{requirejsPath}');"
    consoleStyle = 'background: #555454; color: #fff; padding: 2px;'
    supportSyntaxList = [
      'debug'
      'error'
      'info'
      'log'
      'warn'
      'group'
      'groupCollapsed'
      'groupEnd'
    ]
    consoleStylePrefix = '%c'
    #private method
    append_console = (content, opts)->

      jsContent = []
      if opts.enableRequire
        console.info 'enableRequire'
        jsContent.push(importRequirejs)

      if opts.enableDebug
        console.info 'enableDebug'
        jsContent.push(worker_console_js)

      jsContent.push(worker_event_js)
      jsContent.push(content)
      #return
      jsContent.join("\n")

    prepareInlineDebug = (inlineWorker, opts)->
      inlineWorker.addEventListener('message', (event)=>
        if not opts.enableDebug
          return false
        data = event.data
        if typeof data is 'object' and data.debug?
          #console.group "%c console from worker", consoleStyle
          #args = _.toArray(data.args)
          args = []
          for k, v of data.args
            args.push(v)
          #apply style
          if $.inArray( data.debug, supportSyntaxList )>=0
            args[0] = consoleStylePrefix + args[0]
            args.push(consoleStyle)
          console[data.debug].apply(console, args)
      , false)

      #make sure if you want to hadle error event by yourself
      inlineWorker.addEventListener('error', (event)->
        console.group "error from worker"
        console.error(event)
        console.groupEnd "error from worker"
      , false)

      inlineWorker

    storeSharedWorkerURL = (name, url)->
      localStorage.setItem(name, url)

    getSharedWorkerURL = (name)->
      localStorage.getItem(name)

    options =
      #default is true
      enableDebug: true
      enableRequire: true

    #private method END

    constructor: (opts)->

      options = $.extend(options, opts)
      @options = options
      #do something

    createInlineWorker: (content, opts)->
      opts = $.extend(options, opts)
      content = append_console(content, opts)
      blobWorker = new Blob([content], {type:'application/javascript'})
      blobWorker_url = URL.createObjectURL(blobWorker)
      console.log blobWorker_url
      inlineWorker = new Worker(blobWorker_url)

      prepareInlineDebug(inlineWorker, opts)
      #TODO: revokeObjectURL after creating it
      # Firefox will not found if you revoke it right away
      #URL.revokeObjectURL(blobWorker_url)
      inlineWorker

    createInlineSharedWorker: (content, name)->
      ##check if the url has been created
      ##TODO: clear url if SharedWorker session is empty
      inlineURL = getSharedWorkerURL(name)
      if inlineURL
        blobWorker_url = inlineURL
      else
        ##create url by blob url
        #content = append_console(content)
        blobWorker = new Blob([content], {type:'application/javascript'})
        blobWorker_url = URL.createObjectURL(blobWorker)
        ##store it to localStorage
        storeSharedWorkerURL(name, blobWorker_url)

      ##create SharedWorker
      inlineWorker = new SharedWorker(blobWorker_url, name)

      prepareInlineDebug(inlineWorker)
      #revokeObjectURL after creating it
      URL.revokeObjectURL(blobWorker_url)
      inlineWorker


  new WorkerUtil()
