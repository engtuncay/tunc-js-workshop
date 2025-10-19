# JavaScript Blockchain Uygulaması (ESM)

Bu klasörde ES Modules (ESM) kullanılarak yazılmış basit bir blockchain implementasyonu bulunmaktadır.

## Dosyalar

1. **block.js** - Tek bir bloğu temsil eden sınıf (ESM)
2. **blockchain.js** - Tüm blockchain'i yöneten ana sınıf (ESM)
3. **demo.js** - Node.js konsol uygulaması (ESM)
4. **test-esm.js** - ESM test dosyası 
5. **blockchain-demo.html** - Basit tarayıcı demo
6. **blockchain-esm-demo.html** - Modern ESM tarayıcı demo
7. **package.json** - ESM konfigürasyonu

## Özellikler

- ✅ ES Modules (import/export) kullanımı
- ✅ Modern JavaScript (async/await, classes)
- ✅ Block yapısı (hash, previousHash, timestamp, data, nonce)
- ✅ Genesis block oluşturma
- ✅ Proof of Work mining algoritması
- ✅ Transaction sistemi
- ✅ Balance hesaplama
- ✅ Chain validation (doğrulama)
- ✅ Mining reward sistemi
- ✅ Web Crypto API (SHA-256)
- ✅ Modern UI (CSS Grid, Flexbox)

## Kullanım

### Node.js ile Çalıştırma
```bash
# Demo çalıştır
npm start
# veya
node demo.js

# Test çalıştır
node test-esm.js

# Watch mode
npm run dev
```

### Tarayıcıda Çalıştırma
- **Basit demo**: `blockchain-demo.html` dosyasını tarayıcıda açın
- **Modern ESM demo**: `blockchain-esm-demo.html` dosyasını tarayıcıda açın

## Blockchain Nasıl Çalışır?

1. **Genesis Block**: İlk blok otomatik oluşturulur
2. **Transaction**: İşlemler pending listesine eklenir
3. **Mining**: Pending işlemler bir blokta toplanır ve mine edilir
4. **Proof of Work**: Belirli sayıda sıfır ile başlayan hash bulunur
5. **Chain Validation**: Tüm blokların bütünlüğü kontrol edilir

## Güvenlik

- Her blok önceki bloğun hash'ini içerir
- Hash değişirse tüm chain geçersiz olur
- Mining ile blok değiştirmek çok zor hale gelir
- Merkezi olmayan yapı (bu örnekte tek node)

## Teknik Detaylar

- **Hash Algoritması**: SHA-256 (Node.js) / Basit hash (Browser)
- **Mining Difficulty**: 2 (değiştirilebilir)
- **Mining Reward**: 100 coin
- **Block Structure**: Timestamp, Data, PreviousHash, Hash, Nonce