import React, { useState } from 'react';
import { useOrderBook, useFillOrder } from '../../hooks/useOrders';
import { Order } from '../../types';

const OrderBook: React.FC = () => {
    const { data: orders, isLoading, error } = useOrderBook();
    const fillOrderMutation = useFillOrder();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    if (isLoading) return <div className="p-4 text-center">Loading Market...</div>;
    if (error) return <div className="p-4 text-red-500">Error loading orders</div>;

    const handleBuy = (order: Order) => {
        // For simplicity in this demo component, we buy the full remaining amount
        // In a real UI, you'd open a modal to ask "How much?"
        const amountToBuy = (parseFloat(order.amount) - parseFloat(order.filled_amount)).toString();

        if (confirm(`Buy ${amountToBuy} ${order.currency} @ ${order.rate} ${order.target_currency}?`)) {
            fillOrderMutation.mutate({ orderId: order.id, amount: amountToBuy });
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Market Order Book</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price ({orders?.[0]?.target_currency || 'Rate'})</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders?.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.order_type === 'SELL' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        {order.order_type}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {parseFloat(order.amount) - parseFloat(order.filled_amount)} {order.currency}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {order.rate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleBuy(order)}
                                        className="text-indigo-600 hover:text-indigo-900 font-bold"
                                    >
                                        Take
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {orders?.length === 0 && <p className="text-center text-gray-500 mt-4">No open orders available.</p>}
            </div>
        </div>
    );
};

export default OrderBook;
