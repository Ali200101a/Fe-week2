const heightInput = document.querySelector('#height');
const weightInput = document.querySelector('#weight');
const button = document.querySelector('#calcBtn');
const resultContainer = document.querySelector('#result-container');
const resultValue = document.querySelector('#result-value');

button.addEventListener('click', () => {
  const heightCm = Number(heightInput.value);
  const weightKg = Number(weightInput.value);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    alert('Please enter valid height and weight.');
    resultContainer.style.display = 'none';
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  resultValue.textContent = bmi.toFixed(1);
  resultContainer.style.display = 'block';
});
