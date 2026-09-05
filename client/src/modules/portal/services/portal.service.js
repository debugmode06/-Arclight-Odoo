const API_BASE = '/api/portal';
const TOKEN_KEY = 'df360_customer_token';
const CUSTOMER_KEY = 'df360_customer_user';
export const customerAuth = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },
    getCustomer() {
        const raw = localStorage.getItem(CUSTOMER_KEY);
        try {
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return null;
        }
    },
    setCustomer(customer) {
        localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
    },
    clear() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(CUSTOMER_KEY);
    },
};
async function portalFetch(endpoint, options = {}) {
    const token = customerAuth.getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });
    let body;
    try {
        body = await response.json();
    }
    catch {
        if (!response.ok) {
            throw new Error(`Backend server connection error (${response.status}). Please restart the dev server with 'npm run dev'.`);
        }
        throw new Error('Invalid response format received from server.');
    }
    if (!response.ok || !body.success) {
        const errorMessage = body.error?.message || body.message || 'An error occurred';
        throw new Error(errorMessage);
    }
    return body.data;
}
export const portalService = {
    async login(credentials) {
        const data = await portalFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials),
        });
        customerAuth.setToken(data.accessToken);
        customerAuth.setCustomer(data.customer);
        return data;
    },
    async getQuotes() {
        return portalFetch('/quotes');
    },
    async getQuoteById(id) {
        return portalFetch(`/quotes/${id}`);
    },
    async addComment(quoteId, payload) {
        return portalFetch(`/quotes/${quoteId}/comments`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
    async submitChangeRequest(quoteId, payload) {
        return portalFetch(`/quotes/${quoteId}/change-requests`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
    async submitCounterOffer(quoteId, payload) {
        return portalFetch(`/quotes/${quoteId}/counter-offers`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
    async confirmQuote(quoteId, payload) {
        return portalFetch(`/quotes/${quoteId}/confirm`, {
            method: 'POST',
            body: JSON.stringify(payload),
        });
    },
    logout() {
        customerAuth.clear();
    },
};
//# sourceMappingURL=portal.service.js.map