const NUM_REGS = 32; // Number of registers of each category

/*
 * Returns an object of all CPU flags.
 */
export function makeFlags(overrides = {}) {
    return { C: 0, N: 0, V: 0, Z: 0, ...overrides };
}

/*
 * Returns an object of all CPU registers.
 */
export function makeRegisters(overrides = {}) {
    var regs = { PC: 0 };
    for (let i = 0; i < NUM_REGS; i++) regs["X" + i] = 0;
    for (let i = 0; i < NUM_REGS; i++) regs["S" + i] = 0;
    for (let i = 0; i < NUM_REGS; i++) regs["D" + i] = 0;
    return { ...regs, ...overrides };
}
