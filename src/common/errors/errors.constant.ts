import {
    BadRequestException,
    NotFoundException,
    InternalServerErrorException,
} from '@nestjs/common';
import { LanguageType } from 'src/i18n/i18n.constant';

export const ErrorNotFound = (customMessage?: string, lang?: LanguageType) =>
    new NotFoundException(customMessage || 'Not Found!');

export const ErrorBadRequest = (customMessage?: string, lang?: LanguageType) =>
    new BadRequestException(customMessage || 'Bad Request!');

export const ErrorInternalException = (
    customMessage?: string,
    lang?: LanguageType,
) =>
    new InternalServerErrorException(customMessage || 'Internal Server Error!');
