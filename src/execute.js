export function executionResult(instruction, registers, labelAddresses) {
    let ops = instruction.operands;
    var regs = { PC: registers.PC + 4 };

    switch (instruction.name) {
        case 'ADDI':
            regs[ops[0].register] = registers[ops[1].register] + ops[2].immediate;
            break;
        case 'B':
            regs.PC = labelAddresses[ops[0].token];
            break;
    }

    return {
        registersTouched: regs,
    };
}
