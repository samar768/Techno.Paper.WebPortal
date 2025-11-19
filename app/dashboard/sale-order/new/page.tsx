import { getSaleOrderLookups } from '@/lib/lookups';
import SalesOrderEditor from '@/features/sales-order/SalesOrderEditor';

export default async function NewSaleOrderPage() {
	const lookups = await getSaleOrderLookups();

	return (
		<div className="pb-16">
			<SalesOrderEditor lookups={lookups} startEmptyLines />
		</div>
	);
}

const _legacyNewSaleOrder = `
														'weightSecUnit',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.secUnit}
												onChange={(e) =>
													handleRowChange(
														idx,
														'secUnit',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.weightSku}
												onChange={(e) =>
													handleRowChange(
														idx,
														'weightSku',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.tol}
												onChange={(e) =>
													handleRowChange(
														idx,
														'tol',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.skuUnit}
												onChange={(e) =>
													handleRowChange(
														idx,
														'skuUnit',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.rate}
												onChange={(e) =>
													handleRowChange(
														idx,
														'rate',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.amount}
												onChange={(e) =>
													handleRowChange(
														idx,
														'amount',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.oh}
												onChange={(e) =>
													handleRowChange(
														idx,
														'oh',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
										<TableCell className="text-gray-300">
											<Input
												value={row.ad}
												onChange={(e) =>
													handleRowChange(
														idx,
														'ad',
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>

					{/* Totals strip */}
					<div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm">
						<div className="text-gray-200">Total</div>
						<div className="text-gray-200">
							Quantity : {form.totalQty}
						</div>
						<div className="text-gray-200">
							Weight : {form.totalWeight}
						</div>
					</div>

					{/* Bottom panels */}
					<div className="mt-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
						<div className="rounded-lg border border-purple-800">
							<div className="bg-gray-800/50 px-3 py-2 border-b border-purple-800 text-gray-200">
								Field Name
							</div>
							<div className="divide-y divide-purple-800/60">
								{[
									['Duty & taxes', 'dutyTaxes'],
									['Freight', 'freight'],
									['Remark', 'remark'],
									['Delivery', 'delivery'],
								].map(([label, key]) => (
									<div
										key={String(key)}
										className="grid grid-cols-2 gap-2 px-3 py-2"
									>
										<div className="text-gray-300">
											{label}
										</div>
										<div className="text-gray-100">
											<Input
												value={(form as any)[key]}
												onChange={(e) =>
													handleChange(
														String(key),
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</div>
									</div>
								))}
							</div>
						</div>
						<div className="rounded-lg border border-purple-800">
							<div className="bg-gray-800/50 px-3 py-2 border-b border-purple-800 text-gray-200">
								Heads
							</div>
							<div className="divide-y divide-purple-800/60">
								{[
									['Gross Amount', 'headGrossAmount'],
									['Bill Amount', 'headBillAmount'],
									['Round Off', 'headRoundOff'],
									['Net Amount', 'headNetAmount'],
								].map(([label, key]) => (
									<div
										key={String(label)}
										className="grid grid-cols-3 gap-2 px-3 py-2"
									>
										<div className="text-gray-300">
											{label}
										</div>
										<div className="text-gray-300">
											0.000
										</div>
										<div className="text-gray-100">
											<Input
												value={(form as any)[key]}
												onChange={(e) =>
													handleChange(
														String(key),
														e.target.value
													)
												}
												className="bg-purple-950/80 border-purple-700 text-white"
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Footer actions */}
					<div className="mt-4 flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={handleCancel}
							className="border-gray-500 text-gray-300 bg-gray-800"
						>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							className="bg-purple-600 hover:bg-purple-700"
						>
							Save
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
		);
`;
