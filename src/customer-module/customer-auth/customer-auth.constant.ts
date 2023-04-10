import { registerEnumType } from '@nestjs/graphql';

export const JWT_SECRET =
    'fdfdferbejrbebdfueyruebdbfdfbdfhbfhdfbereur34y34bjfdjfdfdfd';

export enum SocialProvider {
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK',
    LINE = 'LINE',
    APPLE = 'APPLE',
}
registerEnumType(SocialProvider, {
    name: 'SocialProvider',
});
