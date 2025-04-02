document.getElementById('dowryForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const groomEdu = document.getElementById('groomEdu').value;
    const groomJob = document.getElementById('groomJob').value;
    const groomIncome = document.getElementById('groomIncome').value;
    const groomAge = parseInt(document.getElementById('groomAge').value) || 0;
    const ownsHouse = document.getElementById('house').checked;
    const landAmount = parseFloat(document.getElementById('landAmount').value) || 0;
    const landUnit = document.getElementById('landUnit').value;
    const otherAssets = document.getElementById('otherAssets').value;

    const brideAge = parseInt(document.getElementById('brideAge').value) || 0;
    const brideEdu = document.getElementById('brideEdu').value;
    const brideJob = document.getElementById('brideJob').value;
    const brideIncome = document.getElementById('brideIncome').value;

    if (groomAge < 18 || groomAge > 60 || brideAge < 18 || brideAge > 60) {
        alert("Age must be between 18 and 60!");
        return;
    }

    let landInAcres = landAmount;
    if (landUnit === 'hectares') landInAcres *= 2.471;
    else if (landUnit === 'sqkm') landInAcres *= 247.105;
    else if (landUnit === 'bigha') landInAcres *= 0.619;

    let score = 0;
    if (groomEdu === 'highschool') score += 1;
    else if (groomEdu === 'diploma') score += 2;
    else if (groomEdu === 'bachelor') score += 4;
    else if (groomEdu === 'master') score += 6;
    else if (groomEdu === 'phd') score += 8;

    if (groomJob === 'labor') score += 2;
    else if (groomJob === 'private') score += 4;
    else if (groomJob === 'govt') score += 6;
    else if (groomJob === 'professional') score += 8;

    if (groomIncome === 'below5') score += 1;
    else if (groomIncome === '5to10') score += 3;
    else if (groomIncome === '10to20') score += 5;
    else if (groomIncome === '20to50') score += 7;
    else if (groomIncome === 'above50') score += 10;

    if (ownsHouse) score += 3;
    if (landInAcres >= 1 && landInAcres < 5) score += 2;
    else if (landInAcres < 10) score += 4;
    else if (landInAcres >= 10) score += 6;

    if (otherAssets === 'some') score += 1;
    else if (otherAssets === 'significant') score += 3;

    let cash = 200000 + (score * 100000);
    if (ownsHouse) cash += 500000;
    if (landInAcres > 0) cash += Math.floor(landInAcres * 200000);
    if (otherAssets === 'some') cash += 200000;
    else if (otherAssets === 'significant') cash += 500000;

    if (brideEdu === 'none') cash -= 0;
    else if (brideEdu === 'highschool') cash -= 25000;
    else if (brideEdu === 'diploma') cash -= 40000;
    else if (brideEdu === 'bachelor') cash -= 50000;
    else if (brideEdu === 'master') cash -= 100000;
    else if (brideEdu === 'phd') cash -= 150000;

    if (brideJob === 'none') cash -= 0;
    else if (brideJob === 'labor') cash -= 50000;
    else if (brideJob === 'private') cash -= 100000;
    else if (brideJob === 'govt') cash -= 150000;
    else if (brideJob === 'professional') cash -= 200000;

    if (brideIncome === 'none') cash -= 0;
    else if (brideIncome === 'below5') cash -= 25000;
    else if (brideIncome === '5to10') cash -= 50000;
    else if (brideIncome === '10to20') cash -= 100000;
    else if (brideIncome === 'above20') cash -= 200000;

    if (brideAge < 25) cash += 100000;
    else if (brideAge > 30) cash -= 50000;

    let car = '', carValue = 0, gold = 0, goldValue = 0;
    if (score < 5) {
        car = 'None';
    } else if (score <= 10) {
        car = 'Maruti Suzuki';
        carValue = 500000;
    } else if (score <= 15) {
        car = 'Hyundai';
        carValue = 1000000;
    } else if (score <= 25) {
        car = 'Toyota';
        carValue = 2000000;
    } else {
        car = 'BMW';
        carValue = 5000000;
    }

    if (score >= 5 && score <= 10) gold = 20, goldValue = 100000;
    else if (score <= 15) gold = 50, goldValue = 250000;
    else if (score <= 25) gold = 100, goldValue = 500000;
    else if (score > 25) gold = 200, goldValue = 1000000;

    const total = cash + carValue + goldValue;

    const result = `
    <div style="text-align: center;">
        <h2 style="font-size: 24px; margin-bottom: 10px;">Dowry Estimate</h2>
        <p><strong>Cash:</strong> ₨ ${cash.toLocaleString()}</p>
        <p><strong>Car:</strong> ${car} ${carValue > 0 ? `(₨ ${carValue.toLocaleString()})` : ''}</p>
        <p><strong>Gold:</strong> ${gold}g (₨ ${goldValue.toLocaleString()})</p>
        <p style="font-size: 18px; font-weight: bold; color: #5cb85c;">
            Total: ₨ ${total.toLocaleString()}
        </p>
        <p style="font-size: 12px; color: #888;">
            This is not for educational purposes, but for real-life use. We encourage you to use it; understand and recognize your worth.        
        </p>
    </div>
`;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = result;
    resultDiv.classList.remove('hidden');

    const crystal = document.getElementById('crystalBall');
    crystal.style.animation = 'spin 1s infinite linear, pulse 1.5s infinite';
    setTimeout(() => crystal.style.animation = 'spin 6s infinite linear, pulse 1.5s infinite', 2000);
});