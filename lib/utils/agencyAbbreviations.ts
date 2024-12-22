// Function to convert agency names to abbreviations
export function getAgencyAbbreviation(agencyName: string): string {
    const abbreviations: Record<string, string> = {
        'King County Metro': 'KCM',
        'Sound Transit': 'ST',
        'Pierce Transit': 'PT',
        'Community Transit': 'CT',
        'Kitsap Transit': 'KT',
        'Washington State Ferries': 'WSF',
        'Seattle Streetcar': 'SSC',
        'Seattle Center Monorail': 'SCM',
        'Everett Transit': 'ET'
    };

    return abbreviations[agencyName] || agencyName;
} 