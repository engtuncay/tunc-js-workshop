# 🔗 Blockchain Implementations Comparison

Bu proje, aynı blockchain mantığının farklı ortamlarda nasıl çalıştığını gösterir.

## 📊 Karşılaştırma Tablosu

| Özellik | Browser (Crypto-JS) | Node.js (Native Crypto) |
|---------|---------------------|--------------------------|
| **Hash Algoritması** | CryptoJS.SHA256() | crypto.createHash('sha256') |
| **Performans** | Orta (CDN bağımlı) | Yüksek (Native) |
| **Güvenlik** | Yüksek ✅ | Yüksek ✅ |
| **Bağımlılık** | External CDN | Built-in Module |
| **Platform** | Browser Only | Node.js Only |
| **Hash Rate** | ~50K hash/s | ~110K hash/s |

## 🚀 Kullanım

### Browser Version
```bash
# HTTP server başlat
npm run serve
# http://localhost:8000/index.html
```

### Node.js Version
```bash
# Node.js crypto test
npm run node-crypto

# Development mode
npm run dev-node-crypto
```

## 📁 Dosya Yapısı

```
blockchain/
├── browser/                    # Browser versiyonları
│   ├── block-browser-crypto.js    # Crypto-JS kullanır
│   ├── blockchain-browser-crypto.js
│   └── index.html                 # UI ile demo
├── node/                       # Node.js versiyonları  
│   ├── block-node-crypto.js       # Native crypto kullanır
│   ├── blockchain-node-crypto.js
│   └── test-node-crypto.js        # CLI test
└── package.json
```

## 🔧 API Uyumluluğu

Her iki versiyon da aynı API'yi kullanır:

```javascript
// Blockchain oluştur
const blockchain = new Blockchain();

// Başlangıç bakiyelerini oluştur
blockchain.initializeBalances();

// İşlem oluştur
blockchain.createTransaction({
    fromAddress: 'ahmet-wallet',
    toAddress: 'mehmet-wallet', 
    amount: 100
});

// Mining yap
const result = blockchain.minePendingTransactions('miner-wallet');

// Bakiye kontrol et
const balance = blockchain.getBalance('ahmet-wallet');
```

## ⚡ Performans Farkları

**Node.js Native Crypto:**
- ✅ Daha hızlı hash hesaplama (~110K hash/s)
- ✅ Memory efficient
- ✅ No external dependencies

**Browser Crypto-JS:**
- ✅ Cross-platform compatibility  
- ✅ User-friendly interface
- ❌ CDN dependency (~50K hash/s)

## 🔒 Güvenlik

Her iki versiyon de:
- ✅ SHA-256 hash algoritması
- ✅ Proof of Work mining
- ✅ Transaction validation
- ✅ UTXO set management
- ✅ Chain integrity validation

## 🎯 Kullanım Senaryoları

**Browser Version:** 
- Educational demos
- Interactive blockchain visualization
- Web-based blockchain tools

**Node.js Version:**
- Server-side blockchain applications
- High-performance mining
- Backend blockchain services
- CLI blockchain tools