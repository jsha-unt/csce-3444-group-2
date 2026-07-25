let instructionSchemas = {
    ADD: { format: 'R', opcode: '10001011000' },
    ADDI: { format: 'I', opcode: '1001000100' },
    B: { format: 'B', opcode: '000101' },
    // B.cond Rt values are the binary encodings of the define values on
    // https://github.com/ryanhaticus/legv8-disassembler/blob/bf34bd2450c7fb1cd6fadc9d37532187da8810ca/src/lib/cb_instruction/cb_instruction.cpp#L5-L18
    'B.EQ': { format: 'CB', opcode: '01010100', Rt: '00000' },
    'B.GE': { format: 'CB', opcode: '01010100', Rt: '01010' },
    'B.GT': { format: 'CB', opcode: '01010100', Rt: '01100' },
    'B.HI': { format: 'CB', opcode: '01010100', Rt: '01000' },
    'B.HS': { format: 'CB', opcode: '01010100', Rt: '00010' },
    'B.LE': { format: 'CB', opcode: '01010100', Rt: '01101' },
    'B.LO': { format: 'CB', opcode: '01010100', Rt: '00011' },
    'B.LS': { format: 'CB', opcode: '01010100', Rt: '01001' },
    'B.LT': { format: 'CB', opcode: '01010100', Rt: '01011' },
    'B.MI': { format: 'CB', opcode: '01010100', Rt: '00100' },
    'B.NE': { format: 'CB', opcode: '01010100', Rt: '00001' },
    'B.PL': { format: 'CB', opcode: '01010100', Rt: '00101' },
    'B.VC': { format: 'CB', opcode: '01010100', Rt: '00111' },
    'B.VS': { format: 'CB', opcode: '01010100', Rt: '00110' },
    BL: { format: 'B', opcode: '100101' },
    CBNZ: { format: 'CB', opcode: '10110101' },
    CBZ: { format: 'CB', opcode: '10110100' },
    SUB: { format: 'R', opcode: '11001011000' },
    SUBI: { format: 'I', opcode: '1101000100' },
}

export const opcodeToInstruction = Object.fromEntries(
    Object.entries(instructionSchemas).map(([name, { opcode }]) => [opcode, name])
);

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
            repr.BR_address = (offset & 0x3FFFFFF).toString(2).padStart(26, "0");
            repr.binary = repr.opcode + repr.BR_address;
            break;
        }
        case 'CB': {
            if (repr.Rt !== undefined) {
                // B.cond: Rt is the condition code from the schema, label is ops[0]
                let offset = labelAddresses[ops[0].token] - instructionAddress;
                repr.COND_BR_address = (offset & 0x7FFFF).toString(2).padStart(19, "0");
            } else {
                // CBZ/CBNZ: Rt is the register, label is ops[1]
                let offset = labelAddresses[ops[1].token] - instructionAddress;
                repr.COND_BR_address = (offset & 0x7FFFF).toString(2).padStart(19, "0");
                repr.Rt = parseInt(ops[0].register.slice(1)).toString(2).padStart(5, "0");
            }
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
