'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
	TrendingUp,
	TrendingDown,
	Package,
	Truck,
	Scale,
	Clock,
} from 'lucide-react';

export default function DashboardPage() {
	const stats = [
		{
			title: 'Total Rolls',
			value: '2,100',
			subtitle: 'In stock',
			change: '+14%',
			trend: 'up',
			icon: Package,
		},
		{
			title: 'Today Dispatched',
			value: '1,228',
			subtitle: 'Rolls sent out',
			change: '-3%',
			trend: 'down',
			icon: Truck,
		},
		{
			title: 'Avg Weight',
			value: '6.92 kg',
			subtitle: 'Per roll',
			change: '+11%',
			trend: 'up',
			icon: Scale,
		},
		{
			title: 'Avg Requests',
			value: '2.3',
			subtitle: 'Per hour',
			change: '+21%',
			trend: 'up',
			icon: Clock,
		},
	];

	const recentActivity = [
		{
			action: 'Roll SKU-001 added to storage',
			time: '2 minutes ago',
			type: 'success',
		},
		{
			action: 'Delivery #DEL-456 marked as delivered',
			time: '15 minutes ago',
			type: 'info',
		},
		{
			action: 'Storage location A-12 updated',
			time: '1 hour ago',
			type: 'warning',
		},
		{
			action: 'New user registered: John Doe',
			time: '2 hours ago',
			type: 'info',
		},
	];

	const lowStockAlerts = [
		{
			sku: 'SKU-001',
			location: 'A-12',
			current: 5,
			min: 10,
			status: 'critical',
		},
		{
			sku: 'SKU-045',
			location: 'B-06',
			current: 3,
			min: 15,
			status: 'critical',
		},
		{
			sku: 'SKU-087',
			location: 'C-15',
			current: 8,
			min: 20,
			status: 'warning',
		},
	];

	return (
		<div className="space-y-6">
			{/* Stats Grid */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<Card
							key={stat.title}
							className="bg-gray-900/50 border-purple-700 backdrop-blur-sm"
						>
							<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
								<CardTitle className="text-sm font-medium text-white">
									{stat.title}
								</CardTitle>
								<Icon className="h-4 w-4 text-gray-400" />
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold text-white">
									{stat.value}
								</div>
								<div className="flex items-center justify-between mt-2">
									<p className="text-xs text-gray-400">
										{stat.subtitle}
									</p>
									<div
										className={`flex items-center text-xs ${
											stat.trend === 'up'
												? 'text-green-400'
												: 'text-red-400'
										}`}
									>
										{stat.trend === 'up' ? (
											<TrendingUp className="h-3 w-3 mr-1" />
										) : (
											<TrendingDown className="h-3 w-3 mr-1" />
										)}
										{stat.change}
									</div>
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>

			{/* Activity and Alerts */}
			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{/* Recent Activity */}
				<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-white">
							Recent Activity
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{recentActivity.map((activity, index) => (
							<div
								key={index}
								className="flex items-start space-x-3"
							>
								<div
									className={`w-2 h-2 rounded-full mt-2 ${
										activity.type === 'success'
											? 'bg-green-400'
											: activity.type === 'warning'
											? 'bg-yellow-400'
											: 'bg-blue-400'
									}`}
								/>
								<div className="flex-1 space-y-1">
									<p className="text-sm text-white">
										{activity.action}
									</p>
									<p className="text-xs text-gray-400">
										{activity.time}
									</p>
								</div>
							</div>
						))}
					</CardContent>
				</Card>

				{/* Low Stock Alerts */}
				<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-white">
							Low Stock Alerts
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						{lowStockAlerts.map((alert, index) => (
							<div
								key={index}
								className="flex items-center justify-between p-3 bg-purple-700/50 opacity-80 border-2 border-purple-800 bg-linear-to-br rounded-lg"
							>
								<div className="space-y-1">
									<div className="text-sm font-medium text-white">
										{alert.sku}
									</div>
									<div className="text-xs text-gray-400">
										Location: {alert.location}
									</div>
								</div>
								<div className="text-right space-y-1">
									<Badge
										variant={
											alert.status === 'critical'
												? 'destructive'
												: 'secondary'
										}
									>
										{alert.current}/{alert.min}
									</Badge>
									<div className="text-xs text-gray-400">
										Current/Min
									</div>
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
