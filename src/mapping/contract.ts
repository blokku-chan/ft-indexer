import {DataHandlerContext} from '@subsquid/evm-processor'
import {Store} from '../db'
import {EntityBuffer} from '../entityBuffer'
import {ContractEventTrade, ContractFunctionBuyShares, ContractFunctionSellShares} from '../model'
import * as spec from '../abi/ft'
import {Log, Transaction} from '../processor'

const address = '0xcf205808ed36593aa40a44f10c7f7c2f67d4a4d4'


export function parseEvent(ctx: DataHandlerContext<Store>, log: Log) {
    try {
        switch (log.topics[0]) {
            case spec.events['Trade'].topic: {
                let e = spec.events['Trade'].decode(log)
                EntityBuffer.add(
                    new ContractEventTrade({
                        id: log.id,
                        blockNumber: log.block.height,
                        blockTimestamp: new Date(log.block.timestamp),
                        transactionHash: log.transactionHash,
                        contract: log.address,
                        eventName: 'Trade',
                        trader: e[0],
                        subject: e[1],
                        isBuy: e[2],
                        shareAmount: e[3],
                        ethAmount: e[4],
                        protocolEthAmount: e[5],
                        subjectEthAmount: e[6],
                        supply: e[7],
                    })
                )
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: log.block.height, blockHash: log.block.hash, address}, `Unable to decode event "${log.topics[0]}"`)
    }
}

export function parseFunction(ctx: DataHandlerContext<Store>, transaction: Transaction) {
    try {
        switch (transaction.input.slice(0, 10)) {
            case spec.functions['buyShares'].sighash: {
                let f = spec.functions['buyShares'].decode(transaction.input)
                EntityBuffer.add(
                    new ContractFunctionBuyShares({
                        id: transaction.id,
                        blockNumber: transaction.block.height,
                        blockTimestamp: new Date(transaction.block.timestamp),
                        transactionHash: transaction.hash,
                        contract: transaction.to!,
                        functionName: 'buyShares',
                        functionValue: transaction.value,
                        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                        sharesSubject: f[0],
                        amount: f[1],
                    })
                )
                break
            }
            case spec.functions['sellShares'].sighash: {
                let f = spec.functions['sellShares'].decode(transaction.input)
                EntityBuffer.add(
                    new ContractFunctionSellShares({
                        id: transaction.id,
                        blockNumber: transaction.block.height,
                        blockTimestamp: new Date(transaction.block.timestamp),
                        transactionHash: transaction.hash,
                        contract: transaction.to!,
                        functionName: 'sellShares',
                        functionValue: transaction.value,
                        functionSuccess: transaction.status != null ? Boolean(transaction.status) : undefined,
                        sharesSubject: f[0],
                        amount: f[1],
                    })
                )
                break
            }
        }
    }
    catch (error) {
        ctx.log.error({error, blockNumber: transaction.block.height, blockHash: transaction.block.hash, address}, `Unable to decode function "${transaction.input.slice(0, 10)}"`)
    }
}
