import { PartialType } from '@nestjs/mapped-types';
import { CreateHighlightDto } from './create-highlight.dto';

export class UpdateHighlightDto extends PartialType(CreateHighlightDto) {}
