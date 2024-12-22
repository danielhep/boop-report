"use client";
import { ResponsiveCalendar } from "@nivo/calendar";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { format, getYear, isWithinInterval, startOfYear, endOfYear } from "date-fns";
import { ArrowUp, ArrowDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function RidesCalendarCard() {
    return (
        <div className="h-full w-full relative">
            <RidesCalendar />
        </div>
    );
}

function RidesCalendar() {
    const ridesByDate = useOrcaStore(
        (state) => state.processedStats?.aggregateExtraData.ridesByDate
    );
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        // Initial check
        checkMobile();
        
        // Add event listener
        window.addEventListener('resize', checkMobile);
        
        // Cleanup
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Get available years from the data
    const years = ridesByDate ? [...new Set(ridesByDate.map(ride => getYear(ride.jsDate)))].sort() : [] ;
    const firstYear = years.length > 0 ? years[years.length - 1] : undefined;
    const [stateSelectedYear, setSelectedYear] = useState<number | undefined>(undefined); // Start with most recent year
    const selectedYear = stateSelectedYear ?? firstYear ?? 2024;

    if (!ridesByDate || ridesByDate.length === 0) return null;

    // Filter data for selected year
    const yearData = ridesByDate.filter(ride => 
        isWithinInterval(ride.jsDate, {
            start: startOfYear(new Date(selectedYear, 0, 1)),
            end: endOfYear(new Date(selectedYear, 0, 1))
        })
    );

    const calendarData = yearData.map(ride => ({
        day: format(ride.jsDate, "yyyy-MM-dd"),
        value: ride.value
    }));

    const handleYearChange = (direction: 'up' | 'down') => {
        const currentIndex = years.indexOf(selectedYear);
        if (direction === 'up' && currentIndex < years.length - 1) {
            setSelectedYear(years[currentIndex + 1]);
        } else if (direction === 'down' && currentIndex > 0) {
            setSelectedYear(years[currentIndex - 1]);
        }
    };

    return (
        <div className="h-[400px] md:h-full w-full relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-0 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 flex md:flex-col items-center gap-2 z-10">
                <button 
                    type="button"
                    onClick={() => handleYearChange('up')}
                    disabled={years.indexOf(selectedYear) === years.length - 1}
                    className="p-1 hover:text-blue-400 disabled:opacity-50 disabled:hover:text-inherit"
                >
                    <ArrowUp size={20} />
                </button>
                <span className="font-medium">{selectedYear}</span>
                <button 
                    type="button"
                    onClick={() => handleYearChange('down')}
                    disabled={years.indexOf(selectedYear) === 0}
                    className="p-1 hover:text-blue-400 disabled:opacity-50 disabled:hover:text-inherit"
                >
                    <ArrowDown size={20} />
                </button>
            </div>
            <div className="pt-12 md:pt-0 md:pl-16 h-full">
                <ResponsiveCalendar
                    data={calendarData}
                    from={new Date(selectedYear, 0, 1)}
                    to={new Date(selectedYear, 11, 31)}
                    emptyColor="var(--background-secondary)"
                    colors={["#0c4a6e", "#0369a1", "#0284c7", "#0ea5e9", "#38bdf8"]}
                    margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                    yearSpacing={40}
                    monthBorderColor="var(--primary)"
                    dayBorderWidth={2}
                    dayBorderColor="var(--background-secondary)"
                    direction={isMobile ? "vertical" : "horizontal"}
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
                    legends={[
                        {
                            anchor: "bottom",
                            direction: "row",
                            translateY: 36,
                            itemCount: 4,
                            itemWidth: 42,
                            itemHeight: 36,
                            itemsSpacing: 14,
                            itemDirection: "right-to-left",
                        }
                    ]}
                    tooltip={(data) => (
                        <div className="bg-slate-800 text-slate-200 px-3 py-2 rounded-md shadow-lg">
                            <strong>{format(new Date(data.day), "MMM d, yyyy")}</strong>
                            <br />
                            {data.value} {Number(data.value) === 1 ? "ride" : "rides"}
                        </div>
                    )}
                />
            </div>
        </div>
    );
} 