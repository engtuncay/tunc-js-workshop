// Node.js Crypto modülü ile Blockchain Demo
import { Blockchain } from './blockchain-node.js';

console.log('🚀 Node.js Crypto Blockchain Demo Başlıyor');
console.log('==========================================\n');

// Blockchain oluştur
const myBlockchain = new Blockchain();

console.log('📦 Yeni blockchain oluşturuldu');
myBlockchain.displayBlockchain();

// İlk işlemleri oluştur
console.log('\n🔄 İşlemler oluşturuluyor...');

try {
    myBlockchain.createTransaction({
        fromAddress: null, // Genesis transaction
        toAddress: 'ahmet-wallet',
        amount: 1000
    });

    myBlockchain.createTransaction({
        fromAddress: 'ahmet-wallet',
        toAddress: 'mehmet-wallet',
        amount: 250
    });

    myBlockchain.createTransaction({
        fromAddress: 'ahmet-wallet',
        toAddress: 'ayse-wallet',
        amount: 150
    });
} catch (error) {
    console.error('❌ İşlem hatası:', error.message);
}

// İlk mining
console.log('\n⛏️ İlk mining işlemi başlıyor...');
const result1 = myBlockchain.minePendingTransactions('miner1-wallet');

console.log('\n📊 Mining Sonucu 1:');
console.log(`   Hash: ${result1.hash}`);
console.log(`   Süre: ${result1.time}ms`);
console.log(`   Hash Rate: ${result1.hashRate} hash/s`);
console.log(`   Denemeler: ${result1.attempts}`);

// Bakiyeleri kontrol et
console.log('\n💰 Bakiyeler:');
const addresses = myBlockchain.getAllAddresses();
addresses.forEach(address => {
    const balance = myBlockchain.getBalance(address);
    console.log(`   ${address}: ${balance}`);
});

// Daha fazla işlem
console.log('\n🔄 Daha fazla işlem ekleniyor...');

try {
    myBlockchain.createTransaction({
        fromAddress: 'mehmet-wallet',
        toAddress: 'fatma-wallet',
        amount: 75
    });

    myBlockchain.createTransaction({
        fromAddress: 'ayse-wallet',
        toAddress: 'ali-wallet',
        amount: 50
    });
} catch (error) {
    console.error('❌ İşlem hatası:', error.message);
}

// İkinci mining
console.log('\n⛏️ İkinci mining işlemi başlıyor...');
const result2 = myBlockchain.minePendingTransactions('miner2-wallet');

console.log('\n📊 Mining Sonucu 2:');
console.log(`   Hash: ${result2.hash}`);
console.log(`   Süre: ${result2.time}ms`);
console.log(`   Hash Rate: ${result2.hashRate} hash/s`);
console.log(`   Denemeler: ${result2.attempts}`);

// Son bakiyeler
console.log('\n💰 Final Bakiyeler:');
const finalAddresses = myBlockchain.getAllAddresses();
finalAddresses.forEach(address => {
    const balance = myBlockchain.getBalance(address);
    console.log(`   ${address}: ${balance}`);
});

// Blockchain geçerliliğini kontrol et
console.log('\n🔍 Blockchain Geçerlilik Kontrolü:');
const isValid = myBlockchain.isChainValid();
console.log(`Blockchain durumu: ${isValid ? '✅ Geçerli' : '❌ Geçersiz'}`);

// Final blockchain durumu
console.log('\n📋 Final Blockchain Durumu:');
myBlockchain.displayBlockchain();

// Performance testi
console.log('\n🚀 Performance Testi Başlıyor...');
console.log('Difficulty 4 ile 5 işlem mining ediliyor...');

const startTime = Date.now();

// Difficulty'yi artır
myBlockchain.difficulty = 4;

// Çok sayıda işlem ekle
for (let i = 0; i < 5; i++) {
    myBlockchain.createTransaction({
        fromAddress: 'test-sender',
        toAddress: `test-receiver-${i}`,
        amount: 10
    });
}

// Performance mining
const perfResult = myBlockchain.minePendingTransactions('perf-miner');
const totalTime = Date.now() - startTime;

console.log('\n📊 Performance Test Sonuçları:');
console.log(`   Toplam Süre: ${totalTime}ms`);
console.log(`   Mining Süresi: ${perfResult.time}ms`);
console.log(`   Hash Rate: ${perfResult.hashRate} hash/s`);
console.log(`   Toplam Denemeler: ${perfResult.attempts}`);
console.log(`   Difficulty: ${myBlockchain.difficulty}`);

// Export blockchain
console.log('\n📤 Blockchain Export Ediliyor...');
const exportedChain = myBlockchain.exportChain();
console.log('✅ Blockchain export edildi (güvenlik anahtarları hariç)');
console.log(`   Network ID: ${exportedChain.networkId}`);
console.log(`   Toplam Blok: ${exportedChain.chain.length}`);

console.log('\n🎉 Node.js Crypto Blockchain Demo Tamamlandı!');
console.log('==========================================');