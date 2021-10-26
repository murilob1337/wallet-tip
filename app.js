const chalk = require('chalk')
const prompts = require('prompts')
const bip39 = require('bip39')
const base58 = require('base58-encode')
const HDkey = require('hdkey')
const createHash = require('create-hash')
const ethHDkey = require('ethereumjs-wallet')

!(async () => {
    const createMnemonic = await prompts({
        type: 'confirm',
        name: 'value',
        message: 'Create Mnemonic?',
        initial: true
    });

    if (createMnemonic.value) {
        // BTC
        var mnemonic = bip39.generateMnemonic()
        console.log('MNEUMONIC: ', chalk.magenta(mnemonic))
        var seed = bip39.mnemonicToSeedSync(mnemonic)
        console.log('BIP39 SEED: ', chalk.cyan(seed.toString('hex')))
        var hdkey = HDkey.fromMasterSeed(Buffer.from(seed, 'hex'))
        var addrnode = hdkey.derive("m/0/0")
        console.log('PRIVATE KEY BIP32 ROOT: ', chalk.red(hdkey.privateExtendedKey))
        console.log('PRIVATE EXTENDED KEY: ', chalk.red(addrnode.privateExtendedKey))
        console.log('PUBLIC EXTENDED KEY: ', chalk.green(addrnode.publicExtendedKey))
        var publicKey = addrnode.publicKey
        // DIGEST
        var digest1 = createHash('sha256').update(publicKey).digest()
        var digest2 = createHash('rmd160').update(digest1).digest()
        var digest3 = Buffer.allocUnsafe(21)
        digest3.writeUInt8(0x00, 0)
        digest2.copy(digest3, 1)
        var digest4 = createHash('sha256').update(digest3).digest()
        var digest5 = createHash('sha256').update(digest4).digest()
        // BASE, CHECKSUM, ADDRESS
        var digest6 = digest5.slice(0, 4)
        var digest7 = Buffer.concat([digest3, digest6])
        var addressBTC = base58(digest7)
        console.log('BTC ADDRESS: ', chalk.yellow(addressBTC))
        // ETH
        var ethhdkey = ethHDkey.hdkey.fromMasterSeed(Buffer.from(seed, 'hex'))
        var ethaddrnode = ethhdkey.derivePath("m/0/0").getWallet()
        var addressETH = `0x${ethaddrnode.getAddress().toString('hex')}`
        console.log('ETH ADDRESS: ', chalk.blue(addressETH))
    } else {
        const getXPRV = await prompts({
            type: 'text',
            name: 'value',
            message: `Private Key [XPRV]:`
        });
        var xprv = getXPRV.value
        // BTC
        var hdkey = HDkey.fromExtendedKey(xprv)
        var addrnode = hdkey.derive("m/0/0")
        console.log('PRIVATE KEY BIP32 ROOT: ', chalk.red(hdkey.privateExtendedKey))
        console.log('PRIVATE EXTENDED KEY: ', chalk.red(addrnode.privateExtendedKey))
        console.log('PUBLIC EXTENDED KEY: ', chalk.green(addrnode.publicExtendedKey))
        var publicKey = addrnode.publicKey
        // DIGEST
        var digest1 = createHash('sha256').update(publicKey).digest()
        var digest2 = createHash('rmd160').update(digest1).digest()
        var digest3 = Buffer.allocUnsafe(21)
        digest3.writeUInt8(0x00, 0)
        digest2.copy(digest3, 1)
        var digest4 = createHash('sha256').update(digest3).digest()
        var digest5 = createHash('sha256').update(digest4).digest()
        // BASE, CHECKSUM, ADDRESS
        var digest6 = digest5.slice(0, 4)
        var digest7 = Buffer.concat([digest3, digest6])
        var addressBTC = base58(digest7)
        console.log('BTC ADDRESS: ', chalk.yellow(addressBTC))
        // ETH
        var ethhdkey = ethHDkey.hdkey.fromExtendedKey(xprv);
        var ethaddrnode = ethhdkey.derivePath("m/0/0").getWallet()
        var addressETH = `0x${ethaddrnode.getAddress().toString('hex')}`
        console.log('ETH ADDRESS: ', chalk.blue(addressETH))
    }
})()