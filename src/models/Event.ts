import mongoose, { type HydratedDocument, type Model, Schema, models } from 'mongoose';

export type EventDocument = {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  slug: string;
  hostId: mongoose.Types.ObjectId;
  isClosed: boolean;
  capacity?: number;
  registrationDeadline?: Date;
  createdAt: Date;
};

const eventSchema = new Schema<EventDocument>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 4000,
    },
    date: {
      type: String,
      required: true,
      trim: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    slug: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
      lowercase: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
      index: true,
    },
    capacity: {
      type: Number,
      min: 1,
    },
    registrationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

eventSchema.index({ hostId: 1, createdAt: -1 });

export type EventHydratedDocument = HydratedDocument<EventDocument>;

export const EventModel: Model<EventDocument> =
  (models.Event as Model<EventDocument>) ?? mongoose.model<EventDocument>('Event', eventSchema);
