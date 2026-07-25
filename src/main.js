import { executionResult } from './execute.js';
import { makeFlags, makeRegisters } from './state.js';
import { parseAssembly } from './parser.js';
import { renderRegs, updateExecutionResult, renderCurrentInstruction } from './ui.js';

var flags = null;
var labelAddresses = null;
var progMem = null;
var regs;
var regsEl = document.getElementById('regs');
var srcEl = document.getElementById('src');

function init() {
    flags = makeFlags();
    regs = makeRegisters();

    renderRegs(regsEl, regs);
}

function reset() {
    init();
    labelAddresses = null;
    progMem = null;
    renderCurrentInstruction({}, {}, {});
}

// TODO: This is not the real memory system, just a way to get
// things off the ground for now.
function loadProgMem(program) {
    labelAddresses = {};
    progMem = [];

    for (const instruction of program) {
        if (instruction.label)
            labelAddresses[instruction.label] = progMem.length * 4;
        progMem.push(instruction);
    }
    console.log(progMem, labelAddresses);
}

/* Execute one instruction */
function step() {
    if (!progMem) loadProgMem(parseAssembly(srcEl.value));

    let instruction = progMem[regs.PC / 4];
    if (!instruction) return;

    let preRegs = structuredClone(regs);
    let result = executionResult(instruction, regs, flags, labelAddresses);
    renderCurrentInstruction(instruction, result, preRegs);
    updateExecutionResult(result);

    for (const name in result.flagsTouched) {
        flags[name] = result.flagsTouched[name];
    }

    for (const name in result.registersTouched) {
        regs[name] = result.registersTouched[name];
    }
}

document.getElementById('reset-state').onclick = reset;
document.getElementById('step').onclick = step;
init();
