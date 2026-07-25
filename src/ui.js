import { encodeInstruction, opcodeToInstruction } from './encode.js';

/* Returns the 32-bit hex representation of an integer value */
function intToHex(x) {
    return "0x" + (x >>> 0).toString(16).toUpperCase().padStart(8, "0");
}

/* Returns an element representing a register name and changed value */
function registerChangeElement(name, startValue, endValue) {
    var extraText = '';

    switch (name.substring(0, 1)) {
        case 'X':
            extraText = '<br>(' + startValue + ' -> ' + endValue + ')';
            break;
    }

    var card = document.createElement('div');
    card.className = 'register';
    card.innerHTML = '<span class="name">' + name + '</span><span class="val">' + intToHex(startValue) + ' -> ' + intToHex(endValue) + extraText + '</span>';
    return card;
}

/* Returns an element representing a register name and value */
function registerElement(name, value) {
    var card = document.createElement('div');
    card.className = 'register';
    card.id = 'register-' + name;
    card.innerHTML = '<span class="name">' + name + '</span><span class="val">' + intToHex(value) + '</span>';
    return card;
}

/* Creates all register elements */
export function renderRegs(regsEl, regs) {
    regsEl.innerHTML = '';
    for (const name in regs) {
        regsEl.appendChild(registerElement(name, regs[name]));
    }
}

/* Returns a canonical textual representation of an instruction */
function instructionToText(instruction) {
    var text = instruction.name;

    if (instruction.operands) {
        for (let i in instruction.operands) {
            let op = instruction.operands[i];

            if (i > 0) text += ',';

            if (op.immediate) text += ' #' + op.immediate;
            else if (op.register) text += " " + op.register;
            else text += " " + op.token;
        }
    }

    return text;
}

const SIGNED_FIELDS = new Set(['BR_address', 'COND_BR_address']);

function fieldMeaning(encoding, name) {
    if (name === 'opcode') return opcodeToInstruction[encoding.opcode] ?? '?';
    const bits = encoding[name];
    const unsigned = parseInt(bits, 2);
    if (SIGNED_FIELDS.has(name) && bits[0] === '1')
        return (unsigned - (1 << bits.length)).toString();
    return unsigned.toString();
}

const FORMAT_FIELDS = {
    R: ['opcode', 'Rm', 'shamt', 'Rn', 'Rd'],
    I: ['opcode', 'ALU_immediate', 'Rn', 'Rd'],
    B: ['opcode', 'BR_address'],
    CB: ['opcode', 'COND_BR_address', 'Rt'],
};

function encodingElement(encoding) {
    const container = document.createElement('div');
    container.className = 'encoding';

    const fields = document.createElement('div');
    fields.className = 'encoding-fields';

    for (const name of FORMAT_FIELDS[encoding.format]) {
        const field = document.createElement('div');
        field.className = 'encoding-field';

        const label = document.createElement('div');
        label.className = 'encoding-label';
        label.textContent = name;

        const bits = document.createElement('div');
        bits.className = 'encoding-bits';
        bits.textContent = encoding[name];

        const meaning = document.createElement('div');
        meaning.className = 'encoding-meaning';
        meaning.textContent = fieldMeaning(encoding, name);

        field.appendChild(label);
        field.appendChild(bits);
        field.appendChild(meaning);
        fields.appendChild(field);
    }

    const hexField = document.createElement('div');
    hexField.className = 'encoding-field';

    const hexLabel = document.createElement('div');
    hexLabel.className = 'encoding-label';
    hexLabel.textContent = 'hex';

    const hex = document.createElement('div');
    hex.className = 'encoding-bits';
    hex.textContent = encoding.hex;

    hexField.appendChild(hexLabel);
    hexField.appendChild(hex);

    const break_ = document.createElement('div');
    break_.style.width = '100%';
    fields.appendChild(break_);
    fields.appendChild(hexField);
    container.appendChild(fields);
    return container;
}

/* Show the instruction currently being executed */
export function renderCurrentInstruction(instruction, labelAddresses, executionResult, preRegs) {
    let commentEl = document.getElementById('current-instr-comment');

    if (instruction.comment) {
        commentEl.textContent = instruction.comment;
    } else {
        commentEl.textContent = '';
    }

    let instrEl = document.getElementById('current-instr-text');
    var instrText = '';

    if (instruction.name) {
        if (instruction.label) instrText += instruction.label + ':';
        instrText += '\n    ' + instructionToText(instruction);
    }

    instrEl.textContent = instrText;

    let regs = executionResult.registersTouched;
    let regsEl = document.getElementById('current-instr-registers');
    regsEl.innerHTML = '';
    for (const name in regs) {
        let el = registerChangeElement(name, preRegs[name], regs[name]);
        regsEl.appendChild(el);
    }

    let encodingEl = document.getElementById('current-instr-encoding');
    let encoding = encodeInstruction(instruction, labelAddresses, preRegs.PC);
    encodingEl.innerHTML = '';
    if (encoding) {
        encodingEl.appendChild(encodingElement(encoding));
    } else {
        encodingEl.innerHTML = '&mdash;';
    }
}

/* Update just the UI elements affected by the execution result */
export function updateExecutionResult(executionResult) {
    for (const name in executionResult.registersTouched) {
        let registerEl = document.getElementById('register-' + name);
        let valEl = registerEl.getElementsByClassName('val')[0];
        valEl.innerHTML = intToHex(executionResult.registersTouched[name]);

        registerEl.classList.remove('touched');
        void registerEl.offsetWidth; // Force reflow to make animation restart if already playing
        registerEl.classList.add('touched');
    }
}
