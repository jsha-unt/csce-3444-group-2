import { parseAssembly } from './parser.js';
import { renderRegs } from './ui.js';

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

function step() {
    let asm = parseAssembly(srcEl.value);
    console.log(asm);
}

document.getElementById('step').onclick = step;
init();
