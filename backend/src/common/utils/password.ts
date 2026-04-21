import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const hashPassword = async (value: string) => bcrypt.hash(value, SALT_ROUNDS);

export const comparePassword = async (value: string, hash: string) =>
  bcrypt.compare(value, hash);
