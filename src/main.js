import { executionResult } from './execute.js';
import { parseAssembly } from './parser.js';
import { renderRegs, updateExecutionResult } from './ui.js';

var progMem = null;
var NUM_REGS = 32; // Number of registers of each category
var regs;
var regsEl = document.getElementById('regs');
var srcEl = document.getElementById('src');

function init() {
    // Initialize all registers
    regs = { PC: 0 };
    for (let i = 0; i < NUM_REGS; i++) regs["X" + i] = 0;

    renderRegs(regsEl, regs);
}

/* Execute one instruction */
function step() {
    if (!progMem) progMem = parseAssembly(srcEl.value);

    let instruction = progMem[regs.PC / 4];
    if (!instruction) return;

    let result = executionResult(instruction, regs);
    updateExecutionResult(result);

    for (const name in result.registersTouched) {
        regs[name] = result.registersTouched[name];
    }
}

document.getElementById('step').onclick = step;
init();
