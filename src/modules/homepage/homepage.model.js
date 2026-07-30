import mongoose from "mongoose";

// =====================
// Sub-schemas
// (_id: false karena tiap item nggak butuh id sendiri —
// selalu disave sekaligus sebagai satu form dari admin)
// =====================

const heroSchema = new mongoose.Schema(
    {
        badge: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        primaryCtaText: { type: String, default: "" },
        primaryCtaLink: { type: String, default: "" },
        secondaryCtaText: { type: String, default: "" },
        secondaryCtaLink: { type: String, default: "" },
        smallText: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    { _id: false }
);

const promoCardSchema = new mongoose.Schema(
    {
        label: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
        ctaText: { type: String, default: "" },
        ctaLink: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    { _id: false }
);

const collectionItemSchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        link: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    { _id: false }
);

const collectionSchema = new mongoose.Schema(
    {
        label: { type: String, default: "" },
        title: { type: String, default: "" },
        viewAllText: { type: String, default: "" },
        viewAllLink: { type: String, default: "" },
        items: { type: [collectionItemSchema], default: [] },
    },
    { _id: false }
);

const philosophySchema = new mongoose.Schema(
    {
        label: { type: String, default: "" },
        title: { type: String, default: "" },
        paragraph1: { type: String, default: "" },
        paragraph2: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    { _id: false }
);

const craftItemSchema = new mongoose.Schema(
    {
        number: { type: String, default: "" },
        title: { type: String, default: "" },
        description: { type: String, default: "" },
    },
    { _id: false }
);

const craftsmanshipSchema = new mongoose.Schema(
    {
        label: { type: String, default: "" },
        title: { type: String, default: "" },
        intro: { type: String, default: "" },
        items: { type: [craftItemSchema], default: [] },
        image: { type: String, default: "" },
    },
    { _id: false }
);

const materialStudySchema = new mongoose.Schema(
    {
        label: { type: String, default: "" },
        title: { type: String, default: "" },
        paragraph: { type: String, default: "" },
        ctaText: { type: String, default: "" },
        ctaLink: { type: String, default: "" },
        image: { type: String, default: "" },
    },
    { _id: false }
);

const gallerySchema = new mongoose.Schema(
    {
        title: { type: String, default: "" },
        images: { type: [String], default: [] },
    },
    { _id: false }
);

const testimonialSchema = new mongoose.Schema(
    {
        quote: { type: String, default: "" },
        name: { type: String, default: "" },
        location: { type: String, default: "" },
        rating: { type: Number, default: 5, min: 1, max: 5 },
    },
    { _id: false }
);

const testimonialSectionSchema = new mongoose.Schema(
    {
        label: { type: String, default: "" },
        title: { type: String, default: "" },
        testimonials: { type: [testimonialSchema], default: [] },
    },
    { _id: false }
);

const newsletterSchema = new mongoose.Schema(
    {
        label: { type: String, default: "" },
        title: { type: String, default: "" },
        buttonText: { type: String, default: "" },
        disclaimer: { type: String, default: "" },
    },
    { _id: false }
);

// =====================
// Root schema (singleton — hanya akan ada 1 dokumen)
// =====================

const homepageSchema = new mongoose.Schema(
    {
        hero: { type: heroSchema, default: () => ({}) },
        promoCards: { type: [promoCardSchema], default: [] },
        collection: { type: collectionSchema, default: () => ({}) },
        philosophy: { type: philosophySchema, default: () => ({}) },
        craftsmanship: { type: craftsmanshipSchema, default: () => ({}) },
        materialStudy: { type: materialStudySchema, default: () => ({}) },
        gallery: { type: gallerySchema, default: () => ({}) },
        testimonials: { type: testimonialSectionSchema, default: () => ({}) },
        newsletter: { type: newsletterSchema, default: () => ({}) },
    },
    { timestamps: true }
);

export default mongoose.model("Homepage", homepageSchema);
