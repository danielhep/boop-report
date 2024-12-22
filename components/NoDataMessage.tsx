import React from "react";
import UploadButton from "./UploadButton";
import Card from "./Card";

export default function NoDataMessage() {
	return (
		<div className="grid grid-cols-1 gap-4 mx-8">
			<Card>
				<div className="flex flex-col items-center gap-6 justify-center min-h-[20vh] p-8 text-center">
					<h2 className="text-3xl font-semibold text-primary">
						No ORCA Card Data Found
					</h2>
					<p className="text-xl">
						Upload your ORCA card data to see your personalized boop report and
						travel insights.
					</p>
					<UploadButton />
				</div>
			</Card>
		</div>
	);
}
