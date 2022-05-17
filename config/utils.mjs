import prompt_config from 'prompt-sync';

const PROMPT = prompt_config({ sigint: true });

/**
 * Gets user confirmation that the given config object, is okay
 * 
 * @param {object} config_object 
 * 
 * @returns true iff the user confirms, false otherwise
 */
function confirm_config(config_object) {
    let json_repr = JSON.stringify(config_object, null, 2);

    return boolean_question({
        msg: `Is this okay ?\n${json_repr}`
    });
}

/**
 * Get boolean user input
 * 
 * @param {object} param
 * @param {string} param.msg
 * @param {string} param.truth_choice
 * @param {string} param.false_choice
 * @param {boolean} param.default_choice
 * 
 * @returns 
 */
function boolean_question({
    msg = "Yes or no ?",
    truth_choice = "Y",
    false_choice = "N",
    default_choice = true
} = {}) {
    console.log(`${msg}\n`);

    let input = PROMPT(
        `(${truth_choice}/${false_choice}) : `,
        default_choice ? truth_choice : false_choice
    );
    console.log();

    return input.toLowerCase() === truth_choice.toLowerCase();
}

/**
 * Get string user input
 * 
 * @param {object} param
 * @param {string} param.msg
 * @param {string} param.default_value
 * 
 * @returns 
 */
function string_question({
    msg = "Enter user input",
    default_value = ""
} = {}) {
    let input = PROMPT(
        `${msg} (${default_value}) : `,
        default_value
    );
    console.log();

    return input;
}

/**
 * Get string user input, but silent
 * 
 * @param {object} param
 * @param {string} param.msg
 * 
 * @returns 
 */
function password_question({ msg = "Enter the password" } = {}) {
    let input = PROMPT(
        `${msg} : `,
        { echo: "" }
    );
    console.log();

    return input;
}

export {
    confirm_config,
    boolean_question,
    string_question,
    password_question
}