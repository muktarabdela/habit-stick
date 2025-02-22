'use client'; // Add this directive at the top

import { useEffect } from 'react';

const ServiceWorker = () => {
    useEffect(() => {
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('/service-worker.js')
                    .then((registration) => {
                        console.log('Service Worker registered: ', registration);
                    })
                    .catch((error) => {
                        console.log('Service Worker registration failed: ', error);
                    });
            });
        }
    }, []);

    return null;
};

export default ServiceWorker; 