import { TradeStatus } from "@/types/status";

export default function getStatusColor(status: TradeStatus): string {
  switch (status) {
    case TradeStatus.PENDENTE:
      return "orange";
    case TradeStatus.ACEITA:
      return "green";
    case TradeStatus.RECUSADA:
      return "red";
    case TradeStatus.FINALIZADA:
      return "blue";
    default:
      return "default";
  }
}
