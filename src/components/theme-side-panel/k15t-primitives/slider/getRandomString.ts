/** Copied from vpt3 `common/utils/util.ts` (only this helper is needed for Slider). */
export const getRandomString = (length = 8) => {
    let randomString = '';

    do {
        randomString = `${randomString}${Math.random().toString(36).substring(2)}`;
    } while (randomString.length < length);

    return randomString.substring(0, length);
};
