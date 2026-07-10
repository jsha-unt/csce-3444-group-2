let instructionSchemas = {
    ADDI: { format: 'I', opcode: '1001000100' },
}

/*
 * Returns the binary encoding of a LEGv8 assembly instruction
 */
export function encodeInstruction(instruction, labelAddresses) {
    let ops = instruction.operands;
    let schema = instructionSchemas[instruction.name];

    if (!schema) return;

    var repr = { ...schema }; // Shallow copy

    switch (repr.format) {
        case 'I':
            repr.ALU_immediate = ops[2].immediate.toString(2).padStart(12, "0");
            repr.Rn = parseInt(ops[1].register.slice(1)).toString(2).padStart(5, "0");
            repr.Rd = parseInt(ops[0].register.slice(1)).toString(2).padStart(5, "0");
            repr.binary = repr.opcode + repr.ALU_immediate + repr.Rn + repr.Rd;
            break;
    }

    repr.hex = '0x' + parseInt(repr.binary, 2).toString(16).toUpperCase().padStart(8, "0");

    return repr;
}
