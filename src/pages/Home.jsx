import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const cat = useLocation().search

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("user")) || null;
        const res = await axios.get(`/blog${cat}`, { headers: { 'x-auth-token': token.token } });
        setPosts(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setPosts([]);
        setLoading(false);
      }
    };
    fetchData();
  }, [cat]);

  const getText = (html) => {
    const doc = new DOMParser().parseFromString(html, "text/html")
    return doc.body.textContent
  }

  return (
    (loading) ? <h1>Loading...</h1> :
    (posts.length === 0) ? <h1>No posts found</h1> :
      (<div className="posts">
        {posts.map((post) => (
          <div className="post" key={post.id}>
            <div className="img">
              <img style={{"max-width": "1024px"}} src={`http://localhost:3000/upload/${post?.img || 'defaultImage3.png'}`} alt="" />
            </div>
            <div className="content">
              <Link className="link" to={`/post/${post._id}`}>
                <h1>{post.title}</h1>
              </Link>
              <p>{getText(post.desc)}</p>
              <Link className="link" to={`/post/${post._id}`}>
                <button>Read More</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      )

  );
};

export default Home;