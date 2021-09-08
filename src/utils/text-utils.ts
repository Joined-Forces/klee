import { NodeFriendlyNames } from "../parser/node-friendly-names";

export function insertSpacesBetweenCapitalizedWords(str: string) {
    str = str || '';
    return str.replace(/((?<=[a-z])[A-Z]+)/g, ' $1');
}

export function removePrefixB(str: string) {
    return str.replace(/^b(?=[A-Z])/g, '');
}

export function capitalizeTerm(str: string) {
    str = str.trim();
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function findFriendlyName(str: string) {
    let firendlyName = NodeFriendlyNames[str];
    return firendlyName || str;
}

export function prettifyText(str: string) {
    return capitalizeTerm(
        insertSpacesBetweenCapitalizedWords(
            removePrefixB(str).replace(/[_]/g, ' ')
        )
    );
}

export function removeInsignificantTrailingZeros(str: string) {
    let labelAsNumber = Number(str);
    if (isNaN(labelAsNumber)) { return str; }
    if (Number.isInteger(labelAsNumber)) {
        return labelAsNumber + ".0";
    }
    return labelAsNumber.toString();
}
