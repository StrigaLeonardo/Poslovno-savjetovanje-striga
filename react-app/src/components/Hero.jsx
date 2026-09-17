import "../styles/intro.css";

function Hero() {
  return (
    <div className="intro-wrapper">
      <div className="banner-div">
        <img src="/images/zagreb2.jpg" alt="zagreb-skyline" />
        <div className="overlay"></div>
        <div className="text-on-image roboto-light">
          Podrška za svaki korak naprijed
          <div className="subtext">i za one koji su krenuli unazad</div>
        </div>
      </div>
    </div>
  );
}

export default Hero;
