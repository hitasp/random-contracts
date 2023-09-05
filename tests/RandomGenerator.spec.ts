import { Blockchain, SandboxContract } from '@ton-community/sandbox';
import { Cell, toNano } from 'ton-core';
import { RandomGenerator } from '../wrappers/RandomGenerator';
import '@ton-community/test-utils';
import { compile } from '@ton-community/blueprint';

describe('RandomGenerator', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('RandomGenerator');
    });

    let blockchain: Blockchain;
    let randomGenerator: SandboxContract<RandomGenerator>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        randomGenerator = blockchain.openContract(RandomGenerator.createFromConfig({}, code));

        const deployer = await blockchain.treasury('deployer');

        const deployResult = await randomGenerator.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: randomGenerator.address,
            deploy: true,
            success: true,
        });
    });

    it('Create Random Tuple', async () => {
        let n = 4;
        let min = 1;
        let max = 6;
        let seed = Math.floor(new Date().getTime() / 1000); // Unix time 
        let result = await randomGenerator.get_random_tuple(n, min, max, seed);
        console.log("Gas Used:", result[1]);
        console.log("Random Numbers:", result[0]);
    });
});
