export function executionResult(instruction, registers, flags, labelAddresses) {
    let ops = instruction.operands;
    var flgs = {};
    var regs = { PC: registers.PC + 4 };

    switch (instruction.name) {
        case 'ADDI':
            regs[ops[0].register] = registers[ops[1].register] + ops[2].immediate;
            break;
        case 'B':
            regs.PC = labelAddresses[ops[0].token];
            break;
        case 'CBNZ':
            if (registers[ops[0].register] !== 0) {
                regs.PC = labelAddresses[ops[1].token];
            }
            break;
        case 'CBZ':
            if (registers[ops[0].register] === 0) {
                regs.PC = labelAddresses[ops[1].token];
            }
            break;
        case 'B.EQ':
            if (flags.Z === 1) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.GE':
            if (flags.N === flags.V) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.GT':
            if (flags.N === flags.V || flags.Z === 0) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.HI':
            if (flags.C === 1 && flags.Z === 0) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.HS':
            if (flags.C === 1) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.LE':
            if (flags.N !== flags.V || flags.Z === 1) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.LO':
            if (flags.C === 0) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.LS':
            if (flags.C === 0 || flags.Z === 1) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.LT':
            if (flags.N !== flags.V) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.MI':
            if (flags.N === 1) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.NE':
            if (flags.Z === 1) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.PL':
            if (flags.N === 0) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.VC':
            if (flags.V === 0) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
        case 'B.VS':
            if (flags.V === 1) {
                regs.PC = labelAddresses[ops[0].token];
            }
            break;
    }

    return {
        flagsTouched: flgs,
        registersTouched: regs,
    };
}
