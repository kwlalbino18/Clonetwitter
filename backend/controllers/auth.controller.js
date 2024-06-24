import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";

export const signup =async (req, res) => {
 try {
    const {fullName, username, email, password} = req.body

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email address' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
        return res.status(400).json({ message: 'Email already exists' });
    }

//hash password
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(password, salt);
//guardamos el usuario en la base de datos

const newUser = new User({
    fullName,
    username,
    email,
    password: hashedPassword
})
if(newUser){
    generateTokenAndSetCookie(newUser._id, res)
    await newUser.save();
    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      follower: newUser.follower,
      following: newUser.following,
      profileImage: newUser.profileImage,
      coverImage: newUser.coverImage,


    });
}
else{
    res.status(400).json({ message: 'Error creating user' });
}

 } catch (error) {
    res.status(500).json({ message: error.message });
 }
}

export const login =async (req, res) => {
  try {
     const {username,password}=req.body;
     const user = await User.findOne({ username });
     const isPasswordCorrent = await bcrypt.compare(password, user.password || "");

     if(!user || !isPasswordCorrent){
         return res.status(400).json({ message: 'Invalid password' });
     }
     generateTokenAndSetCookie(user._id, res),
     res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        follower: user.follower,
        following: user.following,
        profileImage: user.profileImage,
        coverImage: user.coverImage,
     })
  } catch (error) {
    console.log("Error login controller:", error.message);
    res.status(500).json({ message: error.message });
  }
}


export const logout =async (req, res) => {
    try {
       res.cookie("jwt", "", {maxAge: 0})
       res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log("Error login controller:", error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getMe = async (req, res) => {
	try {
		const user = await User.findById(req.user._id).select("-password");
		res.status(200).json(user);
	} catch (error) {
		console.log("Error in getMe controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
};