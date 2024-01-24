import express from 'express';
import {delUsers, getAllUsers, updateUser} from "../controllers/users";
import { isAuthenticated,isOwner } from '../middlewares';



export default(router:express.Router)=>{
    router.get('/users',isAuthenticated,getAllUsers);
    router.delete('/users/:id',isAuthenticated,isOwner,delUsers)
    router.put('/users/:id',isAuthenticated,isOwner,updateUser)
};
