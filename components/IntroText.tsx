import { useOrcaStore } from "@/lib/store/orcaStoreProvider";

export default function IntroText() {
	const rawData = useOrcaStore(state => state.rawData);
	const lastUploadDate = useOrcaStore(state => state.lastUploadDate);
	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	};
	return (
		<>
			{rawData ? (
				<>
					Currently analyzing {rawData.length} ORCA{" "}
					{rawData.length === 1 ? "card" : "cards"}
					{lastUploadDate && ` last uploaded on ${formatDate(lastUploadDate)}`}.
				</>
			) : (
				"Upload your ORCA card data to see your transit usage statistics!"
			)}
		</>
	);
}
