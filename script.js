const form = document.getElementById('transaction-form');
const descInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const transactionList = document.getElementById('transaction-list');
const totalBalanceEl = document.getElementById('total-balance');
const totalIncomeEl = document.getElementById('total-income');
const totalExpenseEl = document.getElementById('total-expense');

let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
let myChart = null;

function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
}

function initChart(income, expense) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    if (myChart) {
        myChart.destroy(); 
    }
    myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pemasukan', 'Pengeluaran'],
            datasets: [{
                data: [income, expense],
                backgroundColor: ['#22c55e', '#ef4444'],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

function updateUI() {
    transactionList.innerHTML = '';
    let income = 0;
    let expense = 0;

    transactions.forEach((trx, index) => {
        if (trx.type === 'income') {
            income += Number(trx.amount);
        } else {
            expense += Number(trx.amount);
        }

        const li = document.createElement('li');
        li.className = `flex justify-between items-center p-3 rounded-lg border ${trx.type === 'income' ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`;
        li.innerHTML = `
            <span class="text-gray-700 font-medium">${trx.description}</span>
            <div class="flex items-center space-x-3">
                <span class="${trx.type === 'income' ? 'text-green-600' : 'text-red-600'} font-semibold">
                    ${trx.type === 'income' ? '+' : '-'}${formatRupiah(trx.amount)}
                </span>
                <button onclick="deleteTransaction(${index})" class="text-gray-400 hover:text-red-600 font-bold cursor-pointer">&times;</button>
            </div>
        `;
        transactionList.appendChild(li);
    });

    const balance = income - expense;
    totalBalanceEl.textContent = formatRupiah(balance);
    totalIncomeEl.textContent = formatRupiah(income);
    totalExpenseEl.textContent = formatRupiah(expense);

    localStorage.setItem('transactions', JSON.stringify(transactions));

    initChart(income, expense);
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const newTrx = {
        description: descInput.value,
        amount: parseFloat(amountInput.value),
        type: typeInput.value
    };

    transactions.push(newTrx);
    descInput.value = '';
    amountInput.value = '';
    updateUI();
});

window.deleteTransaction = function(index) {
    transactions.splice(index, 1);
    updateUI();
}

updateUI();