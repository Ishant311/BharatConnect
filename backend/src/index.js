const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const postRoutes = require("./routes/postRoutes.js");
const cookieParser = require("cookie-parser");
const connectDb = require("./lib/db.js");

dotenv.config();
connectDb();
const app = express();
//built-in middleware
//https://bharat-connect-brown.vercel.app
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));
app.use(express.json({}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/post",postRoutes);



app.use(express.static(path.join(__dirname, '../../Frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../Frontend/dist', 'index.html'));
});



app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
})




