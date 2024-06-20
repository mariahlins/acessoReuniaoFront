async function createEntity(entityType) {
  const formData = getFormData();
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`http://localhost:3000/${entityType}`, formData, {headers: { 'Authorization': `Bearer ${token}`}});
    if (response.status === 200) nextStep(`modalCadastrar${capitalizeFirstLetter(entityType)}`, 3);
  } catch (error) {
    console.error(`Erro ao criar ${entityType}:`, error);
    alert(`Erro ao criar ${entityType}. Por favor, tente novamente.`);
  }
}

// Função para obter dados do formulário
function getFormData(){
  const nome = document.getElementById('confirmNome').textContent;
  const sobrenome = document.getElementById('confirmSobrenome').textContent;
  const login = document.getElementById('confirmLogin').textContent;
  const senha = document.getElementById('hiddenSenha').value; // Use hidden input for senha
  const nivelAcesso = document.getElementById('confirmNivelAcesso').textContent === 'recepcionista' ? 1 : 2;

  return {
    nome,
    sobrenome,
    login,
    senha,
    nivelAcesso,
    ativo: true,
  };
}

// Função para preencher os dados na tela de confirmação
function fillConfirmation() {
  const nome = document.getElementById('nome').value;
  const sobrenome = document.getElementById('sobrenome').value;
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;
  const nivelAcesso = document.getElementById('nivelAcesso').options[document.getElementById('nivelAcesso').selectedIndex].text;

  document.getElementById('confirmNome').textContent = nome;
  document.getElementById('confirmSobrenome').textContent = sobrenome;
  document.getElementById('confirmLogin').textContent = login;
  document.getElementById('confirmNivelAcesso').textContent = nivelAcesso;
  document.getElementById('hiddenSenha').value = senha; // Store senha in hidden input
}

// Função para capitalizar a primeira letra de uma string
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Funções de controle do modal
$('.modal').on('show.bs.modal', function () {
  const modalId = this.id;
  resetModal(modalId);
});

$('.modal').on('hidden.bs.modal', function () {
  const modalId = this.id;
  resetModal(modalId);
});

function updateModalContent(modalId, step) {
  const currentStep = document.getElementById(modalId).querySelector('#step' + step);
  const newHeader = currentStep.getAttribute('data-header');
  document.getElementById(modalId).querySelector('.modal-title').textContent = newHeader;
}

function nextStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector('#step' + currentStep).classList.remove('active');
  modalElement.querySelector('#step' + (currentStep + 1)).classList.add('active');
  if (currentStep === 2) fillConfirmation();
  updateModalContent(modalId, currentStep + 1);
}

function prevStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector('#step' + currentStep).classList.remove('active');
  modalElement.querySelector('#step' + (currentStep - 1)).classList.add('active');
  updateModalContent(modalId, currentStep - 1);
}

function finish(modalId) {
  $('#' + modalId).modal('hide');
  resetModal(modalId);
  window.location.reload();
}

function selectButton(button, group) {
  const buttons = document.querySelectorAll(`.h5-item button`);
  buttons.forEach(btn => {
    if (btn !== button && btn.dataset.group === group) btn.classList.remove('btn-selected');
  });
  button.classList.add('btn-selected');
}

function resetModal(modalId) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelectorAll('.step').forEach((step) => step.classList.remove('active'));
  modalElement.querySelector('#step1').classList.add('active');
  updateModalContent(modalId, 1);
}

$('.modal-resetable').on('show.bs.modal', function () {
  resetModal(this.id);
});
