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

#For Development or Contribute

###Dependency

If you want to run it on your machine, please make sure you have installed this.

* [Yeoman](http://yeoman.io/)

1. ```git clone git@github.com:blackbing/WorkerD.git```
2. ```cd WorkerD```
3. ```yo webapp```
4. Would you like to include Twitter Bootstrap for Sass? (Y/n) ```Y```
5. Would you like to include RequireJS (for AMD support)? (Y/n) ```Y```
6. Do Not overwrite any conflict file
7. Overwrite Gruntfile.js? (enter "h" for help) [Ynaqdh]? (h) ```n```

If you didin't see any error message. It's all done.

####Run server

    grunt server

###Build WorkerD.js

    grunt build-WorkerD
    
It will build on the path ```release/WorkerD.js```
