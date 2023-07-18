import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";

const Write = () => {
  const state = useLocation().state;
  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");

  const navigate = useNavigate();
  const isLogged = JSON.parse(localStorage.getItem("user")) || null;
  if(!isLogged) navigate("/login")

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const token = JSON.parse(localStorage.getItem("user")) || null;
      const res = await axios.post("/upload", formData, {
        headers: {
          'x-auth-token': token.token
        }
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleClick = async (e) => {
    e.preventDefault();
    const imgUrl = await upload();
    const token = JSON.parse(localStorage.getItem("user")) || null;
    try {
      state
        ? await axios.put(`/blog/${state._id}`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
          }, {
            headers: {
              'x-auth-token': token.token
            }
          })
        : await axios.post(`/blog`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          }, {
            headers: {
              'x-auth-token': token.token
            }
          });
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="add">
      <div className="content">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="editorContainer">
          <ReactQuill
            className="editor"
            theme="snow"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="menu">
        <div className="item">

          <input
            style={{ display: "none" }}
            type="file"
            id="file"
            name=""
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label className="file" htmlFor="file">
            Upload Image
          </label>
          <div className="buttons">
            <button onClick={handleClick}>Publish</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Write;
