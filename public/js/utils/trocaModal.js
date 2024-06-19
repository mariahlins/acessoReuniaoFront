$('.modal').on('show.bs.modal', function () {
  const modalId = this.id;
  resetModal(modalId);
});

$('.modal').on('hidden.bs.modal', function () {
  const modalId = this.id;
  resetModal(modalId);
});

// atualiza o conteudo e o cabecalho
function updateModalContent(modalId, step) {
  const currentStep = document.getElementById(modalId).querySelector('#step' + step);
  const newHeader = currentStep.getAttribute('data-header');
  document.getElementById(modalId).querySelector('.modal-title').textContent = newHeader;
}

// continuar
function nextStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector('#step' + currentStep).classList.remove('active');
  modalElement.querySelector('#step' + (currentStep + 1)).classList.add('active');
  updateModalContent(modalId, currentStep + 1);
}

// voltar
function prevStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelector('#step' + currentStep).classList.remove('active');
  modalElement.querySelector('#step' + (currentStep - 1)).classList.add('active');
  updateModalContent(modalId, currentStep - 1);
}

// finaliza e recomeça
function finish(modalId) {
  $('#' + modalId).modal('hide');
  resetModal(modalId);
}

// teoricamente reseta ne
function resetModal(modalId) {
  const modalElement = document.getElementById(modalId);
  modalElement.querySelectorAll('.step').forEach((step) => step.classList.remove('active'));
  modalElement.querySelector('#step1').classList.add('active');
  updateModalContent(modalId, 1);
}

// teoricamente reseta/2
$('#modalDeCoworking').on('show.bs.modal', function () {
  resetModal('modalDeCoworking');
});

$('#modalDeEmpresas').on('show.bs.modal', function () {
  resetModal('modalDeEmpresas');
});

$('#modalDeCadastrarSala').on('show.bs.modal', function () {
  resetModal('modalDeCadastrarSala');
});


$('#modalCadastrarRecepcionista').on('show.bs.modal', function () {
  resetModal('modalCadastrarRecepcionista');
});
//botoes
function selectButton(button, group) {
  const buttons = document.querySelectorAll(`.h5-item button`);
  buttons.forEach(btn => {
    if (btn !== button && btn.dataset.group === group) {
      btn.classList.remove('btn-selected');
    }
  });
  button.classList.add('btn-selected');
}