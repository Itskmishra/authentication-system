import z from "zod";

const RoleEnum = z.enum(["TUTOR", "USER"], {
  required_error: "Role is required",
  invalid_type_error: "Role must be either 'TUTOR' or 'USER'",
});

export const emailSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email address",
      })
      .email(),
  }),
});

export const reigsterSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
      })
      .min(4, "Must be at least 4 char")
      .max(30, "Mus the within 30 char"),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email address",
      })
      .email(),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    role: RoleEnum,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email address",
      })
      .email(),
    password: z.string({
      required_error: "Password is required",
      invalid_type_error: "Password must be a string",
    }),
  }),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string({
      required_error: "Token is required",
      invalid_type_error: "Token must be a valid verification token",
    }),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email address",
      })
      .email(),
  }),
});

export const verifyPasswordSchema = z.object({
  params: z.object({
    token: z.string({
      required_error: "Token is required",
      invalid_type_error: "Token must be a valid verification token",
    }),
  }),
});

export const generatePasswordSchema = z.object({
  params: z.object({
    token: z.string({
      required_error: "Token is required",
      invalid_type_error: "Token must be a valid verification token",
    }),
  }),
  body: z.object({
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    username: z
      .string({
        required_error: "Username is required",
        invalid_type_error: "Username must be a string",
      })
      .min(4, "Must be at least 4 char")
      .max(30, "Mus the within 30 char")
      .optional(),
    email: z
      .string({
        required_error: "Email is required",
        invalid_type_error: "Email must be a valid email address",
      })
      .email()
      .optional(),
    password: z
      .string({
        required_error: "Password is required",
        invalid_type_error: "Password must be a string",
      })
      .min(8, "Password must be at least 8 characters long")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      )
      .optional(),
    role: RoleEnum.optional(),
  }),
});
