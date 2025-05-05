const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
    text: {
        type: String,
        default: Date.now()
    },
    comments: [
        {
            text: {
                type: String,
                default: ""
            },
            commentBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            commentOn: {
                type: Date,
                default: Date.now() // IST timezone
            },
        }
    ]
    ,
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: ""
    },
    video: {
        type: String,
        default: ""
    },
    category:{
        type: String,
        default: "General"
    }
},{timestamps:true});

const PostModel = mongoose.model("Post", PostSchema);
module.exports = PostModel;