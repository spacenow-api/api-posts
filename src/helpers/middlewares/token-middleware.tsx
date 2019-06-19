import RequestWithUser from '../interfaces/requestWithUser.interface';

export default async (req: RequestWithUser) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer')
    return req.headers.authorization.split(' ')[1];
  if (req.query && req.query.token)
    return req.query.token;
  if (req.cookies && req.cookies.token)
    return req.cookies.token;
}