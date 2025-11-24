'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '@/store/slices/authSlice';
import axios from 'axios';
import Cookies from 'js-cookie';

const TOKEN_COOKIE_NAME = 'auth_token';

export default function AuthInitializer() {
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeAuth = async () => {
            const token = Cookies.get(TOKEN_COOKIE_NAME);

            if (token) {
                try {
                    // Verify token with backend and get user data
                    const response = await axios.get('/api/auth/me', {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });

                    // Dispatch action to set user in Redux
                    dispatch(setUser({
                        user: response.data,
                        token,
                    }));
                } catch (error) {
                    console.error('Failed to initialize auth:', error);
                    // If token is invalid, remove it
                    Cookies.remove(TOKEN_COOKIE_NAME);
                }
            }
        };

        initializeAuth();
    }, [dispatch]);

    return null; // This component doesn't render anything
}
