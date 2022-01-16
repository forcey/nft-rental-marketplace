import Login from './components/Login';

function App() {
  return (
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
          <span class="navbar-brand">NFT Rental Marketplace</span>
          <ul class="navbar-nav me-auto mb-2 mb-lg-0">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="/" id="browse-tab">Browse</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/lend" id="lend-tab">Lend</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" href="/return" id="return-tab">Return</a>
            </li>
          </ul>
          <Login/>
      </nav>
    </div>
  );
}

export default App;
