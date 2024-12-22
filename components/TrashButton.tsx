"use client"
import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { Trash2 } from "lucide-react";

export default function TrashButton() {
	const clearData = useOrcaStore(state => state.clearData);
	const rawData = useOrcaStore(state => state.rawData);
	return (
		<>
			{rawData && (
				<button
					type="button"
					onClick={clearData}
					className="button bg-red-100 text-red-600 hover:bg-red-200"
				>
					<Trash2 size={20} /> Clear Data
				</button>
			)}
		</>
	);
}
