import { toNano } from 'ton-core';
import { ProofOfUniformness } from '../wrappers/ProofOfUniformness';
import { compile, NetworkProvider } from '@ton-community/blueprint';

export async function run(provider: NetworkProvider) {
    const proofOfUniformness = provider.open(ProofOfUniformness.createFromConfig({}, await compile('ProofOfUniformness')));

    await proofOfUniformness.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(proofOfUniformness.address);

    // run methods on `proofOfUniformness`
}
