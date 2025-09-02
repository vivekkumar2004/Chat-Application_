import { generateToken } from "../lib/utils";
import User from "../models/User";




// Signup a new user
export const signup = async (req,res)=>{
    const {fullName, email, password, bio} = req.body;

    try {
        if(!fullName || !email || !password || !bio){
            return res.json({success: false, message: "Missing Details"})
        }
        const user = await User.findOne({email});

        if(user){
            return res.json({success: false, message: "Account already exists"})
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullName, email, password:hashedPassword, bio
        });

        const token = generateToken(newUser._id)

        res.json({success: true, userData: newUser, token, message: "Account created successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
        
    }
}

// Controller to login a user
export const login = async (req,res)=>{
    try {
        const { email, password } = req.body;
        const userData = await User.findOne({email})

        const isPasswordCorrect = await bcrypt.compare(password,  userData.password);

        if(!isPasswordCorrect){
            return res.json({success: false, message: "Invalid credentials"});
        }

        const token = generateToken(userData._id)

        res.json({success: true, userData, token, message: "Login successfully"})

    } catch (error) {
        console.log(error.message);
        res.json({success: false, message: error.message})
    }
}

// Controller to check if user us authenticated
export const checkAuth = (req,res)=>{
    res.json({success: true, user: req.user});
}