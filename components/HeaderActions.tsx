"use client";
import { Award } from "lucide-react";
import { useState } from "react";
import BadgeDialog from "./badges/BadgeDialog";

export default function HeaderActions() {
    const [isBadgeDialogOpen, setIsBadgeDialogOpen] = useState(false);

    return (
        <div className="flex flex-wrap gap-4 justify-center md:justify-end">
            {/* <button 
                type="button" 
                className="button bg-emphasis text-black w-full md:w-auto"
                onClick={() => setIsBadgeDialogOpen(true)}
            >
                <Award /> Badges
            </button> */}
            <BadgeDialog 
                isOpen={isBadgeDialogOpen} 
                onClose={() => setIsBadgeDialogOpen(false)} 
            />
        </div>
    );
} 