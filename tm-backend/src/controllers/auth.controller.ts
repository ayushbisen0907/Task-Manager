import { Request, Response } from "express";
import { loginUser, registerUser } from "../services/auth.service";

// Handles POST /register: creates a new user from the request body and returns the created user.
export const resgister = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const user = await registerUser(name, email, password);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Handles POST /login: authenticates the user and returns a JWT plus user info.
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await loginUser(email, password);
    res.status(200).json({ message: "User logged in successfully", result });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
