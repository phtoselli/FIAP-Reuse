"use client";

import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import { Suspense } from "react";

import AntdProvider from "@/lib/antd/AntdProvider";
import { AntdStyleRegistry } from "@/lib/antd/antd-style-registry";
import TradeRequestModal from "@/components/TradeRequestModal";
import FloatingChatButton from "@/components/FloatingChatButton";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";

function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen: isTradeRequestModalOpen } = useURLControlledModal(
    URLControlledModalKeys.TRADE_REQUEST_MODAL
  );

  return (
    <>
      {/* GLOBAL OPENED MODALS */}
      {isTradeRequestModalOpen && <TradeRequestModal />}
      {/* ==================== */}

      {/* FLOATING CHAT BUTTON */}
      <FloatingChatButton 
        userId="d21d52e9-2969-428c-8aba-e5e236eca94f"
        onListAddresses={(userId) => {
          console.log('Addresses requested for user:', userId);
        }}
      />
      {/* ==================== */}

      {children}
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdStyleRegistry>
          <AntdProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <LayoutContent>{children}</LayoutContent>
            </Suspense>
          </AntdProvider>
        </AntdStyleRegistry>
      </body>
    </html>
  );
}
