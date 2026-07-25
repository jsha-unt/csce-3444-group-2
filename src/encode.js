let instructionSchemas = {
    ADD: { format: 'R', opcode: '10001011000' },
    ADDI: { format: 'I', opcode: '1001000100' },
    B: { format: 'B', opcode: '000101' },
    BL: { format: 'B', opcode: '100101' },
    CBNZ: { format: 'CB', opcode: '10110101' },
    CBZ: { format: 'CB', opcode: '10110100' },
    SUB: { format: 'R', opcode: '11001011000' },
    SUBI: { format: 'I', opcode: '1101000100' },
}

/*
 * Returns the binary encoding of a LEGv8 assembly instruction
 */
export function encodeInstruction(instruction, labelAddresses, instructionAddress = 0) {
    let ops = instruction.operands;
    let schema = instructionSchemas[instruction.name];

    if (!schema) return;

    var repr = structuredClone(schema);

    switch (repr.format) {
        case 'B': {
            let offset = labelAddresses[ops[0].token] - instructionAddress;
            repr.BR_address = offset.toString(2).padStart(26, "0");
            repr.binary = repr.opcode + repr.BR_address;
            break;
        }
        case 'CB': {
            let offset = labelAddresses[ops[1].token] - instructionAddress;
            repr.COND_BR_address = offset.toString(2).padStart(19, "0");
            repr.Rt = parseInt(ops[0].register.slice(1)).toString(2).padStart(5, "0");
            repr.binary = repr.opcode + repr.COND_BR_address + repr.Rt;
            break;
        }
        case 'I':
            repr.ALU_immediate = ops[2].immediate.toString(2).padStart(12, "0");
            repr.Rn = parseInt(ops[1].register.slice(1)).toString(2).padStart(5, "0");
            repr.Rd = parseInt(ops[0].register.slice(1)).toString(2).padStart(5, "0");
            repr.binary = repr.opcode + repr.ALU_immediate + repr.Rn + repr.Rd;
            break;
        case 'R':
            repr.Rm = parseInt(ops[2].register.slice(1)).toString(2).padStart(5, "0");
            repr.shamt = (instruction.shamt || 0).toString(2).padStart(6, "0");
            repr.Rn = parseInt(ops[1].register.slice(1)).toString(2).padStart(5, "0");
            repr.Rd = parseInt(ops[0].register.slice(1)).toString(2).padStart(5, "0");
            repr.binary = repr.opcode + repr.Rm + repr.shamt + repr.Rn + repr.Rd;
            break;
    }

    repr.hex = '0x' + parseInt(repr.binary, 2).toString(16).toUpperCase().padStart(8, "0");

    return repr;
}
