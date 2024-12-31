"use client";
import IntroText from "./IntroText";
import OrcaReader from "./OrcaReader";
import TrashButton from "./TrashButton";
import UploadButton from "./UploadButton";
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { useState } from "react";
import HowToFindDataModal from "./HowToFindDataModal";
import { trackEvent } from "@/lib/analytics";

export default function TopSection() {
	const filter2024 = useOrcaStore((state) => state.filter2024);
	const setFilter2024 = useOrcaStore((state) => state.setFilter2024);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const rawData = useOrcaStore((state) => state.rawData);

	const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.checked;
		trackEvent('toggle_2024_filter', { value: newValue });
		setFilter2024(newValue);
	};

	const handleOpenModal = () => {
		trackEvent('open_how_to_find_data_modal');
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		trackEvent('close_how_to_find_data_modal');
		setIsModalOpen(false);
	};

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
						onClick={handleOpenModal}
					>
						How To Find My Data?
					</button>
					<TrashButton />
				</div>
				{rawData && (
					<label className="flex items-center gap-2 text-text-main">
						<input
							type="checkbox"
							checked={filter2024}
							onChange={handleFilterChange}
							className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
						/>
						Show 2024 data only
					</label>
				)}
			</div>
			<OrcaReader />
			<HowToFindDataModal
				isOpen={isModalOpen}
				onClose={handleCloseModal}
			/>
		</div>
	);
}
