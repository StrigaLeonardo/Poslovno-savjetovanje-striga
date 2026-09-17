import "../styles/services-section.css";

const ServicesPreview = () => {
  return (
    <section className="services-section">
      <div className="services-inner-container">
        <div className="services-header-wrapper">
          <div className="services-header-title">
            <h2 className="roboto-light">Usluge poslovnog savjetovanja</h2>
          </div>
          <div className="services-description">
            <p className="roboto-light">
              Pomažemo malim i srednjim poduzećima da ostvare svoje ciljeve kroz
              strateško savjetovanje i inovativna rješenja, te im pružamo
              podršku i resurse za kontinuirani rast i inovacije.
            </p>
          </div>
        </div>
        <div className="services-cards-container">
          <a href="financijsko" className="service-card">
            <div className="service-card-image">
              <img src="/images/profit.png" alt="Profit Image" />
            </div>
            <div className="service-card-title roboto-light">
              Financijsko savjetovanje
            </div>
            <div className="service-card-description roboto-light">
              <p>Investicijske studije</p>
              <p>Financijsko modeliranje</p>
              <p>Izdanje obveznica</p>
              <p>Upravljanje rizicima</p>
            </div>
          </a>
          <a href="stratesko" className="service-card">
            <div className="service-card-image">
              <img src="/images/strategy.png" alt="Strategy Image" />
            </div>
            <div className="service-card-title roboto-light">
              Strateško savjetovanje
            </div>
            <div className="service-card-description roboto-light">
              <p>Poslovno planiranje</p>
              <p>Analiza tržišta i konkurencije</p>
              <p>Upravljanje promjenama</p>
              <p>Strateško planiranje i operativna optimizacija</p>
            </div>
          </a>
          <a href="agrobiznis" className="service-card">
            <div className="service-card-image">
              <img src="/images/coin.png" alt="Coin Image" />
            </div>
            <div className="service-card-title roboto-light">
              Agrobiznis i ruralni razvoj
            </div>
            <div className="service-card-description roboto-light">
              <p>Poslovno planiranje za agrobiznis</p>
              <p>Prijave za fondove (uključujući EU)</p>
              <p>Izvoz i međunarodno poslovanje za agrobiznis</p>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ServicesPreview;
