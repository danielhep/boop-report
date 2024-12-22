"use client"
import IntroText from "./IntroText";
import OrcaReader from "./OrcaReader";
import TrashButton from "./TrashButton";
import UploadButton from "./UploadButton";

export default function TopSection() {
	return (
		<div className="grid grid-cols-1 md:grid-cols-4 mx-8 gap-4">
			<div className="md:col-span-3 flex flex-col gap-4 justify-center">
				<h2 className="text-2xl md:text-4xl font-bold text-primary font-nunito drop-shadow">
					Boop! This is your ORCA Boop Report!
				</h2>
				<p className="text-text-main max-w-2xl text-lg md:text-xl font-bold">
					<IntroText />	
				</p>
				<div className="flex flex-wrap gap-4">
					<UploadButton />
					<button 
						type="button" 
						className="button bg-[rgba(0,207,234,0.25)] text-primary"
					>
						How To Find My Data?
					</button>
					<TrashButton />
				</div>
			</div>
			<OrcaReader/>
		</div>
	);
}
