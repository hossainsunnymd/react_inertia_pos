import Layout from "../Layout";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import type { ChangeEvent, SubmitEvent } from "react";
import { successMessage, errorMessage } from "../components/ToastMessage";
import type { Page } from "@inertiajs/core";

type User = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

type ExistingUser = {
    id: number;
    name: string;
    email: string;
};

type FlashMessage = {
    message: string;
    status: boolean;
};

type PageProps = {
    user?: ExistingUser;
};

const UserSave = () => {
    const { user } = usePage<PageProps>().props;

    const pageTitle = user ? "Update User" : "Create User";
    const URL = user ? `/users/${user.id}` : "/users";
    const method = user ? "put" : "post";

    const { data, setData, post, put, processing, errors, reset } =
        useForm<User>({
            name: user?.name ?? "",
            email: user?.email ?? "",
            password: "",
            password_confirmation: "",
        });

    const handleForm = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setData(name as keyof User, value);
    };

    const handleSubmit = (e: SubmitEvent<HTMLFormElement>): void => {
        e.preventDefault();

        const options = {
            onSuccess: (page: Page) => {
                const flash = page.props.flash as FlashMessage;

                reset();

                if (flash.status) {
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
        };

        if (method === "put") {
            put(URL, options);
        } else {
            post(URL, options);
        }
    };

    return (
        <Layout title={pageTitle}>
            <form
                onSubmit={handleSubmit}
                className="max-w-xl space-y-6 rounded-lg border border-stone-200 bg-white p-6 mx-auto"
            >
                <div>
                    <label
                        htmlFor="name"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Name
                    </label>

                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={handleForm}
                    />

                    {errors.name && (
                        <p className="text-red-500">{errors.name}</p>
                    )}
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
                        value={data.email}
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={handleForm}
                    />

                    {errors.email && (
                        <p className="text-red-500">{errors.email}</p>
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
                        value={data.password}
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={handleForm}
                    />

                    {errors.password && (
                        <p className="text-red-500">{errors.password}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="password_confirmation"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Password Confirmation
                    </label>

                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={handleForm}
                    />

                    {errors.password_confirmation && (
                        <p className="text-red-500">
                            {errors.password_confirmation}
                        </p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/users"
                        className="rounded-md px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={processing}
                        className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 disabled:opacity-50"
                    >
                        {processing ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </Layout>
    );
};

export default UserSave;
