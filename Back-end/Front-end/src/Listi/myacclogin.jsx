import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const { query } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loggedin, setLoggedin] = useState(false);
  const [likedPosts, setLikedPosts] = useState([]);
  const [yourPosts, setYourPosts] = useState([]);
  useEffect(() => {

    if (query) {
      console.log(query);
      axios.post(`${window.location.origin}/myacc/signup/authenticateuser`, { query})
        .then((res) => {
          if (res.data.result === 'success') {
            localStorage.setItem("id", query);
         
          }
        });
    }
  }, [query]);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post(`${window.location.origin}/myacc`, { username, password })
      .then((res) => {
        if (res.data.result === 'success') {
          localStorage.setItem('id', res.data.id);
          setUsername(res.data.username);
          setLikedPosts(res.data.likedpost);
          setYourPosts(res.data.yourpost);
          setLoggedin(true);
        } else {
          alert('User does not exist or password incorrect, please sign up.');
          setLoggedin(false);
        }
      })
      .catch(err => {
        console.error('Error logging in:', err);
        alert('Login failed.');
      });
  };

  const handleForgotPassword = async () => {
    let uname = prompt('Forgot Password functionality is not implemented yet.');
    if (uname) {
      const response = await axios.post(`${window.location.origin}/myacc/forgotpassword`, { uname });
      if (response.data === "nouser") {
        alert('User does not exist');
      } else {
        let newPassword = prompt('Enter new password');
        if (newPassword) {
          const resetResponse = await axios.post(`${window.location.origin}/myacc/forgotpassword/reset`, { uname, password: newPassword });
          if (resetResponse.data === 'success') {
            alert('Password reset successful');
          } else {
            alert('Password reset failed');
          }
        }
      }
    }
  };

  const PostCard = ({ title }) => (
    <div className="my-acc-post-card">
      <div className="my-acc-post-card-body">
        <h3 className="my-acc-post-card-title">{title}</h3>
      </div>
    </div>
  );

  return (
    <>
      {loggedin ? (
        <>
          <div className="my-acc-username-div">
            <p className="my-acc-username-pdiv">Hi {username}</p>
          </div>
          <div className="my-acc-liked-posts-header">
            <p className="my-acc-liked-posts-title">Your Liked Posts</p>
            <Link to='/'>
              <button className="my-acc-add-button">
                Add more <i className="fa-solid fa-plus"></i>
              </button>
            </Link>
          </div>
          <div className="my-acc-post-container">
            {likedPosts.map((post, index) => (
              <PostCard key={index} title={post} />
            ))}
          </div>
          <div className="my-acc-your-posts-header">
            <p className="my-acc-your-posts-title">Your Posts</p>
            <Link to='/'>
              <button className="my-acc-add-button">
                Create Post <i className="fa-solid fa-plus"></i>
              </button>
            </Link>
          </div>
          <div className="my-acc-post-container">
            {yourPosts.map((post, index) => (
              <PostCard key={index} title={post} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="my-acc-login-container">
            <div className="my-acc-login-box">
              <h2 className="my-acc-login-heading">Login</h2>
              <form onSubmit={handleSubmit} className="my-acc-login-form">
                <label className="my-acc-login-label">Username:</label>
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  className="my-acc-login-input"
                  required
                />
                <label className="my-acc-login-label">Password:</label>
                <input
                  type="password"
                  value={password}
                  onChange={handlePasswordChange}
                  className="my-acc-login-input"
                  required
                />
                <button onClick={handleForgotPassword} className="forgot-password-link">
                  Forgot Password?
                </button>
                <button
                  type="submit"
                  className="my-acc-login-button"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
          <div className="my-acc-signup-link">
            <span>Not Logged in? </span><Link to='/myacc/signup'>SignUp</Link>
          </div>
        </>
      )}
    </>
  );
};

export default LoginForm;
