import "../styles/page-header.css";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const Header = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const maxScrollY = 500; // pixels over which to apply the effect
    const root = document.documentElement;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / maxScrollY, 0), 1);
      root.style.setProperty("--scroll-progress", progress.toString());
    };

    // Initialize with current scroll position
    updateScroll();

    // Add event listener
    window.addEventListener("scroll", updateScroll);

    // Cleanup function
    return () => {
      window.removeEventListener("scroll", updateScroll);
      // Reset the property on unmount
      root.style.removeProperty("--scroll-progress");
    };
  }, []);

  return (
    <div className="page-header">
      <div className="header-container">
        <div className="page-title">
          <Link to="/" className="logo-link">
            <h1 className="roboto-light">Štriga poslovno savjetovanje</h1>
          </Link>
        </div>
        <nav className="page-navigation" id="page-navigation" aria-label="Glavna navigacija">
          <ul className="navigation-list">
            <li>
              <Link to="/o-nama" className="roboto-medium">
                O MENI
              </Link>
            </li>
            <li className="dropdown">
              <a href="javascript:void(0)" className="roboto-medium">
                <span className="usluge-text">USLUGE</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
                </svg>
              </a>
              <div className="dropdown-content">
                <Link to="/financijsko" className="roboto-light">
                  Financijsko savjetovanje
                </Link>
                <Link to="/stratesko" className="roboto-light">
                  Strateško savjetovanje
                </Link>
                <Link to="/agrobiznis" className="roboto-light">
                  Agrobiznis i održivi razvoj
                </Link>
              </div>
            </li>
            <li>
              <Link to="/blog-archive" className="roboto-medium">
                BLOG
              </Link>
            </li>
            <li>
              <Link to="/kontakt" className="roboto-medium">
                KONTAKT
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Header;
