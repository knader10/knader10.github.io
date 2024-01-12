function trunc(valor) {
  const multiplicadoPor1000 = Math.round(valor * 1000);
  const terceiraCasaDecimal = multiplicadoPor1000 % 10; 

  if (terceiraCasaDecimal === 9) {
    return (Math.floor(multiplicadoPor1000 / 10) + 1) / 100; // Arredonda a segunda casa decimal para cima
  }

  return Math.floor(multiplicadoPor1000 / 10) / 100; // Mantém a segunda casa decimal inalterada
}

function irrf_trunc(valor) {
  const multiplicadoPor100 = Math.floor(valor * 100); // Multiplica por 100 e arredonda para baixo
  return multiplicadoPor100 / 100; // Divide por 100 para obter o valor truncado
}




// aqui começa o cálculo


function calculateSalarioLiquido() {
  // Pegar os valores dos inputs
  let salarioBruto = parseFloat(document.getElementById('salario_bruto').value.replace(',', '.'));

  
  // Verificar se o campo de entrada está vazio
  if (isNaN(salarioBruto)) {
    alert("Insira um valor para efetuar o cálculo.");
    return; // Sai da função se não houver um valor válido
  }


  // Calcular o INSS
 let inss = 0;
 let aliquota_previdencia = '';

 //primeira faixa 7%
 if (salarioBruto <= 1320) {  
   inss = trunc(salarioBruto * 0.075);
   aliquota_previdencia = '7,5%';
 }
 //segunda faixa 9% 
 else if (salarioBruto <= 2571.29) {
   inss = trunc(1320 * 0.075) + trunc((salarioBruto - 1320.01) * 0.09);
   aliquota_previdencia = '9%';
 }
 //terceira faixa 12%
 else if (salarioBruto <= 3856.94) {
   inss = trunc(1320 * 0.075) + trunc((2571.29 - 1320.01) * 0.09) + trunc((salarioBruto - 2571.30) * 0.12);
   aliquota_previdencia = '12%';
 }
 //quarta faixa 14%
 else if (salarioBruto <= 7507.49) {
   inss = trunc(1320 * 0.075) + trunc((2571.29 - 1320.01) * 0.09) + trunc((3856.94 - 2571.30) * 0.12) + trunc((salarioBruto - 3856.95) * 0.14);
   aliquota_previdencia = '14%';
 }
 //acima do teto
 else {
   inss = 876.95; // Valor fixo para salários acima de 7507.49
   aliquota_previdencia = '14%';
 }
 
  let inss_desc = trunc(inss);


 // Calcular o IRRF
 let dependentes = parseInt(document.getElementById("qtdedependentes").value);
 let dependentes_deducao = 0;
 if (dependentes > 0) {
   dependentes_deducao = irrf_trunc(dependentes * 189.59);
 }

 let soma_para_base_irrf = irrf_trunc(inss_desc + dependentes_deducao);
 let baseIRRF = irrf_trunc(salarioBruto - soma_para_base_irrf);
 let aliquotaIRRF = 0;
 let deducaoIRRF = 0;
 let aliqirrf = 0;
   // Atualizar o valor da label no HTML
   let base_irrf_span = document.getElementById('base_irrf_span');
   base_irrf_span.textContent = baseIRRF.toFixed(2); // Atualizar com o valor calculado

   let salarioFormatado4 = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(baseIRRF);
  

// isenção de irrf 
 if (baseIRRF <= 2112.00) {
   aliqirrf = '%';
   deducaoIRRF = '0'
 } else if (baseIRRF <= 2826.65) {
   aliqirrf = '7,5%';
   aliquotaIRRF = 0.075;
   deducaoIRRF = 158.40;  // Dedução para faixa de 2.112,01 até 2.826,65
 } else if (baseIRRF <= 3751.05) { 
   aliqirrf = '15%';
   aliquotaIRRF = 0.15;
   deducaoIRRF = 370.40;  // Dedução para faixa de 2.826,66 até 3.751,05
 } else if (baseIRRF <= 4664.68) {
   aliqirrf = '22,5%';
   aliquotaIRRF = 0.225;
   deducaoIRRF = 651.73;  // Dedução para faixa de 3.751,06 até 4.664,68
 } else if ((baseIRRF >= 4664.68)){ 
   aliqirrf = '27,5%';
   aliquotaIRRF = 0.275;
   deducaoIRRF = 884.96;  // Dedução para faixa acima de 4.664,68
 }

    let result_irrf_legal = irrf_trunc((baseIRRF * (aliquotaIRRF * 100)) / 100) - deducaoIRRF;

    // aqui faz o cálculo do mais vantajoso 
      // se o valor do método antigo for maior que método 2, vai o método 2
        // senão vai o método antigo


     // Calcular o salário líquido
    let salarioLiquido = trunc(salarioBruto - (result_irrf + inss_desc));
    




    let salarioFormatado = salarioLiquido.toLocaleString('pt-BR', {
     style: 'currency',
     currency: 'BRL',
   });
 
   let salarioFormatado2 = inss.toLocaleString('pt-BR', {
     style: 'currency',
     currency: 'BRL',
   });
   let salarioFormatado3 = result_irrf.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });




   // Atualizar os elementos na tabela
   document.getElementById('previdencia_desconto').textContent = inss.toFixed(2);
   document.getElementById('aliquota_previdencia').textContent = aliquota_previdencia;
   document.getElementById('salario_liquido').textContent = salarioLiquido.toFixed(2);
   document.getElementById('previdencia_desconto').textContent = salarioFormatado2;
   document.getElementById('salario_liquido').textContent = salarioFormatado;
   document.getElementById('irrf_desc').textContent = result_irrf.toFixed(2);
   document.getElementById('irrf_desc').textContent = salarioFormatado3;
   document.getElementById('aliquota_irrf').textContent = aliqirrf;
   document.getElementById('base_irrf_span').textContent = salarioFormatado4;
   base_irrf_span.textContent = salarioFormatado4;
  }




function handleKeyPress(event) {
  if (event.keyCode === 13) {
    event.preventDefault(); // Impede o envio do formulário padrão
    calculateSalarioLiquido(); // Chama a função de cálculo quando a tecla 'Enter' for pressionada
  }
}


function limparFormulario() {
  document.getElementById('salario_bruto').value = '';
  document.getElementById('qtdedependentes').value = '';
  document.getElementById('previdencia_desconto').textContent = '0,00';
  document.getElementById('aliquota_previdencia').textContent = '%';
  document.getElementById('salario_liquido').textContent = '0,00';
  document.getElementById('irrf_desc').textContent = '0,00';
  document.getElementById('aliquota_irrf').textContent = '%';
  document.getElementById('base_irrf_span').textContent = '';
}
