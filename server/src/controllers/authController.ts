import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import { registerSchema, loginSchema } from '../validations/authSchema';

const sendTokenResponse = (user: any, statusCode: number, res: Response) => {
  const secret = (process.env.JWT_SECRET || 'secret') as string;
  const expiresIn = (process.env.JWT_EXPIRE || '30d') as any;
  const token = jwt.sign({ id: user._id }, secret, { expiresIn });
  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
};

export const register = async (req: Request, res: Response) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { name, email, password, role } = validatedData;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    const user = await User.create({ name, email, password, role });
    sendTokenResponse(user, 201, res);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors || err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    const isMatch = await (user as any).matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    sendTokenResponse(user, 200, res);
  } catch (err: any) {
    res.status(400).json({ success: false, error: err.errors || err.message });
  }
};

export const getMe = async (req: any, res: Response) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).json({ success: true, data: {} });
};
