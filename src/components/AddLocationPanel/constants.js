import { greenIcon, blueIcon, yellowIcon, redIcon, violetIcon, blackIcon, orangeIcon } from "../CustomIcon";

export const opcoes = [
  {
    value: "assistencia",
    label: "Assistência Social",
    cor: "hover:bg-green-100",
    icone: greenIcon
  },
  {
    value: "lazer",
    label: "Lazer",
    cor: "hover:bg-blue-100",
    icone: blueIcon
  },
  {
    value: "historico",
    label: "Histórico",
    cor: "hover:bg-yellow-100",
    icone: yellowIcon
  },
  {
    value: "comunidades",
    label: "Comunidades",
    cor: "hover:bg-red-100",
    icone: redIcon
  },
  {
    value: "educação",
    label: "Educação",
    cor: "hover:bg-purple-100",
    icone: violetIcon
  },
  {
    value: "religiao",
    label: "Religião",
    cor: "hover:bg-gray-100",
    icone: blackIcon
  },
  {
    value: "bairro",
    label: "Bairro",
    cor: "hover:bg-orange-100",
    icone: orangeIcon
  }
];

export const crosshairColorMap = {
  bairro: "#9CA3AF",
  assistencia: "#10B981",
  historico: "#FBBF24",
  lazer: "#3B82F6",
  comunidades: "#EF4444",
  educação: "#8B5CF6",
  religiao: "#4B5563",
};