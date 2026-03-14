import { createUser, deleteUser, getUser, getUsers, updateUser } from '#controllers';
import { Router } from 'express';

const userRoutes = Router();

userRoutes
	.route('/')
	.get(getUsers)
	.post(createUser);

userRoutes
	.route('/:id')
	.get(getUser)
	.put(updateUser)
	.delete(deleteUser);

export default userRoutes;