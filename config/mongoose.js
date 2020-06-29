const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node_authTest');

const db = mongoose.connection;

db.on('error', console.error.bind(console,"Error conncecting to database"));

db.once('open', function(){
    console.log("Connceted to database:: MongoDB");
})

module.exports = db; 