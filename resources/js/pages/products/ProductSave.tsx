import Layout from "../Layout";
import { useForm, usePage, Link, router } from "@inertiajs/react";
import { useState, type ChangeEvent, type SubmitEvent } from "react";
import { successMessage, errorMessage } from "../components/ToastMessage";
import type { Page } from "@inertiajs/core";

type Category = {
    id: number;
    name: string;
};

interface Product {
    name: string;
    category_id: number;
    description?: string;
    qty: number;
    price: number;
    image?: File | string;
}

interface ExistingProduct {
    id: number;
    name: string;
    category_id: number;
    description?: string;
    qty: number;
    price: number;
    image?: string;
}

type FlashMessage = {
    message: string;
    status: boolean;
};

type PageProps = {
    product?: ExistingProduct;
    categories: Category[];
};

const ProductSave = () => {
    const { product, categories } = usePage<PageProps>().props;

    const [image, setImage] = useState<string>(
        product ? `/storage/${product.image}` : "",
    );

    const pageTitle = product ? "Update Product" : "Create Product";
    const API_URL = product ? `/products/${product.id}` : "/products";
    const method = product ? "put" : "post";

    const { data, setData, post, put, processing, errors, reset } =
        useForm<Product>({
            name: product?.name ?? "",
            category_id: product?.category_id ?? 0,
            description: product?.description ?? "",
            price: product?.price ?? 0,
            qty: product?.qty ?? 0,
            image: product?.image ?? "",
        });

    const handleForm = (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ): void => {
        const { name, value } = e.target;

        setData(name as keyof Product, value);
    };

    const handleImage = (e: ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (!file) return;
        data.image = file;
        setImage(URL.createObjectURL(file));
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
                        router.get("/products");
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
            put(API_URL, options);
        } else {
            post(API_URL, options);
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
                        htmlFor="category"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Category
                    </label>

                    <select
                        onChange={handleForm}
                        value={data.category_id}
                        name="category_id"
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                        <option value="select">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>

                    {errors.name && (
                        <p className="text-red-500">{errors.name}</p>
                    )}
                </div>

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
                        htmlFor="description"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Description
                    </label>

                    <input
                        type="text"
                        id="description"
                        name="description"
                        value={data.description}
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={handleForm}
                    />

                    {errors.description && (
                        <p className="text-red-500">{errors.description}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="price"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Price
                    </label>

                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={data.price}
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={handleForm}
                    />

                    {errors.price && (
                        <p className="text-red-500">{errors.price}</p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="qty"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Qty
                    </label>

                    <input
                        type="number"
                        id="qty"
                        name="qty"
                        value={data.qty}
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        onChange={handleForm}
                    />

                    {errors.qty && <p className="text-red-500">{errors.qty}</p>}
                </div>

                <div>
                    <label
                        htmlFor="image"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Image
                    </label>
                    <input
                        onChange={handleImage}
                        type="file"
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                       {
                        product || image ? (
                             <img
                            src={image}
                            alt="product_image"
                            style={{
                                width: "150px",
                                height: "150px",
                                objectFit: "cover",
                            }}
                        />
                        ):''
                       }


                    {errors.image && (
                        <p className="text-red-500">{errors.image}</p>
                    )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <Link
                        href="/products"
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

export default ProductSave;
