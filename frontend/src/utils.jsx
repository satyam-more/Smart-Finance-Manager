const API_BASE_URL = 'http://127.0.0.1:5000/api';

function formatCurrency(val) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
}

export { API_BASE_URL, formatCurrency };
