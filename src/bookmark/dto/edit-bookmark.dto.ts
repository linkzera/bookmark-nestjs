import { IsOptional, IsString, IsUrl } from 'class-validator';

export class EditBookmarkDto {
  @IsUrl()
  @IsOptional()
  link: string;

  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
