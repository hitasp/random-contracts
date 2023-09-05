import { toNano } from 'ton-core';
import { RandomGenerator } from '../wrappers/RandomGenerator';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const randomGenerator = provider.open(RandomGenerator.createFromConfig({}, await compile('RandomGenerator')));

    await randomGenerator.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(randomGenerator.address);

    // run methods on `randomGenerator`
}
