// Utilidades 
function capitalizeFirstLetter(string) {
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

function getElementValueById(id) {
  return document.getElementById(id).value;
}
function getId(){
  return Number(localStorage.getItem('id'));
}
function setElementTextContentById(id, text) {
  document.getElementById(id).textContent = text;
}

function setElementInputValueById(id, value) {
  document.getElementById(id).value=value;
}

// Função Sala
function createSala(nome, andar, area, capacidadeMaxima) {
  return {
    nome: nome,
    andar: andar,
    area: area,
    capMax:capacidadeMaxima
  };
}

// Função Recepcionista
function createRecepcionista(nome, sobrenome, login, nivelAcesso) {
  return {
    nome: nome,
    sobrenome: sobrenome,
    login: login,
    nivelAcesso: nivelAcesso
  };
}

// Gestão do modal
function updateModalContent(modalId, step) {
  const currentStep = document.querySelector(`#${modalId} #step${step}`);
  if (!currentStep) return;
  const newHeader = currentStep.getAttribute('data-header');
  document.querySelector(`#${modalId} .modal-title`).textContent = newHeader;

}

function nextStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector(`#step${currentStep}`).classList.remove('active');
  modalElement.querySelector(`#step${currentStep + 1}`).classList.add('active');
  updateModalContent(modalId, currentStep + 1);
}

function prevStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector(`#step${currentStep}`).classList.remove('active');
  modalElement.querySelector(`#step${currentStep - 1}`).classList.add('active');
  updateModalContent(modalId, currentStep - 1);
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

// CRUD
async function createEntity(entityType, stepAtual) {
  try {
    const entityData = getFormData(entityType);
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:3000/${entityType}`, entityData, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const modalId = `modalCadastrar${capitalizeFirstLetter(entityType)}`;
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

async function updateEntity(entityType,stepAtual) {
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

    console.log(response.status);

    const modalId = `modalEditar${capitalizeFirstLetter(entityType)}`;
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
    case 'sala':
      const nomeSala = document.getElementById('confirmNomeSala').textContent;
      const andar = Number(getElementValueById('andar'));
      const area = document.getElementById('confirmArea').textContent;
      const capMax = Number(getElementValueById('capMax'));
      return createSala(nomeSala, andar, area, capMax);
    
    case 'recepcionista':
      const nome = document.getElementById('confirmNome').textContent;
      const sobrenome = document.getElementById('confirmSobrenome').textContent;
      const login = document.getElementById('confirmLogin').textContent;
      const senha = document.getElementById('senha').value;
      const nivelAcesso = Number(document.getElementById('nivelAcesso').value);
      return createRecepcionista(nome, sobrenome, login, senha, nivelAcesso);
      
    case 'salaEdit':
      const nomeSalaEdit = document.getElementById('confirmNomeSalaEdit').textContent;
      const andarEdit = Number(getElementValueById('editAndar'));
      const areaEdit = document.getElementById('confirmAreaEdit').textContent;
      const capMaxEdit = Number(getElementValueById('editCapMax'));
      return createSala(nomeSalaEdit, andarEdit, areaEdit, capMaxEdit);

    case 'recepcionistaEdit':
      const nomeEdit = document.getElementById('confirmNomeEdit').textContent;
      const sobrenomeEdit = document.getElementById('confirmSobrenomeEdit').textContent;
      const loginEdit = document.getElementById('confirmLoginEdit').textContent;
      const nivelAcessoEdit = Number(document.getElementById('editNivelAcesso').value);
      return createRecepcionista(nomeEdit, sobrenomeEdit, loginEdit, nivelAcessoEdit);
  }
}

// Confirmar - para Salas
function fillConfirmationSala(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeSala', getElementValueById('nomeSala'));
  setElementTextContentById('confirmAndar', converterAndar(Number(getElementValueById('andar'))));
  setElementTextContentById('confirmArea', getElementValueById('area'));
  setElementTextContentById('confirmCapMax', getElementValueById('capMax'));
}

// Confirmar - para Usuários
function fillConfirmationRecepcionista(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNome',capitalizeFirstLetter(getElementValueById('nome')));
  setElementTextContentById('confirmSobrenome', capitalizeFirstLetter(getElementValueById('sobrenome')));
  setElementTextContentById('confirmLogin', getElementValueById('login'));
  
  // Corrigindo a linha para obter o texto da opção selecionada
  const nivelAcessoElement = document.getElementById('nivelAcesso');
  const selectedOptionText = nivelAcessoElement.options[nivelAcessoElement.selectedIndex].text;
  setElementTextContentById('confirmNivelAcesso', capitalizeFirstLetter(selectedOptionText));
}

//Trazer dados do banco para o modal de edição// modal.js
function fillConfirmationSalaEdit(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeSalaEdit',capitalizeFirstLetter(getElementValueById('editNomeSala')));
  setElementTextContentById('confirmAndarEdit',  converterAndar(Number(getElementValueById('editAndar'))));
  setElementTextContentById('confirmAreaEdit', getElementValueById('editArea'));
  setElementTextContentById('confirmCapMaxEdit', getElementValueById('editCapMax'));

}

function fillConfirmationRecepcionistaEdit(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeEdit',capitalizeFirstLetter(getElementValueById('editNome')));
  setElementTextContentById('confirmSobrenomeEdit', capitalizeFirstLetter(getElementValueById('editSobrenome')));
  setElementTextContentById('confirmLoginEdit', getElementValueById('editLogin'));
  
  // Corrigindo a linha para obter o texto da opção selecionada
  const nivelAcessoElement = document.getElementById('editNivelAcesso');
  const selectedOptionText = nivelAcessoElement.options[nivelAcessoElement.selectedIndex].text;
  setElementTextContentById('confirmNivelAcessoEdit', capitalizeFirstLetter(selectedOptionText));
}