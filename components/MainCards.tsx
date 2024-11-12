import Card from "./Card";

export default function MainCards() {
	return (
		<div className="grid grid-cols-3 gap-4 mx-8">
			<Card className="col-span-2">Test</Card>
            <Card>Another card</Card>
		</div>
	);
}
