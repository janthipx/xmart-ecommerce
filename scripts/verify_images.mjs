import fs from 'fs';
import path from 'path';

const productsFile = path.join(process.cwd(), 'src', 'data', 'products.ts');
const content = fs.readFileSync(productsFile, 'utf-8');
const jsonStr = content.replace(/^import\s+[^;]+;\s+export const mockProducts:\s*Product\[\]\s*=\s*/, '').replace(/;\s*$/, '');
const products = JSON.parse(jsonStr);

console.log(`Checking ${products.length} products...`);

let okCount = 0;
let failCount = 0;
const failures = [];

async function checkProduct(p) {
    const url = p.image;
    if (url.startsWith('/')) {
        const localPath = path.join(process.cwd(), 'public', url.replace(/^\//, ''));
        if (fs.existsSync(localPath)) {
            okCount++;
            return;
        } else {
            failCount++;
            failures.push({ id: p.id, name: p.name, url, reason: 'Local file missing' });
            return;
        }
    }

    try {
        const res = await fetch(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (res.status === 200) {
            okCount++;
            return;
        }
        // retry GET
        const getRes = await fetch(url, { method: 'GET', headers: { 'User-Agent': 'Mozilla/5.0' } });
        if (getRes.status === 200) {
            okCount++;
            return;
        }
        failCount++;
        failures.push({ id: p.id, name: p.name, url, status: getRes.status });
    } catch (err) {
        failCount++;
        failures.push({ id: p.id, name: p.name, url, error: err.message });
    }
}

// Run in batches of 15
async function runAll() {
    const batchSize = 15;
    for (let i = 0; i < products.length; i += batchSize) {
        const batch = products.slice(i, i + batchSize);
        await Promise.all(batch.map(checkProduct));
        process.stdout.write(`\rProgress: ${Math.min(i + batchSize, products.length)} / ${products.length} (OK: ${okCount}, Fail: ${failCount})`);
    }
    console.log('\n\n=== Validation Summary ===');
    console.log(`Total: ${products.length}`);
    console.log(`OK: ${okCount}`);
    console.log(`Failed: ${failCount}`);
    if (failures.length > 0) {
        console.log('Failures:', failures);
    }
}

runAll();
