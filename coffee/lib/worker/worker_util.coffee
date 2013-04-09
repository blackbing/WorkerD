define (require)->
  worker_console_js = require 'text!./worker_console.js'
  worker_event_js = require 'text!./worker_event.js'

  requirejsPath = 'http://requirejs.org/docs/release/2.1.5/minified/require.js'
  importRequirejs = "importScripts('#{requirejsPath}');"

  URL = window.URL or window.webkitURL
  class WorkerUtil
    #private method
    append_console = (content, opts)->

      jsContent = []
      if opts.enableRequire
        jsContent.push(importRequirejs)

      if opts.enableDebug
        jsContent.push(worker_console_js)

      jsContent.push(worker_event_js)
      jsContent.push(content)
      jsContent.join("\n")

    prepareInlineDebug = (inlineWorker, opts)->
      inlineWorker.addEventListener('message', (event)=>
        if not opts.enableDebug
          return false
        data = event.data
        if typeof data is 'object' and data.debug?
          console.group "console from worker"
          args = _.toArray(data.args)
          console[data.debug].apply(console, args)
          console.groupEnd "console from worker"
      , false)

      #make sure if you want to hadle error event by yourself
      inlineWorker.addEventListener('error', (event)->
        console.error(event)
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

      options = _.extend(options, opts)
      @options = options
      #do something

    createInlineWorker: (content, opts)->
      opts = _.extend(options, opts)
      content = append_console(content, opts)
      blobWorker = new Blob([content], {type:'application/javascript'})
      blobWorker_url = URL.createObjectURL(blobWorker)
      inlineWorker = new Worker(blobWorker_url)

      prepareInlineDebug(inlineWorker, opts)
      #revokeObjectURL after creating it
      URL.revokeObjectURL(blobWorker_url)
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
