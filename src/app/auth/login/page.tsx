"use client";
import React, { Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { LoginCard } from "@maany_shr/rage-ui-kit";
import { type buttonActionInputValues } from "node_modules/@maany_shr/rage-ui-kit/dist/components/card/LoginCard";

const LoginPage: React.FC = () => {
  const searchParams = useSearchParams();
  const loggedOut = searchParams?.get("loggedout");

  const handleSubmit = async (inputValues: buttonActionInputValues): Promise<void> => {
    await signIn("credentials", {
      username: inputValues.userName,
      password: inputValues.userPassword,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex flex-col md:flex-row items-center justify-center gap-4">
      <h1 className="mb-8 text-4xl font-bold animate-pulseGrow"> SkyPulse </h1>
        <div className="animate-fade-in transform rounded-md border border-gray-300 p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
        {loggedOut && <div className="mb-4 rounded bg-green-500 p-4 text-white">Successfully logged out.</div>}
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <LoginCard buttonAction={handleSubmit} />
        </div>
      </div>
    </div>
  );
};

const LoginPageWithSuspense: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
};

export default LoginPageWithSuspense;
