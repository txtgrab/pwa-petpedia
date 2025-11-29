import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaUserEdit, FaCalendarAlt, FaPlus } from 'react-icons/fa'; // Tambahkan FaPlus dari react-icons

const Tips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', summary: '', content: '', category: '', author: '', image: ''
  });

  const fetchTips = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/tips');
      setTips(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  useEffect(() => { fetchTips(); }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!formData.title) return alert("Isi judul dulu!");
    try {
      await axios.post('http://127.0.0.1:3000/api/tips', formData);
      alert("Berhasil!");
      setShowModal(false);
      setFormData({ title: '', summary: '', content: '', category: '', author: '', image: '' });
      fetchTips();
    } catch (error) { alert("Gagal simpan."); }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); 
    if (confirm("Hapus tips ini?")) {
        try {
            await axios.delete(`http://127.0.0.1:3000/api/tips/${id}`);
            fetchTips();
        } catch (error) { alert("Gagal hapus."); }
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:50}}>Loading...</div>;

  return (
    <div style={styles.pageContainer}>
      <h2 style={styles.pageTitle}>📚 Tips & Edukasi</h2>
      <p style={styles.subtitle}>Pelajari cara merawat hewan kesayanganmu dengan benar.</p>

      <div style={styles.listContainer}>
        {tips.map((item) => (
          <Link to={`/tips/${item.id}`} key={item.id} style={styles.card}>
            <div style={styles.imageContainer}>
                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.title} style={styles.image} onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }} />
                <span style={styles.categoryBadge}>{item.category}</span>
            </div>
            <div style={styles.content}>
                <h3 style={styles.cardTitle}>{item.title}</h3>
                <p style={styles.summary}>{item.summary}</p>
                <div style={styles.metaInfo}>
                    <span style={styles.metaItem}><FaUserEdit size={10}/> {item.author}</span>
                    <span style={styles.metaItem}><FaCalendarAlt size={10}/> {item.date}</span>
                </div>
            </div>

            {}
            <button onClick={(e) => handleDelete(e, item.id)} style={styles.deleteBtn}>
                X
            </button>
          </Link>
        ))}
      </div>

      {}
      <button style={styles.fab} onClick={() => setShowModal(true)}>
        <FaPlus size={20} /> 
      </button>

      {}
      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
                <h3>Tulis Tips Baru</h3>
                <button onClick={() => setShowModal(false)} style={styles.closeBtn}>X</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
                <input name="title" placeholder="Judul" value={formData.title} onChange={handleChange} style={styles.input} />
                <input name="category" placeholder="Kategori" value={formData.category} onChange={handleChange} style={styles.input} />
                <input name="author" placeholder="Penulis" value={formData.author} onChange={handleChange} style={styles.input} />
                <input name="image" placeholder="Link Gambar" value={formData.image} onChange={handleChange} style={styles.input} />
                <input name="summary" placeholder="Ringkasan" value={formData.summary} onChange={handleChange} style={styles.input} />
                <textarea name="content" placeholder="Isi..." rows="5" value={formData.content} onChange={handleChange} style={styles.textarea} />
                <button type="submit" style={styles.submitBtn}>Terbitkan</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: { padding: '20px 20px 80px 20px', maxWidth: '800px', margin: '0 auto' },
  pageTitle: { textAlign: 'center', marginBottom: '5px', color: '#333', fontSize: '24px', fontWeight: '800' },
  subtitle: { textAlign: 'center', color: '#666', marginBottom: '30px', fontSize: '14px' },
  listContainer: { display: 'flex', flexDirection: 'column', gap: '20px' },
  card: { display: 'flex', flexDirection: 'row', position: 'relative', background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textDecoration: 'none', color: 'inherit', border: '1px solid #f0f0f0', transition: 'transform 0.2s', minHeight: '140px' },
  imageContainer: { width: '120px', flexShrink: 0, position: 'relative', backgroundColor: '#eee' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  categoryBadge: { position: 'absolute', top: '8px', left: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', fontSize: '9px', padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 'bold' },
  content: { padding: '15px', display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 },
  cardTitle: { margin: '0 0 5px 0', fontSize: '16px', fontWeight: 'bold', color: '#333', lineHeight: '1.3' },
  summary: { margin: '0 0 10px 0', fontSize: '12px', color: '#666', lineHeight: '1.4' },
  metaInfo: { display: 'flex', gap: '15px', fontSize: '11px', color: '#999' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '4px' },
  
  deleteBtn: { position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', border: '1px solid #ff4d4f', borderRadius: '50%', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 100, color: '#ff4d4f', fontWeight: 'bold', fontSize: '14px', lineHeight: '1' },

  fab: { 
    position: 'fixed', 
    bottom: '80px', 
    right: '30px', 
    width: '60px', 
    height: '60px', 
    borderRadius: '50%', 
    backgroundColor: '#4CAF50', 
    color: 'white', 
    border: 'none', 
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    cursor: 'pointer', 
    zIndex: 999 
  },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000 },
  modalContent: { backgroundColor: 'white', padding: '25px', borderRadius: '16px', width: '90%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeBtn: { background: 'transparent', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'vertical', fontFamily: 'inherit' },
  submitBtn: { padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#4CAF50', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }
};

export default Tips;