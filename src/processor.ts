import {EvmBatchProcessor, EvmBatchProcessorFields, BlockHeader, Log as _Log, Transaction as _Transaction} from '@subsquid/evm-processor'
import {lookupArchive} from '@subsquid/archive-registry'
import * as contractAbi from './abi/ft'

export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('base-mainnet', {type: 'EVM'}),
    })
    .setFields({
            log: {
                topics: true,
                data: true,
                transactionHash: true,
            },
            transaction: {
                hash: true,
                input: true,
                from: true,
                value: true,
                status: true,
        }
    })
    .addLog({
        address: ['0xcf205808ed36593aa40a44f10c7f7c2f67d4a4d4'],
        topic0: [
            contractAbi.events['Trade'].topic,
        ],
        range: {
            from: 2430440,
        },
    })
    .addTransaction({
        to: ['0xcf205808ed36593aa40a44f10c7f7c2f67d4a4d4'],
        sighash: [
            contractAbi.functions['buyShares'].sighash,
            contractAbi.functions['sellShares'].sighash,
        ],
        range: {
            from: 2430440,
        },
    })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
