const fetch = require('node-fetch');
if (!globalThis.fetch) {
    globalThis.fetch = fetch;
}

const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const PORT = 3000;

const swaggerDocument = {
  "openapi": "3.0.0",
  "info": {
    "title": "PetPedia API Documentation",
    "description": "Dokumentasi lengkap REST API untuk aplikasi PWA PetPedia.",
    "version": "1.0.0",
    "contact": {
      "name": "Fajar Herdiansyah"
    }
  },
  "servers": [
    { "url": "https://pwa-petpedia.vercel.app", "description": "Production Server" },
    { "url": "http://localhost:3000", "description": "Local Development" }
  ],
  "paths": {
    "/api/animals": {
      "get": {
        "summary": "Ambil semua data hewan",
        "tags": ["Hewan"],
        "responses": { "200": { "description": "Berhasil mengambil data" } }
      },
      "post": {
        "summary": "Tambah hewan baru",
        "tags": ["Hewan"],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": { "type": "string" },
                  "category": { "type": "string" },
                  "description": { "type": "string" },
                  "image": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": { "201": { "description": "Sukses" } }
      }
    },
    "/api/animals/{id}": {
      "get": {
        "summary": "Ambil detail hewan",
        "tags": ["Hewan"],
        "parameters": [ { "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } } ],
        "responses": { "200": { "description": "Detail ditemukan" } }
      },
      "delete": {
        "summary": "Hapus hewan",
        "tags": ["Hewan"],
        "parameters": [ { "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } } ],
        "responses": { "200": { "description": "Berhasil dihapus" } }
      }
    },
    "/api/tips": {
      "get": {
        "summary": "Ambil semua tips",
        "tags": ["Tips"],
        "responses": { "200": { "description": "Sukses" } }
      },
      "post": {
        "summary": "Buat tips baru",
        "tags": ["Tips"],
        "responses": { "201": { "description": "Sukses" } }
      }
    },
    "/api/tips/{id}": {
      "delete": {
        "summary": "Hapus tips",
        "tags": ["Tips"],
        "parameters": [ { "in": "path", "name": "id", "required": true, "schema": { "type": "integer" } } ],
        "responses": { "200": { "description": "Dihapus" } }
      }
    },
    "/api/profile": {
      "get": {
        "summary": "Ambil profil",
        "tags": ["Profil"],
        "responses": { "200": { "description": "Sukses" } }
      },
      "put": {
        "summary": "Update profil",
        "tags": ["Profil"],
        "responses": { "200": { "description": "Sukses" } }
      }
    }
  }
};

const supabaseUrl = 'https://trnpudlxvcxckxlrjlqe.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRybnB1ZGx4dmN4Y2t4bHJqbHFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQwNjMzNDQsImV4cCI6MjA3OTYzOTM0NH0.m_NmgeMnTQSul_oqX00aGePbgzaabddhA8d95kcb84g';

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { fetch: fetch }
});

app.use(cors());
app.use(express.json({ limit: '50mb' })); 
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.get('/api/docs', (req, res) => {
  res.setHeader('Content-Type', 'text/html');
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>PetPedia API Docs</title>
      <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist/swagger-ui.css" />
      <style>
        body { margin: 0; padding: 0; }
        .swagger-ui .topbar { display: none; } 
      </style>
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js" charset="UTF-8"> </script>
      <script src="https://unpkg.com/swagger-ui-dist/swagger-ui-standalone-preset.js" charset="UTF-8"> </script>
      <script>
        window.onload = function() {
          const ui = SwaggerUIBundle({
            spec: ${JSON.stringify(swaggerDocument)},
            dom_id: '#swagger-ui',
            deepLinking: true,
            presets: [
              SwaggerUIBundle.presets.apis,
              SwaggerUIStandalonePreset
            ],
            layout: "BaseLayout"
          });
        };
      </script>
    </body>
    </html>
  `);
});

app.get('/', (req, res) => res.send('Server PetPedia Jalan!'));

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

app.delete('/api/animals/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('animals').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Berhasil dihapus' });
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
    res.status(404).json({ error: 'Tidak ditemukan' });
  }
});

app.post('/api/tips', async (req, res) => {
  const { title, summary, content, category, author, image } = req.body;
  const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  try {
    const { data, error } = await supabase.from('tips').insert([{ title, summary, content, category, author, image, date }]).select();
    if (error) throw error;
    res.status(201).json({ message: 'Sukses', data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/tips/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase.from('tips').delete().eq('id', id);
    if (error) throw error;
    res.json({ message: 'Tips dihapus!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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
  const { name, bio, nim, angkatan, univ, avatar } = req.body;
  try {
    const { data: existing } = await supabase.from('profile').select('id').limit(1);
    let result;
    if (existing && existing.length > 0) {
        result = await supabase.from('profile').update({ name, bio, nim, angkatan, univ, avatar }).eq('id', existing[0].id).select();
    } else {
        result = await supabase.from('profile').insert([{ name, bio, nim, angkatan, univ, avatar }]).select();
    }
    if (result.error) throw result.error;
    res.json({ message: 'Profile updated!', data: result.data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server Backend SIAP di http://localhost:${PORT}`);
});

module.exports = app;