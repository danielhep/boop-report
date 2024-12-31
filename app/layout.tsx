import type { Metadata } from "next";
import { Nunito_Sans, Open_Sans } from "next/font/google";
import "./globals.css";
import BoopReport from "@/components/BoopReport";
import { OrcaStoreProvider } from "@/lib/store/orcaStoreProvider";
import Footer from "@/components/Footer";
import DragDropZone from "@/components/DragDropZone";
import HeaderActions from "@/components/HeaderActions";
import Script from "next/script";

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
			<Script defer src="https://umami.danielhep.me/script.js" data-website-id="352e1e00-b9ae-42c1-b4de-489978ee0ad3" />
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
							<HeaderActions />
						</header>
						{children}
						<Footer />
					</DragDropZone>
				</OrcaStoreProvider>
			</body>
		</html>
	);
}
