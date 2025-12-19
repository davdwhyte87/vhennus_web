import { Wallet, MoreVertical, Copy, ChevronRight } from "lucide-react"
import AppButton from "../../../Shared/components/Button"
import { useState } from "react"

interface WalletListItemProps {
  name?: string
  address?: string
  balanceVEC?: string
  balanceFiat?: string
  onClick?: () => void
}

export const WalletListItem = (props: WalletListItemProps) => {
  const {
    name = "ranger_team",
    address = "0x742d35Cc6634C0532925a3b8...",
    balanceVEC = "1,902,003",
    balanceFiat = "344,333,333 NGN",
    onClick
  } = props

  const [isHovered, setIsHovered] = useState(false)

  // Shorten address for display
  const shortenAddress = (addr: string) => {
    if (addr.length <= 16) return addr
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`
  }

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(address)
    // You could add a toast notification here
  }

  const handleRowClick = () => {
    if (onClick) {
      onClick()
    }
  }

  return (
    <>
      {/* Mobile View */}
      <div 
        className="md:hidden flex items-center justify-between p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleRowClick}
      >
        <div className="flex items-center space-x-4 flex-1">
          {/* Wallet Icon */}
          <div className="relative">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </div>

          {/* Wallet Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-gray-900">{name}</h3>
              {isHovered && (
                <button 
                  onClick={handleCopyAddress}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Copy address"
                >
                  <Copy className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600 font-mono">
                {shortenAddress(address)}
              </span>
            </div>
          </div>
        </div>

        {/* Balance and Actions */}
        <div className="text-right">
          <div className="flex flex-col items-end">
            <p className="font-bold text-gray-900 text-lg">{balanceVEC} VEC</p>
            <p className="text-sm text-gray-600 mt-1">{balanceFiat}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 mt-2 ml-auto" />
        </div>
      </div>

      {/* Desktop View */}
      <div 
        className="hidden md:flex items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-blue-300 cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleRowClick}
      >
        {/* Wallet Icon */}
        <div className="w-16">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full">
            <Wallet className="h-5 w-5 text-white" />
          </div>
        </div>

        {/* Wallet Name */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-lg truncate">{name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-600 font-mono truncate">
              {address}
            </span>
            <button 
              onClick={handleCopyAddress}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* VEC Balance */}
        <div className="w-48 text-right px-4">
          <p className="font-bold text-gray-900 text-lg">{balanceVEC} VEC</p>
          <p className="text-sm text-gray-600 mt-1">Vhenncoin</p>
        </div>

        {/* Fiat Balance */}
        <div className="w-48 text-right px-4">
          <p className="font-bold text-gray-900 text-lg">{balanceFiat}</p>
          <p className="text-sm text-gray-600 mt-1">Equivalent</p>
        </div>

        {/* Action Menu */}
        <div className="w-12 text-right">
          <button 
            onClick={(e) => {
              e.stopPropagation()
              // Handle more actions
            }} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </>
  )
}