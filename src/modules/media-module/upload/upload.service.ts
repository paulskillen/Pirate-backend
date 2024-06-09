import { HttpException, Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { FileUpload } from 'graphql-upload';
import * as moment from 'moment';
import { Error } from 'mongoose';
import * as sharp from 'sharp';
import { UploadUrlDto } from './dto/upload.dto';
import {
    AWS_REGION,
    ORIGINAL_IMAGE_SIZE_UPLOAD_LIST,
    UploadAuthType,
    UploadModeStatus,
    UploadType,
    UPLOAD_FOLDER_DATE_FORMAT,
} from './upload.constant';
import { generateFileNameWithExtension } from './upload.helper';

const AWS_S3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region: AWS_REGION,
});

interface ResultFileUpload {
    filename?: string;
    fileUrl?: string;
    type?: string;
    status?: UploadModeStatus;
    error?: any;
}

@Injectable()
export class UploadService {
    private async transformImage(
        file: FileUpload,
        uploadType: UploadAuthType,
    ): Promise<{ file: any; filename: string; mimetype: any }> {
        const { createReadStream, mimetype }: FileUpload = file;
        const bufferResize = await this.reduceSize(
            createReadStream,
            uploadType,
        );
        const filename = generateFileNameWithExtension();
        return { file: bufferResize, filename, mimetype };
    }

    private async transformFile(
        file: FileUpload,
    ): Promise<{ file: any; filename: string; mimetype: any }> {
        const { filename, createReadStream, mimetype }: FileUpload = file;
        const bufferResize = createReadStream();
        return { file: bufferResize, filename, mimetype };
    }

    private async reduceSize(
        createReadStream,
        uploadType: UploadAuthType,
    ): Promise<any> {
        const stream = createReadStream();
        const chunks = [];

        const buffer = await new Promise<Buffer>((resolve, reject) => {
            let buffer: Buffer;

            stream.on('data', function (chunk) {
                chunks.push(chunk);
            });

            stream.on('end', function () {
                buffer = Buffer.concat(chunks);
                resolve(buffer);
            });

            stream.on('error', reject);
        });

        const isKeepOriginal =
            ORIGINAL_IMAGE_SIZE_UPLOAD_LIST.includes(uploadType);

        const metadata = await sharp(buffer).metadata();
        const width = Math.ceil(metadata.width - (metadata.width * 0) / 100);
        const height = Math.ceil(metadata.height - (metadata.height * 0) / 100);
        const result = await sharp(buffer)
            .resize(width, height, { fit: sharp.fit.contain })
            .webp({ lossless: false, quality: isKeepOriginal ? 100 : 20 })
            .toBuffer();
        return result;
    }

    async generateS3UrlAdmin(
        auth: any,
        authType: UploadAuthType = UploadAuthType.ADMIN,
        fileName: string,
    ): Promise<UploadUrlDto> {
        const authId = auth?._id?.toString?.();
        const date = moment().format(UPLOAD_FOLDER_DATE_FORMAT);
        const name = generateFileNameWithExtension(fileName);
        if (authId && !authType) {
            throw new Error('Please specified auth type!');
        }
        const filePath = authId
            ? `${authType}/${date}/${authId}/${name}`
            : `${UploadAuthType.DEFAULT}/${date}/${name}`;
        const params = {
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Key: filePath,
            Expires: 3000,
            ACL: 'public-read',
        };
        return await this.processGenerateS3Url(params, name);
    }

    async generateS3UrlCustomer(
        auth: any,
        uploadType: UploadType = UploadType.OTHER,
    ): Promise<UploadUrlDto> {
        const authId = auth?._id?.toString?.();
        const date = moment().format(UPLOAD_FOLDER_DATE_FORMAT);
        const name = generateFileNameWithExtension();

        const filePath = authId
            ? `${UploadAuthType.CUSTOMER}/${authId}/${uploadType}/${date}/${name}`
            : `${UploadAuthType.CUSTOMER}/${uploadType}/${date}/${name}`;
        const params = {
            Bucket: process.env.AWS_PUBLIC_BUCKET_NAME,
            Key: filePath,
            Expires: 3000,
            ACL: 'public-read',
        };
        return await this.processGenerateS3Url(params, name);
    }

    async processGenerateS3Url(
        params: any,
        name: string,
    ): Promise<UploadUrlDto> {
        const uploadUrl = await AWS_S3.getSignedUrl('putObject', params);
        const res: UploadUrlDto = {
            uploadUrl,
            fileName: name,
            fileUrl: uploadUrl.slice(0, uploadUrl.indexOf('?')),
            status: UploadModeStatus.PENDING,
        };
        return res;
    }

    async uploadS3(
        file,
        name,
        mimetype,
        metaData: { auth: any; uploadType: string },
    ) {
        const { auth, uploadType } = metaData || {};
        const date = moment().format(UPLOAD_FOLDER_DATE_FORMAT);
        const bucket = process.env.AWS_PUBLIC_BUCKET_NAME;
        const saveDestination = `${bucket}/${uploadType}/${date}/${auth?.id}`;
        const params = {
            Bucket: saveDestination,
            Key: String(name),
            Body: file,
            ACL: 'public-read',
            ContentType: mimetype,
            ContentDisposition: 'inline',
            CreateBucketConfiguration: {
                LocationConstraint: AWS_REGION,
            },
            s3ForcePathStyle: true,
        };

        try {
            const s3Response = await AWS_S3.upload(params).promise();
            return s3Response;
        } catch (e) {
            return false as any;
        }
    }

    async storeFileToS3(
        fileUpload: FileUpload,
        uploadType: UploadAuthType = UploadAuthType.DEFAULT,
        auth: any,
    ): Promise<ResultFileUpload> {
        const { mimetype } = await fileUpload;
        const isImg = mimetype === 'image/png' || mimetype === 'image/jpeg';
        const transform = isImg
            ? await this.transformImage(fileUpload, uploadType)
            : await this.transformFile(fileUpload);
        const { file, filename } = transform || {};
        try {
            const uploadedFile = await this.uploadS3(file, filename, mimetype, {
                uploadType,
                auth,
            });
            if (!uploadedFile) {
                throw {
                    filename,
                    type: mimetype,
                    status: UploadModeStatus.ERROR,
                    error: 'Uploaded to aws-s3 failed!',
                };
            }
            return {
                fileUrl: uploadedFile?.Location,
                filename: uploadedFile?.Key,
                type: mimetype,
                status: UploadModeStatus.SUCCESS,
            };
        } catch (error) {
            throw {
                filename,
                type: mimetype,
                status: UploadModeStatus.ERROR,
                error,
            };
        }
    }

    async storeMultipleFileToS3(
        files: Promise<FileUpload>[],
        uploadType: UploadAuthType = UploadAuthType.DEFAULT,
        auth: any,
    ): Promise<ResultFileUpload[]> {
        try {
            const res = files.map(async (i: Promise<FileUpload>) => {
                const file = await i;
                const onStoreFile = await this.storeFileToS3(
                    file,
                    uploadType,
                    auth,
                );
                return onStoreFile;
            });
            return Promise.all(res).then((results) => {
                return results;
            });
        } catch (error) {
            throw new HttpException('Fail to upload file', 400);
        }
    }
}
