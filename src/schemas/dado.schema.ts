import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DadoDocument = Dado & Document;

@Schema()
export class Dado {
  @Prop({ required: true, unique: true })
  valorOriginal: string; // Campo para armazenar o dado original

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const DadoSchema = SchemaFactory.createForClass(Dado);
