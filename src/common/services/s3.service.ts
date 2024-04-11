import {
  DeleteObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import * as dotenv from 'dotenv';
import * as path from 'path';
import process from 'process';

import getConfigs from '../configs/configs';

dotenv.config({ path: './environments/local.env' });

const awsConfig = getConfigs().aws;

export enum EFileTypes {
  User = 'user',
  Goods = 'goods',
  Bought = 'bought',
}

export class S3Service {
  constructor(
    private s3Client = new S3Client({
      region: awsConfig.aws_region,
      credentials: {
        accessKeyId: awsConfig.asw_key,
        secretAccessKey: awsConfig.aws_secret_key,
      },
    }),
  ) {}

  public async uploadFile(
    file: Express.Multer.File,
    itemType: EFileTypes,
    itemId: string,
  ) {
    const filePath = this.buildPath(file.originalname, itemType, itemId);

    await this.s3Client.send(
      new PutObjectCommand({
        Key: filePath,
        Bucket: awsConfig.aws_bucket,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      }),
    );

    return filePath;
  }

  public async deleteFile(fileKey: string) {
    await this.s3Client.send(
      new DeleteObjectCommand({
        Key: fileKey,
        Bucket: awsConfig.aws_bucket,
      }),
    );
  }

  public buildPath(
    fileName: string,
    fileType: EFileTypes,
    fileId: string,
  ): string {
    return `${fileType}/${fileId}/${crypto.randomUUID()}${path.extname(
      fileName,
    )}`;
  }
}
