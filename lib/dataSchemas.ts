import { email, z } from "zod";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Contact } from "lucide-react";

const PhoneSchema = z.string().refine(
  (value) => {
    return parsePhoneNumberFromString(value)?.isValid();
  },
  {
    message: "Invalid Contact",
  },
);

const EmailSchema = z.string().email("Invalid Contact");

export const RegisterDataSchema = z
  .object({
    firstName: z.string().min(1, "Name Can't be empty"),
    lastName: z.string().min(1, "Last Name can't be empty"),
    contact: z.union([PhoneSchema, EmailSchema]),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character",
      ),
    nid: z
      .string()
      .regex(/^\d{16}$/, "NID must be exactly 16 digits"),
    conservationSectors: z
      .array(z.string())
      .min(1, "Select at least one sector"),
    district: z.string().min(1, "Select District"),
    cell: z.string().min(1, "Select Cell"),
    village: z.string().min(1, "Select Village"),
    province: z.string().min(1, "Select Province"),
    sector: z.string().min(1, "Select Sector"),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
    }
  });
export const LoginDataSchema = z.object({
  contact: z.union([PhoneSchema, EmailSchema]),
  password: z.string().min(1),
});

export type UserRole =
  | "USER"
  | "ADMIN"
  | "FIELD_OFFICER"
  | "VERIFIER"
  | "BUYER";

export type Account = {
  id: string;
  firstName: string;
  lastName: string;
  contact: string;
  nid: string;
  role: UserRole;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  conservationSectors: string[];
  tokenVersion: number;
  iat: number; // issued at timestamp
  exp: number; // expiry timestamp
};

export type RegisterData = z.infer<typeof RegisterDataSchema>;
export type LoginData = z.infer<typeof LoginDataSchema>;
