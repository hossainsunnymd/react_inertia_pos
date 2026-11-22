import Layout from "../Layout";
import { useHttp } from "@inertiajs/react";
import { useEffect, useReducer, useState } from "react";
import Select from "react-select";
import { useForm,router } from "@inertiajs/react";
import type { Page } from "@inertiajs/core";
import { successMessage, errorMessage } from "../components/ToastMessage";

// Types
type Product = {
    id: number;
    category_id: number;
    description: string;
    name: string;
    price: string;
    qty: number;
};

type FlashMessage = {
    status: boolean;
    message: string;
};

type Customer = {
    id: number;
    name: string;
    phone: string;
};

type PageLinks = {
    active: boolean;
    label: string;
    page?: number;
    url?: string;
};

type Data<T> = {
    data: {
        data: T[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: PageLinks[];
        next_page_url?: string;
        path: string;
        per_page: number;
        prev_page_url?: string;
        to: number;
        total: number;
    };
    message: string;
    status: boolean;
};

type InvoiceItem = {
    product_id: number;
    qty: number;
    sale_price: number;
};

// Enum
enum VatDiscount {
    vat = 0.15,
}

// Initial State Type

type InitialState = {
    customer_id: number;
    total: number;
    vat: number;
    discount: number;
    payable: number;
    invoiceItems: InvoiceItem[];
    qty: number;
};

// Initial State
const initialState: InitialState = {
    customer_id: 0,
    total: 0,
    vat: 0,
    discount: 0,
    payable: 0,
    invoiceItems: [],
    qty: 1,
};

// Action Types
type Action =
    | {
          type: "SET_CUSTOMER";
          payload: number;
      }
    | {
          type: "SET_QTY";
          payload: number;
      }
    | {
          type: "ADD_PRODUCT";
          payload: InvoiceItem;
      }
    | {
          type: "REMOVE_PRODUCT";
          payload: number;
      }
    | {
          type: "SET_DISCOUNT";
          payload: number;
      }
    | {
          type: "UPDATE_QTY";
          payload: {
              product_id: number;
              qty: number;
          };
      };

// Calculation Helper

function calculateTotals(
    state: InitialState,
    invoiceItems: InvoiceItem[],
    discount: number,
): InitialState {
    const total = invoiceItems.reduce(
        (sum, item) => sum + item.qty * item.sale_price,
        0,
    );

    const vat = total * VatDiscount.vat;

    // Discount cannot exceed subtotal + VAT
    const validDiscount = Math.min(Math.max(discount, 0), total + vat);

    const payable = total + vat - validDiscount;

    return {
        ...state,
        invoiceItems,
        total,
        vat,
        discount: validDiscount,
        payable,
    };
}

// Reducer
function reducer(state: InitialState, action: Action): InitialState {
    switch (action.type) {
        case "SET_CUSTOMER":
            return {
                ...state,
                customer_id: action.payload,
            };

        case "SET_QTY":
            return {
                ...state,
                qty: Math.max(1, action.payload),
            };

        // Add Product
        case "ADD_PRODUCT": {
            const existingProduct = state.invoiceItems.find(
                (item) => item.product_id === action.payload.product_id,
            );

            let invoiceItems: InvoiceItem[];

            if (existingProduct) {
                invoiceItems = state.invoiceItems.map((item) =>
                    item.product_id === action.payload.product_id
                        ? {
                              ...item,
                              qty: item.qty + action.payload.qty,
                          }
                        : item,
                );
            } else {
                invoiceItems = [...state.invoiceItems, action.payload];
            }

            return calculateTotals(state, invoiceItems, state.discount);
        }

        // Remove Product
        case "REMOVE_PRODUCT": {
            const invoiceItems = state.invoiceItems.filter(
                (item) => item.product_id !== action.payload,
            );

            return calculateTotals(state, invoiceItems, state.discount);
        }

        // Update Existing Product Quantity
        case "UPDATE_QTY": {
            const invoiceItems = state.invoiceItems.map((item) =>
                item.product_id === action.payload.product_id
                    ? {
                          ...item,
                          qty: Math.max(1, action.payload.qty),
                      }
                    : item,
            );

            return calculateTotals(state, invoiceItems, state.discount);
        }

        // Invoice Discount
        case "SET_DISCOUNT":
            return calculateTotals(state, state.invoiceItems, action.payload);

        default:
            return state;
    }
}

// Component

const InvoiceSave = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const { get, post, processing: httpProcessing } = useHttp();
    const {
        data,
        setData,
        processing: formProcessing,
        post: formPost,
    } = useForm<InitialState>({
        ...state,
    });

    const [products, setProducts] = useState<Product[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);

    const [selectedProduct, setSelectedProduct] = useState<Product | null>(
        null,
    );

    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
        null,
    );

    //set formdata
    useEffect(() => {
        setData(state);
    }, [state]);

    // Fetch Products

    useEffect(() => {
        get("/product-list", {
            onSuccess: (response): void => {
                const result = response as Data<Product>;

                setProducts(result.data.data);
            },
        });
    }, []);

    // Fetch Customers

    useEffect(() => {
        get("/customer-list", {
            onSuccess: (response): void => {
                const result = response as Data<Customer>;

                setCustomers(result.data.data);
            },
        });
    }, []);

    // Add Product
    const handleAddProduct = () => {
        if (!selectedProduct) {
            errorMessage("Please select a product.");
            return;
        }

        if (state.qty > selectedProduct.qty) {
            errorMessage("Insufficient product stock.");
            return;
        }

        const existingProduct = state.invoiceItems.find(
            (item) => item.product_id === selectedProduct.id,
        );

        const currentQty = existingProduct?.qty ?? 0;

        if (currentQty + state.qty > selectedProduct.qty) {
            alert("Insufficient product stock.");
            return;
        }

        dispatch({
            type: "ADD_PRODUCT",
            payload: {
                product_id: selectedProduct.id,
                qty: state.qty,
                sale_price: Number(selectedProduct.price),
            },
        });

        setSelectedProduct(null);

        dispatch({
            type: "SET_QTY",
            payload: 1,
        });
    };

    // Save Invoice

    const handleSaveInvoice = () => {
        if (!state.customer_id) {
            errorMessage("Please select a customer.");
            return;
        }

        if (state.invoiceItems.length === 0) {
            errorMessage("Please add at least one product.");
            return;
        }

        formPost("/invoices", {
            onSuccess: (page: Page) => {
                const flash = page.props.flash as FlashMessage;

                if (flash.status == true) {
                    successMessage(flash.message);
                    setTimeout(()=>{
                        router.get('/invoices');
                    },500);
                } else {
                    errorMessage(flash.message);
                }
            },
        });
    };

    // Format Currency

    const currency = (amount: number) => `$${amount.toFixed(2)}`;

    // Render

    return (
        <Layout title="Create Invoice">
            <div className="mx-auto max-w-7xl space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Product Section */}

                    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                        <div className="border-b border-stone-200 px-5 py-4">
                            <h2 className="text-base font-semibold text-stone-900">
                                Product
                            </h2>
                        </div>

                        <div className="p-5">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-stone-100">
                                    <tr>
                                        <th className="w-32 py-3 pr-4 text-left font-medium text-stone-600">
                                            Product
                                        </th>

                                        <td className="py-3">
                                            <Select<Product>
                                                value={selectedProduct}
                                                onChange={setSelectedProduct}
                                                options={products}
                                                getOptionLabel={(product) =>
                                                    product.name
                                                }
                                                getOptionValue={(product) =>
                                                    String(product.id)
                                                }
                                                placeholder="Select Product"
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <th className="py-3 pr-4 text-left font-medium text-stone-600">
                                            Quantity
                                        </th>

                                        <td className="py-3">
                                            <input
                                                type="number"
                                                min="1"
                                                max={
                                                    selectedProduct?.qty ??
                                                    undefined
                                                }
                                                value={state.qty}
                                                onChange={(e) => {
                                                    dispatch({
                                                        type: "SET_QTY",
                                                        payload: Number(
                                                            e.target.value,
                                                        ),
                                                    });
                                                }}
                                                className="block w-full rounded-md border border-stone-300 px-3 py-2 text-stone-900"
                                            />

                                            {selectedProduct && (
                                                <p className="mt-1 text-xs text-stone-500">
                                                    Available stock:{" "}
                                                    {selectedProduct.qty}
                                                </p>
                                            )}
                                        </td>
                                    </tr>

                                    {selectedProduct && (
                                        <tr>
                                            <th className="py-3 pr-4 text-left font-medium text-stone-600">
                                                Price
                                            </th>

                                            <td className="py-3 font-medium">
                                                {currency(
                                                    Number(
                                                        selectedProduct.price,
                                                    ),
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>

                            <div className="mt-4 flex justify-end">
                                <button
                                    type="button"
                                    onClick={handleAddProduct}
                                    className="cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
                                >
                                    Add Product
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* Customer Section */}

                    <section className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                        <div className="border-b border-stone-200 px-5 py-4">
                            <h2 className="text-base font-semibold text-stone-900">
                                Customer
                            </h2>
                        </div>

                        <div className="p-5">
                            <table className="w-full text-sm">
                                <tbody className="divide-y divide-stone-100">
                                    <tr>
                                        <th className="w-32 py-3 pr-4 text-left font-medium text-stone-600">
                                            Name
                                        </th>

                                        <td className="py-3">
                                            <Select<Customer>
                                                value={selectedCustomer}
                                                onChange={(customer) => {
                                                    setSelectedCustomer(
                                                        customer,
                                                    );

                                                    dispatch({
                                                        type: "SET_CUSTOMER",
                                                        payload:
                                                            customer?.id ?? 0,
                                                    });
                                                }}
                                                options={customers}
                                                getOptionLabel={(customer) =>
                                                    customer.name
                                                }
                                                getOptionValue={(customer) =>
                                                    String(customer.id)
                                                }
                                                placeholder="Select Customer"
                                            />
                                        </td>
                                    </tr>

                                    {selectedCustomer && (
                                        <tr>
                                            <th className="py-3 pr-4 text-left font-medium text-stone-600">
                                                Phone
                                            </th>

                                            <td className="py-3">
                                                {selectedCustomer.phone}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Selected Products */}

                <section className="overflow-hidden rounded-lg border border-stone-200 bg-white">
                    <div className="border-b border-stone-200 px-5 py-4">
                        <h2 className="text-base font-semibold text-stone-900">
                            Selected Products
                        </h2>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[760px] text-left text-sm">
                            <thead className="bg-stone-50 text-xs font-semibold uppercase text-stone-600">
                                <tr>
                                    <th className="px-5 py-3">#</th>

                                    <th className="px-5 py-3">Product</th>

                                    <th className="px-5 py-3">Price</th>

                                    <th className="px-5 py-3">Quantity</th>

                                    <th className="px-5 py-3">Discount</th>

                                    <th className="px-5 py-3">Total</th>

                                    <th className="px-5 py-3 text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-stone-200">
                                {state.invoiceItems.length === 0 ? (
                                    <tr>
                                        <td
                                            className="px-5 py-8 text-center text-stone-400"
                                            colSpan={7}
                                        >
                                            No products selected
                                        </td>
                                    </tr>
                                ) : (
                                    state.invoiceItems.map((item, index) => {
                                        const product = products.find(
                                            (p) => p.id === item.product_id,
                                        );

                                        return (
                                            <tr key={item.product_id}>
                                                <td className="px-5 py-3">
                                                    {index + 1}
                                                </td>

                                                <td className="px-5 py-3 font-medium">
                                                    {product?.name ??
                                                        "Unknown Product"}
                                                </td>

                                                <td className="px-5 py-3">
                                                    {currency(item.sale_price)}
                                                </td>

                                                <td className="px-5 py-3">
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max={
                                                            product?.qty ??
                                                            undefined
                                                        }
                                                        value={item.qty}
                                                        onChange={(e) => {
                                                            const qty = Number(
                                                                e.target.value,
                                                            );

                                                            if (
                                                                qty < 1 ||
                                                                !Number.isInteger(
                                                                    qty,
                                                                )
                                                            ) {
                                                                return;
                                                            }

                                                            if (
                                                                product &&
                                                                qty >
                                                                    product.qty
                                                            ) {
                                                                alert(
                                                                    "Insufficient stock.",
                                                                );
                                                                return;
                                                            }

                                                            dispatch({
                                                                type: "UPDATE_QTY",
                                                                payload: {
                                                                    product_id:
                                                                        item.product_id,
                                                                    qty,
                                                                },
                                                            });
                                                        }}
                                                        className="w-20 rounded-md border border-stone-300 px-2 py-1"
                                                    />
                                                </td>

                                                <td className="px-5 py-3">
                                                    {currency(0)}
                                                </td>

                                                <td className="px-5 py-3 font-medium">
                                                    {currency(
                                                        item.qty *
                                                            item.sale_price,
                                                    )}
                                                </td>

                                                <td className="px-5 py-3 text-right">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            dispatch({
                                                                type: "REMOVE_PRODUCT",
                                                                payload:
                                                                    item.product_id,
                                                            });
                                                        }}
                                                        className="rounded-md bg-red-50 px-3 py-1.5 text-red-600 hover:bg-red-100"
                                                    >
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Invoice Summary */}

                    <div className="flex flex-col gap-4 border-t border-stone-200 p-5 sm:flex-row sm:items-end sm:justify-between">
                        <div className="flex flex-wrap items-center gap-3">
                            <label
                                htmlFor="discount"
                                className="text-sm font-medium text-stone-700"
                            >
                                Invoice Discount
                            </label>

                            <input
                                id="discount"
                                type="number"
                                min="0"
                                max={state.total + state.vat}
                                step="0.01"
                                value={state.discount}
                                onChange={(e) => {
                                    dispatch({
                                        type: "SET_DISCOUNT",
                                        payload: Math.max(
                                            0,
                                            Number(e.target.value),
                                        ),
                                    });
                                }}
                                className="w-32 rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900"
                            />
                        </div>

                        <dl className="w-full max-w-sm space-y-2 text-sm">
                            <div className="flex justify-between">
                                <dt className="text-stone-600">Subtotal</dt>

                                <dd className="font-medium text-stone-900">
                                    {currency(state.total)}
                                </dd>
                            </div>

                            <div className="flex justify-between">
                                <dt className="text-stone-600">VAT (15%)</dt>

                                <dd className="font-medium text-stone-900">
                                    {currency(state.vat)}
                                </dd>
                            </div>

                            <div className="flex justify-between">
                                <dt className="text-stone-600">Discount</dt>

                                <dd className="font-medium text-stone-900">
                                    -{currency(state.discount)}
                                </dd>
                            </div>

                            <div className="flex justify-between border-t border-stone-200 pt-2">
                                <dt className="font-semibold text-stone-900">
                                    Grand Total
                                </dt>

                                <dd className="font-semibold text-stone-900">
                                    {currency(state.payable)}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    {/* Footer */}

                    <div className="flex items-center justify-end gap-3 border-t border-stone-200 px-5 py-4">
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="rounded-md px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveInvoice}
                            disabled={formProcessing}
                            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {formProcessing ? "Saving..." : "Save Invoice"}
                        </button>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default InvoiceSave;
