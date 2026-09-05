import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { portalService, customerAuth } from '../services/portal.service';
import { CustomerUser } from '../types/portal.types';
import {
  CustomerLoginFormValues,
  LineCommentFormValues,
  ChangeRequestFormValues,
  CounterOfferFormValues,
  ConfirmQuoteFormValues,
} from '../schemas/portal.schemas';

export function useCustomerAuth() {
  const [customer, setCustomer] = useState<CustomerUser | null>(customerAuth.getCustomer());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!customerAuth.getToken());

  useEffect(() => {
    const handleStorageChange = () => {
      setCustomer(customerAuth.getCustomer());
      setIsAuthenticated(!!customerAuth.getToken());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials: CustomerLoginFormValues) => {
    const res = await portalService.login(credentials);
    setCustomer(res.customer);
    setIsAuthenticated(true);
    return res;
  };

  const logout = () => {
    portalService.logout();
    setCustomer(null);
    setIsAuthenticated(false);
  };

  return { customer, isAuthenticated, login, logout };
}

export function useCustomerQuotes() {
  return useQuery({
    queryKey: ['customer-quotes'],
    queryFn: () => portalService.getQuotes(),
    staleTime: 30 * 1000,
  });
}

export function useCustomerQuoteDetail(quoteId: string) {
  return useQuery({
    queryKey: ['customer-quote-detail', quoteId],
    queryFn: () => portalService.getQuoteById(quoteId),
    enabled: !!quoteId,
    staleTime: 10 * 1000,
  });
}

export function usePortalActions(quoteId: string) {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['customer-quote-detail', quoteId] });
    queryClient.invalidateQueries({ queryKey: ['customer-quotes'] });
  };

  const addCommentMutation = useMutation({
    mutationFn: (payload: LineCommentFormValues) => portalService.addComment(quoteId, payload),
    onSuccess: () => invalidate(),
  });

  const submitChangeRequestMutation = useMutation({
    mutationFn: (payload: ChangeRequestFormValues) => portalService.submitChangeRequest(quoteId, payload),
    onSuccess: () => invalidate(),
  });

  const submitCounterOfferMutation = useMutation({
    mutationFn: (payload: CounterOfferFormValues) => portalService.submitCounterOffer(quoteId, payload),
    onSuccess: () => invalidate(),
  });

  const confirmQuoteMutation = useMutation({
    mutationFn: (payload: ConfirmQuoteFormValues) => portalService.confirmQuote(quoteId, payload),
    onSuccess: () => invalidate(),
  });

  return {
    addComment: addCommentMutation.mutateAsync,
    isAddingComment: addCommentMutation.isPending,
    submitChangeRequest: submitChangeRequestMutation.mutateAsync,
    isSubmittingChangeRequest: submitChangeRequestMutation.isPending,
    submitCounterOffer: submitCounterOfferMutation.mutateAsync,
    isSubmittingCounterOffer: submitCounterOfferMutation.isPending,
    confirmQuote: confirmQuoteMutation.mutateAsync,
    isConfirmingQuote: confirmQuoteMutation.isPending,
  };
}
