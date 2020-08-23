import { Request, Response } from "miragejs";
import { handleErrors } from "../server";
import { User, AuthResponse } from "../../../interface";
import { randomBytes } from "crypto";

// Generate token
const generateToken = () => randomBytes(8).toString("hex");

// Login user
const login = (schema: any, req: Request): AuthResponse | Response => {
  // Get username and password from request body
  const { username, password } = JSON.parse(req.requestBody);

  // Find user by username
  const user = schema.users.findBy({ username });
  // Check user
  if (!user) return handleErrors(null, "Invalid credentials");
  // If user found, check password
  if (password !== user.password)
    return handleErrors(null, "Invalid credentials");
  // Upon valid credentials, return user and token
  const token = generateToken();
  return {
    user: user.attrs as User,
    token,
  };
};

// Register user
const signup = (schema: any, req: Request): AuthResponse | Response => {
  const data = JSON.parse(req.requestBody);
  const exUser = schema.users.findBy({ username: data.username });
  if (exUser) {
    return handleErrors(null, "username already exists.");
  }
  const user = schema.users.create(data);
  const token = generateToken();
  return {
    user: user.attrs as User,
    token,
  };
};

export default { login, signup };
