export interface FirstAidDetail {
  id: string;
  emergencySubCategoryId: string;
  displayOrder: number;
  point: string;
  imageUrl: string;
}

export interface CreateFirstAidDetailVars {
  firstAidDetail: {
    displayOrder: number;
    emergencySubCategoryId: string;
    point: string;
  };
  image?: File;
}

export interface UpdateFirstAidDetailVars {
  id: string;
  firstAidDetail: {
    displayOrder: number;
    point: string;
  };
  image?: File;
}

export interface DeleteFirstAidDetailVars {
  id: string;
}

export interface FirstAidDetailResponse {
  success: boolean;
  message: string;
  firstAidDetail: FirstAidDetail;
}
