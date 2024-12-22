type AgencyIconProps = {
    agencyName: string;
    size?: number;
    className?: string;
};

const agencyToFileMap: Record<string, string> = {
    "King County Metro": "kcm",
    "Sound Transit": "st",
    "Pierce Transit": "pt",
    "Kitsap Transit": "kt",
    "Seattle Streetcar": "streetcar",
    "Seattle Monorail": "monorail",
    "Washington State Ferries": "ferries",
    "Everett Transit": "et",
};

export default function AgencyIcon({ agencyName, size = 20, className = "" }: AgencyIconProps) {
    const fileName = agencyToFileMap[agencyName];
    
    if (!fileName) {
        console.warn(`No icon found for agency: ${agencyName}`);
        return null;
    }

    return (
        <img 
            src={`/agencies/${fileName}.svg`}
            width={size}
            height={size}
            alt={`${agencyName} logo`}
            className={className}
        />
    );
} 