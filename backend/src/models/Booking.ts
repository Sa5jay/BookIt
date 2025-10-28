import mongoose from 'mongoose';
import type { Document, Schema } from 'mongoose';

export interface IBooking extends Document {
  experienceId: mongoose.Schema.Types.ObjectId;
  date: string;
  time: string;
  quantity: number;
  totalPrice: number;
  user: {
    fullName: string;
    email: string;
  };
  refId: string;
}

const BookingSchema: Schema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  user: {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
  },
  refId: { type: String, required: true, unique: true },
});

export default mongoose.model<IBooking>('Booking', BookingSchema);