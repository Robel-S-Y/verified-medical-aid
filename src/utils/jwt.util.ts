import * as jwt from 'jsonwebtoken';

interface TokenPayload {
  user_id: string;
  role?: string;
  hospital_id?: string;
}

interface GenerateTokenOptions {
  payload: TokenPayload;
  type: 'access_token' | 'refresh_token';
  expiresIn: string;
}

export const generateToken = ({
  payload,
  type,
  expiresIn,
}: GenerateTokenOptions) => {
  const secret =
    type === 'access_token'
      ? process.env.JWT_SECRET
      : process.env.JWT_SECRET_REFRESH;

  return jwt.sign(payload, secret, { expiresIn });
};
