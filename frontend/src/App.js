// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import CreateCV from "./components/CreateCV";
import UpdateCV from "./components/UpdateCV";
import Suggestions from "./components/Suggestions";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-cv" element={<CreateCV />} />
        <Route path="/update-cv" element={<UpdateCV />} />
        <Route path="/suggestions" element={<Suggestions />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
