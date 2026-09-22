import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
export const metadata = {
    title: "MPLABS Drishti | AI Multi-Source Surveillance & Risk Intelligence",
    description: "National Multi-Source Surveillance, Predictive Risk & Evidence Integrity System for MPLADS Works (MoSPI DIID • SIH26102)",
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{
            __html: `
              try {
                var savedTheme = localStorage.getItem('mplads_theme');
                if (!savedTheme) {
                  localStorage.setItem('mplads_theme', 'light');
                }
                document.documentElement.classList.remove('dark');
                if (savedTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (_) {}
            `,
        }}/>
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>);
}
