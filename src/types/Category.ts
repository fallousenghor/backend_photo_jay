export interface Category {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCategory {
  name: string;
}

export interface UpdateCategory {
  name?: string;
}
