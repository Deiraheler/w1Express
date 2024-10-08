import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phonenumber: { type: String, required: true },
    email: { type: String, required: true },
    dateJoined: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now },
});

export const User = mongoose.model("User", userSchema);

export const ValidateUser = (user: any) => {
    const contactJoiSchema = Joi.object({
        name: Joi.string().min(3).required(),
        phonenumber: Joi.string().min(10).required(),
        email: Joi.string().email().required(),
    });

    return contactJoiSchema.validate(user);
};