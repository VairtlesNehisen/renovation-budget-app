document.addEventListener('DOMContentLoaded', function() {
    const API_BASE_URL = 'http://localhost:3000/api/quotes';

    const today = new Date().toISOString().split('T')[0];
    document.getElementById('quoteDate').value = today;
    
    const prices = {
        bathroom: { standard: 1200, premium: 1800, luxo: 2500 },
        baseboard: { standard: 25, premium: 40, luxo: 65 },
        painting: { standard: 25, premium: 35, luxo: 50 },
        kitchen: { standard: 1500, premium: 2200, luxo: 3500 },
        doors: { standard: 450, premium: 650, luxo: 900 },
        lock: { simple: 0, medium: 50, high: 120 },
        floor: { standard: 80, premium: 120, luxo: 180 }
    };

    function setupToggle(toggleId, targetId, callback) {
        const toggle = document.getElementById(toggleId);
        const target = document.getElementById(targetId);
        toggle.addEventListener('change', function() {
            if (this.checked) {
                target.classList.remove('hidden');
            } else {
                target.classList.add('hidden');
            }
            if (callback) callback();
        });
    }

    setupToggle('bathroomToggle', 'bathroomOptions', calculateQuote);
    setupToggle('baseboardToggle', 'baseboardOptions', calculateQuote);
    setupToggle('paintingToggle', 'paintingOptions', calculateQuote);
    setupToggle('kitchenToggle', 'kitchenOptions', calculateQuote);
    setupToggle('doorsToggle', 'doorsOptions', calculateQuote);
    setupToggle('floorToggle', 'floorOptions', calculateQuote);
    
    const inputsToRecalculate = [
        'clientName', 'clientPhone', 'clientEmail', 'quoteDate',
        'totalArea', 'bathroomCount', 'roomCount',
        'bathroomFinish', 'bathroomArea',
        'baseboardFinish', 'baseboardLength', 'baseboardHeight',
        'paintingFinish', 'paintingArea',
        'kitchenFinish', 'kitchenArea',
        'doorsFinish', 'doorsCount', 'doorsLock',
        'floorFinish', 'floorArea', 'floorPattern'
    ];

    inputsToRecalculate.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            if (element.type === 'radio') {
                document.querySelectorAll(`input[name="${element.name}"]`).forEach(radio => {
                    radio.addEventListener('change', calculateQuote);
                });
            } else {
                element.addEventListener('input', calculateQuote);
            }
        }
    });

    document.getElementById('totalArea').addEventListener('input', function() {
        const area = parseFloat(this.value) || 0;
        document.getElementById('baseboardLength').value = (area * 4).toFixed(1);
        document.getElementById('paintingArea').value = (area * 2.5).toFixed(1);
        document.getElementById('floorArea').value = area.toFixed(1);
        calculateQuote();
    });
    
    document.getElementById('roomCount').addEventListener('input', function() {
        const rooms = parseInt(this.value) || 0;
        document.getElementById('doorsCount').value = rooms > 0 ? (rooms + 1) : 0;
        calculateQuote();
    });

    document.getElementById('calculateBtn').addEventListener('click', calculateQuote);
    
    // Funçao do botão imprimir agora só imprime o resumo.
    document.getElementById('printBtn').addEventListener('click', function() {
        window.print();
    });
    
    document.getElementById('saveBtn').addEventListener('click', saveQuote);
    document.getElementById('loadBtn').addEventListener('click', loadQuote);

    calculateQuote(); // Cálculo inicial

    // --- Funções de Cálculo e Formatação ---

    function calculateQuote() {
        const quoteItemsTableBody = document.getElementById('quoteItems');
        quoteItemsTableBody.innerHTML = '';
        
        let total = 0;
        const items = [];

        // Preencher dados do cliente no resumo
        document.getElementById('summaryClientName').textContent = document.getElementById('clientName').value || 'Não informado';
        document.getElementById('summaryClientPhone').textContent = document.getElementById('clientPhone').value || 'Não informado';
        document.getElementById('summaryClientEmail').textContent = document.getElementById('clientEmail').value || 'Não informado';
        const quoteDateInput = document.getElementById('quoteDate').value;
        document.getElementById('summaryQuoteDate').textContent = quoteDateInput ? new Date(quoteDateInput).toLocaleDateString('pt-BR') : 'Não informada';
        
        // Banheiro
        if (document.getElementById('bathroomToggle').checked) {
            const finish = document.getElementById('bathroomFinish').value;
            const area = parseFloat(document.getElementById('bathroomArea').value) || 0;
            const count = parseInt(document.getElementById('bathroomCount').value) || 0;
            const unitPrice = prices.bathroom[finish];
            const description = `Banheiro - ${capitalizeFirstLetter(finish)}`;
            const itemTotal = unitPrice * area * count;
            total += itemTotal;
            items.push({ name: 'Banheiro', description: description, quantity: `${count} un × ${area}m²`, unitPrice: formatCurrency(unitPrice), total: formatCurrency(itemTotal) });
        }
        
        // Rodapé
        if (document.getElementById('baseboardToggle').checked) {
            const finish = document.getElementById('baseboardFinish').value;
            const length = parseFloat(document.getElementById('baseboardLength').value) || 0;
            const height = document.getElementById('baseboardHeight').value;
            const unitPrice = prices.baseboard[finish];
            const description = `Rodapé - ${capitalizeFirstLetter(finish)}`;
            const itemTotal = unitPrice * length;
            total += itemTotal;
            items.push({ name: 'Rodapé', description: `${description} (${height}cm)`, quantity: `${length}m`, unitPrice: formatCurrency(unitPrice), total: formatCurrency(itemTotal) });
        }
        
        // Pintura
        if (document.getElementById('paintingToggle').checked) {
            const finish = document.getElementById('paintingFinish').value;
            const area = parseFloat(document.getElementById('paintingArea').value) || 0;
            const typeRadio = document.querySelector('input[name="paintingType"]:checked');
            const type = typeRadio ? typeRadio.value : 'walls';
            let unitPrice = prices.painting[finish];
            let description = `Pintura - ${capitalizeFirstLetter(finish)}`;
            let typeDesc;
            switch (type) {
                case 'walls': typeDesc = 'Paredes'; break;
                case 'ceiling': typeDesc = 'Teto'; unitPrice *= 0.5; break;
                case 'both': typeDesc = 'Paredes e Teto'; unitPrice *= 1.5; break;
            }
            const itemTotal = unitPrice * area;
            total += itemTotal;
            items.push({ name: 'Pintura', description: `${description} (${typeDesc})`, quantity: `${area}m²`, unitPrice: formatCurrency(unitPrice), total: formatCurrency(itemTotal) });
        }
        
        // Cozinha
        if (document.getElementById('kitchenToggle').checked) {
            const finish = document.getElementById('kitchenFinish').value;
            const area = parseFloat(document.getElementById('kitchenArea').value) || 0;
            const unitPrice = prices.kitchen[finish];
            const description = `Cozinha - ${capitalizeFirstLetter(finish)}`;
            const itemTotal = unitPrice * area;
            total += itemTotal;
            items.push({ name: 'Cozinha', description: description, quantity: `${area}m²`, unitPrice: formatCurrency(unitPrice), total: formatCurrency(itemTotal) });
        }
        
        // Portas Internas
        if (document.getElementById('doorsToggle').checked) {
            const finish = document.getElementById('doorsFinish').value;
            const count = parseInt(document.getElementById('doorsCount').value) || 0;
            const lock = document.getElementById('doorsLock').value;
            let unitPrice = prices.doors[finish];
            let description = `Porta - ${capitalizeFirstLetter(finish)}`;
            const lockDesc = capitalizeFirstLetter(lock);
            unitPrice += prices.lock[lock];
            const itemTotal = unitPrice * count;
            total += itemTotal;
            items.push({ name: 'Portas', description: `${description} (Fechadura ${lockDesc})`, quantity: `${count} un`, unitPrice: formatCurrency(unitPrice), total: formatCurrency(itemTotal) });
        }
        
        // Piso SPC
        if (document.getElementById('floorToggle').checked) {
            const finish = document.getElementById('floorFinish').value;
            const area = parseFloat(document.getElementById('floorArea').value) || 0;
            const pattern = document.getElementById('floorPattern').value;
            const unitPrice = prices.floor[finish];
            const description = `Piso SPC - ${capitalizeFirstLetter(finish)}`;
            const patternDesc = capitalizeFirstLetter(pattern);
            const itemTotal = unitPrice * area;
            total += itemTotal;
            items.push({ name: 'Piso SPC', description: `${description} (${patternDesc})`, quantity: `${area}m²`, unitPrice: formatCurrency(unitPrice), total: formatCurrency(itemTotal) });
        }
        
        if (items.length === 0) {
            quoteItemsTableBody.innerHTML = `<tr><td colspan="5" class="px-6 py-4 text-center text-gray-500">Nenhum item selecionado ainda</td></tr>`;
        } else {
            items.forEach(item => {
                const row = document.createElement('tr');
                row.className = 'hover:bg-gray-50';
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">${item.name}</td>
                    <td class="px-6 py-4">${item.description}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${item.quantity}</td>
                    <td class="px-6 py-4 whitespace-nowrap">${item.unitPrice}</td>
                    <td class="px-6 py-4 whitespace-nowrap font-semibold">${item.total}</td>
                `;
                quoteItemsTableBody.appendChild(row);
            });
        }
        
        document.getElementById('totalQuote').textContent = formatCurrency(total);
    }
    
    function formatCurrency(value) {
        return '€ ' + value.toFixed(2).replace('.', ',').replace(/(\d)(?=(\d{3})+,)/g, '$1.');
    }

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    async function saveQuote() {
        const quoteData = collectQuoteData();
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(quoteData)
            });

            if (response.ok) {
                const result = await response.json();
                alert(`Orçamento salvo com sucesso! ID: ${result.id}`);
                console.log('Orçamento Salvo:', result);
            } else {
                const error = await response.json();
                alert(`Erro ao salvar orçamento: ${error.message}`);
                console.error('Erro ao salvar orçamento:', error);
            }
        } catch (error) {
            alert('Erro de conexão ao salvar orçamento.');
            console.error('Erro de rede ao salvar orçamento:', error);
        }
    }

    async function loadQuote() {
        const quoteId = prompt('Digite o ID do orçamento para carregar:');
        if (!quoteId) return;

        try {
            const response = await fetch(`${API_BASE_URL}/${quoteId}`);
            if (response.ok) {
                const quote = await response.json();
                populateFormWithQuoteData(quote);
                alert(`Orçamento ID ${quoteId} carregado com sucesso!`);
            } else if (response.status === 404) {
                alert(`Orçamento com ID ${quoteId} não encontrado.`);
            } else {
                const error = await response.json();
                alert(`Erro ao carregar orçamento: ${error.message}`);
                console.error('Erro ao carregar orçamento:', error);
            }
        } catch (error) {
            alert('Erro de conexão ao carregar orçamento.');
            console.error('Erro de rede ao carregar orçamento:', error);
        }
    }

    function collectQuoteData() {
        const clientInfo = {
            name: document.getElementById('clientName').value,
            phone: document.getElementById('clientPhone').value,
            email: document.getElementById('clientEmail').value,
            date: document.getElementById('quoteDate').value
        };

        const apartmentMeasures = {
            totalArea: parseFloat(document.getElementById('totalArea').value) || 0,
            bathroomCount: parseInt(document.getElementById('bathroomCount').value) || 0,
            roomCount: parseInt(document.getElementById('roomCount').value) || 0
        };

        const renovationItems = {
            bathroom: {
                enabled: document.getElementById('bathroomToggle').checked,
                finish: document.getElementById('bathroomFinish').value,
                area: parseFloat(document.getElementById('bathroomArea').value) || 0
            },
            baseboard: {
                enabled: document.getElementById('baseboardToggle').checked,
                finish: document.getElementById('baseboardFinish').value,
                length: parseFloat(document.getElementById('baseboardLength').value) || 0,
                height: document.getElementById('baseboardHeight').value
            },
            painting: {
                enabled: document.getElementById('paintingToggle').checked,
                finish: document.getElementById('paintingFinish').value,
                area: parseFloat(document.getElementById('paintingArea').value) || 0,
                type: document.querySelector('input[name="paintingType"]:checked') ? document.querySelector('input[name="paintingType"]:checked').value : 'walls'
            },
            kitchen: {
                enabled: document.getElementById('kitchenToggle').checked,
                finish: document.getElementById('kitchenFinish').value,
                area: parseFloat(document.getElementById('kitchenArea').value) || 0
            },
            doors: {
                enabled: document.getElementById('doorsToggle').checked,
                finish: document.getElementById('doorsFinish').value,
                count: parseInt(document.getElementById('doorsCount').value) || 0,
                lock: document.getElementById('doorsLock').value
            },
            floor: {
                enabled: document.getElementById('floorToggle').checked,
                finish: document.getElementById('floorFinish').value,
                area: parseFloat(document.getElementById('floorArea').value) || 0,
                pattern: document.getElementById('floorPattern').value
            }
        };

        return {
            clientInfo,
            apartmentMeasures,
            renovationItems,
            totalQuote: parseFloat(document.getElementById('totalQuote').textContent.replace('€ ', '').replace('.', '').replace(',', '.')) || 0
        };
    }

    function populateFormWithQuoteData(quote) {
        // Popula informações do cliente
        document.getElementById('clientName').value = quote.client_name || '';
        document.getElementById('clientPhone').value = quote.client_phone || '';
        document.getElementById('clientEmail').value = quote.client_email || '';
        document.getElementById('quoteDate').value = quote.quote_date ? quote.quote_date.split('T')[0] : today;

        // Popula medidas do apartamento
        document.getElementById('totalArea').value = quote.total_area || 0;
        document.getElementById('bathroomCount').value = quote.bathroom_count || 0;
        document.getElementById('roomCount').value = quote.room_count || 0;

        // Popula itens de renovação e seus toggles
        const renovationItems = JSON.parse(quote.renovation_items_json || '{}');

        const itemsConfig = [
            { id: 'bathroom', toggle: 'bathroomToggle', options: 'bathroomOptions', fields: ['finish', 'area'] },
            { id: 'baseboard', toggle: 'baseboardToggle', options: 'baseboardOptions', fields: ['finish', 'length', 'height'] },
            { id: 'painting', toggle: 'paintingToggle', options: 'paintingOptions', fields: ['finish', 'area', 'type'], radioName: 'paintingType' },
            { id: 'kitchen', toggle: 'kitchenToggle', options: 'kitchenOptions', fields: ['finish', 'area'] },
            { id: 'doors', toggle: 'doorsToggle', options: 'doorsOptions', fields: ['finish', 'count', 'lock'] },
            { id: 'floor', toggle: 'floorToggle', options: 'floorOptions', fields: ['finish', 'area', 'pattern'] }
        ];

        itemsConfig.forEach(item => {
            const toggle = document.getElementById(`${item.toggle}`);
            const optionsDiv = document.getElementById(`${item.options}`);
            const itemData = renovationItems[item.id];

            toggle.checked = itemData && itemData.enabled;
            if (toggle.checked) optionsDiv.classList.remove('hidden');
            else optionsDiv.classList.add('hidden');

            if (itemData) {
                item.fields.forEach(field => {
                    if (field === 'type' && item.radioName) { // Special handling for radio buttons
                        const radioValue = itemData[field] || '';
                        const radioElement = document.querySelector(`input[name="${item.radioName}"][value="${radioValue}"]`);
                        if (radioElement) {
                            radioElement.checked = true;
                        }
                    } else {
                        const element = document.getElementById(`${item.id}${capitalizeFirstLetter(field)}`);
                        if (element) {
                            element.value = itemData[field] || '';
                        }
                    }
                });
            }
        });

        calculateQuote();
    }
});