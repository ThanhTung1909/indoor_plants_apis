interface PlantInput {
  sku?: string;
  title?: string;
  category?: string;
  short_description?: string;
  description?: string;
  price?: number | string;
  discount?: string;
  stock?: number | string;
  import_date?: string;
  origin_country?: string;
  images?: string[];

  characteristics?: {
    scientific_name?: string;
    family?: string;
    origin?: string;
    growth_habit?: string;
    leaves?: string;
    flowers?: string;
    roots?: string;
  };

  meaning?: {
    feng_shui?: string;
    placement?: string;
  };

  care_instructions?: {
    watering?: string;
    lighting?: string;
    temperature?: string;
    fertilizing?: string;
    cleaning?: string;
  };

  specifications?: {
    height?: string;
    pot_size?: string;
    difficulty?: string;
    lighting_requirements?: string;
    water_needs?: string;
  };
}

interface ValidationErrors {
  [key: string]: string;
}

export const validatePlant = (data: PlantInput): ValidationErrors => {
  const errors: ValidationErrors = {};

  if (!data.sku || typeof data.sku !== "string") {
    errors.sku = "SKU is required and must be a string.";
  }

  if (!data.title || typeof data.title !== "string") {
    errors.title = "Title is required and must be a string.";
  }

  if (!data.category || typeof data.category !== "string") {
    errors.category = "Category is required and must be a string.";
  }

  if (!data.price || isNaN(Number(data.price))) {
    errors.price = "Price is required and must be a number.";
  }

  if (!data.stock || isNaN(Number(data.stock))) {
    errors.stock = "Stock is required and must be a number.";
  }

  if (!data.import_date || isNaN(Date.parse(data.import_date))) {
    errors.import_date = "Import date must be a valid date.";
  }

  if (!Array.isArray(data.images) || data.images.length === 0) {
    errors.images = "At least one image is required.";
  }

  // Optional checks for nested fields
  if (data.characteristics && typeof data.characteristics !== "object") {
    errors.characteristics = "Characteristics must be an object.";
  }

  if (data.specifications && typeof data.specifications !== "object") {
    errors.specifications = "Specifications must be an object.";
  }

  return errors;
};
