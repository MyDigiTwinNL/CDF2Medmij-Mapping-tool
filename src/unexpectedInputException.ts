
export class UnexpectedInputException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InputDataException';
    }
}

export function assertIsDefined(value: unknown, message: string): asserts value {
    if (value === undefined) {
        throw new UnexpectedInputException(message);
    }
}

