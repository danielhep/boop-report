"use client";

import { useOrcaStore } from "@/lib/store/orcaStoreProvider";
import { useState } from "react";

export default function DragDropZone({ children }: { children: React.ReactNode }) {
	const uploadFiles = useOrcaStore((state) => state.uploadFiles);
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		if (!isDragging) setIsDragging(true);
	};

	const handleDragLeave = (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = async (e: React.DragEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

		const files = Array.from(e.dataTransfer.files).filter(
			(file) => file.name.endsWith(".csv") || file.name.endsWith(".txt"),
		);

		if (files.length > 0) {
			await uploadFiles(files);
		}
	};

	return (
		<div
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			className="min-h-screen flex flex-col relative"
		>
			{isDragging && (
				<div className="absolute inset-0 bg-primary/10 border-2 border-dashed border-primary rounded-lg z-50 pointer-events-none flex items-center justify-center">
					<div className="bg-background-secondary p-6 rounded-lg shadow-lg text-center">
						<h3 className="text-xl font-bold text-primary mb-2">Drop your ORCA CSV files here</h3>
						<p className="text-text-main">Release to upload your files</p>
					</div>
				</div>
			)}
			{children}
		</div>
	);
} 