import { NextRequest, NextResponse } from "next/server";
import { ProposalController } from "../../ProposalController";

const proposalController = new ProposalController();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { shippingAddress, shippingMethod } = body;

    console.log('🔍 Finalize Shipping - ID da proposta:', id);
    console.log('🔍 Finalize Shipping - Body recebido:', body);
    console.log('🔍 Finalize Shipping - ShippingAddress:', shippingAddress);
    console.log('🔍 Finalize Shipping - ShippingMethod:', shippingMethod);

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "ID da proposta é obrigatório" },
        { status: 400 }
      );
    }

    if (!shippingAddress || !shippingMethod) {
      return NextResponse.json(
        { error: "Endereço de envio e método são obrigatórios" },
        { status: 400 }
      );
    }

    // Chamar o método para finalizar detalhes de envio
    const result = await proposalController.finalizeShippingDetails(id, {
      shippingAddress,
      shippingMethod,
    });

    return NextResponse.json({
      message: "Detalhes de envio finalizados com sucesso",
      proposta: result,
    });

  } catch (error: any) {
    console.error("Erro no controller ao finalizar envio:", error);
    return NextResponse.json(
      { error: error.message || "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
