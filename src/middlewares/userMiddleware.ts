import { Request, Response } from 'express';
import { createUser } from '../controllers/userController';

export const createUserWrapper = async (req: Request, res: Response) => {
  const { name, email, googleId, photo } = req.body;
  await createUser({ name, email, googleId, photo });
};