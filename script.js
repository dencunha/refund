const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")

const expenseList = document.querySelector("ul")
const quantityExpense = document.querySelector("aside header p span")
const expenseTotal = document.querySelector("aside header h2")

//Formatando valor do input
amount.oninput = () => {
    let value = amount.value.replace(/\D/g, "")

    value = Number(value) / 100

    amount.value = formatCurrencyBRL(value)
}

function formatCurrencyBRL(value) {
    value = value.toLocaleString("pt-BR", {
        style: "currency",
	    currency: "BRL"
    })

    return value
}

//Evento submit obtem os valores declarados
form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }

    expenseAdd(newExpense)
}

//Montando o novo item da lista de despesas
function expenseAdd(newExpense) {
    try {

        const li = document.createElement("li")
        li.classList.add("expense")

        const img = document.createElement("img")
        img.setAttribute("src", `/assets/${newExpense.category_id}.svg`)
        img.setAttribute("alt", newExpense.category_name)

        const div = document.createElement("div")
        div.classList.add("expense-info")

        const strong = document.createElement("strong")
        strong.textContent = newExpense.expense

        const span = document.createElement("span")
        span.textContent = newExpense.category_name

        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$<small>${newExpense.amount.toUpperCase().replace("R$", "")}`
 
        const removeIcon = document.createElement("img")
        removeIcon.classList.add("remove-icon")
        removeIcon.setAttribute("src", `/assets/remove.svg`)
        removeIcon.setAttribute("alt", "Remover")

        div.append(strong, span)
        li.append(img, div, expenseAmount, removeIcon)
        expenseList.append(li)

        //Limpa o formulário após adicionar um item novo, para adicionar o proximo
        formClean()

        //Atualiza os totais
        updateTotal()
        
    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas")
        console.log(error)
    }
}

function updateTotal() {
    try {

        //Pega os itens li da lista ul, e atualiza na quantidade de itens na lista
        const items = expenseList.children
        quantityExpense.textContent = `${items.length} ${items.length > 1 ? "DESPESAS" : "DESPESA"}`
        
        let total = 0 

        // Percorre cada item da lista
        for (let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")

            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")

            value = parseFloat(value)

            if (isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor não parece ser um número")
            }

            total += Number(value)
        }

        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        expenseTotal.innerHTML = ""
        expenseTotal.append(symbolBRL, total)

    } catch (error) {
        alert("Não foi possível atualizar o total")
        console.log(error)
    }
}

expenseList.addEventListener("click", function (event) {

    //Verifica se o elemento clicado é o ícone de remover
    if (event.target.classList.contains("remove-icon")) {

        //Ontém o li pai do elemento clicado
        const item = event.target.closest(".expense")

        //remove o item da lista
        item.remove()
    }

    updateTotal()
})

function formClean() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}