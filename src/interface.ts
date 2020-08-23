// Entry
export interface Entry {
  id?: string;
  title: string;
  content: string;
  createdAt?: string;
  updatedAt?: string;
  diaryId?: string;
}

// Diary
export interface Diary {
  id?: string;
  title: string;
  type: "private" | "public";
  createdAt?: string;
  updatedAt?: string;
  userId?: string;
  entryIds: string[] | null;
}

// User
export interface User {
  id?: string;
  username: string;
  email: string;
  password?: string;
  diaryIds?: string[] | null;
}

// Auth Response
export interface AuthResponse {
  token: string;
  user: User;
}
