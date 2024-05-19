import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import mongoose from "mongoose";
const PORT = 5000;

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((res) => console.log(`mongodb connected successfully`));

const User = mongoose.model("User", {
  username: String,
  password: String,
});

const secretKey = "aatif3313";

app.post("/register", async(req, res) => {
    try {
        const {username,password}=req.body;
        const user=new User({username,password:password});
        await user.save();

        res.json({message:"User registeration successfully"})
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Registeration failed"})
    }
});

app.post("/login", async(req, res) => {
    try {
        const {username,password}=req.body;
        const user=await User.findOne({username});
        if(!user){
            res.status(401).json({message:"Invalid credentials"});
            return;

        }
        const token =jwt.sign({username:user.username},secretKey,{expiresIn:'1h'});
        res.json({token});

        
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"login failed"})
    }
});

app.get("/", (req, res) => {
  res.json({message:"This is a protected route"})
});

app.listen(PORT, () => {
  console.log(`server listen http://localhost:${PORT}`);
});
