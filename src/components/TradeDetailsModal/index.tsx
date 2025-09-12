"use client";

import { Modal, Tabs } from "antd";
import {
  useURLControlledModal,
  URLControlledModalKeys,
} from "@/hooks/useURLControlledModal";
import TradeInfo from "./tabs/TradeInfo";
import TradeChat from "./tabs/TradeChat";

export default function TradeDetailsModal() {
  const {
    isOpen,
    close,
    paramValue: tradeId,
  } = useURLControlledModal(URLControlledModalKeys.TRADE_DETAILS_MODAL);

  if (!tradeId) {
    close();
    return null;
  }

  return (
    <Modal
      centered
      destroyOnHidden
      open={isOpen}
      onCancel={close}
      footer={null}
      title="Detalhes da proposta"
      styles={{ body: { marginTop: "16px" } }}
      width={800}
    >
      <Tabs
        tabPosition="left"
        defaultActiveKey="details"
        items={[
          {
            key: "details",
            label: "Detalhes",
            children: <TradeInfo tradeId={tradeId} />,
          },
          {
            key: "chat",
            label: "Chat",
            children: <TradeChat tradeId={tradeId} />,
          },
        ]}
      />
    </Modal>
  );
}
