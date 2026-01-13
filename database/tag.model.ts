import {model, models, Schema} from 'mongoose';
import { Document } from "mongoose";


export interface ITag {
    name: string;
    questions: Number;
}

const TagSchema = new Schema<ITag>({
    name : {type: String, required: true, unique: true},
    questions : {type: Number, default: 0},


}, { timestamps: true });

const Tag = models?.Tag || model<ITag>('Tag', TagSchema);

export interface ITagDoc extends ITag, Document {}

export default Tag;