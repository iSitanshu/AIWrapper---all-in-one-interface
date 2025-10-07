// import "./globals.css";
import ReduxDebugger from "@/components/ReduxDebugger";
import { ReduxProvider } from "@/lib/provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <ReduxDebugger />
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
