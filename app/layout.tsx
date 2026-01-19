// app/layout.tsx
import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'CAN Financial Solutions – FNA',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900">
        <div className="min-h-screen flex flex-col">
          <header className="border-b bg-white px-4 py-3 shadow-sm">
            <div className="mx-auto max-w-6xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img
                  src="/CAN Logo Small.jpeg"
                  alt="CAN Financial Solutions"
                  className="h-8 w-auto"
                />
                <span className="font-semibold tracking-wide">
                  CAN Financial Solutions
                </span>
              </div>
              <span className="text-sm text-slate-500">
                Financial Needs Analysis
              </span>
            </div>
          </header>
          <main className="flex-1 mx-auto w-full max-w-6xl px-4 py-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
