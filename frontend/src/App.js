// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import EditorPage from "./pages/EditorPage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/editor" element={<EditorPage />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
