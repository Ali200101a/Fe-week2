const heightInput = document.querySelector('#height');
const weightInput = document.querySelector('#weight');
const button = document.querySelector('#calcBtn');
const result = document.querySelector('#result');

button.addEventListener('click', () => {
  const heightCm = Number(heightInput.value);
  const weightKg = Number(weightInput.value);

  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) {
    result.textContent = 'Please enter valid height and weight.';
    return;
  }

  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  result.textContent = `Your BMI is ${bmi.toFixed(1)}`;
});
