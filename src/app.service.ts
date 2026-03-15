import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cron, CronExpression } from "@nestjs/schedule";
import { Dado, DadoDocument } from "./schemas/dado.schema";
import {
  DadoTransformado,
  DadoTransformadoDocument,
} from "./schemas/dadoTransformado.schema";
import { DadoTransformadoDto } from "./schemas/dadoTransformado.dto";

interface DadoWithTransformed extends Dado {
  transformado: boolean;
}

@Injectable()
export class EtlService {
  private etlExecutado = false;

  constructor(
    @InjectModel(Dado.name, "cluster1")
    private readonly dadoModel: Model<DadoDocument & DadoWithTransformed>,
    @InjectModel(DadoTransformado.name, "cluster2")
    private readonly dadoTransformadoModel: Model<DadoTransformadoDocument>
  ) {}

  async criarDado(valorOriginal: string): Promise<Dado> {
    const novoDado = new this.dadoModel({ valorOriginal });
    return novoDado.save();
  }

  async listarDadosTransformados(): Promise<DadoTransformadoDto[]> {
    const dadosTransformados = await this.dadoTransformadoModel.find().exec();
    return dadosTransformados.map((dado) => ({
      valorTransformado: dado.valorTransformado,
    }));
  }

  caesarCipher(str: string, shift: number): string {
    return str.toUpperCase().replace(/[A-Z]/g, (char) => {
      const start = 65; // Código ASCII para 'A'
      return String.fromCharCode(
        ((char.charCodeAt(0) - start + shift) % 26) + start
      );
    });
  }

  @Cron(CronExpression.EVERY_HOUR)
  async realizarEtl() {
    if (this.etlExecutado) {
      console.log("Já foi realizado um ETL nesta execução.");
      return;
    }

    console.log("Iniciando processo ETL...");

    const dadosNaoTransformados = await this.dadoModel
      .find({
        transformado: { $ne: true }, // Filtra apenas os dados não transformados
      })
      .exec();

    if (dadosNaoTransformados.length === 0) {
      console.log("Todos os dados do cluster 1 já foram transformados.");
      return;
    }

    for (const dado of dadosNaoTransformados) {
      const valorOriginal = dado.valorOriginal;

      // Lógica de transformação usando Cifra de César
      const shift = 3; // Valor fixo de deslocamento
      const valorTransformado = this.caesarCipher(valorOriginal, shift);

      // Armazena o dado transformado no cluster 2
      await new this.dadoTransformadoModel({
        valorOriginal,
        valorTransformado,
      }).save();

      dado.transformado = true;
      await dado.save();

      console.log(
        `Dado original: ${valorOriginal} -> Dado transformado: ${valorTransformado}`
      );
      console.log("Dado transformado e armazenado no cluster 2.");
    }

    this.etlExecutado = true;
  }
}
