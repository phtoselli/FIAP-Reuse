"use client";

import "./globals.css";
import "@ant-design/v5-patch-for-react-19";
import { Suspense } from "react";
import { usePathname } from "next/navigation";

import AntdProvider from "@/lib/antd/AntdProvider";
import { AntdStyleRegistry } from "@/lib/antd/antd-style-registry";
import TradeRequestModal from "@/components/TradeRequestModal";
import FloatingChatButton from "@/components/FloatingChatButton";
import Footer from "@/components/Footer";
import TopHeader from "@/components/TopHeader";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";

function LayoutContent({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const { isOpen: isTradeRequestModalOpen } = useURLControlledModal(
    URLControlledModalKeys.TRADE_REQUEST_MODAL
  );

  // Páginas que não devem ter TopHeader e Footer
  const isLoginPage = pathname === '/login' || pathname === '/register';
  const isRootPage = pathname === '/';

  // Se for página de login, register ou root, renderiza sem TopHeader e Footer
  if (isLoginPage || isRootPage) {
    return (
      <div style={{ minHeight: "100vh" }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* TOP HEADER */}
      <TopHeader />
      {/* ==================== */}

      {/* GLOBAL OPENED MODALS */}
      {isTradeRequestModalOpen && <TradeRequestModal />}
      {/* ==================== */}

      {/* FLOATING CHAT BUTTON */}
      <FloatingChatButton 
        userId="6fd9c6b8-8ecd-482b-b321-a7ae05e44dc9"
        onListAddresses={(userId) => {
          console.log('Addresses requested for user:', userId);
        }}
      />
      {/* ==================== */}

      <div style={{ flex: 1 }}>
        {children}
      </div>
      
      {/* FOOTER */}
      <Footer />
      {/* ==================== */}
    </div>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
         return (
           <html lang="en">
             <body style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
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
