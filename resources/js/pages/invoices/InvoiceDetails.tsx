import { useEffect, useRef } from "react";

 type InvoiceProductLine = {
    id: number;
    product_id: number;
    qty: number;
    sale_price: number | string;
    product: {
        id: number;
        name: string;
    } | null;
};

 type InvoiceDetailsData = {
    id: number;
    total: number | string;
    discount: number | string;
    vat: number | string;
    payable: number | string;
    customer: {
        name: string;
    };
    invoice_product: InvoiceProductLine[];
};

type InvoiceDetailsProps = {
    invoice: InvoiceDetailsData;
    onClose: () => void;
};

const currency = (amount: number | string): string =>
    `$${Number(amount).toFixed(2)}`;

const InvoiceDetails = ({ invoice, onClose }: InvoiceDetailsProps) => {
    const closeButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        closeButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <section
                aria-labelledby="invoice-details-title"
                aria-modal="true"
                className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-xl bg-white shadow-xl"
                role="dialog"
            >
                <header className="flex items-start justify-between gap-4 border-b border-stone-200 px-5 py-4">
                    <div>
                        <h2
                            className="text-lg font-semibold text-stone-900"
                            id="invoice-details-title"
                        >
                            Invoice #{invoice.id}
                        </h2>
                        <p className="mt-1 text-sm text-stone-500">
                            Products purchased by {invoice.customer.name}
                        </p>
                    </div>
                    <button
                        aria-label="Close invoice details"
                        className="rounded-md px-2 py-1 text-xl leading-none text-stone-500 hover:bg-stone-100 hover:text-stone-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onClick={onClose}
                        ref={closeButtonRef}
                        type="button"
                    >
                        &times;
                    </button>
                </header>

                <div className="max-h-[calc(90vh-180px)] overflow-y-auto p-5">
                    <div className="overflow-x-auto rounded-lg border border-stone-200">
                        <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
                            <thead className="bg-stone-50">
                                <tr>
                                    <th className="px-4 py-3 font-semibold text-stone-700">
                                        Product
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-stone-700">
                                        Quantity
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-stone-700">
                                        Unit price
                                    </th>
                                    <th className="px-4 py-3 text-right font-semibold text-stone-700">
                                        Line total
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {invoice.invoice_product.length > 0 ? (
                                    invoice.invoice_product.map((item) => {
                                        const lineTotal = Number(
                                            item.sale_price,
                                        );
                                        const unitPrice =
                                            item.qty > 0
                                                ? lineTotal / item.qty
                                                : 0;

                                        return (
                                            <tr key={item.id}>
                                                <td className="px-4 py-3 font-medium text-stone-900">
                                                    {item.product?.name ??
                                                        `Product #${item.product_id}`}
                                                </td>
                                                <td className="px-4 py-3 text-right text-stone-700">
                                                    {item.qty}
                                                </td>
                                                <td className="px-4 py-3 text-right text-stone-700">
                                                    {currency(unitPrice)}
                                                </td>
                                                <td className="px-4 py-3 text-right font-medium text-stone-900">
                                                    {currency(lineTotal)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            className="px-4 py-8 text-center text-stone-500"
                                            colSpan={4}
                                        >
                                            No products found for this invoice.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <dl className="ml-auto mt-5 grid max-w-sm grid-cols-2 gap-x-6 gap-y-2 text-sm">
                        <dt className="text-stone-500">Subtotal</dt>
                        <dd className="text-right font-medium text-stone-900">
                            {currency(invoice.total)}
                        </dd>
                        <dt className="text-stone-500">VAT</dt>
                        <dd className="text-right font-medium text-stone-900">
                            {currency(invoice.vat)}
                        </dd>
                        <dt className="text-stone-500">Discount</dt>
                        <dd className="text-right font-medium text-stone-900">
                            {currency(invoice.discount)}
                        </dd>
                        <dt className="border-t border-stone-200 pt-2 font-semibold text-stone-900">
                            Payable
                        </dt>
                        <dd className="border-t border-stone-200 pt-2 text-right font-semibold text-stone-900">
                            {currency(invoice.payable)}
                        </dd>
                    </dl>
                </div>
            </section>
        </div>
    );
};

export default InvoiceDetails;
