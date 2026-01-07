import { useState } from 'react'
import OrderBook from './components/currency/OrderBook'
import PlaceOrderForm from './components/currency/PlaceOrderForm'

function App() {
    const [activeTab, setActiveTab] = useState('market');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <nav className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex-shrink-0 flex items-center">
                                <h1 className="text-2xl font-bold text-indigo-600">WixBank</h1>
                            </div>
                            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                                <button
                                    onClick={() => setActiveTab('market')}
                                    className={`${activeTab === 'market' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    Market
                                </button>
                                <button
                                    onClick={() => setActiveTab('wallet')}
                                    className={`${activeTab === 'wallet' ? 'border-indigo-500 text-gray-900' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'} inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                                >
                                    My Wallet
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center">
                            {/* Placeholder for User Profile / Login */}
                            <div className="flex-shrink-0">
                                <span className="text-sm text-gray-500">Demo User</span>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {activeTab === 'market' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-1">
                                <PlaceOrderForm />
                                <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
                                    <h3 className="text-lg font-bold mb-2">Market Trends</h3>
                                    <p className="text-gray-500 text-sm">USD/KHR is trading at 4050.</p>
                                </div>
                            </div>
                            <div className="lg:col-span-2">
                                <OrderBook />
                            </div>
                        </div>
                    )}
                    {activeTab === 'wallet' && (
                        <div className="text-center py-10">
                            <h2 className="text-2xl font-bold text-gray-700">Wallet Dashboard</h2>
                            <p className="text-gray-500">Coming soon...</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default App
