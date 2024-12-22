"use client";
import { ResponsiveBar } from "@nivo/bar";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { CardHeader } from "../Card";
import { useState } from "react";
import { getAgencyAbbreviation } from "@/lib/utils/agencyAbbreviations";

export default function TopStopsChartCard() {
    const [limit, setLimit] = useState<number | null>(5);

    return (
        <>
            <CardHeader
                rightContent={
                    <select
                        className="bg-background-primary text-black text-sm rounded-md border border-border px-2 py-1"
                        value={limit?.toString() ?? "all"}
                        onChange={(e) => setLimit(e.target.value === "all" ? null : Number(e.target.value))}
                    >
                        <option value="all">All Stops</option>
                        <option value="5">Top 5</option>
                        <option value="10">Top 10</option>
                        <option value="25">Top 25</option>
                    </select>
                }
            >
                Most Used Stops
            </CardHeader>
            <TopStopsChart limit={limit} />
        </>
    );
}

function TopStopsChart({ limit }: { limit: number | null }) {
    const stopOccurrences = useOrcaStore(
        (state) => state.processedStats?.aggregateExtraData.stopOccurrences
    );

    if (!stopOccurrences || stopOccurrences.length === 0) return null;

    // Sort by count and limit if specified
    const chartData = stopOccurrences
        .sort((a, b) => b.count - a.count)
        .slice(0, limit ?? undefined)
        .map(stop => ({
            stopName: stop.stop,
            agency: stop.agencyName,
            visits: stop.count,
            label: `${stop.stop} (${getAgencyAbbreviation(stop.agencyName)})`
        }));

    return (
        <div className="h-[300px] w-full">
            <ResponsiveBar
                data={chartData}
                keys={['visits']}
                indexBy="label"
                margin={{ top: 10, right: 20, bottom: 70, left: 30 }}
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
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of Visits',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    format: d => Math.floor(d).toString(),
                    tickValues: 5,
                }}
                enableGridY={true}
                gridYValues={Array.from({ length: 6 }, (_, i) => i * Math.ceil(Math.max(...chartData.map(d => d.visits)) / 5))}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor={{
                    from: 'color',
                    modifiers: [['darker', 1.6]]
                }}
                role="application"
                ariaLabel="Stop usage frequency"
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
                        <strong>{data.stopName}</strong>
                        <br />
                        Agency: {data.agency}
                        <br />
                        {data.visits} {data.visits === 1 ? 'visit' : 'visits'}
                    </div>
                )}
            />
        </div>
    );
} 