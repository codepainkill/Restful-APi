import express from "express";
import {get,merge} from 'lodash';

import { getUserBySessionToken } from "../db/users";

export const isOwner = async(req:express.Request,res:express.Response,next:express.NextFunction)=>{
    try{
        const id = req.params.id as string;
        console.log("Id: "+id);
        //console.log("Current user Info: "+get(req,'identity._id'))
        const currentuserid = get(req,'identity._id') as string;
        //console.log("Current User Id: "+currentuserid);
        if(!currentuserid)
        {
            res.sendStatus(403);
        }

        if (id !== currentuserid.toString())
        {
           res.sendStatus(403);
        }

        next();

    }
    catch(error){
        console.error(error);
        return res.sendStatus(400);
    }
}


export const isAuthenticated =async (req:express.Request,res:express.Response,next:express.NextFunction) => {
 
    try{
        const sessionToken = req.cookies["ADARSH-AUTH"];
        if(!sessionToken){
            return res.sendStatus(403);
        }

        const existinguser = await getUserBySessionToken(sessionToken);
        if(!existinguser){
            return res.sendStatus(403);
        }

        console.log("Existing User: "+existinguser);

        merge(req,{identity:existinguser});
        return next();
    }
    catch(error){
        console.error(error);
        return res.sendStatus(400);

    }
}