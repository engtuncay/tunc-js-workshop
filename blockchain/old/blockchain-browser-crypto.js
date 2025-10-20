import { Block } from './block-browser-crypto.js';

// Blockchain sınıfı - Tüm blokları yöneten ana sınıf (Crypto-JS versiyonu)
export class Blockchain {

    id = Math.floor(Math.random() * 1000) + 1;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2; // Mining zorluğu (crypto-js ile biraz artırıldı)
        this.pendingTransactions = [];
        this.miningReward = 100;
        
        // UTXO sistemi - Gerçek blockchain'lere daha yakın
        this.utxoSet = new Map(); // address -> balance mapping
        this.addressIndex = new Map(); // Hızlı arama için adres indeksi
        
        // Mining istatistikleri
        this.miningStats = {
            totalBlocks: 1, // Genesis block
            totalMiningTime: 0,
            averageHashRate: 0,
            lastMiningTime: null
        };
    }

    // Genesis block (ilk blok) oluşturma
    createGenesisBlock() {
        // timestamp,data,previousHash
        const genesisBlock = new Block(Date.now(), "Genesis Block - Crypto-JS Edition", "0");
        console.log("✨ Genesis Block oluşturuldu - UTXO sistemi başlatıldı (Crypto-JS)");
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
        console.log(`🔥 Blok #${this.chain.length} mining başlıyor...`);
        const miningResult = block.mineBlock(this.difficulty);
        
        console.log('✅ Blok başarıyla mine edildi!');
        this.chain.push(block);
        
        // Mining istatistiklerini güncelle
        this.updateMiningStats(miningResult);
        
        // UTXO set'ini güncelle (Gerçek blockchain'lerde böyle yapılır)
        this.updateUtxoSet(this.pendingTransactions);
        
        // Bekleyen işlemleri temizle
        this.pendingTransactions = [];
        
        return miningResult;
    }

    // Mining istatistiklerini güncelle
    updateMiningStats(result) {
        this.miningStats.totalBlocks++;
        this.miningStats.totalMiningTime += result.time;
        this.miningStats.averageHashRate = Math.round(
            (this.miningStats.averageHashRate + result.hashRate) / 2
        );
        this.miningStats.lastMiningTime = result.time;
        
        console.log(`📊 Mining İstatistikleri:`);
        console.log(`   Toplam Blok: ${this.miningStats.totalBlocks}`);
        console.log(`   Ortalama Hash Rate: ${this.miningStats.averageHashRate} hash/s`);
        console.log(`   Son Mining Süresi: ${this.miningStats.lastMiningTime}ms`);
    }

    // Yeni işlem oluştur
    createTransaction(transaction) {
        // İşlem geçerliliği kontrolü
        if (transaction.fromAddress && transaction.amount > 0) {
            const senderBalance = this.getBalance(transaction.fromAddress);
            if (senderBalance < transaction.amount) {
                throw new Error(`❌ Yetersiz bakiye! Mevcut: ${senderBalance}, Gerekli: ${transaction.amount}`);
            }
        }
        
        // İşlem hash'i oluştur (güvenlik için)
        transaction.hash = this.createTransactionHash(transaction);
        
        this.pendingTransactions.push(transaction);
        console.log(`✨ Yeni işlem eklendi: ${transaction.fromAddress || 'Mining'} -> ${transaction.toAddress}: ${transaction.amount}`);
        console.log(`🔗 İşlem Hash: ${transaction.hash}`);
    }

    // İşlem hash'i oluştur
    createTransactionHash(transaction) {
        const transactionString = `${transaction.fromAddress}${transaction.toAddress}${transaction.amount}${Date.now()}`;
        
        if (typeof CryptoJS !== 'undefined') {
            return CryptoJS.SHA256(transactionString).toString().substring(0, 16);
        } else {
            // Fallback hash
            let hash = 0;
            for (let i = 0; i < transactionString.length; i++) {
                const char = transactionString.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return Math.abs(hash).toString(16).substring(0, 16);
        }
    }

    // Adres bakiyesini hesapla (Optimized - UTXO benzeri)
    getBalance(address) {
        // Önce UTXO set'inden kontrol et (O(1) karmaşıklık)
        if (this.utxoSet.has(address)) {
            return this.utxoSet.get(address);
        }

        // Eğer UTXO set'inde yoksa, tüm blokları tara (fallback)
        console.warn(`⚠️ UTXO set'inde ${address} bulunamadı, tüm bloklar taranıyor...`);
        return this.calculateBalanceFromBlocks(address);
    }

    // Tüm blokları tarayarak bakiye hesapla (Eski yöntem - sadece fallback)
    calculateBalanceFromBlocks(address) {
        let balance = 0;

        for (const block of this.chain) {
            if (Array.isArray(block.data)) {
                for (const trans of block.data) {
                    if (trans.fromAddress === address) {
                        balance -= trans.amount;
                    }
                    if (trans.toAddress === address) {
                        balance += trans.amount;
                    }
                }
            }
        }

        return balance;
    }

    // UTXO set'ini güncelle (Optimize edilmiş bakiye yönetimi)
    updateUtxoSet(transactions) {
        for (const trans of transactions) {
            // Gönderen adresin bakiyesini azalt
            if (trans.fromAddress) {
                const currentBalance = this.utxoSet.get(trans.fromAddress) || 0;
                this.utxoSet.set(trans.fromAddress, currentBalance - trans.amount);
            }
            
            // Alıcı adresin bakiyesini artır
            if (trans.toAddress) {
                const currentBalance = this.utxoSet.get(trans.toAddress) || 0;
                this.utxoSet.set(trans.toAddress, currentBalance + trans.amount);
            }
        }
        
        console.log('📊 UTXO set güncellendi. Mevcut bakiyeler:', Object.fromEntries(this.utxoSet));
    }

    // UTXO set'ini sıfırdan oluştur (Blockchain'i yeniden tararsa)
    rebuildUtxoSet() {
        console.log('🔄 UTXO set yeniden oluşturuluyor...');
        this.utxoSet.clear();
        
        for (const block of this.chain) {
            if (Array.isArray(block.data)) {
                this.updateUtxoSet(block.data);
            }
        }
        
        console.log('✅ UTXO set yeniden oluşturuldu');
    }

    // Tüm adresleri getir
    getAllAddresses() {
        const addresses = new Set();
        for (const block of this.chain) {
            if (Array.isArray(block.data)) {
                for (const trans of block.data) {
                    if (trans.fromAddress) addresses.add(trans.fromAddress);
                    if (trans.toAddress) addresses.add(trans.toAddress);
                }
            }
        }
        return Array.from(addresses);
    }

    // Blockchain'in geçerliliğini kontrol et
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Mevcut bloğun hash'ini kontrol et
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('❌ Geçersiz hash tespit edildi:', currentBlock.hash);
                return false;
            }

            // Önceki blok bağlantısını kontrol et
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('❌ Geçersiz blok bağlantısı tespit edildi');
                return false;
            }

            // Mining geçerliliğini kontrol et
            if (!currentBlock.isValidHash(this.difficulty)) {
                console.log('❌ Geçersiz mining tespit edildi - difficulty koşulu sağlanmıyor');
                return false;
            }
        }

        // UTXO consistency kontrolü
        console.log('🔍 UTXO set tutarlılığı kontrol ediliyor...');
        const tempUtxo = new Map();
        for (const block of this.chain) {
            if (Array.isArray(block.data)) {
                for (const trans of block.data) {
                    if (trans.fromAddress) {
                        const balance = tempUtxo.get(trans.fromAddress) || 0;
                        tempUtxo.set(trans.fromAddress, balance - trans.amount);
                    }
                    if (trans.toAddress) {
                        const balance = tempUtxo.get(trans.toAddress) || 0;
                        tempUtxo.set(trans.toAddress, balance + trans.amount);
                    }
                }
            }
        }

        // UTXO set karşılaştırması
        for (const [address, balance] of tempUtxo) {
            if (this.utxoSet.get(address) !== balance) {
                console.log(`❌ UTXO tutarsızlığı: ${address} - Beklenen: ${balance}, Mevcut: ${this.utxoSet.get(address)}`);
                return false;
            }
        }

        console.log('✅ Blockchain ve UTXO set geçerli! (Crypto-JS Edition)');
        return true;
    }

    // Mining zorluğunu ayarla
    adjustDifficulty(targetTimeMs = 10000) {
        if (this.miningStats.lastMiningTime) {
            if (this.miningStats.lastMiningTime < targetTimeMs / 2) {
                this.difficulty++;
                console.log(`⬆️ Difficulty artırıldı: ${this.difficulty}`);
            } else if (this.miningStats.lastMiningTime > targetTimeMs * 2 && this.difficulty > 1) {
                this.difficulty--;
                console.log(`⬇️ Difficulty azaltıldı: ${this.difficulty}`);
            }
        }
    }

    // Blockchain'i görüntüle
    displayBlockchain() {
        console.log('\n=== CRYPTO-JS BLOCKCHAIN BİLGİLERİ ===');
        console.log(`🆔 Blockchain ID: ${this.id}`);
        console.log(`📊 UTXO Set: ${JSON.stringify(Object.fromEntries(this.utxoSet), null, 2)}`);
        console.log(`⛏️ Mining İstatistikleri:`, this.miningStats);
        
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