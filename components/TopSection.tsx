import { Upload } from "lucide-react";

export default function TopSection() {
	return (
		<div className="grid grid-cols-4 mx-8">
			<div className="col-span-3 flex flex-col gap-4">
				<h2 className="text-2xl font-bold text-4xl text-primary font-nunito drop-shadow">
					Boop! This is your ORCA Boop Report!
				</h2>
				<p className="text-text-main max-w-2xl text-xl font-bold">
					Since the release of ORCA NextGen, passengers have made 1,242,245
					trips using Sound Transit. See how your data compares!
				</p>
				<div className="flex gap-4">
					<button type="button" className="button bg-primary text-black">
						<Upload /> Upload New Data
					</button>
					<button type="button" className="button bg-[rgba(0,207,234,0.25)] text-primary">
						How To Find My Data?
					</button>
				</div>
			</div>
			<div>orca reader</div>
		</div>
	);
}
