import Card from "@/components/Card";
import TopSection from "@/components/TopSection";
import Image from "next/image";

export default function Home() {
	return (
		<div className="flex flex-col gap-4">
			<TopSection />
			<Card>Test
        Test
      </Card>
    </div>
  );
}
