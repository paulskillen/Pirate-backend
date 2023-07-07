import { Injectable } from '@nestjs/common';
import { SentEmailInput, SentEmailAttachmentInput } from './dto/email.dto';
import { EMAIL_DEFAULT } from './email.constant';
import NodeMailer from './node-mailer/node-mailer';

const qrCodeBase64 =
    'iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB8klEQVR42uyZMbLzIAyE10NByRE4CjeL7ZtxFI5AScF4/5Eg+Z1MqldFHqt5b8LXEEmrFcEdd9zxt1hJssVMlpXMJDcE+YzXAgAsDQmIm6+JDUsPeR7YARy5t5gRysKaHHkg6KUNAmTFQtI0ALDGna9kXQ/QmozSSntD6r4AX4r214GpDz2Uh6/Jtbj3rwLy08AIAXj4Kv8v/Yuk/zrQQ5arIhT40VmOXP6X3DWA1THrSY1sgfBlZQUbbAEdSWTwNZnwQODS4mYNOHzBSx+4AenceiaAqQ+OBXLSopTc9QCnqiEj6dDOKvLNvLkgAwAc8ypXHC6oI+5kPguIBWB1NY37kQ0ykrSltDTtAJj2QLQaSI5FR5K4hCsBKwIPqUnqSGLTbL4tQQYATEcqnCe7Lw9A82sJeNbky8CJymWeRpIRANPkLC1k8QV9uIRLATJyZfL2oCO3D/9wFnMLwMqaxionJ7lrNnmuSQsAyCy9NAfr0AeeZdACsE5LMx6i1GKP9K2XAuaup9uPr+heR9JxKloLwHSkFEsnACLHGwhMASd74KtuEX2MWVPA8z2K3PzYRPmxHVwHiNlVTON96EIRDQLP1Mkqt7mavrwu/jYwajLrH7UHGB7VFsCx/Uh6hlTsPeTj84ce68Add9zxHv8CAAD//6pM/a7UF8PwAAAAAElFTkSuQmCC';

@Injectable()
export class EmailService {
    async sent(input: SentEmailInput): Promise<boolean> {
        try {
            const { from, to, subject, message } = input;
            const info = await NodeMailer.sendMail({
                from: from || EMAIL_DEFAULT,
                to,
                subject,
                html: message,
                sender: 'Pirate Mobile',
            });
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    async sentWithAttachment(
        input: SentEmailAttachmentInput,
    ): Promise<boolean> {
        try {
            const { from, to, subject, message, attachments } = input;
            const info = await NodeMailer.sendMail({
                from: from || EMAIL_DEFAULT,
                to,
                subject,
                html: message,
                attachments,
                sender: 'Pirate Mobile',
            });
            console.log('Email sent:', info);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
