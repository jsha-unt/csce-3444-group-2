import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executionResult } from '../src/execute.js';
import { parseAssembly } from '../src/parser.js';
import { makeFlags, makeRegisters } from '../src/state.js';

/*
 * Parses source and returns the first instruction
**/
function parseOne(source) {
    return parseAssembly(source)[0];
}

const PC = 100;

test('ADDI adds immediate to target register', () => {
    const instruction = parseOne('ADDI X0, X1, #5');
    const result = executionResult(instruction, makeRegisters({ PC, X1: 10 }), makeFlags(), {});
    assert.deepEqual(result.registersTouched, { PC: PC + 4, X0: 15 });
    assert.deepEqual(result.flagsTouched, {});
});

test('B branches to label', () => {
    const instruction = parseOne('B loop');
    const result = executionResult(instruction, makeRegisters({ PC }), makeFlags(), { loop: 200 });
    assert.deepEqual(result.registersTouched, { PC: 200 });
    assert.deepEqual(result.flagsTouched, {});
});

test('B.EQ branches when Z flag is 1', () => {
    const instruction = parseOne('B.EQ done');
    const result = executionResult(instruction, makeRegisters({ PC }), makeFlags({ Z: 1 }), { done: 300 });
    assert.deepEqual(result.registersTouched, { PC: 300 });
    assert.deepEqual(result.flagsTouched, {});
});

test('B.EQ does not branch when Z flag is 0', () => {
    const instruction = parseOne('B.EQ done');
    const result = executionResult(instruction, makeRegisters({ PC }), makeFlags(), { done: 300 });
    assert.deepEqual(result.registersTouched, { PC: PC + 4 });
    assert.deepEqual(result.flagsTouched, {});
});

test('B.NE branches when Z flag is 0', () => {
    const instruction = parseOne('B.NE done');
    const result = executionResult(instruction, makeRegisters({ PC }), makeFlags({ Z: 0 }), { done: 300 });
    assert.deepEqual(result.registersTouched, { PC: 300 });
    assert.deepEqual(result.flagsTouched, {});
});

test('B.NE does not branch when Z flag is 1', () => {
    const instruction = parseOne('B.NE done');
    const result = executionResult(instruction, makeRegisters({ PC }), makeFlags({ Z: 1 }), { done: 300 });
    assert.deepEqual(result.registersTouched, { PC: PC + 4 });
    assert.deepEqual(result.flagsTouched, {});
});

test('CBNZ branches when register is not zero', () => {
    const instruction = parseOne('CBNZ X0, loop');
    const result = executionResult(instruction, makeRegisters({ PC, X0: 42 }), makeFlags(), { loop: 200 });
    assert.deepEqual(result.registersTouched, { PC: 200 });
    assert.deepEqual(result.flagsTouched, {});
});

test('CBNZ does not branch when register is zero', () => {
    const instruction = parseOne('CBNZ X0, loop');
    const result = executionResult(instruction, makeRegisters({ PC, X0: 0 }), makeFlags(), { loop: 200 });
    assert.deepEqual(result.registersTouched, { PC: PC + 4 });
    assert.deepEqual(result.flagsTouched, {});
});

test('CBZ branches when register is zero', () => {
    const instruction = parseOne('CBZ X0, done');
    const result = executionResult(instruction, makeRegisters({ PC, X0: 0 }), makeFlags(), { done: 300 });
    assert.deepEqual(result.registersTouched, { PC: 300 });
    assert.deepEqual(result.flagsTouched, {});
});

test('CBZ does not branch when register is not zero', () => {
    const instruction = parseOne('CBZ X0, done');
    const result = executionResult(instruction, makeRegisters({ PC, X0: 1 }), makeFlags(), { done: 300 });
    assert.deepEqual(result.registersTouched, { PC: PC + 4 });
    assert.deepEqual(result.flagsTouched, {});
});
