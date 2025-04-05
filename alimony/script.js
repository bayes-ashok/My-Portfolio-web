document.getElementById('alimonyForm').addEventListener('submit', calculateAlimony);
document.getElementById('generatePdf').addEventListener('click', generatePDF);
document.getElementById('alimonyType').addEventListener('change', toggleInflationField);

let alimonyData = {}; // Global variable to store data for PDF generation

function toggleInflationField() {
    const alimonyType = document.getElementById('alimonyType').value;
    const inflationInput = document.getElementById('inflation');
    if (alimonyType === 'lump-sum' || alimonyType === 'reimbursement') {
        inflationInput.disabled = true;
        inflationInput.value = 0;
    } else {
        inflationInput.disabled = false;
    }
}

function calculateAlimony(e) {
    e.preventDefault();

    const spouse1Name = document.getElementById('spouse1Name').value;
    const spouse2Name = document.getElementById('spouse2Name').value;
    const income1 = parseFloat(document.getElementById('income1').value);
    const income2 = parseFloat(document.getElementById('income2').value);
    const years = parseInt(document.getElementById('marriageYears').value);
    const province = document.getElementById('province').value;
    const children = parseInt(document.getElementById('children').value);
    const custody = parseFloat(document.getElementById('custody').value) / 100;
    const alimonyType = document.getElementById('alimonyType').value;
    const assets = parseFloat(document.getElementById('assets').value) || 0;
    const debt = parseFloat(document.getElementById('debt').value) || 0;
    const inflation = parseFloat(document.getElementById('inflation').value) / 100 || 0;

    // Base calculation: 30% of income difference, capped at 50% of income1
    let monthlyAmount = Math.min((income1 - income2) * 0.3, income1 * 0.5);
    if (monthlyAmount < 0) monthlyAmount = 0;

    const calcDetails = {
        income1,
        income2,
        baseAmount: monthlyAmount,
        years,
        province,
        children,
        custody,
        assets,
        debt,
        inflation
    };

    // Duration adjustment
    const durationFactor = years <= 5 ? 0.8 : years <= 10 ? 1.0 : 1.2;
    monthlyAmount *= durationFactor;
    calcDetails.afterYears = monthlyAmount;

    // Province cost of living adjustment
    const costOfLivingFactor = {
        'generic': 1.0,
        'province1': 0.95,
        'province2': 0.90,
        'province3': 1.15,
        'province4': 1.05,
        'province5': 1.0,
        'province6': 0.85,
        'province7': 0.90
    };
    monthlyAmount *= costOfLivingFactor[province];
    calcDetails.afterProvince = monthlyAmount;

    // Child support addition
    const childSupport = Math.min(children * 5000 * (1 - custody), income1 - monthlyAmount);
    monthlyAmount += childSupport;
    calcDetails.childSupport = childSupport;
    calcDetails.afterChildren = monthlyAmount;

    // Assets and debt adjustment
    const assetDebtAdjustment = (assets - debt) * 0.01;
    monthlyAmount = Math.max(monthlyAmount - assetDebtAdjustment, 0);
    calcDetails.assetDebtAdjustment = assetDebtAdjustment;
    calcDetails.afterAssetsDebt = monthlyAmount;

    // Remove minimum threshold of 5,000, keep only non-negative constraint, cap at 50% of income1
    monthlyAmount = Math.max(monthlyAmount, 0);
    monthlyAmount = Math.min(monthlyAmount, income1 * 0.5);
    calcDetails.finalMonthly = monthlyAmount;

    let data = { type: alimonyType, spouse1Name, spouse2Name, province, calcDetails };

    if (alimonyType === 'lump-sum') {
        data.oneTimeAmount = monthlyAmount * 12;
    } else if (alimonyType === 'reimbursement') {
        data.oneTimeAmount = monthlyAmount * 6;
    } else {
        const durationMonths = calculateDuration(years, alimonyType);
        if (alimonyType === 'permanent') {
            const projectedTotal = monthlyAmount * 120;
            const inflationAdjusted = projectedTotal * Math.pow(1 + inflation / 12, 120);
            data.monthlyAmount = monthlyAmount;
            data.duration = 'Indefinite';
            data.projectedTotal = projectedTotal;
            data.inflationAdjusted = inflationAdjusted;
        } else {
            const totalAmount = monthlyAmount * durationMonths;
            const inflationAdjusted = totalAmount * Math.pow(1 + inflation / 12, durationMonths);
            data.monthlyAmount = monthlyAmount;
            data.duration = durationMonths;
            data.totalAmount = totalAmount;
            data.inflationAdjusted = inflationAdjusted;
        }
    }

    displayResults(data);
}

function calculateDuration(years, type) {
    switch (type) {
        case 'temporary':
            return Math.min(years * 6, 12);
        case 'rehabilitative':
            return Math.min(years * 12, 24);
        case 'permanent':
            return 0;
        default:
            return 0;
    }
}

function displayResults(data) {
    alimonyData = data;
    const { type } = data;

    document.getElementById('amountDiv').style.display = 'none';
    document.getElementById('durationDiv').style.display = 'none';
    document.getElementById('totalDiv').style.display = 'none';
    document.getElementById('adjustedDiv').style.display = 'none';

    if (type === 'lump-sum' || type === 'reimbursement') {
        document.getElementById('totalLabel').textContent = type === 'lump-sum' ? 'Lump-Sum Settlement:' : 'Reimbursement Amount:';
        document.getElementById('totalValue').textContent = data.oneTimeAmount.toFixed(2);
        document.getElementById('totalDiv').style.display = 'block';
    } else {
        document.getElementById('amountLabel').textContent = 'Monthly Alimony:';
        document.getElementById('amountValue').textContent = data.monthlyAmount.toFixed(2);
        document.getElementById('duration').textContent = data.duration === 'Indefinite' ? 'Indefinite' : `${data.duration} months`;
        document.getElementById('totalLabel').textContent = type === 'permanent' ? 'Projected Total Amount (10 years):' : 'Total Amount:';
        document.getElementById('totalValue').textContent = (type === 'permanent' ? data.projectedTotal : data.totalAmount).toFixed(2);
        document.getElementById('adjustedLabel').textContent = 'Inflation-Adjusted Total:';
        document.getElementById('adjustedValue').textContent = data.inflationAdjusted.toFixed(2);
        document.getElementById('amountDiv').style.display = 'block';
        document.getElementById('durationDiv').style.display = 'block';
        document.getElementById('totalDiv').style.display = 'block';
        document.getElementById('adjustedDiv').style.display = 'block';
    }
    const resultSection = document.getElementById('result');
    let funnyMessage = document.getElementById('funnyMessage');
    if (!funnyMessage) {
        funnyMessage = document.createElement('p');
        funnyMessage.id = 'funnyMessage';
        resultSection.appendChild(funnyMessage);
    }

    funnyMessage.style.fontStyle = 'italic';
    funnyMessage.style.color = '#e74c3c'; // Vibrant red for attention
    funnyMessage.style.fontSize = '14px'; // Slightly larger for emphasis
    funnyMessage.style.lineHeight = '1.5'; // Better readability
    funnyMessage.style.marginTop = '15px'; // More spacing from results
    funnyMessage.style.padding = '8px'; // Padding for a "boxed" feel
    funnyMessage.style.backgroundColor = '#f9ebeb'; // Light red background for contrast
    funnyMessage.style.borderRadius = '5px'; // Rounded corners for a modern look
    funnyMessage.style.textAlign = 'center'; // Centered for visual appeal

    // Set the text with bolded "*highly reasonable*"
    funnyMessage.innerHTML = "Didn’t find the calculation fair? Time to consult your ex—oops, sorry, we mean your <strong>highly reasonable</strong> former soulmate. Good luck negotiating with that expert in incompatible differences’!";
    document.getElementById('result').classList.remove('hidden');
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
    });
    const data = alimonyData;
    const calc = data.calcDetails;
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;
    let y = margin;

    // Helper function to add text with page break handling
    function addText(text, x, y, options = {}) {
        doc.setTextColor(0, 0, 0); // Black text
        const lines = doc.splitTextToSize(text, maxLineWidth);
        lines.forEach(line => {
            if (y + 7 > pageHeight - margin) {
                doc.addPage();
                y = margin;
            }
            doc.text(line, x, y, { align: options.align || 'justify' });
            y += 7; // Uniform spacing between lines
        });
        return y;
    }

    // Date (Top Right)
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString();
    y = addText(`Date: ${today}`, pageWidth - margin, y, { align: 'right' });
    y += 6;

    // Title (Centered, Bold)
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    y = addText('Spousal Support Agreement', pageWidth / 2, y, { align: 'center' });
    y += 6;

    // Introductory Statement
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const introText = `This Spousal Support Agreement ("Agreement") is entered into on ${today} between the following parties:`;
    y = addText(introText, margin, y);
    y = addText(`1. Payor: ${data.spouse1Name} (hereinafter referred to as "Payor")`, margin + 5, y);
    y = addText(`2. Payee: ${data.spouse2Name} (hereinafter referred to as "Payee")`, margin + 5, y);
    y += 6;

    // 1. Terms of Agreement
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('1. Terms of Agreement', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const termsText = `WHEREAS, the Payor and Payee have agreed to the terms of spousal support as part of their divorce settlement, and the alimony has been estimated using the Alimony Estimator Pro tool in accordance with the laws of Nepal, specifically Section 100 of the National Civil Code 2074 BS, both parties agree to the following terms:`;
    y = addText(termsText, margin + 5, y);
    y += 6;

    // 2. Alimony Details (Conditional based on type)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('2. Alimony Details', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let alimonyDetails;
    if (data.type === 'lump-sum' || data.type === 'reimbursement') {
        alimonyDetails = [
            `• Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`,
            `• One-Time Amount: NPR ${data.oneTimeAmount.toFixed(2)}`
        ].join('\n');
    } else {
        const totalLabel = data.type === 'permanent' ? 'Projected Total Amount (10 years)' : 'Total Amount';
        const totalValue = data.type === 'permanent' ? data.projectedTotal : data.totalAmount;
        alimonyDetails = [
            `• Type: ${data.type.charAt(0).toUpperCase() + data.type.slice(1)}`,
            `• Monthly Amount: NPR ${data.monthlyAmount.toFixed(2)}`,
            `• Duration: ${data.duration === 'Indefinite' ? 'Indefinite' : `${data.duration} months`}`,
            `• ${totalLabel}: NPR ${totalValue.toFixed(2)}`,
            `• Inflation-Adjusted Total: NPR ${data.inflationAdjusted.toFixed(2)}`
        ].join('\n');
    }
    y = addText(alimonyDetails, margin + 5, y);
    y += 6;

    // 3. Calculation Details
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('3. Calculation Details', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    const calcText = [
        `• Payor’s Income: NPR ${calc.income1.toFixed(2)}`,
        `• Payee’s Income: NPR ${calc.income2.toFixed(2)}`,
        `• Base Amount: NPR ${calc.baseAmount.toFixed(2)}`,
        `  (Minimum of: 30% of income difference = (${calc.income1} - ${calc.income2}) × 0.3 = ${(calc.income1 - calc.income2) * 0.3}, 50% of Payor’s income = ${calc.income1} × 0.5 = ${calc.income1 * 0.5})`,
        `• After Marriage Duration Adjustment: NPR ${calc.afterYears.toFixed(2)}`,
        `  (Base × ${calc.years <= 5 ? 0.8 : calc.years <= 10 ? 1.0 : 1.2})`,
        `• After Province Adjustment: NPR ${calc.afterProvince.toFixed(2)}`,
        `  (Previous × ${costOfLivingFactor[calc.province]})`,
        `• Child Support: NPR ${calc.childSupport.toFixed(2)}`,
        `  (Minimum of: ${calc.children} × 5000 × (1 - ${calc.custody}) = ${calc.children * 5000 * (1 - calc.custody)}, ${calc.income1} - Previous = ${calc.income1 - calc.afterProvince})`,
        `• After Children: NPR ${calc.afterChildren.toFixed(2)}`,
        `• Assets/Debt Adjustment: NPR ${calc.assetDebtAdjustment.toFixed(2)}`,
        `  ((${calc.assets} - ${calc.debt}) × 0.01)`,
        `• Final Monthly Amount: NPR ${calc.finalMonthly.toFixed(2)}`,
        `  (Maximum of: (Previous - Adjustment) = ${calc.afterChildren - calc.assetDebtAdjustment}, 0; capped at ${calc.income1 * 0.5})`
    ];
    if (data.type === 'lump-sum') {
        calcText.push(`• One-Time Amount: NPR ${data.oneTimeAmount.toFixed(2)} (Final Monthly Amount × 12)`);
    } else if (data.type === 'reimbursement') {
        calcText.push(`• One-Time Amount: NPR ${data.oneTimeAmount.toFixed(2)} (Final Monthly Amount × 6)`);
    } else {
        const totalLabel = data.type === 'permanent' ? 'Projected Total Amount (10 years)' : 'Total Amount';
        const totalValue = data.type === 'permanent' ? data.projectedTotal : data.totalAmount;
        calcText.push(`• ${totalLabel}: NPR ${totalValue.toFixed(2)}`);
    }
    y = addText(calcText.join('\n'), margin + 5, y);
    y += 6;

    // 4. Payment Terms (Conditional)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('4. Payment Terms', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let paymentText;
    if (data.type === 'lump-sum' || data.type === 'reimbursement') {
        paymentText = `The Payor shall pay NPR ${data.oneTimeAmount.toFixed(2)} as a one-time payment to the Payee within 30 days of signing via bank transfer.`;
    } else {
        paymentText = `The Payor shall pay NPR ${data.monthlyAmount.toFixed(2)} monthly to the Payee on the 1st of each month via bank transfer.`;
    }
    y = addText(paymentText, margin + 5, y);
    y += 6;

    // 5. Adjustment Clause
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('5. Adjustment Clause', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    y = addText(`This Agreement may be modified by mutual consent or court order if circumstances change (e.g., income, remarriage).`, margin + 5, y);
    y += 6;

    // 6. Termination Conditions (Conditional)
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('6. Termination Conditions', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    let terminationText;
    if (data.type === 'lump-sum' || data.type === 'reimbursement') {
        terminationText = `This agreement terminates upon the one-time payment.`;
    } else if (data.type === 'permanent') {
        terminationText = `Payments continue indefinitely until modified by court order or mutual agreement.`;
    } else {
        terminationText = `Payments cease after ${data.duration} months.`;
    }
    y = addText(terminationText, margin + 5, y);
    y += 6;

    // 7. Legal Compliance
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('7. Legal Compliance', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    y = addText(`This Agreement complies with Section 100 of the National Civil Code 2074 BS, enforceable in ${data.province}.`, margin + 5, y);
    y += 6;

    // 8. Signatures
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    y = addText('8. Signatures', margin, y);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    y = addText('By signing below, both parties agree to the terms herein:', margin + 5, y);
    y += 6;
    y = addText(`Payor: ${data.spouse1Name}`, margin + 5, y);
    y = addText('______________________________', margin + 30, y - 5, { align: 'left' });
    y += 6;
    y = addText(`Payee: ${data.spouse2Name}`, margin + 5, y);
    y = addText('______________________________', margin + 30, y - 5, { align: 'left' });
    y += 6;
    y = addText('Witness 1:______________________________', margin + 5, y, { align: 'left' });
    y += 6;
    y = addText('Witness 2:______________________________', margin + 5, y, { align: 'left' });
    y += 12;

    // Footer Note
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    y = addText(
        'Note: This document was generated by AlimonyCalc Pro — your free lawyer from the internet and the closest thing to legal help without paying for it unless your ex objects. Approved for legal use in Nepal.',
        pageWidth / 2, y, { align: 'center' }
    );
    y = addText(
        '(By absolutely no one official.)',
        pageWidth / 2, y, { align: 'center' }
    );

    doc.save(`Alimony_Agreement_${data.spouse1Name}_vs_${data.spouse2Name}.pdf`);
}

const costOfLivingFactor = {
    'generic': 1.0,
    'province1': 0.95,
    'province2': 0.90,
    'province3': 1.15,
    'province4': 1.05,
    'province5': 1.0,
    'province6': 0.85,
    'province7': 0.90
};