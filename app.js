class Expense {
  constructor(year, month, day, type, description, amount) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.type = type;
    this.description = description;
    this.amount = amount;
  }
  validateData() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == '' || this[i] == null) {
        return false
      }
    }
    return true
  }
}

class Bd {
  constructor() {
    let id = localStorage.getItem('id');
    if (id === null) {
      localStorage.setItem('id', 0)
    }
  }
  getNextId() {
    let getNextId = localStorage.getItem('id');
    return parseInt(getNextId) + 1
  }
  record(ex) {

    let id = this.getNextId()
    localStorage.setItem(id, JSON.stringify(ex))
    localStorage.setItem('id', id)
  }
  retrieveAllRecords() {
    let id = localStorage.getItem('id')
    let expenses = Array()

    for (let i = 1; i <= id; i++) {
      let expense = JSON.parse(localStorage.getItem(i))

      if (expense === null) {
        continue
      }
      expense.id = i
      expenses.push(expense)
    }
    return expenses
  }

  Search(exp) {
    let expensesFiltered = Array()
    expensesFiltered = this.retrieveAllRecords()

    console.log(expensesFiltered)
    console.log(exp)

    if(exp.year != '') {
      expensesFiltered = expensesFiltered.filter(y => y.year == exp.year)
    }

    if(exp.month != '') {
      expensesFiltered = expensesFiltered.filter(m => m.month == exp.month)
    }

    if(exp.day != '') {
      expensesFiltered = expensesFiltered.filter(d => d.day == exp.month)
    }

    if(exp.type != '') {
      expensesFiltered = expensesFiltered.filter(t => t.type == exp.type)
    }

    if(exp.description != '') {
      expensesFiltered = expensesFiltered.filter(des => des.description == exp.description)
    }

    if(exp.amount != '') {
      expensesFiltered = expensesFiltered.filter(a => a.amount == exp.amount)
    }
    return expensesFiltered
  }

  remove(id) {
    localStorage.removeItem(id)
  }
}

let bd = new Bd()

function handleRegisterExpense() {
  let year = document.getElementById('year');
  let month = document.getElementById('month');
  let day = document.getElementById('day');
  let type = document.getElementById('type');
  let description = document.getElementById('description');
  let amount = document.getElementById('amount');

  let expense = new Expense(
    year.value,
    month.value,
    day.value,
    type.value,
    description.value,
    amount.value)

  if (expense.validateData()) {
    bd.record(expense);
    document.getElementById('modal_long_title').innerHTML = 'Registro inserido com sucesso'
    document.getElementById('modal_title_div').className = 'modal-header text-success'
    document.getElementById('modal_long_body').innerHTML = 'Despesa cadastrada com sucesso!'
    document.getElementById('modal_button').innerHTML = 'Voltar'
    document.getElementById('modal_button').className = 'btn btn-success'

    $('#modalRegisterExpense').modal('show');
    
    year.value = ''
    month.value = ''
    day.value = ''
    type.value = ''
    description.value = ''
    amount.value = ''
  
  } else {

    document.getElementById('modal_long_title').innerHTML = 'Erro de Registro'
    document.getElementById('modal_title_div').className = 'modal-header text-danger'
    document.getElementById('modal_long_body').innerHTML = 'Existem campos obrigatórios que precisam ser preenchidos.'
    document.getElementById('modal_button').innerHTML = 'Voltar e corrigir'
    document.getElementById('modal_button').className = 'btn btn-danger'

    $('#modalRegisterExpense').modal('show');
  }
}

function loadExpenseList(expenses = Array(), filter = false) {

  if(expenses.length == 0 && filter == false) {
    expenses = bd.retrieveAllRecords()
  }
  let expensesList = document.getElementById('expensesList')
  expensesList.innerHTML = ''

  //Percorrer o array despensas, listabdo cada despesas dinamicamente
  expenses.forEach(exl => {
    //Criando linha (tr)
    let line = expensesList.insertRow()

    //Criando as colunas (td)
    line.insertCell(0).innerHTML = `${exl.day}/${exl.month}/${exl.year}`

    //ajustar o tipo
    //usando o parseInt(exl.type) munda o valor de type de string para number
    switch (exl.type) {
      case '1': exl.type = 'Alimentação'
        break
      case '2': exl.type = 'Educação'
        break
      case '3': exl.type = 'Lazer'
        break
      case '4': exl.type = 'Saúde'
        break
      case '5': exl.type = 'Transporte'
        break
    }
    line.insertCell(1).innerHTML = exl.type

    line.insertCell(2).innerHTML = exl.description
    line.insertCell(3).innerHTML = exl.amount

    //adicionando um botão de exclusão
    let btn = document.createElement("button")
    btn.className = 'btn btn-danger'
    btn.innerHTML = '<i class="fas fa-times"></i>'
    btn.id = `id_expense_${exl.id}`
    btn.onclick = function() {
      let id = this.id.replace('id_expense_', '' )
      bd.remove(id)
      window.location.reload()
    }
    line.insertCell(4).append(btn)
    console.log(exl)
  })
}
function searchExpense() {
  let year = document.getElementById('year').value;
  let month = document.getElementById('month').value;
  let day = document.getElementById('day').value;
  let type = document.getElementById('type').value;
  let description = document.getElementById('description').value;
  let amount = document.getElementById('amount').value;

  let expense = new Expense(year, month, day, type, description, amount)
  let expenses = bd.Search(expense)
  
  loadExpenseList(expenses, true)
}