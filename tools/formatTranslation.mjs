import { readFileSync, existsSync } from "fs";
import { join, basename } from "path";


const extractedFile = 'extracted-messages.json';
const locales = ['en', 'ro'];
const idKey = '__id__';


/**
 * The function is used to read a JSON file.
 *
 * If the file does not exist or it is empty, it returns an empty object.
 *
 * @param {string} file - The file to read.
 */
function defensiveReadJson(file) {
    let data = {};
    if (existsSync(file)) {
        const json = readFileSync(file, "utf8");
        if (json) {
            data = JSON.parse(json);
        }
    }
    // console.log("defensiveReadJson", file, data);
    return data;
}


/**
 * The function is used to flatten the messages object.
 *
 * It uses the __id__ property to identify the leaf nodes.
 *
 * For example, the following object:
 *
 * {
 *  "a": {
 *     "b": {
 *        "c": "value",
 *        "__id__": "a.b.c"
 *    }
 * }
 *
 * will be transformed into:
 *
 * {
 *   "a.b": {
 *     "c": "value",
 *     "__id__": "a.b.c"
 *   }
 * }
 *
 * @param {object} obj - The object to flatten.
 * @param {object} result - The result object (used internally).
 * @param {string} prefix - The prefix to use for the keys (used internally).
 *
 * @returns {object} The flattened object.
 */
function flatten(obj, result = {}, prefix = '') {
    if (typeof obj !== 'object') {
        throw new Error('flatten() called on non-object');
    }
    if (obj[idKey]) {
        result[prefix] = obj;
    } else {
        for (const [key, value] of Object.entries(obj)) {
            flatten(value, result, prefix ? prefix + '.' + key : key);
        }
    }
    return result;
}


/**
 * The function is used with the `formatjs extract` command to extract
 * messages from the source code.
 *
 * To use this function, you need to set the FJS_DIR environment variable
 * to the directory where the XX.json files are located.
 */
export function format(msgs) {
    // console.log("formatTranslation.format");
    // console.log(msgs);

    // We need the directory where the XX.json files are located.
    if (!process.env["FJS_DIR"]) {
        throw new Error("FJS_DIR environment variable is not set");
    }
    const localeDir = process.env["FJS_DIR"];

    // Read existing translations from XX.json files.
    const oldLocaleData = locales.reduce((acc, locale) => {
        const file = join(localeDir, locale + '.json');
        acc[locale] = defensiveReadJson(file);
        return acc;
    }, {});
    // console.log("oldLocaleData", oldLocaleData);

    // For each message in the source code, see if we have an existing
    // translation.
    const result = {};
    for (const key of Object.keys(msgs).sort()) {
        const value = msgs[key];
        const newData = { ...value };
        for (const locale of locales) {
            if (oldLocaleData[locale][key]) {
                newData[locale] = oldLocaleData[locale][key];
            }
        }
        newData[idKey] = key;
        const parts = key.split('.');
        let obj = result;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!obj[parts[i]]) {
                obj[parts[i]] = {};
            }
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = newData;
    }

    return result;
}


/**
 * The function is used with the `formatjs compile` command to generate
 * locale files from extracted-messages.json.
 *
 * To use this function, you need to set the FJS_FILE environment variable
 * to the name of the input/output file.
 */
export function compile(msgs) {
    // console.log("formatTranslation.compile");
    // console.log(msgs);

    // We need the output file location.
    if (!process.env["FJS_FILE"]) {
        throw new Error("FJS_FILE environment variable is not set");
    }
    const inOutFile = process.env["FJS_FILE"];

    // Derive the locale from the filename.
    const locale = basename(inOutFile, '.json');

    // Merge the two sets of messages.
    const result = {};
    for (const [key, value] of Object.entries(flatten(msgs))) {
        // console.log("=====================");
        // console.log("key", key, value);
        // console.log("value[locale]", value[locale]);
        result[key] = value[locale] || value.defaultMessage || value.id || key;
        // console.log("result[key]", result[key]);
    }
    // console.log("result", msgs);
    return result;
}
