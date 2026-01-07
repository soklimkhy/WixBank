import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { Order, OrderStatus } from '../types';

// Fetch the "Order Book" (All Open Orders from others)
export const useOrderBook = () => {
    return useQuery({
        queryKey: ['orders', 'book'],
        queryFn: async () => {
            const response = await api.get<Order[]>('orders/');
            return response.data;
        },
    });
};

// Fetch My Orders
export const useMyOrders = () => {
    return useQuery({
        queryKey: ['orders', 'my'],
        queryFn: async () => {
            const response = await api.get<Order[]>('orders/my-orders/');
            return response.data;
        },
    });
};

// Place a new Limit Order
export const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (newOrder: Partial<Order>) => {
            return await api.post('orders/', newOrder);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
        },
    });
};

// Fill exist order
export const useFillOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ orderId, amount }: { orderId: number; amount: string }) => {
            return await api.post(`orders/${orderId}/fill/`, { amount });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            queryClient.invalidateQueries({ queryKey: ['wallets'] }); // Update balance too
        },
    });
};
