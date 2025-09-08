import { ProposalRepository } from "@/database/repositories/proposal.repository";
import {
  ProposalModel,
  ProposalCreateModel,
  ProposalUpdateModel,
  ProposalResponseModel,
} from "@/types/proposal/ProposalModel";

export class ProposalService {
  private proposalRepository: ProposalRepository;

  constructor() {
    this.proposalRepository = new ProposalRepository();
  }

  /**
   * Cria uma nova proposta
   * @param proposalData - Dados da proposta a ser criada
   * @param requesterId - ID do usuário que está criando a proposta
   * @returns Proposta criada
   */
  async createProposal(
    proposalData: ProposalCreateModel,
    requesterId: string
  ): Promise<ProposalResponseModel> {
    try {
      // Validar se há itens na proposta
      if (!proposalData.items || proposalData.items.length === 0) {
        throw new Error("A proposta deve conter pelo menos um item");
      }

      // Validar se a proposta tem apenas um item
      if (proposalData.items.length > 1) {
        throw new Error("A proposta pode conter apenas um item");
      }

      // Validar se os IDs são strings válidas
      if (
        typeof requesterId !== "string" ||
        typeof proposalData.responderId !== "string"
      ) {
        throw new Error("IDs de usuário devem ser strings válidas");
      }

      // Validar se o postId é uma string válida
      if (typeof proposalData.items[0].postId !== "string") {
        throw new Error("ID do post deve ser uma string válida");
      }

      // Criar a proposta
      const proposal = await this.proposalRepository.create({
        message: proposalData.message,
        requesterId: requesterId,
        responderId: proposalData.responderId,
        status: "pending",
      });

      // Criar os itens da proposta
      const proposalItems = proposalData.items.map((item) => ({
        proposalId: proposal.id,
        postId: item.postId,
      }));

      await this.proposalRepository.createItems(proposalItems);

      // Buscar a proposta criada com todos os relacionamentos
      const createdProposal = await this.proposalRepository.findById(
        proposal.id
      );

      if (!createdProposal) {
        throw new Error("Erro ao criar proposta");
      }

      return this.mapProposalToResponseModel(createdProposal);
    } catch (error) {
      console.error("Erro ao criar proposta:", error);
      throw new Error("Erro interno ao criar proposta");
    }
  }

  /**
   * Busca uma proposta por ID
   * @param id - ID único da proposta
   * @returns Proposta encontrada ou null se não existir
   */
  async getProposalById(id: string): Promise<ProposalResponseModel | null> {
    try {
      const proposal = await this.proposalRepository.findById(id);

      console.log(proposal);

      if (!proposal) {
        return null;
      }

      return this.mapProposalToResponseModel(proposal);
    } catch (error) {
      console.error("Erro ao buscar proposta por ID:", error);
      throw new Error("Erro interno ao buscar proposta");
    }
  }

  /**
   * Lista todas as propostas
   * @returns Lista de todas as propostas
   */
  async getAllProposals(): Promise<ProposalResponseModel[]> {
    try {
      const proposals = await this.proposalRepository.findAll();
      return proposals.map((proposal: any) =>
        this.mapProposalToResponseModel(proposal)
      );
    } catch (error) {
      console.error("Erro ao listar propostas:", error);
      throw new Error("Erro interno ao listar propostas");
    }
  }

  /**
   * Lista propostas por usuário
   * @param userId - ID do usuário
   * @param role - Papel do usuário (requester ou responder)
   * @returns Lista de propostas do usuário
   */
  async getProposalsByUserId(
    userId: string,
    role: "requester" | "responder" = "requester"
  ): Promise<ProposalResponseModel[]> {
    try {
      const proposals = await this.proposalRepository.findByUserId(
        userId,
        role
      );
      return proposals.map((proposal: any) =>
        this.mapProposalToResponseModel(proposal)
      );
    } catch (error) {
      console.error("Erro ao listar propostas do usuário:", error);
      throw new Error("Erro interno ao listar propostas do usuário");
    }
  }

  /**
   * Lista propostas por status
   * @param status - Status das propostas
   * @returns Lista de propostas com o status especificado
   */
  async getProposalsByStatus(status: string): Promise<ProposalResponseModel[]> {
    try {
      const proposals = await this.proposalRepository.findByStatus(status);
      return proposals.map((proposal: any) =>
        this.mapProposalToResponseModel(proposal)
      );
    } catch (error) {
      console.error("Erro ao listar propostas por status:", error);
      throw new Error("Erro interno ao listar propostas por status");
    }
  }

  /**
   * Aceita uma proposta
   * @param id - ID da proposta
   * @param responderId - ID do usuário que está aceitando (deve ser o responder)
   * @returns Proposta aceita
   */
  async acceptProposal(
    id: string,
    responderId: string
  ): Promise<ProposalResponseModel> {
    try {
      // Verificar se a proposta existe
      const existingProposal = await this.proposalRepository.findById(id);
      if (!existingProposal) {
        throw new Error("Proposta não encontrada");
      }

      // Verificar se o usuário é o responder da proposta
      if (existingProposal.responderId !== responderId) {
        throw new Error("Apenas o destinatário da proposta pode aceitá-la");
      }

      // Verificar se a proposta ainda está pendente
      if (existingProposal.status !== "pending") {
        throw new Error("Apenas propostas pendentes podem ser aceitas");
      }

      // Aceitar a proposta
      await this.proposalRepository.updateStatus(id, "accepted");

      // Buscar a proposta atualizada
      const updatedProposal = await this.proposalRepository.findById(id);

      if (!updatedProposal) {
        throw new Error("Erro ao atualizar proposta");
      }

      return this.mapProposalToResponseModel(updatedProposal);
    } catch (error) {
      console.error("Erro ao aceitar proposta:", error);
      throw new Error("Erro interno ao aceitar proposta");
    }
  }

  /**
   * Recusa uma proposta
   * @param id - ID da proposta
   * @param responderId - ID do usuário que está recusando (deve ser o responder)
   * @returns Proposta recusada
   */
  async rejectProposal(
    id: string,
    responderId: string
  ): Promise<ProposalResponseModel> {
    try {
      // Verificar se a proposta existe
      const existingProposal = await this.proposalRepository.findById(id);
      if (!existingProposal) {
        throw new Error("Proposta não encontrada");
      }

      // Verificar se o usuário é o responder da proposta
      if (existingProposal.responderId !== responderId) {
        throw new Error("Apenas o destinatário da proposta pode recusá-la");
      }

      // Verificar se a proposta ainda está pendente
      if (existingProposal.status !== "pending") {
        throw new Error("Apenas propostas pendentes podem ser recusadas");
      }

      // Recusar a proposta
      await this.proposalRepository.updateStatus(id, "rejected");

      // Buscar a proposta atualizada
      const updatedProposal = await this.proposalRepository.findById(id);

      if (!updatedProposal) {
        throw new Error("Erro ao atualizar proposta");
      }

      return this.mapProposalToResponseModel(updatedProposal);
    } catch (error) {
      console.error("Erro ao recusar proposta:", error);
      throw new Error("Erro interno ao recusar proposta");
    }
  }

  /**
   * Atualiza uma proposta
   * @param id - ID da proposta
   * @param proposalData - Dados a serem atualizados
   * @param requesterId - ID do usuário que está atualizando (deve ser o requester)
   * @returns Proposta atualizada
   */
  async updateProposal(
    id: string,
    proposalData: ProposalUpdateModel,
    requesterId: string
  ): Promise<ProposalResponseModel> {
    try {
      // Verificar se a proposta existe
      const existingProposal = await this.proposalRepository.findById(id);
      if (!existingProposal) {
        throw new Error("Proposta não encontrada");
      }

      // Verificar se o usuário é o requester da proposta
      if (existingProposal.requesterId !== requesterId) {
        throw new Error("Apenas o criador da proposta pode editá-la");
      }

      // Verificar se a proposta ainda está pendente
      if (existingProposal.status !== "pending") {
        throw new Error("Apenas propostas pendentes podem ser editadas");
      }

      // Atualizar a proposta
      await this.proposalRepository.update(id, proposalData);

      // Buscar a proposta atualizada
      const updatedProposal = await this.proposalRepository.findById(id);

      if (!updatedProposal) {
        throw new Error("Erro ao atualizar proposta");
      }

      return this.mapProposalToResponseModel(updatedProposal);
    } catch (error) {
      console.error("Erro ao atualizar proposta:", error);
      throw new Error("Erro interno ao atualizar proposta");
    }
  }

  /**
   * Deleta uma proposta
   * @param id - ID da proposta
   * @param requesterId - ID do usuário que está deletando (deve ser o requester)
   * @returns true se deletada com sucesso
   */
  async deleteProposal(id: string, requesterId: string): Promise<boolean> {
    try {
      // Verificar se a proposta existe
      const existingProposal = await this.proposalRepository.findById(id);
      if (!existingProposal) {
        throw new Error("Proposta não encontrada");
      }

      // Verificar se o usuário é o requester da proposta
      if (existingProposal.requesterId !== requesterId) {
        throw new Error("Apenas o criador da proposta pode deletá-la");
      }

      // Verificar se a proposta ainda está pendente
      if (existingProposal.status !== "pending") {
        throw new Error("Apenas propostas pendentes podem ser deletadas");
      }

      // Deletar a proposta
      await this.proposalRepository.delete(id);
      return true;
    } catch (error) {
      console.error("Erro ao deletar proposta:", error);
      throw new Error("Erro interno ao deletar proposta");
    }
  }

  /**
   * Mapeia uma Proposal do Prisma para ProposalResponseModel
   * @param proposal - Proposal do Prisma
   * @returns ProposalResponseModel mapeado
   */
  private mapProposalToResponseModel(proposal: any): ProposalResponseModel {
    return {
      id: proposal.id,
      message: proposal.message,
      status: proposal.status,
      createdAt: proposal.createdAt,
      updatedAt: proposal.updatedAt,
      requester: {
        id: proposal.requester.id,
        name: proposal.requester.name,
        city: proposal.requester.city,
        state: proposal.requester.state,
        avatarUrl: proposal.requester.avatarUrl,
      },
      responder: {
        id: proposal.responder.id,
        name: proposal.responder.name,
        city: proposal.responder.city,
        state: proposal.responder.state,
        avatarUrl: proposal.responder.avatarUrl,
      },
      items: proposal.items.map((item: any) => ({
        id: item.id,
        postId: item.postId,
        post: {
          id: item.post.id,
          title: item.post.title,
          description: item.post.description,
          imageUrl: item.post.imageUrl,
          rating: item.post.rating,
          isActive: item.post.isActive,
          category: {
            id: item.post.categoryRel?.id,
            name: item.post.categoryRel?.name,
            description: item.post.categoryRel?.description,
          },
          subcategory: {
            id: item.post.subcategoryId,
            name: item.post.subcategoryId,
            description: item.post.subcategoryId,
          },
          condition: item.post.condition
            ? {
                id: item.post.condition.id,
                code: item.post.condition.code,
                type: item.post.condition.type,
                description: item.post.condition.description,
              }
            : null,
        },
      })),
      totalItems: proposal.items.length,
    };
  }
}
