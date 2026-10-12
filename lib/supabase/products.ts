import { products as fallbackProducts, type ProductFallback } from "@/content/products";
import { resolveLocalized } from "@/lib/i18n/resolve";
import { getSupabaseClient, getTenantId } from "./client";

type ProductRow = {
  slug: string;
  name_i18n?: Record<string, string>;
  description_i18n?: Record<string, string>;
  overview_i18n?: Record<string, string>;
  features_i18n?: Record<string, string[]>;
  applications_i18n?: Record<string, string[]>;
  advantages_i18n?: Record<string, string[]>;
  image_url?: string | null;
  category?: string | null;
  model?: string | null;
  specs?: Record<string, string> | null;
  extra_data?: { category?: string; gallery?: string[]; images?: string[]; video_url?: string } | null;
  updated_at?: string;
};

export type ProductDetailData = ProductFallback & {
  overview?: string;
  features?: string[];
  advantages?: string[];
  model?: string;
  specs?: Record<string, string>;
  gallery?: string[];
  videoUrl?: string;
  updatedAt?: string;
};

export function mapProductRow(row: ProductRow, locale: string, defaultLocale = "en"): ProductDetailData {
  const extra = row.extra_data ?? {};
  return {
    slug: row.slug,
    name: resolveLocalized(row.name_i18n, locale, defaultLocale) ?? row.slug,
    description: resolveLocalized(row.description_i18n, locale, defaultLocale) ?? "",
    overview: resolveLocalized(row.overview_i18n, locale, defaultLocale) ?? "",
    features: resolveLocalized(row.features_i18n, locale, defaultLocale) ?? [],
    applications: resolveLocalized(row.applications_i18n, locale, defaultLocale) ?? [],
    advantages: resolveLocalized(row.advantages_i18n, locale, defaultLocale) ?? [],
    customization: [],
    image: row.image_url ?? "/media/products/agate-star-foil-balloon.png",
    category: row.category ?? extra.category ?? "Foil Balloons",
    model: row.model ?? "",
    specs: row.specs ?? {},
    gallery: Array.isArray(extra.gallery) ? extra.gallery : Array.isArray(extra.images) ? extra.images : [],
    videoUrl: extra.video_url ?? "",
    updatedAt: row.updated_at,
  };
}

export async function getProducts(locale: string): Promise<ProductDetailData[]> {
  const db = getSupabaseClient(), tenant = getTenantId();
  if (!db || !tenant) return fallbackProducts;
  const { data, error } = await db.from("products")
    .select("slug,name_i18n,description_i18n,overview_i18n,features_i18n,applications_i18n,advantages_i18n,image_url,category,model,specs,extra_data,updated_at")
    .eq("tenant_id", tenant).eq("is_active", true).order("sort_order");
  if (error || !data?.length) return fallbackProducts;
  return data.map(row => mapProductRow(row, locale));
}

export async function getProductBySlug(slug: string, locale: string) {
  const list = await getProducts(locale);
  return list.find(product => product.slug === slug) ?? null;
}
