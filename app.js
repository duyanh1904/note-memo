const express = require('express')
const app = express()

let people = [
    {
      name: "Hannah Rickard",
      number: "06-51-99-56-83",
      id: 1
    },
    {
      name: "Soongj jonasd",
      number: "10987654",
      id: 2
    },
    {
      name: "Courtney Martinez",
      number: "3691215",
      id: 3
    }
  ]
  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = "mongodb+srv://anhnkd:190497@cluster0.v105k.mongodb.net/dev01?retryWrites=true&w=majority";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
  });


  app.get('/', (request, response) => {
      response.send('<h1>makeHard For learn node</h1>')
  })

  app.get('/api/people', (request, response) => {
      response.json(people)
  })

  app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
  });
