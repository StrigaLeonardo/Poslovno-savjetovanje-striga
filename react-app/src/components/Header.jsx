import "../styles/page-header.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropOpen, setIsServicesDropOpen] = useState(false);

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      closeMobileMenu();
      return;
    }

    setIsMobileMenuOpen(true);
  };

  const toggleServicesDropdown = () => {
    setIsServicesDropOpen((isOpen) => !isOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsServicesDropOpen(false);
  };

  // Scroll effect for header shrink
  useEffect(() => {
    if (typeof window === "undefined") return;

    const maxScrollY = 500;
    const root = document.documentElement;

    const updateScroll = () => {
      const scrollY = window.scrollY;
      const progress = Math.min(Math.max(scrollY / maxScrollY, 0), 1);

      root.style.setProperty("--scroll-progress", progress.toString());
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll);

    return () => {
      window.removeEventListener("scroll", updateScroll);
      root.style.removeProperty("--scroll-progress");
    };
  }, []);

  // Handle body scroll locking and backdrop when mobile menu is open
  useEffect(() => {
    let backdrop = null;

    const handleTouchMove = (event) => {
      event.preventDefault();
    };

    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
      document.body.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });

      backdrop = document.createElement("div");
      backdrop.className = "mobile-menu-backdrop";
      backdrop.onclick = closeMobileMenu;

      document.body.appendChild(backdrop);
      document.body.classList.add("body-menu-open");
    } else {
      document.body.style.overflow = "";
      document.body.classList.remove("body-menu-open");

      const mobileMenuButton = document.querySelector(".mobile-menu-button");

      if (mobileMenuButton) {
        mobileMenuButton.focus();
      }
    }

    return () => {
      if (backdrop && document.body.contains(backdrop)) {
        backdrop.remove();
      }

      document.body.style.overflow = "";
      document.body.removeEventListener("touchmove", handleTouchMove);
      document.body.classList.remove("body-menu-open");
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close menu
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && isMobileMenuOpen) {
        closeMobileMenu();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isMobileMenuOpen]);

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
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
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
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
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
          className={`page-navigation ${
            isMobileMenuOpen ? "is-mobile-open" : ""
          }`}
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
                aria-expanded={isServicesDropOpen}
                aria-controls="services-submenu"
                onClick={toggleServicesDropdown}
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
          type="button"
          onClick={toggleMobileMenu}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          aria-controls="page-navigation"
        >
          {isMobileMenuOpen ? xIcon : hamburgerIcon}
        </button>
      </div>
    </div>
  );
};

export default Header;
