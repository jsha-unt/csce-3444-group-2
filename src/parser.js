function parseOperand(token) {
    let char = token[0];
    if (char == 'X') return { register: token };
    if (char == '#') return { immediate: token.slice(1) };
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
        } else {
            token += char;
        }
        i++;
    }

    return { name: token };
}

export function parseAssembly(sourceText) {
    var instructions = [];

    // Split up and parse each line separately
    for (const line of sourceText.split('\n')) {
        let instruction = parseLine(line);
        if (instruction) instructions.push(instruction);
    }

    return instructions;
}
