import type { RequestHandler } from 'express';
import { User } from '#models';
import { normalize } from '#utils';
import bcrypt from 'bcrypt';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod/v4';
import { userInputSchema } from '#schemas';

type UserParams = { id: string };

type UserInputDTO = z.infer<typeof userInputSchema>;

export const getUsers: RequestHandler = async (req, res) => {
    const users = await User.find().select('-password').lean();
    res.json(users.map(normalize));
}

export const createUser: RequestHandler<{}, unknown, UserInputDTO> = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new Error('Name, email, and password are required', { cause: { status: 400 } });
    }

    const userExists = await User.exists({ email });
    if (userExists) {
        throw new Error('User already exists', { cause: { status: 409 } });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({ name, email, password: hashedPassword } satisfies UserInputDTO);
    const { password: _password, ...safeUser } = createdUser.toObject();
    return res.status(201).json(normalize(safeUser));
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

    res.json(normalize(foundUser));
}

export const updateUser: RequestHandler<UserParams, unknown, UserInputDTO> = async (req, res) => {
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

    const updatedUser = await User.findByIdAndUpdate(id, newUserData satisfies UserInputDTO, {
        returnDocument: 'after',
        runValidators: true,
    }).select('-password').lean();

    if (!updatedUser) {
        throw new Error('User not found', { cause: { status: 404 } });
    }

    res.json(normalize(updatedUser));
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