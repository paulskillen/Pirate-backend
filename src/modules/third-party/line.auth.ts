import axios from 'axios';

const LineAuth = {
    userProfile: async (accessToken: string) => {
        const profileRes: any = await axios
            .create({
                baseURL: 'https://api.line.me/v2',
                headers: { Authorization: `Bearer ${accessToken}` },
            })
            .get(`/profile`, {
                params: { access_token: accessToken },
            });
        const profile = profileRes?.data;
        console.log('profile', profile);
        return {
            id: profile?.userId,
            socialId: profile?.userId,
            email: profile?.email,
            firstName: profile?.displayName ?? '',
            lastName: profile?.displayName ?? '',
            fullName: profile?.displayName ?? '',
            avatar: profile?.picture,
        };
    },
};

export default LineAuth;
