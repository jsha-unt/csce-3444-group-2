import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeInstruction } from '../src/encode.js';
import { parseAssembly } from '../src/parser.js';

function parseOne(source) {
    return parseAssembly(source)[0];
}

test('ADDI encodes correctly', () => {
    const instruction = parseOne('ADDI X0, XZR, #1');
    const result = encodeInstruction(instruction, {});
    assert.deepEqual(result,
        {
            format: 'I',
            opcode: '1001000100',
            ALU_immediate: '000000000001',
            Rn: '11111',
            Rd: '00000',
            binary: '10010001000000000000011111100000',
            hex: '0x910007E0',
        }
    );
});
