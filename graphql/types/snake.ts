export interface Snake {
  id: string;
  name: string;
  scientificName: string;
  venomType: string;
  description: string;
  imageUrl: string;
}

export interface SnakeInput {
  name: string;
  scientificName: string;
  venomType: string;
  description: string;
}

export interface CreateSnakeVars {
  input: SnakeInput;
  image?: File;
}

export interface UpdateSnakeVars {
  id: string;
  input: SnakeInput;
  image?: File;
}

export interface DeleteSnakeVars {
  id: string;
}

export interface CreateOrUpdateSnakeResponse {
  success: boolean;
  message: string;
  snake: Snake;
}

export interface DeleteSnakeResponse {
  success: boolean;
  message: string;
  snake: {
    id: string;
    scientificName: string;
  };
}
