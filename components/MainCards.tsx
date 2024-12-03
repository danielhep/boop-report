import Card from "./Card";
import RidesChart from "./RidesChart";

export default function MainCards() {
	return (
		<div className="grid grid-cols-3 gap-4 mx-8">
			<Card className="col-span-2">
				<h2 className="text-lg font-semibold mb-4">Rides per Month</h2>
				<RidesChart />
			</Card>
            <Card>Another card</Card>
		</div>
	);
}
