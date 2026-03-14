import type { RequestHandler } from 'express';
import { User } from '#models';
import bcrypt from 'bcrypt';
import { isValidObjectId } from 'mongoose';

type UserParams = { id: string };

type UserBody = {
    name?: string;
    email?: string;
    password?: string;
};

export const getUsers: RequestHandler = async (req, res) => {
    const users = await User.find().select('-password').lean();
    res.json(users);
}

export const createUser: RequestHandler<{}, unknown, UserBody> = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required', { cause: { status: 400 } });
    }

    const userExists = await User.exists({ email });
    if (userExists) {
        throw new Error('User already exists', { cause: { status: 409 } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({ name, email, password: hashedPassword });
    const { password: _password, ...safeUser } = createdUser.toObject();
    return res.status(201).json(safeUser);
}

export const getUser: RequestHandler<UserParams> = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
        throw new Error('Invalid user id format', { cause: { status: 400 } });
    }

    const foundUser = await User.findById(id).select('-password').lean();

    if (!foundUser) {
        throw new Error('User not found', { cause: { status: 404 } });
    }

    res.json(foundUser);
}

export const updateUser: RequestHandler<UserParams, unknown, UserBody> = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required', { cause: { status: 400 } });
    }

    if (!isValidObjectId(id)) {
        throw new Error('Invalid user id format', { cause: { status: 400 } });
    }

    const existingUser = await User.findById(id).select('_id').lean();
    if (!existingUser) {
        throw new Error('User not found', { cause: { status: 404 } });
    }

    const emailTakenByAnotherUser = await User.exists({ email, _id: { $ne: id } });
    if (emailTakenByAnotherUser) {
        throw new Error('User already exists', { cause: { status: 409 } });
    }

    const newUserData = { name, email, password: await bcrypt.hash(password, 10) };

    const updatedUser = await User.findByIdAndUpdate(id, newUserData, {
        returnDocument: 'after',
        runValidators: true,
    }).select('-password').lean();

    if (!updatedUser) {
        throw new Error('User not found', { cause: { status: 404 } });
    }

    res.json(updatedUser);
}

export const deleteUser: RequestHandler<UserParams> = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) {
        throw new Error('Invalid user id format', { cause: { status: 400 } });
    }
    const deletedUser = await User.findByIdAndDelete(id).lean();

    if (!deletedUser) {
        throw new Error('User not found', { cause: { status: 404 } });
    }

    res.status(204).send();
}