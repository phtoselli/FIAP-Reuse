import { AddressRepository } from '@/database/repositories/address.repository';
import { AddressModel, AddressCreateModel, AddressUpdateModel, AddressResponseModel } from '@/types/address/AddressModel';

export class AddressService {
  private addressRepository: AddressRepository;

  constructor() {
    this.addressRepository = new AddressRepository();
  }

  /**
   * Cria um novo endereço
   * @param addressData - Dados do endereço a ser criado
   * @returns Endereço criado
   */
  async createAddress(addressData: AddressCreateModel): Promise<AddressResponseModel> {
    try {
      // Validar dados obrigatórios
      if (!addressData.street || !addressData.city || !addressData.state || !addressData.zipCode || !addressData.country) {
        throw new Error('Todos os campos de endereço são obrigatórios');
      }

      // Criar o endereço
      const address = await this.addressRepository.create(addressData);

      // Buscar o endereço criado com relacionamentos
      const createdAddress = await this.addressRepository.findById(address.id);
      
      if (!createdAddress) {
        throw new Error('Erro ao criar endereço');
      }

      return this.mapAddressToResponseModel(createdAddress);

    } catch (error) {
      console.error('Erro ao criar endereço:', error);
      throw new Error('Erro interno ao criar endereço');
    }
  }

  /**
   * Busca um endereço por ID
   * @param id - ID único do endereço
   * @returns Endereço encontrado ou null se não existir
   */
  async getAddressById(id: string): Promise<AddressResponseModel | null> {
    try {
      const address = await this.addressRepository.findById(id);
      
      if (!address) {
        return null;
      }

      return this.mapAddressToResponseModel(address);
    } catch (error) {
      console.error('Erro ao buscar endereço por ID:', error);
      throw new Error('Erro interno ao buscar endereço');
    }
  }

  /**
   * Lista todos os endereços
   * @returns Lista de todos os endereços
   */
  async getAllAddresses(): Promise<AddressResponseModel[]> {
    try {
      const addresses = await this.addressRepository.findAll();
      return addresses.map(address => this.mapAddressToResponseModel(address));
    } catch (error) {
      console.error('Erro ao listar endereços:', error);
      throw new Error('Erro interno ao listar endereços');
    }
  }

  /**
   * Lista endereços por usuário
   * @param userId - ID do usuário
   * @returns Lista de endereços do usuário
   */
  async getAddressesByUserId(userId: string): Promise<AddressResponseModel[]> {
    try {
      const addresses = await this.addressRepository.findByUserId(userId);
      return addresses.map(address => this.mapAddressToResponseModel(address));
    } catch (error) {
      console.error('Erro ao listar endereços do usuário:', error);
      throw new Error('Erro interno ao listar endereços do usuário');
    }
  }

  /**
   * Lista endereços por cidade
   * @param city - Nome da cidade
   * @returns Lista de endereços da cidade
   */
  async getAddressesByCity(city: string): Promise<AddressResponseModel[]> {
    try {
      const addresses = await this.addressRepository.findByCity(city);
      return addresses.map(address => this.mapAddressToResponseModel(address));
    } catch (error) {
      console.error('Erro ao listar endereços por cidade:', error);
      throw new Error('Erro interno ao listar endereços por cidade');
    }
  }

  /**
   * Lista endereços por estado
   * @param state - Nome do estado
   * @returns Lista de endereços do estado
   */
  async getAddressesByState(state: string): Promise<AddressResponseModel[]> {
    try {
      const addresses = await this.addressRepository.findByState(state);
      return addresses.map(address => this.mapAddressToResponseModel(address));
    } catch (error) {
      console.error('Erro ao listar endereços por estado:', error);
      throw new Error('Erro interno ao listar endereços por estado');
    }
  }

  /**
   * Lista endereços por país
   * @param country - Nome do país
   * @returns Lista de endereços do país
   */
  async getAddressesByCountry(country: string): Promise<AddressResponseModel[]> {
    try {
      const addresses = await this.addressRepository.findByCountry(country);
      return addresses.map(address => this.mapAddressToResponseModel(address));
    } catch (error) {
      console.error('Erro ao listar endereços por país:', error);
      throw new Error('Erro interno ao listar endereços por país');
    }
  }

  /**
   * Lista endereços com filtros avançados
   * @param filters - Filtros aplicados
   * @returns Lista de endereços filtrados com informações de paginação
   */
  async getAddressesWithFilters(filters: {
    userId?: string;
    city?: string;
    state?: string;
    country?: string;
    limit?: number;
    offset?: number;
  }): Promise<{
    enderecos: AddressResponseModel[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  }> {
    try {
      const { limit, offset, ...countFilters } = filters;
      
      // Buscar endereços com filtros
      const addresses = await this.addressRepository.findWithFilters(filters);
      
      // Contar total de endereços que atendem aos filtros
      const total = await this.addressRepository.countWithFilters(countFilters);
      
      // Calcular se há mais endereços
      const currentLimit = limit || addresses.length;
      const currentOffset = offset || 0;
      const hasMore = currentOffset + currentLimit < total;
      
      return {
        enderecos: addresses.map(address => this.mapAddressToResponseModel(address)),
        total,
        limit: currentLimit,
        offset: currentOffset,
        hasMore,
      };
    } catch (error) {
      console.error('Erro ao listar endereços com filtros:', error);
      throw new Error('Erro interno ao listar endereços com filtros');
    }
  }

  /**
   * Atualiza um endereço
   * @param id - ID do endereço
   * @param addressData - Dados a serem atualizados
   * @param userId - ID do usuário que está atualizando (deve ser o dono do endereço)
   * @returns Endereço atualizado
   */
  async updateAddress(id: string, addressData: AddressUpdateModel, userId: string): Promise<AddressResponseModel> {
    try {
      // Verificar se o endereço existe
      const existingAddress = await this.addressRepository.findById(id);
      if (!existingAddress) {
        throw new Error('Endereço não encontrado');
      }

      // Verificar se o usuário é o dono do endereço
      if (existingAddress.userId !== userId) {
        throw new Error('Apenas o dono do endereço pode editá-lo');
      }

      // Atualizar o endereço
      await this.addressRepository.update(id, addressData);

      // Buscar o endereço atualizado
      const updatedAddress = await this.addressRepository.findById(id);
      
      if (!updatedAddress) {
        throw new Error('Erro ao atualizar endereço');
      }

      return this.mapAddressToResponseModel(updatedAddress);

    } catch (error) {
      console.error('Erro ao atualizar endereço:', error);
      throw new Error('Erro interno ao atualizar endereço');
    }
  }

  /**
   * Deleta um endereço
   * @param id - ID do endereço
   * @param userId - ID do usuário que está deletando (deve ser o dono do endereço)
   * @returns true se deletado com sucesso
   */
  async deleteAddress(id: string, userId: string): Promise<boolean> {
    try {
      // Verificar se o endereço existe
      const existingAddress = await this.addressRepository.findById(id);
      if (!existingAddress) {
        throw new Error('Endereço não encontrado');
      }

      // Verificar se o usuário é o dono do endereço
      if (existingAddress.userId !== userId) {
        throw new Error('Apenas o dono do endereço pode deletá-lo');
      }

      // Deletar o endereço
      await this.addressRepository.delete(id);
      return true;

    } catch (error) {
      console.error('Erro ao deletar endereço:', error);
      throw new Error('Erro interno ao deletar endereço');
    }
  }

  /**
   * Conta endereços por usuário
   * @param userId - ID do usuário
   * @returns Total de endereços do usuário
   */
  async countAddressesByUserId(userId: string): Promise<number> {
    try {
      return await this.addressRepository.countByUserId(userId);
    } catch (error) {
      console.error('Erro ao contar endereços do usuário:', error);
      throw new Error('Erro interno ao contar endereços do usuário');
    }
  }

  /**
   * Conta endereços por cidade
   * @param city - Nome da cidade
   * @returns Total de endereços na cidade
   */
  async countAddressesByCity(city: string): Promise<number> {
    try {
      return await this.addressRepository.countByCity(city);
    } catch (error) {
      console.error('Erro ao contar endereços por cidade:', error);
      throw new Error('Erro interno ao contar endereços por cidade');
    }
  }

  /**
   * Conta endereços por estado
   * @param state - Nome do estado
   * @returns Total de endereços no estado
   */
  async countAddressesByState(state: string): Promise<number> {
    try {
      return await this.addressRepository.countByState(state);
    } catch (error) {
      console.error('Erro ao contar endereços por estado:', error);
      throw new Error('Erro interno ao contar endereços por estado');
    }
  }

  /**
   * Mapeia um Address do Prisma para AddressResponseModel
   * @param address - Address do Prisma
   * @returns AddressResponseModel mapeado
   */
  private mapAddressToResponseModel(address: any): AddressResponseModel {
    return {
      id: address.id,
      street: address.street,
      number: address.number || '',
      complement: address.complement,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      createdAt: address.createdAt,
      userId: address.userId,
      user: {
        id: address.user.id,
        name: address.user.name,
        email: address.user.email,
        city: address.user.city,
        state: address.user.state,
        avatarUrl: address.user.avatarUrl,
      },
      fullAddress: `${address.street}, ${address.number || ''}${address.complement ? ', ' + address.complement : ''} - ${address.city}, ${address.state} - ${address.zipCode}`,
    };
  }
}
