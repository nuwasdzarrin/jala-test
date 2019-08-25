const api = {
    base: '/api',
    shrimp_prices_detail: '/api/shrimp_price/{id}',
    shrimp_prices: '/api/shrimp_price',
    prices: '/api/shrimp_price',
    auth: {
        login: '/api/auth/login',
        logout: '/api/auth/logout',
        register: '/api/auth/register'
    },
    header: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
}

export default api
