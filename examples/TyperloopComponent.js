import React from "react";
import Typerloop from "typerloop";
//

class My_App extends React.Component {
    constructor(props) {
        super(props);
        const A = this;

        A.state = {
            typer_text: "",
        };

        A.typer = new Typerloop({
            text: ["Hello!", "This is an example.", "Second example."], // a set of text items to be typed sequentially;
            min: 24, // minimum number of milliseconds before the next character is typed;
            max: 160, // maximum number of milliseconds before the next character is typed;
            word_min: 0, // minimum number of milliseconds before the next word is typed, in addition to character delay;
            word_max: 240, // maximum number of milliseconds before the next word is typed, in addition to character delay;
            delay: 4000, // milliseconds to show the completed text item before switching to the next;
            on_update: (new_text, new_character, previous_character) => {
                A.setState({ typer_text: new_text });
                A.tick_caret();
            },
            on_next: (full_text) => {
                // text item switched and will type full_text;
            },
            on_loop: () => {
                // finished typing all strings, looping back to the first string;
            },
        });

        A.vars = {
            _mounted: false,
            caret_blink_seconds: 0.72,
        };

        A.timers = {
            caret: null,
        };

        A.dom = {
            caret: null,
        };

        //
    }

    componentDidMount() {
        const typer = this.typer;
        this.vars._mounted = true;
        this.tick_caret();
        setTimeout(() => {
            typer.start();
        }, 1000 * 2.4);
    }
    componentWillUnmount() {
        this.vars._mounted = false;
        this.typer.unmount(); // prevents memory leaks
    }

    tick_caret = async (ease_in) => {
        //
        //  This method eases the opacity of the underscore (or any element) during type delays
        //
        const A = this;
        ease_in = ease_in != null ? ease_in : false;
        if (!A.vars._mounted) return false;
        //
        if (A.timers.caret) clearTimeout(A.timers.caret);
        //
        if (ease_in) {
            A.dom.caret.style.transition = `opacity ${A.vars.caret_blink_seconds}s ease-in-out`;
            A.dom.caret.style.opacity = 1.0;

            if (A.timers.caret) clearTimeout(A.timers.caret);
            A.timers.caret = setTimeout(() => {
                if (!A.vars._mounted) return false;
                A.dom.caret.style.transition = `opacity ${A.vars.caret_blink_seconds}s ease-in-out`;
                A.dom.caret.style.opacity = 0.0;

                if (A.timers.caret) clearTimeout(A.timers.caret);
                A.timers.caret = setTimeout(() => {
                    A.tick_caret(true);
                }, 1000 * A.vars.caret_blink_seconds);
            }, 1000 * A.vars.caret_blink_seconds);

            //
        } else {
            A.dom.caret.style.transition = "none";
            A.dom.caret.style.opacity = 1.0;

            A.caret = setTimeout(() => {
                if (!A.vars._mounted) return false;
                A.dom.caret.style.transition = `opacity ${A.vars.caret_blink_seconds}s ease-in-out`;
                A.dom.caret.style.opacity = 0.0;

                if (A.timers.caret) clearTimeout(A.timers.caret);
                A.timers.caret = setTimeout(() => {
                    A.tick_caret(true);
                }, 1000 * A.vars.caret_blink_seconds);
            }, 1000 * A.vars.caret_blink_seconds * 0.5);

            //
        }
    };

    render() {
        const A = this;

        return (
            <div style={{ fontSize: "32px", fontWeight: "720" }}>
                {this.state.typer_text}
                <span
                    style={{
                        opacity: 1.0,
                    }}
                    ref={(el) => (A.dom.caret = el)}
                >
                    _
                </span>
            </div>
        );
    }
}

export default My_App;
