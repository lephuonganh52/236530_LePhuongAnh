import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/foods';

function App() {
  const [foods, setFoods] = useState([]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    foodId: '',
    name: '',
    category: 'Món nước',
    cuisine: 'Miền Bắc',
    price: '',
    quantity: '',
    description: ''
  });

  const fetchFoods = async (keyword = '') => {
    try {
      const res = await axios.get(`${API_URL}${keyword ? `?search=${keyword}` : ''}`);
      setFoods(res.data);
    } catch (err) {
      console.error('Lỗi tải danh sách món ăn:', err);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchFoods(search);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity)
      });
      alert('Thêm món ăn thành công!');
      setFormData({ foodId: '', name: '', category: 'Món nước', cuisine: 'Miền Bắc', price: '', quantity: '', description: '' });
      fetchFoods();
    } catch (err) {
      alert(err.response?.data?.message || 'Có lỗi xảy ra khi thêm món ăn!');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa món ăn này?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        alert('Xóa món ăn thành công!');
        fetchFoods();
      } catch (err) {
        alert('Lỗi khi xóa món ăn!');
      }
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', color: '#2c3e50' }}>ỨNG DỤNG QUẢN LÝ MÓN ĂN (236530_LePhuongAnh)</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input
          type="text"
          placeholder="Tìm theo tên, loại món, vùng miền..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: '10px', fontSize: '16px' }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#3498db', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Tìm kiếm
        </button>
      </form>

      <form onSubmit={handleSubmit} style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3>Thêm Món Ăn Mới</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <input name="foodId" placeholder="Mã món (VD: F04)" value={formData.foodId} onChange={handleChange} required />
          <input name="name" placeholder="Tên món ăn" value={formData.name} onChange={handleChange} required />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="Món nước">Món nước</option>
            <option value="Món khô">Món khô</option>
            <option value="Món cơm">Món cơm</option>
            <option value="Món lẩu">Món lẩu</option>
          </select>
          <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
            <option value="Miền Bắc">Miền Bắc</option>
            <option value="Miền Trung">Miền Trung</option>
            <option value="Miền Nam">Miền Nam</option>
          </select>
          <input name="price" type="number" placeholder="Giá (VNĐ)" value={formData.price} onChange={handleChange} required />
          <input name="quantity" type="number" placeholder="Số lượng" value={formData.quantity} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ marginTop: '10px', padding: '10px 20px', background: '#2ecc71', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Thêm Món
        </button>
      </form>

      <h3>Danh Sách Món Ăn hiện có</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr style={{ background: '#ecf0f1' }}>
            <th>Mã món</th>
            <th>Tên món</th>
            <th>Loại</th>
            <th>Vùng miền</th>
            <th>Giá (VNĐ)</th>
            <th>Số lượng</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {foods.length > 0 ? (
            foods.map((food) => (
              <tr key={food._id}>
                <td>{food.foodId}</td>
                <td><strong>{food.name}</strong></td>
                <td>{food.category}</td>
                <td>{food.cuisine}</td>
                <td>{food.price?.toLocaleString()}</td>
                <td>{food.quantity}</td>
                <td>
                  <button onClick={() => handleDelete(food._id)} style={{ background: '#e74c3c', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center' }}>Không tìm thấy món ăn nào.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
