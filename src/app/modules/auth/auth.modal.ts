import { Schema, model } from "mongoose";
import { TUser } from "./auth.interface";

const userSchema = new Schema<TUser>(
  {
    name: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    role: { type: String, required: true, enum: ["user", "admin"] },
  },
  {
    timestamps: true,
  }
);

userSchema.set("toJSON", {
  transform: (doc, ret, options) => {
    delete ret.password;
    return ret;
  },
});

export const Users = model<TUser>("Users", userSchema);
