"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";
import { useHydratedOrcaStore } from "@/lib/store/orcaStore";

export default function UploadButton() {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const uploadFiles = useHydratedOrcaStore(state => state.uploadFiles);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		if (files.length > 0) {
			await uploadFiles(files);
		}
	};

	return (
		<>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				className="hidden"
				accept=".csv,.txt"
			/>
			<button
				type="button"
				onClick={handleClick}
				className="button bg-primary text-black"
			>
				<Upload /> Upload New Data
			</button>
		</>
	);
}
