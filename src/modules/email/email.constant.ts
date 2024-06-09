export const EMAIL_DEFAULT = 'Pirate Mobile esim@piratemobile.gg';

export enum RefEmail {
    ORDER_REFERENCES = 'ORDER_REFERENCES',
}

export const INTERNAL_EMAIL_SENDER =
    '"Pirate Mobile" <no-reply@piratemobile.gg>';

export const EMAIL_ORDER_REFERENCES_TEMPLATE = (attachmentCid?: string) => `
<p>
Thank you for choosing Pirate Mobile <br/>
Please see attached the QR code to activate your eSim. <br/>
Here are the steps a to activate an eSIM using a QR code:<br/>
</p>

<img style="width:250px;height:250px" alt="Qr Code" src="cid:${
    attachmentCid || '@esimQrCode'
}" />

<p>
1. Ensure that their device is eSIM compatible. They can check their device specifications or contact their carrier to confirm.
</p>

<p>
2. Obtain a QR code from their carrier. The QR code may come in the form of a physical card or as an email attachment.
</p>

<p>
3. On their device, go to the “Settings” menu, then select “Mobile Data” or “Cellular Data”.
</p>

<p>
4. Tap “Add Data Plan”.
</p>

<p>
5. Scan the QR code provided by their carrier.
</p>

<p>
6. Review the details of the eSIM plan and tap “Add Cellular Plan”.
</p>

<p>
7. Follow the prompts to complete the activation process.
</p>

<p>
8. Once the process is complete, the eSIM should be successfully activated on their device.
</p>

<p>
It's important to note that the steps for activating an eSIM using a QR code may vary depending on the device or carrier. Customers should follow any additional instructions provided by their carrier or device manufacturer to ensure successful activation.
</p>
`;
