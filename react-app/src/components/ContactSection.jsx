import '../styles/contact-us-section.css';

const ContactSection = () => {
  return (
    <section className="contact-us-section">
      <div className="contact-us-content">
        <h2 className="contact-us-title roboto-light">Zašto odabrati nas?</h2>
        <p className="contact-us-text roboto-light">
          Razumijemo da svaki klijent ima specifične izazove i potrebe – zato
          ne vjerujemo u univerzalna rješenja. Svaki naš pristup temelji se na
          dubinskoj analizi tržišta i kreiranju individualnih rješenja
          prilagođenih upravo vama. Naš cilj nije samo pomoći vam da ostvarite
          svoje projekte, već da zajedno izgradimo dugoročni uspjeh koji će
          vas izdvojiti na tržištu.
          <br /><br />
          Obratite nam se kako biste saznali više o našim uslugama i kako
          možemo pomoći vašem poslovanju da raste i napreduje.
        </p>
        <div className="button-container">
          <a href="kontakt" className="contact-button roboto-medium">
            Kontaktirajte me
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;