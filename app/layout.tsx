import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import BoopReport from "@/components/BoopReport";
import { Award, CalendarCheck } from "lucide-react";
import { OrcaStoreProvider } from "@/lib/store/orcaStoreProvider";
import Footer from "@/components/Footer";
import DragDropZone from "@/components/DragDropZone";

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
				className={`${NunitoSans.variable} ${OpenSans.variable} antialiased text-text-main font-nunito bg-gradient-to-b from-body-background to-body-background-secondary`}
			>
				<OrcaStoreProvider>
					<DragDropZone>
						<div className="bg-emphasis/10 py-2 bg-black">
							<p className="text-center text-sm text-text-muted">
								This is an unofficial tool and is not affiliated with ORCA, Sound Transit, King County Metro,
								or any other transit agency.
							</p>
						</div>
						<header className="flex flex-col md:flex-row my-6 mx-8 gap-4 md:gap-0 md:justify-between">
							<BoopReport />
							<div className="flex flex-wrap gap-4 justify-center md:justify-end">
								<button type="button" className="button bg-primary text-black w-full md:w-auto">
									<CalendarCheck /> View Yearly ORCA Wrapped
								</button>
								<button type="button" className="button bg-emphasis text-black w-full md:w-auto">
									<Award /> Badges
								</button>
							</div>
						</header>
						{children}
						<Footer />
					</DragDropZone>
				</OrcaStoreProvider>
			</body>
		</html>
	);
}
