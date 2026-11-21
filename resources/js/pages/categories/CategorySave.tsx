import Layout from "../Layout";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import type { ChangeEvent, SubmitEvent } from "react";
import { successMessage, errorMessage } from "../components/ToastMessage";
import type { Page } from "@inertiajs/core";

interface Category {
    name: string;
};

interface ExistingCategory extends Category{
    id: number;
};

type FlashMessage = {
    message: string;
    status: boolean;
};

type PageProps = {
    category?: ExistingCategory;
};

const CategorySave = () => {
    const { category } = usePage<PageProps>().props;

    const pageTitle = category ? "Update Category" : "Create Category";
    const URL = category ? `/categories/${category.id}` : "/categories";
    const method = category ? "put" : "post";

    const { data, setData, post, put, processing, errors, reset } =
        useForm<Category>({
            name: category?.name ?? "",
        });

    const handleForm = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;

        setData(name as keyof Category, value);
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
                        router.get("/categories");
                    }, 500);
                } else {
                    errorMessage("Something went wrong!");
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
                className="max-w-full space-y-6 rounded-lg border border-stone-200 bg-white p-6 mx-auto"
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

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/categories"
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

export default CategorySave;
