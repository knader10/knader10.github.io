function truncarParaDuasCasasDecimais(valor) {
  return Math.floor(valor * 100) / 100;
}

function calculateSalarioLiquido() {
  // Pegar os valores dos inputs
  var salarioBruto = parseFloat(document.getElementById('salario_bruto').value.replace(',', '.'));

  // Calcular o INSS
  var inss = 0;

  //primeira faixa 7,%
  if (salarioBruto <= 1320) { 
      inss = salarioBruto * 0.075;
  }

  //segunda faixa 9% 
  else if (salarioBruto <= 2571.29) {
      inss = (1320 * 0.075) + truncarParaDuasCasasDecimais((salarioBruto - 1320.01) * 0.09);
  }
      
  //terceira faixa 12%
  else if (salarioBruto <= 3856.94) {
      inss = (1320 * 0.075) + truncarParaDuasCasasDecimais((2571.29 - 1320.01) * 0.09) + truncarParaDuasCasasDecimais((salarioBruto - 2571.30) * 0.12);
  }

  //quarta faixa 14%
  else if (salarioBruto <= 7507.49) {
      inss = (1320 * 0.075) + truncarParaDuasCasasDecimais((2571.29 - 1320.01) * 0.09) + truncarParaDuasCasasDecimais((3856.94 - 2571.30) * 0.12) + truncarParaDuasCasasDecimais((salarioBruto - 3856.95) * 0.14);
  }

  //acima do teto
  else {
      inss = 876.95; // Valor fixo para salários acima de 7507.49
  }

  // Calcular o salário líquido
  var salarioLiquido = salarioBruto - inss;

  // Atualizar os elementos na tabela
  document.getElementById('previdencia_desconto').textContent = inss.toFixed(2);
  document.getElementById('aliquota_previdencia').textContent = (inss / salarioBruto * 100).toFixed(2) + '%';
  document.getElementById('salario_liquido').textContent = salarioLiquido.toFixed(2);
}
