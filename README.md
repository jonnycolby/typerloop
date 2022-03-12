# Typerloop

>

Typerloop is a tiny package for producing an animated text typing effect.  Zero external dependencies.  Works with React or any Javascript library.

[![NPM](https://img.shields.io/npm/v/typerloop.svg)](https://www.npmjs.com/package/typerloop)

<img src="https://raw.githubusercontent.com/jonnycolby/typerloop/main/demo-02.gif" />



[NPM Repository](https://npmjs.org/typerloop)
[JSFiddle Example](https://jsfiddle.net/)

## CDN

You can use the CDN version of this plugin for fast and easy setup.

```html
<script src="https://unpkg.com/typerloop@latest/index.js"></script>
```

## Installation
You can install Typerloop with just one command and you're good to go
```shell

# with npm
npm i typerloop

# with yarn
yarn add typerloop

```

## Options

| Name      | Type            | Default value | Description                                         |
| ---       | ---             | ---           | ---                                                 |
| text      | String or Array | ["Hello!"]    | An array of strings to cycle through.               |

## Methods

| Name      | Params          | Description                                                         |
| ---       | ---             | ---                                                                 |
| start     | -               | Start the typing effect.                                            |
| unmount   | -               | Unmount with component to avoid memory leaks.                       |


## Examples

### Basic example

```js
var typer = new Typerloop({
    text: ["Hello", "This is how the Typerloop works."], // a set of text items to be typed sequentially;
    min:   24,    // minimum number of milliseconds before the next character is typed;
    max:   160,   // maximum number of milliseconds before the next character is typed;
    word_min:   0,    // minimum number of milliseconds before the next word is typed, in addition to character delay;
    word_max:   240,   // maximum number of milliseconds before the next word is typed, in addition to character delay;
    delay: 1000,  // milliseconds to show the completed text item before switching to the next;
    on_update: (new_text, new_character, previous_character)  => { /* text updated to string new_text; */ return true; },
    on_next:   (full_text)                                    => { /* text item switched and will type full_text; */ return true; },
    on_loop:   ()                                             => { /* finished typing all strings, looping back to the first string; */ return true; },
});

typer.start();
```
