"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ShoppingBag, Store } from "lucide-react";

import { registerSchema, type RegisterInput } from "@/lib/validations";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Google SVG icon                                                            */
/* -------------------------------------------------------------------------- */
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Animation variants                                                         */
/* -------------------------------------------------------------------------- */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

/* -------------------------------------------------------------------------- */
/* Role toggle component                                                      */
/* -------------------------------------------------------------------------- */
function RoleToggle({
  value,
  onChange,
  error,
}: {
  value: "BUYER" | "SELLER";
  onChange: (role: "BUYER" | "SELLER") => void;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-300 mb-2">
        I want to...
      </label>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("BUYER")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200",
            value === "BUYER"
              ? "border-accent bg-accent/5 text-accent shadow-none"
              : "border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300",
          )}
        >
          <ShoppingBag className="h-4 w-4" />
          I want to Buy
        </button>
        <button
          type="button"
          onClick={() => onChange("SELLER")}
          className={cn(
            "flex items-center justify-center gap-2 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all duration-200",
            value === "SELLER"
              ? "border-secondary bg-secondary/5 text-secondary shadow-none"
              : "border-neutral-800 text-neutral-500 hover:border-neutral-700 hover:text-neutral-300",
          )}
        >
          <Store className="h-4 w-4" />
          I want to Sell
        </button>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Register page                                                              */
/* -------------------------------------------------------------------------- */
export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "BUYER",
    },
  });

  /* ---------------------------------------------------------------------- */
  /* Submit handler                                                          */
  /* ---------------------------------------------------------------------- */
  async function onSubmit(data: RegisterInput) {
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const body = await res.json();

      if (!res.ok) {
        setError(body.error || "Something went wrong. Please try again.");
        return;
      }

      // Auto sign-in after registration
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        // Registration succeeded but auto sign-in failed; redirect to login
        router.push("/login");
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    }
  }

  /* ---------------------------------------------------------------------- */
  /* Google sign-up handler                                                   */
  /* ---------------------------------------------------------------------- */
  function handleGoogleSignUp() {
    signIn("google", { callbackUrl: "/dashboard" });
  }

  /* ---------------------------------------------------------------------- */
  /* Render                                                                   */
  /* ---------------------------------------------------------------------- */
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-7"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h2 className="font-serif text-3xl font-bold text-white tracking-tight">
          Create your account
        </h2>
        <p className="mt-2 text-neutral-500">
          Join ReMemberX and start trading premium memberships
        </p>
      </motion.div>

      {/* Error banner */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-error/10 border border-error/20 px-4 py-3 text-sm text-error"
          role="alert"
        >
          {error}
        </motion.div>
      )}

      {/* Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5"
        noValidate
      >
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a strong password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.password?.message}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-8.5 text-neutral-400 hover:text-neutral-400 transition-colors"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirm ? "text" : "password"}
            placeholder="Repeat your password"
            autoComplete="new-password"
            leftIcon={<Lock className="h-4 w-4" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-3 top-8.5 text-neutral-400 hover:text-neutral-400 transition-colors"
            tabIndex={-1}
            aria-label={showConfirm ? "Hide password" : "Show password"}
          >
            {showConfirm ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Role toggle */}
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <RoleToggle
              value={field.value}
              onChange={field.onChange}
              error={errors.role?.message}
            />
          )}
        />

        <Button
          type="submit"
          variant="accent"
          size="lg"
          loading={isSubmitting}
          className="w-full"
        >
          Create Account
        </Button>
      </motion.form>

      {/* Divider */}
      <motion.div variants={itemVariants} className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-800" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-[#050505] px-4 text-neutral-500">
            or continue with
          </span>
        </div>
      </motion.div>

      {/* Google sign-up */}
      <motion.div variants={itemVariants}>
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          onClick={handleGoogleSignUp}
        >
          <GoogleIcon className="h-5 w-5" />
          Sign up with Google
        </Button>
      </motion.div>

      {/* Sign-in link */}
      <motion.p
        variants={itemVariants}
        className="text-center text-sm text-neutral-500"
      >
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-white hover:text-primary-light transition-colors"
        >
          Sign In
        </Link>
      </motion.p>
    </motion.div>
  );
}
