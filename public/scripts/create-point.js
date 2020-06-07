function populateUFs() {
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then( 
        //res => res.json()
        function retornoPromise(respostaPromise){
            return respostaPromise.json();
        }
    )
    .then( 
        //states => { ... for ... }
        function retorno(resposta){
            let states = resposta;

            for( const state of states ) {
                ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
            }
        }
    )

}

populateUFs()


function getCities(event) {

    const citySelect = document.querySelector("select[name=city]") 
    //Esse é o select das cidades

    const stateInput = document.querySelector("input[name=state]") 
    //Esse é o input hidden
    
    const ufValue = event.target.value
    //event.target é o nosso select de estado
    //event.target.value pega o valor da option que foi selecionada pelo select de estado
        //Exemplo, selecionar MG vai retornar um event.target.value de ID do estado MG

    const indexOfSelectedState = event.target.selectedIndex
    //event.target é o nosso select de estado
    //event.target.selectedIndex é a posição de cada estado dentro do select uf
        //Exemplo, como o primeiro é Rondônia, o index é 1

    stateInput.value = event.target.options[indexOfSelectedState].text
    //Definiu o valor do input hidden como sendo o texto do option selecionado

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    //Define uma variável em que o texto é uma url da api do IBGE
    //ufValue passa o código do estado para pegar os municipios desse estado

    citySelect.innerHTML = "<option value>Seleciona a Cidade</option>"
    citySelect.disabled = true
    // As duas linhas acima são para corrigir o problema de o campo de cidade acumular as seleções de estado
    // Antes ao selecionar mais de um estado o campo cidade não era resetado, agora sim. 
    // Na primeira linha definimos que a option começa com valor vazio
    // Na segunda linha nós bloqueamos o campo cidade para ele ser habilitado apenas com uma nova seleção

    fetch(url)
    .then( res => res.json() ) 
    //Outras formas de escrever esse mesmo código que esta la no populateuf
    .then( cities => {

        // Código pra zerar todo os options dentro do select com name city

        for( const city of cities) {
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }

        citySelect.disabled = false
    } )

}




document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities) 


// itens de coleta
// precisamos adicionar em cada li um 
// escutador de evento que verificará se houve algum clique

const itemsToCollect = document.querySelectorAll(".items-grid li")
// Selecionamos aqui todos os li

for (const item of itemsToCollect) {
    item.addEventListener("click", handleSelectedItem)
}
// loop que passará por todos os li com o escutador de evento
// handleSelectedItem é o nome que demos para a função que 
// descreve esse evento do clique

const collectedItems = document.querySelector("input[name=items]")

let selectedItems = []
// variável que começa uma coleção vazia usada abaixo para 
// puxar os dados dos eventos. É um tipo de array

function handleSelectedItem(event) {
    // recebe o evento que foi gerado do clique (captura do evento)
    const itemLi = event.target
    itemLi.classList.toggle("selected")
    // aqui vamos na lista de classes do elemento e vemos se tem a classe selected
    // o toggle verificará se existe e então adiciona ou remove essa classe 
    // a partir do evento do clique, definido na variavel acima com o event.target
    // até agr é apenas visual os eventos, precisamos puxar esses dados 
    //para que possam ser usados no background dps

    const itemId = event.target.dataset.id
    // puxa o id de cada li que foi definido no hmtl como data-id

    const alreadySelected = selectedItems.findIndex( function(item){
        const itemFound = item == itemId // verifica se é true ou false
        return itemFound
    })
    // verifica se existem itens selecionados, se sim pega eles

    if (alreadySelected >= 0) {
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferent = item != itemId
            return itemIsDifferent
        })

        selectedItems = filteredItems //atualiza la em cima o selectedItems
    } 
    // se já estiver selecionado, tira da seleção

    else {
        selectedItems.push(itemId)
    }
    // se não estiver selecionado, adiciona à seleção

    collectedItems.value = selectedItems
    // atualiza o campo hidden no html com os itens selecionados
    
}
