import { redirect } from "next/navigation";

import { LoginForm } from "@/components/auth/login-form";
import { getCurrentSession } from "@/lib/auth/session";

export default async function LoginPage({
  searchParams
}: Readonly<{
  searchParams?: Promise<{ callbackUrl?: string }>;
}>) {
  const session = await getCurrentSession();
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl ?? "/dashboard";

  if (session?.user) {
    redirect(callbackUrl);
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-10">
      <LoginForm callbackUrl={callbackUrl} />
    </main>
  );
}
