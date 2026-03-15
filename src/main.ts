import { NestFactory } from "@nestjs/core";
import { EtlModule } from "./etl.module";
import * as bodyParser from "body-parser";
import { ValidationPipe } from "@nestjs/common";
import { EtlService } from "./app.service";

async function bootstrap() {
  const app = await NestFactory.create(EtlModule);

  app.use(bodyParser.json());
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );
  await app.listen(3000);
  console.log("Aplicação está rodando na porta 3000.");

  const etlService = app.get(EtlService);
  await etlService.realizarEtl();
  setInterval(() => etlService.realizarEtl(), 5000); // 3600000 ms = 1 hora
}
bootstrap();
