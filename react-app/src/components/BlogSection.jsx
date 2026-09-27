import React from "react";
import BlogCard from "./BlogCard";
import "../styles/blog-section.css";

const BlogSection = () => {
  const mockBlogs = [
    {
      id: "1",
      title: "Kako optimizirati cash flow u malom poduzeću",
      description: "Praktični savjeti za upravljanje novčanim tijekom i povećanje likvidnosti kroz strategijsko financijsko planiranje.",
      date: "10. svibnja 2026.",
      imageUrl: "/images/blog1.jpg"
    },
    {
      id: "2",
      title: "Strategije za rast agrobiznisa u Hrvatskoj",
      description: "Analiza trendova i prilika u sektoru agrobiznisa, uključujući fondove i financijske instrumente za ruralni razvoj.",
      date: "03. svibnja 2026.",
      imageUrl: "/images/blog2.jpg"
    },
    {
      id: "3",
      title: "Digitalna transformacija tradicionalnog obrta",
      description: "Kako 도입iti moderne tehnologije u tradicionalni posao bez rizika od gubitka identiteti i poverenja klijenata.",
      date: "20. travnja 2026.",
      imageUrl: "/images/blog3.jpg"
    }
  ];

  return (
    <section className="blog-section" id="latest-blogs">
      <div className="blog-header-home">
        <h2 className="latest-blogs-title roboto-light">
          Zadnje analize i istraživanja
        </h2>
      </div>
      <div id="latest-blog-container" className="custom-container">
        <div className="blog-scroll-wrapper">
          {mockBlogs.map((blog) => (
            <BlogCard
              key={blog.id}
              blog={blog}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;