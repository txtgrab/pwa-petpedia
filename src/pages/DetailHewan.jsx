import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaWhatsapp } from 'react-icons/fa'; 

const DetailHewan = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/animals/${id}`);
        setAnimal(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal mengambil detail:", error);
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleAdopt = () => {
    if (!animal) return;
    const phoneNumber = "6281234567890"; 
    const message = `Halo Admin PetPedia, saya tertarik untuk mengadopsi *${animal.name}* (${animal.category}). Apakah masih tersedia?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  if (loading) return <div style={{textAlign:'center', marginTop:50}}>Loading...</div>;
  if (!animal) return <div style={{textAlign:'center', marginTop:50}}>Data tidak ditemukan.</div>;

  return (
    <div style={styles.container}>
      
      {}
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        {}
        <FaArrowLeft size={20} color="#000" />
      </button>
      
      {}
      <div style={styles.imageContainer}>
        <img 
            src={animal.image || 'https://placehold.co/600x600?text=No+Image'} 
            alt={animal.name} 
            style={styles.image} 
            onError={(e) => { e.target.src = 'https://placehold.co/600x600?text=Error'; }}
        />
      </div>
      
      {}
      <div style={styles.content}>
        <div style={styles.header}>
            <span style={styles.categoryBadge}>{animal.category}</span>
            <h1 style={styles.title}>{animal.name}</h1>
        </div>
        
        <hr style={styles.divider} />
        
        <div style={styles.descSection}>
            <h3 style={{marginTop: 0, marginBottom: '10px'}}>Tentang {animal.name}</h3>
            <p style={styles.description}>
              {animal.description || "Belum ada deskripsi lengkap untuk hewan ini."}
            </p>
        </div>

        <button style={styles.adoptButton} onClick={handleAdopt}>
          <FaWhatsapp size={20} /> Ajukan Adopsi via WhatsApp
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto', 
    background: 'white',
    minHeight: '100vh',
    padding: '20px',
    boxSizing: 'border-box',
    paddingBottom: '80px',
    position: 'relative'
  },
  backButton: {
    position: 'absolute', 
    top: '20px',
    left: '20px',
    backgroundColor: 'white', 
    border: 'none',
    borderRadius: '50%', 
    width: '45px',
    height: '45px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)', 
    zIndex: 100 
  },
  imageContainer: {
    width: '100%',
    height: '350px',
    borderRadius: '20px',
    overflow: 'hidden',
    marginBottom: '25px',
    backgroundColor: '#f0f0f0',
    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    padding: '0 5px',
  },
  header: {
    marginBottom: '10px',
  },
  title: {
    margin: '10px 0 0 0',
    fontSize: '28px',
    color: '#333',
    fontWeight: '800',
  },
  categoryBadge: {
    background: '#e8f5e9',
    color: '#2e7d32',
    padding: '6px 14px',
    borderRadius: '30px',
    fontSize: '12px',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f0f0f0',
    margin: '20px 0',
  },
  description: {
    lineHeight: '1.8',
    color: '#555',
    fontSize: '16px',
    textAlign: 'justify',
  },
  adoptButton: {
    width: '100%',
    padding: '16px',
    background: '#25D366', 
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '30px',
    boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
    transition: 'background 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px'
  },
};

export default DetailHewan;