import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    role: z.enum(["BUYER", "SELLER"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(120),
  description: z.string().min(20, "Description must be at least 20 characters"),
  originalPrice: z.number().positive("Price must be positive"),
  askingPrice: z.number().positive("Price must be positive"),
  categoryId: z.string().min(1, "Please select a category"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  membershipType: z.string().min(1, "Membership type is required"),
  duration: z.string().optional(),
  expiryDate: z.string().optional(),
  images: z.array(z.string()).optional(),
});

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ListingInput = z.infer<typeof listingSchema>;
export type ReviewInput = z.infer<typeof reviewSchema>;
