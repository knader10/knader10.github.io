function trunc(valor) {
  const multiplicadoPor1000 = Math.round(valor * 1000);
  const terceiraCasaDecimal = multiplicadoPor1000 % 10;

  if (terceiraCasaDecimal === 9) {
    return (Math.floor(multiplicadoPor1000 / 10) + 1) / 100;
  }

  return Math.floor(multiplicadoPor1000 / 10) / 100;
}

function irrf_trunc(valor) {
  const multiplicadoPor100 = Math.floor(valor * 100);
  return multiplicadoPor100 / 100;
}

function calculateSalarioLiquido() {
  let salarioBrutoStr = document.getElementById('salario_bruto').value;
  salarioBrutoStr = salarioBrutoStr.replace(/\./g, '').replace(',', '.');
  let salarioBruto = parseFloat(salarioBrutoStr);

  if (isNaN(salarioBruto)) {
    alert("Insira um valor para efetuar o cálculo.");
    return;
  }

  let inss = 0;
  let aliquota_previdencia = '';

  if (salarioBruto <= 1518) {
    inss = trunc(salarioBruto * 0.075);
    aliquota_previdencia = '7,5%';
  } else if (salarioBruto <= 2793.88) {
    inss = trunc(1518 * 0.075) + trunc((salarioBruto - 1518.01) * 0.09);
    aliquota_previdencia = '9%';
  } else if (salarioBruto <= 4190.83) {
    inss = trunc(1518 * 0.075) + trunc((2793.88 - 1518.01) * 0.09) + trunc((salarioBruto - 2793.89) * 0.12);
    aliquota_previdencia = '12%';
  } else if (salarioBruto <= 8157.41) {
    inss = trunc(1518 * 0.075) + trunc((2793.88 - 1518.01) * 0.09) + trunc((4190.83 - 2793.89) * 0.12) + trunc((salarioBruto - 4000.04) * 0.14);
    aliquota_previdencia = '14%';
  } else {
    inss = 951.62;
    aliquota_previdencia = '14%';
  }

  let inss_desc = trunc(inss);

  let dependentes = parseInt(document.getElementById("qtdedependentes").value) || 0;
  let dependentes_deducao = dependentes > 0 ? irrf_trunc(dependentes * 189.59) : 0;

  let soma_para_base_irrf = irrf_trunc(inss_desc + dependentes_deducao);
  let bas_deducao = soma_para_base_irrf;
  
  if (bas_deducao <= 564.80) {
         baseIRRF = irrf_trunc(salarioBruto - 564.80);
  }
   else {
         baseIRRF = irrf_trunc(salarioBruto - bas_deducao);
   }

let base_de_calculo_irrf = baseIRRF;
  let aliquotaIRRF = 0;
  let deducaoIRRF = 0;
  let aliqirrf = 0;
   
 
 // isenção de irrf 
 if (base_de_calculo_irrf <= 2259.20) {
   aliqirrf = '%';
   deducaoIRRF = '0'
 } else if (base_de_calculo_irrf <= 2826.65) {
   aliqirrf = '7,5%';
   aliquotaIRRF = 0.075;
   deducaoIRRF = 169.44;  // Dedução para faixa de 2.112,01 até 2.826,65
 } else if (base_de_calculo_irrf <= 3751.05) { 
   aliqirrf = '15%';
   aliquotaIRRF = 0.15;
   deducaoIRRF = 381.44;  // Dedução para faixa de 2.826,66 até 3.751,05
 } else if (base_de_calculo_irrf <= 4664.68) {
   aliqirrf = '22,5%';
   aliquotaIRRF = 0.225;
   deducaoIRRF = 662.77;  // Dedução para faixa de 3.751,06 até 4.664,68
 } else if (base_de_calculo_irrf >= 4664.69) { 
   aliqirrf = '27,5%';
   aliquotaIRRF = 0.275;
   deducaoIRRF = 896.00;  // Dedução para faixa acima de 4.664,68
 }
 

 let result_irrf = irrf_trunc((base_de_calculo_irrf * (aliquotaIRRF * 100)) / 100) - deducaoIRRF;

 result_irrf = result_irrf >= 0 ? result_irrf : 0;

  let salarioLiquido = trunc(salarioBruto - inss_desc - result_irrf);

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

  document.getElementById('previdencia_desconto').textContent = salarioFormatado2;
  document.getElementById('aliquota_previdencia').textContent = aliquota_previdencia;
  document.getElementById('salario_liquido').textContent = salarioFormatado;
  document.getElementById('irrf_desc').textContent = salarioFormatado3;
  document.getElementById('aliquota_irrf').textContent = aliqirrf;
}

function limparFormulario() {
  document.getElementById('salario_bruto').value = '';
  document.getElementById('qtdedependentes').value = '';
  document.getElementById('previdencia_desconto').textContent = '0,00';
  document.getElementById('aliquota_previdencia').textContent = '%';
  document.getElementById('salario_liquido').textContent = '0,00';
  document.getElementById('irrf_desc').textContent = '0,00';
  document.getElementById('aliquota_irrf').textContent = '%';
}