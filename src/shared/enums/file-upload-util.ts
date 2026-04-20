import { extname } from 'path';
import { Request } from 'express';
import { Express } from 'express';

export const editFileName = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  const name = file.originalname
    .split('.')[0]
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/\s/g, '_');
  const fileExtName = extname(file.originalname);
  const currentTime = Date.now();
  callback(null, `${name}-${currentTime}${fileExtName}`);
};

export const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  callback(null, true);
};

export const pdfFilter = (
  req: Request,
  file: Express.Multer.File,
  callback,
) => {
  if (!file.originalname.match(/\.(pdf)$/)) {
    return callback(new Error('Only files pdf are allowed!'), false);
  }
  callback(null, true);
};
