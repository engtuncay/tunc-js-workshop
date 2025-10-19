// Block sınıfı - Blockchain'deki her bir blok
import crypto from 'crypto';

export class Block {
    constructor(timestamp, data, previousHash = '') {
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0; // Mining için kullanılan sayı
    }

    // SHA-256 hash hesaplama (basit bir implementasyon)
    calculateHash() {
        return crypto.createHash('sha256')
            .update(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce)
            .digest('hex');
    }

    // Mining işlemi - Proof of Work
    mineBlock(difficulty) {
        const target = Array(difficulty + 1).join("0");
        
        console.log(`Mining blok... Target: ${target}`);
        const startTime = Date.now();
        
        while (this.hash.substring(0, difficulty) !== target) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        
        const endTime = Date.now();
        console.log(`Blok mine edildi: ${this.hash}`);
        console.log(`Mining süresi: ${endTime - startTime}ms`);
        console.log(`Nonce: ${this.nonce}`);
    }
}


export default Block;