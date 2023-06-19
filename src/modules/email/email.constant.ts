export const EMAIL_DEFAULT = 'esim@piratemobile.gg';

export enum RefEmail {
    ORDER_REFERENCES = 'ORDER_REFERENCES',
}

export const INTERNAL_EMAIL_SENDER =
    '"Pirate Mobile" <no-reply@piratemobile.gg>';

export const EMAIL_ORDER_REFERENCES_TEMPLATE = () => `Hi :receiveFn,<br/>
<br/>
You've received a new event request (ID #:requestId) from :employeeNicknameId with the following detail:<br/>
<br/>
      •  Employee: :employeeNicknameId <br/> 
      •  Title: :title <br/> 
      •  Type: :eventType <br/> 
      •  From: :startTime <br/> 
      •  To: :endTime <br/> 
      •  Location: :address <br/> 
      •  PIC: :pic <br/> 
      •  Remark: :remark <br/> 
<br/>
You can approve or reject this request by the clicking the following link: :link<br/>
<br/>
Please do not reply to this email as it's an automatic system email.<br/> 
<br/>
Sincerely,<br/> 
System.`;
