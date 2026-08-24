const humorData = JSON.parse(localStorage.getItem("humorData")) || {};

function registrarHumor(humor) {
    const hoje = new Date().toISOString().split("T")[0];
    humorData[hoje] = humor;
    localStorage.setItem("humorData", JSON.stringify(humorData));
    gerarCalendario();
    gerarGrafico();
}

function gerarCalendario() {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();
    const primeiroDia = new Date(ano, mes, 1);
    const ultimoDia = new Date(ano, mes + 1, 0);

    let html = "<table><tr>";
    const diaSemana = primeiroDia.getDay();

    for (let i = 0; i < diaSemana; i++) {
        html += "<td></td>";
    }

    for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
        const dataStr = `${ano}-${String(mes+1).padStart(2,"0")}-${String(dia).padStart(2,"0")}`;
        const humor = humorData[dataStr] || "";
        let cor = "";
        if (humor === "👍🏾") cor = "background-color:#81c784;";
        if (humor === "🙂") cor = "background-color:#64b5f6;";
        if (humor === "👎🏾") cor = "background-color:#ffb74d;";
        if (humor === "👎🏾👎🏾") cor = "background-color:#e57373;";

        const classeHoje = (dia === hoje.getDate()) ? "today" : "";
        html += `<td class="${classeHoje}" style="${cor}">${humor || dia}</td>`;
        if ((dia + diaSemana) % 7 === 0) html += "</tr><tr>";
    }

    html += "</tr></table>";
    document.getElementById("calendario").innerHTML = html;
}

function gerarGrafico() {
    const labels = Object.keys(humorData);
    const valores = Object.values(humorData).map(h => {
        if (h === "👍🏾") return 4;
        if (h === "🙂") return 3;
        if (h === "👎🏾") return 2;
        if (h === "👎🏾👎🏾") return 1;
        return 0;
    });

    const cores = Object.values(humorData).map(h => {
        if (h === "👍🏾") return "#81c784";
        if (h === "🙂") return "#64b5f6";
        if (h === "👎🏾") return "#ffb74d";
        if (h === "👎🏾👎🏾") return "#e57373";
        return "#ccc";
    });

    const ctx = document.getElementById("humorChart").getContext("2d");
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Oscilação de Humor',
                data: valores,
                borderColor: '#4a148c',
                fill: false,
                pointBackgroundColor: cores,
                pointRadius: 6
            }]
        }
    });
}

gerarCalendario();
gerarGrafico();
