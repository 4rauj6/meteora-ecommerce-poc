const openNavbarOnMobile = document.querySelector('.open-navbar-button');
const navbarLinks = document.querySelector('.sidebar-links');
const searchBox = document.querySelector('.search-box-container');
const icon = document.querySelector('.open-navbar-button i');

if (openNavbarOnMobile && icon && navbarLinks) {
    openNavbarOnMobile.addEventListener('click', function () {
        navbarLinks.classList.toggle('active');
        searchBox.classList.toggle('active');

        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-xmark');
    });
}
(function(){
            function buildColorAndSizeControls() {
                // defaults
                const colors = [
                    {label:'Azul claro', value:'azul', color:'#a58dfb'},
                    {label:'Offwhite', value:'offwhite', color:'#eee'},
                    {label:'Preto', value:'preto', color:'#000'}
                ];
                const sizes = ['P','PP','M','G','GG'];

                const colorsContainer = document.querySelector('#modal-colors div');
                colorsContainer.innerHTML = '';
                colors.forEach((c,i)=>{
                    const id = 'modal-color-'+i;
                    const radio = document.createElement('input'); radio.type='radio'; radio.name='modal-color'; radio.id=id; radio.value=c.value; if(i===0) radio.checked=true;
                    radio.style.marginRight = '6px';
                    const label = document.createElement('label'); label.setAttribute('for', id);
                    label.style.marginRight = '12px';
                    label.style.display = 'inline-flex';
                    label.style.alignItems = 'center';
                    label.innerHTML = '<span style="display:inline-block;width:14px;height:14px;background:'+c.color+';border-radius:50%;margin-right:8px;border:1px solid #ccc;vertical-align:middle;"></span>' + c.label;
                    colorsContainer.appendChild(radio);
                    colorsContainer.appendChild(label);
                });

                const sizesContainer = document.querySelector('#modal-sizes div');
                sizesContainer.innerHTML = '';
                sizes.forEach((s,i)=>{
                    const id = 'modal-size-'+i;
                    const radio = document.createElement('input'); radio.type='radio'; radio.name='modal-size'; radio.id=id; radio.value=s; if(i===0) radio.checked=true;
                    radio.style.marginRight = '6px';
                    const label = document.createElement('label'); label.setAttribute('for', id);
                    label.style.marginRight = '12px';
                    label.innerText = s;
                    sizesContainer.appendChild(radio);
                    sizesContainer.appendChild(label);
                });
            }

            document.querySelectorAll('.ver-mais').forEach(btn=>{
                btn.addEventListener('click', function (e) {
                    const card = this.closest('.card2-1');
                    if (!card) return;
                    const imgEl = card.querySelector('img');
                    const titleEl = card.querySelector('h3');
                    const descEl = card.querySelector('p');
                    // price is second h3 inside the card2-1 blocks in the current markup
                    const priceEl = Array.from(card.querySelectorAll('h3'))[1] || null;

                    const imgSrc = imgEl ? imgEl.getAttribute('src') : '';
                    const title = titleEl ? titleEl.innerText : '';
                    const desc = descEl ? descEl.innerText : '';
                    const price = priceEl ? priceEl.innerText : '';

                    document.getElementById('modal-image').src = imgSrc;
                    document.getElementById('modal-title').innerText = title;
                    document.getElementById('modal-desc').innerText = desc;
                    document.getElementById('modal-price').innerText = price;

                    buildColorAndSizeControls();

                    const modalEl = document.getElementById('productModal');
                    const bsModal = new bootstrap.Modal(modalEl);
                    bsModal.show();
                });
            });

            // opcional: ação do botão "Adicionar à sacola"
            document.getElementById('add-to-bag').addEventListener('click', function(){
                const modalEl = document.getElementById('productModal');
                bootstrap.Modal.getInstance(modalEl).hide();
            });
        })();

        (function () {
            const STORAGE_KEY = 'meteora_sacola_v1';

            function formatPriceBR(priceStr){
                // tenta extrair número do formato "R$ 150,00" ou "R$150,00"
                const num = Number(String(priceStr).replace(/[^\d,.-]/g,'').replace(',','.'));
                if (isNaN(num)) return priceStr;
                return 'R$' + num.toFixed(2).replace('.',',');
            }

            function loadBag(){
                try {
                    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
                } catch(e){ return []; }
            }
            function saveBag(items){
                localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
                renderBagCount();
            }

            function renderBagCount(){
                const countEl = document.getElementById('bag-count');
                const items = loadBag();
                countEl.innerText = items.length;
            }

            function renderBagOffcanvas(){
                const list = document.getElementById('bag-items-list');
                const totalEl = document.getElementById('bag-total');
                const items = loadBag();
                list.innerHTML = '';
                let total = 0;
                items.forEach((it, idx) => {
                    const el = document.createElement('div');
                    el.className = 'list-group-item d-flex align-items-center';
                    el.innerHTML = '<img src="'+it.image+'" style="width:56px;height:56px;object-fit:cover;border-radius:6px;margin-right:12px" alt=""><div style="flex:1"><strong>'+it.title+'</strong><div class="text-muted">'+(it.price||'')+'</div></div><button class="btn btn-sm btn-outline-danger ms-2 remove-item" data-idx="'+idx+'">Remover</button>';
                    list.appendChild(el);
                    // soma preço se possível
                    const num = Number(String(it.price||'').replace(/[^\d,.-]/g,'').replace(',','.'));
                    if (!isNaN(num)) total += num;
                });
                totalEl.innerText = total ? 'R$' + total.toFixed(2).replace('.',',') : 'R$0,00';

                // remove item handlers
                list.querySelectorAll('.remove-item').forEach(btn => {
                    btn.addEventListener('click', function(){
                        const idx = Number(this.getAttribute('data-idx'));
                        const items = loadBag();
                        items.splice(idx,1);
                        saveBag(items);
                        renderBagOffcanvas();
                    });
                });
            }

            // inicialização
            document.addEventListener('DOMContentLoaded', function(){
                renderBagCount();

                // se existir botão de adicionar que foi inserido no modal, usa o id add-to-bag
                const addBtn = document.getElementById('add-to-bag');
                if (addBtn){
                    addBtn.addEventListener('click', function(){
                        const title = (document.getElementById('modal-title')?.innerText || '').trim();
                        const price = (document.getElementById('modal-price')?.innerText || '').trim();
                        const image = (document.getElementById('modal-image')?.getAttribute('src') || '');
                        if (!title) return;
                        const items = loadBag();
                        items.push({
                            id: Date.now(),
                            title: title,
                            price: price,
                            image: image
                        });
                        saveBag(items);
                        // fecha modal se estiver aberto
                        const modalEl = document.getElementById('productModal');
                        const modalInstance = bootstrap.Modal.getInstance(modalEl);
                        if (modalInstance) modalInstance.hide();
                        // abre o offcanvas para confirmar visualmente
                        const offcanvasEl = document.getElementById('bagOffcanvas');
                        const off = new bootstrap.Offcanvas(offcanvasEl);
                        renderBagOffcanvas();
                        off.show();
                    });
                }

                // ao abrir offcanvas, renderiza lista atual
                const bagOffEl = document.getElementById('bagOffcanvas');
                bagOffEl.addEventListener('show.bs.offcanvas', renderBagOffcanvas);

                // esvaziar sacola
                document.getElementById('bag-clear').addEventListener('click', function(){
                    if (!confirm('Esvaziar a sacola?')) return;
                    saveBag([]);
                    renderBagOffcanvas();
                });

                // botão checkout (simulação)
                document.getElementById('bag-checkout').addEventListener('click', function(){
                    alert('Simulação de checkout. Itens: ' + loadBag().length);
                });
            });
        })();
