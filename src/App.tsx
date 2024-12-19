import "./CSS/style.css";
import { BrowserRouter, Routes, Route } from "react-router" 
import Login from "./pages/Login";
import MainPage from "./pages/MainPage"
import './App.css'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
