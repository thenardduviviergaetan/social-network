"use client";
import { Button } from "@/app/ui/button";
import Link from "next/link";
import {
  AtSymbolIcon,
  CakeIcon,
  CameraIcon,
  IdentificationIcon,
  KeyIcon,
  UserCircleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useFormState, useFormStatus } from "react-dom";
import { register } from "@/app/lib/actions-register";

/**
 * Renders a registration form component.
 * @returns JSX.Element
 */
export default function RegisterForm() {
  const initialState = { message: null, errors: {} };
  const [state, setFormState] = useFormState(register, initialState);
  return (
    <form
      action={setFormState}
      className="space-y-3 grid place-items-center h-screen mt-4"
    >
      <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8 shadow-xl">
        <h1 className={`text-gray-900 mb-3 text-2xl`}>
          Register
        </h1>
        <div className="w-full">
          <div>
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="email"
            >
              Email*
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email address"
                aria-describedby="email-error"
              />
              <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="email-error" aria-live="polite" aria-atomic="true">
              {state.errors?.email &&
                state.errors.email.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password*
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="password"
                type="password"
                name="password"
                placeholder="Enter password"
                minLength={6}
                aria-describedby="password-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="password-error" aria-live="polite" aria-atomic="true">
              {state.errors?.password &&
                state.errors.password.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="password"
            >
              Password Confirmation*
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="confirmation"
                type="password"
                name="confirmation"
                placeholder="Confirm password"
                minLength={6}
                aria-describedby="confirmation-error"
              />
              <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="confirmation-error" aria-live="polite" aria-atomic="true">
              {state.errors?.confirmation &&
                state.errors.confirmation.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="firstName"
            >
              First Name*
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="firstName"
                type="text"
                name="firstName"
                placeholder="Enter your first name"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="firstName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.firstName &&
                state.errors.firstName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="lastName"
            >
              Last Name*
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Enter your last name"
              />
              <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="lastName-error" aria-live="polite" aria-atomic="true">
              {state.errors?.lastName &&
                state.errors.lastName.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="dateOfBirth"
            >
              Date of Birth*
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="dateOfBirth"
                type="date"
                name="dateOfBirth"
                placeholder="mm/dd/yyyy"
              />
              <CakeIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="dateOfBirth-error" aria-live="polite" aria-atomic="true">
              {state.errors?.dateOfBirth &&
                state.errors.dateOfBirth.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

          <div className="mt-4">
                  <fieldset>
          <legend className="mb-2 block text-sm font-medium">
            Choose profile status
          </legend>
          <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
            <div className="flex gap-4">
              <div className="flex items-center">
                <input
                  id="private"
                  name="status"
                  type="radio"
                  value="private"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                />
                <label
                  htmlFor="private"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                >
                  Private
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="public"
                  name="status"
                  type="radio"
                  value="public"
                  className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                  aria-describedby="status-error"
                  defaultChecked
                  
                />
                <label
                  htmlFor="public"
                  className="ml-2 flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white"
                >
                  Public
                </label>
              </div>
            </div>
          </div>
          <div id="status-error">
            {state.errors?.status &&
              state.errors.status.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              ))}
          </div>
        </fieldset>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="nickname"
            >
              Nickname
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="nickname"
                type="text"
                name="nickname"
                placeholder="Enter your nickname"
              />
              <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="about"
            >
              About Me
            </label>
            <div className="relative">
              <textarea
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="about"
                name="about"
                placeholder="Tell us about yourself..."
              />
              <IdentificationIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
          </div>

        </div>


        
          <div className="mt-4">
            <label
              className="mb-3 mt-5 block text-xs font-medium text-gray-900"
              htmlFor="avatar"
            >
              Avatar/Image
            </label>
            <div className="relative">
              <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                id="avatar"
                type="file"
                name="avatar"
                accept="image/*"
              />
              <CameraIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
            </div>
            <div id="avatar-error" aria-live="polite" aria-atomic="true">
              {state.errors?.avatar &&
                state.errors.avatar.map((error: string) => (
                  <p className="mt-2 text-sm text-red-500" key={error}>
                    {error}
                  </p>
                ))}
            </div>
          </div>

        <RegisterButton />
        <p className="text-center mt-4 text-gray-900 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-purple-700">
            Sign in
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
 * Renders a Register button component.
 * @returns JSX.Element representing the Register button.
 */
function RegisterButton() {
  const { pending } = useFormStatus();
  return (
    <Button className="w-full mt-4" aria-disabled={pending}>
      Register
    </Button>
  );
}
