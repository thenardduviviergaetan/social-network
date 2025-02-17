"use client";

import { Button } from "@/app/ui/button";
import Link from "next/link";
import { AtSymbolIcon, ExclamationCircleIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useFormState, useFormStatus } from "react-dom";
import { authenticate } from "@/app/lib/action-login";

/**
 * Renders a login form component.
 * @returns The login form component.
 */
export default function LoginForm() {
  const [errorMessage, dispatch] = useFormState(authenticate, undefined);

  return (
    <form
      action={dispatch}
      className="space-y-3 grid place-items-center h-screen"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-xl">
        <h1 className={`text-gray-900 mb-3 text-2xl`}>
          Login
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email address"
                required
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                required
                minLength={6}
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>
        </div>
        <LoginButton />

        <div
          className="flex h-8 items space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessage && (
            <>
              <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
              <p className="text-sm text-red-500">{errorMessage}</p>
            </>
          )}
        </div>

        <p className="text-center mt-4 text-gray-900 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-purple-700">
            Sign up
          </Link>
        </p>
        <div
          className="flex h-8 items-end space-x-1"
          aria-live="polite"
          aria-atomic="true"
        >
        </div>
      </div>
    </form>
  );
}

/**
 * Renders a login button.
 * @returns The login button component.
 */
function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full mt-4" aria-disabled={pending}>
      Login
    </Button>
  );
}
