import Login from './components/Login';
import { NavLink, Outlet } from "react-router-dom";

function App() {
  return (
    <div className="container">
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <span className="navbar-brand">NFT Rental Marketplace</span>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Browse</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/lend">Lend</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/return">Return</NavLink>
            </li>
          </ul>
          <Login/>
      </nav>
      <Outlet/>
    </div>
  );
}

export default App;
