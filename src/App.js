import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { SocketProvider } from "./context/SocketProvider";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <div className="dark">
      <SocketProvider user={user}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={user ? <Home /> : <Navigate to="/login" />}
            />
            <Route
              path="/login"
              element={!user ? <Login /> : <Navigate to="/" />}
            />
            <Route
              path="/register"
              element={!user ? <Register /> : <Navigate to="/" />}
            />
          </Routes>
        </Router>
      </SocketProvider>
    </div>
  );
}

export default App;
