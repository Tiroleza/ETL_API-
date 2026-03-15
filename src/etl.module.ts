import { Module } from "@nestjs/common";
import { EtlController } from "./app.controller";
import { EtlService } from "./app.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Dado, DadoSchema } from "./schemas/dado.schema";
import {
  DadoTransformado,
  DadoTransformadoSchema,
} from "./schemas/dadoTransformado.schema";
import { DatabaseModule } from "./database/database.module";
import { ScheduleModule } from "@nestjs/schedule";

@Module({
  imports: [
    DatabaseModule,
    MongooseModule.forFeature(
      [{ name: Dado.name, schema: DadoSchema }],
      "cluster1"
    ),
    MongooseModule.forFeature(
      [{ name: DadoTransformado.name, schema: DadoTransformadoSchema }],
      "cluster2"
    ),
    ScheduleModule.forRoot(),
  ],
  controllers: [EtlController],
  providers: [EtlService],
})
export class EtlModule {}
