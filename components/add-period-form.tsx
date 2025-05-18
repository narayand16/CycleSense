"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	format,
	isAfter,
	isBefore,
	addDays,
	subDays,
	differenceInDays,
} from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import type { MenstrualCycle } from "@/lib/types";
import { addCycle, getUserData } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import labels from "@/lib/labels.json";

export function AddPeriodForm({ onSuccess }: { onSuccess?: () => void }) {
	const { toast } = useToast();
	const [startDate, setStartDate] = useState<Date | undefined>(undefined);
	const [endDate, setEndDate] = useState<Date | undefined>(undefined);
	const [notes, setNotes] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = () => {
		if (!startDate || !endDate) {
			toast({
				title: "Error",
				description: labels.messages.error.selectDates,
				variant: "destructive",
			});
			return;
		}

		if (isAfter(startDate, endDate)) {
			toast({
				title: "Error",
				description: labels.messages.error.startAfterEnd,
				variant: "destructive",
			});
			return;
		}

		const duration = differenceInDays(endDate, startDate) + 1;
		if (duration > 14) {
			toast({
				title: "Warning",
				description: labels.messages.error.longDuration,
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);

		// Create new cycle
		const newCycle: MenstrualCycle = {
			id: Date.now().toString(),
			startDate: startDate.toISOString(),
			endDate: endDate.toISOString(),
			duration,
			notes: notes.trim() || undefined,
		};

		// Add to storage
		addCycle(newCycle);

		// Reset form
		setStartDate(undefined);
		setEndDate(undefined);
		setNotes("");
		setIsSubmitting(false);

		toast({
			title: "Success",
			description: labels.messages.success.periodAdded,
		});

		if (onSuccess) {
			onSuccess();
		}
	};

	return (
		<div className="space-y-4 p-1">
			<div className="space-y-2">
				<Label htmlFor="start-date">
					{labels.forms.periodLog.startDate.label}
				</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							id="start-date"
							variant="outline"
							className={cn(
								"w-full justify-start text-left font-normal",
								!startDate && "text-muted-foreground",
							)}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{startDate
								? format(startDate, "PPP")
								: labels.forms.periodLog.startDate.placeholder}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={startDate}
							onSelect={setStartDate}
							initialFocus
							disabled={
								(date) =>
									isAfter(date, new Date()) || // Future dates
									(endDate ? isAfter(date, endDate) : false) // After end date
							}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="space-y-2">
				<Label htmlFor="end-date">{labels.forms.periodLog.endDate.label}</Label>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							id="end-date"
							variant="outline"
							className={cn(
								"w-full justify-start text-left font-normal",
								!endDate && "text-muted-foreground",
							)}
							disabled={!startDate}
						>
							<CalendarIcon className="mr-2 h-4 w-4" />
							{endDate
								? format(endDate, "PPP")
								: labels.forms.periodLog.endDate.placeholder}
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-auto p-0">
						<Calendar
							mode="single"
							selected={endDate}
							onSelect={setEndDate}
							initialFocus
							disabled={
								(date) =>
									isAfter(date, new Date()) || // Future dates
									(startDate ? isBefore(date, startDate) : true) || // Before start date
									(startDate ? differenceInDays(date, startDate) > 14 : false) // More than 14 days from start
							}
						/>
					</PopoverContent>
				</Popover>
			</div>

			<div className="space-y-2">
				<Label htmlFor="notes">{labels.forms.periodLog.notes.label}</Label>
				<textarea
					id="notes"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					placeholder={labels.forms.periodLog.notes.placeholder}
				/>
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={!startDate || !endDate || isSubmitting}
				onClick={handleSubmit}
			>
				{isSubmitting
					? labels.forms.periodLog.submitting
					: labels.forms.periodLog.submit}
			</Button>
		</div>
	);
}
