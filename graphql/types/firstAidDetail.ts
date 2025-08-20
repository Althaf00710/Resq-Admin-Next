export interface FirstAidDetail {
  id: string;
  emergencySubCategoryId: string;
  emergencySubCategory : {
    name : string;
  }
  displayOrder: number;
  point: string;
  imageUrl: string;
}

export interface CreateFirstAidDetailVars {
  firstAidDetail: {
    displayOrder: number;
    emergencySubCategoryId: number;
    point: string;
  };
  image?: File;
}

export interface UpdateFirstAidDetailVars {
  id: string;
  firstAidDetail: {
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
