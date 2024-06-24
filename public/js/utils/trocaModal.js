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
  const data = dataEUA.split('-');
  return `${data[2]}/${data[1]}/${data[0]}`;
}

function converterDataEUA(dataBR){
  const data = dataBR.split('/');
  return `${data[2]}-${data[1]}-${data[0]}`;
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
async function createEntity(entityType, stepAtual) {
  const entityData = getFormData(entityType);
  const token = localStorage.getItem('token');
  let response;
  try {
    const req = await axios.post(`http://localhost:3000/${entityType}`, entityData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    response=req;
  } catch (error) {
    handleCreateEntityError(error, entityType);
  }

    let modalId = `modalCadastrar${converterPrimeiraLetraMaiuscula(entityType)}`;
    if (entityType === 'usuario') modalId = 'modalDeCoworking';

    if (response.status === 200) return nextStep(modalId, stepAtual);
    else throw new Error(`Erro ao criar ${entityType}. Status: ${response.status}`);
}

function handleCreateEntityError(error, entityType) {
  if(error.response){
    if (error.response.status === 409) alert(error.response.data.message);
    else alert(`Erro ao criar ${entityType}. Por favor, tente novamente. Status: ${error.response.status}`);
  }else{
    alert(`Erro ao criar ${entityType}. Por favor, verifique sua conexão e tente novamente.`);
  }
}


async function updateEntity(entityType, stepAtual) {
    const entityData = getFormData(entityType);
    const token = localStorage.getItem('token');
    let id=getId();
    if(entityType=='salaEdit') entityType='sala';
    else if(entityType==='recepcionistaEdit') entityType='recepcionista';
    else if(entityType==='usuarioEdit') entityType='usuario';
    let response;
    try {
      const req = await axios.put(`http://localhost:3000/${entityType}/${id}`, entityData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      response=req;
    } catch (error) {
      console.error(`Erro ao atualizar ${entityType}:`, error);
      alert(`Erro ao atualizar ${entityType}. Por favor, tente novamente.`);
    }
    let modalId = `modalEditar${converterPrimeiraLetraMaiuscula(entityType)}`;
    if(entityType==='usuario') modalId='modalDeCoworking';
    if (response.status===200){
      return nextStep(modalId, stepAtual);
    }  
    else throw new Error(`Erro ao atualizar ${entityType}. Status: ${response.status}`);
}

// Get - pegar os dados
function getFormData(entityType) {
  switch(entityType) {
    // Get span
    case 'sala':
      var nome = document.getElementById('confirmNomeSala').textContent;
      var andar = Number(getElementValueById('andar'));
      var area = document.getElementById('confirmArea').textContent;
      var capMax = Number(getElementValueById('capMax'));
      return converterDateType({nome, andar, area, capMax});

    case 'recepcionista':
      var nome = document.getElementById('confirmNome').textContent;
      var sobrenome = document.getElementById('confirmSobrenome').textContent;
      var login = document.getElementById('confirmLogin').textContent;
      var senha = document.getElementById('senha').value;
      var nivelAcesso = Number(document.getElementById('nivelAcesso').value);
      return converterDateType({nome, sobrenome, login, senha, nivelAcesso});

    case 'salaEdit':
      var nome = document.getElementById('confirmNomeSalaEdit').textContent;
      var andar = Number(getElementValueById('editAndar'));
      var area = document.getElementById('confirmAreaEdit').textContent;
      var capMax = Number(getElementValueById('editCapMax'));
      return converterDateType({nome, andar, area, capMax});

    case 'recepcionistaEdit':
      var nome = document.getElementById('confirmNomeEdit').textContent;
      var sobrenome = document.getElementById('confirmSobrenomeEdit').textContent;
      var login = document.getElementById('confirmLoginEdit').textContent;
      var nivelAcesso = Number(document.getElementById('editNivelAcesso').value);
      return converterDateType({nome, sobrenome, login, nivelAcesso});

    // Get inputs
    case 'usuarioVerifica':
      var cpf = removerPontos(document.getElementById('cpfWithCpf').value);
      var dataNascimento = document.getElementById('dataNascimentoWithCpf').value;
      return converterDateType({cpf, dataNascimento});

    case 'usuarioEdit':
      var email = document.getElementById('emailWithCpf').value;
      var numTelefone = removerPontos(document.getElementById('telefoneWithCpf').value);
      return converterDateType({email, numTelefone});

    case 'usuario':
      var identificador = removerPontos(document.getElementById('confirmCPFWithCpfCreat').innerText);
      var dataNascimento = converterDataEUA(document.getElementById('confirmDataNascimentoWithCpfCreat').innerText);
      var nome = document.getElementById('nomeWithCpfCreat').value;
      var sobrenome = document.getElementById('sobrenomeWithCpfCreat').value;
      var email = document.getElementById('emailWithCpfCreat').value;
      var numTelefone = document.getElementById('telefoneWithCpfCreat').value;
      var motivoDaReuniao = document.getElementById('motivoDaReuniaoWithCpfCreat').value;
      return converterDateType({identificador, dataNascimento, nome, sobrenome, email, numTelefone, motivoDaReuniao});
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
  setElementTextContentById('confirmCPFWithCpf', converterCPF(response.identificador));
  setElementTextContentById('confirmDataNascimentoWithCpf', converterData(response.dataNascimento));
  setElementTextContentById('confirmNomeWithCpf', `${converterPrimeiraLetraMaiuscula(response.nome)} ${converterPrimeiraLetraMaiuscula(response.sobrenome)}`);
  
  // Atualiza campos editáveis se necessário
  setElementInputValueById('emailWithCpf', response.email);
  setElementInputValueById('telefoneWithCpf', converterNumTel(response.numTelefone));
  localStorage.setItem('id', response.id)
}

async function criarUsuario(entityData, modalId, currentStep) {
  nextStep(modalId, currentStep);
  // Preenche os campos com os dados para criação de novo usuário
  setElementTextContentById('confirmCPFWithCpfCreat', converterCPF(entityData.cpf));
  setElementTextContentById('confirmDataNascimentoWithCpfCreat', converterData(entityData.dataNascimento));
}

// Consulta se o usuário existe e decide o fluxo
async function usuarioExiste(modalId, currentStep) {
  const entityData = getFormData('usuarioVerifica'); 
  const token = localStorage.getItem('token');

  const step2Content = `
    <p class="form-control mb-2 custom-input"><strong><span id="confirmCPFWithCpf"></span></strong></p>
    <p class="form-control mb-2 custom-input"><strong><span id="confirmDataNascimentoWithCpf"></span></strong></p>
    <p class="form-control mb-2 custom-input"><strong><span id="confirmNomeWithCpf"></span></strong></p>
    <input type="text" id="emailWithCpf" class="form-control mb-2 custom-input" placeholder="Email" required>
    <input type="text" id="telefoneWithCpf" class="form-control mb-2 custom-input" placeholder="Número de telefone" required>
    <input type="text" id="motivoDaReuniaoWithCpfNew" class="form-control mb-2 custom-input" placeholder="Motivo da Reunião" required> 
    <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-outline-primary" onclick="prevStep('modalDeCoworking', 2)">Voltar</button>
        <button type="button" class="btn btn-secondary" onclick="updateEntity('usuarioEdit', 2)">Continuar</button>
    </div>`;

  const step3Content = `
    <p class="form-control mb-2 custom-input"><strong><span id="confirmCPFWithCpfCreat"></span></strong></p>
    <p class="form-control mb-2 custom-input"><strong><span id="confirmDataNascimentoWithCpfCreat"></span></strong></p>
    <input type="text" id="nomeWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Nome">
    <input type="text" id="sobrenomeWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Sobrenome">
    <input type="text" id="emailWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Email" required>
    <input type="text" id="telefoneWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Número de telefone" required>
    <input type="text" id="motivoDaReuniaoWithCpfCreat" class="form-control mb-2 custom-input" placeholder="Motivo da Reunião" required>
    <div class="d-flex justify-content-between">
        <button type="button" class="btn btn-outline-primary" onclick="prevStep('modalDeCoworking', 2)">Voltar</button>
        <button type="button" class="btn btn-secondary" onclick="createEntity('usuario', 2)">Continuar</button>
    </div>`;

  try {
    const response = await axios.get(`http://localhost:3000/usuario/consulta/${entityData.cpf}/${entityData.dataNascimento}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    document.getElementById('step2').innerHTML = step2Content;
    fillConfirmationUsuario(response.data, modalId, currentStep);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      document.getElementById('step2').innerHTML = step3Content;
      criarUsuario(entityData, modalId, currentStep);
    } else {
      const errorMessage = error.response && error.response.data && error.response.data.message 
                          ? error.response.data.message 
                          : 'Erro ao buscar usuário. Por favor, tente novamente mais tarde.';
      alert(errorMessage);
    }
  }
}