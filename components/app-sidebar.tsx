"use client"

import { Home, Package, Plus, Truck } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inventory",
    url: "/dashboard/inventory",
    icon: Package,
  },
  {
    title: "Add Roll",
    url: "/dashboard/add-roll",
    icon: Plus,
  },
  {
    title: "Distribution",
    url: "/dashboard/distribution",
    icon: Truck,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-purple-950 via-purple-900 to-purple-950 border-r border-purple-800 backdrop-blur-sm z-50">
      {/* Header */}
      <div className="p-6 border-b border-purple-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">PO</span>
          </div>
          <span className="text-white font-bold text-lg">PaperOps</span>
        </div>
      </div>

      {/* Navigation */}
      <div className="px-4 py-4">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.url
            return (
              <Link
                key={item.title}
                href={item.url}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? "bg-purple-600/50 text-white" : "text-gray-300 hover:text-white hover:bg-purple-600/30"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
