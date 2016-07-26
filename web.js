var gzippo = require('gzippo');
var express = require('express');
var morgan = require('morgan');
var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname));

app.get('/', function(req, res){
  res.redirect('app/index.html');
});

app.listen(process.env.PORT || 5000);
console.log('Server started @ PORT:5000');
