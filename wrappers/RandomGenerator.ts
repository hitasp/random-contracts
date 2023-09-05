import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type RandomGeneratorConfig = {};

export function randomGeneratorConfigToCell(config: RandomGeneratorConfig): Cell {
    return beginCell().endCell();
}

export class RandomGenerator implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    static createFromAddress(address: Address) {
        return new RandomGenerator(address);
    }

    static createFromConfig(config: RandomGeneratorConfig, code: Cell, workchain = 0) {
        const data = randomGeneratorConfigToCell(config);
        const init = { code, data };
        return new RandomGenerator(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get_random_tuple(provider: ContractProvider, n: number, min: number, max: number, seed: number) {
        const result = await provider.get('random_generator', [
            {
                type: 'int',
                value: BigInt(n)
            },
            {
                type: 'int',
                value: BigInt(min)
            },
            {
                type: 'int',
                value: BigInt(max)
            },
            {
                type: 'int',
                value: BigInt(seed)
            },
        ]);

        return [result.stack.readTuple(), result.gasUsed];
    }
}
