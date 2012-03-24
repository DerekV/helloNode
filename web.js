var express = require('express');

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
    var text = 'Hello World!\n';
    text += 'I am running with\n';
    text += process.env.HOME;
    response.send(text);
});


app.get('/egg.html', function(request, response) {
    response.send('happy easter');
});

var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});