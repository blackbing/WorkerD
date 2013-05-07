require.config
  paths:
    jquery: "../components/jquery/jquery"
    bootstrap: "vendor/bootstrap"
    text: "../components/text/text"

  shim:
    bootstrap:
      deps: [ "jquery" ]
      exports: "jquery"

require [
], () ->

  masterEditor = ace.edit('masterEditor')
  workerEditor = ace.edit('workerEditor')
  [masterEditor, workerEditor].forEach( (editor)->
    editor.setTheme('ace/theme/tomorrow_night')
    editor.setShowPrintMargin(false)
    editor.getSession().setMode("ace/mode/javascript")
  )
