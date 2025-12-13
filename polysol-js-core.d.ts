declare module 'polysol-js-core' {
    export class Parser {
        parse(code: string): any;
    }

    export class JavaParserAdapter {
        parse(code: string): any;
    }

    export class SolidityWriter {
        generate(ir: any): string;
    }

    export class Transformer {
        transform(ir: any): any;
    }
}
