import '../styles/profile-banner.css';

const Founder = () => {
  return (
    <div className="profile-banner-wrapper">
      <div className="profile-banner">
        <div className="profile-photo">
          <img src="/images/splatter-rackley.png" className="splatter-image" alt="" />
          <img src="/images/tajana-no-bg.png" className="profile-image" alt="" />
        </div>

        <div className="profile-text">
          <h3 className="profile-h3 roboto-light">Tajana Štriga</h3>
          <p className="profile-p roboto-light">
            Kao osnivačica i konzultantica obrta Štriga poslovno savjetovanje,
            pružam personaliziranu podršku poduzećima koja žele ostvariti
            rast, optimizirati svoje poslovne procese i postaviti dugoročne
            strateške prioritete. Moj cilj je osigurati srednje velikim
            poduzećima jasnu viziju, strukturirani plan i podršku potrebnu za
            rast, širenje i dugoročni uspjeh.
          </p>
        </div>
        <a className="profile-a roboto-light shake-top" href="o-nama">
          Saznajte više
        </a>
      </div>
    </div>
  );
};

export default Founder;