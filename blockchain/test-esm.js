// ESM Blockchain Test Dosyası
import { Blockchain } from './blockchain.js';

console.log('🧪 ESM Blockchain Test Başlıyor...\n');

async function runTests() {
    try {
        // Test 1: Blockchain oluşturma
        console.log('Test 1: Blockchain oluşturma');
        const blockchain = new Blockchain();
        
        // Genesis block'un oluşmasını bekle
        await new Promise(resolve => setTimeout(resolve, 100));
        
        console.log(`✅ Genesis block oluşturuldu: ${blockchain.chain.length} blok`);
        
        // Test 2: İşlem oluşturma
        console.log('\nTest 2: İşlem oluşturma');
        blockchain.createTransaction({
            fromAddress: 'test-wallet-1',
            toAddress: 'test-wallet-2',
            amount: 100
        });
        
        blockchain.createTransaction({
            fromAddress: 'test-wallet-2',
            toAddress: 'test-wallet-3',
            amount: 50
        });
        
        console.log(`✅ ${blockchain.pendingTransactions.length} bekleyen işlem oluşturuldu`);
        
        // Test 3: Mining
        console.log('\nTest 3: Mining işlemi');
        console.log('Mining başlıyor...');
        
        const startTime = Date.now();
        const miningResult = await blockchain.minePendingTransactions('test-miner');
        const endTime = Date.now();
        
        console.log(`✅ Mining tamamlandı!`);
        if (miningResult) {
            console.log(`   Hash: ${miningResult.hash}`);
            console.log(`   Nonce: ${miningResult.nonce}`);
            console.log(`   Mining süresi: ${miningResult.time}ms`);
        }
        console.log(`   Toplam süre: ${endTime - startTime}ms`);
        console.log(`   Blockchain uzunluğu: ${blockchain.chain.length} blok`);
        
        // Test 4: Bakiye kontrolü
        console.log('\nTest 4: Bakiye kontrolü');
        const addresses = ['test-wallet-1', 'test-wallet-2', 'test-wallet-3', 'test-miner'];
        
        addresses.forEach(address => {
            const balance = blockchain.getBalance(address);
            console.log(`   ${address}: ${balance} coin`);
        });
        
        // Test 5: Chain validation
        console.log('\nTest 5: Blockchain doğrulama');
        const isValid = await blockchain.isChainValid();
        console.log(`✅ Blockchain geçerli: ${isValid}`);
        
        // Test 6: İkinci mining döngüsü
        console.log('\nTest 6: İkinci mining döngüsü');
        blockchain.createTransaction({
            fromAddress: 'test-wallet-3',
            toAddress: 'test-wallet-1',
            amount: 25
        });
        
        console.log('İkinci mining başlıyor...');
        const secondMining = await blockchain.minePendingTransactions('test-miner-2');
        console.log(`✅ İkinci mining tamamlandı: ${secondMining.hash.substring(0, 20)}...`);
        
        // Test 7: Final durumu
        console.log('\nTest 7: Final durumu');
        console.log(`Toplam blok sayısı: ${blockchain.chain.length}`);
        
        addresses.concat(['test-miner-2']).forEach(address => {
            const balance = blockchain.getBalance(address);
            console.log(`   ${address}: ${balance} coin`);
        });
        
        // Test 8: Blockchain bilgileri
        console.log('\nTest 8: Detaylı blockchain bilgileri');
        blockchain.chain.forEach((block, index) => {
            console.log(`\n--- Blok ${index} ---`);
            console.log(`Timestamp: ${new Date(block.timestamp).toLocaleString()}`);
            console.log(`Hash: ${block.hash.substring(0, 20)}...`);
            console.log(`Previous Hash: ${block.previousHash.substring(0, 20)}...`);
            console.log(`Nonce: ${block.nonce}`);
            
            if (Array.isArray(block.data)) {
                console.log(`İşlem sayısı: ${block.data.length}`);
                block.data.forEach((trans, i) => {
                    console.log(`  ${i + 1}. ${trans.fromAddress || 'Mining'} → ${trans.toAddress}: ${trans.amount}`);
                });
            } else {
                console.log(`Data: ${block.data}`);
            }
        });
        
        console.log('\n🎉 Tüm testler başarıyla tamamlandı!');
        
    } catch (error) {
        console.error('❌ Test hatası:', error);
    }
}

// Testleri çalıştır
runTests();