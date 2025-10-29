import z from "zod";

export const DateTypeSchema = z.object({
  id: z.number(),
  name_en: z.string(),
  name_ar: z.string(),
  description_en: z.string(),
  description_ar: z.string(),
  taste_profile_en: z.string(),
  taste_profile_ar: z.string(),
  sweetness_level: z.number().min(1).max(5),
  texture_en: z.string(),
  texture_ar: z.string(),
  color: z.string(),
  size_en: z.string(),
  size_ar: z.string(),
  average_price_per_kg: z.number(),
  key_features_en: z.string(),
  key_features_ar: z.string(),
  image_url: z.string().nullable(),
  is_premium: z.union([z.boolean(), z.number()]).transform(val => Boolean(val)),
  harvest_season_en: z.string().nullable(),
  harvest_season_ar: z.string().nullable(),
  origin_region_en: z.string().nullable(),
  origin_region_ar: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});

export type DateType = z.infer<typeof DateTypeSchema>;

export const PriceCalculationSchema = z.object({
  dateTypeId: z.number(),
  quantity: z.number().positive(),
  pricePerKg: z.number().positive(),
});

export type PriceCalculation = z.infer<typeof PriceCalculationSchema>;

export const RecommendationRequestSchema = z.object({
  sweetness_preference: z.number().min(1).max(5).optional(),
  texture_preference: z.enum(['soft', 'firm', 'any']).optional(),
  budget_max: z.number().positive().optional(),
  is_premium_preferred: z.boolean().optional(),
});

export type RecommendationRequest = z.infer<typeof RecommendationRequestSchema>;
