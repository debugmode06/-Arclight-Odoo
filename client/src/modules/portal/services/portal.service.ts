import {
  CustomerUser,
  CustomerQuotationSummary,
  CustomerQuotationDetail,
} from '../types/portal.types';
import {
  CustomerLoginFormValues,
  LineCommentFormValues,
  ChangeRequestFormValues,
  CounterOfferFormValues,
  ConfirmQuoteFormValues,
} from '../schemas/portal.schemas';

const API_BASE = '/api/portal';
const TOKEN_KEY = 'df360_customer_token';
const CUSTOMER_KEY = 'df360_customer_user';

export const customerAuth = {
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  getCustomer(): CustomerUser | null {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setCustomer(customer: CustomerUser) {
    localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(CUSTOMER_KEY);
  },
};

async function portalFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = customerAuth.getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  let body: any;
  try {
    body = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error(`Backend server connection error (${response.status}). Please restart the dev server with 'npm run dev'.`);
    }
    throw new Error('Invalid response format received from server.');
  }

  if (!response.ok || !body.success) {
    const errorMessage = body.error?.message || body.message || 'An error occurred';
    throw new Error(errorMessage);
  }

  return body.data as T;
}

export const portalService = {
  async login(credentials: CustomerLoginFormValues): Promise<{ accessToken: string; customer: CustomerUser }> {
    const data = await portalFetch<{ accessToken: string; customer: CustomerUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    customerAuth.setToken(data.accessToken);
    customerAuth.setCustomer(data.customer);
    return data;
  },

  async getQuotes(): Promise<CustomerQuotationSummary[]> {
    return portalFetch<CustomerQuotationSummary[]>('/quotes');
  },

  async getQuoteById(id: string): Promise<CustomerQuotationDetail> {
    return portalFetch<CustomerQuotationDetail>(`/quotes/${id}`);
  },

  async addComment(quoteId: string, payload: LineCommentFormValues): Promise<CustomerQuotationDetail> {
    return portalFetch<CustomerQuotationDetail>(`/quotes/${quoteId}/comments`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitChangeRequest(quoteId: string, payload: ChangeRequestFormValues): Promise<CustomerQuotationDetail> {
    return portalFetch<CustomerQuotationDetail>(`/quotes/${quoteId}/change-requests`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async submitCounterOffer(quoteId: string, payload: CounterOfferFormValues): Promise<CustomerQuotationDetail> {
    return portalFetch<CustomerQuotationDetail>(`/quotes/${quoteId}/counter-offers`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async confirmQuote(quoteId: string, payload: ConfirmQuoteFormValues): Promise<CustomerQuotationDetail> {
    return portalFetch<CustomerQuotationDetail>(`/quotes/${quoteId}/confirm`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  logout() {
    customerAuth.clear();
  },
};
