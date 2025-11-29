const fetch = require('node-fetch');
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;
const supabaseUrl = 'https://trnpudlxvcxckxlrjlqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybnB1ZGx4dmN4Y2t4bHJqbHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjMzNDQsImV4cCI6MjA3OTYzOTM0NH0.m_NmgeMnTQSul_oqX00aGePbgzaabddhA8d95kcb84g';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { fetch: fetch } 
});
app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/', (req, res) => res.send('Server PetPedia Jalan Lancar!'));

app.get('/api/animals', async (req, res) => {
  const { data, error } = await supabase.from('animals').select('*').order('id', { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.post('/api/animals', async (req, res) => {
  const { name, category, description, image } = req.body;
  try {
    const { data, error } = await supabase.from('animals').insert([{ name, category, description, image }]).select();
    if (error) throw error;
    res.status(201).json({ message: 'Sukses', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/animals/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('animals').select('*').eq('id', id).single();
  if (error) return res.status(404).json({ error: 'Tidak ketemu' });
  res.json(data);
});

app.get('/api/profile', async (req, res) => {
  try {
    const { data, error } = await supabase.from('profile').select('*').limit(1).single();
    if (error) return res.json({ name: 'User', bio: '-', avatar: '' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/profile', async (req, res) => {
  console.log("📩 Menerima Update Profile..."); 
  const { name, bio, nim, angkatan, univ, avatar } = req.body;

  try {
    const { data: existing } = await supabase.from('profile').select('id').limit(1);

    let result;
    if (existing && existing.length > 0) {
        const idToUpdate = existing[0].id; 
        result = await supabase.from('profile')
            .update({ name, bio, nim, angkatan, univ, avatar })
            .eq('id', idToUpdate)
            .select();
    } else {
        result = await supabase.from('profile')
            .insert([{ name, bio, nim, angkatan, univ, avatar }])
            .select();
    }

    if (result.error) throw result.error;
    
    console.log("✅ Profile Berhasil Disimpan!");
    res.json({ message: 'Profile updated!', data: result.data });

  } catch (err) {
    console.error("❌ Gagal Update:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/animals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from('animals')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Hewan berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tips', async (req, res) => {
  try {
    const { data, error } = await supabase.from('tips').select('*').order('id', { ascending: true });
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase.from('tips').select('*').eq('id', id).single();
    if (error) throw error;
    res.json(data);
  } catch (err) {
    res.status(404).json({ error: 'Artikel tidak ditemukan' });
  }
});

app.post('/api/tips', async (req, res) => {
  console.log("📩 Request Tambah Tips:", req.body.title);
  const { title, summary, content, category, author, image } = req.body;
  
  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  try {
    const { data, error } = await supabase
      .from('tips')
      .insert([{ title, summary, content, category, author, image, date }])
      .select();

    if (error) throw error;
    res.status(201).json({ message: 'Sukses tambah tips', data });
  } catch (err) {
    console.error("Gagal simpan tips:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('tips').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Tips berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/docs', (req, res) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>PetPedia API Documentation</title>
      <style>
        body { font-family: sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; line-height: 1.6; color: #333; }
        h1 { color: #4CAF50; border-bottom: 2px solid #4CAF50; padding-bottom: 10px; }
        h2 { margin-top: 30px; color: #555; }
        .endpoint { background: #f4f4f4; padding: 15px; border-radius: 8px; margin-bottom: 15px; border-left: 5px solid #4CAF50; }
        .method { font-weight: bold; color: white; padding: 3px 8px; border-radius: 4px; font-size: 0.9em; margin-right: 10px; }
        .get { background-color: #61affe; }
        .post { background-color: #49cc90; }
        .put { background-color: #fca130; }
        .delete { background-color: #f93e3e; }
        .url { font-family: monospace; font-weight: bold; }
        code { background: #eee; padding: 2px 5px; border-radius: 4px; }
      </style>
    </head>
    <body>
      <h1>📘 Dokumentasi API PetPedia</h1>
      <p>Selamat datang di dokumentasi resmi REST API untuk aplikasi PetPedia.</p>
      
      <h2>🐾 Hewan (Animals)</h2>
      
      <div class="endpoint">
        <span class="method get">GET</span> <span class="url">/api/animals</span>
        <p>Mengambil semua daftar hewan.</p>
      </div>
      
      <div class="endpoint">
        <span class="method get">GET</span> <span class="url">/api/animals/:id</span>
        <p>Mengambil detail satu hewan berdasarkan ID.</p>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span> <span class="url">/api/animals</span>
        <p>Menambahkan data hewan baru. (Body: name, category, description, image)</p>
      </div>

      <div class="endpoint">
        <span class="method delete">DELETE</span> <span class="url">/api/animals/:id</span>
        <p>Menghapus hewan berdasarkan ID.</p>
      </div>

      <h2>📚 Tips & Edukasi</h2>

      <div class="endpoint">
        <span class="method get">GET</span> <span class="url">/api/tips</span>
        <p>Mengambil daftar semua artikel tips.</p>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span> <span class="url">/api/tips</span>
        <p>Membuat artikel tips baru.</p>
      </div>

      <div class="endpoint">
        <span class="method delete">DELETE</span> <span class="url">/api/tips/:id</span>
        <p>Menghapus artikel tips.</p>
      </div>

      <h2>👤 Profil User</h2>

      <div class="endpoint">
        <span class="method get">GET</span> <span class="url">/api/profile</span>
        <p>Mengambil data profil mahasiswa.</p>
      </div>

      <div class="endpoint">
        <span class="method put">PUT</span> <span class="url">/api/profile</span>
        <p>Mengupdate data profil (Nama, NIM, Foto, dll).</p>
      </div>

      <footer style="margin-top: 50px; text-align: center; color: #888; font-size: 0.9em;">
        &copy; 2025 PetPedia Backend System
      </footer>
    </body>
    </html>
  `;
  res.send(htmlContent);
});


app.listen(PORT, () => {
  console.log(`🚀 Server Backend SIAP di http://localhost:${PORT}`);
});

module.exports = app;