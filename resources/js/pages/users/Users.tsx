import { useState } from "react";
import Layout from "../Layout";
import { Link, usePage,router } from "@inertiajs/react";
import type {Page} from "@inertiajs/core";
import {successMessage,errorMessage} from '../components/ToastMessage'

type User = {
    id: number;
    name: string;
    email: string;
};

type PageLinks = {
    active: boolean;
    label: string;
    page?: number;
    url?: string;
};

type FlashMessage={
    status:boolean;
    message:string;
}

type PageProps = {
    users: {
        data: User[];
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

const handleDelete=(id:number):void=>{
    if(confirm('Are you sure to delete this user?')){
            router.delete(`/users/${id}`,{
        onSuccess:(page:Page)=>{
            console.log(page);
            const flash=page.props.flash as FlashMessage
            if(flash.status==true){
                successMessage(flash.message);
            }else{
                errorMessage(flash.message);
            }
        }
    });
    }
}

const Users = () => {
    const [search, setSearch] = useState("");
    const {
        data,
        first_page_url,
        last_page_url,
        next_page_url,
        prev_page_url,
    } = usePage<PageProps>().props.users;

    return (
        <Layout title="Users">
            <div className="p-5 space-y-5">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-semibold text-stone-900">
                            Users
                        </h2>
                        <p className="text-sm text-stone-500 mt-1">
                            Manage your application users
                        </p>
                    </div>

                    <Link
                        href={`/user-save?id=${0}`}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        <span className="text-lg leading-none">+</span>
                        Create User
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
                            placeholder="Search by name or email..."
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
                                    Name
                                </th>
                                <th className="px-4 py-3 font-semibold text-stone-700">
                                    Email
                                </th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-stone-100">
                            {data.length > 0 ? (
                                data.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="transition hover:bg-stone-50"
                                    >
                                        <td className="whitespace-nowrap px-4 py-3 font-medium text-stone-800">
                                            {user.name}
                                        </td>

                                        <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                            {user.email}
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-stone-600">
                                            <Link
                                                href={`/user-save?id=${user.id}`}
                                                className="bg-green-500 hover:bg-green-700 px-6 py-2 rounded-sm text-white"
                                            >
                                                Edit
                                            </Link>
                                            <button onClick={()=>handleDelete(user.id)} className="bg-red-500 hover:bg-red-700 px-4 py-2 rounded-sm text-white mx-2">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={2}
                                        className="px-4 py-10 text-center text-stone-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
};

export default Users;
