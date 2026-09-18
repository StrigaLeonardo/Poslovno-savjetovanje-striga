import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import ServicesPreview from "./components/ServicesPreview";
import Founder from "./components/Founder";
import ContactSection from "./components/ContactSection";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Hero />
      <ServicesPreview />
      <Founder />
      <ContactSection />
      <Footer />
    </>
  );
}

export default App;
