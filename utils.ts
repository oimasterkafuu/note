import { createHash, randomBytes } from 'crypto';

export function sha256(str: string) {
    const hash = createHash('sha256');
    hash.update(str);
    return hash.digest('hex');
}

export function randomString(length: number) {
    return randomBytes(length / 2).toString('hex');
}
