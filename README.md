#WorkerD

WorkerD is a small library to use Web Worker more easily. In original Web Worker,
there are some troublesome of using it. It is

* Dependency
* Hardly debugging without console
* Hardly to setup a Worker

##Introduction
WorkerD has some features of it.

1. Support console.everything(well, almost).
2. Support requirejs
3. Use event more easily(your don't need to bind event again and again....)

#Usage

## bower
It is the easist way to start to use.

    bower install WorkerD

## Others

1. Download the latest [WorkerD](https://raw.github.com/blackbing/WorkerD/master/release/WorkerD.js)
2. Add to your project
3. ```require("lib/WorkerD")```

#Basic Example

###In app.coffee
``` coffeescript
# add .js for include the file as a text file
inlineWorker_js = require "text!./workerScript/inlineWorker.js"
# require WorkerD
WorkerD = require("WorkerD/WorkerD")
# new WorkerD
worker = new WorkerD(inlineWorker_js ###js content as String###,
  enableRequire: true #enable require, default is true
  enableDebug: true #enable console, default is true
)
# use "send" function to send message
# send task1 to worker with some data
worker.send('task1' ###task id(string)###, data ###it can be anything###)
# use "on" function to process data from worker with specify taskId
worker.on('task1_done' ###task id(string)###, (event, data)->
  console.log 'task1_done and receieved data', data 
)
```

###In inlineWorker.js

``` coffeescript
# use "on" function to process data on the specify task id
@on "task1", (somthing) ->
  console.time('task1') #you can use console.time in Worker script
  console.log 'task1', 'start'  #you can use console.log in Worker script
  # dosomething
  self.send('task1_done' ###task id(string)###, data ###it can be anything###)
```


#For Development or Contribute

###Dependency

If you want to run it on your machine, please make sure you have installed this.

* [Yeoman](http://yeoman.io/)

Following the steps to setup environment:

1. ```git clone git@github.com:blackbing/WorkerD.git```
2. ```cd WorkerD```
3. ```yo webapp```
4. Would you like to include Twitter Bootstrap for Sass? (Y/n) ```Y```
5. Would you like to include RequireJS (for AMD support)? (Y/n) ```Y```
6. **Do Not overwrite any other conflict file**
    1. Overwrite Gruntfile.js? (enter "h" for help) [Ynaqdh]? (h) ```n```
    2. Overwrite package.json? (enter "h" for help) [Ynaqdh]? (h) ```n```
    3. Overwrite component.json? (enter "h" for help) [Ynaqdh]? (h) ```n```
    4. ...

If you didin't see any error message. It's all done.

####Run server

    grunt server

###Build WorkerD.js

    grunt build-WorkerD
    
It will build on the path ```release/WorkerD.js```
