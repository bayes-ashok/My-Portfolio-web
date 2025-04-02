document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('nameModal');
    modal.classList.add('hidden'); 
});

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
    console.log("point 1: " + score);


    if (groomJob === 'labor') score += 2;
    else if (groomJob === 'private') score += 4;
    else if (groomJob === 'govt') score += 8;
    else if (groomJob === 'professional') score += 6;
    console.log("point 2: " + score);


    if (groomIncome === 'below5') score += 1;
    else if (groomIncome === '5to10') score += 3;
    else if (groomIncome === '10to20') score += 5;
    else if (groomIncome === '20to50') score += 7;
    else if (groomIncome === 'above50') score += 10;
    console.log("point 3: " + score);


    if (ownsHouse) score += 3;
    if (landInAcres > 0 && landInAcres <= 5) score += 2;
    else if (landInAcres < 10 && landInAcres > 5) score += 4;
    else if (landInAcres >= 10) score += 6;
    console.log("point 4: " + score);


    if (otherAssets === 'some') score += 1;
    else if (otherAssets === 'significant') score += 3;

    let cash = 200000 + (score * 100000);
    console.log("point 5: " + score);
    if (ownsHouse) cash += 500000;
    if (landInAcres > 0) cash += Math.floor(landInAcres * 200000);
    if (otherAssets === 'some') cash += 200000;
    else if (otherAssets === 'significant') cash += 500000;
    console.log("point 2: " + cash);


    if (brideEdu === 'none') cash -= 0;
    else if (brideEdu === 'highschool') cash -= 25000;
    else if (brideEdu === 'diploma') cash -= 40000;
    else if (brideEdu === 'bachelor') cash -= 50000;
    else if (brideEdu === 'master') cash -= 100000;
    else if (brideEdu === 'phd') cash -= 150000;

    if (brideJob === 'none') cash -= 0;
    else if (brideJob === 'labor') cash -= 50000;
    else if (brideJob === 'private') cash -= 100000;
    else if (brideJob === 'govt') cash -= 200000;
    else if (brideJob === 'professional') cash -= 150000;

    if (brideIncome === 'none') cash -= 0;
    else if (brideIncome === 'below5') cash -= 25000;
    else if (brideIncome === '5to10') cash -= 50000;
    else if (brideIncome === '10to20') cash -= 100000;
    else if (brideIncome === 'above20') cash -= 200000;

    if (brideAge < 25) cash -= 100000;
    else if (brideAge > 30) cash += 100000;

    let car = '', carValue = 0, gold = 0, goldValue = 0;
    if (score < 15) {
        car = 'None';
    } else if (score <= 20) {
        car = 'Maruti Suzuki';
        carValue = 500000;
    } else if (score <= 25) {
        car = 'Hyundai';
        carValue = 1000000;
    } else if (score <= 30) {
        car = 'Toyota';
        carValue = 2000000;
    } else {
        car = 'BMW';
        carValue = 5000000;
    }

    if (score >= 0 && score <= 10) {
        gold = 2;
        goldValue = gold * 60000;
    } else if (score <= 15) {
        gold = 5;
        goldValue = gold * 60000;
    } else if (score <= 25) {
        gold = 10;
        goldValue = gold * 60000;
    } else if (score > 25) {
        gold = 20;
        goldValue = gold * 60000;
    }

    // Adjust cash if negative
    let displayCash = cash;
    let message = '';
    if (cash < 0) {
        displayCash = 100000;
        message = `
        <p style="font-size: 14px; color: #ffd700;">
            Even though the bride is more capable, we don't go against the ritual and make the groom pay; still, the bride has to give a dowry of ₨100,000.
        </p>
    `;
    } else {
        message = ``; 
    }
    const result = `
    <div style="text-align: center;">
        <h2 style="font-size: 24px; margin-bottom: 10px;">Dowry Estimate</h2>
        ${cash >= 0 ? `<p><strong>Cash:</strong> ₨ ${cash.toLocaleString()}</p>` : ''}
        <p><strong>Car:</strong> ${car}</p>
        <p><strong>Gold:</strong> ${gold} tola</p>
        ${message}
        <br> 
        <p style="font-size: 12px; color: #888;">
            This is not for educational purposes, but for real-life use. We encourage you to use it; understand and recognize your worth.        
        </p>
    </div>
   
`;

    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = result;
    resultDiv.classList.remove('hidden');

    const downloadBtn = document.getElementById('downloadPdfBtn');
    downloadBtn.classList.remove('hidden');

    window.dowryResult = { cash, displayCash, car, gold, message };

    const crystal = document.getElementById('crystalBall');
    crystal.style.animation = 'spin 1s infinite linear, pulse 1.5s infinite';
    setTimeout(() => crystal.style.animation = 'spin 6s infinite linear, pulse 1.5s infinite', 2000);
});


// Ensure the modal is hidden on page load
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('nameModal');
    modal.classList.add('hidden'); // Ensure modal is hidden on page load
});

// Handle PDF Download
document.getElementById('downloadPdfBtn').addEventListener('click', function () {
    // Show the modal to collect names
    const modal = document.getElementById('nameModal');
    modal.classList.remove('hidden');
});

// Handle modal close
document.getElementById('closeModal').addEventListener('click', function () {
    const modal = document.getElementById('nameModal');
    modal.classList.add('hidden');
});

// Handle name form submission and PDF generation
document.getElementById('nameForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const brideName = document.getElementById('brideName').value.trim();
    const groomName = document.getElementById('groomName').value.trim();

    if (!brideName || !groomName) {
        alert("Please enter both the bride's and groom's names.");
        return;
    }

    // Hide the modal
    const modal = document.getElementById('nameModal');
    modal.classList.add('hidden');

    // Extract dowry result data
    const { cash, displayCash, car, gold, message } = window.dowryResult;

    // Generate PDF using jsPDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set document properties
    doc.setProperties({
        title: 'Dowry Agreement',
        author: 'Dowry Estimator Pro',
        creator: 'Dowry Estimator Pro'
    });

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Dowry Agreement', 105, 20, { align: 'center' });

    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString();
    doc.text(`Date: ${today}`, 105, 30, { align: 'center' });

    // Introductory Statement
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const introText = `This Dowry Agreement ("Agreement") is entered into on ${today} between the following parties:`;
    const splitIntro = doc.splitTextToSize(introText, 170);
    doc.text(splitIntro, 20, 40);
    let yPos = 40 + splitIntro.length * 5 + 5;

    // Parties Involved
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Parties', 20, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`1. Bride: ${brideName} (hereinafter referred to as "Bride")`, 20, yPos);
    yPos += 10;
    doc.text(`2. Groom: ${groomName} (hereinafter referred to as "Groom")`, 20, yPos);
    yPos += 15;

    // Agreement Terms
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Terms of Agreement', 20, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    const termsText = `WHEREAS, the Bride and Groom have agreed to enter into a marriage arrangement, and as part of the cultural practices, the Bride's family agrees to provide a dowry to the Groom. The dowry has been estimated using the Dowry Estimator Pro tool, and both parties agree to the following terms:`;
    const splitTerms = doc.splitTextToSize(termsText, 170);
    doc.text(splitTerms, 20, yPos);
    yPos += splitTerms.length * 5 + 10;

    // Dowry Details
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Dowry Details:', 20, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    if (cash >= 0) {
        doc.text(`- Cash: Rs. ${cash.toLocaleString()}`, 30, yPos);
        yPos += 10;
    }
    doc.text(`- Car: ${car}`, 30, yPos);
    yPos += 10;
    doc.text(`- Gold: ${gold} tola`, 30, yPos);
    yPos += 10;
   

    // Special Condition (if cash is negative)
    if (cash < 0) {
        const specialCondition = `Special Condition: Even though the Bride is more capable, the parties agree to uphold cultural practices. Therefore, the Bride shall provide a minimum dowry of ₨100,000, as calculated by the Dowry Estimator Pro tool.`;
        const splitCondition = doc.splitTextToSize(specialCondition, 170);
        doc.text(splitCondition, 20, yPos);
        yPos += splitCondition.length * 5 + 10;
    }

    // Agreement Statement
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const agreementText = `NOW, THEREFORE, the Bride and Groom agree that the dowry as specified above shall be provided by the Bride's family to the Groom as part of the marriage arrangement. Both parties acknowledge that this Agreement is entered into voluntarily and with full understanding of its terms.`;
    const splitAgreement = doc.splitTextToSize(agreementText, 170);
    doc.text(splitAgreement, 20, yPos);
    yPos += splitAgreement.length * 5 + 15;

    // Signature Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Signatures', 20, yPos);
    yPos += 10;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Bride: ${brideName}`, 20, yPos);
    doc.text('______________________________', 60, yPos);
    yPos += 20;
    doc.text(`Groom: ${groomName}`, 20, yPos);
    doc.text('______________________________', 60, yPos);
    yPos += 20;
    doc.text('Date: ______________________', 20, yPos);

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.text('Generated by Dowry Estimator Pro', 105, 280, { align: 'center' });

    // Save the PDF
    doc.save(`Dowry_Agreement_${brideName}_${groomName}.pdf`);
});