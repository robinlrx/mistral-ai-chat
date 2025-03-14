import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RobIA",
  description: "Generated by create next app",
};

export const viewport: Viewport = {
	themeColor: '#F0EEE6',
}

export default function RootLayout({ children, }: 
	Readonly<{ children: React.ReactNode; }>) {
	return (
		<html lang="en">
		<body>
			{children}
		</body>
		</html>
	);
}
