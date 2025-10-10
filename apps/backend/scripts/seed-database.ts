#!/usr/bin/env bun
import 'dotenv/config';
import db from "../src/core/database"
import { 
  flowerCategories, 
  flowers, 
  arrangementSizes, 
  arrangementTemplates, 
  aiPreviewStyles,
  systemSettings 
} from "../src/core/database/schema"

async function seed() {
  console.log("🌱 Starting database seeding...")

  try {
    // Clear existing data (in reverse dependency order)
    console.log("🧹 Clearing existing data...")
    await db.delete(arrangementTemplates)
    await db.delete(flowers)
    await db.delete(flowerCategories)
    await db.delete(arrangementSizes)
    await db.delete(aiPreviewStyles)
    await db.delete(systemSettings)

    // Seed flower categories
    console.log("🌸 Seeding flower categories...")
    await db.insert(flowerCategories).values([
      {
        id: "roses",
        nameNative: "Roses",
        nameTH: "กุหลาบ",
        descriptionNative: "Classic roses in various colors",
        descriptionTH: "กุหลาบคลาสสิกในหลากหลายสี",
        sortOrder: 1,
      },
      {
        id: "lilies",
        nameNative: "Lilies",
        nameTH: "ลิลลี่",
        descriptionNative: "Elegant lilies with vibrant colors",
        descriptionTH: "ลิลลี่สง่างามด้วยสีสันสดใส",
        sortOrder: 2,
      },
      {
        id: "tulips",
        nameNative: "Tulips",
        nameTH: "ทิวลิป",
        descriptionNative: "Beautiful tulips for any occasion",
        descriptionTH: "ทิวลิปสวยงามสำหรับทุกโอกาส",
        sortOrder: 3,
      },
      {
        id: "sunflowers",
        nameNative: "Sunflowers",
        nameTH: "ทานตะวัน",
        descriptionNative: "Bright and cheerful sunflowers",
        descriptionTH: "ทานตะวันสดใสและร่าเริง",
        sortOrder: 4,
      },
      {
        id: "fillers",
        nameNative: "Fillers",
        nameTH: "ดอกไม้เติมเต็ม",
        descriptionNative: "Delicate filler flowers for texture",
        descriptionTH: "ดอกไม้เติมเต็มที่ละเอียดอ่อนเพื่อเพิ่มเนื้อสัมผัส",
        sortOrder: 5,
      },
    ])

    // Seed flowers
    console.log("🌺 Seeding flowers...")
    await db.insert(flowers).values([
      {
        id: "rose-red",
        nameNative: "Red Rose",
        nameTH: "กุหลาบแดง",
        categoryId: "roses",
        image: "/assets/images/flowers/rose-red.png",
        previewImage: "/assets/images/flowers/preview-rose.png",
        basePrice: "25.00",
        descriptionNative: "Classic red roses symbolizing love and passion. Perfect for romantic occasions.",
        descriptionTH: "กุหลาบแดงคลาสสิกที่เป็นสัญลักษณ์ของความรักและความหลงใหล เหมาะสำหรับโอกาสโรแมนติก",
        availableColors: ["#DC2626", "#F87171", "#FCA5A5", "#FECACA"],
        colorPrices: { "#DC2626": 25, "#F87171": 22, "#FCA5A5": 20, "#FECACA": 18 },
        sortOrder: 1,
      },
      {
        id: "rose-white",
        nameNative: "White Rose",
        nameTH: "กุหลาบขาว",
        categoryId: "roses",
        image: "/assets/images/flowers/rose-white.png",
        previewImage: "/assets/images/flowers/preview-rose.png",
        basePrice: "23.00",
        descriptionNative: "Elegant white roses representing purity and new beginnings.",
        descriptionTH: "กุหลาบขาวที่สง่างามแทนความบริสุทธิ์และจุดเริ่มต้นใหม่",
        availableColors: ["#FFFFFF", "#F9FAFB", "#F3F4F6", "#E5E7EB"],
        colorPrices: { "#FFFFFF": 23, "#F9FAFB": 21, "#F3F4F6": 19, "#E5E7EB": 17 },
        sortOrder: 2,
      },
      {
        id: "rose-pink",
        nameNative: "Pink Rose",
        nameTH: "กุหลาบชมพู",
        categoryId: "roses",
        image: "/assets/images/flowers/rose-pink.png",
        previewImage: "/assets/images/flowers/preview-rose.png",
        basePrice: "24.00",
        descriptionNative: "Soft pink roses conveying gratitude, appreciation, and admiration.",
        descriptionTH: "กุหลาบชมพูอ่อนที่สื่อถึงความขอบคุณ ความซาบซึ้ง และความชื่นชม",
        availableColors: ["#EC4899", "#F472B6", "#F9A8D4", "#FBCFE8"],
        colorPrices: { "#EC4899": 24, "#F472B6": 22, "#F9A8D4": 20, "#FBCFE8": 18 },
        sortOrder: 3,
      },
      {
        id: "lily-orange",
        nameNative: "Orange Lily",
        nameTH: "ลิลลี่สีส้ม",
        categoryId: "lilies",
        image: "/assets/images/flowers/lily-yellow.png",
        previewImage: "/assets/images/flowers/preview-lily.png",
        basePrice: "32.00",
        descriptionNative: "Vibrant orange lilies representing confidence and pride.",
        descriptionTH: "ลิลลี่สีส้มสดใสที่แทนความมั่นใจและความภาคภูมิใจ",
        availableColors: ["#EA580C", "#FB923C", "#FED7AA", "#FFEDD5"],
        colorPrices: { "#EA580C": 32, "#FB923C": 30, "#FED7AA": 28, "#FFEDD5": 26 },
        sortOrder: 1,
      },
      {
        id: "babys-breath",
        nameNative: "Baby's Breath",
        nameTH: "ลมหายใจทารก",
        categoryId: "fillers",
        image: "/assets/images/flowers/baby-breath-head.png",
        previewImage: "/assets/images/flowers/baby-breath.png",
        basePrice: "12.00",
        descriptionNative: "Delicate baby's breath adding texture and ethereal beauty to arrangements.",
        descriptionTH: "ลมหายใจทารกที่ละเอียดอ่อนเพิ่มเนื้อสัมผัสและความงามที่บริสุทธิ์ให้กับการจัดดอกไม้",
        availableColors: ["#FFFFFF", "#F9FAFB", "#E0E7FF", "#C7D2FE"],
        colorPrices: { "#FFFFFF": 12, "#F9FAFB": 11, "#E0E7FF": 10, "#C7D2FE": 9 },
        sortOrder: 1,
      },
      {
        id: "tulip-red",
        nameNative: "Red Tulip",
        nameTH: "ทิวลิปแดง",
        categoryId: "tulips",
        image: "/assets/images/flowers/tulip-red.png",
        previewImage: "/assets/images/flowers/preview-tulip.png",
        basePrice: "25.00",
        descriptionNative: "Vibrant red tulips symbolizing deep love and perfect happiness.",
        descriptionTH: "ทิวลิปแดงสดใสที่เป็นสัญลักษณ์ของความรักลึกซึ้งและความสุขที่สมบูรณ์แบบ",
        availableColors: ["#DC2626", "#F87171", "#FCA5A5", "#FECACA"],
        colorPrices: { "#DC2626": 25, "#F87171": 22, "#FCA5A5": 20, "#FECACA": 18 },
        sortOrder: 1,
      },
      {
        id: "tulip-yellow",
        nameNative: "Yellow Tulip",
        nameTH: "ทิวลิปเหลือง",
        categoryId: "tulips",
        image: "/assets/images/flowers/tulip-yellow.png",
        previewImage: "/assets/images/flowers/preview-tulip.png",
        basePrice: "23.00",
        descriptionNative: "Cheerful yellow tulips representing sunshine and new beginnings.",
        descriptionTH: "ทิวลิปเหลืองร่าเริงที่แทนแสงแดดและจุดเริ่มต้นใหม่",
        availableColors: ["#EAB308", "#FDE047", "#FEF08A", "#FEFCE8"],
        colorPrices: { "#EAB308": 23, "#FDE047": 21, "#FEF08A": 19, "#FEFCE8": 17 },
        sortOrder: 2,
      },
      {
        id: "tulip-purple",
        nameNative: "Purple Tulip",
        nameTH: "ทิวลิปม่วง",
        categoryId: "tulips",
        image: "/assets/images/flowers/tulip-purple.png",
        previewImage: "/assets/images/flowers/preview-tulip.png",
        basePrice: "24.00",
        descriptionNative: "Elegant purple tulips symbolizing royalty and admiration.",
        descriptionTH: "ทิวลิปม่วงสง่างามที่เป็นสัญลักษณ์ของความสูงศักดิ์และความชื่นชม",
        availableColors: ["#7C3AED", "#A855F7", "#C084FC", "#E9D5FF"],
        colorPrices: { "#7C3AED": 24, "#A855F7": 22, "#C084FC": 20, "#E9D5FF": 18 },
        sortOrder: 3,
      },
      {
        id: "sunflower",
        nameNative: "Sunflower",
        nameTH: "ทานตะวัน",
        categoryId: "sunflowers",
        image: "/assets/images/flowers/sunflower.png",
        previewImage: "/assets/images/flowers/preview-sunflower.png",
        basePrice: "28.00",
        descriptionNative: "Bright sunflowers bringing joy and positivity to any arrangement.",
        descriptionTH: "ทานตะวันสดใสที่นำความสุขและพลังบวกมาสู่การจัดดอกไม้",
        availableColors: ["#F59E0B", "#FCD34D", "#FEF3C7", "#FFFBEB"],
        colorPrices: { "#F59E0B": 28, "#FCD34D": 26, "#FEF3C7": 24, "#FFFBEB": 22 },
        sortOrder: 1,
      },
    ])

    // Seed arrangement sizes
    console.log("📏 Seeding arrangement sizes...")
    await db.insert(arrangementSizes).values([
      {
        id: "small",
        nameNative: "Small",
        nameTH: "เล็ก",
        minFlowers: 4,
        maxFlowers: 10,
        basePrice: "0.00",
        sortOrder: 1,
      },
      {
        id: "medium",
        nameNative: "Medium",
        nameTH: "กลาง",
        minFlowers: 8,
        maxFlowers: 15,
        basePrice: "0.00",
        sortOrder: 2,
      },
      {
        id: "large",
        nameNative: "Large",
        nameTH: "ใหญ่",
        minFlowers: 12,
        maxFlowers: 20,
        basePrice: "0.00",
        sortOrder: 3,
      },
    ])

    // Seed arrangement templates
    console.log("🎨 Seeding arrangement templates...")
    await db.insert(arrangementTemplates).values([
      {
        id: "romantic",
        nameNative: "Romantic",
        nameTH: "โรแมนติก",
        descriptionNative: "Classic red roses with white accents",
        descriptionTH: "กุหลาบแดงคลาสสิกพร้อมสีขาวเป็นจุดเด่น",
        previewImage: "/assets/images/templates/romantic.png",
        templateData: {
          flowers: [
            { flowerId: "rose-red", x: 200, y: 150, scale: 1.2, rotation: 0, color: "#DC2626", zIndex: 3 },
            { flowerId: "rose-red", x: 180, y: 200, scale: 1.0, rotation: 15, color: "#DC2626", zIndex: 2 },
            { flowerId: "rose-white", x: 220, y: 180, scale: 0.9, rotation: -10, color: "#FFFFFF", zIndex: 2 },
            { flowerId: "babys-breath", x: 160, y: 170, scale: 0.7, rotation: 0, color: "#FFFFFF", zIndex: 1 },
          ],
        },
        sortOrder: 1,
      },
      {
        id: "birthday",
        nameNative: "Birthday",
        nameTH: "วันเกิด",
        descriptionNative: "Bright and cheerful mixed arrangement",
        descriptionTH: "การจัดดอกไม้ผสมที่สดใสและร่าเริง",
        previewImage: "/assets/images/templates/birthday.png",
        templateData: {
          flowers: [
            { flowerId: "lily-orange", x: 190, y: 140, scale: 1.1, rotation: 0, color: "#EA580C", zIndex: 3 },
            { flowerId: "rose-pink", x: 210, y: 190, scale: 1.0, rotation: 20, color: "#EC4899", zIndex: 2 },
            { flowerId: "rose-white", x: 170, y: 180, scale: 0.9, rotation: -15, color: "#FFFFFF", zIndex: 2 },
            { flowerId: "babys-breath", x: 150, y: 160, scale: 0.8, rotation: 0, color: "#FFFFFF", zIndex: 1 },
          ],
        },
        sortOrder: 2,
      },
      {
        id: "sympathy",
        nameNative: "Sympathy",
        nameTH: "แสดงความเสียใจ",
        descriptionNative: "Elegant white and green arrangement",
        descriptionTH: "การจัดดอกไม้สีขาวและเขียวที่สง่างาม",
        previewImage: "/assets/images/templates/sympathy.png",
        templateData: {
          flowers: [
            { flowerId: "rose-white", x: 200, y: 160, scale: 1.1, rotation: 0, color: "#FFFFFF", zIndex: 3 },
            { flowerId: "rose-white", x: 180, y: 190, scale: 1.0, rotation: 10, color: "#FFFFFF", zIndex: 2 },
            { flowerId: "rose-white", x: 220, y: 180, scale: 0.9, rotation: -5, color: "#F9FAFB", zIndex: 2 },
            { flowerId: "babys-breath", x: 160, y: 170, scale: 0.8, rotation: 0, color: "#FFFFFF", zIndex: 1 },
          ],
        },
        sortOrder: 3,
      },
    ])

    // Seed AI preview styles
    console.log("🤖 Seeding AI preview styles...")
    await db.insert(aiPreviewStyles).values([
      {
        id: "realistic-1",
        nameNative: "Classic Elegance",
        nameTH: "ความสง่างามคลาสสิก",
        descriptionNative: "Traditional arrangement with soft lighting",
        descriptionTH: "การจัดดอกไม้แบบดั้งเดิมด้วยแสงไฟอ่อนนุ่ม",
        styleNative: "Photorealistic, soft natural lighting",
        styleTH: "ภาพสมจริง แสงธรรมชาติอ่อนนุ่ม",
        previewImage: "/assets/images/ai-styles/classic-elegance.png",
        promptTemplate: "Create a photorealistic image of {arrangement_description} with soft natural lighting, elegant composition, traditional style",
        sortOrder: 1,
      },
      {
        id: "realistic-2",
        nameNative: "Modern Minimalist",
        nameTH: "มินิมอลสมัยใหม่",
        descriptionNative: "Clean, contemporary styling",
        descriptionTH: "สไตล์ร่วมสมัยที่สะอาดเรียบง่าย",
        styleNative: "Clean background, modern aesthetic",
        styleTH: "พื้นหลังสะอาด สุนทรียศาสตร์สมัยใหม่",
        previewImage: "/assets/images/ai-styles/modern-minimalist.png",
        promptTemplate: "Create a modern minimalist image of {arrangement_description} with clean white background, contemporary aesthetic, sharp focus",
        sortOrder: 2,
      },
      {
        id: "realistic-3",
        nameNative: "Romantic Glow",
        nameTH: "แสงโรแมนติก",
        descriptionNative: "Warm, romantic atmosphere",
        descriptionTH: "บรรยากาศอบอุ่นและโรแมนติก",
        styleNative: "Warm golden hour lighting",
        styleTH: "แสงสีทองอบอุ่นยามเย็น",
        previewImage: "/assets/images/ai-styles/romantic-glow.png",
        promptTemplate: "Create a romantic image of {arrangement_description} with warm golden hour lighting, soft glow, intimate atmosphere",
        sortOrder: 3,
      },
      {
        id: "realistic-4",
        nameNative: "Studio Perfect",
        nameTH: "สตูดิโอสมบูรณ์แบบ",
        descriptionNative: "Professional studio photography style",
        descriptionTH: "สไตล์การถ่ายภาพสตูดิโอมืออาชีพ",
        styleNative: "Professional studio lighting",
        styleTH: "แสงไฟสตูดิโอมืออาชีพ",
        previewImage: "/assets/images/ai-styles/studio-perfect.png",
        promptTemplate: "Create a professional studio photograph of {arrangement_description} with perfect lighting, high resolution, commercial quality",
        sortOrder: 4,
      },
      {
        id: "realistic-5",
        nameNative: "Natural Beauty",
        nameTH: "ความงามธรรมชาติ",
        descriptionNative: "Outdoor natural setting",
        descriptionTH: "สภาพแวดล้อมธรรมชาติกลางแจ้ง",
        styleNative: "Natural outdoor environment",
        styleTH: "สภาพแวดล้อมธรรมชาติกลางแจ้ง",
        previewImage: "/assets/images/ai-styles/natural-beauty.png",
        promptTemplate: "Create a natural outdoor image of {arrangement_description} in beautiful garden setting, natural lighting, organic composition",
        sortOrder: 5,
      },
    ])

    // Seed system settings
    console.log("⚙️ Seeding system settings...")
    await db.insert(systemSettings).values([
      {
        id: "delivery-fees",
        settingKey: "delivery_fees",
        settingValue: {
          standard: 12,
          express: 15,
          freeDeliveryThreshold: 100
        },
        description: "Delivery fee configuration",
      },
      {
        id: "additional-services",
        settingKey: "additional_services",
        settingValue: {
          giftWrapping: 8,
          expressDelivery: 15,
          careInstructions: 0
        },
        description: "Additional service pricing",
      },
      {
        id: "business-hours",
        settingKey: "business_hours",
        settingValue: {
          monday: { open: "09:00", close: "18:00", closed: false },
          tuesday: { open: "09:00", close: "18:00", closed: false },
          wednesday: { open: "09:00", close: "18:00", closed: false },
          thursday: { open: "09:00", close: "18:00", closed: false },
          friday: { open: "09:00", close: "18:00", closed: false },
          saturday: { open: "10:00", close: "16:00", closed: false },
          sunday: { open: "10:00", close: "16:00", closed: false }
        },
        description: "Business operating hours",
      },
      {
        id: "ai-generation",
        settingKey: "ai_generation",
        settingValue: {
          enabled: true,
          maxPreviews: 5,
          generationTimeout: 30000,
          defaultStyle: "realistic-1"
        },
        description: "AI preview generation settings",
      },
    ])

    console.log("✅ Database seeded successfully!")
    console.log("📊 Seeded data:")
    console.log("   - 5 flower categories")
    console.log("   - 9 flower types")
    console.log("   - 3 arrangement sizes")
    console.log("   - 3 arrangement templates")
    console.log("   - 5 AI preview styles")
    console.log("   - 4 system settings")

  } catch (error) {
    console.error("❌ Error seeding database:", error)
    process.exit(1)
  }
}

seed()