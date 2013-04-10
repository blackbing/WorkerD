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

##Development

###Dependency

If you want to run it on your machine, please make sure you have installed this.

* CoffeeScript
* compass
* guard

If you have bundle, you can just type

    bundle install

to install these tools.

###Compile CoffeeScript and Watch worker script

watch file and compile when you are developing. It will compile coffee, scss and
worker your write.

    ./watch.sh

###Run Server
You can run a simple server if you need it.

    ./runSimpleServer.sh

and open

    http://localhost:8888

###Build
Based on [require/r.js](http://requirejs.org/docs/optimization.html)

    ./build.sh
============
