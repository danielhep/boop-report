"use client"
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { Trash2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function TrashButton() {
	const clearData = useOrcaStore(state => state.clearData);
	const rawData = useOrcaStore(state => state.rawData);

	const handleClearData = () => {
		trackEvent('clear_data');
		clearData();
	};

	return (
		<>
			{rawData && (
				<button
					type="button"
					onClick={handleClearData}
					className="button bg-red-100 text-red-600 hover:bg-red-200"
				>
					<Trash2 size={20} /> Clear Data
				</button>
			)}
		</>
	);
}
