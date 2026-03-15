import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type DadoTransformadoDocument = DadoTransformado & Document;

@Schema()
export class DadoTransformado {
  @Prop({ required: true, unique: true })
  valorTransformado: string; // Campo para armazenar o dado transformado

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
}

export const DadoTransformadoSchema =
  SchemaFactory.createForClass(DadoTransformado);
