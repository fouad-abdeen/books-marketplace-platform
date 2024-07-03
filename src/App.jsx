import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { baseApiUrl } from "./api";
import { UserContext } from "./contexts/UserContext";
import Homepage from "./components/Homepage";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Signup from "./components/Signup";
import ResetPassword from "./components/ResetPassword";
import VerifyEmail from "./components/VerifyEmail";
import Bookstore from "./components/Bookstore";
import Book from "./components/Book";
import BooksManagement from "./components/BooksManagement";
import { BookstoreContext } from "./contexts/BookstoreContext";
import RegisterBookstore from "./components/RegisterBookstore";
import Profile from "./components/Profile";

function App() {
  const [user, setUser] = useState(null);
  const [bookstore, setBookstore] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(baseApiUrl + "/users", {
          withCredentials: true,
        });

        if (response.data.data.role === "bookstore_owner") {
          const response = await axios.get(baseApiUrl + `/bookstores`, {
            withCredentials: true,
          });
          setBookstore(response.data.data);
        }

        setUser(response.data.data);
      } catch (error) {
        setUser(null);
      }
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <BookstoreContext.Provider value={{ bookstore, setBookstore }}>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/email-verification" element={<VerifyEmail />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route
              path="bookstore-registration"
              element={<RegisterBookstore />}
            />
            <Route path="/bookstores/:id" element={<Bookstore />} />
            <Route path="/books/:id" element={<Book />} />
            <Route path="/books-management" element={<BooksManagement />} />
            <Route path="/profile" element={<Profile />} />
            {/* <Route path="*">"404 Not Found"</Route> */}
          </Routes>
        </Router>
      </BookstoreContext.Provider>
    </UserContext.Provider>
  );
}

export default App;
