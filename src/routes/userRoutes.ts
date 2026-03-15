import { createUser, deleteUser, getUser, getUsers, updateUser } from '#controllers';
import { validateBody, validateParams } from '#middleware';
import { userInputSchema, userParamsSchema } from '#schemas';
import { Router } from 'express';

const userRoutes = Router();

userRoutes
	.route('/')
	.get(getUsers)
	.post(validateBody(userInputSchema), createUser);

userRoutes
	.route('/:id')
	.get(validateParams(userParamsSchema), getUser)
	.put(validateParams(userParamsSchema), validateBody(userInputSchema), updateUser)
	.delete(validateParams(userParamsSchema), deleteUser);

export default userRoutes;