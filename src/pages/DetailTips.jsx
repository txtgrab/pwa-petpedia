import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft, FaUser, FaCalendarDay, FaTag } from 'react-icons/fa';

const DetailTips = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:3000/api/tips/${id}`);
        setTip(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error);
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) return <div style={{textAlign:'center', marginTop:50}}>Loading...</div>;
  if (!tip) return <div style={{textAlign:'center', marginTop:50}}>Artikel tidak ditemukan.</div>;

  return (
    <div style={styles.container}>
      
      {}
      <button onClick={() => navigate(-1)} style={styles.backButton}>
        <FaArrowLeft size={20} /> {}
      </button>

      {}
      <div style={styles.heroImageContainer}>
        <img src={tip.image} alt={tip.title} style={styles.heroImage} />
        <div style={styles.heroOverlay}></div>
        <span style={styles.categoryTag}><FaTag size={10} /> {tip.category}</span>
      </div>

      {}
      <div style={styles.contentWrapper}>
        <h1 style={styles.title}>{tip.title}</h1>
        
        <div style={styles.metaData}>
            <div style={styles.metaItem}>
                <FaUser size={12} color="#4CAF50"/>
                <span>{tip.author}</span>
            </div>
            <div style={styles.metaItem}>
                <FaCalendarDay size={12} color="#4CAF50"/>
                <span>{tip.date}</span>
            </div>
        </div>

        <hr style={styles.divider} />

        <article style={styles.articleBody}>
            {tip.content}
        </article>
      </div>
    </div>
  );
};

const styles = {
  container: { background: 'white', minHeight: '100vh', paddingBottom: '80px', maxWidth: '600px', margin: '0 auto', position: 'relative' },
  
  backButton: {
    position: 'absolute', 
    top: '20px', 
    left: '20px', 
    zIndex: 100, 
    backgroundColor: 'white', 
    color: '#333', 
    border: 'none', 
    borderRadius: '50%', 
    width: '45px', 
    height: '45px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center',
    cursor: 'pointer', 
    boxShadow: '0 4px 10px rgba(0,0,0,0.3)' 
  },

  heroImageContainer: { width: '100%', height: '250px', position: 'relative' },
  heroImage: { width: '100%', height: '100%', objectFit: 'cover' },
  heroOverlay: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5))' },
  
  categoryTag: {
    position: 'absolute', bottom: '15px', left: '20px',
    background: '#4CAF50', color: 'white', padding: '5px 12px',
    borderRadius: '20px', fontSize: '12px', fontWeight: 'bold',
    display: 'flex', alignItems: 'center', gap: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
  },
  
  contentWrapper: { padding: '25px', marginTop: '-20px', background: 'white', borderRadius: '25px 25px 0 0', position: 'relative' },
  title: { fontSize: '22px', fontWeight: '800', color: '#222', lineHeight: '1.4', marginBottom: '15px' },
  metaData: { display: 'flex', gap: '20px', fontSize: '13px', color: '#666', marginBottom: '20px' },
  metaItem: { display: 'flex', alignItems: 'center', gap: '8px' },
  divider: { border: 'none', borderTop: '1px solid #eee', margin: '0 0 20px 0' },
  articleBody: { fontSize: '16px', lineHeight: '1.8', color: '#444', textAlign: 'justify', whiteSpace: 'pre-line' }
};

export default DetailTips;