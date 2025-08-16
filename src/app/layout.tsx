import "./globals.css";

import AntdProvider from "@/lib/antd/AntdProvider";
import { AntdStyleRegistry } from "@/lib/antd/antd-style-registry";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdStyleRegistry>
          <AntdProvider>{children}</AntdProvider>
        </AntdStyleRegistry>
      </body>
    </html>
  );
}
