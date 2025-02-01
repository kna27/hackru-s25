require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// GenAi
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  dbName: 'expirations'
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB Connection Error:', err));

// Define Item Schema
const ItemSchema = new mongoose.Schema({
  name: String,
  expiration: Date,
}, { collection: 'items' });
const Item = mongoose.model('items', ItemSchema);

// Routes
app.get('/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post('/items', async (req, res) => {
  const { name, days } = req.body;
  const newItem = new Item({ name, days });
  await newItem.save();
  res.json(newItem);
});

app.delete('/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Item deleted' });
});

app.get('/test', async (req, res) => {
  items = ["Apples", "Butter"]
  const aaa = await generateRecipe(items)
  res.json(aaa);
});

async function generateText(prompt) {
  const result = await model.generateContent(prompt);
  return result;
}



async function generateRecipe(items){
  itemString = "";
  for(i = 0; i < items.length; i++){
    itemString = itemString + items[i] + ", ";
  }
  
  const response = await generateText("Using the following ingredients, generate a recipe with instructions. If you need any other basic cooking ingredients, you may use those as well, but make sure to use all of the ingredients listed. " + itemString);
    return (response.response.text());
}

// Start Server
const PORT = 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
