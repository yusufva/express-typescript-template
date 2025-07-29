export const port: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
export const appName: string = process.env.APP_NAME || 'express-template-ts';