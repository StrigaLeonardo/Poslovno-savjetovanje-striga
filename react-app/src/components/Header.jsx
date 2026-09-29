import "../styles/page-header.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

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

  const hamburgerIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="6" x2="21" y2="6"></line>
      <line x1="3" y1="12" x2="21" y2="12"></line>
      <line x1="3" y1="18" x2="21" y2="18"></line>
    </svg>
  );

  const xIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18"></line>
      <line x1="6" y1="6" x2="18" y2="18"></line>
    </svg>
  );

  return (
    <div className="page-header">
      <div className="header-container">
        <div className="page-title">
          <Link to="/" className="logo-link">
            <h1 className="roboto-light">Štriga poslovno savjetovanje</h1>
          </Link>
        </div>
        <nav
          className="page-navigation"
          id="page-navigation"
          aria-label="Glavna navigacija"
        >
          <ul className="navigation-list">
            <li>
              <Link to="/o-nama" className="roboto-medium">
                O MENI
              </Link>
            </li>
            <li className="dropdown">
              <button
                type="button"
                className="roboto-medium"
                aria-expanded="false"
                aria-controls="services-submenu"
              >
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
              </button>
              <div className="dropdown-content" id="services-submenu">
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
        <button
          className="mobile-menu-button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? xIcon : hamburgerIcon}
        </button>
      </div>
    </div>
  );
};

export default Header;
