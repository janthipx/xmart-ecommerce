/**
 * X MART - Product Images & Placeholder Configuration
 * 
 * โมดูลจัดการรูปภาพสินค้าแยกส่วนจากข้อมูลสินค้าหลัก (Separated Image Layer)
 * 
 * วัตถุประสงค์:
 * 1. ปัจจุบันใช้ Placeholder Image คุณภาพสูงแยกตามหมวดหมู่
 * 2. รองรับการเปลี่ยนเป็นรูปสินค้าจริงในภายหลังได้อย่างสะดวก โดยไม่ต้องแก้โครงสร้างข้อมูลหลักใน products.ts
 * 3. สามารถจับคู่รูปจริงผ่าน Product ID หรือ SKU ได้โดยตรง
 */

// แมป Placeholder Image แยกตามหมวดหมู่สินค้า
export const categoryPlaceholderMap: Record<string, string> = {
    'cat1': '/placeholders/food.svg',         // อาหาร
    'cat2': '/placeholders/drinks.svg',       // เครื่องดื่ม
    'cat3': '/placeholders/snacks.svg',       // ขนม
    'cat4': '/placeholders/personal.svg',     // ของใช้ส่วนตัว
    'cat5': '/placeholders/home.svg',         // ของใช้ในบ้าน
    'cat6': '/placeholders/electronics.svg',  // เครื่องใช้ไฟฟ้า & ไอที
    'cat7': '/placeholders/fashion.svg',      // แฟชั่น
    'cat8': '/placeholders/beauty.svg',       // สุขภาพและความงาม
    'cat9': '/placeholders/baby.svg',         // แม่และเด็ก
    'cat10': '/placeholders/stationery.svg',  // เครื่องเขียนและสำนักงาน
    'cat11': '/placeholders/auto.svg',        // ยานยนต์
    'cat12': '/placeholders/pets.svg',        // สัตว์เลี้ยง
    'cat13': '/placeholders/sports.svg',      // กีฬาและกิจกรรมกลางแจ้ง
    'cat14': '/placeholders/garden.svg',      // บ้านและสวน
};

export const DEFAULT_PLACEHOLDER = '/placeholders/default.svg';

/**
 * กำหนด Path หรือ URL ของรูปภาพสินค้าจริงที่นี่
 * เมื่อต้องการนำรูปสินค้าจริงมาใส่ สามารถใส่ในตารางนี้ตาม ID หรือ SKU
 * ตัวอย่าง:
 *   'p1': '/images/products/mama-tomyum.jpg',
 *   'XM-FOOD-0001': '/images/products/mama-tomyum.jpg',
 */
export const realProductImages: Record<string, string> = {
    // ══════════════════════════════════════════════════════════════════════════
    // 1. อาหาร (cat1) - 16 รายการรูปภาพสินค้าจริง
    // ══════════════════════════════════════════════════════════════════════════
    'p1': '/images/products/mama-tomyum-55g.jpg',
    'p2': '/images/products/mama-minced-pork-55g.jpg',
    'p3': '/images/products/hongthong-jasmine-rice-5kg.jpg',
    'p4': '/images/products/cp-fresh-eggs-pack10.webp',
    'p5': '/images/products/tiparos-fish-sauce-700ml.jpg',
    'p22': '/images/products/pantai-suki-sauce-330g.jpg',
    'p23': '/images/products/mitrphol-white-sugar-1kg.jpg',
    'p-food-008': '/images/products/sam-mae-krua-sardines-155g.webp',
    'p-food-009': '/images/products/angoon-soybean-oil-1l.jpg',
    'p-food-010': '/images/products/mae-krua-oyster-sauce-600ml.jpg',
    'p-food-011': '/images/products/knorr-cup-jok-pork-35g.jpg',
    'p-food-012': '/images/products/sriraja-panich-chilli-sauce-230g.jpg',
    'p-food-013': '/images/products/deksomboon-mushroom-soy-sauce-600ml.jpg',
    'p-food-014': '/images/products/tonson-vermicelli-100g.jpg',
    'p-food-015': '/images/products/select-tuna-steak-mineral-water-165g.jpg',
    'p-food-016': '/images/products/prungthip-iodized-salt-500g.webp',

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดอาหาร
    'XM-FOOD-0001': '/images/products/mama-tomyum-55g.jpg',
    'XM-FOOD-0002': '/images/products/mama-minced-pork-55g.jpg',
    'XM-FOOD-0003': '/images/products/hongthong-jasmine-rice-5kg.jpg',
    'XM-FOOD-0004': '/images/products/cp-fresh-eggs-pack10.webp',
    'XM-FOOD-0005': '/images/products/tiparos-fish-sauce-700ml.jpg',
    'XM-FOOD-0006': '/images/products/pantai-suki-sauce-330g.jpg',
    'XM-FOOD-0007': '/images/products/mitrphol-white-sugar-1kg.jpg',
    'XM-FOOD-0008': '/images/products/sam-mae-krua-sardines-155g.webp',
    'XM-FOOD-0009': '/images/products/angoon-soybean-oil-1l.jpg',
    'XM-FOOD-0010': '/images/products/mae-krua-oyster-sauce-600ml.jpg',
    'XM-FOOD-0011': '/images/products/knorr-cup-jok-pork-35g.jpg',
    'XM-FOOD-0012': '/images/products/sriraja-panich-chilli-sauce-230g.jpg',
    'XM-FOOD-0013': '/images/products/deksomboon-mushroom-soy-sauce-600ml.jpg',
    'XM-FOOD-0014': '/images/products/tonson-vermicelli-100g.jpg',
    'XM-FOOD-0015': '/images/products/select-tuna-steak-mineral-water-165g.jpg',
    'XM-FOOD-0016': '/images/products/prungthip-iodized-salt-500g.webp',

    // ══════════════════════════════════════════════════════════════════════════
    // 2. เครื่องดื่ม (cat2) - รายการรูปภาพสินค้าจริง (Beverages 18 รายการครบถ้วน)
    // ══════════════════════════════════════════════════════════════════════════
    'p-drink-1': '/images/products/crystal_water_600ml.jpg',          // น้ำดื่มคริสตัล 600 มล.
    'p-drink-2': '/images/products/coke_325ml.jpg',                   // โค้ก ออริจินัล 325 มล.
    'p-drink-3': '/images/products/pepsi_325ml.jpg',                  // เป๊ปซี่ ออริจินัล 325 มล.
    'p-drink-4': '/images/products/ichitan_tea_500ml.jpg',            // อิชิตัน ชาเขียว รสต้นตำรับ 500 มล.
    'p-drink-5': '/images/products/uht_milk_180ml.jpg',               // นมจืดไทยเดนมาร์ค UHT 180 มล.
    'p-drink-6': '/images/products/nescafe_3in1.jpg',                 // เนสกาแฟ เบลนด์ แอนด์ บรู ริช อโรมา (แพ็ค 27 ซอง)
    'p-drink-7': '/images/products/redbull_250ml.jpg',                // เรดบูล เอเนอร์จี้ดริงก์ 250 มล.
    'p-drink-8': '/images/products/pasteurized_milk_400ml.jpg',       // นมพาสเจอร์ไรส์ ดัชมิลล์ ซีเล็คเต็ด รสจืด 400 มล.
    'p6': '/images/products/singha-water-1500ml-pack6.jpg',           // น้ำดื่มสิงห์ 1.5 ลิตร (แพ็ค 6 ขวด)
    'p7': '/images/products/khao-shong-condensed-milk-coffee-25sachets.jpg', // กาแฟปรุงสำเร็จ เขาช่อง คอนเดนซ์มิลค์ (แพ็ค 25 ซอง)
    'p8': '/images/products/foremost-chocolate-milk-225ml-pack6.jpg', // นมโฟร์โมสต์ รสช็อกโกแลต 225 มล. (แพ็ค 6 กล่อง)
    'p-drink-012': '/images/products/vitamilk-to-go-original-300ml.jpg', // นมถั่วเหลือง ไวตามิ้ลค์ ทูโก ออริจินัล 300 มล.
    'p-drink-013': '/images/products/m150-energy-drink-150ml.jpg',    // เครื่องดื่มชูกำลัง M-150 ขนาด 150 มล.
    'p-drink-014': '/images/products/minere-natural-mineral-water-500ml.jpg', // น้ำแร่ธรรมชาติ มิเนเร่ 500 มล.
    'p-drink-015': '/images/products/oishi-green-tea-genmaicha-500ml.jpg', // ชาเขียว โออิชิ รสข้าวญี่ปุ่น 500 มล.
    'p-drink-016': '/images/products/ovaltine-3in1-5sachets.jpg',     // เครื่องดื่มมอลต์สกัด โอวัลติน 3in1 (แพ็ค 5 ซอง)
    'p-drink-017': '/images/products/brands-chicken-essence-original-42ml.jpg', // แบรนด์ ซุปไก่สกัด สูตรต้นตำรับ 42 มล.
    'p-drink-018': '/images/products/birdy-robusta-180ml.jpg',        // กาแฟกระป๋องพร้อมดื่ม เบอร์ดี้ โรบัสต้า 180 มล.

    // แมปเพิ่มเติมด้วย SKU เพื่อรองรับการอ้างอิงผ่าน SKU
    'XM-DRINK-0001': '/images/products/crystal_water_600ml.jpg',
    'XM-DRINK-0002': '/images/products/coke_325ml.jpg',
    'XM-DRINK-0003': '/images/products/pepsi_325ml.jpg',
    'XM-DRINK-0004': '/images/products/ichitan_tea_500ml.jpg',
    'XM-DRINK-0005': '/images/products/uht_milk_180ml.jpg',
    'XM-DRINK-0006': '/images/products/nescafe_3in1.jpg',
    'XM-DRINK-0007': '/images/products/redbull_250ml.jpg',
    'XM-DRINK-0008': '/images/products/pasteurized_milk_400ml.jpg',
    'XM-DRINK-0009': '/images/products/singha-water-1500ml-pack6.jpg',
    'XM-DRINK-0010': '/images/products/khao-shong-condensed-milk-coffee-25sachets.jpg',
    'XM-DRINK-0011': '/images/products/foremost-chocolate-milk-225ml-pack6.jpg',
    'XM-DRINK-0012': '/images/products/vitamilk-to-go-original-300ml.jpg',
    'XM-DRINK-0013': '/images/products/m150-energy-drink-150ml.jpg',
    'XM-DRINK-0014': '/images/products/minere-natural-mineral-water-500ml.jpg',
    'XM-DRINK-0015': '/images/products/oishi-green-tea-genmaicha-500ml.jpg',
    'XM-DRINK-0016': '/images/products/ovaltine-3in1-5sachets.jpg',
    'XM-DRINK-0017': '/images/products/brands-chicken-essence-original-42ml.jpg',
    'XM-DRINK-0018': '/images/products/birdy-robusta-180ml.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 3. ขนม (cat3) - รายการรูปภาพสินค้าจริงที่มีไฟล์พร้อมใช้งาน (ครบ 15 รายการ)
    // ══════════════════════════════════════════════════════════════════════════
    'p11': '/images/products/lays-classic-50g.jpg',                   // เลย์ มันฝรั่งทอดกรอบ รสคลาสสิค 50g
    'p12': '/images/products/oreo-vanilla-133g.jpg',                  // โอรีโอ คุกกี้แซนวิช รสวานิลลา 133g
    'p13': '/images/products/euro-custard-cake-6pcs.jpg',             // ยูโร่เค้ก พัฟเค้กสอดไส้ครีมคัสตาร์ด กล่อง 6 ชิ้น
    'p14': '/images/products/kitkat-chocolate-35g.jpg',               // ช็อกโกแลต คิทแคท 4 ฟิงเกอร์ 35g
    'p-snack-005': '/images/products/glico-pocky-chocolate-45g.jpg',   // กูลิโกะ ป๊อกกี้ บิสกิตแท่งเคลือบช็อกโกแลต 45g
    'p-snack-006': '/images/products/bento-squid-snack-20g.jpg',      // เบนโตะ ปลาหมึกอบทรงเครื่อง รสเผ็ดจัด 20g
    'p-snack-007': '/images/products/taro-fish-snack-50g.jpg',        // ทาโร่ ปลาสวรรค์ รสเข้มข้น 52g
    'p-snack-008': '/images/products/hanami-original-60g.jpg',        // ฮานามิ ข้าวเกรียบรวยเพื่อน รสดั้งเดิม 60g
    'p-snack-009': '/images/products/tawan-shrimp-crackers-56g.jpg',    // ตะวัน ข้าวเกรียบ รสกุ้งกรอบ 56g
    'p-snack-010': '/images/products/glico-collon-vanilla-47g.jpg',     // กูลิโกะ โคลอน บิสกิตสอดไส้ครีมวานิลลา 47g
    'p-snack-011': '/images/products/manora-taro-shrimp-chips-80g.jpg', // มโนห์รา ข้าวเกรียบเผือกกุ้ง 100g
    'p-snack-012': '/images/products/tong-garden-salted-cashews-40g.jpg', // เม็ดมะม่วงหิมพานต์อบเกลือ ทองการ์เด้น 40g
    'p-snack-013': '/images/products/taokaenoi-spicy-seaweed-30g.jpg', // สาหร่ายทอดกรอบ เถ้าแก่น้อย รสคลาสสิค 32g
    'p-snack-014': '/images/products/halls-mentho-lyptus-8pcs.jpg',   // ลูกอม ฮอลล์ รสไอซ์ซี่สตรอเบอร์รี่ แผง 8 เม็ด
    'p-snack-015': '/images/products/bissin-cocoa-wafers-100g.jpg',    // บิสชิน เวเฟอร์สอดไส้ครีมโกโก้ 100g

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดขนม
    'XM-SNACK-0001': '/images/products/lays-classic-50g.jpg',
    'XM-SNACK-0002': '/images/products/oreo-vanilla-133g.jpg',
    'XM-SNACK-0003': '/images/products/euro-custard-cake-6pcs.jpg',
    'XM-SNACK-0004': '/images/products/kitkat-chocolate-35g.jpg',
    'XM-SNACK-0005': '/images/products/glico-pocky-chocolate-45g.jpg',
    'XM-SNACK-0006': '/images/products/bento-squid-snack-20g.jpg',
    'XM-SNACK-0007': '/images/products/taro-fish-snack-50g.jpg',
    'XM-SNACK-0008': '/images/products/hanami-original-60g.jpg',
    'XM-SNACK-0009': '/images/products/tawan-shrimp-crackers-56g.jpg',
    'XM-SNACK-0010': '/images/products/glico-collon-vanilla-47g.jpg',
    'XM-SNACK-0011': '/images/products/manora-taro-shrimp-chips-80g.jpg',
    'XM-SNACK-0012': '/images/products/tong-garden-salted-cashews-40g.jpg',
    'XM-SNACK-0013': '/images/products/taokaenoi-spicy-seaweed-30g.jpg',
    'XM-SNACK-0014': '/images/products/halls-mentho-lyptus-8pcs.jpg',
    'XM-SNACK-0015': '/images/products/bissin-cocoa-wafers-100g.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 4. ของใช้ส่วนตัว (cat4) - รายการรูปภาพสินค้าจริง (Personal Care 15 รายการครบถ้วน)
    // ══════════════════════════════════════════════════════════════════════════
    'p15': '/images/products/protex-propolis-soap-65g.jpg',                      // สบู่ก้อน โพรเทคส์ สูตรพรอพโพลิส 65g
    'p16': '/images/products/pantene-pro-v-daily-moisture-shampoo-410ml.jpg',    // แชมพู แพนทีน โปร-วี เดลี่ มอยซ์เจอร์ 410 มล.
    'p17': '/images/products/colgate-total-pro-clean-toothpaste-150g.jpg',       // ยาสีฟัน คอลเกต โททอล โปร คลีน 150g
    'p-care-004': '/images/products/parrot-botanical-bar-soap-105g.jpg',         // สบู่ก้อน พฤกษานกแก้ว กลิ่นพฤกษานานาพรรณ 105g
    'p-care-005': '/images/products/shokubutsu-monogatari-shower-cream-500ml.jpg', // ครีมอาบน้ำ โชกุบุสซึ โมโนกาตาริ สูตรผิวเนียนนุ่ม 500 มล.
    'p-care-006': '/images/products/head-shoulders-cool-menthol-shampoo-410ml.jpg', // แชมพู เฮด แอนด์ โชว์เดอร์ สูตรคูลเมนทอล 410 มล.
    'p-care-007': '/images/products/sunsilk-smooth-manageable-conditioner-380ml.jpg', // ครีมนวดผม ซันซิล สมูท แอนด์ เมเนจเจเบิ้ล 380 มล.
    'p-care-008': '/images/products/oral-b-crossaction-toothbrush.jpg',           // แปรงสีฟัน ออรัลบี ครอสแอคชั่น แอนตี้แบคทีเรีย
    'p-care-009': '/images/products/sensodyne-fresh-mint-toothpaste-100g.jpg',   // ยาสีฟัน เซ็นโซดายน์ เฟรช มินต์ ป้องกันเสียวฟัน 100g
    'p-care-010': '/images/products/vaseline-healthy-bright-uv-extra-lotion-400ml.jpg', // โลชั่นบำรุงผิว วาสลีน เฮลธี้ ไบรท์ ยูวี เอ็กซ์ตร้า 400 มล.
    'p-care-011': '/images/products/rexona-advanced-brightening-rollon-50ml.jpg', // โรลออนระงับกลิ่นกาย เรโซนา แอดวานซ์ ไบรท์เทนนิ่ง 50 มล.
    'p-care-012': '/images/products/garnier-bright-complete-facial-foam-100ml.jpg', // โฟมล้างหน้า การ์นิเย่ สกิน แนทเชอรัลส์ ไบรท์ คอมพลีท 100 มล.
    'p-care-013': '/images/products/bhaesaj-cooling-powder-madame-100g.jpg',      // แป้งเย็น เภสัช กลิ่นมาดาม 100g
    'p-care-014': '/images/products/gillette-blue3-comfort-3pcs.jpg',            // มีดโกนหนวด ยิลเลตต์ บลู 3 คอมฟอร์ต (แพ็ค 3 ด้าม)
    'p-care-015': '/images/products/listerine-cool-mint-500ml.jpg',              // น้ำยาบ้วนปาก ลิสเตอรีน คูลมินต์ 500 มล.

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดของใช้ส่วนตัว
    'XM-CARE-0001': '/images/products/protex-propolis-soap-65g.jpg',
    'XM-CARE-0002': '/images/products/pantene-pro-v-daily-moisture-shampoo-410ml.jpg',
    'XM-CARE-0003': '/images/products/colgate-total-pro-clean-toothpaste-150g.jpg',
    'XM-CARE-0004': '/images/products/parrot-botanical-bar-soap-105g.jpg',
    'XM-CARE-0005': '/images/products/shokubutsu-monogatari-shower-cream-500ml.jpg',
    'XM-CARE-0006': '/images/products/head-shoulders-cool-menthol-shampoo-410ml.jpg',
    'XM-CARE-0007': '/images/products/sunsilk-smooth-manageable-conditioner-380ml.jpg',
    'XM-CARE-0008': '/images/products/oral-b-crossaction-toothbrush.jpg',
    'XM-CARE-0009': '/images/products/sensodyne-fresh-mint-toothpaste-100g.jpg',
    'XM-CARE-0010': '/images/products/vaseline-healthy-bright-uv-extra-lotion-400ml.jpg',
    'XM-CARE-0011': '/images/products/rexona-advanced-brightening-rollon-50ml.jpg',
    'XM-CARE-0012': '/images/products/garnier-bright-complete-facial-foam-100ml.jpg',
    'XM-CARE-0013': '/images/products/bhaesaj-cooling-powder-madame-100g.jpg',
    'XM-CARE-0014': '/images/products/gillette-blue3-comfort-3pcs.jpg',
    'XM-CARE-0015': '/images/products/listerine-cool-mint-500ml.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 5. ของใช้ในบ้าน (cat5) - รายการรูปภาพสินค้าจริง (Home Use 15 รายการ)
    // ══════════════════════════════════════════════════════════════════════════
    'p18': '/images/products/attack-easy-soft-detergent-1800g.jpg',              // ผงซักฟอก แอทแทค อีซี่ ซอฟท์ 1800g
    'p19': '/images/products/sunlight-lemon-turbo-dishwashing-750ml.jpg',        // น้ำยาล้างจาน ซันไลต์ เลมอนเทอร์โบ 750 มล.
    'p20': '/images/products/scott-extra-care-tissue-6rolls.jpg',                // กระดาษทิชชูม้วน สก๊อตต์ เอ็กซ์ตร้า แคร์ (แพ็ค 6 ม้วน)
    'p21': '/images/products/medimask-surgical-mask-50pcs.jpg',                  // หน้ากากอนามัย Medimask 3 ชั้น 50 ชิ้น
    'p-home-005': '/images/products/downy-premium-perfume-mystique-500ml.jpg',   // น้ำยาปรับผ้านุ่ม ดาวน์นี่ พรีเมียม เพอร์ฟูม มิสทีค 500 มล.
    'p-home-006': '/images/products/breeze-excel-liquid-detergent-700ml.jpg',    // น้ำยาซักผ้าสูตรเข้มข้น บรีส เอกเซล ลิควิด 700 มล.
    'p-home-007': '/images/products/duck-pro-toilet-cleaner-900ml.jpg',          // น้ำยาล้างห้องน้ำ เป็ดโปร สูตรเข้มข้น 900 มล.
    'p-home-008': '/images/products/champion-trash-bags-roll-size-l.jpg',        // ถุงขยะดำแบบม้วน แชมเปี้ยน ไซส์ L 30x40 นิ้ว (12 ใบ)
    'p-home-009': '/images/products/scotch-brite-antibacterial-sponge-3pcs.jpg', // ฟองน้ำใยขัด 3M สก๊อตช์-ไบรต์ แอนตี้แบคทีเรีย (แพ็ค 3 ชิ้น)
    'p-home-010': '/images/products/kleenex-antibacterial-wet-wipes-20sheets.jpg', // ทิชชูเปียก คลีเน็กซ์ สูตรแอนตี้แบคทีเรีย (20 แผ่น)
    'p-home-011': '/images/products/scotch-brite-microfiber-mop-360.jpg',        // ไม้ถูพื้นไมโครไฟเบอร์ 3M Scotch-Brite หมุนได้ 360 องศา
    'p-home-012': '/images/products/baygon-odorless-insecticide-spray-600ml.jpg', // สเปรย์กำจัดยุงและแมลง ไบกอน สูตรไร้กลิ่น 600 มล.
    'p-home-013': '/images/products/superlock-food-container-850ml.jpg',         // กล่องถนอมอาหาร ซูเปอร์ล็อก Super Lock 850 มล.
    'p-home-014': '/images/products/kiwi-kitchen-knife-7inch.jpg',               // มีดทำครัวสแตนเลส ตรากีวี Kiwi ปลายแหลม 7 นิ้ว
    'p-home-015': '/images/products/magiclean-dust-cleaner-spray-400ml.jpg',      // น้ำยาดันฝุ่นและเคลือบเงา มาจิคลีน สเปรย์ 400 มล.

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดของใช้ในบ้าน
    'XM-HOME-0001': '/images/products/attack-easy-soft-detergent-1800g.jpg',
    'XM-HOME-0002': '/images/products/sunlight-lemon-turbo-dishwashing-750ml.jpg',
    'XM-HOME-0003': '/images/products/scott-extra-care-tissue-6rolls.jpg',
    'XM-HOME-0004': '/images/products/medimask-surgical-mask-50pcs.jpg',
    'XM-HOME-0005': '/images/products/downy-premium-perfume-mystique-500ml.jpg',
    'XM-HOME-0006': '/images/products/breeze-excel-liquid-detergent-700ml.jpg',
    'XM-HOME-0007': '/images/products/duck-pro-toilet-cleaner-900ml.jpg',
    'XM-HOME-0008': '/images/products/champion-trash-bags-roll-size-l.jpg',
    'XM-HOME-0009': '/images/products/scotch-brite-antibacterial-sponge-3pcs.jpg',
    'XM-HOME-0010': '/images/products/kleenex-antibacterial-wet-wipes-20sheets.jpg',
    'XM-HOME-0011': '/images/products/scotch-brite-microfiber-mop-360.jpg',
    'XM-HOME-0012': '/images/products/baygon-odorless-insecticide-spray-600ml.jpg',
    'XM-HOME-0013': '/images/products/superlock-food-container-850ml.jpg',
    'XM-HOME-0014': '/images/products/kiwi-kitchen-knife-7inch.jpg',
    'XM-HOME-0015': '/images/products/magiclean-dust-cleaner-spray-400ml.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 6. เครื่องใช้ไฟฟ้า & ไอที (cat6) - รายการรูปภาพสินค้าจริง (Electronics 18 รายการครบถ้วน)
    // ══════════════════════════════════════════════════════════════════════════
    'p-elec-001': '/images/products/iphone-16-128gb-black.jpg',                 // สมาร์ทโฟน Apple iPhone 16 128GB สีดำ
    'p-elec-002': '/images/products/samsung-galaxy-s24-256gb-onyx-black.jpg',   // สมาร์ทโฟน Samsung Galaxy S24 256GB Onyx Black
    'p-elec-003': '/images/products/ipad-10th-gen-64gb-silver.jpg',             // แท็บเล็ต Apple iPad 10th Gen 64GB Wi-Fi สีเงิน
    'p-elec-004': '/images/products/airpods-pro-2-magsafe-usbc.jpg',            // หูฟังไร้สาย Apple AirPods Pro (รุ่นที่ 2) MagSafe Case
    'p-elec-005': '/images/products/marshall-emberton-ii-black-brass.jpg',      // ลำโพงบลูทูธพกพา Marshall Emberton II Black & Brass
    'p-elec-006': '/images/products/logitech-mx-master-3s-graphite.jpg',        // เมาส์ไร้สายเพื่อสุขภาพ Logitech MX Master 3S Graphite
    'p-elec-007': '/images/products/logitech-k380-multi-device.jpg',            // คีย์บอร์ดไร้สายบลูทูธ Logitech K380 Multi-Device
    'p-elec-008': '/images/products/anker-powercore-20000mah-pd-20w.jpg',       // แบตเตอรี่สำรอง Anker PowerCore 20,000mAh PD 20W
    'p-elec-009': '/images/products/baseus-gan5-pro-65w-3port.jpg',             // หัวชาร์จเร็ว Baseus GaN5 Pro 65W Fast Charger (3 พอร์ต)
    'p-elec-010': '/images/products/ugreen-usbc-to-usbc-100w-1m.jpg',           // สายชาร์จเร็ว Ugreen USB-C to USB-C 100W ถักไนลอน 1M
    'p-elec-011': '/images/products/jbl-go-3-black.jpg',                        // ลำโพงพกพาบลูทูธกันน้ำ JBL GO 3 สีดำ
    'p-elec-012': '/images/products/sandisk-ultra-dual-drive-go-128gb.jpg',      // แฟลชไดร์ฟ SanDisk Ultra Dual Drive Go Type-C 128GB
    'p-elec-013': '/images/products/sony-wh-1000xm5-black.jpg',                 // หูฟังครอบหูตัดเสียงรบกวน Sony WH-1000XM5 Black
    'p-elec-014': '/images/products/apple-20w-usbc-power-adapter.jpg',          // อะแดปเตอร์ชาร์จแท้ Apple 20W USB-C Power Adapter
    'p-elec-015': '/images/products/xiaomi-pad-6-128gb-gravity-gray.jpg',       // แท็บเล็ต Xiaomi Pad 6 128GB Wi-Fi Gravity Gray
    'p-elec-016': '/images/products/eloop-e29-30000mah.jpg',                    // แบตเตอรี่สำรอง Eloop E29 ความจุ 30,000mAh Quick Charge
    'p-elec-017': '/images/products/razer-viper-v2-pro-black.jpg',              // เมาส์เกมมิ่งไร้สายน้ำหนักเบา Razer Viper V2 Pro Black
    'p-elec-018': '/images/products/xiaomi-smart-air-purifier-4.jpg',           // เครื่องฟอกอากาศอัจฉริยะ Xiaomi Smart Air Purifier 4

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดเครื่องใช้ไฟฟ้า
    'XM-ELEC-0001': '/images/products/iphone-16-128gb-black.jpg',
    'XM-ELEC-0002': '/images/products/samsung-galaxy-s24-256gb-onyx-black.jpg',
    'XM-ELEC-0003': '/images/products/ipad-10th-gen-64gb-silver.jpg',
    'XM-ELEC-0004': '/images/products/airpods-pro-2-magsafe-usbc.jpg',
    'XM-ELEC-0005': '/images/products/marshall-emberton-ii-black-brass.jpg',
    'XM-ELEC-0006': '/images/products/logitech-mx-master-3s-graphite.jpg',
    'XM-ELEC-0007': '/images/products/logitech-k380-multi-device.jpg',
    'XM-ELEC-0008': '/images/products/anker-powercore-20000mah-pd-20w.jpg',
    'XM-ELEC-0009': '/images/products/baseus-gan5-pro-65w-3port.jpg',
    'XM-ELEC-0010': '/images/products/ugreen-usbc-to-usbc-100w-1m.jpg',
    'XM-ELEC-0011': '/images/products/jbl-go-3-black.jpg',
    'XM-ELEC-0012': '/images/products/sandisk-ultra-dual-drive-go-128gb.jpg',
    'XM-ELEC-0013': '/images/products/sony-wh-1000xm5-black.jpg',
    'XM-ELEC-0014': '/images/products/apple-20w-usbc-power-adapter.jpg',
    'XM-ELEC-0015': '/images/products/xiaomi-pad-6-128gb-gravity-gray.jpg',
    'XM-ELEC-0016': '/images/products/eloop-e29-30000mah.jpg',
    'XM-ELEC-0017': '/images/products/razer-viper-v2-pro-black.jpg',
    'XM-ELEC-0018': '/images/products/xiaomi-smart-air-purifier-4.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 7. แฟชั่น (cat7) - รายการรูปภาพสินค้าจริง (Fashion 15 รายการครบถ้วน)
    // ══════════════════════════════════════════════════════════════════════════
    'p-fash-001': '/images/products/uniqlo-supima-cotton-tshirt.jpg',           // เสื้อยืดคอกลมผ้าคอตตอนพรีเมียม Uniqlo Supima Cotton
    'p-fash-002': '/images/products/nike-air-force-1-07-white.jpg',             // รองเท้าผ้าใบ Nike Air Force 1 '07 All White
    'p-fash-003': '/images/products/adidas-samba-og-white-black.jpg',           // รองเท้าผ้าใบ Adidas Samba OG White/Core Black
    'p-fash-004': '/images/products/levis-501-original-fit-jeans.jpg',          // กางเกงยีนส์ขายาว Levi's 501 Original Fit สีน้ำเงินเข้ม
    'p-fash-005': '/images/products/gq-white-shirt-slim-fit.jpg',               // เสื้อเชิ้ตขาวกันเปื้อน GQ White Shirt ทรง Slim Fit
    'p-fash-006': '/images/products/lacoste-classic-fit-l1212-polo.jpg',         // เสื้อโปโลคลาสสิก Lacoste Classic Fit L1212
    'p-fash-007': '/images/products/uniqlo-round-mini-shoulder-bag.jpg',        // กระเป๋าสะพายข้างทรงกลม Uniqlo Round Mini Shoulder Bag
    'p-fash-008': '/images/products/new-era-9forty-ny-yankees-black.jpg',       // หมวกแก๊ปเบสบอล New Era 9FORTY New York Yankees Black
    'p-fash-009': '/images/products/birkenstock-arizona-birko-flor.jpg',        // รองเท้าแตะสุขภาพ Birkenstock Arizona Birko-Flor
    'p-fash-010': '/images/products/anello-classic-backpack-canvas.jpg',        // กระเป๋าเป้สะพายหลัง Anello Classic Backpack Canvas
    'p-fash-011': '/images/products/nike-everyday-cushion-socks-3pairs.jpg',    // ถุงเท้าข้อสั้นกีฬา Nike Everyday Cushion (แพ็ค 3 คู่)
    'p-fash-012': '/images/products/hm-relaxed-fit-fleece-hoodie.jpg',          // เสื้อกันหนาวฮู้ดดี้ H&M Relaxed Fit Fleece Hoodie
    'p-fash-013': '/images/products/uniqlo-chino-shorts.jpg',                   // กางเกงขาสั้นลำลอง Uniqlo Chino Shorts ผ้ายืด
    'p-fash-014': '/images/products/rayban-classic-wayfarer-rb2140.jpg',        // แว่นกันแดด Ray-Ban Classic Wayfarer RB2140
    'p-fash-015': '/images/products/levis-classic-reversible-leather-belt.jpg', // เข็มขัดหนังแท้ Levi's Classic Reversible Leather Belt

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดแฟชั่น
    'XM-FASH-0001': '/images/products/uniqlo-supima-cotton-tshirt.jpg',
    'XM-FASH-0002': '/images/products/nike-air-force-1-07-white.jpg',
    'XM-FASH-0003': '/images/products/adidas-samba-og-white-black.jpg',
    'XM-FASH-0004': '/images/products/levis-501-original-fit-jeans.jpg',
    'XM-FASH-0005': '/images/products/gq-white-shirt-slim-fit.jpg',
    'XM-FASH-0006': '/images/products/lacoste-classic-fit-l1212-polo.jpg',
    'XM-FASH-0007': '/images/products/uniqlo-round-mini-shoulder-bag.jpg',
    'XM-FASH-0008': '/images/products/new-era-9forty-ny-yankees-black.jpg',
    'XM-FASH-0009': '/images/products/birkenstock-arizona-birko-flor.jpg',
    'XM-FASH-0010': '/images/products/anello-classic-backpack-canvas.jpg',
    'XM-FASH-0011': '/images/products/nike-everyday-cushion-socks-3pairs.jpg',
    'XM-FASH-0012': '/images/products/hm-relaxed-fit-fleece-hoodie.jpg',
    'XM-FASH-0013': '/images/products/uniqlo-chino-shorts.jpg',
    'XM-FASH-0014': '/images/products/rayban-classic-wayfarer-rb2140.jpg',
    'XM-FASH-0015': '/images/products/levis-classic-reversible-leather-belt.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 8. สุขภาพและความงาม (cat8) - รายการรูปภาพสินค้าจริง (Health & Beauty 15 รายการครบถ้วน)
    // ══════════════════════════════════════════════════════════════════════════
    'p-hlth-001': '/images/products/cerave-moisturising-cream-454g.jpg',         // ครีมบำรุงผิวหน้าและผิวกาย CeraVe Moisturising Cream 454g
    'p-hlth-002': '/images/products/laroche-posay-anthelios-uvmune400-50ml.jpg', // ครีมกันแดด La Roche-Posay Anthelios UVMune 400 50ml
    'p-hlth-003': '/images/products/hada-labo-hydrating-lotion-170ml.jpg',      // โลชั่นน้ำตบฮาดะลาโบะ Hada Labo Hydrating Lotion 170ml
    'p-hlth-004': '/images/products/the-ordinary-niacinamide-10-zinc-1-30ml.jpg', // เซรั่ม The Ordinary Niacinamide 10% + Zinc 1% 30ml
    'p-hlth-005': '/images/products/maybelline-superstay-matte-ink-5ml.jpg',     // ลิปสติกจิ้มจุ่ม Maybelline Superstay Matte Ink 5ml
    'p-hlth-006': '/images/products/loreal-infallible-24h-fresh-wear-30ml.jpg',  // รองพื้นคุมมัน L'Oreal Paris Infallible 24H Fresh Wear 30ml
    'p-hlth-007': '/images/products/maybelline-fit-me-matte-poreless-powder-6g.jpg', // แป้งพัฟคุมมัน Maybelline Fit Me Matte + Poreless 6g
    'p-hlth-008': '/images/products/bioderma-sensibio-h2o-500ml.jpg',            // คลีนซิ่งเช็ดเครื่องสำอาง Bioderma Sensibio H2O 500ml
    'p-hlth-009': '/images/products/omron-hem-7120-blood-pressure-monitor.jpg',  // เครื่องวัดความดันโลหิตอัตโนมัติ Omron HEM-7120
    'p-hlth-010': '/images/products/beurer-po30-pulse-oximeter.jpg',             // เครื่องวัดออกซิเจนปลายนิ้ว Beurer Pulse Oximeter PO 30
    'p-hlth-011': '/images/products/sara-paracetamol-500mg-10tablets.jpg',       // ยาพาราเซตามอล ซาร่า Sara 500 มก. (แผง 10 เม็ด)
    'p-hlth-012': '/images/products/tiger-balm-plaster-warm-2sheets.jpg',        // พลาสเตอร์บรรเทาปวด ตราเสือ Tiger Balm Plaster (แพ็ค 2 แผ่น)
    'p-hlth-013': '/images/products/nature-republic-aloe-vera-soothing-gel-300ml.jpg', // เจลว่านหางจระเข้บริสุทธิ์ Nature Republic Soothing Gel 300ml
    'p-hlth-014': '/images/products/leaders-insolution-clinic-mask-25ml.jpg',    // มาสก์บำรุงผิวหน้า Leaders Insolution Clinic Mask 25ml
    'p-hlth-015': '/images/products/poy-sian-mark-ii-inhaler.jpg',               // ยาดมโป๊ยเซียน ตราโป๊ยเซียน แบบ 2 ตอน

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดสุขภาพและความงาม
    'XM-HLTH-0001': '/images/products/cerave-moisturising-cream-454g.jpg',
    'XM-HLTH-0002': '/images/products/laroche-posay-anthelios-uvmune400-50ml.jpg',
    'XM-HLTH-0003': '/images/products/hada-labo-hydrating-lotion-170ml.jpg',
    'XM-HLTH-0004': '/images/products/the-ordinary-niacinamide-10-zinc-1-30ml.jpg',
    'XM-HLTH-0005': '/images/products/maybelline-superstay-matte-ink-5ml.jpg',
    'XM-HLTH-0006': '/images/products/loreal-infallible-24h-fresh-wear-30ml.jpg',
    'XM-HLTH-0007': '/images/products/maybelline-fit-me-matte-poreless-powder-6g.jpg',
    'XM-HLTH-0008': '/images/products/bioderma-sensibio-h2o-500ml.jpg',
    'XM-HLTH-0009': '/images/products/omron-hem-7120-blood-pressure-monitor.jpg',
    'XM-HLTH-0010': '/images/products/beurer-po30-pulse-oximeter.jpg',
    'XM-HLTH-0011': '/images/products/sara-paracetamol-500mg-10tablets.jpg',
    'XM-HLTH-0012': '/images/products/tiger-balm-plaster-warm-2sheets.jpg',
    'XM-HLTH-0013': '/images/products/nature-republic-aloe-vera-soothing-gel-300ml.jpg',
    'XM-HLTH-0014': '/images/products/leaders-insolution-clinic-mask-25ml.jpg',
    'XM-HLTH-0015': '/images/products/poy-sian-mark-ii-inhaler.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 9. แม่และเด็ก (cat9) - รายการรูปภาพสินค้าจริง (Baby & Kids 14 รายการครบถ้วน)
    // ══════════════════════════════════════════════════════════════════════════
    'p-baby-001': '/images/products/mamypoko-extra-dry-skin-tape-l.jpg',         // ผ้าอ้อมสำเร็จรูป MamyPoko Extra Dry Skin ไซส์ L (แพ็ค 52 ชิ้น)
    'p-baby-002': '/images/products/babylove-playpants-nano-power-m.jpg',        // ผ้าอ้อมกางเกง BabyLove PlayPants Nano Power ไซส์ M (54 ชิ้น)
    'p-baby-003': '/images/products/dumex-hiq-1-plus-super-gold-1800g.jpg',      // นมผง ดูเม็กซ์ ไฮคิว 1 พลัส ซูเปอร์โกลด์ พลัส ซี-ซินไบโอโพรเทก 1800g
    'p-baby-004': '/images/products/s-26-gold-progress-formula-3-1650g.jpg',     // นมผง เอส-26 โกลด์ โปรเกรส สูตร 3 ขนาด 1650g
    'p-baby-005': '/images/products/enfagrow-a-plus-mindpro-dha-plus-1900g.jpg', // นมผง เอนฟาโกร เอพลัส มายด์โปร ดีเอชเอ พลัส 1900g
    'p-baby-006': '/images/products/pigeon-softouch-ppsu-wide-neck-240ml.jpg',   // ขวดนมเสมือนนมแม่ Pigeon SofTouch PPSU Wide Neck 240ml
    'p-baby-007': '/images/products/d-nee-organic-bottle-cleanser-refill-600ml.jpg', // น้ำยาล้างขวดนมและจุกนม ดีนี่ ออร์แกนิค ถุงเติม 600 มล.
    'p-baby-008': '/images/products/kodomo-extra-mild-baby-powder-350g.jpg',     // แป้งเด็กโคโดโม สูตรเอ็กซ์ตร้ามายด์ 350g
    'p-baby-009': '/images/products/pigeon-baby-wipes-chamomile-80sheets.jpg',   // ทิชชู่เปียกเด็ก Pigeon เบบี้ไวพส์ คาโมมายล์ (แพ็ค 80 แผ่น x 2)
    'p-baby-010': '/images/products/babi-mild-ultra-mild-bath-shampoo-800ml.jpg', // สบู่เหลวอาบและสระ เบบี้มายด์ อัลตร้ามายด์ 800 มล.
    'p-baby-011': '/images/products/ange-monkey-silicone-teether.jpg',           // ยางกัดเสริมพัฒนาการซิลิโคน Ange Monkey Teether
    'p-baby-012': '/images/products/lego-classic-creative-bricks-10696.jpg',     // ชุดของเล่นตัวต่อเลโก้ LEGO Classic Creative Bricks 10696
    'p-baby-013': '/images/products/fisher-price-healthy-care-booster-seat.jpg', // เก้าอี้ทานข้าวเด็กปรับระดับ Fisher-Price Booster Seat
    'p-baby-014': '/images/products/philips-avent-2in1-electric-steam-sterilizer.jpg', // เครื่องนึ่งขวดนมพร้อมอบแห้ง Philips Avent 2-in-1

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดแม่และเด็ก
    'XM-BABY-0001': '/images/products/mamypoko-extra-dry-skin-tape-l.jpg',
    'XM-BABY-0002': '/images/products/babylove-playpants-nano-power-m.jpg',
    'XM-BABY-0003': '/images/products/dumex-hiq-1-plus-super-gold-1800g.jpg',
    'XM-BABY-0004': '/images/products/s-26-gold-progress-formula-3-1650g.jpg',
    'XM-BABY-0005': '/images/products/enfagrow-a-plus-mindpro-dha-plus-1900g.jpg',
    'XM-BABY-0006': '/images/products/pigeon-softouch-ppsu-wide-neck-240ml.jpg',
    'XM-BABY-0007': '/images/products/d-nee-organic-bottle-cleanser-refill-600ml.jpg',
    'XM-BABY-0008': '/images/products/kodomo-extra-mild-baby-powder-350g.jpg',
    'XM-BABY-0009': '/images/products/pigeon-baby-wipes-chamomile-80sheets.jpg',
    'XM-BABY-0010': '/images/products/babi-mild-ultra-mild-bath-shampoo-800ml.jpg',
    'XM-BABY-0011': '/images/products/ange-monkey-silicone-teether.jpg',
    'XM-BABY-0012': '/images/products/lego-classic-creative-bricks-10696.jpg',
    'XM-BABY-0013': '/images/products/fisher-price-healthy-care-booster-seat.jpg',
    'XM-BABY-0014': '/images/products/philips-avent-2in1-electric-steam-sterilizer.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 10. เครื่องเขียนและสำนักงาน (cat10) - รายการรูปภาพสินค้าจริง (Stationery & Office 14 รายการครบถ้วน)
    // ══════════════════════════════════════════════════════════════════════════
    'p-offc-001': '/images/products/pentel-energel-05-blue.jpg',                   // ปากกาหมึกเจล Pentel EnerGel 0.5 มม. หมึกน้ำเงิน
    'p-offc-002': '/images/products/zebra-sarasa-clip-05-blue.jpg',               // ปากกาเจล Zebra Sarasa Clip 0.5 มม. สีน้ำเงิน
    'p-offc-003': '/images/products/lancer-spiral-825-blue-box50.jpg',            // ปากกาลูกลื่น Lancer Spiral 825 หัว 0.5 มม. (กล่อง 50 ด้าม)
    'p-offc-004': '/images/products/stabilo-boss-original-highlighter-pack4.jpg', // ปากกาเน้นข้อความ Stabilo Boss Original คละสี (แพ็ค 4 ด้าม)
    'p-offc-005': '/images/products/rotring-tikky-05-black.jpg',                  // ดินสอกด Rotring Tikky 0.5 มม. ด้ามจับยาง สีดำ
    'p-offc-006': '/images/products/double-a-copy-paper-a4-80gsm-500sheets.jpg',  // กระดาษถ่ายเอกสาร Double A A4 80 แกรม (รีม 500 แผ่น)
    'p-offc-007': '/images/products/moleskine-classic-notebook-hardcover-ruled-a5.jpg', // สมุดบันทึก Moleskine Classic Notebook ปกแข็ง มีเส้น A5
    'p-offc-008': '/images/products/elephant-2100f-lever-arch-file-3inch.jpg',    // แฟ้มสันกว้าง ตราช้าง Elephant รุ่น 2100F สัน 3 นิ้ว A4
    'p-offc-009': '/images/products/max-hd-10d-stapler.jpg',                      // เครื่องเย็บกระดาษ MAX HD-10D พร้อมลวดเย็บเบอร์ 10
    'p-offc-010': '/images/products/3m-scotch-scissors-7inch.jpg',                // กรรไกรตัดกระดาษอเนกประสงค์ Scotch 3M ขนาด 7 นิ้ว
    'p-offc-011': '/images/products/elephant-super-glue-3g.jpg',                  // กาวตราช้าง Elephant Super Glue 3g แห้งเร็วติดแน่น
    'p-offc-012': '/images/products/3m-scotch-clear-tape-600-3pack.jpg',          // เทปใส Scotch 3M ขนาด 3/4 นิ้ว x 36 หลา (แพ็ค 3 ม้วน)
    'p-offc-013': '/images/products/casio-mx-12b-calculator.jpg',                 // เครื่องคิดเลขตั้งโต๊ะ Casio รุ่น MX-12B หน้าจอ 12 หลัก
    'p-offc-014': '/images/products/horse-magnetic-whiteboard-30x40cm.jpg',       // ไวท์บอร์ดแม่เหล็กพร้อมปากกาและแปรงลบ ตราม้า 30x40 ซม.

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดเครื่องเขียนและสำนักงาน
    'XM-OFFC-0001': '/images/products/pentel-energel-05-blue.jpg',
    'XM-OFFC-0002': '/images/products/zebra-sarasa-clip-05-blue.jpg',
    'XM-OFFC-0003': '/images/products/lancer-spiral-825-blue-box50.jpg',
    'XM-OFFC-0004': '/images/products/stabilo-boss-original-highlighter-pack4.jpg',
    'XM-OFFC-0005': '/images/products/rotring-tikky-05-black.jpg',
    'XM-OFFC-0006': '/images/products/double-a-copy-paper-a4-80gsm-500sheets.jpg',
    'XM-OFFC-0007': '/images/products/moleskine-classic-notebook-hardcover-ruled-a5.jpg',
    'XM-OFFC-0008': '/images/products/elephant-2100f-lever-arch-file-3inch.jpg',
    'XM-OFFC-0009': '/images/products/max-hd-10d-stapler.jpg',
    'XM-OFFC-0010': '/images/products/3m-scotch-scissors-7inch.jpg',
    'XM-OFFC-0011': '/images/products/elephant-super-glue-3g.jpg',
    'XM-OFFC-0012': '/images/products/3m-scotch-clear-tape-600-3pack.jpg',
    'XM-OFFC-0013': '/images/products/casio-mx-12b-calculator.jpg',
    'XM-OFFC-0014': '/images/products/horse-magnetic-whiteboard-30x40cm.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 11. ยานยนต์ (cat11) - 13 รายการรูปภาพสินค้าจริง
    // ══════════════════════════════════════════════════════════════════════════
    'p-auto-001': '/images/products/castrol-edge-5w30-4l.jpg',                    // น้ำมันเครื่องสังเคราะห์แท้ 100% Castrol EDGE 5W-30 4 ลิตร
    'p-auto-002': '/images/products/shell-helix-ultra-0w40-4l.jpg',               // น้ำมันเครื่องสังเคราะห์ Shell Helix Ultra 0W-40 4 ลิตร
    'p-auto-003': '/images/products/ptt-performa-super-synthetic-0w20-4l.jpg',    // น้ำมันเครื่องเบนซิน PTT Performa Super Synthetic 0W-20 4 ลิตร
    'p-auto-004': '/images/products/3m-car-wash-with-wax-1000ml.jpg',             // แชมพูล้างรถสูตรผสมแว็กซ์ 3M Car Wash with Wax 1000 มล.
    'p-auto-005': '/images/products/meguiars-hot-shine-tire-spray-710ml.jpg',     // น้ำยาเคลือบเงายางรถยนต์ Meguiar's Hot Shine Tire Spray 710 มล.
    'p-auto-006': '/images/products/turtle-wax-wax-and-dry-769ml.jpg',            // สเปรย์เคลือบเงาสีรถยนต์ Turtle Wax Wax & Dry 769 มล.
    'p-auto-007': '/images/products/3m-car-care-microfiber-40x40cm.jpg',          // ผ้าไมโครไฟเบอร์เช็ดรถหนานุ่ม 3M Car Care ขนาด 40x40 ซม.
    'p-auto-008': '/images/products/baseus-65w-fast-car-charger.jpg',             // หัวชาร์จในรถยนต์ Baseus 65W Fast Car Charger Type-C + USB
    'p-auto-009': '/images/products/70mai-dash-cam-pro-plus-a500s.jpg',           // กล้องติดหน้ารถยนต์ 70mai Dash Cam Pro Plus+ A500S 2.7K
    'p-auto-010': '/images/products/baseus-metal-gravity-car-mount.jpg',          // ที่วางโทรศัพท์ในรถยนต์ Baseus Metal Gravity Car Mount
    'p-auto-011': '/images/products/michelin-digital-tyre-gauge.jpg',             // เครื่องวัดแรงดันลมยางดิจิตอล Michelin Digital Tyre Gauge
    'p-auto-012': '/images/products/rain-x-glass-cleaner-473ml.jpg',              // น้ำยาทำความสะอาดและเคลือบกระจก Rain-X Glass Cleaner 473 มล.
    'p-auto-013': '/images/products/xiaomi-portable-air-compressor-2.jpg',        // ปั๊มลมพกพาไร้สายสำหรับยางรถยนต์ Xiaomi Portable Air Compressor 2
    'p-auto-014': '/images/products/honda-wave-110i.jpg',                         // รถจักรยานยนต์ Honda Wave 110i
    'p-auto-015': '/images/products/toyota-yaris.jpg',                            // รถยนต์ Toyota Yaris
    'p-auto-016': '/images/products/honda-city.jpg',                               // รถยนต์ Honda City
    'p-auto-017': '/images/products/trek-mountain-bike.jpg',                       // จักรยานเสือภูเขา Trek Marlin
    'p-auto-018': '/images/products/brompton-folding-bike.jpg',                   // จักรยานพับได้ Brompton
    'p-auto-019': '/images/products/xiaomi-electric-scooter.jpg',                  // สกู๊ตเตอร์ไฟฟ้า Xiaomi Electric Scooter

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดยานยนต์
    'XM-AUTO-0001': '/images/products/castrol-edge-5w30-4l.jpg',
    'XM-AUTO-0002': '/images/products/shell-helix-ultra-0w40-4l.jpg',
    'XM-AUTO-0003': '/images/products/ptt-performa-super-synthetic-0w20-4l.jpg',
    'XM-AUTO-0004': '/images/products/3m-car-wash-with-wax-1000ml.jpg',
    'XM-AUTO-0005': '/images/products/meguiars-hot-shine-tire-spray-710ml.jpg',
    'XM-AUTO-0006': '/images/products/turtle-wax-wax-and-dry-769ml.jpg',
    'XM-AUTO-0007': '/images/products/3m-car-care-microfiber-40x40cm.jpg',
    'XM-AUTO-0008': '/images/products/baseus-65w-fast-car-charger.jpg',
    'XM-AUTO-0009': '/images/products/70mai-dash-cam-pro-plus-a500s.jpg',
    'XM-AUTO-0010': '/images/products/baseus-metal-gravity-car-mount.jpg',
    'XM-AUTO-0011': '/images/products/michelin-digital-tyre-gauge.jpg',
    'XM-AUTO-0012': '/images/products/rain-x-glass-cleaner-473ml.jpg',
    'XM-AUTO-0013': '/images/products/xiaomi-portable-air-compressor-2.jpg',
    'XM-AUTO-0014': '/images/products/honda-wave-110i.jpg',
    'XM-AUTO-0015': '/images/products/toyota-yaris.jpg',
    'XM-AUTO-0016': '/images/products/honda-city.jpg',
    'XM-AUTO-0017': '/images/products/trek-mountain-bike.jpg',
    'XM-AUTO-0018': '/images/products/brompton-folding-bike.jpg',
    'XM-AUTO-0019': '/images/products/xiaomi-electric-scooter.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 12. สัตว์เลี้ยง (cat12) - 20 รายการรูปภาพสินค้าจริง (อาหาร/ของใช้ 14 + สัตว์เลี้ยงจริง 6)
    // ══════════════════════════════════════════════════════════════════════════
    'p-pet-001': '/images/products/royal-canin-mini-adult-2kg.jpg',              // อาหารสุนัขพันธุ์เล็ก Royal Canin Mini Adult ขนาด 2 กก.
    'p-pet-002': '/images/products/pedigree-adult-beef-vegetables-3kg.jpg',       // อาหารสุนัขโต เพดดิกรี Pedigree รสเนื้อวัวและผัก 3 กก.
    'p-pet-003': '/images/products/smartheart-gold-holistic-1-5kg.jpg',          // อาหารสุนัขพรีเมียม SmartHeart Gold Holistic ขนาด 1.5 กก.
    'p-pet-004': '/images/products/royal-canin-fit32-2kg.jpg',                   // อาหารแมวโต รอยัลคานิน Royal Canin Fit 32 ขนาด 2 กก.
    'p-pet-005': '/images/products/me-o-cat-mackerel-1-2kg.jpg',                  // อาหารแมว มีโอ Me-O รสปลาทู ขนาด 1.2 กก.
    'p-pet-006': '/images/products/whiskas-ocean-fish-1-2kg.jpg',                 // อาหารแมว วิสกัส Whiskas รสปลาทะเล ขนาด 1.2 กก.
    'p-pet-007': '/images/products/kaniva-cat-chicken-tuna-rice-1-4kg.jpg',       // อาหารแมวพรีเมียม Kaniva รสไก่ ปลาทูน่าและข้าว 1.4 กก.
    'p-pet-008': '/images/products/odour-lock-baby-powder-12kg.jpg',              // ทรายแมวภูเขาไฟไร้ฝุ่น Odour Lock กลิ่น Baby Powder 12 กก.
    'p-pet-009': '/images/products/cature-tofu-clumping-cat-litter-6l.jpg',       // ทรายแมวเต้าหู้ธรรมชาติ Cature Tofu Clumping 6 ลิตร
    'p-pet-010': '/images/products/ciao-churu-tuna-maguro-4pack.jpg',             // ขนมแมวเลีย Ciao Churu รสทูน่ามากุโระ (ซอง 4 หลอด)
    'p-pet-011': '/images/products/chaingard-dog-shampoo-tick-flea-350ml.jpg',    // แชมพูสุนัข Chaingard เชนการ์ด กำจัดเห็บหมัด 350 มล.
    'p-pet-012': '/images/products/pedigree-dentastix-medium-dog.jpg',            // ขนมขบเคี้ยวขัดฟันสุนัข Pedigree Dentastix พันธุ์กลาง (แพ็ค)
    'p-pet-013': '/images/products/petmate-cat-teaser-feather-bell.jpg',          // ของเล่นแมว ไม้ตกแมวขนนกธรรมชาติพร้อมกระดิ่ง
    'p-pet-014': '/images/products/petkit-double-stainless-steel-pet-bowl.jpg',   // ชามอาหารสัตว์เลี้ยงสแตนเลสคู่ พร้อมฐานกันลื่น Petkit
    'p-pet-015': '/images/products/chihuahua-puppy.jpg',                         // ลูกสุนัขพันธุ์ชิวาวา
    'p-pet-016': '/images/products/british-shorthair-kitten.jpg',                 // ลูกแมวพันธุ์บริติชชอร์ตแฮร์
    'p-pet-017': '/images/products/fancy-betta-fish.jpg',                         // ปลากัดแฟนซี
    'p-pet-018': '/images/products/budgerigar-bird.jpg',                          // นกหงส์หยก
    'p-pet-019': '/images/products/ball-python.jpg',                              // งูบอลไพธอน
    'p-pet-020': '/images/products/sulcata-tortoise.jpg',                         // เต่าซูลคาต้า

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดสัตว์เลี้ยง
    'XM-PET-0001': '/images/products/royal-canin-mini-adult-2kg.jpg',
    'XM-PET-0002': '/images/products/pedigree-adult-beef-vegetables-3kg.jpg',
    'XM-PET-0003': '/images/products/smartheart-gold-holistic-1-5kg.jpg',
    'XM-PET-0004': '/images/products/royal-canin-fit32-2kg.jpg',
    'XM-PET-0005': '/images/products/me-o-cat-mackerel-1-2kg.jpg',
    'XM-PET-0006': '/images/products/whiskas-ocean-fish-1-2kg.jpg',
    'XM-PET-0007': '/images/products/kaniva-cat-chicken-tuna-rice-1-4kg.jpg',
    'XM-PET-0008': '/images/products/odour-lock-baby-powder-12kg.jpg',
    'XM-PET-0009': '/images/products/cature-tofu-clumping-cat-litter-6l.jpg',
    'XM-PET-0010': '/images/products/ciao-churu-tuna-maguro-4pack.jpg',
    'XM-PET-0011': '/images/products/chaingard-dog-shampoo-tick-flea-350ml.jpg',
    'XM-PET-0012': '/images/products/pedigree-dentastix-medium-dog.jpg',
    'XM-PET-0013': '/images/products/petmate-cat-teaser-feather-bell.jpg',
    'XM-PET-0014': '/images/products/petkit-double-stainless-steel-pet-bowl.jpg',
    'XM-PET-0015': '/images/products/chihuahua-puppy.jpg',
    'XM-PET-0016': '/images/products/british-shorthair-kitten.jpg',
    'XM-PET-0017': '/images/products/fancy-betta-fish.jpg',
    'XM-PET-0018': '/images/products/budgerigar-bird.jpg',
    'XM-PET-0019': '/images/products/ball-python.jpg',
    'XM-PET-0020': '/images/products/sulcata-tortoise.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 13. กีฬาและกิจกรรมกลางแจ้ง (cat13) - 14 รายการรูปภาพสินค้าจริง
    // ══════════════════════════════════════════════════════════════════════════
    'p-sprt-001': '/images/products/hydro-flask-wide-mouth-32oz-black.jpg',
    'p-sprt-002': '/images/products/stanley-quencher-h2o-40oz.jpg',
    'p-sprt-003': '/images/products/manduka-prolite-yoga-mat-47mm.jpg',
    'p-sprt-004': '/images/products/molten-vantaggio-3400-football-size5.jpg',
    'p-sprt-005': '/images/products/spalding-tf150-basketball-size7.jpg',
    'p-sprt-006': '/images/products/yonex-astrox-lite-27i.jpg',
    'p-sprt-007': '/images/products/domyos-neoprene-dumbbells-2kg-pair.jpg',
    'p-sprt-008': '/images/products/resistance-loop-bands-5-levels.jpg',
    'p-sprt-009': '/images/products/naturehike-cloud-up-2-tent.jpg',
    'p-sprt-010': '/images/products/coleman-compact-folding-chair.jpg',
    'p-sprt-011': '/images/products/barebones-forest-lantern.jpg',
    'p-sprt-012': '/images/products/ocean-pack-dry-bag-10l-yellow.jpg',
    'p-sprt-013': '/images/products/nike-speed-rope.jpg',
    'p-sprt-014': '/images/products/speedo-futura-biofuse-flexiseal-goggles.jpg',

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดกีฬาและกิจกรรมกลางแจ้ง
    'XM-SPRT-0001': '/images/products/hydro-flask-wide-mouth-32oz-black.jpg',
    'XM-SPRT-0002': '/images/products/stanley-quencher-h2o-40oz.jpg',
    'XM-SPRT-0003': '/images/products/manduka-prolite-yoga-mat-47mm.jpg',
    'XM-SPRT-0004': '/images/products/molten-vantaggio-3400-football-size5.jpg',
    'XM-SPRT-0005': '/images/products/spalding-tf150-basketball-size7.jpg',
    'XM-SPRT-0006': '/images/products/yonex-astrox-lite-27i.jpg',
    'XM-SPRT-0007': '/images/products/domyos-neoprene-dumbbells-2kg-pair.jpg',
    'XM-SPRT-0008': '/images/products/resistance-loop-bands-5-levels.jpg',
    'XM-SPRT-0009': '/images/products/naturehike-cloud-up-2-tent.jpg',
    'XM-SPRT-0010': '/images/products/coleman-compact-folding-chair.jpg',
    'XM-SPRT-0011': '/images/products/barebones-forest-lantern.jpg',
    'XM-SPRT-0012': '/images/products/ocean-pack-dry-bag-10l-yellow.jpg',
    'XM-SPRT-0013': '/images/products/nike-speed-rope.jpg',
    'XM-SPRT-0014': '/images/products/speedo-futura-biofuse-flexiseal-goggles.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 14. บ้านและสวน (cat14) - 14 รายการรูปภาพสินค้าจริง
    // ══════════════════════════════════════════════════════════════════════════
    'p-gard-001': '/images/products/bosch-gsb-120li-cordless-hammer-drill.jpg',
    'p-gard-002': '/images/products/stanley-65-piece-home-tool-kit.jpg',
    'p-gard-003': '/images/products/stanley-fatmax-5m-tape-measure.jpg',
    'p-gard-004': '/images/products/solo-curved-pruning-shears-8inch.jpg',
    'p-gard-005': '/images/products/takagi-compact-reel-hose-15m.jpg',
    'p-gard-006': '/images/products/osmocote-13-13-13-fertilizer-1kg.jpg',
    'p-gard-007': '/images/products/philips-led-bulb-10w-daylight.jpg',
    'p-gard-008': '/images/products/xiaomi-smart-led-bulb-essential.jpg',
    'p-gard-009': '/images/products/toshino-4-outlet-surge-protector-3m.jpg',
    'p-gard-010': '/images/products/kassa-home-stainless-pedal-bin-12l.jpg',
    'p-gard-011': '/images/products/superware-vintage-watering-can-5l.jpg',
    'p-gard-012': '/images/products/organic-leaf-compost-worm-castings-5kg.jpg',
    'p-gard-013': '/images/products/seiko-quiet-sweep-wall-clock-12inch.jpg',
    'p-gard-014': '/images/products/kassa-home-4-tier-folding-steel-shelf-black.jpg',

    // แมปเพิ่มเติมด้วย SKU สำหรับหมวดบ้านและสวน
    'XM-GARD-0001': '/images/products/bosch-gsb-120li-cordless-hammer-drill.jpg',
    'XM-GARD-0002': '/images/products/stanley-65-piece-home-tool-kit.jpg',
    'XM-GARD-0003': '/images/products/stanley-fatmax-5m-tape-measure.jpg',
    'XM-GARD-0004': '/images/products/solo-curved-pruning-shears-8inch.jpg',
    'XM-GARD-0005': '/images/products/takagi-compact-reel-hose-15m.jpg',
    'XM-GARD-0006': '/images/products/osmocote-13-13-13-fertilizer-1kg.jpg',
    'XM-GARD-0007': '/images/products/philips-led-bulb-10w-daylight.jpg',
    'XM-GARD-0008': '/images/products/xiaomi-smart-led-bulb-essential.jpg',
    'XM-GARD-0009': '/images/products/toshino-4-outlet-surge-protector-3m.jpg',
    'XM-GARD-0010': '/images/products/kassa-home-stainless-pedal-bin-12l.jpg',
    'XM-GARD-0011': '/images/products/superware-vintage-watering-can-5l.jpg',
    'XM-GARD-0012': '/images/products/organic-leaf-compost-worm-castings-5kg.jpg',
    'XM-GARD-0013': '/images/products/seiko-quiet-sweep-wall-clock-12inch.jpg',
    'XM-GARD-0014': '/images/products/kassa-home-4-tier-folding-steel-shelf-black.jpg',


    // ══════════════════════════════════════════════════════════════════════════
    // 15. อสังหาริมทรัพย์ (cat15) - 20 รายการรูปภาพสินค้าจริง
    // ══════════════════════════════════════════════════════════════════════════
    'p-prop-001': '/images/products/setthasiri-modern-single-house.jpg',
    'p-prop-002': '/images/products/patio-rama9-premium-townhome.jpg',
    'p-prop-003': '/images/products/ashton-silom-luxury-condo.jpg',
    'p-prop-004': '/images/products/grand-britania-semi-detached-house.jpg',
    'p-prop-005': '/images/products/biztown-sukhumvit-home-office.jpg',
    'p-prop-006': '/images/products/huahin-bluesky-pool-villa.jpg',
    'p-prop-007': '/images/products/commercial-shophouse-ngamwongwan.jpg',
    'p-prop-008': '/images/products/land-plot-ratchaphruek-200sqw.jpg',
    'p-prop-009': '/images/products/ideo-sukhumvit93-condominium.jpg',
    'p-prop-010': '/images/products/nantawan-pinklao-luxury-mansion.jpg',
    'p-prop-011': '/images/products/golden-neo-sathorn-townhome.jpg',
    'p-prop-012': '/images/products/klass-sukhumvit-duplex-penthouse.jpg',
    'p-prop-013': '/images/products/villaggio-rangsit-twin-house.jpg',
    'p-prop-014': '/images/products/chiangmai-prime-land-1rai.jpg',
    'p-prop-015': '/images/products/lumpini-park-beach-jomtien-condo.jpg',
    'p-prop-016': '/images/products/nordic-single-story-house.jpg',
    'p-prop-017': '/images/products/ramintra-boutique-office-building.jpg',
    'p-prop-018': '/images/products/cityville-corner-unit-townhome.jpg',
    'p-prop-019': '/images/products/khaoyai-lakefront-vacation-chalet.jpg',
    'p-prop-020': '/images/products/park-origin-thonglor-pet-condo.jpg',
    'XM-PROP-0001': '/images/products/setthasiri-modern-single-house.jpg',
    'XM-PROP-0002': '/images/products/patio-rama9-premium-townhome.jpg',
    'XM-PROP-0003': '/images/products/ashton-silom-luxury-condo.jpg',
    'XM-PROP-0004': '/images/products/grand-britania-semi-detached-house.jpg',
    'XM-PROP-0005': '/images/products/biztown-sukhumvit-home-office.jpg',
    'XM-PROP-0006': '/images/products/huahin-bluesky-pool-villa.jpg',
    'XM-PROP-0007': '/images/products/commercial-shophouse-ngamwongwan.jpg',
    'XM-PROP-0008': '/images/products/land-plot-ratchaphruek-200sqw.jpg',
    'XM-PROP-0009': '/images/products/ideo-sukhumvit93-condominium.jpg',
    'XM-PROP-0010': '/images/products/nantawan-pinklao-luxury-mansion.jpg',
    'XM-PROP-0011': '/images/products/golden-neo-sathorn-townhome.jpg',
    'XM-PROP-0012': '/images/products/klass-sukhumvit-duplex-penthouse.jpg',
    'XM-PROP-0013': '/images/products/villaggio-rangsit-twin-house.jpg',
    'XM-PROP-0014': '/images/products/chiangmai-prime-land-1rai.jpg',
    'XM-PROP-0015': '/images/products/lumpini-park-beach-jomtien-condo.jpg',
    'XM-PROP-0016': '/images/products/nordic-single-story-house.jpg',
    'XM-PROP-0017': '/images/products/ramintra-boutique-office-building.jpg',
    'XM-PROP-0018': '/images/products/cityville-corner-unit-townhome.jpg',
    'XM-PROP-0019': '/images/products/khaoyai-lakefront-vacation-chalet.jpg',
    'XM-PROP-0020': '/images/products/park-origin-thonglor-pet-condo.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 16. ของเล่น (cat16) - 20 รายการรูปภาพสินค้าจริง
    // ══════════════════════════════════════════════════════════════════════════
    'p-toy-001': '/images/products/lego-classic-creative-brick-box-10696.jpg',
    'p-toy-002': '/images/products/lego-city-police-station-60316.jpg',
    'p-toy-003': '/images/products/barbie-fashionistas-floral-dress-doll.jpg',
    'p-toy-004': '/images/products/hot-wheels-10-car-gift-pack.jpg',
    'p-toy-005': '/images/products/rc-monster-truck-4wd-offroad.jpg',
    'p-toy-006': '/images/products/melissa-doug-wooden-building-blocks-100pcs.jpg',
    'p-toy-007': '/images/products/monopoly-classic-board-game.jpg',
    'p-toy-008': '/images/products/jenga-classic-wood-block-game.jpg',
    'p-toy-009': '/images/products/play-doh-color-collection-8pack.jpg',
    'p-toy-010': '/images/products/nerf-elite-commander-rd6-blaster.jpg',
    'p-toy-011': '/images/products/kids-kitchen-play-set-accessories.jpg',
    'p-toy-012': '/images/products/fisher-price-medical-kit-doctor-set.jpg',
    'p-toy-013': '/images/products/nat-geo-kids-microscope-science-kit.jpg',
    'p-toy-014': '/images/products/crayola-premier-art-case-140pcs.jpg',
    'p-toy-015': '/images/products/fisher-price-soft-baby-football.jpg',
    'p-toy-016': '/images/products/classic-soft-plush-teddy-bear-50cm.jpg',
    'p-toy-017': '/images/products/bandai-hg-rx78-2-gundam-model-kit.jpg',
    'p-toy-018': '/images/products/sylvanian-families-red-roof-cosy-cottage.jpg',
    'p-toy-019': '/images/products/gan-356-rs-speed-cube-3x3.jpg',
    'p-toy-020': '/images/products/micro-kickboard-mini-kids-scooter.jpg',
    'XM-TOY-0001': '/images/products/lego-classic-creative-brick-box-10696.jpg',
    'XM-TOY-0002': '/images/products/lego-city-police-station-60316.jpg',
    'XM-TOY-0003': '/images/products/barbie-fashionistas-floral-dress-doll.jpg',
    'XM-TOY-0004': '/images/products/hot-wheels-10-car-gift-pack.jpg',
    'XM-TOY-0005': '/images/products/rc-monster-truck-4wd-offroad.jpg',
    'XM-TOY-0006': '/images/products/melissa-doug-wooden-building-blocks-100pcs.jpg',
    'XM-TOY-0007': '/images/products/monopoly-classic-board-game.jpg',
    'XM-TOY-0008': '/images/products/jenga-classic-wood-block-game.jpg',
    'XM-TOY-0009': '/images/products/play-doh-color-collection-8pack.jpg',
    'XM-TOY-0010': '/images/products/nerf-elite-commander-rd6-blaster.jpg',
    'XM-TOY-0011': '/images/products/kids-kitchen-play-set-accessories.jpg',
    'XM-TOY-0012': '/images/products/fisher-price-medical-kit-doctor-set.jpg',
    'XM-TOY-0013': '/images/products/nat-geo-kids-microscope-science-kit.jpg',
    'XM-TOY-0014': '/images/products/crayola-premier-art-case-140pcs.jpg',
    'XM-TOY-0015': '/images/products/fisher-price-soft-baby-football.jpg',
    'XM-TOY-0016': '/images/products/classic-soft-plush-teddy-bear-50cm.jpg',
    'XM-TOY-0017': '/images/products/bandai-hg-rx78-2-gundam-model-kit.jpg',
    'XM-TOY-0018': '/images/products/sylvanian-families-red-roof-cosy-cottage.jpg',
    'XM-TOY-0019': '/images/products/gan-356-rs-speed-cube-3x3.jpg',
    'XM-TOY-0020': '/images/products/micro-kickboard-mini-kids-scooter.jpg',

    // ══════════════════════════════════════════════════════════════════════════
    // 17. ของสดและอาหารแช่แข็ง (cat17) - 20 รายการรูปภาพสินค้าจริง
    // ══════════════════════════════════════════════════════════════════════════
    'p-frsh-001': '/images/products/s-pure-sliced-pork-belly-500g.jpg',
    'p-frsh-002': '/images/products/cp-fresh-pork-collar-1kg.jpg',
    'p-frsh-003': '/images/products/betagro-skinless-chicken-breast-1kg.jpg',
    'p-frsh-004': '/images/products/cp-fresh-chicken-quarter-leg-1kg.jpg',
    'p-frsh-005': '/images/products/australian-beef-ribeye-steak-300g.jpg',
    'p-frsh-006': '/images/products/pon-yang-kham-minced-beef-500g.jpg',
    'p-frsh-007': '/images/products/norwegian-salmon-steak-fillet-200g.jpg',
    'p-frsh-008': '/images/products/fresh-sea-bass-butterfly-cut-600g.jpg',
    'p-frsh-009': '/images/products/fresh-white-shrimp-peeled-tail-on-500g.jpg',
    'p-frsh-010': '/images/products/fresh-squid-rings-cleaned-500g.jpg',
    'p-frsh-011': '/images/products/cp-fresh-hygienic-eggs-pack30.jpg',
    'p-frsh-012': '/images/products/royal-project-green-oak-lettuce-250g.jpg',
    'p-frsh-013': '/images/products/fresh-sweet-cherry-tomatoes-500g.jpg',
    'p-frsh-014': '/images/products/japanese-fuji-apples-pack4.jpg',
    'p-frsh-015': '/images/products/bucher-smoked-pork-sausage-300g.jpg',
    'p-frsh-016': '/images/products/cp-smoked-bacon-slices-500g.jpg',
    'p-frsh-017': '/images/products/premium-pork-meatballs-500g.jpg',
    'p-frsh-018': '/images/products/tyson-crispy-chicken-nuggets-1kg.jpg',
    'p-frsh-019': '/images/products/ajinomoto-frozen-pork-gyoza-30pcs.jpg',
    'p-frsh-020': '/images/products/aro-frozen-mixed-berries-1kg.jpg',
    'XM-FRSH-0001': '/images/products/s-pure-sliced-pork-belly-500g.jpg',
    'XM-FRSH-0002': '/images/products/cp-fresh-pork-collar-1kg.jpg',
    'XM-FRSH-0003': '/images/products/betagro-skinless-chicken-breast-1kg.jpg',
    'XM-FRSH-0004': '/images/products/cp-fresh-chicken-quarter-leg-1kg.jpg',
    'XM-FRSH-0005': '/images/products/australian-beef-ribeye-steak-300g.jpg',
    'XM-FRSH-0006': '/images/products/pon-yang-kham-minced-beef-500g.jpg',
    'XM-FRSH-0007': '/images/products/norwegian-salmon-steak-fillet-200g.jpg',
    'XM-FRSH-0008': '/images/products/fresh-sea-bass-butterfly-cut-600g.jpg',
    'XM-FRSH-0009': '/images/products/fresh-white-shrimp-peeled-tail-on-500g.jpg',
    'XM-FRSH-0010': '/images/products/fresh-squid-rings-cleaned-500g.jpg',
    'XM-FRSH-0011': '/images/products/cp-fresh-hygienic-eggs-pack30.jpg',
    'XM-FRSH-0012': '/images/products/royal-project-green-oak-lettuce-250g.jpg',
    'XM-FRSH-0013': '/images/products/fresh-sweet-cherry-tomatoes-500g.jpg',
    'XM-FRSH-0014': '/images/products/japanese-fuji-apples-pack4.jpg',
    'XM-FRSH-0015': '/images/products/bucher-smoked-pork-sausage-300g.jpg',
    'XM-FRSH-0016': '/images/products/cp-smoked-bacon-slices-500g.jpg',
    'XM-FRSH-0017': '/images/products/premium-pork-meatballs-500g.jpg',
    'XM-FRSH-0018': '/images/products/tyson-crispy-chicken-nuggets-1kg.jpg',
    'XM-FRSH-0019': '/images/products/ajinomoto-frozen-pork-gyoza-30pcs.jpg',
    'XM-FRSH-0020': '/images/products/aro-frozen-mixed-berries-1kg.jpg',
};

/**
 * ดึง Placeholder Image ตาม Category ID
 */
export function getPlaceholderByCategory(categoryId?: string): string {
    if (categoryId && categoryPlaceholderMap[categoryId]) {
        return categoryPlaceholderMap[categoryId];
    }
    return DEFAULT_PLACEHOLDER;
}

/**
 * ฟังก์ชันหลักในการค้นหาและระบุรูปภาพของสินค้า
 * 1. หากมีรูปจริงใน realProductImages (ตรวจสอบตาม ID หรือ SKU) ให้ใช้รูปจริง
 * 2. หากผู้ดูแลระบบระบุรูปภาพที่ถูกต้องมาเองผ่าน customImage (ไม่ใช่ placeholder) ให้ใช้ค่านั้น
 * 3. หากยังไม่มีรูปจริง ให้ส่งคืน Placeholder Image ประจำหมวดหมู่
 */
export function resolveProductImage(
    productId: string,
    categoryId?: string,
    sku?: string,
    customImage?: string
): string {
    // 1. ตรวจสอบรูปจริงที่กำหนดใน realProductImages ตาม ID
    if (realProductImages[productId]) {
        return realProductImages[productId];
    }

    // 2. ตรวจสอบรูปจริงตาม SKU
    if (sku && realProductImages[sku]) {
        return realProductImages[sku];
    }

    // 3. ตรวจสอบ customImage (เช่น จาก Admin ที่ไม่ใช่ placeholder เดิม)
    if (customImage && customImage.trim() !== '' && !customImage.includes('/placeholders/')) {
        // หากผู้ใช้หรือแอดมินใส่ URL รูปภาพมาเอง
        return customImage.trim();
    }

    // 4. ค่าเริ่มต้น: ใช้ Placeholder Image ตามหมวดหมู่
    return getPlaceholderByCategory(categoryId);
}
