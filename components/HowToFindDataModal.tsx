"use client";
import { X } from "lucide-react";
import Card from "./Card";
import UploadButton from "./UploadButton";

interface HowToFindDataModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function HowToFindDataModal({ isOpen, onClose }: HowToFindDataModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-background-primary rounded-full"
                >
                    <X className="text-text-main" />
                </button>
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <h2 className="text-2xl font-bold mb-4">How to Find Your ORCA Data</h2>
                    <ol className="list-decimal pl-6 space-y-4">
                        <li>Go to the <a href="https://myorca.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">myORCA website</a></li>
                        <li>Sign in to your account</li>
                        <li>Click on &quot;Card Activity&quot; in the navigation menu</li>
                        <li>Select the date range you want to download (up to 2 years of history)</li>
                        <li>Click the &quot;Download&quot; button to get your CSV file</li>
                    </ol>
                    <div className="mt-8 flex flex-col gap-4">
                        <p className="font-semibold">Ready to upload your data?</p>
                        <div className="flex gap-4">
                            <UploadButton />
                            <button
                                type="button"
                                onClick={onClose}
                                className="button bg-background-primary text-text-main"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
} 