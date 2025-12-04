import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateInstitutionDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsString()
  @MaxLength(32)
  @Matches(/^[A-Z0-9_-]+$/, {
    message:
      'code must contain only uppercase letters, numbers, underscores or dashes',
  })
  code!: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  shortName?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isActive?: boolean;
}
