import { Resolver } from '@nestjs/graphql';
import { UploadResultDto } from './dto/upload.dto';
import { UploadService } from './upload.service';

@Resolver(() => UploadResultDto)
export class UploadResolver {
    constructor(private uploadService: UploadService) {}
}
