import { PartialType } from '@nestjs/swagger';
import { CreateClipDto } from './create-clip.dto';

export class UpdateClipDto extends PartialType(CreateClipDto) {}
