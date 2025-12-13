import { NextRequest, NextResponse } from 'next/server';
import solc from 'solc';

export async function POST(req: NextRequest) {
    try {
        const { sourceCode } = await req.json();

        if (!sourceCode) {
            return NextResponse.json({ error: 'Source code is required' }, { status: 400 });
        }

        const input = {
            language: 'Solidity',
            sources: {
                'Contract.sol': {
                    content: sourceCode
                }
            },
            settings: {
                outputSelection: {
                    '*': {
                        '*': ['abi', 'evm.bytecode']
                    }
                }
            }
        };

        const output = JSON.parse(solc.compile(JSON.stringify(input)));

        if (output.errors) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const errors = output.errors.filter((e: any) => e.severity === 'error');
            if (errors.length > 0) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                return NextResponse.json({ success: false, errors: errors.map((e: any) => e.formattedMessage) }, { status: 400 });
            }
        }

        const contracts = output.contracts['Contract.sol'];
        const contractName = Object.keys(contracts)[0]; // Assume first contract
        const artifact = contracts[contractName];

        return NextResponse.json({
            success: true,
            abi: artifact.abi,
            bytecode: artifact.evm.bytecode.object
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
        console.error('Compilation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
