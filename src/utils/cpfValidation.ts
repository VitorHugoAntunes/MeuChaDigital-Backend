const isValidCPF = (cpf: string): boolean => {
  if (!/^\d{11}$/.test(cpf)) return false; // Verifica se tem exatamente 11 dígitos numéricos
  if (/^(\d)\1{10}$/.test(cpf)) return false; // Impede CPFs com números repetidos (ex: 00000000000)

  let sum = 0;
  let remainder;

  // Cálculo do primeiro dígito verificador
  for (let i = 0; i < 9; i++) {
    sum += parseInt(cpf.charAt(i)) * (10 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(9))) return false;

  // Cálculo do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += parseInt(cpf.charAt(i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cpf.charAt(10))) return false;

  return true;
};

export default isValidCPF;