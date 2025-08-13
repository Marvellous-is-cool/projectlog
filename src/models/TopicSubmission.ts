import mongoose, { Document, Schema } from "mongoose";

export interface ITopicSubmission extends Document {
  fullName: string;
  matricNumber: string;
  discipline: "linguistics" | "communication";
  projectTopic: string;
  createdAt: Date;
  updatedAt: Date;
}

const TopicSubmissionSchema = new Schema<ITopicSubmission>(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxLength: [100, "Full name cannot exceed 100 characters"],
    },
    matricNumber: {
      type: String,
      required: [true, "Matric number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      maxLength: [20, "Matric number cannot exceed 20 characters"],
    },
    discipline: {
      type: String,
      required: [true, "Discipline is required"],
      enum: {
        values: ["linguistics", "communication"],
        message: "Discipline must be either linguistics or communication",
      },
    },
    projectTopic: {
      type: String,
      required: [true, "Project topic is required"],
      trim: true,
      maxLength: [500, "Project topic cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for better query performance
TopicSubmissionSchema.index({ fullName: 1, matricNumber: 1 });
TopicSubmissionSchema.index({ discipline: 1, createdAt: -1 });

// Pre-save middleware to check for duplicates
TopicSubmissionSchema.pre("save", async function (next) {
  if (this.isNew) {
    const existingByName = await mongoose.models.TopicSubmission?.findOne({
      fullName: { $regex: new RegExp(`^${this.fullName}$`, "i") },
    });

    if (existingByName) {
      const error = new Error(
        "A submission with this full name already exists"
      );
      error.name = "DuplicateError";
      return next(error);
    }
  }
  next();
});

export default mongoose.models.TopicSubmission ||
  mongoose.model<ITopicSubmission>("TopicSubmission", TopicSubmissionSchema);
