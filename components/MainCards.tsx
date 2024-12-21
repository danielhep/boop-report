import Card, { CardHeader } from "./Card";
import RidesCalendar from "./cards/RidesCalendar";
import RidesChart from "./cards/RidesChart";
import TopAgenciesChart from "./cards/TopAgenciesChart";
import TopRoutesChart from "./cards/TopRoutesChart";
import TopVehiclesChart from "./cards/TopVehiclesChart";

export default function MainCards() {
	return (
		<div className="grid grid-cols-3 gap-4 mx-8">
			<Card className="col-span-3">
				<CardHeader>Rides per Month</CardHeader>
				<RidesChart />
			</Card>
			<Card className="col-span-2 flex flex-col">
				<CardHeader>Ride Calendar</CardHeader>
				<RidesCalendar />
			</Card>
			<Card>
				<TopRoutesChart />
			</Card>
			<Card>
				<CardHeader>Top Agencies</CardHeader>
				<TopAgenciesChart />
			</Card>
			<Card>
				<CardHeader>Top Vehicles</CardHeader>
				<TopVehiclesChart />
			</Card>
		</div>
	);
}
