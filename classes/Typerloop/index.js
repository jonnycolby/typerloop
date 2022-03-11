//
//  Typerloop
//
//  example:
//  const typer = new TyperLoop({
//      text: ["Hello", "This is how the Typerloop works."], // a set of text items to be typed sequentially;
//      min:   24,    // minimum number of milliseconds before the next character is typed;
//      max:   160,   // maximum number of milliseconds before the next character is typed;
//      word_min:   0,    // minimum number of milliseconds before the next word is typed, in addition to character delay;
//      word_max:   480,   // maximum number of milliseconds before the next word is typed, in addition to character delay;
//      delay: 1000,  // milliseconds to show the completed text item before switching to the next;
//      on_update: (new_text, new_character, previous_character)  => { /* text updated to string new_text; */ return true; },
//      on_next:   (full_text)                                    => { /* text item switched and will type full_text; */ return true; },
//      on_loop:   ()                                             => { /* finished typing all strings, looping back to the first string; */ return true; },
//  })
//

class Typerloop {
    constructor(props) {
        const TL = this;
        //
        var input_text = [];
        if (props.text && typeof props.text == "string") input_text = [`${props.text}`];
        else if (props.text && Array.isArray(props.text)) input_text = [...props.text];
        //
        var on_update = (new_text, new_character) => true;
        if (props.on_update && typeof props.on_update == "function") on_update = props.on_update;
        else if (props.onUpdate && typeof props.onUpdate == "function") on_update = props.onUpdate; // providing camel-case support for those who observe;
        //
        var on_next = () => true;
        if (props.on_next && typeof props.on_next == "function") on_next = props.on_next;
        else if (props.onNext && typeof props.onNext == "function") on_update = props.onNext;
        //
        var on_loop = () => true;
        if (props.on_loop && typeof props.on_loop == "function") on_loop = props.on_loop;
        else if (props.onLoop && typeof props.onLoop == "function") on_update = props.onLoop;
        //
        //

        TL.vars = {
            text: input_text, // array
            speed: {
                min: props.min != null && typeof props.min == "number" && props.min > 0 ? parseInt(props.min) : 24,
                max: props.max != null && typeof props.max == "number" && props.max > 0 ? parseInt(props.min) : 160,
            },
            word_delay: {
                min: props.word_min != null && typeof props.word_min == "number" ? parseInt(props.word_min) : 0,
                max: props.word_max != null && typeof props.word_max == "number" ? parseInt(props.word_max) : 480,
            },
            text_item_delay: props.delay != null && typeof props.delay == "number" && props.delay > 0 ? parseInt(props.delay) : 1000,
            on_update: on_update,
            on_next: on_next,
            on_loop: on_loop,
        };

        TL.cache = {
            text_item_index: null,
            full_text: "",
            partial_text: "",
            new_character: "",
            previous_character: "",
            text_length: 0,
        };

        //
        //
    }

    start = () => {
        const TL = this; // convenience alias for this (class instance);
        TL.next_text();
        TL.do_type();
    };

    next_text = () => {
        const TL = this;
        if (typeof TL.cache.text_item_index != "number") TL.cache.text_item_index = 0;
        // if null or broken
        else if (TL.cache.text_item_index) TL.cache.text_item_index = parseInt(TL.cache.text_item_index + 1); // else, step
        //
        if (TL.cache.text_item_index >= TL.vars.text.length) {
            TL.cache.text_item_index = 0;
            if (TL.vars.on_loop && typeof TL.vars.on_loop == "function") TL.vars.on_loop();
        }
        //
        TL.cache.full_text = `${TL.vars.text[TL.cache.text_item_index]}`;
        TL.cache.partial_text = "";
        TL.cache.text_length = 0;
        //
        if (TL.vars.on_next && typeof TL.vars.on_next == "function") TL.on_next(`${TL.cache.full_text}`);
        //
        TL.do_type();
    };

    do_type = () => {
        const TL = this;
        //
        if (TL.cache.text_length >= TL.cache.full_text.length) return false; // something is off, terminating to avoid memory leaks;
        //

        TL.cache.text_length++;

        TL.cache.partial_text = `${TL.cache.full_text.substring(0, TL.cache.text_length)}`;
        TL.cache.new_character = `${TL.cache.full_text.substring(TL.cache.text_length - 1, TL.cache.text_length)}`;
        TL.cache.previous_character = `${TL.cache.full_text.substring(TL.cache.text_length - 2, TL.cache.text_length - 1)}`;

        var word_delay = TL.cache.previous_character == " " || TL.cache.previous_character == "\n" ? random_int({ min: TL.vars.word_delay.min, max: TL.vars.word_delay.max }) : 0; // TO DO: test this

        // Action!
        if (TL.vars.on_update && typeof TL.vars.on_update == "function") TL.vars.on_update(TL.cache.partial_text, TL.cache.new_character, TL.cache.previous_character);

        //
        //

        if (TL.cache.text_length >= TL.cache.full_text.length) {
            setTimeout(() => {
                TL.next_text();
            }, TL.vars.text_item_delay);
            return true;
        }
        // else:
        setTimeout(() => {
            TL.do_type();
        }, random_int({ min: TL.vars.speed.min, max: TL.vars.speed.max }) + word_delay);
    };
}

//

const random_int = ({ min, max }) => {
    return Math.floor(Math.random() * Math.floor(max + 1 - min)) + min;
};

//
//

module.exports = Typerloop;

//
//
//
