# Token Mover

This is a helper contract to enable mass transfers of ERC20, ERC721 (NFT), and ERC1155 tokens.

Deployed to Polygon: [0x119E715fF87FeD19C0E883ab72C56f5A4f5C0288](https://polygonscan.com/address/0x119E715fF87FeD19C0E883ab72C56f5A4f5C0288#writeContract)

Deployed to Mumbai: [0x95c465b1a3242c8e336B0f1c9F827E145B17bf6C](https://mumbai.polygonscan.com/address/0x95c465b1a3242c8e336B0f1c9F827E145B17bf6C#writeContract)

---

## Dev

### Install project
```bash
npm install
```

### Compile
```bash
npx hardhat compile
```

### Test
```bash
npx hardhat test
npx hardhat coverage
```

## Deploy
```bash
npx hardhat run --network mumbai scripts/deploy.js

❯ TokenMover deployed at 0x95c465b1a3242c8e336B0f1c9F827E145B17bf6C
```

### Verify
```bash
npx hardhat verify --network mumbai 0x95c465b1a3242c8e336B0f1c9F827E145B17bf6C
```
