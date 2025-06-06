import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/Mainlayout";
import Home from "./pages/Home";
import About from "./pages/About";
import Books from "./pages/Books";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BookDetail from './components/BookDetail';
import PrivateRoutes from "./routes/PrivateRoutes";
import AdminRoutes from "./routes/AdminRoutes";
import Admin from "./pages/Admin";
import CategoryPage from "./components/CategoryPage";
import BookReader from "./components/BookReader";
import AudioBook from './components/AudioBook';
import Header from "./components/Header";
import AudioBooks from './pages/AudioBooks';
// import AddAudio from "./pages/AddAudio";
// import EditAudio from "./pages/EditAudio";

function App() {
  return (
    <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="books" element={<Books />} />
            <Route path="book/:id" element={<BookDetail />} />
            <Route path="category/:categoryName" element={<CategoryPage />} />
            <Route path="audiobook/:id" element={<AudioBook />} />
            <Route path="audiobooks" element={<AudioBooks />} />
            {/* <Route path="addaudio" element={<AddAudio />} />
            <Route path="editaudio/:audioId" element={<EditAudio />} /> */}
          </Route>

          {/* Route yêu cầu đăng nhập để đọc sách */}
          <Route path="/read" element={<PrivateRoutes />}>
            <Route path=":bookId" element={<BookReader />} />
          </Route>

          {/* Route dành cho admin */}
          <Route path="/admin" element={<AdminRoutes />}>
            <Route index element={<Admin />} />
          </Route>

          {/* Route đăng nhập và đăng ký */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
    </Router>
  );
}

export default App;