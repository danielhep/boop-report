import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import BoopReport from "@/components/BoopReport";
import { Award, CalendarCheck } from "lucide-react";
import { OrcaStoreProvider } from "@/lib/store/orcaStoreProvider";

const NunitoSans = Nunito_Sans({
	subsets: ["latin"],
	variable: "--font-nunito-sans",
});

const OpenSans = Open_Sans({
	subsets: ["latin"],
	variable: "--font-open-sans",
});

export const metadata: Metadata = {
	title: "Boop Report",
	description: "ORCA Card Boop Report",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${NunitoSans.variable} ${OpenSans.variable} antialiased text-text-main font-nunito bg-gradient-to-b from-body-background to-body-background-secondary min-h-screen`}
			>
				<OrcaStoreProvider>
					<header className="flex my-6 mx-8 justify-between">
						<BoopReport />
						<div className="flex gap-4">
							<button type="button" className="button bg-primary text-black">
								<CalendarCheck /> View Yearly ORCA Wrapped
							</button>
							<button type="button" className="button bg-emphasis text-black">
								<Award /> Badges
							</button>
						</div>
					</header>
					{children}
				</OrcaStoreProvider>
			</body>
		</html>
	);
}
