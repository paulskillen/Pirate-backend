export const EMAIL_DEFAULT = 'esim@piratemobile.gg';

export enum RefEmail {
    ORDER_REFERENCES = 'ORDER_REFERENCES',
}

export const INTERNAL_EMAIL_SENDER =
    '"Pirate Mobile" <no-reply@piratemobile.gg>';

export const EMAIL_ORDER_REFERENCES_TEMPLATE = () => `Hi :receiveFn,<br/>
<br/>
You've received a new event request (ID #:requestId) from :employeeNicknameId with the following detail:<br/>

<p><span>test</span><b>123</b></p>

<img style="width:250px;height:250px" alt="Qr Code" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQAAAAEAAQMAAABmvDolAAAABlBMVEX///8AAABVwtN+AAAB8klEQVR42uyZMbLzIAyE10NByRE4CjeL7ZtxFI5AScF4/5Eg+Z1MqldFHqt5b8LXEEmrFcEdd9zxt1hJssVMlpXMJDcE+YzXAgAsDQmIm6+JDUsPeR7YARy5t5gRysKaHHkg6KUNAmTFQtI0ALDGna9kXQ/QmozSSntD6r4AX4r214GpDz2Uh6/Jtbj3rwLy08AIAXj4Kv8v/Yuk/zrQQ5arIhT40VmOXP6X3DWA1THrSY1sgfBlZQUbbAEdSWTwNZnwQODS4mYNOHzBSx+4AenceiaAqQ+OBXLSopTc9QCnqiEj6dDOKvLNvLkgAwAc8ypXHC6oI+5kPguIBWB1NY37kQ0ykrSltDTtAJj2QLQaSI5FR5K4hCsBKwIPqUnqSGLTbL4tQQYATEcqnCe7Lw9A82sJeNbky8CJymWeRpIRANPkLC1k8QV9uIRLATJyZfL2oCO3D/9wFnMLwMqaxionJ7lrNnmuSQsAyCy9NAfr0AeeZdACsE5LMx6i1GKP9K2XAuaup9uPr+heR9JxKloLwHSkFEsnACLHGwhMASd74KtuEX2MWVPA8z2K3PzYRPmxHVwHiNlVTON96EIRDQLP1Mkqt7mavrwu/jYwajLrH7UHGB7VFsCx/Uh6hlTsPeTj84ce68Add9zxHv8CAAD//6pM/a7UF8PwAAAAAElFTkSuQmCC" />

<p>
You can approve or reject this request by the clicking the following link: :link<br/>
</p>
<br/>
Please do not reply to this email as it's an automatic system email.<br/> 
<br/>
Sincerely,<br/> 
System.`;
