import MainCards from "@/components/MainCards";
import TopSection from "@/components/TopSection";
import NoDataMessage from "@/components/NoDataMessage";

// TODO: Replace this with actual data check
const hasOrcaData = false;

export default function Home() {
	return (
		<div className="flex flex-col">
			<TopSection />
			{hasOrcaData ? <MainCards /> : <NoDataMessage />}
		</div>
	);
}
