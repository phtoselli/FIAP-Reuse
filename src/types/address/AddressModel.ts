export interface AddressModel {
  id: string;
  street: string;
  number: string;
  complement?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    city: string | null;
    state: string | null;
    avatarUrl: string | null;
  };
}

export interface AddressCreateModel {
  street: string;
  number: string;
  complement?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  userId: string;
}

export interface AddressUpdateModel {
  street?: string;
  number?: string;
  complement?: string | null;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}

export interface AddressResponseModel {
  id: string;
  street: string;
  number: string;
  complement?: string | null;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  createdAt: Date;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    city: string | null;
    state: string | null;
    avatarUrl: string | null;
  };
  fullAddress: string;
}
