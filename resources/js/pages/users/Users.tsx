import Layout from "../Layout";
const users = () => {
    return (
        <Layout title="Users">
            <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
                <table className="min-w-full divide-y divide-stone-200 text-left text-sm">
                    <thead className="bg-stone-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-4 py-3 font-semibold text-stone-700"
                            >
                                Name
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 font-semibold text-stone-700"
                            >
                                Email
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 font-semibold text-stone-700"
                            >
                                Role
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 font-semibold text-stone-700"
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className="px-4 py-3 font-semibold text-stone-700"
                            >
                                Joined
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                        <tr className="text-stone-800">
                            <td className="whitespace-nowrap px-4 py-3 font-medium">
                                Rahim Uddin
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                rahim@example.com
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                Admin
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                    Active
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                2025-01-12
                            </td>
                        </tr>
                        <tr className="text-stone-800">
                            <td className="whitespace-nowrap px-4 py-3 font-medium">
                                Nusrat Jahan
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                nusrat@example.com
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                Editor
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-medium text-emerald-800">
                                    Active
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                2025-03-04
                            </td>
                        </tr>
                        <tr className="text-stone-800">
                            <td className="whitespace-nowrap px-4 py-3 font-medium">
                                Karim Hasan
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                karim@example.com
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                Viewer
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                                <span className="rounded-full bg-stone-200 px-2.5 py-0.5 text-xs font-medium text-stone-700">
                                    Inactive
                                </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                2025-06-21
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default users;
