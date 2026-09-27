import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ServicesPreview from "../components/ServicesPreview";
import Founder from "../components/Founder";
import ContactSection from "../components/ContactSection";
import BlogSection from "../components/BlogSection";

const HomePage = () => {
  return (
    <>
      <Header />
      <Hero />
      <ServicesPreview />
      <Founder />
      <ContactSection />
      <BlogSection />
      <Footer />
    </>
  );
};

export default HomePage;