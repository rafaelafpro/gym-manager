// Importação "Require" das dependencias
const express = require('express');
const nunjucks = require('nunjucks');
const routes = require("./routes");
const methodOverride = require("method-override");

// criacao do servidor com express function
const server = express();

// declaracao de middlewares
server.use(express.urlencoded({extended: true}));
server.use(express.static('public'));
server.use(methodOverride('_method'));
server.use(routes);

// declaracao da view engine do nunjucks
server.set("view engine", "njk");

// configuração nunjucks
nunjucks.configure("src/app/views", {
    express: server,
    noCache: true,
    autoescape: false
})


// porta
server.listen(5000, function(){
    console.log("server is running");
});


