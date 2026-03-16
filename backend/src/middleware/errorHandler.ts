import { Request, Response, NextFunction } from 'express';

/**
 * Classe d'erreur personnalisée avec code HTTP
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Middleware de gestion centralisée des erreurs
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Cas d'erreur opérationnelle (attendue)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  // Erreur Mongoose - Validation
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      status: 'error',
      message: 'Erreur de validation des données',
      details: err.message,
    });
  }

  // Erreur Mongoose - Cast (ID invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      message: 'ID invalide',
    });
  }

  // Erreur MongoDB - Duplicate key (email déjà utilisé)
  if (err.message.includes('E11000')) {
    return res.status(400).json({
      status: 'error',
      message: 'Cette ressource existe déjà (email ou référence dupliqué)',
    });
  }

  // Erreur JWT - Token invalide
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalide',
    });
  }

  // Erreur JWT - Token expiré
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      status: 'error',
      message: 'Token expiré. Veuillez vous reconnecter',
    });
  }

  // Erreur inattendue (programmation)
  console.error('❌ ERREUR INATTENDUE:', err);
  
  return res.status(500).json({
    status: 'error',
    message: 'Une erreur interne est survenue',
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    }),
  });
};

/**
 * Wrapper async pour éviter try-catch dans chaque route
 */
export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
