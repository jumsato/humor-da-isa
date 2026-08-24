// Dados armazenados por dia
const calendarioData = JSON.parse(localStorage.getItem("calendarioData")) || {};

// Gera o calendário
function gerarCalendario() {
    const hoje = new Date();
    const mes = hoje.toLocaleString("pt-BR", { month: "long" });
    document.getElementById("mesAtual").innerText = mes.charAt(0).toUpperCase() + mes.slice(1);

    const diasNoMes = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0).getDate();
    let html = "<table><tr>";
    for (let d = 1; d <= diasNoMes; d++) {
        const dataStr = `${hoje.getFullYear()}-${String(hoje.getMonth()+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        html += `<td onclick="abrirModal('${dataStr}')">${d}<br>${renderIcons(dataStr)}</td>`;
        if (d % 7 === 0) html += "</tr><tr>";
    }
    html += "</tr></table>";
    document.getElementById("calendario").innerHTML = html;
}

// Renderiza ícones no calendário
function renderIcons(dataStr) {
    if (!calendarioData[dataStr]) return "";
    const { humor, sono, menstruacao } = calendarioData[dataStr];
    let icons = "";
    if (humor) icons += humor + " ";
    if (sono) icons += sono + " ";
    if (menstruacao) {
        if (menstruacao === "inicio") icons += "🩸 ";
        else if (menstruacao === "fim") icons += "🩸 ";
        else if (menstruacao === "pouco") icons += "🩸 ";
        else if (menstruacao === "moderado") icons += "🩸🩸 ";
        else if (menstruacao === "intenso") icons += "🩸🩸🩸 ";
        else if (menstruacao === "muito-intenso") icons += "🩸🩸🩸🩸 ";
    }
    return icons;
}

// Abre modal para escolher opções
function abrirModal(dataStr) {
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
        <div class="modal-content">
            <h3>Registrar ${dataStr}</h3>
            <p>Humor:</p>
            <button onclick="salvar('${dataStr}','humor','👍🏾')">👍🏾 Bem</button>
            <button onclick="salvar('${dataStr}','humor','🙂')">🙂 Ok</button>
            <button onclick="salvar('${dataStr}','humor','👎🏾')">👎🏾 Mal</button>
            <button onclick="salvar('${dataStr}','humor','👎🏾👎🏾')">👎🏾👎🏾 Muito mal</button>
            <p>Sono:</p>
            <button onclick="salvar('${dataStr}','sono','😌')">😌 Disposta</button>
            <button onclick="salvar('${dataStr}','sono','🥱')">🥱 Com sono</button>
            <button onclick="salvar('${dataStr}','sono','😴')">😴 Muito sono</button>
            <button onclick="salvar('${dataStr}','sono','💤')">💤 Me arrastando</button>
            <p>Menstruação:</p>
            <button onclick="salvar('${dataStr}','menstruacao','inicio')">🩸 Início</button>
            <button onclick="salvar('${dataStr}','menstruacao','fim')">🩸 Fim</button>
            <button onclick="salvar('${dataStr}','menstruacao','pouco')">🩸 Pouco</button>
            <button onclick="salvar('${dataStr}','menstruacao','moderado')">🩸🩸 Moderado</button>
            <button onclick="salvar('${dataStr}','menstruacao','intenso')">🩸🩸🩸 Intenso</button>
            <button onclick="salvar('${dataStr}','menstruacao','muito-intenso')">🩸🩸🩸🩸 Muito intenso</button>
            <br><br>
            <button onclick="fecharModal()">Fechar</button>
        </div>`;
    document.body.appendChild(modal);
}

// Salva escolha
function salvar(dataStr, tipo, valor) {
    if (!calendarioData[dataStr]) calendarioData[dataStr] = {};
    calendarioData[dataStr][tipo] = valor;
    localStorage.setItem("calendarioData", JSON.stringify(calendarioData));
    gerarCalendario();
}

// Fecha modal
function fecharModal() {
    document.querySelector(".modal").remove();
}

// Inicializa
gerarCalendario();
