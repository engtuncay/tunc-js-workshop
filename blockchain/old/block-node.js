// Block sınıfı - Blockchain'deki her bir blok (Node.js Crypto modülü versiyonu)
import crypto from 'crypto';

export class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // Mining için kullanılan sayı
    }

    // SHA-256 hash fonksiyonu (Node.js crypto modülü kullanarak)
    calculateHash() {
        const str = this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
        return crypto.createHash('sha256').update(str).digest('hex');
    }

    // Mining işlemi - Proof of Work (Node.js optimize)
    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        
        console.log(`🔨 Mining başlıyor... Target: ${target}`);
        console.log(`📊 Difficulty: ${difficulty}`);
        
        const startTime = Date.now();
        let attempts = 0;
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            attempts++;
            this.hash = this.calculateHash();
            
            // Her 50000 denemede bir progress göster (Node.js daha hızlı)
            if (attempts % 50000 === 0) {
                console.log(`⏳ Mining devam ediyor... Deneme: ${attempts}, Hash: ${this.hash.substring(0, 10)}...`);
            }
        }
        
        const endTime = Date.now();
        const miningTime = endTime - startTime;
        const hashRate = Math.round(attempts / (miningTime / 1000));
        
        console.log(`✅ Blok başarıyla mine edildi!`);
        console.log(`🔗 Hash: ${this.hash}`);
        console.log(`⏱️ Mining süresi: ${miningTime}ms`);
        console.log(`🎯 Nonce: ${this.nonce}`);
        console.log(`⚡ Hash Rate: ${hashRate} hash/saniye`);
        console.log(`🔄 Toplam deneme: ${attempts}`);
        
        return {
            hash: this.hash,
            time: miningTime,
            nonce: this.nonce,
            attempts: attempts,
            hashRate: hashRate
        };
    }

    // Hash geçerliliğini kontrol et
    isValidHash(difficulty) {
        const target = Array(difficulty + 1).join("0");
        return this.hash.substring(0, difficulty) === target;
    }

    // HMAC ile block imzalama (güvenlik için)
    signBlock(privateKey) {
        const blockData = this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
        this.signature = crypto.createHmac('sha256', privateKey).update(blockData).digest('hex');
        console.log(`🔏 Blok imzalandı: ${this.signature.substring(0, 16)}...`);
    }

    // Block imzasını doğrula
    verifySignature(privateKey) {
        const blockData = this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
        const expectedSignature = crypto.createHmac('sha256', privateKey).update(blockData).digest('hex');
        return this.signature === expectedSignature;
    }

    // Blok bilgilerini göster
    displayBlockInfo() {
        console.log('\n=== BLOK BİLGİLERİ (Node.js Crypto) ===');
        console.log(`Timestamp: ${new Date(this.timestamp).toLocaleString()}`);
        console.log(`Previous Hash: ${this.previousHash}`);
        console.log(`Hash: ${this.hash}`);
        console.log(`Nonce: ${this.nonce}`);
        console.log(`Signature: ${this.signature || 'İmzalanmamış'}`);
        console.log(`Data: ${JSON.stringify(this.data, null, 2)}`);
    }
}