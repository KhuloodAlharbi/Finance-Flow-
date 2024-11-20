function updateDashboard(data) {
    document.getElementById('total-budget').textContent = `$${data.total_budget.toFixed(2)}`;
    document.getElementById('total-expenses').textContent = `$${data.total_expenses.toFixed(2)}`;

    updateBudgetAllocationChart(data.categories);
    updateExpenseDistributionChart(data.categories);
    updateMonthlyExpensesChart(data.monthly_expenses);
    updateMonthlyTrendsChart(data.daily_expenses);
}

function updateMonthlyTrendsChart(dailyExpenses) {
    const ctx = document.getElementById('monthlyTrendsChart').getContext('2d');
    
    if (trendsChart) {
        trendsChart.destroy();
    }

    trendsChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dailyExpenses.map(item => item.day),
            datasets: [{
                label: 'Daily Expenses',
                data: dailyExpenses.map(item => item.total_expenses),
                backgroundColor: 'rgba(248, 113, 113, 0.2)',
                borderColor: '#f87171',
                borderWidth: 2,
                fill: true
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'Daily Expenses for the Current Month'
                }
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Day'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Amount ($)'
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', fetchDashboardData);

