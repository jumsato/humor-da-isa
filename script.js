const calendarioData = JSON.parse(localStorage.getItem("calendarioData")) || {};
let diaSelecionado = null;
let graficoAtual = null;

// Mês/ano que estão sendo exibidos no momento (começa no mês atual, navegável com as setas)
const hojeReal = new Date();
let mesExibido = hojeReal.getMonth();
let anoExibido = hojeReal.getFullYear();

const DIAS_SEMANA = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

function gerarCalendario() {
    const nomeMes = new Date(anoExibido, mesExibido, 1).toLocaleString("pt-BR", { month: "long" });
    document.getElementById("mesAtual").innerText = `${nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)} de ${anoExibido}`;

    const diasNoMes = new Date(anoExibido, mesExibido + 1, 0).getDate();
    const ehMesAtual = anoExibido === hojeReal.getFullYear() && mesExibido === hojeReal.getMonth();
    const hojeDia = hojeReal.getDate();
    const primeiroDiaSemana = new Date(anoExibido, mesExibido, 1).getDay(); // 0 = domingo

    let html = "<table><thead><tr>";
    DIAS_SEMANA.forEach(d => html += `<th>${d}</th>`);
    html += "</tr></thead><tbody><tr>";

    let coluna = 0;
    for (let i = 0; i < primeiroDiaSemana; i++) {
        html += "<td class='vazio'></td>";
        coluna++;
    }

    for (let d = 1; d <= diasNoMes; d++) {
        const dataStr = `${anoExibido}-${String(mesExibido+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const classeHoje = (ehMesAtual && d === hojeDia) ? " class='hoje'" : "";
        html += `<td${classeHoje} onclick="abrirModal('${dataStr}')" style="background:${getColor(dataStr)}">${d}<br>${renderIcons(dataStr)}</td>`;
        coluna++;
        if (coluna % 7 === 0 && d !== diasNoMes) html += "</tr><tr>";
    }
    while (coluna % 7 !== 0) {
        html += "<td class='vazio'></td>";
        coluna++;
    }
    html += "</tr></tbody></table>";
    document.getElementById("calendario").innerHTML = html;
}

function mesAnterior() {
    mesExibido--;
    if (mesExibido < 0) {
        mesExibido = 11;
        anoExibido--;
    }
    gerarCalendario();
}

function mesProximo() {
    mesExibido++;
    if (mesExibido > 11) {
        mesExibido = 0;
        anoExibido++;
    }
    gerarCalendario();
}

// Converte "AAAA-MM-DD" para o formato brasileiro "DD/MM/AAAA"
function paraFormatoBR(dataStr) {
    const [ano, mes, dia] = dataStr.split("-");
    return `${dia}/${mes}/${ano}`;
}

function renderIcons(dataStr) {
    if (!calendarioData[dataStr]) return "";
    const { humor, sono, menstruacao, toc } = calendarioData[dataStr];
    let icons = "";
    if (humor) icons += humor + " ";
    if (sono) icons += sono + " ";
    if (menstruacao) {
        if (menstruacao === "inicio") icons += "👿 ";
        else if (menstruacao === "fim") icons += "👩🏾‍🎤 ";
        else if (menstruacao === "pouco") icons += "🩸 ";
        else if (menstruacao === "moderado") icons += "🩸🩸 ";
        else if (menstruacao === "intenso") icons += "🩸🩸🩸 ";
        else if (menstruacao === "muito-intenso") icons += "🩸🩸🩸🩸 ";
    }
    if (toc) icons += toc + " ";
    if (calendarioData[dataStr].nota && calendarioData[dataStr].nota.trim() !== "") icons += "📝";
    return icons;
}

function getColor(dataStr) {
    if (!calendarioData[dataStr]) return "white";
    const { humor } = calendarioData[dataStr];
    if (humor === "👍🏾") return "#81c784";
    if (humor === "🙂") return "#64b5f6";
    if (humor === "👎🏾") return "#ffb74d";
    if (humor === "👎🏾👎🏾") return "#e57373";
    return "white";
}

function abrirModal(dataStr) {
    diaSelecionado = dataStr;
    document.getElementById("modalData").innerText = `Dia ${paraFormatoBR(dataStr)}`;
    document.getElementById("notaDia").value = (calendarioData[dataStr] && calendarioData[dataStr].nota) || "";
    atualizarSelecoesModal();
    document.getElementById("modal").style.display = "flex";
}

function salvarModal(tipo, valor) {
    if (!calendarioData[diaSelecionado]) calendarioData[diaSelecionado] = {};
    calendarioData[diaSelecionado][tipo] = valor;
    localStorage.setItem("calendarioData", JSON.stringify(calendarioData));
    gerarCalendario();
    atualizarSelecoesModal();
}

function salvarNota(valor) {
    if (!calendarioData[diaSelecionado]) calendarioData[diaSelecionado] = {};
    calendarioData[diaSelecionado].nota = valor;
    localStorage.setItem("calendarioData", JSON.stringify(calendarioData));
}

function limparModal(tipo) {
    if (calendarioData[diaSelecionado] && calendarioData[diaSelecionado][tipo]) {
        delete calendarioData[diaSelecionado][tipo];
        localStorage.setItem("calendarioData", JSON.stringify(calendarioData));
        gerarCalendario();
        atualizarSelecoesModal();
    }
}

// Marca visualmente qual opção está escolhida em cada variável do dia atual
function atualizarSelecoesModal() {
    const dados = calendarioData[diaSelecionado] || {};
    document.querySelectorAll("#modal .opcoes").forEach(grupo => {
        const tipo = grupo.dataset.grupo;
        grupo.querySelectorAll("button").forEach(btn => {
            btn.classList.toggle("selecionado", dados[tipo] === btn.dataset.valor);
        });
    });
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
    gerarCalendario();
}

/* ===== Gráficos ===== */
function abrirGrafico() {
    document.getElementById("modalGrafico").style.display = "flex";
    gerarGraficos();
}

function fecharGrafico() {
    document.getElementById("modalGrafico").style.display = "none";
    gerarCalendario(); // volta para o calendário atualizado
}

const ESCALAS_GRAFICO = {
    humor: {
        "👍🏾": { valor: 1, label: "Bem" },
        "🙂": { valor: 2, label: "Ok" },
        "👎🏾": { valor: 3, label: "Mal" },
        "👎🏾👎🏾": { valor: 4, label: "Muito mal" }
    },
    sono: {
        "😌": { valor: 1, label: "Disposta" },
        "🥱": { valor: 2, label: "Com sono" },
        "😴": { valor: 3, label: "Muito sono" },
        "💤": { valor: 4, label: "Me arrastando" }
    },
    menstruacao: {
        "inicio": { valor: 1, label: "Início", emoji: "👿" },
        "pouco": { valor: 1, label: "Pouco", emoji: "🩸" },
        "moderado": { valor: 2, label: "Moderado", emoji: "🩸🩸" },
        "intenso": { valor: 3, label: "Intenso", emoji: "🩸🩸🩸" },
        "muito-intenso": { valor: 4, label: "Muito intenso", emoji: "🩸🩸🩸🩸" },
        "fim": { valor: 0, label: "Fim", emoji: "👩🏾‍🎤" }
    },
    toc: {
        "🕊️": { valor: 0, label: "Inexistente" },
        "🫩": { valor: 2, label: "Fraco" },
        "👺": { valor: 3, label: "Forte" },
        "🤯": { valor: 4, label: "Muito forte" }
    }
};

function gerarGraficos() {
    // Considera apenas os dias do mês/ano que estão sendo exibidos no calendário
    const datas = Object.keys(calendarioData)
        .filter(d => {
            const [ano, mes] = d.split("-").map(Number);
            return ano === anoExibido && (mes - 1) === mesExibido;
        })
        .sort();

    const camposOrdem = ["humor", "sono", "menstruacao", "toc"];

    function valoresDoCampo(campo) {
        return datas.map(d => {
            const valorBruto = calendarioData[d][campo];
            const info = valorBruto ? ESCALAS_GRAFICO[campo][valorBruto] : undefined;
            return info ? info.valor : null; // null = "sem dado" (gap na linha)
        });
    }

    if (graficoAtual) {
        graficoAtual.destroy();
    }

    graficoAtual = new Chart(document.getElementById("graficoMensal"), {
        type: "line",
        data: {
            labels: datas.map(d => d.split("-")[2]), // só o número do dia
            datasets: [
                {
                    label: "😊 Humor",
                    data: valoresDoCampo("humor"),
                    borderColor: "#8e24aa",
                    backgroundColor: "#8e24aa",
                    spanGaps: true,
                    tension: 0.3
                },
                {
                    label: "😴 Sono",
                    data: valoresDoCampo("sono"),
                    borderColor: "#1e88e5",
                    backgroundColor: "#1e88e5",
                    spanGaps: true,
                    tension: 0.3
                },
                {
                    label: "🩸 Menstruação",
                    data: valoresDoCampo("menstruacao"),
                    borderColor: "#e53935",
                    backgroundColor: "#e53935",
                    spanGaps: true,
                    tension: 0.3
                },
                {
                    label: "🤯 TOC",
                    data: valoresDoCampo("toc"),
                    borderColor: "#f9a825",
                    backgroundColor: "#f9a825",
                    spanGaps: true,
                    tension: 0.3
                }
            ]
        },
        options: {
            responsive: true,
            interaction: { mode: "index", intersect: false },
            plugins: {
                title: {
                    display: true,
                    text: `Resumo do mês ${mesExibido + 1}/${anoExibido}`
                },
                legend: {
                    position: "bottom"
                },
                tooltip: {
                    callbacks: {
                        label: (context) => {
                            const campo = camposOrdem[context.datasetIndex];
                            const data = datas[context.dataIndex];
                            const valorBruto = calendarioData[data] ? calendarioData[data][campo] : null;
                            const info = valorBruto ? ESCALAS_GRAFICO[campo][valorBruto] : null;
                            if (!info) return `${context.dataset.label}: sem registro`;
                            const emojiExibir = info.emoji || valorBruto;
                            return `${context.dataset.label}: ${emojiExibir} ${info.label}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    title: { display: true, text: "Dia do mês" }
                },
                y: {
                    min: 0,
                    max: 4,
                    ticks: {
                        stepSize: 1,
                        callback: (valor) => {
                            const legendas = { 0: "Nenhum", 1: "Leve", 2: "Moderado", 3: "Forte", 4: "Muito forte" };
                            return legendas[valor] ?? valor;
                        }
                    },
                    title: { display: true, text: "Intensidade" }
                }
            }
        }
    });
}

/* ===== Fechar modais clicando fora ou com Esc ===== */
[document.getElementById("modal"), document.getElementById("modalGrafico")].forEach(modalEl => {
    modalEl.addEventListener("click", (event) => {
        if (event.target === modalEl) {
            if (modalEl.id === "modal") fecharModal();
            else fecharGrafico();
        }
    });
});

document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (document.getElementById("modal").style.display !== "none") fecharModal();
    if (document.getElementById("modalGrafico").style.display !== "none") fecharGrafico();
});

/* ===== Inicialização ===== */
document.addEventListener("DOMContentLoaded", () => {
    gerarCalendario();
});
