-- Remove referências a imagens que não existem nem localmente nem no Supabase cloud.
-- Aplique APÓS 002_normalizar_extensoes_webp.sql.
-- Os paths abaixo foram verificados: ausentes em data/storage/opin/ e em todos os buckets Supabase.

UPDATE legendas_fotos
SET imagem_url = NULL
WHERE imagem_url IN (
  -- escola 1
  '1/1_1763384375375_8tni68.webp',
  '1/1_1763384375816_vm6izz.webp',
  '1/1_1763384376123_dxbift.webp',
  '1/1_1763390206942_r5hl5g.webp',
  '1/1_1763390207699_26y9ik.webp',
  '1/1_1763390208016_bkoz7r.webp',
  '1/1_1763390208428_4x0084.webp',
  '1/1_1763390208735_mr6866.webp',
  '1/1_1763390209145_b50pxw.webp',
  '1/1_1763390209450_jofz14.webp',
  '1/1_1763390209757_ff3exh.webp',
  '1/1_1763557619794_3lhr98.webp',
  '1/1_1763558001250_16n47b.webp',
  -- escola 11
  '11/11_1763129521081_a1ws4n.webp',
  '11/11_1763129521786_v5080a.webp',
  '11/11_1763223583687_7vnioo.webp',
  '11/11_1763385317593_2af040.webp',
  '11/11_1763385335368_gg1kvu.webp',
  '11/11_1763385350736_nu762b.webp',
  '11/11_1763386150161_0a8gr2.webp',
  '11/11_1763386150821_gg3y1o.webp',
  '11/11_1763386151127_lqzhbg.webp',
  '11/11_1763386151434_8frnpp.webp',
  '11/11_1763386151845_lieb4u.webp',
  '11/11_1763386152151_xbo2md.webp',
  '11/11_1763386152399_7118oc.webp',
  '11/11_1763402802238_ta7ws2.webp',
  '11/professor_11_1750630523596_8bzo6l.webp',
  -- escola 20
  '20/1.webp',
  '20/2.webp',
  '20/20_1750765906908_rhccb8.webp',
  '20/20_1757100609551_3wn0hh.webp',
  '20/20_1757100609967_078u1r.webp',
  '20/20_1757171796383_g4ta2g.webp',
  '20/2Z8C9570.webp',
  '20/3.webp',
  '20/3Z8C9571.webp',
  '20/escola_frente.webp',
  '20/patio.webp',
  '20/professor1.webp',
  '20/professor2.webp',
  '20/professor3.webp',
  '20/sala_aula.webp',
  -- escola 4
  '4/4_1763061422223_369u6q.webp',
  '4/4_1763061439186_14oy96.webp',
  '4/4_1763126815311_l3jp8e.webp',
  '4/4_1763126815869_t4penh.webp',
  -- escola 45
  '45/45_1762530215634_qvrri3.webp',
  '45/45_1762530220449_lfz4g4.webp',
  '45/45_1762530220708_v5i6eo.webp',
  '45/45_1762530222285_nrmtwp.webp'
);
