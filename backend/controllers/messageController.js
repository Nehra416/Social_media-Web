const Conversation = require("../models/conversationSchema")
const Message = require("../models/MessageSchema");
const { getRecieverSocketId, io } = require("../socket/socket");

const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const { textMessage:message } = req.body;
        console.log("message is : ",message)
        console.log("senderId is : ",senderId)
        console.log("receiverId is : ",receiverId)

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })

        // start the new conversation if not started...
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId] // style of passing id in the participants in schema ?????
            })
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
        })

        if (newMessage) conversation.message.push(newMessage._id); // push kisme kerni h ????
        await conversation.save()
        // await newMessage.save();

        // await newMessage.save() //  ?
        // await Promise.all([conversation.save(), newMessage.save()]) // ?

        // socket io...
        const recieverSocketId = getRecieverSocketId(receiverId);

        if(recieverSocketId){
            io.to(recieverSocketId).emit('newMessage', newMessage)
        }

        return res.status(201).json({
            success: true,
            newMessage
        })

    } catch (error) {
        console.log("Error is in the sendMessage controllers : ", error)
    }
}

const getMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate('message');
        // console.log("conversation is ",conversation)
        if (!conversation) return res.status(200).json({ success: true, message: [] })

            // return res.status(200).json({ success: true, message: conversation })
            return res.status(200).json({ success: true, message: conversation?.message })

    } catch (error) {
        console.log("Error is in the getMessage controllers : ", error)
    }
}

module.exports = {
    sendMessage,
    getMessage
}
