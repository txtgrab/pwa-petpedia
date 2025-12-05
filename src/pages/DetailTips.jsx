import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUser, FaCalendarDay, FaTag, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const DetailTips = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // STATE MODE EDIT
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // 1. AMBIL DATA
  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:3000/api/tips/${id}`);
      setTip(response.data);
      setFormData(response.data); // Siapkan data untuk diedit
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  // 2. HANDLE KETIK
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 3. SIMPAN PERUBAHAN
  const handleSave = async () => {
    try {
      await axios.put(`http://127.0.0.1:3000/api/tips/${id}`, formData);
      alert("Artikel berhasil diperbarui!");
      setTip(formData); // Update tampilan
      setIsEditing(false); // Keluar mode edit
    } catch (error) {
      alert("Gagal update. Cek backend.");
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:50}}>Loading...</div>;
  if (!tip) return <div style={{textAlign:'center', marginTop:50}}>Artikel tidak ditemukan.</div>;

  return (
    <div style={styles.container}>
      
      {!isEditing && (
        <button onClick={() => navigate(-1)} style={styles.backButton}>
            <FaArrowLeft size={20} color="#000" />
        </button>
      )}

      {/* --- MODE EDIT --- */}
      {isEditing ? (
        <div style={styles.editWrapper}>
            <h2 style={{marginBottom: 20, textAlign:'center'}}>Edit Tips</h2>
            
            <label style={styles.label}>Judul</label>
            <input name="title" value={formData.title} onChange={handleChange} style={styles.input} />
            
            <label style={styles.label}>Gambar URL</label>
            <input name="image" value={formData.image} onChange={handleChange} style={styles.input} />

            <div style={{display:'flex', gap: 10}}>
                <div style={{flex:1}}>
                    <label style={styles.label}>Kategori</label>
                    <input name="category" value={formData.category} onChange={handleChange} style={styles.input} />
                </div>
                <div style={{flex:1}}>
                    <label style={styles.label}>Penulis</label>
                    <input name="author" value={formData.author} onChange={handleChange} style={styles.input} />
                </div>
            </div>

            <label style={styles.label}>Ringkasan</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} style={styles.textareaShort} />

            <label style={styles.label}>Isi Lengkap</label>
            <textarea name="content" value={formData.content} onChange={handleChange} style={styles.textareaLong} />

            <div style={styles.actionButtons}>
                <button onClick={() => setIsEditing(false)} style={styles.btnCancel}><FaTimes/> Batal</button>
                <button onClick={handleSave} style={styles.btnSave}><FaSave/> Simpan</button>
            </div>
        </div>
      ) : (
        /* --- MODE BACA --- */
        <>
          <button onClick={() => setIsEditing(true)} style={styles.editFloatBtn}>
            <FaEdit />
          </button>

          <div style={styles.heroImageContainer}>
            <img src={tip.image} alt={tip.title} style={styles.heroImage} onError={(e) => e.target.src='https://via.placeholder.com/600'} />
            <div style={styles.heroOverlay}></div>
            <span style={styles.categoryTag}><FaTag size={10} /> {tip.category}</span>
          </div>

          <div style={styles.contentWrapper}>
            <h1 style={styles.title}>{tip.title}</h1>
            <div style={styles.metaData}>
                <div style={styles.metaItem}><FaUser size={12} color="#4CAF50"/> {tip.author}</div>
                <div style={styles.metaItem}><FaCalendarDay size={12} color="#4CAF50"/> {tip.date}</div>
            </div>
            <hr style={styles.divider} />
            <article style={styles.articleBody}>{tip.content}</article>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: { background: 'white', minHeight: '100vh', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', position: 'relative' },
  backButton: { position: 'absolute', top: '20px', left: '20px', zIndex: 10, backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
  editFloatBtn: { position: 'absolute', top: '20px', right: '20px', zIndex: 10, backgroundColor: 'white', color: '#4CAF50', border: 'none', borderRadius: '50%', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', fontSize: '18px' },
  heroImageContainer: { width: '100%', height: '250px', position: 'relative', backgroundColor: '#eee' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))' },
  categoryTag: { position: 'absolute', bottom: '15px', left: '20px', background: '#4CAF50', color: 'white', padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' },
  contentWrapper: { padding: '25px', marginTop: '-20px', background: 'white', borderRadius: '25px 25px 0 0', position: 'relative' },
  title: { fontSize: '22px', fontWeight: '800', color: '#222', lineHeight: '1.4', marginBottom: '15px' },
  metaData: { display: 'flex', gap: '20px', fontSize: '13px', color: '#666', marginBottom: '20px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '0 0 20px 0' },
  articleBody: { fontSize: '16px', lineHeight: '1.8', color: '#444', textAlign: 'justify', whiteSpace: 'pre-line' },
  
  // EDIT FORM STYLES
  editWrapper: { padding: '20px', paddingTop: '80px' },
  label: { display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#666', marginBottom: '5px', marginTop: '15px' },
  input: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  textareaShort: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', height: '80px', boxSizing: 'border-box', fontFamily: 'inherit' },
  textareaLong: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', height: '200px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' },
  actionButtons: { display: 'flex', gap: '10px', marginTop: '30px' },
  btnSave: { flex: 1, padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' },
  btnCancel: { flex: 1, padding: '12px', background: '#f44336', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }
};

export default DetailTips;