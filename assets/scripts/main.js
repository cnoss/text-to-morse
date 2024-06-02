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

  "color-1": {
    "hue": 0,
    "saturation": 0,
    "lightness": 0
  },

  "color-2": {
    "hue": 0,
    "saturation": 0,
    "lightness": 0
  },

  "colspan": 10,
  "rowspan": 10,

  "unit": 10,
  "ratio": 3,

  "appearance": "rect"

};


/* Functions
############################################################################ */


const renderLetter = (code, appearance) => {

  const unit =  parseInt(data.unit);
  const ratio = parseInt(data.ratio);

  const hue1 = data['color-1'].hue;
  const saturation1 = data['color-1'].saturation;
  const lightness1 = data['color-1'].lightness;

  const hue2 = data['color-2'].hue;
  const saturation2 = data['color-2'].saturation;
  const lightness2 = data['color-2'].lightness;

  switch (appearance) {
    case 'rect':

      switch (code) {
        case 'kurz':
          return {
            "shift": unit + parseInt(data.colspan),
            "letter": `<rect width="${unit}" height="${unit}" x="0" y="0" fill="hsl(${hue1}deg ${saturation1}% ${lightness1}%)" />`
          };

        case 'lang':
          return {
            "shift": (unit * ratio) + parseInt(data.colspan),
            "letter": `<rect width="${unit * ratio}" height="${unit}" x="0" y="0" fill="hsl(${hue2}deg ${saturation2}% ${lightness2}%)" />`
          };
        case 'space':
          return {
            "shift": (unit * ratio) + parseInt(data.colspan),
            "letter": ``
          };
      }
      break;

    case 'round':
      switch (code) {
        case 'kurz':
          return {
            "shift": unit + parseInt(data.colspan),
            "letter": `<circle r="${unit/2}" cx="${unit/2}" cy="${unit/2}" fill="hsl(${hue1}deg ${saturation1}% ${lightness1}%)" />`
          };

        case 'lang':
          return {
            "shift": (unit * ratio) + parseInt(data.colspan),
            "letter": `<rect width="${unit * ratio}" height="${unit}" x="0" y="0" fill="hsl(${hue2}deg ${saturation2}% ${lightness2}%)" />`
          };
        case 'space':
          return {
            "shift": (unit * ratio) + parseInt(data.colspan),
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
    const letterASCII = upperCaseText[i];
    const letterMorseCode = morseCode[letterASCII];
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

      cursor += parseInt(shift);
      return result;
    });

    morseCodeString += `
      <g transform="translate(0, ${row})">
        ${letterMorseCodeSVG.join('')}
      </g>`;

    row += parseInt(data.rowspan);
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
    data.appearance = selector.value;

    selector.addEventListener('click', function () {
      data.appearance = this.value;
      renderMorseCode(document.querySelector('[data-js-text-input]').value);
    });
  });
}

const getSizeData = () => {
  const sizeSelector = document.querySelectorAll('[data-js-size] input');

  sizeSelector.forEach((selector) => {
    const field = selector.id;
    const value = selector.value;
    data[field] = value;
  });
};

const listenToSize = () => {
  const sizeSelector = document.querySelectorAll('[data-js-size] input');

  getSizeData();

  sizeSelector.forEach((selector) => {
    selector.addEventListener('click', function () {
      const field = this.id;
      const value = this.value;
      data[field] = value;
      renderMorseCode(document.querySelector('[data-js-text-input]').value);
    });
  });
}

const listenToColor = (indicator) => {
  const colorSelector = document.querySelectorAll('[data-js-'+indicator+'] input');

  colorSelector.forEach((selector) => {
    const field = selector.id;
    const value = selector.value;
    data[indicator][field] = value;
  });

  colorSelector.forEach((selector) => {
    
    selector.addEventListener('change', function () {
      const field = this.id;
      const value = this.value;
      data[indicator][field] = value;    
      renderMorseCode(document.querySelector('[data-js-text-input]').value);
    });
  });
};

const listenToPadding = () => {
  const paddingSelector = document.querySelectorAll('[data-js-padding] input');

  paddingSelector.forEach((selector) => {
    const field = selector.id;
    const value = selector.value;
    data[field] = value;
  });

  paddingSelector.forEach((selector) => {
    
    selector.addEventListener('click', function () {
      const field = this.id;
      const value = this.value;
      data[field] = value;    
      renderMorseCode(document.querySelector('[data-js-text-input]').value);
    });
  });
};

/* Main
############################################################################ */

document.addEventListener('DOMContentLoaded', function () {
  listenToAppearance();
  listenToSize();
  listenToPadding();
  listenToInput();
  listenToColor("color-1");
  listenToColor("color-2");
  showSomeText();
  saveSVG();
});