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

/* Show the instruction currently being executed */
export function renderCurrentInstruction(instruction, executionResult, preRegs) {
    let commentEl = document.getElementById('current-instr-comment');

    if (instruction.comment) {
        commentEl.textContent = instruction.comment;
    } else {
        commentEl.textContent = '';
    }

    let instrEl = document.getElementById('current-instr-text');
    var instrText = '';
    if (instruction.label) instrText += instruction.label + ':';
    instrText += '\n    ' + instructionToText(instruction);
    instrEl.textContent = instrText;

    let regs = executionResult.registersTouched;
    let regsEl = document.getElementById('current-instr-registers');
    regsEl.innerHTML = '';
    for (const name in regs) {
        let el = registerChangeElement(name, preRegs[name], regs[name]);
        regsEl.appendChild(el);
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
