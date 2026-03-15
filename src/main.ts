import { NestFactory } from "@nestjs/core";
import { EtlModule } from "./etl.module";
import * as bodyParser from "body-parser";
import { ValidationPipe, Logger } from "@nestjs/common";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
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

  const port = process.env.PORT || 3000;
  await app.listen(port);
  logger.log(`Aplicação está rodando na porta ${port}.`);
}
bootstrap();
