
export function insertSpacesBetweenCapitalizedWords(str: string) {
    str = str || '';
    return str.replace(/((?<=[a-z])[A-Z]+)/g, ' $1');
}

export function removePrefixB(str: string) {
    return str.replace(/^b(?=[A-Z])/g, '');
}

export function removeInsignificantTrailingZeros(str: string) {
    let labelAsNumber = Number(str);
    if(isNaN(labelAsNumber)) { return str; }
    if (Number.isInteger(labelAsNumber)) {
        return labelAsNumber + ".0";
    }
    return labelAsNumber.toString();
}
