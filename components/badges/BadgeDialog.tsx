"use client";
import { X, Award } from "lucide-react";
import Card from "../Card";

interface BadgeDialogProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function BadgeDialog({ isOpen, onClose }: BadgeDialogProps) {
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
                    <h2 className="text-2xl font-bold mb-4">Your ORCA Badges</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {/* Example badges - these will be populated based on user data */}
                        <div className="flex flex-col items-center gap-2 p-4 bg-background-secondary rounded-lg hover:bg-background-primary transition-colors">
                            <Award className="w-12 h-12 text-primary" />
                            <span className="text-sm font-medium">Early Bird</span>
                        </div>
                        <div className="flex flex-col items-center gap-2 p-4 bg-background-secondary rounded-lg hover:bg-background-primary transition-colors">
                            <Award className="w-12 h-12 text-primary" />
                            <span className="text-sm font-medium">Night Owl</span>
                        </div>
                    </div>
                    <div className="mt-8">
                        <button
                            type="button"
                            onClick={onClose}
                            className="button bg-background-primary text-text-main"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
} 