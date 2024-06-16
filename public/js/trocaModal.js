$('.modal').on('show.bs.modal', function () {
  const modalId = this.id;
  resetModal(modalId);
});

function updateModalContent(step) {
  const currentStep = document.getElementById('step' + step);
  const newHeader = currentStep.getAttribute('data-header');
  document.getElementById('modalHeader').textContent = newHeader;
}

//função de avançar
function nextStep(currentStep) {
  document.getElementById('step' + currentStep).classList.remove('active');
  document.getElementById('step' + (currentStep + 1)).classList.add('active');
  updateModalContent(currentStep + 1);
}

// função de voltar
function prevStep(currentStep) {
  document.getElementById('step' + currentStep).classList.remove('active');
  document.getElementById('step' + (currentStep - 1)).classList.add('active');
  updateModalContent(currentStep - 1);
}

 // acaba o modal aqui
function finish() {
  $('#modalDeCoworking').modal('hide');
  resetModal();
}

function resetModal() {
  document.querySelectorAll('.step').forEach((step) => step.classList.remove('active'));
  document.getElementById('step1').classList.add('active');
  updateModalContent(1);
}

// começa os conteudos do modal
$('#modalDeCoworking').on('show.bs.modal', function () {
  resetModal();
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



// funções do dropdown de horas
