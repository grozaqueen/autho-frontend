export type UsersDefaultResponse = {
  user_id?: number; // /login и /signup возвращают user_id, /api/v1/ - нет
  username: string;
  city: string;
};

export type HTTPErrorResponse = {
  error_message: string;
};

export type AuthUser = {
  userId?: number;
  username: string;
  city: string;
};
