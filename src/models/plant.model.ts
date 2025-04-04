import mongoose, { Schema } from 'mongoose';

const PlantSchema: Schema = new Schema(
  {
    sku: { type: String, required: true },
    title: { type: String, required: true },
    category: { type: mongoose.Types.ObjectId, ref: 'Category', required: true },
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

const Plant = mongoose.model("Plant", PlantSchema, "plants");

export default Plant;