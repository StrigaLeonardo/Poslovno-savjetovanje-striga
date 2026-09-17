import '../styles/page-header.css';

const Header = () => {
  return (
    <div className="page-header">
      <div className="header-container">
        <div className="page-title">
          <a href="https://striga-savjetovanje.com">
            <h1 className="roboto-light">Štriga poslovno savjetovanje</h1>
          </a>
        </div>
        <nav className="page-navigation" id="page-navigation">
          <a href="o-nama">
            <h3 className="roboto-medium" id="usluge-link">
              O MENI
            </h3>
          </a>

          <div className="dropdown">
            <a href="javascript:void(0)">
              <h3 className="roboto-medium">
                USLUGE
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
              </h3>
            </a>
            <div className="dropdown-content">
              <a className="roboto-light" href="financijsko">
                Financijsko savjetovanje
              </a>
              <a className="roboto-light" href="stratesko">
                Strateško savjetovanje
              </a>
              <a className="roboto-light" href="agrobiznis">
                Agrobiznis i održivi razvoj
              </a>
            </div>
          </div>

          <a href="blog-archive">
            <h3 className="roboto-medium">BLOG</h3>
          </a>
          <a href="kontakt">
            <h3 className="roboto-medium">KONTAKT</h3>
          </a>
        </nav>
      </div>
    </div>
  );
};

export default Header;