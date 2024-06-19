$('.modal').on('show.bs.modal', function () {
  const modalId = this.id;
  resetModal(modalId);
});

$('.modal').on('hidden.bs.modal', function () {
  const modalId = this.id;
  resetModal(modalId);
});

// Atualiza o conteúdo e o cabeçalho
function updateModalContent(modalId, step) {
  const currentStep = document.getElementById(modalId).querySelector('#step' + step);
  const newHeader = currentStep.getAttribute('data-header');
  document.getElementById(modalId).querySelector('.modal-title').textContent = newHeader;
}

// Continuar
function nextStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector('#step' + currentStep).classList.remove('active');
  modalElement.querySelector('#step' + (currentStep + 1)).classList.add('active');
  if (currentStep === 2) fillConfirmation(modalId);
  updateModalContent(modalId, currentStep + 1);
}

// Voltar
function prevStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector('#step' + currentStep).classList.remove('active');
  modalElement.querySelector('#step' + (currentStep - 1)).classList.add('active');
  updateModalContent(modalId, currentStep - 1);
}

// Finaliza e recomeça
function finish(modalId) {
  $('#' + modalId).modal('hide');
  window.location.reload();
  resetModal(modalId);
}

// Teoricamente reseta
function resetModal(modalId) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelectorAll('.step').forEach((step) => step.classList.remove('active'));
  modalElement.querySelector('#step1').classList.add('active');
  updateModalContent(modalId, 1);
}

// Preenche os dados na tela de confirmação
function fillConfirmation(modalId) {
  const nome = document.getElementById('nome').value;
  const sobrenome = document.getElementById('sobrenome').value;
  const login = document.getElementById('login').value;
  const nivelAcesso = document.getElementById('nivelAcesso').options[document.getElementById('nivelAcesso').selectedIndex].text;
  document.getElementById('confirmNome').textContent = nome;
  document.getElementById('confirmSobrenome').textContent = sobrenome;
  document.getElementById('confirmLogin').textContent = login;
  document.getElementById('confirmNivelAcesso').textContent = nivelAcesso;
}
function submitForm(modalId, formData) {
  nextStep(modalId, 3);
}

// Exemplo de uso para o modalCadastrarRecepcionista
function submitCadastrarRecepcionistaForm() {
  const nome = document.getElementById('nome').value;
  const sobrenome = document.getElementById('sobrenome').value;
  const login = document.getElementById('login').value;
  const senha = document.getElementById('senha').value;
  const nivelAcesso = document.getElementById('nivelAcesso').value;

  const formData = {
    nome,
    sobrenome,
    login,
    senha,
    nivelAcesso
  };

  submitForm('modalCadastrarRecepcionista', formData);
}

// Teoricamente reseta/2
$('.modal-resetable').on('show.bs.modal', function () {
  resetModal(this.id);
});

function resetModal(modalId) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelectorAll('.step').forEach((step) => step.classList.remove('active'));
  modalElement.querySelector('#step1').classList.add('active');
  updateModalContent(modalId, 1);
}


// Botões
function selectButton(button, group) {
  const buttons = document.querySelectorAll(`.h5-item button`);
  buttons.forEach(btn => {
    if (btn !== button && btn.dataset.group === group) btn.classList.remove('btn-selected');
  });
  button.classList.add('btn-selected');
}