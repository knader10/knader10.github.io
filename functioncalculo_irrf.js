function truncIrrf(valor) {
  const multiplicadoPor1000 = Math.round(valor * 1000);
  const terceiraCasaDecimal = multiplicadoPor1000 % 10;

  if (terceiraCasaDecimal === 9) {
    return (Math.floor(multiplicadoPor1000 / 10) + 1) / 100;
  }

  return Math.floor(multiplicadoPor1000 / 10) / 100;
}

function irrfTruncIrrf(valor) {
  const multiplicadoPor100 = Math.floor(valor * 100);
  return multiplicadoPor100 / 100;
}

function parseCurrencyInput(valor) {
  const limpo = valor.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(limpo);
}

function calculateIrrfManual() {
  let salarioBrutoStr = document.getElementById('salario_bruto_irrf').value;
  let inssManualStr = document.getElementById('inss_manual_irrf').value;

  let salarioBruto = parseCurrencyInput(salarioBrutoStr);
  let inssManual = parseCurrencyInput(inssManualStr);

  if (isNaN(salarioBruto)) {
    alert("Insira um valor para efetuar o calculo.");
    return;
  }

  inssManual = isNaN(inssManual) ? 0 : inssManual;

  let inss_desc = irrfTruncIrrf(inssManual);

  let dependentes = parseInt(document.getElementById("qtdedependentes_irrf").value) || 0;
  let dependentes_deducao = dependentes > 0 ? irrfTruncIrrf(dependentes * 189.59) : 0;

  let soma_para_base_irrf = irrfTruncIrrf(inss_desc + dependentes_deducao);
  let bas_deducao = soma_para_base_irrf;

  let baseIRRF = 0;
  if (bas_deducao <= 607.20) {
    baseIRRF = irrfTruncIrrf(salarioBruto - 607.20);
  } else {
    baseIRRF = irrfTruncIrrf(salarioBruto - bas_deducao);
  }

  let base_de_calculo_irrf = baseIRRF;
  let aliquotaIRRF = 0;
  let deducaoIRRF = 0;
  let aliqirrf = 0;

  if (base_de_calculo_irrf <= 2428.80) {
    aliqirrf = '%';
    deducaoIRRF = '0';
  } else if (base_de_calculo_irrf <= 2826.65) {
    aliqirrf = '7,5%';
    aliquotaIRRF = 0.075;
    deducaoIRRF = 182.16;
  } else if (base_de_calculo_irrf <= 3751.05) {
    aliqirrf = '15%';
    aliquotaIRRF = 0.15;
    deducaoIRRF = 394.16;
  } else if (base_de_calculo_irrf <= 4664.68) {
    aliqirrf = '22,5%';
    aliquotaIRRF = 0.225;
    deducaoIRRF = 675.49;
  } else if (base_de_calculo_irrf >= 4664.69) {
    aliqirrf = '27,5%';
    aliquotaIRRF = 0.275;
    deducaoIRRF = 908.73;
  }

  let result_irrf = irrfTruncIrrf((base_de_calculo_irrf * (aliquotaIRRF * 100)) / 100) - deducaoIRRF;

  result_irrf = result_irrf >= 0 ? result_irrf : 0;

  let reducaoIRRF = 0;

  if (salarioBruto <= 5000) {
    reducaoIRRF = result_irrf;
  } else if (salarioBruto <= 7350) {
    reducaoIRRF = 978.62 - (0.133145 * salarioBruto);
    reducaoIRRF = reducaoIRRF > 0 ? reducaoIRRF : 0;
    reducaoIRRF = Math.min(result_irrf, reducaoIRRF);
  }

  result_irrf = irrfTruncIrrf(result_irrf - reducaoIRRF);
  result_irrf = result_irrf >= 0 ? result_irrf : 0;

  let salarioLiquido = truncIrrf(salarioBruto - inss_desc - result_irrf);

  let salarioFormatado = salarioLiquido.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  let salarioFormatado2 = inss_desc.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
  let salarioFormatado3 = result_irrf.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  document.getElementById('previdencia_desconto_irrf').textContent = salarioFormatado2;
  document.getElementById('aliquota_previdencia_irrf').textContent = 'Informado';
  document.getElementById('salario_liquido_irrf').textContent = salarioFormatado;
  document.getElementById('irrf_desc_irrf').textContent = salarioFormatado3;
  document.getElementById('aliquota_irrf_irrf').textContent = aliqirrf;
}

function limparFormularioIrrf() {
  document.getElementById('salario_bruto_irrf').value = '';
  document.getElementById('qtdedependentes_irrf').value = '';
  document.getElementById('inss_manual_irrf').value = '';
  document.getElementById('previdencia_desconto_irrf').textContent = '0,00';
  document.getElementById('aliquota_previdencia_irrf').textContent = 'Informado';
  document.getElementById('salario_liquido_irrf').textContent = '0,00';
  document.getElementById('irrf_desc_irrf').textContent = '0,00';
  document.getElementById('aliquota_irrf_irrf').textContent = '%';
}
