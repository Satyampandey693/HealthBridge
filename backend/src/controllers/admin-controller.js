import { User } from "../models/user.js";
import { Doctor } from "../models/doctorModel.js";

export const getAllUsers=async(req,res)=>{
    try{
        const users=await User.find({},{password:0});
        if(!users||users.length===0){
            return res.status(404).json("No users found");
        }
        console.log(users);
        return res.status(200).json(users);
    }
    catch(error){
        next(error);
    }
}

export const getAllDoctors=async(req,res)=>{
    try{
        const doctors=await Doctor.find({},{password:0});
        if(!doctors||doctors.length===0){
            return res.status(404).json("No users found");
        }
        return res.status(200).json(doctors);
    }
    catch(error){
        next(error);
    }
}

export const getUserById=async(req,res)=>{
    try{
        const id=req.params.id;
        const data=await User.findOne({_id:id},{password:0});

        return res.status(200).json(data);
    }
    catch(error){
        next(error);
    }
}

export const getDoctorById=async(req,res)=>{
    try{
        const id=req.params.id;
        const data=await Doctor.findOne({_id:id},{password:0});

        return res.status(200).json(data);
    }
    catch(error){
        next(error);
    }
}

export const updateUserById=async(req,res)=>{
    try{
        const id=req.params.id;
        const updatedData=await User.updateOne(
            {_id:id},{
                $set:req.body
            });

        return res.status(200).json(updatedData);
    }
    catch(error){
        next(error);
    }
}

export const updateDoctorById=async(req,res)=>{
    try{
        const id=req.params.id;
        const updatedData=await Doctor.updateOne(
            {_id:id},{
                $set:req.body
            });

        return res.status(200).json(updatedData);
    }
    catch(error){
        next(error);
    }
}
export const deleteUserById=async(req,res)=>{
    try{
        const id=req.params.id;
       await User.deleteOne({_id:id});

        return res.status(200).json("user deleted successfully");
    }
    catch(error){
        next(error);
    }
}
export const deleteDoctorById=async(req,res)=>{
    try{
        const id=req.params.id;
        await Doctor.deleteOne({_id:id});

        return res.status(200).json("doctor deleted successfully");
    }
    catch(error){
        next(error);
    }
}