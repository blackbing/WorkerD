require.config
  paths:
    jquery: "../components/jquery/jquery"
    bootstrap: "vendor/bootstrap"
    text: "../components/text/text"

  shim:
    jquery:
      exports: "$"
    bootstrap:
      deps: [ "jquery" ]
      exports: "$"

require [
  "WorkerD/WorkerD"
  "jquery"
  "bootstrap"
], (WorkerD) ->

  masterEditor = ace.edit('masterEditor')
  workerEditor = ace.edit('workerEditor')
  [masterEditor, workerEditor].forEach( (editor)->
    editor.setTheme('ace/theme/tomorrow_night')
    editor.setShowPrintMargin(false)
    editor.getSession().setMode("ace/mode/javascript")
  )

  #exports WorkerD
  window.WorkerD = WorkerD
  $('#run').click(->
    workerScript = workerEditor.getValue()
    #workerScriptBlob = new Blob([workerScript], {type:'text/plain'})
    #workerScriptUrl = URL.createObjectURL(workerScriptBlob)

    #console.log workerScriptUrl

    masterScript = masterEditor.getValue()
    window['WORKER_CONTENT'] = workerScript
    masterScriptBlob = new Blob([masterScript], {type:'application/javascript'})
    masterScriptUrl = URL.createObjectURL(masterScriptBlob)


    s = document.createElement('script')
    s.src = masterScriptUrl

    head = document.getElementsByTagName('head')[0]
    head.insertBefore(s, head.firstChild)

  )




