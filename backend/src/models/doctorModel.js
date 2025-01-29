import mongoose from "mongoose"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt "

const doctorSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    dob:{
        type:Date,
        required:true
    },
    phone_no:{
        type:String,
        unique:true,
        required:true
    },
    gender:{
        type:String,
        enum:['Male','Female','Other'],
        required:true
    },
    specialization:{
        type:String,
        enum: [
            "Oncologist",
            "Neurologist",
            "Cardiologist",
            "Physician",
            "Dentist",
            "Child Specialist",
            "Dermatologist",
            "Radiologist",
            "Gastroenterologist",
            "Endocrinologist",
            "Psychiatrist",
            "Geriatrician",
            "Nephrologist",
            "Orthopaedist",
            "Allergist",
            "Hematologist",
            "Internist",
            "Gynaecologist",
            "Ophthalmologist",
            "Anesthesiologist",
            "Pulmonologist"
        ],
        required:true
    },
    experience:{
        type:Number,
        required:true
    },
    rating:{
        type:Number
    }
    ,
    city:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    fee:{
        type:Number,
        required:true
    },
    profilepic:{
        type:String //url
    },

    password:{
        type:String,
        required:[true,"Password field is required"]
    },
    refreshToken:{
        type:String
    }
},
{
    timestamps:true
});

doctorSchema.pre("save",async function (next){
    if(!this.isModified("password"))return next();

    this.password=bcrypt.hash(this.password,10);
    next();
})

doctorSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password)
    
}

doctorSchema.methods.generateAccessToken=function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            fullname:this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken=function(){
    return jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const Doctor=mongoose.model("Doctor",doctorSchema);