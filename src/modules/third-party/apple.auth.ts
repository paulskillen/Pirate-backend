import axios from 'axios';

const AppleAuth = {
    userProfile: async (accessToken: string, jwtService: any) => {
        const profile = await jwtService?.decode?.(accessToken, {});
        if (!profile) {
            return new Error('Not Found User!');
        }
        return {
            id: profile?.sub,
            socialId: profile?.sub,
            email: profile?.email,
            firstName: profile?.firstName ?? '',
            lastName: profile?.lastName ?? '',
        };
    },
};

export default AppleAuth;
