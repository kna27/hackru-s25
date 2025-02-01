require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// Start Server
const PORT = 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
