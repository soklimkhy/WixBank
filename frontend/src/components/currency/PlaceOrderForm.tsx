import React, { useState } from 'react';
import { useCreateOrder } from '../../hooks/useOrders';
import { OrderType } from '../../types';

const PlaceOrderForm: React.FC = () => {
    const createOrder = useCreateOrder();

    const [formData, setFormData] = useState({
        order_type: OrderType.SELL, // Default: I want to SELL USD
        currency: 'USD',
        target_currency: 'KHR',
        amount: '',
        rate: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        createOrder.mutate(formData);
        // Reset form or show success toast
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-bold mb-4">Place Limit Order</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">I want to</label>
                        <select
                            value={formData.order_type}
                            onChange={e => setFormData({ ...formData, order_type: e.target.value as OrderType })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        >
                            <option value={OrderType.BUY}>BUY (Bid)</option>
                            <option value={OrderType.SELL}>SELL (Ask)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Currency</label>
                        <select
                            value={formData.currency}
                            onChange={e => setFormData({ ...formData, currency: e.target.value })}
                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        >
                            <option value="USD">USD</option>
                            <option value="KHR">KHR</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Amount</label>
                    <input
                        type="number"
                        value={formData.amount}
                        onChange={e => setFormData({ ...formData, amount: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        placeholder="100.00"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Rate (Price in {formData.target_currency})</label>
                    <input
                        type="number"
                        value={formData.rate}
                        onChange={e => setFormData({ ...formData, rate: e.target.value })}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm p-2 border"
                        placeholder="4050"
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={createOrder.isPending}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
                >
                    {createOrder.isPending ? 'Placing Order...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
};

export default PlaceOrderForm;
