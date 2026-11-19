
import { ToastContainer, toast } from "react-toastify";

const successMessage = (message: string) => {
    toast.success(message);
};

const errorMessage = (message: string) => {
    toast.error(message);
};

const ToastMessage = () => {
    return (
        <ToastContainer
            position="top-right"
            autoClose={3000}
            theme="colored"
        />
    );
};

export { ToastMessage, successMessage, errorMessage };
