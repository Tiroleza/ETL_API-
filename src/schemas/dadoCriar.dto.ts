import { IsString, IsNotEmpty } from "class-validator";

export class CriarDadoDto {
  @IsString()
  @IsNotEmpty()
  valorOriginal: string;
}
