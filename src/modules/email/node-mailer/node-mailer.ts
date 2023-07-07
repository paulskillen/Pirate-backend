/* eslint-disable @typescript-eslint/no-var-requires */
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import * as nodemailer from 'nodemailer';

const aws = require('@aws-sdk/client-ses');
const ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1',
    defaultProvider,
});
const transporter = nodemailer.createTransport({
    // SES: {
    //     apiVersion: '2010-12-01',
    //     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    //     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    //     region: 'us-east-1',
    // },
    SES: { ses, aws },
});

export default transporter;
