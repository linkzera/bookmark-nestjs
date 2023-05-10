import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class NewBookmarkDto {
  @IsUrl()
  @IsNotEmpty()
  link: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
