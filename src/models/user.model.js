import mongoose,{Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const userSchema = new Schema( 
    {
        userName:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        email:{
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        fullName:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        avatar:{
            type: String,
        },
        coverImage:{
            type:String,
        },
        password: {
            type: String,
            required: [true , 'password is required']
        },
        refreshToken: {
            type: String,
        },
        role:{
            type: String,
            // required: true ,
        },
        personalEmail:{
            type: String,
            default: '-'
            // unique: true,
            // lowercase: true,
            // trim: true,
        },
        rollNo:{
            type: String,
            unique: true,
            lowercase: true,
            trim: true,
        },
        address:{
            type: String,
            lowercase: true,
            default: '-'
        },
        gender:{
            type:String,
            default: '-'
        },
        course:{
            type:String,
            default: '-'
        },
        about:{
            type:String,
            default: '-'
        },
        department:{
            type:String,
            default: '-'
        },
        phoneNo:{
            type:String,
            default: '-'
        },
        oneOne:{
            type:String,
            default: '-'
        },
        oneTwo:{
            type:String,
            default: '-'
        },
        twoTwo:{
            type:String,
            default: '-'
        },
        threeOne:{
            type:String,
            default: '-'
        },
        threeTwo:{
            type:String,
            default: '-'
        },
        fourOne:{
            type:String,
            default: '-'
        },
        fourTwo:{
            type:String,
            default: '-'
        },
        palced:{
            type:Boolean,
            default: 'false'
        },
        offers:{
            type:[String]
        },
        resume:{
            type:String,
        },
        percentage:{
            type:Number,
            default: '0'
        },
    },
    {
        timestamps: true,
    }
)

userSchema.pre("save",async function(next) {
    if (!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            userName: this.userName,
            fullName: this.fullName,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = async function(){
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);