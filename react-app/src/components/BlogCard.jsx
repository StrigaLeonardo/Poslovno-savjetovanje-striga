import React from "react";
import "../styles/blog-card.css";

const BlogCard = ({ blog }) => {
  return (
    <a href={`single-blog.html?id=${blog.id}`} className="card-link">
      <div className="custom-post blog-card">
        <div className="custom-header-post">
          <img src={blog.imageUrl} alt={blog.title} />
        </div>
        <div className="custom-body-post">
          <div className="custom-post-content">
            <h1 className="roboto-light">{blog.title}</h1>
            <p className="roboto-light">{blog.description}</p>
            <div className="custom-container-infos">
              <div className="custom-posted-by">
                <span>Datum:</span> {blog.date}
              </div>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
};

export default BlogCard;