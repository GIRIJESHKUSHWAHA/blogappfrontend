import React, { useEffect, useState } from "react";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Menu from "../components/Menu";
import axios from "axios";
import moment from "moment";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import DOMPurify from "dompurify";

const Single = () => {
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const postId = location.pathname.split("/")[2];

  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = JSON.parse(localStorage.getItem("user")) || null;
        const res = await axios.get(`/blog/${postId}`, { headers: { 'x-auth-token': token.token } });
        setPost(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    fetchData();
  }, [postId]);

  const handleDelete = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("user")) || null;
      await axios.delete(`/blog/${postId}`, { headers: { 'x-auth-token': token.token } });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="single">
      {
        (loading || !post._id) ? <h1>Loading...</h1> :
          (<div className="content">
            <img src={`http://localhost:3000/upload/${post?.img || 'defaultImage.png'}`} alt="" />
            <div className="user">
              {post.userImg && <img
                src={post.userImg}
                alt=""
              />}
              <div className="info">
                <span>{post.username}</span>
                <p>Posted {moment(post.date).fromNow()}</p>
              </div>
              {currentUser.username === post.username && (
                <div className="edit">
                  <Link to={`/write?edit=2`} state={post}>
                    <img src={Edit} alt="" />
                  </Link>
                  <img onClick={handleDelete} src={Delete} alt="" />
                </div>
              )}
            </div>
            <h1>{post.title}</h1>
            <p
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.desc),
              }}
            ></p>
          </div>)
      }


      <Menu cat={post.cat} />
    </div>
  );
};

export default Single;