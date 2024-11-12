import MainCards from "@/components/MainCards";
import TopSection from "@/components/TopSection";

export default function Home() {
	return (
		<div className="flex flex-col">
			<TopSection />
      <MainCards />
    </div>
  );
}
