"use client";
import { ResponsiveBar } from "@nivo/bar";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { CardHeader } from "../Card";
import { useState } from "react";

export default function TopVehiclesChartCard() {
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
                        <option value="all">All Vehicles</option>
                        <option value="5">Top 5</option>
                        <option value="10">Top 10</option>
                        <option value="25">Top 25</option>
                    </select>
                }
            >
                Most Frequently Used Vehicles
            </CardHeader>
            <TopVehiclesChart limit={limit} />
        </>
    );
}

function TopVehiclesChart({ limit }: { limit: number | null }) {
    const vehicleOccurrences = useOrcaStore(
        (state) => state.processedStats?.aggregateExtraData.vehicleOccurrences
    );

    if (!vehicleOccurrences || vehicleOccurrences.length === 0) return null;

    // Sort by count and limit if specified
    const chartData = vehicleOccurrences
        .sort((a, b) => b.count - a.count)
        .slice(0, limit ?? undefined)
        .map(vehicle => ({
            vehicleId: vehicle.vehicleId,
            agency: vehicle.agencyName,
            rides: vehicle.count,
            label: `${vehicle.vehicleId} (${vehicle.agencyName})`
        }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveBar
                data={chartData}
                keys={['rides']}
                indexBy="label"
                margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                padding={0.3}
                layout="vertical"
                colors={{ scheme: 'paired' }}
                borderColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                }}
                axisTop={null}
                axisRight={null}
                axisBottom={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 45,
                    legend: 'Vehicle ID',
                    legendPosition: 'middle',
                    legendOffset: 45,
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of Rides',
                    legendPosition: 'middle',
                    legendOffset: -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                }}
                role="application"
                ariaLabel="Vehicle usage frequency"
                theme={{
                    text: {
                        fill: "var(--text-main)",
                    },
                    axis: {
                        ticks: {
                            text: {
                                fill: "var(--text-main)",
                            },
                        },
                        legend: {
                            text: {
                                fill: "var(--text-main)",
                            },
                        },
                    },
                }}
                tooltip={({ data }) => (
                    <div className="bg-slate-800 text-slate-200 px-3 py-2 rounded-md shadow-lg">
                        <strong>Vehicle {data.vehicleId}</strong>
                        <br />
                        Agency: {data.agency}
                        <br />
                        {data.rides} {data.rides === 1 ? 'ride' : 'rides'}
                    </div>
                )}
            />
        </div>
    );
} 