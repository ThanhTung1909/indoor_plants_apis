import mongoose, { Schema, Document } from "mongoose";

interface IPlant extends Document {
  sku: string;
  title: string;
  category: string;
  short_description: string;
  description: string;
  characteristics: {
    scientific_name: string;
    family: string;
    origin: string;
    growth_habit: string;
    leaves: string;
    flowers: string;
    roots: string;
  };
  meaning: {
    feng_shui: string;
    placement: string;
  };
  care_instructions: {
    watering: string;
    lighting: string;
    temperature: string;
    fertilizing: string;
    cleaning: string;
  };
  images: string[];
  price: number;
  discount: string;
  specifications: {
    height: string;
    pot_size: string;
    difficulty: string;
    lighting_requirements: string;
    water_needs: string;
  };
  stock: number;
  import_date: Date;
  origin_country?: string;
}

const PlantSchema: Schema = new Schema(
  {
    sku: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    short_description: { type: String },
    description: { type: String },
    characteristics: {
      scientific_name: { type: String },
      family: { type: String },
      origin: { type: String },
      growth_habit: { type: String },
      leaves: { type: String },
      flowers: { type: String },
      roots: { type: String },
    },
    meaning: {
      feng_shui: { type: String },
      placement: { type: String },
    },
    care_instructions: {
      watering: { type: String },
      lighting: { type: String },
      temperature: { type: String },
      fertilizing: { type: String },
      cleaning: { type: String },
    },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    discount: { type: String },
    specifications: {
      height: { type: String },
      pot_size: { type: String },
      difficulty: { type: String },
      lighting_requirements: { type: String },
      water_needs: { type: String },
    },
    stock: { type: Number, required: true },
    import_date: { type: Date, default: Date.now },
    origin_country: { type: String },
    deleted: { type: Boolean, default: false },
  },

  { timestamps: true }
);

const Plant = mongoose.model<IPlant>("Plant", PlantSchema, "plants");

export default Plant;
