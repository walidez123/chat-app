import mongoose from "mongoose";

const { Schema } = mongoose;

const messageSchema = new Schema({
    text :{
        type: String,
        required: true
    },
    images:{
        type:String
    },
    sender :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiver :{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    read :{
        type: Boolean,
        default: false
    }

},{timestamps : true});

const Message = mongoose.model("Message", messageSchema);

export default Message;