import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Import environment variables from .env file.
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is not set");
}

// Creates a new user with a hashed password and the default "user" role; throws if the email is already taken.
export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const userRole = await prisma.role.findFirst({
    where: {
      name: "user",
    },
  });

  if (!userRole) {
    throw new Error("Default role not found");
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: hashedPassword,
      roleId: userRole.id,
    },
  });

  return user;
};

// Verifies the user's credentials and returns a signed JWT (valid 7d) along with the user record.
export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    include: { role: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role.name },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  return { token, user };
};
