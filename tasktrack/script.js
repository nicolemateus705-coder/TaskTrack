
const botaoNovaTarefa = document.getElementById("nova-tarefa");
const formulario = document.getElementById("form-tarefa");
const listaTarefas = document.getElementById("lista-tarefas");

// Pesquisa, filtros e ordenação
const campoPesquisa = document.getElementById("pesquisa");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroStatus = document.getElementById("filtro-status");
const filtroPrioridade = document.getElementById("filtro-prioridade");
const botaoLimparFiltros = document.getElementById("limpar-filtros");
const campoOrdenacao = document.getElementById("ordenacao");

// Recupera os registros salvos
const tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];

let indiceEmEdicao = null;

const nomesStatus = {
    pendente: "Pendente",
    andamento: "Em andamento",
    concluida: "Concluída"
};

// Formata datas para o padrão brasileiro
function formatarData(data) {
    if (!data) {
        return "Data de criação não registrada";
    }

    const dataConvertida = new Date(data);

    if (Number.isNaN(dataConvertida.getTime())) {
        return "Data inválida";
    }

    return dataConvertida.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

// Abre ou fecha o formulário
botaoNovaTarefa.addEventListener("click", function () {
    if (formulario.hidden) {
        indiceEmEdicao = null;
        formulario.reset();
        formulario.hidden = false;
    } else {
        formulario.hidden = true;
        indiceEmEdicao = null;
    }
});

// Cadastra ou atualiza registros
formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const titulo = document.getElementById("titulo").value.trim();
    const descricao = document.getElementById("descricao").value.trim();
    const prioridade = document.getElementById("prioridade").value;
    const status = document.getElementById("status").value;
    const tipo = document.getElementById("tipo").value;

    if (titulo === "") {
        alert("Digite um título para o registro.");
        return;
    }

    const agora = new Date().toISOString();

    const tarefa = {
        titulo: titulo,
        descricao: descricao,
        prioridade: prioridade,
        status: status,
        tipo: tipo,
        criadoEm: agora,
        atualizadoEm: null
    };

    if (indiceEmEdicao === null) {
        tarefas.push(tarefa);
    } else {
        const tarefaAnterior = tarefas[indiceEmEdicao];

        tarefa.criadoEm = tarefaAnterior.criadoEm || null;
        tarefa.atualizadoEm = agora;

        tarefas[indiceEmEdicao] = tarefa;
    }

    salvarTarefas();
    mostrarTarefas();

    indiceEmEdicao = null;
    formulario.reset();
    formulario.hidden = true;
});

// Eventos de pesquisa, filtros e ordenação
campoPesquisa.addEventListener("input", mostrarTarefas);
filtroTipo.addEventListener("change", mostrarTarefas);
filtroStatus.addEventListener("change", mostrarTarefas);
filtroPrioridade.addEventListener("change", mostrarTarefas);
campoOrdenacao.addEventListener("change", mostrarTarefas);

// Limpa filtros e restaura a ordenação padrão
botaoLimparFiltros.addEventListener("click", function () {
    campoPesquisa.value = "";
    filtroTipo.value = "todos";
    filtroStatus.value = "todos";
    filtroPrioridade.value = "todos";
    campoOrdenacao.value = "recentes";

    mostrarTarefas();
});

// Atualiza o dashboard
function atualizarDashboard() {
    const total = tarefas.length;

    const totalTarefas = tarefas.filter(function (tarefa) {
        return (tarefa.tipo || "tarefa") === "tarefa";
    }).length;

    const totalBugs = tarefas.filter(function (tarefa) {
        return tarefa.tipo === "bug";
    }).length;

    const pendentes = tarefas.filter(function (tarefa) {
        return (tarefa.status || "pendente") === "pendente";
    }).length;

    const andamento = tarefas.filter(function (tarefa) {
        return tarefa.status === "andamento";
    }).length;

    const concluidos = tarefas.filter(function (tarefa) {
        return tarefa.status === "concluida";
    }).length;

    document.getElementById("total-registros").textContent = total;
    document.getElementById("total-tarefas").textContent = totalTarefas;
    document.getElementById("total-bugs").textContent = totalBugs;
    document.getElementById("total-pendentes").textContent = pendentes;
    document.getElementById("total-andamento").textContent = andamento;
    document.getElementById("total-concluidos").textContent = concluidos;
}

// Organiza os registros sem alterar o array original
function ordenarRegistros(registros) {
    const ordenacao = campoOrdenacao.value;

    const pesosPrioridade = {
        alta: 3,
        media: 2,
        baixa: 1
    };

    registros.sort(function (a, b) {
        const tarefaA = a.tarefa;
        const tarefaB = b.tarefa;

        if (ordenacao === "prioridade-alta") {
            return (
                (pesosPrioridade[tarefaB.prioridade] || 0) -
                (pesosPrioridade[tarefaA.prioridade] || 0)
            );
        }

        if (ordenacao === "prioridade-baixa") {
            return (
                (pesosPrioridade[tarefaA.prioridade] || 0) -
                (pesosPrioridade[tarefaB.prioridade] || 0)
            );
        }

        const dataA = tarefaA.criadoEm
            ? new Date(tarefaA.criadoEm).getTime()
            : 0;

        const dataB = tarefaB.criadoEm
            ? new Date(tarefaB.criadoEm).getTime()
            : 0;

        const tempoA = Number.isFinite(dataA) ? dataA : 0;
        const tempoB = Number.isFinite(dataB) ? dataB : 0;

        if (ordenacao === "antigos") {
            return tempoA - tempoB;
        }

        return tempoB - tempoA;
    });

    return registros;
}

// Altera o status diretamente no cartão
function alterarStatus(indice, novoStatus) {
    if (!Object.hasOwn(nomesStatus, novoStatus)) {
        return;
    }

    const tarefa = tarefas[indice];

    if (!tarefa || (tarefa.status || "pendente") === novoStatus) {
        return;
    }

    tarefa.status = novoStatus;
    tarefa.atualizadoEm = new Date().toISOString();

    salvarTarefas();
    mostrarTarefas();
}

// Exibe os registros
function mostrarTarefas() {
    listaTarefas.innerHTML = "";

    atualizarDashboard();

    const textoPesquisa = campoPesquisa.value
        .trim()
        .toLowerCase();

    const tipoSelecionado = filtroTipo.value;
    const statusSelecionado = filtroStatus.value;
    const prioridadeSelecionada = filtroPrioridade.value;

    // Mantém o índice original para edição e exclusão
    const registros = tarefas.map(function (tarefa, indice) {
        return {
            tarefa: tarefa,
            indiceOriginal: indice
        };
    });

    const registrosFiltrados = registros.filter(function (registro) {
        const tarefa = registro.tarefa;
        const tipoAtual = tarefa.tipo || "tarefa";
        const statusAtual = tarefa.status || "pendente";

        const correspondePesquisa =
            tarefa.titulo.toLowerCase().includes(textoPesquisa) ||
            (tarefa.descricao || "")
                .toLowerCase()
                .includes(textoPesquisa);

        const correspondeTipo =
            tipoSelecionado === "todos" ||
            tipoAtual === tipoSelecionado;

        const correspondeStatus =
            statusSelecionado === "todos" ||
            statusAtual === statusSelecionado;

        const correspondePrioridade =
            prioridadeSelecionada === "todos" ||
            tarefa.prioridade === prioridadeSelecionada;

        return (
            correspondePesquisa &&
            correspondeTipo &&
            correspondeStatus &&
            correspondePrioridade
        );
    });

    ordenarRegistros(registrosFiltrados);

    registrosFiltrados.forEach(function (registro) {
        const tarefa = registro.tarefa;
        const indice = registro.indiceOriginal;

        const tipoAtual = tarefa.tipo || "tarefa";
        const statusAtual = tarefa.status || "pendente";

        const cartao = document.createElement("div");
        cartao.classList.add("cartao-tarefa");

        // Título
        const titulo = document.createElement("h3");
        titulo.textContent = tarefa.titulo;

        // Descrição
        const descricao = document.createElement("p");
        descricao.textContent = tarefa.descricao || "";

        // Datas
        const datas = document.createElement("div");
        datas.classList.add("datas-tarefa");

        const dataCriacao = document.createElement("span");
        dataCriacao.textContent = tarefa.criadoEm
            ? "Criado em: " + formatarData(tarefa.criadoEm)
            : "Data de criação não registrada";

        datas.appendChild(dataCriacao);

        if (tarefa.atualizadoEm) {
            const dataAtualizacao = document.createElement("span");

            dataAtualizacao.textContent =
                "Atualizado em: " + formatarData(tarefa.atualizadoEm);

            datas.appendChild(dataAtualizacao);
        }

        // Etiqueta de tipo
        const tipo = document.createElement("span");
        tipo.textContent = tipoAtual === "bug" ? "Bug" : "Tarefa";
        tipo.classList.add("etiqueta-tipo", tipoAtual);

        // Etiqueta de prioridade
        const prioridade = document.createElement("span");
        const prioridadeAtual = tarefa.prioridade || "baixa";

        prioridade.textContent =
            prioridadeAtual.charAt(0).toUpperCase() +
            prioridadeAtual.slice(1);

        prioridade.classList.add(
            "etiqueta-prioridade",
            prioridadeAtual
        );

        // Etiqueta de status
        const status = document.createElement("span");
        status.textContent = nomesStatus[statusAtual] || "Pendente";
        status.classList.add("etiqueta-status", statusAtual);

        // Seletor para alterar status rapidamente
        const areaStatus = document.createElement("div");
        areaStatus.classList.add("area-status-rapido");

        const labelStatus = document.createElement("label");
        labelStatus.textContent = "Alterar status:";

        const seletorStatus = document.createElement("select");
        seletorStatus.classList.add("seletor-status");

        // Identificador único para associar o label ao seletor
        seletorStatus.id = "status-registro-" + indice;
        labelStatus.htmlFor = seletorStatus.id;

        Object.entries(nomesStatus).forEach(function (entrada) {
            const valor = entrada[0];
            const nome = entrada[1];

            const opcao = document.createElement("option");
            opcao.value = valor;
            opcao.textContent = nome;

            seletorStatus.appendChild(opcao);
        });

        seletorStatus.value = statusAtual;

        seletorStatus.addEventListener("change", function () {
            alterarStatus(indice, seletorStatus.value);
        });

        areaStatus.append(labelStatus, seletorStatus);

        // Botão Editar
        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.classList.add("botao-editar");

        botaoEditar.addEventListener("click", function () {
            editarTarefa(indice);
        });

        // Botão Excluir
        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.classList.add("botao-excluir");

        botaoExcluir.addEventListener("click", function () {
            excluirTarefa(indice);
        });

        // Conteúdo do cartão
        const conteudo = document.createElement("div");
        conteudo.classList.add("conteudo-tarefa");
        conteudo.append(titulo, descricao, datas);

        // Etiquetas
        const etiquetas = document.createElement("div");
        etiquetas.classList.add("etiquetas-tarefa");
        etiquetas.append(tipo, prioridade, status);

        // Ações
        const acoes = document.createElement("div");
        acoes.classList.add("acoes-tarefa");
        acoes.append(botaoEditar, botaoExcluir);

        // Rodapé
        const rodape = document.createElement("div");
        rodape.classList.add("rodape-tarefa");
        rodape.append(etiquetas, acoes);

        // Monta o cartão
        cartao.append(conteudo, areaStatus, rodape);
        listaTarefas.appendChild(cartao);
    });

    // Mensagem quando não há resultados
    if (registrosFiltrados.length === 0) {
        const mensagem = document.createElement("p");
        mensagem.classList.add("mensagem-vazia");

        mensagem.textContent =
            tarefas.length === 0
                ? "Nenhum registro cadastrado ainda."
                : "Nenhum registro encontrado para esta pesquisa ou filtro.";

        listaTarefas.appendChild(mensagem);
    }
}

// Preenche o formulário para edição
function editarTarefa(indice) {
    const tarefa = tarefas[indice];

    document.getElementById("titulo").value = tarefa.titulo;
    document.getElementById("descricao").value = tarefa.descricao || "";
    document.getElementById("prioridade").value =
        tarefa.prioridade || "baixa";
    document.getElementById("status").value =
        tarefa.status || "pendente";
    document.getElementById("tipo").value =
        tarefa.tipo || "tarefa";

    indiceEmEdicao = indice;
    formulario.hidden = false;

    formulario.scrollIntoView({
        behavior: "smooth"
    });
}

// Exclui um registro
function excluirTarefa(indice) {
    const confirmar = confirm(
        "Deseja realmente excluir este registro?"
    );

    if (confirmar) {
        tarefas.splice(indice, 1);

        // Fecha uma possível edição do registro excluído
        if (indiceEmEdicao !== null) {
            formulario.hidden = true;
            formulario.reset();
            indiceEmEdicao = null;
        }

        salvarTarefas();
        mostrarTarefas();
    }
}

// Salva os registros
function salvarTarefas() {
    localStorage.setItem(
        "tarefas",
        JSON.stringify(tarefas)
    );
}

// Carrega os registros ao abrir a página
mostrarTarefas();
