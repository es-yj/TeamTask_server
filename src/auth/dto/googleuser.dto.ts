export interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

export type GoogleRequest = Request & { user: GoogleUser };
