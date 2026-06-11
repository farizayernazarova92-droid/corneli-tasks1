import "./globals.css";

export const metadata = {
  title: "Corneli — Задачи",
  description: "Утренний брифинг Corneli",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
