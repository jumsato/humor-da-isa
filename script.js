const calendarioData = JSON.parse(localStorage.getItem("calendarioData")) || {};
let diaSelecionado = null;

function gerarCalendario() {
    const hoje = new Date();
    const mes = hoje.toLocaleString("pt-BR", { month: "long" });
    document.getElementById("mesAtual").innerText = mes.charAt(0).toUpperCase() + mes.slice(1);

    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    let html = "<table><tr>";
    for (let d = 1; d <= diasNoMes; d++) {
        const dataStr = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        html += `<td onclick="abrirModal('${dataStr}')" style="background:${getColor(dataStr)}">${d}<br>${renderIcons(dataStr)}</td>`;
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

gerarCalendario();
