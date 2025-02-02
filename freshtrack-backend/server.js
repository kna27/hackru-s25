require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

// GenAi
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
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
  const { name, expiration } = req.body;
  const newItem = new Item({ name, expiration });
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

app.get("/getImage", async (req, res) => {
  try {
    // Get the recipe from the query parameter or body
    const { recipe } = req.query; // Assuming recipe is passed as a query parameter
    if (!recipe) {
      return res.status(400).json({ error: "Recipe is required" });
    }
    // Generate the image based on the recipe
    const image = await generateImage(recipe);
    res.json({ image });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ error: "Error generating image" });
  }
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

const storage = multer.memoryStorage();
const upload = multer({ storage });

const saveBufferToFile = (buffer, fileName) => {
  const tempFilePath = path.join(__dirname, "uploads", fileName);
  fs.writeFileSync(tempFilePath, buffer);
  return tempFilePath;
};

app.post("/getExpiration", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: "No file uploaded" });

    // Save buffer to temporary file
    const tempFilePath = saveBufferToFile(req.file.buffer, "expiration.jpg");

    // Upload to Google AI
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: req.file.mimetype,
      displayName: "Expiration Image",
    });

    console.log(`Uploaded file as: ${uploadResult.file.uri}`);

    // Generate expiration date
    const result = await model.generateContent([
      "What is the expiration date in this image? Return only the date in yyyy-mm-dd format. Assume that the product has been purchased recently.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    // Delete temporary file
    fs.unlinkSync(tempFilePath);

    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("❌ Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

/**
 * Uploads an image and extracts the product name.
 */
app.post("/getName", upload.single("image"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) return res.status(400).json({ error: "No file uploaded" });

    // Save buffer to temporary file
    const tempFilePath = saveBufferToFile(req.file.buffer, "product.jpg");

    // Upload to Google AI
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: req.file.mimetype,
      displayName: "Product Image",
    });

    console.log(`Uploaded file as: ${uploadResult.file.uri}`);

    // Generate product name
    const result = await model.generateContent([
      "What is the name of the product in the uploaded file? Only return the name of the product, including the brand if visible.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    // Delete temporary file
    fs.unlinkSync(tempFilePath);

    res.json({ text: result.response.text() });
  } catch (error) {
    console.error("❌ Error processing image:", error);
    res.status(500).json({ error: "Failed to process image" });
  }
});

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

async function generateImage(recipe){
  response = client.models.generate_image(
    model='imagen-3.0-generate-002',
    prompt="Generate an image of the food named in the following recipe: " + recipe,
    config=types.GenerateImageConfig(
        negative_prompt= 'people',
        number_of_images= 1,
        include_rai_reason= True,
        output_mime_type= 'image/jpeg'
    )
)
  return response.generated_images[0].image;
}



// Start Server
const PORT = 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
