// Node.js Blockchain Test - Crypto-JS yerine Node.js crypto modülü kullanır
import { Block } from './block-node-crypto.js';
import { Blockchain } from './blockchain-node-crypto.js';

console.log('🚀 Node.js Crypto Blockchain Test Başlıyor...\n');

// Yeni blockchain oluştur
const myBlockchain = new Blockchain();

console.log('📊 İlk durum:');
myBlockchain.displayBlockchain();

// Test: Başlangıç bakiyelerini oluştur
console.log('\n🪙 Başlangıç bakiyelerini oluşturuyor...');
myBlockchain.initializeBalances();

// Test: Bakiyeleri kontrol et
console.log('\n💰 Tüm bakiyeler:');
myBlockchain.displayAllBalances();

// Test: İşlem oluştur
console.log('\n📝 İşlem oluşturuluyor...');
try {
    myBlockchain.createTransaction({
        fromAddress: 'ahmet-wallet',
        toAddress: 'mehmet-wallet',
        amount: 100
    });

    myBlockchain.createTransaction({
        fromAddress: 'ayse-wallet',
        toAddress: 'miner1-wallet',
        amount: 50
    });

    console.log('✅ İşlemler başarıyla oluşturuldu');
} catch (error) {
    console.error('❌ İşlem hatası:', error.message);
}

// Test: Bekleyen işlemleri mine et
console.log('\n⛏️ Bekleyen işlemler mine ediliyor...');
const miningResult = myBlockchain.minePendingTransactions('miner1-wallet');

console.log(`\n📊 Mining Sonuçları:`);
console.log(`Hash: ${miningResult.hash}`);
console.log(`Süre: ${miningResult.time}ms`);
console.log(`Hash Rate: ${miningResult.hashRate} hash/s`);
console.log(`Nonce: ${miningResult.nonce}`);

// Test: Güncellenmiş bakiyeler
console.log('\n💰 Mining sonrası bakiyeler:');
myBlockchain.displayAllBalances();

// Test: Blockchain geçerliliği
console.log('\n🔍 Blockchain geçerliliği kontrol ediliyor...');
const isValid = myBlockchain.isChainValid();
console.log(`Blockchain geçerli: ${isValid ? '✅' : '❌'}`);

// Test: Bireysel bakiye sorgusu
console.log('\n🔍 Bireysel bakiye sorguları:');
const addresses = ['ahmet-wallet', 'mehmet-wallet', 'ayse-wallet', 'miner1-wallet'];
addresses.forEach(address => {
    const balance = myBlockchain.getBalance(address);
    console.log(`${address}: ${balance} coin`);
});

// Test: Difficulty ayarlama
console.log('\n⚙️ Difficulty ayarlama testi...');
console.log(`Mevcut difficulty: ${myBlockchain.difficulty}`);
myBlockchain.adjustDifficulty();
console.log(`Yeni difficulty: ${myBlockchain.difficulty}`);

// Test: Daha fazla mining
console.log('\n⛏️ Ek mining yapılıyor...');
for (let i = 0; i < 2; i++) {
    myBlockchain.createTransaction({
        fromAddress: null, // Mining reward
        toAddress: 'miner1-wallet',
        amount: 100
    });
    
    const result = myBlockchain.minePendingTransactions('miner1-wallet');
    console.log(`Blok ${i + 2} mine edildi: ${result.hash.substring(0, 16)}...`);
}

// Son durum
console.log('\n📊 Final Blockchain Durumu:');
myBlockchain.displayBlockchain();

console.log('\n🎉 Node.js Crypto Blockchain Test Tamamlandı!');