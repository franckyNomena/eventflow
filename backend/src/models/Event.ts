import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  location: string;
  totalSeats: number;
  availableSeats: number;
  price: number;
  status: 'active' | 'cancelled' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre est requis'],
      trim: true,
    },
    date: {
      type: String,
      required: [true, 'La date est requise'],
    },
    location: {
      type: String,
      required: [true, 'Le lieu est requis'],
      trim: true,
    },
    totalSeats: {
      type: Number,
      required: [true, 'Le nombre total de places est requis'],
      min: [1, 'Le nombre de places doit être au moins 1'],
    },
    availableSeats: {
      type: Number,
      required: [true, 'Le nombre de places disponibles est requis'],
      min: [0, 'Le nombre de places disponibles ne peut pas être négatif'],
    },
    price: {
      type: Number,
      required: [true, 'Le prix est requis'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'completed'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Index pour recherche et tri
EventSchema.index({ status: 1, date: 1 });

export default mongoose.model<IEvent>('Event', EventSchema);
