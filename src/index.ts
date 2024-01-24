import express from "express";
import http from "http";
import bodyParser from "body-parser"
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
import router from './router'

//console.log("Hello TypeScript! And Node.... ");

const app = express();

app.use(cors({
   credentials:true
}));

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);


server.listen(8080,()=>{
    console.log("Server Is listening on http://localhost:8080");
});

const username = "restful-api";
const password = "Test@123";
const encodedPassword = encodeURIComponent(password);
console.log(username);
console.log(password);

// Using the encoded password in the MongoDB connection URL
const MONGO_URL = `mongodb+srv://${username}:${encodedPassword}@cluster0.0966mvl.mongodb.net/RestApi?retryWrites=true&w=majority`;
mongoose.Promise = Promise;
mongoose.connect(MONGO_URL);
mongoose.connection.on('error',(error:Error)=>console.log(error));
console.log("Connection Success To Mongo")

app.use('/',router());