# GameTemplate
Template for GameCenter.  
A fake server is used to simulate GameCenter.  
You can fake websocket message using console.

## Environment
Install below library/package globally before developing.
- node
- bower
- webpack

## Setup
Install node package for develop environment
```
npm install --only=dev
```

Install bower package
```
bower install
```

Run the test server with node.js
```
node server.js
```

Run webpack and make it work automatically on any modification
```
webpack -d --watch
```
