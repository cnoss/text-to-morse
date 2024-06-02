/* Config
############################################################################ */
const data = {
  "morseCode": {
    "A": ["kurz", "lang"],
    "B": ["lang", "kurz", "kurz", "kurz"],
    "C": ["lang", "kurz", "lang", "kurz"],
    "D": ["lang", "kurz", "kurz"],
    "E": ["kurz"],
    "F": ["kurz", "kurz", "lang", "kurz"],
    "G": ["lang", "lang", "kurz"],
    "H": ["kurz", "kurz", "kurz", "kurz"],
    "I": ["kurz", "kurz"],
    "J": ["kurz", "lang", "lang", "lang"],
    "K": ["lang", "kurz", "lang"],
    "L": ["kurz", "lang", "kurz", "kurz"],
    "M": ["lang", "lang"],
    "N": ["lang", "kurz"],
    "O": ["lang", "lang", "lang"],
    "P": ["kurz", "lang", "lang", "kurz"],
    "Q": ["lang", "lang", "kurz", "lang"],
    "R": ["kurz", "lang", "kurz"],
    "S": ["kurz", "kurz", "kurz"],
    "T": ["lang"],
    "U": ["kurz", "kurz", "lang"],
    "V": ["kurz", "kurz", "kurz", "lang"],
    "W": ["kurz", "lang", "lang"],
    "X": ["lang", "kurz", "kurz", "lang"],
    "Y": ["lang", "kurz", "lang", "lang"],
    "Z": ["lang", "lang", "kurz", "kurz"],
    "0": ["lang", "lang", "lang", "lang", "lang"],
    "1": ["kurz", "lang", "lang", "lang", "lang"],
    "2": ["kurz", "kurz", "lang", "lang", "lang"],
    "3": ["kurz", "kurz", "kurz", "lang", "lang"],
    "4": ["kurz", "kurz", "kurz", "kurz", "lang"],
    "5": ["kurz", "kurz", "kurz", "kurz", "kurz"],
    "6": ["lang", "kurz", "kurz", "kurz", "kurz"],
    "7": ["lang", "lang", "kurz", "kurz", "kurz"],
    "8": ["lang", "lang", "lang", "kurz", "kurz"],
    "9": ["lang", "lang", "lang", "lang", "kurz"],
    " ": ["space"]
  },

  "morseCodeSVG": {

    "rect": {
      "kurz": `<rect width="10" height="10" x="0" y="0" fill="black" />`,
      "lang": `<rect width="20" height="10" x="0" y="0" fill="black" />`
    },

    "round": {
      "kurz": `<circle r="5" cx="5" cy="5" fill="black" />`,
      "lang": `<rect width="20" height="10" x="0" y="0" fill="black" />`
    }

  },


  "unit": 10,
  "ratio": 3,

  "appearance": "rect"

};


/* Functions
############################################################################ */


const renderLetter = (code, appearance) => {

  const { unit, ratio } = data;

  switch (appearance) {
    case 'rect':

      switch (code) {
        case 'kurz':
          return {
            "shift": unit * 2,
            "letter": `<rect width="${unit}" height="${unit}" x="0" y="0" fill="black" />`
          };

        case 'lang':
          return {
            "shift": (unit * ratio) + unit,
            "letter": `<rect width="${unit * ratio}" height="${unit}" x="0" y="0" fill="black" />`
          };
        case 'space':
          return {
            "shift": (unit * ratio) + unit,
            "letter": ``
          };
      }
      break;

    case 'round':
      switch (code) {
        case 'kurz':
          return {
            "shift": unit * 2,
            "letter": `<circle r="${unit/2}" cx="${unit/2}" cy="${unit/2}" fill="black" />`
          };

        case 'lang':
          return {
            "shift": (unit * ratio) + unit,
            "letter": `<rect width="${unit * ratio}" height="${unit}" x="0" y="0" fill="black" />`
          };
        case 'space':
          return {
            "shift": (unit * ratio) + unit,
            "letter": ``
          };
      }
  }


  return data.morseCodeSVG[appearance][code];
};


const renderMorseCode = (text) => {
  const upperCaseText = text.toUpperCase();
  const { morseCode, appearance, unit } = data;

  const morseCodeContainer = document.querySelector('[data-js-morse-output]');
  let morseCodeString = '';

  let row = 0;

  for (let i = 0; i < upperCaseText.length; i++) {
    const letter = upperCaseText[i];
    const letterMorseCode = morseCode[letter];
    let cursor  = 0;

    if (!letterMorseCode) {
      continue;
    }

    const letterMorseCodeSVG = letterMorseCode.map((code) => {

      const {shift, letter} = renderLetter(code, appearance);
      const result = `
        <g transform="translate(${cursor}, 0)">
          ${letter}
        </g>
      `;

      cursor += shift;
      return result;
    });

    morseCodeString += `
      <g transform="translate(0, ${row * (unit * 2)})">
        ${letterMorseCodeSVG}
      </g>`;

    row++;
  }

  morseCodeContainer.innerHTML = `
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
    ${morseCodeString}
    </svg>
  `;


}

const listenToInput = () => {
  const input = document.querySelector('[data-js-text-input]');

  input.addEventListener('input', function () {
    renderMorseCode(input.value);
  });
};


const showSomeText = () => {
  const text = 'Hello World';
  const input = document.querySelector('[data-js-text-input]');
  input.value = text;
  renderMorseCode(text);
  input.focus();
};


const saveSVG = () => {
  const saveButton = document.querySelector('[data-js-save]');
  const input = document.querySelector('[data-js-text-input]');
  const filename = input.value;

  saveButton.addEventListener('click', function () {
    const svg = document.querySelector('[data-js-morse-output] svg');

    svgExport.downloadSvg(
      svg, filename,
      { width: 200, height: 200 }
    );
  });
};

const listenToAppearance = () => {
  const appearanceSelector = document.querySelectorAll('[data-js-appearance] input');

  appearanceSelector.forEach((selector) => {
    selector.addEventListener('click', function () {
      data.appearance = this.value;
      renderMorseCode(document.querySelector('[data-js-text-input]').value);
    });
  });
}

const listenToSize = () => {
  const sizeSelector = document.querySelectorAll('[data-js-size] input');

  sizeSelector.forEach((selector) => {
    selector.addEventListener('click', function () {
      const field = this.id;
      const value = this.value;
      data[field] = value;
      renderMorseCode(document.querySelector('[data-js-text-input]').value);
    });
  });
}

/* Main
############################################################################ */

document.addEventListener('DOMContentLoaded', function () {
  listenToAppearance();
  listenToSize();
  listenToInput();
  showSomeText();
  saveSVG();
});