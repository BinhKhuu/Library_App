# Library_App
Simple Library application in Express and PUG/Jade
#### Requirments:
  1. IE > 8 or any other web brower
  2. Node 
  3. Node package manager

#### DB install
  1. setup mongo lab URI or set it manually in /app.js
    set up URI locally: export MONGOLAB_URI='mongodb://<username>:<password>@ds147469.mlab.com:47469/local_library'
    
#### Install
  1. Clone the repository or download
  2. npm rm -rf node_modules
  3. npm install
  4. run npm start
  5. PORT=4000 npm run start
    5.1 to run in dev mode: PORT=4000 npm run devstart
  6. go to local host:3000

#### About
Local Library app allows you to add, update and delete authors, books and bookinstances. 
An author may only be deleted if there are no books that belong to that author.
Books can only be deleted if there are no bookinstances that belong it.

*Author: Binh Khuu
