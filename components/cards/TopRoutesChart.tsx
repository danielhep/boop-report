"use client";
import { ResponsivePie } from "@nivo/pie";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { CardHeader } from "../Card";
import { useState } from "react";
import { getAgencyAbbreviation } from "@/lib/utils/agencyAbbreviations";

export default function TopRoutesChartCard() {
	const [limit, setLimit] = useState<number | null>(null);

	return (
		<>	
			<CardHeader
				rightContent={
					<select
						className="bg-background-primary text-black text-sm rounded-md border border-border px-2 py-1"
						value={limit?.toString() ?? "all"}
						onChange={(e) => setLimit(e.target.value === "all" ? null : Number(e.target.value))}
					>
						<option value="all">All Routes</option>
						<option value="5">Top 5</option>
						<option value="10">Top 10</option>
						<option value="25">Top 25</option>
					</select>
				}
			>
				Top Routes
			</CardHeader>
			<TopRoutesChart limit={limit} />
		</>
	);
}

export function TopRoutesChart({ limit }: { limit: number | null }) {
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
	const pieData = routeOccurrences // Create a copy to avoid mutating the original
		.sort((a, b) => b.count - a.count) // Sort by count in descending order
		.slice(0, limit ?? undefined) // Limit the number of routes if specified
		.map((route) => ({
			id: `${route.routeShortName || "Unknown Route"} (${getAgencyAbbreviation(route.agencyName)})`,
			label: `${route.routeShortName || "Unknown Route"} (${getAgencyAbbreviation(route.agencyName)})`,
			fullLabel: `${route.routeShortName || "Unknown Route"} (${route.agencyName})`,
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
						<strong>{datum.data.fullLabel}</strong>
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
