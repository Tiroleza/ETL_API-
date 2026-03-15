import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Dado, DadoDocument } from "./schemas/dado.schema";
import {
  DadoTransformado,
  DadoTransformadoDocument,
} from "./schemas/dadoTransformado.schema";
import { DadoTransformadoDto } from "./schemas/dadoTransformado.dto";

@Injectable()
export class EtlService {
  private readonly logger = new Logger(EtlService.name);
  private etlEmExecucao = false;

  constructor(
    @InjectModel(Dado.name, "cluster1")
    private readonly dadoModel: Model<DadoDocument>,
    @InjectModel(DadoTransformado.name, "cluster2")
    private readonly dadoTransformadoModel: Model<DadoTransformadoDocument>
  ) {}

  async criarDado(valorOriginal: string): Promise<Dado> {
    const novoDado = new this.dadoModel({ valorOriginal, transformado: false });
    return novoDado.save();
  }

  async listarDadosTransformados(): Promise<DadoTransformadoDto[]> {
    const dadosTransformados = await this.dadoTransformadoModel.find().exec();
    return dadosTransformados.map((dado) => ({
      valorTransformado: dado.valorTransformado,
    }));
  }

  private caesarCipher(str: string, shift: number): string {
    return str.toUpperCase().replace(/[A-Z]/g, (char) => {
      const start = 65; // Código ASCII para 'A'
      return String.fromCharCode(
        ((char.charCodeAt(0) - start + shift) % 26) + start
      );
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async realizarEtl() {
    if (this.etlEmExecucao) {
      this.logger.warn("Processo ETL já está em andamento. Ignorando nova execução.");
      return;
    }

    this.etlEmExecucao = true;
    this.logger.log("Iniciando processo ETL...");

    try {
      const dadosNaoTransformados = await this.dadoModel
        .find({ transformado: { $ne: true } })
        .exec();

      if (dadosNaoTransformados.length === 0) {
        this.logger.log("Todos os dados do cluster 1 já foram transformados.");
        return;
      }

      this.logger.log(`Foram encontrados ${dadosNaoTransformados.length} dados para transformar.`);

      for (const dado of dadosNaoTransformados) {
        const valorOriginal = dado.valorOriginal;

        // Lógica de transformação usando Cifra de César
        const shift = 3; // Valor fixo de deslocamento
        const valorTransformado = this.caesarCipher(valorOriginal, shift);

        // Armazena o dado transformado no cluster 2 (incluindo o valor original agora que o Schema permite)
        await new this.dadoTransformadoModel({
          valorOriginal,
          valorTransformado,
        }).save();

        dado.transformado = true;
        await dado.save();

        this.logger.debug(
          `Processado com sucesso: [${valorOriginal}] -> [${valorTransformado}]`
        );
      }

      this.logger.log("Processo ETL concluído com sucesso.");
    } catch (error) {
      this.logger.error("Erro durante a execução do ETL", error.stack);
    } finally {
      this.etlEmExecucao = false;
    }
  }
}
