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
  stock_quantity: number;
  import_date: Date;
  origin_country?: string;
}

const PlantSchema: Schema = new Schema(
  {
    sku: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: String, required: true },
    short_description: { type: String, required: true },
    description: { type: String, required: true },
    characteristics: {
      scientific_name: { type: String, required: true },
      family: { type: String, required: true },
      origin: { type: String, required: true },
      growth_habit: { type: String, required: true },
      leaves: { type: String, required: true },
      flowers: { type: String, required: true },
      roots: { type: String, required: true },
    },
    meaning: {
      feng_shui: { type: String, required: true },
      placement: { type: String, required: true },
    },
    care_instructions: {
      watering: { type: String, required: true },
      lighting: { type: String, required: true },
      temperature: { type: String, required: true },
      fertilizing: { type: String, required: true },
      cleaning: { type: String, required: true },
    },
    images: { type: [String], required: true },
    price: { type: Number, required: true },
    discount: { type: String, required: true },
    specifications: {
      height: { type: String, required: true },
      pot_size: { type: String, required: true },
      difficulty: { type: String, required: true },
      lighting_requirements: { type: String, required: true },
      water_needs: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Plant = mongoose.model<IPlant>("Plant", PlantSchema, "plants");

export default Plant;
