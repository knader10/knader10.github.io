function truncarParaDuasCasasDecimais(valor) {
  return Math.floor(valor * 100) / 100;
}

function calculateSalarioLiquido() {
  // Pegar os valores dos inputs
  var salarioBruto = parseFloat(document.getElementById('salario_bruto').value.replace(',', '.'));

  // Verificar se o campo de entrada está vazio
  if (isNaN(salarioBruto)) {
    alert("O Vitória é Colossal. Mas insira um valor para efetuar o cálculo.");
    return; // Sai da função se não houver um valor válido
  }

  // Calcular o INSS
  var inss = 0;
  var aliquota_previdencia = '';

  //primeira faixa 7%
  if (salarioBruto <= 1320) {  
    inss = salarioBruto * 0.075;
    aliquota_previdencia = '7,5%';
  }
  //segunda faixa 9% 
  else if (salarioBruto <= 2571.29) {
    inss = (1320 * 0.075) + truncarParaDuasCasasDecimais((salarioBruto - 1320.01) * 0.09);
    aliquota_previdencia = '9%';
  }
  //terceira faixa 12%
  else if (salarioBruto <= 3856.94) {
    inss = (1320 * 0.075) + truncarParaDuasCasasDecimais((2571.29 - 1320.01) * 0.09) + truncarParaDuasCasasDecimais((salarioBruto - 2571.30) * 0.12);
    aliquota_previdencia = '12%';
  }
  //quarta faixa 14%
  else if (salarioBruto <= 7507.49) {
    inss = (1320 * 0.075) + truncarParaDuasCasasDecimais((2571.29 - 1320.01) * 0.09) + truncarParaDuasCasasDecimais((3856.94 - 2571.30) * 0.12) + truncarParaDuasCasasDecimais((salarioBruto - 3856.95) * 0.14);
    aliquota_previdencia = '14%';
  }
  //acima do teto
  else {
    inss = 876.95; // Valor fixo para salários acima de 7507.49
    aliquota_previdencia = '14%';
  }

  // Calcular o salário líquido
  var salarioLiquido = salarioBruto - inss;

  // formatação para separar ponto e vírgula
  var salarioFormatado = salarioLiquido.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  var salarioFormatado2 = inss.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  // Atualizar os elementos na tabela
  document.getElementById('previdencia_desconto').textContent = inss.toFixed(2);
  document.getElementById('aliquota_previdencia').textContent = aliquota_previdencia;
  document.getElementById('salario_liquido').textContent = salarioLiquido.toFixed(2);
  document.getElementById('previdencia_desconto').textContent = salarioFormatado2;
  document.getElementById('salario_liquido').textContent = salarioFormatado;
}

function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault(); // Impede o envio do formulário padrão
    calculateSalarioLiquido(); // Chama a função de cálculo quando a tecla 'Enter' for pressionada
  }
}

function limparFormulario() {
  document.getElementById('salario_bruto').value = '';
  document.getElementById('previdencia_desconto').textContent = '0,00';
  document.getElementById('aliquota_previdencia').textContent = '%';
  document.getElementById('salario_liquido').textContent = '0,00'; 
}
