import Login from './components/Login';
import { NavLink, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from 'react-bootstrap';
import { ToastContainer, toast } from "react-toastify";

function App() {

  return (
    <Container>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand>
            <img
              alt=""
              src="/katsu.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />
            { ' ' }Kasu
          </Navbar.Brand>
          <Nav className="me-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Browse</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/lend">Lend</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/return">Return</NavLink>
            </li>
          </Nav>
          <Login/>
        </Container>
      </Navbar>
      <ToastContainer
        position={toast.POSITION.TOP_RIGHT}
        autoClose={15000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Outlet/>
    </Container>
  );
}

export default App;
