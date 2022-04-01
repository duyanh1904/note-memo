const express = require('express')
require('core-js/stable');
const app = express()

  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://anhnkd:anhnkd190497@cluster0.v105k.mongodb.net/dev01?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  client.connect(err => {
    const collection = client.db("dev01").collection("movies");
    // perform actions on the collection object
    client.close();
  });

  app.get('/', (request, response) => {
      response.send('<h1>makeHard For learn node</h1>')
  })

  app.get('/api/movies', (request, response) => {
    response.json(client)
  })

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
