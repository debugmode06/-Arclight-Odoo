import { apiClient, extractData } from '@/services/api.client';
import { ApprovalRequest, ApprovalStatus } from '../types/approval.types';
import { ApiResponse } from '@/types';

export class ApprovalService {
  public static async listApprovals(params?: {
    status?: ApprovalStatus;
    quotationId?: string;
  }): Promise<ApprovalRequest[]> {
    const res = await apiClient.get<ApiResponse<ApprovalRequest[]>>('/approvals', { params });
    return extractData(res);
  }

  public static async getApprovalById(id: string): Promise<ApprovalRequest> {
    const res = await apiClient.get<ApiResponse<ApprovalRequest>>(`/approvals/${id}`);
    return extractData(res);
  }

  public static async approve(id: string, comment: string): Promise<ApprovalRequest> {
    const res = await apiClient.post<ApiResponse<ApprovalRequest>>(`/approvals/${id}/approve`, {
      comment,
    });
    return extractData(res);
  }

  public static async reject(id: string, comment: string): Promise<ApprovalRequest> {
    const res = await apiClient.post<ApiResponse<ApprovalRequest>>(`/approvals/${id}/reject`, {
      comment,
    });
    return extractData(res);
  }

  public static async returnForRevision(id: string, comment: string): Promise<ApprovalRequest> {
    const res = await apiClient.post<ApiResponse<ApprovalRequest>>(`/approvals/${id}/return`, {
      comment,
    });
    return extractData(res);
  }
}
