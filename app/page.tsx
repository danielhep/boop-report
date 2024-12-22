"use client";
import MainCards from "@/components/MainCards";
import TopSection from "@/components/TopSection";
import NoDataMessage from "@/components/NoDataMessage";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";

// TODO: Replace this with actual data check

export default function Home() {
	const rawData = useOrcaStore((state) => state.rawData);
  const hasOrcaData = rawData && rawData?.length > 0;
	return (
		<div className="flex flex-col">
			<TopSection />
			{hasOrcaData ? <MainCards /> : <NoDataMessage />}
		</div>
	);
}
