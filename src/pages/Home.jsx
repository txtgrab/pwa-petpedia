import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPaw, FaSearch, FaPlus, FaTimes } from 'react-icons/fa'; 
import axios from 'axios';

const Home = () => {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  const [newAnimal, setNewAnimal] = useState({
    name: '', category: '', image: '', description: ''
  });

  useEffect(() => { fetchAnimals(); }, []);

  const fetchAnimals = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/animals');
      setAnimals(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setNewAnimal({ ...newAnimal, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://127.0.0.1:3000/api/animals', newAnimal);
      alert('Berhasil menambahkan hewan!');
      setShowModal(false);
      setNewAnimal({ name: '', category: '', image: '', description: '' });
      fetchAnimals();
    } catch (error) { alert('Gagal menyimpan.'); }
  };

  const handleDelete = async (e, id) => {
    e.preventDefault(); 
    if (confirm("Yakin ingin menghapus hewan ini?")) {
        try {
            await axios.delete(`http://127.0.0.1:3000/api/animals/${id}`);
            fetchAnimals(); 
        } catch (error) {
            alert("Gagal menghapus.");
        }
    }
  };

  const filteredAnimals = animals.filter((animal) =>
    animal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.pageContainer}>
      <div style={styles.header}>
        <h1 style={styles.title}><FaPaw style={styles.icon} /> Temukan Teman Baru</h1>
        <p style={styles.subtitle}>Jelajahi daftar hewan peliharaan yang menggemaskan.</p>
        <div style={styles.searchContainer}>
          <FaSearch style={styles.searchIcon} />
          <input type="text" placeholder="Cari hewan..." style={styles.searchInput} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      <div style={styles.gridContainer}>
        {loading ? <p>Loading...</p> : filteredAnimals.length > 0 ? (
          filteredAnimals.map((animal) => (
            <Link to={`/animal/${animal.id}`} key={animal.id} style={styles.cardLink}>
              <div style={styles.card}>
                <div style={styles.imageContainer}>
                  <img src={animal.image} alt={animal.name} style={styles.image} onError={(e) => { e.target.src = 'https://via.placeholder.com/300?text=No+Image'; }} />
                </div>
                <div style={styles.cardContent}>
                  <span style={styles.categoryBadge}>{animal.category}</span>
                  <h3 style={styles.cardTitle}>{animal.name}</h3>
                  <p style={styles.cardDescription}>{animal.description}</p>
                </div>

                {}
                <button onClick={(e) => handleDelete(e, animal.id)} style={styles.deleteBtn}>
                    X
                </button>
              </div>
            </Link>
          ))
        ) : <p>Tidak ada hewan.</p>}
      </div>

      {}
      <button style={styles.fab} onClick={() => setShowModal(true)}>
        <FaPlus size={24} color="#ffffff" />
      </button>

      {showModal && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3>Tambah Hewan Baru</h3>
              <button onClick={() => setShowModal(false)} style={styles.closeBtn}>X</button>
            </div>
            <form onSubmit={handleSubmit} style={styles.form}>
              <input name="name" placeholder="Nama Hewan" value={newAnimal.name} onChange={handleInputChange} style={styles.input} required />
              <input name="category" placeholder="Kategori" value={newAnimal.category} onChange={handleInputChange} style={styles.input} required />
              <input name="image" placeholder="Link Gambar" value={newAnimal.image} onChange={handleInputChange} style={styles.input} required />
              <textarea name="description" placeholder="Deskripsi..." value={newAnimal.description} onChange={handleInputChange} style={styles.textarea} required />
              <button type="submit" style={styles.submitBtn}>Simpan Data</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  pageContainer: { padding: '20px', paddingBottom: '80px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Poppins', sans-serif" },
  header: { textAlign: 'center', marginBottom: '30px', padding: '20px 0' },
  title: { fontSize: '28px', fontWeight: '800', color: '#333', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '10px' },
  icon: { color: '#4CAF50' },
  subtitle: { color: '#666', fontSize: '14px', maxWidth: '500px', margin: '0 auto 25px auto' },
  searchContainer: { position: 'relative', maxWidth: '400px', margin: '0 auto' },
  searchIcon: { position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#aaa' },
  searchInput: { width: '100%', padding: '12px 15px 12px 45px', borderRadius: '25px', border: '1px solid #ddd', outline: 'none', fontSize: '14px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', boxSizing: 'border-box' },
  gridContainer: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' },
  cardLink: { textDecoration: 'none', color: 'inherit' },
  card: { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 3px 10px rgba(0,0,0,0.08)', transition: 'transform 0.2s', cursor: 'pointer', height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' },
  imageContainer: { height: '180px', overflow: 'hidden', background: '#f0f0f0' },
  image: { width: '100%', height: '100%', objectFit: 'cover' },
  cardContent: { padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 },
  categoryBadge: { display: 'inline-block', background: '#e8f5e9', color: '#4CAF50', fontSize: '10px', fontWeight: 'bold', padding: '3px 8px', borderRadius: '10px', marginBottom: '8px', alignSelf: 'flex-start' },
  cardTitle: { margin: '0 0 8px 0', fontSize: '16px', fontWeight: 'bold', color: '#333' },
  cardDescription: { margin: '0', color: '#777', fontSize: '12px', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' },
    
    deleteBtn: { position: 'absolute', top: '10px', right: '10px', backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 100, color: '#ff4d4f', fontWeight: 'bold', fontSize: '16px', lineHeight: '1' },

  fab: { 
    position: 'fixed', bottom: '80px', right: '20px', 
    width: '60px', height: '60px', 
    borderRadius: '50%', 
    backgroundColor: '#4CAF50', 
    color: 'white', 
    border: 'none', 
    boxShadow: '0 4px 15px rgba(76, 175, 80, 0.4)', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', 
    cursor: 'pointer', zIndex: 999
  },
  
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalContent: { background: 'white', padding: '25px', borderRadius: '12px', width: '90%', maxWidth: '400px' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' },
  textarea: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', minHeight: '80px', fontFamily: 'inherit' },
  submitBtn: { padding: '12px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }
};

export default Home;