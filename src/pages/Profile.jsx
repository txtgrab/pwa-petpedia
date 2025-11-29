import React, { useState, useRef, useEffect } from 'react';
import { FaGithub, FaEdit, FaSave, FaTimes, FaCamera } from 'react-icons/fa';
import axios from 'axios';

const Profile = () => {
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [profile, setProfile] = useState({
    name: '', bio: '', nim: '', angkatan: '', univ: '', avatar: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:3000/api/profile');
      if (response.data) {
        setProfile(response.data);
      }
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil profil:", error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      await axios.put('http://127.0.0.1:3000/api/profile', profile);
      alert('Profil berhasil disimpan!');
      setIsEditing(false);
      fetchProfile(); 
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan profil. Cek terminal backend.');
    }
  };

  if (loading) return <div style={{textAlign:'center', marginTop:50}}>Loading Profile...</div>;

  return (
    <div style={styles.pageContainer}>
      <div style={styles.contentWrapper}>
        <div style={styles.header}>
          <div style={styles.avatarContainer} onClick={() => isEditing && fileInputRef.current.click()}>
            <img 
              src={profile.avatar || 'https://via.placeholder.com/150'} 
              alt="Profile" style={styles.avatar} 
            />
            {isEditing && (
                <div style={styles.cameraOverlay}>
                    <FaCamera color="white" size={18} />
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: 'none' }} />
                </div>
            )}
          </div>

          {isEditing ? (
            <div style={styles.editForm}>
              <input type="text" name="name" value={profile.name} onChange={handleChange} style={styles.inputTitle} placeholder="Nama" />
              <input type="text" name="bio" value={profile.bio} onChange={handleChange} style={styles.inputSubtitle} placeholder="Bio" />
            </div>
          ) : (
            <>
              <h2 style={styles.name}>{profile.name}</h2>
              <p style={styles.bio}>{profile.bio}</p>
            </>
          )}
        </div>

        <div style={styles.infoCard}>
          <div style={styles.cardHeader}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>Informasi Akademik</h3>
            {!isEditing ? (
              <button onClick={() => setIsEditing(true)} style={styles.btnAction}><FaEdit /> Edit</button>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => {setIsEditing(false); fetchProfile()}} style={{...styles.btnAction, color: '#f44336'}}><FaTimes /> Batal</button>
                <button onClick={handleSave} style={{...styles.btnAction, color: '#4CAF50'}}><FaSave /> Simpan</button>
              </div>
            )}
          </div>
          <div style={styles.row}><span style={styles.label}>NIM</span>{isEditing ? <input name="nim" value={profile.nim} onChange={handleChange} style={styles.inputSmall} /> : <span style={styles.value}>{profile.nim}</span>}</div>
          <div style={styles.row}><span style={styles.label}>Angkatan</span>{isEditing ? <input name="angkatan" value={profile.angkatan} onChange={handleChange} style={styles.inputSmall} /> : <span style={styles.value}>{profile.angkatan}</span>}</div>
          <div style={styles.row}><span style={styles.label}>Universitas</span>{isEditing ? <input name="univ" value={profile.univ} onChange={handleChange} style={styles.inputSmall} /> : <span style={styles.value}>{profile.univ}</span>}</div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  pageContainer: { display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', minHeight: '80vh', paddingTop: '20px', paddingBottom: '40px' },
  contentWrapper: { width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 20px' },
  header: { display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '30px', textAlign: 'center', width: '100%' },
  avatarContainer: { position: 'relative', width: '120px', height: '120px', marginBottom: '15px', cursor: 'pointer' },
  avatar: { width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover', border: '4px solid white', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' },
  cameraOverlay: { position: 'absolute', bottom: '0', right: '0', background: '#4CAF50', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '3px solid white', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' },
  name: { margin: '5px 0', color: '#333', fontSize: '22px', fontWeight: 'bold' },
  bio: { margin: '0', color: '#666', fontSize: '14px' },
  editForm: { width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' },
  inputTitle: { fontSize: '18px', padding: '8px', width: '100%', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' },
  inputSubtitle: { fontSize: '14px', padding: '8px', width: '100%', borderRadius: '8px', border: '1px solid #ddd', textAlign: 'center' },
  infoCard: { background: 'white', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', marginBottom: '30px', width: '100%', textAlign: 'left' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f0f0f0', paddingBottom: '10px' },
  btnAction: { background: 'transparent', border: 'none', color: '#4CAF50', cursor: 'pointer', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '13px' },
  row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #f9f9f9' },
  label: { fontWeight: '600', color: '#555', fontSize: '14px' },
  value: { color: '#333', fontSize: '14px', textAlign: 'right' },
  inputSmall: { padding: '6px', borderRadius: '5px', border: '1px solid #ddd', textAlign: 'right', fontSize: '14px', width: '60%' },
};

export default Profile;