const calendarioData = JSON.parse(localStorage.getItem("calendarioData")) || {};
let diaSelecionado = null;
let graficoAtual = null;

function gerarCalendario() {
    const hoje = new Date();
    const mes = hoje.toLocaleString("pt-BR", { month: "long" });
    document.getElementById("mesAtual").innerText = mes.charAt(0).toUpperCase() + mes.slice(1);

    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    const hojeDia = hoje.getDate();

    let html = "<table><tr>";
    for (let d = 1; d <= diasNoMes; d++) {
        const dataStr = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        const classeHoje = (d === hojeDia) ? " class='hoje'" : "";
        html += `<td${classeHoje} onclick="abrirModal('${dataStr}')" style="background:${getColor(dataStr)}">${d}<br>${renderIcons(dataStr)}</td>`;
        if (d % 7 === 0) html += "</tr><tr>";
    }
    html += "</tr></table>";
    document.getElementById("calendario").innerHTML = html;
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
    document.getElementById("modalData").innerText = `Dia ${dataStr}`;
    document.getElementById("modal").style.display = "flex";
}

function salvarModal(tipo, valor) {
    if (!calendarioData[diaSelecionado]) calendarioData[diaSelecionado] = {};
    calendarioData[diaSelecionado][tipo] = valor;
    localStorage.setItem("calendarioData", JSON.stringify(calendarioData));
    gerarCalendario();
}

function limparModal(tipo) {
    if (calendarioData[diaSelecionado] && calendarioData[diaSelecionado][tipo]) {
        delete calendarioData[diaSelecionado][tipo];
        localStorage.setItem("calendarioData", JSON.stringify(calendarioData));
        gerarCalendario();
    }
}

function fecharModal() {
    document.getElementById("modal").style.display = "none";
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
    const hoje = new Date();
    const anoAtual = hoje.getFullYear();
    const mesAtual = hoje.getMonth(); // 0-indexado

    // Considera apenas os dias do mês/ano exibidos no calendário
    const datas = Object.keys(calendarioData)
        .filter(d => {
            const [ano, mes] = d.split("-").map(Number);
            return ano === anoAtual && (mes - 1) === mesAtual;
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
                    text: `Resumo do mês ${mesAtual + 1}/${anoAtual}`
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

/* ===== Inicialização ===== */
document.addEventListener("DOMContentLoaded", () => {
    gerarCalendario();
});
