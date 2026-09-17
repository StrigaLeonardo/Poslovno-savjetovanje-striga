const Footer = () => {
  return (
    <div className="page-footer">
      <div className="footer-content">
        <div className="footer-col footer-brandpolicies">
          <a href="https://striga-savjetovanje.com" className="footer-title roboto-light">
            Štriga poslovno savjetovanje
          </a>
          <div className="footer-policies-linkedin">
            <div className="footer-policies roboto-light">
              <a href="privacy-policy">Pravila privatnosti</a>
              <a href="cookie-policy">Pravila kolačića</a>
            </div>
          </div>
        </div>
        <nav
          className="footer-col footer-nav roboto-light"
          aria-label="Footer Navigation"
        >
          <div className="footer-links-group a">
            <a href="financijsko">Financijsko savjetovanje</a>
            <a href="stratesko">Strateško savjetovanje</a>
            <a href="agrobiznis">Agrobiznis i održivi razvoj</a>
          </div>
          <div className="footer-links-group b">
            <a href="o-nama">O meni</a>
            <a href="blog-archive">Blog</a>
            <a href="kontakt">Kontakt</a>
            <a
              href="https://www.linkedin.com/in/tajanastriga/?originalSubdomain=hr"
              target="_blank"
              rel="noopener"
              className="linkedin-btn"
              aria-label="LinkedIn"
            >
              <svg width="1.5em" height="1.5em" viewBox="0 0 32 32" fill="none">
                <text
                  x="16"
                  y="16"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="Arial, Helvetica, sans-serif"
                  fontSize="22"
                  fontWeight="bold"
                >
                  in
                </text>
              </svg>
            </a>
          </div>
        </nav>

        {/* Back to Top Button Column */}
        <div className="footer-col footer-totop">
          <button className="to-top-btn" aria-label="Back to top">
            <svg
              className="to-top-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                className="to-top-arrow"
                d="M7 14l5-5 5 5"
                stroke="#cdd9e8"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        </div>
      </div>
      {/* Divider & Copyright */}
      <div className="footer-line"></div>
      <div className="copyright roboto-light">
        <p>© 2018 Štriga poslovno savjetovanje | All Rights Reserved</p>
      </div>
    </div>
  );
};

export default Footer;