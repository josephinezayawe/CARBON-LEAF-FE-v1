"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { Account } from "./dataSchemas";

export async function getCurrentUser() {
  const cookieStore = await cookies();

  const token = cookieStore.get("user")?.value;
  if (!token) return null;
  try {
    return jwt.decode(token) as Account;
  } catch {
    return null;
  }
}
