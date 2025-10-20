// Block sınıfı - Blockchain'deki her bir blok (Local Crypto-JS versiyonu)
// Node_modules içindeki Crypto-JS kullanır

export class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // Mining için kullanılan sayı
    }

    // SHA-256 hash fonksiyonu (Local Crypto-JS kullanarak)
    calculateHash() {
        const str = this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce;
        
        // Local Crypto-JS ile SHA-256 hash hesaplama
        if (typeof CryptoJS !== 'undefined') {
            return CryptoJS.SHA256(str).toString();
        } else if (typeof window !== 'undefined' && window.CryptoJS) {
            return window.CryptoJS.SHA256(str).toString();
        } else {
            // Fallback: Basit hash (CryptoJS yüklenmemişse)
            console.warn('⚠️ Local CryptoJS bulunamadı, basit hash kullanılıyor');
            return this.simpleHash(str);
        }
    }

    // Basit hash fonksiyonu (fallback)
    simpleHash(str) {
        let hash = 0;
        if (str.length === 0) return hash.toString();
        
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // 32bit integer'a çevir
        }
        
        return Math.abs(hash).toString(16);
    }

    // Mining işlemi - Proof of Work (Geliştirilmiş)
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
            
            // Her 10000 denemede bir progress göster
            if (attempts % 10000 === 0) {
                console.log(`⏳ Mining devam ediyor... Deneme: ${attempts}, Hash: ${this.hash.substring(0, 10)}...`);
            }
        }
        
        const endTime = Date.now();
        const miningTime = endTime - startTime;
        const hashRate = Math.round(attempts / (miningTime / 1000));
        
        console.log(`✅ Blok başarıyla mine edildi! (Local Crypto)`);
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

    // Blok bilgilerini göster
    displayBlockInfo() {
        console.log('\n=== BLOK BİLGİLERİ (Local Crypto) ===');
        console.log(`Timestamp: ${new Date(this.timestamp).toLocaleString()}`);
        console.log(`Previous Hash: ${this.previousHash}`);
        console.log(`Hash: ${this.hash}`);
        console.log(`Nonce: ${this.nonce}`);
        console.log(`Data: ${JSON.stringify(this.data, null, 2)}`);
    }
}