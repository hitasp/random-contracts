import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from 'ton-core';

export type ProofOfUniformnessConfig = {};

export function proofOfUniformnessConfigToCell(config: ProofOfUniformnessConfig): Cell {
    return beginCell().endCell();
}

export class ProofOfUniformness implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new ProofOfUniformness(address);
    }

    static createFromConfig(config: ProofOfUniformnessConfig, code: Cell, workchain = 0) {
        const data = proofOfUniformnessConfigToCell(config);
        const init = { code, data };
        return new ProofOfUniformness(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async get_random(provider: ContractProvider,) {
        const result = await provider.get('get_random', []);
        return result.stack.readTuple();
    }
}
