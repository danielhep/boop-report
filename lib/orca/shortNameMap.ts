import { isBefore } from "date-fns";
import { AUG_2024_SERVICE_CHANGE_DATE } from "./consts";

export function lineToRouteShortName(
	time: Date,
	lineString?: string,
): string | undefined {
	//many of the below are based on guesswork, ORCA has a lot of weird cases
	switch (lineString) {
		//rail services
		case "First Hill Streetcar Streetcar: Pioneer Square - Capitol Hill":
			return "FH Streetcar";
		case "South Lake Union Streetcar Streetcar: Fairview/Aloha - Westlake/McGraw":
			return "SLU Streetcar";
		case "Seattle Monorail Seattle Monorail":
			return "Monorail";
		case "East Link":
			return "2-Line";
		//other
		case "One City Center":
			return "One City Center (Downtown Shuttle Service)";
		// trailhead direct
		case "Capitol Hill - Mt. Si":
			return "Mt. Si Trailhead";
		//ST routes
		case "Everett - Seattle":
			if (!isBefore(time, AUG_2024_SERVICE_CHANGE_DATE)) {
				return "510";
			}
			return "510/512";
		case "Everett - Lynnwood":
			return "512";
		case "Ash Way P&R - Seattle":
			return "511";
		case "Seaway Transit Center - Seattle":
		case "Seaway - Lynnwood":
			return "513";
		case "Woodinville - Seattle":
			return "522";
		case "Everett - Bellevue":
			return "532";
		case "Lynnwood - Bellevue":
			return "535";
		case "Redmond - University District":
			return "542";
		case "Redmond - Seattle":
			return "545";
		case "Bellevue - Seattle":
			return "550";
		case "Issaquah - Seattle":
			return "554";
		case "Issaquah-University District":
			return "556";
		case "Bellevue - Sea-Tac - W. Seattle":
			return "560";
		case "Auburn - Redmond": //566 taken over by KCM March 22 under this name, unclear which may be in ORCA
		case "Auburn - Overlake":
			return "566";
		case "Lakewood - SeaTac":
			return "574";
		case "Federal Way - Seattle":
			return "577";
		case "Puyallup - Seattle":
			return "578";
		case "Lakewood - Puyallup": //for some reason, all three of these have been picked up by Pantograph
		case "Lakewood / Puyallup":
		case "Lakewood to Puyallup":
			return "580";
		case "Tacoma - U. District":
			return "586";
		case "Tacoma - Seattle":
			return "590";
		case "Olympia/DuPont - Seattle":
			return "592";
		case "Lakewood - Seattle":
			return "594";
		case "Gig Harbor - Seattle":
			return "595";
		case "Bonney Lake - Sumner":
			return "596";
		case "KCM Bus":
			return "KCM Unknown";
		case "Default ST Bus":
			return "ST Bus Uknown";
		case "Northgate Station - Shoreline Link Stations":
			return "365";
		case "Lake City - Northgate - Greenwood":
			return "61";
		// Community Transit 900 routes
		case "Lynnwood City Center Station - Silver Firs":
			return "901";
		case "Mountlake Terrace Station - Edmonds Station":
			return "909";
		case "Lynnwood City Center Station - Mukilteo Ferry Terminal":
			return "117";
		case "Ash Way Park & Ride - Canyon Park Park & Ride/UW Bothell":
			return "121";
		case "Lynnwood City Center Station - Stanwood Downtown Park & Ride":
			return "905";
		case "Lynnwood City Center Station - Marysville":
			return "904";
		case "Lynnwood City Center Station - Lake Stevens Transit Center":
			return "903";
		case "Edmonds Station - Silver Firs":
			return "906";
		case "Lynnwood City Center Station - Everett Station":
			return "166";
	}
}
