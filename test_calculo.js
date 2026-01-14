// Funções auxiliares (copiadas do arquivo original)
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

// Função de cálculo adaptada para receber parâmetros e retornar valores
function calcularSimulado(salarioBruto, dependentes = 0) {
  
  let inss = 0;
  let aliquota_previdencia = '';

  if (salarioBruto <= 1621) {
    inss = trunc(salarioBruto * 0.075);
    aliquota_previdencia = '7,5%';
  } else if (salarioBruto <= 2902.84) {
    inss = trunc(1621 * 0.075) + trunc((salarioBruto - 1621.01) * 0.09);
    aliquota_previdencia = '9%';
  } else if (salarioBruto <= 4354.27) {
    inss = trunc(1621 * 0.075) + trunc((2902.84 - 1621.01) * 0.09) + trunc((salarioBruto - 2902.85) * 0.12);
    aliquota_previdencia = '12%';
  } else if (salarioBruto <= 8475.55) {
    inss = trunc(1621 * 0.075) + trunc((2902.84 - 1621.01) * 0.09) + trunc((4354.27 - 2902.85) * 0.12) + trunc((salarioBruto - 4354.28) * 0.14);
    aliquota_previdencia = '14%';
  } else {
    inss = 951.62;
    aliquota_previdencia = '14%';
  }

  let inss_desc = trunc(inss);

  let dependentes_deducao = dependentes > 0 ? irrf_trunc(dependentes * 189.59) : 0;

  let soma_para_base_irrf = irrf_trunc(inss_desc + dependentes_deducao);
  let bas_deducao = soma_para_base_irrf;
  let baseIRRF;

  if (bas_deducao <= 607.20) {
    baseIRRF = irrf_trunc(salarioBruto - 607.20);
  }
  else {
    baseIRRF = irrf_trunc(salarioBruto - bas_deducao);
  }

  let base_de_calculo_irrf = baseIRRF;
  let aliquotaIRRF = 0;
  let deducaoIRRF = 0;
  let aliqirrf = 0;


  // isenção de irrf 
  if (base_de_calculo_irrf <= 2428.80) {
    aliqirrf = '%';
    deducaoIRRF = '0'
  } else if (base_de_calculo_irrf <= 2826.65) {
    aliqirrf = '7,5%';
    aliquotaIRRF = 0.075;
    deducaoIRRF = 182.16;  // Dedução para faixa de 2.112,01 até 2.826,65
  } else if (base_de_calculo_irrf <= 3751.05) {
    aliqirrf = '15%';
    aliquotaIRRF = 0.15;
    deducaoIRRF = 394.16;  // Dedução para faixa de 2.826,66 até 3.751,05
  } else if (base_de_calculo_irrf <= 4664.68) {
    aliqirrf = '22,5%';
    aliquotaIRRF = 0.225;
    deducaoIRRF = 675.49;  // Dedução para faixa de 3.751,06 até 4.664,68
  } else if (base_de_calculo_irrf >= 4664.69) {
    aliqirrf = '27,5%';
    aliquotaIRRF = 0.275;
    deducaoIRRF = 908.73;  // Dedução para faixa acima de 4.664,68
  }

  let result_irrf_inicial = irrf_trunc((base_de_calculo_irrf * (aliquotaIRRF * 100)) / 100) - deducaoIRRF;
  result_irrf_inicial = result_irrf_inicial >= 0 ? result_irrf_inicial : 0;

  // Lógica de Redução 2026
  let reducaoIRRF = 0;
  
  if (salarioBruto <= 5000) {
    reducaoIRRF = result_irrf_inicial; // Cobre todo o imposto
  } else if (salarioBruto <= 7350) {
    reducaoIRRF = 978.62 - (0.133145 * salarioBruto);
    reducaoIRRF = reducaoIRRF > 0 ? reducaoIRRF : 0;
    reducaoIRRF = Math.min(result_irrf_inicial, reducaoIRRF);
  }

  let result_irrf_final = irrf_trunc(result_irrf_inicial - reducaoIRRF);
  result_irrf_final = result_irrf_final >= 0 ? result_irrf_final : 0;

  let salarioLiquido = trunc(salarioBruto - inss_desc - result_irrf_final);

  return {
    salarioBruto,
    inss: inss_desc,
    irrf_inicial: result_irrf_inicial,
    reducao: irrf_trunc(reducaoIRRF),
    irrf_final: result_irrf_final,
    salarioLiquido
  };
}

// Executando Testes
console.log("=== TESTES DE CÁLCULO IRRF 2026 ===\n");

function runTest(salario, desc) {
    const res = calcularSimulado(salario);
    console.log(`Cenário: ${desc}`);
    console.log(`Salário Bruto: R$ ${res.salarioBruto.toFixed(2)}`);
    console.log(`INSS: R$ ${res.inss.toFixed(2)}`);
    console.log(`IRRF Calculado (sem redução): R$ ${res.irrf_inicial.toFixed(2)}`);
    console.log(`Redução aplicada: R$ ${res.reducao.toFixed(2)}`);
    console.log(`IRRF Final a Pagar: R$ ${res.irrf_final.toFixed(2)}`);
    console.log(`Salário Líquido: R$ ${res.salarioLiquido.toFixed(2)}`);
    console.log("--------------------------------------------------");
}

runTest(4500.00, "Salário abaixo de 5k (deve zerar IR)");
runTest(5000.00, "Salário exato de 5k (deve zerar IR)");
runTest(6000.00, "Salário de 6k (faixa de redução parcial)");
runTest(7350.00, "Salário de 7.350 (limite da redução parcial)");
runTest(8000.00, "Salário de 8k (sem redução)");
