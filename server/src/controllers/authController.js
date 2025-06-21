import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../configs/stream.js";
import User from "../models/User.js";

export const signup = async (req, res) => {
    const { email, password, fullName } = req.body;

    try {
        if(!email || !password || !fullName){
            return res.status(400).json({ message: 'All fields are required'})
        }

        if(password.length < 6){
            return res.status(400).json({ message: 'Password must be atleast 6 characters'})
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(400).json({ message: 'User already exists with this email' });
        }

        // const idx = Math.floor(Math.random() * 100) + 1;
        // const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
        const randomAvatar = "";

        const newUser = await User.create({
            fullName,
            email,
            password,
            profilePic: randomAvatar
        })

        try {
            // Upsert user in Stream
            await upsertStreamUser({
                id: newUser._id.toString(),
                name: newUser.fullName,
                image: newUser.profilePic || 'https://default-avatar-url.com/default.png' 
            });
        } catch (error) {
            console.error('Error upserting Stream user:', error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production  
            sameSite: 'strict' // Helps prevent CSRF attacks
        })

        res.status(201).json({ success: true, message: 'User created successfully', user: newUser, token });

    } catch (error) {
        console.error('Error occurred during signup:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(401).json({ message: 'All fields are required' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const isPasswordValid = await user.comparePassword(password);
        if(!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }
        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
            expiresIn: '7d'
        });

        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production', 
            sameSite: 'strict' 
        })

        res.status(200).json({ success: true, message: 'User logged in successfully', user, token });


    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req, res) => {
    res.clearCookie("jwt");
    res.status(200).json({ success: true, message: 'User logged out successfully' });
}