import axios from 'axios';

const GoogleAuth = {
    userProfile: async (accessToken: string) => {
        const profileRes: any = await axios.get(
            `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${accessToken}`,
        );
        // const profile = {
        //     iss: "https://accounts.google.com",
        //     azp: "1068813284922-oetstv8sldl1caf3h3j89jm2d34atll8.apps.googleusercontent.com",
        //     aud: "1068813284922-oetstv8sldl1caf3h3j89jm2d34atll8.apps.googleusercontent.com",
        //     sub: "113035993525675835122",
        //     email: "trung13988@gmail.com",
        //     email_verified: "true",
        //     at_hash: "B5S_xs-9aN9wJSBQyo2Rig",
        //     nonce: "tRped8aJDx-2sdtg_BZ4_01LtlB_q51bKkqLNLMSVPY",
        //     name: "Trung Do Xuan",
        //     picture:
        //         "https://lh3.googleusercontent.com/a/AItbvmkdLQokN9RHomTrOLbvjqX7nBbge1gu0pJ1YUdr=s96-c",
        //     given_name: "Trung",
        //     family_name: "Do Xuan",
        //     locale: "vi",
        //     iat: "1658804903",
        //     exp: "1658808503",
        //     alg: "RS256",
        //     kid: "074b928edf65a6f470c71b0a247bd0f7a4c9ccbc",
        //     typ: "JWT",
        // };
        const profile = profileRes?.data;
        console.log('google profile', profile);
        return {
            id: profile?.sub,
            socialId: profile?.sub,
            email: profile?.email,
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            fullName: profile?.name,
            avatar: profile?.picture,
        };
    },
};

export default GoogleAuth;
