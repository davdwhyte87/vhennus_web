import { Check, ChevronDown, Eye, EyeOff, Plus, Wallet, Shield, TrendingUp, ArrowUpRight, ArrowDownRight, List } from "lucide-react"
import BackHomeNav from "../../../Shared/components/BackHomeNav"
import AppButton from "../../../Shared/components/Button"
import { useWalletStore } from "../useWalletStore"
import { WalletListItem } from "../components/WalletListItem"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export const AllWalletsPage = () => {
    const walletStore = useWalletStore()
    const navigate = useNavigate()
    const [selectedCurrency, setSelectedCurrency] = useState('NGN')
    const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
    
    const handleHideSwitch = () => {
        console.log('hide')
        if (walletStore.hideNumbers) {
            walletStore.setState({ hideNumbers: false })
        } else {
            walletStore.setState({ hideNumbers: true })
        }
    }

    const handleCurrencyChange = (currency: string) => {
        setSelectedCurrency(currency)
        setIsCurrencyOpen(false)
    }

    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
        { code: 'EUR', symbol: '€', name: 'Euro' }
    ]

    const selectedCurrencyObj = currencies.find(c => c.code === selectedCurrency)

    const handleWalletClick = (walletId: string) => {
        console.log('Clicked wallet:', walletId)
        navigate(`/wallet/${walletId}`)
    }

    const handleBuyClick = () => {
        navigate('/buy')
    }

    const handleSellClick = () => {
        navigate('/sell')
    }

    const handleOrdersClick = () => {
        navigate('/orders')
    }

    // Format currency based on selected currency
    const formatFiatAmount = (amount: string) => {
        if (walletStore.hideNumbers) return "********"
        return `${selectedCurrencyObj?.symbol} ${amount}`
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 pb-20">
            <BackHomeNav title="Wallets" />
            
            <div className="flex flex-col space-y-6 p-4">
                {/* Total Assets Card */}
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-5 shadow-xl">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 h-32 w-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 h-20 w-20 bg-white/10 rounded-full translate-y-10 -translate-x-10"></div>
                    
                    <div className="relative z-10">
                        <div className="flex flex-row justify-between items-start mb-4">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                                        <Wallet className="h-5 w-5 text-white" />
                                    </div>
                                    <span className="text-sm text-white/90 font-medium">Total Assets</span>
                                </div>
                                
                                {/* Currency Selector */}
                                <div className="relative inline-block w-32 mb-4">
                                    <button
                                        onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                                        className="flex items-center justify-between w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-semibold text-base px-3 py-2 rounded-lg transition-all duration-300"
                                    >
                                        <span>{selectedCurrency}</span>
                                        <ChevronDown className={`h-4 w-4 text-white/80 transition-transform duration-300 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
                                    </button>
                                    
                                    {isCurrencyOpen && (
                                        <div className="absolute top-full left-0 mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-20">
                                            {currencies.map((currency) => (
                                                <button
                                                    key={currency.code}
                                                    onClick={() => handleCurrencyChange(currency.code)}
                                                    className={`flex items-center justify-between w-full px-3 py-2 hover:bg-blue-50 transition-colors text-left ${selectedCurrency === currency.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium text-sm">{currency.code}</span>
                                                        <span className="text-xs text-gray-500">{currency.name}</span>
                                                    </div>
                                                    {selectedCurrency === currency.code && (
                                                        <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <button
                                onClick={handleHideSwitch}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-all duration-300"
                                aria-label={walletStore.hideNumbers ? "Show numbers" : "Hide numbers"}
                            >
                                {walletStore.hideNumbers ? (
                                    <Eye className="h-5 w-5 text-white" />
                                ) : (
                                    <EyeOff className="h-5 w-5 text-white" />
                                )}
                            </button>
                        </div>

                        {/* VEC Balance */}
                        <div className="mb-4">
                            <span className="text-sm text-white/80 font-medium">Vhenncoin (VEC) Balance</span>
                            <div className="mt-1">
                                <h2 className="text-2xl md:text-3xl font-bold text-white">
                                    {walletStore.hideNumbers ? "********" : "12,000,000,000 VEC"}
                                </h2>
                            </div>
                        </div>

                        {/* Fiat Balance */}
                        <div>
                            <span className="text-sm text-white/80 font-medium">Fiat Equivalent</span>
                            <div className="mt-1">
                                <h3 className="text-xl md:text-2xl font-bold text-white">
                                    {walletStore.hideNumbers ? "********" : formatFiatAmount("12,000,000,000")}
                                </h3>
                            </div>
                        </div>

                        {/* Price Indicator */}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/20">
                            <div className="flex items-center gap-1 px-2 py-1 bg-green-500/20 backdrop-blur-sm rounded-full">
                                <TrendingUp className="h-3 w-3 text-green-300" />
                                <span className="text-xs text-green-300 font-medium">+5.2%</span>
                            </div>
                            <span className="text-white/80 text-sm">
                                1 VEC = {formatFiatAmount("180")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Trading Actions - Mobile Optimized */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Trading Actions</h3>
                        <span className="text-sm text-gray-500">Quick Trade</span>
                    </div>
                    
                    {/* Buy/Sell/Orders Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                        <AppButton
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4"
                            onClick={handleBuyClick}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <ArrowUpRight className="h-6 w-6" />
                                <span className="text-sm font-bold">Buy</span>
                            </div>
                        </AppButton>

                        <AppButton
                            variant="outline"
                            className="w-full border-red-300 text-red-600 hover:bg-red-50 font-bold py-4"
                            onClick={handleSellClick}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <ArrowDownRight className="h-6 w-6" />
                                <span className="text-sm font-bold">Sell</span>
                            </div>
                        </AppButton>

                        <AppButton
                            variant="outline"
                            className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 font-bold py-4"
                            onClick={handleOrdersClick}
                        >
                            <div className="flex flex-col items-center gap-2">
                                <List className="h-6 w-6" />
                                <span className="text-sm font-bold">Orders</span>
                            </div>
                        </AppButton>
                    </div>

                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-200">
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">24h Volume</p>
                            <p className="font-bold text-gray-900 text-sm">{formatFiatAmount("2.4M")}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">Market Cap</p>
                            <p className="font-bold text-gray-900 text-sm">{formatFiatAmount("45B")}</p>
                        </div>
                    </div>
                </div>

                {/* Wallet Management Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <AppButton
                        variant="outline"
                        className="w-full bg-white hover:bg-gray-50 border-2 border-blue-200 rounded-xl p-4 h-auto"
                        onClick={() => navigate('add')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
                                <Plus className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-900 text-sm">Import</h3>
                                <p className="text-xs text-gray-600 mt-1">Add existing wallet</p>
                            </div>
                        </div>
                    </AppButton>

                    <AppButton
                        variant="outline"
                        className="w-full bg-white hover:bg-gray-50 border-2 border-purple-200 rounded-xl p-4 h-auto"
                        onClick={() => navigate('new')}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full">
                                <Check className="h-5 w-5 text-white" />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-gray-900 text-sm">Create New</h3>
                                <p className="text-xs text-gray-600 mt-1">Generate wallet</p>
                            </div>
                        </div>
                    </AppButton>
                </div>

                {/* Wallet List Header */}
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <Shield className="h-5 w-5 text-blue-600" />
                            Wallet List
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">Tap wallet to view details</p>
                    </div>
                    <span className="text-sm text-gray-500">6 wallets</span>
                </div>

                {/* Wallet List */}
                <div className="space-y-3">
                    <WalletListItem 
                        name="ranger_team"
                        address="0x742d35Cc6634C0532925a3b844Bc9e90e2f3b5a1"
                        balanceVEC="1,902,003"
                        balanceFiat={formatFiatAmount("344,333,333")}
                        onClick={() => handleWalletClick('ranger_team')}
                    />
                    <WalletListItem 
                        name="savings_wallet"
                        address="0x892d35Cc6634C0532925a3b844Bc9e90e2f3b5a2"
                        balanceVEC="5,002,450"
                        balanceFiat={formatFiatAmount("901,445,120")}
                        onClick={() => handleWalletClick('savings_wallet')}
                    />
                    <WalletListItem 
                        name="business_account"
                        address="0x992d35Cc6634C0532925a3b844Bc9e90e2f3b5a3"
                        balanceVEC="12,502,003"
                        balanceFiat={formatFiatAmount("2,244,333,333")}
                        onClick={() => handleWalletClick('business_account')}
                    />
                    <WalletListItem 
                        name="personal_wallet"
                        address="0x642d35Cc6634C0532925a3b844Bc9e90e2f3b5a4"
                        balanceVEC="902,003"
                        balanceFiat={formatFiatAmount("144,333,333")}
                        onClick={() => handleWalletClick('personal_wallet')}
                    />
                    <WalletListItem 
                        name="investment_fund"
                        address="0x542d35Cc6634C0532925a3b844Bc9e90e2f3b5a5"
                        balanceVEC="25,902,003"
                        balanceFiat={formatFiatAmount("4,644,333,333")}
                        onClick={() => handleWalletClick('investment_fund')}
                    />
                    <WalletListItem 
                        name="emergency_fund"
                        address="0x342d35Cc6634C0532925a3b844Bc9e90e2f3b5a6"
                        balanceVEC="3,902,003"
                        balanceFiat={formatFiatAmount("644,333,333")}
                        onClick={() => handleWalletClick('emergency_fund')}
                    />
                </div>

                {/* Fixed Bottom Action Bar (Mobile Only) */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-lg">
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={handleBuyClick}
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-green-50 hover:bg-green-100 transition-colors"
                        >
                            <ArrowUpRight className="h-5 w-5 text-green-600 mb-1" />
                            <span className="text-xs font-medium text-green-700">Buy</span>
                        </button>
                        <button 
                            onClick={handleOrdersClick}
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                        >
                            <List className="h-5 w-5 text-blue-600 mb-1" />
                            <span className="text-xs font-medium text-blue-700">Orders</span>
                        </button>
                        <button 
                            onClick={handleSellClick}
                            className="flex flex-col items-center justify-center p-2 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                        >
                            <ArrowDownRight className="h-5 w-5 text-red-600 mb-1" />
                            <span className="text-xs font-medium text-red-700">Sell</span>
                        </button>
                    </div>
                </div>

                {/* View All Button */}
                <div className="mt-6 text-center pb-16">
                    <button className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 mx-auto">
                        <span>View All Wallets</span>
                        <ChevronDown className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}