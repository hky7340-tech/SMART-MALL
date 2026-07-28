import type { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import AdminLayout from '@/components/Layout';
import '@/styles/globals.css';

const Toaster = dynamic(
    () => import('react-hot-toast').then((mod) => mod.Toaster),
    { ssr: false }
);

export default function AdminApp({ Component, pageProps }: AppProps) {
    return (
        <AdminLayout>
            <Component {...pageProps} />
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: { background: '#363636', color: '#fff', borderRadius: '12px' },
                    success: { iconTheme: { primary: '#22c55e', secondary: '#fff' } },
                    error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
                }}
            />
        </AdminLayout>
    );
}