import { Request, Response } from 'express';
import UserService from '../services/userService';
import { createUserSchema } from '../validators/userValidator';
import { ZodError } from 'zod';

interface CreateUserParams {
  name: string;
  email: string;
  googleId: string;
  photo: string;
}

export const createUser = async (params: CreateUserParams) => {
  try {
    const { name, email, googleId, photo } = createUserSchema.parse(params);
    const user = await UserService.createUser({ name, email, googleId, photo });
    return user; // Retorna o usuário criado
  } catch (error) {
    if (error instanceof ZodError) {
      throw new Error('Erro de validação: ' + error.errors.map(e => e.message).join(', '));
    } else {
      throw new Error('Erro ao criar usuário: ' + (error as Error).message);
    }
  }
};

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await UserService.getAllUsers();
  res.json(users);
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;
  const user = await UserService.getUserByEmail(email);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  const user = await UserService.getUserById(id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'Usuário não encontrado' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  try {
    const { name, email, googleId, photo } = createUserSchema.parse(req.body);
    const user = await UserService.updateUser(id, { name, email, googleId, photo });
    res.json(user);
  } catch (error) {
    if (error instanceof ZodError) {
      res.status(400).json({ error: 'Erro de validação', details: error.errors });
    } else {
      res.status(500).json({ error: 'Erro ao atualizar usuário: ' + (error as Error).message });
    }
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await UserService.deleteUser(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário: ' + (error as Error).message });
  }
};