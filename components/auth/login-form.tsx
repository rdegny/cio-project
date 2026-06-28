"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ callbackUrl }: Readonly<{ callbackUrl: string }>) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl
    });

    setIsSubmitting(false);

    if (!result?.ok) {
      setError("Check your local auth email and password, then try again.");
      return;
    }

    router.push(result.url ?? callbackUrl);
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-panel"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-moss">
          Secure Access
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-ink">Sign in to AI CIO</h1>
        <p className="mt-3 text-sm leading-6 text-zinc-700">
          Use your local development credentials from `.env.local`.
        </p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
            className="mt-2 w-full rounded-md border border-line px-3 py-2 text-ink outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/25"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-ink">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            className="mt-2 w-full rounded-md border border-line px-3 py-2 text-ink outline-none transition focus:border-moss focus:ring-2 focus:ring-moss/25"
          />
        </label>
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-red-700">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-6 w-full rounded-md bg-moss px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
