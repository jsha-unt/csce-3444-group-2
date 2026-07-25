import { test } from 'node:test';
import assert from 'node:assert/strict';
import { encodeInstruction } from '../src/encode.js';
import { parseAssembly } from '../src/parser.js';

function parseOne(source) {
    return parseAssembly(source)[0];
}

test('ADD encodes correctly', () => {
    const instruction = parseOne('ADD X1, XZR, X16');
    const result = encodeInstruction(instruction, {});
    assert.deepEqual(result,
        {
            format: 'R',
            opcode: '10001011000',
            Rm: '10000',
            shamt: '000000',
            Rn: '11111',
            Rd: '00001',
            binary: '10001011000100000000001111100001',
            hex: '0x8B1003E1',
        }
    );
});

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

test('SUB encodes correctly', () => {
    const instruction = parseOne('SUB X1, XZR, X16');
    const result = encodeInstruction(instruction, {});
    assert.deepEqual(result,
        {
            format: 'R',
            opcode: '11001011000',
            Rm: '10000',
            shamt: '000000',
            Rn: '11111',
            Rd: '00001',
            binary: '11001011000100000000001111100001',
            hex: '0xCB1003E1',
        }
    );
});

test('SUBI encodes correctly', () => {
    const instruction = parseOne('SUBI X0, XZR, #1');
    const result = encodeInstruction(instruction, {});
    assert.deepEqual(result,
        {
            format: 'I',
            opcode: '1101000100',
            ALU_immediate: '000000000001',
            Rn: '11111',
            Rd: '00000',
            binary: '11010001000000000000011111100000',
            hex: '0xD10007E0',
        }
    );
});
