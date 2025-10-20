import { Blockchain } from './blockchain.js';

// Blockchain örneği oluştur
const myBlockchain = new Blockchain();

console.log('=== BLOCKCHAIN DEMO ===\n');

// İlk durumu göster
console.log('1. Başlangıç durumu:');
myBlockchain.displayBlockchain();

// İşlemler oluştur
console.log('\n2. İşlemler oluşturuluyor...');
myBlockchain.createTransaction({
    fromAddress: 'ahmet-wallet',
    toAddress: 'mehmet-wallet',
    amount: 50
});

myBlockchain.createTransaction({
    fromAddress: 'mehmet-wallet',
    toAddress: 'ayse-wallet',
    amount: 25
});

// İşlemleri mine et
console.log('\n3. İşlemler mine ediliyor...');
myBlockchain.minePendingTransactions('miner1-wallet');

// Güncel durumu göster
console.log('\n4. Mining sonrası durum:');
myBlockchain.displayBlockchain();

// Bakiyeleri kontrol et
console.log('\n5. Bakiye kontrolü:');
console.log(`Ahmet bakiye: ${myBlockchain.getBalance('ahmet-wallet')}`);
console.log(`Mehmet bakiye: ${myBlockchain.getBalance('mehmet-wallet')}`);
console.log(`Ayşe bakiye: ${myBlockchain.getBalance('ayse-wallet')}`);
console.log(`Miner1 bakiye: ${myBlockchain.getBalance('miner1-wallet')}`);

// Yeni işlemler ekle
console.log('\n6. Yeni işlemler ekleniyor...');
myBlockchain.createTransaction({
    fromAddress: 'miner1-wallet',
    toAddress: 'ahmet-wallet',
    amount: 30
});

myBlockchain.createTransaction({
    fromAddress: 'ayse-wallet',
    toAddress: 'mehmet-wallet',
    amount: 10
});

// İkinci mining
console.log('\n7. İkinci mining işlemi...');
myBlockchain.minePendingTransactions('miner2-wallet');

// Final durumu
console.log('\n8. Final durumu:');
myBlockchain.displayBlockchain();

// Final bakiyeleri
console.log('\n9. Final bakiyeleri:');
console.log(`Ahmet bakiye: ${myBlockchain.getBalance('ahmet-wallet')}`);
console.log(`Mehmet bakiye: ${myBlockchain.getBalance('mehmet-wallet')}`);
console.log(`Ayşe bakiye: ${myBlockchain.getBalance('ayse-wallet')}`);
console.log(`Miner1 bakiye: ${myBlockchain.getBalance('miner1-wallet')}`);
console.log(`Miner2 bakiye: ${myBlockchain.getBalance('miner2-wallet')}`);

// Blockchain geçerliliğini kontrol et
console.log('\n10. Blockchain geçerlilik kontrolü:');
myBlockchain.isChainValid();

// Blockchain'i manipüle etmeye çalış (örnek saldırı)
console.log('\n11. Blockchain güvenlik testi (saldırı simülasyonu):');
console.log('Geçmiş bir bloğun verisini değiştirmeye çalışıyoruz...');
myBlockchain.chain[1].data = [{
    fromAddress: 'sahtekar-wallet',
    toAddress: 'sahtekar-wallet',
    amount: 1000000
}];

console.log('Manipülasyon sonrası geçerlilik kontrolü:');
myBlockchain.isChainValid();