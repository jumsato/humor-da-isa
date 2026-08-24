const calendarioData = JSON.parse(localStorage.getItem("calendarioData")) || {};
let diaSelecionado = null;

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
    const { humor, sono, menstruacao } = calendarioData[dataStr];
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

function gerarGraficos() {
    const datas = Object.keys(calendarioData);
    const humor = datas.map(d => calendarioData[d].humor || "");
    const sono = datas.map(d => calendarioData[d].sono || "");
    const menstruacao = datas.map(d => calendarioData[d].menstruacao || "");

    new Chart(document.getElementById("graficoHumor"), {
        type: "line",
        data: {
            labels: datas,
            datasets: [{
                label: "Humor",
                data: humor.map(h => h.length),
                borderColor: "#4a148c",
                fill: false
            }]
        }
    });

    new Chart(document.getElementById("graficoSono"), {
        type: "line",
        data: {
            labels: datas,
            datasets: [{
                label: "Sono",
                data: sono.map(s => s.length),
                borderColor: "#64b5f6",
                fill: false
            }]
        }
    });

    new Chart(document.getElementById("graficoMenstruacao"), {
        type: "line",
        data: {
            labels: datas,
            datasets: [{
                label: "Menstruação",
                data: menstruacao.map(m => m.length),
                borderColor: "#e53935",
                fill: false
            }]
        }
    });
}

/* ===== Inicialização ===== */
document.addEventListener("DOMContentLoaded", () => {
    gerarCalendario();
});
