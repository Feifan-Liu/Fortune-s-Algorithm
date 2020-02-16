const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');



const PORT = 3000;
const app = express();

app.use(express.static(path.join(__dirname, './')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, './index.html'));
})

app.listen(PORT, function() {
  console.log('Server listening on PORT '+PORT);
});