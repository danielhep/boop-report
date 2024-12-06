import Card from "./Card";
import RidesCalendar from "./RidesCalendar";
import RidesChart from "./RidesChart";
import TopRoutesChart from "./TopRoutesChart";

export default function MainCards() {
	return (
		<div className="grid grid-cols-3 gap-4 mx-8">
			<Card className="col-span-3">
				<h2 className="text-lg font-semibold mb-4">Rides per Month</h2>
				<RidesChart />
			</Card>
			<Card className="col-span-2">
				<h2 className="text-lg font-semibold mb-4">Ride Calendar</h2>
				<RidesCalendar />
			</Card>
            <Card><TopRoutesChart /></Card>
		</div>
	);
}
