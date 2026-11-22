import { useState } from "react";
import Layout from "../Layout";
import { Link, usePage } from "@inertiajs/react";
import InvoiceDetails, { type InvoiceDetailsData } from "./InvoiceDetails";

type Invoices = InvoiceDetailsData & {
    customer_id: number;
};

type PageLinks = {
    active: boolean;
    label: string;
    page?: number;
    url?: string;
};

type PageProps = {
    invoices: {
        data: Invoices[];
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
};

const Invoices = () => {
    const [search, setSearch] = useState("");
    const [selectedInvoice, setSelectedInvoice] =
        useState<Invoices | null>(null);
    const {
        data,
        first_page_url,
        last_page_url,
        next_page_url,
        prev_page_url,
    } = usePage<PageProps>().props.invoices;

    return (
        <Layout title="">
            <div className="p-5 space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-stone-900">
                            Invoices
                        </h2>
                        <p className="text-sm text-stone-500 mt-1">
                            Manage your application invoices
                        </p>
                    </div>

                    <Link
                        href={`/invoice-save`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <span className="text-lg leading-none">+</span>
                        Create Invoice
                    </Link>
                </div>

                {/* Search */}
                <div className="flex items-center">
                    <div className="relative w-full sm:max-w-sm">
                        <svg
                            className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-stone-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m21 21-4.35-4.35m1.85-5.15a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z"
                            />
                        </svg>

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by name or category..."
                            className="w-full rounded-lg border border-stone-300 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                        />
                    </div>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white shadow-sm">
                    <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
                        <thead className="bg-stone-50">
                            <tr>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Invoice id
                                </th>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Customer name
                                </th>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Discount
                                </th>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Vat
                                </th>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Total
                                </th>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Payable
                                </th>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-stone-100">
                            {data.length > 0 ? (
                                data.map((invoice) => (
                                    <tr
                                        key={invoice.id}
                                        className="transition hover:bg-stone-50"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                                            {invoice.id}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                                            {invoice.customer.name}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                                            {invoice.discount}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                                            {invoice.vat}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                                            {invoice.total}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                                            {invoice.payable}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                            <button
                                                onClick={() =>
                                                    setSelectedInvoice(invoice)
                                                }
                                                className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                type="button"
                                            >
                                                View products
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-10 text-center text-stone-500"
                                    >
                                        No invoice found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            {selectedInvoice && (
                <InvoiceDetails
                    invoice={selectedInvoice}
                    onClose={() => setSelectedInvoice(null)}
                />
            )}
        </Layout>
    );
};

export default Invoices;
