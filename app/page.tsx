'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const demoAccounts = [
		{ role: 'Admin', email: 'admin@paperops.com' },
		{ role: 'Warehouse Manager', email: 'manager@paperops.com' },
		{ role: 'Driver', email: 'driver@paperops.com' },
		{ role: 'Viewer', email: 'viewer@paperops.com' },
	];

	const handleDemoLogin = (demoEmail: string) => {
		setEmail(demoEmail);
		setPassword('demo123');
	};

	const handleSignIn = () => {
		// Redirect to dashboard for demo purposes
		window.location.href = '/dashboard';
	};

	return (
		<div className="min-h-screen bg-linear-to-br from-purple-950 via-purple-800 to-purple-600 flex items-center justify-center p-4">
			<div className="w-full max-w-md space-y-8">
				{/* Logo and Branding */}
				<div className="text-center space-y-4">
					<div className="mx-auto w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center">
						<span className="text-white font-bold text-xl">PS</span>
					</div>
					<div>
						<h1 className="text-3xl font-bold text-white">
							PaperSoft
						</h1>
						<p className="text-purple-200 text-sm">
							Paper Roll Management System
						</p>
					</div>
				</div>

				{/* Sign In Form */}
				<Card className="bg-gray-900/50 border-purple-700 backdrop-blur-sm">
					<CardHeader className="text-center">
						<CardTitle className="text-white text-xl">
							Sign In
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<Label htmlFor="email" className="text-gray-300">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								placeholder="Enter your email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="password" className="text-gray-300">
								Password
							</Label>
							<Input
								id="password"
								type="password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="bg-purple-950/80 border-purple-700 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-400"
							/>
						</div>
						<Button
							onClick={handleSignIn}
							className="w-full bg-purple-600 hover:bg-purple-700 text-white"
						>
							Sign In
						</Button>
						<p className="text-center text-gray-400 text-sm">
							Need an account?{' '}
							<span className="text-purple-400 cursor-pointer">
								Sign up
							</span>
						</p>
					</CardContent>
				</Card>

				{/* Demo Accounts */}
				<Card className="bg-purple-950/80 border-purple-700 backdrop-blur-sm">
					<CardHeader>
						<CardTitle className="text-white text-sm">
							Demo Accounts:
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-3">
						{demoAccounts.map((account) => (
							<div key={account.role} className="space-y-1">
								<div className="text-white font-medium text-sm">
									{account.role}
								</div>
								<div
									className="text-gray-400 text-sm cursor-pointer hover:text-purple-400 transition-colors"
									onClick={() =>
										handleDemoLogin(account.email)
									}
								>
									{account.email}
								</div>
							</div>
						))}
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
