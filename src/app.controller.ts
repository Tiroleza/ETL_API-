import {
  Controller,
  Get,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { EtlService } from "./app.service";
import { CriarDadoDto } from "./schemas/dadoCriar.dto";
import { DadoTransformadoDto } from "./schemas/dadoTransformado.dto";

@Controller("dados")
export class EtlController {
  constructor(private readonly etlService: EtlService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async criar(@Body() criarDadoDto: CriarDadoDto) {
    try {
      const dado = await this.etlService.criarDado(criarDadoDto.valorOriginal);
      return dado;
    } catch (error) {
      if (error.code === 11000) {
        throw new HttpException("Dado já cadastrado", HttpStatus.CONFLICT);
      } else {
        throw new HttpException(
          "Erro ao registrar o dado",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  @Get("listar-dados-transformados")
  async listarDadosTransformados(): Promise<DadoTransformadoDto[]> {
    const dados = await this.etlService.listarDadosTransformados();
    return dados;
  }
}
