"use client";

import "./globals.css";
import "@ant-design/v5-patch-for-react-19";

import AntdProvider from "@/lib/antd/AntdProvider";
import { AntdStyleRegistry } from "@/lib/antd/antd-style-registry";
import TradeRequestModal from "@/components/TradeRequestModal";
import FloatingChatButton from "@/components/FloatingChatButton";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen: isTradeRequestModalOpen } = useURLControlledModal(
    URLControlledModalKeys.TRADE_REQUEST_MODAL
  );

  return (
    <html lang="en">
      <body>
        <AntdStyleRegistry>
          <AntdProvider>
            {/* GLOBAL OPENED MODALS */}
            {isTradeRequestModalOpen && <TradeRequestModal />}
            {/* ==================== */}

            {/* FLOATING CHAT BUTTON */}
            <FloatingChatButton 
              userId="d21d52e9-2969-428c-8aba-e5e236eca94f"
              onProductDetails={(productId) => {
                console.log('Product details requested:', productId);
                // Aqui você pode implementar navegação para a página do produto
              }}
              onListAddresses={(userId) => {
                console.log('Addresses requested for user:', userId);
                // Aqui você pode implementar abertura de modal com endereços
              }}
              onAcceptProposal={(proposalId, userId) => {
                console.log('Proposal accepted:', proposalId, 'by user:', userId);
                // Aqui você pode implementar atualização da lista de propostas
              }}
            />
            {/* ==================== */}

            {children}
          </AntdProvider>
        </AntdStyleRegistry>
      </body>
    </html>
  );
}
