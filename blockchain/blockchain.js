import { Block } from './block.js';

// Blockchain sınıfı - Tüm blokları yöneten ana sınıf
export class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Mining zorluğu
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    // Genesis block (ilk blok) oluşturma
    createGenesisBlock() {
        const genesisBlock = new Block(Date.now(), "Genesis Block", "0");
        console.log("Genesis Block oluşturuldu");
        return genesisBlock;
    }

    // Son bloğu getir
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Bekleyen işlemleri mine et
    minePendingTransactions(miningRewardAddress) {
        // Mining ödülü işlemini ekle
        const rewardTransaction = {
            fromAddress: null,
            toAddress: miningRewardAddress,
            amount: this.miningReward
        };
        this.pendingTransactions.push(rewardTransaction);

        // Yeni blok oluştur
        const block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        
        // Bloğu mine et
        block.mineBlock(this.difficulty);
        
        console.log('Blok başarıyla mine edildi!');
        this.chain.push(block);
        
        // Bekleyen işlemleri temizle
        this.pendingTransactions = [];
        
        // Mining sonucunu döndür
        return {
            hash: block.hash,
            time: 0, // Basit implementasyon için
            nonce: block.nonce
        };
    }

    // Yeni işlem oluştur
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
        console.log(`Yeni işlem eklendi: ${transaction.fromAddress} -> ${transaction.toAddress}: ${transaction.amount}`);
    }

    // Adres bakiyesini hesapla
    getBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const trans of block.data) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    // Blockchain'in geçerliliğini kontrol et
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Mevcut bloğun hash'ini kontrol et
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('Geçersiz hash tespit edildi:', currentBlock.hash);
                return false;
            }

            // Önceki blok bağlantısını kontrol et
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('Geçersiz blok bağlantısı tespit edildi');
                return false;
            }
        }

        console.log('Blockchain geçerli!');
        return true;
    }

    // Blockchain'i görüntüle
    displayBlockchain() {
        console.log('\n=== BLOCKCHAIN BİLGİLERİ ===');
        this.chain.forEach((block, index) => {
            console.log(`\n--- Blok ${index} ---`);
            console.log(`Timestamp: ${new Date(block.timestamp).toLocaleString()}`);
            console.log(`Previous Hash: ${block.previousHash}`);
            console.log(`Hash: ${block.hash}`);
            console.log(`Nonce: ${block.nonce}`);
            console.log(`Data: ${JSON.stringify(block.data, null, 2)}`);
        });
    }
}

export default Blockchain;