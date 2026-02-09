import { model, models, Schema } from "mongoose";
import { IResource } from "../types/type";

const resourceSchema = new Schema<IResource>(
  {
    title: {
      type: String,
      required: true,
    },
    file: {
      url: {
        type: String,
        required: true,
      },
      resourceType: String,
      publicId: {
        type: String,
        required: true,
      },
    },
    classroom: {
      type: Schema.Types.ObjectId,
      ref: "Classroom",
      required: true,
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Resource = models.Resource || model<IResource>("Resource", resourceSchema);
export default Resource;
