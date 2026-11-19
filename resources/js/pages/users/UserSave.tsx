import Layout from "../Layout";

const UserSave = () => {
    return (
        <Layout title="Create User">
            <form className="max-w-xl space-y-6 rounded-lg border border-stone-200 bg-white p-6 mx-auto">
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
                        required
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
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
                        required
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor="role"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Role
                    </label>
                    <select
                        id="role"
                        name="role"
                        required
                        className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                        <option value="">Select a role</option>
                        <option value="Admin">Admin</option>
                        <option value="Editor">Editor</option>
                        <option value="Viewer">Viewer</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="status"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Status
                    </label>
                    <select
                        id="status"
                        name="status"
                        required
                        className="mt-1 block w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="joined_at"
                        className="block text-sm font-medium text-stone-700"
                    >
                        Joined date
                    </label>
                    <input
                        type="date"
                        id="joined_at"
                        name="joined_at"
                        required
                        className="mt-1 block w-full rounded-md border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                    <a
                        href="/users"
                        className="rounded-md px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-100"
                    >
                        Cancel
                    </a>
                    <button
                        type="submit"
                        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                    >
                        Save user
                    </button>
                </div>
            </form>
        </Layout>
    );
};

export default UserSave;
