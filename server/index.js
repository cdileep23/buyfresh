import express from "express";
import cors from "cors";
import connect from "./db.js";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv"
import userRoute from "./routes/user-route.js"
import productRoute from   "./routes/product-route.js"
import orderRoute from "./routes/order-route.js"


dotenv.config()

const app=express();

const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, 
  };
  
  app.use(cors(corsOptions));
  
app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.urlencoded({extended:true}))


app.use('/api/user',userRoute);
app.use('/api/product',productRoute);
app.use('/api/order',orderRoute);

const startServer=async()=>{
    try {
        connect()
        app.listen(process.env.PORT|| 8080, ()=>{
            console.log(`Server running at port ${process.env.PORT}`);
        })
    } catch (error) {
       console.log(error);  
    }
}
app.get("/", (req,res)=>{

    res.send("Hello from backend")
})


startServer();