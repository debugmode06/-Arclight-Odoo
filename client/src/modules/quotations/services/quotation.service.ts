import { apiClient, extractData } from '@/services/api.client';
import {
  Quotation,
  Customer,
  Product,
  CreateQuotationPayload,
  QuotationLineItem,
  CommercialSummary,
  RiskEvaluation,
  QuotationStatus,
  RiskLevel,
} from '../types/quotation.types';
import { ApiResponse } from '@/types';

export interface QuotationListResponse {
  data: Quotation[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RecalculateResponse {
  lines: QuotationLineItem[];
  summary: CommercialSummary;
  risk: RiskEvaluation;
}

export class QuotationService {
  public static async getCustomers(): Promise<Customer[]> {
    const res = await apiClient.get<ApiResponse<Customer[]>>('/quotations/meta/customers');
    return extractData(res);
  }

  public static async getProducts(): Promise<Product[]> {
    const res = await apiClient.get<ApiResponse<Product[]>>('/quotations/meta/products');
    return extractData(res);
  }

  public static async listQuotations(params?: {
    search?: string;
    status?: QuotationStatus;
    customerId?: string;
    riskLevel?: RiskLevel;
    page?: number;
    limit?: number;
  }): Promise<QuotationListResponse> {
    const res = await apiClient.get<{ success: boolean; data: Quotation[]; pagination: any }>(
      '/quotations',
      { params }
    );
    return {
      data: res.data.data || [],
      pagination: res.data.pagination || { page: 1, limit: 20, total: 0, totalPages: 1 },
    };
  }

  public static async getQuotations(params?: {
    search?: string;
    status?: QuotationStatus;
    customerId?: string;
    riskLevel?: RiskLevel;
    page?: number;
    limit?: number;
  }): Promise<QuotationListResponse> {
    return this.listQuotations(params);
  }

  public static async getQuotationById(id: string): Promise<Quotation> {
    const res = await apiClient.get<ApiResponse<Quotation>>(`/quotations/${id}`);
    return extractData(res);
  }

  public static async createQuotation(payload: CreateQuotationPayload): Promise<Quotation> {
    const res = await apiClient.post<ApiResponse<Quotation>>('/quotations', payload);
    return extractData(res);
  }

  public static async updateQuotation(
    id: string,
    payload: Partial<CreateQuotationPayload>
  ): Promise<Quotation> {
    const res = await apiClient.put<ApiResponse<Quotation>>(`/quotations/${id}`, payload);
    return extractData(res);
  }

  public static async deleteQuotation(id: string): Promise<void> {
    await apiClient.delete(`/quotations/${id}`);
  }

  public static async submitQuotation(id: string): Promise<Quotation> {
    const res = await apiClient.post<ApiResponse<Quotation>>(`/quotations/${id}/submit`);
    return extractData(res);
  }

  public static async recalculateDraft(
    payload: CreateQuotationPayload
  ): Promise<RecalculateResponse> {
    const res = await apiClient.post<ApiResponse<RecalculateResponse>>(
      '/quotations/recalculate',
      payload
    );
    return extractData(res);
  }

  public static async getRecommendations(productIds: string[]): Promise<any[]> {
    const res = await apiClient.post<ApiResponse<any[]>>(
      '/quotations/recommendations',
      { productIds }
    );
    return extractData(res);
  }
}
