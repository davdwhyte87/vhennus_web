

const strictRe: RegExp = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/

export function isValidEmailStrict(email: string): boolean {
    return strictRe.test(email)
}

export function isAllLowercase(str: string): boolean {
    return str === str.toLowerCase();
}