import { Request } from 'express';
import { Express } from 'express';

interface FileMapper {
  file: Express.Multer.File;
  req: Request;
}

interface FilesMapper {
  files: Express.Multer.File[];
  req: Request;
}

export const fileMapper = ({ file, req }: FileMapper) => {
  const image_url = `${req.protocol}://${req.headers.host}/${file.path}`;
  return {
    originalname: file.originalname,
    filename: file.filename,
    image_url,
  };
};

export const filesMapper = ({ files, req }: FilesMapper) => {
  return files.map((file) => {
    const image_url = `${
      req.headers['x-forwarded-proto']
        ? req.headers['x-forwarded-proto']
        : 'http'
    }://${req.headers.host}/${file.path}`;
    return {
      originalname: file.originalname,
      filename: file.filename,
      image_url,
    };
  });
};

export const ckeditorFileMapper = ({ file, req }: FileMapper) => {
  const url = `${
    req.headers['x-forwarded-proto'] ? req.headers['x-forwarded-proto'] : 'http'
  }://${req.headers.host}/${file.path}`;
  return {
    url,
  };
};
