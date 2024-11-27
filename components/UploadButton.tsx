"use client";

import { Upload } from "lucide-react";
import { useRef } from "react";

export default function UploadButton() {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// TODO: Handle the file upload
			console.log("Selected file:", file);
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
