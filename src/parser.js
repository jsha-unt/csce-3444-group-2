let registerAliases = {
    SP: 'X28', // Stack Pointer
    FP: 'X29', // Frame Pointer
    LR: 'X30', // Link Return (e.g., caller return address)
    XZR: 'X31', // X ZeRo
};

function parseRegister(token) {
    if (registerAliases[token]) return registerAliases[token];
    return token;
}

function parseOperand(token) {
    var op = { token: token };

    let char = token[0];
    if (char == 'X') op.register = parseRegister(token);
    else if (char == '#') op.immediate = parseInt(token.slice(1));

    return op;
}

function parseInstruction(name, line, startIndex) {
    var i = startIndex;
    let operands = [];

    var token = '';
    while (i < line.length) {
        let char = line[i];
        if (char == ',') {
            operands.push(parseOperand(token));
            token = '';
        } else if (char != ' ' && char != '\t') {
            token += char;
        }
        i++;
    }

    if (token) operands.push(parseOperand(token));

    return { name: name, operands: operands };
}

function parseLine(line) {
    let str = line.trim();
    if (str.length == 0) return;

    var i = 0;
    var token = '';
    while (i < str.length) {
        let char = str[i];
        if (char == ' ' || char == '\t') {
            return parseInstruction(token, line, i + 1);
        } else if (char == ':') {
            return { label: token };
        } else {
            token += char;
        }
        i++;
    }

    return { name: token };
}

export function parseAssembly(sourceText) {
    var parsed = [];

    // Split up and parse each line separately
    for (const line of sourceText.split('\n')) {
        let x = parseLine(line);
        if (x) parsed.push(x);
    }

    var instructions = [];

    for (var i = 0; i < parsed.length; i++) {
        let x = parsed[i];
        if (x.label) {
            // Merge label with the actual instruction
            // If label is at the very end of the program, make it a NOP instruction
            if (i + 1 < parsed.length) {
                let next = parsed[i + 1];
                if (next.name) {
                    next.label = x.label;
                    instructions.push(next);
                    i++;
                } else {
                    x.name = 'NOP';
                    instructions.push(x);
                }
            } else {
                x.name = 'NOP';
                instructions.push(x);
            }
        } else {
            instructions.push(x);
        }
    }

    return instructions;
}
