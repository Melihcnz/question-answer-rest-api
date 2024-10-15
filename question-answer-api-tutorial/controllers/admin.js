const User = require('../models/User');
const CustomError = require('../helpers/error/CustomError');
const asyncErrorWrapper = require('express-async-handler');
const Question = require('../models/Question')


const blockUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    const user = await User.findById(id);

    user.blocked = !user.blocked;

    await user.save();

    return res.status(200).json({
        success: true,
        message: "Block - Unblock Successful"
    });
});

const deleteUser = asyncErrorWrapper(async (req, res, next) => {
    const { id } = req.params;

    // Kullanıcıyı bul
    const user = await User.findById(id);

    // Kullanıcı bulunamadıysa hata döndür
    if (!user) {
        return next(new CustomError("User not found", 404));
    }

    // Kullanıcıya ait tüm soruları sil
    await Question.deleteMany({ user: user._id });

    // Kullanıcıyı sil
    await user.deleteOne(); 

    return res.status(200).json({
        success: true,
        message: "User and associated questions deleted successfully"
    });
});


module.exports = {
    blockUser,
    deleteUser
};
