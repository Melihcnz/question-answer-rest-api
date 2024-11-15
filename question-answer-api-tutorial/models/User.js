const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const Question = require("./Question");

const UserSchema = new Schema({
    name : {
    type : String,
    required : [true,"Please provide a name"]
    },
    email : {
        type : String,
        required : [true,"Please provide a email"],
        unique : true,
        match : [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid  email"
        ]
    },
    role : {
        type : String,
        default : "user",
        enum : ["user","admin"]
    },
    password : {
        type : String,
        minlenght : [6, "Please provide a password with min lenght 6"],
        required : [true,"Please provide a password"],
        select : false
    },
    createdAt : {
        type : Date,
        default : Date.now
    },
    title : {
        type : String
    },
    about : {
        type : String
    },
    place : {
        type : String
    },
    website : {
        type : String
    },
    profile_image : {
        type : String,
        default : "default.jpg"
    },
    blocked : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : {
        type : String
    },
    resetPasswordExpire : {
        type : Date
    }
});
//UserSchema Methods
UserSchema.methods.generateJwtFromUser = function(){
    const {JWT_SECRET_KEY,JWT_EXPIRE} = process.env;

    const payload = {
        id : this._id,
        name : this.name 
    };

    const token = jwt.sign(payload,JWT_SECRET_KEY,{
        expiresIn : JWT_EXPIRE
    });
    return token;
};
UserSchema.methods.getResetPasswordTokenFromUser = function() {
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto
        .createHash("SHA256")
        .update(randomHexString)
        .digest("hex");
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
};
UserSchema.pre("save", function (next) {
    const user = this; // this bağlamını user olarak alıyoruz

    // Eğer şifre değiştirilmediyse, devam et
    if (!user.isModified('password')) return next();

    // Salt üretimi ve hashleme
    bcrypt.genSalt(10, function (err, salt) {
        if (err) return next(err); // Salt üretiminde hata varsa

        // Şifreyi hashle
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err); // Hashleme hatası varsa

            // Hashlenmiş şifreyi kullanıcının password alanına atıyoruz
            user.password = hash;
            next();
        });
    });
});


module.exports = mongoose.model("User",UserSchema);