import BlogCard from "./BlogCard";
import { useBlogPreviews } from "../hooks/useBlogPreviews";
import "../styles/blog-section.css";

const BlogSection = () => {
  const { data: blogs, isLoading, isError } = useBlogPreviews();

  let content;

  if (isLoading) {
    content = [1, 2, 3].map((i) => (
      <div key={`loading-${i}`} className="blog-card-loading">
        <div className="custom-post blog-card">
          <div className="custom-header-post"></div>
          <div className="custom-body-post">
            <div className="custom-post-content">
              <h1 className="roboto-light"></h1>
              <p className="roboto-light"></p>
              <div className="custom-container-infos">
                <div className="custom-posted-by">
                  <span>Datum:</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ));
  } else if (isError) {
    content = (
      <div className="error-message">
        Greška pri učitavanju blogova. Molimo pokušajte ponovno.
      </div>
    );
  } else if (!blogs?.length) {
    content = (
      <div className="empty-message">Trenutno nema dostupnih blogova.</div>
    );
  } else {
    content = blogs.map((blog) => <BlogCard key={blog.id} blog={blog} />);
  }

  return (
    <section className="blog-section" id="latest-blogs">
      <div className="blog-header-home">
        <h2 className="latest-blogs-title roboto-light">
          Zadnje analize i istraživanja
        </h2>
      </div>

      <div id="latest-blog-container" className="custom-container">
        <div className="blog-scroll-wrapper">{content}</div>
      </div>
    </section>
  );
};

export default BlogSection;
