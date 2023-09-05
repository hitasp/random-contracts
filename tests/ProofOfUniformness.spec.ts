import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { ProofOfUniformness } from '../wrappers/ProofOfUniformness';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('ProofOfUniformness', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('ProofOfUniformness');
    });

    let blockchain: Blockchain;
    let proofOfUniformness: SandboxContract<ProofOfUniformness>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        proofOfUniformness = blockchain.openContract(ProofOfUniformness.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await proofOfUniformness.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: proofOfUniformness.address,
            deploy: true,
            success: true,
        });
    });

    it('Proof of Uniformness', async () => {
        console.log("it generates 2000 samples between 0 and 1 which should be equally distributed:\n", await proofOfUniformness.get_random());
    });
});
