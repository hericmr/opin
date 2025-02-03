import Navbar from "./Navbar";
import detalhesIntro from "./detalhesInfo";

// No retorno do MapaSantos:
return (
  <div className="relative h-screen">
    <Navbar onTitleClick={() => setPainelInfo(detalhesIntro)} /> {/* Aqui está a conexão */}
    <MapaBase>
      {visibilidade.bairros && geojsonData && <Bairros data={geojsonData} style={geoJSONStyle} />}
      {visibilidade.assistencia && <Marcadores pontos={pontosAssistencia} onClick={setPainelInfo} />}
      {visibilidade.historicos && <Marcadores pontos={pontosHistoricos} onClick={setPainelInfo} />}
      {visibilidade.culturais && <Marcadores pontos={pontosLazer} onClick={setPainelInfo} />}
    </MapaBase>

    {painelInfo && <PainelInformacoes painelInfo={painelInfo} closePainel={() => setPainelInfo(null)} />}
    
    <MenuCamadas
      estados={visibilidade}
      acoes={{
        toggleBairros: () => toggleVisibilidade("bairros"),
        toggleAssistencia: () => toggleVisibilidade("assistencia"),
        toggleHistoricos: () => toggleVisibilidade("historicos"),
        toggleCulturais: () => toggleVisibilidade("culturais"),
      }}
    />
  </div>
);
