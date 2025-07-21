import { useState } from 'react';
import type { PaymentData, Payment } from '../utils/types';

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  paymentType: 'deposit' | 'balance' | 'full';
  paymentMethod: 'mpesa' | 'cash' | 'cheque' | 'bank_transfer';
  paymentReference?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export const usePayments = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = async (paymentData: PaymentData): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get existing payments
      const existingPayments = JSON.parse(localStorage.getItem('ack_payments') || '[]');

      // Create new payment
      const newPayment: PaymentRecord = {
        id: `payment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        bookingId: paymentData.bookingId,
        amount: paymentData.amount,
        paymentType: paymentData.paymentType,
        paymentMethod: paymentData.paymentMethod,
        paymentReference: paymentData.paymentReference,
        status: paymentData.paymentMethod === 'cash' ? 'pending' : 'completed',
        paidAt: paymentData.paymentMethod === 'cash' ? undefined : new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save payment
      existingPayments.push(newPayment);
      localStorage.setItem('ack_payments', JSON.stringify(existingPayments));

      console.log('✅ Payment created successfully:', newPayment);
      return true;
    } catch (err) {
      console.error('❌ Error creating payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPaymentsByBooking = async (bookingId: string): Promise<Payment[]> => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const payments = JSON.parse(localStorage.getItem('ack_payments') || '[]');
      return payments
        .filter((payment: PaymentRecord) => payment.bookingId === bookingId)
        .sort((a: PaymentRecord, b: PaymentRecord) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentStatus = async (paymentId: string, status: 'completed' | 'failed' | 'refunded'): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      const payments = JSON.parse(localStorage.getItem('ack_payments') || '[]');
      const updatedPayments = payments.map((payment: PaymentRecord) =>
        payment.id === paymentId 
          ? { 
              ...payment, 
              status, 
              paidAt: status === 'completed' ? new Date().toISOString() : payment.paidAt,
              updatedAt: new Date().toISOString()
            }
          : payment
      );

      localStorage.setItem('ack_payments', JSON.stringify(updatedPayments));
      return true;
    } catch (err) {
      console.error('Error updating payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to update payment');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    createPayment,
    getPaymentsByBooking,
    updatePaymentStatus,
    loading,
    error
  };
};