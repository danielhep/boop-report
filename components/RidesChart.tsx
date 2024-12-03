"use client";
import { ResponsiveLine } from "@nivo/line";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { format } from "date-fns";

export default function RidesChart() {
	const ridesByDate = useOrcaStore(
		(state) => state.processedStats?.aggregateExtraData.ridesByDate,
	);

	// Group rides by month
	const monthlyData = ridesByDate.reduce<Record<string, number>>(
		(acc, curr) => {
			const monthKey = format(curr.jsDate, "yyyy-MM");
			acc[monthKey] = (acc[monthKey] || 0) + curr.value;
			return acc;
		},
		{},
	);

	// Create data in Nivo format
	const chartData = [
		{
			id: "rides",
			data: Object.entries(monthlyData).map(([month, value]) => ({
				x: format(new Date(month), "MMM yyyy"),
				y: value,
			})),
		},
	];

	return (
		<div className="h-[300px] w-full">
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
