const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const cookieParser = require("cookie-parser");
const connectDb = require("./lib/db.js");

dotenv.config();
connectDb();
const app = express();
//built-in middleware
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/post",postRoutes);

app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})




