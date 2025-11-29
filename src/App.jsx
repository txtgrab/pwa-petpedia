import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import './App.css';

import Home from './pages/Home';
import DetailHewan from './pages/DetailHewan';
import Tips from './pages/Tips';
import DetailTips from './pages/DetailTips';
import Profile from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          {}
          <Route index element={<Home />} />
          {}
          <Route path="animal/:id" element={<DetailHewan />} />
          
          {}
          <Route path="tips" element={<Tips />} />
          {}
          <Route path="tips/:id" element={<DetailTips />} />
          
          {}
          <Route path="about" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;