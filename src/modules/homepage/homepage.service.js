import Homepage from "./homepage.model.js";

// =====================
// Helper: kumpulkan semua URL gambar dari satu dokumen homepage
// (dipakai untuk diff gambar lama vs baru saat update)
// =====================

const collectImages = (doc = {}) => {

    const images = [];

    if (doc.hero?.image) images.push(doc.hero.image);

    (doc.promoCards || []).forEach((card) => {
        if (card?.image) images.push(card.image);
    });

    (doc.collection?.items || []).forEach((item) => {
        if (item?.image) images.push(item.image);
    });

    if (doc.philosophy?.image) images.push(doc.philosophy.image);

    if (doc.craftsmanship?.image) images.push(doc.craftsmanship.image);

    if (doc.materialStudy?.image) images.push(doc.materialStudy.image);

    (doc.gallery?.images || []).forEach((url) => {
        if (url) images.push(url);
    });

    return images;

};

// =====================
// GET (public & admin sama-sama singleton, nggak ada filter khusus)
//
// Kalau belum pernah ada yang disave, findOne() balikin null.
// Daripada balikin null (yang bikin frontend nerima shape yang salah
// gara-gara `json?.data ?? json` fallback di api.ts), kita balikin
// dokumen kosong dengan default dari schema (nggak disave ke DB,
// cuma dibentuk in-memory) — supaya frontend selalu dapet struktur
// yang valid dari hari pertama, sebelum admin sempat nge-save apa pun.
// =====================

const getContent = async () => {

    const doc = await Homepage.findOne({});

    if (doc) return doc;

    return new Homepage({});

};

const getPublic = async () => {

    return await getContent();

};

const getAdmin = async () => {

    return await getContent();

};

// =====================
// UPDATE (upsert — kalau belum ada dokumen, otomatis dibuat)
// =====================

const update = async (content) => {

    const existing = await Homepage.findOne({});

    const oldImages = existing
        ? collectImages(existing.toObject())
        : [];

    const updated = await Homepage.findOneAndUpdate(
        {},
        content,
        {
            new: true,
            upsert: true,
            runValidators: true,
            setDefaultsOnInsert: true,
        }
    );

    const newImages = collectImages(updated.toObject());

    const removedImages = oldImages.filter(
        (url) => url && !newImages.includes(url)
    );

    return {
        homepage: updated,
        removedImages,
    };

};

export default {
    getPublic,
    getAdmin,
    update,
};