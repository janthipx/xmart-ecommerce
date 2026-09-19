import fs from 'fs';
import path from 'path';

const productsFile = path.join(process.cwd(), 'src', 'data', 'products.ts');
const content = fs.readFileSync(productsFile, 'utf-8');
const jsonStr = content.replace(/^import\s+[^;]+;\s+export const mockProducts:\s*Product\[\]\s*=\s*/, '').replace(/;\s*$/, '');
const products = JSON.parse(jsonStr);

const outDir = path.join(process.cwd(), 'public', 'products');
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Copy existing local files first
const existingMap = {
    'p-drink-1': 'crystal_water_600ml.jpg',
    'p-drink-2': 'coke_325ml.jpg',
    'p-drink-3': 'pepsi_325ml.jpg',
    'p-drink-4': 'ichitan_tea_500ml.jpg',
    'p-drink-5': 'uht_milk_180ml.jpg',
    'p-drink-6': 'nescafe_3in1.jpg',
    'p-drink-7': 'redbull_250ml.jpg',
    'p-drink-8': 'pasteurized_milk_400ml.jpg',
};

for (const [id, filename] of Object.entries(existingMap)) {
    const src = path.join(process.cwd(), 'public', 'images', 'products', filename);
    const dest = path.join(outDir, `${id}.jpg`);
    if (fs.existsSync(src) && !fs.existsSync(dest)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${filename} -> ${id}.jpg`);
    }
}

// Helper to delay
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function downloadImage(url, destPath) {
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 12000);
            const res = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                    'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
                }
            });
            clearTimeout(timeoutId);
            if (res.ok) {
                const buffer = Buffer.from(await res.arrayBuffer());
                if (buffer.length > 500) {
                    fs.writeFileSync(destPath, buffer);
                    return true;
                }
            }
        } catch (e) {
            // retry
        }
        await sleep(400);
    }
    return false;
}

// SVG generator for clean packshot if external download fails
function generateFallbackSvg(p, destPath) {
    const brand = p.brand || 'X MART';
    const name = p.name;
    const cat = p.category || '';
    const colors = {
        'อาหาร': ['#FFEDD5', '#EA580C'],
        'เครื่องดื่ม': ['#DBEAFE', '#2563EB'],
        'ขนม': ['#FCE7F3', '#DB2777'],
        'ของใช้ส่วนตัว': ['#E0E7FF', '#4F46E5'],
        'ของใช้ในบ้าน': ['#DCFCE7', '#16A34A'],
        'เครื่องใช้ไฟฟ้า': ['#F1F5F9', '#0F172A'],
        'แฟชั่น': ['#F3E8FF', '#9333EA'],
        'สุขภาพและความงาม': ['#FFE4E6', '#E11D48'],
        'แม่และเด็ก': ['#FEF3C7', '#D97706'],
        'เครื่องเขียนและสำนักงาน': ['#CCFBF1', '#0D9488'],
        'ยานยนต์': ['#E2E8F0', '#334155'],
        'สัตว์เลี้ยง': ['#FED7AA', '#C2410C'],
        'กีฬาและกิจกรรมกลางแจ้ง': ['#CFFAFE', '#0891B2'],
        'บ้านและสวน': ['#D1FAE5', '#059669']
    };
    const [bg, accent] = colors[cat] || ['#F3F4F6', '#2563EB'];
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <rect width="100%" height="100%" fill="${bg}" rx="24"/>
  <rect x="40" y="40" width="320" height="320" fill="white" rx="16" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.05))"/>
  <circle cx="200" cy="160" r="60" fill="${accent}" opacity="0.12"/>
  <text x="200" y="145" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="14" font-weight="700" fill="${accent}" text-anchor="middle" letter-spacing="2">${brand.toUpperCase()}</text>
  <text x="200" y="180" font-family="-apple-system,BlinkMacSystemFont,sans-serif" font-size="28" font-weight="900" fill="#1E293B" text-anchor="middle">📦</text>
  <foreignObject x="60" y="240" width="280" height="90">
    <div xmlns="http://www.w3.org/1999/xhtml" style="font-family:-apple-system,sans-serif;text-align:center;color:#334155;font-size:13px;font-weight:600;line-height:1.4;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;">
      ${name}
    </div>
  </foreignObject>
  <rect x="60" y="335" width="280" height="1" fill="#E2E8F0"/>
  <text x="200" y="352" font-family="-apple-system,sans-serif" font-size="11" font-weight="600" fill="#94A3B8" text-anchor="middle">${cat} • X MART Official</text>
</svg>`;
    const svgPath = destPath.replace(/\.jpg$/, '.svg');
    fs.writeFileSync(svgPath, svg, 'utf-8');
    return `/products/${path.basename(svgPath)}`;
}

async function run() {
    console.log(`Processing ${products.length} product images...`);
    let downloaded = 0;
    let fallback = 0;

    for (let i = 0; i < products.length; i++) {
        const p = products[i];
        const destJpg = path.join(outDir, `${p.id}.jpg`);

        if (fs.existsSync(destJpg)) {
            p.image = `/products/${p.id}.jpg`;
            downloaded++;
            continue;
        }

        let success = false;
        if (p.image.startsWith('http')) {
            success = await downloadImage(p.image, destJpg);
            await sleep(150);
        }

        if (success) {
            p.image = `/products/${p.id}.jpg`;
            downloaded++;
            process.stdout.write(`\r[${i + 1}/${products.length}] Downloaded ${p.id}.jpg (${p.name.slice(0, 25)})`);
        } else {
            p.image = generateFallbackSvg(p, destJpg);
            fallback++;
            process.stdout.write(`\r[${i + 1}/${products.length}] Generated fallback for ${p.id} (${p.name.slice(0, 25)})`);
        }
    }

    console.log(`\nDone! Downloaded: ${downloaded}, Fallback: ${fallback}`);

    // Update products.ts with local references
    const fileHeader = `import { Product } from "@/types";\n\nexport const mockProducts: Product[] = `;
    fs.writeFileSync(productsFile, fileHeader + JSON.stringify(products, null, 4) + ';\n');
    console.log(`Updated ${productsFile} with guaranteed local images.`);
}

run();
