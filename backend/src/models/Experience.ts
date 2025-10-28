import mongoose from 'mongoose';
import type { Document, Schema } from 'mongoose';

export interface ISlot {
  date: string;
  time: string;
  remaining: number;
}

export interface IExperience extends Document {
  title: string;
  location: string;
  description: string;
  about: string;
  basePrice: number;
  imageUrl: string;
  slots: ISlot[];
}

const SlotSchema: Schema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  remaining: { type: Number, required: true },
});

const ExperienceSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  about: { type: String, required: true },
  basePrice: { type: Number, required: true },
  imageUrl: { type: String, required: true },
  slots: [SlotSchema],
});

export default mongoose.model<IExperience>('Experience', ExperienceSchema);