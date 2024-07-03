// Utilidades 
//Formatar para inputs (formatação em tempo real)
function formatCPF(event) {
  let cpf = event.target.value;
  cpf = cpf.replace(/\D/g, '');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d)/, '$1.$2');
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  event.target.value = cpf;
}

function formatNumTel(event) {
  let numTel = event.target.value;
  numTel = numTel.replace(/\D/g, '');
  numTel = numTel.replace(/(\d{2})(\d)/, '($1) $2');
  numTel = numTel.replace(/(\d{5})(\d{4})/, '$1-$2');
  event.target.value = numTel;
}

//Formatar para campos de textos
function converterNumTel(numTel) {
  return numTel.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
}

function converterCPF(cpf) {
  return cpf.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})$/, '$1.$2.$3-$4');
}

function converterData(dataEUA) {
  const data = dataEUA.split('-');
  return `${data[2]}/${data[1]}/${data[0]}`;
}

function converterDataEUA(dataBR) {
  const data = dataBR.split('/');
  return `${data[2]}-${data[1]}-${data[0]}`;
}

function removerPontos(data) {
  return data.replace(/\D/g, '');
}

function adicionarHora(time, tempoReserva) {
  const [hour, minute] = time.split(':').map(Number);
  let novaHora = hour + Number(tempoReserva);

  if (novaHora >= 23) novaHora -= 24;
  return `${novaHora.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
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

/*Como nem todos os campos que tem na reserva eu tenho em editar e vice e versa, eu preciso validar se o campo existe
e se ele existe eu armazeno no localStorage
*/
function obtemDadosValidos(campos) {
  return Object.entries(campos).reduce((acc, [key, value]) => {
    if (value) {
      acc[key] = value;
    }
    return acc;
  }, {});
}

function armazenaDadosLocalStorage(campos) {
  Object.entries(campos).forEach(([key, value]) => {
    if (value) {
      localStorage.setItem(key, value);
    }
  });
}


//Formatar para campos de textos
//GETs
function getElementValueById(id) {
  return document.getElementById(id).value;
}

function getId() {
  return Number(localStorage.getItem('id'));
}
//GETs

//SETs
function setElementTextContentById(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  } else {
    console.error(`Elemento com ID ${id} não encontrado.`);
  }
}

function setElementInputValueById(id, value) {
  document.getElementById(id).value = value;
}
//SETs

function updateModalContent(modalId, step) {
  const currentStep = document.querySelector(`#${modalId} #step${step}`);
  if (!currentStep) return;
  const newHeader = currentStep.getAttribute('data-header');
  document.querySelector(`#${modalId} .modal-title`).textContent = newHeader;
}

function nextStep(modalId, currentStep) {
  const modalElement = document.getElementById(modalId);
  const next = currentStep + 1
  modalElement.querySelector(`#step${currentStep}`).classList.remove('active');
  modalElement.querySelector(`#step${next}`).classList.add('active');
  updateModalContent(modalId, next);
}

function prevStep(modalId, currentStep) {
  const prev = currentStep - 1;
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
  let responseStatus = 200;
  let responseData = {};

  try {
    if (entityType === 'sala') {
      const { observacao, ...entityDataSala } = entityData;
      const req1 = await axios.post(`http://localhost:3000/${entityType}`, entityDataSala, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (req1.status !== 200) responseStatus = req1.status;
      const idSala = req1.data.id;
      const estadoSalaData = { idSala, observacao };
      const req2 = await axios.post(`http://localhost:3000/estadoSala`, estadoSalaData, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (req2.status !== 200) responseStatus = req2.status;
      responseData = { req1: req1.data, req2: req2.data };
    } else {
      let req;
      if(entityType === 'reservaEmpresa'){
         req= await axios.post(`http://localhost:3000/reserva`, entityData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }else{
         req = await axios.post(`http://localhost:3000/${entityType}`, entityData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });  
      }
      if (req.status !== 200) responseStatus = req.status;
      responseData = req.data;
    }
  } catch (error) {
    handleCreateEntityError(error, entityType);
  }

  let modalId = `modalCadastrar${converterPrimeiraLetraMaiuscula(entityType)}`;
  if (entityType === 'reserva' || entityType === 'usuario') {
    modalId = 'modalDeCoworking';
    if (entityType === 'usuario') {
      localStorage.setItem('id', responseData.id);
      localStorage.setItem('cpf', responseData.identificador);
      localStorage.setItem('dataNascimento', responseData.dataNascimento);
      localStorage.setItem('nome', `${responseData.nome} ${responseData.sobrenome}`);
      localStorage.setItem('email', responseData.email);
      localStorage.setItem('numTelefone', responseData.numTelefone);
    }else{
      localStorage.removeItem('motivoDaReuniao');
      localStorage.removeItem('idReserva');
    }
  }else if(entityType === 'reservaEmpresa'){
    localStorage.removeItem('motivoDaReuniao');
    localStorage.removeItem('idReservaCNPJ');
    modalId = 'modalDeEmpresas';
  } 
  console.log('modalId', modalId)
  if (responseStatus === 200) {
    return nextStep(modalId, stepAtual);
  } else {
    alert(`Erro ao criar ${entityType}. Por favor, tente novamente.`);
  }
}

async function updateEntity(entityType, stepAtual) {
  try {
    const entityData = getFormData(entityType);
    const token = localStorage.getItem('token');
    const id = getId();
    const modalId = getModalId(entityType);
    const response = await sendUpdateRequest(entityType, id, entityData, token);
    return handleResponse(response, modalId, stepAtual);
  } catch (error) {
    console.error(`Erro ao atualizar ${entityType}:`, error);
    alert(`Erro ao atualizar ${entityType}. Por favor, tente novamente.`);
  }
}

function getModalId(entityType) {
  const modalEditarUsuario = document.getElementById('modalEditarUsuario');
  switch (entityType) {
    case 'salaEdit':
      return 'modalEditarSala';
    case 'recepcionistaEdit':
      return 'modalEditarRecepcionista';
    case 'usuarioEdit':
      return modalEditarUsuario ? 'modalEditarUsuario' : 'modalDeCoworking';
    case 'onlyUsuarioEdit':
    case 'reserva':
      return `modalEditar${converterPrimeiraLetraMaiuscula(entityType)}`;
    default:
      return `modalEditar${converterPrimeiraLetraMaiuscula(entityType)}`;
  }
}

async function sendUpdateRequest(entityType, id, entityData, token, modalId) {
  const entityTypeMap = {
    'salaEdit': 'sala',
    'recepcionistaEdit': 'recepcionista',
    'usuarioEdit': 'usuario',
    'onlyUsuarioEdit': 'usuario',
    'reserva': 'reserva',
    'reservaEmpresa': 'reserva'
  };

  const finalEntityType = entityTypeMap[entityType] || entityType;
  const url = `http://localhost:3000/${finalEntityType}/${id}`;

  return await axios.put(url, entityData, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
}

function handleResponse(response, modalId, stepAtual) {
  if (response.status === 200) {
    return nextStep(modalId, stepAtual);
  } else {
    throw new Error(`Erro ao atualizar. Status: ${response.status}`);
  }
}

function converterPrimeiraLetraMaiuscula(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


function handleCreateEntityError(error, entityType) {
  if (error.response) {
    if (error.response.status === 409) alert(`Erro ao criar ${entityType}. Já existe um registro com esses dados.`);
    else alert(`Erro ao criar ${entityType}. Por favor, tente novamente. Status: ${error.response.status}`);
  } else {
    alert(`Erro ao criar ${entityType}. Por favor, verifique sua conexão e tente novamente.`);
  }
}

// Get - pegar os dados
function getFormData(entityType) {
  switch (entityType) {
    // Get span
    case 'sala':
      var nome = document.getElementById('confirmNomeSala').textContent;
      var andar = Number(getElementValueById('andar'));
      var area = document.getElementById('confirmArea').textContent;
      var capMax = Number(getElementValueById('capMax'));
      var observacao = document.getElementById('confirmEstadoSala').textContent;
      return converterDateType({ nome, andar, area, capMax, observacao });

    case 'recepcionista':
      var nome = document.getElementById('confirmNome').textContent;
      var sobrenome = document.getElementById('confirmSobrenome').textContent;
      var login = document.getElementById('confirmLogin').textContent;
      var senha = document.getElementById('senha').value;
      var nivelAcesso = Number(document.getElementById('nivelAcesso').value);
      return converterDateType({ nome, sobrenome, login, senha, nivelAcesso });

    case 'salaEdit':
      var nome = document.getElementById('confirmNomeSalaEdit').textContent;
      var andar = Number(getElementValueById('editAndar'));
      var area = document.getElementById('confirmAreaEdit').textContent;
      var capMax = Number(getElementValueById('editCapMax'));
      return converterDateType({ nome, andar, area, capMax });

    case 'recepcionistaEdit':
      var nome = document.getElementById('confirmNomeEdit').textContent;
      var sobrenome = document.getElementById('confirmSobrenomeEdit').textContent;
      var login = document.getElementById('confirmLoginEdit').textContent;
      var nivelAcesso = Number(document.getElementById('editNivelAcesso').value);
      return converterDateType({ nome, sobrenome, login, nivelAcesso });

    // Get inputs
    //Chamado na primeira tela do modal
    case 'usuarioVerifica':
      var cpf = removerPontos(document.getElementById('cpfWithCpf').value);
      var dataNascimento = document.getElementById('dataNascimentoWithCpf').value;
      return converterDateType({ cpf, dataNascimento });

    case 'usuarioCNPJVerifica':
      var cpf = removerPontos(document.getElementById('cpfWithCNPJ').value);
      var dataNascimento = document.getElementById('dataNascimentoWithCNPJ').value;
      return converterDateType({ cpf, dataNascimento });

    case 'usuarioEdit':
      var identificador = removerPontos(document.getElementById('confirmCPFWithCpf')?.innerText);
      var dataNascimento = converterDataEUA(document.getElementById('confirmDataNascimentoWithCpf')?.innerText);
      var nome = document.getElementById('nomeWithCpf')?.value;
      var sobrenome = document.getElementById('sobrenomeWithCpf')?.value;
      var email = document.getElementById('emailWithCpf')?.value;
      var numTelefone = document.getElementById('telefoneWithCpf')?.value;
      var motivoReserva = document.getElementById('motivoDaReuniaoWithCpf')?.value;
      
      localStorage.setItem('motivoDaReuniao', motivoReserva);
      
      const campos = {
        cpf: identificador,
        dataNascimento,
        nome,
        sobrenome,
        email,
        numTelefone: numTelefone ? removerPontos(numTelefone) : null,
      };

      const dadosValidos = obtemDadosValidos(campos);
      armazenaDadosLocalStorage(dadosValidos);
      return converterDateType(dadosValidos);

    case 'onlyUsuarioEdit':
      var identificador = document.getElementById('confirmCPFWithCpf').innerText;
      var dataNascimento = converterDataEUA(document.getElementById('confirmDataNascimentoWithCpf').innerText);
      var nome = document.getElementById('nomeWithCpf').innerText;
      var email = document.getElementById('emailWithCpf').value;
      var numTelefone = document.getElementById('telefoneWithCpf').value;
      var motivoReserva = document.getElementById('motivoDaReuniaoWithCpf').value;
      
    case 'usuario':
      var identificador = removerPontos(document.getElementById('confirmCPFWithCpf').innerText);
      var dataNascimento = converterDataEUA(document.getElementById('confirmDataNascimentoWithCpf').innerText);
      var nome = document.getElementById('nomeWithCpf').value;
      var sobrenome = document.getElementById('sobrenomeWithCpf').value;
      var email = document.getElementById('emailWithCpf').value;
      var numTelefone = removerPontos(document.getElementById('telefoneWithCpf').value);
      var motivoReserva = document.getElementById('motivoDaReuniaoWithCpf').value;
      localStorage.setItem('cpf', identificador);
      localStorage.setItem('dataNascimento', dataNascimento);
      localStorage.setItem('nome', `${nome} ${sobrenome}`);
      localStorage.setItem('email', email);
      localStorage.setItem('numTelefone', numTelefone);
      localStorage.setItem('motivoDaReuniao', motivoReserva);
      return converterDateType({ identificador, dataNascimento, nome, sobrenome, email, numTelefone });

    case 'reserva':
      var idRecepcionista = Number(localStorage.getItem('idRecepcionista'));
      var idUsuario = Number(localStorage.getItem('id'));
      var idSala = Number(localStorage.getItem('idReserva'));
      var motivoReserva = localStorage.getItem('motivoDaReuniao');
      var dataReservada = converterDataEUA(document.getElementById('dataConfirmSpan').innerText);
      var horaInicio = document.getElementById('horarioConfirmSpan').innerText;
      return converterDateType({ idRecepcionista, idUsuario, idSala, motivoReserva, dataReservada, horaInicio });

    case 'reservaEmpresa':
      var idRecepcionista = Number(localStorage.getItem('idRecepcionista'));
      var idUsuario = Number(localStorage.getItem('id'));
      var idSala = Number(localStorage.getItem('idReservaCNPJ'));
      var motivoReserva = localStorage.getItem('motivoDaReuniao') || 'não informado';
      var dataReservada = converterDataEUA(document.getElementById('dataConfirmSpanCNPJ').innerText);
      var horaInicio = document.getElementById('horarioConfirmSpanCNPJ').innerText;
      var horarioSaida = document.getElementById('horarioSaidaConfirmSpanCNPJ').innerText;
      return converterDateType({idRecepcionista, idUsuario, idSala, motivoReserva, dataReservada, horaInicio, horarioSaida });

  }
}

// Confirmar - para Salas
function fillConfirmationSala(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeSala', converterPrimeiraLetraMaiuscula(getElementValueById('nomeSala')));
  setElementTextContentById('confirmAndar', converterAndar(Number(getElementValueById('andar'))));
  setElementTextContentById('confirmArea', converterPrimeiraLetraMaiuscula(getElementValueById('area')));
  setElementTextContentById('confirmCapMax', getElementValueById('capMax'));
  setElementTextContentById('confirmEstadoSala', converterPrimeiraLetraMaiuscula(getElementValueById('estadoSala')));
}

// Confirmar - para Usuários
function fillConfirmationRecepcionista(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNome', converterPrimeiraLetraMaiuscula(getElementValueById('nome')));
  setElementTextContentById('confirmSobrenome', converterPrimeiraLetraMaiuscula(getElementValueById('sobrenome')));
  setElementTextContentById('confirmLogin', getElementValueById('login'));

  // Corrigindo a linha para obter o texto da opção selecionada
  const nivelAcessoElement = document.getElementById('nivelAcesso');
  setElementTextContentById('confirmNivelAcesso', converterPrimeiraLetraMaiuscula(nivelAcessoElement.options[nivelAcessoElement.selectedIndex].text));
}

//Trazer dados do banco para o modal de edição// modal.js
function fillConfirmationSalaEdit(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmNomeSalaEdit', converterPrimeiraLetraMaiuscula(getElementValueById('editNomeSala')));
  setElementTextContentById('confirmAndarEdit', converterAndar(Number(getElementValueById('editAndar'))));
  setElementTextContentById('confirmAreaEdit', getElementValueById('editArea'));
  setElementTextContentById('confirmCapMaxEdit', getElementValueById('editCapMax'));

}

function fillConfirmationUsuarioEditUnique(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('confirmCPFWithCpfConfirm', document.getElementById('confirmCPFWithCpf').innerText);
  setElementTextContentById('confirmDataNascimentoWithCpfConfirm', document.getElementById('confirmDataNascimentoWithCpf').innerText);
  setElementTextContentById('confirmNomeWithCpfConfirm', `${converterPrimeiraLetraMaiuscula(getElementValueById('nomeWithCpf'))} ${converterPrimeiraLetraMaiuscula(getElementValueById('sobrenomeWithCpf'))}`);
  setElementTextContentById('confirmEmailWithCpfConfirm', getElementValueById('emailWithCpf'));
  setElementTextContentById('confirmTelefoneWithCpfConfirm', converterNumTel(getElementValueById('telefoneWithCpf')));

}
function fillConfirmationReserva(modalId, currentStep) {
  nextStep(modalId, currentStep);
  setElementTextContentById('cpfUserConfirmReserva', localStorage.getItem('cpf'));
  setElementTextContentById('aniversarioConfirmResrva', formatarDataBr(localStorage.getItem('dataNascimento')));
  setElementTextContentById('nomeConfirmSpan', localStorage.getItem('nome'));
  setElementTextContentById('emailConfirmSpan', localStorage.getItem('email'));
  setElementTextContentById('numTelConfirmSpan', localStorage.getItem('numTelefone'));
  setElementTextContentById('salaConfirmSpan', localStorage.getItem('nomeSala'));
  setElementTextContentById('dataConfirmSpan', formatarDataBr(localStorage.getItem('diaEscolhido')));
  setElementTextContentById('horarioConfirmSpan', getElementValueById('selecao-horario-modal'));
  setElementTextContentById('horarioSaidaConfirmSpan', adicionarHora(getElementValueById('selecao-horario-modal'), 3));
  setElementTextContentById('motivoReservaSpan',  localStorage.getItem('motivoDaReuniao'));
}

function fillConfirmationReservaCNPJ(modalId, currentStep) {
  nextStep(modalId, currentStep);

  setElementTextContentById('cpfUserConfirmReservaCNPJ', localStorage.getItem('cpf'));
  setElementTextContentById('aniversarioConfirmResrvaCNPJ', formatarDataBr(localStorage.getItem('dataNascimento')));
  setElementTextContentById('nomeConfirmSpanCNPJ', localStorage.getItem('nome'));
  setElementTextContentById('emailConfirmSpanCNPJ', localStorage.getItem('email'));
  setElementTextContentById('numTelConfirmSpanCNPJ', localStorage.getItem('numTelefone'));

  setElementTextContentById('salaConfirmSpanCNPJ', localStorage.getItem('nomeSala'));
  setElementTextContentById('dataConfirmSpanCNPJ', formatarDataBr(localStorage.getItem('diaEscolhido')));
  setElementTextContentById('horarioConfirmSpanCNPJ', getElementValueById('horariosDropdown'));
  setElementTextContentById('horarioSaidaConfirmSpanCNPJ', adicionarHora(getElementValueById('horariosDropdown'), getElementValueById('duracaoReserva')));
  setElementTextContentById('motivoReservaSpanCNPJ', localStorage.getItem('motivoDaReuniao') ? localStorage.getItem('motivoDaReuniao') : 'não informado');

}

function fillConfirmationRecepcionistaEdit(modalId, currentStep) {
  nextStep(modalId, currentStep);
  setElementTextContentById('confirmNomeEdit', converterPrimeiraLetraMaiuscula(getElementValueById('editNome')));
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
  setElementTextContentById('nomeWithCpf', `${converterPrimeiraLetraMaiuscula(response.nome)} ${converterPrimeiraLetraMaiuscula(response.sobrenome)}`);

  // Atualiza campos editáveis se necessário
  setElementInputValueById('emailWithCpf', response.email);
  setElementInputValueById('telefoneWithCpf', converterNumTel(response.numTelefone));
  localStorage.setItem('id', response.id)
}

async function criarUsuario(entityData, modalId, currentStep) {
  nextStep(modalId, currentStep);
  // Preenche os campos com os dados para criação de novo usuário
  setElementTextContentById('confirmCPFWithCpf', converterCPF(entityData.cpf));
  setElementTextContentById('confirmDataNascimentoWithCpf', converterData(entityData.dataNascimento));
}
function pegarDadosUsuario(modal) {
  switch (modal) {
    case 'modalDeEmpresas':
      return getFormData('usuarioCNPJVerifica');
    case 'modalDeCoworking':
      return getFormData('usuarioVerifica');
    default:
      console.error('Modal ID desconhecido:', modal);
  }
}
async function exibirStep2() {
  return `
    <p class="form-control mb-2 custom-input bg-secondary-subtle"><strong><span id="confirmCPFWithCpf"></span></strong></p>
    <p class="form-control mb-2 custom-input bg-secondary-subtle"><strong><span id="confirmDataNascimentoWithCpf"></span></strong></p>
    <p class="form-control mb-2 custom-input bg-secondary-subtle"><strong><span id="nomeWithCpf"></span></strong></p>
    <input type="text" id="emailWithCpf" class="form-control mb-2 custom-input" placeholder="Email" required>
    <input type="text" id="telefoneWithCpf" class="form-control mb-2 custom-input" placeholder="Número de telefone" minlength="12" maxlength="14" required>
    <input type="text" id="motivoDaReuniaoWithCpf" class="form-control mb-2 custom-input" placeholder="Motivo da Reunião" required> 
    <div class="d-flex justify-content-between">
      <button type="button" class="btn btn-outline-primary" onclick="prevStep('modalDeCoworking', 2)">Voltar</button>
      <button type="button" class="btn btn-secondary" onclick="updateEntity('usuarioEdit', 2)">Continuar</button>
    </div>`;
}

async function exibirStep3() {
  return `
    <p class="form-control mb-2 custom-input"><strong><span id="confirmCPFWithCpf"></span></strong></p>
    <p class="form-control mb-2 custom-input"><strong><span id="confirmDataNascimentoWithCpf"></span></strong></p>
    <input type="text" id="nomeWithCpf" class="form-control mb-2 custom-input" placeholder="Nome">
    <input type="text" id="sobrenomeWithCpf" class="form-control mb-2 custom-input" placeholder="Sobrenome">
    <input type="text" id="emailWithCpf" class="form-control mb-2 custom-input" placeholder="Email" required>
    <input type="text" id="telefoneWithCpf" class="form-control mb-2 custom-input" placeholder="Número de telefone" minlength="12" maxlength="14" required>
    <input type="text" id="motivoDaReuniaoWithCpf" class="form-control mb-2 custom-input" placeholder="Motivo da Reunião" required>
    <div class="d-flex justify-content-between">
      <button type="button" class="btn btn-outline-primary" onclick="prevStep('modalDeCoworking', 2)">Voltar</button>
      <button type="button" class="btn btn-secondary" onclick="createEntity('usuario', 2)">Continuar</button>
    </div>`;
}

async function obterEntityData(modalId) {
  try {
    switch (modalId) {
      case 'modalDeEmpresas':
        return getFormData('usuarioCNPJVerifica');
      case 'modalDeCoworking':
        return getFormData('usuarioVerifica');
      default:
        throw new Error('Modal ID desconhecido');
    }
  } catch (error) {
    console.error('Erro ao obter dados da entidade:', error);
  }
}

async function consultarUsuario(entityData) {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`http://localhost:3000/usuario/consulta/${entityData.cpf}/${entityData.dataNascimento}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return response;
  } catch (error) {
    throw error;
  }
}

async function usuarioExiste(modalId, currentStep) {
  const conteinerStep = document.getElementById('step2');
  const entityData = await obterEntityData(modalId);
  try {
    const response = await consultarUsuario(entityData);
    if (modalId === 'modalDeCoworking') {
      conteinerStep.innerHTML = await exibirStep2();
      const telefoneInput = document.getElementById('telefoneWithCpf');
      if (telefoneInput) telefoneInput.addEventListener('input', formatNumTel);
      fillConfirmationUsuario(response.data, modalId, currentStep);
    } else if (modalId === 'modalDeEmpresas') {
      if (response.status === 200) {
        nextStep(modalId, currentStep);
      } else {
        alert('Usuário não tem acesso');
      }
    }
  } catch (error) {
    if (error.response && error.response.status === 404 && modalId === 'modalDeCoworking') {
      conteinerStep.innerHTML = await exibirStep3();
      await criarUsuario(entityData, modalId, currentStep);
      const telefoneInput = document.getElementById('telefoneWithCpf');
      if (telefoneInput) telefoneInput.addEventListener('input', formatNumTel);
    } else {
      const errorMessage = error.response?.data?.message || 'Erro ao buscar usuário. Por favor, tente novamente mais tarde.';
      alert(errorMessage);
    }
  }
}

