export const convertHours = (hours: string | number): { text: string; colorClass: string } => {
  const hoursNum = typeof hours === 'string' ? parseInt(hours, 10) : hours;

  if (isNaN(hoursNum) || hoursNum < 0) {
    return { text: 'Tiempo inválido', colorClass: 'text-gray-500' };
  }

  const days = Math.floor(hoursNum / 24);
  const years = Math.floor(days / 365);
  const months = Math.floor((days % 365) / 30);
  const remainingDays = days % 30;
  const remainingHours = hoursNum % 24;

  const parts = [];
  if (years > 0) parts.push(`${years} año${years > 1 ? 's' : ''}`);
  if (months > 0) parts.push(`${months} mes${months > 1 ? 'es' : ''}`);
  if (remainingDays > 0) parts.push(`${remainingDays} día${remainingDays > 1 ? 's' : ''}`);
  if (remainingHours > 0) parts.push(`${remainingHours} hora${remainingHours > 1 ? 's' : ''}`);

  let text = parts.join(', ') || 'Menos de una hora';
  let colorClass: string;

  if (hoursNum <= 0) {
    text = 'Expirado';
    colorClass = 'text-red-500';
  } else if (hoursNum <= 72) {
    colorClass = 'text-orange-500';
  } else if (hoursNum <= 168) {
    colorClass = 'text-yellow-500';
  } else {
    colorClass = 'text-green-500';
  }

  return { text, colorClass };
};
