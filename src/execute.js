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
    }

    return {
        flagsTouched: flgs,
        registersTouched: regs,
    };
}
