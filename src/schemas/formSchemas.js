import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const forgotPasswordEmailSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
})

export const otpSchema = z.object({
  otp: z
    .string()
    .min(1, 'OTP is required')
    .regex(/^\d{6}$/, 'Enter the 6-digit OTP'),
})

export const forgotPasswordOtpSchema = otpSchema

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z
    .string()
    .min(1, 'Email address is required')
    .email('Enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  gender: z.enum(['male', 'female', 'other', 'prefer-not'], {
    message: 'Please select a gender',
  }),
  age: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z
      .number({ message: 'Age is required' })
      .int('Age must be a whole number')
      .min(1, 'Age is required')
      .max(120, 'Enter a valid age'),
  ),
  handicap: z.preprocess(
    (val) =>
      val === '' || val === null || val === undefined ? undefined : Number(val),
    z
      .number({ message: 'Handicap is required' })
      .min(0, 'Handicap must be 0 or higher')
      .max(54, 'Handicap cannot exceed 54'),
  ),
})

export const hostSchema = z
  .object({
    course: z.string().min(2, 'Course name is required'),
    location: z.string().min(2, 'Location is required'),
    date: z.string().min(1, 'Date is required'),
    time: z.string().min(1, 'Time is required'),
    spots: z.enum(['1', '2', '3'], {
      message: 'Select available spots',
    }),
    ageMin: z.coerce
      .number({ message: 'Min age is required' })
      .int()
      .min(1)
      .max(120),
    ageMax: z.coerce
      .number({ message: 'Max age is required' })
      .int()
      .min(1)
      .max(120),
    handicapMin: z.coerce
      .number({ message: 'Min handicap is required' })
      .min(0)
      .max(54),
    handicapMax: z.coerce
      .number({ message: 'Max handicap is required' })
      .min(0)
      .max(54),
    cost: z.string().optional(),
    notes: z.string().optional(),
  })
  .refine((data) => data.ageMax >= data.ageMin, {
    message: 'Max age must be greater than or equal to min age',
    path: ['ageMax'],
  })
  .refine((data) => data.handicapMax >= data.handicapMin, {
    message: 'Max handicap must be greater than or equal to min handicap',
    path: ['handicapMax'],
  })

export const editPersonalDetailsSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  phone: z.string().min(1, 'Phone is required'),
  location: z.string().min(1, 'Location is required'),
  homeCourse: z.string().min(1, 'Home course is required'),
  about: z.string().min(1, 'About is required'),
})
