import { Block } from './block-node.js';
import crypto from 'crypto';

// Blockchain sınıfı - Node.js Crypto modülü versiyonu
export class Blockchain {

    id = Math.floor(Math.random() * 1000) + 1;

    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 3; // Node.js daha hızlı olduğu için difficulty artırıldı
        this.pendingTransactions = [];
        this.miningReward = 100;
        
        // UTXO sistemi
        this.utxoSet = new Map();
        this.addressIndex = new Map();
        
        // Mining istatistikleri
        this.miningStats = {
            totalBlocks: 1,
            totalMiningTime: 0,
            averageHashRate: 0,
            lastMiningTime: null,
            totalHashAttempts: 0
        };

        // Blockchain güvenlik
        this.privateKey = this.generatePrivateKey();
        this.networkId = this.generateNetworkId();
        
        console.log(`🔐 Blockchain güvenlik anahtarları oluşturuldu`);
        console.log(`🌐 Network ID: ${this.networkId}`);
    }

    // Private key oluştur
    generatePrivateKey() {
        return crypto.randomBytes(32).toString('hex');
    }

    // Network ID oluştur
    generateNetworkId() {
        return crypto.createHash('sha256').update(this.id.toString() + Date.now()).digest('hex').substring(0, 16);
    }

    // Genesis block oluşturma
    createGenesisBlock() {
        const genesisBlock = new Block(Date.now(), "Genesis Block - Node.js Crypto Edition", "0");
        genesisBlock.signBlock(this.privateKey);
        console.log("✨ Genesis Block oluşturuldu ve imzalandı (Node.js Crypto)");
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
            amount: this.miningReward,
            timestamp: Date.now()
        };
        this.pendingTransactions.push(rewardTransaction);

        // Yeni blok oluştur
        const block = new Block(
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        
        // Bloğu mine et
        console.log(`🔥 Blok #${this.chain.length} mining başlıyor (Node.js)...`);
        const miningResult = block.mineBlock(this.difficulty);
        
        // Bloğu imzala
        block.signBlock(this.privateKey);
        
        console.log('✅ Blok başarıyla mine edildi ve imzalandı!');
        this.chain.push(block);
        
        // İstatistikleri güncelle
        this.updateMiningStats(miningResult);
        
        // Difficulty'yi otomatik ayarla
        this.autoAdjustDifficulty();
        
        // UTXO set'ini güncelle
        this.updateUtxoSet(this.pendingTransactions);
        
        // Bekleyen işlemleri temizle
        this.pendingTransactions = [];
        
        return miningResult;
    }

    // Mining istatistiklerini güncelle
    updateMiningStats(result) {
        this.miningStats.totalBlocks++;
        this.miningStats.totalMiningTime += result.time;
        this.miningStats.totalHashAttempts += result.attempts;
        this.miningStats.averageHashRate = Math.round(
            this.miningStats.totalHashAttempts / (this.miningStats.totalMiningTime / 1000)
        );
        this.miningStats.lastMiningTime = result.time;
        
        console.log(`📊 Mining İstatistikleri:`);
        console.log(`   Toplam Blok: ${this.miningStats.totalBlocks}`);
        console.log(`   Ortalama Hash Rate: ${this.miningStats.averageHashRate} hash/s`);
        console.log(`   Son Mining Süresi: ${this.miningStats.lastMiningTime}ms`);
        console.log(`   Toplam Hash Denemesi: ${this.miningStats.totalHashAttempts}`);
    }

    // Difficulty'yi otomatik ayarla (Node.js versiyonu)
    autoAdjustDifficulty(targetTimeMs = 15000) {
        if (this.miningStats.lastMiningTime) {
            if (this.miningStats.lastMiningTime < targetTimeMs / 3) {
                this.difficulty++;
                console.log(`⬆️ Difficulty otomatik artırıldı: ${this.difficulty}`);
            } else if (this.miningStats.lastMiningTime > targetTimeMs * 2 && this.difficulty > 1) {
                this.difficulty--;
                console.log(`⬇️ Difficulty otomatik azaltıldı: ${this.difficulty}`);
            }
        }
    }

    // Yeni işlem oluştur (güvenlik kontrolü ile)
    createTransaction(transaction) {
        // İşlem geçerliliği kontrolü
        if (transaction.fromAddress && transaction.amount > 0) {
            const senderBalance = this.getBalance(transaction.fromAddress);
            if (senderBalance < transaction.amount) {
                throw new Error(`❌ Yetersiz bakiye! Mevcut: ${senderBalance}, Gerekli: ${transaction.amount}`);
            }
        }
        
        // İşlem hash'i ve imzasını oluştur
        transaction.hash = this.createTransactionHash(transaction);
        transaction.signature = this.signTransaction(transaction);
        transaction.timestamp = Date.now();
        
        this.pendingTransactions.push(transaction);
        console.log(`✨ Yeni işlem eklendi ve imzalandı:`);
        console.log(`   ${transaction.fromAddress || 'Mining'} -> ${transaction.toAddress}: ${transaction.amount}`);
        console.log(`   Hash: ${transaction.hash}`);
        console.log(`   Signature: ${transaction.signature.substring(0, 16)}...`);
    }

    // İşlem hash'i oluştur
    createTransactionHash(transaction) {
        const transactionString = `${transaction.fromAddress}${transaction.toAddress}${transaction.amount}${Date.now()}`;
        return crypto.createHash('sha256').update(transactionString).digest('hex');
    }

    // İşlem imzalama
    signTransaction(transaction) {
        const transactionData = `${transaction.fromAddress}${transaction.toAddress}${transaction.amount}${transaction.hash}`;
        return crypto.createHmac('sha256', this.privateKey).update(transactionData).digest('hex');
    }

    // İşlem imzasını doğrula
    verifyTransaction(transaction) {
        const transactionData = `${transaction.fromAddress}${transaction.toAddress}${transaction.amount}${transaction.hash}`;
        const expectedSignature = crypto.createHmac('sha256', this.privateKey).update(transactionData).digest('hex');
        return transaction.signature === expectedSignature;
    }

    // Adres bakiyesini hesapla
    getBalance(address) {
        if (this.utxoSet.has(address)) {
            return this.utxoSet.get(address);
        }

        console.warn(`⚠️ UTXO set'inde ${address} bulunamadı, tüm bloklar taranıyor...`);
        return this.calculateBalanceFromBlocks(address);
    }

    // Blokları tarayarak bakiye hesapla
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

    // UTXO set'ini güncelle
    updateUtxoSet(transactions) {
        for (const trans of transactions) {
            if (trans.fromAddress) {
                const currentBalance = this.utxoSet.get(trans.fromAddress) || 0;
                this.utxoSet.set(trans.fromAddress, currentBalance - trans.amount);
            }
            
            if (trans.toAddress) {
                const currentBalance = this.utxoSet.get(trans.toAddress) || 0;
                this.utxoSet.set(trans.toAddress, currentBalance + trans.amount);
            }
        }
        
        console.log('📊 UTXO set güncellendi');
    }

    // UTXO set'ini yeniden oluştur
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

    // Blockchain'in geçerliliğini kontrol et (gelişmiş)
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            // Hash kontrolü
            if (currentBlock.hash !== currentBlock.calculateHash()) {
                console.log('❌ Geçersiz hash tespit edildi:', currentBlock.hash);
                return false;
            }

            // Önceki blok bağlantısı kontrolü
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log('❌ Geçersiz blok bağlantısı tespit edildi');
                return false;
            }

            // Mining geçerliliği kontrolü
            if (!currentBlock.isValidHash(this.difficulty)) {
                console.log('❌ Geçersiz mining tespit edildi');
                return false;
            }

            // Blok imzası kontrolü
            if (currentBlock.signature && !currentBlock.verifySignature(this.privateKey)) {
                console.log('❌ Geçersiz blok imzası tespit edildi');
                return false;
            }

            // İşlem imzaları kontrolü
            if (Array.isArray(currentBlock.data)) {
                for (const trans of currentBlock.data) {
                    if (trans.signature && !this.verifyTransaction(trans)) {
                        console.log('❌ Geçersiz işlem imzası tespit edildi');
                        return false;
                    }
                }
            }
        }

        // UTXO tutarlılığı kontrolü
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

        for (const [address, balance] of tempUtxo) {
            if (this.utxoSet.get(address) !== balance) {
                console.log(`❌ UTXO tutarsızlığı: ${address}`);
                return false;
            }
        }

        console.log('✅ Blockchain tamamen geçerli! (Node.js Crypto Edition)');
        return true;
    }

    // Blockchain'i görüntüle
    displayBlockchain() {
        console.log('\n=== NODE.JS CRYPTO BLOCKCHAIN BİLGİLERİ ===');
        console.log(`🆔 Blockchain ID: ${this.id}`);
        console.log(`🌐 Network ID: ${this.networkId}`);
        console.log(`🔐 Private Key: ${this.privateKey.substring(0, 16)}...`);
        console.log(`📊 UTXO Set: ${JSON.stringify(Object.fromEntries(this.utxoSet), null, 2)}`);
        console.log(`⛏️ Mining İstatistikleri:`, this.miningStats);
        
        this.chain.forEach((block, index) => {
            console.log(`\n--- Blok ${index} ---`);
            console.log(`Timestamp: ${new Date(block.timestamp).toLocaleString()}`);
            console.log(`Previous Hash: ${block.previousHash}`);
            console.log(`Hash: ${block.hash}`);
            console.log(`Nonce: ${block.nonce}`);
            console.log(`Signature: ${block.signature ? block.signature.substring(0, 16) + '...' : 'Yok'}`);
            console.log(`Data: ${JSON.stringify(block.data, null, 2)}`);
        });
    }

    // Blockchain export et (güvenlik anahtarları hariç)
    exportChain() {
        return {
            id: this.id,
            networkId: this.networkId,
            chain: this.chain.map(block => ({
                timestamp: block.timestamp,
                data: block.data,
                previousHash: block.previousHash,
                hash: block.hash,
                nonce: block.nonce
                // signature dahil edilmez (güvenlik)
            })),
            difficulty: this.difficulty,
            miningStats: this.miningStats
        };
    }
}