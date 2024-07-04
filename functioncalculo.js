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

function calculateSalarioLiquido() {
  console.log(document.getElementById('salario_bruto').value);
  let salarioBrutoStr = document.getElementById('salario_bruto').value;
  salarioBrutoStr = salarioBrutoStr.replace(/\./g, '').replace(',', '.');
  let salarioBruto = parseFloat(salarioBrutoStr);

  console.log(salarioBruto); 

  
  // Verificar se o campo de entrada está vazio
  if (isNaN(salarioBruto)) {
    alert("Insira um valor para efetuar o cálculo.");
    return; // Sai da função se não houver um valor válido
  }

  // Calcular o INSS
 let inss = 0;
 let aliquota_previdencia = '';

 //primeira faixa 7%
 if (salarioBruto <= 1412) {  
   inss = trunc(salarioBruto * 0.075);
   aliquota_previdencia = '7,5%';
 }
 //segunda faixa 9% 
 else if (salarioBruto <= 2666.68) {
   inss = trunc(1412 * 0.075) + trunc((salarioBruto - 1412.01) * 0.09);
   aliquota_previdencia = '9%';
 }
 //terceira faixa 12%
 else if (salarioBruto <= 4000.03) {
   inss = trunc(1412 * 0.075) + trunc((2666.68 - 1412.01) * 0.09) + trunc((salarioBruto - 2666.69) * 0.12);
   aliquota_previdencia = '12%';
 }
 //quarta faixa 14%
 else if (salarioBruto <= 7786.02) {
   inss = trunc(1412 * 0.075) + trunc((2666.68 - 1412.01) * 0.09) + trunc((4000.03 - 2666.69) * 0.12) + trunc((salarioBruto - 4000.04) * 0.14);
   aliquota_previdencia = '14%';
 }
 //acima do teto
 else {
   inss = 908.85; // Valor fixo para salários acima de 7786.02
   aliquota_previdencia = '14%';
 }
 
  let inss_desc = trunc(inss);

// calcular irrf

  let dependentes = parseInt(document.getElementById("qtdedependentes").value);
  let dependentes_deducao = 0;
  if (dependentes > 0) {
    dependentes_deducao = irrf_trunc(dependentes * 189.59);
  }
 
 
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
 if (base_de_calculo_irrf <= 2112.00) {
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
 


 // Calcular o salário
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
 //document.getElementById('base_calculo').textContent = base_de_calculo_irrf;
}




function handleKeyPress(event) {

if (event.keyCode === 13) {
  event.preventDefault(); 
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