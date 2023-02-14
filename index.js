// вхідні данні
const providers = [
  {
    name: backblaze,
    min: 7,
    storage: 0.005,
    transfer: 0.01,
  },
  {
    name: bunny,
    max: 10,
    storage: [0.01, 0.02],
    transfer: 0.01,
  },
  {
    name: scaleway,
    min: 0,
    storage: [0.06, 0.03],
    transfer: 0.02,
  },
  {
    name: vultr,
    min: 5,
    storage: 0.01,
    transfer: 0.01,
  },
];
//змінні для введення початкових значень GB
const storageRangeInput = document.querySelector("#storage-price");
const storageOutput = document.querySelector("#storage-selected-value");
const transferRangeInput = document.querySelector("#transfer-price");
const transferOutput = document.querySelector("#transfer-selected-value");
// виклик функцій при зміні параметрів
window.addEventListener("load", () => {
  textContentValue(storageOutput, storageRangeInput.value);
  textContentValue(transferOutput, transferRangeInput.value);
  selectedParams(storageOutput, transferOutput);
  minimalPrice();
});

outputValue(transferRangeInput, transferOutput);
outputValue(storageRangeInput, storageOutput);

document.addEventListener("input", () => {
  selectedParams(storageOutput, transferOutput);
  minimalPrice();
});
//функція для запису обчислень в html
function textContentValue(output, input) {
  output.textContent = input;
}
//функція для обрахунку вартості
function calculator(storageValueGB, transferValueGB, storagePrice, provider) {
  const { name, min, transfer, max } = provider;
  const price = document.querySelector(`.${name.id}-price`);
  const rezult = storageValueGB * storagePrice + transferValueGB * transfer;
  if (rezult <= min) {
    textContentValue(price, min.toFixed(2));
    return (name.style.width = `${min * 5}px`);
  }
  if (rezult >= max) {
    textContentValue(price, max.toFixed(2));

    return (name.style.width = `${max * 5}px`);
  }
  textContentValue(price, rezult.toFixed(2));

  name.style.width = `${rezult * 5}px`;
}
// функція для вибору вартості інтернету в залежності від параметрів
function selectedParams(storageOutput, transferOutput) {
  const bunnyCheck = document.querySelector(`input[name="bunny"]:checked`);
  const scalewayCheck = document.querySelector(
    `input[name="scaleway"]:checked`
  );
  providers.map((provider) => {
    const { name, storage } = provider;
    if (name.id === "backblaze" || name.id === "vultr") {
      calculator(
        storageOutput.textContent,
        transferOutput.textContent,
        storage,
        provider
      );
    } else if (name.id === "bunny") {
      const storagePrice = bunnyCheck.value === "hdd" ? storage[0] : storage[1];
      calculator(
        storageOutput.textContent,
        transferOutput.textContent,
        storagePrice,
        provider
      );
    } else if (name.id === "scaleway") {
      const storageValueGB =
        storageOutput.textContent < 75 ? 0 : storageOutput.textContent - 75;
      const transferValueGB =
        transferOutput.textContent < 75 ? 0 : transferOutput.textContent - 75;
      const storagePrice =
        scalewayCheck.value === "multi" ? storage[0] : storage[1];
      calculator(storageValueGB, transferValueGB, storagePrice, provider);
    }
  });
}
//функція для визначення мінімальної вартості
function minimalPrice() {
  const diagramColumns = Array.from(
    document.querySelectorAll(`.diagram-column`)
  );
  diagramColumns.map((column) => (column.style.backgroundColor = `grey`));
  const prices = Array.from(document.querySelectorAll(`.price`));
  const pricesSort = prices
    .map((price) => price.textContent)
    .sort((a, b) => a - b);
  providers.map((provider) => {
    const { name } = provider;
    const price = document.querySelector(`.${name.id}-price`);
    if (price.textContent === pricesSort[0]) {
      return (name.style.backgroundColor = `red`);
    }
  });
}
// функція для передачі значень GB від input
function outputValue(input, output) {
  input.addEventListener("input", (e) => (output.textContent = e.target.value));
}
