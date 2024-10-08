import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import { User, ValidateUser } from '../models/user';
import Joi from "joi"; // Import User and validation function

// Get all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error retrieving users: ${errorMessage}`); // Log the error for debugging
        res.status(500).send('Oops! Something went wrong.');
    }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const id = new ObjectId(req.params.id);
        const user = await User.findOne({ _id: id });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).send(`No user found with id: ${req.params.id}`);
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error retrieving user with id: ${req.params.id}, Error: ${errorMessage}`); // Log the error for debugging
        res.status(500).send(`Error retrieving user with id: ${req.params.id}`);
    }
};

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    // Validate the user data using Joi
    const validateResult: Joi.ValidationResult = ValidateUser(req.body);

    if (validateResult.error) {
        res.status(400).json(validateResult.error);
        return;
    }

    try {
        const newUser = new User({
            ...req.body,
            dateJoined: new Date(),
            lastUpdated: new Date(),
        });

        const result = await newUser.save();

        res.status(201).json({
            message: `User created with id: ${result._id}`,
            id: result._id,
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error creating user: ${errorMessage}`); // Log the error for debugging
        res.status(400).send('Unable to create a new user.');
    }
};

// Update user by ID
export const updateUser = async (req: Request, res: Response) => {
    // Validate the updated user data using Joi
    const validateResult: Joi.ValidationResult = ValidateUser(req.body);

    if (validateResult.error) {
        res.status(400).json(validateResult.error);
        return;
    }

    try {
        const id = new ObjectId(req.params.id);
        const result = await User.updateOne({ _id: id }, { $set: { ...req.body, lastUpdated: new Date() } });

        if (result.matchedCount > 0) {
            res.status(200).json({ message: `User with id ${id} updated successfully` });
        } else {
            res.status(404).json({ message: `No user found with id ${id}` });
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error updating user with id ${req.params.id}: ${errorMessage}`); // Log the error for debugging
        res.status(500).send('An error occurred while updating the user.');
    }
};

// Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const id = new ObjectId(req.params.id);
        const result = await User.deleteOne({ _id: id });

        if (result.deletedCount > 0) {
            res.status(202).json({ message: `Successfully removed user with id ${id}` });
        } else {
            res.status(404).json({ message: `No user found with id ${id}` });
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        console.error(`Error deleting user with id ${req.params.id}: ${errorMessage}`); // Log the error for debugging
        res.status(500).send('Error deleting user.');
    }
};
