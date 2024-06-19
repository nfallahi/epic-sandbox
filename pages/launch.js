import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Launch = () => {
    const router = useRouter();

    useEffect(() => {
        const { launch, iss } = router.query;

        if (launch && iss) {
            router.push(`/api/launch?launch=${launch}&iss=${iss}`);
        }
    }, [router]);

    return <div>Redirecting...</div>;
};

export default Launch;
