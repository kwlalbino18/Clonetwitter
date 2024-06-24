import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();
const app=express();
const port=process.env.PORT || 5000;


app.use("/api/auth",authRoutes);

app.listen(8000,()=>{
    console.log(`Listening on port ${port}`);
    connectMongoDB();
})