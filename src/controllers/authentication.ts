import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { authentication, random } from '../helpers';


export const login = async(req:express.Request,res:express.Response)=>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
           return res.sendStatus(400);

        }
        const user = await  getUserByEmail(email).select("+authentication.salt +authentication.password");
        if (!user){
            return res.sendStatus(400);
        }

        const expectedHash = authentication(user.authentication.salt,password);
        //const userPass = authentication(user.authentication.salt,req.body.password);
        if(expectedHash != user.authentication.password){
            console.log("Expected: "+expectedHash);
            console.log("realone: "+user.authentication.password);
           return res.sendStatus(403);
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt,user._id.toString());
        await user.save();
        res.cookie('ADARSH-AUTH',user.authentication.sessionToken,{domain:"localhost",path:"/"});
        return res.status(200).json(user).end();

    }
    catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}

export const register = async(req:express.Request,res:express.Response)=>{
    try{
        const {email,username,password} = req.body;
        if(!email || !password || !username)
        {
            return res.sendStatus(400);
        }

        const existinguser = await getUserByEmail(email);

        if(existinguser)
        {
           return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication :{
                salt,
                password:authentication(salt,password),
            },
        });
        return res.status(200).json(user).end();
    }
    catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
}