import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import AuthenticationTokenMissingException from '../exceptions/AuthenticationTokenMissingException';
import WrongAuthenticationTokenException from '../exceptions/WrongAuthenticationTokenException';
import RequestWithUser from '../interfaces/requestWithUser.interface';
import { DataStoredInToken } from '../../token/token.interface';
import usersMock from '../mocks/users.mock';
import tokenMiddleware from './token-middleware'

export default async (req: RequestWithUser, res: Response, next: NextFunction) => {

  let token = await tokenMiddleware(req);

  if (token) {
    const secret:string = process.env.JWT_SECRET || 'Spacenow';
    try {
      const verificationResponse:DataStoredInToken = jwt.verify(token, secret) as DataStoredInToken;
      console.log("Verification Response", verificationResponse)
      const id = verificationResponse.id;
      console.log("ID", id)
      const user = await usersMock.find(user => {
        console.log("USER ID", user.id)
        return user.id === id
      });
      console.log(user)
      if (user) {
        req.user = user;
        next();
      } else {
        next(new WrongAuthenticationTokenException());
      }
    } catch (error) {
      next(new WrongAuthenticationTokenException());
    }
  } else {
    next(new AuthenticationTokenMissingException());
  }
}