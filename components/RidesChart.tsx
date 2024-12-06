"use client";
import type { Point } from "@nivo/line";
import { ResponsiveLine } from "@nivo/line";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { format } from "date-fns";
import { useState } from "react";
import PillSelect from "./PillSelect";

type PointClickHandler = {
	data: {
		x: string | number | Date;
		y: number;
	};
};

export default function RidesChart() {
	const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
	const ridesByDate = useOrcaStore(
		(state) => state.processedStats?.aggregateExtraData.ridesByDate 
	);

	if (!ridesByDate) return null;

	// Group rides by month
	const monthlyData = ridesByDate.reduce<Record<string, number>>(
		(acc, curr) => {
			const monthKey = format(curr.jsDate, "yyyy-MM");
			acc[monthKey] = (acc[monthKey] || 0) + curr.value;
			return acc;
		},
		{}
	);

	// For daily view when a month is selected
	const dailyData = selectedMonth
		? ridesByDate
			.filter((ride) => format(ride.jsDate, "yyyy-MM") === selectedMonth)
			.map((ride) => ({
				x: format(ride.jsDate, "dd MMM"),
				y: ride.value,
			}))
		: [];

	// Create data in Nivo format
	const chartData = [
		{
			id: "rides",
			data: selectedMonth
				? dailyData
				: Object.entries(monthlyData).map(([month, value]) => ({
						x: format(new Date(month), "MMM yyyy"),
                        date: new Date(month),
						y: value,
				  })),
		},
	];

	const handleClick = (point: Point) => {
        console.log(point)
		if (!selectedMonth) {
			// When viewing months, clicking sets the selected month
			// @ts-expect-error the typescript is wrong because Nivo doesn't pass through the date that we are adding to the data
			const clickedDate = point.data.date;
			setSelectedMonth(format(clickedDate, "yyyy-MM"));
		} else {
			// When viewing days, clicking goes back to month view
			setSelectedMonth(null);
		}
	};

	return (
		<div className="h-[300px] w-full relative">
            {/* <PillSelect options={["Month", "Week"]} defaultSelected={undefined} onChange={} /> */}
			<ResponsiveLine
				data={chartData}
				margin={{ top: 20, right: 20, bottom: 50, left: 50 }}
				xScale={{ type: "point" }}
				yScale={{ type: "linear", min: 0, max: "auto" }}
				curve="monotoneX"
				axisBottom={{
					tickRotation: -45,
				}}
				axisLeft={{
					tickSize: 5,
					tickPadding: 5,
					tickRotation: 0,
				}}
				pointSize={8}
				pointColor="white"
				pointBorderWidth={2}
				pointBorderColor={{ from: "serieColor" }}
				enablePointLabel={false}
				useMesh={true}
				onClick={(point) => handleClick(point)}
				theme={{
					axis: {
						ticks: {
							text: {
								fill: "#94a3b8", // slate-400
							},
						},
					},
					grid: {
						line: {
							stroke: "#1e293b", // slate-800
							strokeWidth: 1,
						},
					},
				}}
			/>
		</div>
	);
}
