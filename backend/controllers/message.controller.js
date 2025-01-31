import Message from "../models/message.model.js";
import User from "../models/user.model.js";

const getUsers = async (req,res)=>{
    try {
        const loggedUserId = req.user._id;
        const users = await User.find({ _id: { $ne: loggedUserId } }).select("-password");
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ msg: 'Internal server error' });
        
    }
}   
const getMessages = async (req,res)=>{
    try {
        const {id} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { sender: myId, receiver: id },
                { sender: id, receiver: myId },
            ],
        }).sort({ createdAt: 1 }).populate('sender','name').populate('receiver','name');
        return res.status(200).json(messages);
    } catch (error) {
        return res.status(500).json({ msg: 'Internal server error' });
        
    }
}
const sendMessage = async (req,res)=>{
   try {
    const {text,image} = req.body;
    const {id} = req.params;
    const sender = req.user._id;
    let imageUrl;
    if(image){
        const cloudinaryRes = await cloudinary.uploader.upload(image)
        imageUrl = cloudinaryRes.secure_url
    }
    const message = new Message({
        text,
        images:imageUrl,
        sender,
        receiver:id
    });
    await message.save();
    return res.status(201).json(message)
   } catch (error) {
    return res.status(500).json({ msg: 'Internal server error' });
   }
}
export { getUsers,getMessages,sendMessage }