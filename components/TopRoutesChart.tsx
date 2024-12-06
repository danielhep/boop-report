"use client";
import { ResponsivePie } from "@nivo/pie";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";

export default function TopRoutesChart() {
	const routeOccurrences = useOrcaStore(
		(state) => state.processedStats?.aggregateExtraData.routeOccurrences,
	);

	if (!routeOccurrences || routeOccurrences.length === 0) return null;

	// Calculate total rides for percentage
	const totalRides = routeOccurrences.reduce(
		(sum, route) => sum + route.count,
		0,
	);

	// Prepare data for the pie chart
	const pieData = routeOccurrences.map((route) => ({
		id: route.line || "Unknown Route",
		label: `${route.routeShortName || "Unknown Route"} (${route.agencyName})`,
		value: route.count,
		percentage: ((route.count / totalRides) * 100).toFixed(1),
	}));

	return (
		<div className="h-[300px] w-full">
			<ResponsivePie
				data={pieData}
				margin={{ top: 20, bottom: 20 }}
				innerRadius={0.5}
				padAngle={0.7}
				cornerRadius={3}
				activeOuterRadiusOffset={8}
				colors={{ scheme: "paired" }}
				borderWidth={1}
				borderColor={{
					from: "color",
					modifiers: [["darker", 0.2]],
				}}
				arcLinkLabelsSkipAngle={10}
				arcLinkLabelsTextColor="var(--text-main)"
				arcLinkLabelsThickness={2}
				arcLinkLabelsColor={{ from: "color" }}
				arcLabelsSkipAngle={10}
				arcLabelsTextColor={{
					from: "color",
					modifiers: [["darker", 2]],
				}}
				theme={{
					text: {
						fill: "var(--text-main)",
					},
					legends: {
						text: {
							fill: "var(--text-main)",
						},
					},
				}}
				tooltip={({ datum }) => (
					<div className="bg-slate-800 text-slate-200 px-3 py-2 rounded-md shadow-lg">
						<strong>{datum.label}</strong>
						<br />
						{datum.value} {datum.value === 1 ? "ride" : "rides"}
						<br />
						{`${((datum.value / totalRides) * 100).toFixed(1)}% of total rides`}
					</div>
				)}
			/>
		</div>
	);
}
