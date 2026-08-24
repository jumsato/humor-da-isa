// Humor
const humorData = JSON.parse(localStorage.getItem("humorData")) || {};
function registrarHumor(humor) {
    const hoje = new Date().toISOString().split("T")[0];
    humorData[hoje] = humor;
    localStorage.setItem("humorData", JSON.stringify(humorData));
    gerarCalendario();
    gerarResumo();
    gerarGrafico();
}
function gerarResumo() {
    const contagem = { "👍🏾": 0, "🙂": 0, "👎🏾": 0, "👎🏾👎🏾": 0 };
    for (const dia in humorData) contagem[humorData[dia]]++;
    document.getElementById("resumo").innerHTML = `
        <div class="resumo-box bem">👍🏾 Bem: ${contagem["👍🏾"]}</div>
        <div class="resumo-box ok">🙂 Ok: ${contagem["🙂"]}</div>
        <div class="resumo-box mal">👎🏾 Mal: ${contagem["👎🏾"]}</div>
        <div class="resumo-box muito-mal">👎🏾👎🏾 Muito mal: ${contagem["👎🏾👎🏾"]}</div>`;
}
function gerarGrafico() {
    const labels = Object.keys(humorData);
    const valores = Object.values(humorData).map(h => h==="👍🏾"?4:h==="🙂"?3:h==="👎🏾"?2:h==="👎🏾👎🏾"?1:0);
    const cores = Object.values(humorData).map(h => h==="👍🏾"?"#81c784":h==="🙂"?"#64b5f6":h==="👎🏾"?"#ffb74d":h==="👎🏾👎🏾"?"#e57373":"#ccc");
    new Chart(document.getElementById("humorChart").getContext("2d"), {
        type: 'line',
        data: { labels, datasets:[{label:'Oscilação de Humor',data:valores,borderColor:'#4a148c',fill:false,pointBackgroundColor:cores,pointRadius:6}] }
    });
}

// Sono
const sonoData = JSON.parse(localStorage.getItem("sonoData")) || {};
function registrarSono(nivel) {
    const hoje = new Date().toISOString().split("T")[0];
    sonoData[hoje] = nivel;
    localStorage.setItem("sonoData", JSON.stringify(sonoData));
    gerarResumoSono();
    gerarGraficoSono();
}
function gerarResumoSono() {
    const contagem = { "😌":0,"🥱":0,"😴":0,"💤":0 };
    for (const dia in sonoData) contagem[sonoData[dia]]++;
    document.getElementById("resumoSono").innerHTML = `
        <div class="resumo-box disposta">😌 Disposta: ${contagem["😌"]}</div>
        <div class="resumo-box com-sono">🥱 Com sono: ${contagem["🥱"]}</div>
        <div class="resumo-box muito-sono">😴 Muito sono: ${contagem["😴"]}</div>
        <div class="resumo-box arrastando">💤 Me arrastando: ${contagem["💤"]}</div>`;
}
function gerarGraficoSono() {
    const labels = Object.keys(sonoData);
    const valores = Object.values(sonoData).map(s=>s==="😌"?4:s==="🥱"?3:s==="😴"?2:s==="💤"?1:0);
    const cores = Object.values(sonoData).map(s=>s==="😌"?"#9c27b0":s==="🥱"?"#8e24aa":s==="😴"?"#7b1fa2":s==="💤"?"#6a1b9a":"#ccc");
    new Chart(document.getElementById("sonoChart").getContext("2d"), {
        type:'line',
        data:{labels,datasets:[{label:'Oscilação de Sono',data:valores,borderColor:'#4a148c',fill:false,pointBackgroundColor:cores,pointRadius:6}]}
    });
}

// Menstruação
const menstruacaoData = JSON.parse(localStorage.getItem("menstruacaoData")) || {};
const fluxoData = JSON.parse(localStorage.getItem("fluxoData")) || {};
function registrarMenstruacao(evento) {
    const hoje = new Date().toISOString().split("T")[0];
    menstruacaoData[hoje] = evento;
    localStorage.setItem("menstruacaoData", JSON.stringify(menstruacaoData));
    gerarResumoMenstruacao();
    gerarGraficoFluxo();
}
function registrarFluxo(nivel) {
    const hoje = new Date().toISOString().split("T")[0];
    fluxoData[hoje] = nivel;
    localStorage.setItem("fluxoData", JSON.stringify(fluxoData));
    gerar
