import { NextResponse } from 'next/server';
import { Transformer, SolidityWriter, JavaParserAdapter } from 'polysol-js-core';

export async function POST(request: Request) {
    try {
        const { code, language } = await request.json();
        console.log(`Transpile request: language=${language}`);

        if (!code.trim()) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        let outputIR;

        if (language === 'java') {
            const parser = new JavaParserAdapter();
            outputIR = parser.parse(code);
        } else {
            // Default to JavaScript
            // SANITIZATION: Remove 'function' keyword from methods if user mistakenly added it (common error)
            const sanitizedCode = code.replace(/^\s*function\s+(\w+)\s*\(/gm, '$1(');

            const transformer = new Transformer();
            outputIR = transformer.transform(sanitizedCode);
        }

        const writer = new SolidityWriter();
        const output = writer.generate(outputIR);

        return NextResponse.json({ output });

    } catch (error) {
        console.error('Transpilation error:', error);
        return NextResponse.json({
            error: 'Transpilation failed: ' + (error as Error).message
        }, { status: 500 });
    }
}

