# JavaScript Blockchain Uygulaması (ESM)

Bu klasörde ES Modules (ESM) kullanılarak yazılmış basit bir blockchain implementasyonu bulunmaktadır.

## Dosyalar

### Node.js ESM Dosyaları:
1. **block.js** - Tek bir bloğu temsil eden sınıf (ESM - Node.js)
2. **blockchain.js** - Tüm blockchain'i yöneten ana sınıf (ESM - Node.js)
3. **demo.js** - Node.js konsol uygulaması (ESM)
4. **test-esm.js** - ESM test dosyası 
5. **package.json** - ESM konfigürasyonu

### Tarayıcı Dosyaları:
6. **block-browser.js** - Block sınıfı (tarayıcı uyumlu)
7. **blockchain-browser.js** - Blockchain sınıfı (tarayıcı uyumlu)
8. **blockchain-demo.html** - Modüler tarayıcı demo (dış script dosyaları kullanır)
9. **blockchain-esm-demo.html** - Modern ESM tarayıcı demo (inline script)

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

#### Lokal Server ile (Önerilen):
```bash
# Five Server ile
npx five-server --open=blockchain-demo.html

# veya Python ile
python -m http.server 8000
```

#### Demo Dosyaları:
- **Modüler demo**: `blockchain-demo.html` (dış script dosyaları kullanır)
- **Modern ESM demo**: `blockchain-esm-demo.html` (inline script)

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