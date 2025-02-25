import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Token'ı localStorage'dan al
export const getToken = () => localStorage.getItem('token');

// Token'ı kontrol et
export const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

// Protected Route bileşeni
export const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const isAuth = isAuthenticated();

    useEffect(() => {
        if (!isAuth) {
            navigate('/login');
        }
    }, [isAuth, navigate]);

    return isAuth ? children : null;
};

// API istekleri için auth header'ı ekle
export const setupAuthHeader = (token) => {
    if (token) {
        window.fetch = new Proxy(window.fetch, {
            apply: function(fetch, that, args) {
                let [resource, config] = args;
                if (!config) config = {};
                if (!config.headers) config.headers = {};
                
                config.headers['Authorization'] = `Bearer ${token}`;
                
                return fetch.apply(that, [resource, config]);
            }
        });
    }
}; 