/* Returns the 32-bit hex representation of an integer value */
function intToHex(x) {
    return "0x" + (x >>> 0).toString(16).toUpperCase().padStart(8, "0");
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
