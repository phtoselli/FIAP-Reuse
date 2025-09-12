"use client";

import "./globals.css";
import "@ant-design/v5-patch-for-react-19";

import AntdProvider from "@/lib/antd/AntdProvider";
import { AntdStyleRegistry } from "@/lib/antd/antd-style-registry";
import TradeRequestModal from "@/components/TradeRequestModal";
import {
  URLControlledModalKeys,
  useURLControlledModal,
} from "@/hooks/useURLControlledModal";
import CreatePostModal from "@/components/CreatePostModal";
import TradeDetailsModal from "@/components/TradeDetailsModal";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isOpen: isOpenCreatePostModal } = useURLControlledModal(
    URLControlledModalKeys.CREATE_POST_MODAL
  );
  const { isOpen: isTradeRequestModalOpen } = useURLControlledModal(
    URLControlledModalKeys.TRADE_REQUEST_MODAL
  );
  const { isOpen: isTradeDetailsModalOpen } = useURLControlledModal(
    URLControlledModalKeys.TRADE_DETAILS_MODAL
  );

  return (
    <html lang="en">
      <body>
        <AntdStyleRegistry>
          <AntdProvider>
            {/* GLOBAL OPENED MODALS */}
            {isOpenCreatePostModal && <CreatePostModal />}
            {isTradeRequestModalOpen && <TradeRequestModal />}
            {isTradeDetailsModalOpen && <TradeDetailsModal />}
            {/* ==================== */}

            {children}
          </AntdProvider>
        </AntdStyleRegistry>
      </body>
    </html>
  );
}
