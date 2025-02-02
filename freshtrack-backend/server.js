require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// GenAi
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "expirations",
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

// Define Item Schema
const ItemSchema = new mongoose.Schema(
  {
    name: String,
    expiration: Date,
  },
  { collection: "items" }
);
const Item = mongoose.model("items", ItemSchema);

// Routes
app.get("/items", async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

app.post("/items", async (req, res) => {
  const { name, days } = req.body;
  const newItem = new Item({ name, days });
  await newItem.save();
  res.json(newItem);
});

app.delete("/items/:id", async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted" });
});

app.get("/getRecipe", async (req, res) => {
  items = await getExpiringIn(7);
  const aaa = await generateRecipe(items);
  res.json(aaa);
});

async function generateText(prompt) {
  const result = await model.generateContent(prompt);
  return result;
}

async function getExpiringIn(days) {
  const now = new Date();
  const future = new Date(now);
  future.setDate(future.getDate() + days);
  return await Item.find({ expiration: { $lte: future } });
}

async function getExpiration(imageURL){
  const uploadResult = await fileManager.uploadFile(
    imageURL,
    {
      mimeType: "image/jpeg",
      displayName: "Expiration Image",
    },
  );

  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
  );

  const result = await model.generateContent([
    "What is the expiration date as seen in the image. Be careful, as the expiration date on the image may not be in standard mm/dd/yyyy format. Assume that the product has been purchaseed recently. In your response, only put the correct expiration date in the following format: yyyy-mm-dd",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);
}

async function getName(imageURL){
  const uploadResult = await fileManager.uploadFile(
    imageURL,
    {
      mimeType: "image/jpeg",
      displayName: "Product Image",
    },
  );

  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`,
  );

  const result = await model.generateContent([
    "What is the name of the product in the uploaded file. Only return the name of the product as seen in the image. Write the name of the brand if visible as well. ",
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
  ]);
}


async function generateRecipe(items){
  itemString = "";
  for (i = 0; i < items.length; i++) {
    itemString = itemString + items[i] + ", ";
  }

  const response = await generateText(
    "Using the following ingredients, generate a recipe with simple instructions. Make the recipe very short and simple. If you need any other basic cooking ingredients, you may use those as well, but make sure to use all of the ingredients listed. " +
      itemString
  );
  return response.response.text();
}

// Start Server
const PORT = 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
