"use client";
import { ResponsiveBar } from "@nivo/bar";
import { AxisTickProps } from "@nivo/axes";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { CardHeader } from "../Card";
import { useState, useRef, useEffect } from "react";
import AgencyIcon from '../AgencyIcon';

export default function TopVehiclesChartCard() {
    const [limit, setLimit] = useState<number | null>(5);

    return (
        <>
            <CardHeader
                rightContent={
                    <select
                        className="bg-background-primary text-black text-sm rounded-md border border-border px-2 py-1"
                        value={limit?.toString() ?? "5"}
                        onChange={(e) => setLimit(e.target.value === "5" ? null : Number(e.target.value))}
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
                    legendPosition: 'middle',
                    legendOffset: 45,
                    renderTick: CustomTick
                }}
                axisLeft={{
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Number of Rides',
                    legendPosition: 'middle',
                    legendOffset: -40,
                    format: d => Math.floor(d).toString(),
                    tickValues: 5,
                }}
                enableGridY={true}
                gridYValues={Array.from({ length: 6 }, (_, i) => i * Math.ceil(Math.max(...chartData.map(d => d.rides)) / 5))}
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

const CustomTick = ({ value, x, y }: AxisTickProps<string>) => {
    const textRef = useRef<SVGTextElement>(null);
    const [textWidth, setTextWidth] = useState(0);
    const vehicleId = value.split(" (")[0];
    const agencyName = value.match(/\((.*?)\)/)?.[1] ?? '';
    
    useEffect(() => {
        if (textRef.current) {
            setTextWidth(textRef.current.getBBox().width);
        }
    }, [value]);
    
    return (
        <g transform={`translate(${x}, ${y})`}>
            <g transform="translate(0, 10) rotate(45)">
                <text
                    ref={textRef}
                    style={{ fill: 'var(--text-main)' }}
                    dominantBaseline="middle"
                >
                    {vehicleId}
                </text>
                <foreignObject
                    x={textWidth + 5}
                    y="-10"
                    width="20"
                    height="20"
                >
                    <AgencyIcon agencyName={agencyName} />
                </foreignObject>
            </g>
        </g>
    );
}; 