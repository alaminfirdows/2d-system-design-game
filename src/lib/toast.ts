import { toast } from 'sonner';

type ToastT = 'info' | 'warning'

const options: any = {
    position: 'bottom-center',
    className: 'toast-border',
    richColors: true,
    duration: 3000,
};

export const notify = (message: string, type?: ToastT) => {
    if (!type) {
        return toast(message, options)
    }

    toast[type](message, options)
};

export const notifyError = (message: string = 'Something went wrong!') => {
    toast.error(message, options);
}

export const notifySuccess = (message: string) => {
    toast.success(message, options);
}
