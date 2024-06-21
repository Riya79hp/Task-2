import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PostComponent = () => {
  const [content, setContent] = useState('');
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState({});
  const [comments, setComments] = useState({});

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [posts]);

  const fetchPosts = async () => {
    const id = localStorage.getItem('id');
    try {
      const response = await axios.get(`${window.location.origin}/posts`);
      let postsData = response.data;

      if (id) {
        const userResponse = await axios.post(`${window.location.origin}/getuname`, { id });
        const username = userResponse.data;

        postsData = postsData.map(post => ({
          ...post,
          dustbin: post.username === username,
          update: post.username === username
        }));
      }

      const likedPostsState = {};
      if (id) {
        const userResponse = await axios.post(`${window.location.origin}/myacc/signup/authenticateuser`, { query: id });
        const userLikedPosts = userResponse.data.likedpost || [];
        postsData.forEach(post => {
          likedPostsState[post._id] = userLikedPosts.includes(post.content);
        });
      } else {
       
        postsData.forEach(post => {
          likedPostsState[post._id] = false;
        });
      }

      setPosts(postsData);
      setLikedPosts(likedPostsState);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleCreatePost = async () => {
    let id = localStorage.getItem('id');
    if (!id) {
      alert("You are not logged in. Please log in to see and create posts.");
      return;
    }
    try {
      const response = await axios.post(`${window.location.origin}/create`, { content, id });
      setPosts([...posts, response.data]);
      setContent('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleAddComment = async (postId) => {
    let id = localStorage.getItem('id');
    if (!id) {
      alert("You are not logged in. Please log in to comment.");
      return;
    }

    try {
      const response = await axios.patch(`http://localhost:4500/post/comment/${postId}`, { comment: comments[postId], userid: id });
      const updatedPost = response.data;

      const updatedPosts = posts.map(post =>
        post._id === updatedPost._id ? updatedPost : post
      );

      setPosts(updatedPosts);
      setComments({ ...comments, [postId]: '' });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleLikePost = async (postId) => {
    let id = localStorage.getItem('id');
    if (!id) {
      alert("You are not logged in. Please log in to like posts.");
      return;
    }
    try {
      await axios.patch(`http://localhost:4500/post/like/${postId}`, { id });
      setLikedPosts({ ...likedPosts, [postId]: true });
      fetchPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const deletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:4500/delete/${postId}`);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const updatePost = async (postId) => {
    const input = prompt("Edit the post");
    await axios.patch(`http://localhost:4500/update/${postId}`, { input });
    fetchPosts();
  };

  const handleCommentChange = (postId, value) => {
    setComments({ ...comments, [postId]: value });
  };

  return (
    <div className="post-container">
      <div className="post-form">
        <h2>Create Post</h2>
        <textarea
          className="post-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your post here..."
        />
        <button className="post-button" onClick={handleCreatePost}>
          <i className="fas fa-pencil-alt"></i> Post
        </button>
      </div>
      <div className="post-list">
        <h2>Posts</h2>
        {posts.map((post) => (
          <div key={post._id} className="post-item">
            <p className="post-username">@{post.username} Posted</p>
            <p className="post-content">{post.content}</p>
            {post.dustbin && (
              <button onClick={() => deletePost(post._id)}>
                <i className="fas fa-trash"></i>
              </button>
            )}
            {post.update && (
              <button onClick={() => updatePost(post._id)}>
                <i className="fas fa-pencil-alt"></i>
              </button>
            )}
            <p className="post-likecount">Likes: {post.likecount}</p>
            <button
              className="post-like-button"
              onClick={() => handleLikePost(post._id)}
              disabled={likedPosts[post._id]}
            >
              <i className={likedPosts[post._id] ? "fas fa-thumbs-up" : "far fa-thumbs-up"}></i>
            </button>
            <div className="post-comment-section">
              <input
                type="text"
                className="post-comment-input"
                value={comments[post._id] || ''}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                placeholder="Add a comment..."
              />
              <button className="post-comment-button" onClick={() => handleAddComment(post._id)}>Comment</button>
            </div>
            <div className="post-comments">
              {post.comments && post.comments.map((ele, index) => (
                <div key={index} className="post-comment-item">
                  <p className="comment-username">@{ele.commentusername} commented</p>
                  <p className="comment-content">{ele.content}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComponent;
