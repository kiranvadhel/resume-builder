import User from "../models/user.js";
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import Resume from "../models/Resume.js";


const generateToken = (userId) =>{
    const token = jwt.sign({id:userId},process.env.JWT_SECRET,{
        expiresIn:"7d"
    })
    return token;   
}

export const registerUser =async (req,res)=>{
    try{
        const{name,email,password} = req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:"Please fill all the fields"});
        }

        const user=await User.findOne({email})
        
                        if(user){
                return res.status(400).json({message:"User already exists"});
            }
            
             const hashedPassword = await bcrypt.hash(password,10);
        const newUser = new User({
            name,
            email,
            password:hashedPassword
        })
        await newUser.save(); 

        const token =generateToken(newUser._id)
        newUser.password= undefined;

        return res.status(201).json({
            message:"User registered successfully",
            user:newUser,
            token})

        }
        catch(error){
            return res.status(400).json({message:'user already exists'});


        }


    }

    //login user


    export const loginUser =async(req,res)=>
    {
        try
        {

            const{email, password } = req.body;

         const user = await User.findOne({email})
         if(!user){
            return res.status(400).json({message:'Invalid email or password'});
         }

         // if password is correct
       const isMatch = await bcrypt.compare(password, user.password);
            if(!isMatch){
                return res.status(400).json({message:'Invalid email or password'});
            }

            const token = generateToken(user._id);
            user.password = undefined;

            return res.status(200).json({
                message:"User logged in successfully",
                user,
                token
            });

        }
        catch(error){
            return res.status(400).json({message:'Invalid credentials'});
        }
    }

    //getting user by id


    export const getUserById =async(req,res)=>
{
    try{
        const userId = req.userid;

        //check if user exists
        
        const user = await User.findById(userId);       
        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        //   return user
        user.password = undefined;
        return res.status(200).json({user});

    }
    catch(error){
        return res.status(400).json({message:error.message});
    }

}


// controller for getting user resume


export const getUserResume =async(req,res)=>
{
    try{
        const userId = req.userid;
        const resume = await Resume.find({userId});
       
        return res.status(200).json({ resumes: resume });
    }
    catch(error){
        return res.status(400).json({message:error.message});
    }

}


