import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        if (router.isReady) {
            router.replace('/users');
        }
    }, [router]);

    return null;
}