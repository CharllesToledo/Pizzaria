let cart = [];
let modalQt = 1;
let modalKey = 0;

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

//Listagem das pizzas
pizzaJson.map((item, index) => {
  //Nessa linha, o que o código está fazendo, é clonar a estrutura html, e percorrer cada linha dela, pelo index. 
  let pizzaItem = c('.models .pizza-item').cloneNode(true);
  //Preencher as informações em pizzaItem, puxando-as do array "pizzaJson".
  
  pizzaItem.setAttribute('data-key', index);
  pizzaItem.querySelector('.pizza-item--img img').src = item.img;
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name; 
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

  pizzaItem.querySelector('a').addEventListener('click', (e) =>{
    e.preventDefault();
    let key = e.target.closest('.pizza-item').getAttribute('data-key');
    modalQt = 1;
    modalKey = key;

    c('.pizzaBig img').src= pizzaJson[key].img;
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
    c('.pizzaInfo--actualPrice').innerHTML =`R$ ${pizzaJson[key].price.toFixed(2)}` ;
    c('.pizzaInfo--size.selected').classList.remove('selected');
    cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
      if(sizeIndex == 2) {
        size.classList.add('selected');
      }
      size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
    });

    c('.pizzaInfo--qt').innerHTML = modalQt;


    c('.pizzaWindowArea').style.opacity = 0;
    c('.pizzaWindowArea').style.display = 'flex';
    setTimeout(()=>{
      c('.pizzaWindowArea').style.opacity = 1;
    }, 200);

  });

  c('.pizza-area').append( pizzaItem );
}); 

//Eventos do MODAL
function closeModal() {
  c('.pizzaWindowArea').style.opacity = 0;
  setTimeout(()=> {
    c('.pizzaWindowArea').style.display = 'none';
  }, 500);
}

cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item)=> {
  item.addEventListener('click', closeModal)
});

//Aqui escolhemos a quantidade de pizzas a serem adicionadas no carrinho. 
c('.pizzaInfo--qtmenos').addEventListener('click', ()=>{
  if(modalQt > 1){
    modalQt--; //Se a quantidade for maior que 1, podemos diminuir a quantidade
    c('.pizzaInfo--qt').innerHTML = modalQt;
  }
});

c('.pizzaInfo--qtmais').addEventListener('click', ()=>{
  modalQt++; //Aqui é adicionado mais quantidade de pizzas.
  c('.pizzaInfo--qt').innerHTML = modalQt;

}); 

cs('.pizzaInfo--size').forEach((size, sizeIndex)=>{
  size.addEventListener('click', (e)=> {
    c('.pizzaInfo--size.selected').classList.remove('selected'); //Essa linha desmarca os outros;
    size.classList.add('selected');//Essa linha seleciona o que foi clicado;
  });
});

c('.pizzaInfo--addButton').addEventListener('click', ()=>{
  //Qual o tamanho selecionado? 
  let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));
  //Cria um identificador que terá o id e tamanho a pizza,para comparar se ja há alguma pizza igual no carrinho.
  let identifier = pizzaJson[modalKey].id + '@' + size;
  //Se já houver um identificador igual ao próximo no carrinho, ira ser retornado o índice do mesmo, caso contrário sera retornado -1.
  let key = cart.findIndex((item) => item.identifier == identifier);
  //Se o key !-1 sigifica que ja tem um identifier igual no carrinho, entao sera somada a quantidade que ja está no carrinho com a quantidade nova selecionada. Caso contrário irá ser criado um novo item no array.
  if(key > -1) {
    cart[key].qt += modalQt;
  } else{
      cart.push({
        identifier,
        id:pizzaJson[modalKey].id,
        size,
        qt:modalQt
      });
  }
  updateCart();
  closeModal();
});

//Aqui abre o carrinho na versão mobile, mudando a pisição do left, que estava 100vw, e ao clicar é mudado para 0;
c('.menu-openner').addEventListener('click', ()=> {
  if(cart.length > 0) { //Só abre o carrinho se tiver algum item dentro dele.
    c('aside').style.left = '0';
  }
});

c('.menu-closer').addEventListener('click', ()=> {
  c('aside').style.left = '100vw';
});

function updateCart() {
    c('.menu-openner span').innerHTML = cart.length; //Mostra a quantidade de itens no carrinho na versão mobile. 

    if(cart.length > 0) {
      c('aside').classList.add('show');
      c('.cart').innerHTML = '';

      let subTotal = 0;
      let desconto = 0;
      let total = 0;

      for(let i in cart) {

        //Aqui é onde é clonada a estrutura Html para preencher as informações no carrinho.
        let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
        subTotal += pizzaItem.price * cart[i].qt; //Calcula o valor x qtd das pizzas. 
        let cartItem = c('.models .cart--item').cloneNode(true);

        //Aqui fazemos um switch para o indice do tamanho das pizzas, e assim conseguimos renomea-los para o tamanho junto com o peso. 
        let pizzaSizeName; 
        switch(cart[i].size) {
          case 0:
            pizzaSizeName = "P 100g";
            break; 
          case 1:
            pizzaSizeName = "M 530g";
            break;
          case 2:
            pizzaSizeName = "G 860g";
            break;        
        }
        //Aqui concatenamos o nome da piza com o tamanho e peso extraídos do switch case. 
        let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

        //Aqui são preenchidas as informações do carrinho. 
        cartItem.querySelector('img').src = pizzaItem.img; //Imagem da pizza.
        cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName; //Nome da pizza.
        cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt; //Quantidade de pizzas.
        cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
          if(cart[i].qt > 1){ //Se tiver mais de uma pizza é possível diminuir.
            cart[i].qt--;
          } else {
            cart.splice(i, 1); //Se tiver uma pizza, e for pressionado o menos, entao vai tirar a pizza do carrinho. 
          }
          updateCart(); //Atualiza o carrinho.

        });
        cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
          cart[i].qt++; //Adiciona mais uma quantidade no carrinho. 
          updateCart();//Atualiza o carrinho.
        });

        c('.cart').append(cartItem);
      }

      desconto = subTotal * 0.1;
      total = subTotal - desconto;

      //Escreve os valores na tela no carrinho. 
      c('.subtotal span:last-child').innerHTML = `R$ ${subTotal.toFixed(2)}`;
      c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
      c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
 
    } else { //Se todas as pizzas forem removidas do carrinho, o mesmo será fechado.
      c('aside').classList.remove('show');//Na versão desktop é removida a classe show.
      c('aside').style.left = '100vw';//No mobile o carrinho é "escondido" totalmente ao lado.
    }
}

//aula 13