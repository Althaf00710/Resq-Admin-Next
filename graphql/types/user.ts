export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  joinedDate: string;
  lastActive: string;
  profilePicturePath: string;
}

export interface LoginUserData {
  loginUser: {
    success: boolean;
    message: string;
    user: Pick<User, 'id' | 'name' | 'username' | 'profilePicturePath'>;
  };
}

export interface LoginUserVars {
  username: string;
  password: string;
}

export interface CreateUserVars {
  input: {
    email: string;
    name: string;
    username: string;
    password: string;
  };
  profilePicture?: File;
}

export interface UpdateUserVars {
  id: string;
  input: {
    email: string;
    name: string;
    username: string;
    password: string;
  };
  profilePicture?: File;
}

export interface CreateOrUpdateUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface DeleteUserResponse {
  deleteUser: {
    success: boolean;
    message: string;
    user: {
      id: string;
      username: string;
    };
  };
}

export interface DeleteUserVars {
  id: string;
}
