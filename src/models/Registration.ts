import mongoose, { type HydratedDocument, type Model, Schema, models } from 'mongoose';

export type RegistrationDocument = {
  eventId: mongoose.Types.ObjectId;
  attendeeId: mongoose.Types.ObjectId;
  createdAt: Date;
};

const registrationSchema = new Schema<RegistrationDocument>(
  {
    eventId: {
      type: Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
      index: true,
    },
    attendeeId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

registrationSchema.index({ eventId: 1, attendeeId: 1 }, { unique: true });
registrationSchema.index({ attendeeId: 1, createdAt: -1 });

export type RegistrationHydratedDocument = HydratedDocument<RegistrationDocument>;

export const RegistrationModel: Model<RegistrationDocument> =
  (models.Registration as Model<RegistrationDocument>) ??
  mongoose.model<RegistrationDocument>('Registration', registrationSchema);
