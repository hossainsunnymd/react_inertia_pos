import { useForm, router } from "@inertiajs/react";
import type { Page } from "@inertiajs/core";
import type { ChangeEvent } from "react";
import {
    successMessage,
    errorMessage,
    ToastMessage,
} from "../components/ToastMessage";

type LoginForm = {
    email: string;
    password: string;
};

type FlashMessage = {
    message: string;
    status: boolean;
};

const Login = () => {
    const { data, setData, post, processing, errors, reset } =
        useForm<LoginForm>({
            email: "",
            password: "",
        });

    const handleForm = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData(name as keyof LoginForm, value);
    };

    const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        post("/login", {
            onSuccess: (page: Page) => {
                reset();
                const flash = page.props.flash as FlashMessage;
                if (flash.status == true) {
                    successMessage(flash.message);
                    setTimeout(() => {
                        router.get("/users");
                    }, 500);
                } else {
                    errorMessage(flash.message);
                }
            },
            onError: () => {
                errorMessage("Please check the form errors.");
            },
        });
    };
    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <ToastMessage />
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-6 rounded-lg border border-stone-200 bg-white p-6"
            >
                <div>
                    <h2 className="text-xl font-semibold text-stone-900">
                        Sign in
                    </h2>
                    <p className="mt-1 text-sm text-stone-600">
                        Continue to your account
                    </p>
                </div>

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        autoComplete="email"
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        value={data.email}
                        onChange={handleForm}
                    />
                    {errors.email && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        autoComplete="current-password"
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        value={data.password}
                        onChange={handleForm}
                    />
                    {errors.password && (
                        <p className="mt-2 text-sm text-red-600">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 text-stone-700">
                        <input
                            type="checkbox"
                            name="remember"
                            className="h-4 w-4 rounded border-stone-300 text-amber-600 focus:ring-amber-500"
                        />
                        Remember me
                    </label>
                </div>

                <button
                    type="submit"
                    className="cursor-pointer w-full rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    disabled={processing}
                >
                    {processing ? "Signing in..." : "Sign in"}
                </button>
            </form>
        </div>
    );
};

export default Login;
