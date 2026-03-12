import { createUser, deleteUser, getUser, getUsers, updateUser } from "#controllers";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get('/', getUsers);
userRoutes.post('/', createUser);
userRoutes.get('/:id', getUser);
userRoutes.put('/:id', updateUser);
userRoutes.delete('/:id', deleteUser);

export default userRoutes;