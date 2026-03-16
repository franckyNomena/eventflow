import mongoose, { Schema, Document } from 'mongoose';

export interface IReservation extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  quantity: number;
  totalPrice: number;
  reference: string;
  status: 'confirmed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const ReservationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'L\'utilisateur est requis'],
    },
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'L\'événement est requis'],
    },
    eventTitle: {
      type: String,
      required: [true, 'Le titre de l\'événement est requis'],
    },
    name: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'L\'email est requis'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Le téléphone est requis'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'La quantité est requise'],
      min: [1, 'La quantité doit être au moins 1'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Le prix total est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    reference: {
      type: String,
      required: [true, 'La référence est requise'],
      unique: true,
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

// Index pour recherche rapide
ReservationSchema.index({ userId: 1, status: 1 });
ReservationSchema.index({ eventId: 1 });
ReservationSchema.index({ email: 1 });
ReservationSchema.index({ reference: 1 });

export default mongoose.model<IReservation>('Reservation', ReservationSchema);
