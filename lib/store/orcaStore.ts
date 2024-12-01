import { create, useStore } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { generateOrcaStats, parseOrcaFiles } from "@/orca_lib/processingUtils";
import type { OrcaStats, UnprocessedOrcaCard } from "@/orca_lib/types";
import { devtools } from "zustand/middleware";

interface OrcaStore {
	rawData: UnprocessedOrcaCard[] | null;
	processedStats: OrcaStats | null;
	setRawData: (data: UnprocessedOrcaCard[]) => void;
	processData: () => void;
	uploadFiles: (files: File[]) => Promise<void>;
}

const useOrcaStore = create<OrcaStore>()(
	devtools(
		persist(
			(set, get) => ({
				rawData: null,
				processedStats: null,

				setRawData: (data) => {
					set({ rawData: data });
					get().processData();
				},

				processData: () => {
					const rawData = get().rawData;
					if (!rawData) return;

					const stats = generateOrcaStats(rawData);
					set({ processedStats: stats });
				},

				uploadFiles: async (files) => {
					const rawData = await parseOrcaFiles(files);
					get().setRawData(rawData);
				},
			}),
			{
				name: "orca-storage",
				storage: createJSONStorage(() => localStorage),
				partialize: (state) => ({ rawData: state.rawData }),
				onRehydrateStorage: (state) => {
					return (state) => {
						if (state?.rawData) {
							state.processData();
						}
					};
				},
			},
		),
	),
);

export const useHydratedOrcaStore = <T>(
	selector: (state: OrcaStore) => T,
): T => {
	return useStore(useOrcaStore, selector);
};

export default useOrcaStore;
