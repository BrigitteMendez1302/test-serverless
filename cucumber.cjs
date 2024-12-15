module.exports = {
  default: {
    require: ["ts-node/register", "tests/bdd/steps/**/*.steps.ts"], // Ruta a tus archivos de pasos
    paths: ["tests/bdd/features/**/*.feature"], // Ruta a tus archivos .feature
    format: ["pretty"], // Salida legible en la terminal
  },
};
