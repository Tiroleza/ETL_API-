import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI_CLUSTER1"),
      }),
      inject: [ConfigService],
      connectionName: "cluster1",
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI_CLUSTER2"),
      }),
      inject: [ConfigService],
      connectionName: "cluster2",
    }),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
