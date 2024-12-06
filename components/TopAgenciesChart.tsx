"use client";
import { ResponsivePie } from "@nivo/pie";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";

export default function TopAgenciesChart() {
    const agencyOccurrences = useOrcaStore(
        (state) => state.processedStats?.aggregateExtraData.agencyOccurrences
    );

	if (!agencyOccurrences || agencyOccurrences.length === 0) return null;

	// Calculate total rides for percentage
	const totalRides = agencyOccurrences.reduce(
		(sum, agency) => sum + agency.count,
		0,
	);
	const otherRides =
		totalRides -
		agencyOccurrences.reduce((sum, agency) => sum + agency.count, 0);

	// Prepare data for the pie chart
	const pieData = [
		...agencyOccurrences.map((agency) => ({
			id: agency.agency,
            label: agency.agency,
            value: agency.count,
            percentage: ((agency.count / totalRides) * 100).toFixed(1)
        })),
        // Add "Other" category if there are more than 5 agencies
        ...(otherRides > 0 ? [{
            id: 'Other',
            label: 'Other Agencies',
            value: otherRides,
            percentage: ((otherRides / totalRides) * 100).toFixed(1)
        }] : [])
    ];

    return (
        <div className="h-[300px] w-full">
            <ResponsivePie
                data={pieData}
                margin={{ top: 20, bottom: 20 }}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                activeOuterRadiusOffset={8}
                colors={{ scheme: 'paired' }}
                borderWidth={1}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 0.2]]
                }}
                arcLinkLabelsSkipAngle={10}
                arcLinkLabelsTextColor="var(--text-main)"
                arcLinkLabelsThickness={2}
                arcLinkLabelsColor={{ from: 'color' }}
                arcLabelsSkipAngle={10}
                arcLabelsTextColor={{
                    from: 'color',
                    modifiers: [['darker', 2]]
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
                        {datum.value} {datum.value === 1 ? 'ride' : 'rides'}
                        <br />
                        {`${(datum.value / totalRides * 100).toFixed(1)}% of total rides`}
                    </div>
                )}
            />
        </div>
    );
} 