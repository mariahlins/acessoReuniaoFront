function updateModalContent(step) {
    const header = document.getElementById('modalHeader');
    const body = document.querySelector('.custom-modal-body');

    const currentStep = document.getElementById('step' + step);
    const newHeader = currentStep.getAttribute('data-header');
    const newBody = currentStep.getAttribute('data-body');

    header.innerText = newHeader;
      // Atualiza o conteúdo do body com o novo conteúdo
      // Como estamos utilizando inputs e outros elementos, aqui pode-se manter a estrutura
    }

    function nextStep(currentStep) {
      document.getElementById('step' + currentStep).classList.remove('active');
      document.getElementById('step' + (currentStep + 1)).classList.add('active');
      updateModalContent(currentStep + 1);
    }

    function prevStep(currentStep) {
      document.getElementById('step' + currentStep).classList.remove('active');
      document.getElementById('step' + (currentStep - 1)).classList.add('active');
      updateModalContent(currentStep - 1);
    }

    function finish() {
      $('#exampleModalCenter').modal('hide');
    }

    // Inicializa o conteúdo do modal com os dados da primeira etapa ao abrir o modal
    $('#exampleModalCenter').on('show.bs.modal', function () {
      updateModalContent(1);
    });