# 🔄 Sistema de Backup - OPIN

## 📋 Visão Geral

O sistema de backup do OPIN (Observatório dos Professores Indígenas) permite fazer backup completo de todas as tabelas e arquivos do sistema, incluindo imagens dos buckets do Supabase.

## 🎯 Funcionalidades

### 1. Backup Completo do Sistema
- **Inclui**: Todas as tabelas + imagens dos buckets + metadados
- **Formato**: JSON estruturado
- **Arquivo**: `backup_completo_opin_YYYY-MM-DD.json`

### 2. Backup das Tabelas
- **Inclui**: Apenas dados das tabelas
- **Formato**: CSV estruturado (um arquivo por tabela)
- **Arquivo**: `backup_tabelas_csv_opin_YYYY-MM-DD.zip`

### 3. Visualização Individual
- **Tabelas**: Visualização e download CSV/JSON por tabela
- **Buckets**: Lista de arquivos disponíveis

## 🗄️ Tabelas Incluídas no Backup

| Tabela | Descrição | Registros |
|--------|-----------|-----------|
| `escolas_completa` | Dados principais das escolas | ~100+ |
| `historias_professor` | Histórias dos professores | ~50+ |
| `documentos_escola` | Documentos PDF das escolas | ~30+ |
| `titulos_videos` | Links para vídeos | ~20+ |
| `legendas_fotos` | Legendas das imagens | ~100+ |

## 📁 Buckets Incluídos no Backup

| Bucket | Descrição | Tipo de Arquivo |
|--------|-----------|-----------------|
| `imagens-das-escolas` | Fotos das escolas indígenas | JPG, PNG |
| `imagens-professores` | Fotos dos professores | JPG, PNG |
| `pdfs` | Documentos das escolas | PDF |

## 🚀 Como Usar

### Acesso
1. Acesse o painel de administração (`/admin`)
2. Clique na aba **"Tabelas Integrais"**

### Backup Completo
1. Clique em **"Backup Completo"**
2. Aguarde o processo (pode levar alguns minutos)
3. O arquivo será baixado automaticamente

### Backup das Tabelas
1. Clique em **"Backup Tabelas"**
2. Aguarde o processo
3. O arquivo será baixado automaticamente

### Visualização Individual
1. Clique em uma tabela para visualizar
2. Use os botões de download (CSV/JSON)
3. Use o botão "Atualizar" para dados mais recentes

## 📊 Estrutura do Arquivo de Backup

```json
{
  "metadata": {
    "dataBackup": "2024-01-15T10:30:00.000Z",
    "versao": "1.0",
    "descricao": "Backup completo do sistema OPIN",
    "tabelas": [
      { "id": "escolas_completa", "nome": "Escolas Completas" }
    ],
    "buckets": [
      { "id": "imagens-das-escolas", "nome": "Imagens das Escolas" }
    ],
    "totalRegistros": 250,
    "totalArquivos": 45
  },
  "dados": {
    "escolas_completa": [...],
    "historias_professor": [...]
  },
  "arquivos": {
    "imagens-das-escolas": [
      {
        "name": "escola_001.jpg",
        "size": 1024000,
        "url": "https://..."
      }
    ]
  }
}
```

## ⚠️ Considerações Importantes

### URLs dos Arquivos
- As URLs geradas são válidas por **1 hora**
- Para download posterior, use o arquivo de backup como referência
- Os arquivos podem ser baixados usando as URLs do backup

### Tamanho dos Arquivos
- **Backup completo**: Pode ser grande (10-50MB)
- **Backup tabelas**: Geralmente pequeno (1-5MB) - arquivo ZIP com CSVs
- **Progresso**: Barra de progresso mostra o status

### Permissões
- Requer acesso autenticado ao Supabase
- Verifique as políticas RLS (Row Level Security)
- Buckets devem ter permissões de leitura

## 🔧 Solução de Problemas

### Backup falha
1. Verifique conexão com internet
2. Confirme permissões no Supabase
3. Verifique console do navegador para erros

### Arquivos não baixam
1. Verifique se o bucket existe
2. Confirme permissões de storage
3. URLs podem ter expirado (gerar novo backup)

### Tabela não carrega
1. Verifique se a tabela existe
2. Confirme permissões RLS
3. Verifique estrutura da tabela

## 📈 Monitoramento

### Status do Backup
- **Iniciando**: Preparando backup
- **Tabelas**: Fazendo backup das tabelas
- **Buckets**: Fazendo backup dos arquivos
- **Finalizando**: Criando arquivo de backup
- **Download**: Preparando download
- **Concluído**: Backup finalizado com sucesso
- **Erro**: Erro durante o processo

### Barra de Progresso
- Mostra progresso em tempo real
- Atualiza conforme cada etapa é concluída
- Desabilita botões durante o processo

## 🎨 Interface

### Design Responsivo
- Funciona em desktop e mobile
- Grid adaptativo para diferentes tamanhos de tela
- Ícones coloridos para cada tipo de conteúdo

### Feedback Visual
- Estados de loading com spinners
- Mensagens de status coloridas
- Barra de progresso animada
- Botões desabilitados durante operações

## 🔮 Futuras Melhorias

- [ ] Backup incremental (apenas mudanças)
- [ ] Agendamento automático de backups
- [ ] Restauração de dados
- [ ] Compressão de arquivos
- [ ] Upload para serviços de nuvem
- [ ] Notificações por email
- [ ] Logs detalhados de backup

## 📞 Suporte

Para problemas ou dúvidas sobre o sistema de backup:
1. Verifique os logs no console do navegador
2. Confirme as permissões no Supabase
3. Teste com uma tabela pequena primeiro
4. Verifique a documentação do Supabase Storage

---

**Última atualização**: Janeiro 2024  
**Versão**: 1.0  
**Desenvolvido por**: Equipe OPIN
