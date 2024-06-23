// Utilidades 
//Formatar para inputs (formatação em tempo real)
function formatCPF() {
  let cpf = cpfInput.value;
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  cpfInput.value = cpf;
}
function formatNumTel() {
  let numTel = numTelInput.value;
  numTel = numTel.replace(/\D/g, '');
  numTel = numTel.replace(/(\d{2})(\d)/, '($1) $2'); 
  numTel = numTel.replace(/(\d{5})(\d{4})/, '$1-$2');
  return numTelInput.value = numTel;
}

//Formatar para campos de textos
function converterNumTel(numTel){
  return numTel.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}

function converterCPF(cpf){
  return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
}

function converterData(dataEUA){
  const data = new Date(dataEUA);
  const dia=data.getDate().toString().padStart(2, '0');
  const mes=(data.getMonth() + 1).toString().padStart(2, '0'); 
  const ano=data.getFullYear();
  return `${dia}/${mes}/${ano}`;
}

function removerPontos(data){
  return data.replace(/\D/g, '');
}

function converterPrimeiraLetraMaiuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function converterAndar(andar) {
  switch (andar) {
      case 0: return 'Térreo';
      case 1: return 'Primeiro andar';
      case 2: return 'Segundo andar';
      case 3: return 'Terceiro andar';
      case 4: return 'Quarto andar';
      default: return 'informação invalida';
  }
}

function converterDateType(args) {
  let dataFormat = {};
  Object.keys(args).forEach(key => {
    dataFormat[key] = args[key];
  });
  return dataFormat;
}

//Formatar para campos de textos
//GETs
function getElementValueById(id) {
  return document.getElementById(id).value;
}

function getId(){
  return Number(localStorage.getItem('id'));
}
//GETs
//SETs
function setElementTextContentById(id, text) {
  document.getElementById(id).textContent = text;
}

function setElementInputValueById(id, value) {
  document.getElementById(id).value=value;
}
//SETs

// Gestão do modal
// Gestão do modal
function updateModalContent(modalId, step) {
  const currentStep = document.querySelector(`#${modalId} #step${step}`);
  if (!currentStep) return;
  const newHeader = currentStep.getAttribute('data-header');
  document.querySelector(`#${modalId} .modal-title`).textContent = newHeader;
}

function nextStep(modalId, currentStep){
  const modalElement = document.getElementById(modalId);
  const next=currentStep+1
  modalElement.querySelector(`#step${currentStep}`).classList.remove('active');
  modalElement.querySelector(`#step${next}`).classList.add('active');
  updateModalContent(modalId, next);
}

function prevStep(modalId, currentStep) {
  const prev=currentStep-1;
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector(`#step${currentStep}`).classList.remove('active');
  modalElement.querySelector(`#step${prev}`).classList.add('active');
  updateModalContent(modalId, prev);
}

function resetModal(modalId) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelectorAll('.step').forEach((step) => step.classList.remove('active'));
  modalElement.querySelector('#step1').classList.add('active');
  updateModalContent(modalId, 1);
}

function finish(modalId) {
  $(`#${modalId}`).modal('hide');
  resetModal(modalId);
  window.location.reload();
}

//Gestão de modal

// CRUD
async function creatEntity(entityType, stepAtual) {
  try {
    const entityData = getFormData(entityType);
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:3000/${entityType}`, entityData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const modalId = `modalCadastrar${converterPrimeiraLetraMaiuscula(entityType)}`;
    if (response.status === 200) {
      return nextStep(modalId, stepAtual);
    } else {
      throw new Error(`Erro ao criar ${entityType}. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Erro ao criar ${entityType}:`, error);
    alert(`Erro ao criar ${entityType}. Por favor, tente novamente.`);
  }
}

async function updateEntity(entityType, stepAtual) {
    const entityData = getFormData(entityType);
    console.log(entityData);
    try {
    const token = localStorage.getItem('token');
    let id=getId();
    if(entityType=='salaEdit') entityType='sala';
    else if(entityType==='recepcionistaEdit') entityType='recepcionista';
    const response = await axios.put(`http://localhost:3000/${entityType}/${id}`, entityData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const modalId = `modalEditar${converterPrimeiraLetraMaiuscula(entityType)}`;
    if (response.status === 200) {
      return nextStep(modalId, stepAtual); 
    } else {
      throw new Error(`Erro ao atualizar ${entityType}. Status: ${response.status}`);
    }
  } catch (error) {
    console.error(`Erro ao atualizar ${entityType}:`, error);
    alert(`Erro ao atualizar ${entityType}. Por favor, tente novamente.`);
  }
}

// Get - pegar os dados
function getFormData(entityType) {
  switch(entityType) {
    //Get span
    case 'sala':
      const nomeSala = document.getElementById('confirmNomeSala').textContent;
      const andar = Number(getElementValueById('andar'));
      const area = document.getElementById('confirmArea').textContent;
      const capMax = Number(getElementValueById('capMax'));
      return converterDateType({nomeSala, andar, area, capMax});
    
    case 'recepcionista':
      const nome = document.getElementById('confirmNome').textContent;
      const sobrenome = document.getElementById('confirmSobrenome').textContent;
      const login = document.getElementById('confirmLogin').textContent;
      const senha = document.getElementById('senha').value;
      const nivelAcesso = Number(document.getElementById('nivelAcesso').value);
      return converterDateType({nome, sobrenome, login, senha, nivelAcesso});
      
    case 'salaEdit':
      const nomeSalaEdit = document.getElementById('confirmNomeSalaEdit').textContent;
      const andarEdit = Number(getElementValueById('editAndar'));
      const areaEdit = document.getElementById('confirmAreaEdit').textContent;
      const capMaxEdit = Number(getElementValueById('editCapMax'));
      return converterDateType({nomeSalaEdit, andarEdit, areaEdit, capMaxEdit});

    case 'recepcionistaEdit':
      const nomeEdit = document.getElementById('confirmNomeEdit').textContent;
      const sobrenomeEdit = document.getElementById('confirmSobrenomeEdit').textContent;
      const loginEdit = document.getElementById('confirmLoginEdit').textContent;
      const nivelAcessoEdit = Number(document.getElementById('editNivelAcesso').value);
      return converterDateType({nomeEdit, sobrenomeEdit, loginEdit, nivelAcessoEdit});
    //get inputs
    case 'usuario':
      const cpf = removerPontos(document.getElementById('cpfWithCpf').value);
      const dataNascimento = document.getElementById('dataNascimentoWithCpf').value;
      return converterDateType({cpf, dataNascimento});
  }
}

// Confirmar - para Salas
function fillConfirmationSala(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeSala', converterPrimeiraLetraMaiuscula(getElementValueById('nomeSala')));
  setElementTextContentById('confirmAndar', converterAndar(Number(getElementValueById('andar'))));
  setElementTextContentById('confirmArea', converterPrimeiraLetraMaiuscula(getElementValueById('area')));
  setElementTextContentById('confirmCapMax', getElementValueById('capMax'));
}

// Confirmar - para Usuários
function fillConfirmationRecepcionista(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNome',converterPrimeiraLetraMaiuscula(getElementValueById('nome')));
  setElementTextContentById('confirmSobrenome', converterPrimeiraLetraMaiuscula(getElementValueById('sobrenome')));
  setElementTextContentById('confirmLogin', getElementValueById('login'));
  
  // Corrigindo a linha para obter o texto da opção selecionada
  const nivelAcessoElement = document.getElementById('nivelAcesso');
  setElementTextContentById('confirmNivelAcesso', converterPrimeiraLetraMaiuscula(nivelAcessoElement.options[nivelAcessoElement.selectedIndex].text));
}

//Trazer dados do banco para o modal de edição// modal.js
function fillConfirmationSalaEdit(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeSalaEdit',converterPrimeiraLetraMaiuscula(getElementValueById('editNomeSala')));
  setElementTextContentById('confirmAndarEdit',  converterAndar(Number(getElementValueById('editAndar'))));
  setElementTextContentById('confirmAreaEdit', getElementValueById('editArea'));
  setElementTextContentById('confirmCapMaxEdit', getElementValueById('editCapMax'));

}

function fillConfirmationRecepcionistaEdit(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeEdit',converterPrimeiraLetraMaiuscula(getElementValueById('editNome')));
  setElementTextContentById('confirmSobrenomeEdit', converterPrimeiraLetraMaiuscula(getElementValueById('editSobrenome')));
  setElementTextContentById('confirmLoginEdit', getElementValueById('editLogin'));
  
  // Corrigindo a linha para obter o texto da opção selecionada
  const nivelAcessoElement = document.getElementById('editNivelAcesso');
  setElementTextContentById('confirmNivelAcessoEdit', converterPrimeiraLetraMaiuscula(nivelAcessoElement.options[nivelAcessoElement.selectedIndex].text));
}

// Confirmar - para Usuários
function fillConfirmationUsuario(response, modalId, currentStep) {
  nextStep(modalId, currentStep);
  
  // Preenche os campos com os dados do usuário existente
  setElementTextContentById('confirmCPFWithCpf', response.identificador);
  setElementTextContentById('confirmDataNascimentoWithCpf', response.dataNascimento);
  setElementTextContentById('confirmNomeWithCpf', `${converterPrimeiraLetraMaiuscula(response.nome)} ${converterPrimeiraLetraMaiuscula(response.sobrenome)}`);
  
  // Atualiza campos editáveis se necessário
  setElementInputValueById('emailWithCpf', response.email);
  setElementInputValueById('telefoneWithCpf', converterNumTel(response.numTelefone));
}

async function criarUsuario(entityData, modalId, currentStep) {
  nextStep(modalId, currentStep);
  // Preenche os campos com os dados para criação de novo usuário
  setElementTextContentById('confirmCPFWithCpfCreat', converterCPF(entityData.cpf));
  setElementTextContentById('confirmDataNascimentoWithCpfCreat', converterData(entityData.dataNascimento));
}

// Consulta se o usuário existe e decide o fluxo
async function usuarioExiste(modalId, currentStep) {
  const entityData = getFormData('usuario'); 
  const token = localStorage.getItem('token');
  let response;
  
  try {
    const req = await axios.get(`http://localhost:3000/usuario/consulta/${entityData.cpf}/${entityData.dataNascimento}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    response = req.data;
  } catch (error) {
    console.error(`Erro ao consultar usuário ${modalId}:`, error);
  }
  
    const step2Content = `
    <p class="form-control mb-2 custom-input"><strong><span id="confirmCPFWithCpf"></span></strong></p>
    <p class="form-control mb-2 custom-input"><strong><span id="confirmDataNascimentoWithCpf"></span></strong></p>
    <p class="form-control mb-2 custom-input"><strong><span id="confirmNomeWithCpf"></span></strong></p>
    <input type="text" id="emailWithCpf" class="form-control mb-2 custom-input" placeholder="Email">
    <input type="text" id="telefoneWithCpf" class="form-control mb-2 custom-input" placeholder="Número de telefone">
    <input type="text" id="motivoDaReuniaoWithCpfNew" class="form-control mb-2 custom-input" placeholder="Motivo da Reunião">
    <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-outline-primary" onclick="prevStep('modalDeCoworking', 2)">Voltar</button>
        <button type="button" class="btn btn-secondary" onclick="nextStep('modalDeCoworking', 2)">Continuar</button>
    </div>`;

  const step3Content = `
    <p class="form-control mb-2 custom-input"><strong><span id="confirmCPFWithCpfCreat"></span></strong></p>
    <p class="form-control mb-2 custom-input"><strong><span id="confirmDataNascimentoWithCpfCreat"></span></strong></p>
    <input type="text" id="nomeWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Nome">
    <input type="text" id="sobrenomeWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Sobrenome">
    <input type="text" id="emailWithCpf" class="form-control mb-2 custom-input" placeholder="Email">
    <input type="text" id="telefoneWithCpf" class="form-control mb-2 custom-input" placeholder="Número de telefone">
    <input type="text" id="motivoDaReuniaoWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Motivo da Reunião">
    <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-outline-primary" onclick="prevStep('modalDeCoworking', 2)">Voltar</button>
        <button type="button" class="btn btn-secondary" onclick="nextStep('modalDeCoworking', 2)">Continuar</button>
    </div>`;
    
  if (response){
      document.getElementById('step2').innerHTML = step2Content;
  fillConfirmationUsuario(response, modalId, currentStep);
  }else{
    document.getElementById('step2').innerHTML = step3Content;
    criarUsuario(entityData, modalId, currentStep);
  }
}