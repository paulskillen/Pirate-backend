import * as ses from 'node-ses';

const emailClient = ses.createClient({
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
});

export default emailClient;
