global.crypto = require('crypto');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Káº¿t ná»‘i MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Da ket noi MongoDB Atlas thanh cong!'))
  .catch(err => console.error('Loi ket noi MongoDB:', err));

// Äá»‹nh nghÄ©a Schema mÃ³n Äƒn
const foodSchema = new mongoose.Schema({
  foodId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  cuisine: { type: String, required: true },
  ingredients: [String],
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: String,
  imageUrl: String
}, { timestamps: true });

const Food = mongoose.model('Food', foodSchema, 'foods');

// 1. Endpoint kiá»ƒm tra sá»©c khá»e
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend dang hoat dong tot!' });
});

// 2. Láº¥y danh sÃ¡ch mÃ³n Äƒn / TÃ¬m kiáº¿m
app.get('/api/foods', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } },
          { cuisine: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const foods = await Food.find(query);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

// 3. Xem chi tiáº¿t 1 mÃ³n Äƒn
app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ message: 'Khong tim thay mon an!' });
    res.json(food);
  } catch (error) {
    res.status(500).json({ message: 'Loi server', error: error.message });
  }
});

// 4. ThÃªm mÃ³n Äƒn má»›i
app.post('/api/foods', async (req, res) => {
  try {
    const { foodId, name, category, cuisine, price, quantity } = req.body;
    if (!foodId || !name || !category || !cuisine || price == null || quantity == null) {
      return res.status(400).json({ message: 'Vui long dien day du thong tin bat buoc!' });
    }

    const existingFood = await Food.findOne({ foodId });
    if (existingFood) {
      return res.status(400).json({ message: 'Ma mon an (foodId) da ton tai!' });
    }

    const newFood = new Food(req.body);
    await newFood.save();
    res.status(201).json(newFood);
  } catch (error) {
    res.status(500).json({ message: 'Loi khi them mon an', error: error.message });
  }
});

// 5. Cáº­p nháº­t mÃ³n Äƒn
app.put('/api/foods/:id', async (req, res) => {
  try {
    const updatedFood = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedFood) return res.status(404).json({ message: 'Khong tim thay mon an!' });
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: 'Loi khi cap nhat mon an', error: error.message });
  }
});

// 6. XÃ³a mÃ³n Äƒn
app.delete('/api/foods/:id', async (req, res) => {
  try {
    const deletedFood = await Food.findByIdAndDelete(req.params.id);
    if (!deletedFood) return res.status(404).json({ message: 'Khong tim thay mon an!' });
    res.json({ message: 'Xoa mon an thanh cong!' });
  } catch (error) {
    res.status(500).json({ message: 'Loi khi xoa mon an', error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server dang chay tai cong ${PORT}`));
