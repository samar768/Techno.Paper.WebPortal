'use client';

import { Dock, DockIcon } from '@/components/ui/dock';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';
import {
	MessageCircleIcon,
	FileTextIcon,
	UploadCloudIcon,
	Link2Icon,
	SaveIcon,
	FileOutputIcon,
	FileText as FileTextLucideIcon,
	CheckCircle2Icon,
} from 'lucide-react';

export default function SalesOrderFooter() {
	return (
		<TooltipProvider>
			<div className="fixed inset-x-0 bottom-4 z-40 flex justify-center pointer-events-none">
				<div className="w-full max-w-6xl px-4 flex justify-center pointer-events-auto">
					<Dock
						direction="middle"
						className="w-full flex items-center justify-between gap-10 bg-background/95 border border-border shadow-[0_18px_40px_rgba(15,23,42,0.18)]"
						disableMagnification
					>
						{/* Left: icon + label vertically aligned, similar to mockup */}
						<div className="flex items-end gap-10 pl-6">
							<DockIcon className="cursor-default!">
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex flex-col items-center gap-1">
											<div className="relative">
												<MessageCircleIcon className="h-5 w-5 text-slate-600" />
												<span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-semibold text-white">
													1
												</span>
											</div>
											<span className="text-[10px] font-medium text-slate-800 whitespace-nowrap">
												History & Notes
											</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>View comments and activity</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>

							<DockIcon className="cursor-default!">
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex flex-col items-center gap-1">
											<FileTextIcon className="h-5 w-5 text-slate-500" />
											<span className="text-[10px] font-medium text-slate-800">
												Introduction
											</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Overview details</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>

							<DockIcon className="cursor-default!">
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex flex-col items-center gap-1">
											<UploadCloudIcon className="h-5 w-5 text-slate-500" />
											<span className="text-[10px] font-medium text-slate-800">
												Attachments
											</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Files & documents</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>

							<DockIcon className="cursor-default!">
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex flex-col items-center gap-1">
											<div className="relative">
												<Link2Icon className="h-5 w-5 text-slate-500" />
												<span className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[8px] font-semibold text-white">
													1
												</span>
											</div>
											<span className="text-[10px] font-medium text-slate-800">
												Links
											</span>
										</div>
									</TooltipTrigger>
									<TooltipContent>
										<p>Related resources</p>
									</TooltipContent>
								</Tooltip>
							</DockIcon>
						</div>

						<Separator
							orientation="vertical"
							className="h-10 bg-border/70"
						/>

						{/* Right: action buttons */}
						<div className="flex items-center gap-2 pr-3">
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-4 text-xs"
								type="button"
							>
								<SaveIcon className="mr-2 h-3 w-3" />
								Save
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-4 text-xs"
								type="button"
							>
								<FileOutputIcon className="mr-2 h-3 w-3" />
								Draft
							</Button>
							<Button
								variant="outline"
								size="sm"
								className="h-8 px-4 text-xs"
								type="button"
							>
								<FileTextLucideIcon className="mr-2 h-3 w-3" />
								Print PDF
							</Button>
							<Button
								variant="default"
								size="sm"
								className="h-8 px-5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
								type="button"
							>
								<CheckCircle2Icon className="mr-2 h-3 w-3" />
								Save & Approve
							</Button>
						</div>
					</Dock>
				</div>
			</div>
		</TooltipProvider>
	);
}
