interface JwtPayload {
  data: {
    isAdmin: boolean;
    id: string;
    role: string;
  };
}

export default JwtPayload