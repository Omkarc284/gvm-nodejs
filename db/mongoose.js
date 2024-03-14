// const mongoose = require('mongoose')
// require('dotenv').config()
// const uri = process.env.MONGODB_URI
// mongoose.set('strictQuery', false)
// mongoose.connect(uri,{}).catch(error => console.log("Database connection failed :", error))

const mongoose = require('mongoose');
const uri = "mongodb+srv://omkarc284:<password>@cluster0.dxwb7jq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
run().catch(console.dir);