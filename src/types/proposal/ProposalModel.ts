export interface ProposalModel {
  id: string;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requester: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    avatarUrl: string | null;
  };
  responder: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    avatarUrl: string | null;
  };
  items: ProposalItemModel[];
}

export interface ProposalItemModel {
  id: string;
  postId: string;
  isOffered: boolean;
  post: {
    id: string;
    title: string;
    description: string | null;
    imageUrl: string | null;
    rating: number | null;
    isActive: boolean;
    category: {
      id: string;
      name: string;
      description: string | null;
    };
    subcategory: {
      id: string;
      name: string;
      description: string | null;
    };
    condition: {
      id: string;
      code: string;
      type: string;
      description: string | null;
    } | null;
  };
}

export interface ProposalCreateModel {
  message?: string;
  responderId: string;
  items: {
    postId: string;
    isOffered: boolean;
  }[]; // Array com exatamente 1 item
}

export interface ProposalUpdateModel {
  message?: string;
  status?: "pending" | "accepted" | "rejected";
}

export interface ProposalResponseModel {
  id: string;
  message: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  requester: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    avatarUrl: string | null;
  };
  responder: {
    id: string;
    name: string;
    city: string | null;
    state: string | null;
    avatarUrl: string | null;
  };
  items: ProposalItemModel[];
  totalItems: number;
}
