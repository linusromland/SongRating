import { Request, Response, NextFunction } from 'express';

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  const { method, url, ip } = req;
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const { statusCode } = res;
    
    // Skip logging for static files in production
    if (process.env.NODE_ENV === 'production' && 
        (url.includes('.js') || url.includes('.css') || url.includes('.ico'))) {
      return;
    }
    
    console.log(`${method} ${url} ${statusCode} ${duration}ms - ${ip}`);
  });
  
  next();
}