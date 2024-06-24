import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

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
    generateTokenandSetCookie(newUser._id, res)
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
    res.json({
        data:"login endpoint"
    })
}


export const logout =async (req, res) => {
    res.json({
        data:"logout endpoint"
    })
}