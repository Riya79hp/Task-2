const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require("path");
const app = express();

const uri = "mongodb+srv://ashokiow24680:pE8Y62KnIFY7xftA@merntask2.665lnih.mongodb.net/?retryWrites=true&w=majority&appName=Merntask2";

mongoose.connect(uri);


const UserSchema = new mongoose.Schema({
  password: { 
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  likedpost: {
    type: [String] ,
    
  },
  yourpost: {
    type: [String],
    
  }
});

const PostSchema = new mongoose.Schema({
 
  username:{
    type:String,
    required:true
  },
  content: {
    type: String,
    required: true
  },
  likecount: {
    type: Number,
    default: 0
  },
  comments: [{  
    commentusername: {
      type: String,  
      required: true
    },
    content: {
      type: String,
      required: true
    }
  }]

});



const Userdata = mongoose.model('userdata', UserSchema);
const Post = mongoose.model('posts', PostSchema);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  app.use(express.static(path.resolve(__dirname, "Front-end", "build")));
  res.sendFile(path.resolve(__dirname, "Front-end", "build", "index.html"));
  });

  app.get("/", (req, res) => {
    app.use(express.static(path.resolve(__dirname, "Front-end", "build")));
    res.sendFile(path.resolve(__dirname, "Front-end", "build", "index.html"));
    });
    
app.post('/myacc', async (req, res) => { 
  const { username, password } = req.body;
  const user = await Userdata.findOne({ username, password });

  if (user) {
    res.json({ result: "success", id: user._id, likedpost: user.likedpost, yourpost: user.yourpost });
  } else {
    res.json({ message: 'User does not exist' });
  }
});

// Authenticate user by ID
app.post('/myacc/signup/authenticateuser', async (req, res) => { 
  const { query } = req.body;
  const user = await Userdata.findById(query);

  if (user) {
    res.json({ result: "success", id: user._id, username: user.username,likedpost: user.likedpost, yourpost: user.yourpost });
  } else {
    res.json({ message: 'User does not exist' });
  }
});

// User signup
app.post('/myacc/signup', async (req, res) => { 
  const { username, password } = req.body;
  const user = new Userdata({
    username,
    password,
    likedpost: [],
    yourpost: []
  });
  await Userdata.insertMany([user]);
let  x= await Userdata.findOne({username:user.username});
res.json({id:x._id});

  
   

  
});

// Create a new post
app.post('/create', async (req, res) => {
  const  content  = req.body.content;
  const userId = req.body.id;
  const postid=req.body.postid;

  try {
    const user = await Userdata.findById(userId);
    console.log(user);
    if (user) {
      const newPost = {
       
        username: user.username,
        content,
        comments:[],
        likecount: 0,
      }
      user.yourpost.push(content);
      
    await user.save();

   
    await Post.insertMany([newPost]);

    
      res.json(newPost);
    } 
    else {
      res.json({ message: 'User not found' });
    }
  } catch (error) {
    res.json({ message: 'Error creating post', error });
  }
});
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
       
    res.json(posts);
  } catch (error) {
    res.json({ message: 'Error fetching posts', error });
  }
});
// Add a comment to a post
app.patch('/post/comment/:id', async (req, res) => {
  const { id } = req.params;
  const { comment, userid } = req.body;

  if (!comment || !userid) {
    return res.status(400).json({ message: 'Comment or User ID missing' });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const commentuname=await Userdata.findById(userid);

    post.comments.push({ commentusername:commentuname.username, content: comment });
    await post.save();
    console.log(post);

    res.json(post);
  } catch (error) {
    res.status(400).json({ message: 'Error adding comment', error });
  }
});

// Like a post
// Like a post (PATCH request)
app.patch('/post/like/:id', async (req, res) => {
  const { id } = req.params; // Post ID
  const  userid  = req.body.id; // User ID

  try {
    const post = await Post.findById(id);
    if (post) {
      post.likecount += 1;
      await post.save();

      const user = await Userdata.findById(userid);
      if (user) {
        user.likedpost.push(post.content);
        await user.save();
      } else {
        console.error('User not found when liking post');
      }

      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Server error', error }); // Handle other errors gracefully
  }
});
app.post('/getuname', async (req, res) => {
  const id=req.body.id;
  try {
    const name = await Userdata.findById(id);
       
    res.json(name.username);
  } catch (error) {
    res.json({ message: 'Error fetching posts', error });
  }
});
app.delete('/delete/:id', async (req, res) => {
  const id=req.params.id;
  try {
    await Post.findByIdAndDelete(id);
  } catch (error) {
    res.json({ message: 'Error fetching posts', error });
  }
});
app.patch('/update/:id',async (req, res) => {
  const id=req.params.id;
  const input=req.body.input;
  try {
    let newpost = await Post.findById(id);
    newpost.content=input;
   await newpost.save()
  } catch (error) {
    res.json({ message: 'Error fetching posts', error });
  }
})

app.post('/myacc/forgotpassword', async (req, res) => {
  const username=req.body.uname;
  try {
    const name = await Userdata.findOne({username:username});
       if(name){
    res.json("sucess");
       }
       else{
        res.json("nouser");
       }
  } catch (error) {
    res.json({ message: 'Error fetching posts', error });
  }
});
app.post('/myacc/forgotpassword/reset', async (req, res) => {
  const username=req.body.uname;
  const password=req.body.password;
  try {
    const name = await Userdata.findOne({username:username});
    name.password=password;
    await name.save();
      
    if(name){
      res.json("success");
       }
      else{
        res.json("nosuccess");
       }
  } catch (error) {
    res.json({ message: 'Error fetching posts', error });
  }
});

app.listen(4500, () => {
  console.log("server started on port 4500");
});
