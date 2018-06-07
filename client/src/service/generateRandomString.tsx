export default function generateRandomString(length: number): string {
    function dec2hex(dec: number) {
        return ('0' + dec.toString(16)).substr(-2)
    }

    const arr = new Uint8Array((length || 40) / 2);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('')
}
