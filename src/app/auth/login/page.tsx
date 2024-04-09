"use client";
import React, { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const searchParams = useSearchParams();
  const loggedOut = searchParams?.get("loggedout");

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await signIn("credentials", {
      username: username,
      password: password,
      callbackUrl: "/",
    });
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-r from-blue-500 to-green-500">
      <div className="flex flex-col items-center"></div>
      <h1 className="mb-8 text-4xl  font-bold"> SDA Planckster </h1>
      <h5 className="10s mb-8 animate-pulse text-sm  font-bold">alpha</h5>
      <div className="w-10"></div>
      <div className="animate-fade-in mt-8 transform rounded-md border border-gray-300 p-6 shadow-md transition-all duration-300 hover:scale-105 hover:shadow-lg">
        {loggedOut && (
          <div className="mb-4 rounded bg-green-500 p-4 text-white">
            Successfully logged out.
          </div>
        )}
        <h2 className="mb-4 text-2xl font-bold">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="username" className="block">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={handleUsernameChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-black"
            />
          </div>
          <button
            type="submit"
            className="rounded bg-blue-500 px-4 py-2 font-bold hover:bg-blue-700"
          >
            Login
          </button>
        </form>
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
}

export default LoginPageWithSuspense;
