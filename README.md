### A Blog Post that using Mongoose, Express, and Node.js

###### * command + shift + v for preview

###### 1. start with ```npm init -y``` to install package.json

###### 2. install all depandencies```npm i express mongoose ejs```  : ```express``` allos us to create the server, ```mongoose``` is for database, and ```ejs``` is for different views.

###### 3. ```npm i --save--dev nodemon``` nodemon allows us to refresh the page when we make any changes.

###### 4. in ```package.json```, rewrite to
```
"scripts": {
    "devStart": "nodemon server.js"},
```    
##### note: 

###### 1. to get the current date, in ```index.ejs``` 
```
 <%= article.createdAt.toLocaleDateString() %>
 // toLocaleDareString() helps you to get the current date instead of long useless date info
```
###### 2. to hook up to database:
 in ```server.js```
```
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/blog', { useNewUrlParser: true, useUnifiedTopology: true })
```

