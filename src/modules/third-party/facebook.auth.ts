import axios from 'axios';

const FacebookAuth = {
    userProfile: async (accessToken: string) => {
        const profileRes: any = await axios.get(
            `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`,
        );

        const profile = profileRes?.data;
        return {
            id: profile?.id,
            socialId: profile?.id,
            email: profile?.email,
            firstName: profile?.name,
            lastName: profile?.name,
            fullName: profile?.name,
            avatar: profile?.picture?.data?.url,
        };
    },
};

export default FacebookAuth;
