import Login from './components/Login';
import { NavLink, Outlet } from "react-router-dom";
import { Container, Navbar, Nav } from 'react-bootstrap';

function App() {

  return (
    <Container>
      <Navbar bg="light" expand="lg">
          <Navbar.Brand>Kasu</Navbar.Brand>
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
      </Navbar>
      <Outlet/>
    </Container>
  );
}

export default App;
